# Time Picker

Choosing a time from columns: the hours, the minutes, and by a clock of twelve hours the half of the day. The picker is the choice itself: it stands in the page, or is put in a popover, a dialog or a sheet. It does not hold the choice; the chosen time comes to `onSelect`.

- `PantrixTimePicker` (`com.pantrixui.components.date.timepicker`, `com.pantrixui:components`): A time of day to choose from scrolling columns of hours and minutes, and of the half of the day by a clock of twelve hours, with the times that cannot be chosen drawn faint. Keywords: clock, time selector, hour minute, time wheel, am pm.

## Features

- **Choosing.** A press on a value gives a whole time, and the other column stays as it is. With nothing chosen yet, an hour comes with its first minute that can be chosen, and a minute with the first such hour. The chosen value scrolls to the middle of its column.
- **Times that cannot be chosen.** The minutes outside `minTime` and `maxTime`, and the hours none of whose minutes are between them, are drawn faint and cannot be pressed. Where `maxTime` comes before `minTime`, the times that can be chosen run past midnight; by a clock of 24 hours the column of the hours starts at `minTime`'s hour.
- **Minute step.** `minuteStep` sets how far apart the minutes are: with 15, 00, 15, 30 and 45.
- **12 or 24 hours.** `is24Hour` gives the picker its shape: `true` 22:00 with two columns, `false` 10:00 PM with a column of the half of the day (AM/PM, ÖÖ/ÖS, ص/م). It is 24 hours in every language by default. To write the time on a screen by the same clock, `strings.time(hour, minute, is24Hour = …)`.
- **Keyboard.** Each column is one Tab stop. The arrows choose a value on, Page Up and Page Down six hours or fifteen minutes, Home and End the first and the last value; typing digits goes to the value they write ("1" then "4" is hour 14). ← and → move between the columns.
- **Screen reader.** Each column is read by its name and each value as a button; the chosen time is announced politely.
- **Platform.** A row is the platform's least touch target on a phone (48dp on Android, 44pt on iOS), and 36dp on the desktop and the web.
- **Time type.** Times are `PantrixTime`s; a day and a time become a moment on the device's clock with `PantrixDate.at`. For turning them into `kotlinx-datetime`'s or `java.time`'s, see docs/guide/date-time/DATE_TIME_GUIDE.md.

## Usage

### An appointment on the quarter hour, in working hours

```kotlin
var at by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimePicker(
    selected = at,
    onSelect = { at = it },
    minTime = PantrixTime(9, 0),
    maxTime = PantrixTime(17, 45),
    minuteStep = 15,
    tagKey = "at"
)
```

### A reminder by a clock of twelve hours

```kotlin
var reminder by remember { mutableStateOf<PantrixTime?>(PantrixTime(8, 30)) }
PantrixTimePicker(
    selected = reminder,
    onSelect = { reminder = it },
    is24Hour = false,
    tagKey = "reminder"
)
```

## Examples

### An appointment on the quarter hour in a popover

A button shows the chosen time and opens the picker under it in a popover. The minutes are a quarter of an hour apart; the popover stays open while the hour and the minute are chosen, and closes on a press outside it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var at by remember { mutableStateOf<PantrixTime?>(null) }
var open by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = at?.let { strings.clock(it.hour, it.minute) } ?: "Choose the appointment time",
            onClick = { open = !open },
            variant = ButtonVariant.Outline,
            leadingIcon = { PantrixIcon(PantrixIcons.Clock, contentDescription = null) },
            tagKey = "at"
        )
    },
    alignment = PopoverAlignment.Start,
    tagKey = "at"
) {
    PantrixTimePicker(
        selected = at,
        onSelect = { at = it },
        minuteStep = QUARTER,
        tagKey = "at"
    )
}

private const val QUARTER = 15
```

### Working hours on the page

A time within working hours from a picker on the page: from 09:00 to 17:30, half an hour apart. The times outside them are faint; the chosen time is written under it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var call by remember { mutableStateOf<PantrixTime?>(PantrixTime(OPENS, 0)) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimePicker(
        selected = call,
        onSelect = { call = it },
        minTime = PantrixTime(OPENS, 0),
        maxTime = PantrixTime(LAST_CALL, HALF_HOUR),
        minuteStep = HALF_HOUR,
        tagKey = "call"
    )
    PantrixText(
        text = call?.let { "Call at: ${strings.clock(it.hour, it.minute)}" } ?: "Choose a time for the call",
        style = PantrixTheme.typography.body
    )
}

private const val HALF_HOUR = 30

private const val OPENS = 9

private const val LAST_CALL = 17
```

### A day and a time together in a dialog

A meeting's day and time in a dialog. Where there is room the time stands to the right of the calendar; in a window too narrow for the two, as on a phone, it goes under the calendar (`FlowRow`). What the calendar and the picker show is a draft: OK turns the two into a moment on the device's clock with `PantrixDate.at`; the moment is written in UTC too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var meeting by remember { mutableStateOf<Instant?>(null) }
var day by remember { mutableStateOf<PantrixDate?>(null) }
var time by remember { mutableStateOf<PantrixTime?>(null) }
var open by remember { mutableStateOf(false) }
val today = rememberToday()
val strings = PantrixTheme.strings
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Choose the meeting time",
        onClick = { open = true },
        variant = ButtonVariant.Outline,
        tagKey = "meeting"
    )
    meeting?.let { moment ->
        val shown = PantrixDate.of(moment)
        val clock = PantrixTime.of(moment)
        PantrixText(
            text = "Meeting: ${strings.date(shown.day, shown.month, shown.year)} " +
                strings.clock(clock.hour, clock.minute),
            style = PantrixTheme.typography.body
        )
        PantrixText(text = "UTC: $moment", style = PantrixTheme.typography.footnote)
    }
}
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Meeting time",
    actions = {
        PantrixButton(text = "Cancel", onClick = { open = false }, variant = ButtonVariant.Text, tagKey = "cancel")
        PantrixButton(
            text = "OK",
            onClick = {
                val chosenDay = day
                val chosenTime = time
                if (chosenDay != null && chosenTime != null) meeting = chosenDay.at(chosenTime)
                open = false
                report("Meeting time chosen")
            },
            enabled = day != null && time != null,
            tagKey = "accept"
        )
    },
    tagKey = "meeting"
) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md, Alignment.CenterHorizontally),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixDatePicker(selected = day, onSelect = { day = it }, minDate = today, tagKey = "meeting")
        PantrixTimePicker(
            selected = time,
            onSelect = { time = it },
            minuteStep = FIVE_MINUTES,
            tagKey = "meeting"
        )
    }
}

private const val FIVE_MINUTES = 5
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### 12 or 24 hours

A reminder's time by the clock chosen. `is24Hour` gives the picker its shape: `true` two columns (00 to 23, 22:00), `false` the hours from 12 to 11 and a column of the half of the day (10:00 PM). The time is still a `PantrixTime` of 24 hours; only how it is shown changes.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var reminder by remember { mutableStateOf<PantrixTime?>(PantrixTime(REMINDER_HOUR, 0)) }
var is24Hour by remember { mutableStateOf(true) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(true, "24 hours", tagKey = "twenty_four"),
            SegmentOption(false, "12 hours", tagKey = "twelve")
        ),
        selected = is24Hour,
        onSelect = { is24Hour = it },
        fullWidth = false,
        tagKey = "cycle"
    )
    PantrixTimePicker(
        selected = reminder,
        onSelect = { reminder = it },
        is24Hour = is24Hour,
        tagKey = "reminder"
    )
    PantrixText(
        text = reminder?.let { "Reminder: ${strings.time(it.hour, it.minute, is24Hour = is24Hour)} ($it)" }
            ?: "Choose a time for the reminder",
        style = PantrixTheme.typography.body
    )
}

private const val REMINDER_HOUR = 22
```

### Hours past midnight

The start of a night shift: between 22:00 and 06:00, half an hour apart. As `maxTime` is before `minTime`, the hours that can be chosen pass midnight, and the column of the hours starts at 22: 22, 23, then 00 to 06, the night's hours together; the others are faint, at the column's end. An hour after midnight falls on the next day, and the line under it says so.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

val opens = PantrixTime(NIGHT_STARTS, 0)
var start by remember { mutableStateOf<PantrixTime?>(opens) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimePicker(
        selected = start,
        onSelect = { start = it },
        minTime = opens,
        maxTime = PantrixTime(NIGHT_ENDS, 0),
        minuteStep = HALF_HOUR,
        tagKey = "night"
    )
    PantrixText(
        text = start?.let {
            val clock = strings.clock(it.hour, it.minute)
            if (it < opens) "Shift starts: $clock, the next day" else "Shift starts: $clock"
        } ?: "Choose when the shift starts",
        style = PantrixTheme.typography.body
    )
}

private const val HALF_HOUR = 30

private const val NIGHT_STARTS = 22

private const val NIGHT_ENDS = 6
```

### Its own colours and disabled

The picker's own colours and measure, and a switch that disables it. The chosen time's fill and the columns' names are in the info colour; every colour not given is the theme's. The picker has no padding of its own (`padding = 0.dp`): it stands in the card's. With the switch off the picker is faint and takes no press, and the chosen time stays.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.date.timepicker.TimePickerColors
import com.pantrixui.components.date.timepicker.TimePickerStyle
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var alarm by remember { mutableStateOf<PantrixTime?>(PantrixTime(ALARM_HOUR, HALF_HOUR)) }
var enabled by remember { mutableStateOf(true) }
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = enabled,
        onCheckedChange = { enabled = it },
        label = "Can be chosen",
        tagKey = "alarm_enabled"
    )
    PantrixTimePicker(
        selected = alarm,
        onSelect = { alarm = it },
        enabled = enabled,
        style = TimePickerStyle(padding = 0.dp),
        colors = TimePickerColors(selectedContainer = colors.info.color, heading = colors.info.color),
        tagKey = "alarm"
    )
}

private const val HALF_HOUR = 30

private const val ALARM_HOUR = 7
```

## API

### PantrixTimePicker

`import com.pantrixui.components.date.timepicker.PantrixTimePicker`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTimePicker(
    selected: PantrixTime?,
    onSelect: (PantrixTime) -> Unit,
    modifier: Modifier = Modifier,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    enabled: Boolean = true,
    style: TimePickerStyle? = null,
    colors: TimePickerColors? = null,
    tagKey: String? = null
)
```

A time of day to choose from columns: the hours, the minutes, and by a clock of twelve hours the half of the day, each a column of five rows that scrolls through the rest, the chosen value filled in the middle of it.

`is24Hour` gives it its shape: by twenty-four hours, two columns, the hours 00 to 23 and the minutes, that choose `22:00`; by twelve, the hours 12 to 11, the minutes and a third column of the half of the day, that choose `10:00 PM`. It is twenty-four hours in every language unless the call asks for twelve.

The picker is the choice itself, and stands where it is put: in the page, or in a `PantrixPopover`, a `PantrixDialog` or a `PantrixSheet` that a button or a field opens. It paints no ground of its own and holds nothing of the choice: `selected` is the caller's, and a press on a value hands `onSelect` the whole time it makes, the other columns kept as they are. With nothing chosen, an hour comes with its first minute, and a minute with the first hour the picker takes. A time it shows that is to be taken only on a press of OK is the caller's draft.

The values a picker cannot take are drawn faint and cannot be pressed: the minutes before `minTime` and after `maxTime`, and the hours none of whose minutes are between them. The minutes are `minuteStep` apart.

Each column is one stop for Tab, on its chosen value, and its keys choose as they walk: the arrows the value below and above, Home and End the first and the last, Page Down and Page Up six hours or fifteen minutes on, and typed digits the value they write, `1` then `4` the fourteenth hour; the arrows across go to the column beside. A screen reader hears each column by its name and each value as a button, and is told politely the time a press or a key chose.

Times are `PantrixTime`s, with no library of dates: docs/guide/date-time/DATE_TIME_GUIDE.md turns them into an app's own, and a day and a time into a moment.

```kotlin
var at by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimePicker(
    selected = at,
    onSelect = { at = it },
    minuteStep = 15,
    tagKey = "at"
)
```

Parameters:

- `selected: PantrixTime?`: the chosen time, or null while none is. Its seconds are kept in every time a press makes of it.
- `onSelect: (PantrixTime) -> Unit`: handed the time a press or a key chose: one the picker takes.
- `modifier: Modifier`: the picker's modifier. The picker is as wide as its columns; given more room, it stands in the middle of it.
- `minTime: PantrixTime?`: the first time that can be chosen, or null for none so early: its hour and minute.
- `maxTime: PantrixTime?`: the last time that can be chosen, or null for none so late. Where it comes before `minTime`, the times that can be chosen run past midnight, from `minTime` to `maxTime` of the next day: a night's. By a clock of 24 hours the column of the hours then starts at `minTime`'s, so that the night's hours stand together: 22, 23, 00.
- `minuteStep: Int`: how far apart the minutes in their column are, 1 to 60: 15 offers the hour's first, a quarter past, half past and a quarter to. A chosen minute between them is shown all the same.
- `is24Hour: Boolean`: whether the hours are counted by twenty-four, and so the picker's shape: two columns that choose `22:00`; or by twelve, with a third column of the half of the day, `10:00 PM`. Twenty-four by default, in every language. Either way the time chosen is a `PantrixTime` of twenty-four hours; a screen writes it by the same clock with `PantrixStrings.time(hour, minute, is24Hour = …)`.
- `enabled: Boolean`: whether a time can be chosen at all. A picker that takes no choice is drawn faint.
- `style: TimePickerStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TimePickerColors?`: this picker's own colours: the ones it sets, with the theme's for the rest.
- `tagKey: String?`: the picker's automation key: it is `TimePicker_<tagKey>`, and its values are `TimePicker_<tagKey>.Hour_14`, `.Minute_30` and `.Period_pm`.

### TimePickerStyle

`import com.pantrixui.components.date.timepicker.TimePickerStyle`, from `com.pantrixui:components`

```kotlin
class TimePickerStyle(
    public val cellSize: Dp = Dp.Unspecified,
    public val markHeight: Dp = Dp.Unspecified,
    public val columnWidth: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<TimePickerStyle>
```

`PantrixTimePicker`'s geometry: the room of a value in a column, the pill a chosen value is drawn in, how wide a column is, and the room around the columns.

A value's room is as wide as its column and as tall as a row, and the rows touch: a press anywhere in the room is the value's. On a phone a row is the platform's least touch target, 48dp on Android and 44pt on iOS, as a calendar's day is; under a pointer it is 36dp. A column shows five rows and scrolls through the rest.

The room around the columns and the gap under their names follow the density; a row, its pill and a column's width do not, as a touch target does not.

Parameters:

- `cellSize: Dp`: The height of a value's room: a row.
- `markHeight: Dp`: The height of the pill a chosen value and the value under a pointer are drawn in, in the middle of its room. It is most of the column wide.
- `columnWidth: Dp`: The width of a column of values.
- `padding: Dp`: The room between the picker's edge and its columns.
- `gap: Dp`: Between the columns' names and their values.

### TimePickerColors

`import com.pantrixui.components.date.timepicker.TimePickerColors`, from `com.pantrixui:components`

```kotlin
data class TimePickerColors(
    public val content: Color = Color.Unspecified,
    public val heading: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val hover: Color = Color.Unspecified,
    public val disabled: Color = Color.Unspecified
)
```

What a `PantrixTimePicker` is painted with, in place of the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

A `selectedContainer` given here that is one of the theme's role colours brings the colour the theme pairs with it for the chosen value's number, unless `selectedContent` is given too. A fill no role has does not: what reads on it is the caller's to give.

The picker paints no ground of its own: it stands on what is under it, a popover's, a dialog's, a sheet's or a page's.

Parameters:

- `content: Color`: The values' numbers and the mark between the hours and the minutes. The theme's `textPrimary`.
- `heading: Color`: The columns' names over them. The theme's `textSecondary`.
- `selectedContainer: Color`: The pill of a chosen value. The primary role's `color`.
- `selectedContent: Color`: The number on it. The primary role's `onColor`, or the colour a role's fill given as `selectedContainer` gives what stands on it.
- `hover: Color`: The pill under a pointer: which value a press would choose. A share of `content`.
- `disabled: Color`: The values that cannot be chosen, and everything of a picker that takes no choice. The theme's `textDisabled`.

### PantrixTime

`import com.pantrixui.foundation.date.PantrixTime`, from `com.pantrixui:foundation`

```kotlin
class PantrixTime(
    public val hour: Int,
    public val minute: Int,
    public val second: Int = 0
) : Comparable<PantrixTime>
```

A time of day: an hour by a clock of twenty-four hours, a minute and a second, with no day and no time zone.

As `PantrixDate` is, it is three numbers, which an app turns into its own type and back in a line: `PantrixTime(time.hour, time.minute, time.second)` from `kotlinx-datetime`'s `LocalTime` and the same from `java.time`'s. A day and a time make a moment with `PantrixDate.at`, on the device's clock; docs/guide/date-time/DATE_TIME_GUIDE.md has the lines for each.

A time is written in twenty-four hours whatever the language: `toString` is what is kept and sent. What a screen shows is the language's, `PantrixStrings.time`, by twelve hours in English.

Parameters:

- `hour: Int`: The hour, 0 for the one after midnight to 23.
- `minute: Int`: The minute of the hour, 0 to 59.
- `second: Int`: The second of the minute, 0 to 59: a clock's own seconds, with no leap second.

Members:

- `secondOfDay: Int`: The seconds from midnight to this time: nought at midnight, and 86 399 at the day's last second.

On the type:

- `PantrixTime.ofSecondOfDay(seconds: Int): PantrixTime`: The time `seconds` seconds after midnight, 0 to 86 399.
- `PantrixTime.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixTime`: The time a clock `offset` ahead of UTC shows at `moment`, to the second: by default the device's own clock, as `systemUtcOffset` tells it.
- `PantrixTime.now(): PantrixTime`: The time the device's clock shows now, to the second.
- `PantrixTime.parse(text: String): PantrixTime`: The time ISO 8601 writes as `text`: `14:05`, or `14:05:30` with its seconds, each part in two digits, as `toString` writes it.
