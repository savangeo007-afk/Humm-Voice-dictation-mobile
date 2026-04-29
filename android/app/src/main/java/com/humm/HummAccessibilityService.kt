package com.humm

import android.accessibilityservice.AccessibilityService
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Accessibility service that monitors focus events across the OS.
 *
 * When the user taps into an editable text field in **any** app the service
 * tells [HummOverlayService] to show the floating pill.  It also caches the
 * [AccessibilityNodeInfo] of the focused field so we can inject text later
 * via [ACTION_SET_TEXT].
 */
class HummAccessibilityService : AccessibilityService() {

  companion object {
    private const val TAG = "HummA11y"
    /** Static singleton so that the bridge module can reach us. */
    var instance: HummAccessibilityService? = null
      private set
  }

  /** The node that was last focused (if editable). */
  private var activeNode: AccessibilityNodeInfo? = null

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                         */
  /* ------------------------------------------------------------------ */

  override fun onServiceConnected() {
    super.onServiceConnected()
    instance = this
    Log.d(TAG, "Accessibility service connected")
  }

  override fun onDestroy() {
    instance = null
    activeNode?.recycle()
    activeNode = null
    super.onDestroy()
  }

  /* ------------------------------------------------------------------ */
  /*  Event handling                                                    */
  /* ------------------------------------------------------------------ */

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event == null) return

    when (event.eventType) {
      AccessibilityEvent.TYPE_VIEW_FOCUSED,
      AccessibilityEvent.TYPE_VIEW_CLICKED,
      AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> {
        val source = event.source ?: return
        if (isEditableTextField(source)) {
          activeNode?.recycle()
          activeNode = AccessibilityNodeInfo.obtain(source)
          showOverlay()
        } else if (event.eventType != AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED) {
          clearActiveNode()
          hideOverlay()
        }
      }
      AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
        // Do not aggressively hide on every window transition; many apps
        // dispatch this while input is still active. Keep the cached node
        // unless we definitively lose input focus.
      }
    }
  }

  override fun onInterrupt() {
    Log.w(TAG, "Accessibility service interrupted")
  }

  /* ------------------------------------------------------------------ */
  /*  Public API – called by bridge module                              */
  /* ------------------------------------------------------------------ */

  /**
   * Inject [text] into the currently focused editable field using paste
   * semantics first, then a set-text merge fallback.
   */
  fun injectText(text: String): Boolean {
    val node = resolveTargetNode() ?: return false
    return try {
      node.performAction(AccessibilityNodeInfo.ACTION_FOCUS)

      val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
      clipboard.setPrimaryClip(ClipData.newPlainText("Humm transcription", text))
      if (node.performAction(AccessibilityNodeInfo.ACTION_PASTE)) {
        return true
      }

      val existingText = node.text?.toString().orEmpty()
      val start = node.textSelectionStart
      val end = node.textSelectionEnd
      val mergedText = if (start >= 0 && end >= 0) {
        val safeStart = start.coerceIn(0, existingText.length)
        val safeEnd = end.coerceIn(0, existingText.length)
        val rangeStart = minOf(safeStart, safeEnd)
        val rangeEnd = maxOf(safeStart, safeEnd)
        existingText.replaceRange(rangeStart, rangeEnd, text)
      } else {
        existingText + text
      }

      val args = Bundle().apply {
        putCharSequence(
          AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
          mergedText
        )
      }
      val setTextSuccess = node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
      if (!setTextSuccess) {
        Log.w(TAG, "ACTION_SET_TEXT returned false")
      }
      setTextSuccess
    } catch (e: Exception) {
      Log.e(TAG, "Failed to inject text", e)
      false
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Private helpers                                                   */
  /* ------------------------------------------------------------------ */

  private fun isEditableTextField(node: AccessibilityNodeInfo): Boolean {
    if (node.isEditable) return true
    val className = node.className?.toString() ?: return false
    return className == "android.widget.EditText" ||
           className.contains("EditText", ignoreCase = true)
  }

  private fun resolveTargetNode(): AccessibilityNodeInfo? {
    val cachedNode = activeNode
    if (cachedNode != null && isEditableTextField(cachedNode)) {
      return cachedNode
    }

    val focusedNode = rootInActiveWindow?.findFocus(AccessibilityNodeInfo.FOCUS_INPUT)
    if (focusedNode != null && isEditableTextField(focusedNode)) {
      activeNode?.recycle()
      activeNode = AccessibilityNodeInfo.obtain(focusedNode)
      focusedNode.recycle()
      return activeNode
    }

    val discovered = findFirstEditable(rootInActiveWindow)
    if (discovered != null) {
      activeNode?.recycle()
      activeNode = AccessibilityNodeInfo.obtain(discovered)
      discovered.recycle()
      return activeNode
    }

    return null
  }

  private fun findFirstEditable(node: AccessibilityNodeInfo?): AccessibilityNodeInfo? {
    if (node == null) return null
    if (isEditableTextField(node)) {
      return AccessibilityNodeInfo.obtain(node)
    }

    val childCount = node.childCount
    for (index in 0 until childCount) {
      val child = node.getChild(index) ?: continue
      val found = findFirstEditable(child)
      child.recycle()
      if (found != null) return found
    }

    return null
  }

  private fun clearActiveNode() {
    activeNode?.recycle()
    activeNode = null
  }

  private fun showOverlay() {
    val intent = Intent(this, HummOverlayService::class.java).apply {
      action = HummOverlayService.ACTION_SHOW
    }
    startService(intent)
  }

  private fun hideOverlay() {
    val intent = Intent(this, HummOverlayService::class.java).apply {
      action = HummOverlayService.ACTION_HIDE
    }
    startService(intent)
  }
}
