# Tag

A short label on a piece of data: a status, a category, a version. A tag is read, not pressed: something that is pressed, removed or chosen is a chip, and a count or a dot on another element is a badge.

- `PantrixTag` (`com.pantrixui.components.data.tag`, `com.pantrixui:components`): A short label on a piece of data, a status, a category or a version, in a role's colour: read, never pressed. Keywords: label, status, pill, lozenge, category, version.

## Features

- **Six tones.** `tone` draws the tag in one of the theme's roles: `Primary`, `Info`, `Success`, `Warning`, `Danger` and the default `Neutral`. When the brand's colour changes, every tag changes with it.
- **Three variants.** `Soft` is the role's pale fill and the default; `Solid` is the role's full colour, for the state a row is about; `Outline` has no fill, and its edge and its words are in the role's full colour. The theme picks that colour to read on its grounds in both of its modes.
- **Icon and dot.** `icon` stands before the words, in their colour. `dot` puts a small disc in the role's full colour before the words: the state a row is in. Where an icon is given, no dot is drawn.
- **Words, not colour.** The words carry the meaning: a red "Overdue" says the same to someone who cannot see red. A screen reader hears the tag as one thing, its words; `contentDescription` takes their place.
- **Not pressed.** A tag takes no focus, has no touch target and is lower than a chip on every platform: it stands inside a row without taking it over.
- **Type.** The words are one line, set in the theme's `footnote` unless `textStyle` is given, and are cut with "…" where the room ends. A larger type makes the tag taller; their colour is always the tag's.
- **On a fill.** `Soft` and `Solid` bring their own grounds and are drawn in their role's colours everywhere. On a fill that is not the theme's ground, an `Outline`'s edge and words are in what is written there.
- **Colours of its own.** `colors` takes the place of the tone's colours: those given are used, the rest stay the tone's. A role's fill given brings the colour the theme pairs with it.
- **Platform.** 24dp tall on Android, 22 on iOS, on desktop and on the web. On iOS its ends are round, as iOS's own labels are; on the other platforms its corners are only a little round, which tells it from a chip.

## Usage

### The state of a row

```kotlin
PantrixTag(text = stringResource(Res.string.overdue), tone = TagTone.Danger, dot = true, tagKey = "state")
```

### Topics beside a title

```kotlin
FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
    PantrixText(text = article.title)
    article.topics.forEach { PantrixTag(text = it.name, variant = TagVariant.Outline) }
}
```

## Examples

### Tones and variants

One variant to a row, six tones in each: `Soft`, `Solid` and `Outline`. Each tag's words say what its tone means; the colour only backs them up.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    TagVariant.entries.forEach { variant ->
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            TONE_WORDS.forEach { (tone, words) ->
                PantrixTag(text = words, tone = tone, variant = variant, tagKey = "${variant.name}_${tone.name}")
            }
        }
    }
}

private val TONE_WORDS = listOf(
    TagTone.Primary to "Featured",
    TagTone.Info to "Info",
    TagTone.Success to "Paid",
    TagTone.Warning to "Expiring",
    TagTone.Danger to "Overdue",
    TagTone.Neutral to "Draft"
)
```

### Icon and dot

The icon stands before the words, in their colour, and says nothing to a screen reader. The dot is in the role's full colour and tells a state: online, outage, offline. Where both are given, the icon is drawn.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixTag(text = "Verified", tone = TagTone.Success, icon = PantrixIcons.Check)
        PantrixTag(text = "Beta", tone = TagTone.Info, icon = PantrixIcons.Info)
        PantrixTag(text = "Low stock", tone = TagTone.Warning, icon = PantrixIcons.Warning)
        PantrixTag(text = "Featured", tone = TagTone.Primary, variant = TagVariant.Solid, icon = PantrixIcons.Star)
    }
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixTag(text = "Online", tone = TagTone.Success, dot = true, tagKey = "online")
        PantrixTag(text = "Outage", tone = TagTone.Danger, variant = TagVariant.Solid, dot = true)
        PantrixTag(text = "Offline", dot = true)
        PantrixTag(text = "Active", tone = TagTone.Success, variant = TagVariant.Outline, dot = true)
    }
}
```

### The state of a row

A tag's own place is at the end of a row: an invoice's state. The row does not shrink to the tag; the tag stands inside it without taking it over, and is not pressed. Where a press on the row does something, the row does it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    INVOICES.forEach { invoice ->
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(text = invoice.number, modifier = Modifier.weight(1f), maxLines = 1)
            PantrixText(text = invoice.amount, color = PantrixTheme.colors.textSecondary, maxLines = 1)
            PantrixTag(
                text = invoice.state.words,
                tone = invoice.state.tone,
                dot = true,
                tagKey = "state_${invoice.key}"
            )
        }
    }
}

private val INVOICES = listOf(
    Invoice("1042", "Invoice #1042", "1 240 ₺", InvoiceState.Paid),
    Invoice("1043", "Invoice #1043", "860 ₺", InvoiceState.Due),
    Invoice("1044", "Invoice #1044", "3 125 ₺", InvoiceState.Overdue),
    Invoice("1045", "Invoice #1045", "410 ₺", InvoiceState.Draft)
)

private enum class InvoiceState(val words: String, val tone: TagTone) {
    Paid("Paid", TagTone.Success),
    Due("Due soon", TagTone.Warning),
    Overdue("Overdue", TagTone.Danger),
    Draft("Draft", TagTone.Neutral)
}

private class Invoice(val key: String, val number: String, val amount: String, val state: InvoiceState)
```

### Beside a title

An article's topics, beside its title: tags with no fill, which do not shout on a page in colour. The tags that do not fit go to the next line; `FlowRow` does that, not the tag. The last tag has little room, and its words are cut with "…".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        itemVerticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = "Theming in Compose Multiplatform", style = PantrixTheme.typography.title)
        TOPICS.forEach { topic -> PantrixTag(text = topic, variant = TagVariant.Outline) }
    }
    PantrixTag(
        text = "Three changes are waiting for review",
        modifier = Modifier.widthIn(max = NARROW_WIDTH.dp),
        tone = TagTone.Warning,
        tagKey = "narrow"
    )
}

private val TOPICS = listOf("Kotlin", "Design", "Accessibility")

private const val NARROW_WIDTH = 160
```

### On a fill

On a fill that is not the theme's ground, here the primary role's full colour: `Soft` and `Solid` bring their own grounds and are drawn in their role's colours. The `Outline`, with no fill, is written in what is written there, white here: the role's own colour may not read on that fill.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(color = PantrixTheme.colors.primary.color) {
    FlowRow(
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixTag(text = "New", tone = TagTone.Success)
        PantrixTag(text = "Limited", tone = TagTone.Warning, variant = TagVariant.Solid)
        PantrixTag(text = "Version 2.4", variant = TagVariant.Outline, tagKey = "outline_on_fill")
        PantrixTag(text = "Live", variant = TagVariant.Outline, dot = true)
    }
}
```

### Colours of its own and a description of its own

`colors` gives a colour none of the theme's roles has: here the app's own violet. The colours not given stay the tone's. The last tag has a `contentDescription`: a screen reader says "Payment status: overdue" in place of "Overdue".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagColors
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixTag(
        text = "Campaign",
        colors = TagColors(container = own.container, content = own.onContainer, dot = own.color),
        dot = true,
        tagKey = "own"
    )
    PantrixTag(
        text = "Campaign",
        variant = TagVariant.Outline,
        colors = TagColors(content = own.onContainer, border = own.color)
    )
    PantrixTag(
        text = "Overdue",
        tone = TagTone.Danger,
        contentDescription = "Payment status: overdue",
        tagKey = "described"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### In its own style

In its own style: `TagStyle` gives a tag's height, its padding, its corners and its dot. Here the tags are pill-shaped, 32dp high, with a 10dp dot; every field not given is the platform's preset. `textStyle` gives the type of the words: here the theme's `label`, in bold.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagStyle
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val style = TagStyle(shape = ShapeRole.Full, height = 32.dp, horizontalPadding = 14.dp, dotSize = 10.dp)
val words = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold)
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixTag(
        text = "Online",
        tone = TagTone.Success,
        dot = true,
        style = style,
        tagKey = "online_pill",
        textStyle = words
    )
    PantrixTag(
        text = "Under maintenance",
        tone = TagTone.Warning,
        dot = true,
        style = style,
        tagKey = "maintenance_pill",
        textStyle = words
    )
}
```

## API

### PantrixTag

`import com.pantrixui.components.data.tag.PantrixTag`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTag(
    text: String,
    modifier: Modifier = Modifier,
    tone: TagTone = TagTone.Neutral,
    variant: TagVariant = TagVariant.Soft,
    icon: ImageVector? = null,
    dot: Boolean = false,
    contentDescription: String? = null,
    style: TagStyle? = null,
    colors: TagColors? = null,
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.footnote
)
```

A short label on a piece of data: a status, a category, a version.

A tag is read, not pressed. Something that is pressed, removed or chosen is a chip, and a count or a dot on another element is a badge. Since nothing presses it, a tag takes no focus, has no touch target and is lower than a chip on every platform: it stands inside a row without taking it over.

The words carry the meaning, not the colour: "Overdue" in the danger tone says the same to someone who cannot see that it is red. A tag whose words are a colour's name has nothing to say.

The words are one line, set in `textStyle`, the theme's footnote type unless given, and are cut where the room ends. A larger type makes the tag taller. An `icon` or a `dot` stands before them, at the start of the line, which is the right in a right-to-left layout. A screen reader hears the tag as one thing, its words, or `contentDescription` in their place.

```kotlin
PantrixTag(text = stringResource(Res.string.overdue), tone = TagTone.Danger, dot = true, tagKey = "state")
```

Parameters:

- `text: String`: what the tag says: a word or two.
- `modifier: Modifier`: the tag's modifier.
- `tone: TagTone`: the colour role the tag is drawn in.
- `variant: TagVariant`: how much of the role the tag wears.
- `icon: ImageVector?`: drawn before the words, in their colour. It says nothing to a screen reader.
- `dot: Boolean`: whether a small disc in the role's full colour stands before the words, where there is no `icon`: a status a row is in.
- `contentDescription: String?`: what a screen reader says for the tag in place of its words, or null for the words.
- `style: TagStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: TagColors?`: this tag's own colours, in place of its tone's: the ones it sets, with the tone's for the rest.
- `tagKey: String?`: the tag's automation key: it is `Tag_<tagKey>`, and is tagged only when given one.
- `textStyle: TextStyle`: the type the words are set in: the theme's `footnote` unless given. Their colour is the tag's.

### TagTone

`import com.pantrixui.components.data.tag.TagTone`, from `com.pantrixui:components`

```kotlin
enum class TagTone
```

What a tag means: one of the theme's colour roles, so a brand changes every tag at once.

The tone chooses the role, and `TagVariant` how much of it the tag wears. A tone says nothing by itself: a screen reader hears the tag's words and not its colour, so what the colour means has to be in the words.

Entries:

- `Primary`: The brand's colour: the tag that matters most in a row of them.
- `Info`: Something worth knowing that is neither good nor bad: a type, a channel.
- `Success`: Something that worked or is well: paid, in stock, passing.
- `Warning`: Something to look at before it becomes a problem: expiring, low stock.
- `Danger`: Something that failed or cannot be undone: overdue, rejected.
- `Neutral`: A category with no judgement in it: a topic, a version. The default.

### TagVariant

`import com.pantrixui.components.data.tag.TagVariant`, from `com.pantrixui:components`

```kotlin
enum class TagVariant
```

How much of the page a tag takes: its weight, not its meaning.

Entries:

- `Soft`: The role's pale fill, written in the colour the theme pairs with it. The default: read without shouting.
- `Solid`: The role's full colour, written in its pair: for the one state a row is about.
- `Outline`: No fill, and an edge and the words in the role's full colour: for a page that has colour in it already. On a fill that is not the theme's ground, the edge and the words are what is written there.

### TagStyle

`import com.pantrixui.components.data.tag.TagStyle`, from `com.pantrixui:components`

```kotlin
class TagStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val dotSize: Dp = Dp.Unspecified
) : PantrixStyle<TagStyle>
```

`PantrixTag`'s geometry: a label small enough to stand inside a row without taking it over.

A tag is lower than a chip on every platform, as a chip is pressed and a tag is read: 24dp on Android and 22 on iOS, on desktop and on the web. Its corners part it from a chip too, except on iOS, whose own labels are round at the ends as its chips are.

The height and the room around the words follow the density. The icon, the dot, the edge and the corners do not.

Parameters:

- `shape: ShapeSpec`: The tag's corners: a step of the brand's shape scale, or a fixed shape.
- `height: Dp`: The least height of a tag. A larger type makes it taller.
- `horizontalPadding: Dp`: The room between the tag's sides and what it holds.
- `iconPadding: Dp`: Between the icon or the dot and the words.
- `iconSize: Dp`: The width and height of the icon.
- `borderWidth: Dp`: The width of the edge of `TagVariant.Outline`, and of an edge given in `TagColors`.
- `dotSize: Dp`: The width and height of the dot.

### TagColors

`import com.pantrixui.components.data.tag.TagColors`, from `com.pantrixui:components`

```kotlin
data class TagColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val dot: Color = Color.Unspecified
)
```

What a `PantrixTag` is painted with, in place of its tone's colours: a colour that is set is used, and one that is left out stays the tone's.

```kotlin
// A campaign's own colours, which no role of the theme has.
PantrixTag(text = campaign.name, colors = TagColors(container = campaign.color, content = campaign.onColor))
```

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for the words, the icon and the dot, unless those are given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The tag's fill. The role's `container` in `TagVariant.Soft`, its `color` in `TagVariant.Solid`, and none in `TagVariant.Outline`.
- `content: Color`: The words and the icon: the colour that reads on `container`. The role's `onContainer` in `TagVariant.Soft`, its `onColor` in `TagVariant.Solid`, and its `color` in `TagVariant.Outline`, which reads on the theme's grounds. An outlined tag on a fill that is not the theme's ground is written in what is written there.
- `border: Color`: The tag's edge: that of `TagVariant.Outline`, in `content`. A tag of another variant has one where it is given here.
- `dot: Color`: The dot: the role's `color`, and on the role's full colour its `onColor`. On a fill that is not the theme's ground, an outlined tag's dot is in `content`.
