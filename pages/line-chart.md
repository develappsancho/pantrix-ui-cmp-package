# Line Chart

A line chart of rows that are given once: a line for each value read from the rows (`values`), along the places the rows name (`x`).

It is the short way of writing a `PantrixChart` whose series are all lines and all read from the same rows: it does everything a chart does. The axes, the legend, the tooltip, the state, the keyboard and the screen reader are as told on the "Chart" page.

- `PantrixLineChart` (`com.pantrixui.components.chart.line`, `com.pantrixui:components`): A line for each value read from one list of rows, along the places the rows name: the short way to a chart whose series are all lines. Keywords: line graph, trend, time series, plot, line plot.

## Features

- **Rows and values.** `data` gives the rows, `x` a row's place. Each `ChartValue` is a series: its key, its name and the function that reads its value from a row.
- **How the line goes.** `curve` says how the line goes from one point to the next: straight, smooth or stepped. A smooth line stays between two points; it shows no peak or dip that the values do not have.
- **More than colour.** A series' `dash` draws its line in dashes or in dots, and its `marker` puts a shape on its points. Both show in the series' sample in the legend and in the tooltip.
- **Missing values.** `missing` says what the line does at a row that has no value: it breaks, connects, or counts it as zero.
- **Numeric axis.** Where the places are numbers and `xAxis = ChartAxis(numeric = true)`, the points stand as far apart as their numbers and the axis is marked at round numbers; otherwise numbers are names too, set out at even steps.
- **Value labels and marks.** `labels` writes the values over the points; `marks` draws a target line or the band of a range.
- **When `PantrixChart`.** For a chart whose series come from different lists, are of different kinds or are read by a second axis: each series takes its own `LineSeries`.
- **Automation.** The chart is tagged as the `PantrixChart` it is: `Chart_<tagKey>`.

## Usage

### Two values of each month

```kotlin
PantrixLineChart(
    data = months,
    x = { it.name },
    values = listOf(
        ChartValue("desktop", stringResource(Res.string.desktop)) { it.desktop },
        ChartValue("mobile", stringResource(Res.string.mobile)) { it.mobile }
    ),
    description = stringResource(Res.string.visits_by_device),
    tagKey = "visits"
)
```

### A measured line and a forecast, told apart by more than colour

```kotlin
PantrixLineChart(
    data = weeks,
    x = { it.week },
    values = listOf(
        ChartValue("actual", stringResource(Res.string.actual), marker = ChartMarker.Circle) { it.actual },
        ChartValue("forecast", stringResource(Res.string.forecast), dash = ChartDash.Dashed) { it.forecast }
    ),
    curve = ChartCurve.Smooth,
    tagKey = "forecast"
)
```

## Examples

### Lines from the same rows

At its plainest: the rows, the `x` that gives a row's place, and a `ChartValue` for each series. A series takes its key and its name; the block at the end reads its value from a row.

Three series take the theme's first three chart colours. Press a name in the legend: its series goes, and the ones that stay keep their colours.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.line.PantrixLineChart

PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(
        ChartValue("search", "Search") { it.search },
        ChartValue("direct", "Direct") { it.direct },
        ChartValue("social", "Social") { it.social }
    ),
    description = "Three sources of visits by day of the week",
    tagKey = "plain"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Mon", search = 420, direct = 240, social = 130),
    Traffic("Tue", search = 480, direct = 260, social = 120),
    Traffic("Wed", search = 455, direct = 300, social = 165),
    Traffic("Thu", search = 530, direct = 280, social = 190),
    Traffic("Fri", search = 510, direct = 330, social = 240),
    Traffic("Sat", search = 360, direct = 210, social = 310),
    Traffic("Sun", search = 330, direct = 180, social = 285)
)
```

### Numeric axis

The height of a hiking trail, measured at uneven points along the way: the places are numbers, in kilometres. With `xAxis = ChartAxis(numeric = true)` the points stand as far apart as their numbers: 0.8 km and 1.2 km close together, 7.5 km and 11 km far apart; the axis is marked at round kilometres, written as `format` says. The summit's line does not stand at a measurement but at 9.6 km.

Turn the switch off: the numbers become names, set out at even steps, and the trail's steepness reads wrong.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.line.PantrixLineChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var numeric by remember { mutableStateOf(true) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = numeric,
    onCheckedChange = { numeric = it },
    label = "Numeric axis",
    tagKey = "line_numeric"
)
PantrixLineChart(
    data = TRAIL,
    x = { it.first },
    values = listOf(ChartValue("height", "Height (m)") { it.second }),
    curve = ChartCurve.Smooth,
    xAxis = ChartAxis(numeric = numeric, format = { "${strings.decimal(it)} km" }),
    marks = listOf(ChartReferenceLine(x = 9.6, label = "Summit")),
    description = "The height of a hiking trail, measured along the way",
    tagKey = "numeric"
)

private val TRAIL = listOf(
    0.0 to 420,
    0.8 to 455,
    1.2 to 470,
    2.5 to 560,
    4.0 to 610,
    7.5 to 820,
    9.6 to 1_040,
    11.0 to 930,
    12.4 to 780
)
```

### How the line goes

`curve` says how the line goes from one point to the next. `Linear` goes straight. `Smooth` goes round through the points but stays between them: it makes up no peak or dip. The stepped ones carry a value level from one point to the next: `StepAfter` holds until the value changes, like a stock or a price; `StepBefore` goes to the next value ahead of it; `Step` steps halfway between the two.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.line.PantrixLineChart
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var curve by remember { mutableStateOf(ChartCurve.Smooth) }
PantrixSegmentButton(
    options = CURVES,
    selected = curve,
    onSelect = { curve = it },
    fullWidth = false,
    tagKey = "curve"
)
PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(ChartValue("search", "Search", marker = ChartMarker.Circle) { it.search }),
    curve = curve,
    description = "Visits from search by day of the week",
    tagKey = "curves"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Mon", search = 420, direct = 240, social = 130),
    Traffic("Tue", search = 480, direct = 260, social = 120),
    Traffic("Wed", search = 455, direct = 300, social = 165),
    Traffic("Thu", search = 530, direct = 280, social = 190),
    Traffic("Fri", search = 510, direct = 330, social = 240),
    Traffic("Sat", search = 360, direct = 210, social = 310),
    Traffic("Sun", search = 330, direct = 180, social = 285)
)

private val CURVES = listOf(
    SegmentOption(value = ChartCurve.Linear, label = "Straight", tagKey = "linear"),
    SegmentOption(value = ChartCurve.Smooth, label = "Smooth", tagKey = "smooth"),
    SegmentOption(value = ChartCurve.Step, label = "Step", tagKey = "step"),
    SegmentOption(value = ChartCurve.StepBefore, label = "Before", tagKey = "before"),
    SegmentOption(value = ChartCurve.StepAfter, label = "After", tagKey = "after")
)
```

### Series told apart by more than colour

Colour alone is not enough for every reader: for an eye that does not tell red from green, for a black and white printout, for a chart of many series. Here each series is told apart by more than its colour too: one is a solid line with circles, one a dashed line with squares, one a dotted line with triangles.

The same sample stands in the legend and in the tooltip: a series is known there too by its line and its shape.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.line.PantrixLineChart

PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(
        ChartValue("search", "Search", marker = ChartMarker.Circle) { it.search },
        ChartValue("direct", "Direct", dash = ChartDash.Dashed, marker = ChartMarker.Square) { it.direct },
        ChartValue("social", "Social", dash = ChartDash.Dotted, marker = ChartMarker.Triangle) { it.social }
    ),
    description = "Three sources of visits by day of the week",
    tagKey = "told_apart"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Mon", search = 420, direct = 240, social = 130),
    Traffic("Tue", search = 480, direct = 260, social = 120),
    Traffic("Wed", search = 455, direct = 300, social = 165),
    Traffic("Thu", search = 530, direct = 280, social = 190),
    Traffic("Fri", search = 510, direct = 330, social = 240),
    Traffic("Sat", search = 360, direct = 210, social = 310),
    Traffic("Sun", search = 330, direct = 180, social = 285)
)
```

### A small line with no axes

A small line in the corner of a card: it has no axes and no legend (`null`), and is sixty dp tall. Its values are still in place: the value of the day pointed at with a pointer or a finger is read in the tooltip, and a screen reader says the days one by one.

A chart with no axis tells its tooltip how its values are written (`ChartTooltip.format`): here what the number counts is added after the number.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.chart.line.PantrixLineChart
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(ChartValue("search", "Search") { it.search }),
    modifier = Modifier.height(60.dp),
    curve = ChartCurve.Smooth,
    xAxis = null,
    yAxis = null,
    tooltip = ChartTooltip(format = { "${strings.decimal(it)} visits" }),
    description = "Visits from search by day of the week",
    tagKey = "bare"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Mon", search = 420, direct = 240, social = 130),
    Traffic("Tue", search = 480, direct = 260, social = 120),
    Traffic("Wed", search = 455, direct = 300, social = 165),
    Traffic("Thu", search = 530, direct = 280, social = 190),
    Traffic("Fri", search = 510, direct = 330, social = 240),
    Traffic("Sat", search = 360, direct = 210, social = 310),
    Traffic("Sun", search = 330, direct = 180, social = 285)
)
```

## API

### PantrixLineChart

`import com.pantrixui.components.chart.line.PantrixLineChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixLineChart(
    data: List<T>,
    x: (T) -> Any,
    values: List<ChartValue<T>>,
    modifier: Modifier = Modifier,
    curve: ChartCurve = ChartCurve.Linear,
    missing: ChartMissing = ChartMissing.Gap,
    labels: ChartDataLabels? = null,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    secondYAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    zoom: ChartZoom? = null,
    decimation: ChartDecimation? = ChartDecimation(),
    export: ChartExport? = null,
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null
)
```

A line chart of rows that are given once: a line for each of the `values` read from them, along the places `x` reads from them.

It is a `PantrixChart` whose series are all lines and all read from the same rows, written shorter: everything a chart does, it does. A chart whose series come from different lists, or are of different kinds, is a `PantrixChart` with a `LineSeries` for each.

```kotlin
PantrixLineChart(
    data = months,
    x = { it.name },
    values = listOf(
        ChartValue("desktop", "Desktop") { it.desktop },
        ChartValue("mobile", "Mobile") { it.mobile }
    ),
    tagKey = "visits"
)
```

Parameters:

- `data: List<T>`: the rows, in the order the lines go through them.
- `x: (T) -> Any`: where a row stands along the chart: a name, a day, anything that is equal to itself.
- `values: List<ChartValue<T>>`: the series: what each reads from a row, and how it is called and drawn.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `curve: ChartCurve`: how each line goes from a point to the next.
- `missing: ChartMissing`: what a line does at a row that has no value.
- `labels: ChartDataLabels?`: the values written over the points of every line, where they have room. `null` writes none.
- `xAxis: ChartAxis?`: the axis of the places, under the chart. `null` draws nothing of it.
- `yAxis: ChartAxis?`: the axis of the values, beside the chart. `null` draws nothing of it.
- `secondYAxis: ChartAxis?`: the second axis of the values, at the chart's other side: drawn where a value is read by it (`ChartValue.axis`), and not otherwise. `null` draws nothing of it.
- `marks: List<ChartMark>`: the lines and the bands drawn in the plot besides the series: a target, a limit, a stretch of places.
- `legend: ChartLegend?`: where the names of the series stand. `null` shows none.
- `tooltip: ChartTooltip?`: what is shown for the place that is pointed at. `null` shows none.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the places and move along the rest. `null`, which it is unless the chart is given one, shows all the places and no more.
- `decimation: ChartDecimation?`: how a line with more points in view than the plot has room for is drawn through fewer of them. `null` draws every point, as many as there are.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a file: a picture, or a drawing that is sharp at any size. `null`, which it is unless the chart is given one, and the chart has no such button.
- `empty: (@Composable () -> Unit)?`: what the chart shows in its plot while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words. A file the chart is exported as says them.
- `state: ChartState`: what the reader has hidden and what they point at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the value that is pressed.
- `style: ChartStyle?`: this chart's own geometry.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key. The chart is tagged as the `PantrixChart` it is, `Chart_<tagKey>`, and its parts and events are that chart's.

### ChartValue

`import com.pantrixui.components.chart.cartesian.ChartValue`, from `com.pantrixui:components`

```kotlin
class ChartValue<T>(
    public val key: String,
    public val name: String,
    public val color: Color = Color.Unspecified,
    public val dash: ChartDash? = null,
    public val marker: ChartMarker = ChartMarker.None,
    public val axis: ChartYAxis = ChartYAxis.First,
    public val pattern: ChartPattern? = null,
    public val y: (T) -> Number?
)
```

One value of the rows a chart is read from, as a series of it: for the charts that take their rows once and name each series by what it reads from a row.

```kotlin
ChartValue("desktop", "Desktop") { it.desktop }
```

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the chart's series.
- `dash: ChartDash?`: Whether its line is drawn whole, in dashes or in dots. A bar has no line. Null, whole, and where the chart's patterns are on (`ChartStyle.patterns`), as its turn among the chart's series says.
- `marker: ChartMarker`: What marks each of its points. A bar has none.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by: the second, at the chart's other side, for a value of another kind than the first's, a share beside an amount.
- `pattern: ChartPattern?`: The texture its bars, or the room under its line where that is filled, are drawn with besides its colour. Null, none, and where the chart's patterns are on, its turn among the chart's series.
- `y: (T) -> Number?`: A row's value, or null where it has none.

### ChartCurve

`import com.pantrixui.components.chart.common.ChartCurve`, from `com.pantrixui:components`

```kotlin
enum class ChartCurve
```

How a line goes from one point to the next.

Entries:

- `Linear`: Straight from point to point.
- `Smooth`: Rounded through the points, and never past them: between two points the line stays between their values, so it shows no peak and no dip that the values do not have.
- `Step`: Level at each point's value, and stepping to the next halfway between the two.
- `StepBefore`: Stepping to a point's value at the point before it: level before each point.
- `StepAfter`: Level after each point, until the next: a value that holds until it changes.

### ChartDash

`import com.pantrixui.components.chart.common.ChartDash`, from `com.pantrixui:components`

```kotlin
enum class ChartDash
```

Whether a line is drawn whole or broken.

Entries:

- `Solid`: A whole line.
- `Dashed`: A line of dashes.
- `Dotted`: A line of dots.

### ChartMarker

`import com.pantrixui.components.chart.common.ChartMarker`, from `com.pantrixui:components`

```kotlin
enum class ChartMarker
```

What marks a point of a line. Shapes tell series apart where colours alone would not.

Entries:

- `None`: No mark, but for a point that stands alone.
- `Circle`: A round mark.
- `Square`: A square mark.
- `Diamond`: A square mark stood on one of its corners.
- `Triangle`: A triangular mark.

### ChartMissing

`import com.pantrixui.components.chart.common.ChartMissing`, from `com.pantrixui:components`

```kotlin
enum class ChartMissing
```

What a line does at a row that has no value.

Entries:

- `Gap`: The line stops before it and starts again after it.
- `Connect`: The line goes on from the point before it to the point after it.
- `Zero`: The row is taken to have the value nought.
