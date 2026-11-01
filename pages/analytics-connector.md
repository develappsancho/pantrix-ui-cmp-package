# Analytics connector

The class with which an app connects Pantrix's events to its analytics product: the connector given to `PantrixTheme(analytics = …)`. Under which name the events go, when they are sent, what happens while there is no network and what is never in them are its decisions. The connector on this page is `ProductAnalytics`, from the samples/pantrix-analytics sample.

## Features

- **Tracking plan.** `TrackingPlan` gives the product's names to the events told by a component's tag and action, and says which values each of them carries.
- **Generic event.** Every event the plan does not name goes as one `ui_interaction`: with its component, its action, its screen, the tag built from its key and Pantrix's own values. The app's keys and the tags built from where a component is called do not go in.
- **Consent.** Until the user says yes, no event is collected; when consent is taken back, what waits is dropped.
- **Sending.** `track` puts the event in the queue and returns. The events go in batches and off the UI thread: when a batch is full, when its first event has waited long enough, or when the app calls `flush()`.
- **Offline.** The events wait; the send is tried again at ever longer intervals, and the events reach the product in the order they happened. When the queue is full the oldest is dropped.
- **No text.** A text that was typed goes into no Pantrix event, nor into anything the connector sends. The sample is described in samples/pantrix-analytics/README.md, and every event in docs/guide/analytics/ANALYTICS_GUIDE.md.

## Examples

### Tracking plan

The events the plan names. A press of the pay button becomes `checkout_pay_tapped` and carries only the button's variant. A choice of shipping becomes `shipping_chosen` and carries the key of the shipping chosen: the plan says it is no personal data. Make a choice or press the button: the events the product heard are written underneath, the newest on top.

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
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.testing.pantrixTestTagOf
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.PlannedEvent
import com.pantrixui.samples.analytics.ProductEvent
import com.pantrixui.samples.analytics.TrackingPlan
import kotlin.time.Clock

val plan = remember {
    TrackingPlan(
        listOf(
            PlannedEvent(
                tag = pantrixTestTagOf(component = "Button", tagKey = "pay", scope = "Checkout"),
                action = "click",
                name = "checkout_pay_tapped",
                keep = setOf("variant")
            ),
            PlannedEvent(
                tag = pantrixTestTagOf(component = "SegmentButton", tagKey = "shipping", scope = "Checkout"),
                action = "select",
                name = "shipping_chosen",
                notPersonal = setOf("segment")
            )
        )
    )
}
val heard = remember { mutableStateListOf<ProductEvent>() }
val analytics = remember {
    PantrixAnalytics { event -> heard.add(0, plan.productEventOf(event, Clock.System.now())) }
}
PantrixTheme(analytics = analytics) {
    TestScope("Checkout") {
        ShippingChoice(tagKey = "shipping")
        PantrixButton(text = "Pay", onClick = {}, tagKey = "pay")
    }
}
HeardEvents(heard)

@Composable
private fun ShippingChoice(tagKey: String) {
    var shipping by remember { mutableStateOf("standard") }
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = "standard", label = "Standard", tagKey = "standard"),
            SegmentOption(value = "express", label = "Express", tagKey = "express")
        ),
        selected = shipping,
        onSelect = { shipping = it },
        tagKey = tagKey
    )
}

@Composable
private fun HeardEvents(events: List<ProductEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "The product has heard nothing yet", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val properties = event.properties.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = if (properties.isEmpty()) event.name else "${event.name} · $properties",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### The generic event

Every event the plan does not name goes as `ui_interaction`: with its component, its action, its screen, its tag and Pantrix's own values, such as whether the switch is on. The plan is empty: the shipping choice's key does not go in, as it is the app's key and may be personal data. Nor does the tag of the button with no `tagKey`: it is built from where the button is called, and changes when the code does.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.ProductEvent
import com.pantrixui.samples.analytics.TrackingPlan
import kotlin.time.Clock

val plan = remember { TrackingPlan(emptyList()) }
val heard = remember { mutableStateListOf<ProductEvent>() }
val analytics = remember {
    PantrixAnalytics { event -> heard.add(0, plan.productEventOf(event, Clock.System.now())) }
}
var gift by remember { mutableStateOf(false) }
PantrixTheme(analytics = analytics) {
    TestScope("Cart") {
        ShippingChoice(tagKey = "shipping")
        PantrixSwitchButton(
            checked = gift,
            onCheckedChange = { gift = it },
            label = "Gift wrap",
            tagKey = "gift"
        )
        @Suppress("UntaggedControl") // No tagKey on purpose: the example shows that its tag stays out of the event.
        PantrixButton(text = "Back to shopping", onClick = {}, variant = ButtonVariant.Outline)
    }
}
HeardEvents(heard)

@Composable
private fun ShippingChoice(tagKey: String) {
    var shipping by remember { mutableStateOf("standard") }
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = "standard", label = "Standard", tagKey = "standard"),
            SegmentOption(value = "express", label = "Express", tagKey = "express")
        ),
        selected = shipping,
        onSelect = { shipping = it },
        tagKey = tagKey
    )
}

@Composable
private fun HeardEvents(events: List<ProductEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "The product has heard nothing yet", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val properties = event.properties.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = if (properties.isEmpty()) event.name else "${event.name} · $properties",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### Consent

Until the user says yes, the connector collects no event. Once they do, the events wait in the queue and go when five of them wait, or with "Send now". When consent is taken back, what waits is dropped. Underneath is the connector's log, the newest on top.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.Consent
import com.pantrixui.samples.analytics.Outcome
import com.pantrixui.samples.analytics.ProductAnalytics
import com.pantrixui.samples.analytics.SendPolicy
import com.pantrixui.samples.analytics.TrackingPlan
import com.pantrixui.samples.analytics.Transport
import kotlinx.coroutines.launch
import kotlin.time.Clock
import kotlin.time.Duration.Companion.minutes

val connector = rememberConnector(online = { true })
val scope = rememberCoroutineScope()
var consent by remember { mutableStateOf(connector.consent) }
PantrixSwitchButton(
    checked = consent == Consent.Granted,
    onCheckedChange = { yes ->
        consent = if (yes) Consent.Granted else Consent.Denied
        connector.consent = consent
    },
    label = "Allow analytics",
    tagKey = "consent"
)
PantrixTheme(analytics = connector) {
    PantrixButton(text = "Like", onClick = {}, tagKey = "like")
}
PantrixButton(
    text = "Send now",
    onClick = { scope.launch { connector.flush() } },
    variant = ButtonVariant.Outline,
    tagKey = "send_now"
)
ConnectorLog(connector)

@Composable
private fun rememberConnector(
    online: () -> Boolean,
    policy: SendPolicy = SendPolicy(batch = 5, every = 1.minutes),
    consent: Consent = Consent.Unknown
): ProductAnalytics {
    val scope = rememberCoroutineScope()
    return remember(scope) {
        ProductAnalytics(
            plan = TrackingPlan(emptyList()),
            transport = Transport { online() },
            clock = Clock.System,
            scope = scope,
            policy = policy
        ).also { it.consent = consent }
    }
}

@Composable
private fun ConnectorLog(connector: ProductAnalytics) {
    val log by connector.log.collectAsState()
    val waiting by connector.waitingEvents.collectAsState()
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Waiting: $waiting", style = PantrixTheme.typography.footnote)
        log.asReversed().take(6).forEach { outcome ->
            PantrixText(
                text = outcome.line(),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

private fun Outcome.line(): String = when (this) {
    is Outcome.NotCollected -> "not collected · ${event.component} ${event.action} · no consent"
    is Outcome.Waiting -> "waiting · ${event.name}"
    is Outcome.Sent -> "sent · events: ${batch.size}"
    is Outcome.Failed -> "not sent · events: $size · again in $retryIn"
    is Outcome.Overflowed -> "dropped · the queue is full, the oldest"
    is Outcome.Withdrawn -> "dropped · events: $count · consent taken back"
}
```

### Offline

Turn the network off and press the button a few times: a send is tried every three events, fails, and is tried again after one, two, four seconds. The queue keeps six events; when it is full the oldest is dropped. Turn the network on: what waits goes at the next try, in the order it happened.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.Consent
import com.pantrixui.samples.analytics.Outcome
import com.pantrixui.samples.analytics.ProductAnalytics
import com.pantrixui.samples.analytics.SendPolicy
import com.pantrixui.samples.analytics.TrackingPlan
import com.pantrixui.samples.analytics.Transport
import kotlin.time.Clock
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Duration.Companion.seconds

var online by remember { mutableStateOf(false) }
val connector = rememberConnector(
    online = { online },
    policy = SendPolicy(batch = 3, every = 1.minutes, capacity = 6, longestRetry = 8.seconds),
    consent = Consent.Granted
)
PantrixSwitchButton(checked = online, onCheckedChange = { online = it }, label = "Network", tagKey = "network")
PantrixTheme(analytics = connector) {
    PantrixButton(text = "Share", onClick = {}, tagKey = "share")
}
ConnectorLog(connector)

@Composable
private fun rememberConnector(
    online: () -> Boolean,
    policy: SendPolicy = SendPolicy(batch = 5, every = 1.minutes),
    consent: Consent = Consent.Unknown
): ProductAnalytics {
    val scope = rememberCoroutineScope()
    return remember(scope) {
        ProductAnalytics(
            plan = TrackingPlan(emptyList()),
            transport = Transport { online() },
            clock = Clock.System,
            scope = scope,
            policy = policy
        ).also { it.consent = consent }
    }
}

@Composable
private fun ConnectorLog(connector: ProductAnalytics) {
    val log by connector.log.collectAsState()
    val waiting by connector.waitingEvents.collectAsState()
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Waiting: $waiting", style = PantrixTheme.typography.footnote)
        log.asReversed().take(6).forEach { outcome ->
            PantrixText(
                text = outcome.line(),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

private fun Outcome.line(): String = when (this) {
    is Outcome.NotCollected -> "not collected · ${event.component} ${event.action} · no consent"
    is Outcome.Waiting -> "waiting · ${event.name}"
    is Outcome.Sent -> "sent · events: ${batch.size}"
    is Outcome.Failed -> "not sent · events: $size · again in $retryIn"
    is Outcome.Overflowed -> "dropped · the queue is full, the oldest"
    is Outcome.Withdrawn -> "dropped · events: $count · consent taken back"
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
