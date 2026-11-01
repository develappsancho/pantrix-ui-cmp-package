# Divider

A thin line that separates content: between the rows of a list, the sections of a card, the groups of a toolbar. It is drawn horizontal or vertical; a horizontal one can carry a label, like the "or" between two ways in on a sign-in screen.

It is three composables: `PantrixHorizontalDivider`, `PantrixVerticalDivider`, and `PantrixDivider`, which takes its orientation in `orientation`.

- `PantrixDivider` (`com.pantrixui.components.elements.divider`, `com.pantrixui:components`): A line that separates content, across its container or down it; decorative, unless a horizontal one carries a label for a screen reader to read. Keywords: separator, line, rule, horizontal rule, hr, vertical divider.

## Features

- **Horizontal and vertical.** A horizontal line is as wide as its container, a vertical one as tall.
- **Label.** `label` puts a text on a horizontal line. `align` says where the text sits: at the start, in the centre or at the end. At the start or the end, a short stretch of line stays on the label's side.
- **Thickness.** `thickness` is how thick the line is; its default is 1dp.
- **Indent.** `startIndent` leaves a gap before a horizontal line and above a vertical one. It is not used on a labelled line.
- **The colour of where it stands.** A line that is given no colour is the theme's `divider` on the theme's own grounds. On a fill, where that colour would not read, it is a share of the colour that is written there: on a role's surface, in a filled card, between the rows of a menu that has a colour of its own.
- **Its own colour.** `color` draws the line in the colour it is given. It does not change the label's colour: the label is `textSecondary` on the theme's grounds, and the colour that is written there on a fill.
- **Screen reader.** A line without a label is decorative and hidden from screen readers. A labelled line's label is read.
- **Right to left.** `DividerAlign.Start` and a horizontal line's `startIndent` go by the side a line starts on: in a right-to-left interface that is the right.

## Usage

### Between rows

```kotlin
Column {
    PantrixText(stringResource(Res.string.profile))
    PantrixDivider()
    PantrixText(stringResource(Res.string.security))
}
```

### A label between two ways in

```kotlin
PantrixDivider(label = stringResource(Res.string.or))
```

### Vertical, between toolbar groups

```kotlin
PantrixVerticalDivider(modifier = Modifier.height(PantrixTheme.spacing.xl))
```

## Examples

### Between rows

At its plainest: a `PantrixDivider` with no parameters. It is horizontal, as wide as its container, 1dp thick and in the theme's `divider` colour. It is decorative: a screen reader reads only the rows.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixText(text = "Profile")
    PantrixDivider()
    PantrixText(text = "Security")
    PantrixDivider()
    PantrixText(text = "Notifications")
}
```

### Labelled

`label` puts a text on the line: the line runs on both sides of the text. On a sign-in screen, the "or" between two ways in is written like this.

The label is in the theme's `label` style and its secondary text colour. A labelled line is not decorative: a screen reader reads the label.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.foundation.theme.PantrixTheme

Column(
    modifier = Modifier.widthIn(max = 360.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixButton(text = "Sign in with email", onClick = {}, fullWidth = true, tagKey = "email")
    PantrixHorizontalDivider(label = "or")
    PantrixButton(text = "Sign in with phone", onClick = {}, variant = ButtonVariant.Outline, fullWidth = true, tagKey = "phone")
}
```

### Where the label sits

`align` says where along the line the label sits; its default is `Center`. `Start` and `End` move the label to one side, but not right up to the edge: a short stretch of line stays on that side.

```kotlin
import com.pantrixui.components.elements.divider.DividerAlign
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider

PantrixHorizontalDivider(label = "Start", align = DividerAlign.Start)
PantrixHorizontalDivider(label = "Centre", align = DividerAlign.Center)
PantrixHorizontalDivider(label = "End", align = DividerAlign.End)
```

### Thickness

`thickness` is how thick the line is: 1dp (the default, `DefaultThickness`), twice that and four times that, in that order. On a labelled line the lines on both sides of the text are that thick too.

```kotlin
import com.pantrixui.components.elements.divider.DefaultThickness
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider

PantrixHorizontalDivider(thickness = DefaultThickness)
PantrixHorizontalDivider(thickness = DefaultThickness * 2)
PantrixHorizontalDivider(thickness = DefaultThickness * 4)
PantrixHorizontalDivider(label = "Labelled", thickness = DefaultThickness * 2)
```

### Indent

`startIndent` leaves a gap before the line: the line starts level with the text, not under the icon. Here the icon is 24dp and the gap to the text 16dp; the indent is the sum of the two, 40dp.

The line at the end of the list has no indent (`DefaultStartIndent`, 0dp): the list ends there.

`startIndent` is not used on a labelled line. On a vertical line the gap is above the line.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.DefaultStartIndent
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    DividerListRow(icon = PantrixIcons.Inbox, text = "Inbox")
    PantrixHorizontalDivider(startIndent = 40.dp)
    DividerListRow(icon = PantrixIcons.Star, text = "Starred")
    PantrixHorizontalDivider(startIndent = 40.dp)
    DividerListRow(icon = PantrixIcons.Folder, text = "Archive")
    PantrixHorizontalDivider(startIndent = DefaultStartIndent)
}

@Composable
private fun DividerListRow(
    icon: ImageVector,
    text: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = icon, contentDescription = null, size = 24.dp)
        PantrixText(text = text)
    }
}
```

### Vertical

`PantrixVerticalDivider` is as tall as its container, so it is put where the height is known. In the top row the row gives the height: `Modifier.height(IntrinsicSize.Min)` brings the row down to the height of the text in it, and the line is as tall. In the bottom row the height was given to the line itself: `PantrixTheme.spacing.xl`, 24dp at the default density.

A vertical line carries no label and is hidden from screen readers.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    modifier = Modifier.height(IntrinsicSize.Min),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixText(text = "12 posts")
    PantrixVerticalDivider()
    PantrixText(text = "340 followers")
    PantrixVerticalDivider()
    PantrixText(text = "28 following")
}
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButton(text = "Bold", onClick = {}, variant = ButtonVariant.Text, size = ButtonSize.Small, tagKey = "bold")
    PantrixButton(text = "Italic", onClick = {}, variant = ButtonVariant.Text, size = ButtonSize.Small, tagKey = "italic")
    PantrixVerticalDivider(modifier = Modifier.height(PantrixTheme.spacing.xl))
    PantrixButton(text = "Link", onClick = {}, variant = ButtonVariant.Text, size = ButtonSize.Small, tagKey = "link")
}
```

### Its orientation as a parameter

`PantrixDivider` takes its orientation as a value: `DividerOrientation.Horizontal` draws a `PantrixHorizontalDivider`, `DividerOrientation.Vertical` a `PantrixVerticalDivider`. Where the orientation depends on a condition, one call covers both.

Here the lines inside the two columns are horizontal, and the one between the columns is vertical. `label` and `align` apply to a horizontal line only.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.divider.DividerOrientation
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    modifier = Modifier.height(IntrinsicSize.Min),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    Column(
        modifier = Modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixText(text = "Delivery address")
        PantrixDivider(orientation = DividerOrientation.Horizontal)
        PantrixText(text = "Atatürk Cad. No: 12, İzmir", color = PantrixTheme.colors.textSecondary)
    }
    PantrixDivider(orientation = DividerOrientation.Vertical)
    Column(
        modifier = Modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixText(text = "Billing address")
        PantrixDivider(orientation = DividerOrientation.Horizontal)
        PantrixText(text = "Same as delivery address", color = PantrixTheme.colors.textSecondary)
    }
}
```

### In its own colour

`color` draws the line in the colour it is given: the top one in the app's own purple, which is in none of the theme's roles; the bottom one in the theme's `danger` role.

`color` paints the line alone. The label of the bottom line is still in the theme's secondary text colour.

```kotlin
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.foundation.theme.PantrixTheme

PantrixHorizontalDivider(color = ownColors().color, thickness = 2.dp)
PantrixHorizontalDivider(color = PantrixTheme.colors.danger.color, label = "Actions that cannot be undone")
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### On a fill

No line here was given a colour. The theme's `divider` colour is for the theme's own grounds; on a fill the line is a share of the colour that is written there (thirty per cent of it), and the label is that colour itself.

The surface at the top is in the theme's `primary` colour: the line comes from the role's `onColor`. The one below is a filled card (`CardVariant.Filled`): the line comes from the card's content colour.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.color) {
    Column(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = "Monthly plan")
        PantrixHorizontalDivider()
        PantrixText(text = "Yearly plan")
        PantrixHorizontalDivider(label = "or")
        PantrixText(text = "Lifetime")
    }
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixText(text = "Order summary")
    PantrixHorizontalDivider()
    PantrixText(text = "Total: 240 TL")
}
```

### Right to left

`DividerAlign.Start` and `startIndent` go by the side a line starts on, not by the left. This example turns the reading direction to right-to-left inside itself: the label sits on the right, and the second line's indent is on the right.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.DividerAlign
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.foundation.theme.PantrixTheme

CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
        PantrixHorizontalDivider(label = "Start", align = DividerAlign.Start)
        PantrixHorizontalDivider(startIndent = 56.dp)
    }
}
```

## API

### PantrixDivider

`import com.pantrixui.components.elements.divider.PantrixDivider`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDivider(
    modifier: Modifier = Modifier,
    orientation: DividerOrientation = DividerOrientation.Horizontal,
    color: Color = Color.Unspecified,
    label: String? = null,
    align: DividerAlign = DividerAlign.Center,
    thickness: Dp = DefaultThickness,
    startIndent: Dp = DefaultStartIndent
)
```

A line that separates content: a `PantrixHorizontalDivider` or a `PantrixVerticalDivider`, by `orientation`.

`label` and `align` apply to a horizontal divider only.

Given no `color`, the line is the theme's `divider` on the theme's own grounds. On a fill, where that line would not read, it is a share of the colour that is written there: a divider on a role's surface, in a filled card or between the rows of a menu in a colour of the caller's is told by what is around it, as a text is. A label is the theme's `textSecondary` on the theme's grounds, and the colour that is written there on a fill.

Parameters:

- `modifier: Modifier`: the divider's modifier: a horizontal one is as wide as it lets it be, and a vertical one as tall.
- `orientation: DividerOrientation`
- `color: Color`
- `label: String?`
- `align: DividerAlign`
- `thickness: Dp`: how thick the line is: 1dp unless told.
- `startIndent: Dp`: the gap before a horizontal line without a label, or above a vertical one: none unless told.

### PantrixHorizontalDivider

`import com.pantrixui.components.elements.divider.PantrixHorizontalDivider`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixHorizontalDivider(
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    label: String? = null,
    align: DividerAlign = DividerAlign.Center,
    thickness: Dp = DefaultThickness,
    startIndent: Dp = DefaultStartIndent
)
```

A horizontal line as wide as its container and `thickness` tall.

Without a `label`, the line is decorative, hidden from screen readers, and `startIndent` leaves a gap before it. With one, the label sits on the line where `align` puts it and a screen reader reads it; `startIndent` is not used.

Given no `color`, it is drawn as a `PantrixDivider` is: in the theme's `divider`, or on a fill in a share of what is written there.

Parameters:

- `modifier: Modifier`: the line's modifier.
- `color: Color`
- `label: String?`
- `align: DividerAlign`
- `thickness: Dp`
- `startIndent: Dp`

### PantrixVerticalDivider

`import com.pantrixui.components.elements.divider.PantrixVerticalDivider`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixVerticalDivider(
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    thickness: Dp = DefaultThickness,
    startIndent: Dp = DefaultStartIndent
)
```

A vertical line as tall as its container and `thickness` wide, hidden from screen readers. `startIndent` leaves a gap above it.

Given no `color`, it is drawn as a `PantrixDivider` is: in the theme's `divider`, or on a fill in a share of what is written there.

Parameters:

- `modifier: Modifier`: the line's modifier.
- `color: Color`
- `thickness: Dp`
- `startIndent: Dp`

### DividerOrientation

`import com.pantrixui.components.elements.divider.DividerOrientation`, from `com.pantrixui:components`

```kotlin
enum class DividerOrientation
```

Which way a `PantrixDivider` runs: across its container, or down it.

Entries:

- `Horizontal`: Across its container: a `PantrixHorizontalDivider`.
- `Vertical`: Down its container: a `PantrixVerticalDivider`.

### DividerAlign

`import com.pantrixui.components.elements.divider.DividerAlign`, from `com.pantrixui:components`

```kotlin
enum class DividerAlign
```

Where a horizontal divider's label sits along the line. At the start or the end, a short stretch of line stays on the label's side.

Entries:

- `Start`: Near the start of the line: the left, and the right in a language read from the right.
- `Center`: In the middle of the line: where a label sits unless told.
- `End`: Near the end of the line.
