# Code Block

Code set out to be read: in the theme's code type, a line to a line, each part of it in the colour of what it is, and ready to be copied. A usage example in a document, a file under review, a command and the difference between two versions are shown this way.

The block does not know the language it shows. What colours the code are the tokens its caller gives (`tokens`): which letters of the text are a keyword, which a string, which a comment. On this page the app's own reader of Kotlin gives them; code given no tokens is written in one colour.

- `PantrixCodeBlock` (`com.pantrixui.components.data.codeblock`, `com.pantrixui:components`): Code set out to be read: coloured by the tokens its caller gives, with line numbers that stay while it scrolls sideways, marks on its lines, a header and a button that copies. Keywords: snippet, syntax highlighting, source code, pre, copy code, monospace.

## Features

- **Two forms.** The form that takes `code` shows a text. The form that takes `lines` takes the lines one by one: each line carries its own tokens and what is said about it. `codeLines` gives the lines of a text; a screen starts from there and marks the lines it wants.
- **Tokens.** There are eight kinds of token: plain text, comment, keyword, type, string, number, punctuation, and the names written before something (`@Composable`). Their colours come from the theme's roles; a comment is slanted as well. Where two tokens lie over the same letters, the one given later colours them.
- **Header.** Over the code a header stands while there is something to say: `title`, mostly a file's name; `language`, the language's name; `icon`; what the screen puts at its start with `leading` and at its end with `trailing`. The copy button is at the header's end; when there is nothing else to say there is no header, and the button stands over the code, in a strip of its own.
- **Copying and selecting.** The button copies all of the code, whatever part of it is on the screen. After a copy it shows a tick for two seconds and tells a screen reader too; `onCopy` reports whether the code got to the clipboard. The lines on the screen can be selected as well, by dragging a mouse or by a long press. `copyable = false` takes the button away, and `selectable = false` turns selection off.
- **Line numbers.** `lineNumbers` writes each line's number before it; `firstLineNumber` gives the first line's number: a part taken out of a file starts where it started there. The numbers are not selected and not read to a screen reader.
- **Scrolling sideways.** A line that does not fit the block is not broken: the code scrolls sideways and the line numbers stay where they are. A line of code that has lost its indent cannot be read.
- **Lines that go on under themselves.** With `softWrap` a long line goes on under itself: for a narrow screen where the words matter more than the columns.
- **Height.** In a block given a height the code scrolls in that height, under a header that stays, and only the lines on the screen are built. A block given no height is, in a page that scrolls, as tall as its lines where it has no more than 300; with longer code it is no taller than the window, and scrolls in it.
- **Scroll bars.** Where it scrolls the block has a bar of its own: at its side, and along its foot for code that scrolls sideways. For a reader with a pointer it is there while there is something to scroll, and a mouse drags it; under a finger it shows only while the code moves.
- **Keyboard.** Where there is a pointer and something to scroll, the lines are a stop for Tab. With the focus there the arrow keys scroll by a line and, sideways, by a step; Page Up and Page Down by a screen; Home and End go to the first line and to the last.
- **Marks on lines.** A line's mark (`CodeMark`) draws the soft fill of its tone's role behind the line and a bar in the role's colour down its left edge; with a `message`, the message stands under the line. There are six tones: `Primary`, `Info`, `Success`, `Warning`, `Danger` and `Neutral`. All of a marked line is written in the one colour the theme pairs with that fill.
- **The code's type.** `textStyle` sets the code in another style than the theme's `code`: smaller on a phone's page.
- **Reading direction.** Code is written from left to right in every language; the header and a mark's message follow the app's direction.
- **Colour.** On the theme's own grounds each kind of token has a colour of its own. On one of the theme's role colours all of the code is written in the one colour that reads there. A colour given with `CodeBlockColors` is used, and one that is not stays the theme's.
- **Platform.** Lines of code stand close: nothing in them is pressed. A line of the theme's code type is 20dp tall; Android leaves 2dp over and under its words, iOS 1dp, and the desktop and the web none. The corners are the card's.
- **Screen reader.** The code is read a line at a time; the line numbers are passed over. A mark's message is read after its line, as one thing.
- **Automation.** With `tagKey` the block is `CodeBlock_<tagKey>`, a line of it `CodeBlock_<tagKey>.Line_<number>`, the message under a line `CodeBlock_<tagKey>.Note_<number>`, the window a keyboard scrolls `CodeBlock_<tagKey>.Lines_window`, and the button that copies `CodeBlock_<tagKey>.Button_copy`. A copy is reported as `copy`, with whether it got to the clipboard. Nothing of the code is reported.

## Usage

### A snippet, coloured by the app's own reader of the language

```kotlin
PantrixCodeBlock(
    code = snippet,
    tokens = remember(snippet) { kotlinTokens(snippet) },
    language = "Kotlin",
    tagKey = "usage"
)
```

### A file in a room of its own, with its lines numbered

```kotlin
PantrixCodeBlock(
    code = file.text,
    modifier = Modifier.height(320.dp),
    title = file.name,
    lineNumbers = true,
    tagKey = "source"
)
```

### A finding on the line it is about

```kotlin
val lines = remember(source, finding) {
    codeLines(source).mapIndexed { index, line ->
        if (index == finding.line) {
            line.copy(mark = CodeMark(CodeTone.Danger, message = finding.message, source = finding.rule))
        } else {
            line
        }
    }
}
PantrixCodeBlock(lines = lines, title = "AuthRepository.kt", lineNumbers = true, tagKey = "review")
```

## Examples

### A snippet of code

At its plainest: a text of code, the tokens that colour it, and the language's name. The block knows no language; `tokens` says what is a keyword, what a string and what a comment. Here the app's own reader of Kotlin gives them.

Keywords are in the colour of the theme's `primary` role, types in `info`, strings in `success`, numbers in `warning`, and names that start with `@` in `danger`; a comment is written in `textSecondary`, and slanted. The button in the header copies all of the code and shows a tick for two seconds.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock

PantrixCodeBlock(
    code = GREETING,
    tokens = remember { kotlinTokens(GREETING) },
    language = "Kotlin",
    tagKey = "snippet"
)

private val GREETING =
    """
    @Composable
    fun Greeting(name: String) {
        // The greeting a new account is met with.
        val unread = 3
        PantrixText(text = "Hello, " + name + ": " + unread + " new messages")
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `kotlinTokens`: The parts of Kotlin code that are to be coloured: keywords, strings, numbers, comments, names that start with `@`, and names that start with a capital letter, which are types and composables. `PantrixCodeBlock` knows no language: its caller tells it what is what, and in this app this is what does.

### A file, in a height of its own

A file: `title` gives its name, `icon` the icon before it, `lineNumbers` the line numbers. The block was given a height: the code scrolls in it, under a header that stays, and only the lines on the screen are built.

A line that does not fit is not broken. Scroll the code sideways: the line numbers stay where they are, and the lines pass under them. On a screen with a pointer both of the block's scroll bars show, and a mouse drags them; once Tab has come to the lines, the arrow keys scroll the code.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.foundation.icons.PantrixIcons

PantrixCodeBlock(
    code = REPOSITORY,
    modifier = Modifier.height(220.dp),
    tokens = remember { kotlinTokens(REPOSITORY) },
    title = "OrderRepository.kt",
    language = "Kotlin",
    icon = PantrixIcons.Folder,
    lineNumbers = true,
    tagKey = "file"
)

private val REPOSITORY =
    """
    package com.example.orders

    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.map

    /** Reads the orders of an account, newest first. */
    class OrderRepository(private val api: OrderApi, private val cache: OrderCache, private val clock: Clock) {
        fun orders(account: String): Flow<List<Order>> = cache.observe(account).map { it.sortedBy(Order::placedAt) }

        suspend fun refresh(account: String) {
            val fresh = api.orders(account, since = cache.newest(account))
            cache.put(account, fresh, at = clock.now())
        }

        suspend fun cancel(order: Order): Boolean {
            if (order.shipped) return false
            api.cancel(order.id)
            cache.remove(order.id)
            return true
        }
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `kotlinTokens`: The parts of Kotlin code that are to be coloured: keywords, strings, numbers, comments, names that start with `@`, and names that start with a capital letter, which are types and composables. `PantrixCodeBlock` knows no language: its caller tells it what is what, and in this app this is what does.

### A finding, under the line it is about

A review: the finding stands under the line it is about. In the form that takes `lines` each line carries its own mark; `codeLines` gives the lines of the text, and the screen marks the ones it wants. A mark draws the soft fill of its tone's role behind the line and a bar in the role's colour down its left edge; `message` is written under the line, after the tone's icon, and `source` stands at its end.

A marked line is written in the one colour the theme pairs with that fill. `firstLineNumber` gives where the part started in its file: the finding's line carries its number in the file.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.data.codeblock.codeLines

val lines = remember {
    codeLines(REVIEWED, kotlinTokens(REVIEWED)).mapIndexed { index, line ->
        when (index) {
            1 -> {
                line.copy(
                    mark = CodeMark(
                        tone = CodeTone.Danger,
                        message = "The token may be null here; `!!` brings the app down.",
                        source = "kotlin:S2259"
                    )
                )
            }

            4 -> {
                line.copy(mark = CodeMark(CodeTone.Warning, message = "The length of time belongs in a named constant."))
            }

            else -> {
                line
            }
        }
    }
}
PantrixCodeBlock(
    lines = lines,
    title = "AuthRepository.kt",
    lineNumbers = true,
    firstLineNumber = 41,
    tagKey = "finding"
)

private val REVIEWED =
    """
    suspend fun token(): String {
        val cached = cache.token!!
        if (cached.isFresh()) return cached.value
        val fresh = api.refresh(cached.refreshToken)
        cache.keep(fresh, seconds = 3600)
        return fresh.value
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `kotlinTokens`: The parts of Kotlin code that are to be coloured: keywords, strings, numbers, comments, names that start with `@`, and names that start with a capital letter, which are types and composables. `PantrixCodeBlock` knows no language: its caller tells it what is what, and in this app this is what does.

### Lines added and taken out

A mark without a message is a band and nothing more: in the difference between two versions the added lines are in the `Success` tone and the ones taken out in `Danger`. Here the `+` and the `-` at the start of a line say what the band means too: a colour says nothing to someone who cannot see it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.data.codeblock.codeLines

val lines = remember {
    codeLines(CHANGES, kotlinTokens(CHANGES)).map { line ->
        when {
            line.text.startsWith("+") -> line.copy(mark = CodeMark(CodeTone.Success))
            line.text.startsWith("-") -> line.copy(mark = CodeMark(CodeTone.Danger))
            else -> line
        }
    }
}
PantrixCodeBlock(lines = lines, title = "Greeting.kt", tagKey = "changes")

private val CHANGES =
    """
      @Composable
      fun Greeting(name: String) {
    -     PantrixText(text = "Hello")
    +     PantrixText(text = "Hello, " + name)
    +     PantrixDivider()
      }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `kotlinTokens`: The parts of Kotlin code that are to be coloured: keywords, strings, numbers, comments, names that start with `@`, and names that start with a capital letter, which are types and composables. `PantrixCodeBlock` knows no language: its caller tells it what is what, and in this app this is what does.

### The steps of a guide

Marks are the screen's data: when the step of a guide changes, other lines stand out. Here each step marks its own lines in the `Primary` tone; change the step, and the band moves to the other lines.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.data.codeblock.codeLines
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var step by remember { mutableIntStateOf(0) }
val lines = remember(step) {
    codeLines(GREETING, kotlinTokens(GREETING)).mapIndexed { index, line ->
        if (index in STEP_LINES[step]) line.copy(mark = CodeMark(CodeTone.Primary)) else line
    }
}
PantrixSegmentButton(
    options = STEPS,
    selected = step,
    onSelect = { step = it },
    fullWidth = false,
    tagKey = "step"
)
PantrixCodeBlock(lines = lines, lineNumbers = true, copyable = false, tagKey = "steps")

private val STEPS = listOf(
    SegmentOption(value = 0, label = "1. Signature", tagKey = "signature"),
    SegmentOption(value = 1, label = "2. State", tagKey = "state"),
    SegmentOption(value = 2, label = "3. Drawing", tagKey = "drawing")
)

private val STEP_LINES = listOf(0..1, 3..3, 4..4)

private val GREETING =
    """
    @Composable
    fun Greeting(name: String) {
        // The greeting a new account is met with.
        val unread = 3
        PantrixText(text = "Hello, " + name + ": " + unread + " new messages")
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `kotlinTokens`: The parts of Kotlin code that are to be coloured: keywords, strings, numbers, comments, names that start with `@`, and names that start with a capital letter, which are types and composables. `PantrixCodeBlock` knows no language: its caller tells it what is what, and in this app this is what does.

### Lines that go on under themselves

A long command. With `softWrap` the line goes on under itself where it does not fit the block, and the block does not scroll sideways; without it the command is one line, and the code scrolls sideways. Turn the switch and compare the two.

A line that goes on under itself loses its indent: `softWrap` suits a command or a line of a log, not code whose indent carries meaning.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var wraps by remember { mutableStateOf(true) }
PantrixSwitchButton(
    checked = wraps,
    onCheckedChange = { wraps = it },
    label = "Let a long line go on under itself",
    tagKey = "code_wraps"
)
PantrixCodeBlock(code = COMMAND, softWrap = wraps, language = "Shell", tagKey = "command")

private val COMMAND =
    "./gradlew :ui:components:jvmTest --tests 'com.pantrixui.components.CodeBlockTest' --offline --console=plain"
```

### Copying, and the end of the header

`onCopy` is called after the button was pressed, with whether the code got to the clipboard: a screen that says so in its own way listens here. `trailing` puts something of the screen's own at the end of the header, before the button that copies: here, the number of lines.

In the second block `copyable` and `selectable` are off and nothing else stands in the header: it has no header, and its code is not selected.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
PantrixCodeBlock(
    code = DEPENDENCIES,
    title = "build.gradle.kts",
    onCopy = { copied -> report(if (copied) "Code copied to the clipboard" else "The code could not be copied") },
    trailing = { PantrixText(text = "4 lines", style = PantrixTheme.typography.caption) },
    tagKey = "copied"
)
PantrixCodeBlock(code = DEPENDENCIES, selectable = false, copyable = false, tagKey = "plain")

private val DEPENDENCIES =
    """
    dependencies {
        implementation("com.pantrixui:foundation:0.1.0")
        implementation("com.pantrixui:components:0.1.0")
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Tabs in the header

`leading` puts the screen's own thing at the header's start, before the icon and the title: here two tabs that choose between two forms of the same line, as a documentation's setup step does. They are written in the header's text colour.

`textStyle` sets the code in another style than the theme's `code`: here at the size of `caption`, in the code's family, for a narrow column. The `style`'s `headerLineWidth` is the width of the line under the header; `headerHorizontalPadding` keeps what the header holds nearer the side than the lines are.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeBlockStyle
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

var form by remember { mutableIntStateOf(0) }
val code = FORMS[form].second
val type = PantrixTheme.typography
PantrixCodeBlock(
    code = code,
    tokens = remember(code) { kotlinTokens(code) },
    style = CodeBlockStyle(headerLineWidth = 2.dp, headerHorizontalPadding = PantrixTheme.spacing.xs),
    leading = {
        FORMS.forEachIndexed { index, (name, _) ->
            PantrixButton(
                text = name,
                onClick = { form = index },
                variant = if (index == form) ButtonVariant.Soft else ButtonVariant.Text,
                size = ButtonSize.Small,
                tagKey = "form_$index"
            )
        }
    },
    textStyle = type.caption.copy(fontFamily = type.code.fontFamily),
    tagKey = "tabs"
)

private val FORMS = listOf(
    "Kotlin" to """implementation("com.pantrixui:components:0.1.0")""",
    "Groovy" to """implementation 'com.pantrixui:components:0.1.0'"""
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `kotlinTokens`: The parts of Kotlin code that are to be coloured: keywords, strings, numbers, comments, names that start with `@`, and names that start with a capital letter, which are types and composables. `PantrixCodeBlock` knows no language: its caller tells it what is what, and in this app this is what does.

### In a card, in colours of its own

The block has a fill and an edge of its own: the fill is the theme's `surface`, the edge the theme's `divider`. In a card that has both, `colors` makes both transparent. A colour that is given is used, and one that is not stays the theme's.

`style` changes the block's geometry; only the fields it is given change. Here `horizontalPadding` is zero, so that the lines start where the card's own padding ends.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.data.codeblock.CodeBlockColors
import com.pantrixui.components.data.codeblock.CodeBlockStyle
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
    PantrixText(text = "Setup", style = PantrixTheme.typography.title)
    PantrixCodeBlock(
        code = DEPENDENCIES,
        tokens = remember { kotlinTokens(DEPENDENCIES) },
        style = CodeBlockStyle(horizontalPadding = 0.dp),
        colors = CodeBlockColors(container = Color.Transparent, border = Color.Transparent),
        tagKey = "in_a_card"
    )
}

private val DEPENDENCIES =
    """
    dependencies {
        implementation("com.pantrixui:foundation:0.1.0")
        implementation("com.pantrixui:components:0.1.0")
    }
    """.trimIndent()
```

What the code calls of the demo app itself, which an app writes for itself:

- `kotlinTokens`: The parts of Kotlin code that are to be coloured: keywords, strings, numbers, comments, names that start with `@`, and names that start with a capital letter, which are types and composables. `PantrixCodeBlock` knows no language: its caller tells it what is what, and in this app this is what does.

### Tokens written by hand

The block carries no reader of a language; the app gives the tokens. For a short text with no reader the tokens can be written by hand: each `CodeToken` is what a run of the line is (`CodeTokenKind`), from `start` up to `end`. Here a shell command's lines are built as `CodeLine`s directly: the comment `Comment`, the command `Keyword`, the task `StringLiteral`, the option `Type`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeLine
import com.pantrixui.components.data.codeblock.CodeToken
import com.pantrixui.components.data.codeblock.CodeTokenKind
import com.pantrixui.components.data.codeblock.PantrixCodeBlock

PantrixCodeBlock(lines = SHELL_LINES, language = "Shell", tagKey = "hand_tokens")

private val SHELL_LINES = listOf(
    CodeLine(text = "# Run the desktop demo", tokens = listOf(CodeToken(0, 28, CodeTokenKind.Comment))),
    CodeLine(
        text = "./gradlew :app:desktopApp:run --offline",
        tokens = listOf(
            CodeToken(0, 9, CodeTokenKind.Keyword),
            CodeToken(10, 29, CodeTokenKind.StringLiteral),
            CodeToken(30, 39, CodeTokenKind.Type)
        )
    )
)
```

## API

### PantrixCodeBlock

`import com.pantrixui.components.data.codeblock.PantrixCodeBlock`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCodeBlock(
    code: String,
    modifier: Modifier = Modifier,
    tokens: List<CodeToken> = emptyList(),
    title: String? = null,
    language: String? = null,
    icon: ImageVector? = null,
    lineNumbers: Boolean = false,
    firstLineNumber: Int = 1,
    softWrap: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    style: CodeBlockStyle? = null,
    colors: CodeBlockColors? = null,
    tagKey: String? = null,
    leading: (@Composable RowScope.() -> Unit)? = null,
    textStyle: TextStyle? = null
)
```

Code set out to be read: in the theme's code type, a line to a line, each run of it in the colour of what it is, and ready to be copied.

The block does not know the language it shows. What colours the code are the `tokens` its caller gives: the runs of the text and what each is, as whatever read the code found them. Code given none is written in one colour.

A header stands over the code while there is something to say in it: a `title`, which is a file's name most often, the `language`, an `icon`, what the screen puts in `trailing`. The button that copies stands at its end; a block that has nothing else to put there has no header, and the button stands in a strip of its own over the code. That button copies all of the code, whatever part of it is on the screen, and shows a tick for a moment after. What is on the screen can be selected too, and copied a part at a time.

A line too long for the block is not broken: the code scrolls sideways, under line numbers that stay where they are. A line of code broken where the room ends loses what its indent says. With `softWrap` a line goes on under itself all the same, for a narrow screen where the words matter more than the columns.

The block fills the width it is given. Given a height, it scrolls inside it under a header that stays, and only the lines on the screen are built. With no height, in a page that scrolls, it is as tall as its lines where it has no more than three hundred; longer code is no taller there than the window, and scrolls in it. Where it scrolls, a bar at its edge shows how far, and a mouse can drag it.

Where a pointer leads and there is something to scroll, the lines are a stop for Tab: with the focus on them the arrow keys scroll by a line and, sideways, by a step; Page Up and Page Down by a screen of lines; Home and End go to the first line and to the last. A screen reader reads the code a line at a time, and passes the line numbers.

Code is written from left to right in every language, and so are its lines here. The header is laid out as the app is.

```kotlin
PantrixCodeBlock(code = snippet, language = "Kotlin", tagKey = "usage")
```

Parameters:

- `code: String`: the code. Its lines end at a line feed, at a carriage return, or at the two together, and the break that ends the text starts no line.
- `modifier: Modifier`: the block's modifier. A height given here is the room the code scrolls in.
- `tokens: List<CodeToken>`: the runs of `code` that have a colour, placed by the letters of the whole text. None by default.
- `title: String?`: what the header says first: a file's name, or what the code is. A title too long for the header is cut short.
- `language: String?`: the language's name, written after the title in the header, as it is to be read: `Kotlin`, `TS`. The block keeps no list of languages.
- `icon: ImageVector?`: an icon before the title.
- `lineNumbers: Boolean`: whether each line carries its number before the code.
- `firstLineNumber: Int`: the number of the first line. A part taken out of a file starts where it started there.
- `softWrap: Boolean`: whether a line too long for the block goes on under itself. By default no line does, and the code scrolls sideways.
- `selectable: Boolean`: whether the code can be selected, by a pointer drawn over it or a finger held on it, and copied by the system's own means. What is copied so is what the lines on the screen show, without their numbers and without what is said about them. Code that scrolls in its own height has built the lines on its screen and no others, and "select all" there selects those. The button copies all of it.
- `copyable: Boolean`: whether the block has the button that copies the code.
- `onCopy: ((copied: Boolean) -> Unit)?`: called after that button was pressed, with whether the code got to the clipboard: a screen that says so in its own way listens here. The button itself shows a tick for a moment and tells a screen reader, unless the system shows every copy itself (`PantrixClipboard.traits`): there nothing more is needed.
- `trailing: (@Composable () -> Unit)?`: what the screen puts at the header's end, before the button that copies: a count, a button of its own. It is drawn in the block's text colour.
- `style: CodeBlockStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CodeBlockColors?`: this block's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the block's automation key: the block is `CodeBlock_<tagKey>`, a line of it `CodeBlock_<tagKey>.Line_<number>`, the message under a line `CodeBlock_<tagKey>.Note_<number>`, the lines' window where a keyboard scrolls it `CodeBlock_<tagKey>.Lines_window`, and the button that copies `CodeBlock_<tagKey>.Button_copy`. A press on that button is reported as a `CodeBlock` `copy` event with whether the code got there. Nothing of the code is reported.
- `leading: (@Composable RowScope.() -> Unit)?`: what the screen puts at the header's start, before the icon and the title, written in the header's colour: the tabs of one file in two forms, as a page of documentation shows a setup for two repositories.
- `textStyle: TextStyle?`: what the code is set in: the theme's `code` where it is not given, a smaller one on a phone's page.

### PantrixCodeBlock

`import com.pantrixui.components.data.codeblock.PantrixCodeBlock`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCodeBlock(
    lines: List<CodeLine>,
    modifier: Modifier = Modifier,
    title: String? = null,
    language: String? = null,
    icon: ImageVector? = null,
    lineNumbers: Boolean = false,
    firstLineNumber: Int = 1,
    softWrap: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    style: CodeBlockStyle? = null,
    colors: CodeBlockColors? = null,
    tagKey: String? = null,
    leading: (@Composable RowScope.() -> Unit)? = null,
    textStyle: TextStyle? = null
)
```

`PantrixCodeBlock` given its lines one by one, each with what is said about it: a band behind a line that is to be looked at, the lines that were added and taken out, a finding with its message under the line it is about.

`codeLines` makes the lines of a text, to be marked from there.

```kotlin
val lines = remember(source, finding) {
    codeLines(source).mapIndexed { index, line ->
        if (index == finding.line) line.copy(mark = CodeMark(CodeTone.Danger, message = finding.message)) else line
    }
}
PantrixCodeBlock(lines = lines, title = "AuthRepository.kt", lineNumbers = true, tagKey = "review")
```

A line with a mark is drawn on the soft fill of its tone's role, and written in the one colour the theme pairs with that fill; a bar in the role's colour runs down its left edge. A mark's message stands under its line, after the tone's icon, in the app's own reading direction, and does not scroll sideways with the code.

Parameters:

- `lines: List<CodeLine>`: the lines, in their order. The button copies their texts, a line to a line.
- `modifier: Modifier`: the block's modifier. A height given here is the room the code scrolls in.
- `title: String?`: what the header says first: a file's name, or what the code is.
- `language: String?`: the language's name, written after the title in the header, as it is to be read.
- `icon: ImageVector?`: an icon before the title.
- `lineNumbers: Boolean`: whether each line carries its number before the code.
- `firstLineNumber: Int`: the number of the first line. A part taken out of a file starts where it started there.
- `softWrap: Boolean`: whether a line too long for the block goes on under itself.
- `selectable: Boolean`: whether the code can be selected and copied by the system's own means.
- `copyable: Boolean`: whether the block has the button that copies the code.
- `onCopy: ((copied: Boolean) -> Unit)?`: called after that button was pressed, with whether the code got to the clipboard.
- `trailing: (@Composable () -> Unit)?`: what the screen puts at the header's end, before the button that copies.
- `style: CodeBlockStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CodeBlockColors?`: this block's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the block's automation key, as the other overload has it.
- `leading: (@Composable RowScope.() -> Unit)?`: what the screen puts at the header's start, before the icon and the title: the tabs of a file in two forms, written in the header's colour.
- `textStyle: TextStyle?`: what the code is set in: the theme's `code` where it is not given.

### codeLines

`import com.pantrixui.components.data.codeblock.codeLines`, from `com.pantrixui:components`

```kotlin
fun codeLines(
    code: String,
    tokens: List<CodeToken> = emptyList()
): List<CodeLine>
```

The lines of `code`, each with the runs of `tokens` that lie on it: what the `PantrixCodeBlock` that takes a text is given, and where a screen starts that marks some of the lines itself.

```kotlin
val lines = remember(source) {
    codeLines(source, kotlinTokens(source)).mapIndexed { index, line ->
        if (index == failed) line.copy(mark = CodeMark(CodeTone.Danger, message = why)) else line
    }
}
PantrixCodeBlock(lines = lines, lineNumbers = true)
```

A line ends at a line feed, at a carriage return, or at the two together. The break that ends the text ends its last line and starts no other: a file that ends as files do has no empty line after it. A text of nothing is one empty line.

Returns the lines in the text's order, without what ends them.

Parameters:

- `code: String`: the text.
- `tokens: List<CodeToken>`: the runs of `code` that have a colour, placed by the letters of the whole text. A run that goes over a line's end, as a comment of several lines does, is cut into one for each line.

### CodeLine

`import com.pantrixui.components.data.codeblock.CodeLine`, from `com.pantrixui:components`

```kotlin
data class CodeLine(
    public val text: String,
    public val tokens: List<CodeToken> = emptyList(),
    public val mark: CodeMark? = null
)
```

One line of a `PantrixCodeBlock`: what it says, how it is coloured, and what is said about it.

What is said about a line is carried by the line and not kept beside the lines under its number: a number can name a line the block does not have.

Parameters:

- `text: String`: The line, without what ends it. A tab in it is drawn as wide as the type draws one: write the room as spaces where the columns are to line up.
- `tokens: List<CodeToken>`: The runs of `text` that have a colour, each placed by the letters of this line.
- `mark: CodeMark?`: What is said about the line, or nothing.

### CodeToken

`import com.pantrixui.components.data.codeblock.CodeToken`, from `com.pantrixui:components`

```kotlin
data class CodeToken(
    public val start: Int,
    public val end: Int,
    public val kind: CodeTokenKind
)
```

One coloured run of a text of code: the letters from `start` up to `end`, and what they are.

Its place counts the letters of the text it is given with: of the whole text for `codeLines`, which then cuts a run that goes over several lines into one for each, and of the line itself for a `CodeLine`. Where two runs lie over the same letters the later one colours them. What reaches past the text's end is cut there, and a run that holds nothing colours nothing.

Parameters:

- `start: Int`: The place of the run's first letter, counted from nought.
- `end: Int`: The place after its last letter.
- `kind: CodeTokenKind`: What the run is.

### CodeTokenKind

`import com.pantrixui.components.data.codeblock.CodeTokenKind`, from `com.pantrixui:components`

```kotlin
enum class CodeTokenKind
```

What a run of code is, which is what it is coloured by.

There are as many kinds as the theme has colours to tell them apart with: a kind that could only be drawn as its neighbour is would say that two different things are one. A reader of a language that knows more folds the rest in: an operator is `Punctuation`, a property is `Plain`, an escape inside a string is a part of the `StringLiteral`.

Entries:

- `Plain`: What no other kind claims: names, the room between words. A token of it takes a colour off what is under it.
- `Comment`: A comment. It is slanted as well as coloured.
- `Keyword`: A word of the language: `fun`, `val`, `return`.
- `Type`: The name of a type.
- `StringLiteral`: A string or a character, with its quotes.
- `Number`: A number.
- `Punctuation`: Brackets, commas, semicolons: what holds the code together and says nothing itself.
- `Annotation`: A name that says something about what follows it: `@Composable`, `@Override`, a decorator, an attribute.

### CodeMark

`import com.pantrixui.components.data.codeblock.CodeMark`, from `com.pantrixui:components`

```kotlin
data class CodeMark(
    public val tone: CodeTone,
    public val message: String? = null,
    public val source: String? = null
)
```

What is said about a line of code: a band behind the line in the soft fill of the `tone`'s role, a bar down its left edge in the role's colour and, with a `message`, the message under the line.

```kotlin
// The line someone was sent to:
CodeMark(CodeTone.Primary)
// A finding, with what reported it:
CodeMark(CodeTone.Danger, message = "This may be null here.", source = "kotlin:S2259")
```

Parameters:

- `tone: CodeTone`: What the mark means.
- `message: String?`: What is written under the line, in the app's own words and in its reading direction. A screen reader comes to it after the line. Nothing by default: the band alone.
- `source: String?`: What said so, at the message's end: a rule's name, a check's. It is written only with a message.

### CodeTone

`import com.pantrixui.components.data.codeblock.CodeTone`, from `com.pantrixui:components`

```kotlin
enum class CodeTone
```

What a mark on a line of code means: the role of the theme its band and its bar are drawn in.

A tint says nothing to someone who cannot see it. What a mark means stands in its message, as words.

Entries:

- `Primary`: The brand's colour: the line someone was sent to, the one a step of a guide is about.
- `Info`: Something worth knowing that is neither good nor bad.
- `Success`: Something that is well: a line that was added, a check that passed.
- `Warning`: Something to look at before it becomes a problem.
- `Danger`: Something that is wrong: a finding, a failure, a line that was taken out.
- `Neutral`: Set apart without a judgement in it.

### CodeBlockStyle

`import com.pantrixui.components.data.codeblock.CodeBlockStyle`, from `com.pantrixui:components`

```kotlin
class CodeBlockStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val headerHeight: Dp = Dp.Unspecified,
    public val gutterGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val barWidth: Dp = Dp.Unspecified,
    public val headerLineWidth: Dp = Dp.Unspecified,
    public val headerHorizontalPadding: Dp = Dp.Unspecified
) : PantrixStyle<CodeBlockStyle>
```

`PantrixCodeBlock`'s geometry: the room around its lines, its header, the room before the code where the lines are numbered, and the edge.

The lines stand close, as lines of code do: nothing in them is pressed, and they need no room for a finger. A line of the theme's code type is 20dp tall; Android leaves 2dp over and under its words, iOS 1dp, and the desktop and the web none.

The corners are the card's on each platform: medium on Android, large on iOS, small on desktop and the web.

The paddings, the header's height and the gap follow the density, since they are the room around the words. The icons' size, the widths of the edge and of a mark's bar, and the shape do not.

Parameters:

- `shape: ShapeSpec`: The corners of the block: a step of the brand's shape scale, or a fixed shape.
- `horizontalPadding: Dp`: The room between the block's sides and what it holds: the header's words, the lines, a message under a line. A mark's band is drawn across it, to the sides.
- `verticalPadding: Dp`: The room over the first line and under the last, and under a message. A message has half of it over its words.
- `linePadding: Dp`: The room over and under the words of each line.
- `headerHeight: Dp`: The least the header is tall. It grows with what stands in it. A block that has nothing in its header but the button that copies has no header: the button's strip is as tall as the button.
- `gutterGap: Dp`: Between the line numbers and the code, where the lines are numbered.
- `iconSize: Dp`: The width and height of the header's icon, of the icon of the button that copies, and of the one before a message.
- `borderWidth: Dp`: The width of the edge around the block, and of the line under its header where `headerLineWidth` is not set. Zero draws none.
- `barWidth: Dp`: The width of the bar down the left edge of a line with a mark. Zero draws none.
- `headerLineWidth: Dp`: The width of the line under the header: `borderWidth` where it is not set, so that a block without an edge can still have its header ruled off. Zero draws none.
- `headerHorizontalPadding: Dp`: The room between the block's sides and what its header holds: `horizontalPadding` where it is not set. Tabs at the header's start stand nearer the side than the lines do.

### CodeBlockColors

`import com.pantrixui.components.data.codeblock.CodeBlockColors`, from `com.pantrixui:components`

```kotlin
data class CodeBlockColors(
    public val container: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val comment: Color = Color.Unspecified,
    public val keyword: Color = Color.Unspecified,
    public val type: Color = Color.Unspecified,
    public val string: Color = Color.Unspecified,
    public val number: Color = Color.Unspecified,
    public val punctuation: Color = Color.Unspecified,
    public val annotation: Color = Color.Unspecified,
    public val lineNumber: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What a `PantrixCodeBlock` is painted with, for a block that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// No fill and no edge of its own, in a card that has both:
PantrixCodeBlock(
    code = snippet,
    colors = CodeBlockColors(container = Color.Transparent, border = Color.Transparent)
)
```

On the theme's own grounds each kind of token has a colour of its own, from the theme's roles. On another fill those colours are not known to read. A `container` that is one of the theme's role colours, and a transparent one on a fill that gives what stands on it a colour, write all the code in the one colour that reads there; a fill the theme does not have writes it in the theme's text colour. Each colour given here is used wherever the block stands.

A line with a mark is drawn on the soft fill of its tone's role, and all of it is written in the one colour the theme pairs with that fill, as a toned row of a table is: the colours of the kinds are for the theme's grounds, and are not known to read on a role's fill. A comment is still slanted there.

Parameters:

- `container: Color`: The fill behind the header and the lines: the theme's `surface`. `Color.Transparent` leaves what is behind the block to show.
- `text: Color`: What no token colours, and the header's title. The theme's `textPrimary`.
- `comment: Color`: A comment, which is slanted too. The theme's `textSecondary`.
- `keyword: Color`: A word of the language. The theme's primary role.
- `type: Color`: The name of a type. The theme's info role.
- `string: Color`: A string. The theme's success role.
- `number: Color`: A number. The theme's warning role.
- `punctuation: Color`: Brackets, commas and semicolons. The theme's `textSecondary`.
- `annotation: Color`: A name that says something about what follows it. The theme's danger role.
- `lineNumber: Color`: The line numbers, the header's language and its icon, the icon of the button that copies, and the scroll bars. The theme's `textSecondary`.
- `border: Color`: The edge around the block and the line under its header. The theme's `divider` on the theme's own grounds, and on a fill, where that line would not read, a share of what is written there.
