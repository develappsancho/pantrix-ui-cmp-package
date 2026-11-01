# List and detail

A list and the detail of the item opened in it: side by side where there is room, one in the other's place where there is not. An inbox, settings, contacts, files: the layout of every screen with a list and its detail.

`PantrixListDetailScaffold` chooses how many panes to show by its own room, not by the window. In a narrow room the list shows first; an item opened, its detail takes the list's place, sliding in from the end. Back, Escape and the edge swipe of iOS bring the list back. In a wide room the two stand side by side; in a very wide one a third pane can open beside the detail.

What is open is kept by `ListDetailState`: remembered with `rememberListDetailState()`, it survives a rotation and the process being restarted. The list opens an item with `select(key)`, and the detail closes with `back()`.

- `PantrixListDetailScaffold` (`com.pantrixui.components.container.listdetail`, `com.pantrixui:components`): A list and the detail of its open item: side by side where there is room, one at a time where not. Keywords: master detail, split view, list and detail, two pane, inbox layout.

## Features

- **How many panes.** One in a `Compact` or `Medium` room, two from `Expanded` on, three from `Large` on where an extra pane is given. Two at any width on a foldable held like a book: the list and the detail meet at the fold.
- **Back in one pane.** While the detail is open, back, Escape and the edge swipe of iOS call `back()`. Swiped from the edge, the detail moves with the finger; let go halfway, it goes back to its place. A keyboard's focus goes with the pane shown: into the detail of the item opened from the list, and back to that item.
- **In two panes back is the app's.** With the list beside it the scaffold leaves back alone; the screen's own back runs.
- **Empty detail.** In two panes, while no item is open, `emptyDetail` stands in the detail's place.
- **What the panes are told.** Each pane is composed in a `ListDetailScope`: `isSinglePane` chooses whether to show a back button in one pane, `isExtraInSheet` whether to show the extra pane's title; `paneCount` says how many panes there is room for.
- **Extra pane.** Where `extra` is given, `showExtra()` opens it: beside the detail where there is room for three panes, elsewhere in a sheet that slides in from the end over the detail in the scaffold's own room, titled `extraTitle`. A keyboard's focus moves into the sheet and stays in it until it closes. It is one composition in both places: what it remembers stays as the room changes.
- **Each pane a window.** Everything in a pane reads the pane's width as its window: `PantrixTheme.window`, its classes and `PantrixTheme.layout` answer for the pane. The posture stays the window's.
- **The panes' names.** `listTitle`, `detailTitle` and `extraTitle` introduce the panes to a screen reader by name; on Android TalkBack says the name of the pane that comes into view.
- **The list's width.** `resizable = true` puts a handle between the panes: it is dragged, set with the arrow keys, and a screen reader can change its value. The width stays in `ListDetailState.listWidth`.
- **State is kept.** As the room changes from one pane to two the list and the detail stay where they are in the composition: a scroll, a text typed, are not lost.
- **Reduce motion.** Where the system asks for less motion the detail opens and closes without sliding.
- **Reading direction.** In a right-to-left language the list is on the right, and the detail slides in from the left.

## Usage

### An inbox

```kotlin
val inbox = rememberListDetailState()
PantrixListDetailScaffold(
    state = inbox,
    list = { Messages(onOpen = { id -> inbox.select(id) }) },
    detail = { id ->
        Message(id, onBack = if (isSinglePane) ({ inbox.back() }) else null)
    },
    modifier = Modifier.fillMaxSize(),
    emptyDetail = { PantrixText("Choose a message") }
)
```

### Contacts with their history beside them, and a list that can be resized

```kotlin
val contacts = rememberListDetailState()
PantrixListDetailScaffold(
    state = contacts,
    list = { ContactList(onOpen = { id -> contacts.select(id) }) },
    detail = { id -> Contact(id, onHistory = { contacts.showExtra() }) },
    modifier = Modifier.fillMaxSize(),
    extra = { id -> History(id, showHeader = !isExtraInSheet) },
    extraTitle = "History",
    resizable = true
)
```

## Examples

### Inbox

The most common shape: a list of messages and the message opened. The list opens a message with `inbox.select(id)`; the detail is given the key of the message opened.

Pick "Narrow" in the card's window selector and press a message: the message takes the list's place. The back button at its top, Android's back button, Escape on a desktop and a swipe from the edge of the screen on iOS bring the list back. The back button stands only in one pane: the detail shows it by `isSinglePane`. `listTitle` and `detailTitle` introduce the panes to a screen reader: TalkBack says the message's subject as it opens, and "Inbox" as the list comes back.

Pick "Short", "Wide" or "Book": the list and the message stand side by side, and while no message is open `emptyDetail` shows on the right. Open a message and switch between "Narrow" and "Wide": the message opened and the list's scroll are both kept.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val inbox = rememberListDetailState()
PantrixListDetailScaffold(
    state = inbox,
    list = {
        MailList(opened = inbox.selectedKey, onOpen = { id -> inbox.select(id) })
    },
    detail = { id ->
        MailDetail(
            mail = MAIL.first { it.id == id },
            // In one pane the message stands in the list's place: the back button stands only then.
            onBack = if (isSinglePane) ({ inbox.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    emptyDetail = { Placeholder(text = "Pick a message to read", icon = PantrixIcons.Inbox, tagKey = "inbox") },
    listTitle = "Inbox",
    detailTitle = { id -> MAIL.first { it.id == id }.subject },
    tagKey = "inbox"
)

@Composable
private fun MailList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            MAIL.forEachIndexed { index, mail ->
                if (index > 0) PantrixHorizontalDivider()
                ListRow(
                    title = mail.from,
                    subtitle = mail.subject,
                    selected = mail.id == opened,
                    onClick = { onOpen(mail.id) },
                    tagKey = "mail_${mail.id}"
                )
            }
        }
    }
}

@Composable
private fun MailDetail(
    mail: DemoMail,
    onBack: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = mail.subject,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "mail_back") } },
                tagKey = "mail"
            )
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(PantrixTheme.spacing.lg),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
            ) {
                PantrixText(
                    text = mail.from,
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary
                )
                PantrixText(text = mail.body, tagKey = "mail_body")
            }
        }
    }
}

@Composable
private fun Placeholder(
    text: String,
    icon: ImageVector,
    tagKey: String
) {
    PaneSurface {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixIcon(icon, contentDescription = null, size = 40.dp, tint = PantrixTheme.colors.textSecondary)
            PantrixText(text = text, color = PantrixTheme.colors.textSecondary, tagKey = "${tagKey}_placeholder")
        }
    }
}

private val MAIL = listOf(
    DemoMail("1", "Elif Kaya", "Tomorrow's meeting", "I moved the meeting to 10. Could you share the slides a day before?"),
    DemoMail("2", "Can Demir", "Release notes", "I added the notes for release 1.4. Write if you see anything missing."),
    DemoMail("3", "Ayşe Yılmaz", "Design review", "The drafts of the new settings screen are ready; shall we look on Thursday?"),
    DemoMail("4", "Mert Şahin", "Invoice", "The October invoice is attached. It can be paid until the 30th."),
    DemoMail("5", "Zeynep Arslan", "Test results", "The nightly tests all passed; there is one warning on the tablet."),
    DemoMail("6", "Deniz Aydın", "Lunch", "Shall the team eat out on Friday? Whoever has a place in mind, write."),
    DemoMail("7", "Burak Çelik", "Accessibility", "I went through the whole flow with a screen reader; two buttons have no name."),
    DemoMail("8", "Selin Koç", "New joiner", "Someone joins the team on Monday; let's plan the first week.")
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class DemoMail(
    val id: String,
    val from: String,
    val subject: String,
    val body: String
)
```

### Settings: the first section open in two panes

A settings screen: the sections on the left, the settings of the one chosen on the right. In two panes the first section stands open instead of an empty detail; in one pane the list of sections shows first.

For that `emptyDetail` draws nothing and opens the first section: `LaunchedEffect(Unit) { settings.select(...) }`. The empty detail is shown only in two panes, so in one pane this never runs.

The settings' values are kept by the example, not by the detail: `values`. Each section is composed anew as it opens; values remembered inside the detail would be lost on going to another section and back. In "Narrow" change a switch, go back, open the section again: the value is where it was.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val settings = rememberListDetailState()
val values = remember { mutableStateMapOf<String, Boolean>() }
PantrixListDetailScaffold(
    state = settings,
    list = {
        SectionList(chosen = settings.selectedKey, onChoose = { key -> settings.select(key) })
    },
    detail = { key ->
        val section = SECTIONS.first { it.key == key }
        SettingsPage(
            section = section,
            isOn = { option -> values[option] ?: false },
            onChange = { option, on -> values[option] = on },
            onBack = if (isSinglePane) ({ settings.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    // In two panes the first section opens instead of an empty detail. In one pane the empty detail is never shown: the list stays.
    emptyDetail = { LaunchedEffect(Unit) { settings.select(SECTIONS.first().key) } },
    tagKey = "settings"
)

@Composable
private fun SectionList(
    chosen: String?,
    onChoose: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            SECTIONS.forEach { section ->
                ListRow(
                    title = section.title,
                    subtitle = "${section.options.size} settings",
                    selected = section.key == chosen,
                    onClick = { onChoose(section.key) },
                    tagKey = "section_${section.key}"
                )
            }
        }
    }
}

@Composable
private fun SettingsPage(
    section: SettingsSection,
    isOn: (String) -> Boolean,
    onChange: (String, Boolean) -> Unit,
    onBack: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = section.title,
                navigationIcon = onBack?.let { back ->
                    { PantrixBackButton(onClick = back, tagKey = "settings_back") }
                },
                tagKey = "settings"
            )
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(PantrixTheme.spacing.lg),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
            ) {
                section.options.forEach { option ->
                    PantrixSwitchButton(
                        checked = isOn(option),
                        onCheckedChange = { onChange(option, it) },
                        modifier = Modifier.fillMaxWidth(),
                        label = option,
                        tagKey = "option_${section.key}_${section.options.indexOf(option)}"
                    )
                }
            }
        }
    }
}

private val SECTIONS = listOf(
    SettingsSection("general", "General", listOf("Show the last page on start", "Install updates by itself")),
    SettingsSection("notifications", "Notifications", listOf("New messages", "Calendar reminders", "Sound alert")),
    SettingsSection("privacy", "Privacy", listOf("Send usage data", "Share location")),
    SettingsSection("display", "Appearance", listOf("Dark theme", "Less motion", "Large text"))
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class SettingsSection(
    val key: String,
    val title: String,
    val options: List<String>
)
```

### Contacts, with their history beside them

A third pane beside a contact: their history. The "History" button in the detail opens it with `contacts.showExtra()`.

Pick "Wide": there is room for three panes, and the history stands beside the detail, at the end, with its title and close button inside it. Pick "Short": there is room for two, and the history shows in a sheet that slides in from the end over the detail, inside the scaffold. The sheet's title is `extraTitle` and the close button is the sheet's, so the pane leaves its own title out by `isExtraInSheet`. A press on the scrim, the back button and Escape close the sheet. In "Narrow" it opens in the sheet too.

With the sheet open, scroll the history, then switch to "Wide": the history moves beside the detail and its scroll stays. The pane is one composition in both places.

Going from one contact to another makes the history the other's; going back to the list, `back()`, closes the history too.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val contacts = rememberListDetailState()
PantrixListDetailScaffold(
    state = contacts,
    list = {
        ContactList(opened = contacts.selectedKey, onOpen = { id -> contacts.select(id) })
    },
    detail = { id ->
        ContactCard(
            contact = CONTACTS.first { it.id == id },
            onHistory = { contacts.showExtra() },
            onBack = if (isSinglePane) ({ contacts.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    emptyDetail = { Placeholder(text = "Pick a contact", icon = PantrixIcons.Person, tagKey = "contacts") },
    extra = { id ->
        History(
            contact = CONTACTS.first { it.id == id },
            // In a sheet the title and the close button are the sheet's.
            onClose = if (isExtraInSheet) null else ({ contacts.hideExtra() })
        )
    },
    listTitle = "Contacts",
    detailTitle = { id -> CONTACTS.first { it.id == id }.name },
    extraTitle = "History",
    tagKey = "contacts"
)

@Composable
private fun ContactList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            CONTACTS.forEach { contact ->
                ListRow(
                    title = contact.name,
                    subtitle = contact.role,
                    selected = contact.id == opened,
                    onClick = { onOpen(contact.id) },
                    initials = contact.initials,
                    tagKey = "contact_${contact.id}"
                )
            }
        }
    }
}

@Composable
private fun ContactCard(
    contact: DemoContact,
    onHistory: () -> Unit,
    onBack: (() -> Unit)?
) {
    val spacing = PantrixTheme.spacing
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = contact.name,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "contact_back") } },
                tagKey = "contact"
            )
            Column(
                modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
                verticalArrangement = Arrangement.spacedBy(spacing.md)
            ) {
                PantrixAvatar(contentDescription = null, initials = contact.initials, size = 64.dp)
                PantrixText(text = contact.role, color = PantrixTheme.colors.textSecondary)
                PantrixText(text = contact.email)
                PantrixButton(
                    text = "History",
                    onClick = onHistory,
                    variant = ButtonVariant.Outline,
                    leadingIcon = { PantrixIcon(PantrixIcons.Clock, contentDescription = null) },
                    tagKey = "history"
                )
            }
        }
    }
}

@Composable
private fun History(
    contact: DemoContact,
    onClose: (() -> Unit)?
) {
    val lines = @Composable {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
        ) {
            contact.history.forEach { line -> PantrixText(text = line, tagKey = "history_line") }
        }
    }
    if (onClose == null) {
        lines()
    } else {
        PaneSurface {
            Column(modifier = Modifier.fillMaxSize()) {
                PantrixTopBar(
                    title = "History",
                    actions = {
                        PantrixIconButton(
                            imageVector = PantrixIcons.Close,
                            contentDescription = "Close the history",
                            onClick = onClose,
                            tagKey = "history_close"
                        )
                    },
                    tagKey = "history"
                )
                lines()
            }
        }
    }
}

@Composable
private fun Placeholder(
    text: String,
    icon: ImageVector,
    tagKey: String
) {
    PaneSurface {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixIcon(icon, contentDescription = null, size = 40.dp, tint = PantrixTheme.colors.textSecondary)
            PantrixText(text = text, color = PantrixTheme.colors.textSecondary, tagKey = "${tagKey}_placeholder")
        }
    }
}

private val CONTACTS = listOf(
    DemoContact(
        "elif",
        "Elif Kaya",
        "EK",
        "Product manager",
        "elif@example.com",
        listOf("Yesterday: road map meeting", "Monday: release plan sent", "Last week: user interview")
    ),
    DemoContact(
        "can",
        "Can Demir",
        "CD",
        "Developer",
        "can@example.com",
        listOf("Today: code review", "Yesterday: bug report closed")
    ),
    DemoContact(
        "ayse",
        "Ayşe Yılmaz",
        "AY",
        "Designer",
        "ayse@example.com",
        listOf("Today: draft of the settings screen", "Tuesday: colour palette approved", "Last month: design system")
    ),
    DemoContact(
        "mert",
        "Mert Şahin",
        "MŞ",
        "Accounting",
        "mert@example.com",
        listOf("This month: the October invoice", "Last month: budget report")
    )
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class DemoContact(
    val id: String,
    val name: String,
    val initials: String,
    val role: String,
    val email: String,
    val history: List<String>
)
```

### Files: the list's width is dragged

The list's width is the reader's: `resizable = true` puts a handle between the panes. Drag it with a mouse or a finger; on a keyboard come to the handle with Tab, and the arrow keys move it in steps of 16 dp, Home and End to its narrowest and widest. A screen reader reads the handle as "List width" and can change its value.

The width is kept in `files.listWidth`; the line in the detail writes it, and "Back to the default" returns it to the style's with `Dp.Unspecified`. The style here asks for a list of 280 dp, and 200 dp at the least: `ListDetailScaffoldStyle(listWidth = 280.dp, minListWidth = 200.dp)`. The list can grow as wide as leaves the detail 320 dp.

The handle stands only in two panes: pick "Short" or "Wide".

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.container.listdetail.ListDetailScaffoldStyle
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val files = rememberListDetailState(initialSelectedKey = FOLDERS.first().name)
PantrixListDetailScaffold(
    state = files,
    list = {
        FolderList(opened = files.selectedKey, onOpen = { name -> files.select(name) })
    },
    detail = { name ->
        FolderContents(
            folder = FOLDERS.first { it.name == name },
            listWidth = files.listWidth,
            onResetWidth = { files.listWidth = Dp.Unspecified },
            onBack = if (isSinglePane) ({ files.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    resizable = true,
    style = ListDetailScaffoldStyle(listWidth = 280.dp, minListWidth = 200.dp),
    tagKey = "files"
)

@Composable
private fun FolderList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            FOLDERS.forEach { folder ->
                ListRow(
                    title = folder.name,
                    subtitle = "${folder.files.size} files",
                    selected = folder.name == opened,
                    onClick = { onOpen(folder.name) },
                    icon = PantrixIcons.Folder,
                    tagKey = "folder_${FOLDERS.indexOf(folder)}"
                )
            }
        }
    }
}

@Composable
private fun FolderContents(
    folder: DemoFolder,
    listWidth: Dp,
    onResetWidth: () -> Unit,
    onBack: (() -> Unit)?
) {
    val spacing = PantrixTheme.spacing
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = folder.name,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "folder_back") } },
                tagKey = "folder"
            )
            Column(
                modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
                verticalArrangement = Arrangement.spacedBy(spacing.sm)
            ) {
                PantrixText(
                    text = if (listWidth.isSpecified) {
                        "List width: ${listWidth.value.roundToInt()} dp"
                    } else {
                        "List width: the style's"
                    },
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary,
                    tagKey = "list_width"
                )
                PantrixButton(
                    text = "Back to the default",
                    onClick = onResetWidth,
                    variant = ButtonVariant.Text,
                    enabled = listWidth.isSpecified,
                    tagKey = "reset_width"
                )
                folder.files.forEach { file ->
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        PantrixIcon(PantrixIcons.File, contentDescription = null)
                        PantrixText(text = file)
                    }
                }
            }
        }
    }
}

private val FOLDERS = listOf(
    DemoFolder("Documents", listOf("Contract.pdf", "Meeting notes.txt", "Budget 2026.xlsx")),
    DemoFolder("Photos", listOf("Holiday 01.jpg", "Holiday 02.jpg", "Team photo.png", "Logo.svg")),
    DemoFolder("Music", listOf("Playlist.m3u", "Podcast episode.mp3")),
    DemoFolder("Downloads", listOf("Installer.dmg", "Report draft.docx"))
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class DemoFolder(
    val name: String,
    val files: List<String>
)
```

### On a foldable: they meet at the fold

On a foldable the list and the detail meet at the fold. Each pane writes its own size and its own window class; the line above it shows what it is told. A pane is a window of its own: in "Book" the window is `Expanded`, but each of the two 456 dp panes reads `Compact`.

Pick "Book": the 951 dp window is wide enough for two panes anyway, but the list is not 360 dp: it reaches the fold. The gap is the 20 dp strip on each side of the fold; nothing falls on the fold. A narrower foldable held like a book takes two panes too. There is no handle: the fold places the panes.

Pick "Table": the fold lies across and does not divide panes side by side. The 669 dp window is `Medium`: one pane.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.ListDetailScope
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val notes = rememberListDetailState(initialSelectedKey = NOTES.first())
PantrixListDetailScaffold(
    state = notes,
    list = {
        Column(modifier = Modifier.fillMaxSize()) {
            Told(scope = this@PantrixListDetailScaffold, tagKey = "notes_told_list")
            MeasuredList(opened = notes.selectedKey, onOpen = { note -> notes.select(note) })
        }
    },
    detail = { note ->
        Column(modifier = Modifier.fillMaxSize()) {
            Told(scope = this@PantrixListDetailScaffold, tagKey = "notes_told_detail")
            MeasuredNote(note = note, onBack = if (isSinglePane) ({ notes.back() }) else null)
        }
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    resizable = true,
    tagKey = "notes"
)

@Composable
private fun Told(
    scope: ListDetailScope,
    tagKey: String
) {
    PantrixText(
        text = "paneCount: ${scope.paneCount} · isSinglePane: ${if (scope.isSinglePane) "yes" else "no"}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

@Composable
private fun MeasuredList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    Measured(name = "List", tagKey = "notes_list_size") {
        Column {
            NOTES.forEach { note ->
                ListRow(
                    title = note,
                    subtitle = null,
                    selected = note == opened,
                    onClick = { onOpen(note) },
                    tagKey = "note_${NOTES.indexOf(note)}"
                )
            }
        }
    }
}

@Composable
private fun MeasuredNote(
    note: String,
    onBack: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = note,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "note_back") } },
                tagKey = "note"
            )
            Measured(name = "Detail", tagKey = "notes_detail_size") {}
        }
    }
}

private val NOTES = listOf("Shopping list", "Book suggestions", "Holiday plan", "Meeting notes")

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun Measured(
    name: String,
    tagKey: String,
    content: @Composable () -> Unit
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PaneSurface(modifier = Modifier.onSizeChanged { size = it }) {
        Column(modifier = Modifier.fillMaxSize()) {
            Column(modifier = Modifier.weight(1f)) { content() }
            // The sizes are written from left to right: in a right-to-left paragraph the width and the height would read swapped.
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                PantrixText(
                    // A pane is a window of its own: its class follows the pane's width, not the window's.
                    text = "$name: $words dp · ${PantrixTheme.window.widthClass.name}",
                    modifier = Modifier.padding(PantrixTheme.spacing.md),
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary,
                    tagKey = tagKey
                )
            }
        }
    }
}

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}
```

## API

### PantrixListDetailScaffold

`import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixListDetailScaffold(
    state: ListDetailState,
    list: @Composable ListDetailScope.() -> Unit,
    detail: @Composable ListDetailScope.(key: String) -> Unit,
    modifier: Modifier = Modifier,
    emptyDetail: (@Composable ListDetailScope.() -> Unit)? = null,
    extra: (@Composable ListDetailScope.(key: String) -> Unit)? = null,
    listTitle: String? = null,
    detailTitle: ((key: String) -> String)? = null,
    extraTitle: String? = null,
    resizable: Boolean = false,
    style: ListDetailScaffoldStyle? = null,
    tagKey: String? = null
)
```

A list and the detail of the item opened in it: side by side where the room has space for both, the detail in the list's place where it has not, and an extra pane beside the detail, or over it in a side sheet of the scaffold's.

- **How many panes.** The scaffold counts its own room, not the window's: one pane in a Compact or Medium room, two from Expanded on, three from Large on where an `extra` pane is given. A fold that divides the room upright, a foldable held like a book, makes two panes at any width, and the list and the detail meet at the fold.

- **One pane.** No item open shows the list; `ListDetailState.select` opens the detail in its place, sliding in from the end. Back, Escape and the edge swipe of iOS call `ListDetailState.back`: the detail slides away, following a back gesture's progress as the finger moves, and the list comes back. Of several scaffolds on one screen, back closes the detail opened last. A keyboard's focus goes with the pane shown: into the detail an item opened from the list, and back to that item. While the detail slides it is drawn on the theme's background, so that it covers the list under it.

- **Two panes.** The list is the style's `listWidth` wide at the start, the detail takes the rest past the gap, and back is the app's: the scaffold leaves it alone. With no item open the detail pane shows `emptyDetail`.

- **Resizable.** With `resizable` a handle stands in the gap: a drag, the arrow keys and a screen reader's adjusting make the list wider and narrower, between the style's `minListWidth` and where the detail would be narrower than `minDetailWidth`. A pointer over it is one that resizes (`PantrixPointerIcons.ResizeHorizontal`). The width is kept in `ListDetailState.listWidth`. A fold places the panes itself, and there is no handle then.

- **Extra pane.** `ListDetailState.showExtra` shows `extra` beside the detail where there is room for three panes. Elsewhere it slides in from the end over the detail, in a side sheet drawn in the scaffold's own room: under `extraTitle` and a close button, over a scrim that a press closes, as back and Escape do. A keyboard's focus moves into it and stays there until it closes. In both places it is given a bounded height and scrolls what it holds itself, and it is one composition: what it remembers is kept as the room changes from one to the other.

- **Each pane a window.** What a pane holds is told the pane as its window: `PantrixTheme.window`, its classes and `PantrixTheme.layout` answer for the pane's room, so that a list in a narrow pane lays itself out as on a phone. The posture stays the window's, and a fold is found where it crosses a pane.

- **Screen reader.** Each pane is read as one group. `listTitle`, `detailTitle` and `extraTitle` name the panes as they come into view, which TalkBack says on Android; Compose does not tell VoiceOver a pane's name.

- **Kept state.** The list and the detail stay where they are in the composition as the room changes between one pane and two: a list's scroll and a detail's text are kept. A pane that is not shown is not placed, so a keyboard and a screen reader skip it.

- **Reduced motion.** The detail appears and leaves at once.

- **Reading direction.** The list is at the start, on the right where the language is read from right to left, and the detail slides in from the left there.

- **Automation.** The scaffold is tagged `ListDetailScaffold_<tagKey>`, its panes `ListDetailList_<tagKey>`, `ListDetailDetail_<tagKey>` and `ListDetailExtra_<tagKey>`, the handle `ListDetailHandle_<tagKey>`, and the side sheet's scrim and close button `ListDetailScrim_<tagKey>` and `ListDetailClose_<tagKey>`.

The scaffold takes the room it is given, which is to be bounded both ways: `Modifier.fillMaxSize()` on a screen.

Parameters:

- `state: ListDetailState`: what is open: `rememberListDetailState` keeps it across a change of configuration.
- `list: @Composable ListDetailScope.() -> Unit`: the list. It opens an item with `ListDetailState.select`.
- `detail: @Composable ListDetailScope.(key: String) -> Unit`: the detail of the item whose key it is given. A new key composes it anew.
- `modifier: Modifier`: the room the panes have.
- `emptyDetail: (@Composable ListDetailScope.() -> Unit)?`: shown in the detail pane beside the list while no item is open: "Choose a message". Nothing is shown there without it.
- `extra: (@Composable ListDetailScope.(key: String) -> Unit)?`: a third pane for the open item, beside its detail: the contact's history, a file's properties. Shown once `ListDetailState.showExtra` is called.
- `listTitle: String?`: what the list is called, for a screen reader as it comes into view: "Inbox".
- `detailTitle: ((key: String) -> String)?`: what the detail of the item whose key it is given is called, for a screen reader as it comes into view: the message's subject.
- `extraTitle: String?`: what the extra pane is called: the title of the side sheet it is shown in over the detail, and for a screen reader as it comes into view.
- `resizable: Boolean`: whether a handle between the list and the detail makes the list wider and narrower.
- `style: ListDetailScaffoldStyle?`: the scaffold's widths, on top of the theme's.
- `tagKey: String?`: the key of the scaffold's automation tags.

### ListDetailState

`import com.pantrixui.components.container.listdetail.ListDetailState`, from `com.pantrixui:components`

```kotlin
class ListDetailState(initialSelectedKey: String? = null)
```

What a `PantrixListDetailScaffold` shows: which item of the list is open, whether its extra pane is shown, and how wide the list was dragged. An app reads it, changes it, and keeps it across a change of configuration and a process's death: `rememberListDetailState` saves it.

```kotlin
val inbox = rememberListDetailState()
PantrixListDetailScaffold(
    state = inbox,
    list = { Messages(onOpen = { id -> inbox.select(id) }) },
    detail = { id -> Message(id) }
)
```

An item is named by a key the app gives it: a string, the same in every language, that can be saved.

Parameters:

- `initialSelectedKey: String?`: the item open at first, or none.

Members:

- `selectedKey: String?`: The key of the item open in the detail pane, or null while none is.
- `isExtraVisible: Boolean`: Whether the extra pane is shown, the one beside the detail. A scaffold given no extra pane shows none whatever this says.
- `listWidth: Dp`: How wide the list was made by its handle, or `Dp.Unspecified` while it is as wide as the scaffold's style says. Kept with the rest of the state, and set by an app that remembers a reader's width itself.
- `fun select(key: String)`: Opens the item `key` in the detail pane: in one pane at a time, the detail takes the list's place.
- `fun back()`: Goes back to the list: closes the detail and the extra pane, and no item is open. What back, Escape and the edge swipe of iOS do while the scaffold shows one pane at a time.
- `fun showExtra()`: Shows the extra pane: beside the detail where there is room for three panes, in a side sheet elsewhere.
- `fun hideExtra()`: Hides the extra pane.

On the type:

- `ListDetailState.Saver: Saver<ListDetailState, *>`: What `rememberListDetailState` saves a state with.

### rememberListDetailState

`import com.pantrixui.components.container.listdetail.rememberListDetailState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberListDetailState(initialSelectedKey: String? = null): ListDetailState
```

A `ListDetailState` remembered and saved, so that the open item, the extra pane and the list's width come back after a change of configuration and a process's death.

Parameters:

- `initialSelectedKey: String?`: the item open at first, or none.

### ListDetailScope

`import com.pantrixui.components.container.listdetail.ListDetailScope`, from `com.pantrixui:components`

```kotlin
interface ListDetailScope
```

What each pane of a `PantrixListDetailScaffold` is told of the scaffold it is in.

Members:

- `state: ListDetailState`: The scaffold's state: what a pane opens an item, shows the extra pane and goes back with.
- `paneCount: Int`: How many panes the scaffold has room for side by side: one, two, or three where it was given an extra pane and its room is Large or wider.
- `isSinglePane: Boolean`: Whether the scaffold shows one pane at a time, the detail in the list's place: then the detail's own bar shows a back button that calls `ListDetailState.back`.
- `isExtraInSheet: Boolean`: Whether the extra pane is shown over the detail, in the scaffold's side sheet with a title and a close button of its own, and not beside it: an extra pane that draws its own header leaves it out then.

### ListDetailScaffoldStyle

`import com.pantrixui.components.container.listdetail.ListDetailScaffoldStyle`, from `com.pantrixui:components`

```kotlin
class ListDetailScaffoldStyle(
    public val listWidth: Dp = Dp.Unspecified,
    public val minListWidth: Dp = Dp.Unspecified,
    public val minDetailWidth: Dp = Dp.Unspecified,
    public val extraWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val handleWidth: Dp = Dp.Unspecified,
    public val handleHeight: Dp = Dp.Unspecified,
    public val handleTarget: Dp = Dp.Unspecified
) : PantrixStyle<ListDetailScaffoldStyle>
```

`PantrixListDetailScaffold`'s geometry: how wide the list and the extra pane are beside the detail, how narrow a drag of the handle may make the list and the detail, and the handle itself.

The gap between the panes follows density, as the layout's gutter it is by default does; the widths and the handle do not. The panes' colours are not part of the style: each pane is drawn by the app, on what it puts in it.

Parameters:

- `listWidth: Dp`: How wide the list is beside the detail until its handle is dragged: 360dp, a phone's width.
- `minListWidth: Dp`: The narrowest a drag of the handle makes the list.
- `minDetailWidth: Dp`: The narrowest the detail is let be beside the list: a drag of the handle stops where the detail would be narrower, and so does a list width set on the state.
- `extraWidth: Dp`: How wide the extra pane is beside the detail, where there is room for three panes.
- `gap: Dp`: Between the panes. Unspecified in the presets: the layout's gutter, `PantrixTheme.layout.gutter`, which grows with the window. A brand whose panes meet edge to edge, with a line of their own between them, gives 0dp.
- `handleWidth: Dp`: The mark a resizable list's handle draws in the gap: a short upright bar.
- `handleHeight: Dp`: How tall the handle's upright bar is: `handleWidth` is how thick it is.
- `handleTarget: Dp`: How wide the strip is that a finger or a pointer catches the handle by, centred on the gap and over the panes' edges where the gap is narrower: each platform's smallest touch target under a finger, a narrow strip under a pointer.
