# Funnel Chart

A chart that shows the stages of a way that fewer and fewer get through: the stages stand one under another, each as wide as the number that reached it. It shows where the others were lost: of those who visited, those who signed up; of those, the ones who tried; of those, the ones who paid.

- `PantrixFunnelChart` (`com.pantrixui.components.chart.funnel`, `com.pantrixui:components`): The stages of something that fewer and fewer get through, one under another, each as wide as the number that reached it, with its share of the first, a tooltip for the stage pointed at and every stage reachable by keys and by a screen reader. Keywords: conversion, sales funnel, pipeline, drop off, stages.

## Features

- **Shape.** The largest stage is as wide as the chart; each stage narrows to the width of the one after it, and the stages make one funnel. The last keeps its width. A stage larger than the one before it does not narrow but widens: the chart draws what it is given. `shape = FunnelShape.Bars` draws each stage as a bar as wide as its value; `horizontal` lays the stages side by side from where lines start, each as tall as its value.
- **Words.** A stage's name and value are written in it; beside the value stands its share: of the first stage, of the one before, or both (`rate`). A stage too narrow for its words has its name and value beside it, under it in a horizontal funnel; where there is room for neither, only the name is left. `labels = null` writes nothing.
- **The stage pointed at.** The stage whose row the pointer or a finger is on is ringed, and the tooltip writes its name, its value and its share. On the keyboard the arrows go from stage to stage: up and down, right and left in a horizontal funnel.
- **Colours.** Each stage takes one of the theme's chart colours, by its place; the `color` field of `FunnelStage` gives a stage its own.
- **Screen reader.** First the chart's description, then each stage in its order: its name, its value and its shares. A share of the first stage written alone is read bare; otherwise each share is read with what it is a share of.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** The chart is tagged `Funnel_<tagKey>`, and a stage `Funnel_<tagKey>.Stage_<number>`. A press on a stage is reported as a `select` event with the stage's key.

## Usage

### From a visit to a payment

```kotlin
PantrixFunnelChart(
    stages = listOf(
        FunnelStage("visits", stringResource(Res.string.visits), report.visits),
        FunnelStage("signups", stringResource(Res.string.signups), report.signups),
        FunnelStage("trials", stringResource(Res.string.trials), report.trials),
        FunnelStage("paid", stringResource(Res.string.paid), report.paid)
    ),
    description = stringResource(Res.string.sales_funnel),
    tagKey = "sales"
)
```

### Values written short, and a stage that is pressed

```kotlin
val strings = PantrixTheme.strings
PantrixFunnelChart(
    stages = steps.map { FunnelStage(it.id, it.name, it.count) },
    labels = ChartDataLabels(format = { strings.compact(it) }),
    onSelect = { stage -> openStep(stage.series) },
    tagKey = "checkout"
)
```

## Examples

### From a visit to a payment

At its plainest: the stages, given in their order. Each stage has a key, a name and a value.

Move the pointer over a stage's row, or touch the stage: the stage is ringed and the tooltip writes its value, with its share of the first stage.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart

PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    description = "The stages a visit goes through until it comes to a payment",
    tagKey = "plain"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Visits", 3000),
    FunnelStage("signups", "Sign-ups", 1240),
    FunnelStage("trials", "Trials", 520),
    FunnelStage("paid", "Paid", 310)
)
```

### Shape and direction

The stages' shape and direction. "Bars" draws each stage as a bar as wide as its value (`shape = FunnelShape.Bars`); turn the switch: the stages stand side by side (`horizontal = true`), each as tall as its value. The arrows on the keyboard then go right and left.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelShape
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var shape by remember { mutableStateOf(FunnelShape.Funnel) }
var horizontal by remember { mutableStateOf(false) }
PantrixSegmentButton(
    options = FUNNEL_SHAPES,
    selected = shape,
    onSelect = { shape = it },
    fullWidth = false,
    tagKey = "funnel_shape"
)
PantrixSwitchButton(
    checked = horizontal,
    onCheckedChange = { horizontal = it },
    label = "Horizontal",
    tagKey = "funnel_horizontal"
)
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    shape = shape,
    horizontal = horizontal,
    description = "The stages a visit goes through until it comes to a payment",
    tagKey = "shape"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Visits", 3000),
    FunnelStage("signups", "Sign-ups", 1240),
    FunnelStage("trials", "Trials", 520),
    FunnelStage("paid", "Paid", 310)
)

private val FUNNEL_SHAPES = listOf(
    SegmentOption(value = FunnelShape.Funnel, label = "Funnel", tagKey = "funnel"),
    SegmentOption(value = FunnelShape.Bars, label = "Bars", tagKey = "bars")
)
```

### Conversion rates

Conversion rates (`rate`). "Of the first" writes each stage's share of the first stage, "Of the previous" how many of those who reached the stage before went on to this one, "Both" the two together. On the stage the shares stand bare, two of them apart by a dot; the tooltip and a screen reader say what each share is of.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelRate
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var rate by remember { mutableStateOf(FunnelRate.Previous) }
PantrixSegmentButton(
    options = FUNNEL_RATES,
    selected = rate,
    onSelect = { rate = it },
    fullWidth = false,
    tagKey = "funnel_rate"
)
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    rate = rate,
    description = "The stages of a visit up to a payment, with conversion rates",
    tagKey = "rates"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Visits", 3000),
    FunnelStage("signups", "Sign-ups", 1240),
    FunnelStage("trials", "Trials", 520),
    FunnelStage("paid", "Paid", 310)
)

private val FUNNEL_RATES = listOf(
    SegmentOption(value = FunnelRate.First, label = "Of the first", tagKey = "first"),
    SegmentOption(value = FunnelRate.Previous, label = "Of the previous", tagKey = "previous"),
    SegmentOption(value = FunnelRate.Both, label = "Both", tagKey = "both")
)
```

### Values written short

Large numbers are written short (the `format` of `ChartDataLabels`): they leave room in the stages. Turn the switch: the words go away (`labels = null`) and the values stay in the tooltip and for the screen reader alone.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var written by remember { mutableStateOf(true) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = written,
    onCheckedChange = { written = it },
    label = "Words",
    tagKey = "funnel_labels"
)
PantrixFunnelChart(
    stages = CAMPAIGN_STEPS,
    labels = if (written) ChartDataLabels(format = { strings.compact(it) }) else null,
    description = "The stages of a campaign, from being shown to a sale",
    tagKey = "labels"
)

private val CAMPAIGN_STEPS = listOf(
    FunnelStage("shown", "Shown", 1_250_000),
    FunnelStage("clicks", "Clicks", 410_000),
    FunnelStage("carts", "Carts", 96_000),
    FunnelStage("orders", "Orders", 38_500),
    FunnelStage("repeat", "Bought again", 9_200)
)
```

### Pressing a stage

A press is handed the stage: its key is in its `series`, its name in its `name`, its value in its `value`, and what the chart writes in its `text`. Press a stage: the line below writes what was pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.text.PantrixText

var pressed by remember { mutableStateOf<String?>(null) }
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    onSelect = { pressed = "${it.name}: ${it.text}" },
    description = "The stages a visit goes through until it comes to a payment",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Press a stage")

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Visits", 3000),
    FunnelStage("signups", "Sign-ups", 1240),
    FunnelStage("trials", "Trials", 520),
    FunnelStage("paid", "Paid", 310)
)
```

### A stage that widens

A stage can be larger than the one before it: more people called than leads that came in. The chart changes neither the order nor the number; that stage widens instead of narrowing, and its share goes over a hundred per cent.

The last stage is too narrow for its words, so its name and its value stand beside it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart

PantrixFunnelChart(
    stages = listOf(
        FunnelStage("leads", "Leads", 800),
        FunnelStage("calls", "Calls", 950),
        FunnelStage("offers", "Offers", 300),
        FunnelStage("won", "Sales", 40)
    ),
    description = "From a lead to a sale: more calls than leads",
    tagKey = "widening"
)
```

### Your own colours

The stages' own colours: a role of the theme, lighter from stage to stage. Each `FunnelStage` carries its own colour; a stage given none takes the chart colour of its place.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.foundation.theme.PantrixTheme

val tone = PantrixTheme.colors.primary.color
PantrixFunnelChart(
    stages = FUNNEL_STEPS.mapIndexed { place, stage ->
        FunnelStage(stage.key, stage.name, stage.value, tone.copy(alpha = 1f - place * 0.2f))
    },
    description = "The stages a visit goes through until it comes to a payment, in one colour",
    tagKey = "own_colors"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Visits", 3000),
    FunnelStage("signups", "Sign-ups", 1240),
    FunnelStage("trials", "Trials", 520),
    FunnelStage("paid", "Paid", 310)
)
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the stages, their values and their rates.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    description = "The stages a visit goes through until it comes to a payment",
    tagKey = "exported",
    export = ChartExport(fileName = "visit-to-payment") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Visits", 3000),
    FunnelStage("signups", "Sign-ups", 1240),
    FunnelStage("trials", "Trials", 520),
    FunnelStage("paid", "Paid", 310)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixFunnelChart

`import com.pantrixui.components.chart.funnel.PantrixFunnelChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFunnelChart(
    stages: List<FunnelStage>,
    modifier: Modifier = Modifier,
    labels: ChartDataLabels? = ChartDataLabels(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    shape: FunnelShape = FunnelShape.Funnel,
    horizontal: Boolean = false,
    rate: FunnelRate = FunnelRate.First,
    export: ChartExport? = null
)
```

A funnel: the stages of something that fewer and fewer get through, one under another, each as wide as the number that reached it. It shows where the others were lost: the visitors who signed up, the sign-ups who tried, the trials who paid.

The chart is given its `stages`, in the order they follow one another. The largest is as wide as the chart, and each narrows down to the width of the one after it, so that the stages make one funnel; the last keeps its width. A stage that is larger than the one before it widens instead: the funnel draws what it is given. Drawn as `FunnelShape.Bars`, each stage is a bar as wide as it counts for. A `horizontal` funnel lays its stages side by side from where lines start, each as tall as it counts for.

A stage has its name and its value written in it, the value with its shares after it as `rate` says, in the one of black and white that reads better on its colour. A stage too small for them has them beside it, or under it in a horizontal funnel, the name over the value where its column is too narrow for one line; where they have room in none of these places its name is written by itself, and a stage with no room for that has nothing. The `tooltip` and a screen reader always have both.

**Pointing at a stage.** A pointer over a stage's row points at it; a finger does by a tap, and a tap on the stage it points at lets go of it. With the keyboard the chart is one stop for Tab: the arrows go from stage to stage, up and down, or right and left in a horizontal funnel; Home and End go to the first and the last, and Escape lets go. The stage is ringed, the tooltip shown for it, and it is told to `state`, as a selection whose `x` is the stage's key. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, then each stage with its name, its value and its shares, in their order: a share says which stage it is of, but where the funnel writes the first stage's alone.

**Its size.** The chart is as wide as it is given room, and as tall as its modifier says or, given no height, as the chart's style says.

```kotlin
PantrixFunnelChart(
    stages = listOf(
        FunnelStage("visits", "Visits", 3000),
        FunnelStage("signups", "Sign-ups", 1240),
        FunnelStage("paid", "Paid", 310)
    ),
    description = "From a visit to a payment",
    tagKey = "sales"
)
```

Parameters:

- `stages: List<FunnelStage>`: the stages, in the order they follow one another. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's.
- `labels: ChartDataLabels?`: what is written at the stages: each stage's name and its value, written as `format` says or in the theme's language where it says nothing, with its shares. `null` writes nothing at them.
- `tooltip: ChartTooltip?`: what is shown for the stage that is pointed at: its name and its value with its shares. With both shares the value stands alone on the stage's row and each share on a row of its own under it, which a tooltip of the caller's own is handed as a point of the stage named by the share, with the share as its value and no text. A stage has no place to share and no line through it: `shared` and `crosshair` are not read. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its stages.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the stage that is pressed: its key is its `series` and its `x`, its name its `name` and its `label`, and its `text` its value with its shares after it.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest. Two stages are a `sliceGap` apart.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `Funnel_<tagKey>`, its stages together `Funnel_<tagKey>.Plot`, a stage `Funnel_<tagKey>.Stage_<number>`, counted from one, and the tooltip `Funnel_<tagKey>.Tooltip`. A press on a stage is reported as a `Funnel` `select` event with the stage's key. Nothing of the values is reported.
- `shape: FunnelShape`: how the stages are drawn: as one funnel, or as bars.
- `horizontal: Boolean`: whether the stages stand side by side, from where lines start, and not one under another.
- `rate: FunnelRate`: which shares a stage's value is written with: of the first stage, of the stage before it, or both. At a stage they stand in brackets after the value, two of them apart by a dot; to a tooltip and a screen reader one of the stage before it, and each of two, says which it is (`PantrixStrings.shareOfFirst` and `shareOfPrevious`).
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button.

### FunnelStage

`import com.pantrixui.components.chart.funnel.FunnelStage`, from `com.pantrixui:components`

```kotlin
class FunnelStage(
    public val key: String,
    public val name: String,
    public val value: Number,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

One stage of a `PantrixFunnelChart`: a step of what is followed, and how many reached it.

```kotlin
FunnelStage("signups", "Sign-ups", 1240)
```

Parameters:

- `key: String`: What tells the stage from the others of its funnel, and stays the same while its value changes: what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the stage is called: at the stage, in the tooltip and to a screen reader.
- `value: Number`: How many reached the stage. One that is no number, has no end or is under nought counts for nothing.
- `color: Color`: The colour the stage is drawn in. Left out, it is the theme's chart colour for its place among the stages.
- `pattern: ChartPattern?`: The texture the stage is drawn with besides its colour. Left out, none, and where the chart's patterns are on (`ChartStyle.patterns`), its turn by its place among the stages: none for the first.

### FunnelShape

`import com.pantrixui.components.chart.funnel.FunnelShape`, from `com.pantrixui:components`

```kotlin
enum class FunnelShape
```

How the stages of a `PantrixFunnelChart` are drawn.

Entries:

- `Funnel`: As one funnel: each stage narrows or widens to the size of the stage after it.
- `Bars`: As bars, each as large as it counts for all along its row.

### FunnelRate

`import com.pantrixui.components.chart.funnel.FunnelRate`, from `com.pantrixui:components`

```kotlin
enum class FunnelRate
```

Which shares a stage's value is written with in a `PantrixFunnelChart`.

Entries:

- `First`: Of the first stage: how much of all that was followed reached it.
- `Previous`: Of the stage before it: how much of those that reached that one went on to it. The first stage has none.
- `Both`: Of the first stage and of the stage before it.

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
