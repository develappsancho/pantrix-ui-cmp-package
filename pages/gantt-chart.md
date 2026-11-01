# Gantt Chart

A chart that shows the tasks of a plan: each task in a row, a bar from the moment it starts to the moment it ends. It shows what runs when, what overlaps, and how much of each task is done.

- `PantrixGanttChart` (`com.pantrixui.components.chart.gantt`, `com.pantrixui:components`): The tasks of a plan, a row each, every one a bar from the moment it starts to the moment it ends along one axis of time, with how much of it is done, milestones, a line at today, a tooltip for the task pointed at and every task reachable by keys and by a screen reader. Keywords: timeline, schedule, project plan, roadmap, tasks.

## Features

- **Tasks.** The chart takes its tasks (`GanttTask`) in the order of their rows; each task has a key, a name, and the moments it starts and ends. Moments are `kotlin.time.Instant`: no date library is needed.
- **Time.** Time runs along the chart, from the start of the first task to the end of the last. Its axis is marked at round moments (day, week, month), as many as have room, and at each mark a line goes up through the rows. Moments are read by the device's clock and written in the theme's language, unless `time` (`ChartTime`) says otherwise.
- **Progress.** A task that gives `progress` has that much of its bar in full colour and the rest faint.
- **Milestone.** A task that ends when it starts is a moment, and is drawn as a diamond.
- **Today.** Where `today` is given and lies in the chart's time, a line runs over the bars at it and "Today" is written on a line of its own over the rows. The chart has no clock of its own: the moment it is read at is the caller's to give.
- **Groups.** Tasks that give a `group` gather under a row of the group's own: the group's bar runs from the start of its first task to the end of its last, with its ends pointing down; the tasks' names stand a little in from the group's. The group's name is the heading of its tasks' tooltip, and a screen reader says it too.
- **Rows.** Tasks that give the same `row` share a row, side by side in time, and the row is called by that name: a person's work in a row of their own. Tasks whose times overlap stand one under another in the row, and the row grows by a row's height for each. Within the row the pointer goes to the task it is over; the tasks share the row halfway between them.
- **Rings.** Tasks that follow one another cannot close a ring: a task that follows a task that follows it is refused.
- **Dependencies.** `after` holds the keys of the tasks a task follows: from where each ends to where this one starts an arrow is drawn, turning at right angles; where the task starts too soon the arrow goes round below or above. A key the chart does not have, or the task's own, is refused.
- **Weekends.** `weekends = true` shades the Saturdays and Sundays faint by the chart's clock; where a day is narrower than two pixels it shades none.
- **Names.** The tasks' names stand in a column at the start of the rows, no wider than two fifths of the chart; a name that does not fit is cut short with three dots. `names = false` takes the column away.
- **The task pointed at.** The bar of the task whose row the pointer or the finger is in is ringed, and the tooltip writes its name, the moments it starts and ends and, where it is said, how much of it is done. With the keyboard the arrows up and down go from task to task.
- **Size.** Given no height, the chart is as tall as its rows need, group headers among them: thirty-two dp a row, and one more over them where "Today" is written.
- **Screen reader.** First the chart's description, then where the today line is drawn "Today" and its day, then each task in the tasks' order: its group and row where it has them, its name, its start, its end and its progress.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Zoom.** With `zoom` a part of the time is shown as wide as the chart: a wheel (with Ctrl or Command), two fingers, the plus and minus keys and the buttons look closer; a drag and the buttons move along the time.
- **Automation.** The chart is tagged `Gantt_<tagKey>` and a task `Gantt_<tagKey>.Task_<number>`. A press on a task is reported as a `select` event with the task's key.

## Usage

### The plan of a release

```kotlin
PantrixGanttChart(
    tasks = plan.steps.map { step ->
        GanttTask(step.id, step.name, start = step.start, end = step.end, progress = step.done)
    },
    today = now,
    description = stringResource(Res.string.release_plan),
    tagKey = "release"
)
```

### Days of UTC, a milestone, and a task that is pressed

```kotlin
PantrixGanttChart(
    tasks = steps.map { GanttTask(it.id, it.name, it.start, it.end) } +
        GanttTask("launch", stringResource(Res.string.launch), start = launch, end = launch, color = brand.accent),
    time = ChartTime(offset = { Duration.ZERO }),
    onSelect = { task -> openStep(task.series) },
    tagKey = "plan"
)
```

## Examples

### The plan of a release

The plan of a release: four tasks and two milestones. The tasks that are finished are in full colour; of those under way the part that is done is in full colour and the rest faint. The upright line shows today (`today`): what is to its left is past.

Move the pointer over a row, or touch the row: the bar is ringed and the tooltip writes the task's start, its end and how far it is. The days are days of UTC, so the chart is read by UTC too (the `offset` of `ChartTime`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    description = "The plan of the spring release: from research to release",
    tagKey = "plain"
)

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Research", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Design", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Development", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Testing", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Release candidate", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Release", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Your own colours and rows with no names

Each task can carry a colour of its own (the `color` field of `GanttTask`): here the design work is in one colour, the software work in another and the milestones in a third. Turn the switch: the names' column goes away (`names = false`) and the bars take the whole width; the names stay in the tooltip and for a screen reader.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration
import kotlin.time.Instant

var named by remember { mutableStateOf(true) }
val theme = PantrixTheme.colors
val design = setOf("research", "design")
PantrixSwitchButton(
    checked = named,
    onCheckedChange = { named = it },
    label = "Task names",
    tagKey = "gantt_names"
)
PantrixGanttChart(
    tasks = RELEASE_PLAN.map { task ->
        val color = when {
            task.start == task.end -> theme.warning.color
            task.key in design -> theme.info.color
            else -> theme.success.color
        }
        GanttTask(task.key, task.name, task.start, task.end, task.progress, color)
    },
    time = ChartTime(offset = { Duration.ZERO }),
    names = named,
    description = "The plan of the spring release, in the teams' colours",
    tagKey = "own_colors"
)

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Research", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Design", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Development", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Testing", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Release candidate", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Release", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### The hours of a day

The hours of a day: the steps of a release day. Since the moments are within one day the axis is marked at hours, and the tooltip writes the start and the end with their time of day. On a narrow screen the second task's name has no room in its column and is cut short with three dots; the tooltip writes it whole.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = RELEASE_DAY,
    time = ChartTime(offset = { Duration.ZERO }),
    today = hourAt("11:20"),
    description = "The steps of the release day, hour by hour",
    tagKey = "hours"
)

private val RELEASE_DAY = listOf(
    GanttTask("freeze", "Code freeze", start = hourAt("08:00"), end = hourAt("09:00"), progress = 1f),
    GanttTask(
        key = "checks",
        name = "Final checks, approvals and release notes",
        start = hourAt("09:00"),
        end = hourAt("11:30"),
        progress = 0.9f
    ),
    GanttTask("rollout", "Staged rollout", start = hourAt("11:30"), end = hourAt("15:00")),
    GanttTask("watch", "Monitoring", start = hourAt("11:30"), end = hourAt("18:00")),
    GanttTask("done", "Done", start = hourAt("18:00"), end = hourAt("18:00"))
)

private fun hourAt(time: String): Instant = Instant.parse("2026-05-04T$time:00Z")
```

### Pressing a task

A press is handed the task: its key is in its `series`, its name in its `name`, how many days it takes in its `value`, and what the chart writes in its `text`. Press a row: the line below writes what was pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration
import kotlin.time.Instant

var pressed by remember { mutableStateOf<String?>(null) }
val strings = PantrixTheme.strings
PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    onSelect = { pressed = "${it.name}: ${strings.decimal(it.value)} days" },
    description = "The plan of the spring release",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Press a task")

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Research", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Design", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Development", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Testing", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Release candidate", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Release", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Groups and dependencies

The tasks in their teams' groups (`group`): each group has a row of its own and a bar that sums its tasks up from start to end. The arrows show which task follows which (`after`): Development starts once Design ends. Testing starts before Development ends, so its arrow goes round below.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = GROUPED_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    description = "The plan of the spring release, by team",
    tagKey = "groups"
)

private val GROUPED_PLAN = listOf(
    GanttTask("research", "Research", dayAt("03-02"), dayAt("03-14"), progress = 1f, group = "Product"),
    GanttTask(
        key = "design",
        name = "Design",
        start = dayAt("03-16"),
        end = dayAt("03-28"),
        progress = 1f,
        after = listOf("research"),
        group = "Product"
    ),
    GanttTask(
        key = "build",
        name = "Development",
        start = dayAt("03-30"),
        end = dayAt("04-25"),
        progress = 0.55f,
        after = listOf("design"),
        group = "Software"
    ),
    GanttTask(
        key = "test",
        name = "Testing",
        start = dayAt("04-13"),
        end = dayAt("05-02"),
        progress = 0.1f,
        after = listOf("build"),
        group = "Software"
    ),
    GanttTask("release", "Release", dayAt("05-04"), dayAt("05-04"), after = listOf("test"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### People's rows and weekends

People's rows (`row`): each person's tasks in a row of their own, side by side. Ada's hotfix falls on the same days as the profile, so it stands under it in her row. The weekends are faint (`weekends`). Move the pointer along a row: the task it is over is shown.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = SPRINT,
    time = ChartTime(offset = { Duration.ZERO }),
    description = "Who does what in a two-week sprint",
    tagKey = "rows",
    weekends = true
)

private val SPRINT = listOf(
    GanttTask("login", "Sign-in screen", dayAt("03-02"), dayAt("03-05"), progress = 1f, row = "Ada"),
    GanttTask("profile", "Profile", dayAt("03-05"), dayAt("03-11"), progress = 0.5f, row = "Ada"),
    GanttTask("hotfix", "Hotfix", dayAt("03-06"), dayAt("03-10"), progress = 0.3f, row = "Ada"),
    GanttTask("api", "API", dayAt("03-02"), dayAt("03-07"), progress = 1f, row = "Lin"),
    GanttTask("sync", "Sync", dayAt("03-09"), dayAt("03-14"), after = listOf("api"), row = "Lin"),
    GanttTask("review", "Review", dayAt("03-11"), dayAt("03-14"), after = listOf("profile"), row = "Can"),
    GanttTask("demo", "Demo", dayAt("03-16"), dayAt("03-16"), after = listOf("review", "sync"), row = "Can")
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the rows, the bars, the marks of time and the line of today with its name.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    description = "The plan of the spring release: from research to release",
    tagKey = "exported",
    export = ChartExport(fileName = "spring-release") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Research", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Design", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Development", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Testing", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Release candidate", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Release", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

### Looking closer at the time

`zoom = ChartZoom()` lets the reader look closer at the time: a wheel with Ctrl or Command, two fingers, plus and minus on the chart, and the buttons over it show a part of the time as wide as the chart. A drag of the mouse and the buttons move along it; the task the arrows go to comes into view.

What lies past the part in view is cut off at the time's two ends, and the names stay. The part is kept in the state (`state.window`): this chart opens on the first half of the plan, and nought or the last button shows all of it again.

```kotlin
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

val state = rememberChartState()
// The chart opens on the first half of the plan.
LaunchedEffect(state) { state.zoomTo(start = 0f, end = 0.5f) }
PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    state = state,
    description = "The plan of the spring release: from research to release",
    tagKey = "zoomed",
    zoom = ChartZoom()
)

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Research", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Design", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Development", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Testing", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Release candidate", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Release", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

## API

### PantrixGanttChart

`import com.pantrixui.components.chart.gantt.PantrixGanttChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixGanttChart(
    tasks: List<GanttTask>,
    modifier: Modifier = Modifier,
    time: ChartTime? = null,
    today: Instant? = null,
    names: Boolean = true,
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    weekends: Boolean = false,
    export: ChartExport? = null,
    zoom: ChartZoom? = null
)
```

A Gantt chart: the tasks of a plan, a row each, every one a bar from the moment it starts to the moment it ends along one axis of time. It shows what runs when, what overlaps, and how far each task is.

The chart is given its `tasks`, in the order of their rows. Time runs from the start of the first task to the end of the last, along the chart, and its axis is marked at round moments, days, weeks, months, as many as have room, with a line up the rows at each. The tasks' names stand in a column where lines start, no wider than two fifths of the chart; a name too long for it is cut short, and the tooltip and a screen reader have it whole.

A task that says how much of it is done has that much of its bar in full colour and the rest fainter. A task that ends when it starts is a milestone, a diamond at its moment. Where `today` is given and lies in the chart's time, a line is drawn over the bars at it, what is to its left is past, and the word for today is written over it, on a line of its own over the rows.

**Groups, rows and what follows what.** Tasks that name a `group` stand together under a row of the group's own, whose bar runs from the earliest of them to the latest, with a point down at each end; their names stand a gap in from the group's. Tasks that name a `row` share it, side by side along its time, and the row is called by that name: a person's tasks in a lane of their own; those whose times overlap stand one under another. A task that names others in `after` follows them: an arrow leads from where each ends to where it starts, turning at a right angle, and round below or above where it starts too soon. With `weekends` the Saturdays and Sundays are shaded faint under all, where a day is wide enough to show.

Moments are read by the screen's clock (`LocalPantrixClock`) and written in the theme's language, unless `time` says otherwise: see `ChartTime`. The chart takes no clock of its own: the moment it is read at is the caller's to give.

**Pointing at a task.** A pointer over a task's row points at it, its name's part of the row too; a finger does by a tap, and a tap on the task it points at lets go of it. With the keyboard the chart is one stop for Tab: the arrows up and down go from task to task, Home and End to the first and the last, and Escape lets go. The task's bar is ringed, the tooltip shown for it, and it is told to `state`, as a selection whose `x` is the task's key. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, and where the line at `today` is drawn, the word for today and its day; then each task with its group and its row where it has them, its name, when it starts and ends, and how much of it is done, in the order of the tasks.

**Its size.** The chart is as wide as it is given room, and as tall as its modifier says; given no height, it is as tall as its rows need: thirty-two dp a lane, a group's header among them, under them a line of writing for the marks of time, and over them one for the word for today where it is written.

```kotlin
PantrixGanttChart(
    tasks = listOf(
        GanttTask("design", "Design", start = monday, end = monday + 5.days, progress = 1f),
        GanttTask("build", "Build", start = monday + 5.days, end = monday + 19.days, progress = 0.4f),
        GanttTask("launch", "Launch", start = monday + 21.days, end = monday + 21.days)
    ),
    today = now,
    description = "The plan of the spring release",
    tagKey = "release"
)
```

Parameters:

- `tasks: List<GanttTask>`: the tasks, in the order of their rows. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's.
- `time: ChartTime?`: how the chart's moments are written and by which clock. Left out, in the theme's language and by the screen's clock (`LocalPantrixClock`).
- `today: Instant?`: the moment the chart is read at: a line is drawn at it where it lies between the start of the first task and the end of the last. `null` draws none.
- `names: Boolean`: whether the tasks' names are written beside their rows. Without them the bars have the whole width, and the names stay in the tooltip and for a screen reader.
- `tooltip: ChartTooltip?`: what is shown for the task that is pointed at: its group and its row as the heading, where it has them, and under it its name, when it starts and ends, and how much of it is done. A task has no place to share and no line through it: `shared`, `crosshair` and `format` are not read. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its tasks.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the task that is pressed: its key is its `series` and its `x`, its name its `name` and its `label`, its `value` how many days it takes, and its `text` when it starts and ends as the chart writes it.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest. A bar's corners are as round as `barRadius` says, and the lines at the marks of time as wide as `gridWidth`.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `Gantt_<tagKey>`, its rows together `Gantt_<tagKey>.Plot`, a task `Gantt_<tagKey>.Task_<number>`, counted from one, and the tooltip `Gantt_<tagKey>.Tooltip`. A press on a task is reported as a `Gantt` `select` event with the task's key. Nothing of its moments is reported.
- `weekends: Boolean`: whether the Saturdays and Sundays of the chart's time, by its clock, are shaded. None are where a day is narrower than two pixels.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the chart's time, as a chart with axes is looked at closer along its places (see `ChartZoom`): a wheel with Ctrl or Command, two fingers, plus and minus on the chart, and its buttons bring a part of the time into view, as wide as the chart; a drag of the mouse and the buttons move along it, and the arrows bring the task they go to into view. What lies past the part in view is cut off at the time's two ends; the names stay. The part is kept in `state`, as its `window`. A Gantt chart has no navigator: its `navigator` is not read, nor is its `fitValues`. `null`, the chart shows all its time.

### GanttTask

`import com.pantrixui.components.chart.gantt.GanttTask`, from `com.pantrixui:components`

```kotlin
class GanttTask(
    public val key: String,
    public val name: String,
    public val start: Instant,
    public val end: Instant,
    public val progress: Float? = null,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null,
    public val after: List<String> = emptyList(),
    public val group: String? = null,
    public val row: String? = null
)
```

One task of a `PantrixGanttChart`: something that takes from a moment to another, and how much of it is done.

```kotlin
GanttTask("design", "Design", start = kickoff, end = kickoff + 14.days, progress = 0.6f)
```

Parameters:

- `key: String`: What tells the task from the others of its chart, and stays the same while its moments change: what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the task is called: beside its row, in the tooltip and to a screen reader.
- `start: Instant`: The moment the task starts.
- `end: Instant`: The moment it ends: for a task that takes the whole of its last day, the midnight after it. A task that ends when it starts is a moment, a milestone, and is drawn as a diamond. One that ends before it starts is taken the other way about.
- `progress: Float?`: How much of the task is done, from nought to one: that much of its bar, from where it starts, is drawn in full colour and the rest fainter. Left out, the whole bar is in full colour and nothing is said of how far the task is.
- `color: Color`: The colour the task is drawn in. Left out, it is the first of the chart's colours: the tasks of a chart are one series, and a colour of its own is what sets a task or a group of them apart.
- `pattern: ChartPattern?`: The texture the task is drawn with besides its colour. Left out, none, and where the chart's patterns are on (`ChartStyle.patterns`), the turn of its colour among the colours of the chart's tasks, in the order they first come: a group set apart by a colour is set apart by a texture too, and the first colour has none.
- `after: List<String>`: The keys of the tasks this one follows: each is drawn with an arrow from where it ends to where this one starts. A key the chart has no task for, or the task's own, is refused, and so are tasks that follow one another round: a task that follows one that follows it.
- `group: String?`: The name of the group the task lies in. The tasks that name the same group stand together under a row of the group's own, in the place of the first of them, with a bar from the start of the earliest of them to the end of the latest. Null, the task is in no group.
- `row: String?`: The name of the row the task stands in. The tasks that name the same row share it, side by side along its time, and the row is called by it: a person's tasks in a row of their own. Those whose times overlap stand one under another in it, and the row is as tall as a row for each. Null, the task has a row of its own, called by the task's name.

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
