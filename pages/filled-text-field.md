# Filled Text Field

A text field whose label is inside its box. The label rests in the text's place while the field is empty and without the focus; it moves up to its own line above the text when the field takes the focus or something is typed. The box is filled and has no outline at rest; it is outlined in the `primary` colour with the focus, and in the `danger` colour in error.

Underneath it is `PantrixTextField`'s text field, with another decoration around it: the two take the same things and can stand in for each other. It is built on a `TextFieldState`, and has an overload that takes a `value` and an `onValueChange`, and one that takes a form's field.

- `PantrixFilledTextField` (`com.pantrixui.components.inputs.filledtextfield`, `com.pantrixui:components`): A text input whose label is inside a filled box and moves up when the field has the focus or a text, of one line or several, with supporting and error text, icons, a clear button, a character count and form binding. Keywords: filled input, floating label, edit text, text box, form field.

## Features

- **The label inside the box.** At rest `label` is in the text's place and in the text's size; with the focus, or while there is a text, it shrinks and moves up to its own line. In a field with no label the text stands in the middle of the box.
- **Placeholder.** `placeholder` shows while the label is out of its place: while the field is empty and has the focus. In a field with no label it shows whenever the field is empty.
- **Fill and outline.** At rest the box is filled and has no outline. With the focus and in error the fill turns to the surface's colour and the box is outlined; it takes an outline under a pointer too. A disabled field has no fill.
- **Supporting text and error.** `supportingText` is written under the box. `error` turns the outline, the supporting text and the caret to the `danger` role, and a screen reader is told; the label keeps its own colour.
- **Several lines.** With `lineLimits = TextFieldLineLimits.MultiLine(...)` the box is as tall as its least lines, grows to its most, and from there scrolls its text inside it: the bar at its end shows how far.
- **Icons, clear button, count.** `leadingIcon` stands before the label and the text, and `trailingIcon` after them. `showClearButton` shows the button that empties the field; `maxLength` limits the length and writes the count.
- **Keyboard and transformations.** `keyboardOptions`, `onKeyboardAction`, `inputTransformation`, `outputTransformation` and `contentType` are the same as the text field's.
- **Three overloads.** In the one that takes `state` the text is read from the state. The one that takes `value` and `onValueChange` keeps the text with its caller; it has no scroll bar. The one that takes `field` takes its value, its error and its name from its field in the form.
- **Style and colours.** `style` (`FilledTextFieldStyle`) changes the box's shape and dimensions, and `colors` (`FilledTextFieldColors`) its colours: only the fields that are set. A disabled field has no fill and is in the theme's disabled text colour whatever is given.
- **Text size.** What is typed, the resting label and the placeholder are set in the style's `textRole`: `body` (16sp) on Android and iOS, `label` (14sp) on the desktop and the web.
- **Automation.** With `tagKey` the field is named `FilledTextField_<tagKey>`, and its clear button `FilledTextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.

## Usage

### A name

```kotlin
val name = rememberTextFieldState()
PantrixFilledTextField(
    state = name,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.name),
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words, imeAction = ImeAction.Next),
    tagKey = "name"
)
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val username = rememberTextFieldState(initial.username)
LaunchedEffect(username) {
    snapshotFlow { username.text.toString() }.collectLatest { viewModel.updateUsername(it) }
}
PantrixFilledTextField(
    state = username,
    label = stringResource(Res.string.username),
    tagKey = "username"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixFilledTextField(
    field = form.field("iban", initial = "", Rules.notBlank(stringResource(Res.string.iban_required))),
    form = form,
    label = stringResource(Res.string.iban),
    showClearButton = true
)
```

### Several lines that scroll

```kotlin
val note = rememberTextFieldState()
PantrixFilledTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.note),
    maxLength = 280,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3, maxHeightInLines = 3),
    tagKey = "note"
)
```

### In colours of its own

```kotlin
val info = PantrixTheme.colors.info
val reference = rememberTextFieldState()
PantrixFilledTextField(
    state = reference,
    label = stringResource(Res.string.reference),
    colors = FilledTextFieldColors(container = info.container, focusedOutline = info.color, cursor = info.color),
    tagKey = "reference"
)
```

## Examples

### At its plainest

The least it takes: a `TextFieldState` and a label. The label is inside the box: it rests in the text's place while the field is empty and without the focus. Press the field: the label moves up to its own line above the text and makes room for the text. If the focus leaves the field while it is empty, the label goes back to its place.

The typed text is read from the state: the line below shows `city.text` as it is typed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.theme.PantrixTheme

val city = rememberTextFieldState()
PantrixFilledTextField(
    state = city,
    modifier = Modifier.fillMaxWidth(),
    label = "City",
    tagKey = "city"
)
PantrixText(
    text = if (city.text.isEmpty()) "No city typed yet" else "Typed: ${city.text}",
    color = PantrixTheme.colors.textSecondary
)
```

### Label and placeholder

The first field is empty: the label rests in the text's place and the placeholder is not shown. Press the field: the label moves up, and the placeholder appears where the label was. A placeholder is not a label; it gives an example of what to type.

The second field holds a text, so its label is always up. The third has no label: the text stands in the middle of the box, the placeholder shows whenever the field is empty, and `contentDescription` tells a screen reader the field's name.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Website",
    placeholder = "https://example.com",
    tagKey = "website"
)
PantrixFilledTextField(
    state = rememberTextFieldState("Kadıköy"),
    modifier = Modifier.fillMaxWidth(),
    label = "District",
    tagKey = "district"
)
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Search neighbourhoods",
    contentDescription = "Search neighbourhoods",
    tagKey = "neighbourhood"
)
```

### Supporting text and error

`supportingText` stands under the box. `error = true` outlines the box in the `danger` colour; the supporting text and the caret turn to that colour too, and a screen reader announces the message as the error. The label keeps its own colour: the outline and the message are what show the error. The fill turns to the surface's colour, as it does with the focus.

The field starts in error. Delete the space: the outline loses the error's colour and the supporting text takes the place of the error message.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

val username = rememberTextFieldState("ayşe yılmaz")
val hasSpace = username.text.contains(' ')
PantrixFilledTextField(
    state = username,
    modifier = Modifier.fillMaxWidth(),
    label = "Username",
    supportingText = if (hasSpace) "A username cannot contain spaces" else "Appears in your profile's address",
    error = hasSpace,
    showClearButton = true,
    tagKey = "username"
)
```

### Icon, clear button and action key

`leadingIcon` stands before the label and the text. A slot does not size what is put in it; the icon takes the size in the filled field's style: `PantrixTheme.style(FilledTextFieldStyle).iconSize`. While the field is not empty, `showClearButton` shows the button that empties it: the button leaves the caret in the field, and is no stop for Tab.

`keyboardOptions` makes the keyboard's action key "Search"; `onKeyboardAction` is called when that key is pressed. Type something and press the keyboard's "Search" key or Enter: the app's snackbar says what was searched for.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val query = rememberTextFieldState()
PantrixFilledTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    label = "Search branches",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Search,
            contentDescription = null,
            size = PantrixTheme.style(FilledTextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
    onKeyboardAction = { scope.launch { snackbars?.show(message = "Branch searched for: ${query.text}") } },
    tagKey = "branch"
)
```

### Input and output transformations

`inputTransformation` turns an edit down whole if it holds anything that is not a digit; `maxLength = 4` applies to what it lets through. `outputTransformation` draws a slash between the month and the year: the slash is not part of the text.

Type "1228": the box shows "12/28", while `expiry.text`, which the line below reads, is four digits.

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
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.theme.PantrixTheme

val expiry = rememberTextFieldState()
PantrixFilledTextField(
    state = expiry,
    modifier = Modifier.fillMaxWidth(),
    label = "Expiry date",
    placeholder = "MM/YY",
    maxLength = 4,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    inputTransformation = DigitsOnly,
    outputTransformation = MonthSlashYear,
    contentType = ContentType.CreditCardExpirationDate,
    tagKey = "expiry"
)
PantrixText(text = "Text held: \"${expiry.text}\"", color = PantrixTheme.colors.textSecondary)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}

private val MonthSlashYear = OutputTransformation {
    if (length > 2) insert(2, "/")
}
```

### A money transfer form

A money transfer form, with the three overloads together. The first two fields are bound to the form: each takes its value, its error and its name from its field in the form; if the focus leaves one while it is empty, the rule's message shows under the box and the box is outlined in the error colour. The amount field holds its text as a `String` and turns down whatever is not a digit in `onValueChange`: an edit that is turned down is not shown. Its limit is seven digits; its count is hidden with `showCharacterCount = false`.

The note is three lines tall: a text that does not fit scrolls inside the box, and the bar at its end shows how far. Its text is in the state created with `rememberTextFieldState`, and is read from there when the form is sent: the notification reads it with `note.text`.

In the first three fields the keyboard's "Next" key moves the focus to the next field. Leave the fields empty and press "Send": the form is not sent, and the first field in error takes the focus.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
var amount by rememberSaveable { mutableStateOf("") }
val note = rememberTextFieldState()
PantrixFilledTextField(
    field = form.field("recipient", initial = "", Rules.notBlank("Enter the recipient's name")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Recipient's full name",
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words, imeAction = ImeAction.Next)
)
PantrixFilledTextField(
    field = form.field("iban", initial = "", Rules.notBlank("Enter the IBAN")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "IBAN",
    placeholder = "TR00 0000 0000 0000 0000 0000 00",
    showClearButton = true,
    keyboardOptions = KeyboardOptions(
        capitalization = KeyboardCapitalization.Characters,
        imeAction = ImeAction.Next
    )
)
PantrixFilledTextField(
    value = amount,
    onValueChange = { if (it.all(Char::isDigit)) amount = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Amount",
    placeholder = "0",
    supportingText = "Digits only",
    trailingIcon = { PantrixText(text = "TL") },
    maxLength = 7,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number, imeAction = ImeAction.Next),
    tagKey = "amount"
)
PantrixFilledTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = "Note",
    placeholder = "Rent, dues, debt…",
    maxLength = 140,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3, maxHeightInLines = 3),
    tagKey = "transfer_note"
)
PantrixButton(
    text = "Send",
    onClick = {
        scope.launch {
            form.submit {
                // The note is read from the state at the moment it is used.
                val sent = if (note.text.isBlank()) "Money sent" else "Money sent: ${note.text}"
                snackbars?.show(message = sent, tagKey = "transfer_sent")
            }
        }
    },
    form = form,
    tagKey = "send_transfer"
)
```

### A field given a height

A height given to the field is the whole field's: `Modifier.height(140.dp)`. The box takes what the supporting text under it leaves of that height; the label and the text stay inside the box, a text that does not fit scrolls there, and the bar at its end shows how far.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

PantrixFilledTextField(
    state = rememberTextFieldState(COMPLAINT),
    modifier = Modifier.fillMaxWidth().height(140.dp),
    label = "Your complaint",
    supportingText = "The field's height is fixed: the text scrolls inside the box",
    lineLimits = TextFieldLineLimits.MultiLine(),
    tagKey = "complaint"
)

private const val COMPLAINT = "The same payment was taken from my card twice.\n" +
    "The first was on the third of the month, the second on the fourth.\n" +
    "Both are for the same amount and from the same merchant.\n" +
    "I have both receipts.\n" +
    "I would like one of them refunded."
```

### Disabled and read-only

`enabled = false` takes the field's fill away: a disabled field is drawn in the theme's disabled text colour on the ground it stands on, takes no focus, and a screen reader is told that it is disabled. This is so whatever `colors` gives: a disabled field looks the same everywhere in an app.

With `readOnly = true` the field keeps its fill and its colours: it can be focused and its text selected and copied; it just cannot be changed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

PantrixFilledTextField(
    state = rememberTextFieldState("TL current account - 1042"),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Sending account",
    supportingText = "Cannot be changed in this transaction",
    tagKey = "account"
)
PantrixFilledTextField(
    state = rememberTextFieldState("TR33 0006 1005 1978 6457 8413 26"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Your IBAN",
    supportingText = "Read-only: it can be selected and copied",
    tagKey = "own_iban"
)
```

### Its own colours

The colours given with `colors` are used, and the ones left out stay the theme's roles. The first field takes its colours from the theme's `info` role. At rest the fill is the role's soft tone; the label, the text and the icon are in the colour that reads on that tone. With the focus and under a pointer the outline is the role's own colour. The fill with the focus, the placeholder, the supporting text and the error colour are not given: they stay as the theme has them.

The second field does the same with the app's own purple: a colour that is in none of the theme's roles. Press the field: the outline and the caret are purple, and with the focus the fill turns to the theme's surface colour.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.theme.PantrixTheme

val info = PantrixTheme.colors.info
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Referral code",
    placeholder = "PX-0000",
    supportingText = "The code of the person who invited you, if any",
    showClearButton = true,
    colors = FilledTextFieldColors(
        container = info.container,
        hoveredOutline = info.color,
        focusedOutline = info.color,
        text = info.onContainer,
        label = info.onContainer,
        icon = info.onContainer,
        cursor = info.color
    ),
    tagKey = "reference"
)
val own = ownColors()
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Promo code",
    colors = FilledTextFieldColors(
        container = own.container,
        hoveredOutline = own.color,
        focusedOutline = own.color,
        text = own.onContainer,
        label = own.onContainer,
        cursor = own.color
    ),
    tagKey = "own_colors"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Its own style

`style` is this call's own style: only the fields it sets change, and the rest comes from the theme's and the platform's style.

The first field's box is fully round: `FilledTextFieldStyle(shape = ShapeRole.Full)`. The second has small corners and, with `borderWidth = 2.dp`, a thick outline. The outline shows with the focus, in error and under a pointer; at rest the box has none.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.token.shape.ShapeRole

PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Fully round box",
    style = FilledTextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Small corners, thick outline",
    style = FilledTextFieldStyle(shape = ShapeRole.Small, borderWidth = 2.dp),
    tagKey = "small_corners"
)
```

## API

### PantrixFilledTextField

`import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledTextField(
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

A text field whose label is inside its box: the label rests where the text will be, and moves up to its own line above the text when the field takes the focus or holds a text.

The box is filled and has no outline at rest. With the focus it is outlined in the primary role's colour, and in error in the danger role's, on the surface's colour both times: the outline is what shows the focus and the error, and a message under the box says what to put right. A box that cannot be typed into has no fill at all.

It holds one line, or several in a box that scrolls its text and shows how far with a bar at its end.

It is the text field `PantrixTextField` is underneath, with another decoration around the text, and takes what that one takes: the two can stand in for each other. It is built on a `TextFieldState`, and has an overload that takes a `value` and an `onValueChange`, and one for a form's field.

Parameters:

- `state: TextFieldState`: the text and the selection. Create it with `rememberTextFieldState()`, and read what was typed from it: `state.text` where the text is used, or `snapshotFlow { state.text.toString() }` to follow it as it changes.
- `modifier: Modifier`: the modifier of the whole field: its box and what is under it. `fillMaxWidth()` makes the box as wide as its parent. A height is the whole field's as well: the box fills what the supporting text leaves of it, with one line in its middle and several from its top, and a text too long for the box scrolls in it.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn without its fill in the disabled colours, and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader. Without one the text stands in the middle of the box, and the `placeholder` shows whenever the field is empty.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way: while it has the focus, or always where it has no label.
- `supportingText: String?`: help under the box, in a smaller type. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the box is outlined in the danger role's colour, the supporting text and the caret turn to it, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text, in the secondary text colour. A slot does not size what is put in it: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` is the platform's size.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that empties the field, while the field can be typed into and is not empty. It leaves the caret in the field, and is no stop for Tab.
- `maxLength: Int?`: the most characters the user can enter, counted as `String.length` counts them. An edit that would pass the limit is turned down whole. Text set in code is not cut, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `lineLimits: TextFieldLineLimits`: one line, or `TextFieldLineLimits.MultiLine`: the box is as tall as its least lines, grows to its most, and scrolls from there. Tab moves the focus on from either.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, for the action `keyboardOptions` names. Null keeps what the platform does.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it. With `maxLength`, it comes first and the limit applies to what it lets through.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in: `ContentType.EmailAddress` and the like.
- `style: FilledTextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FilledTextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field has no fill and is drawn in the theme's disabled text colour whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`. A `placeholder` that says the same is then left to the eye.
- `tagKey: String?`: the field's automation key: the field is `FilledTextField_<tagKey>`, and its clear button `FilledTextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixFilledTextField

`import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledTextField(
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

A filled text field whose text is a `String` its caller holds: `value` is what it shows, and `onValueChange` is asked for every change the user makes.

It looks and measures as the field on a `TextFieldState` does, and underneath it is Foundation's text field of a value and a callback, with what that brings. The text the callback is given has to come back as `value` by the next frame, or the field shows the old text again and the caret jumps: keep the text in state that the callback writes at once, and take the `TextFieldState` overload when the text lives in a flow or is changed away from the screen. What comes back may differ from what was asked for, which is how this overload filters: a change the callback does not take is not shown.

It speaks the vocabulary of the text field underneath: `singleLine`, `minLines` and `maxLines` for its lines, `keyboardActions` for the keyboard's action key, and `visualTransformation` for how the text is shown, a password's dots among them. That text field does not tell how far its text is scrolled, so a box of several lines has no bar here.

Parameters:

- `value: String`: the text the field shows.
- `onValueChange: (String) -> Unit`: asked for each change the user makes, with the whole new text, and by the clear button with an empty one.
- `modifier: Modifier`: the modifier of the whole field: its box and what is under it.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right.
- `error: Boolean`: whether the text is wrong: the box is outlined in the danger role's colour, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text. A slot does not size what is put in it.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that asks for an empty text, while the field can be typed into and is not empty.
- `maxLength: Int?`: the most characters the user can enter. An edit that would pass the limit is turned down whole, before `onValueChange` is asked. A `value` over the limit is shown as it is, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `singleLine: Boolean`: whether the field holds one line, which scrolls sideways. It does unless told otherwise. A line break in `value` is then shown as a space, and `value` keeps it.
- `minLines: Int`: the least lines the box is tall, in a field of several.
- `maxLines: Int`: the most lines the box grows to before its text scrolls, in a field of several.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `keyboardActions: KeyboardActions`: what the keyboard's action key does, for the action `keyboardOptions` names.
- `visualTransformation: VisualTransformation`: how the text is shown, without changing it: `PasswordVisualTransformation()` draws a dot for each character.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in.
- `style: FilledTextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FilledTextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field has no fill and is drawn in the theme's disabled text colour whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `FilledTextField_<tagKey>`, and its clear button `FilledTextFieldClear_<tagKey>`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.

### PantrixFilledTextField

`import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledTextField(
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

A filled text field bound to a form's field: its text, its error and its name come from `field`.

The field's value and the text on screen stay in step both ways: typing changes the field, and a change made to the field in code, such as a reset, replaces the text. When the focus leaves, the field is marked touched and checked, which is when an error first shows. While the field is in error its message takes the place of `supportingText`. The field's id is the automation key, `FilledTextField_<id>`, and the form can send the focus here when it is submitted with this field in error.

Parameters:

- `field: FormField<String>`: the field the text field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it. An action of `Next` or `Previous` moves the focus as it always does. A field of one line that names no action gets `ImeAction.Done`, since the default action never reaches a handler. A field of several lines is left alone: there Enter starts a new line. An `onKeyboardAction` of the caller's own takes the place of the submit.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `maxLength: Int?`: the most characters the user can enter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `lineLimits: TextFieldLineLimits`: one line, or `TextFieldLineLimits.MultiLine`. Tab moves the focus on from either.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, in place of the form's submit.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it.
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
