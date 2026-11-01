# Candlestick Chart

A chart that shows, at each place, what something opened at, what it closed at, and the highest and the lowest it reached between: a price's trading day, a temperature's day, a measurement's shift.

It is the short way to write a `PantrixChart` that has a single `CandlestickSeries`. The axes, the tooltip, the state, the keyboard and the screen reader are as the "Chart" page tells.

- `PantrixCandlestickChart` (`com.pantrixui.components.chart.candlestick`, `com.pantrixui:components`): What something opened at, closed at, and the highest and the lowest it reached between, at each place: a body with a wick, in the colour of the way it closed, or an OHLC bar. The short way to a chart of one series of candles. Keywords: ohlc, stock chart, financial chart, price chart, candles.

## Features

- **Candle.** Each place has a body from its opening to its close, and a thin wick through the body's middle from the lowest to the highest. A candle that closes over its opening is drawn in the chart's `rising` colour and one that closes under it in its `falling` colour: the theme's `success` and `danger`, unless `colors` says otherwise. A candle that closes where it opened is a line across, in the series' own colour (`color`).
- **OHLC bar.** `kind = CandleKind.Ohlc` draws a line in place of the body: from the lowest to the highest, with a tick at the opening on the side lines come from and one at the close on the side they go to. It stays apart where candles would crowd.
- **Hollow candle.** `hollow = true` draws the body of a candle that closed higher as its outline alone, with the wick outside the body: the way it went is read without its colour too. A candle that closed lower stays filled.
- **A candle's own colour.** `colorOf` gives a row's candle a colour of its own (a day of news); the candle of a row that gives `Color.Unspecified` stays in the colour of its way.
- **Legend.** In the legend a series of candles is a sample of two halves: the rising colour and the falling one.
- **Volume.** A `BarSeries` with `behind = true` stands behind the candle at each place, as wide as it: the day's trading volume. It is read by the second axis, and that axis' top keeps the bars low in the chart.
- **Four values.** A row has all four values, or it has no candle. The wick is no shorter than the body: a highest given under the close is taken for the close.
- **Nought.** The axis of values does not take nought in by itself: what is read is how the value moves, not how large it is.
- **Tooltip and screen reader.** A candle is written as its four values, each by its name in the theme's language: open, high, low, close. A press is handed the close in the point's `value`, the opening in its `from`, and the two ends of the wick in its `high` and `low`.
- **With other series.** Candles stand together with lines in a `PantrixChart`: a moving average, a target.
- **Time axis.** When the rows' `x` gives a moment (`kotlin.time.Instant`), the candles stand where their moments are: a day with no row is a gap, and the axis is marked at round dates, not at the days.
- **Automation.** The chart is tagged as the `PantrixChart` it is: `Chart_<tagKey>`. Its one series has the key `candles`.

## Usage

### A month of a price, day by day

```kotlin
PantrixCandlestickChart(
    data = days,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = stringResource(Res.string.price),
    description = stringResource(Res.string.price_of_the_month),
    tagKey = "price"
)
```

### OHLC bars in the brand's own colours, with a level that held

```kotlin
PantrixCandlestickChart(
    data = days,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = stringResource(Res.string.price),
    kind = CandleKind.Ohlc,
    marks = listOf(ChartReferenceLine(y = 120, label = stringResource(Res.string.support))),
    colors = ChartColors(rising = brand.gain, falling = brand.loss),
    tagKey = "price_bars"
)
```

## Examples

### Three weeks of a price

Three weeks of a share, trading day by trading day. The days that closed higher are in one colour and those that closed lower in the other; the fourteenth day closed where it opened, and stands as a line.

Move the pointer over a candle, or touch the candle: the tooltip writes the four values by their names.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.candlestick.PantrixCandlestickChart

PantrixCandlestickChart(
    data = THREE_WEEKS,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Price (TL)",
    description = "A share's daily price over three weeks",
    tagKey = "plain"
)

private data class PriceDay(
    val day: String,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)

private val THREE_WEEKS = listOf(
    PriceDay("1", open = 118.0, high = 121.5, low = 116.8, close = 120.4),
    PriceDay("2", open = 120.4, high = 123.0, low = 119.6, close = 122.1),
    PriceDay("3", open = 122.1, high = 122.9, low = 118.2, close = 119.0),
    PriceDay("4", open = 119.0, high = 120.2, low = 116.9, close = 117.3),
    PriceDay("5", open = 117.3, high = 119.8, low = 117.0, close = 119.5),
    PriceDay("8", open = 119.5, high = 124.6, low = 119.1, close = 124.0),
    PriceDay("9", open = 124.0, high = 126.3, low = 122.8, close = 123.2),
    PriceDay("10", open = 123.2, high = 125.1, low = 121.7, close = 124.8),
    PriceDay("11", open = 124.8, high = 128.9, low = 124.2, close = 128.1),
    PriceDay("12", open = 128.1, high = 129.4, low = 125.6, close = 126.0),
    PriceDay("15", open = 126.0, high = 127.2, low = 123.4, close = 123.9),
    PriceDay("16", open = 123.9, high = 124.5, low = 120.8, close = 121.6),
    PriceDay("17", open = 121.6, high = 123.7, low = 117.1, close = 123.7),
    PriceDay("18", open = 123.7, high = 125.0, low = 122.5, close = 123.7),
    PriceDay("19", open = 123.7, high = 127.8, low = 123.1, close = 127.0)
)
```

### OHLC bars

The same days as OHLC bars: a line from the lowest to the highest, with the opening's tick at its left and the close's at its right. Turn the switch: the bars become candles.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.candlestick.PantrixCandlestickChart
import com.pantrixui.components.chart.cartesian.CandleKind
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var bars by remember { mutableStateOf(true) }
PantrixSwitchButton(
    checked = bars,
    onCheckedChange = { bars = it },
    label = "OHLC bars",
    tagKey = "candlestick_ohlc"
)
PantrixCandlestickChart(
    data = THREE_WEEKS,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Price (TL)",
    kind = if (bars) CandleKind.Ohlc else CandleKind.Candle,
    description = "A share's daily price over three weeks, as OHLC bars",
    tagKey = "ohlc"
)

private data class PriceDay(
    val day: String,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)

private val THREE_WEEKS = listOf(
    PriceDay("1", open = 118.0, high = 121.5, low = 116.8, close = 120.4),
    PriceDay("2", open = 120.4, high = 123.0, low = 119.6, close = 122.1),
    PriceDay("3", open = 122.1, high = 122.9, low = 118.2, close = 119.0),
    PriceDay("4", open = 119.0, high = 120.2, low = 116.9, close = 117.3),
    PriceDay("5", open = 117.3, high = 119.8, low = 117.0, close = 119.5),
    PriceDay("8", open = 119.5, high = 124.6, low = 119.1, close = 124.0),
    PriceDay("9", open = 124.0, high = 126.3, low = 122.8, close = 123.2),
    PriceDay("10", open = 123.2, high = 125.1, low = 121.7, close = 124.8),
    PriceDay("11", open = 124.8, high = 128.9, low = 124.2, close = 128.1),
    PriceDay("12", open = 128.1, high = 129.4, low = 125.6, close = 126.0),
    PriceDay("15", open = 126.0, high = 127.2, low = 123.4, close = 123.9),
    PriceDay("16", open = 123.9, high = 124.5, low = 120.8, close = 121.6),
    PriceDay("17", open = 121.6, high = 123.7, low = 117.1, close = 123.7),
    PriceDay("18", open = 123.7, high = 125.0, low = 122.5, close = 123.7),
    PriceDay("19", open = 123.7, high = 127.8, low = 123.1, close = 127.0)
)
```

### Your own colours and a level

The colours of the two ways come from the chart's colours (the `rising` and `falling` fields of `ChartColors`), and the colour of a candle that closes where it opened from the series itself (`color`). And the level the price came back to three times: a reference line.

Colour should not carry meaning alone: which way a candle went is read from the opening and the close in the tooltip too.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.candlestick.PantrixCandlestickChart
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.common.ChartColors
import com.pantrixui.foundation.theme.PantrixTheme

val theme = PantrixTheme.colors
PantrixCandlestickChart(
    data = THREE_WEEKS,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Price (TL)",
    color = theme.neutral.color,
    marks = listOf(ChartReferenceLine(y = 117, label = "Support")),
    colors = ChartColors(rising = theme.info.color, falling = theme.warning.color),
    description = "A share's daily price over three weeks, in its own colours and with a support level",
    tagKey = "own_colors"
)

private data class PriceDay(
    val day: String,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)

private val THREE_WEEKS = listOf(
    PriceDay("1", open = 118.0, high = 121.5, low = 116.8, close = 120.4),
    PriceDay("2", open = 120.4, high = 123.0, low = 119.6, close = 122.1),
    PriceDay("3", open = 122.1, high = 122.9, low = 118.2, close = 119.0),
    PriceDay("4", open = 119.0, high = 120.2, low = 116.9, close = 117.3),
    PriceDay("5", open = 117.3, high = 119.8, low = 117.0, close = 119.5),
    PriceDay("8", open = 119.5, high = 124.6, low = 119.1, close = 124.0),
    PriceDay("9", open = 124.0, high = 126.3, low = 122.8, close = 123.2),
    PriceDay("10", open = 123.2, high = 125.1, low = 121.7, close = 124.8),
    PriceDay("11", open = 124.8, high = 128.9, low = 124.2, close = 128.1),
    PriceDay("12", open = 128.1, high = 129.4, low = 125.6, close = 126.0),
    PriceDay("15", open = 126.0, high = 127.2, low = 123.4, close = 123.9),
    PriceDay("16", open = 123.9, high = 124.5, low = 120.8, close = 121.6),
    PriceDay("17", open = 121.6, high = 123.7, low = 117.1, close = 123.7),
    PriceDay("18", open = 123.7, high = 125.0, low = 122.5, close = 123.7),
    PriceDay("19", open = 123.7, high = 127.8, low = 123.1, close = 127.0)
)
```

### Candles and an average line

Candles are one of the series of a `PantrixChart`, and stand together with lines: here the three-day average of the closes, as a dashed line. Since there are two series the legend comes by itself; the tooltip writes the two together.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.CandlestickSeries
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDash

val averages = remember { averagesOf(THREE_WEEKS, days = 3) }
PantrixChart(
    series = listOf(
        CandlestickSeries(
            key = "price",
            name = "Price (TL)",
            data = THREE_WEEKS,
            x = { it.day },
            open = { it.open },
            high = { it.high },
            low = { it.low },
            close = { it.close }
        ),
        LineSeries(
            key = "average",
            name = "Three-day average",
            data = averages,
            x = { it.first },
            y = { it.second },
            dash = ChartDash.Dashed
        )
    ),
    description = "A share's daily price and the three-day average of its closes",
    tagKey = "average"
)

private data class PriceDay(
    val day: String,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)

private val THREE_WEEKS = listOf(
    PriceDay("1", open = 118.0, high = 121.5, low = 116.8, close = 120.4),
    PriceDay("2", open = 120.4, high = 123.0, low = 119.6, close = 122.1),
    PriceDay("3", open = 122.1, high = 122.9, low = 118.2, close = 119.0),
    PriceDay("4", open = 119.0, high = 120.2, low = 116.9, close = 117.3),
    PriceDay("5", open = 117.3, high = 119.8, low = 117.0, close = 119.5),
    PriceDay("8", open = 119.5, high = 124.6, low = 119.1, close = 124.0),
    PriceDay("9", open = 124.0, high = 126.3, low = 122.8, close = 123.2),
    PriceDay("10", open = 123.2, high = 125.1, low = 121.7, close = 124.8),
    PriceDay("11", open = 124.8, high = 128.9, low = 124.2, close = 128.1),
    PriceDay("12", open = 128.1, high = 129.4, low = 125.6, close = 126.0),
    PriceDay("15", open = 126.0, high = 127.2, low = 123.4, close = 123.9),
    PriceDay("16", open = 123.9, high = 124.5, low = 120.8, close = 121.6),
    PriceDay("17", open = 121.6, high = 123.7, low = 117.1, close = 123.7),
    PriceDay("18", open = 123.7, high = 125.0, low = 122.5, close = 123.7),
    PriceDay("19", open = 123.7, high = 127.8, low = 123.1, close = 127.0)
)

private fun averagesOf(
    prices: List<PriceDay>,
    days: Int
): List<Pair<String, Double?>> = prices.mapIndexed { index, price ->
    val last = prices.subList((index - days + 1).coerceAtLeast(0), index + 1)
    price.day to last.takeIf { it.size == days }?.map { it.close }?.average()
}
```

### Hollow candles and volume

The day's trading volume behind the candles: a `BarSeries` with `behind = true` stands behind the candle at each place, as wide as it, though it is given after the candles. It is read by the second axis (`axis = ChartYAxis.Second`); that axis goes up to three times the largest volume, and the bars stay in the lower third of the chart.

The candles are hollow (`hollow`): the body of a day that closed higher is its outline alone. The candle of the 11th, a day of news, is in a colour of its own (`colorOf`). In the legend the series of candles is a sample of two halves: the rising colour and the falling one.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.CandlestickSeries
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartYAxis
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var hollow by remember { mutableStateOf(true) }
val theme = PantrixTheme.colors
PantrixSwitchButton(
    checked = hollow,
    onCheckedChange = { hollow = it },
    label = "Hollow candles",
    tagKey = "candles_hollow"
)
PantrixChart(
    series = listOf(
        CandlestickSeries(
            key = "price",
            name = "Price (TL)",
            data = THREE_WEEKS,
            x = { it.day },
            open = { it.open },
            high = { it.high },
            low = { it.low },
            close = { it.close },
            hollow = hollow,
            colorOf = { if (it.day == NEWS_DAY) theme.warning.color else Color.Unspecified }
        ),
        BarSeries(
            key = "volume",
            name = "Volume (thousand lots)",
            data = THREE_WEEKS.zip(VOLUMES),
            x = { it.first.day },
            y = { it.second },
            color = theme.neutral.color.copy(alpha = VOLUME_TINT),
            behind = true,
            axis = ChartYAxis.Second
        )
    ),
    secondYAxis = ChartAxis(labels = false, max = VOLUMES.max() * 3.0),
    description = "A share's daily price and trading volume over three weeks",
    tagKey = "volume"
)

private data class PriceDay(
    val day: String,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)

private val THREE_WEEKS = listOf(
    PriceDay("1", open = 118.0, high = 121.5, low = 116.8, close = 120.4),
    PriceDay("2", open = 120.4, high = 123.0, low = 119.6, close = 122.1),
    PriceDay("3", open = 122.1, high = 122.9, low = 118.2, close = 119.0),
    PriceDay("4", open = 119.0, high = 120.2, low = 116.9, close = 117.3),
    PriceDay("5", open = 117.3, high = 119.8, low = 117.0, close = 119.5),
    PriceDay("8", open = 119.5, high = 124.6, low = 119.1, close = 124.0),
    PriceDay("9", open = 124.0, high = 126.3, low = 122.8, close = 123.2),
    PriceDay("10", open = 123.2, high = 125.1, low = 121.7, close = 124.8),
    PriceDay("11", open = 124.8, high = 128.9, low = 124.2, close = 128.1),
    PriceDay("12", open = 128.1, high = 129.4, low = 125.6, close = 126.0),
    PriceDay("15", open = 126.0, high = 127.2, low = 123.4, close = 123.9),
    PriceDay("16", open = 123.9, high = 124.5, low = 120.8, close = 121.6),
    PriceDay("17", open = 121.6, high = 123.7, low = 117.1, close = 123.7),
    PriceDay("18", open = 123.7, high = 125.0, low = 122.5, close = 123.7),
    PriceDay("19", open = 123.7, high = 127.8, low = 123.1, close = 127.0)
)

private val VOLUMES = listOf(820, 940, 1210, 1080, 760, 1430, 990, 870, 2650, 1320, 1040, 1180, 1510, 690, 1120)

private const val NEWS_DAY = "11"

private const val VOLUME_TINT = 0.32f
```

### Days on the calendar

The same three weeks, this time with each day as a moment: the first three weeks of June 2026. The candles stand where they are on the calendar, the two weekends show as gaps, and the axis is marked at the start of each week.

Turn the switch on (`ChartTime(gapless = true)`): the weekends, when the market is closed, close up, the candles stand side by side at even steps, and the axis is still marked at days or weeks, at the first candle of each.

The days are days of UTC, so the axis is read by UTC too (the `offset` of `ChartTime`): whatever the device's clock, a candle stands on its own day.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.candlestick.PantrixCandlestickChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import kotlin.time.Duration
import kotlin.time.Instant

var gapless by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = gapless,
    onCheckedChange = { gapless = it },
    label = "Without weekends",
    tagKey = "candles_gapless"
)
PantrixCandlestickChart(
    data = THREE_WEEKS,
    x = { dayOf(it) },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Price (TL)",
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO }, gapless = gapless)),
    description = "A share's daily price in the first three weeks of June 2026, on the days of the calendar",
    tagKey = "in_time"
)

private data class PriceDay(
    val day: String,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)

private val THREE_WEEKS = listOf(
    PriceDay("1", open = 118.0, high = 121.5, low = 116.8, close = 120.4),
    PriceDay("2", open = 120.4, high = 123.0, low = 119.6, close = 122.1),
    PriceDay("3", open = 122.1, high = 122.9, low = 118.2, close = 119.0),
    PriceDay("4", open = 119.0, high = 120.2, low = 116.9, close = 117.3),
    PriceDay("5", open = 117.3, high = 119.8, low = 117.0, close = 119.5),
    PriceDay("8", open = 119.5, high = 124.6, low = 119.1, close = 124.0),
    PriceDay("9", open = 124.0, high = 126.3, low = 122.8, close = 123.2),
    PriceDay("10", open = 123.2, high = 125.1, low = 121.7, close = 124.8),
    PriceDay("11", open = 124.8, high = 128.9, low = 124.2, close = 128.1),
    PriceDay("12", open = 128.1, high = 129.4, low = 125.6, close = 126.0),
    PriceDay("15", open = 126.0, high = 127.2, low = 123.4, close = 123.9),
    PriceDay("16", open = 123.9, high = 124.5, low = 120.8, close = 121.6),
    PriceDay("17", open = 121.6, high = 123.7, low = 117.1, close = 123.7),
    PriceDay("18", open = 123.7, high = 125.0, low = 122.5, close = 123.7),
    PriceDay("19", open = 123.7, high = 127.8, low = 123.1, close = 127.0)
)

private fun dayOf(price: PriceDay): Instant = Instant.parse("2026-06-${price.day.padStart(2, '0')}T00:00:00Z")
```

### Pressing a candle

A press is handed the candle: the point's `value` is the close, its `from` the opening, and its `high` and `low` the two ends of the wick. Press a candle: the line below writes how much the day moved and how it closed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.candlestick.PantrixCandlestickChart
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var pressed by remember { mutableStateOf<String?>(null) }
val strings = PantrixTheme.strings
PantrixCandlestickChart(
    data = THREE_WEEKS,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Price (TL)",
    onSelect = { point ->
        val open = point.from ?: point.value
        val swing = (point.high ?: point.value) - (point.low ?: point.value)
        val change = strings.decimal(point.value - open)
        pressed = "Day ${point.label}: moved ${strings.decimal(swing)} TL, $change TL at the close"
    },
    description = "A share's daily price over three weeks",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Press a candle")

private data class PriceDay(
    val day: String,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)

private val THREE_WEEKS = listOf(
    PriceDay("1", open = 118.0, high = 121.5, low = 116.8, close = 120.4),
    PriceDay("2", open = 120.4, high = 123.0, low = 119.6, close = 122.1),
    PriceDay("3", open = 122.1, high = 122.9, low = 118.2, close = 119.0),
    PriceDay("4", open = 119.0, high = 120.2, low = 116.9, close = 117.3),
    PriceDay("5", open = 117.3, high = 119.8, low = 117.0, close = 119.5),
    PriceDay("8", open = 119.5, high = 124.6, low = 119.1, close = 124.0),
    PriceDay("9", open = 124.0, high = 126.3, low = 122.8, close = 123.2),
    PriceDay("10", open = 123.2, high = 125.1, low = 121.7, close = 124.8),
    PriceDay("11", open = 124.8, high = 128.9, low = 124.2, close = 128.1),
    PriceDay("12", open = 128.1, high = 129.4, low = 125.6, close = 126.0),
    PriceDay("15", open = 126.0, high = 127.2, low = 123.4, close = 123.9),
    PriceDay("16", open = 123.9, high = 124.5, low = 120.8, close = 121.6),
    PriceDay("17", open = 121.6, high = 123.7, low = 117.1, close = 123.7),
    PriceDay("18", open = 123.7, high = 125.0, low = 122.5, close = 123.7),
    PriceDay("19", open = 123.7, high = 127.8, low = 123.1, close = 127.0)
)
```

## API

### PantrixCandlestickChart

`import com.pantrixui.components.chart.candlestick.PantrixCandlestickChart`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixCandlestickChart(
    data: List<T>,
    x: (T) -> Any,
    open: (T) -> Number?,
    high: (T) -> Number?,
    low: (T) -> Number?,
    close: (T) -> Number?,
    name: String,
    modifier: Modifier = Modifier,
    kind: CandleKind = CandleKind.Candle,
    hollow: Boolean = false,
    color: Color = Color.Unspecified,
    colorOf: ((T) -> Color)? = null,
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

A candlestick chart: at each place what something opened at and closed at, and the highest and the lowest it reached between the two, as a price does in a day of trading.

It is a `PantrixChart` with one `CandlestickSeries`, written shorter: it does everything a chart does. A place has a body from its opening to its close and a thin wick from its lowest to its highest. A candle that closes over its opening is drawn in the chart's `rising` colour and one that closes under it in its `falling` colour, the theme's `success` and `danger` unless `colors` says otherwise; one that closes where it opened is a line across, in `color`.

A row has all four values or none: where one is missing, the place has no candle. The axis of values does not take nought in by itself: it goes from a round number under the lowest to one over the highest.

In the tooltip and to a screen reader a candle is its four values, each called by what it is in the theme's language. A press is handed the close as the point's `value`, the opening as its `from`, and the ends of the wick as its `high` and its `low`.

Where every row's `x` is a moment, a `kotlin.time.Instant`, the candles stand where their moments are, and a day with no row is a gap: a weekend between two weeks of trading.

```kotlin
PantrixCandlestickChart(
    data = days,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Price",
    tagKey = "price"
)
```

Parameters:

- `data: List<T>`: the rows.
- `x: (T) -> Any`: where a row stands along the chart: a moment, a day's name, anything that is equal to itself.
- `open: (T) -> Number?`: what a row opened at, or null where it has no value.
- `high: (T) -> Number?`: the highest it reached.
- `low: (T) -> Number?`: the lowest it reached.
- `close: (T) -> Number?`: what it closed at.
- `name: String`: what the values are of: what a screen reader calls the chart where it has no `description`.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's.
- `kind: CandleKind`: whether a place is drawn as a candle or as an OHLC bar: a line with a tick at each side.
- `hollow: Boolean`: whether the body of a candle that closes over its opening is its outline alone, with the wick outside it. An OHLC bar is drawn the same either way.
- `color: Color`: the colour of a candle that closes where it opened. Left out, it is the first of the chart's colours.
- `colorOf: ((T) -> Color)?`: the colour of a row's candle, or `Color.Unspecified` for the colour of the way it went. `null` gives every candle the colour of its way.
- `xAxis: ChartAxis?`: the axis of the places, under the chart. `null` draws nothing of it.
- `yAxis: ChartAxis?`: the axis of the values, beside the chart. `null` draws nothing of it.
- `marks: List<ChartMark>`: the lines and the bands drawn in the plot besides the candles: a level that held, a target.
- `tooltip: ChartTooltip?`: what is shown for the place that is pointed at. `null` shows none.
- `zoom: ChartZoom?`: what lets the reader look closer at a part of the places and move along the rest. `null`, which it is unless the chart is given one, shows all the places and no more.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a file: a picture, or a drawing that is sharp at any size. `null`, which it is unless the chart is given one, and the chart has no such button.
- `empty: (@Composable () -> Unit)?`: what the chart shows in its plot while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words. A file the chart is exported as says them.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the candle that is pressed.
- `style: ChartStyle?`: this chart's own geometry: a candle is as wide as a bar, and its wick as thin as the grid's lines.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's: `rising` and `falling` among them.
- `tagKey: String?`: the chart's automation key. The chart is tagged as the `PantrixChart` it is, `Chart_<tagKey>`, and its parts and events are that chart's; its one series has the key `candles`.

### CandlestickSeries

`import com.pantrixui.components.chart.cartesian.CandlestickSeries`, from `com.pantrixui:components`

```kotlin
class CandlestickSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val open: (T) -> Number?,
    public val high: (T) -> Number?,
    public val low: (T) -> Number?,
    public val close: (T) -> Number?,
    override val color: Color = Color.Unspecified,
    public val kind: CandleKind = CandleKind.Candle,
    public val hollow: Boolean = false,
    public val colorOf: ((T) -> Color)? = null,
    override val axis: ChartYAxis = ChartYAxis.First
) : ChartSeries()
```

A series of four values at a place: what something opened at there and closed at, and the highest and the lowest it reached between the two, as a price does in a day of trading.

```kotlin
CandlestickSeries(
    key = "price",
    name = "Price",
    data = days,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close }
)
```

A place has a body from its opening to its close, as wide as a bar, and a thin wick through the body's middle from the lowest to the highest. A candle that closes over its opening is drawn in the chart's `rising` colour and one that closes under it in its `falling` colour, which a chart's `colors` say; one that closes where it opened is a line across, in the series' own `color`. A `hollow` series draws the body of a candle that closes over its opening as its outline alone, with the wick outside it, which tells the two ways apart without their colours. `colorOf` gives a candle a colour of its own, a day of news in another, and the way it went to the others. In the legend a series of candles has a sample of two halves, the rising colour and the falling one.

A row has all four values or none: where one is missing, or is no number, the place has no candle. The wick reaches at least as far as the body does: a highest under the close is taken for the close.

In the tooltip a candle has a row for each of its four values, called by what it is in the theme's language, and a screen reader is told the same. A press is handed the close as the point's `value`, the opening as its `from`, and the two ends of the wick as its `high` and its `low`.

A chart that has candles gives each place a band of its width, as a chart with bars does. Its axis of values does not take nought in by itself: what is read is how the values move, not how large they are. The series is of no stack, and writes no values at its marks.

Two series are the same series where everything they were built from is the same, the functions among them.

Parameters:

- `key: String`: What tells the series from the others of its chart, and stays the same while its values change: what the legend keeps a hidden series by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the series is called: in the legend, in the tooltip and to a screen reader.
- `data: List<T>`: The rows.
- `x: (T) -> Any`: Where a row stands along the chart: a moment, a day's name, anything that is equal to itself.
- `open: (T) -> Number?`: What the row opened at.
- `high: (T) -> Number?`: The highest it reached.
- `low: (T) -> Number?`: The lowest it reached.
- `close: (T) -> Number?`: What it closed at.
- `color: Color`: The colour of a candle that closes where it opened, and of the series in a legend. Left out, it is the theme's chart colour for the series' place among the series of the chart.
- `kind: CandleKind`: Whether a place is drawn as a candle or as an OHLC bar.
- `hollow: Boolean`: Whether the body of a candle that closes over its opening is its outline alone. An OHLC bar has no body, and is drawn the same either way.
- `colorOf: ((T) -> Color)?`: The colour of a row's candle, or `Color.Unspecified` for the colour of the way it went. Null gives every candle the colour of its way.
- `axis: ChartYAxis`: Which of the chart's axes of values the series is read by.

### CandleKind

`import com.pantrixui.components.chart.cartesian.CandleKind`, from `com.pantrixui:components`

```kotlin
enum class CandleKind
```

How a `CandlestickSeries` draws the four values of a place.

Entries:

- `Candle`: A body from the opening to the close, with a wick through its middle from the lowest to the highest.
- `Ohlc`: A line from the lowest to the highest, with a tick before it at the opening and one after it at the close: an OHLC bar, which stays apart from its neighbours where candles would crowd.

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
