# Keycaps

The keys of a keyboard shortcut, each on a cap of its own: as a menu, a list of shortcuts or a hint writes a shortcut. The shortcut is a `PantrixShortcut`; the caps take the order and the names of the system the app runs on.

- `PantrixKeycaps` (`com.pantrixui.components.elements.keycaps`, `com.pantrixui:components`): The keys of a keyboard shortcut, each on a cap of its own, in the order and by the names of the system the app runs on, read as one by a screen reader. Keywords: keyboard shortcut, keycap, kbd, hotkey, key combination, accelerator.

## Features

- **As the system writes it.** `⌥` `⇧` `⌘` `F` on Apple's systems, `Ctrl` `Alt` `Shift` `F` on the others: the order and the names are `keysOn`'s.
- **Screen reader.** The shortcut is read once, as the system writes it (`writtenOn`): "⌘K", "Ctrl+K". The caps are not pressed and are no stop of Tab.
- **Two sizes.** `KeycapsSize.Medium` for the end of a row (footnote), `KeycapsSize.Small` for the end of a field or a launcher (caption).
- **In a sentence.** The caps' first baseline is their keys': in a row lined up with `Modifier.alignByBaseline()` they stand on the line of the words beside them.
- **Colour and style.** A colour given with `KeycapsColors` is used, one left out stays the theme's: the fill `background`, the edge `border`, the key `textSecondary`. `KeycapsStyle` changes the corners, the edge, the room between the caps and each size's room.
- **Automation.** With `tagKey` the caps are `Keycaps_<tagKey>`; without a key they are not tagged.

## Usage

### A command's shortcut at the end of its row

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = stringResource(Res.string.command_palette), modifier = Modifier.weight(1f))
    PantrixKeycaps(shortcut = PantrixShortcut(Key.K, command = true), tagKey = "palette")
}
```

### A shortcut in a sentence, on its line

```kotlin
Row {
    PantrixText(text = "or press ", modifier = Modifier.alignByBaseline())
    PantrixKeycaps(
        shortcut = PantrixShortcut(Key.V, command = true),
        modifier = Modifier.alignByBaseline(),
        size = KeycapsSize.Small
    )
    PantrixText(text = " anywhere on this screen", modifier = Modifier.alignByBaseline())
}
```

## Examples

### A command's shortcut

A list of commands: the name on the left, the shortcut on the right on its caps. The shortcuts are drawn as the system the app runs on writes them: `⌘` on a Mac, `Ctrl` on Windows and Linux.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    COMMANDS.forEach { command ->
        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = command.name, modifier = Modifier.weight(1f))
            PantrixKeycaps(shortcut = command.shortcut, tagKey = command.key)
        }
    }
}

private val COMMANDS = listOf(
    Command("palette", "Palette", PantrixShortcut(Key.K, command = true)),
    Command("save", "Save", PantrixShortcut(Key.S, command = true)),
    Command("copy", "Copy", PantrixShortcut(Key.C, command = true, shift = true)),
    Command("format", "Format", PantrixShortcut(Key.F, command = true, shift = true, alt = true))
)

private class Command(
    val key: String,
    val name: String,
    val shortcut: PantrixShortcut
)
```

### As each system writes it

One shortcut as two systems write it: on Apple's systems the modifier keys by their symbols, in the order `⌥` `⇧` `⌘`; on the others by their names, in the order `Ctrl` `Alt` `Shift`. The app does not pick the system; here the two rows give it one each.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.platform.LocalOperatingSystem
import com.pantrixui.foundation.platform.OperatingSystem
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    SYSTEMS.forEach { (name, system) ->
        Row(verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = name, modifier = Modifier.weight(1f))
            CompositionLocalProvider(LocalOperatingSystem provides system) {
                PantrixKeycaps(shortcut = FORMAT, tagKey = "format_${system.name.lowercase()}")
            }
        }
    }
}

private val SYSTEMS = listOf("macOS" to OperatingSystem.MacOs, "Windows" to OperatingSystem.Windows)

private val FORMAT = PantrixShortcut(Key.F, command = true, shift = true, alt = true)
```

### In a sentence

Small caps in a sentence: all three parts stand on one baseline with `alignByBaseline`. A long paragraph that breaks does not take the caps along; this is for a short hint.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.keycaps.KeycapsSize
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut

Row {
    PantrixText(text = "Or press ", modifier = Modifier.alignByBaseline())
    PantrixKeycaps(
        shortcut = PASTE,
        modifier = Modifier.alignByBaseline(),
        size = KeycapsSize.Small,
        tagKey = "paste"
    )
    PantrixText(text = " anywhere on this screen.", modifier = Modifier.alignByBaseline())
}

private val PASTE = PantrixShortcut(Key.V, command = true)
```

### Colours and sizes of its own

In colours and sizes of their own: caps on the info fill, without a fill of their own and edged in the words' colour; less room between the caps, and wider caps.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.keycaps.KeycapSizeStyle
import com.pantrixui.components.elements.keycaps.KeycapsColors
import com.pantrixui.components.elements.keycaps.KeycapsStyle
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.toShape

val info = PantrixTheme.colors.info
Row(
    modifier = Modifier
        .clip(ShapeRole.Medium.toShape())
        .background(info.container)
        .padding(PantrixTheme.spacing.md),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixText(text = "Format", color = info.onContainer)
    PantrixKeycaps(
        shortcut = FORMAT,
        style = KeycapsStyle(gap = 2.dp, medium = KeycapSizeStyle(minWidth = 28.dp)),
        colors = KeycapsColors(
            container = Color.Transparent,
            border = info.onContainer,
            content = info.onContainer
        ),
        tagKey = "own"
    )
}

private val FORMAT = PantrixShortcut(Key.F, command = true, shift = true, alt = true)
```

## API

### PantrixKeycaps

`import com.pantrixui.components.elements.keycaps.PantrixKeycaps`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixKeycaps(
    shortcut: PantrixShortcut,
    modifier: Modifier = Modifier,
    size: KeycapsSize = KeycapsSize.Medium,
    style: KeycapsStyle? = null,
    colors: KeycapsColors? = null,
    tagKey: String? = null
)
```

The keys of a `shortcut`, each on a cap of its own, as a menu, a list of shortcuts or a hint writes one: `⌘` `K` on Apple's systems and `Ctrl` `K` on the others, in the order and by the names of the system the app runs on (`PantrixShortcut.keysOn`).

A screen reader hears the shortcut once, as that system writes it (`PantrixShortcut.writtenOn`): "⌘K", "Ctrl+K". The caps are not pressed and take no stop of Tab: what the shortcut does is the app's, and the keys run it.

The caps stand on the line of the words beside them: their first baseline is their keys', so a row that lines its children up by their baselines (`Modifier.alignByBaseline()`) sets them in a sentence, "or press ⌘V anywhere". A paragraph that breaks does not take them along.

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Command palette", modifier = Modifier.weight(1f))
    PantrixKeycaps(shortcut = AppShortcuts.Palette, tagKey = "palette")
}
```

Parameters:

- `shortcut: PantrixShortcut`: the shortcut whose keys are drawn.
- `modifier: Modifier`: the caps' modifier.
- `size: KeycapsSize`: how large the caps are: `KeycapsSize.Medium`, for the end of a row, by default.
- `style: KeycapsStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: KeycapsColors?`: this call's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the caps' automation key: they are `Keycaps_<tagKey>`, and are tagged only when given one.

### KeycapsSize

`import com.pantrixui.components.elements.keycaps.KeycapsSize`, from `com.pantrixui:components`

```kotlin
enum class KeycapsSize
```

How large `PantrixKeycaps` are drawn.

Entries:

- `Small`: In the theme's caption type: at the end of a field or a button that opens what the shortcut opens.
- `Medium`: In the theme's footnote type: at the end of a row that names the command, as a menu's. The default.

### KeycapsColors

`import com.pantrixui.components.elements.keycaps.KeycapsColors`, from `com.pantrixui:components`

```kotlin
data class KeycapsColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

What `PantrixKeycaps` are painted with, where they are not the theme's: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// Keycaps on a fill of the app's own, written in what reads on it:
PantrixKeycaps(
    shortcut = paste,
    colors = KeycapsColors(container = Color.Transparent, border = onBanner, content = onBanner)
)
```

Parameters:

- `container: Color`: The fill of each cap: the theme's `background`, a step from the `surface` most rows stand on.
- `border: Color`: The edge around each cap: the theme's `border`.
- `content: Color`: The key's name on the cap: the theme's `textSecondary`, quieter than the words it stands by.

### KeycapsStyle

`import com.pantrixui.components.elements.keycaps.KeycapsStyle`, from `com.pantrixui:components`

```kotlin
class KeycapsStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val small: KeycapSizeStyle = KeycapSizeStyle(),
    public val medium: KeycapSizeStyle = KeycapSizeStyle()
) : PantrixStyle<KeycapsStyle>
```

`PantrixKeycaps`' geometry: the shape of a cap, its edge, the room between two caps, and a cap's room for each `KeycapsSize`. The same on every platform: a shortcut is written alike wherever a keyboard types it.

Parameters:

- `shape: ShapeSpec`: A cap's shape: `ShapeRole.Small`, a key's slight rounding.
- `borderWidth: Dp`: How wide the edge around a cap is.
- `gap: Dp`: The room between two caps.
- `small: KeycapSizeStyle`: `KeycapsSize.Small`'s room in a cap.
- `medium: KeycapSizeStyle`: `KeycapsSize.Medium`'s room in a cap.

### KeycapSizeStyle

`import com.pantrixui.components.elements.keycaps.KeycapSizeStyle`, from `com.pantrixui:components`

```kotlin
class KeycapSizeStyle(
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified
) : PantrixStyle<KeycapSizeStyle>
```

One `KeycapsSize`'s room in a keycap: how narrow the cap is at the least, and the room around its key.

Parameters:

- `minWidth: Dp`: The cap's least width: a key of one character sits in a cap as wide as it is tall, or wider.
- `horizontalPadding: Dp`: The room on each side of the key's name, which a longer name grows the cap by.
- `verticalPadding: Dp`: The room over and under the key's name.
