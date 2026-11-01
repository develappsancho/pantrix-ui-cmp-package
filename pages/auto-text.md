# Auto Text

Text that gets smaller to stay in view: an amount, a title, a name. It is as large as its style says while it fits its room; when it does not, it goes down to the largest size in which all of it is in view, and it grows back as it is shortened.

In everything else it is `PantrixText`: the theme's type scale, the colour of where it sits, the role it tells a screen reader.

- `PantrixAutoText` (`com.pantrixui.components.elements.autotext`, `com.pantrixui:components`): Text that shrinks to fit the width, the height and the lines it is given and grows back as it is shortened, on one line or several, down to a smallest size. Keywords: auto size, autosize, shrink to fit, fit text, responsive text, amount.

## Features

- **One line.** The text is one line unless told (`maxLines = 1`), and is fitted to the width it is given.
- **More than one line.** With a larger `maxLines` the text wraps first, and is set smaller when its lines run out. The lines of a text that is set smaller are as much closer: the line height follows the text's size.
- **Text that fits its box.** `maxLines = Int.MAX_VALUE` leaves the lines to the height: the text is fitted to the width and the height it is given, both at once.
- **The smallest size.** At `minFontSize` the text stops shrinking, and what does not fit is cut as `overflow` says. It is the theme's `footnote` size unless given; it is given in `sp`, or in `em` as a share of the style's size.
- **A room to fit.** The text has to be given a width: `fillMaxWidth()`, a `weight` or a size; and a height too, where it may take any number of lines. A text that is offered all the width it wants never shrinks.
- **Styled text.** There is a second `PantrixAutoText`, which takes an `AnnotatedString`. A span's size given in `em` shrinks with the text; one given in `sp` is kept as it is.
- **In the first frame.** The size is found while the text is laid out: the first frame already shows the text fitted.
- **Automation.** A text that is given a `tagKey` carries the tag `AutoText_<tagKey>`. A text without a key is not tagged.

## Usage

### A balance on one line

```kotlin
PantrixAutoText(
    text = balance,
    modifier = Modifier.fillMaxWidth(),
    style = PantrixTheme.typography.display,
    tagKey = "balance"
)
```

### A title on two lines at the most

```kotlin
PantrixAutoText(
    text = article.title,
    modifier = Modifier.fillMaxWidth(),
    style = PantrixTheme.typography.headline,
    minFontSize = PantrixTheme.typography.body.fontSize,
    maxLines = 2,
    role = TextRole.Heading(level = 2)
)
```

### As large as its box lets it be

```kotlin
PantrixAutoText(
    text = stringResource(Res.string.quote),
    modifier = Modifier.size(width = 240.dp, height = 120.dp),
    style = PantrixTheme.typography.title,
    maxLines = Int.MAX_VALUE
)
```

## Examples

### Text that fits its room

The same name three times, each with less room than the one before, in the `title` style. While it has room enough, the text is as large as its style says. When it has not, it goes down, on one line, to the largest size in which all of it is in view. If it still does not fit at its smallest size, the theme's `footnote` size, it stops shrinking, and what does not fit is cut with an ellipsis.

The text gets its room from `modifier`: here a width. The grey ground shows that room.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.foundation.theme.PantrixTheme

val name = "Selim Karaosmanoğlu"
val room = PantrixTheme.colors.neutral.container
PantrixAutoText(
    text = name,
    modifier = Modifier.width(320.dp).background(room),
    style = PantrixTheme.typography.title,
    tagKey = "name_wide"
)
PantrixAutoText(
    text = name,
    modifier = Modifier.width(160.dp).background(room),
    style = PantrixTheme.typography.title,
    tagKey = "name_narrow"
)
PantrixAutoText(
    text = name,
    modifier = Modifier.width(72.dp).background(room),
    style = PantrixTheme.typography.title,
    tagKey = "name_narrowest"
)
```

### A balance that shrinks on one line

A balance in the largest style. "Add digit" makes the amount longer: the amount is as large as its style says while it fits the line, and when it does not, it gets as small as it takes to stay on one line; "Delete digit" lets it grow back. The pale line under it is the same text without the shrinking, a `PantrixText`: it is cut when it does not fit.

The decimal part and the currency are half the amount's size. Their size is given in `em`: it is a share of the text around it, so it shrinks with the amount when the amount shrinks, and stays half of it on every platform.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.em
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var digits by rememberSaveable { mutableIntStateOf(4) }
val balance = buildAnnotatedString {
    append("1".padEnd(digits, '0').groupedInThousands())
    withStyle(SpanStyle(fontSize = 0.5.em)) { append(",00 TL") }
}
PantrixAutoText(
    text = balance,
    modifier = Modifier.fillMaxWidth(),
    style = PantrixTheme.typography.display,
    tagKey = "balance"
)
PantrixText(
    text = balance,
    style = PantrixTheme.typography.display,
    color = PantrixTheme.colors.textSecondary,
    maxLines = 1,
    tagKey = "balance_cut"
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Add digit",
        onClick = { digits++ },
        enabled = digits < 24,
        tagKey = "add_digit"
    )
    PantrixButton(
        text = "Delete digit",
        onClick = { digits-- },
        variant = ButtonVariant.Outline,
        enabled = digits > 1,
        tagKey = "remove_digit"
    )
}

private fun String.groupedInThousands(): String = reversed().chunked(3).joinToString(".").reversed()
```

### A heading on two lines at the most

A heading fitted to two lines at the most: `maxLines = 2`. The text first wraps onto two lines; when two lines are not enough it is set smaller, and its lines come as much closer. `minFontSize` is the theme's `body` size: the heading is never set smaller than that, and if it still does not fit there it is cut with an ellipsis.

It is a heading even when it shrinks: with `role = TextRole.Heading(level = 2)` a screen reader is told so. The column is 420dp wide at the most, and the heading fills it.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

Column(modifier = Modifier.widthIn(max = 420.dp)) {
    PantrixAutoText(
        text = "Your credit card statement is ready: pay by the twenty-eighth",
        modifier = Modifier.fillMaxWidth(),
        style = PantrixTheme.typography.headline,
        minFontSize = PantrixTheme.typography.body.fontSize,
        maxLines = 2,
        role = TextRole.Heading(level = 2),
        tagKey = "statement_title"
    )
}
```

### A paragraph that fits its box

A paragraph fitted to a box of a set height. `maxLines = Int.MAX_VALUE` leaves the lines to the box's height: the text is set in the largest size that fits the 96dp box in width and in height at once, and never larger than its style's size. Narrow the window: the text gets smaller as the box gets narrower.

The box's ground and its padding are in the text's own `modifier`; the text is fitted to the room the padding leaves.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixAutoText(
    text = "A design system exists so that the same decision is not made again on every screen: it is made once " +
        "and looks the same everywhere.",
    modifier = Modifier
        .fillMaxWidth()
        .height(96.dp)
        .background(PantrixTheme.colors.neutral.container)
        .padding(PantrixTheme.spacing.sm),
    style = PantrixTheme.typography.title,
    textAlign = TextAlign.Center,
    maxLines = Int.MAX_VALUE,
    tagKey = "quote"
)
```

### The smallest size

The same text three times, in the same 200dp room; only `minFontSize` differs. The text stops shrinking when it gets down to that size: the smaller the smallest size, the further the text can shrink and the more of it is in view.

The first one's smallest size is `16.sp`. The second is given none: it is the theme's `footnote` size. The third one's is `0.4.em`: `em` is a share of the style's own size, here four tenths of the `title` size.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.foundation.theme.PantrixTheme

val airport = "Sabiha Gökçen International Airport"
val room = Modifier.width(200.dp).background(PantrixTheme.colors.neutral.container)
PantrixAutoText(
    text = airport,
    modifier = room,
    style = PantrixTheme.typography.title,
    minFontSize = 16.sp,
    tagKey = "min_16sp"
)
PantrixAutoText(text = airport, modifier = room, style = PantrixTheme.typography.title, tagKey = "min_default")
PantrixAutoText(
    text = airport,
    modifier = room,
    style = PantrixTheme.typography.title,
    minFontSize = 0.4.em,
    tagKey = "min_em"
)
```

### In boxes side by side, on a fill

A number in each of two boxes side by side, in the `headline` style. The boxes share the width by `weight`, and each number is fitted to its own box: the short one stays as large as its style says, and the long one shrinks.

No colour is given. Like `PantrixText`, the text takes the content colour of where it sits: in the box filled with `primary` it is written in the colour that reads on that fill.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val spacing = PantrixTheme.spacing
Row(
    modifier = Modifier.widthIn(max = 360.dp),
    horizontalArrangement = Arrangement.spacedBy(spacing.md)
) {
    PantrixSurface(modifier = Modifier.weight(1f), color = colors.primary.color) {
        Column(modifier = Modifier.padding(spacing.md)) {
            PantrixText(text = "Revenue this month", style = PantrixTheme.typography.footnote)
            PantrixAutoText(
                text = "1.284.500,75 TL",
                modifier = Modifier.fillMaxWidth(),
                style = PantrixTheme.typography.headline,
                tagKey = "revenue"
            )
        }
    }
    PantrixSurface(modifier = Modifier.weight(1f), border = colors.divider) {
        Column(modifier = Modifier.padding(spacing.md)) {
            PantrixText(text = "Orders", style = PantrixTheme.typography.footnote)
            PantrixAutoText(
                text = "32",
                modifier = Modifier.fillMaxWidth(),
                style = PantrixTheme.typography.headline,
                tagKey = "orders"
            )
        }
    }
}
```

## API

### PantrixAutoText

`import com.pantrixui.components.elements.autotext.PantrixAutoText`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAutoText(
    text: String,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = 1,
    minLines: Int = 1,
    overflow: TextOverflow = TextOverflow.Ellipsis,
    softWrap: Boolean = true,
    role: TextRole = TextRole.Paragraph,
    selectable: Boolean = false,
    onTextLayout: ((TextLayoutResult) -> Unit)? = null,
    tagKey: String? = null
)
```

Text that gets smaller to stay in view: an amount, a title or a name that is read whole in the room it has.

The text is as large as its `style` says while it fits. A text too long for its room is set in a smaller size, the largest in which all of it is in view: no wider than the width it is given, no taller than the height, and on no more than `maxLines` lines. It is one line unless told. With more lines the text wraps first, and is set smaller when its lines run out. At `minFontSize` it stops shrinking, and what still does not fit is cut as `overflow` says.

It needs a room to fit: a width from its parent or its `modifier`, and a height too where it may take any number of lines. A text that is offered all the width there is has room for any line, and is never set smaller.

The lines of a text that is set smaller are as much closer: the style's line height follows the size. So do the sizes its spans give in em, and one given in sp is kept. In everything else it is `PantrixText`: the theme's type, the colour of where it sits, and what a screen reader is told of it. The size is found while the text is laid out, so the first frame shows it fitted, and so does every frame in which its room gets narrower, wider or lower. A room that only gets taller is followed a frame later.

Parameters:

- `text: String`: the text.
- `modifier: Modifier`: the text's modifier: `fillMaxWidth()`, a `weight` or a size gives it the room it is fitted to.
- `style: TextStyle`: the style of the text at its largest: a role of the theme's typography, and the base text unless given, `LocalPantrixTextStyle`, as a `PantrixText`'s is. A style whose size is not in sp has no smaller size to be set in, and its text is not shrunk.
- `minFontSize: TextUnit`: the smallest the text gets: a size in sp, or one in em, which is a share of the style's own. It is the theme's footnote size unless told. At the style's own size or above it the text never shrinks, and at zero it shrinks until it fits, as far as a 256th of the style's size.
- `color: Color`: the text's colour. Unset, it is the style's, or the content colour of where the text sits, or the primary text colour.
- `textAlign: TextAlign?`: how the lines are aligned in the text's width.
- `maxLines: Int`: the most lines the text takes: one unless told. `Int.MAX_VALUE` leaves the lines to the height the text is given.
- `minLines: Int`: the least lines the text is tall, at its largest size.
- `overflow: TextOverflow`: how a text that does not fit at its smallest size is cut.
- `softWrap: Boolean`: whether the text wraps where its width ends. A text that does not is fitted to its longest line.
- `role: TextRole`: what the text is, for a screen reader: prose, a heading, a label or decoration.
- `selectable: Boolean`: whether the user can select the text and copy it.
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: called with the text as it is laid out, in the size it is set in.
- `tagKey: String?`: the text's automation key: the text is `AutoText_<tagKey>`. Without one it has no tag.

### PantrixAutoText

`import com.pantrixui.components.elements.autotext.PantrixAutoText`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAutoText(
    text: AnnotatedString,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = 1,
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

`PantrixAutoText` for an `AnnotatedString`, with its spans and links, and `inlineContent` for the placeholders it names. A span's size in em follows the text's, and one in sp is kept as it is.

Parameters:

- `text: AnnotatedString`: the text, with its spans and links.
- `modifier: Modifier`: the text's modifier: `fillMaxWidth()`, a `weight` or a size gives it the room it is fitted to.
- `style: TextStyle`: the style of the text at its largest: a role of the theme's typography, and the base text unless given, `LocalPantrixTextStyle`, as a `PantrixText`'s is. A style whose size is not in sp has no smaller size to be set in, and its text is not shrunk.
- `minFontSize: TextUnit`: the smallest the text gets: a size in sp, or one in em, which is a share of the style's own. It is the theme's footnote size unless told. At the style's own size or above it the text never shrinks, and at zero it shrinks until it fits, as far as a 256th of the style's size.
- `color: Color`: the text's colour. Unset, it is the style's, or the content colour of where the text sits, or the primary text colour.
- `textAlign: TextAlign?`: how the lines are aligned in the text's width.
- `maxLines: Int`: the most lines the text takes: one unless told. `Int.MAX_VALUE` leaves the lines to the height the text is given.
- `minLines: Int`: the least lines the text is tall, at its largest size.
- `overflow: TextOverflow`: how a text that does not fit at its smallest size is cut.
- `softWrap: Boolean`: whether the text wraps where its width ends. A text that does not is fitted to its longest line.
- `role: TextRole`: what the text is, for a screen reader: prose, a heading, a label or decoration.
- `selectable: Boolean`: whether the user can select the text and copy it.
- `inlineContent: Map<String, InlineTextContent>`
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: called with the text as it is laid out, in the size it is set in.
- `tagKey: String?`: the text's automation key: the text is `AutoText_<tagKey>`. Without one it has no tag.

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
