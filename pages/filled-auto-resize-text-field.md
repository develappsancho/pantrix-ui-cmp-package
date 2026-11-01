# Filled Auto Resize Text Field

A text field whose label is inside its box and whose text gets smaller to stay in view: an amount, a card number, a short note, in the filled text field's box. The text is as large as its style says while it fits the box; when it does not, it is set as small as it takes to fit, and it grows back as it is deleted.

Its box is `PantrixFilledTextField`'s, and its shrinking text `PantrixAutoResizeTextField`'s. It takes the filled field's `style` and `colors`: the filled fields are restyled together, and the two fields that shrink their text can stand in for each other. It is built on a `TextFieldState`, and has an overload that takes a `value` and an `onValueChange`, and one that takes a form's field.

- `PantrixFilledAutoResizeTextField` (`com.pantrixui.components.inputs.filledautoresizetextfield`, `com.pantrixui:components`): A text input whose label is inside a filled box and whose text shrinks to fit the box and grows back as it is shortened, on one line or several, for an amount, a number or a note that is read whole, with supporting and error text, icons, a clear button, a character count and form binding. Keywords: autosize input, shrink to fit, amount input, floating label, filled input.

## Features

- **The label inside the box.** At rest `label` stands in the text's place: in the `body` size, whatever the text's style. With the focus, or while the field holds a text, it moves up to its own line above the text.
- **A box that does not change.** The box's width is its style's least or the one its caller gave it; a text that grows longer does not widen it: it is set as small as it takes to fit, and grows back when it is shortened.
- **The largest size.** `textStyle` is the style of the text at its largest: a role of the theme's typography, such as `title` for an amount. A large style makes the box taller only by what its label and one line of that style need.
- **The smallest size.** `minFontSize` is the smallest the text gets: a size in sp, or one in em, which is a share of the style's size. It is the theme's `footnote` size unless given. A text that still does not fit at that size scrolls, as the text of any field does.
- **Several lines.** In a field of several lines the box grows with its text from the least of its lines to the most; from there the box keeps its height, and the text is set smaller, its line spacing with it.
- **A given height.** A height the field is given comes before its lines: the box fills what the supporting text leaves of it, and the text is fitted to that height.
- **Placeholder.** `placeholder` shows while the label is out of its place: while the field is empty and has the focus. It is in the text's style, and where it is long it shrinks too.
- **Fill, outline and error.** At rest the box is filled and has no outline; it is outlined with the focus and in error. `error` does not change the label's colour. A disabled field has no fill.
- **Three overloads.** In the one that takes a `state` the text is read from the state. The one that takes a `value` and an `onValueChange` keeps the text with its caller, and takes its lines as `singleLine`, `minLines` and `maxLines`. The one that takes a `field` is bound to a form's field.
- **Automation key.** With `tagKey` the field is named `FilledAutoResizeTextField_<tagKey>`, and its clear button `FilledAutoResizeTextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.

## Usage

### An amount, read when it is used

```kotlin
val amount = rememberTextFieldState()
PantrixFilledAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.amount),
    placeholder = "0",
    trailingIcon = { PantrixText(text = "TL") },
    textStyle = PantrixTheme.typography.title,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
    tagKey = "amount"
)
PantrixButton(text = stringResource(Res.string.send), onClick = { onSend(amount.text.toString()) })
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val card = rememberTextFieldState(initial.cardNumber)
LaunchedEffect(card) {
    snapshotFlow { card.text.toString() }.collectLatest { viewModel.updateCardNumber(it) }
}
PantrixFilledAutoResizeTextField(
    state = card,
    label = stringResource(Res.string.card_number),
    maxLength = 19,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    contentType = ContentType.CreditCardNumber,
    tagKey = "card"
)
```

### Held as a String, digits only

```kotlin
var amount by rememberSaveable { mutableStateOf("") }
PantrixFilledAutoResizeTextField(
    value = amount,
    onValueChange = { if (it.all(Char::isDigit)) amount = it },
    label = stringResource(Res.string.amount),
    textStyle = PantrixTheme.typography.title,
    minFontSize = 14.sp,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "amount"
)
```

### A note in a box of three lines

```kotlin
val note = rememberTextFieldState()
PantrixFilledAutoResizeTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.note),
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3, maxHeightInLines = 3),
    tagKey = "note"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixFilledAutoResizeTextField(
    field = form.field("iban", initial = "", Rules.notBlank(stringResource(Res.string.iban_required))),
    form = form,
    label = stringResource(Res.string.iban),
    showClearButton = true
)
```

## Examples

### At its plainest

The least there is to write: a `TextFieldState` and a label. The field was given no width: the box is at its style's least width and does not grow wider with its text. The account name is too long for that box, so it is drawn smaller; and since the field holds a text, the label is on its own line above the text.

Delete the text: what is left grows back. Once the field is empty and loses the focus, the label comes down to the text's place.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField

PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("Yılmaz Mimarlık ve Mühendislik Limited Şirketi"),
    label = "Account name",
    tagKey = "account_name"
)
```

### The text style and the box's height

`textStyle` is the style of the text at its largest; without it the text is in the `body` size. A large style makes the box taller only by what its label and one line of that style need: compare the first two fields.

The third field is empty and in the `display` style. Whatever the text's style, the label rests in the text's place in the `body` size. Press the field: the label moves up, and the placeholder appears in the text's style.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("1250"),
    modifier = Modifier.fillMaxWidth(),
    label = "No style given",
    tagKey = "style_body"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("1250"),
    modifier = Modifier.fillMaxWidth(),
    label = "In the title style",
    textStyle = PantrixTheme.typography.title,
    tagKey = "style_title"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "In the display style, empty",
    placeholder = "0",
    textStyle = PantrixTheme.typography.display,
    tagKey = "style_display"
)
```

### The smallest size

Both fields hold the same name in the `title` style, and the name fits neither box. The first was given no `minFontSize`: the text shrinks as far as the theme's `footnote` size. In the second it is never set smaller than 16 sp. `minFontSize` can also be given in em: it is then a share of the style's own size.

A text that still does not fit at its smallest size stops shrinking and scrolls, as the text of any field does.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.sp
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val company = "Yılmaz Mimarlık, Mühendislik ve Danışmanlık Limited Şirketi"
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState(company),
    label = "Not given: footnote size",
    textStyle = PantrixTheme.typography.title,
    tagKey = "smallest_default"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState(company),
    label = "Smallest 16 sp",
    textStyle = PantrixTheme.typography.title,
    minFontSize = 16.sp,
    tagKey = "smallest_sp"
)
```

### An amount that carries its text to a ViewModel

A payment amount, in the `headline` style. The field's state is created with `rememberTextFieldState`, from the value the ViewModel holds at that moment; the text in the state is followed with `snapshotFlow`, and every change is reported to the ViewModel. This is how the text is taken from the field's state.

The first value in the ViewModel is read once. From then on it goes one way: the text flows from the field to the ViewModel. When the screen is composed anew the ViewModel is still there, and the field starts with its value.

The line below shows what the ViewModel holds, and the button reads from it too: it cannot be pressed until an amount has arrived.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

val viewModel = viewModel(key = "payment") { PaymentViewModel() }
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val initialUiState = remember(viewModel) { viewModel.uiState.value }
val uiState by viewModel.uiState.collectAsStateWithLifecycle()

val amount = rememberTextFieldState(initialUiState.amount)
LaunchedEffect(amount) {
    snapshotFlow { amount.text.toString() }.collectLatest { viewModel.updateAmount(it) }
}
PantrixFilledAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = "Amount to pay",
    placeholder = "0",
    supportingText = "Shrinks as you type, grows back as you delete",
    trailingIcon = { PantrixText(text = "TL") },
    showClearButton = true,
    textStyle = PantrixTheme.typography.headline,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    inputTransformation = DigitsOnly,
    tagKey = "payment_amount"
)

PantrixText(
    text = "ViewModel: amount \"${uiState.amount}\", digits: ${uiState.amount.length}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "payment_state"
)
PantrixButton(
    text = "Pay",
    onClick = {
        scope.launch { snackbars?.show(message = "${uiState.amount} TL paid", tagKey = "payment_made") }
    },
    enabled = uiState.isComplete,
    tagKey = "pay"
)

private class PaymentViewModel : ViewModel() {
    private val state = MutableStateFlow(PaymentUiState())
    val uiState: StateFlow<PaymentUiState> = state.asStateFlow()

    fun updateAmount(amount: String) {
        state.update { it.copy(amount = amount) }
    }
}

private data class PaymentUiState(val amount: String = "") {
    val isComplete: Boolean get() = amount.isNotEmpty() && amount.any { it != '0' }
}

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### A field whose text is held as a String

A customer number of twelve digits. The caller holds the number as a `String`: the field shows it and asks for every change, and since a change that is not all digits is not taken, it is not shown either. The supporting text is made from that `String`.

The text that is asked for has to come back as `value` by the next frame, or the field shows the old text and the caret jumps: keep the text in state that the callback writes at once, and choose the overload that takes a `state` when the text lives in a flow.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

var number by rememberSaveable { mutableStateOf("") }
val missing = 12 - number.length
PantrixFilledAutoResizeTextField(
    value = number,
    onValueChange = { if (it.all(Char::isDigit)) number = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Customer number",
    supportingText = if (missing == 0) "Number complete" else "Digits to go: $missing",
    maxLength = 12,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.title,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "customer_number"
)
```

### A reference code bound to a form

The overload that takes a `field` gets its value, its error and its name from its field in the form: leave the code empty and move on, and the rule's message takes the place of the supporting text. In a field that is given `form`, the keyboard's action key submits the form through the "Save reference" button.

The text of a field bound to a form is the value of the form's field: it does not have to be taken separately.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixFilledAutoResizeTextField(
    field = form.field("reference", initial = "", Rules.notBlank("Enter a reference code")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Reference code",
    supportingText = "The code on the receipt",
    showClearButton = true,
    maxLength = 40,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters)
)
PantrixButton(
    text = "Save reference",
    onClick = {
        scope.launch {
            form.submit { snackbars?.show(message = "Reference saved", tagKey = "reference_saved") }
        }
    },
    form = form,
    tagKey = "save_reference"
)
```

### An address of several lines

A delivery address of several lines. The caller holds the address as a `String`; in this overload the field takes its lines as `singleLine`, `minLines` and `maxLines`. The box is two lines tall and grows to three; once the address passes three lines the box stays as it is, and the text is set as small as it takes to fit, its line spacing with it.

The supporting text is made from the `String` the caller holds. Its limit is 240 characters; its count is hidden with `showCharacterCount = false`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField

var address by rememberSaveable { mutableStateOf("") }
PantrixFilledAutoResizeTextField(
    value = address,
    onValueChange = { address = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Delivery address",
    supportingText = if (address.isBlank()) "Neighbourhood, street, house number" else "Characters: ${address.length}",
    showClearButton = true,
    maxLength = 240,
    showCharacterCount = false,
    singleLine = false,
    minLines = 2,
    maxLines = 3,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    tagKey = "delivery_address"
)
```

### Supporting text and error

`supportingText` stands under the box. `error = true` outlines the box in the `danger` colour; the supporting text and the caret turn to that colour too, and a screen reader announces the message as the error. The label keeps its own colour.

The field starts in error: the plate has lowercase letters. Type them again in capitals: the error goes. It is the caller, not the field, that works out the error; here by reading `plate.text`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val plate = rememberTextFieldState("34 abc 1903")
val lowercase = plate.text.any(Char::isLowerCase)
PantrixFilledAutoResizeTextField(
    state = plate,
    modifier = Modifier.fillMaxWidth(),
    label = "Licence plate",
    supportingText = if (lowercase) "Type the plate in capitals" else "As written on the registration document",
    error = lowercase,
    showClearButton = true,
    maxLength = 12,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.title,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters),
    tagKey = "plate"
)
```

### Disabled and read-only

`enabled = false` takes the field's fill away: the field is drawn in the theme's disabled text colour and takes no focus. Its text is still fitted to its box: the IBAN is in the `title` style, and is set smaller in a box it does not fit.

With `readOnly = true` the field keeps its fill: it can be focused, and its text selected and copied; it just cannot be changed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("TR330006100519786457841326"),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Saved IBAN",
    supportingText = "Disabled: in the title style, shrunk to fit",
    textStyle = PantrixTheme.typography.title,
    tagKey = "saved_iban"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("PX-2026-0914-TR-000187"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Contract number",
    supportingText = "Read-only: it can be selected and copied",
    textStyle = PantrixTheme.typography.title,
    tagKey = "contract_no"
)
```

### Its own colours and style

This field takes the filled text field's `FilledTextFieldColors` and `FilledTextFieldStyle`: the filled fields are restyled together.

The first field's fill, label, text, outline and caret are from the app's own purple; the fill with the focus was not given, and is the theme's surface colour. The second's box is fully round: `FilledTextFieldStyle(shape = ShapeRole.Full)`. `textStyle` is the style of the text, `style` that of the box.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("Summer 2026 Collection"),
    modifier = Modifier.fillMaxWidth(),
    label = "List name",
    textStyle = PantrixTheme.typography.title,
    colors = FilledTextFieldColors(
        container = own.container,
        focusedOutline = own.color,
        text = own.onContainer,
        label = own.onContainer,
        cursor = own.color
    ),
    tagKey = "own_colors"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("KP-48213"),
    modifier = Modifier.fillMaxWidth(),
    label = "Coupon",
    textStyle = PantrixTheme.typography.title,
    style = FilledTextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixFilledAutoResizeTextField

`import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledAutoResizeTextField(
    state: TextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    textStyle: TextStyle? = null,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
    lineLimits: TextFieldLineLimits = TextFieldLineLimits.SingleLine,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field whose label is inside its box and whose text gets smaller to stay in view: an amount, a card's number, a short note, anything that is read whole, in the filled box of `PantrixFilledTextField`.

The text is as large as its style says while it fits. A text too long for the box is set in a smaller size, as small as it takes to fit, and grows back as it is shortened. The box does not grow wider with its text: its width is its style's least or the one its caller gave it. At `minFontSize` the text stops shrinking and scrolls, as the text of any field does.

The field holds one line unless told: a line that is fitted to the box's width, in a box that keeps its height. With `lineLimits` of several lines the text wraps, and the box grows with it from the least of its lines to the most, as a filled text field's does. From there the box keeps its height and the text is set smaller, its lines as much closer, so that all of it stays in the box.

A height the field is given comes before its lines. The box fills what the supporting text leaves of it, and the text is fitted to that: it is set smaller where the height holds fewer lines than the field may take, and keeps its size for as many lines as a taller one holds. One line is set smaller in a box too low for it.

What is fitted is the text as it is shown: after an output transformation, and with what the keyboard is still composing. It is the text's size that changes, and nothing is drawn smaller than it is laid out: the caret, a selection and its handles are those of the size the text is in, and that size is what a test reads from the text's layout. The placeholder is set in the text's size, and in a smaller one where it is too long. A box whose size changes has its text fitted again a frame later. A text that is too long for its box when the field is first shown is drawn a frame later too, fitted, and is never seen in a size too large.

The label rests where the text will be, in the body's size whatever the text's own, and moves up to its own line above the text when the field takes the focus or holds a text. The box is filled and has no outline at rest, and is outlined with the focus and in error. It is that filled box around the text that `PantrixAutoResizeTextField` shrinks, and takes the filled text field's `style` and `colors`: the filled fields are restyled together, and the two fields that shrink their text can stand in for each other. It is built on a `TextFieldState`, and has an overload that takes a `value` and an `onValueChange`, and one for a form's field.

Parameters:

- `state: TextFieldState`: the text and the selection. Create it with `rememberTextFieldState()`, and read what was typed from it: `state.text` where the text is used, or `snapshotFlow { state.text.toString() }` to follow it as it changes.
- `modifier: Modifier`: the modifier of the whole field: its box and what is under it. `fillMaxWidth()` makes the box as wide as its parent, and a height is one the text is fitted to as it is to the width.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn without its fill in the disabled colours, and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader. Without one the text stands in the middle of the box, and the `placeholder` shows whenever the field is empty.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way: while it has the focus, or always where it has no label. It is set in the text's style, without the weight a filled field adds to what is typed.
- `supportingText: String?`: help under the box, in a smaller type. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the box is outlined in the danger role's colour, the supporting text and the caret turn to it, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text, in the secondary text colour. A slot does not size what is put in it: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` is the platform's size.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button: a currency's sign after an amount.
- `showClearButton: Boolean`: shows a button that empties the field, while the field can be typed into and is not empty. It leaves the caret in the field, and is no stop for Tab.
- `maxLength: Int?`: the most characters the user can enter, counted as `String.length` counts them. An edit that would pass the limit is turned down whole. Text set in code is not cut, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textStyle: TextStyle?`: the style of the text at its largest: a role of the theme's typography, such as `PantrixTheme.typography.title` for an amount. What it leaves unset is the body's in the medium weight, which is what a filled field's text is set in without it. A box too short for the style grows to hold its label and a line of it.
- `minFontSize: TextUnit`: the smallest the text gets: a size in sp, or one in em, which is a share of the style's own. It is the theme's footnote size unless told. A text that does not fit at this size scrolls, and at the style's own size or above it the text never shrinks.
- `lineLimits: TextFieldLineLimits`: one line, or `TextFieldLineLimits.MultiLine`, in which the text wraps and Enter starts a new line. The box is as tall as its lines are at the text's largest size: it grows from `minHeightInLines` to `maxHeightInLines`, and past the most of them the text is set smaller. With no most lines the box grows with its text for as long as it may, and the text is set smaller only where the field is given a height. Tab moves the focus on from either.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, for the action `keyboardOptions` names. Null keeps what the platform does.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it. With `maxLength`, it comes first and the limit applies to what it lets through.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it: an amount's separators. The text is fitted as it is shown.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in: `ContentType.CreditCardNumber` and the like.
- `style: FilledTextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FilledTextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field has no fill and is drawn in the theme's disabled text colour whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`. A `placeholder` that says the same is then left to the eye.
- `tagKey: String?`: the field's automation key: the field is `FilledAutoResizeTextField_<tagKey>`, and its clear button `FilledAutoResizeTextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixFilledAutoResizeTextField

`import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledAutoResizeTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    textStyle: TextStyle? = null,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
    singleLine: Boolean = true,
    minLines: Int = 1,
    maxLines: Int = if (singleLine) 1 else Int.MAX_VALUE,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A filled text field whose text shrinks to fit, and whose text is a `String` its caller holds: `value` is what it shows, and `onValueChange` is asked for every change the user makes.

It looks, measures and shrinks its text as the field on a `TextFieldState` does, and underneath it is Foundation's text field of a value and a callback. The text the callback is given has to come back as `value` by the next frame, or the field shows the old text again and the caret jumps: keep the text in state that the callback writes at once, and take the `TextFieldState` overload when the text lives in a flow. What comes back may differ from what was asked for, which is how this overload filters: a change the callback does not take is not shown.

It speaks the vocabulary of the text field underneath: `singleLine`, `minLines` and `maxLines` for its lines.

Parameters:

- `value: String`: the text the field shows.
- `onValueChange: (String) -> Unit`: asked for each change the user makes, with the whole new text, and by the clear button with an empty one.
- `modifier: Modifier`: the modifier of the whole field: its box and what is under it.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way, in the text's size.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right.
- `error: Boolean`: whether the text is wrong: the box is outlined in the danger role's colour, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text. A slot does not size what is put in it.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that asks for an empty text, while the field can be typed into and is not empty.
- `maxLength: Int?`: the most characters the user can enter. An edit that would pass the limit is turned down whole, before `onValueChange` is asked. A `value` over the limit is shown as it is, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textStyle: TextStyle?`: the style of the text at its largest. What it leaves unset is the body's in the medium weight.
- `minFontSize: TextUnit`: the smallest the text gets, in sp or in em: the theme's footnote size unless told. A text that does not fit at this size scrolls.
- `singleLine: Boolean`: whether the field holds one line, which is fitted to the box's width. It does unless told. A line break in `value` is then shown as a space, and `value` keeps it.
- `minLines: Int`: the least lines the box is tall, in a field of several, counted at the text's largest size.
- `maxLines: Int`: the most lines the box grows to, in a field of several, before its text is set smaller.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `keyboardActions: KeyboardActions`: what the keyboard's action key does, for the action `keyboardOptions` names.
- `visualTransformation: VisualTransformation`: how the text is shown, without changing it: an amount's separators. The text is fitted as it is shown.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in.
- `style: FilledTextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FilledTextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field has no fill and is drawn in the theme's disabled text colour whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `FilledAutoResizeTextField_<tagKey>`, and its clear button `FilledAutoResizeTextFieldClear_<tagKey>`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.

### PantrixFilledAutoResizeTextField

`import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledAutoResizeTextField(
    field: FormField<String>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    textStyle: TextStyle? = null,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
    lineLimits: TextFieldLineLimits = TextFieldLineLimits.SingleLine,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A filled text field whose text shrinks to fit, bound to a form's field: its text, its error and its name come from `field`.

The field's value and the text on screen stay in step both ways: typing changes the field, and a change made to the field in code, such as a reset, replaces the text. When the focus leaves, the field is marked touched and checked, which is when an error first shows. While the field is in error its message takes the place of `supportingText`. The field's id is the automation key, `FilledAutoResizeTextField_<id>`, and the form can send the focus here when it is submitted with this field in error.

Parameters:

- `field: FormField<String>`: the field the text field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it. An action of `Next` or `Previous` moves the focus as it always does. A field of one line that names no action gets `ImeAction.Done`, since the default action never reaches a handler. A field of several lines is left alone: there Enter starts a new line. An `onKeyboardAction` of the caller's own takes the place of the submit.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way, in the text's size.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `maxLength: Int?`: the most characters the user can enter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textStyle: TextStyle?`: the style of the text at its largest. What it leaves unset is the body's in the medium weight.
- `minFontSize: TextUnit`: the smallest the text gets, in sp or in em: the theme's footnote size unless told.
- `lineLimits: TextFieldLineLimits`: one line, or `TextFieldLineLimits.MultiLine`, whose text is set smaller past the most of its lines. Tab moves the focus on from either.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, in place of the form's submit.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it. The text is fitted as it is shown.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in.
- `style: FilledTextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FilledTextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field has no fill and is drawn in the theme's disabled text colour whatever is given.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.

### FilledTextFieldStyle

`import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle`, from `com.pantrixui:components`

```kotlin
class FilledTextFieldStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val textRole: TypeRole? = null
) : PantrixStyle<FilledTextFieldStyle>
```

`PantrixFilledTextField`'s box: its shape, how tall and how wide it is at the least, the room around what it holds, its icons and its outline.

The box holds two lines between its paddings: the label's, in the footnote role, and the text's under it, in its `textRole`. `height` is a minimum: a field of several lines, or a large font scale, makes the box taller and never cuts the text. Each preset's `verticalPadding` leaves those two lines of its height, at every density, so a field of one line is exactly as tall as its style says.

An icon sits in a slot of `iconSize + 2 × iconPadding`, flush with the box's edge, and the label and the text beside a slot start `horizontalPadding − iconPadding` from it.

Parameters:

- `shape: ShapeSpec`: The box's shape. A fully round one, `ShapeRole.Full`, is a pill only while the field holds one line: a field of several lines takes `ShapeRole.Large` instead, since a capsule's curve runs into the first line of its text.
- `height: Dp`: The least the box is tall.
- `minWidth: Dp`: The least the box is wide, which keeps an empty field from growing as the user types into it.
- `horizontalPadding: Dp`: The room between the box's edge and its label and text, where no icon is.
- `verticalPadding: Dp`: The room above the label's line and below the last line of the text.
- `iconPadding: Dp`: The room around an icon in its slot.
- `iconSize: Dp`: The size an icon in a slot should take. A slot does not size what is put in it.
- `borderWidth: Dp`: How thick the outline is that the box takes with the focus, in error and under a pointer. At rest it has none.
- `textRole: TypeRole?`: The role of the type scale the text is typed in, the label rests in and the placeholder is set in: the body's, 16sp, on Android and iOS, as Material 3 types a field, and the label's, 14sp, on the desktop and the web, as a page under a pointer does.

### FilledTextFieldColors

`import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors`, from `com.pantrixui:components`

```kotlin
data class FilledTextFieldColors(
    public val container: Color = Color.Unspecified,
    public val focusedContainer: Color = Color.Unspecified,
    public val hoveredOutline: Color = Color.Unspecified,
    public val focusedOutline: Color = Color.Unspecified,
    public val error: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val label: Color = Color.Unspecified,
    public val placeholder: Color = Color.Unspecified,
    public val supportingText: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val cursor: Color = Color.Unspecified,
    public val scrollBar: Color = Color.Unspecified
)
```

What `PantrixFilledTextField` is painted with, for a field that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role. A product gives the colours it changes and no others:

```kotlin
PantrixFilledTextField(
    state = state,
    label = stringResource(Res.string.iban),
    colors = FilledTextFieldColors(focusedOutline = brand, cursor = brand)
)
```

They are the colours of an enabled field, read-only or not. A disabled one has no fill and is drawn in the theme's disabled text colour whatever is given here, so that a disabled field looks the same across a product.

Parameters:

- `container: Color`: The box's fill at rest. The theme's neutral container.
- `focusedContainer: Color`: The box's fill under an outline: with the focus, and in error. The theme's `surface`.
- `hoveredOutline: Color`: The outline under a pointer. The theme's `borderHover`.
- `focusedOutline: Color`: The outline while the field has the focus. The theme's `primary`.
- `error: Color`: What says the text is wrong: the outline, the message under the box, the caret, and the count once it is past its limit. The theme's `danger`.
- `text: Color`: The typed text. The theme's `textPrimary`.
- `label: Color`: The label, at rest in the text's place and on its own line above the text. The theme's `textSecondary`.
- `placeholder: Color`: The placeholder. The theme's `textSecondary`.
- `supportingText: Color`: The help under the box, and the count. The theme's `textSecondary`.
- `icon: Color`: What an icon in a slot is drawn in unless it sets a tint of its own, and the clear button's cross. The theme's `textSecondary`.
- `cursor: Color`: The caret, and with it the handles and the highlight of a selection. The theme's `primary`.
- `scrollBar: Color`: The bar that shows how far the text of a box of several lines is scrolled. The theme's `borderStrong`: it is a mark on the box's fill, and a box's soft edge would not be seen there.

### rememberFormState

`import com.pantrixui.components.elements.form.rememberFormState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberFormState(): FormState
```

A `FormState` kept across recompositions; it is not saved state. Declare its fields with `field`.

### FormState.field

`import com.pantrixui.components.elements.form.field`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> FormState.field(
    id: String,
    initial: T,
    vararg rules: Rule<T>
): FormField<T>
```

Declares a field.

Remembered by `id`, so the value survives recomposition but a genuinely different field — a different row of a dynamic list — gets its own state.

Parameters:

- `id: String`
- `initial: T`: the value the field starts with, and goes back to when it is reset.
- `vararg rules: Rule<T>`: the rules the value is checked against, in their order: the first one that fails gives the field's message.

### Rules

`import com.pantrixui.components.elements.form.Rules`, from `com.pantrixui:components`

```kotlin
object Rules
```

The rules that come up in nearly every form.

Members:

- `fun notBlank(message: String): Rule<String>`: For non-null text. Rejects whitespace-only input, which `isEmpty` would let through.

  `message`: what the field says while its text is blank.
- `fun <T : Any> required(message: String): Rule<T?>`: For nullable values — a select with nothing chosen, an unset date.

  `message`: what the field says while nothing is chosen.
- `fun mustBeTrue(message: String): Rule<Boolean>`: Consent checkboxes: "accept the terms" is not satisfied by merely having a value.

  `message`: what the field says while it is not ticked.
- `fun minLength(length: Int, message: String): Rule<String>`: At least `length` characters, not counting leading and trailing whitespace.

  `message`: what the field says while its text is shorter than `length`.
- `fun maxLength(length: Int, message: String): Rule<String>`: At most `length` characters, whitespace included.

  `message`: what the field says while its text is longer than `length`.
- `fun matches(pattern: Regex, message: String): Rule<String>`: The whole value matches `pattern`; matching part of it is not enough.

  `message`: what the field says while its text does not match `pattern`.
- `fun <T> satisfies(message: String, predicate: (T) -> Boolean): Rule<T>`: Escape hatch for rules that depend on something outside the field — a password confirmation, a date range, a server-side uniqueness check already performed.

  `message`: what the field says while `predicate` does not accept its value.

  `predicate`: whether a value is accepted.
