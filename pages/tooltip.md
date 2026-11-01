# Tooltip

The short label that sits beside the control it names: the name of an icon-only button, a truncated label in full. It shows what the control already says: a screen reader reads the control itself, and the label is hidden from it. So the control's `contentDescription` or its text has to be the same words; a tooltip is no place to say anything new.

It comes up by itself and takes nothing from the app: no focus and no key, and the control goes on working. It takes no press from the control but the long press that asks for the name.

- `PantrixTooltip` (`com.pantrixui.components.overlay.tooltip`, `com.pantrixui:components`): A short label naming the control it is anchored to, shown while a pointer rests on the control, while it has the keyboard's focus, and from a long press on it until the next press. Keywords: hint, hover text, info tip, hover label, long press label.

## Features

- **Mouse.** The label comes up once the pointer has rested on the control for the style's `pointerRestMillis`, and goes as the pointer leaves. The pointer may cross onto the label and rest there. A click on the control puts the label away; it does not come up again until the pointer has left and come back.
- **Keyboard.** The label comes up at once when the keyboard brings the focus to the control, and goes as the focus leaves. Escape puts it away, and the focus stays on the control.
- **Touch.** A long press on the control brings the label up, and it stays until something is pressed. The long press that asks for the name does not press the control; a tap only presses the control and brings no label up.
- **Side.** `side` says which side of the control the label sits on: the top by default. The label is centred on the control on that side; where there is no room it takes the opposite side, and it comes no closer to the window's edges than the style's `margin`.
- **State.** Whether the label is up is one state (`state`): the mouse, the keyboard and a long press change it. A screen can change it too: it holds the state with `rememberPantrixTooltipState()` and calls `show()` and `dismiss()`.
- **Can be turned off.** `enabled = false` puts the label away and keeps it from coming up: for a control whose name is already in view.
- **Puts itself away.** The label is put away while its control is under a dialog, a sheet or an open popover, when the control scrolls out of view, and when the window changes size.
- **One label.** A window has one label up at a time: when a new one comes up, the one before it goes. Escape puts away the label that is up, wherever the focus is, and goes no further.
- **Colours and style.** The label is in the tone opposite the theme's: dark in the light theme, light in the dark. `colors` (`TooltipColors`) gives it a colour of its own; `style` (`TooltipStyle`) gives the corners, the spacing, the maximum width and the mouse's wait.
- **On which control.** The anchor is a control that is pressed, a button or an icon, or a text that is only read. A control with a long press of its own, a text field or text that can be selected, loses that press to the tooltip on a touch screen.

## Usage

### The name of an icon button

```kotlin
PantrixTooltip(text = stringResource(Res.string.refresh), tagKey = "refresh") {
    PantrixIconButton(
        imageVector = PantrixIcons.Refresh,
        contentDescription = stringResource(Res.string.refresh),
        onClick = onRefresh,
        tagKey = "refresh"
    )
}
```

### A label too long for its column, in full

```kotlin
PantrixTooltip(text = file.name, side = PopoverSide.End, tagKey = file.id) {
    PantrixText(text = file.name, maxLines = 1)
}
```

### A hint the screen brings up itself

```kotlin
val hint = rememberPantrixTooltipState()
LaunchedEffect(firstRun) { if (firstRun) hint.show() }
PantrixTooltip(text = stringResource(Res.string.search), state = hint, tagKey = "search") {
    PantrixIconButton(
        imageVector = PantrixIcons.Search,
        contentDescription = stringResource(Res.string.search),
        onClick = onSearch,
        tagKey = "search"
    )
}
```

## Examples

### Toolbar

At its plainest: `PantrixTooltip` wraps the control it names. Four buttons show only an icon: the tooltip shows each one's name and `contentDescription` says it to a screen reader. The two are the same words.

Rest the mouse on a button, focus it with the keyboard or long-press it with a finger: its name comes up. A click and a tap press the button; the long press that asks for the name does not. The card's "Last event" line says which button was pressed last.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTooltip(text = "Refresh", tagKey = "refresh") {
        PantrixIconButton(
            imageVector = PantrixIcons.Refresh,
            contentDescription = "Refresh",
            onClick = { report("Refresh button pressed") },
            tagKey = "refresh"
        )
    }
    PantrixTooltip(text = "Search", tagKey = "search") {
        PantrixIconButton(
            imageVector = PantrixIcons.Search,
            contentDescription = "Search",
            onClick = { report("Search button pressed") },
            tagKey = "search"
        )
    }
    PantrixTooltip(text = "Zoom in", tagKey = "zoom_in") {
        PantrixIconButton(
            imageVector = PantrixIcons.ZoomIn,
            contentDescription = "Zoom in",
            onClick = { report("Zoom in button pressed") },
            tagKey = "zoom_in"
        )
    }
    PantrixTooltip(text = "Zoom out", tagKey = "zoom_out") {
        PantrixIconButton(
            imageVector = PantrixIcons.ZoomOut,
            contentDescription = "Zoom out",
            onClick = { report("Zoom out button pressed") },
            tagKey = "zoom_out"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Side

`side` says which side of the control the label sits on; the label is centred on the control on that side. By default it sits above the control: `PopoverSide.Top`. Start and End follow the reading direction: in a left-to-right layout Start is the left. Where the side asked for has no room, the label takes the opposite side.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip

var side by rememberSaveable { mutableStateOf(PopoverSide.Top) }
PantrixSegmentButton(options = SIDES, selected = side, onSelect = { side = it }, tagKey = "tooltip_side")
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
    PantrixTooltip(text = "side = ${side.name}", side = side, tagKey = "side") {
        PantrixButton(
            text = "Hover or long-press",
            onClick = {},
            variant = ButtonVariant.Outline,
            tagKey = "side_target"
        )
    }
}

private val SIDES = listOf(
    SegmentOption(value = PopoverSide.Top, label = "Top", tagKey = "top"),
    SegmentOption(value = PopoverSide.Bottom, label = "Bottom", tagKey = "bottom"),
    SegmentOption(value = PopoverSide.Start, label = "Start", tagKey = "start"),
    SegmentOption(value = PopoverSide.End, label = "End", tagKey = "end")
)
```

### Truncated label

A file name cut short on one line because it does not fit its column: the tooltip shows the name in full. The tooltip's label is never wider than the style's maximum width (`TooltipStyle.maxWidth`); the long name wraps inside it.

The anchor here is not a control that is pressed but a text that is only read: the label comes up when the mouse rests on it or a finger long-presses it.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip

val fileName = "2026 third quarter sales report, northern region, second draft and notes.pdf"
PantrixTooltip(text = fileName, side = PopoverSide.Bottom, tagKey = "file") {
    PantrixText(text = fileName, modifier = Modifier.width(220.dp), maxLines = 1, tagKey = "file_name")
}
```

### A hint the screen brings up

Whether the label is up is a state, and the screen can hold it itself: `rememberPantrixTooltipState()`. `hint.show()` brings the label up without anyone touching the control: a hint on the first run, the name of a control that has just changed. `hint.dismiss()` puts it away, and so does a press anywhere else.

The mouse, the keyboard and a long press change that same state too: `hint.visible` always tells the truth about whether the label is up.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.components.overlay.tooltip.rememberPantrixTooltipState
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val hint = rememberPantrixTooltipState()
val report = LocalExampleEvents.current
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixTooltip(
        text = "Add to favourites",
        side = PopoverSide.Bottom,
        state = hint,
        tagKey = "favourite"
    ) {
        PantrixIconButton(
            imageVector = PantrixIcons.Star,
            contentDescription = "Add to favourites",
            onClick = { report("Added to favourites") },
            tagKey = "favourite"
        )
    }
    PantrixButton(text = "Show hint", onClick = { hint.show() }, tagKey = "show_hint")
    PantrixButton(text = "Hide", onClick = { hint.dismiss() }, variant = ButtonVariant.Text, tagKey = "hide_hint")
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Can be turned off

While `enabled = false` nothing brings the label up, and a label that is already up is put away. It is for a control whose name is already in view. Turn the switch on: the button's tooltip starts working.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip

var enabled by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixSwitchButton(
    checked = enabled,
    onCheckedChange = { enabled = it },
    label = "This button's tooltip is on",
    tagKey = "tooltip_on"
)
// The tooltip shows the button's name and says nothing new: a screen reader reads the button, not the label.
PantrixTooltip(text = "Save", enabled = enabled, tagKey = "save") {
    PantrixButton(text = "Save", onClick = { report("Save button pressed") }, tagKey = "save")
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Its own style

`style` changes the geometry of this tooltip alone: the fields of `TooltipStyle` that are set change, and the rest comes from the theme's and the platform's style. The first button's label comes up the moment the mouse is over it: `pointerRestMillis = 0`. The second's label has fully rounded corners (`ShapeRole.Full`) and more room around its text, and sits 12dp from the button.

`pointerRestMillis` is the mouse's wait alone: keyboard focus brings the label up at once, and a finger's long press after the platform's long-press time. The style's wait is 400 milliseconds on Android and iOS, 500 on desktop and the web.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.components.overlay.tooltip.TooltipStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTooltip(text = "Calendar", style = TooltipStyle(pointerRestMillis = 0), tagKey = "instant") {
        PantrixIconButton(
            imageVector = PantrixIcons.Calendar,
            contentDescription = "Calendar",
            onClick = {},
            tagKey = "instant"
        )
    }
    PantrixTooltip(
        text = "Inbox",
        style = TooltipStyle(
            shape = ShapeRole.Full,
            horizontalPadding = 16.dp,
            verticalPadding = 8.dp,
            gap = 12.dp
        ),
        tagKey = "roomy"
    ) {
        PantrixIconButton(
            imageVector = PantrixIcons.Inbox,
            contentDescription = "Inbox",
            onClick = {},
            tagKey = "roomy"
        )
    }
}
```

### Its own colours

Given no colours, the label is in the tone opposite the theme's: dark in the light theme, light in the dark. `colors` gives the label colours of its own: here the app's own purple, which is in none of the theme's roles. Only the fields of `TooltipColors` that are set change.

On a fill that has no role, `content` is given too: the theme does not know what reads on that fill. Where the fill is the colour of one of the theme's roles, such as `PantrixTheme.colors.primary.color`, the text by itself takes the colour the theme pairs with that role.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.components.overlay.tooltip.TooltipColors
import com.pantrixui.foundation.icons.PantrixIcons

val report = LocalExampleEvents.current
val own = ownColors()
PantrixTooltip(
    text = "Pro feature",
    colors = TooltipColors(container = own.color, content = own.onColor),
    tagKey = "own"
) {
    PantrixIconButton(
        imageVector = PantrixIcons.Info,
        contentDescription = "Pro feature",
        onClick = { report("Pro feature button pressed") },
        tagKey = "own"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.
- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### On a button that opens a popover

The tooltip of a button that opens a popover: `PantrixTooltip` is inside the popover's `anchor`. When the popover opens the button is under it, and the label is put away. It does not come back when the popover closes either: nobody is asking for the button's name then.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("More popover closed")
    },
    anchor = {
        PantrixTooltip(text = "More", tagKey = "more") {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "More",
                onClick = { open = true },
                tagKey = "more"
            )
        }
    },
    side = PopoverSide.Bottom,
    tagKey = "more"
) {
    PantrixText(text = "Rename, move or delete.")
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### In a dialog

The tooltips of the buttons in a dialog: the label sits beside the control inside the dialog. The dialog takes the keyboard for itself, and a key pressed in it does not reach the page underneath. Escape still puts the open label away first; the next Escape closes the dialog.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "File details…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "file_details"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("File details closed")
    },
    title = "Report.pdf",
    message = "2,4 MB. Modified yesterday.",
    actions = {
        PantrixButton(
            text = "Close",
            onClick = {
                open = false
                report("File details closed")
            },
            variant = ButtonVariant.Text,
            tagKey = "close_details"
        )
    },
    tagKey = "file_details"
) {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixTooltip(text = "Add to favourites", tagKey = "file_favourite") {
            PantrixIconButton(
                imageVector = PantrixIcons.Star,
                contentDescription = "Add to favourites",
                onClick = { report("Add to favourites button pressed") },
                tagKey = "file_favourite"
            )
        }
        PantrixTooltip(text = "Move to folder", tagKey = "file_move") {
            PantrixIconButton(
                imageVector = PantrixIcons.Folder,
                contentDescription = "Move to folder",
                onClick = { report("Move to folder button pressed") },
                tagKey = "file_move"
            )
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Icon where it is narrow, text where it is wide

An icon alone where it is narrow, a button with text where it is wide. The button learns its own room from `BoxWithPantrixWindow`: where it is narrow a tooltip shows its name; where it is wide the name is written on the button and there is no tooltip.

This box composes its content while it measures, and when its room crosses a breakpoint it throws the old branch away inside the measuring pass. The label's layer is composed at the window's root, so nothing breaks even if the label is up at that moment; the label is also put away whenever the window changes size.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.icons.PantrixIcons

val report = LocalExampleEvents.current
BoxWithPantrixWindow(modifier = Modifier.fillMaxWidth()) { box ->
    if (box.isNarrow) {
        PantrixTooltip(text = "Files", side = PopoverSide.End, tagKey = "files") {
            PantrixIconButton(
                imageVector = PantrixIcons.Folder,
                contentDescription = "Files",
                onClick = { report("Files button pressed (icon)") },
                variant = ButtonVariant.Outline,
                tagKey = "files"
            )
        }
    } else {
        PantrixButton(
            text = "Files",
            onClick = { report("Files button pressed (text)") },
            variant = ButtonVariant.Outline,
            tagKey = "files"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Room that narrows while the window stays the same

Room that narrows while the window stays the same: as with a pane that is dragged or a sidebar that slides open. Press the button: three seconds later the box widens or narrows. Within those three seconds bring up the icon's label or open the popover: when the room changes, the branch that holds them is thrown away, and the label and the popover go with it.

The box is a layout that composes its content while it measures (`BoxWithConstraints`): when it crosses the breakpoint it throws away the branch inside it, in the middle of the measuring pass. The layers of an open label and an open popover are composed at the window's root, so once the branch is thrown away they close in the next frame.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

var narrow by rememberSaveable { mutableStateOf(true) }
val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = if (narrow) "Widen in 3 seconds" else "Narrow in 3 seconds",
    onClick = {
        scope.launch {
            delay(3_000L)
            narrow = !narrow
            report(if (narrow) "Room narrowed" else "Room widened")
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "room"
)
BoxWithConstraints(modifier = Modifier.width(if (narrow) 140.dp else 300.dp)) {
    if (maxWidth < 220.dp) IconsInTheRoom() else WrittenButtonsInTheRoom()
}

@Composable
private fun IconsInTheRoom() {
    var open by rememberSaveable { mutableStateOf(false) }
    val report = LocalExampleEvents.current
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixTooltip(text = "Files", tagKey = "room_files") {
            PantrixIconButton(
                imageVector = PantrixIcons.Folder,
                contentDescription = "Files",
                onClick = {},
                variant = ButtonVariant.Outline,
                tagKey = "room_files"
            )
        }
        PantrixPopover(
            visible = open,
            onDismissRequest = {
                open = false
                report("Info popover closed")
            },
            anchor = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Info,
                    contentDescription = "Info",
                    onClick = { open = true },
                    variant = ButtonVariant.Outline,
                    tagKey = "room_info"
                )
            },
            side = PopoverSide.Bottom,
            tagKey = "room_info"
        ) {
            PantrixText(text = "It is narrow here.")
        }
    }
}

@Composable
private fun WrittenButtonsInTheRoom() {
    var open by rememberSaveable { mutableStateOf(false) }
    val report = LocalExampleEvents.current
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(text = "Files", onClick = {}, variant = ButtonVariant.Outline, tagKey = "room_files")
        PantrixPopover(
            visible = open,
            onDismissRequest = {
                open = false
                report("Info popover closed")
            },
            anchor = {
                PantrixButton(
                    text = "Info",
                    onClick = { open = true },
                    variant = ButtonVariant.Outline,
                    tagKey = "room_info"
                )
            },
            side = PopoverSide.Bottom,
            tagKey = "room_info"
        ) {
            PantrixText(text = "It is wide here.")
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

## API

### PantrixTooltip

`import com.pantrixui.components.overlay.tooltip.PantrixTooltip`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTooltip(
    text: String,
    modifier: Modifier = Modifier,
    side: PopoverSide = PopoverSide.Top,
    enabled: Boolean = true,
    state: PantrixTooltipState = rememberPantrixTooltipState(),
    style: TooltipStyle? = null,
    colors: TooltipColors? = null,
    tagKey: String? = null,
    anchor: @Composable () -> Unit
)
```

A short label that names the control it is anchored to: an icon button's name, a truncated label in full.

It shows what the control already says. A screen reader reads the control itself and the label is hidden from it: a tooltip is a way of showing a name, not a place for anything new. Give the control the same words, as its `contentDescription` or its text.

It comes up by itself and takes nothing from the app: no focus and no key, and no press but one on the label itself and the one that is held to ask for it. What it names keeps working while it is up, and so does whatever is pressed to put it away.

- **A pointer** brings it up once it has rested on the control for the style's `pointerRestMillis`, and takes it away as it leaves. It may cross onto the label and rest there: the label stays while the pointer is on either. A mouse button on the control puts it away until the pointer has left and come back.

- **The keyboard's focus** brings it up at once, where a focus ring is drawn, and takes it away as it leaves. Escape puts it away while the control keeps the focus.

- **A press that is held**, a finger's long press on the control, brings it up, and it stays until something is pressed: one that left with the finger would never be read. That press asked what the control is and presses nothing as it lifts. A tap is the control's alone and brings nothing up, and a press that travels is the start of a scroll.

`state` is the switch all of these throw, and a screen can throw it too.

It sits on `side` of the control, centred on it, on the opposite side where the window has no room for it, and never closer than the style's margin to the window's edges, its system bars or the keyboard. It is put away while its control is under a dialog, a sheet or an open popover, when its control scrolls out of view, and when the window changes size.

Parameters:

- `text: String`: what the control is called: a few words, and the ones the control itself says.
- `modifier: Modifier`: applied to the control's place, the box the control is laid out in where the tooltip is called: an alignment or a weight there places the control, and the label goes with it.
- `side: PopoverSide`: the side of the control the tooltip prefers. `PopoverSide.Start` and `PopoverSide.End` follow the layout direction.
- `enabled: Boolean`: false puts it away and keeps it away, for a control whose name is already in view.
- `state: PantrixTooltipState`: whether the tooltip is up, and the handle that shows and hides it.
- `style: TooltipStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TooltipColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `tagKey: String?`: a locale-independent key for automation: the label's tag is `Tooltip_<tagKey>`.
- `anchor: @Composable () -> Unit`: the control the tooltip names, laid out where this is called and as that place asks. A control that is pressed, a button or an icon, or a text that is only read: one with a long press of its own, a text field or text that can be selected, would have that press taken from it on a touch screen.

### rememberPantrixTooltipState

`import com.pantrixui.components.overlay.tooltip.rememberPantrixTooltipState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberPantrixTooltipState(initiallyVisible: Boolean = false): PantrixTooltipState
```

Remembers a `PantrixTooltipState`. Give it to `PantrixTooltip` to show and hide that tooltip from the screen around it.

Parameters:

- `initiallyVisible: Boolean`: whether the tooltip is up the first time it is composed.

### PantrixTooltipState

`import com.pantrixui.components.overlay.tooltip.PantrixTooltipState`, from `com.pantrixui:components`

```kotlin
class PantrixTooltipState
```

Whether a `PantrixTooltip` is up, and the handle that brings it up and puts it away.

A tooltip brings itself up when a pointer rests on what it names, when that takes the keyboard's focus and when a press is held on it, and it goes as the pointer or the focus leaves, on a press and on Escape. Every one of those throws this one switch, so `visible` is the whole truth about the tooltip.

A screen that shows one of its own accord, a hint on the first run or a name beside a control it has just changed, holds the state itself and calls `show` and `dismiss`:

```kotlin
val hint = rememberPantrixTooltipState()
LaunchedEffect(firstRun) { if (firstRun) hint.show() }
PantrixTooltip(text = stringResource(Res.string.refresh), state = hint, tagKey = "refresh") {
    PantrixIconButton(imageVector = PantrixIcons.Refresh, contentDescription = …, onClick = onRefresh)
}
```

Hold it with `rememberPantrixTooltipState`.

Members:

- `visible: Boolean`: Whether the tooltip is up. A tooltip that is turned off, or whose control is under a dialog or another modal layer, is put away, and this is false then.
- `fun show()`: Brings the tooltip up. Showing one that is up changes nothing.
- `fun dismiss()`: Puts the tooltip away. Dismissing one that is away changes nothing.
- `fun toggle()`: Puts the tooltip away where it is up, and brings it up where it is not.

### PopoverSide

`import com.pantrixui.components.overlay.popover.PopoverSide`, from `com.pantrixui:components`

```kotlin
enum class PopoverSide
```

Which side of its anchor a popover prefers. It takes the opposite side where the window has no room for it.

Entries:

- `Top`: Over the anchor.
- `Bottom`: Under the anchor.
- `Start`: The start edge: the left in a left-to-right layout, the right in a right-to-left one.
- `End`: The end edge: the right in a left-to-right layout, the left in a right-to-left one.

### TooltipStyle

`import com.pantrixui.components.overlay.tooltip.TooltipStyle`, from `com.pantrixui:components`

```kotlin
class TooltipStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val pointerRestMillis: Int? = null
) : PantrixStyle<TooltipStyle>
```

`PantrixTooltip`'s geometry: how large the label is, how far it sits from what it names, how close it comes to the edges of the window, and how long a pointer rests on a control before its tooltip appears.

The padding around the text, the gap and the margin follow density. The widest width, the corners, the shadow and the pointer's rest do not. A tooltip's colours are not part of its style: they are the theme's, and `TooltipColors` where a call has its own.

Parameters:

- `shape: ShapeSpec`: The label's corners.
- `horizontalPadding: Dp`: Between the text and the label's start and end edges.
- `verticalPadding: Dp`: Between the text and the label's top and bottom edges.
- `maxWidth: Dp`: The widest the label gets: longer text wraps.
- `gap: Dp`: Between what the tooltip names and the tooltip.
- `margin: Dp`: Kept clear between the tooltip and the edges of the window, and of what covers the window there: a system bar, a cutout, the keyboard.
- `elevation: Dp`: How high the label floats over the app, which is how large its shadow is.
- `pointerRestMillis: Int?`: How long a pointer rests on a control before its tooltip appears, in milliseconds. Keyboard focus shows it at once, and a finger's long press as long as the platform takes one to be: this is the pointer's wait alone. `null` leaves the value of the style underneath in place.

### TooltipColors

`import com.pantrixui.components.overlay.tooltip.TooltipColors`, from `com.pantrixui:components`

```kotlin
data class TooltipColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

What a `PantrixTooltip` is painted with, for a call that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixTooltip(text = name, colors = TooltipColors(container = PantrixTheme.colors.primary.color)) { … }
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the text, unless a `content` colour is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The label's fill. The theme's `onSurface`: the tone opposite the theme's grounds, so that the label stands out over whatever the page shows under it, in the light theme and the dark.
- `content: Color`: The label's text. The theme's `textInverse`, which is what reads on that tone.
