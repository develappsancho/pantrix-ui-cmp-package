# Scaffold

The layout of a screen: a top bar, a bottom bar and a side bar around the content, and the app's snackbars over the content. It measures the bars and the window's insets, and gives the content the padding it needs to keep clear of them.

It fills a bounded space, usually the window: a scrolling parent has no height to give it. That is why each example on this page is in a box of a given height, and all but "The window's insets" have `windowInsets` at zero: the box is not the window, and the insets of the system bars are in the app's own scaffold. That scaffold is a real use too: the app's shell (`App.kt`, `shell/DemoNavigation.kt`) puts its navigation in a bottom bar in a narrow window and in a sidebar in a wide one.

- `PantrixScaffold` (`com.pantrixui.components.container.scaffold`, `com.pantrixui:components`): The layout of a screen: bars around the content, navigation that can move with the width, and the app's snackbars over the content. Keywords: screen layout, page layout, app shell, frame, app structure.

## Features

- **Three bars.** `topBar`, `bottomBar` and `sideBar`. The side bar runs the scaffold's full height along the start edge, on the right in a right-to-left layout; the top and the bottom bar span the remaining width.
- **The content's padding.** The content reaches under the bars. The `padding` given to `content` is, on each edge, the bar's size or the window inset of an edge without a bar, whichever is larger. It is passed to a list as `contentPadding`: the list scrolls under the bars.
- **Window insets.** Each slot is given, as `insets`, the insets of the window edges it touches: a bar extends its fill behind the system bar and keeps its content in the safe area. Insets a parent has consumed are not given again.
- **Keyboard.** `windowInsets` is the system bars and the display cutout, and the keyboard is not among them: a screen with text fields adds `Modifier.consumeWindowInsets(padding).imePadding()` to its content.
- **Focus.** In content that scrolls beneath a bar, what takes the focus is brought to the edge of the scrolling area, and that edge is behind the bar. The content says what it keeps free at its ends with `Modifier.scrollPadding`: the focus stays between the bars.
- **Adaptive navigation.** The second `PantrixScaffold`, the one that takes `navigation`, moves the navigation according to its own width: along the bottom edge while the scaffold is narrower than 600dp, and along the start edge from that width on. The threshold is changed with `ScaffoldStyle`.
- **A foldable on a table.** On a device held half open with its fold lying across, the navigation stays at the bottom whatever the width.
- **The system's vertical bar.** On the iPhone Duo's outer screen the system keeps a column along the right edge for bars that stand upright, with the status bar at its top. A scaffold that reaches that column puts the navigation at the column's bottom (`ScaffoldNavigationPlacement.VerticalBar`): an upright `PantrixNavigationBar` is drawn there. A `PantrixTopBar` inside it hands its back button and its actions to the column's top too, under the status bar, and its title stays where it is. It does so only in a window that stands upright and has no fold: on the inner screen and on its side the status bar stays alone in the column, and the navigation and the buttons are where they always are. Of two scaffolds one inside the other, the outer one holds the column.
- **Snackbars.** A scaffold given `snackbars` shows them over the content, between the bars, and provides them to everything inside it as `LocalPantrixSnackbars`.
- **Colour.** `containerColor` is drawn behind everything, the system bars included. On the theme's own grounds the scaffold provides no content colour; on a role's fill it provides the colour paired with that fill.
- **Order.** A keyboard and a screen reader go from the side bar to the top bar, the buttons in the vertical bar, the content, the bottom bar and the snackbars. The bars and the snackbars are drawn over the content.

## Usage

### Bars drawn behind the system bars

```kotlin
PantrixScaffold(
    topBar = { insets ->
        InboxTopBar(Modifier.background(PantrixTheme.colors.surface).padding(insets))
    },
    bottomBar = { insets ->
        InboxTabs(Modifier.background(PantrixTheme.colors.surface).padding(insets))
    }
) { padding ->
    LazyColumn(contentPadding = padding) {
        items(conversations, key = { it.id }) { ConversationRow(it, Modifier.scrollPadding(padding)) }
    }
}
```

### Bars that apply the insets themselves

```kotlin
PantrixScaffold(
    topBar = { MailToolbar(Modifier.windowInsetsPadding(WindowInsets.safeDrawing)) },
    sideBar = { MailFolders(Modifier.windowInsetsPadding(WindowInsets.safeDrawing)) }
) { padding ->
    Mailbox(Modifier.padding(padding))
}
```

### Navigation that moves with the width

```kotlin
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Bottom -> AppTabs(destination, onNavigate, Modifier.padding(insets))
            ScaffoldNavigationPlacement.VerticalBar -> AppTabs(destination, onNavigate, upright = true)
            ScaffoldNavigationPlacement.Start -> AppSidebar(destination, onNavigate, Modifier.padding(insets))
        }
    },
    topBar = { insets -> AppTopBar(destination, Modifier.padding(insets)) }
) { padding ->
    DestinationScreen(destination, Modifier.padding(padding))
}
```

### Snackbars from any screen

```kotlin
val snackbars = rememberPantrixSnackbarState()
PantrixScaffold(snackbars = snackbars) { padding ->
    Inbox(Modifier.padding(padding))
}

// Anywhere inside Inbox:
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.archive),
    onClick = {
        archive(conversation)
        scope.launch {
            snackbars?.show(message = getString(Res.string.conversation_archived), tagKey = "archived")
        }
    },
    tagKey = "archive"
)
```

## Examples

### Top bar and the content's padding

A top bar and a list that scrolls under it. `topBar` is given `insets` and passes them on to the bar. The content fills the whole scaffold, the space under the bar too: the `padding` that comes to `content` was passed to the list as `contentPadding`, so the first row starts below the bar and the list passes under the bar as it scrolls. Once the list has left its start, the bar draws a line along its bottom edge (`scrolled`).

The scaffold is inside the page, so it was given a height and `windowInsets` was set to zero; on a screen neither is written.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val list = rememberLazyListState()
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets ->
        PantrixTopBar(
            title = "Inbox",
            scrolled = list.canScrollBackward,
            insets = insets,
            tagKey = "scaffold_inbox"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    LazyColumn(modifier = Modifier.fillMaxSize(), state = list, contentPadding = padding) {
        items(20) { index ->
            PantrixText(text = "Conversation ${index + 1}", modifier = Modifier.padding(PantrixTheme.spacing.lg))
        }
    }
}
```

### Bottom bar

`bottomBar` spans the remaining width below the content: here it is a `PantrixNavigationBar` with three destinations. Which destination is open is the screen's state; the bar only reports the one that was pressed.

The content keeps clear of both bars with `padding`: the top padding is the height of the top bar, and the bottom padding that of the bottom bar. The line in the middle shows the values the scaffold gave.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Mail", insets = insets) },
    bottomBar = { insets ->
        PantrixNavigationBar(
            items = DESTINATIONS,
            selected = destination,
            onSelect = { destination = it },
            insets = insets,
            tagKey = "scaffold_bottom"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    Column(
        modifier = Modifier.fillMaxSize().padding(padding),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // A bar's height may be no whole number of dp on a screen: the nearest whole number is written.
        val top = padding.calculateTopPadding().value.roundToInt()
        val bottom = padding.calculateBottomPadding().value.roundToInt()
        PantrixText(text = "Current destination: ${DESTINATIONS.first { it.key == destination }.label}")
        PantrixText(text = "Top padding ${top}dp, bottom padding ${bottom}dp", color = PantrixTheme.colors.textSecondary)
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### Focus in a list that scrolls beneath the bars

While the content scrolls beneath the bars, what takes the focus by the keyboard does not stay behind a bar. Compose brings what takes the focus to the list's edge, and since the list reaches under the bars that edge is behind a bar. Here every item says how much the list keeps free at its ends (`Modifier.scrollPadding`): what takes the focus is brought inside that, between the two bars.

The padding is the share the scaffold gave and the room of a focus ring (`PantrixTheme.platform.focusRingReach`). In a column the ring asks for its own room; in a lazy list it cannot, so the list adds that room to its `contentPadding` and tells its items the same value.

Move down by pressing Tab on a keyboard and up by pressing Shift with Tab: every button is shown with its ring between the two bars.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.a11y.scrollPadding
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var destination by rememberSaveable { mutableStateOf("inbox") }
val ring = PantrixTheme.platform.focusRingReach
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Labels", insets = insets) },
    bottomBar = { insets ->
        PantrixNavigationBar(
            items = DESTINATIONS,
            selected = destination,
            onSelect = { destination = it },
            insets = insets,
            tagKey = "scaffold_focus"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    // The bars' share and, over it and under it, the room of a ring: the list's padding, and what its items tell of.
    val room = padding + PaddingValues(vertical = ring)
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = room,
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        items(12) { index ->
            PantrixButton(
                text = "Label ${index + 1}",
                onClick = {},
                modifier = Modifier.scrollPadding(room),
                variant = ButtonVariant.Outline,
                tagKey = "scaffold_label_${index + 1}"
            )
        }
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### Side bar

`sideBar` runs the scaffold's full height along the start edge: here it is a `PantrixNavigationRail`. The top bar spans the width that is left beside it and does not reach over it. In a right-to-left layout the side bar is on the right.

A keyboard and a screen reader come to the side bar first, then to the top bar, then to the content.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Mail", insets = insets) },
    sideBar = { insets ->
        PantrixNavigationRail(
            items = DESTINATIONS,
            selected = destination,
            onSelect = { destination = it },
            insets = insets,
            tagKey = "scaffold_side"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "Current destination: ${DESTINATIONS.first { it.key == destination }.label}")
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### Navigation that moves with the width

The `PantrixScaffold` that takes `navigation` chooses the place of the navigation itself, and tells the navigation where it is (`placement`): along the bottom edge while the scaffold is narrower than 600dp, and along the start edge from that width on. The navigation draws the same destinations as a navigation bar at the bottom and as a rail along the start edge.

The width is the scaffold's own, not the window's: a scaffold in a box goes by the width of the box. If the box is narrower than 600dp the navigation is at the bottom; otherwise it is along the start edge. Pick "Narrow": the box becomes 360dp wide and the navigation moves down to the bottom. In a narrow window the box does not reach 600dp whichever is picked, and the navigation stays at the bottom.

The content stays in the same composition while the navigation moves: press the counter, then change the width; the number is still there.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var wide by rememberSaveable { mutableStateOf(true) }
var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption(value = false, label = "Narrow", tagKey = "narrow"),
        SegmentOption(value = true, label = "Wide", tagKey = "wide")
    ),
    selected = wide,
    onSelect = { wide = it },
    fullWidth = false,
    tagKey = "scaffold_width"
)
val width = if (wide) Modifier.fillMaxWidth() else Modifier.width(360.dp)
PantrixScaffold(
    navigation = { placement, insets ->
        ScaffoldDestinations(placement, insets, selected = destination, tagKey = "scaffold_adaptive") {
            destination = it
        }
    },
    modifier = width.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Mail", insets = insets) },
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        var count by remember { mutableIntStateOf(0) }
        PantrixButton(
            text = "Counter: $count",
            onClick = { count += 1 },
            variant = ButtonVariant.Soft,
            tagKey = "scaffold_count"
        )
    }
}

@Composable
private fun ScaffoldDestinations(
    placement: ScaffoldNavigationPlacement,
    insets: PaddingValues,
    selected: String,
    tagKey: String,
    onSelect: (String) -> Unit
) {
    when (placement) {
        ScaffoldNavigationPlacement.Bottom -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.Start -> {
            PantrixNavigationRail(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.VerticalBar -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                orientation = NavigationBarOrientation.Vertical,
                tagKey = tagKey
            )
        }
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### The width at which the navigation moves

The width at which the navigation moves to the start edge is in the scaffold's style: `ScaffoldStyle.sideNavigationMinWidth`, 600dp on every platform. This scaffold was given 280dp through `style`: if the box is 280dp or wider the navigation is along the start edge, even in a window narrower than 600dp.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement
import com.pantrixui.components.container.scaffold.ScaffoldStyle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    navigation = { placement, insets ->
        ScaffoldDestinations(placement, insets, selected = destination, tagKey = "scaffold_threshold") {
            destination = it
        }
    },
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    windowInsets = WindowInsets(0),
    style = ScaffoldStyle(sideNavigationMinWidth = 280.dp)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "Current destination: ${DESTINATIONS.first { it.key == destination }.label}")
    }
}

@Composable
private fun ScaffoldDestinations(
    placement: ScaffoldNavigationPlacement,
    insets: PaddingValues,
    selected: String,
    tagKey: String,
    onSelect: (String) -> Unit
) {
    when (placement) {
        ScaffoldNavigationPlacement.Bottom -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.Start -> {
            PantrixNavigationRail(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.VerticalBar -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                orientation = NavigationBarOrientation.Vertical,
                tagKey = tagKey
            )
        }
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### In the system's vertical bar

On the iPhone Duo's outer screen, from iOS 27.1 on, the system keeps a column along the right edge for bars that stand upright: the status bar at its top and the app's bars below it. Pick "Cover": the faint strip is where the status bar is. The scaffold reaches that column, so it puts the navigation at the column's bottom and tells it `ScaffoldNavigationPlacement.VerticalBar`; an upright `PantrixNavigationBar` is drawn there. The `PantrixTopBar` in the content hands its back button and its two actions to the column's top, under the status bar, and its title stays where it is. The app's own shell stands the same way on the Duo's outer screen.

In the upright bar the destinations have their icons alone, as UIKit's tabs in that column: rest on an icon or press it long, and its name shows in a tooltip. Turn "Labels" on: the names are written under the icons too (`showLabels`). The other windows have no column: the navigation is at the bottom or at the start edge by the width, and the buttons are in the top bar. On the Duo's inner screen and on its side the system keeps the column too, but the scaffold leaves it to the status bar, and this is how it stays.

The scaffold is as tall as the outer screen, 678dp; the place in the column is measured by the window, and the scaffold starts at the window's top.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var labels by rememberSaveable { mutableStateOf(false) }
var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Bottom -> PantrixNavigationBar(
                items = DESTINATIONS,
                selected = destination,
                onSelect = { destination = it },
                insets = insets,
                tagKey = "scaffold_upright"
            )

            ScaffoldNavigationPlacement.VerticalBar -> PantrixNavigationBar(
                items = DESTINATIONS,
                selected = destination,
                onSelect = { destination = it },
                orientation = NavigationBarOrientation.Vertical,
                showLabels = labels,
                tagKey = "scaffold_upright"
            )

            ScaffoldNavigationPlacement.Start -> PantrixNavigationRail(
                items = DESTINATIONS,
                selected = destination,
                onSelect = { destination = it },
                insets = insets,
                tagKey = "scaffold_upright"
            )
        }
    },
    modifier = Modifier.fillMaxWidth().height(678.dp),
    windowInsets = WindowInsets(0)
) { padding ->
    Column(modifier = Modifier.fillMaxSize()) {
        // The bar has the scaffold's whole width, as UIKit's top bar does; the content keeps clear of the column by its padding.
        PantrixTopBar(
            title = DESTINATIONS.first { it.key == destination }.label,
            navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "scaffold_upright_back") },
            actions = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Search,
                    contentDescription = "Search",
                    onClick = {},
                    tagKey = "scaffold_upright_search"
                )
                PantrixIconButton(
                    imageVector = PantrixIcons.MoreHorizontal,
                    contentDescription = "More",
                    onClick = {},
                    tagKey = "scaffold_upright_more"
                )
            },
            tagKey = "scaffold_upright"
        )
        PantrixSwitchButton(
            checked = labels,
            onCheckedChange = { labels = it },
            modifier = Modifier.padding(padding).padding(PantrixTheme.spacing.lg),
            label = "Labels",
            tagKey = "scaffold_upright_labels"
        )
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### Snackbars

A scaffold given `snackbars` shows them over the content and inside the padding it gives the content: between the bars. It provides the same state to everything inside it as `LocalPantrixSnackbars`; a screen does not take the state as a parameter to show a snackbar. The button here is a separate composable inside the scaffold, and reads the state from there.

Press "Archive": the snackbar appears inside the scaffold in this box, not in the app's window. Its place depends on the platform: in the middle of the bottom edge on Android, at the top on iOS, and in the bottom end corner on desktop and the web. A scaffold given no `snackbars` keeps the `LocalPantrixSnackbars` of the layout around it: the boxes in the other examples see the app's.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = rememberPantrixSnackbarState()
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Inbox", insets = insets) },
    bottomBar = { insets ->
        PantrixNavigationBar(
            items = DESTINATIONS,
            selected = "inbox",
            onSelect = {},
            insets = insets,
            tagKey = "scaffold_snackbars"
        )
    },
    snackbars = snackbars,
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        ScaffoldArchiveButton()
    }
}

@Composable
private fun ScaffoldArchiveButton() {
    val snackbars = LocalPantrixSnackbars.current
    val scope = rememberCoroutineScope()
    PantrixButton(
        text = "Archive",
        onClick = { scope.launch { snackbars?.show(message = "Conversation archived", tagKey = "scaffold_archived") } },
        tagKey = "scaffold_archive"
    )
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### The window's insets

In a window `windowInsets` is not written: the scaffold reads the insets of the system bars and the display cutout itself. This box has no system bar, so two insets were given by hand: 28dp at the top and 20dp at the bottom; a caption stands where each bar would be.

Each bar is given the inset of the edge it touches as `insets`. The top bar and the bottom bar pad their content by it: their fill reaches behind the inset, and the title and the destinations stay clear of it. The content's padding grows to match: the values in the line in the middle are the bar's height plus the window's inset.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val caption = PantrixTheme.typography.caption
val quiet = PantrixTheme.colors.textSecondary
Box(modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider)) {
    PantrixScaffold(
        topBar = { insets -> PantrixTopBar(title = "Settings", insets = insets) },
        bottomBar = { insets ->
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = "inbox",
                onSelect = {},
                insets = insets,
                tagKey = "scaffold_insets"
            )
        },
        windowInsets = WindowInsets(top = 28.dp, bottom = 20.dp)
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
            val top = padding.calculateTopPadding().value.roundToInt()
            val bottom = padding.calculateBottomPadding().value.roundToInt()
            PantrixText(text = "Top padding ${top}dp, bottom padding ${bottom}dp")
        }
    }
    PantrixText(
        text = "where the status bar would be",
        modifier = Modifier.align(Alignment.TopCenter).padding(top = 6.dp),
        style = caption,
        color = quiet
    )
    PantrixText(
        text = "where the system bar would be",
        modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 2.dp),
        style = caption,
        color = quiet
    )
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Messages", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "People", icon = PantrixIcons.Person)
)
```

### Ground and content colour

`containerColor` is the scaffold's ground; its default is the theme's `background`. On the theme's own grounds the scaffold provides no content colour: each component draws in its own default. The upper scaffold was painted with a role's fill, and itself gave the text inside it the colour paired with that fill.

The colour of the lower one is not in the theme but is the app's own purple: the theme cannot know what reads on it, so that is given with `contentColor`.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixScaffold(
    modifier = Modifier.height(96.dp),
    containerColor = PantrixTheme.colors.primary.container,
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "A role's fill: the scaffold gave the content colour")
    }
}
PantrixScaffold(
    modifier = Modifier.height(96.dp),
    containerColor = own.color,
    contentColor = own.onColor,
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "A colour the theme does not have: contentColor was given")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixScaffold

`import com.pantrixui.components.container.scaffold.PantrixScaffold`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixScaffold(
    modifier: Modifier = Modifier,
    topBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    bottomBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    sideBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    snackbars: PantrixSnackbarState? = null,
    snackbarHost: @Composable () -> Unit = { if (snackbars != null) PantrixSnackbarHost(snackbars) },
    containerColor: Color = PantrixTheme.colors.background,
    contentColor: Color = Color.Unspecified,
    windowInsets: WindowInsets = WindowInsets.systemBars.union(WindowInsets.displayCutout),
    content: @Composable (padding: PaddingValues) -> Unit
)
```

The layout of a screen: a top bar, a bottom bar and a side bar around the content, and the app's snackbars over the content.

The side bar runs the scaffold's full height along the start edge, the right edge in a right-to-left layout, and the top bar and the bottom bar span the rest. The content fills that rest too, under the bars, so a list scrolls beneath them: pass `content`'s padding to the list as its content padding. The scaffold draws `containerColor` edge to edge, behind the window's system bars.

**Insets.** Each slot is given, as padding, the insets of the window edges it touches: the side bar its start, top and bottom insets; the top bar its top inset and the bottom bar its bottom inset, each with the end inset, and the start inset too when there is no side bar. A bar that pads its content by them draws its background behind the system bar and keeps its content in the safe area. A bar can apply the insets itself instead, with `Modifier.windowInsetsPadding`: the scaffold consumes the insets of the edges a slot does not touch, so the bar gets only its own. The `content`'s padding is each bar's height, or the inset of an edge without a bar, whichever is larger. Insets a parent has already consumed, with `consumeWindowInsets` or a `windowInsetsPadding`, are left out. The scaffold does not consume them for its content, as Material's does not: content that holds another scaffold, a snackbar host or anything else that pads by the window's insets consumes what it is given, with `Modifier.padding(padding).consumeWindowInsets(padding)`, or those insets are added again inside it.

**Snackbars.** Given `snackbars`, the scaffold shows them in a `PantrixSnackbarHost` over the content and inside the padding the content is given: between the bars, beside the side bar and clear of the window's insets. It also provides them to everything inside it as `LocalPantrixSnackbars`, so a screen shows a snackbar without the state being passed down to it. `snackbarHost` puts the app's own host in that place instead.

**Colour.** On the theme's own grounds, its background, which is the default, and its surface, the scaffold provides no content colour: there each component draws in its own default, text in `textPrimary` and a spinner in the brand's colour. On a role's fill it provides the colour paired with that fill.

**In the system's vertical bar.** Where the window has a column along its side for bars that stand upright, as the iPhone Duo's outer screen has from iOS 27.1 on, and the scaffold reaches it, a `PantrixTopBar` inside the scaffold hands its back button and its actions over: they stand in the column under the status bar, one above another, as UIKit puts a navigation bar's buttons there, and the top bar keeps its title. The content keeps clear of the column by its inset. Of two scaffolds one inside the other, the outer one holds the column. The scaffold holds it only in a window that stands upright with no fold across it, the outer screen as it is held: the inner screen and either screen on its side keep a column too, and there the scaffold leaves the status bar alone in it.

**Order.** A keyboard user moves, and a screen reader reads, from the side bar to the top bar, the buttons in the vertical bar, the content, the bottom bar and the snackbars. The bars and the snackbars are drawn over the content.

**Focus.** A list that scrolls beneath a bar brings what takes the focus to its own edge, and that edge is behind the bar. The list's content says what it keeps free at its ends with `Modifier.scrollPadding`, on a column's content or on each item of a lazy list, and what takes the focus is shown between the bars (docs/guide/scroll-padding/SCROLL_PADDING_GUIDE.md).

The scaffold fills a bounded space, usually the window: a scrolling parent has no height to give it.

Parameters:

- `modifier: Modifier`: the scaffold's modifier. The scaffold fills the space it is given.
- `topBar: (@Composable (insets: PaddingValues) -> Unit)?`: the bar above the content, given the insets of the edges it touches.
- `bottomBar: (@Composable (insets: PaddingValues) -> Unit)?`: the bar below the content, given the insets of the edges it touches.
- `sideBar: (@Composable (insets: PaddingValues) -> Unit)?`: the bar along the start edge, the scaffold's full height, given the insets of the edges it touches.
- `snackbars: PantrixSnackbarState?`: the app's snackbars: shown over the content, and provided to everything inside as `LocalPantrixSnackbars`. Without them, a scaffold shows no snackbars of its own and keeps the `LocalPantrixSnackbars` of the layout around it.
- `snackbarHost: @Composable () -> Unit`: what shows the snackbars over the content: by default a `PantrixSnackbarHost` of `snackbars`.
- `containerColor: Color`: drawn behind everything, the window's system bars included.
- `contentColor: Color`: the colour of text and icons that set none. By default the one paired with `containerColor` when that is a role's fill, and none on the theme's background, on its surface or on a colour the theme does not know: pass one with such a colour when the components' own defaults do not read on it.
- `windowInsets: WindowInsets`: the insets the scaffold hands to its slots and keeps the content and the snackbars clear of, by default the system bars and the display cutout; any a parent has already consumed are left out. The keyboard is not among them: a screen with text fields adds `Modifier.consumeWindowInsets(padding).imePadding()` to its content.
- `content: @Composable (padding: PaddingValues) -> Unit`: the screen, given the padding that keeps it clear of the bars and the insets.

### PantrixScaffold

`import com.pantrixui.components.container.scaffold.PantrixScaffold`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixScaffold(
    navigation: @Composable (placement: ScaffoldNavigationPlacement, insets: PaddingValues) -> Unit,
    modifier: Modifier = Modifier,
    topBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    snackbars: PantrixSnackbarState? = null,
    snackbarHost: @Composable () -> Unit = { if (snackbars != null) PantrixSnackbarHost(snackbars) },
    containerColor: Color = PantrixTheme.colors.background,
    contentColor: Color = Color.Unspecified,
    windowInsets: WindowInsets = WindowInsets.systemBars.union(WindowInsets.displayCutout),
    style: ScaffoldStyle? = null,
    content: @Composable (padding: PaddingValues) -> Unit
)
```

The layout of a screen whose navigation moves with its width: along the bottom edge while the scaffold is narrower than `ScaffoldStyle.sideNavigationMinWidth`, 600dp by default, and along the start edge from that width on.

`navigation` is told where it is, so it can draw the same destinations as a navigation bar at the bottom and as a rail or a sidebar at the start. At the start it runs the scaffold's full height and `topBar` spans the rest; at the bottom it spans the width below the content. The width is the scaffold's own, not the window's, so a scaffold in part of a window decides by the space it has. The navigation stays one composition as it moves, and so does the content: what they remember, a selection or a scroll position, is still there after the window is resized, and what they save comes back where a turned device builds the screen anew.

**On a table.** A foldable held half open with its fold lying across, like a laptop on a table, keeps the navigation along the bottom edge whatever the width: the lower half is where the hands are, and a column along the start edge would run across the fold. The posture is the window's, `PantrixTheme.window`. A scaffold short enough to fit in one half of that window is taken to be a pane there, and follows its width.

**In the system's vertical bar.** Where the window has a column along its side for bars that stand upright, as the iPhone Duo's outer screen has from iOS 27.1 on, stands upright with no fold across it, and the scaffold reaches the column, the navigation stands at the bottom of that column whatever the width: `navigation` is told `ScaffoldNavigationPlacement.VerticalBar` and draws an upright navigation bar there, as UIKit puts a tab bar. It is given no insets: the column's place for bars is clear of the status bar and the home indicator. A top bar's buttons stand at the column's top, as in the `PantrixScaffold` with separate bars.

Insets, snackbars, colour and order work as in the `PantrixScaffold` with separate bars: the navigation is given the insets of the edges it touches where it is, and is read and reached where it is, first at the start and after the content at the bottom and in the vertical bar.

Parameters:

- `navigation: @Composable (placement: ScaffoldNavigationPlacement, insets: PaddingValues) -> Unit`: the app's destinations, given where they are and the insets of the edges they touch there.
- `modifier: Modifier`: the scaffold's modifier. The scaffold fills the space it is given.
- `topBar: (@Composable (insets: PaddingValues) -> Unit)?`: the bar above the content, given the insets of the edges it touches.
- `snackbars: PantrixSnackbarState?`: the app's snackbars: shown over the content, and provided to everything inside as `LocalPantrixSnackbars`. Without them, a scaffold shows no snackbars of its own and keeps the `LocalPantrixSnackbars` of the layout around it.
- `snackbarHost: @Composable () -> Unit`: what shows the snackbars over the content: by default a `PantrixSnackbarHost` of `snackbars`.
- `containerColor: Color`: drawn behind everything, the window's system bars included.
- `contentColor: Color`: the colour of text and icons that set none. By default the one paired with `containerColor` when that is a role's fill, and none on the theme's background, on its surface or on a colour the theme does not know.
- `windowInsets: WindowInsets`: the insets the scaffold hands to its slots and keeps the content and the snackbars clear of, by default the system bars and the display cutout, without the keyboard; any a parent has already consumed are left out.
- `style: ScaffoldStyle?`: this call's own style, which says from what width the navigation moves to the start edge: over every enclosing one. Only the fields it sets change, on every platform.
- `content: @Composable (padding: PaddingValues) -> Unit`: the screen, given the padding that keeps it clear of the bars and the insets.

### ScaffoldNavigationPlacement

`import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement`, from `com.pantrixui:components`

```kotlin
enum class ScaffoldNavigationPlacement
```

Where a `PantrixScaffold` with adaptive navigation puts it.

Entries:

- `Bottom`: Along the bottom edge, below the content: a navigation bar. Where the scaffold is narrow, and on a foldable held like a laptop on a table.
- `Start`: Along the start edge, the scaffold's full height: a navigation rail or a sidebar. The right edge in a right-to-left layout.
- `VerticalBar`: Upright, at the bottom of the system's vertical bar: the column the iPhone Duo's outer screen keeps along its side for its status bar and an app's bars. A navigation bar drawn as `NavigationBarOrientation.Vertical`. Where the window has such a column, stands upright and has no fold across it, and the scaffold reaches the column, whatever the scaffold's width.

### ScaffoldStyle

`import com.pantrixui.components.container.scaffold.ScaffoldStyle`, from `com.pantrixui:components`

```kotlin
class ScaffoldStyle(
    public val sideNavigationMinWidth: Dp = Dp.Unspecified
) : PantrixStyle<ScaffoldStyle>
```

`PantrixScaffold`'s one decision of its own: how wide it has to be before its adaptive navigation moves from the bottom edge to the start edge.

The scaffold measures its own width, not the window's, so a scaffold in one pane of a wider window decides by the space it has. The width does not follow the density. On a foldable held like a laptop on a table the navigation stays along the bottom edge at any width: that is the window's posture, not a style. A scaffold's colours are not part of its style: its container is `background` by default, and its insets come from the window.

Parameters:

- `sideNavigationMinWidth: Dp`: The narrowest a scaffold is when its adaptive navigation sits along the start edge; a narrower scaffold puts it along the bottom edge. 600dp on every platform, the width at which Material 3 moves navigation from a bar to a rail.

### LocalPantrixSnackbars

`import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars`, from `com.pantrixui:components`

```kotlin
val LocalPantrixSnackbars: ProvidableCompositionLocal<PantrixSnackbarState?>
```

The snackbars of the layout around this composable, or null where nothing provides them.

A layout that puts a `PantrixSnackbarHost` over its content provides the host's state here, so a screen inside it shows a snackbar without the state being passed down to it: `LocalPantrixSnackbars.current?.show(...)`, in a coroutine. `PantrixScaffold`, given its `snackbars`, provides them.

### Modifier.scrollPadding

`import com.pantrixui.foundation.a11y.scrollPadding`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.scrollPadding(padding: PaddingValues): Modifier
```

Says what the content of a scroller keeps free at its ends, so that what is asked to be shown is shown inside it: clear of a bar the content scrolls beneath, and not at the scroller's very edge.

Whatever scrolls an element brings it into view when it takes the focus, and no further than the scroller's own edge. Where the content scrolls beneath a bar, as a scaffold's content does that is padded by the bars' share, that edge is behind the bar: the focus of a keyboard goes where it cannot be seen, and the page fails WCAG 2.2's 2.4.11, Focus Not Obscured. With this on the content, every asking to show something in it, the focus's own and any other, is made larger by `padding` as it passes, and the scroller shows the element that far from its edge: above the bar.

It goes on what is scrolled, inside the scroller, and adds no padding of its own: it says what the content has.

- On the content of a row or a column that scrolls, after the scroll and before the padding it speaks of: `Modifier.verticalScroll(state).scrollPadding(padding).padding(padding)`.

- On each item of a lazy list or grid whose `contentPadding` is `padding`.

A scroller that is asked for more than it holds scrolls nothing and hands the rest on as a drag of the user's, which moves a sheet it stands in. So in a row or a column no more is asked for than the content reaches: what is scrolled is found by its size, larger than its place, and the last element is shown as far from the edge as there is content after it. In a lazy list, and where the content fits its scroller, how far the content goes cannot be told, and all of `padding` is asked for: the content has to have that much at its ends, as it does where it was given the same padding. A scroller inside is not touched by this: it shows the element as it does by itself, and what is asked of the one around it comes through here.

A focus ring asks for its own room where the content reaches that far (`focusRing`). In a lazy list it cannot: there the list's content padding and this have the ring's room in them, `PantrixPlatform.focusRingReach`.

docs/guide/scroll-padding/SCROLL_PADDING_GUIDE.md has the whole of it, and the same for a project without this library.

Parameters:

- `padding: PaddingValues`: what the content has at each end, inside the scroller: the bars' share a scaffold hands its content, a lazy list's `contentPadding`. Start and end follow the layout's direction. Where the scroller itself ends above the keyboard, as with `imePadding`, a bar at its foot is behind the keyboard and covers none of it: there the keyboard's inset is taken off, `padding - WindowInsets.ime.asPaddingValues()`, or what is typed is shown a bar's height too high.
