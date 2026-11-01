# Time Text Field

A text field for a time of day: the time is typed in digits, or chosen from a time picker that the button at the box's end opens. The label stands above the box; the field is drawn as a `PantrixTextField`.

- `PantrixTimeTextField` (`com.pantrixui.components.date.timetextfield`, `com.pantrixui:components`): A text field for a time of day, typed in digits or chosen from a time picker its button opens, with its own errors for a time it does not take. Keywords: time input, hour minute, masked time, time entry, clock input.

## Features

- **Digits alone.** The field takes four digits at most; once the hour is whole the colon comes by itself: `1430` becomes `14:30`. A first digit that cannot start an hour is an hour of one digit: `930` becomes `09:30`. A phone opens its keyboard of digits.
- **A pasted time.** A time written out is read as it is written: `14:30`, `14.30`, `1430`, or with a half of the day, `2:30 PM`, `ÖS 2:30`. A second written after the minute is let go.
- **Twelve hours.** With `is24Hour = false` the hours are typed 01 to 12, and the half of the day stands in the box beside the digits as a button: a press, or Space while it has the focus, turns it, and on desktop and the web A and P do too. The default is 24 hours, as the picker's.
- **Value.** `onValueChange` is called each time the field's time changes: a whole time the field takes, or null while the field is empty, half typed, or holds digits that make no time. A half-typed time stays on the screen while `value` is null; another time from outside is written into the field, its second kept until the hour and minute are typed over.
- **Its own error.** The field writes what is wrong under the box itself: an unfinished time on leaving the field, a time the clock has not (25:00), a time outside `minTime` and `maxTime`. Where `minTime` is after `maxTime` the times run past midnight, as a night shift's. The app's `error` comes first; its message is `supportingText`.
- **Picker.** It opens with the button, with Alt+↓ on the desktop and the web, by pressing the box of a read-only field, and with Enter or Space; `presentation` chooses what it opens in: by default a sheet in a narrow window and a popover in a wider one; or in every window a popover, a sheet or a dialog. Every press in the picker writes the time into the field at once and the picker stays open, so the hour is chosen first and then the minutes; Enter on a value, Escape and pressing outside close it. Opened with the keyboard the focus goes to the chosen hour, or else to the current one. `minuteStep` sets only the picker's minutes; a minute in between can be typed.
- **Three forms.** The form that takes `value` and `onValueChange`; the form that takes a `state` (`rememberTimeTextFieldState()`): `time` is the field's time, `text` tells a half-typed field from an empty one; the form that takes a `field` is bound to a form's field.
- **The time type.** Times are `PantrixTime`; to put one together with a day, and to turn it into other libraries' types, see docs/guide/date-time/DATE_TIME_GUIDE.md.

## Usage

### A meeting's start, on the quarter hour

```kotlin
var start by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeTextField(
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
PantrixTimeTextField(
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
PantrixTimeTextField(
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

A meeting's start, on the quarter hour: the picker's minutes come fifteen apart. A minute between them can be typed too. Once the time is whole it is written below.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var start by remember { mutableStateOf<PantrixTime?>(null) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimeTextField(
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

A call within working hours: a time typed before 09:00 or after 18:00 is not taken, and the field says the two ends. In the picker the hours outside are faint and cannot be pressed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
import com.pantrixui.foundation.date.PantrixTime

var call by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeTextField(
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

A clock of twelve hours: the hours are typed 01 to 12, and the half of the day stands in the box beside the digits. A press on it turns it between AM and PM; the picker has it as a third column too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var alarm by remember { mutableStateOf<PantrixTime?>(PantrixTime(7, 30)) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimeTextField(
        value = alarm,
        onValueChange = { alarm = it },
        label = "Alarm",
        is24Hour = false,
        tagKey = "alarm"
    )
    PantrixText(
        text = alarm?.let { "Alarm: ${strings.time(it.hour, it.minute, is24Hour = false)}" } ?: "Alarm off",
        style = PantrixTheme.typography.body
    )
}
```

### The picker in a sheet or a dialog

The picker opens in a sheet: near the thumb on a phone, as wide as the screen. `presentation = Dialog` opens it in a dialog in the middle of the window. The sheet stays open at each press; a press outside or back closes it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.DatePickerPresentation
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var pickup by remember { mutableStateOf<PantrixTime?>(null) }
var presentation by remember { mutableStateOf(DatePickerPresentation.Sheet) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(DatePickerPresentation.Popover, "Popover", tagKey = "popover"),
            SegmentOption(DatePickerPresentation.Sheet, "Sheet", tagKey = "sheet"),
            SegmentOption(DatePickerPresentation.Dialog, "Dialog", tagKey = "dialog")
        ),
        selected = presentation,
        onSelect = { presentation = it },
        fullWidth = false,
        tagKey = "presentation"
    )
    PantrixTimeTextField(
        value = pickup,
        onValueChange = { pickup = it },
        label = "Pickup time",
        minuteStep = FIVE_MINUTES,
        presentation = presentation,
        tagKey = "pickup"
    )
}

private const val FIVE_MINUTES = 5
```

### The app's error and disabled

The app's own error comes before the field's: a time already taken is said with `error` and `supportingText`. The field under it is disabled: it takes no focus and opens no picker.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
import com.pantrixui.foundation.date.PantrixTime

var slot by remember { mutableStateOf<PantrixTime?>(PantrixTime(BOOKED, 0)) }
val taken = slot == PantrixTime(BOOKED, 0)
PantrixTimeTextField(
    value = slot,
    onValueChange = { slot = it },
    label = "Appointment time",
    supportingText = if (taken) "This time is taken, choose another" else "A half-hour appointment",
    error = taken,
    tagKey = "slot"
)
PantrixTimeTextField(
    value = PantrixTime(OPENS, 0),
    onValueChange = {},
    enabled = false,
    label = "Opening time",
    tagKey = "opening"
)

private const val OPENS = 9

private const val BOOKED = 14
```

### Read-only: from the picker alone

A read-only field is not typed into: the time is chosen from the picker alone. A press on the box, Enter or Space opens the picker. For a place where a time must be chosen from a list.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
import com.pantrixui.foundation.date.PantrixTime

var departure by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeTextField(
    value = departure,
    onValueChange = { departure = it },
    readOnly = true,
    label = "Departure time",
    placeholder = "Choose from the picker",
    minuteStep = QUARTER,
    tagKey = "departure"
)

private const val QUARTER = 15
```

### Bound to a form

Bound to a form's field: with no time, "Save" shows the error and sends the focus to the field. The error shows on leaving the field too; going into the picker is no leaving it. Digits that make no time leave the value null, and the rule catches it.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
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
PantrixTimeTextField(
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
import com.pantrixui.components.date.timetextfield.PantrixTimeTextField
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberTimeTextFieldState()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimeTextField(
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

### PantrixTimeTextField

`import com.pantrixui.components.date.timetextfield.PantrixTimeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTimeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text field for a time of day: the time is typed in digits, or chosen from a time picker that a button at the box's end opens.

It is drawn as `PantrixTextField` is, the label above the box, and takes digits alone, four at most: the colon comes in by itself once the hour is whole, so `1430` shows as `14:30`, and a first digit that cannot start an hour is an hour of one digit, so `930` shows as `09:30`. A phone shows its keyboard of digits. While the box is empty it shows the pattern, `SS:DD` in Turkish and `HH:MM` in English, which a screen reader is told as the order of the parts. A time pasted written out is read as it is written: `14:30`, `14.30`, `1430`, or `2:30 PM` with a half of the day; a second written after the minute is let go.

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
- `style: TextFieldStyle?`: this call's own style of the field: over every enclosing one and under the density.
- `colors: TextFieldColors?`: this call's own colours of the field, in place of the theme's roles.
- `pickerStyle: TimePickerStyle?`: this call's own style of the picker.
- `pickerColors: TimePickerColors?`: this call's own colours of the picker.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `TimeTextField_<tagKey>`, its button `TimeTextFieldClock_<tagKey>`, its half of the day `TimeTextFieldPeriod_<tagKey>`, its clear button `TimeTextFieldClear_<tagKey>` and its picker `TimePicker_<tagKey>`. The field reports that the picker opened and that a value was chosen in it, and never the time.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses.

### PantrixTimeTextField

`import com.pantrixui.components.date.timetextfield.PantrixTimeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTimeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A time field on a `state` its caller keeps, as `PantrixTimeTextField` of a value is in every other way: the state's `time` is the field's time, setting it writes the time in, and its `text` tells a field that is half typed from an empty one.

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
- `style: TextFieldStyle?`: this call's own style of the field.
- `colors: TextFieldColors?`: this call's own colours of the field.
- `pickerStyle: TimePickerStyle?`: this call's own style of the picker.
- `pickerColors: TimePickerColors?`: this call's own colours of the picker.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `tagKey: String?`: the field's automation key, as `PantrixTimeTextField` of a value takes it.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted.

### PantrixTimeTextField

`import com.pantrixui.components.date.timetextfield.PantrixTimeTextField`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTimeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A time field bound to a form's field: its time, its error and its name come from `field`.

The field's value is the time the time field holds, null while it holds none, and a change made to the value in code, a reset among them, is written in. When the user leaves the field, the picker not counting as leaving it, the field is marked touched and checked. While it is in error its message takes the place of `supportingText`, and of the time field's own error. Digits that make no time leave the value null: give the field a rule for null where a time is required, `Rules.required`, and its message is shown once the user has left. The field's id is the automation key, `TimeTextField_<id>`, and the form can send the focus here.

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
- `style: TextFieldStyle?`: this call's own style of the field.
- `colors: TextFieldColors?`: this call's own colours of the field.
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

### rememberTimeTextFieldState

`import com.pantrixui.components.date.common.rememberTimeTextFieldState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberTimeTextFieldState(initial: PantrixTime? = null): TimeTextFieldState
```

A `TimeTextFieldState` kept across recompositions, a configuration change and a process that is brought back.

Parameters:

- `initial: PantrixTime?`: the time the field starts with, or null for an empty one.

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
