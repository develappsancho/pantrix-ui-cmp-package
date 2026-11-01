# Text

A text in the theme's type scale: a paragraph, a heading, a label. `style` says how the text is set, and `role` what a screen reader hears it as: they are two things, and neither stands in for the other.

The text is set in the size its style says; what does not fit its room is cut. A text that has to get smaller to fit is `PantrixAutoText`.

- `PantrixText` (`com.pantrixui.components.elements.text`, `com.pantrixui:components`): Text in one of the theme's type roles, which a screen reader hears as prose, a heading, a label or not at all. Keywords: label, paragraph, heading, typography, caption, body text.

## Features

- **Type scale.** `style` takes one of the theme's nine styles: eight from `display` down to `caption`, largest to smallest, and the monospace `code`. A text given no style is set in the `label` style.
- **Role.** `role` says what the text is: prose (`Paragraph`, the default), a heading (`Heading`), a label (`Label`) or decoration (`Decorative`). A user who moves from heading to heading with a screen reader does not stop at a text that is set like a heading but not marked as one.
- **Colour.** In order: `color`, the style's own colour, the content colour of where the text stands, the theme's `textPrimary`. On the page, on a surface and on a card a text is drawn in `textPrimary`; on a fill it takes the colour that reads there by itself.
- **Lines and overflow.** `maxLines` says the most lines the text takes, and `minLines` the least. What does not fit is cut as `overflow` says: with an ellipsis by default.
- **Alignment.** `textAlign` aligns the lines within the text's own width.
- **Selectable text.** With `selectable` the user can select the text and copy it.
- **Styled text.** There is a second `PantrixText` that takes an `AnnotatedString`: parts of a sentence that are bold, coloured or of another size, links, and an icon placed inside the line with `inlineContent`.
- **Automation.** A text given a `tagKey` carries the tag `Text_<tagKey>`. A text given no key is not tagged.

## Usage

### Section heading

```kotlin
PantrixText(
    text = stringResource(Res.string.account),
    style = PantrixTheme.typography.headline,
    role = TextRole.Heading(level = 2)
)
```

### Muted supporting text

```kotlin
PantrixText(
    text = stringResource(Res.string.sync_hint),
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

## Examples

### A text given no style

The least there is to write: the text alone. Given no style, it is set in the theme's `label` style; given no colour, it is drawn in the theme's `textPrimary` colour. The second line is the same text with the `label` style given outright: the two are the same.

`label` is the style of a control's label. Giving a paragraph `body`, or a heading `title` or `headline`, is up to you: the third line is set in `body`.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixText(text = "Your order is on its way", tagKey = "no_style")
PantrixText(text = "Your order is on its way", style = PantrixTheme.typography.label)
PantrixText(text = "Your order is on its way", style = PantrixTheme.typography.body)
```

### Type scale

The theme's nine styles, largest to smallest: each line is set in its own style and says what that style is for. A style carries the type's size, its line height, its weight and its letter spacing together.

`code` is set in a monospace face. The styles' metrics are written on the "Typography" page, read from the theme.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val typography = PantrixTheme.typography
PantrixText(text = "display: the page's title", style = typography.display)
PantrixText(text = "headline: a section heading", style = typography.headline)
PantrixText(text = "title: the title of a card, a panel, a dialog", style = typography.title)
PantrixText(text = "callout: emphasised body text, the description of an empty screen", style = typography.callout)
PantrixText(text = "body: body text, a paragraph, a description", style = typography.body)
PantrixText(text = "label: a control's label, a text given no style", style = typography.label)
PantrixText(text = "footnote: supporting text, the description under a field", style = typography.footnote)
PantrixText(text = "caption: a small detail, a time, a counter", style = typography.caption)
PantrixText(text = "code: order_id = 8F2A-19C4", style = typography.code)
```

### Roles

`role` says what the text is; `style` says how it looks. `TextRole.Heading` reports the text to a screen reader as a heading: a user who moves from heading to heading with the screen reader stops at it. `level` is the heading's depth: 1 for the page's title, 2 for its sections. A text set large and bold but given no role is plain prose to a screen reader.

`Paragraph` and `Label` are read as they are. A `Decorative` text is hidden from the screen reader and its words are never read: it is for text that repeats what something else already says. Here the large "%72" is a picture of the sentence under it; the screen reader reads only the sentence.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

val typography = PantrixTheme.typography
PantrixText(
    text = "Account",
    style = typography.headline,
    role = TextRole.Heading(level = 1),
    tagKey = "heading_account"
)
PantrixText(
    text = "Storage",
    style = typography.title,
    role = TextRole.Heading(level = 2),
    tagKey = "heading_storage"
)
PantrixText(text = "%72", style = typography.display, role = TextRole.Decorative, tagKey = "share")
PantrixText(text = "72 per cent of the storage is full.", style = typography.body)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(text = "Plan", role = TextRole.Label)
    PantrixText(text = "Monthly, 50 GB", color = PantrixTheme.colors.textSecondary)
}
```

### Colour, and the colour of where it stands

On the page, a text given no colour is drawn in the theme's `textPrimary` colour. `color` changes that: `textSecondary` for a secondary detail, the `danger` role's colour for an error.

On a fill, still no colour is given. When a `PantrixSurface` is filled with a role's colour, the text inside takes the colour that reads on that fill by itself: `primary.onColor` in the first box, `success.onContainer` in the second. The theme's own surface is not a fill but a ground: the text in the third box is drawn in `textPrimary` again.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val inside = Modifier.padding(PantrixTheme.spacing.md)
PantrixText(text = "No colour given")
PantrixText(text = "Last updated: 2 minutes ago", color = colors.textSecondary)
PantrixText(text = "Invalid card number", color = colors.danger.color, tagKey = "error")
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixSurface(color = colors.primary.color) {
        PantrixText(text = "On the primary fill", modifier = inside)
    }
    PantrixSurface(color = colors.success.container) {
        PantrixText(text = "On the success.container fill", modifier = inside)
    }
    PantrixSurface(border = colors.divider) {
        PantrixText(text = "On the theme's surface", modifier = inside)
    }
}
```

### Maximum lines and overflow

The same paragraph three times, in a column at most 320dp wide. The first takes as many lines as it wants. The second stays at two lines with `maxLines = 2`, and what does not fit ends in an ellipsis: the default of `overflow` is `TextOverflow.Ellipsis`. The third is one line and, with `TextOverflow.Clip`, is cut without an ellipsis.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val paragraph = "Your order has been shipped. It will reach the delivery address tomorrow between 09:00 and 18:00; the courier " +
    "will call you before coming to the door."
Column(
    modifier = Modifier.widthIn(max = 320.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixText(text = paragraph, style = PantrixTheme.typography.body)
    PantrixText(text = paragraph, style = PantrixTheme.typography.body, maxLines = 2, tagKey = "two_lines")
    PantrixText(
        text = paragraph,
        style = PantrixTheme.typography.body,
        maxLines = 1,
        overflow = TextOverflow.Clip,
        tagKey = "clipped"
    )
}
```

### Minimum lines

`minLines` makes even a short text take the room of that many lines. The titles of the two boxes that stand side by side are set with `minLines = 2` and `maxLines = 2`: one fits on one line and the other is longer than two, but both take two lines of room. So the prices under them line up, and the boxes are the same height.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val spacing = PantrixTheme.spacing
Row(
    modifier = Modifier.widthIn(max = 420.dp),
    horizontalArrangement = Arrangement.spacedBy(spacing.md)
) {
    PantrixSurface(modifier = Modifier.weight(1f), border = colors.divider) {
        Column(modifier = Modifier.padding(spacing.md), verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(text = "Tea", style = PantrixTheme.typography.callout, maxLines = 2, minLines = 2)
            PantrixText(text = "45,00 TL", color = colors.textSecondary)
        }
    }
    PantrixSurface(modifier = Modifier.weight(1f), border = colors.divider) {
        Column(modifier = Modifier.padding(spacing.md), verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = "Cold-brewed filter coffee with cinnamon and orange",
                style = PantrixTheme.typography.callout,
                maxLines = 2,
                minLines = 2
            )
            PantrixText(text = "120,00 TL", color = colors.textSecondary)
        }
    }
}
```

### Alignment

`textAlign` aligns the lines within the text's own width. That is why the texts are given `fillMaxWidth()`: a text only as wide as its words has no room to align them in.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import com.pantrixui.components.elements.text.PantrixText

PantrixText(text = "Aligned to the start", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Start)
PantrixText(text = "Centred", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
PantrixText(text = "Aligned to the end", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.End)
```

### Selectable text

With `selectable = true` the user can select the text and copy it. It is for text that will be taken somewhere else: an order number, an IBAN, an error code. A screen reader reads it as it reads any other text.

Try to select the number on the second line; the label above it cannot be selected.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

PantrixText(text = "Order number", style = PantrixTheme.typography.footnote, role = TextRole.Label)
PantrixText(
    text = "PX-2026-0001-8F2A-19C4",
    style = PantrixTheme.typography.code,
    selectable = true,
    tagKey = "order_number"
)
```

### Styled text

The `PantrixText` that takes an `AnnotatedString`: parts styled differently inside one text. Its style, its colour, its lines and its role are the same as a plain text's.

In the first line the decimal part of the amount is set at `0.6.em`: an `em` is a share of the size of the text around it. In the second line one part is bold, and one is in the `danger` role's colour. The third line has a link; it is underlined, because someone who cannot tell colours apart cannot see a link that differs from its sentence by colour alone. Press the link: the app's snackbar reports it.

```kotlin
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextLinkStyles
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withLink
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.em
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val colors = PantrixTheme.colors
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val price = buildAnnotatedString {
    append("1.250")
    withStyle(SpanStyle(fontSize = 0.6.em)) { append(",00 TL") }
}
val notice = buildAnnotatedString {
    append("On ")
    withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append("28 October") }
    append(" your payment will be taken. ")
    withStyle(SpanStyle(color = colors.danger.color)) { append("Your card is about to expire.") }
}
val linkStyles = TextLinkStyles(
    style = SpanStyle(color = colors.primary.color, textDecoration = TextDecoration.Underline)
)
val terms = buildAnnotatedString {
    append("By continuing you agree that the ")
    withLink(
        LinkAnnotation.Clickable(tag = "terms", styles = linkStyles) {
            scope.launch { snackbars?.show(message = "Terms of use opened") }
        }
    ) {
        append("terms of use")
    }
    append(" apply.")
}
PantrixText(text = price, style = PantrixTheme.typography.headline, tagKey = "price")
PantrixText(text = notice, style = PantrixTheme.typography.body)
PantrixText(text = terms, style = PantrixTheme.typography.body, tagKey = "terms")
```

### An icon inside the line

`inlineContent` puts something that is not text inside the line. A place is kept in the text with `appendInlineContent`; `inlineContent` says, for that place's key, what is drawn there and how much room it takes. Here there is an icon in the middle of the sentence: it stands on the same line as the words.

The second value of `appendInlineContent` is what stands for that place in the text: a screen reader reads the icon by this word.

```kotlin
import androidx.compose.foundation.text.InlineTextContent
import androidx.compose.foundation.text.appendInlineContent
import androidx.compose.ui.text.Placeholder
import androidx.compose.ui.text.PlaceholderVerticalAlign
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val hint = buildAnnotatedString {
    append("To find a product, press the ")
    appendInlineContent(id = "search", alternateText = "search")
    append(" button.")
}
PantrixText(
    text = hint,
    style = PantrixTheme.typography.body,
    inlineContent = mapOf(
        "search" to InlineTextContent(
            placeholder = Placeholder(
                width = 1.25.em,
                height = 1.25.em,
                placeholderVerticalAlign = PlaceholderVerticalAlign.TextCenter
            )
        ) {
            PantrixIcon(imageVector = PantrixIcons.Search, contentDescription = null, size = 20.dp)
        }
    ),
    tagKey = "hint"
)
```

## API

### PantrixText

`import com.pantrixui.components.elements.text.PantrixText`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixText(
    text: String,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = Int.MAX_VALUE,
    minLines: Int = 1,
    overflow: TextOverflow = TextOverflow.Ellipsis,
    softWrap: Boolean = true,
    role: TextRole = TextRole.Paragraph,
    selectable: Boolean = false,
    onTextLayout: ((TextLayoutResult) -> Unit)? = null,
    tagKey: String? = null
)
```

Text in the theme's type. `style` is the base text unless given, `LocalPantrixTextStyle`: the label role, or what a part of the screen around it provides. `role` tells a screen reader what the text is: a heading, a label, decoration. `selectable` lets the user select and copy it.

The colour is `color`, or else the style's, or else the theme's `textPrimary`: on the theme's own grounds, the page, a surface and a card, a text is drawn in the primary text colour. Only a fill says otherwise: on a solid button, a card filled with a role's colour or anything else that gives its content a colour, a text takes that colour, which is the one that reads there.

The text is set in the size its style says, and what does not fit is cut as `overflow` says. A text that is to get smaller to fit its room is `PantrixAutoText`.

Parameters:

- `text: String`: the text.
- `modifier: Modifier`: the text's modifier.
- `style: TextStyle`
- `color: Color`
- `textAlign: TextAlign?`: how the lines are aligned in the text's width.
- `maxLines: Int`: the most lines the text takes; what goes past them is cut as `overflow` says.
- `minLines: Int`: the least lines the text is tall.
- `overflow: TextOverflow`
- `softWrap: Boolean`: whether the text wraps where its width ends.
- `role: TextRole`
- `selectable: Boolean`
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: called with the text as it is laid out.
- `tagKey: String?`: the text's automation key: the text is `Text_<tagKey>`. Without one it has no tag.

### PantrixText

`import com.pantrixui.components.elements.text.PantrixText`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixText(
    text: AnnotatedString,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = Int.MAX_VALUE,
    minLines: Int = 1,
    overflow: TextOverflow = TextOverflow.Ellipsis,
    softWrap: Boolean = true,
    role: TextRole = TextRole.Paragraph,
    selectable: Boolean = false,
    inlineContent: Map<String, InlineTextContent> = emptyMap(),
    onTextLayout: ((TextLayoutResult) -> Unit)? = null,
    tagKey: String? = null
)
```

`PantrixText` for an `AnnotatedString`, with its spans and links, and `inlineContent` for the placeholders it names.

Parameters:

- `text: AnnotatedString`: the text, with its spans and links.
- `modifier: Modifier`: the text's modifier.
- `style: TextStyle`: the base text: `LocalPantrixTextStyle` unless given, the label role or what a part of the screen around it provides.
- `color: Color`: the text's colour, or else the style's, or else the theme's `textPrimary`; on a fill, the colour written there.
- `textAlign: TextAlign?`: how the lines are aligned in the text's width.
- `maxLines: Int`: the most lines the text takes; what goes past them is cut as `overflow` says.
- `minLines: Int`: the least lines the text is tall.
- `overflow: TextOverflow`: how a text longer than `maxLines` is cut: with an ellipsis unless told.
- `softWrap: Boolean`: whether the text wraps where its width ends.
- `role: TextRole`: what the text is, for a screen reader: prose, a heading, a label or decoration.
- `selectable: Boolean`: whether the user can select the text and copy it.
- `inlineContent: Map<String, InlineTextContent>`
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: called with the text as it is laid out.
- `tagKey: String?`: the text's automation key: the text is `Text_<tagKey>`. Without one it has no tag.

### TextRole

`import com.pantrixui.components.elements.text.TextRole`, from `com.pantrixui:components`

```kotlin
sealed interface TextRole
```

What a piece of text *is*, which decides how a screen reader treats it.

A visual style is not a substitute: text styled like a heading but not marked as one is invisible to the heading-navigation every screen reader user relies on to skim a page.

#### TextRole.Paragraph

```kotlin
data object Paragraph : TextRole
```

Ordinary prose.

#### TextRole.Heading

```kotlin
data class Heading(val level: Int) : TextRole
```

A heading at `level` (1 = page title). Enables heading navigation.

Parameters:

- `level: Int`: The heading's depth: 1 for the page's title, 2 for its sections, and so on down.

#### TextRole.Label

```kotlin
data object Label : TextRole
```

Names a control or a value.

#### TextRole.Decorative

```kotlin
data object Decorative : TextRole
```

Purely visual — hidden from assistive technology.

For text already announced by something else: the letter inside an avatar whose content description is the person's full name. Its words are left out of the semantics tree, so a parent heard as one does not read them with its own: a test finds it by its tag.

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
