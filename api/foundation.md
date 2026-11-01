# com.pantrixui:foundation

Pantrix UI's theme, tokens, adaptive window and platform services for Compose Multiplatform.

## Package com.pantrixui.foundation.a11y

### rememberFocusRingVisible

`import com.pantrixui.foundation.a11y.rememberFocusRingVisible`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFocusRingVisible(interactionSource: InteractionSource): Boolean
```

Whether a focus ring should be visible right now: the element is focused, no modal overlay is shown over it, and the focus came by the keyboard, or the platform shows the ring for every focus (`PantrixPlatform.showFocusRingOnlyForKeyboard`).

How the focus came is Compose's own `androidx.compose.ui.input.InputMode`, Touch or Keyboard: a key press puts the window in keyboard mode and a touch takes it out. It says nothing of how precise the pointing device is.

Under a modal overlay the focus stays where it was, to be there again when the overlay closes, but no key reaches it: the ring is not shown there until the overlay has closed (`PantrixModalLayer`).

Parameters:

- `interactionSource: InteractionSource`: the element's interaction source: the ring follows the focus it reports.

Documented on: [Accessibility](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

### Modifier.focusRing

`import com.pantrixui.foundation.a11y.focusRing`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun Modifier.focusRing(
    interactionSource: InteractionSource,
    shape: Shape,
    color: Color,
    width: Dp,
    inset: Boolean = false
): Modifier
```

Draws the focus ring around the element, outside its bounds.

The ring is `width` wide and leaves a gap as wide between itself and the element, so it stays apart from the element's own fill and border: a button filled in the ring's colour is still told apart from its ring. Its corners follow `shape`, grown by the gap and the ring, so a rounded element gets a ring with the same centre of curvature. A `width` of nothing draws no ring.

The ring is drawn, not laid out, so it takes no space. Put the modifier before any `clip` or layer in the element's own chain, which would cut it off, and leave the element room: an ancestor that clips cuts it off as well. `inset` draws it inside the bounds instead, for an element as wide or as tall as its container — a list row, a pane divider — whose ring outside would run past the container's edges.

Whatever scrolls the element brings it into view when it takes the focus, and no further than its own edge. As the ring appears it asks for the room it is drawn in as well, so that a row or a column that scrolls shows the ring whole and not the element with a side of its ring cut. Only what can be scrolled to is asked for: at the very end of what a scroller holds there is nothing past the element, and the scroller's content needs that room as padding, the ring and its gap, twice `width` (`PantrixPlatform.focusRingReach`). A lazy list is asked for the element alone: how far its items go on cannot be told from an item. There the room is the list's content padding, and each item says so with `scrollPadding`.

Parameters:

- `interactionSource: InteractionSource`: the element's interaction source, whose focus decides whether the ring is drawn.
- `shape: Shape`
- `color: Color`: the ring's colour: the theme's `focusRing`, or on a fill what is written on that fill, so that the ring reads there as the text does.
- `width: Dp`
- `inset: Boolean`

Documented on: [Accessibility](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

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

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### PantrixPlatform

`import com.pantrixui.foundation.a11y.PantrixPlatform`, from `com.pantrixui:foundation`

```kotlin
data class PantrixPlatform(
    public val type: PlatformType,
    public val minTouchTarget: Dp,
    public val showFocusRingOnlyForKeyboard: Boolean,
    public val focusRingWidth: Dp,
    public val isTouch: Boolean = type.isTouchByNature
)
```

Platform conventions that are accessibility decisions rather than visual ones.

Parameters:

- `type: PlatformType`: The platform these are the conventions of.
- `minTouchTarget: Dp`: The smallest touch target a control has: the room it takes in the layout and the room a touch reaches it in, both. `Modifier.minTouchTarget` gives a control this room.
- `showFocusRingOnlyForKeyboard: Boolean`: Whether the focus ring appears only during keyboard navigation. True everywhere today: a ring that follows mouse clicks is noise, and the people who need it are navigating by keyboard. Kept as a flag because it is a product decision, not a law.
- `focusRingWidth: Dp`: Ring thickness. A token rather than a constant because high contrast thickens it.
- `isTouch: Boolean`: Whether the platform is used by touch: its primary pointer is a finger. True on Android and iOS, and in a browser on a phone or a tablet; false where a mouse or a trackpad leads, on the desktop and in a desktop's browser. It is what `type` cannot tell of the web, and what decides whatever goes by the pointer and not by the platform: a hint for a gesture or for a shortcut, something that may or may not wait for a hover. Left out, it is the platform's nature: touch on Android and iOS.

Members:

- `focusRingReach: Dp`: How far a focus ring reaches past its element: a gap as wide as the ring, and the ring. It is the room what scrolls keeps at its ends for the ring of what stands there, and what a lazy list adds to its content padding and tells its items with `Modifier.scrollPadding`.
- `fun scaled(density: PantrixDensity): PantrixPlatform`: Density applied to the touch target: Spacious enlarges it, Compact never shrinks it.

  The platform value is a floor, not a starting point. Compact exists to tighten spacing for pointer users; it must not make the region a finger — or a hand with a tremor — has to hit smaller than the platform's own minimum.

  `density`: the interface density the theme is given.

On the type:

- `PantrixPlatform.forType(type: PlatformType, highContrast: Boolean = false, isTouch: Boolean = type.isTouchByNature): PantrixPlatform`: `type`'s conventions. The touch target is the platform guideline's minimum on Android (48dp, Material) and iOS (44pt, Apple HIG), whatever points at them. Desktop and web, which no guideline covers, go by the pointer: 32dp for a mouse, and for a finger what a finger is given on Android, 48dp. The focus ring is 2dp, thickened to 3dp in `highContrast`.

  `isTouch` says whether the platform is used by touch. Left out, it is the platform's nature: touch on Android and iOS, a pointer on the desktop and in a browser. A browser on a phone, and a desktop app on a touch screen, are told:

  ```kotlin
  PantrixPlatform.forType(PlatformType.Web, isTouch = true)
  ```

  `rememberPantrixPlatform` asks the system, so a theme given no platform is right in a phone's browser.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md)

### LocalPantrixPlatform

`import com.pantrixui.foundation.a11y.LocalPantrixPlatform`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixPlatform: ProvidableCompositionLocal<PantrixPlatform>
```

The platform whose conventions are in effect, which `PantrixTheme` provides: what `PantrixTheme.platform` reads. Outside a theme, Android's.

### rememberPantrixPlatform

`import com.pantrixui.foundation.a11y.rememberPantrixPlatform`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixPlatform(): PantrixPlatform
```

This device's conventions: its `PlatformType`'s, with the focus ring thickened when the system is in high contrast, and with the touch target of what points at it: in a browser, a finger's on a phone and a mouse's on a desk. Both are followed as they change.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### Modifier.scrollPadding

`import com.pantrixui.foundation.a11y.scrollPadding`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.scrollPadding(padding: PaddingValues): Modifier
```

Says what the content of a scroller keeps free at its ends, so that what is asked to be shown is shown inside it: clear of a bar the content scrolls beneath, and not at the scroller's very edge.

Whatever scrolls an element brings it into view when it takes the focus, and no further than the scroller's own edge. Where the content scrolls beneath a bar, as a scaffold's content does that is padded by the bars' share, that edge is behind the bar: the focus of a keyboard goes where it cannot be seen, and the page fails WCAG 2.2's 2.4.11, Focus Not Obscured. With this on the content, every asking to show something in it, the focus's own and any other, is made larger by `padding` as it passes, and the scroller shows the element that far from its edge: above the bar.

It goes on what is scrolled, inside the scroller, and adds no padding of its own: it says what the content has.

- On the content of a row or a column that scrolls, after the scroll and before the padding it speaks of: `Modifier.verticalScroll(state).scrollPadding(padding).padding(padding)`.

- On each item of a lazy list or grid whose `contentPadding` is `padding`.

A scroller that is asked for more than it holds scrolls nothing and hands the rest on as a drag of the user's, which moves a sheet it stands in. So in a row or a column no more is asked for than the content reaches: what is scrolled is found by its size, larger than its place, and the last element is shown as far from the edge as there is content after it. In a lazy list, and where the content fits its scroller, how far the content goes cannot be told, and all of `padding` is asked for: the content has to have that much at its ends, as it does where it was given the same padding. A scroller inside is not touched by this: it shows the element as it does by itself, and what is asked of the one around it comes through here.

A focus ring asks for its own room where the content reaches that far (`focusRing`). In a lazy list it cannot: there the list's content padding and this have the ring's room in them, `PantrixPlatform.focusRingReach`.

docs/guide/scroll-padding/SCROLL_PADDING_GUIDE.md has the whole of it, and the same for a project without this library.

Parameters:

- `padding: PaddingValues`: what the content has at each end, inside the scroller: the bars' share a scaffold hands its content, a lazy list's `contentPadding`. Start and end follow the layout's direction. Where the scroller itself ends above the keyboard, as with `imePadding`, a bar at its foot is behind the keyboard and covers none of it: there the keyboard's inset is taken off, `padding - WindowInsets.ime.asPaddingValues()`, or what is typed is shown a bar's height too high.

Documented on: [Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/scaffold.md)

### Modifier.minTouchTarget

`import com.pantrixui.foundation.a11y.minTouchTarget`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.minTouchTarget(min: Dp): Modifier
```

Reserves at least `min` in the layout without changing what the component draws.

This half of the problem is the easy half. The other half is hit-testing, which Compose takes from `ViewConfiguration.minimumTouchTargetSize` — a fixed value this modifier cannot reach. A component that only applies this modifier lays out at 48dp and still only *responds* within its visual bounds, which is the kind of defect that never shows up in a screenshot.

`PantrixTheme` therefore also overrides `LocalViewConfiguration` with `PantrixViewConfiguration`, so both halves use the same number. The pair is the Foundation-only equivalent of Material 3's `LocalMinimumInteractiveComponentSize`.

While the theme's diagnostics are on, a component that is given less room than `min` for half a second is reported as `PantrixCheck.SmallTouchTarget`: whatever stands around it laid it out, and lets it be pressed, in less.

Parameters:

- `min: Dp`

Documented on: [Accessibility](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

### PantrixViewConfiguration

`import com.pantrixui.foundation.a11y.PantrixViewConfiguration`, from `com.pantrixui:foundation`

```kotlin
class PantrixViewConfiguration(
    private val delegate: ViewConfiguration,
    private val minTouchTarget: Dp
) : ViewConfiguration by delegate
```

Makes Compose's hit-test expansion agree with the platform preset.

Provided by `PantrixTheme`; delegates everything except the touch target so future Compose additions to `ViewConfiguration` keep working without a change here.

Parameters:

- `delegate: ViewConfiguration`: The configuration everything but the touch target comes from: the one already in effect.
- `minTouchTarget: Dp`: The touch target, the same both ways.

Documented on: [Accessibility](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

## Package com.pantrixui.foundation.adaptive

### BoxWithPantrixWindow

`import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun BoxWithPantrixWindow(
    modifier: Modifier = Modifier,
    contentAlignment: Alignment = Alignment.TopStart,
    propagateMinConstraints: Boolean = false,
    breakpoints: PantrixBreakpoints = LocalPantrixWindow.current.breakpoints,
    content: @Composable (box: PantrixWindow) -> Unit
)
```

A box that tells its content the room it is given, as a window is told: for a component that changes with the room it has and not with the window. A table that is a list where it is narrow asks its own box, since inside a narrow pane of a wide window the window is still wide:

```kotlin
BoxWithPantrixWindow(modifier) { box ->
    val withDate = box.widthClass >= WindowWidthClass.Expanded
    if (box.isNarrow) OrderList(orders) else OrderTable(orders, withDate)
}
```

The box is `BoxWithConstraints` underneath, and what it tells is the most room it may take: its `maxWidth` and `maxHeight`. Whatever a screen asks the window, the `content` asks the window it is given: `isNarrow`, `byWidth`, `widthClass >= …`.

- The box is classed by `breakpoints`, which are those of the window in effect unless given: a product that classes its window by bounds of its own has its components classed by the same.

- A reader of a class of the box is composed again when that class changes, and not at every size as the content of `BoxWithConstraints` is. A reader of its `size` follows every change. The box is one object while its room changes.

- Inside a page that scrolls there is no end to the height a box may take: its height class is Expanded and it is never short. Ask the box about the width and the window about the height.

- The box is flat. A fold is the window's, and where it crosses the box is not known here: ask the window.

- `PantrixTheme.window` and `responsive` inside the box still ask the window. Where everything inside is to ask the box instead, a pane whose content is a screen of its own, hand the box on: `CompositionLocalProvider(LocalPantrixWindow provides box) { … }`.

Like `BoxWithConstraints`, the box composes its content while it is measured, so it cannot be asked its intrinsic size: it does not go in a row or a column that is sized by `IntrinsicSize`.

Parameters:

- `modifier: Modifier`: The box's own modifier. The room it tells is the room this leaves it.
- `contentAlignment: Alignment`: Where the content is placed in the box when it is smaller than the box.
- `propagateMinConstraints: Boolean`: Whether the content is to be at least as large as the least size of the box.
- `breakpoints: PantrixBreakpoints`: The bounds the box is classed by.
- `content: @Composable (box: PantrixWindow) -> Unit`: The box's content, given the room as a window.

Documented on: [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

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

Documented on: [Overlays on a fold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-fold-overlays.md)

### Modifier.maxContentWidth

`import com.pantrixui.foundation.adaptive.maxContentWidth`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun Modifier.maxContentWidth(alignment: Alignment.Horizontal = Alignment.Start): Modifier
```

Keeps the content no wider than `PantrixTheme.layout.maxContentWidth`: in a desktop window a page's text stays a width that is read, and the rest of the room is left beside it. Below the class that bounds it, the content takes all the room it is given.

Where the content is narrower than its room, this takes the room and lays the content in it by `alignment`: at the start, under a title that starts there, or in the middle.

```kotlin
Column(
    Modifier
        .verticalScroll(scroll)
        .padding(horizontal = PantrixTheme.layout.margin)
        .maxContentWidth()
) { … }
```

The bound is that of the window in effect, or of a component's own box handed on as the window, and follows the window as its class changes. Without a bounded width to fill, the content is measured as it is.

Parameters:

- `alignment: Alignment.Horizontal`: where the content stands in a room wider than it may be: at the start by default.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

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

Documented on: [Overlays on a fold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-fold-overlays.md)

### rememberOverlayWindow

`import com.pantrixui.foundation.adaptive.rememberOverlayWindow`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberOverlayWindow(): OverlayWindow
```

The window an overlay opened here is shown over: the `PantrixWindowFrame` the content is drawn in, or the window the app is in.

Documented on: [Overlays on a fold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-fold-overlays.md)

### PantrixWindow.paneCount

`import com.pantrixui.foundation.adaptive.paneCount`, from `com.pantrixui:foundation`

```kotlin
fun PantrixWindow.paneCount(maxPanes: Int = 2): Int
```

How many panes a layout lays side by side in this window, at most `maxPanes`: one in a Compact window and in a Medium one, two from Expanded on, three from Large on. A window that a fold divides upright, a foldable held like a book or a hinge between two screens, takes two at any width: one on each side of the fold.

```kotlin
if (PantrixTheme.window.paneCount() >= 2) InboxAndMessage() else Inbox()
```

The gap between the panes is the layout's gutter, `PantrixTheme.layout.gutter`, and where a fold divides the window the panes meet at it: the fold's `clearance` is the gap there.

Parameters:

- `maxPanes: Int`: the most panes the layout has: two for a list and its detail, three with a pane beside them.

Documented on: [Two panes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### PantrixWindowFrame

`import com.pantrixui.foundation.adaptive.PantrixWindowFrame`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixWindowFrame(
    window: PantrixWindow?,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
)
```

A box that is a window of its own: its content is told `window` as the window it is in, and the folds of `window` are where they are in this box, its top start corner the window's. What a preview of a screen at a size, a frame of a design tool or a catalogue's window picker draws a window in.

```kotlin
val book = PantrixWindow(DpSize(951.dp, 669.dp), posture = WindowPosture(listOf(fold)))
PantrixWindowFrame(book, Modifier.size(951.dp, 669.dp)) { Inbox() }
```

The folds of the window the app is in are in that window's coordinates; within a frame they are in the frame's. A layout that splits at a fold finds it with `rememberFoldsInNode`, wherever it is drawn. A frame drawn smaller or larger, in a scaled layer, keeps its content's folds where they are in the content: the fold is scaled with them.

Parameters:

- `window: PantrixWindow?`: the window the content is told of; null for the window the box is in, so that a picker offering the real window beside made-up ones keeps the content where it is in the composition, its state with it, whichever is chosen.
- `modifier: Modifier`: the box's modifier. The window's top start corner is where its content starts, inside the modifier's padding and border.
- `content: @Composable () -> Unit`: what the window holds.

Documented on: [Two panes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### FoldsInNode

`import com.pantrixui.foundation.adaptive.FoldsInNode`, from `com.pantrixui:foundation`

```kotlin
class FoldsInNode
```

The window's folds where they cross one node, in the node's own coordinates and in pixels: what a layout that splits its room at a fold measures by. Put `modifier` on the node; `folds` follows the node as it moves and is resized, the window as it changes and the device as it is folded.

A node the fold does not cross has none. Until the node is first placed the folds are where they would be in a node that starts at the window's corner, as one filling the window does.

Members:

- `modifier: Modifier`: Placed on the node whose folds are asked. It follows where the node is in the window, and so a node a page scrolls past the fold is measured again as it goes.
- `folds: List<WindowFold>`: The folds crossing the node, their bounds and clearance in its coordinates.
- `separatingFold: WindowFold?`: The fold that divides the node, if one does: the first of `folds` that separates.

Documented on: [Two panes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### rememberFoldsInNode

`import com.pantrixui.foundation.adaptive.rememberFoldsInNode`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFoldsInNode(window: PantrixWindow = LocalPantrixWindow.current): FoldsInNode
```

The folds of `window` where they cross the node `FoldsInNode.modifier` is put on.

Parameters:

- `window: PantrixWindow`: the window whose folds are asked: the one the content is told of unless given.

Documented on: [Two panes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### PantrixLayout

`import com.pantrixui.foundation.adaptive.PantrixLayout`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLayout(
    val margin: Dp,
    val gutter: Dp,
    val columns: Int = 4,
    val maxContentWidth: Dp = Dp.Infinity
)
```

The measures a page is laid out by in a window of one width class. `PantrixTheme.layout` gives those of the window in effect:

```kotlin
Column(Modifier.padding(horizontal = PantrixTheme.layout.margin).maxContentWidth()) { … }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout.gutter)) { … }
```

The margin and the gutter are air: the interface density scales them as it scales the spacing. The columns are a count and the content's widest is a measure of the content, and the density scales neither.

Parameters:

- `margin: Dp`: The room between the edge of the window, or of a pane, and the content: what a page pads its content by at its sides.
- `gutter: Dp`: The room between columns of a grid, and between panes that stand side by side.
- `columns: Int`: How many columns a page's grid has across its room: a part of the page spans some of them, and `spanWidth` says how wide that is. A phone has 4, a tablet 8 and a wider window 12.
- `maxContentWidth: Dp`: How wide a page's content grows at the most: past it, the room of a wide window is left beside the content, since a line of text across a desktop window is not read. `Dp.Infinity` where the content takes all the room it has. `Modifier.maxContentWidth()` keeps content to it.

Members:

- `fun scaled(factor: Float): PantrixLayout`: These measures at an interface density: the margin and the gutter multiplied by `factor`, the columns and the content's widest as they are.
- `fun spanWidth(available: Dp, span: Int): Dp`: How wide a part that spans `span` of the `columns` is in `available` room: its columns, and the gutters between them. The columns are as wide as each other, and a gutter stands between each two:

  ```kotlin
  BoxWithConstraints {
      val layout = PantrixTheme.layout
      Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
          Article(Modifier.width(layout.spanWidth(maxWidth, span = 8)))
          Related(Modifier.width(layout.spanWidth(maxWidth, span = 4)))
      }
  }
  ```

  Room too narrow for its gutters leaves the columns no width: a part is then as wide as the gutters it spans.

  `available`: the room the columns share, as wide as the page's content: within its margins.

  `span`: how many of the columns the part spans, from 1 to `columns`.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixLayouts

`import com.pantrixui.foundation.adaptive.PantrixLayouts`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLayouts(
    val compact: PantrixLayout = PantrixLayout(margin = 16.dp, gutter = 16.dp, columns = 4),
    val medium: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 16.dp, columns = 8),
    val expanded: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 24.dp, columns = 12),
    val large: PantrixLayout = PantrixLayout(margin = 32.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1040.dp),
    val extraLarge: PantrixLayout = large
)
```

The layout's measures for each width class of a window: what `PantrixTheme.layout` picks from.

A phone has little width to give away and a desktop window has it to spare, so the margin and the gutter grow with the window. By default the margin is 16dp, 24dp from Medium and 32dp from Large; the gutter is 16dp, and 24dp from Expanded. Every one of them is a step of the spacing scale. The grid has 4 columns, 8 from Medium and 12 from Expanded, and the content grows without a bound until Large, where it stops at 1040dp.

A product gives the theme its own for the classes it has designed, and the rest stay as they are:

```kotlin
PantrixTheme(layouts = PantrixLayouts(compact = PantrixLayout(margin = 20.dp, gutter = 12.dp))) { … }
```

A class given its own measures has the columns and the widest content it is given: left out, they are a phone's, 4 columns and no bound. A product that gives a wider class its own measures gives them too:

```kotlin
PantrixLayouts(large = PantrixLayout(margin = 40.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1200.dp))
```

Parameters:

- `compact: PantrixLayout`: The measures of a window narrower than 600dp: a phone held upright.
- `medium: PantrixLayout`: The measures from 600dp: a tablet held upright, an open foldable.
- `expanded: PantrixLayout`: The measures from 840dp: a tablet on its side.
- `large: PantrixLayout`: The measures from 1200dp: a desktop window, a browser.
- `extraLarge: PantrixLayout`: The measures from 1600dp. They are `large`'s unless given: few products design that width apart.

Members:

- `fun forWidth(widthClass: WindowWidthClass): PantrixLayout`: The measures of a window whose width class is `widthClass`.
- `fun scaled(factor: Float): PantrixLayouts`: Density applies here, not at each call site, so one switch rescales the measures of every class.

  `factor`: the interface density's scale: each class's margin and gutter are multiplied by it.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### LocalPantrixLayouts

`import com.pantrixui.foundation.adaptive.LocalPantrixLayouts`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixLayouts: ProvidableCompositionLocal<PantrixLayouts>
```

The layout's measures in effect, for every class: what the nearest `PantrixTheme` was given, scaled by its density. `PantrixTheme.layout` picks the class of the window from them.

### rememberPantrixLayouts

`import com.pantrixui.foundation.adaptive.rememberPantrixLayouts`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixLayouts(): PantrixLayouts
```

Pantrix's layout measures.

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
interface PantrixWindow
```

The window the content is drawn in, as a layout needs to know it: how wide and how tall it is, and how its device is folded. `PantrixTheme` provides it, and `PantrixTheme.window` reads it: nothing is set up for it.

It is the window, not the device and not the screen: an app in half of a split screen, in a resized desktop window or in a browser tab is as wide as that. A layout asks the class rather than the size:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

The window is one object for as long as the theme stands, and its values are read when asked. Whoever reads `widthClass` or `heightClass` is composed again when the class changes and not before; whoever reads `size` follows every change, each frame of a rotation and each pixel of a dragged window edge.

A component that is a pane of its own, a scaffold or a sheet, measures the room it is given rather than asking the window: inside a narrow pane the window is still wide. `BoxWithPantrixWindow` tells a component that room as a window.

On the desktop and on the web the window has no size yet when its content is first composed, and that one composition finds a Compact window; Android and iOS tell the size from the start. Read the class where it is used rather than keeping what it was at first.

Members:

- `size: DpSize`: The window's size. On Android it is the window with its system bars; on the web, the box the app is drawn in. Zero, or unspecified, until the platform has told it: the classes are Compact until then.
- `isSizeKnown: Boolean`: Whether the platform has told the window's size: both its width and its height.

  True from the first composition on Android and iOS. False in the first composition on the desktop and on the web, where the content is composed once before the window has a size, and true from the next one on. Until then the window reads as Compact both ways, so whatever is decided once and kept, a start page or a remembered choice, waits for this:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  A reader is composed again when the answer changes, and not as the window is resized.
- `widthClass: WindowWidthClass`: The class of the window's width: what the layout is chosen by.
- `heightClass: WindowHeightClass`: The class of the window's height: `WindowHeightClass.Compact` is a phone on its side.
- `posture: WindowPosture`: How the window's device is folded; `WindowPosture.Flat` where there is no fold.
- `verticalBar: WindowVerticalBar?`: The column the system keeps along one side of the window for bars that stand upright, or null where it keeps none, as on every screen but the iPhone Duo's outer one. Its places are in the window's coordinates: a layout asks where it stands beside it with `rememberVerticalBarInNode`.
- `breakpoints: PantrixBreakpoints`: Where this window's classes begin: the bounds it is classed by. A size classed by hand goes by the same bounds, as `BoxWithPantrixWindow` classes the room a component is given:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

A window of fixed values, for where the real one is not the answer: a test or a preview of a layout at a size, and Compose embedded in a part of a native screen, where the room is that part's.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

A `verticalBar` given in pixels draws what a screen with the system's column looks like, the iPhone Duo's outer one, where there is none.

Parameters:

- `size: DpSize`: the window's size, which its width and height classes come from.
- `posture: WindowPosture`: how the window's device is folded: flat, as every device with no fold is, unless a fold is given.
- `breakpoints: PantrixBreakpoints`: the widths and heights each class starts at: Android's window size classes unless the product has its own.
- `verticalBar: WindowVerticalBar?`

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

The value of this window's width class. A class left out takes the value of the class below it, so a layout names only the widths it changes at:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parameters:

- `compact: T`: the value in a Compact window, the narrowest class.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window; `medium`'s where it is left out.
- `large: T`: the value in a Large window; `expanded`'s where it is left out.
- `extraLarge: T`: the value in an ExtraLarge window, the widest class; `large`'s where it is left out.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixWindow.byHeight

`import com.pantrixui.foundation.adaptive.byHeight`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byHeight(
    compact: T,
    medium: T = compact,
    expanded: T = medium
): T
```

The value of this window's height class. A class left out takes the value of the class below it:

```kotlin
val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
```

Parameters:

- `compact: T`: the value in a Compact window, the shortest class: a phone held sideways.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window, the tallest class; `medium`'s where it is left out.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md)

### PantrixWindow.byPosture

`import com.pantrixui.foundation.adaptive.byPosture`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byPosture(
    flat: T,
    book: T = flat,
    tabletop: T = flat
): T
```

The value of this window's posture: `book` while the device is held half open like a book, its fold upright; `tabletop` while it is held like a laptop on a table, its fold lying across; `flat` the rest of the time, which is every device with no fold and a foldable opened flat. A posture left out takes `flat`'s value, so a layout names only the postures it changes in:

```kotlin
// Two panes side by side in a book, one above the other on a table, and one pane otherwise.
val panes = PantrixTheme.window.byPosture(flat = Panes.One, book = Panes.SideBySide, tabletop = Panes.Stacked)
```

A device folded both ways at once is taken as a book. The third of a family with `byWidth` and `byHeight`.

Parameters:

- `flat: T`
- `book: T`
- `tabletop: T`

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Whether the window is narrow: its width class is `WindowWidthClass.Compact`, as a phone held upright is. The layout of one pane, with its navigation along the bottom.

A name for `widthClass == WindowWidthClass.Compact`, for code that reads as the rule it follows: `if (window.isNarrow) BottomBar()`. For "from this width on", compare the class: `widthClass >= Expanded`.

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isShort: Boolean
```

Whether the window is short: its height class is `WindowHeightClass.Compact`, as a phone on its side is. Such a window is often wide, Medium or Expanded by its width, and has no height to stack bars in: the main action goes to the header and not to a bar along the bottom, and nothing opens from the bottom edge.

A name for `heightClass == WindowHeightClass.Compact`:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### rememberPantrixWindow

`import com.pantrixui.foundation.adaptive.rememberPantrixWindow`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixWindow(
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    posture: WindowPosture = systemWindowPosture(),
    verticalBar: WindowVerticalBar? = systemVerticalBar()
): PantrixWindow
```

The window Compose reports, classed by `breakpoints`, folded as `posture` says and with the system's `verticalBar`: what `PantrixTheme` provides when it is given none.

Give it to the theme to class by breakpoints of the product's own, or to tell a fold the system does not:

```kotlin
PantrixTheme(window = rememberPantrixWindow(breakpoints = PantrixBreakpoints(medium = 640.dp))) { … }
```

The window stays the same object while `posture` and `verticalBar` change; it is replaced when `breakpoints` are.

Parameters:

- `breakpoints: PantrixBreakpoints`
- `posture: WindowPosture`
- `verticalBar: WindowVerticalBar?`

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### responsive

`import com.pantrixui.foundation.adaptive.responsive`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun <T> responsive(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

The value of the width class of the window in effect: `byWidth` of `PantrixTheme.window` in one word, for a composable that needs a value and not the window. A class left out takes the value of the class below it:

```kotlin
val columns = responsive(compact = 2, medium = 4)
val cardPadding = responsive(compact = 12.dp, medium = 16.dp, large = 20.dp)
```

The page's margin and the gutter between its columns need no picking: `PantrixTheme.layout` has them by class. The caller is composed again when the class changes and not as the window is resized within it. It goes by the width alone; for the height, and outside a composable, ask the window: `byHeight`, `byWidth`.

Parameters:

- `compact: T`: the value in a Compact window, the narrowest class.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window; `medium`'s where it is left out.
- `large: T`: the value in a Large window; `expanded`'s where it is left out.
- `extraLarge: T`: the value in an ExtraLarge window, the widest class; `large`'s where it is left out.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md)

### rememberWindowIsAtLeast

`import com.pantrixui.foundation.adaptive.rememberWindowIsAtLeast`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberWindowIsAtLeast(width: Dp): Boolean
```

Whether the window in effect is at least `width` wide: for a layout that changes at a width none of the classes begins at.

```kotlin
// A third column from 1000dp on, which is neither Expanded's 840 nor Large's 1200.
val threeColumns = rememberWindowIsAtLeast(1000.dp)
```

The caller is composed again when the window crosses `width`, either way, and not while it is resized on one side of it. `PantrixTheme.window.size.width >= width` asks the same, and its reader is composed again at every size: each frame of a rotation, each pixel of a dragged window edge.

While the window's size is not known its width counts as zero, so the answer is false. Where every layout of a product changes at the same widths, give the window those instead: `PantrixBreakpoints`.

Parameters:

- `width: Dp`

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### LocalPantrixWindow

`import com.pantrixui.foundation.adaptive.LocalPantrixWindow`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixWindow: ProvidableCompositionLocal<PantrixWindow>
```

The window in effect: the one the nearest `PantrixTheme` provides. With no theme around, the one Compose reports, classed by the default breakpoints and flat.

`PantrixTheme.window` reads it. Provide it to give a part of the screen a window of its own without a second theme: a pane whose content is to answer to the pane's width.

Documented on: [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### FoldOrientation

`import com.pantrixui.foundation.adaptive.FoldOrientation`, from `com.pantrixui:foundation`

```kotlin
enum class FoldOrientation
```

Which way a fold runs across its window.

Entries:

- `Vertical`: From the top of the window to its bottom: the two halves are side by side.
- `Horizontal`: From one side of the window to the other: one half is above the other.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### WindowFold

`import com.pantrixui.foundation.adaptive.WindowFold`, from `com.pantrixui:foundation`

```kotlin
data class WindowFold(
    public val bounds: Rect,
    public val orientation: FoldOrientation,
    public val isHalfOpened: Boolean,
    public val isSeparating: Boolean,
    public val isOccluding: Boolean,
    public val clearance: Rect = bounds
)
```

A fold or a hinge in a window.

Parameters:

- `bounds: Rect`: Where it is, in pixels and in the window's coordinates. A fold in one screen has no thickness: its bounds are a line, as wide as zero. A hinge between two screens is as wide as the gap.
- `orientation: FoldOrientation`: Which way it runs.
- `isHalfOpened: Boolean`: Whether the device is held partly open, the two halves at an angle. Opened flat, it is not.
- `isSeparating: Boolean`: Whether the window is in two pieces here, with nothing to be laid across: a fold held half open, or a hinge between two screens at any angle. A fold opened flat separates nothing.
- `isOccluding: Boolean`: Whether it hides a strip of the window, as a hinge between two screens does.
- `clearance: Rect`: The strip around it that what is touched keeps clear of, in pixels and in the window's coordinates: `bounds` and the margin the system asks for on either side. iOS asks for one, 20pt on each side of the fold of an iPhone that folds; Android and the browsers ask for none, and the strip is `bounds` itself. Two panes split at the fold leave this strip between them.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Two panes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### WindowPosture

`import com.pantrixui.foundation.adaptive.WindowPosture`, from `com.pantrixui:foundation`

```kotlin
data class WindowPosture(public val folds: List<WindowFold> = emptyList())
```

How the window's device is folded: the folds that cross the window, and none on a device that has none.

The two postures a layout is written for are `isBook` and `isTabletop`. A fold opened flat is in `folds` and changes nothing: the screen is one piece.

Parameters:

- `folds: List<WindowFold>`: The folds crossing the window.

Members:

- `isBook: Boolean`: Held half open with the fold upright, like a book: two panes side by side, split at the fold, with nothing across it.
- `isTabletop: Boolean`: Held half open with the fold lying across, like a laptop on a table: what is looked at goes above the fold; controls, forms and the navigation go below it.
- `separatingFold: WindowFold?`: The fold the window is in two pieces at, or null when it is one piece: content keeps clear of this one.

On the type:

- `WindowPosture.Flat: WindowPosture`: No fold: every phone, tablet, desktop window and browser that does not fold.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### systemWindowPosture

`import com.pantrixui.foundation.adaptive.systemWindowPosture`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemWindowPosture(): WindowPosture
```

The posture the system reports for this window, followed as the device is folded, opened and turned.

Android tells its folds through Jetpack WindowManager, a browser through its Device Posture and Viewport Segments APIs, which Chromium has, and iOS from 27.1 on through UIKit's hinge and its reserved regions. The desktop tells of none, and neither does an iOS before 27.1 or a library built with an Xcode before 27.1: the posture there is `WindowPosture.Flat`. An app that reads a fold by its own means gives its posture to `rememberPantrixWindow` instead.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowWidthClass
```

How wide a window is, as one of five classes a layout chooses by: the shape of its navigation, the number of its panes, the columns of a grid.

The classes are in order, so a rule that holds from a width on is a comparison: `widthClass >= WindowWidthClass.Expanded`. `PantrixBreakpoints` says where each begins.

Entries:

- `Compact`: Narrower than 600dp: a phone held upright, a foldable's cover screen, a narrow browser window.
- `Medium`: From 600dp: an open foldable, a tablet held upright, a split view.
- `Expanded`: From 840dp: a tablet on its side, and most phones on theirs (see `WindowHeightClass.Compact`).
- `Large`: From 1200dp: a desktop window, a browser, a large tablet.
- `ExtraLarge`: From 1600dp: a wide desktop window, an external display.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowHeightClass
```

How tall a window is, as one of three classes.

A layout follows the width first. The height says when there is no room to stack things: a `Compact` window is a phone on its side, as wide as a tablet and less than half as tall, where each bar laid across the screen takes a seventh of it.

Entries:

- `Compact`: Shorter than 480dp: a phone on its side.
- `Medium`: From 480dp: most phones held upright, a tablet on its side.
- `Expanded`: From 900dp: a tablet held upright, a desktop window, and a tall phone held upright.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Sign-in screen](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixBreakpoints

`import com.pantrixui.foundation.adaptive.PantrixBreakpoints`, from `com.pantrixui:foundation`

```kotlin
data class PantrixBreakpoints(
    public val medium: Dp = 600.dp,
    public val expanded: Dp = 840.dp,
    public val large: Dp = 1200.dp,
    public val extraLarge: Dp = 1600.dp,
    public val heightMedium: Dp = 480.dp,
    public val heightExpanded: Dp = 900.dp
)
```

Where each window class begins: the least width of a Medium, Expanded, Large and ExtraLarge window, and the least height of a Medium and an Expanded one. A window narrower than `medium` is Compact, as is one shorter than `heightMedium`.

The defaults are Android's window size classes. A product whose layouts change elsewhere gives its own to `rememberPantrixWindow`.

Parameters:

- `medium: Dp`: The least width of a `WindowWidthClass.Medium` window.
- `expanded: Dp`: The least width of a `WindowWidthClass.Expanded` window.
- `large: Dp`: The least width of a `WindowWidthClass.Large` window.
- `extraLarge: Dp`: The least width of a `WindowWidthClass.ExtraLarge` window.
- `heightMedium: Dp`: The least height of a `WindowHeightClass.Medium` window.
- `heightExpanded: Dp`: The least height of a `WindowHeightClass.Expanded` window.

Members:

- `fun widthClassOf(width: Dp): WindowWidthClass`: The class of a window `width` wide: the highest one whose least width it has reached. A width not known yet, zero or unspecified, is Compact.
- `fun heightClassOf(height: Dp): WindowHeightClass`: The class of a window `height` tall: the highest one whose least height it has reached. A height not known yet, zero or unspecified, is Compact.

On the type:

- `PantrixBreakpoints.Default: PantrixBreakpoints`: 600, 840, 1200 and 1600dp wide; 480 and 900dp tall.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### WindowVerticalBar

`import com.pantrixui.foundation.adaptive.WindowVerticalBar`, from `com.pantrixui:foundation`

```kotlin
data class WindowVerticalBar(
    public val bounds: Rect,
    public val barBounds: Rect
)
```

The column a system keeps along one side of the window for bars that stand upright: its status bar at the top, and an app's toolbar buttons and tabs below it. The outer screen of the iPhone Duo has one from iOS 27.1 on, along its trailing edge, where UIKit puts a tab bar and a navigation bar's buttons; the window's safe area keeps content clear of it.

An app's own bars stand in `barBounds`: buttons at its top, under the status bar, and the navigation at its bottom, above the home indicator. `PantrixScaffold` puts its navigation and a top bar's buttons there by itself on the outer screen held upright. The inner screen, and either screen on its side, has a column too, which it leaves to the status bar.

Parameters:

- `bounds: Rect`: The column, from the window's top to its bottom, in pixels and in the window's coordinates.
- `barBounds: Rect`: Where an app's bars stand in the column: below the status bar and above the home indicator, as wide as the column. A bar narrower than it stands in its middle, which is where the system puts its own and is not always the column's middle: the screen's rounded corner takes a part of the column's outer side. In pixels and in the window's coordinates.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### systemVerticalBar

`import com.pantrixui.foundation.adaptive.systemVerticalBar`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemVerticalBar(): WindowVerticalBar?
```

The vertical bar the system keeps in this window, or null where it keeps none: the column of the iPhone Duo's outer screen from iOS 27.1 on. Android, the desktop and the browsers have none, and neither has an iOS before 27.1 or a library built with an Xcode before 27.1. It is followed as the device is turned and its screens change.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### VerticalBarInNode

`import com.pantrixui.foundation.adaptive.VerticalBarInNode`, from `com.pantrixui:foundation`

```kotlin
class VerticalBarInNode
```

The window's vertical bar beside one node, in the node's own coordinates and in pixels: what a layout that puts its bars in the system's column measures by. Put `modifier` on the node; `verticalBar` follows the node as it moves and is resized, and the window as its bar comes and goes.

The bar is the window's: the one the frame the node is drawn in tells of, or the one the outermost `PantrixTheme` stands for, and not the room a pane is told of as its window. A node that does not reach the column, one in a pane away from that edge, has none. Until the node is first placed the column is where it would be beside a node that starts at the window's corner, as one filling the window does.

Members:

- `modifier: Modifier`: Placed on the node whose vertical bar is asked. It follows where the node is in the window.
- `verticalBar: WindowVerticalBar?`: The vertical bar, its column and the place of its bars in the node's coordinates, while the node reaches across the column to the window's edge; null where it does not, and where the window has none.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### rememberVerticalBarInNode

`import com.pantrixui.foundation.adaptive.rememberVerticalBarInNode`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberVerticalBarInNode(): VerticalBarInNode
```

The window's vertical bar beside the node `VerticalBarInNode.modifier` is put on.

Documented on: [Window classes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

## Package com.pantrixui.foundation.analytics

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

Documented on: [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md), [Analytics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics.md)

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

Documented on: [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md), [Analytics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics.md), [Analytics connector](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics-connector.md)

### LocalPantrixAnalytics

`import com.pantrixui.foundation.analytics.LocalPantrixAnalytics`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixAnalytics: ProvidableCompositionLocal<PantrixAnalytics>
```

Where the components here report their events: `PantrixTheme(analytics = …)`. An app's own code reads it to report its own events to the same place.

Documented on: [Analytics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics.md)

## Package com.pantrixui.foundation.date

### PantrixClock

`import com.pantrixui.foundation.date.PantrixClock`, from `com.pantrixui:foundation`

```kotlin
class PantrixClock(
    public val clock: Clock,
    public val utcOffset: (Instant) -> Duration
)
```

Where a screen reads the time: the moment it is now, and how far the clock it is shown by is ahead of UTC at a moment. `rememberToday` reads the day from it, the time field the hour its picker opens at, the elastic date picker its ranges and a chart its moments. `System` is the device's; a test or a preview gives one of its own through `LocalPantrixClock`, to see a screen on a day and at an hour it chooses.

Parameters:

- `clock: Clock`: what the moment is now.
- `utcOffset: (Instant) -> Duration`: how far the clock is ahead of UTC at a moment: three hours in Istanbul, less than nought west of Greenwich, and summer time where it is kept.

Members:

- `fun today(): PantrixDate`: The day this clock shows now.
- `fun time(): PantrixTime`: The time this clock shows now, to the second.

On the type:

- `PantrixClock.System: PantrixClock`: The device's clock, in the device's time zone.

Documented on: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### LocalPantrixClock

`import com.pantrixui.foundation.date.LocalPantrixClock`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixClock: ProvidableCompositionLocal<PantrixClock>
```

The clock the screen is read by: `PantrixClock.System` unless a test or a preview gives another.

Documented on: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### PantrixDate

`import com.pantrixui.foundation.date.PantrixDate`, from `com.pantrixui:foundation`

```kotlin
class PantrixDate(
    public val year: Int,
    public val month: Int,
    public val day: Int
) : Comparable<PantrixDate>
```

A day on the calendar: a year, a month and a day of the month, with no time of day and no time zone.

Pantrix takes no library of dates. A component that spoke one would put it into the API of every app that shows a date, and which one an app uses is not a design system's to choose: this is three numbers, which an app turns into its own type and back in a line, `PantrixDate(date.year, date.month.number, date.day)` from `kotlinx-datetime`'s `LocalDate` and the same from `java.time`'s. docs/guide/date-time/DATE_TIME_GUIDE.md has the lines for each.

The calendar is the one in use now, the Gregorian, and is taken back before its start as it is forwards: a year before the first is written as nought, then as less than nought.

Parameters:

- `year: Int`: The year, as it is written.
- `month: Int`: The month, 1 for January to 12 for December.
- `day: Int`: The day of the month, from 1 to the month's last.

Members:

- `dayOfWeek: Int`: The day of the week this day falls on, as ISO 8601 numbers it: 1 is Monday and 7 is Sunday.
- `epochDays: Long`: The days from the first of January 1970 to this one: nought on that day, and less than nought before it.
- `fun plusDays(days: Int): PantrixDate`: The day `days` after this one, or before it where `days` is less than nought.
- `fun plusMonths(months: Int): PantrixDate`: The same day `months` months after this one, or before it where `months` is less than nought. Where that month is shorter, its last day: a month after the 31st of January is the last day of February.
- `fun plusYears(years: Int): PantrixDate`: The same day `years` years after this one, or before it: the 29th of February is the 28th in a common year.
- `fun at(time: PantrixTime, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: The moment a clock shows `time` on this day: by default the device's own clock, whose offset from UTC `offsetAt` tells for each moment, as `systemUtcOffset` does, summer time and all.

  Where the clock is put back and shows the time twice, it is the first of the two, as `java.time` takes it. Where it is put forward and never shows the time, it is as far past the hour it skips as the time is into it: half past two on a night that goes from two to three is half past three.

On the type:

- `PantrixDate.ofEpochDays(days: Long): PantrixDate`: The day `days` days after the first of January 1970, or before it where `days` is less than nought.
- `PantrixDate.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixDate`: The day a clock `offset` ahead of UTC shows at `moment`: by default the device's own clock, as `systemUtcOffset` tells it.
- `PantrixDate.today(): PantrixDate`: The day the device's clock shows now. A screen reads `rememberToday` instead: the day the screen's clock shows, asked again at each midnight.
- `PantrixDate.parse(text: String): PantrixDate`: The day ISO 8601 writes as `text`: `2026-10-17`, with four digits of year or more and a sign before a year less than nought, as `toString` writes it.
- `PantrixDate.daysInMonth(year: Int, month: Int): Int`: How many days the month `month` of `year` has: 28 to 31, the 29th of February in a leap year.
- `PantrixDate.isLeapYear(year: Int): Boolean`: Whether `year` has a 29th of February: every fourth year, but not every hundredth, but every four hundredth.

Documented on: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### PantrixDateRange

`import com.pantrixui.foundation.date.PantrixDateRange`, from `com.pantrixui:foundation`

```kotlin
class PantrixDateRange(
    public val start: PantrixDate,
    public val end: PantrixDate
)
```

A stretch of days from `start` to `end`, both of them in it: a stay, a leave, the days a report is of. A stretch of one day starts and ends on it.

Parameters:

- `start: PantrixDate`
- `end: PantrixDate`

Members:

- `operator fun contains(date: PantrixDate): Boolean`: Whether `date` is one of the stretch's days, its first and its last among them.

Documented on: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### PantrixTime

`import com.pantrixui.foundation.date.PantrixTime`, from `com.pantrixui:foundation`

```kotlin
class PantrixTime(
    public val hour: Int,
    public val minute: Int,
    public val second: Int = 0
) : Comparable<PantrixTime>
```

A time of day: an hour by a clock of twenty-four hours, a minute and a second, with no day and no time zone.

As `PantrixDate` is, it is three numbers, which an app turns into its own type and back in a line: `PantrixTime(time.hour, time.minute, time.second)` from `kotlinx-datetime`'s `LocalTime` and the same from `java.time`'s. A day and a time make a moment with `PantrixDate.at`, on the device's clock; docs/guide/date-time/DATE_TIME_GUIDE.md has the lines for each.

A time is written in twenty-four hours whatever the language: `toString` is what is kept and sent. What a screen shows is the language's, `PantrixStrings.time`, by twelve hours in English.

Parameters:

- `hour: Int`: The hour, 0 for the one after midnight to 23.
- `minute: Int`: The minute of the hour, 0 to 59.
- `second: Int`: The second of the minute, 0 to 59: a clock's own seconds, with no leap second.

Members:

- `secondOfDay: Int`: The seconds from midnight to this time: nought at midnight, and 86 399 at the day's last second.

On the type:

- `PantrixTime.ofSecondOfDay(seconds: Int): PantrixTime`: The time `seconds` seconds after midnight, 0 to 86 399.
- `PantrixTime.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixTime`: The time a clock `offset` ahead of UTC shows at `moment`, to the second: by default the device's own clock, as `systemUtcOffset` tells it.
- `PantrixTime.now(): PantrixTime`: The time the device's clock shows now, to the second.
- `PantrixTime.parse(text: String): PantrixTime`: The time ISO 8601 writes as `text`: `14:05`, or `14:05:30` with its seconds, each part in two digits, as `toString` writes it.

Documented on: [Time Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/time-picker.md)

### PantrixTimePoint

`import com.pantrixui.foundation.date.PantrixTimePoint`, from `com.pantrixui:foundation`

```kotlin
sealed interface PantrixTimePoint
```

A point in time that can move with the clock: now, an amount of time from now, or a moment.

"The last 15 minutes" is still the last 15 minutes at the next refresh, so a range a screen is filtered by keeps its points in this form and `resolve`s them each time it is read. Date math, as Elasticsearch and Kibana write it, is their edge: `toDateMath` writes a point as a URL or a query keeps it, `now-15m`, and `parseDateMath` reads it back.

Members:

- `fun resolve(now: Instant = Clock.System.now(), asEnd: Boolean = false, firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: The moment this point falls on, `now` being now, on the clock whose offset from UTC `offsetAt` tells for each moment: by default the device's, as `systemUtcOffset` tells it.

  Seconds, minutes and hours are time that passes; days and longer are the calendar's, on that clock: a day back from noon is noon. A point rounded to a unit is at the unit's start, or where it ends a range (`asEnd`) at its last millisecond, as a range query's `gte` and `lte` read them: from `now/d` to `now/d` is the whole of today. A week starts on `firstDayOfWeek`, as ISO 8601 numbers the days: 1 is Monday.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): String`: This point as date math: `now`, `now-15m`, `now-15m/m`, `now/d`, and a moment as ISO 8601 writes it on the clock `offsetAt` tells, `2026-10-17T14:15:00+03:00`: by default the device's.

On the type:

- `PantrixTimePoint.parseDateMath(text: String): PantrixTimePoint?`: The point the date math `text` writes, or null where it is not date math these points hold.

  - `now`, and one operation after it: `now-15m` and `now+2h`, the number left out as Kibana allows it, `now-d` for `now-1d`; then a rounding: `now-1d/d`, `now/w`, `/1d` as Elasticsearch allows it.

  - The units `y M w d h m s`, and `H` for hours as Elasticsearch writes them. Milliseconds are not read.

  - A moment as ISO 8601 writes one with its offset from UTC or a `Z`: `2026-10-17T14:15:00+03:00`.

  Date math these points do not hold, two operations, `now-1d/d+8h`, or a date before `||`, is null.

#### PantrixTimePoint.Now

```kotlin
data object Now : PantrixTimePoint
```

The moment the point is read.

#### PantrixTimePoint.Relative

```kotlin
class Relative(
    public val amount: Int,
    public val unit: PantrixTimeUnit,
    public val roundTo: PantrixTimeUnit? = null
) : PantrixTimePoint
```

`amount` `unit`s from now, earlier where less than nought, and then rounded to the start of `roundTo`, or to its end where the point ends a range: `Relative(-15, Minutes)` is `now-15m`, and `Relative(-1, Days, roundTo = Days)` is `now-1d/d`, yesterday. With an amount of nought the unit says nothing: `Relative(0, Days, Days)` is `now/d`, today, and with no rounding either the point is now.

Parameters:

- `amount: Int`: How many units from now: less than nought before it.
- `unit: PantrixTimeUnit`: What `amount` counts.
- `roundTo: PantrixTimeUnit?`: What the point is rounded to, or null for no rounding.

#### PantrixTimePoint.Absolute

```kotlin
class Absolute(
    public val moment: Instant
) : PantrixTimePoint
```

A moment, the same wherever it is read: a reader in another time zone sees it on their own clock.

Parameters:

- `moment: Instant`: The moment.

Documented on: [Elastic Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elastic-date-picker.md)

### PantrixTimeRange

`import com.pantrixui.foundation.date.PantrixTimeRange`, from `com.pantrixui:foundation`

```kotlin
class PantrixTimeRange(
    public val start: PantrixTimePoint,
    public val end: PantrixTimePoint
)
```

A range of time whose ends can move with the clock: from `now-15m` to `now` is the last 15 minutes whenever it is read. It keeps no order between its ends, since a point that moves has none until it is read: `resolve` says whether they are in order at a moment.

Parameters:

- `start: PantrixTimePoint`: Where the range starts.
- `end: PantrixTimePoint`: Where it ends.

Members:

- `fun resolve(now: Instant = Clock.System.now(), firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): ClosedRange<Instant>?`: The moments the range runs between, `now` being now, its start rounded down and its end up, on the clock `offsetAt` tells, its weeks starting on `firstDayOfWeek`; or null where its end falls before its start.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): Pair<String, String>`: Both ends as date math: what a URL keeps, and what a range query sends as `gte` and `lte`.

  `offsetAt`: tells the clock's offset from UTC at each moment, for an end written as a moment: by default the device's, as `systemUtcOffset` tells it.

Documented on: [Elastic Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elastic-date-picker.md)

### PantrixTimeUnit

`import com.pantrixui.foundation.date.PantrixTimeUnit`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixTimeUnit(
    internal val letter: Char
)
```

A unit time is counted in: a point's distance from now, and what it is rounded to.

Seconds, minutes and hours are time that passes, the same length on every day. Days and longer are the calendar's, on the clock the point is read by: a day back from noon is noon, on a day the clock is put forward too, and a month on from the 31st of January is the last day of February.

Each is written in date math by the letter Elasticsearch and Kibana write it with: `s`, `m`, `h`, `d`, `w`, `M` and `y`.

Entries:

- `Seconds`: Seconds: `s`.
- `Minutes`: Minutes: `m`.
- `Hours`: Hours: `h`.
- `Days`: Days of the calendar: `d`.
- `Weeks`: Weeks of the calendar, from the day a week starts on: `w`.
- `Months`: Months of the calendar: `M`.
- `Years`: Years of the calendar: `y`.

Documented on: [Elastic Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elastic-date-picker.md)

### rememberToday

`import com.pantrixui.foundation.date.rememberToday`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberToday(): PantrixDate
```

The day the screen's clock shows, as a screen that stays open past midnight has it: it turns to the next day as the clock does, and what reads it is drawn again. A calendar marks today by it. The clock is `LocalPantrixClock`'s: the device's, unless a test or a preview gives another.

It asks the clock again at each midnight of the clock's own time, and not in between: a clock set by hand or a journey into another time zone shows the next time the screen is built, or at the next midnight.

Documented on: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

## Package com.pantrixui.foundation.diagnostics

### ContrastNeed

`import com.pantrixui.foundation.diagnostics.ContrastNeed`, from `com.pantrixui:foundation`

```kotlin
enum class ContrastNeed(
    public val ratio: Float
)
```

How readable a colour must be on the colour under it, as WCAG 2.2 asks.

Parameters:

- `ratio: Float`: The contrast it needs at the least, as `contrastRatio` measures it.

Entries:

- `Text`: Text: 4.5:1.
- `LargeText`: Text of 18pt and more, or of 14pt and more in bold: 3:1.
- `Mark`: What shows a control or its state without words, as a checkbox's box, a field's edge or a focus ring: 3:1.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### ContrastPair

`import com.pantrixui.foundation.diagnostics.ContrastPair`, from `com.pantrixui:foundation`

```kotlin
data class ContrastPair(
    public val what: String,
    public val foreground: Color,
    public val background: Color,
    public val need: ContrastNeed
)
```

A colour a component draws on another, and how readable it must be there.

Parameters:

- `what: String`: The pair's name in a finding, e.g. `label on container`.
- `foreground: Color`: The colour drawn: text, an icon, a mark.
- `background: Color`: The colour it is drawn on.
- `need: ContrastNeed`: How readable it must be.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### Modifier.checkContrast

`import com.pantrixui.foundation.diagnostics.checkContrast`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.checkContrast(
    component: String,
    pairs: () -> List<ContrastPair>
): Modifier
```

Tells the theme's diagnostics, while they are on, which colours `component` draws on which: a pair that reads under what it needs is reported as `PantrixCheck.LowContrast`, once for the component and those colours however many of it show them. `pairs` is called only while the diagnostics are on, and again when they or the theme's colours change.

A background that lets through what is under it, as that of a button without a fill, is measured on the theme's background and on its surface, where the component stands on one of the theme's own grounds, and the lower of the two counts. On a fill of another colour, which gives what stands on it a content colour of its own, such a pair is not measured: what is under it is not known. Nor is a pair with an unspecified colour.

Parameters:

- `component: String`: The component's name in a finding, e.g. `Button`.
- `pairs: () -> List<ContrastPair>`: The colours it draws on which, in the state it is in. A disabled component, which no one is asked to read, gives none.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### Modifier.checkName

`import com.pantrixui.foundation.diagnostics.checkName`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.checkName(
    component: String,
    name: String?
): Modifier
```

Tells the theme's diagnostics, while they are on, what a screen reader says for `component`: a blank `name` is reported as `PantrixCheck.MissingName`. A null name is no name given here, as for a picture that is only decoration or a control that is named by its text, and is not reported; a control that has no other name passes a blank one.

Parameters:

- `component: String`: The component's name in a finding, e.g. `IconButton`.
- `name: String?`: What a screen reader says for it: its `contentDescription`, its `label` or its `title`.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### PantrixCheck

`import com.pantrixui.foundation.diagnostics.PantrixCheck`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixCheck
```

A kind of defect that only a running screen shows, which a theme's diagnostics look for while they are on.

Entries:

- `DuplicateTestTag`: Two nodes of one window carry the same automation tag, and a test that looks for it cannot tell which of them it found.
- `LowContrast`: A colour is hard to read on the colour it is drawn on: text under 4.5:1, large text and the mark of a control under 3:1, as WCAG 2.2 measures them.
- `SmallTouchTarget`: A control is laid out in less room than the platform's touch target, and answers to a press in less than it.
- `MissingName`: What a screen reader says for a control or a picture is blank.
- `NoStringsForLanguage`: The theme's language has no strings of its own, and the components speak English in it.
- `ShadowedShortcut`: A keyboard shortcut is heard first by a node around the one it is on, and never runs there.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### PantrixFinding

`import com.pantrixui.foundation.diagnostics.PantrixFinding`, from `com.pantrixui:foundation`

```kotlin
data class PantrixFinding(
    public val check: PantrixCheck,
    public val component: String?,
    public val testTag: String?,
    public val screen: String?,
    public val message: String,
    public val values: Map<String, String> = emptyMap()
)
```

What a check found: which check, where, and why.

Parameters:

- `check: PantrixCheck`: The check that found it.
- `component: String?`: The component it was found in, e.g. `Button`, or null where no component is known.
- `testTag: String?`: The automation tag of the node it was found on, or null where the node carries none.
- `screen: String?`: The enclosing `TestScope` chain, e.g. `Checkout.PaymentForm`, or null outside one.
- `message: String`: What is wrong and how it is put right, in English: a developer reads it, not the app's user.
- `values: Map<String, String>`: The measured values the message speaks of, such as the `ratio` a contrast has and the one it needs.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### PantrixDiagnostics

`import com.pantrixui.foundation.diagnostics.PantrixDiagnostics`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixDiagnostics
```

Where a theme's diagnostics send what they find.

`Off`, the default, turns the checks off as well: they return at their first line, and a release build pays next to nothing for them. Pantrix does not know what kind of build it runs in, so an app turns them on in its debug build: `PantrixTheme(diagnostics = if (debug) PantrixDiagnostics.Log else PantrixDiagnostics.Off)`. A test or an inspector keeps them with `PantrixFindings`.

A finding is reported once while it lasts, and again if it comes back after it was put right. A squeezed touch target, which a layout makes, is reported once it has lasted half a second: a row that opens squeezes what it holds for a moment. Two nodes with one tag are reported once they have lasted a second and a half, longer than a page transition, which shows the page that goes and the one that comes together.

Members:

- `fun report(finding: PantrixFinding)`: Called with each `finding` on the UI thread, outside composition and layout.

On the type:

- `PantrixDiagnostics.Off: PantrixDiagnostics`: Turns the checks off: nothing is looked for, and nothing is reported.
- `PantrixDiagnostics.Log: PantrixDiagnostics`: Writes each finding to the platform's log: Logcat on Android, the console on iOS and in a browser, and the standard error on the JVM.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### LocalPantrixDiagnostics

`import com.pantrixui.foundation.diagnostics.LocalPantrixDiagnostics`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixDiagnostics: ProvidableCompositionLocal<PantrixDiagnostics>
```

Where the checks of the components inside a theme send what they find: the theme's `diagnostics`.

A theme whose diagnostics change while its content is shown turns the checks of that content on or off at once.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### PantrixFindings

`import com.pantrixui.foundation.diagnostics.PantrixFindings`, from `com.pantrixui:foundation`

```kotlin
class PantrixFindings(
    private val then: PantrixDiagnostics = PantrixDiagnostics.Off
) : PantrixDiagnostics
```

Keeps what a theme's diagnostics find, for a test to read and for an inspector to show, and hands each finding on to `then` as well.

```kotlin
val findings = PantrixFindings()
setContent { PantrixTheme(diagnostics = findings) { CheckoutScreen() } }
assertEquals(emptyList(), findings.all)
```

Parameters:

- `then: PantrixDiagnostics`: Where each finding goes on to once it is kept: `PantrixDiagnostics.Log` writes it to the log too.

Members:

- `all: List<PantrixFinding>`: What has been found since this was made or last cleared, in the order it was found: the list as it is when read, which equals any list of the same findings. A finding that comes back after it was put right is kept once; read in a composition, the list is followed as it grows.
- `fun clear()`: Forgets what has been found.
- `fun boundsOf(finding: PantrixFinding): Rect?`: Where the node `finding` was made on is now, in the coordinates of the window it is drawn in: what an inspector outlines. Null where that node is gone, and for a finding made on no node, as one about a theme's colours.

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

## Package com.pantrixui.foundation.files

### PantrixFile.uri

`import com.pantrixui.foundation.files.uri`, from `com.pantrixui:foundation`, on android only

```kotlin
val PantrixFile.uri: Uri?
```

The content address this file is read from, or null for one made in memory.

### Modifier.fileDropTarget

`import com.pantrixui.foundation.files.fileDropTarget`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.fileDropTarget(
    enabled: Boolean = true,
    onOver: (Boolean) -> Unit = {},
    onFiles: (List<PantrixFile>) -> Unit
): Modifier
```

Takes the files dropped on this element, from the platform's files, another app or another window, as `PantrixFile`s.

Compose hands a drop over in each platform's own type: a `DragEvent` whose `ClipData` holds content `Uri`s on Android, `UIDragItem`s whose providers still have to load their files on iOS, a list of file addresses on the desktop, and a `DataTransfer` on the web whose files can be read only while the drop lasts. This turns each into the same list. On Android it asks the activity for the right to read what another app dropped, which a drop that is not asked for loses; on iOS it copies each file into the app's temporary folder, as a provider's file is gone when its loading ends.

Dragging a file in is a pointer's gesture, and some platforms never have one: a phone with no other app beside it. A drop target is never the only way to give an app a file: put a `FilePicker` beside it, on the same press.

```kotlin
Box(Modifier.fileDropTarget(onOver = { over = it }) { files -> attach(files) })
```

Parameters:

- `enabled: Boolean`: whether a drop is taken. A target that is not does not light up either: it is never told something is over it.
- `onOver: (Boolean) -> Unit`: told true when something that may hold files is dragged over this element, and false when it leaves, is dropped or the drag ends somewhere else.
- `onFiles: (List<PantrixFile>) -> Unit`: handed the files of a drop, on the main thread. It is not called for a drop that held none; on iOS it is called once the files are loaded, a moment after the drop.

Documented on: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### FilePickRequest

`import com.pantrixui.foundation.files.FilePickRequest`, from `com.pantrixui:foundation`

```kotlin
class FilePickRequest(
    public val accept: List<PantrixFileType> = listOf(PantrixFileType.Any),
    public val multiple: Boolean = false
)
```

What a picker is asked for: the kinds of file it shows, and whether the user may choose more than one.

Parameters:

- `accept: List<PantrixFileType>`: the kinds of file the picker shows. A file of none of them cannot be chosen, where the platform's picker can tell: the desktop's window on Windows cannot, and shows every file.
- `multiple: Boolean`: whether the user may choose more than one file.

Members:

- `fun accepts(file: PantrixFile): Boolean`: Whether `file` is of a kind the picker shows.
- `imagesOnly: Boolean`: Whether only pictures are asked for: every kind is an image's. Android and iOS then open their photo picker, where a user's pictures are, in place of their files.

Documented on: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### FilePicker

`import com.pantrixui.foundation.files.FilePicker`, from `com.pantrixui:foundation`

```kotlin
fun interface FilePicker
```

Opens the platform's own picker for files, and hands the app what the user chose.

`rememberFilePicker` gives the platform's: Android's documents (`ACTION_OPEN_DOCUMENT`), iOS's Files, the desktop's own window and the browser's. Where only pictures are asked for (`FilePickRequest.imagesOnly`), Android and iOS open their photo picker instead. None of them asks for a permission.

A test, or a screen shown before a picker exists, gives one of its own:

```kotlin
val picker = FilePicker { _, onPicked -> onPicked(listOf(PantrixFile("report.pdf", bytes))) }
```

Members:

- `fun pick(request: FilePickRequest, onPicked: (List<PantrixFile>) -> Unit)`: Opens the picker for `request`. `onPicked` is called on the main thread with what the user chose, in the order the platform gives it, and is not called when the user chose nothing.

Documented on: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### rememberFilePicker

`import com.pantrixui.foundation.files.rememberFilePicker`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFilePicker(): FilePicker
```

The platform's own picker for files: see `FilePicker`. On Android it needs an activity that keeps results, a `ComponentActivity`, as every Compose activity is. Where `LocalFilePicker` gives a picker, it is that one.

Documented on: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### LocalFilePicker

`import com.pantrixui.foundation.files.LocalFilePicker`, from `com.pantrixui:foundation`

```kotlin
val LocalFilePicker: ProvidableCompositionLocal<FilePicker?>
```

The picker `rememberFilePicker` gives inside it: what a test or a preview puts in the place of the platform's, for every file drop zone of a screen at once. Null, the default, leaves the platform's.

Documented on: [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### FileSaveResult

`import com.pantrixui.foundation.files.FileSaveResult`, from `com.pantrixui:foundation`

```kotlin
enum class FileSaveResult
```

What became of a file given to `FileSaver.save`.

Entries:

- `Saved`: The user chose a place, and the file was written there.
- `Cancelled`: The user closed the platform's window without choosing a place: nothing was written.
- `Started`: The file was handed to the browser, which keeps it as its user has it set to: in the downloads folder, or where it asks. A page is told no more than that.
- `Failed`: The file could not be read, or the place the user chose could not be written.

Documented on: [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### FileSaver

`import com.pantrixui.foundation.files.FileSaver`, from `com.pantrixui:foundation`

```kotlin
fun interface FileSaver
```

Hands the user a file the app made, to keep where they choose: the platform's own window for saving a file, the other half of `FilePicker`.

`rememberFileSaver` gives the platform's: Android's documents (`ACTION_CREATE_DOCUMENT`), iOS's Files, the desktop's own window and the browser's download. None of them asks for a permission: the user's choice of a place is the leave to write there.

```kotlin
val saver = rememberFileSaver()
PantrixButton(
    text = stringResource(Res.string.download_theme),
    onClick = { saver.save(PantrixFile("Theme.kt", source.encodeToByteArray())) { result -> show(result) } }
)
```

A test, or a screen shown before a saver exists, gives one of its own:

```kotlin
val saver = FileSaver { file, onResult -> kept += file; onResult(FileSaveResult.Saved) }
```

Members:

- `fun save(file: PantrixFile, onResult: (FileSaveResult) -> Unit)`: Asks the user where to keep `file`, under its name and as its type, and writes it there. `onResult` is called once, on the main thread, with what became of it. The browser's saver is called from a user's press, as its picker is: a browser may hold back a download no press asked for.

Documented on: [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### rememberFileSaver

`import com.pantrixui.foundation.files.rememberFileSaver`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFileSaver(): FileSaver
```

The platform's own window for saving a file: see `FileSaver`. On Android it needs an activity that keeps results, a `ComponentActivity`, as every Compose activity is. Where `LocalFileSaver` gives a saver, it is that one.

Documented on: [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### LocalFileSaver

`import com.pantrixui.foundation.files.LocalFileSaver`, from `com.pantrixui:foundation`

```kotlin
val LocalFileSaver: ProvidableCompositionLocal<FileSaver?>
```

The saver `rememberFileSaver` gives inside it: what a test or a preview puts in the place of the platform's. Null, the default, leaves the platform's.

Documented on: [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### PantrixFile

`import com.pantrixui.foundation.files.PantrixFile`, from `com.pantrixui:foundation`

```kotlin
class PantrixFile
```

A file the user gave the app: chosen in the platform's picker (`rememberFilePicker`) or dropped on a drop target (`fileDropTarget`), on every platform the same.

Common Compose has no file of its own: a chosen or a dropped file comes in each platform's own type, a content `Uri` on Android, an `NSURL` on iOS, a `java.io.File` on the desktop and a `File` of the browser on the web. This is the one an app's common code takes, and the platform's own is still there for the code that needs it: `uri`, `url`, `file` and `domFile`, each in its platform's source set.

Nothing is read until `readBytes` is called. A file is not a value: two files of one name and one size are two files, as two sheets of paper are.

```kotlin
picker.pick(FilePickRequest(accept = listOf(PantrixFileType.Pdf))) { files ->
    scope.launch { upload(files.first().name, files.first().readBytes()) }
}
```

Parameters:

- `name: String`: what the file is called, with its extension where it has one, and without the folders it is in.
- `size: Long?`: how many bytes the file has, or null where the platform does not say.
- `mimeType: String`: what the file holds, as a MIME type: what the platform says, or what its extension does, or `application/octet-stream`.

Another constructor:

```kotlin
constructor(
    name: String,
    bytes: ByteArray,
    mimeType: String = mimeTypeOf(name)
)
```

A file held in memory: one the app made itself, or a test's, in the place of one the user chose.

Its parameters:

- `name: String`: what the file is called.
- `bytes: ByteArray`: what it holds. They are copied: changing the array afterwards does not change the file.
- `mimeType: String`: what it holds, as a MIME type: by default the one its name's extension stands for. `mimeTypeOf`: The MIME type a file named `name` holds by its extension, or `application/octet-stream`: for a file whose platform did not say, and for one made in memory.

Members:

- `suspend fun readBytes(): ByteArray`: Reads the whole file into memory, off the main thread where the platform reads from a disk. A file that is no longer there, or that the app may no longer read, throws the platform's error.

Documented on: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### PantrixFileType

`import com.pantrixui.foundation.files.PantrixFileType`, from `com.pantrixui:foundation`

```kotlin
class PantrixFileType(
    public val mimeType: String,
    public val extensions: List<String> = emptyList()
)
```

A kind of file an app takes: a MIME type, whose subtype may be a wildcard (`image` with any subtype is `Images`'s), and the extensions files of that kind are named with.

Each platform's picker is told the kind its own way: Android and the web by the MIME type, iOS by the uniform type the MIME type and the extensions stand for, and the desktop's window by the extensions. A file fits the kind when its MIME type does or its extension is one of `extensions`, so a file whose platform could not say what it holds is still known by its name.

```kotlin
val spreadsheets = PantrixFileType("text/csv", listOf("csv"))
```

Parameters:

- `mimeType: String`: the kind's MIME type: `type/subtype`, either of which may be `*`.
- `extensions: List<String>`: the extensions files of the kind are named with, without their dot, in any case.

Members:

- `fun accepts(file: PantrixFile): Boolean`: Whether `file` is of this kind: its MIME type is, or its name ends in one of the extensions.

On the type:

- `PantrixFileType.Any: PantrixFileType`: Every file.
- `PantrixFileType.Images: PantrixFileType`: Pictures: photos, screenshots, drawings. Where only these are taken, a phone opens its photo picker.
- `PantrixFileType.Videos: PantrixFileType`: Films and recordings with pictures.
- `PantrixFileType.Audio: PantrixFileType`: Sound: music, voice notes.
- `PantrixFileType.Pdf: PantrixFileType`: PDF documents.
- `PantrixFileType.Text: PantrixFileType`: Plain text, of any kind: notes, logs, comma-separated values.

Documented on: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Files](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### PantrixFile.url

`import com.pantrixui.foundation.files.url`, from `com.pantrixui:foundation`, on ios only

```kotlin
val PantrixFile.url: NSURL?
```

The file in the app's own folders this one is, or null for one made in memory.

### PantrixFile.file

`import com.pantrixui.foundation.files.file`, from `com.pantrixui:foundation`, on jvm only

```kotlin
val PantrixFile.file: File?
```

The file on the disk this one is, or null for one made in memory.

### PantrixFile.domFile

`import com.pantrixui.foundation.files.domFile`, from `com.pantrixui:foundation`, on web only

```kotlin
val PantrixFile.domFile: File?
```

The browser's own file this one is, or null for one made in memory.

## Package com.pantrixui.foundation.icons

### PantrixIcons

`import com.pantrixui.foundation.icons.PantrixIcons`, from `com.pantrixui:foundation`

```kotlin
object PantrixIcons
```

The icons a component library cannot do without, as `ImageVector`s: a select's chevron, a dialog's close, an alert's status marks. Without them those components are broken, not unstyled, and an alert whose tone only its colour tells says nothing to anyone who cannot see the colour (WCAG 1.4.1). A few more are for an app's own screens: `Inbox`, `Star`, `Folder`, `Person`, `Search` and `Copy`. `Eye` and `EyeOff` are a secure text field's: the button that shows what was typed, and hides it again. `Pause` and `Play` are a carousel's: the button that stops what turns by itself, and lets it turn again. `Download` is a chart's: the button that takes it out of the app as a file. `Upload` and `File` are a drop zone's: the zone that takes a file into the app, and a file it took. `Calendar` and `Clock` are a date's and a time's: the fields and the buttons that open a calendar and a time picker.

Drawn on a 24-unit grid with a 2-unit stroke, round at its ends and corners, the geometry most icon sets use, so an app's own icons sit beside these without looking a different weight. Every path is black: `PantrixIcon` tints the whole icon in the colour it resolves, the content colour of where it sits unless it is given one.

The six that point back or forward set `ImageVector.autoMirror` and flip in right-to-left layouts: `ChevronForward`, `ChevronBack`, `FirstPage`, `LastPage`, `ArrowBack` and `ArrowForward`. The rest never do: a tick, a lens or a turn to the right reads the same in every language, and so does `Play`, which is drawn as a player's button is everywhere.

Members:

- `Check: ImageVector`: Confirmation. Symmetrical in meaning, so it never mirrors.
- `Close: ImageVector`: Closing or dismissing: a dialog, a sheet, a chip.
- `ChevronDown: ImageVector`: What opens below: a select's or an accordion's chevron. Never mirrors.
- `ChevronForward: ImageVector`: Points along the reading direction, so it mirrors in RTL.
- `ChevronBack: ImageVector`: Points against the reading direction, so it mirrors in RTL: a pagination's previous page.
- `FirstPage: ImageVector`: Back to where a row of pages starts: `ChevronBack` against a bar, a pagination's first page. Mirrors in RTL.
- `LastPage: ImageVector`: On to where a row of pages ends: `ChevronForward` against a bar, a pagination's last page. Mirrors in RTL.
- `ArrowBack: ImageVector`: Back to the previous screen, as Android and the web draw it; mirrors in RTL.
- `ArrowForward: ImageVector`: On to what comes next, as `ArrowBack` returns: the arrow between a range's two ends. Mirrors in RTL.
- `Calendar: ImageVector`: A page of a calendar: a date picker's field. Never mirrors.
- `Clock: ImageVector`: A clock's face, its hands at the hour and a little past it: a time picker's field. A clock turns the same way in every language, so it never mirrors.
- `Refresh: ImageVector`: Doing it again: a three-quarter turn, clockwise from the right and around to its head at the top right. A turn to the right reads the same in every language, so it never mirrors.
- `ZoomOut: ImageVector`: Showing more: a lens with a minus in it, which widens a range. A lens is held the same way in every language, so it never mirrors.
- `ZoomIn: ImageVector`: Showing less: `ZoomOut`'s lens with a plus, which narrows the range. Never mirrors.
- `MoreHorizontal: ImageVector`: Something folded away: the pages a breadcrumb trail or a pagination leaves out. Never mirrors.
- `Minus: ImageVector`: Indeterminate or partly selected.
- `Menu: ImageVector`: The menu a drawer opens: three lines, the mark every platform uses for it.
- `Plus: ImageVector`: Add. `Minus`'s line with the upright it is missing.
- `Info: ImageVector`: Information: an "i" in a circle, its dot at the top, the mark `Error` turns upside down.
- `Success: ImageVector`: Success: a tick in a circle.
- `Warning: ImageVector`: Warning: an exclamation mark in a triangle, the one status icon with a different outline.
- `Error: ImageVector`: Error: an exclamation mark in a circle, its dot at the bottom.
- `Inbox: ImageVector`: A tray with a notch in its rim: an inbox.
- `Star: ImageVector`: A five-pointed star: something marked as a favourite.
- `Folder: ImageVector`: A folder.
- `Person: ImageVector`: A head and shoulders: a person, an account.
- `Search: ImageVector`: A lens and its handle: a search. A lens is held the same way in every language, so it never mirrors.
- `Download: ImageVector`: An arrow down onto a line: taking something out of the app as a file. Never mirrors.
- `Upload: ImageVector`: An arrow up from a line: taking a file into the app. Never mirrors.
- `File: ImageVector`: A sheet with its upper corner folded: a file. The fold is at the upper right in every language, as a page's is in a file manager, so it never mirrors.
- `Copy: ImageVector`: Two sheets, one behind the other: copying, of a code block or of a link. The sheet behind shows at the upper left in every language, so it never mirrors.
- `Eye: ImageVector`: An eye: showing what is hidden, the text of a secure text field. It is the same eye in every language.
- `EyeOff: ImageVector`: `Eye` with a line through it: hiding the text again. The eye stops short of the line on either side, so that the line is read as one drawn across the eye and not as part of it.
- `Pause: ImageVector`: Two upright bars: stopping what moves by itself for a while.
- `Play: ImageVector`: A triangle that points to the right: letting what was stopped move again. A player's button points the same way in every language, so it never mirrors.

Documented on: [Icon](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/icon.md)

## Package com.pantrixui.foundation.keyboard

### Modifier.clearFocusOnTap

`import com.pantrixui.foundation.keyboard.clearFocusOnTap`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.clearFocusOnTap(): Modifier
```

Clears the focus when the user taps this node where nothing under the tap takes the tap itself: a text field gives its focus up, and the software keyboard goes with it.

A screen or an app puts it on its root, under everything it shows:

```kotlin
Column(Modifier.fillMaxSize().clearFocusOnTap()) {
    PantrixTextArea(state = comment, label = stringResource(Res.string.comment))
    PantrixButton(text = stringResource(Res.string.send), onClick = ::send)
}
```

On iOS it is how a keyboard is put away from a field of several lines, whose keyboard has no key for it, and from a field of numbers, whose pad has none either. A tap on empty room, on a text or on a picture clears the focus. A tap that something under it takes is left to that: a button does what it does, and a press in a text field moves its caret. A drag that scrolls is no tap, and leaves the focus where it is.

Documented on: [Text Area](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/text-area.md)

### PantrixShortcut

`import com.pantrixui.foundation.keyboard.PantrixShortcut`, from `com.pantrixui:foundation`

```kotlin
class PantrixShortcut(
    public val key: Key,
    public val command: Boolean = false,
    public val shift: Boolean = false,
    public val alt: Boolean = false
)
```

A key and the modifiers held with it: what runs a command from the keyboard, `⌘K` on a Mac and `Ctrl+K` elsewhere.

`command` is the key a system's shortcuts lead with: Command on Apple's systems and Control on the others, so one shortcut is written once for every platform. A shortcut is pressed when its key goes down with its modifiers held and no others: `⌘K` is not pressed by `⇧⌘K`, nor by `⌃K` on a Mac.

```kotlin
val search = PantrixShortcut(Key.K, command = true)
search.writtenOn(OperatingSystem.MacOs) // "⌘K"
search.writtenOn(OperatingSystem.Windows) // "Ctrl+K"
```

The letters, the digits, the arrows, the function keys, Enter, Escape, Tab, Space, Backspace, Delete, Home, End, the page keys and the common marks have names of their own. Another key is written by its number.

Parameters:

- `key: Key`: the key that is pressed.
- `command: Boolean`: whether Command, on Apple's systems, or Control, on the others, is held.
- `shift: Boolean`: whether Shift is held.
- `alt: Boolean`: whether Option, on Apple's systems, or Alt, on the others, is held.

Members:

- `fun isPressedBy(event: KeyEvent, system: OperatingSystem): Boolean`: Whether `event` presses this shortcut on `system`: its key going down, with its modifiers held and no others.
- `fun keysOn(system: OperatingSystem): List<String>`: The keys of this shortcut as `system` writes them, one to a keycap, in its order: Option, Shift, Command and the key on Apple's systems (`⌥`, `⇧`, `⌘`, `K`), Control, Alt, Shift and the key on the others.
- `fun writtenOn(system: OperatingSystem): String`: This shortcut written out on `system`: `⌥⇧⌘K` on Apple's systems, `Ctrl+Alt+Shift+K` on the others.

Documented on: [Command Palette](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/command-palette.md), [Keyboard shortcuts](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### Modifier.onShortcut

`import com.pantrixui.foundation.keyboard.onShortcut`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.onShortcut(
    shortcut: PantrixShortcut,
    enabled: Boolean = true,
    onTrigger: () -> Unit
): Modifier
```

Runs `onTrigger` when `shortcut` is pressed while the focus is on this node or inside it, before the control that has the focus is given the key: a field that has the focus does not type the letter of a shortcut it ran.

A key is given only to the control that has the focus and to the nodes around it. For a shortcut of the whole window, put this on the window's root with `shortcutRoot`, which holds the focus while nothing else does: without it a shortcut is not heard until something has been focused.

```kotlin
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { palette = true }) { … }
```

Of two shortcuts one key presses, the outer one runs. The key going up after a shortcut ran is kept from the focused control too, so that a button pressed by Enter does not take it for a press of its own. While the theme's diagnostics are on, a shortcut that a node around this one hears as well is reported as `PantrixCheck.ShadowedShortcut`: it never runs here.

Parameters:

- `shortcut: PantrixShortcut`: the key and the modifiers that run it.
- `enabled: Boolean`: whether it runs: one that is not lets its key through.
- `onTrigger: () -> Unit`: what it runs.

Documented on: [Command Palette](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/command-palette.md), [Keyboard shortcuts](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### Modifier.shortcutRoot

`import com.pantrixui.foundation.keyboard.shortcutRoot`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.shortcutRoot(): Modifier
```

Makes this node hold the focus while nothing inside it does, so that the shortcuts on it and around it are given the keys pressed then.

A key is given to the control that has the focus and to the nodes around that control. While nothing has the focus, at first, before anything has been focused, and after the focus has been cleared, it is given to none of them, and a shortcut on a window's root is not heard. This node takes the focus at those times, and gives it to whatever asks for it. It draws nothing, says nothing to a screen reader and is no stop for Tab: Tab from it goes into what it holds.

Put it once on a window's root, with the window's shortcuts (`onShortcut`). A modal of Pantrix's is a window of its own over this one, and the focus under it stays where it was while it is open. Where two roots stand side by side in one window, as two screens do for a moment while one gives way to the other, the one that has the focus keeps it.

Documented on: [Command Palette](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/command-palette.md), [Keyboard shortcuts](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

## Package com.pantrixui.foundation.l10n

### PantrixLocale

`import com.pantrixui.foundation.l10n.PantrixLocale`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLocale(
    public val languageTag: String,
    public val layoutDirection: LayoutDirection,
    public val firstDayOfWeek: Int = firstDayOfWeekOf(languageTag)
)
```

A language, the direction its script runs in, and the day its calendars start a week on. `forLanguageTag` works the direction out from the tag.

Parameters:

- `languageTag: String`: The language as a BCP 47 tag, e.g. `tr`, `en-GB`, `ar`.
- `layoutDirection: LayoutDirection`: The direction the language's script runs in: right to left for Arabic.
- `firstDayOfWeek: Int`: The day a week starts on in the language's calendars, as ISO 8601 numbers the days: 1 is Monday and 7 is Sunday. Unless given, Monday in Turkish, Saturday in Arabic, and Sunday in English and in every other language. A date picker that is given no first day of its own starts its weeks on this one. `firstDayOfWeekOf`: The day `languageTag`'s calendars start a week on: Monday in Turkish, Saturday in Arabic, Sunday otherwise.

Members:

- `language: String`: The primary subtag, lower-cased: `en-GB` -> `en`.

On the type:

- `PantrixLocale.English: PantrixLocale`: English, written from left to right, its weeks starting on Sunday.
- `PantrixLocale.Turkish: PantrixLocale`: Turkish, written from left to right, its weeks starting on Monday.
- `PantrixLocale.Arabic: PantrixLocale`: Arabic, written from right to left, its weeks starting on Saturday.
- `PantrixLocale.forLanguageTag(tag: String): PantrixLocale`: Builds a locale from a tag, inferring direction.

  `tag`: the language as a BCP 47 tag, `tr`, `en-GB` or `ar`: its primary subtag decides the direction and the day a week starts on.

Documented on: [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md), [Language and words](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### LocalPantrixLocale

`import com.pantrixui.foundation.l10n.LocalPantrixLocale`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixLocale: ProvidableCompositionLocal<PantrixLocale>
```

The language in effect, which `PantrixTheme` provides: what `PantrixTheme.locale` reads. Outside a theme, English.

Documented on: [Language and words](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### PantrixStrings

`import com.pantrixui.foundation.l10n.PantrixStrings`, from `com.pantrixui:foundation`

```kotlin
data class PantrixStrings(
    public val loading: String = "Loading",
    public val on: String = "On",
    public val off: String = "Off",
    public val indeterminate: String = "Partially selected",
    public val invalidInput: String = "Invalid input",
    public val required: String = "Required",
    public val close: String = "Close",
    public val clear: String = "Clear",
    public val characterCountTemplate: String = "Characters entered: {count} of {max}",
    public val showPassword: String = "Show password",
    public val hidePassword: String = "Hide password",
    public val removeTemplate: String = "Remove {label}",
    public val noOptions: String = "No options",
    public val noMatches: String = "No matches",
    public val search: String = "Search",
    public val back: String = "Back",
    public val expanded: String = "Expanded",
    public val collapsed: String = "Collapsed",
    public val breadcrumb: String = "Breadcrumb",
    public val currentPage: String = "Current page",
    public val showFullPath: String = "Show full path",
    public val previousSlide: String = "Previous slide",
    public val nextSlide: String = "Next slide",
    public val slidePositionTemplate: String = "Slide {position} of {count}",
    public val pauseSlides: String = "Pause slides",
    public val playSlides: String = "Play slides",
    public val itemCountTemplate: String = "Items: {count}",
    public val jsonUnreadableTemplate: String = "JSON could not be read: line {line}, column {column}",
    public val copy: String = "Copy",
    public val copied: String = "Copied",
    public val levelTemplate: String = "Level {level}",
    public val pagination: String = "Pagination",
    public val previousPage: String = "Previous page",
    public val nextPage: String = "Next page",
    public val pageTemplate: String = "Page {page}",
    public val pageOfTemplate: String = "Page {page} of {count}",
    public val firstPage: String = "First page",
    public val lastPage: String = "Last page",
    public val perPage: String = "Per page",
    public val goToPage: String = "Go to page",
    public val sortedAscending: String = "Sorted ascending",
    public val sortedDescending: String = "Sorted descending",
    public val notSorted: String = "Not sorted",
    public val sortOrderTemplate: String = "Sort order {position}",
    public val selectRow: String = "Select row",
    public val selectRowTemplate: String = "Select {label}",
    public val selectAllRows: String = "Select all rows",
    public val rowDetails: String = "Details",
    public val rowDetailsTemplate: String = "Details of {label}",
    public val noRows: String = "No rows",
    public val rowRangeTemplate: String = "{first}–{last} of {count}",
    public val selectedCountTemplate: String = "{count} selected",
    public val columnWidthTemplate: String = "Width of {label}",
    public val chart: String = "Chart",
    public val flowFromTemplate: String = "From {label}",
    public val flowToTemplate: String = "To {label}",
    public val openingValue: String = "Open",
    public val highestValue: String = "High",
    public val lowestValue: String = "Low",
    public val closingValue: String = "Close",
    public val zoomIn: String = "Zoom in",
    public val zoomOut: String = "Zoom out",
    public val resetZoom: String = "Reset zoom",
    public val scrollBack: String = "Scroll back",
    public val scrollForward: String = "Scroll forward",
    public val rangeInView: String = "Range in view",
    public val rangeTemplate: String = "{first} to {last}",
    public val exportChart: String = "Export",
    public val noData: String = "No data",
    public val total: String = "Total",
    public val moreTemplate: String = "+{count} more",
    public val monthNames: List<String> = ENGLISH_MONTHS,
    public val dayMonthTemplate: String = "{month} {day}",
    public val monthYearTemplate: String = "{month} {year}",
    public val dateTemplate: String = "{month} {day}, {year}",
    public val digits: String = "0123456789",
    public val decimalSeparator: String = ".",
    public val groupSeparator: String = ",",
    public val percentTemplate: String = "{number}%",
    public val thousandsTemplate: String = "{number}K",
    public val millionsTemplate: String = "{number}M",
    public val billionsTemplate: String = "{number}B",
    public val trillionsTemplate: String = "{number}T",
    public val shareOfFirstTemplate: String = "{label} of the first",
    public val shareOfPreviousTemplate: String = "{label} of the previous",
    public val others: String = "Other",
    public val today: String = "Today",
    public val commands: String = "Commands",
    public val searchCommands: String = "Search commands",
    public val dropFilesHere: String = "Drop files here",
    public val orChooseFiles: String = "or choose files",
    public val chooseFiles: String = "Choose files",
    public val orDropHere: String = "or drop them here",
    public val dropToAdd: String = "Drop to add",
    public val filesAddedTemplate: String = "Files added: {count}",
    public val filesRejectedTemplate: String = "Files not accepted: {count}",
    public val bytesTemplate: String = "{number} B",
    public val kilobytesTemplate: String = "{number} KB",
    public val megabytesTemplate: String = "{number} MB",
    public val gigabytesTemplate: String = "{number} GB",
    public val longMonthNames: List<String> = ENGLISH_LONG_MONTHS,
    public val weekdayNames: List<String> = ENGLISH_WEEKDAYS,
    public val shortWeekdayNames: List<String> = ENGLISH_SHORT_WEEKDAYS,
    public val longDateTemplate: String = "{weekday}, {month} {day}, {year}",
    public val longMonthYearTemplate: String = "{month} {year}",
    public val previousMonth: String = "Previous month",
    public val nextMonth: String = "Next month",
    public val chooseYear: String = "Choose year",
    public val rangeStart: String = "Range start",
    public val inRange: String = "In range",
    public val rangeEnd: String = "Range end",
    public val hour: String = "Hour",
    public val minute: String = "Minute",
    public val period: String = "AM/PM",
    public val am: String = "AM",
    public val pm: String = "PM",
    public val twelveHourTemplate: String = "{time} {period}",
    public val timeWords: PantrixTimeWords = PantrixTimeWords.English,
    public val quickSelect: String = "Quick select",
    public val dateQuickSelect: String = "Date quick select",
    public val commonlyUsed: String = "Commonly used",
    public val recentlyUsed: String = "Recently used",
    public val lastTime: String = "Last",
    public val nextTime: String = "Next",
    public val apply: String = "Apply",
    public val update: String = "Update",
    public val refresh: String = "Refresh",
    public val previousTimeWindow: String = "Previous time window",
    public val nextTimeWindow: String = "Next time window",
    public val absoluteTime: String = "Absolute",
    public val relativeTime: String = "Relative",
    public val nowTime: String = "Now",
    public val nowTimeExplained: String =
        "Setting the time to now means that on every refresh this time is set to the time of the refresh.",
    public val setStartToNow: String = "Set start date and time to now",
    public val setEndToNow: String = "Set end date and time to now",
    public val startDate: String = "Start date",
    public val endDate: String = "End date",
    public val needsUpdating: String = "Needs updating",
    public val invalidDate: String = "Invalid date",
    public val showDates: String = "Show dates",
    public val thisWeek: String = "This week",
    public val thisMonth: String = "This month",
    public val thisYear: String = "This year",
    public val yesterday: String = "Yesterday",
    public val weekToDate: String = "Week to date",
    public val monthToDate: String = "Month to date",
    public val yearToDate: String = "Year to date",
    public val timeTense: String = "Time tense",
    public val timeValue: String = "Time value",
    public val timeUnit: String = "Time unit",
    public val autoRefresh: String = "Auto refresh",
    public val refreshEvery: String = "Refresh every",
    public val timeZone: String = "Time zone",
    public val secondsShort: String = "s",
    public val minutesShort: String = "m",
    public val hoursShort: String = "h",
    public val dayLetters: String = "DD",
    public val monthLetters: String = "MM",
    public val yearLetters: String = "YYYY",
    public val day: String = "Day",
    public val month: String = "Month",
    public val year: String = "Year",
    public val openCalendar: String = "Open calendar",
    public val dateFormatTemplate: String = "Enter the date as {pattern}",
    public val noSuchDay: String = "There is no such day",
    public val dayNotAllowed: String = "This day cannot be chosen",
    public val dateBetweenTemplate: String = "Choose a day from {start} to {end}",
    public val dateFromTemplate: String = "Choose {start} or a later day",
    public val dateUntilTemplate: String = "Choose {end} or an earlier day",
    public val hourLetters: String = "HH",
    public val minuteLetters: String = "MM",
    public val chooseTime: String = "Choose time",
    public val timeFormatTemplate: String = "Enter the time as {pattern}",
    public val noSuchTime: String = "There is no such time",
    public val timeBetweenTemplate: String = "Choose a time from {start} to {end}",
    public val timeFromTemplate: String = "Choose {start} or a later time",
    public val timeUntilTemplate: String = "Choose {end} or an earlier time",
    public val listWidth: String = "List width",
    public val supportingPaneWidth: String = "Supporting pane width",
    public val diagnostics: String = "Diagnostics",
    public val findingCountTemplate: String = "Findings: {count}",
    public val notOnScreen: String = "Not on screen",
    public val moreActions: String = "More actions",
    public val overLimitTemplate: String = "{count} over the limit",
    public val tooLong: String = "Too long",
    public val saveFile: String = "Save file"
)
```

What components say or announce themselves, in one language. `forLocale` picks the pack for a locale, and English stands in for a language without one.

Every field's default is its English. An app's own pack names the fields it has words for, `PantrixStrings(loading = "Laden", close = "Schließen")`, and goes on compiling when a new component brings a new field: that one is said in English until the pack has words for it, which is heard and can be mended, where a build that broke could not ship.

Parameters:

- `loading: String`: What a spinner, a skeleton and a loading button are announced as.
- `on: String`: A toggle's state when it is on, as a screen reader reads it out.
- `off: String`: A toggle's state when it is off, as a screen reader reads it out.
- `indeterminate: String`: A checkbox's state when some of what it stands for is chosen and some is not, as a screen reader reads it out.
- `invalidInput: String`: What a control in error is announced as where it has no message of its own: a checkbox, a radio button, a switch or a select.
- `required: String`: What a field that has to be filled in is said to be, "Required". No component of the library says it itself.
- `close: String`: What the button that closes something is called: a dialog's, a sheet's, an alert's and a snackbar's.
- `clear: String`: What the button that empties a text field is called, and the one that clears a diagnostics inspector's findings.
- `characterCountTemplate: String`: What a text field's counter is announced as, with `{count}` where the number of characters entered goes and `{max}` where the limit does. `characterCount` fills it in.
- `showPassword: String`: What the button in a secure text field is called while the text is hidden: pressing it shows what was typed.
- `hidePassword: String`: What the same button is called while the text is shown: pressing it hides the text again.
- `removeTemplate: String`: What the button that takes an item out is called, with `{label}` where the item's own name goes: a chip's remove button. `remove` fills it in.
- `noOptions: String`: What a list of choices says in place of its rows while it has none: a select with no options.
- `noMatches: String`: What a list that is being searched says while nothing in it matches what was typed.
- `search: String`: What a field that searches a list is called, and what it shows while it is empty, where its caller gives it no words of its own.
- `back: String`: What the button that goes back to the screen before is called: a top bar's back button.
- `expanded: String`: The state of what is open, as a screen reader reads it out where the reader does not tell it by itself: an accordion's section, a sidebar's.
- `collapsed: String`: The same of what is closed.
- `breadcrumb: String`: What a trail of the pages above the one on screen is called: a breadcrumb's row.
- `currentPage: String`: The state of the page on screen in such a trail, as a screen reader reads it out.
- `showFullPath: String`: What the button that shows the pages a long trail has folded away is called.
- `previousSlide: String`: What the button that turns a carousel back a slide is called.
- `nextSlide: String`: What the button that turns a carousel on a slide is called.
- `slidePositionTemplate: String`: Where a carousel is, as a screen reader reads it out, with `{position}` where the slide's number goes and `{count}` where the number of slides does. `slidePosition` fills it in.
- `pauseSlides: String`: What the button that stops a carousel from turning by itself is called.
- `playSlides: String`: What the same button is called while the carousel is stopped: it lets it turn again.
- `itemCountTemplate: String`: How many things a folded part holds, as a screen reader reads it out, with `{count}` where the number goes: a JSON view's closed object or array, which shows the number alone. `itemCount` fills it in.
- `jsonUnreadableTemplate: String`: What a JSON view says over a text that is not JSON, with `{line}` and `{column}` where the place it stopped reading at goes. `jsonUnreadable` fills it in.
- `copy: String`: What the button that puts something on the clipboard is called: a JSON view's.
- `copied: String`: What that button is called, and says, right after it has done so.
- `levelTemplate: String`: How deep a part of a tree is, as a screen reader reads it out, with `{level}` where the number goes: a line of a JSON view, which shows it by its indent alone. `level` fills it in.
- `pagination: String`: What the row that moves between the pages of a long list is called: a pagination's.
- `previousPage: String`: What the button that goes back a page in such a row is called.
- `nextPage: String`: What the button that goes on a page in such a row is called.
- `pageTemplate: String`: What a page's button in such a row is called, with `{page}` where its number goes: the button shows the number alone. `page` fills it in.
- `pageOfTemplate: String`: Where such a row is, as it is written between the two buttons of a row too narrow for the pages' numbers, with `{page}` where the page's number goes and `{count}` where the number of pages does. `pageOf` fills it in.
- `firstPage: String`: What the button that goes to the first page of such a row is called.
- `lastPage: String`: What the button that goes to its last page is called.
- `perPage: String`: What stands before the choice of how many things a page of a list shows, and names that choice.
- `goToPage: String`: What stands before the field a page's number is typed in to go to it, and names that field.
- `sortedAscending: String`: The state of a table's column the rows are in the order of, smallest first, as a screen reader reads it out: a data table's header shows it by an arrow alone.
- `sortedDescending: String`: The same of a column the rows are in the order of, largest first.
- `notSorted: String`: The same of a column that can be pressed for its order and is not the one the rows are in.
- `sortOrderTemplate: String`: Which place a column has among the columns a table is in the order of, as a screen reader reads it out, with `{position}` where the number goes: the header shows the number alone. `sortOrder` fills it in.
- `selectRow: String`: What the box that chooses a row of a table is called, where the row has no name of its own.
- `selectRowTemplate: String`: What that box is called where the row has a name, with `{label}` where the name goes. `selectRow` fills it in.
- `selectAllRows: String`: What the box in a table's header that chooses every row is called.
- `rowDetails: String`: What the button that opens what a row of a table has under it is called, where the row has no name of its own.
- `rowDetailsTemplate: String`: What that button is called where the row has a name, with `{label}` where the name goes. `rowDetails` fills it in.
- `noRows: String`: What a table says in place of its rows while it has none.
- `rowRangeTemplate: String`: Which rows of how many a page of a table shows, as a table's foot writes it, with `{first}` and `{last}` where the first and the last row's numbers go and `{count}` where the number of all the rows does. `rowRange` fills it in.
- `selectedCountTemplate: String`: How many rows of a table are chosen, as a bar over the table writes it, with `{count}` where the number goes. `selectedCount` fills it in.
- `columnWidthTemplate: String`: What the end of a table's header is called, which a keyboard and a screen reader make its column wider and narrower by, with `{label}` where the column's name goes. `columnWidth` fills it in.
- `chart: String`: What a chart is called where it is given no description of its own: a screen reader says it before the names of the chart's series.
- `flowFromTemplate: String`: What a flow into a node of a sankey is called, in the node's tooltip and to a screen reader, with `{label}` where the name of the node it comes from goes. `flowFrom` fills it in.
- `flowToTemplate: String`: What a flow out of a node of a sankey is called, with `{label}` where the name of the node it goes to goes. `flowTo` fills it in.
- `openingValue: String`: What the value a candle of a chart opened at is called, in the candle's tooltip and to a screen reader, before the value itself.
- `highestValue: String`: What the highest value a candle reached is called.
- `lowestValue: String`: What the lowest value a candle reached is called.
- `closingValue: String`: What the value a candle closed at is called.
- `zoomIn: String`: What the button that looks closer at a chart is called.
- `zoomOut: String`: What the button that looks at a chart from further off is called.
- `resetZoom: String`: What the button that shows all of a chart again is called.
- `scrollBack: String`: What the button that moves a chart that is looked at closer towards its start is called.
- `scrollForward: String`: What the button that moves it towards its end is called.
- `rangeInView: String`: What the strip under a chart is called on which the part of the chart that is in view is marked, and moved: a screen reader says it before that part.
- `rangeTemplate: String`: A stretch from one thing to another, with `{first}` and `{last}` where their names go: how the part of a chart that is in view is said, from its first place to its last. `range` fills it in.
- `exportChart: String`: What the button that takes a chart out of the app as a file is called.
- `noData: String`: What a chart says while it has no value to draw: written in its plot, and to a screen reader.
- `total: String`: What the sum of a chart's stack is called: the row a tooltip writes it in, after the stack's values.
- `moreTemplate: String`: What a list says in the place of the rows it has no room for, with `{count}` where their number goes: a chart's tooltip under the rows it shows. `more` fills it in.
- `monthNames: List<String>`: The twelve months by their short names, January first: what `month` names a month by, and so every date these words write.
- `dayMonthTemplate: String`: A day of a year without the year, with `{day}` and `{month}` where the day's number and the month's name go: what a chart's axis of time writes at a day. `dayMonth` fills it in.
- `monthYearTemplate: String`: A month of a year, with `{month}` and `{year}`. `monthYear` fills it in.
- `dateTemplate: String`: A day, with `{day}`, `{month}` and `{year}`. `date` fills it in.
- `digits: String`: The ten digits numbers are written in, from nought to nine: what `number` writes a number with, and so every number these words hold. The Arabic pack has the digits Arabic is written with; give it the English pack's `digits` to write them as English does.
- `decimalSeparator: String`: What stands between the whole of a quantity and its fraction: English's point, Turkish's comma. `decimal`, `compact` and `percent` write with it.
- `groupSeparator: String`: What stands between each three digits of a quantity's whole, counted from its end: English's comma, Turkish's point. Empty for a language that writes its digits in one run.
- `percentTemplate: String`: A share of a hundred, with `{number}` where the number goes: the sign after it in English, before it in Turkish. `percent` fills it in.
- `thousandsTemplate: String`: A quantity counted in thousands, written short, with `{number}` where the number of thousands goes: `{number}K`. `compact` fills it in, as it does the three after it.
- `millionsTemplate: String`: The same of a quantity counted in millions.
- `billionsTemplate: String`: The same of a quantity counted in thousands of millions.
- `trillionsTemplate: String`: The same of a quantity counted in millions of millions, and of every larger one.
- `shareOfFirstTemplate: String`: What a stage of a funnel is as a share of the first stage, in the stage's tooltip and to a screen reader, with `{label}` where the share, written, goes. `shareOfFirst` fills it in.
- `shareOfPreviousTemplate: String`: What it is as a share of the stage before it. `shareOfPrevious` fills it in.
- `others: String`: What the one slice a pie gathers its smallest slices into is called.
- `today: String`: What the moment a Gantt chart is read at is called, over its line and to a screen reader.
- `commands: String`: What a list of the app's commands is called, as a screen reader announces it when it opens: a command palette's.
- `searchCommands: String`: What the field that searches the app's commands shows while it is empty, where its caller gives it no words of its own.
- `dropFilesHere: String`: What a drop zone says first where files are dragged in: on the desktop and the web.
- `orChooseFiles: String`: What it says under that: the press that opens the picker.
- `chooseFiles: String`: What a drop zone says first where files are chosen rather than dragged in: on a phone. The title of the desktop's window for choosing files too.
- `orDropHere: String`: What it says under that: a tablet's drag, another app's beside it.
- `dropToAdd: String`: What a drop zone says while something is dragged over it.
- `filesAddedTemplate: String`: How many files a drop zone took, as a screen reader is told it, with `{count}` where the number goes. `filesAdded` fills it in.
- `filesRejectedTemplate: String`: How many it did not take, of a kind or a size it does not take. `filesRejected` fills it in.
- `bytesTemplate: String`: A file's size under a thousand bytes, with `{number}` where the number goes: `{number} B`. `fileSize` fills it in, as it does the three after it.
- `kilobytesTemplate: String`: The same counted in thousands of bytes: `{number} KB`.
- `megabytesTemplate: String`: The same counted in millions of bytes.
- `gigabytesTemplate: String`: The same counted in thousands of millions of bytes, and of every larger size.
- `longMonthNames: List<String>`: The twelve months by their full names, January first: what `longMonth` names a month by, and so a calendar's title and a day said in full.
- `weekdayNames: List<String>`: The seven days of the week by their full names, Monday first, as ISO 8601 numbers them: what `weekday` names a day by, and so a day said in full.
- `shortWeekdayNames: List<String>`: The same by the short names a calendar writes over its columns: `Mo`, and `Pt` in Turkish. `shortWeekday` gives them.
- `longDateTemplate: String`: A day said in full, with `{weekday}`, `{day}`, `{month}` and `{year}`: what a screen reader hears a calendar's day as. `longDate` fills it in.
- `longMonthYearTemplate: String`: A month of a year with the month's full name, with `{month}` and `{year}`: a calendar's title. `longMonthYear` fills it in.
- `previousMonth: String`: What the button that turns a calendar back a month is called.
- `nextMonth: String`: What the button that turns a calendar on a month is called.
- `chooseYear: String`: What pressing a calendar's title does, as a screen reader tells it: it shows the years to choose from in place of the days.
- `rangeStart: String`: The state of the first day of a stretch of days on a calendar, as a screen reader reads it out.
- `inRange: String`: The state of a day between its first day and its last.
- `rangeEnd: String`: The state of its last day.
- `hour: String`: What a time picker's column of hours is called, over it and to a screen reader.
- `minute: String`: What its column of minutes is called.
- `period: String`: What its column of the two halves of the day is called, where the clock has twelve hours: `AM/PM`, and `ÖÖ/ÖS` in Turkish.
- `am: String`: The half of the day before noon, as a clock of twelve hours writes it: `AM`.
- `pm: String`: The half after noon: `PM`.
- `twelveHourTemplate: String`: A time by a clock of twelve hours, with `{time}` where the hour and the minute go and `{period}` where the half of the day does: `{time} {period}`, `2:05 PM`. `time` fills it in.
- `timeWords: PantrixTimeWords`: The phrases that count time, a function for each: "Last 15 minutes", "~ 2 hours ago". `PantrixTimeWords.English`, `.Turkish` and `.Arabic` come with the packs.
- `quickSelect: String`: What an elastic date picker's choice of a range by an amount and a unit is called, over it.
- `dateQuickSelect: String`: What the button that opens an elastic date picker's quick menu is called, to a screen reader.
- `commonlyUsed: String`: The title over the ranges a quick menu offers by name.
- `recentlyUsed: String`: The title over the ranges a reader chose lately.
- `lastTime: String`: The choice of a range that ends now, beside an amount: Last 15 minutes.
- `nextTime: String`: The choice of a range that starts now: Next 15 minutes.
- `apply: String`: What the button that takes a choice is called.
- `update: String`: What the button that takes an edit of a range that waits is called.
- `refresh: String`: What the button that reads a range again is called.
- `previousTimeWindow: String`: What the button that moves a range back by its own length is called.
- `nextTimeWindow: String`: What the button that moves it on by its length is called.
- `absoluteTime: String`: The tab of an end of a range that is a moment on the calendar.
- `relativeTime: String`: The tab of an end that is an amount of time from now.
- `nowTime: String`: The tab of an end that is now.
- `nowTimeExplained: String`: What the tab of an end that is now says of it.
- `setStartToNow: String`: What the button that makes a range's start now is called.
- `setEndToNow: String`: What the button that makes a range's end now is called.
- `startDate: String`: What the start of a range is called, on its button and to a screen reader.
- `endDate: String`: What its end is called.
- `needsUpdating: String`: What a screen reader is told of an end whose edit waits.
- `invalidDate: String`: What it is told of an end that falls before the start.
- `showDates: String`: What a press on that button does, as a screen reader tells it.
- `thisWeek: String`: A range by its name: the week of now.
- `thisMonth: String`: The month of now.
- `thisYear: String`: The year of now.
- `yesterday: String`: The day before today.
- `weekToDate: String`: From the start of the week to now.
- `monthToDate: String`: From the start of the month to now.
- `yearToDate: String`: From the start of the year to now.
- `timeTense: String`: The name a screen reader hears of the choice between the last and the next amount of time.
- `timeValue: String`: The name of the field of an amount of time.
- `timeUnit: String`: The name of the choice of a unit of time.
- `autoRefresh: String`: What a picker's refresh by itself is called: on the field that sets nothing else.
- `refreshEvery: String`: The switch that turns the refresh by itself on, before its amount and unit.
- `timeZone: String`: What the line naming the time zone a picker's moments are in starts with.
- `secondsShort: String`: A second written short after a number, where the room is a word's: "5 s".
- `minutesShort: String`: A minute written short: "5 m".
- `hoursShort: String`: An hour written short: "5 h".
- `dayLetters: String`: What a date field's pattern writes a day's two digits as: "DD" in "DD/MM/YYYY", the pattern its box shows while it is empty and its error names.
- `monthLetters: String`: What it writes a month's two digits as.
- `yearLetters: String`: What it writes a year's four digits as.
- `day: String`: The name of a day's part of a date, as a screen reader is told the order a date field takes them in.
- `month: String`: The name of a month's part.
- `year: String`: The name of a year's part.
- `openCalendar: String`: What a date field's button that opens its calendar is called.
- `dateFormatTemplate: String`: What a date field says of a date that is not written whole, with `{pattern}` where its pattern goes.
- `noSuchDay: String`: What it says of a date the calendar has no such day for: the 31st of February.
- `dayNotAllowed: String`: What it says of a day that is there but cannot be chosen.
- `dateBetweenTemplate: String`: What it says of a day before its first or after its last, with `{start}` and `{end}` where they go.
- `dateFromTemplate: String`: What it says of a day before its first, where it has no last.
- `dateUntilTemplate: String`: What it says of a day after its last, where it has no first.
- `hourLetters: String`: What a time field's pattern writes an hour's two digits as: "HH" in "HH:MM", the pattern its box shows while it is empty and its error names.
- `minuteLetters: String`: What it writes a minute's two digits as.
- `chooseTime: String`: What a time field's button that opens its picker is called.
- `timeFormatTemplate: String`: What a time field says of a time that is not written whole, with `{pattern}` where its pattern goes.
- `noSuchTime: String`: What it says of a time the clock has not: 25 o'clock, or a 60th minute.
- `timeBetweenTemplate: String`: What it says of a time before its first or after its last, with `{start}` and `{end}` where they go.
- `timeFromTemplate: String`: What it says of a time before its first, where it has no last.
- `timeUntilTemplate: String`: What it says of a time after its last, where it has no first.
- `listWidth: String`: What the handle between a list and its detail is called, which a keyboard and a screen reader make the list wider and narrower by.
- `supportingPaneWidth: String`: What the handle between a screen's main content and its supporting pane is called, which a keyboard and a screen reader make the supporting pane wider and narrower by.
- `diagnostics: String`: What the list of what a theme's diagnostics have found is called: a diagnostics inspector's.
- `findingCountTemplate: String`: How many findings the diagnostics have, as the button that opens their list is read out, with `{count}` where the number goes. `findingCount` fills it in.
- `notOnScreen: String`: What a finding whose node is gone, or that has none, says in place of being shown on the screen.
- `moreActions: String`: What the button that opens the actions a page's bar has no room for is called.
- `overLimitTemplate: String`: What a text area's counter says once its text is past its limit, with `{count}` where the number of characters past it goes. `overLimit` fills it in.
- `tooLong: String`: What a text area bound to a form's field says is wrong with a text past its limit: the field's error, under which the counter says how far past it the text is.
- `saveFile: String`: What the desktop's window for keeping a file the app made is called, over the place the user chooses.

Members:

- `fun number(value: Int): String`: `value` in this language's digits: `12` as `12`, and as `١٢` where the digits are Arabic's. A sign before the number is kept as it is. What a component writes a number with where it shows one: a page's number, a count.
- `fun decimal(value: Number, fractionDigits: Int = 2, minFractionDigits: Int = 0, grouped: Boolean = true): String`: `value` as a quantity is written in this language: `1234.5` as `1,234.5`, as `1.234,5` in Turkish and as `١٬٢٣٤٫٥` in Arabic. What a chart writes beside its axis, and what any screen writes an amount or a measure with. A number that only counts or names, a page's or a year's, is `number`'s, which puts no mark between its digits.

  It is rounded to `fractionDigits` after the mark, a half away from nought, and the noughts that end a fraction are left out down to `minFractionDigits`: `2.50` is `2.5`, and `2.50` with two of both. A Double holds fifteen digits to be trusted, and what is asked for past them is not written.

  The same on every platform: it is worked out here, and asks no platform for its own format.

  `grouped`: whether each three digits of the whole are set apart by `groupSeparator`.
- `fun compact(value: Number, fractionDigits: Int = 1): String`: `value` written short, by the thousand: `1234` as `1.2K`, `2500000` as `2.5M`, and in Turkish as `1,2 B` and `2,5 Mn`. What stands where there is no room for every digit: beside a chart's axis, in a badge, on a card. Below a thousand it is `decimal`'s.

  It is rounded to `fractionDigits` after the mark and written without the noughts that end a fraction; a number that rounds up to a thousand of its kind is one of the next, `999950` being `1M` and not `1000K`.
- `fun percent(share: Number, fractionDigits: Int = 0): String`: `share` of a whole as a share of a hundred: `0.256` as `26%`, as `%26` in Turkish, and `1.0` as `100%`. `fractionDigits` are those of the number before the sign: `0.256` with one is `25.6%`.
- `fun characterCount(count: Int, max: Int): String`: `Characters entered: {count} of {max}` as `Characters entered: 12 of 40`: what a screen reader says for a text field's counter, which shows digits alone.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many characters the field holds.

  `max`: how many characters it may hold.
- `fun remove(label: String): String`: `Remove {label}` as `Remove Kotlin`: what a screen reader says for the button that takes `label` out, so that a row of such buttons can be told apart.

  The name goes in as it is written, with no ending added to it, which a template could not get right in a language that inflects.
- `fun slidePosition(position: Int, count: Int): String`: `Slide {position} of {count}` as `Slide 2 of 5`: what a screen reader says for where a carousel is, which shows dots alone. `position` counts from one.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many slides the carousel has.
- `fun itemCount(count: Int): String`: `Items: {count}` as `Items: 3`: what a screen reader says for how many things a folded object or array of a JSON view holds, which shows the number alone.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many items the folded object or array holds.
- `fun findingCount(count: Int): String`: `Findings: {count}` as `Findings: 3`: what a screen reader says for the button of a diagnostics inspector, which shows the number alone. Worded, as `itemCount` is, so that no language needs the number to agree with a noun.

  `count`: how many findings the inspector holds.
- `fun overLimit(count: Int): String`: `{count} over the limit` as `12 over the limit`: what a text area's counter says, and a screen reader is told, once its text is past its limit. Worded, as `itemCount` is, so that no language needs the number to agree with a noun.

  `count`: how many characters the text is past its limit.
- `fun jsonUnreadable(line: Int, column: Int): String`: `JSON could not be read: line {line}, column {column}` as `JSON could not be read: line 3, column 14`: what a JSON view says over a text it could not read, with the place it stopped at. Both count from one.

  `line`: the line the reading stopped at.

  `column`: the column the reading stopped at.
- `fun level(level: Int): String`: `Level {level}` as `Level 2`: what a screen reader says for how deep a part of a tree is, which the eye is told by an indent. `level` counts from one: the outermost part is at the first level.
- `fun page(page: Int): String`: `Page {page}` as `Page 4`: what a screen reader says for a page's button in a pagination, which shows the number alone. `page` counts from one.
- `fun pageOf(page: Int, count: Int): String`: `Page {page} of {count}` as `Page 3 of 10`: where a pagination is, written between its two buttons where the row is too narrow for the pages' numbers. `page` counts from one.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many pages there are.
- `fun sortOrder(position: Int): String`: `Sort order {position}` as `Sort order 2`: what a screen reader says for a column's place among the columns a table is in the order of, which the header shows as a number alone. `position` counts from one.
- `fun selectRow(label: String?): String`: `Select {label}` as `Select Order 4801`: what a screen reader says for the box that chooses the row named `label`, so that a column of such boxes can be told apart. A row without a name is `selectRow` alone.

  The name goes in as it is written, with no ending added to it, which a template could not get right in a language that inflects.
- `fun rowDetails(label: String?): String`: `Details of {label}` as `Details of Order 4801`: what a screen reader says for the button that opens what the row named `label` has under it. A row without a name is `rowDetails` alone.
- `fun rowRange(first: Int, last: Int, count: Int): String`: `{first}–{last} of {count}` as `11–20 of 48`: which rows of how many a page of a table shows, for a table's foot. `first` and `last` count from one.

  `count`: how many rows the table has in all.
- `fun selectedCount(count: Int): String`: `{count} selected` as `3 selected`: how many rows of a table are chosen, for a bar of what can be done with them.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many rows are chosen.
- `fun columnWidth(label: String): String`: `Width of {label}` as `Width of City`: what a screen reader says for the end of the header of the column named `label`, where the column's width is changed. The width itself is said after it, as a number.
- `fun flowFrom(label: String): String`: `From {label}` as `From Visits`: what a sankey calls a flow that comes into a node from the node named `label`.
- `fun flowTo(label: String): String`: `To {label}` as `To Sign-ups`: what a sankey calls a flow that goes out of a node to the node named `label`.
- `fun shareOfFirst(share: String): String`: `{label} of the first` as `41.3% of the first`: a stage of a funnel as `share`, written, of the first stage.
- `fun shareOfPrevious(share: String): String`: `{label} of the previous` as `52.1% of the previous`: a stage of a funnel as `share` of the stage before it.
- `fun more(count: Int): String`: `+{count} more` as `+3 more`: what a list says in the place of the `count` rows it has no room for, as a chart's tooltip does under those it shows.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.
- `fun dateFormat(pattern: String): String`: `Enter the date as {pattern}` as `Enter the date as MM/DD/YYYY`: a date field's error for a date not whole.

  `pattern`: the order the field takes a date in, as this language writes it: `MM/DD/YYYY`.
- `fun dateBetween(start: String, end: String): String`: `Choose a day from {start} to {end}` as `Choose a day from Oct 1, 2026 to Oct 31, 2026`: a date field's error for a day outside `start` and `end`, both written.
- `fun dateFrom(start: String): String`: `Choose {start} or a later day`: a date field's error for a day before `start`, written, which has no last.
- `fun dateUntil(end: String): String`: `Choose {end} or an earlier day`: a date field's error for a day after `end`, written, which has no first.
- `fun timeFormat(pattern: String): String`: `Enter the time as {pattern}` as `Enter the time as HH:MM`: a time field's error for a time not whole.

  `pattern`: how the field takes a time, as this language writes it: `HH:MM`.
- `fun timeBetween(start: String, end: String): String`: `Choose a time from {start} to {end}` as `Choose a time from 09:00 to 18:00`: a time field's error for a time outside `start` and `end`, both written.
- `fun timeFrom(start: String): String`: `Choose {start} or a later time`: a time field's error for a time before `start`, written, which has no last.
- `fun timeUntil(end: String): String`: `Choose {end} or an earlier time`: a time field's error for a time after `end`, written, which has no first.
- `fun filesAdded(count: Int): String`: `Files added: {count}` as `Files added: 2`: how many files a drop zone took, told to a screen reader.

  `count`: how many files the drop zone took.
- `fun filesRejected(count: Int): String`: `Files not accepted: {count}` as `Files not accepted: 1`: how many it did not take.

  `count`: how many files it did not take.
- `fun fileSize(bytes: Long): String`: `bytes` as a file's size: `512 B`, `1.2 KB`, `34 MB`, and `1,2 KB` in Turkish. A size is counted by the thousand, as Android's and Apple's systems count it, and written with one digit after the mark under ten of its kind and none from ten on; one that rounds up to a thousand of its kind is one of the next, `999999` being `1 MB`. Sizes past the gigabytes are written in gigabytes.
- `fun range(first: String, last: String): String`: `{first} to {last}` as `Mar to Jul`: a stretch from the thing named `first` to the one named `last`, as the part of a chart that is in view is said.
- `fun month(month: Int): String`: The short name of the month `month` of a year, counted from one for January: `Oct` for ten. A month before the first is taken for January and one past the twelfth for December.
- `fun dayMonth(day: Int, month: Int): String`: A day of a year without its year, in this language's order and digits: `Oct 13`, and `13 Eki` in Turkish.

  `day`: the day of the month, from 1.

  `month`: the month, from 1 for January.
- `fun monthYear(month: Int, year: Int): String`: A month of a year: `Oct 2026`.

  `month`: the month, from 1 for January.

  `year`: the year.
- `fun date(day: Int, month: Int, year: Int): String`: A day: `Oct 13, 2026`, and `13 Eki 2026` in Turkish.

  `day`: the day of the month, from 1.

  `month`: the month, from 1 for January.

  `year`: the year.
- `fun clock(hour: Int, minute: Int, second: Int? = null): String`: A time of day by a clock of twenty-four hours, each part in two digits of this language's: `09:05`, and `09:05:07` where `second` is given.

  `hour`: the hour, from 0 to 23.

  `minute`: the minute, from 0 to 59.
- `fun time(hour: Int, minute: Int, second: Int? = null, is24Hour: Boolean): String`: A time of day in this language's digits, the hour `hour` counted by a clock of twenty-four: by twenty-four hours where `is24Hour`, as `clock` writes it, `22:05`; by twelve where not, the hour in no more digits than it has and the half of the day after it or before it as `twelveHourTemplate` puts it, `10:05 PM`, and `ÖS 10:05` in Turkish. Which clock is the caller's to say: a time picker's `is24Hour`.

  `minute`: the minute, from 0 to 59.

  `second`: the second, from 0 to 59, written after the minute where it is given.
- `fun longMonth(month: Int): String`: The full name of the month `month` of a year, counted from one for January: `October` for ten. A month before the first is taken for January and one past the twelfth for December, as `month` takes them.
- `fun weekday(dayOfWeek: Int): String`: The full name of the day of the week `dayOfWeek`, as ISO 8601 numbers the days: `Monday` for one and `Sunday` for seven. The days go round as the weeks do: eight is a Monday again, and nought a Sunday.
- `fun shortWeekday(dayOfWeek: Int): String`: The short name a calendar writes over the column of the day of the week `dayOfWeek`: `Mo` for one.
- `fun longMonthYear(month: Int, year: Int): String`: A month of a year by the month's full name: `October 2026`, a calendar's title.

  `month`: the month, from 1 for January.

  `year`: the year.
- `fun longDate(day: Int, month: Int, year: Int): String`: A day said in full, with the day of the week it falls on: `Saturday, October 17, 2026`, and `17 Ekim 2026 Cumartesi` in Turkish. What a screen reader hears a calendar's day as.

  `day`: the day of the month, from 1.

  `month`: the month, from 1 for January.

  `year`: the year.

On the type:

- `PantrixStrings.forLocale(locale: PantrixLocale): PantrixStrings`: Falls back to English for any language without a pack.

  Falling back is deliberate: an untranslated screen reader announcement is recoverable, an empty one is not.

  `locale`: the locale whose language the pack is wanted for: its primary subtag alone counts.
- `PantrixStrings.Arabic: PantrixStrings`: Pantrix's words in Arabic.
- `PantrixStrings.Turkish: PantrixStrings`: Pantrix's words in Turkish.
- `PantrixStrings.English: PantrixStrings`: English: every field's own default. A pack of another language names each field, and one it leaves out is said in English.

### LocalPantrixStrings

`import com.pantrixui.foundation.l10n.LocalPantrixStrings`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixStrings: ProvidableCompositionLocal<PantrixStrings>
```

The components' own words in effect, which `PantrixTheme` provides: what `PantrixTheme.strings` reads. Outside a theme, `PantrixStrings.English`.

Documented on: [Language and words](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### PantrixTimeWords

`import com.pantrixui.foundation.l10n.PantrixTimeWords`, from `com.pantrixui:foundation`

```kotlin
interface PantrixTimeWords
```

The phrases that count time: "Last 15 minutes", "~ 2 hours ago", "in 3 days".

A function for each phrase rather than a template: languages put the number, the unit and the direction in orders of their own, a noun's form follows the number by each language's rules of plurals, and Arabic says two of something by a dual that takes no number. Each function writes its number in the language's own digits.

`English`, `Turkish` and `Arabic` come with their packs. An app with words of its own, or a fourth language, writes one and gives it with its strings: `PantrixStrings.English.copy(timeWords = MyTimeWords)`. An amount is a count of units and never less than nought; the phrase says which way it goes.

Members:

- `now: String`: "now" inside a phrase: the end of "~ 15 minutes ago to now".
- `fun unit(unit: PantrixTimeUnit, count: Int): String`: The unit alone, in the form that goes with `count`: "minutes" beside a 15, in a choice of units.

  `unit`: the unit of time named.
- `fun unitAgo(unit: PantrixTimeUnit, count: Int): String`: The unit and "ago" beside a number: "minutes ago".

  `unit`: the unit of time named.

  `count`: the number the unit stands beside, which picks its form: "minute" beside a 1, "minutes" beside a 15.
- `fun unitFromNow(unit: PantrixTimeUnit, count: Int): String`: The unit and "from now" beside a number: "minutes from now".

  `unit`: the unit of time named.

  `count`: the number the unit stands beside, which picks its form: "minute" beside a 1, "minutes" beside a 15.
- `fun last(amount: Int, unit: PantrixTimeUnit): String`: A range that ends now: "Last 15 minutes".

  `amount`: how many of `unit` the range runs back from now: the 15 of "Last 15 minutes".

  `unit`: the unit the range is counted in.
- `fun next(amount: Int, unit: PantrixTimeUnit): String`: A range that starts now: "Next 15 minutes".

  `amount`: how many of `unit` the range runs on from now: the 15 of "Next 15 minutes".

  `unit`: the unit the range is counted in.
- `fun ago(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: A moment before now: "15 minutes ago", or "~ 2 hours ago" where `approximate`.

  `amount`: how many of `unit` the moment lies before now.

  `unit`: the unit the moment is counted in.
- `fun fromNow(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: A moment after now: "in 15 minutes", or "~ in 2 hours" where `approximate`.

  `amount`: how many of `unit` the moment lies after now.

  `unit`: the unit the moment is counted in.
- `fun roundTo(unit: PantrixTimeUnit): String`: The switch that rounds a moment: "Round to the minute".

  `unit`: the unit a moment is rounded to: "minute" in "Round to the minute".
- `fun roundedTo(phrase: String, unit: PantrixTimeUnit): String`: A `phrase` whose ends were rounded to `unit`: "Last 15 minutes, rounded to the minute".
- `fun range(start: String, end: String): String`: Two ends of a range, each already in words: "~ 15 minutes ago to now".

  `start`: the range's start, already in words: "~ 15 minutes ago".

  `end`: the range's end, already in words: "now".

On the type:

- `PantrixTimeWords.English: PantrixTimeWords`: A noun takes an s unless the count is one: "1 minute", "0 minutes", "15 minutes".
- `PantrixTimeWords.Turkish: PantrixTimeWords`: A noun after a number stays as it is: "15 dakika önce".
- `PantrixTimeWords.Arabic: PantrixTimeWords`: One and two are said by the noun alone, "دقيقة" and "دقيقتين"; 3 to 10 take the plural, "٣ دقائق"; 11 to 99 the singular in the accusative, "١٥ يومًا"; and 100 and more the singular, "١٠٠ يوم". "About" is a word, "حوالي", where the other languages write a tilde.

Documented on: [Language and words](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### PantrixLocale.textOrder

`import com.pantrixui.foundation.l10n.textOrder`, from `com.pantrixui:foundation`

```kotlin
fun PantrixLocale.textOrder(): Comparator<String>
```

How two texts compare in this language: the order a reader of it looks a name up in.

```kotlin
names.sortedWith(PantrixLocale.Turkish.textOrder()) // cam, Çay, çilek, ılık, iğne, şeker, zeytin
names.sorted()                                      // cam, iğne, zeytin, Çay, çilek, ılık, şeker
```

Kotlin compares two texts by the numbers Unicode gives their letters. That is the same on every platform and the alphabet of no language: every capital comes before every small letter, and `ç`, `ö` and `ş` come after `z`. This is each platform's own collation in its place: `java.text.Collator` on Android and the desktop, `NSString`'s localized comparison on iOS, and `Intl.Collator` in a browser.

Letters that differ only in case are held equal, so that `ada` and `Ada` stand together and a sort that keeps equal things as they were, as `sortedWith` does, leaves them in the order they came in. A letter with an accent is told from the one without. Digits are compared as letters are: `10` comes before `9`, and a text of numbers is ordered by its numbers and not by this.

The order is the platform's, and the platforms do not agree on every letter of every language: a list ordered here and one ordered by a server may differ at a letter or two. A list that has to be in the very order a server has it in is ordered by the server.

Keep what this returns: making one is not free, and a sort asks it thousands of times. In a composition, `rememberTextOrder` keeps it.

Documented on: [Data Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/data-table.md)

### rememberTextOrder

`import com.pantrixui.foundation.l10n.rememberTextOrder`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberTextOrder(locale: PantrixLocale = PantrixTheme.locale): Comparator<String>
```

The `textOrder` of `locale`, kept for as long as the language is the same: the theme's own language unless told.

```kotlin
val order = rememberTextOrder()
val sorted = remember(names, order) { names.sortedWith(order) }
```

Parameters:

- `locale: PantrixLocale`

Documented on: [Data Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/data-table.md)

## Package com.pantrixui.foundation.overlay

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

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

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

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

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

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

## Package com.pantrixui.foundation.platform

### HapticType

`import com.pantrixui.foundation.platform.HapticType`, from `com.pantrixui:foundation`

```kotlin
enum class HapticType
```

What a haptic is communicating, not which motor pattern to play.

Entries:

- `Selection`: Moving through options: a radio group, a slider tick, a segmented control.
- `ToggleOn`: A switch or a checkbox turned on.
- `ToggleOff`: A switch or a checkbox turned off.
- `Success`: An action that has succeeded: a form sent, a file saved.
- `Warning`: Something that needs the user's attention before it goes wrong.
- `Error`: An action that has failed, or a value that is not accepted.
- `Impact`: A generic bump for a completed drag or a snap.
- `LongPress`: A press that has been held long enough to mean something of its own: a tooltip that comes up under the finger, a menu a held press opens. It tells the finger that its lifting will not be a tap.

Documented on: [Haptics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### PantrixHaptics

`import com.pantrixui.foundation.platform.PantrixHaptics`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixHaptics
```

Haptic feedback, abstracted so components state intent rather than platform API calls.

Desktop and web have no haptics and get `NoOp`; that is not a gap to fill later, it is the correct behaviour, and it is why components can call this unconditionally.

Members:

- `fun perform(type: HapticType)`: Plays the platform's pattern for `type`; nothing where the platform has none.

On the type:

- `PantrixHaptics.NoOp: PantrixHaptics`: The haptics of a platform that has none: what the desktop and the web get.

Documented on: [Haptics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### rememberPlatformHaptics

`import com.pantrixui.foundation.platform.rememberPlatformHaptics`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPlatformHaptics(): PantrixHaptics
```

This platform's haptics: the device's own on Android and iOS, `PantrixHaptics.NoOp` on desktop and the web.

Documented on: [Haptics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### LocalPantrixHaptics

`import com.pantrixui.foundation.platform.LocalPantrixHaptics`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixHaptics: ProvidableCompositionLocal<PantrixHaptics>
```

The haptics in effect, which `PantrixTheme` provides: what `PantrixTheme.haptics` reads. Outside a theme, `PantrixHaptics.NoOp`.

Documented on: [Haptics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### numberKeyboardOptions

`import com.pantrixui.foundation.platform.numberKeyboardOptions`, from `com.pantrixui:foundation`

```kotlin
fun numberKeyboardOptions(
    imeAction: ImeAction = ImeAction.Default,
    decimal: Boolean = false
): KeyboardOptions
```

The keyboard for a field a number is typed in, with `imeAction` on a key of it.

A field of numbers asks for `KeyboardType.Number` and, where it has something to do once the number is typed, to open a page or to go on to the next field, for an `ImeAction` with it. On Android the keyboard of numbers has a key for the action, and a keyboard of keys has Enter. An iPhone's number pad has neither: it is ten digits and a key that takes one back. The action has no key there, and what was typed can never be sent (seen on a simulator, Compose Multiplatform 1.12.1).

So on iOS a number with an action is typed on the keyboard of numbers and punctuation, which opens on its digits and has a return key that shows the action. It is a keyboard for writing: it is asked for with corrections off, which also takes away the bar of words it offers above its keys. Its signs and, a press away, its letters can be typed on it, so the field itself keeps out what is no number, as with an `InputTransformation`. A number without an action (`ImeAction.Default`, `ImeAction.None`) misses nothing on the number pad, and gets it on iOS too.

Everywhere else the options are the type and the action that were asked for, and nothing more.

docs/guide/number-keyboard/NUMBER_KEYBOARD_GUIDE.md has the whole of it, and the same for a project without this library.

Parameters:

- `imeAction: ImeAction`: what the keyboard's action key does and shows: `ImeAction.Go`, `ImeAction.Next`, `ImeAction.Done`.
- `decimal: Boolean`: whether the number has a fraction: `KeyboardType.Decimal` in place of `KeyboardType.Number`, which puts a decimal separator on a number pad.

Documented on: [Text Field](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/text-field.md)

### OperatingSystem

`import com.pantrixui.foundation.platform.OperatingSystem`, from `com.pantrixui:foundation`

```kotlin
enum class OperatingSystem
```

An operating system, as `currentOperatingSystem` reports it. It settles what the platform's geometry does not, such as whether a shortcut leads with Command or with Control.

Entries:

- `Android`: Android, on a phone, a tablet or a foldable.
- `Ios`: iOS and iPadOS.
- `MacOs`: macOS, where the Command key leads keyboard shortcuts.
- `Windows`: Windows, where the Control key leads keyboard shortcuts.
- `Linux`: Linux, ChromeOS, and any system not listed here.

Members:

- `isApple: Boolean`: Whether the system is one of Apple's, where the Command key leads keyboard shortcuts.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Keyboard shortcuts](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### LocalOperatingSystem

`import com.pantrixui.foundation.platform.LocalOperatingSystem`, from `com.pantrixui:foundation`

```kotlin
val LocalOperatingSystem: ProvidableCompositionLocal<OperatingSystem>
```

The operating system a composition is typed on: `currentOperatingSystem`, unless a test or a preview provides another. It decides what the keyboard's shortcuts lead with, Command or Control, and how they are written.

Documented on: [Keyboard shortcuts](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### ClipboardTraits

`import com.pantrixui.foundation.platform.ClipboardTraits`, from `com.pantrixui:foundation`

```kotlin
data class ClipboardTraits(
    val writable: Boolean = true,
    val announcedBySystem: Boolean = false
)
```

What a platform's clipboard is like, for whoever copies to it: a copy button asks before it says anything.

Parameters:

- `writable: Boolean`: Whether there is a clipboard to write to. A web page that is not served in a secure context, over plain http from anywhere but the machine itself, has none: the browser gives such a page no clipboard. Nor has a JVM that runs without a display. Compose skips a write to either without an error.
- `announcedBySystem: Boolean`: Whether the system itself shows what was put on the clipboard. Android does from version 13 on, and asks an app not to say it a second time.

Documented on: [Clipboard](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### currentClipboardTraits

`import com.pantrixui.foundation.platform.currentClipboardTraits`, from `com.pantrixui:foundation`

```kotlin
fun currentClipboardTraits(): ClipboardTraits
```

This platform's clipboard as it is when asked: a browser's depends on how its page was served.

Documented on: [Clipboard](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### LocalClipboardTraits

`import com.pantrixui.foundation.platform.LocalClipboardTraits`, from `com.pantrixui:foundation`

```kotlin
val LocalClipboardTraits: ProvidableCompositionLocal<ClipboardTraits>
```

The traits a `PantrixClipboard` goes by. The platform's own unless others are given: a test gives another platform's here, as it gives a clipboard of its own through `LocalClipboard`.

Documented on: [Clipboard](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### PantrixClipboard

`import com.pantrixui.foundation.platform.PantrixClipboard`, from `com.pantrixui:foundation`

```kotlin
class PantrixClipboard
```

The clipboard, for plain text.

Compose's own clipboard, `LocalClipboard`, takes what is put on it in each platform's own type: a `ClipData` on Android, a `Transferable` on the desktop, and a form of Compose's own on iOS and in a browser. There is no common way to copy a text, so this is one: it builds what the platform takes, puts it there, and says whether it got there.

```kotlin
val clipboard = rememberPantrixClipboard()
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.copy_link),
    onClick = {
        scope.launch {
            val copied = clipboard.copyText(link, label = linkLabel)
            // A system that shows the copy itself is not echoed.
            if (!copied || !clipboard.traits.announcedBySystem) snackbars?.show(if (copied) done else failed)
        }
    }
)
```

Parameters:

- `traits: ClipboardTraits`: What this platform's clipboard is like: whether it can be written to, and whether the system shows a copy itself.

Members:

- `suspend fun copyText(text: String, label: String = ""): Boolean`: Puts `text` on the clipboard as plain text, in place of what was there.

  `text`: what is copied.

  `label`: what the text is, in the app's language: `"Link"`, `"Code"`. Android alone carries it, and may show it in the system's own preview of the copy.

  Returns whether the text was put on the clipboard. False where there is no clipboard to write to, and where the platform refused the write, as a browser does whose reader has not allowed it.

Documented on: [Clipboard](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### rememberPantrixClipboard

`import com.pantrixui.foundation.platform.rememberPantrixClipboard`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixClipboard(): PantrixClipboard
```

The clipboard for plain text, on the platform's own: what `LocalClipboard` gives, with the traits of `LocalClipboardTraits`.

Documented on: [Clipboard](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### PantrixPointerIcons

`import com.pantrixui.foundation.platform.PantrixPointerIcons`, from `com.pantrixui:foundation`

```kotlin
object PantrixPointerIcons
```

The pointer's shapes for a control that is dragged to make something larger or smaller: the handle between two panes, the end of a table's column, the edge of a panel. Compose's own `PointerIcon` has four shapes on every platform, an arrow, a crosshair, a text cursor and a hand, and none of these; each platform has them under a name of its own, and this gives them under one.

```kotlin
Box(Modifier.pointerHoverIcon(PantrixPointerIcons.ResizeHorizontal).draggable(…))
```

On Android it is the system's double arrow, shown under a mouse; on a desktop, AWT's resize cursor; in a browser, the cursor CSS calls `col-resize` or `row-resize`. Compose shapes no pointer on iOS, not even with its own four, and an iPad's pointer keeps its shape there. Under a finger there is no pointer to shape, and nothing changes.

docs/guide/pointer-icons/POINTER_ICONS_GUIDE.md has the whole of it, and the same for a project without this library.

Members:

- `ResizeHorizontal: PointerIcon`: Over a control dragged to the side to make something wider or narrower: the handle between two panes.
- `ResizeVertical: PointerIcon`: Over a control dragged up and down to make something taller or shorter: the handle above a pane.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### PantrixWindowTitle

`import com.pantrixui.foundation.platform.PantrixWindowTitle`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixWindowTitle(title: String)
```

Names the window after the screen shown in it, for as long as that screen is in the composition: the browser tab's title on the web, the title bar's on the desktop. An app of one window and many screens otherwise keeps the name it opened with whatever is shown: every tab of a browser says the app's name, and so does every entry of its history.

```kotlin
PantrixWindowTitle(stringResource(Res.string.orders))
```

- **How it is written.** `LocalPantrixWindowTitleFormat` writes `title` as the window's: an app gives it once, at its root, to put its own name after each screen's, `Orders · Admin`.

- **Several at once.** Two screens are in the composition together while one slides over the other, and a list and its detail side by side: the one that came in last names the window. As it leaves, the one before it names the window again, and with none left the window has its own title back, the page's `<title>` on the web and what its `Window` was given on the desktop.

- **Android and iOS.** Neither shows a window's title to its user: it does nothing there.

docs/guide/window-title/WINDOW_TITLE_GUIDE.md has the whole of it, and the same for a project without this library.

Parameters:

- `title: String`: what the screen is called, as its own title says it: `Orders`.

Documented on: [Page Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/page-scaffold.md)

### PantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.PantrixWindowTitleFormat`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixWindowTitleFormat
```

How a screen's title is written as its window's: `PantrixWindowTitleFormat { "$it · Admin" }` puts the app's name after it. An app gives one with `LocalPantrixWindowTitleFormat`.

Members:

- `fun format(title: String): String`: The window's title for a screen called `title`.

On the type:

- `PantrixWindowTitleFormat.Plain: PantrixWindowTitleFormat`: The screen's title as it is: what the window is called unless an app gives another format.

Documented on: [Page Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/page-scaffold.md)

### LocalPantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.LocalPantrixWindowTitleFormat`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixWindowTitleFormat: ProvidableCompositionLocal<PantrixWindowTitleFormat>
```

How `PantrixWindowTitle` writes a screen's title as its window's: `PantrixWindowTitleFormat.Plain` unless given.

Documented on: [Page Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/page-scaffold.md)

### currentPlatformType

`import com.pantrixui.foundation.platform.currentPlatformType`, from `com.pantrixui:foundation`

```kotlin
fun currentPlatformType(): PlatformType
```

Which platform the code is actually running on.

This is only the *default* for `PantrixTheme(platform = ...)`. Overriding it is a supported and intended thing to do — that is how a preview shows iOS geometry on a desktop, and how a product ships one look everywhere.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### currentOperatingSystem

`import com.pantrixui.foundation.platform.currentOperatingSystem`, from `com.pantrixui:foundation`

```kotlin
fun currentOperatingSystem(): OperatingSystem
```

The operating system the code is running on; in a browser, the one the browser runs on.

Not a theme default like `currentPlatformType`: a preview of iOS geometry on a desktop still runs on the desktop's system, and is typed on the desktop's keyboard.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Keyboard shortcuts](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### systemIsInHighContrast

`import com.pantrixui.foundation.platform.systemIsInHighContrast`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemIsInHighContrast(): Boolean
```

The OS "increase contrast" accessibility setting.

Dark mode is deliberately absent from this file: Compose Multiplatform already provides `isSystemInDarkTheme()` in common code, and reimplementing it per platform would be a worse copy of something maintained upstream.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemPointerIsTouch

`import com.pantrixui.foundation.platform.systemPointerIsTouch`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemPointerIsTouch(): Boolean
```

Whether the system is used by touch: its primary pointer is a finger, which is less exact than a mouse and needs a larger target.

Always true on Android and iOS, and always false on the desktop, where the JVM tells nothing of a touch screen. A browser runs on both kinds of device: there it is the `pointer: coarse` media query, which is true on a phone and a tablet and false on a laptop, a touch screen on it or not, and it is followed as it changes.

Feeds `PantrixPlatform.isTouch` through `rememberPantrixPlatform`, and with it the touch target a browser gets.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemReduceMotion

`import com.pantrixui.foundation.platform.systemReduceMotion`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemReduceMotion(): Boolean
```

The OS "reduce motion" setting.

Feeds `PantrixMotion.reduceMotion`, which collapses every duration to zero. Components never check this themselves; they ask `motion.duration(...)`, so honouring the setting is one decision instead of a rule each component has to remember.

Documented on: [Motion](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md), [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemDifferentiatesWithoutColor

`import com.pantrixui.foundation.platform.systemDifferentiatesWithoutColor`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemDifferentiatesWithoutColor(): Boolean
```

Whether the system is set to tell things apart by more than their colour: iOS's "Differentiate Without Color", and on Android the colour correction a colour-blind user turns on.

Always false on the desktop and in a browser, which tell nothing of such a setting. Feeds a chart's patterns, where its style leaves them to the system: a series that colour alone tells apart from the next is told by a texture too.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemPantrixLocale

`import com.pantrixui.foundation.platform.systemPantrixLocale`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemPantrixLocale(): PantrixLocale
```

The OS locale, including writing direction.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### PlatformType

`import com.pantrixui.foundation.platform.PlatformType`, from `com.pantrixui:foundation`

```kotlin
enum class PlatformType
```

A platform whose conventions a theme follows: touch targets, component presets. `currentPlatformType` is the one the code runs on, and `PantrixTheme(platform = …)` can ask for another.

Entries:

- `Android`: Android's conventions: Material's touch target of 48dp, and the components' Android presets.
- `Ios`: iOS's conventions: Apple's touch target of 44pt, and the components' iOS presets.
- `Desktop`: A desktop's conventions: a pointer's touch target, and the components' desktop presets.
- `Web`: A browser's conventions: a pointer's touch target, and the components' web presets.

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md)

### systemUtcOffset

`import com.pantrixui.foundation.platform.systemUtcOffset`, from `com.pantrixui:foundation`

```kotlin
fun systemUtcOffset(moment: Instant): Duration
```

How far the device's clock is ahead of UTC at `moment`: three hours in Istanbul, and less than nought west of Greenwich. It is asked for a moment, since it changes where clocks are put forward for the summer.

What a day and a time of day are worked out with where no library of time zones is at hand: a moment and this give the day and the hour the device's own clock shows. It is the offset of `PantrixClock.System`, the clock a screen is read by unless a test or a preview gives another.

Parameters:

- `moment: Instant`

Documented on: [Platform and system](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

## Package com.pantrixui.foundation.primitives

### Modifier.thenIf

`import com.pantrixui.foundation.primitives.thenIf`, from `com.pantrixui:foundation`

```kotlin
inline fun Modifier.thenIf(
    condition: Boolean,
    block: Modifier.() -> Modifier
): Modifier
```

This modifier with `block` applied when `condition` holds, and unchanged otherwise: a link a chain may skip.

Parameters:

- `condition: Boolean`
- `block: Modifier.() -> Modifier`

Documented on: [Show and hide](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md)

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

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

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

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### pantrixPressIndication

`import com.pantrixui.foundation.primitives.pantrixPressIndication`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun pantrixPressIndication(pressAlpha: Float = 0.1f): PantrixPressIndication
```

The press indication of the current theme: it darkens a control on a light ground and lightens it on a dark one, so that a press is seen on either.

Parameters:

- `pressAlpha: Float`: How strong the cover is at a full press, from 0 to 1: 0.1 unless given.

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

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

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

## Package com.pantrixui.foundation.testing

### Modifier.pantrixAutomationRoot

`import com.pantrixui.foundation.testing.pantrixAutomationRoot`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.pantrixAutomationRoot(): Modifier
```

Shows the test tags under this node to the platform's UI automation: a Maestro flow, UI Automator or XCUITest finds a component by its tag, `Button_save`, in every language.

On Android a tag becomes the node's resource id only under a node that says so, and each window has its own nodes: the outermost `PantrixTheme` says so for the app's window, and Pantrix's own dialogs, sheets, menus and popovers for theirs. A window of the app's own, a `Popup` or a `Dialog` it opens itself, is out of reach of both: what it shows puts this on its root, and its tags reach the automation as the app's do. On iOS Compose gives a tag to the automation as the accessibility identifier by itself, and on the desktop and the web a test reads the semantics tree: there this changes nothing.

It shows every test tag under it, a `Modifier.testTag` of the app's own too. Where the theme keeps Pantrix's tags out of the semantics tree (`TestTagPolicy.Off`) there are none of those to show.

Documented on: [Building blocks](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### TestTagPolicy

`import com.pantrixui.foundation.testing.TestTagPolicy`, from `com.pantrixui:foundation`

```kotlin
enum class TestTagPolicy
```

Whether components put their automation tags in the semantics tree, where tests and the platform's UI automation find them, and what they build a tag from.

Entries:

- `Stable`: The key — `tagKey`, or the field id in form-bound overloads — then the call-site key.
- `Off`: Pantrix puts no tag in the semantics tree. A component still knows its tag, and its analytics events carry it: a release build that keeps its tags out of the tree still tells its events apart. A `Modifier.testTag` the app sets itself is unaffected, which is how a release build keeps the few tags an external tool depends on.

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### LocalTestTagPolicy

`import com.pantrixui.foundation.testing.LocalTestTagPolicy`, from `com.pantrixui:foundation`

```kotlin
val LocalTestTagPolicy: ProvidableCompositionLocal<TestTagPolicy>
```

Whether the components here put their automation tags in the semantics tree: `PantrixTheme(testTagPolicy = …)`. Its readers follow it: a tag's node takes its tag out of the tree, or puts it back, when the policy around it changes.

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### LocalTestScope

`import com.pantrixui.foundation.testing.LocalTestScope`, from `com.pantrixui:foundation`

```kotlin
val LocalTestScope: ProvidableCompositionLocal<String?>
```

The enclosing `TestScope` chain, e.g. `Checkout.PaymentForm`.

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### TestScope

`import com.pantrixui.foundation.testing.TestScope`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun TestScope(
    name: String,
    content: @Composable () -> Unit
)
```

Names a screen or section so tags inside it are qualified: `TestScope("LoginScreen") { ... }`.

Nesting concatenates, which is what makes a tag readable in a test failure without the reader having to know where in the tree the component sat.

Parameters:

- `name: String`: the screen's or the section's name, put before the tags inside it: `LoginScreen.Button_save`.
- `content: @Composable () -> Unit`: the screen or the section, whose components' tags `name` qualifies.

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### rememberPantrixTestTag

`import com.pantrixui.foundation.testing.rememberPantrixTestTag`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixTestTag(
    component: String,
    tagKey: String? = null
): String
```

Produces a component's automation tag: `Scope.Component_key`.

The key is `tagKey` — form-bound overloads pass their field's id — and without one, the call-site key: `Scope.Component#1k3z9`. **Visible text is never a source**: a tag derived from translated text changes when the app runs in another language, which silently breaks every automation suite the moment a second locale ships.

There is deliberately no parameter for a finished tag. A caller that must match an id an external suite already uses sets it with Compose's own `Modifier.testTag` in the component's `modifier`, which replaces this tag in the semantics tree.

The tag is built whatever the `TestTagPolicy`: the component's analytics events carry it either way, and `pantrixTestTag` puts it in the semantics tree only while the policy is `TestTagPolicy.Stable`.

Parameters:

- `component: String`: component name, e.g. `Button`
- `tagKey: String?`: a locale-independent developer key, e.g. `save`: written in small letters and digits, of which the tag carries the first `MAX_TAG_KEY_LENGTH`. The key of a control built on this one is made with `derivedTagKey`.

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### pantrixTestTagOf

`import com.pantrixui.foundation.testing.pantrixTestTagOf`, from `com.pantrixui:foundation`

```kotlin
fun pantrixTestTagOf(
    component: String,
    tagKey: String,
    scope: String? = null
): String
```

The automation tag a component given `tagKey` carries inside `scope`: what a test, or a flow of the platform's UI automation, finds it by. A `Button` given `save` is `Button_save`, and inside `TestScope("Checkout")` it is `Checkout.Button_save`. `rememberPantrixTestTag` builds a keyed tag with this, so a tag built here is the one the component carries.

Parameters:

- `component: String`: the component's name, e.g. `Button`.
- `tagKey: String`: the key the component was given, as its caller wrote it: the tag writes it in small letters and digits, as the component does.
- `scope: String?`: the chain of `TestScope`s the component stands in, e.g. `Checkout.PaymentForm`; null outside one.

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### Modifier.pantrixTestTag

`import com.pantrixui.foundation.testing.pantrixTestTag`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.pantrixTestTag(tag: String?): Modifier
```

Sets `tag` as the test tag while the `TestTagPolicy` where it stands is `TestTagPolicy.Stable`, and nothing while it is `TestTagPolicy.Off` or for null: no node at all is added to the semantics tree then.

While the theme's diagnostics are on, a tag that two nodes of the window carry for a second and a half is reported as `PantrixCheck.DuplicateTestTag`: a test that looks for it would find them both. A page transition, which shows the page that goes and the one that comes with the same tags, is over before then.

Parameters:

- `tag: String?`

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### derivedTagKey

`import com.pantrixui.foundation.testing.derivedTagKey`, from `com.pantrixui:foundation`

```kotlin
fun derivedTagKey(
    tagKey: String,
    part: String
): String
```

The key of a control that another control is built on: the select of a page size, the menu of a breadcrumb. It is the outer control's own `tagKey` and, after it, `part`, the name of the inner one: `orders` and `page_size` are `orders_page_size`, and the select is tagged `Select_orders_page_size`.

A tag carries no more than the first `MAX_TAG_KEY_LENGTH` characters of a key. Joined by hand, a long key would lose the part's name to that cut, and two parts of one control would come to the same key. Here the outer key is what gives way: it is cut as short as leaves `part` whole.

Parameters:

- `tagKey: String`: the outer control's key, as its caller wrote it.
- `part: String`: what the inner control is in the outer one, in the letters a key is written in: `page_size`.

Documented on: [Test tags](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### MAX_TAG_KEY_LENGTH

`import com.pantrixui.foundation.testing.MAX_TAG_KEY_LENGTH`, from `com.pantrixui:foundation`

```kotlin
const val MAX_TAG_KEY_LENGTH: Int = 32
```

How many characters of a key a tag carries: a key is a name a person reads in a failing test, and not a sentence.

## Package com.pantrixui.foundation.theme

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixTheme(
    preset: DesignPreset,
    colors: PantrixColors = rememberPantrixColors(preset, darkTheme = inheritedDarkThemeOrSystem()),
    typography: PantrixTypography = preset.typography(),
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = preset.shapes(),
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides = preset.componentOverrides(),
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

The theme built on `preset`, a brand's look in one place: light or dark as the system is.

A call lands here by naming a preset. Every other call, `PantrixTheme { … }` among them, is the form that takes `PantrixColors`.

The theme also tells its content the window it is drawn in, `PantrixTheme.window`: the one Compose reports unless `window` gives another, and inside another theme that theme's. `layouts` are the page's margin and gutter for each class of that window; `PantrixTheme.layout` gives the ones of the class it is in.

**Inside another theme** it takes from that one whatever it is not given, as the form that takes `PantrixColors` does. The preset's own, its colours, type, shapes and component overrides, are the preset's, and it is as dark as the theme around it: the preset's dark colours in a dark theme, whatever the system is set to.

Parameters:

- `preset: DesignPreset`
- `colors: PantrixColors`: the colour roles: `preset`'s, as dark as the theme around it, or as the system where there is none. `inheritedDarkThemeOrSystem`: Whether the theme around this call is dark, and whether the system is where no theme is around it: a theme inside a dark one is dark unless it is told otherwise, whatever the system is set to.
- `typography: PantrixTypography`: the type scale: `preset`'s.
- `density: PantrixDensity`: the interface density, which the components' air is scaled by: an enclosing theme's, or `Comfortable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `shapes: PantrixShapes`: the corner radii: `preset`'s.
- `motion: PantrixMotion`: the durations and easings: an enclosing theme's, or Pantrix's own, with every duration at nought while the system asks for less motion. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `spacing: PantrixSpacing`: the spacing scale, before the density scales it: what an enclosing theme was given, or Pantrix's own. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `elevation: PantrixElevation`: the depths of the shadows: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `platform: PantrixPlatform`: the platform whose conventions the components follow, its touch target, its focus ring and its presets: what an enclosing theme was given, or the one the app runs on, as the system reports it. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `window: PantrixWindow`: `inheritedPantrixWindow`: The window a theme or a provider around this call has given, or null when there is none: what a theme inside another takes when it is given no window of its own, so that a window pinned by a test is not lost in it.
- `layouts: PantrixLayouts`: `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `componentOverrides: ComponentTokenOverrides`: the brand's token overrides of single components: `preset`'s.
- `styles: PantrixStyles`: the style overrides the components take, on top of their presets: an enclosing theme's, or none. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `locale: PantrixLocale`: the language the components speak and lay out in: an enclosing theme's, or the system's. Its `layoutDirection` alone is the direction everything inside the theme is laid out in, over a `LocalLayoutDirection` provided around the theme: a layout from the right is asked for with a locale written from the right, such as `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `strings: PantrixStrings`: the components' own words: an enclosing theme's where it speaks `locale`'s language, or Pantrix's pack for that language. `inheritedStringsOr`: The strings of the theme around this call where its language is `locale`, and `locale`'s own where it is another or no theme is around it: strings an app gave its theme are kept inside it, and a theme given another language takes that language's.
- `testTagPolicy: TestTagPolicy`: whether the components put their automation tags into the semantics tree: an enclosing theme's, or `TestTagPolicy.Stable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `analytics: PantrixAnalytics`: where the components report what the user does with them: an enclosing theme's, or nowhere (`PantrixAnalytics.NoOp`). `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `haptics: PantrixHaptics`: what plays the components' haptics: an enclosing theme's, or the device's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `diagnostics: PantrixDiagnostics`: where the checks of the running screen send their findings, colours that do not read and touch targets too small among them: an enclosing theme's, or off. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `followSystemBars: Boolean`: whether the outermost theme makes what the system draws follow its colours rather than the system's dark mode: Android's bars' icons, iOS's status bar, keyboard and controls. A theme inside another changes nothing of it. An app that sets them itself, or whose bars are coloured, turns it off. docs/guide/system-bars/SYSTEM_BARS_GUIDE.md has the whole of it.
- `content: @Composable () -> Unit`: what the theme is in effect for.

Documented on: [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixTheme(
    darkTheme: Boolean = inheritedDarkThemeOrSystem(),
    colors: PantrixColors = inheritedColorsOrOwn(darkTheme),
    typography: PantrixTypography = inheritedOr(LocalPantrixTypography) { rememberPantrixTypography() },
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = inheritedOr(LocalPantrixShapes) { rememberPantrixShapes() },
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides =
        inheritedOr(LocalComponentTokenOverrides) { ComponentTokenOverrides.None },
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

The theme without a preset, in Pantrix's own look: light or dark as `darkTheme` says, and as the system is when it is left out.

`PantrixTheme { … }` lands here, as does every call that names no preset. The form that takes a `DesignPreset` has no default for its preset, so no call fits both.

`window` and `layouts` are as in the form that takes a `DesignPreset`.

**Inside another theme** it takes from that one whatever it is not given: a dark part of a light screen is `PantrixTheme(darkTheme = true) { … }`, and nothing but the colours changes in it. The platform the app told its theme, the density, the language and its strings, the styles, the place events are reported to and the one findings go to are the outer theme's inside it, and what it is given is its own. It is as dark as the theme around it unless `darkTheme` says otherwise, and keeps that theme's colours while it is. Told to be dark in a light theme, it takes the dark colours of the preset that theme's look is built on, Pantrix's own dark set where it is built on none, or the `colors` it is given. A theme draws no ground: the dark part's own is a surface or a card inside it. Nor is it a layout: what stands in it is laid out by what the theme stands in, as if the theme were not there.

Parameters:

- `darkTheme: Boolean`: `inheritedDarkThemeOrSystem`: Whether the theme around this call is dark, and whether the system is where no theme is around it: a theme inside a dark one is dark unless it is told otherwise, whatever the system is set to.
- `colors: PantrixColors`: `inheritedColorsOrOwn`: The colours of the theme around this call where they are as dark as `darkTheme` asks. A theme inside another keeps its colours, a brand's among them, unless it is told to be dark in a light one or light in a dark one.

  Told so, it takes the set of that kind from the preset the look around it is built on: a dark part of a brand's light theme is in the brand's dark colours. Where the look is built on no preset, and where no theme is around the call, the set is Pantrix's own.
- `typography: PantrixTypography`: the type scale: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `density: PantrixDensity`: the interface density, which the components' air is scaled by: an enclosing theme's, or `Comfortable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `shapes: PantrixShapes`: the corner radii: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `motion: PantrixMotion`: the durations and easings: an enclosing theme's, or Pantrix's own, with every duration at nought while the system asks for less motion. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `spacing: PantrixSpacing`: the spacing scale, before the density scales it: what an enclosing theme was given, or Pantrix's own. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `elevation: PantrixElevation`: the depths of the shadows: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `platform: PantrixPlatform`: the platform whose conventions the components follow, its touch target, its focus ring and its presets: what an enclosing theme was given, or the one the app runs on, as the system reports it. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `window: PantrixWindow`: `inheritedPantrixWindow`: The window a theme or a provider around this call has given, or null when there is none: what a theme inside another takes when it is given no window of its own, so that a window pinned by a test is not lost in it.
- `layouts: PantrixLayouts`: `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `componentOverrides: ComponentTokenOverrides`: the brand's token overrides of single components: an enclosing theme's, or none. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `styles: PantrixStyles`: the style overrides the components take, on top of their presets: an enclosing theme's, or none. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `locale: PantrixLocale`: the language the components speak and lay out in: an enclosing theme's, or the system's. Its `layoutDirection` alone is the direction everything inside the theme is laid out in, over a `LocalLayoutDirection` provided around the theme: a layout from the right is asked for with a locale written from the right, such as `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `strings: PantrixStrings`: the components' own words: an enclosing theme's where it speaks `locale`'s language, or Pantrix's pack for that language. `inheritedStringsOr`: The strings of the theme around this call where its language is `locale`, and `locale`'s own where it is another or no theme is around it: strings an app gave its theme are kept inside it, and a theme given another language takes that language's.
- `testTagPolicy: TestTagPolicy`: whether the components put their automation tags into the semantics tree: an enclosing theme's, or `TestTagPolicy.Stable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `analytics: PantrixAnalytics`: where the components report what the user does with them: an enclosing theme's, or nowhere (`PantrixAnalytics.NoOp`). `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `haptics: PantrixHaptics`: what plays the components' haptics: an enclosing theme's, or the device's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `diagnostics: PantrixDiagnostics`: where the checks of the running screen send their findings, colours that do not read and touch targets too small among them: an enclosing theme's, or off. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `followSystemBars: Boolean`: whether the outermost theme makes what the system draws follow its colours rather than the system's dark mode: Android's bars' icons, iOS's status bar, keyboard and controls. A theme inside another changes nothing of it. An app that sets them itself, or whose bars are coloured, turns it off. docs/guide/system-bars/SYSTEM_BARS_GUIDE.md has the whole of it.
- `content: @Composable () -> Unit`: what the theme is in effect for.

Documented on: [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, from `com.pantrixui:foundation`

```kotlin
data object PantrixTheme
```

The theme's values where a composable reads them, `PantrixTheme.colors.primary` or `PantrixTheme.spacing.md`: each is what the nearest enclosing `PantrixTheme { … }` provides.

Members:

- `colors: PantrixColors`: The colour roles in effect: `PantrixTheme.colors.primary.color`, `PantrixTheme.colors.surface`.
- `typography: PantrixTypography`: The type scale in effect: `PantrixTheme.typography.body`.
- `density: PantrixDensity`: The interface density in effect, which the components' air is scaled by.
- `shapes: PantrixShapes`: The corner radii in effect: `PantrixTheme.shapes.md`.
- `motion: PantrixMotion`: The durations and easings in effect, every duration at nought while the system asks for less motion.
- `spacing: PantrixSpacing`: The spacing scale in effect, scaled by the density: `PantrixTheme.spacing.md`.
- `elevation: PantrixElevation`: The depths of the shadows in effect.
- `platform: PantrixPlatform`: The platform whose conventions are in effect: its touch target, its focus ring and its components' presets.
- `window: PantrixWindow`: The window the content is drawn in: the class of its width and of its height, its size and how its device is folded. A layout chooses by it, `PantrixTheme.window.widthClass >= WindowWidthClass.Expanded`, and is composed again when the class changes.
- `layout: PantrixLayout`: The measures a page is laid out by in the window in effect: the margin at its sides and the gutter between its columns, as the class of the window's width has them. A phone's margin is 16dp and a desktop window's 32dp.

  ```kotlin
  Column(Modifier.padding(horizontal = PantrixTheme.layout.margin)) { … }
  ```

  The reader is composed again when the class changes, and not as the window is resized within it. The theme's `layouts` are where the measures come from, and its density scales them.
- `@Composable fun layout(window: PantrixWindow): PantrixLayout`: The measures for `window` and not for the window in effect: what a component asks of its own box, whose room is not the window's.

  ```kotlin
  BoxWithPantrixWindow(modifier) { box ->
      Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout(box).gutter)) { … }
  }
  ```
- `locale: PantrixLocale`: The language in effect: the one the components speak and lay out in.
- `strings: PantrixStrings`: The components' own words in effect, in `locale`'s language.
- `analytics: PantrixAnalytics`: Where the components report what the user does with them.
- `haptics: PantrixHaptics`: What plays the components' haptics.
- `isUnderModal: Boolean`: Whether a modal overlay is shown over the content this is read in: a dialog, a sheet, or an app's own in a `PantrixModalLayer`. What lies under one takes no key and no click until it closes, and should not look as if it did. The focus stays where it was under it, so that it is there again when the overlay closes, and no focus ring is drawn there meanwhile.

  The content of an overlay is not under it, and is under one opened after it.
- `componentOverrides: ComponentTokenOverrides`: The brand's component overrides in effect. A theme inside this one keeps them unless it is given others.
- `styles: PantrixStyles`: The style overrides in effect: the theme's `styles` and every enclosing `ProvidePantrixStyles`'.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>): S`: `key`'s style on the active platform, with the brand's, the theme's and every enclosing `ProvidePantrixStyles`' overrides applied: `PantrixTheme.style(ButtonStyle).pressedScale`.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>, override: S?): S`: `key`'s style with `override` on top of every other layer: what a component that takes its style as a parameter draws with, as `PantrixButton(style = ButtonStyle(…))` does.

  The override goes where a `ProvidePantrixStyles` around the call would put it, over the brand's, the theme's and every enclosing one's, and it comes before the density: a height given here is scaled like any other. It holds on every platform. Only the fields it sets change, and `null` changes nothing.

Documented on: [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

## Package com.pantrixui.foundation.theme.preset

### DesignPreset

`import com.pantrixui.foundation.theme.preset.DesignPreset`, from `com.pantrixui:foundation`

```kotlin
interface DesignPreset
```

A brand's look in one place: its colours, type, shapes and component overrides. `PantrixTheme(preset = …)` builds a theme from it.

Members:

- `name: String`: The preset's name, as a picker or a log shows it.
- `fun colors(dark: Boolean = false): PantrixColors`: The colours: the dark set when `dark`.
- `@Composable fun typography(): PantrixTypography`: The type scale, in the brand's fonts.
- `@Composable fun shapes(): PantrixShapes`: The shape scale.
- `fun componentOverrides(): ComponentTokenOverrides`: Each component's token overrides; none unless the brand has some.

Documented on: [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

## Package com.pantrixui.foundation.token.color

### contrastRatio

`import com.pantrixui.foundation.token.color.contrastRatio`, from `com.pantrixui:foundation`

```kotlin
fun contrastRatio(
    foreground: Color,
    background: Color
): Float
```

How far `foreground` stands out from `background`, as WCAG 2.2 measures it: the relative luminance of the lighter of the two over that of the darker, each plus 0.05. It runs from 1, for a colour on itself, to 21, for black on white. Text is read at 4.5 and more; large text and the mark of a control, as a checkbox's box, at 3 and more.

A `foreground` that lets the background through is measured as it is drawn: laid over `background`. The `background` is measured as it is given; one that lets through what is under it is laid over that first.

Parameters:

- `foreground: Color`
- `background: Color`

Documented on: [Diagnostics](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### PantrixColorScale

`import com.pantrixui.foundation.token.color.PantrixColorScale`, from `com.pantrixui:foundation`

```kotlin
data class PantrixColorScale(
    val shade50: Color,
    val shade100: Color,
    val shade200: Color,
    val shade300: Color,
    val shade400: Color,
    val shade500: Color,
    val shade600: Color,
    val shade700: Color,
    val shade800: Color,
    val shade900: Color,
    val shade950: Color
)
```

One hue in eleven steps, from all but white to all but black.

In the default themes a role's colour is its 600 or 700 in the light theme and its 400 in the dark, and its container its 100 in the light theme and its 900 in the dark, Slate's 800 for `neutral`.

Parameters:

- `shade50: Color`: The lightest step, all but white.
- `shade100: Color`: A pale tint.
- `shade200: Color`: A light tint.
- `shade300: Color`: The last of the light tints.
- `shade400: Color`: A light middle step.
- `shade500: Color`: The middle of the scale.
- `shade600: Color`: A dark middle step.
- `shade700: Color`: A dark step.
- `shade800: Color`: A deeper step.
- `shade900: Color`: A deep step, near the end of the scale.
- `shade950: Color`: The darkest step, all but black.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixColors

`import com.pantrixui.foundation.token.color.PantrixColors`, from `com.pantrixui:foundation`

```kotlin
data class PantrixColors(
    val primary: PantrixColor,
    val success: PantrixColor,
    val info: PantrixColor,
    val warning: PantrixColor,
    val danger: PantrixColor,
    val neutral: PantrixColor,
    val background: Color,
    val surface: Color,
    val onSurface: Color,
    val disabledContainer: Color,
    val disabledContent: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textDisabled: Color,
    val textInverse: Color,
    val border: Color,
    val borderHover: Color,
    val borderStrong: Color,
    val divider: Color,
    val focusRing: Color,
    val scrim: Color,
    val chart: List<Color>
)
```

The colours of a Pantrix theme: six roles, the backdrop and the surfaces, the text, lines and marks drawn on them, and the colours a chart tells its series apart by. Each role is a `PantrixColor`, and `roles()` lists them.

Parameters:

- `primary: PantrixColor`: The brand's role: the main action, and what is selected.
- `success: PantrixColor`: The role for what went well: a completed step, a saved change.
- `info: PantrixColor`: The role for neutral information: a hint, a notice.
- `warning: PantrixColor`: The role for what needs attention before it becomes a problem.
- `danger: PantrixColor`: The role for what went wrong or cannot be undone: an error, a destructive button.
- `neutral: PantrixColor`: The role with no hue of its own, for what should not draw the eye.
- `background: Color`: The app's own backdrop, behind everything: what a scaffold fills.
- `surface: Color`: A raised or grouped area: a card, a sheet, a dialog, a menu, a sidebar, a text field's box.
- `onSurface: Color`: What is drawn on the theme's own grounds, `background` and `surface` alike, that is not text: an icon nothing else gives a colour, the press drawn over a checkbox. A text there is `textPrimary`. The two grounds have one such colour between them, as they have one primary text colour.
- `disabledContainer: Color`: The fill of a control that cannot be used: a disabled button, a disabled switch's track.
- `disabledContent: Color`: What is drawn on `disabledContainer`, and the marks and edges of anything disabled: a disabled button's label, a disabled radio's ring, a disabled field's edge.
- `textPrimary: Color`: The main text: what a text is drawn in on the theme's own grounds, `background` and `surface`, unless it is given a colour. On a fill a text takes the colour that reads on the fill.
- `textSecondary: Color`: Text of less weight: supporting text, a divider's label.
- `textDisabled: Color`: The text of what cannot be used, where it stands on no fill: the label of a disabled checkbox, a disabled link, a disabled tab. The default themes give it `disabledContent`'s colour.
- `textInverse: Color`: Text on a fill of the theme's opposite tone: white in the default light theme, all but black in the dark.
- `border: Color`: The edge of a box that holds what says what it is: a text field, a chip. A soft line by design, stronger than `divider` and far quieter than text. It is below the 3:1 that WCAG 1.4.11 asks of an edge that alone marks a control: a product that has to meet it for its fields gives a stronger colour here.
- `borderHover: Color`: That edge under a pointer: a notch stronger than `border`.
- `borderStrong: Color`: The mark of a control that is nothing but its mark: a checkbox's box, a radio button's ring, a switch that is off. At 3:1 against what it stands on (WCAG 1.4.11), so that the control is seen before it is chosen.
- `divider: Color`: A line between items or sections, lighter than `border`: it separates, and marks no control's edge.
- `focusRing: Color`: The ring around what has keyboard focus.
- `scrim: Color`: The dimming laid over the app behind a modal: a dialog, a sheet, a drawer.
- `chart: List<Color>`: The colours a chart draws its series in, in the order it hands them out: the first series takes the first, and `chartColor` starts again at the first for a chart of more series than there are colours. They say nothing of what a series is, as a role does: a series that went wrong is drawn in `danger`, by its own colour. The default sets have ten, each at 3:1 against the set's grounds (WCAG 1.4.11), the same hues in the light set and in the dark, in an order that keeps those next to each other apart for every kind of colour vision. Colour alone does not carry ten series, to any eye: a chart of many marks them by more than their colour.

Members:

- `fun chartColor(index: Int): Color`: The colour of a chart's series at `index`, counted from nought: the colours of `chart` in their order, and from the first again past the last.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixColor

`import com.pantrixui.foundation.token.color.PantrixColor`, from `com.pantrixui:foundation`

```kotlin
data class PantrixColor(
    val color: Color,
    val onColor: Color,
    val container: Color,
    val onContainer: Color
)
```

One colour role: the colour at full strength, a softer container of the same hue, and what is drawn on each.

Parameters:

- `color: Color`: The role at full strength: a solid button's fill.
- `onColor: Color`: Text and icons on `color`.
- `container: Color`: The role softened: a soft button's fill, a tinted area.
- `onContainer: Color`: Text and icons on `container`.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixColors(darkTheme: Boolean): PantrixColors
```

Pantrix's own colours: the dark set when `darkTheme`, the light one otherwise.

Parameters:

- `darkTheme: Boolean`

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixColors(preset: DesignPreset): PantrixColors
```

`preset`'s colours, dark while the system is, and following it when it switches.

Parameters:

- `preset: DesignPreset`

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixColors(
    preset: DesignPreset,
    darkTheme: Boolean
): PantrixColors
```

`preset`'s colours, the dark set when `darkTheme`: for an app that lets its reader choose light or dark, and for a theme inside another, which is as dark as the theme around it and not as the system is.

```kotlin
val dark = settings.dark ?: isSystemInDarkTheme()
PantrixTheme(preset = Brand, colors = rememberPantrixColors(Brand, darkTheme = dark)) { App() }
```

Parameters:

- `preset: DesignPreset`: whose colours they are.
- `darkTheme: Boolean`: whether the dark set is given.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### LocalPantrixColors

`import com.pantrixui.foundation.token.color.LocalPantrixColors`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixColors: ProvidableCompositionLocal<PantrixColors>
```

The colour roles in effect, which `PantrixTheme` provides: what `PantrixTheme.colors` reads. Outside a theme, `PantrixColors.Light`.

### PantrixColors.Companion.Light

`import com.pantrixui.foundation.token.color.Light`, from `com.pantrixui:foundation`

```kotlin
val PantrixColors.Companion.Light: PantrixColors
```

Pantrix's own light colours: what a theme given no preset is drawn in while it is light.

### PantrixColors.Companion.Dark

`import com.pantrixui.foundation.token.color.Dark`, from `com.pantrixui:foundation`

```kotlin
val PantrixColors.Companion.Dark: PantrixColors
```

Pantrix's own dark colours: what a theme given no preset is drawn in while it is dark.

### PantrixColors.contentColorFor

`import com.pantrixui.foundation.token.color.contentColorFor`, from `com.pantrixui:foundation`

```kotlin
fun PantrixColors.contentColorFor(container: Color): Color
```

The one colour that whatever is drawn on `container` takes: a role's `onColor` on its colour and its `onContainer` on its container. `Color.Unspecified` where the set has no one colour for it: on its own grounds, the background and the surface, and on a colour it does not have.

On its own grounds the set gives each kind of content a colour of its own: a text is `textPrimary`, an icon is `onSurface`. So a container filled with a ground gives what it holds no content colour, and each component draws there in its own default. A fill is where they all take the one colour that reads on it.

It goes by the colour alone, and a theme may use one colour twice: the dark theme fills a disabled control with the colour of its neutral container. So the disabled pair is looked at last. A fill that is a role's gets the role's content colour, which reads on it, and the disabled content colour is the answer only for a fill that is nothing but the disabled container. What is disabled asks for `disabledContent` itself.

Parameters:

- `container: Color`

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md), [Surface](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/surface.md)

### PantrixColors.contentOn

`import com.pantrixui.foundation.token.color.contentOn`, from `com.pantrixui:foundation`

```kotlin
fun PantrixColors.contentOn(
    given: Color,
    usual: Color,
    otherwise: Color
): Color
```

The colour to draw on a fill a component was given, where it was given none for what is drawn on it: the one this set pairs with `given` where that is a role's colour, as `contentColorFor` finds it, `textPrimary` where it is one of the set's grounds, and `otherwise` where it is neither.

A caller that fills a chip with a role's colour and says no more means the role's content with it, as a surface takes it: the component's usual content could not be read on that fill. On the set's background or its surface what a component draws is written as a text is there. A fill the set does not have says nothing of what reads on it, and its content is the caller's to give.

Parameters:

- `given: Color`: the fill the caller gave, or `Color.Unspecified` where it gave none.
- `usual: Color`: the fill the component has without being given one. Given again, it changes nothing: what a component draws on its usual fill is not always that fill's pair, as a segment button's label on its pill is not.
- `otherwise: Color`: what the component draws on its usual fill, and on a fill this set has no pair for.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixColors.roles

`import com.pantrixui.foundation.token.color.roles`, from `com.pantrixui:foundation`

```kotlin
fun PantrixColors.roles(): List<PantrixColor>
```

Every role in this set, in the order they are declared.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixPalette

`import com.pantrixui.foundation.token.color.PantrixPalette`, from `com.pantrixui:foundation`

```kotlin
data object PantrixPalette
```

The raw colour scales the colour sets are drawn from. A set's roles pick their shades from here; components read the roles, never these.

Members:

- `Slate: PantrixColorScale`: Cool grey with a blue cast: the default `neutral`, and the surfaces, text and lines.
- `Zinc: PantrixColorScale`: Neutral grey with a faint warm cast.
- `Neutral: PantrixColorScale`: Pure achromatic grey.
- `Red: PantrixColorScale`: The default `danger`.
- `Orange: PantrixColorScale`: Orange, between red and amber: the chart's second colour.
- `Amber: PantrixColorScale`: The default `warning`.
- `Yellow: PantrixColorScale`: Yellow, lighter than amber. No role and no chart colour takes it by default.
- `Green: PantrixColorScale`: The default `success`.
- `Emerald: PantrixColorScale`: A green with a blue cast: the chart's third colour.
- `Teal: PantrixColorScale`: A blue-green between emerald and cyan: one of the chart's colours.
- `Cyan: PantrixColorScale`: The default `info`.
- `Sky: PantrixColorScale`: A light blue between cyan and blue: the chart's last colour.
- `Blue: PantrixColorScale`: The default `primary` and `focusRing`.
- `Indigo: PantrixColorScale`: A deep blue with a violet cast: one of the chart's colours.
- `Violet: PantrixColorScale`: A blue purple. No role and no chart colour takes it by default.
- `Purple: PantrixColorScale`: A purple between violet and pink. No role and no chart colour takes it by default.
- `Pink: PantrixColorScale`: Pink: one of the chart's colours.
- `Rose: PantrixColorScale`: A pink red: one of the chart's colours.
- `all: Map<String, PantrixColorScale>`: Every scale defined here, by the name of its property: for a catalogue and for tests.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

## Package com.pantrixui.foundation.token.contentcolor

### LocalPantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixContentColor: ProvidableCompositionLocal<Color>
```

The colour that text and icons draw in where they are given none, for everything inside whatever provides it. A component that paints a fill provides the colour that reads on it: a solid button its role's `onColor`, a surface filled with a role's colour the one paired with it.

`Color.Unspecified`, the value the theme starts with, means that nothing around has provided one. It is also what the theme's own grounds provide, a scaffold on the background, a surface, a card: on them each component draws in its own default, `PantrixText` in `textPrimary`, `PantrixIcon` in `onSurface`, `PantrixSpinner` in the brand's colour.

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md), [Surface](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/surface.md)

### ProvidePantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.ProvidePantrixContentColor`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ProvidePantrixContentColor(
    color: Color,
    content: @Composable () -> Unit
)
```

Draws `content` in `color`. What a component wraps its slots in.

Parameters:

- `color: Color`
- `content: @Composable () -> Unit`

Documented on: [Colours](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

## Package com.pantrixui.foundation.token.density

### PantrixDensity

`import com.pantrixui.foundation.token.density.PantrixDensity`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixDensity(public val scale: Float)
```

Interface density: `Comfortable` unless the app gives `PantrixTheme` another. `Compact` suits pointer input, since a pointer can hit smaller targets, and `Spacious` a reader who wants more room around what is touched.

Parameters:

- `scale: Float`: What the density multiplies a style's air by: its heights, paddings, gaps and margins. Strokes, borders and icon sizes stay as they are.

Entries:

- `Compact`: Less air, 0.85 of it: for pointer input, which hits smaller targets. A touch target never shrinks below the platform's.
- `Comfortable`: The default: every style as it is.
- `Spacious`: More air, 1.15 of it, and touch targets as much larger.

Documented on: [Density](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md), [Nested theme](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

### LocalPantrixDensity

`import com.pantrixui.foundation.token.density.LocalPantrixDensity`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixDensity: ProvidableCompositionLocal<PantrixDensity>
```

The interface density in effect, which `PantrixTheme` provides: what `PantrixTheme.density` reads. Outside a theme, `PantrixDensity.Comfortable`.

Documented on: [Density](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md)

### rememberPantrixDensity

`import com.pantrixui.foundation.token.density.rememberPantrixDensity`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixDensity(): PantrixDensity
```

The default density, `PantrixDensity.Comfortable`.

Documented on: [Density](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md)

## Package com.pantrixui.foundation.token.elevation

### PantrixElevation

`import com.pantrixui.foundation.token.elevation.PantrixElevation`, from `com.pantrixui:foundation`

```kotlin
data class PantrixElevation(
    val none: Dp = 0.dp,
    val sm: Dp = 1.dp,
    val md: Dp = 2.dp,
    val lg: Dp = 4.dp,
    val xl: Dp = 8.dp
)
```

The elevation scale: how far a surface stands out from what is under it.

Parameters:

- `none: Dp`: Flat on what is under it.
- `sm: Dp`: 1dp by default.
- `md: Dp`: 2dp by default.
- `lg: Dp`: 4dp by default.
- `xl: Dp`: 8dp by default, the highest step.

Documented on: [Elevation](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elevation.md)

### LocalPantrixElevation

`import com.pantrixui.foundation.token.elevation.LocalPantrixElevation`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixElevation: ProvidableCompositionLocal<PantrixElevation>
```

The depths of the shadows in effect, which `PantrixTheme` provides: what `PantrixTheme.elevation` reads. Outside a theme, Pantrix's own.

Documented on: [Elevation](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elevation.md)

### rememberPantrixElevation

`import com.pantrixui.foundation.token.elevation.rememberPantrixElevation`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixElevation(): PantrixElevation
```

Pantrix's elevation scale.

Documented on: [Elevation](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elevation.md)

## Package com.pantrixui.foundation.token.motion

### PantrixMotion

`import com.pantrixui.foundation.token.motion.PantrixMotion`, from `com.pantrixui:foundation`

```kotlin
data class PantrixMotion(
    public val fast: Int = 100,
    public val normal: Int = 200,
    public val slow: Int = 350,
    public val standardEasing: PantrixEasing = PantrixEasing.Standard,
    public val emphasizedEasing: PantrixEasing = PantrixEasing.Emphasized,
    public val reduceMotion: Boolean = false
)
```

Durations and easings.

`EnterTransition`/`ExitTransition` are deliberately absent: they cannot honour the `@Immutable` contract's equality requirement, and putting them here would break the stability discipline the library enforces elsewhere.

Parameters:

- `fast: Int`: A quick transition, in milliseconds: a button's press.
- `normal: Int`: The usual transition, in milliseconds.
- `slow: Int`: A long transition, in milliseconds.
- `standardEasing: PantrixEasing`: The curve most transitions follow: a button's press.
- `emphasizedEasing: PantrixEasing`: The curve for a transition meant to be noticed.
- `reduceMotion: Boolean`: Whether the system's accessibility setting asks for less motion, as `rememberSystemMotion` reads it. `duration` is then 0, and a spinner or a skeleton stops moving.

Members:

- `fun duration(ms: Int): Int`: Every animation in the library takes its duration from here, so honouring "reduce motion" is one branch instead of a rule each component has to remember.

  `ms`: the duration an animation is written with, in milliseconds.

Documented on: [Motion](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

### PantrixEasing

`import com.pantrixui.foundation.token.motion.PantrixEasing`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixEasing(public val curve: Easing)
```

Compose's `Easing` is a `fun interface`, so it gives no stable identity and cannot sit in an `@Immutable` data class. Binding the curves to an enum restores equality; call sites use `curve`.

Parameters:

- `curve: Easing`: The Compose easing the entry stands for.

Entries:

- `Standard`: The curve most transitions follow: quick to start, gentle to stop.
- `Emphasized`: The curve of a transition meant to be noticed.
- `Linear`: An even pace from start to end: for what moves along with something else, such as a progress bar.

Documented on: [Motion](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

### LocalPantrixMotion

`import com.pantrixui.foundation.token.motion.LocalPantrixMotion`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixMotion: ProvidableCompositionLocal<PantrixMotion>
```

The durations and easings in effect, which `PantrixTheme` provides: what `PantrixTheme.motion` reads. Outside a theme, Pantrix's own.

Documented on: [Motion](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

### rememberSystemMotion

`import com.pantrixui.foundation.token.motion.rememberSystemMotion`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberSystemMotion(): PantrixMotion
```

Pantrix's motion, with every duration collapsed to zero while the system asks for reduced motion.

Documented on: [Motion](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

## Package com.pantrixui.foundation.token.shape

### PantrixShapes

`import com.pantrixui.foundation.token.shape.PantrixShapes`, from `com.pantrixui:foundation`

```kotlin
data class PantrixShapes(
    val xs: Shape = RoundedCornerShape(2.dp),
    val sm: Shape = RoundedCornerShape(4.dp),
    val md: Shape = RoundedCornerShape(8.dp),
    val lg: Shape = RoundedCornerShape(12.dp),
    val xl: Shape = RoundedCornerShape(16.dp)
)
```

The brand's corner radii, from square to fully round. A component style names a step through a `ShapeRole`, so the brand decides how round that step is: `Sharp` squares every step off, and `Pill` makes every step fully round.

The two ends of the scale, `none` and `full`, are the same on every brand. They are not parameters, so neither a brand nor `copy` can move them.

Parameters:

- `xs: Shape`: The smallest rounding, 2dp by default: `ShapeRole.ExtraSmall`.
- `sm: Shape`: 4dp by default: `ShapeRole.Small`.
- `md: Shape`: 8dp by default: `ShapeRole.Medium`, a button's shape on iOS.
- `lg: Shape`: 12dp by default: `ShapeRole.Large`.
- `xl: Shape`: 16dp by default.

Members:

- `none: Shape`: Square corners, on every brand.
- `full: Shape`: Fully round ends, on every brand: `ShapeRole.Full`, a button's shape on Android, desktop and the web.

On the type:

- `PantrixShapes.Sharp: PantrixShapes`: Every step squared off. `full` stays round, as it does on every brand.
- `PantrixShapes.Pill: PantrixShapes`: Every step fully round — pill buttons, circular avatars.

Documented on: [Shapes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### LocalPantrixShapes

`import com.pantrixui.foundation.token.shape.LocalPantrixShapes`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixShapes: ProvidableCompositionLocal<PantrixShapes>
```

The corner radii in effect, which `PantrixTheme` provides: what `PantrixTheme.shapes` reads. Outside a theme, Pantrix's own.

Documented on: [Shapes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### rememberPantrixShapes

`import com.pantrixui.foundation.token.shape.rememberPantrixShapes`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixShapes(): PantrixShapes
```

Pantrix's own shape scale, `PantrixShapes` with its defaults.

Documented on: [Shapes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### ShapeSpec

`import com.pantrixui.foundation.token.shape.ShapeSpec`, from `com.pantrixui:foundation`

```kotlin
sealed interface ShapeSpec
```

The shape a component style asks for: a step of the brand's shape scale, or a fixed shape.

Platform presets use a `ShapeRole`, because a preset serves every brand and the brand decides how round each step is. An app that wants a shape off the scale, such as a 10dp corner on iOS buttons only, gives `Fixed`.

Members:

- `fun resolve(shapes: PantrixShapes): Shape`: The concrete shape on `shapes`, the active brand's scale.

#### ShapeSpec.Fixed

```kotlin
class Fixed(public val shape: Shape) : ShapeSpec
```

A shape that does not follow the brand's scale.

Parameters:

- `shape: Shape`: The shape, the same on every brand.

#### ShapeSpec.Unspecified

```kotlin
data object Unspecified : ShapeSpec
```

No shape. In a style used as an override it leaves the field to the style underneath. Presets never use it; resolved on its own it gives square corners.

Documented on: [Shapes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### ShapeSpec.takeOrElse

`import com.pantrixui.foundation.token.shape.takeOrElse`, from `com.pantrixui:foundation`

```kotlin
inline fun ShapeSpec.takeOrElse(block: () -> ShapeSpec): ShapeSpec
```

This shape, or `block`'s when this one is `ShapeSpec.Unspecified`.

Parameters:

- `block: () -> ShapeSpec`

### ShapeRole

`import com.pantrixui.foundation.token.shape.ShapeRole`, from `com.pantrixui:foundation`

```kotlin
enum class ShapeRole : ShapeSpec
```

A step of `PantrixShapes`, the brand's shape scale.

A component preset stores the step rather than a concrete `Shape`, so one preset serves every brand: Pantrix's `lg` is its own, and so is the neutral brand's.

Entries:

- `ExtraSmall`: The brand's smallest rounding, `xs`: 2dp on Pantrix's own scale.
- `Small`: The brand's `sm`: 4dp on Pantrix's own scale.
- `Medium`: The brand's `md`: 8dp on Pantrix's own scale.
- `Large`: The brand's `lg`: 12dp on Pantrix's own scale.
- `Full`: Fully round ends, `full`, the same on every brand.

Documented on: [Shapes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

## Package com.pantrixui.foundation.token.spacing

### PantrixSpacing

`import com.pantrixui.foundation.token.spacing.PantrixSpacing`, from `com.pantrixui:foundation`

```kotlin
data class PantrixSpacing(
    val none: Dp = 0.dp,
    val xs: Dp = 4.dp,
    val sm: Dp = 8.dp,
    val md: Dp = 12.dp,
    val lg: Dp = 16.dp,
    val xl: Dp = 24.dp,
    val xxl: Dp = 32.dp
)
```

The spacing scale: the gaps and paddings layouts are built from. `scaled` applies the interface density to every step but `none`.

Parameters:

- `none: Dp`: No space.
- `xs: Dp`: 4dp by default.
- `sm: Dp`: 8dp by default: the gap between a button's icon and its label.
- `md: Dp`: 12dp by default.
- `lg: Dp`: 16dp by default.
- `xl: Dp`: 24dp by default.
- `xxl: Dp`: 32dp by default, the widest step.

Members:

- `fun scaled(factor: Float): PantrixSpacing`: Density applies here, not at each call site, so one switch rescales the whole system.

  `factor`: the interface density's scale: each step is multiplied by it.

Documented on: [Spacing](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/spacing.md)

### LocalPantrixSpacing

`import com.pantrixui.foundation.token.spacing.LocalPantrixSpacing`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixSpacing: ProvidableCompositionLocal<PantrixSpacing>
```

The spacing scale in effect, which `PantrixTheme` provides: what `PantrixTheme.spacing` reads. Outside a theme, Pantrix's own.

Documented on: [Spacing](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/spacing.md)

### rememberPantrixSpacing

`import com.pantrixui.foundation.token.spacing.rememberPantrixSpacing`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixSpacing(): PantrixSpacing
```

Pantrix's spacing scale.

Documented on: [Spacing](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/spacing.md)

## Package com.pantrixui.foundation.token.style

### ComponentTokenOverrides

`import com.pantrixui.foundation.token.style.ComponentTokenOverrides`, from `com.pantrixui:foundation`

```kotlin
class ComponentTokenOverrides(
    public val shapes: Map<String, ShapeRole> = emptyMap(),
    public val dimensions: Map<String, Dp> = emptyMap()
)
```

A brand's changes to component styles, by path: the first segment names the style and the rest the field, as in `"button.shape"` or `"icon.size"`. Each style reads its own in `PantrixStyleKey.brandOverride`, and a path no style reads changes nothing.

Parameters:

- `shapes: Map<String, ShapeRole>`: The shapes the brand sets, as steps of its shape scale.
- `dimensions: Map<String, Dp>`: The sizes the brand sets: heights, paddings, icon sizes.

Members:

- `fun hasOverridesFor(component: String): Boolean`: Whether any path belongs to `component`, a style's name such as `"button"`.
- `fun shape(path: String): ShapeSpec`: The shape set at `path`, or `ShapeSpec.Unspecified`, which leaves the preset's.
- `fun dimension(path: String): Dp`: The dimension set at `path`, or `Dp.Unspecified`, which leaves the preset's.

On the type:

- `ComponentTokenOverrides.None: ComponentTokenOverrides`: No overrides: every style keeps its platform preset.

Documented on: [Component styles](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PantrixStyle

`import com.pantrixui.foundation.token.style.PantrixStyle`, from `com.pantrixui:foundation`

```kotlin
interface PantrixStyle<S>
```

A component's style: the geometry and appearance a platform preset decides and a brand, a theme or a part of the tree can change.

Every field has an unspecified value (`Dp.Unspecified`, `Float.NaN`, `ShapeSpec.Unspecified`, `null`), so one type is both a complete preset and a partial override, as `TextStyle` is: `ButtonStyle(shape = ShapeRole.Medium)` changes the shape and leaves the other fields to the style underneath.

Members:

- `fun merge(other: S?): S`: This style with every field `other` specifies taken from `other`; `null` returns this.
- `fun scaled(scale: Float): S`: This style with its **air** multiplied by the interface density, and nothing else.

  Heights, paddings, gaps and margins scale; strokes, borders, dividers, elevations, icon sizes and dots do not. A compact screen is a screen with less air in it — not one whose hairlines are 0.85 of a hairline, whose icons are blurry, and whose shadows are shallower. That distinction cannot be made generically, which is why every style makes it for itself.

  A scale of `1f` must return a style equal to this one: `PantrixDensity.Comfortable` is the default, and a screenshot baseline recorded at it must not move when this arrives.

  Use `scaledForDensity`, which leaves an unspecified dimension unspecified — a partial override has to stay partial through a scaling or it stops being an override and becomes a value.

  `scale`: the interface density's scale, `PantrixDensity.scale`.

Documented on: [Component styles](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### Dp.scaledForDensity

`import com.pantrixui.foundation.token.style.scaledForDensity`, from `com.pantrixui:foundation`

```kotlin
fun Dp.scaledForDensity(scale: Float): Dp
```

A dimension scaled by the interface density.

`Dp.Unspecified` is NaN, and NaN times anything is NaN — so this would work without the check. It is here because "unspecified stays unspecified" is the rule that keeps a partial style partial, and a rule that only holds by accident is a rule waiting to stop holding.

Parameters:

- `scale: Float`: the interface density's scale, `PantrixDensity.scale`.

Documented on: [Density](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md)

### PantrixStyleKey

`import com.pantrixui.foundation.token.style.PantrixStyleKey`, from `com.pantrixui:foundation`

```kotlin
abstract class PantrixStyleKey<S : PantrixStyle<S>>(public val name: String)
```

Names a component's style and holds its platform presets.

A style declares its key as its companion object, so the style type names itself: `PantrixTheme.style(ButtonStyle)` reads it and `ButtonStyle.override(ios = …)` overrides it. The key lives with its component; nothing in core lists the components.

Parameters:

- `name: String`: The style's name, and the first segment of the paths a brand overrides it with: `"button"` in `"button.shape"`.

Members:

- `presets: PlatformPresets<S>`: The style on each platform. Complete: every field is specified.
- `open fun brandOverride(overrides: ComponentTokenOverrides): S?`: The fields `overrides` sets for this style, or null when it sets none.
- `fun override(all: S? = null, android: S? = null, ios: S? = null, desktop: S? = null, web: S? = null): PantrixStyleOverride<S>`: An override of this style, for `PantrixStyle`. `all` holds on every platform and a platform's own argument goes on top of it; each names only the fields it changes.

  `android`: the fields that change on Android, over `all`'s.

  `ios`: the fields that change on iOS, over `all`'s.

  `desktop`: the fields that change on the desktop, over `all`'s.

  `web`: the fields that change in a browser, over `all`'s.
- `fun resolve(platform: PlatformType, componentOverrides: ComponentTokenOverrides = ComponentTokenOverrides.None, styles: PantrixStyles = PantrixStyles.None, density: PantrixDensity = PantrixDensity.Comfortable): S`: The style in force on `platform`: its preset, the brand's `componentOverrides`, the theme's and the subtree's `styles`, and then the `density`. What `PantrixTheme.style` returns, for code that has no composition.

  Density last and not first, so an application that sets a height gets a scaled height rather than an unscaled one — the setting belongs to the person using the screen, and it applies to whatever the screen decided.

Documented on: [Component styles](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PlatformPresets

`import com.pantrixui.foundation.token.style.PlatformPresets`, from `com.pantrixui:foundation`

```kotlin
class PlatformPresets<S : PantrixStyle<S>>(
    public val android: S,
    public val ios: S,
    public val desktop: S,
    public val web: S
)
```

A style for each platform.

Parameters:

- `android: S`: The style on Android.
- `ios: S`: The style on iOS.
- `desktop: S`: The style on desktop.
- `web: S`: The style on the web.

Members:

- `operator fun get(platform: PlatformType): S`: The style for `platform`: `presets[PlatformType.Ios]`.

Documented on: [Component styles](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PantrixStyles

`import com.pantrixui.foundation.token.style.PantrixStyles`, from `com.pantrixui:foundation`

```kotlin
class PantrixStyles
```

Style overrides for any number of components, per platform.

Give them to `PantrixTheme(styles = …)` for the whole app, or to `ProvidePantrixStyles` for part of it. A component's style is its platform preset with the brand's overrides on top, then the theme's, then each enclosing `ProvidePantrixStyles` from the outside in. A parameter such as `PantrixButton(shape = …)` still wins over all of them.

```kotlin
PantrixTheme(
    styles = pantrixStyles(
        ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium)),
        IconStyle.override(all = IconStyle(size = 20.dp))
    )
) { App() }
```

Members:

- `fun <S : PantrixStyle<S>> overrideFor(key: PantrixStyleKey<S>, platform: PlatformType): S?`: `key`'s override on `platform`, or null when these overrides leave it alone.
- `operator fun plus(other: PantrixStyles): PantrixStyles`: These overrides with `other`'s on top: where both set a field, `other` wins.

On the type:

- `PantrixStyles.None: PantrixStyles`: No overrides: every component keeps its preset and its brand's overrides.

Documented on: [Component styles](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PantrixStyleOverride

`import com.pantrixui.foundation.token.style.PantrixStyleOverride`, from `com.pantrixui:foundation`

```kotlin
class PantrixStyleOverride<S : PantrixStyle<S>>
```

One component's style override, per platform, as `PantrixStyleKey.override` builds it.

Parameters:

- `key: PantrixStyleKey<S>`: The style it overrides.

### pantrixStyles

`import com.pantrixui.foundation.token.style.pantrixStyles`, from `com.pantrixui:foundation`

```kotlin
fun pantrixStyles(vararg overrides: PantrixStyleOverride<*>): PantrixStyles
```

Style overrides, one per component. A component given twice gets the later override on top of the earlier one.

Parameters:

- `vararg overrides: PantrixStyleOverride<*>`: the overrides, each made by a style's `override`: `ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium))`.

Documented on: [Component styles](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### ProvidePantrixStyles

`import com.pantrixui.foundation.token.style.ProvidePantrixStyles`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ProvidePantrixStyles(
    styles: PantrixStyles,
    content: @Composable () -> Unit
)
```

Overrides styles for `content` alone: denser rows on one settings screen, pill buttons in one dialog. The overrides add to those already in effect, the theme's and any enclosing call's, and win where both set a field.

Parameters:

- `styles: PantrixStyles`: the overrides for `content`, made by `pantrixStyles`.
- `content: @Composable () -> Unit`

Documented on: [Component styles](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### ShapeSpec.toShape

`import com.pantrixui.foundation.token.style.toShape`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ShapeSpec.toShape(): Shape
```

This shape on the active brand's scale.

Documented on: [Shapes](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

## Package com.pantrixui.foundation.token.typography

### LocalPantrixTextStyle

`import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixTextStyle: ProvidableCompositionLocal<TextStyle>
```

The style that text is set in where it is given none, for everything inside whatever provides it: what `PantrixText`, `PantrixLink` and `PantrixAutoText` take when no style is given them. The theme starts it at its scale's `PantrixTypography.label`, the base text on every platform. A part of a screen that reads in another role, a page of prose in the body's, provides that one with `ProvidePantrixTextStyle`.

Compose Foundation's own `BasicText` reads no such value: given no style it sets its text in `TextStyle.Default`, the system's typeface at 14sp. A text of an app's own that is not one of Pantrix's takes this one itself: `BasicText(text, style = LocalPantrixTextStyle.current)`. `TextStyle.Default` is also what this holds outside a `PantrixTheme`.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### ProvidePantrixTextStyle

`import com.pantrixui.foundation.token.typography.ProvidePantrixTextStyle`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ProvidePantrixTextStyle(
    style: TextStyle,
    content: @Composable () -> Unit
)
```

Sets the text in `content` that is given no style in `style` over the one around it: what `style` sets wins, and what it leaves out stays as it was, so `TextStyle(fontWeight = FontWeight.SemiBold)` makes the text around heavier and keeps its size.

Parameters:

- `style: TextStyle`
- `content: @Composable () -> Unit`

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixFont

`import com.pantrixui.foundation.token.typography.PantrixFont`, from `com.pantrixui:foundation`

```kotlin
data class PantrixFont(
    val resource: FontResource,
    val weight: FontWeight = FontWeight.Normal,
    val style: FontStyle = FontStyle.Normal,
    val variationSettings: FontVariation.Settings = FontVariation.Settings(weight, style)
)
```

One font of a typeface: a file of an app's resources, and the weight and the style a family registers it for.

It is what `Font(resource, weight, style)` of Compose's resources takes, kept as a value: one list of fonts then makes the family and is asked whether it has been read, and the two cannot come apart. A variable font is one file, given once for each weight it is to be drawn in.

Parameters:

- `resource: FontResource`: The font file, as the app's generated `Res.font` names it.
- `weight: FontWeight`: The weight the file is drawn for.
- `style: FontStyle`: Upright or italic.
- `variationSettings: FontVariation.Settings`: Where on a variable font's axes the font is drawn. What `weight` and `style` say when nothing is given; a font with more axes, a width or an optical size, is given them here.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypeface

`import com.pantrixui.foundation.token.typography.PantrixTypeface`, from `com.pantrixui:foundation`

```kotlin
data class PantrixTypeface(
    val fonts: List<PantrixFont>,
    val fallbacks: List<PantrixFont> = emptyList()
)
```

A typeface, as the font files it is made of, and the fonts a browser draws the characters they lack in.

```kotlin
val Brand = PantrixTypeface(
    PantrixFont(Res.font.brand_regular),
    PantrixFont(Res.font.brand_bold, FontWeight.Bold)
)
```

`rememberPantrixTypography(Brand)` is Pantrix's type scale in it, and `rememberPantrixFontFamily` its family alone. On Android, iOS and the desktop its files are read where they are asked for. A browser fetches them, and draws in a fallback face until they arrive: `areTypefacesLoaded` says when they have, and `PantrixTypefaceGate` holds a screen back until then.

In a browser, Compose draws a character none of the app's fonts has in a Noto font it fetches from Google's servers: every visitor's browser asks Google for it, a page that is offline leaves the character blank, and a content security policy must let the page reach Google. A font given in `fallbacks` that has the character is read with the typeface instead, and nothing is fetched for it. A brand that writes the marks of a Mac's keys gives Pantrix's:

```kotlin
val Brand = PantrixTypeface(
    fonts = listOf(PantrixFont(Res.font.brand_regular), PantrixFont(Res.font.brand_bold, FontWeight.Bold)),
    fallbacks = PantrixTypeface.Default.fallbacks
)
```

Parameters:

- `fonts: List<PantrixFont>`: Its fonts, each a file with its weight and its style. At least one.
- `fallbacks: List<PantrixFont>`: The fonts a browser draws a character in that none of `fonts` has, read with them: a script the typeface does not cover, as Arabic, or marks, as a Mac's keys. Each is drawn as it is, whatever the text's weight. On Android, iOS and the desktop the system's fonts draw such a character, and these are not read.

Another constructor:

```kotlin
constructor(vararg fonts: PantrixFont)
```

Its parameters:

- `vararg fonts: PantrixFont`

On the type:

- `PantrixTypeface.Default: PantrixTypeface`: Pantrix's own typeface, Plus Jakarta Sans, from the library's resources: what a theme draws in when it is given no typography. Its fallback, Pantrix Symbols, a font of a few kilobytes cut from Noto's, has the marks a shortcut is written in on Apple's systems and Plus Jakarta Sans lacks: `⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### rememberPantrixFontFamily

`import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixFontFamily(typeface: PantrixTypeface): FontFamily
```

The family of `typeface`: each of its fonts, read from its file.

In a browser a font that has not arrived yet is the fallback face, and the family changes as its fonts come in. `rememberPantrixTypography(typeface)` keeps a screen from showing that.

Parameters:

- `typeface: PantrixTypeface`

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun areTypefacesLoaded(vararg typefaces: PantrixTypeface): Boolean
```

Whether every font of `typefaces` has been read, their fallbacks too.

On Android, iOS and the desktop a font is read where it is asked for, and this is true from the first frame. A browser fetches the files: until they arrive every text in them is drawn in the fallback face the renderer carries, and is laid out again when they come. A typeface's fallbacks are read beside its fonts, and given to Compose's text once they are, so that a character only they have is drawn in them from the first frame.

Asking is what starts the read, and every font is asked for together. So the typefaces a screen needs are given in one call: two calls joined with `&&` would not ask for the second typeface until the first had come. It stays false where a file cannot be read, so whoever waits on it waits for a while and no longer.

Parameters:

- `vararg typefaces: PantrixTypeface`

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun areTypefacesLoaded(typefaces: List<PantrixTypeface>): Boolean
```

Whether every font of `typefaces` has been read: `areTypefacesLoaded` for the list an app keeps of what its first frame waits for, without spreading it into an array.

```kotlin
PantrixTypefaceGate(loaded = areTypefacesLoaded(AppTypefaces.all)) { App() }
```

Parameters:

- `typefaces: List<PantrixTypeface>`

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### isPantrixTypefaceLoaded

`import com.pantrixui.foundation.token.typography.isPantrixTypefaceLoaded`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun isPantrixTypefaceLoaded(): Boolean
```

Whether Pantrix's own typeface has been read, so that `rememberPantrixTypography` draws in it.

On Android, iOS and the desktop a font is read where it is asked for, and this is true from the first frame. A browser fetches the file: until it arrives every text is drawn in the fallback face the renderer carries, and is laid out again in the typeface when it comes, which a reader sees as the page's letters changing a moment after it opens. A web app that would rather not show that draws its screen once this is true, and what it likes until then:

```kotlin
if (isPantrixTypefaceLoaded()) App() else Splash()
```

Asking is what starts the read, and what lets the theme find the typeface at once afterwards: ask in the first composition, before the screen that is to wait. It stays false where the file cannot be read, so an app that waits on it waits for a while and no longer.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypefaceGate

`import com.pantrixui.foundation.token.typography.PantrixTypefaceGate`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixTypefaceGate(
    loaded: Boolean = isPantrixTypefaceLoaded(),
    timeoutMillis: Int = 3000,
    onShown: () -> Unit = {},
    content: @Composable () -> Unit
)
```

Draws `content` once the typeface it is to be drawn in has been read, and nothing until then.

It is for an app in a browser, and goes around all of it. Android, iOS and the desktop read a font where it is asked for, and there `content` is drawn in the first frame. A browser fetches the font and draws in a fallback face until it arrives: an app drawn in the meantime has its letters change, and every text laid out again, a moment after it opens. Here it is drawn once, in its own letters; while it waits the page shows what it showed before the app, its own loading mark.

A typeface that never comes, a missing file or no network, is waited for `timeoutMillis` and no longer: the app is then drawn in the fallback face, since an empty page is worse than the wrong letters. Once drawn, `content` stays: nothing that changes afterwards takes it away.

Parameters:

- `loaded: Boolean`: Whether the typeface has been read: Pantrix's own when nothing is given, and `areTypefacesLoaded(…)` for an app's. Asking is what starts the read.
- `timeoutMillis: Int`: The longest the typeface is waited for.
- `onShown: () -> Unit`: Called once, when the frame that holds `content` has been drawn: a page takes its loading mark away here, and has the app under it, not an empty page.
- `content: @Composable () -> Unit`: What waits for the typeface: the app.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypography

`import com.pantrixui.foundation.token.typography.PantrixTypography`, from `com.pantrixui:foundation`

```kotlin
data class PantrixTypography(
    val display: TextStyle,
    val headline: TextStyle,
    val title: TextStyle,
    val callout: TextStyle,
    val body: TextStyle,
    val label: TextStyle,
    val footnote: TextStyle,
    val caption: TextStyle,
    val code: TextStyle
)
```

Nine type roles: eight from the largest to the smallest, `display > headline > title > callout > body > label > footnote > caption`, and `code` beside them, a label's size in a monospace family.

Parameters:

- `display: TextStyle`: Page title. Typically one per screen.
- `headline: TextStyle`: Section heading.
- `title: TextStyle`: Card, panel or dialog title.
- `callout: TextStyle`: Emphasised body: a lead paragraph, an empty state's description.
- `body: TextStyle`: Body text: a paragraph, a description, what a field is typed in on Android and iOS.
- `label: TextStyle`: Control label: button, nav item, form field label, tab; what a field is typed in on the desktop and the web. The base text: what the theme starts `LocalPantrixTextStyle` at, and so what a `PantrixText` is set in when it is given no style.
- `footnote: TextStyle`: Supporting text: form help, error explanation, secondary guidance.
- `caption: TextStyle`: Metadata: timestamp, counter, table cell detail.
- `code: TextStyle`: Identity-bearing text: IDs, event names, code fragments; what a code block and a JSON view are written in.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md), [Text](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/text.md)

### LocalPantrixTypography

`import com.pantrixui.foundation.token.typography.LocalPantrixTypography`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixTypography: ProvidableCompositionLocal<PantrixTypography>
```

The type scale in effect, which `PantrixTheme` provides: what `PantrixTheme.typography` reads. Outside a theme, Pantrix's own in the system's typeface.

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixTypography(): PantrixTypography
```

Pantrix's type scale in its own face, Plus Jakarta Sans, loaded from the library's resources.

A browser fetches the font, and draws in a fallback face until it arrives: `isPantrixTypefaceLoaded` says when it has.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixTypography(
    typeface: PantrixTypeface,
    codeTypeface: PantrixTypeface? = null
): PantrixTypography
```

Pantrix's type scale in `typeface`, an app's own: the scale's sizes and weights, in the fonts the typeface names, and its `code` in `codeTypeface` where one is given.

A typeface that is changed is changed when it has arrived. A browser fetches a typeface's files, and a text in it is drawn in a fallback face until they are read: so while `typeface` or `codeTypeface` is on its way this goes on giving the scale in the typefaces it gave before, and gives it in the new ones once, when all of them have been read. Where nothing was given before, at an app's first frame, it is given in the fallback face: `PantrixTypefaceGate` holds the screen back until the typefaces are there.

```kotlin
val typography = rememberPantrixTypography(Brand, codeTypeface = BrandMono)
PantrixTheme(typography = typography) { App() }
```

Parameters:

- `typeface: PantrixTypeface`: what every role but `code` is set in.
- `codeTypeface: PantrixTypeface?`: what `code` is set in: identifiers, values, a code block's lines. Without one, the platform's monospace family, which a browser does not have: Compose on the web reaches no system font, and `code` is drawn there in a proportional fallback whose columns do not line up. An app for the web gives one.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### buildPantrixTypography

`import com.pantrixui.foundation.token.typography.buildPantrixTypography`, from `com.pantrixui:foundation`

```kotlin
fun buildPantrixTypography(
    fontFamily: FontFamily = FontFamily.Default,
    headingFontFamily: FontFamily = fontFamily,
    monoFamily: FontFamily = FontFamily.Monospace
): PantrixTypography
```

Pantrix's type scale, set in `fontFamily`, with `headingFontFamily` for display, headline and title and `monoFamily` for code. Pass a brand's families to keep the scale and change the face.

Parameters:

- `fontFamily: FontFamily`
- `headingFontFamily: FontFamily`
- `monoFamily: FontFamily`

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### TypeRole

`import com.pantrixui.foundation.token.typography.TypeRole`, from `com.pantrixui:foundation`

```kotlin
enum class TypeRole
```

A role of the type scale, by its job: what a component's style names where it says which type a text of it is set in, without holding a typeface. The theme's `PantrixTypography` says what each one is: `typography[TypeRole.Body]`.

Entries:

- `Display`: `PantrixTypography.display`.
- `Headline`: `PantrixTypography.headline`.
- `Title`: `PantrixTypography.title`.
- `Callout`: `PantrixTypography.callout`.
- `Body`: `PantrixTypography.body`.
- `Label`: `PantrixTypography.label`.
- `Footnote`: `PantrixTypography.footnote`.
- `Caption`: `PantrixTypography.caption`.
- `Code`: `PantrixTypography.code`.

Documented on: [Typography](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypography.get

`import com.pantrixui.foundation.token.typography.get`, from `com.pantrixui:foundation`

```kotlin
operator fun PantrixTypography.get(role: TypeRole): TextStyle
```

The style of `role` on this scale.

Parameters:

- `role: TypeRole`
