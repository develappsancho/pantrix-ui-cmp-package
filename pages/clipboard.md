# Clipboard

The clipboard, for plain text. Compose's clipboard takes and gives another type on each platform; `PantrixClipboard` puts a text there the same way on every platform, says whether it got there, and reads the text on the clipboard.

## Features

- **Copying.** `rememberPantrixClipboard()` gives the clipboard; `copyText(text, label)` puts the text there and returns `true` if it got there. The `label` is carried on Android alone.
- **Reading.** `readText()` gives the plain text on the clipboard, or `null` where there is none. iOS asks before it reads what another app copied, and a browser asks before each read.
- **Hearing a paste.** `Modifier.onPaste` hears ⌘V or Ctrl+V while the focus is inside the node, unless a text field inside takes the paste itself. On the web it hears the browser's own paste: the browser hands over the text without asking.
- **The clipboard's traits.** `ClipboardTraits` says what the clipboard is like: whether it can be written (`writable`), whether it can be read (`readable`), whether the system shows what was copied itself (`announcedBySystem`). A web page that is not secure and a JVM with no display have no clipboard; Android 13 and later show what was copied themselves and ask the app not to say it again.
- **In a test.** `LocalClipboardTraits` gives the clipboard's traits: a test or a preview gives another platform's.
- **Sending to another app.** `rememberShareSheet()` gives the platform's share sheet: Android's chooser, iOS's `UIActivityViewController`, a browser's `navigator.share`. On the desktop and in a browser without `navigator.share` it gives `null`, and the screen offers to copy instead. `share(text, title)` says what came of it as a `ShareResult`. `LocalShareSheet` gives a test or a preview another sheet, or none.

## Examples

### Copying a text

Copying a text. The button puts the IBAN on the clipboard and writes the outcome on the card's "Last event" line. Where the system shows what was copied itself (Android 13 and later) the app says nothing: announcing a success twice is noise. The line above describes this platform's clipboard (`currentClipboardTraits()`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
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

### Pasting from the clipboard

Pasting from the clipboard. The button reads the text on the clipboard (`readText()`): it finds the IBAN copied in the example above. The card below hears a paste (`Modifier.onPaste`): press the card, then ⌘V or Ctrl+V; on the web the browser hands over the text without asking. Both write what they read on the card's "Last event" line.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.onPaste
import com.pantrixui.foundation.platform.rememberPantrixClipboard
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val clipboard = rememberPantrixClipboard()
val zone = remember { FocusRequester() }
var pasted by remember { mutableStateOf<String?>(null) }
PantrixText(
    text = "Readable: ${if (clipboard.traits.readable) "yes" else "no"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
PantrixButton(
    text = "Read the clipboard",
    onClick = {
        scope.launch {
            val text = clipboard.readText()
            report(if (text == null) "No text on the clipboard" else "On the clipboard: ${text.take(SHOWN)}")
        }
    },
    variant = ButtonVariant.Outline,
    enabled = clipboard.traits.readable,
    tagKey = "read_clipboard"
)
PantrixCard(
    modifier = Modifier
        .onPaste { text ->
            pasted = text
            report("Pasted: ${text.take(SHOWN)}")
        }
        .focusRequester(zone),
    variant = CardVariant.Outlined,
    onClick = { zone.requestFocus() },
    tagKey = "paste_zone"
) {
    PantrixText(text = pasted?.let { "Pasted here: ${it.take(SHOWN)}" } ?: "Press, then ⌘V or Ctrl+V")
}

private const val SHOWN = 40
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A clipboard that cannot be written

A clipboard that cannot be written: the inner section gave `LocalClipboardTraits` a `ClipboardTraits(writable = false)`, as on a web page that is not secure. Press the code block's copy button: the block says it could not copy, and shows no success.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.foundation.platform.ClipboardTraits
import com.pantrixui.foundation.platform.LocalClipboardTraits

CompositionLocalProvider(LocalClipboardTraits provides ClipboardTraits(writable = false)) {
    PantrixCodeBlock(code = "./gradlew :app:webApp:wasmJsBrowserDistribution", language = "Shell", tagKey = "no_board")
}
```

### Sending to another app

Sending to another app: the button hands the link to the platform's share sheet, and writes what came of it on the card's "Last event" line. Android's chooser does not say what was chosen: it says "opened", never "sent". The desktop has no sheet, and there the button copies the link. Turn the switch on: the section inside gives `LocalShareSheet` none, as on a platform without one.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.platform.LocalShareSheet
import com.pantrixui.foundation.platform.ShareResult
import com.pantrixui.foundation.platform.ShareSheet
import com.pantrixui.foundation.platform.rememberPantrixClipboard
import com.pantrixui.foundation.platform.rememberShareSheet
import kotlinx.coroutines.launch

var none by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = none,
    onCheckedChange = { none = it },
    label = "As a platform without a sheet",
    tagKey = "no_sheet"
)
if (none) {
    CompositionLocalProvider(LocalShareSheet provides null) { ShareOrCopy() }
} else {
    ShareOrCopy()
}

@Composable
private fun ShareOrCopy() {
    val report = LocalExampleEvents.current
    val sheet: ShareSheet? = rememberShareSheet()
    val clipboard = rememberPantrixClipboard()
    val scope = rememberCoroutineScope()
    if (sheet != null) {
        PantrixButton(
            text = "Send with another app",
            onClick = {
                sheet.share(LINK, title = "Order 4821") { result ->
                    report(
                        when (result) {
                            ShareResult.Shared -> "Sent"
                            ShareResult.Cancelled -> "The sheet was closed"
                            ShareResult.Started -> "The share sheet opened"
                            ShareResult.Failed -> "The sheet could not be shown"
                        }
                    )
                }
            },
            tagKey = "send_link"
        )
    } else {
        PantrixButton(
            text = "Copy the link",
            onClick = { scope.launch { report(if (clipboard.copyText(LINK)) "Copied" else "Not copied") } },
            variant = ButtonVariant.Outline,
            tagKey = "copy_link"
        )
    }
}

private const val LINK = "https://formatico.pantrixui.com/s/2f9"
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

## API

### PantrixClipboard

`import com.pantrixui.foundation.platform.PantrixClipboard`, from `com.pantrixui:foundation`

```kotlin
class PantrixClipboard
```

The clipboard, for plain text.

Compose's own clipboard, `LocalClipboard`, takes what is put on it in each platform's own type: a `ClipData` on Android, a `Transferable` on the desktop, and a form of Compose's own on iOS and in a browser, and gives back what is on it in the same. There is no common way to copy a text, nor to read one, so this is one: it builds what the platform takes, puts it there, and says whether it got there, and it reads the text out of what the platform gives.

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

- `traits: ClipboardTraits`: What this platform's clipboard is like: whether it can be written to and read from, and whether the system shows a copy itself.

Members:

- `suspend fun copyText(text: String, label: String = ""): Boolean`: Puts `text` on the clipboard as plain text, in place of what was there.

  `text`: what is copied.

  `label`: what the text is, in the app's language: `"Link"`, `"Code"`. Android alone carries it, and may show it in the system's own preview of the copy.

  Returns whether the text was put on the clipboard. False where there is no clipboard to write to, and where the platform refused the write, as a browser does whose reader has not allowed it.
- `suspend fun readText(): String?`: The plain text on the clipboard, for a button that pastes it.

  A platform may ask its reader first. iOS asks whether the app may paste what another app copied. A browser asks once for the page, as Chrome does, or shows a button of its own to press, as Safari does, and answers only while the page has the reader's attention, just after a press. The reader's own paste, Cmd+V or Ctrl+V, is heard with its text and no question by `onPaste`.

  Returns the text, or null where the clipboard holds no text, where there is no clipboard to read from, and where the platform or the reader refused the read.

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
    val announcedBySystem: Boolean = false,
    val readable: Boolean = true
)
```

What a platform's clipboard is like, for whoever copies to it or reads from it: a copy button asks before it says anything, and a paste button before it is shown.

Parameters:

- `writable: Boolean`: Whether there is a clipboard to write to. A web page that is not served in a secure context, over plain http from anywhere but the machine itself, has none: the browser gives such a page no clipboard. Nor has a JVM that runs without a display. Compose skips a write to either without an error.
- `announcedBySystem: Boolean`: Whether the system itself shows what was put on the clipboard. Android does from version 13 on, and asks an app not to say it a second time.
- `readable: Boolean`: Whether there is a clipboard to read from. A browser lets a page read it only in a secure context, and only where it has `navigator.clipboard.read`, which Firefox has from version 127 on. A JVM that runs without a display has none.

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

### Modifier.onPaste

`import com.pantrixui.foundation.platform.onPaste`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.onPaste(
    enabled: Boolean = true,
    onPaste: (String) -> Unit
): Modifier
```

Runs `onPaste` with the text the reader pastes, by Cmd+V on Apple's systems and by Ctrl+V on the others, while the focus is on this node or inside it, unless a text field there pastes it into itself.

On the web a paste comes without a key too, from the browser's menu and from the one under a right click. Such a paste is heard by the innermost node the focus is inside of, and, while a window's root (`com.pantrixui.foundation.keyboard.shortcutRoot`) holds the focus itself with nothing inside it holding it, by the outermost node under that root.

A screen that opens what is pasted, a document or a link, hears the paste this way. On the web the browser hands a page the clipboard's text with its paste and asks its reader nothing, where a read of the clipboard (`PantrixClipboard.readText`) is asked about first: this node hears the browser's paste, after the key or alone. A shortcut of Cmd+V (`com.pantrixui.foundation.keyboard.onShortcut`) would keep the browser from pasting at all, and so the paste is heard here and not as a shortcut. On the other platforms it reads the clipboard as the key goes down, as a field does.

Of two nodes around the focus that hear a paste, the inner one has it. For a paste anywhere in a window, put it on the window's root with `com.pantrixui.foundation.keyboard.shortcutRoot`, which holds the focus while nothing else does:

```kotlin
Box(Modifier.shortcutRoot().onPaste { text -> open(text) }) { … }
```

Parameters:

- `enabled: Boolean`: whether it hears a paste: one that does not leaves the key to whatever else hears it.
- `onPaste: (String) -> Unit`: called with the pasted text. It is not called where the clipboard holds no text.

### ShareSheet

`import com.pantrixui.foundation.platform.ShareSheet`, from `com.pantrixui:foundation`

```kotlin
fun interface ShareSheet
```

The platform's own sheet for sending a text to another app: a message, a mail, a note, a chat. A link is sent as its text, and every app the sheet lists takes it so.

`rememberShareSheet` gives the platform's: Android's chooser (`Intent.ACTION_SEND`), iOS's `UIActivityViewController`, which an iPad shows in a popover over the middle of the window, and a browser's `navigator.share`. The desktop has none, and nor has a browser without `navigator.share`, as Firefox on a desktop: a screen there offers to copy the text instead, with `PantrixClipboard`.

```kotlin
val sheet = rememberShareSheet()
if (sheet != null) {
    PantrixButton(
        text = stringResource(Res.string.send_with_another_app),
        onClick = { sheet.share(link, title = documentName) { result -> show(result) } }
    )
}
```

A test, or a preview, gives one of its own through `LocalShareSheet`:

```kotlin
val sheet = ShareSheet { text, _, onResult -> sent += text; onResult(ShareResult.Shared) }
```

Members:

- `fun share(text: String, title: String?, onResult: (ShareResult) -> Unit)`: Shows the sheet with `text`, and `title` where the platform has a place for one: the subject of a mail, the heading of Android's chooser, a browser's title. `onResult` is called once, on the main thread, with what became of it. A browser's sheet is called from a reader's press, as its file picker is: a browser refuses a sheet no press asked for.

### rememberShareSheet

`import com.pantrixui.foundation.platform.rememberShareSheet`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberShareSheet(): ShareSheet?
```

The platform's own sheet for sending a text to another app, or null where it has none: see `ShareSheet`. Where `LocalShareSheet` gives a sheet, it is that one.

### ShareResult

`import com.pantrixui.foundation.platform.ShareResult`, from `com.pantrixui:foundation`

```kotlin
enum class ShareResult
```

What became of a text given to `ShareSheet.share`.

Entries:

- `Shared`: The reader chose where to send it, and that app took it: what iOS and a browser say.
- `Cancelled`: The reader closed the sheet without choosing anything: nothing was sent.
- `Started`: The sheet was shown, and the platform says no more: Android hands it to the system's chooser, which does not tell the app what its reader chose.
- `Failed`: The sheet could not be shown: a browser refuses one that no press of the reader asked for, and a platform may refuse what it was given.

### LocalShareSheet

`import com.pantrixui.foundation.platform.LocalShareSheet`, from `com.pantrixui:foundation`

```kotlin
val LocalShareSheet: ProvidableCompositionLocal<ShareSheet?>
```

The sheet `rememberShareSheet` gives: the platform's own by default, or null where it has none, on the desktop and in a browser without `navigator.share`. A test or a preview gives another in its place, or null for a platform without one.
