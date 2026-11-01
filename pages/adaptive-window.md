# Window classes

The window the theme gives: the width class and the height class of the window the content is drawn in, its size and how its device is folded. Nothing is set up for it: `PantrixTheme` provides it, and every composable inside the theme reads it with `PantrixTheme.window`.

It is the window, not the device and not the screen: an app in half of a split screen, in a resized desktop window or in a browser tab is as wide as that. A layout asks the class rather than the size. The examples on this page show the window's answer as it is now: the values change when you turn the phone, or narrow and widen the window on the desktop and in a browser. The window selector in the card of most examples shows the same answers without touching the window: "Narrow", "Medium", "Short" and "Wide" give that example a fixed window, and "Real" the app's. The four are in four different width classes: `Compact`, `Medium`, `Expanded` and `Large`. On the selector of the examples that look at the fold, "Book" and "Table" stand too: the inner screen of a phone that folds, held half open; the fold is upright in one and lying across in the other.

## Features

- **Five width classes.** `widthClass`: `Compact` is narrower than 600 dp, `Medium` is from 600 dp, `Expanded` from 840, `Large` from 1200 and `ExtraLarge` from 1600. The classes are in order: "from this width on" is a comparison, `widthClass >= WindowWidthClass.Expanded`.
- **Three height classes.** `heightClass`: `Compact` is shorter than 480 dp, `Medium` is from 480 dp and `Expanded` from 900. A layout follows the width first; the height says when there is no room left to stack things.
- **Yes or no.** `isNarrow` says the width class is `Compact`, and `isShort` that the height class is: a phone held upright is narrow, one on its side is short.
- **A value by class.** `byWidth`, `byHeight` and `byPosture` pick a value by the window's class or its posture: a number of columns, a spacing, a type style. A class left out takes the value of the class below it.
- **The short form.** `responsive(...)` is `byWidth` of the theme's window: one word, for a composable that does not need the window itself.
- **The page's measures.** `PantrixTheme.layout` gives the page's margin (`margin`), the gutter between columns (`gutter`), how many columns its grid has (`columns`) and how wide its content grows at the most (`maxContentWidth`) by the window's class; the theme's density scales the air, and neither the columns nor the widest.
- **Spanning columns.** `layout.spanWidth(available, span)` is the width of a part a few columns wide; `Modifier.maxContentWidth()` keeps content to the theme's widest, at the start or in the middle.
- **A threshold of your own.** `rememberWindowIsAtLeast(width)` asks about a width none of the classes begins at, and recomposes only when the window crosses that width.
- **Recomposition.** Whoever reads the class is recomposed only when the class changes; whoever reads `size`, at every change.
- **Fold posture.** `posture` says how the device is folded: like a book (`isBook`), like a laptop on a table (`isTabletop`), or flat. It is read from the system on Android, in the browsers that report it and, from iOS 27.1 on, on an iPhone that folds; the desktop reports no fold, and the posture there is flat.
- **Vertical bar.** `verticalBar` is the column the system keeps along one edge of the window for bars that stand upright: on the iPhone Duo's outer screen, from iOS 27.1 on. On every other screen it is null. `rememberVerticalBarInNode()` gives the column in a node's own coordinates; `PantrixScaffold` puts the navigation and the top bar's buttons there.
- **Breakpoints of your own.** Where the classes begin is `PantrixBreakpoints`; the default is Android's window size classes. A product gives the theme its own breakpoints with `rememberPantrixWindow(breakpoints = ...)`.

## Examples

### Width class and height class

`PantrixTheme.window` gives the window; a layout asks its class. On a phone held upright the width is `Compact`; on most phones turned on their side the width becomes `Expanded` and the height `Compact`. A desktop window is `Large` from 1200 dp and `ExtraLarge` from 1600 dp: take it by the edge and narrow it, and the classes change one after another. In the card's window selector "Narrow" shows a `Compact` width, "Medium" a `Medium` one, "Short" an `Expanded` one and "Wide" a `Large` one; the height is `Compact` in "Short", `Expanded` in "Medium" and `Medium` in the other two.

A composable that reads the class is composed again only when the class changes: while the window grows and shrinks inside a class, this example stays as it is. The last line looks at the height class: a `WindowHeightClass.Compact` window has no room for a bar at the bottom.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowHeightClass
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
PantrixText(text = "Width class: ${window.widthClass.name}", tagKey = "width_class")
PantrixText(text = "Height class: ${window.heightClass.name}", tagKey = "height_class")
val bars = if (window.heightClass == WindowHeightClass.Compact) "no bar at the bottom" else "a bar at the bottom"
PantrixText(text = "By the height: $bars", tagKey = "bars_by_height")
```

### Is it narrow, is it short?

`isNarrow` says the width class is `Compact`, as a phone held upright is: it is the question of the layout of one pane, with its navigation along the bottom. `isShort` says the height class is `Compact`, as a phone on its side is; such a window is often wide, but has no height to stack bars in along the bottom.

On a phone held upright the first says yes and the second no; turn the phone on its side and on most phones it is the other way round. On the desktop the answer changes when the window is made narrower than 600 dp or shorter than 480 dp. In the card's window selector "Narrow" says yes to the first and "Short" to the second; "Medium" and "Wide" say no to both. For "from this width on", compare the class: `widthClass >= WindowWidthClass.Expanded`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
PantrixText(text = "isNarrow: ${if (window.isNarrow) "yes" else "no"}", tagKey = "is_narrow")
PantrixText(text = "isShort: ${if (window.isShort) "yes" else "no"}", tagKey = "is_short")
```

### Number of columns by class

`byWidth` picks a value by the window's width class. Here it is the number of columns: with `byWidth(compact = 2, medium = 4)` the boxes stand two to a row in a narrow window, and all four side by side from 600 dp on. A class left out takes the value of the class below it: `Expanded` and those after it are 4 too. Try "Narrow" and "Wide" in the card's window selector, turn the phone, or narrow the window to under 600 dp: the arrangement changes.

The gap between the boxes, at their sides and under them alike, is the theme's gutter: `PantrixTheme.layout.gutter`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.theme.PantrixTheme

val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
val gutter = PantrixTheme.layout.gutter
Column(verticalArrangement = Arrangement.spacedBy(gutter)) {
    KPIS.withIndex().chunked(columns).forEach { row ->
        Row(horizontalArrangement = Arrangement.spacedBy(gutter)) {
            row.forEach { (index, kpi) ->
                val (name, count) = kpi
                PantrixCard(
                    modifier = Modifier.weight(1f),
                    variant = CardVariant.Filled,
                    contentPadding = PaddingValues(PantrixTheme.spacing.md),
                    tagKey = "kpi_$index"
                ) {
                    PantrixText(text = count, style = PantrixTheme.typography.title)
                    PantrixText(text = name, style = PantrixTheme.typography.footnote)
                }
            }
        }
    }
}

private val KPIS = listOf("Apps" to "12", "Builds" to "48", "Testers" to "310", "Invites" to "5")
```

### A value by height

`byHeight` does the same with the height class: it makes a value smaller where height is scarce. Here it is a bar's height: 44 dp in a short window, 56 dp in the others. Pick "Short" in the card's window selector, turn the phone on its side or make the window shorter than 480 dp, and the bar gets lower.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byHeight
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
PantrixSurface(
    modifier = Modifier.fillMaxWidth().height(barHeight),
    color = PantrixTheme.colors.primary.container
) {
    PantrixText(
        text = "byHeight: a bar ${barHeight.value.roundToInt()} dp tall",
        modifier = Modifier.align(Alignment.CenterStart).padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "by_height"
    )
}
```

### The short form: responsive

`responsive(...)` is `byWidth` of the theme's window, in one word: it is for a composable that wants a single value and does not need the window itself. Here it is the number of columns of a form: 1 in `Compact`, 2 from `Medium` on, 3 from `Large` on. `Expanded` is left out and takes the value of `Medium`, and `ExtraLarge` that of `Large`. In the card's window selector "Narrow" says 1 column, "Medium" and "Short" 2, and "Wide" 3.

It goes by the width alone and is called only inside a composable; for the height, ask the window. The caller is recomposed when the class changes, and not as the window is resized within it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.responsive

val formColumns = responsive(compact = 1, medium = 2, large = 3)
PantrixText(text = "responsive: a $formColumns-column form", tagKey = "responsive")
```

### Layout measures

`PantrixTheme.layout` gives the page's measures for this window's class; they are not chosen by hand. `margin` is the room at the page's sides: 16 on a phone, 24 from 600 dp, 32 from 1200 dp. Every page of this app pads its content by it; as the window grows, the page's edges open. `gutter` is the room between columns and between panes side by side: 16, and 24 from 840 dp. `columns` is how many columns the grid has: 4, 8 from 600 dp, 12 from 840 dp. `maxContentWidth` is how wide the content grows at the most: without a bound up to 1200 dp, then 1040 dp. Try "Narrow" and "Wide" in the card's window picker: the numbers grow.

The margin and the gutter are air: the theme's density scales them with the spacing scale. The columns are a count and the widest is a measure of the content; the density does not change them. Change the density in "Settings": the first two numbers change. The reader is composed again when the window's class changes.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.Dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.PantrixLayout
import com.pantrixui.foundation.adaptive.maxContentWidth
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val layout: PantrixLayout = PantrixTheme.layout
PantrixText(
    text = "layout.margin: ${layout.margin.value.roundToInt()} dp at the page's sides",
    tagKey = "layout_margin"
)
PantrixText(
    text = "layout.gutter: ${layout.gutter.value.roundToInt()} dp between columns",
    tagKey = "layout_gutter"
)
PantrixText(text = "layout.columns: a grid of ${layout.columns} columns", tagKey = "layout_columns")
PantrixText(
    text = "layout.maxContentWidth: " + if (layout.maxContentWidth == Dp.Infinity) {
        "no bound"
    } else {
        "${layout.maxContentWidth.value.roundToInt()} dp"
    },
    tagKey = "layout_max_content_width"
)
```

### A grid of columns

The page's grid: each strip a column, the theme's gutter between them. `layout.columns` is 4 on a phone, 8 from 600 dp and 12 from 840 dp; the columns share the room inside the page's margins. Try "Narrow", "Medium" and "Wide" in the card's window picker: the number of strips changes.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val layout = PantrixTheme.layout
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    Row(
        modifier = Modifier.fillMaxWidth().height(96.dp),
        horizontalArrangement = Arrangement.spacedBy(layout.gutter)
    ) {
        repeat(layout.columns) { index ->
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(colors.primary.container, PantrixTheme.shapes.sm),
                contentAlignment = Alignment.Center
            ) {
                PantrixText(
                    text = "${index + 1}",
                    style = PantrixTheme.typography.caption,
                    color = colors.primary.onContainer
                )
            }
        }
    }
    PantrixText(
        text = "${PantrixTheme.window.widthClass.name}: ${layout.columns} columns, " +
            "${layout.gutter.value.roundToInt()} dp between them",
        style = PantrixTheme.typography.footnote,
        color = colors.textSecondary,
        tagKey = "grid_columns"
    )
}
```

### Parts spanning columns

`layout.spanWidth(available, span)` gives the width of a part a few columns wide: its columns, and the gutters between them. Here an article and the links beside it. On a phone both are 4 columns, one above the other; from 600 dp 5 and 3 columns, and from 840 dp 8 and 4 columns, side by side. Two parts side by side and the gutter between them fill the row exactly. `byWidth` chooses how many columns each part has.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val layout = PantrixTheme.layout
val (article, links) = PantrixTheme.window.byWidth(compact = 4 to 4, medium = 5 to 3, expanded = 8 to 4)
BoxWithConstraints(modifier = Modifier.fillMaxWidth()) {
    val articleWidth = layout.spanWidth(maxWidth, span = article)
    val linksWidth = layout.spanWidth(maxWidth, span = links)
    if (article + links <= layout.columns) {
        Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
            SpannedPart(name = "Article", span = article, width = articleWidth, tagKey = "span_article")
            SpannedPart(name = "Links", span = links, width = linksWidth, tagKey = "span_links")
        }
    } else {
        Column(verticalArrangement = Arrangement.spacedBy(layout.gutter)) {
            SpannedPart(name = "Article", span = article, width = articleWidth, tagKey = "span_article")
            SpannedPart(name = "Links", span = links, width = linksWidth, tagKey = "span_links")
        }
    }
}

@Composable
private fun SpannedPart(
    name: String,
    span: Int,
    width: Dp,
    tagKey: String
) {
    PantrixCard(
        modifier = Modifier.width(width),
        variant = CardVariant.Filled,
        contentPadding = PaddingValues(PantrixTheme.spacing.md),
        tagKey = tagKey
    ) {
        PantrixText(text = name, style = PantrixTheme.typography.title)
        PantrixText(
            text = "$span columns · ${width.value.roundToInt()} dp",
            style = PantrixTheme.typography.footnote,
            tagKey = "${tagKey}_width"
        )
    }
}
```

### The content's widest

`Modifier.maxContentWidth()` keeps content to the theme's widest: 1040 dp in a window wider than 1200 dp, and no bound in a narrower one. A line that runs across a desktop window is not read; the rest of the room is left empty beside the content. The content is aligned at the start or in the middle: at the start, in line with its title; in the middle, with as much room on either side. Pick "Wide" in the card's window picker: the text stops at 1040 dp and the frame reaches past it. In "Medium" the text is as wide as the frame.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.maxContentWidth
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var centred by rememberSaveable { mutableStateOf(false) }
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "At the start", tagKey = "content_start"),
            SegmentOption(true, "In the middle", tagKey = "content_centre")
        ),
        selected = centred,
        onSelect = { centred = it },
        fullWidth = false,
        tagKey = "content_alignment"
    )
    // The page's room: the content reaches across it up to its widest.
    Box(modifier = Modifier.fillMaxWidth().border(1.dp, colors.border, PantrixTheme.shapes.sm)) {
        PantrixSurface(
            modifier = Modifier.maxContentWidth(if (centred) Alignment.CenterHorizontally else Alignment.Start),
            color = colors.primary.container
        ) {
            PantrixText(
                text = "A paragraph that runs across a desktop window loses the eye on its way back from the end of a line to the " +
                    "start of the next. The content stops at a width, and the rest of the window is left empty beside " +
                    "it.",
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                color = colors.primary.onContainer,
                tagKey = "content_text"
            )
        }
    }
    val widest = PantrixTheme.layout.maxContentWidth
    PantrixText(
        text = "${PantrixTheme.window.widthClass.name}: at the most " +
            if (widest == Dp.Infinity) "no bound" else "${widest.value.roundToInt()} dp",
        style = PantrixTheme.typography.footnote,
        color = colors.textSecondary,
        tagKey = "content_width"
    )
}
```

### A threshold that fits none of the classes

`rememberWindowIsAtLeast(1000.dp)`: whether the window is at least 1000 dp wide. It is for a threshold of one screen's own, which neither `Expanded`, beginning at 840, nor `Large`, beginning at 1200, meets. On the desktop, drag the window's edge to either side of 1000 dp: that is where the answer changes. In the card's window selector "Narrow", "Medium" and "Short" say no, and "Wide" says yes.

This composable is recomposed only when the window crosses 1000 dp; asking the same as `window.size.width >= 1000.dp` would recompose it at every size.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.rememberWindowIsAtLeast

val threeColumns = rememberWindowIsAtLeast(1000.dp)
PantrixText(
    text = "rememberWindowIsAtLeast(1000.dp): ${if (threeColumns) "yes, three columns" else "no, two columns"}",
    tagKey = "at_least_1000"
)
```

### The window's size

`size` is the window's size. Whoever reads it follows every change: it is recomposed at each frame of a rotation and at each pixel of a dragged window edge. So it is not read for a layout decision. Here it is only shown; since this example reads it in a composable of its own, the rest of the page is left alone while the window is dragged.

`isSizeKnown` is false until the platform has told the size. Android and iOS tell the size from the start; on the desktop and on the web the content is first composed before the window has a size, and at that moment the window reads as `Compact` both ways. A decision that is made once and kept, such as a start page, waits for this.

The "Narrow", "Medium", "Short" and "Wide" windows of the card's window selector are fixed sizes: here that size is shown, and it is known from the start.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val window = PantrixTheme.window
val size = window.size
// Until the size is known the number to show would be zero; it says the size is not known instead.
val words = if (window.isSizeKnown) {
    "${size.width.value.roundToInt()} × ${size.height.value.roundToInt()} dp"
} else {
    "not known yet"
}
PantrixText(text = "Size: $words", tagKey = "size")
PantrixText(text = "isSizeKnown: ${if (window.isSizeKnown) "yes" else "no"}", tagKey = "is_size_known")
```

### Fold posture

`posture` says how the device is folded. A layout is written for two postures: `isBook` is half open with the fold upright (two panes side by side, split at the fold), `isTabletop` is half open with the fold lying across (what is looked at above, controls below). A single-screen foldable opened flat has a fold, but it separates nothing; the hinge of a two-screen device separates the window even when it is opened flat (`separatingFold`).

`byPosture` picks a value by posture; a posture left out takes the value of `flat`, so nothing changes on a device that does not fold. On a phone that does not fold and on the desktop it says "Flat" and "one piece" here; the others are seen on a foldable Android device or its emulator, and on the iPhone Duo of iOS 27.1. Pick "Book" and "Table" in the card's window selector: both are fixed windows with a fold held half open. The last line still says what is real: what the system says does not depend on the window the example is given.

Each fold is a `WindowFold`: its orientation, whether it is half open, whether it separates the window, whether it occludes something. The theme's window reads the posture from the system, `systemWindowPosture()`; the last line asks it directly.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowFold
import com.pantrixui.foundation.adaptive.WindowPosture
import com.pantrixui.foundation.adaptive.byPosture
import com.pantrixui.foundation.adaptive.systemWindowPosture
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
val posture: WindowPosture = window.posture
val named = when {
    posture.isBook -> "Book (half open, fold upright)"
    posture.isTabletop -> "Tabletop (half open, fold lying across)"
    posture.separatingFold != null -> "Flat, two screens (the hinge separates the window)"
    posture.folds.isNotEmpty() -> "Flat (there is a fold, the screen is one piece)"
    else -> "Flat"
}
// How the two halves lie, by posture: side by side in a book, one above the other on a table, one piece otherwise.
val halves = window.byPosture(flat = "one piece", book = "two halves side by side", tabletop = "two halves, one above the other")
PantrixText(text = "Posture: $named", tagKey = "posture")
PantrixText(text = "byPosture: $halves", tagKey = "by_posture")
posture.folds.forEach { fold: WindowFold ->
    PantrixText(
        text = "Fold: ${fold.orientation.name}, half open: ${if (fold.isHalfOpened) "yes" else "no"}, " +
            "separating: ${if (fold.isSeparating) "yes" else "no"}, occluding: ${if (fold.isOccluding) "yes" else "no"}",
        style = PantrixTheme.typography.footnote
    )
}
PantrixText(
    text = "Folds the system reports: ${systemWindowPosture().folds.size}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

### The system's vertical bar

On the iPhone Duo's outer screen, from iOS 27.1 on, the system keeps a column along one edge of the window for bars that stand upright: the status bar at its top and the app's bars below it. The window tells of it with `verticalBar`, a `WindowVerticalBar`: the column itself (`bounds`) and the bars' place (`barBounds`), in the window's pixels. On every other screen it is null. Pick "Cover" in the card's window selector.

A layout asks where the column is beside it with `rememberVerticalBarInNode()`: it puts its `modifier` on its node, and `verticalBar` comes in that node's coordinates; it is null where the node does not reach the column. In the box the column is drawn in a faint fill and the bars' place in a frame. `PantrixScaffold` puts the navigation and the top bar's buttons there this way.

The last line asks the system directly, `systemVerticalBar()`: it does not depend on the window the example is given, and tells of a column only on the Duo's outer screen. A preview or a test builds a screen with a column with `PantrixWindow(size, verticalBar = WindowVerticalBar(...))`; the card's "Cover" is built so.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.VerticalBarInNode
import com.pantrixui.foundation.adaptive.WindowVerticalBar
import com.pantrixui.foundation.adaptive.rememberVerticalBarInNode
import com.pantrixui.foundation.adaptive.systemVerticalBar
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val density = LocalDensity.current
val bar: WindowVerticalBar? = PantrixTheme.window.verticalBar
val said = bar?.let {
    with(density) {
        "a ${it.bounds.width.toDp().value.roundToInt()} dp column; the bars' place is " +
            "between ${it.barBounds.top.toDp().value.roundToInt()} and ${it.barBounds.bottom.toDp().value.roundToInt()} dp"
    }
}
PantrixText(text = "Vertical bar: ${said ?: "none"}", tagKey = "vertical_bar")
val inNode: VerticalBarInNode = rememberVerticalBarInNode()
val column = PantrixTheme.colors.textPrimary.copy(alpha = 0.08f)
val place = PantrixTheme.colors.primary.color
Box(
    modifier = Modifier
        .fillMaxWidth()
        .height(400.dp)
        .then(inNode.modifier)
        .border(1.dp, PantrixTheme.colors.divider)
        .clipToBounds()
        .drawBehind {
            inNode.verticalBar?.let { here ->
                drawRect(color = column, topLeft = here.bounds.topLeft, size = here.bounds.size)
                drawRect(
                    color = place,
                    topLeft = here.barBounds.topLeft,
                    size = here.barBounds.size,
                    style = Stroke(width = 1.dp.toPx())
                )
            }
        }
) {
    PantrixText(
        text = if (inNode.verticalBar == null) "The box does not reach the column" else "The box reaches the column",
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        tagKey = "bar_in_box"
    )
}
PantrixText(
    text = "What the system says: ${if (systemVerticalBar() == null) "no vertical bar" else "a vertical bar"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

### What a layout would pick in this window

The helpers put together: what a layout would pick in this window. Where the navigation goes, how many panes there are and where the main action goes. The rules are in this example's code and are an example for a product's layout; they are not the library's rule.

On a phone held upright the answer is a tab bar at the bottom, one pane and a fixed action bar at the bottom. With the phone on its side the navigation moves to the side and the action goes up into the header: in a short window no bars are stacked along the bottom. From 840 dp the list and the detail come side by side; from 1200 dp the navigation becomes a sidebar and the layout that of a web page. Try "Narrow", "Medium", "Short" and "Wide" in the card's window selector: each of the four gives a different layout. In the book posture the two panes part exactly at the fold; the upright hinge of a two-screen device parts the panes there even when it is opened flat.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.byPosture
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
// In the tabletop posture the lower half is where the controls go. In a short window the rail stays at the side
// but carries the tab bar's five items: more than that do not fit in that height.
val navigation = when {
    window.posture.isTabletop -> "Tab bar in the lower half"
    window.isNarrow -> "Tab bar at the bottom"
    window.isShort -> "Rail at the side, with five items (short window)"
    window.widthClass >= WindowWidthClass.Large -> "Sidebar and top bar"
    else -> "Labelled rail at the side"
}
// The number of panes: by posture first, and by width in a flat window. Two helpers, one inside the other:
// `byWidth` picks the `flat` value of `byPosture`.
val atTheHinge = "Two panes, split at the fold"
val hingeBetweenScreens = window.posture.separatingFold?.orientation == FoldOrientation.Vertical
val byItsWidth = window.byWidth(
    compact = "One pane; the detail opens over it",
    medium = "One wide pane",
    expanded = "List (340 dp) and detail side by side",
    large = "Web page layout"
)
val panes = window.byPosture(
    flat = if (hingeBetweenScreens) atTheHinge else byItsWidth,
    book = atTheHinge,
    tabletop = "What is looked at in the upper half, controls in the lower"
)
// The main action stays fixed at the bottom only on a phone held upright.
val mainAction = if (window.isNarrow && !window.isShort) "Fixed bar at the bottom" else "Button in the header"
PantrixText(text = "Navigation: $navigation", tagKey = "navigation")
PantrixText(text = "Panes: $panes", tagKey = "panes")
PantrixText(text = "Main action: $mainAction", tagKey = "main_action")
```

### A window classed by breakpoints of its own

The breakpoints of the classes are `PantrixBreakpoints`. The default is Android's window size classes: 600, 840, 1200 and 1600 dp in width, 480 and 900 dp in height. A product whose layouts change at other widths gives the theme its own breakpoints, `PantrixTheme(window = rememberPantrixWindow(breakpoints = ...))`, and every helper follows them.

Here the same width is classed by two sets of breakpoints: those of the theme's window, and those of a product whose `Medium` begins at 360 dp. A phone held upright that is at least 360 dp wide is `Compact` by the first and `Medium` by the second; from 600 dp on the two give the same answer. In the card's window selector "Narrow" is such a phone; in "Wide" both lines say `Large`.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.PantrixBreakpoints
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
val own = PantrixBreakpoints(medium = 360.dp)
PantrixText(text = "By the theme's breakpoints: ${window.widthClass.name}", tagKey = "theme_breakpoints")
// Classing by hand reads the size: this example is recomposed at every size of the window. A product does not
// do this: it gives its breakpoints to the theme.
PantrixText(
    text = "If Medium begins at 360 dp: ${own.widthClassOf(window.size.width).name}",
    tagKey = "own_breakpoints"
)
```

### Your own breakpoints and layout measures

A product's own breakpoints and own layout measures, in a theme. The inner theme was given a window whose `Medium` starts at 360 dp, with `rememberPantrixWindow(breakpoints = …)`, and margins of its own with `PantrixLayouts(…)`: a 360 dp phone is `Medium` there, and the page's margin is 28 dp. The last line reads the library's own measures (`rememberPantrixLayouts()`) and the theme's measures directly (`LocalPantrixLayouts`).

This example's card has no window picker: the inner theme reads the window itself, from the device.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.LocalPantrixLayouts
import com.pantrixui.foundation.adaptive.PantrixBreakpoints
import com.pantrixui.foundation.adaptive.PantrixLayout
import com.pantrixui.foundation.adaptive.PantrixLayouts
import com.pantrixui.foundation.adaptive.rememberPantrixLayouts
import com.pantrixui.foundation.adaptive.rememberPantrixWindow
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val library = rememberPantrixLayouts()
val window = rememberPantrixWindow(breakpoints = PantrixBreakpoints(medium = 360.dp))
PantrixTheme(window = window, layouts = OWN_LAYOUTS) {
    PantrixText(text = "Width class: ${PantrixTheme.window.widthClass.name}", tagKey = "own_width_class")
    PantrixText(text = "The page's margin: ${PantrixTheme.layout.margin.value.roundToInt()} dp", tagKey = "own_margin")
    PantrixText(
        text = "The library's Medium margin: ${library.medium.margin.value.roundToInt()} dp · this theme's: " +
            "${LocalPantrixLayouts.current.medium.margin.value.roundToInt()} dp",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val OWN_LAYOUTS = PantrixLayouts(
    compact = PantrixLayout(margin = 20.dp, gutter = 12.dp),
    medium = PantrixLayout(margin = 28.dp, gutter = 16.dp),
    expanded = PantrixLayout(margin = 32.dp, gutter = 20.dp)
)
```

## API

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
interface PantrixWindow
```

The window the content is drawn in, as a layout needs to know it: how wide and how tall it is, and how its device is folded. `PantrixTheme` provides it, and `PantrixTheme.window` reads it: nothing is set up for it.

It is the window, not the device and not the screen: an app in half of a split screen, in a resized desktop window or in a browser tab is as wide as that. A layout asks the class rather than the size:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

The window is one object for as long as the theme stands, and its values are read when asked. Whoever reads `widthClass` or `heightClass` is composed again when the class changes and not before; whoever reads `size` follows every change, each frame of a rotation and each pixel of a dragged window edge.

A component that is a pane of its own, a scaffold or a sheet, measures the room it is given rather than asking the window: inside a narrow pane the window is still wide. `BoxWithPantrixWindow` tells a component that room as a window.

On the desktop and on the web the window has no size yet when its content is first composed, and that one composition finds a Compact window; Android and iOS tell the size from the start. Read the class where it is used rather than keeping what it was at first.

Members:

- `size: DpSize`: The window's size. On Android it is the window with its system bars; on the web, the box the app is drawn in. Zero, or unspecified, until the platform has told it: the classes are Compact until then.
- `isSizeKnown: Boolean`: Whether the platform has told the window's size: both its width and its height.

  True from the first composition on Android and iOS. False in the first composition on the desktop and on the web, where the content is composed once before the window has a size, and true from the next one on. Until then the window reads as Compact both ways, so whatever is decided once and kept, a start page or a remembered choice, waits for this:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  A reader is composed again when the answer changes, and not as the window is resized.
- `widthClass: WindowWidthClass`: The class of the window's width: what the layout is chosen by.
- `heightClass: WindowHeightClass`: The class of the window's height: `WindowHeightClass.Compact` is a phone on its side.
- `posture: WindowPosture`: How the window's device is folded; `WindowPosture.Flat` where there is no fold.
- `verticalBar: WindowVerticalBar?`: The column the system keeps along one side of the window for bars that stand upright, or null where it keeps none, as on every screen but the iPhone Duo's outer one. Its places are in the window's coordinates: a layout asks where it stands beside it with `rememberVerticalBarInNode`.
- `breakpoints: PantrixBreakpoints`: Where this window's classes begin: the bounds it is classed by. A size classed by hand goes by the same bounds, as `BoxWithPantrixWindow` classes the room a component is given:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

A window of fixed values, for where the real one is not the answer: a test or a preview of a layout at a size, and Compose embedded in a part of a native screen, where the room is that part's.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

A `verticalBar` given in pixels draws what a screen with the system's column looks like, the iPhone Duo's outer one, where there is none.

Parameters:

- `size: DpSize`: the window's size, which its width and height classes come from.
- `posture: WindowPosture`: how the window's device is folded: flat, as every device with no fold is, unless a fold is given.
- `breakpoints: PantrixBreakpoints`: the widths and heights each class starts at: Android's window size classes unless the product has its own.
- `verticalBar: WindowVerticalBar?`

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Whether the window is narrow: its width class is `WindowWidthClass.Compact`, as a phone held upright is. The layout of one pane, with its navigation along the bottom.

A name for `widthClass == WindowWidthClass.Compact`, for code that reads as the rule it follows: `if (window.isNarrow) BottomBar()`. For "from this width on", compare the class: `widthClass >= Expanded`.

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isShort: Boolean
```

Whether the window is short: its height class is `WindowHeightClass.Compact`, as a phone on its side is. Such a window is often wide, Medium or Expanded by its width, and has no height to stack bars in: the main action goes to the header and not to a bar along the bottom, and nothing opens from the bottom edge.

A name for `heightClass == WindowHeightClass.Compact`:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

The value of this window's width class. A class left out takes the value of the class below it, so a layout names only the widths it changes at:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parameters:

- `compact: T`: the value in a Compact window, the narrowest class.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window; `medium`'s where it is left out.
- `large: T`: the value in a Large window; `expanded`'s where it is left out.
- `extraLarge: T`: the value in an ExtraLarge window, the widest class; `large`'s where it is left out.

### PantrixWindow.byHeight

`import com.pantrixui.foundation.adaptive.byHeight`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byHeight(
    compact: T,
    medium: T = compact,
    expanded: T = medium
): T
```

The value of this window's height class. A class left out takes the value of the class below it:

```kotlin
val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
```

Parameters:

- `compact: T`: the value in a Compact window, the shortest class: a phone held sideways.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window, the tallest class; `medium`'s where it is left out.

### PantrixWindow.byPosture

`import com.pantrixui.foundation.adaptive.byPosture`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byPosture(
    flat: T,
    book: T = flat,
    tabletop: T = flat
): T
```

The value of this window's posture: `book` while the device is held half open like a book, its fold upright; `tabletop` while it is held like a laptop on a table, its fold lying across; `flat` the rest of the time, which is every device with no fold and a foldable opened flat. A posture left out takes `flat`'s value, so a layout names only the postures it changes in:

```kotlin
// Two panes side by side in a book, one above the other on a table, and one pane otherwise.
val panes = PantrixTheme.window.byPosture(flat = Panes.One, book = Panes.SideBySide, tabletop = Panes.Stacked)
```

A device folded both ways at once is taken as a book. The third of a family with `byWidth` and `byHeight`.

Parameters:

- `flat: T`
- `book: T`
- `tabletop: T`

### responsive

`import com.pantrixui.foundation.adaptive.responsive`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun <T> responsive(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

The value of the width class of the window in effect: `byWidth` of `PantrixTheme.window` in one word, for a composable that needs a value and not the window. A class left out takes the value of the class below it:

```kotlin
val columns = responsive(compact = 2, medium = 4)
val cardPadding = responsive(compact = 12.dp, medium = 16.dp, large = 20.dp)
```

The page's margin and the gutter between its columns need no picking: `PantrixTheme.layout` has them by class. The caller is composed again when the class changes and not as the window is resized within it. It goes by the width alone; for the height, and outside a composable, ask the window: `byHeight`, `byWidth`.

Parameters:

- `compact: T`: the value in a Compact window, the narrowest class.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window; `medium`'s where it is left out.
- `large: T`: the value in a Large window; `expanded`'s where it is left out.
- `extraLarge: T`: the value in an ExtraLarge window, the widest class; `large`'s where it is left out.

### rememberWindowIsAtLeast

`import com.pantrixui.foundation.adaptive.rememberWindowIsAtLeast`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberWindowIsAtLeast(width: Dp): Boolean
```

Whether the window in effect is at least `width` wide: for a layout that changes at a width none of the classes begins at.

```kotlin
// A third column from 1000dp on, which is neither Expanded's 840 nor Large's 1200.
val threeColumns = rememberWindowIsAtLeast(1000.dp)
```

The caller is composed again when the window crosses `width`, either way, and not while it is resized on one side of it. `PantrixTheme.window.size.width >= width` asks the same, and its reader is composed again at every size: each frame of a rotation, each pixel of a dragged window edge.

While the window's size is not known its width counts as zero, so the answer is false. Where every layout of a product changes at the same widths, give the window those instead: `PantrixBreakpoints`.

Parameters:

- `width: Dp`

### rememberPantrixWindow

`import com.pantrixui.foundation.adaptive.rememberPantrixWindow`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixWindow(
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    posture: WindowPosture = systemWindowPosture(),
    verticalBar: WindowVerticalBar? = systemVerticalBar()
): PantrixWindow
```

The window Compose reports, classed by `breakpoints`, folded as `posture` says and with the system's `verticalBar`: what `PantrixTheme` provides when it is given none.

Give it to the theme to class by breakpoints of the product's own, or to tell a fold the system does not:

```kotlin
PantrixTheme(window = rememberPantrixWindow(breakpoints = PantrixBreakpoints(medium = 640.dp))) { … }
```

The window stays the same object while `posture` and `verticalBar` change; it is replaced when `breakpoints` are.

Parameters:

- `breakpoints: PantrixBreakpoints`
- `posture: WindowPosture`
- `verticalBar: WindowVerticalBar?`

### systemWindowPosture

`import com.pantrixui.foundation.adaptive.systemWindowPosture`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemWindowPosture(): WindowPosture
```

The posture the system reports for this window, followed as the device is folded, opened and turned.

Android tells its folds through Jetpack WindowManager, a browser through its Device Posture and Viewport Segments APIs, which Chromium has, and iOS from 27.1 on through UIKit's hinge and its reserved regions. The desktop tells of none, and neither does an iOS before 27.1 or a library built with an Xcode before 27.1: the posture there is `WindowPosture.Flat`. An app that reads a fold by its own means gives its posture to `rememberPantrixWindow` instead.

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowWidthClass
```

How wide a window is, as one of five classes a layout chooses by: the shape of its navigation, the number of its panes, the columns of a grid.

The classes are in order, so a rule that holds from a width on is a comparison: `widthClass >= WindowWidthClass.Expanded`. `PantrixBreakpoints` says where each begins.

Entries:

- `Compact`: Narrower than 600dp: a phone held upright, a foldable's cover screen, a narrow browser window.
- `Medium`: From 600dp: an open foldable, a tablet held upright, a split view.
- `Expanded`: From 840dp: a tablet on its side, and most phones on theirs (see `WindowHeightClass.Compact`).
- `Large`: From 1200dp: a desktop window, a browser, a large tablet.
- `ExtraLarge`: From 1600dp: a wide desktop window, an external display.

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowHeightClass
```

How tall a window is, as one of three classes.

A layout follows the width first. The height says when there is no room to stack things: a `Compact` window is a phone on its side, as wide as a tablet and less than half as tall, where each bar laid across the screen takes a seventh of it.

Entries:

- `Compact`: Shorter than 480dp: a phone on its side.
- `Medium`: From 480dp: most phones held upright, a tablet on its side.
- `Expanded`: From 900dp: a tablet held upright, a desktop window, and a tall phone held upright.

### FoldOrientation

`import com.pantrixui.foundation.adaptive.FoldOrientation`, from `com.pantrixui:foundation`

```kotlin
enum class FoldOrientation
```

Which way a fold runs across its window.

Entries:

- `Vertical`: From the top of the window to its bottom: the two halves are side by side.
- `Horizontal`: From one side of the window to the other: one half is above the other.

### PantrixBreakpoints

`import com.pantrixui.foundation.adaptive.PantrixBreakpoints`, from `com.pantrixui:foundation`

```kotlin
data class PantrixBreakpoints(
    public val medium: Dp = 600.dp,
    public val expanded: Dp = 840.dp,
    public val large: Dp = 1200.dp,
    public val extraLarge: Dp = 1600.dp,
    public val heightMedium: Dp = 480.dp,
    public val heightExpanded: Dp = 900.dp
)
```

Where each window class begins: the least width of a Medium, Expanded, Large and ExtraLarge window, and the least height of a Medium and an Expanded one. A window narrower than `medium` is Compact, as is one shorter than `heightMedium`.

The defaults are Android's window size classes. A product whose layouts change elsewhere gives its own to `rememberPantrixWindow`.

Parameters:

- `medium: Dp`: The least width of a `WindowWidthClass.Medium` window.
- `expanded: Dp`: The least width of a `WindowWidthClass.Expanded` window.
- `large: Dp`: The least width of a `WindowWidthClass.Large` window.
- `extraLarge: Dp`: The least width of a `WindowWidthClass.ExtraLarge` window.
- `heightMedium: Dp`: The least height of a `WindowHeightClass.Medium` window.
- `heightExpanded: Dp`: The least height of a `WindowHeightClass.Expanded` window.

Members:

- `fun widthClassOf(width: Dp): WindowWidthClass`: The class of a window `width` wide: the highest one whose least width it has reached. A width not known yet, zero or unspecified, is Compact.
- `fun heightClassOf(height: Dp): WindowHeightClass`: The class of a window `height` tall: the highest one whose least height it has reached. A height not known yet, zero or unspecified, is Compact.

On the type:

- `PantrixBreakpoints.Default: PantrixBreakpoints`: 600, 840, 1200 and 1600dp wide; 480 and 900dp tall.

### PantrixLayout

`import com.pantrixui.foundation.adaptive.PantrixLayout`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLayout(
    val margin: Dp,
    val gutter: Dp,
    val columns: Int = 4,
    val maxContentWidth: Dp = Dp.Infinity
)
```

The measures a page is laid out by in a window of one width class. `PantrixTheme.layout` gives those of the window in effect:

```kotlin
Column(Modifier.padding(horizontal = PantrixTheme.layout.margin).maxContentWidth()) { … }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout.gutter)) { … }
```

The margin and the gutter are air: the interface density scales them as it scales the spacing. The columns are a count and the content's widest is a measure of the content, and the density scales neither.

Parameters:

- `margin: Dp`: The room between the edge of the window, or of a pane, and the content: what a page pads its content by at its sides.
- `gutter: Dp`: The room between columns of a grid, and between panes that stand side by side.
- `columns: Int`: How many columns a page's grid has across its room: a part of the page spans some of them, and `spanWidth` says how wide that is. A phone has 4, a tablet 8 and a wider window 12.
- `maxContentWidth: Dp`: How wide a page's content grows at the most: past it, the room of a wide window is left beside the content, since a line of text across a desktop window is not read. `Dp.Infinity` where the content takes all the room it has. `Modifier.maxContentWidth()` keeps content to it.

Members:

- `fun scaled(factor: Float): PantrixLayout`: These measures at an interface density: the margin and the gutter multiplied by `factor`, the columns and the content's widest as they are.
- `fun spanWidth(available: Dp, span: Int): Dp`: How wide a part that spans `span` of the `columns` is in `available` room: its columns, and the gutters between them. The columns are as wide as each other, and a gutter stands between each two:

  ```kotlin
  BoxWithConstraints {
      val layout = PantrixTheme.layout
      Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
          Article(Modifier.width(layout.spanWidth(maxWidth, span = 8)))
          Related(Modifier.width(layout.spanWidth(maxWidth, span = 4)))
      }
  }
  ```

  Room too narrow for its gutters leaves the columns no width: a part is then as wide as the gutters it spans.

  `available`: the room the columns share, as wide as the page's content: within its margins.

  `span`: how many of the columns the part spans, from 1 to `columns`.

### PantrixLayouts

`import com.pantrixui.foundation.adaptive.PantrixLayouts`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLayouts(
    val compact: PantrixLayout = PantrixLayout(margin = 16.dp, gutter = 16.dp, columns = 4),
    val medium: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 16.dp, columns = 8),
    val expanded: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 24.dp, columns = 12),
    val large: PantrixLayout = PantrixLayout(margin = 32.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1040.dp),
    val extraLarge: PantrixLayout = large
)
```

The layout's measures for each width class of a window: what `PantrixTheme.layout` picks from.

A phone has little width to give away and a desktop window has it to spare, so the margin and the gutter grow with the window. By default the margin is 16dp, 24dp from Medium and 32dp from Large; the gutter is 16dp, and 24dp from Expanded. Every one of them is a step of the spacing scale. The grid has 4 columns, 8 from Medium and 12 from Expanded, and the content grows without a bound until Large, where it stops at 1040dp.

A product gives the theme its own for the classes it has designed, and the rest stay as they are:

```kotlin
PantrixTheme(layouts = PantrixLayouts(compact = PantrixLayout(margin = 20.dp, gutter = 12.dp))) { … }
```

A class given its own measures has the columns and the widest content it is given: left out, they are a phone's, 4 columns and no bound. A product that gives a wider class its own measures gives them too:

```kotlin
PantrixLayouts(large = PantrixLayout(margin = 40.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1200.dp))
```

Parameters:

- `compact: PantrixLayout`: The measures of a window narrower than 600dp: a phone held upright.
- `medium: PantrixLayout`: The measures from 600dp: a tablet held upright, an open foldable.
- `expanded: PantrixLayout`: The measures from 840dp: a tablet on its side.
- `large: PantrixLayout`: The measures from 1200dp: a desktop window, a browser.
- `extraLarge: PantrixLayout`: The measures from 1600dp. They are `large`'s unless given: few products design that width apart.

Members:

- `fun forWidth(widthClass: WindowWidthClass): PantrixLayout`: The measures of a window whose width class is `widthClass`.
- `fun scaled(factor: Float): PantrixLayouts`: Density applies here, not at each call site, so one switch rescales the measures of every class.

  `factor`: the interface density's scale: each class's margin and gutter are multiplied by it.

### Modifier.maxContentWidth

`import com.pantrixui.foundation.adaptive.maxContentWidth`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun Modifier.maxContentWidth(alignment: Alignment.Horizontal = Alignment.Start): Modifier
```

Keeps the content no wider than `PantrixTheme.layout.maxContentWidth`: in a desktop window a page's text stays a width that is read, and the rest of the room is left beside it. Below the class that bounds it, the content takes all the room it is given.

Where the content is narrower than its room, this takes the room and lays the content in it by `alignment`: at the start, under a title that starts there, or in the middle.

```kotlin
Column(
    Modifier
        .verticalScroll(scroll)
        .padding(horizontal = PantrixTheme.layout.margin)
        .maxContentWidth()
) { … }
```

The bound is that of the window in effect, or of a component's own box handed on as the window, and follows the window as its class changes. Without a bounded width to fill, the content is measured as it is.

Parameters:

- `alignment: Alignment.Horizontal`: where the content stands in a room wider than it may be: at the start by default.

### WindowPosture

`import com.pantrixui.foundation.adaptive.WindowPosture`, from `com.pantrixui:foundation`

```kotlin
data class WindowPosture(public val folds: List<WindowFold> = emptyList())
```

How the window's device is folded: the folds that cross the window, and none on a device that has none.

The two postures a layout is written for are `isBook` and `isTabletop`. A fold opened flat is in `folds` and changes nothing: the screen is one piece.

Parameters:

- `folds: List<WindowFold>`: The folds crossing the window.

Members:

- `isBook: Boolean`: Held half open with the fold upright, like a book: two panes side by side, split at the fold, with nothing across it.
- `isTabletop: Boolean`: Held half open with the fold lying across, like a laptop on a table: what is looked at goes above the fold; controls, forms and the navigation go below it.
- `separatingFold: WindowFold?`: The fold the window is in two pieces at, or null when it is one piece: content keeps clear of this one.

On the type:

- `WindowPosture.Flat: WindowPosture`: No fold: every phone, tablet, desktop window and browser that does not fold.

### WindowFold

`import com.pantrixui.foundation.adaptive.WindowFold`, from `com.pantrixui:foundation`

```kotlin
data class WindowFold(
    public val bounds: Rect,
    public val orientation: FoldOrientation,
    public val isHalfOpened: Boolean,
    public val isSeparating: Boolean,
    public val isOccluding: Boolean,
    public val clearance: Rect = bounds
)
```

A fold or a hinge in a window.

Parameters:

- `bounds: Rect`: Where it is, in pixels and in the window's coordinates. A fold in one screen has no thickness: its bounds are a line, as wide as zero. A hinge between two screens is as wide as the gap.
- `orientation: FoldOrientation`: Which way it runs.
- `isHalfOpened: Boolean`: Whether the device is held partly open, the two halves at an angle. Opened flat, it is not.
- `isSeparating: Boolean`: Whether the window is in two pieces here, with nothing to be laid across: a fold held half open, or a hinge between two screens at any angle. A fold opened flat separates nothing.
- `isOccluding: Boolean`: Whether it hides a strip of the window, as a hinge between two screens does.
- `clearance: Rect`: The strip around it that what is touched keeps clear of, in pixels and in the window's coordinates: `bounds` and the margin the system asks for on either side. iOS asks for one, 20pt on each side of the fold of an iPhone that folds; Android and the browsers ask for none, and the strip is `bounds` itself. Two panes split at the fold leave this strip between them.

### WindowVerticalBar

`import com.pantrixui.foundation.adaptive.WindowVerticalBar`, from `com.pantrixui:foundation`

```kotlin
data class WindowVerticalBar(
    public val bounds: Rect,
    public val barBounds: Rect
)
```

The column a system keeps along one side of the window for bars that stand upright: its status bar at the top, and an app's toolbar buttons and tabs below it. The outer screen of the iPhone Duo has one from iOS 27.1 on, along its trailing edge, where UIKit puts a tab bar and a navigation bar's buttons; the window's safe area keeps content clear of it.

An app's own bars stand in `barBounds`: buttons at its top, under the status bar, and the navigation at its bottom, above the home indicator. `PantrixScaffold` puts its navigation and a top bar's buttons there by itself on the outer screen held upright. The inner screen, and either screen on its side, has a column too, which it leaves to the status bar.

Parameters:

- `bounds: Rect`: The column, from the window's top to its bottom, in pixels and in the window's coordinates.
- `barBounds: Rect`: Where an app's bars stand in the column: below the status bar and above the home indicator, as wide as the column. A bar narrower than it stands in its middle, which is where the system puts its own and is not always the column's middle: the screen's rounded corner takes a part of the column's outer side. In pixels and in the window's coordinates.

### systemVerticalBar

`import com.pantrixui.foundation.adaptive.systemVerticalBar`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemVerticalBar(): WindowVerticalBar?
```

The vertical bar the system keeps in this window, or null where it keeps none: the column of the iPhone Duo's outer screen from iOS 27.1 on. Android, the desktop and the browsers have none, and neither has an iOS before 27.1 or a library built with an Xcode before 27.1. It is followed as the device is turned and its screens change.

### VerticalBarInNode

`import com.pantrixui.foundation.adaptive.VerticalBarInNode`, from `com.pantrixui:foundation`

```kotlin
class VerticalBarInNode
```

The window's vertical bar beside one node, in the node's own coordinates and in pixels: what a layout that puts its bars in the system's column measures by. Put `modifier` on the node; `verticalBar` follows the node as it moves and is resized, and the window as its bar comes and goes.

The bar is the window's: the one the frame the node is drawn in tells of, or the one the outermost `PantrixTheme` stands for, and not the room a pane is told of as its window. A node that does not reach the column, one in a pane away from that edge, has none. Until the node is first placed the column is where it would be beside a node that starts at the window's corner, as one filling the window does.

Members:

- `modifier: Modifier`: Placed on the node whose vertical bar is asked. It follows where the node is in the window.
- `verticalBar: WindowVerticalBar?`: The vertical bar, its column and the place of its bars in the node's coordinates, while the node reaches across the column to the window's edge; null where it does not, and where the window has none.

### rememberVerticalBarInNode

`import com.pantrixui.foundation.adaptive.rememberVerticalBarInNode`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberVerticalBarInNode(): VerticalBarInNode
```

The window's vertical bar beside the node `VerticalBarInNode.modifier` is put on.
