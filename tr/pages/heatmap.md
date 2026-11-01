# Heatmap

Hücrelerden bir ızgara: her hücre, değerinin ne kadar olduğunu söyleyen bir tonda. İki adı ve bir sayısı olan şeye yakışır: haftanın günlerinin saatleri, birkaç yılın ayları, bir listenin ötekiyle karşılaştırılması. Neyin çok, neyin az olduğu bir bakışta görülür; aynı sayıların tablosunu ise okumak gerekir.

Grafiğe verisi ve bir veriyi okumanın üç yolu verilir: durduğu kolon (`x`), satırı (`y`) ve değeri (`value`). Kolonlar ve satırlar verinin adlandırdıklarıdır, ilk adlandırıldıkları sırayla. Değeri olmayan veri hücre doldurmaz; hiçbir verinin doldurmadığı hücre soluk çizilir.

- `PantrixHeatmap` (`com.pantrixui.components.chart.heatmap`, `com.pantrixui:components`): Değerleriyle gölgelenen hücrelerden bir ızgara: sütunlarının ve satırlarının adları, bir gölge ölçeği, gösterilen hücre için bir tooltip; her hücreye tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: ısı haritası, matris, korelasyon matrisi, ızgara grafik, yoğunluk.

## Özellikler

- **Ölçek.** `HeatmapScale` bir değerin tona nasıl çevrileceğini söyler: iki ucu (`min`, `max`; verilmezse değerlerin en küçüğü ve en büyüğü), kaç tonu olduğu (`steps`; sıfırsa her değerin kendi tonu) ve rengi (`color`). Tek renkte ton, rengin grafiğin durduğu zeminin üstündeki payıdır: açık temada da koyu temada da okunur. `low` verilirse ölçek en küçüğün rengi `low`'dan `color`'a gider; aradaki tonlar iki rengin Oklab'da karışımıdır, her adım bir öncekiyle aynı ölçüde değişir.
- **Hücredeki değer.** `labels` ile her hücreye değeri yazılır, tonunun üstünde daha iyi okunan siyah ya da beyazla; sığmadığı hücrede yazılmaz.
- **Ölçek çubuğu.** `legend`, ton ölçeğinin nerede duracağını söyler: uçlarında en küçük ve en büyük değer yazar.
- **Adlar.** `xAxis` kolonların, `yAxis` satırların adlarıdır: yazılsın mı (`labels`), nasıl yazılsın (`label`). Sığmayan ad bir kuralla atlanır.
- **Gösterilen hücre.** İmlecin altındaki ya da dokunulan hücre çerçevelenir ve tooltip kolonunu, satırını ve değerini yazar.
- **Klavye.** Grafik, Tab için tek duraktır: oklar hücreden hücreye gider, boş hücreleri atlar; Home ve End ilk ve son hücreye gider, Escape bırakır, Enter ve boşluk gösterilen hücreye basar.
- **Durum ve basmak.** Gösterilen hücre `ChartState`'te, `x`'i verinin listedeki yeri olan bir seçim olarak durur. `onSelect` basılan hücreyi verir: `label` kolonu, `name` satırı, `value` değeri.
- **Ekran okuyucu.** Grafik `description`'ını, ardından satır satır her hücreyi kolonu, satırı ve değeriyle söyler. İki yüzden çok hücresi olan grafik yalnızca açıklamasıyla anlatılır.
- **Yön.** Sağdan sola okunan dilde kolonlar sağdan başlar, satır adları sağa yazılır.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `Heatmap_<tagKey>`; hücreler `.Plot`, bir hücre `.Cell_<sıra>`, ölçek `.Legend`, tooltip `.Tooltip`.

## Kullanım

### A week by the hour

```kotlin
PantrixHeatmap(
    data = visits,
    x = { it.hour },
    y = { it.day },
    value = { it.count },
    description = stringResource(Res.string.visits_by_day_and_hour),
    tagKey = "visits"
)
```

### Five shades, with the values written

```kotlin
PantrixHeatmap(
    data = scores,
    x = { it.subject },
    y = { it.student },
    value = { it.score },
    scale = HeatmapScale(min = 0.0, max = 100.0, steps = 5),
    labels = ChartDataLabels(),
    tagKey = "scores"
)
```

## Örnekler

### Haftanın saatleri

Bir mağazanın bir haftalık ziyaretçisi, günlere ve günün dilimlerine göre. Koyu hücre kalabalık saattir.

İmleci bir hücrenin üstüne getir ya da dokun: tooltip o günün o saatindeki ziyaretçiyi yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.heatmap.PantrixHeatmap

PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    description = "Güne ve saate göre ziyaret",
    tagKey = "plain"
)

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

### Beş ton, değerler yazılı

Sınav puanları, yüz üzerinden. Ölçeğin beş tonu var (`steps`): her yirmi puan bir ton. Değerler hücrelere yazılı (`labels`) ve ölçek grafiğin yanında duruyor. Sınava girmeyenin hücresi boş.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.heatmap.PantrixHeatmap

PantrixHeatmap(
    data = examScores(),
    x = { it.subject },
    y = { it.student },
    value = { it.score },
    scale = HeatmapScale(min = 0.0, max = 100.0, steps = 5),
    labels = ChartDataLabels(),
    legend = ChartLegend(position = ChartLegendPosition.End),
    description = "Öğrencilerin derslere göre puanları",
    tagKey = "steps"
)

internal fun examScores(): List<ExamScore> {
    val subjects = listOf("Matematik", "Fizik", "Kimya", "Tarih", "Dil")
    val scores = mapOf(
        "Ada" to listOf(92, 85, 78, 64, 88),
        "Lin" to listOf(71, 58, null, 90, 95),
        "Can" to listOf(45, 62, 70, 81, 39),
        "Ece" to listOf(84, 97, 91, 55, 73)
    )
    return scores.flatMap { (student, row) ->
        subjects.mapIndexed { at, subject -> ExamScore(student, subject, row[at]) }
    }
}

internal class ExamScore(
    val student: String,
    val subject: String,
    val score: Int?
)
```

### İki renkli ölçek

İki renkli bir ölçek, sıcaklık gibi: en az ziyaret `low` renginde (uyarı renginin kabı), en çoğu `color` renginde (tehlike rengi); aradaki tonlar iki rengin Oklab'da karışımı. Renkler temadan alındığı için ölçek açık temada da koyu temada da okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.heatmap.PantrixHeatmap
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    scale = HeatmapScale(low = colors.warning.container, color = colors.danger.color),
    labels = ChartDataLabels(),
    description = "Güne ve saate göre ziyaret",
    tagKey = "two_colours"
)

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

### Bir hücreye basmak

`onSelect`, basılan hücreyi verir: bir hücreye bas ya da klavyeyle bir hücreye gidip Enter'a bas, kartın altındaki satır basılanı yazar. Ölçeğin kendi rengi var (`HeatmapScale.color`) ve ölçek çubuğu yok (`legend = null`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.heatmap.PantrixHeatmap
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    scale = HeatmapScale(color = PantrixTheme.colors.success.color),
    legend = null,
    onSelect = { cell -> report("${cell.name}, ${cell.label}: ${cell.text}") },
    description = "Güne ve saate göre ziyaret",
    tagKey = "pressed"
)

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada hücreler ve kenarlardaki adlar durur; renk ölçeği, ekranda nerede durursa dursun, dosyada hücrelerin altındadır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.heatmap.PantrixHeatmap

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixHeatmap(
    data = weekVisits(),
    x = { it.hours },
    y = { it.day },
    value = { it.visits },
    description = "Güne ve saate göre ziyaret",
    tagKey = "exported",
    export = ChartExport(fileName = "haftanin-saatleri") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun weekVisits(): List<SlotVisits> {
    val days = listOf("Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz")
    val hours = listOf("09", "11", "13", "15", "17", "19")
    val visits = listOf(
        listOf(12, 18, 34, 22, 41, 30),
        listOf(10, 16, 31, 20, 38, 28),
        listOf(14, 21, 36, 25, 44, 33),
        listOf(11, 19, 35, 27, 47, 36),
        listOf(16, 24, 42, 31, 58, 52),
        listOf(28, 45, 61, 66, 72, 57),
        listOf(22, 39, 54, 60, 49, 26)
    )
    return days.flatMapIndexed { day, name -> hours.mapIndexed { slot, at -> SlotVisits(name, at, visits[day][slot]) } }
}

internal class SlotVisits(
    val day: String,
    val hours: String,
    val visits: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixHeatmap

`import com.pantrixui.components.chart.heatmap.PantrixHeatmap`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixHeatmap(
    data: List<T>,
    x: (T) -> Any,
    y: (T) -> Any,
    value: (T) -> Number?,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    scale: HeatmapScale = HeatmapScale(),
    labels: ChartDataLabels? = null,
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

Bir ısı haritası: hücrelerden bir ızgara, her hücre değerinin ne kadar olduğunu söyleyen bir tonda. İki adı ve bir sayısı olan şeye yakışır: haftanın günlerinin saatleri, birkaç yılın ayları, bir listenin ötekiyle karşılaştırılması. Neyin çok, neyin az olduğu bir bakışta görülür; aynı sayıların tablosunu ise okumak gerekir.

Grafiğe `data` ve bir veriyi okumanın üç yolu verilir: durduğu kolon (`x`), satırı (`y`) ve `value`'su. Kolonlar ve satırlar verinin adlandırdıklarıdır, her biri bir kez, ilk adlandırıldığı sırayla. Değeri sayı olmayan veri hücre doldurmaz ve hiçbir verinin doldurmadığı hücre soluk çizilir; aynı hücreyi adlandıran iki veriden sonraki hücrenindir.

Hücrelerin çevresinde bir grafiğin parçaları durur; her biri onu tarif eden değerle verilir ve `null` ile kaldırılır: kolonların ve satırların adları, burada en küçüğü ve en büyüğüyle ton ölçeği olan `legend` ve gösterilen hücrenin değerini gösteren `tooltip`.

**Bir hücreyi göstermek.** Bir hücrenin üstündeki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği hücreye bir dokunuş da onu bırakır. Klavyeyle grafik Tab için tek bir duraktır: oklar hücreden hücreye gider, hiçbir şeyin doldurmadığı hücreleri atlar; Home ve End ilk ve son hücreye, Escape bırakır. Hücre çerçevelenir, tooltip onun için gösterilir ve `state`'e, `x`'i verinin `data` içindeki sıfırdan sayılan yeri olan bir seçim olarak söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra satır satır, kolonu, satırı ve değeriyle her hücre. İki yüzden çok hücresi olan bir grafik yalnızca açıklamasıyla anlatılır.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir. Modifier'ındaki bir yükseklik grafiğin tamamınındır, ölçeğinki de içinde; verilmezse hücreler grafiğin stilinin söylediği kadar yüksektir ve üstlerindeki ya da altlarındaki bir ölçek kendi yüksekliğini ekler. Her kolon bir sonraki kadar geniş, her satır bir sonraki kadar yüksektir. Yazılacak yeri olmayan ad bir kuralla atlanır, her ikincisi, her üçüncüsü.

Sağdan okunan bir dilde kolonlar sağdan başlar ve satırların adları sağda yazılır.

```kotlin
PantrixHeatmap(
    data = visits,
    x = { it.hour },
    y = { it.day },
    value = { it.count },
    description = "Visits by day and hour",
    tagKey = "visits"
)
```

Parametreler:

- `data: List<T>`: veri, değeri olan her hücre için bir veri.
- `x: (T) -> Any`: bir verinin durduğu kolon: bir ad, bir saat, kendine eşit olan herhangi bir şey.
- `y: (T) -> Any`: satırı, aynı biçimde.
- `value: (T) -> Number?`: değeri, yoksa null.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, ölçeğinki de içinde.
- `xAxis: ChartAxis?`: kolonlar: adlarının hücrelerin altına yazılıp yazılmadığı (`labels`) ve bir adın nasıl yazıldığı (`label`). Başka hiçbir şeyi okunmaz. `null` hiç yazmaz.
- `yAxis: ChartAxis?`: satırlar: adlarının hücrelerin yanına yazılıp yazılmadığı ve nasıl yazıldığı. `null` hiç yazmaz.
- `scale: HeatmapScale`: bir değerin nasıl bir tona dönüştüğü.
- `labels: ChartDataLabels?`: hücrelere yazılan değerler; her biri, hücrede yeri varsa, tonunun üstünde daha iyi okunan siyah ya da beyazla. `null` hiç yazmaz.
- `legend: ChartLegend?`: ton ölçeğinin durduğu yer. `null` hiç göstermez. Bir ölçeğin grafikten çıkaracağı bir şey yoktur: yalnızca durduğu yer okunur.
- `tooltip: ChartTooltip?`: gösterilen hücre için gösterilen: başlık olarak kolonu, altında da satırı ve `format`'ın söylediği gibi yazılan değeri. Bir hücrenin paylaşacağı bir yeri ve içinden geçen bir çizgisi yoktur: `shared` ve `crosshair` okunmaz. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik satırlarının adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan hücreyle çağrılır: `x`'i verinin `data` içindeki sıfırdan sayılan yeri, `label`'ı kolonu, `name`'i satırı, `value`'su değeridir.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi için temanınkiler. İki hücrenin arası `sliceGap` kadardır, köşeleri de `barRadius`'un söylediği kadar yuvarlaktır.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `Heatmap_<tagKey>`, hücrelerinin tamamı `Heatmap_<tagKey>.Plot`, bir hücre, dolu hücreler arasında satır satır birden sayılarak, `Heatmap_<tagKey>.Cell_<number>`, ölçek `Heatmap_<tagKey>.Legend` ve tooltip `Heatmap_<tagKey>.Tooltip` olur. Bir hücreye basış, verinin sıra numarasıyla bir `Heatmap` `select` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur. Renklerin ölçeği dosyada hücrelerin altında durur.

### HeatmapScale

`import com.pantrixui.components.chart.heatmap.HeatmapScale`, `com.pantrixui:components` içinden

```kotlin
class HeatmapScale(
    public val min: Double? = null,
    public val max: Double? = null,
    public val steps: Int = 0,
    public val color: Color = Color.Unspecified,
    public val low: Color = Color.Unspecified
)
```

Bir `PantrixHeatmap`'in bir değeri nasıl tona çevirdiği: ölçeğinin iki ucu, kaç tonu olduğu ve renkleri. Ölçek verilen bir PantrixTreemap de karolarını onunla tonlar.

```kotlin
HeatmapScale(min = 0.0, max = 100.0, steps = 5)
HeatmapScale(low = Color(0xFFFFF3B0), color = Color(0xFFB3261E))
```

Bir hücre `color` ile çizilir; değeri ölçek boyunca ne kadar ilerideyse renkten o kadar çok: en küçük için azı, en büyük için tamamı. Renk grafiğin durduğu zeminin üstünde durur; böylece ölçek açık temada da koyu temada da okunur. Bir `low` rengi verilirse ölçek bunun yerine ondan `color`'a gider: iki renk, her adımın bir öncekiyle aynı ölçüde değiştiği Oklab'da karıştırılır ve en küçük `low`'un kendisiyle çizilir. Böyle bir ölçek açık temada da koyu temada da aynıdır: iki rengi ikisine de uyacak biçimde seçmek çağırana kalır. `min`'in altındaki değer en küçük gibi, `max`'ın üstündeki en büyük gibi çizilir.

Beşi de aynı olan iki ölçek aynıdır.

Parametreler:

- `min: Double?`: En açık tonun karşıladığı değer. Verilmezse grafiğin değerlerinin en küçüğüdür.
- `max: Double?`: Rengin tamamının karşıladığı değer. Verilmezse en büyükleridir.
- `steps: Int`: Ölçeğin kaç tonu olduğu: beşle ölçek beş eşit aralığa bölünür ve bir aralığın her değeri o aralığın tonunu alır. Sıfırsa her değerin kendi tonu vardır.
- `color: Color`: En büyüğün rengi. Verilmezse temanın grafik renklerinin ilkidir.
- `low: Color`: En küçüğün rengi. Verilmezse en küçük, `color`'ın grafiğin durduğu zeminin üstündeki biraz payıdır.

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

### ChartLegend

`import com.pantrixui.components.chart.common.ChartLegend`, `com.pantrixui:components` içinden

```kotlin
data class ChartLegend(
    public val position: ChartLegendPosition = ChartLegendPosition.Bottom,
    public val alignment: ChartLegendAlignment = ChartLegendAlignment.Center,
    public val toggles: Boolean = true,
    public val always: Boolean = false
)
```

Bir grafiğin lejantı: serilerinin adlarının, her biri serinin nasıl çizildiğini gösteren bir örneğin yanında durduğu yer.

Tek serili bir grafiğin lejantı yoktur: o tek çizginin ne olduğu grafiğin çevresindeki yazıya aittir. `always` yine de bir lejant verir.

Bir kayıt, serisinin anahtarıdır. Basılınca seriyi grafikten çıkarır ve grafik kalan seriler için çizilir; yeniden basılınca seriyi geri getirir. Kayıt, soluk çizilerek yerinde kalır ki çıkarılan geri getirilebilsin. Ekran okuyucu her kaydı bir anahtar olarak, serinin adıyla ve açık olup olmadığıyla duyar.

Parametreler:

- `position: ChartLegendPosition`: Lejantın grafiğin hangi yanında durduğu. Üstünde ve altında kayıtlar bir satırda, gerektiği kadar çok satıra bölünerek durur; yanında alt alta dururlar.
- `alignment: ChartLegendAlignment`: Lejantın, kendisine ayrılan yerde nerede durduğu: üstte ve altta grafiğin genişliği boyunca, yanda grafiğin tepesinden başlayarak.
- `toggles: Boolean`: Bir kayda basmanın serisini grafikten çıkarıp geri getirip getirmediği.
- `always: Boolean`: Tek serili bir grafiğin de lejantının olup olmadığı.
