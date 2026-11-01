# Sheet

A panel over the app for a short task that belongs to the current screen: choosing how to sort, filling in a field or two, picking from a list, looking at the details of what was pressed. It opens from the bottom edge, where a drag moves it, or from the end edge as a side sheet. It is modal either way: nothing behind it takes a click, and Tab never leaves it.

The sheet never closes itself. A click on the scrim, back, Escape, a drag towards its edge and the side sheet's close button call `onDismissRequest`; what closes it is the calling code, which sets `visible` to false.

- `PantrixSheet` (`com.pantrixui.components.overlay.sheet`, `com.pantrixui:components`): A panel for a short task over the app: along the bottom edge, where a drag moves it, or along the end edge as a side sheet; modal until it closes. Keywords: bottom sheet, side sheet, drawer, action sheet, modal panel, half sheet.

## Features

- **Along the bottom edge.** The default edge is `SheetEdge.Bottom`: the sheet is as wide as the window, up to the style's `maxWidth`, and as tall as what it holds. A drag moves it: a drag down closes it.
- **Side sheet.** With `edge = SheetEdge.End` the sheet stands at the end edge, on the left in a language written right to left: it runs the length of the window, is as wide as the style's `sideWidth` and has a close button. A drag towards the edge closes it. `SheetEdge.Start` opens the same sheet from the start edge: an app's menu in a narrow window.
- **Edge-to-edge content.** The content spans the sheet's width: the rows of a list reach its edges, and a form brings its own horizontal padding. Content that does not fit in the sheet scrolls under the title.
- **Half open.** With `halfOpen` a sheet whose content is taller than half the window first opens half open, its top at the middle of the window. A drag up, or focus moving into it, opens it fully; a drag down from half open closes it.
- **Full screen.** With `fullScreen` the fully open sheet is as tall as the window under the status bar, however short its content. `coverStatusBar` takes it under the status bar too.
- **A list that scrolls itself.** A long list belongs in a `LazyColumn`, with `scrollContent = false`. `overscrollMovesSheet = false` makes the list do nothing but scroll: once it is at its top it does not pull the sheet down, and the handle and the title still drag the sheet.
- **A sheet that cannot be dismissed.** With `dismissible = false` a drag, the scrim, back and Escape do nothing; a side sheet has no close button, and a sheet that does not open half open has no handle either. The way out is a control in the content.
- **It stays in the tree as it closes.** A closed sheet composes nothing: it stays in the tree with `visible = false` and leaves with the theme's motion. A sheet taken out of the composition while it is open is gone at once, without the motion.
- **Keyboard and screen reader.** When the sheet is opened with the keyboard, focus starts on the first control; when it is opened by touch, focus stays where it was. `title` is announced when the sheet opens and is the heading of what it holds. A screen reader cannot drag, so it is offered actions that open a half-open sheet fully and bring it back.
- **Colour and style.** `colors` changes the fill, the title, the handle, the close icon and the scrim; `style` the corners that face the app, the widths, the margin kept for the scrim, the shadow and the handle. The corners are large on Android and iOS and medium on desktop and the web; there is no shadow on iOS.

## Usage

### Choose how to sort

```kotlin
PantrixSheet(
    visible = sorting,
    onDismissRequest = { sorting = false },
    title = stringResource(Res.string.sort_by),
    tagKey = "sort_by"
) {
    PantrixRadioGroup(
        options = sortOptions,
        selected = sort,
        onSelect = {
            sort = it
            sorting = false
        },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        tagKey = "sort"
    )
}
```

### A form in a side sheet

```kotlin
PantrixSheet(
    visible = editing,
    onDismissRequest = { editing = false },
    title = stringResource(Res.string.edit_profile),
    edge = SheetEdge.End,
    tagKey = "edit_profile"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
    ) {
        PantrixTextField(state = name, label = stringResource(Res.string.name), tagKey = "name")
        PantrixButton(text = stringResource(Res.string.save), onClick = onSave, tagKey = "save")
    }
}
```

### A long list that opens half open and only scrolls

```kotlin
PantrixSheet(
    visible = choosingCountry,
    onDismissRequest = { choosingCountry = false },
    title = stringResource(Res.string.country),
    halfOpen = true,
    fullScreen = true,
    overscrollMovesSheet = false,
    scrollContent = false,
    tagKey = "country"
) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(bottom = PantrixTheme.spacing.lg)
    ) {
        items(countries, key = { it.code }) { country ->
            CountryRow(country = country, onClick = { onCountry(country) })
        }
    }
}
```

## Examples

### Sorting

At its plainest: a title and content. A choice is the whole task: the sheet closes as soon as it is made, and there is no need for a separate "OK" button.

The sheet never closes itself: a drag down, a click on the scrim, back and Escape call `onDismissRequest`; in every case it is the `open = false` line that closes it. The card's "Last event" line says what happened last.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
var sort by rememberSaveable { mutableStateOf("name") }
PantrixButton(
    text = "Sort by: ${SORTS.first { it.value == sort }.label}",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_sort"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Sort sheet closed")
    },
    title = "Sort by",
    tagKey = "sort_by"
) {
    PantrixRadioGroup(
        options = SORTS,
        selected = sort,
        onSelect = {
            sort = it
            open = false
            report("Sort order: ${SORTS.first { option -> option.value == it }.label}")
        },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        tagKey = "sort"
    )
}

private val SORTS = listOf(
    RadioOption(value = "name", label = "Name", tagKey = "name"),
    RadioOption(value = "date", label = "Date modified", tagKey = "date"),
    RadioOption(value = "size", label = "Size", tagKey = "size")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Form

A field and a button. The content reaches the sheet's edges, so the form brings its own horizontal padding: `Modifier.padding(horizontal = …)`. "Save" is disabled while the note is empty.

When the sheet is opened by touch, focus does not move to the field. Once the field is pressed, the sheet stays above the keyboard.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val note = rememberTextFieldState()
PantrixButton(
    text = "Add note…",
    onClick = {
        note.clearText()
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "open_note"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Note sheet closed")
    },
    title = "Add note",
    tagKey = "note"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
    ) {
        PantrixTextField(state = note, modifier = Modifier.fillMaxWidth(), label = "Note", tagKey = "note")
        PantrixButton(
            text = "Save",
            onClick = {
                open = false
                report("Note: ${note.text}")
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = note.text.isNotBlank(),
            tagKey = "save_note"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### With the keyboard open

A sheet opened while typing in a field of the page. Focus stays wherever it is on the page, and is there again when the sheet closes; where that is depends on the platform. On Android and iOS a tap on the button takes no focus: focus stays in the field that was typed in. On desktop and the web a press on the button moves focus to the button: when the sheet closes, focus is on the button.

While the sheet is open, what is typed on the keyboard goes to the sheet, not to the field underneath; meanwhile the field is drawn at rest, without its caret. On Android and iOS the on-screen keyboard closes when the sheet opens; when the sheet closes, the caret and the keyboard return to the field.

Type in the field first, then press the button: what was typed in the field stays as it is on every platform.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val search = rememberTextFieldState()
PantrixTextField(
    state = search,
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Search",
    tagKey = "page_search"
)
PantrixButton(
    text = "Filters…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_filters"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Filter sheet closed")
    },
    title = "Filters",
    tagKey = "filters"
) {
    FILTERS.forEachIndexed { index, filter ->
        SheetRow(
            text = filter,
            tag = "Row_filter_$index",
            onClick = {
                open = false
                report("Filter: $filter")
            }
        )
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val FILTERS = listOf("Shared only", "Last 7 days", "PDF files")
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Half-open list

A long list that starts half open: the top of it is usually enough. With `halfOpen` the sheet opens up to the middle of the window; a drag up, or focus moving into it, opens it fully. `fullScreen` makes the fully open sheet as tall as the window under the status bar.

The list scrolls itself: it is in a `LazyColumn`, and `scrollContent = false` turns off the sheet's own scroll area. The list is given `Modifier.fillMaxWidth()`: without it, a drag beside its rows would not scroll it. With `overscrollMovesSheet = false` a list that has reached its top does not pull the sheet down; the handle and the title still drag the sheet.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Choose a country…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_countries"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Country sheet closed")
    },
    title = "Country",
    halfOpen = true,
    fullScreen = true,
    overscrollMovesSheet = false,
    scrollContent = false,
    tagKey = "country"
) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth().testTag("List_countries"),
        contentPadding = PaddingValues(bottom = PantrixTheme.spacing.lg)
    ) {
        itemsIndexed(COUNTRIES) { index, country ->
            SheetRow(
                text = country,
                tag = "Row_country_$index",
                onClick = {
                    open = false
                    report("Country: $country")
                }
            )
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val COUNTRIES = (
    "Argentina, Australia, Austria, Belgium, Brazil, Bulgaria, Canada, Chile, China, Colombia, Czechia, " +
        "Denmark, Egypt, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, India, Indonesia, Ireland, " +
        "Italy, Japan, Kenya, Latvia, Lithuania, Malaysia, Mexico, Morocco, Netherlands, New Zealand, Norway, " +
        "Peru, Poland, Portugal, Romania, Singapore, Slovakia, South Africa, South Korea, Spain, Sweden, " +
        "Switzerland, Thailand, Tunisia, Türkiye, Ukraine, United Kingdom, Vietnam"
).split(", ")
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Full screen

Like a screen of its own: with `fullScreen` the fully open sheet is as tall as the window under the status bar, however short its content. With `coverStatusBar` it reaches under the status bar too and is as tall as the whole window: its top corners square off there, and its handle and title stay below the bar.

The files are filtered as you type in the field; the sheet's height does not change even when the list gets shorter. The search starts empty each time the sheet opens.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val query = rememberTextFieldState()
PantrixButton(
    text = "Search files…",
    onClick = {
        query.clearText()
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "open_search"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Search sheet closed")
    },
    title = "Search files",
    fullScreen = true,
    coverStatusBar = true,
    tagKey = "search"
) {
    PantrixTextField(
        state = query,
        modifier = Modifier.fillMaxWidth().padding(horizontal = PantrixTheme.spacing.lg),
        label = "Search",
        tagKey = "query"
    )
    FILES.forEachIndexed { index, file ->
        if (query.text.isBlank() || file.contains(query.text, ignoreCase = true)) {
            SheetRow(
                text = file,
                tag = "Row_file_$index",
                onClick = {
                    open = false
                    report("Opened file: $file")
                }
            )
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val FILES = listOf("Report.pdf", "Budget.xlsx", "Presentation.key", "Notes.txt", "Contract.pdf", "Logo.svg")
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A required choice

`dismissible = false`: no handle is drawn; a drag, the scrim, back and Escape do nothing, and `onDismissRequest` is not called. The buttons inside are the way out, so there is a button for every way out. It is used only where a control in the sheet's content must close it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Notification permission",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_permission"
)
PantrixSheet(
    visible = open,
    onDismissRequest = { report("This is never called: the sheet cannot be dismissed") },
    title = "Allow notifications",
    dismissible = false,
    tagKey = "permission"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = "Shall we let you know when shared files change?")
        PantrixButton(
            text = "Allow",
            onClick = {
                open = false
                report("Notifications allowed")
            },
            modifier = Modifier.fillMaxWidth(),
            tagKey = "allow"
        )
        PantrixButton(
            text = "Not now",
            onClick = {
                open = false
                report("Notification permission postponed")
            },
            modifier = Modifier.fillMaxWidth(),
            variant = ButtonVariant.Text,
            tagKey = "not_now"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Side sheet

`edge = SheetEdge.End`: the sheet comes in from the window's end edge, the right one in a left-to-right language, and is as tall as the window. It is for the details of what was pressed: the list stays where it is, and the details come in from the side.

The close button, the scrim, back, Escape and a drag towards the edge close it. A side sheet does not open half open and is never full screen: those parameters are for a sheet along the bottom edge only.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Report.pdf details",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_details"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Details sheet closed")
    },
    title = "Report.pdf",
    edge = SheetEdge.End,
    tagKey = "details"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        DETAILS.forEach { (name, value) ->
            Column {
                PantrixText(
                    text = name,
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary
                )
                PantrixText(text = value)
            }
        }
    }
}

private val DETAILS = listOf(
    "Type" to "PDF document",
    "Size" to "2,4 MB",
    "Modified" to "3 October 2026",
    "Owner" to "Ada Yılmaz",
    "Location" to "Documents / Reports"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A form in a side sheet

The place for a form in a wide window: the page stays in view behind it. When it is opened with the keyboard, focus is in the first field; Tab goes round inside the sheet. "Save" is disabled while the name is empty.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val name = rememberTextFieldState(initialText = "Ada Yılmaz")
val title = rememberTextFieldState(initialText = "Designer")
PantrixButton(
    text = "Edit profile…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_profile"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Profile sheet closed")
    },
    title = "Edit profile",
    edge = SheetEdge.End,
    tagKey = "profile"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
    ) {
        PantrixTextField(state = name, modifier = Modifier.fillMaxWidth(), label = "Name", tagKey = "name")
        PantrixTextField(state = title, modifier = Modifier.fillMaxWidth(), label = "Title", tagKey = "title")
        PantrixButton(
            text = "Save",
            onClick = {
                open = false
                report("Profile: ${name.text}, ${title.text}")
            },
            enabled = name.text.isNotBlank(),
            tagKey = "save_profile"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Menu from the start edge

`edge = SheetEdge.Start`: the sheet comes from the window's start edge, from the left in a language written left to right. It is an app's menu in a narrow window: the navigation that stands at the side in a wide window opens on a phone from a button, and closes when a destination is chosen.

It is the side sheet the other way round: it runs the length of the window, has a close button, and a drag towards the start edge closes it.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var where by rememberSaveable { mutableStateOf(SECTIONS.first()) }
PantrixButton(
    text = "Menu",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_menu"
)
PantrixText(text = "Open section: $where", color = PantrixTheme.colors.textSecondary)
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Docs",
    edge = SheetEdge.Start,
    tagKey = "menu"
) {
    Column {
        SECTIONS.forEachIndexed { index, section ->
            SheetRow(text = section, tag = "menu_$index") {
                where = section
                open = false
            }
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val SECTIONS = listOf("Installation", "Theme", "Forms", "Testing")
```

### Its own colours

The colours given with `colors` change, and the ones left out stay the theme's: here the fill, the title and the handle are in the app's own purple, and the scrim is the theme's.

No role of the theme has this purple, so the colour that reads on it is the caller's to give too: the title's through `colors`, and that of the text in the content through its own `color`. Had the fill been one of the theme's role colours, the title, the handle and the close icon would have taken the colour paired with that role by themselves.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetColors
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixButton(
    text = "What you get with Pro",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_pro"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Pro sheet closed")
    },
    title = "Upgrade to Pro",
    colors = SheetColors(container = own.container, title = own.onContainer, handle = own.color),
    tagKey = "pro"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixText(
            text = "Unlimited projects, shared folders and priority support.",
            color = own.onContainer
        )
        PantrixButton(
            text = "Upgrade",
            onClick = {
                open = false
                report("Plan upgraded")
            },
            tagKey = "upgrade_plan"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.
- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Its own style

`style` changes the geometry of this call alone: the corners that face the app have the theme's smallest rounding (`ShapeRole.ExtraSmall`), the sheet is 420dp wide at most, and the handle is 56dp by 6dp. In a window wider than 420dp the sheet stays in the middle of the bottom edge. The fields that are not set come from the platform's style.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixButton(
    text = "Export…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_export"
)
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Export",
    style = SheetStyle(
        shape = ShapeRole.ExtraSmall,
        maxWidth = 420.dp,
        handleWidth = 56.dp,
        handleHeight = 6.dp
    ),
    tagKey = "export"
) {
    EXPORT_FORMATS.forEachIndexed { index, format ->
        SheetRow(text = format, tag = "Row_export_$index", onClick = { open = false })
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val EXPORT_FORMATS = listOf("PDF document", "Word document", "Plain text")
```

### In a part in another theme

A part in the opposite colours to the page, and a sheet opened from inside it. The part is a second theme (`PantrixTheme(darkTheme = …)`); the sheet is called inside that theme too, so it is in that theme's colours: if the part is dark, so is the sheet.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixButton(text = "Open from this part", onClick = { open = true }, tagKey = "open_sheet_in_part")
        }
    }
    PantrixSheet(
        visible = open,
        onDismissRequest = {
            open = false
            report("The part's sheet closed")
        },
        title = "Share",
        tagKey = "share"
    ) {
        SHARE_TARGETS.forEachIndexed { index, target ->
            SheetRow(
                text = target,
                tag = "Row_share_$index",
                onClick = {
                    open = false
                    report("Shared: $target")
                }
            )
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val SHARE_TARGETS = listOf("Copy link", "Send by email", "Open to the team")
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### An edge by the window

`edge = SheetEdge.Adaptive`: a full-screen sheet from the bottom in a narrow window, a side sheet in a wider one. The place for a form or the details of what was pressed: it fills a phone, and stands beside the content on a tablet and a desktop. Switch between "Narrow" and "Wide"; a sheet that is open keeps its edge when the window changes.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
// The card's window is as tall as the example: the example is kept tall so that a sheet opened in a narrow window has room.
Column(Modifier.fillMaxWidth().height(280.dp)) {
    PantrixButton(text = "Order 1042", onClick = { open = true }, tagKey = "open_adaptive_sheet")
    PantrixSheet(
        visible = open,
        onDismissRequest = { open = false },
        title = "Order 1042",
        edge = SheetEdge.Adaptive,
        tagKey = "adaptive_sheet"
    ) {
        Column(
            modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText("Three items, delivered on Tuesday.")
            PantrixText("No delivery charge; the invoice came by email.")
            PantrixButton(text = "Close", onClick = { open = false }, tagKey = "adaptive_sheet_close")
        }
    }
}
```

## API

### PantrixSheet

`import com.pantrixui.components.overlay.sheet.PantrixSheet`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSheet(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    title: String? = null,
    modifier: Modifier = Modifier,
    edge: SheetEdge = SheetEdge.Bottom,
    dismissible: Boolean = true,
    halfOpen: Boolean = false,
    fullScreen: Boolean = false,
    coverStatusBar: Boolean = false,
    overscrollMovesSheet: Boolean = true,
    scrollContent: Boolean = true,
    style: SheetStyle? = null,
    colors: SheetColors? = null,
    tagKey: String? = null,
    content: @Composable ColumnScope.() -> Unit
)
```

A panel over the app for a short task that belongs to the current screen: choosing how to sort, where to share, a field or two, a list to pick from, the details of what was pressed.

It lies along the `edge` it is given. Along the bottom edge it is as wide as the window up to the style's `maxWidth` and as tall as what it holds, and a drag moves it. Along the end edge it is a side sheet: as tall as the window and the style's `sideWidth` wide, with a button to close it, and a drag towards the edge closes it. It is modal either way: nothing behind it takes a click, Tab never leaves it, and on Android TalkBack stays inside it. It is shown while `visible` is true and enters and leaves with the theme's motion; it never hides itself. Back, Escape, a click on the scrim, a drag towards its edge and the side sheet's close button call `onDismissRequest` unless `dismissible` is false, and so does a screen reader's dismiss action on a full-screen sheet, which can cover the scrim.

The content spans the sheet's width, so the rows of a list reach its edges; give a form its own horizontal padding. It scrolls under the title when the sheet is too short for it. A long list belongs in a `LazyColumn`, with `scrollContent` off.

**Close it to see it leave.** A sheet that has closed composes nothing, so leaving it in the tree with `visible = false` is free, and it leaves with the theme's motion. An open one that is taken out of the composition is gone without it, and that is all it costs: its window is composed at the root of the window around it, so a layout that throws its content away while it measures closes no layer that is still being measured.

Parameters:

- `visible: Boolean`: whether the sheet is shown. It enters and leaves with the theme's motion.
- `onDismissRequest: () -> Unit`: called for back, Escape, a click on the scrim, a drag towards the edge and the side sheet's close button while `dismissible`. The sheet stays until `visible` is false.
- `title: String?`: what the sheet is for, as a short label: "Sort by". It is announced when the sheet appears and is its heading. Null or blank for none: no line is kept for it, the content starts under the handle, and a screen reader announces no name when the sheet appears. A side sheet's close button still stands at its top.
- `modifier: Modifier`: applied to the sheet itself. The strip of scrim kept clear beside it is no part of it.
- `edge: SheetEdge`: the edge of the window the sheet lies along: the bottom, the end, the start, or by the window's width (`SheetEdge.Adaptive`), full screen from the bottom in a narrow one. `halfOpen`, `fullScreen`, `coverStatusBar` and `overscrollMovesSheet` count for an adaptive sheet where it comes from the bottom.
- `dismissible: Boolean`: whether back, Escape, a click on the scrim, a drag towards the edge, the side sheet's close button and a screen reader's dismiss action ask to close. Turn it off only when a control in `content` must close the sheet.
- `halfOpen: Boolean`: whether the sheet first opens half open, its top at the middle of the window, when what it holds is taller than that. A drag up opens it fully, and so does focus moving into it; a drag down from half open closes it. Along the bottom edge only.
- `fullScreen: Boolean`: whether the fully open sheet is as tall as the window under the status bar however short its content, with no scrim above it. Like every sheet along the bottom edge it reaches the window's bottom edge, under the system's navigation bar, and keeps what it holds above that bar. Along the bottom edge only.
- `coverStatusBar: Boolean`: whether a `fullScreen` sheet reaches under the status bar too, fully open as tall as the whole window. Its top corners square off as it slides under the bar, its handle and title stay below the bar, and on Android the bar's icons turn to read against the sheet where it is as wide as the window. Along the bottom edge and with `fullScreen` only.
- `overscrollMovesSheet: Boolean`: whether a drag down on content that is already at its top goes on to move the sheet down: to half open, then closed. Turn it off for a list that should only scroll; the handle and the title still drag the sheet, and a drag up on the content still opens a half-open sheet. Along the bottom edge only.
- `scrollContent: Boolean`: whether the sheet puts `content` in a scroll area under the title. Turn it off for content that scrolls itself, such as a `LazyColumn`, which cannot sit in a scroll area: `content` then gets the height left under the title, and its scrolling still opens a half-open sheet and moves the sheet down past its top. Give a `LazyColumn` `Modifier.fillMaxWidth()`: a list is only as wide as the rows on screen, and a drag beside them would not scroll it.
- `style: SheetStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SheetColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `tagKey: String?`: a locale-independent key for automation: the sheet's tag is `Sheet_<tagKey>`, on the sheet as it is drawn, and the side sheet's close button is `SheetClose_<tagKey>`.
- `content: @Composable ColumnScope.() -> Unit`: what the sheet holds, under the title.

### SheetEdge

`import com.pantrixui.components.overlay.sheet.SheetEdge`, from `com.pantrixui:components`

```kotlin
enum class SheetEdge
```

The edge of the window a `PantrixSheet` lies along.

Entries:

- `Bottom`: The bottom edge. The sheet is as wide as the window up to the style's `maxWidth` and as tall as what it holds, and a drag down closes it.
- `End`: The end edge, the left one in a right-to-left layout. The sheet is as tall as the window and the style's `sideWidth` wide, and a drag towards the edge closes it.
- `Start`: The start edge, the right one in a right-to-left layout: an app's menu, which a narrow window keeps in a sheet rather than beside its content. The sheet is as tall as the window and the style's `sideWidth` wide, and a drag towards the edge closes it.
- `Adaptive`: The bottom edge in a narrow window, the `Compact` width class, as a full-screen sheet, and the end edge in every wider one: a form or the details of what was pressed, which fill a phone and stand beside the content on a tablet or a desktop. The window is the one the sheet is shown over, and it is asked as the sheet opens: one that is open stays as it is when the window changes.

### SheetStyle

`import com.pantrixui.components.overlay.sheet.SheetStyle`, from `com.pantrixui:components`

```kotlin
class SheetStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val sideWidth: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val handleWidth: Dp = Dp.Unspecified,
    public val handleHeight: Dp = Dp.Unspecified,
    public val handlePadding: Dp = Dp.Unspecified
) : PantrixStyle<SheetStyle>
```

`PantrixSheet`'s geometry.

The space between the handle, the title and the content comes from the theme's spacing, so it follows density, and so do the margin and the room around the handle. The widths, the corners, the shadow and the handle itself do not. A sheet's colours are not part of its style: they are the theme's, and `SheetColors` where a call has its own.

Parameters:

- `shape: ShapeSpec`: The corners that face the app: the top two of a sheet along the bottom edge, the start two of one along the end edge. The corners at the window's edge are square. Large on Android and iOS, medium on desktop and the web.
- `maxWidth: Dp`: The widest a sheet along the bottom edge gets; in a wider window it stays in the middle of the edge.
- `sideWidth: Dp`: How wide a sheet along the end edge is, where the window leaves it that room.
- `margin: Dp`: Kept clear between the sheet and the far side of the window, so that the scrim still shows there and a tap on it closes the sheet: above a tall sheet along the bottom edge, beside a sheet along the end edge in a narrow window. It is a target for a tap, so it is each platform's smallest touch target.
- `elevation: Dp`: How high the sheet floats over the scrim, which is how large its shadow is. None on iOS.
- `handleWidth: Dp`: How long the drag handle is, which a sheet along the bottom edge draws while a drag can move it.
- `handleHeight: Dp`: How thick the drag handle is: `handleWidth` is how long it is.
- `handlePadding: Dp`: Above and below the handle.

### SheetColors

`import com.pantrixui.components.overlay.sheet.SheetColors`, from `com.pantrixui:components`

```kotlin
data class SheetColors(
    public val container: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val handle: Color = Color.Unspecified,
    public val closeIcon: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

What a `PantrixSheet` is painted with, for a call that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixSheet(…, colors = SheetColors(container = PantrixTheme.colors.background))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the title, the handle and the close icon, unless those are given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The sheet's fill. The theme's `surface`.
- `title: Color`: The title. The theme's `textPrimary`.
- `handle: Color`: The drag handle of a sheet along the bottom edge, as it is drawn, with its own alpha. The theme's `textSecondary` at 40%: faint, and seen on any surface.
- `closeIcon: Color`: The icon of the close button of a sheet along the end edge. The theme's `onSurface`.
- `scrim: Color`: The dimming laid over the app behind the sheet, with its own alpha. The theme's `scrim`.
