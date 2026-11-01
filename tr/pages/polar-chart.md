# Polar Chart

Bir ortanın çevresine dizilmiş çubuklar: her biri ortadan dışarı, değeri kadar uzun. Dönüp gelen şeylere yakışır: günün saatleri, yılın ayları, pusulanın yönleri; ve hangisinin ne kadar uzandığı bir bakışta karşılaştırılacak olana.

Grafiğe serileri verilir; her `PolarSeries` kendi satırlarını taşır: satırın durduğu dilim (`x`) ve oradaki değeri (`y`). Dilimler, serilerin adlandırdığı sırayla, saat on ikiden başlayıp saat yönünde dizilir ve turdan eşit pay alır. Değer ekseni ortadan dışarı gider: sıfırdan değerlerin üstündeki yuvarlak bir sayıya.

- `PantrixPolarChart` (`com.pantrixui.components.chart.polar`, `com.pantrixui:components`): Bir orta çevresinde dizilen çubuklar, her biri ortadan dışarı değeri kadar uzun, yan yana ya da üst üste: serileri çıkarıp geri getiren bir lejant, gösterilen dilim için bir tooltip; her dilime tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: kutupsal grafik, kutupsal alan, gül grafik, nightingale, dairesel çubuk.

## Özellikler

- **Yan yana ve üst üste.** Birkaç serinin çubukları bir dilimde yan yana durur; aynı `stack`'i söyleyen seriler orada tek bir çubuğu paylaşır, her biri bir öncekinin dışında.
- **Ortadaki boşluk.** `hole` ile çubuklar bir halkadan başlar: en kısası da görünür. En çok yarıçapın onda dokuzu.
- **Halkalar.** Değer halkaları yuvarlaktır: çubukların ucu da öyledir ve onlara göre okunur. `grid = RadarGrid.Polygon` ile halkalar bir dilimin kenarından ötekine düz çizilir, çubukların ucu da düz olur. İşaretli değerler ilk dilimin başındaki çizginin üstüne, çubukların üzerine yazılır.
- **Dolgu.** `fillAlpha`, bir serinin çubuklarının renginin ne kadarıyla doldurulacağını söyler: birden azında arkadaki halkalar görünür. Lejant ve tooltip rengin tamamını gösterir.
- **Eksenler.** `xAxis` dilimlerdir: adları (`labels`, `label`) ve aralarındaki çizgiler (`line`). `yAxis` değer eksenidir: uçları, işaretlenen değer sayısı, yazımı, değerler (`labels`) ve halkalar (`grid`).
- **Gösterilen dilim.** İmlecin üstünde olduğu ya da dokunulan dilim gölgelenir ve tooltip serilerin oradaki değerlerini yazar.
- **Klavye.** Grafik, Tab için tek duraktır: oklar dilimden dilime grafiğin çevresinde döner, sondan sonra başa gelir; Home ve End ilk ve son dilime gider, Escape bırakır, Enter ve boşluk gösterilen değere basar.
- **Ekran okuyucu.** Grafik `description`'ını, ardından her dilimi serilerin oradaki değerleriyle söyler.
- **Yön.** Grafik sağdan sola okunan dilde de aynı yöne döner.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `PolarChart_<tagKey>`; çizim alanı `.Plot`, dilimler `.Point_<sıra>`, lejant kayıtları `.Legend_<seri>`, tooltip `.Tooltip`.

## Kullanım

### The hours of a day

```kotlin
PantrixPolarChart(
    series = listOf(
        PolarSeries("visits", stringResource(Res.string.visits), hours, x = { it.hour }, y = { it.visits })
    ),
    hole = 0.3f,
    description = stringResource(Res.string.visits_by_hour),
    tagKey = "hours"
)
```

### Two series stacked in each sector

```kotlin
PantrixPolarChart(
    series = listOf(
        PolarSeries("new", stringResource(Res.string.new_visitors), months, { it.name }, { it.new }, stack = "all"),
        PolarSeries("back", stringResource(Res.string.returning), months, { it.name }, { it.back }, stack = "all")
    ),
    tagKey = "visitors"
)
```

## Örnekler

### Günün saatleri

Bir mağazanın günün saatlerine göre ziyaretçisi, ikişer saatlik dilimlerle. Ortada bir boşluk var (`hole`): gece saatlerinin kısa çubukları da görünür.

İmleci bir dilimin üstüne getir ya da dokun: dilim gölgelenir ve tooltip o saatlerin ziyaretçisini yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Ziyaret", shopHours(), x = { it.hours }, y = { it.weekday })),
    hole = 0.25f,
    description = "Saatlere göre ziyaret",
    tagKey = "plain"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Yan yana iki seri

Hafta içi ve hafta sonu, her dilimde yan yana: aynı saatlerde iki günün farkı okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

val hours = shopHours()
PantrixPolarChart(
    series = listOf(
        PolarSeries("weekday", "Hafta içi", hours, x = { it.hours }, y = { it.weekday }),
        PolarSeries("weekend", "Hafta sonu", hours, x = { it.hours }, y = { it.weekend })
    ),
    hole = 0.25f,
    description = "Saatlere göre ziyaret, hafta içi ve hafta sonu",
    tagKey = "grouped"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Üst üste

Aynı `stack`'i söyleyen iki seri her dilimde tek bir çubuğu paylaşır: çubuğun tamamı toplamı, parçaları kimden geldiğini gösterir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

val hours = shopHours()
PantrixPolarChart(
    series = listOf(
        PolarSeries("store", "Mağaza", hours, x = { it.hours }, y = { it.weekday }, stack = "all"),
        PolarSeries("online", "İnternet", hours, x = { it.hours }, y = { it.online }, stack = "all")
    ),
    description = "Saatlere göre ziyaret, mağaza ve internet",
    tagKey = "stacked"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Düz halkalar

Düz halkalar (`RadarGrid.Polygon`): her halka bir dilimin kenarından ötekine düz, çubukların ucu da düz ve halkasının çizgisine oturur. Çubuklar renklerinin yüzde altmışıyla dolu (`fillAlpha`): arkalarındaki halkalar görünür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries
import com.pantrixui.components.chart.radar.RadarGrid

PantrixPolarChart(
    series = listOf(
        PolarSeries("visits", "Ziyaret", shopHours(), x = { it.hours }, y = { it.weekday }, fillAlpha = 0.6f)
    ),
    hole = 0.25f,
    grid = RadarGrid.Polygon,
    description = "Saatlere göre ziyaret",
    tagKey = "polygon"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Kendi görünüşü

Bir grafiğin kendi görünüşü: çubukların arası daha açık (`sliceGap`), dilimlerin arasında çizgi yok (`xAxis`'in `line`'ı) ve eksen dört değer işaretler (`yAxis`'in `ticks`'i). Verilmeyen alan temanınki kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Ziyaret", shopHours(), x = { it.hours }, y = { it.weekend })),
    xAxis = ChartAxis(line = false),
    yAxis = ChartAxis(ticks = 4),
    description = "Hafta sonu, saatlere göre ziyaret",
    style = ChartStyle(sliceGap = 6.dp),
    tagKey = "own_look"
)

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada halkalar, saatler ve dilimler durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.polar.PantrixPolarChart
import com.pantrixui.components.chart.polar.PolarSeries

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Ziyaret", shopHours(), x = { it.hours }, y = { it.weekday })),
    hole = 0.25f,
    description = "Saatlere göre ziyaret",
    tagKey = "exported",
    export = ChartExport(fileName = "saatler") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun shopHours(): List<ShopHours> = listOf(
    ShopHours("00", weekday = 4, weekend = 9, online = 12),
    ShopHours("02", weekday = 2, weekend = 5, online = 7),
    ShopHours("04", weekday = 2, weekend = 3, online = 4),
    ShopHours("06", weekday = 8, weekend = 4, online = 6),
    ShopHours("08", weekday = 26, weekend = 12, online = 14),
    ShopHours("10", weekday = 41, weekend = 30, online = 22),
    ShopHours("12", weekday = 58, weekend = 47, online = 27),
    ShopHours("14", weekday = 46, weekend = 62, online = 25),
    ShopHours("16", weekday = 52, weekend = 70, online = 29),
    ShopHours("18", weekday = 63, weekend = 55, online = 38),
    ShopHours("20", weekday = 35, weekend = 41, online = 44),
    ShopHours("22", weekday = 14, weekend = 24, online = 30)
)

internal class ShopHours(
    val hours: String,
    val weekday: Int,
    val weekend: Int,
    val online: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixPolarChart

`import com.pantrixui.components.chart.polar.PantrixPolarChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixPolarChart(
    series: List<PolarSeries<*>>,
    modifier: Modifier = Modifier,
    hole: Float = 0f,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    grid: RadarGrid = RadarGrid.Circle,
    export: ChartExport? = null
)
```

Bir polar grafik: bir ortanın çevresine dizilmiş çubuklar, her biri ortadan dışarı değeri kadar uzun: bir gül. Dönüp gelen şeylere yakışır, günün saatleri, yılın ayları, pusulanın yönleri; ve hangisinin ne kadar uzandığı bir bakışta karşılaştırılacak olana.

Grafiğe `series` verilir ve her biri kendi satırlarını taşır: bir satırın durduğu dilim ve oradaki değeri. Grafik, serilerden herhangi birinin adını verdiği her dilimi, ilk adlandırıldıkları sırayla, saat on ikiden başlayıp saat yönünde dizer; her biri turun eşit bir parçasıdır. Birkaç serinin çubukları bir dilimde yan yana durur ve aynı `stack`'in adını veren seriler orada tek bir çubuğu paylaşır. Tek bir değer ekseni ortadan dışarı gider: eksen başka söylemedikçe sıfırdan, değerlerin en büyüğünün üstündeki yuvarlak bir sayıya. Halkaları yuvarlaktır, onlara göre okunan çubukların uçları gibi; çokgenlerden bir `grid` ile bir dilimin kenarından ötekine düzdürler, çubukların uçları da öyle. Bir `hole` ile çubuklar bir halkadan başlar ve en kısası da görünür.

Çubukların çevresinde, yerleri olan bir grafiğin parçaları durur; her biri onu tarif eden değerle verilir ve `null` ile kaldırılır: iki eksen, serileri listeleyen ve kaydına basılınca bir seriyi grafikten çıkaran `legend` ve gösterilen dilimdeki değerleri gösteren `tooltip`.

**Bir dilimi göstermek.** Bir dilimin üstündeki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği dilime bir dokunuş da onu bırakır. Klavyeyle grafik Tab için tek bir duraktır: oklar grafiğin çevresinde dilimden dilime gider ve sonuncudan sonra yine ilkine; Home ve End ilkine ve sonuncusuna, Escape bırakır. Tooltip serileri ayırıyorsa yukarı ve aşağı oklar bir serinin çubuğundan ötekine gider. Dilim gölgelenir, tooltip onun için gösterilir ve `state`'e söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra serilerin oradaki değerleriyle her dilim, dilimlerin sırasıyla. Lejantın kayıtları birer anahtardır.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir. Modifier'ındaki bir yükseklik grafiğin tamamınındır, lejantınki de içinde; verilmezse grafik stilinin söylediği kadar yüksektir ve üstündeki ya da altındaki bir lejant kendi yüksekliğini ekler. Gül, dilimlerin adları çevresinde olmak üzere, lejanttan kalan yere sığan en büyüğüdür.

Grafik sağdan okunan bir dilde de aynı yöne döner; lejantı ve tooltip'i okuma yönüne uyar.

```kotlin
PantrixPolarChart(
    series = listOf(PolarSeries("visits", "Visits", hours, x = { it.hour }, y = { it.visits })),
    hole = 0.3f,
    description = "Visits by the hour of the day",
    tagKey = "hours"
)
```

Parametreler:

- `series: List<PolarSeries<*>>`: seriler, çizildikleri ve listelendikleri sırayla. Anahtarları onları birbirinden ayırır; aynı anahtarlı iki seri reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `hole: Float`: grafiğin yarıçapının ne kadarının ortasından kesilip çıkarıldığı: ortadan başlayan çubuklar için sıfır. En çok onda dokuz.
- `xAxis: ChartAxis?`: dilimler: adlarının grafiğin çevresine yazılıp yazılmadığı (`labels`), bir adın nasıl yazıldığı (`label`) ve bir dilim ile sonraki arasına çizgi çizilip çizilmediği (`line`). `null` onlardan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin ortasından dışarı: uçları, yaklaşık kaç değer işaretlediği, bir değerin nasıl yazıldığı, işaretli değerlerin yazılıp yazılmadığı (`labels`) ve her birinde bir halka çizilip çizilmediği (`grid`). `startFromZero` ya da `min` başka söylemedikçe sıfırdan başlar. `null` ondan hiçbir şey çizmez.
- `legend: ChartLegend?`: serilerin adlarının durduğu yer. `null` hiç göstermez.
- `tooltip: ChartTooltip?`: gösterilen dilim için gösterilen. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gizledikleri ve gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik serilerinin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan değerle çağrılır: gösterilen değer, ya da dilimin değerleri birlikte gösteriliyorsa çubuğu basışa en yakın olan serinin değeri.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi için temanınkiler.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `PolarChart_<tagKey>`, çizim alanı `PolarChart_<tagKey>.Plot`, bir dilimi birden sayılarak `PolarChart_<tagKey>.Point_<number>`, bir serinin lejant kaydı `PolarChart_<tagKey>.Legend_<series' key>` ve tooltip `PolarChart_<tagKey>.Tooltip` olur. Bir değere basış, serinin anahtarıyla bir `PolarChart` `select` olayı olarak, bir lejant kaydına basış da anahtarla ve serinin gösterilip gösterilmediğiyle bir `toggle` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `grid: RadarGrid`: halkaların nasıl çizildiği: yuvarlak, ya da bir dilimin bir kenarından ötekine düz, bir ağ; ağın çubukları onun çizgilerinde düz biter ve onlara göre okunur. Üçten az dilimi olan grafiğin halkaları her iki durumda da yuvarlaktır.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur.

### PolarSeries

`import com.pantrixui.components.chart.polar.PolarSeries`, `com.pantrixui:components` içinden

```kotlin
class PolarSeries<T>(
    public val key: String,
    public val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    public val color: Color = Color.Unspecified,
    public val stack: String? = null,
    public val pattern: ChartPattern? = null,
    public val fillAlpha: Float = 1f
)
```

Bir `PantrixPolarChart`'taki bir çubuk serisi: okunduğu satırlar, her birinin durduğu dilim ve oradaki değeri.

```kotlin
PolarSeries("north", "North", months, x = { it.name }, y = { it.north })
```

`x` bir satırın hangi dilimde durduğunu söyler: bir ad, bir ay, kendine eşit olan herhangi bir şey; grafik onu ekseninin `label`'ıyla, o verilmemişse kendini yazdığı gibi yazar. `y` satırın değeridir, değeri yoksa null: değeri olmayan satırın çubuğu yoktur. Sayı olmayan ya da sonu olmayan bir değer yok sayılır.

Kuruldukları her şey aynı olan iki seri, iki fonksiyon da dahil, aynı seridir.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar.
- `x: (T) -> Any`: Bir satırın durduğu dilim.
- `y: (T) -> Number?`: Bir satırın değeri, yoksa null.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `stack: String?`: Serinin neyle yığıldığı. Aynı yığının adını veren seriler her dilimde tek bir çubuğu paylaşır, her biri bir öncekinin dışında. Null ise serinin ötekilerin yanında kendi çubuğu olur.
- `pattern: ChartPattern?`: Çubuklarının renginin yanında çizildiği desen. Null ise hiçbiri; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki yerine göre sırasındaki desen.
- `fillAlpha: Float`: Çubuklarının renginin ne kadarıyla doldurulduğu: sıfırdan bire, varsayılan olarak tamamı. Daha azı, çubuklarının arkasındaki halkaların içlerinden görünmesini sağlar; lejant ve tooltip rengin tamamını korur.

### RadarGrid

`import com.pantrixui.components.chart.radar.RadarGrid`, `com.pantrixui:components` içinden

```kotlin
enum class RadarGrid
```

Bir `PantrixRadarChart`'ın halkalarının nasıl çizildiği: ortasının çevresinde değerlerini işaretleyen çizgiler.

Değerleri:

- `Polygon`: Bir koldan sonrakine düz: bir ağ.
- `Circle`: Yuvarlak.

### ChartAxis

`import com.pantrixui.components.chart.cartesian.ChartAxis`, `com.pantrixui:components` içinden

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

Bir `PantrixChart`'ın bir ekseni: boyunca ne yazıldığı, ondan çizilen çizgiler ve, değerlerin ekseni için, nereye kadar gittiği.

Bir grafiğin, serilerinin boyunca durduğu bir ekseni vardır, satırlarının adını verdiği yerler, bir de orada sahip oldukları değerlerin ekseni; serileri iki türden değer taşıyan bir grafiğin, bir miktar ve onun bir payı, öbür yanında değerlerin ikinci bir ekseni vardır. Her biri kendisine uyanı alır, gerisini bırakır: yerlerin en azı ve en çoğu yoktur, değerlerin `label`'ı.

```kotlin
val strings = PantrixTheme.strings
PantrixChart(series = series, yAxis = ChartAxis(title = "Visits", format = { strings.compact(it) }))
```

Bir eksenin yerine `null` verilirse ondan hiçbir şey çizilmez: ne yazı, ne çizgi, ne kılavuz çizgisi. Seriler yine ona göre dizilir.

Parametreler:

- `title: String?`: Eksenin neyi ölçtüğü, yanına yazılır: yerlerin altına, ve değerlerin yanı boyunca döndürülerek. Verilmezse başlık yoktur.
- `labels: Boolean`: Yerlerin, ya da kılavuz çizgilerindeki değerlerin, yazılıp yazılmadığı. Yerlerin hepsine yer olmadığında her ikincisi ya da üçüncüsü yazılır; grafiğin genişliği az değiştikçe yine aynıları.
- `line: Boolean?`: Eksen boyunca bir çizgi çizilip çizilmediği. Verilmezse yerlerin altında bir çizgi vardır, değerlerin yoktur.
- `grid: Boolean?`: Eksenin her işaretinde grafik boyunca bir çizgi çizilip çizilmediği. Verilmezse değerlerin vardır, yerlerin yoktur; ikinci değer ekseninin ise ilk eksen çizilmediğinde, kendi işaretlerinde vardır.
- `ticks: Int`: Değerlerin ekseni boyunca yaklaşık kaç değerin işaretlendiği. Yuvarlak sayılarda dururlar ve birbirlerine o kadarının duracağından yakın olmazlar: daha az olabilirler. Sıfır, yer olduğu kadarını işaretler. Değerlerin ikinci ekseninin bunda sözü yalnızca kendi başına işaretlendiğinde vardır: bir ucunu verdiğinde ya da kendi `values`'u olduğunda. Öbür durumda işaretleri ilkinin çizgilerinde durur.
- `values: List<Double>?`: Değerlerin ekseni boyunca, yuvarlak adımların yerine işaretlenen değerler: günün saatleri için `listOf(0.0, 6.0, 12.0, 18.0, 24.0)`. Eksenin uçları arasında kalanlar işaretlenir; verilmeyen uç, bunların ve eksenin gösterdiği değerlerin en uzağına kadar gider. `ticks` okunmaz. Kendi değerleri verilen ikinci değer ekseni kendi başına işaretlenir ve kılavuz çizgileri ilkinin kalır.
- `min: Double?`: Eksenin gösterdiği en az değer. Verilmezse değerlerin en azının altındaki yuvarlak bir sayıdır, ya da `startFromZero` öyle diyorsa sıfır. Bir ucunu veren ikinci değer ekseni kendi başına işaretlenir.
- `max: Double?`: Eksenin gösterdiği en çok değer. Verilmezse değerlerin en çoğunun üstündeki yuvarlak bir sayıdır.
- `startFromZero: Boolean?`: Değerlerin ekseninin, her değer çok üstünde olsa da sıfırdan başlayıp başlamadığı, ya da her değer altında olsa da orada bitip bitmediği. Verilmezse bir seri dolguluysa başlar, çünkü dolgulu bir alanın yüksekliği miktar olarak okunur; yalnızca çizgiler varsa başlamaz, çünkü onlarda okunan iniş ve çıkıştır.
- `format: ((Double) -> String)?`: Eksenin bir değerinin nasıl yazıldığı: eksenin yanında, tooltip'te ve ekran okuyucuda. Verilmezse eksenin yanında bir değer on binden itibaren kısa yazılır (`12K`), başka her yerde tam, temanın diliyle.
- `label: ((Any) -> String)?`: Bir yerin nasıl yazıldığı, bir serinin `x`'inin o yer için verdiği şeyle: grafiğin altında, tooltip'in başlığı olarak ve ekran okuyucuya. Verilmezse kendini yazdığı gibi yazılır, tam sayıysa temanın rakamlarıyla. Yerleri an olan grafikte bir yerin tooltip'te ve ekran okuyucuda nasıl yazıldığını söyler; eksenin işaretlerini yazmak `time`'ındır.
- `time: ChartTime?`: Yerleri an olan, her biri bir `kotlin.time.Instant` olan grafik için: nasıl yazıldıkları ve hangi saate göre okundukları. Verilmezse temanın diliyle ve ekranın saatiyle (`LocalPantrixClock`). Bir değer ekseni bunun hiçbirini okumaz.
- `numeric: Boolean`: Yerlerinin hepsi sayı olan bir yer ekseninin onları sayılarına göre dizip dizmediği: sıralarıyla, birbirlerinden ne kadar uzaklarsa o kadar aralıklı; eksen yuvarlak sayılara işaretlenir ve her biri `format`'ın söylediği gibi yazılır, `label` bir şey söylemedikçe yerler de öyle; grafiğin bir işareti de aralarındaki herhangi bir sayıda durur. Verilmezse sayılar da her ad gibidir: satırların adlandırdığı sırayla, eşit aralıklarla dizilir; yıllar, haftaların numaraları gibi. Bir değer ekseni bunun hiçbirini okumaz.

### ChartStyle

`import com.pantrixui.components.chart.common.ChartStyle`, `com.pantrixui:components` içinden

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

Bir grafiğin geometrisi: hiçbir şey söylemediğinde ne kadar yüksek olduğu, çizgilerinin ne kadar kalın, işaretlerinin ne kadar büyük olduğu ve parçalarının arasındaki boşluk; ve dolgularının renklerinin yanında desen alıp almadığı.

Bir grafik telefonda çevresindekilere yer bırakacak kadar yüksektir, yeri bol bir pencerede daha yüksek. Parmağın altında değerlerinin çizgileri, imlecin altındakinden biraz daha aralıklı durur.

Parçaların arasındaki boşluklar yoğunlukla ölçeklenir, çubukların ve dilimlerin arasındakiler de. Yükseklik, çizgilerin kalınlıkları, işaretlerin ve balonların boyutları, bir çubuğun genişliği ile köşeleri, gösterilen dilimin ne kadar dışarı taştığı, bir göstergenin yayının kalınlığı, bir ölçüm grubunun çubuğunun, bir durum izleyicinin bloklarının ve bir gezgin şeridinin yüksekliği ve tooltip'in köşeleriyle gölgesi ölçeklenmez: bir grafiğin çizgileri sık bir düzende de ferah bir düzende de aynı kalınlıktadır.

Parametreler:

- `height: Dp`: Grafiğin modifier'ı ona bir yükseklik vermediğinde çizim alanının, eksenleriyle birlikte, ne kadar yüksek olduğu. Çizim alanının üstündeki ya da altındaki bir lejant kendi yüksekliğini ekler.
- `lineWidth: Dp`: Bir serinin çizgisinin kalınlığı.
- `markerSize: Dp`: Bir noktadaki işaretin genişliği ve yüksekliği.
- `selectedMarkerSize: Dp`: Aynısı, gösterilen noktadaki işaret için.
- `gridWidth: Dp`: Kılavuz çizgilerinin, eksenler boyunca çizilen çizgilerin ve gösterilen yeri işaretleyen çizginin kalınlığı. Sıfır hiçbirini çizmez.
- `labelGap: Dp`: Çizim alanıyla yanına ve altına yazılanın arası, ve onunla bir eksenin başlığının arası.
- `tickSpacing: Dp`: Değerlerin ekseni boyunca işaretlenen iki değerin arasındaki en az boşluk: eksen söylemediğinde kaç tanesinin işaretleneceğine karar veren şey.
- `legendGap: Dp`: Lejantla yanında durduğu grafiğin arası.
- `legendItemGap: Dp`: Lejantın bir kaydıyla sonrakinin arası.
- `swatchSize: Dp`: Bir serinin lejanttaki ve tooltip'teki örneğinin ne kadar geniş olduğu: çizgisinin kısa bir parçası ya da dolgusunun bir yaması.
- `swatchGap: Dp`: O örnekle ardındaki adın arası.
- `tooltipShape: ShapeSpec`: Tooltip'in köşeleri: markanın şekil ölçeğinin bir basamağı ya da sabit bir şekil.
- `tooltipHorizontalPadding: Dp`: Tooltip'in yanlarıyla içindekinin arası.
- `tooltipVerticalPadding: Dp`: Üstü ve altıyla içindekinin arası, ve başlığıyla satırlarının arası.
- `tooltipGap: Dp`: Gösterilen yerle yanındaki tooltip'in arası.
- `tooltipElevation: Dp`: Tooltip'in gölgesi.
- `barGap: Dp`: Bir yerde yan yana duran iki çubuğun arası. Bunun için fazla ince olan çubuklar daha yakın durur.
- `barMaxWidth: Dp`: Bir çubuğun en fazla ne kadar geniş olduğu, yerinin ne kadar yeri olursa olsun: üç yerli bir grafik üç kalas değildir.
- `barRadius: Dp`: Bir çubuğun ucunun, sıfırdan uzak ucunun, köşelerinin ne kadar yuvarlak olduğu.
- `sliceGap: Dp`: Bir pastanın yan yana duran iki dilimi arasında; pastanın ortasından kenarına kadar aynı genişlikte.
- `selectedSliceOffset: Dp`: Bir pastanın gösterilen diliminin, pastanın kenarından ne kadar dışarı taştığı. Pasta çevresinde bu kadar yer bırakır: dilimin duracağı yer olsun.
- `gaugeWidth: Dp`: Bir göstergenin yayının kalınlığı. Bir yay, yarıçapının yarısından kalın olmaz.
- `meterHeight: Dp`: Bir ölçüm grubunun çubuğunun yüksekliği.
- `trackerHeight: Dp`: Bir durum izleyicinin bloklarının yüksekliği.
- `bubbleMinSize: Dp`: Bir saçılım grafiğinin en küçük balonunun genişliği: büyüklüğü hiç olmayan ya da bir alan olarak görülemeyecek kadar az olan nokta da bir noktadır.
- `bubbleMaxSize: Dp`: En büyük balonunun genişliği: büyüklüğü grafiğin en büyüğü olanın.
- `navigatorHeight: Dp`: Zoom'unda gezgin şeridi olan bir grafikte, çizim alanının altındaki şeridin yüksekliği: grafiğin görünen kısmı onun üstünde işaretlenir ve kaydırılır. Yerleri yanından aşağı dizilen grafikte şerit çizim alanının yanında durur ve bu onun genişliğidir.
- `barBandShare: Float`: Bir yerin çubuklarının bandından aldığı pay, sıfırdan çok ve en fazla bir: kalanı bir yerin çubuklarıyla sonrakininkiler arasındaki boşluktur. Çubuklar yine de `barMaxWidth`'ten geniş olmaz.
- `markLineWidth: Dp`: Bir işaretin çizgisinin kalınlığı: bir hedefin, bir sınırın, bir günün. Sıfır çizgi çizmez; işaretin yazısı yine yazılır.
- `markBandAlpha: Float`: Bir işaretin bandının renginin ne kadarıyla çizildiği, sıfırdan bire: bant serilerin arkasında durur ve bir tondur.
- `patterns: Boolean?`: Bir grafiğin serilerinin, dilimlerinin ve karolarının dolgularının renklerinin yanında desenlerle, çizgilerinin de sırayla kesik çizilip çizilmediği (`ChartPattern`): renkleri ayırt edemeyen bir okuyucu için onları ayıran şey. Verilmezse sistemin ayarına uyulur: sistem şeyleri renksiz ayırt etmeye ayarlıysa açık (iOS'ta "Differentiate Without Color", Android'de renk düzeltme), değilse kapalı.
- `nodeWidth: Dp`: Bir sankey düğümünün ne kadar geniş olduğu.
- `nodeGap: Dp`: Bir sankey kolonunun iki düğümü arası.
