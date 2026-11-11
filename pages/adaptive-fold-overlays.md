# Overlays on a fold

Overlays on a foldable device: a dialog, a sheet, a popover, a menu, a command palette and a snackbar stay in a half of the fold, and none lies across it.

The rules are in the overlays' shared code; the components need no new parameter. They hold while a foldable is held half open, or where a hinge stands between two screens; a foldable opened flat is a screen in one piece.

## Features

- **Dialog.** It is in the middle of the half it was opened from: the half of the last press, or of the focused control where it was opened with the keyboard. Where neither is known, the start half in a book, and the lower half on a table: that is where the hands are.
- **Sheets.** On a table a bottom sheet takes the lower half, and a full-screen sheet all of it. In a book a bottom sheet is in the half it was opened from, as wide as that half; a side sheet is exactly the end half, from the fold's strip to the window's end.
- **Anchored overlays.** A popover, a menu, a tooltip and a select's list stay in the half of the control they are anchored to: where they do not fit, they first take the other side, then slide, and last get smaller and scroll.
- **Command palette.** In a book it is in the half it was opened from, as a dialog is; on a table it is in the upper half, no taller than it.
- **Snackbar.** In a book a snackbar keeps to a half: one in the end corner to the end half, the others to the start half. A snackbar as wide as a phone's window would reach past the fold in a corner too.
- **Overlays opened in a frame.** "Book" and "Table" on this page are a window frame drawn inside the card (`PantrixWindowFrame`): an overlay opened inside it takes the frame for its window. The scrim covers the frame, a sheet comes in from the frame's edges and the fold is the frame's; in a frame drawn smaller the overlay is drawn smaller too.
- **A hinge that hides.** On a device of two screens `Modifier.keepClearOfFolds()` keeps content off the strip of the hinge that hides the screen: beside a hinge near a node's edge the other side is left empty.
- **Your own overlay.** `rememberOverlayWindow()` tells an overlay its window, the folds and where it was opened from: an app that shows a `Dialog` or a `Popup` of its own places it by the same rules.

## Examples

### A dialog in the half it was opened from

A button in each of two corners opens the same dialog. In "Book" the left button opens it in the left half and the right one in the right half; in "Table" the upper one in the upper half and the lower one in the lower half. In a flat window the dialog is always in the middle.

In "Book" and "Table" the example is as tall as the window: the fold crosses it, and the dialog opens in a half of the window.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var open by remember { mutableStateOf(false) }
Box(Modifier.fillMaxWidth().height(foldExampleHeight()).padding(PantrixTheme.spacing.md)) {
    PantrixButton(
        text = "Open from here",
        onClick = { open = true },
        modifier = Modifier.align(Alignment.TopStart),
        tagKey = "fold_dialog_start"
    )
    PantrixButton(
        text = "Open from here",
        onClick = { open = true },
        modifier = Modifier.align(Alignment.BottomEnd),
        tagKey = "fold_dialog_end"
    )
}
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Delete this file?",
    message = "The file is removed from every device. This cannot be undone.",
    actions = {
        PantrixButton(
            text = "Cancel",
            onClick = { open = false },
            variant = ButtonVariant.Outline,
            tagKey = "fold_dialog_cancel"
        )
        PantrixButton(text = "Delete", onClick = { open = false }, tagKey = "fold_dialog_delete")
    },
    tagKey = "fold_dialog"
)

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### A popover and a menu beside the fold

The popover of a button just before the fold asks to open on its right; in "Book" its right is the other side of the fold, so it opens on its left. The menu of a button just above the fold asks to open below it; in "Table" below it is the other side of the fold, so it opens above.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.foundation.theme.PantrixTheme

var details by remember { mutableStateOf(false) }
var actions by remember { mutableStateOf(false) }
Box(Modifier.fillMaxWidth().height(foldExampleHeight())) {
    Box(Modifier.align(Alignment.Center).offset(x = (-56).dp, y = (-56).dp)) {
        PantrixPopover(
            visible = details,
            onDismissRequest = { details = false },
            anchor = {
                PantrixButton(text = "Delivery", onClick = { details = !details }, tagKey = "fold_popover_anchor")
            },
            side = PopoverSide.End,
            title = "Delivery status",
            tagKey = "fold_popover"
        ) {
            PantrixText("It arrives on Tuesday between nine and twelve; the courier calls ten minutes ahead.")
        }
    }
    Box(Modifier.align(Alignment.Center).offset(x = 96.dp, y = (-56).dp)) {
        PantrixMenu(
            visible = actions,
            onDismissRequest = { actions = false },
            anchor = {
                PantrixButton(
                    text = "Actions",
                    onClick = { actions = !actions },
                    variant = ButtonVariant.Outline,
                    tagKey = "fold_menu_anchor"
                )
            },
            tagKey = "fold_menu"
        ) {
            PantrixMenuItem(text = "Copy", onClick = {}, tagKey = "fold_menu_copy")
            PantrixMenuItem(text = "Share", onClick = {}, tagKey = "fold_menu_share")
            PantrixMenuItem(text = "Rename", onClick = {}, tagKey = "fold_menu_rename")
            PantrixMenuItem(text = "Delete", onClick = {}, destructive = true, tagKey = "fold_menu_delete")
        }
    }
}

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### Sheets at the fold

Three buttons open three sheets. In "Table" the bottom sheet and the full-screen sheet both stay below the fold, and so does the side sheet. In "Book" the bottom sheets open in the buttons' half, as wide as that half; the side sheet is exactly the right half.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

// Which sheet was opened is kept while it closes: a side sheet that closes leaves by the side, not the bottom.
var open by remember { mutableStateOf(false) }
var kind by remember { mutableStateOf(FoldSheet.Bottom) }
val show = { sheet: FoldSheet ->
    kind = sheet
    open = true
}
Column(
    modifier = Modifier.fillMaxWidth().height(foldExampleHeight()).padding(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Bottom sheet", onClick = { show(FoldSheet.Bottom) }, tagKey = "fold_sheet_bottom")
    PantrixButton(
        text = "Full-screen sheet",
        onClick = { show(FoldSheet.FullScreen) },
        variant = ButtonVariant.Outline,
        tagKey = "fold_sheet_full"
    )
    PantrixButton(
        text = "Side sheet",
        onClick = { show(FoldSheet.Side) },
        variant = ButtonVariant.Outline,
        tagKey = "fold_sheet_side"
    )
}
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Sort by",
    edge = if (kind == FoldSheet.Side) SheetEdge.End else SheetEdge.Bottom,
    fullScreen = kind == FoldSheet.FullScreen,
    tagKey = "fold_sheet"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        listOf("Newest", "Oldest", "By name", "By size").forEachIndexed { index, order ->
            PantrixButton(
                text = order,
                onClick = { open = false },
                modifier = Modifier.fillMaxWidth(),
                variant = ButtonVariant.Subtle,
                tagKey = "order_$index"
            )
        }
    }
}

private enum class FoldSheet { Bottom, FullScreen, Side }

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### A command palette and a snackbar

In "Table" the command palette opens above the fold, no taller than the upper half: a long list scrolls. "Save" shows a snackbar; here the snackbar is in the middle of the bottom edge on every platform, and in "Book" it moves to the middle of the left half.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.components.overlay.snackbar.PantrixSnackbarHost
import com.pantrixui.components.overlay.snackbar.SnackbarPlacement
import com.pantrixui.components.overlay.snackbar.SnackbarStyle
import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

var palette by remember { mutableStateOf(false) }
val snackbars = rememberPantrixSnackbarState()
val scope = rememberCoroutineScope()
Box(Modifier.fillMaxWidth().height(foldExampleHeight())) {
    Column(
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Command palette", onClick = { palette = true }, tagKey = "fold_palette_open")
        PantrixButton(
            text = "Save",
            onClick = {
                scope.launch { snackbars.show(message = "Changes saved", tagKey = "fold_saved") }
            },
            variant = ButtonVariant.Outline,
            tagKey = "fold_save"
        )
    }
    PantrixSnackbarHost(snackbars, style = SnackbarStyle(placement = SnackbarPlacement.BottomCenter))
}
PantrixCommandPalette(
    visible = palette,
    onDismissRequest = { palette = false },
    commands = FoldCommands,
    onRun = { palette = false },
    placeholder = "Search for a command",
    tagKey = "fold_palette"
)

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FoldCommands = listOf(
    PantrixCommand(key = "new", label = "New file"),
    PantrixCommand(key = "open", label = "Open file"),
    PantrixCommand(key = "save", label = "Save"),
    PantrixCommand(key = "share", label = "Share"),
    PantrixCommand(key = "print", label = "Print"),
    PantrixCommand(key = "rename", label = "Rename"),
    PantrixCommand(key = "duplicate", label = "Duplicate"),
    PantrixCommand(key = "move", label = "Move"),
    PantrixCommand(key = "archive", label = "Archive"),
    PantrixCommand(key = "delete", label = "Delete")
)

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### Your own overlay: rememberOverlayWindow

An app that shows a `Dialog` or a `Popup` of its own gets what Pantrix's overlays place themselves by from `rememberOverlayWindow()`: the overlay's window (here the card's frame), the folds and where it was opened from. Press the button in either corner: the text in the middle says which side of the fold the last press was on, and in which half an overlay of your own opens. Left and right in "Book", upper and lower in "Table"; a flat window has no fold.

`openedFrom()` and the places of the folds are in the same coordinates, the pixels of the app's window: the two are compared directly.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.OverlayWindow
import com.pantrixui.foundation.adaptive.rememberOverlayWindow
import com.pantrixui.foundation.theme.PantrixTheme

val overlay = rememberOverlayWindow()
var said by remember { mutableStateOf("Press the button in a corner.") }
Box(Modifier.fillMaxWidth().height(foldExampleHeight()).padding(PantrixTheme.spacing.md)) {
    PantrixButton(
        text = "From here",
        onClick = { said = halfOpenedFrom(overlay) },
        modifier = Modifier.align(Alignment.TopStart),
        tagKey = "fold_own_start"
    )
    PantrixText(text = said, modifier = Modifier.align(Alignment.Center), tagKey = "fold_own_said")
    PantrixButton(
        text = "From here",
        onClick = { said = halfOpenedFrom(overlay) },
        modifier = Modifier.align(Alignment.BottomEnd),
        tagKey = "fold_own_end"
    )
}

internal fun halfOpenedFrom(overlay: OverlayWindow): String {
    val from = overlay.openedFrom() ?: return "Nothing has been pressed yet."
    val fold = overlay.folds.firstOrNull { it.isSeparating }
        ?: return "This window has no fold: the overlay opens in the middle of the window."
    val vertical = fold.orientation == FoldOrientation.Vertical
    return when {
        vertical && from.x < fold.bounds.center.x -> "Pressed left of the fold: the overlay opens in the left half."
        vertical -> "Pressed right of the fold: the overlay opens in the right half."
        from.y < fold.bounds.center.y -> "Pressed above the fold: the overlay opens in the upper half."
        else -> "Pressed below the fold: the overlay opens in the lower half."
    }
}

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### keepClearOfFolds on a device of two screens

A device of two screens, with a hinge between them that hides what is under it. The order card is two thirds of the device's width and runs over the hinge. With `keepClearOfFolds()` on, the card stays on the left screen and the other side of the hinge is empty; with it off, part of the text is under the hinge.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.PantrixWindow
import com.pantrixui.foundation.adaptive.PantrixWindowFrame
import com.pantrixui.foundation.adaptive.WindowFold
import com.pantrixui.foundation.adaptive.WindowPosture
import com.pantrixui.foundation.adaptive.keepClearOfFolds
import com.pantrixui.foundation.theme.PantrixTheme

var keepClear by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixSwitchButton(
        checked = keepClear,
        onCheckedChange = { keepClear = it },
        label = "keepClearOfFolds()",
        tagKey = "fold_keep_clear"
    )
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val width = maxWidth.coerceAtMost(DUAL_SCREEN_WIDTH)
        val density = LocalDensity.current
        val window = remember(width, density) { dualScreenWindow(DpSize(width, DUAL_SCREEN_HEIGHT), density) }
        PantrixWindowFrame(
            window = window,
            modifier = Modifier.size(width, DUAL_SCREEN_HEIGHT).border(1.dp, PantrixTheme.colors.border)
        ) {
            PantrixCard(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(width * 2 / 3)
                    .then(if (keepClear) Modifier.keepClearOfFolds() else Modifier),
                variant = CardVariant.Outlined
            ) {
                PantrixText("Order 1042", style = PantrixTheme.typography.title)
                PantrixText("Three items, delivered on Tuesday. No delivery charge; the invoice came by email.")
            }
            Hinge(window)
        }
    }
}

internal fun dualScreenWindow(
    size: DpSize,
    density: Density
): PantrixWindow = with(density) {
    val left = (size.width / 2 - HINGE_WIDTH / 2).toPx()
    val right = (size.width / 2 + HINGE_WIDTH / 2).toPx()
    val hinge = WindowFold(
        bounds = Rect(left = left, top = 0f, right = right, bottom = size.height.toPx()),
        orientation = FoldOrientation.Vertical,
        isHalfOpened = false,
        isSeparating = true,
        isOccluding = true
    )
    PantrixWindow(size, posture = WindowPosture(listOf(hinge)))
}

@Composable
private fun Hinge(window: PantrixWindow) {
    val hinge = window.posture.folds.first().bounds
    val density = LocalDensity.current
    with(density) {
        Box(
            Modifier
                .offset(x = hinge.left.toDp())
                .size(width = hinge.width.toDp(), height = DUAL_SCREEN_HEIGHT)
                .background(PantrixTheme.colors.textPrimary)
        )
    }
}

private val DUAL_SCREEN_WIDTH = 520.dp

private val DUAL_SCREEN_HEIGHT = 200.dp

private val HINGE_WIDTH = 16.dp
```

## API

### OverlayWindow

`import com.pantrixui.foundation.adaptive.OverlayWindow`, from `com.pantrixui:foundation`

```kotlin
class OverlayWindow
```

The window an overlay opened here is shown over, as an overlay that keeps off a fold places itself by: where that window is, its folds, and where the overlay was opened from.

It is the window the app is in, or the `PantrixWindowFrame` the content is drawn in. An overlay opened inside a frame takes the frame for its window, as a dialog opened in a preview of a foldable opens in that preview: its scrim covers the frame, a sheet comes in from the frame's edges and a fold is the frame's. The room a scaffold tells one of its panes as its window is not such a window: a dialog opened in a pane is shown over the window the pane is in.

Pantrix's own overlays place themselves by it. An overlay of the app's own, a `Dialog` or a `Popup` it shows itself, does as well:

```kotlin
val overlay = rememberOverlayWindow()
// Asked as the dialog opens: where it was opened from, and the fold the window is in two pieces at.
val openedFrom = remember { overlay.openedFrom() }
val fold = overlay.folds.firstOrNull { it.isSeparating }
val onTheLeft = fold != null && openedFrom != null && openedFrom.x < fold.bounds.center.x
```

Its places are in the coordinates of the window the app is in, and in pixels: where a `Dialog` that fills that window places what it holds. An overlay that is a window of its own beside the app's, as a popup is on Android, moves them by where the app's window is on the screen.

Members:

- `window: PantrixWindow`: The window the overlay is shown over, as what the overlay shows is to be told of it: the frame's, and otherwise the one the outermost `PantrixTheme` stands for. Not the room of a pane the overlay was opened in.
- `frame: Rect?`: Where the frame is seen, as it is drawn: its bounds in the window the app is in, in pixels, cut to what of it is in view. A frame partly scrolled out of its page is the part still seen, and an overlay over it covers no more: not what the page's bar stands over. Null over the window the app is in, which an overlay covers whole, and until the frame has been placed.

  It is where the frame is now: an overlay that follows the frame as it moves asks again.
- `scale: Float`: How large the frame is drawn: the share of its own size it is drawn at, less than 1 in a layer that draws it smaller. An overlay over it is drawn as much smaller, as what the frame holds is. It is 1 over the window the app is in.
- `folds: List<WindowFold>`: The window's folds, where they are in the window the app is in: their bounds and their clearance in pixels, drawn as much smaller as a frame drawn smaller is. A frame that has not been placed has none yet.
- `fun openedFrom(): Offset?`: Where an overlay opened now is opened from, in the window the app is in and in pixels: where the last press in the window landed, and where a key was pressed after it, the middle of the control that has the focus. Null where neither is known, as for an overlay that opens before anything has been pressed.

  It is asked once, as the overlay opens: a press inside the overlay is where the next one is opened from. It is heard at the roots of the window's layers: the outermost `PantrixTheme`'s, and the node of an overlay that carries `pantrixTransientsRoot`.

### rememberOverlayWindow

`import com.pantrixui.foundation.adaptive.rememberOverlayWindow`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberOverlayWindow(): OverlayWindow
```

The window an overlay opened here is shown over: the `PantrixWindowFrame` the content is drawn in, or the window the app is in.

### Modifier.keepClearOfFolds

`import com.pantrixui.foundation.adaptive.keepClearOfFolds`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.keepClearOfFolds(): Modifier
```

Keeps what this node holds off a hinge that hides a strip of the window, where one crosses the node: the side of the hinge where the node has less room is left empty, and what the node holds is laid out on the other.

A device of two screens has such a hinge between them (`WindowFold.isOccluding`), and what is drawn under it is not seen. A node that reaches a little past it, a list a little wider than one screen or a bar along a whole edge, puts what it holds on the screen it mostly lies on. A fold that hides nothing, a foldable's, which is one screen however it is held, is not kept clear of: what is drawn across it is seen.

```kotlin
Box(Modifier.fillMaxSize()) {
    Inbox()
    // A bar along the whole bottom edge keeps to one screen of the two.
    Toolbar(Modifier.align(Alignment.BottomCenter).fillMaxWidth().keepClearOfFolds())
}
```

Where a hinge runs through the middle of a node, keeping clear of it halves the node: `PantrixTwoPane` lays out what a node holds on both sides of it instead. Here the node keeps to one side, the start one where both have as much room.

The node is measured by the place it was given when it was last placed: as it is placed again after moving, across a hinge or off it, it is measured again. Along the axis a hinge it keeps clear of crosses, it takes all the room it is given, whatever its content's size: otherwise the empty side would make it larger, and so further across the hinge, at each pass. In a room that is not bounded along that axis, as in a row that scrolls, it keeps clear of nothing.
