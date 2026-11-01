# Dialog

A window that stops the app to ask the user for a decision, or to give news that must not go unseen. It sits in the middle of the app's window, above a scrim, and is modal on every platform: nothing behind it takes a press, and Tab never leaves it.

The dialog never closes itself. It is shown while `visible` is true; a click on the scrim, back and Escape call `onDismissRequest`, and the actions' buttons call their own `onClick`. What closes it is the calling code, which sets `visible` to false.

- `PantrixDialog` (`com.pantrixui.components.overlay.dialog`, `com.pantrixui:components`): A modal decision or message over the app: a title, a message or content, and actions; focus stays inside until it closes. Keywords: modal, alert dialog, confirmation, popup, prompt, confirm.

## Features

- **Title, message, actions.** `title` is a short question or statement, and `message` the explanation under it. `actions` are end-aligned buttons; they wrap onto another line when they do not fit side by side.
- **The safe choice first.** In a dialog opened with a keyboard the focus starts on the first control, usually the first action; so "Cancel" is written before "Delete". When it is opened by touch the focus stays where it is.
- **Icon.** `icon` stands above the title and centres it. It is decorative: a screen reader does not read it.
- **Its own content.** `content` puts a form field or a list of choices under the message.
- **Width.** A dialog of a title, a message and actions is as wide as its widest part, between the style's two widths: a short question is narrow, and a long message wraps at the widest. A dialog that holds content is as wide as it may be.
- **A long body.** In a short window only the message and the content scroll; the title and the actions stay where they are.
- **A dialog that cannot be dismissed.** With `dismissible = false` the scrim, back and Escape do nothing; the actions are the only way out.
- **It stays in the tree as it closes.** A dialog that is closed composes nothing: it stays in the tree with `visible = false` and leaves with the theme's motion. An open one that is taken out of the composition is gone at once, without the motion.
- **Colour and style.** `colors` changes the fill, the title, the message, the icon and the scrim; `style` the corners, the widths, the margin to the window, the shadow and the icon's size. The dialog looks the same on every platform; what differs is in the style: the corners are large on Android and iOS and medium on desktop and the web, and there is no shadow on iOS.
- **Screen reader.** The title is announced when the dialog opens and is the heading of what it holds. On Android TalkBack stays inside the dialog. In a dialog that can be dismissed the scrim is a single "Close" action, read after the content.

## Usage

### Confirm a destructive action

```kotlin
PantrixDialog(
    visible = confirmDelete,
    onDismissRequest = { confirmDelete = false },
    title = stringResource(Res.string.delete_file_title),
    message = stringResource(Res.string.delete_file_message),
    actions = {
        PantrixButton(
            text = stringResource(Res.string.cancel),
            onClick = { confirmDelete = false },
            variant = ButtonVariant.Text,
            tagKey = "cancel"
        )
        PantrixButton(
            text = stringResource(Res.string.delete),
            onClick = onDelete,
            variant = ButtonVariant.Destructive,
            tagKey = "delete"
        )
    },
    tagKey = "delete_file"
)
```

### A form in a dialog

```kotlin
PantrixDialog(
    visible = renaming,
    onDismissRequest = { renaming = false },
    title = stringResource(Res.string.rename_file),
    actions = {
        PantrixButton(
            text = stringResource(Res.string.cancel),
            onClick = { renaming = false },
            variant = ButtonVariant.Text,
            tagKey = "cancel"
        )
        PantrixButton(text = stringResource(Res.string.rename), onClick = onRename, tagKey = "rename")
    },
    tagKey = "rename_file"
) {
    PantrixTextField(state = name, label = stringResource(Res.string.file_name), tagKey = "file_name")
}
```

## Examples

### Confirmation

The confirmation of something that cannot be undone: a title, a message and two actions. The dialog never closes itself: a click on the scrim, back and Escape call `onDismissRequest`, and the actions call their own `onClick`; in all three it is the `open = false` line that closes it. The card's "Last event" line says which of them happened last.

The safe choice comes first: "Cancel" is written before the `Destructive` "Delete". When the dialog is opened with a keyboard, the focus is on "Cancel".

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Delete file…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_delete"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Delete dialog closed")
    },
    title = "Delete this file?",
    message = "Report.pdf will be removed from every device. This cannot be undone.",
    actions = {
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
    },
    tagKey = "delete_file"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### With an icon

`icon` stands above the title, and the title is centred. The icon is decorative: the title carries the meaning, and a screen reader does not read the icon.

A notice with a single action: news important enough to interrupt. A click on the scrim, back and Escape close it too.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "End session",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_session"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Session dialog closed")
    },
    title = "Session expired",
    message = "You were signed out for your security. Sign in again to carry on where you left off.",
    icon = PantrixIcons.Info,
    actions = {
        PantrixButton(
            text = "Sign in again",
            onClick = {
                open = false
                report("Signed in again")
            },
            tagKey = "sign_in_again"
        )
    },
    tagKey = "session"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Form

`content` puts the caller's content under the message: here a field that takes the file's new name. A dialog that holds content is as wide as it may be, even with a short title: the field fills that room. "Save" is disabled while the name is empty.

When the dialog is opened by touch the focus does not move to the field: the keyboard does not come up by itself. When it is opened with a keyboard the focus starts on the first control.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.foundation.text.input.setTextAndPlaceCursorAtEnd
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val name = rememberTextFieldState()
PantrixButton(
    text = "Rename…",
    onClick = {
        name.setTextAndPlaceCursorAtEnd("Report")
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "open_rename"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Renaming closed")
    },
    title = "Rename file",
    actions = {
        PantrixButton(
            text = "Cancel",
            onClick = {
                open = false
                report("Renaming cancelled")
            },
            variant = ButtonVariant.Text,
            tagKey = "cancel_rename"
        )
        PantrixButton(
            text = "Save",
            onClick = {
                open = false
                report("New name: ${name.text}")
            },
            enabled = name.text.isNotBlank(),
            tagKey = "confirm_rename"
        )
    },
    tagKey = "rename_file"
) {
    PantrixTextField(state = name, modifier = Modifier.fillMaxWidth(), label = "File name", tagKey = "file_name")
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A required choice

`dismissible = false`: the scrim, back and Escape do nothing, and `onDismissRequest` is not called. A screen reader is not offered the scrim's "Close" action either.

The user has to choose one of the actions, so there is an action for every way out: someone who does not accept the terms presses "Sign out". Use it only where the user must choose.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Show terms",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_terms"
)
PantrixDialog(
    visible = open,
    onDismissRequest = { report("This is never called: the dialog cannot be dismissed") },
    title = "Terms updated",
    message = "To continue, you need to accept the new terms of use.",
    dismissible = false,
    actions = {
        PantrixButton(
            text = "Sign out",
            onClick = {
                open = false
                report("Terms declined")
            },
            variant = ButtonVariant.Text,
            tagKey = "decline_terms"
        )
        PantrixButton(
            text = "Accept",
            onClick = {
                open = false
                report("Terms accepted")
            },
            tagKey = "accept_terms"
        )
    },
    tagKey = "terms"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Long content

A body that does not fit the window: release notes of forty lines. Only the body scrolls; the title and the action stay where they are, in view. The message scrolls with the content too.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Release notes",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_notes"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Release notes closed")
    },
    title = "Release notes",
    message = "The changes in this release.",
    actions = {
        PantrixButton(
            text = "OK",
            onClick = {
                open = false
                report("Release notes read")
            },
            tagKey = "close_notes"
        )
    },
    tagKey = "release_notes"
) {
    RELEASE_NOTES.forEachIndexed { index, note ->
        PantrixText(text = "${index + 1}. $note", tagKey = "note_$index")
    }
}

private val RELEASE_NOTES = List(size = 40) { index ->
    when (index % 4) {
        0 -> "Files can now be dragged into folders."
        1 -> "Shared folders now show who changed what."
        2 -> "Search now finds text inside files too."
        else -> "Changes made offline sync when the connection is back."
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A short question, a long message

A dialog of a title, a message and actions is as wide as its widest part, between the style's two widths. A short question is at its narrowest (`DialogStyle.minWidth`); a long message wraps at the widest (`maxWidth`).

Open the two in turn: the difference shows in a wide window. The first is also the dialog with the least to write: a title and actions.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var asking by rememberSaveable { mutableStateOf(false) }
var telling by rememberSaveable { mutableStateOf(false) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "A short question",
        onClick = { asking = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_sign_out"
    )
    PantrixButton(
        text = "A long message",
        onClick = { telling = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_sync_paused"
    )
}
PantrixDialog(
    visible = asking,
    onDismissRequest = { asking = false },
    title = "Sign out?",
    actions = {
        PantrixButton(text = "Cancel", onClick = { asking = false }, variant = ButtonVariant.Text, tagKey = "stay")
        PantrixButton(text = "Sign out", onClick = { asking = false }, tagKey = "sign_out")
    },
    tagKey = "sign_out"
)
PantrixDialog(
    visible = telling,
    onDismissRequest = { telling = false },
    title = "Sync paused",
    message = "File sync was paused because the device switched to mobile data. Once it connects to Wi-Fi it picks up " +
        "where it left off; if you would rather not wait, you can turn on sync over mobile data in settings.",
    actions = {
        PantrixButton(text = "OK", onClick = { telling = false }, tagKey = "sync_paused_ok")
    },
    tagKey = "sync_paused"
)
```

### Its own colours

The colours given with `colors` change, and one that is not given stays the theme's: here the fill, the title, the message and the icon are in the app's own purple, and the scrim is the theme's.

This purple is in none of the theme's roles, so the colour that reads on it, for the title and the message, is the caller's to give too. Had the fill been one of the theme's role colours, the title, the message and the icon would have taken the colour paired with that role by themselves.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.DialogColors
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixButton(
    text = "Upgrade plan",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_upgrade"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Upgrade dialog closed")
    },
    title = "Upgrade to Pro",
    message = "Unlimited projects, shared folders and priority support.",
    icon = PantrixIcons.Star,
    colors = DialogColors(
        container = own.container,
        title = own.onContainer,
        message = own.onContainer,
        icon = own.color
    ),
    actions = {
        PantrixButton(
            text = "Not now",
            onClick = {
                open = false
                report("Upgrade postponed")
            },
            variant = ButtonVariant.Text,
            tagKey = "later"
        )
        PantrixButton(
            text = "Upgrade",
            onClick = {
                open = false
                report("Plan upgraded")
            },
            tagKey = "upgrade"
        )
    },
    tagKey = "upgrade"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.
- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Its own style

`style` changes the geometry of this call alone: the corners have the theme's smallest rounding (`ShapeRole.ExtraSmall`), the widest width is 360dp and the icon 40dp. The fields that are not set, the narrowest width, the margin to the window and the shadow, come from the platform's style.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.DialogStyle
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixButton(
    text = "Share folder…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_share_folder"
)
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Share the folder?",
    message = "Anyone with the link can see the files in the Reports folder.",
    icon = PantrixIcons.Folder,
    style = DialogStyle(shape = ShapeRole.ExtraSmall, maxWidth = 360.dp, iconSize = 40.dp),
    actions = {
        PantrixButton(
            text = "Cancel",
            onClick = { open = false },
            variant = ButtonVariant.Text,
            tagKey = "cancel_share_folder"
        )
        PantrixButton(text = "Share", onClick = { open = false }, tagKey = "confirm_share_folder")
    },
    tagKey = "share_folder"
)
```

### In a part in another theme

A part in the opposite colours to the page, and a dialog opened from inside it. The part is a second theme (`PantrixTheme(darkTheme = …)`); the dialog is called inside that theme too, so it is in its colours: a dark dialog opens on a light page, and a light one on a dark page.

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
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixButton(text = "Open from this part", onClick = { open = true }, tagKey = "open_in_part")
        }
    }
    PantrixDialog(
        visible = open,
        onDismissRequest = {
            open = false
            report("The part's dialog closed")
        },
        title = "Save changes?",
        message = "If you don't save, what you did in this part will be lost.",
        actions = {
            PantrixButton(
                text = "Don't save",
                onClick = {
                    open = false
                    report("Changes discarded")
                },
                variant = ButtonVariant.Text,
                tagKey = "discard"
            )
            PantrixButton(
                text = "Save",
                onClick = {
                    open = false
                    report("Changes saved")
                },
                tagKey = "save"
            )
        },
        tagKey = "save_changes"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A dialog that stays in the tree as it closes

A dialog that is closed composes nothing; so it stays in the tree with `visible = false`, and leaves with the theme's motion as it closes. The first dialog is like this.

The second is inside an `if`: when it closes it leaves the composition and is gone at once, without the motion. The exit motion is all that is lost. Close the two in turn and watch them leave; in a theme with reduced motion both are gone at once.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var kept by rememberSaveable { mutableStateOf(false) }
var removed by rememberSaveable { mutableStateOf(false) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Stays in the tree",
        onClick = { kept = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_kept"
    )
    PantrixButton(
        text = "Taken out of the tree",
        onClick = { removed = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_removed"
    )
}
PantrixDialog(
    visible = kept,
    onDismissRequest = { kept = false },
    title = "Leaves with motion",
    message = "In the tree while closed too: once visible = false, it leaves with the theme's motion.",
    actions = { PantrixButton(text = "Close", onClick = { kept = false }, tagKey = "close_kept") },
    tagKey = "kept"
)
if (removed) {
    PantrixDialog(
        visible = true,
        onDismissRequest = { removed = false },
        title = "Gone at once",
        message = "Leaves the composition when it closes: the exit motion does not play.",
        actions = { PantrixButton(text = "Close", onClick = { removed = false }, tagKey = "close_removed") },
        tagKey = "removed"
    )
}
```

## API

### PantrixDialog

`import com.pantrixui.components.overlay.dialog.PantrixDialog`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDialog(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    title: String? = null,
    actions: @Composable RowScope.() -> Unit,
    modifier: Modifier = Modifier,
    message: String? = null,
    icon: ImageVector? = null,
    dismissible: Boolean = true,
    style: DialogStyle? = null,
    colors: DialogColors? = null,
    tagKey: String? = null,
    content: (@Composable ColumnScope.() -> Unit)? = null
)
```

A decision or a message that stops the app until the user deals with it.

The dialog sits in the middle of the window, above a scrim, and is modal on every platform: nothing behind it takes a click, Tab never leaves it, and on Android TalkBack stays inside it. It is shown while `visible` is true and enters and leaves with the theme's motion; it never hides itself. Back, Escape and a click on the scrim call `onDismissRequest` unless `dismissible` is false. The actions the caller puts in `actions` call only their own `onClick`: an action that ends the dialog sets `visible` to false there.

A keyboard user starts on the first control, usually the first action, so put the safe choice first: "Cancel" before "Delete". The title is announced when the dialog appears and is its heading. A dialog without one, a `title` that is null or blank, has nothing in its place: what it holds starts at the top.

**Close it to see it leave.** A dialog that has closed composes nothing, so leaving it in the tree with `visible = false` is free, and it leaves with the theme's motion. An open one that is taken out of the composition is gone without it, and that is all it costs: its window is composed at the root of the window around it, so a layout that throws its content away while it measures closes no layer that is still being measured.

It looks the same on every platform; what differs is in `DialogStyle`: the corners, the widths and the shadow. A dialog of a title, a message and actions is as wide as its widest part, between the style's two widths: a short question is narrow, and a long message wraps at the widest. A dialog that holds `content` is as wide as it may be, so that a field or a list in it has room.

Parameters:

- `visible: Boolean`: whether the dialog is shown. It enters and leaves with the theme's motion.
- `onDismissRequest: () -> Unit`: called for back, Escape and a click on the scrim while `dismissible`. The dialog stays until `visible` is false.
- `title: String?`: what the dialog is about, as a short question or statement: "Delete this file?". Null or blank for none: no line is kept for it, and a screen reader announces no name when the dialog appears.
- `actions: @Composable RowScope.() -> Unit`: end-aligned buttons, which wrap onto another line when they do not fit. They keep their own test tags.
- `modifier: Modifier`: applied to the dialog itself. The margin it keeps to the window is no part of it.
- `message: String?`: the explanation under the title. It scrolls with `content` when the window is short.
- `icon: ImageVector?`: a decorative icon above the title, which then centres.
- `dismissible: Boolean`: whether back, Escape and a click on the scrim ask to close. Turn it off only when the user must choose one of `actions`.
- `style: DialogStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: DialogColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `tagKey: String?`: a locale-independent key for automation: the dialog's tag is `Dialog_<tagKey>`, on the dialog as it is drawn.
- `content: (@Composable ColumnScope.() -> Unit)?`: anything else the dialog holds, under the message: a form field, a list of choices.

### DialogStyle

`import com.pantrixui.components.overlay.dialog.DialogStyle`, from `com.pantrixui:components`

```kotlin
class DialogStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<DialogStyle>
```

`PantrixDialog`'s geometry.

The padding and the gaps between the title, the message and the actions come from the theme's spacing, so they follow density, and so do the narrowest width and the margin. The widest width, the corners, the shadow and the icon do not. A dialog's colours are not part of its style: they are the theme's, and `DialogColors` where a call has its own.

Parameters:

- `shape: ShapeSpec`: The dialog's corners: large on Android and iOS, medium on desktop and the web.
- `minWidth: Dp`: The narrowest the dialog gets, however short its title, its message and its actions are.
- `maxWidth: Dp`: The widest the dialog gets: longer text wraps. A dialog that holds content of the caller's is this wide.
- `margin: Dp`: Kept clear between the dialog and the window's edges, so the scrim still shows around it in a small window. A window narrower than `minWidth` and two margins gives the dialog what is left.
- `elevation: Dp`: How high the dialog floats over the scrim, which is how large its shadow is. None on iOS.
- `iconSize: Dp`: The size of the icon above the title.

### DialogColors

`import com.pantrixui.components.overlay.dialog.DialogColors`, from `com.pantrixui:components`

```kotlin
data class DialogColors(
    public val container: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val message: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

What a `PantrixDialog` is painted with, for a call that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixDialog(…, colors = DialogColors(icon = PantrixTheme.colors.danger.color))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the title, the message and the icon, unless those are given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The dialog's fill. The theme's `surface`.
- `title: Color`: The title. The theme's `textPrimary`.
- `message: Color`: The message under the title. The theme's `textSecondary`.
- `icon: Color`: The icon above the title. The primary role's `color`.
- `scrim: Color`: The dimming laid over the app behind the dialog, with its own alpha. The theme's `scrim`.
