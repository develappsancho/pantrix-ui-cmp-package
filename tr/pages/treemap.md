# Treemap

Karolara bölünmüş bir kutu: her karo, değerinin bütüne oranı kadar büyük. Çok parçalı bir bütüne yakışır; pastanın okunamayacak kadar çok dilimi olacağı yerde: bir diskin klasörleri, kalemleriyle bir bütçe, şirketleriyle bir pazar. Büyük olan hemen görülür, küçük parçaların da yeri vardır.

Grafiğe öğeleri verilir. Her `TreemapItem` bir karodur ya da kendi öğeleri karoları olan bir gruptur (`children`). Bir grubun karoları bir blokta, grubun renginde, yer varsa grubun adı üstlerinde olarak birlikte durur. Bloklar en büyüğünden başlayarak dizilir, her blokta karolar da öyle.

- `PantrixTreemap` (`com.pantrixui.components.chart.treemap`, `com.pantrixui:components`): Karolara bölünmüş bir kutu, her karo değerinin bütündeki payı kadar büyük, üstlerinde adları yazan gruplarda: gösterilen karo için bir tooltip; her karoya tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: ağaç haritası, iç içe dikdörtgenler, hiyerarşi grafiği, yer kullanımı, oranlar.

## Özellikler

- **Karodaki yazı.** `labels` ile her karoya adı ve altına değeri yazılır, renginin üstünde daha iyi okunan siyah ya da beyazla. Adına yer olmayan karoya ikisi de yazılmaz; tooltip ve ekran okuyucu ikisini de söyler.
- **Gruplar.** `children` veren öğe gruptur: değeri karolarının toplamıdır, kendisine verilen değer okunmaz.
- **Renk.** Verilen her öğe temanın grafik renklerinden sırasına düşeni alır; bir grubun karoları grubun rengindedir. `color` ile bir öğeye ya da bir karoya kendi rengi verilir.
- **Değere göre ton.** `scale` verilirse her karo, heatmap'in hücreleri gibi değerinin ölçekteki tonunda çizilir (`HeatmapScale`): büyük karo ölçeğin ucuna daha yakındır. Öğenin ve grubun rengi o zaman okunmaz; bloklar ve grupların adları kalır. Ölçek çubuğu `legend`'ın söylediği yerde durur.
- **Gösterilen karo.** İmlecin altındaki ya da dokunulan karo çerçevelenir ve tooltip grubunu, adını, değerini ve bütündeki payını yazar.
- **Klavye.** Grafik, Tab için tek duraktır: bir ok, gösterdiği yöndeki en yakın karoya gider; Home ve End en büyük ve son karoya gider, Escape bırakır, Enter ve boşluk gösterilen karoya basar.
- **Durum ve basmak.** Gösterilen karo `ChartState`'te, `x`'i öğenin anahtarı olan bir seçim olarak durur. `onSelect` basılan karoyu verir.
- **Ekran okuyucu.** Grafik `description`'ını, ardından en büyük bloktan başlayarak her karoyu grubu, adı, değeri ve payıyla söyler. İki yüzden çok karosu olan grafik yalnızca açıklamasıyla anlatılır.
- **Yön.** Sağdan sola okunan dilde en büyük karo sağda durur.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `Treemap_<tagKey>`; karolar `.Plot`, bir karo `.Tile_<sıra>`, ölçek `.Legend`, tooltip `.Tooltip`.

## Kullanım

### What fills a disk

```kotlin
PantrixTreemap(
    items = folders.map { TreemapItem(it.id, it.name, it.megabytes) },
    description = stringResource(Res.string.disk_usage),
    tagKey = "disk"
)
```

### Groups with their tiles

```kotlin
PantrixTreemap(
    items = departments.map { department ->
        TreemapItem(
            key = department.id,
            name = department.name,
            children = department.teams.map { TreemapItem(it.id, it.name, it.budget) }
        )
    },
    tagKey = "budget"
)
```

### Shaded by size

```kotlin
PantrixTreemap(
    items = folders.map { TreemapItem(it.id, it.name, it.megabytes) },
    scale = HeatmapScale(low = Color(0xFFFFF3B0), color = Color(0xFFB3261E)),
    tagKey = "shaded"
)
```

## Örnekler

### Diski dolduranlar

Bir diski dolduranlar, gigabayt olarak. Her klasör bir karo: en büyüğü en başta.

İmleci bir karonun üstüne getir ya da dokun: tooltip klasörün boyutunu ve diskteki payını yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

PantrixTreemap(
    items = diskFolders(),
    description = "Diski dolduran klasörler",
    tagKey = "plain"
)

internal fun diskFolders(): List<TreemapItem> = listOf(
    TreemapItem("photos", "Fotoğraflar", 148),
    TreemapItem("video", "Videolar", 96),
    TreemapItem("apps", "Uygulamalar", 64),
    TreemapItem("music", "Müzik", 41),
    TreemapItem("docs", "Belgeler", 27),
    TreemapItem("mail", "Posta", 14),
    TreemapItem("other", "Öteki", 9)
)
```

### Gruplar

Bir bütçe, bölümlere ve bölümlerin kalemlerine göre. Her bölüm bir grup: kalemleri bir blokta, bölümün renginde ve bölümün adı üstlerinde durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

PantrixTreemap(
    items = budgetByDepartment(),
    description = "Bölümlere göre bütçe",
    tagKey = "grouped"
)

internal fun budgetByDepartment(): List<TreemapItem> = listOf(
    TreemapItem(
        key = "product",
        name = "Ürün",
        children = listOf(
            TreemapItem("engineering", "Mühendislik", 420),
            TreemapItem("design", "Tasarım", 160),
            TreemapItem("research", "Araştırma", 90)
        )
    ),
    TreemapItem(
        key = "growth",
        name = "Büyüme",
        children = listOf(
            TreemapItem("ads", "Reklam", 240),
            TreemapItem("events", "Etkinlik", 110),
            TreemapItem("content", "İçerik", 70)
        )
    ),
    TreemapItem(
        key = "operations",
        name = "İşletme",
        children = listOf(
            TreemapItem("support", "Destek", 130),
            TreemapItem("office", "Ofis", 80),
            TreemapItem("legal", "Hukuk", 45)
        )
    )
)
```

### Değere göre ton

Aynı bütçe, karoları değerlerine göre tonlanmış (`scale`): ölçek temanın birincil renginin kabından birincil rengine gider, büyük kalem daha koyu. Ölçek çubuğu grafiğin altında; grupların rengi bu durumda okunmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.heatmap.HeatmapScale
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixTreemap(
    items = budgetByDepartment(),
    scale = HeatmapScale(low = colors.primary.container, color = colors.primary.color),
    description = "Bölümlere göre bütçe",
    tagKey = "shaded"
)

internal fun budgetByDepartment(): List<TreemapItem> = listOf(
    TreemapItem(
        key = "product",
        name = "Ürün",
        children = listOf(
            TreemapItem("engineering", "Mühendislik", 420),
            TreemapItem("design", "Tasarım", 160),
            TreemapItem("research", "Araştırma", 90)
        )
    ),
    TreemapItem(
        key = "growth",
        name = "Büyüme",
        children = listOf(
            TreemapItem("ads", "Reklam", 240),
            TreemapItem("events", "Etkinlik", 110),
            TreemapItem("content", "İçerik", 70)
        )
    ),
    TreemapItem(
        key = "operations",
        name = "İşletme",
        children = listOf(
            TreemapItem("support", "Destek", 130),
            TreemapItem("office", "Ofis", 80),
            TreemapItem("legal", "Hukuk", 45)
        )
    )
)
```

### Bir karoya basmak

`onSelect`, basılan karoyu verir: bir karoya bas ya da klavyeyle bir karoya gidip Enter'a bas, kartın altındaki satır basılanı yazar. Değerler kendi biçimiyle yazılıyor: karolarda `ChartDataLabels(format)`, tooltip'te `ChartTooltip(format)`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

val report = LocalExampleEvents.current
PantrixTreemap(
    items = diskFolders(),
    labels = ChartDataLabels(format = { "${it.toInt()} GB" }),
    tooltip = ChartTooltip(format = { "${it.toInt()} GB" }),
    onSelect = { tile -> report("${tile.name}: ${tile.text}") },
    description = "Diski dolduran klasörler",
    tagKey = "pressed"
)

internal fun diskFolders(): List<TreemapItem> = listOf(
    TreemapItem("photos", "Fotoğraflar", 148),
    TreemapItem("video", "Videolar", 96),
    TreemapItem("apps", "Uygulamalar", 64),
    TreemapItem("music", "Müzik", 41),
    TreemapItem("docs", "Belgeler", 27),
    TreemapItem("mail", "Posta", 14),
    TreemapItem("other", "Öteki", 9)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada karolar ve adları durur; gösterilen karonun tooltip'i dosyada yoktur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.treemap.PantrixTreemap
import com.pantrixui.components.chart.treemap.TreemapItem

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixTreemap(
    items = diskFolders(),
    description = "Diski dolduran klasörler",
    tagKey = "exported",
    export = ChartExport(fileName = "disk") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun diskFolders(): List<TreemapItem> = listOf(
    TreemapItem("photos", "Fotoğraflar", 148),
    TreemapItem("video", "Videolar", 96),
    TreemapItem("apps", "Uygulamalar", 64),
    TreemapItem("music", "Müzik", 41),
    TreemapItem("docs", "Belgeler", 27),
    TreemapItem("mail", "Posta", 14),
    TreemapItem("other", "Öteki", 9)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixTreemap

`import com.pantrixui.components.chart.treemap.PantrixTreemap`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTreemap(
    items: List<TreemapItem>,
    modifier: Modifier = Modifier,
    labels: ChartDataLabels? = ChartDataLabels(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    scale: HeatmapScale? = null,
    legend: ChartLegend? = ChartLegend(),
    export: ChartExport? = null
)
```

Bir ağaç haritası: karolara bölünmüş bir kutu, her karo değerinin bütüne oranı kadar büyük. Çok parçalı bir bütüne yakışır; bir pastanın okunamayacak kadar çok dilimi olacağı yerde: bir diskin klasörleri, kalemleriyle bir bütçe, şirketleriyle bir pazar. Büyük olan hemen görülür, küçük parçaların da yeri vardır.

Grafiğe `items` verilir. Her biri bir karodur ya da kendi öğeleri karoları olan bir gruptur: bir grubun karoları bir blokta, grubun renginde, blokta yeri varsa grubun adı üstlerinde olarak birlikte durur. Bloklar, satırların başladığı yerden en büyüğü başta olmak üzere dizilir, her blokta karolar da öyle; her karo, kesimin elverdiği kadar kareye yakındır. Hiçbir şey saymayan öğenin karosu yoktur.

Bir karoya, yeri varsa, adı ve değeri yazılır, renginin üstünde daha iyi okunan siyah ya da beyazla; adına yer olmayan karoya ikisi de yazılmaz, `tooltip` ve ekran okuyucu ise ikisini de söyler.

**Değere göre ton.** Bir `scale` verilirse her karo, heatmap'in hücreleri gibi, değerinin ölçekteki tonunda çizilir; öğesinin ya da grubunun söylediği renk ne olursa olsun: karo ne kadar büyükse ölçekte o kadar ileride durur, böylece neredeyse aynı büyüklükteki iki karo, ya da birbirinden uzak iki bloğun karoları da bir bakışta ayırt edilir. Bloklar yine gruplarının adlarının altında birlikte durur, karo grubunun desenini korur ve `legend` ölçeği en küçüğü ve en büyüğüyle gösterir.

**Bir karoyu göstermek.** Bir karonun üstündeki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği karoya bir dokunuş da onu bırakır. Klavyeyle grafik Tab için tek bir duraktır: bir ok, gösterdiği yöndeki en yakın karoya gider; Home ve End en büyük ve son karoya, Escape bırakır. Karo çerçevelenir, tooltip onun için gösterilir ve `state`'e, `x`'i öğenin anahtarı olan bir seçim olarak söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra en büyük bloktan başlayarak grubu, adı, değeri ve bütündeki payıyla her karo. İki yüzden çok karosu olan bir grafik yalnızca açıklamasıyla anlatılır.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir; modifier'ının söylediği kadar, yükseklik verilmezse grafiğin stilinin söylediği kadar yüksektir.

Sağdan okunan bir dilde en büyük karo sağda durur.

```kotlin
PantrixTreemap(
    items = listOf(TreemapItem("photos", "Photos", 48), TreemapItem("video", "Video", 31)),
    description = "What fills the disk",
    tagKey = "disk"
)
```

Parametreler:

- `items: List<TreemapItem>`: karolar ve karo grupları. Anahtarları karoları birbirinden ayırır; aynı anahtarlı iki karo reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir.
- `labels: ChartDataLabels?`: karolara yazılan: her karonun adı ve altında, `format`'ın söylediği gibi ya da bir şey söylemiyorsa kısa yazılan değeri. `null` karolara hiçbir şey yazmaz.
- `tooltip: ChartTooltip?`: gösterilen karo için gösterilen: bir grupta duruyorsa başlık olarak grubu, altında da adı ve bütündeki payıyla değeri. Bir karonun paylaşacağı bir yeri ve içinden geçen bir çizgisi yoktur: `shared` ve `crosshair` okunmaz. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik kendisine verilen öğelerin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan karoyla çağrılır: anahtarı `series`'i ve `x`'idir, adı `name`'i ve `label`'ı, `text`'i de ardında bütündeki payıyla değeridir.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi için temanınkiler. İki karonun arası `sliceGap` kadardır, köşeleri de `barRadius`'un söylediği kadar yuvarlaktır.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `Treemap_<tagKey>`, karolarının tamamı `Treemap_<tagKey>.Plot`, bir karo, karoların dizildiği sırayla birden sayılarak, `Treemap_<tagKey>.Tile_<number>`, ölçek `Treemap_<tagKey>.Legend` ve tooltip `Treemap_<tagKey>.Tooltip` olur. Bir karoya basış, öğenin anahtarıyla bir `Treemap` `select` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `scale: HeatmapScale?`: karoları değerlerine göre tonlayan şey, heatmap'in ölçeğinin hücrelerini tonladığı gibi: uç vermezse uçları karoların değerlerinin en küçüğü ve en büyüğüdür. `null` ise her karo kendi rengindedir ya da grubunun.
- `legend: ChartLegend?`: ton ölçeğinin durduğu yer, treemap'in bir `scale`'i olduğunda: olmadan gösterecek bir şey yoktur. `null` hiç göstermez.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur. Renklerin ölçeği dosyada karoların altında durur.

### TreemapItem

`import com.pantrixui.components.chart.treemap.TreemapItem`, `com.pantrixui:components` içinden

```kotlin
class TreemapItem(
    public val key: String,
    public val name: String,
    public val value: Number? = null,
    public val color: Color = Color.Unspecified,
    public val children: List<TreemapItem> = emptyList(),
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixTreemap`'in bir öğesi: değeri olan bir karo ya da bir karo grubu.

```kotlin
TreemapItem("docs", "Documents", 12)
TreemapItem(
    key = "design",
    name = "Design",
    children = listOf(TreemapItem("ui", "Interface", 42), TreemapItem("brand", "Brand", 18))
)
```

`children`'ı olmayan öğe bir karodur; `value`'su bütün değerlerin ne kadarıysa o kadar büyüktür. Çocukları olan öğe bir gruptur: karoları çocuklarıdır, adının altında birlikte dururlar ve saydığı, onların birlikte saydığıdır; bir gruba verilen değer okunmaz. Kendi çocukları olan bir çocuk tek bir karodur ve hepsinin toplamını sayar.

Kuruldukları her şey aynı olan iki öğe aynı öğedir.

Parametreler:

- `key: String`: Öğeyi ötekilerden ayıran ve değeri değişirken aynı kalan şey: bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Adı: karosunda, grubunun üstünde, tooltip'te ve ekran okuyucuda.
- `value: Number?`: Ne kadar saydığı. Değeri sayı olmayan ya da sıfırın üstünde olmayan öğenin karosu yoktur.
- `color: Color`: Çizildiği renk. Verilmezse bir karo grubunun rengini alır; ağaç haritasına verilen bir öğe de, verilenler arasındaki yerine düşen tema grafik rengini: ilki için ilkini.
- `children: List<TreemapItem>`: Bir grubun karoları.
- `pattern: ChartPattern?`: Renginin yanında çizildiği desen. Verilmezse bir karo grubununkini alır; treemap'e verilen bir öğenin deseni yoktur, grafiğin desenleri açıksa (`ChartStyle.patterns`) aralarındaki yerine göre sırasındaki desen alır: ilkinin hiçbiri.

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
