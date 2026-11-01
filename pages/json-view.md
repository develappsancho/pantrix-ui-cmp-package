# JSON View

A JSON text set out to be read: one value to a line, each level set in from the one that holds it, each kind of value in a colour of its own. Objects and arrays fold away behind their first lines. A server's response, a document of settings, a long export are read this way.

What an open document shows is the document: the names and the strings in their quotes, the brackets and the commas in their places, as a pretty-printer writes them. A number is shown as the text wrote it, to its last digit. An object or an array that is folded is one line: an ellipsis between its brackets and, after them, how many things it holds.

The view keeps what is open by itself: at first as much as `expandedDepth` says, and from then on what its reader folds and unfolds, which stays so while the text changes under it. A screen that opens the document from a button of its own, or keeps what was open somewhere, holds that state itself: with the form that takes `expanded`.

- `PantrixJsonView` (`com.pantrixui.components.data.jsonview`, `com.pantrixui:components`): A JSON text set out to be read: a value to a line, coloured by its kind, with objects and arrays that fold, a search, line numbers and a button that copies. Keywords: json tree, pretty print, api response, object viewer, inspector, collapsible json.

## Features

- **Folding.** A line that folds is a button with a chevron before it, which points down while the line is open and forward while it is folded. A press, Enter and the space bar fold and unfold the line.
- **Guides.** A thin line runs down from every open object and array, under its chevron, past everything it holds: it tells one level from the next where the indent is narrow. Its width is `JsonViewStyle.guideWidth` and its colour `JsonViewColors.guide`; a width of zero draws none.
- **Keyboard.** The document is one stop for Tab: the focus comes to the line it was on last, and the arrows walk from there. The down and up arrows go through the lines a value starts on, one after another, and Home and End go to the first line and the last. The right arrow unfolds a folded line and, on an open one, goes in to the first thing it holds; the left arrow folds an open line and, on any other, goes out to the line that opened what holds it. The button that copies is the next stop for Tab.
- **Opening.** `expandedDepth` says how many levels are open at first: `1` opens the text's own value and leaves what is in it folded, and `2` opens those too. Without it every level is open. Giving another depth starts the view again from it.
- **The screen's state.** In the form that takes `expanded` the paths of the objects and arrays that are open are the screen's state: when a line is pressed the new set that is to be open is reported with `onExpandedChange`, and the view changes nothing by itself.
- **Paths.** A path is a JSON Pointer (RFC 6901): the text's own value is the empty string, its member `user` is `/user`, and the first of that one's `tags` is `/user/tags/0`. `jsonViewPaths` gives the paths that open a document down to a depth.
- **Search.** `search` marks what it looks for in the names and the values, in capitals or in small letters; a folded value that holds some of it is marked whole. Where the view scrolls, it brings the first of what was found on the screen. A view that keeps what is open by itself also opens the values that hold some of it; what its reader folds stays folded. In the form that takes `expanded`, opening is the screen's to do: `jsonViewSearchPaths` gives the paths to open. The fill of a mark is `JsonViewColors.match`.
- **Line numbers.** `lineNumbers` writes each line's number before it: the number the line has while the whole document is open. A folded value keeps the number of the line it opens with, and the line after it goes on from where the folded lines would have ended. The numbers are not selected, and a screen reader passes them over.
- **Width.** The view fills the width it is given, and a line too long for it goes on under itself. However deep a line is, it is set in by no more than half the view's width.
- **Lines that do not wrap.** `softWrap = false` keeps every value on one line: the view keeps its width, and the document scrolls sideways. A line that does not wrap is not held back at half the width: it is set in by its whole indent.
- **Height.** In a view given a height the document scrolls inside it, and only the lines on the screen are built: that is how a document of thousands of lines is shown. A view given none, in a page that scrolls, is as tall as the lines it shows where the document, all open, has no more than 300; with a longer document it is no taller than the window, and scrolls in it.
- **Scroll bars.** Where it scrolls, the view has a scroll bar of its own: at its side, and at its foot too where the document scrolls sideways. A bar shows how much of the document is on the screen, and where in it that is. Where the reader has a pointer, on desktop and in a desktop's browser, it is there while there is something to scroll, and a mouse can drag it; under a finger it shows only while the document moves.
- **Copying and selecting.** The button in the view's top right corner copies the whole document as an open view writes it: a value to a line and two spaces a level, whatever is folded on the screen. After a copy it shows a tick for two seconds, and says so to a screen reader too; `onCopy` reports whether the document got to the clipboard. The lines on the screen can be selected too, by a mouse drawn over them or a long press, and copied by the system's own means: what is copied so is what the lines show. `copyable = false` takes the button away, and `selectable = false` turns selecting off.
- **Reading direction.** A document is written from left to right in every language, as code is.
- **A text that is not JSON.** It is shown as it is; the line over it says where the reading stopped, by line and column, in the theme's language.
- **Colour.** On the theme's own grounds each kind of value has a colour of its own, from the theme's roles: a number is told from a string that holds digits before its quotes are read. On one of the theme's role colours the whole document is written in the one colour that reads there. A colour given with `JsonViewColors` is used, and one that is not stays the theme's.
- **Platform.** Under a finger, on Android, on iOS and on the web, a line has 4dp over and under its words, which makes it 28dp tall in the theme's code type; on desktop it has 2dp, for a pointer. A level is set in by 16dp on desktop and the web, and by 12dp on a phone. The corners are the card's.
- **Screen reader.** On a line that folds a screen reader is offered what a press does and is told whether the line is open. The line says its name, how many things it holds if it is folded, and how deep it is, the last two in the theme's words: "items, Items: 2, Level 2". The text's own value has no name: open, it says "Level 1" alone. The other lines are read as they are written; the line that closes an open value is passed over.
- **Automation.** With `tagKey` the view is `JsonView_<tagKey>` and a line in it `JsonView_<tagKey>.Row_<path>`: the path is as it is written (`Row_/user/tags/0`), and the text's own value is `Row_root`. The line that closes an open value is `JsonView_<tagKey>.End_<path>`, the line over a text that is not JSON `JsonView_<tagKey>.Note_fault`, and the button that copies `JsonView_<tagKey>.Button_copy`. A press is reported as `expand` or `collapse`, with the line's level; a copy as `copy`, with whether it got to the clipboard. Nothing of the document is reported.

## Usage

### A response, as it came

```kotlin
PantrixJsonView(json = response.body, tagKey = "response")
```

### A long document in a room of its own, searched from a field of the screen's

```kotlin
var query by remember { mutableStateOf("") }
PantrixTextField(value = query, onValueChange = { query = it }, label = stringResource(Res.string.search))
PantrixJsonView(
    json = export,
    modifier = Modifier.height(320.dp),
    expandedDepth = 2,
    search = query,
    lineNumbers = true,
    tagKey = "export"
)
```

### Opened and folded from the screen's own buttons

```kotlin
var open by remember(json) { mutableStateOf(jsonViewPaths(json, depth = 1)) }
PantrixButton(text = stringResource(Res.string.expand_all), onClick = { open = jsonViewPaths(json) })
PantrixJsonView(json = json, expanded = open, onExpandedChange = { open = it }, tagKey = "settings")
```

## Examples

### A response

Its plainest form: a JSON text and an automation key. The view sets the text out to be read: one value to a line, each level set in from the one that holds it. The names and the strings keep their quotes, and the brackets and the commas their places: what an open document shows is the document. Numbers are as the text wrote them, and `249.90` keeps its last zero.

Each kind of value is in a colour of its own: strings, numbers, and `true`, `false` and `null`. The first line of an object or an array is a button: press the `"items"` line and the array folds onto one line, which says how many things it holds. Press it again and it opens.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView

PantrixJsonView(json = RESPONSE, tagKey = "response")

private val RESPONSE =
    """
    {
      "id": 4821,
      "status": "shipped",
      "total": 249.90,
      "paid": true,
      "coupon": null,
      "customer": {
        "name": "Ada Yılmaz",
        "city": "İzmir"
      },
      "items": [
        { "sku": "KB-104", "quantity": 1, "price": 189.90 },
        { "sku": "MS-220", "quantity": 2, "price": 30.00 }
      ]
    }
    """.trimIndent()
```

### How much is open at first

`expandedDepth` says how many levels of the document are open at first. `1` opens the text's own value and leaves everything in it folded; `2` opens those too; without it every level is open.

The view keeps what is open by itself: what you fold or unfold by pressing a line stays so. Given another depth, the view starts again from it: press the `"customer"` line, then choose another depth.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var depth by rememberSaveable { mutableIntStateOf(1) }
PantrixSegmentButton(
    options = DEPTHS,
    selected = depth,
    onSelect = { depth = it },
    fullWidth = false,
    tagKey = "depth"
)
PantrixJsonView(json = RESPONSE, expandedDepth = depth, tagKey = "by_depth")

private val DEPTHS = listOf(
    SegmentOption(value = 1, label = "1 level", tagKey = "one"),
    SegmentOption(value = 2, label = "2 levels", tagKey = "two"),
    SegmentOption(value = Int.MAX_VALUE, label = "All", tagKey = "all")
)

private val RESPONSE =
    """
    {
      "id": 4821,
      "status": "shipped",
      "total": 249.90,
      "paid": true,
      "coupon": null,
      "customer": {
        "name": "Ada Yılmaz",
        "city": "İzmir"
      },
      "items": [
        { "sku": "KB-104", "quantity": 1, "price": 189.90 },
        { "sku": "MS-220", "quantity": 2, "price": 30.00 }
      ]
    }
    """.trimIndent()
```

### A long document in a height it is given

A document of a few hundred lines, in a room 280dp tall. The height was given to the view's `modifier`: the document scrolls inside that height, and only the lines on the screen are built. A document of thousands of lines is shown this way too.

Given no height, in a page that scrolls as this one does, the view would take the window's height with this document of more than 300 lines, and scroll in it. With a document of no more than 300 lines it would be as tall as all its lines: it is so in the other examples that are given no height. The text is read again only when it changes; here it is built once and kept with `remember`.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.jsonview.PantrixJsonView

val readings = remember { sensorReadings(count = 60) }
PantrixJsonView(json = readings, modifier = Modifier.height(280.dp), tagKey = "readings")

private fun sensorReadings(count: Int): String =
    (1..count).joinToString(separator = ",", prefix = "[", postfix = "]") { n ->
        """{"id": $n, "sensor": "T-${n % 4 + 1}", "celsius": ${18 + n % 7}.${n % 10}, "ok": ${n % 9 != 0}}"""
    }
```

### Search

`search` finds what it looks for in the names and the values, in capitals or in small letters, and does three things: it marks what it finds, opens the values that hold it, and brings the first of it on the screen where the view scrolls.

The document is an array of forty-eight orders, in a room 240dp tall, with its first level alone open: each order is folded onto one line. Type `returned` into the field: the four orders that were returned open, the word is marked in all four, and the view scrolls to the first of them, the twelfth order. Empty the field: the marks go, and the orders the search opened fold again.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
val orders = remember { orderExport(count = 48) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Search the orders",
    showClearButton = true,
    contentDescription = "Search the orders",
    tagKey = "order_search"
)
PantrixJsonView(
    json = orders,
    modifier = Modifier.height(240.dp),
    expandedDepth = 1,
    search = query.text.toString(),
    tagKey = "orders"
)

private fun orderExport(count: Int): String =
    (1..count).joinToString(separator = ",", prefix = "[", postfix = "]") { n ->
        val status = if (n % 12 == 0) "returned" else "shipped"
        """{"id": ${4800 + n}, "status": "$status", "total": ${30 + n * 4}.50}"""
    }
```

### Line numbers, and lines that do not wrap

`lineNumbers` writes each line's number before it: the number the line has while the whole document is open. Press the `"request"` line: the folded value keeps the number of the line it opens with, 4, and the line after it goes on from 9.

The `"signature"` value is too long for the card. At first its line goes on under itself, and carries one number. Turn the switch off: `softWrap = false` keeps every value on one line, the view keeps its width, and the document scrolls sideways.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var wraps by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = wraps,
    onCheckedChange = { wraps = it },
    label = "A long line goes on under itself",
    tagKey = "soft_wrap"
)
PantrixJsonView(json = WEBHOOK, softWrap = wraps, lineNumbers = true, tagKey = "webhook")

private val WEBHOOK =
    """
    {
      "event": "payment.failed",
      "order": 4821,
      "request": {
        "method": "POST",
        "url": "https://api.example.com/v2/payments",
        "attempts": 3
      },
      "signature": "${"9f2c41d7a0b35e68".repeat(14)}",
      "handled": false
    }
    """.trimIndent()
```

### Copying and selecting

The button in the view's top right corner copies the whole document: what is folded on the screen too, as an open view writes it, a value to a line and two spaces a level. After a copy the button shows a tick for two seconds.

`onCopy` reports whether the document got to the clipboard: here it is written on the card's "Last event" line. Where the system itself shows what was copied, on Android 13 and later, a screen that tells its user says so only when nothing was copied: `rememberPantrixClipboard().traits.announcedBySystem` is true there.

In the upper view the lines on the screen can be selected too, by a mouse drawn over them or a long press, and copied by the system's own means. The lower view is the same document: `copyable = false` takes the button away, and `selectable = false` turns selecting off.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView

val report = LocalExampleEvents.current
PantrixJsonView(
    json = SETTINGS,
    expandedDepth = 1,
    onCopy = { copied -> report(if (copied) "Document copied to the clipboard" else "The document could not be copied") },
    tagKey = "copyable"
)
PantrixJsonView(
    json = SETTINGS,
    expandedDepth = 1,
    selectable = false,
    copyable = false,
    tagKey = "not_copyable"
)

private val SETTINGS =
    """
    {
      "theme": "dark",
      "fontScale": 1.15,
      "notifications": {
        "email": true,
        "push": false,
        "quietHours": { "from": "22:00", "to": "07:00" }
      },
      "shortcuts": [
        { "keys": "Ctrl+K", "action": "search" },
        { "keys": "Ctrl+S", "action": "save" }
      ]
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### From the screen's own buttons

In the form that takes `expanded` the screen holds what is open, as it does an accordion's sections: the view is given the paths of the objects and arrays that are open, and when a line is pressed the new set that is to be open is reported with `onExpandedChange`. The view changes nothing by itself.

The state was made with `jsonViewPaths(json, depth = 1)`: the text's own value alone is open. "Open all" puts all the document's paths there, and "Close all" empties the set: nothing is left open, and the document comes down to one line. Each change is written on the card's "Last event" line, with how many paths are open.

A path is a JSON Pointer: the text's own value is the empty string, its member `notifications` is `/notifications`, and the first of `shortcuts` is `/shortcuts/0`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.data.jsonview.jsonViewPaths
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var open by rememberSaveable { mutableStateOf(jsonViewPaths(SETTINGS, depth = 1)) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Open all",
        onClick = {
            open = jsonViewPaths(SETTINGS)
            report("All opened, open paths: ${open.size}")
        },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "json_open_all"
    )
    PantrixButton(
        text = "Close all",
        onClick = {
            open = emptySet()
            report("All closed, open paths: ${open.size}")
        },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        tagKey = "json_close_all"
    )
}
PantrixJsonView(
    json = SETTINGS,
    expanded = open,
    onExpandedChange = { paths ->
        open = paths
        report("Line pressed, open paths: ${paths.size}")
    },
    tagKey = "settings"
)

private val SETTINGS =
    """
    {
      "theme": "dark",
      "fontScale": 1.15,
      "notifications": {
        "email": true,
        "push": false,
        "quietHours": { "from": "22:00", "to": "07:00" }
      },
      "shortcuts": [
        { "keys": "Ctrl+K", "action": "search" },
        { "keys": "Ctrl+S", "action": "save" }
      ]
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Search, with the screen's own state

In the form that takes `expanded` a search only marks; opening what it finds is the screen's to do. `jsonViewSearchPaths` gives the paths of the values that hold some of what is looked for, and the screen adds them to its own set.

Type `ctrl` into the field: the `shortcuts` array and the two objects in it open, and `Ctrl` is marked in both. While the search is there these lines do not fold: the search's paths are added to the set again each time. Empty the field: what is open is the screen's set alone again.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.data.jsonview.jsonViewPaths
import com.pantrixui.components.data.jsonview.jsonViewSearchPaths
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
var open by rememberSaveable { mutableStateOf(jsonViewPaths(SETTINGS, depth = 1)) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Search the settings",
    showClearButton = true,
    contentDescription = "Search the settings",
    tagKey = "settings_search"
)
PantrixJsonView(
    json = SETTINGS,
    expanded = open + jsonViewSearchPaths(SETTINGS, query.text.toString()),
    onExpandedChange = { open = it },
    search = query.text.toString(),
    tagKey = "searched_settings"
)

private val SETTINGS =
    """
    {
      "theme": "dark",
      "fontScale": 1.15,
      "notifications": {
        "email": true,
        "push": false,
        "quietHours": { "from": "22:00", "to": "07:00" }
      },
      "shortcuts": [
        { "keys": "Ctrl+K", "action": "search" },
        { "keys": "Ctrl+S", "action": "save" }
      ]
    }
    """.trimIndent()
```

### A text that is not JSON

A text with a comma left after its last member: it is not JSON. The view does not keep back a text it could not read: it shows it as it is, line by line. The line over it says, in the theme's language, where the reading stopped: a line and a column, both counted from one.

Here the reading stops at the first character of the fourth line: after the comma a name is expected, and the closing bracket comes.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView

PantrixJsonView(json = NOT_JSON, tagKey = "not_json")

private val NOT_JSON =
    """
    {
      "id": 4821,
      "status": "shipped",
    }
    """.trimIndent()
```

### In a card, in colours of its own

The view has a fill and an edge of its own: the fill is the theme's `surface`, and the edge the theme's `divider`. In a card that has both, `colors` makes the two transparent. A colour that is given is used, and one that is not stays the theme's: the names are the theme's `textPrimary`, and the brackets and the commas its `textSecondary`; strings are in the colour of the `success` role, numbers in that of `warning`, and `true`, `false` and `null` in that of `primary`.

`style` changes the view's geometry; only the fields that are given change. Here `horizontalPadding` is zero, so that the lines start where the card's padding ends, and each level is set in by 24dp: `indent`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.data.jsonview.JsonViewColors
import com.pantrixui.components.data.jsonview.JsonViewStyle
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
    PantrixText(text = "Last order", style = PantrixTheme.typography.title)
    PantrixJsonView(
        json = RESPONSE,
        style = JsonViewStyle(horizontalPadding = 0.dp, indent = 24.dp),
        colors = JsonViewColors(container = Color.Transparent, border = Color.Transparent),
        tagKey = "in_a_card"
    )
}

private val RESPONSE =
    """
    {
      "id": 4821,
      "status": "shipped",
      "total": 249.90,
      "paid": true,
      "coupon": null,
      "customer": {
        "name": "Ada Yılmaz",
        "city": "İzmir"
      },
      "items": [
        { "sku": "KB-104", "quantity": 1, "price": 189.90 },
        { "sku": "MS-220", "quantity": 2, "price": 30.00 }
      ]
    }
    """.trimIndent()
```

## API

### PantrixJsonView

`import com.pantrixui.components.data.jsonview.PantrixJsonView`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixJsonView(
    json: String,
    modifier: Modifier = Modifier,
    expandedDepth: Int = Int.MAX_VALUE,
    search: String = "",
    softWrap: Boolean = true,
    lineNumbers: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    style: JsonViewStyle? = null,
    colors: JsonViewColors? = null,
    tagKey: String? = null
)
```

A JSON text set out to be read: one value to a line, each level set in from the one that holds it, each kind of value in a colour of its own, and every object and array folding away behind its first line.

What an open document shows is the document: the names and the strings in their quotes, the brackets and the commas, as a pretty-printer writes them. A number is shown as the text wrote it, to its last digit. An object or an array that is folded is one line, its brackets around an ellipsis and, after them, how many things it holds. A thin line runs down from an open one, under its chevron, past everything it holds.

This view keeps what is open by itself: everything down to `expandedDepth` at first, and from then on what its reader folds and unfolds, which stays as the reader left it while the text changes under it and while a search comes and goes. A screen that opens the document from a button of its own, or keeps what was open somewhere, holds that state itself, with the overload that takes `expanded`.

The document is one stop for Tab, as a tree is: the focus comes to the line it was on last, or to the first line on the screen where that one was scrolled away, and the keys walk from there, over the lines a value starts on: the bracket that closes a value says nothing of its own, and is passed. Down and up go to the line after and the line before, Home and End to the first and the last, however far in the document that is. The right arrow unfolds a folded line and, on an open one, goes in to the first thing it holds; the left arrow folds an open line and, on any other, goes out to the line that opened what holds it. A line that folds is a button: a press, Enter and Space fold and unfold it. A screen reader is offered what a press does, is told whether the line is open, and hears its name, how many things a folded one holds and how deep it is, in the theme's words.

`search` marks what it looks for wherever a name or a value has it, opens the values that hold some of it, and brings the first of it on the screen where the view scrolls. `lineNumbers` counts the lines as the open document has them: a folded value keeps the number it opens with, and the line after it goes on from where the folded lines would have ended.

The text can be taken away. A button in the view's corner copies the whole document as an open view writes it, and what is on the screen can be selected and copied a part at a time.

The view fills the width it is given, and a line too long for it goes on under itself; with `softWrap` off no line does, and the document scrolls sideways. Given a height, it scrolls inside it, and only the lines on the screen are built: that is how a document of thousands of lines is shown. With no height, in a page that scrolls, it is as tall as the lines it shows where the document, all open, has no more than three hundred; a longer document is no taller there than the window, and scrolls in it. Where it scrolls, a bar at its edge shows how far, and a mouse can drag it.

A document is written from left to right in every language, as code is. A text that is not JSON is shown as it is, under a line that says where the reading stopped.

```kotlin
PantrixJsonView(json = response.body, tagKey = "response")
```

Parameters:

- `json: String`: the JSON text, as RFC 8259 writes it. It is read again only when it changes: a megabyte takes a phone some tenths of a second.
- `modifier: Modifier`: the view's modifier. A height given here is the room the document scrolls in.
- `expandedDepth: Int`: how many levels are open at first: `1` shows the text's own value with everything in it folded, `2` opens those too, and every level is open by default. Giving another depth starts again from it.
- `search: String`: what is looked for in the names and the values, in capitals or in small letters. Nothing by default, which marks nothing. It is looked for as it is given, in the lines as they are written: a name and a string in their quotes, and no space taken off its ends. The whole document is looked through each time it changes: for a text of megabytes, give it when the reader stops typing.
- `softWrap: Boolean`: whether a line too long for the view goes on under itself. False keeps every value on one line and lets the document scroll sideways.
- `lineNumbers: Boolean`: whether each line carries its number in the open document, before everything else of it.
- `selectable: Boolean`: whether what the lines say can be selected, by a pointer drawn over it or a finger held on it, and copied by the system's own means. What is copied so is what the lines show, a line to a line: without the room they are set in by, and with a folded value as it is folded. A view that scrolls in its own height has built the lines on its screen and no others, and "select all" there selects those. The button copies the document itself.
- `copyable: Boolean`: whether the view has the button that copies the document.
- `onCopy: ((copied: Boolean) -> Unit)?`: called after that button was pressed, with whether the document got to the clipboard: a screen that says so in its own way listens here. The button itself shows a tick for a moment and tells a screen reader, unless the system shows every copy itself (`PantrixClipboard.traits`): there nothing more is needed.
- `style: JsonViewStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: JsonViewColors?`: this view's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the view's automation key: the view is `JsonView_<tagKey>`, a line in it `JsonView_<tagKey>.Row_<path>` with the path as it is written (`Row_/user/tags/0`, and `Row_root` for the text's own value), the line that closes an open one `JsonView_<tagKey>.End_<path>`, the line over a text that is not JSON `JsonView_<tagKey>.Note_fault`, and the button that copies `JsonView_<tagKey>.Button_copy`. Only two members of one name share a path, and so a tag. A press is reported as a `JsonView` event: `expand` and `collapse` with the line's level, and `copy` with whether it got there. Nothing of the document is reported.

### PantrixJsonView

`import com.pantrixui.components.data.jsonview.PantrixJsonView`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixJsonView(
    json: String,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    search: String = "",
    softWrap: Boolean = true,
    lineNumbers: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    style: JsonViewStyle? = null,
    colors: JsonViewColors? = null,
    tagKey: String? = null
)
```

`PantrixJsonView` with what is open held by the caller, as an accordion's sections are: give `expanded` and act on `onExpandedChange`. That is what lets a screen open everything from a button of its own, unfold the way to a value a search found, or keep what was open across a visit to another screen.

What a `search` finds is marked here too, and a folded value that holds some of it is marked whole; opening it is the caller's to do, with the paths `jsonViewSearchPaths` gives.

```kotlin
var open by remember(json) { mutableStateOf(jsonViewPaths(json, depth = 1)) }
PantrixJsonView(json = json, expanded = open, onExpandedChange = { open = it }, tagKey = "settings")
```

Parameters:

- `json: String`: the JSON text, as RFC 8259 writes it. It is read again only when it changes.
- `expanded: Set<String>`: the paths of the objects and arrays that are open, as `jsonViewPaths` writes them: the empty string for the text's own value, `/user` for its member `user`, `/user/tags/0` for the first of that one's `tags`. A path that leads to nothing that folds changes nothing.
- `onExpandedChange: (Set<String>) -> Unit`: called with the paths that are to be open after a line was pressed: `expanded` with the line's path added or taken out. The view changes nothing by itself.
- `modifier: Modifier`: the view's modifier. A height given here is the room the document scrolls in.
- `search: String`: what is looked for in the names and the values, in capitals or in small letters.
- `softWrap: Boolean`: whether a line too long for the view goes on under itself.
- `lineNumbers: Boolean`: whether each line carries its number in the open document.
- `selectable: Boolean`: whether what the lines say can be selected and copied by the system's own means.
- `copyable: Boolean`: whether the view has the button that copies the document.
- `onCopy: ((copied: Boolean) -> Unit)?`: called after that button was pressed, with whether the document got to the clipboard.
- `style: JsonViewStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: JsonViewColors?`: this view's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the view's automation key, as the other overload has it.

### jsonViewPaths

`import com.pantrixui.components.data.jsonview.jsonViewPaths`, from `com.pantrixui:components`

```kotlin
fun jsonViewPaths(
    json: String,
    depth: Int = Int.MAX_VALUE
): Set<String>
```

The paths of the objects and arrays of `json` that a `PantrixJsonView` can fold, down to `depth` levels: what its `expanded` is given to open a document so far.

A path is a JSON Pointer (RFC 6901): the names and the places that lead to a value from the text's own, each after a slash. The text's own value is the empty string, its member `user` is `/user`, and the first of that one's `tags` is `/user/tags/0`. A slash in a name is written `~1` and a tilde `~0`. An object or an array that holds nothing has nothing to fold, and its path is not among them.

```kotlin
var open by remember(json) { mutableStateOf(jsonViewPaths(json, depth = 1)) }
PantrixJsonView(json = json, expanded = open, onExpandedChange = { open = it })
// Everything open, from a button of the screen's own:
open = jsonViewPaths(json)
```

The text is read each time this is called: keep what it gives while the text is the same, as the `remember` above does.

Returns the paths, in the order the text writes them.

Parameters:

- `json: String`: the text. One that is not JSON has no paths.
- `depth: Int`: how many levels are counted: `1` is the text's own value alone, `2` that one and what it holds, and every level by default. Zero and less count none.

### jsonViewSearchPaths

`import com.pantrixui.components.data.jsonview.jsonViewSearchPaths`, from `com.pantrixui:components`

```kotlin
fun jsonViewSearchPaths(
    json: String,
    search: String,
    language: String = ""
): Set<String>
```

The paths of the objects and arrays of `json` that hold something `search` looks for, in a name or in a value, however deep inside them: what a `PantrixJsonView`'s `expanded` is given, or has added to it, to show everything that was found.

```kotlin
val found = remember(json, query) { jsonViewSearchPaths(json, query) }
PantrixJsonView(
    json = json,
    expanded = open + found,
    onExpandedChange = { open = it },
    search = query
)
```

The text is read each time this is called: keep what it gives while the text and the search are the same.

Returns the paths of the values that are to be open, as `jsonViewPaths` writes a path. A value is among them for what is inside it, not for its own name: the line that carries its name is in what holds it.

Parameters:

- `json: String`: the text. One that is not JSON has no paths.
- `search: String`: what is looked for, in capitals or in small letters. A search of nothing finds nothing.
- `language: String`: the language whose small letters the search compares, the theme's `locale.language` as the view does: in Turkish and Azerbaijani a dotless ı is I's small letter, so "i" finds "İstanbul" and not "Irmak".

### JsonViewStyle

`import com.pantrixui.components.data.jsonview.JsonViewStyle`, from `com.pantrixui:components`

```kotlin
class JsonViewStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val indent: Dp = Dp.Unspecified,
    public val chevronSize: Dp = Dp.Unspecified,
    public val chevronGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val guideWidth: Dp = Dp.Unspecified
) : PantrixStyle<JsonViewStyle>
```

`PantrixJsonView`'s geometry: the room around its lines, how far a level is set in, and the edge.

The lines are a document's and not a list's rows: they stand close, as lines of code do. Under a finger, on Android, on iOS and on the web, whose browser may be a touch screen's, a line has 4dp over and under its words, which makes it 28dp tall in the theme's code type; on the desktop it has 2dp, for a pointer. A level is set in by two letters of that type on the desktop and on the web, and by a letter and a half on a phone, where a line is short.

The corners are the card's on each platform: medium on Android, large on iOS, small on desktop and the web.

The paddings, the indent and the gap follow the density, since they are the room around the words. The chevron's size, the widths of the edge and of the guides, and the shape do not.

Parameters:

- `shape: ShapeSpec`: The corners of the view: a step of the brand's shape scale, or a fixed shape.
- `horizontalPadding: Dp`: The room between the view's sides and its lines. A pointer's mark and a press are drawn across it, to the sides.
- `verticalPadding: Dp`: The room over the first line and under the last.
- `linePadding: Dp`: The room over and under the words of each line.
- `indent: Dp`: How far each level is set in from the one that holds it. Where lines go on under themselves, a line is set in by no more than half the room it has, however deep it is.
- `chevronSize: Dp`: The width and height of the chevron before a line that folds.
- `chevronGap: Dp`: Between that chevron and the line's words. Every line leaves the chevron's room, so that the names of one level start under one another.
- `borderWidth: Dp`: The width of the edge around the view. Zero draws none.
- `guideWidth: Dp`: The width of the lines that run down from an open object or array, under its chevron, past everything it holds: what tells one level from the next where the indent is narrow. Zero draws none.

### JsonViewColors

`import com.pantrixui.components.data.jsonview.JsonViewColors`, from `com.pantrixui:components`

```kotlin
data class JsonViewColors(
    public val container: Color = Color.Unspecified,
    public val key: Color = Color.Unspecified,
    public val string: Color = Color.Unspecified,
    public val number: Color = Color.Unspecified,
    public val literal: Color = Color.Unspecified,
    public val punctuation: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val guide: Color = Color.Unspecified,
    public val match: Color = Color.Unspecified
)
```

What a `PantrixJsonView` is painted with, for a view that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// No fill and no edge of its own, in a card that has both:
PantrixJsonView(
    json = response,
    colors = JsonViewColors(container = Color.Transparent, border = Color.Transparent)
)
```

On the theme's own grounds each kind of value has a colour of its own, from the theme's roles, so that a number is told from a string that holds digits before its quotes are read. On another fill those colours are not known to read. A `container` that is one of the theme's role colours, and a transparent one on a fill that gives what stands on it a colour, write the whole document in the one colour that reads there; a fill the theme does not have writes it in the theme's text colour. Each colour given here is used wherever the view stands.

Parameters:

- `container: Color`: The fill behind the lines: the theme's `surface`. `Color.Transparent` leaves what is behind the view to show.
- `key: Color`: A member's name. A pointer's mark and a press on a line that folds are drawn in it too. The theme's `textPrimary`.
- `string: Color`: A string. The theme's success role.
- `number: Color`: A number. The theme's warning role.
- `literal: Color`: `true`, `false` and `null`. The theme's primary role.
- `punctuation: Color`: The brackets, the colons and the commas, the ellipsis of what is folded and how many things it holds, the chevron before a line that folds, and a text that is not JSON. The theme's `textSecondary`.
- `border: Color`: The edge around the view. The theme's `divider` on the theme's own grounds, and on a fill, where that line would not read, a share of what is written there.
- `guide: Color`: The lines that run down from an open object or array. The theme's `divider` on the theme's own grounds, and on a fill a share of what is written there. That is what `border` is too where it is given nothing, but the two are apart: a colour given to `border` does not change the guides.
- `match: Color`: What is laid behind the letters a search found. The theme's warning role softened, written in what the theme pairs with it; on a fill a share of what is written there, under letters that keep their colour. A colour given here that is one of the theme's role colours brings its pair too.
