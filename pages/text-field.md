# Text Field

Text the user types: a name, an email address, a note of a few lines. Its label sits above the box and stays there: it does not cover the placeholder, and can be read while typing too. The box may have supporting text or an error's message under it, icons at its two ends, a button at its end that empties the field, and a character count below.

The field is built on a `TextFieldState`: it holds the text, the selection and what the keyboard is still composing together. So the keyboard is never handed a text that has moved on: that is what loses characters and makes the caret jump with some keyboards. For code that keeps its text as a `String` there is another `PantrixTextField` that takes a `value` and an `onValueChange`, and for a form's field one that takes a `field`.

- `PantrixTextField` (`com.pantrixui.components.inputs.textfield`, `com.pantrixui:components`): A text input on a TextFieldState, of one line or several, with a label, a placeholder, supporting and error text, icons, a clear button, a character count and form binding. Keywords: input, edit text, text box, form field, entry, outlined input.

## Features

- **Three overloads.** In the one that takes a `state`, the text is read from the state: `state.text` where it is used, and `snapshotFlow { state.text.toString() }` to follow it as it is typed. The one that takes a `value` and an `onValueChange` keeps the text with the caller, and `onValueChange` does the filtering. The one that takes a `field` gets its value, its error and its name from its field in the form.
- **Label and placeholder.** `label` is written above the box and is the field's name for a screen reader; a press on the label puts the caret in the box too. `placeholder` shows while the field is empty. A field with no label gets its name from `contentDescription`.
- **Supporting text and error.** `supportingText` is written under the box. `error` turns the border, the label, the supporting text and the caret to the `danger` role; the supporting text is then the message that says what to put right, and a screen reader announces it as the error.
- **Icons and the clear button.** `leadingIcon` stands before the text and `trailingIcon` after it. While the field is not empty, `showClearButton` shows a button that empties it: the button leaves the caret in the field and is no stop for Tab.
- **Length limit.** With `maxLength` an edit that would pass the limit is turned down whole, and the count is written under the box ("12/120"); `showCharacterCount = false` hides the count.
- **Several lines.** With `lineLimits = TextFieldLineLimits.MultiLine(...)` the box grows with its text and Enter starts a new line. Where the field is given a height, the box fills it and text that does not fit scrolls inside the box.
- **Keyboard and transformations.** `keyboardOptions` picks the keyboard's type and its action key, and `onKeyboardAction` is called when that key is pressed. A field a number is typed in that has an action asks for its keyboard with `numberKeyboardOptions`: an iPhone's number pad has no action key. `inputTransformation` changes what is typed, or turns it down, before it enters the field; `outputTransformation` says how the text is shown, without changing it. `contentType` tells the platform what the field holds, so that the platform can fill it in.
- **Focus, disabled and read-only.** The box's border is what shows the focus: in the `primary` colour and thicker, and no ring is drawn as well. A field under a dialog or a sheet keeps its focus, but is drawn at rest and without its caret. A field with `enabled = false` takes no focus; a `readOnly` one can be focused, and its text selected and copied.
- **Style and colours.** `style` (`TextFieldStyle`) changes the box's shape, its dimensions and its border, and `colors` (`TextFieldColors`) its colours: only the fields that are given. A disabled field is in the theme's disabled colours whatever is given.
- **Text size.** What is typed and the placeholder are set in the style's `textRole`: `body` (16sp) on Android and iOS, as in Material 3 and on iOS; `label` (14sp) on the desktop and the web, as on a page used with a pointer. A select's box and the page jump field are set in it as well.
- **Reading direction.** Each paragraph takes its direction from its own first letter: an email address typed into an Arabic form reads `ada@`, not `@ada`. The text is aligned with the layout, and stays on its label's side.

## Usage

### An e-mail address

```kotlin
val email = rememberTextFieldState()
PantrixTextField(
    state = email,
    label = stringResource(Res.string.email),
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
    contentType = ContentType.EmailAddress,
    tagKey = "email"
)
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val username = rememberTextFieldState(initial.username)
LaunchedEffect(username) {
    snapshotFlow { username.text.toString() }.collectLatest { viewModel.updateUsername(it) }
}
PantrixTextField(
    state = username,
    label = stringResource(Res.string.username),
    tagKey = "username"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
val name = form.field("name", initial = "", Rules.notBlank(stringResource(Res.string.name_required)))
PantrixTextField(
    field = name,
    form = form,
    label = stringResource(Res.string.name),
    maxLength = 40
)
```

### Held as a String, with a password's dots

```kotlin
var password by remember { mutableStateOf("") }
PantrixTextField(
    value = password,
    onValueChange = { password = it },
    label = stringResource(Res.string.password),
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
    visualTransformation = PasswordVisualTransformation(),
    tagKey = "password"
)
```

### A search field, with no label

```kotlin
val query = rememberTextFieldState()
PantrixTextField(
    state = query,
    placeholder = stringResource(Res.string.search_orders),
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Search,
            contentDescription = null,
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
    onKeyboardAction = { onSearch(query.text.toString()) },
    contentDescription = stringResource(Res.string.search_orders),
    tagKey = "search"
)
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
val coupon = rememberTextFieldState()
PantrixTextField(
    state = coupon,
    label = stringResource(Res.string.coupon),
    colors = TextFieldColors(border = success.color, focusedBorder = success.color, cursor = success.color),
    tagKey = "coupon"
)
```

## Examples

### At its plainest

The least there is to write: a `TextFieldState` and a label. The state is created with `rememberTextFieldState()`, and what is typed is read from it; the line below shows `name.text` as it is typed.

The label sits above the box and stays there; a press on the label puts the caret in the box too. The box's border is what shows the focus. `tagKey` sets the field's test tag: `TextField_<tagKey>`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val name = rememberTextFieldState()
PantrixTextField(
    state = name,
    modifier = Modifier.fillMaxWidth(),
    label = "Name",
    tagKey = "name"
)
PantrixText(
    text = if (name.text.isEmpty()) "Nothing typed yet" else "Typed: ${name.text}",
    color = PantrixTheme.colors.textSecondary
)
```

### A search field without a label

A search field that has no label: `contentDescription` tells a screen reader its name. The placeholder says the same, so the screen reader does not read it as well: the field is not named twice while it is empty.

`leadingIcon` stands before the text. A slot does not size what is put in it; the icon takes the size in the field's style: `PantrixTheme.style(TextFieldStyle).iconSize`. While the field is not empty, `showClearButton` shows the button that empties it; the button leaves the caret in the field.

`keyboardOptions` makes the keyboard's action key "Search", and `onKeyboardAction` is called when that key is pressed. Type something and press the keyboard's "Search" key, or Enter: the app's snackbar says what was searched for.

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
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val query = rememberTextFieldState()
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Search orders",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Search,
            contentDescription = null,
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
    onKeyboardAction = { scope.launch { snackbars?.show(message = "Searched for: ${query.text}", tagKey = "searched") } },
    contentDescription = "Search orders",
    tagKey = "search"
)
```

### Leading and trailing icons

`leadingIcon` stands before the text and `trailingIcon` after it: in a right-to-left layout they change places. Both take the secondary text colour; a text put in a slot, like the "kg" in the second field, is drawn in that colour too.

The clear button stands before `trailingIcon` and is no stop for Tab: a stop after every field would double the presses it takes to get through a form. A screen reader still reaches the button as a button.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val iconSize = PantrixTheme.style(TextFieldStyle).iconSize
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Username",
    leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Person, contentDescription = null, size = iconSize) },
    tagKey = "username"
)
PantrixTextField(
    state = rememberTextFieldState("72"),
    modifier = Modifier.fillMaxWidth(),
    label = "Weight",
    trailingIcon = { PantrixText(text = "kg") },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "weight"
)
```

### Supporting text and error

`supportingText` stands under the box, in a small type. With `error = true` the border, the label, the supporting text and the caret turn to the `danger` role; the supporting text is then the message that says what to put right, and a screen reader announces it as the error. Type a few letters: as long as the password is shorter than eight characters the field is in error, and says how many characters are missing.

This field keeps its text as a `String`, not in a `TextFieldState`: `value` is shown, and `onValueChange` is asked for every change. The password is drawn as dots by `visualTransformation`. It is kept with `remember` and not with `rememberSaveable`: saved state may be written to disk. The password field that has a button to show its text is `PantrixSecureTextField`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import com.pantrixui.components.inputs.textfield.PantrixTextField

var password by remember { mutableStateOf("") }
val missing = 8 - password.length
val tooShort = password.isNotEmpty() && missing > 0
PantrixTextField(
    value = password,
    onValueChange = { password = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Password",
    supportingText = if (tooShort) "Characters missing: $missing" else "At least 8 characters",
    error = tooShort,
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
    visualTransformation = PasswordVisualTransformation(),
    contentType = ContentType.NewPassword,
    tagKey = "password"
)
```

### A field whose text is held as a String

The `PantrixTextField` that takes a `value` and an `onValueChange`: the field shows `value`, and asks `onValueChange` for every change the user makes. A change the callback does not take is not shown: filtering is done there, and this overload takes no `inputTransformation`. The text asked for has to come back as `value` by the next frame, or the field shows the old text and the caret jumps: keep the text in state that the callback writes at once; where the text lives in a flow, pick the overload that takes a `state`.

This overload takes its lines through `singleLine`, `minLines` and `maxLines`, and is one line unless told otherwise. The field here is given an address of two lines, as if pasted from somewhere else: the field shows the line break as a space, and the second line is not cut off; the text that is held stays as it is.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.textfield.PantrixTextField

var address by remember { mutableStateOf("Bağdat Cad. No: 12\nKat 3, Daire 8") }
PantrixTextField(
    value = address,
    onValueChange = { address = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Address (one line)",
    supportingText = "The line break in the text shows as a space",
    showClearButton = true,
    tagKey = "address_line"
)
```

### Lines and the action key in the String overload

The overload that keeps its text as a `String` takes its lines through `singleLine`, `minLines` and `maxLines`, not through `lineLimits`. The first field is two lines tall and grows to four; past that, the text scrolls inside it.

The keyboard's action key, too, is answered by `keyboardActions` and not by `onKeyboardAction`: it says what to do for the action `keyboardOptions` names. Type something in the second field and press the keyboard's action key: the app's snackbar says what was typed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var message by remember { mutableStateOf("") }
var nickname by remember { mutableStateOf("") }
PantrixTextField(
    value = message,
    onValueChange = { message = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Message",
    singleLine = false,
    minLines = 2,
    maxLines = 4,
    tagKey = "message"
)
PantrixTextField(
    value = nickname,
    onValueChange = { nickname = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Nickname",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
    keyboardActions = KeyboardActions(
        onDone = { scope.launch { snackbars?.show(message = "Nickname: $nickname") } }
    ),
    tagKey = "nickname"
)
```

### Several lines and a character count

`lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3)` starts the box three lines tall; the box grows with its text, and Enter starts a new line. Tab does not type a tab, it moves the focus on: otherwise a keyboard would have no way forward out of the field.

With `maxLength = 120` an edit that would pass the limit is turned down whole: typing stops at the limit, and a paste that does not fit is not put in at all. Characters are counted as `String.length` counts them, so an emoji can count as two. The count is written under the box, opposite the supporting text. Text set in code is not cut: where it is over the limit, the user can still make it shorter.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.textfield.PantrixTextField

PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Note for the courier",
    placeholder = "The doorbell does not work, please knock",
    supportingText = "Passed on to the courier",
    maxLength = 120,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3),
    tagKey = "note"
)
```

### A field given a height

A height given to the field is the whole field's: `Modifier.height(160.dp)`. The label stays at the top, and the supporting text and the count at the bottom; the box fills the height they leave, and text that does not fit scrolls inside the box. No part of the field runs outside the height it is given.

Press the clear button: with its text gone, the box is still the same height.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.PantrixTextField

PantrixTextField(
    state = rememberTextFieldState(INSTRUCTIONS),
    modifier = Modifier.fillMaxWidth().height(160.dp),
    label = "Delivery instructions",
    supportingText = "The field's height is fixed: the text scrolls inside the box",
    showClearButton = true,
    maxLength = 400,
    lineLimits = TextFieldLineLimits.MultiLine(),
    tagKey = "instructions"
)

private const val INSTRUCTIONS = "The building's street door is kept locked: ring the bell twice.\n" +
    "If nobody answers, leave it at the guard's booth.\n" +
    "If the parcel is heavy, take the lift: third floor.\n" +
    "There is a dog at the door: it barks but does not bite.\n" +
    "I am at home after six in the evening.\n" +
    "If you cannot reach me, call the caretaker."
```

### Input and output transformations

`inputTransformation` sees every change the user makes before it enters the field: the one here turns a change down whole if it holds anything but digits. With `maxLength`, the transformation runs first and the limit applies to what it lets through.

`outputTransformation` says how the text is shown, without changing it: the number's spaces are only drawn. Type "5321234567": the box shows "532 123 45 67", while `phone.text`, which the line below reads, has no spaces.

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
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val phone = rememberTextFieldState()
PantrixTextField(
    state = phone,
    modifier = Modifier.fillMaxWidth(),
    label = "Mobile phone",
    placeholder = "5XX XXX XX XX",
    supportingText = "Ten digits, without the leading zero",
    maxLength = 10,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
    inputTransformation = DigitsOnly,
    outputTransformation = PhoneSpaces,
    tagKey = "phone"
)
PantrixText(text = "Text held: \"${phone.text}\"", color = PantrixTheme.colors.textSecondary)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}

private val PhoneSpaces = OutputTransformation {
    // From the end to the start: each space added later stands to the left of the ones added before it, and does not shift their places.
    listOf(8, 6, 3).forEach { at -> if (length > at) insert(at, " ") }
}
```

### A field of numbers and the action key

A field a number is typed in, with something to do once it is typed, asks for its keyboard with `numberKeyboardOptions`: it gives the keyboard's type and its action key together. On Android the keyboard of numbers has an action key. An iPhone's number pad has none: ten digits and a key that takes one back. There a number typed in a field that asked for `KeyboardType.Number` cannot be sent; `numberKeyboardOptions` asks for the keyboard of numbers and punctuation in its place: it opens on its digits and has an action key.

Type a quantity and press the keyboard's action key, or Enter: the app's snackbar says the quantity. The keyboard on an iPhone also has signs and, a press away, letters: the field turns those down (`inputTransformation`).

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.platform.numberKeyboardOptions
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val quantity = rememberTextFieldState()
PantrixTextField(
    state = quantity,
    modifier = Modifier.fillMaxWidth(),
    label = "Quantity",
    maxLength = 4,
    showCharacterCount = false,
    keyboardOptions = numberKeyboardOptions(ImeAction.Done),
    onKeyboardAction = {
        scope.launch { snackbars?.show(message = "Quantity: ${quantity.text}", tagKey = "quantity") }
    },
    inputTransformation = DigitsOnly,
    tagKey = "quantity"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Fields bound to a form

The `PantrixTextField` that takes a `field` gets its value, its error and its name from its field in the form. No `tagKey` is given: the field's `id` is the automation key (`TextField_<id>`). When the focus leaves an empty field, the rule's message takes the place of the supporting text; that is when the error first shows.

In a field given `form`, the keyboard's action key submits the form. In the first field the "Next" key moves the focus to the next field; in the second the action key submits the form through the "Save" button, and where a field is in error the focus goes to it. Leave both fields empty and press "Save".

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixTextField(
    field = form.field("full_name", initial = "", Rules.notBlank("Enter your name")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Full name",
    supportingText = "As it appears on your card",
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words, imeAction = ImeAction.Next),
    contentType = ContentType.PersonFullName
)
PantrixTextField(
    field = form.field("email", initial = "", Rules.matches(EMAIL, "Enter a valid email address")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Email",
    placeholder = "name@example.com",
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
    contentType = ContentType.EmailAddress
)
PantrixButton(
    text = "Save",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Details saved", tagKey = "profile_saved") } }
    },
    form = form,
    tagKey = "save_profile"
)

private val EMAIL = Regex("""\S+@\S+\.\S+""")
```

### Disabled and read-only

`enabled = false` draws the field in the theme's disabled colours: the field takes no focus, cannot be typed into, and a screen reader is told it is disabled.

`readOnly = true` only stops the text being changed: the field can be focused, and its text selected and copied.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.textfield.PantrixTextField

PantrixTextField(
    state = rememberTextFieldState("Pantrix A.Ş."),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Disabled",
    supportingText = "Set by your organisation",
    tagKey = "company"
)
PantrixTextField(
    state = rememberTextFieldState("SIP-2026-0914"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Read-only",
    supportingText = "Cannot be changed; can be selected and copied",
    tagKey = "order_no"
)
```

### Its own colours

The colours given with `colors` are used, and those left out stay the theme's roles. The first field's colours are not written as fixed values but taken from the theme's `success` role: they are right in the dark theme too. The box's fill is the role's soft tone; the text and the icon are in the colour that reads on that tone; the border and the caret are the role's own colour. The label, the supporting text and the error colour are not given: they stay as the theme has them.

The second field is given only two colours, both the app's own purple: the border while the field has the focus, and the caret. Press the field, type something and select it: the selection's handles and its highlight take the caret's colour too.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val success = PantrixTheme.colors.success
PantrixTextField(
    state = rememberTextFieldState("PANTRIX10"),
    modifier = Modifier.fillMaxWidth(),
    label = "Discount code",
    supportingText = "Code valid: 10% off",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Check,
            contentDescription = null,
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    colors = TextFieldColors(
        container = success.container,
        border = success.color,
        hoveredBorder = success.color,
        focusedBorder = success.color,
        text = success.onContainer,
        icon = success.onContainer,
        cursor = success.color
    ),
    tagKey = "coupon"
)
val own = ownColors()
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Invitation code",
    placeholder = "PX-0000",
    colors = TextFieldColors(focusedBorder = own.color, cursor = own.color),
    tagKey = "own_colors"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Its own style

`style` is this call's own style: only the fields it sets change, and the rest comes from the theme's and the platform's style.

The first field is a fully round box: `TextFieldStyle(shape = ShapeRole.Full)`. The second takes the same style but holds several lines: the curve of a fully round box would run into the first line of its text, so the field is drawn with `ShapeRole.Large`. In the third, `height` raises the box's least height; the one line stands in the middle of the box.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Search products",
    showClearButton = true,
    style = TextFieldStyle(shape = ShapeRole.Full),
    contentDescription = "Search products",
    tagKey = "pill"
)
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Comment",
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 2),
    style = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill_comment"
)
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Title",
    style = TextFieldStyle(height = 56.dp),
    tagKey = "tall"
)
```

### Watching the interactions from outside

`interactionSource` hoists the field's interactions: its focus, its hover and its presses. Without one, the field keeps a source of its own. The line below reads from the same source: press the field, then bring the pointer over the box.

It is the box that reports the pointer: a pointer over the label or over the supporting text does not count.

```kotlin
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val interactions = remember { MutableInteractionSource() }
val focused by interactions.collectIsFocusedAsState()
val hovered by interactions.collectIsHoveredAsState()
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Subject",
    supportingText = "The pointer counts only while it is over the box",
    interactionSource = interactions,
    tagKey = "observed"
)
PantrixText(
    text = "Focused: ${if (focused) "yes" else "no"} · Pointer over it: ${if (hovered) "yes" else "no"}",
    color = PantrixTheme.colors.textSecondary
)
```

## API

### PantrixTextField

`import com.pantrixui.components.inputs.textfield.PantrixTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field: one line of text or several that the user types, under a label, with help or an error's message below it, icons at either end, a button that clears it and a count of its characters.

It is built on a `TextFieldState` and not on a value and a callback. The state holds the text, the selection and what the keyboard is still composing together, so the keyboard is never handed a text that has moved on: that is what loses characters and makes the caret jump with some input methods. Code that keeps its text as a `String` has an overload that takes a `value` and an `onValueChange`, and a form's field has one of its own.

The label sits above the box and stays there. A label that never moves never covers the placeholder and stays readable while the user types. The whole field is one target: a press on the label puts the caret in the box.

The border is what shows the focus, in the primary role's colour and thicker, however the focus came: a press shows it as much as Tab does. No ring is drawn around the box as well, which would read as a second border. Under a modal the field keeps the focus, to have it again when the modal closes, and is drawn at rest and without its caret: the modal is where the user is until then.

Each paragraph takes its reading direction from its own first letter, so an e-mail address typed into an Arabic form reads `ada@` and not `@ada`. The text is aligned with the layout, so it stays on the label's side whatever script it is in.

Parameters:

- `state: TextFieldState`: the text and the selection. Create it with `rememberTextFieldState()`, and read what was typed from it: `state.text` where the text is used, or `snapshotFlow { state.text.toString() }` to follow it as it changes.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it. `fillMaxWidth()` makes the box as wide as its parent. A height is the whole field's as well: the box fills what the label and the supporting text leave of it, with one line in its middle and several from its top, and a text too long for the box scrolls in it.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn in the disabled colours and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty. It is no label: it goes as soon as the user types.
- `supportingText: String?`: help under the box, in a smaller type. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the border, the label, the supporting text and the caret turn to the danger role, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text, in the secondary text colour. A slot does not size what is put in it: `PantrixIcon(size = PantrixTheme.style(TextFieldStyle).iconSize)` is the platform's size.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that empties the field, while the field can be typed into and is not empty. It leaves the caret in the field. It is no stop for Tab, since a stop after every field doubles the presses through a form, and a screen reader still reaches it as a button.
- `maxLength: Int?`: the most characters the user can enter, counted as `String.length` counts them, so that an emoji can count as two. An edit that would pass the limit is turned down whole: typing stops at the limit, and a paste that does not fit is not put in. Text set in code is not cut, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `lineLimits: TextFieldLineLimits`: one line, or `TextFieldLineLimits.MultiLine`, in which the box grows with its text and Enter starts a new line. Past its most lines the text scrolls, and a thin bar at the box's end shows how far. Its icons and its clear button stand at its first line. Tab moves the focus on from either: a field of several lines does not type a tab, which would leave a keyboard no way forward out of it.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key. A field of numbers that has an action takes `numberKeyboardOptions(imeAction)`: an iPhone's number pad has no key for one. A field of several lines that names an action loses the key for a new line on Android, whose keyboard shows the action in its place: such a field leaves the action unset, or is a `PantrixTextArea`.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key: the key a software keyboard shows for the action `keyboardOptions` names, and Enter on a hardware keyboard in a field of one line. It is called only for a named action, since the default one never reaches a handler. Null keeps what the platform does: `Next` moves the focus on, and `Done` closes the keyboard.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it. With `maxLength`, it comes first and the limit applies to what it lets through.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it: a phone number's spaces.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in: `ContentType.EmailAddress` and the like.
- `style: TextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`, as a search field has none. A `placeholder` that says the same is then left to the eye, so that the field is not named twice while it is empty.
- `tagKey: String?`: the field's automation key: the field is `TextField_<tagKey>`, and its clear button `TextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixTextField

`import com.pantrixui.components.inputs.textfield.PantrixTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field whose text is a `String` its caller holds: `value` is what it shows, and `onValueChange` is asked for every change the user makes.

It looks and measures as the field on a `TextFieldState` does, and underneath it is Foundation's text field of a value and a callback, with what that brings. The text the callback is given has to come back as `value` by the next frame, or the field shows the old text again and the caret jumps: keep the text in state that the callback writes at once, and take the `TextFieldState` overload when the text lives in a flow or is changed away from the screen. What comes back may differ from what was asked for, which is how this overload filters: a change the callback does not take is not shown.

It speaks the vocabulary of the text field underneath: `singleLine`, `minLines` and `maxLines` for its lines, `keyboardActions` for the keyboard's action key, and `visualTransformation` for how the text is shown, a password's dots among them. It takes no input transformation: `onValueChange` is where a change is turned down or put right.

Parameters:

- `value: String`: the text the field shows.
- `onValueChange: (String) -> Unit`: asked for each change the user makes, with the whole new text, and by the clear button with an empty one.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn in the disabled colours and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the border, the label, the supporting text and the caret turn to the danger role, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text. A slot does not size what is put in it.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, and after the clear button.
- `showClearButton: Boolean`: shows a button that asks for an empty text, while the field can be typed into and is not empty. It leaves the caret in the field, and is no stop for Tab.
- `maxLength: Int?`: the most characters the user can enter, counted as `String.length` counts them. An edit that would pass the limit is turned down whole, before `onValueChange` is asked. A `value` over the limit is shown as it is, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `singleLine: Boolean`: whether the field holds one line, which scrolls sideways. It does unless told otherwise, as the `TextFieldState` overload does, where Foundation's own text field starts with several. A line break in `value` is then shown as a space, as that overload shows it, and `value` keeps it.
- `minLines: Int`: the least lines the box is tall, in a field of several.
- `maxLines: Int`: the most lines the box grows to before its text scrolls, in a field of several.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key.
- `keyboardActions: KeyboardActions`: what the keyboard's action key does, for the action `keyboardOptions` names. Without one for that action the platform does what it does: `Next` moves the focus on, and `Done` closes the keyboard.
- `visualTransformation: VisualTransformation`: how the text is shown, without changing it: `PasswordVisualTransformation()` draws a dot for each character.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in: `ContentType.Password` and the like.
- `style: TextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`. A `placeholder` that says the same is then left to the eye.
- `tagKey: String?`: the field's automation key: the field is `TextField_<tagKey>`, and its clear button `TextFieldClear_<tagKey>`. The field reports that it took the focus and that it was cleared, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixTextField

`import com.pantrixui.components.inputs.textfield.PantrixTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field bound to a form's field: its text, its error and its name come from `field`.

The field's value and the text on screen stay in step both ways: typing changes the field, and a change made to the field in code, such as a reset, replaces the text. When the focus leaves, the field is marked touched and checked, which is when an error first shows. While the field is in error its message takes the place of `supportingText`, rather than standing beside it. The field's id is the automation key, `TextField_<id>`, and the form can send the focus here when it is submitted with this field in error.

It is an overload of its own and not a parameter of the state's form, so that a state and a field cannot both be given.

Parameters:

- `field: FormField<String>`: the field the text field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it: the form is checked, and then submitted or the focus sent to its first field in error. An action of `Next` or `Previous` moves the focus as it always does. A field of one line that names no action gets `ImeAction.Done`, since the default action never reaches a handler and Enter would submit nothing. A field of several lines is left alone: there Enter starts a new line. An `onKeyboardAction` of the caller's own takes the place of the submit.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text.
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

### numberKeyboardOptions

`import com.pantrixui.foundation.platform.numberKeyboardOptions`, from `com.pantrixui:foundation`

```kotlin
fun numberKeyboardOptions(
    imeAction: ImeAction = ImeAction.Default,
    decimal: Boolean = false
): KeyboardOptions
```

The keyboard for a field a number is typed in, with `imeAction` on a key of it.

A field of numbers asks for `KeyboardType.Number` and, where it has something to do once the number is typed, to open a page or to go on to the next field, for an `ImeAction` with it. On Android the keyboard of numbers has a key for the action, and a keyboard of keys has Enter. An iPhone's number pad has neither: it is ten digits and a key that takes one back. The action has no key there, and what was typed can never be sent (seen on a simulator, Compose Multiplatform 1.12.1).

So on iOS a number with an action is typed on the keyboard of numbers and punctuation, which opens on its digits and has a return key that shows the action. It is a keyboard for writing: it is asked for with corrections off, which also takes away the bar of words it offers above its keys. Its signs and, a press away, its letters can be typed on it, so the field itself keeps out what is no number, as with an `InputTransformation`. A number without an action (`ImeAction.Default`, `ImeAction.None`) misses nothing on the number pad, and gets it on iOS too.

Everywhere else the options are the type and the action that were asked for, and nothing more.

docs/guide/number-keyboard/NUMBER_KEYBOARD_GUIDE.md has the whole of it, and the same for a project without this library.

Parameters:

- `imeAction: ImeAction`: what the keyboard's action key does and shows: `ImeAction.Go`, `ImeAction.Next`, `ImeAction.Done`.
- `decimal: Boolean`: whether the number has a fraction: `KeyboardType.Decimal` in place of `KeyboardType.Number`, which puts a decimal separator on a number pad.

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
