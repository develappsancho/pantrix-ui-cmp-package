# Status Bar

The short bar at the bottom of a window or a pane that says how things stand: at its start a document's validity and size, at its end the caret's line and column and the text's encoding. Its buttons keep the bar's height and are pressed past it too.

- `PantrixStatusBar` (`com.pantrixui.components.container.statusbar`, `com.pantrixui:components`): A short bar at the bottom of a window or a pane that says how things stand, in words, buttons and things of the app's own, whose buttons are pressed past it and whose items fold into a menu. Keywords: status bar, footer bar, editor status, caret position, dense bar, bottom bar.

## Features

- **Items.** `start` and `end` are written as the items of a `StatusBarScope`: `text` words, `button` a button, `item` the app's own item, with its words for the menu.
- **Pressing.** The bar is 28dp under a pointer and 32dp on a phone and a tablet; its buttons are 24dp. A button smaller than the touch target is pressed past what it draws too, above and under the bar and in half of the room beside it. So a few dp of what stands above the bar are the button's.
- **What does not fit.** It falls into the menu of the "…" button at the end, the lowest `priority` first, and of two alike the later one; in the menu a button is a row that is pressed, words a row that is read.
- **Screen reader.** The bar is one group, named `contentDescription` or the theme's word "Status". Words given `live` are said each time they change; it is not given to what changes with every key, as a caret's place. A selected button is read as selected.
- **Diagnostics.** The diagnostics measure the room a button is pressed in, and report a button its neighbours leave less than the target as `SmallTouchTarget`.
- **Automation.** With `tagKey` the bar is `StatusBar_<tagKey>`, its items `Item_<key>` in the bar and in the menu alike, and the "…" button `More_items`.
- **Style and colour.** `StatusBarStyle` gives the height and the room at the ends and between items, `StatusBarColors` the fill, the line over the bar, the words and the selected button's colour.

## Usage

### A document's status: its validity, its size and the caret

```kotlin
PantrixStatusBar(
    start = {
        item(key = "valid", label = stringResource(Res.string.valid)) {
            PantrixTag(text = stringResource(Res.string.valid), tone = TagTone.Success, tagKey = "valid")
        }
        button(
            key = "size",
            text = stringResource(Res.string.size, size),
            onClick = onSummary,
            selected = summaryShown,
            priority = 1
        )
    },
    end = {
        text(key = "caret", text = stringResource(Res.string.line_column, line, column), priority = 2)
        text(key = "layout", text = "UTF-8 · LF")
    },
    tagKey = "document"
)
```

### What a reader waits on, said when it changes

```kotlin
PantrixStatusBar(
    start = {
        text(key = "saved", text = stringResource(if (saved) Res.string.saved else Res.string.saving), live = true)
    },
    contentDescription = stringResource(Res.string.editor_status),
    tagKey = "editor"
)
```

## Examples

### A document's status

A document's status, at the width chosen: that it is valid, in a tag, and its size, in a button that opens its summary; at the end the caret's place and the text's layout. As the bar narrows, the text's layout falls into the "…" menu first, and then the caret's place.

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
import com.pantrixui.components.container.statusbar.PantrixStatusBar
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var width by rememberSaveable { mutableStateOf(640) }
var summary by rememberSaveable { mutableStateOf(false) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = 640, label = "640 dp", tagKey = "640"),
            SegmentOption(value = 320, label = "320 dp", tagKey = "320")
        ),
        selected = width,
        onSelect = { width = it },
        tagKey = "width"
    )
    PantrixText(
        text = if (summary) "The summary is open." else "The summary is closed: press the size.",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "summary"
    )
    PantrixStatusBar(
        start = {
            item(key = "valid", label = "Valid", priority = 3) {
                PantrixTag(text = "Valid", tone = TagTone.Success, tagKey = "valid")
            }
            button(
                key = "size",
                text = "41 lines · 742 B",
                onClick = { summary = !summary },
                selected = summary,
                contentDescription = if (summary) "Close the summary, 742 B" else "Show the summary, 742 B",
                priority = 2
            )
        },
        end = {
            text(key = "caret", text = "Ln 12, Col 4", priority = 1)
            text(key = "layout", text = "UTF-8 · LF · 2 spaces")
        },
        modifier = Modifier.widthIn(max = width.dp).fillMaxWidth(),
        tagKey = "document"
    )
}
```

### A status said when it changes

A status the reader waits on: "Saving…" while it saves, "Saved" when it is done. Since it is given `live`, a screen reader says each change. The bar's name here is "Editor status".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.statusbar.PantrixStatusBar
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

var saving by rememberSaveable { mutableStateOf(false) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(text = if (saving) "Finish" else "Save", onClick = { saving = !saving }, tagKey = "save")
    PantrixStatusBar(
        start = { text(key = "saved", text = if (saving) "Saving…" else "Saved", live = true) },
        contentDescription = "Editor status",
        tagKey = "editor"
    )
}
```

### Its own style and colours

In its own style and colours: a lower bar, the app's fill and line, and the selected button's colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.statusbar.PantrixStatusBar
import com.pantrixui.components.container.statusbar.StatusBarColors
import com.pantrixui.components.container.statusbar.StatusBarStyle
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixStatusBar(
    start = {
        button(key = "branch", text = "main", onClick = {}, selected = true)
        text(key = "changes", text = "3 changes")
    },
    end = { text(key = "time", text = "14:32") },
    style = StatusBarStyle(height = 24.dp, gap = 12.dp),
    colors = StatusBarColors(
        container = colors.primary.container,
        line = colors.primary.color,
        content = colors.primary.onContainer,
        selected = colors.primary.onContainer
    ),
    tagKey = "own"
)
```

## API

### PantrixStatusBar

`import com.pantrixui.components.container.statusbar.PantrixStatusBar`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixStatusBar(
    start: StatusBarScope.() -> Unit,
    modifier: Modifier = Modifier,
    end: StatusBarScope.() -> Unit = {},
    contentDescription: String? = null,
    style: StatusBarStyle? = null,
    colors: StatusBarColors? = null,
    tagKey: String? = null
)
```

The bar at the bottom of a window or of a pane that says how things stand: a document's validity and size at its start, the caret's line and column and the text's encoding at its end. Its buttons keep its height, short as it is, and are pressed past it.

`start` stands at the bar's start and `end` at its end, each written as the items of a `StatusBarScope`, in order. Where the bar is too narrow for them all, the lowest priority goes into the menu behind a "…" button at its end first, and of two alike the later one; in the menu each is a row, a button's pressed as in the bar.

The bar is 28dp tall under a pointer and 32dp on a phone and a tablet, its buttons 24dp. A button narrower or shorter than the platform's touch target is pressed past what it draws, up to that target: above and under the bar, and into half of the room on either side of it. Its press therefore reaches a few dp over what stands above the bar, which a press there gives to the button; the diagnostics measure that reach, and report a button whose neighbours leave it less than the target (PantrixCheck.SmallTouchTarget). The "…" button, an icon alone, is drawn wide enough on touch that half of the room on either side of it makes up the target: 32dp on a phone.

A screen reader hears the bar as one group, named `contentDescription` or the theme's words for a status bar, and its items one by one; words given `live` are said again each time they change.

```kotlin
PantrixStatusBar(
    start = {
        item(key = "valid", label = "Valid") { PantrixTag(text = "Valid", tone = TagTone.Success) }
        button(key = "size", text = "742 B", onClick = { showSummary() })
    },
    end = {
        text(key = "caret", text = "Ln 12, Col 4", priority = 2)
        text(key = "layout", text = "UTF-8 · LF")
    },
    tagKey = "document"
)
```

Parameters:

- `start: StatusBarScope.() -> Unit`: the items at the bar's start.
- `modifier: Modifier`: the bar's modifier. The bar is as wide as it may be.
- `end: StatusBarScope.() -> Unit`: the items at the bar's end, before the "…" button.
- `contentDescription: String?`: what a screen reader calls the bar, or null for the theme's words for a status bar.
- `style: StatusBarStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: StatusBarColors?`: this call's own colours, where they are not the theme's.
- `tagKey: String?`: the bar's automation key: it is `StatusBar_<tagKey>`, its items `Item_<key>` inside it and its "…" button `More_items`.

### StatusBarScope

`import com.pantrixui.components.container.statusbar.StatusBarScope`, from `com.pantrixui:components`

```kotlin
interface StatusBarScope
```

What one end of a `PantrixStatusBar` holds, item by item, in the order they are given: words, buttons, and things of the app's own. Each has a key, the same in every language and one to a bar, and a priority: where the bar is too narrow, the lowest goes into the menu behind the bar's "…" button first, and of two alike the later one.

An item is `Item_<tagKey>` inside the bar's tag, its `key` where it is given no tag key, in the bar and in the menu alike.

Members:

- `fun text(key: String, text: String, priority: Int = 0, live: Boolean = false, tagKey: String? = null)`: Words that say how something stands: a caret's line and column, a text's encoding. In the menu they are a row that is read and not pressed.

  `key`: what names the item.

  `text`: its words.

  `priority`: how long it stays in the bar as room runs short.

  `live`: whether a screen reader is told the words each time they change: for what the reader waits on, not for a caret's position, which changes with every key.

  `tagKey`: its automation key, where it is to be another than `key`.
- `fun button(key: String, text: String, onClick: () -> Unit, icon: ImageVector? = null, selected: Boolean = false, enabled: Boolean = true, contentDescription: String? = null, priority: Int = 0, tagKey: String? = null)`: A button with words, and an `icon` before them: a document's size that shows its summary. It keeps the bar's height and is pressed past it, up to the platform's touch target.

  `key`: what names the item.

  `text`: its words.

  `onClick`: called when it is pressed, in the bar or in the menu.

  `icon`: what stands before the words.

  `selected`: whether what it shows is shown now: its words are in the selected colour, and a screen reader is told it is selected.

  `enabled`: whether it can be pressed now.

  `contentDescription`: what a screen reader calls it, where its words alone do not say what it does.

  `priority`: how long it stays in the bar as room runs short.

  `tagKey`: its automation key, where it is to be another than `key`.
- `fun item(key: String, label: String, priority: Int = 0, tagKey: String? = null, content: @Composable () -> Unit)`: Something of the app's own, as a tag that says a document is valid. In the menu it is a row with its `label`, read and not pressed.

  `key`: what names the item.

  `label`: what it says, in words, where it is folded into the menu.

  `priority`: how long it stays in the bar as room runs short.

  `tagKey`: its automation key, where it is to be another than `key`.

  `content`: what the bar draws.

### StatusBarStyle

`import com.pantrixui.components.container.statusbar.StatusBarStyle`, from `com.pantrixui:components`

```kotlin
class StatusBarStyle(
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<StatusBarStyle>
```

`PantrixStatusBar`'s geometry: how tall the bar is, the room at its two ends and the room between two items. A bar used by touch is taller; its buttons are pressed past it, up to the platform's touch target, rather than made taller.

Parameters:

- `height: Dp`: How tall the bar is, under its line: 28 under a pointer, 32 on a phone and a tablet.
- `horizontalPadding: Dp`: The room at the bar's start and its end.
- `gap: Dp`: The room between two items. A button is pressed in half of it on either side, where it is narrower than the touch target.

### StatusBarColors

`import com.pantrixui.components.container.statusbar.StatusBarColors`, from `com.pantrixui:components`

```kotlin
data class StatusBarColors(
    public val container: Color = Color.Unspecified,
    public val line: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selected: Color = Color.Unspecified
)
```

A `PantrixStatusBar`'s own colours, where they are not the theme's.

Parameters:

- `container: Color`: The bar's fill: the theme's `background`, a step from the `surface` of the panes over it.
- `line: Color`: The line over the bar: the theme's `divider`.
- `content: Color`: Its words, a button's among them: the theme's `textSecondary`, quieter than a pane's.
- `selected: Color`: The words of a button that is selected, as one that shows a pane while the pane is shown: the theme's `primary` colour.
