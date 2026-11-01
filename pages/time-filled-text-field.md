# Time Filled Text Field

A filled text field for a time of day: `PantrixTimeTextField` in a filled box. The label is inside the box: while the field is empty and without the focus it rests in the text's place, it moves up as the field takes the focus, and the pattern (`HH:MM` in English) shows. Its digits, pasting, twelve hours, own errors and picker are as `PantrixTimeTextField`'s.

- `PantrixTimeFilledTextField` (`com.pantrixui.components.date.timefilledtextfield`, `com.pantrixui:components`): A filled text field for a time of day, typed in digits or chosen from a time picker its button opens, with its own errors for a time it does not take. Keywords: time input, filled time field, masked time, floating label.

## Usage

### A meeting's start, on the quarter hour

```kotlin
var start by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeFilledTextField(
    value = start,
    onValueChange = { start = it },
    label = stringResource(Res.string.meeting_start),
    minuteStep = 15,
    tagKey = "start"
)
```

### Within working hours

```kotlin
var call by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeFilledTextField(
    value = call,
    onValueChange = { call = it },
    label = stringResource(Res.string.call_time),
    minTime = PantrixTime(9, 0),
    maxTime = PantrixTime(18, 0),
    tagKey = "call"
)
```

### By a clock of twelve hours

```kotlin
var alarm by remember { mutableStateOf<PantrixTime?>(PantrixTime(7, 30)) }
PantrixTimeFilledTextField(
    value = alarm,
    onValueChange = { alarm = it },
    label = stringResource(Res.string.alarm),
    is24Hour = false,
    presentation = DatePickerPresentation.Sheet,
    tagKey = "alarm"
)
```

## Examples

### A meeting's start, on the quarter hour

A meeting's start, on the quarter hour: the picker's minutes come fifteen apart.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var start by remember { mutableStateOf<PantrixTime?>(null) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimeFilledTextField(
        value = start,
        onValueChange = { start = it },
        label = "Meeting start",
        minuteStep = QUARTER,
        showClearButton = true,
        tagKey = "meeting_start"
    )
    PantrixText(
        text = start?.let { "Start: ${strings.time(it.hour, it.minute, is24Hour = true)}" }
            ?: "No time yet",
        style = PantrixTheme.typography.body
    )
}

private const val QUARTER = 15
```

### Within working hours

A call within working hours: a time typed outside them is not taken, and the field says the two ends.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.foundation.date.PantrixTime

var call by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeFilledTextField(
    value = call,
    onValueChange = { call = it },
    label = "Call time",
    supportingText = "Weekdays from 09:00 to 18:00",
    minTime = PantrixTime(OPENS, 0),
    maxTime = PantrixTime(CLOSES, 0),
    tagKey = "call"
)

private const val OPENS = 9

private const val CLOSES = 18
```

### A clock of twelve hours

A clock of twelve hours: the half of the day stands in the box beside the digits and turns at a press.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.foundation.date.PantrixTime

var alarm by remember { mutableStateOf<PantrixTime?>(PantrixTime(7, 30)) }
PantrixTimeFilledTextField(
    value = alarm,
    onValueChange = { alarm = it },
    label = "Alarm",
    is24Hour = false,
    tagKey = "alarm"
)
```

### Bound to a form

Bound to a form's field: with no time, "Save" shows the error and sends the focus to the field.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.foundation.date.PantrixTime
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val report = LocalExampleEvents.current
val start = form.field<PantrixTime?>("shift_start", initial = null, Rules.required("Enter the shift's start"))
PantrixTimeFilledTextField(
    field = start,
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Shift start",
    minuteStep = QUARTER
)
PantrixButton(
    text = "Save",
    onClick = { scope.launch { form.submit { report("Saved") } } },
    form = form,
    tagKey = "save_shift"
)

private const val QUARTER = 15
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### On a state

On a state: `state.time` is the field's time, `state.text` the digits typed. Together they tell an empty field from a half-typed one. The button changes the state's time, and the field writes it in itself, by a clock of twelve hours with the half of the day.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.rememberTimeTextFieldState
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberTimeTextFieldState()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimeFilledTextField(
        state = state,
        label = "Reminder",
        is24Hour = false,
        tagKey = "reminder"
    )
    PantrixText(
        text = when {
            state.time != null -> "Time: ${state.time}"
            state.text.isEmpty() -> "The field is empty"
            else -> "Half typed: ${state.text}"
        },
        style = PantrixTheme.typography.body
    )
    PantrixButton(
        text = "Write now",
        onClick = { state.time = PantrixTime.now() },
        variant = ButtonVariant.Outline,
        tagKey = "write_now"
    )
}
```

## API

### PantrixTimeFilledTextField

`import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTimeFilledTextField(
    value: PantrixTime?,
    onValueChange: (PantrixTime?) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A filled text field for a time of day: the time is typed in digits, or chosen from a time picker that a button at the box's end opens. It is `PantrixTimeTextField` in a filled box.

It is drawn as `PantrixFilledTextField` is, the label inside the box where it rests in the text's place while the field is empty and without the focus, and the pattern shows once the label has moved up. It takes digits alone, four at most: the colon comes in by itself once the hour is whole, so `1430` shows as `14:30`, and a first digit that cannot start an hour is an hour of one digit, so `930` shows as `09:30`. A phone shows its keyboard of digits. While the box is empty it shows the pattern, `SS:DD` in Turkish and `HH:MM` in English, which a screen reader is told as the order of the parts. A time pasted written out is read as it is written: `14:30`, `14.30`, `1430`, or `2:30 PM` with a half of the day; a second written after the minute is let go.

By a clock of twelve hours, `is24Hour` false, the hours are typed 01 to 12 and the half of the day stands in the box beside them, as a button: a press on it, or Space while it holds the focus, turns it, and A and P typed in the field set it.

`onValueChange` is told the time the field holds each time it changes: a whole time the field takes, as it is typed or chosen, and null while the field is empty, half typed, or holds digits that make no time or a time it does not take. The field keeps what is typed itself, so a half-typed time stays on the screen while `value` is null. A `value` that is a time other than the field's is written in, and a null `value` empties a field that holds a time. A `value`'s second is kept while its hour and minute are not typed over; a time typed has none.

The field writes its own error under the box where what is typed is wrong: digits that make no whole time, once the user has left the field; a time the clock has not, 25 o'clock; and a time before `minTime` or after `maxTime`. An `error` of the caller's comes first, its `supportingText` the message.

The picker opens by its button, by Alt and ↓, and in a `readOnly` field by a press on the box, by Enter or by Space too: a read-only field takes a time from the picker alone. It opens in what `presentation` says, the same on every platform. A value pressed in it is the field's at once and leaves it open, so that the minute can be chosen after the hour; Enter on a value, Escape and a press outside close it. Opened by the keyboard, the focus goes to its chosen hour, or to the hour it is now, and comes back to the field as it closes.

Parameters:

- `value: PantrixTime?`: the time the field shows, or null.
- `onValueChange: (PantrixTime?) -> Unit`: told the field's time each time the user changes it: a time, or null for none.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the field can be used. One that cannot takes no focus and opens no picker.
- `readOnly: Boolean`: whether the time can only be chosen from the picker, and not typed.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader, and its picker's.
- `placeholder: String?`: shown in the box while it is empty, in the place of the pattern the field shows by itself.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right; without it, the field's own error takes its place while there is one.
- `error: Boolean`: whether the caller finds the time wrong, as a time already booked: the field is drawn in error, and `supportingText` is the message.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text. A slot does not size what is put in it.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `minTime: PantrixTime?`: the first time the field takes, or null for no first. Where it is after `maxTime`, the times run past midnight, as a night's do.
- `maxTime: PantrixTime?`: the last time the field takes, or null for no last.
- `minuteStep: Int`: how many minutes apart the picker's minutes are, 1 to 60. A minute typed between them is taken.
- `is24Hour: Boolean`: whether the field and its picker count the hours of a day, 00 to 23, or by a clock of twelve hours.
- `presentation: DatePickerPresentation`: what the picker opens in: by default a sheet in a narrow window and a popover under the box in a wider one, chosen as it opens; or always a popover, a sheet or a dialog.
- `style: FilledTextFieldStyle?`: this call's own style of the field: over every enclosing one and under the density.
- `colors: FilledTextFieldColors?`: this call's own colours of the field, in place of the theme's roles.
- `pickerStyle: TimePickerStyle?`: this call's own style of the picker.
- `pickerColors: TimePickerColors?`: this call's own colours of the picker.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `TimeFilledTextField_<tagKey>`, its button `TimeFilledTextFieldClock_<tagKey>`, its half of the day `TimeFilledTextFieldPeriod_<tagKey>`, its clear button `TimeFilledTextFieldClear_<tagKey>` and its picker `TimePicker_<tagKey>`. The field reports that the picker opened and that a value was chosen in it, and never the time.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses.

### PantrixTimeFilledTextField

`import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTimeFilledTextField(
    state: TimeTextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A time field on a `state` its caller keeps, as `PantrixTimeFilledTextField` of a value is in every other way: the state's `time` is the field's time, setting it writes the time in, and its `text` tells a field that is half typed from an empty one.

Parameters:

- `state: TimeTextFieldState`: the digits typed and the time they make. Create it with `rememberTimeTextFieldState()`.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the field can be used. One that cannot takes no focus and opens no picker.
- `readOnly: Boolean`: whether the time can only be chosen from the picker, and not typed.
- `label: String?`: what the field is for, written above the box: the field's name for a screen reader, and its picker's.
- `placeholder: String?`: shown in the box while it is empty, in the place of the pattern the field shows by itself.
- `supportingText: String?`: help under the box. With `error` it is the message; without it, the field's own error takes its place while there is one.
- `error: Boolean`: whether the caller finds the time wrong: the field is drawn in error, and `supportingText` is the message.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `minTime: PantrixTime?`: the first time the field takes, or null for no first; after `maxTime`, the times run past midnight.
- `maxTime: PantrixTime?`: the last time the field takes, or null for no last.
- `minuteStep: Int`: how many minutes apart the picker's minutes are, 1 to 60.
- `is24Hour: Boolean`: whether the field and its picker count the hours of a day, or by a clock of twelve hours.
- `presentation: DatePickerPresentation`: what the picker opens in: by default a sheet in a narrow window and a popover under the box in a wider one, chosen as it opens; or always a popover, a sheet or a dialog.
- `style: FilledTextFieldStyle?`: this call's own style of the field.
- `colors: FilledTextFieldColors?`: this call's own colours of the field.
- `pickerStyle: TimePickerStyle?`: this call's own style of the picker.
- `pickerColors: TimePickerColors?`: this call's own colours of the picker.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `tagKey: String?`: the field's automation key, as `PantrixTimeFilledTextField` of a value takes it.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted.

### PantrixTimeFilledTextField

`import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTimeFilledTextField(
    field: FormField<PantrixTime?>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A time field bound to a form's field: its time, its error and its name come from `field`.

The field's value is the time the time field holds, null while it holds none, and a change made to the value in code, a reset among them, is written in. When the user leaves the field, the picker not counting as leaving it, the field is marked touched and checked. While it is in error its message takes the place of `supportingText`, and of the time field's own error. Digits that make no time leave the value null: give the field a rule for null where a time is required, `Rules.required`, and its message is shown once the user has left. The field's id is the automation key, `TimeFilledTextField_<id>`, and the form can send the focus here.

Parameters:

- `field: FormField<PantrixTime?>`: the form's field the time field shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, the keyboard's action key submits the form through the button registered with it.
- `enabled: Boolean`: whether the field can be used.
- `readOnly: Boolean`: whether the time can only be chosen from the picker.
- `label: String?`: what the field is for, written above the box.
- `placeholder: String?`: shown in the box while it is empty, in the place of the pattern.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `minTime: PantrixTime?`: the first time the field takes, or null for no first; after `maxTime`, the times run past midnight.
- `maxTime: PantrixTime?`: the last time the field takes, or null for no last.
- `minuteStep: Int`: how many minutes apart the picker's minutes are, 1 to 60.
- `is24Hour: Boolean`: whether the field and its picker count the hours of a day, or by a clock of twelve hours.
- `presentation: DatePickerPresentation`: what the picker opens in: by default a sheet in a narrow window and a popover under the box in a wider one, chosen as it opens; or always a popover, a sheet or a dialog.
- `style: FilledTextFieldStyle?`: this call's own style of the field.
- `colors: FilledTextFieldColors?`: this call's own colours of the field.
- `pickerStyle: TimePickerStyle?`: this call's own style of the picker.
- `pickerColors: TimePickerColors?`: this call's own colours of the picker.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted.

### TimeTextFieldState

`import com.pantrixui.components.date.common.TimeTextFieldState`, from `com.pantrixui:components`

```kotlin
class TimeTextFieldState(initial: PantrixTime? = null)
```

What a time field holds, for a caller that keeps it itself: the digits typed into it so far, and the time they make.

`time` is the time the field takes: null while the field is empty, while what is typed is no whole time, names no time of the clock, or is a time the field does not take. Setting it writes the time into the field; setting it to null empties the field. A state the field is not drawing at the time keeps the time, and the field writes it once it is drawn. A time's second is kept while its hour and minute are not typed over.

Create it with `rememberTimeTextFieldState`, which keeps it across a configuration change and a process that is brought back.

Parameters:

- `initial: PantrixTime?`: the time the field starts with, or null for an empty one.

Members:

- `time: PantrixTime?`: The time the field takes, or null: see the class.
- `text: CharSequence`: The digits typed so far, without the mark the field shows between the hour and the minute: `143` for `14:3`. It tells a field that is half typed from an empty one, where `time` is null for both.
- `fun clear()`: Empties the field: no digit is left, and no time.

On the type:

- `TimeTextFieldState.Saver: Saver<TimeTextFieldState, Any>`: The saver `rememberTimeTextFieldState` keeps a state with.
