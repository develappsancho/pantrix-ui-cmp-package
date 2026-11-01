# Status Tracker

Bir dizi adım, bir sıra blok olarak: her blok, o adımda olanın renginde. Bir hizmetin ayakta olduğu günler, geçen derlemeler: kötü olanların nerede olduğu bir bakışta görülür, hangileri olduğu üstlerine gelince okunur.

Her `StatusBlock` bir ad ve bir renktir. Bloklar satırın başından yan yana dizilir ve her biri genişlikten eşit pay alır. Rengi verilmeyen blok grafiğin kılavuz renginde çizilir: hakkında bir şey bilinmeyen adım.

- `PantrixStatusTracker` (`com.pantrixui.components.chart.statustracker`, `com.pantrixui:components`): Bir adımlar dizisi renkli bloklardan bir satır olarak; gösterilen bloğun adı altında yazar; tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: çalışma süresi, durum çubuğu, sağlık geçmişi, zaman çizgisi blokları, olay geçmişi.

## Özellikler

- **Gösterilen blok.** İmlecin altındaki ya da dokunulan bloğun adı, renginin yanında, sıranın altına yazılır; ötekiler soluk çizilir. Parmakla, gösterilen bloğa yeniden dokunmak onu bırakır.
- **Alttaki satır.** `caption` kapatılırsa ad yazılmaz. Satırın yeri, bir blok gösterilse de gösterilmese de tutulur: sıra yerinden oynamaz.
- **Klavye.** Sıra, Tab için tek duraktır: oklar bloktan bloğa gider ve uçlarda durur, Home ve End ilk ve son bloğa gider, Escape bırakır, Enter ve boşluk gösterilen bloğa basar.
- **Basmak.** `onSelect`, basılan bloğun sıfırdan sayılan yerini verir.
- **Durum.** Gösterilen blok `ChartState`'te, `x`'i bloğun yeri olan bir seçim olarak durur.
- **Ekran okuyucu.** Sıra `description`'ını, ardından her bloğu adıyla söyler. İki yüzden çok bloğu olan sıra yalnızca açıklamasıyla anlatılır.
- **Yön.** Sağdan sola okunan dilde ilk blok sağda durur ve oklar gösterdikleri yöne gider.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `StatusTracker_<tagKey>`; sıra `.Blocks`, bloklar `.Block_<sıra>`, alttaki satır `.Caption`.

## Kullanım

### The days a service was up

```kotlin
PantrixStatusTracker(
    blocks = days.map { StatusBlock(it.summary, colorOf(it.status)) },
    description = stringResource(Res.string.uptime_last_thirty_days),
    tagKey = "uptime"
)
```

### Opening a step when its block is pressed

```kotlin
PantrixStatusTracker(
    blocks = builds.map { StatusBlock(it.title, colorOf(it.result)) },
    caption = false,
    onSelect = { openBuild(builds[it]) },
    tagKey = "builds"
)
```

## Örnekler

### Bir hizmetin günleri

Bir hizmetin son otuz günü: yeşil günlerde ayakta, sarı günlerde yavaş, kırmızı günde kesik; gri günün kaydı yok.

İmleci bir bloğun üstüne getir ya da bloğa dokun: günün adı sıranın altına yazılır ve öteki günler solar. Klavyede oklar günden güne gider.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

PantrixStatusTracker(
    blocks = uptimeDays(),
    description = "Son otuz günün durumu",
    tagKey = "plain"
)

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "${index + 1}. gün"
        when (index) {
            7, 21 -> StatusBlock("$day: Yavaş", colors.warning.color)
            13 -> StatusBlock("$day: Kesinti", colors.danger.color)
            26 -> StatusBlock("$day: Kayıt yok")
            else -> StatusBlock("$day: Sorunsuz", colors.success.color)
        }
    }
}
```

### Bir bloğa basmak

`onSelect`, basılan bloğun yerini verir: bir güne bas ya da klavyeyle bir güne gidip Enter'a bas, kartın altındaki satır basılanı yazar. Burada alttaki ad satırı kapalı (`caption = false`).

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val days = uptimeDays()
PantrixStatusTracker(
    blocks = days,
    caption = false,
    description = "Son otuz günün durumu",
    onSelect = { report(days[it].name) },
    tagKey = "pressed"
)

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "${index + 1}. gün"
        when (index) {
            7, 21 -> StatusBlock("$day: Yavaş", colors.warning.color)
            13 -> StatusBlock("$day: Kesinti", colors.danger.color)
            26 -> StatusBlock("$day: Kayıt yok")
            else -> StatusBlock("$day: Sorunsuz", colors.success.color)
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kendi ölçülerin

Bir sıranın kendi ölçüleri: bloklar daha yüksek (`trackerHeight`), araları daha açık (`barGap`) ve köşeleri keskin (`barRadius`). Verilmeyen alan temanınki kalır.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

PantrixStatusTracker(
    blocks = uptimeDays().take(14),
    description = "Son iki haftanın durumu",
    style = ChartStyle(trackerHeight = 48.dp, barGap = 6.dp, barRadius = 0.dp),
    tagKey = "own_look"
)

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "${index + 1}. gün"
        when (index) {
            7, 21 -> StatusBlock("$day: Yavaş", colors.warning.color)
            13 -> StatusBlock("$day: Kesinti", colors.danger.color)
            26 -> StatusBlock("$day: Kayıt yok")
            else -> StatusBlock("$day: Sorunsuz", colors.success.color)
        }
    }
}
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada blokların satırı durur; altındaki, gösterilen bloğun adını yazan satır dosyada yoktur.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.statustracker.PantrixStatusTracker
import com.pantrixui.components.chart.statustracker.StatusBlock
import com.pantrixui.foundation.theme.PantrixTheme

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixStatusTracker(
    blocks = uptimeDays(),
    description = "Son otuz günün durumu",
    tagKey = "exported",
    export = ChartExport(fileName = "son-otuz-gun") { file = it }
)
ExportedFile(file, tagKey = "exported")

@Composable
private fun uptimeDays(): List<StatusBlock> {
    val colors = PantrixTheme.colors
    return List(30) { index ->
        val day = "${index + 1}. gün"
        when (index) {
            7, 21 -> StatusBlock("$day: Yavaş", colors.warning.color)
            13 -> StatusBlock("$day: Kesinti", colors.danger.color)
            26 -> StatusBlock("$day: Kayıt yok")
            else -> StatusBlock("$day: Sorunsuz", colors.success.color)
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixStatusTracker

`import com.pantrixui.components.chart.statustracker.PantrixStatusTracker`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixStatusTracker(
    blocks: List<StatusBlock>,
    modifier: Modifier = Modifier,
    caption: Boolean = true,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((Int) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

Bir durum izleyici: bir dizi adım, bir sıra blok olarak; her blok, o adımda olanın renginde. Bir hizmetin ayakta olduğu günler, geçen derlemeler: kötü olanların nerede olduğu bir bakışta görülür, hangileri olduğu gösterilerek okunur.

`blocks` satırın başından yan yana durur; her biri sıranın genişliğinden eşit pay alır. Gösterilen bloğun adı, `caption` başka söylemedikçe, renginin bir örneğinin yanında sıranın altına yazılır; bir blok gösterilirken ötekiler soluk çizilir.

**Bir bloğu göstermek.** Bir bloğun üstündeki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği bloğa bir dokunuş da onu bırakır. Klavyeyle sıra Tab için tek bir duraktır: oklar bloktan bloğa gider, Home ve End ilkine ve sonuncusuna, Escape bırakır. Blok, `x`'i sıfırdan sayılan yeri olan bir seçim olarak `state`'e söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** sıra `description`'ıdır, sonra adıyla her blok, blokların sırasıyla. İki yüzden çok bloğu olan bir sıra yalnızca açıklamasıyla anlatılır.

Sağdan okunan bir dilde ilk blok sağda durur ve oklar gösterdikleri yöne gider.

```kotlin
PantrixStatusTracker(
    blocks = days.map { StatusBlock("${it.date}: ${it.status}", colorOf(it.status)) },
    description = "Uptime, last thirty days",
    tagKey = "uptime"
)
```

Parametreler:

- `blocks: List<StatusBlock>`: bloklar, okundukları sırayla.
- `modifier: Modifier`: izleyicinin modifier'ı.
- `caption: Boolean`: gösterilen bloğun adının sıranın altına yazılıp yazılmadığı. Satırın yeri, bir blok gösterilse de gösterilmese de tutulur; böylece sıra yerinden oynamaz.
- `state: ChartState`: okuyucunun gösterdiği: verilmezse izleyicinin kendisininki.
- `description: String?`: sıranın ne gösterdiği, birkaç sözcükle, ekran okuyucu için.
- `onSelect: ((Int) -> Unit)?`: basılan bloğun sıfırdan sayılan yeriyle çağrılır.
- `style: ChartStyle?`: bu izleyicinin kendi geometrisi: burada verilen alanlar, gerisi temanınkiyle.
- `colors: ChartColors?`: bu izleyicinin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: izleyicinin otomasyon anahtarı: izleyici `StatusTracker_<tagKey>`, sırası `StatusTracker_<tagKey>.Blocks`, bir blok, birden sayılarak, `StatusTracker_<tagKey>.Block_<number>` ve sıranın altındaki satır `StatusTracker_<tagKey>.Caption` olur. Bir bloğa basış, bloğun numarasıyla bir `StatusTracker` `select` olayı olarak bildirilir. Adlardan hiçbir şey bildirilmez.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur. Blokların altındaki yazı satırı dosyada yoktur.

### StatusBlock

`import com.pantrixui.components.chart.statustracker.StatusBlock`, `com.pantrixui:components` içinden

```kotlin
class StatusBlock(
    public val name: String,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixStatusTracker`'ın bir bloğu: bir dizinin bir adımında ne olduğu, bir renk ve birkaç sözcük olarak.

```kotlin
StatusBlock("12 October: operational", color = PantrixTheme.colors.success.color)
```

Adları ve renkleri aynı olan iki blok aynı bloktur.

Parametreler:

- `name: String`: Bloğun neyi gösterdiği, sözcüklerle: adımı ve o adımda ne olduğu. Blok gösterilirken sıranın altına yazılır ve ekran okuyucuya söylenir.
- `color: Color`: Bloğun rengi. Verilmezse blok bir grafiğin kılavuz çizgilerinin rengindedir: hakkında hiçbir şey bilinmeyen bir adım.
- `pattern: ChartPattern?`: Bloğun renginin yanında çizildiği desen. Verilmezse hiçbiri; izleyicinin desenleri açıksa (`ChartStyle.patterns`), renginin, satırın renkleri arasında ilk görüldükleri sıradaki sırası: bir durum tek bir renk olduğu gibi tek bir desendir, ilk durumun deseni yoktur.

### ChartState

`import com.pantrixui.components.chart.common.ChartState`, `com.pantrixui:components` içinden

```kotlin
class ChartState(hidden: Set<String> = emptySet())
```

Bir okuyucunun bir grafiğe yaptığı: lejantından gözden çıkardığı seriler ve imlecin, parmağın ya da tuşların üstünde olduğu yer.

Bir grafik kendisi için bir tane tutar. İkisinden birini bilmek ya da söylemek isteyen bir ekran, kendisininkini `rememberChartState` ile kurar ve grafiğe verir. Aynı durumu alan iki grafik okuyucusu için tektir: birinde gizlenen seri ötekinde de gizlidir ve birinde gösterilen yer, ikisinde de varsa, ikisinde de işaretlenir.

`zoom` verilen eksenli bir grafik, yerlerinin görünen kısmını da burada, `window` olarak tutar: aynı durumu alan böyle iki grafiğe birlikte yakından bakılır. Bir Gantt grafiği zamanının görünen kısmını orada, bir scatter grafik değerlerinin yataydaki kısmını `window`'da, dikeydeki kısmını `valueWindow`'da tutar.

Bir pasta için dilimleri, eksenli bir grafik için serileri neyse odur: bir dilim anahtarıyla gözden çıkarılır ve gösterilen dilim, `x`'i o anahtar olan seçimdir.

Bir saçılım grafiğinde gösterilen nokta, `series`'i serisinin anahtarı, `x`'i de o serinin satırları arasındaki sıfırdan sayılan yeri olan seçimdir.

Parametreler:

- `hidden: Set<String>`: baştan gözden çıkarılmış serilerin anahtarları.

Üyeleri:

- `hidden: Set<String>`: Çizilmeyen serilerin anahtarları: lejantın kayıtlarının açıp kapadığı şey.
- `selection: ChartSelection?`: Gösterilen ve tooltip'in onun için açıldığı yer: hiçbiri gösterilmezken null. Grafiğin üstündeki imleç, üstündeki parmak ve ok tuşları onu verir; ayrılan bir imleç ve Escape onu boşaltır.
- `window: ClosedFloatingPointRange<Float>`: Grafiğin yerlerinin görünen kısmı, yerler boyunca bir paydan ötekine: grafiğe yakından bakılmadıkça `0f..1f`, yani hepsi. `zoom` verilen eksenli bir grafik onu okuyucusuna değiştirtir; ekran `zoomTo` ve `resetZoom` ile değiştirir.
- `zoomed: Boolean`: Grafiğin yerlerinin ya da değerlerinin hepsinin değil, bir kısmının görünüp görünmediği.
- `fun toggle(series: String)`: Anahtarı `series` olan seriyi çiziliyorsa gözden çıkarır, çizilmiyorsa geri getirir.
- `fun zoomTo(start: Float, end: Float)`: Yerlerin `start`'tan `end`'e kadar olan kısmını görünüme getirir; ikisi de yerler boyunca sıfırdan bire birer paydır: `zoomTo(0.5f, 1f)` sonraki yarıyı gösterir. İkisi sıraya konur ve bütünün içinde tutulur; bütünün binde birinden dar bir kısım o kadara genişletilir.
- `fun resetZoom()`: Bütün yerleri ve bütün değerleri yeniden gösterir.
- `valueWindow: ClosedFloatingPointRange<Float>`: Grafiğin değerlerinin dikeyde görünen kısmı, değerlerin bir payından ötekine: grafiğe yakından bakılmadıkça `0f..1f`, hepsi. Değerlerine dikeyde yakından bakan yalnızca `zoom` verilen scatter grafiktir; ekran kısmı `zoomValuesTo` ve `resetZoom` ile değiştirir.
- `fun zoomValuesTo(start: Float, end: Float)`: Değerlerin dikeyde `start`'tan `end`'e kadarki kısmını görünüre getirir; ikisi de değerlerin sıfırdan bire bir payıdır: `zoomValuesTo(0f, 0.5f)` alt yarıyı gösterir. İkisi `zoomTo`'nun ikisi gibi alınır.
