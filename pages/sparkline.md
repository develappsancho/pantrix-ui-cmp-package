# Sparkline

The run of a number in the room of a word: it stands beside the number it belongs to. It has no axes, no legend and nothing to point at: it shows which way the number has gone, and a chart shows the rest.

- `PantrixSparkline` (`com.pantrixui.components.chart.sparkline`, `com.pantrixui:components`): The run of a number in the room of a word, as a line, an area or bars, with no axes and nothing to point at. Keywords: mini chart, inline chart, trend line, microchart, word-sized chart.

## Features

- **Values.** The values are set out at even steps from the start of the line to its end. A line and an area are drawn between the least and the most of the values: the run fills the height it has. Bars are drawn from nought.
- **Ends.** `min` is the value at the foot of the height and `max` the one at its top: several runs read on one scale. A value past the ends is cut off at the box's edge. An end not given comes from the values and the reference line.
- **Curve.** `curve` says how a line and an area go from one value to the next (`ChartCurve`): straight, rounded without going past the values, or in steps. Bars have no curve.
- **Last value.** `markLast = true` marks the last value: a dot on a line and an area, and on bars the last bar in full colour and the others fainter. The last value is the last one that is a number.
- **Reference line.** `reference` draws a dashed line behind the values, in the colour charts write in: a target, or where the run began.
- **Style.** `style` goes over the theme's sizes: the line's width (`lineWidth`), the gap between bars (`barGap`), the last value's dot (`markerSize`) and the reference line's width (`markLineWidth`).
- **Kind.** `SparklineKind.Line` is a line, `Area` a line faintly filled under it, `Bar` a bar for each value.
- **A missing value.** A value that is `null`, or no number, is a gap in a line and an empty place among bars.
- **Size and colour.** It is 96dp wide and 32dp tall unless the modifier says otherwise; it is drawn in `color`, or else in the theme's first chart colour.
- **Screen reader.** With a `contentDescription` it is a picture of that name; with none it is not read at all: that suits a run beside a number that says the same.
- **Direction.** In a language read from right to left the first value stands at the right.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `Sparkline_<tagKey>`.

## Usage

### Beside the number it belongs to

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = total, style = PantrixTheme.typography.title)
    PantrixSparkline(values = lastThirtyDays, contentDescription = null)
}
```

### A rounded line with its last value and a target

```kotlin
PantrixSparkline(
    values = temperatures,
    curve = ChartCurve.Smooth,
    markLast = true,
    reference = 20,
    contentDescription = stringResource(Res.string.temperature_today)
)
```

### Bars, for amounts that are counted from nought

```kotlin
PantrixSparkline(
    values = ordersByDay,
    kind = SparklineKind.Bar,
    contentDescription = stringResource(Res.string.orders_this_week),
    tagKey = "orders"
)
```

## Examples

### Beside a number

At its plainest: beside a number, the run of that number over the last twelve weeks. Since the number and its name are written beside it, the run has nothing more to say to a screen reader (`contentDescription = null`).

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    Column {
        PantrixText(text = "Visits", color = PantrixTheme.colors.textSecondary)
        PantrixText(text = strings.decimal(SPARK_VISITS.last()), style = PantrixTheme.typography.title)
    }
    PantrixSparkline(values = SPARK_VISITS, tagKey = "plain")
}

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

### Line, area, bars

The same values in three kinds: a line, a line filled under it, and bars. Bars start at nought; a line at the least value.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(values = SPARK_VISITS, contentDescription = "Visits, line", tagKey = "line")
    PantrixSparkline(
        values = SPARK_VISITS,
        kind = SparklineKind.Area,
        contentDescription = "Visits, area",
        tagKey = "area"
    )
    PantrixSparkline(
        values = SPARK_VISITS,
        kind = SparklineKind.Bar,
        contentDescription = "Visits, bars",
        tagKey = "bar"
    )
}

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

### Missing values and under nought

The weeks with no measure (`null`) are a gap in the line; a single value with none before it and none after it is a dot. The bars of values under nought go down from nought.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(values = SPARK_GAPS, contentDescription = "A measure with missing weeks", tagKey = "gaps")
    PantrixSparkline(
        values = SPARK_BALANCE,
        kind = SparklineKind.Bar,
        contentDescription = "Monthly profit and loss",
        tagKey = "balance"
    )
}

private val SPARK_GAPS = listOf(12, 15, 14, null, null, 18, 21, 19, null, 24)

private val SPARK_BALANCE = listOf(64, 31, -12, -38, 22, 47, 58, 87)
```

### Your own size and colour

The modifier gives the size, `color` the colour: a rising run in the success colour, a falling one in the danger colour, in a wider room.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(
        values = SPARK_VISITS,
        modifier = Modifier.size(160.dp, 48.dp),
        kind = SparklineKind.Area,
        color = colors.success.color,
        contentDescription = "Rising visits",
        tagKey = "up"
    )
    PantrixSparkline(
        values = SPARK_VISITS.reversed(),
        modifier = Modifier.size(160.dp, 48.dp),
        kind = SparklineKind.Area,
        color = colors.danger.color,
        contentDescription = "Falling visits",
        tagKey = "down"
    )
}

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

### Curve, last value and target

`curve` says how the line goes from one value to the next: `Smooth` rounds it without going past the values, `StepAfter` holds each value until the next. `markLast = true` marks the last value with a dot; on bars the last bar is drawn in full colour and the others fainter. `reference` draws a dashed line behind: here 20 degrees for the temperature, and the daily target for the orders.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(
        values = SPARK_TEMPERATURE,
        contentDescription = "Today's temperature",
        tagKey = "smooth",
        curve = ChartCurve.Smooth,
        markLast = true,
        reference = 20
    )
    PantrixSparkline(
        values = SPARK_TEMPERATURE,
        contentDescription = "Today's temperature, in steps",
        tagKey = "steps",
        curve = ChartCurve.StepAfter,
        markLast = true
    )
    PantrixSparkline(
        values = SPARK_ORDERS,
        kind = SparklineKind.Bar,
        contentDescription = "This week's orders",
        tagKey = "orders",
        markLast = true,
        reference = 40
    )
}

private val SPARK_TEMPERATURE = listOf(12.5, 11.8, 13.2, 16.4, 19.8, 22.6, 24.1, 23.4, 21.0, 18.2, 16.9, 15.7)

private val SPARK_ORDERS = listOf(32, 45, 38, 51, 29, 47, 43)
```

### A shared scale and your own style

`min` and `max` give the ends of the height: two servers' processor use on one scale, from nought to a hundred. One is barely working, the other is full; with no ends given each would stand between its own least and most value, and both would look as high. The dashed line in both is the warning threshold at eighty percent (`reference`). `style` makes the line thicker and the last value's dot larger.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val style = ChartStyle(lineWidth = 3.dp, markerSize = 10.dp)
val servers = listOf(Triple("Server A", SPARK_QUIET, "quiet"), Triple("Server B", SPARK_BUSY, "busy"))
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    servers.forEach { (name, load, key) ->
        Row(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(text = name, modifier = Modifier.width(80.dp))
            PantrixSparkline(
                values = load,
                modifier = Modifier.size(160.dp, 40.dp),
                contentDescription = "$name, processor use",
                tagKey = key,
                style = style,
                markLast = true,
                reference = 80,
                min = 0,
                max = 100
            )
            PantrixText(text = PantrixTheme.strings.percent(load.last() / 100.0))
        }
    }
}

private val SPARK_QUIET = listOf(12, 18, 15, 22, 19, 14, 25, 21, 17, 23)

private val SPARK_BUSY = listOf(71, 78, 84, 80, 92, 88, 95, 99, 90, 86)
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

A small line is exported too: the button stands over the line, and the file is the line alone.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.sparkline.PantrixSparkline

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixSparkline(
    values = SPARK_VISITS,
    contentDescription = "Visits of the last twelve days",
    tagKey = "exported",
    export = ChartExport(fileName = "visits") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixSparkline

`import com.pantrixui.components.chart.sparkline.PantrixSparkline`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSparkline(
    values: List<Number?>,
    modifier: Modifier = Modifier,
    kind: SparklineKind = SparklineKind.Line,
    color: Color = Color.Unspecified,
    contentDescription: String? = null,
    tagKey: String? = null,
    export: ChartExport? = null,
    style: ChartStyle? = null,
    curve: ChartCurve = ChartCurve.Linear,
    markLast: Boolean = false,
    reference: Number? = null,
    min: Number? = null,
    max: Number? = null
)
```

A sparkline: the run of a number in the room of a word, beside the number it belongs to. It has no axes, no legend and nothing to point at: it shows which way the number has gone, and a chart shows the rest.

The `values` are set out at even steps from where lines start to where they end. Its height goes from `min` up to `max`; where they are not given, a line and an area go from the least of the values to the most, so that the run fills the height it has, and bars from nought, or from the least of them where it is under nought. A `reference` line is taken in too. A value past an end that is given is cut off at the box's edge. A value that is `null`, or no number, is a gap in a line and a place with no bar.

It is 96dp wide and 32dp tall unless its modifier says otherwise, and is drawn in `color` or in the first of the theme's chart colours, as thick as the `style`'s `lineWidth`. In a language read from the right its first value stands at the right.

**To a screen reader** it is a picture with `contentDescription` for its name; with none it is not there at all, which suits a sparkline beside a number that says the same.

```kotlin
PantrixSparkline(values = visits, contentDescription = "Visits, last thirty days")
PantrixSparkline(values = temperature, curve = ChartCurve.Smooth, markLast = true, reference = 20)
```

Parameters:

- `values: List<Number?>`: the values, in the order they are read.
- `modifier: Modifier`: the sparkline's modifier. A size here is the sparkline's.
- `kind: SparklineKind`: whether the values are a line, an area or bars.
- `color: Color`: the colour it is drawn in.
- `contentDescription: String?`: what the run is of, in a few words, for a screen reader. `null` leaves it out of what a screen reader reads.
- `tagKey: String?`: the sparkline's automation key: the sparkline is `Sparkline_<tagKey>`.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button.
- `style: ChartStyle?`: the sizes it is drawn in over the theme's: the line's width (`lineWidth`), the gap between two bars (`barGap`), the mark of the last value (`markerSize`) and the reference line's width (`markLineWidth`).
- `curve: ChartCurve`: how a line or an area goes from one value to the next. Bars have none.
- `markLast: Boolean`: whether the last value is marked: a dot on a line or an area, as large as the style's `markerSize`, and on bars the last one in `color` and the rest in a quieter share of it. The last value is the last that is a number.
- `reference: Number?`: a value a dashed line is drawn across the sparkline at, behind its values, in the colour charts write in: a target, or where the run began. `null` draws none.
- `min: Number?`: the value at the sparkline's foot, or `null` for the least of its values. A number, and less than `max`.
- `max: Number?`: the value at its top, or `null` for the most of them.

### SparklineKind

`import com.pantrixui.components.chart.sparkline.SparklineKind`, from `com.pantrixui:components`

```kotlin
enum class SparklineKind
```

How a `PantrixSparkline` draws its values.

Entries:

- `Line`: A line through the values.
- `Area`: A line through the values, with what is under it filled in a faint share of its colour.
- `Bar`: A bar for each value, up from nought or down from it.
