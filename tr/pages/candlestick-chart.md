# Candlestick Chart

Bir şeyin her yerde neyle açıldığını, neyle kapandığını ve arada vardığı en yüksek ve en düşük değeri gösteren grafik: bir fiyatın işlem günü, bir sıcaklığın günü, bir ölçümün vardiyası.

Tek bir `CandlestickSeries` taşıyan bir `PantrixChart`'ın kısa yazılışıdır. Eksenler, tooltip, durum, klavye ve ekran okuyucu "Chart" sayfasında anlatıldığı gibidir.

- `PantrixCandlestickChart` (`com.pantrixui.components.chart.candlestick`, `com.pantrixui:components`): Bir şeyin her yerde neyle açıldığı, neyle kapandığı ve arada ulaştığı en yüksek ve en düşük değer: kapanış yönünün renginde fitilli bir gövde ya da bir OHLC çubuğu. Tek bir mum serisinin grafiğinin kısa yolu. Anahtar sözcükler: mum grafik, ohlc, borsa grafiği, finans grafiği, fiyat grafiği, mumlar.

## Özellikler

- **Mum.** Her yerin açılışından kapanışına bir gövdesi, gövdenin ortasından en düşükten en yükseğe giden ince bir fitili vardır. Açılışının üstünde kapanan mum grafiğin `rising` renginde, altında kapanan `falling` renginde çizilir: temanın `success` ve `danger` renkleri, `colors` başka söylemedikçe. Açıldığı yerde kapanan mum bir yatay çizgidir ve serinin kendi rengindedir (`color`).
- **OHLC çubuğu.** `kind = CandleKind.Ohlc` gövde yerine bir çizgi çizer: en düşükten en yükseğe, açılışta satırların geldiği yana, kapanışta gittiği yana birer çentikle. Mumların sıkıştığı yerde ayrık kalır.
- **İçi boş mum.** `hollow = true` yukarı kapanan mumun gövdesini yalnız çerçevesiyle çizer, fitil gövdenin dışında kalır: yön renksiz de okunur. Aşağı kapanan mum dolu kalır.
- **Mumun kendi rengi.** `colorOf` bir satırın mumuna kendi rengini verir (bir haber günü); `Color.Unspecified` veren satırın mumu yönünün renginde kalır.
- **Lejant.** Lejantta mum serisi iki yarılı bir örnektir: yükselişin ve düşüşün rengi.
- **Hacim.** `behind = true` olan bir `BarSeries` her yerde mumun arkasında, onun genişliğinde durur: günün işlem hacmi. İkinci eksene göre okunur ve o eksenin üst sınırı çubukları grafiğin altında tutar.
- **Dört değer.** Bir satırın dört değeri de vardır ya da mumu yoktur. Fitil gövdeden kısa olmaz: kapanışın altında verilen bir en yüksek, kapanış sayılır.
- **Sıfır.** Değer ekseni sıfırı kendiliğinden içine almaz: okunan, değerin büyüklüğü değil hareketidir.
- **Tooltip ve ekran okuyucu.** Bir mum dört değeriyle yazılır, her biri temanın dilindeki adıyla: açılış, en yüksek, en düşük, kapanış. Bir basış, noktanın `value`'sunda kapanışı, `from`'unda açılışı, `high` ve `low`'unda fitilin iki ucunu alır.
- **Başka serilerle.** Mumlar bir `PantrixChart`'ta çizgilerle birlikte durur: bir hareketli ortalama, bir hedef.
- **Zaman ekseni.** Satırların `x`'i bir an (`kotlin.time.Instant`) verdiğinde mumlar anlarının olduğu yerde durur: satırı olmayan gün bir boşluktur, eksen de günlere değil yuvarlak tarihlere işaretlenir.
- **Otomasyon.** Grafik, olduğu `PantrixChart` gibi etiketlenir: `Chart_<tagKey>`. Tek serisinin anahtarı `candles`'tır.

## Kullanım

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

## Örnekler

### Bir fiyatın üç haftası

Bir hissenin üç haftası, işlem günü işlem günü. Yukarı kapanan günler bir renkte, aşağı kapananlar öbüründe; on dördüncü gün açıldığı yerde kapanmış ve bir çizgi olarak duruyor.

İmleci bir mumun üstüne getir ya da muma dokun: tooltip dört değeri adlarıyla yazar.

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
    name = "Fiyat (TL)",
    description = "Bir hissenin üç haftalık günlük fiyatı",
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

### OHLC çubukları

Aynı günler OHLC çubuklarıyla: en düşükten en yükseğe bir çizgi, solunda açılışın, sağında kapanışın çentiği. Anahtarı çevir: çubuklar muma döner.

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
    label = "OHLC çubukları",
    tagKey = "candlestick_ohlc"
)
PantrixCandlestickChart(
    data = THREE_WEEKS,
    x = { it.day },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Fiyat (TL)",
    kind = if (bars) CandleKind.Ohlc else CandleKind.Candle,
    description = "Bir hissenin üç haftalık günlük fiyatı, OHLC çubuklarıyla",
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

### Kendi renklerin ve bir seviye

İki yönün rengi grafiğin renklerinden gelir (`ChartColors`'ın `rising` ve `falling` alanları), açıldığı yerde kapanan mumun rengi serinin kendisinden (`color`). Bir de fiyatın üç kez dönüp geldiği seviye: bir referans çizgisi.

Renk tek başına anlam taşımamalı: bir mumun yönü tooltip'teki açılış ve kapanış değerlerinden de okunur.

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
    name = "Fiyat (TL)",
    color = theme.neutral.color,
    marks = listOf(ChartReferenceLine(y = 117, label = "Destek")),
    colors = ChartColors(rising = theme.info.color, falling = theme.warning.color),
    description = "Bir hissenin üç haftalık günlük fiyatı, kendi renkleriyle ve bir destek seviyesiyle",
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

### Mumlar ve bir ortalama çizgisi

Mumlar bir `PantrixChart`'ın serilerinden biridir ve çizgilerle birlikte durur: burada kapanışların üç günlük ortalaması, kesikli bir çizgi olarak. İki seri olduğu için lejant kendiliğinden gelir; tooltip ikisini birlikte yazar.

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
            name = "Fiyat (TL)",
            data = THREE_WEEKS,
            x = { it.day },
            open = { it.open },
            high = { it.high },
            low = { it.low },
            close = { it.close }
        ),
        LineSeries(
            key = "average",
            name = "Üç günlük ortalama",
            data = averages,
            x = { it.first },
            y = { it.second },
            dash = ChartDash.Dashed
        )
    ),
    description = "Bir hissenin günlük fiyatı ve kapanışlarının üç günlük ortalaması",
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

### İçi boş mumlar ve hacim

Mumların arkasında günün işlem hacmi: `behind = true` olan bir `BarSeries` her yerde mumun arkasında, onun genişliğinde durur, mumlardan sonra verildiği hâlde. İkinci eksene göre okunur (`axis = ChartYAxis.Second`); o eksen hacmin en çoğunun üç katına kadar gider, çubuklar da grafiğin alt üçte birinde kalır.

Mumlar içi boş (`hollow`): yukarı kapanan günün gövdesi yalnız çerçevesidir. Bir haber günü olan 11'inin mumu kendi renginde (`colorOf`). Lejantta mum serisi iki yarılı bir örnektir: yükselişin ve düşüşün rengi.

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
    label = "İçi boş mumlar",
    tagKey = "candles_hollow"
)
PantrixChart(
    series = listOf(
        CandlestickSeries(
            key = "price",
            name = "Fiyat (TL)",
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
            name = "Hacim (bin lot)",
            data = THREE_WEEKS.zip(VOLUMES),
            x = { it.first.day },
            y = { it.second },
            color = theme.neutral.color.copy(alpha = VOLUME_TINT),
            behind = true,
            axis = ChartYAxis.Second
        )
    ),
    secondYAxis = ChartAxis(labels = false, max = VOLUMES.max() * 3.0),
    description = "Bir hissenin üç haftalık günlük fiyatı ve işlem hacmi",
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

### Takvimdeki günler

Aynı üç hafta, bu kez günleri birer an olarak: Haziran 2026'nın ilk üç haftası. Mumlar takvimdeki yerlerinde durur, iki hafta sonu birer boşluk olarak görünür, ve eksen haftaların başına işaretlenir.

Anahtarı aç (`ChartTime(gapless = true)`): borsanın kapalı olduğu hafta sonları kapanır, mumlar eşit aralıklarla yan yana durur ve eksen yine günlere ya da haftalara, her birinin ilk mumuna işaretlenir.

Günler UTC'nin günleri olduğu için eksen de UTC'ye göre okunuyor (`ChartTime`'ın `offset`'i): cihazın saati ne olursa olsun bir mum kendi gününde durur.

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
    label = "Hafta sonları olmadan",
    tagKey = "candles_gapless"
)
PantrixCandlestickChart(
    data = THREE_WEEKS,
    x = { dayOf(it) },
    open = { it.open },
    high = { it.high },
    low = { it.low },
    close = { it.close },
    name = "Fiyat (TL)",
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO }, gapless = gapless)),
    description = "Bir hissenin Haziran 2026'nın ilk üç haftasındaki günlük fiyatı, takvimdeki günlerinde",
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

### Bir muma basmak

Bir basış mumu alır: noktanın `value`'su kapanış, `from`'u açılış, `high` ve `low`'u fitilin iki ucudur. Bir muma bas: alttaki satır günün ne kadar oynadığını ve nasıl kapandığını yazar.

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
    name = "Fiyat (TL)",
    onSelect = { point ->
        val open = point.from ?: point.value
        val swing = (point.high ?: point.value) - (point.low ?: point.value)
        val change = strings.decimal(point.value - open)
        pressed = "${point.label}. gün: ${strings.decimal(swing)} TL oynadı, kapanışta $change TL"
    },
    description = "Bir hissenin üç haftalık günlük fiyatı",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Bir muma bas")

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

`import com.pantrixui.components.chart.candlestick.PantrixCandlestickChart`, `com.pantrixui:components` içinden

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

Bir mum grafiği: her yerde bir şeyin neyle açıldığı ve neyle kapandığı, bir de ikisinin arasında vardığı en yüksek ve en düşük değer; bir fiyatın bir işlem gününde yaptığı gibi.

Tek bir `CandlestickSeries` taşıyan bir `PantrixChart`'tır, daha kısa yazılmış: bir grafiğin yaptığı her şeyi yapar. Bir yerin açılışından kapanışına bir gövdesi, en düşüğünden en yükseğine ince bir fitili vardır. Açılışının üstünde kapanan mum grafiğin `rising` renginde, altında kapanan `falling` renginde çizilir: `colors` başka söylemedikçe temanın `success`'i ve `danger`'ı. Açıldığı yerde kapanan mum bir yatay çizgidir, `color`'da.

Bir satırın dört değeri de vardır ya da hiçbiri yoktur: biri eksikse o yerin mumu olmaz. Değer ekseni sıfırı kendiliğinden içine almaz: en düşüğün altındaki yuvarlak bir sayıdan en yükseğin üstündekine gider.

Tooltip'te ve ekran okuyucuda bir mum dört değeridir, her biri temanın dilindeki adıyla. Bir basış, noktanın `value`'sunda kapanışı, `from`'unda açılışı, `high`'ında ve `low`'unda fitilin iki ucunu alır.

Her satırın `x`'i bir an, bir `kotlin.time.Instant` olduğunda mumlar anlarının olduğu yerde durur ve satırı olmayan gün bir boşluktur: iki işlem haftasının arasındaki hafta sonu.

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

Parametreler:

- `data: List<T>`: satırlar.
- `x: (T) -> Any`: bir satırın grafik boyunca nerede durduğu: bir an, bir günün adı, kendisine eşit olan herhangi bir şey.
- `open: (T) -> Number?`: bir satırın neyle açıldığı, ya da değeri yoksa null.
- `high: (T) -> Number?`: vardığı en yüksek değer.
- `low: (T) -> Number?`: vardığı en düşük değer.
- `close: (T) -> Number?`: neyle kapandığı.
- `name: String`: değerlerin neyin değeri olduğu: `description`'ı olmayan grafiğin ekran okuyucudaki adı.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir.
- `kind: CandleKind`: bir yerin mum olarak mı, OHLC çubuğu olarak mı çizildiği: iki yanında birer çentik olan bir çizgi.
- `hollow: Boolean`: açılışının üstünde kapanan mumun gövdesinin yalnız çerçevesi olup olmadığı; fitil gövdenin dışında kalır. Bir OHLC çubuğu iki durumda da aynı çizilir.
- `color: Color`: açıldığı yerde kapanan mumun rengi. Verilmezse grafiğin renklerinin ilkidir.
- `colorOf: ((T) -> Color)?`: bir satırın mumunun rengi, ya da gittiği yönün rengi için `Color.Unspecified`. `null` her mumu yönünün renginde çizer.
- `xAxis: ChartAxis?`: yerlerin ekseni, grafiğin altında. `null` ondan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin yanında. `null` ondan hiçbir şey çizmez.
- `marks: List<ChartMark>`: mumların yanında çizim alanına çizilen çizgiler ve bantlar: tutunan bir seviye, bir hedef.
- `tooltip: ChartTooltip?`: gösterilen yer için gösterilen şey. `null` hiç göstermez.
- `zoom: ChartZoom?`: okuyucunun yerlerin bir kısmına yakından bakmasını ve geri kalanı boyunca kaydırmasını sağlayan şey. Grafiğe verilmedikçe `null`'dır; `null` bütün yerleri gösterir, başka bir şey yapmaz.
- `export: ChartExport?`: okuyucunun grafiği uygulamadan bir dosya olarak çıkarmasını sağlayan şey: bir resim, ya da her boyutta keskin bir çizim. Grafiğe verilmedikçe `null`'dır, ve grafiğin böyle bir düğmesi olmaz.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken çizim alanında gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar. Grafiğin dışa aktarıldığı dosya sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan mumla çağrılır.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: bir mum bir çubuk kadar geniştir, fitili de kılavuz çizgileri kadar incedir.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde: `rising` ve `falling` da aralarında.
- `tagKey: String?`: grafiğin otomasyon anahtarı. Grafik, olduğu `PantrixChart` gibi etiketlenir, `Chart_<tagKey>`, ve parçaları ile olayları o grafiğinkilerdir; tek serisinin anahtarı `candles`'tır.

### CandlestickSeries

`import com.pantrixui.components.chart.cartesian.CandlestickSeries`, `com.pantrixui:components` içinden

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

Bir yerde dört değeri olan bir seri: bir şeyin orada neyle açıldığı ve neyle kapandığı, bir de ikisinin arasında vardığı en yüksek ve en düşük değer; bir fiyatın bir işlem gününde yaptığı gibi.

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

Bir yerin açılışından kapanışına, bir çubuk kadar geniş bir gövdesi, gövdenin ortasından en düşükten en yükseğe giden ince bir fitili vardır. Açılışının üstünde kapanan mum grafiğin `rising` renginde, altında kapanan `falling` renginde çizilir; bunları grafiğin `colors`'ı söyler. Açıldığı yerde kapanan mum bir yatay çizgidir, serinin kendi `color`'ında. `hollow` bir seri, açılışının üstünde kapanan mumun gövdesini yalnız çerçevesiyle, fitili dışında kalarak çizer; iki yön renkleri olmadan da ayrılır. `colorOf` bir muma kendi rengini verir, bir haber gününü başka bir renkte gösterir, öbürlerini gittikleri yönün renginde bırakır. Lejantta bir mum serisinin örneği iki yarıdır: yükselişin rengi ve düşüşünki.

Bir satırın dört değeri de vardır ya da hiçbiri yoktur: biri eksikse ya da sayı değilse o yerin mumu olmaz. Fitil en az gövde kadar uzanır: kapanışın altındaki bir en yüksek, kapanış sayılır.

Tooltip'te bir mumun dört değerinin her biri için bir satırı vardır, temanın dilindeki adıyla; ekran okuyucuya da aynısı söylenir. Bir basış, noktanın `value`'sunda kapanışı, `from`'unda açılışı, `high`'ında ve `low`'unda fitilin iki ucunu alır.

Mumları olan bir grafik, çubukları olan bir grafik gibi, her yere genişliğinden bir bant verir. Değer ekseni sıfırı kendiliğinden içine almaz: okunan, değerlerin büyüklüğü değil hareketidir. Seri yığılmaz ve işaretlerine değer yazmaz.

Kuruldukları her şey aynı olan iki seri, fonksiyonlar da dahil, aynı seridir.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar.
- `x: (T) -> Any`: Bir satırın grafik boyunca nerede durduğu: bir an, bir günün adı, kendisine eşit olan herhangi bir şey.
- `open: (T) -> Number?`: Satırın neyle açıldığı.
- `high: (T) -> Number?`: Vardığı en yüksek değer.
- `low: (T) -> Number?`: Vardığı en düşük değer.
- `close: (T) -> Number?`: Neyle kapandığı.
- `color: Color`: Açıldığı yerde kapanan mumun, ve lejanttaki serinin rengi. Verilmezse, serinin grafiğin serileri arasındaki yerine göre temanın grafik rengidir.
- `kind: CandleKind`: Bir yerin mum olarak mı, OHLC çubuğu olarak mı çizildiği.
- `hollow: Boolean`: Açılışının üstünde kapanan mumun gövdesinin yalnız çerçevesi olup olmadığı. Bir OHLC çubuğunun gövdesi yoktur, iki durumda da aynı çizilir.
- `colorOf: ((T) -> Color)?`: Bir satırın mumunun rengi, ya da gittiği yönün rengi için `Color.Unspecified`. Null her mumu yönünün renginde çizer.
- `axis: ChartYAxis`: Serinin, grafiğin değer eksenlerinden hangisiyle okunduğu.

### CandleKind

`import com.pantrixui.components.chart.cartesian.CandleKind`, `com.pantrixui:components` içinden

```kotlin
enum class CandleKind
```

Bir `CandlestickSeries`'in bir yerin dört değerini nasıl çizdiği.

Değerleri:

- `Candle`: Açılıştan kapanışa bir gövde, ortasından en düşükten en yükseğe giden bir fitille.
- `Ohlc`: En düşükten en yükseğe bir çizgi, önünde açılışta, ardında kapanışta birer çentikle: mumların sıkışacağı yerde komşularından ayrık duran bir OHLC çubuğu.

### ChartColors

`import com.pantrixui.components.chart.common.ChartColors`, `com.pantrixui:components` içinden

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

Temanın renklerini almayan bir grafik için, onun neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// A chart in the brand's two colours, whatever the theme's chart colours are:
PantrixChart(series = series, colors = ChartColors(series = listOf(brand, accent)))
```

Bir grafiğin kendi dolgusu yoktur: üstünde durduğu şeyin üstüne çizilir. Temanın kendi zeminlerinde çizgileri ve yazıları temanındır. Üstünde durana bir renk veren bir dolguda temanınkilerin okunacağı bilinmez: yazılar o renkle yazılır, çizgiler onun bir payıyla çizilir. Serilerin renkleri, grafik nerede dursa da verildikleri gibi çizilir; bir dolguda hangilerinin okunduğunu bilen çağırandır.

Parametreler:

- `series: List<Color>`: Serilerin çizildiği renkler, dağıtıldıkları sırayla, kendi rengini söylemeyen seriler için. Boşsa temanın grafik renkleridir.
- `grid: Color`: Bir eksenin işaretlerinde grafik boyunca çizilen çizgiler. Temanın `divider`'ı.
- `axis: Color`: Bir eksen boyunca çizilen çizgi. Temanın `border`'ı.
- `label: Color`: Eksenlerin yanına yazılanlar: değerler, yerler ve eksenlerin başlıkları, bir de lejanttaki adlar. Temanın `textSecondary`'si.
- `crosshair: Color`: Gösterilen yeri işaretleyen çizgi. Temanın `borderHover`'ı: içinden geçtiği kılavuz çizgilerinden güçlü, arkasında durduğu serilerden sessiz.
- `tooltipContainer: Color`: Tooltip'in dolgusu. Temanın `surface`'i.
- `tooltipBorder: Color`: Tooltip'in kenarı. Temanın `border`'ı.
- `tooltipText: Color`: Tooltip'in başlığı ve değerleri. Temanın `textPrimary`'si.
- `tooltipLabel: Color`: Tooltip'teki seri adları. Temanın `textSecondary`'si.
- `rising: Color`: Yukarı giden bir değerin çizildiği renk: bir şelalenin ekleyen adımı. Temanın `success`'i.
- `falling: Color`: Aşağı giden bir değerin çizildiği renk: bir şelalenin götüren adımı. Temanın `danger`'ı.

### BarSeries

`import com.pantrixui.components.chart.cartesian.BarSeries`, `com.pantrixui:components` içinden

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

Yerlerinin her birinde, sıfırdan değerine kadar bir çubuk olarak çizilen seri.

```kotlin
BarSeries("revenue", "Revenue", months, x = { it.name }, y = { it.revenue })
```

Bir grafiğin serilerinin çubukları bir yerde yan yana durur, her biri serisinin renginde; aynı `stack` adını veren seriler orada tek bir çubuğu paylaşır, her biri bir öncekinin üstünde. Çubuk, sıfırın üstündeki bir değer için sıfırdan yukarı, altındaki için aşağı gider; değeri olmayan satırın çubuğu yoktur.

Çubuğu olan bir grafik her yere genişliğinden bir bant verir ve aynı grafiğin bir çizgisi bantların ortasından geçer. Değer ekseni, eksen başka türlü söylemedikçe sıfırdan başlar: bir çubuğun boyu miktar olarak okunur ve sıfırın üstünden kesilen bir çubuk olduğundan azını gösterir.

Diğerlerinin arkasında (`behind`) duran bir seri, bir yerde kendine ait bir çubuk almaz: çubuğu o yerin yan yana duran bütün çubukları kadar geniştir ve arkada olmayan her seriden önce çizilir; bir günün hacmi, mumunun altında. Arkada duran iki seriden sonra verilen, öbürünün üstüne çizilir.

Kuruldukları her şey aynı olan iki seri, iki fonksiyon da dahil, aynı seridir.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar.
- `x: (T) -> Any`: Bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `y: (T) -> Number?`: Bir satırın değeri, yoksa null.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `stack: String?`: Serinin neyle yığıldığı. Bir grafiğin aynı yığının adını veren serileri her yerde, verildikleri sırayla üst üste durur: ilki sıfırın üstünde, ötekilerin her biri bir öncekinin üstünde. Sıfırın altındaki bir değer sıfırdan aşağı iner, yığınının aşağı inen ötekilerinin altına. Null ise seri sıfırın üstünde tek başına durur. Bir yığın tek bir eksenin serilerinden oluşur: aynı yığının adını verip farklı eksenlerle okunan iki seri ayrı durur.
- `behind: Boolean`: Serinin çubuklarının öbür serilerinkinin yanında değil, arkasında, hepsi kadar geniş durup durmadığı. Arkada duran bir seri hiçbir `stack`'te değildir.
- `axis: ChartYAxis`: Serinin, grafiğin değer eksenlerinden hangisiyle okunduğu.
- `labels: ChartDataLabels?`: Serinin değerleri, çubuklarının ucuna ve bir yığının çubuklarının içine yazılır. Null hiçbirini yazmaz.
- `pattern: ChartPattern?`: Çubukların renklerinin yanında çizildiği desen. Null ise hiçbiri; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki yerine göre sırasındaki desen.
