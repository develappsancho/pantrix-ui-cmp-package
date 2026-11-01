# Platform and system

The platform the code runs on and the system's accessibility settings. The theme reads them itself and tells the components; the app can read them from the same place.

## Features

- **Platform.** `currentPlatformType()` is Android, iOS, desktop or web; `currentOperatingSystem()` is the operating system, in a browser the one the browser runs on.
- **The platform's conventions.** `PantrixPlatform` is accessibility decisions: the smallest touch target, the focus ring's width and whether it is shown for the keyboard alone, whether it is used by touch. `rememberPantrixPlatform()` gives this device's, `PantrixPlatform.forType(…)` a platform's; `PantrixTheme(platform = …)` gives them to what is in it.
- **System settings.** Reducing motion, high contrast, telling apart by marks other than colour, a touch pointer, the system's language and its clock's offset from UTC: each is a `system…` function.
- **Pointer shapes.** `PantrixPointerIcons` is the pointer over a control that makes something larger or smaller when it is dragged: across, and up and down. Compose's own four pointers do not have it.

## Examples

### This device

This device: the platform the code runs on, the operating system and the platform's conventions (`rememberPantrixPlatform()`). The platform the theme says (`PantrixTheme.platform`) can be another: another platform's look can be chosen in this app's "Settings"; the device itself does not change.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.Dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.rememberPantrixPlatform
import com.pantrixui.foundation.platform.currentOperatingSystem
import com.pantrixui.foundation.platform.currentPlatformType
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val device = rememberPantrixPlatform()
val system = currentOperatingSystem()
Lines(
    "Platform: ${currentPlatformType().name}",
    "Operating system: ${system.name}${if (system.isApple) " (Apple)" else ""}",
    "Smallest touch target: ${device.minTouchTarget.value.toInt()}dp",
    "Focus ring: ${device.focusRingWidth.written()}, for the keyboard alone: ${yesNo(device.showFocusRingOnlyForKeyboard)}",
    "Used by touch: ${yesNo(device.isTouch)}",
    "The theme's platform: ${PantrixTheme.platform.type.name}"
)

@Composable
private fun Lines(vararg lines: String) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        lines.forEach { line -> PantrixText(text = line, style = PantrixTheme.typography.footnote) }
    }
}

private fun Dp.written(): String {
    val tenths = (value * 10).roundToInt()
    return if (tenths % 10 == 0) "${tenths / 10}dp" else "${tenths / 10}.${tenths % 10}dp"
}

private fun yesNo(value: Boolean): String = if (value) "yes" else "no"
```

### System settings

The system's settings, as they are when read: reducing motion, increasing contrast, telling apart by marks other than colour ("Differentiate Without Color" on iOS), whether the pointer is a finger, the system's language and its clock's offset from UTC. When a setting changes the lines change too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.systemDifferentiatesWithoutColor
import com.pantrixui.foundation.platform.systemIsInHighContrast
import com.pantrixui.foundation.platform.systemPantrixLocale
import com.pantrixui.foundation.platform.systemPointerIsTouch
import com.pantrixui.foundation.platform.systemReduceMotion
import com.pantrixui.foundation.platform.systemUtcOffset
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Clock

val offset = systemUtcOffset(Clock.System.now())
val hours = offset.inWholeMinutes / 60.0
Lines(
    "Reduce motion: ${yesNo(systemReduceMotion())}",
    "Increase contrast: ${yesNo(systemIsInHighContrast())}",
    "Differentiate without colour: ${yesNo(systemDifferentiatesWithoutColor())}",
    "Touch pointer: ${yesNo(systemPointerIsTouch())}",
    "The system's language: ${systemPantrixLocale().languageTag}",
    "Offset from UTC: ${if (hours >= 0) "+" else ""}${if (hours % 1.0 == 0.0) hours.toInt() else hours} hours"
)

@Composable
private fun Lines(vararg lines: String) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        lines.forEach { line -> PantrixText(text = line, style = PantrixTheme.typography.footnote) }
    }
}

private fun yesNo(value: Boolean): String = if (value) "yes" else "no"
```

### Another platform's conventions

Another platform's conventions, on this device: the inner theme was given `PantrixPlatform.forType(…)`. The components are drawn with that platform's look and touch target: 44dp on iOS, 48dp on Android, 32dp on a desktop used with a mouse. Choose a platform and look at the text field's and the button's height.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.a11y.PantrixPlatform
import com.pantrixui.foundation.platform.PlatformType
import com.pantrixui.foundation.theme.PantrixTheme

var type by remember { mutableStateOf(PlatformType.Ios) }
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixSegmentButton(options = PLATFORMS, selected = type, onSelect = { type = it }, tagKey = "platform")
    PantrixTheme(platform = PantrixPlatform.forType(type)) {
        PantrixText(
            text = "Touch target: ${PantrixTheme.platform.minTouchTarget.value.toInt()}dp",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixTextField(
            state = rememberTextFieldState(),
            modifier = Modifier.fillMaxWidth(),
            label = "Name",
            tagKey = "platform_name"
        )
        PantrixSwitchButton(checked = true, onCheckedChange = {}, label = "Notifications", tagKey = "platform_notify")
        PantrixButton(text = "Save", onClick = {}, tagKey = "platform_save")
    }
}

private val PLATFORMS = listOf(
    SegmentOption(PlatformType.Android, "Android", tagKey = "android"),
    SegmentOption(PlatformType.Ios, "iOS", tagKey = "ios"),
    SegmentOption(PlatformType.Desktop, "Desktop", tagKey = "desktop"),
    SegmentOption(PlatformType.Web, "Web", tagKey = "web")
)
```

### Resize pointer

Making a panel wider by dragging its edge and taller by dragging its bottom edge. Over a handle the pointer is the one that says what a drag will change: `pointerHoverIcon(PantrixPointerIcons.ResizeHorizontal)` and `ResizeVertical`. The pointer shows on a desktop, on the web, and on Android under a mouse; on iOS Compose does not change the pointer at all, and under a finger there is no pointer. A real handle is open to a keyboard and a screen reader too: the handle of `PantrixListDetailScaffold(resizable = true)` is.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.PantrixPointerIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var size by remember { mutableStateOf(DpSize(240.dp, 120.dp)) }
// In a language read from the right the panel's end is its left edge; the panel grows to the left.
val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
PantrixSurface(modifier = Modifier.size(size), border = PantrixTheme.colors.border) {
    PantrixText(
        text = "${size.width.value.roundToInt()} × ${size.height.value.roundToInt()} dp",
        modifier = Modifier.align(Alignment.Center),
        style = PantrixTheme.typography.footnote
    )
    ResizeGrip(
        orientation = Orientation.Horizontal,
        modifier = Modifier.align(Alignment.CenterEnd).width(GRIP).fillMaxHeight()
    ) { by ->
        val wider = size.width + if (rtl) -by else by
        size = size.copy(width = wider.coerceIn(PANEL_LEAST.width, PANEL_MOST.width))
    }
    ResizeGrip(
        orientation = Orientation.Vertical,
        modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth().height(GRIP)
    ) { by ->
        size = size.copy(height = (size.height + by).coerceIn(PANEL_LEAST.height, PANEL_MOST.height))
    }
}

@Composable
private fun ResizeGrip(
    orientation: Orientation,
    modifier: Modifier,
    onDrag: (by: Dp) -> Unit
) {
    val density = LocalDensity.current
    val drag by rememberUpdatedState(onDrag)
    val across = orientation == Orientation.Horizontal
    val color = PantrixTheme.colors.textSecondary
    Box(
        modifier = modifier
            .pointerHoverIcon(if (across) PantrixPointerIcons.ResizeHorizontal else PantrixPointerIcons.ResizeVertical)
            .draggable(state = rememberDraggableState { drag(with(density) { it.toDp() }) }, orientation = orientation)
            .drawBehind {
                val long = MARK_LONG.toPx()
                val thick = MARK_THICK.toPx()
                val mark = if (across) Size(thick, long) else Size(long, thick)
                drawRoundRect(
                    color = color,
                    topLeft = Offset((size.width - mark.width) / 2, (size.height - mark.height) / 2),
                    size = mark,
                    cornerRadius = CornerRadius(thick / 2)
                )
            }
    )
}

private val PANEL_LEAST = DpSize(160.dp, 80.dp)

private val PANEL_MOST = DpSize(320.dp, 200.dp)

private val GRIP = 12.dp

private val MARK_LONG = 24.dp

private val MARK_THICK = 4.dp
```

## API

### currentPlatformType

`import com.pantrixui.foundation.platform.currentPlatformType`, from `com.pantrixui:foundation`

```kotlin
fun currentPlatformType(): PlatformType
```

Which platform the code is actually running on.

This is only the *default* for `PantrixTheme(platform = ...)`. Overriding it is a supported and intended thing to do — that is how a preview shows iOS geometry on a desktop, and how a product ships one look everywhere.

### currentOperatingSystem

`import com.pantrixui.foundation.platform.currentOperatingSystem`, from `com.pantrixui:foundation`

```kotlin
fun currentOperatingSystem(): OperatingSystem
```

The operating system the code is running on; in a browser, the one the browser runs on.

Not a theme default like `currentPlatformType`: a preview of iOS geometry on a desktop still runs on the desktop's system, and is typed on the desktop's keyboard.

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

### rememberPantrixPlatform

`import com.pantrixui.foundation.a11y.rememberPantrixPlatform`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixPlatform(): PantrixPlatform
```

This device's conventions: its `PlatformType`'s, with the focus ring thickened when the system is in high contrast, and with the touch target of what points at it: in a browser, a finger's on a phone and a mouse's on a desk. Both are followed as they change.

### systemReduceMotion

`import com.pantrixui.foundation.platform.systemReduceMotion`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemReduceMotion(): Boolean
```

The OS "reduce motion" setting.

Feeds `PantrixMotion.reduceMotion`, which collapses every duration to zero. Components never check this themselves; they ask `motion.duration(...)`, so honouring the setting is one decision instead of a rule each component has to remember.

### systemIsInHighContrast

`import com.pantrixui.foundation.platform.systemIsInHighContrast`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemIsInHighContrast(): Boolean
```

The OS "increase contrast" accessibility setting.

Dark mode is deliberately absent from this file: Compose Multiplatform already provides `isSystemInDarkTheme()` in common code, and reimplementing it per platform would be a worse copy of something maintained upstream.

### systemDifferentiatesWithoutColor

`import com.pantrixui.foundation.platform.systemDifferentiatesWithoutColor`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemDifferentiatesWithoutColor(): Boolean
```

Whether the system is set to tell things apart by more than their colour: iOS's "Differentiate Without Color", and on Android the colour correction a colour-blind user turns on.

Always false on the desktop and in a browser, which tell nothing of such a setting. Feeds a chart's patterns, where its style leaves them to the system: a series that colour alone tells apart from the next is told by a texture too.

### systemPointerIsTouch

`import com.pantrixui.foundation.platform.systemPointerIsTouch`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemPointerIsTouch(): Boolean
```

Whether the system is used by touch: its primary pointer is a finger, which is less exact than a mouse and needs a larger target.

Always true on Android and iOS, and always false on the desktop, where the JVM tells nothing of a touch screen. A browser runs on both kinds of device: there it is the `pointer: coarse` media query, which is true on a phone and a tablet and false on a laptop, a touch screen on it or not, and it is followed as it changes.

Feeds `PantrixPlatform.isTouch` through `rememberPantrixPlatform`, and with it the touch target a browser gets.

### systemPantrixLocale

`import com.pantrixui.foundation.platform.systemPantrixLocale`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemPantrixLocale(): PantrixLocale
```

The OS locale, including writing direction.

### systemUtcOffset

`import com.pantrixui.foundation.platform.systemUtcOffset`, from `com.pantrixui:foundation`

```kotlin
fun systemUtcOffset(moment: Instant): Duration
```

How far the device's clock is ahead of UTC at `moment`: three hours in Istanbul, and less than nought west of Greenwich. It is asked for a moment, since it changes where clocks are put forward for the summer.

What a day and a time of day are worked out with where no library of time zones is at hand: a moment and this give the day and the hour the device's own clock shows. It is the offset of `PantrixClock.System`, the clock a screen is read by unless a test or a preview gives another.

Parameters:

- `moment: Instant`

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
