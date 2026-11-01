# Command Palette

Every command of the app in one place, found by its name and run from the keyboard: the panel Cmd+K or Ctrl+K opens. In this demo too, Cmd+K (on a Mac) or Ctrl+K opens, on every page, a palette that lists all the pages.

- `PantrixCommandPalette` (`com.pantrixui.components.overlay.commandpalette`, `com.pantrixui:components`): Every command of the app in a modal panel at the top of the window, found by name as it is typed and run from the keyboard, with their groups and their shortcuts. Keywords: command menu, spotlight, launcher, cmd+k, ctrl+k, quick open.

## Features

- **A modal panel.** As a dialog is: a scrim behind it, the focus inside; back, Esc and a click on the scrim ask to close. Whether it is shown is the screen's state (`visible`, `onDismissRequest`); the palette does not close itself. `onRun` is where the palette is closed before the command does its work.
- **It stands at the top.** At the top of the window, in the middle: as you type, the list under it shrinks and grows, and the field stays where it is. On a phone it is as wide as the margins leave, and ends above the keyboard.
- **Commands.** A `PantrixCommand`'s `key` is the same in every language; `label` gives the name read, `group` the heading it stands under, `icon` the icon before it, `shortcut` the shortcut at its end, `keywords` other words that find it, and `supportingText` the second line under the label.
- **Search.** Each word typed is looked for in the label, the group, the keywords or the second line; capitals and small letters are compared as the theme's language has them (in Turkish İ with i, I with ı). The groups keep their order; inside each group, those matched from the start, and from the start of a word, come first; the letters found are set in bold.
- **Keyboard.** The field keeps the focus; the down and up arrows go between the commands that can be run and stop at the ends, Page Down and Page Up skip a page, and the mouse highlights the row it passes over. Enter, the keyboard's action and a press on the row run the command. Each time it opens the field is empty and the highlight is on the first command that can be run.
- **Disabled.** A command with `enabled = false` is listed, written faintly; the arrows pass it by and it is not run.
- **Shortcuts.** A `PantrixShortcut` holds a key and what is pressed with it; `command` is Command on Apple's systems and Control elsewhere. It is written at the row's end as the system writes it: ⇧⌘K or Ctrl+Shift+K. `Modifier.onShortcut` binds one shortcut and `Modifier.commandShortcuts` every command's in the list; `Modifier.shortcutRoot` on the window's root makes the shortcuts heard while nothing has the focus too.
- **Screen reader.** As it opens, the palette is announced by the theme's name for a list of commands. The highlighted row is selected, the groups are headings, the shortcut is read as the row's state; as you type, how many commands are left is said.
- **Platform.** The panel is a dialog's, the rows the platform's list rows: 48dp on Android, 44pt on iOS, 36dp on desktop and the web. On desktop and the web the panel stands a little lower from the top.

## Usage

### Opened with Cmd+K or Ctrl+K

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { open = true }) {
    PantrixCommandPalette(
        visible = open,
        onDismissRequest = { open = false },
        commands = commands,
        onRun = { command ->
            open = false
            run(command.key)
        },
        tagKey = "commands"
    )
}
```

### Commands with groups, shortcuts and keywords

```kotlin
val commands = listOf(
    PantrixCommand(
        key = "rename",
        label = stringResource(Res.string.rename),
        group = stringResource(Res.string.file),
        shortcut = PantrixShortcut(Key.R, command = true)
    ),
    PantrixCommand(
        key = "delete",
        label = stringResource(Res.string.delete),
        group = stringResource(Res.string.file),
        enabled = selection.isNotEmpty()
    ),
    PantrixCommand(
        key = "appearance",
        label = stringResource(Res.string.appearance),
        group = stringResource(Res.string.view),
        keywords = listOf("theme", "dark")
    )
)
```

## Examples

### Groups, shortcuts and keywords

A file editor's commands, with their groups. A button opens it; typing narrows the list, the arrows walk it, and Enter runs the highlighted command and closes the palette. "Delete" cannot be run now: it is listed, but the arrows pass it by. "Appearance settings" is found by "theme" or "dark" too: those are its keywords. Two commands have a second line under their label that says what they do (`supportingText`); the search reads it too: type "address".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var ran by rememberSaveable { mutableStateOf<String?>(null) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixButton(text = "Open the command palette", onClick = { open = true }, tagKey = "open_editor")
    PantrixText(
        text = "Last run: ${ran ?: "none"}",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "ran_editor"
    )
}
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = EDITOR_COMMANDS,
    onRun = { command ->
        open = false
        ran = command.label
    },
    tagKey = "editor"
)

private val EDITOR_COMMANDS = listOf(
    PantrixCommand(
        key = "new",
        label = "New file",
        group = "File",
        icon = PantrixIcons.Plus,
        shortcut = PantrixShortcut(Key.N, command = true)
    ),
    PantrixCommand(
        key = "open",
        label = "Open file",
        group = "File",
        icon = PantrixIcons.Folder,
        shortcut = PantrixShortcut(Key.O, command = true)
    ),
    PantrixCommand(
        key = "rename",
        label = "Rename",
        group = "File",
        shortcut = PantrixShortcut(Key.R, command = true, shift = true)
    ),
    PantrixCommand(key = "delete", label = "Delete", group = "File", enabled = false),
    PantrixCommand(
        key = "copy",
        label = "Copy the link",
        group = "File",
        icon = PantrixIcons.Copy,
        keywords = listOf("link", "share"),
        supportingText = "An address for those who can see the file"
    ),
    PantrixCommand(
        key = "zoom_in",
        label = "Zoom in",
        group = "View",
        icon = PantrixIcons.ZoomIn,
        shortcut = PantrixShortcut(Key.Equals, command = true)
    ),
    PantrixCommand(
        key = "zoom_out",
        label = "Zoom out",
        group = "View",
        icon = PantrixIcons.ZoomOut,
        shortcut = PantrixShortcut(Key.Minus, command = true)
    ),
    PantrixCommand(
        key = "appearance",
        label = "Appearance settings",
        group = "View",
        icon = PantrixIcons.Eye,
        keywords = listOf("theme", "dark", "light"),
        supportingText = "Theme, text size, line spacing"
    ),
    PantrixCommand(
        key = "search",
        label = "Search the files",
        icon = PantrixIcons.Search,
        shortcut = PantrixShortcut(Key.F, command = true, shift = true)
    )
)
```

### The commands' own shortcuts

The commands' own shortcuts: one list is what the palette shows and what the keyboard runs. While typing in the field, ⌘B or Ctrl+B runs "Bold" and ⌘I or Ctrl+I "Italic"; the letter is not typed in the field. They are heard while the focus is inside this card: for the whole window they belong on its root.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.components.overlay.commandpalette.commandShortcuts
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var ran by rememberSaveable { mutableStateOf<String?>(null) }
val note = rememberTextFieldState()
val run = { command: PantrixCommand -> ran = command.label }
Column(
    modifier = Modifier.fillMaxWidth().commandShortcuts(TEXT_COMMANDS, onRun = run),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(
        state = note,
        modifier = Modifier.fillMaxWidth(),
        label = "Note",
        placeholder = "Type here, then ⌘B or Ctrl+B",
        tagKey = "note"
    )
    PantrixButton(
        text = "Formatting commands",
        onClick = { open = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_text"
    )
    PantrixText(
        text = "Last run: ${ran ?: "none"}",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "ran_text"
    )
}
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = TEXT_COMMANDS,
    onRun = { command ->
        open = false
        run(command)
    },
    tagKey = "text"
)

private val TEXT_COMMANDS = listOf(
    PantrixCommand(
        key = "bold",
        label = "Bold",
        group = "Format",
        shortcut = PantrixShortcut(Key.B, command = true)
    ),
    PantrixCommand(
        key = "italic",
        label = "Italic",
        group = "Format",
        shortcut = PantrixShortcut(Key.I, command = true)
    ),
    PantrixCommand(
        key = "clear",
        label = "Clear the formatting",
        group = "Format",
        shortcut = PantrixShortcut(Key.Backslash, command = true)
    )
)
```

### Words of its own and colours of its own

The palette's own words and colours: the field's placeholder and what is written when nothing matches are the caller's, and the highlighted row is in the app's own violet. Type "zzz" to see the words for an empty list.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.commandpalette.CommandPaletteColors
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val own = ownColors()
PantrixButton(text = "Go somewhere", onClick = { open = true }, variant = ButtonVariant.Outline, tagKey = "open_go")
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = PLACES,
    onRun = { open = false },
    placeholder = "Type the name of a page…",
    emptyText = "No page has that name",
    colors = CommandPaletteColors(highlightedContainer = own.container, highlightedContent = own.onContainer),
    tagKey = "go"
)

private val PLACES = listOf(
    PantrixCommand(key = "home", label = "Home", icon = PantrixIcons.Inbox),
    PantrixCommand(key = "profile", label = "Profile", icon = PantrixIcons.Person),
    PantrixCommand(key = "favourites", label = "Favourites", icon = PantrixIcons.Star),
    PantrixCommand(key = "calendar", label = "Calendar", icon = PantrixIcons.Calendar)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### In its own style

In its own style: `CommandPaletteStyle` changes the palette's width, its corners and its rows. Here the palette is at most 420dp wide, its corners are medium round and its rows 40dp high; every field not given is the platform's preset.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.commandpalette.CommandPaletteStyle
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixButton(text = "Open the narrow palette", onClick = { open = true }, tagKey = "open_narrow")
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = EDITOR_COMMANDS,
    onRun = { open = false },
    style = CommandPaletteStyle(maxWidth = 420.dp, shape = ShapeRole.Medium, itemHeight = 40.dp, iconGap = 12.dp),
    tagKey = "narrow"
)

private val EDITOR_COMMANDS = listOf(
    PantrixCommand(
        key = "new",
        label = "New file",
        group = "File",
        icon = PantrixIcons.Plus,
        shortcut = PantrixShortcut(Key.N, command = true)
    ),
    PantrixCommand(
        key = "open",
        label = "Open file",
        group = "File",
        icon = PantrixIcons.Folder,
        shortcut = PantrixShortcut(Key.O, command = true)
    ),
    PantrixCommand(
        key = "rename",
        label = "Rename",
        group = "File",
        shortcut = PantrixShortcut(Key.R, command = true, shift = true)
    ),
    PantrixCommand(key = "delete", label = "Delete", group = "File", enabled = false),
    PantrixCommand(
        key = "copy",
        label = "Copy the link",
        group = "File",
        icon = PantrixIcons.Copy,
        keywords = listOf("link", "share"),
        supportingText = "An address for those who can see the file"
    ),
    PantrixCommand(
        key = "zoom_in",
        label = "Zoom in",
        group = "View",
        icon = PantrixIcons.ZoomIn,
        shortcut = PantrixShortcut(Key.Equals, command = true)
    ),
    PantrixCommand(
        key = "zoom_out",
        label = "Zoom out",
        group = "View",
        icon = PantrixIcons.ZoomOut,
        shortcut = PantrixShortcut(Key.Minus, command = true)
    ),
    PantrixCommand(
        key = "appearance",
        label = "Appearance settings",
        group = "View",
        icon = PantrixIcons.Eye,
        keywords = listOf("theme", "dark", "light"),
        supportingText = "Theme, text size, line spacing"
    ),
    PantrixCommand(
        key = "search",
        label = "Search the files",
        icon = PantrixIcons.Search,
        shortcut = PantrixShortcut(Key.F, command = true, shift = true)
    )
)
```

## API

### PantrixCommandPalette

`import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCommandPalette(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    commands: List<PantrixCommand>,
    onRun: (PantrixCommand) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    emptyText: String? = null,
    style: CommandPaletteStyle? = null,
    colors: CommandPaletteColors? = null,
    tagKey: String? = null
)
```

Every command of the app, found by its name and run from the keyboard: what Cmd+K or Ctrl+K opens.

The palette is modal, as a dialog is: a scrim over the app, the focus inside, and back, Escape and a click on the scrim asking to close. Whether it is shown is the caller's: give `visible`, and act on `onDismissRequest` and on `onRun`, which is where the palette is closed before the command does its work. It stands at the top of the window, where its field stays while the list under it grows and shrinks.

**Finding.** The field takes the focus as the palette opens, on a phone too, and keeps it while the list is walked. With nothing typed every command is listed, under its group. What is typed narrows the list to the commands whose label, group or keywords hold each word of it, compared in the theme's language; inside a group those whose label starts with it come first, and the letters found are marked. Each time it opens the field is empty.

**Running.** One command is highlighted, at first the first that can be run. The arrows down and up move the highlight over the commands that can be run and stop at the ends, Page Down and Page Up a page at a time, and the pointer moves it to the row it passes over. Enter, the keyboard's action and a press on a row run the command. A command that is not `enabled` is listed, faint, and is not run.

**Shortcuts.** A command's `PantrixCommand.shortcut` is written at its row's end as the system writes it. The palette opens by a shortcut of the app's, and the commands run by theirs, with `commandShortcuts` on the window's root.

**To a screen reader** the palette is announced by the theme's name for a list of commands. The highlighted row is selected, the groups are headings, and as what is typed narrows the list, the number of commands left is said.

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { open = true }) {
    …
    PantrixCommandPalette(
        visible = open,
        onDismissRequest = { open = false },
        commands = commands,
        onRun = { command ->
            open = false
            run(command.key)
        },
        tagKey = "commands"
    )
}
```

Parameters:

- `visible: Boolean`: whether the palette is shown. It never hides itself.
- `onDismissRequest: () -> Unit`: called for back, Escape and a click on the scrim.
- `commands: List<PantrixCommand>`: every command, in the order they are listed under their groups. No two have one key.
- `onRun: (PantrixCommand) -> Unit`: called with the command run, by Enter, the keyboard's action or a press. Close the palette here.
- `modifier: Modifier`: the panel's modifier.
- `placeholder: String?`: what the empty field shows, or null for the theme's words for searching commands.
- `emptyText: String?`: what stands in the list's place while nothing matches, or null for the theme's words for it.
- `style: CommandPaletteStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CommandPaletteColors?`: this palette's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the palette's automation key: the panel is `CommandPalette_<tagKey>`, its field `CommandPalette_<tagKey>.TextField_query` and a command's row `CommandPalette_<tagKey>.Command_<key>`. What is done is reported as a `CommandPalette` event: `open`, `dismiss` with `via` (`back` or `scrim`), and `run` with the command's key and `via` (`key` or `click`). What is typed is never reported.

### PantrixCommand

`import com.pantrixui.components.overlay.commandpalette.PantrixCommand`, from `com.pantrixui:components`

```kotlin
class PantrixCommand(
    public val key: String,
    public val label: String,
    public val group: String? = null,
    public val icon: ImageVector? = null,
    public val shortcut: PantrixShortcut? = null,
    public val keywords: List<String> = emptyList(),
    public val enabled: Boolean = true,
    public val tagKey: String? = null,
    public val supportingText: String? = null
)
```

One command of a `PantrixCommandPalette`: what the user reads, where it is listed, and what else finds it.

```kotlin
PantrixCommand(
    key = "rename",
    label = stringResource(Res.string.rename),
    group = stringResource(Res.string.file),
    shortcut = PantrixShortcut(Key.R, command = true)
)
```

Parameters:

- `key: String`: the command's own key, the same in every language: what `PantrixCommandPalette`'s `onRun` and its `run` event are given, and its row's automation key unless `tagKey` is given. No two commands of a palette have one key.
- `label: String`: what the command does, as the user reads it.
- `group: String?`: the heading the command is listed under, or null for one listed under none.
- `icon: ImageVector?`: drawn before the label.
- `shortcut: PantrixShortcut?`: the keys that run the same thing, written at the row's end as the system writes them. Binding them is `Modifier.commandShortcuts`'s.
- `keywords: List<String>`: other words that find the command: what another app calls it, a word a user types for it.
- `enabled: Boolean`: whether the command can be run now. One that cannot is listed, faint, and the arrows pass it by.
- `tagKey: String?`: the row's automation key, where it is not `key`.
- `supportingText: String?`: a second line under the label, smaller and quieter: what the command opens or where it leads. A screen reader hears it after the label, and a search finds the command by it, as by a keyword.

### CommandPaletteStyle

`import com.pantrixui.components.overlay.commandpalette.CommandPaletteStyle`, from `com.pantrixui:components`

```kotlin
class CommandPaletteStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val topSpace: Dp = Dp.Unspecified,
    public val itemHeight: Dp = Dp.Unspecified,
    public val itemHorizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified
) : PantrixStyle<CommandPaletteStyle>
```

`PantrixCommandPalette`'s geometry: the panel, where it stands, and the rows of its list.

No platform has a command palette of its own. The panel is a dialog's, its corners and its shadow as the platform's dialog has them, and the rows are the platform's list rows: 48dp on Android, 44pt on iOS and 36dp under a pointer. A row is never lower than the platform's touch target.

The panel stands at the top of the window, where a field that is typed in stays while the list under it grows and shrinks: below the margin on a phone, and lower on a desktop and the web, by `topSpace`.

The room, the rows' height and the gaps follow the density. The panel's size, its corners, its shadow and the icons do not.

Parameters:

- `shape: ShapeSpec`: The panel's corners: a step of the brand's shape scale, or a fixed shape.
- `maxWidth: Dp`: The widest the panel grows in a wide window.
- `maxHeight: Dp`: The tallest the panel grows in a tall window. A narrower window, and the keyboard, make it less.
- `elevation: Dp`: The panel's shadow. iOS sets a panel apart by the dimming alone.
- `margin: Dp`: The least room between the panel and the window's safe area.
- `topSpace: Dp`: The room above the panel, past `margin`.
- `itemHeight: Dp`: The least height of a command's row. A larger type makes it taller.
- `itemHorizontalPadding: Dp`: The room between a row's sides and what it holds, and a heading's.
- `iconSize: Dp`: The width and height of a command's icon.
- `iconGap: Dp`: Between a command's icon, its label and its shortcut.

### CommandPaletteColors

`import com.pantrixui.components.overlay.commandpalette.CommandPaletteColors`, from `com.pantrixui:components`

```kotlin
data class CommandPaletteColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val highlightedContainer: Color = Color.Unspecified,
    public val highlightedContent: Color = Color.Unspecified,
    public val heading: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

What a `PantrixCommandPalette` is painted with, in place of the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for what is written on the panel, unless `content` is given too, and a `highlightedContainer` brings its pair for the highlighted row, unless `highlightedContent` is given. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The panel's fill. The theme's `surface`.
- `content: Color`: A command's label and its icon, and what is typed. The theme's `textPrimary`, or the colour a role's fill given as `container` gives what stands on it.
- `highlightedContainer: Color`: The fill behind the command Enter runs. The primary role's `container`.
- `highlightedContent: Color`: That command's label, icon and shortcut: the colour that reads on `highlightedContainer`. The primary role's `onContainer`.
- `heading: Color`: A group's heading, a shortcut and what stands in the list's place when nothing matches. The theme's `textSecondary` on the theme's own grounds, and `content` on another fill.
- `scrim: Color`: The dimming laid over the app behind the palette, with its own alpha. The theme's `scrim`.

### Modifier.commandShortcuts

`import com.pantrixui.components.overlay.commandpalette.commandShortcuts`, from `com.pantrixui:components`

```kotlin
fun Modifier.commandShortcuts(
    commands: List<PantrixCommand>,
    onRun: (PantrixCommand) -> Unit
): Modifier
```

Runs each command of `commands` that has a shortcut by that shortcut, by `onRun`, while the focus is on this node or inside it: the one list of commands is what the palette shows and what the keyboard runs.

A command that is not `enabled` lets its keys through. Of two commands with one shortcut, the first one runs. Put it on a window's root with `shortcutRoot`, which holds the focus while nothing else does, so that the shortcuts are heard then too:

```kotlin
Box(Modifier.shortcutRoot().commandShortcuts(commands, onRun = { run(it.key) })) { … }
```

While a palette or another modal of Pantrix's is open, the keys are its own, and these shortcuts are not heard.

Parameters:

- `commands: List<PantrixCommand>`: the commands, as the palette is given them.
- `onRun: (PantrixCommand) -> Unit`: called with the command whose shortcut was pressed.

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
