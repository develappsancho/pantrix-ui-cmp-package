# Accessibility

Accessibility helpers for the app's own control: the ones the library's components use.

## Features

- **Focus ring.** `Modifier.focusRing(interactionSource, shape, color, width)` draws the ring around the element; `rememberFocusRingVisible(interactionSource)` says whether the ring is to be seen right now: the element is focused, no modal is over it, and where the platform shows the ring only for the keyboard, the focus came by the keyboard.
- **Touch target.** `Modifier.minTouchTarget(min)` reserves at least `min` in the layout without changing what is drawn: a 24dp icon is pressed in a 48dp area. The value comes from the platform, `PantrixTheme.platform.minTouchTarget`.
- **Compose's slop.** The theme fits Compose's touch slop to the platform's: `PantrixViewConfiguration` gives it to `LocalViewConfiguration`.

## Examples

### Your own control's focus and touch target

Your own control's focus ring and touch target. The star is 24dp; `minTouchTarget` makes it pressable in the platform's touch target. `focusRing` draws the ring, in the theme's `focusRing` colour and the platform's width. Come to the star with Tab: the ring shows, and the line beside it writes what `rememberFocusRingVisible` says; on a mouse press the ring does not show.

```kotlin
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.selection.toggleable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.focusRing
import com.pantrixui.foundation.a11y.minTouchTarget
import com.pantrixui.foundation.a11y.rememberFocusRingVisible
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.primitives.pantrixPressIndication
import com.pantrixui.foundation.theme.PantrixTheme

val interaction = remember { MutableInteractionSource() }
var starred by remember { mutableStateOf(false) }
val platform = PantrixTheme.platform
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    Box(
        modifier = Modifier
            .minTouchTarget(platform.minTouchTarget)
            .focusRing(
                interactionSource = interaction,
                shape = PantrixTheme.shapes.full,
                color = PantrixTheme.colors.focusRing,
                width = platform.focusRingWidth
            )
            .toggleable(
                value = starred,
                interactionSource = interaction,
                indication = pantrixPressIndication(),
                role = Role.Checkbox,
                onValueChange = { starred = it }
            ),
        contentAlignment = Alignment.Center
    ) {
        PantrixIcon(
            imageVector = PantrixIcons.Star,
            contentDescription = if (starred) "Starred" else "Not starred",
            size = 24.dp,
            tint = if (starred) PantrixTheme.colors.warning.color else PantrixTheme.colors.textSecondary
        )
    }
    PantrixText(
        text = "Ring visible: ${if (rememberFocusRingVisible(interaction)) "yes" else "no"}",
        style = PantrixTheme.typography.footnote
    )
}
```

### Compose's touch slop

Where an element is small, Compose gives it a touch in the room around it too; `LocalViewConfiguration` says how much. The theme fits this value to the platform's touch target: `PantrixViewConfiguration` wraps Compose's configuration and gives the smallest touch target as the platform's. The line underneath reads it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalViewConfiguration
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.PantrixViewConfiguration
import com.pantrixui.foundation.theme.PantrixTheme

val configuration = LocalViewConfiguration.current
val target = configuration.minimumTouchTargetSize
PantrixText(
    text = "The theme's configuration: ${if (configuration is PantrixViewConfiguration) "yes" else "no"} · " +
        "smallest touch target ${target.width.value.toInt()} × ${target.height.value.toInt()} dp",
    style = PantrixTheme.typography.footnote
)
```

## API

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
