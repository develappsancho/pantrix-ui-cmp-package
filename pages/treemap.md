# Treemap

A box cut into tiles: each tile as large as its value is of the whole. It suits a whole of many parts, where a pie would have too many slices to read: the folders of a disk, a budget by its lines, a market by its companies. What is large is seen at once, and the small parts have their place too.

The chart is given its items. Each `TreemapItem` is a tile, or a group whose own items are its tiles (`children`). A group's tiles lie together in a block, in the group's colour, with the group's name over them where there is room. The blocks are set out from the largest on, and so are the tiles in each block.

- `PantrixTreemap` (`com.pantrixui.components.chart.treemap`, `com.pantrixui:components`): A box cut into tiles, each as large as its value is of the whole, in groups with their names over them, with a tooltip for the tile pointed at and every tile reachable by keys and by a screen reader. Keywords: tree map, nested rectangles, hierarchy chart, space usage, proportions.

## Features

- **What is written in a tile.** With `labels` each tile has its name written in it and under it its value, in the one of black and white that reads better on its colour. A tile with no room for its name has neither; the tooltip and a screen reader say both.
- **Groups.** An item that gives `children` is a group: its value is the sum of its tiles, and a value given to it is not read.
- **Colour.** Each item given takes the one of the theme's chart colours that falls to its place; a group's tiles are in the group's colour. `color` gives an item or a tile a colour of its own.
- **Shaded by value.** Given a `scale`, every tile is drawn in its value's shade on the scale, as a heatmap's cells are (`HeatmapScale`): a large tile lies nearer the scale's end. The item's and the group's colours are not read then; the blocks and the groups' names stay. The scale bar stands where `legend` says.
- **The tile pointed at.** The tile under the pointer, or the one that is tapped, is ringed, and the tooltip writes its group, its name, its value and its share of the whole.
- **Keyboard.** The chart is one stop for Tab: an arrow goes to the nearest tile the way it points; Home and End go to the largest tile and the last, Escape lets go, Enter and Space press the tile that is pointed at.
- **State and pressing.** The tile that is pointed at is kept in `ChartState`, as a selection whose `x` is the item's key. `onSelect` gives the tile that is pressed.
- **Screen reader.** The chart says its `description`, then each tile from the largest block on, with its group, its name, its value and its share. A chart of more than two hundred tiles is told by its description alone.
- **Direction.** In a language read from right to left the largest tile lies at the right.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `Treemap_<tagKey>`; the tiles `.Plot`, a tile `.Tile_<number>`, the scale `.Legend`, the tooltip `.Tooltip`.

## Usage

### What fills a disk

```kotlin
PantrixTreemap(
    items = folders.map { TreemapItem(it.id, it.name, it.megabytes) },
    description = stringResource(Res.string.disk_usage),
    tagKey = "disk"
)
```

### Groups with their tiles

```kotlin
PantrixTreemap(
    items = departments.map { department ->
        TreemapItem(
            key = department.id,
            name = department.name,
            children = department.teams.map { TreemapItem(it.id, it.name, it.budget) }
        )
    },
    tagKey = "budget"
)
```

### Shaded by size

```kotlin
PantrixTreemap(
    items = folders.map { TreemapItem(it.id, it.name, it.megabytes) },
    scale = HeatmapScale(low = Color(0xFFFFF3B0), color = Color(0xFFB3261E)),
    tagKey = "shaded"
)
```

## Examples

### What fills a disk

What fills a disk, in gigabytes. Each folder is a tile: the largest comes first.

Move the pointer over a tile or tap it: the tooltip writes the folder's size and its share of the disk.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

PantrixTreemap(
    items = diskFolders(),
    description = "The folders that fill the disk",
    tagKey = "plain"
)

internal fun diskFolders(): List<TreemapItem> = listOf(
    TreemapItem("photos", "Photos", 148),
    TreemapItem("video", "Videos", 96),
    TreemapItem("apps", "Apps", 64),
    TreemapItem("music", "Music", 41),
    TreemapItem("docs", "Documents", 27),
    TreemapItem("mail", "Mail", 14),
    TreemapItem("other", "Other", 9)
)
```

### Groups

A budget, by department and by the lines of each department. Each department is a group: its lines lie in one block, in the department's colour, with the department's name over them.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

PantrixTreemap(
    items = budgetByDepartment(),
    description = "Budget by department",
    tagKey = "grouped"
)

internal fun budgetByDepartment(): List<TreemapItem> = listOf(
    TreemapItem(
        key = "product",
        name = "Product",
        children = listOf(
            TreemapItem("engineering", "Engineering", 420),
            TreemapItem("design", "Design", 160),
            TreemapItem("research", "Research", 90)
        )
    ),
    TreemapItem(
        key = "growth",
        name = "Growth",
        children = listOf(
            TreemapItem("ads", "Ads", 240),
            TreemapItem("events", "Events", 110),
            TreemapItem("content", "Content", 70)
        )
    ),
    TreemapItem(
        key = "operations",
        name = "Operations",
        children = listOf(
            TreemapItem("support", "Support", 130),
            TreemapItem("office", "Office", 80),
            TreemapItem("legal", "Legal", 45)
        )
    )
)
```

### Shaded by value

The same budget, its tiles shaded by their values (`scale`): the scale goes from the theme's primary container colour to its primary colour, a large line darker. The scale bar is under the chart; the groups' colours are not read then.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixTreemap(
    items = budgetByDepartment(),
    scale = HeatmapScale(low = colors.primary.container, color = colors.primary.color),
    description = "Budget by department",
    tagKey = "shaded"
)

internal fun budgetByDepartment(): List<TreemapItem> = listOf(
    TreemapItem(
        key = "product",
        name = "Product",
        children = listOf(
            TreemapItem("engineering", "Engineering", 420),
            TreemapItem("design", "Design", 160),
            TreemapItem("research", "Research", 90)
        )
    ),
    TreemapItem(
        key = "growth",
        name = "Growth",
        children = listOf(
            TreemapItem("ads", "Ads", 240),
            TreemapItem("events", "Events", 110),
            TreemapItem("content", "Content", 70)
        )
    ),
    TreemapItem(
        key = "operations",
        name = "Operations",
        children = listOf(
            TreemapItem("support", "Support", 130),
            TreemapItem("office", "Office", 80),
            TreemapItem("legal", "Legal", 45)
        )
    )
)
```

### Pressing a tile

`onSelect` gives the tile that is pressed: press a tile, or go to one with the keyboard and press Enter, and the line under the card writes what was pressed. The values are written in a way of their own: in the tiles by `ChartDataLabels(format)`, in the tooltip by `ChartTooltip(format)`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

val report = LocalExampleEvents.current
PantrixTreemap(
    items = diskFolders(),
    labels = ChartDataLabels(format = { "${it.toInt()} GB" }),
    tooltip = ChartTooltip(format = { "${it.toInt()} GB" }),
    onSelect = { tile -> report("${tile.name}: ${tile.text}") },
    description = "The folders that fill the disk",
    tagKey = "pressed"
)

internal fun diskFolders(): List<TreemapItem> = listOf(
    TreemapItem("photos", "Photos", 148),
    TreemapItem("video", "Videos", 96),
    TreemapItem("apps", "Apps", 64),
    TreemapItem("music", "Music", 41),
    TreemapItem("docs", "Documents", 27),
    TreemapItem("mail", "Mail", 14),
    TreemapItem("other", "Other", 9)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the tiles and their names; the tooltip of the tile that is pointed at is not in it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixTreemap(
    items = diskFolders(),
    description = "The folders that fill the disk",
    tagKey = "exported",
    export = ChartExport(fileName = "disk") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun diskFolders(): List<TreemapItem> = listOf(
    TreemapItem("photos", "Photos", 148),
    TreemapItem("video", "Videos", 96),
    TreemapItem("apps", "Apps", 64),
    TreemapItem("music", "Music", 41),
    TreemapItem("docs", "Documents", 27),
    TreemapItem("mail", "Mail", 14),
    TreemapItem("other", "Other", 9)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixTreemap

`import com.pantrixui.components.chart.treemap.PantrixTreemap`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTreemap(
    items: List<TreemapItem>,
    modifier: Modifier = Modifier,
    labels: ChartDataLabels? = ChartDataLabels(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    scale: HeatmapScale? = null,
    legend: ChartLegend? = ChartLegend(),
    export: ChartExport? = null
)
```

A treemap: a box cut into tiles, each as large as its value is of the whole. It suits a whole of many parts, where a pie would have too many slices to read: the folders of a disk, a budget by its lines, a market by its companies. What is large is seen at once, and the small parts still have their place.

The chart is given its `items`. Each of them is a tile, or a group whose own items are its tiles: a group's tiles lie together in a block, in the group's colour, with the group's name over them where the block has room for it. The blocks are set out the largest first from where lines start, and in each block its tiles the largest first, every tile as near a square as the cutting lets it be. An item that counts for nothing has no tile.

A tile has its name and its value written in it where it has room for them, in the one of black and white that reads better on its colour; a tile too small for its name has neither, and the `tooltip` and a screen reader still have both.

**Shaded by value.** Given a `scale`, every tile is drawn in the shade of its value along it, as a heatmap's cells are, whatever colour its item or its group names: the larger a tile, the further along the scale, so that two tiles of nearly one size, or of two blocks far apart, are still told apart at a glance. The blocks still lie together under their groups' names, a tile keeps its group's texture, and the `legend` shows the scale with its least and its most.

**Pointing at a tile.** A pointer over a tile points at it; a finger does by a tap, and a tap on the tile it points at lets go of it. With the keyboard the chart is one stop for Tab: an arrow goes to the nearest tile the way it points, Home and End to the largest tile and the last, and Escape lets go. The tile is ringed, the tooltip shown for it, and it is told to `state`, as a selection whose `x` is the item's key. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, then each tile with its group, its name, its value and its share of the whole, the largest block first. A chart of more than two hundred tiles is told by its description alone.

**Its size.** The chart is as wide as it is given room, and as tall as its modifier says or, given no height, as the chart's style says.

In a language read from the right the largest tile lies at the right.

```kotlin
PantrixTreemap(
    items = listOf(TreemapItem("photos", "Photos", 48), TreemapItem("video", "Video", 31)),
    description = "What fills the disk",
    tagKey = "disk"
)
```

Parameters:

- `items: List<TreemapItem>`: the tiles and the groups of tiles. Their keys tell the tiles apart, and two tiles with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's.
- `labels: ChartDataLabels?`: what is written in the tiles: each tile's name, and under it its value, written as `format` says or short where it says nothing. `null` writes nothing in them.
- `tooltip: ChartTooltip?`: what is shown for the tile that is pointed at: its group as the heading, where it lies in one, and under it its name and its value with its share of the whole. A tile has no place to share and no line through it: `shared` and `crosshair` are not read. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of the items it was given.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the tile that is pressed: its key is its `series` and its `x`, its name its `name` and its `label`, and its `text` its value with its share of the whole after it.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest. Two tiles are a `sliceGap` apart, and their corners as round as `barRadius` says.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `Treemap_<tagKey>`, its tiles together `Treemap_<tagKey>.Plot`, a tile `Treemap_<tagKey>.Tile_<number>`, counted from one as the tiles are laid out, the scale `Treemap_<tagKey>.Legend` and the tooltip `Treemap_<tagKey>.Tooltip`. A press on a tile is reported as a `Treemap` `select` event with the item's key. Nothing of the values is reported.
- `scale: HeatmapScale?`: what shades the tiles by their values, as a heatmap's scale does its cells: where it names no ends, they are the least and the most of the tiles' values. `null`, each tile has its own colour or its group's.
- `legend: ChartLegend?`: where the scale of shades stands, where the treemap has a `scale`: without one there is nothing for it to show. `null` shows none.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button. The scale of shades stands under the tiles in the file.

### TreemapItem

`import com.pantrixui.components.chart.treemap.TreemapItem`, from `com.pantrixui:components`

```kotlin
class TreemapItem(
    public val key: String,
    public val name: String,
    public val value: Number? = null,
    public val color: Color = Color.Unspecified,
    public val children: List<TreemapItem> = emptyList(),
    public val pattern: ChartPattern? = null
)
```

One item of a `PantrixTreemap`: a tile with a value, or a group of tiles.

```kotlin
TreemapItem("docs", "Documents", 12)
TreemapItem(
    key = "design",
    name = "Design",
    children = listOf(TreemapItem("ui", "Interface", 42), TreemapItem("brand", "Brand", 18))
)
```

An item with no `children` is a tile, as large as its `value` is of all the values. An item with children is a group: its tiles are its children, they lie together under its name, and what it counts for is what they count for together; a value given to a group is not read. A child that has children of its own is one tile, which counts for all of them.

Two items are the same item where everything they were built from is the same.

Parameters:

- `key: String`: What tells the item from the others, and stays the same while its value changes: what a selection names and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What it is called: in its tile, over its group, in the tooltip and to a screen reader.
- `value: Number?`: How much it counts for. An item whose value is no number, or is not over nought, has no tile.
- `color: Color`: The colour it is drawn in. Left out, a tile has its group's colour, and an item the treemap was given the theme's chart colour for its place among them: the first of them for the first.
- `children: List<TreemapItem>`: The tiles of a group.
- `pattern: ChartPattern?`: The texture it is drawn with besides its colour. Left out, a tile has its group's, and an item the treemap was given none, or where the chart's patterns are on (`ChartStyle.patterns`), its turn by its place among them: none for the first.

### HeatmapScale

`import com.pantrixui.components.chart.heatmap.HeatmapScale`, from `com.pantrixui:components`

```kotlin
class HeatmapScale(
    public val min: Double? = null,
    public val max: Double? = null,
    public val steps: Int = 0,
    public val color: Color = Color.Unspecified,
    public val low: Color = Color.Unspecified
)
```

How a `PantrixHeatmap` turns a value into a shade: the two ends of its scale, how many shades it has, and its colours. A PantrixTreemap given one shades its tiles by it.

```kotlin
HeatmapScale(min = 0.0, max = 100.0, steps = 5)
HeatmapScale(low = Color(0xFFFFF3B0), color = Color(0xFFB3261E))
```

A cell is drawn in `color`, the more of it the further its value is along the scale: a little of it for the least, and all of it for the most. The colour lies on what the chart stands on, so that a scale reads in a light theme and in a dark one. Given a `low` colour, the scale goes from it to `color` instead: the two are mixed in Oklab, where each step along looks as large as the next, and the least is drawn in `low` itself. Such a scale is the same in a light theme and a dark one: the two colours are the caller's to choose for both. A value under `min` is drawn as the least, and one over `max` as the most.

Two scales are the same where all five are.

Parameters:

- `min: Double?`: The value the lightest shade stands for. Left out, it is the least of the chart's values.
- `max: Double?`: The value the full colour stands for. Left out, it is the most of them.
- `steps: Int`: How many shades the scale has: with five, the scale is cut into five even ranges and every value of a range has that range's shade. Nought, every value has a shade of its own.
- `color: Color`: The colour of the most. Left out, it is the first of the theme's chart colours.
- `low: Color`: The colour of the least. Left out, the least is a little of `color` on what the chart stands on.

### ChartDataLabels

`import com.pantrixui.components.chart.common.ChartDataLabels`, from `com.pantrixui:components`

```kotlin
class ChartDataLabels(
    public val format: ((Double) -> String)? = null,
    public val position: ChartDataLabelPosition = ChartDataLabelPosition.Auto,
    public val total: Boolean = false
)
```

The values of a series written in the chart, each at its mark: over a point of a line, at the end of a bar, and inside a bar of a stack, in the one of black and white that reads better on the bar's colour.

```kotlin
BarSeries("revenue", "Revenue", months, x = { it.name }, y = { it.revenue }, labels = ChartDataLabels())
BarSeries("online", "Online", months, x = { it.name }, y = { it.online }, stack = "sales",
    labels = ChartDataLabels(position = ChartDataLabelPosition.InsideEnd, total = true))
```

A value has its label where the label has room. Placed by itself, one that would stand on another, or reach out of the chart, is written under its point instead, or inside the end of its bar; where it has no room there either it is left out, as is one that a bar is too small to hold. Placed where its `position` says, it has no other place. The tooltip and the screen reader still have the value. A chart of more than two hundred places writes none.

A line the chart draws to read the values by, through a label, is covered where the label is: the label is written on a plate, of the tooltip's colour past a bar and of the bar's colour inside it.

Its `position` and its `total` are of a chart with axes: a pie and a heatmap write their labels where they do.

Two are the same where they write a value the same way, at the same place.

Parameters:

- `format: ((Double) -> String)?`: How a value is written. Left out, it is written as the axis the series is read by writes its values, and where that says nothing in the theme's language, short from ten thousand on. In a stack that stands as shares, it is given a value's share, and left out the share is written as a share of a hundred.
- `position: ChartDataLabelPosition`: Where on its bar a value is written. A point of a line has its label over it, or under it where it has no room over it, whatever this says.
- `total: Boolean`: Whether what a stack of the series comes to at each place is written past its end: over the stack where it comes to nought or more, and under it where it comes to less. It is written as `format` says, but in a stack that stands as shares in the theme's language, for it is no share. One series of the stack asking for it is enough.

### ChartLegend

`import com.pantrixui.components.chart.common.ChartLegend`, from `com.pantrixui:components`

```kotlin
data class ChartLegend(
    public val position: ChartLegendPosition = ChartLegendPosition.Bottom,
    public val alignment: ChartLegendAlignment = ChartLegendAlignment.Center,
    public val toggles: Boolean = true,
    public val always: Boolean = false
)
```

A chart's legend: where the names of its series stand, each beside a sample of how the series is drawn.

A chart of one series has no legend: what the one line is belongs in the words around the chart. `always` gives it one all the same.

An entry is a switch for its series. Pressed, it takes the series out of the chart, and the chart is drawn for the series that are left; pressed again, it brings the series back. The entry stays, drawn faint, so that what was taken out can be brought back. A screen reader hears each entry as a switch, with the series' name and whether it is on.

Parameters:

- `position: ChartLegendPosition`: Which side of the chart the legend stands on. Above and under it the entries stand in a row, on as many lines as they need; beside it they stand under each other.
- `alignment: ChartLegendAlignment`: Where in the room it has the legend stands: along the chart's width above and under it, and from the chart's top beside it.
- `toggles: Boolean`: Whether pressing an entry takes its series out of the chart and brings it back.
- `always: Boolean`: Whether a chart of one series has a legend too.

### ChartTooltip

`import com.pantrixui.components.chart.common.ChartTooltip`, from `com.pantrixui:components`

```kotlin
class ChartTooltip(
    public val shared: Boolean = true,
    public val crosshair: Boolean = true,
    public val format: ((Double) -> String)? = null,
    public val content: (@Composable (points: List<ChartPoint>) -> Unit)? = null
)
```

A chart's tooltip: the values at the place that is pointed at, on a small card beside it.

It comes up under a pointer, where a finger touches the chart or is drawn along it, and at the place the arrow keys have gone to. It goes when the pointer leaves, at a second touch on the place, and at Escape. It stands inside the chart, beside the place and on the side that has room for it. In a chart too narrow to have room on either side it stands over the place, at the end of the plot that the place's values are not at. It takes no press: what is under it is pressed as if it were not there.

`null` in its place shows none. The place pointed at is still marked, and still told to the chart's state.

Parameters:

- `shared: Boolean`: Whether the tooltip is of the place, with the value every series has there, or of the one series nearest the pointer. Together is how a chart is read at a place, and under a finger it asks for no aim; apart suits a chart whose series are read each on its own.
- `crosshair: Boolean`: Whether the place is marked across the chart: by a line through it, and in a chart with bars by a shade over its band.
- `format: ((Double) -> String)?`: How a value is written in the tooltip and to a screen reader, where that is not how the axis writes it: a chart with no axis of values says here what its numbers are. Left out, the axis' `format` writes them, and the theme's language where the axis has none.
- `content: (@Composable (points: List<ChartPoint>) -> Unit)?`: The card's own content, in the place of the heading and the rows: given the values at the place, the one pointed at where the series are told apart. The card around it stays the chart's.

### ChartStyle

`import com.pantrixui.components.chart.common.ChartStyle`, from `com.pantrixui:components`

```kotlin
class ChartStyle(
    public val height: Dp = Dp.Unspecified,
    public val lineWidth: Dp = Dp.Unspecified,
    public val markerSize: Dp = Dp.Unspecified,
    public val selectedMarkerSize: Dp = Dp.Unspecified,
    public val gridWidth: Dp = Dp.Unspecified,
    public val labelGap: Dp = Dp.Unspecified,
    public val tickSpacing: Dp = Dp.Unspecified,
    public val legendGap: Dp = Dp.Unspecified,
    public val legendItemGap: Dp = Dp.Unspecified,
    public val swatchSize: Dp = Dp.Unspecified,
    public val swatchGap: Dp = Dp.Unspecified,
    public val tooltipShape: ShapeSpec = ShapeSpec.Unspecified,
    public val tooltipHorizontalPadding: Dp = Dp.Unspecified,
    public val tooltipVerticalPadding: Dp = Dp.Unspecified,
    public val tooltipGap: Dp = Dp.Unspecified,
    public val tooltipElevation: Dp = Dp.Unspecified,
    public val barGap: Dp = Dp.Unspecified,
    public val barMaxWidth: Dp = Dp.Unspecified,
    public val barRadius: Dp = Dp.Unspecified,
    public val sliceGap: Dp = Dp.Unspecified,
    public val selectedSliceOffset: Dp = Dp.Unspecified,
    public val gaugeWidth: Dp = Dp.Unspecified,
    public val meterHeight: Dp = Dp.Unspecified,
    public val trackerHeight: Dp = Dp.Unspecified,
    public val bubbleMinSize: Dp = Dp.Unspecified,
    public val bubbleMaxSize: Dp = Dp.Unspecified,
    public val navigatorHeight: Dp = Dp.Unspecified,
    public val barBandShare: Float = Float.NaN,
    public val markLineWidth: Dp = Dp.Unspecified,
    public val markBandAlpha: Float = Float.NaN,
    public val patterns: Boolean? = null,
    public val nodeWidth: Dp = Dp.Unspecified,
    public val nodeGap: Dp = Dp.Unspecified
) : PantrixStyle<ChartStyle>
```

A chart's geometry: how tall it is where nothing says, how thick its lines and how large its marks are, and the room between its parts; and whether its fills have textures besides their colours.

A chart is as tall on a phone as leaves room for what is around it, and taller in a window with room to spare. Under a finger its values' lines stand a little further apart than under a pointer.

The rooms between the parts follow the density, the gaps between bars and between slices among them. The height, the widths of the lines, the sizes of the marks and of the bubbles, a bar's width and corners, how far a pointed slice stands out, how thick a gauge's arc is, how tall a meter's bar, a tracker's blocks and a navigator's strip are, and the tooltip's corners and shadow do not: a chart's lines are as thick in a dense layout as in a roomy one.

Parameters:

- `height: Dp`: How tall a chart's plot is, with its axes, where the chart's modifier gives it no height. A legend above or under the plot adds its own.
- `lineWidth: Dp`: The width of a series' line.
- `markerSize: Dp`: The width and height of the mark on a point.
- `selectedMarkerSize: Dp`: The same of the mark on the point that is pointed at.
- `gridWidth: Dp`: The width of the grid's lines, of the lines along the axes and of the line that marks the place pointed at. Zero draws none.
- `labelGap: Dp`: Between the plot and what is written beside it and under it, and between that and an axis' title.
- `tickSpacing: Dp`: The least room between two values marked along the axis of values: what decides how many are marked where the axis does not say.
- `legendGap: Dp`: Between the legend and the chart it stands beside.
- `legendItemGap: Dp`: Between one entry of the legend and the next.
- `swatchSize: Dp`: How wide the sample of a series is in the legend and in the tooltip: a short run of its line, or a patch of its fill.
- `swatchGap: Dp`: Between that sample and the name after it.
- `tooltipShape: ShapeSpec`: The tooltip's corners: a step of the brand's shape scale, or a fixed shape.
- `tooltipHorizontalPadding: Dp`: Between the tooltip's sides and what it holds.
- `tooltipVerticalPadding: Dp`: Between its top and bottom and what it holds, and between its heading and rows.
- `tooltipGap: Dp`: Between the place pointed at and the tooltip beside it.
- `tooltipElevation: Dp`: The tooltip's shadow.
- `barGap: Dp`: Between two bars that stand side by side at a place. Bars too thin for it stand closer.
- `barMaxWidth: Dp`: The widest a bar is, however much room its place has: a chart of three places is not three slabs.
- `barRadius: Dp`: How round the corners of a bar's end are, the end away from nought.
- `sliceGap: Dp`: Between two slices of a pie that lie side by side, the same from the pie's middle to its rim.
- `selectedSliceOffset: Dp`: How far the slice of a pie that is pointed at stands out past the pie's rim. The pie keeps this much room about itself, so that the slice has where to stand.
- `gaugeWidth: Dp`: How thick the arc of a gauge is. An arc is no thicker than half its radius.
- `meterHeight: Dp`: How tall the bar of a meter group is.
- `trackerHeight: Dp`: How tall the blocks of a status tracker are.
- `bubbleMinSize: Dp`: How far across the smallest bubble of a scatter chart is: a point whose size is nothing, or too little to be seen as an area, is still a point.
- `bubbleMaxSize: Dp`: How far across its largest bubble is: the one whose size is the most of the chart's.
- `navigatorHeight: Dp`: How tall the strip under a chart's plot is, on which the part of the chart that is in view is marked and moved, in a chart whose zoom has one: how wide, beside a plot whose places go down its side.
- `barBandShare: Float`: How much of a place's band its bars take, more than nought and one at the most: the rest is the room between one place's bars and the next's. Bars are no wider than `barMaxWidth` all the same.
- `markLineWidth: Dp`: The width of a mark's line: a target, a limit, a day. Zero draws none, and the mark's words are written all the same.
- `markBandAlpha: Float`: How much of its colour a mark's band is drawn in, from nought to one: a band lies behind the series, and is a tint.
- `patterns: Boolean?`: Whether the fills of a chart's series, slices and tiles are drawn with textures besides their colours, and its lines broken in turn (`ChartPattern`): what tells them apart for a reader who cannot tell the colours apart. Left out, as the system is set: on where it is set to tell things apart without colour, iOS's "Differentiate Without Color" and Android's colour correction, and off otherwise.
- `nodeWidth: Dp`: How wide a node of a sankey is.
- `nodeGap: Dp`: Between two nodes of a column of a sankey.
