# Diff View

Two texts compared line by line: the lines the second took out of the first, put in and wrote otherwise, side by side in a wide view and in one column in a narrow one. The two columns scroll together. Two versions of a file, a change to a setting, a response against the one before it are read this way.

- `PantrixDiffView` (`com.pantrixui.components.data.diffview`, `com.pantrixui:components`): Two texts compared line by line: removed, added and changed lines side by side or in one column, changed words marked, unchanged runs folded, and the changes to go to. Keywords: diff, compare, side by side, changes, text comparison, merge view, version history.

## Features

- **Lines.** A line taken out is on the danger role's soft fill with a − before it; one put in on the success role's, with a +. A line written otherwise stands across from the line it was; its changed words are on a stronger fill of the same role. Across from a line one text alone has, the room is crossed with thin lines.
- **Layout.** `layout` sets the texts out by the view's own width, at the window's breakpoints: side by side from Medium, in one column below it (`DiffLayout.Adaptive`); `SideBySide` and `Unified` always set them out so. In one column a change's lines taken out come first, and the lines it put in under them.
- **Folded lines.** `context` unchanged lines, three by default, stay before and after each change; the rest fold into one row that says how many there are, and a press opens it. `context = null` folds nothing.
- **Numbers and colours.** Each line carries its number in its own text, both numbers in one column. `highlighter` colours the unchanged lines as a code editor's does; the changed lines are written in the one colour that reads on their fill.
- **Long lines.** A line too long for its column goes on under itself, and the row takes the taller side's height. `softWrap = false` scrolls the two columns sideways together.
- **Changes.** `rememberDiffViewState` is the view's state: `changes` gives the changes, each with the lines of both texts it takes; `scrollToChange(i)` brings a change into view the shorter way and shows it with a bar in the primary colour at its start (`shownChange`). With the focus in the view, Alt and the down arrow go to the next change, Alt and the up arrow to the one before, and a screen reader is told which it is.
- **Titles.** `beforeTitle` and `afterTitle` write the two texts' names over their columns; at the row's end stands how many lines were put in and taken out.
- **Comparison.** The difference is found by `diffLines`, Myers' shortest edit: texts of a few thousand lines at once, longer ones away from the main thread. An app gives its own comparison, of what a document means for example, as a list of `DiffLine`s. `ignoreWhitespace` counts lines that differ only in their spaces as the same.
- **Selecting.** What the lines say can be selected and copied by the system's own means; the numbers and the signs are not selected.
- **Screen reader.** After a changed line's words it is told which side it is and its number: "Removed, line 4". An unchanged line is read once. The titles' summary is read in the theme's words.
- **Automation.** With `tagKey` the view is `DiffView_<tagKey>`, a row `Row_<line>`, in one column a changed line's two sides `Row_<line>_before` and `Row_<line>_after`, a row of folded lines `Fold_<line>`, and the titles `Header_titles`. A folded row opened is reported as `expand`, a change gone to by its keys as `change`.
- **Style and colour.** `DiffViewStyle` gives the room, the edge and the bar, `DiffViewColors` the fills, the writing and the code's colours; what is not given stays the theme's.

## Usage

### Two versions of a file

```kotlin
PantrixDiffView(before = saved, after = edited, beforeTitle = "saved.json", afterTitle = "edited.json", tagKey = "file")
```

### The screen's own list of the changes, each brought into view

```kotlin
val compare = rememberDiffViewState()
val scope = rememberCoroutineScope()
compare.changes.forEachIndexed { at, change ->
    PantrixButton(text = "${change.afterLines}", onClick = { scope.launch { compare.scrollToChange(at) } })
}
PantrixDiffView(
    before = saved,
    after = edited,
    modifier = Modifier.height(400.dp),
    state = compare,
    tagKey = "review"
)
```

## Examples

### Two versions of a file

Two versions of a settings file, with their names. The `age` line is written otherwise, `city` is taken out and `team` put in; the rest is the same. The unchanged lines are coloured by the demo's JSON highlighter. A wide view sets them side by side, a narrow one in one column.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.PantrixDiffView

PantrixDiffView(
    before = SAVED,
    after = EDITED,
    highlighter = JsonHighlighter,
    beforeTitle = "saved.json",
    afterTitle = "edited.json",
    tagKey = "versions"
)

private val SAVED =
    """
    {
      "name": "Ada",
      "age": 36,
      "city": "London",
      "active": true
    }
    """.trimIndent()

private val EDITED =
    """
    {
      "name": "Ada",
      "age": 37,
      "active": true,
      "team": "engines"
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `JsonHighlighter`: The runs of JSON with comments that are to be coloured, a line at a time: a name before a colon is a property, what is in quotes a string, `true`, `false` and `null` words of the language, numbers numbers, and line and block comments comments. `PantrixCodeEditor` knows no language: the reader its caller gives tells it what is what, and in this app this is the one that does.

### One column

The same two versions in one column: each change's lines taken out first, the lines it put in under them; every line with both texts' numbers.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.PantrixDiffView

PantrixDiffView(before = SAVED, after = EDITED, layout = DiffLayout.Unified, tagKey = "unified")

private val SAVED =
    """
    {
      "name": "Ada",
      "age": 36,
      "city": "London",
      "active": true
    }
    """.trimIndent()

private val EDITED =
    """
    {
      "name": "Ada",
      "age": 37,
      "active": true,
      "team": "engines"
    }
    """.trimIndent()
```

### Going to the changes

A long text in a room given a height: three changes in sixty lines. Three lines stay before and after each change, and those between fold into an "Unchanged lines" row; press one and it opens.

The buttons come from the state's `changes` list: press one and the view scrolls to that change the shorter way and shows it with a bar at its start. With the focus in the view, Alt and the down arrow go to the next one too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.diffview.DiffChange
import com.pantrixui.components.data.diffview.PantrixDiffView
import com.pantrixui.components.data.diffview.rememberDiffViewState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val compare = rememberDiffViewState()
val scope = rememberCoroutineScope()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        compare.changes.forEachIndexed { at, change: DiffChange ->
            PantrixButton(
                text = "Line ${change.afterLines.first}",
                onClick = {
                    scope.launch { compare.scrollToChange(at) }
                    report("Change ${at + 1}: +${change.added} −${change.removed}")
                },
                variant = if (compare.shownChange == at) ButtonVariant.Solid else ButtonVariant.Outline,
                size = ButtonSize.Small,
                tagKey = "change_$at"
            )
        }
    }
    PantrixDiffView(
        before = LOG_BEFORE,
        after = LOG_AFTER,
        modifier = Modifier.height(320.dp),
        state = compare,
        tagKey = "log"
    )
}

private val LOG_BEFORE = List(60) { "12:${it.toString().padStart(2, '0')} job ${it + 1} done" }.joinToString("\n")

private val LOG_AFTER = LOG_BEFORE.lines().toMutableList().apply {
    set(9, "12:09 job 10 failed")
    removeAt(30)
    add(50, "12:50 job 51 retried")
}.joinToString("\n")
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### The app's own comparison

The app's own comparison: an app that compares what two documents mean gives the lines as `DiffLine`s. Here the order of the keys is no difference; only the value of `total` changed and `note` was put in.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.DiffKind
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.DiffLine
import com.pantrixui.components.data.diffview.PantrixDiffView

val lines = remember {
    listOf(
        DiffLine(DiffKind.Unchanged, "\"id\": 4821,", "\"id\": 4821,", beforeNumber = 2, afterNumber = 3),
        DiffLine(DiffKind.Changed, "\"total\": 249.90,", "\"total\": 259.90,", beforeNumber = 3, afterNumber = 2),
        DiffLine(DiffKind.Added, before = null, after = "\"note\": \"gift\"", afterNumber = 4)
    )
}
PantrixDiffView(lines = lines, layout = DiffLayout.SideBySide, context = null, tagKey = "meaning")
```

### Spaces and lines that do not wrap

With `ignoreWhitespace` on, lines whose indent alone changed count as the same, but are shown as written. With `softWrap` off, long lines stay on one line and the two columns scroll sideways together. `diffLines` makes the same comparison outside the view: here to say how many lines changed.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.DiffKind
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.PantrixDiffView
import com.pantrixui.components.data.diffview.diffLines
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var ignore by rememberSaveable { mutableStateOf(true) }
var wrap by rememberSaveable { mutableStateOf(false) }
val changed = remember(ignore) {
    diffLines(CODE_BEFORE, CODE_AFTER, ignoreWhitespace = ignore).count { it.kind != DiffKind.Unchanged }
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = ignore,
        onCheckedChange = { ignore = it },
        label = "Ignore spaces: $changed changed lines",
        tagKey = "ignore"
    )
    PantrixSwitchButton(
        checked = wrap,
        onCheckedChange = { wrap = it },
        label = "Wrap the lines",
        tagKey = "wrap"
    )
    PantrixDiffView(
        before = CODE_BEFORE,
        after = CODE_AFTER,
        layout = DiffLayout.SideBySide,
        ignoreWhitespace = ignore,
        softWrap = wrap,
        tagKey = "code"
    )
}

private val CODE_BEFORE =
    """
    fun total(items: List<Item>): Double {
        return items.sumOf { it.price * it.count }
    }
    """.trimIndent()

private val CODE_AFTER =
    """
    fun total(items: List<Item>): Double {
            return items.sumOf { it.price * it.count }
    }
    fun totalWithTax(items: List<Item>, rate: Double): Double = total(items) * (1 + rate)
    """.trimIndent()
```

### Its own colours and style

Its own colours and style: the lines taken out and put in in the app's colours, the bar of the change shown thicker, and no line numbers.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.DiffViewColors
import com.pantrixui.components.data.diffview.DiffViewStyle
import com.pantrixui.components.data.diffview.PantrixDiffView
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixDiffView(
    before = SAVED,
    after = EDITED,
    layout = DiffLayout.Unified,
    lineNumbers = false,
    style = DiffViewStyle(barWidth = 4.dp, gutterGap = 12.dp),
    colors = DiffViewColors(removed = colors.warning.container, added = colors.info.container),
    tagKey = "own"
)

private val SAVED =
    """
    {
      "name": "Ada",
      "age": 36,
      "city": "London",
      "active": true
    }
    """.trimIndent()

private val EDITED =
    """
    {
      "name": "Ada",
      "age": 37,
      "active": true,
      "team": "engines"
    }
    """.trimIndent()
```

## API

### PantrixDiffView

`import com.pantrixui.components.data.diffview.PantrixDiffView`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDiffView(
    before: String,
    after: String,
    modifier: Modifier = Modifier,
    layout: DiffLayout = DiffLayout.Adaptive,
    context: Int? = 3,
    ignoreWhitespace: Boolean = false,
    softWrap: Boolean = true,
    lineNumbers: Boolean = true,
    selectable: Boolean = true,
    highlighter: CodeHighlighter<*>? = null,
    beforeTitle: String? = null,
    afterTitle: String? = null,
    state: DiffViewState = rememberDiffViewState(),
    style: DiffViewStyle? = null,
    colors: DiffViewColors? = null,
    tagKey: String? = null
)
```

Two texts compared a line at a time: what the second took out of the first, what it put in, and what it wrote otherwise, side by side in a wide view and in one column in a narrow one, the two columns scrolling as one.

A line the text after took out is drawn on the danger role's soft fill with a − before it, a line it put in on the success role's with a +, and of a line it wrote otherwise, which stands across from the line it was, the words that differ are laid on a stronger share of each. Across from a line one text alone has, the other column is crossed with thin lines. The unchanged lines are drawn as a code block draws its lines, in the colours a `highlighter` gives their tokens; the changed lines are written in the one colour that reads on their fill.

Unchanged lines further than `context` lines from every change fold into one row, which says how many it holds and opens at a press. The lines are numbered as each text numbers them, both numbers in one column, and a line that is too long goes on under itself, the row as tall as its taller side; with `softWrap` off the two columns scroll sideways together.

`state` holds the changes, the one shown to the reader, drawn with a bar down its start, and the way to bring one into view: `state.scrollToChange(index)`. With the focus in the view, Alt and the down arrow go to the next change, Alt and the up arrow to the one before, and a screen reader is told which it is. Given a height, the view scrolls inside it and builds only the rows on the screen; with no height, in a page that scrolls, it is as tall as its rows up to the window's height.

The texts are compared with `diffLines`: two texts of a few thousand lines at once, longer ones away from the main thread, with the comparison before shown until the new one is ready, and a spinner the first time. In a browser, which has one thread, a long comparison holds the page while it is made. A screen that has its own comparison, of what a document means rather than of its lines, gives it as `DiffLine`s, to the overload that takes them.

Lines of code are laid out from the left in every language.

```kotlin
PantrixDiffView(before = saved, after = edited, beforeTitle = "saved.json", afterTitle = "edited.json")
```

Parameters:

- `before: String`: the text before, a line to each line feed.
- `after: String`: the text after.
- `modifier: Modifier`: the view's modifier. A height given here is the room the rows scroll in.
- `layout: DiffLayout`: how the two texts are set out: side by side or in one column by the view's width, or always one way.
- `context: Int?`: how many unchanged lines stand before and after each change before the rest fold: three by default, and none folds where it is null.
- `ignoreWhitespace: Boolean`: whether two lines that differ only in their spaces are the same: each is shown as written.
- `softWrap: Boolean`: whether a line too long for its column goes on under itself. False keeps every line on one line, and the columns scroll sideways together.
- `lineNumbers: Boolean`: whether each line carries its number in its text, before its sign.
- `selectable: Boolean`: whether what the lines say can be selected, by a pointer drawn over it or a finger held on it, and copied by the system's own means. The numbers and the signs are not selected.
- `highlighter: CodeHighlighter<*>?`: what colours the tokens of the unchanged lines, as a code editor's does: none by default, and the lines are written in the text's colour.
- `beforeTitle: String?`: the name of the text before, over its column: a file's name, a version. With `afterTitle` it makes a row of titles over the rows, with how many lines were put in and taken out at its end; with neither the view has no such row.
- `afterTitle: String?`: the name of the text after, over its column.
- `state: DiffViewState`: the changes, the one shown, and where the rows are scrolled to.
- `style: DiffViewStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: DiffViewColors?`: this view's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the view's automation key: the view is `DiffView_<tagKey>`, a row of lines in it `DiffView_<tagKey>.Row_<line>` with the line's place among the comparison's lines, in one column `Row_<line>_before` and `Row_<line>_after` for a changed line's two sides, a row of folded lines `DiffView_<tagKey>.Fold_<line>` with the place of its first line, and the row of titles `DiffView_<tagKey>.Header_titles`. A row opened is reported as a `DiffView` event, `expand`, with how many lines it held; a change gone to by its keys as `change`, with its place. Nothing of the texts is reported.

### PantrixDiffView

`import com.pantrixui.components.data.diffview.PantrixDiffView`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDiffView(
    lines: List<DiffLine>,
    modifier: Modifier = Modifier,
    layout: DiffLayout = DiffLayout.Adaptive,
    context: Int? = 3,
    softWrap: Boolean = true,
    lineNumbers: Boolean = true,
    selectable: Boolean = true,
    highlighter: CodeHighlighter<*>? = null,
    beforeTitle: String? = null,
    afterTitle: String? = null,
    state: DiffViewState = rememberDiffViewState(),
    style: DiffViewStyle? = null,
    colors: DiffViewColors? = null,
    tagKey: String? = null
)
```

`PantrixDiffView` for a comparison its caller made: what a document means compared rather than its lines, or `diffLines`' lines made away from the screen.

Parameters:

- `lines: List<DiffLine>`: the comparison's lines, in the order the texts have them; the changes are the runs of lines that are not `DiffKind.Unchanged`.
- `modifier: Modifier`: the view's modifier. A height given here is the room the rows scroll in.
- `layout: DiffLayout`: how the two texts are set out.
- `context: Int?`: how many unchanged lines stand before and after each change before the rest fold; null folds none.
- `softWrap: Boolean`: whether a line too long for its column goes on under itself.
- `lineNumbers: Boolean`: whether each line carries its number in its text.
- `selectable: Boolean`: whether what the lines say can be selected and copied by the system's own means.
- `highlighter: CodeHighlighter<*>?`: what colours the tokens of the unchanged lines; it reads each text's lines in their order.
- `beforeTitle: String?`: the name of the text before, over its column.
- `afterTitle: String?`: the name of the text after, over its column.
- `state: DiffViewState`: the changes, the one shown, and where the rows are scrolled to.
- `style: DiffViewStyle?`: this call's own style: over every enclosing one and under the density.
- `colors: DiffViewColors?`: this view's own colours, where they are not the theme's.
- `tagKey: String?`: the view's automation key, as the other overload has it.

### DiffLine

`import com.pantrixui.components.data.diffview.DiffLine`, from `com.pantrixui:components`

```kotlin
class DiffLine(
    public val kind: DiffKind,
    public val before: String?,
    public val after: String?,
    public val beforeNumber: Int? = null,
    public val afterNumber: Int? = null,
    public val beforeMarks: List<TextRange> = emptyList(),
    public val afterMarks: List<TextRange> = emptyList()
)
```

One line of a comparison of two texts, as a `PantrixDiffView` shows it: on one row, the line of the text before and the line of the text after that stands for it, or only one of them.

```kotlin
// What an app's own comparison found, as a view's lines.
DiffLine(DiffKind.Changed, before = "\"total\": 1", after = "\"total\": 2", beforeNumber = 4, afterNumber = 4)
```

Parameters:

- `kind: DiffKind`: What the line is: in both texts, taken out, put in, or written otherwise.
- `before: String?`: The line as the text before writes it, without its line feed: null for a line that was put in.
- `after: String?`: The line as the text after writes it: null for a line that was taken out.
- `beforeNumber: Int?`: The line's number in the text before, from one: null where `before` is.
- `afterNumber: Int?`: The line's number in the text after: null where `after` is.
- `beforeMarks: List<TextRange>`: The stretches of `before` that the text after does not have, the changed words of a `DiffKind.Changed` line: each by the characters it starts at and ends before. None by default.
- `afterMarks: List<TextRange>`: The stretches of `after` that the text before does not have.

### DiffKind

`import com.pantrixui.components.data.diffview.DiffKind`, from `com.pantrixui:components`

```kotlin
enum class DiffKind
```

What a `DiffLine` is in the comparison of two texts.

Entries:

- `Unchanged`: The line is in both texts, as it is.
- `Removed`: The line is in the text before alone: the text after took it out.
- `Added`: The line is in the text after alone: it was put in.
- `Changed`: A line of the text before that the text after wrote otherwise: the two stand side by side.

### DiffChange

`import com.pantrixui.components.data.diffview.DiffChange`, from `com.pantrixui:components`

```kotlin
class DiffChange(
    public val firstLine: Int,
    public val lineCount: Int,
    public val beforeLines: IntRange,
    public val afterLines: IntRange
)
```

One change of a comparison: the lines that stand together between two runs of unchanged ones, which a `DiffViewState` scrolls to and shows.

Parameters:

- `firstLine: Int`: The place of the change's first line among the comparison's `DiffLine`s.
- `lineCount: Int`: How many of those lines the change takes: one for each row of a view that shows the two texts side by side.
- `beforeLines: IntRange`: The numbers of the lines of the text before that the change takes out or writes otherwise, from one. Where it takes none, an empty range that starts at the line it comes after: `5..4` for a change that puts lines in after the fourth.
- `afterLines: IntRange`: The numbers of the lines of the text after that the change puts in or writes otherwise; an empty range where it puts none.

Members:

- `removed: Int`: How many lines of the text before the change takes out, those it writes otherwise among them.
- `added: Int`: How many lines of the text after the change puts in, those it writes otherwise among them.

### diffLines

`import com.pantrixui.components.data.diffview.diffLines`, from `com.pantrixui:components`

```kotlin
fun diffLines(
    before: String,
    after: String,
    ignoreWhitespace: Boolean = false
): List<DiffLine>
```

The lines of `before` and `after` compared one with another: the shortest edit that makes the one the other, a line at a time, as the `DiffLine`s a `PantrixDiffView` shows.

The lines that stand between two runs of unchanged ones are a change. Of the lines it takes out and puts in, the ones most alike stand side by side as `DiffKind.Changed` lines, the words that differ marked in each; between those the rest stand side by side from the first, and what one side has more of stands alone, `DiffKind.Removed` or `DiffKind.Added`.

The edit is Myers'. Its time grows with the length of the texts times how much they differ: two texts of thousands of lines that differ by a few are compared at once, and two that differ in every line take longer. The view that is given two long texts compares them away from the main thread; a screen that compares in its own place, as a model, gives the view what this returns.

```kotlin
val lines = withContext(Dispatchers.Default) { diffLines(saved, edited) }
```

Returns the lines, in the order the texts have them.

Parameters:

- `before: String`: the text before, a line to each line feed; a carriage return before one is no part of the line, and a line feed at the text's end starts no line after it.
- `after: String`: the text after.
- `ignoreWhitespace: Boolean`: whether two lines that differ only in their spaces are the same: at their ends, and in how many stand together between their words. Each is shown as it is written all the same, and a changed line marks no space.

### DiffLayout

`import com.pantrixui.components.data.diffview.DiffLayout`, from `com.pantrixui:components`

```kotlin
enum class DiffLayout
```

How a `PantrixDiffView` sets the two texts out.

Entries:

- `Adaptive`: Side by side where the view is as wide as the window's medium breakpoint or wider, in one column below it.
- `SideBySide`: The text before in one column and the text after beside it, each line across from the one standing for it.
- `Unified`: One column: each change's lines of the text before, and under them its lines of the text after.

### DiffViewState

`import com.pantrixui.components.data.diffview.DiffViewState`, from `com.pantrixui:components`

```kotlin
class DiffViewState(public val listState: LazyListState = LazyListState())
```

What a `PantrixDiffView` holds from one composition to the next, for a screen that reads it or moves it: the changes it shows, the one that is shown to its reader, and where its rows are scrolled to.

```kotlin
val compare = rememberDiffViewState()
PantrixDiffView(before = saved, after = edited, state = compare)
// The screen's own list of the changes, each a button that brings its change into view.
compare.changes.forEachIndexed { at, change ->
    PantrixButton(text = "Lines ${change.afterLines}", onClick = { scope.launch { compare.scrollToChange(at) } })
}
```

One state is one view's: two views given the same one would scroll each other.

Parameters:

- `listState: LazyListState`: The state of the list the rows scroll in: how far they are scrolled, and which are in view.

Members:

- `changes: List<DiffChange>`: The changes of what the view shows now, in their order: none before it has compared its texts.
- `shownChange: Int?`: The place among `changes` of the change shown to the reader, drawn with a bar down its start, or null for none. `scrollToChange` sets it, and so do Alt and the down and up arrows in the view; a screen sets it itself to mark a change without moving the view, and to null to take the mark away. A place no change has marks nothing.
- `suspend fun scrollToChange(index: Int): Boolean`: Shows the change at `index` of `changes` and brings it into view, by the shorter way and no further than it has to go: a change above comes to the top, one below to the foot, one taller than the view with its first row at the top, and one in view already stays where it is. A change asked for before the view has compared its texts and been laid out waits for that.

  Returns whether there is such a change: false for a place `changes` has not.

### rememberDiffViewState

`import com.pantrixui.components.data.diffview.rememberDiffViewState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberDiffViewState(listState: LazyListState = rememberLazyListState()): DiffViewState
```

A `DiffViewState` that is kept over what a saved state is kept over, as its list's is: a turn of the screen, a visit to another screen and back. Which change is shown is not kept: the texts may be others by then.

Parameters:

- `listState: LazyListState`: the state of the list the rows scroll in, for a screen that holds that one itself.

### DiffViewStyle

`import com.pantrixui.components.data.diffview.DiffViewStyle`, from `com.pantrixui:components`

```kotlin
class DiffViewStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val gutterGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val barWidth: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<DiffViewStyle>
```

`PantrixDiffView`'s geometry: the room around its rows and in them, the room before the lines where they are numbered, the edge, the bar of the change shown, and the row of the titles.

The rows stand close, as lines of code do: a line of the theme's code type is 20dp tall, and Android leaves 2dp over and under its words, iOS 1dp, and the desktop and the web none. A row of folded lines is pressed, and is as tall as the platform's touch target where a finger presses it.

Parameters:

- `shape: ShapeSpec`: The corners of the view: a step of the brand's shape scale, or a fixed shape.
- `horizontalPadding: Dp`: The room between a column's sides and what it holds; the fills of the changes are drawn across it, to the sides.
- `verticalPadding: Dp`: The room over the first row and under the last, and over and under the titles.
- `linePadding: Dp`: The room over and under the words of each line.
- `gutterGap: Dp`: Between a line's number, its sign and its words.
- `borderWidth: Dp`: The width of the edge around the view, of the line between its two columns and of the line under its titles. Zero draws none.
- `barWidth: Dp`: The width of the bar down the start of the change shown. Zero draws none.
- `iconSize: Dp`: The width and height of the icon of a row of folded lines.

### DiffViewColors

`import com.pantrixui.components.data.diffview.DiffViewColors`, from `com.pantrixui:components`

```kotlin
data class DiffViewColors(
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
    public val removed: Color = Color.Unspecified,
    public val removedContent: Color = Color.Unspecified,
    public val removedWord: Color = Color.Unspecified,
    public val added: Color = Color.Unspecified,
    public val addedContent: Color = Color.Unspecified,
    public val addedWord: Color = Color.Unspecified,
    public val gap: Color = Color.Unspecified,
    public val fold: Color = Color.Unspecified,
    public val foldContent: Color = Color.Unspecified,
    public val shown: Color = Color.Unspecified
)
```

What a `PantrixDiffView` is painted with, for a view that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

The unchanged lines are drawn as a code block draws its lines, each kind of token in its own colour on the theme's grounds. A line that is taken out or put in is drawn on the soft fill of its role, and all of it is written in the one colour that reads there, as a code block's marked line is; its changed words are laid on a stronger share of the role. A `removed` or an `added` given here that is one of the theme's role colours brings what the theme writes on it, unless `removedContent` or `addedContent` is given too.

Parameters:

- `container: Color`: The fill behind the rows: the theme's `surface`.
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
- `lineNumber: Color`: The line numbers and the signs of the unchanged lines, the titles' summary and the scroll bars. The theme's `textSecondary`.
- `border: Color`: The edge around the view, the line between its two columns and the line under its titles. The theme's `divider`.
- `removed: Color`: The fill of a line the text after took out: the danger role's `container`.
- `removedContent: Color`: What is written on `removed`: the danger role's `onContainer`.
- `removedWord: Color`: What is laid behind the words a changed line took out: a stronger share of the danger role, or on a `removed` of the caller's own a share of what is written there.
- `added: Color`: The fill of a line the text after put in: the success role's `container`.
- `addedContent: Color`: What is written on `added`: the success role's `onContainer`.
- `addedWord: Color`: What is laid behind the words a changed line put in: a stronger share of the success role, or on an `added` of the caller's own a share of what is written there.
- `gap: Color`: The lines across the side of a row that one text alone has a line on: the theme's `divider`.
- `fold: Color`: The fill of a row of folded lines: the theme's `background`, a step from the view's `surface`.
- `foldContent: Color`: What a row of folded lines says, and its icon: the theme's `textSecondary`.
- `shown: Color`: The bar down the start of the change shown: the primary role's colour.
