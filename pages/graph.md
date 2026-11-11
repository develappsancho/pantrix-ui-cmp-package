# Graph

Nodes and the links between them, as cards: a document's structure, a team, the steps of a job. The graph finds the cards' places itself; the ground is dragged and zoomed.

- `PantrixGraph` (`com.pantrixui.components.data.graph`, `com.pantrixui:components`): Nodes and the links between them, laid out by the graph as a tree or in layers, on a ground that is dragged and zoomed: cards the app draws, chosen, closed and walked with the keys. Keywords: graph, diagram, node graph, tree diagram, org chart, flowchart, mind map, dag, pan and zoom, canvas, links, edges.

## Features

- **Layout.** Where no node has two links coming to it, the graph is a tree: each parent across from the middle of its children, each subtree as close to the one before it as their outlines allow. Where one has, it is laid out in layers, in the order that crosses the fewest links. A link that closes a circle is drawn backwards, in dashes, and the diagnostics report it.
- **Direction.** `GraphDirection.StartToEnd` from the start to the end (right to left in Arabic), `TopToBottom` from the top down.
- **Card.** The frame is the graph's, the inside the app's: `GraphNodeScope` says whether the card is chosen, focused or open. A card given a size is laid out without being composed, and composed only while in view; one without is measured once.
- **Choosing and closing.** The chosen card and the open ones are the app's (`selectedKey`, `expanded`). `GraphFoldButton` closes a card and opens it; `expandedToLevel` opens the cards to a level. The cards glide to their new places; the card that was pressed stays where it is on the screen.
- **Moving.** A drag, the wheel and two fingers; the wheel with Ctrl or ⌘ zooms. `GraphState` zooms, fits and brings a card into view; `PantrixGraphZoom` puts the same buttons where the screen wants them.
- **Keyboard and screen reader.** The arrows go from card to card the way the graph goes, Enter chooses, + and − zoom, 0 fits. A screen reader reads a card by its name, its place among its siblings and its level, in the tree's order.
- **Automation.** With `tagKey` the graph is `Graph_<tagKey>`, and its cards `Graph_<tagKey>.Node_<key>`.

## Usage

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

## Examples

### A document's structure

An order's structure, each object and array a card: its name and its count in its head, its values of one line in its rows. An object or an array inside it is a card of its own, linked to it by its key or its index. The chosen card's head is filled; the level buttons open the cards with `expandedToLevel`, and a card's chevron closes it.

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

private val LEVELS = listOf("1" to 1, "2" to 2, "3" to 3, "All" to Int.MAX_VALUE)

private class DocumentCard(
    val id: String,
    val title: String,
    val count: String,
    val rows: List<Pair<String, String>>
)
```

### From the top down, with buttons of its own

A team from the top down, as on a phone's narrow screen; the zoom buttons stand in the screen's own toolbar, not in the graph's corner: `GraphState` zooms in, zooms out, goes back to 100% and fits.

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
            contentDescription = "Zoom out",
            onClick = graph::zoomOut,
            size = ButtonSize.Small,
            enabled = graph.canZoomOut,
            tagKey = "team_out"
        )
        PantrixText(text = "%${(graph.zoom * 100).roundToInt()}", modifier = Modifier.padding(horizontal = 4.dp))
        PantrixIconButton(
            imageVector = PantrixIcons.ZoomIn,
            contentDescription = "Zoom in",
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
            contentDescription = "Fit",
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
    Person("lead", "Deniz", "Product lead", null),
    Person("design", "Ece", "Design", "lead"),
    Person("mobile", "Kerem", "Mobile", "lead"),
    Person("web", "Mert", "Web", "lead"),
    Person("ui", "Selin", "Interface", "design"),
    Person("research", "Bora", "Research", "design"),
    Person("android", "Aslı", "Android", "mobile"),
    Person("ios", "Can", "iOS", "mobile"),
    Person("frontend", "Defne", "Front end", "web")
)

private val PERSON = DpSize(132.dp, 52.dp)

private class Person(
    val id: String,
    val name: String,
    val role: String,
    val lead: String?
)
```

### Layers and arrows

A release's steps: some steps have links from two steps, so the graph is laid out in layers, its links with heads at their ends; the link from the build to the signing passes through the tests' layer. The links' shape is chosen; the zoom buttons are the `PantrixGraphZoom` over the graph. How a link that closes a circle is drawn is on the "Diagnostics" page.

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
    "code" to "Code",
    "build" to "Build",
    "unit" to "Unit tests",
    "ui" to "UI tests",
    "sign" to "Signing",
    "release" to "Release"
)

private val STEP_LINKS = listOf(
    GraphLink("code", "build"),
    GraphLink("build", "unit"),
    GraphLink("build", "ui"),
    GraphLink("unit", "sign"),
    GraphLink("ui", "sign"),
    GraphLink("build", "sign", "package"),
    GraphLink("sign", "release")
)

private val STEP = DpSize(128.dp, 40.dp)

private val LINK_SHAPES = listOf(
    "Curve" to GraphLinkShape.Curve,
    "Elbow" to GraphLinkShape.Elbow,
    "Straight" to GraphLinkShape.Straight
)
```

### Thousands of cards

Fifteen hundred cards: only those in view and at its edges are composed, and the layout is worked out away from the main thread. The graph is fitted as it opens; the button chooses a card at random and brings it into view.

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
        text = "Go to a card at random",
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

private val LARGE_NODES = List(LARGE) { GraphNode(key = "k$it", label = "Card $it", size = DpSize(96.dp, 32.dp)) }

private val LARGE_LINKS = List(LARGE - 1) { GraphLink(from = "k${it / 3}", to = "k${it + 1}") }

private const val LARGE = 1500
```

### Its own colours, and cards that are measured

A graph with colours of its own, a plain ground and links at right angles; its cards are given no size, and each is measured as large as its content. A card makes its own button that closes it with `toggle()`: closed, it writes how many children it has, and while the keys are on it, it puts a mark at its side.

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
                text = if (expanded) "Close" else "Open ($children)",
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

`import com.pantrixui.components.data.graph.PantrixGraph`, from `com.pantrixui:components`

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

Nodes and the links between them, laid out by the graph itself, on a ground that is moved and looked at closer by hand: a document's structure, an organisation, what depends on what.

**What it draws.** Each node is a card, and what is in the card is `node`'s, drawn for it inside a frame the graph gives it: its fill, its edge, its shadow, the thicker edge of the chosen card and the ring of the one the keys are on. A node that has a `GraphNode.size` is laid out without being composed, and composed only while it is in view, which a graph of thousands of cards needs; one without is measured as large as its content asks, and again as it grows or shrinks. Each link is drawn from the card it comes from to the one it goes to, with its label beside the latter, over the link.

**How it is laid out.** Each node stands in a layer after the nodes that link to it, the way `direction` goes: from the start to the end, mirrored in Arabic, or from the top down. Where no node has two links coming to it, the graph is a tree: each parent across from the middle of its children, and each subtree as close to the one before it as their outlines allow. Where one has, the nodes are laid out in layers, in the order across each that crosses the fewest links, a link that passes layers going through them beside their cards. A link that closes a circle is drawn backwards, in dashes, and lays nothing out; the theme's diagnostics report it as `PantrixCheck.GraphCycle`.

**Choosing and closing.** Which card is chosen is the caller's, as a list's selection is: give `selectedKey` and act on `onSelect`. So are the cards that are open: give `expanded` and act on `onExpandedChange`; a closed card hides what its links lead to, unless another open card shows it. Without them every card is open and none closes. A card's `GraphFoldButton` closes and opens it. While the cards that are open change, they glide to their new places with the theme's motion, and the card the change came from, or else the chosen one, stays where it is on the screen.

**Moving and looking closer.** A drag takes the ground along, a mouse's and a finger's; a wheel and a trackpad move it, and the page it stands in once it can go no further that way; Ctrl or a Mac's Command with a wheel, a trackpad's pinch and two fingers look closer about where they are. The ground goes no further than its edge, with the style's room around the cards, and along a way where it fits the view it does not move. Its `state` holds how close it is looked at and where it is moved to, and looks closer, further off, at all of it or at one card for a screen's own buttons; the graph's own stand in a corner of it unless `zoomButtons` is false.

**With the keyboard** the graph is one stop for Tab. The keys are on the card they were on last, or else the chosen one or the first. The arrow that points the way the graph goes goes on to a card's first child, opening a closed card first; the one that points back goes to its parent, closing an open card first; the two across go to the cards beside it in its layer. Home and End go to the first and the last card a reader reaches; Enter and Space choose the card; plus and minus look closer and further off, and nought fits the graph to its view. A card the keys go to is brought into view.

**To a screen reader** each card is its node's label, whether it is chosen, open or closed, its place among its siblings and its level, in the order a reader goes through the graph: depth first from its first root. It is offered to be chosen, and to be opened or closed. A reader that comes to the last card in view is brought the next ones, as a list scrolls on.

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

Parameters:

- `nodes: List<GraphNode>`: the graph's nodes. No two have one key.
- `links: List<GraphLink>`: the links between them, by the nodes' keys. A link to a key no node has is refused.
- `modifier: Modifier`: the graph's modifier. The graph fills the room it is given, which it needs: in a room without a bound it is as large as its cards at the zoom it starts at.
- `state: GraphState`: where the graph is moved to and how close it is looked at.
- `direction: GraphDirection`: which way the graph goes from a node to its children.
- `selectedKey: String?`: the key of the chosen card, or null for none.
- `onSelect: ((String) -> Unit)?`: called with the key of the card a press or a key chose. Null: no card is chosen by the graph.
- `expanded: Set<String>?`: the keys of the open cards, or null for a graph that does not close: every card open.
- `onExpandedChange: ((Set<String>) -> Unit)?`: called with the keys that are to be open after a card was opened or closed. The graph changes nothing by itself.
- `ground: GraphGround`: what the ground shows behind the cards.
- `zoomButtons: Boolean`: whether the graph's own zoom buttons stand in its lower corner at the end, a `PantrixGraphZoom`.
- `style: GraphStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: GraphColors?`: this graph's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the graph's automation key: the graph is `Graph_<tagKey>` and a card in it `Graph_<tagKey>.Node_<key>`, by its node's own tag key where it has one. What a press or a key does is reported as a `Graph` event: `select`, `expand` and `collapse` with the node's key, and `zoom` with where the keys took it, `in`, `out` or `fit`.
- `node: @Composable GraphNodeScope.(GraphNode) -> Unit`: what a card shows for its node, inside the frame the graph gives it.

### GraphNode

`import com.pantrixui.components.data.graph.GraphNode`, from `com.pantrixui:components`

```kotlin
class GraphNode(
    public val key: String,
    public val label: String,
    public val size: DpSize = DpSize.Unspecified,
    public val tagKey: String? = null
)
```

A card of a `PantrixGraph`: what the graph lays out, links and lets the reader choose. What the card shows is the graph's `node` content, drawn for this node inside the frame the graph gives it.

```kotlin
// A card as tall as its head and its rows, so the graph lays it out without composing it.
GraphNode(key = "$.customer", label = "customer, 4 keys", size = DpSize(200.dp, 32.dp + 24.dp * 4))
```

Parameters:

- `key: String`: What the node is told by: its links, the chosen key and the open ones name it. No two nodes of a graph have one key.
- `label: String`: What a screen reader says for the card, and what its findings and its events name. What the card draws is for the eye: a screen reader hears the card as one thing, so the label says what matters in it.
- `size: DpSize`: How large the card is. Given, the graph lays the card out without composing it, and composes it only while it is in view, which a graph of thousands of cards needs. `DpSize.Unspecified`, the default, has the graph measure the card's content as large as it asks to be, and again where it grows or shrinks: such a card is composed while it is shown, in view or not, which suits a graph of tens of cards and not of thousands.
- `tagKey: String?`: The card's own automation key, where its `key` is not one a test should name: the card is `Graph_<tagKey>.Node_<tagKey of the node>`.

### GraphLink

`import com.pantrixui.components.data.graph.GraphLink`, from `com.pantrixui:components`

```kotlin
class GraphLink(
    public val from: String,
    public val to: String,
    public val label: String? = null
)
```

A link of a `PantrixGraph`, from one node to another: what lays the nodes out, the one it comes `from` before the one it goes `to`, and what is drawn between them.

A link that closes a circle, back to a node the graph has already laid out before `from`, is drawn backwards and lays nothing out.

Parameters:

- `from: String`: The key of the node the link comes from: the parent, in a tree.
- `to: String`: The key of the node the link goes to: the child, in a tree.
- `label: String?`: What is written beside `to`'s card, over the link: a key, an index, the name of a relation. Null for none.

### GraphDirection

`import com.pantrixui.components.data.graph.GraphDirection`, from `com.pantrixui:components`

```kotlin
enum class GraphDirection
```

Which way a `PantrixGraph` goes from a node to the nodes it links to.

Entries:

- `StartToEnd`: From the side lines start at to the side they end at: a node's children stand after it, left to right in a language written so, right to left in Arabic. For a wide view, a desk's or a tablet's.
- `TopToBottom`: From the top down: a node's children stand under it. For a narrow view, a phone's.

### GraphGround

`import com.pantrixui.components.data.graph.GraphGround`, from `com.pantrixui:components`

```kotlin
enum class GraphGround
```

What a `PantrixGraph`'s ground shows behind its cards.

Entries:

- `Dots`: A grid of fine dots in the theme's divider colour, which moves and grows with the cards. The default.
- `Plain`: The ground's colour alone.

### GraphLinkShape

`import com.pantrixui.components.data.graph.GraphLinkShape`, from `com.pantrixui:components`

```kotlin
enum class GraphLinkShape
```

How a `PantrixGraph` draws a link between two cards.

Entries:

- `Curve`: A soft curve that leaves one card and comes to the other along the way the graph goes.
- `Elbow`: Straight lines at right angles, their corners rounded: an organisation chart's.
- `Straight`: A straight line from one card to the other.

### GraphStyle

`import com.pantrixui.components.data.graph.GraphStyle`, from `com.pantrixui:components`

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

`PantrixGraph`'s geometry: its cards' frames, the room between its layers and its cards, its links and its ground.

Parameters:

- `shape: ShapeSpec`: A card's shape: `ShapeRole.Medium`.
- `elevation: Dp`: How high a card stands off the ground, by its shadow: none on iOS, where cards lie flat.
- `borderWidth: Dp`: How wide the edge around a card is.
- `selectedBorderWidth: Dp`: How wide the edge around the chosen card is, in the colour that marks it.
- `layerGap: Dp`: The room between two layers, along the way the graph goes, which the links cross and their labels are written in.
- `siblingGap: Dp`: The room between two cards of one layer, and between two subtrees.
- `contentPadding: Dp`: The room around the cards, between them and the ground's edge, when the graph is fitted to its view or scrolled to an end.
- `linkWidth: Dp`: How wide a link is drawn.
- `linkShape: GraphLinkShape?`: How a link is drawn: `GraphLinkShape.Curve`.
- `arrowSize: Dp`: How long the head at the end of a link is, which points at the node it goes to: none, as a tree's links need none. A graph whose links go both ways between two layers shows which way with one.
- `dotSpacing: Dp`: How far apart the dots of `GraphGround.Dots` stand, at the graph's own size: they grow and shrink with it, and are drawn twice as far apart where they would stand closer than half of it.
- `dotSize: Dp`: How wide a dot of the ground is.
- `zoomPadding: Dp`: How far the graph's own zoom buttons stand from the corner of its view.
- `labelRole: TypeRole?`: The type a link's label is written in: `TypeRole.Caption`.

### GraphColors

`import com.pantrixui.components.data.graph.GraphColors`, from `com.pantrixui:components`

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

What a `PantrixGraph` is painted with, where it does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// The chosen card marked in the success role, the rest as the theme has it.
PantrixGraph(…, colors = GraphColors(selectedBorder = PantrixTheme.colors.success.color))
```

Parameters:

- `ground: Color`: The fill behind the cards: the theme's `background`, a step from the `surface` the cards are.
- `dots: Color`: The dots of `GraphGround.Dots`: the theme's `divider`.
- `node: Color`: A card's fill: the theme's `surface`.
- `content: Color`: What a card's content is written in where it sets no colour of its own: what reads on `node`, the theme's `textPrimary` on its own surface.
- `border: Color`: The edge around a card: the theme's `border`.
- `selectedBorder: Color`: The edge around the chosen card, which marks it: the primary role's colour.
- `link: Color`: A link: the theme's `textDisabled`, quieter than the cards it joins.
- `linkLabel: Color`: A link's label, written on a patch of `ground` over the link: the theme's `textSecondary`.
- `focusRing: Color`: The ring around the card the keys are on: the theme's `focusRing`.

### GraphState

`import com.pantrixui.components.data.graph.GraphState`, from `com.pantrixui:components`

```kotlin
class GraphState(
    initialZoom: Float = 1f,
    @Suppress("MagicNumber")
    public val zoomRange: ClosedFloatingPointRange<Float> = 0.25f..2f
)
```

What a `PantrixGraph` holds from one composition to the next, for a screen that reads it or moves it: how close the graph is looked at, where it is moved to, and the way to look closer, further off, at all of it or at one card.

```kotlin
val graph = rememberGraphState(initialZoom = 0.7f)
PantrixGraph(nodes = cards, links = links, state = graph) { node -> Card(node) }
// The card the reader chose in the text, brought into view once the graph shows it.
LaunchedEffect(chosen) { graph.bringIntoView(chosen) }
PantrixText(text = "${(graph.zoom * 100).roundToInt()}%")
```

One state is one graph's: two graphs given the same one would move each other.

Parameters:

- `initialZoom: Float`: how close the graph is looked at when it is first shown: one is its own size.
- `zoomRange: ClosedFloatingPointRange<Float>`: How far off and how close the graph can be looked at: from a quarter of its size to twice it by default.

Members:

- `zoom: Float`: How close the graph is looked at: one is its own size, a half half of it.
- `canZoomIn: Boolean`: Whether the graph can be looked at closer than it is.
- `canZoomOut: Boolean`: Whether it can be looked at from further off than it is.
- `fun zoomIn()`: Looks a step closer, about the middle of the view, as far as `zoomRange` allows.
- `fun zoomOut()`: Looks a step further off, about the middle of the view, as far as `zoomRange` allows.
- `fun zoomTo(zoom: Float)`: Looks at the graph `zoom` times its size, about the middle of the view, within `zoomRange`.
- `fun fit()`: Fits the shown cards to the view, with the room around them, and sets them in its middle: a graph larger than its view is looked at from as far off as that takes, within `zoomRange`, and a smaller one at its own size. Asked before the graph is laid out, it is done once it is.
- `suspend fun bringIntoView(key: String)`: Brings the card of `key` into view, with the room around the cards, by the shorter way and no further than it has to go, gliding there with the theme's motion: a card in view stays where it is, and one larger than the view shows its start. Nothing happens for a node that is not shown: one under a closed node.

  A card that was opened to in the same moment is shown once the graph has been laid out with it: a screen brings it into view from an effect of that change, as `LaunchedEffect(key) { state.bringIntoView(key) }`. Asked before the graph is laid out, it waits for that.

### rememberGraphState

`import com.pantrixui.components.data.graph.rememberGraphState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberGraphState(
    initialZoom: Float = 1f,
    zoomRange: ClosedFloatingPointRange<Float> = 0.25f..2f
): GraphState
```

A `GraphState` that is kept over what a saved state is kept over: a turn of the screen, a visit to another screen and back.

Parameters:

- `initialZoom: Float`: how close the graph is looked at when it is first shown: one is its own size.
- `zoomRange: ClosedFloatingPointRange<Float>`: how far off and how close the graph can be looked at: from a quarter of its size to twice it by default.

### GraphNodeScope

`import com.pantrixui.components.data.graph.GraphNodeScope`, from `com.pantrixui:components`

```kotlin
interface GraphNodeScope
```

What a card of a `PantrixGraph` knows of itself while its content is drawn: whether it is the chosen one, whether the keys are on it, and whether what its links lead to is shown, with the way to show it or hide it.

```kotlin
PantrixGraph(…) { node ->
    Row(Modifier.fillMaxHeight(), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = node.label, modifier = Modifier.weight(1f))
        GraphFoldButton()
    }
}
```

Members:

- `selected: Boolean`: Whether the card is the graph's chosen one, which its edge marks: a card may mark its head as well.
- `focused: Boolean`: Whether the keys are on the card: the graph has the focus, and the arrows go on from this card.
- `expanded: Boolean`: Whether what the card's links lead to is shown. A card the graph does not let close is always open.
- `hasChildren: Boolean`: Whether the card has links that lay nodes out after it, which closing it hides.
- `fun toggle()`: Closes the card where it is open, and opens it where it is closed: tells the graph's `onExpandedChange` the keys that are to be open. Nothing happens on a card without children, or in a graph that does not fold.

### GraphNodeScope.GraphFoldButton

`import com.pantrixui.components.data.graph.GraphFoldButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun GraphNodeScope.GraphFoldButton(modifier: Modifier = Modifier)
```

The button that closes a card of a `PantrixGraph` and opens it again, for the card's head: a chevron that points on along the way the graph goes while the card is closed, and turns to point down, at what it shows, while it is open. A card without children, or in a graph that does not fold, has none.

A press on it opens or closes the card without choosing it. It is drawn for a pointer and a finger: the keys and a screen reader open and close the card itself, which is offered that, so the button is not a stop of Tab, is not read and has no tag of its own. What it does is reported as the graph's `expand` or `collapse`.

Parameters:

- `modifier: Modifier`: the button's modifier: where it stands in the card's head.

### PantrixGraphZoom

`import com.pantrixui.components.data.graph.PantrixGraphZoom`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixGraphZoom(
    state: GraphState,
    modifier: Modifier = Modifier,
    tagKey: String? = null
)
```

The buttons that look at a `PantrixGraph` from further off, closer, and at all of it, with how close it is looked at between them, for a screen's own toolbar: the graph's `state` is the one they share. A graph draws the same row in a corner of its own unless its call turns that off.

```kotlin
val graph = rememberGraphState()
Row { PantrixGraphZoom(state = graph, tagKey = "document") }
PantrixGraph(nodes = cards, links = links, state = graph, zoomButtons = false) { node -> Card(node) }
```

A button that has nothing to do, as the one that looks closer has at the closest the state allows, is drawn faint and does nothing. The percentage is written as the theme's language writes one.

Parameters:

- `state: GraphState`: the state of the graph the buttons move.
- `modifier: Modifier`: the row's modifier.
- `tagKey: String?`: the row's automation key: it is `GraphZoom_<tagKey>`, and its buttons stand in `TestScope(tagKey)`, `IconButton_zoom_out`, `IconButton_zoom_in` and `IconButton_fit`, reported as icon buttons are.

### expandedToLevel

`import com.pantrixui.components.data.graph.expandedToLevel`, from `com.pantrixui:components`

```kotlin
fun expandedToLevel(
    nodes: List<GraphNode>,
    links: List<GraphLink>,
    level: Int
): Set<String>
```

The keys of the nodes to open for a `PantrixGraph` to show its nodes down to `level` links from its roots: each node that stands fewer than `level` layers down, which shows the layer after it. Nought opens nothing and shows the roots alone; one opens the roots; a level past the deepest node opens them all. What "Open to 1, 2, 3, All" sets.

```kotlin
PantrixButton(text = "2", onClick = { open = expandedToLevel(cards, links, level = 2) })
```

Parameters:

- `nodes: List<GraphNode>`: the graph's nodes, as it is given them.
- `links: List<GraphLink>`: its links, as it is given them.
- `level: Int`: how many layers after the roots are to be shown.
