# Snackbar

A short message about something the app has just done: "Conversation archived", "Changes saved". It has at most one action, never takes focus and never blocks the app.

A snackbar is not drawn, it is asked for: `PantrixSnackbarState.show` puts it in the queue, and a `PantrixSnackbarHost` puts it on screen when its turn comes. There is usually a single host, at the root of the app; a `PantrixScaffold` that is given the queue sets the host up itself, and provides the queue to every screen inside it through `LocalPantrixSnackbars`.

- `PantrixSnackbarHost` (`com.pantrixui.components.overlay.snackbar`, `com.pantrixui:components`): A short message about what the app has just done, with at most one action; one at a time, it leaves on its own and never takes focus. Keywords: toast, notification, undo, flash message, status message.

## Features

- **In turn, one at a time.** One snackbar is on screen at a time; the others wait in the order they were asked for. `show` is a suspending function: once the snackbar has left, it returns how it left.
- **One action.** `actionLabel` gives the snackbar a single action: "Undo". The result is `SnackbarResult.ActionPerformed` if the action was pressed, and `Dismissed` if not.
- **Duration.** A snackbar without an action leaves after four seconds (`Short`); `Long` is ten. One with an action stays until the action is taken or it is closed (`UntilDismissed`), and has a close button. The time waits while the pointer is over the snackbar and while focus is inside it, and then starts again.
- **Six tones.** `tone` picks the colour, the icon and the way it is announced together. The four semantic tones (`Info`, `Success`, `Warning`, `Danger`) have an icon; `Primary` and the default, `Neutral`, have none.
- **Ways to leave.** Its time runs out, its action or its close button is pressed, it is swiped sideways, Escape is pressed with focus inside it, a screen reader's dismiss action is used, or the app dismisses it (`SnackbarData.dismiss`).
- **Placed by platform.** It appears in the middle of the bottom edge on Android, at the top on iOS, and in the bottom end corner on desktop and the web: `SnackbarStyle.placement`. It stays inside the window's safe area.
- **The colour is the host's.** `SnackbarColors` is given to the host, not to the snackbar, and paints every snackbar of that host; the icon and the way it is announced still come from the tone.
- **Screen reader.** A snackbar is announced without interrupting what is being read; only the `Danger` tone interrupts.
- **Under a dialog and a sheet.** A snackbar belongs to the app: a dialog or a sheet opened over the host covers it.

## Usage

### Undo an archive

```kotlin
val snackbars = rememberPantrixSnackbarState()
val scope = rememberCoroutineScope()
Box(Modifier.fillMaxSize()) {
    Inbox(
        onArchive = { conversation ->
            archive(conversation)
            scope.launch {
                val result = snackbars.show(
                    message = getString(Res.string.conversation_archived),
                    actionLabel = getString(Res.string.undo),
                    tagKey = "archived"
                )
                if (result == SnackbarResult.ActionPerformed) unarchive(conversation)
            }
        }
    )
    PantrixSnackbarHost(snackbars)
}
```

### Confirm that a change was saved

```kotlin
scope.launch {
    snackbars.show(message = getString(Res.string.settings_saved), tagKey = "settings_saved")
}
```

### Report a failure in the danger tone

```kotlin
scope.launch {
    val result = snackbars.show(
        message = getString(Res.string.upload_failed),
        actionLabel = getString(Res.string.retry),
        tone = SnackbarTone.Danger,
        tagKey = "upload_failed"
    )
    if (result == SnackbarResult.ActionPerformed) retryUpload()
}
```

### Every snackbar in colours of the app's own, under a scaffold

```kotlin
val primary = PantrixTheme.colors.primary
PantrixScaffold(
    snackbars = snackbars,
    snackbarHost = {
        PantrixSnackbarHost(snackbars, colors = SnackbarColors(container = primary.color, content = primary.onColor))
    }
) { padding ->
    Inbox(Modifier.padding(padding))
}
```

## Examples

### A message

The least there is to write: a message. The queue does not come here as a parameter; the scaffold provides it to every screen inside it through `LocalPantrixSnackbars`. `show` is a suspending function, so it is called in a coroutine. A snackbar without an action leaves by itself after four seconds.

The scope is this example's (`rememberCoroutineScope`): it is cancelled when the page is left, and takes the snackbar on screen with it. A snackbar that must stay even when the screen changes is asked for in a scope that outlives the screen. Outside a scaffold, where nothing provides the queue, `LocalPantrixSnackbars.current` is null and the button does nothing.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = "Save draft",
    onClick = { scope.launch { snackbars?.show(message = "Draft saved", tagKey = "draft_saved") } },
    variant = ButtonVariant.Outline,
    tagKey = "save_draft"
)
```

### Tones

The snackbar's six tones: each button asks the app's queue for a snackbar in that tone. `tone` picks the colour of one of the theme's roles, an icon in the four semantic tones, and how the snackbar is announced: `Danger` interrupts what a screen reader is saying, and the others are announced without interrupting. A snackbar is filled in every tone: from the role's `color` and `onColor`, not its pale `container`.

Those with an action stay until the action is taken or they are closed; those without one leave by themselves after four seconds. The snackbars of buttons pressed one after another come in turn, one at a time. How each one left is written under the buttons.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var lastResult by remember { mutableStateOf<String?>(null) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    SAMPLES.forEach { sample ->
        PantrixButton(
            text = sample.tone.name,
            onClick = {
                scope.launch {
                    val result = snackbars?.show(
                        message = sample.message,
                        actionLabel = sample.action,
                        tone = sample.tone,
                        tagKey = sample.tone.name.lowercase()
                    )
                    if (result != null) lastResult = "${sample.tone.name}: ${result.name}"
                }
            },
            variant = ButtonVariant.Outline,
            tagKey = "show_${sample.tone.name}"
        )
    }
}
lastResult?.let { result ->
    PantrixText(
        text = "Last snackbar → $result",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private class SnackbarSample(
    val tone: SnackbarTone,
    val message: String,
    val action: String?
)

private val SAMPLES = listOf(
    SnackbarSample(SnackbarTone.Neutral, "Conversation archived", "Undo"),
    SnackbarSample(SnackbarTone.Primary, "A new version is ready", "Update"),
    SnackbarSample(SnackbarTone.Info, "Sync pauses on mobile data", null),
    SnackbarSample(SnackbarTone.Success, "Changes saved", null),
    SnackbarSample(SnackbarTone.Warning, "Storage is almost full", "Manage"),
    SnackbarSample(SnackbarTone.Danger, "Upload failed", "Retry")
)
```

### An action and its result

`actionLabel` gives the snackbar a single action. Once the snackbar has left, `show` returns how it left: `SnackbarResult.ActionPerformed` if the action was pressed; `Dismissed` if its time ran out, it was closed or the app dismissed it. Pressing "Undo" puts the conversation back in the inbox.

A snackbar with an action does not leave by itself: a few seconds are not enough for some users to reach the action. That is why its default duration is `UntilDismissed`, and it has a close button.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarResult
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var inbox by rememberSaveable { mutableIntStateOf(5) }
PantrixButton(
    text = "Archive a conversation",
    onClick = {
        inbox -= 1
        scope.launch {
            val result = snackbars?.show(
                message = "Conversation archived",
                actionLabel = "Undo",
                tagKey = "archived"
            )
            if (result == SnackbarResult.ActionPerformed) inbox += 1
        }
    },
    enabled = inbox > 0,
    variant = ButtonVariant.Outline,
    tagKey = "archive"
)
PantrixText(text = "Conversations in the inbox: $inbox", color = PantrixTheme.colors.textSecondary)
```

### Duration and close button

`duration` says how long the snackbar stays when nobody acts on it: `Short` is four seconds, `Long` ten; `UntilDismissed` is until it is closed. The platform may make this longer for a user who needs more time. A snackbar that stays until it is closed has a close button; `closeButton = true` puts one on a short snackbar too.

Hold the pointer over the snackbar: its time waits, and starts again when the pointer moves away. It waits while keyboard focus is inside it too. Swiping the snackbar sideways sends it away without waiting for its time.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarDuration
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Short",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "Link copied",
                    duration = SnackbarDuration.Short,
                    tagKey = "short"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_short"
    )
    PantrixButton(
        text = "Long",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "Export complete: the file is in the Downloads folder",
                    duration = SnackbarDuration.Long,
                    tagKey = "long"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_long"
    )
    PantrixButton(
        text = "UntilDismissed",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "Update downloaded: it will be installed on restart",
                    duration = SnackbarDuration.UntilDismissed,
                    tagKey = "until_dismissed"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_until_dismissed"
    )
    PantrixButton(
        text = "Short, with a close button",
        onClick = {
            scope.launch {
                snackbars?.show(message = "File moved to the bin", closeButton = true, tagKey = "with_close")
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_with_close"
    )
}
```

### Snackbars that come in turn

Three snackbars are asked for one after another; they come on screen in the order they were asked for, one at a time. `show` suspends until its own turn comes. The app's single queue keeps the order: a snackbar that another example asks for waits in the same line.

"Cancel the rest" cancels this example's coroutines: when the coroutine that called `show` is cancelled, the snackbar on screen leaves, and those whose turn has not come are never shown.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.cancelChildren
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Upload three files",
        onClick = {
            listOf("Report.pdf", "Budget.xlsx", "Presentation.key").forEach { file ->
                scope.launch {
                    snackbars?.show(message = "$file uploaded", tone = SnackbarTone.Success, tagKey = "uploaded")
                }
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "upload_three"
    )
    PantrixButton(
        text = "Cancel the rest",
        onClick = { scope.coroutineContext.cancelChildren() },
        variant = ButtonVariant.Text,
        tagKey = "cancel_uploads"
    )
}
```

### A snackbar the app dismisses

Some snackbars are dismissed by the app, not the user: once the connection is back there is no point in saying "You're offline". `PantrixSnackbarState.current` is the snackbar on screen, or null; `dismiss()` takes it away, and `show` returns `SnackbarResult.Dismissed`. "Back online" is enabled only while this example's snackbar is on screen.

This snackbar stays until it is dismissed and has no close button (`closeButton = false`); swiping it sideways still sends it away.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarDuration
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val onScreen = snackbars?.current
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Go offline",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "You're offline: changes will sync when the connection is back",
                    duration = SnackbarDuration.UntilDismissed,
                    closeButton = false,
                    tone = SnackbarTone.Warning,
                    tagKey = "offline"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "go_offline"
    )
    PantrixButton(
        text = "Back online",
        onClick = { onScreen?.dismiss() },
        enabled = onScreen?.tagKey == "offline",
        variant = ButtonVariant.Outline,
        tagKey = "back_online"
    )
}
```

### A colour given to the host

The colour is given not to the snackbar but to the host that shows it: `PantrixSnackbarHost(state, colors = SnackbarColors(container = …, content = …))`. The app's host stands at the root, so the switch's state is there too, in the app's settings; the host reads it. While it is on, every snackbar is drawn with the same fill; its icon and the way it is announced still come from its tone.

Flip the switch, then ask for a snackbar from here or from "Tones". The switch stands at the end away from the edge the snackbar appears at: below the button where the snackbar appears at the top (iOS), above it where it appears at the bottom.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarPlacement
import com.pantrixui.components.overlay.snackbar.SnackbarStyle
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val snackbarsAtTheTop = PantrixTheme.style(SnackbarStyle).placement == SnackbarPlacement.Top
if (!snackbarsAtTheTop) SnackbarOwnColorsSwitch()
PantrixButton(
    text = "Finish the backup",
    onClick = {
        scope.launch {
            snackbars?.show(message = "Backup complete", tone = SnackbarTone.Success, tagKey = "backed_up")
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "back_up"
)
if (snackbarsAtTheTop) SnackbarOwnColorsSwitch()

@Composable
private fun SnackbarOwnColorsSwitch() {
    val settings = LocalDemoSettings.current
    PantrixSwitchButton(
        checked = settings.ownSnackbarColors,
        onCheckedChange = { settings.ownSnackbarColors = it },
        label = "In the app's own colour",
        supportingText = "When on, snackbars are filled with the colour given to their host, not with their tone's",
        tagKey = "own_snackbar_colors"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalDemoSettings`: The app's settings, for every screen inside it: the buttons in the top bar and the "Settings" page read and change them from here. Outside the app, on a page drawn by itself in a test, they are the default settings.

### A host of its own: placement, style and colour

There is usually a single host, at the root of the app. Here, to show what its parameters do, there is a second host in a box, with a queue of its own: `rememberPantrixSnackbarState` gives the queue, and `PantrixSnackbarHost` shows it. The host is the box's last child: it fills the space it is given and stands above the content.

`style` changes the placement and the geometry: `placement` picks one of four places, and `maxWidth` keeps the snackbar to 320dp. In a narrow box the snackbar fills the box; start, centre and end only differ in a wide one. `colors` paints every snackbar of this host: the fill is the app's own purple, and the icon is still the tone's.

The host stays inside the window's safe area. This box stands in the middle of the window, so it consumes those insets itself (`consumeWindowInsets`); a host at the root does not need to.

The snackbar the queue shows is its `current` (`SnackbarData`): the line under the box writes its message, and "Remove" closes it with `dismiss()`, without waiting out its time.

```kotlin
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.PantrixSnackbarHost
import com.pantrixui.components.overlay.snackbar.SnackbarColors
import com.pantrixui.components.overlay.snackbar.SnackbarData
import com.pantrixui.components.overlay.snackbar.SnackbarPlacement
import com.pantrixui.components.overlay.snackbar.SnackbarStyle
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = rememberPantrixSnackbarState()
val scope = rememberCoroutineScope()
val own = ownColors()
var placement by rememberSaveable { mutableStateOf(SnackbarPlacement.BottomCenter) }
PantrixSegmentButton(
    options = PLACEMENTS,
    selected = placement,
    onSelect = { placement = it },
    tagKey = "placement"
)
PantrixSurface(
    modifier = Modifier
        .fillMaxWidth()
        .height(220.dp)
        .consumeWindowInsets(WindowInsets.safeDrawing),
    border = PantrixTheme.colors.divider
) {
    PantrixButton(
        text = "Show in this box",
        onClick = {
            scope.launch {
                snackbars.show(message = "The box's own snackbar", tone = SnackbarTone.Success, tagKey = "boxed")
            }
        },
        modifier = Modifier.align(Alignment.Center),
        variant = ButtonVariant.Outline,
        tagKey = "show_boxed"
    )
    PantrixSnackbarHost(
        state = snackbars,
        style = SnackbarStyle(placement = placement, maxWidth = 320.dp),
        colors = SnackbarColors(container = own.color, content = own.onColor)
    )
}
val shown: SnackbarData? = snackbars.current
PantrixText(
    text = shown?.let { "In the box: ${it.message}" } ?: "No snackbar in the box",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
if (shown != null) {
    PantrixButton(
        text = "Remove",
        onClick = shown::dismiss,
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "dismiss_boxed"
    )
}

private val PLACEMENTS = listOf(
    SegmentOption(value = SnackbarPlacement.Top, label = "Top", tagKey = "top"),
    SegmentOption(value = SnackbarPlacement.BottomStart, label = "Bottom start", tagKey = "bottom_start"),
    SegmentOption(value = SnackbarPlacement.BottomCenter, label = "Bottom centre", tagKey = "bottom_center"),
    SegmentOption(value = SnackbarPlacement.BottomEnd, label = "Bottom end", tagKey = "bottom_end")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixSnackbarHost

`import com.pantrixui.components.overlay.snackbar.PantrixSnackbarHost`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSnackbarHost(
    state: PantrixSnackbarState,
    modifier: Modifier = Modifier,
    style: SnackbarStyle? = null,
    colors: SnackbarColors? = null
)
```

Puts the snackbars of `state` on screen: short messages about what the app has just done, each with at most one action, in a neutral, primary or semantic tone, one at a time.

Put the host over the app, as the last child of a `Box` that fills the window, so snackbars appear above the content; `PantrixScaffold`, given the state, does that itself, between its bars. The host fills the space it is given and places each snackbar by `SnackbarStyle.placement` inside the window's safe area: in the middle of the bottom edge on Android, at the top on iOS, in the bottom end corner on desktop and the web. A snackbar belongs to the app, not to a dialog or a sheet, and one of those opened over the host covers its snackbars.

Beside an upright fold, a foldable held like a book or a hinge between two screens, a snackbar keeps to a half and never lies across the fold: one in the bottom end corner to the end half, every other one to the start half, in the middle of it or in its corner as it is placed. A snackbar as wide as a phone's window, in a corner too, would reach past the fold otherwise.

A snackbar never takes focus and never blocks the app; a screen reader announces it without interrupting, and one in the `SnackbarTone.Danger` tone assertively. It leaves after its `SnackbarDuration`, which waits while the pointer is over it, focus is inside it or it is being dragged, and then starts again, or when the user presses its action or its close button, swipes it sideways, presses Escape with focus inside it, or uses a screen reader's dismiss action.

Parameters:

- `state: PantrixSnackbarState`: the snackbars to show; `PantrixSnackbarState.show` asks for one.
- `modifier: Modifier`: the host's modifier. The host fills the space it is given.
- `style: SnackbarStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SnackbarColors?`: the colours of every snackbar this host shows, where they are not their tones': the ones set here, with the tone's for the rest.

### PantrixSnackbarState

`import com.pantrixui.components.overlay.snackbar.PantrixSnackbarState`, from `com.pantrixui:components`

```kotlin
class PantrixSnackbarState
```

The snackbars an app asks for: one on screen at a time, the others waiting their turn in the order they were asked for.

A `PantrixSnackbarHost` puts them on screen. Keep one state for the part of the app one host covers, usually the whole app, so snackbars from any screen queue behind each other.

Members:

- `current: SnackbarData?`: The snackbar on screen, or null.
- `suspend fun show(message: String, actionLabel: String? = null, duration: SnackbarDuration = if (actionLabel == null) { SnackbarDuration.Short } else { SnackbarDuration.UntilDismissed }, closeButton: Boolean = duration == SnackbarDuration.UntilDismissed, tone: SnackbarTone = SnackbarTone.Neutral, tagKey: String? = null): SnackbarResult`: Shows a snackbar once the snackbars asked for before it have left, and returns how it left.

  Cancelling the coroutine that called it takes the snackbar away, or drops it before its turn.

  `message`: what happened, in a short sentence: "Conversation archived".

  `actionLabel`: a short verb for the one thing the user can do about it: "Undo".

  `duration`: how long the snackbar stays when nobody acts on it. A snackbar with an action stays until the user acts on it or closes it: a few seconds are too few for some people to reach the action.

  `closeButton`: whether the snackbar has a close button. A snackbar that stays until it is dismissed has one.

  `tone`: what the snackbar is telling the user: its colours, an icon for a semantic tone, and for an error an assertive announcement.

  `tagKey`: the snackbar's automation key: the snackbar is `Snackbar_<tagKey>`, its action `SnackbarAction_<tagKey>` and its close button `SnackbarClose_<tagKey>`.

### rememberPantrixSnackbarState

`import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberPantrixSnackbarState(): PantrixSnackbarState
```

A `PantrixSnackbarState` that lives as long as the composition that remembers it.

### LocalPantrixSnackbars

`import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars`, from `com.pantrixui:components`

```kotlin
val LocalPantrixSnackbars: ProvidableCompositionLocal<PantrixSnackbarState?>
```

The snackbars of the layout around this composable, or null where nothing provides them.

A layout that puts a `PantrixSnackbarHost` over its content provides the host's state here, so a screen inside it shows a snackbar without the state being passed down to it: `LocalPantrixSnackbars.current?.show(...)`, in a coroutine. `PantrixScaffold`, given its `snackbars`, provides them.

### SnackbarData

`import com.pantrixui.components.overlay.snackbar.SnackbarData`, from `com.pantrixui:components`

```kotlin
class SnackbarData
```

A snackbar on screen or waiting for its turn: what it says, and a way for the app to take it away.

Parameters:

- `message: String`: What the snackbar says.
- `actionLabel: String?`: The action's label, or null for a snackbar without an action.
- `duration: SnackbarDuration`: How long it stays when nobody acts on it.
- `closeButton: Boolean`: Whether it has a close button.
- `tone: SnackbarTone`: What it is telling the user: its colours, its icon and how it is announced.
- `tagKey: String?`: Its automation key: the snackbar is `Snackbar_<tagKey>`, its action `SnackbarAction_<tagKey>`, its close button `SnackbarClose_<tagKey>`.

Members:

- `fun dismiss(): Unit`: Takes the snackbar away, and `PantrixSnackbarState.show` returns `SnackbarResult.Dismissed`. Does nothing once it has left.

### SnackbarTone

`import com.pantrixui.components.overlay.snackbar.SnackbarTone`, from `com.pantrixui:components`

```kotlin
enum class SnackbarTone
```

What a snackbar is telling the user: one of the theme's colour roles, which also decides its icon and how it is announced.

The semantic tones, `Info`, `Success`, `Warning` and `Danger`, reach the user as colour and as an icon, because colour alone fails anyone who cannot see it. `Primary` and `Neutral` carry no meaning of their own, and have no icon.

A snackbar is filled in every tone, from the role's `color` and `onColor` rather than its pale `container`: it floats over the app's own content for a few seconds, and a pale bar would read as one more card on the page. `Primary` takes the brand's `primary` role. `Neutral` takes the `neutral` role, a grey with no hue of its own, which Pantrix's colours keep darker than the page in the light theme and lighter than it in the dark one.

Entries:

- `Info`: Something worth knowing that is neither good nor bad.
- `Success`: Something that worked: saved, sent, uploaded.
- `Warning`: Something to look at before it becomes a problem.
- `Danger`: Something that failed. The one tone announced assertively: it interrupts what a screen reader is saying.
- `Primary`: Something the app wants noticed, in the brand's colour, without an icon: a new version ready to install, a feature to try.
- `Neutral`: Something the app did: a grey bar, without an icon. The default.

### SnackbarDuration

`import com.pantrixui.components.overlay.snackbar.SnackbarDuration`, from `com.pantrixui:components`

```kotlin
enum class SnackbarDuration
```

How long a snackbar stays when the user does nothing with it.

Entries:

- `Short`: Four seconds, or longer when the platform recommends more time for its user.
- `Long`: Ten seconds, or longer when the platform recommends more time for its user.
- `UntilDismissed`: Until the user acts on it or closes it, or the app dismisses it.

### SnackbarResult

`import com.pantrixui.components.overlay.snackbar.SnackbarResult`, from `com.pantrixui:components`

```kotlin
enum class SnackbarResult
```

How a snackbar left.

Entries:

- `ActionPerformed`: The user pressed its action.
- `Dismissed`: Its time ran out, the user closed it, or the app dismissed it.

### SnackbarPlacement

`import com.pantrixui.components.overlay.snackbar.SnackbarPlacement`, from `com.pantrixui:components`

```kotlin
enum class SnackbarPlacement
```

Where a `PantrixSnackbarHost` shows its snackbars.

Entries:

- `Top`: Along the top edge, in the middle.
- `BottomStart`: In the bottom corner where lines start: bottom left, and bottom right in a right-to-left layout.
- `BottomCenter`: Along the bottom edge, in the middle.
- `BottomEnd`: In the bottom corner where lines end: bottom right, and bottom left in a right-to-left layout. In a wide window it keeps clear of navigation along the start edge, such as a sidebar.

### SnackbarStyle

`import com.pantrixui.components.overlay.snackbar.SnackbarStyle`, from `com.pantrixui:components`

```kotlin
class SnackbarStyle(
    public val placement: SnackbarPlacement? = null,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified
) : PantrixStyle<SnackbarStyle>
```

`PantrixSnackbarHost`'s placement and its snackbars' geometry.

The padding inside a snackbar comes from the theme's spacing, and its height and margin scale with the density as well; the width limit and the elevation do not. A snackbar's colours are not part of its style: they come from its `SnackbarTone`'s colour role, and from `SnackbarColors` where a host has its own.

Parameters:

- `placement: SnackbarPlacement?`: Where the host shows its snackbars: in the middle of the bottom edge on Android, at the top on iOS, and in the bottom end corner on desktop and the web.
- `shape: ShapeSpec`: The snackbar's corners: extra small on Android, desktop and the web, large on iOS.
- `maxWidth: Dp`: The widest a snackbar gets. In a narrower host it spans the host, less the margin.
- `minHeight: Dp`: The height of a snackbar whose message fits on one line.
- `margin: Dp`: Kept clear between a snackbar and the host's edges, inside the window's safe area.
- `elevation: Dp`: How high the snackbar floats over the app, which is how large its shadow is.

### SnackbarColors

`import com.pantrixui.components.overlay.snackbar.SnackbarColors`, from `com.pantrixui:components`

```kotlin
data class SnackbarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

What the snackbars of a `PantrixSnackbarHost` are painted with, for a host that does not take their tones' colours: a colour that is set is used on every snackbar of the host, and one that is left out stays the tone's.

```kotlin
PantrixSnackbarHost(snackbars, colors = SnackbarColors(container = brand.color, content = brand.onColor))
```

A tone still gives a snackbar its icon and the way it is announced: only what it is painted in is the host's.

A fill given here that is one of the theme's own colours brings the colour the theme pairs with it for what is drawn on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The snackbar's fill. The `color` of its tone's role.
- `content: Color`: The message, the icon, the action's label and the close button's cross: the colour that reads on `container`. The `onColor` of its tone's role.
