# Status Tracker

A run of steps as a row of blocks: each block in the colour of what was the case at that step. The days a service was up, the builds that passed: where the bad ones are is seen at a glance, and which they are is read by going over them.

Each `StatusBlock` is a name and a colour. The blocks are set side by side from the start of the line, each with an even share of the width. A block that is given no colour is drawn in the colour of the chart's grid: a step of which nothing is known.

- `PantrixStatusTracker` (`com.pantrixui.components.chart.statustracker`, `com.pantrixui:components`): A run of steps as a row of coloured blocks, with the name of the block that is pointed at written under it, reachable by keys and by a screen reader. Keywords: uptime, status bar, health history, timeline blocks, incident history.

## Features

- **The block pointed at.** The name of the block under the pointer, or of the one that is touched, is written under the row beside its colour; the others are drawn faint. With a finger, another touch on the block that is pointed at lets go of it.
- **The line under the row.** With `caption` off the name is not written. The line's room is kept whether a block is pointed at or not: the row does not move.
- **Keyboard.** The row is one stop for Tab: the arrows go from block to block and stop at the ends, Home and End go to the first and the last block, Escape lets go, Enter and Space press the block that is pointed at.
- **Pressing.** `onSelect` gives the place of the block that is pressed, counted from nought.
- **State.** The block that is pointed at is kept in `ChartState`, as a selection whose `x` is the block's place.
- **Screen reader.** The row says its `description`, then each block by its name. A row of more than two hundred blocks is told by its description alone.
- **Direction.** In a language read from right to left the first block stands at the right, and the arrows go the way they point.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `StatusTracker_<tagKey>`; the row `.Blocks`, the blocks `.Block_<number>`, the line under the row `.Caption`.

## Usage

### The days a service was up

```kotlin
PantrixStatusTracker(
    blocks = days.map { StatusBlock(it.summary, colorOf(it.status)) },
    description = stringResource(Res.string.uptime_last_thirty_days),
    tagKey = "uptime"
)
```

### Opening a step when its block is pressed

```kotlin
PantrixStatusTracker(
    blocks = builds.map { StatusBlock(it.title, colorOf(it.result)) },
    caption = false,
    onSelect = { openBuild(builds[it]) },
    tagKey = "builds"
)
```

## Examples

### The days of a service

The last thirty days of a service: up on the green days, slow on the yellow ones, down on the red one; the grey day has no record.

Move the pointer over a block, or touch it: the day's name is written under the row and the other days fade. On the keyboard the arrows go from day to day.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

PantrixStatusTracker(
    blocks = uptimeDays(),
    description = "Status of the last thirty days",
    tagKey = "plain"
)

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "Day ${index + 1}"
        when (index) {
            7, 21 -> StatusBlock("$day: Slow", colors.warning.color)
            13 -> StatusBlock("$day: Outage", colors.danger.color)
            26 -> StatusBlock("$day: No record")
            else -> StatusBlock("$day: No problems", colors.success.color)
        }
    }
}
```

### Pressing a block

`onSelect` gives the place of the block that is pressed: press a day, or go to one with the keyboard and press Enter, and the line under the card writes what was pressed. The line of the name under the row is off here (`caption = false`).

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val days = uptimeDays()
PantrixStatusTracker(
    blocks = days,
    caption = false,
    description = "Status of the last thirty days",
    onSelect = { report(days[it].name) },
    tagKey = "pressed"
)

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "Day ${index + 1}"
        when (index) {
            7, 21 -> StatusBlock("$day: Slow", colors.warning.color)
            13 -> StatusBlock("$day: Outage", colors.danger.color)
            26 -> StatusBlock("$day: No record")
            else -> StatusBlock("$day: No problems", colors.success.color)
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Your own sizes

A row's own sizes: taller blocks (`trackerHeight`), wider gaps between them (`barGap`) and sharp corners (`barRadius`). A field that is not given stays the theme's.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

PantrixStatusTracker(
    blocks = uptimeDays().take(14),
    description = "Status of the last two weeks",
    style = ChartStyle(trackerHeight = 48.dp, barGap = 6.dp, barRadius = 0.dp),
    tagKey = "own_look"
)

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "Day ${index + 1}"
        when (index) {
            7, 21 -> StatusBlock("$day: Slow", colors.warning.color)
            13 -> StatusBlock("$day: Outage", colors.danger.color)
            26 -> StatusBlock("$day: No record")
            else -> StatusBlock("$day: No problems", colors.success.color)
        }
    }
}
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the row of blocks; the line under it, which names the block that is pointed at, is not in it.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixStatusTracker(
    blocks = uptimeDays(),
    description = "Status of the last thirty days",
    tagKey = "exported",
    export = ChartExport(fileName = "last-thirty-days") { file = it }
)
ExportedFile(file, tagKey = "exported")

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "Day ${index + 1}"
        when (index) {
            7, 21 -> StatusBlock("$day: Slow", colors.warning.color)
            13 -> StatusBlock("$day: Outage", colors.danger.color)
            26 -> StatusBlock("$day: No record")
            else -> StatusBlock("$day: No problems", colors.success.color)
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixStatusTracker

`import com.pantrixui.components.chart.statustracker.PantrixStatusTracker`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixStatusTracker(
    blocks: List<StatusBlock>,
    modifier: Modifier = Modifier,
    caption: Boolean = true,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((Int) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

A status tracker: a run of steps as a row of blocks, each in the colour of what was the case at it. The days a service was up, the builds that passed: where the bad ones are is seen at a glance, and which they were is read by pointing at them.

The `blocks` stand side by side from where lines start, each as wide as an even share of the row. The name of the block that is pointed at is written under the row, beside a patch of its colour, unless `caption` says otherwise; with a block pointed at, the others are drawn faint.

**Pointing at a block.** A pointer over a block points at it; a finger does by a tap, and a tap on the block it points at lets go of it. With the keyboard the row is one stop for Tab: the arrows go from block to block, Home and End to the first and the last, and Escape lets go. The block is told to `state`, as a selection whose `x` is its place counted from nought. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the row is its `description`, then each block by its name, in the blocks' order. A row of more than two hundred blocks is told by its description alone.

In a language read from the right the first block stands at the right, and the arrows go the way they point.

```kotlin
PantrixStatusTracker(
    blocks = days.map { StatusBlock("${it.date}: ${it.status}", colorOf(it.status)) },
    description = "Uptime, last thirty days",
    tagKey = "uptime"
)
```

Parameters:

- `blocks: List<StatusBlock>`: the blocks, in the order they are read.
- `modifier: Modifier`: the tracker's modifier.
- `caption: Boolean`: whether the name of the block that is pointed at is written under the row. The line's room is kept whether a block is pointed at or not, so that the row does not move.
- `state: ChartState`: what the reader points at: the tracker's own where none is given.
- `description: String?`: what the row shows, in a few words, for a screen reader.
- `onSelect: ((Int) -> Unit)?`: called with the place of the block that is pressed, counted from nought.
- `style: ChartStyle?`: this tracker's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this tracker's own colours, where they are not the theme's.
- `tagKey: String?`: the tracker's automation key: the tracker is `StatusTracker_<tagKey>`, its row `StatusTracker_<tagKey>.Blocks`, a block `StatusTracker_<tagKey>.Block_<number>` counted from one and the line under the row `StatusTracker_<tagKey>.Caption`. A press on a block is reported as a `StatusTracker` `select` event with the block's number. Nothing of the names is reported.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button. The line under the row is not in it.

### StatusBlock

`import com.pantrixui.components.chart.statustracker.StatusBlock`, from `com.pantrixui:components`

```kotlin
class StatusBlock(
    public val name: String,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

One block of a `PantrixStatusTracker`: what was the case at one step of a run, as a colour and a few words.

```kotlin
StatusBlock("12 October: operational", color = PantrixTheme.colors.success.color)
```

Two are the same block where their names and their colours are.

Parameters:

- `name: String`: What the block stands for, in words: its step and what was the case at it. Written under the row when the block is pointed at, and said to a screen reader.
- `color: Color`: The colour of the block. Left out, the block is in the colour of a chart's grid: a step of which nothing is known.
- `pattern: ChartPattern?`: The texture the block is drawn with besides its colour. Left out, none, and where the tracker's patterns are on (`ChartStyle.patterns`), the turn of its colour among the row's colours, in the order they first come: a status is one texture, as it is one colour, and the first status none.

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
