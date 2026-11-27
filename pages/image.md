# Image

A picture: a photo, an illustration, a logo. What sets it apart from `PantrixIcon` is its colours: an icon is painted in the one colour of where it sits, and a picture keeps its own.

It does not load the picture itself: it takes a ready-made `Painter`, an `ImageVector` or an `ImageBitmap`.

- `PantrixImage` (`com.pantrixui.components.elements.image`, `com.pantrixui:components`): A picture in its own colours, such as a photo, an illustration or a logo; decorative unless it is given a content description. Keywords: picture, photo, illustration, logo, bitmap, painter.

## Features

- **Three sources.** A `Painter`, an `ImageVector` or an `ImageBitmap`: there is a `PantrixImage` for each, and their other parameters are the same.
- **Its own colours.** A picture is not painted in the content colour around it. Only `colorFilter` changes its colours.
- **Saying something, or decorating.** `contentDescription` describes the picture for screen readers. A picture that only decorates says so with `contentDescription = null`, and is hidden from them.
- **Size.** `modifier` gives the size. Given none, the picture is its source's own size.
- **Fitting.** `contentScale` says how the picture fits the area it is given. The default is `Fit`: the whole picture shows, with its proportions kept.
- **Alignment.** `alignment` says where in the area the picture stands; the default is its centre.
- **Transparency.** `alpha` draws the picture faded.
- **Sampling.** In the overload that takes an `ImageBitmap`, `filterQuality` says how the bitmap is sampled when it is drawn larger or smaller than its own size.
- **Automation.** A picture carries a test tag only when it is given a `tagKey`: `Image_logo` for `tagKey = "logo"`.

## Usage

### An illustration that says something

```kotlin
PantrixImage(
    painter = painterResource(Res.drawable.empty_inbox),
    contentDescription = stringResource(Res.string.empty_inbox_illustration),
    modifier = Modifier.fillMaxWidth(),
    contentScale = ContentScale.FillWidth
)
```

### A decorative background

```kotlin
PantrixImage(
    painter = painterResource(Res.drawable.header_pattern),
    modifier = Modifier.fillMaxSize(),
    contentScale = ContentScale.Crop
)
```

## Examples

### A picture

At its plainest: a `Painter` and a size. The picture is drawn in its own colours and fits the area it is given, keeping its proportions.

It is given no description: this picture is decoration, and is hidden from screen readers.

```kotlin
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixImage(
    painter = painterResource(Res.drawable.compose_multiplatform),
    modifier = Modifier.size(96.dp),
    contentDescription = "Compose Multiplatform logo"
)
```

### At its own size

A picture given no size is its source's own size: this illustration is a square of 450dp. Where the place it stands in is narrower, it fits that place, keeping its proportions.

Press the button: the picture appears; press it again and it is hidden.

```kotlin
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

var showContent by remember { mutableStateOf(false) }
PantrixButton(
    text = if (showContent) "Hide picture" else "Show picture",
    onClick = { showContent = !showContent },
    tagKey = "toggle_image"
)
AnimatedVisibility(showContent) {
    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
        PantrixImage(
            painter = painterResource(Res.drawable.compose_multiplatform),
            contentDescription = "Compose Multiplatform logo",
            tagKey = "compose_logo"
        )
    }
}
```

### A picture that says something and a decorative one

`contentDescription` describes the picture for screen readers: the one on the left is read as "Compose Multiplatform logo". The one on the right is given `null`: it says it is decoration, and is hidden from screen readers. A picture that says something is given a description; one that only decorates is given `null`.

A picture carries a test tag only when it is given a `tagKey`: the left one's tag is `Image_logo`, and the right one has no tag.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.size(64.dp),
        contentDescription = "Compose Multiplatform logo",
        tagKey = "logo"
    )
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.size(64.dp),
        contentDescription = null
    )
}
```

### Fitting

`contentScale` says how the picture fits the area it is given. The three areas are the same size, 120 by 72 dp; the picture is square.

`Fit` (the default) shows the whole picture, with room left at the sides. `Crop` fills the area, and the top and the bottom, which overflow, are cut off. `FillBounds` stretches the picture to fill the area, and its proportions are lost.

The other values can be given too: `Inside` only shrinks a picture larger than the area, and `None` does not scale the picture at all.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    listOf(
        "Fit" to ContentScale.Fit,
        "Crop" to ContentScale.Crop,
        "FillBounds" to ContentScale.FillBounds
    ).forEach { (name, scale) ->
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixImage(
                painter = painterResource(Res.drawable.compose_multiplatform),
                modifier = Modifier
                    .size(width = 120.dp, height = 72.dp)
                    .background(PantrixTheme.colors.neutral.container),
                contentScale = scale,
                contentDescription = null
            )
            PantrixText(
                text = name,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### Alignment

`alignment` says where in the area the picture stands; the default is its centre. Here the picture fits the area with `Fit` and room is left at the sides: `CenterStart` rests the picture against the side where a line starts, and `CenterEnd` against the side where it ends.

In a picture cropped with `Crop`, `alignment` picks which part shows.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    listOf(
        "CenterStart" to Alignment.CenterStart,
        "Center" to Alignment.Center,
        "CenterEnd" to Alignment.CenterEnd
    ).forEach { (name, alignment) ->
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixImage(
                painter = painterResource(Res.drawable.compose_multiplatform),
                modifier = Modifier
                    .size(width = 120.dp, height = 72.dp)
                    .background(PantrixTheme.colors.neutral.container),
                alignment = alignment,
                contentDescription = null
            )
            PantrixText(
                text = name,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### Colour filter and transparency

A picture keeps its own colours; `colorFilter` changes them. In order: the picture itself, the picture painted in a single colour with `ColorFilter.tint`, in greyscale with a colour matrix that brings its saturation down to zero, and faded with `alpha = 0.4f`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.ColorMatrix
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

val painter = painterResource(Res.drawable.compose_multiplatform)
val grayscale = remember { ColorFilter.colorMatrix(ColorMatrix().apply { setToSaturation(0f) }) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixImage(painter = painter, modifier = Modifier.size(64.dp), contentDescription = null)
    PantrixImage(
        painter = painter,
        modifier = Modifier.size(64.dp),
        colorFilter = ColorFilter.tint(PantrixTheme.colors.textSecondary),
        contentDescription = null
    )
    PantrixImage(painter = painter, modifier = Modifier.size(64.dp), colorFilter = grayscale, contentDescription = null)
    PantrixImage(painter = painter, modifier = Modifier.size(64.dp), alpha = 0.4f, contentDescription = null)
}
```

### From a vector: how it differs from an icon

The second overload takes an `ImageVector` and draws the vector's own colours: the first picture is a multicoloured illustration.

`PantrixIcons.Star` is an icon drawn in black. `PantrixImage` draws it as it is, black; in the dark theme it is hard to tell from the ground. The `PantrixIcon` beside it paints the same vector in the content colour of where it sits. A mark in one colour is drawn with `PantrixIcon`, and an illustration with colours of its own with `PantrixImage`; where a picture has to be painted, it is given a `colorFilter`, as the last one is.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.vectorResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixImage(
        imageVector = vectorResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.size(48.dp),
        contentDescription = "Compose Multiplatform logo"
    )
    PantrixImage(
        imageVector = PantrixIcons.Star,
        modifier = Modifier.size(48.dp),
        contentDescription = "Star, as a picture",
        tagKey = "star_image"
    )
    PantrixIcon(
        imageVector = PantrixIcons.Star,
        contentDescription = "Star, as an icon",
        size = 48.dp,
        tagKey = "star_icon"
    )
    PantrixImage(
        imageVector = PantrixIcons.Star,
        modifier = Modifier.size(48.dp),
        contentDescription = "Star, as a tinted picture",
        colorFilter = ColorFilter.tint(ownColors().color)
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### From a bitmap, and sampling

The third overload takes an `ImageBitmap` and has a parameter of its own: `filterQuality` says how the bitmap is sampled when it is drawn larger or smaller than its own size.

The bitmap here is a checkerboard of eight by eight pixels, enlarged to 96dp. The one on the left is given `FilterQuality.None`: the pixels stay sharp. The one on the right has the default: the pixels blend into each other at their edges.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.FilterQuality
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixPalette

val checkerboard = remember { imageCheckerboard() }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixImage(
        bitmap = checkerboard,
        modifier = Modifier.size(96.dp),
        contentDescription = "Checkerboard, sharp pixels",
        filterQuality = FilterQuality.None,
        tagKey = "checkerboard_sharp"
    )
    PantrixImage(
        bitmap = checkerboard,
        modifier = Modifier.size(96.dp),
        contentDescription = "Checkerboard, smoothed pixels",
        tagKey = "checkerboard_smooth"
    )
}

private fun imageCheckerboard(): ImageBitmap {
    val bitmap = ImageBitmap(width = 8, height = 8)
    val canvas = Canvas(bitmap)
    val paint = Paint()
    for (row in 0 until 8) {
        for (column in 0 until 8) {
            val dark = (row + column) % 2 == 0
            paint.color = if (dark) PantrixPalette.Violet.shade600 else PantrixPalette.Violet.shade100
            canvas.drawRect(
                left = column.toFloat(),
                top = row.toFloat(),
                right = column + 1f,
                bottom = row + 1f,
                paint = paint
            )
        }
    }
    return bitmap
}
```

### Shape and ground

A picture has no parameter for a shape, a ground or a padding: `modifier` gives all three. Here `clip` cuts the area, `background` paints the area that was cut, and `padding` brings the picture in from the edges.

The one on the left is a circle (`shapes.full`), the one on the right a square with round corners (`shapes.lg`).

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier
            .size(72.dp)
            .clip(PantrixTheme.shapes.full)
            .background(PantrixTheme.colors.neutral.container)
            .padding(PantrixTheme.spacing.md),
        contentDescription = "Compose Multiplatform logo"
    )
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier
            .size(72.dp)
            .clip(PantrixTheme.shapes.lg)
            .background(PantrixTheme.colors.neutral.container)
            .padding(PantrixTheme.spacing.md),
        contentDescription = "Compose Multiplatform logo"
    )
}
```

### Behind content, as decoration

Like a faded logo behind a heading: the picture covers the surface with `fillMaxSize()`, `ContentScale.Crop` cuts off what overflows, and `alpha` leaves it faded behind the text.

Its description is `null`: it is decoration, and a screen reader reads the text alone.

```kotlin
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixSurface(
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth().height(120.dp),
    color = PantrixTheme.colors.primary.container,
    shape = PantrixTheme.shapes.lg
) {
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.fillMaxSize(),
        contentScale = ContentScale.Crop,
        alpha = 0.25f,
        contentDescription = null
    )
    PantrixText(
        text = "Compose Multiplatform",
        modifier = Modifier.align(Alignment.Center),
        style = PantrixTheme.typography.title
    )
}
```

## API

### PantrixImage

`import com.pantrixui.components.elements.image.PantrixImage`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixImage(
    painter: Painter,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    colorFilter: ColorFilter? = null,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    tagKey: String? = null
)
```

A picture: a photo, an illustration, a logo. Unlike `PantrixIcon`, it keeps its own colours unless `colorFilter` changes them. `contentDescription` describes it for screen readers; leave it null for a decorative picture, which is then hidden from them.

Parameters:

- `painter: Painter`: the picture.
- `modifier: Modifier`: the image's modifier: its size, above all.
- `contentDescription: String?`
- `colorFilter: ColorFilter?`
- `alignment: Alignment`: where the picture stands in its bounds where it does not fill them.
- `contentScale: ContentScale`: how the picture is fitted into its bounds: whole and within them unless told.
- `alpha: Float`: how opaque the picture is drawn, from 0 to 1.
- `tagKey: String?`: the image's automation key: the image is `Image_<tagKey>`. Without one it has no tag.

### PantrixImage

`import com.pantrixui.components.elements.image.PantrixImage`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixImage(
    imageVector: ImageVector,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    colorFilter: ColorFilter? = null,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    tagKey: String? = null
)
```

`PantrixImage` from a vector.

Parameters:

- `imageVector: ImageVector`: the picture, a vector.
- `modifier: Modifier`: the image's modifier: its size, above all.
- `contentDescription: String?`: what a screen reader says the picture shows, or null for a decorative picture, which is then hidden from them.
- `colorFilter: ColorFilter?`: what changes the picture's colours, or null to keep its own.
- `alignment: Alignment`: where the picture stands in its bounds where it does not fill them.
- `contentScale: ContentScale`: how the picture is fitted into its bounds: whole and within them unless told.
- `alpha: Float`: how opaque the picture is drawn, from 0 to 1.
- `tagKey: String?`: the image's automation key: the image is `Image_<tagKey>`. Without one it has no tag.

### PantrixImage

`import com.pantrixui.components.elements.image.PantrixImage`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixImage(
    bitmap: ImageBitmap,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    colorFilter: ColorFilter? = null,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    filterQuality: FilterQuality = DefaultFilterQuality,
    tagKey: String? = null
)
```

`PantrixImage` from a bitmap; `filterQuality` is how it is sampled when it is drawn larger or smaller.

Parameters:

- `bitmap: ImageBitmap`: the picture, a bitmap.
- `modifier: Modifier`: the image's modifier: its size, above all.
- `contentDescription: String?`: what a screen reader says the picture shows, or null for a decorative picture, which is then hidden from them.
- `colorFilter: ColorFilter?`: what changes the picture's colours, or null to keep its own.
- `alignment: Alignment`: where the picture stands in its bounds where it does not fill them.
- `contentScale: ContentScale`: how the picture is fitted into its bounds: whole and within them unless told.
- `alpha: Float`: how opaque the picture is drawn, from 0 to 1.
- `filterQuality: FilterQuality`
- `tagKey: String?`: the image's automation key: the image is `Image_<tagKey>`. Without one it has no tag.
