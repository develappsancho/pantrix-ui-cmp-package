# Waterfall Chart

A chart that shows how an amount comes about, step by step: each bar starts where the one before it ended, and goes up by what the row adds and down by what it takes away. It is for a period's cash flow, the items of a budget, what comes into a stock and goes out of it.

It is the short way of writing a `PantrixChart` with a single `WaterfallSeries`. The axes, the tooltip, the state, the keyboard and the screen reader are as told on the "Chart" page.

- `PantrixWaterfallChart` (`com.pantrixui.components.chart.waterfall`, `com.pantrixui:components`): How an amount comes about, step by step: each bar starts where the one before it ended, up for what is added and down for what is taken away, with totals that stand on nought. The short way to a chart of one waterfall. Keywords: bridge chart, cascade, variance, running total, profit and loss.

## Features

- **Steps.** A row's value is the amount it adds; below zero, what it takes away. A step that adds is drawn in the chart's `rising` colour and one that takes away in its `falling` colour: the theme's `success` and `danger` colours, unless `colors` says otherwise.
- **Totals.** A row that `total` says is a total stands on zero and shows what the steps before it come to; its own value is not asked for. A total with a value of its own is where the count starts again: like the opening amount before the first step. Totals are drawn in the series' own colour (`color`).
- **Connecting lines.** A thin line goes from the end of each bar to where the next begins (`connectors`).
- **Zero.** The value axis takes zero in: the totals stand on it.
- **Tooltip and screen reader.** A step is written as what it adds, with its sign ("+310"); a total as what it comes to. A press is handed the step as the point's `value` and the level the step starts from as its `from`.
- **Value labels.** `labels` writes what each bar stands for at its end: over one that goes up, under one that goes down.
- **Horizontal.** `horizontal = true` sets the items down the side of the chart; each bar starts where the one above it ended, and one that adds goes right, one that takes away left (the other way about in a language read from the right). The values are written under the chart.
- **Automation.** The chart is tagged as the `PantrixChart` it is: `Chart_<tagKey>`. Its one series has the key `steps`.

## Usage

### From the opening amount to the closing one

```kotlin
PantrixWaterfallChart(
    data = moves,
    x = { it.name },
    y = { it.amount },
    name = stringResource(Res.string.cash),
    total = { it.isTotal },
    description = stringResource(Res.string.cash_of_the_quarter),
    tagKey = "cash"
)
```

### Each step written at its bar, in the brand's own colours

```kotlin
PantrixWaterfallChart(
    data = moves,
    x = { it.name },
    y = { it.amount },
    name = stringResource(Res.string.cash),
    total = { it.isTotal },
    labels = ChartDataLabels(),
    colors = ChartColors(rising = brand.gain, falling = brand.loss),
    tagKey = "cash_labelled"
)
```

## Examples

### From opening to closing

A quarter's cash flow: the opening amount, income, expenses and the closing. The opening is a total with a value of its own: the count starts from it. The closing has no value: it shows what the steps come to.

Move the pointer over a bar, or touch the bar: the tooltip writes the step with its sign. The thin lines between the bars show that each step starts where the one before it ended.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Cash (thousand TL)",
    total = { it.total },
    description = "A quarter's cash flow, from opening to closing",
    tagKey = "plain"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Opening", amount = 420, total = true),
    CashMove("Sales", amount = 310),
    CashMove("Services", amount = 120),
    CashMove("Salaries", amount = -260),
    CashMove("Rent", amount = -90),
    CashMove("Tax", amount = -70),
    CashMove("Closing", amount = null, total = true)
)
```

### Subtotals

Subtotals along the way: at the end of each quarter, what has been reached so far. A subtotal stands on zero, and the count goes on after it from where it was.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = HALF_YEAR_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Cash (thousand TL)",
    total = { it.total },
    description = "Monthly change in cash over half a year, with a subtotal at the end of each quarter",
    tagKey = "subtotals"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val HALF_YEAR_CASH = listOf(
    CashMove("Jan", amount = 180),
    CashMove("Feb", amount = -60),
    CashMove("Mar", amount = 140),
    CashMove("Q1", amount = null, total = true),
    CashMove("Apr", amount = -110),
    CashMove("May", amount = 90),
    CashMove("Jun", amount = 210),
    CashMove("Q2", amount = null, total = true)
)
```

### The values at the ends of the bars

What each bar stands for is written at its end (`labels`): over a step that adds and under a step that takes away, with its sign; over a total, as it is.

A label that has no room is left out; the value stays in the tooltip and for the screen reader.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Cash (thousand TL)",
    total = { it.total },
    labels = ChartDataLabels(),
    description = "A quarter's cash flow, with its values",
    tagKey = "labels"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Opening", amount = 420, total = true),
    CashMove("Sales", amount = 310),
    CashMove("Services", amount = 120),
    CashMove("Salaries", amount = -260),
    CashMove("Rent", amount = -90),
    CashMove("Tax", amount = -70),
    CashMove("Closing", amount = null, total = true)
)
```

### Horizontal

The same quarter, horizontal (`horizontal = true`): the items are set down the side of the chart, and each bar starts where the one above it ended. Where the items have long names, or are many, a horizontal waterfall is easier to read.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Cash (thousand TL)",
    total = { it.total },
    horizontal = true,
    labels = ChartDataLabels(),
    description = "A quarter's cash flow, in horizontal bars",
    tagKey = "horizontal_steps"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Opening", amount = 420, total = true),
    CashMove("Sales", amount = 310),
    CashMove("Services", amount = 120),
    CashMove("Salaries", amount = -260),
    CashMove("Rent", amount = -90),
    CashMove("Tax", amount = -70),
    CashMove("Closing", amount = null, total = true)
)
```

### Your own colours

The two colours of the steps come from the chart's colours (the `rising` and `falling` fields of `ChartColors`), and the totals' colour from the series itself (`color`). Turn the switch: the lines between the bars go away (`connectors`).

Colour should not carry the meaning alone: which way a step goes is also read from where its bar starts and ends, and from the sign of its value.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartColors
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var connectors by remember { mutableStateOf(true) }
val theme = PantrixTheme.colors
PantrixSwitchButton(
    checked = connectors,
    onCheckedChange = { connectors = it },
    label = "Connecting lines",
    tagKey = "waterfall_connectors"
)
PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Cash (thousand TL)",
    total = { it.total },
    connectors = connectors,
    color = theme.neutral.color,
    colors = ChartColors(rising = theme.info.color, falling = theme.warning.color),
    description = "A quarter's cash flow, in its own colours",
    tagKey = "own_colors"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Opening", amount = 420, total = true),
    CashMove("Sales", amount = 310),
    CashMove("Services", amount = 120),
    CashMove("Salaries", amount = -260),
    CashMove("Rent", amount = -90),
    CashMove("Tax", amount = -70),
    CashMove("Closing", amount = null, total = true)
)
```

### Pressing a step

A press is handed the step and the level it starts from: the point's `value` is what the step adds and its `from` the level the step starts from; the two together are what is reached after the step. A total has no `from`. Press a bar: the line below writes what was pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var pressed by remember { mutableStateOf<String?>(null) }
val strings = PantrixTheme.strings
PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Cash (thousand TL)",
    total = { it.total },
    onSelect = { point ->
        val start = point.from
        pressed = if (start == null) {
            "${point.label}: total ${point.text}"
        } else {
            "${point.label}: ${point.text}, then ${strings.decimal(start + point.value)}"
        }
    },
    description = "A quarter's cash flow",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Press a bar")

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Opening", amount = 420, total = true),
    CashMove("Sales", amount = 310),
    CashMove("Services", amount = 120),
    CashMove("Salaries", amount = -260),
    CashMove("Rent", amount = -90),
    CashMove("Tax", amount = -70),
    CashMove("Closing", amount = null, total = true)
)
```

### The long form

The chart the short form stands for: a `PantrixChart` with one `WaterfallSeries`. The short form's `horizontal = true` is `orientation = ChartOrientation.Horizontal` in the long form, and the series carries its key and its name itself. A screen that wants the waterfall together with other things writes it this way: here a line for the closing target.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartOrientation
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.cartesian.WaterfallSeries

PantrixChart(
    series = listOf(
        WaterfallSeries(
            key = "cash",
            name = "Cash (thousand TL)",
            data = QUARTER_CASH,
            x = { it.name },
            y = { it.amount },
            total = { it.total }
        )
    ),
    orientation = ChartOrientation.Horizontal,
    marks = listOf(ChartReferenceLine(y = 500, label = "Target")),
    description = "A quarter's cash flow and the closing target, in horizontal bars",
    tagKey = "as_series"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Opening", amount = 420, total = true),
    CashMove("Sales", amount = 310),
    CashMove("Services", amount = 120),
    CashMove("Salaries", amount = -260),
    CashMove("Rent", amount = -90),
    CashMove("Tax", amount = -70),
    CashMove("Closing", amount = null, total = true)
)
```

## API

### PantrixWaterfallChart

`import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixWaterfallChart(
    data: List<T>,
    x: (T) -> Any,
    y: (T) -> Number?,
    name: String,
    modifier: Modifier = Modifier,
    total: ((T) -> Boolean)? = null,
    connectors: Boolean = true,
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

A waterfall chart: how an amount comes about, step by step. Each bar starts where the one before it ended, going up for what a row adds and down for what it takes away, and a total stands on nought and shows what the steps before it come to.

It is a `PantrixChart` with one `WaterfallSeries`, written shorter: it does everything a chart does. A step that adds is drawn in the chart's `rising` colour and one that takes away in its `falling` colour, the theme's `success` and `danger` unless `colors` says otherwise; a total is drawn in `color`. A thin line leads from the end of each bar to where the next begins. `horizontal`, the places go down the chart's side, one under the other, and the bars along it, each starting where the one over it ended.

**Totals.** A row that `total` says is a total needs no value: it shows the count so far. A total that does have a value is where the count starts again, as an opening amount before the first step is. A row that is no total and has no value is a step of nothing, and has no bar.

In the tooltip and to a screen reader a step is what it adds, with its sign, and a total what it comes to. A press is handed the step as the point's `value` and the level it starts from as its `from`.

```kotlin
PantrixWaterfallChart(
    data = moves,
    x = { it.name },
    y = { it.amount },
    name = "Cash",
    total = { it.isTotal },
    tagKey = "cash"
)
```

Parameters:

- `data: List<T>`: the rows, in the order their steps are counted.
- `x: (T) -> Any`: where a row stands along the chart: a name, a day, anything that is equal to itself.
- `y: (T) -> Number?`: what a row adds, under nought what it takes away, or null where it has no value. For a total, the amount the count starts again from, or null for what the steps before it come to.
- `name: String`: what the amounts are of: what the tooltip calls them, and a screen reader the chart where it has no `description`.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's.
- `total: ((T) -> Boolean)?`: whether a row is a total. `null`, the chart has none.
- `connectors: Boolean`: whether a line leads from the end of each bar to the next.
- `color: Color`: the colour the totals are drawn in. Left out, it is the first of the chart's colours.
- `horizontal: Boolean`: whether the places go down the chart's side and the bars along it, and not along its foot and up.
- `labels: ChartDataLabels?`: what each bar stands for written at its end, a step with its sign and a total as it is, where it has room. `null` writes none.
- `xAxis: ChartAxis?`: the axis of the places, under the chart, or beside it where it is `horizontal`. `null` draws nothing of it.
- `yAxis: ChartAxis?`: the axis of the values, beside the chart, or under it where it is `horizontal`. `null` draws nothing of it.
- `marks: List<ChartMark>`: the lines and the bands drawn in the plot besides the steps: a target, a limit.
- `tooltip: ChartTooltip?`: what is shown for the place that is pointed at. `null` shows none.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the places and move along the rest. `null`, which it is unless the chart is given one, shows all the places and no more.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a file: a picture, or a drawing that is sharp at any size. `null`, which it is unless the chart is given one, and the chart has no such button.
- `empty: (@Composable () -> Unit)?`: what the chart shows in its plot while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words. A file the chart is exported as says them.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the step or the total that is pressed.
- `style: ChartStyle?`: this chart's own geometry.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's: `rising` and `falling` among them.
- `tagKey: String?`: the chart's automation key. The chart is tagged as the `PantrixChart` it is, `Chart_<tagKey>`, and its parts and events are that chart's; its one series has the key `steps`.

### WaterfallSeries

`import com.pantrixui.components.chart.cartesian.WaterfallSeries`, from `com.pantrixui:components`

```kotlin
class WaterfallSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    public val total: ((T) -> Boolean)? = null,
    override val color: Color = Color.Unspecified,
    public val connectors: Boolean = true,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null
) : ChartSeries()
```

A series whose values are steps: each bar starts where the one before it ended, so that the chart shows how an amount comes about, what was added to it and what was taken from it on the way.

```kotlin
WaterfallSeries("cash", "Cash", moves, x = { it.name }, y = { it.amount }, total = { it.isTotal })
```

A row's value is what the row adds, and under nought what it takes away. The steps are counted along the chart's places, in their order. A step that adds is drawn in the chart's `rising` colour and one that takes away in its `falling` colour, which a chart's `colors` say; a thin line leads from the end of each bar to where the next begins.

**Totals.** A row that `total` says is a total stands on nought and shows what the steps before it come to: its own value is not asked for. A total that does have a value is where the count starts again: an opening amount before the first step, or a count taken up again from a known figure. Totals are drawn in the series' own `color`.

A row with no value is a step of nothing, and has no bar. A waterfall does not stack, and its axis takes nought in: its totals stand on it.

In the tooltip and to a screen reader a step is what it adds, with its sign, and a total what it comes to. A press is handed the step as the point's `value` and the level it starts from as its `from`: what the count has come to after it is the two together.

Two series are the same series where everything they were built from is the same, the three functions among them.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows, in the order their steps are counted.
- `x: (T) -> Any`: Where a row stands along the chart: a name, a day, anything that is equal to itself.
- `y: (T) -> Number?`: What a row adds, under nought what it takes away, or null where it has no value. For a total, the amount the count starts again from, or null for what the steps before it come to.
- `total: ((T) -> Boolean)?`: Whether a row is a total. Null, the series has none.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `connectors: Boolean`: Whether a line leads from the end of each bar to the next.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by.
- `labels: ChartDataLabels?`: What each bar stands for written at its end: a step with its sign, a total as it is. Null writes none.

### ChartOrientation

`import com.pantrixui.components.chart.cartesian.ChartOrientation`, from `com.pantrixui:components`

```kotlin
enum class ChartOrientation
```

Which way the places of a chart go, and so which way its values do.

Entries:

- `Vertical`: The places along the chart's foot, from the side lines start at, and the values up its side: columns.
- `Horizontal`: The places down the chart's side, from its top, and the values along its foot, from the side lines start at: bars. Long names have the room of a line each, written across.

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
