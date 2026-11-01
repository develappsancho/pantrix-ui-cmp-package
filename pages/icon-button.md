# Icon Button

A button that is only an icon: close, refresh, search. It is square, as tall as a `PantrixButton` of the same size, and fully round by default. As it has no label, `contentDescription` says what it does.

- `PantrixIconButton` (`com.pantrixui.components.elements.iconbutton`, `com.pantrixui:components`): A button that is only an icon, in the button's variants and sizes; its content description names the action for a screen reader. Keywords: icon action, toolbar button, close button, image button, glyph button.

## Features

- **Six variants.** `variant` picks the button's colours: they are `PantrixButton`'s variants. The default is `ButtonVariant.Text`: it has no surface, and is for the actions in a toolbar.
- **Five sizes.** `size` picks the button's side and its icon's size together: the button from 24dp to 56dp, its icon from 16dp to 32dp.
- **Touch target.** As much room as the platform's minimum touch target is kept around the button: a button that is drawn small can be pressed with a finger too.
- **Shape.** It is fully round on every platform; `shape` gives it one of the theme's shapes, or any `Shape`.
- **Description.** `contentDescription` is the name a screen reader reads, and it names the action, not the icon: "Close", not "cross".
- **A button without a description.** Null is given only to a button that repeats what something a screen reader and the keyboard already reach does. Such a button is hidden from the reader and is no stop for the keyboard; a mouse and a finger still press it.
- **Its own content.** There is a second `PantrixIconButton` that takes content in place of an icon: an icon with a badge, an animated icon. A screen reader hears the description alone.
- **Colours.** By default `colors` is the variant's colours in the `primary` role, and for `Destructive` in the `danger` role; `PantrixColor.buttonColors(variant)` gives them in another role, and `ButtonColors` in a colour entirely its own.
- **Disabled.** `enabled = false` draws the button faded, and the button takes no press. A variant with no fill stays without one when disabled.

## Usage

### Close

```kotlin
PantrixIconButton(
    imageVector = PantrixIcons.Close,
    contentDescription = PantrixTheme.strings.close,
    onClick = onClose,
    tagKey = "close"
)
```

### Soft, in a toolbar

```kotlin
PantrixIconButton(
    imageVector = PantrixIcons.Check,
    contentDescription = stringResource(Res.string.confirm),
    onClick = onConfirm,
    variant = ButtonVariant.Soft,
    size = ButtonSize.Small,
    tagKey = "confirm"
)
```

## Examples

### At its plainest

The least it takes: an icon, a description that says what it does, and the action to run when it is pressed. Its variant is `Text` and its size `Medium`: a round button of 40dp with no fill.

Press the button: the line under it says how many times it was pressed. As it has no fill, the button's circle shows while it is pressed and while the keyboard focus is on it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var refreshed by rememberSaveable { mutableIntStateOf(0) }
PantrixIconButton(
    imageVector = PantrixIcons.Refresh,
    contentDescription = "Refresh",
    onClick = { refreshed += 1 },
    tagKey = "refresh"
)
PantrixText(
    text = "Times refreshed: $refreshed",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "refreshed"
)
```

### Variants

`variant` picks the button's colours; all six are `PantrixButton`'s variants. `Solid` is the main action on a screen, `Outline`, `Soft` and `Subtle` are secondary actions, and `Destructive` says the action cannot be undone.

The default is `Text`: it has no surface, and only its icon is drawn. It is for the actions in a toolbar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    ButtonVariant.entries.forEach { variant ->
        PantrixIconButton(
            imageVector = PantrixIcons.Star,
            contentDescription = "Button in the ${variant.name} variant",
            onClick = {},
            variant = variant,
            tagKey = "variant_${variant.name}"
        )
    }
}
```

### Sizes

`size` picks one of five sizes: the button is a square of 24, 32, 40, 48 or 56 dp, and its icon is 16, 20, 24, 28 or 32 dp. The default is `Medium`. Beside a `PantrixButton` of the same size, the two are the same height.

The room around the small buttons is the touch target: a button is drawn small but takes up as much room as the platform's minimum touch target. That is 48dp on Android, 44dp on iOS, and 32dp on desktop and the web when they are used with a mouse.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    ButtonSize.entries.forEach { size ->
        PantrixIconButton(
            imageVector = PantrixIcons.Plus,
            contentDescription = "Button in the ${size.name} size",
            onClick = {},
            variant = ButtonVariant.Soft,
            size = size,
            tagKey = "size_${size.name}"
        )
    }
}
```

### Shape and style

An icon button is fully round on every platform. `shape` changes that: the second button has the theme's medium roundness (`shapes.md`), and the third has square corners (`shapes.none`).

`style` changes the button's dimensions: an icon button reads only the sizes of `ButtonStyle`. The last button is still `Medium`, but its icon is drawn at 16dp instead of 24dp. Only the field that is set changes, and the rest comes from the theme's style.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonSizeStyle
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Fully round button",
        onClick = {},
        variant = ButtonVariant.Soft,
        tagKey = "pill"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Slightly round button",
        onClick = {},
        variant = ButtonVariant.Soft,
        shape = PantrixTheme.shapes.md,
        tagKey = "rounded"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Square-cornered button",
        onClick = {},
        variant = ButtonVariant.Soft,
        shape = PantrixTheme.shapes.none,
        tagKey = "square"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Button with a small icon",
        onClick = {},
        variant = ButtonVariant.Soft,
        style = ButtonStyle(medium = ButtonSizeStyle(iconSize = 16.dp)),
        tagKey = "small_icon"
    )
}
```

### Disabled

`enabled = false` draws the button faded, and the button takes no press. A variant with a fill takes the theme's disabled fill; `Text` and `Outline`, which have no fill, stay without one when disabled, and do not turn into a grey shape.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    listOf(ButtonVariant.Text, ButtonVariant.Outline, ButtonVariant.Soft, ButtonVariant.Solid).forEach { variant ->
        PantrixIconButton(
            imageVector = PantrixIcons.Calendar,
            contentDescription = "Add to calendar",
            onClick = {},
            variant = variant,
            enabled = false,
            tagKey = "disabled_${variant.name}"
        )
    }
}
```

### In another role and in a colour of its own

A variant's colours come from the theme's `primary` role, and `Destructive`'s from the `danger` role. `PantrixColor.buttonColors(variant)` gives the same variant in another role: the first two buttons are in the `success` and `danger` roles.

The last button's colour is in none of the theme's roles: `ButtonColors` takes the fill and the icon's colour directly. The icon is given no colour of its own: it takes the button's content colour by itself.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val own = ownColors()
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixIconButton(
        imageVector = PantrixIcons.Check,
        contentDescription = "Approve",
        onClick = {},
        colors = colors.success.buttonColors(ButtonVariant.Soft),
        tagKey = "approve"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Close,
        contentDescription = "Reject",
        onClick = {},
        colors = colors.danger.buttonColors(ButtonVariant.Outline),
        tagKey = "reject"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Star,
        contentDescription = "Add to collection",
        onClick = {},
        colors = ButtonColors(container = own.color, content = own.onColor),
        tagKey = "own_colors"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Its own content: an icon with a badge

The `PantrixIconButton` that takes content in place of an icon: here an icon with a badge at its corner. The content is drawn in the button's content colour.

What is in the button is a picture of what the description says: a screen reader hears the description alone. So the badge's count is written in the description, "Inbox, 3 unread"; the badge itself is not read. "New message" raises the count, and a press on the icon button resets it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var unread by rememberSaveable { mutableIntStateOf(3) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIconButton(
        contentDescription = if (unread > 0) "Inbox, $unread unread" else "Inbox",
        onClick = { unread = 0 },
        tagKey = "inbox"
    ) {
        PantrixBadgedBox(badge = { if (unread > 0) PantrixBadge(count = unread) }) {
            PantrixIcon(imageVector = PantrixIcons.Inbox, contentDescription = null)
        }
    }
    PantrixButton(
        text = "New message",
        onClick = { unread += 1 },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "new_message"
    )
}
```

### A button without a description

`contentDescription = null` is given only to a button that repeats what something else already does. Here the whole card is pressed and opens the order; the arrow at its end does the same thing and is a sign for the eye alone.

Such a button is hidden from screen readers and is no stop for the keyboard: a stop on something the reader will never read is worse than no stop at all. A mouse and a finger still press it. A button that is the only way to its action always has a description.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var opened by rememberSaveable { mutableIntStateOf(0) }
PantrixCard(
    modifier = Modifier.widthIn(max = 360.dp),
    variant = CardVariant.Outlined,
    onClick = { opened += 1 },
    tagKey = "order"
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = "Order 8F2A-19C4", style = PantrixTheme.typography.callout)
            PantrixText(text = "Arrives tomorrow", color = PantrixTheme.colors.textSecondary)
        }
        PantrixIconButton(
            imageVector = PantrixIcons.ChevronForward,
            contentDescription = null,
            onClick = { opened += 1 },
            tagKey = "open_order"
        )
    }
}
PantrixText(
    text = "Times the order was opened: $opened",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "order_opened"
)
```

## API

### PantrixIconButton

`import com.pantrixui.components.elements.iconbutton.PantrixIconButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixIconButton(
    imageVector: ImageVector,
    contentDescription: String?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Text,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    shape: Shape = PantrixTheme.shapes.full,
    colors: ButtonColors = variant.colors(),
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    style: ButtonStyle? = null
)
```

A button that shows only an icon: square, as tall as a `size` button, round by default, with the platform's minimum touch target around it. `variant` picks its colours; `ButtonVariant.Text`, the default, has no container, disabled or not. `contentDescription` names the action for screen readers, "Close" rather than "X". A pointer over the button lays a light cover of its icon's colour on it, and a press a stronger one.

Pass null only for a button that repeats what something a screen reader and the keyboard already reach does: an arrow at the end of a row that is pressed as a whole. Such a button is hidden from screen readers, and is no stop for the keyboard either, since focus would land on something that is never announced; a pointer still presses it. A button that is the only way to its action always has a description.

Parameters:

- `imageVector: ImageVector`: the icon the button shows.
- `contentDescription: String?`
- `onClick: () -> Unit`: what a press does.
- `modifier: Modifier`: the button's modifier.
- `variant: ButtonVariant`
- `size: ButtonSize`
- `enabled: Boolean`: whether the button can be pressed: one that cannot is drawn in the disabled colours and does nothing.
- `shape: Shape`: the button's corners: fully round unless told.
- `colors: ButtonColors`: this call's own colours, in place of `variant`'s.
- `tagKey: String?`: the button's automation key: the button is `IconButton_<tagKey>`, and without one a key of where it is called. Visible text is never the key.
- `interactionSource: MutableInteractionSource?`: the button's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.
- `style: ButtonStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change.

### PantrixIconButton

`import com.pantrixui.components.elements.iconbutton.PantrixIconButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixIconButton(
    contentDescription: String?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Text,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    shape: Shape = PantrixTheme.shapes.full,
    colors: ButtonColors = variant.colors(),
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    style: ButtonStyle? = null,
    content: @Composable () -> Unit
)
```

`PantrixIconButton` with any `content` in place of an `ImageVector`: an animated icon, or one with a badge.

The content is a picture of what `contentDescription` says, and a screen reader hears the description alone: a badge's count belongs in it, "Inbox, 3 unread", and not in the badge.

Parameters:

- `contentDescription: String?`
- `onClick: () -> Unit`: what a press does.
- `modifier: Modifier`: the button's modifier.
- `variant: ButtonVariant`: the button's colours: `ButtonVariant.Text`, with no container, unless told.
- `size: ButtonSize`: the button's size: as tall, and as wide, as a `size` button is tall.
- `enabled: Boolean`: whether the button can be pressed: one that cannot is drawn in the disabled colours and does nothing.
- `shape: Shape`: the button's corners: fully round unless told.
- `colors: ButtonColors`: this call's own colours, in place of `variant`'s.
- `tagKey: String?`: the button's automation key: the button is `IconButton_<tagKey>`, and without one a key of where it is called. Visible text is never the key.
- `interactionSource: MutableInteractionSource?`: the button's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.
- `style: ButtonStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change.
- `content: @Composable () -> Unit`

### ButtonVariant

`import com.pantrixui.components.elements.button.ButtonVariant`, from `com.pantrixui:components`

```kotlin
enum class ButtonVariant
```

How prominent a button is.

Four of them are a ladder rather than a menu, each one quieter than the one above it: `Solid` is filled in the role's colour, `Soft` in the role's pale container, `Outline` has no fill and an edge, and `Text` has neither. Reading them in that order, which is not the order they are declared in, is how to pick one: go down until the button stops competing with what is around it.

`Subtle` stands on `Soft`'s rung: the same pale fill, with a faint edge in its content colour that keeps the button's shape where the fill alone barely parts from the background.

`Destructive` is not a rung. It says what the button *does*, which is why it is the only variant that changes the colour role, and why it sits at the bottom out of the ladder's reach.

Entries:

- `Solid`: The one primary action on a screen. The default.
- `Outline`: Secondary on a busy surface, where a filled shape would compete.
- `Soft`: Secondary, still clearly a button: a pale fill in the role's container colour.
- `Subtle`: `Soft` with a faint edge, so the shape still shows where the pale fill alone would fade into what is around it.
- `Text`: Tertiary: toolbar actions, "cancel". No surface at all.
- `Destructive`: Destructive and irreversible. Never the only action in a dialog.

### ButtonSize

`import com.pantrixui.components.elements.button.ButtonSize`, from `com.pantrixui:components`

```kotlin
enum class ButtonSize
```

Five heights, stepping by 8dp from 24 to 56.

`Medium` is the default and the one to reach for. The two ends are for the places a default would be wrong rather than for a general sense of scale: `ExtraSmall` inside a dense table row or beside a field, `ExtraLarge` as the single action a phone screen is built around.

Entries:

- `ExtraSmall`: 24dp tall: inside a dense table row, or beside a field.
- `Small`: 32dp tall.
- `Medium`: 40dp tall: the default, and the one to reach for.
- `Large`: 48dp tall.
- `ExtraLarge`: 56dp tall: the single action a phone screen is built around.

### ButtonColors

`import com.pantrixui.components.elements.button.ButtonColors`, from `com.pantrixui:components`

```kotlin
data class ButtonColors(
    public val container: Color,
    public val content: Color,
    public val border: Color = Color.Unspecified
)
```

What a button is painted with. `ButtonVariant.colors` gives a variant's in `primary`, and `PantrixColor.buttonColors` the same prominences in any role.

Parameters:

- `container: Color`: The fill; transparent for an outline or a text button.
- `content: Color`: The label's and the icon's colour.
- `border: Color`: The edge's colour, or `Color.Unspecified` for a button without an edge.

### ButtonVariant.colors

`import com.pantrixui.components.elements.button.colors`, from `com.pantrixui:components`

```kotlin
@Composable
fun ButtonVariant.colors(): ButtonColors
```

The variant's colours, from the theme's `primary` role, and `danger` for `ButtonVariant.Destructive`. The default `colors` of `PantrixButton`; `ButtonColors` of your own override it for one button.

`ButtonVariant.Outline` and `ButtonVariant.Text` have no fill of their own. On a fill that says what is written on it, a top bar of the brand's colour, they are written as it is, their edge too, where the theme's `primary` would hardly be told from the fill. On the theme's own grounds they keep `primary`.

### PantrixColor.buttonColors

`import com.pantrixui.components.elements.button.buttonColors`, from `com.pantrixui:components`

```kotlin
fun PantrixColor.buttonColors(variant: ButtonVariant = ButtonVariant.Solid): ButtonColors
```

The same prominences, drawn from any role instead of from `primary`.

`ButtonVariant.Destructive.colors()` stays the way to say "this deletes something", and it keeps its own meaning: a variant is what the button *is*. This is only what it is *painted with*, for a button that carries a status — "Mark as paid" in `success`, "Retry" in `warning` — so `ButtonVariant.Destructive` here paints exactly like `ButtonVariant.Solid` rather than quietly ignoring the role it was handed.

`ButtonVariant.Subtle` is `ButtonVariant.Soft` with an edge here too, and the edge is all that tells the two apart. It is drawn in the role's own colour at full strength, where the default draws `primary.onContainer` at 30%.

```kotlin
PantrixButton(
    text = stringResource(Res.string.mark_paid),
    onClick = onMarkPaid,
    colors = PantrixTheme.colors.success.buttonColors(),
    tagKey = "mark_paid"
)
```

Parameters:

- `variant: ButtonVariant`: the prominence the colours are for: `ButtonVariant.Solid` unless told.

### ButtonStyle

`import com.pantrixui.components.elements.button.ButtonStyle`, from `com.pantrixui:components`

```kotlin
class ButtonStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val pressedScale: Float = Float.NaN,
    public val extraSmall: ButtonSizeStyle = ButtonSizeStyle(),
    public val small: ButtonSizeStyle = ButtonSizeStyle(),
    public val medium: ButtonSizeStyle = ButtonSizeStyle(),
    public val large: ButtonSizeStyle = ButtonSizeStyle(),
    public val extraLarge: ButtonSizeStyle = ButtonSizeStyle()
) : PantrixStyle<ButtonStyle>
```

`PantrixButton`'s geometry: its shape, its press feedback, and a height, padding and icon size for each `ButtonSize`. `PantrixIconButton` reads the sizes only.

The sizes are the same on every platform; the shape and the press scale are not.

Parameters:

- `shape: ShapeSpec`: The button's shape: `ShapeRole.Full` on Android, desktop and the web, `ShapeRole.Medium` on iOS.
- `pressedScale: Float`: Scale while pressed. `1f` means none: the state layer carries the feedback.
- `extraSmall: ButtonSizeStyle`: `ButtonSize.ExtraSmall`'s geometry.
- `small: ButtonSizeStyle`: `ButtonSize.Small`'s geometry.
- `medium: ButtonSizeStyle`: `ButtonSize.Medium`'s geometry.
- `large: ButtonSizeStyle`: `ButtonSize.Large`'s geometry.
- `extraLarge: ButtonSizeStyle`: `ButtonSize.ExtraLarge`'s geometry.

### ButtonSizeStyle

`import com.pantrixui.components.elements.button.ButtonSizeStyle`, from `com.pantrixui:components`

```kotlin
class ButtonSizeStyle(
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<ButtonSizeStyle>
```

One `ButtonSize`'s height, horizontal padding and icon size.

Parameters:

- `height: Dp`: The button's height.
- `horizontalPadding: Dp`: The space between the button's sides and its content.
- `iconSize: Dp`: The size of an icon button's icon, of the icon of a button in a group, of the cross that closes an alert or a sheet, and of a button's spinner while it loads. An icon put in a button's own slot is as large as it is made.
