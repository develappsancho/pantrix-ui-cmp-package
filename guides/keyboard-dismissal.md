# Putting the Keyboard Away

This document explains why, in Compose Multiplatform, a field's software keyboard cannot be put away on an iPhone, what the library gives for it, and how it is tested. The problem is not Pantrix's own: it shows the same way on **every** Compose Multiplatform screen with a field of several lines or a field of numbers. Section 3 gives the fix with Pantrix's API, and section 4 without the library, in a form any project can copy.

Section 7 says which of what is said here was seen on a device, which was read in the sources of Compose Multiplatform 1.12.2, and which was not checked.

## 1. The Problem

### What is seen

*   A comment, a note, a message: a field of several lines is tapped, the keyboard opens, and the user types.
*   On an iPhone the key at the keyboard's bottom right starts a new line. There is no key that puts the keyboard away, and a tap outside the field does not put it away either: the keyboard goes on covering half the screen, and the "Send" button under it cannot be reached.
*   The number pad is the same: it has neither an action key nor a key that closes it.
*   On Android the system's back gesture closes the keyboard; a tap outside still does not. On a desktop and on the web a click on empty room does not take the focus from the field, though a user expects it from a browser.
*   No unit test shows it: the keyboard is the system's, and is not drawn in the test's scene. Maestro's `hideKeyboard` cannot put the keyboard away from a Compose field on iOS either.

### Why

In a native iOS app it is the screen that puts the keyboard away, not the field: a tap ends the view's editing (`endEditing`), or a scroll takes the keyboard down (`keyboardDismissMode`). In Compose the keyboard stays open with the focused text field, and closes when the focus is let go. But Compose does not let the focus go by itself on a tap outside a field: a tap that nothing takes goes nowhere.

## 2. The Fix

A listener for taps is put on the screen's root, under everything it shows. On a tap that **nothing under it takes**, the listener clears the focus (`FocusManager.clearFocus()`): the text field gives its focus up, and the keyboard goes with it.

"Nothing under it takes" matters. Compose gives a tap to the innermost node first, and a button or a text field takes the press. The listener at the root starts only on a press that was not taken: a button does its work and a press in a text field moves its caret, and neither lets the focus go. A drag that scrolls is no tap: what scrolls takes it, and the listener gives up.

## 3. With Pantrix

The library gives one modifier (`com.pantrixui.foundation.keyboard`):

```kotlin
public fun Modifier.clearFocusOnTap(): Modifier
```

It goes on the screen's root, or the app's:

```kotlin
Column(Modifier.fillMaxSize().clearFocusOnTap()) {
    PantrixTextArea(state = comment, label = stringResource(Res.string.comment))
    PantrixButton(text = stringResource(Res.string.send), onClick = ::send)
}
```

It works the same on every platform: on iOS it is the way the keyboard is put away, on Android it adds a way beside the back gesture, and on a desktop and on the web it makes a click on empty room let the focus go, as a browser does. The documentation of `PantrixTextArea` and `PantrixFilledTextArea` names it, and the demo app puts it on the scaffold at its root.

## 4. Without Pantrix

A modifier node, with `pointerInput` and `LocalFocusManager`.

### 4.1. Common Code (`commonMain`)

```kotlin
fun Modifier.clearFocusOnTap(): Modifier = this then ClearFocusOnTapElement

private data object ClearFocusOnTapElement : ModifierNodeElement<ClearFocusOnTapNode>() {
    override fun create() = ClearFocusOnTapNode()

    override fun update(node: ClearFocusOnTapNode) = Unit
}

private class ClearFocusOnTapNode :
    DelegatingNode(),
    CompositionLocalConsumerModifierNode {
    init {
        delegate(
            SuspendingPointerInputModifierNode {
                detectTapGestures(onTap = { currentValueOf(LocalFocusManager).clearFocus() })
            }
        )
    }
}
```

`detectTapGestures`: `androidx.compose.foundation.gestures`; `SuspendingPointerInputModifierNode`: `androidx.compose.ui.input.pointer`; `DelegatingNode`, `ModifierNodeElement`, `CompositionLocalConsumerModifierNode` and `currentValueOf`: `androidx.compose.ui.node`.

### 4.2. Inside a Composable

A project that would rather not write a node can do the same inside a composable:

```kotlin
val focusManager = LocalFocusManager.current
Column(
    Modifier
        .fillMaxSize()
        .pointerInput(focusManager) { detectTapGestures(onTap = { focusManager.clearFocus() }) }
) {
    // the screen's content
}
```

## 5. What the Helper Does Not Do

*   **It does not take the keyboard down on a scroll.** iOS's `keyboardDismissMode` has no counterpart here; a scroll leaves the focus where it is.
*   **It does not put a "Done" bar above the keyboard.** That is native iOS's other way (`inputAccessoryView`); Compose's `PlatformImeOptions` takes it too. It was not tried here.
*   **It does not hear the taps of a layer with a window of its own.** Compose's `Popup` and `Dialog` are drawn in a window of their own and do not pass their taps to the screen's root: where one holds a field, the modifier goes on the layer's content too.
*   **It does not take the focus back from a button that takes it.** On a desktop and on the web a pressed button can take the focus itself; the field then gives its focus to the button. That is the button's doing, not the modifier's.

## 6. Testing

*   **Unit test:** `ClearFocusOnTapTest` (`commonTest`, on five targets): a tap on empty room takes the field's focus away; a tap in the field (by a finger and by a mouse) keeps the focus in the field; a button that takes no focus does its work and keeps the focus where it was; a drag that scrolls keeps the focus.
*   **Maestro:** on iOS `hideKeyboard` cannot put the keyboard away from a Compose field. On a screen whose root has `clearFocusOnTap()`, a step that taps empty room (`tapOn` a text, or a point) does the same.

That the keyboard really goes is only seen on a device or a simulator.

## 7. Verification

### What was seen

*   iPhone 18 Pro Max simulator, iOS 27.0 (2026-10-26), the demo app's text area page: the bottom-right key of the keyboard of a field of several lines started a new line, and the keyboard had no key that put it away. A tap on the description's text closed the keyboard and the field let its focus go; a tap in the field again opened the keyboard.
*   Android emulator, Pixel 7 Pro, API 33 (2026-10-26), the demo app's text area page: a tap on the description's text closed the keyboard (`dumpsys input_method`: `mInputShown=false`); a tap in the field opened it, a second tap kept it open and moved the caret.
*   Web (Chrome, Wasm, 2026-10-26): a click on empty room outside a focused field brought the field's border back to rest; a click in the field kept the focus.

### What was read in the sources

*   `detectTapGestures` waits for the first press with `awaitFirstDown()`, and does not count a press that was taken: `foundation` 1.12.2, `commonMain/androidx/compose/foundation/gestures/TapGestureDetector.kt`.
*   A text field's taps go through `detectTapAndPress`, which takes the press (`awaitFirstDown().also { it.consume() }`): the same file; on the text field's side, `TextFieldSelectionState.defaultDetectTextFieldTapGestures`. Android's counterpart calls the same default (`foundation-android` 1.12.1, `TextFieldSelectionState.android.kt`).

### What was not checked

*   **An iPad**, and an iPhone with a hardware keyboard.
*   **A real device**, and older versions of iOS.
*   **The web in a phone's browser.**

## 8. Where It Is in This Repository

| What | Where |
| :--- | :--- |
| The modifier | `ui/foundation/src/commonMain/kotlin/com/pantrixui/foundation/keyboard/ClearFocusOnTap.kt` |
| Tests | `ClearFocusOnTapTest` (`commonTest`) |
| Who uses it | The demo app's root (`app/shared/.../demo/App.kt`); `PantrixTextArea` and `PantrixFilledTextArea` in their documentation |
| Demo | "A tap outside puts the keyboard away" on the `Text Area` page |
