# Date Filled Text Field

A filled text field for a day: `PantrixDateTextField` in a filled box. The label is inside the box: while the field is empty and without the focus it rests in the text's place, it moves up as the field takes the focus, and the pattern (`MM/DD/YYYY` in American English) shows.

- `PantrixDateFilledTextField` (`com.pantrixui.components.date.datefilledtextfield`, `com.pantrixui:components`): A filled text field for a day, typed in digits in the locale's order or chosen from a calendar its button opens, with its own errors for a day it does not take. Keywords: date input, filled date field, birthday, masked date, floating label.

## Features

- **The same field.** The digits, the format, its own errors, the calendar and the three overloads (`value`, `state`, `field`) are `PantrixDateTextField`'s; only the box is drawn as `PantrixFilledTextField`'s.
- **Style and colours.** `style` (`FilledTextFieldStyle`) and `colors` (`FilledTextFieldColors`) are the box's, `pickerStyle` and `pickerColors` the calendar's.

## Usage

### A birthday, typed

```kotlin
var birthday by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDateFilledTextField(
    value = birthday,
    onValueChange = { birthday = it },
    label = stringResource(Res.string.birthday),
    maxDate = rememberToday(),
    tagKey = "birthday"
)
```

### A delivery day on a weekday, from a sheet

```kotlin
var delivery by remember { mutableStateOf<PantrixDate?>(null) }
val today = rememberToday()
PantrixDateFilledTextField(
    value = delivery,
    onValueChange = { delivery = it },
    label = stringResource(Res.string.delivery_day),
    minDate = today.plusDays(1),
    maxDate = today.plusMonths(1),
    isDateEnabled = { it.dayOfWeek <= 5 },
    presentation = DatePickerPresentation.Sheet,
    tagKey = "delivery"
)
```

### On a state, half typed or whole

```kotlin
val start = rememberDateTextFieldState()
PantrixDateFilledTextField(
    state = start,
    label = stringResource(Res.string.start_date),
    format = DateFieldFormat.Iso,
    tagKey = "start"
)
val shown = start.date?.toString() ?: if (start.text.isEmpty()) "–" else "…"
```

## Examples

### A birthday

A birthday, in a filled box: a day after today is not taken. The label moves up as the field takes the focus, and the pattern shows.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday

var birthday by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDateFilledTextField(
    value = birthday,
    onValueChange = { birthday = it },
    label = "Birthday",
    maxDate = rememberToday(),
    showClearButton = true,
    tagKey = "birthday"
)
```

### The calendar in a dialog

A delivery day on a weekday; the calendar opens in a dialog in the middle of the window.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.DatePickerPresentation
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday

var delivery by remember { mutableStateOf<PantrixDate?>(null) }
val today = rememberToday()
PantrixDateFilledTextField(
    value = delivery,
    onValueChange = { delivery = it },
    label = "Delivery day",
    minDate = today.plusDays(1),
    maxDate = today.plusMonths(1),
    isDateEnabled = { it.dayOfWeek <= FRIDAY },
    presentation = DatePickerPresentation.Dialog,
    tagKey = "delivery"
)

private const val FRIDAY = 5
```

### The app's error and disabled

The app's error and a disabled field, in a filled box.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.foundation.date.PantrixDate

var meeting by remember { mutableStateOf<PantrixDate?>(PantrixDate(2026, 11, 2)) }
val taken = meeting == PantrixDate(2026, 11, 2)
PantrixDateFilledTextField(
    value = meeting,
    onValueChange = { meeting = it },
    label = "Meeting day",
    supportingText = if (taken) "This day is taken, choose another" else "A day the office is open",
    error = taken,
    tagKey = "meeting"
)
PantrixDateFilledTextField(
    value = PantrixDate(2026, 10, 1),
    onValueChange = {},
    enabled = false,
    label = "Contract start",
    tagKey = "contract"
)
```

### Bound to a form

Bound to a form's field, in a filled box: with no day, "Save" shows the error.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val report = LocalExampleEvents.current
val start = form.field<PantrixDate?>("start", initial = null, Rules.required("Enter the start day"))
PantrixDateFilledTextField(
    field = start,
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Start day",
    minDate = rememberToday()
)
PantrixButton(
    text = "Save",
    onClick = { scope.launch { form.submit { report("Saved") } } },
    form = form,
    tagKey = "save_start"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### On a state

On a state: `state.date` is the field's day, `state.text` the digits typed. Together they tell an empty field from a half-typed one. The button changes the state's day, and the field writes it in itself.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.rememberDateTextFieldState
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberDateTextFieldState()
val today = rememberToday()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixDateFilledTextField(
        state = state,
        label = "Report day",
        tagKey = "report_day"
    )
    PantrixText(
        text = when {
            state.date != null -> "Day: ${state.date}"
            state.text.isEmpty() -> "The field is empty"
            else -> "Half typed: ${state.text}"
        },
        style = PantrixTheme.typography.body
    )
    PantrixButton(
        text = "Write today",
        onClick = { state.date = today },
        variant = ButtonVariant.Outline,
        tagKey = "write_today"
    )
}
```

## API

### PantrixDateFilledTextField

`import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDateFilledTextField(
    value: PantrixDate?,
    onValueChange: (PantrixDate?) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    today: PantrixDate = rememberToday(),
    format: DateFieldFormat = DateFieldFormat.of(PantrixTheme.locale),
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A filled text field for a day: the day is typed in digits, or chosen from a calendar that a button at the box's end opens. It is `PantrixDateTextField` in a filled box.

It is drawn as `PantrixFilledTextField` is, the label inside the box where it rests in the text's place while the field is empty and without the focus, and the pattern shows once the label has moved up. It takes digits alone: the `format`'s mark comes in by itself as each part of the day is whole, so `18102026` shows as `18.10.2026` in Turkish and `10182026` as `10/18/2026` in American English. A phone shows its keyboard of digits. While the box is empty it shows the pattern, `GG.AA.YYYY` in Turkish and `MM/DD/YYYY` in American English, which a screen reader is told as the order of the parts. A day pasted written out is read as it is written, in the `format`'s order and else with the year first as ISO 8601 has it: `2026-10-18` pasted in Turkish shows as `18.10.2026`, and a year of two digits is the one of the hundred years around `today` that ends in them.

`onValueChange` is told the day the field holds each time it changes: a whole day the calendar takes, as it is typed or chosen, and null while the field is empty, half typed, or holds digits that make no day or a day it does not take. The field keeps what is typed itself, so a half-typed day stays on the screen while `value` is null. A `value` that is a day other than the field's is written in, and a null `value` empties a field that holds a day.

The field writes its own error under the box where what is typed is wrong: digits that make no whole day, once the user has left the field; a day the calendar has not, the 31st of February; a day before `minDate` or after `maxDate`; and a day `isDateEnabled` turns down. An `error` of the caller's comes first, its `supportingText` the message.

The calendar opens by its button, by Alt and ↓, and in a `readOnly` field by a press on the box, by Enter or by Space too: a read-only field takes a day from the calendar alone. It opens in what `presentation` says, the same on every platform. A day pressed in it is the field's at once and closes it; Escape and a press outside close it and change nothing. Opened by the keyboard, the focus goes to its chosen day, or to today, and comes back to the field as it closes.

Parameters:

- `value: PantrixDate?`: the day the field shows, or null.
- `onValueChange: (PantrixDate?) -> Unit`: told the field's day each time the user changes it: a day, or null for none.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the field can be used. One that cannot takes no focus and opens no calendar.
- `readOnly: Boolean`: whether the day can only be chosen from the calendar, and not typed.
- `label: String?`: what the field is for, inside the box: the field's name for a screen reader, and its calendar's.
- `placeholder: String?`: shown in the box while it is empty, in the place of the pattern the field shows by itself.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right; without it, the field's own error takes its place while there is one.
- `error: Boolean`: whether the caller finds the day wrong, as a day already taken: the field is drawn in error, and `supportingText` is the message.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text. A slot does not size what is put in it.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `minDate: PantrixDate?`: the first day the field takes, or null for no first. Not after `maxDate`.
- `maxDate: PantrixDate?`: the last day the field takes, or null for no last.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: whether the field takes a day between the two, or null for every day: a weekday, a day not yet booked.
- `firstDayOfWeek: Int?`: the day the calendar's weeks start on, 1 for Monday to 7 for Sunday as ISO 8601 numbers them, or null for the language's.
- `today: PantrixDate`: the day the calendar marks as today: by default the one the screen's clock shows (`rememberToday`), which turns at midnight.
- `format: DateFieldFormat`: the order the parts are typed in and the mark between them: the theme's language's and region's by default. `of`: The role of the theme this tone is drawn in.
- `presentation: DatePickerPresentation`: what the calendar opens in: by default a sheet in a narrow window and a popover under the box in a wider one, chosen as it opens; or always a popover, a sheet or a dialog.
- `style: FilledTextFieldStyle?`: this call's own style of the field: over every enclosing one and under the density.
- `colors: FilledTextFieldColors?`: this call's own colours of the field, in place of the theme's roles.
- `pickerStyle: DatePickerStyle?`: this call's own style of the calendar.
- `pickerColors: DatePickerColors?`: this call's own colours of the calendar.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `DateFilledTextField_<tagKey>`, its button `DateFilledTextFieldCalendar_<tagKey>`, its clear button `DateFilledTextFieldClear_<tagKey>` and its calendar `DatePicker_<tagKey>`. The field reports that the calendar opened and that a day was chosen in it, and never the day.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses.

### PantrixDateFilledTextField

`import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDateFilledTextField(
    state: DateTextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    today: PantrixDate = rememberToday(),
    format: DateFieldFormat = DateFieldFormat.of(PantrixTheme.locale),
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A date field on a `state` its caller keeps, as `PantrixDateFilledTextField` of a value is in every other way: the state's `date` is the field's day, setting it writes the day in, and its `text` tells a field that is half typed from an empty one.

Parameters:

- `state: DateTextFieldState`: the digits typed and the day they make. Create it with `rememberDateTextFieldState()`.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the field can be used. One that cannot takes no focus and opens no calendar.
- `readOnly: Boolean`: whether the day can only be chosen from the calendar, and not typed.
- `label: String?`: what the field is for, inside the box: the field's name for a screen reader, and its calendar's.
- `placeholder: String?`: shown in the box while it is empty, in the place of the pattern the field shows by itself.
- `supportingText: String?`: help under the box. With `error` it is the message; without it, the field's own error takes its place while there is one.
- `error: Boolean`: whether the caller finds the day wrong: the field is drawn in error, and `supportingText` is the message.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `minDate: PantrixDate?`: the first day the field takes, or null for no first. Not after `maxDate`.
- `maxDate: PantrixDate?`: the last day the field takes, or null for no last.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: whether the field takes a day between the two, or null for every day.
- `firstDayOfWeek: Int?`: the day the calendar's weeks start on, 1 for Monday to 7 for Sunday, or null for the language's.
- `today: PantrixDate`: the day the calendar marks as today: by default the one the screen's clock shows (`rememberToday`).
- `format: DateFieldFormat`: the order the parts are typed in and the mark between them: the theme's locale's by default. `of`: The role of the theme this tone is drawn in.
- `presentation: DatePickerPresentation`: what the calendar opens in: by default a sheet in a narrow window and a popover under the box in a wider one, chosen as it opens; or always a popover, a sheet or a dialog.
- `style: FilledTextFieldStyle?`: this call's own style of the field.
- `colors: FilledTextFieldColors?`: this call's own colours of the field.
- `pickerStyle: DatePickerStyle?`: this call's own style of the calendar.
- `pickerColors: DatePickerColors?`: this call's own colours of the calendar.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `tagKey: String?`: the field's automation key, as `PantrixDateFilledTextField` of a value takes it.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted.

### PantrixDateFilledTextField

`import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDateFilledTextField(
    field: FormField<PantrixDate?>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    today: PantrixDate = rememberToday(),
    format: DateFieldFormat = DateFieldFormat.of(PantrixTheme.locale),
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A date field bound to a form's field: its day, its error and its name come from `field`.

The field's value is the day the date field holds, null while it holds none, and a change made to the value in code, a reset among them, is written in. When the user leaves the field, the calendar not counting as leaving it, the field is marked touched and checked. While it is in error its message takes the place of `supportingText`, and of the date field's own error. Digits that make no day leave the value null: give the field a rule for null where a day is required, and its message is shown once the user has left. The field's id is the automation key, `DateFilledTextField_<id>`, and the form can send the focus here.

Parameters:

- `field: FormField<PantrixDate?>`: the form's field the date field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it.
- `enabled: Boolean`: whether the field can be used.
- `readOnly: Boolean`: whether the day can only be chosen from the calendar.
- `label: String?`: what the field is for, inside the box.
- `placeholder: String?`: shown in the box while it is empty, in the place of the pattern.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `minDate: PantrixDate?`: the first day the field takes, or null for no first. Not after `maxDate`.
- `maxDate: PantrixDate?`: the last day the field takes, or null for no last.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: whether the field takes a day between the two, or null for every day.
- `firstDayOfWeek: Int?`: the day the calendar's weeks start on, 1 for Monday to 7 for Sunday, or null for the language's.
- `today: PantrixDate`: the day the calendar marks as today: by default the one the screen's clock shows (`rememberToday`).
- `format: DateFieldFormat`: the order the parts are typed in and the mark between them: the theme's locale's by default. `of`: The role of the theme this tone is drawn in.
- `presentation: DatePickerPresentation`: what the calendar opens in: by default a sheet in a narrow window and a popover under the box in a wider one, chosen as it opens; or always a popover, a sheet or a dialog.
- `style: FilledTextFieldStyle?`: this call's own style of the field.
- `colors: FilledTextFieldColors?`: this call's own colours of the field.
- `pickerStyle: DatePickerStyle?`: this call's own style of the calendar.
- `pickerColors: DatePickerColors?`: this call's own colours of the calendar.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted.

### DateTextFieldState

`import com.pantrixui.components.date.common.DateTextFieldState`, from `com.pantrixui:components`

```kotlin
class DateTextFieldState(initial: PantrixDate? = null)
```

What a date field holds, for a caller that keeps it itself: the digits typed into it so far, and the day they make.

`date` is the day the field takes: null while the field is empty, while what is typed is no whole day, names no day of the calendar, or is a day the field does not take. Setting it writes the day into the field, which shows it as its format writes it; setting it to null empties the field. A state the field is not drawing at the time keeps the day, and the field writes it once it is drawn.

Create it with `rememberDateTextFieldState`, which keeps it across a configuration change and a process that is brought back.

Parameters:

- `initial: PantrixDate?`: the day the field starts with, or null for an empty one.

Members:

- `date: PantrixDate?`: The day the field takes, or null: see the class.
- `text: CharSequence`: The digits typed so far, without the marks the field shows between the parts: `1810` for `18.10.`. It tells a field that is half typed from an empty one, where `date` is null for both.
- `fun clear()`: Empties the field: no digit is left, and no day.

On the type:

- `DateTextFieldState.Saver: Saver<DateTextFieldState, Any>`: The saver `rememberDateTextFieldState` keeps a state with.

### DateFieldFormat

`import com.pantrixui.components.date.common.DateFieldFormat`, from `com.pantrixui:components`

```kotlin
data class DateFieldFormat(
    public val order: DateFieldOrder,
    public val separator: Char
)
```

How a date field takes a day: the order of its parts, and the mark that stands between them. The day and the month are two digits each and the year four, whatever the order, so a whole day is eight digits.

Only the digits are typed: the field puts the mark in itself as each part is filled, and a press on Backspace after it takes the digit before it away. The order is the field's setting and not a word, so it is no part of the strings pack: what the pack gives a field is the letters its pattern is written in, "DD", "MM" and "YYYY".

Parameters:

- `order: DateFieldOrder`: the order the parts are typed and shown in.
- `separator: Char`: what stands between the parts on the screen: a mark, never a letter, a digit or a space.

On the type:

- `DateFieldFormat.DayMonthYearDots: DateFieldFormat`: `18.10.2026`: Turkish, German, Russian, Polish and the Nordic languages but Swedish.
- `DateFieldFormat.DayMonthYearSlashes: DateFieldFormat`: `18/10/2026`: British English, French, Spanish, Italian, Portuguese, Greek and Arabic.
- `DateFieldFormat.MonthDayYearSlashes: DateFieldFormat`: `10/18/2026`: American English.
- `DateFieldFormat.Iso: DateFieldFormat`: `2026-10-18`: ISO 8601, and Swedish and Lithuanian.
- `DateFieldFormat.of(locale: PantrixLocale): DateFieldFormat`: The format `locale`'s language writes a day in with digits, and for English its region: the United States and an English with no region name the month first, Canada writes ISO 8601, and the rest of the English speaking world the day first. A language Pantrix knows no order for is given ISO 8601, which reads the same everywhere.

### DatePickerPresentation

`import com.pantrixui.components.date.common.DatePickerPresentation`, from `com.pantrixui:components`

```kotlin
enum class DatePickerPresentation
```

What a date control opens what it shows in, a field's calendar or an elastic date picker's panels: the same on every platform. A sheet and a dialog stand over a scrim, and none of them has a title over what it holds.

Entries:

- `Popover`: A popover beside the part that was pressed: under a field's box, or beside a part of an elastic date picker.
- `Sheet`: A sheet from the window's edge, with no title over what it holds.
- `Dialog`: A dialog in the middle of the window, over a scrim, as wide as what it holds and with no title over it.
- `Adaptive`: A sheet in a narrow window, the `Compact` width class, within the thumb's reach on a phone, and a popover in every wider one. The window is the one the control's overlay is shown over, and it is asked as the picker opens: one that is open stays as it is when the window changes.
