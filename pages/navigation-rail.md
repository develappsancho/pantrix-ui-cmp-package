# Navigation Rail

The app's top-level destinations down the start edge of a wide window, one under another: the navigation bar's place on a tablet, an open foldable and a desktop window. The rail takes a bar's destinations and its colours: a screen that shows the bar in a narrow window and the rail in a wide one gives both the same list.

Here the rails stand inside the page, in a bordered frame of a set height. On a real screen the rail is the side bar of a `PantrixScaffold`: it is as tall as the window, and its fill runs behind the system bars.

- `PantrixNavigationRail` (`com.pantrixui.components.navigation.navigationrail`, `com.pantrixui:components`): The app's top-level destinations down the start edge of a wide window, one of them marked as where the app is, under an optional header: a navigation bar's destinations, stood on their side. Keywords: side navigation, rail, vertical navigation, tablet navigation, nav rail.

## Features

- **The same destinations as a bar.** `items` is a list of `NavigationItem`: the icon, the label, the badge, another icon while selected and a destination that cannot be pressed are as in a bar. A rail takes three to seven destinations.
- **The state is the screen's.** `selected` is the key of the current destination, and `onSelect` reports that of the one that is pressed; a press on the current destination is reported too. With `selected` null, no destination is marked.
- **Header.** `header` stands over the destinations, in the middle of the rail: a button that opens the menu, or the screen's main action.
- **Destinations that scroll.** Where the destinations are taller than the rail they scroll by themselves; the header stays where it is.
- **Height.** The rail is as tall as the room it is given, and that room has to have an end: a scaffold's side bar has one; inside a page that scrolls it takes a box of a set height.
- **A pill, or colour alone.** The current destination is marked by the pill behind its icon; by its colour alone where the `indicator` field of `NavigationRailStyle` is `NavigationIndicator.None`.
- **The same on every platform.** 80dp wide, with a hairline along its end edge; the destinations are 56dp tall and 4dp apart. `style` changes the sizes, `labelStyle` the label's type.
- **Colours.** `NavigationColors` is the same class as the bar's: one set of colours paints both components.
- **System bars.** `insets` is the room the rail keeps clear at its top, its bottom and its start edge: the fill runs behind that room, and the destinations stay out of it.
- **Screen reader and right to left.** A destination is read as a tab: its name, what its badge says, and whether it is selected. In languages read from right to left the rail is at the right edge, and its line moves to its left edge.

## Usage

### A rail in a wide window and a bar in a narrow one, from one list

```kotlin
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Start ->
                PantrixNavigationRail(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
            ScaffoldNavigationPlacement.Bottom ->
                PantrixNavigationBar(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
            ScaffoldNavigationPlacement.VerticalBar -> PantrixNavigationBar(
                items = destinations,
                selected = where,
                onSelect = onNavigate,
                orientation = NavigationBarOrientation.Vertical
            )
        }
    }
) { padding ->
    Destination(where, Modifier.padding(padding))
}
```

### A menu button over the destinations

```kotlin
PantrixNavigationRail(
    items = destinations,
    selected = where,
    onSelect = onNavigate,
    header = {
        PantrixIconButton(
            imageVector = PantrixIcons.Menu,
            contentDescription = stringResource(Res.string.open_menu),
            onClick = onOpenMenu,
            tagKey = "menu"
        )
    },
    tagKey = "main"
)
```

## Examples

### Three destinations

At its plainest: the list of destinations (`items`), the key of the current destination (`selected`) and `onSelect`, which is told the key of the destination that is pressed. The destinations stand one under another from the top; each is as wide as the rail, so a press beside the icon is a press on the destination too.

The rail is as tall as the frame (240dp): in a place that has no height of its own, inside a page that scrolls, it has to be given one.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val destinations = listOf(
    NavigationItem(key = "files", label = "Files", icon = PantrixIcons.Folder),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "profile", label = "Profile", icon = PantrixIcons.Person)
)
var where by rememberSaveable { mutableStateOf("files") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(240.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = destinations,
            selected = where,
            onSelect = { where = it },
            tagKey = "plain"
        )
        PantrixText(
            text = "Open destination: ${destinations.first { it.key == where }.label}",
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Three destinations under a menu button

`header` stands over the destinations, in the middle of the rail: here, a button that opens the menu. Press it and the area beside the rail counts.

The destinations are a mail app's. The badge on "Inbox" counts the unread: when the destination is opened the count goes to zero and the badge goes away. A screen reader reads the badge after the destination's name: "Inbox, 3 unread".

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("starred") }
var unread by rememberSaveable { mutableIntStateOf(3) }
var menus by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(440.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = listOf(
                NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
                NavigationItem(
                    key = "inbox",
                    label = "Inbox",
                    icon = PantrixIcons.Inbox,
                    badge = if (unread > 0) NavigationBadge("$unread unread", count = unread) else null
                ),
                NavigationItem(key = "profile", label = "Profile", icon = PantrixIcons.Person)
            ),
            selected = where,
            onSelect = { key ->
                where = key
                if (key == "inbox") unread = 0
            },
            header = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Menu,
                    contentDescription = "Open menu",
                    onClick = { menus++ },
                    tagKey = "rail_menu"
                )
            },
            tagKey = "mail"
        )
        PantrixText(
            text = when (where) {
                "starred" -> "Starred messages"
                "inbox" -> "Inbox: nothing left unread"
                else -> "Profile and settings"
            } + if (menus > 0) "\nTimes the menu was opened: $menus" else "",
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### The destinations scroll in a short rail

Seven destinations in a rail of 220dp: the most a rail takes, in a place too short to show them all. The destinations scroll by themselves; the button in the header does not scroll, it stays where it is. Scroll the rail up: it goes down as far as "About".

The badge on "Folders" is a dot, the 128 on "Profile" becomes "99+", and "Calendar" cannot be pressed.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(220.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN,
            selected = where,
            onSelect = { where = it },
            header = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Menu,
                    contentDescription = "Open menu",
                    onClick = {},
                    tagKey = "short_menu"
                )
            },
            tagKey = "short"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Folders",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "New files")
    ),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Calendar", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profile",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 notifications", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Inbox", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "About", icon = PantrixIcons.Info)
)
```

### By colour alone

With `NavigationIndicator.None` no pill is drawn: the current destination's icon and label are in the theme's `primary` colour, and the others in the secondary text colour. The press and the focus ring are still drawn in the pill's room.

The frame is 440dp: the seven destinations fit at their preset sizes and the rail does not scroll.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.NavigationRailStyle
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(440.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN,
            selected = where,
            onSelect = { where = it },
            style = NavigationRailStyle(indicator = NavigationIndicator.None),
            tagKey = "tint"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Folders",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "New files")
    ),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Calendar", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profile",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 notifications", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Inbox", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "About", icon = PantrixIcons.Info)
)
```

### Style: width, gaps and the label's type

`style` changes the rail's sizes, `labelStyle` the type the labels are set in; only the fields that are given change. The first rail is the preset: 80dp wide, its destinations 56dp tall and 4dp apart. The second is 96dp wide, its destinations 64dp tall and 12dp apart, 16dp in from the top and the bottom; its labels are set in `caption`.

The second rail has no line along its end edge either: `divider = false`.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.NavigationRailStyle
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val destinations = SEVEN.take(4)
var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(340.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = destinations,
            selected = where,
            onSelect = { where = it },
            tagKey = "usual"
        )
        PantrixNavigationRail(
            items = destinations,
            selected = where,
            onSelect = { where = it },
            labelStyle = PantrixTheme.typography.caption,
            style = NavigationRailStyle(
                width = 96.dp,
                itemMinHeight = 64.dp,
                itemSpacing = 12.dp,
                verticalPadding = 16.dp,
                divider = false
            ),
            tagKey = "wide"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Folders",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "New files")
    ),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Calendar", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profile",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 notifications", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Inbox", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "About", icon = PantrixIcons.Info)
)
```

### On a role's fill, with its header

Where `container` is one of the theme's role colours, the theme knows what reads on it: `content` was not given, and the destinations were written in the colour the theme pairs with the role's. The destination that cannot be pressed is written in a share of that colour, and the line along the edge comes from it too.

The icon and the text in the header name no colour either: on the theme's own fill they would be in their own default colours, and here they are in the colour that is written on the rail.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(340.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN.take(4),
            selected = where,
            onSelect = { where = it },
            colors = NavigationColors(container = PantrixTheme.colors.primary.color),
            header = {
                PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
                PantrixText(text = "Acme", style = PantrixTheme.typography.footnote)
            },
            tagKey = "role"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Folders",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "New files")
    ),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Calendar", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profile",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 notifications", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Inbox", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "About", icon = PantrixIcons.Info)
)
```

### In its own colours

A rail in a colour the theme does not have: the app's own purple. The fill (`container`) and the colour that reads on it (`content`) are given together; the other destinations, the one that cannot be pressed and the line along the edge come from that colour. The pill and the icon on it were given too (`selectedContainer`, `selectedContent`).

The same `NavigationColors` can be given to a `PantrixNavigationBar` too: the bar and the rail are painted with one set of colours.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(440.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN,
            selected = where,
            onSelect = { where = it },
            colors = NavigationColors(
                container = own.color,
                content = own.onColor,
                selectedContainer = own.container,
                selectedContent = own.onContainer
            ),
            tagKey = "own"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Folders",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "New files")
    ),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Calendar", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profile",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 notifications", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Inbox", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "About", icon = PantrixIcons.Info)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Behind the system bars

`insets` is the room the rail keeps clear at its top, its bottom and its start edge: the fill runs behind that room, and the header and the destinations stay out of it. On a real screen `PantrixScaffold` gives the insets to its side bar, and the rail runs behind the system bars.

There is no scaffold here: the 24dp strip at the top stands in for the system's status bar. The rail's fill goes on behind the strip, and the menu button starts under it.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(340.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN.take(4),
            selected = where,
            onSelect = { where = it },
            header = {
                PantrixIconButton(imageVector = PantrixIcons.Menu, contentDescription = "Open menu", onClick = {}, tagKey = "menu")
            },
            insets = PaddingValues(top = 24.dp),
            tagKey = "insets"
        )
    }
    // A strip in the place of the system's status bar: the rail's fill goes on behind it.
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(24.dp)
            .background(PantrixTheme.colors.textSecondary.copy(alpha = 0.16f))
    )
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Folders",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "New files")
    ),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Calendar", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profile",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 notifications", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Inbox", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "About", icon = PantrixIcons.Info)
)
```

## API

### PantrixNavigationRail

`import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixNavigationRail(
    items: List<NavigationItem>,
    selected: String?,
    onSelect: (key: String) -> Unit,
    modifier: Modifier = Modifier,
    labelStyle: TextStyle = PantrixTheme.typography.footnote,
    style: NavigationRailStyle? = null,
    colors: NavigationColors? = null,
    header: (@Composable ColumnScope.() -> Unit)? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null
)
```

The app's top-level destinations down the start edge of a wide window, with the one the app is at marked: the navigation bar's place on a tablet, an open foldable or a desktop window.

It takes a bar's destinations and is told where the app is as a bar is: the key of the current destination in `selected`, and a press reported in `onSelect`, the current destination's too. A screen that shows a bar in a narrow window and a rail in a wide one gives both the one list, and the one set of colours.

The destinations stand one under another from the top, under an optional `header`: a button that opens a menu, or the screen's main action. Where they are taller than the rail they scroll, and the header stays. A destination is a tab to a screen reader, which says its label, then what its badge says, and whether it is the one selected.

The rail is as tall as the room it is given, which has to have an end: a scaffold's side bar has. There it is given the scaffold's `insets`: its fill runs behind the system's bars, and what it holds stays clear of them.

Parameters:

- `items: List<NavigationItem>`: the destinations, in order: three to seven of them is what a rail is made for, though nothing counts them.
- `selected: String?`: the key of the destination the app is at, or null where it is at none of them.
- `onSelect: (key: String) -> Unit`: told the key of a destination that is pressed, the current one's too.
- `modifier: Modifier`: applied to the rail.
- `labelStyle: TextStyle`: the type the labels are set in: the theme's `footnote` unless given. Their colour is the rail's.
- `style: NavigationRailStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: NavigationColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `header: (@Composable ColumnScope.() -> Unit)?`: over the destinations, in the middle of the rail's width. A text or an icon in it that names no colour of its own has its own default on the theme's fill, and what is written on the rail on a fill of the caller's.
- `insets: PaddingValues`: the room the rail keeps clear at its top, its bottom and its start, with its fill behind it: what a scaffold gives its side bar.
- `tagKey: String?`: a locale-independent key for automation: the rail's tag is `NavigationRail_<tagKey>`, and its destinations are named inside it, `NavigationRail_<tagKey>.Item_<destination's key>`.

### NavigationItem

`import com.pantrixui.components.navigation.common.NavigationItem`, from `com.pantrixui:components`

```kotlin
class NavigationItem(
    public val key: String,
    public val label: String,
    public val icon: ImageVector,
    public val selectedIcon: ImageVector? = null,
    public val badge: NavigationBadge? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

One of the app's top-level destinations: an icon with its label under it. A navigation bar and a navigation rail take the same destinations, so a screen can show one list of them along the bottom of a narrow window and down the side of a wide one.

Parameters:

- `key: String`: What the bar's or the rail's `selected` holds and its `onSelect` reports. It is the same in every language, so a translated screen still knows where it is, and the same destination has the same key wherever it is shown.
- `label: String`: The visible text under the icon, and the destination's name for a screen reader.
- `icon: ImageVector`: Drawn over the label, in the colour of what the destination is. A screen reader passes over it.
- `selectedIcon: ImageVector?`: Drawn in place of `icon` while the app is at this destination, a filled form of it, or null for the same icon.
- `badge: NavigationBadge?`: A count or a dot on the icon, or null for none.
- `enabled: Boolean`: Whether the destination can be pressed. One that cannot is drawn in the disabled text's colour.
- `tagKey: String?`: The destination's automation key, the same in every language, where it is to be another than `key`: the destination is `Item_<tagKey>`, inside the tag of a bar or a rail that has a key, as `NavigationBar_main.Item_inbox`.

### NavigationBadge

`import com.pantrixui.components.navigation.common.NavigationBadge`, from `com.pantrixui:components`

```kotlin
class NavigationBadge(
    public val contentDescription: String?,
    public val count: Int? = null,
    public val tone: BadgeTone = BadgeTone.Danger,
    public val colors: BadgeColors? = null
)
```

A badge on a destination of a navigation bar or a navigation rail: a count, or a dot where there is nothing to count.

The badge is on the destination's icon, at the corner where lines end, with its top level with the icon's: it stays inside a bar. It is a `PantrixBadge`, as large as that is and in its colours, on a destination of any state.

A screen reader hears `contentDescription` after the destination's label, as a part of the destination: "Inbox, 3 unread". The badge is over the label, and the destination says the two itself so that the name comes first. A number alone would say nothing of what it counts, so the badge is silent without a description, which is right only where the label says it already. It has no default for that reason: null is a decision.

Parameters:

- `contentDescription: String?`: What a screen reader says of the badge, after the destination's label, or null to say nothing.
- `count: Int?`: The number to show, or null for a dot. It is capped as a badge's is: `99+`.
- `tone: BadgeTone`: The colour role the badge is filled from.
- `colors: BadgeColors?`: The badge's own colours, in place of its tone's: the ones it sets, with the tone's for the rest.

### NavigationIndicator

`import com.pantrixui.components.navigation.common.NavigationIndicator`, from `com.pantrixui:components`

```kotlin
enum class NavigationIndicator
```

What marks the destination the app is at, in a navigation bar or a navigation rail.

Entries:

- `Pill`: A pill behind the destination's icon, in the primary role's container: every platform's own bar and rail.
- `None`: No shape: the destination's icon and its label are in the brand's colour, as a tab bar's are on iOS. A style that asks for it gets it; no platform's own bar or rail does.

### NavigationRailStyle

`import com.pantrixui.components.navigation.navigationrail.NavigationRailStyle`, from `com.pantrixui:components`

```kotlin
class NavigationRailStyle(
    public val width: Dp = Dp.Unspecified,
    public val indicatorWidth: Dp = Dp.Unspecified,
    public val indicatorHeight: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val labelGap: Dp = Dp.Unspecified,
    public val itemMinHeight: Dp = Dp.Unspecified,
    public val itemSpacing: Dp = Dp.Unspecified,
    public val headerGap: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val indicator: NavigationIndicator? = null,
    public val divider: Boolean? = null
) : PantrixStyle<NavigationRailStyle>
```

`PantrixNavigationRail`'s geometry, and how it marks the destination the app is at.

The rail is the same on every platform, and its destinations are a navigation bar's: 80dp wide beside a hairline, with a pill of 56dp by 28dp behind the current destination's icon, a 20dp icon and 4dp over the label. The destinations stand one under another from the top, 56dp tall each and 4dp apart, under a header 8dp over them.

The pill's room takes the press and the focus ring, where a pill is drawn and where none is. The width, the heights and the gaps follow the density; the pill and the icon do not.

Parameters:

- `width: Dp`: How wide the rail is, beside the insets it keeps clear.
- `indicatorWidth: Dp`: How wide the pill behind the current destination's icon is, and the room a press is drawn in.
- `indicatorHeight: Dp`: How tall that pill is.
- `iconSize: Dp`: A destination's icon.
- `labelGap: Dp`: Between the pill's room and the label under it.
- `itemMinHeight: Dp`: The least a destination is tall. It is never lower than the platform's touch target, and grows with a larger type.
- `itemSpacing: Dp`: Between one destination and the next.
- `headerGap: Dp`: Between the header and the first destination.
- `verticalPadding: Dp`: Over the header, or the first destination, and under the last.
- `indicator: NavigationIndicator?`: What marks the current destination.
- `divider: Boolean?`: Whether a hairline runs along the rail's end edge, inside its width.

### NavigationColors

`import com.pantrixui.components.navigation.common.NavigationColors`, from `com.pantrixui:components`

```kotlin
data class NavigationColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val selectedTint: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

What a navigation bar or a navigation rail is painted with, where it does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's. The two take the same colours, so a screen that shows one or the other by the window's width paints both with one set.

```kotlin
// The current destination in the success role, the rest as the theme has it.
val colors = NavigationColors(selectedContainer = PantrixTheme.colors.success.container)
PantrixNavigationBar(…, colors = colors)
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the destinations, unless `content` is given too, and a `selectedContainer` brings its pair for the icon on it, unless `selectedContent` is given. A fill no role has does not: what reads on it is the caller's to give.

The current destination is marked with a pill, or by colour alone where the style says so, and each has its own colours here: `selectedContainer` and `selectedContent` are the pill and what is on it, and `selectedTint` the colour where there is no pill. Giving the one changes nothing where the other is drawn.

Parameters:

- `container: Color`: The fill, which runs behind the insets that are kept clear. The theme's `surface`.
- `content: Color`: What is written on the fill: the label of the destination the app is at, under its pill, and the icons and labels of the others. On the theme's own fill the first is the theme's `textPrimary` and the others its `textSecondary`. On a fill of the caller's, and where this is given, all of them are this colour, and where no pill marks the current destination, the others are a share of it.
- `selectedContainer: Color`: The pill behind the current destination's icon, where the style draws one. The primary role's `container`.
- `selectedContent: Color`: The current destination's icon on its pill: the colour that reads on `selectedContainer`. The primary role's `onContainer`.
- `selectedTint: Color`: The current destination's icon and its label where the style draws no pill, and colour alone marks it: a colour that reads on `container`. The primary role's `color` on the theme's own fill where no `content` is given, and `content` where it is given or on a fill of the caller's, where nothing says that the brand's colour reads.
- `divider: Color`: The hairline along a bar's top edge or a rail's end edge, where the style draws one. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`: the edge a subtle button has.
