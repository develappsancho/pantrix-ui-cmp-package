# Area Chart

An area chart of rows that are given once: a line for each value read from the rows, and an area that fills the room between the line and zero. It is for amounts read by their height: a revenue, a traffic, a stock.

It is the short way of writing a `PantrixChart` whose series are all filled lines and all read from the same rows. The axes, the legend, the tooltip, the state, the keyboard and the screen reader are as told on the "Chart" page.

- `PantrixAreaChart` (`com.pantrixui.components.chart.area`, `com.pantrixui:components`): A filled line for each value read from one list of rows, for amounts that are read by their height: the short way to a chart whose series are all areas. Keywords: area graph, filled line, stacked area, volume, cumulative.

## Features

- **Fill.** `fill` says what the room under the line is filled with: `Gradient` is the series' colour fading from the line towards zero, `Solid` an even tint of the colour.
- **Zero.** An area chart's value axis starts at zero: an area's height is read as an amount, and an area cut off above zero shows less than there is. The axis can say otherwise with `startFromZero = false`. Where values go below zero the area fills downwards from the zero line.
- **Areas over one another.** Each area is drawn over the one before it, and all from zero: a later series covers an earlier one where it is larger. The fading fill shows the one underneath; give the larger series first.
- **Stacked areas.** With `stacked` each area stands on the one before it, and the topmost line is the total: the parts of a whole are shown so. The tooltip writes each series' own value, and then the total. With `stacking = ChartStacking.Percent` each place's total counts as a hundred percent and the areas show the shares.
- **Line.** `curve`, `missing`, and a series' `dash` and `marker` are as in the line chart.
- **Automation.** The chart is tagged as the `PantrixChart` it is: `Chart_<tagKey>`.

## Usage

### One amount over the months, rounded and fading down

```kotlin
PantrixAreaChart(
    data = months,
    x = { it.name },
    values = listOf(ChartValue("revenue", stringResource(Res.string.revenue)) { it.revenue }),
    curve = ChartCurve.Smooth,
    description = stringResource(Res.string.revenue_of_the_year),
    tagKey = "revenue"
)
```

### Two amounts in flat tints, the larger first

```kotlin
PantrixAreaChart(
    data = days,
    x = { it.day },
    values = listOf(
        ChartValue("requests", stringResource(Res.string.requests)) { it.requests },
        ChartValue("errors", stringResource(Res.string.errors)) { it.errors }
    ),
    fill = ChartFill.Solid,
    tagKey = "requests"
)
```

## Examples

### A single amount

A single amount over the months: the line goes through smoothly and the room under it is filled, its colour fading towards zero. The value axis starts at zero by itself; its values are written short (`format`).

A chart of one series has no legend: what the line is belongs to the words around the chart.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixAreaChart(
    data = STORAGE,
    x = { it.month },
    values = listOf(ChartValue("used", "Space used") { it.used }),
    curve = ChartCurve.Smooth,
    yAxis = ChartAxis(format = { "${strings.decimal(it)} GB" }),
    description = "Storage space used by month",
    tagKey = "plain"
)

private data class Storage(
    val month: String,
    val used: Int,
    val backups: Int
)

private val STORAGE = listOf(
    Storage("Jan", used = 120, backups = 40),
    Storage("Feb", used = 138, backups = 46),
    Storage("Mar", used = 151, backups = 52),
    Storage("Apr", used = 149, backups = 61),
    Storage("May", used = 176, backups = 64),
    Storage("Jun", used = 203, backups = 72),
    Storage("Jul", used = 221, backups = 85),
    Storage("Aug", used = 214, backups = 91),
    Storage("Sep", used = 252, backups = 96),
    Storage("Oct", used = 281, backups = 110),
    Storage("Nov", used = 305, backups = 124),
    Storage("Dec", used = 342, backups = 131)
)
```

### Two amounts, two fills

Two amounts, the larger given first. With `Gradient` each area fades from its line towards zero, and the area underneath shows through the one above; with `Solid` the fill is an even tint. Turn the switch and compare the two.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var solid by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = solid,
    onCheckedChange = { solid = it },
    label = "Solid fill",
    tagKey = "area_solid"
)
PantrixAreaChart(
    data = STORAGE,
    x = { it.month },
    values = listOf(
        ChartValue("used", "Space used") { it.used },
        ChartValue("backups", "Backups") { it.backups }
    ),
    curve = ChartCurve.Smooth,
    fill = if (solid) ChartFill.Solid else ChartFill.Gradient,
    description = "Space used and backups by month",
    tagKey = "fills"
)

private data class Storage(
    val month: String,
    val used: Int,
    val backups: Int
)

private val STORAGE = listOf(
    Storage("Jan", used = 120, backups = 40),
    Storage("Feb", used = 138, backups = 46),
    Storage("Mar", used = 151, backups = 52),
    Storage("Apr", used = 149, backups = 61),
    Storage("May", used = 176, backups = 64),
    Storage("Jun", used = 203, backups = 72),
    Storage("Jul", used = 221, backups = 85),
    Storage("Aug", used = 214, backups = 91),
    Storage("Sep", used = 252, backups = 96),
    Storage("Oct", used = 281, backups = 110),
    Storage("Nov", used = 305, backups = 124),
    Storage("Dec", used = 342, backups = 131)
)
```

### Values that go below zero

Values on both sides of zero: a month's profit or loss. An area always fills towards zero: downwards in profit, upwards in loss. A line is drawn at zero, and the fading fill is strongest at the farthest point on either side of zero.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixAreaChart(
    data = PROFIT,
    x = { it.first },
    values = listOf(ChartValue("profit", "Profit") { it.second }),
    yAxis = ChartAxis(format = { strings.compact(it) }),
    description = "Profit and loss by month",
    tagKey = "below_zero"
)

private val PROFIT = listOf(
    "Jan" to 84_000,
    "Feb" to 52_000,
    "Mar" to 21_000,
    "Apr" to -18_000,
    "May" to -46_000,
    "Jun" to -31_000,
    "Jul" to 9_000,
    "Aug" to 38_000,
    "Sep" to 67_000,
    "Oct" to 95_000,
    "Nov" to 112_000,
    "Dec" to 140_000
)
```

### A stepped area

A value that holds until it changes: a warehouse's stock. `StepAfter` carries each value level until the next, and the fill fills the room under the steps.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartFill

PantrixAreaChart(
    data = STOCK,
    x = { it.first },
    values = listOf(ChartValue("stock", "Stock") { it.second }),
    curve = ChartCurve.StepAfter,
    fill = ChartFill.Solid,
    description = "Stock in the warehouse by week",
    tagKey = "stepped"
)

private val STOCK = listOf(
    "Week 1" to 480,
    "Week 2" to 480,
    "Week 3" to 310,
    "Week 4" to 310,
    "Week 5" to 640,
    "Week 6" to 520,
    "Week 7" to 520,
    "Week 8" to 270
)
```

### Stacked areas

The parts of a whole: visits from three sources, stacked (`stacked`). Each area starts at the line of the one under it, and the topmost line is all the visits. The fill is a flat tint: so it reads where each area of the stack ends. The tooltip writes the month's total after the sources.

Turn the switch: each month counts as a hundred percent (`stacking = ChartStacking.Percent`). The areas are now the sources' shares and the axis writes percentages; the tooltip adds each value's share beside it.

Press a name in the legend: the source goes, and the ones over it come down into its place.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartStacking
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var shares by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = shares,
    onCheckedChange = { shares = it },
    label = "As shares",
    tagKey = "area_shares"
)
PantrixAreaChart(
    data = SOURCES,
    x = { it.month },
    values = listOf(
        ChartValue("search", "Search") { it.search },
        ChartValue("direct", "Direct") { it.direct },
        ChartValue("social", "Social") { it.social }
    ),
    fill = ChartFill.Solid,
    stacked = true,
    stacking = if (shares) ChartStacking.Percent else ChartStacking.Normal,
    description = "Visits from three sources by month, stacked",
    tagKey = "stacked"
)

private data class Sources(
    val month: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val SOURCES = listOf(
    Sources("Jan", search = 420, direct = 240, social = 130),
    Sources("Feb", search = 480, direct = 260, social = 120),
    Sources("Mar", search = 455, direct = 300, social = 165),
    Sources("Apr", search = 530, direct = 280, social = 190),
    Sources("May", search = 510, direct = 330, social = 240),
    Sources("Jun", search = 560, direct = 310, social = 285)
)
```

## API

### PantrixAreaChart

`import com.pantrixui.components.chart.area.PantrixAreaChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixAreaChart(
    data: List<T>,
    x: (T) -> Any,
    values: List<ChartValue<T>>,
    modifier: Modifier = Modifier,
    curve: ChartCurve = ChartCurve.Linear,
    fill: ChartFill = ChartFill.Gradient,
    missing: ChartMissing = ChartMissing.Gap,
    stacked: Boolean = false,
    stacking: ChartStacking = ChartStacking.Normal,
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

An area chart of rows that are given once: for each of the `values` read from them a line, with the room between it and nought filled.

It is a `PantrixChart` whose series are all filled lines read from the same rows, written shorter. Its axis of values starts at nought unless the axis says otherwise: the height of a filled area is read as an amount, and an area cut off above nought shows less than there is.

Each area is drawn over the one before it, and all of them from nought: a later series covers an earlier one where it is the larger, which the fading `fill` lets through. Give the larger series first. Where the values are parts of a whole they are `stacked`: each area stands on the one before it, and the topmost line is the whole. Stacked by their shares, as `stacking` says, the topmost line is a hundred percent all along, and the areas show how the whole is shared out from place to place.

```kotlin
PantrixAreaChart(
    data = months,
    x = { it.name },
    values = listOf(ChartValue("revenue", "Revenue") { it.revenue }),
    curve = ChartCurve.Smooth,
    tagKey = "revenue"
)
```

Parameters:

- `data: List<T>`: the rows, in the order the lines go through them.
- `x: (T) -> Any`: where a row stands along the chart: a name, a day, anything that is equal to itself.
- `values: List<ChartValue<T>>`: the series: what each reads from a row, and how it is called and drawn.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `curve: ChartCurve`: how each line goes from a point to the next.
- `fill: ChartFill`: what the room under each line is filled with: its colour fading down to nought, or a tint of it.
- `missing: ChartMissing`: what a line does at a row that has no value.
- `stacked: Boolean`: whether each area stands on the one before it, in the order of `values`, and not on nought.
- `stacking: ChartStacking`: how the stacked areas stand on one another: as their values, or as their shares of the stack. Areas that are not `stacked` have no stack for it to go by.
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

### ChartFill

`import com.pantrixui.components.chart.common.ChartFill`, from `com.pantrixui:components`

```kotlin
enum class ChartFill
```

What the room between a line and nought is filled with.

Entries:

- `None`: Nothing: a line.
- `Solid`: A soft tint of the series' colour, the same from the line down.
- `Gradient`: The series' colour, fading from the line down to nothing at nought.

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
