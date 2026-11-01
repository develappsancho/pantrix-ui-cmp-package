# Navigation Bar

The app's top-level destinations along the bottom of the screen: three to five of them, one of them where the app is now. It is the navigation of a phone and of a narrow window. This app's own navigation is a `PantrixNavigationBar` too, in a window narrower than 600dp.

Here the bars stand inside the page, in a bordered frame. On a real screen the bar is the bottom bar of a `PantrixScaffold`: it takes the insets the scaffold gives it, and its fill runs behind the system's navigation bar.

- `PantrixNavigationBar` (`com.pantrixui.components.navigation.navigationbar`, `com.pantrixui:components`): The app's top-level destinations along the bottom of the screen, one of them marked as where the app is: by a pill behind its icon, or by its colour alone where the style says so. Keywords: bottom navigation, tab bar, bottom bar, bottom tabs, destinations.

## Features

- **The state is the screen's.** The bar is given the key of the current destination (`selected`), and reports the key of a destination that is pressed (`onSelect`). A press on the current destination is reported too: an app commonly takes that destination back to its top. With `selected` null, no destination is marked.
- **A pill, or colour alone.** The current destination is marked by a pill behind its icon; by its colour alone where the `indicator` field of `NavigationBarStyle` is `NavigationIndicator.None`.
- **Badge.** `NavigationBadge` puts a count or a dot on the destination's icon. The badge's top is level with the icon's: it does not run out of the bar. The count is capped as a badge's is: "99+".
- **Another icon while selected.** `NavigationItem.selectedIcon` is drawn in place of `icon` while the app is at that destination.
- **A destination that cannot be pressed.** `enabled = false` draws the destination in the theme's disabled text colour; the destination takes no press.
- **The same on every platform.** 64dp tall, under a hairline; a pill of 56×28dp, a 20dp icon and a label set in `footnote`. `style` changes the sizes, `labelStyle` the label's type.
- **Colours.** `NavigationColors` takes the fill, what is written on it, the pill, the icon on the pill and the colour that marks where there is no pill, each on its own. `PantrixNavigationRail` takes the same colours and the same list of destinations.
- **System bar.** `insets` is the room the bar keeps clear along the bottom edge and at its sides: the fill runs behind that room, and the destinations stay out of it.
- **Upright bar.** `orientation = NavigationBarOrientation.Vertical` lays the destinations one above another in a capsule of the bar's fill: as the tabs in the system's vertical bar on the iPhone Duo's outer screen. `PantrixScaffold` puts it at the bottom of the column there by itself. In an upright bar the destinations have their icons alone; `showLabels = true` writes their names too. Along the bottom, `showLabels = false` leaves the icons alone as well.
- **Destination without a label.** Its name is told to a screen reader and shows in a tooltip while a pointer rests on it, while it has the keyboard's focus and after a long press: above the destination along the bottom, at its start in an upright bar.
- **Screen reader.** A destination is read as a tab: its name, what its badge says, and whether it is selected. "Inbox, 3 unread".
- **Automation.** The destinations of a bar that is given a `tagKey` are named inside it: `NavigationBar_main.Item_inbox`.

## Usage

### Three destinations, with a count on one

```kotlin
var where by rememberSaveable { mutableStateOf("starred") }
PantrixNavigationBar(
    items = listOf(
        NavigationItem(key = "starred", label = stringResource(Res.string.starred), icon = PantrixIcons.Star),
        NavigationItem(
            key = "inbox",
            label = stringResource(Res.string.inbox),
            icon = PantrixIcons.Inbox,
            badge = NavigationBadge(contentDescription = stringResource(Res.string.unread, unread), count = unread)
        ),
        NavigationItem(key = "profile", label = stringResource(Res.string.profile), icon = PantrixIcons.Person)
    ),
    selected = where,
    onSelect = { where = it },
    tagKey = "main"
)
```

### In a scaffold's bottom bar, behind the system's navigation bar

```kotlin
PantrixScaffold(
    bottomBar = { insets ->
        PantrixNavigationBar(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
    }
) { padding ->
    Destination(where, Modifier.padding(padding))
}
```

### The current destination in a role's colours

```kotlin
val success = PantrixTheme.colors.success
PantrixNavigationBar(
    items = destinations,
    selected = where,
    onSelect = onNavigate,
    // The pill where the platform draws one, and the colour that marks alone where it does not.
    colors = NavigationColors(selectedContainer = success.container, selectedTint = success.color)
)
```

### Upright, in the system's vertical bar

```kotlin
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Bottom ->
                PantrixNavigationBar(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
            // The column along the side of the iPhone Duo's outer screen: icons, and their labels when asked for.
            ScaffoldNavigationPlacement.VerticalBar -> PantrixNavigationBar(
                items = destinations,
                selected = where,
                onSelect = onNavigate,
                orientation = NavigationBarOrientation.Vertical
            )
            ScaffoldNavigationPlacement.Start ->
                PantrixNavigationRail(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
        }
    }
) { padding ->
    Destination(where, Modifier.padding(padding))
}
```

## Examples

### Three destinations

At its plainest: the list of destinations (`items`), the key of the current destination (`selected`) and `onSelect`, which is told the key of the destination that is pressed. The bar selects nothing by itself; the screen holds where the app is. The destinations share the bar's width.

Press a destination, then press the same one again: that is reported too. The line above counts it; a real app takes that destination back to its top.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val destinations = listOf(
    NavigationItem(key = "files", label = "Files", icon = PantrixIcons.Folder),
    NavigationItem(key = "search", label = "Search", icon = PantrixIcons.Search),
    NavigationItem(key = "profile", label = "Profile", icon = PantrixIcons.Person)
)
var where by rememberSaveable { mutableStateOf("files") }
var pressedAgain by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Column {
        PantrixText(
            text = "Open destination: ${destinations.first { it.key == where }.label}. " +
                "Times the same destination was pressed again: $pressedAgain.",
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
        PantrixNavigationBar(
            items = destinations,
            selected = where,
            onSelect = { key -> if (key == where) pressedAgain++ else where = key },
            tagKey = "plain"
        )
    }
}
```

### Three destinations, with a count on one

The three destinations of a mail app. The badge on "Inbox" counts the unread: `NavigationBadge(contentDescription, count)`. When the destination is opened the count goes to zero and the badge goes away: with nothing left to count, `badge` is given null. "Starred" has a `selectedIcon`: while it is selected, that is drawn in place of the star. An app gives the icon's filled form there; `PantrixIcons` has no filled forms, so another icon stands here.

The badge's `contentDescription` is required and is read after the destination's name: "Inbox, 3 unread". A number alone does not say what it counts; giving null is a decision, made where the name says it already.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("starred") }
var unread by rememberSaveable { mutableIntStateOf(3) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Column {
        PantrixText(
            text = when (where) {
                "starred" -> "Starred messages"
                "inbox" -> "Inbox: nothing left unread"
                else -> "Profile and settings"
            },
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
        PantrixNavigationBar(
            items = listOf(
                NavigationItem(
                    key = "starred",
                    label = "Starred",
                    icon = PantrixIcons.Star,
                    selectedIcon = PantrixIcons.Success
                ),
                NavigationItem(
                    key = "inbox",
                    label = "Inbox",
                    icon = PantrixIcons.Inbox,
                    badge = if (unread > 0) {
                        NavigationBadge(contentDescription = "$unread unread", count = unread)
                    } else {
                        null
                    }
                ),
                NavigationItem(key = "profile", label = "Profile", icon = PantrixIcons.Person)
            ),
            selected = where,
            onSelect = { key ->
                where = key
                if (key == "inbox") unread = 0
            },
            tagKey = "mail"
        )
    }
}
```

### With a pill: five destinations, one that cannot be pressed

Five destinations: the most a bar takes. The current destination is marked by the pill behind its icon (`NavigationIndicator.Pill`): that is the default on every platform, written out here. The press and the focus ring are drawn in the pill's room too, not over the whole destination.

The badge on "Folders" is a dot (`count` was not given); the 128 on "Profile" is more than the largest number that is written, and becomes "99+". "Calendar" cannot be pressed: `enabled = false`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(indicator = NavigationIndicator.Pill),
        tagKey = "pill"
    )
}

private val FIVE = listOf(
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
    )
)
```

### By colour alone

The same bar with `NavigationIndicator.None`: no pill is drawn, the current destination's icon and label are in the theme's `primary` colour, and the others in the secondary text colour. A tab bar on iOS marks its destination this way; no platform's preset chooses it, and whoever wants it gives a style.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(indicator = NavigationIndicator.None),
        tagKey = "tint"
    )
}

private val FIVE = listOf(
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
    )
)
```

### Style: other sizes and the label's type

`style` changes the bar's sizes, `labelStyle` the type the labels are set in. The preset bar is 64dp tall on every platform; Android's own bar is 80dp with a larger pill, and a tab bar on iOS is 49pt with no pill. Neither is the preset, but a style can ask for either.

The bar above is 80dp, with a pill of 64×32dp and a 24dp icon. The one below is 49dp, has no pill, has its labels set in `caption` and less room between an icon and its label (`labelGap = 2.dp`). Only the fields that are given change. A destination is never lower than the platform's touch target.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
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
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(
            height = 80.dp,
            indicatorWidth = 64.dp,
            indicatorHeight = 32.dp,
            iconSize = 24.dp
        ),
        tagKey = "tall"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        labelStyle = PantrixTheme.typography.caption,
        style = NavigationBarStyle(height = 49.dp, labelGap = 2.dp, indicator = NavigationIndicator.None),
        tagKey = "low"
    )
}

private val FIVE = listOf(
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
    )
)
```

### The current destination in a role's colours

Only the current destination's colour has changed; the rest is the theme's. `selectedContainer` paints the pill; given one of the theme's role colours, the colour of the icon on it comes from that role too, unless `selectedContent` is given as well. `selectedTint` is the colour that marks the destination in a style that draws no pill.

Each has its own place: giving the one changes nothing where the other is drawn. The same `colors` were given to two bars, one with a pill and one without.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val success = PantrixTheme.colors.success
val colors = NavigationColors(selectedContainer = success.container, selectedTint = success.color)
var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        colors = colors,
        tagKey = "role"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(indicator = NavigationIndicator.None),
        colors = colors,
        tagKey = "role_tint"
    )
}

private val FIVE = listOf(
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
    )
)
```

### In its own colours

A bar in a colour the theme does not have: the app's own purple. The theme cannot know what reads on this fill; with the fill (`container`), the colour on it (`content`) is given too. The other destinations are written in that colour, the one that cannot be pressed in a share of it, and the line along the top comes from it as well.

The pill and the icon on it were given too (`selectedContainer`, `selectedContent`). A style that draws no pill does not use them: the current destination is in the bar's text colour, and the others in a share of it.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var where by rememberSaveable { mutableStateOf("folders") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
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

private val FIVE = listOf(
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
    )
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Behind the system bar

`insets` is the room the bar keeps clear along the bottom edge and at its sides: the fill runs behind that room, and the destinations stay out of it. On a real screen `PantrixScaffold` gives the insets (`bottomBar = { insets -> … }`) and the system's navigation bar sits over the bar's fill. That is how the app's own bottom bar gets its insets.

There is no scaffold here: 24dp stand in for the insets, and the line inside them for the system's gesture bar. The destinations stay above the line, and the bar's fill goes down under it.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Box(contentAlignment = Alignment.BottomCenter) {
        PantrixNavigationBar(
            items = FIVE,
            selected = where,
            onSelect = { where = it },
            insets = PaddingValues(bottom = 24.dp),
            tagKey = "insets"
        )
        // A line in the place of the system's gesture bar: over the bar's fill, under the destinations.
        Box(
            modifier = Modifier
                .padding(bottom = 10.dp)
                .size(width = 120.dp, height = 4.dp)
                .background(PantrixTheme.colors.textSecondary, PantrixTheme.shapes.full)
        )
    }
}

private val FIVE = listOf(
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
    )
)
```

### Upright bar

The bar stands upright: the destinations one above another, in a capsule of the bar's fill with a thin line around it. On the iPhone Duo's outer screen the system keeps a column for such bars along the right edge; `PantrixScaffold` puts the navigation at the bottom of that column and tells it `ScaffoldNavigationPlacement.VerticalBar` (the "Scaffold" page has an example).

The one on the left has its icons alone, as UIKit's tabs in that column: rest on a destination or press it long, and its name shows in a tooltip at its start; a screen reader says the name too. The one on the right writes the names as well, with `showLabels = true`, and is as wide as its longest name. The two share one state: press a destination in one and the other marks it too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xxl)) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        orientation = NavigationBarOrientation.Vertical,
        tagKey = "upright_icons"
    )
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        orientation = NavigationBarOrientation.Vertical,
        showLabels = true,
        tagKey = "upright_labels"
    )
}

private val FIVE = listOf(
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
    )
)
```

## API

### PantrixNavigationBar

`import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixNavigationBar(
    items: List<NavigationItem>,
    selected: String?,
    onSelect: (key: String) -> Unit,
    modifier: Modifier = Modifier,
    orientation: NavigationBarOrientation = NavigationBarOrientation.Horizontal,
    showLabels: Boolean = orientation == NavigationBarOrientation.Horizontal,
    labelStyle: TextStyle = PantrixTheme.typography.footnote,
    style: NavigationBarStyle? = null,
    colors: NavigationColors? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null
)
```

The app's top-level destinations along the bottom of the screen, three to five of them, with the one the app is at marked.

Which destination the app is at is the screen's state: the bar is given its key in `selected`, and reports a press in `onSelect`. A press on the current destination is reported too: an app commonly takes that destination back to its top.

The destinations share the bar's width. What marks the current one is the style's `NavigationBarStyle.indicator`: a pill behind its icon, or its colour alone where the style says so. A destination is a tab to a screen reader, which says its label, then what its badge says, and whether it is the one selected.

A `PantrixNavigationRail` takes the same destinations and the same colours: a screen that shows the bar in a narrow window and the rail in a wide one gives both the one list.

In a `PantrixScaffold`'s bottom bar the bar is given the scaffold's `insets`: its fill runs behind the system's navigation bar, and its destinations stay clear of it.

**Upright.** Where the system keeps a vertical bar, the column along the side of the iPhone Duo's outer screen, the bar stands in it as `NavigationBarOrientation.Vertical`: the destinations one above another in a capsule of the bar's fill, under a hairline around it where the style draws one along the top. A `PantrixScaffold` with adaptive navigation says where it is, `ScaffoldNavigationPlacement.VerticalBar`, and puts it at the column's bottom.

**Labels.** Each destination shows its label under its icon unless `showLabels` says not to, which is what an upright bar does unless it is asked: the system's column holds icons. Without its label a destination is named by it for a screen reader, and a tooltip shows it while a pointer rests on the icon, while the keyboard's focus is on it and after a long press: above a bar along the bottom, at the start of an upright one.

Parameters:

- `items: List<NavigationItem>`: the destinations, in order: three to five of them is what a bar is made for, though nothing counts them.
- `selected: String?`: the key of the destination the app is at, or null where it is at none of them.
- `onSelect: (key: String) -> Unit`: told the key of a destination that is pressed, the current one's too.
- `modifier: Modifier`: applied to the bar.
- `orientation: NavigationBarOrientation`: which way the bar runs: along the bottom, or upright in the system's vertical bar.
- `showLabels: Boolean`: whether each destination shows its label under its icon: along the bottom it does unless told not to, upright it does not unless told to.
- `labelStyle: TextStyle`: the type the labels are set in: the theme's `footnote` unless given. Their colour is the bar's.
- `style: NavigationBarStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: NavigationColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `insets: PaddingValues`: the room the bar keeps clear along the bottom edge and at its sides, with its fill behind it: what a scaffold gives its bottom bar. An upright bar keeps it clear around its capsule, with nothing behind it.
- `tagKey: String?`: a locale-independent key for automation: the bar's tag is `NavigationBar_<tagKey>`, and its destinations are named inside it, `NavigationBar_<tagKey>.Item_<destination's key>`.

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

### NavigationBarStyle

`import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle`, from `com.pantrixui:components`

```kotlin
class NavigationBarStyle(
    public val height: Dp = Dp.Unspecified,
    public val indicatorWidth: Dp = Dp.Unspecified,
    public val indicatorHeight: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val labelGap: Dp = Dp.Unspecified,
    public val indicator: NavigationIndicator? = null,
    public val divider: Boolean? = null,
    public val uprightIndicatorWidth: Dp = Dp.Unspecified
) : PantrixStyle<NavigationBarStyle>
```

`PantrixNavigationBar`'s geometry, and how it marks the destination the app is at.

The bar is the same on every platform: 64dp tall under a hairline, with a pill of 56dp by 28dp behind the current destination's icon, a 20dp icon and 4dp over the label. A pill, a gap and a line of a label leave 8dp over and under them. Android's own bar is 80dp with a larger pill, and a tab bar on iOS 49pt with no pill; neither is the preset here, and a style of the app's can ask for either.

The pill's room takes the press and the focus ring, where a pill is drawn and where none is. The height and the gap follow the density; the pill and the icon do not.

Upright, in the system's vertical bar, a destination is as tall as a touch and its pill 40dp wide, so that the capsule of icons is 48dp across, as UIKit's tab bar is in that column. A badge that reaches further widens the capsule as far as it reaches: it stays inside.

Parameters:

- `height: Dp`: How tall the bar is, over the insets it keeps clear. A destination is never lower than the platform's touch target, and grows with a larger type.
- `indicatorWidth: Dp`: How wide the pill behind the current destination's icon is, and the room a press is drawn in.
- `indicatorHeight: Dp`: How tall that pill is.
- `iconSize: Dp`: A destination's icon.
- `labelGap: Dp`: Between the pill's room and the label under it.
- `indicator: NavigationIndicator?`: What marks the current destination.
- `divider: Boolean?`: Whether a hairline runs along the bar's top edge, inside its height; upright, around its capsule.
- `uprightIndicatorWidth: Dp`: How wide the pill is in an upright bar, and the room a press is drawn in there. A destination there is as wide as its pill and its label.

### NavigationBarOrientation

`import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation`, from `com.pantrixui:components`

```kotlin
enum class NavigationBarOrientation
```

Which way a `PantrixNavigationBar` runs.

Entries:

- `Horizontal`: Along the bottom of the screen: the destinations side by side, sharing the bar's width.
- `Vertical`: Upright, in the system's vertical bar: the destinations one above another in a capsule as wide as they are, as the iPhone Duo's outer screen keeps its tabs. `PantrixScaffold` puts it at the bottom of the column there.

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
