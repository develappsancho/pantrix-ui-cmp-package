# Checkbox

A box that is checked or not, and the label beside it. It is for options that are independent of each other: subscribing to a newsletter, accepting a condition, selecting a few rows of a list. `PantrixTriStateCheckbox` shows a third state too: the "select all" box, which is neither checked nor unchecked while some of the rows under it are selected.

The box changes nothing by itself: it is whatever `checked` says. A press reports the value that is asked for with `onCheckedChange`; the caller keeps the state.

- `PantrixCheckbox` (`com.pantrixui.components.elements.checkbox`, `com.pantrixui:components`): A two-state checkbox with a label, supporting text and an error state, controlled or bound to a form's field. Keywords: tick, agree, opt in, consent, boolean, terms.
- `PantrixTriStateCheckbox` (`com.pantrixui.components.elements.checkbox`, `com.pantrixui:components`): A checkbox that can also be indeterminate, for a select-all over rows that are partly selected. Keywords: indeterminate, select all, partial selection, mixed state, tri-state.

## Features

- **One target.** The box, the label and the supporting text are one target: a press on the text changes the box too. However small the box is, the row takes as much room as the platform's touch target.
- **Label and supporting text.** `label` stands beside the box, and `supportingText` under it in smaller text. The box is on the label's first line, however many lines the text runs to.
- **Three states.** `PantrixTriStateCheckbox` takes a `ToggleableState`: checked, unchecked or indeterminate. An indeterminate box draws a dash, and is read to a screen reader as indeterminate, not as unchecked. What a press leads to is the caller's to say.
- **Error.** `error` turns the box and the supporting text to the theme's `danger` role; a screen reader is told the input is invalid.
- **Form.** The `PantrixCheckbox` that takes a `field` gets its value, its error and its name from the form's field. The rule's message shows after the first change or on an attempt to submit the form, and takes the place of the supporting text.
- **Read-only and disabled.** If `onCheckedChange` is null the box is read-only: it takes no press and no focus, and still says its name and its state. `enabled = false` draws the box in the disabled colours.
- **Colours of its own.** `CheckboxColors` takes the fill, the tick and the edge separately; one that is left out stays in the theme's role. A disabled box and a box in error are drawn in the theme's colours even when colours are given.
- **Style.** `CheckboxStyle` changes the box's size, its corners and the thickness of its lines. The box is 18dp, and 22dp on iOS; its corners are the small step of the shape scale.
- **The box at the end.** `controlPosition = ControlPosition.End` puts the box at the end of the label: given a width, the row has the box at its end.
- **Screen reader.** One checkbox is read: its name is its label, and its state is said in the theme's language. A box without a label gets its name from `contentDescription`.
- **Motion.** The tick is drawn on and off, and the fill fades in and out with it. Where the theme's motion is reduced, both happen at once.

## Usage

### Controlled

```kotlin
var subscribed by rememberSaveable { mutableStateOf(false) }
PantrixCheckbox(
    checked = subscribed,
    onCheckedChange = { subscribed = it },
    label = stringResource(Res.string.subscribe),
    supportingText = stringResource(Res.string.once_a_week),
    tagKey = "subscribe"
)
```

### Consent, bound to a form's field

```kotlin
val form = rememberFormState()
val terms = form.field("terms", initial = false, Rules.mustBeTrue(stringResource(Res.string.terms_required)))
PantrixCheckbox(field = terms, label = stringResource(Res.string.accept_terms))
```

### Without a label, in a table's row

```kotlin
PantrixCheckbox(
    checked = order.id in selected,
    onCheckedChange = { onSelect(order.id, it) },
    contentDescription = stringResource(Res.string.select_order, order.number),
    tagKey = "order_" + order.id
)
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixCheckbox(
    checked = organic,
    onCheckedChange = { organic = it },
    label = stringResource(Res.string.organic_only),
    colors = CheckboxColors(checked = success.color, checkmark = success.onColor),
    tagKey = "organic_only"
)
```

### Select all

```kotlin
val state = when (selected.size) {
    0 -> ToggleableState.Off
    rows.size -> ToggleableState.On
    else -> ToggleableState.Indeterminate
}
PantrixTriStateCheckbox(
    state = state,
    onClick = { selected = if (state == ToggleableState.On) emptySet() else rows.toSet() },
    label = stringResource(Res.string.select_all),
    tagKey = "select_all"
)
```

### A summary that cannot be pressed

```kotlin
PantrixTriStateCheckbox(state = ToggleableState.Indeterminate, onClick = null, label = summary)
```

## Examples

### Label and supporting text

Its plainest form: `checked` reads the state, and `onCheckedChange` reports the value that is asked for. `label` stands beside the box and `supportingText` under it, and the three are one target. Press the text: the box still changes.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

var newsletter by rememberSaveable { mutableStateOf(true) }
PantrixCheckbox(
    checked = newsletter,
    onCheckedChange = { newsletter = it },
    label = "Weekly newsletter",
    supportingText = "One email a week; you can unsubscribe at any time",
    tagKey = "newsletter"
)
```

### Three states: select all

`PantrixTriStateCheckbox` draws a third state. While some of the boxes under it are selected, "All notifications" is neither checked nor unchecked: it shows a dash, and that is how a screen reader reads it.

The caller works out the state, not the box: `On` if all are selected, `Off` if none is selected, `Indeterminate` in between. `onClick` only reports that it was pressed; here it selects them all, and when all are selected it clears them all.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.state.ToggleableState
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.checkbox.PantrixTriStateCheckbox
import com.pantrixui.foundation.theme.PantrixTheme

val notifications = listOf("Shipping status", "Promotions", "Account security")
var chosen by remember { mutableStateOf(setOf(notifications.first())) }
val all = when (chosen.size) {
    0 -> ToggleableState.Off
    notifications.size -> ToggleableState.On
    else -> ToggleableState.Indeterminate
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixTriStateCheckbox(
        state = all,
        onClick = { chosen = if (all == ToggleableState.On) emptySet() else notifications.toSet() },
        label = "All notifications",
        tagKey = "all_notifications"
    )
    Column(modifier = Modifier.padding(start = PantrixTheme.spacing.xl)) {
        notifications.forEachIndexed { index, name ->
            PantrixCheckbox(
                checked = name in chosen,
                onCheckedChange = { on -> chosen = if (on) chosen + name else chosen - name },
                label = name,
                tagKey = "notification_$index"
            )
        }
    }
}
```

### Error

`error` turns the box and the supporting text to the theme's `danger` role, and a screen reader is told the input is invalid. While the error lasts, the supporting text is the message itself: it says what to put right.

Here the example works out the error itself: `error` is true while the box is unchecked. Check the box: the colour and the text go back to what they were.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

var read by rememberSaveable { mutableStateOf(false) }
PantrixCheckbox(
    checked = read,
    onCheckedChange = { read = it },
    label = "I have read the privacy notice",
    supportingText = if (read) "Thank you" else "Check this box to continue",
    error = !read,
    tagKey = "privacy"
)
```

### Consent bound to a form

The `PantrixCheckbox` that takes a `field` is bound to a field of a form: it gets its value, its error and its name from the field; `checked` and `onCheckedChange` are not given. The field's id is the automation key: this box is `Checkbox_terms`.

Press "Send" without checking the box: the message of the `Rules.mustBeTrue` rule takes the place of the supporting text, and the focus goes to the box. When the box is checked the message goes away; when the form is submitted, the app's snackbar lets you know.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixCheckbox(
    field = form.field("terms", initial = false, Rules.mustBeTrue("Accept the terms to continue")),
    label = "I accept the terms of use",
    supportingText = "You can read them before sending"
)
PantrixButton(
    text = "Send",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Form sent", tagKey = "form_sent") } }
    },
    form = form,
    tagKey = "send"
)
```

### Disabled and read-only

`enabled = false` draws the box in the disabled colours: the box takes no press, and a screen reader is told it is disabled.

With `onCheckedChange = null` the box is read-only: it takes no press and no focus, its colours do not change, and it still says its name and its state. It is only for showing what was selected.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

PantrixCheckbox(checked = true, onCheckedChange = {}, enabled = false, label = "Disabled", tagKey = "off")
PantrixCheckbox(
    checked = true,
    onCheckedChange = null,
    label = "Read-only",
    supportingText = "Cannot be pressed; it only shows its state",
    tagKey = "read_only"
)
```

### Without a label: in a row of a list

A box without a label: in a row of a table or a list, the text is already in the row. `contentDescription` tells a screen reader the box's name: "Select order 1042".

The text in the row is no part of the box: what is pressed is the box and the touch target reserved around it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var selected by rememberSaveable { mutableStateOf(setOf("1042")) }
Column(modifier = Modifier.widthIn(max = 360.dp)) {
    listOf("1042", "1043", "1044").forEach { number ->
        Row(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixCheckbox(
                checked = number in selected,
                onCheckedChange = { on -> selected = if (on) selected + number else selected - number },
                contentDescription = "Select order $number",
                tagKey = "order_$number"
            )
            PantrixText(text = "Order $number", modifier = Modifier.weight(1f))
            PantrixText(text = "Preparing", color = PantrixTheme.colors.textSecondary)
        }
    }
}
PantrixText(text = "Orders selected: ${selected.size}", color = PantrixTheme.colors.textSecondary)
```

### Its own colours

`colors` changes only the fields that are given: the fill of the "Gift wrap" box is in the app's own purple, and its tick in the colour that reads on that purple; its edge stays in the theme's colour. Uncheck the box: its edge is the same as the other boxes'.

These are the colours of a box that can be pressed and is not in error. The second box was given the same colours too, but it is disabled: it is drawn in the theme's disabled colours. A box in error stays in the theme's `danger` role as well.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.CheckboxColors
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

val own = ownColors()
var giftWrap by rememberSaveable { mutableStateOf(true) }
PantrixCheckbox(
    checked = giftWrap,
    onCheckedChange = { giftWrap = it },
    label = "Gift wrap",
    supportingText = "The box's fill and tick were given by the caller",
    colors = CheckboxColors(checked = own.color, checkmark = own.onColor),
    tagKey = "gift_wrap"
)
PantrixCheckbox(
    checked = true,
    onCheckedChange = {},
    enabled = false,
    label = "Gift note",
    supportingText = "The same colours were given; a disabled box stays in the theme's colour",
    colors = CheckboxColors(checked = own.color, checkmark = own.onColor),
    tagKey = "gift_note"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Style

`style` changes the geometry of one box: `size` is the box's size, `shape` its corners, and `strokeWidth` the thickness of the lines of the edge and the tick. Only the fields that are given change; the rest comes from the theme's and the platform's style.

The first box is 24dp and its line is 3dp; the second has square corners. The box's colour is no part of the style: it comes from the state and from `colors`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.CheckboxStyle
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.foundation.token.shape.ShapeSpec

var large by rememberSaveable { mutableStateOf(true) }
var square by rememberSaveable { mutableStateOf(true) }
PantrixCheckbox(
    checked = large,
    onCheckedChange = { large = it },
    label = "Large box, thick line",
    style = CheckboxStyle(size = 24.dp, strokeWidth = 3.dp),
    tagKey = "large"
)
PantrixCheckbox(
    checked = square,
    onCheckedChange = { square = it },
    label = "Square box",
    style = CheckboxStyle(shape = ShapeSpec.Fixed(RectangleShape)),
    tagKey = "square"
)
```

### The box at the end

The box at the end of the label (`controlPosition = ControlPosition.End`): a list's options, the boxes one under another at the column's end. The rows take the column's width (`Modifier.fillMaxWidth()`).

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.selection.ControlPosition

var photos by rememberSaveable { mutableStateOf(true) }
var contacts by rememberSaveable { mutableStateOf(false) }
Column(Modifier.widthIn(max = 360.dp)) {
    PantrixCheckbox(
        checked = photos,
        onCheckedChange = { photos = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Back up photos",
        tagKey = "photos_end",
        controlPosition = ControlPosition.End
    )
    PantrixCheckbox(
        checked = contacts,
        onCheckedChange = { contacts = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Back up contacts",
        tagKey = "contacts_end",
        controlPosition = ControlPosition.End
    )
}
```

## API

### PantrixCheckbox

`import com.pantrixui.components.elements.checkbox.PantrixCheckbox`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCheckbox(
    checked: Boolean,
    onCheckedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: CheckboxStyle? = null,
    colors: CheckboxColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A checkbox: a box that is checked or not, and the label it is the box of.

The box, the label and the supporting text are one target. A press anywhere on them toggles the box, since on a phone the words are most of what a finger can hit, and a screen reader hears one checkbox, named by its label, that says whether it is checked. The box stands on the label's first line, however many lines the label and the supporting text run to. The row takes the platform's touch target, small as the box is.

Without `onCheckedChange` the checkbox is read-only: it takes no press and no focus, and still says its name and its state. `error` turns the box and the supporting text to the danger role and is announced. Checking and unchecking draw the tick on and off while the fill fades in and out: at once under reduced motion.

Parameters:

- `checked: Boolean`: whether the box is checked.
- `onCheckedChange: ((Boolean) -> Unit)?`: called with the value the user asks for, the opposite of `checked`. The checkbox changes nothing by itself: it is checked when `checked` says so. Null makes it read-only.
- `modifier: Modifier`: the row's modifier.
- `enabled: Boolean`: whether the checkbox can be toggled. One that cannot is drawn in the disabled colours and says so.
- `label: String?`: the text beside the box: part of the target, and the checkbox's name for a screen reader.
- `supportingText: String?`: help under the label, in a smaller type: the message, while `error` is true.
- `error: Boolean`: whether the value is wrong: the box and the supporting text turn to the danger role, and a screen reader is told the input is invalid.
- `style: CheckboxStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CheckboxColors?`: this checkbox's own colours: the ones it sets, with the theme's for the rest. A disabled box and one in error keep the theme's.
- `contentDescription: String?`: what a screen reader says for the checkbox: its name where it has no `label`, as in a table's row, or in place of the label.
- `tagKey: String?`: the checkbox's automation key: the row is `Checkbox_<tagKey>`. A toggle is reported as a `Checkbox` event that carries the state the box had, and never its label.
- `interactionSource: MutableInteractionSource?`: the checkbox's interactions, hoisted. It keeps a source of its own when this is null.
- `controlPosition: ControlPosition`: where the box stands: before the label, as a list of choices has it, or after it. After it, the box is at the end of the width the row is given, `Modifier.fillMaxWidth()` lining it up with the others, or right after the label where the row is given none; the label wraps in what the box leaves.

### PantrixCheckbox

`import com.pantrixui.components.elements.checkbox.PantrixCheckbox`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCheckbox(
    field: FormField<Boolean>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    style: CheckboxStyle? = null,
    colors: CheckboxColors? = null,
    contentDescription: String? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A checkbox bound to a form's field: its value, its error and its name come from `field`.

A toggle changes the field and marks it touched, so a rule's message shows after the first toggle, or when the form is submitted, and not on a form nobody has touched. While the field is in error the message takes the place of `supportingText`, rather than standing beside it. The field's id is the checkbox's automation key, `Checkbox_<id>`, and the form can send the focus here when it is submitted with this field in error.

It is an overload of its own and not a parameter of the controlled form, so that a value and a field cannot both be given.

Parameters:

- `field: FormField<Boolean>`: the field the checkbox shows and changes.
- `modifier: Modifier`: the row's modifier.
- `enabled: Boolean`: whether the checkbox can be toggled.
- `label: String?`: the text beside the box: part of the target, and the checkbox's name for a screen reader.
- `supportingText: String?`: help under the label, while the field has no error to show there.
- `style: CheckboxStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CheckboxColors?`: this checkbox's own colours: the ones it sets, with the theme's for the rest. A disabled box and one in error keep the theme's.
- `contentDescription: String?`: what a screen reader says for the checkbox where it has no `label`, or in place of it.
- `controlPosition: ControlPosition`: where the box stands: before the label, as a list of choices has it, or after it. After it, the box is at the end of the width the row is given, `Modifier.fillMaxWidth()` lining it up with the others, or right after the label where the row is given none; the label wraps in what the box leaves.

### PantrixTriStateCheckbox

`import com.pantrixui.components.elements.checkbox.PantrixTriStateCheckbox`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTriStateCheckbox(
    state: ToggleableState,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: CheckboxStyle? = null,
    colors: CheckboxColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A checkbox with a third state: checked, not checked, or some of both.

The third state is what a "select all" shows over a list that is partly selected. It draws a dash, and a screen reader hears it as itself and not as unchecked. What a press leads to is the caller's to say: `onClick` only asks. In everything else it is `PantrixCheckbox`: one target with its label, on the label's first line, read-only without a callback.

Parameters:

- `state: ToggleableState`: checked, not checked, or indeterminate.
- `onClick: (() -> Unit)?`: called when the user presses the checkbox. Null makes it read-only.
- `modifier: Modifier`: the row's modifier.
- `enabled: Boolean`: whether the checkbox can be pressed. One that cannot is drawn in the disabled colours and says so.
- `label: String?`: the text beside the box: part of the target, and the checkbox's name for a screen reader.
- `supportingText: String?`: help under the label, in a smaller type: the message, while `error` is true.
- `error: Boolean`: whether the value is wrong: the box and the supporting text turn to the danger role, and a screen reader is told the input is invalid.
- `style: CheckboxStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CheckboxColors?`: this checkbox's own colours: the ones it sets, with the theme's for the rest. A disabled box and one in error keep the theme's.
- `contentDescription: String?`: what a screen reader says for the checkbox where it has no `label`, or in place of it.
- `tagKey: String?`: the checkbox's automation key: the row is `Checkbox_<tagKey>`.
- `interactionSource: MutableInteractionSource?`: the checkbox's interactions, hoisted. It keeps a source of its own when this is null.
- `controlPosition: ControlPosition`: where the box stands: before the label, as a list of choices has it, or after it. After it, the box is at the end of the width the row is given, `Modifier.fillMaxWidth()` lining it up with the others, or right after the label where the row is given none; the label wraps in what the box leaves.

### CheckboxStyle

`import com.pantrixui.components.elements.checkbox.CheckboxStyle`, from `com.pantrixui:components`

```kotlin
class CheckboxStyle(
    public val size: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified
) : PantrixStyle<CheckboxStyle>
```

`PantrixCheckbox`'s box: its size, its corners and its edge.

The box is a square with the small step of the shape scale for its corners, 4dp by default, on every platform. It is 18dp, as Material 3 has it, and 22dp on iOS. iOS has no checkbox of its own, and its box is not round there either: a circle is a radio button, and an empty one would say that only one of the boxes can be chosen.

None of the three follows the density: a box, its corners and its edge are not air. The space between the box and its label does, since it comes from the theme's spacing. A checkbox's colours are not part of its style: they come from its state, and from `CheckboxColors` where a checkbox has its own.

Parameters:

- `size: Dp`: The box's width and height, its edge included.
- `shape: ShapeSpec`: The box's corners: a step of the brand's shape scale, so a brand with square corners has square boxes.
- `strokeWidth: Dp`: How thick the box's edge is, and the tick's and the dash's line.

### CheckboxColors

`import com.pantrixui.components.elements.checkbox.CheckboxColors`, from `com.pantrixui:components`

```kotlin
data class CheckboxColors(
    public val checked: Color = Color.Unspecified,
    public val checkmark: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What `PantrixCheckbox` is painted with, for a checkbox that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role. A product gives the colours it changes and no others:

```kotlin
PantrixCheckbox(
    checked = accepted,
    onCheckedChange = { accepted = it },
    label = stringResource(Res.string.accept_terms),
    colors = CheckboxColors(checked = brand, checkmark = onBrand)
)
```

They are the colours of a checkbox that can be toggled and is not in error. A disabled one is drawn in the theme's disabled roles and one in error in its danger role, whatever is given here, so that both look the same across a product.

A fill given here that is one of the theme's own colours brings the colour the theme pairs with it for what is drawn on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `checked: Color`: The box's fill when it is checked or indeterminate. The theme's `primary`.
- `checkmark: Color`: The tick and the dash on the fill: the colour that reads on `checked`. The primary role's `onColor`.
- `border: Color`: The box's edge when it is not checked. The theme's `borderStrong`: an empty box is nothing but its edge.
