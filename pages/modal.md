# Modal

A modal layer of the app's own: a scrim over the whole window, and over it content the app draws. It is the layer the dialog and the command palette stand on, for a layer neither of them draws: a search with filters of its own, a picture shown large, an editor that fills a phone's screen.

- `PantrixModal` (`com.pantrixui.components.overlay.modal`, `com.pantrixui:components`): A modal layer of the app's own over a scrim, in the middle of the window or near its top: back, Escape and the scrim dismiss it, the focus stays inside it, and it keeps to one half of a fold. Keywords: overlay, scrim, lightbox, custom dialog, focus trap, full screen modal, backdrop.

## Features

- **It never closes itself.** Back, Escape and a press on the scrim call `onDismissRequest`; the caller turns `visible` off. The content enters and leaves with the theme's motion; once it has closed, nothing of the modal is drawn.
- **The focus stays inside.** Opened from the keyboard, the focus moves to the content's first control, and Tab goes round inside it and never reaches the app under it; opened by touch, the focus stays where it was, and no software keyboard opens unasked. Once it closes, the focus is back where it was.
- **Its place.** `position` puts the content in the middle of the window or at its top: `Top`, for a search whose field stays where it is. `margin` is the room left between the content and the window's safe area; it is part of the scrim.
- **A page of its own.** A `margin` of none, content that fills itself and a `scrimColor` that is the theme's background make the modal a page on a phone.
- **Screen reader.** `paneTitle` is read as the modal opens; the scrim is one "Close" action, after the content.
- **A fold.** Where a fold divides the window in two, the content keeps to the half it was opened from; a modal opened inside a picture of a window takes that picture for its window.

## Usage

### A search of the app's own, near the top

```kotlin
var searching by rememberSaveable { mutableStateOf(false) }
PantrixModal(
    visible = searching,
    onDismissRequest = { searching = false },
    position = ModalPosition.Top,
    paneTitle = stringResource(Res.string.search),
    tagKey = "search"
) {
    PantrixSurface(Modifier.widthIn(max = 640.dp), shape = PantrixTheme.shapes.lg, elevation = 8.dp) {
        SearchPanel(onOpen = { searching = false })
    }
}
```

### A page of its own on a phone

```kotlin
PantrixModal(
    visible = editing,
    onDismissRequest = { editing = false },
    margin = PaddingValues(),
    paneTitle = stringResource(Res.string.edit_note),
    scrimColor = PantrixTheme.colors.background,
    tagKey = "editor"
) {
    NoteEditor(Modifier.fillMaxSize(), onDone = { editing = false })
}
```

## Examples

### A search at the top

A search of your own, at the top of the window: the field stays where it is, and the results grow and shrink under it. Escape, back or a press on the scrim closes it; so does a press on a result.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.modal.ModalPosition
import com.pantrixui.components.overlay.modal.PantrixModal
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var searching by remember { mutableStateOf(false) }
var query by remember { mutableStateOf("") }
PantrixButton(
    text = "Open the search",
    onClick = { searching = true },
    variant = ButtonVariant.Outline,
    tagKey = "search"
)
PantrixModal(
    visible = searching,
    onDismissRequest = { searching = false },
    position = ModalPosition.Top,
    paneTitle = "Search",
    tagKey = "search"
) {
    PantrixSurface(Modifier.widthIn(max = 560.dp), shape = PantrixTheme.shapes.lg, elevation = 8.dp) {
        Column(Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = "Search for a page",
                // The name a screen reader gives a field that has no label.
                contentDescription = "Search pages",
                tagKey = "search_query"
            )
            // Each result's key is its place in the list, never its words.
            PAGES.withIndex().filter { it.value.contains(query, ignoreCase = true) }.forEach { (index, page) ->
                PantrixListItem(
                    headline = page,
                    leading = { PantrixIcon(PantrixIcons.File, contentDescription = null) },
                    onClick = { searching = false },
                    tagKey = "result_$index"
                )
            }
        }
    }
}

private val PAGES = listOf("Installation", "Themes", "Components", "Guides", "Changelog")
```

### A page of its own

A page on a phone: a `margin` of none, a scrim in the theme's background and content that fills itself. Behind the window's bars stays the background's colour too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.components.overlay.modal.PantrixModal
import com.pantrixui.foundation.theme.PantrixTheme

var editing by remember { mutableStateOf(false) }
var note by remember { mutableStateOf("Monday: go over the design") }
PantrixButton(text = "Edit the note", onClick = { editing = true }, variant = ButtonVariant.Outline, tagKey = "edit")
PantrixModal(
    visible = editing,
    onDismissRequest = { editing = false },
    margin = PaddingValues(),
    paneTitle = "Note",
    scrimColor = PantrixTheme.colors.background,
    tagKey = "editor"
) {
    Column(
        Modifier.fillMaxSize().padding(PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = "Note", style = PantrixTheme.typography.title, modifier = Modifier.weight(1f))
            PantrixButton(text = "Done", onClick = { editing = false }, tagKey = "done")
        }
        PantrixTextArea(value = note, onValueChange = { note = it }, label = "Note", tagKey = "note")
    }
}
```

### One that asks for a decision

A modal that does not close before a decision is made: a press on the scrim and back do nothing (`dismissOnScrimClick` and `dismissOnBack` are off); one of the two buttons in it is chosen.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.modal.PantrixModal
import com.pantrixui.foundation.theme.PantrixTheme

var asking by remember { mutableStateOf(false) }
var answer by remember { mutableStateOf("Not chosen yet") }
PantrixButton(
    text = "Show the terms",
    onClick = { asking = true },
    variant = ButtonVariant.Outline,
    tagKey = "terms"
)
PantrixText(text = answer, style = PantrixTheme.typography.footnote, tagKey = "answer")
PantrixModal(
    visible = asking,
    onDismissRequest = { asking = false },
    paneTitle = "Terms of use",
    dismissOnScrimClick = false,
    dismissOnBack = false,
    tagKey = "decision"
) {
    PantrixSurface(Modifier.widthIn(max = 420.dp), shape = PantrixTheme.shapes.lg) {
        Column(
            Modifier.padding(PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
        ) {
            PantrixText(text = "Accept the terms of use to go on.")
            Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                PantrixButton(
                    text = "Accept",
                    onClick = {
                        answer = "Accepted"
                        asking = false
                    },
                    tagKey = "accept"
                )
                PantrixButton(
                    text = "Decline",
                    onClick = {
                        answer = "Declined"
                        asking = false
                    },
                    variant = ButtonVariant.Outline,
                    tagKey = "decline"
                )
            }
        }
    }
}
```

## API

### PantrixModal

`import com.pantrixui.components.overlay.modal.PantrixModal`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixModal(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    position: ModalPosition = ModalPosition.Center,
    margin: PaddingValues = PaddingValues(PantrixTheme.spacing.xl),
    paneTitle: String? = null,
    dismissOnScrimClick: Boolean = true,
    dismissOnBack: Boolean = true,
    scrimColor: Color = PantrixTheme.colors.scrim,
    tagKey: String? = null,
    content: @Composable () -> Unit
)
```

A modal layer of the app's own: a scrim over the whole window, and over it content the app draws, with everything a modal of Pantrix does. It is what `PantrixDialog` and `PantrixCommandPalette` stand on, for a layer neither of them draws: a search with filters of its own, a picture shown large, an editor that fills a phone.

```kotlin
var searching by rememberSaveable { mutableStateOf(false) }
PantrixModal(
    visible = searching,
    onDismissRequest = { searching = false },
    position = ModalPosition.Top,
    paneTitle = stringResource(Res.string.search)
) {
    PantrixSurface(Modifier.widthIn(max = 640.dp), shape = PantrixTheme.shapes.lg) { SearchPanel() }
}
```

The modal never hides itself. Back, Escape and a press on the scrim call `onDismissRequest`, and the caller sets `visible` to false; the content leaves with the theme's motion, and once it has gone nothing of the modal is composed. It enters a frame after its window has first drawn, so that the motion is seen.

Focus follows the WAI-ARIA dialog pattern. Opened from the keyboard, the modal moves the focus to the first control of the content, and Tab then goes round inside it and never reaches the app under it; opened by touch, the focus stays where it was, so that no software keyboard rises unasked. Once the modal has closed the focus is where it was. Under the modal the app draws no focus ring. A screen reader hears `paneTitle` as the modal appears, then the content, and last the scrim, as one action called by the theme's word for closing where a press on it dismisses.

The modal gives its content no fill, no shape and no width: the content draws itself, as large as it is, in the room `margin` leaves. Where a fold divides the window, the content keeps to the half it was opened from; opened inside a `PantrixWindowFrame`, the modal takes the frame for its window.

Parameters:

- `visible: Boolean`: whether the modal is shown. Set to false, the content leaves with its motion, and then nothing is composed.
- `onDismissRequest: () -> Unit`: called when the user asks to close the modal: back, Escape, or a press on the scrim.
- `modifier: Modifier`: applied to the content, inside `margin`: the node it tags is the content as it is drawn, and a press anywhere on it is the content's, never the scrim's.
- `position: ModalPosition`: where the content sits: in the middle of the window, or near its top.
- `margin: PaddingValues`: the room kept between the content and the window's safe area, side by side. It is part of the scrim: a press in it, right beside the content, dismisses as one anywhere else on the scrim does. None, with content that fills what it is given, makes the content the whole safe area, as an editor on a phone is.
- `paneTitle: String?`: what a screen reader announces as the modal appears: what it is, in a word or two.
- `dismissOnScrimClick: Boolean`: whether a press on the scrim asks to dismiss. Where it does not, the scrim is a fill a screen reader passes over.
- `dismissOnBack: Boolean`: whether back and Escape ask to dismiss.
- `scrimColor: Color`: what is drawn over the app while the modal is shown, fading with the content: the theme's scrim unless given. The theme's background makes the modal a page of its own, the window's bars and all.
- `tagKey: String?`: the modal's automation key: the content is `Modal_<tagKey>`. A dismissal is reported as a `Modal` event, `dismiss`, which says whether it came by the scrim or by back.
- `content: @Composable () -> Unit`: what the modal shows, drawn by the app.

### ModalPosition

`import com.pantrixui.components.overlay.modal.ModalPosition`, from `com.pantrixui:components`

```kotlin
enum class ModalPosition
```

Where `PantrixModal`'s content sits in the window, which also says how it enters and leaves.

Entries:

- `Center`: In the middle of the window's safe area, fading and growing in, as a dialog does.
- `Top`: Near the top of the window's safe area, in the middle across, fading and growing in: a search or a palette, whose field stays where it is while what is under it grows and shrinks.
