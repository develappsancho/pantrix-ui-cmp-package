# Meter Group

Several amounts of one whole, side by side on one bar: what a storage is filled with, where a budget goes. The parts are read against each other and against what is left.

The bar is as long as `max`. Each `MeterItem` takes as much of the bar as its value; the parts are set out in order from the start of the line, each drawn in the theme's next chart colour unless it names its own. What no part takes shows the bar's track.

- `PantrixMeterGroup` (`com.pantrixui.components.chart.metergroup`, `com.pantrixui:components`): Several amounts of one whole, side by side on one bar, with a legend that writes each amount beside its colour. Keywords: stacked progress, usage bar, storage bar, segmented bar, quota.

## Features

- **Values.** A part's value is counted in what `max` is counted in. A part with no value, or one that is not over nought, takes none of the bar, and its name stays in the legend. What the parts come to past `max` is cut off at the bar's end.
- **Legend.** It writes each part's name, then its value, beside its colour. It stands above the bar or under it: a legend at the start counts as above, one at the end as under. Its entries are no switches here: the bar shows what it is given.
- **Writing.** `format` says how a value is written in the legend; left out, it is written as a number in the theme's language.
- **Screen reader.** The bar is a picture with its `description`; the legend's entries say the parts. A bar with no legend says its parts itself.
- **Direction.** In a language read from right to left the first part stands at the right.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `MeterGroup_<tagKey>`; the bar `.Bar`, the legend's entries `.Legend_<the part's key>`.

## Usage

### What a whole is filled with

```kotlin
PantrixMeterGroup(
    items = usage.map { MeterItem(it.id, it.name, it.gigabytes) },
    max = capacity,
    format = { "${it.toInt()} GB" },
    description = stringResource(Res.string.storage),
    tagKey = "storage"
)
```

### With its legend above it

```kotlin
PantrixMeterGroup(
    items = spending.map { MeterItem(it.id, it.name, it.share) },
    legend = ChartLegend(position = ChartLegendPosition.Top, alignment = ChartLegendAlignment.Start),
    tagKey = "budget"
)
```

## Examples

### What fills a whole

At its plainest: four things that fill a storage of sixty-four gigabytes. The end of the bar that is not filled shows the room that is left; the legend writes each part with its value.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup

PantrixMeterGroup(
    items = METER_STORAGE,
    max = 64,
    format = { "${it.toInt()} GB" },
    description = "Storage",
    tagKey = "plain"
)

private val METER_STORAGE = listOf(
    MeterItem("apps", "Apps", 16),
    MeterItem("photos", "Photos", 24),
    MeterItem("messages", "Messages", 8),
    MeterItem("system", "System", 10)
)
```

### The legend above

The legend is above the bar and at the start of the line (`ChartLegend(position = Top, alignment = Start)`). The values are written as shares of the whole, in the theme's language.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendAlignment
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixMeterGroup(
    items = METER_BUDGET,
    format = { strings.percent(it / 100) },
    legend = ChartLegend(position = ChartLegendPosition.Top, alignment = ChartLegendAlignment.Start),
    description = "How the budget is spent",
    tagKey = "legend_above"
)

private val METER_BUDGET = listOf(
    MeterItem("rent", "Rent", 40),
    MeterItem("food", "Food", 25),
    MeterItem("transport", "Transport", 15),
    MeterItem("savings", "Savings", 20)
)
```

### The bar alone

A bar with no legend (`legend = null`): inside a row, where the words beside it already say what it shows. A screen reader hears the parts from the bar itself.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup

PantrixMeterGroup(
    items = METER_STORAGE,
    max = 64,
    format = { "${it.toInt()} GB" },
    legend = null,
    description = "Storage",
    tagKey = "bar_only"
)

private val METER_STORAGE = listOf(
    MeterItem("apps", "Apps", 16),
    MeterItem("photos", "Photos", 24),
    MeterItem("messages", "Messages", 8),
    MeterItem("system", "System", 10)
)
```

### Your own colours and sizes

A bar's own look: each part names its own colour, the bar is thicker (`meterHeight`), its ends are square (`barRadius`) and there is no gap between the parts (`sliceGap`). A field that is not given stays the theme's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup
import com.pantrixui.foundation.token.color.PantrixPalette

val violet = PantrixPalette.Violet
PantrixMeterGroup(
    items = listOf(
        MeterItem("done", "Done", 18, color = violet.shade700),
        MeterItem("doing", "In progress", 9, color = violet.shade500),
        MeterItem("waiting", "Waiting", 13, color = violet.shade300)
    ),
    max = 40,
    description = "State of the work",
    style = ChartStyle(meterHeight = 16.dp, barRadius = 0.dp, sliceGap = 0.dp),
    tagKey = "own_look"
)
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the bar and the legend under it: each part's name and value.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixMeterGroup(
    items = METER_STORAGE,
    max = 64,
    format = { "${it.toInt()} GB" },
    description = "Storage",
    tagKey = "exported",
    export = ChartExport(fileName = "storage") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val METER_STORAGE = listOf(
    MeterItem("apps", "Apps", 16),
    MeterItem("photos", "Photos", 24),
    MeterItem("messages", "Messages", 8),
    MeterItem("system", "System", 10)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixMeterGroup

`import com.pantrixui.components.chart.metergroup.PantrixMeterGroup`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixMeterGroup(
    items: List<MeterItem>,
    modifier: Modifier = Modifier,
    max: Number = 100,
    format: ((Double) -> String)? = null,
    legend: ChartLegend? = ChartLegend(),
    description: String? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

A meter group: several amounts of one whole, side by side on one bar. What a storage is filled with, how a budget is spent: the parts are read against each other and against what is left.

The bar is as long as `max`. Each of the `items` takes as much of it as its value, one after the other from where lines start, in the theme's chart colour for its place unless it names its own; what no item takes shows the bar's track. What the items come to past `max` is cut off at the bar's end.

The `legend` writes each item's name with its value after it, beside a patch of its colour. It stands above the bar or under it: a legend at the start is above, and one at the end under. Its entries are no switches here: a meter group shows what it is given.

**To a screen reader** the bar is a picture with its `description`, and the legend's entries say the items. A group with no legend says the items with the bar.

In a language read from the right the first item stands at the right.

```kotlin
PantrixMeterGroup(
    items = listOf(
        MeterItem("apps", "Apps", 16),
        MeterItem("photos", "Photos", 24),
        MeterItem("system", "System", 10)
    ),
    max = 64,
    format = { "${it.toInt()} GB" },
    description = "Storage",
    tagKey = "storage"
)
```

Parameters:

- `items: List<MeterItem>`: the amounts, in the order they lie on the bar. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the group's modifier.
- `max: Number`: how much the whole bar is: more than nought.
- `format: ((Double) -> String)?`: how a value is written in the legend. Left out, it is written as a number in the theme's language.
- `legend: ChartLegend?`: where the names of the items stand, above the bar or under it. `null` shows none.
- `description: String?`: what the bar measures, in a few words, for a screen reader.
- `style: ChartStyle?`: this group's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this group's own colours, where they are not the theme's.
- `tagKey: String?`: the group's automation key: the group is `MeterGroup_<tagKey>`, its bar `MeterGroup_<tagKey>.Bar` and the legend's entry of an item `MeterGroup_<tagKey>.Legend_<item's key>`.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button. The legend stands under the bar in the file.

### MeterItem

`import com.pantrixui.components.chart.metergroup.MeterItem`, from `com.pantrixui:components`

```kotlin
class MeterItem(
    public val key: String,
    public val name: String,
    public val value: Number?,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

One of the amounts a `PantrixMeterGroup` sets side by side on its bar.

```kotlin
MeterItem("photos", "Photos", 24)
```

Two are the same item where everything they were built from is the same; a whole number and the same number with a fraction of nought are one value.

Parameters:

- `key: String`: What tells the item from the others of its group, and stays the same while its value changes. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the item is called, in the legend and to a screen reader.
- `value: Number?`: How much of the bar the item takes, counted in what the bar's `max` is counted in. An item whose value is no number, or is not over nought, takes none of it, and keeps its name in the legend.
- `color: Color`: The colour the item is drawn in. Left out, it is the theme's chart colour for its place among the group's items.
- `pattern: ChartPattern?`: The texture the item is drawn with besides its colour. Left out, none, and where the group's patterns are on (`ChartStyle.patterns`), its turn by its place among the items: none for the first.

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
