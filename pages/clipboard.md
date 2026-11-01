# Clipboard

The clipboard, for plain text. Compose's clipboard takes another type on each platform; `PantrixClipboard` puts a text there the same way on every platform and says whether it got there.

## Features

- **Copying.** `rememberPantrixClipboard()` gives the clipboard; `copyText(text, label)` puts the text there and returns `true` if it got there. The `label` is carried on Android alone.
- **The clipboard's traits.** `ClipboardTraits` says what the clipboard is like: whether it can be written (`writable`), whether the system shows what was copied itself (`announcedBySystem`). A web page that is not secure and a JVM with no display have no clipboard; Android 13 and later show what was copied themselves and ask the app not to say it again.
- **In a test.** `LocalClipboardTraits` gives the clipboard's traits: a test or a preview gives another platform's.

## Examples

### Copying a text

Copying a text. The button puts the IBAN on the clipboard and writes the outcome on the card's "Last event" line. Where the system shows what was copied itself (Android 13 and later) the app says nothing: announcing a success twice is noise. The line above describes this platform's clipboard (`currentClipboardTraits()`).

```kotlin
import androidx.compose.runtime.rememberCoroutineScope
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.PantrixClipboard
import com.pantrixui.foundation.platform.currentClipboardTraits
import com.pantrixui.foundation.platform.rememberPantrixClipboard
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val clipboard: PantrixClipboard = rememberPantrixClipboard()
val traits = currentClipboardTraits()
PantrixText(
    text = "Writable: ${if (traits.writable) "yes" else "no"} · " +
        "announced by the system: ${if (traits.announcedBySystem) "yes" else "no"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
PantrixButton(
    text = "Copy the IBAN",
    onClick = {
        scope.launch {
            val copied = clipboard.copyText(IBAN, label = "IBAN")
            if (!copied || !clipboard.traits.announcedBySystem) {
                report(if (copied) "IBAN copied" else "The IBAN could not be copied")
            }
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "copy_iban"
)

private const val IBAN = "TR33 0006 1005 1978 6457 8413 26"
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A clipboard that cannot be written

A clipboard that cannot be written: the inner section gave `LocalClipboardTraits` a `ClipboardTraits(writable = false)`, as on a web page that is not secure. Press the code block's copy button: the block says it could not copy, and shows no success.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.foundation.platform.ClipboardTraits
import com.pantrixui.foundation.platform.LocalClipboardTraits

CompositionLocalProvider(LocalClipboardTraits provides ClipboardTraits(writable = false)) {
    PantrixCodeBlock(code = "./gradlew :app:webApp:wasmJsBrowserDistribution", language = "Shell", tagKey = "no_board")
}
```

## API

### PantrixClipboard

`import com.pantrixui.foundation.platform.PantrixClipboard`, from `com.pantrixui:foundation`

```kotlin
class PantrixClipboard
```

The clipboard, for plain text.

Compose's own clipboard, `LocalClipboard`, takes what is put on it in each platform's own type: a `ClipData` on Android, a `Transferable` on the desktop, and a form of Compose's own on iOS and in a browser. There is no common way to copy a text, so this is one: it builds what the platform takes, puts it there, and says whether it got there.

```kotlin
val clipboard = rememberPantrixClipboard()
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.copy_link),
    onClick = {
        scope.launch {
            val copied = clipboard.copyText(link, label = linkLabel)
            // A system that shows the copy itself is not echoed.
            if (!copied || !clipboard.traits.announcedBySystem) snackbars?.show(if (copied) done else failed)
        }
    }
)
```

Parameters:

- `traits: ClipboardTraits`: What this platform's clipboard is like: whether it can be written to, and whether the system shows a copy itself.

Members:

- `suspend fun copyText(text: String, label: String = ""): Boolean`: Puts `text` on the clipboard as plain text, in place of what was there.

  `text`: what is copied.

  `label`: what the text is, in the app's language: `"Link"`, `"Code"`. Android alone carries it, and may show it in the system's own preview of the copy.

  Returns whether the text was put on the clipboard. False where there is no clipboard to write to, and where the platform refused the write, as a browser does whose reader has not allowed it.

### rememberPantrixClipboard

`import com.pantrixui.foundation.platform.rememberPantrixClipboard`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixClipboard(): PantrixClipboard
```

The clipboard for plain text, on the platform's own: what `LocalClipboard` gives, with the traits of `LocalClipboardTraits`.

### ClipboardTraits

`import com.pantrixui.foundation.platform.ClipboardTraits`, from `com.pantrixui:foundation`

```kotlin
data class ClipboardTraits(
    val writable: Boolean = true,
    val announcedBySystem: Boolean = false
)
```

What a platform's clipboard is like, for whoever copies to it: a copy button asks before it says anything.

Parameters:

- `writable: Boolean`: Whether there is a clipboard to write to. A web page that is not served in a secure context, over plain http from anywhere but the machine itself, has none: the browser gives such a page no clipboard. Nor has a JVM that runs without a display. Compose skips a write to either without an error.
- `announcedBySystem: Boolean`: Whether the system itself shows what was put on the clipboard. Android does from version 13 on, and asks an app not to say it a second time.

### currentClipboardTraits

`import com.pantrixui.foundation.platform.currentClipboardTraits`, from `com.pantrixui:foundation`

```kotlin
fun currentClipboardTraits(): ClipboardTraits
```

This platform's clipboard as it is when asked: a browser's depends on how its page was served.

### LocalClipboardTraits

`import com.pantrixui.foundation.platform.LocalClipboardTraits`, from `com.pantrixui:foundation`

```kotlin
val LocalClipboardTraits: ProvidableCompositionLocal<ClipboardTraits>
```

The traits a `PantrixClipboard` goes by. The platform's own unless others are given: a test gives another platform's here, as it gives a clipboard of its own through `LocalClipboard`.
