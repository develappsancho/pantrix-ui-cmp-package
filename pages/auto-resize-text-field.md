# Auto Resize Text Field

A text field whose text gets smaller to stay in view: an amount, a card number, a short note; anything that is read whole. The text is as large as its style says while it fits the box; when it does not, it gets as small as it takes to fit, and it grows back as it is deleted. The box does not grow wider with its text.

Its label, its box and its supporting text are those of `PantrixTextField`, and it takes that component's `style` and `colors`. It is built on a `TextFieldState`; it has an overload that takes a `value` and an `onValueChange`, and one that takes a form's field.

- `PantrixAutoResizeTextField` (`com.pantrixui.components.inputs.autoresizetextfield`, `com.pantrixui:components`): A text input whose text shrinks to fit its box and grows back as it is shortened, on one line or several, for an amount, a number or a note that is read whole, with a label, supporting and error text, icons, a clear button, a character count and form binding. Keywords: autosize input, shrink to fit, amount input, price input, fit text.

## Features

- **A box that does not change.** The box's width is its style's least width or the one its caller gave it; a text that grows longer does not widen it, but gets as small as it takes to fit.
- **The largest size.** `textStyle` is the style of the text at its largest: a role of the theme's typography, such as `headline` for an amount. It is `body` unless given. A box too short for the style grows to hold a line of it.
- **The smallest size.** `minFontSize` is the smallest the text gets: a size in sp, or one in em, which is a share of the style's size. It is the theme's `footnote` size unless given. A text that still does not fit at that size scrolls, as the text of any field does.
- **Several lines.** With `lineLimits = TextFieldLineLimits.MultiLine(...)` the text wraps, and the box grows with it from the least of its lines to the most. From there the box keeps its height, and the text is set smaller, its line spacing with it.
- **A given height.** A height the field is given comes before its lines: the box fills it, and the text is fitted to that height.
- **What is fitted is the text as it is shown.** The thousands separators that an `outputTransformation` adds only for display count too, and so does what the keyboard is still composing. The placeholder is in the text's style, and where it is long it shrinks too.
- **It is the text's size that gets smaller.** Nothing is drawn smaller than it is: the caret, a selection and its handles are those of the size the text is in.
- **Three overloads.** In the one that takes a `state` the text is read from the state. The one that takes a `value` and an `onValueChange` keeps the text with its caller, and takes its lines as `singleLine`, `minLines` and `maxLines`. The one that takes a `field` is bound to a form's field.
- **What comes from the text field.** `label`, `placeholder`, `supportingText`, `error`, the icons, `showClearButton`, `maxLength`, the keyboard and the transformations are as they are in the text field.
- **Automation.** With `tagKey` the field is named `AutoResizeTextField_<tagKey>`, and its clear button `AutoResizeTextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.

## Usage

### An amount, read when it is used

```kotlin
val amount = rememberTextFieldState()
PantrixAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.amount),
    placeholder = "0",
    trailingIcon = { PantrixText(text = "TL") },
    textStyle = PantrixTheme.typography.headline,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
    tagKey = "amount"
)
PantrixButton(text = stringResource(Res.string.send), onClick = { onSend(amount.text.toString()) })
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val amount = rememberTextFieldState(initial.amount)
LaunchedEffect(amount) {
    snapshotFlow { amount.text.toString() }.collectLatest { viewModel.updateAmount(it) }
}
PantrixAutoResizeTextField(
    state = amount,
    label = stringResource(Res.string.amount),
    textStyle = PantrixTheme.typography.title,
    tagKey = "amount"
)
```

### Held as a String, digits only

```kotlin
var amount by rememberSaveable { mutableStateOf("") }
PantrixAutoResizeTextField(
    value = amount,
    onValueChange = { if (it.all(Char::isDigit)) amount = it },
    label = stringResource(Res.string.amount),
    textStyle = PantrixTheme.typography.headline,
    minFontSize = 14.sp,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "amount"
)
```

### A note in a box of three lines

```kotlin
val note = rememberTextFieldState()
PantrixAutoResizeTextField(
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
PantrixAutoResizeTextField(
    field = form.field("iban", initial = "", Rules.notBlank(stringResource(Res.string.iban_required))),
    form = form,
    label = stringResource(Res.string.iban),
    showClearButton = true
)
```

## Examples

### At its plainest

The least it takes: a `TextFieldState` and a label. The field is given no width: the box has its style's least width, and does not grow wider with its text. The address is too long for that box, so it is drawn in a smaller size.

Keep typing: the text shrinks down to its smallest size, the theme's `footnote` size; there it stops shrinking and scrolls, as the text of any field does. Delete: the text grows back, but not past its style's size, here `body`.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField

PantrixAutoResizeTextField(
    state = rememberTextFieldState("Atatürk Bulvarı No: 125, Daire 14, Çankaya"),
    label = "Address",
    tagKey = "plain_address"
)
```

### An amount set large

The amount of a money transfer, in the theme's largest style: `textStyle = PantrixTheme.typography.display`. A few digits fill the box; with the ones that follow, the digits get as small as it takes to fit, and the box keeps both its width and its height. The box is tall enough to hold a line of this style.

Its keyboard is the decimal one, an input transformation turns down what is not an amount, and an output transformation puts in the dots between the thousands only for display. What is fitted is the text as it is drawn: the dots count too.

The text is read from the state at the moment it is used: `amount.text` when the button is pressed. What is read is the text that was typed; the dots added for display are no part of it.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.OutputTransformation
import androidx.compose.foundation.text.input.insert
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val amount = rememberTextFieldState()
PantrixAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = "Amount",
    placeholder = "0",
    supportingText = "Shrinks as you type, grows back as you delete",
    trailingIcon = { PantrixText(text = "TL") },
    showClearButton = true,
    textStyle = PantrixTheme.typography.display,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
    inputTransformation = AnAmount,
    outputTransformation = GroupedInThousands,
    tagKey = "transfer_amount"
)
PantrixButton(
    text = "Send",
    onClick = {
        val entered = amount.text.toString()
        val message = if (entered.isEmpty()) "Enter an amount" else "$entered TL will be sent"
        scope.launch { snackbars?.show(message = message, tagKey = "amount_read") }
    },
    tagKey = "send_amount"
)

private val AnAmount = InputTransformation {
    val typed = asCharSequence().toString()
    val amount = typed.replace('.', ',')
    when {
        !AMOUNT.matches(amount) -> revertAllChanges()
        amount != typed -> replace(0, length, amount)
    }
}

private val AMOUNT = Regex("""\d{0,12}(,\d{0,2})?""")

private val GroupedInThousands = OutputTransformation {
    val whole = asCharSequence().indexOf(',').let { comma -> if (comma < 0) length else comma }
    // From right to left: each dot added later lies to the left of those added before it, and does not shift them.
    var at = whole - 3
    while (at > 0) {
        insert(at, ".")
        at -= 3
    }
}
```

### The smallest size

All three fields hold the same address in the `title` style. The address fits none of their boxes, so each is down to its own smallest size. The first is given no `minFontSize`: the text shrinks down to the theme's `footnote` size. In the second the smallest size is 14 sp. In the third it is given in em: `0.8.em`, eight tenths of the style's own size.

A text that still does not fit at its smallest size stops shrinking and scrolls, as the text of any field does. With a `minFontSize` at the style's own size or above it, the text never shrinks.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val address = "Atatürk Bulvarı No: 125, Daire 14, Kızılay Mahallesi, Çankaya, Ankara"
PantrixAutoResizeTextField(
    state = rememberTextFieldState(address),
    label = "Not given: footnote size",
    textStyle = PantrixTheme.typography.title,
    tagKey = "smallest_default"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState(address),
    label = "Smallest 14 sp",
    textStyle = PantrixTheme.typography.title,
    minFontSize = 14.sp,
    tagKey = "smallest_sp"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState(address),
    label = "Smallest 0.8 em",
    textStyle = PantrixTheme.typography.title,
    minFontSize = 0.8.em,
    tagKey = "smallest_em"
)
```

### A field whose text is held as a String

A card number of sixteen digits. The caller holds the number as a `String`: the field shows it and asks for every change, and since a change that is not all digits is not taken, it is not shown either. The supporting text is made from that `String`. This overload takes its lines as `singleLine`, `minLines` and `maxLines`.

The text is in the `title` style, and shrinks in a box it does not fit. Its smallest size is the label size (`minFontSize = PantrixTheme.typography.label.fontSize`): the number is never set smaller than that. The placeholder is in the text's style too.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

var number by rememberSaveable { mutableStateOf("") }
val missing = 16 - number.length
PantrixAutoResizeTextField(
    value = number,
    onValueChange = { if (it.all(Char::isDigit)) number = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Card number",
    placeholder = "0000000000000000",
    supportingText = if (missing == 0) "Number complete" else "Digits to go: $missing",
    maxLength = 16,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.title,
    minFontSize = PantrixTheme.typography.label.fontSize,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    contentType = ContentType.CreditCardNumber,
    tagKey = "card_number"
)
```

### An IBAN bound to a form

The overload that takes a `field` gets its value, its error and its name from its field in the form: if the focus leaves while the IBAN is incomplete, the rule's message takes the place of the supporting text. In a field that is given `form`, the keyboard's action key submits the form through the "Save IBAN" button. The text of a field bound to a form is the value of the form's field: it does not have to be read separately.

Twenty-six characters in the `callout` style do not fit a narrow box: the text shrinks, and the whole IBAN stays in view.

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
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixAutoResizeTextField(
    field = form.field("iban", initial = "", Rules.matches(IBAN, "Enter a 26-character IBAN that starts with TR")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "IBAN",
    placeholder = "TR000000000000000000000000",
    supportingText = "Long as it is, all of it stays in view",
    showClearButton = true,
    maxLength = 26,
    textStyle = PantrixTheme.typography.callout,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters)
)
PantrixButton(
    text = "Save IBAN",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "IBAN saved", tagKey = "iban_saved") } }
    },
    form = form,
    tagKey = "save_iban"
)

private val IBAN = Regex("""TR\d{24}""")
```

### A note of several lines

With `lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 2, maxHeightInLines = 4)` the text wraps: the box is two lines tall, and grows with the text to four lines. Once the note passes four lines the box stays as it is, and the text gets as small as it takes to fit, its line spacing with it. Enter starts a new line.

The text is read from the state at the moment it is used: `note.text` when the button is pressed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val note = rememberTextFieldState()
PantrixAutoResizeTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = "Note for the courier",
    placeholder = "Don't ring the bell, leave it at the door",
    supportingText = "Grows to four lines, then the text shrinks",
    showClearButton = true,
    maxLength = 280,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 2, maxHeightInLines = 4),
    tagKey = "courier_note"
)
PantrixButton(
    text = "Save note",
    onClick = {
        val written = note.text.toString()
        val message = if (written.isBlank()) "Write a note" else "Note saved. Characters: ${written.length}"
        scope.launch { snackbars?.show(message = message, tagKey = "note_saved") }
    },
    tagKey = "save_note"
)
```

### A field given a height

A message written on a gift card, in a field that is given a height: `Modifier.height(180.dp)`. The height is the whole field's: the box fills what the label and the supporting text leave of it, and is just as tall while the message is short. The text starts in the `title` style; when it does not fit the box it goes down to the largest size in which all of it is in view, and it grows back as it is deleted.

No line limit is given (`TextFieldLineLimits.MultiLine()`): the room the text is fitted to is the field's height.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixAutoResizeTextField(
    state = rememberTextFieldState(CARD_MESSAGE),
    modifier = Modifier.fillMaxWidth().height(180.dp),
    label = "Card message",
    supportingText = "The field's height is fixed: the text shrinks to fit",
    showClearButton = true,
    maxLength = 280,
    textStyle = PantrixTheme.typography.title,
    lineLimits = TextFieldLineLimits.MultiLine(),
    tagKey = "card_message"
)

private const val CARD_MESSAGE = "Happy birthday! May the year ahead bring you health, happiness and plenty of joy. " +
    "Here's to many more good years together."
```

### Supporting text and error

`supportingText` stands under the box. `error = true` turns the border, the label, the supporting text and the caret to the `danger` role, and the message is announced to a screen reader as an error. The field starts in error: 75.000 is over the daily limit. Delete a digit: the error goes.

It is the caller that works out the error, not the field; here by reading `amount.text`. What is read is the digits that were typed: the dots between the thousands are only drawn.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.OutputTransformation
import androidx.compose.foundation.text.input.insert
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val amount = rememberTextFieldState("75000")
val typed = amount.text.toString().toLongOrNull() ?: 0L
val overLimit = typed > 50_000
PantrixAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = "Amount to withdraw",
    supportingText = if (overLimit) "Over the daily limit: 50.000 TL at most" else "Daily limit 50.000 TL",
    error = overLimit,
    trailingIcon = { PantrixText(text = "TL") },
    showClearButton = true,
    maxLength = 9,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.headline,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    inputTransformation = DigitsOnly,
    outputTransformation = GroupedInThousands,
    tagKey = "withdrawal"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}

private val GroupedInThousands = OutputTransformation {
    val whole = asCharSequence().indexOf(',').let { comma -> if (comma < 0) length else comma }
    // From right to left: each dot added later lies to the left of those added before it, and does not shift them.
    var at = whole - 3
    while (at > 0) {
        insert(at, ".")
        at -= 3
    }
}
```

### Read-only and disabled

A field with `readOnly = true` cannot be changed, but it can be focused, and its text selected and copied. The balance is in the `headline` style and is shown with the dots between its thousands; in a box it does not fit, it shrinks as it does in a field that can be typed into.

A field with `enabled = false` is drawn in the theme's disabled colours and takes no focus. Its text is still fitted to its box.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.OutputTransformation
import androidx.compose.foundation.text.input.insert
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixAutoResizeTextField(
    state = rememberTextFieldState("125000000000000,00"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Balance",
    supportingText = "Read-only: in the headline style, shrunk to fit",
    trailingIcon = { PantrixText(text = "TL") },
    textStyle = PantrixTheme.typography.headline,
    outputTransformation = GroupedInThousands,
    tagKey = "balance"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState("4543 60** **** 0719"),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Saved card",
    supportingText = "Disabled: cannot be changed for this payment",
    textStyle = PantrixTheme.typography.title,
    tagKey = "saved_card"
)

private val GroupedInThousands = OutputTransformation {
    val whole = asCharSequence().indexOf(',').let { comma -> if (comma < 0) length else comma }
    // From right to left: each dot added later lies to the left of those added before it, and does not shift them.
    var at = whole - 3
    while (at > 0) {
        insert(at, ".")
        at -= 3
    }
}
```

### Its own colours and style

This field has no style or colour class of its own: it takes the `TextFieldColors` and the `TextFieldStyle` of `PantrixTextField`. A product that restyles its text fields restyles this one with them.

In the first field the text, the focused border and the caret are the app's own purple. The second field's box is fully round: `TextFieldStyle(shape = ShapeRole.Full)`. `textStyle` and `style` are two different things: the first is the text's style, the second the box's.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixAutoResizeTextField(
    state = rememberTextFieldState("2026 Spring Campaign"),
    modifier = Modifier.fillMaxWidth(),
    label = "Campaign name",
    textStyle = PantrixTheme.typography.title,
    colors = TextFieldColors(focusedBorder = own.color, text = own.color, cursor = own.color),
    tagKey = "own_colors"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState("PX-2026-0914"),
    modifier = Modifier.fillMaxWidth(),
    label = "Tracking number",
    textStyle = PantrixTheme.typography.title,
    style = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixAutoResizeTextField

`import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAutoResizeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field whose text gets smaller to stay in view: an amount, a card's number, a short note, anything that is read whole.

The text is as large as its style says while it fits. A text too long for the box is set in a smaller size, as small as it takes to fit, and grows back as it is shortened. The box does not grow wider with its text: its width is its style's least or the one its caller gave it. At `minFontSize` the text stops shrinking and scrolls, as the text of any field does.

The field holds one line unless told: a line that is fitted to the box's width, in a box that keeps its height. With `lineLimits` of several lines the text wraps, and the box grows with it from the least of its lines to the most, as a text field's does. From there the box keeps its height and the text is set smaller, its lines as much closer, so that all of it stays in the box.

A height the field is given comes before its lines. The box fills what the label and the supporting text leave of it, and the text is fitted to that: it is set smaller where the height holds fewer lines than the field may take, and keeps its size for as many lines as a taller one holds. One line is set smaller in a box too low for it.

What is fitted is the text as it is shown: after an output transformation, and with what the keyboard is still composing. It is the text's size that changes, and nothing is drawn smaller than it is laid out: the caret, a selection and its handles are those of the size the text is in, and that size is what a test reads from the text's layout. The placeholder is set as the text would be, in a smaller size where it is too long. A box whose size changes has its text fitted again a frame later. A text that is too long for its box when the field is first shown is drawn a frame later too, fitted, and is never seen in a size too large.

It is the label, the box and the supporting text of `PantrixTextField`, and takes that component's `style` and `colors`: a product that restyles its text fields restyles this one with them. It is built on a `TextFieldState`, and has an overload that takes a `value` and an `onValueChange`, and one for a form's field.

Parameters:

- `state: TextFieldState`: the text and the selection. Create it with `rememberTextFieldState()`, and read what was typed from it: `state.text` where the text is used, or `snapshotFlow { state.text.toString() }` to follow it as it changes.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it. `fillMaxWidth()` makes the box as wide as its parent, and a height is one the text is fitted to as it is to the width.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn in the disabled colours and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty, in the text's own style.
- `supportingText: String?`: help under the box, in a smaller type. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the border, the label, the supporting text and the caret turn to the danger role, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text, in the secondary text colour. A slot does not size what is put in it: `PantrixIcon(size = PantrixTheme.style(TextFieldStyle).iconSize)` is the platform's size.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button: a currency's sign after an amount.
- `showClearButton: Boolean`: shows a button that empties the field, while the field can be typed into and is not empty. It leaves the caret in the field, and is no stop for Tab.
- `maxLength: Int?`: the most characters the user can enter, counted as `String.length` counts them. An edit that would pass the limit is turned down whole. Text set in code is not cut, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textStyle: TextStyle?`: the style of the text at its largest: a role of the theme's typography, such as `PantrixTheme.typography.headline` for an amount. What it leaves unset is the body's, which is what the text is set in without it. A box too short for the style grows to hold a line of it.
- `minFontSize: TextUnit`: the smallest the text gets: a size in sp, or one in em, which is a share of the style's own. It is the theme's footnote size unless told. A text that does not fit at this size scrolls, and at the style's own size or above it the text never shrinks.
- `lineLimits: TextFieldLineLimits`: one line, or `TextFieldLineLimits.MultiLine`, in which the text wraps and Enter starts a new line. The box is as tall as its lines are at the text's largest size: it grows from `minHeightInLines` to `maxHeightInLines`, and past the most of them the text is set smaller. With no most lines the box grows with its text for as long as it may, and the text is set smaller only where the field is given a height. Tab moves the focus on from either.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, for the action `keyboardOptions` names. Null keeps what the platform does: `Next` moves the focus on, and `Done` closes the keyboard.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it. With `maxLength`, it comes first and the limit applies to what it lets through.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it: an amount's separators. The text is fitted as it is shown.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in: `ContentType.CreditCardNumber` and the like.
- `style: TextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`. A `placeholder` that says the same is then left to the eye.
- `tagKey: String?`: the field's automation key: the field is `AutoResizeTextField_<tagKey>`, and its clear button `AutoResizeTextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixAutoResizeTextField

`import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAutoResizeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field whose text shrinks to fit, and whose text is a `String` its caller holds: `value` is what it shows, and `onValueChange` is asked for every change the user makes.

It looks, measures and shrinks its text as the field on a `TextFieldState` does, and underneath it is Foundation's text field of a value and a callback. The text the callback is given has to come back as `value` by the next frame, or the field shows the old text again and the caret jumps: keep the text in state that the callback writes at once, and take the `TextFieldState` overload when the text lives in a flow. What comes back may differ from what was asked for, which is how this overload filters: a change the callback does not take is not shown.

It speaks the vocabulary of the text field underneath: `singleLine`, `minLines` and `maxLines` for its lines.

Parameters:

- `value: String`: the text the field shows.
- `onValueChange: (String) -> Unit`: asked for each change the user makes, with the whole new text, and by the clear button with an empty one.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty, in the text's own style.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right.
- `error: Boolean`: whether the text is wrong: the border, the label, the supporting text and the caret turn to the danger role, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text. A slot does not size what is put in it.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that asks for an empty text, while the field can be typed into and is not empty.
- `maxLength: Int?`: the most characters the user can enter. An edit that would pass the limit is turned down whole, before `onValueChange` is asked. A `value` over the limit is shown as it is, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textStyle: TextStyle?`: the style of the text at its largest. What it leaves unset is the body's.
- `minFontSize: TextUnit`: the smallest the text gets, in sp or in em: the theme's footnote size unless told. A text that does not fit at this size scrolls.
- `singleLine: Boolean`: whether the field holds one line, which is fitted to the box's width. It does unless told. A line break in `value` is then shown as a space, and `value` keeps it.
- `minLines: Int`: the least lines the box is tall, in a field of several, counted at the text's largest size.
- `maxLines: Int`: the most lines the box grows to, in a field of several, before its text is set smaller.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `keyboardActions: KeyboardActions`: what the keyboard's action key does, for the action `keyboardOptions` names.
- `visualTransformation: VisualTransformation`: how the text is shown, without changing it: an amount's separators. The text is fitted as it is shown.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in.
- `style: TextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `AutoResizeTextField_<tagKey>`, and its clear button `AutoResizeTextFieldClear_<tagKey>`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.

### PantrixAutoResizeTextField

`import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAutoResizeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field whose text shrinks to fit, bound to a form's field: its text, its error and its name come from `field`.

The field's value and the text on screen stay in step both ways: typing changes the field, and a change made to the field in code, such as a reset, replaces the text. When the focus leaves, the field is marked touched and checked, which is when an error first shows. While the field is in error its message takes the place of `supportingText`. The field's id is the automation key, `AutoResizeTextField_<id>`, and the form can send the focus here when it is submitted with this field in error.

Parameters:

- `field: FormField<String>`: the field the text field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it. An action of `Next` or `Previous` moves the focus as it always does. A field of one line that names no action gets `ImeAction.Done`, since the default action never reaches a handler. A field of several lines is left alone: there Enter starts a new line. An `onKeyboardAction` of the caller's own takes the place of the submit.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty, in the text's own style.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `maxLength: Int?`: the most characters the user can enter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textStyle: TextStyle?`: the style of the text at its largest. What it leaves unset is the body's.
- `minFontSize: TextUnit`: the smallest the text gets, in sp or in em: the theme's footnote size unless told.
- `lineLimits: TextFieldLineLimits`: one line, or `TextFieldLineLimits.MultiLine`, whose text is set smaller past the most of its lines. Tab moves the focus on from either.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, in place of the form's submit.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it. The text is fitted as it is shown.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in.
- `style: TextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.

### TextFieldStyle

`import com.pantrixui.components.inputs.textfield.TextFieldStyle`, from `com.pantrixui:components`

```kotlin
class TextFieldStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val focusedBorderWidth: Dp = Dp.Unspecified,
    public val textRole: TypeRole? = null
) : PantrixStyle<TextFieldStyle>
```

`PantrixTextField`'s box: its shape, how tall and how wide it is at the least, the room around its text, its icons and its border.

`height` is the box alone. The label sits above the box and not inside it, so one height serves a field with a label and one without. It is a minimum: a field of several lines, or a large font scale, makes the box taller and never cuts the text. Each preset's `verticalPadding` leaves at least the body's line of its height, at every density, so a field of one line is exactly as tall as its style says.

An icon sits in a slot of `iconSize + 2 × iconPadding`, flush with the box's edge, and the text beside a slot starts `horizontalPadding − iconPadding` from it. On Android that is a 44dp slot with the icon 10dp from the edge and the text 48dp from it.

The box has the medium step of the shape scale for its corners on every platform.

Parameters:

- `shape: ShapeSpec`: The box's shape. A fully round one, `ShapeRole.Full`, is a pill only while the field holds one line: a field of several lines takes `ShapeRole.Large` instead, since a capsule's curve runs into the first line of its text.
- `height: Dp`: The least the box is tall.
- `minWidth: Dp`: The least the box is wide, which keeps an empty field from growing as the user types into it.
- `horizontalPadding: Dp`: The room between the box's edge and its text, where no icon is.
- `verticalPadding: Dp`: The room above the first line of the text and below the last.
- `iconPadding: Dp`: The room around an icon in its slot.
- `iconSize: Dp`: The size an icon in a slot should take. A slot does not size what is put in it.
- `borderWidth: Dp`: How thick the box's border is.
- `focusedBorderWidth: Dp`: How thick the border is while the field has the focus: the border is what shows it.
- `textRole: TypeRole?`: The role of the type scale the text is typed in, and its placeholder set in: the body's, 16sp, on Android and iOS, as Material 3 and iOS type a field, and the label's, 14sp, on the desktop and the web, as a page under a pointer does. A select's box and the fields made on this style take it as well.

### TextFieldColors

`import com.pantrixui.components.inputs.textfield.TextFieldColors`, from `com.pantrixui:components`

```kotlin
data class TextFieldColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val hoveredBorder: Color = Color.Unspecified,
    public val focusedBorder: Color = Color.Unspecified,
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

What `PantrixTextField` is painted with, for a field that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role. A product gives the colours it changes and no others:

```kotlin
PantrixTextField(
    state = state,
    label = stringResource(Res.string.email),
    colors = TextFieldColors(focusedBorder = brand, cursor = brand)
)
```

They are the colours of an enabled field, read-only or not. A disabled one is drawn in the theme's disabled roles whatever is given here, so that a disabled field looks the same across a product.

Parameters:

- `container: Color`: The box's fill. The theme's `surface`.
- `border: Color`: The box's border at rest. The theme's `border`.
- `hoveredBorder: Color`: The border under a pointer. The theme's `borderHover`, a notch stronger than `border`.
- `focusedBorder: Color`: The border while the field has the focus. The theme's `primary`.
- `error: Color`: What says the text is wrong: the border, the label, the message under the box, the caret, and the count once it is past its limit. The theme's `danger`.
- `text: Color`: The typed text. The theme's `textPrimary`.
- `label: Color`: The label above the box. Left out, it is drawn as any text is where the field stands, since it is outside the box on whatever the field is put on: in `textPrimary` on the theme's own ground, and in the content colour of a fill.
- `placeholder: Color`: The placeholder. The theme's `textSecondary`.
- `supportingText: Color`: The help under the box, and the count. The theme's `textSecondary`.
- `icon: Color`: What an icon in a slot is drawn in unless it sets a tint of its own, and the clear button's cross. The theme's `textSecondary`.
- `cursor: Color`: The caret, and with it the handles and the highlight of a selection. The theme's `primary`.
- `scrollBar: Color`: The bar that shows how far the text of a box of several lines is scrolled. The theme's `borderStrong`: it is a mark beside the text, and the box's soft edge would not be seen there.

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
