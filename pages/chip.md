# Chip

A chip is a compact action, a filter that goes on and off, or an item the user put in and can take out again: a recipient, a tag, an applied filter.

There are two forms of `PantrixChip`. The one that takes `onClick` is an action or only shows a value, and can carry a remove button. The one that takes `selected` and `onSelectedChange` is a filter: it is on or off.

- `PantrixChip` (`com.pantrixui.components.elements.chip`, `com.pantrixui:components`): A compact action, a filter that is on or off, or an item with a remove button, in each platform's own geometry. Keywords: pill, filter chip, input chip, token, removable tag, choice chip.

## Features

- **Action.** A chip given `onClick` is a button, and its name is its label. `leadingIcon` puts an icon before the label.
- **Filter.** A filter that is on is drawn filled and carries a tick in the icon's place: it is not colour alone that says it is on. A screen reader hears a checkbox that is selected or not. The chip does not change by itself: it is whatever `selected` says.
- **Remove button.** `onRemove` puts a cross at the chip's end: it is a target of its own, and a screen reader reads it with the label, "Remove Ayşe Yılmaz". The chip does not take itself out; `onRemove` does.
- **A chip that only shows a value.** A chip given `onClick = null` shows a value, and a filter given `onSelectedChange = null` is read-only: they take no press and no focus, but still tell a screen reader their names.
- **Long label.** A label too long for its room ends in an ellipsis; the icon and the cross stay whole.
- **Disabled.** With `enabled = false` neither the chip nor its cross can be pressed; the chip is drawn in the theme's disabled colours.
- **Colours and style.** `colors` changes only the colours it gives, and `style` only the dimensions it gives.
- **Platform.** On Android it is 32dp tall with medium rounded corners; on iOS it is a pill of 32dp, and on desktop and the web one of 30dp. The platform's touch target is reserved around it.
- **Automation.** A chip given a `tagKey` carries the tag `Chip_<tagKey>`, and its cross `ChipRemove_<tagKey>`. A press is reported as a `Chip` event, and the event never carries the label's text.

## Usage

### A filter

```kotlin
var inStock by rememberSaveable { mutableStateOf(false) }
PantrixChip(
    label = stringResource(Res.string.in_stock),
    selected = inStock,
    onSelectedChange = { inStock = it },
    tagKey = "in_stock"
)
```

### Removable recipients

```kotlin
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    recipients.forEach { recipient ->
        PantrixChip(
            label = recipient.name,
            onClick = null,
            onRemove = { onRemoveRecipient(recipient) },
            tagKey = "recipient_" + recipient.id
        )
    }
}
```

### An action with an icon

```kotlin
PantrixChip(
    label = stringResource(Res.string.add_to_calendar),
    onClick = onAddToCalendar,
    leadingIcon = PantrixIcons.Calendar,
    tagKey = "add_to_calendar"
)
```

### A filter that is on in colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixChip(
    label = stringResource(Res.string.in_stock),
    selected = inStock,
    onSelectedChange = { inStock = it },
    colors = ChipColors(selectedContainer = success.container, selectedContent = success.onContainer),
    tagKey = "in_stock"
)
```

## Examples

### An action chip

The first form: a chip that takes `onClick` is a button that does something when it is pressed, and its name is its label. Its shortest form is the first chip: a label and an `onClick`. In the second, `leadingIcon` stands before the label. The third is disabled with `enabled = false`: it is drawn faded and takes no press.

Press a chip: the line below says which one was pressed last.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var last by rememberSaveable { mutableStateOf<String?>(null) }
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixChip(label = "Share", onClick = { last = "Share" }, tagKey = "share")
    PantrixChip(
        label = "Add to calendar",
        onClick = { last = "Add to calendar" },
        leadingIcon = PantrixIcons.Calendar,
        tagKey = "calendar"
    )
    PantrixChip(label = "Archive", onClick = { last = "Archive" }, enabled = false, tagKey = "archive")
}
PantrixText(
    text = last?.let { "Last action: $it" } ?: "No action pressed yet",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "last_action"
)
```

### A selectable chip: filters

The second form: a chip that takes `selected` and `onSelectedChange` is a filter that goes on and off. The chip changes nothing by itself: `onSelectedChange` reports the value the user asks for, and here the screen's state keeps the keys of the filters that are on.

A filter that is on is drawn filled and carries a tick at its start; it is not colour alone that shows it is on. In the filter that has an icon, "Favourites", the tick takes the icon's place and the chip's width does not change. The filters are in a row that scrolls sideways; the line below says how many are on.

```kotlin
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var on by rememberSaveable { mutableStateOf(listOf("stock")) }
Row(
    modifier = Modifier.horizontalScroll(rememberScrollState()),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    FILTERS.forEach { filter ->
        PantrixChip(
            label = filter.label,
            selected = filter.key in on,
            onSelectedChange = { selected -> on = if (selected) on + filter.key else on - filter.key },
            leadingIcon = filter.icon,
            tagKey = "filter_${filter.key}"
        )
    }
}
PantrixText(
    text = if (on.isEmpty()) "No filters" else "Filters on: ${on.size}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "filters_on"
)

private class ChipFilter(
    val key: String,
    val label: String,
    val icon: ImageVector? = null
)

private val FILTERS = listOf(
    ChipFilter("stock", "In stock"),
    ChipFilter("sale", "On sale"),
    ChipFilter("starred", "Favourites", PantrixIcons.Star),
    ChipFilter("shipping", "Free shipping"),
    ChipFilter("new", "New arrivals"),
    ChipFilter("pickup", "Store pickup")
)
```

### Removable chips: recipients

`onRemove` puts a cross at the chip's end. The cross is a button in its own right: a screen reader says "Remove Ayşe Yılmaz", so the crosses of a row can be told apart. The chip does not take itself out; it is the code here that takes the recipient out of the list.

A press on the chip itself opens the recipient; a press on the cross does not. Recipients that do not fit in the row go on to the next one. "Restore" puts them all back.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var kept by rememberSaveable { mutableStateOf(PEOPLE.map { it.key }) }
var opened by rememberSaveable { mutableStateOf<String?>(null) }
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PEOPLE.filter { it.key in kept }.forEach { person ->
        PantrixChip(
            label = person.name,
            onClick = { opened = person.name },
            leadingIcon = PantrixIcons.Person,
            onRemove = {
                kept = kept - person.key
                if (opened == person.name) opened = null
            },
            tagKey = "recipient_${person.key}"
        )
    }
}
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixText(
        text = opened?.let { "Opened: $it" } ?: "Recipients: ${kept.size}",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "recipients"
    )
    PantrixButton(
        text = "Restore",
        onClick = { kept = PEOPLE.map { it.key } },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        enabled = kept.size < PEOPLE.size,
        tagKey = "restore"
    )
}

private class ChipRecipient(
    val key: String,
    val name: String
)

private val PEOPLE = listOf(
    ChipRecipient("ayse", "Ayşe Yılmaz"),
    ChipRecipient("ibrahim", "İbrahim Öztürk"),
    ChipRecipient("ilker", "İlker Kaya"),
    ChipRecipient("selin", "Selin Çağlar")
)
```

### Chips that only show a value

Two chips that cannot be pressed. "Members only" is a filter and was given `onSelectedChange = null`: it is read-only and takes no press and no focus, but still tells a screen reader its name and that it is on. With `onClick = null`, "Draft" only shows a value: it is one item for a screen reader.

Neither of them is disabled: they are drawn in their own colours, and simply have nothing to press.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixChip(label = "Members only", selected = true, onSelectedChange = null, tagKey = "locked")
    PantrixChip(label = "Draft", onClick = null, tagKey = "draft")
}
```

### A long label and a wide chip

A label too long for its room ends in an ellipsis. The icon and the cross take their room first and the label is given what is left: a long label gets shorter, while its icon and its cross stay whole. The first chip cannot be pressed but can be removed: a chip given `onClick = null` still carries its cross when `onRemove` is given.

The second chip is wider than it needs to be, 220dp: its icon and its label are in the middle, as in a button, and its cross is at the end.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.icons.PantrixIcons

PantrixChip(
    label = "Third-quarter reports as they were sent to the board, with all their attachments",
    onClick = null,
    leadingIcon = PantrixIcons.Folder,
    onRemove = {},
    tagKey = "long"
)
PantrixChip(
    label = "Kotlin",
    onClick = null,
    modifier = Modifier.width(220.dp),
    leadingIcon = PantrixIcons.Star,
    onRemove = {},
    tagKey = "wide"
)
```

### Disabled chips

With `enabled = false` the chip cannot be pressed, and it says so to a screen reader too. A disabled chip is drawn in the theme's disabled colours: a filter that is on takes the disabled fill; a chip without a fill stays without one, and its label fades. Along with the chip, its cross cannot be pressed either.

The last chip was given `colors`, but it was drawn like the others all the same: so that a disabled chip looks the same everywhere in a product, it uses the theme's colours and not its own.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.chip.ChipColors
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixChip(label = "In stock", selected = true, onSelectedChange = {}, enabled = false, tagKey = "disabled_on")
    PantrixChip(label = "On sale", selected = false, onSelectedChange = {}, enabled = false, tagKey = "disabled_off")
    PantrixChip(
        label = "Selin Çağlar",
        onClick = {},
        leadingIcon = PantrixIcons.Person,
        onRemove = {},
        enabled = false,
        tagKey = "disabled_recipient"
    )
    PantrixChip(
        label = "My collection",
        selected = true,
        onSelectedChange = {},
        enabled = false,
        colors = ChipColors(selectedContainer = own.color, selectedContent = own.onColor),
        tagKey = "disabled_own_colors"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Its own colours

Two chips whose colours were given by the caller. The first is a filled action: its fill, its label and its icon were given, and its edge was removed with `Color.Transparent`. The second is a filter, and only the colours it is drawn in while it is on were given: while it is off it is drawn in the theme's. Press the filter to turn it off and see the difference.

`ChipColors` changes only the colours that are given; one that is left out is decided by the theme's role.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.chip.ChipColors
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var inCollection by rememberSaveable { mutableStateOf(true) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixChip(
        label = "New season",
        onClick = {},
        leadingIcon = PantrixIcons.Star,
        colors = ChipColors(
            container = own.container,
            content = own.onContainer,
            icon = own.onContainer,
            border = Color.Transparent
        ),
        tagKey = "new_season"
    )
    PantrixChip(
        label = "My collection",
        selected = inCollection,
        onSelectedChange = { inCollection = it },
        colors = ChipColors(selectedContainer = own.color, selectedContent = own.onColor),
        tagKey = "my_collection"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Shape and style

`style` changes the geometry of this chip alone; the fields that are not given come from the theme's and the platform's style. The first chip has no style and its shape is the platform's: medium rounded on Android, fully rounded on the others. The second's corners are slightly rounded with `ShapeRole.Small`, and the third's are fully rounded with `ShapeRole.Full`. The last is 40dp tall and has 20dp of room at each side of its label.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.chip.ChipStyle
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixChip(label = "No style", onClick = {}, tagKey = "plain")
    PantrixChip(label = "Slightly rounded", onClick = {}, style = ChipStyle(shape = ShapeRole.Small), tagKey = "rounded")
    PantrixChip(label = "Fully rounded", onClick = {}, style = ChipStyle(shape = ShapeRole.Full), tagKey = "pill")
    PantrixChip(
        label = "Tall",
        onClick = {},
        style = ChipStyle(height = 40.dp, horizontalPadding = 20.dp),
        tagKey = "tall"
    )
}
```

## API

### PantrixChip

`import com.pantrixui.components.elements.chip.PantrixChip`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixChip(
    label: String,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    leadingIcon: ImageVector? = null,
    onRemove: (() -> Unit)? = null,
    enabled: Boolean = true,
    style: ChipStyle? = null,
    colors: ChipColors? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A chip: a compact action, or an item the user put in and can take out again, such as a recipient, a tag or an applied filter.

It is as tall as its style says and as wide as its icon, its label and its remove button need, with the platform's touch target reserved around it. A label too long for the room the chip is given ends in an ellipsis, and the remove button stays whole beside it. A label set larger than the chip, at a large font scale, makes the chip taller. In a chip made wider than it needs, the icon and the label are in the middle, as a button's are, and the remove button is at the end.

With `onClick` the chip is a button, named by its label. Without, it only shows a value: one item for a screen reader, which takes no press and no focus, and keeps its remove button when `onRemove` is given.

`onRemove` puts a remove button at the chip's end: a target of its own, as tall as the chip, that a screen reader hears with the label, "Remove Kotlin", so that the buttons of a row can be told apart. The chip does not take itself out: the callback does.

Parameters:

- `label: String`: the chip's text, and its name for a screen reader.
- `onClick: (() -> Unit)?`: called when the chip is pressed. Null makes a chip that only shows a value.
- `modifier: Modifier`: the chip's modifier, outside the touch target it reserves.
- `leadingIcon: ImageVector?`: an icon before the label, in the style's icon size.
- `onRemove: (() -> Unit)?`: called when the remove button is pressed. Null leaves the button out.
- `enabled: Boolean`: whether the chip and its remove button can be pressed. A chip that cannot is drawn in the disabled colours and says so.
- `style: ChipStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: ChipColors?`: this chip's own colours: the ones it sets, with the theme's for the rest. A disabled chip keeps the theme's.
- `tagKey: String?`: the chip's automation key: the chip is `Chip_<tagKey>` and its remove button `ChipRemove_<tagKey>`. A press is reported as a `Chip` event, `click` or `remove`, which never carries the label.
- `interactionSource: MutableInteractionSource?`: the chip's interactions, hoisted. It keeps a source of its own when this is null, and the remove button always has its own.

### PantrixChip

`import com.pantrixui.components.elements.chip.PantrixChip`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixChip(
    label: String,
    selected: Boolean,
    onSelectedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    leadingIcon: ImageVector? = null,
    enabled: Boolean = true,
    style: ChipStyle? = null,
    colors: ChipColors? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A filter: a chip that is on or off.

Selected, it is filled in the primary role's container and shows a tick in place of `leadingIcon`. The tick, and not the fill alone, says it is on, for whoever cannot tell the two colours apart. A screen reader hears a checkbox that is selected or not. A change is felt, as a switch's is.

Without `onSelectedChange` the filter is read-only: it takes no press and no focus, and still says its name and whether it is on.

Parameters:

- `label: String`: the chip's text, and its name for a screen reader.
- `selected: Boolean`: whether the filter is on.
- `onSelectedChange: ((Boolean) -> Unit)?`: called with the value the user asks for, the opposite of `selected`. The chip changes nothing by itself: it is on when `selected` says so. Null makes it read-only.
- `modifier: Modifier`: the chip's modifier, outside the touch target it reserves.
- `leadingIcon: ImageVector?`: an icon before the label, in the style's icon size. A selected chip shows a tick in its place.
- `enabled: Boolean`: whether the chip can be pressed. A chip that cannot is drawn in the disabled colours and says so.
- `style: ChipStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: ChipColors?`: this chip's own colours: the ones it sets, with the theme's for the rest. A disabled chip keeps the theme's.
- `tagKey: String?`: the chip's automation key: the chip is `Chip_<tagKey>`. A change is reported as a `Chip` event, `toggle`, which carries the value asked for and never the label.
- `interactionSource: MutableInteractionSource?`: the chip's interactions, hoisted. It keeps a source of its own when this is null.

### ChipStyle

`import com.pantrixui.components.elements.chip.ChipStyle`, from `com.pantrixui:components`

```kotlin
class ChipStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified
) : PantrixStyle<ChipStyle>
```

`PantrixChip`'s geometry.

An icon stands nearer the chip's edge than text does: on a side that has one, `iconPadding` is the room to the edge in place of `horizontalPadding`. It is Material 3's rule, kept on every platform.

On Android the numbers are Material 3's: 32dp tall with corners of 8dp, the medium step of the shape scale. iOS has no chip of its own; it takes the height of a small button, so the two line up in a row, and the pill a Pantrix control has. Desktop and the web are a step tighter, for a pointer.

An icon goes by the buttons': a small button's 20dp on Android and on iOS, where the chip is as tall as one, and 18dp in the chip of 30dp that the desktop and the web have. On every platform that is the largest the chip has room for: the remove button's focus ring goes around the cross, inside the chip, and in high contrast it reaches 6dp past it.

The height and the two paddings follow the density, since they are the room around the label. The icon's size, the edge's width and the shape do not.

Parameters:

- `shape: ShapeSpec`: The chip's shape: a step of the brand's shape scale, or a fixed shape.
- `height: Dp`: The chip's height. A label set larger than it has room for, at a large font scale, makes the chip taller.
- `horizontalPadding: Dp`: The room between the label and the chip's edge, on a side that has no icon.
- `iconPadding: Dp`: The room between an icon and the chip's edge, and between an icon and the label.
- `iconSize: Dp`: The width and height of the leading icon, of a selected chip's tick and of the remove button's cross.
- `borderWidth: Dp`: The width of the edge of a chip that is not selected. The edge is drawn inside the chip, which is as large with it as without.

### ChipColors

`import com.pantrixui.components.elements.chip.ChipColors`, from `com.pantrixui:components`

```kotlin
data class ChipColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified
)
```

What `PantrixChip` is painted with, for a chip that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role. A product gives the colours it changes and no others:

```kotlin
PantrixChip(
    label = stringResource(Res.string.in_stock),
    selected = inStock,
    onSelectedChange = { inStock = it },
    colors = ChipColors(selectedContainer = brand, selectedContent = onBrand)
)
```

They are the colours of a chip that can be pressed. A disabled one is drawn in the theme's disabled roles whatever is given here, so that a disabled chip looks the same across a product.

A fill given here that is one of the theme's own colours brings the colour the theme pairs with it for what is drawn on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The chip's fill while it is not selected. None by default: the chip is its edge and its label.
- `content: Color`: The label while the chip is not selected. The theme's `textPrimary`.
- `icon: Color`: The icon before the label and the cross of the remove button, while the chip is not selected. The theme's `textSecondary`.
- `border: Color`: The chip's edge while it is not selected. The theme's `border`.
- `selectedContainer: Color`: The fill of a filter that is on. The primary role's `container`.
- `selectedContent: Color`: The label and the tick of a filter that is on: the colour that reads on `selectedContainer`. The primary role's `onContainer`.
