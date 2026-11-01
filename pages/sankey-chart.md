# Sankey Chart

A chart that shows what flows from where to where, and how much. The nodes stand in columns; between them lie bands as wide as what flows: where the visitors of a site come from and what they go on to, what a budget is made of and what it is spent on.

- `PantrixSankeyChart` (`com.pantrixui.components.chart.sankey`, `com.pantrixui:components`): What flows from where to where: nodes in columns and between them bands as wide as what flows, set out from the links alone, with a tooltip for the node pointed at and every node reachable by keys and by a screen reader. Keywords: flow diagram, alluvial, flows, transfers, budget flow.

## Features

- **Nodes and links.** The chart takes its nodes (`SankeyNode`) and the links between them (`SankeyLink`); a link names its two nodes by their keys. Links between the same two nodes are one flow.
- **Columns.** The columns come from the links: a node nothing flows into stands in the first column, the others a column past the last of those that flow into them, and a node nothing flows out of in the last. `align` chooses where a node that could stand in more than one column stands: `Justify`, `Left`, `Right`, `Center`. The nodes of a column are put in the order that keeps their flows from crossing as far as it can; `order = SankeyOrder.Given` leaves them in the order they were given.
- **Size.** A node is as tall as the greater of what flows into it and what flows out of it; a band is as wide as what flows. A node's width and the room between two nodes of a column are `ChartStyle`'s `nodeWidth` and `nodeGap`.
- **The node pointed at.** The node under the pointer or a finger is ringed, its flows stand out and the others fade. The tooltip writes the node and each of its flows, with the name of the node at its other end. On the keyboard the arrows go to the nearest node the way they point.
- **The flow pointed at.** Where the pointer or a finger is on a flow, the flow stands out, the others fade, and the tooltip writes its two nodes the way it flows ("Search → Signed up"). The keyboard stays on the nodes.
- **What is refused.** A link from a node to itself, links that lead back to where they started, and a link that names a node the chart does not have are refused.
- **Screen reader.** First the chart's description, then each node, column by column: what it counts for, and each of its flows with where it comes from or goes to.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** The chart is tagged `Sankey_<tagKey>`, a node `Sankey_<tagKey>.Node_<number>`. A press on a node is reported as a `select` event with the node's key, and a press on a flow with the keys of its two nodes (`source>target`).

## Usage

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

## Examples

### Where visitors come from and where they go

Three columns: the sources visitors come from, what they do on the site, and how they end up. The chart works the columns out from the links itself, and puts the nodes of a column in an order that keeps their flows from crossing.

Move the pointer over a node, or touch the node: the node's flows grow stronger and the tooltip writes each of them with the node at its other end. On a flow, that flow alone grows stronger and the tooltip writes it with its two nodes.

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
    description = "The sources visitors come from, what they do on the site, and how they end up",
    tagKey = "plain"
)

private val VISITOR_NODES = listOf(
    SankeyNode("search", "Search"),
    SankeyNode("social", "Social"),
    SankeyNode("direct", "Direct"),
    SankeyNode("signup", "Signed up"),
    SankeyNode("browse", "Browsed"),
    SankeyNode("paid", "Paid"),
    SankeyNode("free", "Stayed free"),
    SankeyNode("left", "Left")
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

### Income and spending

Two columns: a month's income and where it is spent. The tooltip's values are written short (the `format` of `ChartTooltip`). Turn the switch: the nodes' names go away (`names = false`) and the names stay in the tooltip alone.

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
    label = "Node names",
    tagKey = "sankey_names"
)
PantrixSankeyChart(
    nodes = BUDGET_NODES,
    links = BUDGET_LINKS,
    names = named,
    tooltip = ChartTooltip(format = { strings.compact(it) + " TL" }),
    description = "A month's income and where it is spent",
    tagKey = "budget"
)

private val BUDGET_NODES = listOf(
    SankeyNode("salary", "Salary"),
    SankeyNode("extra", "Extra income"),
    SankeyNode("rent", "Rent"),
    SankeyNode("food", "Food"),
    SankeyNode("bills", "Bills"),
    SankeyNode("saved", "Savings")
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

### Pressing a node

A press hands over the node: its key in `series`, its name in `name`, what it counts for in `value`. A press on a flow hands over the flow: the key of the node it leaves in `series`, that of the node it reaches in `x`. Press a node, or a flow between two columns: the line under the chart writes what was pressed.

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
    onSelect = { pressed = "${it.name}: ${it.text} visitors" },
    description = "The sources visitors come from, what they do on the site, and how they end up",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Press a node")

private val VISITOR_NODES = listOf(
    SankeyNode("search", "Search"),
    SankeyNode("social", "Social"),
    SankeyNode("direct", "Direct"),
    SankeyNode("signup", "Signed up"),
    SankeyNode("browse", "Browsed"),
    SankeyNode("paid", "Paid"),
    SankeyNode("free", "Stayed free"),
    SankeyNode("left", "Left")
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

### Column alignment and order

Column alignment (`align`). Those from ads flow straight to a payment, and some of those from search leave at once: these two nodes could stand in more than one column. "Justify" puts a node nothing flows out of in the last column, "Left" as early as it can be, "Right" a node nothing flows into as late as it can be, and "Center" a column before the first node it flows into. Turn the switch: the nodes stand in a column in the order they were given (`order = SankeyOrder.Given`).

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
    label = "In the given order",
    tagKey = "sankey_given"
)
PantrixSankeyChart(
    nodes = ALIGN_NODES,
    links = ALIGN_LINKS,
    modifier = Modifier.height(260.dp),
    align = align,
    order = if (given) SankeyOrder.Given else SankeyOrder.Untangled,
    description = "Where visitors come from and where they end up",
    tagKey = "align"
)

private val ALIGN_NODES = listOf(
    SankeyNode("search", "Search"),
    SankeyNode("ads", "Ads"),
    SankeyNode("signup", "Signed up"),
    SankeyNode("browse", "Browsed"),
    SankeyNode("left", "Left"),
    SankeyNode("paid", "Paid"),
    SankeyNode("bounce", "Left at once")
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
    SegmentOption(value = SankeyAlign.Justify, label = "Justify", tagKey = "justify"),
    SegmentOption(value = SankeyAlign.Left, label = "Left", tagKey = "left"),
    SegmentOption(value = SankeyAlign.Right, label = "Right", tagKey = "right"),
    SegmentOption(value = SankeyAlign.Center, label = "Center", tagKey = "center")
)
```

### Your own sizes

The nodes' own sizes: wider nodes (`nodeWidth`) and more room between the nodes of a column (`nodeGap`). A field that is not given stays the theme's.

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
    description = "A month's income and where it is spent",
    style = ChartStyle(nodeWidth = 24.dp, nodeGap = 16.dp),
    tagKey = "own_sizes"
)

private val BUDGET_NODES = listOf(
    SankeyNode("salary", "Salary"),
    SankeyNode("extra", "Extra income"),
    SankeyNode("rent", "Rent"),
    SankeyNode("food", "Food"),
    SankeyNode("bills", "Bills"),
    SankeyNode("saved", "Savings")
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

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file has the nodes, the flows and the names; a flow or a node that is pointed at does not stand out in it.

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
    description = "The sources visitors come from, what they do on the site, and how they end up",
    tagKey = "exported",
    export = ChartExport(fileName = "visitors") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val VISITOR_NODES = listOf(
    SankeyNode("search", "Search"),
    SankeyNode("social", "Social"),
    SankeyNode("direct", "Direct"),
    SankeyNode("signup", "Signed up"),
    SankeyNode("browse", "Browsed"),
    SankeyNode("paid", "Paid"),
    SankeyNode("free", "Stayed free"),
    SankeyNode("left", "Left")
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

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixSankeyChart

`import com.pantrixui.components.chart.sankey.PantrixSankeyChart`, from `com.pantrixui:components`

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

A sankey chart: what flows from where to where, and how much. Nodes stand in columns, and between them lie the flows as bands, each as wide as what flows: where the visitors of a site come from and what they go on to, what a budget is made of and what it is spent on, where the energy of a plant ends up.

The chart is given its `nodes` and the `links` between them, each link by the keys of its two nodes. The columns come from the links: a node nothing flows into stands in the first, every other a column past the last of the nodes that flow into it, and a node nothing flows out of in the last, as `align` has it by default. In a column the nodes are put in the order that keeps their flows from crossing where that can be helped, or the order they are given in where `order` says so. A node is as tall as the greater of what flows into it and what flows out of it; one that no link names has no place in the chart.

Two links between the same two nodes are one flow, of what they come to together. The links have to lead one way: a link from a node to itself, links that lead back to where they started, and a link that names a node the chart does not have are refused.

**Pointing at a node.** A pointer over a node points at it; a finger does by a tap, and a tap on the node it points at lets go of it. With the keyboard the chart is one stop for Tab: an arrow goes to the nearest node the way it points, Home and End to the first node and the last, and Escape lets go. The node is ringed, its flows are drawn stronger and the others fainter, the tooltip is shown for it, and it is told to `state`, as a selection whose `x` is the node's key. A press, Enter or Space on it calls `onSelect`.

**Pointing at a flow.** A pointer over a flow, off the nodes, points at the flow, and a finger does by a tap: the flow is drawn stronger and the others fainter, and the tooltip names its two nodes, the way it flows, with how much flows. It is told to `state` as a selection whose `series` is the key of the node it leaves and whose `x` is the key of the node it reaches, and a press on it calls `onSelect`. The keys go from node to node, and leave the flows to the nodes' tooltips.

**To a screen reader** the chart is its `description`, then each node with what it counts for and, after it, each of its flows: where it comes from or goes to, and how much.

**Its size.** The chart is as wide as it is given room, and as tall as its modifier says or, given no height, as the chart's style says. In a language read from the right the first column stands at the right.

```kotlin
PantrixSankeyChart(
    nodes = listOf(SankeyNode("search", "Search"), SankeyNode("signup", "Sign-up"), SankeyNode("left", "Left")),
    links = listOf(SankeyLink("search", "signup", 420), SankeyLink("search", "left", 580)),
    description = "Where the visitors from search go",
    tagKey = "visitors"
)
```

Parameters:

- `nodes: List<SankeyNode>`: the nodes. Their keys tell them apart, and two with one key are refused.
- `links: List<SankeyLink>`: what flows between the nodes: each from one node to another, by their keys.
- `modifier: Modifier`: the chart's modifier. A height here is the chart's.
- `names: Boolean`: whether each node's name is written beside it, where it has room.
- `tooltip: ChartTooltip?`: what is shown for the node that is pointed at: its name and what it counts for, and under them each flow into it and out of it, with the node at its other end. Its `format` writes the values; `shared` and `crosshair` are not read. `null` shows none.
- `empty: (@Composable () -> Unit)?`: what the chart shows while it has no value to draw, in the place of the theme's words for it ("No data"), which a screen reader is then not told either. `null` writes the words.
- `state: ChartState`: what the reader points at: the chart's own where none is given.
- `description: String?`: what the chart shows, in a few words, for a screen reader: the first thing it says of the chart. Left out, the chart is announced by the names of its nodes.
- `onSelect: ((ChartPoint) -> Unit)?`: called with the node that is pressed: its key is its `series` and its `x`, its name its `name` and its `label`, and its `value` what it counts for; and with the flow that is pressed: the key of the node it leaves is its `series` and of the node it reaches its `x`, its `name` the two nodes' names, and its `value` how much flows.
- `style: ChartStyle?`: this chart's own geometry: the fields set here, with the theme's for the rest. A node is `nodeWidth` wide, two nodes of a column are a `nodeGap` apart, and a node's corners are as round as `barRadius` says.
- `colors: ChartColors?`: this chart's own colours, where they are not the theme's.
- `tagKey: String?`: the chart's automation key: the chart is `Sankey_<tagKey>`, its nodes and flows together `Sankey_<tagKey>.Plot`, a node `Sankey_<tagKey>.Node_<number>`, counted from one, column by column and in each from the top down, and the tooltip `Sankey_<tagKey>.Tooltip`. A press on a node is reported as a `Sankey` `select` event with the node's key, and a press on a flow with the keys of its two nodes, `from>to`. Nothing of the values is reported.
- `align: SankeyAlign`: which column each node stands in, of those it could stand in.
- `order: SankeyOrder`: the order the nodes of a column stand in: the one that keeps the flows from crossing, or as given.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button.

### SankeyNode

`import com.pantrixui.components.chart.sankey.SankeyNode`, from `com.pantrixui:components`

```kotlin
class SankeyNode(
    public val key: String,
    public val name: String,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

One node of a `PantrixSankeyChart`: something that what the chart follows flows out of, into, or through.

```kotlin
SankeyNode("search", "Search")
```

Parameters:

- `key: String`: What tells the node from the others of its chart: what a link names it by, what a selection names, and what an event reports. Written as a test tag's key is, in small letters and digits.
- `name: String`: What the node is called: beside it, in the tooltip and to a screen reader.
- `color: Color`: The colour the node is drawn in, and the flows that leave it. Left out, it is the theme's chart colour for its place among the nodes.
- `pattern: ChartPattern?`: The texture the node is drawn with besides its colour. Left out, none, and where the chart's patterns are on (`ChartStyle.patterns`), its turn by its place among the nodes: none for the first.

### SankeyLink

`import com.pantrixui.components.chart.sankey.SankeyLink`, from `com.pantrixui:components`

```kotlin
class SankeyLink(
    public val from: String,
    public val to: String,
    public val value: Number
)
```

One link of a `PantrixSankeyChart`: how much flows from one node to another.

```kotlin
SankeyLink(from = "search", to = "signup", value = 420)
```

Parameters:

- `from: String`: The key of the node it leaves.
- `to: String`: The key of the node it reaches: another node than the one it leaves.
- `value: Number`: How much flows. One that is no number, has no end or is not over nought is no flow.

### SankeyAlign

`import com.pantrixui.components.chart.sankey.SankeyAlign`, from `com.pantrixui:components`

```kotlin
enum class SankeyAlign
```

Which column each node of a `PantrixSankeyChart` stands in. Every node stands a column past the nodes that flow into it; the four differ in where a node stands that could stand in more than one.

Entries:

- `Justify`: A column past the last of the nodes that flow into it, and a node nothing flows out of in the last column.
- `Left`: A column past the last of the nodes that flow into it: a node nothing flows out of too.
- `Right`: A column before the first of the nodes it flows into, and a node nothing flows into as late as it can be.
- `Center`: A column past the last of the nodes that flow into it, and a node nothing flows into a column before the first of those it flows into.

### SankeyOrder

`import com.pantrixui.components.chart.sankey.SankeyOrder`, from `com.pantrixui:components`

```kotlin
enum class SankeyOrder
```

The order the nodes of a column of a `PantrixSankeyChart` stand in, from the top down.

Entries:

- `Untangled`: The order that keeps their flows from crossing where that can be helped.
- `Given`: The order the nodes are given in.
