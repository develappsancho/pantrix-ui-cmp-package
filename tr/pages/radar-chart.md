# Radar Chart

Bir şeyin birkaç ölçüsü, bir ortanın çevresindeki kollara dizilir ve bir ağ olarak birleştirilir: biçimi bir bakışta okunur, iki şey biçimleriyle ayrılır. İki kişinin becerileri, bir ürün ile rakibi, bu yıl ile geçen yıl.

Grafiğe serileri verilir; her `RadarSeries` kendi satırlarını taşır: satırın durduğu kol (`x`) ve oradaki değeri (`y`). Kollar, serilerin adlandırdığı sırayla, saat on ikiden başlayıp saat yönünde dizilir. Bütün kollar tek bir değer ekseniyle okunur: ortadan dışarı, sıfırdan değerlerin üstündeki yuvarlak bir sayıya.

- `PantrixRadarChart` (`com.pantrixui.components.chart.radar`, `com.pantrixui:components`): Bir şeyin birkaç ölçüsü, bir orta çevresindeki kollarda, bir ağa bağlanmış: her seri için bir ağ, serileri çıkarıp geri getiren bir lejant, gösterilen kol için bir tooltip; her kola tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: radar grafik, örümcek grafik, ağ grafik, yıldız grafik, beceri grafiği.

## Özellikler

- **Ağ.** Her seri bir ağdır: çizgisi, renginin bir payıyla dolgusu (`filled`; payı `fillAlpha`, verilmezse beşte bir) ve her değerinde bir işaret (`marker`). Çizgi kesikli ya da noktalı olabilir (`dash`): bir hedefi ölçülenden ayırmak için. Bütün dolgular bütün çizgilerin altında durur.
- **Halkalar.** `grid`, değer halkalarının koldan kola düz mü (ağ gibi) yoksa yuvarlak mı çizileceğini söyler.
- **Eksenler.** `xAxis` kollardır: adları yazılsın mı (`labels`), nasıl yazılsın (`label`), kollar çizilsin mi (`line`). `yAxis` değer eksenidir: uçları, işaretlenen değer sayısı, yazımı, değerler yazılsın mı (`labels`) ve halkalar çizilsin mi (`grid`). Değer ekseni, başka söylenmedikçe sıfırdan başlar.
- **Gösterilen kol.** İmlecin en yakın olduğu ya da dokunulan kol gösterilir: kol belirginleşir, üstündeki değerler büyür ve tooltip serilerin oradaki değerlerini yazar. `ChartTooltip(shared = false)` ile tooltip yalnızca imlece en yakın serinin değerini yazar.
- **Klavye.** Grafik, Tab için tek duraktır: oklar koldan kola grafiğin çevresinde döner, sondan sonra başa gelir; Home ve End ilk ve son kola gider, Escape bırakır, Enter ve boşluk gösterilen değere basar.
- **Ekran okuyucu.** Grafik `description`'ını, ardından her kolu serilerin oradaki değerleriyle söyler.
- **Yön.** Grafik sağdan sola okunan dilde de aynı yöne döner.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `RadarChart_<tagKey>`; çizim alanı `.Plot`, kollar `.Point_<sıra>`, lejant kayıtları `.Legend_<seri>`, tooltip `.Tooltip`.

## Kullanım

### Two people's skills

```kotlin
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.skill }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.skill }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = stringResource(Res.string.skills_of_the_team),
    tagKey = "skills"
)
```

### A target as a dashed outline, on round rings

```kotlin
PantrixRadarChart(
    series = listOf(
        RadarSeries("now", stringResource(Res.string.now), scores, x = { it.area }, y = { it.now }),
        RadarSeries(
            key = "target",
            name = stringResource(Res.string.target),
            data = scores,
            x = { it.area },
            y = { it.target },
            filled = false,
            marker = ChartMarker.None,
            dash = ChartDash.Dashed
        )
    ),
    grid = RadarGrid.Circle,
    tagKey = "scores"
)
```

## Örnekler

### İki ağ

İki kişinin altı becerideki puanı, on üzerinden. İki ağın biçimi kimin nerede güçlü olduğunu gösterir.

İmleci bir kolun yakınına getir ya da dokun: tooltip iki kişinin o becerideki puanını yazar. Lejanttaki bir kayda basmak o kişiyi grafikten çıkarır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "Ada ve Lin'in becerileri",
    tagKey = "plain"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Tasarım", ada = 8, lin = 5, target = 7),
    TeamSkill("Kod", ada = 6, lin = 9, target = 8),
    TeamSkill("Test", ada = 5, lin = 7, target = 7),
    TeamSkill("Yazı", ada = 9, lin = 4, target = 6),
    TeamSkill("Sunum", ada = 7, lin = 6, target = 8),
    TeamSkill("Planlama", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### Hedefe karşı

Ölçülen ile hedef: ölçülen dolu bir ağ, hedef kesikli bir çizgi (`filled = false`, `dash`), işaretsiz. Halkalar burada yuvarlak (`RadarGrid.Circle`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarGrid
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("now", "Şimdi", skills, x = { it.name }, y = { it.ada }),
        RadarSeries(
            key = "target",
            name = "Hedef",
            data = skills,
            x = { it.name },
            y = { it.target },
            filled = false,
            marker = ChartMarker.None,
            dash = ChartDash.Dashed
        )
    ),
    yAxis = ChartAxis(max = 10.0),
    grid = RadarGrid.Circle,
    description = "Ada'nın becerileri, hedefle birlikte",
    tagKey = "target"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Tasarım", ada = 8, lin = 5, target = 7),
    TeamSkill("Kod", ada = 6, lin = 9, target = 8),
    TeamSkill("Test", ada = 5, lin = 7, target = 7),
    TeamSkill("Yazı", ada = 9, lin = 4, target = 6),
    TeamSkill("Sunum", ada = 7, lin = 6, target = 8),
    TeamSkill("Planlama", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### Serileri ayrı göstermek

`ChartTooltip(shared = false)` ile tooltip kolun bütün serilerini değil, imlece en yakın olanı yazar. Klavyede yukarı ve aşağı oklar aynı koldaki serilerden birinden ötekine geçer.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin }, marker = ChartMarker.Square)
    ),
    yAxis = ChartAxis(max = 10.0),
    tooltip = ChartTooltip(shared = false),
    description = "Ada ve Lin'in becerileri",
    tagKey = "apart"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Tasarım", ada = 8, lin = 5, target = 7),
    TeamSkill("Kod", ada = 6, lin = 9, target = 8),
    TeamSkill("Test", ada = 5, lin = 7, target = 7),
    TeamSkill("Yazı", ada = 9, lin = 4, target = 6),
    TeamSkill("Sunum", ada = 7, lin = 6, target = 8),
    TeamSkill("Planlama", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### Dolgunun koyuluğu

Ada'nın ağı daha koyu doldurulmuş (`fillAlpha = 0.5f`), Lin'inki daha açık (`0.08f`): biri öne çıkar, öteki arkada kalır. Lin'in çizgisi yine Ada'nın dolgusunun üstünde.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }, fillAlpha = 0.5f),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin }, fillAlpha = 0.08f)
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "Ada ve Lin'in becerileri",
    tagKey = "fills"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Tasarım", ada = 8, lin = 5, target = 7),
    TeamSkill("Kod", ada = 6, lin = 9, target = 8),
    TeamSkill("Test", ada = 5, lin = 7, target = 7),
    TeamSkill("Yazı", ada = 9, lin = 4, target = 6),
    TeamSkill("Sunum", ada = 7, lin = 6, target = 8),
    TeamSkill("Planlama", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

### Bir değere basmak

`onSelect`, basılan değeri verir: bir kola bas ya da klavyeyle bir kola gidip Enter'a bas, kartın altındaki satır basılanı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

val report = LocalExampleEvents.current
val skills = teamSkills()
PantrixRadarChart(
    series = listOf(RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada })),
    yAxis = ChartAxis(max = 10.0),
    onSelect = { point -> report("${point.label}: ${point.text}") },
    description = "Ada'nın becerileri",
    tagKey = "pressed"
)

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Tasarım", ada = 8, lin = 5, target = 7),
    TeamSkill("Kod", ada = 6, lin = 9, target = 8),
    TeamSkill("Test", ada = 5, lin = 7, target = 7),
    TeamSkill("Yazı", ada = 9, lin = 4, target = 6),
    TeamSkill("Sunum", ada = 7, lin = 6, target = 8),
    TeamSkill("Planlama", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada halkalar, adlar ve iki ağ durur; lejant altlarındadır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.radar.PantrixRadarChart
import com.pantrixui.components.chart.radar.RadarSeries

var file by remember { mutableStateOf<ChartExportFile?>(null) }
val skills = teamSkills()
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.name }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.name }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "Ada ve Lin'in becerileri",
    tagKey = "exported",
    export = ChartExport(fileName = "beceriler") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun teamSkills(): List<TeamSkill> = listOf(
    TeamSkill("Tasarım", ada = 8, lin = 5, target = 7),
    TeamSkill("Kod", ada = 6, lin = 9, target = 8),
    TeamSkill("Test", ada = 5, lin = 7, target = 7),
    TeamSkill("Yazı", ada = 9, lin = 4, target = 6),
    TeamSkill("Sunum", ada = 7, lin = 6, target = 8),
    TeamSkill("Planlama", ada = 4, lin = 8, target = 7)
)

internal class TeamSkill(
    val name: String,
    val ada: Int,
    val lin: Int,
    val target: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixRadarChart

`import com.pantrixui.components.chart.radar.PantrixRadarChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixRadarChart(
    series: List<RadarSeries<*>>,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    grid: RadarGrid = RadarGrid.Polygon,
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

Bir radar grafiği: bir şeyin birkaç ölçüsü bir ortanın çevresindeki kollara dizilir ve bir ağ olarak birleştirilir; böylece biçimi bir bakışta okunur ve iki şey biçimleriyle ayrılır. İki kişinin becerileri, bir ürün ile rakibi, bu yıl ile geçen yıl.

Grafiğe `series` verilir ve her biri kendi satırlarını taşır: bir satırın durduğu kol ve oradaki değeri. Grafik, serilerden herhangi birinin adını verdiği her kolu, ilk adlandırıldıkları sırayla, saat on ikiden başlayıp saat yönünde dizer. Bütün kollar, ortadan dışarı giden tek bir değer ekseniyle okunur: eksen başka söylemedikçe sıfırdan, değerlerin en büyüğünün üstündeki yuvarlak bir sayıya.

Ağların çevresinde, yerleri olan bir grafiğin parçaları durur; her biri onu tarif eden değerle verilir ve `null` ile kaldırılır: iki eksen, serileri listeleyen ve kaydına basılınca bir seriyi grafikten çıkaran `legend` ve gösterilen koldaki değerleri gösteren `tooltip`.

**Bir kolu göstermek.** Grafiğin üstündeki imleç en yakın kolu gösterir; parmak bir dokunuşla gösterir, gösterdiği kola bir dokunuş da onu bırakır. Klavyeyle grafik Tab için tek bir duraktır: oklar grafiğin çevresinde koldan kola gider ve sonuncudan sonra yine ilkine; Home ve End ilkine ve sonuncusuna, Escape bırakır. Tooltip serileri ayırıyorsa yukarı ve aşağı oklar bir serinin değerinden ötekine gider. Kol işaretlenir, tooltip onun için gösterilir ve `state`'e söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra serilerin oradaki değerleriyle her kol, kolların sırasıyla. Lejantın kayıtları birer anahtardır.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir. Modifier'ındaki bir yükseklik grafiğin tamamınındır, lejantınki de içinde; verilmezse grafik stilinin söylediği kadar yüksektir ve üstündeki ya da altındaki bir lejant kendi yüksekliğini ekler. Ağ, kolların adları çevresinde olmak üzere, lejanttan kalan yere sığan en büyüğüdür.

Grafik sağdan okunan bir dilde de aynı yöne döner; lejantı ve tooltip'i okuma yönüne uyar.

```kotlin
PantrixRadarChart(
    series = listOf(
        RadarSeries("ada", "Ada", skills, x = { it.skill }, y = { it.ada }),
        RadarSeries("lin", "Lin", skills, x = { it.skill }, y = { it.lin })
    ),
    yAxis = ChartAxis(max = 10.0),
    description = "Skills of Ada and Lin",
    tagKey = "skills"
)
```

Parametreler:

- `series: List<RadarSeries<*>>`: seriler, çizildikleri ve listelendikleri sırayla: sonraki, öncekinin üstüne çizilir. Anahtarları onları birbirinden ayırır; aynı anahtarlı iki seri reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `xAxis: ChartAxis?`: kollar: adlarının grafiğin çevresine yazılıp yazılmadığı (`labels`), bir adın nasıl yazıldığı (`label`) ve kolların çizilip çizilmediği (`line`). `null` onlardan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin ortasından dışarı: uçları, yaklaşık kaç değer işaretlediği, bir değerin nasıl yazıldığı, işaretli değerlerin yazılıp yazılmadığı (`labels`) ve her birinde bir halka çizilip çizilmediği (`grid`). `startFromZero` ya da `min` başka söylemedikçe sıfırdan başlar. `null` ondan hiçbir şey çizmez.
- `grid: RadarGrid`: bir halkanın koldan kola düz mü, bir ağ gibi, yoksa yuvarlak mı gittiği.
- `legend: ChartLegend?`: serilerin adlarının durduğu yer. `null` hiç göstermez.
- `tooltip: ChartTooltip?`: gösterilen kol için gösterilen. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gizledikleri ve gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik serilerinin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan değerle çağrılır: gösterilen değer, ya da kolun değerleri birlikte gösteriliyorsa basışa en yakın serinin değeri.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi için temanınkiler.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `RadarChart_<tagKey>`, çizim alanı `RadarChart_<tagKey>.Plot`, bir kolu birden sayılarak `RadarChart_<tagKey>.Point_<number>`, bir serinin lejant kaydı `RadarChart_<tagKey>.Legend_<series' key>` ve tooltip `RadarChart_<tagKey>.Tooltip` olur. Bir değere basış, serinin anahtarıyla bir `RadarChart` `select` olayı olarak, bir lejant kaydına basış da anahtarla ve serinin gösterilip gösterilmediğiyle bir `toggle` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur.

### RadarSeries

`import com.pantrixui.components.chart.radar.RadarSeries`, `com.pantrixui:components` içinden

```kotlin
class RadarSeries<T>(
    public val key: String,
    public val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    public val color: Color = Color.Unspecified,
    public val filled: Boolean = true,
    public val marker: ChartMarker = ChartMarker.Circle,
    public val dash: ChartDash? = null,
    public val pattern: ChartPattern? = null,
    public val fillAlpha: Float = 0.2f
)
```

Bir `PantrixRadarChart`'taki bir ağ: okunduğu satırlar, her birinin durduğu kol ve oradaki değeri.

```kotlin
RadarSeries("ada", "Ada", skills, x = { it.skill }, y = { it.ada })
```

`x` bir satırın hangi kolda durduğunu söyler: bir ad, kendine eşit olan herhangi bir şey; grafik onu ekseninin `label`'ıyla, o verilmemişse kendini yazdığı gibi yazar. `y` satırın oradaki değeridir, değeri yoksa null: ağ, ondan önceki değerden sonrakine dümdüz gider. Sayı olmayan ya da sonu olmayan bir değer yok sayılır.

Kuruldukları her şey aynı olan iki seri, iki fonksiyon da dahil, aynı seridir.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar.
- `x: (T) -> Any`: Bir satırın durduğu kol.
- `y: (T) -> Number?`: Bir satırın değeri, yoksa null.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `filled: Boolean`: Ağın renginin bir payıyla mı dolu olduğu, yoksa yalnızca çizgisi mi olduğu.
- `marker: ChartMarker`: Değerlerinin her birini neyin işaretlediği. Biçimler, renklerin tek başına ayıramayacağı serileri ayırır.
- `dash: ChartDash?`: Çizgisinin bütün mü, kesik mi, noktalı mı çizildiği: bir hedefi ölçülenden ayıran şey. Null ise bütün; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki sırasının söylediği gibi.
- `pattern: ChartPattern?`: Doluysa dolgusunun, renginin yanında tarandığı desen. Null ise hiçbiri; grafiğin desenleri açıksa, grafiğin serileri arasındaki sırasındaki desen.
- `fillAlpha: Float`: Ağ doldurulduğunda renginin ne kadarıyla doldurulduğu: sıfırdan bire. Varsayılan beşte birde üst üste binen ağlar birbirinin içinden görünür; daha çoğu bir ağı ötekilerden ayırır. Her dolgu yine her çizginin altında durur.

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

### ChartTooltip

`import com.pantrixui.components.chart.common.ChartTooltip`, `com.pantrixui:components` içinden

```kotlin
class ChartTooltip(
    public val shared: Boolean = true,
    public val crosshair: Boolean = true,
    public val format: ((Double) -> String)? = null,
    public val content: (@Composable (points: List<ChartPoint>) -> Unit)? = null
)
```

Bir grafiğin tooltip'i: gösterilen yerdeki değerler, yerin yanındaki küçük bir kartta.

İmlecin altında, parmağın grafiğe dokunduğu ya da grafik boyunca sürüklendiği yerde ve ok tuşlarının gittiği yerde açılır. İmleç ayrılınca, yere ikinci kez dokununca ve Escape ile kapanır. Grafiğin içinde, yerin yanında, kendisine yer olan yanda durur. İki yanında da yeri olmayacak kadar dar bir grafikte yerin üstünde, çizim alanının o yerin değerlerinin olmadığı ucunda durur. Basış almaz: altındaki, o orada değilmiş gibi basılır.

Yerine `null` verilirse hiç gösterilmez. Gösterilen yer yine işaretlenir ve yine grafiğin durumuna söylenir.

Parametreler:

- `shared: Boolean`: Tooltip'in yerin mi olduğu, her serinin oradaki değeriyle, yoksa imlece en yakın tek serinin mi. Birlikte, bir grafiğin bir yerde nasıl okunduğudur ve parmağın nişan almasını istemez; ayrı ayrı, serileri tek tek okunan bir grafiğe uyar.
- `crosshair: Boolean`: Yerin grafik boyunca işaretlenip işaretlenmediği: içinden geçen bir çizgiyle, çubuğu olan bir grafikte de bandının üstündeki bir gölgeyle.
- `format: ((Double) -> String)?`: Bir değerin tooltip'te ve ekran okuyucuya nasıl yazıldığı, eksenin yazdığı gibi değilse: değer ekseni olmayan bir grafik sayılarının ne olduğunu burada söyler. Verilmezse eksenin `format`'ı yazar, eksenin de yoksa temanın dili.
- `content: (@Composable (points: List<ChartPoint>) -> Unit)?`: Kartın kendi içeriği, başlığın ve satırların yerine: yerdeki değerleri alır, seriler ayrılıyorsa gösterileni. Çevresindeki kart grafiğin kalır.
