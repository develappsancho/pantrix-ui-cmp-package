# Surface

The plainest container: it paints a colour in a shape and clips its content to that shape, with an optional 1dp border and a shadow. A panel, a coloured band, the ground of a slide.

Its real work is the content colour. The library's rule is this: a fill says what colour is written on it; the theme's own grounds do not. A `PantrixText` and a `PantrixIcon` inside a surface painted with a role's fill take the colour that reads on that fill without being told.

- `PantrixSurface` (`com.pantrixui.components.container.surface`, `com.pantrixui:components`): A themed background that gives everything inside it the content colour that reads on it. Keywords: background, container, paper, box, themed background.

## Features

- **Fill.** `color` is the surface's colour; left out, it is the theme's `surface`.
- **On a role's fill.** The content is drawn in `onColor` on the role's `color`, and in `onContainer` on its `container`.
- **On the grounds.** On the theme's `surface` and its `background` the surface gives no content colour: each component draws in its own default, a text in `textPrimary` and an icon in `onSurface`.
- **On a colour the theme does not know.** On a fill no role has, the surface gives no colour either; the colour that reads on it is given with `contentColor`.
- **A ground inside a fill.** A ground-coloured surface that stands on a fill is a ground again: the colour the fill gave its content ends there.
- **Shape.** `shape` sets the corners; its default is the theme's `md` shape. The content is clipped to that shape.
- **Border.** When `border` is given a colour, a 1dp line is drawn around the surface.
- **Shadow.** `elevation` puts a shadow under the surface; its default is zero.
- **The content is in a box.** `content` is a `BoxScope`: the children stand one on top of another and are placed with `Modifier.align`. The surface has no padding of its own.

## Usage

### Tinted container

```kotlin
PantrixSurface(color = PantrixTheme.colors.primary.container) {
    PantrixText(
        text = stringResource(Res.string.trial_ends_soon),
        modifier = Modifier.padding(PantrixTheme.spacing.lg)
    )
}
```

### Outlined panel

```kotlin
PantrixSurface(border = PantrixTheme.colors.divider, shape = PantrixTheme.shapes.lg) {
    PanelContent()
}
```

## Examples

### At its plainest

The least there is to write: a `PantrixSurface` with its content. Its colour is the theme's `surface` and its shape is the theme's `md` shape; it has no border and no shadow. The surface takes as much room as its content and has no padding of its own: the padding comes from the text inside.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface {
    PantrixText(text = "Default surface", modifier = Modifier.padding(PantrixTheme.spacing.lg))
}
```

### On a role's fill

Where `color` is a role's fill, the surface gives its content the colour paired with that fill: `onColor` on the role's `color`, `onContainer` on its `container`. The icon and the text in the rows are given no colour; both take what the surface gives.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val primary = PantrixTheme.colors.primary
val success = PantrixTheme.colors.success
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = primary.color) {
    SurfaceLine(text = "primary.color: what is inside is drawn in onColor")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = primary.container) {
    SurfaceLine(text = "primary.container: what is inside is drawn in onContainer")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = success.container) {
    SurfaceLine(text = "success.container: the rule is the same for every role")
}

@Composable
private fun SurfaceLine(text: String) {
    Row(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
        PantrixText(text = text)
    }
}
```

### On the grounds and on a colour the theme does not know

On the theme's own grounds, `surface` and `background`, the surface gives no content colour: each component draws in its own default, a text in `textPrimary` and an icon in `onSurface`.

It is the same on a fill no role has: the theme cannot know what reads on that colour. The third surface is painted in the app's own purple, and its content is again drawn in its own defaults. The fourth is given `contentColor`: on a fill like this it is the caller who says what colour reads on it.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val own = ownColors()
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.surface, border = colors.divider) {
    SurfaceLine(text = "surface: no content colour")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.background, border = colors.divider) {
    SurfaceLine(text = "background: no content colour")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = own.color) {
    SurfaceLine(text = "A colour the theme does not know: no content colour")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = own.color, contentColor = own.onColor) {
    SurfaceLine(text = "The same colour: contentColor given")
}

@Composable
private fun SurfaceLine(text: String) {
    Row(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
        PantrixText(text = text)
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### A ground inside a fill

A ground-coloured surface on a fill is a ground again. The outer surface gives its content `onColor`; the inner one is the theme's `surface` and does not pass that colour on: the text inside it is drawn in `textPrimary` again, and the icon in `onSurface`. The colour the fill gave would not read on that ground.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.color) {
    Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
        SurfaceLine(text = "On the fill")
        PantrixSurface(modifier = Modifier.fillMaxWidth()) {
            SurfaceLine(text = "On the inner surface: a ground again")
        }
    }
}

@Composable
private fun SurfaceLine(text: String) {
    Row(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
        PantrixText(text = text)
    }
}
```

### Reading the content colour

The content colour is carried by `LocalPantrixContentColor`; something you draw yourself can read it too. The dot here is a `Box`, and takes its colour from there. On the grounds the value is `Color.Unspecified`: there the dot picks its own default.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.takeOrElse
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor

val danger = PantrixTheme.colors.danger
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixSurface(color = danger.color) { SurfaceDot() }
    PantrixSurface(color = danger.container) { SurfaceDot() }
    PantrixSurface(border = PantrixTheme.colors.divider) { SurfaceDot() }
}

@Composable
private fun SurfaceDot() {
    val color = LocalPantrixContentColor.current.takeOrElse { PantrixTheme.colors.onSurface }
    Box(modifier = Modifier.padding(PantrixTheme.spacing.lg).size(16.dp).background(color, CircleShape))
}
```

### Shape and clipping

`shape` is the surface's corners: one of the theme's shapes, or any `Shape`. The square surfaces show five of the theme's shapes; the default is `md`.

The content is clipped to the surface's shape. The band inside the bottom surface is a rectangle from edge to edge; its corners were cut by the surface's `xl` shape.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val shapes = PantrixTheme.shapes
val info = PantrixTheme.colors.info
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    listOf("none" to shapes.none, "sm" to shapes.sm, "md" to shapes.md, "xl" to shapes.xl, "full" to shapes.full)
        .forEach { (name, shape) ->
            PantrixSurface(modifier = Modifier.size(72.dp), color = info.container, shape = shape) {
                PantrixText(text = name, modifier = Modifier.align(Alignment.Center))
            }
        }
}
PantrixSurface(
    modifier = Modifier.widthIn(max = 360.dp),
    shape = shapes.xl,
    border = PantrixTheme.colors.divider
) {
    Column {
        Box(modifier = Modifier.fillMaxWidth().height(64.dp).background(info.color))
        PantrixText(
            text = "The surface's shape cut the band's corners",
            modifier = Modifier.padding(PantrixTheme.spacing.lg)
        )
    }
}
```

### Border

When `border` is given a colour, a 1dp line that follows the surface's shape is drawn around it; without one there is no border. A panel's border is usually the theme's `divider` colour. The thickness does not change: only the colour is given.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixSurface(modifier = Modifier.fillMaxWidth(), shape = PantrixTheme.shapes.lg, border = colors.divider) {
    PantrixText(text = "A border in the divider colour", modifier = Modifier.padding(PantrixTheme.spacing.lg))
}
PantrixSurface(
    modifier = Modifier.fillMaxWidth(),
    color = colors.primary.container,
    shape = PantrixTheme.shapes.lg,
    border = colors.primary.color
) {
    PantrixText(text = "A fill, and a border in the role's colour", modifier = Modifier.padding(PantrixTheme.spacing.lg))
}
```

### Shadow

`elevation` puts a shadow under the surface, following its shape. Here are the five steps of the theme's elevation scale: `PantrixTheme.elevation`, from 0dp to 8dp. The shadow is drawn outside the surface's bounds: it needs room around the surface.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val elevation = PantrixTheme.elevation
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)
) {
    listOf(
        "none" to elevation.none,
        "sm" to elevation.sm,
        "md" to elevation.md,
        "lg" to elevation.lg,
        "xl" to elevation.xl
    ).forEach { (name, depth) ->
        PantrixSurface(modifier = Modifier.size(72.dp), elevation = depth) {
            PantrixText(text = name, modifier = Modifier.align(Alignment.Center))
        }
    }
}
```

### The content is in a box

`content` is a `BoxScope`: the children are not laid out one under another, they stand one on top of another, and each picks its place with `Modifier.align`. To lay them out one under another, put a `Column` inside.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val spacing = PantrixTheme.spacing
PantrixSurface(
    modifier = Modifier.fillMaxWidth().height(120.dp),
    color = PantrixTheme.colors.neutral.container
) {
    PantrixText(text = "TopStart", modifier = Modifier.align(Alignment.TopStart).padding(spacing.md))
    PantrixText(text = "Center", modifier = Modifier.align(Alignment.Center))
    PantrixText(text = "BottomEnd", modifier = Modifier.align(Alignment.BottomEnd).padding(spacing.md))
}
```

## API

### PantrixSurface

`import com.pantrixui.components.container.surface.PantrixSurface`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSurface(
    modifier: Modifier = Modifier,
    color: Color = PantrixTheme.colors.surface,
    contentColor: Color = Color.Unspecified,
    shape: Shape = PantrixTheme.shapes.md,
    border: Color = Color.Unspecified,
    elevation: Dp = 0.dp,
    content: @Composable BoxScope.() -> Unit
)
```

A container that paints `color` in `shape` and clips its content to it, with an optional one-dp `border` and a shadow of `elevation`.

What it holds draws in `contentColor`, or else in the colour that reads on `color` where that is a role's fill: a `PantrixText` or a `PantrixIcon` inside takes it without being told. On the theme's `surface`, on its `background` and on a colour the theme does not have, the surface gives none, whatever it stands on itself: each component inside draws in its own default, a text in `textPrimary` and an icon in `onSurface`.

Parameters:

- `modifier: Modifier`: the surface's modifier: its size and its place.
- `color: Color`
- `contentColor: Color`
- `shape: Shape`
- `border: Color`
- `elevation: Dp`
- `content: @Composable BoxScope.() -> Unit`: what the surface holds, drawn in its content colour and clipped to `shape`.

### PantrixColors.contentColorFor

`import com.pantrixui.foundation.token.color.contentColorFor`, from `com.pantrixui:foundation`

```kotlin
fun PantrixColors.contentColorFor(container: Color): Color
```

The one colour that whatever is drawn on `container` takes: a role's `onColor` on its colour and its `onContainer` on its container. `Color.Unspecified` where the set has no one colour for it: on its own grounds, the background and the surface, and on a colour it does not have.

On its own grounds the set gives each kind of content a colour of its own: a text is `textPrimary`, an icon is `onSurface`. So a container filled with a ground gives what it holds no content colour, and each component draws there in its own default. A fill is where they all take the one colour that reads on it.

It goes by the colour alone, and a theme may use one colour twice: the dark theme fills a disabled control with the colour of its neutral container. So the disabled pair is looked at last. A fill that is a role's gets the role's content colour, which reads on it, and the disabled content colour is the answer only for a fill that is nothing but the disabled container. What is disabled asks for `disabledContent` itself.

Parameters:

- `container: Color`

### LocalPantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixContentColor: ProvidableCompositionLocal<Color>
```

The colour that text and icons draw in where they are given none, for everything inside whatever provides it. A component that paints a fill provides the colour that reads on it: a solid button its role's `onColor`, a surface filled with a role's colour the one paired with it.

`Color.Unspecified`, the value the theme starts with, means that nothing around has provided one. It is also what the theme's own grounds provide, a scaffold on the background, a surface, a card: on them each component draws in its own default, `PantrixText` in `textPrimary`, `PantrixIcon` in `onSurface`, `PantrixSpinner` in the brand's colour.
