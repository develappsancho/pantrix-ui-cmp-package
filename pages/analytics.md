# Analytics

The components' events: a press, a change, a menu that opened. An event is told by identity, not by content: which component, what happened, the test tag, the screen's name. A text typed or read does not go into the event; something chosen goes in by the key the app gave it.

## Features

- **Event.** A `PantrixUiEvent` has a `component`, an `action`, a `testTag`, a `screen` and optional `props`.
- **Where it goes.** `PantrixTheme(analytics = PantrixAnalytics { event -> … })` gives the events somewhere: to the app's analytics library, to a log. Left out, the events are dropped (`PantrixAnalytics.NoOp`).
- **The app's own event.** `LocalPantrixAnalytics.current` gives the same place: the app sends its own event there too.
- **The app's keys.** A table's row, an option's value, a tree's node goes into the event by its key: the key must not be personal data. Which component sends which key is in docs/guide/analytics/ANALYTICS_GUIDE.md.

## Examples

### The components' events

The components' events. The inner theme gives the events to a list: press the button and turn the switch, the last events are written underneath, the newest on top. An event has the component's name, what happened and the test tag, and Pantrix's own values too, such as the button's variant and whether the switch was turned on.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.analytics.PantrixUiEvent
import com.pantrixui.foundation.theme.PantrixTheme

val events = remember { mutableStateListOf<PantrixUiEvent>() }
var notify by remember { mutableStateOf(true) }
val sink = remember { PantrixAnalytics { event -> events.add(0, event) } }
PantrixTheme(analytics = sink) {
    PantrixButton(text = "Save", onClick = {}, tagKey = "save")
    PantrixSwitchButton(checked = notify, onCheckedChange = { notify = it }, label = "Notifications", tagKey = "notify")
}
EventLines(events)

@Composable
private fun EventLines(events: List<PantrixUiEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "No events yet", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val props = event.props.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = "${event.component} · ${event.action} · ${event.testTag ?: "-"}" +
                    (event.screen?.let { " · $it" }.orEmpty()) + (if (props.isEmpty()) "" else " · $props"),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### The app's own event

The app's own event. The share button reads the theme's event sink with `LocalPantrixAnalytics.current` and sends its own event there: its component, what happened, its screen and some `props`. It goes to the same place as the components' events.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.LocalPantrixAnalytics
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.analytics.PantrixUiEvent
import com.pantrixui.foundation.theme.PantrixTheme

val events = remember { mutableStateListOf<PantrixUiEvent>() }
val sink = remember { PantrixAnalytics { event -> events.add(0, event) } }
PantrixTheme(analytics = sink) { ShareButton() }
EventLines(events)

@Composable
private fun ShareButton() {
    val analytics = LocalPantrixAnalytics.current
    PantrixButton(
        text = "Share the link",
        onClick = {
            analytics.track(
                PantrixUiEvent(
                    component = "ShareSheet",
                    action = "share",
                    testTag = null,
                    screen = "Product",
                    props = mapOf("channel" to "link")
                )
            )
        },
        variant = ButtonVariant.Outline,
        tagKey = "share"
    )
}

@Composable
private fun EventLines(events: List<PantrixUiEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "No events yet", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val props = event.props.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = "${event.component} · ${event.action} · ${event.testTag ?: "-"}" +
                    (event.screen?.let { " · $it" }.orEmpty()) + (if (props.isEmpty()) "" else " · $props"),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

## API

### PantrixAnalytics

`import com.pantrixui.foundation.analytics.PantrixAnalytics`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixAnalytics
```

Sink for `PantrixUiEvent`.

Defaults to a no-op, so the cost of components emitting events unconditionally is one virtual call into an empty body. Products wire their own SDK in through `PantrixTheme(analytics = ...)`; Pantrix itself depends on no analytics vendor.

A component built on a Pantrix control, as a field of dates on two text fields, hears that control's events beside its own, and one press is counted twice. It gives the control a sink of its own with `LocalPantrixAnalytics`, which drops what the component reports itself and hands the rest on under the component's name: `PantrixPageSize` does so with the select it is built on.

Members:

- `fun track(event: PantrixUiEvent)`: Called with each `event` a component emits, as it happens, on the UI thread. A sink hands the event on and returns: what takes time, sending above all, is done off this thread.

On the type:

- `PantrixAnalytics.NoOp: PantrixAnalytics`: The sink that drops every event: where a theme reports to unless it is given one.

### PantrixUiEvent

`import com.pantrixui.foundation.analytics.PantrixUiEvent`, from `com.pantrixui:foundation`

```kotlin
data class PantrixUiEvent(
    public val component: String,
    public val action: String,
    public val testTag: String?,
    public val screen: String?,
    public val props: Map<String, String> = emptyMap()
)
```

A UI interaction, described by identity rather than content: which component it was, what happened, and on which screen.

**Text the user typed or read never goes in here.** A field reports that it took the focus or was cleared, never what it holds, and a test of every component that takes text holds that. A value out of a closed set does go in: a selection is reported by the key of what was selected, a page by its number. Some of `props` are the app's own keys, and an app whose keys are personal data sends that data with them: `docs/guide/analytics/ANALYTICS_GUIDE.md` names the components that report them.

Parameters:

- `component: String`: Component name, e.g. `Button`.
- `action: String`: What happened, in the component's own word: `click`, `toggle`, `select`, `open`, `dismiss`, `focus`, `expand`, and others the guide lists by component.
- `testTag: String?`: The component's automation tag, the same identity tests bind to, whatever the `TestTagPolicy`: built from its `tagKey`, or, where it has none, from the place it was called from, which changes with the code around it. Null for an event an app reports without one.
- `screen: String?`: The enclosing `TestScope` chain, e.g. `Checkout.PaymentForm`, or null outside one.
- `props: Map<String, String>`: The event's values, of three kinds: Pantrix's own words and yes-or-no values, such as `variant`, `via` and `state`; numbers, such as `index`, `page` and `count`; and keys the app gave the component, such as `row`, `option` and `destination`.

### LocalPantrixAnalytics

`import com.pantrixui.foundation.analytics.LocalPantrixAnalytics`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixAnalytics: ProvidableCompositionLocal<PantrixAnalytics>
```

Where the components here report their events: `PantrixTheme(analytics = …)`. An app's own code reads it to report its own events to the same place.
