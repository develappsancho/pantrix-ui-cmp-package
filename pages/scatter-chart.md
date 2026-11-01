# Scatter Chart

Points set out by two values: one along the chart, the other up it. It shows how two things go together: do sales rise with the temperature, does what costs more rate higher too. Give each point a size by a third value and it is a bubble chart.

The chart is given its series; each `ScatterSeries` carries its own rows: where a row stands along the chart (`x`), where up it (`y`) and, for bubbles, how large it is (`size`). Both axes are of values: each goes from a round number under its values to one over them, and marks the round values between.

- `PantrixScatterChart` (`com.pantrixui.components.chart.scatter`, `com.pantrixui:components`): Points set out by two values, and bubbles sized by a third, with two axes of values, lines and bands to read them by, a legend that takes series out and brings them back, a tooltip for the point pointed at, and every point reachable by keys and by a screen reader. Keywords: scatter plot, bubble chart, xy chart, correlation, point cloud.

## Features

- **Bubbles.** The points of a series that is given `size` are bubbles. A bubble's area is as much as its size is of the largest size in the chart: twice the value, twice the area. How large the smallest and the largest bubble are is in the chart's style (`bubbleMinSize`, `bubbleMaxSize`). A chart with bubbles keeps room for the largest at the ends of its axes.
- **A point's name.** `label` says what a point is called: a country, a product. It is the tooltip's heading and what a screen reader says.
- **Axes.** `xAxis` and `yAxis` are the `ChartAxis` of a chart with places: title, format, ends, grid lines. The titles are what the values are called in the tooltip. `sizeAxis` says what the size is called (`title`), how it is written (`format`) and the value the largest bubble stands for (`max`); nothing of it is drawn.
- **Marks.** `marks` draws a line at a value or a band between two; here a mark's `x` is a value of the axis along the chart.
- **The point pointed at.** The point under the pointer, or near it, or touched by a finger, is pointed at: a ring about it, two lines through it and the tooltip that writes its values. Of points that lie on one another, the smallest is pointed at.
- **Keyboard.** The chart is one stop for Tab: the right and left arrows go along the chart between the points of a series, the up and down arrows to the series before and after, Home and End to the series' first and last point, Escape lets go, Enter and Space press the point that is pointed at.
- **State and pressing.** The point that is pointed at is kept in `ChartState`, as a selection whose `x` is the row's place in its series and whose `series` is the series' key. `onSelect` gives the pressed point with the same place.
- **Screen reader.** The chart says its `description`, then each point, series by series, with its name and its values. A chart of more than two hundred points is told by its description alone.
- **Direction.** In a language read from right to left the values along the chart start from the right, and those up it are written at the right.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Zoom.** With `zoom` the reader looks closer at both values at once: a wheel (with Ctrl or Command), two fingers, the plus and minus keys and the buttons look closer; a drag moves what is in view every way.
- **Automation.** `ScatterChart_<tagKey>`; the plot is `.Plot`, the points `.Point_<series>_<number>`, the legend's entries `.Legend_<series>`, the tooltip `.Tooltip`.

## Usage

### Two groups of points

```kotlin
PantrixScatterChart(
    series = listOf(
        ScatterSeries("trial", stringResource(Res.string.trial), trial, x = { it.dose }, y = { it.response }),
        ScatterSeries("control", stringResource(Res.string.control), control, x = { it.dose }, y = { it.response })
    ),
    xAxis = ChartAxis(title = stringResource(Res.string.dose)),
    yAxis = ChartAxis(title = stringResource(Res.string.response)),
    tagKey = "study"
)
```

### Bubbles, each called by its name, with a line at the average

```kotlin
val strings = PantrixTheme.strings
PantrixScatterChart(
    series = listOf(
        ScatterSeries(
            key = "countries",
            name = stringResource(Res.string.countries),
            data = countries,
            x = { it.income },
            y = { it.lifeExpectancy },
            size = { it.population },
            label = { it.name }
        )
    ),
    xAxis = ChartAxis(title = stringResource(Res.string.income), format = { strings.compact(it) }),
    yAxis = ChartAxis(title = stringResource(Res.string.life_expectancy)),
    sizeAxis = ChartAxis(title = stringResource(Res.string.population), format = { strings.compact(it) }),
    marks = listOf(ChartReferenceLine(y = 72, label = stringResource(Res.string.world_average))),
    legend = null,
    tagKey = "countries"
)
```

## Examples

### Two values, two groups

Fifty days of a café: the day's temperature and the cold drinks sold that day. Weekdays and weekends are separate series; the points go up with the temperature, and the weekends higher still.

Move the pointer near a point, or touch one: the tooltip writes the day's two values under the titles of the axes. Pressing an entry of the legend takes that series out of the chart.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

PantrixScatterChart(
    series = listOf(
        ScatterSeries("weekdays", "Weekdays", cafeDays(weekend = false), x = { it.heat }, y = { it.sold }),
        ScatterSeries("weekend", "Weekend", cafeDays(weekend = true), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Temperature (°C)"),
    yAxis = ChartAxis(title = "Cold drinks"),
    description = "Cold drinks sold by temperature",
    tagKey = "plain"
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

### Bubbles

The products of a shop: price, rating and, as the bubble's size, how many were sold in the month. Each point goes by the product's name (`label`); `sizeAxis` says what the size is.

The area grows with the value: the bubble of a product that sold twice as many takes twice the area, not twice the width. Bubbles are drawn half transparent, so that one under another shows through.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixScatterChart(
    series = listOf(
        ScatterSeries(
            key = "products",
            name = "Products",
            data = shopProducts(),
            x = { it.price },
            y = { it.rating },
            size = { it.sold },
            label = { it.name }
        )
    ),
    xAxis = ChartAxis(title = "Price", format = { "${strings.decimal(it)} ₺" }),
    yAxis = ChartAxis(title = "Rating", min = 3.0, max = 5.0),
    sizeAxis = ChartAxis(title = "Sales", format = { "${strings.decimal(it)} sold" }),
    description = "Price, rating and sales of the products",
    tagKey = "bubbles"
)

internal fun shopProducts(): List<ShopProduct> = listOf(
    ShopProduct("Headset", 1450.0, 4.6, 820),
    ShopProduct("Keyboard", 980.0, 4.3, 540),
    ShopProduct("Mouse", 420.0, 4.4, 1260),
    ShopProduct("Monitor", 5200.0, 4.7, 310),
    ShopProduct("Webcam", 760.0, 3.9, 280),
    ShopProduct("Speaker", 1890.0, 4.1, 190),
    ShopProduct("Microphone", 2350.0, 4.5, 150),
    ShopProduct("Charger", 310.0, 4.0, 1640),
    ShopProduct("Cable", 120.0, 3.6, 2100),
    ShopProduct("Tablet pen", 1150.0, 4.2, 95),
    ShopProduct("Laptop stand", 640.0, 4.8, 470),
    ShopProduct("External disk", 2780.0, 4.4, 360)
)

internal class ShopProduct(
    val name: String,
    val price: Double,
    val rating: Double,
    val sold: Int
)
```

### Lines and bands

Marks that help read the points: a line at the average temperature, a line at the day's target, and a band over the hottest days. A mark's `x` is here not the name of a place but a value of the axis along the chart.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceBand
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

PantrixScatterChart(
    series = listOf(
        ScatterSeries("days", "Days", cafeDays(weekend = false), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Temperature (°C)"),
    yAxis = ChartAxis(title = "Cold drinks"),
    marks = listOf(
        ChartReferenceBand(x1 = 28, label = "Hot days"),
        ChartReferenceLine(y = 150, label = "Target"),
        ChartReferenceLine(x = 21, label = "Average")
    ),
    description = "Cold drinks sold by temperature, with the target",
    tagKey = "marks"
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

### Telling series apart by shape

Series are told apart by shape as well as by colour: each is drawn with its own mark (`marker`). It reads for someone who cannot tell the colours apart, and on a black and white print.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

val days = cafeDays(weekend = false)
PantrixScatterChart(
    series = listOf(
        ScatterSeries("cold", "Cold drinks", days, x = { it.heat }, y = { it.sold }),
        ScatterSeries("hot", "Hot drinks", days, x = { it.heat }, y = { it.hot }, marker = ChartMarker.Square),
        ScatterSeries("food", "Food", days, x = { it.heat }, y = { it.food }, marker = ChartMarker.Triangle)
    ),
    xAxis = ChartAxis(title = "Temperature (°C)"),
    yAxis = ChartAxis(title = "Sales"),
    description = "Sales of three groups of products by temperature",
    tagKey = "markers"
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

### Pressing a point

`onSelect` gives the point that is pressed: its `x` is the row's place in its series, its `label` the point's name. Press a bubble, or go to one with the keyboard and press Enter, and the line under the card writes the product that was pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

val report = LocalExampleEvents.current
val products = shopProducts()
PantrixScatterChart(
    series = listOf(
        ScatterSeries(
            key = "products",
            name = "Products",
            data = products,
            x = { it.price },
            y = { it.rating },
            size = { it.sold },
            label = { it.name }
        )
    ),
    xAxis = ChartAxis(title = "Price"),
    yAxis = ChartAxis(title = "Rating", min = 3.0, max = 5.0),
    sizeAxis = ChartAxis(title = "Sales"),
    onSelect = { point -> report("${point.label}: ${products[point.x as Int].sold} sold") },
    description = "Price, rating and sales of the products",
    tagKey = "pressed"
)

internal fun shopProducts(): List<ShopProduct> = listOf(
    ShopProduct("Headset", 1450.0, 4.6, 820),
    ShopProduct("Keyboard", 980.0, 4.3, 540),
    ShopProduct("Mouse", 420.0, 4.4, 1260),
    ShopProduct("Monitor", 5200.0, 4.7, 310),
    ShopProduct("Webcam", 760.0, 3.9, 280),
    ShopProduct("Speaker", 1890.0, 4.1, 190),
    ShopProduct("Microphone", 2350.0, 4.5, 150),
    ShopProduct("Charger", 310.0, 4.0, 1640),
    ShopProduct("Cable", 120.0, 3.6, 2100),
    ShopProduct("Tablet pen", 1150.0, 4.2, 95),
    ShopProduct("Laptop stand", 640.0, 4.8, 470),
    ShopProduct("External disk", 2780.0, 4.4, 360)
)

internal class ShopProduct(
    val name: String,
    val price: Double,
    val rating: Double,
    val sold: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the axes, the points and the legend under them; the point that is pointed at and its tooltip are not in it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixScatterChart(
    series = listOf(
        ScatterSeries("weekdays", "Weekdays", cafeDays(weekend = false), x = { it.heat }, y = { it.sold }),
        ScatterSeries("weekend", "Weekend", cafeDays(weekend = true), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Temperature (°C)"),
    yAxis = ChartAxis(title = "Cold drinks"),
    description = "Cold drinks sold by temperature",
    tagKey = "exported",
    export = ChartExport(fileName = "cold-drinks") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

### Looking closer

`zoom = ChartZoom()` lets the reader look closer at both values at once: a wheel with Ctrl or Command and two fingers look closer about the point between them, plus and minus on the chart about the point that is pointed at, and the buttons about the middle. A drag of the mouse moves what is in view every way; the point the arrows go to comes into view.

Both axes are marked anew for the values in view, and what lies past the plot's edges is cut off. The part across is `state.window`, the part up `state.valueWindow`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

PantrixScatterChart(
    series = listOf(
        ScatterSeries("weekdays", "Weekdays", cafeDays(weekend = false), x = { it.heat }, y = { it.sold }),
        ScatterSeries("weekend", "Weekend", cafeDays(weekend = true), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Temperature (°C)"),
    yAxis = ChartAxis(title = "Cold drinks"),
    description = "Cold drinks sold by temperature",
    tagKey = "zoomed",
    zoom = ChartZoom()
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

## API

### PantrixScatterChart

`import com.pantrixui.components.chart.scatter.PantrixScatterChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixScatterChart(
    series: List<ScatterSeries<*>>,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    sizeAxis: ChartAxis? = null,
    marks: List<ChartMark> = emptyList(),
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null,
    zoom: ChartZoom? = null
)
```

A scatter chart: points set out by two values, one along the chart and one up it, to show how the two go together. With a third value for the size of each point it is a bubble chart.

The chart is given its `series`, and each of them carries its own rows: where a row stands along the chart, where up it, and, for bubbles, how large it is. Both of its axes are of values: each goes from a round number under the least of its values to one over the most, and marks round values between. A chart with bubbles keeps room at the ends of its axes for the largest of them, so that none is cut by the plot's edge.

Around the points stand the parts a chart with places has, each given by what describes it and taken away by `null`: the two axes, the `legend`, which lists the series and takes one out of the chart when its entry is pressed, and the `tooltip`, which shows the values of the point that is pointed at.

**Marks.** A line at a value of either axis, and a band between two, are drawn with the points for them to be read by: an average, a limit, the quarter of the chart that matters. A mark's `x` is here a value of the axis along the chart. See `ChartMark`.

**Pointing at a point.** A pointer over a point, or near it, points at it; a finger does by a tap, and a tap on the point it points at lets go of it. Where points lie on one another, the smallest under the pointer is the one pointed at. With the keyboard the chart is one stop for Tab: the arrows along the chart go from point to point of a series, as they stand along the chart, the arrows up and down go to the series before and after, Home and End to the series' first point and its last, and Escape lets go. The point is marked, the tooltip shown for it, and it is told to `state`, as a selection whose `x` is its place among its series' rows, counted from nought, and whose `series` is its series' key. A press, Enter or Space on it calls `onSelect`.

**To a screen reader** the chart is its `description`, then each point with what it is called and its values, series by series; the legend's entries are switches. A chart of more than two hundred points is told by its description alone.

**Its size.** The chart is as wide as it is given room. A height on its modifier is the whole chart's, the legend's with it; given none, the plot is as tall as the chart's style says and a legend above or under it adds its own.

In a language read from the right the values along the chart run from the right, and those up it are written at the right.

```kotlin
PantrixScatterChart(
    series = listOf(
        ScatterSeries("europe", "Europe", europe, x = { it.income }, y = { it.lifeExpectancy }),
        ScatterSeries("asia", "Asia", asia, x = { it.income }, y = { it.lifeExpectancy })
    ),
    xAxis = ChartAxis(title = "Income"),
    yAxis = ChartAxis(title = "Life expectancy"),
    description = "Life expectancy by income",
    tagKey = "countries"
)
```

Parameters:

- `series: List<ScatterSeries<*>>`: the series, in the order they are listed. Their keys tell them apart, and two with one key are refused.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's, the legend's with it.
- `xAxis: ChartAxis?`: the axis of the values along the chart, under it. Its title is what those values are called in the tooltip and to a screen reader. `null` draws nothing of it.
- `yAxis: ChartAxis?`: the axis of the values up the chart, beside it. `null` draws nothing of it.
- `sizeAxis: ChartAxis?`: what the bubbles' sizes measure: its `title` is what a size is called in the tooltip and to a screen reader, its `format` how one is written, and its `max` the size the largest bubble stands for, where that is not the largest in the chart. Nothing of it is drawn, and nothing else of it is read.
- `marks: List<ChartMark>`: the lines and the bands drawn in the plot besides the points.
- `legend: ChartLegend?`: where the names of the series stand. `null` shows none.
- `tooltip: ChartTooltip?`: what is shown for the point that is pointed at: its heading is what the point is called, and under it a row for each of its values. Its `crosshair` is a line across the plot and one up it through the point, and its `format` writes the value up the chart; a point has no place to share, and `shared` is not read. A tooltip's own `content` is given the point's values, the one along the chart first. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader has hidden and what they point at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its series.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the point that is pressed: its `x` is its place among its series' rows, counted from nought, its `label` what it is called, and its `value` its value up the chart.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `ScatterChart_<tagKey>`, its plot `ScatterChart_<tagKey>.Plot`, a point `ScatterChart_<tagKey>.Point_<series' key>_<number>`, the number being its row's counted from one, the legend's entry of a series `ScatterChart_<tagKey>.Legend_<series' key>` and the tooltip `ScatterChart_<tagKey>.Tooltip`. A press on a point is reported as a `ScatterChart` `select` event with the series' key, and a press on a legend's entry as a `toggle` event with the key and whether the series is shown. Nothing of the values is reported.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the chart's values, across it and up it alike (see `ChartZoom`): a wheel with Ctrl or Command and two fingers look closer about the point between them, plus and minus on the chart about the point that is pointed at, and the buttons about the middle; a drag of the mouse moves what is in view every way, the buttons along it, and the arrows bring the point they go to into view. Both axes are marked anew for the values in view, and what lies past the plot's edges is cut off. The parts are kept in `state`, as its `window` and its `valueWindow`. A scatter chart has no navigator: its `navigator` is not read, nor is its `fitValues`. `null`, the chart shows all its values.

### ScatterSeries

`import com.pantrixui.components.chart.scatter.ScatterSeries`, from `com.pantrixui:components`

```kotlin
class ScatterSeries<T>(
    public val key: String,
    public val name: String,
    public val data: List<T>,
    public val x: (T) -> Number?,
    public val y: (T) -> Number?,
    public val size: ((T) -> Number?)? = null,
    public val label: ((T) -> String?)? = null,
    public val color: Color = Color.Unspecified,
    public val marker: ChartMarker? = null,
    public val pattern: ChartPattern? = null
)
```

One group of points in a `PantrixScatterChart`: the rows it is read from, where each of them stands along the chart and up it, and, for bubbles, how large each is.

```kotlin
ScatterSeries("europe", "Europe", countries, x = { it.income }, y = { it.lifeExpectancy })
```

`x` and `y` are numbers, and a row stands where the two put it. A row that has no number for either, or one with no end, has no point. With `size` each point is a bubble: its area is as much of the largest bubble's as its size is of the largest size in the chart, so that a value twice another's is twice its area. `label` is what a point is called, a country, a product: the heading of its tooltip, and what a screen reader says of it.

Two series are the same series where everything they were built from is the same, the functions among them: a chart whose caller builds its series anew each time is not drawn anew for it.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its rows change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows.
- `x: (T) -> Number?`: Where a row stands along the chart.
- `y: (T) -> Number?`: Where it stands up the chart.
- `size: ((T) -> Number?)?`: How large a row's point is, for a chart of bubbles. Left out, the series' points are marks of one size. A row whose size is no number, or is not over nought, is the smallest bubble.
- `label: ((T) -> String?)?`: What a row's point is called. Left out, a point goes by its series' name.
- `color: Color`: The colour the series is drawn in. Left out, it is the theme's chart colour for its place among the series of the chart: the first of them for the first.
- `marker: ChartMarker?`: What a point of the series is drawn as. Shapes tell series apart where colours alone would not. A bubble is a circle whatever this says. Null, a circle, and where the chart's patterns are on (`ChartStyle.patterns`), a circle, a square, a diamond or a triangle by its place among the chart's series.
- `pattern: ChartPattern?`: The texture its bubbles are drawn with besides their colour. Null, none, and where the chart's patterns are on, its turn by its place among the chart's series. A point that is a mark has none.

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
