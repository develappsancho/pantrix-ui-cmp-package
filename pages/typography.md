# Typography

The theme's type scale: `PantrixTheme.typography`. Nine styles, largest to smallest. A text asks for its size by its job, not in points: a page's title is `display`, a card's title is `title`, a button's label is `label`. The theme says what size and weight that job is set in.

The metrics on this page are not written by hand. The line above each specimen reads the style's name and its metrics from the `TextStyle` in the theme: `size / line height · weight · letter spacing`. When the type scale or the typeface changes, this page changes with it by itself.

## Features

- **Nine styles.** `display`, `headline` and `title` for headings; `callout`, `body`, `label`, `footnote` and `caption` for text; `code` for identity-bearing text.
- **Text given no style is `label`.** `PantrixText`, `PantrixLink` and `PantrixAutoText` are set in the base text, `LocalPantrixTextStyle`, when they are given no `style`. The theme starts it at `label`: the style of a control's label. A part gives its own base text with `ProvidePantrixTextStyle`. Compose Foundation's `BasicText` does not read this value: a `BasicText` given no style is set in the system's typeface.
- **A style named by its role.** `TypeRole` is a role of the scale; `PantrixTheme.typography[TypeRole.Body]` is its style. A component's style names the role without holding a typeface: text fields are set in `TextFieldStyle.textRole`, `body` on Android and iOS, `label` on the desktop and the web.
- **The scale and the typeface are separate.** `buildPantrixTypography(fontFamily = …)` keeps the scale and changes the typeface: a brand's family is passed, and the sizes and the weights stay the same.
- **Three families.** `fontFamily` is the family of the text, `headingFontFamily` that of `display`, `headline` and `title`, and `monoFamily` that of `code`. A heading family that is not given is the text's; a monospace family that is not given is `FontFamily.Monospace`.
- **Pantrix's own typeface.** `rememberPantrixTypography()` gives the scale in Plus Jakarta Sans, loaded from the library's own resources. It is what is used when the app's theme is given no typography.
- **Weights.** The library's typeface is one variable font: its weight axis runs from 200 to 800.
- **An app's typeface.** `PantrixTypeface` names a typeface by its font files; each file, with its weight, is a `PantrixFont`. `rememberPantrixTypography(typeface)` gives the scale in that typeface; `codeTypeface` has code written in a typeface of its own.
- **Fallback fonts.** In a browser, Compose draws a character none of the app's fonts has in a Noto font it fetches from Google's servers. A `PantrixTypeface`'s `fallbacks` are the fonts of such characters: they are read with the typeface, and nothing is fetched. The library's typeface carries Pantrix Symbols for the marks of a Mac's keys (`⌘ ⇧ ⌥`).
- **In a browser.** A browser fetches the typeface, and draws text in a fallback face until it arrives. `PantrixTypefaceGate` draws the app after the typeface has come; `rememberPantrixTypography(typeface)` stays in the old typeface while it is changed, and changes once when the new one has come. `areTypefacesLoaded(…)` says when it has.
- **A section's typeface.** `PantrixTheme(typography = …)` gives that typography to every component inside it: to the whole app, or to one section of it alone.
- **A style is a look, not a role.** Text set in a heading style is not a heading to a screen reader: that is what the `role` parameter of `PantrixText` says, `TextRole.Heading(level)`.
- **The system's font size.** The scale's sizes, line heights and letter spacings are given in sp: when the system's font size is raised, the text grows with it.

## Examples

### Headings

The scale's three heading styles. `display` is the page's title, typically one per screen. `headline` is a section's heading. `title` is the title of a card, a panel or a dialog.

The line above each specimen reads the style's name and its metrics from the theme. All three are set in the heading family given when the scale is built (`headingFontFamily`).

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

val type = PantrixTheme.typography
TypeSpecimen(name = "display", style = type.display, text = "Design system")
TypeSpecimen(name = "headline", style = type.headline, text = "Recent orders")
TypeSpecimen(name = "title", style = type.title, text = "Payment method")

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · letter spacing ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

### Text styles

The five styles for text, largest to smallest, each with the kind of text it meets where it is used. `callout` is emphasised body: a lead paragraph, the description of an empty screen. `body` is body text: a paragraph, a description, what is typed in a field. `label` is a control's label: a button, a tab, the name of a form field. `footnote` is supporting text: a form's help text, the explanation of an error. `caption` is metadata: a time, a counter, a detail in a table cell.

The body specimen has every letter of the alphabet, and its paragraph runs over several lines: that is where the line height shows.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

val type = PantrixTheme.typography
TypeSpecimen(
    name = "callout",
    style = type.callout,
    text = "You have no orders yet. When you place your first order, it will appear here."
)
TypeSpecimen(
    name = "body",
    style = type.body,
    text = "The quick brown fox jumps over the lazy dog. " +
        "This paragraph shows how the line height holds over more than one line."
)
TypeSpecimen(name = "label", style = type.label, text = "Add to cart")
TypeSpecimen(name = "footnote", style = type.footnote, text = "Your password must be at least 8 characters long.")
TypeSpecimen(name = "caption", style = type.caption, text = "Updated 2 minutes ago · 3 / 5")

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · letter spacing ${letterSpacing.formatted()}"

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}
```

### Code and the monospace family

`code` is the style of identity-bearing text: an order number, an event name, a fragment of code. It is set in a monospace family.

The family is the `monoFamily` parameter of `buildPantrixTypography`. For a single identifier inside a sentence, only the style's family is taken and not the whole style: the number in the second line is set in the family of `code`, at the sentence's own size.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

val type = PantrixTheme.typography
TypeSpecimen(name = "code", style = type.code, text = "order_id = 8F2A-19C4")
PantrixText(
    text = buildAnnotatedString {
        append("Order ")
        withStyle(SpanStyle(fontFamily = type.code.fontFamily)) { append("8F2A-19C4") }
        append(" has shipped.")
    },
    style = type.body
)

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · letter spacing ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

### Text given no style

The first text is given no style and the second is given `label`: the two are drawn the same. A `PantrixText` that is given no `style` is set in the theme's `label` style; so are `PantrixLink` and `PantrixAutoText`.

`label` is the style of a control's label. A paragraph, a heading or a footnote asks for its style explicitly: `style = PantrixTheme.typography.body`.

```kotlin
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

PantrixText(text = "Style not given: Add to cart", tagKey = "no_style")
PantrixText(text = "Style label: Add to cart", style = PantrixTheme.typography.label, tagKey = "label_style")
PantrixText(
    text = "label · ${PantrixTheme.typography.label.metrics()}",
    style = PantrixTheme.typography.caption,
    color = PantrixTheme.colors.textSecondary
)

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · letter spacing ${letterSpacing.formatted()}"

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}
```

### The base text of a part

A part gives the style of the text in it that is given none itself: `ProvidePantrixTextStyle`. Here a part of paragraphs is set in `body`. A part inside it gives only the weight: what it gives goes over the one around it, and the size and the line height it does not give stay as they are. Text given a style is still in its own style.

A section's base text is told by `LocalPantrixTextStyle`: the last line reads it.

```kotlin
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle
import com.pantrixui.foundation.token.typography.ProvidePantrixTextStyle
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

ProvidePantrixTextStyle(PantrixTheme.typography.body) {
    PantrixText(text = "In this part, text given no style is set in the body.", tagKey = "part_body")
    ProvidePantrixTextStyle(TextStyle(fontWeight = FontWeight.Bold)) {
        PantrixText(text = "A part inside it changes only the weight.", tagKey = "part_bold")
    }
    PantrixText(
        text = "Text given a style is set in its own style.",
        style = PantrixTheme.typography.footnote,
        tagKey = "part_footnote"
    )
    PantrixText(
        text = "This section's base text: ${LocalPantrixTextStyle.current.metrics()}",
        style = PantrixTheme.typography.caption,
        color = PantrixTheme.colors.textSecondary
    )
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · letter spacing ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

### Weights

A style can be changed in place: `copy(fontWeight = …)` keeps the style's size and line height and changes its weight. Here is the `body` style in seven weights.

The typeface here is not taken from the theme but from the library itself, with `rememberPantrixTypography()`: it is one variable font whose weight axis runs from 200 to 800, and each of the seven weights here is one point on that axis. `Thin` and `Black` lie outside the axis: they are drawn in the nearest weights, `ExtraLight` and `ExtraBold`.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.ui.text.font.FontWeight
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixTypography

val body = rememberPantrixTypography().body
val weights = listOf(
    "ExtraLight" to FontWeight.ExtraLight,
    "Light" to FontWeight.Light,
    "Normal" to FontWeight.Normal,
    "Medium" to FontWeight.Medium,
    "SemiBold" to FontWeight.SemiBold,
    "Bold" to FontWeight.Bold,
    "ExtraBold" to FontWeight.ExtraBold
)
Column {
    weights.forEach { (name, weight) ->
        PantrixText(text = "$name · The quick brown fox jumps over the lazy dog", style = body.copy(fontWeight = weight))
    }
}
```

### Your own typeface

The app's own typeface: `buildPantrixTypography(fontFamily = …)` keeps Pantrix's scale and changes the typeface. Here the family is Poppins, from the app's own font files; `PantrixTheme(typography = …)` gives it to every component inside it.

The line above each specimen shows that the metrics stay the same: the size, the line height, the weight and the letter spacing are the scale's, and only the letters themselves change.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.PantrixTypography
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily
import kotlin.math.abs
import kotlin.math.roundToInt

val poppins = rememberPantrixFontFamily(Poppins)
val typography: PantrixTypography = remember(poppins) { buildPantrixTypography(fontFamily = poppins) }
PantrixTheme(typography = typography) {
    val type = PantrixTheme.typography
    TypeSpecimen(name = "headline", style = type.headline, text = "Recent orders")
    TypeSpecimen(name = "body", style = type.body, text = "The quick brown fox jumps over the lazy dog.")
    TypeSpecimen(name = "label", style = type.label, text = "Add to cart")
}

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · letter spacing ${letterSpacing.formatted()}"

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `Poppins`: Poppins from the app's own files: seven weights, each a file of its own. It has no SemiBold: a text of that weight is drawn in a neighbouring one. Its licence, the SIL Open Font License 1.1, is beside the files: `files/licenses/poppins_ofl.txt`. The marks of a Mac's keys are drawn in the library's fallback.

### Headings in another family

Headings and text can be in separate families. `headingFontFamily` is the family of `display`, `headline` and `title` alone; the rest is set in `fontFamily`. Here the heading is in Poppins and the paragraph under it in Plus Jakarta Sans.

Unless `headingFontFamily` is given, the headings are set in `fontFamily` too.

```kotlin
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily

val text = rememberPantrixFontFamily(PlusJakartaSans)
val headings = rememberPantrixFontFamily(Poppins)
val typography = remember(text, headings) {
    buildPantrixTypography(fontFamily = text, headingFontFamily = headings)
}
PantrixTheme(typography = typography) {
    PantrixText(text = "Recent orders", style = PantrixTheme.typography.headline)
    PantrixText(
        text = "You have no orders yet. When you place your first order, it will appear here.",
        style = PantrixTheme.typography.body
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `PlusJakartaSans`: Plus Jakarta Sans from the app's own files: seven weights, each a file of its own.
- `Poppins`: Poppins from the app's own files: seven weights, each a file of its own. It has no SemiBold: a text of that weight is drawn in a neighbouring one. Its licence, the SIL Open Font License 1.1, is beside the files: `files/licenses/poppins_ofl.txt`. The marks of a Mac's keys are drawn in the library's fallback.

### The app's three typographies

This app has three typographies: the library's own (`rememberPantrixTypography()`), and Plus Jakarta Sans and Poppins from the app's own files. All three are the same scale. The first two are the same typeface as well: the library's own typeface is Plus Jakarta Sans too, and only the font files differ. The one whose letters are different is Poppins. Here each stands in a theme of its own, one under another; the one that says "selected" is the app's typography right now.

The "Typeface" choice in "Settings" and the menu in the top bar switch the whole app to another one. The choice is a state: when it changes the theme is recomposed, and every page is drawn in the new typeface.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get

val chosen = LocalDemoSettings.current.typography
TypographyStyle.entries.forEach { style ->
    PantrixTheme(typography = defaultTypography(style)) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixText(
                text = if (style == chosen) "${style.title.here} · selected" else style.title.here,
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixText(text = "Recent orders", style = PantrixTheme.typography.headline)
            PantrixText(
                text = "The quick brown fox jumps over the lazy dog.",
                style = PantrixTheme.typography.body
            )
        }
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalDemoSettings`: The app's settings, for every screen inside it: the buttons in the top bar and the "Settings" page read and change them from here. Outside the app, on a page drawn by itself in a test, they are the default settings.
- `TypographyStyle`: Says where the app's typography comes from.
- `defaultTypography`: The typography of the choice `style`: Pantrix's scale, in the typeface that is chosen.

### A style by its role

The scale's nine roles, by their jobs: `TypeRole` says what a text is, `typography[role]` gives its style. A component's style says its text the same way, by a role: when the theme changes, it is not the style but the role's style that changes.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.TypeRole
import com.pantrixui.foundation.token.typography.get

val typography = PantrixTheme.typography
TypeRole.entries.forEach { role ->
    PantrixText(text = role.name, style = typography[role], tagKey = "role_${role.name.lowercase()}")
}
```

### A typeface from its files

A typeface is built from its files: each `PantrixFont` is a font file and its weight, and a `PantrixTypeface` is a list of them. `rememberPantrixFontFamily` reads the files and gives a family. The marks of keys Poppins lacks (`⌘K`) are drawn in the fallback, the library's Pantrix Symbols: `fallbacks`.

On the web, until the files arrive the text is drawn in another typeface. `areTypefacesLoaded(…)` says whether the files have been read, `isPantrixTypefaceLoaded()` the same of the library's own typeface. `PantrixTypefaceGate` draws its content only once the typeface has been read: at the app's root, so that the text is not seen in another typeface for a moment.

```kotlin
import androidx.compose.ui.text.font.FontWeight
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.PantrixFont
import com.pantrixui.foundation.token.typography.PantrixTypeface
import com.pantrixui.foundation.token.typography.PantrixTypefaceGate
import com.pantrixui.foundation.token.typography.areTypefacesLoaded
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.isPantrixTypefaceLoaded
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.poppins_bold
import pantrixui.app.shared.generated.resources.poppins_regular

val family = rememberPantrixFontFamily(HEADINGS)
val loaded = areTypefacesLoaded(HEADINGS)
PantrixText(
    text = "Heading files read: ${if (loaded) "yes" else "no"} · " +
        "Pantrix's typeface: ${if (isPantrixTypefaceLoaded()) "yes" else "no"}",
    style = PantrixTheme.typography.caption,
    color = PantrixTheme.colors.textSecondary
)
PantrixTypefaceGate(loaded = loaded) {
    PantrixText(text = "Winter collection ⌘K", style = PantrixTheme.typography.headline.copy(fontFamily = family))
}

private val HEADINGS = PantrixTypeface(
    fonts = listOf(
        PantrixFont(Res.font.poppins_regular, FontWeight.Normal),
        PantrixFont(Res.font.poppins_bold, FontWeight.Bold)
    ),
    fallbacks = PantrixTypeface.Default.fallbacks
)
```

### The code's own typeface

The code's typeface is given apart from the text's: `rememberPantrixTypography(typeface, codeTypeface)` builds the scale in `typeface` and the `code` style in `codeTypeface`. Without it, code is written in `FontFamily.Monospace`. A brand gives its own monospaced typeface here; this demo carries only two families, so the code is written in Poppins.

An app that keeps its typefaces in a list asks with the list whether they have all arrived: `areTypefacesLoaded(list)`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.areTypefacesLoaded
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixTypography
import kotlin.math.abs
import kotlin.math.roundToInt

val typefaces = remember { listOf(PlusJakartaSans, Poppins) }
val type = rememberPantrixTypography(PlusJakartaSans, codeTypeface = Poppins)
PantrixText(
    text = "Both typefaces read: ${if (areTypefacesLoaded(typefaces)) "yes" else "no"}",
    style = PantrixTheme.typography.caption,
    color = PantrixTheme.colors.textSecondary
)
TypeSpecimen(name = "body", style = type.body, text = "The order has been shipped.")
TypeSpecimen(name = "code", style = type.code, text = "order_id = 8F2A-19C4")

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · letter spacing ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `PlusJakartaSans`: Plus Jakarta Sans from the app's own files: seven weights, each a file of its own.
- `Poppins`: Poppins from the app's own files: seven weights, each a file of its own. It has no SemiBold: a text of that weight is drawn in a neighbouring one. Its licence, the SIL Open Font License 1.1, is beside the files: `files/licenses/poppins_ofl.txt`. The marks of a Mac's keys are drawn in the library's fallback.

## API

### PantrixTypography

`import com.pantrixui.foundation.token.typography.PantrixTypography`, from `com.pantrixui:foundation`

```kotlin
data class PantrixTypography(
    val display: TextStyle,
    val headline: TextStyle,
    val title: TextStyle,
    val callout: TextStyle,
    val body: TextStyle,
    val label: TextStyle,
    val footnote: TextStyle,
    val caption: TextStyle,
    val code: TextStyle
)
```

Nine type roles: eight from the largest to the smallest, `display > headline > title > callout > body > label > footnote > caption`, and `code` beside them, a label's size in a monospace family.

Parameters:

- `display: TextStyle`: Page title. Typically one per screen.
- `headline: TextStyle`: Section heading.
- `title: TextStyle`: Card, panel or dialog title.
- `callout: TextStyle`: Emphasised body: a lead paragraph, an empty state's description.
- `body: TextStyle`: Body text: a paragraph, a description, what a field is typed in on Android and iOS.
- `label: TextStyle`: Control label: button, nav item, form field label, tab; what a field is typed in on the desktop and the web. The base text: what the theme starts `LocalPantrixTextStyle` at, and so what a `PantrixText` is set in when it is given no style.
- `footnote: TextStyle`: Supporting text: form help, error explanation, secondary guidance.
- `caption: TextStyle`: Metadata: timestamp, counter, table cell detail.
- `code: TextStyle`: Identity-bearing text: IDs, event names, code fragments; what a code block and a JSON view are written in.

### TypeRole

`import com.pantrixui.foundation.token.typography.TypeRole`, from `com.pantrixui:foundation`

```kotlin
enum class TypeRole
```

A role of the type scale, by its job: what a component's style names where it says which type a text of it is set in, without holding a typeface. The theme's `PantrixTypography` says what each one is: `typography[TypeRole.Body]`.

Entries:

- `Display`: `PantrixTypography.display`.
- `Headline`: `PantrixTypography.headline`.
- `Title`: `PantrixTypography.title`.
- `Callout`: `PantrixTypography.callout`.
- `Body`: `PantrixTypography.body`.
- `Label`: `PantrixTypography.label`.
- `Footnote`: `PantrixTypography.footnote`.
- `Caption`: `PantrixTypography.caption`.
- `Code`: `PantrixTypography.code`.

### LocalPantrixTextStyle

`import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixTextStyle: ProvidableCompositionLocal<TextStyle>
```

The style that text is set in where it is given none, for everything inside whatever provides it: what `PantrixText`, `PantrixLink` and `PantrixAutoText` take when no style is given them. The theme starts it at its scale's `PantrixTypography.label`, the base text on every platform. A part of a screen that reads in another role, a page of prose in the body's, provides that one with `ProvidePantrixTextStyle`.

Compose Foundation's own `BasicText` reads no such value: given no style it sets its text in `TextStyle.Default`, the system's typeface at 14sp. A text of an app's own that is not one of Pantrix's takes this one itself: `BasicText(text, style = LocalPantrixTextStyle.current)`. `TextStyle.Default` is also what this holds outside a `PantrixTheme`.

### ProvidePantrixTextStyle

`import com.pantrixui.foundation.token.typography.ProvidePantrixTextStyle`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ProvidePantrixTextStyle(
    style: TextStyle,
    content: @Composable () -> Unit
)
```

Sets the text in `content` that is given no style in `style` over the one around it: what `style` sets wins, and what it leaves out stays as it was, so `TextStyle(fontWeight = FontWeight.SemiBold)` makes the text around heavier and keeps its size.

Parameters:

- `style: TextStyle`
- `content: @Composable () -> Unit`

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixTypography(): PantrixTypography
```

Pantrix's type scale in its own face, Plus Jakarta Sans, loaded from the library's resources.

A browser fetches the font, and draws in a fallback face until it arrives: `isPantrixTypefaceLoaded` says when it has.

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixTypography(
    typeface: PantrixTypeface,
    codeTypeface: PantrixTypeface? = null
): PantrixTypography
```

Pantrix's type scale in `typeface`, an app's own: the scale's sizes and weights, in the fonts the typeface names, and its `code` in `codeTypeface` where one is given.

A typeface that is changed is changed when it has arrived. A browser fetches a typeface's files, and a text in it is drawn in a fallback face until they are read: so while `typeface` or `codeTypeface` is on its way this goes on giving the scale in the typefaces it gave before, and gives it in the new ones once, when all of them have been read. Where nothing was given before, at an app's first frame, it is given in the fallback face: `PantrixTypefaceGate` holds the screen back until the typefaces are there.

```kotlin
val typography = rememberPantrixTypography(Brand, codeTypeface = BrandMono)
PantrixTheme(typography = typography) { App() }
```

Parameters:

- `typeface: PantrixTypeface`: what every role but `code` is set in.
- `codeTypeface: PantrixTypeface?`: what `code` is set in: identifiers, values, a code block's lines. Without one, the platform's monospace family, which a browser does not have: Compose on the web reaches no system font, and `code` is drawn there in a proportional fallback whose columns do not line up. An app for the web gives one.

### buildPantrixTypography

`import com.pantrixui.foundation.token.typography.buildPantrixTypography`, from `com.pantrixui:foundation`

```kotlin
fun buildPantrixTypography(
    fontFamily: FontFamily = FontFamily.Default,
    headingFontFamily: FontFamily = fontFamily,
    monoFamily: FontFamily = FontFamily.Monospace
): PantrixTypography
```

Pantrix's type scale, set in `fontFamily`, with `headingFontFamily` for display, headline and title and `monoFamily` for code. Pass a brand's families to keep the scale and change the face.

Parameters:

- `fontFamily: FontFamily`
- `headingFontFamily: FontFamily`
- `monoFamily: FontFamily`

### PantrixTypeface

`import com.pantrixui.foundation.token.typography.PantrixTypeface`, from `com.pantrixui:foundation`

```kotlin
data class PantrixTypeface(
    val fonts: List<PantrixFont>,
    val fallbacks: List<PantrixFont> = emptyList()
)
```

A typeface, as the font files it is made of, and the fonts a browser draws the characters they lack in.

```kotlin
val Brand = PantrixTypeface(
    PantrixFont(Res.font.brand_regular),
    PantrixFont(Res.font.brand_bold, FontWeight.Bold)
)
```

`rememberPantrixTypography(Brand)` is Pantrix's type scale in it, and `rememberPantrixFontFamily` its family alone. On Android, iOS and the desktop its files are read where they are asked for. A browser fetches them, and draws in a fallback face until they arrive: `areTypefacesLoaded` says when they have, and `PantrixTypefaceGate` holds a screen back until then.

In a browser, Compose draws a character none of the app's fonts has in a Noto font it fetches from Google's servers: every visitor's browser asks Google for it, a page that is offline leaves the character blank, and a content security policy must let the page reach Google. A font given in `fallbacks` that has the character is read with the typeface instead, and nothing is fetched for it. A brand that writes the marks of a Mac's keys gives Pantrix's:

```kotlin
val Brand = PantrixTypeface(
    fonts = listOf(PantrixFont(Res.font.brand_regular), PantrixFont(Res.font.brand_bold, FontWeight.Bold)),
    fallbacks = PantrixTypeface.Default.fallbacks
)
```

Parameters:

- `fonts: List<PantrixFont>`: Its fonts, each a file with its weight and its style. At least one.
- `fallbacks: List<PantrixFont>`: The fonts a browser draws a character in that none of `fonts` has, read with them: a script the typeface does not cover, as Arabic, or marks, as a Mac's keys. Each is drawn as it is, whatever the text's weight. On Android, iOS and the desktop the system's fonts draw such a character, and these are not read.

Another constructor:

```kotlin
constructor(vararg fonts: PantrixFont)
```

Its parameters:

- `vararg fonts: PantrixFont`

On the type:

- `PantrixTypeface.Default: PantrixTypeface`: Pantrix's own typeface, Plus Jakarta Sans, from the library's resources: what a theme draws in when it is given no typography. Its fallback, Pantrix Symbols, a font of a few kilobytes cut from Noto's, has the marks a shortcut is written in on Apple's systems and Plus Jakarta Sans lacks: `⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`.

### PantrixFont

`import com.pantrixui.foundation.token.typography.PantrixFont`, from `com.pantrixui:foundation`

```kotlin
data class PantrixFont(
    val resource: FontResource,
    val weight: FontWeight = FontWeight.Normal,
    val style: FontStyle = FontStyle.Normal,
    val variationSettings: FontVariation.Settings = FontVariation.Settings(weight, style)
)
```

One font of a typeface: a file of an app's resources, and the weight and the style a family registers it for.

It is what `Font(resource, weight, style)` of Compose's resources takes, kept as a value: one list of fonts then makes the family and is asked whether it has been read, and the two cannot come apart. A variable font is one file, given once for each weight it is to be drawn in.

Parameters:

- `resource: FontResource`: The font file, as the app's generated `Res.font` names it.
- `weight: FontWeight`: The weight the file is drawn for.
- `style: FontStyle`: Upright or italic.
- `variationSettings: FontVariation.Settings`: Where on a variable font's axes the font is drawn. What `weight` and `style` say when nothing is given; a font with more axes, a width or an optical size, is given them here.

### rememberPantrixFontFamily

`import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixFontFamily(typeface: PantrixTypeface): FontFamily
```

The family of `typeface`: each of its fonts, read from its file.

In a browser a font that has not arrived yet is the fallback face, and the family changes as its fonts come in. `rememberPantrixTypography(typeface)` keeps a screen from showing that.

Parameters:

- `typeface: PantrixTypeface`

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun areTypefacesLoaded(vararg typefaces: PantrixTypeface): Boolean
```

Whether every font of `typefaces` has been read, their fallbacks too.

On Android, iOS and the desktop a font is read where it is asked for, and this is true from the first frame. A browser fetches the files: until they arrive every text in them is drawn in the fallback face the renderer carries, and is laid out again when they come. A typeface's fallbacks are read beside its fonts, and given to Compose's text once they are, so that a character only they have is drawn in them from the first frame.

Asking is what starts the read, and every font is asked for together. So the typefaces a screen needs are given in one call: two calls joined with `&&` would not ask for the second typeface until the first had come. It stays false where a file cannot be read, so whoever waits on it waits for a while and no longer.

Parameters:

- `vararg typefaces: PantrixTypeface`

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun areTypefacesLoaded(typefaces: List<PantrixTypeface>): Boolean
```

Whether every font of `typefaces` has been read: `areTypefacesLoaded` for the list an app keeps of what its first frame waits for, without spreading it into an array.

```kotlin
PantrixTypefaceGate(loaded = areTypefacesLoaded(AppTypefaces.all)) { App() }
```

Parameters:

- `typefaces: List<PantrixTypeface>`

### isPantrixTypefaceLoaded

`import com.pantrixui.foundation.token.typography.isPantrixTypefaceLoaded`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun isPantrixTypefaceLoaded(): Boolean
```

Whether Pantrix's own typeface has been read, so that `rememberPantrixTypography` draws in it.

On Android, iOS and the desktop a font is read where it is asked for, and this is true from the first frame. A browser fetches the file: until it arrives every text is drawn in the fallback face the renderer carries, and is laid out again in the typeface when it comes, which a reader sees as the page's letters changing a moment after it opens. A web app that would rather not show that draws its screen once this is true, and what it likes until then:

```kotlin
if (isPantrixTypefaceLoaded()) App() else Splash()
```

Asking is what starts the read, and what lets the theme find the typeface at once afterwards: ask in the first composition, before the screen that is to wait. It stays false where the file cannot be read, so an app that waits on it waits for a while and no longer.

### PantrixTypefaceGate

`import com.pantrixui.foundation.token.typography.PantrixTypefaceGate`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixTypefaceGate(
    loaded: Boolean = isPantrixTypefaceLoaded(),
    timeoutMillis: Int = 3000,
    onShown: () -> Unit = {},
    content: @Composable () -> Unit
)
```

Draws `content` once the typeface it is to be drawn in has been read, and nothing until then.

It is for an app in a browser, and goes around all of it. Android, iOS and the desktop read a font where it is asked for, and there `content` is drawn in the first frame. A browser fetches the font and draws in a fallback face until it arrives: an app drawn in the meantime has its letters change, and every text laid out again, a moment after it opens. Here it is drawn once, in its own letters; while it waits the page shows what it showed before the app, its own loading mark.

A typeface that never comes, a missing file or no network, is waited for `timeoutMillis` and no longer: the app is then drawn in the fallback face, since an empty page is worse than the wrong letters. Once drawn, `content` stays: nothing that changes afterwards takes it away.

Parameters:

- `loaded: Boolean`: Whether the typeface has been read: Pantrix's own when nothing is given, and `areTypefacesLoaded(…)` for an app's. Asking is what starts the read.
- `timeoutMillis: Int`: The longest the typeface is waited for.
- `onShown: () -> Unit`: Called once, when the frame that holds `content` has been drawn: a page takes its loading mark away here, and has the app under it, not an empty page.
- `content: @Composable () -> Unit`: What waits for the typeface: the app.
