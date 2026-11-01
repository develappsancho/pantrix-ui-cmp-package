# Date Picker

Choosing a day or a stretch of days from a calendar turned a month at a time. The calendar is the choice itself: it stands in the page, or is put in a popover, a dialog or a sheet. It does not keep the choice; the chosen day comes to `onSelect`.

- `PantrixDatePicker` (`com.pantrixui.components.date.datepicker`, `com.pantrixui:components`): A calendar to choose a day or a stretch of days from, a month at a time, with the days that cannot be chosen drawn faint and a grid of years to turn it far. Keywords: calendar, date selector, date range, month view, day picker.

## Features

- **Navigation.** The arrows turn the month; pressing the title shows the years in place of the days, and choosing a year turns the calendar to the same month of it. Where the chosen day is not on show, the calendar goes to its month.
- **Days that cannot be chosen.** The days outside `minDate` and `maxDate`, and those `isDateEnabled` leaves out, are drawn faint and cannot be pressed; the arrows do not go past the ends.
- **Stretch.** The first press chooses the stretch's first day and the second its last; a press on a day before the first starts the stretch again there. While the last is chosen, the days to the one under the pointer are shown in a lighter colour.
- **Keyboard.** The calendar is one Tab stop. The arrows walk a day or a week, Page Up and Page Down a month, with Shift a year, Home and End to the week's first and last day; Enter and Space choose.
- **Screen reader.** Each day is read in full with the day of the week ("Saturday, October 17, 2026"); chosen, today, and the start, the middle and the end of a stretch are said. When the month changes, the new month is announced politely.
- **Week.** It starts on the language's day: Sunday in English, Monday in Turkish, Saturday in Arabic; `firstDayOfWeek` changes it.
- **Today.** The ringed day is the today of the screen's clock and turns by itself at midnight. The screen's clock is `LocalPantrixClock`, the device's by default (`PantrixClock.System`); another place's day is given by `today`, or for a whole screen by `LocalPantrixClock`.
- **Platform.** A day's room is the platform's least touch target on a phone (48dp on Android, 44pt on iOS), and 36dp on the desktop and the web. In a narrow place the days shrink until they fit.
- **Date type.** Days are `PantrixDate`s, and no date library is needed; docs/guide/date-time/DATE_TIME_GUIDE.md turns them into `kotlinx-datetime`'s or `java.time`'s.

## Usage

### A delivery day within the next month, on weekdays

```kotlin
var delivery by remember { mutableStateOf<PantrixDate?>(null) }
val today = rememberToday()
PantrixDatePicker(
    selected = delivery,
    onSelect = { delivery = it },
    minDate = today.plusDays(1),
    maxDate = today.plusMonths(1),
    isDateEnabled = { it.dayOfWeek <= 5 },
    tagKey = "delivery"
)
```

### The nights of a stay, from a week that starts on Monday

```kotlin
var stay by remember { mutableStateOf<PantrixDateRange?>(null) }
PantrixDatePicker(
    selectedRange = stay,
    onRangeSelect = { stay = it },
    minDate = rememberToday(),
    firstDayOfWeek = 1,
    tagKey = "stay"
)
```

## Examples

### One day in a popover

A button shows the chosen day and opens the calendar under it in a popover; choosing a day closes the popover. The days before today cannot be chosen.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var due by remember { mutableStateOf<PantrixDate?>(null) }
var open by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = due?.let(strings::written) ?: "Choose a due date",
            onClick = { open = !open },
            variant = ButtonVariant.Outline,
            leadingIcon = { PantrixIcon(PantrixIcons.Calendar, contentDescription = null) },
            tagKey = "due"
        )
    },
    alignment = PopoverAlignment.Start,
    tagKey = "due"
) {
    PantrixDatePicker(
        selected = due,
        onSelect = {
            due = it
            open = false
        },
        minDate = rememberToday(),
        tagKey = "due"
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### A weekday stretch in the page

A stretch of leave from a calendar that stands in the page: only weekdays can be its ends, and the week starts on Monday in every language. The chosen stretch is written under the calendar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixDateRange
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var leave by remember { mutableStateOf<PantrixDateRange?>(null) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixDatePicker(
        selectedRange = leave,
        onRangeSelect = { leave = it },
        isDateEnabled = { it.dayOfWeek <= FRIDAY },
        firstDayOfWeek = MONDAY,
        tagKey = "leave"
    )
    PantrixText(
        text = leave?.let { "Leave: ${strings.written(it.start)} – ${strings.written(it.end)}" }
            ?: "Choose the first and the last day of the leave",
        style = PantrixTheme.typography.body
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)

private const val MONDAY = 1

private const val FRIDAY = 5
```

### Limited days in a dialog

One of the next thirty days, in a dialog. The choice in the calendar is a draft: OK takes it, and Cancel or a press outside the dialog leaves it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var appointment by remember { mutableStateOf<PantrixDate?>(null) }
var draft by remember { mutableStateOf<PantrixDate?>(null) }
var open by remember { mutableStateOf(false) }
val today = rememberToday()
val strings = PantrixTheme.strings
val report = LocalExampleEvents.current
PantrixButton(
    text = appointment?.let { "Appointment: ${strings.written(it)}" } ?: "Choose the appointment day",
    onClick = {
        draft = appointment
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "appointment"
)
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Appointment day",
    actions = {
        PantrixButton(text = "Cancel", onClick = { open = false }, variant = ButtonVariant.Text, tagKey = "cancel")
        PantrixButton(
            text = "OK",
            onClick = {
                appointment = draft
                open = false
                report("Appointment chosen")
            },
            enabled = draft != null,
            tagKey = "accept"
        )
    },
    tagKey = "appointment"
) {
    PantrixDatePicker(
        selected = draft,
        onSelect = { draft = it },
        minDate = today,
        maxDate = today.plusDays(DAYS_AHEAD),
        tagKey = "appointment"
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)

private const val DAYS_AHEAD = 30
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A birthday in a sheet, with the years

A birthday in a sheet: no day after today can be chosen. A year far off is chosen from the years the title opens; the calendar turns to the same month of that year. The calendar fills the sheet's width (`fillMaxWidth`): its columns widen, and in a very wide sheet it stands in the middle.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var birthday by remember { mutableStateOf<PantrixDate?>(null) }
var open by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixButton(
    text = birthday?.let { "Birthday: ${strings.written(it)}" } ?: "Choose the birthday",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "birthday"
)
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Birthday",
    tagKey = "birthday"
) {
    PantrixDatePicker(
        selected = birthday,
        onSelect = {
            birthday = it
            open = false
        },
        modifier = Modifier.fillMaxWidth(),
        maxDate = rememberToday(),
        tagKey = "birthday"
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### Another place's today

The calendar's today by a hotel's clock, not the device's: `today` gives the ring of today, and `minDate` with it the first day that can be chosen. Kiritimati (UTC+14) and Pago Pago (UTC-11) are 25 hours apart, so the two are always on different days: as the place changes, the ring and the first day move by a day. Where `today` is not given it is the day of the screen's clock (`rememberToday()`) and turns by itself at midnight; this example reads the hotel's day as the place is chosen.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Clock
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours

var hotel by remember { mutableStateOf(Hotel.Kiritimati) }
var arrival by remember { mutableStateOf<PantrixDate?>(null) }
val today = remember(hotel) { PantrixDate.of(Clock.System.now(), offset = hotel.offset) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(Hotel.Kiritimati, "Kiritimati", tagKey = "kiritimati"),
            SegmentOption(Hotel.PagoPago, "Pago Pago", tagKey = "pago_pago")
        ),
        selected = hotel,
        onSelect = {
            hotel = it
            arrival = null
        },
        fullWidth = false,
        tagKey = "hotel"
    )
    PantrixDatePicker(
        selected = arrival,
        onSelect = { arrival = it },
        minDate = today,
        today = today,
        tagKey = "arrival"
    )
    PantrixText(
        text = "Today at the hotel: ${strings.written(today)} (${hotel.zone})",
        style = PantrixTheme.typography.body
    )
    PantrixText(
        text = arrival?.let { "Arrival: ${strings.written(it)}" } ?: "Choose the day of arrival",
        style = PantrixTheme.typography.body
    )
}

private enum class Hotel(
    val zone: String,
    val offset: Duration
) {
    Kiritimati("UTC+14", 14.hours),
    PagoPago("UTC-11", (-11).hours)
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### The screen's clock

A whole screen's clock: `LocalPantrixClock` gives the hotel's clock, and everything inside it reads it. The calendar is given no `today`; its ring, `rememberToday()` and the time itself are by the hotel's clock. A preview or a test shows a screen on a day and at an hour this way: `PantrixClock(clock, utcOffset)` takes a `Clock` of its own as well.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.LocalPantrixClock
import com.pantrixui.foundation.date.PantrixClock
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Clock
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours

var hotel by remember { mutableStateOf(Hotel.Kiritimati) }
val clock = remember(hotel) { PantrixClock(Clock.System) { hotel.offset } }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(Hotel.Kiritimati, "Kiritimati", tagKey = "kiritimati"),
            SegmentOption(Hotel.PagoPago, "Pago Pago", tagKey = "pago_pago")
        ),
        selected = hotel,
        onSelect = { hotel = it },
        fullWidth = false,
        tagKey = "screen_hotel"
    )
    CompositionLocalProvider(LocalPantrixClock provides clock) {
        var arrival by remember { mutableStateOf<PantrixDate?>(null) }
        PantrixDatePicker(selected = arrival, onSelect = { arrival = it }, tagKey = "screen_arrival")
        val today = rememberToday()
        val now = LocalPantrixClock.current.time()
        val strings = PantrixTheme.strings
        PantrixText(
            text = "Today on the screen: ${strings.written(today)}, at ${strings.clock(now.hour, now.minute)}",
            style = PantrixTheme.typography.body
        )
    }
}

private enum class Hotel(
    val zone: String,
    val offset: Duration
) {
    Kiritimati("UTC+14", 14.hours),
    PagoPago("UTC-11", (-11).hours)
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### Its own colours and disabled

The calendar's own colours and measure, and a switch that disables it. The ends of a stretch are in the success colour, the days between in its light fill, and the ring of today in the warning colour; every colour not given is the theme's. The calendar has no padding of its own (`padding = 0.dp`): it stands in the card's. With the switch off the calendar is faint: no day is chosen and the month does not turn, and the chosen stretch stays.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.datepicker.DatePickerColors
import com.pantrixui.components.date.datepicker.DatePickerStyle
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixDateRange
import com.pantrixui.foundation.theme.PantrixTheme

var trip by remember { mutableStateOf<PantrixDateRange?>(null) }
var enabled by remember { mutableStateOf(true) }
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = enabled,
        onCheckedChange = { enabled = it },
        label = "Can be chosen",
        tagKey = "trip_enabled"
    )
    PantrixDatePicker(
        selectedRange = trip,
        onRangeSelect = { trip = it },
        enabled = enabled,
        style = DatePickerStyle(padding = 0.dp),
        colors = DatePickerColors(
            selectedContainer = colors.success.color,
            rangeContainer = colors.success.container,
            today = colors.warning.color
        ),
        tagKey = "trip"
    )
}
```

## API

### PantrixDatePicker

`import com.pantrixui.components.date.datepicker.PantrixDatePicker`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDatePicker(
    selected: PantrixDate?,
    onSelect: (PantrixDate) -> Unit,
    modifier: Modifier = Modifier,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    enabled: Boolean = true,
    today: PantrixDate = rememberToday(),
    style: DatePickerStyle? = null,
    colors: DatePickerColors? = null,
    tagKey: String? = null
)
```

A calendar to choose a day from, a month at a time: the month's title between the arrows that turn it, the days of the week over its columns, and its days.

The calendar is the choice itself, and stands where it is put: in the page, or in a `PantrixPopover`, a `PantrixDialog` or a `PantrixSheet` that a button or a field opens. It paints no ground of its own and holds nothing of the choice: `selected` is the caller's, and a press on a day hands it to `onSelect`. What it keeps is the month on show, which starts at the chosen day's, or today's, and goes to the chosen day's month when the caller chooses one that is not on show.

The days a calendar cannot take are drawn faint and cannot be chosen: those before `minDate` and after `maxDate`, which the arrows do not turn to either, and those between that `isDateEnabled` leaves out, a weekend, a day that is full. Pressing the title shows the years in place of the days, and choosing one turns the calendar to the same month of that year.

The calendar is one stop for Tab, on the chosen day, today or the month's first, and its keys walk the days as a calendar's do: the arrows a day or a week, Page Up and Page Down a month, with Shift a year, Home and End the week's first and last day; Enter and Space choose. A screen reader hears each day in full, with the day of the week, and is told politely when the month changes.

Days are `PantrixDate`s, with no library of dates: docs/guide/date-time/DATE_TIME_GUIDE.md turns them into an app's own.

```kotlin
var due by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDatePicker(
    selected = due,
    onSelect = { due = it },
    minDate = PantrixDate.today(),
    tagKey = "due"
)
```

Parameters:

- `selected: PantrixDate?`: the chosen day, or null while none is.
- `onSelect: (PantrixDate) -> Unit`: handed the day a press chose: one that can be chosen.
- `modifier: Modifier`: the calendar's modifier. The calendar is seven days wide, and narrower where it is given less room. Given a width, as `Modifier.fillMaxWidth()` gives it the width of a sheet, it fills it: its columns grow as far as `DatePickerStyle.maxCellWidth`, and past that it stands in the middle.
- `minDate: PantrixDate?`: the first day that can be chosen, or null for none so early.
- `maxDate: PantrixDate?`: the last day that can be chosen, or null for none so late.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: whether a day between them can be chosen, or null where every one can.
- `firstDayOfWeek: Int?`: the day the weeks start on, as ISO 8601 numbers the days: 1 is Monday and 7 is Sunday. Null is the language's, `PantrixLocale.firstDayOfWeek`: Sunday in English, Monday in Turkish, Saturday in Arabic.
- `enabled: Boolean`: whether a day can be chosen at all. A calendar that takes no choice is drawn faint.
- `today: PantrixDate`: the day marked as today: by default the one the screen's clock shows (`rememberToday`), which turns at midnight. A test gives a day of its own.
- `style: DatePickerStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: DatePickerColors?`: this calendar's own colours: the ones it sets, with the theme's for the rest.
- `tagKey: String?`: the calendar's automation key: it is `DatePicker_<tagKey>`, and its days are `DatePicker_<tagKey>.Day_2026_10_17`.

### PantrixDatePicker

`import com.pantrixui.components.date.datepicker.PantrixDatePicker`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDatePicker(
    selectedRange: PantrixDateRange?,
    onRangeSelect: (PantrixDateRange) -> Unit,
    modifier: Modifier = Modifier,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    enabled: Boolean = true,
    today: PantrixDate = rememberToday(),
    style: DatePickerStyle? = null,
    colors: DatePickerColors? = null,
    tagKey: String? = null
)
```

A calendar to choose a stretch of days from: a stay, a leave, the days a report is of. It is the calendar that chooses a day, pressed twice: its first press chooses the first day of the stretch and its second the last.

The second press ends the stretch on its day, or on the first day again for a stretch of one day, and `onRangeSelect` is handed the stretch; one before the first day starts the stretch again from there. Between the two presses the first day is the calendar's own, and under a pointer the stretch it would make is drawn lighter. A stretch may run over days that cannot be chosen; its first and its last day are ones that can.

`selectedRange` is the caller's: the calendar draws it with its first and last day marked and a band under the days between, and goes to its first day's month when the caller chooses one of which no day is on show.

Parameters:

- `selectedRange: PantrixDateRange?`: the chosen stretch, or null while none is.
- `onRangeSelect: (PantrixDateRange) -> Unit`: handed the stretch two presses chose.
- `modifier: Modifier`: the calendar's modifier. The calendar is seven days wide, and narrower where it is given less room; given a width, it fills it as far as `DatePickerStyle.maxCellWidth` lets its columns grow.
- `minDate: PantrixDate?`: the first day that can be chosen, or null for none so early.
- `maxDate: PantrixDate?`: the last day that can be chosen, or null for none so late.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: whether a day between them can be the first or the last day of a stretch, or null where every one can.
- `firstDayOfWeek: Int?`: the day the weeks start on, as ISO 8601 numbers the days: 1 is Monday and 7 is Sunday. Null is the language's, `PantrixLocale.firstDayOfWeek`.
- `enabled: Boolean`: whether a stretch can be chosen at all. A calendar that takes no choice is drawn faint.
- `today: PantrixDate`: the day marked as today: by default the one the screen's clock shows (`rememberToday`), which turns at midnight. A test gives a day of its own.
- `style: DatePickerStyle?`: this call's own style: over every enclosing one and under the density.
- `colors: DatePickerColors?`: this calendar's own colours: the ones it sets, with the theme's for the rest.
- `tagKey: String?`: the calendar's automation key: it is `DatePicker_<tagKey>`, and its days are `DatePicker_<tagKey>.Day_2026_10_17`.

### DatePickerStyle

`import com.pantrixui.components.date.datepicker.DatePickerStyle`, from `com.pantrixui:components`

```kotlin
class DatePickerStyle(
    public val cellSize: Dp = Dp.Unspecified,
    public val daySize: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val maxCellWidth: Dp = Dp.Unspecified
) : PantrixStyle<DatePickerStyle>
```

`PantrixDatePicker`'s geometry: the room of a day, the round mark a chosen day is drawn in, and the room around the month.

A day's room is as wide as a column of the week and as tall as a row of it, and the days touch: a press anywhere in the room is the day's. On a phone it is the platform's least touch target, 48dp on Android and 44pt on iOS, so that a month is seven targets wide, 360dp across on Android as a Material calendar is. Under a pointer it is 36dp. A place too narrow for the month makes every day's room narrower, and its mark with it, by the same share. A calendar given more width than that, as a sheet gives it with `Modifier.fillMaxWidth()`, widens its columns to fill it, up to `maxCellWidth`, and stands in the middle of what is left; its rows and its marks keep their size.

The room around the month and the gap under its title follow the density; a day's room, its widest and its mark do not, as a touch target does not.

Parameters:

- `cellSize: Dp`: The width and the height of a day's room: the column and the row. The title and the year's rooms are as tall.
- `daySize: Dp`: The width and the height of the round mark a chosen day, today and the day under a pointer are drawn in, in the middle of its room. A stretch of days is a band as tall.
- `padding: Dp`: The room between the calendar's edge and what it holds.
- `gap: Dp`: Between the title and the days of the week over the month.
- `maxCellWidth: Dp`: The widest a column grows to where the calendar is given more width than seven days' rooms: half as wide again as `cellSize`.

### DatePickerColors

`import com.pantrixui.components.date.datepicker.DatePickerColors`, from `com.pantrixui:components`

```kotlin
data class DatePickerColors(
    public val content: Color = Color.Unspecified,
    public val weekday: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val rangeContainer: Color = Color.Unspecified,
    public val rangeContent: Color = Color.Unspecified,
    public val today: Color = Color.Unspecified,
    public val hover: Color = Color.Unspecified,
    public val disabled: Color = Color.Unspecified
)
```

What a `PantrixDatePicker` is painted with, in place of the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

A `selectedContainer` given here that is one of the theme's role colours brings the colour the theme pairs with it for the chosen day's number, unless `selectedContent` is given too, and a `rangeContainer` brings its pair for the days of a stretch, unless `rangeContent` is given. A fill no role has does not: what reads on it is the caller's to give.

The calendar paints no ground of its own: it stands on what is under it, a popover's, a dialog's, a sheet's or a page's, and its words are the theme's for its grounds.

Parameters:

- `content: Color`: The days' numbers, the title and the arrows. The theme's `textPrimary`.
- `weekday: Color`: The days of the week over the columns. The theme's `textSecondary`.
- `selectedContainer: Color`: The round mark of a chosen day, and of a stretch's first and last. The primary role's `color`.
- `selectedContent: Color`: The number on it. The primary role's `onColor`, or the colour a role's fill given as `selectedContainer` gives what stands on it.
- `rangeContainer: Color`: The band under the days between a stretch's first and last. The primary role's `container`. While the last is being chosen under a pointer, the band to the day under it is drawn in half of it.
- `rangeContent: Color`: The numbers on the band. The primary role's `onContainer`.
- `today: Color`: The ring around today, and its number. The primary role's `color`.
- `hover: Color`: The round mark under a pointer: which day a press would choose. A share of `content`.
- `disabled: Color`: The numbers of the days that cannot be chosen, and everything of a calendar that takes no choice. The theme's `textDisabled`.

### PantrixDate

`import com.pantrixui.foundation.date.PantrixDate`, from `com.pantrixui:foundation`

```kotlin
class PantrixDate(
    public val year: Int,
    public val month: Int,
    public val day: Int
) : Comparable<PantrixDate>
```

A day on the calendar: a year, a month and a day of the month, with no time of day and no time zone.

Pantrix takes no library of dates. A component that spoke one would put it into the API of every app that shows a date, and which one an app uses is not a design system's to choose: this is three numbers, which an app turns into its own type and back in a line, `PantrixDate(date.year, date.month.number, date.day)` from `kotlinx-datetime`'s `LocalDate` and the same from `java.time`'s. docs/guide/date-time/DATE_TIME_GUIDE.md has the lines for each.

The calendar is the one in use now, the Gregorian, and is taken back before its start as it is forwards: a year before the first is written as nought, then as less than nought.

Parameters:

- `year: Int`: The year, as it is written.
- `month: Int`: The month, 1 for January to 12 for December.
- `day: Int`: The day of the month, from 1 to the month's last.

Members:

- `dayOfWeek: Int`: The day of the week this day falls on, as ISO 8601 numbers it: 1 is Monday and 7 is Sunday.
- `epochDays: Long`: The days from the first of January 1970 to this one: nought on that day, and less than nought before it.
- `fun plusDays(days: Int): PantrixDate`: The day `days` after this one, or before it where `days` is less than nought.
- `fun plusMonths(months: Int): PantrixDate`: The same day `months` months after this one, or before it where `months` is less than nought. Where that month is shorter, its last day: a month after the 31st of January is the last day of February.
- `fun plusYears(years: Int): PantrixDate`: The same day `years` years after this one, or before it: the 29th of February is the 28th in a common year.
- `fun at(time: PantrixTime, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: The moment a clock shows `time` on this day: by default the device's own clock, whose offset from UTC `offsetAt` tells for each moment, as `systemUtcOffset` does, summer time and all.

  Where the clock is put back and shows the time twice, it is the first of the two, as `java.time` takes it. Where it is put forward and never shows the time, it is as far past the hour it skips as the time is into it: half past two on a night that goes from two to three is half past three.

On the type:

- `PantrixDate.ofEpochDays(days: Long): PantrixDate`: The day `days` days after the first of January 1970, or before it where `days` is less than nought.
- `PantrixDate.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixDate`: The day a clock `offset` ahead of UTC shows at `moment`: by default the device's own clock, as `systemUtcOffset` tells it.
- `PantrixDate.today(): PantrixDate`: The day the device's clock shows now. A screen reads `rememberToday` instead: the day the screen's clock shows, asked again at each midnight.
- `PantrixDate.parse(text: String): PantrixDate`: The day ISO 8601 writes as `text`: `2026-10-17`, with four digits of year or more and a sign before a year less than nought, as `toString` writes it.
- `PantrixDate.daysInMonth(year: Int, month: Int): Int`: How many days the month `month` of `year` has: 28 to 31, the 29th of February in a leap year.
- `PantrixDate.isLeapYear(year: Int): Boolean`: Whether `year` has a 29th of February: every fourth year, but not every hundredth, but every four hundredth.

### PantrixDateRange

`import com.pantrixui.foundation.date.PantrixDateRange`, from `com.pantrixui:foundation`

```kotlin
class PantrixDateRange(
    public val start: PantrixDate,
    public val end: PantrixDate
)
```

A stretch of days from `start` to `end`, both of them in it: a stay, a leave, the days a report is of. A stretch of one day starts and ends on it.

Parameters:

- `start: PantrixDate`
- `end: PantrixDate`

Members:

- `operator fun contains(date: PantrixDate): Boolean`: Whether `date` is one of the stretch's days, its first and its last among them.

### rememberToday

`import com.pantrixui.foundation.date.rememberToday`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberToday(): PantrixDate
```

The day the screen's clock shows, as a screen that stays open past midnight has it: it turns to the next day as the clock does, and what reads it is drawn again. A calendar marks today by it. The clock is `LocalPantrixClock`'s: the device's, unless a test or a preview gives another.

It asks the clock again at each midnight of the clock's own time, and not in between: a clock set by hand or a journey into another time zone shows the next time the screen is built, or at the next midnight.

### PantrixClock

`import com.pantrixui.foundation.date.PantrixClock`, from `com.pantrixui:foundation`

```kotlin
class PantrixClock(
    public val clock: Clock,
    public val utcOffset: (Instant) -> Duration
)
```

Where a screen reads the time: the moment it is now, and how far the clock it is shown by is ahead of UTC at a moment. `rememberToday` reads the day from it, the time field the hour its picker opens at, the elastic date picker its ranges and a chart its moments. `System` is the device's; a test or a preview gives one of its own through `LocalPantrixClock`, to see a screen on a day and at an hour it chooses.

Parameters:

- `clock: Clock`: what the moment is now.
- `utcOffset: (Instant) -> Duration`: how far the clock is ahead of UTC at a moment: three hours in Istanbul, less than nought west of Greenwich, and summer time where it is kept.

Members:

- `fun today(): PantrixDate`: The day this clock shows now.
- `fun time(): PantrixTime`: The time this clock shows now, to the second.

On the type:

- `PantrixClock.System: PantrixClock`: The device's clock, in the device's time zone.

### LocalPantrixClock

`import com.pantrixui.foundation.date.LocalPantrixClock`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixClock: ProvidableCompositionLocal<PantrixClock>
```

The clock the screen is read by: `PantrixClock.System` unless a test or a preview gives another.
