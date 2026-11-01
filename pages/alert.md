# Alert

A message about what the user is doing, beside the thing it is about: the form that was just sent, the row about to be deleted, the field that needs a second look.

The alert stands in the content, is as wide as what holds it, and stays until the screen takes it away. What the app has just done, said for a few seconds over the whole screen, is a snackbar.

- `PantrixAlert` (`com.pantrixui.components.container.alert`, `com.pantrixui:components`): A message about what the user is doing, beside the thing it is about: six tones, three ways of drawing it, an action and a close button. Keywords: callout, inline message, notice, message bar, inline notification, warning.

## Features

- **Six tones.** `tone` chooses the alert's colour, its icon and how it is announced. The four semantic tones, `Info`, `Success`, `Warning` and `Danger`, say how something went in three ways: a colour alone fails whoever cannot see it. `Primary` and `Neutral` say nothing of that, and have no icon of their own.
- **Three variants.** `variant`: `Soft` is the tone's pale fill, `Outline` an edge with no fill, and `Accent` the fill with a bar down its leading edge: on the left in a left-to-right layout, on the right in a right-to-left one.
- **A message with a link.** `message` can be an `AnnotatedString` too: a `LinkAnnotation` in it becomes a link, underlined, in the alert's text colour.
- **Title and icon.** `title` is a line above the message, in a heavier type. `icon` puts another icon in place of the tone's own, or takes the icon away with null.
- **Action.** `action` puts one or two small buttons under the message, at the trailing edge.
- **Dismissal.** With `onDismiss` the alert has a close button. An alert does not go away by itself: it stays until the caller stops showing it.
- **Screen reader.** The title and the message are read as one, and the action and the close button after them. The alert is announced when it appears or changes: assertively for `Danger`, politely for the rest. `announce = false` turns this off.
- **First line.** The icon and the close button stand on the text's first line, however large the type is set. An alert with an icon and one without are as tall as each other.
- **Platform.** The corners are medium on Android and iOS, and small on desktop and the web; the padding is 12dp and 10dp, and the bar 4dp and 3dp (`AlertStyle`).
- **Text.** `textStyle` changes the type of the message, and of the title in its bold; the icon and the close button stand on that type's first line.
- **Colours of its own.** `AlertColors` gives the fill, the colour of the text and of what marks the tone, and `border` the colour of an edge apart from the icon's; the tone still decides the icon and the way the alert is announced.
- **Automation.** With `tagKey` the alert is `Alert_<tagKey>` and its close button `AlertClose_<tagKey>`. A dismissal is reported with its tone and its variant, and never with its message.

## Usage

### What went wrong with the form

```kotlin
if (error != null) {
    PantrixAlert(message = error, tone = AlertTone.Danger, tagKey = "form_error")
}
```

### A standing note inside a card

```kotlin
PantrixAlert(
    message = stringResource(Res.string.archived_records_cannot_be_edited),
    variant = AlertVariant.Outline,
    title = stringResource(Res.string.read_only),
    announce = false,
    tagKey = "read_only"
)
```

### A warning with an action, which the user can close

```kotlin
if (showStorageWarning) {
    PantrixAlert(
        message = stringResource(Res.string.storage_almost_full),
        tone = AlertTone.Warning,
        variant = AlertVariant.Accent,
        action = {
            PantrixButton(
                text = stringResource(Res.string.manage_storage),
                onClick = onManageStorage,
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                colors = PantrixTheme.colors.warning.buttonColors(ButtonVariant.Text)
            )
        },
        onDismiss = { showStorageWarning = false },
        tagKey = "storage"
    )
}
```

## Examples

### Message and title

The least it takes is `message` alone: the tone is then `Info` and the variant `Soft`, and the icon comes from the tone. The alert fills the width it is given.

`title` puts a line in a heavier type above the message: it says in a few words what the alert is about. A screen reader hears the title and the message as one.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.PantrixAlert

PantrixAlert(message = "Your profile photo has been updated", tagKey = "plain")
PantrixAlert(
    message = "We have sent a verification link to your new address",
    title = "Verify your email",
    tagKey = "titled"
)
```

### Six tones

`tone` is one of the theme's colour roles; it chooses the alert's colour, its icon and how it is announced to a screen reader, all at once. The four semantic tones reach the user three ways: as a colour, as an icon and in the way they are announced. `Danger` is the one tone announced assertively.

`Primary` and `Neutral` do not say how something went, and have no icon. An alert in one of them is a note set apart from the text around it: a feature to try, something to know that does not ask for the eye.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert

PantrixAlert(message = "A new version is ready to install", tagKey = "info")
PantrixAlert(message = "Your changes have been saved", tone = AlertTone.Success, tagKey = "success")
PantrixAlert(message = "Your storage is almost full", tone = AlertTone.Warning, tagKey = "warning")
PantrixAlert(message = "The message could not be sent", tone = AlertTone.Danger, tagKey = "danger")
PantrixAlert(message = "Try the new editor", tone = AlertTone.Primary, tagKey = "primary")
PantrixAlert(message = "Last opened: yesterday", tone = AlertTone.Neutral, tagKey = "neutral")
```

### Three variants

`variant` chooses how the alert is drawn: a pale fill, an edge alone, or the fill with a bar down its leading edge. `Soft` is the default, and what a page wants. `Accent` tells alerts one under another apart at a glance.

`Outline` is for a card or a dialog: a pale fill would be lost on their own fill. The one here is inside a filled card: it has no fill of its own, so the card's fill shows, and its text is written in the colour that reads on the card. This alert's `announce` is false as well: a note that was there before the user came is not announced when it appears.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard

PantrixAlert(
    message = "A pale fill: this is how it looks on a page",
    title = "Soft",
    tagKey = "soft"
)
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixAlert(
        message = "Archived records cannot be changed",
        variant = AlertVariant.Outline,
        title = "Outline: read-only",
        // It was already here when the user came: a screen reader gets to it in its own time.
        announce = false,
        tagKey = "outline"
    )
}
PantrixAlert(
    message = "Alerts one under another are told apart at a glance",
    tone = AlertTone.Success,
    variant = AlertVariant.Accent,
    title = "Accent",
    tagKey = "accent"
)
```

### Changing and removing the icon

`icon` is the mark before the text: the tone's own unless one is given, and none when null. The `Primary` and `Neutral` tones have no icon of their own; here each of them was given one. The icon is never read out: the message says what it stands for.

An alert with an icon and one without are as tall as each other: the text's first line takes the room of an icon, with one beside it or without.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.foundation.icons.PantrixIcons

PantrixAlert(message = "An info note with its icon removed", icon = null, tagKey = "no_icon")
PantrixAlert(
    message = "Added to your favourites",
    tone = AlertTone.Primary,
    icon = PantrixIcons.Star,
    tagKey = "star_icon"
)
PantrixAlert(
    message = "The meeting is at 10.00 tomorrow",
    tone = AlertTone.Neutral,
    icon = PantrixIcons.Calendar,
    tagKey = "calendar_icon"
)
```

### Action and dismissal

A warning with two actions and a close button. `action` puts the buttons under the message, at the trailing edge. A text button's own colour is the brand's; `buttonColors(ButtonVariant.Text)`, taken from the tone's role, draws it in the tone's colour, which reads on the tone's fill.

There is a close button because `onDismiss` is given. Press the cross or "Later": it is the screen's state that takes the alert away, not the alert; the button that brings it back takes its place. Someone using a screen reader can also close the alert with the dismiss action, without finding the button.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var shown by rememberSaveable { mutableStateOf(true) }
// A text button's own colour is the brand's; on the alert's fill it is the tone's own colour that reads.
val inTheTone = PantrixTheme.colors.warning.buttonColors(ButtonVariant.Text)
if (shown) {
    PantrixAlert(
        message = "New photos may not be backed up",
        tone = AlertTone.Warning,
        variant = AlertVariant.Accent,
        title = "Your storage is almost full",
        action = {
            PantrixButton(
                text = "Later",
                onClick = { shown = false },
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                colors = inTheTone,
                tagKey = "storage_later"
            )
            PantrixButton(
                text = "Manage",
                onClick = { scope.launch { snackbars?.show(message = "Storage opened", tagKey = "storage") } },
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                colors = inTheTone,
                tagKey = "storage_manage"
            )
        },
        onDismiss = { shown = false },
        tagKey = "storage"
    )
} else {
    PantrixButton(
        text = "Show the warning again",
        onClick = { shown = true },
        variant = ButtonVariant.Outline,
        tagKey = "storage_again"
    )
}
```

### Form error

A form that fails when it is sent. Press "Send": the error alert appears above the button at once. Because its tone is `Danger`, it is announced to a screen reader straight away, interrupting what it is saying. The cross takes it away.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.elements.button.PantrixButton

var failed by rememberSaveable { mutableStateOf(false) }
if (failed) {
    PantrixAlert(
        message = "Check the address and try again in a few minutes",
        tone = AlertTone.Danger,
        title = "Sending failed",
        onDismiss = { failed = false },
        tagKey = "form_error"
    )
}
PantrixButton(text = "Send", onClick = { failed = true }, tagKey = "form_send")
```

### A message with a link

The message can be an `AnnotatedString` too: to set a word in bold, or to put a link in it. A link is a `LinkAnnotation`; the alert draws it in its text's colour, underlined. A `LinkAnnotation.Clickable` does the app's own work when it is pressed, a `LinkAnnotation.Url` opens its address in the browser.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withLink
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert

val report = LocalExampleEvents.current
PantrixAlert(
    message = buildAnnotatedString {
        append("This page goes away in the next release. Read ")
        withLink(LinkAnnotation.Clickable(tag = "guide") { report("New guide opened") }) {
            append("the new guide")
        }
        append(" instead.")
    },
    tone = AlertTone.Warning,
    title = "Old page",
    tagKey = "with_link"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### In its own colours

An alert whose fill, text and marks are in colours the caller gives. `AlertColors` takes three colours: the fill (`container`), the text (`content`) and what marks the tone (`accent`): the icon, the edge of `Outline` and the bar of `Accent`. A colour that is left out stays the tone's. The tone still gives the alert its icon and the way it is announced: only what it is painted in changes.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertColors
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixAlert(
    message = "The colours of its fill, its text and its marks were given by the caller",
    variant = AlertVariant.Accent,
    colors = AlertColors(container = own.container, content = own.onContainer, accent = own.color),
    tagKey = "own"
)
PantrixText(
    text = "Colours are given with AlertColors; a colour that is left out stays the tone's.",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### In its own style

`style` changes the alert's geometry: its corners, its padding, the room between its parts, and how thick the edge of `Outline` and the bar of `Accent` are. Only the fields that are set change; the rest comes from the platform's style.

The third is a note: its fill and its icon are the tone's, its edge a colour apart from them (`AlertColors(border = …)`), its padding one across and another up and down (`horizontalPadding`, `verticalPadding`), and its text the theme's `label` (`textStyle`): the icon and the close button stand on that text's first line, and its colour is still the alert's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.alert.AlertColors
import com.pantrixui.components.container.alert.AlertStyle
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeSpec

PantrixAlert(
    message = "Square corners, bar 8dp",
    tone = AlertTone.Success,
    variant = AlertVariant.Accent,
    style = AlertStyle(shape = ShapeSpec.Fixed(RectangleShape), accentWidth = 8.dp),
    tagKey = "own_style_accent"
)
PantrixAlert(
    message = "Padding 20dp, edge 2dp",
    tone = AlertTone.Warning,
    variant = AlertVariant.Outline,
    style = AlertStyle(padding = 20.dp, borderWidth = 2.dp),
    tagKey = "own_style_outline"
)
PantrixAlert(
    message = "An edge in a colour apart from the fill and the icon; padding of 14 across and 10dp up and down; text the size of a label",
    tone = AlertTone.Warning,
    style = AlertStyle(horizontalPadding = 14.dp, verticalPadding = 10.dp),
    colors = AlertColors(border = PantrixTheme.colors.warning.color.copy(alpha = 0.45f)),
    tagKey = "own_style_note",
    textStyle = PantrixTheme.typography.label
)
```

## API

### PantrixAlert

`import com.pantrixui.components.container.alert.PantrixAlert`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAlert(
    message: String,
    modifier: Modifier = Modifier,
    tone: AlertTone = AlertTone.Info,
    variant: AlertVariant = AlertVariant.Soft,
    title: String? = null,
    icon: ImageVector? = tone.icon(),
    action: (@Composable RowScope.() -> Unit)? = null,
    onDismiss: (() -> Unit)? = null,
    announce: Boolean = true,
    style: AlertStyle? = null,
    colors: AlertColors? = null,
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.body
)
```

A message about what the user is doing, shown beside the thing it is about: the form that was just sent, the row about to be deleted, the one field that needs a second look.

It stands in the content, next to that thing, and is as wide as what holds it. It stays until the screen takes it away: what the app has just done, said for a few seconds over the whole screen, is a snackbar.

A semantic tone reaches the user three ways, as a colour, as an icon and as the way a screen reader is told, because a colour alone fails whoever cannot see it. A screen reader hears the title and the message as one, and the action and the close button after them.

The icon and the close button stand on the text's first line, as a bullet does, however large the type is set. That line is as tall as an icon with one beside it or without, so alerts one under another are as tall as each other. The close button is as large as its cross where it is laid out, so the alert is no taller for it, and its touch target reaches past it into the room around.

Parameters:

- `message: String`: what happened, or what to know: a sentence or two.
- `modifier: Modifier`: the alert's modifier. The alert fills the width it is given.
- `tone: AlertTone`: what the alert is telling: its colours, its icon and the way it is announced.
- `variant: AlertVariant`: how it is drawn: a pale fill, an edge alone, or the fill with a bar.
- `title: String?`: a line above the message, in a heavier type: what it is about, in a few words.
- `icon: ImageVector?`: the mark before the text: the tone's own unless another is given, and none when null. A primary and a neutral alert have none of their own. It is never read out: the message says what it stands for. `icon`: The tone's own icon; a primary and a neutral alert have none.
- `action: (@Composable RowScope.() -> Unit)?`: what the user can do about it, under the message at the end: one or two small buttons. A text button's own colour is the brand's: `PantrixTheme.colors.warning.buttonColors(ButtonVariant.Text)` draws it in the tone's, which reads on the tone's fill. A button there takes the room it is drawn in: the room a finger needs around it reaches into the alert's padding, and the alert is no taller for it.
- `onDismiss: (() -> Unit)?`: called when the close button is pressed, or a screen reader's dismiss action is used. Null leaves the button out. The alert stays until the caller stops showing it.
- `announce: Boolean`: whether a screen reader is told when the alert appears or changes: assertively for `AlertTone.Danger`, politely for the rest. Turn it off for an alert that was there before the user came, as a note that a record cannot be changed: a screen reader gets to it in its own time.
- `style: AlertStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: AlertColors?`: this alert's own colours, where they are not its tone's: the ones set here, with the tone's for the rest.
- `tagKey: String?`: the alert's automation key: the alert is `Alert_<tagKey>` and its close button `AlertClose_<tagKey>`. A dismissal is reported as an `Alert` event, `dismiss`, with the tone and the variant and never the message.
- `textStyle: TextStyle`: the type the message is set in, and the title in its bold: the theme's `body` unless given. A colour in it is not the text's, which is the alert's.

### PantrixAlert

`import com.pantrixui.components.container.alert.PantrixAlert`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAlert(
    message: AnnotatedString,
    modifier: Modifier = Modifier,
    tone: AlertTone = AlertTone.Info,
    variant: AlertVariant = AlertVariant.Soft,
    title: String? = null,
    icon: ImageVector? = tone.icon(),
    action: (@Composable RowScope.() -> Unit)? = null,
    onDismiss: (() -> Unit)? = null,
    announce: Boolean = true,
    style: AlertStyle? = null,
    colors: AlertColors? = null,
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.body
)
```

`PantrixAlert` for a message with more in it than words: a value set as code, a word set in bold, a link to the page that says more. It is drawn, announced and reported as the other form is; a screen reader hears the message's words with the title, and reaches each link on its own, as it reaches the action.

A link that carries no styles of its own is drawn as a link in the alert: underlined, in what the alert writes in, so that it reads on the tone's fill. One that carries its own keeps them.

```kotlin
PantrixAlert(
    message = buildAnnotatedString {
        append("Put the token in ")
        withStyle(SpanStyle(fontFamily = FontFamily.Monospace)) { append("gradle.properties") }
        append(", never in the project. ")
        withLink(LinkAnnotation.Url(tokensHelpUrl)) { append("How to make one") }
    },
    tone = AlertTone.Warning,
    tagKey = "token"
)
```

Parameters:

- `message: AnnotatedString`: what happened, or what to know, with its spans and links.
- `modifier: Modifier`: the alert's modifier. The alert fills the width it is given.
- `tone: AlertTone`: what the alert is telling: its colours, its icon and the way it is announced.
- `variant: AlertVariant`: how it is drawn: a pale fill, an edge alone, or the fill with a bar.
- `title: String?`: a line above the message, in a heavier type: what it is about, in a few words.
- `icon: ImageVector?`: the mark before the text: the tone's own unless another is given, and none when null. `icon`: The tone's own icon; a primary and a neutral alert have none.
- `action: (@Composable RowScope.() -> Unit)?`: what the user can do about it, under the message at the end: one or two small buttons.
- `onDismiss: (() -> Unit)?`: called when the close button is pressed, or a screen reader's dismiss action is used. Null leaves the button out.
- `announce: Boolean`: whether a screen reader is told when the alert appears or changes.
- `style: AlertStyle?`: this call's own style: over every enclosing one and under the density.
- `colors: AlertColors?`: this alert's own colours, where they are not its tone's.
- `tagKey: String?`: the alert's automation key: the alert is `Alert_<tagKey>` and its close button `AlertClose_<tagKey>`.
- `textStyle: TextStyle`: the type the message is set in, and the title in its bold: the theme's `body` unless given. A colour in it is not the text's, which is the alert's.

### AlertTone

`import com.pantrixui.components.container.alert.AlertTone`, from `com.pantrixui:components`

```kotlin
enum class AlertTone
```

What an alert is telling the user: one of the theme's colour roles, which also decides its icon and how it is announced.

The semantic tones, `Info`, `Success`, `Warning` and `Danger`, say how something went, and reach the user as a colour and as an icon, because a colour alone fails whoever cannot see it. `Primary` and `Neutral` say nothing of that, and have no icon of their own: an alert in one of them is a note set apart from the text around it.

Entries:

- `Info`: Something worth knowing that is neither good nor bad.
- `Success`: Something that worked.
- `Warning`: Something to look at before it becomes a problem.
- `Danger`: Something that failed. The one tone announced assertively: it interrupts what a screen reader is saying.
- `Primary`: Something the app wants noticed, in the brand's colour, without an icon: a feature to try, an offer.
- `Neutral`: A note with no hue of its own, in the theme's grey, without an icon: what does not ask for the eye.

### AlertVariant

`import com.pantrixui.components.container.alert.AlertVariant`, from `com.pantrixui:components`

```kotlin
enum class AlertVariant
```

How an alert is drawn, so that it can be seen on whatever it stands on.

Entries:

- `Soft`: The tone's pale fill. The default, and what a page wants.
- `Outline`: An edge in the tone's colour and no fill: for a card or a dialog, whose own fill a pale one would be lost on.
- `Accent`: The pale fill with a bar down its leading edge: for alerts one under another, told apart at a glance.

### AlertStyle

`import com.pantrixui.components.container.alert.AlertStyle`, from `com.pantrixui:components`

```kotlin
class AlertStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val contentGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val accentWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified
) : PantrixStyle<AlertStyle>
```

`PantrixAlert`'s geometry: its corners, the room around what it holds and between its parts, and the two lines its variants draw, an edge all the way round or a bar down the leading edge.

The room follows the density; the corners and the lines do not: they are not air. An alert's colours are not part of its style: they come from its `AlertTone` and its `AlertVariant`, and from `AlertColors` where an alert has its own.

Parameters:

- `shape: ShapeSpec`: The alert's corners: medium on Android and iOS, small on desktop and the web.
- `padding: Dp`: The room between the alert's edge and what it holds: 12dp on Android and iOS, 10dp on desktop and the web.
- `contentGap: Dp`: The room between the icon and the text, and between the text and the close button: 8dp.
- `borderWidth: Dp`: How thick the edge of `AlertVariant.Outline` is: 1dp.
- `accentWidth: Dp`: How wide the bar of `AlertVariant.Accent` is: 4dp on Android and iOS, 3dp on desktop and the web.
- `horizontalPadding: Dp`: The room between the alert's start and end edges and what it holds, where it is not `padding`: unspecified on every platform, which takes `padding`.
- `verticalPadding: Dp`: The room between the alert's top and bottom edges and what it holds, where it is not `padding`: unspecified on every platform, which takes `padding`.

### AlertColors

`import com.pantrixui.components.container.alert.AlertColors`, from `com.pantrixui:components`

```kotlin
data class AlertColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val accent: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What `PantrixAlert` is painted with, for an alert that does not take its tone's colours: a colour that is set is used, and one that is left out stays the tone's.

```kotlin
PantrixAlert(
    message = stringResource(Res.string.new_version_ready),
    colors = AlertColors(container = brand.container, content = brand.onContainer, accent = brand.color)
)
```

A tone still gives an alert its icon and the way it is announced: only what it is painted in changes.

A fill given here that is a role's own brings the colour the theme pairs with it, for what is written on it and for the icon and the lines, unless those are given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The alert's fill. The `container` of its tone's role; none in `AlertVariant.Outline`, which shows what the alert stands on.
- `content: Color`: The title and the message, what the action is drawn in unless it has a colour of its own, and the close button's cross: the colour that reads on `container`. The `onContainer` of its tone's role. None in `AlertVariant.Outline`, where the alert has no fill: its text is drawn as a text is where the alert stands, `textPrimary` on the page and the content colour of a fill around it.
- `accent: Color`: What marks the tone: the icon, the edge of `AlertVariant.Outline` unless `border` is given, and the bar of `AlertVariant.Accent`. The `color` of its tone's role.
- `border: Color`: The edge all the way round the alert, at the style's `borderWidth`, where it is not the icon's colour: an alert of any variant given one draws it, over its fill and beside the bar of `AlertVariant.Accent`. Left out, `AlertVariant.Outline`'s edge is `accent` and the other two variants draw none.
