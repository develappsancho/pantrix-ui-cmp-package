# Menu

A list of actions for one element, in a panel that opens beside it: what a "more" button opens, or the actions of a row. There is no scrim, and the page stays in view around it; the panel sits beside its anchor (`anchor`) and follows it as the content moves.

The menu does not close itself. Choosing a row, a press outside, back and Escape call `onDismissRequest`; it is the caller that closes the menu, by setting `visible` to false. The `onClick` of the row that was chosen is called after the menu has been asked to close: a row says only what it does, and gives no thought to closing the menu. The first press outside only closes it: what is under it is not pressed.

- `PantrixMenu` (`com.pantrixui.components.overlay.menu`, `com.pantrixui:components`): A list of actions for one element, in a panel beside it; the arrows walk its rows, a row that is chosen asks it to close, and so do a press outside, Escape and back. Keywords: dropdown menu, context menu, overflow menu, more actions, popup menu, kebab menu.

## Features

- **Rows.** `PantrixMenuItem` takes a label, an icon before it (`icon`), a shortcut at its end (`shortcut`) and a second, smaller line under it (`supportingText`, its type `supportingTextStyle`). A `PantrixDivider` goes between groups.
- **A row that deletes, and one that cannot be chosen.** `destructive` draws the label and the icon in the menu's destructive colour: the theme's `danger` colour unless another is given. `enabled = false` draws the row faded: it takes no press and no focus.
- **Side and alignment.** `side` says which side of the anchor the panel opens on, and `alignment` how it lines up along that side: unless told otherwise it is below the anchor, hanging from its start edge. Where the side asked for has no room it takes the opposite side.
- **Inside the window.** The panel never comes closer than the style's `margin` to the edges of the window, its system bars or the keyboard: at an anchor near an edge it shifts inwards.
- **Width and height.** The panel is as wide as its longest row, between the style's narrowest and widest widths; a longer label is cut at one line. More rows than fit the tallest height scroll inside the panel.
- **Keyboard.** When the menu is opened by the keyboard, the focus is on its first row. The arrow keys walk the rows and go round from the last to the first, Home and End go to the first row and the last, and Tab walks the rows as well; Enter and the space bar choose the row, and Escape closes the menu. Once it has closed, the focus is back on the control that opened it. While the menu is open the page under it shows no focus.
- **Touch and mouse.** When the menu is opened by a touch or a click, no row shows the focus; the first arrow key, Home or End brings the keyboard into use. The row a mouse is over is filled faintly.
- **Colours and style.** `colors` (`MenuColors`) gives the colour of the panel and of its rows, and `style` (`MenuStyle`) the corners, the widths, the tallest height and a row's dimensions. Only the fields that are set change, and the rest stay the theme's.
- **Platforms.** The menu looks the same on every platform; what differs is in the style. The style's row height is 48 dp on Android, 44 on iOS, and 32 on desktop and the web; a row is never shorter than the platform's touch target.
- **Screen reader.** The icon is not read: a screen reader is told the row's label alone. A shortcut is shown and read out, but never bound: binding the keys is the app's job.
- **Chosen row.** Among rows that each choose one thing, a language or an order, the one in effect is `selected`: a check stands at its end, in the label's colour, and a screen reader is told it is selected.
- **A sheet in a narrow window.** `presentation`'s default is `OverlayPresentation.Adaptive`: in a narrow (`Compact`) window the menu is a sheet from the bottom, in a wider one a panel beside the anchor. In the sheet the rows are as wide as the sheet and as tall as the touch target, there is no title, and a drag down closes it; on a platform used by touch the shortcuts are not written. `Popover` and `Sheet` choose one of the two in every window. It is chosen as the menu opens, and does not change until it closes.

## Usage

### The actions of a row, from a more button

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixIconButton(
            imageVector = PantrixIcons.MoreHorizontal,
            contentDescription = stringResource(Res.string.more),
            onClick = { open = true },
            tagKey = "more"
        )
    },
    tagKey = "row_actions"
) {
    PantrixMenuItem(text = stringResource(Res.string.rename), onClick = onRename, tagKey = "rename")
    PantrixMenuItem(text = stringResource(Res.string.duplicate), onClick = onDuplicate, tagKey = "duplicate")
    PantrixDivider()
    PantrixMenuItem(
        text = stringResource(Res.string.delete),
        onClick = onDelete,
        destructive = true,
        tagKey = "delete"
    )
}
```

### Icons and shortcuts, hanging from the end of a button

```kotlin
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = { PantrixButton(text = stringResource(Res.string.file), onClick = { open = true }, tagKey = "file") },
    alignment = PopoverAlignment.End,
    tagKey = "file"
) {
    PantrixMenuItem(
        text = stringResource(Res.string.search),
        onClick = onSearch,
        icon = PantrixIcons.Search,
        shortcut = "Ctrl+F",
        tagKey = "search"
    )
    PantrixMenuItem(
        text = stringResource(Res.string.refresh),
        onClick = onRefresh,
        icon = PantrixIcons.Refresh,
        shortcut = "F5",
        enabled = online,
        tagKey = "refresh"
    )
}
```

## Examples

### Row actions

At its plainest: a file's "more" button opens the menu. Whether the menu is open is the screen's state (`visible`). The menu does not close itself: when it wants to close it calls `onDismissRequest`, and it is this code that sets `visible` to false. The row that deletes is under a `PantrixDivider` and, with `destructive`, in the theme's `danger` colour.

Pick a row: the menu is first asked to close, then the row's `onClick` is called; the card's "Last event" line says what happened last. A press outside, back and Escape only close it. When the menu is opened by the keyboard, the focus is on its first row; once it has closed, the focus is back on the button.

The rows of a menu given a `tagKey` are named inside it for automation: the test tag of the "Delete" row here is `Menu_row_actions.MenuItem_delete`, and it cannot be mixed up with another menu's "Delete" row.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Report.pdf")
    PantrixMenu(
        visible = open,
        onDismissRequest = {
            open = false
            report("File actions closed")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "Actions for Report.pdf",
                onClick = { open = true },
                tagKey = "open_row_actions"
            )
        },
        tagKey = "row_actions"
    ) {
        PantrixMenuItem(
            text = "Rename",
            onClick = { report("Rename chosen") },
            tagKey = "rename"
        )
        PantrixMenuItem(text = "Duplicate", onClick = { report("Duplicate chosen") }, tagKey = "duplicate")
        PantrixDivider()
        PantrixMenuItem(text = "Delete", onClick = { report("Delete chosen") }, destructive = true, tagKey = "delete")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Icon and shortcut

`icon` draws an icon before the label: in the label's colour and at the style's icon size. The icon is a picture of what the label says; a screen reader reads the label alone. `shortcut` shows the keys that do the same thing at the end of the row. A shortcut is only shown and read out: binding the keys is the app's job.

`enabled = false` draws the row faded: "Move to folder" takes no press, and the keyboard skips it. `destructive` draws both the label and the icon in the destructive colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixMenu(
    visible = open,
    onDismissRequest = {
        open = false
        report("File menu closed")
    },
    anchor = {
        PantrixButton(
            text = "File",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_file"
        )
    },
    tagKey = "file"
) {
    PantrixMenuItem(
        text = "Search",
        onClick = { report("Search chosen") },
        icon = PantrixIcons.Search,
        shortcut = "Ctrl+F",
        tagKey = "search"
    )
    PantrixMenuItem(
        text = "Refresh",
        onClick = { report("Refresh chosen") },
        icon = PantrixIcons.Refresh,
        shortcut = "F5",
        tagKey = "refresh"
    )
    PantrixMenuItem(
        text = "Move to folder",
        onClick = { report("Move to folder chosen") },
        icon = PantrixIcons.Folder,
        enabled = false,
        tagKey = "move"
    )
    PantrixDivider()
    PantrixMenuItem(
        text = "Delete",
        onClick = { report("Delete chosen") },
        icon = PantrixIcons.Close,
        shortcut = "Del",
        destructive = true,
        tagKey = "delete"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Chosen row

A menu whose rows each choose one thing: the list's order. The one in effect is `selected`: a check stands at its end, in the label's colour, and a screen reader is told it is selected. Choose another order: the check moves to its row, and the button writes the new order.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem

var open by rememberSaveable { mutableStateOf(false) }
var order by rememberSaveable { mutableStateOf("newest") }
val orders = listOf("newest" to "Newest first", "oldest" to "Oldest first", "name" to "By name")
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Sort: ${orders.first { it.first == order }.second}",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_order"
        )
    },
    tagKey = "order"
) {
    orders.forEach { (key, label) ->
        PantrixMenuItem(text = label, onClick = { order = key }, tagKey = key, selected = order == key)
    }
}
```

### Second line

`supportingText` puts a second, smaller line under the label: what the choice leads to. Here, under each language, the site's address in it, set in the code type (`supportingTextStyle`); its colour is the row's. The row grows to hold it; a screen reader hears the second line after the label. The second line runs to two lines at the most, and the rest is cut.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var chosen by rememberSaveable { mutableIntStateOf(0) }
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Language: ${LANGUAGES[chosen].first}",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_language"
        )
    },
    tagKey = "language"
) {
    LANGUAGES.forEachIndexed { index, (name, address) ->
        PantrixMenuItem(
            text = name,
            onClick = { chosen = index },
            selected = index == chosen,
            tagKey = "language_$index",
            supportingText = address,
            supportingTextStyle = PantrixTheme.typography.code
        )
    }
}

private val LANGUAGES = listOf(
    "Türkçe" to "pantrixui.com/tr",
    "English" to "pantrixui.com/en",
    "العربية" to "pantrixui.com/ar"
)
```

### Side and alignment

`side` says which side of the anchor the panel opens on, and `alignment` how it lines up along that side. Unless told otherwise the menu is below its anchor and hangs from the anchor's start edge: `PopoverSide.Bottom` and `PopoverAlignment.Start`. The two enums are the popover's; the menu shares them.

Start and End follow the reading direction: in a left-to-right layout Start is the left. While the panel is beside the anchor (Start or End) the alignment is vertical: Start makes the top edges meet, and End the bottom edges.

Where the side asked for has no room the menu takes the opposite side: pick Top and open the menu while the button is near the top edge of the window. With room on neither side the menu keeps the side asked for and slides inside the window, over its anchor.

`presentation = OverlayPresentation.Popover`: the menu is a panel in a narrow window too, not a sheet; its side and alignment show on a phone as well.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverSide

var open by rememberSaveable { mutableStateOf(false) }
var side by rememberSaveable { mutableStateOf(PopoverSide.Bottom) }
var alignment by rememberSaveable { mutableStateOf(PopoverAlignment.Start) }
val report = LocalExampleEvents.current
PantrixSegmentButton(options = SIDES, selected = side, onSelect = { side = it }, tagKey = "menu_side")
PantrixSegmentButton(
    options = ALIGNMENTS,
    selected = alignment,
    onSelect = { alignment = it },
    tagKey = "menu_alignment"
)
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
    PantrixMenu(
        visible = open,
        onDismissRequest = {
            open = false
            report("Menu closed")
        },
        anchor = {
            PantrixButton(
                text = "Open",
                onClick = { open = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_placed_menu"
            )
        },
        side = side,
        alignment = alignment,
        tagKey = "placed_menu",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(text = "side = ${side.name}", onClick = { report("Side row chosen") }, tagKey = "side")
        PantrixMenuItem(
            text = "alignment = ${alignment.name}",
            onClick = { report("Alignment row chosen") },
            tagKey = "alignment"
        )
    }
}

private val SIDES = listOf(
    SegmentOption(value = PopoverSide.Top, label = "Top", tagKey = "top"),
    SegmentOption(value = PopoverSide.Bottom, label = "Bottom", tagKey = "bottom"),
    SegmentOption(value = PopoverSide.Start, label = "Start", tagKey = "start"),
    SegmentOption(value = PopoverSide.End, label = "End", tagKey = "end")
)

private val ALIGNMENTS = listOf(
    SegmentOption(value = PopoverAlignment.Start, label = "Start", tagKey = "start"),
    SegmentOption(value = PopoverAlignment.Center, label = "Centre", tagKey = "center"),
    SegmentOption(value = PopoverAlignment.End, label = "End", tagKey = "end")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### At the edge

A "more" button near the end edge of the window. A menu hangs from the start edge of its anchor; with the button near the edge, the panel would run out of the window. It does not: it shifts to stay the style's `margin` in from the edge. In a narrow window the menu would be a sheet; `presentation = OverlayPresentation.Popover` keeps it a panel in every window.

Try it in a narrow window: the one to narrow is the app's own window. A menu picks its place by the real window, not by the window a card's window selector gives its example; that is why this card has no such selector. In a window that is wide enough there is room for the panel beside the card; there the panel does not shift, and hangs from the start edge of the button.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
    PantrixMenu(
        visible = open,
        onDismissRequest = {
            open = false
            report("Menu at the edge closed")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "Folder actions",
                onClick = { open = true },
                tagKey = "open_edge"
            )
        },
        tagKey = "edge",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(
            text = "Share folder",
            onClick = { report("Share folder chosen") },
            icon = PantrixIcons.Person,
            tagKey = "share"
        )
        PantrixMenuItem(
            text = "Add to favourites",
            onClick = { report("Add to favourites chosen") },
            icon = PantrixIcons.Star,
            tagKey = "favourite"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A long list

Thirty rows do not fit the style's tallest height (`MenuStyle.maxHeight`): the panel stays at that height and the rows scroll inside it. On the keyboard End goes to the last row and Home to the first; a row that takes the focus comes into view.

`presentation = OverlayPresentation.Popover`: a panel in a narrow window too. In a sheet the rows scroll inside the sheet, which is as tall as the window at the most.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixMenu(
    visible = open,
    onDismissRequest = {
        open = false
        report("Version menu closed")
    },
    anchor = {
        PantrixButton(
            text = "Choose a version",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_versions"
        )
    },
    tagKey = "versions",
    presentation = OverlayPresentation.Popover
) {
    (30 downTo 1).forEach { number ->
        PantrixMenuItem(
            text = "Version $number.0",
            onClick = { report("Version $number.0 chosen") },
            tagKey = "version_$number"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Width

The panel is as wide as its longest row, between the style's narrowest and widest widths (`MenuStyle.minWidth` and `maxWidth`). The labels of the "Short" menu are shorter than the narrowest width: the panel stays at that width. The first label of the "Long" menu does not fit the widest panel: it is cut at one line.

`presentation = OverlayPresentation.Popover`: a sheet is as wide as the window; both menus are panels so that the panel's width shows in a narrow window too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.theme.PantrixTheme

var narrow by rememberSaveable { mutableStateOf(false) }
var wide by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixMenu(
        visible = narrow,
        onDismissRequest = {
            narrow = false
            report("Short menu closed")
        },
        anchor = {
            PantrixButton(
                text = "Short",
                onClick = { narrow = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_narrow"
            )
        },
        tagKey = "narrow",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(text = "Open", onClick = { report("Open chosen") }, tagKey = "open")
        PantrixMenuItem(text = "Delete", onClick = { report("Delete chosen") }, tagKey = "delete")
    }
    PantrixMenu(
        visible = wide,
        onDismissRequest = {
            wide = false
            report("Long menu closed")
        },
        anchor = {
            PantrixButton(
                text = "Long",
                onClick = { wide = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_wide"
            )
        },
        tagKey = "wide",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(
            text = "Open Report.pdf for editing together with everyone in the shared folder",
            onClick = { report("Long row chosen") },
            tagKey = "long"
        )
        PantrixMenuItem(text = "Copy", onClick = { report("Copy chosen") }, tagKey = "copy")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Its own style

`style` changes this menu's geometry alone: the fields of `MenuStyle` that are set change, and the rest comes from the theme's and the platform's style. Here the panel's corners are the theme's large corner (`ShapeRole.Large`), the panel is at least 240dp wide, its rows are 56dp tall and their icons 28dp.

The style given to a menu draws its rows too; `PantrixMenuItem` takes no style of its own. The width and the height that are given scale with the theme's density; the corners and the icon's size do not.

`presentation = OverlayPresentation.Popover`: a sheet's corners and width are the sheet's, and there the panel's style draws only the rows; the menu is a panel so that the style shows in a narrow window too.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.MenuStyle
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Account",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_account"
        )
    },
    style = MenuStyle(shape = ShapeRole.Large, minWidth = 240.dp, itemHeight = 56.dp, iconSize = 28.dp),
    tagKey = "account",
    presentation = OverlayPresentation.Popover
) {
    PantrixMenuItem(text = "Profile", onClick = {}, icon = PantrixIcons.Person, tagKey = "profile")
    PantrixMenuItem(text = "Inbox", onClick = {}, icon = PantrixIcons.Inbox, tagKey = "inbox")
    PantrixMenuItem(text = "Favourites", onClick = {}, icon = PantrixIcons.Star, tagKey = "favourites")
}
```

### Its own colours

`colors` gives the menu the colours that are set in place of the theme's: here the app's own purple, which is in none of the theme's roles. Only the fields of `MenuColors` that are set change, and the rest stay the theme's: the row that deletes is still in the theme's `danger` colour.

The theme's secondary and disabled text colours are for the theme's own grounds alone. On this fill the shortcut is drawn in the row's colour, and a row that cannot be chosen in a share of that colour. The line between the groups is given no colour: on the fill it too is a share of the row's colour.

On a fill that no role has, `content` is given too: the theme does not know what reads on that fill. Where the fill is the colour of one of the theme's roles, such as `PantrixTheme.colors.primary.container`, the rows take the colour the theme pairs with it by themselves.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.overlay.menu.MenuColors
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixMenu(
    visible = open,
    onDismissRequest = {
        open = false
        report("Pro menu closed")
    },
    anchor = {
        PantrixButton(
            text = "Pro",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_pro_menu"
        )
    },
    colors = MenuColors(container = own.container, content = own.onContainer, border = own.color),
    tagKey = "pro_menu"
) {
    PantrixMenuItem(
        text = "Upgrade plan",
        onClick = { report("Upgrade plan chosen") },
        icon = PantrixIcons.Star,
        shortcut = "Ctrl+U",
        tagKey = "upgrade"
    )
    PantrixMenuItem(
        text = "Invoices",
        onClick = { report("Invoices chosen") },
        icon = PantrixIcons.Folder,
        enabled = false,
        tagKey = "invoices"
    )
    PantrixDivider()
    PantrixMenuItem(
        text = "End subscription",
        onClick = { report("End subscription chosen") },
        icon = PantrixIcons.Close,
        destructive = true,
        tagKey = "cancel_plan"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.
- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### In a part in another theme

A part in the opposite colours of the page, and a menu opened from inside it. The part is a second theme (`PantrixTheme(darkTheme = …)`): dark on a light page, light on a dark one. The menu is called inside that theme, so it is in that theme's colours: though its panel is composed in a layer of its own at the root of the window, it carries the theme of the place it was called from.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixMenu(
                visible = open,
                onDismissRequest = {
                    open = false
                    report("The part's menu closed")
                },
                anchor = {
                    PantrixButton(
                        text = "Open from this part",
                        onClick = { open = true },
                        tagKey = "open_menu_in_part"
                    )
                },
                tagKey = "menu_in_part"
            ) {
                PantrixMenuItem(
                    text = "Refresh this part",
                    onClick = { report("Refresh this part chosen") },
                    icon = PantrixIcons.Refresh,
                    tagKey = "refresh_part"
                )
                PantrixMenuItem(
                    text = "Remove this part",
                    onClick = { report("Remove this part chosen") },
                    icon = PantrixIcons.Close,
                    destructive = true,
                    tagKey = "remove_part"
                )
            }
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### In a dialog

A menu opened from inside a dialog. The menu is above the dialog, in a layer of its own: Escape and back close the menu first, and the dialog the next time. A press outside the menu but inside the dialog also closes the menu alone.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem

var dialog by rememberSaveable { mutableStateOf(false) }
var menu by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "File details…",
    onClick = { dialog = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_file_dialog"
)
PantrixDialog(
    visible = dialog,
    onDismissRequest = {
        dialog = false
        report("File details closed")
    },
    title = "Report.pdf",
    message = "2,4 MB. Modified yesterday.",
    actions = {
        PantrixButton(
            text = "Close",
            onClick = {
                dialog = false
                report("File details closed")
            },
            variant = ButtonVariant.Text,
            tagKey = "close_file_dialog"
        )
    },
    tagKey = "file_dialog"
) {
    PantrixMenu(
        visible = menu,
        onDismissRequest = {
            menu = false
            report("Share menu closed")
        },
        anchor = {
            PantrixButton(
                text = "Share",
                onClick = { menu = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_share"
            )
        },
        tagKey = "share"
    ) {
        PantrixMenuItem(
            text = "Copy link",
            onClick = { report("Copy link chosen") },
            tagKey = "copy_link"
        )
        PantrixMenuItem(
            text = "Send by email",
            onClick = { report("Send by email chosen") },
            tagKey = "send_mail"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A sheet in a narrow window

The same menu by the window's width: pick "Narrow" in the card's window selector and the menu opens as a sheet from the bottom; in "Wide" it is a panel beside the button. In the sheet the rows are as wide as the sheet, a drag down or a press on the scrim closes it, and "Delete" stays red. On Android and iOS the shortcuts are not written in the sheet: there are no keys to press.

The menu is chosen as it opens: while it is open the sheet stays a sheet and the panel a panel, even if the window changes; the next opening goes by the new window. This is the default; `presentation = OverlayPresentation.Adaptive` is written only so that it shows.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
// The card's window is as tall as the example: the example is kept tall so that a sheet opened in a narrow window has room.
Column(Modifier.fillMaxWidth().height(280.dp)) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = "Slides.key")
        PantrixMenu(
            visible = open,
            onDismissRequest = { open = false },
            anchor = {
                PantrixIconButton(
                    imageVector = PantrixIcons.MoreHorizontal,
                    contentDescription = "Actions for Slides.key",
                    onClick = { open = true },
                    tagKey = "open_adaptive_menu"
                )
            },
            tagKey = "adaptive_menu",
            presentation = OverlayPresentation.Adaptive
        ) {
            PantrixMenuItem(
                text = "Share",
                onClick = { report("Share chosen") },
                icon = PantrixIcons.Upload,
                shortcut = "Ctrl+Shift+S",
                tagKey = "share"
            )
            PantrixMenuItem(
                text = "Copy",
                onClick = { report("Copy chosen") },
                icon = PantrixIcons.Copy,
                shortcut = "Ctrl+C",
                tagKey = "copy"
            )
            PantrixDivider()
            PantrixMenuItem(
                text = "Delete",
                onClick = { report("Delete chosen") },
                destructive = true,
                tagKey = "delete"
            )
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

## API

### PantrixMenu

`import com.pantrixui.components.overlay.menu.PantrixMenu`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixMenu(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    anchor: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopoverSide = PopoverSide.Bottom,
    alignment: PopoverAlignment = PopoverAlignment.Start,
    style: MenuStyle? = null,
    colors: MenuColors? = null,
    tagKey: String? = null,
    presentation: OverlayPresentation = OverlayPresentation.Adaptive,
    content: @Composable ColumnScope.() -> Unit
)
```

A list of actions for one element, in a panel beside it: what a "more" button opens, or the actions of a row.

It is anchored, not modal: nothing is dimmed, the app stays in view around it, and the panel follows its anchor as the content moves. It sits on `side` of the anchor, lined up as `alignment` says, while the window has room for it there, and takes the opposite side otherwise, never closer than the style's margin to the edges of the window, its system bars or the keyboard. It is as wide as its longest row, between the style's narrowest and widest, and more rows than fit its tallest height scroll.

The menu never hides itself. A press outside it, Escape and back call `onDismissRequest`, and so does the choosing of a row, before the row's own `onClick`: a row says what it does and nothing about the menu. The caller sets `visible` to false. The first press outside only asks to close: what is under it is not pressed.

Opened by the keyboard it takes the focus on its first row. The arrows walk the rows and go round from the last to the first, Home and End go to the first and the last, and Tab walks them as well, the rows being the only stops in the panel. Enter and the space bar choose the row, and Escape closes the menu. Opened by a touch or a click no row shows the focus, and the first of those keys brings the keyboard into use: an arrow down or Home on the first row, an arrow up or End on the last. Once the menu has closed the focus is on the anchor, on the control that opened it. While it is shown the app under it shows no focus, as under a dialog.

It looks the same on every platform; what differs is in `MenuStyle`: the corners, the widths, the shadow and the rows' height.

**In a narrow window it is a sheet** (`presentation`): on a phone a panel beside a button is small under a finger, and a sheet from the bottom edge is within the thumb's reach. The rows are as wide as the sheet and as tall as the platform's touch target, there is no title, and a drag down or a press on the scrim closes it as anything outside the panel does. A destructive row keeps its colour; a shortcut is not written where the platform is used by touch, which has no keys to press. The keyboard walks the rows as in the panel.

Parameters:

- `visible: Boolean`: whether the menu is shown. It enters and leaves with the theme's motion.
- `onDismissRequest: () -> Unit`: called for a press outside, Escape, back and a row that is chosen. The menu stays until `visible` is false.
- `anchor: @Composable () -> Unit`: the control the menu belongs to, laid out where this is called and as that place asks: usually the button that opens it.
- `modifier: Modifier`: applied to the panel, inside its layer. Not to the anchor.
- `side: PopoverSide`: the side of the anchor the panel prefers. `PopoverSide.Start` and `PopoverSide.End` follow the layout direction.
- `alignment: PopoverAlignment`: how the panel lines up with the anchor along that side: from its start edge unless told otherwise, as a menu hangs from what opened it.
- `style: MenuStyle?`: this call's own style, which its rows are drawn with too: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: MenuColors?`: this call's own colours, its rows' among them. Only the ones it sets change; the rest stay the theme's.
- `tagKey: String?`: a locale-independent key for automation: the panel's tag is `Menu_<tagKey>`, and its rows are named inside it, `Menu_<tagKey>.MenuItem_<row's key>`. A menu shown as a sheet has the same tags, on the sheet.
- `presentation: OverlayPresentation`: how the menu is shown: a sheet in a narrow window and a panel beside its anchor in a wider one, by default; always the panel, or always the sheet. Chosen as the menu opens, it stays until it has closed.
- `content: @Composable ColumnScope.() -> Unit`: the rows: `PantrixMenuItem`s, with a `PantrixDivider` between groups of them. Given no colour, that line is told by the rows' colour on a fill, as the panel's hairline is.

### PantrixMenuItem

`import com.pantrixui.components.overlay.menu.PantrixMenuItem`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixMenuItem(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    shortcut: String? = null,
    enabled: Boolean = true,
    destructive: Boolean = false,
    tagKey: String? = null,
    selected: Boolean = false,
    supportingText: String? = null,
    supportingTextStyle: TextStyle = PantrixTheme.typography.footnote
)
```

One action in a `PantrixMenu`: a label, an optional icon before it and an optional shortcut after it. Among rows that each choose one thing, a language or an order, the one in effect is `selected`, with a check at its end.

Choosing it asks the menu to close and then calls `onClick`. It is at least as tall as the style's row and as the platform's touch target, and its label is cut at one line where the panel is at its widest.

Parameters:

- `text: String`: what the action does, in a word or two.
- `onClick: () -> Unit`: called when the row is chosen, after the menu has been asked to close.
- `modifier: Modifier`: applied to the row.
- `icon: ImageVector?`: drawn before the label, at the style's icon size and in the label's colour. A picture of what the label says: a screen reader is told the label alone.
- `shortcut: String?`: the keys that do the same thing, such as "Ctrl+K", after the label. It is shown and read out, never bound: binding the keys is the app's.
- `enabled: Boolean`: whether the row can be chosen. One that cannot takes no press and no focus, and reports nothing.
- `destructive: Boolean`: draws the label and the icon in the menu's destructive colour, for an action that deletes or cannot be undone.
- `tagKey: String?`: a locale-independent key for automation: the row's tag is `MenuItem_<tagKey>`, inside the tag of a menu that has a key of its own.
- `selected: Boolean`: whether the row is the choice in effect among rows that each choose one thing: a check stands at its end, in the label's colour, and a screen reader is told it is selected.
- `supportingText: String?`: a second line under the label, smaller and in the shortcut's quieter colour: what the choice leads to, as a language's address under its name. The row grows to hold it, and a screen reader hears it after the label. It is cut at two lines.
- `supportingTextStyle: TextStyle`: the type `supportingText` is set in: the theme's `footnote` unless given. Its colour stays the row's, quieter than the label and the disabled colour on a row that cannot be chosen.

### PopoverSide

`import com.pantrixui.components.overlay.popover.PopoverSide`, from `com.pantrixui:components`

```kotlin
enum class PopoverSide
```

Which side of its anchor a popover prefers. It takes the opposite side where the window has no room for it.

Entries:

- `Top`: Over the anchor.
- `Bottom`: Under the anchor.
- `Start`: The start edge: the left in a left-to-right layout, the right in a right-to-left one.
- `End`: The end edge: the right in a left-to-right layout, the left in a right-to-left one.

### PopoverAlignment

`import com.pantrixui.components.overlay.popover.PopoverAlignment`, from `com.pantrixui:components`

```kotlin
enum class PopoverAlignment
```

How a popover lines up with its anchor along the side it sits on.

Entries:

- `Start`: Their start edges meet, or their top edges where the popover is beside its anchor.
- `Center`: Centred on the anchor.
- `End`: Their end edges meet, or their bottom edges where the popover is beside its anchor.

### MenuStyle

`import com.pantrixui.components.overlay.menu.MenuStyle`, from `com.pantrixui:components`

```kotlin
class MenuStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val itemHeight: Dp = Dp.Unspecified,
    public val itemHorizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified
) : PantrixStyle<MenuStyle>
```

`PantrixMenu`'s geometry: the panel it draws, how far that sits from its anchor and from the edges of the window, and the rows in it.

The air follows density: the gap, the margin, the padding above the first row and below the last, a row's height and the padding and the gap inside it, and the narrowest width. The widest width, the tallest height, the corners, the shadow and the icon do not. A row is never shorter than the platform's touch target, whatever the density. A menu's colours are not part of its style: they are the theme's, and `MenuColors` where a call has its own.

Parameters:

- `shape: ShapeSpec`: The panel's corners: medium on Android and iOS, small on desktop and the web.
- `minWidth: Dp`: The narrowest the panel gets, however short its labels.
- `maxWidth: Dp`: The widest the panel gets: a longer label is cut short.
- `maxHeight: Dp`: The tallest the panel gets: more rows than fit scroll.
- `elevation: Dp`: How high the panel floats over the app, which is how large its shadow is.
- `gap: Dp`: Between the anchor and the panel.
- `margin: Dp`: Kept clear between the panel and the edges of the window, and of what covers the window there: a system bar, a cutout, the keyboard.
- `verticalPadding: Dp`: Above the first row and below the last.
- `itemHeight: Dp`: The least a row is tall, where the platform's touch target is not taller.
- `itemHorizontalPadding: Dp`: Inside a row, before its icon and after its shortcut.
- `iconSize: Dp`: A row's icon.
- `iconGap: Dp`: Between a row's icon and its label, and between its label and its shortcut.

### MenuColors

`import com.pantrixui.components.overlay.menu.MenuColors`, from `com.pantrixui:components`

```kotlin
data class MenuColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val destructive: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What a `PantrixMenu` is painted with, for a call that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixMenu(…, colors = MenuColors(container = PantrixTheme.colors.primary.container))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the rows, unless `content` is given too. A fill no role has does not: what reads on it is the caller's to give, and so is a `destructive` colour that reads on it.

Parameters:

- `container: Color`: The panel's fill. The theme's `surface`.
- `content: Color`: A row's label and icon. The theme's `textPrimary`. A row's shortcut is the theme's `textSecondary` on the theme's own grounds, and this colour on a fill of the caller's.
- `destructive: Color`: The label and icon of a row that deletes or cannot be undone. The theme's `danger` colour.
- `border: Color`: The hairline around the panel, which tells it from a surface of its own colour under it, as in the dark theme, where a shadow shows little. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`: the edge a subtle button has. A transparent colour draws none.

### OverlayPresentation

`import com.pantrixui.components.overlay.common.OverlayPresentation`, from `com.pantrixui:components`

```kotlin
enum class OverlayPresentation
```

How an overlay that belongs to a control is shown: beside the control, or as a sheet from the bottom of the window.

A popover beside what was pressed suits a window with room around the control, and a pointer. On a phone the same overlay is small under a finger and hides the screen's middle; a sheet from the bottom edge is within the thumb's reach and as wide as the window.

Entries:

- `Adaptive`: A sheet in a narrow window, the `Compact` width class, and a popover in every wider one. The window is the one the overlay is shown over, not the room of a pane it was opened in, and it is asked as the overlay opens: one that is open stays as it is when the window changes, and the next one is shown by the window as it is then.
- `Popover`: A popover beside the control, in every window.
- `Sheet`: A sheet from the bottom edge of the window, in every window.
