# Colours

The theme's colours: `PantrixTheme.colors`. A component asks for a colour by its job, not by its name: the main action is `primary`, an error `danger`, a card's ground `surface`. The theme says which colour that job is; going from the light theme to the dark changes the component's colour, and not its code.

The examples of the roles, the grounds and the lines read their colours from `PantrixTheme.colors` and write no colour code: they change with the theme when it is switched from light to dark in "Settings". The palette does not look at the theme: its scales are the same in both.

## Features

- **Six roles.** `primary` is the brand's role: the main action, and what is selected. `success`, `info`, `warning` and `danger` convey a status; `neutral` is the role with no hue of its own, for what should not draw the eye.
- **A role's four colours.** Each role is a `PantrixColor`: `color` is the role at full strength and `container` the role softened; `onColor` and `onContainer` are the colours of the text and icons drawn on them.
- **Two grounds.** `background` is the app's backdrop; `surface` is the ground of a raised or grouped area: a card, a sheet, a dialog, a menu.
- **Text colours.** On the grounds the main text is written in `textPrimary`, supporting text in `textSecondary` and the text of what cannot be used in `textDisabled`. `textInverse` is the text on a fill of the theme's opposite tone.
- **Edges and lines.** `border` is a box's soft edge, `borderHover` that edge under a pointer, `borderStrong` the mark of a control that is nothing but its mark, and `divider` the line between items.
- **Disabled, focus, scrim.** `disabledContainer` and `disabledContent` are the fill of a control that cannot be used and what is drawn on it; `focusRing` is the ring around what has keyboard focus, and `scrim` the dimming laid behind a modal.
- **Content colour.** A fill tells everything inside it which colour is written on it: text and icons that are given no colour take it. `contentColorFor` finds a fill's pair in the theme.
- **Chart colours.** `chart` holds the colours a chart tells its series apart by, in the order they are handed out. They are no role: they do not say what a series is, only tell it from the others.
- **Palette.** `PantrixPalette` gives each of eighteen colours in eleven steps. The roles pick their steps from it; components read the roles, not the palette.
- **Your own colours.** `PantrixColors` is a `data class`: `PantrixColors.Light` and `PantrixColors.Dark` are the two ready-made sets, `copy` changes a single role of a set, and `PantrixTheme(colors = …)` gives the set to the theme.

## Examples

### Six roles

Each row is a role, and each box one of that role's fills. On the left, `color` is the role at full strength: a solid button's fill. On the right, `container` is the role softened: the fill of a soft button or of a tinted area. The two lines inside a box are written in the colour that reads on that fill: `onColor` on `color`, `onContainer` on `container`.

None of the colours is written here: all of them are read from `PantrixTheme.colors`. Switch the theme to dark in "Settings": the same six roles come back, in the colours that read on a dark ground.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val roles = listOf(
    "primary" to colors.primary,
    "success" to colors.success,
    "info" to colors.info,
    "warning" to colors.warning,
    "danger" to colors.danger,
    "neutral" to colors.neutral
)
roles.forEach { (name, role) ->
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = name, modifier = Modifier.width(72.dp))
        ColorSwatch(
            name = "color",
            fill = role.color,
            ink = role.onColor,
            modifier = Modifier.weight(1f),
            inkName = "onColor"
        )
        ColorSwatch(
            name = "container",
            fill = role.container,
            ink = role.onContainer,
            modifier = Modifier.weight(1f),
            inkName = "onContainer"
        )
    }
}

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

### Grounds and text colours

The theme has two grounds. `background` is the app's backdrop, behind everything. `surface` is the ground of a raised or grouped area: a card, a sheet, a dialog, a menu. Text is written in the same colours on both: the main text in `textPrimary`, supporting text in `textSecondary`, the text of what cannot be used in `textDisabled`. What is not text, such as an icon nothing else gives a colour, is drawn in `onSurface`.

The box below is a fill of the theme's opposite tone: the text on it is `textInverse`, white in the light theme and all but black in the dark. A tooltip is drawn this way: its fill is `onSurface`, its text `textInverse`.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    listOf("background" to colors.background, "surface" to colors.surface).forEach { (name, ground) ->
        PantrixSurface(modifier = Modifier.weight(1f), color = ground, border = colors.border) {
            Column(
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
            ) {
                PantrixText(text = name, style = PantrixTheme.typography.callout)
                PantrixText(text = "textPrimary", color = colors.textPrimary)
                PantrixText(text = "textSecondary", color = colors.textSecondary)
                PantrixText(text = "textDisabled", color = colors.textDisabled)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, tint = colors.onSurface)
                    PantrixText(text = "onSurface")
                }
            }
        }
    }
}
ColorSwatch(
    name = "textInverse",
    fill = colors.onSurface,
    ink = colors.textInverse,
    modifier = Modifier.fillMaxWidth(),
    inkName = "on the onSurface fill"
)

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

### Edges and lines

`border` is the edge of a box: a text field's, a chip's. It is soft by design: stronger than `divider` and far quieter than text. `borderHover` is that edge under a pointer, a notch stronger. `borderStrong` is the mark of a control that is nothing but its mark: a checkbox's box, a radio button's ring, a switch that is off. It is at 3:1 against what it stands on (WCAG 1.4.11), so that the control is seen before it is chosen. The empty box of the checkbox below is drawn in it.

`border` is below that 3:1. A product that has to meet it for the edges of its fields gives its theme a stronger colour here.

`divider` is the line between items or sections, lighter than `border`: it separates, and is no control's edge. A `PantrixHorizontalDivider` that is given no colour is drawn in it on the theme's grounds.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
var checked by rememberSaveable { mutableStateOf(false) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    listOf(
        "border" to colors.border,
        "borderHover" to colors.borderHover,
        "borderStrong" to colors.borderStrong
    ).forEach { (name, edge) ->
        PantrixSurface(border = edge) {
            PantrixText(text = name, modifier = Modifier.padding(PantrixTheme.spacing.md))
        }
    }
}
PantrixCheckbox(
    checked = checked,
    onCheckedChange = { checked = it },
    label = "The empty box's edge: borderStrong",
    tagKey = "border_strong"
)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(text = "Profile")
    PantrixHorizontalDivider()
    PantrixText(text = "Security")
    PantrixHorizontalDivider()
    PantrixText(text = "The lines between: divider", color = colors.textSecondary)
}
```

### Disabled, focus ring and scrim

The fill of a control that cannot be used is `disabledContainer`, and the text and icon on it are `disabledContent`: the disabled button beside the box is drawn in those two. Disabled text that stands on no fill is `textDisabled`: a disabled checkbox's label.

`focusRing` is the colour of the ring around the component that has keyboard focus. The edge of the box here is drawn in that colour and at the ring's width (`PantrixTheme.platform.focusRingWidth`). `scrim` is the dimming laid over the app behind a modal, a dialog or a sheet: the text of the last box lies under it.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    ColorSwatch(
        name = "disabledContainer",
        fill = colors.disabledContainer,
        ink = colors.disabledContent,
        inkName = "disabledContent"
    )
    PantrixButton(text = "Disabled button", onClick = {}, enabled = false, tagKey = "disabled_button")
}
PantrixCheckbox(
    checked = false,
    onCheckedChange = {},
    enabled = false,
    label = "Disabled label: textDisabled",
    tagKey = "disabled_label"
)
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixText(
        text = "focusRing",
        modifier = Modifier
            .border(PantrixTheme.platform.focusRingWidth, colors.focusRing, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    )
    Box {
        PantrixText(text = "Text under the scrim", modifier = Modifier.padding(PantrixTheme.spacing.md))
        Box(modifier = Modifier.matchParentSize().background(colors.scrim, PantrixTheme.shapes.md))
    }
}

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

### The content colour a fill provides

A fill tells everything inside it which colour is written on it. Filled with a role's colour, a `PantrixSurface` provides the one the theme pairs with it as the content colour: `onColor` for `color`, `onContainer` for `container`. The icon, the text and the line in the first two boxes were given no colour; all three took that one. The line is thirty per cent of it.

The theme's own grounds provide no content colour. The third box is filled with `surface`: each component in it is drawn in its own default, the text in `textPrimary`, the icon in `onSurface`, the line in `divider`.

The fill of the last box is in none of the theme's roles. The theme cannot know what reads on it: the content colour is the caller's to give, with `contentColor`.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val own = ownColors()
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.primary.color) {
    FillContent(name = "primary.color")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.success.container) {
    FillContent(name = "success.container")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.surface, border = colors.divider) {
    FillContent(name = "surface")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = own.color, contentColor = own.onColor) {
    FillContent(name = "A colour the theme does not have")
}

@Composable
private fun FillContent(name: String) {
    Column(
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
            PantrixText(text = name)
        }
        PantrixHorizontalDivider()
        PantrixText(text = "This text, this icon and this line were given no colour.", style = PantrixTheme.typography.footnote)
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Chart colours

`chart` holds the colours a chart hands out to its series: the first series takes the first, the second the second. With more series than colours, `chartColor(index)` starts again at the first. The default sets have ten.

Three things decided them. Each stands out on both of the theme's grounds as far as a line or a bar needs to be seen: at least 3:1. The light set and the dark set carry the same hues in the same order: when the theme turns, a series changes its shade and not its colour. And the order was built so that two colours next to each other stay apart for an eye that does not tell red from green, or blue from yellow; that is why some steps are one lighter or one darker than their neighbour's.

Even so, colour alone does not carry ten series, to any eye: a chart of many series marks them by more than colour. For your own brand's colours, `PantrixTheme.colors.copy(chart = listOf(…))` is enough.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixTheme.colors.chart.forEachIndexed { index, color ->
        Column(
            modifier = Modifier.weight(1f),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
        ) {
            Box(modifier = Modifier.fillMaxWidth().height(40.dp).background(color, PantrixTheme.shapes.sm))
            PantrixText(text = strings.number(index + 1), style = PantrixTheme.typography.caption)
        }
    }
}
```

### The palette's scales

`PantrixPalette` holds the raw scales the theme's colours are picked from: eighteen colours, each in eleven steps, from left to right 50, 100, 200 and on by hundreds to 900, then 950. `PantrixPalette.all` gives them all, with their names.

In the default themes a role's `color` is its scale's 600 or 700 in the light theme and its 400 in the dark; its `container` is the 100 in the light theme and the 900 in the dark, the 800 for `neutral`. There the `primary` role is from the `Blue` scale, `success` from `Green`, `info` from `Cyan`, `warning` from `Amber` and `danger` from `Red`; the `neutral` role, the grounds, the text and the lines are from `Slate`. The whites of the light theme are no step of any scale: `surface`, `textInverse` and the roles' `onColor`.

A component does not read the palette: it reads the roles. The palette is for picking steps when a theme's roles are built.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColorScale
import com.pantrixui.foundation.token.color.PantrixPalette

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixPalette.all.forEach { (name, scale) ->
        Row(verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = name, modifier = Modifier.width(64.dp), style = PantrixTheme.typography.footnote)
            scale.shades().forEach { shade ->
                Box(modifier = Modifier.weight(1f).height(24.dp).background(shade))
            }
        }
    }
}

private fun PantrixColorScale.shades(): List<Color> = listOf(
    shade50,
    shade100,
    shade200,
    shade300,
    shade400,
    shade500,
    shade600,
    shade700,
    shade800,
    shade900,
    shade950
)
```

### A role of your own, built from the palette

When a colour is needed that is in none of the theme's six roles, a role is built from the palette: a `PantrixColor`, with its four colours. Here it is from the `Violet` scale, at the steps of the theme's own roles: 600 with white on it in the light theme, 400 with 950 on it in the dark. That way the colour stands out from the ground in both themes, and the text on it reads. An app knows for itself whether its theme is dark; in this app `LocalDemoDarkTheme` says so.

A role built this way is used as the theme's roles are: `buttonColors(variant)` makes a button's colours from it. The "app's own colour" examples on the other pages are in this purple.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor
import com.pantrixui.foundation.token.color.PantrixPalette

val violet = PantrixPalette.Violet
val own = if (LocalDemoDarkTheme.current) {
    PantrixColor(
        color = violet.shade400,
        onColor = violet.shade950,
        container = violet.shade900,
        onContainer = violet.shade100
    )
} else {
    PantrixColor(
        color = violet.shade600,
        onColor = Color.White,
        container = violet.shade100,
        onContainer = violet.shade900
    )
}
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    ColorSwatch(
        name = "color",
        fill = own.color,
        ink = own.onColor,
        modifier = Modifier.weight(1f),
        inkName = "onColor"
    )
    ColorSwatch(
        name = "container",
        fill = own.container,
        ink = own.onContainer,
        modifier = Modifier.weight(1f),
        inkName = "onContainer"
    )
}
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Join the campaign",
        onClick = {},
        colors = own.buttonColors(ButtonVariant.Solid),
        tagKey = "own_solid"
    )
    PantrixButton(
        text = "Details",
        onClick = {},
        colors = own.buttonColors(ButtonVariant.Soft),
        tagKey = "own_soft"
    )
    PantrixButton(
        text = "Cancel",
        onClick = {},
        colors = own.buttonColors(ButtonVariant.Outline),
        tagKey = "own_outline"
    )
}

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalDemoDarkTheme`: Whether the app's theme is dark right now: the system's mode while the setting is "System", and the setting itself otherwise.

### A theme that changes the brand's colour

The brand's colour is the `primary` role, and the theme gives it. `PantrixColors` is a `data class`, so `copy` changes a single role; `PantrixTheme(colors = …)` gives the new set to what is inside it. The buttons, the checkbox and the switch here were given no colour: they read `primary` and are drawn in the purple the theme gives.

For the whole app the same is done in the outermost theme. `focusRing` is a colour of its own: it does not change when `primary` does, and is given as well where that is wanted.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var agreed by rememberSaveable { mutableStateOf(true) }
var notify by rememberSaveable { mutableStateOf(true) }
PantrixTheme(colors = PantrixTheme.colors.copy(primary = own)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Save", onClick = {}, tagKey = "brand_save")
        PantrixButton(text = "Preview", onClick = {}, variant = ButtonVariant.Soft, tagKey = "brand_preview")
        PantrixButton(text = "Cancel", onClick = {}, variant = ButtonVariant.Outline, tagKey = "brand_cancel")
    }
    PantrixCheckbox(
        checked = agreed,
        onCheckedChange = { agreed = it },
        label = "I accept the terms",
        tagKey = "brand_agree"
    )
    PantrixSwitchButton(
        checked = notify,
        onCheckedChange = { notify = it },
        label = "Send notifications",
        tagKey = "brand_notify"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Your own component's content colour

The app's own component finds its content colour from the theme too. `Pill` takes a fill and asks with `contentOn` for the colour of what it draws on it: the colour paired with the fill where it is a role's (what `contentColorFor` finds), `textPrimary` where it is the theme's ground, and the component's own default where the theme does not know the colour. `ProvidePantrixContentColor` gives that colour to what is inside: the text and the icon were given no colour, and both took it.

The line underneath asks `contentColorFor` directly: on success's fill it gives `onColor`.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.contentColorFor
import com.pantrixui.foundation.token.color.contentOn
import com.pantrixui.foundation.token.contentcolor.ProvidePantrixContentColor

val colors = PantrixTheme.colors
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    Pill(text = "Saved", fill = colors.success.color)
    Pill(text = "Draft", fill = colors.warning.container)
    Pill(text = "On the ground", fill = colors.surface)
}
val onFill = colors.contentColorFor(colors.success.color)
PantrixText(
    text = "Is contentColorFor(success.color) onColor: ${if (onFill == colors.success.onColor) "yes" else "no"}",
    style = PantrixTheme.typography.footnote,
    color = colors.textSecondary
)

@Composable
private fun Pill(
    text: String,
    fill: Color
) {
    val colors = PantrixTheme.colors
    val content = colors.contentOn(given = fill, usual = colors.surface, otherwise = colors.textPrimary)
    Row(
        modifier = Modifier
            .background(fill, PantrixTheme.shapes.full)
            .border(1.dp, colors.divider, PantrixTheme.shapes.full)
            .padding(horizontal = PantrixTheme.spacing.md, vertical = PantrixTheme.spacing.xs),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ProvidePantrixContentColor(content) {
            PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null, size = 16.dp)
            PantrixText(text = text, style = PantrixTheme.typography.footnote)
        }
    }
}
```

### Pantrix's two sets

Pantrix's own two sets: `rememberPantrixColors(darkTheme)` gives the light or the dark one, whatever the app's brand. The two are also read as `PantrixColors.Light` and `PantrixColors.Dark`: an app builds its own set from them with `copy`. Here two sections take the two sets; each draws its ground with its own `surface`.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.Dark
import com.pantrixui.foundation.token.color.PantrixColors
import com.pantrixui.foundation.token.color.rememberPantrixColors

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    listOf(false, true).forEach { dark ->
        val set = rememberPantrixColors(darkTheme = dark)
        PantrixTheme(darkTheme = dark, colors = set) {
            PantrixSurface(border = PantrixTheme.colors.divider) {
                Column(
                    modifier = Modifier.padding(PantrixTheme.spacing.md),
                    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
                ) {
                    PantrixText(text = if (set == PantrixColors.Dark) "PantrixColors.Dark" else "PantrixColors.Light")
                    PantrixButton(text = "Continue", onClick = {}, tagKey = if (dark) "dark_set" else "light_set")
                }
            }
        }
    }
}
```

## API

### PantrixColors

`import com.pantrixui.foundation.token.color.PantrixColors`, from `com.pantrixui:foundation`

```kotlin
data class PantrixColors(
    val primary: PantrixColor,
    val success: PantrixColor,
    val info: PantrixColor,
    val warning: PantrixColor,
    val danger: PantrixColor,
    val neutral: PantrixColor,
    val background: Color,
    val surface: Color,
    val onSurface: Color,
    val disabledContainer: Color,
    val disabledContent: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textDisabled: Color,
    val textInverse: Color,
    val border: Color,
    val borderHover: Color,
    val borderStrong: Color,
    val divider: Color,
    val focusRing: Color,
    val scrim: Color,
    val chart: List<Color>
)
```

The colours of a Pantrix theme: six roles, the backdrop and the surfaces, the text, lines and marks drawn on them, and the colours a chart tells its series apart by. Each role is a `PantrixColor`, and `roles()` lists them.

Parameters:

- `primary: PantrixColor`: The brand's role: the main action, and what is selected.
- `success: PantrixColor`: The role for what went well: a completed step, a saved change.
- `info: PantrixColor`: The role for neutral information: a hint, a notice.
- `warning: PantrixColor`: The role for what needs attention before it becomes a problem.
- `danger: PantrixColor`: The role for what went wrong or cannot be undone: an error, a destructive button.
- `neutral: PantrixColor`: The role with no hue of its own, for what should not draw the eye.
- `background: Color`: The app's own backdrop, behind everything: what a scaffold fills.
- `surface: Color`: A raised or grouped area: a card, a sheet, a dialog, a menu, a sidebar, a text field's box.
- `onSurface: Color`: What is drawn on the theme's own grounds, `background` and `surface` alike, that is not text: an icon nothing else gives a colour, the press drawn over a checkbox. A text there is `textPrimary`. The two grounds have one such colour between them, as they have one primary text colour.
- `disabledContainer: Color`: The fill of a control that cannot be used: a disabled button, a disabled switch's track.
- `disabledContent: Color`: What is drawn on `disabledContainer`, and the marks and edges of anything disabled: a disabled button's label, a disabled radio's ring, a disabled field's edge.
- `textPrimary: Color`: The main text: what a text is drawn in on the theme's own grounds, `background` and `surface`, unless it is given a colour. On a fill a text takes the colour that reads on the fill.
- `textSecondary: Color`: Text of less weight: supporting text, a divider's label.
- `textDisabled: Color`: The text of what cannot be used, where it stands on no fill: the label of a disabled checkbox, a disabled link, a disabled tab. The default themes give it `disabledContent`'s colour.
- `textInverse: Color`: Text on a fill of the theme's opposite tone: white in the default light theme, all but black in the dark.
- `border: Color`: The edge of a box that holds what says what it is: a text field, a chip. A soft line by design, stronger than `divider` and far quieter than text. It is below the 3:1 that WCAG 1.4.11 asks of an edge that alone marks a control: a product that has to meet it for its fields gives a stronger colour here.
- `borderHover: Color`: That edge under a pointer: a notch stronger than `border`.
- `borderStrong: Color`: The mark of a control that is nothing but its mark: a checkbox's box, a radio button's ring, a switch that is off. At 3:1 against what it stands on (WCAG 1.4.11), so that the control is seen before it is chosen.
- `divider: Color`: A line between items or sections, lighter than `border`: it separates, and marks no control's edge.
- `focusRing: Color`: The ring around what has keyboard focus.
- `scrim: Color`: The dimming laid over the app behind a modal: a dialog, a sheet, a drawer.
- `chart: List<Color>`: The colours a chart draws its series in, in the order it hands them out: the first series takes the first, and `chartColor` starts again at the first for a chart of more series than there are colours. They say nothing of what a series is, as a role does: a series that went wrong is drawn in `danger`, by its own colour. The default sets have ten, each at 3:1 against the set's grounds (WCAG 1.4.11), the same hues in the light set and in the dark, in an order that keeps those next to each other apart for every kind of colour vision. Colour alone does not carry ten series, to any eye: a chart of many marks them by more than their colour.

Members:

- `fun chartColor(index: Int): Color`: The colour of a chart's series at `index`, counted from nought: the colours of `chart` in their order, and from the first again past the last.

### PantrixColor

`import com.pantrixui.foundation.token.color.PantrixColor`, from `com.pantrixui:foundation`

```kotlin
data class PantrixColor(
    val color: Color,
    val onColor: Color,
    val container: Color,
    val onContainer: Color
)
```

One colour role: the colour at full strength, a softer container of the same hue, and what is drawn on each.

Parameters:

- `color: Color`: The role at full strength: a solid button's fill.
- `onColor: Color`: Text and icons on `color`.
- `container: Color`: The role softened: a soft button's fill, a tinted area.
- `onContainer: Color`: Text and icons on `container`.

### PantrixColors.roles

`import com.pantrixui.foundation.token.color.roles`, from `com.pantrixui:foundation`

```kotlin
fun PantrixColors.roles(): List<PantrixColor>
```

Every role in this set, in the order they are declared.

### PantrixColors.contentColorFor

`import com.pantrixui.foundation.token.color.contentColorFor`, from `com.pantrixui:foundation`

```kotlin
fun PantrixColors.contentColorFor(container: Color): Color
```

The one colour that whatever is drawn on `container` takes: a role's `onColor` on its colour and its `onContainer` on its container. `Color.Unspecified` where the set has no one colour for it: on its own grounds, the background and the surface, and on a colour it does not have.

On its own grounds the set gives each kind of content a colour of its own: a text is `textPrimary`, an icon is `onSurface`. So a container filled with a ground gives what it holds no content colour, and each component draws there in its own default. A fill is where they all take the one colour that reads on it.

It goes by the colour alone, and a theme may use one colour twice: the dark theme fills a disabled control with the colour of its neutral container. So the disabled pair is looked at last. A fill that is a role's gets the role's content colour, which reads on it, and the disabled content colour is the answer only for a fill that is nothing but the disabled container. What is disabled asks for `disabledContent` itself.

Parameters:

- `container: Color`

### PantrixColors.contentOn

`import com.pantrixui.foundation.token.color.contentOn`, from `com.pantrixui:foundation`

```kotlin
fun PantrixColors.contentOn(
    given: Color,
    usual: Color,
    otherwise: Color
): Color
```

The colour to draw on a fill a component was given, where it was given none for what is drawn on it: the one this set pairs with `given` where that is a role's colour, as `contentColorFor` finds it, `textPrimary` where it is one of the set's grounds, and `otherwise` where it is neither.

A caller that fills a chip with a role's colour and says no more means the role's content with it, as a surface takes it: the component's usual content could not be read on that fill. On the set's background or its surface what a component draws is written as a text is there. A fill the set does not have says nothing of what reads on it, and its content is the caller's to give.

Parameters:

- `given: Color`: the fill the caller gave, or `Color.Unspecified` where it gave none.
- `usual: Color`: the fill the component has without being given one. Given again, it changes nothing: what a component draws on its usual fill is not always that fill's pair, as a segment button's label on its pill is not.
- `otherwise: Color`: what the component draws on its usual fill, and on a fill this set has no pair for.

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixColors(darkTheme: Boolean): PantrixColors
```

Pantrix's own colours: the dark set when `darkTheme`, the light one otherwise.

Parameters:

- `darkTheme: Boolean`

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixColors(preset: DesignPreset): PantrixColors
```

`preset`'s colours, dark while the system is, and following it when it switches.

Parameters:

- `preset: DesignPreset`

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixColors(
    preset: DesignPreset,
    darkTheme: Boolean
): PantrixColors
```

`preset`'s colours, the dark set when `darkTheme`: for an app that lets its reader choose light or dark, and for a theme inside another, which is as dark as the theme around it and not as the system is.

```kotlin
val dark = settings.dark ?: isSystemInDarkTheme()
PantrixTheme(preset = Brand, colors = rememberPantrixColors(Brand, darkTheme = dark)) { App() }
```

Parameters:

- `preset: DesignPreset`: whose colours they are.
- `darkTheme: Boolean`: whether the dark set is given.

### LocalPantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixContentColor: ProvidableCompositionLocal<Color>
```

The colour that text and icons draw in where they are given none, for everything inside whatever provides it. A component that paints a fill provides the colour that reads on it: a solid button its role's `onColor`, a surface filled with a role's colour the one paired with it.

`Color.Unspecified`, the value the theme starts with, means that nothing around has provided one. It is also what the theme's own grounds provide, a scaffold on the background, a surface, a card: on them each component draws in its own default, `PantrixText` in `textPrimary`, `PantrixIcon` in `onSurface`, `PantrixSpinner` in the brand's colour.

### ProvidePantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.ProvidePantrixContentColor`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ProvidePantrixContentColor(
    color: Color,
    content: @Composable () -> Unit
)
```

Draws `content` in `color`. What a component wraps its slots in.

Parameters:

- `color: Color`
- `content: @Composable () -> Unit`

### PantrixPalette

`import com.pantrixui.foundation.token.color.PantrixPalette`, from `com.pantrixui:foundation`

```kotlin
data object PantrixPalette
```

The raw colour scales the colour sets are drawn from. A set's roles pick their shades from here; components read the roles, never these.

Members:

- `Slate: PantrixColorScale`: Cool grey with a blue cast: the default `neutral`, and the surfaces, text and lines.
- `Zinc: PantrixColorScale`: Neutral grey with a faint warm cast.
- `Neutral: PantrixColorScale`: Pure achromatic grey.
- `Red: PantrixColorScale`: The default `danger`.
- `Orange: PantrixColorScale`: Orange, between red and amber: the chart's second colour.
- `Amber: PantrixColorScale`: The default `warning`.
- `Yellow: PantrixColorScale`: Yellow, lighter than amber. No role and no chart colour takes it by default.
- `Green: PantrixColorScale`: The default `success`.
- `Emerald: PantrixColorScale`: A green with a blue cast: the chart's third colour.
- `Teal: PantrixColorScale`: A blue-green between emerald and cyan: one of the chart's colours.
- `Cyan: PantrixColorScale`: The default `info`.
- `Sky: PantrixColorScale`: A light blue between cyan and blue: the chart's last colour.
- `Blue: PantrixColorScale`: The default `primary` and `focusRing`.
- `Indigo: PantrixColorScale`: A deep blue with a violet cast: one of the chart's colours.
- `Violet: PantrixColorScale`: A blue purple. No role and no chart colour takes it by default.
- `Purple: PantrixColorScale`: A purple between violet and pink. No role and no chart colour takes it by default.
- `Pink: PantrixColorScale`: Pink: one of the chart's colours.
- `Rose: PantrixColorScale`: A pink red: one of the chart's colours.
- `all: Map<String, PantrixColorScale>`: Every scale defined here, by the name of its property: for a catalogue and for tests.

### PantrixColorScale

`import com.pantrixui.foundation.token.color.PantrixColorScale`, from `com.pantrixui:foundation`

```kotlin
data class PantrixColorScale(
    val shade50: Color,
    val shade100: Color,
    val shade200: Color,
    val shade300: Color,
    val shade400: Color,
    val shade500: Color,
    val shade600: Color,
    val shade700: Color,
    val shade800: Color,
    val shade900: Color,
    val shade950: Color
)
```

One hue in eleven steps, from all but white to all but black.

In the default themes a role's colour is its 600 or 700 in the light theme and its 400 in the dark, and its container its 100 in the light theme and its 900 in the dark, Slate's 800 for `neutral`.

Parameters:

- `shade50: Color`: The lightest step, all but white.
- `shade100: Color`: A pale tint.
- `shade200: Color`: A light tint.
- `shade300: Color`: The last of the light tints.
- `shade400: Color`: A light middle step.
- `shade500: Color`: The middle of the scale.
- `shade600: Color`: A dark middle step.
- `shade700: Color`: A dark step.
- `shade800: Color`: A deeper step.
- `shade900: Color`: A deep step, near the end of the scale.
- `shade950: Color`: The darkest step, all but black.
