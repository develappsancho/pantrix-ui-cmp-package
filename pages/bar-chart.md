# Bar Chart

A bar chart of rows that are given once: at each place the rows name, a bar for each value read from the rows. It is for amounts compared place by place: the sales of the months, the shares of the channels.

It is the short way of writing a `PantrixChart` whose series are all bars and all read from the same rows. The axes, the legend, the tooltip, the state, the keyboard and the screen reader are as told on the "Chart" page.

- `PantrixBarChart` (`com.pantrixui.components.chart.bar`, `com.pantrixui:components`): A bar for each value read from one list of rows, side by side or stacked, for amounts that are compared place by place: the short way to a chart whose series are all bars. Keywords: column chart, bar graph, histogram, stacked bar, grouped bar.

## Features

- **Side by side or stacked.** A place's bars stand side by side; with `stacked` they stand on one another, in the order of `values`. Side by side suits a few values compared at each place; stacked suits the parts of a whole: the whole reads as well. A stack's tooltip writes the total after the values.
- **Shares.** `stacking = ChartStacking.Percent` counts every stack as a hundred percent: the parts' shares read, not the whole. The axis writes percentages, the tooltip adds each value's share beside it, and a label writes the share.
- **Zero.** A bar chart's value axis starts at zero: a bar's length is read as an amount. A value below zero goes down from zero; in a stack, under the others that go down.
- **Band.** Each place has a band of the chart's width, and its bars stand in the middle of that band. A bar is no wider than a set width however much room it has (`ChartStyle.barMaxWidth`); where there is little room the bars get thinner.
- **Horizontal.** `horizontal = true` sets the places down the side of the chart, and the bars go from the left (from the right in a language read from the right): for a ranking, or for places with long names. Each name is written across, on its own line; a name wider than a third of the box is cut short. The values are written under the chart, a second axis over it. The arrows down and up go from place to place, right and left from value to value. A horizontal chart that is looked at closer (`zoom`) goes up and down its places; its navigator stands upright beside the chart, at the side lines end at.
- **The place pointed at.** The band of the place under the pointer or the finger is shaded, and the tooltip shows the values of that place. Where the tooltip tells the series apart (`shared = false`) a ring is drawn around the bar under the pointer.
- **With a line.** A chart that wants a line over its bars is a `PantrixChart`: it takes a `BarSeries` for each run of bars and a `LineSeries` for the line. Its example is on the "Chart" page.
- **Value labels.** `labels` writes the values at the ends of the bars, and inside stacked bars; `position` names another place, and `total` writes a stack's total past its end. A label with no room is left out.
- **Marks.** `marks` draws a target line or the band of a range, as told on the "Chart" page.
- **Automation.** The chart is tagged as the `PantrixChart` it is: `Chart_<tagKey>`.

## Usage

### One amount for each month

```kotlin
PantrixBarChart(
    data = months,
    x = { it.name },
    values = listOf(ChartValue("orders", stringResource(Res.string.orders)) { it.orders }),
    description = stringResource(Res.string.orders_of_the_year),
    tagKey = "orders"
)
```

### Parts of a whole, stacked

```kotlin
PantrixBarChart(
    data = quarters,
    x = { it.name },
    values = listOf(
        ChartValue("online", stringResource(Res.string.online)) { it.online },
        ChartValue("stores", stringResource(Res.string.stores)) { it.stores }
    ),
    stacked = true,
    tagKey = "sales"
)
```

## Examples

### A single amount

At its plainest: the rows, the `x` that gives a row's place, and a single value. A chart of one series has no legend.

Move the pointer over a month, or touch the month: its band is shaded and the tooltip writes that month's sales.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(ChartValue("online", "Online") { it.online }),
    description = "Online sales by month",
    tagKey = "plain"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)
```

### Side by side or stacked

Three sales channels, side by side each month: which of them leads in each month is read. Turn the switch: the bars go on one another (`stacked`) and each month's total is read too; the channels' shares are seen from the colours.

Press a name in the legend: the channel goes, and the bars that stay widen or the stack gets shorter.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var stacked by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = stacked,
    onCheckedChange = { stacked = it },
    label = "Stacked",
    tagKey = "bar_stacked"
)
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores },
        ChartValue("partners", "Dealers") { it.partners }
    ),
    stacked = stacked,
    description = "Sales of three channels by month",
    tagKey = "stacked"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)
```

### Values that go below zero

Values on both sides of zero: a month's profit or loss. A profit goes up from zero and a loss down from it; a line is drawn at zero. The values are written short (`format`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixBarChart(
    data = BALANCE,
    x = { it.first },
    values = listOf(ChartValue("balance", "Profit") { it.second }),
    yAxis = ChartAxis(format = { strings.compact(it) }),
    description = "Profit and loss by month",
    tagKey = "below_zero"
)

private val BALANCE = listOf(
    "Jan" to 64_000,
    "Feb" to 31_000,
    "Mar" to -12_000,
    "Apr" to -38_000,
    "May" to 22_000,
    "Jun" to 87_000
)
```

### Bars read one at a time

The tooltip tells the series apart (`shared = false`): the bar under the pointer is marked by a ring and the tooltip writes its value alone. On a keyboard the arrows up and down go from one bar to the other. Press a bar: the row underneath writes what was pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.elements.text.PantrixText

var pressed by remember { mutableStateOf<String?>(null) }
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores }
    ),
    tooltip = ChartTooltip(shared = false),
    onSelect = { pressed = "${it.label}, ${it.name}: ${it.text}" },
    description = "Online and store sales by month",
    tagKey = "one_by_one"
)
PantrixText(text = pressed ?: "Press a bar")

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)
```

### Many places

Thirty days. Each day's band is narrow and the bars are thin to match; the days' names are left out by a rule. All the values stay where they are: the value of every day is shown with a pointer or a finger.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue

PantrixBarChart(
    data = DAYS,
    x = { it.first },
    values = listOf(ChartValue("orders", "Orders") { it.second }),
    xAxis = ChartAxis(label = { "Day $it" }),
    description = "Daily orders of the last thirty days",
    tagKey = "many_places"
)

private val DAYS = List(30) { day -> (day + 1) to 120 + day * 4 - (if (day % 7 >= 5) 45 else 0) + (day * 37) % 23 }
```

### Long names

Places with long names: a shop's eight best-selling products. Where the names do not fit side by side, and more of them fit turned, they are written turned an eighth, each ending under its place; where they do not fit turned either, every second or third is written, as before. The first and the last name are always written. A very long name is cut short so that it reaches no further down than a third of the chart's height, and a name at the box's edge so that it stays inside. Short names stay flat.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue

PantrixBarChart(
    data = BEST_SELLERS,
    x = { it.first },
    values = listOf(ChartValue("sold", "Sold (units)") { it.second }),
    description = "This month's sales of the eight best-selling products",
    tagKey = "long_names"
)

private val BEST_SELLERS = listOf(
    "Wireless headphones" to 412,
    "Smart watch" to 356,
    "Portable charger" to 298,
    "Bluetooth speaker" to 251,
    "Gaming mouse" to 214,
    "Mechanical keyboard" to 187,
    "High-resolution webcam" to 143,
    "USB-C hub" to 121
)
```

### Horizontal bars

The same eight products, as horizontal bars (`horizontal = true`): the names stand beside the chart, each on its own line, written across; the bars go from the left and their values are written at their ends (`labels`). The target line (`marks`) stands on the axis of values, so it cuts the chart from top to bottom.

Move the pointer over a product or touch it: its row is shaded and the tooltip writes its value. With the keyboard, on the chart, the down and up arrows go from product to product.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabels

PantrixBarChart(
    data = BEST_SELLERS,
    x = { it.first },
    values = listOf(ChartValue("sold", "Sold (units)") { it.second }),
    horizontal = true,
    labels = ChartDataLabels(),
    marks = listOf(ChartReferenceLine(y = 300, label = "Target")),
    description = "This month's sales of the eight best-selling products, as horizontal bars",
    tagKey = "horizontal"
)

private val BEST_SELLERS = listOf(
    "Wireless headphones" to 412,
    "Smart watch" to 356,
    "Portable charger" to 298,
    "Bluetooth speaker" to 251,
    "Gaming mouse" to 214,
    "Mechanical keyboard" to 187,
    "High-resolution webcam" to 143,
    "USB-C hub" to 121
)
```

### Horizontal and stacked

Horizontal bars stand side by side or stacked too: here three channels' monthly sales, stacked. The legend takes a channel out; each stack's total is written at the end of its bar (`total`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabels

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores },
        ChartValue("partners", "Dealers") { it.partners }
    ),
    stacked = true,
    horizontal = true,
    labels = ChartDataLabels(total = true),
    description = "Sales of three channels by month, as horizontal stacked bars",
    tagKey = "horizontal_stacked"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)
```

### A long ranking

The number of stores in forty provinces, from the most to the fewest: this many rows do not fit in the chart's height. In a horizontal chart that is looked at closer (`zoom`) the first ten provinces fill the plot (`ChartState.zoomTo`); the navigator (`navigator = true`) stands upright at the chart's right and shows all the provinces, and the part in view is dragged along it or made larger by its ends.

Drag the chart up and down with the mouse, turn the wheel, or slide two fingers along it; the wheel with Ctrl, and two fingers moved apart or together, look closer or further off. The buttons go up and down, look further off and closer, and show all the provinces again. With the keyboard the arrow down goes to the next province; reaching one that is out of view moves the part in view.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState

val state = rememberChartState()
LaunchedEffect(state) { state.zoomTo(start = 0f, end = 0.25f) }
PantrixBarChart(
    data = PROVINCES,
    x = { it.first },
    values = listOf(ChartValue("stores", "Stores") { it.second }),
    modifier = Modifier.height(360.dp),
    horizontal = true,
    zoom = ChartZoom(navigator = true),
    state = state,
    description = "The number of stores in forty provinces, from the most to the fewest",
    tagKey = "long_ranking"
)

private val PROVINCES = PROVINCE_NAMES.mapIndexed { place, name -> name to 2400 / (place + 3) + 5 }

private val PROVINCE_NAMES = (
    "İstanbul Ankara İzmir Bursa Antalya Konya Adana Gaziantep Şanlıurfa Kocaeli " +
        "Mersin Diyarbakır Hatay Manisa Kayseri Samsun Balıkesir Kahramanmaraş Van Aydın " +
        "Tekirdağ Sakarya Denizli Muğla Eskişehir Mardin Trabzon Malatya Ordu Erzurum " +
        "Afyonkarahisar Sivas Tokat Zonguldak Adıyaman Elazığ Batman Çorum Kütahya Şırnak"
).split(" ")
```

### Values over the bars

Values are written beside the bars (`labels`): over the end of a bar that stands by itself, under a bar that goes below zero. Turn the switch: in stacked bars a value is written inside its bar, in the black or white that reads better on the bar's colour, and the stack's total over its end (`total`). The line marks a target no month reaches (`marks`); where it runs through a label, the label is written on a plate that covers the line there. The target's words stand at the line's start (`labelPosition`): at its end they would take the place of the highest months' labels.

Pick where the labels go with the buttons (`position`): "Auto" is wherever there is room; the others are past the bar's end, inside its end, its middle and its base. Past the end of a stacked bar is the next bar: there the label is written inside the end of its own bar.

A label is written where it has room: one that would stand on another label, reach out of the chart or not fit its bar is left out; the value is still in the tooltip and with the screen reader. `ChartDataLabels(format = …)` says how a value is written; left out, the axis' way of writing is used.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartMarkLabelPosition
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabelPosition
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var stacked by remember { mutableStateOf(false) }
var position by remember { mutableStateOf(ChartDataLabelPosition.Auto) }
PantrixSwitchButton(
    checked = stacked,
    onCheckedChange = { stacked = it },
    label = "Stacked",
    tagKey = "bar_labels_stacked"
)
PantrixSegmentButton(
    options = LABEL_PLACES,
    selected = position,
    onSelect = { position = it },
    fullWidth = false,
    tagKey = "label_place"
)
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores }
    ),
    stacked = stacked,
    labels = ChartDataLabels(position = position, total = stacked),
    marks = listOf(
        ChartReferenceLine(
            y = if (stacked) 140 else 75,
            label = "Target",
            labelPosition = ChartMarkLabelPosition.Start
        )
    ),
    description = "Online and store sales by month, with their values",
    tagKey = "labels"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)

private val LABEL_PLACES = listOf(
    SegmentOption(value = ChartDataLabelPosition.Auto, label = "Auto", tagKey = "auto"),
    SegmentOption(value = ChartDataLabelPosition.Outside, label = "Out", tagKey = "outside"),
    SegmentOption(value = ChartDataLabelPosition.InsideEnd, label = "End", tagKey = "inside_end"),
    SegmentOption(value = ChartDataLabelPosition.Center, label = "Middle", tagKey = "center"),
    SegmentOption(value = ChartDataLabelPosition.InsideStart, label = "Base", tagKey = "inside_start")
)
```

### Stacked as shares

Each channel's share of every month: each month's bar is a hundred percent and the channels take their shares of it (`stacking = ChartStacking.Percent`). What reads is not the sales themselves but how they are shared: in which month the online share grew. The axis writes percentages and the labels the shares; the tooltip writes each channel's sales with its share, and then the month's total.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartStacking
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabels

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores },
        ChartValue("partners", "Dealers") { it.partners }
    ),
    stacked = true,
    stacking = ChartStacking.Percent,
    labels = ChartDataLabels(),
    description = "Each channel's share of sales by month",
    tagKey = "shares"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)
```

### Second axis

Two kinds of value: sales in thousands of lira, the online share in percent. The share is read by the second axis (`ChartValue(axis = ChartYAxis.Second)`), which stands at the chart's other side and writes its values its own way (`secondYAxis`). Both axes start at zero, and their zeros are on one line.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.cartesian.ChartYAxis
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("share", "Online share", axis = ChartYAxis.Second) {
            it.online.toDouble() / (it.online + it.stores)
        }
    ),
    secondYAxis = ChartAxis(format = { strings.percent(it) }),
    description = "Online sales by month, and their share of all sales",
    tagKey = "second_axis"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)
```

### Your own sizes

A chart's own sizes: the bars have square ends (`barRadius`), are no wider than twenty-four dp (`barMaxWidth`), stand further apart side by side (`barGap`) and take nine tenths of a month's band (`barBandShare`). A field that is not given stays the theme's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartStyle

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores }
    ),
    description = "Online and store sales by month",
    style = ChartStyle(barRadius = 0.dp, barMaxWidth = 24.dp, barGap = 6.dp, barBandShare = 0.9f),
    tagKey = "own_look"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Jan", online = 42, stores = 58, partners = 21),
    Sales("Feb", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Apr", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Jun", online = 66, stores = 64, partners = 29)
)
```

## API

### PantrixBarChart

`import com.pantrixui.components.chart.bar.PantrixBarChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixBarChart(
    data: List<T>,
    x: (T) -> Any,
    values: List<ChartValue<T>>,
    modifier: Modifier = Modifier,
    stacked: Boolean = false,
    stacking: ChartStacking = ChartStacking.Normal,
    horizontal: Boolean = false,
    labels: ChartDataLabels? = null,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    secondYAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    legend: ChartLegend? = ChartLegend(),
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

A bar chart of rows that are given once: at each place the rows name, a bar for each of the `values` read from them, side by side, or on one another where they are `stacked`.

It is a `PantrixChart` whose series are all bars read from the same rows, written shorter: it does everything a chart does. Its axis of values starts at nought unless the axis says otherwise: a bar's length is read as an amount. A chart of bars with a line over them, or of bars from different lists, is a `PantrixChart` given a `BarSeries` for each run of bars and a `LineSeries` for the line.

Side by side suits a few values that are compared at each place; stacked suits parts that make up a whole, where the whole is read as well. A value under nought goes down from nought, and in a stack under the others that do. Where the parts matter more than the whole, the `stacking` by their shares makes every bar as tall as the others. `horizontal` bars go along the chart from its side, one place under the other: a ranking, or places with long names, each written across in the room of a line.

```kotlin
PantrixBarChart(
    data = months,
    x = { it.name },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores }
    ),
    stacked = true,
    tagKey = "sales"
)
```

Parameters:

- `data: List<T>`: the rows.
- `x: (T) -> Any`: where a row stands along the chart: a name, a day, anything that is equal to itself.
- `values: List<ChartValue<T>>`: the series: what each reads from a row, and how it is called and coloured. A bar has neither the dashes nor the mark a value may name.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `stacked: Boolean`: whether the bars of a place stand on one another, in the order of `values`, and not side by side.
- `stacking: ChartStacking`: how the stacked bars stand on one another: as their values, or as their shares of the stack. Bars that are not `stacked` have no stack for it to go by.
- `horizontal: Boolean`: whether the places go down the chart's side and the bars along it, and not along its foot and up.
- `labels: ChartDataLabels?`: the values written at the ends of the bars, or inside the bars of a stack, where they have room. `null` writes none.
- `xAxis: ChartAxis?`: the axis of the places, under the chart, or beside it where it is `horizontal`. `null` draws nothing of it.
- `yAxis: ChartAxis?`: the axis of the values, beside the chart, or under it where it is `horizontal`. `null` draws nothing of it.
- `secondYAxis: ChartAxis?`: the second axis of the values, at the chart's other side, or over it where it is `horizontal`: drawn where a value is read by it (`ChartValue.axis`), and not otherwise. `null` draws nothing of it.
- `marks: List<ChartMark>`: the lines and the bands drawn in the plot besides the series: a target, a limit, a stretch of places.
- `legend: ChartLegend?`: where the names of the series stand. `null` shows none.
- `tooltip: ChartTooltip?`: what is shown for the place that is pointed at. `null` shows none.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the places and move along the rest. `null`, which it is unless the chart is given one, shows all the places and no more.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a file: a picture, or a drawing that is sharp at any size. `null`, which it is unless the chart is given one, and the chart has no such button.
- `empty: (@Composable () -> Unit)?`: what the chart shows in its plot while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words. A file the chart is exported as says them.
- `state: ChartState`: what the reader has hidden and what they point at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the value that is pressed.
- `style: ChartStyle?`: this chart's own geometry.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key. The chart is tagged as the `PantrixChart` it is, `Chart_<tagKey>`, and its parts and events are that chart's.

### ChartValue

`import com.pantrixui.components.chart.cartesian.ChartValue`, from `com.pantrixui:components`

```kotlin
class ChartValue<T>(
    public val key: String,
    public val name: String,
    public val color: Color = Color.Unspecified,
    public val dash: ChartDash? = null,
    public val marker: ChartMarker = ChartMarker.None,
    public val axis: ChartYAxis = ChartYAxis.First,
    public val pattern: ChartPattern? = null,
    public val y: (T) -> Number?
)
```

One value of the rows a chart is read from, as a series of it: for the charts that take their rows once and name each series by what it reads from a row.

```kotlin
ChartValue("desktop", "Desktop") { it.desktop }
```

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the chart's series.
- `dash: ChartDash?`: Whether its line is drawn whole, in dashes or in dots. A bar has no line. Null, whole, and where the chart's patterns are on (`ChartStyle.patterns`), as its turn among the chart's series says.
- `marker: ChartMarker`: What marks each of its points. A bar has none.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by: the second, at the chart's other side, for a value of another kind than the first's, a share beside an amount.
- `pattern: ChartPattern?`: The texture its bars, or the room under its line where that is filled, are drawn with besides its colour. Null, none, and where the chart's patterns are on, its turn among the chart's series.
- `y: (T) -> Number?`: A row's value, or null where it has none.

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

### ChartStacking

`import com.pantrixui.components.chart.cartesian.ChartStacking`, from `com.pantrixui:components`

```kotlin
enum class ChartStacking
```

How the series of a stack stand on one another in a `PantrixChart`: as their values, or as their shares of what the stack comes to at each place.

Entries:

- `Normal`: As their values: a stack is as tall as its series' values come to.
- `Percent`: As their shares: every stack is as tall as every other, a hundred percent, and each series takes its share of it, its value over what the values of its stack come to there, under nought or over it. The axis the stacks are read by writes shares, where it writes nothing of its own; the tooltip writes a value with its share after it, and a label the share. A series in no stack is drawn as its values all the same: read it by the second axis.

### ChartOrientation

`import com.pantrixui.components.chart.cartesian.ChartOrientation`, from `com.pantrixui:components`

```kotlin
enum class ChartOrientation
```

Which way the places of a chart go, and so which way its values do.

Entries:

- `Vertical`: The places along the chart's foot, from the side lines start at, and the values up its side: columns.
- `Horizontal`: The places down the chart's side, from its top, and the values along its foot, from the side lines start at: bars. Long names have the room of a line each, written across.
