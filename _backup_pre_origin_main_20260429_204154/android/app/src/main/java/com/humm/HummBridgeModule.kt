package com.humm

import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * React Native bridge giving JS access to the overlay / accessibility
 * pipeline.  Exposed as `NativeModules.HummBridge`.
 */
class HummBridgeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "HummBridge"

  /**
   * Required by RN 0.73+ NativeEventEmitter – without these stubs
   * the emitter will throw a yellow-box warning.
   */
  @ReactMethod
  fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
    // No-op: events are emitted from HummOverlayService, not here
  }

  @ReactMethod
  fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
    // No-op
  }

  /* ------------------------------------------------------------------ */
  /*  Permission checks                                                 */
  /* ------------------------------------------------------------------ */

  @ReactMethod
  fun checkOverlayPermission(promise: Promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      promise.resolve(Settings.canDrawOverlays(reactContext))
    } else {
      promise.resolve(true) // pre-M doesn't need runtime check
    }
  }

  @ReactMethod
  fun checkAccessibilityPermission(promise: Promise) {
    promise.resolve(isAccessibilityServiceEnabled())
  }

  @ReactMethod
  fun checkAllPermissions(promise: Promise) {
    val overlay = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
      Settings.canDrawOverlays(reactContext) else true
    val accessibility = isAccessibilityServiceEnabled()
    val map = com.facebook.react.bridge.Arguments.createMap().apply {
      putBoolean("overlay", overlay)
      putBoolean("accessibility", accessibility)
      putBoolean("allGranted", overlay && accessibility)
    }
    promise.resolve(map)
  }

  /* ------------------------------------------------------------------ */
  /*  Open system settings                                              */
  /* ------------------------------------------------------------------ */

  @ReactMethod
  fun openOverlaySettings() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${reactContext.packageName}")
      ).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactContext.startActivity(intent)
    }
  }

  @ReactMethod
  fun openAccessibilitySettings() {
    val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    reactContext.startActivity(intent)
  }

  /* ------------------------------------------------------------------ */
  /*  Text injection                                                    */
  /* ------------------------------------------------------------------ */

  @ReactMethod
  fun injectText(text: String, promise: Promise) {
    val service = HummAccessibilityService.instance
    if (service == null) {
      promise.reject("NO_SERVICE", "Accessibility service is not running")
      return
    }
    val success = service.injectText(text)
    if (success) {
      promise.resolve(true)
    } else {
      promise.reject("INJECT_FAILED", "Could not inject text into the active field")
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Overlay control (manual show/hide from JS)                        */
  /* ------------------------------------------------------------------ */

  @ReactMethod
  fun showOverlay() {
    val intent = Intent(reactContext, HummOverlayService::class.java).apply {
      action = HummOverlayService.ACTION_SHOW
    }
    reactContext.startService(intent)
  }

  @ReactMethod
  fun hideOverlay() {
    val intent = Intent(reactContext, HummOverlayService::class.java).apply {
      action = HummOverlayService.ACTION_HIDE
    }
    reactContext.startService(intent)
  }

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */

  private fun isAccessibilityServiceEnabled(): Boolean {
    val am = reactContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
    val enabledServices = am.getEnabledAccessibilityServiceList(
      AccessibilityServiceInfo.FEEDBACK_ALL_MASK
    )
    val packageName = reactContext.packageName
    val serviceClassName = HummAccessibilityService::class.java.name
    return enabledServices.any { info ->
      val si = info.resolveInfo?.serviceInfo ?: return@any false
      si.packageName == packageName && si.name == serviceClassName
    }
  }
}
