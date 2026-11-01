# Skeleton

A pale block that stands in for content that has not arrived yet: the lines of a paragraph that is loading, an avatar's circle, an image's rectangle. It shows the shape and the place of the content to come ahead of time; a light band moving across it says something is loading.

It is two components: `PantrixSkeleton` is a single block, `PantrixSkeletonText` the lines of a paragraph. The placeholder for a whole card is a component of its own: `PantrixCardSkeleton`.

- `PantrixSkeleton` (`com.pantrixui.components.elements.skeleton`, `com.pantrixui:components`): A placeholder shaped like the content that is loading, with a shimmer that keeps still under reduced motion. Keywords: placeholder, shimmer, loading placeholder, ghost, content loader.
- `PantrixSkeletonText` (`com.pantrixui.components.elements.skeleton`, `com.pantrixui:components`): Placeholder lines for loading prose, the last one shorter so that it reads as text. Keywords: placeholder text, loading lines, shimmer text, text placeholder.

## Features

- **The caller gives the size.** `PantrixSkeleton` has no size of its own: it is given with `modifier`, the size of the content it stands in for.
- **Shape.** `shape` is the block's corners. Its default is the theme's smallest rounding (`shapes.xs`); in place of an avatar, `shapes.full` draws a circle.
- **Lines.** `PantrixSkeletonText` draws as many lines as `lines` says. The last line is shorter than the others: the block reads as a paragraph. `lineHeight` is the height of the lines.
- **Band.** A lighter band moves across the block, from one end to the other and back. When the system asks for reduced motion the band keeps still, and the block is in its own colour alone.
- **Colours.** `SkeletonColors` is two colours: the block's own (`base`) and the band that moves across it (`highlight`). A colour that is left out stays the theme's role: `disabledContent` and `divider`.
- **On a fill.** A skeleton does not look at the content colour around it: on a fill that is not one of the theme's grounds, the caller gives its colours.
- **Screen reader.** Every skeleton says its `contentDescription`; the default is "Loading" in the theme's language. `PantrixSkeletonText` says it once for all its lines.
- **Announcing once.** In a placeholder made of several skeletons the parts are given `contentDescription = null`, and the parent around them says once that it is loading.

## Usage

### Avatar placeholder

```kotlin
PantrixSkeleton(modifier = Modifier.size(PantrixTheme.spacing.xxl), shape = PantrixTheme.shapes.full)
```

### A loading row, announced once

```kotlin
val loading = PantrixTheme.strings.loading
Row(Modifier.semantics(mergeDescendants = true) { contentDescription = loading }) {
    PantrixSkeleton(
        modifier = Modifier.size(PantrixTheme.spacing.xxl),
        shape = PantrixTheme.shapes.full,
        contentDescription = null
    )
    PantrixSkeletonText(lines = 2, modifier = Modifier.weight(1f), contentDescription = null)
}
```

### On a surface in a colour of its own

```kotlin
val info = PantrixTheme.colors.info
PantrixSurface(color = info.container) {
    PantrixSkeletonText(
        lines = 2,
        colors = SkeletonColors(base = info.onContainer.copy(alpha = 0.3f), highlight = info.container)
    )
}
```

### Paragraph placeholder

```kotlin
PantrixSkeletonText(lines = 3)
```

### Inside a larger placeholder that announces itself

```kotlin
PantrixSkeletonText(lines = 2, lineHeight = PantrixTheme.spacing.sm, contentDescription = null)
```

## Examples

### In place of a paragraph

At its plainest: three lines standing in for a paragraph that is loading. `lines` is the number of lines; the last line is shorter than the others, so the block reads as a paragraph.

The band that moves across them says something is loading; when the system asks for reduced motion the band keeps still. A screen reader says "Loading" once for the three lines.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText

PantrixSkeletonText(lines = 3, modifier = Modifier.fillMaxWidth())
```

### In its own colour

`colors` puts the skeleton in the colours it is given, not the theme's. There are two: `base` is the block's own colour, `highlight` the band that moves across it. Here both are pale versions of the app's own purple: they show whatever the ground is. When the system asks for reduced motion the band keeps still and only `base` shows.

Only a colour that is set changes; one that is left out stays the theme's role.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.components.elements.skeleton.SkeletonColors

val own = ownColors()
PantrixSkeletonText(
    lines = 3,
    modifier = Modifier.fillMaxWidth(),
    colors = SkeletonColors(base = own.color.copy(alpha = 0.35f), highlight = own.color.copy(alpha = 0.15f))
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### A single block and its shape

`PantrixSkeleton` is a single block and has no size of its own: `modifier` gives it its size, that of the content it stands in for. `shape` is the block's corners.

In order: an avatar's circle (`shapes.full`), an image's rectangle (`shapes.md`), a button's pill, and a line that is given no shape. The default shape is the theme's smallest rounding: `shapes.xs`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixSkeleton(modifier = Modifier.size(48.dp), shape = PantrixTheme.shapes.full)
    PantrixSkeleton(modifier = Modifier.size(width = 96.dp, height = 64.dp), shape = PantrixTheme.shapes.md)
    PantrixSkeleton(modifier = Modifier.size(width = 88.dp, height = 32.dp), shape = PantrixTheme.shapes.full)
    PantrixSkeleton(modifier = Modifier.size(width = 120.dp, height = 12.dp))
}
```

### Line height

`lineHeight` is the height of each line; its default is `PantrixTheme.spacing.md`, 12dp. It is chosen to suit the size of the text it stands in for: 8dp at the top for small text, the default in the middle, and 20dp at the bottom for a heading. The space between the lines does not change.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSkeletonText(lines = 2, modifier = Modifier.fillMaxWidth(), lineHeight = PantrixTheme.spacing.sm)
PantrixSkeletonText(lines = 2, modifier = Modifier.fillMaxWidth())
PantrixSkeletonText(lines = 2, modifier = Modifier.fillMaxWidth(), lineHeight = 20.dp)
```

### A row announced once

An avatar and two lines: the skeleton of a list row. If both parts said "Loading", a screen reader would say it twice for the same row.

The parts are given `contentDescription = null`. The row as a whole says once that it is loading, in the theme's own string: `PantrixTheme.strings.loading`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.foundation.theme.PantrixTheme

val loading = PantrixTheme.strings.loading
Row(
    modifier = Modifier.fillMaxWidth().semantics(mergeDescendants = true) { contentDescription = loading },
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSkeleton(modifier = Modifier.size(40.dp), shape = PantrixTheme.shapes.full, contentDescription = null)
    PantrixSkeletonText(lines = 2, modifier = Modifier.weight(1f), contentDescription = null)
}
```

### On a fill

A skeleton does not look at the content colour around it: on a fill that is not one of the theme's grounds, the caller gives its colours. The surface here is in the `info` role's `container`.

`base` is a pale version of the colour written on that surface (`onContainer`), and `highlight` is the surface's own colour: the band looks like an opening that passes through the lines.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.components.elements.skeleton.SkeletonColors
import com.pantrixui.foundation.theme.PantrixTheme

val info = PantrixTheme.colors.info
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = info.container) {
    PantrixSkeletonText(
        lines = 2,
        modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.lg),
        colors = SkeletonColors(base = info.onContainer.copy(alpha = 0.3f), highlight = info.container)
    )
}
```

### Until the content arrives

A skeleton resembles the content it stands in for: a circle of the same size in place of the avatar, two lines in place of two lines of text. Press the button: the content arrives and takes the skeleton's place. The caller decides which of the two is drawn.

While it loads, the circle has no description; the lines beside it say "Loading" once. The lines' tag (`tagKey`) is what a test waits on: once `SkeletonText_profile` is gone, the content has arrived.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loading by rememberSaveable { mutableStateOf(true) }
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    if (loading) {
        PantrixSkeleton(
            modifier = Modifier.size(40.dp),
            shape = PantrixTheme.shapes.full,
            contentDescription = null
        )
        PantrixSkeletonText(lines = 2, modifier = Modifier.weight(1f), tagKey = "profile")
    } else {
        PantrixAvatar(contentDescription = null, initials = "AY", size = 40.dp)
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = "Ayşe Yılmaz", tagKey = "profile_name")
            PantrixText(
                text = "Design team",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
PantrixButton(
    text = if (loading) "Bring in the content" else "Reload",
    onClick = { loading = !loading },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "toggle_profile"
)
```

## API

### PantrixSkeleton

`import com.pantrixui.components.elements.skeleton.PantrixSkeleton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSkeleton(
    modifier: Modifier = Modifier,
    shape: Shape = PantrixTheme.shapes.xs,
    colors: SkeletonColors? = null,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

A placeholder for content still loading: a block in `shape` with a shimmer across it, which keeps still when the system asks for reduced motion. Size it with `modifier`. `colors` are the block's own, where it does not take the theme's. A screen reader hears `contentDescription`, the theme's "loading" string by default; pass null where a parent already announces it. `tagKey` is its automation key: the block is `Skeleton_<tagKey>`, and a test knows the content has arrived when it is gone. Without one it has no tag.

Parameters:

- `modifier: Modifier`
- `shape: Shape`
- `colors: SkeletonColors?`
- `contentDescription: String?`
- `tagKey: String?`

### PantrixSkeletonText

`import com.pantrixui.components.elements.skeleton.PantrixSkeletonText`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSkeletonText(
    lines: Int,
    modifier: Modifier = Modifier,
    lineHeight: Dp = PantrixTheme.spacing.md,
    colors: SkeletonColors? = null,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

A placeholder for a paragraph: `lines` skeleton lines `lineHeight` tall, the last one shorter, each in `colors` where they are not the theme's. The column carries one `contentDescription` for all of them.

Parameters:

- `lines: Int`
- `modifier: Modifier`: the column's modifier: its width, above all.
- `lineHeight: Dp`
- `colors: SkeletonColors?`
- `contentDescription: String?`
- `tagKey: String?`: the column's automation key: it is `SkeletonText_<tagKey>`, and its lines have no tags of their own. Without one it has no tag.

### SkeletonColors

`import com.pantrixui.components.elements.skeleton.SkeletonColors`, from `com.pantrixui:components`

```kotlin
data class SkeletonColors(
    public val base: Color = Color.Unspecified,
    public val highlight: Color = Color.Unspecified
)
```

What `PantrixSkeleton` and `PantrixSkeletonText` are painted with, for a placeholder that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role.

```kotlin
PantrixSkeletonText(lines = 3, colors = SkeletonColors(base = brand.container))
```

Parameters:

- `base: Color`: The block's own colour, and all of it under reduced motion. The theme's `disabledContent`.
- `highlight: Color`: The lighter band that moves across the block. The theme's `divider`.
