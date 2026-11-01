# Icon

A square icon, drawn in one colour. It mostly finds its colour itself: it takes the content colour of where it sits, and inside a button it is drawn in the same colour as the button's label.

An icon is not a picture: its source's own colours are not used, and all of it is painted in one colour. A photo, an illustration or a logo to be drawn in its own colours is a `PantrixImage`.

- `PantrixIcon` (`com.pantrixui.components.elements.icon`, `com.pantrixui:components`): An icon in one colour, the content colour of where it sits unless tinted, with an explicit decision about what a screen reader hears. Keywords: glyph, symbol, vector, image vector, pictogram.

## Features

- **Three sources.** A vector (`imageVector`), a bitmap (`bitmap`) or any `painter`: all three are drawn at the same size and in one colour.
- **Size.** `size` is the icon's width and height; left out, it is the size in the theme's `IconStyle`, 24dp on every platform. The icon is drawn at this size whatever the source's own size.
- **Colour.** An icon given no `tint` takes the content colour of where it sits: a button's label colour, a disabled control's faded colour. Where nothing gives a colour it is drawn in the theme's `onSurface` colour.
- **Screen reader.** `contentDescription` is a decision made for every icon: given words, a screen reader reads them; where a label beside the icon already says what it is, null is given and the icon is hidden from the reader.
- **The library's icons.** `PantrixIcons` holds the components' own icons and a few for an app's screens: drawn on a 24-unit grid with a 2-unit stroke, round at its ends and corners.
- **Right to left.** The six icons that point back or forward mirror in a right-to-left layout: `ChevronBack`, `ChevronForward`, `FirstPage`, `LastPage`, `ArrowBack` and `ArrowForward`. The others are drawn the same in every language.
- **Automation.** An icon given a `tagKey` carries the tag `Icon_<tagKey>`. An icon given no key is not tagged.

## Usage

### Decorative, beside a label that already says it

```kotlin
PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null)
```

### Meaningful on its own

```kotlin
PantrixIcon(
    imageVector = PantrixIcons.Close,
    contentDescription = PantrixTheme.strings.close,
    tint = PantrixTheme.colors.danger.color
)
```

## Examples

### A decorative icon and a named one

The least it takes: a vector and `contentDescription`. The description has no default, and is written for every icon.

In the first row a label beside the icon says what it is. The icon is decoration: it was given `contentDescription = null` and is hidden from screen readers, and a reader says only "Saved". The icon in the second row stands alone and carries the meaning itself: its description is "Warning", and a reader reads it out. A description says what the icon means, not what it looks like.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null)
    PantrixText(text = "Saved")
}
PantrixIcon(imageVector = PantrixIcons.Warning, contentDescription = "Warning", tagKey = "alert")
```

### Sizes

`size` is the icon's width and height: 16, 20, 24, 32 and 48 dp. The icon in the middle was given no size: it is the size in the theme's icon style, 24dp on every platform.

An icon is drawn at this size whatever its source's own size. Its stroke is relative to its grid, 2 units in 24: it grows thicker and thinner with the icon.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 16.dp, tagKey = "size_16")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 20.dp, tagKey = "size_20")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, tagKey = "size_default")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 32.dp, tagKey = "size_32")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 48.dp, tagKey = "size_48")
}
```

### Tint and the colour of where it sits

The first row: an icon given no colour is drawn on the page in the theme's `onSurface` colour; `tint` gives it a role's colour.

None of the icons in the second row was given a `tint`. Each took the content colour of where it sits: on a surface filled with `primary`, the colour that reads on that fill; inside a button, the label's colour; in a disabled button, that button's faded colour.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val spacing = PantrixTheme.spacing
Row(horizontalArrangement = Arrangement.spacedBy(spacing.lg)) {
    PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
    PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null, tint = colors.info.color)
    PantrixIcon(imageVector = PantrixIcons.Success, contentDescription = null, tint = colors.success.color)
    PantrixIcon(imageVector = PantrixIcons.Warning, contentDescription = null, tint = colors.warning.color)
    PantrixIcon(imageVector = PantrixIcons.Error, contentDescription = null, tint = colors.danger.color)
}
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(spacing.md),
    verticalArrangement = Arrangement.spacedBy(spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixSurface(color = colors.primary.color) {
        PantrixIcon(
            imageVector = PantrixIcons.Inbox,
            contentDescription = null,
            modifier = Modifier.padding(spacing.sm),
            tagKey = "on_a_fill"
        )
    }
    PantrixButton(
        text = "Refresh",
        onClick = {},
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Refresh, contentDescription = null) },
        tagKey = "refresh"
    )
    PantrixButton(
        text = "Refresh",
        onClick = {},
        enabled = false,
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Refresh, contentDescription = null) },
        tagKey = "refresh_disabled"
    )
}
```

### Three sources: vector, bitmap, painter

Three sources, at the same size and in the same colour: a vector, a bitmap and a `painter`. The bitmap here is drawn in code; in an app it comes from a resource or from an image loader.

The third icon's source is Compose Multiplatform's multicoloured logo. `PantrixIcon` paints it in one colour and brings it to its own size. The one beside it is the same source drawn with `PantrixImage`: a picture keeps its own colours.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.PaintingStyle
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

val bitmap = remember { targetBitmap() }
val logo = painterResource(Res.drawable.compose_multiplatform)
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 32.dp, tagKey = "vector")
    PantrixIcon(bitmap = bitmap, contentDescription = null, size = 32.dp, tagKey = "bitmap")
    PantrixIcon(painter = logo, contentDescription = null, size = 32.dp, tagKey = "painter")
    PantrixImage(painter = logo, modifier = Modifier.size(32.dp), contentDescription = null)
}

private fun targetBitmap(): ImageBitmap {
    val bitmap = ImageBitmap(width = 96, height = 96)
    val canvas = Canvas(bitmap)
    val ring = Paint().apply {
        style = PaintingStyle.Stroke
        strokeWidth = 8f
    }
    canvas.drawCircle(center = Offset(48f, 48f), radius = 36f, paint = ring)
    canvas.drawCircle(center = Offset(48f, 48f), radius = 12f, paint = Paint())
    return bitmap
}
```

### Icons that mirror in right-to-left layouts

The icons that point back or forward follow the reading direction: they mirror in a right-to-left layout. The search lens and the play triangle do not: they are drawn the same in every language.

Both rows are written with the same six icons in the same order. The second row is in a right-to-left layout: the icons run from right to left and the arrows point the other way, while the search and play icons are drawn as they are.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

DirectionalIcons()
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
    DirectionalIcons()
}

@Composable
private fun DirectionalIcons() {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
        PantrixIcon(imageVector = PantrixIcons.ArrowBack, contentDescription = "Back")
        PantrixIcon(imageVector = PantrixIcons.ChevronBack, contentDescription = "Previous")
        PantrixIcon(imageVector = PantrixIcons.ChevronForward, contentDescription = "Next")
        PantrixIcon(imageVector = PantrixIcons.ArrowForward, contentDescription = "Forward")
        PantrixIcon(imageVector = PantrixIcons.Search, contentDescription = "Search")
        PantrixIcon(imageVector = PantrixIcons.Play, contentDescription = "Play")
    }
}
```

### All the icons

All the icons in `PantrixIcons`, with their names. A name is as it is written in code: `PantrixIcons.Check`. The ones with "mirrors" written under them are flipped in a right-to-left layout; that is read from the icon itself, from its `autoMirror` field.

As their names are written under them, the icons are decoration and are hidden from screen readers.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.width
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    ALL_ICONS.forEach { icon ->
        Column(
            modifier = Modifier.width(104.dp),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            PantrixIcon(imageVector = icon, contentDescription = null, tagKey = icon.name)
            PantrixText(
                text = icon.name,
                style = PantrixTheme.typography.caption,
                textAlign = TextAlign.Center,
                maxLines = 1
            )
            if (icon.autoMirror) {
                PantrixText(
                    text = "mirrors",
                    style = PantrixTheme.typography.caption,
                    color = PantrixTheme.colors.textSecondary
                )
            }
        }
    }
}

private val ALL_ICONS = listOf(
    PantrixIcons.Check,
    PantrixIcons.Close,
    PantrixIcons.ChevronDown,
    PantrixIcons.ChevronForward,
    PantrixIcons.ChevronBack,
    PantrixIcons.FirstPage,
    PantrixIcons.LastPage,
    PantrixIcons.ArrowBack,
    PantrixIcons.ArrowForward,
    PantrixIcons.Calendar,
    PantrixIcons.Refresh,
    PantrixIcons.ZoomOut,
    PantrixIcons.ZoomIn,
    PantrixIcons.MoreHorizontal,
    PantrixIcons.Minus,
    PantrixIcons.Menu,
    PantrixIcons.Plus,
    PantrixIcons.Info,
    PantrixIcons.Success,
    PantrixIcons.Warning,
    PantrixIcons.Error,
    PantrixIcons.Inbox,
    PantrixIcons.Star,
    PantrixIcons.Folder,
    PantrixIcons.Person,
    PantrixIcons.Search,
    PantrixIcons.Download,
    PantrixIcons.Upload,
    PantrixIcons.File,
    PantrixIcons.Copy,
    PantrixIcons.Eye,
    PantrixIcons.EyeOff,
    PantrixIcons.Pause,
    PantrixIcons.Play
)
```

### A default size by style

An icon's size is not a parameter but its style: `IconStyle` carries the size of an icon that is given none. `ProvidePantrixStyles` changes it for a part of the tree; `PantrixTheme`'s `styles` parameter for the whole app. Here the first icon takes its size from the style, the second is given a `size`: the parameter comes before the style.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.IconStyle
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles = remember { pantrixStyles(IconStyle.override(all = IconStyle(size = 32.dp))) }
ProvidePantrixStyles(styles = styles) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 16.dp)
    }
}
```

## API

### PantrixIcon

`import com.pantrixui.components.elements.icon.PantrixIcon`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixIcon(
    imageVector: ImageVector,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(key = IconStyle).size,
    tint: Color = Color.Unspecified,
    tagKey: String? = null
)
```

An icon, `size` square and drawn in one colour: `tint`, or else the content colour of where it sits, such as a button's label colour. `contentDescription` names it for screen readers; pass null when a label beside it already says what it means, and the icon is hidden from them.

Parameters:

- `imageVector: ImageVector`: the icon's picture: one of `PantrixIcons`, or a vector of the app's.
- `contentDescription: String?`
- `modifier: Modifier`: the icon's modifier.
- `size: Dp`
- `tint: Color`
- `tagKey: String?`: the icon's automation key: the icon is `Icon_<tagKey>`. Without one it has no tag.

### PantrixIcon

`import com.pantrixui.components.elements.icon.PantrixIcon`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixIcon(
    bitmap: ImageBitmap,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(key = IconStyle).size,
    tint: Color = Color.Unspecified,
    tagKey: String? = null
)
```

`PantrixIcon` from a bitmap, drawn at `size` and in one colour like the vector form.

Parameters:

- `bitmap: ImageBitmap`: the icon's picture, a bitmap: it is tinted whole, so a shape of one colour on a clear ground.
- `contentDescription: String?`: what a screen reader calls the icon, or null where a label beside it already says what it means, which hides it from them.
- `modifier: Modifier`: the icon's modifier.
- `size: Dp`
- `tint: Color`: the icon's colour, or else the content colour of where it sits.
- `tagKey: String?`: the icon's automation key: the icon is `Icon_<tagKey>`. Without one it has no tag.

### PantrixIcon

`import com.pantrixui.components.elements.icon.PantrixIcon`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixIcon(
    painter: Painter,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(key = IconStyle).size,
    tint: Color = Color.Unspecified,
    tagKey: String? = null
)
```

`PantrixIcon` from any painter, drawn at `size` whatever the painter's own size, and in one colour.

Parameters:

- `painter: Painter`: the icon's picture, from any painter: it is tinted whole.
- `contentDescription: String?`: what a screen reader calls the icon, or null where a label beside it already says what it means, which hides it from them.
- `modifier: Modifier`: the icon's modifier.
- `size: Dp`
- `tint: Color`: the icon's colour, or else the content colour of where it sits.
- `tagKey: String?`: the icon's automation key: the icon is `Icon_<tagKey>`. Without one it has no tag.

### PantrixIcons

`import com.pantrixui.foundation.icons.PantrixIcons`, from `com.pantrixui:foundation`

```kotlin
object PantrixIcons
```

The icons a component library cannot do without, as `ImageVector`s: a select's chevron, a dialog's close, an alert's status marks. Without them those components are broken, not unstyled, and an alert whose tone only its colour tells says nothing to anyone who cannot see the colour (WCAG 1.4.1). A few more are for an app's own screens: `Inbox`, `Star`, `Folder`, `Person`, `Search` and `Copy`. `Eye` and `EyeOff` are a secure text field's: the button that shows what was typed, and hides it again. `Pause` and `Play` are a carousel's: the button that stops what turns by itself, and lets it turn again. `Download` is a chart's: the button that takes it out of the app as a file. `Upload` and `File` are a drop zone's: the zone that takes a file into the app, and a file it took. `Calendar` and `Clock` are a date's and a time's: the fields and the buttons that open a calendar and a time picker.

Drawn on a 24-unit grid with a 2-unit stroke, round at its ends and corners, the geometry most icon sets use, so an app's own icons sit beside these without looking a different weight. Every path is black: `PantrixIcon` tints the whole icon in the colour it resolves, the content colour of where it sits unless it is given one.

The six that point back or forward set `ImageVector.autoMirror` and flip in right-to-left layouts: `ChevronForward`, `ChevronBack`, `FirstPage`, `LastPage`, `ArrowBack` and `ArrowForward`. The rest never do: a tick, a lens or a turn to the right reads the same in every language, and so does `Play`, which is drawn as a player's button is everywhere.

Members:

- `Check: ImageVector`: Confirmation. Symmetrical in meaning, so it never mirrors.
- `Close: ImageVector`: Closing or dismissing: a dialog, a sheet, a chip.
- `ChevronDown: ImageVector`: What opens below: a select's or an accordion's chevron. Never mirrors.
- `ChevronForward: ImageVector`: Points along the reading direction, so it mirrors in RTL.
- `ChevronBack: ImageVector`: Points against the reading direction, so it mirrors in RTL: a pagination's previous page.
- `FirstPage: ImageVector`: Back to where a row of pages starts: `ChevronBack` against a bar, a pagination's first page. Mirrors in RTL.
- `LastPage: ImageVector`: On to where a row of pages ends: `ChevronForward` against a bar, a pagination's last page. Mirrors in RTL.
- `ArrowBack: ImageVector`: Back to the previous screen, as Android and the web draw it; mirrors in RTL.
- `ArrowForward: ImageVector`: On to what comes next, as `ArrowBack` returns: the arrow between a range's two ends. Mirrors in RTL.
- `Calendar: ImageVector`: A page of a calendar: a date picker's field. Never mirrors.
- `Clock: ImageVector`: A clock's face, its hands at the hour and a little past it: a time picker's field. A clock turns the same way in every language, so it never mirrors.
- `Refresh: ImageVector`: Doing it again: a three-quarter turn, clockwise from the right and around to its head at the top right. A turn to the right reads the same in every language, so it never mirrors.
- `ZoomOut: ImageVector`: Showing more: a lens with a minus in it, which widens a range. A lens is held the same way in every language, so it never mirrors.
- `ZoomIn: ImageVector`: Showing less: `ZoomOut`'s lens with a plus, which narrows the range. Never mirrors.
- `MoreHorizontal: ImageVector`: Something folded away: the pages a breadcrumb trail or a pagination leaves out. Never mirrors.
- `Minus: ImageVector`: Indeterminate or partly selected.
- `Menu: ImageVector`: The menu a drawer opens: three lines, the mark every platform uses for it.
- `Plus: ImageVector`: Add. `Minus`'s line with the upright it is missing.
- `Info: ImageVector`: Information: an "i" in a circle, its dot at the top, the mark `Error` turns upside down.
- `Success: ImageVector`: Success: a tick in a circle.
- `Warning: ImageVector`: Warning: an exclamation mark in a triangle, the one status icon with a different outline.
- `Error: ImageVector`: Error: an exclamation mark in a circle, its dot at the bottom.
- `Inbox: ImageVector`: A tray with a notch in its rim: an inbox.
- `Star: ImageVector`: A five-pointed star: something marked as a favourite.
- `Folder: ImageVector`: A folder.
- `Person: ImageVector`: A head and shoulders: a person, an account.
- `Search: ImageVector`: A lens and its handle: a search. A lens is held the same way in every language, so it never mirrors.
- `Download: ImageVector`: An arrow down onto a line: taking something out of the app as a file. Never mirrors.
- `Upload: ImageVector`: An arrow up from a line: taking a file into the app. Never mirrors.
- `File: ImageVector`: A sheet with its upper corner folded: a file. The fold is at the upper right in every language, as a page's is in a file manager, so it never mirrors.
- `Copy: ImageVector`: Two sheets, one behind the other: copying, of a code block or of a link. The sheet behind shows at the upper left in every language, so it never mirrors.
- `Eye: ImageVector`: An eye: showing what is hidden, the text of a secure text field. It is the same eye in every language.
- `EyeOff: ImageVector`: `Eye` with a line through it: hiding the text again. The eye stops short of the line on either side, so that the line is read as one drawn across the eye and not as part of it.
- `Pause: ImageVector`: Two upright bars: stopping what moves by itself for a while.
- `Play: ImageVector`: A triangle that points to the right: letting what was stopped move again. A player's button points the same way in every language, so it never mirrors.

### IconStyle

`import com.pantrixui.components.elements.icon.IconStyle`, from `com.pantrixui:components`

```kotlin
class IconStyle(
    public val size: Dp = Dp.Unspecified
) : PantrixStyle<IconStyle>
```

`PantrixIcon`'s geometry.

Parameters:

- `size: Dp`: The icon's width and height: 24dp on every platform, unless a brand or a theme sets another.
