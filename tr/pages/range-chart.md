# Range Chart

Her yerde iki değerin arasında kalanı gösteren grafik: bir günün en düşük ve en yüksek sıcaklığı, bir fiyatın gördüğü en az ve en çok, bir vardiyanın başladığı ve bittiği saat.

Tek bir `RangeSeries` taşıyan bir `PantrixChart`'ın kısa yazılışıdır. Eksenler, tooltip, durum, klavye ve ekran okuyucu "Chart" sayfasında anlatıldığı gibidir.

- `PantrixRangeChart` (`com.pantrixui.components.chart.range`, `com.pantrixui:components`): Her yerde iki değerin arasında kalan şey, iki çizgi arasında bir bant ya da birinden ötekine bir çubuk olarak: bir günün en azı ve en çoğu, bir tahminin sınırları. Tek bir aralığın grafiğinin kısa yolu. Anahtar sözcükler: bant grafik, aralık çubuğu, en az en çok, hata bandı, yüksek düşük, yüzen çubuk.

## Özellikler

- **Bant ya da çubuk.** `RangeKind.Area` aralığı yerden yere giden bir bant olarak çizer: iki çizgi ve aralarında serinin renginden bir ton. `RangeKind.Bar` her yere, alt değerden üst değere giden bir çubuk koyar; çubuğun iki ucu da yuvarlaktır, çünkü hiçbir şeyin üstünde durmaz.
- **Bandın görünüşü.** `lines = false` iki çizgiyi çizmez, bant yalnız tonuyla kalır; `dash` çizgileri kesik ya da noktalı çizer, `marker` her noktaya bir işaret koyar, `fillAlpha` aradaki tonun serinin renginden ne kadar aldığını söyler (verilmezse altıda biri kadar). Çubuk bunların hiçbirini okumaz.
- **Sıfır.** Aralığın hiçbir yeri sıfırın üstünde durmaz: değer ekseni, eksen söylemedikçe sıfırdan başlamaz ve aralığın değerlerinin çevresinde kurulur. Okunan, iki değerin birbirinden ne kadar uzak olduğu ve nerede durduklarıdır.
- **Eksik değer.** Alt ya da üst değeri olmayan satırın ikisi de yoktur: bant ondan önce biter, sonra yeniden başlar. Tek başına kalan yer, alt değerinden üst değerine bir çizgidir.
- **Tooltip ve ekran okuyucu.** İki değer aralarında bir çizgiyle yazılır: "9 – 17". Bir basış, noktanın `value`'sunda üst değeri, `from`'unda alt değeri alır.
- **Değer etiketleri.** `labels` iki değeri aralığın iki ucuna yazar: üsttekini üstüne, alttakini altına.
- **Yatay.** `horizontal = true` yerleri grafiğin yanından aşağı dizer, aralıklar boyunca uzanır: bir çizelgedeki vardiyalar gibi. Değerler grafiğin altına yazılır.
- **Başka serilerle.** Bandın üstünde bir çizgi (sınırlarının içinde bir tahmin) ya da tek grafikte iki aralık isteyen grafik bir `PantrixChart`'tır: aralık için bir `RangeSeries`, çizgi için bir `LineSeries` alır.
- **Otomasyon.** Grafik, olduğu `PantrixChart` gibi etiketlenir: `Chart_<tagKey>`. Tek serisinin anahtarı `range`'dir.

## Kullanım

### The coldest and the warmest of each day, as a band

```kotlin
PantrixRangeChart(
    data = days,
    x = { it.name },
    low = { it.coldest },
    high = { it.warmest },
    name = stringResource(Res.string.temperature),
    curve = ChartCurve.Smooth,
    description = stringResource(Res.string.temperature_of_the_week),
    tagKey = "temperature"
)
```

### The hours each shift starts and ends at, as bars with their values

```kotlin
PantrixRangeChart(
    data = shifts,
    x = { it.team },
    low = { it.start },
    high = { it.end },
    name = stringResource(Res.string.hours),
    kind = RangeKind.Bar,
    labels = ChartDataLabels(),
    tagKey = "shifts"
)
```

## Örnekler

### Günün en düşüğü ve en yükseği

En yalın hâli: satırlar, satırın yerini veren `x`, alt değer (`low`), üst değer (`high`) ve aralığın adı. Bandın iki çizgisi yumuşak gidiyor (`curve`).

İmleci bir günün üstüne getir ya da güne dokun: bandın iki ucu işaretlenir ve tooltip iki değeri birlikte yazar. Eksen sıfırdan başlamıyor: bir aralığın hiçbir yeri sıfırın üstünde durmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.range.PantrixRangeChart

PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { it.coldest },
    high = { it.warmest },
    name = "Sıcaklık",
    curve = ChartCurve.Smooth,
    yAxis = ChartAxis(format = { "${it.toInt()}°" }),
    description = "Haftanın günlerine göre en düşük ve en yüksek sıcaklık",
    tagKey = "plain"
)

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Pzt", coldest = 9, warmest = 17),
    Weather("Sal", coldest = 11, warmest = 19),
    Weather("Çar", coldest = 8, warmest = 15),
    Weather("Per", coldest = 6, warmest = 14),
    Weather("Cum", coldest = 10, warmest = 21),
    Weather("Cmt", coldest = 13, warmest = 24),
    Weather("Paz", coldest = 12, warmest = 22)
)
```

### Bant ya da çubuk

Aynı aralık iki türlü çizilir. Anahtarı çevir: bant, her güne alt değerden üst değere giden bir çubuk olur (`RangeKind.Bar`). Çubuğun iki ucu da yuvarlaktır ve her günün, grafiğin genişliğinden bir bandı vardır.

Bant, yerden yere süren bir şeye uyar: gün gün değişen sıcaklık. Çubuk, her yerde ayrı ayrı okunan aralıklara.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.range.PantrixRangeChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var bars by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = bars,
    onCheckedChange = { bars = it },
    label = "Çubuk olarak",
    tagKey = "range_bars"
)
PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { it.coldest },
    high = { it.warmest },
    name = "Sıcaklık",
    kind = if (bars) RangeKind.Bar else RangeKind.Area,
    yAxis = ChartAxis(format = { "${it.toInt()}°" }),
    description = "Haftanın günlerine göre en düşük ve en yüksek sıcaklık",
    tagKey = "kinds"
)

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Pzt", coldest = 9, warmest = 17),
    Weather("Sal", coldest = 11, warmest = 19),
    Weather("Çar", coldest = 8, warmest = 15),
    Weather("Per", coldest = 6, warmest = 14),
    Weather("Cum", coldest = 10, warmest = 21),
    Weather("Cmt", coldest = 13, warmest = 24),
    Weather("Paz", coldest = 12, warmest = 22)
)
```

### Değerler iki ucunda

Vardiyaların başladığı ve bittiği saat, her ekip için bir çubuk. İki değer çubuğun iki ucuna yazılır (`labels`): bitiş üstüne, başlangıç altına. Saatler eksende ve etikette aynı biçimde yazılıyor (`format`). Eksen günün altışar saatinde işaretli (`values`): yuvarlak adımlar onu beşer saatte işaretlerdi.

Çizgi öğle arasını gösteriyor (`marks`): hangi vardiyanın onu içine aldığı okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.range.PantrixRangeChart

val hour: (Double) -> String = { "${it.toInt()}:00" }
PantrixRangeChart(
    data = SHIFT_HOURS,
    x = { it.team },
    low = { it.start },
    high = { it.end },
    name = "Vardiya",
    kind = RangeKind.Bar,
    labels = ChartDataLabels(format = hour),
    yAxis = ChartAxis(values = listOf(0.0, 6.0, 12.0, 18.0, 24.0), format = hour),
    marks = listOf(ChartReferenceLine(y = 12, label = "Öğle arası")),
    description = "Ekiplere göre vardiyanın başladığı ve bittiği saat",
    tagKey = "labels"
)

private data class ShiftHours(
    val team: String,
    val start: Int,
    val end: Int
)

private val SHIFT_HOURS = listOf(
    ShiftHours("Depo", start = 6, end = 14),
    ShiftHours("Mağaza", start = 9, end = 21),
    ShiftHours("Destek", start = 8, end = 18),
    ShiftHours("Akşam", start = 14, end = 22)
)
```

### Yatay vardiyalar

Aynı vardiyalar yatay (`horizontal = true`): ekipler grafiğin yanından aşağı dizilir, her vardiya başladığı saatten bittiği saate soldan sağa uzanır, bir çizelgedeki gibi. Saatler grafiğin altına yazılır; öğle arası çizgisi grafiği yukarıdan aşağı keser.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.range.PantrixRangeChart

val hour: (Double) -> String = { "${it.toInt()}:00" }
PantrixRangeChart(
    data = SHIFT_HOURS,
    x = { it.team },
    low = { it.start },
    high = { it.end },
    name = "Vardiya",
    kind = RangeKind.Bar,
    horizontal = true,
    labels = ChartDataLabels(format = hour),
    yAxis = ChartAxis(values = listOf(0.0, 6.0, 12.0, 18.0, 24.0), format = hour),
    marks = listOf(ChartReferenceLine(y = 12, label = "Öğle arası")),
    description = "Ekiplere göre vardiyanın başladığı ve bittiği saat, yatay",
    tagKey = "horizontal_shifts"
)

private data class ShiftHours(
    val team: String,
    val start: Int,
    val end: Int
)

private val SHIFT_HOURS = listOf(
    ShiftHours("Depo", start = 6, end = 14),
    ShiftHours("Mağaza", start = 9, end = 21),
    ShiftHours("Destek", start = 8, end = 18),
    ShiftHours("Akşam", start = 14, end = 22)
)
```

### Kesik çizgiler ve işaretler

Bandın görünüşü serinin kendisinden: iki çizgisi kesik (`dash`), her noktasında bir işaret (`marker`), aradaki ton her zamankinden koyu (`fillAlpha`). Anahtarı kapat (`lines = false`): çizgiler gider, bant tonu ve işaretleriyle kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.range.PantrixRangeChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var lines by remember { mutableStateOf(true) }
PantrixSwitchButton(
    checked = lines,
    onCheckedChange = { lines = it },
    label = "Bandın çizgileri",
    tagKey = "range_lines"
)
PantrixRangeChart(
    data = OUTLOOK,
    x = { it.month },
    low = { it.least },
    high = { it.most },
    name = "Beklenen aralık",
    lines = lines,
    dash = ChartDash.Dashed,
    marker = ChartMarker.Circle,
    fillAlpha = 0.28f,
    description = "Aylara göre siparişlerin beklenen aralığı, kesik çizgiler ve işaretlerle",
    tagKey = "look"
)

private data class Outlook(
    val month: String,
    val expected: Int,
    val least: Int,
    val most: Int
)

private val OUTLOOK = listOf(
    Outlook("Tem", expected = 420, least = 400, most = 440),
    Outlook("Ağu", expected = 450, least = 415, most = 485),
    Outlook("Eyl", expected = 470, least = 420, most = 520),
    Outlook("Eki", expected = 510, least = 440, most = 580),
    Outlook("Kas", expected = 540, least = 450, most = 630),
    Outlook("Ara", expected = 600, least = 480, most = 720)
)
```

### Tahmin ve sınırları

Bandın üstünde bir çizgi isteyen grafik bir `PantrixChart`'tır: tahminin güvenilen sınırları bir `RangeSeries`, tahminin kendisi ondan sonra verilen bir `LineSeries`. Sonra verilen seri öncekinin üstüne çizilir.

Tooltip iki seriyi birlikte yazar: sınırları bir aralık, tahmini tek bir değer olarak. Lejantta aralık bir yama, tahmin kesik bir çizgidir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.cartesian.RangeSeries
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartDash

PantrixChart(
    series = listOf(
        RangeSeries(
            key = "bounds",
            name = "Beklenen aralık",
            data = OUTLOOK,
            x = { it.month },
            low = { it.least },
            high = { it.most },
            curve = ChartCurve.Smooth
        ),
        LineSeries(
            key = "expected",
            name = "Tahmin",
            data = OUTLOOK,
            x = { it.month },
            y = { it.expected },
            curve = ChartCurve.Smooth,
            dash = ChartDash.Dashed
        )
    ),
    description = "Aylara göre sipariş tahmini ve beklenen aralığı",
    tagKey = "with_line"
)

private data class Outlook(
    val month: String,
    val expected: Int,
    val least: Int,
    val most: Int
)

private val OUTLOOK = listOf(
    Outlook("Tem", expected = 420, least = 400, most = 440),
    Outlook("Ağu", expected = 450, least = 415, most = 485),
    Outlook("Eyl", expected = 470, least = 420, most = 520),
    Outlook("Eki", expected = 510, least = 440, most = 580),
    Outlook("Kas", expected = 540, least = 450, most = 630),
    Outlook("Ara", expected = 600, least = 480, most = 720)
)
```

### Bir aralığa basmak

Bir basış, aralığın iki değerini de alır: noktanın `value`'su üst değer, `from`'u alt değerdir; `text` ikisini grafiğin yazdığı gibi taşır. Bir güne bas: alttaki satır o günün aralığını ve genişliğini yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.RangeKind
import com.pantrixui.components.chart.range.PantrixRangeChart
import com.pantrixui.components.elements.text.PantrixText

var pressed by remember { mutableStateOf<String?>(null) }
PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { it.coldest },
    high = { it.warmest },
    name = "Sıcaklık",
    kind = RangeKind.Bar,
    onSelect = { point ->
        val wide = point.value - (point.from ?: point.value)
        pressed = "${point.label}: ${point.text}, aradaki fark ${wide.toInt()} derece"
    },
    description = "Haftanın günlerine göre en düşük ve en yüksek sıcaklık",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Bir güne bas")

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Pzt", coldest = 9, warmest = 17),
    Weather("Sal", coldest = 11, warmest = 19),
    Weather("Çar", coldest = 8, warmest = 15),
    Weather("Per", coldest = 6, warmest = 14),
    Weather("Cum", coldest = 10, warmest = 21),
    Weather("Cmt", coldest = 13, warmest = 24),
    Weather("Paz", coldest = 12, warmest = 22)
)
```

### Eksik değerler

Değeri olmayan günler: çarşamba ve cumartesi ölçülmemiş. Bant, değeri olmayan günden önce biter ve sonra yeniden başlar; iki yanında komşusu olmayan gün, alt değerinden üst değerine giden bir çizgidir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.range.PantrixRangeChart

PantrixRangeChart(
    data = WEATHER,
    x = { it.day },
    low = { row -> row.coldest.takeIf { row.day !in UNMEASURED } },
    high = { row -> row.warmest.takeIf { row.day !in UNMEASURED } },
    name = "Sıcaklık",
    description = "Haftanın günlerine göre sıcaklık, ölçülmeyen iki günle",
    tagKey = "missing"
)

private data class Weather(
    val day: String,
    val coldest: Int,
    val warmest: Int
)

private val WEATHER = listOf(
    Weather("Pzt", coldest = 9, warmest = 17),
    Weather("Sal", coldest = 11, warmest = 19),
    Weather("Çar", coldest = 8, warmest = 15),
    Weather("Per", coldest = 6, warmest = 14),
    Weather("Cum", coldest = 10, warmest = 21),
    Weather("Cmt", coldest = 13, warmest = 24),
    Weather("Paz", coldest = 12, warmest = 22)
)

private val UNMEASURED = setOf("Çar", "Cmt")
```

## API

### PantrixRangeChart

`import com.pantrixui.components.chart.range.PantrixRangeChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixRangeChart(
    data: List<T>,
    x: (T) -> Any,
    low: (T) -> Number?,
    high: (T) -> Number?,
    name: String,
    modifier: Modifier = Modifier,
    kind: RangeKind = RangeKind.Area,
    curve: ChartCurve = ChartCurve.Linear,
    lines: Boolean = true,
    dash: ChartDash? = null,
    marker: ChartMarker = ChartMarker.None,
    fillAlpha: Float = 0.16f,
    pattern: ChartPattern? = null,
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

Her yerde iki değerin arasında kalanın grafiği: bir günün en soğuğu ve en sıcağı, bir fiyatın gördüğü en az ve en çok, bir vardiyanın başladığı ve bittiği saatler.

Tek bir `RangeSeries` taşıyan bir `PantrixChart`'tır, daha kısa yazılmış: bir grafiğin yaptığı her şeyi yapar. Area olarak aralık, iki çizginin arasında yerden yere giden bir banttır; Bar olarak her yerde bir değerden ötekine giden bir çubuk. Üstünde bir çizgi olan bir bant, güvenildiği sınırların içinde bir tahmin, ya da tek grafikte iki aralık, serileri verilmiş bir `PantrixChart`'tır. `horizontal` ise yerler grafiğin yanından birbirinin altında aşağı dizilir, aralıklar boyunca uzanır: bir çizelgedeki vardiyalar gibi.

Değer ekseni, eksen öyle söylemedikçe sıfırdan başlamaz: bir aralığın hiçbir yeri sıfırın üstünde durmaz; okunan, iki değerin birbirinden ne kadar uzak olduğu ve nerede durduklarıdır. `low`'u ya da `high`'ı olmayan satırın ikisi de yoktur.

Tooltip'e ve ekran okuyucuya iki değer aralarında bir çizgiyle verilir. Bir basış, noktanın `value`'sunda üst değeri, `from`'unda alt değeri alır.

```kotlin
PantrixRangeChart(
    data = days,
    x = { it.name },
    low = { it.coldest },
    high = { it.warmest },
    name = "Temperature",
    tagKey = "temperature"
)
```

Parametreler:

- `data: List<T>`: satırlar.
- `x: (T) -> Any`: bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `low: (T) -> Number?`: bir satırın alt değeri, ya da yoksa null.
- `high: (T) -> Number?`: bir satırın üst değeri, ya da yoksa null.
- `name: String`: iki değerin neyin değeri olduğu: tooltip'in onlara verdiği ad, ve `description`'ı olmayan grafiğin ekran okuyucudaki adı.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir.
- `kind: RangeKind`: aralığın yerden yere giden bir bant mı, her yerde bir çubuk mu olduğu.
- `curve: ChartCurve`: bir bandın iki çizgisinin bir noktadan ötekine nasıl gittiği. Bir çubuğun çizgisi yoktur.
- `lines: Boolean`: bandın iki çizgisinin çizilip çizilmediği, ya da aralarındaki tonun tek başına kalıp kalmadığı.
- `dash: ChartDash?`: iki çizginin bütün mü, kesik mi, noktalı mı çizildiği. `null` onları bütün çizer; grafiğin desenleri açıksa (`ChartStyle.patterns`) kesik.
- `marker: ChartMarker`: iki çizginin her noktasına konan işaret. Verilmezse işaret yoktur.
- `fillAlpha: Float`: çizgilerin arasındaki tonun aralığın renginden ne kadar aldığı, hiçten tamamına kadar. Verilmezse altıda biri kadar.
- `pattern: ChartPattern?`: bandın ya da çubukların renklerinin yanında çizildiği desen. `null` hiçbirini çizmez; grafiğin desenleri açıkken de: tek aralıklı bir grafikte onu ayırt edecek başka bir şey yoktur.
- `color: Color`: aralığın çizildiği renk. Verilmezse grafiğin renklerinin ilkidir.
- `horizontal: Boolean`: yerlerin grafiğin altı boyunca dizilip aralığın yukarı uzanması yerine, yanından aşağı dizilip aralığın boyunca uzanıp uzanmadığı.
- `labels: ChartDataLabels?`: aralığın uçlarına yazılan iki değer, üsttekisi üstüne ve alttakisi altına, yerleri olduğunda. `null` hiçbirini yazmaz.
- `xAxis: ChartAxis?`: yerlerin ekseni, grafiğin altında, `horizontal` ise yanında. `null` ondan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin yanında, `horizontal` ise altında. `null` ondan hiçbir şey çizmez.
- `marks: List<ChartMark>`: aralığın yanında çizim alanına çizilen çizgiler ve bantlar: bir sınır, bir dizi yer.
- `tooltip: ChartTooltip?`: gösterilen yer için gösterilen şey. `null` hiç göstermez.
- `zoom: ChartZoom?`: okuyucunun yerlerin bir kısmına yakından bakmasını ve geri kalanı boyunca kaydırmasını sağlayan şey. Grafiğe verilmedikçe `null`'dır; `null` bütün yerleri gösterir, başka bir şey yapmaz.
- `export: ChartExport?`: okuyucunun grafiği uygulamadan bir dosya olarak çıkarmasını sağlayan şey: bir resim, ya da her boyutta keskin bir çizim. Grafiğe verilmedikçe `null`'dır, ve grafiğin böyle bir düğmesi olmaz.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken çizim alanında gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar. Grafiğin dışa aktarıldığı dosya sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan aralıkla çağrılır.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı. Grafik, olduğu `PantrixChart` gibi etiketlenir, `Chart_<tagKey>`, ve parçaları ile olayları o grafiğinkilerdir; tek serisinin anahtarı `range`'dir.

### RangeSeries

`import com.pantrixui.components.chart.cartesian.RangeSeries`, `com.pantrixui:components` içinden

```kotlin
class RangeSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val low: (T) -> Number?,
    public val high: (T) -> Number?,
    override val color: Color = Color.Unspecified,
    public val kind: RangeKind = RangeKind.Area,
    public val curve: ChartCurve = ChartCurve.Linear,
    public val lines: Boolean = true,
    public val dash: ChartDash? = null,
    public val marker: ChartMarker = ChartMarker.None,
    public val fillAlpha: Float = 0.16f,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null,
    public val pattern: ChartPattern? = null
) : ChartSeries()
```

Her yerde iki değeri olan ve aralarında kalanla çizilen bir seri: bir günün en azı ve en çoğu, bir tahmine güvenilen sınırlar, bir vardiyanın başladığı ve bittiği saatler.

```kotlin
RangeSeries("temperature", "Temperature", days, x = { it.name }, low = { it.coldest }, high = { it.warmest })
```

Area olarak iki çizginin arasında, serinin renginden bir tonla boyanmış bir banttır; Bar olarak her yerde bir değerde başlayıp ötekinde biten, iki ucu da yuvarlak bir çubuk. Bandın üstünde bir çizgi, sınırlarının içinde bir tahmin, aynı grafikte ondan sonra verilen bir `LineSeries`'tir. Bir bant `lines`, `dash`, `marker` ve `fillAlpha`'nın söylediği gibi çizilir; bir çubuk bunların hiçbirini okumaz. İkisi de `pattern`'ın söylediği desenle çizilir.

Bir aralığın hiçbir yeri sıfırın üstünde durmaz; o yüzden ekseni onun için sıfırı içine almaz, ve bir aralık yığılmaz: `stack`'i her zaman null'dır. `low`'u ya da `high`'ı olmayan satırın ikisi de yoktur: bant ondan önce biter ve ondan sonra yeniden başlar. İkisinden hangisinin büyük olduğu çizileni değiştirmez.

Tooltip'e ve ekran okuyucuya iki değer aralarında bir çizgiyle verilir; bir basış, noktanın `value`'sunda üst değeri, `from`'unda alt değeri alır.

Kuruldukları her şey aynı olan iki seri, üç fonksiyon da dahil, aynı seridir.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar.
- `x: (T) -> Any`: Bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `low: (T) -> Number?`: Bir satırın alt değeri, ya da yoksa null.
- `high: (T) -> Number?`: Bir satırın üst değeri, ya da yoksa null.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `kind: RangeKind`: Aralığın yerden yere giden bir bant mı, her yerde bir çubuk mu olduğu.
- `curve: ChartCurve`: Bir bandın iki çizgisinin bir noktadan ötekine nasıl gittiği. Bir çubuğun çizgisi yoktur.
- `lines: Boolean`: Bandın iki çizgisinin çizilip çizilmediği, ya da aralarındaki tonun tek başına kalıp kalmadığı.
- `dash: ChartDash?`: İki çizginin bütün mü, kesik mi, noktalı mı çizildiği. Null ise bütün; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki sırasının söylediği gibi.
- `marker: ChartMarker`: İki çizginin her noktasına konan işaret, çizgiler çizilsin ya da çizilmesin. Verilmezse işaret yoktur.
- `fillAlpha: Float`: Çizgilerin arasındaki tonun serinin renginden ne kadar aldığı: hiç almamaktan, yani yalnız çizgilerden oluşan bir banttan, rengin tamamına kadar. Verilmezse altıda biri kadar, dolu bir çizginin tonu gibi.
- `axis: ChartYAxis`: Serinin, grafiğin değer eksenlerinden hangisiyle okunduğu.
- `labels: ChartDataLabels?`: Aralığın uçlarına yazılan iki değer: üsttekisi üstüne, alttakisi altına. Null hiçbirini yazmaz.
- `pattern: ChartPattern?`: Bandın ya da çubukların renklerinin yanında çizildiği desen. Null ise hiçbiri; grafiğin desenleri açıksa, grafiğin serileri arasındaki yerine göre sırasındaki desen.

### RangeKind

`import com.pantrixui.components.chart.cartesian.RangeKind`, `com.pantrixui:components` içinden

```kotlin
enum class RangeKind
```

Bir `RangeSeries`'in bir yerdeki iki değerinin arasına ne çizdiği.

Değerleri:

- `Area`: Yerden yere giden bir bant: alt değerlerden geçen çizgiyle üst değerlerden geçen çizginin arasında.
- `Bar`: Her yerde, alt değerinden üst değerine bir çubuk: hiçbir eksenin üstünde durmayan bir çubuk.

### ChartDataLabels

`import com.pantrixui.components.chart.common.ChartDataLabels`, `com.pantrixui:components` içinden

```kotlin
class ChartDataLabels(
    public val format: ((Double) -> String)? = null,
    public val position: ChartDataLabelPosition = ChartDataLabelPosition.Auto,
    public val total: Boolean = false
)
```

Bir serinin grafiğe yazılan değerleri, her biri işaretinin yanında: bir çizginin noktasının üstünde, bir çubuğun ucunda ve bir yığının çubuğunun içinde; orada siyahla beyazdan, çubuğun renginde daha iyi okunanıyla.

```kotlin
BarSeries("revenue", "Revenue", months, x = { it.name }, y = { it.revenue }, labels = ChartDataLabels())
BarSeries("online", "Online", months, x = { it.name }, y = { it.online }, stack = "sales",
    labels = ChartDataLabels(position = ChartDataLabelPosition.InsideEnd, total = true))
```

Bir değerin etiketi, etiketin yeri olan yerde yazılır. Kendi yerini bulan bir etiket, başka birinin üstüne gelecekse ya da grafikten taşacaksa noktasının altına ya da çubuğunun ucunun içine yazılır; orada da yeri yoksa atlanır, bir çubuğun tutamayacağı kadar büyük olan da. `position`'ın söylediği yere yazılanın başka yeri yoktur. Değer tooltip'te ve ekran okuyucuda yine durur. İki yüzden çok yeri olan grafik hiçbirini yazmaz.

Grafiğin değerleri okumak için çizdiği bir çizgi bir etiketin içinden geçiyorsa etiketin olduğu yerde örtülür: etiket bir zeminin üstüne yazılır, çubuğun dışında tooltip renginde, içinde çubuğun renginde.

`position` ve `total` eksenli bir grafiğindir: pasta ve ısı haritası etiketlerini kendi yerlerine yazar.

Bir değeri aynı biçimde, aynı yere yazan iki etiket aynıdır.

Parametreler:

- `format: ((Double) -> String)?`: Bir değerin nasıl yazılacağı. Verilmezse serinin okunduğu eksenin değerlerini yazdığı gibi, o da bir şey söylemiyorsa temanın dilinde, on binden sonra kısa yazılır. Paylar olarak duran bir yığında bir değerin payı verilir; verilmezse pay yüzde olarak yazılır.
- `position: ChartDataLabelPosition`: Bir değerin çubuğunda nereye yazılacağı. Bir çizginin noktasının etiketi, bu ne derse desin, noktanın üstüne, orada yeri yoksa altına yazılır.
- `total: Boolean`: Serinin bir yığınının her yerdeki toplamının, yığının ucunun ötesine yazılıp yazılmadığı: toplam sıfır ya da üstündeyse yığının üstüne, altındaysa altına. `format`'ın söylediği gibi yazılır; ama paylar olarak duran bir yığında temanın dilinde, çünkü o bir pay değildir. Yığının bir serisinin istemesi yeter.

### ChartDash

`import com.pantrixui.components.chart.common.ChartDash`, `com.pantrixui:components` içinden

```kotlin
enum class ChartDash
```

Bir çizginin bütün mü, kesik mi çizildiği.

Değerleri:

- `Solid`: Bütün bir çizgi.
- `Dashed`: Kesik çizgilerden bir çizgi.
- `Dotted`: Noktalardan bir çizgi.

### ChartMarker

`import com.pantrixui.components.chart.common.ChartMarker`, `com.pantrixui:components` içinden

```kotlin
enum class ChartMarker
```

Bir çizginin bir noktasını neyin işaretlediği. Şekiller, renklerin tek başına ayıramayacağı serileri ayırır.

Değerleri:

- `None`: İşaret yok; yalnızca tek başına duran bir nokta işaretlenir.
- `Circle`: Yuvarlak bir işaret.
- `Square`: Kare bir işaret.
- `Diamond`: Köşelerinden birinin üstünde duran kare bir işaret.
- `Triangle`: Üçgen bir işaret.
