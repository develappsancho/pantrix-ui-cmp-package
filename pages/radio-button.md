# Radio Button

One of several options: a ring and the label beside it. It is almost always used through `PantrixRadioGroup`: the group lays the options out, moves the selection with the arrow keys and binds to a form's field. On its own, `PantrixRadioButton` is for a layout a group cannot make, such as a list where each option is a card.

The group selects nothing by itself: whichever value `selected` says is the one selected. A press and the arrow keys report, through `onSelect`, the value of the option that is wanted; the caller holds the selection.

- `PantrixRadioButton` (`com.pantrixui.components.elements.radiobutton`, `com.pantrixui:components`): One option of a choice of one, with a label, supporting text and an error state; PantrixRadioGroup lays several out and moves the selection with the arrow keys. Keywords: option, single choice, choice, exclusive option.
- `PantrixRadioGroup` (`com.pantrixui.components.elements.radiobutton`, `com.pantrixui:components`): A choice of one among a few options, one under another or side by side, controlled or bound to a form's field; the arrow keys move the selection. Keywords: single choice, option group, choice, exclusive selection, options list.

## Features

- **Options.** An option is a `RadioOption`: its value, its label, the text under the label that says what it is, whether it can be selected, and its automation key.
- **One under another or side by side.** `orientation` lays the options out one under another (`Orientation.Vertical`, the default) or side by side (`Orientation.Horizontal`): as many on a line as the width takes, and the rest on the next line.
- **Keyboard.** The group is one stop for Tab: the focus comes to the selected option, or to the first option that can be selected while none is. The arrow keys select the next and the previous option, wrap around from the last to the first and skip one that cannot be selected; in a right-to-left layout left and right change places.
- **One target.** The ring, the label and the text under it are one target: a press on the words selects too. However small the ring is, the row takes up the platform's touch target.
- **Error.** `error` turns the rings and the text under the group to the theme's `danger` role; the group tells a screen reader of the error, once.
- **Form.** The `PantrixRadioGroup` that takes a `field` gets its selection, its error and its name from the form's field. A choice that has to be made is built with a field that starts at null and `Rules.required`.
- **Disabled and read-only.** `RadioOption(enabled = false)` disables a single option, and the group's `enabled = false` all of them. A `PantrixRadioButton` whose `onClick` is null is read-only: it takes no press and no focus, and says whether it is selected.
- **Its own colours and style.** `RadioColors` gives the colour of the selected ring and of the unselected one; `RadioStyle` gives the size of the ring, the size of the dot in it and the thickness of the line. The ring is 20dp and its dot 10dp; on iOS, 22dp and 12dp.
- **The ring at the end.** `controlPosition = ControlPosition.End` puts the ring at the end of the label; in a group one under another, the options take the group's width and the rings stand in a column.
- **Screen reader.** Each option is a radio button that says whether it is selected; the group's name is `label`. Buttons used on their own are wrapped in `Modifier.selectableGroup()`, so that they are heard as one choice.
- **Motion.** The dot of a ring that is selected grows, and the ring turns to the `primary` colour with it. In a theme with reduced motion both happen at once.

## Usage

### Options in a layout of the app's own

```kotlin
Row(Modifier.selectableGroup()) {
    PantrixRadioButton(
        selected = sort == Sort.Newest,
        onClick = { sort = Sort.Newest },
        label = stringResource(Res.string.newest_first),
        tagKey = "newest"
    )
    PantrixRadioButton(
        selected = sort == Sort.Oldest,
        onClick = { sort = Sort.Oldest },
        label = stringResource(Res.string.oldest_first),
        tagKey = "oldest"
    )
}
```

### Read-only, to show what was chosen

```kotlin
PantrixRadioButton(selected = true, onClick = null, label = plan.name, supportingText = plan.price)
```

### Without a label, in a card that is the option

```kotlin
PantrixRadioButton(
    selected = address.id == chosen,
    onClick = { onChoose(address.id) },
    contentDescription = stringResource(Res.string.deliver_to, address.name),
    tagKey = "address_" + address.id
)
```

### Controlled, with what each option means under its label

```kotlin
var delivery by rememberSaveable { mutableStateOf("standard") }
PantrixRadioGroup(
    options = listOf(
        RadioOption(
            value = "standard",
            label = stringResource(Res.string.standard),
            supportingText = stringResource(Res.string.standard_takes),
            tagKey = "standard"
        ),
        RadioOption(
            value = "express",
            label = stringResource(Res.string.express),
            supportingText = stringResource(Res.string.express_takes),
            tagKey = "express"
        )
    ),
    selected = delivery,
    onSelect = { delivery = it },
    label = stringResource(Res.string.delivery),
    tagKey = "delivery"
)
```

### A choice that has to be made, bound to a form's field and laid out side by side

```kotlin
val form = rememberFormState()
val size = form.field<String?>("size", initial = null, Rules.required(stringResource(Res.string.size_required)))
PantrixRadioGroup(
    field = size,
    options = sizes.map { RadioOption(value = it.id, label = it.name, tagKey = it.id) },
    orientation = Orientation.Horizontal,
    label = stringResource(Res.string.size)
)
```

### In colours of its own

```kotlin
PantrixRadioGroup(
    options = plans.map { RadioOption(value = it.id, label = it.name, tagKey = it.id) },
    selected = plan,
    onSelect = { plan = it },
    colors = RadioColors(selected = PantrixTheme.colors.success.color),
    tagKey = "plan"
)
```

## Examples

### A group and its options

`PantrixRadioGroup` lays the options out one under another below `label`, and writes `supportingText` at the very bottom. Each option is a `RadioOption`; here what each one means is written under it. "Store pickup" cannot be selected (`enabled = false`): a press on it does nothing and the arrow keys skip it.

Try it with the keyboard: Tab enters the group once and stops on the selected option. The down and up arrows move the selection and the focus together, and wrap around from the last option to the first.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

var delivery by rememberSaveable { mutableStateOf("standard") }
PantrixRadioGroup(
    options = DELIVERIES,
    selected = delivery,
    onSelect = { delivery = it },
    label = "Delivery",
    supportingText = "You can change it until the order ships",
    tagKey = "delivery"
)

private val DELIVERIES = listOf(
    RadioOption("standard", "Standard", supportingText = "Three to five working days", tagKey = "standard"),
    RadioOption("express", "Express", supportingText = "Next working day", tagKey = "express"),
    RadioOption(
        value = "pickup",
        label = "Store pickup",
        supportingText = "Not available in your city yet",
        enabled = false,
        tagKey = "pickup"
    )
)
```

### Side by side

`orientation = Orientation.Horizontal` lays the options out side by side: as many on a line as the width takes, and the rest on the next line. The rings are aligned on the first line of their labels, whether or not something is written under a label.

The left and right arrows move the selection too; in a right-to-left layout they swap directions. The down and up arrows are the next and the previous option in both orientations.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

var digest by rememberSaveable { mutableStateOf("weekly") }
PantrixRadioGroup(
    options = listOf(
        RadioOption("daily", "Every day", tagKey = "daily"),
        RadioOption("weekly", "Once a week", tagKey = "weekly"),
        RadioOption("monthly", "Once a month", tagKey = "monthly"),
        RadioOption("never", "Never", tagKey = "never")
    ),
    selected = digest,
    onSelect = { digest = it },
    orientation = Orientation.Horizontal,
    label = "Digest email",
    tagKey = "digest"
)
```

### A choice of size bound to a form

The `PantrixRadioGroup` that takes a `field` is bound to a form's field: it gets its selection, its error and its name from the field. This is how a choice that has to be made is built: the field starts at null and carries `Rules.required`. The field's id is the automation key: the group is `RadioGroup_size`, and its options are named inside it.

Press "Add to cart" without picking a size: the rule's message takes the place of the supporting text, the rings turn to the error colour and the focus goes to the group. The sizes are laid out side by side; "XL" is sold out and cannot be selected.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixRadioGroup(
    field = form.field<String?>("size", initial = null, Rules.required("Choose a size to continue")),
    options = SIZES,
    orientation = Orientation.Horizontal,
    label = "Size",
    supportingText = "Runs small; if you are between sizes, choose the larger one"
)
PantrixButton(
    text = "Add to cart",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Added to cart", tagKey = "added_to_cart") } }
    },
    form = form,
    tagKey = "add_to_cart"
)

private val SIZES = listOf("XS", "S", "M", "L", "XL", "XXL").map { size ->
    RadioOption(value = size.lowercase(), label = size, enabled = size != "XL", tagKey = size.lowercase())
}
```

### Error

`error` turns the rings and the text under the group to the theme's `danger` role; the group tells a screen reader that the input is invalid, once. The texts under the options keep their colour: they say what an option is, not what is wrong.

Here the example works out the error itself: `error` is true while none is selected. Pick one: the rings and the text below go back to how they were.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

var invoice by rememberSaveable { mutableStateOf<String?>(null) }
PantrixRadioGroup(
    options = listOf(
        RadioOption("personal", "Personal", supportingText = "The invoice is issued in your name", tagKey = "personal"),
        RadioOption("company", "Company", supportingText = "A tax number is required", tagKey = "company")
    ),
    selected = invoice,
    onSelect = { invoice = it },
    label = "Invoice type",
    supportingText = if (invoice == null) "Choose a type to continue" else "You can change it later",
    error = invoice == null,
    tagKey = "invoice"
)
```

### Disabled and read-only

The group's `enabled = false` disables every option; the label and the supporting text are written in the disabled text colour too. Which option is selected can still be seen.

A `PantrixRadioButton` given `onClick = null` is read-only: it takes no press and no focus, its colours do not change, and it still says its name and that it is selected.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioButton
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

PantrixRadioGroup(
    options = listOf(
        RadioOption("card", "Card", tagKey = "card"),
        RadioOption("transfer", "Bank transfer", tagKey = "transfer")
    ),
    selected = "card",
    onSelect = {},
    orientation = Orientation.Horizontal,
    enabled = false,
    label = "Payment",
    supportingText = "Disabled: your saved card will be charged",
    tagKey = "payment"
)
PantrixRadioButton(
    selected = true,
    onClick = null,
    label = "Read-only",
    supportingText = "Cannot be pressed; it only shows what was chosen",
    tagKey = "read_only"
)
```

### On its own: inside cards

On its own, `PantrixRadioButton` is for a layout a group cannot make: here each option is inside a card. The caller holds the selection: each button is told whether it is selected through `selected`, and asks through `onClick` when it is pressed.

The buttons are in a column that carries `Modifier.selectableGroup()`: a screen reader hears them as one choice. Moving with the arrow keys is the group's work, and there is none of it here: each button is a separate stop for Tab.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.radiobutton.PantrixRadioButton
import com.pantrixui.foundation.theme.PantrixTheme

var plan by rememberSaveable { mutableStateOf("monthly") }
Column(
    modifier = Modifier.widthIn(max = 360.dp).selectableGroup(),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
        PantrixRadioButton(
            selected = plan == "monthly",
            onClick = { plan = "monthly" },
            modifier = Modifier.fillMaxWidth(),
            label = "Monthly",
            supportingText = "Renews every month; you can cancel at any time",
            tagKey = "plan_monthly"
        )
    }
    PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
        PantrixRadioButton(
            selected = plan == "yearly",
            onClick = { plan = "yearly" },
            modifier = Modifier.fillMaxWidth(),
            label = "Yearly",
            supportingText = "Paid once a year",
            tagKey = "plan_yearly"
        )
    }
}
```

### Its own colours

`colors` paints every option of the group. Here only the selected ring's colour was given (`RadioColors(selected = …)`): the selected ring and its dot are in the app's own purple, and the others stay in the theme's colour.

These are the colours of a ring that can be selected and is not in error. A disabled option and a group in error are drawn in the theme's colours, even when colours are given.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioColors
import com.pantrixui.components.elements.radiobutton.RadioOption

var wrapping by rememberSaveable { mutableStateOf("gift") }
PantrixRadioGroup(
    options = listOf(
        RadioOption("plain", "Plain", tagKey = "plain"),
        RadioOption("gift", "Gift wrap", tagKey = "gift")
    ),
    selected = wrapping,
    onSelect = { wrapping = it },
    orientation = Orientation.Horizontal,
    label = "Wrapping",
    supportingText = "The selected ring's colour was passed in; the others are in the theme's colour",
    colors = RadioColors(selected = ownColors().color),
    tagKey = "wrapping"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Style

`style` changes the ring of every option of the group: `size` is the size of the ring, `dotSize` that of the dot in it, and `strokeWidth` how thick the ring's line is. Only the fields that are given change; the rest comes from the theme's and the platform's style.

The ring here is 28dp, its dot 14dp and its line 3dp. The ring's colour is not part of the style: it comes from the state and from `colors`.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.elements.radiobutton.RadioStyle

var seat by rememberSaveable { mutableStateOf("window") }
PantrixRadioGroup(
    options = listOf(
        RadioOption("window", "Window", tagKey = "window"),
        RadioOption("aisle", "Aisle", tagKey = "aisle")
    ),
    selected = seat,
    onSelect = { seat = it },
    orientation = Orientation.Horizontal,
    label = "Seat",
    style = RadioStyle(size = 28.dp, dotSize = 14.dp, strokeWidth = 3.dp),
    tagKey = "seat"
)
```

### The rings at the end

The rings at the end of the options (`controlPosition = ControlPosition.End`): options one under another take the group's width, and their rings stand in a column at the group's end.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.elements.selection.ControlPosition

var delivery by rememberSaveable { mutableStateOf("standard") }
PantrixRadioGroup(
    options = DELIVERIES,
    selected = delivery,
    onSelect = { delivery = it },
    modifier = Modifier.widthIn(max = 360.dp),
    label = "Delivery",
    tagKey = "delivery_end",
    controlPosition = ControlPosition.End
)

private val DELIVERIES = listOf(
    RadioOption("standard", "Standard", supportingText = "Three to five working days", tagKey = "standard"),
    RadioOption("express", "Express", supportingText = "Next working day", tagKey = "express"),
    RadioOption(
        value = "pickup",
        label = "Store pickup",
        supportingText = "Not available in your city yet",
        enabled = false,
        tagKey = "pickup"
    )
)
```

## API

### PantrixRadioButton

`import com.pantrixui.components.elements.radiobutton.PantrixRadioButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixRadioButton(
    selected: Boolean,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: RadioStyle? = null,
    colors: RadioColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A radio button: a ring that is selected or not, and the label it is the ring of. One of several, of which one is chosen.

It is almost always used through `PantrixRadioGroup`, which lays the options out, moves the selection with the arrow keys and binds it to a form's field. On its own it is for options in a layout a group cannot make, such as a card for each: wrap them in `Modifier.selectableGroup()`, so that a screen reader hears them as one choice.

The ring, the label and the supporting text are one target. A press anywhere on them asks for the option, since on a phone the words are most of what a finger can hit, and a screen reader hears one radio button, named by its label, that says whether it is selected. The ring stands on the label's first line, however many lines the label and the supporting text run to. The row takes the platform's touch target, small as the ring is.

Without `onClick` the radio button is read-only: it takes no press and no focus, and still says its name and whether it is selected. `error` turns the ring and the supporting text to the danger role and is announced. Selecting grows the dot and turns the ring to the primary role's colour together, and unselecting takes both back: at once under reduced motion.

Parameters:

- `selected: Boolean`: whether this is the option chosen.
- `onClick: (() -> Unit)?`: called when the user presses the radio button, selected already or not. The radio button changes nothing by itself: it is selected when `selected` says so. Null makes it read-only.
- `modifier: Modifier`: the row's modifier.
- `enabled: Boolean`: whether the radio button can be selected. One that cannot is drawn in the disabled colours and says so.
- `label: String?`: the text beside the ring: part of the target, and the radio button's name for a screen reader.
- `supportingText: String?`: help under the label, in a smaller type: the message, while `error` is true.
- `error: Boolean`: whether the choice is wrong or missing: the ring and the supporting text turn to the danger role, and a screen reader is told the input is invalid.
- `style: RadioStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: RadioColors?`: this radio button's own colours: the ones it sets, with the theme's for the rest. A disabled ring and one in error keep the theme's.
- `contentDescription: String?`: what a screen reader says for the radio button: its name where it has no `label`, as in a card that is the option, or in place of the label.
- `tagKey: String?`: the radio button's automation key: the row is `RadioButton_<tagKey>`. A press is reported as a `RadioButton` event, and never by its label.
- `interactionSource: MutableInteractionSource?`: the radio button's interactions, hoisted. It keeps a source of its own when this is null.
- `controlPosition: ControlPosition`: where the ring stands: before the label, as a list of choices has it, or after it. After it, the ring is at the end of the width the row is given, `Modifier.fillMaxWidth()` lining it up with the others, or right after the label where the row is given none; the label wraps in what the ring leaves.

### PantrixRadioGroup

`import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixRadioGroup(
    options: List<RadioOption<T>>,
    selected: T?,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
    orientation: Orientation = Orientation.Vertical,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: RadioStyle? = null,
    colors: RadioColors? = null,
    tagKey: String? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A group of radio buttons: a choice of one among `options`, under a label, with help or an error's message below.

The options stand one under another, or side by side with `Orientation.Horizontal`: as many on a line as the width takes, and the rest on the next. Each is a `PantrixRadioButton`, with the ring on the first line of its label.

The group is one stop for Tab, on the selected option, as the radio group pattern of WAI-ARIA has it: the first option that can be selected, while none is. The arrow keys choose the next and the previous option, left and right the other way round in a right-to-left layout, wrapping around and skipping an option that is disabled. They choose and do not only move: while an option has the focus, the focus goes with the selection, whoever makes it, so that the option a screen reader is on is the one chosen. A press on an option takes the focus to it, where a press can.

For a screen reader each option is a radio button that says whether it is selected, in one group named by `label`. `error` is announced by the group, once, and turns every ring and the group's message to the danger role.

Parameters:

- `options: List<RadioOption<T>>`: the options, in order.
- `selected: T?`: the value of the selected option. Null, or a value no option has, selects none.
- `onSelect: (T) -> Unit`: called with the value of the option the user chose, by a press or by the keys. The group selects nothing by itself: an option is selected when `selected` says so. A press on the option that is selected asks again, and an arrow key only ever asks for another option.
- `modifier: Modifier`: the group's modifier.
- `orientation: Orientation`: `Orientation.Vertical` for one option under another, `Orientation.Horizontal` for side by side.
- `enabled: Boolean`: false disables every option, and writes the label and the supporting text in the disabled text colour.
- `label: String?`: what the choice is, written over the options: the group's name for a screen reader.
- `supportingText: String?`: help under the options, in a smaller type: the message, while `error` is true.
- `error: Boolean`: whether the choice is wrong or missing: the rings and the supporting text turn to the danger role, and a screen reader is told the input is invalid.
- `style: RadioStyle?`: this call's own style, the one every option is drawn with: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: RadioColors?`: the colours every option is drawn in, where they are not the theme's: the ones set here, with the theme's for the rest. A disabled option and a group in error keep the theme's.
- `tagKey: String?`: the group's automation key: the group is `RadioGroup_<tagKey>`, and its options are named inside it, `RadioGroup_<tagKey>.RadioButton_<key>`, so that two groups with the same options are told apart. A choice is reported once, as a `RadioGroup` event that carries the option's index, and never its value or its label.
- `controlPosition: ControlPosition`: where each option's ring stands: before its label, or after it. After it, one under another, every option spans the group and the rings line up at its end; side by side, each ring follows its label.

### PantrixRadioGroup

`import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixRadioGroup(
    field: FormField<T>,
    options: List<RadioOption<T>>,
    modifier: Modifier = Modifier,
    orientation: Orientation = Orientation.Vertical,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    style: RadioStyle? = null,
    colors: RadioColors? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A radio group bound to a form's field: its selection, its error and its name come from `field`.

A choice changes the field and marks it touched, so a rule's message shows after the first choice, or when the form is submitted, and not on a form nobody has touched. While the field is in error the message takes the place of `supportingText`, rather than standing beside it. The field's id is the group's automation key, `RadioGroup_<id>`, with its options inside it, and the form can send the focus here when it is submitted with this field in error: it goes to the group's one stop.

A choice that has to be made is a field of a nullable value that starts at null, with `Rules.required`. Its options are options of the value itself: a `RadioOption<String>` is an option of a `FormField<String?>`.

It is an overload of its own and not a parameter of the controlled form, so that a selection and a field cannot both be given.

Parameters:

- `field: FormField<T>`: the field the group shows and changes.
- `options: List<RadioOption<T>>`: the options, in order.
- `modifier: Modifier`: the group's modifier.
- `orientation: Orientation`: `Orientation.Vertical` for one option under another, `Orientation.Horizontal` for side by side.
- `enabled: Boolean`: false disables every option.
- `label: String?`: what the choice is, written over the options: the group's name for a screen reader.
- `supportingText: String?`: help under the options, while the field has no error to show there.
- `style: RadioStyle?`: this call's own style, the one every option is drawn with: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: RadioColors?`: the colours every option is drawn in, where they are not the theme's: the ones set here, with the theme's for the rest. A disabled option and a group in error keep the theme's.
- `controlPosition: ControlPosition`: where each option's ring stands: before its label, or after it. After it, one under another, every option spans the group and the rings line up at its end; side by side, each ring follows its label.

### RadioOption

`import com.pantrixui.components.elements.radiobutton.RadioOption`, from `com.pantrixui:components`

```kotlin
class RadioOption<out T>(
    public val value: T,
    public val label: String,
    public val supportingText: String? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

One option of `PantrixRadioGroup`: the value it stands for, its label, and a key for automation.

Parameters:

- `value: T`: What the group gives to its `onSelect` when the option is chosen, and compares with its `selected` by `==`.
- `label: String`: The visible text, and the option's name for a screen reader.
- `supportingText: String?`: Written under the label in a smaller type, to say what the option is: a price, how long a delivery takes. It is part of the option's target and of what a screen reader says for it, and keeps its colour when the group is in error.
- `enabled: Boolean`: Whether the option can be selected. A press does nothing on one that cannot, and the arrow keys skip it.
- `tagKey: String?`: The option's automation key, the same in every language: the option is `RadioButton_<tagKey>`, or `RadioButton_<index>` without one, inside the tag of a group that has a key: `RadioGroup_plan.RadioButton_pro`.

### RadioStyle

`import com.pantrixui.components.elements.radiobutton.RadioStyle`, from `com.pantrixui:components`

```kotlin
class RadioStyle(
    public val size: Dp = Dp.Unspecified,
    public val dotSize: Dp = Dp.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified
) : PantrixStyle<RadioStyle>
```

`PantrixRadioButton`'s ring and the dot in it: how large each is, and how thick the ring.

The ring is 20dp around a 10dp dot, as Material 3 has it, and 22dp around a 12dp dot on iOS, where a checkbox is 22dp too. iOS has no radio button of its own: it marks the one chosen row of a list with a tick. Pantrix draws the same ring on every platform, so that a choice of one looks like one wherever it is made.

None of the three follows the density: a ring, its dot and its line are not air. The space between the ring and its label does, since it comes from the theme's spacing. A radio button's colours are not part of its style: they come from its state, and from `RadioColors` where a radio button has its own.

Parameters:

- `size: Dp`: The ring's width and height, its line included.
- `dotSize: Dp`: The width and height of the dot in a selected ring.
- `strokeWidth: Dp`: How thick the ring's line is.

### RadioColors

`import com.pantrixui.components.elements.radiobutton.RadioColors`, from `com.pantrixui:components`

```kotlin
data class RadioColors(
    public val selected: Color = Color.Unspecified,
    public val unselected: Color = Color.Unspecified
)
```

What `PantrixRadioButton` and the options of `PantrixRadioGroup` are painted with, for ones that do not take the theme's: a colour that is set is used, and one that is left out stays the theme's role.

```kotlin
PantrixRadioGroup(
    options = plans,
    selected = plan,
    onSelect = { plan = it },
    colors = RadioColors(selected = brand)
)
```

They are the colours of a radio button that can be selected and is not in error. A disabled one is drawn in the theme's disabled role and one in error in its danger role, whatever is given here.

Parameters:

- `selected: Color`: The ring and the dot of the option that is chosen. The theme's `primary`.
- `unselected: Color`: The ring of an option that is not. The theme's `borderStrong`: an empty ring is nothing but its line.
