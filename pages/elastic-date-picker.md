# Elastic Date Picker

A range of time that can move with the clock: a dashboard is filtered by it, and "the last 15 minutes" is still the last 15 minutes at the next refresh. Elastic UI's `EuiSuperDatePicker`, built again on Pantrix.

- `PantrixElasticDatePicker` (`com.pantrixui.components.date.elasticdatepicker`, `com.pantrixui:components`): A range of time that can move with the clock, chosen from a quick menu or end by end, as a moment, an amount of time from now or now, in a popover, a sheet or a dialog, with a button that refreshes it or takes an edit. Keywords: date range picker, relative time, quick select, time range, last 24 hours, time filter.

## Features

- **Field.** The quick menu's calendar at the start, the range's name in the middle ("Last 15 minutes", "Today"), Refresh beside it. A press on the name shows the two ends (start → end) and opens the start's panel. A range with no name shows its two ends straight away.
- **Quick menu.** The last or the next amount of a unit, ‹ and › that move the range by its own length, the ranges `commonlyUsed` offers by name (by default Elastic UI's eight) and those `recentlyUsed` holds. A choice there is handed over at once.
- **An end.** Three tabs: Absolute (a calendar, the times by the half hour and a moment to type), Relative (an amount, a unit, the moment it falls on, rounding to the unit), Now. Moving to a tab makes the end what that tab shows. Apply at the end of the moment's field on Absolute and Relative takes the edit and closes the panel; Now's button makes the end now and does the same.
- **An edit that waits.** The field is painted in the success colour, a mark appears at its end and the button beside it says Update. An end before the start paints the field in the danger colour and Update takes nothing. With `updateButton = None` each edit is handed over at once.
- **One press.** With a panel open, a press on the other end, on Update or anywhere else on the page closes the panel and does what it presses, as in Elastic UI. A press on the open end's button closes its panel.
- **Popover, sheet or dialog.** `presentation` says what each panel opens in; the same on every platform. The default is a sheet in a narrow window and a popover in a wider one. The panels have no title over them.
- **Close-set panels.** As Elastic UI's: an end's panel is as wide as its calendar and the times beside it, the quick menu 400dp; the fields, tabs and buttons in them are 8dp lower than a form's.
- **Auto refresh.** `autoRefresh` and `onAutoRefreshChange`: "Refresh every" in the quick menu, and how often at the field's end; `minAutoRefresh` the shortest. Each turn waits for `onRefresh`, and one that fails stops the refresh.
- **Time window.** `timeWindowButtons`: ‹ and › move the range by its length, and zoom out, and zoom in where asked for, widen and narrow it by `zoomFactor`.
- **The field's layout.** `layout`: the range, the quick menu's button alone, or auto refresh alone.
- **The quick menu's parts.** `customQuickPanels` for panels of its own, `quickMenu` for an order of its own.
- **Time zone and disabled words.** `utcOffset` is the moments' difference, `timeZoneName` the name in the panels; `disabledText` the words of a picker that takes no choice.
- **Screen reader.** Each end is a button by its name and its words ("Start date, ~ 15 minutes ago"); an edit that waits is announced politely.
- **Time.** The ends are `PantrixTimePoint`s; `PantrixTimeRange.resolve()` makes them two `Instant`s by now, and `toDateMath()` writes them in Elasticsearch's date math. More in docs/guide/date-time/DATE_TIME_GUIDE.md.

## Usage

### The last 15 minutes of a dashboard, with the ranges used lately

```kotlin
var range by remember {
    mutableStateOf(PantrixTimeRange(PantrixTimePoint.Relative(-15, PantrixTimeUnit.Minutes), PantrixTimePoint.Now))
}
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    recentlyUsed = rememberRecentRanges(),
    tagKey = "dashboard"
)
```

### Logs filtered as each end changes, the panels in a sheet

```kotlin
val today = PantrixQuickRange.commonlyUsed(PantrixTheme.strings).first().range
var range by remember { mutableStateOf(today) }
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    updateButton = ElasticDatePickerUpdateButton.None,
    presentation = DatePickerPresentation.Sheet,
    tagKey = "logs"
)
```

## Examples

### A dashboard with the ranges used lately

The last 15 minutes of a dashboard. The ranges chosen gather under the quick menu's "Recently used"; Refresh keeps a load going for a second, and the button spins meanwhile. Under it, the two moments the range falls on now and the time of the last refresh.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.date.elasticdatepicker.rememberRecentRanges
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.time.Clock
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_QUARTER) }
var refreshed by remember { mutableStateOf<Instant?>(null) }
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = {
            range = it
            refreshed = Clock.System.now()
            report("Range chosen")
        },
        recentlyUsed = rememberRecentRanges(),
        onRefresh = {
            delay(LOADING_MILLIS)
            refreshed = Clock.System.now()
            report("Refreshed")
        },
        tagKey = "dashboard"
    )
    Resolved(range)
    refreshed?.let { PantrixText(text = "Last refresh: ${moment(it)}", style = PantrixTheme.typography.footnote) }
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "The end comes before the start",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private const val LOADING_MILLIS = 1000L

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Update button: in words, icon alone, none

The button beside the field three ways. In words it says Update while an edit waits; the icon alone does the same in less room; with no button each edit in an end is handed over at once. Change an end and see the difference.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerUpdateButton
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var button by remember { mutableStateOf(ElasticDatePickerUpdateButton.Text) }
var range by remember { mutableStateOf(LAST_QUARTER) }
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(ElasticDatePickerUpdateButton.Text, "In words", tagKey = "text"),
            SegmentOption(ElasticDatePickerUpdateButton.Icon, "Icon alone", tagKey = "icon"),
            SegmentOption(ElasticDatePickerUpdateButton.None, "No button", tagKey = "none")
        ),
        selected = button,
        onSelect = { button = it },
        fullWidth = false,
        tagKey = "update_button"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = {
            range = it
            report("Range handed over")
        },
        updateButton = button,
        tagKey = "update"
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "The end comes before the start",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Popover, sheet or dialog

Where the panels open is the same on every platform: with `presentation = Popover` a popover beside the part, with `presentation = Sheet` a sheet from the edge of the screen, with `presentation = Dialog` a dialog in the middle of the window, as wide as the panel. The default is `Adaptive`: a sheet in a narrow window, a popover in a wider one; switch between "Narrow" and "Wide" in the card's window selector. None has a title over it. The quick menu, the start and the end all open the way chosen.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.common.DatePickerPresentation
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.date.elasticdatepicker.PantrixQuickRange
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var presentation by remember { mutableStateOf(DatePickerPresentation.Sheet) }
val today = PantrixQuickRange.commonlyUsed(PantrixTheme.strings).first().range
var range by remember { mutableStateOf(today) }
// The card's window is as tall as the example: the example is kept tall so that a sheet opened in a narrow window has room.
Column(
    modifier = Modifier.fillMaxWidth().height(480.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(DatePickerPresentation.Popover, "Popover", tagKey = "popover"),
            SegmentOption(DatePickerPresentation.Sheet, "Sheet", tagKey = "sheet"),
            SegmentOption(DatePickerPresentation.Dialog, "Dialog", tagKey = "dialog"),
            SegmentOption(DatePickerPresentation.Adaptive, "Adaptive", tagKey = "adaptive")
        ),
        selected = presentation,
        onSelect = { presentation = it },
        fullWidth = false,
        tagKey = "presentation"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        presentation = presentation,
        tagKey = "presentation"
    )
}
```

### The quick menu's own ranges

The quick menu's ranges are the app's: here seven ranges from the last 15 minutes to the last year in place of Elastic UI's eight. Switching "Recently used" shows or hides the list; a range with a name stands in the field by it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.date.elasticdatepicker.PantrixQuickRange
import com.pantrixui.components.date.elasticdatepicker.rememberRecentRanges
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

val ranges = remember {
    listOf(
        PantrixQuickRange("Last 15 minutes", last(15, PantrixTimeUnit.Minutes)),
        PantrixQuickRange("Last 1 hour", last(1, PantrixTimeUnit.Hours)),
        PantrixQuickRange("Last 24 hours", last(24, PantrixTimeUnit.Hours)),
        PantrixQuickRange("Last 7 days", last(7, PantrixTimeUnit.Days)),
        PantrixQuickRange("Last 30 days", last(30, PantrixTimeUnit.Days)),
        PantrixQuickRange("Last 90 days", last(90, PantrixTimeUnit.Days)),
        PantrixQuickRange("Last 1 year", last(1, PantrixTimeUnit.Years))
    )
}
var range by remember { mutableStateOf(ranges[4].range) }
var showRecent by remember { mutableStateOf(true) }
val recent = rememberRecentRanges(max = 5)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = showRecent,
        onCheckedChange = { showRecent = it },
        label = "Recently used",
        tagKey = "show_recent"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        commonlyUsed = ranges,
        recentlyUsed = recent.takeIf { showRecent },
        tagKey = "own_ranges"
    )
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Width and height

The picker fills the width it is given up to the style's `maxWidth` (560dp by default, Elastic UI's "restricted"). `maxWidth = Dp.Infinity` gives the full width; in a narrow place the button in words is its icon alone; `height` makes the field compressed.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerStyle
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(SINCE_YESTERDAY) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixText(text = "Default (up to 560dp)", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(range = range, onRangeChange = { range = it }, tagKey = "restricted")
    PantrixText(text = "Full width", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        style = ElasticDatePickerStyle(maxWidth = Dp.Infinity),
        tagKey = "full"
    )
    PantrixText(text = "In a narrow place (320dp)", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        modifier = Modifier.width(NARROW_WIDTH),
        tagKey = "narrow"
    )
    PantrixText(text = "Compressed (32dp)", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        style = ElasticDatePickerStyle(height = COMPRESSED_HEIGHT),
        tagKey = "compressed"
    )
}

private val SINCE_YESTERDAY = PantrixTimeRange(
    PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
    PantrixTimePoint.Now
)

private val NARROW_WIDTH = 320.dp

private val COMPRESSED_HEIGHT = 32.dp
```

### Loading and disabled

A load and a picker that takes no choice. While loading, the button beside the field spins and takes no press; a disabled picker is drawn faint and opens no panel.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(LAST_HOUR) }
var loading by remember { mutableStateOf(true) }
var enabled by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = loading,
        onCheckedChange = { loading = it },
        label = "Loading",
        tagKey = "loading"
    )
    PantrixSwitchButton(
        checked = enabled,
        onCheckedChange = { enabled = it },
        label = "Enabled",
        tagKey = "enabled"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        loading = loading,
        enabled = enabled,
        tagKey = "states"
    )
}

private val LAST_HOUR = last(1, PantrixTimeUnit.Hours)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### The days that can be chosen

The calendar offers this month's days alone (`minDate` and `maxDate`): on an end's Absolute tab the days outside the month are faint and cannot be chosen. A relative end is not bound by them.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.date.rememberToday

val today = rememberToday()
val first = PantrixDate(today.year, today.month, 1)
val last = first.plusMonths(1).plusDays(-1)
var range by remember {
    mutableStateOf(PantrixTimeRange(PantrixTimePoint.Absolute(first.at(PantrixTime(0, 0))), PantrixTimePoint.Now))
}
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    minDate = first,
    maxDate = last,
    tagKey = "bounds"
)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Clock, start of the week and units

How moments are written and read: 12 or 24 hours (`is24Hour`), the first day of the week (`firstDayOfWeek`, which sets the `/w` rounding too), and whether a relative end is put in the unit that reads best (`roundRelativeUnits`: 90 minutes "~ 2 hours ago" or "90 minutes ago"). The language comes from the page's language button.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var is24Hour by remember { mutableStateOf(true) }
var mondayFirst by remember { mutableStateOf(true) }
var roundUnits by remember { mutableStateOf(true) }
var range by remember { mutableStateOf(NINETY_TO_THIRTY_AGO) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = is24Hour, onCheckedChange = { is24Hour = it }, label = "24 hours", tagKey = "clock")
    PantrixSwitchButton(
        checked = mondayFirst,
        onCheckedChange = { mondayFirst = it },
        label = "The week starts on Monday",
        tagKey = "monday"
    )
    PantrixSwitchButton(
        checked = roundUnits,
        onCheckedChange = { roundUnits = it },
        label = "Round the units",
        tagKey = "round"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        roundRelativeUnits = roundUnits,
        firstDayOfWeek = if (mondayFirst) 1 else SUNDAY,
        is24Hour = is24Hour,
        tagKey = "clock"
    )
}

private val NINETY_TO_THIRTY_AGO = PantrixTimeRange(
    PantrixTimePoint.Relative(-90, PantrixTimeUnit.Minutes),
    PantrixTimePoint.Relative(-30, PantrixTimeUnit.Minutes)
)

private const val SUNDAY = 7
```

### Date math in an address

The range stands in an address as date math: `from` and `to` are written again at each choice. With an end typed into the fields and Apply pressed, the range is read from them; an end that cannot be read draws its field as wrong.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(SINCE_YESTERDAY) }
val written = range.toDateMath()
var from by remember(written) { mutableStateOf(written.first) }
var to by remember(written) { mutableStateOf(written.second) }
val start = PantrixTimePoint.parseDateMath(from)
val end = PantrixTimePoint.parseDateMath(to)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(range = range, onRangeChange = { range = it }, tagKey = "url")
    PantrixText(text = "?from=${written.first}&to=${written.second}", style = PantrixTheme.typography.footnote)
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.Bottom
    ) {
        PantrixTextField(
            value = from,
            onValueChange = { from = it },
            modifier = Modifier.weight(1f),
            label = "from",
            error = start == null,
            showCharacterCount = false,
            tagKey = "from"
        )
        PantrixTextField(
            value = to,
            onValueChange = { to = it },
            modifier = Modifier.weight(1f),
            label = "to",
            error = end == null,
            showCharacterCount = false,
            tagKey = "to"
        )
    }
    PantrixButton(
        text = "Apply",
        onClick = { if (start != null && end != null) range = PantrixTimeRange(start, end) },
        variant = ButtonVariant.Outline,
        enabled = start != null && end != null,
        tagKey = "read"
    )
}

private val SINCE_YESTERDAY = PantrixTimeRange(
    PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
    PantrixTimePoint.Now
)
```

### Colours of its own

The field's own colours: its ground, edge, words and icons, the open end's edge, and the colours of an edit that waits and of ends out of order. Each colour not given is the theme's. Change an end and look at the waiting colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerColors
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(LAST_QUARTER) }
val colors = PantrixTheme.colors
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    colors = ElasticDatePickerColors(
        container = colors.neutral.container,
        border = colors.neutral.color,
        active = colors.warning.color,
        pendingContainer = colors.info.container,
        pendingContent = colors.info.onContainer
    ),
    tagKey = "colors"
)

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Auto refresh

The dashboard refreshes itself every ten seconds: the field ends in how often, written short, and a press on it opens the quick menu. The menu's "Refresh every" part turns it on and off and changes how often; nothing shorter than five seconds is taken (`minAutoRefresh`). `onRefresh` runs at each turn, and the next turn waits for it to end.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixAutoRefresh
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration.Companion.seconds

var range by remember { mutableStateOf(LAST_QUARTER) }
var refresh by remember { mutableStateOf(PantrixAutoRefresh(every = 10, paused = false)) }
var count by remember { mutableStateOf(0) }
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        onRefresh = {
            count++
            report("Refreshed")
        },
        tagKey = "auto_refresh",
        autoRefresh = refresh,
        onAutoRefreshChange = {
            refresh = it
            report(if (it.paused) "Auto refresh stopped" else "Auto refresh changed")
        },
        minAutoRefresh = 5.seconds
    )
    PantrixText(text = "Refreshes: $count", style = PantrixTheme.typography.footnote)
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Auto refresh only

Auto refresh alone, for a page with no time data (`layout = AutoRefreshOnly`): the field says "Auto refresh" and how often or off, and a press opens the menu that sets it alone. How often is given in minutes here (`unit = AutoRefreshUnit.Minutes`): once a minute.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.AutoRefreshUnit
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout
import com.pantrixui.components.date.elasticdatepicker.PantrixAutoRefresh
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var refresh by remember { mutableStateOf(PantrixAutoRefresh(every = 1, unit = AutoRefreshUnit.Minutes)) }
var count by remember { mutableStateOf(0) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = LAST_QUARTER,
        onRangeChange = { count++ },
        tagKey = "auto_refresh_only",
        autoRefresh = refresh,
        onAutoRefreshChange = { refresh = it },
        layout = ElasticDatePickerLayout.AutoRefreshOnly
    )
    PantrixText(text = "Refreshes: $count", style = PantrixTheme.typography.footnote)
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Quick select only

For a page that shows the range somewhere else, the quick menu's button alone with the button beside it (`layout = QuickSelectOnly`). The range chosen is written under it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_QUARTER) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "quick_select_only",
        layout = ElasticDatePickerLayout.QuickSelectOnly
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "The end comes before the start",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Time window buttons

Elastic UI's time window buttons beside the field: ‹ and › move the range by its own length, zoom out widens it by `zoomFactor` of its length and zoom in narrows it by as much; zoom in is there only when it is asked for. The range they hand over is of moments.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticTimeWindowButtons
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_HOUR) }
var zoomIn by remember { mutableStateOf(false) }
var factor by remember { mutableStateOf(HALF) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = zoomIn, onCheckedChange = { zoomIn = it }, label = "Zoom in", tagKey = "zoom_in")
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(HALF, "Half (0.5)", tagKey = "half"),
            SegmentOption(QUARTER, "A quarter (0.25)", tagKey = "quarter")
        ),
        selected = factor,
        onSelect = { factor = it },
        fullWidth = false,
        tagKey = "zoom_factor"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "time_window",
        timeWindowButtons = ElasticTimeWindowButtons(zoomIn = zoomIn, zoomFactor = factor)
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "The end comes before the start",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val LAST_HOUR = last(1, PantrixTimeUnit.Hours)

private const val HALF = 0.5

private const val QUARTER = 0.25

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### The quick menu's own panels and order

A panel of the app's own in the quick menu (`customQuickPanels`), after the ranges used lately by default. "My own order" builds the menu with `quickMenu`: the saved ranges first, then the quick select, and no ranges offered by name. The menu's parts are in `ElasticQuickMenuScope`: `quickMenu` is called in that scope.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticQuickMenuScope
import com.pantrixui.components.date.elasticdatepicker.ElasticQuickPanel
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_QUARTER) }
var own by remember { mutableStateOf(false) }
val saved = remember {
    listOf(
        "Night shift" to PantrixTimeRange(
            PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
            PantrixTimePoint.Relative(-16, PantrixTimeUnit.Hours)
        ),
        "Since the last deploy" to last(3, PantrixTimeUnit.Hours)
    )
}
val panel = ElasticQuickPanel("Saved ranges") {
    Column {
        saved.forEachIndexed { index, (name, kept) ->
            PantrixLink(text = name, onClick = { range = kept }, tagKey = "saved_$index")
        }
    }
}
val ownMenu: @Composable ElasticQuickMenuScope.() -> Unit = {
    CustomPanels()
    QuickSelect()
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "Elastic UI's order", tagKey = "elastic"),
            SegmentOption(true, "My own order", tagKey = "own")
        ),
        selected = own,
        onSelect = { own = it },
        fullWidth = false,
        tagKey = "order"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "quick_panels",
        customQuickPanels = listOf(panel),
        quickMenu = if (own) ownMenu else null
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "The end comes before the start",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}
```

### Time zone

The moments are read and written in the chosen time zone's difference (`utcOffset`); the ends' panels name the zone with its difference from UTC (`timeZoneName`). The name only names, and changes nothing.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours

var range by remember { mutableStateOf(SINCE_YESTERDAY) }
var zone by remember { mutableStateOf(ZONES.first()) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = ZONES.mapIndexed { index, it -> SegmentOption(it, it.first, tagKey = "zone_$index") },
        selected = zone,
        onSelect = { zone = it },
        fullWidth = false,
        tagKey = "zone"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "time_zone",
        timeZoneName = zone.first,
        utcOffset = { zone.second }
    )
}

private val SINCE_YESTERDAY = PantrixTimeRange(
    PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
    PantrixTimePoint.Now
)

private val ZONES = listOf("Europe/Istanbul" to 3.hours, "Asia/Tokyo" to 9.hours, "UTC" to Duration.ZERO)
```

### Disabled, with its own words

A picker that takes no choice can show its own words in the place of its range (`disabledText`), as Elastic UI's `isDisabled.display` does: here "All time".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var words by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = words, onCheckedChange = { words = it }, label = "Its own words", tagKey = "words")
    PantrixElasticDatePicker(
        range = LAST_QUARTER,
        onRangeChange = {},
        enabled = false,
        tagKey = "disabled_text",
        disabledText = if (words) "All time" else null
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### The KQL pattern

Elastic UI's KQL pattern: the picker beside a search field. While the search field has the focus the picker shrinks to the quick menu's button (`layout = QuickSelectOnly`) and the room is the query's; when the focus leaves, the range comes back.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerUpdateButton
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(LAST_QUARTER) }
var query by remember { mutableStateOf("") }
var searching by remember { mutableStateOf(false) }
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixTextField(
        value = query,
        onValueChange = { query = it },
        modifier = Modifier.weight(1f).onFocusChanged { searching = it.hasFocus },
        placeholder = "Search with KQL",
        showCharacterCount = false,
        contentDescription = "Search query",
        tagKey = "query"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        modifier = if (searching) Modifier else Modifier.weight(PICKER_SHARE),
        updateButton = ElasticDatePickerUpdateButton.Icon,
        tagKey = "query_range",
        layout = if (searching) ElasticDatePickerLayout.QuickSelectOnly else ElasticDatePickerLayout.Full
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private const val PICKER_SHARE = 1.4f

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

## API

### PantrixElasticDatePicker

`import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixElasticDatePicker(
    range: PantrixTimeRange,
    onRangeChange: (PantrixTimeRange) -> Unit,
    modifier: Modifier = Modifier,
    commonlyUsed: List<PantrixQuickRange> = PantrixQuickRange.commonlyUsed(PantrixTheme.strings),
    recentlyUsed: PantrixRecentRanges? = null,
    updateButton: ElasticDatePickerUpdateButton = ElasticDatePickerUpdateButton.Text,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    loading: Boolean = false,
    enabled: Boolean = true,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    onRefresh: (suspend () -> Unit)? = null,
    roundRelativeUnits: Boolean = true,
    firstDayOfWeek: Int? = null,
    is24Hour: Boolean = true,
    style: ElasticDatePickerStyle? = null,
    colors: ElasticDatePickerColors? = null,
    tagKey: String? = null,
    autoRefresh: PantrixAutoRefresh? = null,
    onAutoRefreshChange: ((PantrixAutoRefresh) -> Unit)? = null,
    minAutoRefresh: Duration = Duration.ZERO,
    layout: ElasticDatePickerLayout = ElasticDatePickerLayout.Full,
    timeWindowButtons: ElasticTimeWindowButtons? = null,
    customQuickPanels: List<ElasticQuickPanel> = emptyList(),
    quickMenu: (@Composable ElasticQuickMenuScope.() -> Unit)? = null,
    timeZoneName: String? = null,
    utcOffset: ((Instant) -> Duration)? = null,
    disabledText: String? = null
)
```

A range of time that can move with the clock, as a dashboard is filtered by: "the last 15 minutes" is still the last 15 minutes at the next refresh. Elastic UI's `EuiSuperDatePicker`, built again on Pantrix.

A field holds the range and a button beside it refreshes it or takes an edit. Every part opens a panel, a popover by default, or a sheet or a dialog where `presentation` asks for one, on every platform alike:

- **The quick menu's button**, the calendar at the field's start, opens the last or the next amount of a unit, ‹ and › to move the range by its own length, the ranges `commonlyUsed` offers by name, and those `recentlyUsed` holds. A choice there is handed over at once.

- **The range's name**, "Last 15 minutes" or "Today", stands in the field while the range has one. A press on it shows the two ends, start → end, and opens the start's panel.

- **An end** opens its tabs: a moment on a calendar, with the times of the day by the half hour and the moment to type; an amount of time from now, with the moment it falls on and a switch that rounds it; or now itself. Moving to a tab makes the end what that tab shows. An edit waits: the field is painted in the success colour with a mark at its end, and the button beside it says Update, which hands the range over. An end before the start paints the field in the danger colour, and Update takes nothing. With `updateButton` `None` each edit is handed over at once. Apply at the end of the moment's field on the calendar's and the relative tab takes the edit and closes the panel, and the button of now's tab makes the end now and does the same.

- **Refresh** reads the range again where no edit waits: `onRefresh` where it is given, and `onRangeChange` with the same range where not.

A press outside an open popover goes on to what it lands on, as in Elastic UI: one press on the other end opens that end's panel, one on Update takes the edit, and one on the open end's button closes its panel. A sheet and a dialog stand over a scrim, and a press on it closes them alone.

The panels are set close, as Elastic UI's are: an end's popover is as wide as its calendar and the times beside it, the quick menu's 400dp, and the text fields, selects, tabs and buttons in them are 8 lower than a form's, 40dp on Android, 36pt on iOS and 32dp on the desktop and the web.

The range is the caller's: a new `range` drops an edit that waits. Where the field has less room than its words and its button need, the button beside it is its icon alone.

```kotlin
val lastQuarterHour = PantrixTimeRange(PantrixTimePoint.Relative(-15, PantrixTimeUnit.Minutes), PantrixTimePoint.Now)
var range by remember { mutableStateOf(lastQuarterHour) }
PantrixElasticDatePicker(range = range, onRangeChange = { range = it }, recentlyUsed = rememberRecentRanges())
```

Parameters:

- `range: PantrixTimeRange`: the range on show. Its ends can be relative to now.
- `onRangeChange: (PantrixTimeRange) -> Unit`: handed the range the reader chose from the quick menu or updated after an edit, or the same range on a refresh without `onRefresh`.
- `modifier: Modifier`: the picker's modifier. The picker fills the width it is given, up to the style's `maxWidth`.
- `commonlyUsed: List<PantrixQuickRange>`: the ranges the quick menu offers by name: by default Elastic UI's eight, in the theme's language. A range on show that is one of these is called by its name.
- `recentlyUsed: PantrixRecentRanges?`: the ranges the reader chose lately, which the quick menu lists and each range the reader applies is recorded in; null for none. `rememberRecentRanges()` keeps them across a configuration change.
- `updateButton: ElasticDatePickerUpdateButton`: the button beside the field: its words and icon, its icon alone, or none, every edit then handed over at once.
- `presentation: DatePickerPresentation`: what the panels open in: by default a sheet in a narrow window and a popover beside the part pressed in a wider one, chosen as a panel opens; or always a popover, a sheet or a dialog. The same on every platform.
- `loading: Boolean`: whether what the range filters loads: the button beside the field spins and takes no press.
- `enabled: Boolean`: whether the picker takes a choice at all. One that takes none is drawn faint and opens nothing.
- `minDate: PantrixDate?`: the first day an end's calendar offers, or null for none so early.
- `maxDate: PantrixDate?`: the last day it offers, or null for none so late.
- `onRefresh: (suspend () -> Unit)?`: what Refresh does where no edit waits, the button spinning while it runs; null to hand the same range to `onRangeChange`. What it throws stops the spinning and goes no further: what went wrong is the caller's to tell, as it is when a turn of `autoRefresh` fails.
- `roundRelativeUnits: Boolean`: whether an end that is an amount from now is put in the unit that reads best, "~ 2 hours ago" for 90 minutes, or keeps its own.
- `firstDayOfWeek: Int?`: the day the calendar's weeks start on and a week is rounded to, as ISO 8601 numbers the days: 1 is Monday. Null is the language's, `PantrixLocale.firstDayOfWeek`.
- `is24Hour: Boolean`: whether a moment is written and chosen by a clock of twenty-four hours, `22:00`, or of twelve, `10:00 PM`.
- `style: ElasticDatePickerStyle?`: this call's own style of the field: over every enclosing one and under the density.
- `colors: ElasticDatePickerColors?`: the field's own colours: the ones it sets, with the theme's for the rest.
- `tagKey: String?`: the picker's automation key: it is `ElasticDatePicker_<tagKey>`, its parts `.Button_quick_menu`, `.Button_name`, `.Button_start`, `.Button_end`, `.Button_auto_refresh`, the time window buttons `.Button_window_previous`, `.Button_window_zoom_in`, `.Button_window_zoom_out` and `.Button_window_next`, and the button beside the field `Button_<tagKey>_update`.
- `autoRefresh: PantrixAutoRefresh?`: how often the range is read again by itself, or null for never. While it is not paused the field ends in how often, written short, and Refresh is done at each turn: `onRefresh`, waited for before the next turn is counted, or the same range handed to `onRangeChange`. An `onRefresh` that fails pauses it, and says so through `onAutoRefreshChange`.
- `onAutoRefreshChange: ((PantrixAutoRefresh) -> Unit)?`: handed the refresh by itself as the reader sets it in the quick menu, where it has a part of its own; null for no such part.
- `minAutoRefresh: Duration`: the shortest refresh by itself the reader can set: a shorter one draws its amount as wrong.
- `layout: ElasticDatePickerLayout`: what the field shows: the range, the quick menu's button alone, or the refresh by itself alone.
- `timeWindowButtons: ElasticTimeWindowButtons?`: Elastic UI's buttons beside the field that move the range by its length and zoom it, or null for none.
- `customQuickPanels: List<ElasticQuickPanel>`: panels of the caller's own in the quick menu, after the ranges used lately.
- `quickMenu: (@Composable ElasticQuickMenuScope.() -> Unit)?`: the quick menu's parts in an order of the caller's own, some left out or panels of its own put in among them; null for Elastic UI's order.
- `timeZoneName: String?`: the time zone the moments are in, named in the ends' panels with its difference from UTC: "Time zone: Europe/Istanbul (UTC+03:00)". It names, and changes nothing; null for no such line.
- `utcOffset: ((Instant) -> Duration)?`: the difference from UTC the moments are read and written in at a moment; null for the screen's clock's (`LocalPantrixClock`), the device's unless a test or a preview gives another.
- `disabledText: String?`: what a picker that takes no choice shows in the place of its range; null for the range.

### ElasticDatePickerUpdateButton

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerUpdateButton`, from `com.pantrixui:components`

```kotlin
enum class ElasticDatePickerUpdateButton
```

The button beside an elastic date picker's field.

Entries:

- `Text`: Refresh, or Update while an edit waits, in words with an icon; its icon alone where the field is narrow.
- `Icon`: The icon alone, named for a screen reader.
- `None`: No button: every edit is handed over at once.

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

### ElasticDatePickerStyle

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerStyle`, from `com.pantrixui:components`

```kotlin
class ElasticDatePickerStyle(
    public val height: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified
) : PantrixStyle<ElasticDatePickerStyle>
```

`PantrixElasticDatePicker`'s field: how tall it is, its corners, the room inside it, the gap between it and the button beside it, and how wide it gets.

The field is as tall as a text field on each platform and has its corners, 48dp on Android, 44pt on iOS and 40dp on the desktop and the web, since it stands beside a form's fields and a screen's search box. It fills the width it is given up to `maxWidth`, room for both ends of a range written as moments: Elastic UI's restricted width. What it opens is drawn with the styles of a popover, a sheet, a calendar and tabs.

The height, the room and the gap follow the density, as a text field's do; the corners and the width do not.

Parameters:

- `height: Dp`: How tall the field is.
- `shape: ShapeSpec`: The field's corners.
- `padding: Dp`: The room between the field's edge and what is in it, at either end.
- `gap: Dp`: Between the field and the button beside it, and between the parts in the field.
- `maxWidth: Dp`: The widest the field and its button get; `Dp.Infinity` for as wide as they are given.

### ElasticDatePickerColors

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerColors`, from `com.pantrixui:components`

```kotlin
data class ElasticDatePickerColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val active: Color = Color.Unspecified,
    public val pendingContainer: Color = Color.Unspecified,
    public val pendingContent: Color = Color.Unspecified,
    public val invalidContainer: Color = Color.Unspecified,
    public val invalidContent: Color = Color.Unspecified,
    public val disabled: Color = Color.Unspecified
)
```

What a `PantrixElasticDatePicker`'s field is painted with, in place of the theme's colours: a colour that is set is used, and one that is left out stays the theme's. What the field opens is painted with the colours of a popover, a sheet, a calendar and tabs.

Parameters:

- `container: Color`: The field's ground. The theme's `surface`, as a text field's.
- `border: Color`: The field's edge, and the line between the quick menu's button and the range. The theme's `border`.
- `content: Color`: The words of the range and of its ends. The theme's `textPrimary`.
- `icon: Color`: The field's icons: the quick menu's calendar and the arrow between the ends. The theme's `textSecondary`.
- `active: Color`: The edge drawn round the end whose panel is open. The primary role's `color`.
- `pendingContainer: Color`: The field's ground while an edit waits for Update. The success role's `container`.
- `pendingContent: Color`: The words, the arrow and the mark on it. The success role's `onContainer`.
- `invalidContainer: Color`: The field's ground while its end comes before its start. The danger role's `container`.
- `invalidContent: Color`: The words, the arrow and the mark on it. The danger role's `onContainer`.
- `disabled: Color`: The words and icons of a field that takes no choice. The theme's `textDisabled`.

### PantrixQuickRange

`import com.pantrixui.components.date.elasticdatepicker.PantrixQuickRange`, from `com.pantrixui:components`

```kotlin
class PantrixQuickRange(
    public val label: String,
    public val range: PantrixTimeRange
)
```

A range an elastic date picker's quick menu offers by its name: "Today", "This week". A range the picker shows that is one of these is called by the name too.

Parameters:

- `label: String`: The range's name, in the reader's language.
- `range: PantrixTimeRange`: The range.

On the type:

- `PantrixQuickRange.commonlyUsed(strings: PantrixStrings): List<PantrixQuickRange>`: Elastic UI's eight, named in `strings`' language: today, this week, this month and this year, from the start of each to its end; yesterday; and the week, the month and the year to now.

### PantrixRecentRanges

`import com.pantrixui.components.date.elasticdatepicker.PantrixRecentRanges`, from `com.pantrixui:components`

```kotlin
class PantrixRecentRanges(
    initial: List<PantrixTimeRange> = emptyList(),
    public val max: Int = 10
)
```

The ranges a reader chose lately, the latest first, as many as `max`: what an elastic date picker given these lists under its quick menu's "Recently used", and records each range the reader applies in. A range the app sets is not recorded. `rememberRecentRanges` keeps one across a configuration change.

Parameters:

- `initial: List<PantrixTimeRange>`: the ranges it starts with, the latest first.
- `max: Int`

Members:

- `ranges: List<PantrixTimeRange>`: The ranges, the latest first.
- `fun record(range: PantrixTimeRange)`: Puts `range` first, and drops it where it was before and the oldest past `max`.
- `fun clear()`: Forgets every range.

### PantrixAutoRefresh

`import com.pantrixui.components.date.elasticdatepicker.PantrixAutoRefresh`, from `com.pantrixui:components`

```kotlin
data class PantrixAutoRefresh(
    public val every: Int,
    public val unit: AutoRefreshUnit = AutoRefreshUnit.Seconds,
    public val paused: Boolean = true
)
```

How often an elastic date picker reads its range again by itself, as Elastic UI's refresh interval: every `every` `unit`s while it is not `paused`. The picker counts the time and does what Refresh does at each turn: `onRefresh`, which is waited for before the next turn is counted, or the same range handed over where it has none.

Parameters:

- `every: Int`: how many `unit`s come between two refreshes; one at least.
- `unit: AutoRefreshUnit`: what `every` counts.
- `paused: Boolean`: whether it waits: the picker counts nothing.

Members:

- `interval: Duration`: How long the picker waits between two refreshes.

### AutoRefreshUnit

`import com.pantrixui.components.date.elasticdatepicker.AutoRefreshUnit`, from `com.pantrixui:components`

```kotlin
enum class AutoRefreshUnit
```

What a refresh by itself is counted in.

Entries:

- `Seconds`: Seconds.
- `Minutes`: Minutes.
- `Hours`: Hours.

### ElasticDatePickerLayout

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout`, from `com.pantrixui:components`

```kotlin
enum class ElasticDatePickerLayout
```

What an elastic date picker's field shows, after Elastic UI's quick select only and auto refresh only.

Entries:

- `Full`: The quick menu's button, the range and the button beside it.
- `QuickSelectOnly`: The quick menu's button alone, with the button beside it: the range is shown somewhere else.
- `AutoRefreshOnly`: The refresh by itself alone, "Auto refresh" and how often or off, which opens a menu that sets it.

### ElasticTimeWindowButtons

`import com.pantrixui.components.date.elasticdatepicker.ElasticTimeWindowButtons`, from `com.pantrixui:components`

```kotlin
data class ElasticTimeWindowButtons(
    public val shift: Boolean = true,
    public val zoomOut: Boolean = true,
    public val zoomIn: Boolean = false,
    public val zoomFactor: Double = 0.5
)
```

Elastic UI's time window buttons, beside a picker's field and its button: ‹ and › move the range back and on by its own length, zoom out widens it by `zoomFactor` of its length and zoom in narrows it by as much, half of it at each end. The range they hand over is of moments, as the quick menu's ‹ and › hand over.

‹, › and zoom in take nothing while the range has no length, and none of them while its ends are out of order. A range of no length is widened by half a second at each end.

Parameters:

- `shift: Boolean`: whether ‹ and › are there.
- `zoomOut: Boolean`: whether zoom out is there.
- `zoomIn: Boolean`: whether zoom in is there: Elastic UI leaves it out unless it is asked for.
- `zoomFactor: Double`: how much of the range's length a zoom adds or takes away, half at each end.

### ElasticQuickPanel

`import com.pantrixui.components.date.elasticdatepicker.ElasticQuickPanel`, from `com.pantrixui:components`

```kotlin
class ElasticQuickPanel(
    public val title: String,
    public val content: @Composable () -> Unit
)
```

A panel of a picker's own in its quick menu, after Elastic UI's custom quick select panels: `title` over `content`, with a line between it and the menu's other parts.

Parameters:

- `title: String`: what the panel is called, a heading over it.
- `content: @Composable () -> Unit`: what the panel holds. What is chosen in it is the caller's to hand over.

### ElasticQuickMenuScope

`import com.pantrixui.components.date.elasticdatepicker.ElasticQuickMenuScope`, from `com.pantrixui:components`

```kotlin
interface ElasticQuickMenuScope
```

The parts of a picker's quick menu, for a menu in an order of the caller's own, after Elastic UI's custom quick select render. Each part stands where it is called, and the menu draws a line between each two; a part with nothing to show, the ranges used lately where there are none, takes no room and no line. A part left out is not in the menu.

Members:

- `@Composable fun QuickSelect()`: The last or the next amount of a unit, ‹ and › to move the range by its length, and Apply.
- `@Composable fun CommonlyUsed()`: The ranges the picker offers by name, in two columns.
- `@Composable fun RecentlyUsed()`: The ranges used lately, the latest first, where there are any.
- `@Composable fun CustomPanels()`: The picker's own panels, `customQuickPanels`, each a part of its own.
- `@Composable fun AutoRefresh()`: The refresh by itself, where the picker takes a change of it.
- `@Composable fun Panel(title: String, content: @Composable () -> Unit)`: A panel of the caller's own: `title` over `content`.

### PantrixTimeRange

`import com.pantrixui.foundation.date.PantrixTimeRange`, from `com.pantrixui:foundation`

```kotlin
class PantrixTimeRange(
    public val start: PantrixTimePoint,
    public val end: PantrixTimePoint
)
```

A range of time whose ends can move with the clock: from `now-15m` to `now` is the last 15 minutes whenever it is read. It keeps no order between its ends, since a point that moves has none until it is read: `resolve` says whether they are in order at a moment.

Parameters:

- `start: PantrixTimePoint`: Where the range starts.
- `end: PantrixTimePoint`: Where it ends.

Members:

- `fun resolve(now: Instant = Clock.System.now(), firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): ClosedRange<Instant>?`: The moments the range runs between, `now` being now, its start rounded down and its end up, on the clock `offsetAt` tells, its weeks starting on `firstDayOfWeek`; or null where its end falls before its start.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): Pair<String, String>`: Both ends as date math: what a URL keeps, and what a range query sends as `gte` and `lte`.

  `offsetAt`: tells the clock's offset from UTC at each moment, for an end written as a moment: by default the device's, as `systemUtcOffset` tells it.

### PantrixTimePoint

`import com.pantrixui.foundation.date.PantrixTimePoint`, from `com.pantrixui:foundation`

```kotlin
sealed interface PantrixTimePoint
```

A point in time that can move with the clock: now, an amount of time from now, or a moment.

"The last 15 minutes" is still the last 15 minutes at the next refresh, so a range a screen is filtered by keeps its points in this form and `resolve`s them each time it is read. Date math, as Elasticsearch and Kibana write it, is their edge: `toDateMath` writes a point as a URL or a query keeps it, `now-15m`, and `parseDateMath` reads it back.

Members:

- `fun resolve(now: Instant = Clock.System.now(), asEnd: Boolean = false, firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: The moment this point falls on, `now` being now, on the clock whose offset from UTC `offsetAt` tells for each moment: by default the device's, as `systemUtcOffset` tells it.

  Seconds, minutes and hours are time that passes; days and longer are the calendar's, on that clock: a day back from noon is noon. A point rounded to a unit is at the unit's start, or where it ends a range (`asEnd`) at its last millisecond, as a range query's `gte` and `lte` read them: from `now/d` to `now/d` is the whole of today. A week starts on `firstDayOfWeek`, as ISO 8601 numbers the days: 1 is Monday.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): String`: This point as date math: `now`, `now-15m`, `now-15m/m`, `now/d`, and a moment as ISO 8601 writes it on the clock `offsetAt` tells, `2026-10-17T14:15:00+03:00`: by default the device's.

On the type:

- `PantrixTimePoint.parseDateMath(text: String): PantrixTimePoint?`: The point the date math `text` writes, or null where it is not date math these points hold.

  - `now`, and one operation after it: `now-15m` and `now+2h`, the number left out as Kibana allows it, `now-d` for `now-1d`; then a rounding: `now-1d/d`, `now/w`, `/1d` as Elasticsearch allows it.

  - The units `y M w d h m s`, and `H` for hours as Elasticsearch writes them. Milliseconds are not read.

  - A moment as ISO 8601 writes one with its offset from UTC or a `Z`: `2026-10-17T14:15:00+03:00`.

  Date math these points do not hold, two operations, `now-1d/d+8h`, or a date before `||`, is null.

#### PantrixTimePoint.Now

```kotlin
data object Now : PantrixTimePoint
```

The moment the point is read.

#### PantrixTimePoint.Relative

```kotlin
class Relative(
    public val amount: Int,
    public val unit: PantrixTimeUnit,
    public val roundTo: PantrixTimeUnit? = null
) : PantrixTimePoint
```

`amount` `unit`s from now, earlier where less than nought, and then rounded to the start of `roundTo`, or to its end where the point ends a range: `Relative(-15, Minutes)` is `now-15m`, and `Relative(-1, Days, roundTo = Days)` is `now-1d/d`, yesterday. With an amount of nought the unit says nothing: `Relative(0, Days, Days)` is `now/d`, today, and with no rounding either the point is now.

Parameters:

- `amount: Int`: How many units from now: less than nought before it.
- `unit: PantrixTimeUnit`: What `amount` counts.
- `roundTo: PantrixTimeUnit?`: What the point is rounded to, or null for no rounding.

#### PantrixTimePoint.Absolute

```kotlin
class Absolute(
    public val moment: Instant
) : PantrixTimePoint
```

A moment, the same wherever it is read: a reader in another time zone sees it on their own clock.

Parameters:

- `moment: Instant`: The moment.

### PantrixTimeUnit

`import com.pantrixui.foundation.date.PantrixTimeUnit`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixTimeUnit(
    internal val letter: Char
)
```

A unit time is counted in: a point's distance from now, and what it is rounded to.

Seconds, minutes and hours are time that passes, the same length on every day. Days and longer are the calendar's, on the clock the point is read by: a day back from noon is noon, on a day the clock is put forward too, and a month on from the 31st of January is the last day of February.

Each is written in date math by the letter Elasticsearch and Kibana write it with: `s`, `m`, `h`, `d`, `w`, `M` and `y`.

Entries:

- `Seconds`: Seconds: `s`.
- `Minutes`: Minutes: `m`.
- `Hours`: Hours: `h`.
- `Days`: Days of the calendar: `d`.
- `Weeks`: Weeks of the calendar, from the day a week starts on: `w`.
- `Months`: Months of the calendar: `M`.
- `Years`: Years of the calendar: `y`.
