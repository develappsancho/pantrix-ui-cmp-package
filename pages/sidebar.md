# Sidebar

The column of destinations down the side of an app: groups, sections with destinations inside them, and the rail of icons it takes when room runs short. It is the navigation of a wide window: this app's own side menu, in a window wider than 600dp, is a `PantrixSidebar` too.

A sidebar is as tall as the room it is given. On a real screen it is `PantrixScaffold`'s side bar: it is as tall as the window, and keeps its rows clear of the system bars with the `insets` the scaffold gives it. Here it stands inside a page that scrolls, so each example is in a box of a set height; the area beside it says which destination is open.

- `PantrixSidebar` (`com.pantrixui.components.navigation.sidebar`, `com.pantrixui:components`): The column of destinations down the side of an app: groups, sections two levels deep that open in place, a rail of icons it collapses to, by itself where the page is narrow, and what the rail opens. Keywords: drawer, navigation drawer, side menu, side navigation, collapsible menu, sidenav.

## Features

- **Two levels.** Rows are given in groups (`SidebarGroup`) and a line is drawn between groups; a group with a name has it written over its rows. A row with children is a section, not a destination: a press opens or closes it in place. There is nothing deeper: a child's children are not drawn.
- **The state is the app's.** The current destination (`selected`) and the open sections (`expanded`) are the caller's state; a press on a row only asks (`onSelect`, `onExpandedChange`). A sidebar that kept its own state would fight the back button, a deep link and a restored process.
- **One section open.** With `singleExpanded`, which is the default, opening a section closes the one that was open: a sidebar of six sections stays the height of six rows. Given false, more than one section can stay open.
- **Icon rail.** `collapsed` reduces the sidebar to a rail of icons: a destination's icon carries its name, and shows a tooltip. A section opens what it holds beside the rail (`flyout`): in a card, or in a column that moves the page over. A top-level row without an icon is drawn as a chevron on the rail: give every one an icon.
- **Narrows by itself.** With `adaptive`, which is the default, the sidebar takes the rail by itself where its column would leave the page less than 840dp.
- **Header, pinned destinations, footer.** `header` stands above the rows, `footerItems` and `footer` below them; none of them scrolls. The header and the footer learn which shape they are in through `SidebarSlotScope.collapsed`.
- **Where the app is.** The current destination is told three ways: its fill, its heavier label, and its selected state for a screen reader. The name of the section that holds it is written heavier too; on the rail that section carries the fill and the bar on the edge.
- **Height and scrolling.** The rows take the room left between the header and the pinned destinations, and scroll inside it when they do not fit, with Pantrix's scroll bar along the edge on the desktop and the web. A row is never lower than the platform's touch target, and grows with a larger type.
- **Colours and style.** `SidebarColors` paints the fill, the text, the selected row, the lines and the bar on the rail; `SidebarStyle` gives the width, the rows and the corners. The column is 248dp wide on every platform. `textStyle` gives the rows' type and `titleTextStyle` the groups' titles'; the current destination is a step heavier than the type given.
- **Screen reader and keyboard.** A section says whether it is open; a closed one composes nothing of what it holds. The column a rail opens closes with Escape, and focus returns to the section's row.

## Usage

### A sidebar with sections

```kotlin
PantrixSidebar(
    groups = listOf(
        SidebarGroup(overview, projects),
        SidebarGroup(analytics, quality)
    ),
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "main"
)
```

### Collapsed to a rail, its sections opening a column beside it

```kotlin
PantrixSidebar(
    groups = groups,
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    collapsed = true,
    flyout = SidebarFlyout.Panel,
    tagKey = "main"
)
```

### With a header, pinned destinations and a footer

```kotlin
PantrixSidebar(
    groups = groups,
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    header = { WorkspaceSwitcher(compact = collapsed) },
    footerItems = listOf(settings, help),
    // The avatar alone on the rail, the name beside it in the column.
    footer = { AccountCard(compact = collapsed) },
    tagKey = "main"
)
```

### A dark sidebar in a light app

```kotlin
PantrixSidebar(
    groups = groups,
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    colors = SidebarColors(
        container = Navy,
        content = Color.White,
        selectedContainer = NavyLight,
        selectedContent = Color.White,
        divider = NavyLine,
        marker = Sky
    ),
    tagKey = "main"
)
```

## Examples

### Groups and sections

At its plainest: the rows in groups (`groups`), the key of the current destination (`selected`), the keys of the open sections (`expanded`), and two callbacks that ask for those two to change. The sidebar changes nothing by itself; here the state is kept with `rememberSaveable`, and is not lost when the screen rotates.

"Quality" and "Releases" are sections: a press opens them in place, and opening one closes the other. Pick "Crashes" and close "Quality": the section's name stays heavier, so even closed it says where the app is. "Archive" and "Invoices" cannot be pressed.

`adaptive = false` is given: the sidebar stands inside a box here, and with the default it would take the rail; the "Narrows by itself" example shows that. The box is 480dp tall: a sidebar is as tall as the room it is given.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        tagKey = "plain"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

### More than one section can stay open

`singleExpanded = false`: opening one section does not close the other. Open "Releases": "Quality" stays open too.

When its rows do not fit in its box, the sidebar scrolls them inside itself: on a phone that is what happens in the 480dp box once both sections are open.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        singleExpanded = false,
        tagKey = "many"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

### Groups with names

A group's name stands over its rows: `SidebarGroup(items, title = "Guides")`. The name is written small, in capitals and in the quiet colour, and a screen reader hears it as a heading: as a documentation's "Getting started" and "Guides" sections are. A group without a name is set apart by a line alone.

A rail has no room for names: press "Switch to rail", and the groups are still set apart by a line.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var rail by rememberSaveable { mutableStateOf(false) }
var where by rememberSaveable { mutableStateOf("installation") }
PantrixButton(
    text = if (rail) "Switch to column" else "Switch to rail",
    onClick = { rail = !rail },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "titled_shape"
)
SidebarFrame(height = 400.dp) {
    PantrixSidebar(
        groups = TITLED,
        selected = where,
        onSelect = { where = it },
        expanded = emptySet(),
        onExpandedChange = {},
        collapsed = rail,
        adaptive = false,
        tagKey = "titled"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

### Rows that cannot be pressed

`enabled = false` writes the row in the theme's disabled text colour; the row takes no press. "Invoices" is a destination that cannot be pressed.

"Reports" is a section that cannot be pressed: it does not open or close, and stays as `expanded` has it; here it is open. Each destination inside it follows its own `enabled`: "Weekly" can be pressed, "Monthly" cannot.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
SidebarFrame(height = 320.dp) {
    PantrixSidebar(
        groups = listOf(
            SidebarGroup(
                SidebarItem(key = "overview", label = "Overview", icon = PantrixIcons.Star),
                SidebarItem(key = "invoices", label = "Invoices", icon = PantrixIcons.Person, enabled = false),
                SidebarItem(
                    key = "reports",
                    label = "Reports",
                    icon = PantrixIcons.Calendar,
                    children = listOf(
                        SidebarItem(key = "weekly", label = "Weekly"),
                        SidebarItem(key = "monthly", label = "Monthly", enabled = false)
                    ),
                    enabled = false
                )
            )
        ),
        selected = where,
        onSelect = { where = it },
        expanded = setOf("reports"),
        onExpandedChange = {},
        adaptive = false,
        tagKey = "disabled"
    )
    PantrixVerticalDivider()
    PantrixText(
        text = "Key of the selected destination: $where",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}
```

### Header, pinned destinations and footer

`header` stands above the rows and does not scroll: the app's mark, a workspace switcher. `footerItems` are destinations pinned under the rows: settings, help. They are no sections: one that has children is refused. `footer` stands at the very bottom: an account, a plan. A line sets each of them off; the rows in between take the room that is left.

The header and the footer are the caller's. The text in them is in the sidebar's text colour unless it gives a colour of its own. Both are drawn in a `SidebarSlotScope`, and learn which shape the sidebar is in through `collapsed`: here a name in the column, and only initials on the rail. The next example shows the rail.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarSlotScope
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 740.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        header = { WorkspaceHeader() },
        footerItems = PINNED,
        footer = { AccountFooter() },
        tagKey = "main"
    )
    OpenPage(where)
}

@Composable
private fun SidebarSlotScope.WorkspaceHeader() {
    if (collapsed) {
        RailLetters("A")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Acme", style = PantrixTheme.typography.title)
            PantrixText(text = "Production environment", style = PantrixTheme.typography.caption)
        }
    }
}

@Composable
private fun SidebarSlotScope.AccountFooter() {
    if (collapsed) {
        RailLetters("AL")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Ada Lovelace", style = PantrixTheme.typography.label)
            PantrixText(
                text = "ada@acme.example",
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

@Composable
private fun ColumnScope.RailLetters(text: String) {
    PantrixText(
        text = text,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(vertical = PantrixTheme.spacing.lg),
        style = PantrixTheme.typography.label
    )
}

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)
```

### Icon rail: a section opens a card beside it

`collapsed` reduces the sidebar to a rail of icons. A destination's icon carries its name: a pointer resting on it, keyboard focus or a long press shows the name in a tooltip. A section opens what it holds beside the rail; with `SidebarFlyout.Popup` that is a card. It comes when the pointer rests on the section and goes when the pointer leaves; where there is no pointer, a press by a finger, the keyboard or a screen reader opens it, and it stays until it is dismissed. It closes once a destination in it is chosen.

A row's `detail` ("87 open") is written only here, where there is room for it; the section's ("3 warnings") is at the top of the card, beside its name. It is not written in the column: the column is a list of places to go, and a run of figures down its side would read as data.

"Switch to column" turns the same sidebar into a column: the shape changes at once, the width follows it over the theme's motion, and the page beside it moves with it. On the rail the header and the footer draw only a letter or two.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarFlyout
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarSlotScope
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var rail by rememberSaveable { mutableStateOf(true) }
var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
PantrixButton(
    text = if (rail) "Switch to column" else "Switch to rail",
    onClick = { rail = !rail },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "sidebar_shape"
)
SidebarFrame(height = 740.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        collapsed = rail,
        adaptive = false,
        flyout = SidebarFlyout.Popup,
        header = { WorkspaceHeader() },
        footerItems = PINNED,
        footer = { AccountFooter() },
        tagKey = "rail"
    )
    OpenPage(where)
}

@Composable
private fun SidebarSlotScope.WorkspaceHeader() {
    if (collapsed) {
        RailLetters("A")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Acme", style = PantrixTheme.typography.title)
            PantrixText(text = "Production environment", style = PantrixTheme.typography.caption)
        }
    }
}

@Composable
private fun SidebarSlotScope.AccountFooter() {
    if (collapsed) {
        RailLetters("AL")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Ada Lovelace", style = PantrixTheme.typography.label)
            PantrixText(
                text = "ada@acme.example",
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

@Composable
private fun ColumnScope.RailLetters(text: String) {
    PantrixText(
        text = text,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(vertical = PantrixTheme.spacing.lg),
        style = PantrixTheme.typography.label
    )
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)
```

### Icon rail: a section opens a column beside it

With `SidebarFlyout.Panel` the section's destinations open beside the rail, in a column of their own: the column's width and the rail's height. The sidebar grows wider by that much; the page is not covered but moved over.

Press "Quality". The column opens at a press, and not as a pointer passes. Pressing the section again, choosing a destination and Escape close it; pressing another section shows that one's. When it is opened with the keyboard, focus goes to the column's first destination, and returns to the section's row when it closes.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarFlyout
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        collapsed = true,
        adaptive = false,
        flyout = SidebarFlyout.Panel,
        tagKey = "panel"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

### Narrows by itself: a rail in a narrow space, a column in a wide one

`adaptive`, whose default is true, makes the sidebar take the rail by itself where its column would crowd the page: where the width it is given, less the column's 248dp, is under 840dp. 840dp is the width below which a page has no room for two panes. So where the sidebar gets less than 1088dp the rail shows, and otherwise the column.

The selector changes the width of the box the sidebar stands in: the 1200dp box shows the column, the 700dp box the rail. The sidebar looks at the room it is given, not at the window: the window stays the same, only the box narrows, and the sidebar takes the rail. When the box does not fit on the page it scrolls sideways, and a scrollbar appears under it.

The app's own side menu is an `adaptive` `PantrixSidebar` too: narrow the window and it takes the rail; under 600dp the bar along the bottom edge takes its place.

In the other examples `adaptive = false`: `collapsed` alone decides the shape. That is right for a sidebar in a drawer too: a drawer covers the page and does not crowd it. An `adaptive` sidebar measures the room it is given; it must be turned off under a parent that asks for its size with `IntrinsicSize`.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
var room by rememberSaveable { mutableStateOf(1200) }
PantrixSegmentButton(
    options = ROOMS,
    selected = room,
    onSelect = { room = it },
    fullWidth = false,
    tagKey = "room"
)
HorizontalScrollFrame(tagKey = "adaptive") {
    SidebarFrame(height = 480.dp, width = room.dp) {
        PantrixSidebar(
            groups = GROUPS,
            selected = where,
            onSelect = { where = it },
            expanded = open.toSet(),
            onExpandedChange = { open = it.toList() },
            adaptive = true,
            tagKey = "adaptive"
        )
        OpenPage(where)
    }
}

private val ROOMS = listOf(
    SegmentOption(value = 1200, label = "Wide space · 1200dp", tagKey = "wide"),
    SegmentOption(value = 700, label = "Narrow space · 700dp", tagKey = "narrow")
)

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `HorizontalScrollFrame`: A frame that scrolls sideways: where its content does not fit its room, it draws a scrollbar under it.

### The selected row in a role's colour

Only the selected row's fill is given: `selectedContainer`. It is the colour of one of the theme's roles, so the theme knows what reads on it: the role's paired colour comes without `selectedContent` being given. Every colour that is not given stays the theme's.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarColors
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        colors = SidebarColors(selectedContainer = PantrixTheme.colors.success.container),
        tagKey = "role"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

### In its own colours

A sidebar filled with the app's own colour. The theme does not know this colour and cannot tell what reads on it: along with the fill (`container`), the colour of the text (`content`) and the colours of the selected row's fill and text are given too.

The lines are not given: on the fill they are drawn as a share of the text's colour. Rows that cannot be pressed are written in a share of that colour too. The card and the column a rail opens are drawn in the same colours.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarColors
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        colors = SidebarColors(
            container = own.color,
            content = own.onColor,
            selectedContainer = own.container,
            selectedContent = own.onContainer
        ),
        tagKey = "own"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Style: width, rows and corners

`style` changes the sidebar's geometry; only the fields that are set change, and the rest come from the platform's preset style. Here the column is 216dp, the rows 52dp, the rows inside a section 48dp, and the corners of a row's fill fully rounded.

In the preset style the column is 248dp on every platform; the rows are 44dp on Android and iOS, 36dp on desktop and 40dp on the web. A row is never lower than the platform's touch target. The colours are not part of the style: the theme and `SidebarColors` give them.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 540.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        style = SidebarStyle(width = 216.dp, rowHeight = 52.dp, childRowHeight = 48.dp, shape = ShapeRole.Full),
        tagKey = "styled"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

### In a type of its own

In a type of its own: the rows in the theme's `body` type, semibold (`textStyle`), the groups' titles in `footnote`, extra bold (`titleTextStyle`). The current destination is set a step heavier than the type given; the text's colour is its row's.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("installation") }
SidebarFrame(height = 360.dp) {
    PantrixSidebar(
        groups = TITLED,
        selected = where,
        onSelect = { where = it },
        expanded = emptySet(),
        onExpandedChange = {},
        adaptive = false,
        tagKey = "own_text",
        textStyle = PantrixTheme.typography.body.copy(fontWeight = FontWeight.SemiBold),
        titleTextStyle = PantrixTheme.typography.footnote.copy(fontWeight = FontWeight.ExtraBold)
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

### Behind the system bars

`insets` is the room the sidebar keeps clear at its edges: the fill runs behind it, while the header and the rows stay clear of it. On a real screen `PantrixScaffold` gives its side bar that room (`sideBar = { insets -> … }`), and the rows stand clear of the system bars. The app's own side menu takes its insets from the scaffold too.

There is no scaffold here: the 24dp strip at the top stands in for the system's status bar. The sidebar's fill runs on behind the strip, and its header starts below the strip.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarSlotScope
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
Box(modifier = Modifier.clip(PantrixTheme.shapes.md)) {
    SidebarFrame(height = 480.dp) {
        PantrixSidebar(
            groups = GROUPS,
            selected = where,
            onSelect = { where = it },
            expanded = open.toSet(),
            onExpandedChange = { open = it.toList() },
            adaptive = false,
            header = { WorkspaceHeader() },
            insets = PaddingValues(top = 24.dp),
            tagKey = "insets"
        )
        OpenPage(where)
    }
    // A strip in place of the system's status bar: the sidebar's fill runs on behind it.
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(24.dp)
            .background(PantrixTheme.colors.textSecondary.copy(alpha = 0.16f))
    )
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Open page: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun SidebarSlotScope.WorkspaceHeader() {
    if (collapsed) {
        RailLetters("A")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Acme", style = PantrixTheme.typography.title)
            PantrixText(text = "Production environment", style = PantrixTheme.typography.caption)
        }
    }
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Overview", PantrixIcons.Star),
        SidebarItem("projects", "Projects", PantrixIcons.Folder),
        SidebarItem("inbox", "Inbox", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Quality",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Crashes", detail = "87 open"),
                SidebarItem("networks", "Network requests", detail = "48,2 Mn"),
                SidebarItem("archive", "Archive", enabled = false)
            ),
            detail = "3 warnings"
        ),
        SidebarItem(
            key = "releases",
            label = "Releases",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planned"), SidebarItem("shipped", "Shipped"))
        ),
        SidebarItem("billing", "Invoices", PantrixIcons.Person, enabled = false)
    )
)

@Composable
private fun ColumnScope.RailLetters(text: String) {
    PantrixText(
        text = text,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(vertical = PantrixTheme.spacing.lg),
        style = PantrixTheme.typography.label
    )
}

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Installation", PantrixIcons.Download),
            SidebarItem("theming", "Theme", PantrixIcons.Star)
        ),
        title = "Getting started"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Forms", PantrixIcons.File),
            SidebarItem("testing", "Testing", PantrixIcons.Check)
        ),
        title = "Guides"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Settings", PantrixIcons.Menu),
    SidebarItem("help", "Help", PantrixIcons.Info)
)
```

## API

### PantrixSidebar

`import com.pantrixui.components.navigation.sidebar.PantrixSidebar`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSidebar(
    groups: List<SidebarGroup>,
    selected: String?,
    onSelect: (String) -> Unit,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    collapsed: Boolean = false,
    adaptive: Boolean = true,
    flyout: SidebarFlyout = SidebarFlyout.Popup,
    singleExpanded: Boolean = true,
    style: SidebarStyle? = null,
    colors: SidebarColors? = null,
    header: (@Composable SidebarSlotScope.() -> Unit)? = null,
    footerItems: List<SidebarItem> = emptyList(),
    footer: (@Composable SidebarSlotScope.() -> Unit)? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.label,
    titleTextStyle: TextStyle = PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Bold)
)
```

The column of destinations down the side of an app, with the sections of the app it holds.

A sidebar is two levels deep and no more: sections, and the destinations inside them. A section opens and closes in place, and by default opening one closes whichever was open (`singleExpanded`), so a sidebar of six sections stays the height of six rows and not of everything the app can show. The rows between the header and the pinned destinations scroll when there are more than fit.

`collapsed`, it is a rail of icons. A destination's icon then carries its name, which a tooltip shows, and a section opens what it holds beside the rail (`flyout`): a card, as a pointer rests on the section and at a press where there is no pointer, or a column of its own that moves the page over. Either goes once a destination in it is chosen, and it is where a row's `SidebarItem.detail` is written. A top-level row without an icon is drawn as a chevron on the rail: give every one an icon.

By default the sidebar takes the rail by itself where its column would crowd the page (`adaptive`): an unfolded foldable, a tablet held upright and a narrow window get the rail, a wide window the column. The header and the footer are told which it is, through `SidebarSlotScope.collapsed`.

Which destination is current and which sections are open are both the caller's state: navigation belongs to the app, and a sidebar that kept its own would fight the back button, a deep link and a restored process.

```kotlin
var where by rememberSaveable { mutableStateOf("crashes") }
var open by rememberSaveable { mutableStateOf(setOf("quality")) }
PantrixScaffold(
    sideBar = { insets ->
        PantrixSidebar(
            groups = groups,
            selected = where,
            onSelect = { where = it },
            expanded = open,
            onExpandedChange = { open = it },
            insets = insets,
            tagKey = "main"
        )
    }
) { padding -> Page(where, padding) }
```

The current destination is told three ways: its fill, a label a step heavier than the others, and its selected state for a screen reader. The section that holds it is written heavier too, and on the rail it has the fill and the bar on the rail's edge: a closed section still says where the app is. A section says to a screen reader whether it is open, and a closed one composes nothing of what it holds. A row is never lower than the platform's touch target, and grows with a larger type. Rows that do not fit scroll, with Pantrix's scroll bar along the sidebar's end where the reader has a pointer.

Parameters:

- `groups: List<SidebarGroup>`: the rows, in groups, in order. A line is drawn between one group and the next.
- `selected: String?`: the key of the destination the app is showing, or null where it shows none of them.
- `onSelect: (String) -> Unit`: called with the key of a destination that was pressed. The sidebar changes nothing by itself.
- `expanded: Set<String>`: the keys of the sections that are open in the column. The rail opens a section beside itself and keeps which by itself: nothing of it is the app's to restore.
- `onExpandedChange: (Set<String>) -> Unit`: called with the keys that are to be open after a section of the column was pressed.
- `modifier: Modifier`: the sidebar's modifier. The sidebar is as wide as its style says, and wider by the `insets` at its sides, and as tall as the room it is given: its rows take what the header, the pinned destinations and the footer leave, and scroll inside it. Where the room has no end, inside a page that scrolls, it needs a height of its own.
- `collapsed: Boolean`: whether the sidebar is drawn as its rail, at any width. The shape changes at once, and the sidebar's width follows it over the theme's motion, the page beside it moving with it.
- `adaptive: Boolean`: whether the sidebar takes the rail by itself where the column would crowd the page: where the width it is offered, less the column's, is under the window's expanded breakpoint, 840dp unless the window's breakpoints say otherwise, below which a page has no room for two panes. False leaves the shape to `collapsed` alone: for a sidebar in a drawer, which covers the page and crowds nothing, or for an app that lets its user pin the column. It measures what it is offered, so it cannot be asked its intrinsic size: turn it off under a parent that is sized by `IntrinsicSize`.
- `flyout: SidebarFlyout`: what a section of the rail opens: `SidebarFlyout.Popup`, a card beside the section, or `SidebarFlyout.Panel`, a column beside the rail that moves the page over. The column opens its sections in place either way.
- `singleExpanded: Boolean`: whether opening a section of the column closes whichever was open.
- `style: SidebarStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SidebarColors?`: this sidebar's own colours, where they are not the theme's: the ones set here, with the theme's for the rest. What a rail's section opens is drawn in them too.
- `header: (@Composable SidebarSlotScope.() -> Unit)?`: what stands above the rows and does not scroll: the app's mark, a workspace switcher. A line sets it off. It lays itself out for the width it has, by `SidebarSlotScope.collapsed`.
- `footerItems: List<SidebarItem>`: destinations pinned under the rows, below a line: settings, help. They are no sections: one that has children is refused.
- `footer: (@Composable SidebarSlotScope.() -> Unit)?`: what stands at the very bottom and does not scroll, below `footerItems` and a line: an account, a plan. It lays itself out for the width it has, as the header does.
- `insets: PaddingValues`: the room the sidebar keeps clear at its edges while its fill runs behind it: what a scaffold gives its side bar, so that the rows stand clear of the system bars.
- `tagKey: String?`: the sidebar's automation key: the sidebar is `Sidebar_<tagKey>`, a destination in it `Sidebar_<tagKey>.Item_<key>` wherever it is shown, and a section `Sidebar_<tagKey>.Section_<key>`; what a rail's section opens is `Sidebar_<tagKey>.Flyout_<key>` or `Sidebar_<tagKey>.Panel_<key>`. A press is reported as a `Sidebar` event: `select` with the destination's key and whether the sidebar was its rail, `expand` and `collapse` with the section's.
- `textStyle: TextStyle`: the type a row's name is set in, in the column, in a section's and in what a rail's section opens: the theme's `label` unless given. The current destination and the section that holds it are set a step heavier than it. A colour in it is not a row's, which is the row's state's.
- `titleTextStyle: TextStyle`: the type a group's title is set in, in capitals: the theme's `caption`, bold, unless given. It is written in the sidebar's quiet colour whatever colour it holds.

### SidebarGroup

`import com.pantrixui.components.navigation.sidebar.SidebarGroup`, from `com.pantrixui:components`

```kotlin
class SidebarGroup(
    public val items: List<SidebarItem>,
    public val title: String? = null
)
```

A run of a `PantrixSidebar`'s rows, with a line between it and the next, or its `title` over it.

Groups are how a sidebar says which destinations belong together, what the app is above and what it measures below. A group without a title is set apart by a line alone, and a sidebar of one such group draws no line at all. A group with a title opens with it, in small capitals in the quiet colour, as a documentation's "Getting started" and "Guides" do; a rail has no room for words, and draws the line there instead.

Parameters:

- `items: List<SidebarItem>`: The group's rows, in order.
- `title: String?`: What the group is called, over its rows in the column, or null for a line alone. It is written in capitals by the rules of the theme's language, and a screen reader hears it as a heading.

Another constructor:

```kotlin
constructor(vararg items: SidebarItem)
```

A group of `items`, in the order they are given, without a title.

Its parameters:

- `vararg items: SidebarItem`

### SidebarItem

`import com.pantrixui.components.navigation.sidebar.SidebarItem`, from `com.pantrixui:components`

```kotlin
class SidebarItem(
    public val key: String,
    public val label: String,
    public val icon: ImageVector? = null,
    public val children: List<SidebarItem> = emptyList(),
    public val detail: String? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

One row of a `PantrixSidebar`: a destination, or a section with the destinations inside it.

Parameters:

- `key: String`: What the sidebar's `selected` holds and its `onSelect` reports, and what its `expanded` holds for a section. It is the same in every language, so a translated screen still knows where it is.
- `label: String`: The visible text, and the row's name for a screen reader.
- `icon: ImageVector?`: Drawn before the label, in the label's colour, or null for none. A screen reader passes over it.
- `children: List<SidebarItem>`: The destinations inside this row. A row that has any is a section and no destination itself: a press opens and closes it. A sidebar is two levels and no more, so a child's own children are not drawn.
- `detail: String?`: A number or a state beside the label, "87 open", "48.2M requests", or null for none. It is drawn in what a rail's section opens, where there is room for it. The column is a list of places to go, and a run of figures down its side would read as data.
- `enabled: Boolean`: Whether the row can be pressed. One that cannot is written in the disabled text's colour. A section that cannot be pressed stays open or closed as the sidebar's `expanded` has it, and each destination inside it follows its own.
- `tagKey: String?`: The row's automation key, the same in every language, where it is to be another than `key`: a destination is `Item_<tagKey>` and a section `Section_<tagKey>`, inside the tag of a sidebar that has a key, as `Sidebar_main.Item_crashes`.

### SidebarSlotScope

`import com.pantrixui.components.navigation.sidebar.SidebarSlotScope`, from `com.pantrixui:components`

```kotlin
interface SidebarSlotScope : ColumnScope
```

What a sidebar's header and its footer are laid out in: a column as wide as the sidebar, which knows the shape the sidebar is drawn in.

A header lays itself out for the width it has, a mark alone on the rail and the mark with a name beside it in the column, and a footer does the same with an avatar.

Members:

- `collapsed: Boolean`: Whether the sidebar is drawn as its rail: because the caller said so, or because an adaptive sidebar took the rail by itself.

### SidebarFlyout

`import com.pantrixui.components.navigation.sidebar.SidebarFlyout`, from `com.pantrixui:components`

```kotlin
enum class SidebarFlyout
```

What a section of a collapsed `PantrixSidebar`, its rail, opens to show its destinations.

Entries:

- `Popup`: A card beside the section, as tall as what it holds. Where there is a pointer it is up while the pointer rests on the section or on the card, so that moving down the rail reads each section in turn; a press without a pointer, a finger's, the keyboard's or a screen reader's, opens it with the keyboard in it, until it is dismissed.
- `Panel`: The section's destinations in a column of their own against the rail, the column's width and the rail's height: a part of the sidebar, which is wider by it, so that the page beside it moves over and is not covered. It opens at a press, and not as a pointer passes. Choosing a destination, pressing the section again and Escape close it, and pressing another section shows that one's.

### SidebarStyle

`import com.pantrixui.components.navigation.sidebar.SidebarStyle`, from `com.pantrixui:components`

```kotlin
class SidebarStyle(
    public val width: Dp = Dp.Unspecified,
    public val collapsedWidth: Dp = Dp.Unspecified,
    public val rowHeight: Dp = Dp.Unspecified,
    public val childRowHeight: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val collapsedIconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val childIndent: Dp = Dp.Unspecified,
    public val guideWidth: Dp = Dp.Unspecified,
    public val markerSize: Dp = Dp.Unspecified
) : PantrixStyle<SidebarStyle>
```

`PantrixSidebar`'s geometry: its width as a column and as a rail, its rows at both levels, and the line that says a section's destinations are inside it.

The column's width is the same on every platform: what a sidebar holds is the same, and one that changed its width would move the app's whole layout with it. The rows and the room in them follow the density; the widths, the icons, the indent, the corners, the line and the mark do not. A sidebar's colours are not part of its style: they are the theme's, and `SidebarColors` where a sidebar has its own.

Parameters:

- `width: Dp`: How wide the sidebar is as a column, and how wide the column a rail's section opens beside it: 248dp.
- `collapsedWidth: Dp`: How wide the sidebar is as a rail of icons: 76dp on Android and iOS, 68dp on desktop, 72dp on the web.
- `rowHeight: Dp`: The least height of a top-level row, a destination's or a section's: 44dp on Android and iOS, 36dp on desktop, 40dp on the web. A row is never lower than the platform's touch target.
- `childRowHeight: Dp`: The least height of a destination inside a section: 40dp on Android and iOS, 32dp on desktop, 36dp on the web. It is never lower than the platform's touch target either.
- `shape: ShapeSpec`: The corners of a row's fill: medium on Android and iOS, small on desktop and the web.
- `horizontalPadding: Dp`: The room between the sidebar's edge and a row's fill, and again between the fill's edge and what the row holds: 12dp on Android and iOS, 10dp on desktop and the web.
- `iconSize: Dp`: A row's icon, and a section's chevron: 20dp on Android and iOS, 18dp on desktop and the web.
- `collapsedIconSize: Dp`: A row's icon on the rail, where the icon is the row: 24dp on Android and iOS, 22dp on desktop and the web.
- `iconGap: Dp`: The room between a row's icon and its label: 12dp on Android and iOS, 10dp on desktop and the web.
- `childIndent: Dp`: How far a destination inside a section starts in from where its section does: 32dp on Android and iOS, 28dp on desktop and the web.
- `guideWidth: Dp`: How thick the line down an open section's destinations is: 1dp.
- `markerSize: Dp`: How thick the bar on the rail's edge is, beside the row the app is at: 4dp.

### SidebarColors

`import com.pantrixui.components.navigation.sidebar.SidebarColors`, from `com.pantrixui:components`

```kotlin
data class SidebarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified,
    public val marker: Color = Color.Unspecified
)
```

What a `PantrixSidebar` is painted with, for a sidebar that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// The current destination in the success role, the rest as the theme has it.
PantrixSidebar(…, colors = SidebarColors(selectedContainer = PantrixTheme.colors.success.container))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the rows, unless `content` is given too, and a `selectedContainer` brings its pair for the current destination, unless `selectedContent` is given. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The sidebar's fill. The theme's `surface`.
- `content: Color`: A section's icon and name, and what the header and the footer hold where they give no colour of their own. The theme's `textPrimary`. A destination that is not the current one, and a section's chevron, are the theme's `textSecondary` on the theme's own fill, and this colour on a fill of the caller's.
- `selectedContainer: Color`: The fill behind the current destination. The primary role's `container`.
- `selectedContent: Color`: The current destination's icon and label: the colour that reads on `selectedContainer`. The primary role's `onContainer`.
- `divider: Color`: The lines between the header, the groups, the pinned destinations and the footer, the line down an open section's destinations, and the edge of what a rail's section opens. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`: the edge a subtle button has.
- `marker: Color`: The bar on the rail's edge beside the row the app is at. The primary role's `color` on the theme's own fill, and `content` on a fill of the caller's.
