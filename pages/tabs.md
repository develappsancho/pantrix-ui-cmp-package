# Tabs

A row of tabs that switches between views of the same content: one is selected, and an indicator slides to the one selected next.

The tabs are only the row; the app draws the selected view itself, below the row. Which tab is selected is the screen's state too: the row is given its index (`selectedIndex`), and reports back the one the user chose (`onSelect`). The row selects nothing by itself.

- `PantrixTabs` (`com.pantrixui.components.container.tab`, `com.pantrixui:components`): A row of tabs that switches between views of the same content, one selected; the arrow keys move the selection. Keywords: tab row, tab strip, tabbed view, tab layout, page tabs, top tabs.

## Features

- **Indicator.** The style's `indicator` marks the selected tab: a line under it, a line over it, a pill behind it, or its colour alone. The indicator slides when the selection changes; in a theme with reduced motion it takes its place at once.
- **A shared row, or one that scrolls.** The tabs share the row's width. With `scrollable` each is as wide as its label and the row scrolls sideways: it opens on the selected tab, and brings each tab selected after that to its middle.
- **Icon and badge.** `TabItem.icon` stands before the label and `TabItem.badge` after it: a count or a dot. Where the tab is narrow it is the label that is cut, and the badge stays whole.
- **Disabled tab.** A press does nothing on a tab whose `enabled` is false, the arrow keys skip it, and it is drawn in the theme's disabled text colour whatever colour is given.
- **Keyboard.** The row is one stop for the Tab key, on the selected tab. The arrow keys select the next and the previous tab, the other way round in a right-to-left layout; Home and End the first and the last. While a tab has the focus, the focus goes with the selection.
- **Screen reader.** Each tab is a tab that says whether it is selected, and together they are one group. The badge's description is read after the label, as a part of the tab.
- **Platform.** A tab's least height is 48dp on Android, 44dp on iOS, and 40dp on the desktop and the web; a tab is never shorter than the platform's touch target.
- **Colour.** The row has no fill of its own: it sits on the page or on a surface. `TabsColors` gives the colours of the selected tab and of the others, of the indicator, and of the hairline below.
- **Automation.** With a `tagKey` the row is `Tabs_<tagKey>` and its tabs are `Tabs_<tagKey>.Tab_<key>`. A selection is reported with the tab's index and whether a press or a key made it; never with its label.

## Usage

### Views of one account

```kotlin
var tab by rememberSaveable { mutableIntStateOf(0) }
Column {
    PantrixTabs(
        tabs = listOf(
            TabItem(stringResource(Res.string.overview), tagKey = "overview"),
            TabItem(stringResource(Res.string.activity), tagKey = "activity"),
            TabItem(stringResource(Res.string.settings), tagKey = "settings")
        ),
        selectedIndex = tab,
        onSelect = { tab = it },
        tagKey = "account"
    )
    when (tab) {
        0 -> AccountOverview()
        1 -> AccountActivity()
        else -> AccountSettings()
    }
}
```

### Many categories in a row that scrolls

```kotlin
PantrixTabs(
    tabs = categories.map { TabItem(it.name, icon = it.icon, tagKey = it.id) },
    selectedIndex = categories.indexOf(current),
    onSelect = { current = categories[it] },
    scrollable = true,
    tagKey = "categories"
)
```

### A count on a tab, which a screen reader hears after its label

```kotlin
PantrixTabs(
    tabs = listOf(
        TabItem(stringResource(Res.string.all), tagKey = "all"),
        TabItem(
            label = stringResource(Res.string.unread),
            tagKey = "unread",
            badge = TabBadge(
                contentDescription = pluralStringResource(Res.plurals.unread_messages, unread, unread),
                count = unread
            )
        )
    ),
    selectedIndex = tab,
    onSelect = { tab = it },
    tagKey = "inbox"
)
```

### A pill for the selected tab, as a segmented control has

```kotlin
PantrixTabs(
    tabs = listOf(
        TabItem(stringResource(Res.string.day), tagKey = "day"),
        TabItem(stringResource(Res.string.week), tagKey = "week"),
        TabItem(stringResource(Res.string.month), tagKey = "month")
    ),
    selectedIndex = period.ordinal,
    onSelect = { period = Period.entries[it] },
    style = TabsStyle(indicator = TabIndicator.Pill),
    tagKey = "period"
)
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixTabs(
    tabs = views,
    selectedIndex = view,
    onSelect = { view = it },
    colors = TabsColors(selectedContent = success.color, indicator = success.color),
    tagKey = "account"
)
```

## Examples

### Views of a profile

At its plainest: three tabs that share the row's width equally, and the selected view below them. The selected tab's index is the screen's state; it is kept with `rememberSaveable`, and is not lost when the screen rotates.

The tabs do not draw the view: the text below them is chosen here, with `when`. The default indicator is the line under the selected tab.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var tab by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = listOf(
        TabItem(label = "General", tagKey = "general"),
        TabItem(label = "Security", tagKey = "security"),
        TabItem(label = "Notifications", tagKey = "notifications")
    ),
    selectedIndex = tab,
    onSelect = { tab = it },
    tagKey = "profile"
)
PantrixText(
    text = when (tab) {
        0 -> "Name, email and language"
        1 -> "Password and two-step verification"
        else -> "Which notifications you get"
    },
    color = PantrixTheme.colors.textSecondary
)
```

### Tabs with badges

`TabItem.badge` puts a `TabBadge` after the label: a number where `count` is given, a dot where it is not. The "Activity" tab shows the number of unseen transactions; when the tab is opened the number goes to zero and the badge goes away. The dot on "Settings" says an update is waiting.

A screen reader reads the badge's `contentDescription` after the tab's name: "Activity, 3 new transactions". A number alone says nothing of what it counts; that is why the description has no default, and giving null is a decision.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabBadge
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var view by rememberSaveable { mutableIntStateOf(0) }
var unseen by rememberSaveable { mutableIntStateOf(3) }
PantrixTabs(
    tabs = listOf(
        TabItem(label = "Overview", tagKey = "overview"),
        TabItem(
            label = "Activity",
            tagKey = "activity",
            badge = if (unseen > 0) TabBadge(contentDescription = "$unseen new transactions", count = unseen) else null
        ),
        TabItem(
            label = "Settings",
            tagKey = "settings",
            badge = TabBadge(contentDescription = "Update available", tone = BadgeTone.Primary)
        )
    ),
    selectedIndex = view,
    onSelect = { chosen ->
        view = chosen
        if (chosen == 1) unseen = 0
    },
    tagKey = "account"
)
PantrixText(
    text = when (view) {
        0 -> "Account overview: balance and recent transactions"
        1 -> "Transactions of the last thirty days"
        else -> "Notifications, language and privacy"
    },
    color = PantrixTheme.colors.textSecondary
)
```

### The selected tab's indicator

The style says what marks the selected tab: `TabsStyle(indicator = ...)`. The four rows show the same selection, each with the name of its indicator written above it; press another tab in one of them, and all four change together.

`Underline` is the default on every platform: a line along the selected tab's bottom edge. `Top` puts the same line along the top edge, for a row that sits below what it switches. `Pill` puts a pill in the primary role's pale fill behind the selected tab, and does not draw the hairline under the row: it is how iOS draws its segmented control, and here it picks a chart's period. `None` draws no indicator; the selected tab is marked by its colour alone.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabIndicator
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.container.tab.TabsStyle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var period by rememberSaveable { mutableIntStateOf(1) }
val caption = PantrixTheme.typography.caption
val quiet = PantrixTheme.colors.textSecondary
PantrixText(text = "Underline", style = caption, color = quiet)
PantrixTabs(tabs = PERIODS, selectedIndex = period, onSelect = { period = it }, tagKey = "underline")
PantrixText(text = "Top", style = caption, color = quiet)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.Top),
    tagKey = "top"
)
PantrixText(text = "Pill", style = caption, color = quiet)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.Pill),
    tagKey = "period"
)
PantrixText(text = "None", style = caption, color = quiet)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.None),
    tagKey = "none"
)

private val PERIODS = listOf(
    TabItem(label = "Day", tagKey = "day"),
    TabItem(label = "Week", tagKey = "week"),
    TabItem(label = "Month", tagKey = "month")
)
```

### Categories with icons in a row that scrolls

More categories than the row has room for, each with its icon. With `scrollable = true` each tab is as wide as its label and the row scrolls sideways. The selected tab comes to the middle of the row, so that the tabs on both sides of it can be seen and pressed.

The count on "Inbox" is over the largest number that is written: "99+". The last category is disabled: it cannot be pressed, and the arrow keys skip it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabBadge
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.foundation.icons.PantrixIcons

var category by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = CATEGORIES,
    selectedIndex = category,
    onSelect = { category = it },
    scrollable = true,
    tagKey = "categories"
)

private val CATEGORIES = listOf(
    TabItem(
        label = "Inbox",
        icon = PantrixIcons.Inbox,
        tagKey = "inbox",
        badge = TabBadge(contentDescription = "More than 99 unread messages", count = 128)
    ),
    TabItem(label = "Starred", icon = PantrixIcons.Star, tagKey = "starred"),
    TabItem(label = "Folders", icon = PantrixIcons.Folder, tagKey = "folders"),
    TabItem(label = "People", icon = PantrixIcons.Person, tagKey = "people"),
    TabItem(label = "Calendar", icon = PantrixIcons.Calendar, tagKey = "calendar"),
    TabItem(label = "Search", icon = PantrixIcons.Search, tagKey = "search"),
    TabItem(label = "Archive", icon = PantrixIcons.Folder, enabled = false, tagKey = "archive")
)
```

### With pages that are swiped

The app changes the selection as much as the user does. Here the selected tab is a pager's page: swipe the page sideways, and the indicator slides to the new tab. When a tab is pressed the tabs only report which one; it is the code in `onSelect` that turns the page.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.text.PantrixText
import kotlinx.coroutines.launch

val pager = rememberPagerState { 3 }
val scope = rememberCoroutineScope()
PantrixTabs(
    tabs = listOf(
        TabItem(label = "Photos", tagKey = "photos"),
        TabItem(label = "Videos", tagKey = "videos"),
        TabItem(label = "Documents", tagKey = "documents")
    ),
    selectedIndex = pager.currentPage,
    onSelect = { scope.launch { pager.animateScrollToPage(it) } },
    tagKey = "library"
)
HorizontalPager(state = pager, modifier = Modifier.height(96.dp)) { page ->
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        PantrixText(
            text = when (page) {
                0 -> "248 photos"
                1 -> "12 videos"
                else -> "37 documents"
            }
        )
    }
}
```

### With no tab selected

When `selectedIndex` is an index outside the tabs, no tab is selected and no indicator is drawn: the app is in a place that is no tab's view. Press the button: the selection goes. Press a tab: it comes back.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var view by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = listOf(
        TabItem(label = "Feed", tagKey = "feed"),
        TabItem(label = "Explore", tagKey = "explore"),
        TabItem(label = "Saved", tagKey = "saved")
    ),
    selectedIndex = view,
    onSelect = { view = it },
    tagKey = "home"
)
PantrixButton(
    text = "Open search results",
    onClick = { view = -1 },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "tabs_open_search"
)
PantrixText(
    text = if (view < 0) "Search results are open: no tab is selected" else "A tab's view is open",
    color = PantrixTheme.colors.textSecondary
)
```

### In its own colours

With `colors` the row takes the colours it is given, not the theme's. The first row is given the colour of the selected tab and of the line; the tabs that are not selected and the hairline below stay in the theme's colours. The badge of the "Pending" tab, too, is filled with the colour it is given and not with its tone's.

The second row is a row of pills, and only the pill's fill is given. That fill is the colour of one of the theme's roles, so the theme pairs the selected label's colour with it. On a fill no role has, `selectedContent` is given as well.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabBadge
import com.pantrixui.components.container.tab.TabIndicator
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.container.tab.TabsColors
import com.pantrixui.components.container.tab.TabsStyle
import com.pantrixui.components.elements.badge.BadgeColors
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var order by rememberSaveable { mutableIntStateOf(0) }
var period by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = listOf(
        TabItem(
            label = "Pending",
            tagKey = "pending",
            badge = TabBadge(
                contentDescription = "2 pending orders",
                count = 2,
                colors = BadgeColors(container = own.color, content = own.onColor)
            )
        ),
        TabItem(label = "Shipped", tagKey = "shipped"),
        TabItem(label = "Delivered", tagKey = "delivered")
    ),
    selectedIndex = order,
    onSelect = { order = it },
    colors = TabsColors(selectedContent = own.color, indicator = own.color),
    tagKey = "orders"
)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.Pill),
    colors = TabsColors(indicator = PantrixTheme.colors.success.container),
    tagKey = "success_pill"
)

private val PERIODS = listOf(
    TabItem(label = "Day", tagKey = "day"),
    TabItem(label = "Week", tagKey = "week"),
    TabItem(label = "Month", tagKey = "month")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixTabs

`import com.pantrixui.components.container.tab.PantrixTabs`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTabs(
    tabs: List<TabItem>,
    selectedIndex: Int,
    onSelect: (index: Int) -> Unit,
    modifier: Modifier = Modifier,
    scrollable: Boolean = false,
    style: TabsStyle? = null,
    colors: TabsColors? = null,
    tagKey: String? = null
)
```

A row of tabs that switches between views of the same content: one is selected, and a mark slides to the one selected next.

What marks the selected tab is the style's `TabsStyle.indicator`: a line under it, a line over it, a pill behind it, or its colour alone. The mark is where its tab is. It follows the tab when the row changes size, and slides only when the selection changes: at once under reduced motion.

The row is one stop for Tab, on the selected tab, as the WAI-ARIA tabs pattern has it. The arrow keys select the next or the previous tab, the other way round in a right-to-left layout, and Home and End the first and the last; a tab that is disabled is skipped. While a tab has the focus, the focus goes with the selection, whoever makes it: a key, a press, or the app, as when a pager is swiped to the next view. A press on a tab asks for it, and the focus goes to the row's one stop, the selected tab, where a press can take the focus. For a screen reader each tab is a tab that says whether it is selected, in one group.

A tab may carry a badge after its label, a count or a dot: `TabItem.badge`. A screen reader hears the badge's description after the label, as a part of the tab.

With `scrollable`, each tab is as wide as its label and the row scrolls sideways. It opens on the selected tab, and brings the one selected next to its middle, so that the tabs on both sides of it can be seen and pressed.

A tab is at least as tall as the platform's touch target, whatever the style's height and the density say. The row has no fill of its own: it sits on the page or on a surface, and its labels read on both. The tabs are only the row: the view that `selectedIndex` stands for is the app's, below it.

Parameters:

- `tabs: List<TabItem>`: the tabs, in order.
- `selectedIndex: Int`: the selected tab's index. Outside `tabs`, no tab is selected and no mark is drawn.
- `onSelect: (index: Int) -> Unit`: called with the index of the tab the user chose, by a press or by the keys, whether or not it is selected already. The row selects nothing by itself: a tab is selected when `selectedIndex` says so.
- `modifier: Modifier`: the row's modifier. The row fills the width it is given.
- `scrollable: Boolean`: false shares the row's width between the tabs. True makes each as wide as its label, at least the style's `minTabWidth`, in a row that scrolls sideways and keeps the selected tab in its middle.
- `style: TabsStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TabsColors?`: this row's own colours: the ones it sets, with the theme's for the rest. A disabled tab keeps the theme's.
- `tagKey: String?`: the row's automation key: the row is `Tabs_<tagKey>`, and its tabs are named inside it, `Tabs_<tagKey>.Tab_<key>`, so that two rows with the same tabs are told apart. A selection is reported as a `Tabs` event that carries the tab's index and whether a press or a key chose it, and never its label.

### TabItem

`import com.pantrixui.components.container.tab.TabItem`, from `com.pantrixui:components`

```kotlin
class TabItem(
    public val label: String,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null,
    public val badge: TabBadge? = null
)
```

One tab of `PantrixTabs`: its label, an icon before it, a badge after it, and a key for automation.

Parameters:

- `label: String`: The visible text, and the tab's name for a screen reader.
- `icon: ImageVector?`: Drawn before the label, in the label's colour, or null for none.
- `enabled: Boolean`: Whether the tab can be selected. A press does nothing on one that cannot, and the arrow keys skip it.
- `tagKey: String?`: The tab's automation key, the same in every language: the tab is `Tab_<tagKey>`, or `Tab_<index>` without one, inside the tag of a row that has a key: `Tabs_mail.Tab_inbox`.
- `badge: TabBadge?`: A count or a dot after the label, or null for none.

### TabBadge

`import com.pantrixui.components.container.tab.TabBadge`, from `com.pantrixui:components`

```kotlin
class TabBadge(
    public val contentDescription: String?,
    public val count: Int? = null,
    public val tone: BadgeTone = BadgeTone.Danger,
    public val colors: BadgeColors? = null
)
```

A badge on a tab of `PantrixTabs`: a count, or a dot where there is nothing to count.

The badge comes after the tab's label, and takes its room from the label where the tab is narrow: a long label is cut, and the badge is whole. It is a `PantrixBadge`, as large as that is and in its colours, on a tab of any state.

A screen reader hears `contentDescription` after the tab's label, as a part of the tab: "Inbox, 3 unread". A number alone would say nothing of what it counts, so the badge is silent without one, which is right only where the label says it already. It has no default for that reason: null is a decision.

Parameters:

- `contentDescription: String?`: What a screen reader says of the badge, after the tab's label, or null to say nothing.
- `count: Int?`: The number to show, or null for a dot. It is capped as a badge's is: `99+`.
- `tone: BadgeTone`: The colour role the badge is filled from.
- `colors: BadgeColors?`: The badge's own colours, in place of its tone's: the ones it sets, with the tone's for the rest.

### TabIndicator

`import com.pantrixui.components.container.tab.TabIndicator`, from `com.pantrixui:components`

```kotlin
enum class TabIndicator
```

How `PantrixTabs` marks the selected tab.

Entries:

- `Underline`: A line along the selected tab's bottom edge, over the hairline under the row. The default on every platform.
- `Top`: The same line along the tab's top edge, for a row that sits below what it switches.
- `Pill`: A pill in the primary role's container behind the selected tab, inset by the style's `indicatorPadding`. A row of pills draws no hairline: it is a control of its own, not a heading over the content.
- `None`: No indicator: the selected tab is marked by its colour alone.

### TabsStyle

`import com.pantrixui.components.container.tab.TabsStyle`, from `com.pantrixui:components`

```kotlin
class TabsStyle(
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val indicatorHeight: Dp = Dp.Unspecified,
    public val minTabWidth: Dp = Dp.Unspecified,
    public val edgePadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val indicator: TabIndicator? = null,
    public val indicatorPadding: Dp = Dp.Unspecified
) : PantrixStyle<TabsStyle>
```

`PantrixTabs`' geometry, and how it marks the selected tab.

Fixed tabs share the row's width. Scrollable tabs are as wide as their labels, at least `minTabWidth`, with `edgePadding` before the first and after the last. The air follows the density: `height`, `horizontalPadding`, `edgePadding`, `iconGap` and `indicatorPadding`. The indicator's thickness, the icon's size and the least a tab is wide do not. The tabs' colours are not part of the style: they come from the theme, and from `TabsColors` where a row has its own.

Android follows Material 3's primary tabs, with the icon before the label. iOS has no tab row of its own, since a segmented control does that job there, which `TabIndicator.Pill` draws; its values and the desktop's are Pantrix's own.

Parameters:

- `height: Dp`: The least a tab is tall: 48dp on Android, 44dp on iOS, 40dp on desktop and the web. A tab is never shorter than the platform's touch target, whatever this says.
- `horizontalPadding: Dp`: Inside a tab, before its icon or label and after its label.
- `indicatorHeight: Dp`: How thick a `TabIndicator.Underline` or a `TabIndicator.Top` line is.
- `minTabWidth: Dp`: The least a scrollable tab is wide.
- `edgePadding: Dp`: Before the first scrollable tab and after the last.
- `iconSize: Dp`: The size of a tab's icon.
- `iconGap: Dp`: Between a tab's icon and its label, and between its label and its badge.
- `indicator: TabIndicator?`: What marks the selected tab.
- `indicatorPadding: Dp`: Between a `TabIndicator.Pill` and the edges of the tab it marks.

### TabsColors

`import com.pantrixui.components.container.tab.TabsColors`, from `com.pantrixui:components`

```kotlin
data class TabsColors(
    public val selectedContent: Color = Color.Unspecified,
    public val unselectedContent: Color = Color.Unspecified,
    public val indicator: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

What `PantrixTabs` is painted with, for a row that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role.

```kotlin
PantrixTabs(
    tabs = views,
    selectedIndex = view,
    onSelect = { view = it },
    colors = TabsColors(selectedContent = brand, indicator = brand)
)
```

They are the colours of tabs that can be selected. A disabled tab is drawn in the theme's disabled text colour whatever is given here.

Parameters:

- `selectedContent: Color`: The label and the icon of the selected tab. The theme's `primary`, and on a pill the primary role's `onContainer`, the colour paired with the pill's fill. A pill given an `indicator` that is one of the theme's own colours brings the colour the theme pairs with it; for one no role has, give this with it.
- `unselectedContent: Color`: The label and the icon of the other tabs. The theme's `textSecondary`.
- `indicator: Color`: What marks the selected tab: the line under or over it, or the pill behind it. The theme's `primary`, and for a pill the primary role's `container`.
- `divider: Color`: The hairline under the row, which a row of pills does not draw. The theme's `divider` on the theme's own grounds. A row of tabs has no fill of its own: on a fill, where that line would not read, a share of what is written there.
