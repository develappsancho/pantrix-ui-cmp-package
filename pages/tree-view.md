# Tree View

A hierarchy whose branches open and close: folders and files, categories, a document's headings.

Which branches are open is the screen's state: the tree is given the keys of the open branches (`expanded`), and when a branch is opened or closed it hands back the new set that is to be open (`onExpandedChange`). So is which rows are chosen (`selected`, `onSelectionChange`). The tree changes nothing by itself.

- `PantrixTreeView` (`com.pantrixui.components.data.treeview`, `com.pantrixui:components`): A hierarchy whose branches open and close: rows chosen one at a time or by checkboxes, branches loaded when they open, a filter that keeps what holds it. Keywords: file tree, hierarchy, nested list, folder tree, outline, expandable list.

## Features

- **Nodes.** A `TreeNode`'s `key` is the same in every language, and no two nodes of a tree have one key. A row has its `icon` first, then its `label`, and at its end a short text (`trailing`: a number, a file's size).
- **Choosing.** `TreeSelection.None` opens or closes a branch when its row is pressed. `Single` chooses the row pressed; `Checkbox` checks the row's checkbox. While rows are chosen, the chevron at a row's start opens and closes the branch by a press of its own. A branch's checkbox checks everything under it that can be checked, and clears it where all of it is checked; a branch with only some of what is under it checked shows a dash. `onSelectionChange` gives every checked node.
- **Disabled.** A node with `enabled = false` cannot be chosen or checked and is written faint; its branch still opens and closes.
- **Loading when opened.** A node with `hasChildren = true` and no children yet has its chevron drawn; when it is opened, the screen loads its children. While its key is in `loading`, a spinner stands in the chevron's place.
- **Filtering.** While `filter` holds more than spaces, the tree shows the rows whose labels hold it and the branches they stand in; the letters found are marked, and capital and small letters are compared in the theme's language (in Turkish İ with i, and I with ı). These branches are open while the filter is given, and the reader can still close them. Everything under a node that holds what is looked for shows. Where nothing is found the tree shows no row; what to say then is the screen's.
- **Guides.** `guides` draws a faint line down from each open branch's chevron along what stands under it.
- **Keyboard.** The tree is one stop for Tab. The arrows down and up go from row to row, Home and End to the first and the last row. The arrow along the row opens a branch, and on an open branch goes to its first child; the other arrow closes an open branch, and on another row goes to the branch over it. A letter goes to the next row that starts with it, and `*` opens every branch beside it. Enter and Space press the row.
- **Screen reader.** A row says its name, what stands at its end, how many children a closed branch has and at which level it stands, in the theme's words; what a press will do (choose, check, open or close) is offered, and a branch says whether it is open.
- **Size.** The tree is as wide as the room it is given and as tall as its open rows, and does not scroll: it stands in a page that scrolls. Every open row is composed; a tree with thousands of open rows wants a list of its own. A branch's children come and go with the theme's motion.
- **Platform.** A row is the platform's list row: 48dp on Android, 44pt on iOS, 32dp on desktop and the web; it is never lower than the platform's touch target, and on a desktop or a web page used by touch it takes a finger's. Each level steps in by 24dp on Android, 20pt on iOS, and 16dp on desktop and the web.
- **Colour.** `TreeViewColors` gives the fill, the text, the chosen row, the guides and the ground of the letters found. A tree with no fill stands on what is behind it, and on a fill it is written in the colour that fill gives.
- **Automation.** With `tagKey` the tree is `TreeView_<tagKey>`, a row `TreeView_<tagKey>.Node_<key>`, and its chevron `TreeView_<tagKey>.Twisty_<key>`. Presses are reported with the node's key as `expand`, `collapse`, `select`, `check` and `uncheck`.

## Usage

### Folders and files, one chosen

```kotlin
var open by remember { mutableStateOf(setOf("src")) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixTreeView(
    nodes = listOf(
        TreeNode(
            key = "src",
            label = "src",
            icon = PantrixIcons.Folder,
            children = listOf(TreeNode(key = "src/App.kt", label = "App.kt", trailing = "4 KB"))
        )
    ),
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "files"
)
```

### Checkboxes, and a filter

```kotlin
PantrixTreeView(
    nodes = permissions,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Checkbox,
    selected = granted,
    onSelectionChange = { granted = it },
    filter = query,
    guides = true,
    tagKey = "permissions"
)
```

## Examples

### Folders and files

A project's folders and files, one of them chosen. A press on a row chooses it; the chevron before a folder opens it or closes it. Each file's size is written at the row's end. The open folders and the chosen file are the screen's state and are kept with `rememberSaveable`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("app", "app/src")) }
var chosen by rememberSaveable { mutableStateOf(setOf("app/src/App.kt")) }
PantrixTreeView(
    nodes = PROJECT_FILES,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "files"
)
PantrixText(
    text = "Chosen: ${chosen.firstOrNull() ?: "none"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val PROJECT_FILES = listOf(
    TreeNode(
        key = "app",
        label = "app",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(
                key = "app/src",
                label = "src",
                icon = PantrixIcons.Folder,
                children = listOf(
                    TreeNode(key = "app/src/App.kt", label = "App.kt", trailing = "4 KB"),
                    TreeNode(key = "app/src/Theme.kt", label = "Theme.kt", trailing = "2 KB"),
                    TreeNode(key = "app/src/Screens.kt", label = "Screens.kt", trailing = "9 KB")
                )
            ),
            TreeNode(
                key = "app/test",
                label = "test",
                icon = PantrixIcons.Folder,
                children = listOf(TreeNode(key = "app/test/AppTest.kt", label = "AppTest.kt", trailing = "3 KB"))
            ),
            TreeNode(key = "app/build.gradle.kts", label = "build.gradle.kts", trailing = "1 KB")
        )
    ),
    TreeNode(
        key = "docs",
        label = "docs",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(key = "docs/README.md", label = "README.md", trailing = "6 KB"),
            TreeNode(key = "docs/CHANGELOG.md", label = "CHANGELOG.md", trailing = "12 KB")
        )
    ),
    TreeNode(key = "settings.gradle.kts", label = "settings.gradle.kts", trailing = "1 KB")
)
```

### Permissions with checkboxes

Permissions with checkboxes. Checking a branch checks every permission under it; a branch with only some of them checked shows a dash. "Delete users" is disabled: it cannot be checked, its branch does not change it, and because of it the Users branch is never wholly checked.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("users", "billing")) }
var granted by rememberSaveable { mutableStateOf(setOf("billing.view")) }
PantrixTreeView(
    nodes = PERMISSIONS,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Checkbox,
    selected = granted,
    onSelectionChange = { granted = it },
    tagKey = "permissions"
)
PantrixText(
    text = "Checked: ${granted.size}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val PERMISSIONS = listOf(
    TreeNode(
        key = "users",
        label = "Users",
        children = listOf(
            TreeNode(key = "users.view", label = "View users"),
            TreeNode(key = "users.edit", label = "Edit users"),
            TreeNode(key = "users.delete", label = "Delete users", enabled = false)
        )
    ),
    TreeNode(
        key = "billing",
        label = "Invoices",
        children = listOf(
            TreeNode(key = "billing.view", label = "View invoices"),
            TreeNode(key = "billing.pay", label = "Pay an invoice"),
            TreeNode(key = "billing.refund", label = "Refund")
        )
    ),
    TreeNode(
        key = "settings",
        label = "Settings",
        children = listOf(
            TreeNode(key = "settings.general", label = "General"),
            TreeNode(key = "settings.security", label = "Security")
        )
    )
)
```

### Filtering and guides

`filter` looks for what is typed in the field in the labels: the rows found and the branches they stand in show, and the letters found are marked. Capital and small letters are compared in the theme's language: in Turkish, typing "ı" finds "Işıklandırma" (lighting). The guides (`guides`) link what stands under an open branch.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
var open by rememberSaveable { mutableStateOf(setOf("home")) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Search the categories",
    showClearButton = true,
    contentDescription = "Search the categories",
    tagKey = "category_search"
)
PantrixTreeView(
    nodes = CATEGORIES,
    expanded = open,
    onExpandedChange = { open = it },
    filter = query.text.toString(),
    guides = true,
    tagKey = "categories"
)

private val CATEGORIES = listOf(
    TreeNode(
        key = "home",
        label = "Home and living",
        children = listOf(
            TreeNode(key = "home.kitchen", label = "Kitchen", trailing = "128"),
            TreeNode(key = "home.light", label = "Lighting", trailing = "64"),
            TreeNode(key = "home.bath", label = "Bathroom", trailing = "41")
        )
    ),
    TreeNode(
        key = "tech",
        label = "Electronics",
        children = listOf(
            TreeNode(key = "tech.phone", label = "Phones", trailing = "212"),
            TreeNode(
                key = "tech.computer",
                label = "Computers",
                children = listOf(
                    TreeNode(key = "tech.computer.laptop", label = "Laptops", trailing = "96"),
                    TreeNode(key = "tech.computer.desktop", label = "Desktops", trailing = "38"),
                    TreeNode(key = "tech.computer.tablet", label = "Tablets", trailing = "57")
                )
            )
        )
    ),
    TreeNode(
        key = "wear",
        label = "Clothing",
        children = listOf(
            TreeNode(key = "wear.women", label = "Women", trailing = "340"),
            TreeNode(key = "wear.men", label = "Men", trailing = "295"),
            TreeNode(key = "wear.inner", label = "Underwear", trailing = "87")
        )
    )
)
```

### Branches loaded when they open

Branches loaded when they open. The folders' children are not known at first (`hasChildren = true`, `children` empty); when a folder is opened the screen puts it in `loading` and loads its children, and meanwhile a spinner stands in its chevron's place. Here the loading is mimicked by waiting half a second.

```kotlin
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.foundation.icons.PantrixIcons
import kotlinx.coroutines.delay

var open by rememberSaveable { mutableStateOf(emptySet<String>()) }
var loaded by rememberSaveable { mutableStateOf(emptyMap<String, Int>()) }
var loading by rememberSaveable { mutableStateOf(emptySet<String>()) }
LaunchedEffect(loading) {
    if (loading.isNotEmpty()) {
        delay(500)
        loaded = loaded + loading.associateWith { 3 }
        loading = emptySet()
    }
}
PantrixTreeView(
    nodes = listOf("documents" to "Documents", "pictures" to "Pictures", "music" to "Music").map { (key, label) ->
        lazyFolder(key, label, loaded)
    },
    expanded = open,
    onExpandedChange = { next ->
        loading = loading + (next - open).filter { it !in loaded }
        open = next
    },
    loading = loading,
    tagKey = "lazy"
)

private fun lazyFolder(
    key: String,
    label: String,
    loaded: Map<String, Int>
): TreeNode = TreeNode(
    key = key,
    label = label,
    icon = PantrixIcons.Folder,
    hasChildren = true,
    children = (1..(loaded[key] ?: 0)).map { TreeNode(key = "$key/$it", label = "$label $it") }
)
```

### A document's headings

A tree with no choosing, a document's headings: a press on a row opens the section or closes it. With the keyboard the tree is reached by Tab; the arrows walk the rows, a letter goes to the heading that starts with it, and `*` opens every section beside it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode

var open by rememberSaveable { mutableStateOf(setOf("setup")) }
PantrixTreeView(
    nodes = OUTLINE,
    expanded = open,
    onExpandedChange = { open = it },
    guides = true,
    tagKey = "outline"
)

private val OUTLINE = listOf(
    TreeNode(key = "intro", label = "Introduction"),
    TreeNode(
        key = "setup",
        label = "Setup",
        children = listOf(
            TreeNode(key = "setup.gradle", label = "Gradle"),
            TreeNode(key = "setup.theme", label = "Theme")
        )
    ),
    TreeNode(
        key = "parts",
        label = "Components",
        children = listOf(
            TreeNode(key = "parts.buttons", label = "Buttons"),
            TreeNode(
                key = "parts.data",
                label = "Data",
                children = listOf(
                    TreeNode(key = "parts.data.table", label = "Table"),
                    TreeNode(key = "parts.data.tree", label = "Tree")
                )
            )
        )
    ),
    TreeNode(key = "faq", label = "Frequently asked")
)
```

### On a fill, with sizes of its own

On a fill and with sizes of its own: the tree has no fill of its own, and on the primary role's soft fill it is written in the colour that fill gives. `TreeViewStyle` makes the rows lower and the indent larger.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeViewStyle
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("setup", "parts")) }
PantrixSurface(color = PantrixTheme.colors.primary.container) {
    PantrixTreeView(
        nodes = OUTLINE,
        expanded = open,
        onExpandedChange = { open = it },
        guides = true,
        style = TreeViewStyle(rowHeight = 36.dp, indent = 28.dp),
        tagKey = "on_a_fill"
    )
}

private val OUTLINE = listOf(
    TreeNode(key = "intro", label = "Introduction"),
    TreeNode(
        key = "setup",
        label = "Setup",
        children = listOf(
            TreeNode(key = "setup.gradle", label = "Gradle"),
            TreeNode(key = "setup.theme", label = "Theme")
        )
    ),
    TreeNode(
        key = "parts",
        label = "Components",
        children = listOf(
            TreeNode(key = "parts.buttons", label = "Buttons"),
            TreeNode(
                key = "parts.data",
                label = "Data",
                children = listOf(
                    TreeNode(key = "parts.data.table", label = "Table"),
                    TreeNode(key = "parts.data.tree", label = "Tree")
                )
            )
        )
    ),
    TreeNode(key = "faq", label = "Frequently asked")
)
```

### In its own colours

In its own colours: `TreeViewColors` paints the tree's ground, its text, the selected row, the indent guides and the text a search found. Here the selected row is in the colour of information, not the brand's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.data.treeview.TreeViewColors
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("app")) }
var chosen by rememberSaveable { mutableStateOf(setOf("app/build.gradle.kts")) }
PantrixTreeView(
    nodes = PROJECT_FILES,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    colors = TreeViewColors(
        selectedContainer = PantrixTheme.colors.info.container,
        selectedContent = PantrixTheme.colors.info.onContainer,
        guide = PantrixTheme.colors.info.color
    ),
    tagKey = "info_files"
)

private val PROJECT_FILES = listOf(
    TreeNode(
        key = "app",
        label = "app",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(
                key = "app/src",
                label = "src",
                icon = PantrixIcons.Folder,
                children = listOf(
                    TreeNode(key = "app/src/App.kt", label = "App.kt", trailing = "4 KB"),
                    TreeNode(key = "app/src/Theme.kt", label = "Theme.kt", trailing = "2 KB"),
                    TreeNode(key = "app/src/Screens.kt", label = "Screens.kt", trailing = "9 KB")
                )
            ),
            TreeNode(
                key = "app/test",
                label = "test",
                icon = PantrixIcons.Folder,
                children = listOf(TreeNode(key = "app/test/AppTest.kt", label = "AppTest.kt", trailing = "3 KB"))
            ),
            TreeNode(key = "app/build.gradle.kts", label = "build.gradle.kts", trailing = "1 KB")
        )
    ),
    TreeNode(
        key = "docs",
        label = "docs",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(key = "docs/README.md", label = "README.md", trailing = "6 KB"),
            TreeNode(key = "docs/CHANGELOG.md", label = "CHANGELOG.md", trailing = "12 KB")
        )
    ),
    TreeNode(key = "settings.gradle.kts", label = "settings.gradle.kts", trailing = "1 KB")
)
```

## API

### PantrixTreeView

`import com.pantrixui.components.data.treeview.PantrixTreeView`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTreeView(
    nodes: List<TreeNode>,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    selection: TreeSelection = TreeSelection.None,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    loading: Set<String> = emptySet(),
    filter: String = "",
    guides: Boolean = false,
    style: TreeViewStyle? = null,
    colors: TreeViewColors? = null,
    tagKey: String? = null
)
```

A hierarchy whose branches open and close: folders and files, categories, a document's headings.

Which branches are open is the caller's state, as an accordion's sections are: give `expanded` and act on `onExpandedChange`. So is which rows are chosen: give `selected` and act on `onSelectionChange`. That is what lets a screen open the branch a link points at, keep the tree as it was left across a rotation, or close it all from a button of its own.

**Choosing.** With `TreeSelection.None` a press on a row opens its branch or closes it. With `TreeSelection.Single` a press chooses the row, and with `TreeSelection.Checkbox` it checks the row's checkbox; the twisty at the row's start is then a press of its own that opens and closes the branch. A branch's checkbox checks everything under it that can be checked, or where all of that is checked, clears it; a branch whose children are not all checked shows a dash, and one all of whose children are is checked itself. What `onSelectionChange` is given in that mode is every node that is checked, branches and all. A node that is not `enabled` cannot be chosen or checked, and its branch still opens and closes.

**Loading a level at a time.** A node whose `hasChildren` is true and whose `children` are still empty has a twisty, and opening it is what tells the caller to load them. While its key is in `loading`, a spinner stands in its twisty's place.

**Filtering.** While `filter` holds more than spaces, the tree shows the nodes whose labels hold it, in the theme's language, with the letters that hold it marked, and the branches they stand in, which open while the filter is given: the reader may close one again. Under a node that holds it the tree shows everything, as its own branches are open. A tree in which nothing holds it shows no row; what to say then is the caller's.

**With the keyboard** the tree is one stop for Tab, the row the focus was on last, or else the chosen one or the first. The arrows down and up go from row to row, Home and End to the first and the last; the arrow that points away from where lines start opens a branch, and on an open one goes to its first child, and the other closes an open branch, and on any other row goes to the branch it stands in. A letter goes to the next row whose label starts with it, and `*` opens every branch beside the row. Enter and Space press the row.

**To a screen reader** a row is its label, what stands at its end, how many children a closed branch has and how deep the row stands, all in the theme's words. It is offered what pressing it does, to choose it, to check it, or to open or close it, and a branch says whether it is open: by that action on Android, and in the theme's words elsewhere. The rows are read in the order they stand, whatever their depth does to their bounds.

**Its size.** The tree is as wide as the room it is given and as tall as its open rows, and does not scroll: it stands in a page that does. Every open row is composed, so a tree of many thousands of open rows wants a list of its own. A branch's children come and go with the theme's motion.

```kotlin
var open by remember { mutableStateOf(setOf("src")) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixTreeView(
    nodes = files,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "files"
)
```

Parameters:

- `nodes: List<TreeNode>`: the nodes at the top of the tree, in the order they are shown. No two nodes of the tree have one key.
- `expanded: Set<String>`: the keys of the branches that are open.
- `onExpandedChange: (Set<String>) -> Unit`: called with the keys that are to be open after a branch was opened or closed. The tree changes nothing by itself.
- `modifier: Modifier`: the tree's modifier. The tree is as wide as the room it is given and as tall as its open rows.
- `selection: TreeSelection`: how rows are chosen: not at all, one at a time, or by checkboxes.
- `selected: Set<String>`: the keys of the chosen rows, or of the checked ones.
- `onSelectionChange: ((Set<String>) -> Unit)?`: called with the keys that are to be chosen, or checked, after a press. `null` leaves the rows as `selected` has them, and a press on a row opens its branch or closes it.
- `loading: Set<String>`: the keys of the branches whose children are being loaded: a spinner stands in their twisty's place.
- `filter: String`: what the rows' labels are to hold for the rows to be shown, or nothing for all of them.
- `guides: Boolean`: whether a faint line runs down from each open branch's twisty along what it holds.
- `style: TreeViewStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TreeViewColors?`: this tree's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the tree's automation key: the tree is `TreeView_<tagKey>`, a row in it `TreeView_<tagKey>.Node_<key>` and its twisty `TreeView_<tagKey>.Twisty_<key>`. What a press does is reported as a `TreeView` event: `expand`, `collapse`, `select`, `check` and `uncheck`, with the node's key.

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
    public val tagKey: String? = null
)
```

One node of a `PantrixTreeView`, and the nodes under it.

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
- `tagKey: String?`: The row's automation key, the same in every language, where it is to be another than `key`: the row is `Node_<tagKey>`, inside the tag of a tree that has a key, as `TreeView_files.Node_src`.

### TreeSelection

`import com.pantrixui.components.data.treeview.TreeSelection`, from `com.pantrixui:components`

```kotlin
enum class TreeSelection
```

How the rows of a `PantrixTreeView` are chosen.

Entries:

- `None`: None is chosen: a press on a row opens its branch or closes it.
- `Single`: One row at a time: a press chooses it and lets go of the one chosen before.
- `Checkbox`: Any number of rows, each by a checkbox: a branch checks everything under it, and shows a dash where only some of what is under it is checked.

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
    public val guideWidth: Dp = Dp.Unspecified
) : PantrixStyle<TreeViewStyle>
```

`PantrixTreeView`'s geometry: how tall a row is, how far each level steps in, and how large the twisty is.

A row is a row of the platform's own list, which is what a tree is made of: 48dp on Android and 44pt on iOS, which are the least a finger is given there, and 32dp on desktop and the web, the least a pointer is given. A row is never lower than the platform's touch target, and a desktop or a web page used by touch gives it a finger's.

The row's height, the gap and the padding follow the density, as the room around the words. The indent, the icon's size, the guides' width and the shape do not.

Parameters:

- `shape: ShapeSpec`: The corners of a chosen row's fill: a step of the brand's shape scale, or a fixed shape.
- `rowHeight: Dp`: The least height of a row. A larger type makes it taller.
- `indent: Dp`: How far a level steps in from the one it stands under.
- `iconSize: Dp`: The width and height of the twisty, of a node's own icon and of the spinner of a branch that loads.
- `gap: Dp`: Between the twisty, the checkbox, the icon, the label and what stands at the row's end.
- `horizontalPadding: Dp`: The room between a row's sides and what it holds.
- `guideWidth: Dp`: The width of the lines that run down from an open branch where the tree draws them.

### TreeViewColors

`import com.pantrixui.components.data.treeview.TreeViewColors`, from `com.pantrixui:components`

```kotlin
data class TreeViewColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val guide: Color = Color.Unspecified,
    public val match: Color = Color.Unspecified
)
```

What a `PantrixTreeView` is painted with, for a tree that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// The chosen row in the success role, the rest as the theme has it.
PantrixTreeView(…, colors = TreeViewColors(selectedContainer = PantrixTheme.colors.success.container))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the rows, unless `content` is given too, and a `selectedContainer` brings its pair for the chosen row, unless `selectedContent` is given. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The fill behind the rows. None: the tree stands on what is behind it.
- `content: Color`: A row's label and its icon. The theme's `textPrimary`, or on a fill that is not the tree's, the colour that fill gives what stands on it. The twisty and what stands at a row's end are the theme's `textSecondary` on the theme's own grounds, and this colour elsewhere and where it is given.
- `selectedContainer: Color`: The fill behind the chosen row. The primary role's `container`.
- `selectedContent: Color`: The chosen row's label, icon and twisty: the colour that reads on `selectedContainer`. The primary role's `onContainer`.
- `guide: Color`: The lines that run down from an open branch. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`.
- `match: Color`: What is laid behind the letters a filter found. The theme's warning role softened, written in what the theme pairs with it; on a fill a share of what is written there, under letters that keep their colour. A row that cannot be chosen lays a share of it under letters that keep the row's faint colour.
