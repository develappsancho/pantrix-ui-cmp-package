# Page Scaffold

A screen inside an app's shell: its name and what it can do at its top, and under them what it shows. The shell is built once with a `PantrixScaffold`, its navigation along the bottom of a narrow window and down the side of a wide one; this frames each of its screens. The pages on this page stand inside a bordered surface, so that their edges show. The card's window picker shows the same page narrow and wide.

- `PantrixPageScaffold` (`com.pantrixui.components.container.page`, `com.pantrixui:components`): A screen inside the app's shell: its title and actions at the top, a header, and its content kept clear of the bars and the keyboard, as wide as reads well. Keywords: screen, page layout, page header, app bar, toolbar, screen frame.

## Features

- **Bar.** The page draws its own `PantrixTopBar`, the scaffold none: as the page changes, the title goes with it. The bar holds `title`, `subtitle`, a back button where `onBack` is given, and the actions. The bar's title starts where the content does, at the page's margin. When the content scrolls under the bar, a line is drawn along the bar's bottom edge.
- **The title in a wide page.** With `titlePlacement = PageTitlePlacement.Adaptive` there is no bar from Expanded on: the title is written large at the top of the content, the subtitle under it, and the actions beside it are buttons with their labels. In a narrower page they are in the bar.
- **Large title.** With `largeTitle` the title is written large under the bar, and goes up into the bar as the content scrolls; the same on every platform.
- **Under the title.** `header` stands under the title and scrolls with the content: a description, a notice. `stickyHeader` stays under the bar: tabs, a search, filters. The line is under it then.
- **Actions.** `actions` are laid out by the room: buttons with their labels in a wide page, the primary one filled; icons in a Compact one, their names in a tooltip and for a screen reader. What has no room, and in a Compact page what has no icon, is in the "…" menu, in the order given. `onAction` is told the key of the one pressed. `trailing` stands after them all the time: the app's own buttons.
- **Scroll.** With `PageScroll.Page` the title, `header` and the content scroll together. With `PageScroll.None` the content fills the room under the bar and scrolls itself, and takes the room it is to leave with `contentPadding`. A list's page is a `PantrixLazyPageScaffold`: its title and its `header` are the list's first rows.
- **Width.** By default (`PageWidth.Full`) the page takes its whole width, in a wide window too: cards, a table, a dashboard. `PageWidth.Content` keeps a page that is read to the theme's content width, in line with the title.
- **Room and keyboard.** The page reads the room of the `PantrixScaffold` around it itself (`LocalPantrixScaffoldPadding`) and hands none of it on: a page inside a page does not leave the same room again. The page ends above the keyboard; a field that takes the focus is not left behind a bottom bar.
- **The window's title.** The page names the tab on the web, the window on the desktop, after itself (`PantrixWindowTitle`); the app adds its own name with `LocalPantrixWindowTitleFormat`. A page inside a page, as the examples on this page are, leaves the title to the outer one.
- **Screen reader, event and tags.** The title is the page's heading and the pane's name. A page given a `tagKey` reports a `show` event each time it opens, with its tag, not its title; what is put inside it is in `TestScope(tagKey)`.

## Usage

### A page of the app's admin

```kotlin
PantrixPageScaffold(
    title = stringResource(Res.string.orders),
    subtitle = stringResource(Res.string.orders_open, openCount),
    actions = listOf(
        PageAction(key = "new", label = stringResource(Res.string.new_order), icon = PantrixIcons.Plus, primary = true),
        PageAction(key = "export", label = stringResource(Res.string.export), icon = PantrixIcons.Download)
    ),
    onAction = { key -> if (key == "new") onNewOrder() else onExport() },
    titlePlacement = PageTitlePlacement.Adaptive,
    tagKey = "orders"
) {
    OrdersSummary(orders)
}
```

### Tabs that stay under the bar, and a table that scrolls itself

```kotlin
PantrixPageScaffold(
    title = stringResource(Res.string.products),
    onBack = onBack,
    stickyHeader = { ProductTabs(tab, onTabChange = { tab = it }) },
    scroll = PageScroll.None,
    tagKey = "products"
) {
    ProductsTable(products, contentPadding = contentPadding)
}
```

## Examples

### A page of an admin

The orders page of an admin panel. `titlePlacement = PageTitlePlacement.Adaptive`: choose "Wide" in the card's picker, and the title and the actions go down to the top of the content and the bar goes; in "Narrow" they are in the bar and the actions turn into icons. "Archive" has no icon: in a narrow page it is in the "…" menu. The key of the action pressed is written in the page.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.page.PageAction
import com.pantrixui.components.container.page.PageTitlePlacement
import com.pantrixui.components.container.page.PantrixPageScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var pressed by rememberSaveable { mutableStateOf<String?>(null) }
PageExampleFrame {
    PantrixPageScaffold(
        title = "Orders",
        subtitle = "12 open",
        actions = listOf(
            PageAction(key = "new", label = "New order", icon = PantrixIcons.Plus, primary = true),
            PageAction(key = "export", label = "Export", icon = PantrixIcons.Download),
            PageAction(key = "archive", label = "Archive")
        ),
        onAction = { pressed = it },
        header = {
            PantrixText("Orders of the last 30 days", color = PantrixTheme.colors.textSecondary)
        },
        titlePlacement = PageTitlePlacement.Adaptive,
        tagKey = "orders"
    ) {
        PantrixText(pressed?.let { "Last pressed: $it" } ?: "No action pressed yet")
        repeat(5) { index ->
            PantrixCard(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                PantrixText("Order #${1040 + index}", modifier = Modifier.padding(16.dp))
            }
        }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### Tabs under the bar, a list that scrolls itself

The tabs stand under the bar (`stickyHeader`), the list scrolls itself (`scroll = PageScroll.None`) and takes the room the page leaves with `contentPadding`: its last row inside the room, the margin inside the rows. Scroll the list: the line shows under the tabs. Press the back button and the subtitle counts.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.page.PageScroll
import com.pantrixui.components.container.page.PantrixPageScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var tab by rememberSaveable { mutableIntStateOf(0) }
var backs by rememberSaveable { mutableIntStateOf(0) }
val tabs = listOf(TabItem("All"), TabItem("On sale"), TabItem("Sold out"))
PageExampleFrame {
    PantrixPageScaffold(
        title = "Products",
        subtitle = if (backs == 0) null else "Back presses: $backs",
        onBack = { backs++ },
        stickyHeader = { PantrixTabs(tabs = tabs, selectedIndex = tab, onSelect = { tab = it }, tagKey = "stock") },
        scroll = PageScroll.None,
        tagKey = "products"
    ) {
        LazyColumn(contentPadding = contentPadding, verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(List(20) { "${tabs[tab].label}: product ${it + 1}" }) { product -> PantrixText(product) }
        }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### A large title and a list

A list's page: `PantrixLazyPageScaffold`. Its rows are composed as they come into view; `header` is the list's first row. `largeTitle = true`: the title is written large under the bar, and goes up into the bar as the list scrolls. `trailing` puts the app's own button at the end of the bar. `width = PageWidth.Content`: a list that is read keeps to the theme's content width in a wide window.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.page.PageWidth
import com.pantrixui.components.container.page.PantrixLazyPageScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PageExampleFrame {
    PantrixLazyPageScaffold(
        title = "Inbox",
        trailing = {
            PantrixIconButton(PantrixIcons.Search, contentDescription = "Search", onClick = {}, tagKey = "search")
        },
        header = { PantrixText("4 unread messages", color = PantrixTheme.colors.textSecondary) },
        largeTitle = true,
        width = PageWidth.Content,
        verticalArrangement = Arrangement.spacedBy(12.dp),
        tagKey = "inbox"
    ) {
        items(List(30) { "Message ${it + 1}" }) { message -> PantrixText(message) }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### Inside a shell, with measures of its own

A page inside a shell: the `PantrixScaffold` has a bottom bar, the page reads its room itself and leaves its last row above the bar. `padding` is that even when it is not given (`LocalPantrixScaffoldPadding.current`); it is written out here. `style` changes the page's margin and the room between its sections.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.page.PageScaffoldStyle
import com.pantrixui.components.container.page.PantrixPageScaffold
import com.pantrixui.components.container.scaffold.LocalPantrixScaffoldPadding
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PageExampleFrame {
    PantrixScaffold(
        bottomBar = { insets ->
            PantrixSurface(modifier = Modifier.fillMaxWidth().padding(insets).height(56.dp)) {
                PantrixText("Bottom bar", modifier = Modifier.align(Alignment.Center))
            }
        }
    ) {
        PantrixPageScaffold(
            title = "Settings",
            header = { PantrixText("A margin of 24 dp, 8 dp between the sections") },
            padding = LocalPantrixScaffoldPadding.current,
            style = PageScaffoldStyle(horizontalPadding = 24.dp, sectionGap = 8.dp),
            tagKey = "settings"
        ) {
            repeat(12) { index -> PantrixText("Setting ${index + 1}", modifier = Modifier.padding(vertical = 8.dp)) }
        }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### The window's title

The window's title is given without a page too: `PantrixWindowTitle` says the screen's name, and `LocalPantrixWindowTitleFormat` how it is written as the window's. Turn the switch on: on the web the tab's title, on the desktop the window's, becomes "Reports — Admin"; turn it off and this page's comes back. Android and iOS show their user no window's title.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.platform.LocalPantrixWindowTitleFormat
import com.pantrixui.foundation.platform.PantrixWindowTitle
import com.pantrixui.foundation.platform.PantrixWindowTitleFormat

var named by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = named,
    onCheckedChange = { named = it },
    label = "Name the window \"Reports\"",
    tagKey = "window_title"
)
if (named) {
    CompositionLocalProvider(LocalPantrixWindowTitleFormat provides PantrixWindowTitleFormat { "$it — Admin" }) {
        PantrixWindowTitle("Reports")
    }
}
```

## API

### PantrixPageScaffold

`import com.pantrixui.components.container.page.PantrixPageScaffold`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixPageScaffold(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    onBack: (() -> Unit)? = null,
    actions: List<PageAction> = emptyList(),
    onAction: (key: String) -> Unit = {},
    trailing: (@Composable RowScope.() -> Unit)? = null,
    header: (@Composable () -> Unit)? = null,
    stickyHeader: (@Composable () -> Unit)? = null,
    titlePlacement: PageTitlePlacement = PageTitlePlacement.Bar,
    largeTitle: Boolean = false,
    width: PageWidth = PageWidth.Full,
    scroll: PageScroll = PageScroll.Page,
    padding: PaddingValues = LocalPantrixScaffoldPadding.current,
    style: PageScaffoldStyle? = null,
    tagKey: String? = null,
    content: @Composable PageScaffoldScope.() -> Unit
)
```

A screen inside an app's shell: its title and what it can do at its top, and under them what it shows, kept clear of the shell's bars, of the keyboard and of the window's edges. An app lays its shell out once with a `PantrixScaffold`, its navigation along the bottom of a narrow window and down the side of a wide one, and each of its screens with this.

- **The bar.** The page draws its own `PantrixTopBar`, the scaffold none: as one page slides over another, the title goes with its page. The bar has the page's `title` and `subtitle`, a back button where `onBack` is given, and the `actions`. Its title starts where the content does, at the page's margin. Where the content is scrolled under it the bar draws a line along its bottom edge.

- **The title in a wide page.** With `PageTitlePlacement.Adaptive`, from Expanded on, the page has no bar: its title is a heading at the top of its content, in a large type, the subtitle under it and the actions after it as buttons with their labels, and it scrolls with the content. Narrower, it is in the bar. The page goes by its own width, not the window's, as a scaffold does: a page in a part of a window lays itself out for the room it has.

- **A large title.** With `largeTitle`, the bar's title stands under it in a large type, and goes up into the bar as the content scrolls, on every platform.

- **Header.** `header` stands under the title and over the content, and scrolls with them: a breadcrumb, a line of what the page is for, a notice. `stickyHeader` stands under the bar and stays there: tabs, a search, filters. The line of a scrolled page is then under the sticky header.

- **Actions.** `actions` are laid out by the room: in a wide page each a button with its label, the primary one filled; in a Compact one each its icon, its label in a tooltip and for a screen reader. What there is no room for, and in a Compact page what has no icon, is in a menu behind a "…" button, in the order given. `onAction` is told the key of the one pressed. `trailing` stands after them all the time: the app's own buttons, an account.

- **Scroll.** With `PageScroll.Page` the heading, the header and the content scroll together. With `PageScroll.None` the content fills the room under the bar and scrolls itself, a table or a map, and is given the room to keep as `contentPadding`; the bar's line and a large title follow its scroll. A list's page is a `PantrixLazyPageScaffold`.

- **Width.** With `PageWidth.Full`, the default, what the page shows takes the page's width, in a wide window too. With `PageWidth.Content` it is no wider than the theme's content width, `PantrixTheme.layout.maxContentWidth`, and stands at the start, under the title: a page that is read. A narrower form inside it takes the layout's columns.

- **Room.** The page keeps clear of what `padding` says, the enclosing `PantrixScaffold`'s by default: its bars and the window's insets, the bar's room at the top and a bar's along the bottom. At its sides it keeps the theme's page margin, which grows with the window's class, and above and below its content the style's room. What it holds is handed none of the scaffold's padding: a page inside it keeps clear of none of it again.

- **Keyboard and focus.** The page ends above the keyboard, and a field that takes the focus near the bottom is brought up into view over a bar along the bottom, not behind it. The page does not jump as the keyboard shows.

- **The window's title.** The page names the window after itself while it is shown: the browser's tab on the web, the title bar on the desktop (`PantrixWindowTitle`). An app writes its own name after it with `LocalPantrixWindowTitleFormat`. A page inside another page's content, as an example of one is, leaves the window's title to the page it stands in.

- **Screen reader.** The title is the page's heading, and the page's name as it comes into view, which TalkBack says on Android; Compose does not tell VoiceOver a pane's name.

- **Reported shown.** A page with a `tagKey` reports a `show` event to the theme's analytics each time it comes into the composition: an app counts its screens' views by it. On Android an activity built anew, as on a turn of the device, comes into the composition again. The title is never in the event.

- **Automation.** The page is tagged `PageScaffold_<tagKey>`, its bar `TopBar_<tagKey>`, an action `PageScaffold_<tagKey>.Action_<key>` and the "…" button `PageScaffold_<tagKey>.More_actions`, whose menu is `Menu_<tagKey>_actions`. What the app puts in the page, its header, its sticky header, its content and `trailing`, stands in `TestScope(tagKey)`: a button tagged `save` there is `orders.Button_save`, and an event it reports is on the screen `orders`. While one page gives way to another, and while a back gesture is held, the two pages stand together: a button both show, as one in every page's `trailing`, is tagged twice unless each page has a `tagKey` of its own.

- **Reading direction.** The page is laid out from the start: on the right where the language is read from right to left.

The page takes the room it is given, which is to be bounded both ways: a scaffold's content, or `Modifier.fillMaxSize()`.

Parameters:

- `title: String`: what the page is called: in its bar or its heading, its name for a screen reader, and the window's.
- `modifier: Modifier`: the page's modifier.
- `subtitle: String?`: a line under the title, a count or a state, or null for none.
- `onBack: (() -> Unit)?`: where the page goes back to, as its bar's back button; null where there is nowhere to go back to. The system's back, a gesture or a key, is the app's navigation's to hear.
- `actions: List<PageAction>`: what the page can do, the most used first: laid out by the room, the rest in a menu. Each has a key of its own among them.
- `onAction: (key: String) -> Unit`: told the key of the action pressed.
- `trailing: (@Composable RowScope.() -> Unit)?`: what stands after the actions all the time, in a row: the app's own buttons.
- `header: (@Composable () -> Unit)?`: what stands under the title and over the content, and scrolls with them.
- `stickyHeader: (@Composable () -> Unit)?`: what stands under the bar and stays there as the page scrolls.
- `titlePlacement: PageTitlePlacement`: whether the title is in the bar at every width, or in the content of a wide page.
- `largeTitle: Boolean`: whether the bar's title stands in a large type under it, and goes up into it as the page scrolls.
- `width: PageWidth`: how wide what the page shows is: the page's, or the theme's content width.
- `scroll: PageScroll`: whether the page scrolls, or its content scrolls itself.
- `padding: PaddingValues`: what the page keeps clear of at its edges: the enclosing scaffold's padding by default.
- `style: PageScaffoldStyle?`: the page's geometry, over the theme's.
- `tagKey: String?`: the page's automation key, the same in every language: what the page and its parts are tagged by, the TestScope of what it holds, and the page its `show` event is of.
- `content: @Composable PageScaffoldScope.() -> Unit`: what the page shows, in a column; with `PageScroll.None` it is given the room to keep as `PageScaffoldScope.contentPadding`.

### PantrixLazyPageScaffold

`import com.pantrixui.components.container.page.PantrixLazyPageScaffold`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixLazyPageScaffold(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    onBack: (() -> Unit)? = null,
    actions: List<PageAction> = emptyList(),
    onAction: (key: String) -> Unit = {},
    trailing: (@Composable RowScope.() -> Unit)? = null,
    header: (@Composable () -> Unit)? = null,
    stickyHeader: (@Composable () -> Unit)? = null,
    titlePlacement: PageTitlePlacement = PageTitlePlacement.Bar,
    largeTitle: Boolean = false,
    width: PageWidth = PageWidth.Full,
    state: LazyListState = rememberLazyListState(),
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    padding: PaddingValues = LocalPantrixScaffoldPadding.current,
    style: PageScaffoldStyle? = null,
    tagKey: String? = null,
    content: LazyListScope.() -> Unit
)
```

A `PantrixPageScaffold` whose content is a list: its rows are composed as they come into view, and its heading and its header are the list's first rows, which scroll with it. Everything else is the page's: the bar, the actions, the sticky header, the room it keeps, the keyboard, the window's title, the event and the tags.

Parameters:

- `title: String`: what the page is called: in its bar or its heading, its name for a screen reader, and the window's.
- `modifier: Modifier`: the page's modifier.
- `subtitle: String?`: a line under the title, a count or a state, or null for none.
- `onBack: (() -> Unit)?`: where the page goes back to, as its bar's back button; null where there is nowhere to go back to.
- `actions: List<PageAction>`: what the page can do, the most used first: laid out by the room, the rest in a menu.
- `onAction: (key: String) -> Unit`: told the key of the action pressed.
- `trailing: (@Composable RowScope.() -> Unit)?`: what stands after the actions all the time, in a row: the app's own buttons.
- `header: (@Composable () -> Unit)?`: what stands under the title as the list's first row, and scrolls with it.
- `stickyHeader: (@Composable () -> Unit)?`: what stands under the bar and stays there as the list scrolls.
- `titlePlacement: PageTitlePlacement`: whether the title is in the bar at every width, or in the content of a wide page.
- `largeTitle: Boolean`: whether the bar's title stands in a large type under it, and goes up into it as the list scrolls.
- `width: PageWidth`: how wide the rows are: the page's, or the theme's content width, from the start. The list scrolls across the page's whole width either way.
- `state: LazyListState`: the list's scroll: kept with `rememberLazyListState`, and read for where the list is.
- `verticalArrangement: Arrangement.Vertical`: how the rows stand along the list: one under another by default.
- `padding: PaddingValues`: what the page keeps clear of at its edges: the enclosing scaffold's padding by default.
- `style: PageScaffoldStyle?`: the page's geometry, over the theme's.
- `tagKey: String?`: the page's automation key, as `PantrixPageScaffold`'s.
- `content: LazyListScope.() -> Unit`: the list's rows, as a `LazyColumn`'s.

### PageAction

`import com.pantrixui.components.container.page.PageAction`, from `com.pantrixui:components`

```kotlin
class PageAction(
    public val key: String,
    public val label: String,
    public val icon: ImageVector? = null,
    public val primary: Boolean = false,
    public val enabled: Boolean = true,
    public val destructive: Boolean = false,
    public val tagKey: String? = null
)
```

Something a page can do, shown at its top: export, filter, a new order.

A page lays its actions out by the room it has. In a wide one each is a button with its `label`, the `primary` one filled; in a narrow one each is its `icon`, with its label as what a screen reader and a tooltip say. What has no room, and in a narrow page what has no icon, is in a menu behind a "…" button, in the order the actions are given: the first one given is the last to fold away.

Parameters:

- `key: String`: What the page's `onAction` reports when the action is pressed. It is the same in every language, and the same action has the same key wherever it is shown.
- `label: String`: What the action is called: the button's text, and its name for a screen reader.
- `icon: ImageVector?`: What stands for the action where there is room for its icon alone, and before its label in the menu; null for an action that is only ever written, and in a narrow page is in the menu.
- `primary: Boolean`: Whether this is what the page is mostly for: a filled button in a wide page. One action of a page is primary at most.
- `enabled: Boolean`: Whether the action can be pressed now. One that cannot is drawn in the disabled text's colour.
- `destructive: Boolean`: Whether the action deletes or undoes something that cannot be had back: drawn in the danger colour.
- `tagKey: String?`: The action's automation key, the same in every language, where it is to be another than `key`: the action is `Action_<tagKey>`, inside the tag of a page that has a key, as `PageScaffold_orders.Action_export`.

### PageTitlePlacement

`import com.pantrixui.components.container.page.PageTitlePlacement`, from `com.pantrixui:components`

```kotlin
enum class PageTitlePlacement
```

Where a `PantrixPageScaffold` writes its title, its subtitle and its actions.

Entries:

- `Bar`: In the page's top bar, whatever its width.
- `Adaptive`: In the top bar while the page is narrower than Expanded, and from Expanded on as a heading at the top of its content, in a large type, with no bar: the way a page of an app's admin reads on a desktop.

### PageWidth

`import com.pantrixui.components.container.page.PageWidth`, from `com.pantrixui:components`

```kotlin
enum class PageWidth
```

How wide a `PantrixPageScaffold`'s content is.

Entries:

- `Content`: At most the theme's content width, `PantrixTheme.layout.maxContentWidth`, from the start: a page that is read, since a line that runs across a whole wide window is not.
- `Full`: As wide as the page, the default: a page of cards, a table or a dashboard uses all the room there is.

### PageScroll

`import com.pantrixui.components.container.page.PageScroll`, from `com.pantrixui:components`

```kotlin
enum class PageScroll
```

What scrolls in a `PantrixPageScaffold`.

Entries:

- `Page`: The page: its heading, its header and its content scroll together under the bar.
- `None`: Nothing of the page's own: the content fills the room under the bar and scrolls itself, a table, a map or a list the page does not hold, and is given the room it is to keep with `PageScaffoldScope.contentPadding`.

### PageScaffoldScope

`import com.pantrixui.components.container.page.PageScaffoldScope`, from `com.pantrixui:components`

```kotlin
interface PageScaffoldScope : ColumnScope
```

What a `PantrixPageScaffold`'s content is given: a column to lay itself out in, and the room it is to keep.

Members:

- `contentPadding: PaddingValues`: The room the content keeps clear itself: zero where the page scrolls, since the page keeps it then. With `PageScroll.None` it is the page's margins at the sides, its room above and below, and the room of a bar along the bottom, which a list scrolls its last rows clear of with its own `contentPadding`.

### PageScaffoldStyle

`import com.pantrixui.components.container.page.PageScaffoldStyle`, from `com.pantrixui:components`

```kotlin
class PageScaffoldStyle(
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val sectionGap: Dp = Dp.Unspecified,
    public val actionGap: Dp = Dp.Unspecified,
    public val topBar: TopBarStyle? = null
) : PantrixStyle<PageScaffoldStyle>
```

`PantrixPageScaffold`'s geometry: the room around what a page holds and between its parts.

The room at a page's sides is the theme's page margin, `PantrixTheme.layout.margin`, which grows with the window's class, unless `horizontalPadding` sets one: the bar's title starts where the content does, at that room. The rooms follow the density. A page's colours are the theme's: its background, and the bar's surface.

Parameters:

- `horizontalPadding: Dp`: The room between the page's sides and what it holds, past the scaffold's padding: unspecified, the theme's page margin, unless it is set.
- `verticalPadding: Dp`: The room above what the page holds and below it: 16dp on Android and iOS, 24dp on desktop and the web.
- `sectionGap: Dp`: The room between the page's heading, its header and its content: 16dp on Android and iOS, 24dp on desktop and the web.
- `actionGap: Dp`: The room between two of the page's actions, and between them and what stands beside them: 8dp.
- `topBar: TopBarStyle?`: The page's bar's own geometry, over the theme's. The bar's title starts at `horizontalPadding` unless this sets where.

### LocalPantrixScaffoldPadding

`import com.pantrixui.components.container.scaffold.LocalPantrixScaffoldPadding`, from `com.pantrixui:components`

```kotlin
val LocalPantrixScaffoldPadding: ProvidableCompositionLocal<PaddingValues>
```

The padding the enclosing `PantrixScaffold` gives its content, as its `content` is handed it: what keeps a screen clear of the bars and the insets. A screen deep inside the scaffold, a `PantrixPageScaffold` among them, reads it here rather than being handed it down. Zero outside a scaffold.

### PantrixWindowTitle

`import com.pantrixui.foundation.platform.PantrixWindowTitle`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixWindowTitle(title: String)
```

Names the window after the screen shown in it, for as long as that screen is in the composition: the browser tab's title on the web, the title bar's on the desktop. An app of one window and many screens otherwise keeps the name it opened with whatever is shown: every tab of a browser says the app's name, and so does every entry of its history.

```kotlin
PantrixWindowTitle(stringResource(Res.string.orders))
```

- **How it is written.** `LocalPantrixWindowTitleFormat` writes `title` as the window's: an app gives it once, at its root, to put its own name after each screen's, `Orders · Admin`.

- **Several at once.** Two screens are in the composition together while one slides over the other, and a list and its detail side by side: the one that came in last names the window. As it leaves, the one before it names the window again, and with none left the window has its own title back, the page's `<title>` on the web and what its `Window` was given on the desktop.

- **Android and iOS.** Neither shows a window's title to its user: it does nothing there.

docs/guide/window-title/WINDOW_TITLE_GUIDE.md has the whole of it, and the same for a project without this library.

Parameters:

- `title: String`: what the screen is called, as its own title says it: `Orders`.

### PantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.PantrixWindowTitleFormat`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixWindowTitleFormat
```

How a screen's title is written as its window's: `PantrixWindowTitleFormat { "$it · Admin" }` puts the app's name after it. An app gives one with `LocalPantrixWindowTitleFormat`.

Members:

- `fun format(title: String): String`: The window's title for a screen called `title`.

On the type:

- `PantrixWindowTitleFormat.Plain: PantrixWindowTitleFormat`: The screen's title as it is: what the window is called unless an app gives another format.

### LocalPantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.LocalPantrixWindowTitleFormat`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixWindowTitleFormat: ProvidableCompositionLocal<PantrixWindowTitleFormat>
```

How `PantrixWindowTitle` writes a screen's title as its window's: `PantrixWindowTitleFormat.Plain` unless given.
