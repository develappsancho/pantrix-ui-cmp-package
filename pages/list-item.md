# List Item

A row of a list: a title, what leads it and what ends it, and a line or two under it. A row of an inbox, of settings or of a search's results.

- `PantrixListItem` (`com.pantrixui.components.data.listitem`, `com.pantrixui:components`): A row of a list: a title with an overline, a supporting text and a trailing text, what leads and ends it, a chevron, a press, a selected state and a line under it, at each platform's list heights. Keywords: list row, list tile, table view cell, settings row, inbox row, two line list, cell.

## Features

- **Lines.** `headline` is the row's name; `supportingText` a line or two under it, smaller and quieter; `overline` a short line over it; `trailingText` a short text at the end of the title's line, on its baseline: a time, a count, a setting's value. The supporting text is cut at `supportingMaxLines` lines, two by default.
- **What leads and ends it.** `leading` leads the row (an icon, an avatar, a picture) and `trailing` ends it (a badge, a tag, a switch). Both are given the row's quiet colour. `chevron` puts a chevron at the row's end, which says it leads on to another screen; it turns round where the layout is read from the right, and is not read out.
- **Pressing and choosing.** A row given `onClick` is one target, at least as tall as the platform's touch target, and shows the press, a faint fill under a pointer and the focus ring inside its own edges. `selected` fills the row in the primary role's container colour and tells a screen reader it is selected.
- **One node.** A screen reader hears the row as a whole: the overline, the title, the trailing text, the supporting text. A switch or a button at its end stays a node of its own.
- **The line.** `divider` draws a line under the row: `Full` from one side to the other, `Inset` from where the text starts, as iOS's lists have it.
- **Platform.** Material 3's rows on Android (56, 72, 88dp), iOS's on iOS (44, 60, 76), denser rows on the desktop and the web (36/52/68 and 40/56/72). The title is set in the body type on a phone and in the label type on the desktop and the web; `headlineStyle`, `supportingTextStyle` and `trailingTextStyle` change them.

## Usage

### An inbox: who wrote, when and about what

```kotlin
LazyColumn {
    items(messages, key = { it.id }) { message ->
        PantrixListItem(
            headline = message.from,
            supportingText = message.subject,
            trailingText = message.time,
            leading = { PantrixAvatar(contentDescription = null, initials = message.initials) },
            selected = message.id == open,
            onClick = { open = message.id },
            divider = ListItemDivider.Inset,
            tagKey = "message_" + message.id
        )
    }
}
```

### Settings that lead on

```kotlin
PantrixListItem(
    headline = stringResource(Res.string.downloads),
    trailingText = stringResource(Res.string.wifi_only),
    leading = { PantrixIcon(PantrixIcons.Download, contentDescription = null) },
    chevron = true,
    onClick = { navigate(Screen.Downloads) },
    tagKey = "downloads"
)
```

### Three lines, read and not pressed

```kotlin
PantrixListItem(
    headline = order.title,
    overline = order.date,
    supportingText = order.summary,
    trailing = { PantrixTag(text = order.status) },
    tagKey = "order_" + order.id
)
```

## Examples

### An inbox

An inbox: who wrote, when, and about what. A press on a row chooses it; the chosen row is filled. The lines are drawn from where the text starts, and leave the column of avatars whole.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.listitem.ListItemDivider
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.avatar.PantrixAvatar

var open by remember { mutableStateOf("0") }
Column {
    INBOX.forEachIndexed { index, mail ->
        PantrixListItem(
            headline = mail.from,
            supportingText = mail.subject,
            trailingText = mail.time,
            leading = { PantrixAvatar(contentDescription = null, initials = mail.initials) },
            selected = open == "$index",
            onClick = { open = "$index" },
            divider = ListItemDivider.Inset,
            tagKey = "mail_$index"
        )
    }
}

private class InboxMessage(
    val from: String,
    val initials: String,
    val subject: String,
    val time: String
)

private val INBOX = listOf(
    InboxMessage("Ayşe Demir", "AD", "The agenda of Monday's meeting", "12:40"),
    InboxMessage("Mert Kaya", "MK", "The design files are ready", "11:05"),
    InboxMessage("Elif Şahin", "EŞ", "Invoice: October", "Yesterday")
)
```

### Settings

Settings: the rows that lead on to another screen have their values and a chevron at their end. The notifications' row is not pressed; the switch at its end is a control of its own. A row that is turned off takes no press and is written faintly.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.listitem.ListItemDivider
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.icons.PantrixIcons

var notify by remember { mutableStateOf(true) }
Column {
    PantrixListItem(
        headline = "Downloads",
        trailingText = "Wi-Fi only",
        leading = { PantrixIcon(PantrixIcons.Download, contentDescription = null) },
        chevron = true,
        onClick = {},
        divider = ListItemDivider.Full,
        tagKey = "downloads"
    )
    PantrixListItem(
        headline = "Notifications",
        supportingText = "When a new message comes",
        leading = { PantrixIcon(PantrixIcons.Inbox, contentDescription = null) },
        trailing = {
            PantrixSwitchButton(
                checked = notify,
                onCheckedChange = { notify = it },
                contentDescription = "Notifications",
                tagKey = "notify"
            )
        },
        divider = ListItemDivider.Full,
        tagKey = "notifications"
    )
    PantrixListItem(
        headline = "Backup",
        supportingText = "Not in your plan",
        leading = { PantrixIcon(PantrixIcons.Upload, contentDescription = null) },
        chevron = true,
        onClick = {},
        enabled = false,
        tagKey = "backup"
    )
}
```

### Three lines

Three lines, read and not pressed: the date over it, up to two lines of supporting text under it, a tag at its end. In a row of three lines what leads and ends it stands at its top.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.listitem.ListItemDivider
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone

Column {
    PantrixListItem(
        headline = "Order 1042",
        overline = "28 October",
        supportingText = "Two books and a notebook. Shipped, and expected to arrive tomorrow.",
        trailing = { PantrixTag(text = "On its way", tone = TagTone.Info) },
        divider = ListItemDivider.Full,
        tagKey = "order_1042"
    )
    PantrixListItem(
        headline = "Order 1039",
        overline = "21 October",
        supportingText = "A pair of headphones.",
        trailing = { PantrixTag(text = "Delivered", tone = TagTone.Success) },
        tagKey = "order_1039"
    )
}
```

### What a search found

A search's results: the word searched for is set in bold in the title (the overload that takes an `AnnotatedString`), and the supporting text says where it was found.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons

val typed = "Area"
Column {
    listOf("Text Area", "Filled Text Area").forEachIndexed { index, title ->
        val at = title.indexOf(typed)
        PantrixListItem(
            headline = buildAnnotatedString {
                append(title.take(at))
                withStyle(SpanStyle(fontWeight = FontWeight.ExtraBold)) { append(typed) }
                append(title.drop(at + typed.length))
            },
            supportingText = "Component · Form",
            leading = { PantrixIcon(PantrixIcons.Search, contentDescription = null) },
            onClick = {},
            tagKey = "found_$index"
        )
    }
}
```

### A style and colours of its own

A style and colours of its own: denser rows (`ListItemStyle`), the title in the theme's `callout` role, the selected row in a success colour (`ListItemColors`), the supporting text in the `footnote` type (`supportingTextStyle`), the price in the code type (`trailingTextStyle`).

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.listitem.ListItemColors
import com.pantrixui.components.data.listitem.ListItemStyle
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.TypeRole

val success = PantrixTheme.colors.success
var chosen by remember { mutableStateOf(0) }
Column {
    listOf("Weekly" to "29 ₺", "Monthly" to "99 ₺", "Yearly" to "990 ₺").forEachIndexed { index, (plan, price) ->
        PantrixListItem(
            headline = plan,
            supportingText = if (index == 2) "Two months on us" else null,
            trailingText = price,
            selected = chosen == index,
            onClick = { chosen = index },
            style = ListItemStyle(oneLineHeight = 40.dp, twoLineHeight = 52.dp, headlineRole = TypeRole.Callout),
            colors = ListItemColors(selectedContainer = success.container, selectedContent = success.onContainer),
            supportingTextStyle = PantrixTheme.typography.footnote,
            trailingTextStyle = PantrixTheme.typography.code,
            tagKey = "plan_$index"
        )
    }
}
```

## API

### PantrixListItem

`import com.pantrixui.components.data.listitem.PantrixListItem`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixListItem(
    headline: String,
    modifier: Modifier = Modifier,
    supportingText: String? = null,
    overline: String? = null,
    trailingText: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    chevron: Boolean = false,
    onClick: (() -> Unit)? = null,
    selected: Boolean = false,
    enabled: Boolean = true,
    divider: ListItemDivider = ListItemDivider.None,
    supportingMaxLines: Int = 2,
    style: ListItemStyle? = null,
    colors: ListItemColors? = null,
    tagKey: String? = null,
    headlineStyle: TextStyle? = null,
    supportingTextStyle: TextStyle? = null,
    trailingTextStyle: TextStyle? = null
)
```

A row of a list: a title, with what leads it, what ends it and a line or two under it, as a list of messages, of settings or of results has.

See the overload that takes an `AnnotatedString` title for everything the row does: this one writes `headline` as it is.

Parameters:

- `headline: String`: what the row is, in a few words: its name for a screen reader.
- `modifier: Modifier`: the row's modifier. The row is as wide as it is given, and at least as tall as its style's height for the lines it has.
- `supportingText: String?`: a line or two under the title, in a smaller and quieter type: what the row says more.
- `overline: String?`: a short line over the title, in the theme's caption: a category, a date.
- `trailingText: String?`: a short text at the end of the title's line, on its baseline, in `trailingTextStyle`: a time, a count, a setting's value.
- `leading: (@Composable () -> Unit)?`: what leads the row: an icon, an avatar, a picture. It is given the row's quiet colour.
- `trailing: (@Composable () -> Unit)?`: what ends the row: a badge, a button, a switch. It is given the row's quiet colour.
- `chevron: Boolean`: whether a chevron ends the row, after `trailing`, for a row that leads on to another screen.
- `onClick: (() -> Unit)?`: what a press on the row does. Null makes it a row that is read and not pressed.
- `selected: Boolean`: whether the row is the one chosen, as the message shown beside a list is.
- `enabled: Boolean`: whether the row can be pressed. One that cannot is written in the disabled colour.
- `divider: ListItemDivider`: the line the row draws under itself.
- `supportingMaxLines: Int`: how many lines `supportingText` runs to before it is cut.
- `style: ListItemStyle?`: this call's own style: over every enclosing one and under the density.
- `colors: ListItemColors?`: this row's own colours, where they are not the theme's.
- `tagKey: String?`: the row's automation key: the row is `ListItem_<tagKey>`.
- `headlineStyle: TextStyle?`: the type the title is set in: the style's `headlineRole` unless given.
- `supportingTextStyle: TextStyle?`: the type the supporting text is set in: the style's `supportingRole` unless given.
- `trailingTextStyle: TextStyle?`: the type `trailingText` is set in: `supportingTextStyle` unless given, as a time beside a message's title is written in the message's own small type.

### PantrixListItem

`import com.pantrixui.components.data.listitem.PantrixListItem`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixListItem(
    headline: AnnotatedString,
    modifier: Modifier = Modifier,
    supportingText: String? = null,
    overline: String? = null,
    trailingText: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    chevron: Boolean = false,
    onClick: (() -> Unit)? = null,
    selected: Boolean = false,
    enabled: Boolean = true,
    divider: ListItemDivider = ListItemDivider.None,
    supportingMaxLines: Int = 2,
    style: ListItemStyle? = null,
    colors: ListItemColors? = null,
    tagKey: String? = null,
    headlineStyle: TextStyle? = null,
    supportingTextStyle: TextStyle? = null,
    trailingTextStyle: TextStyle? = null
)
```

A row of a list whose title has more in it than words: a word marked where a search found it, a part in bold.

The row writes its title over a line or two: an `overline` over it, a `supportingText` under it, a `trailingText` at the end of its line. What `leading` and `trailing` hold stands beside them, in the middle of a row of one or two lines and at the top of a row of three. A `chevron` says the row leads on.

A row with `onClick` is pressed as one target, at least as tall as the platform's touch target: it shows the press, a fill under a pointer and a focus ring inside its edges, and reports a press as a `ListItem` event, `click`, never with its words. A `selected` row is filled in the primary role's container and written in what is paired with it, and says so to a screen reader. A screen reader hears the row as one node: the overline, the title, the trailing text and the supporting text, in that order. A control in `trailing`, a switch or a button, stays a node of its own.

```kotlin
PantrixListItem(
    headline = buildAnnotatedString {
        append(entry.title.take(found.first))
        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append(entry.title.substring(found)) }
        append(entry.title.drop(found.last + 1))
    },
    supportingText = entry.where,
    onClick = { open(entry) }
)
```

Parameters:

- `headline: AnnotatedString`: what the row is, with its spans: its name for a screen reader.
- `modifier: Modifier`: the row's modifier. The row is as wide as it is given, and at least as tall as its style's height for the lines it has.
- `supportingText: String?`: a line or two under the title, in a smaller and quieter type: what the row says more.
- `overline: String?`: a short line over the title, in the theme's caption: a category, a date.
- `trailingText: String?`: a short text at the end of the title's line, on its baseline, in `trailingTextStyle`: a time, a count, a setting's value.
- `leading: (@Composable () -> Unit)?`: what leads the row: an icon, an avatar, a picture. It is given the row's quiet colour.
- `trailing: (@Composable () -> Unit)?`: what ends the row: a badge, a button, a switch. It is given the row's quiet colour.
- `chevron: Boolean`: whether a chevron ends the row, after `trailing`, for a row that leads on to another screen. It is drawn in the row's quiet colour, turned round where the layout is read from the right, and not read out.
- `onClick: (() -> Unit)?`: what a press on the row does. Null makes it a row that is read and not pressed.
- `selected: Boolean`: whether the row is the one chosen, as the message shown beside a list is.
- `enabled: Boolean`: whether the row can be pressed. One that cannot takes no press and is written in the disabled colour.
- `divider: ListItemDivider`: the line the row draws under itself: none, one across the row, or one from where its text starts.
- `supportingMaxLines: Int`: how many lines `supportingText` runs to before it is cut with an ellipsis.
- `style: ListItemStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: ListItemColors?`: this row's own colours: the ones it sets, with the theme's for the rest.
- `tagKey: String?`: the row's automation key: the row is `ListItem_<tagKey>`.
- `headlineStyle: TextStyle?`: the type the title is set in: the style's `headlineRole` unless given. A colour in it is not the title's, which is the row's.
- `supportingTextStyle: TextStyle?`: the type the supporting text is set in: the style's `supportingRole` unless given.
- `trailingTextStyle: TextStyle?`: the type `trailingText` is set in: `supportingTextStyle` unless given, as a time beside a message's title is written in the message's own small type.

### ListItemDivider

`import com.pantrixui.components.data.listitem.ListItemDivider`, from `com.pantrixui:components`

```kotlin
enum class ListItemDivider
```

The line a `PantrixListItem` draws under itself, which parts it from the row under it.

Entries:

- `None`: No line: the rows are parted by their room, or by what the list draws between them.
- `Full`: A line under the whole row, from one side to the other.
- `Inset`: A line under the row from where its text starts, past what leads it, as iOS's lists draw theirs: the rows' avatars or icons stand in an unbroken column.

### ListItemStyle

`import com.pantrixui.components.data.listitem.ListItemStyle`, from `com.pantrixui:components`

```kotlin
class ListItemStyle(
    public val oneLineHeight: Dp = Dp.Unspecified,
    public val twoLineHeight: Dp = Dp.Unspecified,
    public val threeLineHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val chevronSize: Dp = Dp.Unspecified,
    public val headlineRole: TypeRole? = null,
    public val supportingRole: TypeRole? = null
) : PantrixStyle<ListItemStyle>
```

`PantrixListItem`'s geometry and type: how tall a row of one, two and three lines is at the least, the room around and between what it holds, the corners of its fill and the types it writes in.

Each platform has its own list: Material 3's rows on Android (56, 72 and 88dp, 16dp in from the sides, the title in the body type), iOS's on iOS (44, 60 and 76), and denser rows where a pointer leads, 36, 52 and 68 on the desktop and 40, 56 and 72 on the web, their titles in the label type. A row is taller where what it holds needs more, as a larger type does. A fill on a phone runs to the row's edges; on the desktop and the web it has round corners.

The heights and the room follow the density. The corners, the chevron and the types do not.

Parameters:

- `oneLineHeight: Dp`: The least height of a row of its title alone.
- `twoLineHeight: Dp`: The least height of a row of a title and one other line: an overline or a supporting text.
- `threeLineHeight: Dp`: The least height of a row of a title, an overline and a supporting text.
- `horizontalPadding: Dp`: The room between the row's sides and what it holds.
- `verticalPadding: Dp`: The room over and under what the row holds, where it is taller than the least height.
- `gap: Dp`: The room between what leads the row, its text and what ends it.
- `shape: ShapeSpec`: The corners of the row's fill: none on Android and iOS, small on the desktop and the web.
- `chevronSize: Dp`: The width and height of the chevron at the end of a row that leads on.
- `headlineRole: TypeRole?`: The type the title is set in: the body on Android and iOS, the label on the desktop and the web.
- `supportingRole: TypeRole?`: The type the supporting text and the trailing text are set in: the label on Android and iOS, the footnote on the desktop and the web.

### ListItemColors

`import com.pantrixui.components.data.listitem.ListItemColors`, from `com.pantrixui:components`

```kotlin
data class ListItemColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val supportingContent: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

What a `PantrixListItem` is painted with, where it is not the theme's: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixListItem(
    headline = message.from,
    supportingText = message.subject,
    selected = message.id == open,
    onClick = { open = message.id },
    colors = ListItemColors(selectedContainer = brand.container, selectedContent = brand.onContainer)
)
```

A row has no fill of its own unless `container` is given: it stands on what holds it, and is written in what is written there, the theme's text on the theme's grounds and the colour a fill around it gives on one.

Parameters:

- `container: Color`: The row's own fill: none, by default.
- `content: Color`: The title and the trailing text: the theme's primary text on its grounds, what reads on a fill.
- `supportingContent: Color`: The overline, the supporting text and the chevron: the theme's secondary text on its grounds, and on a fill `content`.
- `selectedContainer: Color`: The fill of a selected row: the primary role's `container`.
- `selectedContent: Color`: What a selected row is written in: what the theme pairs with `selectedContainer`.
- `divider: Color`: The line under a row that draws one: the theme's divider on its grounds, a share of `content` on a fill.
