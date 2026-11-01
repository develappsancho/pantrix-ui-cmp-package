# Filled Secure Text Field

A secure text field whose label is inside its box: a password, a PIN or a card's security code, in the filled text field's box. What is typed is drawn as dots, and cannot be cut, copied or dragged out of the field. The eye button at the box's end shows the text and hides it again.

The secure field underneath is `PantrixSecureTextField`'s, and its box `PantrixFilledTextField`'s. It takes the filled field's `style` and `colors`: the two filled fields are restyled together, and the two secure fields can stand in for each other. The field holds one line; it is built on a `TextFieldState`, and has an overload that takes a form's field.

- `PantrixFilledSecureTextField` (`com.pantrixui.components.inputs.filledsecuretextfield`, `com.pantrixui:components`): A text input for a password or a PIN whose label is inside a filled box: one line drawn as dots that cannot be cut or copied, with a button that shows it and hides it again, supporting and error text, icons, a character count and form binding. Keywords: password, pin, filled password field, floating label, show password.

## Features

- **The label inside the box.** `label` rests in the text's place while the field is empty and without the focus; with the focus, or while the field holds a text, it moves up to its own line above the text. `placeholder` shows while the label is out of its place: while the field is empty and has the focus.
- **Fill and outline.** At rest the box is filled and has no outline; it is outlined with the focus and in error. A disabled field has no fill.
- **Hidden text.** The platform is told that the field holds a password, and while the text is hidden it is given dots in place of the text: a screen reader does not read the password out, while a password manager still fills the field and saves it.
- **The reveal button.** A press on the eye button with a mouse leaves the caret where it is. With a keyboard it is a Tab stop of its own, after the field; the keyboard's "Next" key goes past it. That the text was shown is not saved. `showRevealButton = false` takes the button away.
- **Obfuscation mode.** `textObfuscationMode` says how the hidden text is drawn, and `textObfuscationCharacter` which character is drawn in place of the dot.
- **Keyboard and autofill.** What `keyboardOptions` leaves unset is a password's: the password keyboard and no corrections. Without a `contentType` the field holds `ContentType.Password`.
- **Reading the text.** The text is read from the state: `state.text` when it is used, `snapshotFlow` to follow it as it is typed. There is no overload that takes a `value` and an `onValueChange`.
- **Form.** The overload that takes a `field` gets its value, its error and its name from its field in the form; given `form`, the keyboard's action key submits the form.
- **What comes from the filled field.** `supportingText`, `error`, `leadingIcon`, `showClearButton` and `maxLength` are as they are in the filled text field. `trailingIcon` stands after the clear button and the reveal button.
- **Automation.** With `tagKey` the field is named `FilledSecureTextField_<tagKey>`, the clear button `FilledSecureTextFieldClear_<tagKey>` and the reveal button `FilledSecureTextFieldReveal_<tagKey>`. The field never reports its text.

## Usage

### A password, read when it is used

```kotlin
val password = remember { TextFieldState() }
PantrixFilledSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.password),
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
    tagKey = "password"
)
PantrixButton(text = stringResource(Res.string.sign_in), onClick = { onSignIn(password.text.toString()) })
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val password = remember { TextFieldState(initial.password) }
LaunchedEffect(password) {
    snapshotFlow { password.text.toString() }.collectLatest { viewModel.updatePassword(it) }
}
PantrixFilledSecureTextField(
    state = password,
    label = stringResource(Res.string.password),
    tagKey = "password"
)
```

### Its text, to a caller that keeps it as a String

```kotlin
var password by remember { mutableStateOf("") }
val state = remember { TextFieldState(password) }
LaunchedEffect(state) {
    snapshotFlow { state.text.toString() }.collect { password = it }
}
PantrixFilledSecureTextField(
    state = state,
    label = stringResource(Res.string.password),
    tagKey = "password"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixFilledSecureTextField(
    field = form.field("password", initial = "", Rules.notBlank(stringResource(Res.string.password_required))),
    form = form,
    label = stringResource(Res.string.password)
)
```

### A PIN that is never shown

```kotlin
val pin = remember { TextFieldState() }
PantrixFilledSecureTextField(
    state = pin,
    label = stringResource(Res.string.pin),
    showRevealButton = false,
    maxLength = 6,
    textObfuscationMode = TextObfuscationMode.Hidden,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
    tagKey = "pin"
)
```

## Examples

### At its plainest

The least there is to write: a `TextFieldState` and a label. The label is inside the box: it rests in the text's place while the field is empty, and moves up to its own line above the text when the field is pressed. What is typed is drawn as dots, and cannot be cut or copied.

Type something and press the eye button at the end of the box: the text shows, and another press hides it again. A press with a mouse does not take the caret out of the field; with a keyboard, Tab stops at the button after the field. That the text was shown is not saved.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Vault password",
    tagKey = "safe_password"
)
```

### Supporting text and error

`supportingText` stands under the box. `error = true` outlines the box in the `danger` colour; the supporting text and the caret turn to that colour too, and a screen reader announces the message as the error. The label keeps its own colour.

The field starts in error: there is a space in its text. Press the eye button to see the text, and delete the space: the error goes. It is the caller, not the field, that works out the error; here by reading `password.text`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

val password = remember { TextFieldState("secret password") }
val hasSpace = password.text.contains(' ')
PantrixFilledSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "App lock",
    supportingText = if (hasSpace) "A password cannot contain a space" else "A password without spaces",
    error = hasSpace,
    showClearButton = true,
    tagKey = "app_lock"
)
```

### Icon, clear button and count

`leadingIcon` stands before the label and the text. A slot does not size what is put in it: the example itself gives this icon the size in the filled field's style, `PantrixTheme.style(FilledTextFieldStyle).iconSize`. What is at the box's end is always in the same order: first the clear button, then the button that shows the text, and last `trailingIcon`, where one is given.

The clear button shows while the field is not empty, leaves the caret in the field and is no stop for Tab; the eye button is a Tab stop. `maxLength = 16` turns down a longer password, and writes the count under the box.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Admin password",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Person,
            contentDescription = null,
            size = PantrixTheme.style(FilledTextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    maxLength = 16,
    tagKey = "admin_password"
)
```

### A password change bound to a form

Both fields get their value, their error and their name from their field in the form. In the current password the keyboard's "Next" key moves the focus to the new password; in the new password the action key submits the form through the "Change password" button. Leave both fields empty and press the button: the form is not submitted, and the first field in error takes the focus.

The platform is told that the new password is one that is being chosen (`ContentType.NewPassword`): a password manager offers to suggest a new one here, not to fill in the saved one. The current password was given no `contentType`: the field holds `ContentType.Password`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixFilledSecureTextField(
    field = form.field("current_password", initial = "", Rules.notBlank("Enter your current password")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Current password",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
)
PantrixFilledSecureTextField(
    field = form.field("new_password", initial = "", Rules.minLength(8, "The new password must be at least 8 characters")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "New password",
    supportingText = "At least 8 characters",
    showClearButton = true,
    contentType = ContentType.NewPassword
)
PantrixButton(
    text = "Change password",
    onClick = {
        scope.launch {
            form.submit { snackbars?.show(message = "Password changed", tagKey = "password_changed") }
        }
    },
    form = form,
    tagKey = "change_password"
)
```

### A security code read when it is used

The three-digit security code on the back of a card: its keyboard is the number keyboard, an input transformation turns down what is not a digit, and its count is not shown. The eye button stays, so that the user can compare the code they typed with the one on the card.

The text is read from the state when it is used: `code.text`, when the button is pressed. It is carried nowhere in between; the field's state is its only source. The notification says how many digits were received, not the code itself.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val code = remember { TextFieldState() }
PantrixFilledSecureTextField(
    state = code,
    modifier = Modifier.fillMaxWidth(),
    label = "Security code",
    placeholder = "000",
    supportingText = "The three digits on the back of the card",
    maxLength = 3,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
    inputTransformation = DigitsOnly,
    contentType = ContentType.CreditCardSecurityCode,
    tagKey = "card_code"
)
PantrixButton(
    text = "Verify card",
    onClick = {
        val entered = code.text.toString()
        val message = when (entered.length) {
            3 -> "Code received: ${entered.length} digits"
            else -> "The code must be 3 digits, you entered ${entered.length}"
        }
        scope.launch { snackbars?.show(message = message, tagKey = "card_code_read") }
    },
    tagKey = "verify_card"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### A text followed as it is typed

A caller that wants the text as it is typed follows it from the state: `snapshotFlow { state.text.toString() }` gives every change, here to a `String` the caller holds. The supporting text is made from that `String`, and says what the password still lacks.

The flow goes one way: the text flows from the field to the caller. Carrying it to a ViewModel is written the same way: each change is reported to the ViewModel inside `collect`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

var password by remember { mutableStateOf("") }
val state = remember { TextFieldState(password) }
LaunchedEffect(state) {
    snapshotFlow { state.text.toString() }.collect { password = it }
}
PantrixFilledSecureTextField(
    state = state,
    modifier = Modifier.fillMaxWidth(),
    label = "New account password",
    supportingText = when {
        password.isEmpty() -> "At least 10 characters, including a digit"
        password.length < 10 -> "Characters to go: ${10 - password.length}"
        password.none(Char::isDigit) -> "Add a digit"
        else -> "The password is good enough"
    },
    contentType = ContentType.NewPassword,
    tagKey = "followed_password"
)
```

### A PIN that is never shown

`showRevealButton = false` takes away the eye button: the text stays as `textObfuscationMode` draws it. With `TextObfuscationMode.Hidden` the last digit typed shows on no platform; the default, `System`, would show the last character typed for a moment on Android, where the system's own setting says so. `textObfuscationCharacter` draws an asterisk in place of the dot.

Its keyboard is a PIN's: `KeyboardType.NumberPassword`. `maxLength = 4` takes no fifth digit, and writes the count under the box.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.TextObfuscationMode
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Card PIN",
    supportingText = "Four digits",
    showRevealButton = false,
    maxLength = 4,
    textObfuscationMode = TextObfuscationMode.Hidden,
    textObfuscationCharacter = '*',
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
    inputTransformation = DigitsOnly,
    tagKey = "card_pin"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Disabled and read-only

`enabled = false` takes the field's fill away: the field is drawn in the theme's disabled text colour, takes no focus and has no button to show its text.

With `readOnly = true` the field keeps its fill: it can be focused, and its text shown with the eye button, but it cannot be changed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

PantrixFilledSecureTextField(
    state = remember { TextFieldState("unchanging") },
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "App password",
    supportingText = "Set by your organisation",
    tagKey = "managed_password"
)
PantrixFilledSecureTextField(
    state = remember { TextFieldState("PX-7730-1184") },
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Backup code",
    supportingText = "Shown with the eye button, cannot be changed",
    tagKey = "backup_code"
)
```

### Its own colours and style

The filled secure field takes the filled text field's `FilledTextFieldColors` and `FilledTextFieldStyle`: the two filled fields are restyled together.

The first field's fill, label, text, icon, outline and caret are from the app's own purple; the eye button is drawn in the icon colour. What is not given, such as the fill with the focus, stays the theme's role. The second's box is fully round: `FilledTextFieldStyle(shape = ShapeRole.Full)`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Membership password",
    colors = FilledTextFieldColors(
        container = own.container,
        focusedOutline = own.color,
        text = own.onContainer,
        label = own.onContainer,
        icon = own.onContainer,
        cursor = own.color
    ),
    tagKey = "own_colors"
)
PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Archive password",
    style = FilledTextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixFilledSecureTextField

`import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledSecureTextField(
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
    showRevealButton: Boolean = true,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    textObfuscationMode: TextObfuscationMode = TextObfuscationMode.System,
    textObfuscationCharacter: Char = '•',
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A secure text field whose label is inside its box: a password, a PIN or a card's security code in the filled box of `PantrixFilledTextField`.

What is typed is drawn as dots, and cannot be cut, copied or dragged out of the field. The platform is told that the field holds a password, and while the text is hidden it is given the dots for the text: a screen reader reads no password out, and a password manager still fills the field and saves it. The field holds one line.

A button at the box's end shows the text and hides it again. With a keyboard it is a Tab stop of its own, after the field, and the keyboard's `Next` goes past it to the next field. A press on it with a pointer leaves the caret where it is. That the text was shown is not saved: it is hidden again when the field is made anew, as it is after the screen turns.

The label rests where the text will be, and moves up to its own line above the text when the field takes the focus or holds a text. The box is filled and has no outline at rest, and is outlined with the focus and in error. It is that filled box around the secure text field that `PantrixSecureTextField` is underneath, and takes the filled text field's `style` and `colors`: the two filled fields are restyled together, and the two secure fields can stand in for each other. It is built on a `TextFieldState`, and has an overload for a form's field: the text is read from the state, where it is used or as it changes.

Parameters:

- `state: TextFieldState`: the text and the selection. Create it with `remember { TextFieldState() }`, or keep it in a view model: `rememberTextFieldState()` puts what is typed into the saved state, which the platform holds after the app's process has gone and may write to its disk. A remembered state goes when the screen is made anew, as it is after the screen turns, and the field is empty again. Read what was typed from it: `state.text` where the text is used, or `snapshotFlow { state.text.toString() }` to follow it as it changes.
- `modifier: Modifier`: the modifier of the whole field: its box and what is under it. `fillMaxWidth()` makes the box as wide as its parent.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn without its fill in the disabled colours, has no button to show its text and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, and shown by the button.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader. Without one the text stands in the middle of the box, and the `placeholder` shows whenever the field is empty.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way: while it has the focus, or always where it has no label.
- `supportingText: String?`: help under the box, in a smaller type. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the box is outlined in the danger role's colour, the supporting text and the caret turn to it, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text, in the secondary text colour. A slot does not size what is put in it: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` is the platform's size.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, after the clear button and the button that shows the text.
- `showClearButton: Boolean`: shows a button that empties the field, while the field can be typed into and is not empty. It leaves the caret in the field, and is no stop for Tab.
- `showRevealButton: Boolean`: shows the button that shows the text and hides it again, while the field is enabled. Without it the text stays as `textObfuscationMode` draws it: for a text that is never to be shown, and for a caller that shows it another way.
- `maxLength: Int?`: the most characters the user can enter, counted as `String.length` counts them. An edit that would pass the limit is turned down whole. Text set in code is not cut, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textObfuscationMode: TextObfuscationMode`: how the text is drawn while it is hidden. `TextObfuscationMode.System` does as the platform does: on Android the last character typed shows for a moment where the system's own setting says so, and nowhere else does anything show. `Hidden` shows nothing on any platform, and `RevealLastTyped` the last character for a moment on every one.
- `textObfuscationCharacter: Char`: what is drawn in place of a hidden character.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key. What these leave unset is a password's, the password keyboard and no corrections, so that naming an action does not bring back a keyboard that learns what is typed. `KeyboardType.NumberPassword` is a PIN's.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, for the action `keyboardOptions` names. Null keeps what the platform does.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it. With `maxLength`, it comes first and the limit applies to what it lets through.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in. Left out, the field holds `ContentType.Password`, as Foundation's secure field says for itself: `ContentType.NewPassword` is one that is being chosen.
- `style: FilledTextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FilledTextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field has no fill and is drawn in the theme's disabled text colour whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`. A `placeholder` that says the same is then left to the eye.
- `tagKey: String?`: the field's automation key: the field is `FilledSecureTextField_<tagKey>`, its clear button `FilledSecureTextFieldClear_<tagKey>` and the button that shows its text `FilledSecureTextFieldReveal_<tagKey>`. The field reports that it took the focus, that it was cleared and that its text was shown or hidden, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixFilledSecureTextField

`import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledSecureTextField(
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
    showRevealButton: Boolean = true,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    textObfuscationMode: TextObfuscationMode = TextObfuscationMode.System,
    textObfuscationCharacter: Char = '•',
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A filled secure text field bound to a form's field: its text, its error and its name come from `field`.

The field's value and the text on screen stay in step both ways: typing changes the field, and a change made to the field in code, such as a reset, replaces the text. When the focus leaves the field and its buttons, the field is marked touched and checked, which is when an error first shows. While the field is in error its message takes the place of `supportingText`. The field's id is the automation key, `FilledSecureTextField_<id>`, and the form can send the focus here when it is submitted with this field in error.

Parameters:

- `field: FormField<String>`: the field the text field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it. An action of `Next` or `Previous` moves the focus as it always does. A field that names no action gets `ImeAction.Done`, since the default action never reaches a handler. An `onKeyboardAction` of the caller's own takes the place of the submit.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read.
- `label: String?`: what the field is for, written inside the box: the field's name for a screen reader.
- `placeholder: String?`: shown where the text goes while the field is empty and its label is out of the way.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the label and the text.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, after the clear button and the button that shows the text.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `showRevealButton: Boolean`: shows the button that shows the text and hides it again, while the field is enabled.
- `maxLength: Int?`: the most characters the user can enter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textObfuscationMode: TextObfuscationMode`: how the text is drawn while it is hidden.
- `textObfuscationCharacter: Char`: what is drawn in place of a hidden character.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key. What these leave unset is a password's.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, in place of the form's submit.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in. Left out, it is `ContentType.Password`.
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
