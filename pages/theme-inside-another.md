# Nested theme

A theme inside another: where a part of the screen is to look different, that part is wrapped in a second `PantrixTheme`, and only what changes is given. The inner theme takes every setting it is not given from the outer one; what it is given is its own.

The examples write the theme's values at that point, line by line. A line that differs from the outer theme's ends with "(changed)": what the inner theme changed, and what it took from the outer one, is read there.

## Features

- **Only what is given changes.** The platform the app told its theme, the density, the language and its strings, the styles and the place events are reported to are the outer theme's in the inner one too.
- **A dark or a light part.** A theme that is not given `darkTheme` is as dark as the theme around it, and keeps that theme's colours. Told to be dark inside a light theme, it takes the dark colours of the preset the outer theme is built on, or Pantrix's own dark set where there is no preset.
- **Its own colours.** A part that is given `colors` is drawn with that set: it can be a set with a single role changed.
- **The density is applied once.** `density` scales the spacing and the heights by the inner theme's density: not on top of the outer one's, but in its place. `Compact` does not make the touch target smaller.
- **Language and reading direction.** In a part that is given `locale`, what the components say by themselves is in that language, and the reading direction is that language's.
- **Events.** The components of a part that is given no `analytics` report their events to the place the outer theme gives.
- **Preset.** `PantrixTheme(preset = …)` puts a part in a brand's look: the colours, the typography, the shapes and the component overrides are the preset's, and the rest the outer theme's. The part is as dark as the theme around it, whatever the system says.
- **The dark the reader chose.** `rememberPantrixColors(preset, darkTheme)` gives the preset's light or dark set. The outermost theme makes Android's bars and iOS's status bar, keyboard and controls follow its own dark; an app that sets its bars itself gives it `followSystemBars = false`.
- **A theme draws no ground.** A dark part's ground is drawn by a `PantrixSurface` or a card put inside the theme.
- **A theme is not a layout.** What is inside it is laid out by the layout the theme stands in: as if the theme were not there.

## Examples

### A part in the opposite colours

A part in the opposite colours to what is around it: dark in a light theme, light in a dark one. The inner theme is given only `darkTheme`; the density, the touch target and the language are the outer theme's. Look at the lines: only "Colours" has changed.

A theme draws no ground. The part's ground is drawn by the `PantrixSurface` inside it: in the inner theme's `surface` colour. The text, the checkbox and the lines read their colours from the inner theme too.

Turn the switch off: the part is told to be as dark as what is around it, the theme keeps the outer theme's colours, and no line changes.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val outer = themeValues()
var opposite by rememberSaveable { mutableStateOf(true) }
var subscribed by rememberSaveable { mutableStateOf(false) }
// The part is the opposite of what is around it, and its name goes by that too.
val named = if (outer.isDark) "Light" else "Dark"
val dark = if (opposite) !outer.isDark else outer.isDark
PantrixSwitchButton(
    checked = opposite,
    onCheckedChange = { opposite = it },
    label = "Part in the opposite colours to the page",
    tagKey = "opposite_colors"
)
PantrixTheme(darkTheme = dark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth().testTag("dark_part_ground")) {
        Column(
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = "$named part: only the colours change", style = PantrixTheme.typography.callout)
            ThemeValueLines(tagKey = "dark_part", outer = outer)
            PantrixCheckbox(
                checked = subscribed,
                onCheckedChange = { subscribed = it },
                label = "Subscribe to the newsletter",
                tagKey = "subscribe_in_dark_part"
            )
        }
    }
}
PantrixText(
    text = "PantrixTheme(darkTheme = $dark) { PantrixSurface { … } }",
    style = PantrixTheme.typography.code
)

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Colours", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Density", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Spacing (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Touch target",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Language", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "The component's own text",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Dark" else "Light",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (changed)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

private const val HALF_LUMINANCE = 0.5f
```

### Events that go to the outer theme

The outer theme was given only an `analytics` that counts the components' events. The lines are written inside it: the colours, the density and the language come from the app's theme, and none of them has changed.

The part inside it is a theme too, and it was given only `darkTheme`. Press "Save": the event goes from inside the part's theme to the outer theme's counter. The part's theme gives no `analytics`; it takes the outer one's.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var reported by rememberSaveable { mutableIntStateOf(0) }
var lastEvent by rememberSaveable { mutableStateOf("") }
val counter = remember {
    PantrixAnalytics { event ->
        reported++
        lastEvent = "${event.component} · ${event.action}"
    }
}
PantrixTheme(analytics = counter) {
    val around = themeValues()
    ThemeValueLines(tagKey = "page")
    PantrixTheme(darkTheme = !around.isDark) {
        PantrixSurface(modifier = Modifier.fillMaxWidth()) {
            PantrixButton(
                text = "Save",
                onClick = {},
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                tagKey = "save_in_dark_part"
            )
        }
    }
}
PantrixText(text = "Events reported: $reported", tagKey = "reported")
if (lastEvent.isNotEmpty()) {
    PantrixText(
        text = "Last event: $lastEvent",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "last_event"
    )
}

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Colours", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Density", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Spacing (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Touch target",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Language", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "The component's own text",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (changed)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Dark" else "Light",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

private const val HALF_LUMINANCE = 0.5f
```

### A compact part: only the density changes

The same controls, first at the page's density and then in a `Compact` part: for a compact table or a toolbar. The inner theme is given only `density`. Density scales the air: the spacing and the heights. The colours and the language are the outer theme's.

The density is applied once, not on top of the outer one: even while the app's density is "Spacious", the compact part's spacing is the spacing of `Compact`. Change the density in "Settings" and look at the lines.

The touch target stands apart: `Spacious` makes it larger, `Compact` does not make it smaller. The platform's value is a floor; in a compact part too, the place a finger presses gets no smaller.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity
import kotlin.math.roundToInt

val outer = themeValues()
PantrixText(text = "At the page's density")
Controls(tagKey = "page_density")
PantrixText(text = "Compact")
PantrixTheme(density = PantrixDensity.Compact) {
    Controls(tagKey = "compact")
    ThemeValueLines(tagKey = "dense_part", outer = outer)
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Confirm", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Cancel", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filter", onClick = {}, tagKey = "filter_$tagKey")
    }
}

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Colours", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Density", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Spacing (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Touch target",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Language", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "The component's own text",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (changed)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Dark" else "Light",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

private const val HALF_LUMINANCE = 0.5f
```

### A part in another language: the components' own texts change

A part in the language the app does not speak: English while the app is Turkish, Turkish while it is English. The inner theme is given only `locale`: what the components say by themselves ("Loading", "Close") is in that language. In the lines, the language and the component's own text have changed; the colours, the density and the rest are the outer theme's.

The theme does not translate the texts the app writes itself: the names of the lines stayed in the app's language.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val outer = themeValues()
// The part is not in the language of what is around it: its language is picked by that too.
val other = if (PantrixTheme.locale.language == "en") PantrixLocale.Turkish else PantrixLocale.English
PantrixTheme(locale = other) {
    ThemeValueLines(tagKey = "language_part", outer = outer)
}

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Colours", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Density", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Spacing (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Touch target",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Language", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "The component's own text",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (changed)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Dark" else "Light",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

private const val HALF_LUMINANCE = 0.5f
```

### A right-to-left part

The reading direction comes from the language: the theme tells what is inside it the direction of the language it is given. `PantrixLocale.Arabic` is written from right to left; in this part the row starts on the right, and the "First" button stands there. The row and the buttons were given no direction: a component does not look at the language, it reads the direction from where the theme says it, Compose's `LocalLayoutDirection`.

The part's content is in a `Column` inside the theme. Because a theme is not a layout, it is the layouts inside it that read the direction: the column starts its rows from the right, and the row its buttons. The line at the bottom writes the theme's language and the reading direction at that point.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme

PantrixTheme(locale = PantrixLocale.Arabic) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixButton(text = "First", onClick = {}, tagKey = "rtl_first")
            PantrixButton(text = "Second", onClick = {}, variant = ButtonVariant.Outline, tagKey = "rtl_second")
        }
        PantrixText(
            text = "Language: ${PantrixTheme.locale.languageTag} · Direction: ${LocalLayoutDirection.current.name}",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary,
            tagKey = "rtl_part"
        )
    }
}
```

### A part in its own colour

A theme that is given `colors` gives that set to what is inside it. Here the outer theme's colours are taken and only the `primary` role is replaced, by the app's own purple: `PantrixTheme.colors.copy(primary = …)`. The buttons and the chip in the part were given no colour; whatever reads `primary` gets the purple.

The density, the language and the rest are the outer theme's: the controls in the two rows differ only in their colours.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixText(text = "In the page's colours")
Controls(tagKey = "page_colors")
PantrixText(text = "In a theme whose primary role has changed")
PantrixTheme(colors = PantrixTheme.colors.copy(primary = own)) {
    Controls(tagKey = "own_colors")
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Confirm", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Cancel", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filter", onClick = {}, tagKey = "filter_$tagKey")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### A theme is not a layout

What the inner theme holds is laid out by the layout the theme stands in: the theme puts no box in between. "Next" and "Finish" are inside a theme, but they are children of the same `Row` as "Back"; they stand side by side, and the `Row` gives the gaps between them.

Only the inner theme's two buttons are compact.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButton(text = "Back", onClick = {}, variant = ButtonVariant.Outline, tagKey = "row_back")
    PantrixTheme(density = PantrixDensity.Compact) {
        PantrixButton(text = "Next", onClick = {}, tagKey = "row_next")
        PantrixButton(text = "Finish", onClick = {}, tagKey = "row_finish")
    }
}
```

### A brand's preset

A brand's look in one place: a `DesignPreset` gives its colours (light and dark), its type, its shapes and its component settings. `PantrixTheme(preset = Harbor)` puts the section in that brand; the rest, the language, the density, the events, is the outer theme's. The section is as dark as what is around it: on a dark page it is drawn in the brand's dark colours.

The brand's colours are read outside a theme too: `rememberPantrixColors(Harbor)` gives the brand's set as the system is light or dark, for the colour of a system bar or a notification. The line underneath is its primary colour.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.theme.preset.DesignPreset
import com.pantrixui.foundation.token.color.Dark
import com.pantrixui.foundation.token.color.Light
import com.pantrixui.foundation.token.color.PantrixColor
import com.pantrixui.foundation.token.color.PantrixColors
import com.pantrixui.foundation.token.color.PantrixPalette
import com.pantrixui.foundation.token.color.rememberPantrixColors
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ComponentTokenOverrides
import com.pantrixui.foundation.token.typography.PantrixTypeface
import com.pantrixui.foundation.token.typography.PantrixTypography
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily

PantrixTheme(preset = Harbor) {
    PantrixSurface(border = PantrixTheme.colors.divider) {
        Column(
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = Harbor.name, style = PantrixTheme.typography.title)
            Controls(tagKey = "preset")
        }
    }
}
val brand = rememberPantrixColors(Harbor).primary.color
Box(Modifier.fillMaxWidth().height(4.dp).background(brand, PantrixTheme.shapes.full))

private object Harbor : DesignPreset {
    override val name: String = "Harbor"

    override fun colors(dark: Boolean): PantrixColors {
        val teal = PantrixPalette.Teal
        return if (dark) {
            PantrixColors.Dark.copy(
                primary = PantrixColor(
                    color = teal.shade400,
                    onColor = teal.shade950,
                    container = teal.shade900,
                    onContainer = teal.shade100
                )
            )
        } else {
            PantrixColors.Light.copy(
                primary = PantrixColor(
                    color = teal.shade700,
                    onColor = Color.White,
                    container = teal.shade100,
                    onContainer = teal.shade900
                )
            )
        }
    }

    @Composable
    override fun typography(): PantrixTypography {
        val text = rememberPantrixFontFamily(PantrixTypeface.Default)
        val headings = rememberPantrixFontFamily(Poppins)
        return remember(text, headings) { buildPantrixTypography(fontFamily = text, headingFontFamily = headings) }
    }

    @Composable
    override fun shapes(): PantrixShapes = remember {
        PantrixShapes(md = RoundedCornerShape(4.dp), lg = RoundedCornerShape(6.dp), xl = RoundedCornerShape(8.dp))
    }

    override fun componentOverrides(): ComponentTokenOverrides =
        ComponentTokenOverrides(shapes = mapOf("button.shape" to ShapeRole.Small))
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Confirm", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Cancel", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filter", onClick = {}, tagKey = "filter_$tagKey")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `Poppins`: Poppins from the app's own files: seven weights, each a file of its own. It has no SemiBold: a text of that weight is drawn in a neighbouring one. Its licence, the SIL Open Font License 1.1, is beside the files: `files/licenses/poppins_ofl.txt`. The marks of a Mac's keys are drawn in the library's fallback.

### The dark the reader chose

The reader chooses the dark or the light theme in the app's own setting: the preset's set in that dark is taken with `rememberPantrixColors(Harbor, darkTheme = dark)` and given to the theme. Whatever the system's mode says, the part is as dark as was chosen.

The outermost theme, at the app's root, makes what the system draws follow that choice too: Android's bars' icons, iOS's status bar, keyboard and controls. The theme here stands inside, and leaves the bars alone. An app that paints its bars itself gives its outermost theme `followSystemBars = false`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.theme.preset.DesignPreset
import com.pantrixui.foundation.token.color.Dark
import com.pantrixui.foundation.token.color.Light
import com.pantrixui.foundation.token.color.PantrixColor
import com.pantrixui.foundation.token.color.PantrixColors
import com.pantrixui.foundation.token.color.PantrixPalette
import com.pantrixui.foundation.token.color.rememberPantrixColors
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ComponentTokenOverrides
import com.pantrixui.foundation.token.typography.PantrixTypeface
import com.pantrixui.foundation.token.typography.PantrixTypography
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily

var dark by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = dark,
    onCheckedChange = { dark = it },
    label = "Dark theme",
    tagKey = "chosen_dark"
)
PantrixTheme(preset = Harbor, colors = rememberPantrixColors(Harbor, darkTheme = dark)) {
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        Column(
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = if (dark) "Dark" else "Light", style = PantrixTheme.typography.title)
            Controls(tagKey = "chosen")
        }
    }
}

private object Harbor : DesignPreset {
    override val name: String = "Harbor"

    override fun colors(dark: Boolean): PantrixColors {
        val teal = PantrixPalette.Teal
        return if (dark) {
            PantrixColors.Dark.copy(
                primary = PantrixColor(
                    color = teal.shade400,
                    onColor = teal.shade950,
                    container = teal.shade900,
                    onContainer = teal.shade100
                )
            )
        } else {
            PantrixColors.Light.copy(
                primary = PantrixColor(
                    color = teal.shade700,
                    onColor = Color.White,
                    container = teal.shade100,
                    onContainer = teal.shade900
                )
            )
        }
    }

    @Composable
    override fun typography(): PantrixTypography {
        val text = rememberPantrixFontFamily(PantrixTypeface.Default)
        val headings = rememberPantrixFontFamily(Poppins)
        return remember(text, headings) { buildPantrixTypography(fontFamily = text, headingFontFamily = headings) }
    }

    @Composable
    override fun shapes(): PantrixShapes = remember {
        PantrixShapes(md = RoundedCornerShape(4.dp), lg = RoundedCornerShape(6.dp), xl = RoundedCornerShape(8.dp))
    }

    override fun componentOverrides(): ComponentTokenOverrides =
        ComponentTokenOverrides(shapes = mapOf("button.shape" to ShapeRole.Small))
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Confirm", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Cancel", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filter", onClick = {}, tagKey = "filter_$tagKey")
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `Poppins`: Poppins from the app's own files: seven weights, each a file of its own. It has no SemiBold: a text of that weight is drawn in a neighbouring one. Its licence, the SIL Open Font License 1.1, is beside the files: `files/licenses/poppins_ofl.txt`. The marks of a Mac's keys are drawn in the library's fallback.

### The theme's locals

Each of the theme's values is a `CompositionLocal`: `PantrixTheme.spacing` reads `LocalPantrixSpacing`, `PantrixTheme.colors` reads `LocalPantrixColors`. The lines read the same values straight from the locals. A preview or a test can also give one local on its own: the button underneath was drawn with `LocalPantrixShapes provides PantrixShapes.Pill`. In an app, the way to change a section is still a nested theme: a theme fits the values it gives to each other and scales the spacing by the density; a single local does not.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.LocalPantrixPlatform
import com.pantrixui.foundation.adaptive.LocalPantrixLayouts
import com.pantrixui.foundation.l10n.LocalPantrixLocale
import com.pantrixui.foundation.l10n.LocalPantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.LocalPantrixColors
import com.pantrixui.foundation.token.density.LocalPantrixDensity
import com.pantrixui.foundation.token.elevation.LocalPantrixElevation
import com.pantrixui.foundation.token.motion.LocalPantrixMotion
import com.pantrixui.foundation.token.shape.LocalPantrixShapes
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.spacing.LocalPantrixSpacing
import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle
import com.pantrixui.foundation.token.typography.LocalPantrixTypography

localLines().forEach { line ->
    PantrixText(text = line, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
}
CompositionLocalProvider(LocalPantrixShapes provides PantrixShapes.Pill) {
    PantrixButton(
        text = "Only its shapes are pills",
        onClick = {},
        variant = ButtonVariant.Outline,
        tagKey = "pill_preview"
    )
}

@Composable
private fun localLines(): List<String> {
    val sameColors = LocalPantrixColors.current == PantrixTheme.colors
    return listOf(
        "LocalPantrixColors · ${if (sameColors) "the same as" else "not"} PantrixTheme.colors",
        "LocalPantrixTypography · body ${LocalPantrixTypography.current.body.fontSize.value.toInt()}sp",
        "LocalPantrixTextStyle · ${LocalPantrixTextStyle.current.fontSize.value.toInt()}sp",
        "LocalPantrixSpacing · lg ${LocalPantrixSpacing.current.lg.value.toInt()}dp",
        "LocalPantrixElevation · lg ${LocalPantrixElevation.current.lg.value.toInt()}dp",
        "LocalPantrixMotion · normal ${LocalPantrixMotion.current.normal} ms",
        "LocalPantrixDensity · ${LocalPantrixDensity.current.name}",
        "LocalPantrixPlatform · ${LocalPantrixPlatform.current.type.name}",
        "LocalPantrixLayouts · compact ${LocalPantrixLayouts.current.compact.margin.value.toInt()}dp",
        "LocalPantrixLocale · ${LocalPantrixLocale.current.languageTag}",
        "LocalPantrixStrings · ${LocalPantrixStrings.current.close}"
    )
}
```

## API

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixTheme(
    preset: DesignPreset,
    colors: PantrixColors = rememberPantrixColors(preset, darkTheme = inheritedDarkThemeOrSystem()),
    typography: PantrixTypography = preset.typography(),
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = preset.shapes(),
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides = preset.componentOverrides(),
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

The theme built on `preset`, a brand's look in one place: light or dark as the system is.

A call lands here by naming a preset. Every other call, `PantrixTheme { … }` among them, is the form that takes `PantrixColors`.

The theme also tells its content the window it is drawn in, `PantrixTheme.window`: the one Compose reports unless `window` gives another, and inside another theme that theme's. `layouts` are the page's margin and gutter for each class of that window; `PantrixTheme.layout` gives the ones of the class it is in.

**Inside another theme** it takes from that one whatever it is not given, as the form that takes `PantrixColors` does. The preset's own, its colours, type, shapes and component overrides, are the preset's, and it is as dark as the theme around it: the preset's dark colours in a dark theme, whatever the system is set to.

Parameters:

- `preset: DesignPreset`
- `colors: PantrixColors`: the colour roles: `preset`'s, as dark as the theme around it, or as the system where there is none. `inheritedDarkThemeOrSystem`: Whether the theme around this call is dark, and whether the system is where no theme is around it: a theme inside a dark one is dark unless it is told otherwise, whatever the system is set to.
- `typography: PantrixTypography`: the type scale: `preset`'s.
- `density: PantrixDensity`: the interface density, which the components' air is scaled by: an enclosing theme's, or `Comfortable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `shapes: PantrixShapes`: the corner radii: `preset`'s.
- `motion: PantrixMotion`: the durations and easings: an enclosing theme's, or Pantrix's own, with every duration at nought while the system asks for less motion. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `spacing: PantrixSpacing`: the spacing scale, before the density scales it: what an enclosing theme was given, or Pantrix's own. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `elevation: PantrixElevation`: the depths of the shadows: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `platform: PantrixPlatform`: the platform whose conventions the components follow, its touch target, its focus ring and its presets: what an enclosing theme was given, or the one the app runs on, as the system reports it. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `window: PantrixWindow`: `inheritedPantrixWindow`: The window a theme or a provider around this call has given, or null when there is none: what a theme inside another takes when it is given no window of its own, so that a window pinned by a test is not lost in it.
- `layouts: PantrixLayouts`: `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `componentOverrides: ComponentTokenOverrides`: the brand's token overrides of single components: `preset`'s.
- `styles: PantrixStyles`: the style overrides the components take, on top of their presets: an enclosing theme's, or none. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `locale: PantrixLocale`: the language the components speak and lay out in: an enclosing theme's, or the system's. Its `layoutDirection` alone is the direction everything inside the theme is laid out in, over a `LocalLayoutDirection` provided around the theme: a layout from the right is asked for with a locale written from the right, such as `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `strings: PantrixStrings`: the components' own words: an enclosing theme's where it speaks `locale`'s language, or Pantrix's pack for that language. `inheritedStringsOr`: The strings of the theme around this call where its language is `locale`, and `locale`'s own where it is another or no theme is around it: strings an app gave its theme are kept inside it, and a theme given another language takes that language's.
- `testTagPolicy: TestTagPolicy`: whether the components put their automation tags into the semantics tree: an enclosing theme's, or `TestTagPolicy.Stable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `analytics: PantrixAnalytics`: where the components report what the user does with them: an enclosing theme's, or nowhere (`PantrixAnalytics.NoOp`). `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `haptics: PantrixHaptics`: what plays the components' haptics: an enclosing theme's, or the device's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `diagnostics: PantrixDiagnostics`: where the checks of the running screen send their findings, colours that do not read and touch targets too small among them: an enclosing theme's, or off. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `followSystemBars: Boolean`: whether the outermost theme makes what the system draws follow its colours rather than the system's dark mode: Android's bars' icons, iOS's status bar, keyboard and controls. A theme inside another changes nothing of it. An app that sets them itself, or whose bars are coloured, turns it off. docs/guide/system-bars/SYSTEM_BARS_GUIDE.md has the whole of it.
- `content: @Composable () -> Unit`: what the theme is in effect for.

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixTheme(
    darkTheme: Boolean = inheritedDarkThemeOrSystem(),
    colors: PantrixColors = inheritedColorsOrOwn(darkTheme),
    typography: PantrixTypography = inheritedOr(LocalPantrixTypography) { rememberPantrixTypography() },
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = inheritedOr(LocalPantrixShapes) { rememberPantrixShapes() },
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides =
        inheritedOr(LocalComponentTokenOverrides) { ComponentTokenOverrides.None },
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

The theme without a preset, in Pantrix's own look: light or dark as `darkTheme` says, and as the system is when it is left out.

`PantrixTheme { … }` lands here, as does every call that names no preset. The form that takes a `DesignPreset` has no default for its preset, so no call fits both.

`window` and `layouts` are as in the form that takes a `DesignPreset`.

**Inside another theme** it takes from that one whatever it is not given: a dark part of a light screen is `PantrixTheme(darkTheme = true) { … }`, and nothing but the colours changes in it. The platform the app told its theme, the density, the language and its strings, the styles, the place events are reported to and the one findings go to are the outer theme's inside it, and what it is given is its own. It is as dark as the theme around it unless `darkTheme` says otherwise, and keeps that theme's colours while it is. Told to be dark in a light theme, it takes the dark colours of the preset that theme's look is built on, Pantrix's own dark set where it is built on none, or the `colors` it is given. A theme draws no ground: the dark part's own is a surface or a card inside it. Nor is it a layout: what stands in it is laid out by what the theme stands in, as if the theme were not there.

Parameters:

- `darkTheme: Boolean`: `inheritedDarkThemeOrSystem`: Whether the theme around this call is dark, and whether the system is where no theme is around it: a theme inside a dark one is dark unless it is told otherwise, whatever the system is set to.
- `colors: PantrixColors`: `inheritedColorsOrOwn`: The colours of the theme around this call where they are as dark as `darkTheme` asks. A theme inside another keeps its colours, a brand's among them, unless it is told to be dark in a light one or light in a dark one.

  Told so, it takes the set of that kind from the preset the look around it is built on: a dark part of a brand's light theme is in the brand's dark colours. Where the look is built on no preset, and where no theme is around the call, the set is Pantrix's own.
- `typography: PantrixTypography`: the type scale: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `density: PantrixDensity`: the interface density, which the components' air is scaled by: an enclosing theme's, or `Comfortable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `shapes: PantrixShapes`: the corner radii: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `motion: PantrixMotion`: the durations and easings: an enclosing theme's, or Pantrix's own, with every duration at nought while the system asks for less motion. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `spacing: PantrixSpacing`: the spacing scale, before the density scales it: what an enclosing theme was given, or Pantrix's own. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `elevation: PantrixElevation`: the depths of the shadows: an enclosing theme's, or Pantrix's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `platform: PantrixPlatform`: the platform whose conventions the components follow, its touch target, its focus ring and its presets: what an enclosing theme was given, or the one the app runs on, as the system reports it. `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `window: PantrixWindow`: `inheritedPantrixWindow`: The window a theme or a provider around this call has given, or null when there is none: what a theme inside another takes when it is given no window of its own, so that a window pinned by a test is not lost in it.
- `layouts: PantrixLayouts`: `asGivenOr`: What the theme around this call was given for the value named first, before that theme scaled it; where no theme is around the call, what the braces give. It is the default of the spacing, the layout measures and the platform, which the theme inside scales by its own density.
- `componentOverrides: ComponentTokenOverrides`: the brand's token overrides of single components: an enclosing theme's, or none. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `styles: PantrixStyles`: the style overrides the components take, on top of their presets: an enclosing theme's, or none. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `locale: PantrixLocale`: the language the components speak and lay out in: an enclosing theme's, or the system's. Its `layoutDirection` alone is the direction everything inside the theme is laid out in, over a `LocalLayoutDirection` provided around the theme: a layout from the right is asked for with a locale written from the right, such as `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `strings: PantrixStrings`: the components' own words: an enclosing theme's where it speaks `locale`'s language, or Pantrix's pack for that language. `inheritedStringsOr`: The strings of the theme around this call where its language is `locale`, and `locale`'s own where it is another or no theme is around it: strings an app gave its theme are kept inside it, and a theme given another language takes that language's.
- `testTagPolicy: TestTagPolicy`: whether the components put their automation tags into the semantics tree: an enclosing theme's, or `TestTagPolicy.Stable`. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `analytics: PantrixAnalytics`: where the components report what the user does with them: an enclosing theme's, or nowhere (`PantrixAnalytics.NoOp`). `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `haptics: PantrixHaptics`: what plays the components' haptics: an enclosing theme's, or the device's own. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `diagnostics: PantrixDiagnostics`: where the checks of the running screen send their findings, colours that do not read and touch targets too small among them: an enclosing theme's, or off. `inheritedOr`: The value the theme around this call has, read from the local named first; where no theme is around the call, what the braces give. It is the default of a value a theme hands on as it was given: a theme inside another takes it from the one around it, and a theme that stands alone makes its own.
- `followSystemBars: Boolean`: whether the outermost theme makes what the system draws follow its colours rather than the system's dark mode: Android's bars' icons, iOS's status bar, keyboard and controls. A theme inside another changes nothing of it. An app that sets them itself, or whose bars are coloured, turns it off. docs/guide/system-bars/SYSTEM_BARS_GUIDE.md has the whole of it.
- `content: @Composable () -> Unit`: what the theme is in effect for.

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, from `com.pantrixui:foundation`

```kotlin
data object PantrixTheme
```

The theme's values where a composable reads them, `PantrixTheme.colors.primary` or `PantrixTheme.spacing.md`: each is what the nearest enclosing `PantrixTheme { … }` provides.

Members:

- `colors: PantrixColors`: The colour roles in effect: `PantrixTheme.colors.primary.color`, `PantrixTheme.colors.surface`.
- `typography: PantrixTypography`: The type scale in effect: `PantrixTheme.typography.body`.
- `density: PantrixDensity`: The interface density in effect, which the components' air is scaled by.
- `shapes: PantrixShapes`: The corner radii in effect: `PantrixTheme.shapes.md`.
- `motion: PantrixMotion`: The durations and easings in effect, every duration at nought while the system asks for less motion.
- `spacing: PantrixSpacing`: The spacing scale in effect, scaled by the density: `PantrixTheme.spacing.md`.
- `elevation: PantrixElevation`: The depths of the shadows in effect.
- `platform: PantrixPlatform`: The platform whose conventions are in effect: its touch target, its focus ring and its components' presets.
- `window: PantrixWindow`: The window the content is drawn in: the class of its width and of its height, its size and how its device is folded. A layout chooses by it, `PantrixTheme.window.widthClass >= WindowWidthClass.Expanded`, and is composed again when the class changes.
- `layout: PantrixLayout`: The measures a page is laid out by in the window in effect: the margin at its sides and the gutter between its columns, as the class of the window's width has them. A phone's margin is 16dp and a desktop window's 32dp.

  ```kotlin
  Column(Modifier.padding(horizontal = PantrixTheme.layout.margin)) { … }
  ```

  The reader is composed again when the class changes, and not as the window is resized within it. The theme's `layouts` are where the measures come from, and its density scales them.
- `@Composable fun layout(window: PantrixWindow): PantrixLayout`: The measures for `window` and not for the window in effect: what a component asks of its own box, whose room is not the window's.

  ```kotlin
  BoxWithPantrixWindow(modifier) { box ->
      Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout(box).gutter)) { … }
  }
  ```
- `locale: PantrixLocale`: The language in effect: the one the components speak and lay out in.
- `strings: PantrixStrings`: The components' own words in effect, in `locale`'s language.
- `analytics: PantrixAnalytics`: Where the components report what the user does with them.
- `haptics: PantrixHaptics`: What plays the components' haptics.
- `isUnderModal: Boolean`: Whether a modal overlay is shown over the content this is read in: a dialog, a sheet, or an app's own in a `PantrixModalLayer`. What lies under one takes no key and no click until it closes, and should not look as if it did. The focus stays where it was under it, so that it is there again when the overlay closes, and no focus ring is drawn there meanwhile.

  The content of an overlay is not under it, and is under one opened after it.
- `componentOverrides: ComponentTokenOverrides`: The brand's component overrides in effect. A theme inside this one keeps them unless it is given others.
- `styles: PantrixStyles`: The style overrides in effect: the theme's `styles` and every enclosing `ProvidePantrixStyles`'.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>): S`: `key`'s style on the active platform, with the brand's, the theme's and every enclosing `ProvidePantrixStyles`' overrides applied: `PantrixTheme.style(ButtonStyle).pressedScale`.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>, override: S?): S`: `key`'s style with `override` on top of every other layer: what a component that takes its style as a parameter draws with, as `PantrixButton(style = ButtonStyle(…))` does.

  The override goes where a `ProvidePantrixStyles` around the call would put it, over the brand's, the theme's and every enclosing one's, and it comes before the density: a height given here is scaled like any other. It holds on every platform. Only the fields it sets change, and `null` changes nothing.

### PantrixDensity

`import com.pantrixui.foundation.token.density.PantrixDensity`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixDensity(public val scale: Float)
```

Interface density: `Comfortable` unless the app gives `PantrixTheme` another. `Compact` suits pointer input, since a pointer can hit smaller targets, and `Spacious` a reader who wants more room around what is touched.

Parameters:

- `scale: Float`: What the density multiplies a style's air by: its heights, paddings, gaps and margins. Strokes, borders and icon sizes stay as they are.

Entries:

- `Compact`: Less air, 0.85 of it: for pointer input, which hits smaller targets. A touch target never shrinks below the platform's.
- `Comfortable`: The default: every style as it is.
- `Spacious`: More air, 1.15 of it, and touch targets as much larger.

### PantrixLocale

`import com.pantrixui.foundation.l10n.PantrixLocale`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLocale(
    public val languageTag: String,
    public val layoutDirection: LayoutDirection,
    public val firstDayOfWeek: Int = firstDayOfWeekOf(languageTag)
)
```

A language, the direction its script runs in, and the day its calendars start a week on. `forLanguageTag` works the direction out from the tag.

Parameters:

- `languageTag: String`: The language as a BCP 47 tag, e.g. `tr`, `en-GB`, `ar`.
- `layoutDirection: LayoutDirection`: The direction the language's script runs in: right to left for Arabic.
- `firstDayOfWeek: Int`: The day a week starts on in the language's calendars, as ISO 8601 numbers the days: 1 is Monday and 7 is Sunday. Unless given, Monday in Turkish, Saturday in Arabic, and Sunday in English and in every other language. A date picker that is given no first day of its own starts its weeks on this one. `firstDayOfWeekOf`: The day `languageTag`'s calendars start a week on: Monday in Turkish, Saturday in Arabic, Sunday otherwise.

Members:

- `language: String`: The primary subtag, lower-cased: `en-GB` -> `en`.

On the type:

- `PantrixLocale.English: PantrixLocale`: English, written from left to right, its weeks starting on Sunday.
- `PantrixLocale.Turkish: PantrixLocale`: Turkish, written from left to right, its weeks starting on Monday.
- `PantrixLocale.Arabic: PantrixLocale`: Arabic, written from right to left, its weeks starting on Saturday.
- `PantrixLocale.forLanguageTag(tag: String): PantrixLocale`: Builds a locale from a tag, inferring direction.

  `tag`: the language as a BCP 47 tag, `tr`, `en-GB` or `ar`: its primary subtag decides the direction and the day a week starts on.

### PantrixAnalytics

`import com.pantrixui.foundation.analytics.PantrixAnalytics`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixAnalytics
```

Sink for `PantrixUiEvent`.

Defaults to a no-op, so the cost of components emitting events unconditionally is one virtual call into an empty body. Products wire their own SDK in through `PantrixTheme(analytics = ...)`; Pantrix itself depends on no analytics vendor.

A component built on a Pantrix control, as a field of dates on two text fields, hears that control's events beside its own, and one press is counted twice. It gives the control a sink of its own with `LocalPantrixAnalytics`, which drops what the component reports itself and hands the rest on under the component's name: `PantrixPageSize` does so with the select it is built on.

Members:

- `fun track(event: PantrixUiEvent)`: Called with each `event` a component emits, as it happens, on the UI thread. A sink hands the event on and returns: what takes time, sending above all, is done off this thread.

On the type:

- `PantrixAnalytics.NoOp: PantrixAnalytics`: The sink that drops every event: where a theme reports to unless it is given one.

### PantrixUiEvent

`import com.pantrixui.foundation.analytics.PantrixUiEvent`, from `com.pantrixui:foundation`

```kotlin
data class PantrixUiEvent(
    public val component: String,
    public val action: String,
    public val testTag: String?,
    public val screen: String?,
    public val props: Map<String, String> = emptyMap()
)
```

A UI interaction, described by identity rather than content: which component it was, what happened, and on which screen.

**Text the user typed or read never goes in here.** A field reports that it took the focus or was cleared, never what it holds, and a test of every component that takes text holds that. A value out of a closed set does go in: a selection is reported by the key of what was selected, a page by its number. Some of `props` are the app's own keys, and an app whose keys are personal data sends that data with them: `docs/guide/analytics/ANALYTICS_GUIDE.md` names the components that report them.

Parameters:

- `component: String`: Component name, e.g. `Button`.
- `action: String`: What happened, in the component's own word: `click`, `toggle`, `select`, `open`, `dismiss`, `focus`, `expand`, and others the guide lists by component.
- `testTag: String?`: The component's automation tag, the same identity tests bind to, whatever the `TestTagPolicy`: built from its `tagKey`, or, where it has none, from the place it was called from, which changes with the code around it. Null for an event an app reports without one.
- `screen: String?`: The enclosing `TestScope` chain, e.g. `Checkout.PaymentForm`, or null outside one.
- `props: Map<String, String>`: The event's values, of three kinds: Pantrix's own words and yes-or-no values, such as `variant`, `via` and `state`; numbers, such as `index`, `page` and `count`; and keys the app gave the component, such as `row`, `option` and `destination`.

### DesignPreset

`import com.pantrixui.foundation.theme.preset.DesignPreset`, from `com.pantrixui:foundation`

```kotlin
interface DesignPreset
```

A brand's look in one place: its colours, type, shapes and component overrides. `PantrixTheme(preset = …)` builds a theme from it.

Members:

- `name: String`: The preset's name, as a picker or a log shows it.
- `fun colors(dark: Boolean = false): PantrixColors`: The colours: the dark set when `dark`.
- `@Composable fun typography(): PantrixTypography`: The type scale, in the brand's fonts.
- `@Composable fun shapes(): PantrixShapes`: The shape scale.
- `fun componentOverrides(): ComponentTokenOverrides`: Each component's token overrides; none unless the brand has some.
