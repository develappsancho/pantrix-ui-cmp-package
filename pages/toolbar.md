# Toolbar

What a screen or a part of it can do, in a row: buttons with words, icon buttons, buttons that open a menu, and lines between their groups. What does not fit falls into the menu of the "…" button at its end.

- `PantrixToolbar` (`com.pantrixui.components.container.toolbar`, `com.pantrixui:components`): A row of buttons with words, icons, menus and lines between groups that turns its buttons into their icons and folds them into a "…" menu, one at a time by their priority, where it has no room. Keywords: toolbar, action bar, overflow menu, more actions, command bar, button row.

## Features

- **Items.** `ToolbarItem.Button` is a button with words, which may have an icon before them and a `ButtonVariant`; `ToolbarItem.IconButton` is an icon alone; `ToolbarItem.Menu` opens a choice's menu; `ToolbarItem.Divider` is the line between two groups.
- **What does not fit.** The items make room one at a time, the lowest `priority` first and of two alike the later one: a button with words and an icon is drawn as its icon, its words becoming the tooltip and the screen reader's name; where it still does not fit it falls into the menu, and only then does the next one give up anything. A button of a higher priority keeps its words while one of a lower priority has room to give.
- **Menu.** In the "…" menu what fell stands in the order given, and under it `menuItems`, the rows the menu always holds. A `ToolbarItem.Menu` is one row there; it opens its rows in the menu's place, under a row that goes back. Where nothing fell and the menu has no rows of its own, there is no "…" button either.
- **Start and end.** `start` stands at the bar's start, `end` at its end, the "…" button last. A line is drawn only where something stands on either side of it.
- **Keyboard.** The bar is one stop of Tab: the arrows walk between the buttons, Home and End go to the ends; in a right-to-left layout the arrows go the other way.
- **Screen reader.** The bar is one group, by the name `contentDescription` gives it.
- **Automation.** With `tagKey` the bar is `Toolbar_<tagKey>`, its items `Action_<key>` in the bar and in the menu alike, and the "…" button `More_actions`.
- **Style and colour.** `ToolbarStyle` gives the room between items and the line's height, `ToolbarColors` the line's colour; `buttonSize` is the buttons' size.

## Usage

### A document's actions, folding into the menu

```kotlin
PantrixToolbar(
    start = listOf(
        ToolbarItem.Button(
            key = "format",
            label = stringResource(Res.string.format),
            onClick = onFormat,
            variant = ButtonVariant.Solid,
            priority = 3
        ),
        ToolbarItem.Button(key = "minify", label = stringResource(Res.string.minify), onClick = onMinify),
        ToolbarItem.Divider(key = "made"),
        ToolbarItem.Button(
            key = "convert",
            label = stringResource(Res.string.convert),
            onClick = onConvert,
            icon = PantrixIcons.Code
        )
    ),
    end = listOf(
        ToolbarItem.IconButton(
            key = "copy",
            icon = PantrixIcons.Copy,
            label = stringResource(Res.string.copy),
            onClick = onCopy,
            priority = 5
        )
    ),
    contentDescription = stringResource(Res.string.document),
    tagKey = "document"
)
```

### A choice that opens a menu, and rows the menu always has

```kotlin
PantrixToolbar(
    start = listOf(
        ToolbarItem.Menu(
            key = "format",
            label = format.name,
            items = Format.entries.map { each ->
                ToolbarMenuItem(
                    key = each.key,
                    label = each.name,
                    onClick = { format = each },
                    selected = each == format
                )
            },
            priority = 2
        )
    ),
    menuItems = listOf(
        ToolbarMenuItem(
            key = "close",
            label = stringResource(Res.string.close_document),
            onClick = onClose,
            destructive = true
        )
    ),
    tagKey = "editor"
)
```

## Examples

### A document's actions

A document's actions, at the width chosen: in a wide bar all of them with their words; as it narrows, the button of the lowest priority is drawn as its icon first, then falls into the "…" menu, and then the next one. The copy button is of the highest priority and falls last.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarItem
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var width by rememberSaveable { mutableStateOf(640) }
var pressed by rememberSaveable { mutableStateOf("") }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = 640, label = "640 dp", tagKey = "640"),
            SegmentOption(value = 360, label = "360 dp", tagKey = "360"),
            SegmentOption(value = 200, label = "200 dp", tagKey = "200")
        ),
        selected = width,
        onSelect = { width = it },
        tagKey = "width"
    )
    PantrixToolbar(
        start = listOf(
            ToolbarItem.Button(
                key = "format",
                label = "Format",
                onClick = { pressed = "Format" },
                variant = ButtonVariant.Solid,
                priority = 3
            ),
            ToolbarItem.Button(
                key = "minify",
                label = "Minify",
                onClick = { pressed = "Minify" },
                icon = PantrixIcons.Minus
            ),
            ToolbarItem.Divider(key = "made"),
            ToolbarItem.Button(
                key = "convert",
                label = "Convert",
                onClick = { pressed = "Convert" },
                icon = PantrixIcons.Code
            ),
            ToolbarItem.Button(
                key = "history",
                label = "History",
                onClick = { pressed = "History" },
                icon = PantrixIcons.History,
                priority = 1
            )
        ),
        end = listOf(
            ToolbarItem.IconButton(
                key = "copy",
                icon = PantrixIcons.Copy,
                label = "Copy",
                onClick = { pressed = "Copy" },
                priority = 5
            )
        ),
        modifier = Modifier.widthIn(max = width.dp).fillMaxWidth(),
        contentDescription = "Document",
        tagKey = "document"
    )
    PantrixText(
        text = if (pressed.isEmpty()) "No action pressed yet." else "Last pressed: $pressed",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "pressed"
    )
}
```

### A choice's menu, and the menu's own rows

A choice's menu: the document's format, the one chosen marked. The menu's own rows, sharing and closing the document, are behind the "…" button at every width; in a narrow bar the format's button falls there too, and opens its rows in the menu's place.

The format's button writes the chosen format alone, "JSON"; a screen reader reads it as "The document's format", by its `contentDescription`. So does "Validate": "Validate the document", in the bar and in the "…" menu alike.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarItem
import com.pantrixui.components.container.toolbar.ToolbarMenuItem
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var format by rememberSaveable { mutableStateOf("json") }
var narrow by rememberSaveable { mutableStateOf(false) }
var said by rememberSaveable { mutableStateOf("") }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = false, label = "Wide", tagKey = "wide"),
            SegmentOption(value = true, label = "Narrow", tagKey = "narrow")
        ),
        selected = narrow,
        onSelect = { narrow = it },
        tagKey = "room"
    )
    PantrixToolbar(
        start = listOf(
            ToolbarItem.Menu(
                key = "format",
                label = FORMATS.getValue(format),
                items = FORMATS.map { (key, name) ->
                    ToolbarMenuItem(key = key, label = name, onClick = { format = key }, selected = key == format)
                },
                priority = 2,
                contentDescription = "The document's format"
            ),
            ToolbarItem.Divider(key = "line"),
            ToolbarItem.Button(
                key = "validate",
                label = "Validate",
                onClick = { said = "Validated" },
                contentDescription = "Validate the document"
            )
        ),
        menuItems = listOf(
            ToolbarMenuItem(
                key = "share",
                label = "Share",
                onClick = { said = "Shared" },
                icon = PantrixIcons.Share
            ),
            ToolbarMenuItem(
                key = "close",
                label = "Close the document",
                onClick = { said = "Closed" },
                icon = PantrixIcons.Delete,
                destructive = true
            )
        ),
        modifier = Modifier.widthIn(max = if (narrow) 120.dp else 480.dp),
        tagKey = "editor"
    )
    PantrixText(
        text = "Format: ${FORMATS.getValue(format)}" + if (said.isEmpty()) "" else " · $said",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "format"
    )
}

private val FORMATS = linkedMapOf("json" to "JSON", "yaml" to "YAML", "toml" to "TOML")
```

### The button of the view shown

A document's views: each a button, the one shown `selected`. The selected button is drawn in Soft's pale fill whatever its variant, and a screen reader is told it is selected, as a tab is; in a narrow bar it is a checked row of the "…" menu. A button that is not selected is read as the others are.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarItem

var view by rememberSaveable { mutableStateOf("tree") }
PantrixToolbar(
    start = VIEWS.map { (key, name) ->
        ToolbarItem.Button(key = key, label = name, onClick = { view = key }, selected = key == view)
    },
    tagKey = "views"
)

private val VIEWS = linkedMapOf("tree" to "Tree", "table" to "Table", "raw" to "Raw text")
```

### Its own style and colour

In its own style: small buttons, less room between them, and a shorter line in the app's colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarColors
import com.pantrixui.components.container.toolbar.ToolbarItem
import com.pantrixui.components.container.toolbar.ToolbarStyle
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixToolbar(
    start = listOf(
        ToolbarItem.IconButton(key = "undo", icon = PantrixIcons.ArrowBack, label = "Undo", onClick = {}),
        ToolbarItem.IconButton(key = "redo", icon = PantrixIcons.ArrowForward, label = "Redo", onClick = {}),
        ToolbarItem.Divider(key = "line"),
        ToolbarItem.Button(key = "settings", label = "Settings", onClick = {}, icon = PantrixIcons.Settings)
    ),
    buttonSize = ButtonSize.Small,
    style = ToolbarStyle(gap = 2.dp, dividerHeight = 16.dp),
    colors = ToolbarColors(divider = PantrixTheme.colors.primary.color),
    tagKey = "own"
)
```

## API

### PantrixToolbar

`import com.pantrixui.components.container.toolbar.PantrixToolbar`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixToolbar(
    start: List<ToolbarItem>,
    modifier: Modifier = Modifier,
    end: List<ToolbarItem> = emptyList(),
    menuItems: List<ToolbarMenuItem> = emptyList(),
    buttonSize: ButtonSize = ButtonSize.Medium,
    contentDescription: String? = null,
    style: ToolbarStyle? = null,
    colors: ToolbarColors? = null,
    tagKey: String? = null
)
```

A row of what a screen or a part of it can do, as a document's: buttons with words, buttons with an icon, buttons that open a menu, and lines between their groups, which keeps what has no room in a menu behind a "…" button at its end.

`start` stands at the bar's start and `end` at its end, the "…" button after it. Where the bar is too narrow for all of them, the items give way one at a time, the lowest `ToolbarItem.priority` first and of two alike the later one: a button with words and an icon is drawn as its icon, a tooltip and a screen reader saying its words, and where even that has no room it goes into the menu, before the next item gives up anything. An item of a higher priority so keeps its words while one of a lower priority has room to give. In the menu each is a row with its words and icon, in the order the items are given, over `menuItems`, the rows the menu holds whatever the room; a `ToolbarItem.Menu` is one row there, which shows its own rows in the menu's place. Where nothing has folded and the menu has no rows of its own, there is no "…" button. A line between two groups is drawn only where something stands on either side of it.

The bar is one stop of Tab: the arrows move between its buttons, the "…" one with them, and Home and End go to the first and the last; Tab comes back to the one last left. A screen reader hears it as one group, named by `contentDescription`.

The bar has no fill of its own, and is as tall as its buttons: it stands in a bar or over a pane, which gives it its height and its fill. Where `end` has items it is as wide as it may be; where not, as wide as what it shows.

```kotlin
PantrixToolbar(
    start = listOf(
        ToolbarItem.Button(key = "format", label = "Format", onClick = onFormat, variant = ButtonVariant.Solid,
            priority = 3),
        ToolbarItem.Button(key = "minify", label = "Minify", onClick = onMinify, icon = PantrixIcons.Minus),
        ToolbarItem.Divider(key = "made"),
        ToolbarItem.Button(key = "convert", label = "Convert", onClick = onConvert, icon = PantrixIcons.Code)
    ),
    end = listOf(
        ToolbarItem.IconButton(key = "copy", icon = PantrixIcons.Copy, label = "Copy", onClick = onCopy,
            priority = 5)
    ),
    menuItems = listOf(ToolbarMenuItem(key = "close", label = "Close the document", onClick = onClose)),
    contentDescription = "Document",
    tagKey = "document"
)
```

Parameters:

- `start: List<ToolbarItem>`: the items at the bar's start, in order.
- `modifier: Modifier`: the bar's modifier.
- `end: List<ToolbarItem>`: the items at the bar's end, before the "…" button, in order.
- `menuItems: List<ToolbarMenuItem>`: the rows the "…" menu holds whatever the room, under the items that had none.
- `buttonSize: ButtonSize`: how large the bar's buttons are: `ButtonSize.Medium` by default.
- `contentDescription: String?`: what a screen reader calls the bar, or null for a bar it hears only the buttons of.
- `style: ToolbarStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: ToolbarColors?`: this call's own colours, where they are not the theme's.
- `tagKey: String?`: the bar's automation key: it is `Toolbar_<tagKey>`, and its items, in the bar and in the menu alike, are `Action_<key>` inside it; its "…" button is `More_actions`.

### ToolbarItem

`import com.pantrixui.components.container.toolbar.ToolbarItem`, from `com.pantrixui:components`

```kotlin
sealed class ToolbarItem
```

One thing a `PantrixToolbar` holds: a button with words, a button with an icon alone, a button that opens a menu, or a line between two groups.

Where the bar is too narrow for all of them, the items give way one at a time, the lowest `priority` first and of two alike the later one: a button with words and an icon is drawn as its icon, and where even that has no room it goes into the menu behind the bar's "…" button, before the next item gives up anything. In the menu it is a row with the same words, icon and tag.

Members:

- `key: String`: What names the item in the bar and in the menu: the same in every language, one to a bar.
- `priority: Int`: How long the item stays in the bar as room runs short: the lowest folds first.
- `tagKey: String?`: The item's automation key where it is to be another than `key`: the item is `Action_<tagKey>`, in the bar and in the menu alike, inside the tag of a bar that has a key, as `Toolbar_document.Action_format`.

#### ToolbarItem.Button

```kotlin
class Button(
    override val key: String,
    public val label: String,
    public val onClick: () -> Unit,
    public val icon: ImageVector? = null,
    public val variant: ButtonVariant = ButtonVariant.Text,
    public val enabled: Boolean = true,
    override val priority: Int = 0,
    public val contentDescription: String? = null,
    public val selected: Boolean = false,
    override val tagKey: String? = null
) : ToolbarItem()
```

A button with words, and an `icon` before them where it has one: the icon alone, its words for a tooltip and a screen reader, where the bar has no room for the words.

Parameters:

- `key: String`: What names the item in the bar and in the menu: the same in every language, one to a bar.
- `label: String`: What the button does: its words, and its name for a screen reader.
- `onClick: () -> Unit`: Called when the button is pressed, in the bar or in the menu.
- `icon: ImageVector?`: What stands before the words, and for the button where they have no room; null for a button that is only ever written, which goes into the menu where its words have no room.
- `variant: ButtonVariant`: How the button is drawn in the bar: `ButtonVariant.Text` by default; a `ButtonVariant.Destructive` one is drawn in the menu's destructive colour there.
- `enabled: Boolean`: Whether the button can be pressed now.
- `priority: Int`: How long the item stays in the bar as room runs short: the lowest folds first.
- `contentDescription: String?`: What a screen reader calls the button, in the bar and as a row of the menu, where its words alone do not say what it does; null for its `label`.
- `selected: Boolean`: Whether the button is the one in effect among buttons that each show one view, as a tab is: drawn in `ButtonVariant.Soft`'s pale fill whatever its `variant`, told to a screen reader as selected, and checked as a row of the menu. A button that is not selected is read as any other.
- `tagKey: String?`: The item's automation key where it is to be another than `key`: the item is `Action_<tagKey>`, in the bar and in the menu alike, inside the tag of a bar that has a key, as `Toolbar_document.Action_format`.

#### ToolbarItem.IconButton

```kotlin
class IconButton(
    override val key: String,
    public val icon: ImageVector,
    public val label: String,
    public val onClick: () -> Unit,
    public val enabled: Boolean = true,
    override val priority: Int = 0,
    override val tagKey: String? = null
) : ToolbarItem()
```

A button with an icon alone, its `label` for a tooltip and a screen reader, and the row's words in the menu.

Parameters:

- `key: String`: What names the item in the bar and in the menu: the same in every language, one to a bar.
- `icon: ImageVector`: What stands for what the button does.
- `label: String`: What the button does, in a word or two.
- `onClick: () -> Unit`: Called when the button is pressed, in the bar or in the menu.
- `enabled: Boolean`: Whether the button can be pressed now.
- `priority: Int`: How long the item stays in the bar as room runs short: the lowest folds first.
- `tagKey: String?`: The item's automation key where it is to be another than `key`: the item is `Action_<tagKey>`, in the bar and in the menu alike, inside the tag of a bar that has a key, as `Toolbar_document.Action_format`.

#### ToolbarItem.Menu

```kotlin
class Menu(
    override val key: String,
    public val label: String,
    public val items: List<ToolbarMenuItem>,
    public val icon: ImageVector? = null,
    public val variant: ButtonVariant = ButtonVariant.Text,
    public val enabled: Boolean = true,
    override val priority: Int = 0,
    public val contentDescription: String? = null,
    override val tagKey: String? = null
) : ToolbarItem()
```

A button that opens a menu of `items`: a choice among several, as a document's format, with a chevron after its words. In the bar's menu it is one row, which shows the items in the menu's place, under a row that goes back.

Parameters:

- `key: String`: What names the item in the bar and in the menu: the same in every language, one to a bar.
- `label: String`: What the button says: the choice in effect, or what the menu is for.
- `items: List<ToolbarMenuItem>`: The rows of its menu, in order.
- `icon: ImageVector?`: What stands for the button where its words have no room; null for a button that goes into the bar's menu then.
- `variant: ButtonVariant`: How the button is drawn in the bar: `ButtonVariant.Text` by default.
- `enabled: Boolean`: Whether the button can be pressed now.
- `priority: Int`: How long the item stays in the bar as room runs short: the lowest folds first.
- `contentDescription: String?`: What a screen reader calls the button, in the bar and as a row of the menu: the choice in effect and what pressing changes, `Format: JSON. Change the format`, where its words say the choice alone; null for its `label`.
- `tagKey: String?`: The item's automation key where it is to be another than `key`: the item is `Action_<tagKey>`, in the bar and in the menu alike, inside the tag of a bar that has a key, as `Toolbar_document.Action_format`.

#### ToolbarItem.Divider

```kotlin
class Divider(override val key: String) : ToolbarItem()
```

A line between two groups of a bar. It is drawn only where something stands on either side of it, and never goes into the menu.

Parameters:

- `key: String`: What names the item in the bar and in the menu: the same in every language, one to a bar.

### ToolbarMenuItem

`import com.pantrixui.components.container.toolbar.ToolbarMenuItem`, from `com.pantrixui:components`

```kotlin
class ToolbarMenuItem(
    public val key: String,
    public val label: String,
    public val onClick: () -> Unit,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val selected: Boolean = false,
    public val destructive: Boolean = false,
    public val tagKey: String? = null
)
```

A row of a menu a `PantrixToolbar` opens: of a `ToolbarItem.Menu`, or of the bar's own "…" menu, which holds it whatever the room.

Parameters:

- `key: String`: What names the row: the same in every language, one to a menu.
- `label: String`: What the row does, in a word or two.
- `onClick: () -> Unit`: Called when the row is chosen, after the menu has been asked to close.
- `icon: ImageVector?`: What stands before the words.
- `enabled: Boolean`: Whether the row can be chosen now.
- `selected: Boolean`: Whether the row is the choice in effect among rows that each choose one thing: a check stands at its end, and a screen reader is told it is selected.
- `destructive: Boolean`: Whether the row deletes or undoes something that cannot be had back: drawn in the menu's destructive colour.
- `tagKey: String?`: The row's automation key where it is to be another than `key`: the row is `MenuItem_<tagKey>` inside the menu's tag.

### ToolbarStyle

`import com.pantrixui.components.container.toolbar.ToolbarStyle`, from `com.pantrixui:components`

```kotlin
class ToolbarStyle(
    public val gap: Dp = Dp.Unspecified,
    public val dividerHeight: Dp = Dp.Unspecified
) : PantrixStyle<ToolbarStyle>
```

`PantrixToolbar`'s geometry: the room between two of its items and how tall a line between two groups is. A bar used by touch has less room between its buttons, which take the platform's touch target, and taller lines.

Parameters:

- `gap: Dp`: The room between two items, and between the last item and the "…" button.
- `dividerHeight: Dp`: How tall a `ToolbarItem.Divider` is drawn.

### ToolbarColors

`import com.pantrixui.components.container.toolbar.ToolbarColors`, from `com.pantrixui:components`

```kotlin
data class ToolbarColors(
    public val divider: Color = Color.Unspecified
)
```

A `PantrixToolbar`'s own colours, where they are not the theme's. The bar has no fill of its own, and its buttons are drawn in their variants' colours.

Parameters:

- `divider: Color`: The line between two groups: the theme's `divider`.
