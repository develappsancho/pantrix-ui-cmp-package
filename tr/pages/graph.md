# Graph

Düğümler ve aralarındaki bağlar, kartlar olarak: bir belgenin yapısı, bir ekip, bir işin adımları. Kartların yerini grafik kendisi bulur; zemin sürüklenir ve yakınlaştırılır.

- `PantrixGraph` (`com.pantrixui.components.data.graph`, `com.pantrixui:components`): Düğümler ve aralarındaki bağlar; grafik onları bir ağaç olarak ya da katmanlara dizer, sürüklenen ve yakınlaştırılan bir zeminde: uygulamanın çizdiği, seçilen, kapatılan ve tuşlarla gezilen kartlar. Anahtar sözcükler: grafik, diyagram, düğüm grafiği, ağaç diyagramı, organizasyon şeması, akış şeması, zihin haritası, dag, kaydırma ve yakınlaştırma, tuval, bağlar, kenarlar.

## Özellikler

- **Yerleşim.** Hiçbir düğüme iki bağ gelmiyorsa grafik bir ağaçtır: her ebeveyn çocuklarının ortasında, her alt ağaç bir öncekine sınırlarının el verdiği kadar yakın. Gelen varsa katmanlara dizilir, bağların en az kesiştiği sırayla. Döngüyü kapatan bağ kesik çizgiyle, geriye çizilir ve tanılama onu bildirir.
- **Yön.** `GraphDirection.StartToEnd` baştan sona (Arapçada sağdan sola), `TopToBottom` yukarıdan aşağı.
- **Kart.** Çerçeve grafiğin, içi uygulamanın: `GraphNodeScope` kartın seçili, odakta, açık olup olmadığını söyler. Boyutu verilen kart oluşturulmadan yerleşir ve yalnızca görünürken oluşturulur; verilmeyen bir kez ölçülür.
- **Seçim ve kapama.** Seçili kart ve açık kartlar uygulamanındır (`selectedKey`, `expanded`). `GraphFoldButton` kartı kapatır ve açar; `expandedToLevel` bir düzeye kadar açar. Kartlar yeni yerlerine kayar; basılan kart ekranda yerinde kalır.
- **Gezinme.** Sürükleme, tekerlek ve iki parmak; Ctrl ya da ⌘ ile tekerlek yakınlaştırır. `GraphState` yakınlaştırır, sığdırır ve bir kartı görünüme getirir; `PantrixGraphZoom` aynı düğmeleri ekranın kendi yerine koyar.
- **Klavye ve ekran okuyucu.** Oklar grafiğin yönünde karttan karta gider, Enter seçer, + ve − yakınlaştırır, 0 sığdırır. Ekran okuyucu kartı adı, kardeşleri arasındaki yeri ve düzeyiyle, ağacın sırasıyla okur.
- **Otomasyon.** `tagKey` ile grafik `Graph_<tagKey>`, kartları `Graph_<tagKey>.Node_<anahtar>` olur.

## Kullanım

### A document's structure, chosen and closed

```kotlin
var chosen by remember { mutableStateOf("$") }
var open by remember { mutableStateOf(setOf("$")) }
PantrixGraph(
    nodes = listOf(
        GraphNode(key = "$", label = "order", size = DpSize(160.dp, 32.dp)),
        GraphNode(key = "customer", label = "customer", size = DpSize(160.dp, 32.dp))
    ),
    links = listOf(GraphLink(from = "$", to = "customer", label = "customer")),
    modifier = Modifier.fillMaxWidth().height(320.dp),
    selectedKey = chosen,
    onSelect = { chosen = it },
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "document"
) { node ->
    Row(Modifier.fillMaxHeight().padding(start = 10.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = node.label, modifier = Modifier.weight(1f))
        GraphFoldButton()
    }
}
```

### Top down, with the screen's own zoom buttons

```kotlin
val graph = rememberGraphState(initialZoom = 0.7f)
Column {
    PantrixGraphZoom(state = graph, tagKey = "team")
    PantrixGraph(
        nodes = people,
        links = reports,
        modifier = Modifier.fillMaxWidth().weight(1f),
        state = graph,
        direction = GraphDirection.TopToBottom,
        zoomButtons = false,
        tagKey = "team"
    ) { node -> PantrixText(text = node.label, modifier = Modifier.padding(12.dp)) }
}
```

## Örnekler

### Bir belgenin yapısı

Bir siparişin yapısı, her nesne ve dizi bir kart: başında adı ve sayısı, satırlarında tek satırlık değerleri. İçindeki nesne ve dizi kendi kartıdır, ona anahtarıyla ya da sırasıyla bağlıdır. Seçili kartın başı boyanır; düzey düğmeleri `expandedToLevel` ile açar, kartın oku kapatır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.graph.GraphFoldButton
import com.pantrixui.components.data.graph.GraphLink
import com.pantrixui.components.data.graph.GraphNode
import com.pantrixui.components.data.graph.PantrixGraph
import com.pantrixui.components.data.graph.expandedToLevel
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var chosen by remember { mutableStateOf("customer") }
var open by remember { mutableStateOf(expandedToLevel(ORDER_NODES, ORDER_LINKS, level = 3)) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButtonGroup(
        buttons = LEVELS.map { (name, level) ->
            GroupButton(
                text = name,
                onClick = { open = expandedToLevel(ORDER_NODES, ORDER_LINKS, level) },
                tagKey = "level_$name"
            )
        },
        size = ButtonSize.Small
    )
    PantrixGraph(
        nodes = ORDER_NODES,
        links = ORDER_LINKS,
        modifier = Modifier.fillMaxWidth().height(420.dp),
        selectedKey = chosen,
        onSelect = { chosen = it },
        expanded = open,
        onExpandedChange = { open = it },
        tagKey = "order"
    ) { node ->
        val card = ORDER.getValue(node.key)
        val colors = PantrixTheme.colors
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(HEAD)
                    .background(if (selected) colors.primary.container else Color.Transparent)
                    .padding(start = 10.dp, end = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                val head = if (selected) colors.primary.onContainer else colors.textPrimary
                PantrixText(text = card.title, style = PantrixTheme.typography.code, color = head)
                PantrixText(
                    text = card.count,
                    modifier = Modifier.weight(1f),
                    style = PantrixTheme.typography.code,
                    color = if (selected) head else colors.textSecondary
                )
                GraphFoldButton()
            }
            card.rows.forEach { (key, value) ->
                Row(modifier = Modifier.height(ROW).padding(horizontal = 10.dp)) {
                    PantrixText(text = "$key: ", style = PantrixTheme.typography.code, color = colors.primary.color)
                    PantrixText(
                        text = value,
                        style = PantrixTheme.typography.code,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

private val HEAD = 32.dp

private val ROW = 24.dp

private val ORDER = linkedMapOf(
    "$" to DocumentCard(
        "root",
        "order.json",
        "{11}",
        listOf(
            "id" to "\"ord_8842\"",
            "status" to "\"shipped\"",
            "createdAt" to "\"2026-10-28T14:32:00Z\"",
            "total" to "129.90",
            "currency" to "\"EUR\"",
            "paid" to "true",
            "coupon" to "null"
        )
    ),
    "customer" to DocumentCard(
        "customer",
        "customer",
        "{4}",
        listOf("name" to "\"Elif Yılmaz\"", "email" to "\"elif@example.com\"")
    ),
    "theme" to DocumentCard("theme", "theme", "{1}", listOf("accent" to "\"#0F766E\"")),
    "items" to DocumentCard("items", "items", "[2]", emptyList()),
    "items0" to DocumentCard(
        "item_0",
        "items[0]",
        "{4}",
        listOf("sku" to "\"TS-001\"", "qty" to "2", "price" to "39.95")
    ),
    "items1" to DocumentCard(
        "item_1",
        "items[1]",
        "{4}",
        listOf("sku" to "\"MG-014\"", "qty" to "1", "price" to "50.00")
    ),
    "shipping" to DocumentCard(
        "shipping",
        "shipping",
        "{3}",
        listOf("method" to "\"express\"", "eta" to "\"2026-11-04\"")
    ),
    "address" to DocumentCard("address", "address", "{2}", listOf("city" to "\"İzmir\"", "country" to "\"TR\""))
)

private val ORDER_NODES = ORDER.map { (key, card) ->
    val rows = card.rows.size
    val height = HEAD + ROW * rows + if (rows > 0) 6.dp else 0.dp
    GraphNode(key = key, label = "${card.title}, ${card.count}", size = DpSize(200.dp, height), tagKey = card.id)
}

private val ORDER_LINKS = listOf(
    GraphLink("$", "customer", "customer"),
    GraphLink("$", "theme", "theme"),
    GraphLink("$", "items", "items"),
    GraphLink("$", "shipping", "shipping"),
    GraphLink("items", "items0", "[0]"),
    GraphLink("items", "items1", "[1]"),
    GraphLink("shipping", "address", "address")
)

private val LEVELS = listOf("1" to 1, "2" to 2, "3" to 3, "Tümü" to Int.MAX_VALUE)

private class DocumentCard(
    val id: String,
    val title: String,
    val count: String,
    val rows: List<Pair<String, String>>
)
```

### Yukarıdan aşağı, kendi düğmeleriyle

Bir ekip yukarıdan aşağı, telefonun dar ekranındaki gibi; yakınlaştırma düğmeleri grafiğin köşesinde değil, ekranın kendi araç çubuğunda: `GraphState` yakınlaştırır, uzaklaştırır, %100'e getirir ve sığdırır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.graph.GraphDirection
import com.pantrixui.components.data.graph.GraphLink
import com.pantrixui.components.data.graph.GraphNode
import com.pantrixui.components.data.graph.PantrixGraph
import com.pantrixui.components.data.graph.rememberGraphState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val graph = rememberGraphState(initialZoom = 0.8f, zoomRange = 0.5f..1.5f)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        PantrixIconButton(
            imageVector = PantrixIcons.ZoomOut,
            contentDescription = "Uzaklaştır",
            onClick = graph::zoomOut,
            size = ButtonSize.Small,
            enabled = graph.canZoomOut,
            tagKey = "team_out"
        )
        PantrixText(text = "%${(graph.zoom * 100).roundToInt()}", modifier = Modifier.padding(horizontal = 4.dp))
        PantrixIconButton(
            imageVector = PantrixIcons.ZoomIn,
            contentDescription = "Yakınlaştır",
            onClick = graph::zoomIn,
            size = ButtonSize.Small,
            enabled = graph.canZoomIn,
            tagKey = "team_in"
        )
        PantrixButton(
            text = "%100",
            onClick = { graph.zoomTo(1f) },
            variant = ButtonVariant.Text,
            size = ButtonSize.Small,
            tagKey = "team_actual"
        )
        PantrixIconButton(
            imageVector = PantrixIcons.FitScreen,
            contentDescription = "Sığdır",
            onClick = graph::fit,
            size = ButtonSize.Small,
            tagKey = "team_fit"
        )
        PantrixText(
            text = "${graph.zoomRange.start.percent()}–${graph.zoomRange.endInclusive.percent()}",
            color = PantrixTheme.colors.textSecondary,
            style = PantrixTheme.typography.footnote
        )
    }
    PantrixGraph(
        nodes = TEAM.map { person -> GraphNode(key = person.id, label = person.name, size = PERSON) },
        links = TEAM.mapNotNull { person -> person.lead?.let { GraphLink(from = it, to = person.id) } },
        modifier = Modifier.fillMaxWidth().height(360.dp),
        state = graph,
        direction = GraphDirection.TopToBottom,
        zoomButtons = false,
        tagKey = "team"
    ) { node ->
        Column(modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) {
            PantrixText(text = node.label, style = PantrixTheme.typography.label)
            PantrixText(
                text = TEAM.first { it.id == node.key }.role,
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

private fun Float.percent() = "%${(this * 100).roundToInt()}"

private val TEAM = listOf(
    Person("lead", "Deniz", "Ürün sorumlusu", null),
    Person("design", "Ece", "Tasarım", "lead"),
    Person("mobile", "Kerem", "Mobil", "lead"),
    Person("web", "Mert", "Web", "lead"),
    Person("ui", "Selin", "Arayüz", "design"),
    Person("research", "Bora", "Araştırma", "design"),
    Person("android", "Aslı", "Android", "mobile"),
    Person("ios", "Can", "iOS", "mobile"),
    Person("frontend", "Defne", "Ön yüz", "web")
)

private val PERSON = DpSize(132.dp, 52.dp)

private class Person(
    val id: String,
    val name: String,
    val role: String,
    val lead: String?
)
```

### Katmanlar ve oklar

Bir sürümün adımları: kimi adıma iki adımdan bağ gelir, bu yüzden grafik katmanlara dizilir ve uçları oklu bağlarla; derlemeden imzaya giden bağ testlerin katmanından geçer. Bağın biçimi seçilir; yakınlaştırma düğmeleri grafiğin üstündeki `PantrixGraphZoom`'dadır. Döngüyü kapatan bir bağın nasıl çizildiği "Tanılama" sayfasındadır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.graph.GraphLink
import com.pantrixui.components.data.graph.GraphLinkShape
import com.pantrixui.components.data.graph.GraphNode
import com.pantrixui.components.data.graph.GraphStyle
import com.pantrixui.components.data.graph.PantrixGraph
import com.pantrixui.components.data.graph.PantrixGraphZoom
import com.pantrixui.components.data.graph.rememberGraphState
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var shape by remember { mutableStateOf(GraphLinkShape.Curve) }
val graph = rememberGraphState()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = LINK_SHAPES.map { (name, value) -> SegmentOption(value, name, tagKey = name.lowercase()) },
        selected = shape,
        onSelect = { shape = it },
        fullWidth = false,
        tagKey = "shape"
    )
    PantrixGraphZoom(state = graph, tagKey = "pipeline")
    PantrixGraph(
        nodes = STEPS.map { (id, label) -> GraphNode(key = id, label = label, size = STEP) },
        links = STEP_LINKS,
        modifier = Modifier.fillMaxWidth().height(320.dp),
        state = graph,
        zoomButtons = false,
        style = GraphStyle(linkShape = shape, arrowSize = 7.dp, layerGap = 56.dp),
        tagKey = "pipeline"
    ) { node -> PantrixText(text = node.label, modifier = Modifier.padding(10.dp)) }
}

private val STEPS = listOf(
    "code" to "Kod",
    "build" to "Derleme",
    "unit" to "Birim testleri",
    "ui" to "Arayüz testleri",
    "sign" to "İmza",
    "release" to "Yayın"
)

private val STEP_LINKS = listOf(
    GraphLink("code", "build"),
    GraphLink("build", "unit"),
    GraphLink("build", "ui"),
    GraphLink("unit", "sign"),
    GraphLink("ui", "sign"),
    GraphLink("build", "sign", "paket"),
    GraphLink("sign", "release")
)

private val STEP = DpSize(128.dp, 40.dp)

private val LINK_SHAPES = listOf(
    "Eğri" to GraphLinkShape.Curve,
    "Dik" to GraphLinkShape.Elbow,
    "Düz" to GraphLinkShape.Straight
)
```

### Binlerce kart

Bin beş yüz kart: yalnızca görünenler ve kenarlarındakiler oluşturulur, yerleşim ana iş parçacığının dışında hesaplanır. Grafik açılırken sığdırılır; düğme rastgele bir kartı seçer ve görünüme getirir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.graph.GraphLink
import com.pantrixui.components.data.graph.GraphNode
import com.pantrixui.components.data.graph.PantrixGraph
import com.pantrixui.components.data.graph.rememberGraphState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val graph = rememberGraphState()
var chosen by remember { mutableStateOf<String?>(null) }
LaunchedEffect(Unit) { graph.fit() }
chosen?.let { key -> LaunchedEffect(key) { graph.bringIntoView(key) } }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Rastgele bir karta git",
        onClick = { chosen = LARGE_NODES.random().key },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "random"
    )
    PantrixGraph(
        nodes = LARGE_NODES,
        links = LARGE_LINKS,
        modifier = Modifier.fillMaxWidth().height(360.dp),
        state = graph,
        selectedKey = chosen,
        onSelect = { chosen = it },
        tagKey = "large"
    ) { node -> PantrixText(text = node.label, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) }
}

private val LARGE_NODES = List(LARGE) { GraphNode(key = "k$it", label = "Kart $it", size = DpSize(96.dp, 32.dp)) }

private val LARGE_LINKS = List(LARGE - 1) { GraphLink(from = "k${it / 3}", to = "k${it + 1}") }

private const val LARGE = 1500
```

### Kendi renkleri ve ölçülen kartlar

Kendi renkleri, düz zemini ve dik açılı bağlarıyla bir grafik; kartlarının boyutu verilmemiştir, her biri içeriği kadar ölçülür. Kart kendi kapatma düğmesini `toggle()` ile kurar: kapalıyken kaç çocuğu olduğunu yazar, klavye üstündeyken kenarına bir işaret koyar.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.graph.GraphColors
import com.pantrixui.components.data.graph.GraphGround
import com.pantrixui.components.data.graph.GraphLink
import com.pantrixui.components.data.graph.GraphLinkShape
import com.pantrixui.components.data.graph.GraphNode
import com.pantrixui.components.data.graph.GraphStyle
import com.pantrixui.components.data.graph.PantrixGraph
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var open by remember { mutableStateOf(setOf("pantrix", "foundation", "components")) }
val colors = PantrixTheme.colors
PantrixGraph(
    nodes = MODULES.map { (id, _) -> GraphNode(key = id, label = id.replaceFirstChar { it.uppercase() }) },
    links = MODULES.mapNotNull { (id, parent) -> parent?.let { GraphLink(from = it, to = id) } },
    modifier = Modifier.fillMaxWidth().height(300.dp),
    expanded = open,
    onExpandedChange = { open = it },
    ground = GraphGround.Plain,
    style = GraphStyle(linkShape = GraphLinkShape.Elbow, layerGap = 48.dp),
    colors = GraphColors(
        ground = colors.info.container,
        node = colors.surface,
        border = colors.info.color,
        link = colors.info.color,
        linkLabel = colors.info.onContainer
    ),
    tagKey = "modules"
) { node ->
    val children = MODULES.count { it.second == node.key }
    Row(modifier = Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = if (focused) "▸ ${node.label}" else node.label)
        if (hasChildren) {
            PantrixButton(
                text = if (expanded) "Kapat" else "Aç ($children)",
                onClick = { toggle() },
                variant = ButtonVariant.Text,
                size = ButtonSize.ExtraSmall,
                tagKey = "toggle_${node.key}"
            )
        }
    }
}

private val MODULES = listOf(
    "pantrix" to null,
    "foundation" to "pantrix",
    "components" to "pantrix",
    "testing" to "pantrix",
    "theme" to "foundation",
    "tokens" to "foundation",
    "a11y" to "foundation",
    "elements" to "components",
    "data" to "components",
    "chart" to "components"
)
```

## API

### PantrixGraph

`import com.pantrixui.components.data.graph.PantrixGraph`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixGraph(
    nodes: List<GraphNode>,
    links: List<GraphLink>,
    modifier: Modifier = Modifier,
    state: GraphState = rememberGraphState(),
    direction: GraphDirection = GraphDirection.StartToEnd,
    selectedKey: String? = null,
    onSelect: ((String) -> Unit)? = null,
    expanded: Set<String>? = null,
    onExpandedChange: ((Set<String>) -> Unit)? = null,
    ground: GraphGround = GraphGround.Dots,
    zoomButtons: Boolean = true,
    style: GraphStyle? = null,
    colors: GraphColors? = null,
    tagKey: String? = null,
    node: @Composable GraphNodeScope.(GraphNode) -> Unit
)
```

Düğümler ve aralarındaki bağlar; onları grafik kendisi yerleştirir, elle kaydırılan ve yakınlaştırılan bir zeminde: bir belgenin yapısı, bir örgüt, neyin neye bağlı olduğu.

**Ne çizdiği.** Her düğüm bir karttır; kartın içi `node`'undur ve grafiğin verdiği bir çerçevenin içinde çizilir: dolgusu, kenarı, gölgesi, seçili kartın daha kalın kenarı ve tuşların üstünde olduğu kartın halkası. `GraphNode.size`'ı olan bir düğüm kompoze edilmeden yerleşir ve yalnızca görünürken kompoze edilir; binlerce kartlık bir grafik bunu ister. Boyutu olmayan bir düğüm içeriğinin istediği kadar ölçülür, büyüdükçe ya da küçüldükçe yeniden. Her bağ geldiği karttan gittiği karta çizilir; etiketi gittiği kartın yanında, bağın üstündedir.

**Nasıl yerleştiği.** Her düğüm, kendisine bağlanan düğümlerden sonraki bir katmanda durur, `direction`'ın yönünde: baştan sona, Arapçada aynalanarak, ya da yukarıdan aşağı. Hiçbir düğüme iki bağ gelmiyorsa grafik bir ağaçtır: her ebeveyn çocuklarının ortasının karşısında, her alt ağaç bir öncekine sınırlarının el verdiği kadar yakın. Gelen varsa düğümler katmanlara dizilir, her katmanda bağların en az kesiştiği sırayla; katman atlayan bir bağ o katmanlardan kartlarının yanından geçer. Bir döngüyü kapatan bağ kesik çizgiyle, geriye çizilir ve hiçbir şeyi yerleştirmez; temanın tanılaması onu `PantrixCheck.GraphCycle` olarak bildirir.

**Seçmek ve kapatmak.** Hangi kartın seçili olduğu, bir listenin seçimi gibi çağıranındır: `selectedKey`'i verin ve `onSelect`'e göre davranın. Açık kartlar da öyle: `expanded`'ı verin ve `onExpandedChange`'e göre davranın; kapalı bir kart, bağlarının götürdüğünü gizler, onu başka açık bir kart göstermiyorsa. Bunlar verilmezse her kart açıktır ve hiçbiri kapanmaz. Bir kartın `GraphFoldButton`'ı onu kapatır ve açar. Açık kartlar değişirken kartlar temanın hareketiyle yeni yerlerine kayar; değişikliğin geldiği kart, ya da yoksa seçili kart, ekranda yerinde kalır.

**Kaydırmak ve yakınlaştırmak.** Fareyle de parmakla da sürükleme zemini beraberinde götürür; tekerlek ve dokunmatik yüzey onu kaydırır, o yönde daha gidemeyince durduğu sayfayı; tekerlekle Ctrl ya da Mac'te Command, dokunmatik yüzeyin kıstırması ve iki parmak, bulundukları yerin çevresinde yakınlaştırır. Zemin kenarından öteye, kartların çevresindeki stilin boşluğuyla birlikte, gitmez; görünüme sığdığı bir yönde de kaymaz. `state`'i ne kadar yakından bakıldığını ve nereye kaydırıldığını tutar; bir ekranın kendi düğmeleri için yakınlaştırır, uzaklaştırır, hepsini ya da bir kartı gösterir. Grafiğin kendi düğmeleri, `zoomButtons` false değilse köşesinde durur.

**Klavyeyle** grafik Tab için tek bir duraktır. Tuşlar en son üstünde oldukları kartta, yoksa seçili kartta ya da ilk kartta olur. Grafiğin yönünü gösteren ok bir kartın ilk çocuğuna gider, kapalı bir kartı önce açar; geriyi gösteren ok ebeveynine gider, açık bir kartı önce kapatır; çapraz iki ok katmanındaki yanındaki kartlara gider. Home ve End okuyucunun vardığı ilk ve son karta gider; Enter ve Boşluk kartı seçer; artı ve eksi yakınlaştırır ve uzaklaştırır, sıfır grafiği görünümüne sığdırır. Tuşların gittiği kart görünüme getirilir.

**Ekran okuyucu için** her kart düğümünün etiketi, seçili olup olmadığı, açık ya da kapalı olduğu, kardeşleri arasındaki yeri ve düzeyidir; okuyucunun grafiği dolaştığı sırayla: ilk kökünden derinlemesine. Ona seçilmek, açılmak ya da kapanmak sunulur. Görünürdeki son karta varan okuyucuya, bir listenin kayması gibi, sonraki kartlar getirilir.

```kotlin
var chosen by remember { mutableStateOf("$") }
var open by remember { mutableStateOf(setOf("$", "customer")) }
PantrixGraph(
    nodes = cards,
    links = links,
    modifier = Modifier.fillMaxSize(),
    selectedKey = chosen,
    onSelect = { chosen = it },
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "document"
) { node ->
    Row(Modifier.fillMaxHeight().padding(start = 10.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = node.label, modifier = Modifier.weight(1f))
        GraphFoldButton()
    }
}
```

Parametreler:

- `nodes: List<GraphNode>`: grafiğin düğümleri. İkisinin anahtarı aynı olmaz.
- `links: List<GraphLink>`: aralarındaki bağlar, düğümlerin anahtarlarıyla. Hiçbir düğümün sahip olmadığı bir anahtara giden bağ reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Grafik kendisine verilen alanı doldurur ve buna ihtiyacı vardır: sınırı olmayan bir alanda, başladığı yakınlıkta kartları kadar büyüktür.
- `state: GraphState`: grafiğin nereye kaydırıldığı ve ne kadar yakından bakıldığı.
- `direction: GraphDirection`: grafiğin bir düğümden çocuklarına hangi yöne gittiği.
- `selectedKey: String?`: seçili kartın anahtarı, ya da hiçbiri için null.
- `onSelect: ((String) -> Unit)?`: bir basışın ya da bir tuşun seçtiği kartın anahtarıyla çağrılır. Null: grafik hiçbir kartı seçmez.
- `expanded: Set<String>?`: açık kartların anahtarları, ya da kapanmayan bir grafik için null: her kart açık.
- `onExpandedChange: ((Set<String>) -> Unit)?`: bir kart açıldıktan ya da kapandıktan sonra açık olacak anahtarlarla çağrılır. Grafik kendiliğinden hiçbir şeyi değiştirmez.
- `ground: GraphGround`: zeminin kartların arkasında ne gösterdiği.
- `zoomButtons: Boolean`: grafiğin kendi yakınlaştırma düğmelerinin, bir `PantrixGraphZoom`, sondaki alt köşesinde durup durmadığı.
- `style: GraphStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde ve yoğunluğun altında. Her platformda yalnızca belirlediği alanlar değişir.
- `colors: GraphColors?`: bu grafiğin, temanınkiler olmadığı yerlerdeki kendi renkleri: burada belirlenenler, gerisi için temanınkiler.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `Graph_<tagKey>`, içindeki bir kart `Graph_<tagKey>.Node_<key>` olur; düğümün kendi etiket anahtarı varsa onunla. Bir basışın ya da tuşun yaptığı bir `Graph` olayı olarak bildirilir: düğümün anahtarıyla `select`, `expand` ve `collapse`, tuşların götürdüğü yerle `zoom`: `in`, `out` ya da `fit`.
- `node: @Composable GraphNodeScope.(GraphNode) -> Unit`: bir kartın düğümü için, grafiğin verdiği çerçevenin içinde ne gösterdiği.

### GraphNode

`import com.pantrixui.components.data.graph.GraphNode`, `com.pantrixui:components` içinden

```kotlin
class GraphNode(
    public val key: String,
    public val label: String,
    public val size: DpSize = DpSize.Unspecified,
    public val tagKey: String? = null
)
```

Bir `PantrixGraph` kartı: grafiğin yerleştirdiği, bağladığı ve okuyucunun seçmesine izin verdiği. Kartın gösterdiği, grafiğin `node` içeriğidir; bu düğüm için, grafiğin verdiği çerçevenin içinde çizilir.

```kotlin
// A card as tall as its head and its rows, so the graph lays it out without composing it.
GraphNode(key = "$.customer", label = "customer, 4 keys", size = DpSize(200.dp, 32.dp + 24.dp * 4))
```

Parametreler:

- `key: String`: Düğümün neyle tanındığı: bağları, seçili anahtar ve açık olanlar onu bununla anar. Bir grafiğin iki düğümünün anahtarı aynı olmaz.
- `label: String`: Ekran okuyucunun kart için söylediği; bulgularının ve olaylarının da andığı. Kartın çizdiği göz içindir: ekran okuyucu kartı tek bir şey olarak duyar, bu yüzden etiket kartta önemli olanı söyler.
- `size: DpSize`: Kartın ne kadar büyük olduğu. Verilirse grafik kartı kompoze etmeden yerleştirir ve yalnızca görünürken kompoze eder; binlerce kartlık bir grafik bunu ister. Varsayılan `DpSize.Unspecified`, grafiğe kartın içeriğini istediği kadar büyük, büyüdüğünde ya da küçüldüğünde yeniden ölçtürür: böyle bir kart, görünürde olsun olmasın gösterildiği sürece kompoze edilir; bu onlarca kartlık bir grafiğe uyar, binlercesine değil.
- `tagKey: String?`: Kartın kendi otomasyon anahtarı, `key`'i bir testin anması gereken bir anahtar değilse: kart `Graph_<tagKey>.Node_<düğümün tagKey'i>` olur.

### GraphLink

`import com.pantrixui.components.data.graph.GraphLink`, `com.pantrixui:components` içinden

```kotlin
class GraphLink(
    public val from: String,
    public val to: String,
    public val label: String? = null
)
```

Bir `PantrixGraph` bağı, bir düğümden ötekine: düğümleri yerleştiren, geldiği `from`'u gittiği `to`'dan önce koyan ve aralarına çizilen.

Bir döngüyü kapatan bağ, grafiğin `from`'dan önce yerleştirdiği bir düğüme geri giden, geriye çizilir ve hiçbir şeyi yerleştirmez.

Parametreler:

- `from: String`: Bağın geldiği düğümün anahtarı: bir ağaçta ebeveyn.
- `to: String`: Bağın gittiği düğümün anahtarı: bir ağaçta çocuk.
- `label: String?`: `to`'nun kartının yanına, bağın üstüne yazılan: bir anahtar, bir sıra, bir ilişkinin adı. Hiçbiri için null.

### GraphDirection

`import com.pantrixui.components.data.graph.GraphDirection`, `com.pantrixui:components` içinden

```kotlin
enum class GraphDirection
```

Bir `PantrixGraph`'ın bir düğümden bağlandığı düğümlere hangi yöne gittiği.

Değerleri:

- `StartToEnd`: Satırların başladığı yandan bittiği yana: bir düğümün çocukları ondan sonra durur; öyle yazılan bir dilde soldan sağa, Arapçada sağdan sola. Geniş bir görünüm için, bir masaüstününki ya da bir tabletinki.
- `TopToBottom`: Yukarıdan aşağı: bir düğümün çocukları onun altında durur. Dar bir görünüm için, bir telefonunki.

### GraphGround

`import com.pantrixui.components.data.graph.GraphGround`, `com.pantrixui:components` içinden

```kotlin
enum class GraphGround
```

Bir `PantrixGraph`'ın zemininin kartlarının arkasında ne gösterdiği.

Değerleri:

- `Dots`: Temanın bölücü renginde, kartlarla birlikte kayan ve büyüyen ince noktalardan bir ızgara. Varsayılan.
- `Plain`: Yalnızca zeminin rengi.

### GraphLinkShape

`import com.pantrixui.components.data.graph.GraphLinkShape`, `com.pantrixui:components` içinden

```kotlin
enum class GraphLinkShape
```

Bir `PantrixGraph`'ın iki kart arasındaki bağı nasıl çizdiği.

Değerleri:

- `Curve`: Bir karttan çıkıp ötekine grafiğin yönünde gelen yumuşak bir eğri.
- `Elbow`: Dik açılı, köşeleri yuvarlatılmış düz çizgiler: bir organizasyon şemasınınki gibi.
- `Straight`: Bir karttan ötekine düz bir çizgi.

### GraphStyle

`import com.pantrixui.components.data.graph.GraphStyle`, `com.pantrixui:components` içinden

```kotlin
class GraphStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val selectedBorderWidth: Dp = Dp.Unspecified,
    public val layerGap: Dp = Dp.Unspecified,
    public val siblingGap: Dp = Dp.Unspecified,
    public val contentPadding: Dp = Dp.Unspecified,
    public val linkWidth: Dp = Dp.Unspecified,
    public val linkShape: GraphLinkShape? = null,
    public val arrowSize: Dp = Dp.Unspecified,
    public val dotSpacing: Dp = Dp.Unspecified,
    public val dotSize: Dp = Dp.Unspecified,
    public val zoomPadding: Dp = Dp.Unspecified,
    public val labelRole: TypeRole? = null
) : PantrixStyle<GraphStyle>
```

`PantrixGraph`'ın geometrisi: kartlarının çerçeveleri, katmanları ve kartları arasındaki boşluk, bağları ve zemini.

Parametreler:

- `shape: ShapeSpec`: Bir kartın biçimi: `ShapeRole.Medium`.
- `elevation: Dp`: Bir kartın gölgesiyle zeminden ne kadar yüksekte durduğu: kartların düz yattığı iOS'ta hiç.
- `borderWidth: Dp`: Bir kartın çevresindeki kenarın ne kadar kalın olduğu.
- `selectedBorderWidth: Dp`: Seçili kartın çevresindeki, onu işaretleyen renkteki kenarın ne kadar kalın olduğu.
- `layerGap: Dp`: İki katman arasındaki, grafiğin yönündeki boşluk; bağlar onu geçer, etiketleri ona yazılır.
- `siblingGap: Dp`: Bir katmanın iki kartı arasındaki ve iki alt ağaç arasındaki boşluk.
- `contentPadding: Dp`: Grafik görünümüne sığdırıldığında ya da bir ucuna kaydırıldığında kartların çevresindeki, onlarla zeminin kenarı arasındaki boşluk.
- `linkWidth: Dp`: Bir bağın ne kadar kalın çizildiği.
- `linkShape: GraphLinkShape?`: Bir bağın nasıl çizildiği: `GraphLinkShape.Curve`.
- `arrowSize: Dp`: Bir bağın ucundaki, gittiği düğümü gösteren okun ne kadar uzun olduğu: hiç, bir ağacın bağlarının buna ihtiyacı olmadığı için. Bağları iki katman arasında iki yöne de giden bir grafik yönü bir okla gösterir.
- `dotSpacing: Dp`: `GraphGround.Dots`'un noktalarının, grafiğin kendi boyutunda, ne kadar aralıklı durduğu: grafikle birlikte büyür ve küçülürler; bunun yarısından yakın duracakları yerde iki kat aralıklı çizilirler.
- `dotSize: Dp`: Zeminin bir noktasının ne kadar geniş olduğu.
- `zoomPadding: Dp`: Grafiğin kendi yakınlaştırma düğmelerinin görünümünün köşesinden ne kadar uzakta durduğu.
- `labelRole: TypeRole?`: Bir bağın etiketinin yazıldığı yazı: `TypeRole.Caption`.

### GraphColors

`import com.pantrixui.components.data.graph.GraphColors`, `com.pantrixui:components` içinden

```kotlin
data class GraphColors(
    public val ground: Color = Color.Unspecified,
    public val dots: Color = Color.Unspecified,
    public val node: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val selectedBorder: Color = Color.Unspecified,
    public val link: Color = Color.Unspecified,
    public val linkLabel: Color = Color.Unspecified,
    public val focusRing: Color = Color.Unspecified
)
```

Bir `PantrixGraph`'ın, temanın renklerini almadığı yerde neyle boyandığı: belirlenen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// The chosen card marked in the success role, the rest as the theme has it.
PantrixGraph(…, colors = GraphColors(selectedBorder = PantrixTheme.colors.success.color))
```

Parametreler:

- `ground: Color`: Kartların arkasındaki dolgu: temanın `background`'u, kartların olduğu `surface`'tan bir adım uzak.
- `dots: Color`: `GraphGround.Dots`'un noktaları: temanın `divider`'ı.
- `node: Color`: Bir kartın dolgusu: temanın `surface`'ı.
- `content: Color`: Bir kartın içeriğinin, kendi rengini belirlemediği yerde yazıldığı renk: `node`'un üstünde okunan, temanın kendi yüzeyinde `textPrimary`'si.
- `border: Color`: Bir kartın çevresindeki kenar: temanın `border`'ı.
- `selectedBorder: Color`: Seçili kartın çevresindeki, onu işaretleyen kenar: birincil rolün rengi.
- `link: Color`: Bir bağ: temanın `textDisabled`'ı, birleştirdiği kartlardan daha sessiz.
- `linkLabel: Color`: Bir bağın etiketi, bağın üstünde bir parça `ground`'a yazılır: temanın `textSecondary`'si.
- `focusRing: Color`: Tuşların üstünde olduğu kartın çevresindeki halka: temanın `focusRing`'i.

### GraphState

`import com.pantrixui.components.data.graph.GraphState`, `com.pantrixui:components` içinden

```kotlin
class GraphState(
    initialZoom: Float = 1f,
    @Suppress("MagicNumber")
    public val zoomRange: ClosedFloatingPointRange<Float> = 0.25f..2f
)
```

Bir `PantrixGraph`'ın bir kompozisyondan ötekine tuttukları, onu okuyan ya da kaydıran bir ekran için: grafiğe ne kadar yakından bakıldığı, nereye kaydırıldığı; yakınlaştırmanın, uzaklaştırmanın, hepsine ya da bir karta bakmanın yolu.

```kotlin
val graph = rememberGraphState(initialZoom = 0.7f)
PantrixGraph(nodes = cards, links = links, state = graph) { node -> Card(node) }
// The card the reader chose in the text, brought into view once the graph shows it.
LaunchedEffect(chosen) { graph.bringIntoView(chosen) }
PantrixText(text = "${(graph.zoom * 100).roundToInt()}%")
```

Bir durum bir grafiğindir: aynı durumu alan iki grafik birbirini kaydırır.

Parametreler:

- `initialZoom: Float`: grafik ilk gösterildiğinde ona ne kadar yakından bakıldığı: bir, kendi boyutudur.
- `zoomRange: ClosedFloatingPointRange<Float>`: Grafiğe ne kadar uzaktan ve ne kadar yakından bakılabildiği: varsayılan olarak boyutunun dörtte birinden iki katına kadar.

Üyeleri:

- `zoom: Float`: Grafiğe ne kadar yakından bakıldığı: bir kendi boyutu, yarım onun yarısıdır.
- `canZoomIn: Boolean`: Grafiğe şimdikinden daha yakından bakılıp bakılamayacağı.
- `canZoomOut: Boolean`: Ona şimdikinden daha uzaktan bakılıp bakılamayacağı.
- `fun zoomIn()`: Görünümün ortası çevresinde, `zoomRange`'in izin verdiği kadar bir adım yakınlaştırır.
- `fun zoomOut()`: Görünümün ortası çevresinde, `zoomRange`'in izin verdiği kadar bir adım uzaklaştırır.
- `fun zoomTo(zoom: Float)`: Grafiğe, görünümün ortası çevresinde, `zoomRange` içinde, boyutunun `zoom` katıyla bakar.
- `fun fit()`: Gösterilen kartları çevrelerindeki boşlukla görünüme sığdırır ve ortasına koyar: görünümünden büyük bir grafiğe, `zoomRange` içinde, bunun gerektirdiği kadar uzaktan, daha küçüğüne kendi boyutunda bakılır. Grafik yerleşmeden istenirse yerleşince yapılır.
- `suspend fun bringIntoView(key: String)`: `key`'in kartını, kartların çevresindeki boşlukla, kısa yoldan ve gerektiğinden öteye gitmeden, temanın hareketiyle kayarak görünüme getirir: görünürdeki bir kart yerinde kalır, görünümden büyük olanın başı gösterilir. Gösterilmeyen bir düğüm için, kapalı bir düğümün altındaki gibi, bir şey olmaz.

  Aynı anda açılarak gösterilen bir kart, grafik onunla yerleşince gösterilir: bir ekran onu o değişikliğin bir etkisinden görünüme getirir, `LaunchedEffect(key) { state.bringIntoView(key) }` gibi. Grafik yerleşmeden istenirse bunu bekler.

### rememberGraphState

`import com.pantrixui.components.data.graph.rememberGraphState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberGraphState(
    initialZoom: Float = 1f,
    zoomRange: ClosedFloatingPointRange<Float> = 0.25f..2f
): GraphState
```

Kaydedilen bir durumun korunduğu şeyler boyunca korunan bir `GraphState`: ekranın dönmesi, başka bir ekrana gidip dönmek.

Parametreler:

- `initialZoom: Float`: grafik ilk gösterildiğinde ona ne kadar yakından bakıldığı: bir, kendi boyutudur.
- `zoomRange: ClosedFloatingPointRange<Float>`: grafiğe ne kadar uzaktan ve ne kadar yakından bakılabildiği: varsayılan olarak boyutunun dörtte birinden iki katına kadar.

### GraphNodeScope

`import com.pantrixui.components.data.graph.GraphNodeScope`, `com.pantrixui:components` içinden

```kotlin
interface GraphNodeScope
```

Bir `PantrixGraph` kartının, içeriği çizilirken kendisi hakkında bildikleri: seçili olup olmadığı, tuşların üstünde olup olmadığı ve bağlarının götürdüğünün gösterilip gösterilmediği; onu göstermenin ya da gizlemenin yoluyla.

```kotlin
PantrixGraph(…) { node ->
    Row(Modifier.fillMaxHeight(), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = node.label, modifier = Modifier.weight(1f))
        GraphFoldButton()
    }
}
```

Üyeleri:

- `selected: Boolean`: Kartın, kenarının işaretlediği, grafiğin seçili kartı olup olmadığı: bir kart başını da işaretleyebilir.
- `focused: Boolean`: Tuşların kartta olup olmadığı: odak grafikte, oklar da bu karttan devam eder.
- `expanded: Boolean`: Kartın bağlarının götürdüğünün gösterilip gösterilmediği. Grafiğin kapanmasına izin vermediği bir kart hep açıktır.
- `hasChildren: Boolean`: Kartın, kendisinden sonra düğüm yerleştiren bağları olup olmadığı; kartı kapatmak onları gizler.
- `fun toggle()`: Açıksa kartı kapatır, kapalıysa açar: grafiğin `onExpandedChange`'ine açık olacak anahtarları söyler. Çocuğu olmayan bir kartta ya da kapanmayan bir grafikte bir şey olmaz.

### GraphNodeScope.GraphFoldButton

`import com.pantrixui.components.data.graph.GraphFoldButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun GraphNodeScope.GraphFoldButton(modifier: Modifier = Modifier)
```

Bir `PantrixGraph` kartını kapatan ve yeniden açan düğme, kartın başı için: kart kapalıyken grafiğin yönünde ileriyi, açıkken dönüp aşağıyı, gösterdiğini gösteren bir ok. Çocuğu olmayan ya da kapanmayan bir grafikteki bir kartın düğmesi olmaz.

Ona basmak kartı seçmeden açar ya da kapatır. İşaretçi ve parmak için çizilir: tuşlar ve ekran okuyucu kartın kendisini açar ve kapatır, ona bu sunulur; bu yüzden düğme bir Tab durağı değildir, okunmaz ve kendi etiketi yoktur. Yaptığı, grafiğin `expand`'i ya da `collapse`'ı olarak bildirilir.

Parametreler:

- `modifier: Modifier`: düğmenin modifier'ı: kartın başında nerede durduğu.

### PantrixGraphZoom

`import com.pantrixui.components.data.graph.PantrixGraphZoom`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixGraphZoom(
    state: GraphState,
    modifier: Modifier = Modifier,
    tagKey: String? = null
)
```

Bir `PantrixGraph`'a daha uzaktan, daha yakından ve hepsine bakan düğmeler, aralarında ona ne kadar yakından bakıldığıyla, bir ekranın kendi araç çubuğu için: paylaştıkları, grafiğin `state`'idir. Bir grafik, çağrısı bunu kapatmadıkça aynı satırı kendi köşesine çizer.

```kotlin
val graph = rememberGraphState()
Row { PantrixGraphZoom(state = graph, tagKey = "document") }
PantrixGraph(nodes = cards, links = links, state = graph, zoomButtons = false) { node -> Card(node) }
```

Yapacak bir şeyi olmayan bir düğme, durumun izin verdiği en yakında yakınlaştıran düğme gibi, soluk çizilir ve bir şey yapmaz. Yüzde, temanın dilinin yazdığı gibi yazılır.

Parametreler:

- `state: GraphState`: düğmelerin hareket ettirdiği grafiğin durumu.
- `modifier: Modifier`: satırın modifier'ı.
- `tagKey: String?`: satırın otomasyon anahtarı: satır `GraphZoom_<tagKey>` olur, düğmeleri `TestScope(tagKey)` içinde durur: `IconButton_zoom_out`, `IconButton_zoom_in` ve `IconButton_fit`; simge düğmeleri gibi bildirilirler.

### expandedToLevel

`import com.pantrixui.components.data.graph.expandedToLevel`, `com.pantrixui:components` içinden

```kotlin
fun expandedToLevel(
    nodes: List<GraphNode>,
    links: List<GraphLink>,
    level: Int
): Set<String>
```

Bir `PantrixGraph`'ın düğümlerini köklerinden `level` bağ aşağıya kadar göstermesi için açılacak düğümlerin anahtarları: `level` katmandan daha az aşağıda duran ve kendisinden sonraki katmanı gösteren her düğüm. Sıfır hiçbirini açmaz ve yalnızca kökleri gösterir; bir kökleri açar; en derin düğümü aşan bir düzey hepsini açar. "Open to 1, 2, 3, All"ın belirlediği.

```kotlin
PantrixButton(text = "2", onClick = { open = expandedToLevel(cards, links, level = 2) })
```

Parametreler:

- `nodes: List<GraphNode>`: grafiğin düğümleri, ona verildiği gibi.
- `links: List<GraphLink>`: bağları, ona verildiği gibi.
- `level: Int`: köklerden sonra kaç katmanın gösterileceği.
