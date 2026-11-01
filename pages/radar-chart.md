# Radar Chart

Several measures of one thing are set out on spokes about a middle and joined into a web: its shape is read at a glance, and two things are told apart by theirs. The skills of two people, a product and its rival, this year and the last.

The chart is given its series; each `RadarSeries` carries its own rows: the spoke a row stands on (`x`) and its value there (`y`). The spokes are set out in the order the series name them, clockwise from twelve o'clock. All the spokes are read by one axis of values: out from the middle, from nought to a round number over the values.

- `PantrixRadarChart` (`com.pantrixui.components.chart.radar`, `com.pantrixui:components`): Several measures of one thing on spokes about a middle, joined into a web, with a web for each series, a legend that takes series out and brings them back, a tooltip for the spoke pointed at, and every spoke reachable by keys and by a screen reader. Keywords: spider chart, web chart, star chart, polar line, skills chart.

## Features

- **Web.** Each series is a web: its line, its fill with a share of its colour (`filled`; the share is `fillAlpha`, a fifth where left out) and a mark at each of its values (`marker`). The line can be dashed or dotted (`dash`): to tell a target from what was measured. Every fill lies under every line.
- **Rings.** `grid` says whether the rings of the values are drawn straight from spoke to spoke (as a web) or round.
- **Axes.** `xAxis` is the spokes: whether their names are written (`labels`), how they are written (`label`), whether the spokes are drawn (`line`). `yAxis` is the axis of values: its ends, how many values it marks, how they are written, whether the values are written (`labels`) and whether the rings are drawn (`grid`). The axis of values starts at nought unless it is told otherwise.
- **The spoke pointed at.** The spoke nearest the pointer, or the one that is tapped, is pointed at: the spoke stands out, the values on it grow, and the tooltip writes the values the series have there. With `ChartTooltip(shared = false)` the tooltip writes only the value of the series nearest the pointer.
- **Keyboard.** The chart is one stop for Tab: the arrows go from spoke to spoke round the chart, and after the last back to the first; Home and End go to the first and the last spoke, Escape lets go, Enter and Space press the value that is pointed at.
- **Screen reader.** The chart says its `description`, then each spoke with the values the series have there.
- **Direction.** The chart turns the same way in a language read from right to left too.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `RadarChart_<tagKey>`; the plot is `.Plot`, the spokes `.Point_<number>`, the legend's entries `.Legend_<series>`, the tooltip `.Tooltip`.

## Usage

### Two people's skills

```kotlin
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.skill }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.skill }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = stringResource(Res.string.skills_of_the_team),
    tagKey = "skills"
)
```

### A target as a dashed outline, on round rings

```kotlin
PantrixRadarChart(
    series = listOf(
        RadarSeries("now", stringResource(Res.string.now), scores, x = { it.area }, y = { it.now }),
        RadarSeries(
            key = "target",
            name = stringResource(Res.string.target),
            data = scores,
            x = { it.area },
            y = { it.target },
            filled = false,
            marker = ChartMarker.None,
            dash = ChartDash.Dashed
        )
    ),
    grid = RadarGrid.Circle,
    tagKey = "scores"
)
```

## Examples

### Two webs

Two people's scores in six skills, out of ten. The shapes of the two webs show who is strong where.

Move the pointer near a spoke or tap it: the tooltip writes the two people's scores in that skill. A press on an entry of the legend takes that person out of the chart.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "The skills of Ada and Lin",
    tagKey = "plain"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Design", ada = 8, lin = 5, target = 7),
    TeamSkill("Code", ada = 6, lin = 9, target = 8),
    TeamSkill("Testing", ada = 5, lin = 7, target = 7),
    TeamSkill("Writing", ada = 9, lin = 4, target = 6),
    TeamSkill("Presenting", ada = 7, lin = 6, target = 8),
    TeamSkill("Planning", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### Against a target

What was measured and the target: the measured is a filled web, the target a dashed line (`filled = false`, `dash`) with no marks. The rings are round here (`RadarGrid.Circle`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarGrid
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("now", "Now", skills, x = { it.name }, y = { it.ada }),
        RadarSeries(
            key = "target",
            name = "Target",
            data = skills,
            x = { it.name },
            y = { it.target },
            filled = false,
            marker = ChartMarker.None,
            dash = ChartDash.Dashed
        )
    ),
    yAxis = ChartAxis(max = 10.0),
    grid = RadarGrid.Circle,
    description = "Ada's skills, with the target",
    tagKey = "target"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Design", ada = 8, lin = 5, target = 7),
    TeamSkill("Code", ada = 6, lin = 9, target = 8),
    TeamSkill("Testing", ada = 5, lin = 7, target = 7),
    TeamSkill("Writing", ada = 9, lin = 4, target = 6),
    TeamSkill("Presenting", ada = 7, lin = 6, target = 8),
    TeamSkill("Planning", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### Telling the series apart

With `ChartTooltip(shared = false)` the tooltip writes not all the series of the spoke but the one nearest the pointer. On the keyboard the up and down arrows go from one series to the next on the same spoke.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin }, marker = ChartMarker.Square)
    ),
    yAxis = ChartAxis(max = 10.0),
    tooltip = ChartTooltip(shared = false),
    description = "The skills of Ada and Lin",
    tagKey = "apart"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Design", ada = 8, lin = 5, target = 7),
    TeamSkill("Code", ada = 6, lin = 9, target = 8),
    TeamSkill("Testing", ada = 5, lin = 7, target = 7),
    TeamSkill("Writing", ada = 9, lin = 4, target = 6),
    TeamSkill("Presenting", ada = 7, lin = 6, target = 8),
    TeamSkill("Planning", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### How dark the fill is

Ada's web is filled darker (`fillAlpha = 0.5f`), Lin's lighter (`0.08f`): one stands out, the other stays behind. Lin's line is still over Ada's fill.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }, fillAlpha = 0.5f),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin }, fillAlpha = 0.08f)
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "The skills of Ada and Lin",
    tagKey = "fills"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Design", ada = 8, lin = 5, target = 7),
    TeamSkill("Code", ada = 6, lin = 9, target = 8),
    TeamSkill("Testing", ada = 5, lin = 7, target = 7),
    TeamSkill("Writing", ada = 9, lin = 4, target = 6),
    TeamSkill("Presenting", ada = 7, lin = 6, target = 8),
    TeamSkill("Planning", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### Pressing a value

`onSelect` gives the value that is pressed: press a spoke, or go to one with the keyboard and press Enter, and the line under the card writes what was pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val report = LocalExampleEvents.current
val skills = teamSkills()
PantrixRadarChart(
    series = listOf(RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada })),
    yAxis = ChartAxis(max = 10.0),
    onSelect = { point -> report("${point.label}: ${point.text}") },
    description = "Ada's skills",
    tagKey = "pressed"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Design", ada = 8, lin = 5, target = 7),
    TeamSkill("Code", ada = 6, lin = 9, target = 8),
    TeamSkill("Testing", ada = 5, lin = 7, target = 7),
    TeamSkill("Writing", ada = 9, lin = 4, target = 6),
    TeamSkill("Presenting", ada = 7, lin = 6, target = 8),
    TeamSkill("Planning", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the rings, the names and the two webs; the legend is under them.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

var file by remember { mutableStateOf<ChartExportFile?>(null) }
val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "The skills of Ada and Lin",
    tagKey = "exported",
    export = ChartExport(fileName = "skills") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Design", ada = 8, lin = 5, target = 7),
    TeamSkill("Code", ada = 6, lin = 9, target = 8),
    TeamSkill("Testing", ada = 5, lin = 7, target = 7),
    TeamSkill("Writing", ada = 9, lin = 4, target = 6),
    TeamSkill("Presenting", ada = 7, lin = 6, target = 8),
    TeamSkill("Planning", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixRadarChart

`import com.pantrixui.components.chart.radar.PantrixRadarChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixRadarChart(
    series: List<RadarSeries<*>>,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    grid: RadarGrid = RadarGrid.Polygon,
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

A radar chart: several measures of one thing set out on spokes about a middle, and joined into a web, so that its shape is read at a glance and two things are told apart by theirs. The skills of two people, a product against its rival, this year against the last.

The chart is given its `series`, and each of them carries its own rows: the spoke a row stands on and its value there. The chart sets out every spoke any of them names, in the order they are first named, clockwise from twelve o'clock. All the spokes are read by one axis of values, which goes out from the middle: from nought, unless the axis says otherwise, to a round number over the most of the values.

Around the webs stand the parts a chart with places has, each given by what describes it and taken away by `null`: the two axes, the `legend`, which lists the series and takes one out of the chart when its entry is pressed, and the `tooltip`, which shows the values at the spoke that is pointed at.

**Pointing at a spoke.** A pointer over the chart points at the spoke nearest it; a finger does by a tap, and a tap on the spoke it points at lets go of it. With the keyboard the chart is one stop for Tab: the arrows go from spoke to spoke round the chart, and past the last to the first again, Home and End to the first and the last, and Escape lets go. Where the tooltip tells the series apart, the arrows up and down go from one series' value to the next. The spoke is marked, the tooltip shown for it, and it is told to `state`. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, then each spoke with the values the series have there, in the spokes' order; the legend's entries are switches.

**Its size.** The chart is as wide as it is given room. A height on its modifier is the whole chart's, the legend's with it; given none, it is as tall as the chart's style says and a legend above or under it adds its own. The web is the largest that has room in what the legend leaves, with the spokes' names about it.

The chart turns the same way in a language read from the right; its legend and its tooltip follow the reading direction.

```kotlin
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.skill }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.skill }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "Skills of Ada and Lin",
    tagKey = "skills"
)
```

Parameters:

- `series: List<RadarSeries<*>>`: the series, in the order they are drawn and listed: a later one is drawn over an earlier. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `xAxis: ChartAxis?`: the spokes: whether their names are written about the chart (`labels`), how a name is written (`label`), and whether the spokes are drawn (`line`). `null` draws nothing of them.
- `yAxis: ChartAxis?`: the axis of the values, out from the chart's middle: its ends, about how many values it marks, how a value is written, whether the marked values are written (`labels`) and whether a ring is drawn at each (`grid`). It starts at nought unless `startFromZero` or `min` says otherwise. `null` draws nothing of it.
- `grid: RadarGrid`: whether a ring goes straight from spoke to spoke, as a web, or round.
- `legend: ChartLegend?`: where the names of the series stand. `null` shows none.
- `tooltip: ChartTooltip?`: what is shown for the spoke that is pointed at. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader has hidden and what they point at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its series.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the value that is pressed: the one pointed at, or of the series nearest the press where the spoke's values are pointed at together.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `RadarChart_<tagKey>`, its plot `RadarChart_<tagKey>.Plot`, a spoke of it `RadarChart_<tagKey>.Point_<number>` counted from one, the legend's entry of a series `RadarChart_<tagKey>.Legend_<series' key>` and the tooltip `RadarChart_<tagKey>.Tooltip`. A press on a value is reported as a `RadarChart` `select` event with the series' key, and a press on a legend's entry as a `toggle` event with the key and whether the series is shown. Nothing of the values is reported.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button.

### RadarSeries

`import com.pantrixui.components.chart.radar.RadarSeries`, from `com.pantrixui:components`

```kotlin
class RadarSeries<T>(
    public val key: String,
    public val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    public val color: Color = Color.Unspecified,
    public val filled: Boolean = true,
    public val marker: ChartMarker = ChartMarker.Circle,
    public val dash: ChartDash? = null,
    public val pattern: ChartPattern? = null,
    public val fillAlpha: Float = 0.2f
)
```

One web of a `PantrixRadarChart`: the rows it is read from, the spoke each of them stands on and its value there.

```kotlin
RadarSeries("ada", "Ada", skills, x = { it.skill }, y = { it.ada })
```

`x` says which spoke a row stands on: a name, anything that is equal to itself; the chart writes it with its axis' `label`, and as it writes itself where that is left out. `y` is the row's value there, and null where it has none: the web goes from the value before it straight to the one after. A value that is no number, or has no end, is taken as none.

Two series are the same series where everything they were built from is the same, the two functions among them.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows.
- `x: (T) -> Any`: The spoke a row stands on.
- `y: (T) -> Number?`: A row's value, or null where it has none.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `filled: Boolean`: Whether the web is filled with a share of its colour, or is its outline alone.
- `marker: ChartMarker`: What marks each of its values. Shapes tell series apart where colours alone would not.
- `dash: ChartDash?`: Whether its outline is drawn whole, in dashes or in dots: what a target is told from what was measured by. Null, whole, and where the chart's patterns are on (`ChartStyle.patterns`), as its turn among the chart's series says.
- `pattern: ChartPattern?`: The texture its fill is hatched with besides its colour, where it is filled. Null, none, and where the chart's patterns are on, its turn among the chart's series.
- `fillAlpha: Float`: How much of its colour the web is filled with, where it is filled: nought to one. At a fifth, the default, webs that lie over each other show through each other; more sets a web apart from the rest. Every fill still lies under every outline.

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
