# Density

The interface density: how much air a screen has. The density multiplies the components' heights, paddings and gaps, the theme's spacing scale and the page margins together; lines, borders, icons and shadows stay as they are.

## Features

- **Three densities.** `Compact` 0.85, `Comfortable` 1, `Spacious` 1.15 times (`scale`). The default is `Comfortable` (`rememberPantrixDensity()`); a screen used with a mouse can take the compact density.
- **A whole theme.** `PantrixTheme(density = …)` gives the density to everything in it: a settings screen or a data table can be compact, a welcome screen spacious. `PantrixTheme.density` is the nearest theme's.
- **Touch target.** The spacious density enlarges the touch target; the compact density does not shrink it.
- **Your own measure.** The app's own measure can be multiplied by the density too: `scaledForDensity(scale)`.

## Examples

### Three densities

The same form at three densities. Choose a density: the inner theme gives it to the text field, the checkbox, the buttons and the space between them together. Text and icons stay the same size; what changes is the air between them.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity
import kotlin.math.roundToInt

var density by remember { mutableStateOf(PantrixDensity.Compact) }
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixSegmentButton(
        options = DENSITIES,
        selected = density,
        onSelect = { density = it },
        tagKey = "density"
    )
    PantrixTheme(density = density) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
            PantrixText(
                text = "${PantrixTheme.density.name}: ${(PantrixTheme.density.scale * 100).roundToInt()}% of the measures",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixTextField(
                state = rememberTextFieldState(),
                modifier = Modifier.fillMaxWidth(),
                label = "E-mail",
                tagKey = "density_email"
            )
            PantrixCheckbox(checked = true, onCheckedChange = {}, label = "Remember me", tagKey = "density_remember")
            Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                PantrixButton(text = "Sign in", onClick = {}, tagKey = "density_sign_in")
                PantrixButton(
                    text = "Cancel",
                    onClick = {},
                    variant = ButtonVariant.Outline,
                    tagKey = "density_cancel"
                )
            }
        }
    }
}

private val DENSITIES = listOf(
    SegmentOption(PantrixDensity.Compact, "Compact", tagKey = "compact"),
    SegmentOption(PantrixDensity.Comfortable, "Comfortable", tagKey = "comfortable"),
    SegmentOption(PantrixDensity.Spacious, "Spacious", tagKey = "spacious")
)
```

### Your own measure too

The app's own row follows the density too: its height is 56dp, and `scaledForDensity(PantrixTheme.density.scale)` multiplies it by the nearest theme's density. The middle theme is at the library's default (`rememberPantrixDensity()`); the left one is compact, the right one spacious.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity
import com.pantrixui.foundation.token.density.rememberPantrixDensity
import com.pantrixui.foundation.token.style.scaledForDensity

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTheme(density = PantrixDensity.Compact) { OwnRow() }
    PantrixTheme(density = rememberPantrixDensity()) { OwnRow() }
    PantrixTheme(density = PantrixDensity.Spacious) { OwnRow() }
}

@Composable
private fun OwnRow() {
    val height = 56.dp.scaledForDensity(PantrixTheme.density.scale)
    Box(
        modifier = Modifier
            .width(120.dp)
            .height(height)
            .background(PantrixTheme.colors.primary.container, PantrixTheme.shapes.md)
            .padding(horizontal = PantrixTheme.spacing.sm),
        contentAlignment = Alignment.CenterStart
    ) {
        PantrixText(
            text = "${PantrixTheme.density.name}\n${height.value.toInt()}dp",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.primary.onContainer
        )
    }
}
```

## API

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

### rememberPantrixDensity

`import com.pantrixui.foundation.token.density.rememberPantrixDensity`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixDensity(): PantrixDensity
```

The default density, `PantrixDensity.Comfortable`.

### Dp.scaledForDensity

`import com.pantrixui.foundation.token.style.scaledForDensity`, from `com.pantrixui:foundation`

```kotlin
fun Dp.scaledForDensity(scale: Float): Dp
```

A dimension scaled by the interface density.

`Dp.Unspecified` is NaN, and NaN times anything is NaN — so this would work without the check. It is here because "unspecified stays unspecified" is the rule that keeps a partial style partial, and a rule that only holds by accident is a rule waiting to stop holding.

Parameters:

- `scale: Float`: the interface density's scale, `PantrixDensity.scale`.

### LocalPantrixDensity

`import com.pantrixui.foundation.token.density.LocalPantrixDensity`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixDensity: ProvidableCompositionLocal<PantrixDensity>
```

The interface density in effect, which `PantrixTheme` provides: what `PantrixTheme.density` reads. Outside a theme, `PantrixDensity.Comfortable`.
