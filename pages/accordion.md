# Accordion

Sections whose content folds away under their headers, so that a long page can be read a part at a time.

Which sections are open is the screen's state: the accordion is given the keys of the open sections (`expanded`), and when a header is pressed it reports back the new set that is to be open (`onExpandedChange`). The accordion changes nothing by itself. That is what lets a screen open the section a link points at, keep what was open across a rotation, or close everything from a button of its own.

- `PantrixAccordion` (`com.pantrixui.components.container.accordion`, `com.pantrixui:components`): Sections whose content folds away under their headers: three ways of telling them apart, one or many open at a time. Keywords: collapse, expandable, disclosure, expansion panel, faq, collapsible section.

## Features

- **Three variants.** `variant` says how the sections are told apart: `Plain` puts a line between them, `Bordered` puts one edge around them all, `Separated` makes each section a card of its own.
- **One section or many.** Any number of sections stay open at once; with `singleExpanded`, opening one closes the one that was open.
- **The parts of a header.** The header of an `AccordionSection` has its `title`, with `subtitle` under it, `icon` before it and `trailing` at its end. `trailing` is a part of the header's button and is read with it: a count, a badge; a control of its own does not belong there.
- **Keys.** Each section's `key` is the same in every language, and no two sections of an accordion have one key.
- **A closed section is not composed.** A section's content is composed only while the section is open; what it kept with `rememberSaveable` is there again when the section is opened again.
- **Disabled.** The accordion's `enabled` keeps every header from being pressed, and a section's own `enabled` only that section's; open or closed, the section stays as it is.
- **Screen reader.** A header is a button and a heading that carries its section's name. A screen reader is offered what a press does, to expand the section or to collapse it, and is told whether the section is open. The chevron is a picture of that, and is not read.
- **Platform.** A header is a row of a list: 56dp on Android, 44dp on iOS and the web, 40dp on desktop; it is never lower than the platform's touch target, and grows with a long title and a large type. The corners are the card's.
- **Colour.** `AccordionColors` gives the fill, the text's colour and the lines. The variants that have no fill stand on what is behind them: on a fill, they are written in the colour that fill gives what stands on it.
- **Automation.** With `tagKey` the accordion is `Accordion_<tagKey>`, a header in it `Accordion_<tagKey>.Header_<key>` and what it opens `Accordion_<tagKey>.Content_<key>`. A press is reported as `expand` or `collapse`, with the section's key.

## Usage

### Questions and answers

```kotlin
var open by remember { mutableStateOf(emptySet<String>()) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "delivery", title = stringResource(Res.string.when_will_it_arrive)) {
            PantrixText(stringResource(Res.string.delivery_answer))
        },
        AccordionSection(key = "returns", title = stringResource(Res.string.how_do_i_return)) {
            PantrixText(stringResource(Res.string.returns_answer))
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "faq"
)
```

### One open at a time, each a card of its own

```kotlin
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "account",
            title = stringResource(Res.string.account),
            subtitle = stringResource(Res.string.account_summary),
            icon = PantrixIcons.Person
        ) { AccountSettings() },
        AccordionSection(key = "billing", title = stringResource(Res.string.billing), icon = PantrixIcons.Folder) {
            BillingSettings()
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    singleExpanded = true,
    tagKey = "settings"
)
```

### Inside one edge, with a count at a header's end

```kotlin
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "open",
            title = stringResource(Res.string.open_orders),
            trailing = { PantrixText(text = orders.size.toString(), style = PantrixTheme.typography.footnote) }
        ) { Orders(orders) }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "orders"
)
```

## Examples

### Frequently asked questions: a line between them

The plainest form, questions and answers. The keys of the open sections are the screen's state and are kept with `rememberSaveable`; the accordion takes them as `expanded` and, when a header is pressed, reports the new set with `onExpandedChange`. Any number of sections stay open at once.

No variant is given: `Plain`, a line between the sections and nothing around them. A long title that does not fit on one line runs onto a second, and the header grows with it. The last section's `enabled` is false: it cannot be pressed, is written in the disabled text's colour and stays closed.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText

var open by rememberSaveable { mutableStateOf(setOf("delivery")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "delivery", title = "When will my order arrive?") {
            PantrixText(text = "Within two working days. Orders placed before noon are delivered the next day.")
        },
        AccordionSection(key = "returns", title = "How do I return an item?") {
            PantrixText(text = "Within thirty days, in its box. Shipping is on us.")
        },
        AccordionSection(
            key = "gift",
            title = "Can I have my order gift-wrapped, and can I have a note put inside the parcel?"
        ) { PantrixText(text = "Yes. Tick the gift-wrap option at checkout.") },
        AccordionSection(key = "invoice", title = "Company invoice", subtitle = "Coming soon", enabled = false) {
            PantrixText(text = "Not available yet.")
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "faq"
)
```

### Inside one edge, with a count at a header's end

`AccordionVariant.Bordered` puts the sections inside one edge; there is still a line between them.

The `icon` before the title is drawn in the title's colour, and a screen reader passes over it. The count at the header's end is given with `trailing`: it stands between the title and the chevron, is a part of the header's button, and a screen reader reads it with the title. Here it is written in small type and is given no colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("open")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "open",
            title = "Open orders",
            icon = PantrixIcons.Folder,
            trailing = { PantrixText(text = "2", style = PantrixTheme.typography.footnote) }
        ) {
            PantrixText(text = "SIP-2026-0914 · On its way")
            PantrixText(text = "SIP-2026-0921 · Preparing")
        },
        AccordionSection(
            key = "past",
            title = "Past orders",
            icon = PantrixIcons.Calendar,
            trailing = { PantrixText(text = "14", style = PantrixTheme.typography.footnote) }
        ) { PantrixText(text = "Last order: 12 September") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "orders"
)
```

### Each section a card, only one open at a time

`AccordionVariant.Separated` makes each section a card of its own, with a gap between them. With `singleExpanded` only one section stays open at a time: opening one closes the one that was open. It is for pages where two open sections would push the rest off the screen.

`subtitle` is the second line, under the title, and gives the section's summary: flip the switches, and the subtitle of "Notifications" changes between "On" and "Off".

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(setOf("notifications")) }
var email by rememberSaveable { mutableStateOf(true) }
var push by rememberSaveable { mutableStateOf(false) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "notifications",
            title = "Notifications",
            subtitle = if (email || push) "On" else "Off",
            icon = PantrixIcons.Star
        ) {
            PantrixSwitchButton(
                checked = email,
                onCheckedChange = { email = it },
                label = "Email",
                tagKey = "email"
            )
            PantrixSwitchButton(checked = push, onCheckedChange = { push = it }, label = "Push", tagKey = "push")
        },
        AccordionSection(
            key = "account",
            title = "Account",
            subtitle = "ada@pantrix.io",
            icon = PantrixIcons.Person
        ) { PantrixText(text = "Member since 2024") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    singleExpanded = true,
    tagKey = "settings"
)
```

### A section that closes keeps what was typed

A closed section's content is not composed at all; yet the section keeps, even while it is closed, everything that was saved to be restored. The field keeps its text with `rememberTextFieldState()`, and that state is saved.

Type something into the "Delivery note" section, close the section and open it again: when the section closes the field leaves the screen, and when it opens again what you typed is there.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField

var open by rememberSaveable { mutableStateOf(setOf("note")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "note", title = "Delivery note") {
            PantrixTextField(
                state = rememberTextFieldState(),
                modifier = Modifier.fillMaxWidth(),
                label = "Note for the courier",
                placeholder = "The doorbell does not work, please knock",
                tagKey = "accordion_note"
            )
        },
        AccordionSection(key = "address", title = "Delivery address") {
            PantrixText(text = "Pantrix A.Ş., Maslak, İstanbul")
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "remembers"
)
```

### Opening and closing from outside

Since the open sections are the screen's state, they change from outside the accordion too. The two buttons above press no header; they only change the set: one puts every key into it, the other empties it. The accordion draws the new set.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(emptySet<String>()) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Open all",
        onClick = { open = setOf("monday", "tuesday", "wednesday") },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "accordion_open_all"
    )
    PantrixButton(
        text = "Close all",
        onClick = { open = emptySet() },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        tagKey = "accordion_close_all"
    )
}
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "monday", title = "Monday") { PantrixText(text = "09.00 Weekly planning") },
        AccordionSection(key = "tuesday", title = "Tuesday") { PantrixText(text = "14.00 Design review") },
        AccordionSection(key = "wednesday", title = "Wednesday") { PantrixText(text = "No meetings") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "week"
)
```

### All disabled

With `enabled = false` no header can be pressed and every section is held as it is: an open one stays open and a closed one closed. The headers are written in the disabled text's colour. A section's own `enabled` does the same for that section alone.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText

PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "summary", title = "Order summary", subtitle = "Confirmed") {
            PantrixText(text = "The order is confirmed; it can no longer be changed.")
        },
        AccordionSection(key = "payment", title = "Payment") { PantrixText(text = "Paid by card") }
    ),
    expanded = setOf("summary"),
    onExpandedChange = {},
    variant = AccordionVariant.Bordered,
    enabled = false,
    tagKey = "locked"
)
```

### In its own colours

`colors` gives the accordion the colours set there in place of the theme's: here, cards in a colour the theme does not have. The fill is given with `container`; the headers and the content take the `content` colour, and the line is given separately, with `divider`. A colour that is left out stays the theme's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionColors
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText

val own = ownColors()
var open by rememberSaveable { mutableStateOf(setOf("plan")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "plan", title = "Plan", subtitle = "Team") {
            PantrixText(text = "Up to ten users, billed monthly.")
        },
        AccordionSection(key = "usage", title = "Usage") { PantrixText(text = "48,2 million requests this month") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    colors = AccordionColors(container = own.container, content = own.onContainer, divider = own.color),
    tagKey = "own"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### On a fill

The `Plain` and `Bordered` variants have no fill of their own: they stand on what is behind them. Here the accordion is inside a surface painted with a role's fill, and is given no colours: the titles, the subtitle and the chevron are written in the colour that fill gives what stands on it, and the lines are drawn in a share of that colour. The theme's line would not read on this fill.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("shipping")) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.container) {
    PantrixAccordion(
        sections = listOf(
            AccordionSection(key = "shipping", title = "Shipping", subtitle = "Free", icon = PantrixIcons.Inbox) {
                PantrixText(text = "Ships tomorrow before noon.")
            },
            AccordionSection(key = "warranty", title = "Warranty") { PantrixText(text = "Two years") }
        ),
        expanded = open,
        onExpandedChange = { open = it },
        modifier = Modifier.padding(PantrixTheme.spacing.sm),
        tagKey = "on_a_fill"
    )
}
```

### In its own style

`style` changes the accordion's geometry; only the fields that are given change, and the rest comes from the platform's style. Here the header's least height is set to 64dp and the gap between the cards to 16dp; the corners are not a step of the brand's shape scale but a fixed 20dp: `ShapeSpec.Fixed`.

```kotlin
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionStyle
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.token.shape.ShapeSpec

var open by rememberSaveable { mutableStateOf(setOf("first")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "first", title = "Step one") { PantrixText(text = "Create your account.") },
        AccordionSection(key = "second", title = "Step two") { PantrixText(text = "Verify your email.") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    style = AccordionStyle(
        shape = ShapeSpec.Fixed(RoundedCornerShape(20.dp)),
        headerMinHeight = 64.dp,
        sectionGap = 16.dp
    ),
    tagKey = "own_style"
)
```

## API

### PantrixAccordion

`import com.pantrixui.components.container.accordion.PantrixAccordion`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAccordion(
    sections: List<AccordionSection>,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    variant: AccordionVariant = AccordionVariant.Plain,
    singleExpanded: Boolean = false,
    enabled: Boolean = true,
    style: AccordionStyle? = null,
    colors: AccordionColors? = null,
    tagKey: String? = null
)
```

Sections whose content folds away under their headers, so that a long page can be read a part at a time.

Which sections are open is the caller's state, as a sidebar's is: give `expanded` and act on `onExpandedChange`. That is what lets a screen open the section a link points at, keep what was open across a rotation, or close everything from a button of its own.

A header is a button and a heading that carries its section's name. A screen reader is offered what a press does, to expand the section or to collapse it, and is told whether the section is open: by that action on Android, and in the theme's words elsewhere. The chevron is a picture of that, and is passed over. A header is never lower than the platform's touch target, and grows with a longer title and a larger type.

What a section shows is composed only while the section is open. What it kept with `rememberSaveable` is there again when the section is opened again. The accordion fills the width it is given and does not scroll: it stands in a page that does.

```kotlin
var open by remember { mutableStateOf(setOf("delivery")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "delivery", title = stringResource(Res.string.when_will_it_arrive)) {
            PantrixText(stringResource(Res.string.delivery_answer))
        },
        AccordionSection(key = "returns", title = stringResource(Res.string.how_do_i_return)) {
            PantrixText(stringResource(Res.string.returns_answer))
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "faq"
)
```

Parameters:

- `sections: List<AccordionSection>`: the sections, in the order they are shown. No two of them have one key.
- `expanded: Set<String>`: the keys of the sections that are open.
- `onExpandedChange: (Set<String>) -> Unit`: called with the keys that are to be open after a header was pressed. The accordion changes nothing by itself.
- `modifier: Modifier`: the accordion's modifier. The accordion is as wide as the room it is given and as tall as its headers and what the open ones show.
- `variant: AccordionVariant`: how the sections are told apart: by a line between them, by an edge around the set, or each as a card of its own.
- `singleExpanded: Boolean`: whether opening a section closes whichever was open: for a page where two open sections would push the rest off the screen.
- `enabled: Boolean`: whether the headers can be pressed. False holds every section as it is, and a section says the same of itself alone.
- `style: AccordionStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: AccordionColors?`: this accordion's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the accordion's automation key: the accordion is `Accordion_<tagKey>`, a header in it `Accordion_<tagKey>.Header_<key>` and what it opens `Accordion_<tagKey>.Content_<key>`. A press is reported as an `Accordion` event: `expand` and `collapse`, with the section's key.

### AccordionSection

`import com.pantrixui.components.container.accordion.AccordionSection`, from `com.pantrixui:components`

```kotlin
class AccordionSection(
    public val key: String,
    public val title: String,
    public val subtitle: String? = null,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null,
    public val trailing: (@Composable () -> Unit)? = null,
    public val content: @Composable ColumnScope.() -> Unit
)
```

One section of a `PantrixAccordion`: its header, and what the header opens.

```kotlin
AccordionSection(key = "delivery", title = stringResource(Res.string.when_will_it_arrive)) {
    PantrixText(stringResource(Res.string.delivery_answer))
}
```

Parameters:

- `key: String`: What the accordion's `expanded` holds for this section. It is the same in every language, so a translated screen opens the same section, and no two sections of an accordion have one key.
- `title: String`: The header's text, and the section's name for a screen reader.
- `subtitle: String?`: A second line under the title, or null for none.
- `icon: ImageVector?`: Drawn before the title, in the title's colour, or null for none. A screen reader passes over it.
- `enabled: Boolean`: Whether the header can be pressed. One that cannot is written in the disabled text's colour, and its section stays open or closed as the accordion's `expanded` has it.
- `tagKey: String?`: The section's automation key, the same in every language, where it is to be another than `key`: the header is `Header_<tagKey>` and what it opens `Content_<tagKey>`, inside the tag of an accordion that has a key, as `Accordion_faq.Header_delivery`.
- `trailing: (@Composable () -> Unit)?`: What stands between the title and the chevron, or null for nothing: a count, a badge. It is a part of the header's button and is read with it: a control of its own does not belong there.
- `content: @Composable ColumnScope.() -> Unit`: What the section shows while it is open, one thing under another with the theme's small spacing between them, as in a card. A closed section composes none of it.

### AccordionVariant

`import com.pantrixui.components.container.accordion.AccordionVariant`, from `com.pantrixui:components`

```kotlin
enum class AccordionVariant
```

How the sections of a `PantrixAccordion` are told apart.

Entries:

- `Plain`: A line between one section and the next, and nothing around the set: for a page's own column.
- `Bordered`: One edge around the whole set, with a line between the sections inside it.
- `Separated`: Each section a card of its own, with a gap between one and the next.

### AccordionStyle

`import com.pantrixui.components.container.accordion.AccordionStyle`, from `com.pantrixui:components`

```kotlin
class AccordionStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val headerMinHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val contentPadding: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val sectionGap: Dp = Dp.Unspecified
) : PantrixStyle<AccordionStyle>
```

`PantrixAccordion`'s geometry: the room in a section's header and around what the header opens, and the edge.

A header is a row of a list. On Android it is Material 3's one-line list item, 56dp tall with 16dp at its sides. On iOS it is a row of 44pt, the least a finger is given there. Desktop and the web are tighter, for a pointer, and the web's header is no lower than 44dp: a browser may be a touch screen's.

The corners are the card's on each platform, since a section of `AccordionVariant.Separated` is a card: medium on Android, large on iOS, small on desktop and the web.

The header's height, the paddings and the gaps follow the density, since they are the room around the words. The icon's size, the edge's width and the shape do not.

Parameters:

- `shape: ShapeSpec`: The corners of the edge around the set in `AccordionVariant.Bordered`, and around each section in `AccordionVariant.Separated`: a step of the brand's shape scale, or a fixed shape.
- `headerMinHeight: Dp`: The least height of a header. A title on two lines, a subtitle or a larger type makes it taller, and the platform's touch target is its floor.
- `horizontalPadding: Dp`: The room between a header's sides and what it holds.
- `verticalPadding: Dp`: The room over and under a header's lines, where they need more than the least height.
- `contentPadding: Dp`: The room at the sides of what an open section shows, and under it.
- `iconGap: Dp`: Between a header's icon, its title, what it has at its end and its chevron.
- `iconSize: Dp`: The width and height of a header's icon and of its chevron.
- `borderWidth: Dp`: The width of the lines between sections, and of the edges. Zero draws none.
- `sectionGap: Dp`: Between one section and the next in `AccordionVariant.Separated`.

### AccordionColors

`import com.pantrixui.components.container.accordion.AccordionColors`, from `com.pantrixui:components`

```kotlin
data class AccordionColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

What a `PantrixAccordion` is painted with, for an accordion that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// Each section a card in the primary role's soft fill, written in what the theme pairs with it.
PantrixAccordion(…, colors = AccordionColors(container = PantrixTheme.colors.primary.container))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it, unless `content` is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The fill behind the sections. None in `AccordionVariant.Plain` and `AccordionVariant.Bordered`, which stand on what is behind them, and the theme's `surface` under each section of `AccordionVariant.Separated`.
- `content: Color`: A header's title and its icon, and what a section shows where that gives no colour of its own. The theme's `textPrimary`, or on a fill that is not the accordion's, the colour that fill gives what stands on it. A subtitle and a chevron are the theme's `textSecondary` on the theme's own grounds, and this colour elsewhere and where it is given.
- `divider: Color`: The lines between sections, and the edges. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`: the edge a subtle button has.
