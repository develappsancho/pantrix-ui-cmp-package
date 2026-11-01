# Sankey Chart

Neyin nereden nereye, ne kadar aktığını gösteren grafik. Düğümler kolonlarda durur; aralarında, akan miktar kadar geniş bantlar uzanır: bir sitenin ziyaretçilerinin nereden gelip neye devam ettiği, bir bütçenin neyden oluşup neye harcandığı.

- `PantrixSankeyChart` (`com.pantrixui.components.chart.sankey`, `com.pantrixui:components`): Neyin nereden nereye aktığı: sütunlarda düğümler ve aralarında akan şey kadar geniş bantlar, yalnızca bağlantılardan dizilmiş: gösterilen düğüm için bir tooltip; her düğüme tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: sankey, akış diyagramı, akışlar, aktarımlar, bütçe akışı.

## Özellikler

- **Düğümler ve bağlantılar.** Grafik düğümlerini (`SankeyNode`) ve aralarındaki bağlantıları (`SankeyLink`) alır; bir bağlantı iki düğümünü anahtarlarıyla söyler. Aynı iki düğüm arasındaki bağlantılar tek bir akıştır.
- **Kolonlar.** Kolonlar bağlantılardan çıkar: içine hiçbir şey akmayan düğüm ilk kolonda, ötekiler kendisine akanların sonuncusundan bir kolon ileride, dışına hiçbir şey akmayan düğüm son kolonda durur. `align` birden çok kolonda durabilecek düğümün yerini seçer: `Justify`, `Left`, `Right`, `Center`. Bir kolonun düğümleri, akışları olabildiğince kesişmeyecek sıraya dizilir; `order = SankeyOrder.Given` verildikleri sırada bırakır.
- **Ölçü.** Bir düğüm, içine akanla dışına akanın büyüğü kadar yüksektir; bir bant, akan miktar kadar geniştir. Düğümün genişliği ve bir kolonun iki düğümü arası `ChartStyle`'ın `nodeWidth`'i ve `nodeGap`'idir.
- **Gösterilen düğüm.** İmlecin ya da parmağın üstünde durduğu düğüm bir halkayla işaretlenir, akışları belirginleşir, ötekiler soluklaşır. Tooltip düğümü ve her akışını, öbür ucundaki düğümün adıyla yazar. Klavyede oklar gösterdikleri yöndeki en yakın düğüme gider.
- **Gösterilen akış.** İmleç ya da parmak bir akışın üstündeyse akış belirginleşir, ötekiler soluklaşır ve tooltip iki düğümünü akış yönünde yazar ("Arama → Üye oldu"). Klavye düğümlerde kalır.
- **Reddedilenler.** Bir düğümden kendisine giden bağlantı, başladığı yere geri dönen bağlantılar ve grafikte olmayan bir düğümü söyleyen bağlantı reddedilir.
- **Ekran okuyucu.** Önce grafiğin açıklaması, sonra kolon kolon her düğüm: saydığı miktar ve her akışı, nereden geldiği ya da nereye gittiğiyle.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** Grafik `Sankey_<tagKey>`, bir düğüm `Sankey_<tagKey>.Node_<numara>` olarak etiketlenir. Bir düğüme basış, düğümün anahtarıyla, bir akışa basış iki düğümünün anahtarıyla (`kaynak>hedef`) bir `select` olayı olarak bildirilir.

## Kullanım

### Where visitors come from and what they go on to

```kotlin
PantrixSankeyChart(
    nodes = listOf(
        SankeyNode("search", stringResource(Res.string.search)),
        SankeyNode("social", stringResource(Res.string.social)),
        SankeyNode("signup", stringResource(Res.string.signup)),
        SankeyNode("left", stringResource(Res.string.left))
    ),
    links = listOf(
        SankeyLink("search", "signup", report.searchSignups),
        SankeyLink("search", "left", report.searchLeft),
        SankeyLink("social", "signup", report.socialSignups),
        SankeyLink("social", "left", report.socialLeft)
    ),
    description = stringResource(Res.string.visitor_flows),
    tagKey = "visitors"
)
```

### Nodes and links read from rows, with a node that is pressed

```kotlin
PantrixSankeyChart(
    nodes = accounts.map { SankeyNode(it.id, it.name) },
    links = transfers.map { SankeyLink(from = it.source, to = it.target, value = it.amount) },
    onSelect = { node -> openAccount(node.series) },
    tagKey = "budget"
)
```

## Örnekler

### Ziyaretçiler nereden gelip nereye gidiyor

Üç kolon: ziyaretçilerin geldiği kaynaklar, sitede yaptıkları ve vardıkları son. Kolonları grafik bağlantılardan kendi çıkarır; bir kolonun düğümlerini de akışları kesişmesin diye kendi sıralar.

İmleci bir düğümün üstüne getir ya da düğüme dokun: düğümün akışları belirginleşir ve tooltip her birini öbür ucundaki düğümle birlikte yazar. Bir akışın üstünde yalnızca o akış belirginleşir ve tooltip onu iki düğümüyle yazar.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.sankey.PantrixSankeyChart
import com.pantrixui.components.chart.sankey.SankeyLink
import com.pantrixui.components.chart.sankey.SankeyNode

PantrixSankeyChart(
    nodes = VISITOR_NODES,
    links = VISITOR_LINKS,
    modifier = Modifier.height(280.dp),
    description = "Ziyaretçilerin geldiği kaynaklar, sitede yaptıkları ve vardıkları son",
    tagKey = "plain"
)

private val VISITOR_NODES = listOf(
    SankeyNode("search", "Arama"),
    SankeyNode("social", "Sosyal"),
    SankeyNode("direct", "Doğrudan"),
    SankeyNode("signup", "Üye oldu"),
    SankeyNode("browse", "Gezindi"),
    SankeyNode("paid", "Ödedi"),
    SankeyNode("free", "Ücretsiz kaldı"),
    SankeyNode("left", "Ayrıldı")
)

private val VISITOR_LINKS = listOf(
    SankeyLink("search", "signup", 300),
    SankeyLink("search", "browse", 200),
    SankeyLink("social", "signup", 100),
    SankeyLink("social", "browse", 200),
    SankeyLink("direct", "signup", 120),
    SankeyLink("direct", "browse", 80),
    SankeyLink("signup", "paid", 220),
    SankeyLink("signup", "free", 300),
    SankeyLink("browse", "free", 180),
    SankeyLink("browse", "left", 300)
)
```

### Gelir ve harcama

İki kolon: bir ayın gelirleri ve harcandıkları yerler. Tooltip'in değerleri kısa yazılıyor (`ChartTooltip`'in `format`'ı). Anahtarı çevir: düğümlerin adları kalkar (`names = false`) ve adlar yalnızca tooltip'te durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.chart.sankey.PantrixSankeyChart
import com.pantrixui.components.chart.sankey.SankeyLink
import com.pantrixui.components.chart.sankey.SankeyNode
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var named by remember { mutableStateOf(true) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = named,
    onCheckedChange = { named = it },
    label = "Düğüm adları",
    tagKey = "sankey_names"
)
PantrixSankeyChart(
    nodes = BUDGET_NODES,
    links = BUDGET_LINKS,
    names = named,
    tooltip = ChartTooltip(format = { strings.compact(it) + " TL" }),
    description = "Bir ayın gelirleri ve harcandıkları yerler",
    tagKey = "budget"
)

private val BUDGET_NODES = listOf(
    SankeyNode("salary", "Maaş"),
    SankeyNode("extra", "Ek gelir"),
    SankeyNode("rent", "Kira"),
    SankeyNode("food", "Mutfak"),
    SankeyNode("bills", "Faturalar"),
    SankeyNode("saved", "Birikim")
)

private val BUDGET_LINKS = listOf(
    SankeyLink("salary", "rent", 28_000),
    SankeyLink("salary", "food", 16_000),
    SankeyLink("salary", "bills", 9_000),
    SankeyLink("salary", "saved", 12_000),
    SankeyLink("extra", "saved", 8_000),
    SankeyLink("extra", "food", 4_000)
)
```

### Bir düğüme basmak

Bir basış, düğümü alır: anahtarı `series`'inde, adı `name`'inde, saydığı miktar `value`'sundadır. Bir akışa basış akışı alır: çıktığı düğümün anahtarı `series`'inde, vardığı düğümünkü `x`'inde. Bir düğüme ya da iki kolon arasında bir akışa bas: alttaki satır basılanı yazar.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.sankey.PantrixSankeyChart
import com.pantrixui.components.chart.sankey.SankeyLink
import com.pantrixui.components.chart.sankey.SankeyNode
import com.pantrixui.components.elements.text.PantrixText

var pressed by remember { mutableStateOf<String?>(null) }
PantrixSankeyChart(
    nodes = VISITOR_NODES,
    links = VISITOR_LINKS,
    modifier = Modifier.height(280.dp),
    onSelect = { pressed = "${it.name}: ${it.text} ziyaretçi" },
    description = "Ziyaretçilerin geldiği kaynaklar, sitede yaptıkları ve vardıkları son",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Bir düğüme bas")

private val VISITOR_NODES = listOf(
    SankeyNode("search", "Arama"),
    SankeyNode("social", "Sosyal"),
    SankeyNode("direct", "Doğrudan"),
    SankeyNode("signup", "Üye oldu"),
    SankeyNode("browse", "Gezindi"),
    SankeyNode("paid", "Ödedi"),
    SankeyNode("free", "Ücretsiz kaldı"),
    SankeyNode("left", "Ayrıldı")
)

private val VISITOR_LINKS = listOf(
    SankeyLink("search", "signup", 300),
    SankeyLink("search", "browse", 200),
    SankeyLink("social", "signup", 100),
    SankeyLink("social", "browse", 200),
    SankeyLink("direct", "signup", 120),
    SankeyLink("direct", "browse", 80),
    SankeyLink("signup", "paid", 220),
    SankeyLink("signup", "free", 300),
    SankeyLink("browse", "free", 180),
    SankeyLink("browse", "left", 300)
)
```

### Kolonların hizası ve sıra

Kolonların hizası (`align`). Reklamdan gelenler doğrudan ödemeye, aramadan gelenlerin bir kısmı hemen çıkışa akar: bu iki düğüm birden çok kolonda durabilir. "Yasla" dışına bir şey akmayanı son kolona, "Sola" olabildiğince öne, "Sağa" içine bir şey akmayanı olabildiğince geriye, "Ortala" içine bir şey akmayanı aktığı ilk düğümün bir önüne koyar. Anahtarı çevir: düğümler kolonda verildikleri sırada durur (`order = SankeyOrder.Given`).

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.sankey.PantrixSankeyChart
import com.pantrixui.components.chart.sankey.SankeyAlign
import com.pantrixui.components.chart.sankey.SankeyLink
import com.pantrixui.components.chart.sankey.SankeyNode
import com.pantrixui.components.chart.sankey.SankeyOrder
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var align by remember { mutableStateOf(SankeyAlign.Justify) }
var given by remember { mutableStateOf(false) }
PantrixSegmentButton(
    options = SANKEY_ALIGNS,
    selected = align,
    onSelect = { align = it },
    fullWidth = false,
    tagKey = "sankey_align"
)
PantrixSwitchButton(
    checked = given,
    onCheckedChange = { given = it },
    label = "Verildiği sırayla",
    tagKey = "sankey_given"
)
PantrixSankeyChart(
    nodes = ALIGN_NODES,
    links = ALIGN_LINKS,
    modifier = Modifier.height(260.dp),
    align = align,
    order = if (given) SankeyOrder.Given else SankeyOrder.Untangled,
    description = "Ziyaretçilerin geldiği yerler ve vardıkları son",
    tagKey = "align"
)

private val ALIGN_NODES = listOf(
    SankeyNode("search", "Arama"),
    SankeyNode("ads", "Reklam"),
    SankeyNode("signup", "Üye oldu"),
    SankeyNode("browse", "Gezindi"),
    SankeyNode("left", "Ayrıldı"),
    SankeyNode("paid", "Ödedi"),
    SankeyNode("bounce", "Hemen çıktı")
)

private val ALIGN_LINKS = listOf(
    SankeyLink("search", "signup", 300),
    SankeyLink("search", "browse", 200),
    SankeyLink("search", "bounce", 100),
    SankeyLink("ads", "paid", 60),
    SankeyLink("signup", "paid", 120),
    SankeyLink("signup", "left", 180),
    SankeyLink("browse", "left", 200)
)

private val SANKEY_ALIGNS = listOf(
    SegmentOption(value = SankeyAlign.Justify, label = "Yasla", tagKey = "justify"),
    SegmentOption(value = SankeyAlign.Left, label = "Sola", tagKey = "left"),
    SegmentOption(value = SankeyAlign.Right, label = "Sağa", tagKey = "right"),
    SegmentOption(value = SankeyAlign.Center, label = "Ortala", tagKey = "center")
)
```

### Kendi ölçülerin

Düğümlerin kendi ölçüleri: daha geniş düğümler (`nodeWidth`) ve bir kolonun düğümleri arasında daha çok boşluk (`nodeGap`). Verilmeyen alan temanınki kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.sankey.PantrixSankeyChart
import com.pantrixui.components.chart.sankey.SankeyLink
import com.pantrixui.components.chart.sankey.SankeyNode

PantrixSankeyChart(
    nodes = BUDGET_NODES,
    links = BUDGET_LINKS,
    description = "Bir ayın gelirleri ve harcandıkları yerler",
    style = ChartStyle(nodeWidth = 24.dp, nodeGap = 16.dp),
    tagKey = "own_sizes"
)

private val BUDGET_NODES = listOf(
    SankeyNode("salary", "Maaş"),
    SankeyNode("extra", "Ek gelir"),
    SankeyNode("rent", "Kira"),
    SankeyNode("food", "Mutfak"),
    SankeyNode("bills", "Faturalar"),
    SankeyNode("saved", "Birikim")
)

private val BUDGET_LINKS = listOf(
    SankeyLink("salary", "rent", 28_000),
    SankeyLink("salary", "food", 16_000),
    SankeyLink("salary", "bills", 9_000),
    SankeyLink("salary", "saved", 12_000),
    SankeyLink("extra", "saved", 8_000),
    SankeyLink("extra", "food", 4_000)
)
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada düğümler, akışlar ve adlar durur; gösterilen akış ya da düğüm dosyada öne çıkmaz.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.sankey.PantrixSankeyChart
import com.pantrixui.components.chart.sankey.SankeyLink
import com.pantrixui.components.chart.sankey.SankeyNode

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixSankeyChart(
    nodes = VISITOR_NODES,
    links = VISITOR_LINKS,
    modifier = Modifier.height(280.dp),
    description = "Ziyaretçilerin geldiği kaynaklar, sitede yaptıkları ve vardıkları son",
    tagKey = "exported",
    export = ChartExport(fileName = "ziyaretciler") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val VISITOR_NODES = listOf(
    SankeyNode("search", "Arama"),
    SankeyNode("social", "Sosyal"),
    SankeyNode("direct", "Doğrudan"),
    SankeyNode("signup", "Üye oldu"),
    SankeyNode("browse", "Gezindi"),
    SankeyNode("paid", "Ödedi"),
    SankeyNode("free", "Ücretsiz kaldı"),
    SankeyNode("left", "Ayrıldı")
)

private val VISITOR_LINKS = listOf(
    SankeyLink("search", "signup", 300),
    SankeyLink("search", "browse", 200),
    SankeyLink("social", "signup", 100),
    SankeyLink("social", "browse", 200),
    SankeyLink("direct", "signup", 120),
    SankeyLink("direct", "browse", 80),
    SankeyLink("signup", "paid", 220),
    SankeyLink("signup", "free", 300),
    SankeyLink("browse", "free", 180),
    SankeyLink("browse", "left", 300)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixSankeyChart

`import com.pantrixui.components.chart.sankey.PantrixSankeyChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSankeyChart(
    nodes: List<SankeyNode>,
    links: List<SankeyLink>,
    modifier: Modifier = Modifier,
    names: Boolean = true,
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    align: SankeyAlign = SankeyAlign.Justify,
    order: SankeyOrder = SankeyOrder.Untangled,
    export: ChartExport? = null
)
```

Bir sankey grafiği: neyin nereden nereye, ne kadar aktığı. Düğümler kolonlarda durur; aralarında, akan miktar kadar geniş bantlar olarak akışlar uzanır: bir sitenin ziyaretçilerinin nereden gelip neye devam ettiği, bir bütçenin neyden oluşup neye harcandığı, bir santralin enerjisinin nereye vardığı.

Grafik `nodes`'unu ve aralarındaki `links`'i alır; her bağlantı iki düğümünü anahtarlarıyla söyler. Kolonlar bağlantılardan çıkar: içine hiçbir şey akmayan düğüm ilk kolonda, ötekiler kendisine akan düğümlerin sonuncusundan bir kolon ileride, dışına hiçbir şey akmayan düğüm son kolonda durur; `align` varsayılan olarak böyle yerleştirir. Bir kolonda düğümler, akışlarının kesişmesini olabildiğince önleyen sıraya dizilir, `order` söylüyorsa verildikleri sırada kalır. Bir düğüm, içine akanla dışına akanın büyüğü kadar yüksektir; hiçbir bağlantının söylemediği düğümün grafikte yeri yoktur.

Aynı iki düğüm arasındaki iki bağlantı tek bir akıştır: ikisinin toplamı. Bağlantılar tek yöne gitmelidir: bir düğümden kendisine giden bağlantı, başladıkları yere geri dönen bağlantılar ve grafikte olmayan bir düğümü söyleyen bağlantı reddedilir.

**Bir düğümü göstermek.** Bir düğümün üstündeki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği düğüme bir dokunuş daha onu bırakır. Klavyede grafik Tab için tek duraktır: bir ok gösterdiği yöndeki en yakın düğüme gider, Home ve End ilk düğüme ve sonuncusuna, Escape bırakır. Düğüm halkalanır, akışları daha belirgin, ötekiler daha soluk çizilir, tooltip onun için gösterilir ve `state`'e, `x`'i düğümün anahtarı olan bir seçim olarak bildirilir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Bir akışı göstermek.** Düğümlerin dışında bir akışın üstündeki imleç akışı gösterir, parmak bir dokunuşla gösterir: akış daha belirgin, ötekiler daha soluk çizilir ve tooltip iki düğümünü akış yönünde, akan miktarla yazar. `state`'e, `series`'i çıktığı düğümün, `x`'i vardığı düğümün anahtarı olan bir seçim olarak söylenir; üstüne bir basış `onSelect`'i çağırır. Tuşlar düğümden düğüme gider, akışları düğümlerin tooltip'lerine bırakır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra her düğüm, saydığı miktarla, ardından da her akışı: nereden geldiği ya da nereye gittiği ve ne kadar olduğu.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir; modifier'ının söylediği kadar, yükseklik verilmediyse grafiğin stilinin söylediği kadar yüksektir. Sağdan okunan bir dilde ilk kolon sağda durur.

```kotlin
PantrixSankeyChart(
    nodes = listOf(SankeyNode("search", "Search"), SankeyNode("signup", "Sign-up"), SankeyNode("left", "Left")),
    links = listOf(SankeyLink("search", "signup", 420), SankeyLink("search", "left", 580)),
    description = "Where the visitors from search go",
    tagKey = "visitors"
)
```

Parametreler:

- `nodes: List<SankeyNode>`: düğümler. Anahtarları onları ayırır; aynı anahtarı taşıyan iki düğüm reddedilir.
- `links: List<SankeyLink>`: düğümler arasında akanlar: her biri bir düğümden ötekine, anahtarlarıyla.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir.
- `names: Boolean`: her düğümün adının, yeri olduğunda, yanına yazılıp yazılmadığı.
- `tooltip: ChartTooltip?`: gösterilen düğüm için gösterilen: adı ve saydığı miktar, altlarında da içine ve dışına akan her akış, öbür ucundaki düğümle. Değerleri `format`'ı yazar; `shared` ve `crosshair` okunmaz. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik düğümlerinin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan düğümle çağrılır: anahtarı `series`'i ve `x`'idir, adı `name`'i ve `label`'ı, `value`'su da saydığı miktardır; ve basılan akışla: çıktığı düğümün anahtarı `series`'i, vardığı düğümünkü `x`'idir, `name`'i iki düğümün adı, `value`'su da akan miktardır.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi temanınkiyle. Bir düğüm `nodeWidth` kadar geniştir, bir kolonun iki düğümünün arası bir `nodeGap` kadardır, bir düğümün köşeleri de `barRadius`'un söylediği kadar yuvarlaktır.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `Sankey_<tagKey>`, düğümleri ve akışları birlikte `Sankey_<tagKey>.Plot`, bir düğüm birden sayılarak, kolon kolon ve her kolonda yukarıdan aşağı, `Sankey_<tagKey>.Node_<number>`, tooltip `Sankey_<tagKey>.Tooltip`'tir. Bir düğüme basış, düğümün anahtarıyla, bir akışa basış iki düğümünün anahtarlarıyla (`from>to`) bir `Sankey` `select` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `align: SankeyAlign`: her düğümün, durabileceği kolonlardan hangisinde durduğu.
- `order: SankeyOrder`: bir kolonun düğümlerinin dizildiği sıra: akışların kesişmesini önleyen sıra ya da verildikleri sıra.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur.

### SankeyNode

`import com.pantrixui.components.chart.sankey.SankeyNode`, `com.pantrixui:components` içinden

```kotlin
class SankeyNode(
    public val key: String,
    public val name: String,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixSankeyChart`'ın bir düğümü: grafiğin izlediği şeyin içinden çıktığı, içine girdiği ya da içinden geçtiği şey.

```kotlin
SankeyNode("search", "Search")
```

Parametreler:

- `key: String`: Düğümü grafiğinin ötekilerinden ayıran şey: bir bağlantının onu söylediği, bir seçimin söylediği ve bir olayın bildirdiği. Bir test etiketinin anahtarı gibi yazılır: küçük harfler ve rakamlarla.
- `name: String`: Düğümün adı: yanında, tooltip'te ve ekran okuyucuda.
- `color: Color`: Düğümün ve ondan çıkan akışların çizildiği renk. Verilmezse, düğümlerin arasındaki sırasına göre temanın grafik rengidir.
- `pattern: ChartPattern?`: Düğümün renginin yanında çizildiği desen. Verilmezse hiçbiri; grafiğin desenleri açıksa (`ChartStyle.patterns`), düğümler arasındaki yerine göre sırasındaki desen: ilkinin hiçbiri.

### SankeyLink

`import com.pantrixui.components.chart.sankey.SankeyLink`, `com.pantrixui:components` içinden

```kotlin
class SankeyLink(
    public val from: String,
    public val to: String,
    public val value: Number
)
```

Bir `PantrixSankeyChart`'ın bir bağlantısı: bir düğümden ötekine ne kadar aktığı.

```kotlin
SankeyLink(from = "search", to = "signup", value = 420)
```

Parametreler:

- `from: String`: Çıktığı düğümün anahtarı.
- `to: String`: Vardığı düğümün anahtarı: çıktığı düğümden başka bir düğüm.
- `value: Number`: Ne kadar aktığı. Sayı olmayan, sonu olmayan ya da sıfırın üstünde olmayan bir değer akış değildir.

### SankeyAlign

`import com.pantrixui.components.chart.sankey.SankeyAlign`, `com.pantrixui:components` içinden

```kotlin
enum class SankeyAlign
```

Bir `PantrixSankeyChart`'ın her düğümünün hangi kolonda durduğu. Her düğüm kendisine akan düğümlerden bir kolon ileride durur; dördü, birden çok kolonda durabilecek düğümün yerinde ayrılır.

Değerleri:

- `Justify`: Kendisine akan düğümlerin sonuncusundan bir kolon ileride; dışına hiçbir şey akmayan düğüm son kolonda.
- `Left`: Kendisine akan düğümlerin sonuncusundan bir kolon ileride: dışına hiçbir şey akmayan düğüm de.
- `Right`: Aktığı düğümlerin ilkinden bir kolon önce; içine hiçbir şey akmayan düğüm olabildiğince geride.
- `Center`: Kendisine akan düğümlerin sonuncusundan bir kolon ileride; içine hiçbir şey akmayan düğüm, aktığı düğümlerin ilkinden bir kolon önce.

### SankeyOrder

`import com.pantrixui.components.chart.sankey.SankeyOrder`, `com.pantrixui:components` içinden

```kotlin
enum class SankeyOrder
```

Bir `PantrixSankeyChart`'ın bir kolonundaki düğümlerin yukarıdan aşağı dizildiği sıra.

Değerleri:

- `Untangled`: Akışlarının kesişmesini olabildiğince önleyen sıra.
- `Given`: Düğümlerin verildiği sıra.
