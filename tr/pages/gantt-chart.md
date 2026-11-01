# Gantt Chart

Bir planın görevlerini gösteren grafik: her görev bir satırda, başladığı andan bittiği ana uzanan bir çubuk. Neyin ne zaman yürüdüğünü, nelerin üst üste geldiğini ve her görevin ne kadarının bittiğini gösterir.

- `PantrixGanttChart` (`com.pantrixui.components.chart.gantt`, `com.pantrixui:components`): Bir planın görevleri, her biri bir satırda, her biri tek bir zaman ekseni boyunca başladığı andan bittiği ana bir çubuk: ne kadarının bittiği, kilometre taşları, bugünde bir çizgi, gösterilen görev için bir tooltip; her göreve tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: gantt, zaman çizelgesi, takvim planı, proje planı, yol haritası, görevler.

## Özellikler

- **Görevler.** Grafik görevlerini (`GanttTask`) satırlarının sırasıyla alır; her görevin bir anahtarı, bir adı, başladığı ve bittiği an vardır. Anlar `kotlin.time.Instant`'tır: tarih kütüphanesi gerekmez.
- **Zaman.** Zaman, ilk görevin başından son görevin sonuna, grafik boyunca uzanır. Ekseni yuvarlak anlara işaretlenir (gün, hafta, ay), yeri olduğu kadarına, ve her işarette satırların içinden bir çizgi geçer. Anlar cihazın saatiyle okunur ve temanın diliyle yazılır; `time` (`ChartTime`) başka söylemedikçe.
- **İlerleme.** `progress` veren görevin çubuğunun o kadarı tam renkte, gerisi soluk çizilir.
- **Kilometre taşı.** Başladığı anda biten görev bir andır ve bir baklava olarak çizilir.
- **Bugün.** `today` verilirse ve grafiğin zamanının içindeyse, o anda çubukların üstünden bir çizgi geçer ve satırların üstündeki kendi satırına "Bugün" yazılır. Grafiğin kendi saati yoktur: okunduğu anı çağıran verir.
- **Gruplar.** `group` veren görevler grubun kendi satırının altında toplanır: grubun çubuğu ilk görevinin başından son görevinin sonuna uzanır, uçları aşağı sivrilir; görevlerin adları grubunkinden biraz içeride durur. Grubun adı görevlerin tooltip'inde başlık olur ve ekran okuyucu da onu söyler.
- **Satırlar.** Aynı `row`'u veren görevler bir satırı paylaşır, zamanda yan yana, ve satır o adla anılır: bir kişinin işleri kendi satırında. Zamanları çakışan görevler satırın içinde alt alta durur ve satır her biri için bir satır boyu uzar. İmleç satırın içinde üstünde durduğu göreve gider; görevler satırı aralarındaki yarı yoldan paylaşır.
- **Döngü.** Birbirinin ardından gelen görevler bir halka kuramaz: kendisinin ardından gelen bir görevin ardından gelen görev reddedilir.
- **Bağımlılıklar.** `after`, görevin ardından geldiği görevlerin anahtarlarıdır: her birinin bittiği yerden bu görevin başladığı yere dik açıyla dönen bir ok çizilir; görev erken başlıyorsa ok alttan ya da üstten dolanır. Grafikte olmayan bir anahtar ya da görevin kendisi reddedilir.
- **Hafta sonları.** `weekends = true` cumartesileri ve pazarları grafiğin saatine göre soluk boyar; bir gün iki pikselden darsa boyamaz.
- **Adlar.** Görev adları satırların başında bir kolonda durur, grafiğin beşte ikisinden geniş olmayan; sığmayan ad üç noktayla kısaltılır. `names = false` kolonu kaldırır.
- **Gösterilen görev.** İmlecin ya da parmağın satırında durduğu görevin çubuğu halkalanır ve tooltip adını, başladığı ve bittiği anı, bittiyse ne kadarının bittiğini yazar. Klavyede yukarı ve aşağı oklar görevden göreve geçer.
- **Boyut.** Yükseklik verilmezse grafik satırlarının gerektirdiği kadar yüksektir: grup başlıkları da içinde, satır başına otuz iki dp; "Bugün" yazılıyorsa üstüne bir satır daha.
- **Ekran okuyucu.** Önce grafiğin açıklaması, bugün çizgisi varsa "Bugün" ve günü, sonra görevlerin sırasıyla her görev: grubu ve satırı varsa onlar, adı, başı, sonu ve ilerlemesi.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Yakınlaşma.** `zoom` ile zamanın bir kısmı grafiğin genişliğinde gösterilir: tekerlek (Ctrl ya da Command ile), iki parmak, artı ve eksi tuşları ve düğmeler yakınlaşır; sürükleme ve düğmeler zamanda ilerletir.
- **Otomasyon.** Grafik `Gantt_<tagKey>`, bir görev `Gantt_<tagKey>.Task_<numara>` olarak etiketlenir. Bir göreve basış, görevin anahtarıyla bir `select` olayı olarak bildirilir.

## Kullanım

### The plan of a release

```kotlin
PantrixGanttChart(
    tasks = plan.steps.map { step ->
        GanttTask(step.id, step.name, start = step.start, end = step.end, progress = step.done)
    },
    today = now,
    description = stringResource(Res.string.release_plan),
    tagKey = "release"
)
```

### Days of UTC, a milestone, and a task that is pressed

```kotlin
PantrixGanttChart(
    tasks = steps.map { GanttTask(it.id, it.name, it.start, it.end) } +
        GanttTask("launch", stringResource(Res.string.launch), start = launch, end = launch, color = brand.accent),
    time = ChartTime(offset = { Duration.ZERO }),
    onSelect = { task -> openStep(task.series) },
    tagKey = "plan"
)
```

## Örnekler

### Bir sürümün planı

Bir sürümün planı: dört görev ve iki kilometre taşı. Biten görevler tam renkte, sürenlerin bitmiş kısmı tam renkte ve kalanı soluk. Dikey çizgi bugünü gösterir (`today`): solunda kalan geçmiştir.

İmleci bir satırın üstüne getir ya da satıra dokun: çubuk halkalanır ve tooltip görevin başını, sonunu ve ilerlemesini yazar. Günler UTC'nin günleri olduğu için grafik de UTC'ye göre okunuyor (`ChartTime`'ın `offset`'i).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    description = "Bahar sürümünün planı: araştırmadan yayına",
    tagKey = "plain"
)

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Araştırma", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Tasarım", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Geliştirme", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Test", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Sürüm adayı", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Yayın", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Kendi renklerin ve adsız satırlar

Her görev kendi rengini taşıyabilir (`GanttTask`'ın `color` alanı): burada tasarım işleri bir renkte, yazılım işleri öbüründe, kilometre taşları üçüncüsünde. Anahtarı çevir: adların kolonu kalkar (`names = false`) ve çubuklar bütün genişliği alır; adlar tooltip'te ve ekran okuyucuda kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration
import kotlin.time.Instant

var named by remember { mutableStateOf(true) }
val theme = PantrixTheme.colors
val design = setOf("research", "design")
PantrixSwitchButton(
    checked = named,
    onCheckedChange = { named = it },
    label = "Görev adları",
    tagKey = "gantt_names"
)
PantrixGanttChart(
    tasks = RELEASE_PLAN.map { task ->
        val color = when {
            task.start == task.end -> theme.warning.color
            task.key in design -> theme.info.color
            else -> theme.success.color
        }
        GanttTask(task.key, task.name, task.start, task.end, task.progress, color)
    },
    time = ChartTime(offset = { Duration.ZERO }),
    names = named,
    description = "Bahar sürümünün planı, ekiplerin renkleriyle",
    tagKey = "own_colors"
)

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Araştırma", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Tasarım", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Geliştirme", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Test", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Sürüm adayı", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Yayın", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Bir günün saatleri

Bir günün saatleri: bir yayın gününün adımları. Anlar aynı günün içinde olduğu için eksen saatlere işaretlenir ve tooltip başı ve sonu saatiyle yazar. Dar bir ekranda ikinci görevin adı kolonuna sığmaz ve üç noktayla kısalır; tooltip adı tam yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = RELEASE_DAY,
    time = ChartTime(offset = { Duration.ZERO }),
    today = hourAt("11:20"),
    description = "Yayın gününün adımları, saat saat",
    tagKey = "hours"
)

private val RELEASE_DAY = listOf(
    GanttTask("freeze", "Kod dondurma", start = hourAt("08:00"), end = hourAt("09:00"), progress = 1f),
    GanttTask(
        key = "checks",
        name = "Son denetimler, onaylar ve sürüm notları",
        start = hourAt("09:00"),
        end = hourAt("11:30"),
        progress = 0.9f
    ),
    GanttTask("rollout", "Kademeli yayın", start = hourAt("11:30"), end = hourAt("15:00")),
    GanttTask("watch", "İzleme", start = hourAt("11:30"), end = hourAt("18:00")),
    GanttTask("done", "Tamamlandı", start = hourAt("18:00"), end = hourAt("18:00"))
)

private fun hourAt(time: String): Instant = Instant.parse("2026-05-04T$time:00Z")
```

### Bir göreve basmak

Bir basış görevi alır: anahtarı `series`'inde, adı `name`'inde, kaç gün sürdüğü `value`'sunda, grafiğin yazdığı metin `text`'indedir. Bir satıra bas: alttaki satır basılanı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration
import kotlin.time.Instant

var pressed by remember { mutableStateOf<String?>(null) }
val strings = PantrixTheme.strings
PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    onSelect = { pressed = "${it.name}: ${strings.decimal(it.value)} gün" },
    description = "Bahar sürümünün planı",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Bir göreve bas")

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Araştırma", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Tasarım", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Geliştirme", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Test", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Sürüm adayı", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Yayın", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Gruplar ve bağımlılıklar

Görevler ekiplerinin gruplarında (`group`): her grubun kendi satırı ve görevlerini baştan sona özetleyen çubuğu var. Oklar hangi görevin hangisinin ardından geldiğini gösterir (`after`): Geliştirme, Tasarım bitince başlar. Test, Geliştirme bitmeden başladığı için onun oku alttan dolanıyor.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = GROUPED_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    description = "Bahar sürümünün planı, ekiplere göre",
    tagKey = "groups"
)

private val GROUPED_PLAN = listOf(
    GanttTask("research", "Araştırma", dayAt("03-02"), dayAt("03-14"), progress = 1f, group = "Ürün"),
    GanttTask(
        key = "design",
        name = "Tasarım",
        start = dayAt("03-16"),
        end = dayAt("03-28"),
        progress = 1f,
        after = listOf("research"),
        group = "Ürün"
    ),
    GanttTask(
        key = "build",
        name = "Geliştirme",
        start = dayAt("03-30"),
        end = dayAt("04-25"),
        progress = 0.55f,
        after = listOf("design"),
        group = "Yazılım"
    ),
    GanttTask(
        key = "test",
        name = "Test",
        start = dayAt("04-13"),
        end = dayAt("05-02"),
        progress = 0.1f,
        after = listOf("build"),
        group = "Yazılım"
    ),
    GanttTask("release", "Yayın", dayAt("05-04"), dayAt("05-04"), after = listOf("test"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Kişilerin satırları ve hafta sonları

Kişilerin satırları (`row`): her kişinin görevleri kendi satırında, yan yana. Ada'nın acil düzeltmesi profille aynı günlere düştüğü için satırında onun altında durur. Hafta sonları soluk (`weekends`). İmleci bir satırda gezdir: üstünde durduğun görev gösterilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

PantrixGanttChart(
    tasks = SPRINT,
    time = ChartTime(offset = { Duration.ZERO }),
    description = "İki haftalık sprintte kim ne yapıyor",
    tagKey = "rows",
    weekends = true
)

private val SPRINT = listOf(
    GanttTask("login", "Giriş ekranı", dayAt("03-02"), dayAt("03-05"), progress = 1f, row = "Ada"),
    GanttTask("profile", "Profil", dayAt("03-05"), dayAt("03-11"), progress = 0.5f, row = "Ada"),
    GanttTask("hotfix", "Acil düzeltme", dayAt("03-06"), dayAt("03-10"), progress = 0.3f, row = "Ada"),
    GanttTask("api", "API", dayAt("03-02"), dayAt("03-07"), progress = 1f, row = "Lin"),
    GanttTask("sync", "Eşitleme", dayAt("03-09"), dayAt("03-14"), after = listOf("api"), row = "Lin"),
    GanttTask("review", "Gözden geçirme", dayAt("03-11"), dayAt("03-14"), after = listOf("profile"), row = "Can"),
    GanttTask("demo", "Demo", dayAt("03-16"), dayAt("03-16"), after = listOf("review", "sync"), row = "Can")
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada satırlar, çubuklar, zamanın işaretleri ve bugünün çizgisi ile adı durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    description = "Bahar sürümünün planı: araştırmadan yayına",
    tagKey = "exported",
    export = ChartExport(fileName = "bahar-surumu") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Araştırma", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Tasarım", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Geliştirme", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Test", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Sürüm adayı", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Yayın", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

### Zamanda yakınlaşma

`zoom = ChartZoom()` zamana yakından bakmayı sağlar: Ctrl ya da Command ile tekerlek, iki parmak, grafikteyken artı ve eksi, ve grafiğin üstündeki düğmeler zamanın bir kısmını grafiğin genişliğinde gösterir. Fareyle sürükleme ve düğmeler zamanda ilerletir; oklarla gidilen görev görünüre gelir.

Görünen kısmın dışı zamanın iki ucunda kesilir, adlar yerinde kalır. Kısım durumdadır (`state.window`): bu grafik planın ilk yarısını göstererek açılır, sıfır tuşu ya da son düğme hepsini yeniden gösterir.

```kotlin
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.chart.gantt.GanttTask
import com.pantrixui.components.chart.gantt.PantrixGanttChart
import kotlin.time.Duration
import kotlin.time.Instant

val state = rememberChartState()
// Grafik planın ilk yarısını göstererek açılır.
LaunchedEffect(state) { state.zoomTo(start = 0f, end = 0.5f) }
PantrixGanttChart(
    tasks = RELEASE_PLAN,
    time = ChartTime(offset = { Duration.ZERO }),
    today = dayAt("04-14"),
    state = state,
    description = "Bahar sürümünün planı: araştırmadan yayına",
    tagKey = "zoomed",
    zoom = ChartZoom()
)

private val RELEASE_PLAN = listOf(
    GanttTask("research", "Araştırma", start = dayAt("03-02"), end = dayAt("03-14"), progress = 1f),
    GanttTask("design", "Tasarım", start = dayAt("03-09"), end = dayAt("03-28"), progress = 1f),
    GanttTask("build", "Geliştirme", start = dayAt("03-23"), end = dayAt("04-25"), progress = 0.55f),
    GanttTask("test", "Test", start = dayAt("04-13"), end = dayAt("05-02"), progress = 0.1f),
    GanttTask("candidate", "Sürüm adayı", start = dayAt("04-27"), end = dayAt("04-27")),
    GanttTask("release", "Yayın", start = dayAt("05-04"), end = dayAt("05-04"))
)

private fun dayAt(day: String): Instant = Instant.parse("2026-${day}T00:00:00Z")
```

## API

### PantrixGanttChart

`import com.pantrixui.components.chart.gantt.PantrixGanttChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixGanttChart(
    tasks: List<GanttTask>,
    modifier: Modifier = Modifier,
    time: ChartTime? = null,
    today: Instant? = null,
    names: Boolean = true,
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    weekends: Boolean = false,
    export: ChartExport? = null,
    zoom: ChartZoom? = null
)
```

Bir Gantt grafiği: bir planın görevleri, her biri bir satırda, her biri tek bir zaman ekseni boyunca başladığı andan bittiği ana uzanan bir çubuk. Neyin ne zaman yürüdüğünü, nelerin üst üste geldiğini ve her görevin nereye vardığını gösterir.

Grafik `tasks`'ini satırlarının sırasıyla alır. Zaman, ilk görevin başından son görevin sonuna, grafik boyunca uzanır; ekseni yuvarlak anlara işaretlenir, günlere, haftalara, aylara, yeri olduğu kadarına, ve her işarette satırların içinden bir çizgi geçer. Görevlerin adları satırların başladığı yanda, grafiğin beşte ikisinden geniş olmayan bir kolonda durur; kolona uzun gelen ad kısaltılır, tooltip ve ekran okuyucu onu tam taşır.

Ne kadarının bittiğini söyleyen görevin çubuğunun o kadarı tam renkte, gerisi soluktur. Başladığı anda biten görev bir kilometre taşıdır: anında duran bir baklava. `today` verildiğinde ve grafiğin zamanının içinde olduğunda, o anda çubukların üstünden bir çizgi geçer, solunda kalan geçmiştir, ve üstüne, satırların üstündeki kendi satırına bugünün adı yazılır.

**Gruplar, satırlar ve neyin neyin ardından geldiği.** Bir `group` adı veren görevler grubun kendi satırının altında birlikte durur; o satırın çubuğu en erkeninden en geçine uzanır, her ucunda aşağı doğru bir sivrilikle; görevlerin adları grubunkinden bir boşluk içeride durur. Bir `row` adı veren görevler o satırı paylaşır, zamanında yan yana, ve satır o adla anılır: bir kişinin görevleri kendi şeridinde; zamanları çakışanlar alt alta durur. `after`'da başka görevlerin adını veren görev onların ardından gelir: her birinin bittiği yerden onun başladığı yere, dik açıyla dönen bir ok çizilir; çok erken başlıyorsa ok altından ya da üstünden dolanır. `weekends` ile cumartesiler ve pazarlar her şeyin altında soluk boyanır, bir gün görünecek kadar genişse.

Anlar ekranın saatiyle (`LocalPantrixClock`) okunur ve temanın diliyle yazılır; `time` başka söylemedikçe: bkz. `ChartTime`. Grafiğin kendi saati yoktur: okunduğu anı vermek çağıranın işidir.

**Bir görevi göstermek.** Bir görevin satırının üstündeki imleç onu gösterir, satırın ad kısmında da; parmak bir dokunuşla gösterir, gösterdiği göreve bir dokunuş daha onu bırakır. Klavyede grafik Tab için tek duraktır: yukarı ve aşağı oklar görevden göreve gider, Home ve End ilkine ve sonuncusuna, Escape bırakır. Görevin çubuğu halkalanır, tooltip onun için gösterilir ve `state`'e, `x`'i görevin anahtarı olan bir seçim olarak bildirilir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucuya** grafik önce `description`'ıdır, `today`'deki çizgi çiziliyorsa bugünün adı ve günü; sonra görevlerin sırasıyla her görev: varsa grubu ve satırı, adı, ne zaman başlayıp bittiği ve ne kadarının bittiği.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir ve modifier'ının söylediği kadar yüksektir; yükseklik verilmediyse satırlarının gerektirdiği kadar yüksektir: grup başlıkları da içinde şerit başına otuz iki dp, altlarında zaman işaretleri için bir satır yazı, bugünün adı yazılıyorsa üstlerinde onun için bir satır daha.

```kotlin
PantrixGanttChart(
    tasks = listOf(
        GanttTask("design", "Design", start = monday, end = monday + 5.days, progress = 1f),
        GanttTask("build", "Build", start = monday + 5.days, end = monday + 19.days, progress = 0.4f),
        GanttTask("launch", "Launch", start = monday + 21.days, end = monday + 21.days)
    ),
    today = now,
    description = "The plan of the spring release",
    tagKey = "release"
)
```

Parametreler:

- `tasks: List<GanttTask>`: görevler, satırlarının sırasıyla. Anahtarları onları ayırır; aynı anahtarı taşıyan iki görev reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir.
- `time: ChartTime?`: grafiğin anlarının nasıl yazıldığı ve hangi saate göre okunduğu. Verilmezse temanın diliyle ve ekranın saatiyle (`LocalPantrixClock`).
- `today: Instant?`: grafiğin okunduğu an: ilk görevin başıyla son görevin sonu arasındaysa orada bir çizgi çizilir. `null` hiç çizmez.
- `names: Boolean`: görevlerin adlarının satırlarının yanına yazılıp yazılmadığı. Adlar olmadan çubuklar bütün genişliği alır; adlar tooltip'te ve ekran okuyucuda kalır.
- `tooltip: ChartTooltip?`: gösterilen görev için gösterilen şey: varsa grubu ve satırı başlık olarak, altında adı, ne zaman başlayıp bittiği ve ne kadarının bittiği. Bir görevin paylaşılacak bir yeri ve içinden geçen bir çizgisi yoktur: `shared`, `crosshair` ve `format` okunmaz. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik görevlerinin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan görevle çağrılır: anahtarı `series`'i ve `x`'idir, adı `name`'i ve `label`'ı, `value`'su kaç gün sürdüğü, `text`'i de grafiğin yazdığı biçimiyle ne zaman başlayıp bittiği.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi temanınkiyle. Bir çubuğun köşeleri `barRadius`'un söylediği kadar yuvarlaktır, zaman işaretlerindeki çizgiler de `gridWidth` kadar geniş.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `Gantt_<tagKey>`, satırları birlikte `Gantt_<tagKey>.Plot`, bir görev birden sayılarak `Gantt_<tagKey>.Task_<numara>`, tooltip de `Gantt_<tagKey>.Tooltip`'tir. Bir göreve basış, görevin anahtarıyla bir `Gantt` `select` olayı olarak bildirilir. Anlarından hiçbir şey bildirilmez.
- `weekends: Boolean`: grafiğin zamanındaki cumartesilerin ve pazarların, grafiğin saatine göre, boyanıp boyanmayacağı. Bir gün iki pikselden darsa hiçbiri boyanmaz.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur.
- `zoom: ChartZoom?`: grafiğin zamanının bir kısmına, eksenli bir grafiğin yerlerine bakıldığı gibi yakından bakmayı sağlayan şey (bkz. `ChartZoom`): Ctrl ya da Command ile tekerlek, iki parmak, grafikteyken artı ve eksi, ve düğmeleri zamanın bir kısmını grafiğin genişliğinde gösterir; fareyle sürükleme ve düğmeler zamanda ilerletir, oklar gittikleri görevi görünüre getirir. Görünen kısmın dışı zamanın iki ucunda kesilir; adlar kalır. Kısım `state`'te, `window` olarak tutulur. Gantt grafiğinin gezgin şeridi yoktur: `navigator` ve `fitValues` okunmaz. `null`, grafik bütün zamanını gösterir.

### GanttTask

`import com.pantrixui.components.chart.gantt.GanttTask`, `com.pantrixui:components` içinden

```kotlin
class GanttTask(
    public val key: String,
    public val name: String,
    public val start: Instant,
    public val end: Instant,
    public val progress: Float? = null,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null,
    public val after: List<String> = emptyList(),
    public val group: String? = null,
    public val row: String? = null
)
```

Bir `PantrixGanttChart`'ın bir görevi: bir andan bir ana süren bir şey, ve ne kadarının bittiği.

```kotlin
GanttTask("design", "Design", start = kickoff, end = kickoff + 14.days, progress = 0.6f)
```

Parametreler:

- `key: String`: Görevi grafiğinin ötekilerinden ayıran ve anları değişirken aynı kalan şey: bir seçimin adını verdiği, bir olayın bildirdiği. Bir test etiketinin anahtarı gibi yazılır, küçük harfler ve rakamlarla.
- `name: String`: Görevin adı: satırının yanında, tooltip'te ve ekran okuyucuda.
- `start: Instant`: Görevin başladığı an.
- `end: Instant`: Bittiği an: son gününün tamamını alan bir görev için, o günden sonraki gece yarısı. Başladığı anda biten görev bir andır, bir kilometre taşıdır ve bir baklava olarak çizilir. Başlamadan önce biten görev tersinden alınır.
- `progress: Float?`: Görevin ne kadarının bittiği, sıfırdan bire: çubuğunun o kadarı, başladığı yerden, tam renkte ve gerisi soluk çizilir. Verilmezse çubuğun tamamı tam renktedir ve görevin nereye vardığı söylenmez.
- `color: Color`: Görevin çizildiği renk. Verilmezse grafiğin renklerinin ilkidir: bir grafiğin görevleri tek bir seridir, ve bir görevi ya da bir grubunu ötekilerden ayıran kendi rengidir.
- `pattern: ChartPattern?`: İşin renginin yanında çizildiği desen. Verilmezse hiçbiri; grafiğin desenleri açıksa (`ChartStyle.patterns`), renginin, grafiğin işlerinin renkleri arasında ilk görüldükleri sıradaki sırası: bir renkle ayrılan bir grup bir desenle de ayrılır, ilk rengin deseni yoktur.
- `after: List<String>`: Bu görevin ardından geldiği görevlerin anahtarları: her birinden, bittiği yerden bu görevin başladığı yere bir ok çizilir. Grafiğin görevi olmayan bir anahtar ya da görevin kendi anahtarı reddedilir; birbirinin ardından halka olup dönen görevler de: kendi ardından gelen bir görevin ardından gelen görev.
- `group: String?`: Görevin içinde durduğu grubun adı. Aynı grubun adını veren görevler, ilkinin yerinde, grubun kendi satırının altında birlikte durur; o satırda en erkeninin başından en geçinin sonuna bir çubuk vardır. Null ise görev hiçbir grupta değildir.
- `row: String?`: Görevin durduğu satırın adı. Aynı satırın adını veren görevler onu paylaşır, zamanında yan yana, ve satır o adla anılır: bir kişinin görevleri kendi satırında. Zamanları çakışanlar onun içinde alt alta durur ve satır her biri için bir satır boyu uzar. Null ise görevin kendi satırı vardır ve görevin adıyla anılır.

### ChartTime

`import com.pantrixui.components.chart.cartesian.ChartTime`, `com.pantrixui:components` içinden

```kotlin
class ChartTime(
    public val format: ((Instant, ChartTimeUnit) -> String)? = null,
    public val offset: ((Instant) -> Duration)? = null,
    public val gapless: Boolean = false
)
```

Yerleri an olan bir grafiğin onları nasıl yazdığı ve hangi saate göre okuduğu: yerlerin eksenine `time`'ı olarak verilen şey.

Bir grafiğin yerleri, her biri bir `kotlin.time.Instant` olduğunda andır. Böyle bir grafik yerlerini anlarının olduğu yere dizer, satırlarının sırası ne olursa olsun zaman sırasıyla: iki gün arayla duranlar, bir gün arayla duranların iki katı uzaktır, ve satırı olmayan gün bir boşluktur. Ekseni yuvarlak anlara işaretlenir, her saate, her güne, her aya, yeri olduğu kadarına, ve her işaret neyle sayılıyorsa onunla yazılır.

```kotlin
PantrixLineChart(
    data = readings,
    x = { it.at },
    series = listOf(ChartValue("temperature", "Temperature") { it.degrees }),
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO }))
)
```

Hiçbir şey verilmek zorunda değildir: verilmezse anlar temanın diliyle yazılır ve ekranın saatiyle (`LocalPantrixClock`) okunur; bir test ya da önizleme başkasını vermedikçe cihazınkiyle.

Bir borsa bazı günler açık, bazı günler kapalıdır ve fiyatlarının grafiğinde kapalı olduğu yerler boşluk olur. `gapless` olan yerler bunun yerine eşit aralıklarla, adlar gibi zaman sırasıyla art arda durur; eksen de her yuvarlak zaman diliminin, her günün, her haftanın, her ayın ilk yerine, yeri olduğu kadar işaretlenir.

Parametreler:

- `format: ((Instant, ChartTimeUnit) -> String)?`: Bir anın nasıl yazıldığı, anın kendisi ve neye kadar yazıldığıyla: eksenin bir işareti, işaretlerin arasındaki birime kadar; bir yer de, tooltip'te ve ekran okuyucuda, grafiğin yerlerini birbirinden ayıran en ince birime kadar. Verilmezse bir işaret kısa yazılır, bir saat `14:00`, bir gün `13 Eki`, bir ay adıyla ve bir ocak yılıyla; bir yer de tam yazılır, `13 Eki 2026 14:00`; hepsi temanın diliyle. Bir yerin nasıl yazıldığı için önce eksenin `label`'ına sorulur.
- `offset: ((Instant) -> Duration)?`: Grafiğin okunduğu saatin bir anda UTC'den ne kadar ileride olduğu: bir anın hangi güne ait olduğunu ve bir günün nerede başladığını söyleyen şey. Verilmezse ekranın saatidir (`LocalPantrixClock`), bir test ya da önizleme başkasını vermedikçe cihazınki. Satırları UTC günleri olan veri için `{ Duration.ZERO }`'dur; bir saat dilimi kütüphanesi olan uygulama, gösterdiği dilimi ona sorar.
- `gapless: Boolean`: Yerlerin, satırların bir şey taşımadığı aradaki zaman için boşluk bırakmadan eşit aralıklarla durup durmadığı: bir borsanın kapalı olduğu günler. Grafiğin iki yer arasındaki bir andaki işareti aralarında, zamanda her birine ne kadar uzaksa o kadar uzakta durur; ilk yerden önceki ya da son yerden sonraki işaret çizilmez.
