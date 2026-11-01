# Pie Chart

The parts of a whole as the slices of a disc: each slice takes as much room as its value is of the total. With its middle cut out (`hole`) it is a ring, and the hole has room for a total or a title.

The chart is given its slices: each `PieSlice` is a key, a name and a value. The slices lie in the order they are given, clockwise from twelve o'clock; each is drawn in the theme's next chart colour unless it names its own. The legend, the tooltip and the state are the same parts a chart with axes has, and are given as the "Chart" page tells.

- `PantrixPieChart` (`com.pantrixui.components.chart.pie`, `com.pantrixui:components`): The parts of a whole as the slices of a pie, or of a ring with a total in its middle, with a legend that takes slices out and brings them back, a tooltip for the slice pointed at, and every slice reachable by keys and by a screen reader. Keywords: donut chart, doughnut, ring chart, share, proportion, slices.

## Features

- **Angle.** `startAngle` is where the first slice begins, in degrees clockwise from twelve o'clock; `sweepAngle` is how much of a turn the slices take together: 360 a whole pie, 180 a half pie. A half pie is as wide as its box allows.
- **Order and small slices.** `sort` lays the slices out as given, largest first or smallest first. `others` gathers the slices smaller than a share of the whole into one slice at the end; that slice's tooltip and what a screen reader hears of it name each one it holds.
- **Values.** A slice's value is an amount; the chart works out its share. A slice with no value, or one that is not over nought, has no place in the pie, and its name stays in the legend.
- **Ring.** `hole` says how much of the radius is cut out: nought is a whole pie, six tenths a ring with room to write in. `center` stands in the hole, in the largest box the hole holds; in a half ring, in the hole of the half that is drawn.
- **The slice pointed at.** The slice under the pointer, or the one that is touched, stands out past the pie's rim and the tooltip writes its value and its share. With a finger, another touch on the slice that is pointed at lets go of it.
- **Keyboard.** The pie is one stop for Tab: the arrows go from slice to slice, and after the last slice back to the first; Home and End go to the first and the last slice, Escape lets go, Enter and Space press the slice that is pointed at. On desktop and on the web a press on the pie gives it the focus: the arrows that follow go round this pie.
- **Legend.** The names of the slices, each beside its colour. Pressing an entry takes the slice out of the pie; the slices that are left share the whole anew.
- **Labels.** `labels` writes each slice's share on the slice, in black or white, whichever reads better on its colour; its value, where `format` is given. A label that does not fit on its slice is written outside it with the slice's name, and a line in the slice's colour links it to the slice. `position` changes this: `Outside` writes all of them outside, `Center` only inside. The pie makes room at its two sides for the words outside it; where that room would leave the pie less than half its size, the words stay inside only.
- **Screen reader.** The chart says its `description` first, then each slice with its name, its value and its share.
- **Direction.** The pie turns clockwise in a language read from right to left too; its legend follows the reading direction.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** The chart is `PieChart_<tagKey>`; the pie `.Plot`, the slices `.Slice_<number>`, the legend's entries `.Legend_<the slice's key>`, the tooltip `.Tooltip`.

## Usage

### The shares of a whole

```kotlin
PantrixPieChart(
    slices = sources.map { PieSlice(it.id, it.name, it.visits) },
    description = stringResource(Res.string.visits_by_source),
    tagKey = "sources"
)
```

### A ring with its total in the middle and the shares written on it

```kotlin
PantrixPieChart(
    slices = sources.map { PieSlice(it.id, it.name, it.visits) },
    hole = 0.6f,
    center = { PantrixText(text = total, style = PantrixTheme.typography.title) },
    labels = ChartDataLabels(),
    legend = ChartLegend(position = ChartLegendPosition.End),
    tagKey = "sources"
)
```

## Examples

### The shares of a whole

At its plainest: the slices, each with its key, its name and its value. The first slice starts at twelve o'clock and the others follow it clockwise; the legend stands under the chart.

Move the pointer over a slice, or touch it: the slice stands out and the tooltip writes the number of visits and its share of the total. Press a name in the legend: the slice goes and the others share the whole anew.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice

PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    description = "Visits by source",
    tagKey = "plain"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

### A ring with its total in the middle

A pie with its middle cut out is a ring: six tenths of the radius are cut out (`hole`) and the total is written in the hole (`center`).

Take a slice out from the legend: the number in the middle becomes the total of the slices that are left. The screen keeps the chart's state itself (`rememberChartState`) and reads the hidden slices from it.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberChartState()
val strings = PantrixTheme.strings
val total = VISIT_SOURCES.filter { it.key !in state.hidden }.sumOf { it.visits }
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    center = {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            PantrixText(text = strings.decimal(total), style = PantrixTheme.typography.title)
            PantrixText(text = "visits", color = PantrixTheme.colors.textSecondary)
        }
    },
    state = state,
    description = "Visits by source, with their total in the middle",
    tagKey = "ring"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

### The shares on the slices

The shares are on the slices (`labels`): each slice has its share of the total written on it, in black or white, whichever reads better on the slice's colour. Turn the switch: the labels write the value, not the share (`ChartDataLabels(format = …)`).

A label that does not fit on its slice is written outside it with the slice's name; a line links it to its slice.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var values by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = values,
    onCheckedChange = { values = it },
    label = "Write the values",
    tagKey = "pie_labels_values"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    labels = if (values) ChartDataLabels(format = { strings.decimal(it) }) else ChartDataLabels(),
    description = "Visits by source, with their shares",
    tagKey = "labels"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

### Where the labels go

Where the labels go (`ChartDataLabels(position = …)`). "Automatic" (`Auto`) writes each share on its slice and the ones that do not fit outside; "Outside" (`Outside`) writes each slice's name and share beside the pie; "Inside" (`Center`) leaves out the ones that do not fit. A line in the slice's colour links the words outside to their slice, and the pie makes room for them at its two sides.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabelPosition
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var place by remember { mutableStateOf(ChartDataLabelPosition.Outside) }
PantrixSegmentButton(
    options = PIE_LABEL_PLACES,
    selected = place,
    onSelect = { place = it },
    fullWidth = false,
    tagKey = "pie_label_place"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    labels = ChartDataLabels(position = place),
    legend = null,
    description = "Visits by source, with their shares",
    tagKey = "label_place"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)

private val PIE_LABEL_PLACES = listOf(
    SegmentOption(value = ChartDataLabelPosition.Auto, label = "Automatic", tagKey = "auto"),
    SegmentOption(value = ChartDataLabelPosition.Outside, label = "Outside", tagKey = "outside"),
    SegmentOption(value = ChartDataLabelPosition.Center, label = "Inside", tagKey = "inside")
)
```

### A half ring

A half ring: the slices begin at nine o'clock (`startAngle = 270f`) and take half a turn (`sweepAngle = 180f`). The ring is as wide as its box allows, and the total stands in the hole of the half that is drawn.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val total = PantrixTheme.strings.decimal(VISIT_SOURCES.sumOf { it.visits })
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    startAngle = 270f,
    sweepAngle = 180f,
    center = { PantrixText(text = total, style = PantrixTheme.typography.title) },
    description = "Visits by source, a half ring",
    tagKey = "half"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

### Order and small slices

Visits by browser, largest first (`sort = PieSort.Descending`). The slices smaller than five hundredths of the whole are gathered into one slice at the end (`others = PieOthers(share = 0.05f)`); its name is the theme's word. Move the pointer over the gathered slice, or touch it: the tooltip names each one it holds. Turn the switch off: every slice shows.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieOthers
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.chart.pie.PieSort
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var gathered by remember { mutableStateOf(true) }
PantrixSwitchButton(
    checked = gathered,
    onCheckedChange = { gathered = it },
    label = "Gather the small ones",
    tagKey = "pie_gathered"
)
PantrixPieChart(
    slices = BROWSER_VISITS.map { PieSlice(it.key, it.name, it.visits) },
    sort = PieSort.Descending,
    others = if (gathered) PieOthers(share = 0.05f) else null,
    labels = ChartDataLabels(),
    legend = ChartLegend(position = ChartLegendPosition.End),
    description = "Visits by browser",
    tagKey = "gathered"
)

private data class Browser(
    val key: String,
    val name: String,
    val visits: Int
)

private val BROWSER_VISITS = listOf(
    Browser("safari", "Safari", 198),
    Browser("firefox", "Firefox", 42),
    Browser("chrome", "Chrome", 612),
    Browser("opera", "Opera", 24),
    Browser("edge", "Edge", 54),
    Browser("uc", "UC", 17),
    Browser("samsung", "Samsung", 31),
    Browser("yandex", "Yandex", 22)
)
```

### Where the legend stands

The legend stands on one of the chart's four sides. Above and under it the entries are set in a row, which goes on to another line where they do not fit; at the sides they stand under one another and take no more than four tenths of the width. The pie is the largest circle that fits in the middle of what the legend leaves.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var place by remember { mutableStateOf(ChartLegendPosition.End) }
PantrixSegmentButton(
    options = PIE_LEGEND_PLACES,
    selected = place,
    onSelect = { place = it },
    fullWidth = false,
    tagKey = "pie_legend_place"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    legend = ChartLegend(position = place),
    description = "Visits by source",
    tagKey = "legend"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)

private val PIE_LEGEND_PLACES = listOf(
    SegmentOption(value = ChartLegendPosition.Top, label = "Top", tagKey = "top"),
    SegmentOption(value = ChartLegendPosition.Bottom, label = "Bottom", tagKey = "bottom"),
    SegmentOption(value = ChartLegendPosition.Start, label = "Start", tagKey = "start"),
    SegmentOption(value = ChartLegendPosition.End, label = "End", tagKey = "end")
)
```

### Pressing a slice

`onSelect` gives the slice that is pressed: its key, its name, its value and how the chart writes it. Press a slice, or go to one with the keyboard and press Enter: the line under the card writes what was pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice

val report = LocalExampleEvents.current
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    description = "Visits by source",
    onSelect = { point -> report("${point.name}: ${point.text}") },
    tagKey = "pressed"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Values that change

When the values change the slices go from where they were to where they are now. Turn the switch: the chart shows last year's visits. The slices are matched by their keys: a slice whose name or value changes is the same slice, and keeps its colour and its place in the legend.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var before by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = before,
    onCheckedChange = { before = it },
    label = "Last year",
    tagKey = "pie_before"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, if (before) it.before else it.visits) },
    hole = 0.6f,
    labels = ChartDataLabels(),
    description = if (before) "Visits by source last year" else "Visits by source this year",
    tagKey = "changing"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

### Your own colours and sizes

A chart's own look. Each slice names its own colour (`PieSlice(color = …)`): shades of one violet from the palette in place of the theme's chart colours. `ChartStyle` gives the sizes: no gap between the slices (`sliceGap`) and a lower chart (`height`). A field that is not given stays the theme's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.foundation.token.color.PantrixPalette

val dark = LocalDemoDarkTheme.current
val violet = PantrixPalette.Violet
val tones = if (dark) {
    listOf(violet.shade300, violet.shade400, violet.shade500, violet.shade600, violet.shade700)
} else {
    listOf(violet.shade800, violet.shade600, violet.shade500, violet.shade400, violet.shade300)
}
PantrixPieChart(
    slices = VISIT_SOURCES.mapIndexed { index, source ->
        PieSlice(source.key, source.name, source.visits, color = tones[index])
    },
    labels = ChartDataLabels(),
    description = "Visits by source",
    style = ChartStyle(sliceGap = 0.dp, height = 180.dp),
    tagKey = "own_look"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalDemoDarkTheme`: Whether the app's theme is dark right now: the system's mode while the setting is "System", and the setting itself otherwise.

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the pie as it is on the screen, the legend under it; the slice that is pointed at and its tooltip are not in it. What stands in the hole by `center` is not in the file either.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    center = { PantrixText(text = "Visits", color = PantrixTheme.colors.textSecondary) },
    description = "Visits by source",
    tagKey = "exported",
    export = ChartExport(fileName = "visit-sources") { file = it }
)
ExportedFile(file, tagKey = "exported")

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Direct", visits = 420, before = 380),
    VisitSource("search", "Search", visits = 310, before = 240),
    VisitSource("social", "Social", visits = 150, before = 260),
    VisitSource("mail", "E-mail", visits = 80, before = 90),
    VisitSource("other", "Other", visits = 40, before = 30)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixPieChart

`import com.pantrixui.components.chart.pie.PantrixPieChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixPieChart(
    slices: List<PieSlice>,
    modifier: Modifier = Modifier,
    hole: Float = 0f,
    center: (@Composable () -> Unit)? = null,
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
    startAngle: Float = 0f,
    sweepAngle: Float = 360f,
    sort: PieSort = PieSort.Given,
    others: PieOthers? = null,
    export: ChartExport? = null
)
```

A pie chart: the parts of a whole as the slices of a disc, each as much of the turn as its value is of their sum. With a `hole` in its middle it is a ring, a donut, which has room in the hole for a total or a title.

The pie is given its `slices`, each with a key, a name and a value. They lie in the order they are given, or the order `sort` says, clockwise from `startAngle`, and take a whole turn or the `sweepAngle` it is given: half of one for a half pie. Each is in the theme's chart colour for its place unless it names its own. A slice whose value is no number, or is not over nought, has no part of the pie, and keeps its place in the legend. Where the pie is given `others`, its smallest slices are gathered into one, last.

Around the pie stand the parts a chart with axes has, each given by what describes it and taken away by `null`: the `legend`, which lists the slices and takes one out of the pie when its entry is pressed, and the `tooltip`, which shows the value of the slice that is pointed at and its share of the whole.

**Pointing at a slice.** A pointer over a slice points at it; a finger does by a tap, and a tap on the slice it points at lets go of it. With the keyboard the pie is one stop for Tab: the arrows go from slice to slice round the pie, and past the last to the first again, Home and End to the first and the last, and Escape lets go. The slice stands out past the pie's rim, the tooltip is shown for it, and it is told to `state`. A press, Enter or Space on it calls `onSelect`. In a window and in a browser a press on the pie takes the focus, as a press on a button does, so that the arrows after it go through this pie.

**To a screen reader** the pie is its `description`, then each slice with its value and its share, in the slices' order; the legend's entries are switches.

**Its size.** The chart is as wide as it is given room. A height on its modifier is the whole chart's, the legend's with it; given none, it is as tall as the chart's style says and a legend above or under it adds its own. The pie is the largest that has room in what the legend leaves, in the middle of it: of a half pie, the half that is drawn. Where its labels are written outside it, it keeps room for them at its sides, and where that room would leave it less than half as large, it writes on its slices only.

The pie turns the same way in a language read from the right; its legend and its tooltip follow the reading direction.

```kotlin
PantrixPieChart(
    slices = listOf(
        PieSlice("direct", "Direct", 420),
        PieSlice("search", "Search", 310),
        PieSlice("social", "Social", 150)
    ),
    hole = 0.6f,
    description = "Visits by where they came from",
    tagKey = "sources"
)
```

Parameters:

- `slices: List<PieSlice>`: the slices, in the order they lie in the pie where `sort` keeps it, clockwise from `startAngle`. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `hole: Float`: how much of the pie's radius is cut out of its middle: nought for a whole pie, and six tenths for a ring with room to write in. No more than nine tenths.
- `center: (@Composable () -> Unit)?`: what stands in the hole of a ring: a total, a title. It has the largest box the hole holds, of a half ring in the half that is drawn. A whole pie has no place for it.
- `labels: ChartDataLabels?`: what is written about the slices: each slice's share of the whole, or its value as the labels' `format` writes it. On a slice it is written in black or white, whichever reads on the slice; outside it, the slice's name comes before it, with a line in the slice's colour leading to it. Their `position` says where: `Outside` outside every slice, `Auto` on each slice that holds its words and outside the others, and any other on the slices only, where a slice too small to hold its words has none. Words outside stand in a column at each side; where a side has no room for all of them, one under another, the smallest slices there have none. `null` writes nothing about them.
- `legend: ChartLegend?`: where the names of the slices stand. `null` shows none.
- `tooltip: ChartTooltip?`: what is shown for the slice that is pointed at: its value, as the tooltip's `format` writes it or in the theme's language, and its share of the whole. `null` shows none. Whether a tooltip is `shared` and whether it has a `crosshair` say nothing to a pie.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader has hidden and what they point at: the chart's own where none is given. A slice is hidden by its key, and pointed at by a selection whose `x` is its key.
- `description: String?`: what the pie shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its slices.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the slice that is pressed: its key as the point's `series` and its `x`, its name, its value, and what the pie writes for it.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `PieChart_<tagKey>`, the pie `PieChart_<tagKey>.Plot`, a slice `PieChart_<tagKey>.Slice_<number>` counted from one, the legend's entry of a slice `PieChart_<tagKey>.Legend_<slice's key>` and the tooltip `PieChart_<tagKey>.Tooltip`. A press on a slice is reported as a `PieChart` `select` event with the slice's key, and a press on a legend's entry as a `toggle` event with the key and whether the slice is shown. Nothing of the values is reported.
- `startAngle: Float`: where the first slice begins, in degrees clockwise from twelve o'clock: 270 begins at nine o'clock.
- `sweepAngle: Float`: how many degrees the slices take together: a whole turn, 360, or 180 for a half pie, from over nought up to a whole turn.
- `sort: PieSort`: the order the slices lie in: as given, the largest first or the smallest first.
- `others: PieOthers?`: how the smallest slices are gathered into one. `null` gathers none.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button. What stands in the hole, `center`, is not in the file.

### PieSlice

`import com.pantrixui.components.chart.pie.PieSlice`, from `com.pantrixui:components`

```kotlin
class PieSlice(
    public val key: String,
    public val name: String,
    public val value: Number?,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

A slice of a `PantrixPieChart`: one of the parts of the whole the pie shows.

```kotlin
PieSlice("search", "Search", 310)
```

Two are the same slice where everything they were built from is the same; a whole number and the same number with a fraction of nought are one value.

Parameters:

- `key: String`: What tells the slice from the others of its pie, and stays the same while its value changes: what the legend keeps a hidden slice by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the slice is called: in the legend, in the tooltip and to a screen reader.
- `value: Number?`: How much the slice is of the whole. A slice whose value is no number, or is not over nought, has no part of the pie: a share of a whole is no less than nothing.
- `color: Color`: The colour the slice is drawn in. Left out, it is the theme's chart colour for its place among the slices of the pie: the first of them for the first.
- `pattern: ChartPattern?`: The texture the slice is drawn with besides its colour. Left out, none, and where the chart's patterns are on (`ChartStyle.patterns`), its turn by its place among the slices: none for the first.

### PieSort

`import com.pantrixui.components.chart.pie.PieSort`, from `com.pantrixui:components`

```kotlin
enum class PieSort
```

The order a pie's slices lie in, from where they begin.

Entries:

- `Given`: As they are given.
- `Descending`: The largest first.
- `Ascending`: The smallest first.

### PieOthers

`import com.pantrixui.components.chart.pie.PieOthers`, from `com.pantrixui:components`

```kotlin
class PieOthers(
    public val share: Float = 0.03f,
    public val name: String? = null,
    public val color: Color = Color.Unspecified
)
```

How a pie gathers its smallest slices into one, so that a crowd of slivers is read as one slice: every slice that is less of the whole than `share` goes into a slice after all the others, which the tooltip and a screen reader open into the slices it holds. A single slice that small keeps its own place.

```kotlin
PieOthers(share = 0.05f)
```

The gathered slice's key is `others`: a pie that gathers keeps that key for it, and refuses a slice of its own with it. Its legend's entry takes the gathered slices out together.

Parameters:

- `share: Float`: How much of the whole a slice is at the least to stand on its own: three hundredths, and from nought, where none is gathered, to one.
- `name: String?`: What the gathered slice is called. Left out, it is the theme's word for it (`PantrixStrings.others`, "Other").
- `color: Color`: The gathered slice's colour. Left out, it is the theme's chart colour for its place: the last.

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
