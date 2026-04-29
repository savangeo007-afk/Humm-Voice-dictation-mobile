package com.humm

import kotlin.math.abs

import android.animation.ValueAnimator
import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.view.animation.OvershootInterpolator
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.core.content.ContextCompat
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Foreground-capable service that manages a floating pill overlay using
 * [WindowManager].  The pill has two visual states:
 *
 *  • **Collapsed** – single Humm logo button.
 *  • **Expanded** – three buttons: cancel (X), microphone, confirm (✓).
 *
 * Touch events are consumed by the overlay; the pill is draggable in the
 * collapsed state.
 */
class HummOverlayService : Service() {

  companion object {
    private const val TAG = "HummOverlay"
    const val ACTION_SHOW = "com.humm.overlay.SHOW"
    const val ACTION_HIDE = "com.humm.overlay.HIDE"
    private const val EVENT_RETRY_DELAY_MS = 250L
    private const val EVENT_MAX_RETRIES = 3
  }

  private var windowManager: WindowManager? = null
  private var pillView: View? = null
  private var layoutParams: WindowManager.LayoutParams? = null
  private var isShowing = false
  private var isExpanded = false
  private val mainHandler = Handler(Looper.getMainLooper())

  /* ------------------------------------------------------------------ */
  /*  Service lifecycle                                                 */
  /* ------------------------------------------------------------------ */

  override fun onCreate() {
    super.onCreate()
    windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_SHOW -> showPill()
      ACTION_HIDE -> hidePill()
    }
    return START_STICKY
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onDestroy() {
    removePillView()
    super.onDestroy()
  }

  /* ------------------------------------------------------------------ */
  /*  Show / hide                                                       */
  /* ------------------------------------------------------------------ */

  private fun showPill() {
    if (isShowing) return

    val inflater = LayoutInflater.from(this)
    pillView = inflater.inflate(R.layout.floating_pill, null)

    val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
    else
      @Suppress("DEPRECATION")
      WindowManager.LayoutParams.TYPE_PHONE

    layoutParams = WindowManager.LayoutParams(
      WindowManager.LayoutParams.WRAP_CONTENT,
      WindowManager.LayoutParams.WRAP_CONTENT,
      type,
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
      PixelFormat.TRANSLUCENT
    ).apply {
      gravity = Gravity.TOP or Gravity.START
      x = 40
      y = 400
    }

    try {
      windowManager?.addView(pillView, layoutParams)
      isShowing = true
      isExpanded = false
      setupTouchListeners()
    } catch (e: Exception) {
      Log.e(TAG, "Failed to add overlay", e)
    }
  }

  private fun hidePill() {
    collapse()
    removePillView()
  }

  private fun removePillView() {
    try {
      pillView?.let { windowManager?.removeView(it) }
    } catch (_: Exception) {}
    pillView = null
    isShowing = false
    isExpanded = false
  }

  /* ------------------------------------------------------------------ */
  /*  Touch / drag handling                                             */
  /* ------------------------------------------------------------------ */

  private var initialX = 0
  private var initialY = 0
  private var initialTouchX = 0f
  private var initialTouchY = 0f
  private var wasDragged = false

  private fun setupTouchListeners() {
    val root = pillView ?: return
    val btnLogo = root.findViewById<ImageView>(R.id.btn_logo)
    val expandedRow = root.findViewById<LinearLayout>(R.id.expanded_row)
    val btnCancel = root.findViewById<ImageView>(R.id.btn_cancel)
    val btnMic = root.findViewById<ImageView>(R.id.btn_mic)
    val btnConfirm = root.findViewById<ImageView>(R.id.btn_confirm)

    // --- Logo: drag + tap-to-expand ---
    btnLogo.setOnTouchListener { _, event ->
      when (event.action) {
        MotionEvent.ACTION_DOWN -> {
          initialX = layoutParams?.x ?: 0
          initialY = layoutParams?.y ?: 0
          initialTouchX = event.rawX
          initialTouchY = event.rawY
          wasDragged = false
          true
        }
        MotionEvent.ACTION_MOVE -> {
          val dx = (event.rawX - initialTouchX).toInt()
          val dy = (event.rawY - initialTouchY).toInt()
          if (abs(dx) > 10 || abs(dy) > 10) {
            wasDragged = true
            layoutParams?.x = initialX + dx
            layoutParams?.y = initialY + dy
            try { windowManager?.updateViewLayout(pillView, layoutParams) } catch (_: Exception) {}
          }
          true
        }
        MotionEvent.ACTION_UP -> {
          if (!wasDragged) {
            expand()
          }
          true
        }
        else -> false
      }
    }

    // --- Cancel button ---
    btnCancel.setOnClickListener {
      emitEvent("onDictationCancel")
      stopService(Intent(this, DictationForegroundService::class.java))
      collapse()
    }

    // --- Mic button ---
    btnMic.setOnClickListener {
      ContextCompat.startForegroundService(
        this,
        Intent(this, DictationForegroundService::class.java)
      )
      emitEvent("onDictationStart")
      // Visual feedback: pulse the mic button
      animatePulse(btnMic)
    }

    // --- Confirm button ---
    btnConfirm.setOnClickListener {
      stopPulse()
      emitEvent("onDictationConfirm")
      stopService(Intent(this, DictationForegroundService::class.java))
      collapse()
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Expand / collapse animation                                       */
  /* ------------------------------------------------------------------ */

  private fun expand() {
    if (isExpanded) return
    val root = pillView ?: return
    val btnLogo = root.findViewById<ImageView>(R.id.btn_logo)
    val expandedRow = root.findViewById<LinearLayout>(R.id.expanded_row)

    // Cross-fade: hide logo, show row
    btnLogo.animate().alpha(0f).setDuration(150).withEndAction {
      btnLogo.visibility = View.GONE
    }.start()

    expandedRow.visibility = View.VISIBLE
    expandedRow.alpha = 0f
    expandedRow.scaleX = 0.6f
    expandedRow.scaleY = 0.6f
    expandedRow.animate()
      .alpha(1f)
      .scaleX(1f)
      .scaleY(1f)
      .setDuration(250)
      .setInterpolator(OvershootInterpolator(1.2f))
      .start()

    isExpanded = true
    try { windowManager?.updateViewLayout(pillView, layoutParams) } catch (_: Exception) {}
  }

  private fun collapse() {
    if (!isExpanded) return
    val root = pillView ?: return
    val btnLogo = root.findViewById<ImageView>(R.id.btn_logo)
    val expandedRow = root.findViewById<LinearLayout>(R.id.expanded_row)

    // Stop any running mic pulse first
    stopPulse()

    expandedRow.animate().alpha(0f).scaleX(0.6f).scaleY(0.6f).setDuration(150).withEndAction {
      expandedRow.visibility = View.GONE
    }.start()

    btnLogo.visibility = View.VISIBLE
    btnLogo.alpha = 0f
    btnLogo.animate().alpha(1f).setDuration(200).start()

    isExpanded = false
    try { windowManager?.updateViewLayout(pillView, layoutParams) } catch (_: Exception) {}
  }

  /* ------------------------------------------------------------------ */
  /*  Button animations                                                 */
  /* ------------------------------------------------------------------ */

  private fun animatePulse(view: View) {
    val animator = ValueAnimator.ofFloat(1f, 1.3f, 1f).apply {
      duration = 400
      repeatCount = ValueAnimator.INFINITE
      addUpdateListener {
        val scale = it.animatedValue as Float
        view.scaleX = scale
        view.scaleY = scale
      }
    }
    view.tag = animator
    animator.start()
  }

  fun stopPulse() {
    val root = pillView ?: return
    val btnMic = root.findViewById<ImageView>(R.id.btn_mic) ?: return
    val animator = btnMic.tag as? ValueAnimator
    animator?.cancel()
    btnMic.scaleX = 1f
    btnMic.scaleY = 1f
  }

  /* ------------------------------------------------------------------ */
  /*  React Native event bridge                                         */
  /* ------------------------------------------------------------------ */

  private fun emitEvent(eventName: String, attempt: Int = 0) {
    try {
      val reactApp = applicationContext as? ReactApplication ?: return
      val reactInstanceManager = reactApp.reactNativeHost.reactInstanceManager
      val reactContext = reactInstanceManager.currentReactContext

      if (reactContext == null) {
        if (attempt == 0) {
          reactInstanceManager.createReactContextInBackground()
        }
        if (attempt < EVENT_MAX_RETRIES) {
          mainHandler.postDelayed(
            { emitEvent(eventName, attempt + 1) },
            EVENT_RETRY_DELAY_MS,
          )
        } else {
          Log.w(TAG, "Dropping event '$eventName' after retries: React context unavailable")
        }
        return
      }

      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, Arguments.createMap())
    } catch (e: Exception) {
      Log.e(TAG, "Failed to emit event: $eventName", e)
    }
  }
}
