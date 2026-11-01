# Form

A form's fields, its rules and its submission. Not the components themselves but the state that holds them together: which field is in error, what waits while it is submitted and what Enter does are known not by each component but by the form.

## Features

- **Fields.** `rememberFormState()` sets up a form's state, `form.field(id, initial, rules…)` one of its fields. A field's `id` is its name in the form and the automation tag of the component bound to it: a component in a form needs no `tagKey`.
- **Bound components.** The text fields, the checkbox, the radio group, the switch, Select, MultiSelect, and the date and time fields take a `field`: they show its value, call `onValueChange` when it changes and `onFocusLost` when the focus leaves, and write the error under their box. A component that is none of them is bound to a field by hand.
- **Rules.** A `Rule` gives a value's error, or null. `Rules` carries the most common ones: `notBlank`, `required`, `mustBeTrue`, `minLength`, `maxLength`, `matches`, and `satisfies` for a rule that looks at something else. A field's rules are tried in turn; the first that fails gives the error.
- **When an error shows.** A field that is not touched shows no error: the error shows when the focus leaves the field, or when the form is submitted. A touched field is checked again at every change, and an error that is put right goes at once.
- **Submitting.** `form.submit { … }` checks every field first; where one fails, the focus goes to the first field in error and the block does not run. While the block runs `isSubmitting` is true: a button given the `form` looks loading for that time and takes no second press.
- **Enter.** In a text field given a `form`, the keyboard's action key submits the form: with the work of the button given the `form`, or the work given with `RegisterSubmit`. Where there are several buttons the last to register wins.
- **By hand.** `validateAll()` checks every field and counts it touched, `focusFirstError()` gives the focus to the first field in error, `isValid` says whether the form passes without showing any error, and `reset()` takes the form back to its start. `field.reset(value)` gives a field a new starting value: a saved address that comes from a server.

## Examples

### A sign-up form

A sign-up form with every rule of `Rules`: the name is not left blank (`notBlank`), the e-mail fits a pattern (`matches`), the password is at least eight and at most sixty-four characters (`minLength`, `maxLength`), the second password looks at the first (`satisfies`), the birthday and the country are not passed over (`required`), and the terms are accepted (`mustBeTrue`).

Press "Open account" without typing anything: all the errors show at once and the focus goes to the first field in error. Fill a field in: its error goes as you type. Once the form is valid the button looks loading while it is submitted; Enter in the last field does the same.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
val name = form.field("name", initial = "", Rules.notBlank("Type your name"))
val email = form.field(
    "email",
    initial = "",
    Rules.notBlank("Type your e-mail address"),
    Rules.matches(EMAIL, "This is not an e-mail address")
)
val password = form.field(
    "password",
    initial = "",
    Rules.minLength(8, "The password must be at least 8 characters"),
    Rules.maxLength(64, "The password can be at most 64 characters")
)
val again = form.field(
    "password_again",
    initial = "",
    Rules.notBlank("Type the password again"),
    Rules.satisfies<String>("The passwords are not the same") { it == password.value }
)
val birthday = form.field<PantrixDate?>("birthday", initial = null, Rules.required("Type your birthday"))
val country = form.field<String?>("country", initial = null, Rules.required("Choose a country"))
val terms = form.field("terms", initial = false, Rules.mustBeTrue("Accept the terms"))
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(field = name, modifier = Modifier.fillMaxWidth(), form = form, label = "Name")
    PantrixTextField(
        field = email,
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "E-mail",
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
    )
    PantrixSecureTextField(
        field = password,
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "Password",
        supportingText = "At least 8 characters"
    )
    PantrixSecureTextField(
        field = again,
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "Password, again"
    )
    PantrixDateTextField(field = birthday, form = form, label = "Birthday", maxDate = rememberToday())
    PantrixSelect(
        field = country,
        options = COUNTRIES,
        modifier = Modifier.fillMaxWidth(),
        label = "Country",
        placeholder = "Choose"
    )
    PantrixCheckbox(field = terms, label = "I accept the terms of use")
    PantrixButton(
        text = "Open account",
        onClick = {
            scope.launch {
                form.submit {
                    delay(SUBMIT_MILLIS)
                    report("Account opened: ${email.value}")
                }
            }
        },
        modifier = Modifier.fillMaxWidth(),
        form = form,
        tagKey = "sign_up"
    )
}

private val COUNTRIES = listOf(
    SelectOption("TR", "Türkiye"),
    SelectOption("DE", "Germany"),
    SelectOption("NL", "the Netherlands"),
    SelectOption("GB", "United Kingdom")
)

private val EMAIL = Regex("[^@\\s]+@[^@\\s]+\\.[^@\\s]+")

private const val SUBMIT_MILLIS = 1_200L
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Your own rule

The app's own rule: a `Rule` is a single function that gives a value's error, or null. Here the user name has three rules: at least three characters (`Rules.minLength`), only small letters, digits and underscores (`Rules.matches`), and the app's own: the name must not be taken. The rules are tried in turn; the first that fails gives the error.

"Check" checks the form by hand: `validateAll()` counts every field touched and checks it, and where one fails `focusFirstError()` gives the focus to the first field in error. Type "admin", "pantrix" or "support" and try.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rule
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val form = rememberFormState()
val handle = form.field(
    "handle",
    initial = "",
    Rules.minLength(3, "The user name must be at least 3 characters"),
    Rules.matches(HANDLE, "Only small letters, digits and underscores"),
    FreeHandle
)
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(
        field = handle,
        modifier = Modifier.fillMaxWidth(),
        label = "User name",
        supportingText = "For example ayse_42"
    )
    PantrixButton(
        text = "Check",
        onClick = {
            if (form.validateAll()) report("“${handle.value}” is free") else form.focusFirstError()
        },
        variant = ButtonVariant.Outline,
        tagKey = "check_handle"
    )
}

private val HANDLE = Regex("[a-z0-9_]+")

private val FreeHandle = Rule<String> { value -> "“$value” is taken".takeIf { value.lowercase() in TAKEN_HANDLES } }

private val TAKEN_HANDLES = setOf("admin", "pantrix", "support")
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Enter and your own send button

A comment row: what sends it is not a `PantrixButton` given a `form` but the icon button at the row's end. `RegisterSubmit` points Enter at its work; in a text field given a `form`, Enter submits the form with that work.

`isSubmitting` is true while the submission runs: a spinner stands in the icon button's place. When the work is done `reset()` takes the field back to its start: a new comment begins empty and with no error. Try to send an empty comment: the error shows, and the focus stays in the field.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.form.RegisterSubmit
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
val comment = form.field(
    "comment",
    initial = "",
    Rules.notBlank("Write something"),
    Rules.maxLength(280, "A comment can be at most 280 characters")
)
val send: () -> Unit = {
    scope.launch {
        form.submit {
            delay(SUBMIT_MILLIS)
            report("Sent: ${comment.value}")
            form.reset()
        }
    }
}
form.RegisterSubmit(send)
Row(
    modifier = Modifier.widthIn(max = 480.dp),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.Top
) {
    PantrixTextField(
        field = comment,
        modifier = Modifier.weight(1f),
        form = form,
        placeholder = "Write a comment",
        contentDescription = "Comment"
    )
    if (form.isSubmitting) {
        PantrixSpinner(contentDescription = "Sending")
    } else {
        PantrixIconButton(
            imageVector = PantrixIcons.ArrowForward,
            contentDescription = "Send",
            onClick = send,
            variant = ButtonVariant.Solid,
            tagKey = "send"
        )
    }
}

private const val SUBMIT_MILLIS = 1_200L
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### The form's state, and starting over

Reading the form's state: `isValid` says whether the form passes without showing any error, `fields` gives its fields; each field has its `isValid()`, its `touched` and its `error`. The lines underneath change as you type.

"Bring the saved address" gives the fields a new starting value with `reset(value)`: as a record that comes from a server, untouched and with no error. "Start over" takes every field back to its first value with `form.reset()`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val form = rememberFormState()
val street = form.field("street", initial = "", Rules.notBlank("Type the street"))
val city = form.field("city", initial = "", Rules.notBlank("Type the city"))
val postcode = form.field("postcode", initial = "", Rules.matches(POSTCODE, "A postcode is five digits"))
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(field = street, modifier = Modifier.fillMaxWidth(), label = "Street")
    PantrixTextField(field = city, modifier = Modifier.fillMaxWidth(), label = "City")
    PantrixTextField(
        field = postcode,
        modifier = Modifier.fillMaxWidth(),
        label = "Postcode",
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
    )
    val missing = form.fields.filterNot { it.isValid() }.map { ADDRESS_LABELS.getValue(it.id) }
    PantrixText(
        text = if (form.isValid) "The address is complete" else "Missing: ${missing.joinToString()}",
        style = PantrixTheme.typography.footnote,
        tagKey = "address_state"
    )
    PantrixText(
        text = "Fields touched: ${form.fields.count { it.touched }} / ${form.fields.size}, " +
            "showing an error: ${form.fields.count { it.error != null }}",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(
            text = "Bring the saved address",
            onClick = {
                street.reset("Atatürk Bulvarı 12")
                city.reset("Ankara")
                postcode.reset("06690")
            },
            variant = ButtonVariant.Outline,
            tagKey = "saved_address"
        )
        PantrixButton(
            text = "Start over",
            onClick = form::reset,
            variant = ButtonVariant.Text,
            tagKey = "start_over"
        )
    }
}

private val POSTCODE = Regex("[0-9]{5}")

private val ADDRESS_LABELS = mapOf("street" to "street", "city" to "city", "postcode" to "postcode")
```

### A component bound by hand

A component that takes no `field` joins a form too: it shows the field's `value`, calls `onValueChange` when it changes and `onFocusLost` when the focus leaves it, and writes the `error` itself. With the `focusRequester` bound to it, `focusFirstError()` can give the focus to it too. Here the delivery time is a `PantrixSegmentButton`, and no order is placed until one is chosen.

Press "Place the order" without choosing a time: the error shows under the segments and the focus goes to them.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val form = rememberFormState()
val slot = form.field<String?>("delivery", initial = null, Rules.required("Choose a delivery time"))
val note = form.field("note", initial = "", Rules.maxLength(80, "A note can be at most 80 characters"))
var hadFocus by remember { mutableStateOf(false) }
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Delivery time", style = PantrixTheme.typography.footnote)
        PantrixSegmentButton(
            options = DELIVERY_SLOTS,
            selected = slot.value,
            onSelect = slot::onValueChange,
            modifier = Modifier
                .focusRequester(slot.focusRequester)
                .onFocusChanged { focus ->
                    if (hadFocus && !focus.hasFocus) slot.onFocusLost()
                    hadFocus = focus.hasFocus
                },
            tagKey = slot.id
        )
        slot.error?.let { error ->
            PantrixText(
                text = error,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.danger.color
            )
        }
    }
    PantrixTextField(field = note, modifier = Modifier.fillMaxWidth(), form = form, label = "Note to the courier")
    PantrixButton(
        text = "Place the order",
        onClick = {
            val chosen = DELIVERY_SLOTS.first { it.value == slot.value }
            report("Order placed: ${chosen.label}")
        },
        form = form,
        tagKey = "order"
    )
}

private val DELIVERY_SLOTS = listOf(
    SegmentOption<String?>("morning", "Morning", tagKey = "morning"),
    SegmentOption<String?>("afternoon", "Afternoon", tagKey = "afternoon"),
    SegmentOption<String?>("evening", "Evening", tagKey = "evening")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

## API

### FormState

`import com.pantrixui.components.elements.form.FormState`, from `com.pantrixui:components`

```kotlin
class FormState
```

A form's fields and its submission lifecycle.

Holds three things components would otherwise each reinvent, differently: which field to focus when validation fails, whether a submission is in flight, and what Enter does.

`@Stable` is a claim the compiler cannot prove but the class honours: everything a composable reads is snapshot state, and the one plain field — the submit handler — is never read during composition. Without it the compiler reports the class unstable, and the compiler-metrics gate rejects every component that takes a `form`.

Members:

- `fields: List<FormField<*>>`: The form's fields, in the order they were declared: the first one in error takes the focus on a submit.
- `isSubmitting: Boolean`: True while `submit` is running.

  `PantrixButton(form = ...)` reads this for its loading state, so a form cannot be submitted twice by an impatient second tap — the disabled state comes from the same source of truth as the spinner rather than from a separate flag someone has to remember to set.
- `isValid: Boolean`: Whether every field currently passes, without marking anything touched.
- `fun validateAll(): Boolean`: Validates everything and marks every field touched, so errors become visible.

  Touching on submit is what makes "press submit on an empty form" show all the errors at once rather than one per attempt.
- `fun focusFirstError(): Boolean`: Moves focus to the first field in error. Returns false when there is nothing to focus.

  Scrolling a long form to the problem is the difference between a fixable error and a user staring at a submit button that does nothing. Skips fields whose component is not currently composed — requesting focus on a detached FocusRequester throws.
- `suspend fun submit(block: suspend () -> Unit)`: Validates, then runs `block` if everything passed.

  Owns `isSubmitting` around the call so the flag cannot be left stuck on by an early return or an exception — the single most common bug in hand-written form submission.
- `fun reset()`: Starts the form over. Every field on screen goes back to its initial value, untouched and without an error, and is still validated. Fields that have left the screen are forgotten; one that comes back registers again.
- `fun requestSubmit()`: Invoked when a field reports that Enter was pressed.

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

### FormField

`import com.pantrixui.components.elements.form.FormField`, from `com.pantrixui:components`

```kotlin
class FormField<T>
```

One field in a form: its value, its rules, and whether it is currently in error.

`id` doubles as the component's automation tag, so a form-bound component needs no `tagKey` — the field already carries a stable, locale-independent name.

`@Stable` for the same reason as `FormState`: `value`, `error` and `touched` are snapshot state, and `isAttached` is bookkeeping that composition never reads.

Parameters:

- `id: String`: The field's name in its form, and the automation tag of the component bound to it.

Members:

- `value: T`: What the field holds now: its first value until the user gives another, and that value again after a reset.
- `error: String?`: The message to show, or null.

  Stays null until the field has been `touched` or the form has been submitted. Showing "Required" the instant a form opens tells the user they have done something wrong before they have done anything at all.
- `touched: Boolean`: True once the user has interacted with this field.
- `focusRequester: FocusRequester`: What the field is focused by: the component bound to it attaches it, and a submit that finds the field in error moves the focus there.
- `fun onValueChange(newValue: T)`: Called by components on change. Re-validates only once the field has been touched.

  `newValue`: the value the user has given the field.
- `fun onFocusLost()`: Called by components on blur. Marks touched and validates, which is the usual moment to show an error.
- `fun validate(): Boolean`: Runs every rule and publishes the first failure. Returns true when the field is valid.
- `fun isValid(): Boolean`: Whether the field would pass, without publishing an error the user has not earned yet.
- `fun reset(newValue: T)`: Puts the field back as it was before the user touched it: `newValue` as its value, and no error.

### Rule

`import com.pantrixui.components.elements.form.Rule`, from `com.pantrixui:components`

```kotlin
fun interface Rule<in T>
```

A validation rule. Returns the error message, or null when the value is acceptable.

Rules carry their own message rather than an error code because the message has to be translated by whoever wrote the form — the library cannot know that a field called `code` wants "Enter the 6-digit code" rather than "Invalid input".

Members:

- `fun check(value: T): String?`: The error message for `value`, or null when `value` is acceptable.

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

### FormState.RegisterSubmit

`import com.pantrixui.components.elements.form.RegisterSubmit`, from `com.pantrixui:components`

```kotlin
@Composable
fun FormState.RegisterSubmit(onSubmit: () -> Unit)
```

Points Enter at a submit action.

The last registration wins, which matches what a user expects on a form with both "Save" and "Save and add another": Enter triggers the primary action, and the primary action is the one declared last in the footer.

Parameters:

- `onSubmit: () -> Unit`: what Enter in a field of the form does: the form's primary action.
