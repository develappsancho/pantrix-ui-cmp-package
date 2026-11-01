# Polar Chart

Bars set out round a middle: each as long from the middle out as its value. It suits what comes round again: the hours of a day, the months of a year, the points of a compass; and what is to be compared at a glance by how far each reaches.

The chart is given its series; each `PolarSeries` carries its own rows: the sector a row stands in (`x`) and its value there (`y`). The sectors are set out in the order the series name them, clockwise from twelve o'clock, each an equal part of the turn. The axis of values goes out from the middle: from nought to a round number over the values.

- `PantrixPolarChart` (`com.pantrixui.components.chart.polar`, `com.pantrixui:components`): Bars set out round a middle, each as long from the middle out as its value, side by side or stacked, with a legend that takes series out and brings them back, a tooltip for the sector pointed at, and every sector reachable by keys and by a screen reader. Keywords: polar area, rose chart, nightingale, radial bar, coxcomb.

## Features

- **Side by side and stacked.** The bars of several series stand side by side in a sector; the series that name the same `stack` share one bar there, each further out than the one before it.
- **The hole in the middle.** With `hole` the bars start from a ring: the shortest shows too. No more than nine tenths of the radius.
- **Rings.** The value rings are round: so are the bars' ends, which are read against them. With `grid = RadarGrid.Polygon` the rings are drawn straight from one side of a sector to the other, and the bars' ends are straight too. The marked values are written over the line at the start of the first sector, over the bars.
- **Fill.** `fillAlpha` says how much of its colour a series' bars are filled with: under one, the rings behind show. The legend and the tooltip show the whole colour.
- **Axes.** `xAxis` is the sectors: their names (`labels`, `label`) and the lines between them (`line`). `yAxis` is the axis of values: its ends, how many values it marks, how they are written, the values (`labels`) and the rings (`grid`).
- **The sector pointed at.** The sector the pointer is over, or the one that is tapped, is shaded, and the tooltip writes the values the series have there.
- **Keyboard.** The chart is one stop for Tab: the arrows go from sector to sector round the chart, and after the last back to the first; Home and End go to the first and the last sector, Escape lets go, Enter and Space press the value that is pointed at.
- **Screen reader.** The chart says its `description`, then each sector with the values the series have there.
- **Direction.** The chart turns the same way in a language read from right to left too.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `PolarChart_<tagKey>`; the plot is `.Plot`, the sectors `.Point_<number>`, the legend's entries `.Legend_<series>`, the tooltip `.Tooltip`.

## Usage

### The hours of a day

```kotlin
PantrixPolarChart(
    series = listOf(
        PolarSeries("visits", stringResource(Res.string.visits), hours, x = { it.hour }, y = { it.visits })
    ),
    hole = 0.3f,
    description = stringResource(Res.string.visits_by_hour),
    tagKey = "hours"
)
```

### Two series stacked in each sector

```kotlin
PantrixPolarChart(
    series = listOf(
        PolarSeries("new", stringResource(Res.string.new_visitors), months, { it.name }, { it.new }, stack = "all"),
        PolarSeries("back", stringResource(Res.string.returning), months, { it.name }, { it.back }, stack = "all")
    ),
    tagKey = "visitors"
)
```

## Examples

### The hours of a day

A shop's visitors by the hour of the day, in parts of two hours. There is a hole in the middle (`hole`): the short bars of the night hours show too.

Move the pointer over a sector or tap it: the sector is shaded and the tooltip writes the visitors of those hours.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Visits", shopHours(), x = { it.hours }, y = { it.weekday })),
    hole = 0.25f,
    description = "Visits by the hour",
    tagKey = "plain"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Two series side by side

Weekdays and the weekend, side by side in each sector: the difference between the two at the same hours is read.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

val hours = shopHours()
PantrixPolarChart(
    series = listOf(
        PolarSeries("weekday", "Weekdays", hours, x = { it.hours }, y = { it.weekday }),
        PolarSeries("weekend", "Weekend", hours, x = { it.hours }, y = { it.weekend })
    ),
    hole = 0.25f,
    description = "Visits by the hour, on weekdays and at the weekend",
    tagKey = "grouped"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Stacked

Two series that name the same `stack` share one bar in each sector: the whole bar shows the total, and its parts who it came from.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

val hours = shopHours()
PantrixPolarChart(
    series = listOf(
        PolarSeries("store", "Shop", hours, x = { it.hours }, y = { it.weekday }, stack = "all"),
        PolarSeries("online", "Online", hours, x = { it.hours }, y = { it.online }, stack = "all")
    ),
    description = "Visits by the hour, in the shop and online",
    tagKey = "stacked"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Straight rings

Straight rings (`RadarGrid.Polygon`): each ring is straight from one side of a sector to the other, and the bars' ends are straight too and sit on their ring's line. The bars are filled with sixty per cent of their colour (`fillAlpha`): the rings behind them show.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries
import com.pantrixui.components.chart.radar.RadarGrid

PantrixPolarChart(
    series = listOf(
        PolarSeries("visits", "Visits", shopHours(), x = { it.hours }, y = { it.weekday }, fillAlpha = 0.6f)
    ),
    hole = 0.25f,
    grid = RadarGrid.Polygon,
    description = "Visits by the hour",
    tagKey = "polygon"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### A look of its own

A chart's own look: more room between the bars (`sliceGap`), no lines between the sectors (the `line` of `xAxis`), and an axis that marks four values (the `ticks` of `yAxis`). A field that is not given stays the theme's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Visits", shopHours(), x = { it.hours }, y = { it.weekend })),
    xAxis = ChartAxis(line = false),
    yAxis = ChartAxis(ticks = 4),
    description = "Visits by the hour at the weekend",
    style = ChartStyle(sliceGap = 6.dp),
    tagKey = "own_look"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the rings, the hours and the slices.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Visits", shopHours(), x = { it.hours }, y = { it.weekday })),
    hole = 0.25f,
    description = "Visits by the hour",
    tagKey = "exported",
    export = ChartExport(fileName = "hours") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixPolarChart

`import com.pantrixui.components.chart.polar.PantrixPolarChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixPolarChart(
    series: List<PolarSeries<*>>,
    modifier: Modifier = Modifier,
    hole: Float = 0f,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    grid: RadarGrid = RadarGrid.Circle,
    export: ChartExport? = null
)
```

A polar chart: bars set out round a middle, each as long from the middle out as its value: a rose. It suits what comes round again, the hours of a day, the months of a year, the points of a compass, and what is to be compared at a glance by how far each reaches.

The chart is given its `series`, and each of them carries its own rows: the sector a row stands in and its value there. The chart sets out every sector any of them names, in the order they are first named, clockwise from twelve o'clock, each an equal part of the turn. The bars of several series stand side by side in a sector, and the series that name the same `stack` share one bar there. One axis of values goes out from the middle: from nought, unless the axis says otherwise, to a round number over the most of the values. Its rings are round, as the ends of the bars are that are read against them; with a `grid` of polygons they are straight from one sector's side to the next, and so are the bars' ends. With a `hole` the bars start from a ring, and the shortest of them still shows.

Around the bars stand the parts a chart with places has, each given by what describes it and taken away by `null`: the two axes, the `legend`, which lists the series and takes one out of the chart when its entry is pressed, and the `tooltip`, which shows the values in the sector that is pointed at.

**Pointing at a sector.** A pointer over a sector points at it; a finger does by a tap, and a tap on the sector it points at lets go of it. With the keyboard the chart is one stop for Tab: the arrows go from sector to sector round the chart, and past the last to the first again, Home and End to the first and the last, and Escape lets go. Where the tooltip tells the series apart, the arrows up and down go from one series' bar to the next. The sector is shaded, the tooltip shown for it, and it is told to `state`. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, then each sector with the values the series have there, in the sectors' order; the legend's entries are switches.

**Its size.** The chart is as wide as it is given room. A height on its modifier is the whole chart's, the legend's with it; given none, it is as tall as the chart's style says and a legend above or under it adds its own. The rose is the largest that has room in what the legend leaves, with the sectors' names about it.

The chart turns the same way in a language read from the right; its legend and its tooltip follow the reading direction.

```kotlin
PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Visits", hours, x = { it.hour }, y = { it.visits })),
    hole = 0.3f,
    description = "Visits by the hour of the day",
    tagKey = "hours"
)
```

Parameters:

- `series: List<PolarSeries<*>>`: the series, in the order they are drawn and listed. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `hole: Float`: how much of the chart's radius is cut out of its middle: nought for bars that start at the middle. No more than nine tenths.
- `xAxis: ChartAxis?`: the sectors: whether their names are written about the chart (`labels`), how a name is written (`label`), and whether a line is drawn between one sector and the next (`line`). `null` draws nothing of them.
- `yAxis: ChartAxis?`: the axis of the values, out from the chart's middle: its ends, about how many values it marks, how a value is written, whether the marked values are written (`labels`) and whether a ring is drawn at each (`grid`). It starts at nought unless `startFromZero` or `min` says otherwise. `null` draws nothing of it.
- `legend: ChartLegend?`: where the names of the series stand. `null` shows none.
- `tooltip: ChartTooltip?`: what is shown for the sector that is pointed at. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader has hidden and what they point at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its series.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the value that is pressed: the one pointed at, or of the series whose bar is nearest the press where the sector's values are pointed at together.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `PolarChart_<tagKey>`, its plot `PolarChart_<tagKey>.Plot`, a sector of it `PolarChart_<tagKey>.Point_<number>` counted from one, the legend's entry of a series `PolarChart_<tagKey>.Legend_<series' key>` and the tooltip `PolarChart_<tagKey>.Tooltip`. A press on a value is reported as a `PolarChart` `select` event with the series' key, and a press on a legend's entry as a `toggle` event with the key and whether the series is shown. Nothing of the values is reported.
- `grid: RadarGrid`: how the rings are drawn: round, or straight from one side of a sector to the next, a web, whose bars end straight on its lines and are read against them. A chart of fewer than three sectors has round rings either way.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button.

### PolarSeries

`import com.pantrixui.components.chart.polar.PolarSeries`, from `com.pantrixui:components`

```kotlin
class PolarSeries<T>(
    public val key: String,
    public val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    public val color: Color = Color.Unspecified,
    public val stack: String? = null,
    public val pattern: ChartPattern? = null,
    public val fillAlpha: Float = 1f
)
```

One series of bars in a `PantrixPolarChart`: the rows it is read from, the sector each of them stands in and its value there.

```kotlin
PolarSeries("north", "North", months, x = { it.name }, y = { it.north })
```

`x` says which sector a row stands in: a name, a month, anything that is equal to itself; the chart writes it with its axis' `label`, and as it writes itself where that is left out. `y` is the row's value, and null where it has none: a row with no value has no bar. A value that is no number, or has no end, is taken as none.

Two series are the same series where everything they were built from is the same, the two functions among them.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows.
- `x: (T) -> Any`: The sector a row stands in.
- `y: (T) -> Number?`: A row's value, or null where it has none.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `stack: String?`: What the series is stacked with. The series that name the same stack share one bar in each sector, each further out than the one before it. Null, a series has a bar of its own beside the others'.
- `pattern: ChartPattern?`: The texture its bars are drawn with besides its colour. Null, none, and where the chart's patterns are on (`ChartStyle.patterns`), its turn by its place among the chart's series.
- `fillAlpha: Float`: How much of its colour its bars are filled with: nought to one, all of it by default. Less lets the rings behind its bars show through them; the legend and the tooltip keep the whole colour.

### RadarGrid

`import com.pantrixui.components.chart.radar.RadarGrid`, from `com.pantrixui:components`

```kotlin
enum class RadarGrid
```

How the rings of a `PantrixRadarChart` are drawn: the lines that mark its values about its middle.

Entries:

- `Polygon`: Straight from one spoke to the next: a web.
- `Circle`: Round.

### ChartAxis

`import com.pantrixui.components.chart.cartesian.ChartAxis`, from `com.pantrixui:components`

```kotlin
class ChartAxis(
    public val title: String? = null,
    public val labels: Boolean = true,
    public val line: Boolean? = null,
    public val grid: Boolean? = null,
    public val ticks: Int = 0,
    public val values: List<Double>? = null,
    public val min: Double? = null,
    public val max: Double? = null,
    public val startFromZero: Boolean? = null,
    public val format: ((Double) -> String)? = null,
    public val label: ((Any) -> String)? = null,
    public val time: ChartTime? = null,
    public val numeric: Boolean = false
)
```

An axis of a `PantrixChart`: what is written along it, the lines drawn from it, and, for an axis of values, how far it goes.

A chart has an axis along which its series stand, the places their rows name, and an axis of the values they have there; a chart whose series are of two kinds of value, an amount and a share of it, has a second axis of values at its other side. Each takes what applies to it and leaves the rest: the places have no least and no most, the values no `label`.

```kotlin
val strings = PantrixTheme.strings
PantrixChart(series = series, yAxis = ChartAxis(title = "Visits", format = { strings.compact(it) }))
```

`null` in the place of an axis draws nothing of it: no labels, no line, no grid. The series are set out by it all the same.

Parameters:

- `title: String?`: What the axis measures, written beside it: under the places, and turned along the side of the values. None where it is left out.
- `labels: Boolean`: Whether the places, or the values at the grid's lines, are written. Where the places do not all have room, every second, or third, is written, and the same ones as the chart's width changes little.
- `line: Boolean?`: Whether a line is drawn along the axis. Left out, the places have one, under them, and the values have none.
- `grid: Boolean?`: Whether a line is drawn across the chart at each of the axis' marks. Left out, the values have them and the places do not; a second axis of values has them where the first axis is not drawn, at its own marks.
- `ticks: Int`: About how many values are marked along an axis of values. They stand at round numbers, and no nearer each other than that many would: there may be fewer. Nought marks as many as have room. A second axis of values has its say in it only where it is marked by itself: where it names an end or is given its `values`. Otherwise its marks stand on the first's lines.
- `values: List<Double>?`: The values marked along an axis of values, in the place of round steps: `listOf(0.0, 6.0, 12.0, 18.0, 24.0)` for the hours of a day. Those that lie between the axis' ends are marked; an end that is not named goes as far as the farthest of them and of the values the axis shows. `ticks` is not read. A second axis of values that is given its own is marked by itself, and the grid stays the first's.
- `min: Double?`: The least value the axis shows. Left out, it is a round number under the least of the values, or nought where `startFromZero` says so. A second axis of values that names an end is marked by itself.
- `max: Double?`: The most the axis shows. Left out, it is a round number over the most of the values.
- `startFromZero: Boolean?`: Whether an axis of values starts at nought though every value is far over it, or ends there though every value is under it. Left out, it does where a series is filled, since the height of a filled area is read as an amount, and does not for lines alone, whose rise and fall is what is read.
- `format: ((Double) -> String)?`: How a value of the axis is written: beside the axis, in the tooltip and to a screen reader. Left out, beside the axis a value is written short from ten thousand on (`12K`), and everywhere else in full, in the theme's language.
- `label: ((Any) -> String)?`: How a place is written, given what a series' `x` gave for it: under the chart, as the tooltip's heading and to a screen reader. Left out, it is written as it writes itself, and a whole number in the theme's digits. In a chart whose places are moments it says how a place is written in the tooltip and to a screen reader, and the axis' marks are `time`'s to write.
- `time: ChartTime?`: For a chart whose places are moments, every one a `kotlin.time.Instant`: how they are written and by which clock. Left out, in the theme's language and by the screen's clock (`LocalPantrixClock`). An axis of values reads none of it.
- `numeric: Boolean`: Whether an axis of places whose places are all numbers sets them out by their numbers: in their order, as far apart as they are, with the axis marked at round numbers, each written as `format` says, as the places are too where `label` says nothing; and a mark of the chart at any number between them. Left out, numbers are names like any other, at even steps in the order the rows name them: years, the numbers of the weeks. An axis of values reads none of it.

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
