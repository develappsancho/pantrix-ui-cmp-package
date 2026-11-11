# Building blocks

The building blocks the library's components are built on: an app that writes its own layer, its own hint or its own control uses them too.

## Features

- **Portal.** `PantrixPortal { … }` composes its content at a root of the window, not where it is called: for a `Popup` or a `Dialog`. A layout that throws its content away while it measures cannot close the layer in the middle of a measurement.
- **Modal layer.** `PantrixModalLayer { … }` says its content is a layer that takes the keys and the presses until it closes: the focus rings under it are hidden (`PantrixTheme.isUnderModal`).
- **Comes up by itself.** `PantrixTransient(shown, onDismiss)` says something came up that no one opened, as a hint does: Escape puts it away wherever the focus is. A layer hears Escape inside itself with `pantrixTransientsRoot()`.
- **Automation root.** `Modifier.pantrixAutomationRoot()` opens the tags under it to the platform's automation. The theme does so for the app's window, and Pantrix's overlays for their own windows; the root of a `Popup` or a `Dialog` of your own, a window of its own on Android, carries it too.
- **Press indication.** `pantrixPressIndication()` draws a light veil in the content colour while pressed, `pantrixPressIndicationWithColor(color)` in the colour given; both are a `PantrixPressIndication`.
- **Conditional modifier.** `thenIfElse(condition, ifTrue, ifFalse)` goes on with a modifier chain by a condition.
- **Scroll bar.** `Modifier.pantrixVerticalScroll(state)` scrolls a column with Pantrix's scroll bar, and `Modifier.pantrixScrollBar(listState)` gives a lazy list its bar.

## Examples

### Your own layer

Your own layer: the button opens a `Popup` in the middle of the window. The popup is composed through a portal (`PantrixPortal`), its content is a modal layer (`PantrixModalLayer`), and it hears Escape inside itself (`pantrixTransientsRoot()`). While the layer is open the page's focus rings under it are not shown: the line under the button writes that the page is under a modal (`PantrixTheme.isUnderModal`). The layer's own content is not under it.

On Android the popup is a window of its own: the theme's mark that opens the tags to automation does not reach it. The layer's root says so itself (`pantrixAutomationRoot()`): a Maestro flow finds the "Close" button as `Button_close_layer`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.PantrixModalLayer
import com.pantrixui.foundation.overlay.PantrixPortal
import com.pantrixui.foundation.overlay.pantrixTransientsRoot
import com.pantrixui.foundation.testing.pantrixAutomationRoot
import com.pantrixui.foundation.theme.PantrixTheme

var open by remember { mutableStateOf(false) }
PantrixButton(text = "Open the layer", onClick = { open = true }, variant = ButtonVariant.Outline, tagKey = "open_layer")
PantrixText(
    text = "Is the page under a modal: ${if (PantrixTheme.isUnderModal) "yes" else "no"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
if (open) {
    PantrixPortal {
        Popup(
            alignment = Alignment.Center,
            onDismissRequest = { open = false },
            properties = PopupProperties(focusable = true)
        ) {
            PantrixModalLayer {
                PantrixSurface(
                    modifier = Modifier.pantrixTransientsRoot().pantrixAutomationRoot(),
                    elevation = PantrixTheme.elevation.xl
                ) {
                    Column(
                        modifier = Modifier.widthIn(max = 280.dp).padding(PantrixTheme.spacing.lg),
                        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
                    ) {
                        PantrixText(text = "The app's own layer", style = PantrixTheme.typography.title)
                        PantrixText(text = "Escape or a press outside closes the layer.")
                        PantrixButton(text = "Close", onClick = { open = false }, tagKey = "close_layer")
                    }
                }
            }
        }
    }
}
```

### A hint that comes up by itself

A hint that comes up by itself. "Show the hint" brings up a hint, and `PantrixTransient` tells the window it is up: press Escape, the hint goes wherever the focus is, and the key goes to nothing else.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.overlay.PantrixTransient
import com.pantrixui.foundation.theme.PantrixTheme

var shown by remember { mutableStateOf(false) }
PantrixTransient(shown = shown, onDismiss = { shown = false })
PantrixButton(
    text = if (shown) "Hide the hint" else "Show the hint",
    onClick = { shown = !shown },
    variant = ButtonVariant.Outline,
    tagKey = "show_hint"
)
if (shown) {
    PantrixSurface(color = PantrixTheme.colors.info.container) {
        PantrixText(
            text = "Press Escape: the hint goes.",
            modifier = Modifier.padding(PantrixTheme.spacing.sm),
            color = PantrixTheme.colors.info.onContainer
        )
    }
}
```

### Press indications and a conditional modifier

Press indications and a conditional border. The three squares are pressed with three indications: in the content colour (`pantrixPressIndication()`), in the brand's colour (`pantrixPressIndicationWithColor`), and with a `PantrixPressIndication` built by hand, red and stronger. Press a square: it is selected and its border thickens with `thenIfElse`.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.primitives.PantrixPressIndication
import com.pantrixui.foundation.primitives.pantrixPressIndication
import com.pantrixui.foundation.primitives.pantrixPressIndicationWithColor
import com.pantrixui.foundation.primitives.thenIfElse
import com.pantrixui.foundation.theme.PantrixTheme

var selected by remember { mutableStateOf(0) }
val colors = PantrixTheme.colors
val shape = PantrixTheme.shapes.md
val indications = listOf(
    pantrixPressIndication(),
    pantrixPressIndicationWithColor(PantrixTheme.colors.primary.color),
    PantrixPressIndication(pressColor = PantrixTheme.colors.danger.color, pressAlpha = 0.3f)
)
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    indications.forEachIndexed { index, indication ->
        Box(
            modifier = Modifier
                .size(72.dp)
                .thenIfElse(
                    condition = index == selected,
                    ifTrue = { border(2.dp, colors.primary.color, shape) },
                    ifFalse = { border(1.dp, colors.border, shape) }
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = indication
                ) { selected = index },
            contentAlignment = Alignment.Center
        ) {
            PantrixText(text = "${index + 1}", style = PantrixTheme.typography.title)
        }
    }
}
```

### A column with a scroll bar

A column taller than its window: a page's text, a settings screen. `Modifier.pantrixVerticalScroll(state)` scrolls it as `verticalScroll` does, and puts Pantrix's scroll bar beside it: the bar Pantrix's own views of documents draw. Its thumb is as long as the share on the screen, and stands where that share is.

Where the reader has a pointer, the bar is there while there is something to scroll; it darkens under the pointer and a mouse drags it. Under a finger it shows only while the content moves, and fades after. It is drawn over the content: the content keeps its width.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.scrollbar.pantrixVerticalScroll
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val scroll = rememberScrollState()
Column(
    modifier = Modifier
        .fillMaxWidth()
        .height(240.dp)
        .border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
        .pantrixVerticalScroll(scroll)
        .padding(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    repeat(times = 24) { index ->
        PantrixText(text = "Paragraph ${index + 1}: the scroll bar stands at the edge of this column's window.")
    }
}
```

### A list with a scroll bar

A lazy list scrolls itself, by its own state, and takes its bar on its own modifier: `Modifier.pantrixScrollBar(listState)`. The list knows the rows on the screen and how many there are, not how tall the others are: the thumb takes them to be as tall as the ones it sees.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.scrollbar.pantrixScrollBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val list = rememberLazyListState()
LazyColumn(
    modifier = Modifier
        .fillMaxWidth()
        .height(240.dp)
        .border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
        .pantrixScrollBar(list),
    state = list,
    contentPadding = PaddingValues(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    items(count = 200) { index -> PantrixText(text = "Order ${index + 1}") }
}
```

## API

### PantrixPortal

`import com.pantrixui.foundation.overlay.PantrixPortal`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixPortal(content: @Composable () -> Unit)
```

Composes `content` at a root of the window, and not where this is called: the place for what is shown over the window as a layer of its own, a `Popup` or a `Dialog`.

Such a layer must not leave the composition while the window is being measured. A layout that composes as it measures, `BoxWithConstraints` or the adaptive box, throws its content away inside a measuring pass when its room crosses a line. Compose Desktop and the web then go on to measure a layer they have just closed, and the application dies with `IllegalArgumentException: RootNodeOwner is already disposed`. Through a portal the layer is composed by the root, which no measuring pass composes: when the caller is thrown away the layer is still there for that frame, and it leaves in the composition of the next.

`content` is composed with the composition locals of the caller, a theme inside the app's own among them, and for as long as the call is. What it remembers and what it saves are kept as they would be in place. It is laid out by the root, at the root's top start corner: only what places itself in the window, as a popup and a dialog do, belongs in one.

The root is the outermost `PantrixTheme`'s. A layer belongs to the window it is opened in, so a caller whose window has no such root composes `content` in place, as if this were not here: content with no theme around it, and on Android what a dialog or a popup holds, which is a window of its own there and is harmed by no measuring pass.

Parameters:

- `content: @Composable () -> Unit`

### PantrixModalLayer

`import com.pantrixui.foundation.a11y.PantrixModalLayer`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixModalLayer(content: @Composable () -> Unit)
```

Says that `content` is a modal overlay's: something shown over the app that takes its keys and its clicks until it closes, as a dialog and a sheet do. While it is composed, `PantrixTheme.isUnderModal` is true for everything else in the window and false in `content`. An overlay opened later lies over an earlier one, whose content is under a modal from then on.

Pantrix's own modal overlays say so themselves. An app's own, built on `Dialog`, puts what it shows in this, around the `Dialog` or inside it, so that what it covers stops looking focused: under a modal the focus stays where it was, to be there again when the modal closes, and a focus ring is drawn only where a key would reach it. On Android that `Dialog` is a window of its own: `com.pantrixui.foundation.testing.pantrixAutomationRoot` on the root of what it shows lets its test tags reach the platform's automation.

The window is the one of the outermost theme around the call: a theme inside another is in the same window, and two themes side by side are in two.

Parameters:

- `content: @Composable () -> Unit`

### PantrixTransient

`import com.pantrixui.foundation.overlay.PantrixTransient`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixTransient(
    shown: Boolean,
    onDismiss: () -> Unit
)
```

Says that something has come up by itself over the window, as a tooltip does: a thing no one opened, which takes no focus, and which has to go as lightly as it came. While it is `shown`:

- **Escape puts it away**, wherever in the window the focus is. The key was pressed for it and goes no further: to no control, and to no host that would hear it as back. What a pointer or the focus brought up is dismissed without moving either (WCAG 1.4.13).

- **The next one puts it away.** One such thing is shown in a window at a time: a second one, brought up by the keyboard's focus while a pointer rests somewhere else, takes the place of the first.

Either way `onDismiss` is called, and the caller stops showing it.

Escape is heard at a root of the window's content: the outermost `PantrixTheme`'s, and in an overlay that is a window or a layer of its own, the node that carries `pantrixTransientsRoot`. A key reaches a root from wherever the focus is under it. While nothing under a root has the focus a key reaches nothing there, so the root sees to it that Escape is heard then as well, as each platform lets it.

Parameters:

- `shown: Boolean`: whether it is up.
- `onDismiss: () -> Unit`: called for Escape, and when another transient comes up in the window.

### Modifier.pantrixTransientsRoot

`import com.pantrixui.foundation.overlay.pantrixTransientsRoot`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.pantrixTransientsRoot(): Modifier
```

Makes this node a root at which Escape is heard for the window's transients: pressed anywhere under it, the key puts away what `PantrixTransient` says is shown, before any control under this node hears it, and goes no further. With nothing shown the key is not this node's, and goes on as if this were not here.

The outermost `PantrixTheme` is such a root for the app's own content. An overlay that takes the keyboard for itself, a dialog or a popover, puts this on the node that holds what it shows: a key pressed in it reaches nothing of the app under it. An overlay of the app's own puts `com.pantrixui.foundation.testing.pantrixAutomationRoot` on that node too: on Android it is a window of its own, which the theme's mark does not reach, and its test tags reach the platform's automation through that one.

A key reaches a control that has the focus, and what stands around it. Under a root where no control has it, as in a dialog that a pointer opened, a key reaches nothing, and an overlay takes Escape for itself and closes. So that Escape puts away what is up first there as well:

- on the desktop, the web and iOS the root holds the focus itself while something is up and nothing under it has the focus. It is no stop of its own and shows nothing of it. On the desktop it asks only while the scene's own component has the window's keyboard: it takes the keyboard from no Swing component that the window holds beside the scene or in it. On the web it listens at the page as well, for a key that the page was handed and its canvas was not.

- on Android the root listens for the keys that nothing in its window took. An overlay there is a window of its own. A dialog's window asks its listeners before it takes Escape for itself: what is up goes, and the dialog stays. A popover's window, where back closes it, takes Escape before anything it shows is asked: it closes at once, and what was up in it goes with it.

A root is also where the overlays opened from under it hear where the user was: the last press under it, and the control under it that has the focus, where a key was pressed after that press. A dialog on a foldable opens in the half of the fold it was opened from (`OverlayWindow.openedFrom`). The root looks at each press and each key before what is under it does, and takes neither.

### Modifier.pantrixAutomationRoot

`import com.pantrixui.foundation.testing.pantrixAutomationRoot`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.pantrixAutomationRoot(): Modifier
```

Shows the test tags under this node to the platform's UI automation: a Maestro flow, UI Automator or XCUITest finds a component by its tag, `Button_save`, in every language.

On Android a tag becomes the node's resource id only under a node that says so, and each window has its own nodes: the outermost `PantrixTheme` says so for the app's window, and Pantrix's own dialogs, sheets, menus and popovers for theirs. A window of the app's own, a `Popup` or a `Dialog` it opens itself, is out of reach of both: what it shows puts this on its root, and its tags reach the automation as the app's do. On iOS Compose gives a tag to the automation as the accessibility identifier by itself, and on the desktop and the web a test reads the semantics tree: there this changes nothing.

It shows every test tag under it, a `Modifier.testTag` of the app's own too. Where the theme keeps Pantrix's tags out of the semantics tree (`TestTagPolicy.Off`) there are none of those to show.

### PantrixPressIndication

`import com.pantrixui.foundation.primitives.PantrixPressIndication`, from `com.pantrixui:foundation`

```kotlin
class PantrixPressIndication(
    private val pressColor: Color = Color.Black,
    private val pressAlpha: Float = 0.1f
) : IndicationNodeFactory
```

The feedback that tells a person a control took their press, in place of a ripple: the control is covered in `pressColor` while it is pressed, and the cover fades away when it is let go.

A press shows at once. A release lets the press finish before the fade, so that even the quickest tap is seen; a cancelled press, a finger that slid off or a scroll that took the gesture over, fades at once.

Parameters:

- `pressColor: Color`: The colour laid over the control while it is pressed: black unless given.
- `pressAlpha: Float`: How strong that colour is at a full press, from 0 to 1: 0.1 unless given.

### pantrixPressIndication

`import com.pantrixui.foundation.primitives.pantrixPressIndication`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun pantrixPressIndication(pressAlpha: Float = 0.1f): PantrixPressIndication
```

The press indication of the current theme: it darkens a control on a light ground and lightens it on a dark one, so that a press is seen on either.

Parameters:

- `pressAlpha: Float`: How strong the cover is at a full press, from 0 to 1: 0.1 unless given.

### pantrixPressIndicationWithColor

`import com.pantrixui.foundation.primitives.pantrixPressIndicationWithColor`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun pantrixPressIndicationWithColor(
    pressColor: Color,
    pressAlpha: Float = 0.1f
): PantrixPressIndication
```

A press indication in a colour the caller chooses rather than the theme's. `pantrixPressIndication` follows the theme.

Parameters:

- `pressColor: Color`: The colour laid over the control while it is pressed.
- `pressAlpha: Float`: How strong that colour is at a full press, from 0 to 1: 0.1 unless given.

### Modifier.thenIfElse

`import com.pantrixui.foundation.primitives.thenIfElse`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.thenIfElse(
    condition: Boolean,
    ifTrue: Modifier.() -> Modifier,
    ifFalse: Modifier.() -> Modifier
): Modifier
```

This modifier with `ifTrue` applied when `condition` holds, and with `ifFalse` otherwise.

Parameters:

- `condition: Boolean`
- `ifTrue: Modifier.() -> Modifier`
- `ifFalse: Modifier.() -> Modifier`

### Modifier.pantrixVerticalScroll

`import com.pantrixui.components.elements.scrollbar.pantrixVerticalScroll`, from `com.pantrixui:components`

```kotlin
@Composable
fun Modifier.pantrixVerticalScroll(
    state: ScrollState,
    enabled: Boolean = true,
    color: Color = Color.Unspecified
): Modifier
```

Scrolls this content up and down by `state`, as `Modifier.verticalScroll` does, with Pantrix's scroll bar along its side: a page of text, a form, a settings screen that is taller than its window.

The bar is the one Pantrix's own views of documents draw. Its thumb is as long as the share of the content on the screen, and stands where that share is. Where the reader has a pointer it is there while there is something to scroll, darker under the pointer, and a mouse can drag it; under a finger it shows while the content moves and fades after, since a finger scrolls the content itself. It stands at the end of the content, at the left where the layout is read from the right, and is drawn over the content rather than beside it: the content keeps its width.

The scroll and the bar come together, so that the bar stands over the window the content scrolls in, not on the content that scrolls under it:

```kotlin
val scroll = rememberScrollState()
Column(Modifier.fillMaxSize().pantrixVerticalScroll(scroll)) {
    Article()
}
```

A lazy list scrolls by itself, and takes its bar with `pantrixScrollBar`.

Parameters:

- `state: ScrollState`: how far the content is scrolled, as `rememberScrollState()` gives it.
- `enabled: Boolean`: whether a drag, the wheel and the bar scroll the content: the bar is drawn either way, while there is something to scroll.
- `color: Color`: what the thumb is drawn in, at a share of its strength: the theme's `textSecondary` where it is not given. On a fill, the colour written on it.

### Modifier.pantrixScrollBar

`import com.pantrixui.components.elements.scrollbar.pantrixScrollBar`, from `com.pantrixui:components`

```kotlin
@Composable
fun Modifier.pantrixScrollBar(
    state: LazyListState,
    color: Color = Color.Unspecified
): Modifier
```

Pantrix's scroll bar along the side of a lazy list, which scrolls by its own `state`: the one `pantrixVerticalScroll` draws, on the list's own modifier.

A lazy list knows the rows on the screen and how many there are, not how tall the others are: the thumb takes them to be as tall as the ones it sees, which the rows of a list mostly are. Where they are not, the thumb's length changes a little as they come by.

```kotlin
val list = rememberLazyListState()
LazyColumn(modifier = Modifier.fillMaxSize().pantrixScrollBar(list), state = list) {
    items(orders, key = { it.id }) { order -> OrderRow(order) }
}
```

Parameters:

- `state: LazyListState`: the list's state, the one the list is given.
- `color: Color`: what the thumb is drawn in, at a share of its strength: the theme's `textSecondary` where it is not given.
