# Range Chart

A chart that shows what lies between two values at each place: the lowest and the highest temperature of a day, the least and the most a price went to, the hour a shift starts and ends at.

It is the short way of writing a `PantrixChart` with a single `RangeSeries`. The axes, the tooltip, the state, the keyboard and the screen reader are as told on the "Chart" page.

- `PantrixRangeChart` (`com.pantrixui.components.chart.range`, `com.pantrixui:components`): What lies between two values at each place, as a band between two lines or as a bar from the one to the other: the least and the most of a day, the bounds of a forecast. The short way to a chart of one range. Keywords: band chart, range bar, min max, error band, high low, floating bar.

## Features

- **A band or bars.** `RangeKind.Area` draws the range as a band that goes from place to place: two lines, and a tint of the series' colour between them. `RangeKind.Bar` puts a bar at each place, from the lower value to the higher; both ends of the bar are round, because it stands on nothing.
- **The band's look.** `lines = false` does not draw the two lines, and the band stays as its tint alone; `dash` draws the lines dashed or dotted, `marker` puts a mark on each point, and `fillAlpha` says how much of the series' colour the tint between them takes (about a sixth where it is not given). A bar reads none of these.
- **Zero.** Nothing of a range stands on zero: the value axis does not start at zero unless the axis says so, and is set out around the range's values. What is read is how far apart the two values are and where they lie.
- **A missing value.** A row with no lower or no higher value has neither: the band stops before it and starts again after it. A place left by itself is a line from its lower value to its higher.
- **Tooltip and screen reader.** The two values are written with a dash between them: "9 – 17". A press is handed the higher value as the point's `value` and the lower as its `from`.
- **Value labels.** `labels` writes the two values at the two ends of the range: the higher over it, the lower under it.
- **Horizontal.** `horizontal = true` sets the places down the side of the chart, and the ranges go along it: like the shifts of a timetable. The values are written under the chart.
- **With other series.** A chart that wants a line over the band (a forecast within its bounds), or two ranges in one chart, is a `PantrixChart`: it takes a `RangeSeries` for the range and a `LineSeries` for the line.
- **Automation.** The chart is tagged as the `PantrixChart` it is: `Chart_<tagKey>`. Its one series has the key `range`.

## Usage

### The coldest and the warmest of each day, as a band

```kotlin
PantrixRangeChart(
    data = days,
    x = { it.name },
    low = { it.coldest },
    high = { it.warmest },
    name = stringResource(Res.string.temperature),
    curve = ChartCurve.Smooth,
    description = stringResource(Res.string.temperature_of_the_week),
    tagKey = "temperature"
)
```

### The hours each shift starts and ends at, as bars with their values

```kotlin
PantrixRangeChart(
    data = shifts,
    x = { it.team },
    low = { it.start },
    high = { it.end },
    name = stringResource(Res.string.hours),
    kind = RangeKind.Bar,
    labels = ChartDataLabels(),
    tagKey = "shifts"
)
```

## Examples

### The lowest and the highest of the day

At its plainest: the rows, the `x` that gives a row's place, the lower value (`low`), the higher value (`high`) and the range's name. The band's two lines go smoothly (`curve`).

Move the pointer over a day, or touch the day: the band's two ends are marked and the tooltip writes the two values together. The axis does not start at zero: nothing of a range stands on zero.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.range.PantrixRangeChart

PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { it.coldest },
    high = { it.warmest },
    name = "Temperature",
    curve = ChartCurve.Smooth,
    yAxis = ChartAxis(format = { "${it.toInt()}°" }),
    description = "The lowest and the highest temperature by day of the week",
    tagKey = "plain"
)

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Mon", coldest = 9, warmest = 17),
    Weather("Tue", coldest = 11, warmest = 19),
    Weather("Wed", coldest = 8, warmest = 15),
    Weather("Thu", coldest = 6, warmest = 14),
    Weather("Fri", coldest = 10, warmest = 21),
    Weather("Sat", coldest = 13, warmest = 24),
    Weather("Sun", coldest = 12, warmest = 22)
)
```

### A band or bars

The same range is drawn two ways. Turn the switch: the band becomes a bar for each day, from the lower value to the higher (`RangeKind.Bar`). Both ends of a bar are round, and each day has a band of the chart's width.

A band suits what goes on from place to place: a temperature that changes day by day. Bars suit ranges that are read one by one.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.range.PantrixRangeChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var bars by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = bars,
    onCheckedChange = { bars = it },
    label = "As bars",
    tagKey = "range_bars"
)
PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { it.coldest },
    high = { it.warmest },
    name = "Temperature",
    kind = if (bars) RangeKind.Bar else RangeKind.Area,
    yAxis = ChartAxis(format = { "${it.toInt()}°" }),
    description = "The lowest and the highest temperature by day of the week",
    tagKey = "kinds"
)

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Mon", coldest = 9, warmest = 17),
    Weather("Tue", coldest = 11, warmest = 19),
    Weather("Wed", coldest = 8, warmest = 15),
    Weather("Thu", coldest = 6, warmest = 14),
    Weather("Fri", coldest = 10, warmest = 21),
    Weather("Sat", coldest = 13, warmest = 24),
    Weather("Sun", coldest = 12, warmest = 22)
)
```

### The values at its two ends

The hours each team's shift starts and ends, a bar for each team. The two values are written at the bar's two ends (`labels`): the end over it, the start under it. The hours are written the same way on the axis and in the labels (`format`). The axis is marked every six hours of the day (`values`): round steps would have marked it every five.

The line shows the lunch break (`marks`): which shift takes it in is read.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.range.PantrixRangeChart

val hour: (Double) -> String = { "${it.toInt()}:00" }
PantrixRangeChart(
    data = SHIFT_HOURS,
    x = { it.team },
    low = { it.start },
    high = { it.end },
    name = "Shift",
    kind = RangeKind.Bar,
    labels = ChartDataLabels(format = hour),
    yAxis = ChartAxis(values = listOf(0.0, 6.0, 12.0, 18.0, 24.0), format = hour),
    marks = listOf(ChartReferenceLine(y = 12, label = "Lunch break")),
    description = "The hour each team's shift starts and ends at",
    tagKey = "labels"
)

private data class ShiftHours(
    val team: String,
    val start: Int,
    val end: Int
)

private val SHIFT_HOURS = listOf(
    ShiftHours("Warehouse", start = 6, end = 14),
    ShiftHours("Store", start = 9, end = 21),
    ShiftHours("Support", start = 8, end = 18),
    ShiftHours("Evening", start = 14, end = 22)
)
```

### Shifts across

The same shifts, horizontal (`horizontal = true`): the teams are set down the side of the chart, and each shift goes from the left, from the hour it starts at to the hour it ends at, as on a timetable. The hours are written under the chart; the lunch break's line cuts the chart from top to bottom.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.range.PantrixRangeChart

val hour: (Double) -> String = { "${it.toInt()}:00" }
PantrixRangeChart(
    data = SHIFT_HOURS,
    x = { it.team },
    low = { it.start },
    high = { it.end },
    name = "Shift",
    kind = RangeKind.Bar,
    horizontal = true,
    labels = ChartDataLabels(format = hour),
    yAxis = ChartAxis(values = listOf(0.0, 6.0, 12.0, 18.0, 24.0), format = hour),
    marks = listOf(ChartReferenceLine(y = 12, label = "Lunch break")),
    description = "The hours each team's shift starts and ends at, across",
    tagKey = "horizontal_shifts"
)

private data class ShiftHours(
    val team: String,
    val start: Int,
    val end: Int
)

private val SHIFT_HOURS = listOf(
    ShiftHours("Warehouse", start = 6, end = 14),
    ShiftHours("Store", start = 9, end = 21),
    ShiftHours("Support", start = 8, end = 18),
    ShiftHours("Evening", start = 14, end = 22)
)
```

### Dashed lines and marks

The band's look comes from the series itself: its two lines dashed (`dash`), a mark on each of its points (`marker`), the tint between them darker than usual (`fillAlpha`). Turn the switch off (`lines = false`): the lines go, and the band stays with its tint and its marks.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.range.PantrixRangeChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var lines by remember { mutableStateOf(true) }
PantrixSwitchButton(
    checked = lines,
    onCheckedChange = { lines = it },
    label = "The band's lines",
    tagKey = "range_lines"
)
PantrixRangeChart(
    data = OUTLOOK,
    x = { it.month },
    low = { it.least },
    high = { it.most },
    name = "Expected range",
    lines = lines,
    dash = ChartDash.Dashed,
    marker = ChartMarker.Circle,
    fillAlpha = 0.28f,
    description = "The expected range of orders by month, with dashed lines and marks",
    tagKey = "look"
)

private data class Outlook(
    val month: String,
    val expected: Int,
    val least: Int,
    val most: Int
)

private val OUTLOOK = listOf(
    Outlook("Jul", expected = 420, least = 400, most = 440),
    Outlook("Aug", expected = 450, least = 415, most = 485),
    Outlook("Sep", expected = 470, least = 420, most = 520),
    Outlook("Oct", expected = 510, least = 440, most = 580),
    Outlook("Nov", expected = 540, least = 450, most = 630),
    Outlook("Dec", expected = 600, least = 480, most = 720)
)
```

### A forecast and its bounds

A chart that wants a line over the band is a `PantrixChart`: the bounds the forecast is trusted within are a `RangeSeries`, and the forecast itself a `LineSeries` given after it. A series given later is drawn over the one before it.

The tooltip writes the two series together: the bounds as a range, the forecast as a single value. In the legend the range is a patch and the forecast a dashed line.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.cartesian.RangeSeries
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartDash

PantrixChart(
    series = listOf(
        RangeSeries(
            key = "bounds",
            name = "Expected range",
            data = OUTLOOK,
            x = { it.month },
            low = { it.least },
            high = { it.most },
            curve = ChartCurve.Smooth
        ),
        LineSeries(
            key = "expected",
            name = "Forecast",
            data = OUTLOOK,
            x = { it.month },
            y = { it.expected },
            curve = ChartCurve.Smooth,
            dash = ChartDash.Dashed
        )
    ),
    description = "Order forecast and its expected range by month",
    tagKey = "with_line"
)

private data class Outlook(
    val month: String,
    val expected: Int,
    val least: Int,
    val most: Int
)

private val OUTLOOK = listOf(
    Outlook("Jul", expected = 420, least = 400, most = 440),
    Outlook("Aug", expected = 450, least = 415, most = 485),
    Outlook("Sep", expected = 470, least = 420, most = 520),
    Outlook("Oct", expected = 510, least = 440, most = 580),
    Outlook("Nov", expected = 540, least = 450, most = 630),
    Outlook("Dec", expected = 600, least = 480, most = 720)
)
```

### Pressing a range

A press is handed both values of the range: the point's `value` is the higher and its `from` the lower; `text` carries the two as the chart writes them. Press a day: the line below writes that day's range and how wide it is.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.range.PantrixRangeChart
import com.pantrixui.components.elements.text.PantrixText

var pressed by remember { mutableStateOf<String?>(null) }
PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { it.coldest },
    high = { it.warmest },
    name = "Temperature",
    kind = RangeKind.Bar,
    onSelect = { point ->
        val wide = point.value - (point.from ?: point.value)
        pressed = "${point.label}: ${point.text}, ${wide.toInt()} degrees apart"
    },
    description = "The lowest and the highest temperature by day of the week",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Press a day")

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Mon", coldest = 9, warmest = 17),
    Weather("Tue", coldest = 11, warmest = 19),
    Weather("Wed", coldest = 8, warmest = 15),
    Weather("Thu", coldest = 6, warmest = 14),
    Weather("Fri", coldest = 10, warmest = 21),
    Weather("Sat", coldest = 13, warmest = 24),
    Weather("Sun", coldest = 12, warmest = 22)
)
```

### Missing values

Days with no values: Wednesday and Saturday were not measured. The band stops before a day with no values and starts again after it; a day with no neighbour on either side is a line from its lower value to its higher.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.range.PantrixRangeChart

PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { row -> row.coldest.takeIf { row.day !in UNMEASURED } },
    high = { row -> row.warmest.takeIf { row.day !in UNMEASURED } },
    name = "Temperature",
    description = "Temperature by day of the week, with two days not measured",
    tagKey = "missing"
)

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Mon", coldest = 9, warmest = 17),
    Weather("Tue", coldest = 11, warmest = 19),
    Weather("Wed", coldest = 8, warmest = 15),
    Weather("Thu", coldest = 6, warmest = 14),
    Weather("Fri", coldest = 10, warmest = 21),
    Weather("Sat", coldest = 13, warmest = 24),
    Weather("Sun", coldest = 12, warmest = 22)
)

private val UNMEASURED = setOf("Wed", "Sat")
```

## API

### PantrixRangeChart

`import com.pantrixui.components.chart.range.PantrixRangeChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixRangeChart(
    data: List<T>,
    x: (T) -> Any,
    low: (T) -> Number?,
    high: (T) -> Number?,
    name: String,
    modifier: Modifier = Modifier,
    kind: RangeKind = RangeKind.Area,
    curve: ChartCurve = ChartCurve.Linear,
    lines: Boolean = true,
    dash: ChartDash? = null,
    marker: ChartMarker = ChartMarker.None,
    fillAlpha: Float = 0.16f,
    pattern: ChartPattern? = null,
    color: Color = Color.Unspecified,
    horizontal: Boolean = false,
    labels: ChartDataLabels? = null,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    tooltip: ChartTooltip? = ChartTooltip(),
    zoom: ChartZoom? = null,
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

A chart of what lies between two values at each place: the coldest and the warmest of a day, the least and the most a price went to, the hours a shift starts and ends at.

It is a `PantrixChart` with one `RangeSeries`, written shorter: it does everything a chart does. As an Area the range is a band from place to place between two lines; as a Bar it is a bar at each place, from the one value to the other. A band with a line over it, a forecast within the bounds it is trusted within, or two ranges in one chart, is a `PantrixChart` given the series for it. `horizontal`, the places go down the chart's side, one under the other, and the ranges along it: the shifts of a timetable.

Its axis of values does not start at nought unless the axis says so: nothing of a range stands on nought, and what is read is how far apart its two values are and where they lie. A row with no `low` or no `high` has neither.

The tooltip and a screen reader are given both values with a dash between them. A press is handed the higher as the point's `value` and the lower as its `from`.

```kotlin
PantrixRangeChart(
    data = days,
    x = { it.name },
    low = { it.coldest },
    high = { it.warmest },
    name = "Temperature",
    tagKey = "temperature"
)
```

Parameters:

- `data: List<T>`: the rows.
- `x: (T) -> Any`: where a row stands along the chart: a name, a day, anything that is equal to itself.
- `low: (T) -> Number?`: a row's lower value, or null where it has none.
- `high: (T) -> Number?`: a row's higher value, or null where it has none.
- `name: String`: what the two values are of: what the tooltip calls them, and a screen reader the chart where it has no `description`.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's.
- `kind: RangeKind`: whether the range is a band from place to place or a bar at each place.
- `curve: ChartCurve`: how the two lines of a band go from a point to the next. A bar has no line.
- `lines: Boolean`: whether the two lines of a band are drawn, or the tint between them alone.
- `dash: ChartDash?`: whether the two lines are drawn whole, in dashes or in dots. `null` draws them whole, and dashed where the chart's patterns are on (`ChartStyle.patterns`).
- `marker: ChartMarker`: the mark drawn on each point of the two lines. None by default.
- `fillAlpha: Float`: how much of the range's colour the tint between the lines has, from none to all of it. Left out, about a sixth.
- `pattern: ChartPattern?`: the texture the band or the bars are drawn with besides their colour. `null` draws none, and where the chart's patterns are on, none too: a chart of one range has nothing to tell it from.
- `color: Color`: the colour the range is drawn in. Left out, it is the first of the chart's colours.
- `horizontal: Boolean`: whether the places go down the chart's side and the range along it, and not along its foot and up.
- `labels: ChartDataLabels?`: the two values written at the range's ends, the higher over it and the lower under it, where they have room. `null` writes none.
- `xAxis: ChartAxis?`: the axis of the places, under the chart, or beside it where it is `horizontal`. `null` draws nothing of it.
- `yAxis: ChartAxis?`: the axis of the values, beside the chart, or under it where it is `horizontal`. `null` draws nothing of it.
- `marks: List<ChartMark>`: the lines and the bands drawn in the plot besides the range: a limit, a stretch of places.
- `tooltip: ChartTooltip?`: what is shown for the place that is pointed at. `null` shows none.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the places and move along the rest. `null`, which it is unless the chart is given one, shows all the places and no more.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a file: a picture, or a drawing that is sharp at any size. `null`, which it is unless the chart is given one, and the chart has no such button.
- `empty: (@Composable () -> Unit)?`: what the chart shows in its plot while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words. A file the chart is exported as says them.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the range that is pressed.
- `style: ChartStyle?`: this chart's own geometry.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key. The chart is tagged as the `PantrixChart` it is, `Chart_<tagKey>`, and its parts and events are that chart's; its one series has the key `range`.

### RangeSeries

`import com.pantrixui.components.chart.cartesian.RangeSeries`, from `com.pantrixui:components`

```kotlin
class RangeSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val low: (T) -> Number?,
    public val high: (T) -> Number?,
    override val color: Color = Color.Unspecified,
    public val kind: RangeKind = RangeKind.Area,
    public val curve: ChartCurve = ChartCurve.Linear,
    public val lines: Boolean = true,
    public val dash: ChartDash? = null,
    public val marker: ChartMarker = ChartMarker.None,
    public val fillAlpha: Float = 0.16f,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null,
    public val pattern: ChartPattern? = null
) : ChartSeries()
```

A series of two values at each place, drawn as what lies between them: the least and the most of a day, the bounds a forecast is trusted within, the hours a shift starts and ends at.

```kotlin
RangeSeries("temperature", "Temperature", days, x = { it.name }, low = { it.coldest }, high = { it.warmest })
```

As an Area it is a band between two lines, tinted in the series' colour; as a Bar a bar at each place that starts at the one value and ends at the other, round at both of its ends. A line over a band, a forecast within its bounds, is a `LineSeries` given after it in the same chart. A band is drawn as its `lines`, `dash`, `marker` and `fillAlpha` say; a bar reads none of them. Both are drawn with the texture `pattern` says.

Nothing of a range stands on nought, so its axis does not take nought in for it, and a range does not stack: its `stack` is always null. A row that has no `low` or no `high` has neither: the band stops before it and starts again after it. Which of the two is the greater does not matter to what is drawn.

The tooltip and a screen reader are given both values with a dash between them, and a press is handed the higher as the point's `value` and the lower as its `from`.

Two series are the same series where everything they were built from is the same, the three functions among them.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows.
- `x: (T) -> Any`: Where a row stands along the chart: a name, a day, anything that is equal to itself.
- `low: (T) -> Number?`: A row's lower value, or null where it has none.
- `high: (T) -> Number?`: A row's higher value, or null where it has none.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `kind: RangeKind`: Whether the range is a band from place to place or a bar at each place.
- `curve: ChartCurve`: How the two lines of a band go from a point to the next. A bar has no line.
- `lines: Boolean`: Whether the two lines of a band are drawn, or the tint between them alone.
- `dash: ChartDash?`: Whether the two lines are drawn whole, in dashes or in dots. Null, whole, and where the chart's patterns are on (`ChartStyle.patterns`), as its turn among the chart's series says.
- `marker: ChartMarker`: The mark drawn on each point of the two lines, where they are drawn or not. None by default.
- `fillAlpha: Float`: How much of the series' colour the tint between the lines has: from none, a band of its lines alone, to all of it. Left out, about a sixth, as a filled line's tint.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by.
- `labels: ChartDataLabels?`: The two values written at the range's ends: the higher over it and the lower under it. Null writes none.
- `pattern: ChartPattern?`: The texture the band or the bars are drawn with besides their colour. Null, none, and where the chart's patterns are on, its turn by its place among the chart's series.

### RangeKind

`import com.pantrixui.components.chart.cartesian.RangeKind`, from `com.pantrixui:components`

```kotlin
enum class RangeKind
```

What a `RangeSeries` draws between the two values it has at a place.

Entries:

- `Area`: A band from place to place, between the line through the lower values and the line through the higher.
- `Bar`: A bar at each place, from its lower value to its higher: a bar that stands on no axis.

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
