# Code Editor

Code to be written and changed: a text of any length, a line at a time, each run of it in the colour of what it is, its lines numbered. A settings file, a query box, a script or a JSON document is edited this way.

The editor does not know the language it shows. What colours the code is the reader its caller gives (`highlighter`): it reads a line from the state the line before ended in, and says its runs. On this page the app's own reader of JSON colours most of the examples.

- `PantrixCodeEditor` (`com.pantrixui.components.data.codeeditor`, `com.pantrixui:components`): Code to be written and changed: a text of any length kept a line at a time, coloured by the app's own highlighter, its lines numbered, with an editor's keys and an undo a word at a time. Keywords: code editor, source code, syntax highlighting, text editor, json editor, monospace.

## Features

- **State.** The text, the selection and the history are in a `CodeEditorState`, which `rememberCodeEditorState` builds. The text is kept a line at a time: a text of megabytes opens at once and is typed in as a short one is. The state says the text (`text`), how many lines it has (`lineCount`), a line (`line`), the line a place is on (`lineOf`) and where a line starts (`lineStart`); `revision` grows with each change. `revealLines` brings lines onto the screen without moving the caret.
- **The app's changes.** `replace` changes one place, `setText` the whole text, and `edit` several places in one step; each is undone. `undo` and `redo` take back and make again a word of typing at a time; `canUndo` and `canRedo` say whether there is anything to do.
- **Reader.** A `CodeHighlighter` takes a line and the state the line before ended in, and gives the line's runs and the state it ends in (`CodeHighlight`). The editor reads the lines away from the main thread, and after a change only as far as the change altered the state the next line is read from.
- **Syntax.** `CodeSyntax` names the language's brackets, quotes and comments: a bracket or a quote that is typed is closed at once (`closesPairs`), and a closing one the editor put in is typed over; Ctrl+/ comments the lines out.
- **Indent.** `indent` is one step of indent: two spaces, or a tab. Tab indents and Shift+Tab outdents, the lines of a selection together; a line feed carries the line's indent on, and one step more after an opening bracket.
- **Keys for lines.** Alt+Up and Alt+Down move the lines, and with Shift copy them; Ctrl+Shift+K deletes them; Ctrl+Shift+\ goes to the matching bracket. Cmd in place of Ctrl on a Mac.
- **Marks.** A line's mark (`lineMarks`) draws its tone's fill behind the line and a bar at its edge; the bar can have a tone of its own (`bar`) or be left out (`showBar`), and the number can have a sign before it (`gutter`). With the caret on a marked line, the line stays on its own band. A stretch's mark (`CodeRangeMark`) puts a wavy line under it and a dot at the start of its line, or a fill behind it (`CodeRangeStyle`); its message shows while the caret is there or the mouse is over it.
- **Find and replace.** Ctrl+F opens the find bar, and Ctrl+H opens it with its replace row; matching case, whole words and regular expressions are chosen there. Every match is marked in the text and on the scroll bar. The app opens the bar with `find`, and does the same without it with `findNext`, `findAll`, `replaceNext` and `replaceAll`.
- **A phone's row of keys.** On a phone a row of keys stands under the editor while it has the focus: Tab, the brackets and signs code is written with, undo, redo and the arrows. The app gives its own row with `keyRow` (`CodeKey`).
- **Long lines.** A line that does not fit is not broken: the code scrolls sideways, and the line numbers stay where they are. With `softWrap` the line goes on under itself as wide as the editor, its number by its first row. A line of more than ten thousand characters is shown that far, with a mark at its end that says how much is left; the line is kept whole.
- **Colour and style.** A colour given with `CodeEditorColors` is used, and the theme's stays for the rest; `CodeEditorStyle` changes the corners, the spacing and the edge's width.
- **Keyboard.** Tab indents; after Escape, Tab moves the focus on and Shift+Tab back, so that the keyboard can always leave the editor.
- **Screen reader.** The editor's name is `contentDescription`, "Code editor" where it is not given. On a platform that writes with a keyboard, the screen reader is also told what Tab does and how to leave. A mark's message and the find bar's count are said as they change; the line numbers are not read.
- **Automation.** With `tagKey` the editor's field is `CodeEditor_<tagKey>`, a line outside the window `CodeEditor_<tagKey>.Line_<number>`, a mark's message `CodeEditor_<tagKey>.Note_<number>` and the search field `CodeEditor_<tagKey>.TextField_find`.

## Usage

### A file of settings, coloured by the app's own highlighter

```kotlin
val state = rememberCodeEditorState(initialText = settings)
PantrixCodeEditor(
    state = state,
    modifier = Modifier.height(320.dp),
    highlighter = IniHighlighter,
    tagKey = "settings"
)
```

### A query, run once the typing has paused

```kotlin
val query = rememberCodeEditorState("$.store.book[*].author")
LaunchedEffect(query) {
    snapshotFlow { query.revision }.collectLatest {
        delay(300)
        onQuery(query.text)
    }
}
PantrixCodeEditor(state = query, modifier = Modifier.height(96.dp), lineNumbers = false, tagKey = "query")
```

### A file to be read and copied, not changed

```kotlin
PantrixCodeEditor(
    state = rememberCodeEditorState(initialText = file.text),
    modifier = Modifier.height(480.dp),
    readOnly = true,
    tagKey = "file"
)
```

## Examples

### A JSON document

A JSON document with comments, coloured by the app's own reader. The syntax names JSON's brackets, its one quote and its comments: type `{` and `}` follows at once, Enter opens an indented line between the two, and Ctrl+/ comments the line out.

The fourth line is marked with a warning, and the app's name with an error: put the caret on them, or the mouse over them, and their messages show under them.

There are two actions under the error's message (`CodeMark.actions`, `CodeMarkAction`): "Shorten the name" fixes the name and the error goes, "Show the rule" says the rule. While the mouse is over the note it stays where it is; with the caret in the error, Ctrl+. (Cmd+. on Apple's systems) takes the focus to the first action, and Escape brings it back to the text.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeMarkAction
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeeditor.CodeRangeMark
import com.pantrixui.components.data.codeeditor.CodeSyntax
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState

val state = rememberCodeEditorState(initialText = SETTINGS)
val report = LocalExampleEvents.current
val name = remember(state.revision) { state.text.indexOf("\"Formatico\"") }
PantrixCodeEditor(
    state = state,
    modifier = Modifier.height(320.dp),
    highlighter = JsonHighlighter,
    syntax = CodeSyntax(quotes = "\"", lineComment = "//", blockCommentStart = "/*", blockCommentEnd = "*/"),
    lineMarks = mapOf(3 to CodeMark(CodeTone.Warning, message = "This version is no longer supported.")),
    rangeMarks = if (name < 0) {
        emptyList()
    } else {
        val end = name + "\"Formatico\"".length
        listOf(
            CodeRangeMark(
                start = name,
                end = end,
                mark = CodeMark(
                    CodeTone.Danger,
                    message = "A name has at most 8 letters.",
                    source = "schema",
                    actions = listOf(
                        CodeMarkAction("Shorten the name") { state.replace(name, end, "\"Formati\"") },
                        CodeMarkAction("Show the rule") { report("Schema: name has 8 letters at most") }
                    )
                )
            )
        )
    },
    tagKey = "settings"
)

private val SETTINGS = """
{
  // What the app opens with.
  "name": "Formatico",
  "version": 3,
  /* The themes it offers,
     the first one by default. */
  "themes": ["light", "dark"],
  "fontSize": 14.5,
  "telemetry": false,
  "lastOpened": null
}
""".trimStart()
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.
- `JsonHighlighter`: The runs of JSON with comments that are to be coloured, a line at a time: a name before a colon is a property, what is in quotes a string, `true`, `false` and `null` words of the language, numbers numbers, and line and block comments comments. `PantrixCodeEditor` knows no language: the reader its caller gives tells it what is what, and in this app this is the one that does.

### Find and replace with the app's buttons

The app opens the find bar too: "Find" with the search field alone, "Replace" with the replace row, `TODO` to look for and `DONE` to put in its place given. While the bar is open, every match is marked in the text and on the scroll bar.

The state does the same without the bar: "Next" selects the next match, "Finish" replaces the selected match and selects the next, and "Finish all" replaces them all in one step to undo. The number under it is `findAll`'s.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.CodeSearch
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.findAll
import com.pantrixui.components.data.codeeditor.findNext
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.data.codeeditor.replaceAll
import com.pantrixui.components.data.codeeditor.replaceNext
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberCodeEditorState(initialText = TASKS)
val todo = CodeSearch("TODO", matchCase = true, wholeWord = true)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixButton(
            text = "Find",
            onClick = { state.find.open() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "find"
        )
        PantrixButton(
            text = "Replace",
            onClick = {
                state.find.search = todo
                state.find.replacement = "DONE"
                state.find.open(replacing = true)
            },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "replace"
        )
        PantrixButton(
            text = "Close",
            onClick = { state.find.close() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            enabled = state.find.isOpen,
            tagKey = "close"
        )
        PantrixButton(
            text = "Next",
            onClick = { state.findNext(todo) },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "next"
        )
        PantrixButton(
            text = "Finish",
            onClick = { state.replaceNext(todo, "DONE") },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "done"
        )
        PantrixButton(
            text = "Finish all",
            onClick = { state.replaceAll(todo, "DONE") },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "doneAll"
        )
    }
    PantrixCodeEditor(state = state, modifier = Modifier.height(240.dp), tagKey = "tasks")
    PantrixText(text = "TODOs left: ${state.findAll(todo).size}", color = PantrixTheme.colors.textSecondary)
}

private val TASKS = """
# Before the release
TODO: write the changelog
TODO: record the screenshots again
DONE: raise the version
TODO: push the tag
""".trimStart()
```

### A query with a row of keys of its own

A query box of one line: it has no line numbers, and the query runs 300 ms after the typing stops. On a phone, while the editor has the focus, the query's own keys stand under it: JSONPath's signs, two arrows and undo.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.CodeKey
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest

val query = rememberCodeEditorState("$.store.book[*].author")
var ran by remember { mutableStateOf(query.text) }
LaunchedEffect(query) {
    snapshotFlow { query.revision }.collectLatest {
        delay(300)
        ran = query.text
    }
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixCodeEditor(
        state = query,
        modifier = Modifier.height(96.dp),
        keyRow = PATH_KEYS,
        lineNumbers = false,
        contentDescription = "JSONPath query",
        tagKey = "query"
    )
    PantrixText(text = "Query run: $ran", color = PantrixTheme.colors.textSecondary)
}

private val PATH_KEYS: List<CodeKey> =
    listOf("$", ".", "[", "]", "*", "?", "@", "'").map { CodeKey.Text(it) } +
        listOf(CodeKey.Left, CodeKey.Right, CodeKey.Undo)
```

### The state in the app's hands

The state is in the app's hands. "Undo" and "Redo" use the editor's history, and are off while there is nothing to do. "Add debugging" changes two places in one step (`edit`), "Comment at the top" writes in one place (`replace`), and "Reset" changes the whole text (`setText`); all three are undone.

The line under it says the caret's line and column, and the line itself: the state gives them at once from the text it keeps a line at a time.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberCodeEditorState(initialText = SETTINGS)
val caret = state.selection.end
val line = state.lineOf(caret)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixButton(
            text = "Undo",
            onClick = { state.undo() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            enabled = state.canUndo,
            tagKey = "undo"
        )
        PantrixButton(
            text = "Redo",
            onClick = { state.redo() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            enabled = state.canRedo,
            tagKey = "redo"
        )
        PantrixButton(
            text = "Add debugging",
            onClick = {
                val last = state.text.lastIndexOf("null") + "null".length
                val member = ",\n  \"debug\": true"
                val note = "  // Debugging is on.\n"
                state.edit {
                    // Two places, in one step to undo: the later one first, so that the earlier one's place does not move.
                    replace(last, last, member)
                    replace(2, 2, note)
                    selection = TextRange(last + member.length + note.length)
                }
            },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "debug"
        )
        PantrixButton(
            text = "Comment at the top",
            onClick = { state.replace(0, 0, "// Formatico's settings.\n") },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "comment"
        )
        PantrixButton(
            text = "Reset",
            onClick = { state.setText(SETTINGS) },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "reset"
        )
    }
    PantrixCodeEditor(
        state = state,
        modifier = Modifier.height(280.dp),
        highlighter = JsonHighlighter,
        tagKey = "state"
    )
    PantrixText(
        text = "Line ${line + 1} of ${state.lineCount}, column ${caret - state.lineStart(line) + 1}: " +
            state.line(line).trim(),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SETTINGS = """
{
  // What the app opens with.
  "name": "Formatico",
  "version": 3,
  /* The themes it offers,
     the first one by default. */
  "themes": ["light", "dark"],
  "fontSize": 14.5,
  "telemetry": false,
  "lastOpened": null
}
""".trimStart()
```

What the code calls of the demo app itself, which an app writes for itself:

- `JsonHighlighter`: The runs of JSON with comments that are to be coloured, a line at a time: a name before a colon is a property, what is in quotes a string, `true`, `false` and `null` words of the language, numbers numbers, and line and block comments comments. `PantrixCodeEditor` knows no language: the reader its caller gives tells it what is what, and in this app this is the one that does.

### A read-only file

A file that is read and copied but not changed: it is selected, searched (Ctrl+F) and copied. It has no replace row and no row of keys on a phone; Tab moves the focus.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState

PantrixCodeEditor(
    state = rememberCodeEditorState(initialText = SETTINGS),
    modifier = Modifier.height(240.dp),
    highlighter = JsonHighlighter,
    readOnly = true,
    tagKey = "readOnly"
)

private val SETTINGS = """
{
  // What the app opens with.
  "name": "Formatico",
  "version": 3,
  /* The themes it offers,
     the first one by default. */
  "themes": ["light", "dark"],
  "fontSize": 14.5,
  "telemetry": false,
  "lastOpened": null
}
""".trimStart()
```

What the code calls of the demo app itself, which an app writes for itself:

- `JsonHighlighter`: The runs of JSON with comments that are to be coloured, a line at a time: a name before a colon is a property, what is in quotes a string, `true`, `false` and `null` words of the language, numbers numbers, and line and block comments comments. `PantrixCodeEditor` knows no language: the reader its caller gives tells it what is what, and in this app this is the one that does.

### The changes between two versions

The changes between two versions of an order, in one text, to be read: a changed line in the `Warning` tone, an added one in `Success`, one taken out in `Danger`, each with its sign in the gutter (`~`, `+`, `−`). The changed value itself stands on a fill inside its line (`CodeRangeStyle.Highlight`). The line of the change shown stays in its own tone, with its bar in the brand's colour (`bar`); the lines of the other changes are on their bands alone (`showBar`).

"Next difference" and "Previous difference" show a difference: `revealLines` brings its lines onto the screen, without moving the caret or the selection. With the caret on a marked line, the line stays on its own band. The shown difference's value also stands in a frame (`CodeRangeStyle.Current`).

A screen reader does not read the gutter's sign; each difference's line is told to it by its `CodeMark.description`: "status changed".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeeditor.CodeRangeMark
import com.pantrixui.components.data.codeeditor.CodeRangeStyle
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberCodeEditorState(initialText = ORDER)
var shown by remember { mutableIntStateOf(0) }
val lineMarks = remember(shown) {
    ORDER_CHANGES.withIndex().associate { (index, change) ->
        // The change shown stays on its own band, with its bar in the brand's colour; the others have no bar.
        val now = index == shown
        change.line to CodeMark(
            change.tone,
            bar = CodeTone.Primary,
            gutter = change.sign,
            showBar = now,
            description = change.what
        )
    }
}
val values = remember(state, shown) {
    ORDER_CHANGES.withIndex().mapNotNull { (index, change) ->
        val value = change.value ?: return@mapNotNull null
        val start = state.lineStart(change.line) + state.line(change.line).indexOf(value)
        // The shown difference's value is framed, the others only filled.
        val style = if (index == shown) CodeRangeStyle.Current else CodeRangeStyle.Highlight
        CodeRangeMark(start, start + value.length, CodeMark(change.tone), style = style)
    }
}
LaunchedEffect(shown) {
    val line = ORDER_CHANGES[shown].line
    state.revealLines(line..line)
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
    ) {
        PantrixButton(
            text = "Previous change",
            onClick = { shown = (shown + ORDER_CHANGES.size - 1) % ORDER_CHANGES.size },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "previousChange"
        )
        PantrixButton(
            text = "Next change",
            onClick = { shown = (shown + 1) % ORDER_CHANGES.size },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "nextChange"
        )
    }
    PantrixCodeEditor(
        state = state,
        modifier = Modifier.height(240.dp),
        highlighter = JsonHighlighter,
        lineMarks = lineMarks,
        rangeMarks = values,
        readOnly = true,
        tagKey = "compare"
    )
    PantrixText(
        text = "Change ${shown + 1} of ${ORDER_CHANGES.size}: ${ORDER_CHANGES[shown].what}",
        color = PantrixTheme.colors.textSecondary
    )
}

private val ORDER = """
{
  "id": "ord_8842",
  "status": "delivered",
  "createdAt": "2026-10-28T14:32:00Z",
  "deliveredAt": "2026-11-01T10:05:00Z",
  "customer": {
    "name": "Deniz Kaya",
    "email": "deniz@example.com"
  },
  "shipping": {
    "method": "standard",
    "carrier": "Kargo Ekspres",
    "tracking": "KE-4471-0093",
    "address": {
      "street": "Moda Caddesi 12",
      "district": "Kadıköy",
      "city": "İstanbul",
      "postalCode": "34710",
      "country": "TR"
    }
  },
  "payment": {
    "method": "card",
    "installments": 1,
    "captured": true
  },
  "coupon": "AUTUMN10",
  "items": [
    { "sku": "TS-001", "name": "Tişört", "qty": 2, "price": 34.90 },
    { "sku": "MG-014", "name": "Kupa", "qty": 2, "price": 14.00 },
    { "sku": "ST-220", "name": "Çıkartma", "qty": 5, "price": 1.20 }
  ],
  "subtotal": 103.80,
  "shippingCost": 0.00,
  "total": 103.80,
  "notes": "Kapıya bırakılabilir."
}
""".trimStart()

private val ORDER_CHANGES = listOf(
    OrderChange(2, CodeTone.Warning, "~", "the status changed", value = "\"delivered\""),
    OrderChange(4, CodeTone.Success, "+", "the delivery date was added"),
    OrderChange(12, CodeTone.Success, "+", "the tracking number was added"),
    OrderChange(26, CodeTone.Danger, "−", "the coupon was taken out"),
    OrderChange(29, CodeTone.Warning, "~", "the mug's price changed", value = "14.00"),
    OrderChange(30, CodeTone.Success, "+", "an item was added"),
    OrderChange(32, CodeTone.Warning, "~", "the subtotal changed", value = "103.80"),
    OrderChange(34, CodeTone.Warning, "~", "the total changed", value = "103.80")
)

private class OrderChange(
    val line: Int,
    val tone: CodeTone,
    val sign: String,
    val what: String,
    val value: String? = null
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `JsonHighlighter`: The runs of JSON with comments that are to be coloured, a line at a time: a name before a colon is a property, what is in quotes a string, `true`, `false` and `null` words of the language, numbers numbers, and line and block comments comments. `PantrixCodeEditor` knows no language: the reader its caller gives tells it what is what, and in this app this is the one that does.

### Long lines go on under themselves

A file of long lines: a JSON object on one line and a long description. With wrapping off, the code scrolls sideways; with it on (`softWrap`), a long line goes on under itself as wide as the editor, its rest starting where the code starts, with no number in the gutter. Up and Down move the caret a row at a time as the rows are shown.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var wraps by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = wraps,
        onCheckedChange = { wraps = it },
        label = "Wrap long lines",
        tagKey = "wrap"
    )
    PantrixCodeEditor(
        state = rememberCodeEditorState(initialText = LONG_LINES),
        modifier = Modifier.height(240.dp),
        highlighter = JsonHighlighter,
        readOnly = true,
        softWrap = wraps,
        tagKey = "softWrap"
    )
}

private val LONG_LINES = """
{
  "description": "Formatico reads JSON, YAML, TOML and XML, checks them against their schemas, and converts one into another without losing a comment or the order of the keys.",
  "settings": {"theme": "dark", "fontSize": 14.5, "wrapLongLines": true, "telemetry": false, "lastOpened": ["order.json", "order-v2.json", "settings.toml"]},
  "notes": "A line too long for the window goes on under itself when lines wrap, and the code scrolls sideways when they do not."
}
""".trimStart()
```

What the code calls of the demo app itself, which an app writes for itself:

- `JsonHighlighter`: The runs of JSON with comments that are to be coloured, a line at a time: a name before a colon is a property, what is in quotes a string, `true`, `false` and `null` words of the language, numbers numbers, and line and block comments comments. `PantrixCodeEditor` knows no language: the reader its caller gives tells it what is what, and in this app this is the one that does.

### With a syntax, colours and a style of its own

An INI file with a syntax of its own: a square bracket opens a section's name and `#` a comment, and its reader is in the example itself. The indent is four spaces, and a bracket that is typed is not closed. The row of keys on a phone keeps Tab, the arrows and undo, and adds `=`.

Its colours are its own: the ground is the theme's soft `info` fill, and the caret's line stands out more. Its style has square corners and a thick edge.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeToken
import com.pantrixui.components.data.codeblock.CodeTokenKind
import com.pantrixui.components.data.codeeditor.CodeEditorColors
import com.pantrixui.components.data.codeeditor.CodeEditorStyle
import com.pantrixui.components.data.codeeditor.CodeHighlight
import com.pantrixui.components.data.codeeditor.CodeHighlighter
import com.pantrixui.components.data.codeeditor.CodeKey
import com.pantrixui.components.data.codeeditor.CodeSyntax
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeSpec

val colors = PantrixTheme.colors
PantrixCodeEditor(
    state = rememberCodeEditorState(initialText = INI),
    modifier = Modifier.height(220.dp),
    highlighter = IniHighlighter,
    syntax = CodeSyntax(brackets = "[]", quotes = "\"", lineComment = "#"),
    indent = "    ",
    closesPairs = false,
    keyRow = CodeKey.DefaultRow.filterNot { it is CodeKey.Text } + CodeKey.Text("="),
    style = CodeEditorStyle(shape = ShapeSpec.Fixed(RectangleShape), borderWidth = 2.dp),
    colors = CodeEditorColors(
        container = colors.info.container,
        currentLine = colors.info.color.copy(alpha = 0.15f)
    ),
    tagKey = "ini"
)

private object IniHighlighter : CodeHighlighter<Unit> {
    override val initialState = Unit

    override fun highlight(
        line: String,
        state: Unit
    ): CodeHighlight<Unit> {
        val code = line.trimStart()
        val start = line.length - code.length
        val equals = line.indexOf('=')
        val tokens = when {
            code.startsWith("#") -> {
                listOf(CodeToken(start, line.length, CodeTokenKind.Comment))
            }

            code.startsWith("[") -> {
                listOf(CodeToken(start, line.length, CodeTokenKind.Tag))
            }

            equals > 0 -> {
                listOf(
                    CodeToken(start, equals, CodeTokenKind.Property),
                    CodeToken(equals + 1, line.length, CodeTokenKind.StringLiteral)
                )
            }

            else -> {
                emptyList()
            }
        }
        return CodeHighlight(tokens, state)
    }
}

private val INI = """
# Formatico
[editor]
indent = 2
theme = "dark"

[files]
recent = 10
""".trimStart()
```

### A large document

A document of fifty thousand lines: it opens, scrolls and is typed in at once. Only the lines on the screen are built; the field the keyboard writes in holds a few hundred lines round the caret, and the editor draws the rest itself. The reader reads the lines in the background, the ones on the screen first.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.CodeEditorState
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor

val state = remember { CodeEditorState(LARGE) }
PantrixCodeEditor(
    state = state,
    modifier = Modifier.height(420.dp),
    highlighter = JsonHighlighter,
    tagKey = "large"
)

private val LARGE: String = buildString {
    append("[\n")
    for (index in 0 until 50_000) {
        append("  {\"id\": ").append(index).append(", \"name\": \"item number ").append(index)
        append("\", \"active\": ").append(index % 3 == 0).append(", \"score\": ").append(index * 7 % 1000)
        append(if (index < 49_999) "},\n" else "}\n")
    }
    append("]")
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `JsonHighlighter`: The runs of JSON with comments that are to be coloured, a line at a time: a name before a colon is a property, what is in quotes a string, `true`, `false` and `null` words of the language, numbers numbers, and line and block comments comments. `PantrixCodeEditor` knows no language: the reader its caller gives tells it what is what, and in this app this is the one that does.

## API

### PantrixCodeEditor

`import com.pantrixui.components.data.codeeditor.PantrixCodeEditor`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCodeEditor(
    state: CodeEditorState,
    modifier: Modifier = Modifier,
    highlighter: CodeHighlighter<*>? = null,
    syntax: CodeSyntax = CodeSyntax(),
    lineMarks: Map<Int, CodeMark> = emptyMap(),
    rangeMarks: List<CodeRangeMark> = emptyList(),
    indent: String = "  ",
    closesPairs: Boolean = true,
    keyRow: List<CodeKey> = CodeKey.DefaultRow,
    lineNumbers: Boolean = true,
    readOnly: Boolean = false,
    enabled: Boolean = true,
    textStyle: TextStyle? = null,
    style: CodeEditorStyle? = null,
    colors: CodeEditorColors? = null,
    contentDescription: String? = null,
    softWrap: Boolean = false,
    tagKey: String? = null
)
```

Code to be written and changed: a text of any length, a line to a line, each run of it in the colour of what it is, its lines numbered, and the line the caret is on marked where it has no mark of the app's.

The editor does not know the language it shows. What colours the code is the `highlighter` its caller gives, which reads a line at a time from the state the line before ended in; the editor reads the lines away from the main thread, and after an edit only as far as the edit changed what the next line is read from.

The text is the `state`'s, kept a line at a time: a text of many megabytes opens at once and is typed in as a short one is. Only the lines on the screen are built, and the text field that takes the keyboard holds a window of lines round the caret, which moves with it; the lines outside it are drawn by the editor. A press on one of them puts the caret there, a press with Shift held selects as far as there, and a drag selects as far as the pointer goes.

The keys are an editor's: Tab indents by one step of `indent` and Shift+Tab takes it out, the lines of a selection all at once; a line feed carries the line's indent on; undo and redo take a word of typing at a time; Ctrl+Home and Ctrl+End, Cmd+Up and Cmd+Down on a Mac, go to the text's two ends. Alt+Up and Alt+Down move the selection's lines, and with Shift copy them; Ctrl+Shift+K takes them out. After Escape, Tab moves the focus on and Shift+Tab back, so that the keyboard can always leave.

What the editor knows of the language is its `syntax`: the brackets and quotes it closes as they are typed and pairs, and the comments Ctrl+/ puts in and takes out.

Ctrl+F (Cmd+F on a Mac) opens the find bar over the lines, with what is selected as its search, and Ctrl+H (Cmd+Option+F) with its replace row; the state's `CodeEditorState.find` opens it from an app's own button. While it is open, every match is marked in the text and on the scroll bar; F3 and Ctrl+G go to the next match and with Shift to the one before, from the bar or from the code. The state finds and replaces the same way without the bar: `findNext`, `replaceNext`, `replaceAll` and `findAll`. In a browser these keys and the editor's others are its own: Ctrl+F opens no find bar of the browser's as well (`keepFromBrowser`).

On a phone, a row of keys stands at the editor's foot while it has the focus, or on the keyboard's top edge where the keyboard covers the foot: the `keyRow`, what code is written with and a phone's keyboard keeps a page or two away. Its keys type as the keyboard does, with the editor's help, and never take the focus from the code. In a page that scrolls, the caret is shown with the row's room under it.

A screen reader reads the lines round the caret as the text field's, and a line outside them, on the screen after a scroll, as one it can press, which puts the caret at its start. It says the message of a mark as the caret comes into the mark, and which match of how many the find bar has selected as it steps; the line numbers it does not read.

A line too long for the editor is not broken: the code scrolls sideways, under line numbers that stay where they are. With `softWrap` it goes on under itself instead, a row at a time from where the code starts, with its number by its first row: Up and Down then move the caret a row at a time, and Home and End to the ends of its row. A line of more than ten thousand characters is shown that far, and kept whole.

The editor fills the width it is given, and scrolls inside the height it is given. With no height, in a page that scrolls, it is no taller than the window.

Code is written from left to right in every language, and so are its lines here.

An app brings lines onto the screen without moving the caret with `CodeEditorState.revealLines`: a comparison that goes from one difference to the next, marked on its lines, shows it there and leaves the selection as it was.

```kotlin
val state = rememberCodeEditorState(initialText = settings)
PantrixCodeEditor(state = state, modifier = Modifier.height(320.dp), tagKey = "settings")
```

Parameters:

- `state: CodeEditorState`: the text, the selection and the history. Create it with `rememberCodeEditorState`.
- `modifier: Modifier`: the editor's modifier. A height given here is the room the code scrolls in.
- `highlighter: CodeHighlighter<*>?`: what colours the code: the runs of each line and what each is. None by default, and the code is written in one colour.
- `syntax: CodeSyntax`: the language's brackets, quotes and comments: round, square and curly brackets and the two quotes by default, and no comments.
- `lineMarks: Map<Int, CodeMark>`: what is said about whole lines, by the line's place counted from nought: a band behind the line in the soft fill of the mark's tone, a bar down its left edge, the mark's sign before the line's number, and the line written in the one colour the theme pairs with that fill. The mark's message shows while the caret is on the line. A marked line stays on its band with the caret on it: the band of the caret's line is drawn on a line without a mark of its own, and only while the editor has the focus, when the caret is drawn.
- `rangeMarks: List<CodeRangeMark>`: what is said about stretches of the text: a wavy line under each in the colour of its tone and a dot before its line, or a fill behind it, as its `CodeRangeMark.style` says, over the band of the caret's line, and its message while the caret is in it or a mouse is over it. The marks are drawn where they are told: an app that checks the text after each change gives the marks of the new text.
- `indent: String`: one step of indent: two spaces by default, or as many as the code is indented by, or a tab. A tab is drawn as wide as the type draws one.
- `closesPairs: Boolean`: whether a bracket or a quote that is typed is closed at once, and a closing one the editor put in typed over.
- `keyRow: List<CodeKey>`: the keys of the row at the editor's foot while it has the focus on a platform used by touch: Tab, the brackets and signs code is written with, undo and redo, and the arrows, by default. An empty list shows no row, and neither does an editor whose text cannot be changed.
- `lineNumbers: Boolean`: whether each line carries its number before the code.
- `readOnly: Boolean`: whether the text can be selected and copied but not changed.
- `enabled: Boolean`: whether the editor takes the focus at all. A disabled editor is written in the theme's colour for what cannot be used.
- `textStyle: TextStyle?`: what the code is set in: the theme's `code` where it is not given.
- `style: CodeEditorStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CodeEditorColors?`: this editor's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `contentDescription: String?`: what a screen reader calls the editor: "Code editor" in the theme's language where it is not given. Where a keyboard writes in the code, the screen reader is also told that Tab indents, and that Escape and then Tab leave the editor.
- `softWrap: Boolean`: whether a line too long for the editor goes on under itself, a row at a time, rather than the code scrolling sideways: for a narrow screen, or a text of long lines that is read more than its columns are. A line broken where the room ends loses what its indent says, and its rows start where the code does. Off by default.
- `tagKey: String?`: the editor's automation key: its text field, which takes the keyboard, is `CodeEditor_<tagKey>`, and a line outside the window `CodeEditor_<tagKey>.Line_<number>`. The row's own keys are `CodeEditor_<tagKey>.IconButton_<name>`: `tab`, `undo`, `redo`, `left`, `up`, `down` and `right`; a key of text is `CodeEditor_<tagKey>.Button_text<place>`, by its place in the row counted from nought.

### CodeEditorState

`import com.pantrixui.components.data.codeeditor.CodeEditorState`, from `com.pantrixui:components`

```kotlin
class CodeEditorState(
    initialText: String = "",
    initialSelection: TextRange = TextRange.Zero
)
```

What a code editor holds: its text, its selection, and the steps the text went through, to be undone and made again.

The text is kept a line at a time, in chunks of lines, so that a keystroke in a text of many megabytes costs the lines of one chunk and not the whole text. `text` is the whole of it, made when it is asked for and kept until the next change: a screen that reads it on every change of a long text listens to `revision` instead, and reads `text` once the typing has paused.

A place in the text counts its characters from nought. A line ends at a line feed, and every line feed starts a line: a text that ends with one has an empty line after it. A carriage return, alone or before a line feed, is kept as a line feed, in the text the state starts with and in every text put in later.

Every change of the text is a step of its history, undone by `undo` and made again by `redo`. Typing is undone a word at a time, and so are characters taken out a key at a time; `edit` makes one step of any number of changes.

Create it with `rememberCodeEditorState`.

Parameters:

- `initialText: String`: the text the editor starts with.
- `initialSelection: TextRange`: where the selection starts: the caret at the text's start by default.

Members:

- `revision: Int`: How many times the text has changed since the state was made: by typing, by `edit` and the calls made with it, by `undo` and `redo`. A selection that moves does not count. It is what a screen listens to where it does something after each change, and reads `text` only then.
- `lineCount: Int`: How many lines the text has: one at least, for a text of nothing.
- `length: Int`: How many characters the text has, its line feeds among them.
- `text: String`: The whole text, its lines joined by line feeds.
- `selection: TextRange`: The selection: from `TextRange.start`, where it was started, to `TextRange.end`, where the caret is. The two are one place where nothing is selected, and the start is after the end in a selection made backwards. A place outside the text is set as the text's nearest end.
- `canUndo: Boolean`: Whether there is a step of the text to undo.
- `canRedo: Boolean`: Whether there is an undone step to make again.
- `find: CodeFind`: The editor's find bar: whether it is open, what it looks for, and what it puts in place of a match.
- `fun revealLines(lines: IntRange)`: Scrolls the editor that shows this state so that `lines`, counted from nought, are on its screen, as little as that takes, and the first of them at the top where they are more than the screen holds. An empty range shows the line at its first: where a difference of a comparison has no lines on one side, the line it would come before. Lines past the text's end are its last.

  The caret and the selection stay where they are: a comparison that goes from one difference to the next shows each, marked on its lines, and moves nothing of the reader's.

  ```kotlin
  LaunchedEffect(state, shown) { state.revealLines(difference.lines) }
  ```

  An editor that is not laid out yet brings the lines on once it is.
- `fun line(index: Int): String`: The line at `index`, counted from nought, without the line feed that ends it.
- `fun lineStart(index: Int): Int`: The place of the first character of the line at `index`, counted from nought: with `lineOf`, how a line and a column that a check reports become a place in the text, and back.
- `fun lineOf(offset: Int): Int`: The place, counted from nought, of the line that `offset` is on. The place at a line's end, before its line feed, is on that line; the one after the line feed is on the next.
- `fun replace(start: Int, end: Int, text: String)`: Takes out the characters from `start` up to `end` and puts `text` in their place, as one step of the history. The selection moves with the text around it, as `CodeEditorBuffer.replace` moves it.
- `fun setText(text: String)`: Puts `text` in place of the whole text, as one step of the history: a text that was made from this one, as a formatter makes one, is undone as the user's own changes are. The caret stays at the place it was at, or at the new text's end where that is shorter.
- `fun edit(block: CodeEditorBuffer.() -> Unit)`: Makes the changes `block` makes, as one step of the history: a fix of several places is undone at once.

  ```kotlin
  state.edit {
      replace(at, at + 4, "true")
      replace(end, end, ",")
  }
  ```

  A block that changes nothing makes no step, and the selection it sets is the state's all the same.
- `fun undo()`: Takes back the last step of the text, and puts the selection back where it was before it.
- `fun redo()`: Makes the last step that was undone again, and puts the selection where it was after it.

### rememberCodeEditorState

`import com.pantrixui.components.data.codeeditor.rememberCodeEditorState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberCodeEditorState(initialText: String = ""): CodeEditorState
```

A `CodeEditorState` that lasts as long as the screen that made it.

It is not kept across a process that is brought back: a text of many megabytes does not fit where Android keeps a screen's state. A screen whose text must outlive its process keeps the text itself, as it keeps a file.

Parameters:

- `initialText: String`: the text the editor starts with. It is read once, when the state is made.

### CodeEditorBuffer

`import com.pantrixui.components.data.codeeditor.CodeEditorBuffer`, from `com.pantrixui:components`

```kotlin
class CodeEditorBuffer
```

The text of a `CodeEditorState` while `CodeEditorState.edit` changes it: what it holds now, with the changes made so far, and the calls that change it.

Each place a call is given counts the characters of the text as the changes before it left it.

Members:

- `selection: TextRange`: The selection the state will have after the block: as it was, moved along by each change. Setting it says where it is to be; a place outside the text is set as the text's nearest end.
- `lineCount: Int`: How many lines the text has now.
- `length: Int`: How many characters the text has now, its line feeds among them.
- `fun line(index: Int): String`: The line at `index` as the text is now, without its line feed.
- `fun lineStart(index: Int): Int`: The place of the first character of the line at `index`, as the text is now.
- `fun lineOf(offset: Int): Int`: The place of the line that `offset` is on, as the text is now.
- `fun replace(start: Int, end: Int, text: String)`: Takes out the characters from `start` up to `end` and puts `text` in their place. A carriage return in `text`, alone or before a line feed, goes in as a line feed.

  The selection moves with the text around it: an end of it before `start` stays, one at or after `end` moves by as many characters as the text grew or shrank, and one inside the characters taken out goes to the end of what was put in. A caret at `start` where nothing is taken out ends up after what was put in, as it does when the same text is typed there.

### CodeHighlighter

`import com.pantrixui.components.data.codeeditor.CodeHighlighter`, from `com.pantrixui:components`

```kotlin
interface CodeHighlighter<S : Any>
```

Reads the code of a language a line at a time and says what each run of a line is, for a code editor to colour it by.

A line is read from the state the line before it ended in: inside a comment of several lines, inside a string, in a table of a file that has tables, whatever the language carries from one line to the next. The first line is read from `initialState`. The editor keeps the state each line ended in, and reads a line again only when the line changed or the state before it did: after an edit it reads on from the edited line until a line ends in the state it ended in before, and keeps what follows as it was.

States are told apart by `equals`: a state is a value, an enum, an object or a data class, and two states that read the next line alike are equal. A state that holds more than the next line needs, a count of the lines read or the text of the line, is never equal to the one before, and an edit is then read on to the text's end.

The editor reads the lines away from the main thread, some thousands at a time from the first, and a line that comes on the screen before its turn is read from `initialState` until its turn comes. `highlight` is called from any thread, and keeps nothing from one call to the next: what one line hands the next is in the state.

```kotlin
object IniHighlighter : CodeHighlighter<Unit> {
    override val initialState = Unit
 
    override fun highlight(line: String, state: Unit): CodeHighlight<Unit> {
        val tokens = when {
            line.startsWith(";") -> listOf(CodeToken(0, line.length, CodeTokenKind.Comment))
            line.startsWith("[") -> listOf(CodeToken(0, line.length, CodeTokenKind.Type))
            else -> listOf(CodeToken(0, line.indexOf('=').coerceAtLeast(0), CodeTokenKind.Property))
        }
        return CodeHighlight(tokens, state)
    }
}
```

Members:

- `initialState: S`: The state the first line is read from.
- `fun highlight(line: String, state: S): CodeHighlight<S>`: The runs of `line` that have a colour, and the state the line ends in.

  `line`: the line, without the line feed that ends it, and whole however long it is.

  `state`: the state the line before ended in, or `initialState` for the first line.

### CodeHighlight

`import com.pantrixui.components.data.codeeditor.CodeHighlight`, from `com.pantrixui:components`

```kotlin
data class CodeHighlight<S : Any>(
    public val tokens: List<CodeToken>,
    public val state: S
)
```

What a `CodeHighlighter` read in a line: the runs that have a colour, and the state the line ends in.

Parameters:

- `tokens: List<CodeToken>`: The runs of the line that have a colour, placed by the line's own characters. Where two lie over the same characters the later one colours them.
- `state: S`: What the line hands the next.

### CodeSyntax

`import com.pantrixui.components.data.codeeditor.CodeSyntax`, from `com.pantrixui:components`

```kotlin
data class CodeSyntax(
    public val brackets: String = "()[]{}",
    public val quotes: String = "\"'",
    public val lineComment: String? = null,
    public val blockCommentStart: String? = null,
    public val blockCommentEnd: String? = null
)
```

What a `PantrixCodeEditor` knows of the language it shows, for the help it gives while the code is written: the brackets that open and close, the quotes a string stands between, and how a comment is written.

A bracket or a quote that is typed is closed at once where what follows the caret is a space, the line's end or a closing bracket, and a closing one the editor put in is typed over. Typed over a selection, the two go round it. A line feed typed after an opening bracket indents the new line one step more than the line it was typed in, and puts the closing bracket that followed the caret on a line of its own. The caret by a bracket marks the one it pairs with, and Ctrl+Shift+\ (Cmd+Shift+\ on a Mac) goes there.

Ctrl+/ (Cmd+/ on a Mac) comments the selection's lines out, or in again: with `lineComment` before each, or, where the language has only comments that close, as XML has, with `blockCommentStart` before the first and `blockCommentEnd` after the last.

A bracket or a quote in a string or a comment, as the editor's highlighter reads them, is not closed and not paired.

```kotlin
val jsonc = CodeSyntax(lineComment = "//")
val yaml = CodeSyntax(lineComment = "#")
val xml = CodeSyntax(brackets = "", blockCommentStart = "<!--", blockCommentEnd = "-->")
```

Parameters:

- `brackets: String`: The language's brackets, each opening one followed by the one that closes it: round, square and curly ones by default.
- `quotes: String`: The characters a string stands between, each closing what it opens: double and single quotes by default. One typed after a letter or a digit, as an apostrophe is, is not closed.
- `lineComment: String?`: What starts a comment that runs to the line's end, or nothing where the language has none.
- `blockCommentStart: String?`: What opens a comment that is closed, or nothing: given with `blockCommentEnd`.
- `blockCommentEnd: String?`: What closes a comment that `blockCommentStart` opened.

### CodeRangeMark

`import com.pantrixui.components.data.codeeditor.CodeRangeMark`, from `com.pantrixui:components`

```kotlin
data class CodeRangeMark(
    public val start: Int,
    public val end: Int,
    public val mark: CodeMark,
    public val style: CodeRangeStyle = CodeRangeStyle.Underline
)
```

What is said about a stretch of an editor's text: a wavy line under it in the colour of the `mark`'s tone and a dot before its line, or a fill behind it, as its `style` says, and the mark's message, shown while the caret is in the stretch or a pointer is over it.

```kotlin
// A finding of the app's own check, from where the text stopped being JSON to the line's end:
CodeRangeMark(start = fault.offset, end = state.lineStart(fault.line) + state.line(fault.line).length,
    mark = CodeMark(CodeTone.Danger, message = fault.message))
// The value a comparison found changed, on its line's band:
CodeRangeMark(value.start, value.end, CodeMark(CodeTone.Warning), style = CodeRangeStyle.Highlight)
```

The places are those of the text the editor shows. A mark is drawn where it is told, and an edit does not move it: an app that checks the text after each change gives the marks of the new text.

Parameters:

- `start: Int`: The place of the first character of the stretch, counted from nought.
- `end: Int`: The place after its last character. A stretch of nothing is marked as wide as a character, where something is missing.
- `mark: CodeMark`: What the stretch is said to be: its tone, its message and what said so.
- `style: CodeRangeStyle`: How the stretch is marked: a wavy line under it by default.

### CodeRangeStyle

`import com.pantrixui.components.data.codeeditor.CodeRangeStyle`, from `com.pantrixui:components`

```kotlin
enum class CodeRangeStyle
```

How a `CodeRangeMark` marks its stretch of the text.

Entries:

- `Underline`: A wavy line under the stretch in the colour of its mark's tone, and a dot before its line: what a check found, which the eye is to find in a long text.
- `Highlight`: A fill behind the stretch, a share of the colour of its mark's tone with its corners rounded, which the code reads through, and no dot: the part of a line that is meant, as the value a comparison found changed.
- `Current`: The fill of `Highlight` with a frame around it in the colour of its mark's tone: the one stretch among several highlighted alike that the app is at, as the match of a search it has moved to.

### CodeMarkAction

`import com.pantrixui.components.data.codeblock.CodeMarkAction`, from `com.pantrixui:components`

```kotlin
class CodeMarkAction(
    public val label: String,
    public val onClick: () -> Unit
)
```

What can be done about what a `CodeMark` says: a button under its message, named by `label`, that runs `onClick`.

Parameters:

- `label: String`: What the action does, in a few words: `Add the comma`.
- `onClick: () -> Unit`: What the action does. The editor gives the focus back to its text after it.

### CodeSearch

`import com.pantrixui.components.data.codeeditor.CodeSearch`, from `com.pantrixui:components`

```kotlin
data class CodeSearch(
    public val text: String = "",
    public val matchCase: Boolean = false,
    public val wholeWord: Boolean = false,
    public val regex: Boolean = false
)
```

What is looked for in a code editor's text: `text`, as it is written or as a regular expression, within a line.

A match never runs over the end of a line, and a match of no characters is passed over.

```kotlin
val search = CodeSearch("\"name\":\\s*\"(\\w+)\"", regex = true)
state.findNext(search)
state.replaceAll(search, replacement = "\"name\": \"$1-copy\"")
```

Parameters:

- `text: String`: What is looked for. Nothing is found for an empty one.
- `matchCase: Boolean`: Whether a capital matches only a capital, and a small letter only a small one.
- `wholeWord: Boolean`: Whether a match stands only where no letter, digit or underscore is beside it.
- `regex: Boolean`: Whether `text` is a regular expression, read as the platform's regular expressions read it.

Members:

- `isValid: Boolean`: Whether `text` can be looked for: it is not a regular expression, or it is one that can be read.

### CodeEditorState.findNext

`import com.pantrixui.components.data.codeeditor.findNext`, from `com.pantrixui:components`

```kotlin
fun CodeEditorState.findNext(
    search: CodeSearch,
    backwards: Boolean = false
): TextRange?
```

Selects the first match of `search` after the selection, or the last one before it where the search goes `backwards`, going on from the other end of the text where there is none, and returns it. Nothing is selected, and nothing returned, where the text has no match or `search` cannot be looked for.

Parameters:

- `search: CodeSearch`
- `backwards: Boolean`

### CodeEditorState.findAll

`import com.pantrixui.components.data.codeeditor.findAll`, from `com.pantrixui:components`

```kotlin
fun CodeEditorState.findAll(
    search: CodeSearch,
    limit: Int = Int.MAX_VALUE
): List<TextRange>
```

The matches of `search` in the text, in their order, as many as `limit` at most.

Parameters:

- `search: CodeSearch`
- `limit: Int`

### CodeEditorState.replaceNext

`import com.pantrixui.components.data.codeeditor.replaceNext`, from `com.pantrixui:components`

```kotlin
fun CodeEditorState.replaceNext(
    search: CodeSearch,
    replacement: String
): TextRange?
```

Puts `replacement` in place of the selection where it is a match of `search`, and selects the next match; selects the next match alone where the selection is none. Returns the match selected, or nothing where there is none.

In a regular expression's `replacement`, `$1` stands for what its first group matched, `$0` for the whole match, and `$$` for a dollar sign.

Parameters:

- `search: CodeSearch`
- `replacement: String`

### CodeEditorState.replaceAll

`import com.pantrixui.components.data.codeeditor.replaceAll`, from `com.pantrixui:components`

```kotlin
fun CodeEditorState.replaceAll(
    search: CodeSearch,
    replacement: String
): Int
```

Puts `replacement` in place of every match of `search`, as one step of the history, and returns how many were replaced. In a regular expression's `replacement`, `$1` stands for what its first group matched, as in `replaceNext`.

Parameters:

- `search: CodeSearch`
- `replacement: String`

### CodeFind

`import com.pantrixui.components.data.codeeditor.CodeFind`, from `com.pantrixui:components`

```kotlin
class CodeFind
```

The find bar of the editor that shows a `CodeEditorState`: whether it is open, what it looks for, and what it puts in place of a match.

Ctrl+F opens it and Ctrl+H opens it with its replace row, Cmd+F and Cmd+Option+F on a Mac; Escape closes it. An app opens it from a button of its own, as it must on a phone, whose keyboard has no Ctrl:

```kotlin
PantrixIconButton(PantrixIcons.Search, contentDescription = strings.search, onClick = { state.find.open() })
```

While it is open, the editor marks every match in the text and on its scroll bar, and selects the first match from the selection on as the search is typed.

Members:

- `isOpen: Boolean`: Whether the bar is open.
- `replacing: Boolean`: Whether the bar shows its replace row: never in an editor whose text cannot be changed.
- `search: CodeSearch`: What the bar looks for: the text of its search field and its three switches. Setting it writes them.
- `replacement: String`: What the bar puts in place of a match: the text of its replace field.
- `fun open(replacing: Boolean = false)`: Opens the bar, with its replace row where `replacing` is, and gives its search field the focus.
- `fun close()`: Closes the bar. The editor stops marking the matches.

### CodeKey

`import com.pantrixui.components.data.codeeditor.CodeKey`, from `com.pantrixui:components`

```kotlin
sealed interface CodeKey
```

A key of the row a code editor shows at its foot on a phone, over the keyboard, while it has the focus: what code is written with and a phone's keyboard keeps a page or two away, or has not at all.

A `Text` key types its text as the keyboard types it, with the editor's help: an opening bracket or a quote is closed, and a closing one the editor put in is typed over. The others are the editor's own: `Tab`, `Undo`, `Redo` and the four arrows, which go on moving the caret while they are held. `DefaultRow` is the row of an editor whose call gives none of its own.

```kotlin
val pathKeys = listOf(CodeKey.Text("$"), CodeKey.Text("."), CodeKey.Text("["), CodeKey.Text("]"), CodeKey.Left)
```

On the type:

- `CodeKey.DefaultRow: List<CodeKey>`: The row of an editor whose call gives none of its own: Tab; the brackets, the quote and the signs JSON, XML and most code are written with; undo and redo; and the arrows.

#### CodeKey.Text

```kotlin
data class Text(val text: String) : CodeKey
```

A key that types `text` in place of the selection, as the keyboard would.

Parameters:

- `text: String`: What the key types, and what is written on it.

#### CodeKey.Tab

```kotlin
data object Tab : CodeKey
```

Indents by one step, the lines of a selection all at once, as the keyboard's Tab does.

#### CodeKey.Undo

```kotlin
data object Undo : CodeKey
```

Takes the last change back.

#### CodeKey.Redo

```kotlin
data object Redo : CodeKey
```

Makes a change taken back again.

#### CodeKey.Left

```kotlin
data object Left : CodeKey
```

Moves the caret a character to the left, or to the start of the selection.

#### CodeKey.Right

```kotlin
data object Right : CodeKey
```

Moves the caret a character to the right, or to the end of the selection.

#### CodeKey.Up

```kotlin
data object Up : CodeKey
```

Moves the caret a line up, in the column it was in before where the line is long enough: from the first line, to the text's start.

#### CodeKey.Down

```kotlin
data object Down : CodeKey
```

Moves the caret a line down, in the column it was in before where the line is long enough: from the last line, to the text's end.

### CodeEditorStyle

`import com.pantrixui.components.data.codeeditor.CodeEditorStyle`, from `com.pantrixui:components`

```kotlin
class CodeEditorStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val gutterGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val focusedBorderWidth: Dp = Dp.Unspecified,
    public val barWidth: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<CodeEditorStyle>
```

`PantrixCodeEditor`'s geometry: the room around its lines, the room before the code where the lines are numbered, and the edge.

The lines stand close, as lines of code do, and every line is as tall as every other: a line of the theme's code type is 20dp, with what `linePadding` adds over and under it. A finger places the caret in the line it touches, and the field's own handles move it from there.

The corners are the card's on each platform, as a code block's are: medium on Android, large on iOS, small on the desktop and the web. The edge is a field's: thicker while the editor has the focus.

The paddings and the gap follow the density, since they are the room around the words. The widths of the edge and of a mark's bar, the icons' size and the shape do not.

Parameters:

- `shape: ShapeSpec`: The corners of the editor: a step of the brand's shape scale, or a fixed shape.
- `horizontalPadding: Dp`: The room between the editor's sides and what it holds: the line numbers at the start, the end of the longest line at the end.
- `verticalPadding: Dp`: The room over the first line and under the last.
- `linePadding: Dp`: The room over and under the words of each line.
- `gutterGap: Dp`: Between the line numbers and the code.
- `borderWidth: Dp`: The width of the edge around the editor. Zero draws none.
- `focusedBorderWidth: Dp`: The width of the edge while the editor has the focus: the edge is what shows it.
- `barWidth: Dp`: The width of the bar a marked line carries down its left edge. Zero draws none.
- `iconSize: Dp`: The width and height of the icon before a mark's message.

### CodeEditorColors

`import com.pantrixui.components.data.codeeditor.CodeEditorColors`, from `com.pantrixui:components`

```kotlin
data class CodeEditorColors(
    public val container: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val comment: Color = Color.Unspecified,
    public val keyword: Color = Color.Unspecified,
    public val type: Color = Color.Unspecified,
    public val string: Color = Color.Unspecified,
    public val number: Color = Color.Unspecified,
    public val punctuation: Color = Color.Unspecified,
    public val annotation: Color = Color.Unspecified,
    public val property: Color = Color.Unspecified,
    public val tag: Color = Color.Unspecified,
    public val lineNumber: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val focusedBorder: Color = Color.Unspecified,
    public val currentLine: Color = Color.Unspecified,
    public val cursor: Color = Color.Unspecified,
    public val selection: Color = Color.Unspecified,
    public val matchingBracket: Color = Color.Unspecified,
    public val match: Color = Color.Unspecified
)
```

What a `PantrixCodeEditor` is painted with, for an editor that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// An app's own colours for its keys and its strings:
PantrixCodeEditor(state = state, colors = CodeEditorColors(property = brand.key, string = brand.string))
```

The code is coloured as a `CodeBlockColors` colours it, and by the same rules: on the theme's own grounds each kind of token has a colour of the theme's roles, and on a fill of another colour all the code is written in the one colour that reads there.

Parameters:

- `container: Color`: The fill behind the lines: the theme's `surface`.
- `text: Color`: What no token colours. The theme's `textPrimary`.
- `comment: Color`: A comment, which is slanted too. The theme's `textSecondary`.
- `keyword: Color`: A word of the language. The theme's primary role.
- `type: Color`: The name of a type. The theme's info role.
- `string: Color`: A string. The theme's success role.
- `number: Color`: A number. The theme's warning role.
- `punctuation: Color`: Brackets, commas and semicolons. The theme's `textSecondary`.
- `annotation: Color`: A name that says something about what follows it. The theme's danger role.
- `property: Color`: The name of a member or a setting. The colour of a `type` where it is not set.
- `tag: Color`: The name of an element of a markup. The colour of a `keyword` where it is not set.
- `lineNumber: Color`: The line numbers and the mark of a line too long to show whole. The theme's `textSecondary`.
- `border: Color`: The edge around the editor: the theme's `border`, as a field's, and on a fill a share of what is written there.
- `focusedBorder: Color`: The edge while the editor has the focus. The theme's primary role.
- `currentLine: Color`: The band behind the line the caret is on, while the editor has the focus: a share of the text's colour, which reads on any fill.
- `cursor: Color`: The caret, which the handles of a selection take too. The theme's primary role.
- `selection: Color`: The fill behind what is selected: the caret's colour, as faint as the theme's selection.
- `matchingBracket: Color`: The edge round the bracket by the caret and round the one it pairs with: a share of the text's colour, which reads on any fill.
- `match: Color`: The fill behind each match of the find bar's search, and, at its full strength, the tick of a line with a match on the scroll bar: a share of the theme's warning role.
