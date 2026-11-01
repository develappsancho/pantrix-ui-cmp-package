# Diagnostics

Defects only a running screen can show: a theme whose diagnostics are on looks for them and hands what it finds to a sink. Pantrix does not know what kind of build it runs in; the app turns the diagnostics on in its own debug build. In this app the diagnostics are on, and they are turned off in "Settings".

## Features

- **Sink.** `PantrixTheme(diagnostics = …)`: `PantrixDiagnostics.Off`, the default, looks for nothing; `PantrixDiagnostics.Log` writes to the platform's log; `PantrixFindings` keeps the findings for tests and for the inspector. A theme inside can take a sink of its own; `LocalPantrixDiagnostics` is the sink at that point.
- **Six checks.** `PantrixCheck`: one tag on two nodes, colours that do not read, a squeezed touch target, a blank name, a theme with no strings for its language and a shadowed shortcut.
- **Finding.** `PantrixFinding`: its check, component, tag, section, English message and the values it measured.
- **When.** A finding is reported once while it lasts; one the layout finds once it has lasted half a second, a repeated tag once it has lasted a second and a half: a page transition shows two pages with the same tags together.
- **Your own component.** `Modifier.checkName` and `Modifier.checkContrast` (`ContrastPair`, `ContrastNeed`) bring a component into the checks; `contrastRatio` is the WCAG ratio of two colours.

## Examples

### Colours that do not read

A brand's pale colour with white written on it: the button's words are hard to read. The example's own theme keeps what it finds in a sink of its own and writes it underneath: the ratio, the ratio needed and the two colours.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixButton(
        text = "Send",
        onClick = {},
        colors = ButtonColors(container = Color(0xFFFFE082), content = Color.White),
        tagKey = "send"
    )
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "No findings yet.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### A blank name

A name that came blank from a source: the icon button has nothing to tell a screen reader. Every component of Pantrix that takes a name says so when its name is blank.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixIconButton(imageVector = PantrixIcons.Close, contentDescription = " ", onClick = {}, tagKey = "close")
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "No findings yet.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### A squeezed touch target

The checkbox's row, squeezed into a box 24 dp high: lower than every platform's touch target. What the layout finds is reported once it has lasted half a second: a row that opens squeezes what it holds for a moment.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    Box(Modifier.height(24.dp)) {
        PantrixCheckbox(checked = true, onCheckedChange = {}, label = "I have read the terms", tagKey = "terms")
    }
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "No findings yet.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### One tag on two nodes

Two buttons with the same key: both are tagged `Button_save`, and a test cannot tell which one it found. Each is given a key of its own, or a section of its own (`TestScope`).

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(text = "Save", onClick = {}, tagKey = "save")
        PantrixButton(text = "Save and close", onClick = {}, tagKey = "save")
    }
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "No findings yet.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### A theme with no strings for its language

A German theme: Pantrix has no German strings, and the components speak English. Once the app gives that language's strings with `PantrixTheme(strings = …)`, the finding goes away.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings, locale = PantrixLocale.forLanguageTag("de")) {
    PantrixText(text = "A German screen", style = PantrixTheme.typography.footnote)
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "No findings yet.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### A shadowed shortcut

A screen's root and a field inside it listen for the same shortcut: when the key is pressed the outer one runs, and the inner one never does.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.keyboard.onShortcut
import com.pantrixui.foundation.testing.pantrixTestTag
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
val search = PantrixShortcut(Key.F, command = true)
PantrixTheme(diagnostics = findings) {
    Column(Modifier.onShortcut(search) {}) {
        val tag = rememberPantrixTestTag(component = "SearchBox", tagKey = "inner")
        PantrixText(
            text = "The inner field listens for the same shortcut too",
            modifier = Modifier.pantrixTestTag(tag).onShortcut(search) {}
        )
    }
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "No findings yet.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Checking a component of your own

A component of the app's own takes part in the checks too: `Swatch` tells its name with `checkName`, and the pair of its text and its ground with `checkContrast`. The line under it writes the ratio of the two colours with `contrastRatio`.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.ContrastNeed
import com.pantrixui.foundation.diagnostics.ContrastPair
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.diagnostics.checkContrast
import com.pantrixui.foundation.diagnostics.checkName
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.contrastRatio

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    Swatch(name = "Sand", fill = Color(0xFFF5E6C8), label = Color(0xFFB0A080))
}
Found(findings)

@Composable
private fun Swatch(
    name: String,
    fill: Color,
    label: Color
) {
    Column(
        modifier = Modifier
            .checkName("Swatch", name)
            .checkContrast("Swatch") { listOf(ContrastPair("label on fill", label, fill, ContrastNeed.Text)) }
            .background(fill)
            .padding(12.dp)
    ) {
        PantrixText(text = name, color = label)
    }
    PantrixText(
        text = "Ratio: ${(contrastRatio(label, fill) * 100).toInt() / 100f}",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "No findings yet.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### To the log and to a test

For a test or a log: `PantrixFindings(then = PantrixDiagnostics.Log)` both keeps the findings and writes them to the log. `LocalPantrixDiagnostics` is the theme's sink at that point; a finding's fields are read one by one.

```kotlin
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.LocalPantrixDiagnostics
import com.pantrixui.foundation.diagnostics.PantrixCheck
import com.pantrixui.foundation.diagnostics.PantrixDiagnostics
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings(then = PantrixDiagnostics.Log) }
PantrixTheme(diagnostics = findings) {
    PantrixIconButton(imageVector = PantrixIcons.Search, contentDescription = "", onClick = {}, tagKey = "search")
    val here = LocalPantrixDiagnostics.current
    PantrixText(
        text = "Is the sink here the one that keeps the findings: ${here === findings}",
        style = PantrixTheme.typography.footnote
    )
}
findings.all.forEach { finding ->
    val missing = finding.check == PantrixCheck.MissingName
    PantrixText(
        text = "${finding.check.name} · ${finding.component} · ${finding.testTag} · blank name: $missing",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}
```

## API

### PantrixDiagnostics

`import com.pantrixui.foundation.diagnostics.PantrixDiagnostics`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixDiagnostics
```

Where a theme's diagnostics send what they find.

`Off`, the default, turns the checks off as well: they return at their first line, and a release build pays next to nothing for them. Pantrix does not know what kind of build it runs in, so an app turns them on in its debug build: `PantrixTheme(diagnostics = if (debug) PantrixDiagnostics.Log else PantrixDiagnostics.Off)`. A test or an inspector keeps them with `PantrixFindings`.

A finding is reported once while it lasts, and again if it comes back after it was put right. A squeezed touch target, which a layout makes, is reported once it has lasted half a second: a row that opens squeezes what it holds for a moment. Two nodes with one tag are reported once they have lasted a second and a half, longer than a page transition, which shows the page that goes and the one that comes together.

Members:

- `fun report(finding: PantrixFinding)`: Called with each `finding` on the UI thread, outside composition and layout.

On the type:

- `PantrixDiagnostics.Off: PantrixDiagnostics`: Turns the checks off: nothing is looked for, and nothing is reported.
- `PantrixDiagnostics.Log: PantrixDiagnostics`: Writes each finding to the platform's log: Logcat on Android, the console on iOS and in a browser, and the standard error on the JVM.

### PantrixFindings

`import com.pantrixui.foundation.diagnostics.PantrixFindings`, from `com.pantrixui:foundation`

```kotlin
class PantrixFindings(
    private val then: PantrixDiagnostics = PantrixDiagnostics.Off
) : PantrixDiagnostics
```

Keeps what a theme's diagnostics find, for a test to read and for an inspector to show, and hands each finding on to `then` as well.

```kotlin
val findings = PantrixFindings()
setContent { PantrixTheme(diagnostics = findings) { CheckoutScreen() } }
assertEquals(emptyList(), findings.all)
```

Parameters:

- `then: PantrixDiagnostics`: Where each finding goes on to once it is kept: `PantrixDiagnostics.Log` writes it to the log too.

Members:

- `all: List<PantrixFinding>`: What has been found since this was made or last cleared, in the order it was found: the list as it is when read, which equals any list of the same findings. A finding that comes back after it was put right is kept once; read in a composition, the list is followed as it grows.
- `fun clear()`: Forgets what has been found.
- `fun boundsOf(finding: PantrixFinding): Rect?`: Where the node `finding` was made on is now, in the coordinates of the window it is drawn in: what an inspector outlines. Null where that node is gone, and for a finding made on no node, as one about a theme's colours.

### PantrixFinding

`import com.pantrixui.foundation.diagnostics.PantrixFinding`, from `com.pantrixui:foundation`

```kotlin
data class PantrixFinding(
    public val check: PantrixCheck,
    public val component: String?,
    public val testTag: String?,
    public val screen: String?,
    public val message: String,
    public val values: Map<String, String> = emptyMap()
)
```

What a check found: which check, where, and why.

Parameters:

- `check: PantrixCheck`: The check that found it.
- `component: String?`: The component it was found in, e.g. `Button`, or null where no component is known.
- `testTag: String?`: The automation tag of the node it was found on, or null where the node carries none.
- `screen: String?`: The enclosing `TestScope` chain, e.g. `Checkout.PaymentForm`, or null outside one.
- `message: String`: What is wrong and how it is put right, in English: a developer reads it, not the app's user.
- `values: Map<String, String>`: The measured values the message speaks of, such as the `ratio` a contrast has and the one it needs.

### PantrixCheck

`import com.pantrixui.foundation.diagnostics.PantrixCheck`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixCheck
```

A kind of defect that only a running screen shows, which a theme's diagnostics look for while they are on.

Entries:

- `DuplicateTestTag`: Two nodes of one window carry the same automation tag, and a test that looks for it cannot tell which of them it found.
- `LowContrast`: A colour is hard to read on the colour it is drawn on: text under 4.5:1, large text and the mark of a control under 3:1, as WCAG 2.2 measures them.
- `SmallTouchTarget`: A control is laid out in less room than the platform's touch target, and answers to a press in less than it.
- `MissingName`: What a screen reader says for a control or a picture is blank.
- `NoStringsForLanguage`: The theme's language has no strings of its own, and the components speak English in it.
- `ShadowedShortcut`: A keyboard shortcut is heard first by a node around the one it is on, and never runs there.

### LocalPantrixDiagnostics

`import com.pantrixui.foundation.diagnostics.LocalPantrixDiagnostics`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixDiagnostics: ProvidableCompositionLocal<PantrixDiagnostics>
```

Where the checks of the components inside a theme send what they find: the theme's `diagnostics`.

A theme whose diagnostics change while its content is shown turns the checks of that content on or off at once.

### ContrastPair

`import com.pantrixui.foundation.diagnostics.ContrastPair`, from `com.pantrixui:foundation`

```kotlin
data class ContrastPair(
    public val what: String,
    public val foreground: Color,
    public val background: Color,
    public val need: ContrastNeed
)
```

A colour a component draws on another, and how readable it must be there.

Parameters:

- `what: String`: The pair's name in a finding, e.g. `label on container`.
- `foreground: Color`: The colour drawn: text, an icon, a mark.
- `background: Color`: The colour it is drawn on.
- `need: ContrastNeed`: How readable it must be.

### ContrastNeed

`import com.pantrixui.foundation.diagnostics.ContrastNeed`, from `com.pantrixui:foundation`

```kotlin
enum class ContrastNeed(
    public val ratio: Float
)
```

How readable a colour must be on the colour under it, as WCAG 2.2 asks.

Parameters:

- `ratio: Float`: The contrast it needs at the least, as `contrastRatio` measures it.

Entries:

- `Text`: Text: 4.5:1.
- `LargeText`: Text of 18pt and more, or of 14pt and more in bold: 3:1.
- `Mark`: What shows a control or its state without words, as a checkbox's box, a field's edge or a focus ring: 3:1.

### Modifier.checkContrast

`import com.pantrixui.foundation.diagnostics.checkContrast`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.checkContrast(
    component: String,
    pairs: () -> List<ContrastPair>
): Modifier
```

Tells the theme's diagnostics, while they are on, which colours `component` draws on which: a pair that reads under what it needs is reported as `PantrixCheck.LowContrast`, once for the component and those colours however many of it show them. `pairs` is called only while the diagnostics are on, and again when they or the theme's colours change.

A background that lets through what is under it, as that of a button without a fill, is measured on the theme's background and on its surface, where the component stands on one of the theme's own grounds, and the lower of the two counts. On a fill of another colour, which gives what stands on it a content colour of its own, such a pair is not measured: what is under it is not known. Nor is a pair with an unspecified colour.

Parameters:

- `component: String`: The component's name in a finding, e.g. `Button`.
- `pairs: () -> List<ContrastPair>`: The colours it draws on which, in the state it is in. A disabled component, which no one is asked to read, gives none.

### Modifier.checkName

`import com.pantrixui.foundation.diagnostics.checkName`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.checkName(
    component: String,
    name: String?
): Modifier
```

Tells the theme's diagnostics, while they are on, what a screen reader says for `component`: a blank `name` is reported as `PantrixCheck.MissingName`. A null name is no name given here, as for a picture that is only decoration or a control that is named by its text, and is not reported; a control that has no other name passes a blank one.

Parameters:

- `component: String`: The component's name in a finding, e.g. `IconButton`.
- `name: String?`: What a screen reader says for it: its `contentDescription`, its `label` or its `title`.

### contrastRatio

`import com.pantrixui.foundation.token.color.contrastRatio`, from `com.pantrixui:foundation`

```kotlin
fun contrastRatio(
    foreground: Color,
    background: Color
): Float
```

How far `foreground` stands out from `background`, as WCAG 2.2 measures it: the relative luminance of the lighter of the two over that of the darker, each plus 0.05. It runs from 1, for a colour on itself, to 21, for black on white. Text is read at 4.5 and more; large text and the mark of a control, as a checkbox's box, at 3 and more.

A `foreground` that lets the background through is measured as it is drawn: laid over `background`. The `background` is measured as it is given; one that lets through what is under it is laid over that first.

Parameters:

- `foreground: Color`
- `background: Color`
