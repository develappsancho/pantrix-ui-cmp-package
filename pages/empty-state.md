# Empty State

What a place shows while it has nothing to show: a list before its first item, a search that found nothing, a pane that waits for a document. It says what the place is for and what to do there, and gives the way to do it.

- `PantrixEmptyState` (`com.pantrixui.components.container.emptystate`, `com.pantrixui:components`): What a place shows while it has nothing to show: an icon, a title, a line of what to do there and an action, in the middle of its room. Keywords: empty state, no results, nothing here, blank slate, zero state, placeholder.

## Features

- **Its parts.** An `icon` in a circle of the theme's neutral fill, a `title`, a `description` under it in the callout's type, and an `action` under them all: the app's own button, which the app tags and whose press it hears. Only the title is needed.
- **Its place.** It fills the width it is given and stands in the middle of it. In a wide room the title and the description run no wider than the style's `maxTextWidth`, 360dp: a line that runs across a whole window is not read.
- **Screen reader.** The title and the description are read as one, the action after them, as a button. The icon is not read: the title says what it shows.
- **Platform.** The circle is 64dp on Android and iOS, the icon 32dp and the room 24dp; on desktop and the web 48dp, 24dp and 16dp (`EmptyStateStyle`).
- **Its own colours.** `EmptyStateColors` gives the colours of the circle, the icon, the title and the description; what is not given stays the theme's.
- **Automation.** With `tagKey` the empty state is `EmptyState_<tagKey>`; the action's button carries its own tag.

## Usage

### A list that has nothing yet

```kotlin
if (recent.isEmpty()) {
    PantrixEmptyState(
        title = stringResource(Res.string.nothing_opened_yet),
        description = stringResource(Res.string.paste_or_open_a_file),
        icon = PantrixIcons.Folder,
        tagKey = "recent"
    )
}
```

### A search that found nothing, with a way on

```kotlin
PantrixEmptyState(
    title = stringResource(Res.string.no_orders_match),
    description = stringResource(Res.string.try_another_word),
    icon = PantrixIcons.Search,
    action = {
        PantrixButton(
            text = stringResource(Res.string.clear_the_filter),
            onClick = { query = "" },
            variant = ButtonVariant.Outline,
            tagKey = "clear_filter"
        )
    },
    tagKey = "orders"
)
```

## Examples

### A list that is still empty

A list that has nothing yet: the icon says what the list holds, the title what is not there, and the description what will come there. A long description goes on to a second line at 360dp and stays centred.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.emptystate.PantrixEmptyState
import com.pantrixui.foundation.icons.PantrixIcons

PantrixEmptyState(
    title = "Nothing opened yet",
    description = "Paste a document or open a file; it is kept here, the last one opened first.",
    icon = PantrixIcons.Folder,
    tagKey = "recent"
)
```

### A search that found nothing

A search that found nothing: the action takes the reader back to something to find. The button is the app's: the empty state puts it under the description, and the app gives its tag and hears its press. Here clearing the filter brings the orders back, and "Search again" shows the empty state again.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.emptystate.PantrixEmptyState
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons

var query by rememberSaveable { mutableStateOf("red") }
if (query.isEmpty()) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        listOf("Order 4821", "Order 4822", "Order 4823").forEach { order -> PantrixText(order) }
        PantrixButton(
            text = "Search again",
            onClick = { query = "red" },
            variant = ButtonVariant.Text,
            tagKey = "search_again"
        )
    }
} else {
    PantrixEmptyState(
        title = "No orders match",
        description = "\"$query\" is in no order. Try another word, or clear the filter.",
        icon = PantrixIcons.Search,
        action = {
            PantrixButton(
                text = "Clear the filter",
                onClick = { query = "" },
                variant = ButtonVariant.Outline,
                tagKey = "clear_filter"
            )
        },
        tagKey = "orders"
    )
}
```

### Inside a card, with its own style and colours

Inside a card, on the card's own fill: a smaller circle and less room (`EmptyStateStyle`), and the circle and the icon in the app's own colour (`EmptyStateColors`). The second card has a title alone: neither a circle nor a description is needed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.emptystate.EmptyStateColors
import com.pantrixui.components.container.emptystate.EmptyStateStyle
import com.pantrixui.components.container.emptystate.PantrixEmptyState
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixEmptyState(
        title = "No notifications",
        description = "Something new shows here when it comes.",
        icon = PantrixIcons.Inbox,
        style = EmptyStateStyle(iconContainerSize = 40.dp, iconSize = 20.dp, padding = 8.dp, iconGap = 8.dp),
        colors = EmptyStateColors(iconContainer = own.container, icon = own.onContainer),
        tagKey = "notifications"
    )
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixEmptyState(
        title = "No messages",
        colors = EmptyStateColors(title = PantrixTheme.colors.textSecondary),
        tagKey = "messages"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixEmptyState

`import com.pantrixui.components.container.emptystate.PantrixEmptyState`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixEmptyState(
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    icon: ImageVector? = null,
    action: (@Composable () -> Unit)? = null,
    style: EmptyStateStyle? = null,
    colors: EmptyStateColors? = null,
    tagKey: String? = null
)
```

What a place shows while it has nothing to show: a list before its first item, a search that found nothing, a pane that waits for a document. It says what the place is for and what to do there, and gives the way to do it.

- **Its parts.** An `icon` in a circle of the theme's neutral fill, a `title`, a `description` under it in the callout's type, and an `action` under them all: the app's own button, which it tags and whose press it hears. Only the title is needed.

- **Its place.** It fills the width it is given, and stands in the middle of it: the title and the description run no wider than the style's `maxTextWidth`, centred. Its height is what it holds: a screen centres it in a taller room by the box it puts it in.

- **To a screen reader** the title and the description are one thing, read as they come; the action is read after them, as the button it is. The icon is not read: the title says what it shows.

```kotlin
if (recent.isEmpty()) {
    PantrixEmptyState(
        title = stringResource(Res.string.nothing_opened_yet),
        description = stringResource(Res.string.paste_or_open_a_file),
        icon = PantrixIcons.Folder,
        tagKey = "recent"
    )
}
```

Parameters:

- `title: String`: what the place has none of, or what it waits for: `Nothing opened yet`.
- `modifier: Modifier`: the empty state's modifier. It fills the width it is given.
- `description: String?`: what to do there, in a line or two, or null for the title alone.
- `icon: ImageVector?`: what the place holds when it is not empty, drawn in a circle over the title, or null for none.
- `action: (@Composable () -> Unit)?`: what is done about it, under the words: the app's own button, `PantrixButton`, which is tagged by the app. Null for none.
- `style: EmptyStateStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: EmptyStateColors?`: this empty state's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the empty state's automation key: it is `EmptyState_<tagKey>`.

### EmptyStateStyle

`import com.pantrixui.components.container.emptystate.EmptyStateStyle`, from `com.pantrixui:components`

```kotlin
class EmptyStateStyle(
    public val iconSize: Dp = Dp.Unspecified,
    public val iconContainerSize: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val textGap: Dp = Dp.Unspecified,
    public val actionGap: Dp = Dp.Unspecified,
    public val maxTextWidth: Dp = Dp.Unspecified
) : PantrixStyle<EmptyStateStyle>
```

`PantrixEmptyState`'s geometry: the circle its icon stands in, the room around what it holds and between its parts, and how wide its words run.

The room follows the density; the circle, the icon and the width of the words do not: they are not air.

Parameters:

- `iconSize: Dp`: The icon's own size: 32dp on Android and iOS, 24dp on desktop and the web.
- `iconContainerSize: Dp`: The circle the icon stands in the middle of: 64dp on Android and iOS, 48dp on desktop and the web.
- `padding: Dp`: The room between the edge of what the empty state stands in and what it holds: 24dp on Android and iOS, 16dp on desktop and the web.
- `iconGap: Dp`: The room between the circle and the title: 16dp on Android and iOS, 12dp on desktop and the web.
- `textGap: Dp`: The room between the title and the description: 4dp.
- `actionGap: Dp`: The room between the words and the action under them: 16dp.
- `maxTextWidth: Dp`: How wide the title and the description run at the most, in the middle of a wide room: a line that runs across a whole window is not read. 360dp.

### EmptyStateColors

`import com.pantrixui.components.container.emptystate.EmptyStateColors`, from `com.pantrixui:components`

```kotlin
data class EmptyStateColors(
    public val icon: Color = Color.Unspecified,
    public val iconContainer: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val description: Color = Color.Unspecified
)
```

What `PantrixEmptyState` is painted with, where it is not the theme's: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixEmptyState(
    title = stringResource(Res.string.no_results),
    icon = PantrixIcons.Search,
    colors = EmptyStateColors(iconContainer = brand.container, icon = brand.onContainer)
)
```

Parameters:

- `icon: Color`: The icon: the `onContainer` of the theme's neutral role.
- `iconContainer: Color`: The circle behind the icon: the `container` of the theme's neutral role.
- `title: Color`: The title: the theme's `textPrimary`.
- `description: Color`: The description: the theme's `textSecondary`.
