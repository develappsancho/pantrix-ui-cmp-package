# Keyboard shortcuts

Keyboard shortcuts: a key and what is held with it. With Command on Apple's systems and with Ctrl on the others: `⌘S` and `Ctrl+S` are the same shortcut.

## Features

- **Shortcut.** `PantrixShortcut(Key.S, command = true)` says the key and what is held; `writtenOn(system)` gives it as that system writes it (`⌥⇧⌘K`, `Ctrl+Alt+Shift+K`), `keysOn(system)` key by key.
- **Listening.** `Modifier.onShortcut(shortcut) { … }` listens for the shortcut while the focus is on the element or inside it, before the control inside.
- **The focus's root.** `Modifier.shortcutRoot()` holds the focus itself while nothing in it does: a screen's shortcuts are heard without a field being pressed.
- **System.** `currentOperatingSystem()` says the system; `LocalOperatingSystem` gives another system in a preview or a test.

## Examples

### A screen's shortcut

A shortcut: the box listens for the save shortcut with `onShortcut`, and with `shortcutRoot` holds the focus itself while no field in it does. Press the box once, then press the shortcut: the count goes up. It is heard while typing in the field too, before the field. On a phone it works with a keyboard attached.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.keyboard.onShortcut
import com.pantrixui.foundation.keyboard.shortcutRoot
import com.pantrixui.foundation.platform.LocalOperatingSystem
import com.pantrixui.foundation.theme.PantrixTheme

var saved by remember { mutableIntStateOf(0) }
Column(
    modifier = Modifier
        .widthIn(max = 400.dp)
        .border(1.dp, PantrixTheme.colors.divider, PantrixTheme.shapes.md)
        .shortcutRoot()
        .onShortcut(SAVE) { saved++ }
        .padding(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixText(text = "To save, ${SAVE.writtenOn(LocalOperatingSystem.current)}")
    PantrixTextField(
        state = rememberTextFieldState(),
        modifier = Modifier.fillMaxWidth(),
        label = "Note",
        tagKey = "shortcut_note"
    )
    PantrixText(
        text = "Saved: $saved times",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "saved_count"
    )
}

private val SAVE = PantrixShortcut(Key.S, command = true)
```

### On another system

The same shortcut on three systems. Each line gives another system with `LocalOperatingSystem` and writes the shortcut as that system writes it: with symbols on Apple's systems, with names on the others. The top line is this device's system (`currentOperatingSystem()`).

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.platform.LocalOperatingSystem
import com.pantrixui.foundation.platform.OperatingSystem
import com.pantrixui.foundation.platform.currentOperatingSystem
import com.pantrixui.foundation.theme.PantrixTheme

PantrixText(text = "This device: ${currentOperatingSystem().name} · ${SEARCH.writtenOn(currentOperatingSystem())}")
listOf(OperatingSystem.MacOs, OperatingSystem.Windows, OperatingSystem.Linux).forEach { system ->
    CompositionLocalProvider(LocalOperatingSystem provides system) {
        val keys = SEARCH.keysOn(LocalOperatingSystem.current)
        PantrixText(
            text = "${system.name}: ${keys.joinToString(" ")}",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}

private val SEARCH = PantrixShortcut(Key.F, command = true, shift = true)
```

## API

### PantrixShortcut

`import com.pantrixui.foundation.keyboard.PantrixShortcut`, from `com.pantrixui:foundation`

```kotlin
class PantrixShortcut(
    public val key: Key,
    public val command: Boolean = false,
    public val shift: Boolean = false,
    public val alt: Boolean = false
)
```

A key and the modifiers held with it: what runs a command from the keyboard, `⌘K` on a Mac and `Ctrl+K` elsewhere.

`command` is the key a system's shortcuts lead with: Command on Apple's systems and Control on the others, so one shortcut is written once for every platform. A shortcut is pressed when its key goes down with its modifiers held and no others: `⌘K` is not pressed by `⇧⌘K`, nor by `⌃K` on a Mac.

```kotlin
val search = PantrixShortcut(Key.K, command = true)
search.writtenOn(OperatingSystem.MacOs) // "⌘K"
search.writtenOn(OperatingSystem.Windows) // "Ctrl+K"
```

The letters, the digits, the arrows, the function keys, Enter, Escape, Tab, Space, Backspace, Delete, Home, End, the page keys and the common marks have names of their own. Another key is written by its number.

Parameters:

- `key: Key`: the key that is pressed.
- `command: Boolean`: whether Command, on Apple's systems, or Control, on the others, is held.
- `shift: Boolean`: whether Shift is held.
- `alt: Boolean`: whether Option, on Apple's systems, or Alt, on the others, is held.

Members:

- `fun isPressedBy(event: KeyEvent, system: OperatingSystem): Boolean`: Whether `event` presses this shortcut on `system`: its key going down, with its modifiers held and no others.
- `fun keysOn(system: OperatingSystem): List<String>`: The keys of this shortcut as `system` writes them, one to a keycap, in its order: Option, Shift, Command and the key on Apple's systems (`⌥`, `⇧`, `⌘`, `K`), Control, Alt, Shift and the key on the others.
- `fun writtenOn(system: OperatingSystem): String`: This shortcut written out on `system`: `⌥⇧⌘K` on Apple's systems, `Ctrl+Alt+Shift+K` on the others.

### Modifier.onShortcut

`import com.pantrixui.foundation.keyboard.onShortcut`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.onShortcut(
    shortcut: PantrixShortcut,
    enabled: Boolean = true,
    onTrigger: () -> Unit
): Modifier
```

Runs `onTrigger` when `shortcut` is pressed while the focus is on this node or inside it, before the control that has the focus is given the key: a field that has the focus does not type the letter of a shortcut it ran.

A key is given only to the control that has the focus and to the nodes around it. For a shortcut of the whole window, put this on the window's root with `shortcutRoot`, which holds the focus while nothing else does: without it a shortcut is not heard until something has been focused.

```kotlin
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { palette = true }) { … }
```

Of two shortcuts one key presses, the outer one runs. The key going up after a shortcut ran is kept from the focused control too, so that a button pressed by Enter does not take it for a press of its own. While the theme's diagnostics are on, a shortcut that a node around this one hears as well is reported as `PantrixCheck.ShadowedShortcut`: it never runs here.

Parameters:

- `shortcut: PantrixShortcut`: the key and the modifiers that run it.
- `enabled: Boolean`: whether it runs: one that is not lets its key through.
- `onTrigger: () -> Unit`: what it runs.

### Modifier.shortcutRoot

`import com.pantrixui.foundation.keyboard.shortcutRoot`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.shortcutRoot(): Modifier
```

Makes this node hold the focus while nothing inside it does, so that the shortcuts on it and around it are given the keys pressed then.

A key is given to the control that has the focus and to the nodes around that control. While nothing has the focus, at first, before anything has been focused, and after the focus has been cleared, it is given to none of them, and a shortcut on a window's root is not heard. This node takes the focus at those times, and gives it to whatever asks for it. It draws nothing, says nothing to a screen reader and is no stop for Tab: Tab from it goes into what it holds.

Put it once on a window's root, with the window's shortcuts (`onShortcut`). A modal of Pantrix's is a window of its own over this one, and the focus under it stays where it was while it is open. Where two roots stand side by side in one window, as two screens do for a moment while one gives way to the other, the one that has the focus keeps it.

### LocalOperatingSystem

`import com.pantrixui.foundation.platform.LocalOperatingSystem`, from `com.pantrixui:foundation`

```kotlin
val LocalOperatingSystem: ProvidableCompositionLocal<OperatingSystem>
```

The operating system a composition is typed on: `currentOperatingSystem`, unless a test or a preview provides another. It decides what the keyboard's shortcuts lead with, Command or Control, and how they are written.

### OperatingSystem

`import com.pantrixui.foundation.platform.OperatingSystem`, from `com.pantrixui:foundation`

```kotlin
enum class OperatingSystem
```

An operating system, as `currentOperatingSystem` reports it. It settles what the platform's geometry does not, such as whether a shortcut leads with Command or with Control.

Entries:

- `Android`: Android, on a phone, a tablet or a foldable.
- `Ios`: iOS and iPadOS.
- `MacOs`: macOS, where the Command key leads keyboard shortcuts.
- `Windows`: Windows, where the Control key leads keyboard shortcuts.
- `Linux`: Linux, ChromeOS, and any system not listed here.

Members:

- `isApple: Boolean`: Whether the system is one of Apple's, where the Command key leads keyboard shortcuts.

### currentOperatingSystem

`import com.pantrixui.foundation.platform.currentOperatingSystem`, from `com.pantrixui:foundation`

```kotlin
fun currentOperatingSystem(): OperatingSystem
```

The operating system the code is running on; in a browser, the one the browser runs on.

Not a theme default like `currentPlatformType`: a preview of iOS geometry on a desktop still runs on the desktop's system, and is typed on the desktop's keyboard.
