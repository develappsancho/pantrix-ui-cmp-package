# Lazy Tree View

A hierarchy of thousands of rows that scrolls in a room of its own: a document's values, a project's files, an outline of thousands of headings. Only the rows in view are composed; a tree of a hundred thousand open rows builds what the screen shows. A tree of a few dozen rows that stands in a page that scrolls is a `PantrixTreeView`.

- `PantrixLazyTreeView` (`com.pantrixui.components.data.lazytreeview`, `com.pantrixui:components`): A hierarchy of many rows that scrolls and composes only the rows in view: a document's values, a project's files, brought into view by key. Keywords: large tree, lazy tree, virtualized tree, document outline, json tree, scrolling tree.

## Features

- **Its sibling.** Its rows are `PantrixTreeView`'s: the open branches and the chosen rows are the screen's state (`expanded`, `selected`), and choosing, checkboxes, loading as a branch opens (`loading`), filtering (`filter`) and guides (`guides`) are here as they are there.
- **Scrolling.** `rememberTreeViewState()` holds where the rows are scrolled to. `state.scrollToKey(key)` brings a shown row into view by the shorter way: a row below comes to the foot, one above to the top, and one in view stays where it is. A row inside a closed branch is brought once the branch is open and the tree composed again: an effect of the change that opens it does that, `LaunchedEffect(key) { state.scrollToKey(key) }`.
- **What a row holds.** `TreeNode.styledLabel` draws the label in styles of its own, as a document's syntax colours; its text is `label`'s, and the letters a filter finds are marked over it. `TreeViewStyle`'s `labelRole` sets the labels in another type, the code's. `trailing` draws something at each row's end, after the node's own text: a tag, a value's kind. It is read with the row and has no press of its own.
- **Keyboard.** The tree is one stop for Tab: the row the focus stood on last while it is in view, and else the chosen row in view or the first row in view; the focus is not sent to a row out of sight. The arrows, Home, End, the letters and `*` walk as in its sibling, and the tree scrolls to the row they reach.
- **Motion.** The rows of branches that open and close come and go with the theme's motion, and the rows under them move with it.
- **Size.** The tree is as wide as the room it is given. It is as tall as its open rows up to the room it is given, or as tall as its modifier makes it, and its rows scroll inside that. In a column that scrolls it is given a height of its own. A scroll bar stands at the end of the rows.
- **From a source.** A tree too large to be given as a list takes a `source`: a `TreeSource` gives how many children each open branch has and each child in turn, and the tree asks for the nodes of the rows in view alone. A filter and checkboxes would read every node, so this form has none.
- **Automation.** With `tagKey` the tree is `LazyTreeView_<tagKey>`, a row of it `LazyTreeView_<tagKey>.Node_<key>` and its twisty `LazyTreeView_<tagKey>.Twisty_<key>`. Presses are reported as `LazyTreeView` events with the node's key.

## Usage

### A document's values, the chosen one brought into view

```kotlin
var open by rememberSaveable { mutableStateOf(setOf("$")) }
var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val tree = rememberTreeViewState()
val scope = rememberCoroutineScope()
PantrixLazyTreeView(
    nodes = document,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.height(360.dp),
    state = tree,
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "document"
)
PantrixButton(
    text = "Go to the chosen one",
    onClick = { scope.launch { chosen.firstOrNull()?.let { tree.scrollToKey(it) } } },
    tagKey = "reveal"
)
```

### Keys in the code's type, their values' kinds at the row's end

```kotlin
PantrixLazyTreeView(
    nodes = listOf(
        TreeNode(
            key = "$.name",
            label = "name: \"Ada\"",
            styledLabel = buildAnnotatedString {
                withStyle(SpanStyle(color = PantrixTheme.colors.primary.color)) { append("name") }
                append(": \"Ada\"")
            }
        )
    ),
    expanded = emptySet(),
    onExpandedChange = {},
    modifier = Modifier.height(240.dp),
    style = TreeViewStyle(labelRole = TypeRole.Code),
    trailing = { node -> PantrixTag(text = kindOf(node)) },
    tagKey = "values"
)
```

## Examples

### A document of ten thousand rows

A hundred items in each of a hundred orders: more than ten thousand rows, of which only those in view are composed. "Go to the chosen one" brings the chosen item into view. "Order 73, item 42" opens that order's branch, chooses the item, and once the tree shows it scrolls there from an effect.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.lazytreeview.TreeViewState
import com.pantrixui.components.data.lazytreeview.rememberTreeViewState
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

var open by rememberSaveable { mutableStateOf(setOf("orders")) }
var chosen by rememberSaveable { mutableStateOf(setOf(itemKey(order = 2, item = 5))) }
val tree: TreeViewState = rememberTreeViewState()
val scope = rememberCoroutineScope()
// The item whose branch was opened, brought into view once the tree shows it.
var target by remember { mutableStateOf<String?>(null) }
LaunchedEffect(target) {
    target?.let { tree.scrollToKey(it) }
    target = null
}
PantrixLazyTreeView(
    nodes = ORDER_TREE,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(360.dp),
    state = tree,
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    guides = true,
    tagKey = "orders"
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Go to the chosen one",
        onClick = { scope.launch { chosen.firstOrNull()?.let { tree.scrollToKey(it) } } },
        variant = ButtonVariant.Outline,
        tagKey = "reveal"
    )
    PantrixButton(
        text = "Order 73, item 42",
        onClick = {
            val key = itemKey(order = 73, item = 42)
            open = open + "order73"
            chosen = setOf(key)
            target = key
        },
        variant = ButtonVariant.Outline,
        tagKey = "jump"
    )
}
PantrixText(
    text = "Chosen: ${chosen.firstOrNull() ?: "none"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val ORDER_TREE: List<TreeNode> = listOf(
    TreeNode(
        key = "orders",
        label = "Orders",
        children = (1..ORDER_COUNT).map { order ->
            TreeNode(
                key = "order$order",
                label = "Order $order",
                children = (1..ITEMS_EACH).map { item ->
                    TreeNode(
                        key = itemKey(order, item),
                        label = "Item $item",
                        trailing = "${(order * item) % 90 + 10} TL"
                    )
                }
            )
        }
    )
)

private fun itemKey(
    order: Int,
    item: Int
): String = "order$order.item$item"

private const val ORDER_COUNT = 100

private const val ITEMS_EACH = 100
```

### Keys in the code's type, their kinds at the end

A person's JSON document: the keys in the theme's primary colour (`styledLabel`), the labels in the code's type (`TreeViewStyle(labelRole = TypeRole.Code)`), and each value's kind at its row's end in a tag (`trailing`).

The row of the value that is a link has an action (`rowAction`): the button at its end opens the link and does not choose the row. On a keyboard Shift+Enter on the row that has the focus does the same, and with a screen reader the row's actions. The example opens no link: it writes the address it would open under the tree.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeRowAction
import com.pantrixui.components.data.treeview.TreeViewStyle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.TypeRole

var open by rememberSaveable { mutableStateOf(setOf("$", "$.address")) }
var asked by rememberSaveable { mutableStateOf<String?>(null) }
val key = PantrixTheme.colors.primary.color
val nodes = remember(key) { personOf(key) }
PantrixLazyTreeView(
    nodes = nodes,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(320.dp),
    guides = true,
    trailing = { node -> KINDS[node.key]?.let { PantrixTag(text = it) } },
    style = TreeViewStyle(labelRole = TypeRole.Code),
    tagKey = "person",
    rowAction = { node ->
        LINKS[node.key]?.let { address ->
            TreeRowAction(icon = PantrixIcons.ExternalLink, label = "Open link") { asked = address }
        }
    }
)
PantrixText(
    text = "Link to open: ${asked ?: "none"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private fun personOf(key: Color): List<TreeNode> {
    fun value(
        at: String,
        name: String,
        value: String = "",
        children: List<TreeNode> = emptyList(),
        tag: String? = null
    ) = TreeNode(
        key = at,
        label = if (value.isEmpty()) name else "$name: $value",
        children = children,
        tagKey = tag,
        styledLabel = buildAnnotatedString {
            withStyle(SpanStyle(color = key)) { append(name) }
            if (value.isNotEmpty()) append(": $value")
        }
    )
    return listOf(
        value(
            "$",
            "person",
            children = listOf(
                value("$.name", "name", "\"Ada\""),
                value("$.web", "web", "\"https://example.com/ada\"", tag = "web"),
                value("$.born", "born", "1815"),
                value(
                    "$.address",
                    "address",
                    children = listOf(
                        value("$.address.city", "city", "\"London\""),
                        value("$.address.zip", "postcode", "\"W1\"")
                    )
                ),
                value("$.tags", "tags", children = listOf(value("$.tags[0]", "0", "\"mathematics\""))),
                value("$.alive", "alive", "false")
            )
        )
    )
}

private val KINDS = mapOf(
    "$" to "object",
    "$.name" to "string",
    "$.web" to "link",
    "$.born" to "number",
    "$.address" to "object",
    "$.address.city" to "string",
    "$.address.zip" to "string",
    "$.tags" to "array",
    "$.tags[0]" to "string",
    "$.alive" to "boolean"
)

private val LINKS = mapOf("$.web" to "https://example.com/ada")
```

### A filter over ten thousand rows

A filter over ten thousand rows: what is typed in the field is looked for in the labels; the items found and the orders they stand in show, and the letters found are marked. Typing "item 42" leaves one item of each of the hundred orders.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
var open by rememberSaveable { mutableStateOf(setOf("orders")) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Search the items",
    showClearButton = true,
    contentDescription = "Search the items",
    tagKey = "order_search"
)
PantrixLazyTreeView(
    nodes = ORDER_TREE,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(320.dp),
    filter = query.text.toString(),
    tagKey = "orders_filtered"
)

private val ORDER_TREE: List<TreeNode> = listOf(
    TreeNode(
        key = "orders",
        label = "Orders",
        children = (1..ORDER_COUNT).map { order ->
            TreeNode(
                key = "order$order",
                label = "Order $order",
                children = (1..ITEMS_EACH).map { item ->
                    TreeNode(
                        key = itemKey(order, item),
                        label = "Item $item",
                        trailing = "${(order * item) % 90 + 10} TL"
                    )
                }
            )
        }
    )
)

private fun itemKey(
    order: Int,
    item: Int
): String = "order$order.item$item"

private const val ORDER_COUNT = 100

private const val ITEMS_EACH = 100
```

### A hundred thousand records from a source

A hundred thousand records from a source (`source`, `TreeSource`): the tree asks the source how many children each open branch has and for each child in turn, and makes a node only as its row is about to be shown; the rows scrolled past are never made. "Go to record 50000" finds where that record stands by the index the source reads from its key (`TreeSource.indexOf`).

"Archive"'s children are not loaded yet: its node says how many there will be (`TreeNode.childCount`), and a screen reader hears it on the closed row. Opened, a spinner turns in its place.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.lazytreeview.TreeSource
import com.pantrixui.components.data.lazytreeview.rememberTreeViewState
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import kotlinx.coroutines.launch

val source = remember { RecordsSource(count = 100_000) }
var open by rememberSaveable { mutableStateOf(setOf("records")) }
val tree = rememberTreeViewState()
val scope = rememberCoroutineScope()
PantrixLazyTreeView(
    source = source,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(320.dp),
    state = tree,
    loading = setOf("archive").intersect(open),
    tagKey = "records"
)
PantrixButton(
    text = "Go to record 50000",
    onClick = { scope.launch { tree.scrollToKey("record/49999") } },
    variant = ButtonVariant.Outline,
    tagKey = "go_to_record"
)

private class RecordsSource(private val count: Int) : TreeSource {
    override fun childCount(parent: TreeNode?): Int = when {
        parent == null -> 2
        parent.key == "records" -> count
        parent.key.startsWith("record/") -> RECORD_FIELDS.size
        else -> 0
    }

    override fun childAt(
        parent: TreeNode?,
        index: Int
    ): TreeNode = when {
        parent == null && index == 0 -> TreeNode("records", "Records", hasChildren = true, trailing = "$count")
        parent == null -> TreeNode("archive", "Archive", hasChildren = true, childCount = 1_200)
        parent.key == "records" -> TreeNode("record/$index", "Record ${index + 1}", hasChildren = true)
        else -> TreeNode("${parent.key}/${RECORD_FIELDS[index]}", RECORD_FIELDS[index])
    }

    override fun indexOf(
        parent: TreeNode?,
        key: String
    ): Int = when {
        parent == null -> listOf("records", "archive").indexOf(key)
        parent.key == "records" -> key.removePrefix("record/").toIntOrNull()?.takeIf { it in 0 until count } ?: -1
        else -> RECORD_FIELDS.indexOf(key.removePrefix("${parent.key}/"))
    }
}

private val RECORD_FIELDS = listOf("name", "city", "amount")
```

## API

### PantrixLazyTreeView

`import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixLazyTreeView(
    nodes: List<TreeNode>,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    state: TreeViewState = rememberTreeViewState(),
    selection: TreeSelection = TreeSelection.None,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    loading: Set<String> = emptySet(),
    filter: String = "",
    guides: Boolean = false,
    trailing: (@Composable RowScope.(TreeNode) -> Unit)? = null,
    style: TreeViewStyle? = null,
    colors: TreeViewColors? = null,
    rowAction: ((TreeNode) -> TreeRowAction?)? = null,
    tagKey: String? = null
)
```

A hierarchy of many rows that scrolls in a room of its own: a document's values, a project's files, an outline of thousands of headings. Only the rows in view are composed: a tree of a hundred thousand open rows composes what the screen shows. A tree of a few dozen rows that stands in a page that scrolls is a `PantrixTreeView`.

It is the `PantrixTreeView`'s sibling, of the same rows: which branches are open and which rows are chosen are the caller's state (`expanded`, `selected`), a press chooses, checks, or opens and closes as the `selection` has it, a branch whose children are still to come shows a spinner while its key is in `loading`, and a `filter` shows what holds it, marked, and the branches it stands in. A node's styled label, the style's type for the labels, what `trailing` draws at each row's end and what `rowAction` does there are the same as there.

**Scrolling.** `state` holds where the rows are scrolled to: `state.scrollToKey(key)` brings a shown row into view, the one a reader chose in a document's text or a search found. Opened and closed branches come and go with the theme's motion, and the rows under them move up and down with it.

**With the keyboard** it is one stop for Tab: the row the focus was on last while it is in view, and else the chosen row in view or the first row in view, for the focus is not sent to a row out of sight. The arrows, Home and End, the letters and `*` walk the rows as in its sibling, and the tree scrolls to the row they reach. Enter and Space press the row, and Shift+Enter runs its action.

**To a screen reader** a row is its label, what stands at its end, how many children a closed branch has and how deep it stands, in the theme's words; the tree is a list that scrolls, and its rows are read in the order they stand.

**Its size.** The tree is as wide as the room it is given. It is as tall as its open rows up to the room it is given, or as tall as `modifier` makes it, and its rows scroll inside that; it is given a height of its own in a column that scrolls. A scroll bar stands at the end of its rows.

```kotlin
var open by rememberSaveable { mutableStateOf(setOf("$")) }
var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val tree = rememberTreeViewState()
PantrixLazyTreeView(
    nodes = document,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxSize(),
    state = tree,
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "document"
)
```

Parameters:

- `nodes: List<TreeNode>`: the nodes at the top of the tree, in the order they are shown. No two nodes of the tree have one key.
- `expanded: Set<String>`: the keys of the branches that are open.
- `onExpandedChange: (Set<String>) -> Unit`: called with the keys that are to be open after a branch was opened or closed. The tree changes nothing by itself.
- `modifier: Modifier`: the tree's modifier. The tree is as wide as the room it is given; its height is said above.
- `state: TreeViewState`: where the rows are scrolled to, for a screen that reads it or brings a row into view.
- `selection: TreeSelection`: how rows are chosen: not at all, one at a time, or by checkboxes.
- `selected: Set<String>`: the keys of the chosen rows, or of the checked ones.
- `onSelectionChange: ((Set<String>) -> Unit)?`: called with the keys that are to be chosen, or checked, after a press. `null` leaves the rows as `selected` has them, and a press on a row opens its branch or closes it.
- `loading: Set<String>`: the keys of the branches whose children are being loaded: a spinner stands in their twisty's place.
- `filter: String`: what the rows' labels are to hold for the rows to be shown, or nothing for all of them.
- `guides: Boolean`: whether a faint line runs down from each open branch's twisty along what it holds.
- `trailing: (@Composable RowScope.(TreeNode) -> Unit)?`: what each row draws at its end for its node, after the node's own trailing text, or null for nothing. It is read with the row and takes no press of its own.
- `style: TreeViewStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TreeViewColors?`: this tree's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `rowAction: ((TreeNode) -> TreeRowAction?)?`: what the row of a node does besides being chosen, or null for a row that does nothing more: an icon button at its end, which a press runs without choosing the row, tagged `LazyTreeView_<tagKey>.Action_<key>`. Shift+Enter on the row runs it, and a screen reader is offered it among the row's actions.
- `tagKey: String?`: the tree's automation key: the tree is `LazyTreeView_<tagKey>`, a row in it `LazyTreeView_<tagKey>.Node_<key>` and its twisty `LazyTreeView_<tagKey>.Twisty_<key>`. What a press does is reported as a `LazyTreeView` event: `expand`, `collapse`, `select`, `check`, `uncheck`, and `action` for a row's action, with the node's key.

### PantrixLazyTreeView

`import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixLazyTreeView(
    source: TreeSource,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    state: TreeViewState = rememberTreeViewState(),
    selection: TreeSelection = TreeSelection.None,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    loading: Set<String> = emptySet(),
    guides: Boolean = false,
    trailing: (@Composable RowScope.(TreeNode) -> Unit)? = null,
    style: TreeViewStyle? = null,
    colors: TreeViewColors? = null,
    rowAction: ((TreeNode) -> TreeRowAction?)? = null,
    tagKey: String? = null
)
```

A `PantrixLazyTreeView` that takes its nodes from `source` as it shows them, for a tree too large to be given as a list: a document of a hundred thousand values, a disk's folders. Only the counts of the open branches are asked for as the tree lays itself out, and a node only as its row is about to be shown, so that the rows scrolled past are never made, and a branch of a hundred thousand children costs what the rows on the screen do.

It does what the tree of `TreeNode`s does, save what would read every node: it has no filter, and it chooses its rows one at a time or not at all, for a checkbox says what stands under a branch. A letter typed on a row looks for a label that starts with it among the next two thousand rows. Where a branch opened in `expanded` stands, and a row `TreeViewState.scrollToKey` brings into view, is known from a row that showed it; else the source is asked by its `TreeSource.indexOf`.

```kotlin
val values = remember(document) { ValuesSource(document) }
var open by rememberSaveable { mutableStateOf(setOf("$")) }
PantrixLazyTreeView(
    source = values,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxSize(),
    tagKey = "document"
)
```

Parameters:

- `source: TreeSource`: what the tree takes its nodes from. Another source, one not equal to this one, is a tree laid out afresh: what changes in the nodes is given as another source.
- `expanded: Set<String>`: the keys of the branches that are open.
- `onExpandedChange: (Set<String>) -> Unit`: called with the keys that are to be open after a branch was opened or closed. The tree changes nothing by itself.
- `modifier: Modifier`: the tree's modifier. The tree is as wide as the room it is given; it is as tall as its open rows up to the room it is given, or as tall as this makes it.
- `state: TreeViewState`: where the rows are scrolled to, for a screen that reads it or brings a row into view.
- `selection: TreeSelection`: how rows are chosen: not at all, or one at a time. `TreeSelection.Checkbox` is refused.
- `selected: Set<String>`: the keys of the chosen rows.
- `onSelectionChange: ((Set<String>) -> Unit)?`: called with the keys that are to be chosen after a press. `null` leaves the rows as `selected` has them, and a press on a row opens its branch or closes it.
- `loading: Set<String>`: the keys of the branches whose children are being loaded: a spinner stands in their twisty's place.
- `guides: Boolean`: whether a faint line runs down from each open branch's twisty along what it holds.
- `trailing: (@Composable RowScope.(TreeNode) -> Unit)?`: what each row draws at its end for its node, after the node's own trailing text, or null for nothing. It is read with the row and takes no press of its own.
- `style: TreeViewStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TreeViewColors?`: this tree's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `rowAction: ((TreeNode) -> TreeRowAction?)?`: what the row of a node does besides being chosen, or null for a row that does nothing more: an icon button at its end, as in the tree of nodes.
- `tagKey: String?`: the tree's automation key: the tree is `LazyTreeView_<tagKey>`, a row in it `LazyTreeView_<tagKey>.Node_<key>` and its twisty `LazyTreeView_<tagKey>.Twisty_<key>`. What a press does is reported as a `LazyTreeView` event, as in the tree of nodes.

### TreeViewState

`import com.pantrixui.components.data.lazytreeview.TreeViewState`, from `com.pantrixui:components`

```kotlin
class TreeViewState(public val listState: LazyListState = LazyListState())
```

What a `PantrixLazyTreeView` holds from one composition to the next, for a screen that reads it or moves it: where its rows are scrolled to, and the way to bring a row into view.

```kotlin
val tree = rememberTreeViewState()
PantrixLazyTreeView(nodes = document, expanded = open, onExpandedChange = { open = it }, state = tree)
// The row the reader chose in the text, brought into view once the tree shows it.
LaunchedEffect(chosen) { tree.scrollToKey(chosen) }
```

One state is one tree's: two trees given the same one would scroll each other.

Parameters:

- `listState: LazyListState`: The state of the list the rows scroll in: how far they are scrolled, and which are in view.

Members:

- `suspend fun scrollToKey(key: String)`: Brings the row of `key` into view at once, by the shorter way and no further than it has to go: a row above comes to the top, one below to the foot. Nothing happens for a row in view already, and for a node that is not shown: one in a closed branch, or one a filter leaves out.

  A row whose branches were opened in the same moment is shown once the tree has been composed with them: a screen brings it into view from an effect of that change, as `LaunchedEffect(key) { state.scrollToKey(key) }`. Which rows are in view is known once the tree has been laid out: a key asked for before that, from the effect of the screen that first shows the tree, waits for the tree to be composed and laid out, and a row in view then stays where it is.

### rememberTreeViewState

`import com.pantrixui.components.data.lazytreeview.rememberTreeViewState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberTreeViewState(listState: LazyListState = rememberLazyListState()): TreeViewState
```

A `TreeViewState` that is kept over what a saved state is kept over, as its list's is: a turn of the screen, a visit to another screen and back.

Parameters:

- `listState: LazyListState`: the state of the list the rows scroll in, for a screen that holds that one itself.

### TreeNode

`import com.pantrixui.components.data.treeview.TreeNode`, from `com.pantrixui:components`

```kotlin
class TreeNode(
    public val key: String,
    public val label: String,
    public val children: List<TreeNode> = emptyList(),
    public val icon: ImageVector? = null,
    public val trailing: String? = null,
    public val enabled: Boolean = true,
    public val hasChildren: Boolean = children.isNotEmpty(),
    public val styledLabel: AnnotatedString? = null,
    public val childCount: Int? = null,
    public val tagKey: String? = null
)
```

One node of a `PantrixTreeView` or a `PantrixLazyTreeView`, and the nodes under it.

```kotlin
TreeNode(
    key = "src",
    label = "src",
    icon = PantrixIcons.Folder,
    children = listOf(TreeNode(key = "src/main.kt", label = "main.kt", trailing = "4 KB"))
)
```

Parameters:

- `key: String`: What tells this node from every other one in the tree: what the tree's `expanded` and `selected` hold for it. It is the same in every language, so a translated screen opens and chooses the same nodes, and no two nodes of a tree have one key.
- `label: String`: What the row says, and the node's name for a screen reader.
- `children: List<TreeNode>`: The nodes under this one, in the order they are shown. A node with none is a leaf, unless `hasChildren` says that its children are still to come.
- `icon: ImageVector?`: Drawn before the label, or null for none: a folder, a file's kind. A screen reader passes over it.
- `trailing: String?`: A short text at the row's end, or null for none: how many things the node holds, how large a file is. It is read with the label.
- `enabled: Boolean`: Whether the node can be chosen or checked. One that cannot is written in the disabled text's colour, and its branch still opens and closes.
- `hasChildren: Boolean`: Whether the node is a branch: its twisty is drawn and it opens, even while `children` is still empty, for a tree that loads a level when it is opened.
- `styledLabel: AnnotatedString?`: `label` in styles of its own, or null to draw it as it is: the colours of a document's syntax, a part in bold. It is `label`'s text and nothing else, so that what a filter finds is marked over its styles; a screen reader and a filter read `label`. The chosen row and a row that cannot be chosen keep its styles but its colours, and write it in their own: the same node serves a row whether it is chosen or not. A style with a `background`, a mark of the app's own, keeps its colour there, the one that reads on its fill.
- `childCount: Int?`: How many children a branch whose children are still to come will have, where the node knows it: what a screen reader is told of the closed row, as it is told the number of the children a branch holds. Null, the default, counts `children`, or what the tree's source holds under the node.
- `tagKey: String?`: The row's automation key, the same in every language, where it is to be another than `key`: the row is `Node_<tagKey>`, inside the tag of a tree that has a key, as `TreeView_files.Node_src`.

Another constructor:

```kotlin
constructor(
    key: String,
    label: String,
    children: List<TreeNode> = emptyList(),
    icon: ImageVector? = null,
    trailing: String? = null,
    enabled: Boolean = true,
    hasChildren: Boolean = children.isNotEmpty(),
    tagKey: String? = null
)
```

Its parameters:

- `key: String`
- `label: String`
- `children: List<TreeNode>`
- `icon: ImageVector?`
- `trailing: String?`
- `enabled: Boolean`
- `hasChildren: Boolean`
- `tagKey: String?`

### TreeViewStyle

`import com.pantrixui.components.data.treeview.TreeViewStyle`, from `com.pantrixui:components`

```kotlin
class TreeViewStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val rowHeight: Dp = Dp.Unspecified,
    public val indent: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val guideWidth: Dp = Dp.Unspecified,
    public val labelRole: TypeRole? = null
) : PantrixStyle<TreeViewStyle>
```

`PantrixTreeView`'s geometry, and a `PantrixLazyTreeView`'s: how tall a row is, how far each level steps in, how large the twisty is, and the type the labels are set in.

A row is a row of the platform's own list, which is what a tree is made of: 48dp on Android and 44pt on iOS, which are the least a finger is given there, and 32dp on desktop and the web, the least a pointer is given. A row is never lower than the platform's touch target, and a desktop or a web page used by touch gives it a finger's.

The row's height, the gap and the padding follow the density, as the room around the words. The indent, the icon's size, the guides' width, the shape and the labels' type do not.

Parameters:

- `shape: ShapeSpec`: The corners of a chosen row's fill: a step of the brand's shape scale, or a fixed shape.
- `rowHeight: Dp`: The least height of a row. It is raised to the platform's touch target where it is lower: a row asked to be 36dp tall is 48dp on Android and on a page used by touch, 44pt on iOS, and 36dp under a pointer. A larger type makes it taller.
- `indent: Dp`: How far a level steps in from the one it stands under.
- `iconSize: Dp`: The width and height of the twisty, of a node's own icon and of the spinner of a branch that loads.
- `gap: Dp`: Between the twisty, the checkbox, the icon, the label and what stands at the row's end.
- `horizontalPadding: Dp`: The room between a row's sides and what it holds.
- `guideWidth: Dp`: The width of the lines that run down from an open branch where the tree draws them.
- `labelRole: TypeRole?`: The type the rows' labels are set in: the body on every platform, and the code's for the keys of a document, which stand under one another letter by letter.

### TreeRowAction

`import com.pantrixui.components.data.treeview.TreeRowAction`, from `com.pantrixui:components`

```kotlin
class TreeRowAction(
    public val icon: ImageVector,
    public val label: String,
    public val onClick: () -> Unit
)
```

What a row of a `PantrixTreeView` or a `PantrixLazyTreeView` does besides being chosen, for the node it is given: open the link a value holds, show a file in its folder. The tree draws it as an icon button at the row's end, after what stands there.

- **A press.** A finger or a pointer on the button runs `onClick` and does not choose the row.

- **A keyboard.** Shift+Enter on the row that has the focus runs it: the tree stays one stop for Tab, and the arrows walk its rows as before.

- **A screen reader.** The row offers it as one of its actions, under `label`; the button is not read apart from the row.

```kotlin
PantrixLazyTreeView(
    nodes = document,
    expanded = open,
    onExpandedChange = { open = it },
    rowAction = { node ->
        links[node.key]?.let { address -> TreeRowAction(PantrixIcons.ExternalLink, "Open link") { open(address) } }
    }
)
```

Parameters:

- `icon: ImageVector`: What the button draws.
- `label: String`: What the action is called: the button's name, and the action a screen reader offers on the row.
- `onClick: () -> Unit`: What the action does.

### TreeSource

`import com.pantrixui.components.data.lazytreeview.TreeSource`, from `com.pantrixui:components`

```kotlin
interface TreeSource
```

Where a `PantrixLazyTreeView` takes its nodes from as it shows them, for a tree too large to be given as a list: a document of a hundred thousand values, a disk's folders. The tree asks how many nodes stand under each open branch, and for a node only as its row is about to be shown, so that the rows scrolled past are never made.

```kotlin
class ValuesSource(private val document: Value) : TreeSource {
    override fun childCount(parent: TreeNode?): Int = valueOf(parent).children.size
 
    override fun childAt(parent: TreeNode?, index: Int): TreeNode = nodeOf(valueOf(parent).children[index])
}
```

A source says the same of a node every time it is asked. What changes, a document edited, a level loaded, is given to the tree as another source, one not equal to this one: `remember(document) { ValuesSource(document) }`. Its nodes' keys are what they are in a tree of nodes, the same in every language and no two alike, and the tree does not walk the whole source to check them. A node's own `TreeNode.children` are not read: what stands under it is the source's, and its `TreeNode.hasChildren` says that it is a branch.

Members:

- `fun childCount(parent: TreeNode?): Int`: How many nodes stand under `parent`, or at the top where `parent` is null. It is asked of each open branch as the tree lays itself out, and of a closed one for what a screen reader is told of it.
- `fun childAt(parent: TreeNode?, index: Int): TreeNode`: The node at `index` of those under `parent`, or at the top where `parent` is null, counted from 0 and under `childCount`.
- `fun indexOf(parent: TreeNode?, key: String): Int`: Where the node of `key` stands among those under `parent`, or at the top where `parent` is null: its index, or -1 where it is none of them. The tree asks it of a key it has not shown yet, a branch opened in `expanded` or a row brought into view by `TreeViewState.scrollToKey`, to find where it stands. By default it walks the nodes under `parent` by `childAt`; a source of many nodes answers it from the key, as a key `$[2048]` says its index.
