# Popover

A layer that opens beside an element and shows more about it than the element itself can: what a status means, what a field expects, a few controls for one row. There is no scrim, and the page stays in view around it; the popover sits beside its anchor (`anchor`) and moves with it as the content scrolls.

The popover does not close itself. A press outside it, back and Escape call `onDismissRequest`; what closes it is the caller, setting `visible` to false. The first press outside only closes: what is under it is not pressed, so a press on the anchor closes the popover and does not open it again.

A closed popover composes nothing but its anchor: it stays in the tree with `visible = false`, and enters and leaves with the theme's motion. A popover that is taken out of the composition while it is open goes at once, without motion.

- `PantrixPopover` (`com.pantrixui.components.overlay.popover`, `com.pantrixui:components`): A layer beside an element with more about it, closed by a press outside, Escape or back; anchored to the element rather than modal. Keywords: popup, floating panel, flyout, dropdown panel, overlay, info panel.

## Features

- **Title.** `title` stands at the top of the popover and stays in place while the content scrolls. Every popover of more than a line is given one.
- **Content.** `content` is a column under the title: a text, a link, a few buttons.
- **Side and alignment.** `side` says which side of the anchor the popover opens on, `alignment` how it lines up along that side: left unsaid, it opens below the anchor and is centred on it. Where the side that is asked for has no room, it takes the opposite side.
- **Inside the window.** It comes no closer than the style's `margin` to the edges of the window, the system bars and the keyboard, and is no larger than that room: its content wraps, and what does not fit scrolls under the title.
- **A popover that cannot be dismissed.** With `dismissible = false`, a press outside it, back and Escape do not ask it to close: only for a popover that something inside it closes.
- **Keyboard.** Opened by the keyboard it takes the focus: its first control does, or the popover itself where it has none. Then the arrow keys, Page Up and Page Down, the space bar, Home and End scroll the content. Tab stays inside it; once it has closed, the focus goes back to the anchor, the control that opened it.
- **Touch and mouse.** Opened by a touch or a click it leaves the focus where it was; once the keyboard comes into use the popover takes the focus. While it is open the page under it shows no focus.
- **Colours and style.** `colors` (`PopoverColors`) gives the fill and the colours of the title and of the line around it; `style` (`PopoverStyle`) gives the corners, the widths, the tallest height, the shadow and the distance to the anchor. Only the fields that are given change; the rest stay the theme's.
- **Platforms.** The popover looks the same on every platform; the difference is in the style. At its widest it is 320 dp on Android and iOS, and 360 dp on desktop and the web; its corners are the theme's medium corner on Android and iOS, and its small one on desktop and the web.
- **Screen reader.** The popover's title is announced as it opens; the title is the heading of the content. Since there is no scrim around it to press, a screen reader closes it with its own dismiss action.

## Usage

### More about a row, beside the button that asks for it

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixIconButton(
            imageVector = PantrixIcons.Info,
            contentDescription = stringResource(Res.string.details),
            onClick = { open = true },
            tagKey = "details"
        )
    },
    title = stringResource(Res.string.delivery),
    tagKey = "delivery"
) {
    PantrixText(text = stringResource(Res.string.delivery_window, window))
    PantrixLink(text = stringResource(Res.string.track), onClick = onTrack, tagKey = "track")
}
```

### Beside a field, on the end side in a wide window

```kotlin
PantrixPopover(
    visible = help,
    onDismissRequest = { help = false },
    anchor = { PantrixTextField(state = iban, label = stringResource(Res.string.iban), tagKey = "iban") },
    side = PopoverSide.End,
    alignment = PopoverAlignment.Start,
    tagKey = "iban_help"
) {
    PantrixText(text = stringResource(Res.string.iban_help))
}
```

## Examples

### Information

At its plainest: an info button beside a row opens the popover; it holds more about the row, and a link. Whether the popover is open is the screen's state (`visible`). The popover does not close itself: when it wants to close it calls `onDismissRequest`, and it is this code that sets `visible` to false. A press on a control inside it does not ask it to close: the link closes the popover in its own `onClick`.

A press outside it, back and Escape close it. Opened by the keyboard, the focus is on the link; once it has closed, the focus is back on the button. The card's "Last event" line says what happened last.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Delivery: Tuesday")
    PantrixPopover(
        visible = open,
        onDismissRequest = {
            open = false
            report("Delivery popover closed")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.Info,
                contentDescription = "Delivery details",
                onClick = { open = true },
                tagKey = "open_delivery"
            )
        },
        title = "Delivery",
        tagKey = "delivery"
    ) {
        PantrixText(text = "It arrives on Tuesday between 09.00 and 12.00. The courier calls ten minutes before.")
        PantrixLink(
            text = "Track the parcel",
            onClick = {
                open = false
                report("Parcel tracking opened")
            },
            tagKey = "track"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Side and alignment

`side` says which side of the anchor the popover opens on, `alignment` how it lines up along that side. Left unsaid, the popover opens below the anchor and is centred on it: `PopoverSide.Bottom` and `PopoverAlignment.Center`.

Start and End follow the reading direction: in a left-to-right layout Start is the left. While the popover is beside the anchor (Start or End) the alignment is vertical: Start makes the top edges meet, End the bottom edges.

Where the side that is asked for has no room, the popover takes the opposite side: pick Top and open it while the button is near the top edge of the window. With no room on either side the popover stays on the side that was asked for and slides into the window, over the anchor.

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
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverSide

var open by rememberSaveable { mutableStateOf(false) }
var side by rememberSaveable { mutableStateOf(PopoverSide.Bottom) }
var alignment by rememberSaveable { mutableStateOf(PopoverAlignment.Center) }
val report = LocalExampleEvents.current
PantrixSegmentButton(options = SIDES, selected = side, onSelect = { side = it }, tagKey = "side")
PantrixSegmentButton(
    options = ALIGNMENTS,
    selected = alignment,
    onSelect = { alignment = it },
    tagKey = "alignment"
)
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
    PantrixPopover(
        visible = open,
        onDismissRequest = {
            open = false
            report("Popover closed")
        },
        anchor = {
            PantrixButton(
                text = "Open",
                onClick = { open = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_placed"
            )
        },
        side = side,
        alignment = alignment,
        tagKey = "placed"
    ) {
        PantrixText(text = "side = ${side.name}, alignment = ${alignment.name}")
    }
}

private val SIDES = listOf(
    SegmentOption(value = PopoverSide.Top, label = "Top", tagKey = "top"),
    SegmentOption(value = PopoverSide.Bottom, label = "Bottom", tagKey = "bottom"),
    SegmentOption(value = PopoverSide.Start, label = "Start", tagKey = "start"),
    SegmentOption(value = PopoverSide.End, label = "End", tagKey = "end")
)

private val ALIGNMENTS = listOf(
    SegmentOption(value = PopoverAlignment.Start, label = "Start", tagKey = "start"),
    SegmentOption(value = PopoverAlignment.Center, label = "Centre", tagKey = "center"),
    SegmentOption(value = PopoverAlignment.End, label = "End", tagKey = "end")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### At the edge

An anchor near the end edge of the window. A popover is centred on its anchor; with the anchor near the edge, a centred popover would run out of the window. It does not: it slides so that it stays the style's `margin` in from the edge.

Try it in a narrow window: the one to narrow is the app's own window. A popover picks its place by the real window, not by the window a card's window selector gives its example; that is why this card has no such selector. In a window that is wide enough there is room for the popover beside the card; there the popover does not slide, and is centred on the button.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
    PantrixPopover(
        visible = open,
        onDismissRequest = {
            open = false
            report("Popover at the edge closed")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "Sharing details",
                onClick = { open = true },
                tagKey = "open_shared"
            )
        },
        title = "Sharing",
        tagKey = "shared"
    ) {
        PantrixText(text = "Three people can see this folder: Ada, Deniz and Umut.")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Beside a field

A popover that says what a field expects. The anchor is the whole field: the popover opens under the field, lined up with its end by `alignment = PopoverAlignment.End`. What opens it is the info button at the end of the field.

While the popover is open the page under it shows no focus: open it while you are typing in the field, and the field is drawn at rest for as long as the popover is open. Once it has closed, the focus is on the anchor again.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val iban = rememberTextFieldState()
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("IBAN help closed")
    },
    anchor = {
        PantrixTextField(
            state = iban,
            modifier = Modifier.fillMaxWidth(),
            label = "IBAN",
            placeholder = "TR00 0000 0000 0000 0000 0000 00",
            trailingIcon = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Info,
                    contentDescription = "What is an IBAN?",
                    onClick = { open = true },
                    size = ButtonSize.Small,
                    tagKey = "open_iban_help"
                )
            },
            tagKey = "iban"
        )
    },
    alignment = PopoverAlignment.End,
    title = "IBAN",
    tagKey = "iban_help"
) {
    PantrixText(text = "The 26-character account number that starts with TR. Your banking app shows it in the account details.")
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Confirmation

A small confirmation: in a wide window, beside the button the action starts from, in place of a dialog. It holds a sentence and two buttons; each button closes the popover in its own `onClick`.

The safe choice comes first: opened by the keyboard, the focus is on the first control, "Cancel". `alignment = PopoverAlignment.Start` lines the popover up with the start of the button.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Delete confirmation closed")
    },
    anchor = {
        PantrixButton(
            text = "Delete file…",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_confirm"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Delete this file?",
    tagKey = "delete_file"
) {
    PantrixText(text = "Report.pdf will be removed from every device.")
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(
            text = "Cancel",
            onClick = {
                open = false
                report("Deletion cancelled")
            },
            variant = ButtonVariant.Text,
            tagKey = "cancel_delete"
        )
        PantrixButton(
            text = "Delete",
            onClick = {
                open = false
                report("File deleted")
            },
            variant = ButtonVariant.Destructive,
            tagKey = "confirm_delete"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A required choice

`dismissible = false`: a press outside it, back and Escape do nothing, and a screen reader has no dismiss action either. What has to close it is inside it: the two buttons are the way out. `dismissible` is set to false only for a popover like this, one that something inside it closes.

`onDismissRequest` was left empty: in this popover it is never called.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {},
    anchor = {
        PantrixButton(
            text = "Cookie preferences",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_cookies"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Cookies",
    dismissible = false,
    tagKey = "cookies"
) {
    PantrixText(text = "Do you allow analytics cookies?")
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(
            text = "Necessary only",
            onClick = {
                open = false
                report("Necessary cookies only")
            },
            variant = ButtonVariant.Text,
            tagKey = "cookies_needed"
        )
        PantrixButton(
            text = "Allow",
            onClick = {
                open = false
                report("Cookies allowed")
            },
            tagKey = "cookies_all"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Long content

Thirty lines do not fit in the style's tallest height (`PopoverStyle.maxHeight`): the popover stays at that height, the title stays where it is, and the content scrolls under it.

It holds no control to take the focus. So with the keyboard the popover itself takes the focus, and the scrolling keys scroll the content: the arrow keys, Page Up and Page Down, the space bar, Home and End.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Release notes closed")
    },
    anchor = {
        PantrixButton(
            text = "Release notes",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_notes"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Release notes",
    tagKey = "notes"
) {
    (1..30).forEach { number -> PantrixText(text = "Change $number: a small fix.") }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Its own style

`style` changes the geometry of this popover alone: the fields of `PopoverStyle` that are given change, and the rest comes from the theme's and the platform's style. Here the popover is 220dp wide at the most and the text wraps at that width; its corners are the theme's large corner (`ShapeRole.Large`), and it sits 16dp from its anchor.

The distance to the anchor (`gap`) scales with the theme's density; the widest width and the corners do not.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverStyle
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Shortcuts",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_shortcuts"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Shortcuts",
    style = PopoverStyle(shape = ShapeRole.Large, maxWidth = 220.dp, gap = 16.dp),
    tagKey = "shortcuts"
) {
    PantrixText(text = "Ctrl+F searches, F5 refreshes. Del deletes the selected file; Ctrl+Z undoes it.")
}
```

### Its own colours

`colors` gives the popover the colours that are given, not the theme's: here the app's own purple, which none of the theme's roles has. Only the fields of `PopoverColors` that are given change; the rest stay the theme's.

`PopoverColors` paints the fill, the title and the line around it; the content's colour is not in it. On a fill no role has, whoever writes the content gives its colour: the text here was written with `color = own.onContainer`. Where the fill is one of the theme's role colours, such as `PantrixTheme.colors.info.container`, the title and the content by themselves take the colour the theme pairs with that role.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverColors

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Pro popover closed")
    },
    anchor = {
        PantrixButton(
            text = "What is Pro?",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_pro"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Pro",
    colors = PopoverColors(container = own.container, title = own.onContainer, border = own.color),
    tagKey = "pro"
) {
    PantrixText(text = "Unlimited projects, shared folders and priority support.", color = own.onContainer)
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.
- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### In a part in another theme

A part in the opposite colours to the page, and a popover opened from inside it. The part is a second theme (`PantrixTheme(darkTheme = …)`): dark on a light page, light on a dark one. Because the popover is called inside that theme it is in its colours: though its layer is composed at the root of the window, it carries the theme of the place it is called from.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixPopover(
                visible = open,
                onDismissRequest = {
                    open = false
                    report("The part's popover closed")
                },
                anchor = {
                    PantrixButton(text = "Open from this part", onClick = { open = true }, tagKey = "open_in_part")
                },
                alignment = PopoverAlignment.Start,
                title = "This part",
                tagKey = "in_part"
            ) {
                PantrixText(text = "Opened in the part's theme.")
            }
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A sheet in a narrow window

`presentation = OverlayPresentation.Adaptive`: in a narrow window the popover becomes a sheet from the bottom, its title the sheet's title and its content under it; in a wider window it is a popover beside the button. Switch between "Narrow" and "Wide" in the card's window selector. A popover's default is `Popover` in every window: an information box should mostly stay beside what it is about.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.popover.PantrixPopover

var open by rememberSaveable { mutableStateOf(false) }
// The card's window is as tall as the example: the example is kept tall so that a sheet opened in a narrow window has room.
Column(Modifier.fillMaxWidth().height(280.dp)) {
    PantrixPopover(
        visible = open,
        onDismissRequest = { open = false },
        anchor = { PantrixButton(text = "Delivery", onClick = { open = true }, tagKey = "open_adaptive_popover") },
        title = "Delivery",
        tagKey = "adaptive_popover",
        presentation = OverlayPresentation.Adaptive
    ) {
        PantrixText("It arrives on Tuesday between nine and twelve; the courier calls ten minutes ahead.")
        PantrixButton(text = "Track the parcel", onClick = { open = false }, tagKey = "adaptive_track")
    }
}
```

## API

### PantrixPopover

`import com.pantrixui.components.overlay.popover.PantrixPopover`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixPopover(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    anchor: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopoverSide = PopoverSide.Bottom,
    alignment: PopoverAlignment = PopoverAlignment.Center,
    title: String? = null,
    dismissible: Boolean = true,
    style: PopoverStyle? = null,
    colors: PopoverColors? = null,
    tagKey: String? = null,
    presentation: OverlayPresentation = OverlayPresentation.Popover,
    content: @Composable ColumnScope.() -> Unit
)
```

A layer beside an element, holding more about it than the element itself can show: what a status means, what a field expects, a few controls for one row.

It is anchored, not modal: nothing is dimmed, the app stays in view around it, and the popover follows its anchor as the content moves. It sits on `side` of the anchor while the window has room for it there and on the opposite side otherwise, lined up as `alignment` says, and never closer than the style's margin to the edges of the window, its system bars or the keyboard. It is no larger than that room either: what it holds wraps, and scrolls under the title.

The popover never hides itself. A press outside it, Escape and back call `onDismissRequest` unless `dismissible` is false, and the caller sets `visible` to false. The first press outside only asks to close: what is under it is not pressed, so a press on the anchor closes the popover and does not open it again. Once it is told to close it is in no one's way: a press while it fades is the app's.

Opened by the keyboard it takes the focus: its first control does, or the popover itself where it holds none, and then the arrows, Page Up and Page Down, the space bar, Home and End scroll what it holds. Opened by a touch or a click it leaves the focus where it was, and takes it once the keyboard comes into use. Tab stays inside it, and once it has closed the focus is on the anchor: on the control that opened it. While it is shown the app under it shows no focus, as under a dialog.

**Close it to see it leave.** A popover that has closed composes nothing but its anchor, so leaving it in the tree with `visible = false` is free, and it leaves with the theme's motion. An open one that is taken out of the composition is gone without it, and that is all it costs: its layer is composed at the root of its window, so a layout that throws its content away while it measures, such as a `BoxWithConstraints` that changes branch, closes no layer that the window is still measuring.

It looks the same on every platform; what differs is in `PopoverStyle`: the corners, the widths and the shadow.

Parameters:

- `visible: Boolean`: whether the popover is shown. It enters and leaves with the theme's motion.
- `onDismissRequest: () -> Unit`: called for a press outside, Escape and back while `dismissible`. The popover stays until `visible` is false.
- `anchor: @Composable () -> Unit`: what the popover is placed beside: the control that opens it, laid out where this is called and as that place asks. The popover is placed against its layout box, the room of its touch target included.
- `modifier: Modifier`: applied to the popover itself, inside its layer. Not to the anchor.
- `side: PopoverSide`: the side of the anchor the popover prefers. `PopoverSide.Start` and `PopoverSide.End` follow the layout direction.
- `alignment: PopoverAlignment`: how the popover lines up with the anchor along that side.
- `title: String?`: a heading at the top of the popover, which stays in view while what is under it scrolls, and what a screen reader announces as the popover appears. Give one to a popover of more than a line.
- `dismissible: Boolean`: whether a press outside, Escape, back and a screen reader's dismiss action ask to close. Turn it off only for a popover that something in `content` closes.
- `style: PopoverStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: PopoverColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `tagKey: String?`: a locale-independent key for automation: the popover's tag is `Popover_<tagKey>`, on the popover as it is drawn, and on the sheet where it is shown as one.
- `presentation: OverlayPresentation`: how the popover is shown: beside its anchor, by default; as a sheet from the bottom of the window, the `title` its heading and `content` under it with the popover's own padding at its sides; or the one in a narrow window and the other in a wider one. Chosen as it opens, it stays until it has closed.
- `content: @Composable ColumnScope.() -> Unit`: what the popover holds, in a column under the title.

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

### PopoverAlignment

`import com.pantrixui.components.overlay.popover.PopoverAlignment`, from `com.pantrixui:components`

```kotlin
enum class PopoverAlignment
```

How a popover lines up with its anchor along the side it sits on.

Entries:

- `Start`: Their start edges meet, or their top edges where the popover is beside its anchor.
- `Center`: Centred on the anchor.
- `End`: Their end edges meet, or their bottom edges where the popover is beside its anchor.

### PopoverStyle

`import com.pantrixui.components.overlay.popover.PopoverStyle`, from `com.pantrixui:components`

```kotlin
class PopoverStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified
) : PantrixStyle<PopoverStyle>
```

`PantrixPopover`'s geometry: how wide and tall it gets, how far it sits from its anchor and how close it comes to the edges of the window.

The padding inside it and the gaps between what it holds come from the theme's spacing, so they follow density, and so do the gap, the margin and the narrowest width. The widest width, the tallest height, the corners and the shadow do not. A popover's colours are not part of its style: they are the theme's, and `PopoverColors` where a call has its own.

Parameters:

- `shape: ShapeSpec`: The popover's corners: medium on Android and iOS, small on desktop and the web.
- `minWidth: Dp`: The narrowest the popover gets, however little it holds.
- `maxWidth: Dp`: The widest the popover gets: longer text wraps.
- `maxHeight: Dp`: The tallest the popover gets: what it holds scrolls beyond this, under the title.
- `elevation: Dp`: How high the popover floats over the app, which is how large its shadow is.
- `gap: Dp`: Between the anchor and the popover.
- `margin: Dp`: Kept clear between the popover and the edges of the window, and of what covers the window there: a system bar, a cutout, the keyboard.

### PopoverColors

`import com.pantrixui.components.overlay.popover.PopoverColors`, from `com.pantrixui:components`

```kotlin
data class PopoverColors(
    public val container: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What a `PantrixPopover` is painted with, for a call that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixPopover(…, colors = PopoverColors(container = PantrixTheme.colors.info.container))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for what the popover holds, and for the title unless a title colour is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The popover's fill. The theme's `surface`.
- `title: Color`: The title. The theme's `textPrimary`.
- `border: Color`: The hairline around the popover, which tells it from a surface of its own colour under it, as in the dark theme, where a shadow shows little. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `title`: the edge a subtle button has. A transparent colour draws none.

### OverlayPresentation

`import com.pantrixui.components.overlay.common.OverlayPresentation`, from `com.pantrixui:components`

```kotlin
enum class OverlayPresentation
```

How an overlay that belongs to a control is shown: beside the control, or as a sheet from the bottom of the window.

A popover beside what was pressed suits a window with room around the control, and a pointer. On a phone the same overlay is small under a finger and hides the screen's middle; a sheet from the bottom edge is within the thumb's reach and as wide as the window.

Entries:

- `Adaptive`: A sheet in a narrow window, the `Compact` width class, and a popover in every wider one. The window is the one the overlay is shown over, not the room of a pane it was opened in, and it is asked as the overlay opens: one that is open stays as it is when the window changes, and the next one is shown by the window as it is then.
- `Popover`: A popover beside the control, in every window.
- `Sheet`: A sheet from the bottom edge of the window, in every window.
