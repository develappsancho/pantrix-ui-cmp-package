# Button Group

A few actions of the same rank, drawn as one control or side by side with the same gap between them: a toolbar, a stepper, the two buttons under a dialog.

The group chooses nothing and none of its buttons stays selected. Where one of several options stays selected, use a segment button: it says which one is selected.

- `PantrixButtonGroup` (`com.pantrixui.components.elements.buttongroup`, `com.pantrixui:components`): A few actions of the same rank as one control: attached, with one shape and one edge, or set apart, in a row or a column. Keywords: toolbar, button bar, split button, stepper, attached buttons, action group.

## Features

- **Attached or apart.** With `attached` on, which is its default, the buttons touch: the group has one shape, one edge around it and a line between each two buttons. With it off, the same buttons stand with a gap between them, each with its own shape and edge.
- **Row or column.** `orientation` lays the buttons out side by side or one under another. In a column they are all as wide as the widest.
- **Width.** In a row each button is as wide as what it says. In a narrow space the short ones stay whole and the long ones share what is left; with `equalWidth` they all share the group's width equally.
- **A label or an icon alone.** `GroupButton` has two constructors: a label, with or without an icon before it; or an icon alone. For a button that is an icon alone, `contentDescription` is required.
- **Each button is a button.** Tab stops at each of them, a screen reader says the name and the role of each, and each draws its own focus ring and reports its own press.
- **A button's own state.** `enabled`, `loading`, `variant` and `colors` can be given to each `GroupButton` separately. The group's `variant`, `size`, `colors` and `enabled` are for all the buttons.
- **Touch target.** An attached group reserves the platform's touch target once, around itself; each of its buttons is at least that long along the group.
- **Automation.** The buttons are named inside the group's tag: `ButtonGroup_clipboard.Button_copy`. A button that is an icon alone is tagged as an `IconButton`, and a button without a key by its index.

## Usage

### Attached actions in a toolbar

```kotlin
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = stringResource(Res.string.copy), onClick = onCopy, tagKey = "copy"),
        GroupButton(text = stringResource(Res.string.paste), onClick = onPaste, tagKey = "paste"),
        GroupButton(
            icon = PantrixIcons.MoreHorizontal,
            contentDescription = stringResource(Res.string.more),
            onClick = onMore,
            tagKey = "more"
        )
    ),
    tagKey = "clipboard"
)
```

### The actions under a dialog, sharing its width

```kotlin
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = stringResource(Res.string.cancel), onClick = onDismiss, tagKey = "cancel"),
        GroupButton(
            text = stringResource(Res.string.delete),
            onClick = onDelete,
            loading = deleting,
            variant = ButtonVariant.Destructive,
            tagKey = "delete"
        )
    ),
    attached = false,
    equalWidth = true,
    tagKey = "footer"
)
```

### A column of actions, in a role's colours

```kotlin
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = stringResource(Res.string.approve), onClick = onApprove, tagKey = "approve"),
        GroupButton(text = stringResource(Res.string.approve_all), onClick = onApproveAll, tagKey = "approve_all")
    ),
    orientation = Orientation.Vertical,
    colors = PantrixTheme.colors.success.buttonColors(ButtonVariant.Outline),
    tagKey = "review"
)
```

## Examples

### An attached toolbar

Its shortest form: a list of buttons. The group is attached and its variant is `Outline`: there is one edge around it and a line between each two buttons, and the corners are only at the group's two ends.

The first button has an icon before its label; the last is an icon alone and says what it does with `contentDescription`. Each button is a button in its own right: Tab stops at each of them, and a screen reader says the name of each. Press a button: the line below names the last action.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var last by rememberSaveable { mutableStateOf<String?>(null) }
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Copy", onClick = { last = "Copy" }, icon = PantrixIcons.Copy, tagKey = "copy"),
        GroupButton(text = "Paste", onClick = { last = "Paste" }, tagKey = "paste"),
        GroupButton(
            icon = PantrixIcons.MoreHorizontal,
            contentDescription = "More actions",
            onClick = { last = "More actions" },
            tagKey = "more"
        )
    ),
    tagKey = "clipboard"
)
PantrixText(
    text = last?.let { "Last action: $it" } ?: "No action pressed yet",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "clipboard_result"
)
```

### A stepper of icons alone

A stepper made of icons alone, in the `Soft` variant. A button that is an icon alone is written with the second constructor of `GroupButton`, and there `contentDescription` is required: a button is never decoration.

`enabled` is given to each button separately: at the lower limit the minus button cannot be pressed, and the plus button can.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var count by rememberSaveable { mutableIntStateOf(1) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(
                icon = PantrixIcons.Minus,
                contentDescription = "Decrease",
                onClick = { count-- },
                enabled = count > 1,
                tagKey = "minus"
            ),
            GroupButton(
                icon = PantrixIcons.Plus,
                contentDescription = "Increase",
                onClick = { count++ },
                tagKey = "plus"
            )
        ),
        variant = ButtonVariant.Soft,
        tagKey = "stepper"
    )
    PantrixText(text = "Quantity: $count", tagKey = "stepper_count")
}
```

### Labels read by their description

Two buttons that change the text size. Their labels are "A-" and "A+": enough for someone who sees them, but they mean nothing in a screen reader. So each has a `contentDescription`, and the screen reader reads the description alone, not the label: "Make text smaller", "Make text larger".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var percent by rememberSaveable { mutableIntStateOf(100) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(
                text = "A-",
                onClick = { percent -= 10 },
                enabled = percent > 80,
                contentDescription = "Make text smaller",
                tagKey = "smaller"
            ),
            GroupButton(
                text = "A+",
                onClick = { percent += 10 },
                enabled = percent < 150,
                contentDescription = "Make text larger",
                tagKey = "larger"
            )
        ),
        tagKey = "text_size"
    )
    PantrixText(text = "Text size: $percent%", tagKey = "text_size_percent")
}
```

### Variants

`variant` is the variant of every button that has none of its own; when it is not given, it is `Outline`. In the variants that have an edge, `Outline` and `Subtle`, there is one edge around the group and the lines between the buttons are in its colour. In those without an edge, only the lines between the buttons are drawn.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

listOf(
    ButtonVariant.Outline,
    ButtonVariant.Subtle,
    ButtonVariant.Soft,
    ButtonVariant.Solid,
    ButtonVariant.Text
).forEach { variant ->
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(text = "Previous", onClick = {}, tagKey = "previous"),
            GroupButton(text = "Next", onClick = {}, tagKey = "next")
        ),
        variant = variant,
        tagKey = "variant_${variant.name}"
    )
}
```

### Sizes

`size` is the size of every button in the group, so that they all line up: here `Small`, `Medium` and `Large`. When it is not given, it is `Medium`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

listOf(ButtonSize.Small, ButtonSize.Medium, ButtonSize.Large).forEach { size ->
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(text = "Cut", onClick = {}, tagKey = "cut"),
            GroupButton(text = "Copy", onClick = {}, tagKey = "copy"),
            GroupButton(text = "Paste", onClick = {}, tagKey = "paste")
        ),
        size = size,
        tagKey = "size_${size.name}"
    )
}
```

### A column of actions

`orientation = Orientation.Vertical` lays the buttons out one under another: they are all as wide as the widest. In an attached column the corners are at the top and the bottom of the group, and the lines between the buttons are horizontal.

The action that deletes carries its own variant: on that button the `variant` of `GroupButton` takes the place of the group's.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Rename", onClick = {}, tagKey = "rename"),
        GroupButton(text = "Duplicate", onClick = {}, tagKey = "duplicate"),
        GroupButton(text = "Delete", onClick = {}, variant = ButtonVariant.Destructive, tagKey = "delete")
    ),
    orientation = Orientation.Vertical,
    tagKey = "record"
)
```

### Apart and of equal width

The two actions under a dialog. With `attached = false` they stand apart, each with its own shape and edge, with the style's gap between them. With `equalWidth = true` they share the group's width equally; here the group is 360dp wide at most.

`loading` is the button's own state: when "Delete" is pressed it shows as loading for a short while and cannot be pressed in the meantime. "Cancel" stops the loading.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import kotlinx.coroutines.delay

var deleting by remember { mutableStateOf(false) }
LaunchedEffect(deleting) {
    if (deleting) {
        delay(1500)
        deleting = false
    }
}
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Cancel", onClick = { deleting = false }, tagKey = "cancel"),
        GroupButton(
            text = "Delete",
            onClick = { deleting = true },
            loading = deleting,
            variant = ButtonVariant.Destructive,
            tagKey = "delete"
        )
    ),
    modifier = Modifier.widthIn(max = 360.dp),
    attached = false,
    equalWidth = true,
    tagKey = "footer"
)
```

### In a narrow space

The same three buttons, twice, in a space 280dp wide. In a row each button is as wide as what it says; where there is not enough room the short ones stay whole and the long one takes what is left, its label cut off with an ellipsis.

The second group has `equalWidth = true`: the three buttons share the width equally, and the long label is cut off sooner.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Save", onClick = {}, tagKey = "save"),
        GroupButton(text = "Exit without saving and delete the draft", onClick = {}, tagKey = "discard"),
        GroupButton(text = "Cancel", onClick = {}, tagKey = "cancel")
    ),
    modifier = Modifier.width(280.dp),
    tagKey = "narrow"
)
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Save", onClick = {}, tagKey = "save"),
        GroupButton(text = "Exit without saving and delete the draft", onClick = {}, tagKey = "discard"),
        GroupButton(text = "Cancel", onClick = {}, tagKey = "cancel")
    ),
    modifier = Modifier.width(280.dp),
    equalWidth = true,
    tagKey = "narrow_equal"
)
```

### In a role's colours

`colors` draws the group's buttons in the given colours instead of a variant's `primary` colours. Here `PantrixColor.buttonColors(ButtonVariant.Outline)` gives the outlined button colours of the `success` role. In an attached group the colour given for the edge is the colour of the group's one edge and of the lines between the buttons.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Approve", onClick = {}, icon = PantrixIcons.Check, tagKey = "approve"),
        GroupButton(text = "Approve all", onClick = {}, tagKey = "approve_all")
    ),
    colors = PantrixTheme.colors.success.buttonColors(ButtonVariant.Outline),
    tagKey = "review"
)
```

### In its own colour

The first group's colour is in none of the theme's roles: `ButtonColors` takes the fill, the content's colour and the edge directly.

In the second group only one button has a colour of its own. On that button the `colors` of `GroupButton` take the place of the group's colours and of its own variant; the button still stands inside the group's edge.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.foundation.icons.PantrixIcons

val own = ownColors()
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Add to collection", onClick = {}, icon = PantrixIcons.Star, tagKey = "collect"),
        GroupButton(text = "Share", onClick = {}, tagKey = "share")
    ),
    colors = ButtonColors(container = own.container, content = own.onContainer, border = own.color),
    tagKey = "own_colors"
)
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Edit", onClick = {}, tagKey = "edit"),
        GroupButton(
            text = "Feature",
            onClick = {},
            colors = ButtonColors(container = own.color, content = own.onColor),
            tagKey = "feature"
        )
    ),
    tagKey = "one_own_button"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Shape and style

In an attached group `shape` is the shape of the whole group: each button carries only the corners at its own end. In a group whose buttons stand apart it is the shape of each button. The first group was drawn in the theme's slightly rounded shape (`shapes.sm`).

`style` changes the group's geometry: in the second group `ButtonGroupStyle(gap = 16.dp)` widens the gap between the buttons that stand apart. The buttons' sizes come from the button's own style, not from the group's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.buttongroup.ButtonGroupStyle
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.foundation.theme.PantrixTheme

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Print", onClick = {}, tagKey = "print"),
        GroupButton(text = "Export", onClick = {}, tagKey = "export"),
        GroupButton(text = "Share", onClick = {}, tagKey = "share")
    ),
    shape = PantrixTheme.shapes.sm,
    tagKey = "less_round"
)
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Back", onClick = {}, tagKey = "back"),
        GroupButton(text = "Next", onClick = {}, tagKey = "forward")
    ),
    attached = false,
    style = ButtonGroupStyle(gap = 16.dp),
    tagKey = "wide_gap"
)
```

### A disabled group

The group's `enabled = false` disables every button: none of them takes a press, and their labels and the group's edge are drawn faded.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Undo", onClick = {}, tagKey = "undo"),
        GroupButton(text = "Redo", onClick = {}, tagKey = "redo")
    ),
    enabled = false,
    tagKey = "locked"
)
```

## API

### PantrixButtonGroup

`import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixButtonGroup(
    buttons: List<GroupButton>,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Outline,
    size: ButtonSize = ButtonSize.Medium,
    orientation: Orientation = Orientation.Horizontal,
    attached: Boolean = true,
    equalWidth: Boolean = false,
    enabled: Boolean = true,
    style: ButtonGroupStyle? = null,
    shape: Shape = PantrixTheme.style(ButtonGroupStyle, style).shape.toShape(),
    colors: ButtonColors = variant.colors(),
    tagKey: String? = null
)
```

A group of buttons: a few actions of the same rank, drawn as one control or set apart at one distance.

Attached, which it is unless told otherwise, the buttons touch: the group has one shape, of which each button keeps the corners at its own end, one edge around it where its colours have one, and a line between each two buttons. Apart, they are the same buttons a gap from each other, each with its own shape and edge, as the actions under a dialog are.

Each button is a button like any other: it is one stop for Tab, says its own name and role to a screen reader, shows its own focus ring, and reports its own press, as a `Button` or an `IconButton` event. The group reports nothing and chooses nothing: no button stays selected. For a choice of one among several, where one stays chosen, use a segment button, which says which one is.

In a row the buttons are as wide as what they say. In a room too narrow for that the short ones stay whole and the long ones share what is left; with `equalWidth` they all share the width the group is given. In a column they are all as wide as the widest of them.

An attached group keeps the platform's touch target around itself, and each of its buttons is at least as long as that along the group: beside its neighbours, a button has no room of its own to be reached in.

Parameters:

- `buttons: List<GroupButton>`: the buttons, in order. An empty list draws nothing.
- `modifier: Modifier`: the group's modifier, outside the touch target an attached group reserves.
- `variant: ButtonVariant`: the variant of every button that has none of its own.
- `size: ButtonSize`: the size of every button, so that they line up.
- `orientation: Orientation`: `Orientation.Horizontal` for a row, `Orientation.Vertical` for a column of actions.
- `attached: Boolean`: true draws the buttons as one control. False sets them the style's gap apart.
- `equalWidth: Boolean`: true gives every button of a row the same share of the width the group is given; in a room without an end, the width of the widest. A column's buttons are as wide as each other whatever this says.
- `enabled: Boolean`: false disables every button.
- `style: ButtonGroupStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform. The buttons keep the button's own style for their sizes.
- `shape: Shape`: the group's shape: attached, the shape of the whole group; apart, of each button.
- `colors: ButtonColors`: what the buttons are painted with, each one that has neither colours nor a variant of its own. Attached, the border's colour is the group's one edge, and the colour of the lines between the buttons.
- `tagKey: String?`: the group's automation key: the group is `ButtonGroup_<tagKey>`, and its buttons are named inside it, `ButtonGroup_<tagKey>.Button_<key>`, so that two groups with the same actions are told apart.

### GroupButton

`import com.pantrixui.components.elements.buttongroup.GroupButton`, from `com.pantrixui:components`

```kotlin
class GroupButton
```

One button of `PantrixButtonGroup`: what it says, what it does, and a key for automation.

It is a label, with or without an icon before it, or it is an icon alone, which then has to be told what it does: each has its own constructor.

Another constructor:

```kotlin
constructor(
    text: String,
    onClick: () -> Unit,
    icon: ImageVector? = null,
    enabled: Boolean = true,
    loading: Boolean = false,
    variant: ButtonVariant? = null,
    colors: ButtonColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null
)
```

Its parameters:

- `text: String`
- `onClick: () -> Unit`
- `icon: ImageVector?`
- `enabled: Boolean`
- `loading: Boolean`
- `variant: ButtonVariant?`
- `colors: ButtonColors?`
- `contentDescription: String?`
- `tagKey: String?`

Another constructor:

```kotlin
constructor(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    enabled: Boolean = true,
    variant: ButtonVariant? = null,
    colors: ButtonColors? = null,
    tagKey: String? = null
)
```

A button that is an icon alone. `contentDescription` says what it does: a button is never decoration.

Its parameters:

- `icon: ImageVector`: the icon the button is.
- `contentDescription: String`
- `onClick: () -> Unit`: called when the button is pressed.
- `enabled: Boolean`: whether the button can be pressed.
- `variant: ButtonVariant?`: the button's own variant, in place of the group's: the one action of a group that deletes.
- `colors: ButtonColors?`: the button's own colours, in place of the group's and of its own variant's.
- `tagKey: String?`: the button's automation key, the same in every language: the button is `Button_<tagKey>` or `IconButton_<tagKey>`, or `Button_<index>` and `IconButton_<index>` without one, inside the tag of a group that has a key: `ButtonGroup_clipboard.Button_copy`.

Members:

- `text: String?`: The label, or null for a button that is an icon alone.
- `icon: ImageVector?`: Before the label, in the label's colour, or the whole of a button without a label. Null for none.
- `contentDescription: String?`: What a screen reader says for the button: the name of an icon alone, "More" and not what the icon looks like, and for a button with a label, what is read in place of the label where the label does not say what the button does, as a "+" does not. Null for a button named by its label.
- `onClick: () -> Unit`: Called when the button is pressed.
- `enabled: Boolean`: Whether the button can be pressed.
- `loading: Boolean`: Whether the button shows a spinner in place of its icon and takes no press, while what it began is under way. A button that is an icon alone has none.
- `variant: ButtonVariant?`: The button's own variant, in place of the group's: the one action of a group that deletes.
- `colors: ButtonColors?`: The button's own colours, in place of the group's and of its own variant's.
- `tagKey: String?`: The button's automation key, the same in every language: the button is `Button_<tagKey>` or `IconButton_<tagKey>`, or `Button_<index>` and `IconButton_<index>` without one, inside the tag of a group that has a key: `ButtonGroup_clipboard.Button_copy`.

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

### ButtonGroupStyle

`import com.pantrixui.components.elements.buttongroup.ButtonGroupStyle`, from `com.pantrixui:components`

```kotlin
class ButtonGroupStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val dividerWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<ButtonGroupStyle>
```

`PantrixButtonGroup`'s geometry: the shape of the group, the line between two buttons that are attached, and the room between two that are not.

The shape is the button's own on every platform, so that a group and a button beside it have the same corners: a pill on Android, on desktop and on the web, a rounded rectangle on iOS. Attached, it is the shape of the whole group, and each button keeps the corners at its own end of it. Apart, every button has it whole.

Only the gap follows the density, since it is the room between the buttons. The line and the shape do not.

Parameters:

- `shape: ShapeSpec`: The group's shape: a step of the brand's shape scale, or a fixed shape.
- `dividerWidth: Dp`: The width of the line between two attached buttons.
- `gap: Dp`: The room between two buttons that are not attached.

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
