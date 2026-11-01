# Heatmap

A grid of cells: each cell in a shade that says how much its value is. It suits what has two names and a number: the hours of the days of a week, the months of several years, one list set against another. What is much and what is little is seen at a glance; a table of the same numbers has to be read.

The chart is given its data and three ways to read a datum: the column it stands in (`x`), its row (`y`) and its value (`value`). The columns and the rows are those the data name, in the order they are first named. A datum with no value fills no cell; a cell that no datum fills is drawn faint.

- `PantrixHeatmap` (`com.pantrixui.components.chart.heatmap`, `com.pantrixui:components`): A grid of cells shaded by their values, with the names of its columns and rows, a scale of shades, a tooltip for the cell pointed at, and every cell reachable by keys and by a screen reader. Keywords: heat map, matrix, correlation matrix, grid chart, density.

## Features

- **Scale.** `HeatmapScale` says how a value becomes a shade: its two ends (`min`, `max`; left out, the least and the most of the values), how many shades it has (`steps`; at nought each value has its own) and its colour (`color`). With one colour, a shade is a share of the colour on what the chart stands on: it reads in a light theme and a dark one. Given `low`, the scale goes from the least's colour `low` to `color`; the shades between are the two colours mixed in Oklab, each step changing as much as the one before.
- **The value in a cell.** With `labels` each cell has its value written in it, in the one of black and white that reads better on its shade; it is not written in a cell it has no room in.
- **Scale bar.** `legend` says where the scale of shades stands: the least and the most of the values are written at its ends.
- **Names.** `xAxis` is the names of the columns and `yAxis` of the rows: whether they are written (`labels`) and how (`label`). A name that has no room is left out by a rule.
- **The cell pointed at.** The cell under the pointer, or the one that is tapped, is ringed, and the tooltip writes its column, its row and its value.
- **Keyboard.** The chart is one stop for Tab: the arrows go from cell to cell, past the blank cells; Home and End go to the first and the last cell, Escape lets go, Enter and Space press the cell that is pointed at.
- **State and pressing.** The cell that is pointed at is kept in `ChartState`, as a selection whose `x` is the datum's place in the list. `onSelect` gives the cell that is pressed: `label` is its column, `name` its row, `value` its value.
- **Screen reader.** The chart says its `description`, then each cell, row after row, with its column, its row and its value. A chart of more than two hundred cells is told by its description alone.
- **Direction.** In a language read from right to left the columns start from the right, and the rows' names are written at the right.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `Heatmap_<tagKey>`; the cells are `.Plot`, a cell `.Cell_<number>`, the scale `.Legend`, the tooltip `.Tooltip`.

## Usage

### A week by the hour

```kotlin
PantrixHeatmap(
    data = visits,
    x = { it.hour },
    y = { it.day },
    value = { it.count },
    description = stringResource(Res.string.visits_by_day_and_hour),
    tagKey = "visits"
)
```

### Five shades, with the values written

```kotlin
PantrixHeatmap(
    data = scores,
    x = { it.subject },
    y = { it.student },
    value = { it.score },
    scale = HeatmapScale(min = 0.0, max = 100.0, steps = 5),
    labels = ChartDataLabels(),
    tagKey = "scores"
)
```

## Examples

### A week by the hour

A shop's visitors over a week, by the day and by the part of the day. A dark cell is a busy hour.

Move the pointer over a cell or tap it: the tooltip writes the visitors of that hour of that day.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.heatmap.PantrixHeatmap

PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    description = "Visits by day and hour",
    tagKey = "plain"
)

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

### Five shades, with the values written

Exam scores, out of a hundred. The scale has five shades (`steps`): each twenty points are a shade. The values are written in the cells (`labels`), and the scale stands beside the chart. The cell of one who sat no exam is blank.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.heatmap.PantrixHeatmap

PantrixHeatmap(
    data = examScores(),
    x = { it.subject },
    y = { it.student },
    value = { it.score },
    scale = HeatmapScale(min = 0.0, max = 100.0, steps = 5),
    labels = ChartDataLabels(),
    legend = ChartLegend(position = ChartLegendPosition.End),
    description = "Students' scores by subject",
    tagKey = "steps"
)

internal fun examScores(): List<ExamScore> {
    val subjects = listOf("Maths", "Physics", "Chemistry", "History", "Language")
    val scores = mapOf(
        "Ada" to listOf(92, 85, 78, 64, 88),
        "Lin" to listOf(71, 58, null, 90, 95),
        "Can" to listOf(45, 62, 70, 81, 39),
        "Ece" to listOf(84, 97, 91, 55, 73)
    )
    return scores.flatMap { (student, row) ->
        subjects.mapIndexed { at, subject -> ExamScore(student, subject, row[at]) }
    }
}

internal class ExamScore(
    val student: String,
    val subject: String,
    val score: Int?
)
```

### A scale of two colours

A scale of two colours, like a temperature: the fewest visits in the `low` colour (the warning colour's container), the most in `color` (the danger colour); the shades between are the two colours mixed in Oklab. The colours come from the theme, so the scale reads in a light theme and a dark one.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.heatmap.PantrixHeatmap
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    scale = HeatmapScale(low = colors.warning.container, color = colors.danger.color),
    labels = ChartDataLabels(),
    description = "Visits by day and hour",
    tagKey = "two_colours"
)

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

### Pressing a cell

`onSelect` gives the cell that is pressed: press a cell, or go to one with the keyboard and press Enter, and the line under the card writes what was pressed. The scale has a colour of its own (`HeatmapScale.color`), and there is no scale bar (`legend = null`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.heatmap.PantrixHeatmap
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    scale = HeatmapScale(color = PantrixTheme.colors.success.color),
    legend = null,
    onSelect = { cell -> report("${cell.name}, ${cell.label}: ${cell.text}") },
    description = "Visits by day and hour",
    tagKey = "pressed"
)

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the cells and the names at their sides; the scale of colours stands under the cells in the file, wherever it stands on the screen.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.heatmap.PantrixHeatmap

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    description = "Visits by day and hour",
    tagKey = "exported",
    export = ChartExport(fileName = "hours-of-the-week") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixHeatmap

`import com.pantrixui.components.chart.heatmap.PantrixHeatmap`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixHeatmap(
    data: List<T>,
    x: (T) -> Any,
    y: (T) -> Any,
    value: (T) -> Number?,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    scale: HeatmapScale = HeatmapScale(),
    labels: ChartDataLabels? = null,
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

A heatmap: a grid of cells, each in a shade that says how much its value is. It suits what has two names and a number: the hours of the days of a week, the months of several years, one list set against another. What is much and what is little is seen at a glance, where a table of the same numbers would have to be read.

The chart is given its `data` and three ways to read a datum: the column it stands in (`x`), its row (`y`) and its `value`. The columns and the rows are those the data name, each once, in the order it is first named. A datum whose value is no number fills no cell, and a cell that no datum fills is drawn faint; of two that name the same cell, the later is the cell's.

Around the cells stand the parts a chart has, each given by what describes it and taken away by `null`: the names of the columns and of the rows, the `legend`, which here is the scale of shades with its least and its most, and the `tooltip`, which shows the value of the cell that is pointed at.

**Pointing at a cell.** A pointer over a cell points at it; a finger does by a tap, and a tap on the cell it points at lets go of it. With the keyboard the chart is one stop for Tab: the arrows go from cell to cell, past the cells that nothing fills, Home and End to the first cell and the last, and Escape lets go. The cell is ringed, the tooltip shown for it, and it is told to `state`, as a selection whose `x` is the datum's place among `data`, counted from nought. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, then each cell with its column, its row and its value, row after row. A chart of more than two hundred cells is told by its description alone.

**Its size.** The chart is as wide as it is given room. A height on its modifier is the whole chart's, the scale's with it; given none, the cells are as tall as the chart's style says and a scale above or under them adds its own. Every column is as wide as the next and every row as tall. A name that has no room to be written is left out by a rule, every second, every third.

In a language read from the right the columns run from the right, and the rows' names are written at the right.

```kotlin
PantrixHeatmap(
    data = visits,
    x = { it.hour },
    y = { it.day },
    value = { it.count },
    description = "Visits by day and hour",
    tagKey = "visits"
)
```

Parameters:

- `data: List<T>`: the data, a datum for each cell that has a value.
- `x: (T) -> Any`: the column a datum stands in: a name, an hour, anything that is equal to itself.
- `y: (T) -> Any`: its row, in the same way.
- `value: (T) -> Number?`: its value, or null where it has none.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the scale's with it.
- `xAxis: ChartAxis?`: the columns: whether their names are written under the cells (`labels`) and how a name is written (`label`). Nothing else of it is read. `null` writes none.
- `yAxis: ChartAxis?`: the rows: whether their names are written beside the cells, and how. `null` writes none.
- `scale: HeatmapScale`: how a value becomes a shade.
- `labels: ChartDataLabels?`: the values written in the cells, each in the one of black and white that reads better on its shade, where the cell has room for it. `null` writes none.
- `legend: ChartLegend?`: where the scale of shades stands. `null` shows none. A scale has nothing to take out of the chart: only where it stands is read.
- `tooltip: ChartTooltip?`: what is shown for the cell that is pointed at: its column as the heading, and under it its row and its value, written as `format` says. A cell has no place to share and no line through it: `shared` and `crosshair` are not read. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its rows.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the cell that is pressed: its `x` is the datum's place among `data`, counted from nought, its `label` its column, its `name` its row, and its `value` its value.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest. Two cells are a `sliceGap` apart, and their corners as round as `barRadius` says.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `Heatmap_<tagKey>`, its cells together `Heatmap_<tagKey>.Plot`, a cell `Heatmap_<tagKey>.Cell_<number>`, counted from one row after row among the cells that are filled, the scale `Heatmap_<tagKey>.Legend` and the tooltip `Heatmap_<tagKey>.Tooltip`. A press on a cell is reported as a `Heatmap` `select` event with the datum's number. Nothing of the values is reported.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button. The scale of shades stands under the cells in the file.

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
