# Link

A link on its own: not a word inside a sentence, but a text by itself. It runs an action or opens a web page: the "Forgot my password" under a sign-in form, the "Privacy policy" at the bottom of a page. It is underlined, and in the theme's `primary` colour.

- `PantrixLink` (`com.pantrixui.components.elements.link`, `com.pantrixui:components`): A link on its own, outside a sentence: underlined text in the primary colour that runs an action or opens a web page. Keywords: hyperlink, anchor, url, web link, href, open browser.

## Features

- **Two overloads.** A link that takes `onClick` runs an action. One that takes `url` opens the address with the platform's `UriHandler`: in the browser, or in the app that handles the address.
- **Underlined.** A link is not told apart by its colour alone: someone who cannot tell the two colours apart knows it by the line under it. A link that stands in no sentence and is known by its place takes `underline = LinkUnderline.OnHover`: it is underlined under a pointer and while it holds the focus, and always where the platform is used by touch.
- **Its own colour.** `color` sets the text, the underline, and the tint that appears under the link while a pointer is over it or it is pressed. Left out, it is the theme's `primary` colour, on a fill too: there the caller gives the colour that reads.
- **Text style.** Left out, `style` is the theme's `label` style, the style of a `PantrixText` given none: a link beside a text is as large as that text.
- **Touch target.** It is never shorter than the platform's minimum touch target: 48dp on Android, 44dp on iOS, and 32dp on desktop and the web when they are used with a mouse. It is as wide as its text, and starts where a text above it starts.
- **Disabled.** `enabled = false` draws the link in the theme's disabled text colour, and the link takes no press. It keeps its underline: it reads as a link that cannot be followed, not as plain text.
- **Mouse and keyboard.** While a pointer is over the link and while it is pressed, a faint tint in the link's colour appears under its text. The link takes the keyboard focus too: with the focus, that tint is in the focus ring's colour.
- **Analytics.** Every click is reported to the theme's `analytics` as the `Link` component's `click` event. The event says whether the link opens an address, and never the address itself.
- **Automation.** `tagKey` sets the test tag: a link given `tagKey = "forgot_password"` has the tag `Link_forgot_password`.

## Usage

### Under a sign-in form

```kotlin
PantrixLink(
    text = stringResource(Res.string.forgot_password),
    onClick = onForgotPassword,
    style = PantrixTheme.typography.footnote,
    tagKey = "forgot_password"
)
```

### A web page

```kotlin
PantrixLink(
    text = stringResource(Res.string.privacy_policy),
    url = "https://example.com/privacy",
    tagKey = "privacy_policy"
)
```

### On a fill the primary colour would not read on

```kotlin
val primary = PantrixTheme.colors.primary
PantrixSurface(color = primary.color) {
    PantrixLink(
        text = stringResource(Res.string.learn_more),
        onClick = onLearnMore,
        color = primary.onColor,
        tagKey = "learn_more"
    )
}
```

## Examples

### A link that runs an action

At its plainest: a text and an `onClick` that runs when it is pressed. The link is written underlined, in the theme's `primary` colour. Press "Forgot my password": the app's snackbar lets you know.

It is given a `tagKey`: automation finds this link by the tag `Link_forgot_password`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixLink(
    text = "Forgot my password",
    onClick = { scope.launch { snackbars?.show(message = "Reset link sent") } },
    tagKey = "forgot_password"
)
```

### A link that opens an address

The second overload takes `url` in place of `onClick`. When it is pressed the address is opened with the platform's `UriHandler`: in the browser, or in the app that handles the address. Its look and its other parameters are the same as the first overload's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink

PantrixLink(text = "Privacy policy", url = "https://example.com/privacy", tagKey = "privacy_policy")
```

### In its own colour

`color` is the link's own colour: it sets its text, its underline, and the tint that appears under it when a pointer comes over it or presses it. The first link's colour is the app's own purple, which is in none of the theme's roles; the second's is the theme's `danger` role.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val own = ownColors()
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixLink(
        text = "Campaign terms",
        onClick = { scope.launch { snackbars?.show(message = "Campaign terms opened") } },
        color = own.color,
        tagKey = "campaign_terms"
    )
    PantrixLink(
        text = "Delete my account",
        onClick = {},
        color = PantrixTheme.colors.danger.color,
        tagKey = "delete_account"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### On a fill

A link does not look at the content colour around it: given no colour, it is in the theme's `primary` colour on a fill too. Where the fill is `primary` itself, that colour cannot be read; the caller gives the colour that reads there with `color`, here the role's `onColor`.

The `PantrixText` beside it is given no colour: it takes the fill's content colour by itself.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val primary = PantrixTheme.colors.primary
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = primary.color) {
    Row(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = "A new version is ready.")
        PantrixLink(text = "Learn more", onClick = {}, color = primary.onColor, tagKey = "learn_more")
    }
}
```

### Beside a text, and its text style

A link given no `style` is in the theme's `label` style, like a `PantrixText` given no style: in the top row the two stand side by side, at the same size.

The link below is given `style = PantrixTheme.typography.footnote`: the small link under a form. Though its text is smaller, the link is never shorter than the platform's touch target; it is as wide as its text, and starts where the row above it starts.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixText(text = "Don't have an account?")
    PantrixLink(text = "Sign up", onClick = {}, tagKey = "sign_up")
}
PantrixLink(
    text = "Terms of use",
    onClick = {},
    style = PantrixTheme.typography.footnote,
    tagKey = "terms_of_use"
)
```

### Links in a row

Links that do not stand in a sentence: the row at a page's foot. Where they stand already says they are links; with `underline = LinkUnderline.OnHover` they are underlined only under a pointer and while they hold the keyboard's focus.

Where the platform is used by touch there is neither: on Android and iOS these links too are underlined always. A link inside a sentence stays at the default, `LinkUnderline.Always`: its colour alone does not reach whoever cannot tell it apart.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.LinkUnderline
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixLink(text = "Privacy", onClick = {}, underline = LinkUnderline.OnHover, tagKey = "privacy")
    PantrixLink(text = "Terms", onClick = {}, underline = LinkUnderline.OnHover, tagKey = "terms")
    PantrixLink(text = "Contact", onClick = {}, underline = LinkUnderline.OnHover, tagKey = "contact")
}
```

### Touch target

The area a link takes up is painted here. It is at least as tall as the platform's touch target: 48dp on Android, 44dp on iOS, and 32dp on desktop and the web when they are used with a mouse. It is as wide as its text.

The second link is in the `caption` style: the text is smaller, and the area stays as tall. A touch just beside a short link reaches it too.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.foundation.theme.PantrixTheme

val area = PantrixTheme.colors.neutral.container
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixLink(text = "Help", onClick = {}, modifier = Modifier.background(area), tagKey = "help_body")
    PantrixLink(
        text = "Help",
        onClick = {},
        modifier = Modifier.background(area),
        style = PantrixTheme.typography.caption,
        tagKey = "help_caption"
    )
}
```

### Disabled

`enabled = false` draws the link in the theme's disabled text colour, and the link takes no press. It keeps its underline: without it, it would read as plain text. Press "Resend code": the link is disabled for five seconds.

The second link is given a `color` as well. A disabled link is in the theme's disabled colour whatever is given.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

var waiting by remember { mutableStateOf(false) }
LaunchedEffect(waiting) {
    if (waiting) {
        delay(5_000)
        waiting = false
    }
}
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixLink(
        text = "Resend code",
        onClick = { waiting = true },
        enabled = !waiting,
        tagKey = "resend_code"
    )
    PantrixLink(
        text = "Coming soon",
        onClick = {},
        color = ownColors().color,
        enabled = false,
        tagKey = "coming_soon"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Reporting a click

Every click is reported to the theme's `analytics` as an event: its component is `Link` and its action `click`. The event's `external` value says whether the link ran an action (`false`) or opened an address (`true`); the address itself is not in the event.

The two links here are inside a theme that is given only `analytics`: the last event to arrive is written under them. Press one.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.theme.PantrixTheme

var lastEvent by remember { mutableStateOf("No event yet") }
val analytics = remember {
    PantrixAnalytics { event ->
        val external = event.props["external"]
        lastEvent = "${event.component} · ${event.action} · ${event.testTag} · external=$external"
    }
}
PantrixTheme(analytics = analytics) {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
        PantrixLink(text = "Help", onClick = {}, tagKey = "help")
        PantrixLink(text = "Support page", url = "https://example.com/support", tagKey = "support")
    }
}
PantrixText(text = lastEvent, color = PantrixTheme.colors.textSecondary, tagKey = "link_event")
```

## API

### PantrixLink

`import com.pantrixui.components.elements.link.PantrixLink`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixLink(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    enabled: Boolean = true,
    tagKey: String? = null,
    underline: LinkUnderline = LinkUnderline.Always
)
```

A link on its own that runs `onClick`: `text` underlined in the primary colour, in a row as tall as the platform's minimum touch target, so that a touch above or under the text reaches it. The click is reported to the theme's analytics as a `Link` `click` event. When it is not `enabled`, it keeps its underline, in the disabled text colour, so that it still reads as a link, and does nothing.

`color` is the link's own colour where it is not the theme's `primary`: its text, and the tint under a pointer and a press. A disabled link keeps the theme's disabled text colour whatever is given. `style` is the base text unless given, `LocalPantrixTextStyle`, the type a `PantrixText` has by itself: a link beside a text is as large as the text.

Parameters:

- `text: String`
- `onClick: () -> Unit`
- `modifier: Modifier`: the link's modifier.
- `style: TextStyle`
- `color: Color`
- `enabled: Boolean`
- `tagKey: String?`: the link's automation key: the link is `Link_<tagKey>`, and without one a key of where it is called. Visible text is never the key.
- `underline: LinkUnderline`: when the link is underlined: always unless told; `OnHover` for a link that stands apart from any sentence, underlined under a pointer and the keyboard's focus, and always where the platform is used by touch.

### PantrixLink

`import com.pantrixui.components.elements.link.PantrixLink`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixLink(
    text: String,
    url: String,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    enabled: Boolean = true,
    tagKey: String? = null,
    underline: LinkUnderline = LinkUnderline.Always
)
```

A link on its own that opens `url` with the platform's `UriHandler`: in the browser, or the app that handles the address.

Everything else is the other `PantrixLink`'s. The `click` event says the link is external, never which address it opens.

An address that nothing on the device can open is let go, as Compose lets go of its own text's links (`TextLinkScope`): the press does nothing, and the app goes on.

Parameters:

- `text: String`: what the link says.
- `url: String`
- `modifier: Modifier`: the link's modifier.
- `style: TextStyle`: the link's type: `LocalPantrixTextStyle` unless given, so that a link beside a text is as large as the text.
- `color: Color`: the link's own colour, where it is not the theme's `primary`.
- `enabled: Boolean`: whether the link can be pressed: one that cannot keeps its underline, in the disabled text colour.
- `tagKey: String?`: the link's automation key: the link is `Link_<tagKey>`, and without one a key of where it is called. Visible text is never the key.
- `underline: LinkUnderline`: when the link is underlined, as the other `PantrixLink` has it.

### LinkUnderline

`import com.pantrixui.components.elements.link.LinkUnderline`, from `com.pantrixui:components`

```kotlin
enum class LinkUnderline
```

When a link is underlined: what tells it from the text around it besides its colour.

A link inside a sentence is underlined always: told apart by colour alone, it is lost on whoever cannot tell the two colours apart (WCAG 1.4.1). A link that stands apart, in a row of links or a breadcrumb's trail, is told apart by where it is, and may be underlined only under a pointer or the keyboard's focus. Where the platform is used by touch there is neither to show it, and it is underlined always.

Entries:

- `Always`: Underlined always: the default, and what a link in a sentence needs.
- `OnHover`: Underlined under a pointer and while it holds the keyboard's focus, and always where the platform is used by touch: for a link that stands apart from any sentence.
