# Chart

Values along a run of places: lines and filled areas through the value each series has at each place, with the axis of the places under them and the axis of the values beside them. This is how the course of a measurement over the months, or two things going side by side, is shown.

The chart takes its series, and each series carries its own rows: what it is drawn from, where a row stands and what its value is. The axes, the legend and the tooltip are parts of the chart: each is given by the value that describes it and taken away by `null`.

- `PantrixChart` (`com.pantrixui.components.chart.cartesian`, `com.pantrixui:components`): Values along a run of places as lines, filled areas and bars, side by side or stacked, with axes, a second axis of values, lines and bands to read the series by, values written at their marks, a legend that takes series out and brings them back, a tooltip for the place pointed at, and every place reachable by keys and by a screen reader. Keywords: graph, plot, combo chart, time series, axis chart, mixed chart.

## Features

- **Series.** A `LineSeries` is a line; with `fill` the room under the line is filled and it becomes an area. A `BarSeries` is a bar at each place. Each series takes a key (`key`), a name, its rows and two functions that read two things from those rows: `x` the row's place, `y` its value. A row with no value gives `null`. Series of different kinds are drawn in one chart: a line over bars.
- **Stacking.** Series that name the same `stack` stand on one another at each place: bars in a single bar, areas on top of each other. A series that names none stands on zero by itself.
- **Places.** A place is what a row's `x` gives: a name, a day, anything that equals itself. The chart sets out every place any of its series names, in the order they are first named. Series need not be read from one list, and need not stand at the same places either.
- **Time axis.** A chart whose every place is a moment (`kotlin.time.Instant`) sets its places out by time: in the order of time whatever the order of the rows, and as far apart as their moments are. The axis is marked at round moments (hour, day, month) and a place is written as a date: by the device's clock and in the theme's language, unless the `time` of `xAxis` (`ChartTime`) says otherwise. No date library is needed.
- **Axes.** `xAxis` is the axis of the places, `yAxis` of the values. A `ChartAxis` says its title, whether it is written, its line and its grid lines; the axis of values also its least, its most, whether it starts at zero and how many values are marked. Values are marked at round numbers.
- **A second axis.** In a chart with two kinds of value (a count and a rate), a series that says `axis = ChartYAxis.Second` is drawn by a scale of its own; that scale's axis (`secondYAxis`) is written at the chart's other side, and its marks stand on the first axis' grid lines. Each value is written the way its own axis writes. A stack is made of the series of one axis.
- **Writing.** Values are written in the theme's language: short beside the axis from ten thousand on (`12K`), in full in the tooltip. `format` says how an axis' values are written, `label` how its places are.
- **Marks.** `marks` draws what the series are read against: a line at a value or at a place (`ChartReferenceLine`), a shaded band between two values or two places (`ChartReferenceBand`). A mark at a value makes its axis go far enough to show it. A mark that has a label is said to a screen reader too.
- **Value labels.** A series' `labels` writes its values at their marks: over a line's point, at the end of a bar, inside a bar of a stack. A label that has no room is left out.
- **Legend.** The names of the series, each beside a sample that shows how the series is drawn. A chart of one series has no legend. Pressing an entry takes the series out of the chart, pressing it again brings it back; the axis is set again for the series that stay. The legend stands on one of the chart's four sides.
- **Tooltip.** The values at the place pointed at, in a small card beside the place. With `shared` the values of all the series there are shown together, and with it off only the value of the series nearest the pointer. `format` says how the card writes its values; left out, the axis' `format` writes them. `content` leaves the inside of the card to the screen. In a narrow chart with no room beside the place the card stands over the place, at the end the values are not at.
- **Pointing at a place.** A pointer over the chart points at the nearest place. A finger points by touching, or drawn along the chart; a second touch on the place it points at lets go of it. The place is marked by a line; in a chart that has bars its band is shaded.
- **Keyboard.** The chart is one stop for Tab. The arrow keys go from place to place, Home and End to the first and the last place, and Escape lets go; Enter and Space press the value pointed at. Where the tooltip tells the series apart, the arrows up and down go from one series' value to the next.
- **State.** `ChartState` holds the series the reader has hidden and the place they point at. A screen that makes one with `rememberChartState` and gives it to the chart reads both, and says both; two charts given the same state behave as one.
- **Zoom.** A chart that is given a `zoom` (`ChartZoom`) shows a part of its places as wide as the plot, and is moved along the rest. With a mouse: the wheel, while Ctrl (Command on a Mac) is held, zooms about the place under the pointer, and a wheel turned sideways and a drag move along the places; a wheel with no key is the page's. Two fingers spread apart zoom in, and moved together they take the places along; one finger points at a place, as in any chart. On the keyboard plus and minus zoom in and out, zero brings all the places back, and the arrows bring the place they go to into view. For whoever uses none of those there are the buttons (`buttons`) and, under the plot, the navigator that all the places lie on (`navigator`). The part in view is in the `ChartState` (`window`, `zoomTo`, `resetZoom`): two charts given the same state zoom together. The axes of values stay as all the values have them and hold still as you move along; `fitValues = true` makes them again for the values of the places in view, and the navigator stays on the axes of all the values. A chart that is given no `zoom` does none of this.
- **Export.** A chart that is given an `export` (`ChartExport`) has an export button among its own: the reader chooses the kind (PNG, SVG, PDF), the chart makes the file and hands it to `onExport`. Where the file goes is the app's to say: a phone shares it, a window saves it, a browser downloads it. The file shows the chart as it is on the screen: a series that was taken out is out, and of a chart that is zoomed it has the part in view; the place that is pointed at, the tooltip and the buttons are not in it, and the legend stands under the plot. An SVG and a PDF are lines and shapes, sharp at any size; their words are written in a typeface of whatever opens the file. A chart that is given no `export` has no such button.
- **Many points.** A line with more than two points to a pixel is thinned (`decimation`, `ChartDecimation`): the default `DecimationAlgorithm.MinMax` goes through the first, the highest, the lowest and the last point of each column of pixels, covers the same pixels and does far less work; `DecimationAlgorithm.Lttb` keeps one point to a pixel and keeps the line's shape. `threshold` says after how many points it is thinned; `decimation = null` draws every point. A thinned line is drawn straight, and its points have no marks. A chart that is looked at closer draws only the places in view.
- **Size.** The chart fills the width it is given. A height given with `modifier` is the whole chart's; given none, the plot is as tall as the style says and a legend above or under it adds to that. Place names that have no room left to be written are left out by a rule: every second, every third.
- **Motion.** The chart comes in drawn from the side where the places start; when the values change, each goes from where it was to where it is. Where the system asks for reduced motion none of it moves.
- **Colour.** A series that does not say its colour takes the one at its place among the theme's chart colours; a hidden series keeps its place and its colour. The grid lines and the words are the theme's; where the chart stands on a fill they come from the colour that is read there.
- **Patterns.** `ChartStyle(patterns = true)` tells series apart by more than their colours: the first series stays plain, the others have a texture cut into their fills in turn (`ChartPattern`), lines are drawn dashed and dotted in turn, and after the fourth line their points are marked. A step of a waterfall that takes away and a candle that falls take a texture too. The legend, the tooltip and an exported file show the same texture. Left out, the system's setting is followed: the patterns are on where iOS's "Differentiate Without Color" or Android's colour correction is. A series says its own texture with `pattern` and its own dashes with `dash`; what it says always holds.
- **Reading direction.** In a language written from right to left the places start at the right and the values are written at the right.
- **Screen reader.** The chart first says its description, given with `description`, then each place with the values the series have there. The legend's entries are switches. A chart of more than two hundred places is read by its description alone.
- **Automation.** With `tagKey` the chart is `Chart_<tagKey>`, the plot `Chart_<tagKey>.Plot`, a place `Chart_<tagKey>.Point_<number>`, a series' legend entry `Chart_<tagKey>.Legend_<the series' key>`, and the tooltip `Chart_<tagKey>.Tooltip`. The zoom buttons are `Chart_<tagKey>.Zoom_in`, `.Zoom_out`, `.Zoom_all`, `.Zoom_back` and `.Zoom_on`, the navigator is `Chart_<tagKey>.Navigator`, and the export button `Chart_<tagKey>.Export`. A press on a value is reported as `select`, a press on a legend entry as `toggle`, a press of a zoom button or key as `zoom`, and a file that is made as `export` with its kind; nothing of the values is reported.

## Usage

### Two series read from the same rows

```kotlin
PantrixChart(
    series = listOf(
        LineSeries("visits", stringResource(Res.string.visits), days, x = { it.day }, y = { it.visits }),
        LineSeries("orders", stringResource(Res.string.orders), days, x = { it.day }, y = { it.orders })
    ),
    modifier = Modifier.height(240.dp),
    description = stringResource(Res.string.traffic_of_the_month),
    tagKey = "traffic"
)
```

### A filled area with its values written short, and no legend

```kotlin
val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        LineSeries(
            key = "revenue",
            name = stringResource(Res.string.revenue),
            data = months,
            x = { it.name },
            y = { it.revenue },
            curve = ChartCurve.Smooth,
            fill = ChartFill.Gradient
        )
    ),
    yAxis = ChartAxis(format = { strings.compact(it) }),
    legend = null,
    tagKey = "revenue"
)
```

### A count and a rate on two axes, with a target line

```kotlin
val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        BarSeries("orders", stringResource(Res.string.orders), months, x = { it.name }, y = { it.orders }),
        LineSeries(
            key = "returned",
            name = stringResource(Res.string.return_rate),
            data = months,
            x = { it.name },
            y = { it.returnRate },
            axis = ChartYAxis.Second
        )
    ),
    secondYAxis = ChartAxis(format = { strings.percent(it) }),
    marks = listOf(ChartReferenceLine(y = 400, label = stringResource(Res.string.target))),
    tagKey = "orders"
)
```

## Examples

### Two series

At its plainest: two series read from the same rows. Each `LineSeries` takes its key, its name, the rows, and the two functions that read the place (`x`) and the value (`y`) from those rows.

The rest comes by itself: the axis of the months under the chart and of round values beside it, grid lines at the values, a legend since there are two series, and the tooltip of the place pointed at. Move the pointer over the chart, or draw a finger along it; press a name in the legend to take its series out.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartSeries
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart

val series: List<ChartSeries> = listOf(
    LineSeries("desktop", "Desktop", VISITS, x = { it.month }, y = { it.desktop }),
    LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile })
)
PantrixChart(
    series = series,
    description = "Desktop and mobile visits by month",
    tagKey = "two_series"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

### Series from their own rows

Series need not be read from one list. Here the measured values come from one list and the forecast from another, and the two meet only in September. The chart sets out every place any of its series names, in the order they are first named; where a series gives no value it has no line.

The forecast is drawn in dashes (`dash`) and its points are marked (`marker`): it is told from the measured by more than its colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker

PantrixChart(
    series = listOf(
        LineSeries("measured", "Measured", MEASURED, x = { it.first }, y = { it.second }),
        LineSeries(
            key = "forecast",
            name = "Forecast",
            data = FORECAST,
            x = { it.first },
            y = { it.second },
            marker = ChartMarker.Circle,
            dash = ChartDash.Dashed
        )
    ),
    description = "The year's measured and forecast sales",
    tagKey = "own_rows"
)

private val MEASURED = listOf(
    "Jan" to 42,
    "Feb" to 48,
    "Mar" to 45,
    "Apr" to 57,
    "May" to 61,
    "Jun" to 58,
    "Jul" to 66,
    "Aug" to 71,
    "Sep" to 69
)

private val FORECAST = listOf("Sep" to 69, "Oct" to 74, "Nov" to 80, "Dec" to 88)
```

### A line over bars

Kinds mix in one chart: each month's orders are a bar (`BarSeries`), and their three-month average is a line (`LineSeries`). In a chart that has bars each place has a band, and the line goes through the middles of the bands. A series given later is drawn over an earlier one: give the line after the bars.

The tooltip writes the two values of the place together; in the legend a bar is a patch, and the line a short line with its mark.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker

PantrixChart(
    series = listOf(
        BarSeries("orders", "Orders", HALF_YEAR, x = { it.first }, y = { it.second }),
        LineSeries(
            key = "average",
            name = "Three-month average",
            data = HALF_YEAR,
            x = { it.first },
            y = { it.third },
            marker = ChartMarker.Circle
        )
    ),
    description = "Orders by month and their three-month average",
    tagKey = "bars_and_line"
)

private val HALF_YEAR = listOf(
    Triple("Jan", 310, 298),
    Triple("Feb", 285, 302),
    Triple("Mar", 342, 312),
    Triple("Apr", 398, 342),
    Triple("May", 371, 370),
    Triple("Jun", 426, 398)
)
```

### Two axes

Two kinds of value in one chart: each month's orders are a count, and the return rate is a share. Drawn against one axis, the rate would lie flat on zero. A series that says `axis = ChartYAxis.Second` is read by the second axis; that axis is written at the chart's other side (`secondYAxis`), and its marks stand on the first axis' grid lines.

Each value is written the way its own axis writes: in the tooltip the orders are a number and the rate a percentage, and a screen reader says them so. `secondYAxis = null` does not draw the axis; the series still stands by its own scale.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartYAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        BarSeries("orders", "Orders", RETURNS, x = { it.first }, y = { it.second }),
        LineSeries(
            key = "returned",
            name = "Return rate",
            data = RETURNS,
            x = { it.first },
            y = { it.third },
            marker = ChartMarker.Circle,
            axis = ChartYAxis.Second
        )
    ),
    yAxis = ChartAxis(title = "Orders"),
    secondYAxis = ChartAxis(title = "Return rate", format = { strings.percent(it, fractionDigits = 1) }),
    description = "Orders and return rate by month",
    tagKey = "two_axes"
)

private val RETURNS = listOf(
    Triple("Jan", 310, 0.042),
    Triple("Feb", 285, 0.051),
    Triple("Mar", 342, 0.038),
    Triple("Apr", 398, 0.036),
    Triple("May", 371, 0.047),
    Triple("Jun", 426, 0.031)
)
```

### A target line and bands

Series are read against something: a target, a usual range, the months of a campaign. `marks` takes the marks the chart draws besides its series.

- `ChartReferenceLine(y = …)` is a line across the plot at a value, and `ChartReferenceLine(x = …)` a line up it at a place.

- `ChartReferenceBand(y1 = …, y2 = …)` is a shaded band between two values, and `ChartReferenceBand(x1 = …, x2 = …)` one between two places. A band given one end goes on to the end of the axis.

Lines are drawn over the series and bands behind them; `inFront` changes that. A mark at a value stretches its axis far enough to show it: the target here is at 450, which none of the visits reach. A mark with a label is read to a screen reader after the chart's description.

A mark's words are written over the series, on a plate in the tooltip's colour: they read over a line or a bar as well. `labelPosition` says where along the mark they stand: a line's words are at its end by default, a band's at its start. Here "Usual" is at the end of its band and "New site" at the foot of its line.

How thick the lines are and how deep the bands' tint is belongs to the style: two dp and a fifth of the colour here (`markLineWidth`, `markBandAlpha`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartMark
import com.pantrixui.components.chart.cartesian.ChartMarkLabelPosition
import com.pantrixui.components.chart.cartesian.ChartReferenceBand
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.foundation.theme.PantrixTheme

val marks: List<ChartMark> = listOf(
    ChartReferenceBand(y1 = 200, y2 = 300, label = "Usual", labelPosition = ChartMarkLabelPosition.End),
    ChartReferenceBand(x1 = "Jun", x2 = "Aug", label = "Summer campaign"),
    ChartReferenceLine(
        x = "Oct",
        label = "New site",
        dash = ChartDash.Dotted,
        labelPosition = ChartMarkLabelPosition.Start
    ),
    ChartReferenceLine(y = 450, label = "Target", color = PantrixTheme.colors.success.color)
)
PantrixChart(
    series = listOf(LineSeries("desktop", "Desktop", VISITS, x = { it.month }, y = { it.desktop })),
    marks = marks,
    description = "Desktop visits by month",
    style = ChartStyle(markLineWidth = 2.dp, markBandAlpha = 0.2f),
    tagKey = "marks"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

### Axes

An axis is described by a `ChartAxis`. Here the axis of values has a title and writes its values short, in the theme's language (`format`); the axis of places has a title too.

The axis of a chart of lines does not start at zero: what is read is the line's rise and fall. `startFromZero` takes the axis down to zero; turn the switch and see how the same values look on the two axes. A chart with a filled series starts at zero by itself: an area's height is read as an amount.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var fromZero by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = fromZero,
    onCheckedChange = { fromZero = it },
    label = "Start the value axis at zero",
    tagKey = "chart_from_zero"
)
PantrixChart(
    series = listOf(LineSeries("revenue", "Revenue", REVENUE, x = { it.first }, y = { it.second })),
    xAxis = ChartAxis(title = "2026"),
    yAxis = ChartAxis(title = "Revenue (TL)", startFromZero = fromZero, format = { strings.compact(it) }),
    description = "Monthly revenue of 2026",
    tagKey = "axes"
)

private val REVENUE = listOf(
    "Jan" to 1_240_000,
    "Feb" to 1_310_000,
    "Mar" to 1_285_000,
    "Apr" to 1_420_000,
    "May" to 1_390_000,
    "Jun" to 1_510_000,
    "Jul" to 1_640_000,
    "Aug" to 1_585_000,
    "Sep" to 1_720_000,
    "Oct" to 1_790_000,
    "Nov" to 1_865_000,
    "Dec" to 1_950_000
)
```

### Where the legend stands

The legend stands on one of the chart's four sides. Above and under it the entries are set in a row and go on to the next row where they do not fit; at the sides they stand under one another. `alignment` says where the legend stands along its own side.

Each entry is a switch for its series: pressed, the series leaves the chart and the axis is set again for the ones that stay, while the entry stays in place, drawn faint. A series that is out keeps its colour; the others' colours do not change either.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var place by remember { mutableStateOf(ChartLegendPosition.Top) }
PantrixSegmentButton(
    options = LEGEND_PLACES,
    selected = place,
    onSelect = { place = it },
    fullWidth = false,
    tagKey = "legend_place"
)
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Desktop", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile }),
        LineSeries("tablet", "Tablet", VISITS, x = { it.month }, y = { it.tablet })
    ),
    legend = ChartLegend(position = place),
    description = "Visits from three devices by month",
    tagKey = "legend"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)

private val LEGEND_PLACES = listOf(
    SegmentOption(value = ChartLegendPosition.Top, label = "Top", tagKey = "top"),
    SegmentOption(value = ChartLegendPosition.Bottom, label = "Bottom", tagKey = "bottom"),
    SegmentOption(value = ChartLegendPosition.Start, label = "Start", tagKey = "start"),
    SegmentOption(value = ChartLegendPosition.End, label = "End", tagKey = "end")
)
```

### Tooltip: together or one at a time

The tooltip reads in two ways. With `shared` on, the values of all the series at the place pointed at come together: that is how a chart is read at a place, and a finger need not aim. With it off the tooltip is the value of the series nearest the pointer alone; on a keyboard the arrows up and down go from one series' value to the next.

`crosshair` is the line through the place pointed at. With `null` in the tooltip's place no card is shown at all; the place is still marked and still written to the chart's state.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var shared by remember { mutableStateOf(true) }
var crosshair by remember { mutableStateOf(true) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSwitchButton(
        checked = shared,
        onCheckedChange = { shared = it },
        label = "Series together",
        tagKey = "tooltip_shared"
    )
    PantrixSwitchButton(
        checked = crosshair,
        onCheckedChange = { crosshair = it },
        label = "A line through the place",
        tagKey = "tooltip_crosshair"
    )
}
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Desktop",
            data = VISITS,
            x = { it.month },
            y = { it.desktop },
            marker = ChartMarker.Circle
        ),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile }, marker = ChartMarker.Square)
    ),
    tooltip = ChartTooltip(shared = shared, crosshair = crosshair),
    description = "Desktop and mobile visits by month",
    tagKey = "tooltip"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

### Your own tooltip

The inside of the card can be the screen's: `content` takes the values at the place pointed at and draws what it wants from them. Here the two series' values are added up and mobile's share is written as a percentage, both in the theme's number format.

The card itself, its fill, its edge and where it stands remain the chart's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Desktop", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile })
    ),
    tooltip = ChartTooltip(
        content = { points ->
            val total = points.sumOf { it.value }
            val mobile = points.firstOrNull { it.series == "mobile" }?.value ?: 0.0
            PantrixText(text = points.first().label, style = PantrixTheme.typography.footnote)
            PantrixText(text = "${strings.decimal(total)} visits", style = PantrixTheme.typography.label)
            PantrixText(
                text = "Mobile's share ${strings.percent(mobile / total)}",
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
        }
    ),
    description = "Total visits and mobile's share by month",
    tagKey = "own_tooltip"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

### Two charts that share a state

`ChartState` holds the series the reader has hidden and the place they point at. A screen that makes one with `rememberChartState` and gives it to the chart reads both: the row underneath writes the month pointed at from the state.

Two charts given the same state behave as one. Point at a month in the upper one: the lower one marks the same month. A series hidden in the legend of one is hidden in the other too, since the two charts' series carry the same keys.

The state is written from the screen too: the button gives `state.selection` a `ChartSelection(x = "Mar")`, and both charts show March.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.common.ChartSelection
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberChartState()
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Desktop", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile })
    ),
    modifier = Modifier.height(200.dp),
    state = state,
    description = "Visits by month",
    tagKey = "shared_visits"
)
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Desktop",
            data = VISITS,
            x = { it.month },
            y = { it.desktop * 3 / 100 },
            fill = ChartFill.Solid
        ),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile * 2 / 100 }, fill = ChartFill.Solid)
    ),
    modifier = Modifier.height(160.dp),
    legend = null,
    state = state,
    description = "Orders by month",
    tagKey = "shared_orders"
)
PantrixText(
    text = state.selection?.let { "Month pointed at: ${it.x}" } ?: "No month is pointed at",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
PantrixButton(
    text = "Show March",
    onClick = { state.selection = ChartSelection(x = "Mar") },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "show_march"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

### Pressing a value

`onSelect` gives the value that is pressed: its series, its place, its value and how the chart writes it. Press a value, or go to a place with the keyboard and press Enter: the row under the card writes what was pressed.

Here the tooltip tells the series apart (`shared = false`), so what is pressed is the value of the series pointed at. Where the series are shown together, what is pressed is the value of the series nearest the press.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartPoint
import com.pantrixui.components.chart.common.ChartTooltip

val report = LocalExampleEvents.current
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Desktop",
            data = VISITS,
            x = { it.month },
            y = { it.desktop },
            marker = ChartMarker.Circle
        ),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile }, marker = ChartMarker.Circle)
    ),
    tooltip = ChartTooltip(shared = false),
    description = "Desktop and mobile visits by month",
    onSelect = { point: ChartPoint -> report("${point.label}, ${point.name}: ${point.text}") },
    tagKey = "pressed"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Missing values

`missing` says what the line does at a row that has no value. This sensor gave no reading in April and in August. `Gap` breaks the line there: what is missing is seen to be missing. `Connect` goes on from the point before to the point after. `Zero` counts the row as zero.

A value with no point before it and none after it is drawn as a dot though no mark was asked for: a line through a single point has nothing to show.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartMissing
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var missing by remember { mutableStateOf(ChartMissing.Gap) }
PantrixSegmentButton(
    options = MISSING_KINDS,
    selected = missing,
    onSelect = { missing = it },
    fullWidth = false,
    tagKey = "missing"
)
PantrixChart(
    series = listOf(
        LineSeries(
            key = "sensor",
            name = "Temperature",
            data = SENSOR,
            x = { it.first },
            y = { it.second },
            marker = ChartMarker.Circle,
            missing = missing
        )
    ),
    description = "The sensor's mean temperature by month",
    tagKey = "missing"
)

private val SENSOR: List<Pair<String, Double?>> = listOf(
    "Jan" to 4.5,
    "Feb" to 6.1,
    "Mar" to 9.8,
    "Apr" to null,
    "May" to 18.2,
    "Jun" to 23.4,
    "Jul" to 26.9,
    "Aug" to null,
    "Sep" to 21.3,
    "Oct" to 15.6,
    "Nov" to 10.2,
    "Dec" to 5.9
)

private val MISSING_KINDS = listOf(
    SegmentOption(value = ChartMissing.Gap, label = "Gap", tagKey = "gap"),
    SegmentOption(value = ChartMissing.Connect, label = "Connect", tagKey = "connect"),
    SegmentOption(value = ChartMissing.Zero, label = "Count as zero", tagKey = "zero")
)
```

### A chart with no data

A chart with no value writes the theme's words ("No data") in the middle of its plot. `empty` puts content of its own in their place: here a line that says what is going on and a button that brings the data. A screen reader is not told "No data" either; the content speaks for itself. Once there are values, the content goes.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loaded by remember { mutableStateOf(false) }
PantrixChart(
    series = listOf(
        BarSeries(
            key = "desktop",
            name = "Desktop",
            data = if (loaded) VISITS.take(6) else emptyList(),
            x = { it.month },
            y = { it.desktop }
        )
    ),
    empty = {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            PantrixText(
                text = "No visits in this period",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixButton(
                text = "Load sample data",
                onClick = { loaded = true },
                variant = ButtonVariant.Outline,
                size = ButtonSize.Small,
                tagKey = "no_data_load"
            )
        }
    },
    description = "Desktop visits",
    tagKey = "no_data"
)
if (loaded) {
    PantrixButton(
        text = "Remove the data",
        onClick = { loaded = false },
        variant = ButtonVariant.Soft,
        size = ButtonSize.Small,
        tagKey = "no_data_clear"
    )
}

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

### Many places

Ninety days. The days' names do not fit side by side; the chart leaves them out by a rule, every sixth or every tenth, and sets the same rule again as the window narrows and widens. All the values stay where they are: the value of every day is shown with a pointer or a finger.

The line goes through smoothly (`ChartCurve.Smooth`): it stays between its points, and shows no peak or dip that the values do not have.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartFill

PantrixChart(
    series = listOf(
        LineSeries(
            key = "sessions",
            name = "Sessions",
            data = DAILY,
            x = { it.first },
            y = { it.second },
            curve = ChartCurve.Smooth,
            fill = ChartFill.Gradient
        )
    ),
    xAxis = ChartAxis(label = { "Day $it" }),
    description = "Daily sessions of the last ninety days",
    tagKey = "many"
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### Time axis

A chart whose places are moments: a server's response time, measured at uneven intervals over a day. Since the rows' `x` gives a `kotlin.time.Instant`, the chart sets them out by time: the hours measured often stand close together and those measured seldom far apart, and the axis is marked at round hours, not at the measurements.

The line and the band stand at moments too, whether a row has that moment or not: when the deployment went out and the maintenance window. A mark after the measurements, the next morning's maintenance, stretches the axis as far as itself, as a target line stretches an axis of values. The hours are read by UTC (`ChartTime`'s `offset`); left out, they are read by the device's clock.

Moments are written as the app writes them too (`ChartTime`'s `format`): the axis's marks on the hour as "14h", a measurement's moment in the tooltip to its minute. The `ChartTimeUnit` given to `format` says what is written: the axis's marks are asked for by the unit between them, a place by the finest unit the places are told apart by.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceBand
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.cartesian.ChartTimeUnit
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import kotlin.time.Duration
import kotlin.time.Instant

PantrixChart(
    series = listOf(
        LineSeries(
            key = "response",
            name = "Response time (ms)",
            data = RESPONSE_TIMES,
            x = { momentAt(it.first) },
            y = { it.second },
            marker = ChartMarker.Circle
        )
    ),
    xAxis = ChartAxis(time = ChartTime(format = ::clockOfUtc, offset = { Duration.ZERO })),
    marks = listOf(
        ChartReferenceBand(x1 = momentAt("02:00"), x2 = momentAt("04:00"), label = "Maintenance"),
        ChartReferenceLine(x = momentAt("13:20"), label = "Release"),
        ChartReferenceLine(x = Instant.parse("2026-10-14T03:00:00Z"), label = "Next maintenance")
    ),
    description = "A server's response time over a day, at the moments it was measured",
    tagKey = "time"
)

private val RESPONSE_TIMES = listOf(
    "00:10" to 182,
    "01:40" to 176,
    "02:30" to 240,
    "03:30" to 262,
    "05:00" to 190,
    "08:00" to 205,
    "09:00" to 231,
    "09:30" to 248,
    "10:00" to 236,
    "10:30" to 259,
    "11:00" to 244,
    "12:00" to 228,
    "13:00" to 252,
    "13:30" to 171,
    "14:00" to 158,
    "15:00" to 149,
    "17:30" to 144,
    "21:00" to 139,
    "23:30" to 133
)

private fun momentAt(time: String): Instant = Instant.parse("2026-10-13T$time:00Z")

private fun clockOfUtc(moment: Instant, unit: ChartTimeUnit): String {
    val minute = moment.epochSeconds.floorDiv(SECONDS_IN_A_MINUTE).mod(MINUTES_IN_A_DAY)
    val hour = (minute / MINUTES_IN_AN_HOUR).toString().padStart(2, '0')
    val ofTheHour = (minute % MINUTES_IN_AN_HOUR).toString().padStart(2, '0')
    return if (unit >= ChartTimeUnit.Hour) "${hour}h" else "$hour:$ofTheHour"
}

private const val SECONDS_IN_A_MINUTE = 60

private const val MINUTES_IN_AN_HOUR = 60

private const val MINUTES_IN_A_DAY = 24 * 60
```

### Zoom

`zoom = ChartZoom()` lets the chart be looked at closer: a part of the ninety days fills the whole plot, and the rest is moved along. The buttons over the plot scroll back and forward, zoom out, zoom in and bring all the days back, in that order; a button with nothing to do is drawn faint.

With a mouse, turn the wheel while Ctrl (Command on a Mac) is held: the day under the pointer stays where it is. Once it is zoomed, drag the chart. On a touch screen spread two fingers, then move them together; one finger still points at a day. With the keyboard, go to the chart and press plus, minus and zero: zoomed in, more of the days' names find room to be written.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartZoom

PantrixChart(
    series = listOf(
        LineSeries("sessions", "Sessions", DAILY, x = { it.first }, y = { it.second }, marker = ChartMarker.Circle)
    ),
    xAxis = ChartAxis(label = { "Day $it" }),
    zoom = ChartZoom(),
    description = "The daily sessions of the last ninety days, which can be looked at closer",
    tagKey = "zoomed"
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### Navigator

The navigator (`navigator = true`) lies under the plot and holds all the places: the series are drawn small on it, and the part in view is marked. Take the marked part by its middle and drag it; widen or narrow it by the grips at its two ends; press somewhere else on the strip, and the part comes there. With the keyboard, on the strip the arrows move the part, and Home and End take it to the start and the end.

The places here are moments: the hourly measurements of sixty days. As you zoom in the axis' marks go from months to days and from days to hours. A screen reader says the strip as the "range in view", with the first and the last moment in view.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.common.ChartZoom
import kotlin.math.PI
import kotlin.math.sin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Instant

PantrixChart(
    series = listOf(
        LineSeries(
            key = "load",
            name = "Load (%)",
            data = HOURLY,
            x = { hourAt(it.first) },
            y = { it.second },
            fill = ChartFill.Gradient
        )
    ),
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO })),
    yAxis = ChartAxis(min = 0.0, max = 100.0),
    zoom = ChartZoom(navigator = true),
    description = "A server's hourly load over sixty days",
    tagKey = "navigated"
)

private val HOURLY: List<Pair<Int, Int>> = List(HOURS) { hour ->
    val weekend = (hour / A_DAY) % WEEK.size >= WEEK.size - 2
    hour to (if (weekend) 36 else 52) + (wave(hour, A_DAY) * 26).toInt() + hour * 7 % 9
}

private const val HOURS = 24 * 60

private const val A_DAY = 24

private fun hourAt(hour: Int): Instant = Instant.parse("2026-08-15T00:00:00Z") + hour.hours

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)

private fun wave(
    step: Int,
    period: Int
): Double = sin(step * 2 * PI / period)
```

### Two charts zoomed together

Two charts that are given the same `ChartState` zoom together: the part in view is kept in the state, and both show it. Zoom the upper chart, or drag the lower one's navigator: the other shows the same days. Pointing at a day is shared too.

The buttons are on the upper chart and the strip on the lower: `ChartZoom(buttons = false, navigator = true)`. The two charts have the same places, so the same part is the same days.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState

val state = rememberChartState()
PantrixChart(
    series = listOf(LineSeries("sessions", "Sessions", DAILY, x = { it.first }, y = { it.second })),
    modifier = Modifier.height(220.dp),
    xAxis = ChartAxis(label = { "Day $it" }),
    zoom = ChartZoom(),
    state = state,
    description = "Daily sessions of the last ninety days",
    tagKey = "together_sessions"
)
PantrixChart(
    series = listOf(
        LineSeries(
            key = "conversion",
            name = "Conversion (%)",
            data = CONVERSION,
            x = { it.first },
            y = { it.second },
            fill = ChartFill.Solid
        )
    ),
    modifier = Modifier.height(220.dp),
    xAxis = ChartAxis(label = { "Day $it" }),
    zoom = ChartZoom(buttons = false, navigator = true),
    state = state,
    description = "The daily conversion rate of the last ninety days",
    tagKey = "together_conversion"
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private val CONVERSION: List<Pair<Int, Double>> = List(DAYS) { day ->
    (day + 1) to 3.2 - WEEK[day % WEEK.size] / 100.0 + day / 120.0
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### The screen's own buttons

The screen can say the part in view too: `ChartState.zoomTo` takes two shares of the way along the places, from zero to one, and `resetZoom` brings them all back. The three options here stand in for the chart's own buttons (`ChartZoom(buttons = false)`); the mouse, the fingers and the keyboard still work.

The state is read as well: the line underneath writes `state.window`. The part in view is kept, with the hidden series, when the screen is rotated (`rememberChartState`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberChartState()
var span by remember { mutableStateOf(DAYS) }
PantrixSegmentButton(
    options = SPANS,
    selected = span,
    onSelect = { days ->
        span = days
        // The days stand at even steps from the chart's start to its end: the last `days` days start that far from the end.
        if (days == DAYS) state.resetZoom() else state.zoomTo(1f - (days - 1f) / (DAYS - 1f), 1f)
    },
    fullWidth = false,
    tagKey = "zoom_span"
)
PantrixChart(
    series = listOf(
        LineSeries("sessions", "Sessions", DAILY, x = { it.first }, y = { it.second }, marker = ChartMarker.Circle)
    ),
    xAxis = ChartAxis(label = { "Day $it" }),
    zoom = ChartZoom(buttons = false),
    state = state,
    description = "Daily sessions of the last ninety days",
    tagKey = "zoom_from_screen"
)
val from = (state.window.start * PERCENT).toInt()
val to = (state.window.endInclusive * PERCENT).toInt()
PantrixText(
    text = if (state.zoomed) "In view: $from% – $to%" else "All the days are in view",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private val SPANS = listOf(
    SegmentOption(value = DAYS, label = "All", tagKey = "all"),
    SegmentOption(value = 30, label = "Last 30 days", tagKey = "month"),
    SegmentOption(value = 7, label = "Last 7 days", tagKey = "week")
)

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)

private const val PERCENT = 100
```

### Tens of thousands of points

Fifty thousand points: what a sensor measured once a minute for thirty-five days. The plot is a few hundred pixels wide, so the line goes through the first, the highest, the lowest and the last point of each column of pixels: the line on the screen covers the same pixels as one through every point, and no peak or dip is lost.

Zoom in: only the minutes in view are drawn, and once there are fewer than two points to a pixel each point is drawn itself. `closest` says how close the chart may be looked at, at the most: here a thousand times, which is fifty minutes.

"Thin with LTTB" (`ChartDecimation(algorithm = DecimationAlgorithm.Lttb)`) draws the line through one point to a pixel and keeps its shape; a minute's flicker between two kept points is not drawn, and the line looks smoother. "Fit the axis to the part in view" (`ChartZoom(fitValues = true)`) makes the axis of values for the minutes in view alone as you zoom in: a degree or two over a few hours fills the plot. Turned off, the axis stays as all the days have it and holds still as you move along.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDecimation
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.DecimationAlgorithm
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import kotlin.math.PI
import kotlin.math.sin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Instant

var lttb by remember { mutableStateOf(false) }
var fit by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = lttb,
    onCheckedChange = { lttb = it },
    label = "Thin with LTTB",
    tagKey = "many_points_lttb"
)
PantrixSwitchButton(
    checked = fit,
    onCheckedChange = { fit = it },
    label = "Fit the axis to the part in view",
    tagKey = "many_points_fit"
)
PantrixChart(
    series = listOf(
        LineSeries("temperature", "Temperature (°C)", MINUTES, x = { minuteAt(it.first) }, y = { it.second })
    ),
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO })),
    zoom = ChartZoom(closest = 1000f, navigator = true, fitValues = fit),
    decimation = ChartDecimation(algorithm = if (lttb) DecimationAlgorithm.Lttb else DecimationAlgorithm.MinMax),
    description = "The temperature a sensor measured once a minute for thirty-five days",
    tagKey = "many_points"
)

private val MINUTES: List<Pair<Int, Double>> by lazy {
    List(MANY_MINUTES) { minute ->
        minute to 18.0 + wave(minute, A_DAY * 60) * 6.0 + minute / 20_000.0 + (minute * 7919 % 41 - 20) / 25.0
    }
}

private const val MANY_MINUTES = 50_000

private const val A_DAY = 24

private fun minuteAt(minute: Int): Instant = Instant.parse("2026-09-08T00:00:00Z") + minute.minutes

private fun wave(
    step: Int,
    period: Int
): Double = sin(step * 2 * PI / period)
```

### Export

`export = ChartExport(...)` puts an export button among the chart's own. Press it and choose the kind: the chart makes the file and hands it to `onExport`. Where the file goes is the app's to say: this example says its name, its type and its size, shows the picture again underneath when it is a PNG, and "Save the file" hands it over in the platform's window for saving (`rememberFileSaver`): the window for a new document on Android, Files on iOS, the save dialog on the desktop, a download on the web.

The file shows the chart as it is on the screen: take a series out from the legend and export again. The place that is pointed at and its tooltip are not in the file; the legend stands under the plot. An SVG and a PDF are sharp at any size, and a few kilobytes.

```kotlin
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.export.ChartExportFormat
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.rememberFileSaver
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.decodeToImageBitmap

var file by remember { mutableStateOf<ChartExportFile?>(null) }
val saver = rememberFileSaver()
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Desktop", VISITS, x = { it.month }, y = { it.desktop }, fill = ChartFill.Gradient),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile }, dash = ChartDash.Dashed)
    ),
    export = ChartExport(fileName = "visits") { file = it },
    description = "Desktop and mobile visits by month",
    tagKey = "exported"
)
val made = file
PantrixText(
    text = made?.let { "${it.name} · ${it.mimeType} · ${it.bytes.size / KILOBYTE + 1} KB" }
        ?: "No file has been made yet",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
if (made != null) {
    PantrixButton(
        text = "Save the file",
        onClick = { saver.save(PantrixFile(made.name, made.bytes, made.mimeType)) {} },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "exported_save"
    )
}
if (made != null && made.format == ChartExportFormat.Png) {
    val picture = remember(made) { made.bytes.decodeToImageBitmap() }
    PantrixImage(
        bitmap = picture,
        modifier = Modifier.fillMaxWidth().aspectRatio(picture.width.toFloat() / picture.height),
        contentDescription = "The picture that was made"
    )
}

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)

private const val KILOBYTE = 1024
```

### The part in view, one kind

Given one kind alone the button opens no choice: a press makes that file. Here only a PNG, at three pixels to a dp (`scale = 3f`) and on a white ground (`background`); with no ground given it is the theme's, dark in the dark theme.

The chart can be zoomed: zoom in and export. The file has the part in view, and neither the navigator nor the buttons. The picture that was made is shown underneath; the room around the chart is the file's own (`padding`).

```kotlin
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFormat
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.decodeToImageBitmap

var picture by remember { mutableStateOf<ImageBitmap?>(null) }
val state = rememberChartState()
// The chart opens on the last thirty-six days.
LaunchedEffect(state) { state.zoomTo(start = 0.6f, end = 1f) }
PantrixChart(
    series = listOf(BarSeries("sessions", "Sessions", DAILY, x = { it.first }, y = { it.second })),
    xAxis = ChartAxis(label = { "Day $it" }),
    zoom = ChartZoom(navigator = true),
    export = ChartExport(
        formats = listOf(ChartExportFormat.Png),
        fileName = "sessions",
        scale = 3f,
        background = Color.White
    ) { picture = it.bytes.decodeToImageBitmap() },
    state = state,
    description = "The daily sessions of the last ninety days, which can be exported",
    tagKey = "exported_part"
)
picture?.let { made ->
    PantrixImage(
        bitmap = made,
        modifier = Modifier.fillMaxWidth().aspectRatio(made.width.toFloat() / made.height),
        contentDescription = "The picture that was made"
    )
}

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### Patterns for colour blindness

Patterns for colour blindness (`ChartStyle(patterns = true)`): the first series stays plain, the others have a texture cut into their bars in turn, and lines are drawn dashed and dotted in turn; the legend and the tooltip show the same texture. Turn the switch off: the patterns go, and the series are told apart by their colours alone.

A series can say its own texture with `pattern` (`ChartPattern`); a texture it says is drawn with the switch off too: here the dots in the tablet's bars.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartPattern
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var patterns by remember { mutableStateOf(true) }
val half = VISITS.take(6)
PantrixSwitchButton(
    checked = patterns,
    onCheckedChange = { patterns = it },
    label = "Patterns",
    tagKey = "chart_patterns"
)
PantrixChart(
    series = listOf(
        BarSeries("desktop", "Desktop", half, x = { it.month }, y = { it.desktop }),
        BarSeries("mobile", "Mobile", half, x = { it.month }, y = { it.mobile }),
        BarSeries("tablet", "Tablet", half, x = { it.month }, y = { it.tablet }, pattern = ChartPattern.Dots)
    ),
    description = "Visits of the first six months by device, in textured bars",
    style = ChartStyle(patterns = patterns),
    tagKey = "patterns"
)
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Desktop", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile }),
        LineSeries("tablet", "Tablet", VISITS, x = { it.month }, y = { it.tablet })
    ),
    description = "Visits by device and month, in lines dashed in turn",
    style = ChartStyle(patterns = patterns),
    tagKey = "patterns_lines"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

### Your own colours and sizes

A chart's own colours and sizes. `ChartColors.series` are the colours handed out to the series in order; here two purples from the palette in the place of the theme's chart colours. The grid lines are fainter in this chart too.

`ChartStyle` gives the sizes: the line is thicker, the marks larger. A field that is not given stays the theme's. The same for all charts is given to the theme: the colours with `PantrixColors.chart`, the sizes with the theme's `styles`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartColors
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixPalette

val dark = LocalDemoDarkTheme.current
val violet = PantrixPalette.Violet
val pink = PantrixPalette.Pink
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Desktop",
            data = VISITS,
            x = { it.month },
            y = { it.desktop },
            marker = ChartMarker.Diamond
        ),
        LineSeries("mobile", "Mobile", VISITS, x = { it.month }, y = { it.mobile }, marker = ChartMarker.Triangle)
    ),
    description = "Desktop and mobile visits by month",
    style = ChartStyle(lineWidth = 3.dp, markerSize = 10.dp),
    colors = ChartColors(
        series = if (dark) listOf(violet.shade400, pink.shade300) else listOf(violet.shade600, pink.shade500),
        grid = PantrixTheme.colors.divider.copy(alpha = 0.5f)
    ),
    tagKey = "own_look"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Jan", desktop = 186, mobile = 80, tablet = 40),
    Visits("Feb", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Apr", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Jun", desktop = 214, mobile = 140, tablet = 70),
    Visits("Jul", desktop = 280, mobile = 170, tablet = 76),
    Visits("Aug", desktop = 310, mobile = 210, tablet = 83),
    Visits("Sep", desktop = 268, mobile = 232, tablet = 90),
    Visits("Oct", desktop = 342, mobile = 250, tablet = 96),
    Visits("Nov", desktop = 390, mobile = 286, tablet = 91),
    Visits("Dec", desktop = 420, mobile = 301, tablet = 120)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalDemoDarkTheme`: Whether the app's theme is dark right now: the system's mode while the setting is "System", and the setting itself otherwise.

## API

### PantrixChart

`import com.pantrixui.components.chart.cartesian.PantrixChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixChart(
    series: List<ChartSeries>,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    secondYAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    stacking: ChartStacking = ChartStacking.Normal,
    orientation: ChartOrientation = ChartOrientation.Vertical,
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

A chart of values along a run of places: lines and filled areas through the values each series has at each place, and bars up to them, with an axis of the places under them and an axis of the values beside them.

The chart is given its `series`, and each of them carries its own rows: what the series is drawn from, where a row stands and what its value is. The chart sets out every place any of them names, in the order they are first named. Series of different kinds are drawn in one chart, a line over bars, and need not be read from the same rows. The series that name the same `stack` stand on one another: as their values, or, as `stacking` says, as their shares of what the stack comes to at each place, every stack as tall as every other.

Around the series stand the chart's parts, each given by what describes it and taken away by `null`: the two axes, the `legend` and the `tooltip`. Left as they are, the axes write the places and round values with lines across the chart at them, the legend lists the series from the second on, and the tooltip shows the values at the place that is pointed at.

**A second axis of values.** A series that says it is read by the second axis is set out by a scale of its own, written at the chart's other side: an amount and a share of it, a count and a price, in one chart. Its marks stand on the first axis' lines, so that one grid serves both. Each value is written as its own axis writes it, in the tooltip and to a screen reader too.

**Ranges, steps and candles.** A `RangeSeries` has two values at each place and draws what lies between them, as a band from place to place or as a bar that stands on no axis. A `WaterfallSeries` draws each of its values as a step from where the one before it ended, and its totals on nought. A `CandlestickSeries` has four values at each place: what it opened and closed at, and the highest and the lowest between.

**Places that are moments.** Where every place of the chart is a `kotlin.time.Instant`, the places are set out by time: in the order of time whatever the order of the rows, as far from each other as their moments are, so that a day with no row is a gap. The axis is marked at round moments, hours, days, months, as many as have room, and a place is written as a date. Both are read by the screen's clock (`LocalPantrixClock`) and written in the theme's language, unless the axis of places says otherwise by its `time`: see `ChartTime`. A name among the moments, and the places are names again, at even steps. Places that are gapless stand at even steps all the same, with no gap for the days a market is closed, and the axis is marked at the first place of each day, week or month.

**Places that are numbers.** Numbers are names like any other, at even steps in the order the rows name them, unless the axis of places is `numeric`: then the places are set out by their numbers, in their order and as far apart as they are, the axis is marked at round numbers that have room, and a mark stands at any number.

**Marks.** A line at a value or at a place, and a band between two, are drawn with the series for them to be read by: a target, a limit, the weeks of a campaign. In a chart whose places are moments a mark stands at any moment, a row's or not. See `ChartMark`.

**Pointing at a place.** A pointer over the chart points at the place nearest it; a finger does by a tap, or drawn along the chart, and a tap on the place it points at lets go of it. With the keyboard the chart is one stop for Tab: the arrows along the chart go from place to place, Home and End to the first and the last, and Escape lets go. Where the tooltip tells the series apart, the arrows up and down go from one series' value to the next. The place is marked, the tooltip shown for it, and it is told to `state`. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, then each place with the values the series have there, in the places' order, which a finger also finds by touching the chart; the legend's entries are switches. A chart of more than two hundred places is told by its description alone.

**Its size.** The chart is as wide as it is given room. A height on its modifier is the whole chart's, the legend's with it; given none, the plot is as tall as the chart's style says and a legend above or under it adds its own. The places that have no room to be written are left out by a rule, every second, every third: the chart's values stay where they are.

In a language read from the right the places run from the right and the values are written at the right.

```kotlin
PantrixChart(
    series = listOf(
        LineSeries("visits", "Visits", days, x = { it.day }, y = { it.visits }),
        LineSeries("orders", "Orders", days, x = { it.day }, y = { it.orders }, dash = ChartDash.Dashed)
    ),
    modifier = Modifier.height(240.dp),
    description = "Visits and orders of the last thirty days",
    tagKey = "traffic"
)
```

Parameters:

- `series: List<ChartSeries>`: the series, in the order they are drawn and listed: a later one is drawn over an earlier. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `xAxis: ChartAxis?`: the axis of the places, under the chart, or beside it in a horizontal chart. `null` draws nothing of it.
- `yAxis: ChartAxis?`: the axis of the values, beside the chart, or under it in a horizontal chart. `null` draws nothing of it.
- `secondYAxis: ChartAxis?`: the second axis of the values, at the chart's other side, or over it in a horizontal chart: drawn where a series, or a mark at a value, is read by it, and not otherwise. `null` draws nothing of it, and what is read by it is set out by it all the same.
- `marks: List<ChartMark>`: the lines and the bands drawn in the plot besides the series.
- `stacking: ChartStacking`: how the series of a stack stand on one another: as their values, or as their shares of the stack.
- `orientation: ChartOrientation`: which way the places go: along the chart's foot, as columns, or down its side, as horizontal bars, each name written across in the room of a line. Horizontal, a chart that is looked at closer moves up and down its places, and its navigator stands beside the plot.
- `legend: ChartLegend?`: where the names of the series stand. `null` shows none.
- `tooltip: ChartTooltip?`: what is shown for the place that is pointed at. `null` shows none.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the places and move along the rest. `null`, which it is unless the chart is given one, shows all the places and no more.
- `decimation: ChartDecimation?`: how a line with more points in view than the plot has room for is drawn through fewer of them. `null` draws every point, as many as there are.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a file: a picture, or a drawing that is sharp at any size. `null`, which it is unless the chart is given one, and the chart has no such button.
- `empty: (@Composable () -> Unit)?`: what the chart shows in its plot while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words. A file the chart is exported as says them.
- `state: ChartState`: what the reader has hidden and what they point at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its series.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the value that is pressed: the one pointed at, or of the series nearest the press where the place's values are pointed at together.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `Chart_<tagKey>`, its plot `Chart_<tagKey>.Plot`, a place of it `Chart_<tagKey>.Point_<number>` counted from one, the legend's entry of a series `Chart_<tagKey>.Legend_<series' key>` and the tooltip `Chart_<tagKey>.Tooltip`. A press on a value is reported as a `Chart` `select` event with the series' key, and a press on a legend's entry as a `toggle` event with the key and whether the series is shown. Nothing of the values is reported.

### ChartSeries

`import com.pantrixui.components.chart.cartesian.ChartSeries`, from `com.pantrixui:components`

```kotlin
sealed class ChartSeries
```

One run of values in a `PantrixChart`: what is drawn for it, and the rows it is read from.

A series carries its own rows. Two series of one chart may be read from one list or from two, and need not stand at the same places: the chart sets out every place any of them names, in the order they are first named, and a series has no value where it names none.

The kinds of series are the kinds of mark a chart draws: a `LineSeries`, which is an area too where it is filled, a `BarSeries`, a `RangeSeries` of two values at a place, a `WaterfallSeries` of steps, and a `CandlestickSeries` of four values at a place. Kinds mix in one chart.

Members:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `stack: String?`: What the series is stacked with. The series of a chart that name the same stack stand on one another at each place, in the order they are given: the first on nought, and each of the others on the one before it. A value under nought goes down from nought, under the others of its stack that do. Null, a series stands on nought by itself. A stack is of the series of one axis: two that name the same stack and are read by different axes stand apart.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by. A series on the second is set out by a scale of its own, written at the chart's other side: for values of another kind than the first axis', or of another size, a share beside an amount.
- `labels: ChartDataLabels?`: The series' values written at its marks, where it is given any: none where this is null.

### LineSeries

`import com.pantrixui.components.chart.cartesian.LineSeries`, from `com.pantrixui:components`

```kotlin
class LineSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    override val color: Color = Color.Unspecified,
    public val curve: ChartCurve = ChartCurve.Linear,
    public val fill: ChartFill = ChartFill.None,
    public val marker: ChartMarker = ChartMarker.None,
    public val dash: ChartDash? = null,
    public val missing: ChartMissing = ChartMissing.Gap,
    override val stack: String? = null,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null,
    public val pattern: ChartPattern? = null
) : ChartSeries()
```

A series drawn as a line through its points, and as an area where the room under the line is filled.

```kotlin
LineSeries("visits", "Visits", days, x = { it.day }, y = { it.visits })
```

`x` says where a row stands along the chart: a name, a day, anything that is equal to itself, as a category; the chart writes it with its axis' `label`, and as it writes itself where that is left out. Where every row of the chart gives a moment, a `kotlin.time.Instant`, the places are set out by time: see `ChartTime`. `y` is the row's value, and null where it has none: what the line does there is `missing`'s to say. A value that is no number, or has no end, is taken as none.

Two series are the same series where everything they were built from is the same, the two functions among them: a chart whose caller builds its series anew each time is not drawn anew for it.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows, in the order the line goes through them.
- `x: (T) -> Any`: Where a row stands along the chart.
- `y: (T) -> Number?`: A row's value, or null where it has none.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `curve: ChartCurve`: How the line goes from a point to the next.
- `fill: ChartFill`: What the room between the line and nought is filled with: nothing, for a line.
- `marker: ChartMarker`: What marks each point. A point with none before it and none after is always marked: a line through one point has nothing to show. Where the chart's patterns are on (`ChartStyle.patterns`), a line that marks its points with none has a mark in turn from the fourth line of its chart on.
- `dash: ChartDash?`: Whether the line is drawn whole, in dashes or in dots: a way to tell a series by more than its colour, and what a forecast or a target is told from what was measured by. Null, it is drawn whole, and where the chart's patterns are on, whole, dashed or dotted by its place among the chart's series.
- `missing: ChartMissing`: What the line does where a row has no value.
- `stack: String?`: What the series is stacked with: the lines of a stack go through the sums of its values, and where they are filled, each is filled down to the line it stands on.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by.
- `labels: ChartDataLabels?`: The series' values written over its points. Null writes none.
- `pattern: ChartPattern?`: The texture the room between the line and nought is filled with besides its colour, where it is filled. Null, none, and where the chart's patterns are on, its turn by its place among the chart's series.

### BarSeries

`import com.pantrixui.components.chart.cartesian.BarSeries`, from `com.pantrixui:components`

```kotlin
class BarSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    override val color: Color = Color.Unspecified,
    override val stack: String? = null,
    public val behind: Boolean = false,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null,
    public val pattern: ChartPattern? = null
) : ChartSeries()
```

A series drawn as a bar at each of its places, from nought to its value.

```kotlin
BarSeries("revenue", "Revenue", months, x = { it.name }, y = { it.revenue })
```

The bars of a chart's series stand side by side at a place, each in its series' colour, and the series that name the same `stack` share one bar there, each on top of the one before it. A bar goes up from nought for a value over it and down for one under it; a row with no value has no bar.

A chart that has bars gives each place a band of its width, and a line of the same chart goes through the middles of the bands. Its axis of values starts at nought unless the axis says otherwise: a bar's length is read as an amount, and a bar cut off above nought shows less than there is.

A series `behind` the others takes no bar of its own at a place: its bar is as wide as all of the place's bars side by side, and is drawn before every series that is not behind, the volume of a day under its candle. Of two series behind, the one given later is drawn over the other.

Two series are the same series where everything they were built from is the same, the two functions among them.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows.
- `x: (T) -> Any`: Where a row stands along the chart: a name, a day, anything that is equal to itself.
- `y: (T) -> Number?`: A row's value, or null where it has none.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `stack: String?`: What the series is stacked with. The series of a chart that name the same stack stand on one another at each place, in the order they are given: the first on nought, and each of the others on the one before it. A value under nought goes down from nought, under the others of its stack that do. Null, a series stands on nought by itself. A stack is of the series of one axis: two that name the same stack and are read by different axes stand apart.
- `behind: Boolean`: Whether the series' bars stand behind those of the other series, as wide as all of them, rather than beside them. A series behind is in no `stack`.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by.
- `labels: ChartDataLabels?`: The series' values written at the ends of its bars, and inside the bars of a stack. Null writes none.
- `pattern: ChartPattern?`: The texture the bars are drawn with besides their colour. Null, none, and where the chart's patterns are on (`ChartStyle.patterns`), its turn by its place among the chart's series.

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

### ChartYAxis

`import com.pantrixui.components.chart.cartesian.ChartYAxis`, from `com.pantrixui:components`

```kotlin
enum class ChartYAxis
```

Which of a chart's axes of values a series, or a mark at a value, is read by.

Entries:

- `First`: The chart's axis of values, written where lines start: its `yAxis`.
- `Second`: The chart's second axis of values, written at its other side: its `secondYAxis`.

### ChartTime

`import com.pantrixui.components.chart.cartesian.ChartTime`, from `com.pantrixui:components`

```kotlin
class ChartTime(
    public val format: ((Instant, ChartTimeUnit) -> String)? = null,
    public val offset: ((Instant) -> Duration)? = null,
    public val gapless: Boolean = false
)
```

How a chart whose places are moments writes them, and by which clock: what its axis of places is given as its `time`.

A chart's places are moments where every one of them is a `kotlin.time.Instant`. Such a chart sets its places out where their moments are, in the order of time, whatever the order of its rows: two days apart are twice as far from each other as one, and a day with no row is a gap. Its axis is marked at round moments, each hour, each day, each month, as many as have room, and each mark is written by what it counts in.

```kotlin
PantrixLineChart(
    data = readings,
    x = { it.at },
    series = listOf(ChartValue("temperature", "Temperature") { it.degrees }),
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO }))
)
```

Nothing needs to be given: left out, moments are written in the theme's language and read by the screen's clock (`LocalPantrixClock`), the device's unless a test or a preview gives another.

A market is open on some days and not on others, and a chart of its prices has gaps where it is closed. Places that are `gapless` stand at even steps instead, one after another in the order of time as names would, and the axis is marked at the first place of each round stretch of time, each day, each week, each month, as many as have room.

Parameters:

- `format: ((Instant, ChartTimeUnit) -> String)?`: How a moment is written, given the moment and what it is written to: a mark of the axis to the unit its marks are apart by, and a place, in the tooltip and to a screen reader, to the finest unit the chart's places are told apart by. Left out, a mark is written short, an hour as `14:00`, a day as `Oct 13`, a month by its name and a January by its year, and a place in full, `Oct 13, 2026 14:00`, all in the theme's language. An axis' `label` is asked before this for how a place is written.
- `offset: ((Instant) -> Duration)?`: How far the clock the chart is read by is ahead of UTC at a moment: what says which day a moment belongs to, and where a day starts. Left out, it is the screen's clock (`LocalPantrixClock`), the device's unless a test or a preview gives another. For rows that are days of UTC it is `{ Duration.ZERO }`; an app that has a library of time zones asks it for the zone it shows.
- `gapless: Boolean`: Whether the places stand at even steps, with no gap for the time between two of them where the rows have none: the days a market is closed. A mark of the chart at a moment between two places stands between them, as far from each as it is in time; one before the first place or after the last is not drawn.

### ChartTimeUnit

`import com.pantrixui.components.chart.cartesian.ChartTimeUnit`, from `com.pantrixui:components`

```kotlin
enum class ChartTimeUnit
```

What a chart's axis of time counts in, where it writes a moment: from the finest to the coarsest.

Entries:

- `Second`: Seconds, the finest unit the axis counts in.
- `Minute`: Minutes.
- `Hour`: Hours.
- `Day`: Days.
- `Month`: Months.
- `Year`: Years, the coarsest unit the axis counts in.

### ChartMark

`import com.pantrixui.components.chart.cartesian.ChartMark`, from `com.pantrixui:components`

```kotlin
sealed class ChartMark
```

Something a `PantrixChart` draws in its plot besides its series, for them to be read by: a line at a value or at a place, a band between two.

```kotlin
PantrixChart(
    series = series,
    marks = listOf(
        ChartReferenceLine(y = 500, label = "Target"),
        ChartReferenceBand(x1 = "Jun", x2 = "Aug", label = "Summer")
    )
)
```

A mark at a value is drawn against the axis of values it names, and that axis goes far enough to show it. A mark at a place that no series of the chart names is not drawn. A mark that has a label is said to a screen reader after the chart's description, with the value or the place it stands at.

In a chart whose places are moments, each a `kotlin.time.Instant`, a mark at a place stands at any moment, whether a row names it or not, and a band goes from a moment to another: the hour of a release, the days of a holiday. The axis of time goes as far as a mark that stands before the rows or after them, as an axis of values goes as far as a mark at a value; one whose places stand at even steps (`ChartTime.gapless`) does not, and a mark past its rows is not drawn. On a numeric axis of places (`ChartAxis.numeric`) a mark stands at any number in the same way.

A scatter chart draws them too. Both of its axes are of values: a mark at a place stands there at a value of the axis along the chart, a number, and that axis goes far enough to show it.

Members:

- `label: String?`: What is written at the mark, and said of it to a screen reader. Left out, the mark has no words.
- `color: Color`: The colour the mark is drawn in. Left out, it is the colour the axes are written in.
- `axis: ChartYAxis`: Which of the chart's axes of values the mark's values are read by. A mark at a place has no use for it.
- `labelPosition: ChartMarkLabelPosition`: Where the label is written along the mark.
- `inFront: Boolean`: Whether the mark is drawn over the series, and not behind them. Its label is written over the series either way, on a plate of the tooltip's colour: so that it reads on a bar and over a line.

### ChartReferenceLine

`import com.pantrixui.components.chart.cartesian.ChartReferenceLine`, from `com.pantrixui:components`

```kotlin
class ChartReferenceLine(
    public val y: Number? = null,
    public val x: Any? = null,
    override val label: String? = null,
    override val color: Color = Color.Unspecified,
    public val dash: ChartDash = ChartDash.Dashed,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labelPosition: ChartMarkLabelPosition = ChartMarkLabelPosition.End,
    override val inFront: Boolean = true
) : ChartMark()
```

A line through the plot: across it at the value `y`, or up it at the place `x`, one of the two.

```kotlin
ChartReferenceLine(y = 500, label = "Target")
ChartReferenceLine(x = "Mar", label = "Launch", dash = ChartDash.Dotted)
```

It is drawn over the series unless it says otherwise, as wide as the style's `markLineWidth`. Its label is written over a line across the plot, or under it where it is too near the plot's top, and beside a line up the plot; at its end unless it says otherwise: at the side lines end at, and at the top of a line up the plot.

Two are the same line where everything they were built from is the same.

Parameters:

- `y: Number?`: The value the line stands at.
- `x: Any?`: The place the line stands at: what a series' `x` gives for that place.
- `label: String?`: What is written at the mark, and said of it to a screen reader. Left out, the mark has no words.
- `color: Color`: The colour the mark is drawn in. Left out, it is the colour the axes are written in.
- `dash: ChartDash`: Whether the line is drawn whole, in dashes or in dots.
- `axis: ChartYAxis`: Which of the chart's axes of values the mark's values are read by. A mark at a place has no use for it.
- `labelPosition: ChartMarkLabelPosition`: Where the label is written along the mark.
- `inFront: Boolean`: Whether the mark is drawn over the series, and not behind them. Its label is written over the series either way, on a plate of the tooltip's colour: so that it reads on a bar and over a line.

### ChartMarkLabelPosition

`import com.pantrixui.components.chart.cartesian.ChartMarkLabelPosition`, from `com.pantrixui:components`

```kotlin
enum class ChartMarkLabelPosition
```

Where a `ChartMark`'s label is written along it.

Along a line across the plot, and along any band, it goes as lines go: from the side lines start at to the side they end at. Along a line up the plot it goes as values go, from the line's foot to its top.

Entries:

- `Start`: At the side lines start at, or at the foot of a line up the plot.
- `Center`: Half-way along.
- `End`: At the side lines end at, or at the top of a line up the plot.

### ChartStacking

`import com.pantrixui.components.chart.cartesian.ChartStacking`, from `com.pantrixui:components`

```kotlin
enum class ChartStacking
```

How the series of a stack stand on one another in a `PantrixChart`: as their values, or as their shares of what the stack comes to at each place.

Entries:

- `Normal`: As their values: a stack is as tall as its series' values come to.
- `Percent`: As their shares: every stack is as tall as every other, a hundred percent, and each series takes its share of it, its value over what the values of its stack come to there, under nought or over it. The axis the stacks are read by writes shares, where it writes nothing of its own; the tooltip writes a value with its share after it, and a label the share. A series in no stack is drawn as its values all the same: read it by the second axis.

### ChartReferenceBand

`import com.pantrixui.components.chart.cartesian.ChartReferenceBand`, from `com.pantrixui:components`

```kotlin
class ChartReferenceBand(
    public val y1: Number? = null,
    public val y2: Number? = null,
    public val x1: Any? = null,
    public val x2: Any? = null,
    override val label: String? = null,
    override val color: Color = Color.Unspecified,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labelPosition: ChartMarkLabelPosition = ChartMarkLabelPosition.Start,
    override val inFront: Boolean = false
) : ChartMark()
```

A band of the plot, shaded: across it between the values `y1` and `y2`, or up it between the places `x1` and `x2`, one of the two.

```kotlin
ChartReferenceBand(y1 = 300, y2 = 450, label = "Usual")
ChartReferenceBand(x1 = "Jun", x2 = "Aug", label = "Summer")
ChartReferenceBand(y1 = 900, label = "Too many")
```

A band with one end goes from it to the end of the axis: `y1` alone up to the axis' top and `y2` alone from its foot, `x1` alone on to the last place and `x2` alone from the first. Between two places of a chart with bars it takes in the bars of both.

It is drawn behind the series unless it says otherwise, in a tint of its colour, as much of it as the style's `markBandAlpha` says. Its label is written inside it at its top: in its corner at the side lines start at unless it says otherwise.

Two are the same band where everything they were built from is the same.

Parameters:

- `y1: Number?`: The value the band starts at.
- `y2: Number?`: The value it ends at.
- `x1: Any?`: The place the band starts at: what a series' `x` gives for that place.
- `x2: Any?`: The place it ends at.
- `label: String?`: What is written at the mark, and said of it to a screen reader. Left out, the mark has no words.
- `color: Color`: The colour the mark is drawn in. Left out, it is the colour the axes are written in.
- `axis: ChartYAxis`: Which of the chart's axes of values the mark's values are read by. A mark at a place has no use for it.
- `labelPosition: ChartMarkLabelPosition`: Where the label is written along the mark.
- `inFront: Boolean`: Whether the mark is drawn over the series, and not behind them. Its label is written over the series either way, on a plate of the tooltip's colour: so that it reads on a bar and over a line.

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

### ChartDataLabelPosition

`import com.pantrixui.components.chart.common.ChartDataLabelPosition`, from `com.pantrixui:components`

```kotlin
enum class ChartDataLabelPosition
```

Where on its bar a value's label is written. Along a bar, the end is where its value is, and the start where the bar stands: on nought, on the bar of its stack before it, at the lower value of a range.

Entries:

- `Auto`: Where it has room: past the end of a bar that stands by itself, or inside that end where it has none there; in the middle of a bar of a stack.
- `Outside`: Past the end of the bar. In a stack, where the bar of the next value stands, it is written inside the end of its own bar instead.
- `InsideEnd`: Inside the bar, at its end.
- `Center`: In the middle of the bar.
- `InsideStart`: Inside the bar, at its start.

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

### ChartLegendPosition

`import com.pantrixui.components.chart.common.ChartLegendPosition`, from `com.pantrixui:components`

```kotlin
enum class ChartLegendPosition
```

Which side of a chart its legend stands on.

Entries:

- `Top`: Over the chart.
- `Bottom`: Under the chart: where a legend stands unless told.
- `Start`: Where lines start: the left of the chart, and the right in a language read from the right.
- `End`: Where lines end.

### ChartLegendAlignment

`import com.pantrixui.components.chart.common.ChartLegendAlignment`, from `com.pantrixui:components`

```kotlin
enum class ChartLegendAlignment
```

Where a legend stands in the room it has along its side of the chart.

Entries:

- `Start`: At the start of its side: the left, and the right in a language read from the right.
- `Center`: In the middle of its side: where it stands unless told.
- `End`: At the end of its side.

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

### ChartZoom

`import com.pantrixui.components.chart.common.ChartZoom`, from `com.pantrixui:components`

```kotlin
class ChartZoom(
    public val closest: Float = 20f,
    public val buttons: Boolean = true,
    public val navigator: Boolean = false,
    public val fitValues: Boolean = false
)
```

What lets a reader look closer at a part of a chart: given to a chart as its `zoom`, it lets them bring a part of the chart's places into view, as wide as the chart, and move along the rest.

The part in view is kept in the chart's `ChartState`, as its `window`: a screen reads it there, and sets it with `zoomTo` and `resetZoom`. Two charts given one state show the same part of their places, so that the one is looked at closer as the other is. A Gantt chart given a zoom looks closer at its time the same way, and a scatter chart at its two values, the part up its side kept as the state's `valueWindow`; neither has a navigator.

- With a mouse: a wheel turned while Ctrl, or a Mac's Command, is held looks closer about the place under the pointer, and a wheel turned along the places moves along them: sideways, or up and down a chart whose places go down its side; so does a drag, while a part of them is in view. Any other turn is left to the page, and so is one that moves the part in view no further, at an end of the places.

- With fingers: two moved apart look closer about the point between them, and two moved along the chart take the places with them. One finger points at a place, as in any chart.

- With the keyboard, on the chart: plus looks closer and minus further off, about the place that is pointed at, nought shows all the places again, and the arrows bring the place they go to into view.

- With the `buttons`, for whoever has none of those, or would rather not drag: back and on along the places, further off, closer, and all the places again.

- With the `navigator`, a strip under the chart, or beside one whose places go down its side, that all the places lie on: the part in view is marked on it, dragged along it, and made wider and narrower by its two ends.

The axes of values stay as all the values have them, so that they hold still while the reader moves along the places; where the chart is to `fitValues`, they are made again for the values in view as it is looked at closer, and a stretch that changes little fills the plot. The navigator's lines stay on the axes of all the values.

```kotlin
PantrixLineChart(data = days, x = { it.day }, values = visits, zoom = ChartZoom(navigator = true))
```

Parameters:

- `closest: Float`: How many times closer than all its places the chart may be looked at, at the most: twenty shows a twentieth of them. One or more.
- `buttons: Boolean`: Whether the chart has its row of buttons, above its plot at the side lines end at.
- `navigator: Boolean`: Whether the chart has the strip under its plot, or beside it where its places go down its side. It is as tall, or as wide, as the chart's style says, its `navigatorHeight`.
- `fitValues: Boolean`: Whether the axes of values are made for the values of the places in view, and the marks, while a part of the places is in view: as an axis is made for all of them, from nought where it takes nought in and between the ends it is given where it has them.

### ChartDecimation

`import com.pantrixui.components.chart.common.ChartDecimation`, from `com.pantrixui:components`

```kotlin
class ChartDecimation(
    public val threshold: Int? = null,
    public val algorithm: DecimationAlgorithm = DecimationAlgorithm.MinMax
)
```

What a chart does with a line that has more points in view than it can draw apart: given to a chart as its `decimation`, it draws the line through some of them, straight from one to the next, and the points have no marks. A chart given none draws every point, as many as there are.

```kotlin
PantrixLineChart(data = readings, x = { it.time }, values = levels, decimation = ChartDecimation(threshold = 2000))
```

Parameters:

- `threshold: Int?`: How many places of a line may be in view before it is thinned. Left out, twice as many as the plot is pixels wide.
- `algorithm: DecimationAlgorithm`: Which of the points are kept.

### DecimationAlgorithm

`import com.pantrixui.components.chart.common.DecimationAlgorithm`, from `com.pantrixui:components`

```kotlin
enum class DecimationAlgorithm
```

How a line with more points in view than its plot has room for is drawn through fewer of them.

Entries:

- `MinMax`: Of the points that stand in one column of the plot's pixels, the first, the highest, the lowest and the last: the line covers every pixel the whole line would, its peaks and its dips among them.
- `Lttb`: As many points as the plot is pixels wide, each the one of its share of the points that makes the largest triangle with the point kept before it and the share after it (Largest-Triangle-Three-Buckets, Steinarsson, 2013): the line keeps its shape with a point to a pixel, though a peak between two kept points is cut off.

### ChartPattern

`import com.pantrixui.components.chart.common.ChartPattern`, from `com.pantrixui:components`

```kotlin
enum class ChartPattern
```

A texture a chart's fill is drawn with besides its colour: what tells two series apart for a reader who cannot tell their colours apart, on a screen, in the legend, in the tooltip and in a file the chart is exported as.

The texture is cut into the fill in the colour of what the chart stands on, as grooves are: a bar stays its colour, with lines or dots across it.

Where a chart's style turns patterns on (`ChartStyle.patterns`), each series, slice or tile that names none takes one in turn: the first none, and the next ones in the order these are declared, from `Diagonal`. One that names a pattern has it, whether the chart's patterns are on or off; `None` keeps a fill plain.

Entries:

- `None`: No texture: the fill is its colour alone.
- `Diagonal`: Lines that rise from the left, a slash's way.
- `Dots`: Dots in rows, every other row set half a step along.
- `HorizontalLines`: Lines across.
- `Crosshatch`: Lines that rise from the left and lines that fall, crossing.
- `DiagonalReverse`: Lines that fall from the left, a backslash's way.
- `VerticalLines`: Lines up and down.
- `Grid`: Lines across and lines up and down.
- `Zigzag`: Rows of zigzags.

### ChartExport

`import com.pantrixui.components.chart.export.ChartExport`, from `com.pantrixui:components`

```kotlin
class ChartExport(
    public val formats: List<ChartExportFormat> = ChartExportFormat.entries,
    public val fileName: String = "chart",
    public val scale: Float = 2f,
    public val background: Color = Color.Unspecified,
    public val padding: Dp = 12.dp,
    public val onExport: (ChartExportFile) -> Unit
)
```

What lets a reader take a chart out of the app as a file: given to a chart as its `export`, it puts a button among the chart's own, which makes the file and hands it to `onExport`. A chart that is given none has no such button, and nothing of this is there.

The chart makes the file and does nothing with it: where a file goes is the app's to say, and is another thing on every platform. A phone shares it, a window asks where to save it, a browser downloads it. What `onExport` is handed has the file's name, its type and its bytes, which is what each of those ways takes.

The file shows the chart as it is on the screen, with what the reader has done to it: the series they have taken out are out, and of a chart that is looked at closer it shows the part in view. The place that is pointed at and its tooltip are not in it, nor are the chart's buttons; the legend stands under the plot.

```kotlin
PantrixLineChart(
    data = months,
    x = { it.name },
    values = revenue,
    export = ChartExport(fileName = "revenue") { file -> share(file.name, file.mimeType, file.bytes) }
)
```

Parameters:

- `formats: List<ChartExportFormat>`: The kinds of file the reader chooses from, in the order they are offered. One kind alone is made at the press of the button, with no choice to make.
- `fileName: String`: What the file is called, without the ending its kind adds.
- `scale: Float`: How many pixels a PNG has to each dp of the chart: two is twice as sharp as a screen that has one. An SVG and a PDF are as large as the chart is in dp, and sharp at any size.
- `background: Color`: What the file's picture stands on. Unspecified, the theme's `background`: a chart has no fill of its own, and its words are written to be read on the theme's grounds. `Color.Transparent` leaves the picture with nothing under it.
- `padding: Dp`: The room the picture leaves around the chart on every side, in its `background`: a chart's own box ends where its words do, and a picture cut there has them at its very edge. 12dp unless given.
- `onExport: (ChartExportFile) -> Unit`: Handed the file once it is made.

### ChartExportFormat

`import com.pantrixui.components.chart.export.ChartExportFormat`, from `com.pantrixui:components`

```kotlin
enum class ChartExportFormat
```

A kind of file a chart is taken out of the app as.

Entries:

- `Png`: A picture of pixels: what every app shows, and no sharper than it was made.
- `Svg`: A picture of lines and shapes, sharp at any size: what a browser and a drawing program open.
- `Pdf`: A page of lines and shapes, sharp at any size: what is printed and put into a report.

### ChartExportFile

`import com.pantrixui.components.chart.export.ChartExportFile`, from `com.pantrixui:components`

```kotlin
class ChartExportFile(
    public val name: String,
    public val mimeType: String,
    public val format: ChartExportFormat,
    public val bytes: ByteArray
)
```

A chart as a file.

Parameters:

- `name: String`: The file's name, with the ending of its kind: `revenue.svg`.
- `mimeType: String`: Its type as the web names types: `image/png`, `image/svg+xml` or `application/pdf`.
- `format: ChartExportFormat`: Its kind.
- `bytes: ByteArray`: What is in it. An SVG is text, in UTF-8.

### ChartState

`import com.pantrixui.components.chart.common.ChartState`, from `com.pantrixui:components`

```kotlin
class ChartState(hidden: Set<String> = emptySet())
```

What a reader has done to a chart: the series they have put out of sight from its legend, and the place a pointer, a finger or the keys are on.

A chart keeps one for itself. A screen that wants to know either, or to say them, makes its own with `rememberChartState` and gives it to the chart. Two charts given the same state are one to their reader: a series hidden in the one is hidden in the other, and the place pointed at in the one is marked in both, where both have it.

A chart with axes that is given a `zoom` keeps the part of its places that is in view here too, as `window`: two such charts given the same state are looked at closer together. A Gantt chart keeps the part of its time there, and a scatter chart the part of its values across in `window` and up its side in `valueWindow`.

To a pie its slices are what its series are to a chart with axes: a slice is put out of sight by its key, and the slice that is pointed at is the selection whose `x` is that key.

In a scatter chart the point that is pointed at is the selection whose `series` is the key of its series and whose `x` is its place among that series' rows, counted from nought.

Parameters:

- `hidden: Set<String>`: the keys of the series that are out of sight to begin with.

Members:

- `hidden: Set<String>`: The keys of the series that are not drawn: what the legend's entries turn on and off.
- `selection: ChartSelection?`: The place that is pointed at, and the tooltip is shown for: null while none is. A pointer over the chart, a finger on it and the arrow keys set it; a pointer that leaves, and Escape, clear it.
- `window: ClosedFloatingPointRange<Float>`: The part of the chart's places that is in view, from a share of the way along them to another: `0f..1f`, the whole of them, unless the chart is looked at closer. A chart with axes that is given a `zoom` lets its reader change it; a screen changes it with `zoomTo` and `resetZoom`.
- `zoomed: Boolean`: Whether a part of the chart's places, or of its values, is in view, and not all of them.
- `fun toggle(series: String)`: Puts the series with the key `series` out of sight where it is drawn, and back where it is not.
- `fun zoomTo(start: Float, end: Float)`: Brings the part of the places from `start` to `end` into view, each a share of the way along them from nought to one: `zoomTo(0.5f, 1f)` shows the later half. The two are taken in order and kept within the whole, and a part narrower than a thousandth of it is widened to that.
- `fun resetZoom()`: Shows all the places, and all the values, again.
- `valueWindow: ClosedFloatingPointRange<Float>`: The part of the chart's values that is in view up its side, from a share of the way up them to another: `0f..1f`, all of them, unless the chart is looked at closer. Only a scatter chart given a `zoom` looks closer at its values up its side; a screen changes the part with `zoomValuesTo` and `resetZoom`.
- `fun zoomValuesTo(start: Float, end: Float)`: Brings the part of the values up the chart's side from `start` to `end` into view, each a share of the way up them from nought to one: `zoomValuesTo(0f, 0.5f)` shows the lower half. The two are taken as `zoomTo` takes its two.

### rememberChartState

`import com.pantrixui.components.chart.common.rememberChartState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberChartState(hidden: Set<String> = emptySet()): ChartState
```

A chart's state, kept while the screen is, and its hidden series as long as the screen's saved state is.

Parameters:

- `hidden: Set<String>`: the keys of the series that are out of sight to begin with.

### ChartSelection

`import com.pantrixui.components.chart.common.ChartSelection`, from `com.pantrixui:components`

```kotlin
data class ChartSelection(
    public val x: Any,
    public val series: String? = null
)
```

A place on a chart that is pointed at.

Parameters:

- `x: Any`: The place, as the series' rows name it: what their `x` gave. In a pie, the key of the slice. In a scatter chart, the point's place among its series' rows, counted from nought. In a heatmap, the place among the chart's data of the datum that fills the cell, counted from nought. In a treemap, the key of the tile.
- `series: String?`: The key of the series that is pointed at there, where the chart tells them apart, and null where every series at the place is pointed at together, and in a pie.

### ChartPoint

`import com.pantrixui.components.chart.common.ChartPoint`, from `com.pantrixui:components`

```kotlin
data class ChartPoint(
    public val series: String,
    public val name: String,
    public val x: Any,
    public val label: String,
    public val value: Double,
    public val text: String,
    public val color: Color,
    public val from: Double? = null,
    public val high: Double? = null,
    public val low: Double? = null
)
```

A value of a chart, as it is handed to what a screen does with one: a press on it, a tooltip of the screen's own.

A slice of a pie is handed over as one too: its key is its `series` and its `x`, its name its `name` and its `label`, and its `text` its value with its share of the whole after it.

So is a point of a scatter chart: its `x` is its place among its series' rows, counted from nought, its `label` what the point is called, or its series' name where it is called nothing, and its `value` its value up the chart.

So is a cell of a heatmap: its `x` is its datum's place among the chart's data, counted from nought, its `label` its column as the chart writes it and its `name` its row; it is of no series, and its `series` is empty.

And a tile of a treemap: its key is its `series` and its `x`, its name its `name` and its `label`, and its `text` its value with its share of the whole after it.

A range is handed over as its higher value, with its lower as `from`, and its `text` is the two with a dash between them. A step of a waterfall is what the step adds, with the level it starts from as `from`; its `text` has the step's sign. A total of a waterfall is what it comes to. A candle is handed over as its close, with its opening as `from` and the two ends of its wick as `high` and `low`; its `text` is the four, each called by what it is.

What a stack comes to at a place, which a tooltip of the place writes after the stack's values, is handed to the tooltip's own content as one too: it is of no series, and its `series` is empty; its name is the theme's word for a total, its `value` the sum of the stack's values and its colour unspecified. In a stack that stands as shares, a value's `text` has its share after it.

Parameters:

- `series: String`: The key of the series the value is of.
- `name: String`: The name of that series.
- `x: Any`: Where the value stands, as the series' rows name it.
- `label: String`: That place as the chart writes it.
- `value: Double`: The value.
- `text: String`: The value as the chart writes it.
- `color: Color`: The colour the series is drawn in, and for a step of a waterfall the colour of the way it goes.
- `from: Double?`: Where the value's mark starts, for a value that is drawn neither from nought nor on a stack: the lower value of a range, the level a step of a waterfall starts from, and the opening of a candle. Null for any other value.
- `high: Double?`: The highest a candle reached. Null for any other value.
- `low: Double?`: The lowest a candle reached. Null for any other value.

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

### ChartColors

`import com.pantrixui.components.chart.common.ChartColors`, from `com.pantrixui:components`

```kotlin
data class ChartColors(
    public val series: List<Color> = emptyList(),
    public val grid: Color = Color.Unspecified,
    public val axis: Color = Color.Unspecified,
    public val label: Color = Color.Unspecified,
    public val crosshair: Color = Color.Unspecified,
    public val tooltipContainer: Color = Color.Unspecified,
    public val tooltipBorder: Color = Color.Unspecified,
    public val tooltipText: Color = Color.Unspecified,
    public val tooltipLabel: Color = Color.Unspecified,
    public val rising: Color = Color.Unspecified,
    public val falling: Color = Color.Unspecified
)
```

What a chart is painted with, for a chart that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// A chart in the brand's two colours, whatever the theme's chart colours are:
PantrixChart(series = series, colors = ChartColors(series = listOf(brand, accent)))
```

A chart has no fill of its own: it is drawn on what it stands on. On the theme's own grounds its lines and its words are the theme's. On a fill, which gives what stands on it a colour, the theme's are not known to read: the words are written in that colour and the lines drawn in a share of it. The colours of the series are drawn as they are given wherever the chart stands, and on a fill it is the caller who knows which read there.

Parameters:

- `series: List<Color>`: The colours the series are drawn in, in the order they are handed out, for the series that name none of their own. Empty, they are the theme's chart colours.
- `grid: Color`: The lines drawn across the chart at the marks of an axis. The theme's `divider`.
- `axis: Color`: The line along an axis. The theme's `border`.
- `label: Color`: What is written beside the axes: the values, the places and the axes' titles, and the names in the legend. The theme's `textSecondary`.
- `crosshair: Color`: The line that marks the place pointed at. The theme's `borderHover`: stronger than the grid it crosses, and quieter than the series it stands behind.
- `tooltipContainer: Color`: The tooltip's fill. The theme's `surface`.
- `tooltipBorder: Color`: The tooltip's edge. The theme's `border`.
- `tooltipText: Color`: The tooltip's heading and its values. The theme's `textPrimary`.
- `tooltipLabel: Color`: The names of the series in the tooltip. The theme's `textSecondary`.
- `rising: Color`: What a value that goes up is drawn in: a step of a waterfall that adds. The theme's `success`.
- `falling: Color`: What a value that goes down is drawn in: a step of a waterfall that takes away. The theme's `danger`.
