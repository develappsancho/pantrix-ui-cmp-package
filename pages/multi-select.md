# Multi Select

Several choices out of a list: the projects a page is narrowed to, the days a shop is open. It is a select's box and list; the difference is in its rows: every option is a check box, a press ticks it or clears it, and the list stays open for the next choice. A press outside it, back and Escape close the list.

What is chosen is the caller's and not the component's: it is given the set in `selected`, and `onSelectionChange` asks for the whole of the new set.

- `PantrixMultiSelect` (`com.pantrixui.components.overlay.multiselect`, `com.pantrixui:components`): Several choices out of a list the control opens under itself, each option a check box, in a text field's own box; the list can be searched, options can have icons and can be disabled one by one, and it binds to a form's field. Keywords: multiple choice, multi dropdown, checkbox dropdown, tags input, filter list, combobox.

## Features

- **The text in the box.** The box shows the labels of what is ticked, in the options' order and with a comma between them, and cuts what does not fit at one line. With nothing ticked, `placeholder` shows.
- **Summary.** Given `valueText`, the box shows it in place of the labels while something is ticked: a count, or one word for all of them.
- **Search.** `searchable` puts a search field in the list that narrows the options by their labels. The focus stays in that field: the arrows move among the rows that match, and the keyboard's action key ticks or clears the row the arrows are on.
- **Options.** The options are a select's `SelectOption`: a value, a label and, if wanted, an icon. An option with `enabled = false` stays in the list and is read, but cannot be ticked.
- **Keyboard.** It is a select's: Enter or the space bar opens the list, the arrows move among the rows and go round from the last to the first, and Home and End go to the first and the last row. Enter and the space bar tick or clear.
- **Form.** A `PantrixMultiSelect` that takes `field` gets its choices, its error and its name from the form's field: the field's value is the set of what is ticked.
- **Error and disabled.** `error` and `enabled` work as in a select: an error turns the box's border, its label and the text under it to the `danger` role; a disabled box takes no focus and its list does not open.
- **Colours and style.** It shares a select's style and colours: `SelectStyle` and `SelectColors`, and `TextFieldStyle` and `TextFieldColors` for its box. A product that restyles its selects restyles these with them. The check boxes stay in the theme's colour.
- **Automation.** `tagKey` tags the box `MultiSelect_<tagKey>`, its list `MultiSelectList_<tagKey>` and the search field `MultiSelectSearch_<tagKey>`. The options are named inside the box: `MultiSelect_projects.MultiSelectOption_compose`.

## Usage

### The projects a list is narrowed to, all of them while none is ticked

```kotlin
var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
PantrixMultiSelect(
    options = projects.map {
        SelectOption(value = it.id, label = it.name, icon = PantrixIcons.Folder, tagKey = it.id)
    },
    selected = chosen,
    onSelectionChange = { chosen = it },
    placeholder = stringResource(Res.string.all_projects, projects.size),
    contentDescription = stringResource(Res.string.projects),
    tagKey = "projects"
)
```

### A count in the box, and a list that is searched

```kotlin
PantrixMultiSelect(
    options = languages.map { SelectOption(value = it.id, label = it.name, tagKey = it.id) },
    selected = spoken,
    onSelectionChange = { spoken = it },
    label = stringResource(Res.string.languages),
    valueText = pluralStringResource(Res.plurals.languages_chosen, spoken.size, spoken.size),
    searchable = true,
    tagKey = "languages"
)
```

### Bound to a form's field, where one at the least has to be chosen

```kotlin
val form = rememberFormState()
val days = form.field(
    "days",
    initial = emptySet<DayOfWeek>(),
    Rules.satisfies(stringResource(Res.string.choose_a_day)) { it.isNotEmpty() }
)
PantrixMultiSelect(
    field = days,
    options = DayOfWeek.entries.map { SelectOption(value = it, label = names.getValue(it), tagKey = it.name) },
    label = stringResource(Res.string.open_days)
)
```

## Examples

### Projects

A filter that narrows a list by project. Every row is a check box: a press ticks it or clears it, and the list stays open. The box shows the labels of what is ticked, in the options' order, and the placeholder while nothing is ticked. Here all the projects are shown while none is ticked, and the box says so in its placeholder.

It has no label; `contentDescription` tells a screen reader its name. The card's "Last event" line says what `onSelectionChange` last asked for; most of the other examples have the same line.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.icons.PantrixIcons

var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = PROJECTS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report(if (it.isEmpty()) "Showing all projects" else "Projects selected: ${it.size}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    placeholder = "All projects (${PROJECTS.size})",
    contentDescription = "Projects",
    tagKey = "projects"
)

private val PROJECTS = listOf(
    SelectOption(value = "compose", label = "Rorty Compose Android", icon = PantrixIcons.Folder, tagKey = "compose"),
    SelectOption(value = "android", label = "Rorty Android", icon = PantrixIcons.Folder, tagKey = "android"),
    SelectOption(value = "swiftui", label = "Rorty SwiftUI iOS", icon = PantrixIcons.Folder, tagKey = "swiftui"),
    SelectOption(value = "uikit", label = "Rorty UIKIT iOS", icon = PantrixIcons.Folder, tagKey = "uikit")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Summary text

Given `valueText`, the box shows it in place of the labels while something is ticked: here "5 days". With many options ticked the box does not overflow.

With nothing ticked the placeholder still shows: clear every day and the box says "Closed".

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

var chosen by rememberSaveable { mutableStateOf(setOf("mon", "tue", "wed", "thu", "fri")) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = DAYS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("Days selected: ${it.size}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Open days",
    placeholder = "Closed",
    valueText = "${chosen.size} days",
    tagKey = "open_days"
)

private val DAYS = listOf(
    SelectOption(value = "mon", label = "Monday", tagKey = "mon"),
    SelectOption(value = "tue", label = "Tuesday", tagKey = "tue"),
    SelectOption(value = "wed", label = "Wednesday", tagKey = "wed"),
    SelectOption(value = "thu", label = "Thursday", tagKey = "thu"),
    SelectOption(value = "fri", label = "Friday", tagKey = "fri"),
    SelectOption(value = "sat", label = "Saturday", tagKey = "sat"),
    SelectOption(value = "sun", label = "Sunday", tagKey = "sun")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Searchable

`searchable = true` puts a search field in the list: the options narrow as you type. The focus stays in the search field: the arrows move among the rows that match, the keyboard's action key ticks or clears the row the arrows are on, and the search stays as it is.

Options the search does not show keep their ticks: tick a few languages, then search for something else. The labels in the box and the count in the card's "Last event" line do not change.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = SKILLS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("Languages selected: ${it.size}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Languages you know",
    placeholder = "Choose languages",
    searchable = true,
    searchPlaceholder = "Search languages…",
    tagKey = "skills"
)

private val SKILLS = listOf(
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

`SelectOption(enabled = false)` disables a single option: the option stays in the list and is read, but it takes no press and the arrow keys pass over it. Its check box is drawn in the disabled colours too.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

var chosen by rememberSaveable { mutableStateOf(setOf("mail")) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = CHANNELS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("Notification channels selected: ${it.size}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Notification channels",
    placeholder = "No notifications",
    supportingText = "SMS and calls are not in this plan.",
    tagKey = "channels"
)

private val CHANNELS = listOf(
    SelectOption(value = "mail", label = "Email", tagKey = "mail"),
    SelectOption(value = "sms", label = "SMS", enabled = false, tagKey = "sms"),
    SelectOption(value = "push", label = "Push notification", tagKey = "push"),
    SelectOption(value = "call", label = "Phone call", enabled = false, tagKey = "call")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Form field

A `PantrixMultiSelect` that takes `field` is bound to a form's field: the field's value is the set of what is ticked, its error takes the place of the supporting text, and its id is the automation key (`MultiSelect_roles`). `Rules.satisfies` asks for at least one to be ticked.

Press "Invite" with nothing ticked: the rule's message takes the place of the supporting text and the focus comes here. Then tick a role and clear it: the error shows as soon as the last tick is cleared, because by then the field has been touched.

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
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val roles = form.field(
    "roles",
    initial = emptySet<String>(),
    Rules.satisfies("Choose at least one role") { it.isNotEmpty() }
)
val report = LocalExampleEvents.current
PantrixMultiSelect(
    field = roles,
    options = ROLES,
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Roles",
    placeholder = "Choose roles",
    supportingText = "A person can have more than one role."
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Invite",
        onClick = { scope.launch { form.submit { report("Invitation sent. Roles: ${roles.value.size}") } } },
        form = form,
        tagKey = "submit_roles"
    )
    PantrixButton(
        text = "Reset",
        onClick = {
            form.reset()
            report("Form reset")
        },
        variant = ButtonVariant.Text,
        tagKey = "reset_roles"
    )
}

private val ROLES = listOf(
    SelectOption(value = "admin", label = "Admin", tagKey = "admin"),
    SelectOption(value = "editor", label = "Editor", tagKey = "editor"),
    SelectOption(value = "viewer", label = "Viewer", tagKey = "viewer")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Error and disabled

`error = true` and `enabled = false` work as in a select. The border, the label and the text under a box in error are in the theme's `danger` role, and a screen reader announces that text as the error. A disabled box is drawn in the disabled colours, takes no focus and does not open its list; it still shows what is ticked.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

PantrixMultiSelect(
    options = ROLES,
    selected = emptySet(),
    onSelectionChange = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Roles",
    placeholder = "Choose roles",
    supportingText = "Choose at least one role",
    error = true,
    tagKey = "roles_in_error"
)
PantrixMultiSelect(
    options = ROLES,
    selected = setOf("editor", "viewer"),
    onSelectionChange = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    enabled = false,
    label = "Roles",
    supportingText = "Only an admin can change the roles.",
    tagKey = "roles_disabled"
)

private val ROLES = listOf(
    SelectOption(value = "admin", label = "Admin", tagKey = "admin"),
    SelectOption(value = "editor", label = "Editor", tagKey = "editor"),
    SelectOption(value = "viewer", label = "Viewer", tagKey = "viewer")
)
```

### Its own colours

`colors = SelectColors(…)` changes the list's ground, its text and its border; `fieldColors = TextFieldColors(…)` changes the box's focused border. Here the list is in the soft fill of the app's own purple.

The check boxes stay in the theme's colour. The selected row's fill (`selectedContainer`) is not used here: a list of several choices shows a choice by its check box and fills no row.

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
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectColors
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.icons.PantrixIcons

val own = ownColors()
var chosen by rememberSaveable { mutableStateOf(setOf("compose")) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = PROJECTS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("Projects selected: ${it.size}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Projects",
    placeholder = "All projects (${PROJECTS.size})",
    colors = SelectColors(container = own.container, content = own.onContainer, border = own.color),
    fieldColors = TextFieldColors(focusedBorder = own.color),
    tagKey = "own_projects"
)

private val PROJECTS = listOf(
    SelectOption(value = "compose", label = "Rorty Compose Android", icon = PantrixIcons.Folder, tagKey = "compose"),
    SelectOption(value = "android", label = "Rorty Android", icon = PantrixIcons.Folder, tagKey = "android"),
    SelectOption(value = "swiftui", label = "Rorty SwiftUI iOS", icon = PantrixIcons.Folder, tagKey = "swiftui"),
    SelectOption(value = "uikit", label = "Rorty UIKIT iOS", icon = PantrixIcons.Folder, tagKey = "uikit")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.
- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Style

The style is a select's too: `style` is the geometry of the list (`SelectStyle`), `fieldStyle` that of the box (`TextFieldStyle`). Here the list's rows are 56dp tall (`itemHeight`), and the list is 240dp at the most, with the options that do not fit scrolling inside it (`maxHeight`). The box's corners are fully round: `TextFieldStyle(shape = ShapeRole.Full)`.

Only the fields that are given change; the rest comes from the theme's and the platform's style.

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
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.components.overlay.select.SelectStyle
import com.pantrixui.foundation.token.shape.ShapeRole

var chosen by rememberSaveable { mutableStateOf(setOf("sat", "sun")) }
PantrixMultiSelect(
    options = DAYS,
    selected = chosen,
    onSelectionChange = { chosen = it },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Delivery days",
    placeholder = "Choose days",
    style = SelectStyle(maxHeight = 240.dp, itemHeight = 56.dp),
    fieldStyle = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "styled_days"
)

private val DAYS = listOf(
    SelectOption(value = "mon", label = "Monday", tagKey = "mon"),
    SelectOption(value = "tue", label = "Tuesday", tagKey = "tue"),
    SelectOption(value = "wed", label = "Wednesday", tagKey = "wed"),
    SelectOption(value = "thu", label = "Thursday", tagKey = "thu"),
    SelectOption(value = "fri", label = "Friday", tagKey = "fri"),
    SelectOption(value = "sat", label = "Saturday", tagKey = "sat"),
    SelectOption(value = "sun", label = "Sunday", tagKey = "sun")
)
```

## API

### PantrixMultiSelect

`import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixMultiSelect(
    options: List<SelectOption<T>>,
    selected: Set<T>,
    onSelectionChange: (Set<T>) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    valueText: String? = null,
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

Several choices out of a list the control opens: the projects a page is narrowed to, the days a shop is open.

It is a `PantrixSelect` whose list takes several choices. The box is a text field's, with a chevron at its end and a field's label, placeholder, error and supporting text, and the list opens under it, as wide as the box. Every option is a check box: a press ticks it or clears it, and the list stays open for the next. A press outside the list, Escape and back close it. What is chosen is its caller's and not the control's: it is given `selected` and asks for another set with `onSelectionChange`.

The box shows the labels of what is chosen, in the options' order with a comma between them and cut at one line, or `valueText` where a caller would rather say it another way: a count, or one word for all of them. With nothing chosen it shows its placeholder. Asked how wide it would be, as `Modifier.width(IntrinsicSize.Max)` asks, it answers as a `PantrixSelect` does, with what the longest of its options needs, whatever is chosen.

The keyboard is a select's. Opened by the keyboard the list takes the focus on the first chosen option, or on its first; the arrows walk the options and go round, Home and End go to the first and the last, and Enter and the space bar tick or clear. With `searchable` the list has a field that narrows the options, at its edge nearest the box: at its top under the box, at its foot where the list opens above it. The focus stays in that field, and the keyboard's action ticks or clears the marked option.

It shares a select's style and colours, `SelectStyle` and `SelectColors`, and a text field's for its box: a product that restyles its selects restyles these with them.

Parameters:

- `options: List<SelectOption<T>>`: the choices, in the order they are shown. With none, the list says so.
- `selected: Set<T>`: the values that are chosen now: every option whose value is among them is ticked.
- `onSelectionChange: (Set<T>) -> Unit`: asked for another set, with the whole of it: the one before with the pressed option's value put in or taken out.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the list can be opened. One that cannot be takes no focus, is drawn in the disabled colours and says so.
- `label: String?`: what the choice is, written above the box: the field's name for a screen reader, and what its list is announced as.
- `placeholder: String?`: shown in the box while nothing is chosen.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the choice is wrong: the border, the label and the supporting text turn to the danger role, and a screen reader is told.
- `valueText: String?`: what the box shows while something is chosen, in place of the chosen labels.
- `searchable: Boolean`: whether the list has a field to search its options by.
- `searchPlaceholder: String?`: what the search field shows while it is empty, and what it is called. The theme's word for a search where it is null.
- `style: SelectStyle?`: this call's own `SelectStyle`, the one its list is drawn with: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `fieldStyle: TextFieldStyle?`: this call's own `TextFieldStyle`, the one its box is drawn with: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SelectColors?`: its list's own colours, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. The check boxes are the theme's.
- `fieldColors: TextFieldColors?`: its box's own colours, as a text field takes them. A disabled one is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `MultiSelect_<tagKey>`, its list `MultiSelectList_<tagKey>`, the list's search field `MultiSelectSearch_<tagKey>`, and its options are named inside it, `MultiSelect_<tagKey>.MultiSelectOption_<option's key>`. It reports that its list opened and that an option was ticked or cleared, by the option's key and never by its label.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.
- `presentation: OverlayPresentation`: how the list is shown: under the field, by default; as a sheet from the bottom of the window, its title the field's label; or the one in a narrow window and the other in a wider one. Chosen as the list opens, it stays until the list has closed.

### PantrixMultiSelect

`import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixMultiSelect(
    field: FormField<Set<T>>,
    options: List<SelectOption<T>>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    valueText: String? = null,
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

A multi select bound to a form's field: its choices, its error and its name come from `field`.

A tick or a clearing changes the field and marks it touched, so a rule's message shows after the first of them, or when the form is submitted, and not on a form nobody has touched. While the field is in error the message takes the place of `supportingText`, rather than standing beside it. The field's id is the automation key, `MultiSelect_<id>`, with its options inside it, and the form can send the focus here when it is submitted with this field in error.

It is an overload of its own and not a parameter of the controlled form, so that a set and a field cannot both be given.

Parameters:

- `field: FormField<Set<T>>`: the field the control shows and changes: a set of the options' values.
- `options: List<SelectOption<T>>`: the choices, in the order they are shown.
- `modifier: Modifier`: the modifier of the whole field: its label, its box and what is under it.
- `enabled: Boolean`: whether the list can be opened.
- `label: String?`: what the choice is, written above the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while nothing is chosen.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `valueText: String?`: what the box shows while something is chosen, in place of the chosen labels.
- `searchable: Boolean`: whether the list has a field to search its options by.
- `searchPlaceholder: String?`: what the search field shows while it is empty, and what it is called.
- `style: SelectStyle?`: this call's own `SelectStyle`, the one its list is drawn with.
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
