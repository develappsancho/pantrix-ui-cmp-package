# Line Chart

Bir kez verilen satırlardan bir çizgi grafiği: satırlardan okunan her değer (`values`) için bir çizgi, satırların adını verdiği yerler (`x`) boyunca.

Serilerinin hepsi çizgi olan ve hepsi aynı satırlardan okunan bir `PantrixChart`'ın kısa yazılışıdır: bir grafiğin yaptığı her şeyi yapar. Eksenler, lejant, tooltip, durum, klavye ve ekran okuyucu "Chart" sayfasında anlatıldığı gibidir.

- `PantrixLineChart` (`com.pantrixui.components.chart.line`, `com.pantrixui:components`): Tek bir satır listesinden okunan her değer için, satırların adlandırdığı yerler boyunca bir çizgi: serilerinin hepsi çizgi olan bir grafiğin kısa yolu. Anahtar sözcükler: çizgi grafik, eğilim, trend, zaman serisi, çizgi çizelgesi.

## Özellikler

- **Satırlar ve değerler.** `data` satırları, `x` bir satırın yerini verir. Her `ChartValue` bir seridir: anahtarı, adı ve satırdan değerini okuyan fonksiyonu.
- **Çizginin gidişi.** `curve` çizginin bir noktadan ötekine nasıl gittiğini söyler: düz, yumuşak ya da basamaklı. Yumuşak çizgi iki noktanın arasında kalır; değerlerin sahip olmadığı bir tepe ya da çukur göstermez.
- **Renkten fazlası.** Bir serinin `dash`'i çizgisini kesik ya da noktalı çizer, `marker`'ı noktalarına bir şekil koyar. İkisi de lejantta ve tooltip'te serinin örneğinde görünür.
- **Eksik değerler.** `missing`, değeri olmayan satırda çizginin ne yapacağını söyler: keser, birleştirir ya da sıfır sayar.
- **Sayı ekseni.** Yerler sayıysa ve `xAxis = ChartAxis(numeric = true)` ise noktalar sayıları kadar aralıklı durur ve eksen yuvarlak sayılara işaretlenir; verilmezse sayılar da birer addır, eşit aralıklarla dizilir.
- **Değer etiketleri ve işaretler.** `labels` değerleri noktaların üstüne yazar; `marks` bir hedef çizgisini ya da bir aralığın bandını çizer.
- **Ne zaman `PantrixChart`.** Serileri farklı listelerden gelen, farklı türden olan ya da ikinci bir eksenle okunan bir grafik için: her seri kendi `LineSeries`'ini alır.
- **Otomasyon.** Grafik, olduğu `PantrixChart` gibi etiketlenir: `Chart_<tagKey>`.

## Kullanım

### Two values of each month

```kotlin
PantrixLineChart(
    data = months,
    x = { it.name },
    values = listOf(
        ChartValue("desktop", stringResource(Res.string.desktop)) { it.desktop },
        ChartValue("mobile", stringResource(Res.string.mobile)) { it.mobile }
    ),
    description = stringResource(Res.string.visits_by_device),
    tagKey = "visits"
)
```

### A measured line and a forecast, told apart by more than colour

```kotlin
PantrixLineChart(
    data = weeks,
    x = { it.week },
    values = listOf(
        ChartValue("actual", stringResource(Res.string.actual), marker = ChartMarker.Circle) { it.actual },
        ChartValue("forecast", stringResource(Res.string.forecast), dash = ChartDash.Dashed) { it.forecast }
    ),
    curve = ChartCurve.Smooth,
    tagKey = "forecast"
)
```

## Örnekler

### Aynı satırlardan çizgiler

En yalın hâli: satırlar, satırın yerini veren `x` ve her seri için bir `ChartValue`. Seri, anahtarını ve adını alır; sondaki blok satırdan değerini okur.

Üç seri temanın ilk üç grafik rengini alır. Lejanttaki bir ada bas: seri çıkar, kalanlar renklerini korur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.line.PantrixLineChart

PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(
        ChartValue("search", "Arama") { it.search },
        ChartValue("direct", "Doğrudan") { it.direct },
        ChartValue("social", "Sosyal") { it.social }
    ),
    description = "Haftanın günlerine göre ziyaretin üç kaynağı",
    tagKey = "plain"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Pzt", search = 420, direct = 240, social = 130),
    Traffic("Sal", search = 480, direct = 260, social = 120),
    Traffic("Çar", search = 455, direct = 300, social = 165),
    Traffic("Per", search = 530, direct = 280, social = 190),
    Traffic("Cum", search = 510, direct = 330, social = 240),
    Traffic("Cmt", search = 360, direct = 210, social = 310),
    Traffic("Paz", search = 330, direct = 180, social = 285)
)
```

### Sayı ekseni

Bir yürüyüş yolunun yüksekliği, yol üzerinde düzensiz aralıklarla ölçülmüş: yerler kilometre olarak birer sayı. `xAxis = ChartAxis(numeric = true)` ile noktalar sayıları kadar aralıklı durur: 0,8 km ile 1,2 km birbirine yakın, 7,5 km ile 11 km uzak; eksen yuvarlak kilometrelere işaretlenir ve yazımını `format` verir. Zirvenin çizgisi bir ölçümün yerinde değil, 9,6 km'de duruyor.

Anahtarı kapat: sayılar birer ad olur ve eşit aralıklarla dizilir; yolun dikliği yanlış okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.line.PantrixLineChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var numeric by remember { mutableStateOf(true) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = numeric,
    onCheckedChange = { numeric = it },
    label = "Sayı ekseni",
    tagKey = "line_numeric"
)
PantrixLineChart(
    data = TRAIL,
    x = { it.first },
    values = listOf(ChartValue("height", "Yükseklik (m)") { it.second }),
    curve = ChartCurve.Smooth,
    xAxis = ChartAxis(numeric = numeric, format = { "${strings.decimal(it)} km" }),
    marks = listOf(ChartReferenceLine(x = 9.6, label = "Zirve")),
    description = "Bir yürüyüş yolunun, yol boyunca ölçülen yüksekliği",
    tagKey = "numeric"
)

private val TRAIL = listOf(
    0.0 to 420,
    0.8 to 455,
    1.2 to 470,
    2.5 to 560,
    4.0 to 610,
    7.5 to 820,
    9.6 to 1_040,
    11.0 to 930,
    12.4 to 780
)
```

### Çizginin gidişi

`curve` çizginin bir noktadan ötekine nasıl gittiğini söyler. `Linear` düz gider. `Smooth` noktalardan yuvarlak geçer ama onların arasında kalır: bir tepe ya da çukur uydurmaz. Basamaklı olanlar değeri bir noktadan ötekine düz taşır: `StepAfter` değer değişene kadar yerinde durur, bir stok ya da bir fiyat gibi; `StepBefore` bir sonraki değere önceden geçer; `Step` ikisinin ortasında basamak atar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.line.PantrixLineChart
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var curve by remember { mutableStateOf(ChartCurve.Smooth) }
PantrixSegmentButton(
    options = CURVES,
    selected = curve,
    onSelect = { curve = it },
    fullWidth = false,
    tagKey = "curve"
)
PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(ChartValue("search", "Arama", marker = ChartMarker.Circle) { it.search }),
    curve = curve,
    description = "Haftanın günlerine göre aramadan gelen ziyaret",
    tagKey = "curves"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Pzt", search = 420, direct = 240, social = 130),
    Traffic("Sal", search = 480, direct = 260, social = 120),
    Traffic("Çar", search = 455, direct = 300, social = 165),
    Traffic("Per", search = 530, direct = 280, social = 190),
    Traffic("Cum", search = 510, direct = 330, social = 240),
    Traffic("Cmt", search = 360, direct = 210, social = 310),
    Traffic("Paz", search = 330, direct = 180, social = 285)
)

private val CURVES = listOf(
    SegmentOption(value = ChartCurve.Linear, label = "Düz", tagKey = "linear"),
    SegmentOption(value = ChartCurve.Smooth, label = "Yumuşak", tagKey = "smooth"),
    SegmentOption(value = ChartCurve.Step, label = "Basamak", tagKey = "step"),
    SegmentOption(value = ChartCurve.StepBefore, label = "Önce", tagKey = "before"),
    SegmentOption(value = ChartCurve.StepAfter, label = "Sonra", tagKey = "after")
)
```

### Renkten fazlasıyla ayrılan seriler

Renk tek başına her okuyucuya yetmez: kırmızıyla yeşili ayırmayan bir göze, siyah beyaz bir çıktıya, çok serili bir grafiğe. Burada her seri renginden fazlasıyla da ayrılıyor: biri düz çizgi ve daire, biri kesik çizgi ve kare, biri noktalı çizgi ve üçgen.

Aynı örnek lejantta ve tooltip'te de durur: seri orada da çizgisiyle ve şekliyle tanınır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.line.PantrixLineChart

PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(
        ChartValue("search", "Arama", marker = ChartMarker.Circle) { it.search },
        ChartValue("direct", "Doğrudan", dash = ChartDash.Dashed, marker = ChartMarker.Square) { it.direct },
        ChartValue("social", "Sosyal", dash = ChartDash.Dotted, marker = ChartMarker.Triangle) { it.social }
    ),
    description = "Haftanın günlerine göre ziyaretin üç kaynağı",
    tagKey = "told_apart"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Pzt", search = 420, direct = 240, social = 130),
    Traffic("Sal", search = 480, direct = 260, social = 120),
    Traffic("Çar", search = 455, direct = 300, social = 165),
    Traffic("Per", search = 530, direct = 280, social = 190),
    Traffic("Cum", search = 510, direct = 330, social = 240),
    Traffic("Cmt", search = 360, direct = 210, social = 310),
    Traffic("Paz", search = 330, direct = 180, social = 285)
)
```

### Eksensiz, küçük bir çizgi

Bir kartın köşesindeki küçük bir çizgi: eksenleri ve lejantı yok (`null`), yüksekliği altmış dp. Değerleri yine yerinde durur: imleçle ya da parmakla gösterilen günün değeri tooltip'te okunur, ekran okuyucu günleri tek tek söyler.

Ekseni olmayan grafik, değerlerinin nasıl yazılacağını tooltip'ine söyler (`ChartTooltip.format`): burada sayının ardına neyin sayısı olduğu ekleniyor.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.chart.line.PantrixLineChart
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixLineChart(
    data = TRAFFIC,
    x = { it.day },
    values = listOf(ChartValue("search", "Arama") { it.search }),
    modifier = Modifier.height(60.dp),
    curve = ChartCurve.Smooth,
    xAxis = null,
    yAxis = null,
    tooltip = ChartTooltip(format = { "${strings.decimal(it)} ziyaret" }),
    description = "Haftanın günlerine göre aramadan gelen ziyaret",
    tagKey = "bare"
)

private data class Traffic(
    val day: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val TRAFFIC = listOf(
    Traffic("Pzt", search = 420, direct = 240, social = 130),
    Traffic("Sal", search = 480, direct = 260, social = 120),
    Traffic("Çar", search = 455, direct = 300, social = 165),
    Traffic("Per", search = 530, direct = 280, social = 190),
    Traffic("Cum", search = 510, direct = 330, social = 240),
    Traffic("Cmt", search = 360, direct = 210, social = 310),
    Traffic("Paz", search = 330, direct = 180, social = 285)
)
```

## API

### PantrixLineChart

`import com.pantrixui.components.chart.line.PantrixLineChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixLineChart(
    data: List<T>,
    x: (T) -> Any,
    values: List<ChartValue<T>>,
    modifier: Modifier = Modifier,
    curve: ChartCurve = ChartCurve.Linear,
    missing: ChartMissing = ChartMissing.Gap,
    labels: ChartDataLabels? = null,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    secondYAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    zoom: ChartZoom? = null,
    decimation: ChartDecimation? = ChartDecimation(),
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

Bir kez verilen satırlardan bir çizgi grafiği: onlardan okunan `values`'ın her biri için bir çizgi, `x`'in onlardan okuduğu yerler boyunca.

Serilerinin hepsi çizgi olan ve hepsi aynı satırlardan okunan bir `PantrixChart`'tır, daha kısa yazılmış: bir grafiğin yaptığı her şeyi yapar. Serileri farklı listelerden gelen ya da farklı türden olan bir grafik, her biri için bir `LineSeries` alan bir `PantrixChart`'tır.

```kotlin
PantrixLineChart(
    data = months,
    x = { it.name },
    values = listOf(
        ChartValue("desktop", "Desktop") { it.desktop },
        ChartValue("mobile", "Mobile") { it.mobile }
    ),
    tagKey = "visits"
)
```

Parametreler:

- `data: List<T>`: satırlar, çizgilerin onlardan geçtiği sırayla.
- `x: (T) -> Any`: bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `values: List<ChartValue<T>>`: seriler: her birinin bir satırdan ne okuduğu, nasıl adlandırıldığı ve çizildiği.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `curve: ChartCurve`: her çizginin bir noktadan ötekine nasıl gittiği.
- `missing: ChartMissing`: değeri olmayan bir satırda bir çizginin ne yaptığı.
- `labels: ChartDataLabels?`: değerler, yerleri olduğunda, her çizginin noktalarının üstüne yazılır. `null` hiçbirini yazmaz.
- `xAxis: ChartAxis?`: yerlerin ekseni, grafiğin altında. `null` ondan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin yanında. `null` ondan hiçbir şey çizmez.
- `secondYAxis: ChartAxis?`: grafiğin öbür yanındaki ikinci değer ekseni: bir değer onunla okunuyorsa çizilir (`ChartValue.axis`), okunmuyorsa çizilmez. `null` ondan hiçbir şey çizmez.
- `marks: List<ChartMark>`: serilerin yanında çizim alanına çizilen çizgiler ve bantlar: bir hedef, bir sınır, bir dizi yer.
- `legend: ChartLegend?`: serilerin adlarının durduğu yer. `null` hiç göstermez.
- `tooltip: ChartTooltip?`: gösterilen yer için gösterilen şey. `null` hiç göstermez.
- `zoom: ChartZoom?`: okuyucunun yerlerin bir kısmına yakından bakmasını ve geri kalanı boyunca kaydırmasını sağlayan şey. Grafiğe verilmedikçe `null`'dır; `null` bütün yerleri gösterir, başka bir şey yapmaz.
- `decimation: ChartDecimation?`: görünen noktaları çizim alanının yer bulduğundan çok olan bir çizginin, onların daha azından nasıl çizileceği. `null` her noktayı, kaç tane olursa olsun, çizer.
- `export: ChartExport?`: okuyucunun grafiği uygulamadan bir dosya olarak çıkarmasını sağlayan şey: bir resim, ya da her boyutta keskin bir çizim. Grafiğe verilmedikçe `null`'dır, ve grafiğin böyle bir düğmesi olmaz.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken çizim alanında gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar. Grafiğin dışa aktarıldığı dosya sözü yazar.
- `state: ChartState`: okuyucunun gizledikleri ve gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan değerle çağrılır.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı. Grafik, olduğu `PantrixChart` gibi etiketlenir, `Chart_<tagKey>`, ve parçaları ile olayları o grafiğinkilerdir.

### ChartValue

`import com.pantrixui.components.chart.cartesian.ChartValue`, `com.pantrixui:components` içinden

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

Bir grafiğin okunduğu satırların bir değeri, onun bir serisi olarak: satırlarını bir kez alan ve her seriyi bir satırdan okuduğuyla adlandıran grafikler için.

```kotlin
ChartValue("desktop", "Desktop") { it.desktop }
```

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir.
- `dash: ChartDash?`: Çizgisinin bütün mü, kesik mi, noktalı mı çizildiği. Bir çubuğun çizgisi yoktur. Null ise bütün; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki sırasının söylediği gibi.
- `marker: ChartMarker`: Noktalarının her birini neyin işaretlediği. Bir çubuğun işareti yoktur.
- `axis: ChartYAxis`: Serinin grafiğin hangi değer ekseniyle okunduğu: ilkinden başka türde bir değer için, bir miktarın yanındaki bir pay için, grafiğin öbür yanındaki ikincisi.
- `pattern: ChartPattern?`: Çubuklarının, ya da doluysa çizgisinin altındaki yerin, renginin yanında çizildiği desen. Null ise hiçbiri; grafiğin desenleri açıksa, grafiğin serileri arasındaki sırasındaki desen.
- `y: (T) -> Number?`: Bir satırın değeri, yoksa null.

### ChartCurve

`import com.pantrixui.components.chart.common.ChartCurve`, `com.pantrixui:components` içinden

```kotlin
enum class ChartCurve
```

Bir çizginin bir noktadan ötekine nasıl gittiği.

Değerleri:

- `Linear`: Noktadan noktaya düz.
- `Smooth`: Noktalardan yuvarlanarak geçer ama onları aşmaz: iki noktanın arasında çizgi onların iki değerinin arasında kalır; değerlerin sahip olmadığı bir tepe ya da çukur göstermez.
- `Step`: Her noktanın değerinde düz; bir sonrakine ikisinin tam ortasında basamak atar.
- `StepBefore`: Bir noktanın değerine bir önceki noktada geçer: her noktadan önce düzdür.
- `StepAfter`: Her noktadan sonra, bir sonrakine dek düz: değişene kadar yerinde duran bir değer.

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

### ChartMissing

`import com.pantrixui.components.chart.common.ChartMissing`, `com.pantrixui:components` içinden

```kotlin
enum class ChartMissing
```

Değeri olmayan bir satırda çizginin ne yaptığı.

Değerleri:

- `Gap`: Çizgi ondan önce durur ve ondan sonra yeniden başlar.
- `Connect`: Çizgi ondan önceki noktadan sonraki noktaya sürer.
- `Zero`: Satırın değeri sıfır sayılır.
