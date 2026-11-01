# Show and hide

Case study: a part that shows only in some windows, on some platforms or with some inputs. A plain `if` is enough to show and to hide. The one thing to watch is state: a part inside an `if` leaves the composition when it is hidden, and drops what it remembers.

There are three separate questions, and they are not to be mixed up: how much room the window gives, which platform the code runs on, and what the app is used with. The card of an example that looks at the window has a window selector: "Narrow", "Medium", "Short" and "Wide" give that example a fixed window, and "Real" the app's; on examples that look at the fold, "Book" and "Table" too. That is how a wide window is seen on a phone, a narrow one on the desktop, and a foldable one on a device that does not fold, without touching the window.

## Features

- **How much room does the window give?** `window.isNarrow`, `window.isShort`, `window.widthClass >= ...`. The answer is the same on a phone and in a narrowed desktop window: this is what "the mobile view" most often is.
- **Which platform does the code run on?** `PantrixTheme.platform.type`. It has nothing to do with the window's size: a "download the app" banner makes sense only on the web, and "rate in the store" only on Android and iOS.
- **What is it used with?** `PantrixTheme.platform.isTouch`: a finger or a mouse. The platform does not tell this: a phone's browser is the web too, but is used with a finger.
- **Changing instead of hiding.** Where the same component is in both layouts, it is not hidden and called from another place; the value it is given changes. A modifier that depends on a condition is written with `Modifier.thenIf`.
- **The state of what is hidden.** Where the same content is called from two separate places, Compose counts it as two separate contents: when the window changes class, one goes and the other starts from zero. Call it from one place, and give what changes as a parameter.
- **Moving.** Where what the content stands in has to change, one under another in a narrow window and side by side in a wide one, `movableContentOf` moves it together with what it remembers.
- **Saved state.** State that has to stay is kept with `rememberSaveable`: when Android recreates an Activity, what `remember` held is gone, and what was saved comes back by the place it is called from.
- **A window of its own for a part.** `LocalPantrixWindow` gives a part of the screen another window: the way to set up a preview or a test at a given size, and what the cards' window selector does too.

## Examples

### By window

Parts that come and go with the room the window gives. `isNarrow` holds only in a narrow window, `!isNarrow` in every window that is not narrow. The classes are in order: `widthClass >= WindowWidthClass.Expanded` holds from a class on, `widthClass in Medium..Expanded` between two classes. `isShort` holds only in a short window. A hidden part is not in the composition: it takes no room and is not read.

On a phone held upright only the "in a narrow window" line appears; on most phones turned on their side, the other four do. In a desktop window wider than 1200 dp the "not narrow" and "From Expanded on" lines remain.

The card's window selector gives this example a window of its own: "Narrow" is a fixed window of 360 × 800 dp, "Medium" one of 768 × 1024, "Short" one of 880 × 400 and "Wide" one of 1280 × 800; "Real" is the app's. The line under it says which window the example is looking at right now. "Medium" is a tablet held upright and is `Medium`: the "not narrow" and "in Medium and Expanded" lines appear. "Short" is a phone on its side, `Expanded` at 880 dp and short at 400 dp: all four lines but the "in a narrow window" one appear.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
// Only in a narrow window: a phone held upright and every narrowed window.
if (window.isNarrow) {
    PantrixText(
        text = "Only in a narrow window: the 'Add to cart' bar at the bottom of the page",
        tagKey = "narrow_only"
    )
}
// In every window that is not narrow: from a tablet to the desktop.
if (!window.isNarrow) {
    PantrixText(text = "In a window that is not narrow: the action is the button in the header", tagKey = "not_narrow")
}
// From a given class on: the classes are in order, so they can be compared.
if (window.widthClass >= WindowWidthClass.Expanded) {
    PantrixText(text = "From Expanded on: the detail pane beside the list", tagKey = "from_expanded")
}
// Between two classes: a range.
if (window.widthClass in WindowWidthClass.Medium..WindowWidthClass.Expanded) {
    PantrixText(text = "Only in Medium and Expanded: the labelled rail", tagKey = "medium_to_expanded")
}
// Only in a short window: a phone on its side.
if (window.isShort) {
    PantrixText(text = "Only in a short window: the smaller top bar", tagKey = "short_only")
}
```

### By platform

Parts that come and go with the platform: `PantrixTheme.platform.type`. It has nothing to do with the window's size: a wide Android tablet is still Android, and a narrowed browser window is still the web. Saying "show it on mobile" means deciding which of the two is meant: most often the window, sometimes the platform.

On the web the first line appears, on Android and iOS the second; in the desktop app only the platform's name is shown.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.PlatformType
import com.pantrixui.foundation.theme.PantrixTheme

val platform = PantrixTheme.platform.type
if (platform == PlatformType.Web) {
    PantrixText(text = "Only on the web: the 'Download the app' banner", tagKey = "web_only")
}
if (platform == PlatformType.Android || platform == PlatformType.Ios) {
    PantrixText(text = "On Android and iOS: the 'Rate in the store' link", tagKey = "store_platforms")
}
PantrixText(
    text = "This platform: ${platform.name}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "platform"
)
```

### By input

Whether the app is used with a finger or with a mouse: `PantrixTheme.platform.isTouch`. The platform's type does not tell this. Android and iOS are always used by touch and the desktop always with a mouse; the web may be either: a browser on a desk is used with a mouse, one on a phone with a finger. In a browser the answer is live: when the pointer changes, so does the answer.

Where the app is used by touch the pull-to-refresh hint appears, and where it is used with a mouse the keyboard shortcuts hint. The touch target depends on the same answer: 48 dp on Android and 44 on iOS; on the desktop and the web, 32 dp for a mouse and 48 for a finger. The components take it from the theme themselves; here it is only shown.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val platform = PantrixTheme.platform
if (platform.isTouch) {
    PantrixText(text = "Used by touch: the pull-to-refresh hint", tagKey = "touch_only")
}
if (!platform.isTouch) {
    PantrixText(text = "Used with a mouse: the keyboard shortcuts hint", tagKey = "pointer_only")
}
PantrixText(
    text = "Touch: ${if (platform.isTouch) "yes" else "no"} · " +
        "touch target: ${platform.minTouchTarget.value.roundToInt()} dp",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "input"
)
```

### The same component, a value that changes

A single component that is not hidden but changes with the window: the button fills the row in a narrow window and keeps its own width in a wide one. The component is the same call; only the value it is given changes. `Modifier.thenIf` adds its block to the chain when the condition holds.

Try "Narrow" and "Wide" in the card's window selector, or turn the phone: the button stays where it is and its width changes.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.primitives.thenIf
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
PantrixButton(
    text = "Continue",
    onClick = {},
    modifier = Modifier.thenIf(window.isNarrow) { fillMaxWidth() },
    tagKey = "continue"
)
```

### What happens to state when a part is hidden

Two counters, the same job, written two ways. The first is called from two separate places, one for a narrow window and one for a wide one: Compose counts them as two separate counters, and when the window changes class one goes and the other starts from zero. The second is called from a single place and only its label changes: its count stays.

Increase both, then switch between "Narrow" and "Wide" in the card's window selector: the one called from two places goes back to zero, and the other stays. For an extra, such as a hint or a banner, that is no problem; content that is in both layouts is called from one place.

The counter remembers its count with `rememberSaveable`: when Android recreates an Activity, what a plain `remember` held is gone, wherever it was called from. A saved value, too, comes back by the place it is called from: the counter called from one place always finds its count. The one called from two finds it where the window is still narrow, or still wide, when the Activity is recreated: the same branch is composed. Where it has gone from narrow to wide or from wide to narrow, as on a phone that is turned, it does not.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
// Counters that do not fit side by side go onto the next line: their labels change length with the window.
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    // WRONG: the same content from two separate places. The count goes back to zero when the class changes.
    if (window.isNarrow) {
        Counter(label = "From two places (narrow)", tagKey = "two_sites")
    } else {
        Counter(label = "From two places (wide)", tagKey = "two_sites")
    }
    // RIGHT: from one place; the label that changes is a parameter. The count is kept.
    Counter(label = if (window.isNarrow) "From one place (narrow)" else "From one place (wide)", tagKey = "one_site")
}

@Composable
private fun Counter(
    label: String,
    tagKey: String
) {
    var count by rememberSaveable { mutableIntStateOf(0) }
    PantrixButton(
        text = "$label: $count",
        onClick = { count++ },
        variant = ButtonVariant.Outline,
        tagKey = tagKey
    )
}
```

### The same content, another arrangement

The same content in another arrangement: one under another in a narrow window, side by side in a wide one. `Column` and `Row` are two separate call sites: had the content passed from one to the other by a plain call, it would have dropped what it remembers. `movableContentOf` moves the content: the same composition goes to its new place, and the counters keep their counts. It is for when a single call site is not enough, that is, when what the content stands in has to change.

Increase the counters, then switch between "Narrow" and "Wide" in the card's window selector: the arrangement changes, the counts stay.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.movableContentOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
val spacing = PantrixTheme.spacing
// Made once and remembered; when the place it is called from changes, the content moves there.
val counters = remember {
    movableContentOf {
        Counter(label = "Moved A", tagKey = "moved_a")
        Counter(label = "Moved B", tagKey = "moved_b")
    }
}
if (window.isNarrow) {
    Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) { counters() }
} else {
    Row(horizontalArrangement = Arrangement.spacedBy(spacing.md)) { counters() }
}

@Composable
private fun Counter(
    label: String,
    tagKey: String
) {
    var count by rememberSaveable { mutableIntStateOf(0) }
    PantrixButton(
        text = "$label: $count",
        onClick = { count++ },
        variant = ButtonVariant.Outline,
        tagKey = tagKey
    )
}
```

### A window of its own for a part

What the cards' window selector does, in its plainest form: `LocalPantrixWindow` gives a part of the screen another window. Every `PantrixTheme.window` and `responsive(...)` inside it asks that window. A fixed window is made with `PantrixWindow(size, breakpoints)` and is classed by the real one's breakpoints: where a product has given the theme breakpoints of its own, it follows them too.

The first line shows the window the example sees: the app's, or the one the card's selector has given it. Each of the two parts under it is given a fixed window: one always picks the narrow layout and the other always the wide one, whatever the window around them. Try "Narrow" and "Wide" in the card's window selector: the first line changes, the two under it do not. The same technique is also used to set up a preview or a test at a given size. The platform and the input are not affected by it.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.LocalPantrixWindow
import com.pantrixui.foundation.adaptive.PantrixWindow
import com.pantrixui.foundation.adaptive.responsive
import com.pantrixui.foundation.theme.PantrixTheme

val real = PantrixTheme.window
// Two fixed windows, classed by the real one's breakpoints.
val narrow = remember(real) { PantrixWindow(DpSize(360.dp, 800.dp), breakpoints = real.breakpoints) }
val wide = remember(real) { PantrixWindow(DpSize(1280.dp, 800.dp), breakpoints = real.breakpoints) }
PantrixText(text = "The window the example sees: ${real.widthClass.name}", tagKey = "theme_window")
CompositionLocalProvider(LocalPantrixWindow provides narrow) {
    PantrixText(
        text = "A part given 360 × 800 dp: ${PantrixTheme.window.widthClass.name}, " +
            responsive(compact = "narrow layout", expanded = "wide layout"),
        tagKey = "narrow_part"
    )
}
CompositionLocalProvider(LocalPantrixWindow provides wide) {
    PantrixText(
        text = "A part given 1280 × 800 dp: ${PantrixTheme.window.widthClass.name}, " +
            responsive(compact = "narrow layout", expanded = "wide layout"),
        tagKey = "wide_part"
    )
}
```

## API

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Whether the window is narrow: its width class is `WindowWidthClass.Compact`, as a phone held upright is. The layout of one pane, with its navigation along the bottom.

A name for `widthClass == WindowWidthClass.Compact`, for code that reads as the rule it follows: `if (window.isNarrow) BottomBar()`. For "from this width on", compare the class: `widthClass >= Expanded`.

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

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

### LocalPantrixWindow

`import com.pantrixui.foundation.adaptive.LocalPantrixWindow`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixWindow: ProvidableCompositionLocal<PantrixWindow>
```

The window in effect: the one the nearest `PantrixTheme` provides. With no theme around, the one Compose reports, classed by the default breakpoints and flat.

`PantrixTheme.window` reads it. Provide it to give a part of the screen a window of its own without a second theme: a pane whose content is to answer to the pane's width.

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
