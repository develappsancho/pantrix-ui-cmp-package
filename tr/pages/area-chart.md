# Area Chart

Bir kez verilen satırlardan bir alan grafiği: satırlardan okunan her değer için bir çizgi ve çizgiyle sıfırın arasını dolduran bir alan. Yüksekliğiyle okunan miktarlar içindir: bir gelir, bir trafik, bir stok.

Serilerinin hepsi dolgulu çizgi olan ve hepsi aynı satırlardan okunan bir `PantrixChart`'ın kısa yazılışıdır. Eksenler, lejant, tooltip, durum, klavye ve ekran okuyucu "Chart" sayfasında anlatıldığı gibidir.

- `PantrixAreaChart` (`com.pantrixui.components.chart.area`, `com.pantrixui:components`): Tek bir satır listesinden okunan her değer için, yüksekliğiyle okunan miktarlar için dolgulu bir çizgi: serilerinin hepsi alan olan bir grafiğin kısa yolu. Anahtar sözcükler: alan grafik, dolgulu çizgi, yığılmış alan, hacim, birikimli.

## Özellikler

- **Dolgu.** `fill` çizginin altını neyin doldurduğunu söyler: `Gradient` serinin renginin çizgiden sıfıra doğru solmasıdır, `Solid` rengin düz bir tonu.
- **Sıfır.** Alan grafiğinin değer ekseni sıfırdan başlar: bir alanın yüksekliği miktar olarak okunur ve sıfırın üstünden kesilen bir alan olduğundan azını gösterir. Eksen `startFromZero = false` ile başka türlü söyleyebilir. Sıfırın altına inen değerlerde alan sıfır çizgisinden aşağı dolar.
- **Üst üste alanlar.** Her alan bir öncekinin üstüne ve hepsi sıfırdan çizilir: sonraki seri, daha büyük olduğu yerde öncekini örter. Solan dolgu alttakini gösterir; büyük seriyi önce ver.
- **Yığılı alanlar.** `stacked` ile her alan bir öncekinin üstünde durur ve en üstteki çizgi toplamdır: bir bütünün parçaları böyle gösterilir. Tooltip her serinin kendi değerini, ardından da toplamı yazar. `stacking = ChartStacking.Percent` ile her yerin toplamı yüzde yüz sayılır ve alanlar payları gösterir.
- **Çizgi.** `curve`, `missing` ve bir serinin `dash`'i ile `marker`'ı çizgi grafiğindeki gibidir.
- **Otomasyon.** Grafik, olduğu `PantrixChart` gibi etiketlenir: `Chart_<tagKey>`.

## Kullanım

### One amount over the months, rounded and fading down

```kotlin
PantrixAreaChart(
    data = months,
    x = { it.name },
    values = listOf(ChartValue("revenue", stringResource(Res.string.revenue)) { it.revenue }),
    curve = ChartCurve.Smooth,
    description = stringResource(Res.string.revenue_of_the_year),
    tagKey = "revenue"
)
```

### Two amounts in flat tints, the larger first

```kotlin
PantrixAreaChart(
    data = days,
    x = { it.day },
    values = listOf(
        ChartValue("requests", stringResource(Res.string.requests)) { it.requests },
        ChartValue("errors", stringResource(Res.string.errors)) { it.errors }
    ),
    fill = ChartFill.Solid,
    tagKey = "requests"
)
```

## Örnekler

### Tek bir miktar

Tek bir miktar, aylar boyunca: çizgi yumuşak geçiyor ve altı, rengi sıfıra doğru solarak doluyor. Değer ekseni kendiliğinden sıfırdan başlar; değerleri kısa yazılıyor (`format`).

Tek serili grafiğin lejantı yoktur: çizginin ne olduğu grafiğin çevresindeki yazıya aittir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixAreaChart(
    data = STORAGE,
    x = { it.month },
    values = listOf(ChartValue("used", "Kullanılan alan") { it.used }),
    curve = ChartCurve.Smooth,
    yAxis = ChartAxis(format = { "${strings.decimal(it)} GB" }),
    description = "Aylara göre kullanılan depolama alanı",
    tagKey = "plain"
)

private data class Storage(
    val month: String,
    val used: Int,
    val backups: Int
)

private val STORAGE = listOf(
    Storage("Oca", used = 120, backups = 40),
    Storage("Şub", used = 138, backups = 46),
    Storage("Mar", used = 151, backups = 52),
    Storage("Nis", used = 149, backups = 61),
    Storage("May", used = 176, backups = 64),
    Storage("Haz", used = 203, backups = 72),
    Storage("Tem", used = 221, backups = 85),
    Storage("Ağu", used = 214, backups = 91),
    Storage("Eyl", used = 252, backups = 96),
    Storage("Eki", used = 281, backups = 110),
    Storage("Kas", used = 305, backups = 124),
    Storage("Ara", used = 342, backups = 131)
)
```

### İki miktar, iki dolgu

İki miktar, büyüğü önce verilerek. `Gradient` ile her alan çizgisinden sıfıra doğru solar ve alttaki alan üsttekinin içinden görünür; `Solid` ile dolgu düz bir tondur. Anahtarı çevir, ikisini karşılaştır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var solid by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = solid,
    onCheckedChange = { solid = it },
    label = "Düz dolgu",
    tagKey = "area_solid"
)
PantrixAreaChart(
    data = STORAGE,
    x = { it.month },
    values = listOf(
        ChartValue("used", "Kullanılan alan") { it.used },
        ChartValue("backups", "Yedekler") { it.backups }
    ),
    curve = ChartCurve.Smooth,
    fill = if (solid) ChartFill.Solid else ChartFill.Gradient,
    description = "Aylara göre kullanılan alan ve yedekler",
    tagKey = "fills"
)

private data class Storage(
    val month: String,
    val used: Int,
    val backups: Int
)

private val STORAGE = listOf(
    Storage("Oca", used = 120, backups = 40),
    Storage("Şub", used = 138, backups = 46),
    Storage("Mar", used = 151, backups = 52),
    Storage("Nis", used = 149, backups = 61),
    Storage("May", used = 176, backups = 64),
    Storage("Haz", used = 203, backups = 72),
    Storage("Tem", used = 221, backups = 85),
    Storage("Ağu", used = 214, backups = 91),
    Storage("Eyl", used = 252, backups = 96),
    Storage("Eki", used = 281, backups = 110),
    Storage("Kas", used = 305, backups = 124),
    Storage("Ara", used = 342, backups = 131)
)
```

### Sıfırın altına inen değerler

Sıfırın iki yanında değerler: bir ayın kârı ya da zararı. Alan her zaman sıfıra doğru dolar: kârda aşağı, zararda yukarı. Sıfırda bir çizgi çizilir ve solan dolgu sıfırın iki yanında da en uzak noktada en güçlüdür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixAreaChart(
    data = PROFIT,
    x = { it.first },
    values = listOf(ChartValue("profit", "Kâr") { it.second }),
    yAxis = ChartAxis(format = { strings.compact(it) }),
    description = "Aylara göre kâr ve zarar",
    tagKey = "below_zero"
)

private val PROFIT = listOf(
    "Oca" to 84_000,
    "Şub" to 52_000,
    "Mar" to 21_000,
    "Nis" to -18_000,
    "May" to -46_000,
    "Haz" to -31_000,
    "Tem" to 9_000,
    "Ağu" to 38_000,
    "Eyl" to 67_000,
    "Eki" to 95_000,
    "Kas" to 112_000,
    "Ara" to 140_000
)
```

### Basamaklı bir alan

Değişene kadar yerinde duran bir değer: bir deponun stoku. `StepAfter` her değeri bir sonrakine kadar düz taşır ve dolgu basamakların altını doldurur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartFill

PantrixAreaChart(
    data = STOCK,
    x = { it.first },
    values = listOf(ChartValue("stock", "Stok") { it.second }),
    curve = ChartCurve.StepAfter,
    fill = ChartFill.Solid,
    description = "Haftalara göre depodaki stok",
    tagKey = "stepped"
)

private val STOCK = listOf(
    "1. hafta" to 480,
    "2. hafta" to 480,
    "3. hafta" to 310,
    "4. hafta" to 310,
    "5. hafta" to 640,
    "6. hafta" to 520,
    "7. hafta" to 520,
    "8. hafta" to 270
)
```

### Yığılı alanlar

Bir bütünün parçaları: üç kaynaktan gelen ziyaret, üst üste (`stacked`). Her alan altındakinin çizgisinden başlar ve en üstteki çizgi toplam ziyarettir. Dolgu düz bir ton: yığında hangi alanın nerede bittiği böyle okunur. Tooltip kaynakların ardından ayın toplamını yazar.

Anahtarı çevir: her ay yüzde yüz sayılır (`stacking = ChartStacking.Percent`). Alanlar artık kaynakların payıdır, eksen yüzde yazar; tooltip her değerin yanına payını ekler.

Lejanttaki bir ada bas: kaynak çıkar ve üstündekiler onun yerine iner.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.area.PantrixAreaChart
import com.pantrixui.components.chart.cartesian.ChartStacking
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var shares by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = shares,
    onCheckedChange = { shares = it },
    label = "Paylar olarak",
    tagKey = "area_shares"
)
PantrixAreaChart(
    data = SOURCES,
    x = { it.month },
    values = listOf(
        ChartValue("search", "Arama") { it.search },
        ChartValue("direct", "Doğrudan") { it.direct },
        ChartValue("social", "Sosyal") { it.social }
    ),
    fill = ChartFill.Solid,
    stacked = true,
    stacking = if (shares) ChartStacking.Percent else ChartStacking.Normal,
    description = "Aylara göre üç kaynaktan gelen ziyaret, üst üste",
    tagKey = "stacked"
)

private data class Sources(
    val month: String,
    val search: Int,
    val direct: Int,
    val social: Int
)

private val SOURCES = listOf(
    Sources("Oca", search = 420, direct = 240, social = 130),
    Sources("Şub", search = 480, direct = 260, social = 120),
    Sources("Mar", search = 455, direct = 300, social = 165),
    Sources("Nis", search = 530, direct = 280, social = 190),
    Sources("May", search = 510, direct = 330, social = 240),
    Sources("Haz", search = 560, direct = 310, social = 285)
)
```

## API

### PantrixAreaChart

`import com.pantrixui.components.chart.area.PantrixAreaChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixAreaChart(
    data: List<T>,
    x: (T) -> Any,
    values: List<ChartValue<T>>,
    modifier: Modifier = Modifier,
    curve: ChartCurve = ChartCurve.Linear,
    fill: ChartFill = ChartFill.Gradient,
    missing: ChartMissing = ChartMissing.Gap,
    stacked: Boolean = false,
    stacking: ChartStacking = ChartStacking.Normal,
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

Bir kez verilen satırlardan bir alan grafiği: onlardan okunan `values`'ın her biri için bir çizgi, çizgiyle sıfırın arası doldurularak.

Serilerinin hepsi aynı satırlardan okunan dolgulu çizgiler olan bir `PantrixChart`'tır, daha kısa yazılmış. Değer ekseni, eksen başka türlü söylemedikçe sıfırdan başlar: dolgulu bir alanın yüksekliği miktar olarak okunur ve sıfırın üstünden kesilen bir alan olduğundan azını gösterir.

Her alan bir öncekinin üstüne ve hepsi sıfırdan çizilir: sonraki seri, daha büyük olduğu yerde öncekini örter; solan `fill` alttakini gösterir. Büyük seriyi önce ver. Değerler bir bütünün parçalarıysa `stacked` olurlar: her alan bir öncekinin üstünde durur ve en üstteki çizgi bütündür. `stacking`'in söylediği gibi paylar olarak yığıldığında en üstteki çizgi baştan sona yüzde yüzdür ve alanlar bütünün yerden yere nasıl paylaşıldığını gösterir.

```kotlin
PantrixAreaChart(
    data = months,
    x = { it.name },
    values = listOf(ChartValue("revenue", "Revenue") { it.revenue }),
    curve = ChartCurve.Smooth,
    tagKey = "revenue"
)
```

Parametreler:

- `data: List<T>`: satırlar, çizgilerin onlardan geçtiği sırayla.
- `x: (T) -> Any`: bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `values: List<ChartValue<T>>`: seriler: her birinin bir satırdan ne okuduğu, nasıl adlandırıldığı ve çizildiği.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `curve: ChartCurve`: her çizginin bir noktadan ötekine nasıl gittiği.
- `fill: ChartFill`: her çizginin altını neyin doldurduğu: sıfıra doğru solan rengi ya da renginin bir tonu.
- `missing: ChartMissing`: değeri olmayan bir satırda bir çizginin ne yaptığı.
- `stacked: Boolean`: her alanın sıfırın üstünde değil, `values`'ın sırasıyla bir öncekinin üstünde durup durmadığı.
- `stacking: ChartStacking`: yığılı alanların birbirinin üstünde nasıl durduğu: değerleri olarak ya da yığından aldıkları paylar olarak. `stacked` olmayan alanların buna göre duracak bir yığını yoktur.
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

### ChartFill

`import com.pantrixui.components.chart.common.ChartFill`, `com.pantrixui:components` içinden

```kotlin
enum class ChartFill
```

Bir çizgiyle sıfırın arasını neyin doldurduğu.

Değerleri:

- `None`: Hiçbir şey: bir çizgi.
- `Solid`: Serinin renginin yumuşak bir tonu, çizgiden aşağı her yerde aynı.
- `Gradient`: Serinin rengi, çizgiden aşağı solarak, sıfırda hiçe varana dek.

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
