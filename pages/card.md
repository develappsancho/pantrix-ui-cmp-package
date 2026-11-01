# Card

A container for one subject: a header, a body and actions on a surface of their own, with media edge to edge above them. An order, an article, a group of settings.

A card is as wide as its widest part. Given a width, usually with `fillMaxWidth()`, its media spans that width and its actions sit against the card's end edge.

- `PantrixCard` (`com.pantrixui.components.container.card`, `com.pantrixui:components`): A container for one subject, with header, media and footer slots; one button when it has an onClick. Keywords: panel, tile, container, content card, clickable card.
- `PantrixCardSkeleton` (`com.pantrixui.components.container.card`, `com.pantrixui:components`): A card whose content has not arrived: the card's own surface with bars in place of its header, body and actions, announced once. Keywords: card placeholder, loading card, shimmer card, skeleton card.

## Features

- **Three variants.** `variant` says how the card is set apart from what it stands on: `Elevated` by a shadow, `Filled` by a fill, `Outlined` by a hairline.
- **Slots.** `header` stands above the body and `footer` below it; `media` is drawn above them all, edge to edge, and takes none of the card's padding. The lines of the body have the theme's small spacing (`spacing.sm`) between them.
- **Height.** A card given a height is filled by its body: the `footer` stands at the card's foot, and a child of the body given a `weight` takes the room between. The cards of a row are of one height this way.
- **One button.** Given `onClick`, the whole card is one button: a screen reader hears one target. A button in the `footer` keeps its own press.
- **A card that cannot be pressed.** A card that has `onClick` and whose `enabled` is false gives its content the theme's disabled colour; a child that sets a colour of its own keeps it.
- **Content colour.** On the theme's `surface`, that is, in an `Elevated` and an `Outlined` card, the card gives its content no colour: each child is drawn in its own default. A `Filled` card, and a card given a role's fill, gives the colour that reads on that fill.
- **Colours of its own.** `CardColors` gives the fill, the content's colour and the edge; one that is left out stays the variant's.
- **Platform.** The corners and the shadow depend on the platform (`CardStyle`): a medium corner and a 2dp shadow on Android, a large corner and no shadow on iOS, a small corner and a 1dp shadow on desktop and the web.
- **Skeleton.** `PantrixCardSkeleton` stands in for a card whose data has not arrived: the card's own surface, with bars in it where the header, the lines and the buttons will be. It is announced to a screen reader once, for the whole card.
- **Automation.** `tagKey` gives the card the tag `Card_<tagKey>`; a press is reported as a `Card` event, along with the card's variant.

## Usage

### Header, body and actions

```kotlin
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    header = {
        PantrixText(text = order.title, style = PantrixTheme.typography.title, role = TextRole.Heading(level = 3))
    },
    footer = {
        PantrixButton(
            text = stringResource(Res.string.cancel),
            onClick = onCancel,
            variant = ButtonVariant.Text,
            tagKey = "cancel"
        )
        PantrixButton(text = stringResource(Res.string.save), onClick = onSave, tagKey = "save")
    }
) {
    PantrixText(text = order.summary)
}
```

### The whole card as one target

```kotlin
PantrixCard(
    variant = CardVariant.Outlined,
    onClick = { openOrder(order.id) },
    contentDescription = stringResource(Res.string.open_order, order.number),
    tagKey = "order"
) {
    PantrixText(text = order.title, style = PantrixTheme.typography.title)
    PantrixText(text = order.status, color = PantrixTheme.colors.textSecondary)
}
```

### Media edge to edge

```kotlin
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    media = {
        PantrixImage(
            painter = painterResource(Res.drawable.article_cover),
            modifier = Modifier.height(160.dp),
            contentScale = ContentScale.Crop
        )
    }
) {
    PantrixText(text = article.title, style = PantrixTheme.typography.title)
    PantrixText(text = article.summary, maxLines = 3)
}
```

### In colours of its own

```kotlin
val info = PantrixTheme.colors.info
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = info.container, content = info.onContainer)
) {
    PantrixText(text = stringResource(Res.string.new_feature), style = PantrixTheme.typography.title)
    PantrixText(text = stringResource(Res.string.new_feature_summary))
}
```

### Cards of one height in a row

```kotlin
Row(Modifier.height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
    plans.forEach { plan ->
        PantrixCard(
            modifier = Modifier.weight(1f).fillMaxHeight(),
            footer = {
                PantrixButton(text = stringResource(Res.string.choose), onClick = { choose(plan) }, tagKey = plan.id)
            }
        ) {
            PantrixText(text = plan.name, style = PantrixTheme.typography.title)
            PantrixText(text = plan.summary)
        }
    }
}
```

### In place of the card until its data arrives

```kotlin
if (order == null) {
    PantrixCardSkeleton(modifier = Modifier.fillMaxWidth(), lines = 2, footerButtons = 2)
} else {
    OrderCard(order, modifier = Modifier.fillMaxWidth())
}
```

### A loading list, announced once

```kotlin
val loading = PantrixTheme.strings.loading
LazyColumn(Modifier.semantics { contentDescription = loading }) {
    items(count = 3, contentType = { "skeleton" }) {
        PantrixCardSkeleton(variant = CardVariant.Outlined, contentDescription = null)
    }
}
```

### In the colours of the card it stands in for

```kotlin
val info = PantrixTheme.colors.info
PantrixCardSkeleton(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = info.container),
    skeletonColors = SkeletonColors(base = info.onContainer.copy(alpha = 0.3f), highlight = info.container),
    lines = 1
)
```

## Examples

### At its plainest

Its shortest form: a `PantrixCard` and its body. No variant was given, so it is `Elevated`. The lines of the body stand one under another, with the theme's small spacing between them.

The first card was given no width: it is as wide as its widest line. The second was given `fillMaxWidth()` and fills the space it is in.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard {
    PantrixText(text = "Weekly summary", style = PantrixTheme.typography.title)
    PantrixText(text = "Three new orders, one return")
}
PantrixCard(modifier = Modifier.fillMaxWidth()) {
    PantrixText(text = "Monthly summary", style = PantrixTheme.typography.title)
    PantrixText(text = "A width was given: the card fills the space it is in")
}
```

### Three variants

`variant` picks how the card is set apart from what it stands on. `Elevated` is in the theme's `surface` colour and is lifted by a shadow; on iOS it has no shadow, and the surface colour alone sets the card apart. `Filled` is not lifted and is set apart by the neutral role's fill: it is for a card on a surface that is already raised. `Outlined` is edged by a hairline in the theme's `divider` colour: it is for dense lists of cards, where many shadows become noise.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Elevated) {
    PantrixText(text = "Elevated card", style = PantrixTheme.typography.title)
    PantrixText(text = "The default variant: set apart by a shadow")
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixText(text = "Filled card", style = PantrixTheme.typography.title)
    PantrixText(text = "Set apart by colour instead of a shadow")
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
    PantrixText(text = "Outlined card", style = PantrixTheme.typography.title)
    PantrixText(text = "Set apart by a hairline")
}
```

### Media, header and actions

The card's three slots. `media` stands at the very top, above the header too, and takes none of the card's padding: it reaches the card's edges, and the card cuts its corners. `header` is above the body and is usually the card's title. `footer` gathers the actions in a row at the card's end edge; the main action stands last.

Since the card was given a width, the media spans that width and the actions sit against the end edge.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixCard(
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    header = {
        PantrixText(
            text = "Compose Multiplatform",
            style = PantrixTheme.typography.title,
            role = TextRole.Heading(level = 3)
        )
    },
    media = {
        PantrixImage(
            painter = painterResource(Res.drawable.compose_multiplatform),
            modifier = Modifier.height(140.dp).background(PantrixTheme.colors.info.container),
            contentDescription = null
        )
    },
    footer = {
        PantrixButton(text = "Later", onClick = {}, variant = ButtonVariant.Text, tagKey = "article_later")
        PantrixButton(text = "Read", onClick = {}, tagKey = "article_read")
    },
    tagKey = "article"
) {
    PantrixText(text = "Android, iOS, desktop and web from a single codebase.")
}
```

### Of one height in a row

The cards of a row are as tall as the tallest: the row is given `height(IntrinsicSize.Min)`, and each card `weight(1f)` and `fillMaxHeight()`. A card given a height is filled by its body: the `footer` stands at the card's foot, the button of the plan with the short summary too. A child of the body given `Modifier.weight(1f)` takes the room between and pushes the price down to the button.

A card given no height is as tall as what it holds, and its `footer` stands right under its body.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    modifier = Modifier.fillMaxWidth().height(IntrinsicSize.Min),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PLANS.forEach { plan ->
        PantrixCard(
            modifier = Modifier.weight(1f).fillMaxHeight(),
            variant = CardVariant.Outlined,
            footer = { PantrixButton(text = "Choose", onClick = {}, tagKey = "plan_${plan.key}") },
            tagKey = "plan_${plan.key}"
        ) {
            PantrixText(text = plan.name, style = PantrixTheme.typography.title)
            PantrixText(text = plan.summary, color = PantrixTheme.colors.textSecondary)
            Spacer(Modifier.weight(1f))
            PantrixText(text = plan.price, style = PantrixTheme.typography.callout)
        }
    }
}

private val PLANS = listOf(
    Plan("solo", "Solo", "For one app.", "Free"),
    Plan("team", "Team", "For a team of up to five, with a shared theme and shared components.", "400 ₺ a month")
)

private class Plan(val key: String, val name: String, val summary: String, val price: String)
```

### The whole card as one button

Given `onClick`, the whole card is one button. That is the accessible way to build a card that opens something: a screen reader hears one target, with the card's text or, if one is given, with `contentDescription`. Press the first card: the app's snackbar lets you know.

The second card's `enabled` is false: it cannot be pressed and gives its content the theme's disabled colour; this colour of its text is what says that it cannot be pressed. A card without `onClick` ignores `enabled`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Outlined,
    onClick = { scope.launch { snackbars?.show(message = "Order #1043 opened", tagKey = "order_opened") } },
    contentDescription = "Open order 1043",
    tagKey = "order_1043"
) {
    PantrixText(text = "Order #1043", style = PantrixTheme.typography.title)
    PantrixText(text = "The whole card is one button", color = PantrixTheme.colors.textSecondary)
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined, onClick = {}, enabled = false) {
    PantrixText(text = "Order #1039", style = PantrixTheme.typography.title)
    PantrixText(text = "Cancelled, cannot be opened")
}
```

### In its own colours

With `colors` the card takes the given colours, not its variant's; a field that is left out stays the variant's.

The first card was given only a fill, and that fill is the colour of one of the theme's roles: the theme itself pairs it with the colour that reads on it. The second card's fill is in none of the theme's roles; it is the app's own purple, and the theme cannot know what reads on it, so `content` is given too. On the third card, which is `Outlined`, only the edge changed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardColors
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = PantrixTheme.colors.info.container)
) {
    PantrixText(text = "New feature", style = PantrixTheme.typography.title)
    PantrixText(text = "Only the fill was given; the theme paired the text's colour with it")
}
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = own.container, content = own.onContainer),
    tagKey = "own_colors"
) {
    PantrixText(text = "Membership", style = PantrixTheme.typography.title)
    PantrixText(text = "Both the fill and the content colour were given")
}
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Outlined,
    colors = CardColors(border = own.color)
) {
    PantrixText(text = "Selected plan", style = PantrixTheme.typography.title)
    PantrixText(text = "Only the edge's colour was given")
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Shape, padding and style

`shape` changes the corners of one card and wins over the style's corners. `contentPadding` is the room around the header, the body and the actions; its default is `spacing.lg`, and the second card was given `spacing.sm`.

`style` changes the card's geometry: on the last card, a deeper shadow with `CardStyle(elevation = 8.dp)`. Only the field that is given changes, and it changes on every platform: this card has a shadow on iOS too.

```kotlin
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardStyle
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), shape = PantrixTheme.shapes.none) {
    PantrixText(text = "Square corners", style = PantrixTheme.typography.title)
    PantrixText(text = "shape = PantrixTheme.shapes.none")
}
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Outlined,
    contentPadding = PaddingValues(PantrixTheme.spacing.sm)
) {
    PantrixText(text = "Tight padding", style = PantrixTheme.typography.title)
    PantrixText(text = "contentPadding = PaddingValues(PantrixTheme.spacing.sm)")
}
PantrixCard(modifier = Modifier.fillMaxWidth(), style = CardStyle(elevation = 8.dp)) {
    PantrixText(text = "Deeper shadow", style = PantrixTheme.typography.title)
    PantrixText(text = "style = CardStyle(elevation = 8.dp)")
}
```

### Until the data arrives: the skeleton

Press "Refresh": for two seconds the two cards are replaced by their skeletons. `PantrixCardSkeleton` is not drawn to look like a card: it is built from the card's own shape, fill, shadow, padding and spacing. Its bars take the room of what they stand in for: when the data arrives the card's height does not change, and nothing below it moves.

The skeleton cannot know what is in the card: `showHeader`, `lines`, `footerButtons` and `mediaHeight` are given to match the card it stands in for. The first card has a header, one line and two buttons: `lines = 1`, `footerButtons = 2`.

The fill and the content colour of the "Campaign" card were given by the caller. Its skeleton takes the card's colours with `colors` too; its bars are drawn in the colour given with `skeletonColors`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardColors
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.card.PantrixCardSkeleton
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.skeleton.SkeletonColors
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

val own = ownColors()
val campaign = CardColors(container = own.container, content = own.onContainer)
var loading by remember { mutableStateOf(false) }
LaunchedEffect(loading) {
    if (loading) {
        delay(2_000)
        loading = false
    }
}
if (loading) {
    PantrixCardSkeleton(modifier = Modifier.fillMaxWidth(), lines = 1, footerButtons = 2)
} else {
    PantrixCard(
        modifier = Modifier.fillMaxWidth(),
        header = {
            PantrixText(
                text = "Order #1042",
                style = PantrixTheme.typography.title,
                role = TextRole.Heading(level = 3)
            )
        },
        footer = {
            PantrixButton(
                text = "Refresh",
                onClick = { loading = true },
                variant = ButtonVariant.Text,
                tagKey = "reload"
            )
            PantrixButton(text = "Track", onClick = {}, tagKey = "track")
        }
    ) {
        PantrixText(text = "Two items, delivery on Thursday")
    }
}
if (loading) {
    PantrixCardSkeleton(
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.Filled,
        colors = campaign,
        skeletonColors = SkeletonColors(base = own.onContainer.copy(alpha = 0.3f), highlight = own.container),
        lines = 1
    )
} else {
    PantrixCard(
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.Filled,
        colors = campaign,
        tagKey = "campaign"
    ) {
        PantrixText(text = "Campaign", style = PantrixTheme.typography.title)
        PantrixText(text = "Its fill and content colour were given by the caller")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### A loading list

A loading list: the skeletons of two outlined cards. `mediaHeight` stands in for the media the card will show, `lines` for the lines of the body, and `footerButtons` for the actions.

A skeleton that stands alone is announced to a screen reader once, for the whole card: with the theme's word, "Loading". Inside something that already says it is loading, this announcement is turned off: here the list says once that it is loading, and the skeletons were given `contentDescription = null`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCardSkeleton
import com.pantrixui.foundation.theme.PantrixTheme

val loading = PantrixTheme.strings.loading
Column(
    modifier = Modifier.widthIn(max = 360.dp).semantics { contentDescription = loading },
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    repeat(2) {
        PantrixCardSkeleton(
            modifier = Modifier.fillMaxWidth(),
            variant = CardVariant.Outlined,
            lines = 2,
            footerButtons = 1,
            mediaHeight = 96.dp,
            contentDescription = null
        )
    }
}
```

## API

### PantrixCard

`import com.pantrixui.components.container.card.PantrixCard`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCard(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.Elevated,
    onClick: (() -> Unit)? = null,
    enabled: Boolean = true,
    style: CardStyle? = null,
    shape: Shape = PantrixTheme.style(CardStyle, style).shape.toShape(),
    colors: CardColors? = null,
    contentPadding: PaddingValues = PaddingValues(PantrixTheme.spacing.lg),
    header: (@Composable () -> Unit)? = null,
    media: (@Composable () -> Unit)? = null,
    footer: (@Composable RowScope.() -> Unit)? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    content: @Composable ColumnScope.() -> Unit
)
```

A container for one subject: a header, a body and actions on a surface of their own, with media edge to edge above them.

Given `onClick`, the whole card is one button. That is the accessible way to build a card that opens something: a screen reader announces one target, with the card's text or its `contentDescription`, rather than leaving the user to find which of the card's children is the real link. A button in the `footer` keeps its own press.

On the theme's surface, where an elevated and an outlined card stand, the card gives what it holds no colour: each child draws in its own default, a text in `textPrimary`. A `CardVariant.Filled` card, and one given a role's colour as its fill, gives the colour that reads on that fill. A card that cannot be pressed, one with `onClick` and `enabled` false, gives its content the disabled colour instead, so its text and icons say that it cannot; a child that sets a colour of its own keeps it.

A card is as wide as its widest part, whether or not it has a footer. Given a width, usually with `fillMaxWidth()`, its media spans it and its footer reaches its end edge. Given a height, as the cards of a row are given the height of the tallest with `fillMaxHeight()`, its body fills it: the footer stands at the card's foot, and a child of the body given `Modifier.weight(1f)` takes the room between, with what follows it at the bottom.

Parameters:

- `modifier: Modifier`: the card's modifier.
- `variant: CardVariant`: how the card stands off what it sits on: its fill, its shadow and its edge.
- `onClick: (() -> Unit)?`: when given, the whole card becomes one button, and a click is reported as a `Card` event that carries the variant.
- `enabled: Boolean`: whether a card with `onClick` can be pressed. A card without one ignores it.
- `style: CardStyle?`: this call's own style: over every enclosing one. Only the fields it sets change, on every platform. A card's corners and depth are not scaled by the density.
- `shape: Shape`: the card's corners: by default the resolved style's. Given here, it wins over `style`'s.
- `colors: CardColors?`: this card's own colours: the ones it sets, with the variant's for the rest.
- `contentPadding: PaddingValues`: the room around the header, the body and the footer. The media takes none.
- `header: (@Composable () -> Unit)?`: drawn above the body: usually the card's title.
- `media: (@Composable () -> Unit)?`: drawn edge to edge above the padded content, because a picture inset by the card's padding reads as a mistake.
- `footer: (@Composable RowScope.() -> Unit)?`: the card's actions in a row at the end edge, the main one last: closest to the thumb on a phone, and where the eye finishes on a wide card. In a card taller than what it holds, they stand at its foot.
- `contentDescription: String?`: what a screen reader says for the card. For a card with `onClick`, name what it opens.
- `tagKey: String?`: the card's automation key: the card is `Card_<tagKey>`.
- `interactionSource: MutableInteractionSource?`: the card's interactions, hoisted. The card keeps a source of its own when this is null.
- `content: @Composable ColumnScope.() -> Unit`: the card's body, in a column whose children stand `spacing.sm` apart. A child given a weight takes the room a card's height leaves.

### PantrixCardSkeleton

`import com.pantrixui.components.container.card.PantrixCardSkeleton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCardSkeleton(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.Elevated,
    style: CardStyle? = null,
    shape: Shape = PantrixTheme.style(CardStyle, style).shape.toShape(),
    colors: CardColors? = null,
    skeletonColors: SkeletonColors? = null,
    contentPadding: PaddingValues = PaddingValues(PantrixTheme.spacing.lg),
    showHeader: Boolean = true,
    lines: Int = 3,
    footerButtons: Int = 0,
    mediaHeight: Dp? = null,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

A `PantrixCard` whose content has not arrived: the card's own surface, with bars where its header, its body and its actions will be.

It is built from the card's own shape, fill, shadow, padding and spacing rather than drawn to look like one, so the frame the data arrives in is already there. Its bars take the room of what they stand for: the header's of a line of the theme's title, the body's of `lines` lines of text in the type a `PantrixText` has by itself, the theme's label, the footer's of medium buttons. A card with that content is as tall as its skeleton, and nothing below it moves when the data arrives. The skeleton cannot know what a card holds: match `showHeader`, `lines`, `footerButtons` and `mediaHeight` to the card it replaces.

It is announced once, for the whole card. A dozen bars that each said they were loading would make a loading list unusable with a screen reader. It fills the width it is given: a bar has no width of its own.

Parameters:

- `modifier: Modifier`: the skeleton's modifier.
- `variant: CardVariant`: the variant of the card it replaces: the same fill, shadow and edge.
- `style: CardStyle?`: this call's own `CardStyle`: over every enclosing one and under the density. The footer's bars keep the theme's button shape.
- `shape: Shape`: the card's corners: by default the resolved style's. Given here, it wins over `style`'s.
- `colors: CardColors?`: the colours of the card it replaces, where that card has its own: the same fill and edge.
- `skeletonColors: SkeletonColors?`: the bars' own colours, where they are not the theme's.
- `contentPadding: PaddingValues`: the room around the bars, as around a card's content.
- `showHeader: Boolean`: whether a bar stands in for the header: a line of the theme's title.
- `lines: Int`: how many lines of text the bars stand in for, in the type a `PantrixText` has by itself.
- `footerButtons: Int`: how many buttons the footer's bars stand in for.
- `mediaHeight: Dp?`: the height of the media the card will show above its content, or null for a card without any.
- `contentDescription: String?`: what a screen reader says for the whole skeleton, or null inside something that already says it is loading.
- `tagKey: String?`: the skeleton's automation key: it is `CardSkeleton_<tagKey>`, and its bars have no tags of their own. Without one it has no tag.

### CardVariant

`import com.pantrixui.components.container.card.CardVariant`, from `com.pantrixui:components`

```kotlin
enum class CardVariant
```

How a `PantrixCard` stands off what it sits on.

Entries:

- `Elevated`: Lifted off the page by a shadow, on the surface colour. The default. On iOS the preset has no shadow, and the surface colour alone sets the card apart.
- `Filled`: Tinted rather than lifted, in the neutral role's container: for a card on a surface that is already raised.
- `Outlined`: Edged by a hairline in the divider colour: for dense lists of cards, where many shadows become noise.

### CardStyle

`import com.pantrixui.components.container.card.CardStyle`, from `com.pantrixui:components`

```kotlin
class CardStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val elevation: Dp = Dp.Unspecified
) : PantrixStyle<CardStyle>
```

`PantrixCard`'s geometry: its corners, and the shadow of its elevated variant.

An iOS card is flat with a larger corner, because iOS surfaces stand apart by the contrast of their fills rather than by a shadow. Neither value follows the density: a corner and a shadow are not air. A card's colours are not part of its style: they come from its `CardVariant`, and from `CardColors` where a card has its own.

Parameters:

- `shape: ShapeSpec`: The card's corners: medium on Android, large on iOS, small on desktop and the web.
- `elevation: Dp`: The shadow under `CardVariant.Elevated`: 2dp on Android, none on iOS, 1dp on desktop and the web. The other variants draw none.

### CardColors

`import com.pantrixui.components.container.card.CardColors`, from `com.pantrixui:components`

```kotlin
data class CardColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What `PantrixCard` is painted with, for a card that does not take its variant's colours: a colour that is set is used, and one that is left out stays the variant's.

```kotlin
PantrixCard(colors = CardColors(container = brand.container, content = brand.onContainer)) {
    PantrixText(text = stringResource(Res.string.new_feature))
}
```

A card with an action it cannot run, one with `onClick` and `enabled` false, still gives its content the theme's disabled colour, whatever `content` is.

A fill given here that is one of the theme's own colours brings the colour the theme pairs with it for what is drawn on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The card's fill. The theme's `surface`, or the neutral role's `container` in a `CardVariant.Filled` card.
- `content: Color`: What the card holds is drawn in, where a child sets no colour of its own. Unless given, it is the colour that reads on `container`: none on the theme's `surface`, where each child draws in its own default, a text in `textPrimary`; the neutral role's `onContainer` in a filled card; `textPrimary` on the theme's `background`; and on a role's colour the one the theme pairs with it.
- `border: Color`: The hairline around the card. The theme's `divider` on a `CardVariant.Outlined` card, and where that card is given a fill that is no ground of the theme's, on which that line would not read, a share of what is written there: the edge a subtle button has. The other variants have none unless one is given here.
