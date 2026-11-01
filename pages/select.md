# Select

One choice out of a list: a country, a currency, a plan. Its box is a text field's box: its label above, its supporting or error text below, a chevron at its end. A press on the box opens the list under the box, as wide as the box.

The choice is the caller's and not the component's: `selected` is given, and `onSelect` asks for a new one. A press on an option chooses it and closes the list; a press outside it, the back key and Escape only close it.

It is for a list short enough to read, or one worth searching. For two or three options that should all be in view at once, a radio group or a segment button is used; for actions, a menu; for more than one value, `PantrixMultiSelect`.

- `PantrixSelect` (`com.pantrixui.components.overlay.select`, `com.pantrixui:components`): One choice out of a list the control opens under itself, in a text field's own box; the list can be searched, options can have icons and can be disabled one by one, and it binds to a form's field. Keywords: dropdown, picker, combobox, options, single select, searchable dropdown.

## Features

- **A field's box.** `label`, `placeholder`, `supportingText` and `error` are as they are in a text field. While the list is open the box is drawn as a field with the focus.
- **The selected row.** The selected option is marked by its row's fill and the tick at its end: not by a colour alone. The list opens with the selected row in view.
- **Where the list goes.** The list opens under the box and stays there: if it does not fit the room below, it is only as tall as that room and scrolls inside it. If there is not room for three of its rows below, it opens above the box. Once it is open it stays where it is as long as there is room for one of its rows, even when the keyboard comes up and leaves less room.
- **Search.** `searchable` puts a search field in the list that narrows the options by their labels; the list gets as short as the rows that are left.
- **Options.** A `SelectOption` carries a value, a label and, if wanted, an icon. An option with `enabled = false` stays in the list and is read, but cannot be chosen.
- **Keyboard.** Enter or the space bar opens the list, and the focus comes to the selected row. The arrows move through the rows and go round from the last to the first, Home and End go to the first and the last row, and Enter and the space bar choose. Once the list has closed the focus is on the box again.
- **Form.** The `PantrixSelect` that takes a `field` gets its choice, its error and its name from the form's field.
- **Colours and style.** The list's colours are given with `colors` (`SelectColors`) and the box's with `fieldColors` (`TextFieldColors`); the list's style with `style` (`SelectStyle`) and the box's with `fieldStyle` (`TextFieldStyle`).
- **Screen reader.** The box is a drop-down list, collapsed or expanded; its label and its supporting text are read with it. `contentDescription` gives the name of a select that has no label.
- **Automation.** `tagKey` tags the box `Select_<tagKey>`, its list `SelectList_<tagKey>` and its search field `SelectSearch_<tagKey>`. The options are named inside the box: `Select_country.SelectOption_tr`.

## Usage

### A country, with nothing chosen at first

```kotlin
var country by rememberSaveable { mutableStateOf<String?>(null) }
PantrixSelect(
    options = countries.map { SelectOption(value = it.code, label = it.name, tagKey = it.code) },
    selected = country,
    onSelect = { country = it },
    label = stringResource(Res.string.country),
    placeholder = stringResource(Res.string.choose_a_country),
    tagKey = "country"
)
```

### Bound to a form's field, where a choice has to be made

```kotlin
val form = rememberFormState()
val plan = form.field<String?>("plan", initial = null, Rules.required(stringResource(Res.string.plan_required)))
PantrixSelect(
    field = plan,
    options = plans.map { SelectOption(value = it.id, label = it.name, tagKey = it.id) },
    label = stringResource(Res.string.plan)
)
```

### A list that is searched, with options that cannot be chosen

```kotlin
PantrixSelect(
    options = languages.map {
        SelectOption(value = it.id, label = it.name, enabled = it.supported, tagKey = it.id)
    },
    selected = language,
    onSelect = { language = it },
    label = stringResource(Res.string.language),
    searchable = true,
    searchPlaceholder = stringResource(Res.string.search_languages),
    tagKey = "language"
)
```

### As wide as its options need, in a toolbar

```kotlin
PantrixSelect(
    options = zooms.map { SelectOption(value = it.percent, label = it.label, tagKey = it.key) },
    selected = zoom,
    onSelect = { zoom = it },
    modifier = Modifier.width(IntrinsicSize.Max),
    contentDescription = stringResource(Res.string.zoom),
    tagKey = "zoom"
)
```

### Icons before the options, in colours of its own, with no label

```kotlin
val success = PantrixTheme.colors.success
PantrixSelect(
    options = folders.map {
        SelectOption(value = it.id, label = it.name, icon = PantrixIcons.Folder, tagKey = it.id)
    },
    selected = folder,
    onSelect = { folder = it },
    colors = SelectColors(selectedContainer = success.container),
    fieldColors = TextFieldColors(focusedBorder = success.color),
    contentDescription = stringResource(Res.string.folder),
    tagKey = "folder"
)
```

## Examples

### One choice

At its plainest: the options, `selected` and `onSelect`. The box shows what is chosen, and `placeholder` while nothing is; `label` is above the box and `supportingText` below it.

Press the box: the list opens under it, as wide as the box, and the box is drawn as a field with the focus. A press on an option chooses it and closes the list; a press outside it, the back key and Escape only close it. The card's "Last event" line shows what `onSelect` last asked for; most of the other examples have the same line.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var country by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = COUNTRIES,
    selected = country,
    onSelect = { code ->
        country = code
        report("Country selected: ${COUNTRIES.first { it.value == code }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Country",
    placeholder = "Choose a country",
    supportingText = "Your invoice is issued with this country's tax.",
    tagKey = "country"
)

private val COUNTRIES = listOf(
    SelectOption(value = "tr", label = "Türkiye", tagKey = "tr"),
    SelectOption(value = "de", label = "Germany", tagKey = "de"),
    SelectOption(value = "gb", label = "United Kingdom", tagKey = "gb"),
    SelectOption(value = "jp", label = "Japan", tagKey = "jp"),
    SelectOption(value = "us", label = "United States of America", tagKey = "us")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Searchable

`searchable = true` puts a search field in the list: as you type, the options narrow to those whose label holds what is typed, and the list gets as short as the rows that are left. `searchPlaceholder` is what the field shows while it is empty.

The focus stays in the search field: the arrows move a mark among the rows that match, and the keyboard's action key chooses the marked row. As soon as something is typed the mark is on the first match. On a desktop and in a desktop's browser the field takes the focus when the list opens; on a phone and a tablet it waits to be touched. When the keyboard comes up the list stays under the box and gets shorter.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var language by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = LANGUAGES,
    selected = language,
    onSelect = { name ->
        language = name
        report("Language selected: $name")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Select a language (searchable)",
    placeholder = "Choose a language",
    searchable = true,
    searchPlaceholder = "Search languages…",
    tagKey = "language"
)

private val LANGUAGES = listOf(
    SelectOption(value = "Kotlin", label = "Kotlin", tagKey = "kotlin"),
    SelectOption(value = "Java", label = "Java", tagKey = "java"),
    SelectOption(value = "Swift", label = "Swift", tagKey = "swift"),
    SelectOption(value = "Dart", label = "Dart", tagKey = "dart"),
    SelectOption(value = "TypeScript", label = "TypeScript", tagKey = "typescript"),
    SelectOption(value = "JavaScript", label = "JavaScript", tagKey = "javascript"),
    SelectOption(value = "Python", label = "Python", tagKey = "python"),
    SelectOption(value = "Go", label = "Go", tagKey = "go"),
    SelectOption(value = "Rust", label = "Rust", tagKey = "rust"),
    SelectOption(value = "C#", label = "C#", tagKey = "csharp"),
    SelectOption(value = "Ruby", label = "Ruby", tagKey = "ruby")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Partly disabled

`SelectOption(enabled = false)` disables a single option. The option stays in the list and is read, but it is written in the disabled colour, a press on it does nothing and the keyboard skips it: it is not taken out of the list, so that what cannot be chosen is known to be there too.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var option by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = PARTLY_DISABLED,
    selected = option,
    onSelect = { value ->
        option = value
        report("Selected: ${PARTLY_DISABLED.first { it.value == value }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Option",
    placeholder = "Choose an option",
    tagKey = "partly_disabled"
)

private val PARTLY_DISABLED = listOf(
    SelectOption(value = "active_1", label = "Active option 1", tagKey = "active_1"),
    SelectOption(value = "disabled_1", label = "Disabled option", enabled = false, tagKey = "disabled_1"),
    SelectOption(value = "active_2", label = "Active option 2", tagKey = "active_2"),
    SelectOption(value = "disabled_2", label = "Disabled option 2", enabled = false, tagKey = "disabled_2")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Options with icons

`SelectOption(icon = …)` puts an icon at the start of the option: the icon is in the label's colour, and a screen reader passes over it. The selected row is marked by its fill and by the tick at its end. The box shows only the label of what is chosen.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.icons.PantrixIcons

var folder by rememberSaveable { mutableStateOf<String?>("documents") }
val report = LocalExampleEvents.current
PantrixSelect(
    options = FOLDERS,
    selected = folder,
    onSelect = { value ->
        folder = value
        report("Folder selected: ${FOLDERS.first { it.value == value }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Folder",
    tagKey = "folder"
)

private val FOLDERS = listOf(
    SelectOption(value = "documents", label = "Documents", icon = PantrixIcons.Folder, tagKey = "documents"),
    SelectOption(value = "favourites", label = "Favourites", icon = PantrixIcons.Star, tagKey = "favourites"),
    SelectOption(value = "inbox", label = "Inbox", icon = PantrixIcons.Inbox, tagKey = "inbox")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Workspace switcher

This is not a `PantrixSelect`. The options of `PantrixSelect` are a one-line label and an icon; when an avatar, a second line of text and an action row at the bottom are needed, the switcher is built with `PantrixPopover` and these are written as the popover's content: with `PantrixTextField`, `PantrixAvatar` and `PantrixDivider`.

The trigger is a row with an avatar, a name and a plan. The panel that opens has a search field, a heading, rows with an avatar and a second line of text, a tick at the end of the selected row and, at the bottom, a row that creates a new workspace. A press on a row selects it and closes the panel; the search starts empty each time the panel opens.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var currentId by rememberSaveable { mutableStateOf(WORKSPACES.first().id) }
val report = LocalExampleEvents.current
val query = rememberTextFieldState()
val current = WORKSPACES.first { it.id == currentId }
val typed = query.text.toString().trim()
val shown = WORKSPACES.filter { it.name.contains(typed, ignoreCase = true) }
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Workspace panel closed")
    },
    anchor = {
        SelectWorkspaceTrigger(
            workspace = current,
            onClick = {
                // The search is emptied as the panel opens, not as it closes: the list inside does not move while the panel fades.
                query.clearText()
                open = true
            }
        )
    },
    alignment = PopoverAlignment.Start,
    style = PopoverStyle(minWidth = 280.dp, maxWidth = 280.dp),
    tagKey = "workspace"
) {
    PantrixTextField(
        state = query,
        modifier = Modifier.fillMaxWidth(),
        placeholder = "Search workspaces…",
        contentDescription = "Search workspaces",
        tagKey = "workspace_search"
    )
    PantrixText(
        text = "Workspaces",
        style = PantrixTheme.typography.label,
        color = PantrixTheme.colors.textSecondary
    )
    if (shown.isEmpty()) {
        PantrixText(text = "No workspaces match", color = PantrixTheme.colors.textSecondary)
    }
    shown.forEach { workspace ->
        SelectWorkspaceRow(workspace = workspace, selected = workspace.id == currentId) {
            currentId = workspace.id
            open = false
            report("Workspace: ${workspace.name}")
        }
    }
    PantrixDivider()
    SelectWorkspaceCreateRow {
        open = false
        report("Create workspace was pressed")
    }
}

@Composable
private fun SelectWorkspaceTrigger(
    workspace: SelectWorkspace,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Row(
        modifier = Modifier
            .widthIn(max = 280.dp)
            .fillMaxWidth()
            .clip(PantrixTheme.shapes.md)
            .testTag("workspace_trigger")
            .clickable(role = Role.DropdownList, onClick = onClick)
            .padding(spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixAvatar(contentDescription = null, initials = workspace.initials, tone = AvatarTone.Primary)
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = workspace.name, style = PantrixTheme.typography.label, maxLines = 1)
            PantrixText(
                text = workspace.plan,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
        PantrixIcon(
            imageVector = PantrixIcons.ChevronDown,
            contentDescription = null,
            tint = PantrixTheme.colors.textSecondary
        )
    }
}

@Composable
private fun SelectWorkspaceRow(
    workspace: SelectWorkspace,
    selected: Boolean,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(PantrixTheme.shapes.md)
            .testTag("workspace_${workspace.id}")
            .selectable(selected = selected, role = Role.RadioButton, onClick = onClick)
            .padding(vertical = spacing.xs),
        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixAvatar(contentDescription = null, initials = workspace.initials, tone = AvatarTone.Primary)
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = workspace.name, style = PantrixTheme.typography.label, maxLines = 1)
            PantrixText(
                text = "${workspace.projects} projects",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
        if (selected) {
            PantrixIcon(
                imageVector = PantrixIcons.Check,
                contentDescription = null,
                tint = PantrixTheme.colors.primary.color
            )
        }
    }
}

@Composable
private fun SelectWorkspaceCreateRow(onClick: () -> Unit) {
    val spacing = PantrixTheme.spacing
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(PantrixTheme.shapes.md)
            .testTag("workspace_create")
            .clickable(role = Role.Button, onClick = onClick)
            .padding(vertical = spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Plus, contentDescription = null)
        PantrixText(text = "Create workspace", style = PantrixTheme.typography.label)
    }
}

private class SelectWorkspace(
    val id: String,
    val name: String,
    val initials: String,
    val plan: String,
    val projects: Int
)

private val WORKSPACES = listOf(
    SelectWorkspace(id = "rorty_live", name = "Rorty LIVE", initials = "RL", plan = "free", projects = 4),
    SelectWorkspace(id = "rorty_staging", name = "Rorty Staging", initials = "RS", plan = "free", projects = 2),
    SelectWorkspace(id = "pantrix_labs", name = "Pantrix Labs", initials = "PL", plan = "pro", projects = 7)
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Form field

The `PantrixSelect` that takes a `field` is bound to a form's field: the field's value is the choice, its error takes the place of the supporting text, and its id is the automation key (`Select_plan`). A choice that has to be made is built with a field that starts at null and `Rules.required`.

Press "Send" without picking anything: the rule's message takes the place of the supporting text and the focus comes to the select. A choice changes the field and marks it "touched": once a plan is chosen the message goes away. "Reset" takes the form back to the start.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val plan = form.field<String?>("plan", initial = null, Rules.required("Choose a plan to continue"))
val report = LocalExampleEvents.current
PantrixSelect(
    field = plan,
    options = PLANS,
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Plan",
    placeholder = "Choose a plan",
    supportingText = "You can change it later."
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Send",
        onClick = {
            scope.launch {
                form.submit { report("Form sent: ${PLANS.first { it.value == plan.value }.label}") }
            }
        },
        form = form,
        tagKey = "submit_plan"
    )
    PantrixButton(
        text = "Reset",
        onClick = {
            form.reset()
            report("Form reset")
        },
        variant = ButtonVariant.Text,
        tagKey = "reset_plan"
    )
}

private val PLANS = listOf(
    SelectOption(value = "free", label = "Free", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Team", tagKey = "team")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Error and disabled

`error = true` turns the box's border, its label and the text below it to the theme's `danger` role; the text below is announced to a screen reader as the error. `enabled = false` draws the box in the disabled colours: the box takes no focus and the list does not open.

Both are drawn as a text field is in those states. A disabled select still shows what is selected.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

PantrixSelect(
    options = PLANS,
    selected = null,
    onSelect = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Plan",
    placeholder = "Choose a plan",
    supportingText = "Choose a plan to continue",
    error = true,
    tagKey = "plan_in_error"
)
PantrixSelect(
    options = PLANS,
    selected = "team",
    onSelect = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    enabled = false,
    label = "Plan",
    supportingText = "Only an administrator can change the plan.",
    tagKey = "plan_disabled"
)

private val PLANS = listOf(
    SelectOption(value = "free", label = "Free", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Team", tagKey = "team")
)
```

### A long list

When the options pass the list's tallest height, the list scrolls. The list opens with the selected row in view near its middle: here the thirty-sixth of sixty years is selected, and the list opens already scrolled to it.

Opened by the keyboard, the list has the focus on the selected row. Opened by a touch or a click, no row shows the focus; the first arrow key moves on from the selected row.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var year by rememberSaveable { mutableStateOf<Int?>(1995) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = YEARS,
    selected = year,
    onSelect = {
        year = it
        report("Year selected: $it")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Year of birth",
    tagKey = "year"
)

private val YEARS = (1960..2019).map { year ->
    SelectOption(value = year, label = year.toString(), tagKey = year.toString())
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Width

A select given no width is as wide as a text field's least width: the first box is like this. In a row, with `Modifier.weight(1f)`, it is as wide as its share of the row: the two boxes in the middle share the row.

The box at the bottom is given `Modifier.width(IntrinsicSize.Max)`: the select is asked how wide it would be, and answers with what its options need. The box is as wide as its longest option and no wider, and stays so whichever is chosen. A select in a toolbar or in a table's foot is built this way: the select of `PantrixPageSize` is one too. Choose another currency: the box stands still.

The list is always as wide as its box. A label that does not fit the box is cut off on one line; in the box that is as wide as its options no option is cut, nor in its row of the list.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme

var alone by rememberSaveable { mutableStateOf<String?>("usd") }
var from by rememberSaveable { mutableStateOf<String?>("try") }
var to by rememberSaveable { mutableStateOf<String?>("eur") }
var fitted by rememberSaveable { mutableStateOf<String?>("gbp") }
val report = LocalExampleEvents.current
PantrixSelect(
    options = CURRENCIES,
    selected = alone,
    onSelect = { code ->
        alone = code
        report("Currency: ${CURRENCIES.first { it.value == code }.label}")
    },
    label = "Currency",
    tagKey = "currency"
)
Row(
    modifier = Modifier.widthIn(max = 480.dp).fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixSelect(
        options = CURRENCIES,
        selected = from,
        onSelect = { code ->
            from = code
            report("Source currency: ${CURRENCIES.first { it.value == code }.label}")
        },
        modifier = Modifier.weight(1f),
        label = "Source",
        tagKey = "currency_from"
    )
    PantrixSelect(
        options = CURRENCIES,
        selected = to,
        onSelect = { code ->
            to = code
            report("Target currency: ${CURRENCIES.first { it.value == code }.label}")
        },
        modifier = Modifier.weight(1f),
        label = "Target",
        tagKey = "currency_to"
    )
}
PantrixSelect(
    options = CURRENCIES,
    selected = fitted,
    onSelect = { code ->
        fitted = code
        report("In the box as wide as its options: ${CURRENCIES.first { it.value == code }.label}")
    },
    modifier = Modifier.width(IntrinsicSize.Max),
    contentDescription = "Currency",
    tagKey = "currency_fitted"
)

private val CURRENCIES = listOf(
    SelectOption(value = "try", label = "Turkish lira", tagKey = "try"),
    SelectOption(value = "eur", label = "Euro", tagKey = "eur"),
    SelectOption(value = "usd", label = "US dollar", tagKey = "usd"),
    SelectOption(value = "gbp", label = "Pound sterling", tagKey = "gbp")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Without a label

A select in a toolbar or at the head of a list has no label. `contentDescription` tells a screen reader its name; the list that opens is announced by that name too.

When no label is given, no room is kept above the box: the select takes only as much room as its box.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var sort by rememberSaveable { mutableStateOf<String?>("newest") }
PantrixSelect(
    options = listOf(
        SelectOption(value = "newest", label = "Newest", tagKey = "newest"),
        SelectOption(value = "cheapest", label = "Cheapest", tagKey = "cheapest"),
        SelectOption(value = "nearest", label = "Nearest", tagKey = "nearest")
    ),
    selected = sort,
    onSelect = { sort = it },
    contentDescription = "Sort order",
    tagKey = "sort"
)
```

### Its own colours

`colors` is the list's colours and `fieldColors` the box's; both change only the fields that are given, and what is not given stays the theme's. Here the selected row's fill and text (`SelectColors`) and the box's focused border (`TextFieldColors`) are in the app's own colour.

Open the list: the box's border is in the app's purple, and the selected row in that purple's soft fill. A disabled select is drawn in the theme's disabled colours, even when colours are given.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectColors
import com.pantrixui.components.overlay.select.SelectOption

val own = ownColors()
var plan by rememberSaveable { mutableStateOf<String?>("pro") }
val report = LocalExampleEvents.current
PantrixSelect(
    options = PLANS,
    selected = plan,
    onSelect = { value ->
        plan = value
        report("Plan selected: ${PLANS.first { it.value == value }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Plan",
    colors = SelectColors(selectedContainer = own.container, selectedContent = own.onContainer),
    fieldColors = TextFieldColors(focusedBorder = own.color),
    tagKey = "own_plan"
)

private val PLANS = listOf(
    SelectOption(value = "free", label = "Free", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Team", tagKey = "team")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.
- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Style

`style` is the list's geometry and `fieldStyle` the box's. Here the list's rows are 56dp tall (`itemHeight`), the list is 180dp at its tallest and the options that do not fit scroll inside it (`maxHeight`), and there is a 12dp gap between it and the box (`gap`). The box's corners are fully round: `TextFieldStyle(shape = ShapeRole.Full)`.

Only the fields that are given change; the rest comes from the theme's and the platform's style. The list is as wide as its box whatever the style says, and a row is never shorter than the platform's touch target.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.components.overlay.select.SelectStyle
import com.pantrixui.foundation.token.shape.ShapeRole

var currency by rememberSaveable { mutableStateOf<String?>("try") }
PantrixSelect(
    options = CURRENCIES,
    selected = currency,
    onSelect = { currency = it },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Currency",
    style = SelectStyle(maxHeight = 180.dp, gap = 12.dp, itemHeight = 56.dp),
    fieldStyle = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "styled_currency"
)

private val CURRENCIES = listOf(
    SelectOption(value = "try", label = "Turkish lira", tagKey = "try"),
    SelectOption(value = "eur", label = "Euro", tagKey = "eur"),
    SelectOption(value = "usd", label = "US dollar", tagKey = "usd"),
    SelectOption(value = "gbp", label = "Pound sterling", tagKey = "gbp")
)
```

### In a dialog

A select inside a dialog: the list opens over the dialog. Escape and the back key close the list first, and the dialog stays open; the dialog closes on the second press.

Press "Edit address", open the list and press Escape twice: first the list closes, then the dialog. The select here is searchable.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var dialog by rememberSaveable { mutableStateOf(false) }
var country by rememberSaveable { mutableStateOf<String?>("tr") }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Edit address",
    onClick = { dialog = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_address_dialog"
)
PantrixDialog(
    visible = dialog,
    onDismissRequest = {
        dialog = false
        report("Address dialog closed")
    },
    title = "Delivery address",
    message = "Choose the country the order will be sent to.",
    actions = {
        PantrixButton(
            text = "OK",
            onClick = {
                dialog = false
                report("Address dialog closed")
            },
            variant = ButtonVariant.Text,
            tagKey = "close_address_dialog"
        )
    },
    tagKey = "address_dialog"
) {
    PantrixSelect(
        options = COUNTRIES,
        selected = country,
        onSelect = { code ->
            country = code
            report("Delivery country: ${COUNTRIES.first { it.value == code }.label}")
        },
        modifier = Modifier.fillMaxWidth(),
        label = "Country",
        searchable = true,
        searchPlaceholder = "Search countries…",
        tagKey = "delivery_country"
    )
}

private val COUNTRIES = listOf(
    SelectOption(value = "tr", label = "Türkiye", tagKey = "tr"),
    SelectOption(value = "de", label = "Germany", tagKey = "de"),
    SelectOption(value = "gb", label = "United Kingdom", tagKey = "gb"),
    SelectOption(value = "jp", label = "Japan", tagKey = "jp"),
    SelectOption(value = "us", label = "United States of America", tagKey = "us")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A sheet in a narrow window

`presentation = OverlayPresentation.Adaptive`: in a narrow window the list is a sheet from the bottom, its title the field's label and its rows as wide as the sheet; in a wider one it is under the box. Pick "Narrow" and press the field. The default is under the box in every window; `PantrixMultiSelect` takes the same parameter.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var city by rememberSaveable { mutableStateOf<String?>(null) }
// The card's window is as tall as the example: the example is kept tall so that a sheet opened in a narrow window has room.
Column(Modifier.fillMaxWidth().height(400.dp)) {
    PantrixSelect(
        options = listOf("Istanbul", "Ankara", "Izmir", "Bursa", "Antalya").map {
            SelectOption(value = it, label = it)
        },
        selected = city,
        onSelect = { city = it },
        modifier = Modifier.fillMaxWidth(),
        label = "City",
        tagKey = "adaptive_city",
        presentation = OverlayPresentation.Adaptive
    )
}
```

### In a part in another theme

The list is in the colours of the theme it is called in. The part here is a second theme in the opposite colours to the page (`PantrixTheme(darkTheme = …)`): dark if the page is light, light if it is dark. The select is called inside that theme, so both its box and the list it opens are in that theme's colours.

A theme draws no ground: the part's ground is the `PantrixSurface` inside the theme. This is the last example on the page: when there is no room left below it, the list opens above the box.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme

var plan by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.widthIn(max = 392.dp).fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixSelect(
                options = PLANS,
                selected = plan,
                onSelect = { value ->
                    plan = value
                    report("Plan selected in the part: ${PLANS.first { it.value == value }.label}")
                },
                modifier = Modifier.fillMaxWidth(),
                label = "Plan",
                placeholder = "Choose a plan",
                tagKey = "plan_in_part"
            )
        }
    }
}

private val PLANS = listOf(
    SelectOption(value = "free", label = "Free", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Team", tagKey = "team")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

## API

### PantrixSelect

`import com.pantrixui.components.overlay.select.PantrixSelect`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixSelect(
    options: List<SelectOption<T>>,
    selected: T?,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    searchable: Boolean = false,
    searchPlaceholder: String? = null,
    style: SelectStyle? = null,
    fieldStyle: TextFieldStyle? = null,
    colors: SelectColors? = null,
    fieldColors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    presentation: OverlayPresentation = OverlayPresentation.Popover
)
```

One choice out of a list the control opens: a country, a currency, a plan.

It is a text field's box with a chevron at its end, with a field's label, placeholder, error and supporting text, and a list that opens under the box, as wide as the box. What is chosen is its caller's and not the control's: it is given `selected` and asks for another with `onSelect`. A press on the field opens the list, and so do Enter and the space bar while the field has the focus. Choosing an option closes it, and so do a press outside it, Escape and back, which choose nothing. While the list is open the box is drawn as a field with the focus.

By itself the field is as wide as a text field, and its box grows with a choice longer than that. Asked how wide it would be, it answers with what the longest of its options needs, in the box and in a row of the list, with its placeholder and its label: `Modifier.width(IntrinsicSize.Max)` makes a select that is no wider than its options and as wide whichever of them is chosen, as one in a toolbar or in a table's foot is.

The list hangs under the box, over the field's help where it has any, never closer than the style's margin to the edges of the window, its system bars or the keyboard. It opens there where the room holds three of its rows, or all of them where it has fewer, and is as tall as that room at the most, its rows scrolling. With less room than that it opens above the box, and with too little on both sides it lies over the box. Once open it stays on its side while one of its rows has room there: the keyboard, which comes as the list is used, makes it shorter where it is. More options than fit its tallest height scroll, and it opens with the chosen one in view. That option is marked by its row's fill and a tick, and not by a colour alone.

Opened by the keyboard the list takes the focus on the chosen option, or on its first. The arrows walk the options and go round from the last to the first, Home and End go to the first and the last, and Enter and the space bar choose. Opened by a touch or a click no option shows the focus, and the first arrow moves on from the chosen one. Once the list has closed the focus is on the field again.

With `searchable` the list has a field that narrows the options to those whose label holds what is typed, and the list is as short as the options that are left. The field is at the list's edge next to the box, its top, or its bottom where the list is above the box, so that it stays where it is while the list gets shorter. The focus stays in that field: the arrows move a mark among the options that match, and the keyboard's action chooses the marked one, which is the first match as soon as something is typed.

Use it for a list short enough to read, or one worth searching. Two or three choices that should all be in view are a radio group or a segment button, actions are a menu, and several values at once are a `PantrixMultiSelect`.

Parameters:

- `options: List<SelectOption<T>>`: the choices, in the order they are shown. With none, the list says so.
- `selected: T?`: what is chosen now: the first option whose value it equals. A value no option has is nothing chosen, and so is null, unless an option stands for it.
- `onSelect: (T) -> Unit`: asked for another choice, with the option's value. It is asked for the chosen one again too.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it. `fillMaxWidth()` fills a form's column, and `width(IntrinsicSize.Max)` is as wide as the options need.
- `enabled: Boolean`: whether the list can be opened. A select that cannot be takes no focus, is drawn in the disabled colours and says so.
- `label: String?`: what the choice is, written above the box: the field's name for a screen reader, and what its list is announced as.
- `placeholder: String?`: shown in the box while nothing is chosen.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the choice is wrong: the border, the label and the supporting text turn to the danger role, and a screen reader is told.
- `searchable: Boolean`: whether the list has a field to search its options by.
- `searchPlaceholder: String?`: what the search field shows while it is empty, and what it is called. The theme's word for a search where it is null.
- `style: SelectStyle?`: this call's own style, the one its list is drawn with: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `fieldStyle: TextFieldStyle?`: this call's own `TextFieldStyle`, the one its box is drawn with: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SelectColors?`: its list's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's.
- `fieldColors: TextFieldColors?`: its box's own colours, as a text field takes them. A disabled select is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`, as a select in a toolbar has none.
- `tagKey: String?`: the field's automation key: the field is `Select_<tagKey>`, its list `SelectList_<tagKey>`, the list's search field `SelectSearch_<tagKey>`, and its options are named inside it, `Select_<tagKey>.SelectOption_<option's key>`. It reports that its list opened and that an option was chosen, by the option's key and never by its label.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.
- `presentation: OverlayPresentation`: how the list is shown: under the field, by default; as a sheet from the bottom of the window, its title the field's label; or the one in a narrow window and the other in a wider one. Chosen as the list opens, it stays until the list has closed.

### PantrixSelect

`import com.pantrixui.components.overlay.select.PantrixSelect`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixSelect(
    field: FormField<T>,
    options: List<SelectOption<T>>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    searchable: Boolean = false,
    searchPlaceholder: String? = null,
    style: SelectStyle? = null,
    fieldStyle: TextFieldStyle? = null,
    colors: SelectColors? = null,
    fieldColors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null,
    presentation: OverlayPresentation = OverlayPresentation.Popover
)
```

A select bound to a form's field: its choice, its error and its name come from `field`.

A choice changes the field and marks it touched, so a rule's message shows after the first choice, or when the form is submitted, and not on a form nobody has touched. While the field is in error the message takes the place of `supportingText`, rather than standing beside it. The field's id is the select's automation key, `Select_<id>`, with its options inside it, and the form can send the focus here when it is submitted with this field in error.

A choice that has to be made is a field of a nullable value that starts at null, with `Rules.required`. Its options are options of the value itself: a `SelectOption<String>` is an option of a `FormField<String?>`.

It is an overload of its own and not a parameter of the controlled form, so that a choice and a field cannot both be given.

Parameters:

- `field: FormField<T>`: the field the select shows and changes.
- `options: List<SelectOption<T>>`: the choices, in the order they are shown.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the list can be opened.
- `label: String?`: what the choice is, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while nothing is chosen.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `searchable: Boolean`: whether the list has a field to search its options by.
- `searchPlaceholder: String?`: what the search field shows while it is empty, and what it is called.
- `style: SelectStyle?`: this call's own style, the one its list is drawn with: over every enclosing one and under the density.
- `fieldStyle: TextFieldStyle?`: this call's own `TextFieldStyle`, the one its box is drawn with.
- `colors: SelectColors?`: its list's own colours: the ones it sets, with the theme's for the rest.
- `fieldColors: TextFieldColors?`: its box's own colours, as a text field takes them.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.
- `presentation: OverlayPresentation`: how the list is shown: under the field, as a sheet, or by the window's width.

### SelectOption

`import com.pantrixui.components.overlay.select.SelectOption`, from `com.pantrixui:components`

```kotlin
class SelectOption<out T>(
    public val value: T,
    public val label: String,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

One option of a `PantrixSelect`, and of a `PantrixMultiSelect`: the value it stands for, its label, and a key for automation.

Parameters:

- `value: T`: What the select gives to its caller when the option is chosen, and compares with what is chosen by `==`.
- `label: String`: The visible text, the option's name for a screen reader, and what a search looks in.
- `icon: ImageVector?`: Drawn before the label, in the label's colour, or null for none. A screen reader passes over it.
- `enabled: Boolean`: Whether the option can be chosen. One that cannot is drawn in the disabled colour, takes no press, and is passed over by the keyboard. It stays in the list: what cannot be chosen is still there to be read.
- `tagKey: String?`: The option's automation key, the same in every language: the option is `SelectOption_<tagKey>`, or `SelectOption_<index>` without one, inside the tag of a select that has a key: `Select_country.SelectOption_tr`. In a multi select it is `MultiSelectOption_<tagKey>`, inside `MultiSelect_<the control's key>`.

### SelectStyle

`import com.pantrixui.components.overlay.select.SelectStyle`, from `com.pantrixui:components`

```kotlin
class SelectStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val itemHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified
) : PantrixStyle<SelectStyle>
```

The list a `PantrixSelect` opens: the panel it is drawn in, how far that sits from the box it belongs to and from the edges of the window, and its rows.

The box is no part of it: a select's box is a text field's box, and is drawn by `TextFieldStyle`. The list is as wide as the box, whatever this style says, and has the box's corners unless a product gives it its own.

The air follows density: the gap, the margin, the padding above the first row and below the last, a row's height and the padding and the gap inside it. The tallest height, the corners, the shadow and the icon do not. A row is never shorter than the platform's touch target, whatever the density. A list's colours are not part of its style: they are the theme's, and `SelectColors` where a call has its own.

Parameters:

- `shape: ShapeSpec`: The panel's corners: the medium step of the shape scale on every platform, as the box's are.
- `maxHeight: Dp`: The tallest the panel gets: more options than fit scroll.
- `elevation: Dp`: How high the panel floats over the app, which is how large its shadow is.
- `gap: Dp`: Between the box and its list.
- `margin: Dp`: Kept clear between the panel and the edges of the window, and of what covers the window there: a system bar, a cutout, the keyboard.
- `verticalPadding: Dp`: Above the first row and below the last.
- `itemHeight: Dp`: The least a row is tall, where the platform's touch target is not taller.
- `horizontalPadding: Dp`: From the panel's edge to what a row starts with, and from what it ends with to the other edge. Each preset has the text field's own, so that an option's label starts where the box's text does.
- `iconSize: Dp`: An option's icon, and the tick beside the chosen one.
- `iconGap: Dp`: Between a row's parts: its check box, its icon, its label and its tick.

### SelectColors

`import com.pantrixui.components.overlay.select.SelectColors`, from `com.pantrixui:components`

```kotlin
data class SelectColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What the list of a `PantrixSelect` is painted with, for a call that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's. The box's colours are `TextFieldColors`.

```kotlin
PantrixSelect(…, colors = SelectColors(selectedContainer = PantrixTheme.colors.success.container))
```

A `container` or a `selectedContainer` given here that is one of the theme's role colours brings the colour the theme pairs with it for what is written on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The panel's fill. The theme's `surface`.
- `content: Color`: An option's label and icon. The theme's `textPrimary`.
- `selectedContainer: Color`: The fill of the chosen option's row, in a select of one choice. The primary role's container. A select of several marks its choices with check boxes, and fills no row.
- `selectedContent: Color`: The chosen option's label, its icon and the tick beside it, in a select of one choice. The primary role's `onContainer`.
- `border: Color`: The hairline around the panel, which tells it from a surface of its own colour under it, as in the dark theme, where a shadow shows little, and the line between the rows and the field a list is searched by. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`: the edge a subtle button has. A transparent colour draws none.

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
