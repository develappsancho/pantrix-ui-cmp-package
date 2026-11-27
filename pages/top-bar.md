# Top Bar

The bar at the top of a screen: the screen's name, with a navigation icon at its start and actions at its end.

The bar is as wide as what holds it and as tall as its style says; it is taller only where what it holds needs it, as a title set larger does. On a screen it usually stands in the `topBar` slot of `PantrixScaffold`. The bars on this page do not stand at the top edge of a screen, so each is inside a surface with a border: that is how their bounds show.

- `PantrixBackButton` (`com.pantrixui.components.container.topbar`, `com.pantrixui:components`): The button that goes back to the screen before, for a top bar's navigation icon: the platform's arrow or chevron, named "Back" in the theme's language. Keywords: back, navigate up, up button, return, previous screen, back arrow.
- `PantrixTopBar` (`com.pantrixui.components.container.topbar`, `com.pantrixui:components`): The bar at the top of a screen: its title, with a navigation icon before it and actions after it; the title at the start or in the middle, as the platform has it. Keywords: app bar, toolbar, header, title bar, action bar, large title.

## Features

- **Title and subtitle.** `title` is the screen's name, on one line; `subtitle` is written under it, smaller: a count, a state. Either is cut short when it does not fit the room between the navigation icon and the actions, and does not run under them. Their text styles are given with `titleStyle` and `subtitleStyle`; unless given, they are the theme's `title` and `footnote` styles.
- **Platform.** The title stands at the start on Android, desktop and the web, and in the middle of the bar on iOS. A title in the middle is in the exact middle of the bar while it fits there; when it does not, it moves away from the wider side. The bar is 54dp tall on Android and iOS, 56dp on desktop and the web.
- **Navigation icon and actions.** `navigationIcon` stands before the title: a back button, or a button that opens a menu. `actions` is a row after the title: icon buttons for what the screen can do, the most used first.
- **Back button.** `PantrixBackButton` draws the platform's icon: an arrow on Android, desktop and the web, a chevron on iOS; both turn round in a right-to-left layout. A screen reader calls it "Back" in the theme's language.
- **Line over scrolled content.** While `scrolled` is true a line is drawn along the bar's bottom edge. The line is inside the bar's height; nothing moves as it comes and goes.
- **Collapsing title.** A bar given a `state` writes its title large while it is open, in a band under the row; as the content scrolls up the band closes and the title comes into the row. The content hands the bar its scroll with `Modifier.topBarScroll(state)`.
- **Insets.** `insets` is the room the bar keeps clear at its edges: for the status bar and a cutout. The bar's fill runs behind them.
- **Colour.** The bar is the theme's `surface`, with the title in `textPrimary` and the subtitle in `textSecondary`. `TopBarColors` gives the fill, the colour of the content and the line; on a bar with a fill, all of it is written in one colour.
- **Reading order.** A screen reader and the Tab key go through the bar in the order it reads: the navigation icon, the title and the subtitle under it, the actions. The title is the screen's heading for a screen reader.
- **Automation.** With a `tagKey` the bar is tagged `TopBar_<tagKey>`, and the large title of a collapsing bar `TopBar_<tagKey>.Title_large`. The back button is an icon button: it carries the tag `IconButton_<tagKey>`, and its press is reported as an icon button's.

## Usage

### In a top bar

```kotlin
PantrixTopBar(
    title = stringResource(Res.string.settings),
    navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
    tagKey = "settings"
)
```

### On the first screen of a flow, where there is nowhere to go back to

```kotlin
PantrixBackButton(onClick = onBack, enabled = step > 0, tagKey = "back")
```

### A screen with a back button and an action

```kotlin
val list = rememberLazyListState()
PantrixScaffold(
    topBar = { insets ->
        PantrixTopBar(
            title = stringResource(Res.string.conversation),
            navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
            actions = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Search,
                    contentDescription = PantrixTheme.strings.search,
                    onClick = onSearch,
                    tagKey = "search"
                )
            },
            scrolled = list.canScrollBackward,
            insets = insets,
            tagKey = "conversation"
        )
    }
) { padding ->
    LazyColumn(state = list, contentPadding = padding) {
        items(messages, key = { it.id }) { MessageRow(it) }
    }
}
```

### A title that collapses as the list scrolls

```kotlin
val topBar = rememberPantrixTopBarState()
val list = rememberLazyListState()
PantrixScaffold(
    topBar = { insets ->
        PantrixTopBar(
            title = stringResource(Res.string.inbox),
            navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
            scrolled = list.canScrollBackward,
            state = topBar,
            insets = insets,
            tagKey = "inbox"
        )
    }
) { padding ->
    LazyColumn(modifier = Modifier.topBarScroll(topBar), state = list, contentPadding = padding) {
        items(conversations, key = { it.id }) { ConversationRow(it) }
    }
}
```

### A title and a subtitle in types of their own

```kotlin
PantrixTopBar(
    title = stringResource(Res.string.projects),
    subtitle = stringResource(Res.string.open_projects, open),
    titleStyle = PantrixTheme.typography.callout,
    subtitleStyle = PantrixTheme.typography.caption,
    tagKey = "projects"
)
```

### A title with a subtitle, in the brand's colour

```kotlin
PantrixTopBar(
    title = stringResource(Res.string.inbox),
    subtitle = stringResource(Res.string.unread, unread),
    colors = TopBarColors(container = PantrixTheme.colors.primary.color),
    tagKey = "inbox"
)
```

## Examples

### Title only

The least there is to write: `title` alone. With no navigation icon, a title at the start begins at the bar's own inset; on iOS the title is in the middle.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(title = "Inbox", tagKey = "plain")
}
```

### Back button, actions and content scrolling under the bar

A conversation screen: a back button, two actions and a list that scrolls under the bar. `navigationIcon` puts a `PantrixBackButton` before the title; the subtitle says how many times the back button has been pressed. `actions` puts two icon buttons after the title: drawn as they are, in the brand's colour.

Scroll the list: as soon as it leaves its top, a line appears along the bar's bottom edge (`scrolled`), and it stays for as long as the list can scroll back. The line is inside the bar's height; nothing moves as it comes and goes.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val list = rememberLazyListState()
var back by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Column(modifier = Modifier.height(220.dp)) {
        PantrixTopBar(
            title = "Conversation",
            subtitle = if (back == 0) null else "Back presses: $back",
            navigationIcon = { PantrixBackButton(onClick = { back++ }, tagKey = "back") },
            actions = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Search,
                    contentDescription = "Search",
                    onClick = {},
                    tagKey = "search"
                )
                PantrixIconButton(
                    imageVector = PantrixIcons.MoreHorizontal,
                    contentDescription = "More",
                    onClick = {},
                    tagKey = "more"
                )
            },
            scrolled = list.canScrollBackward,
            tagKey = "conversation"
        )
        LazyColumn(
            // The list is as wide as the bar: left narrower, a finger on the space beside it would scroll
            // the page, not the list.
            modifier = Modifier.fillMaxWidth(),
            state = list,
            contentPadding = PaddingValues(PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
        ) {
            items(12) { index -> PantrixText(text = "Message ${index + 1}") }
        }
    }
}
```

### Subtitle

`subtitle` puts a line of smaller text under the title: a count, a state. The navigation icon here is not a back button but an icon button that opens a menu.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Projects",
        subtitle = "12 open",
        navigationIcon = {
            PantrixIconButton(
                imageVector = PantrixIcons.Menu,
                contentDescription = "Open menu",
                onClick = {},
                tagKey = "menu"
            )
        },
        tagKey = "subtitle"
    )
}
```

### Title and subtitle in text styles of their own

The title and the subtitle can each be given a text style: `titleStyle` and `subtitleStyle`. Unless given, they are the theme's `title` and `footnote` styles; here `callout` and `caption` are given. Where the style has no colour of its own, the text stays in the bar's colour. A larger style makes the bar as tall as its line needs.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Projects",
        subtitle = "12 open",
        titleStyle = PantrixTheme.typography.callout,
        subtitleStyle = PantrixTheme.typography.caption,
        navigationIcon = {
            PantrixIconButton(
                imageVector = PantrixIcons.Menu,
                contentDescription = "Open menu",
                onClick = {},
                tagKey = "type_menu"
            )
        },
        tagKey = "own_type"
    )
}
```

### A title that does not fit is cut short

The title does not run under the navigation icon or the actions: a title too long for the room left between them is cut short. The bar here is at most 360dp wide; the title does not fit between the back button and the star, and its end is cut off.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.widthIn(max = 360.dp), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Third-quarter reports, as they were sent to the board of directors",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "long_back") },
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Star,
                contentDescription = "Add to favourites",
                onClick = {},
                tagKey = "favourite"
            )
        },
        tagKey = "long"
    )
}
```

### Where the title stands: at the start and in the middle

Where the title stands follows the platform: at the start on Android, desktop and the web, in the middle of the bar on iOS. Here the same bar is drawn twice, and the place is given with `style`: `TopBarStyle(titleAlignment = ...)`. Both show, whichever platform you are on.

A title in the middle is in the middle of the bar whatever stands beside it: the back button does not push it aside.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarStyle
import com.pantrixui.components.container.topbar.TopBarTitleAlignment
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Settings",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "start_back") },
        style = TopBarStyle(titleAlignment = TopBarTitleAlignment.Start),
        tagKey = "start"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Settings",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "center_back") },
        style = TopBarStyle(titleAlignment = TopBarTitleAlignment.Center),
        tagKey = "center"
    )
}
```

### The back button's icon

`PantrixBackButton` takes the icon it draws from the bar's style: `TopBarStyle.backIcon`. The platform's own icon is an arrow on Android, desktop and the web, a chevron on iOS. Here each of the two bars is given an icon with `style`; a back button in a bar's `navigationIcon` uses the style that bar was given.

Both turn round in a right-to-left layout: flip the reading direction from the "Typeface and direction" menu in the app's top bar and look.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.BackButtonIcon
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarStyle
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Arrow",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "arrow_back") },
        style = TopBarStyle(backIcon = BackButtonIcon.Arrow),
        tagKey = "arrow"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Chevron",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "chevron_back") },
        style = TopBarStyle(backIcon = BackButtonIcon.Chevron),
        tagKey = "chevron"
    )
}
```

### With nowhere to go back to

On the first screen of a flow there is nowhere to go back to: the `enabled` of `PantrixBackButton` is false and the button cannot be pressed. Move on with the button at the end: the back button is enabled from the second step on.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var step by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Step ${step + 1} / 3",
        navigationIcon = { PantrixBackButton(onClick = { step -= 1 }, enabled = step > 0, tagKey = "step_back") },
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.ArrowForward,
                contentDescription = "Next step",
                onClick = { step += 1 },
                enabled = step < 2,
                tagKey = "step_next"
            )
        },
        tagKey = "steps"
    )
}
```

### A large title that collapses as the list scrolls

A collapsing title: the state is the app's and is kept with `rememberPantrixTopBarState()`; the list hands the bar its scroll with `Modifier.topBarScroll(state)`. While the bar is open the title is written large, in the theme's `headline` style, in a band under the row. The large title stands at the bar's start on every platform; the title in the row stands where the platform has it, in the middle on iOS.

Scroll the list up: first the band closes and the title comes into the row, and only then does the list scroll. The bar opens again only once the list is back at its top. Left between its two heights by a finger, it goes on to the nearer; after a mouse wheel it goes on the way the wheel was last turned. A screen reader reads the title in the row: that one is there all the time, and the title is not read twice.

The bar and the list are inside a scaffold, as they would be in an app: the list fills the whole scaffold and is given the bar's height as its top inset. As the bar closes and opens the list itself stays where it is; only its inset changes. The button below takes the list back to its top and opens the bar by setting `collapsedFraction` to zero.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.rememberPantrixTopBarState
import com.pantrixui.components.container.topbar.topBarScroll
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val topBar = rememberPantrixTopBarState()
val list = rememberLazyListState()
val scope = rememberCoroutineScope()
val spacing = PantrixTheme.spacing
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixScaffold(
        modifier = Modifier.height(320.dp),
        topBar = { insets ->
            PantrixTopBar(
                title = "Inbox",
                subtitle = "3 unread",
                navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "collapsing_back") },
                actions = {
                    PantrixIconButton(
                        imageVector = PantrixIcons.Search,
                        contentDescription = "Search",
                        onClick = {},
                        tagKey = "collapsing_search"
                    )
                },
                scrolled = list.canScrollBackward,
                state = topBar,
                insets = insets,
                tagKey = "collapsing"
            )
        },
        containerColor = PantrixTheme.colors.surface,
        // A box inside the page: the system bars are in the page's scaffold, and this one has no insets.
        windowInsets = WindowInsets(0, 0, 0, 0)
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().topBarScroll(topBar),
            state = list,
            contentPadding = PaddingValues(
                start = spacing.lg,
                top = padding.calculateTopPadding() + spacing.lg,
                end = spacing.lg,
                bottom = spacing.lg
            ),
            verticalArrangement = Arrangement.spacedBy(spacing.md)
        ) {
            items(24) { index -> PantrixText(text = "Conversation ${index + 1}") }
        }
    }
}
PantrixButton(
    text = "Back to top and open the bar",
    onClick = {
        scope.launch {
            list.scrollToItem(0)
            topBar.collapsedFraction = 0f
        }
    },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "collapsing_to_top"
)
```

### The insets the bar keeps clear

`insets` is the room the bar keeps clear at its edges: room for the status bar and a cutout. A `PantrixScaffold` hands it to its top bar itself; here a top inset of 28dp is given by hand. The bar's fill runs behind the inset, and the title and the back button stay below it: the bar is as tall as its style's height plus the inset.

```kotlin
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarColors
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Settings",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "insets_back") },
        colors = TopBarColors(container = PantrixTheme.colors.primary.container),
        insets = PaddingValues(top = 28.dp),
        tagKey = "insets"
    )
}
```

### In its own colours

`colors` gives the bar colours of its own in place of the theme's. The first bar's fill is the colour of one of the theme's roles, and that alone is given: the theme pairs the colour of the title, the subtitle and the back button with it.

The second bar is in a colour the theme does not have, the app's own purple: the colour that reads on it is given with `content`. The title, the subtitle and the back button take the `content` colour. The icon button has colours of its own: the colour that reads on the fill is given to it separately.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarColors
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Inbox",
        subtitle = "Only the fill is given",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "role_back") },
        colors = TopBarColors(container = PantrixTheme.colors.primary.color),
        tagKey = "role"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Inbox",
        subtitle = "3 unread",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "own_back") },
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Search,
                contentDescription = "Search",
                onClick = {},
                colors = ButtonColors(container = Color.Transparent, content = own.onColor),
                tagKey = "own_search"
            )
        },
        colors = TopBarColors(container = own.color, content = own.onColor),
        tagKey = "own"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixTopBar

`import com.pantrixui.components.container.topbar.PantrixTopBar`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTopBar(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    titleStyle: TextStyle = PantrixTheme.typography.title,
    subtitleStyle: TextStyle = PantrixTheme.typography.footnote,
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: (@Composable RowScope.() -> Unit)? = null,
    scrolled: Boolean = false,
    state: PantrixTopBarState? = null,
    style: TopBarStyle? = null,
    colors: TopBarColors? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null
)
```

The bar at the top of a screen: the screen's title, with a navigation icon before it and actions after it.

Where the title stands follows the platform (`TopBarStyle.titleAlignment`): at the start on Android, the desktop and the web, in the middle of the bar on iOS. A title in the middle is in the middle of the bar, whatever is beside it, while it fits there; one too wide for that moves over, away from the wider side. Neither kind runs under the navigation icon or the actions: a title that is too long for the room between them is cut short, and so is the `subtitle` under it. The title is the screen's heading for a screen reader.

The bar is as wide as what holds it, and as tall as its style says under the `insets` it keeps clear. It is taller only where what it holds needs it, as a title in a larger type does: the title's lines keep a little clear of its top and its bottom.

```kotlin
val list = rememberLazyListState()
PantrixScaffold(
    topBar = { insets ->
        PantrixTopBar(
            title = stringResource(Res.string.conversation),
            navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
            scrolled = list.canScrollBackward,
            insets = insets,
            tagKey = "conversation"
        )
    }
) { padding -> Messages(list, padding) }
```

With a `state` the bar has a collapsing title. It starts `TopBarStyle.expandedHeight` tall, with the title in a large type, and the subtitle under it, in a band of their own under the navigation icon and the actions, at the bar's start on every platform. As the content under the bar scrolls up the band closes and the bar comes down to `TopBarStyle.height`, the title in the row coming in as the one in the band goes. The content hands the bar its scroll with `Modifier.topBarScroll(state)`. A screen reader reads the title in the row, which is there all the time, and never meets the title twice.

A screen reader and the Tab key go through the bar in the order it reads: the navigation icon, the title and the subtitle under it, the actions.

**In the system's vertical bar.** Inside a `PantrixScaffold` that holds the column the iPhone Duo's outer screen keeps along its side, the bar hands its navigation icon and its actions over to it: they stand at the column's top, under the status bar, the navigation icon in a capsule of the bar's fill and the actions one above another in another, as UIKit puts a navigation bar's buttons there. The bar keeps its title, which then has the bar's width. Of two bars handing buttons over at once, as while one page slides over another, the column shows the one that came last.

Parameters:

- `title: String`: the screen's name, on one line.
- `modifier: Modifier`: the bar's modifier.
- `subtitle: String?`: a line under the title in a smaller type, a count or a state, or null for none.
- `titleStyle: TextStyle`: the type the title is set in, in the row: the theme's `title` unless given. A larger one makes the bar as tall as its line needs. Its colour is the bar's unless the style has one of its own. The large title of a collapsing bar is the theme's `headline`, whatever this is.
- `subtitleStyle: TextStyle`: the type the subtitle is set in, in the row and in a collapsing bar's band: the theme's `footnote` unless given. Its colour is the bar's unless the style has one of its own.
- `navigationIcon: (@Composable () -> Unit)?`: what stands before the title: a `PantrixBackButton`, or a button that opens a drawer. Null for none, and the title then starts at the bar's own inset.
- `actions: (@Composable RowScope.() -> Unit)?`: what stands after the title, in a row: icon buttons for what the screen can do, the most used first. A button draws in its own colours, the brand's unless it is given others: on a bar with a fill of its own, give each the colour that reads there.
- `scrolled: Boolean`: whether a line is drawn along the bar's bottom edge, to part it from what is scrolled under it: pass whether the content can scroll back, as `listState.canScrollBackward`. The line is inside the bar's height, and nothing moves as it comes and goes.
- `state: PantrixTopBarState?`: gives the bar a collapsing title: kept with `rememberPantrixTopBarState`, and handed the content's scroll with `Modifier.topBarScroll`. Null is a bar of one height.
- `style: TopBarStyle?`: this bar's own geometry, which a `PantrixBackButton` in `navigationIcon` draws with too. Only the fields it sets change, on every platform.
- `colors: TopBarColors?`: this bar's own colours, or null for the theme's: its `surface`, with the title in `textPrimary` and the subtitle in `textSecondary`.
- `insets: PaddingValues`: the room the bar keeps clear at its edges, the status bar's and a cutout's, as a `PantrixScaffold` hands its top bar. The bar's fill runs behind them.
- `tagKey: String?`: the bar's automation key, the same in every language: the bar is tagged `TopBar_<tagKey>`, and the large title of a collapsing one `TopBar_<tagKey>.Title_large`.

### PantrixBackButton

`import com.pantrixui.components.container.topbar.PantrixBackButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixBackButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    tagKey: String? = null
)
```

A button that goes back to the screen before, for a `PantrixTopBar`'s navigation icon: an icon button a screen reader calls "Back" in the theme's language.

It draws the platform's own icon (`TopBarStyle.backIcon`): an arrow on Android, the desktop and the web, a chevron on iOS. Both turn round in a right-to-left layout. In a top bar's `navigationIcon` it takes the style that bar was given.

It is a `PantrixIconButton`, and on the theme's grounds it is drawn as one: in the brand's colour. On a fill, and in a bar that was given a colour for what it holds, it is drawn in that colour. It is tagged `IconButton_<tagKey>` and reports an `IconButton` `click`.

Parameters:

- `onClick: () -> Unit`: called at a press: go back to the screen before.
- `modifier: Modifier`: the button's modifier.
- `enabled: Boolean`: whether the button can be pressed.
- `tagKey: String?`: the button's automation key, the same in every language.

### rememberPantrixTopBarState

`import com.pantrixui.components.container.topbar.rememberPantrixTopBarState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberPantrixTopBarState(): PantrixTopBarState
```

A `PantrixTopBarState` that survives a configuration change, for a `PantrixTopBar` with a collapsing title.

### PantrixTopBarState

`import com.pantrixui.components.container.topbar.PantrixTopBarState`, from `com.pantrixui:components`

```kotlin
class PantrixTopBarState(collapsedFraction: Float = 0f)
```

How far a `PantrixTopBar` with a collapsing title has collapsed, and the scroll that collapses it.

A bar given a state is `TopBarStyle.expandedHeight` tall, with its title in a large type in a band under the navigation icon and the actions. As the content under it scrolls up the band closes, the title comes into the row, and the bar is `TopBarStyle.height` tall. The content hands the bar its scroll with `topBarScroll`: the bar collapses before the content moves, and opens again only once the content is back at its top, so the large title does not come back in the middle of a list. A finger that leaves the bar between its two heights is followed by the bar going on to the nearer, and a mouse wheel by the bar going on the way the wheel was last turned.

The state is the app's, as a scroll state is: keep it with `rememberPantrixTopBarState`, which survives a configuration change, and read `collapsedFraction` for anything else that follows the bar.

Parameters:

- `collapsedFraction: Float`: how far the bar is collapsed to begin with: 0, all open, unless it is told.

Members:

- `collapsedFraction: Float`: 0 while the bar is all open, 1 once it has collapsed. Set, it is kept between the two: set to 0, as a screen that has just gone back to its top does, it opens the bar.

On the type:

- `PantrixTopBarState.Saver: Saver<PantrixTopBarState, Float>`: Keeps how far the bar had collapsed across a configuration change.

### Modifier.topBarScroll

`import com.pantrixui.components.container.topbar.topBarScroll`, from `com.pantrixui:components`

```kotlin
fun Modifier.topBarScroll(state: PantrixTopBarState): Modifier
```

Hands the scroll of the content this is on to `state`, so that the top bar over it collapses as the content scrolls up, and opens again once the content is back at its top. It watches a mouse wheel over the content too: a wheel says nothing of when its scroll is over, and content at its top has no use for a wheel turned up.

```kotlin
val topBar = rememberPantrixTopBarState()
LazyColumn(modifier = Modifier.topBarScroll(topBar), contentPadding = padding) { ... }
```

Parameters:

- `state: PantrixTopBarState`

### TopBarTitleAlignment

`import com.pantrixui.components.container.topbar.TopBarTitleAlignment`, from `com.pantrixui:components`

```kotlin
enum class TopBarTitleAlignment
```

Where a `PantrixTopBar` puts its title.

Entries:

- `Start`: At the start, after the navigation icon: the top bars of Android, the desktop and the web.
- `Center`: In the middle of the bar, whatever stands beside it, while it fits there: the navigation bar of iOS.

### BackButtonIcon

`import com.pantrixui.components.container.topbar.BackButtonIcon`, from `com.pantrixui:components`

```kotlin
enum class BackButtonIcon
```

The icon a `PantrixBackButton` draws.

Entries:

- `Arrow`: An arrow: the back button of Android, the desktop and the web.
- `Chevron`: A chevron: the back button of iOS.

### TopBarStyle

`import com.pantrixui.components.container.topbar.TopBarStyle`, from `com.pantrixui:components`

```kotlin
class TopBarStyle(
    public val height: Dp = Dp.Unspecified,
    public val expandedHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val titleInset: Dp = Dp.Unspecified,
    public val titleGap: Dp = Dp.Unspecified,
    public val titleAlignment: TopBarTitleAlignment? = null,
    public val backIcon: BackButtonIcon? = null
) : PantrixStyle<TopBarStyle>
```

`PantrixTopBar`'s geometry, and the icon `PantrixBackButton` draws.

`titleInset` keeps the title clear of an edge that has nothing beside it; next to a navigation icon or the actions the title is `titleGap` away from them. The bar is taller than `height` only where what it holds needs it. The heights and the room in the bar follow the density; where the title stands and which icon goes back do not. A top bar's colours are not part of its style: they are the theme's, and `TopBarColors` where a bar has its own.

Parameters:

- `height: Dp`: How tall the bar is, under the insets it keeps clear: 54dp on Android and iOS, 56dp on desktop and the web.
- `expandedHeight: Dp`: How tall a bar with a collapsing title is before it collapses: `height`, and under it the band that holds the title in a large type. 106dp on Android and iOS, 104dp on desktop and the web: a band of 52dp, and of 48dp on desktop and the web. A band is taller only where its lines need it, and a style that sets this no higher than `height` has no band: its bar is of one height, with a state or without.
- `horizontalPadding: Dp`: The room between the bar's edges and the navigation icon and the actions: 8dp.
- `titleInset: Dp`: How far the title stands from the bar's start edge where there is no navigation icon, and from its end edge where there are no actions: 16dp. The title is never nearer an edge than `horizontalPadding`.
- `titleGap: Dp`: The room between the navigation icon and the title, and between the title and the actions: 8dp.
- `titleAlignment: TopBarTitleAlignment?`: Where the title stands: in the middle on iOS, at the start elsewhere.
- `backIcon: BackButtonIcon?`: What a `PantrixBackButton` draws: a chevron on iOS, an arrow elsewhere.

### TopBarColors

`import com.pantrixui.components.container.topbar.TopBarColors`, from `com.pantrixui:components`

```kotlin
data class TopBarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

What a `PantrixTopBar` is painted with, for a bar that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// A bar in the brand's own colour, written in what the theme pairs with it.
PantrixTopBar(title = title, colors = TopBarColors(container = PantrixTheme.colors.primary.color))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for what the bar holds, unless `content` is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The bar's fill, which runs behind the insets the bar keeps clear. The theme's `surface`.
- `content: Color`: The title, the subtitle, and the icons of the navigation icon and the actions that give no colour of their own. On the theme's own fill the title is the theme's `textPrimary`, the subtitle its `textSecondary`, and an icon its own default.
- `divider: Color`: The line along the bar's bottom edge while content is scrolled under it. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`: the edge a subtle button has.
