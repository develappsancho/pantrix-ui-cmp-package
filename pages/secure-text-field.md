# Secure Text Field

A field for text that is not to be read over a shoulder: a password, a PIN, a card's security code. What is typed is drawn as dots; it cannot be cut, copied or dragged out of the field. The eye button at the box's end shows the text and hides it again.

Its label, its box and its supporting text are those of `PantrixTextField`, and it takes that component's `style` and `colors`: a product that restyles its text fields restyles its password fields with them. The field holds one line. It is built on a `TextFieldState`, and has another overload that takes a form's field; it has none that takes `value` and `onValueChange`.

- `PantrixSecureTextField` (`com.pantrixui.components.inputs.securetextfield`, `com.pantrixui:components`): A text input for a password or a PIN: one line drawn as dots that cannot be cut or copied, with a button that shows it and hides it again, a label, supporting and error text, icons, a character count and form binding. Keywords: password, pin, secret, password field, hidden input, show password.

## Features

- **Hidden text.** The platform is told that the field holds a password, and while the text is hidden it is given dots in place of the text: a screen reader does not read the password out, while a password manager still fills the field and saves it.
- **The reveal button.** The eye at the box's end shows the text and hides it again. A press on it with the mouse leaves the caret where it is. With a keyboard it is a Tab stop of its own, after the field, while the keyboard's "Next" key goes past it to the next field. `showRevealButton = false` removes the button.
- **That the text was shown is not saved.** When the field is composed anew, as it is when the screen turns, the text is hidden again.
- **Obfuscation mode.** `textObfuscationMode` says how the hidden text is drawn: as the platform does it, with the last character typed showing for a moment, or with nothing showing. `textObfuscationCharacter` is the character drawn in place of the dot.
- **Keyboard.** What `keyboardOptions` leaves unset is a password's: the password keyboard and no corrections. Naming an action key and nothing else does not bring back a keyboard that learns what is typed. `KeyboardType.NumberPassword` is a PIN's.
- **Autofill.** If no `contentType` is given the field holds `ContentType.Password`; `ContentType.NewPassword` is a password that is being chosen.
- **Reading the text.** The text is read from the state: `state.text` at the moment it is used, `snapshotFlow` to follow it as it is typed. A caller that keeps the text as a `String` is handed each change that way.
- **Form.** The overload that takes a `field` gets its value, its error and its name from its field in the form. The field is checked when the focus leaves the field and its buttons; if `form` is given, the keyboard's action key submits the form.
- **What comes from the text field.** `label`, `placeholder`, `supportingText`, `error`, `leadingIcon`, `showClearButton` and `maxLength` are as they are in the text field. `trailingIcon` stands after the clear button and the reveal button.
- **Automation.** With `tagKey` the field is named `SecureTextField_<tagKey>`, the clear button `SecureTextFieldClear_<tagKey>` and the reveal button `SecureTextFieldReveal_<tagKey>`. The field reports that it took the focus, that it was cleared and that its text was shown or hidden; never its text.

## Usage

### A password, read when it is used

```kotlin
val password = remember { TextFieldState() }
PantrixSecureTextField(
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
PantrixSecureTextField(
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
PantrixSecureTextField(
    state = state,
    label = stringResource(Res.string.password),
    tagKey = "password"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixSecureTextField(
    field = form.field("password", initial = "", Rules.notBlank(stringResource(Res.string.password_required))),
    form = form,
    label = stringResource(Res.string.password)
)
```

### A PIN that is never shown

```kotlin
val pin = remember { TextFieldState() }
PantrixSecureTextField(
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

The least there is to write: a `TextFieldState` and a label. What is typed is drawn as dots; it cannot be cut or copied. The text is in the state: the line below reads only the length of `password.text`.

The eye button at the box's end shows the text and hides it again. A press on it with the mouse does not take the caret out of the field. With a keyboard, Tab stops at the button after the field, while the keyboard's "Next" key skips the button. That the text was shown is not saved: when the field is composed anew it is hidden again.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.foundation.theme.PantrixTheme

val password = remember { TextFieldState() }
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Wi-Fi password",
    tagKey = "wifi_password"
)
PantrixText(text = "Characters typed: ${password.text.length}", color = PantrixTheme.colors.textSecondary)
```

### Obfuscation mode and character

`textObfuscationMode` says how the text is drawn while it is hidden. The default, `System`, does as the platform does: on Android the last character typed shows for a moment where the system's own setting says so, and nowhere else does anything show. `RevealLastTyped` shows the last character typed for a moment on every platform, and `Hidden` shows it on none. Type something into the first two fields and see the difference.

`textObfuscationCharacter` is what is drawn in place of a hidden character: in the third field, stars instead of dots.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.TextObfuscationMode
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "The last character typed shows",
    textObfuscationMode = TextObfuscationMode.RevealLastTyped,
    tagKey = "reveal_last"
)
PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Nothing shows",
    textObfuscationMode = TextObfuscationMode.Hidden,
    tagKey = "hidden"
)
PantrixSecureTextField(
    state = remember { TextFieldState("stars") },
    modifier = Modifier.fillMaxWidth(),
    label = "Stars instead of dots",
    textObfuscationCharacter = '*',
    tagKey = "stars"
)
```

### Supporting text and error

`supportingText` stands under the box. `error = true` turns the border, the label, the supporting text and the caret to the `danger` role, and the message is announced to a screen reader as the error. Type different things into the two fields: the second one goes into error and says what is wrong.

Each field's text is in its own state; the comparison reads both from there. The first field was given only an action key: the keyboard's "Next" key does not stop at the eye button, and goes on to the second field. The rest of the keyboard was not given, so it is a password's: the password keyboard and no corrections.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

val password = remember { TextFieldState() }
val repeated = remember { TextFieldState() }
val differs = repeated.text.isNotEmpty() && repeated.text.toString() != password.text.toString()
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Account password",
    supportingText = "Include letters and digits",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
    contentType = ContentType.NewPassword,
    tagKey = "chosen_password"
)
PantrixSecureTextField(
    state = repeated,
    modifier = Modifier.fillMaxWidth(),
    label = "Account password (again)",
    supportingText = if (differs) "The two passwords do not match" else "Type the same password once more",
    error = differs,
    contentType = ContentType.NewPassword,
    tagKey = "repeated_password"
)
```

### Clear button, count and icon

Three things can stand side by side at the box's end, always in the same order: the clear button, the button that shows the text, and `trailingIcon`. The icon here says whether the password is long enough; it is not decoration, so it has a `contentDescription`.

The clear button of `showClearButton` shows while the field is not empty, and leaves the caret in the field. `maxLength = 32` does not take a longer password; the count is written under the box, opposite the supporting text. `placeholder` shows only while the field is empty.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val password = remember { TextFieldState() }
val longEnough = password.text.length >= 12
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Master password",
    placeholder = "It can be a sentence too",
    supportingText = "At least 12 characters",
    trailingIcon = {
        PantrixIcon(
            imageVector = if (longEnough) PantrixIcons.Success else PantrixIcons.Warning,
            contentDescription = if (longEnough) "Long enough" else "Still too short",
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    maxLength = 32,
    tagKey = "master_password"
)
```

### A sign-in bound to a form

The `PantrixSecureTextField` that takes a `field` gets its value, its error and its name from its field in the form: if the field is left with the password too short, the rule's message takes the place of the supporting text. When the focus moves to the eye button the field does not count as left, so the error does not show then. The text of a field bound to a form is the value of the form's field: it does not have to be taken separately.

In a field given `form`, the keyboard's action key submits the form through the "Sign in" button; in the email field the "Next" key moves the focus to the password. The email field is a `PantrixTextField`: the two components draw the same label and the same box.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixTextField(
    field = form.field("login_email", initial = "", Rules.matches(EMAIL, "Enter a valid email address")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Email",
    placeholder = "name@example.com",
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
    contentType = ContentType.EmailAddress
)
PantrixSecureTextField(
    field = form.field("login_password", initial = "", Rules.minLength(8, "The password must be at least 8 characters long")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Password",
    supportingText = "At least 8 characters",
    showClearButton = true
)
PantrixButton(
    text = "Sign in",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Signed in", tagKey = "signed_in") } }
    },
    form = form,
    tagKey = "sign_in"
)

private val EMAIL = Regex("""\S+@\S+\.\S+""")
```

### A form that carries its text to a ViewModel

It builds the username's state with `rememberTextFieldState` and the password's with `remember { TextFieldState(…) }`, from the value the ViewModel holds at that moment: the password does not go into the saved state. It follows the text in the state with `snapshotFlow` and reports each change to the ViewModel. This is how the text is taken from a field's state: the same way in a plain text field and in a secure one.

The first value in the ViewModel is read once. From then on it is one way: the text flows from the field to the ViewModel, and a change made in the ViewModel does not come back to the field. When the screen is composed anew the ViewModel is still there, and the fields start from its value.

The line below shows what the ViewModel holds: the username, and the length of the password rather than the password itself. The button reads from it too: it cannot be pressed until there is a username and a long enough password.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

val viewModel = viewModel(key = "account") { AccountViewModel() }
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val initialUiState = remember(viewModel) { viewModel.uiState.value }
val uiState by viewModel.uiState.collectAsStateWithLifecycle()

val username = rememberTextFieldState(initialUiState.username)
LaunchedEffect(username) {
    snapshotFlow { username.text.toString() }.collectLatest { viewModel.updateUsername(it) }
}
PantrixTextField(
    state = username,
    modifier = Modifier.fillMaxWidth(),
    label = "Username",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
    contentType = ContentType.NewUsername,
    tagKey = "account_username"
)

val password = remember { TextFieldState(initialUiState.password) }
LaunchedEffect(password) {
    snapshotFlow { password.text.toString() }.collectLatest { viewModel.updatePassword(it) }
}
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "New password",
    supportingText = "At least 8 characters",
    contentType = ContentType.NewPassword,
    tagKey = "account_password"
)

PantrixText(
    text = "ViewModel: username \"${uiState.username}\", password length ${uiState.password.length}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "account_state"
)
PantrixButton(
    text = "Create account",
    onClick = {
        scope.launch {
            snackbars?.show(message = "Account created for ${uiState.username}", tagKey = "account_created")
        }
    },
    enabled = uiState.isComplete,
    tagKey = "create_account"
)

private class AccountViewModel : ViewModel() {
    private val state = MutableStateFlow(AccountUiState())
    val uiState: StateFlow<AccountUiState> = state.asStateFlow()

    fun updateUsername(username: String) {
        state.update { it.copy(username = username) }
    }

    fun updatePassword(password: String) {
        state.update { it.copy(password = password) }
    }
}

private data class AccountUiState(
    val username: String = "",
    val password: String = ""
) {
    val isComplete: Boolean get() = username.isNotBlank() && password.length >= 8
}
```

### A PIN that gives its text as a String

The secure field has no overload that takes `value` and `onValueChange`; for a caller that keeps its text as a `String`, one is built on top of the state. `PinInput` starts the field with `value`, follows the text in the state with `snapshotFlow` and reports each change through `onValueChange`. The flow is one way: `value` is the first value, and if it is changed from outside later, the field does not show the change. The supporting text is made from the `String` the caller holds, and says how many digits are missing.

This is a PIN: with `showRevealButton = false` it has no button to show its text, and with `TextObfuscationMode.Hidden` the last digit typed is not shown either. Its keyboard is the number keyboard (`KeyboardType.NumberPassword`); an input transformation turns down whatever is not a digit.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.TextObfuscationMode
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

var pin by remember { mutableStateOf("") }
PinInput(
    value = pin,
    onValueChange = { pin = it },
    label = "PIN",
    supportingText = if (pin.length == 6) "PIN complete" else "Digits left: ${6 - pin.length}",
    modifier = Modifier.fillMaxWidth()
)

@Composable
private fun PinInput(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    supportingText: String,
    modifier: Modifier = Modifier
) {
    val state = remember { TextFieldState(value) }
    val latestOnValueChange by rememberUpdatedState(onValueChange)
    LaunchedEffect(state) {
        snapshotFlow { state.text.toString() }.collect { latestOnValueChange(it) }
    }
    PantrixSecureTextField(
        state = state,
        modifier = modifier,
        label = label,
        supportingText = supportingText,
        showRevealButton = false,
        maxLength = 6,
        textObfuscationMode = TextObfuscationMode.Hidden,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
        inputTransformation = DigitsOnly,
        tagKey = "pin"
    )
}

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Disabled and read-only

A field with `enabled = false` takes no focus, is drawn in the theme's disabled colours and has no button to show its text.

A field with `readOnly = true` can be focused and its text can be shown with the button, but it cannot be changed: like a recovery code that is given once.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

PantrixSecureTextField(
    state = remember { TextFieldState("unchanging") },
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Disabled",
    supportingText = "It has no button to show its text",
    tagKey = "locked_password"
)
PantrixSecureTextField(
    state = remember { TextFieldState("PX-4821-9930") },
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Recovery code",
    supportingText = "Read-only: it can be shown but not changed",
    tagKey = "recovery_code"
)
```

### Its own colours and style

The secure field has no style class or colour class of its own: it takes the `TextFieldColors` and the `TextFieldStyle` of `PantrixTextField`. A product that restyles its text fields in the theme restyles its password fields with them.

In the first field the focused border, the caret and the icon colour are the app's own purple: the eye button is drawn in the icon colour too. The colours that are not given keep their role in the theme. The second field's box is fully round: `TextFieldStyle(shape = ShapeRole.Full)`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Wallet password",
    colors = TextFieldColors(focusedBorder = own.color, icon = own.color, cursor = own.color),
    tagKey = "own_colors"
)
PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Vault password",
    style = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixSecureTextField

`import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSecureTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field for what is not to be read over a shoulder: a password, a PIN, a card's security code.

What is typed is drawn as dots, and cannot be cut, copied or dragged out of the field. The platform is told that the field holds a password, and while the text is hidden it is given the dots for the text: a screen reader reads no password out, and a password manager still fills the field and saves it. The field holds one line.

A button at the box's end shows the text and hides it again. With a keyboard it is a Tab stop of its own, after the field, and the keyboard's `Next` goes past it to the next field. A press on it with a pointer leaves the caret where it is. That the text was shown is not saved: it is hidden again when the field is made anew, as it is after the screen turns.

It is the label, the box and the supporting text of `PantrixTextField` around Foundation's secure text field, and takes that component's `style` and `colors`: a product that restyles its text fields restyles its password fields with them. It is built on a `TextFieldState`, and has an overload for a form's field. Foundation's secure field has none of a value and a callback: the text is read from the state, where it is used or as it changes, and a caller that keeps it as a `String` is handed each change that way.

Parameters:

- `state: TextFieldState`: the text and the selection. Create it with `remember { TextFieldState() }`, or keep it in a view model: `rememberTextFieldState()` puts what is typed into the saved state, which the platform holds after the app's process has gone and may write to its disk. A remembered state goes when the screen is made anew, as it is after the screen turns, and the field is empty again. Read what was typed from it: `state.text` where the text is used, or `snapshotFlow { state.text.toString() }` to follow it as it changes.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it. `fillMaxWidth()` makes the box as wide as its parent.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn in the disabled colours, has no button to show its text and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, and shown by the button.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty. It is no label: it goes as soon as the user types.
- `supportingText: String?`: help under the box, in a smaller type. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the border, the label, the supporting text and the caret turn to the danger role, and a screen reader is told.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text, in the secondary text colour. A slot does not size what is put in it: `PantrixIcon(size = PantrixTheme.style(TextFieldStyle).iconSize)` is the platform's size.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text, after the clear button and the button that shows the text.
- `showClearButton: Boolean`: shows a button that empties the field, while the field can be typed into and is not empty. It leaves the caret in the field, and is no stop for Tab.
- `showRevealButton: Boolean`: shows the button that shows the text and hides it again, while the field is enabled. Without it the text stays as `textObfuscationMode` draws it: for a text that is never to be shown, and for a caller that shows it another way.
- `maxLength: Int?`: the most characters the user can enter, counted as `String.length` counts them. An edit that would pass the limit is turned down whole. Text set in code is not cut, and the user can still make it shorter. It has to be positive.
- `showCharacterCount: Boolean`: shows `count/maxLength` under the box while `maxLength` is set.
- `textObfuscationMode: TextObfuscationMode`: how the text is drawn while it is hidden. `TextObfuscationMode.System` does as the platform does: on Android the last character typed shows for a moment where the system's own setting says so, and nowhere else does anything show. `Hidden` shows nothing on any platform, and `RevealLastTyped` the last character for a moment on every one.
- `textObfuscationCharacter: Char`: what is drawn in place of a hidden character.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals, its corrections and its action key. What these leave unset is a password's, the password keyboard and no corrections, so that naming an action does not bring back a keyboard that learns what is typed. `KeyboardType.NumberPassword` is a PIN's.
- `onKeyboardAction: KeyboardActionHandler?`: called for the keyboard's action key, for the action `keyboardOptions` names. Null keeps what the platform does: `Next` moves the focus on, and `Done` closes the keyboard.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it. With `maxLength`, it comes first and the limit applies to what it lets through.
- `contentType: ContentType?`: what the field holds, for the platform to fill it in. Left out, the field holds `ContentType.Password`, as Foundation's secure field says for itself: `ContentType.NewPassword` is one that is being chosen.
- `style: TextFieldStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TextFieldColors?`: this call's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`. A `placeholder` that says the same is then left to the eye.
- `tagKey: String?`: the field's automation key: the field is `SecureTextField_<tagKey>`, its clear button `SecureTextFieldClear_<tagKey>` and the button that shows its text `SecureTextFieldReveal_<tagKey>`. The field reports that it took the focus, that it was cleared and that its text was shown or hidden, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixSecureTextField

`import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSecureTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A secure text field bound to a form's field: its text, its error and its name come from `field`.

The field's value and the text on screen stay in step both ways: typing changes the field, and a change made to the field in code, such as a reset, replaces the text. When the focus leaves the field and its buttons, the field is marked touched and checked, which is when an error first shows. While the field is in error its message takes the place of `supportingText`. The field's id is the automation key, `SecureTextField_<id>`, and the form can send the focus here when it is submitted with this field in error.

Parameters:

- `field: FormField<String>`: the field the text field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it. An action of `Next` or `Previous` moves the focus as it always does. A field that names no action gets `ImeAction.Done`, since the default action never reaches a handler. An `onKeyboardAction` of the caller's own takes the place of the submit.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text.
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
