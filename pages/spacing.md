# Spacing

The spacing scale: a screen's gaps and paddings are built from these seven steps. The components' own spacing is in their styles; the scale is for the screen's own layout: a card's padding, the gap between two lines, a column's margin.

## Features

- **Steps.** `none` 0, `xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24, `xxl` 32dp. `PantrixTheme.spacing` is the nearest theme's scale.
- **Density.** The theme multiplies the scale by the density (`scaled`): at the compact density each step is 0.85 times, at the spacious density 1.15 times; `none` stays nought.
- **Your own scale.** `PantrixTheme(spacing = PantrixSpacing(…))` changes some of the steps or all of them; a step not given keeps its default. `rememberPantrixSpacing()` is the library's own scale.

## Examples

### Seven steps

The scale's seven steps, as the theme gives them: each bar is a step wide. A density scales the steps; on the "Density" page the same bars grow shorter or longer inside a compact or a spacious theme.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.spacing.PantrixSpacing
import kotlin.math.roundToInt

val spacing = PantrixTheme.spacing
Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
    spacingSteps(spacing).forEach { (name, step) ->
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(spacing.md)
        ) {
            PantrixText(
                text = "$name · ${step.written()}",
                modifier = Modifier.width(88.dp),
                style = PantrixTheme.typography.footnote
            )
            Box(
                Modifier
                    .size(width = step, height = 12.dp)
                    .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.xs)
            )
        }
    }
}

private fun spacingSteps(spacing: PantrixSpacing): List<Pair<String, Dp>> = listOf(
    "none" to spacing.none,
    "xs" to spacing.xs,
    "sm" to spacing.sm,
    "md" to spacing.md,
    "lg" to spacing.lg,
    "xl" to spacing.xl,
    "xxl" to spacing.xxl
)

private fun Dp.written(): String {
    val tenths = (value * 10).roundToInt()
    return if (tenths % 10 == 0) "${tenths / 10}dp" else "${tenths / 10}.${tenths % 10}dp"
}
```

### Your own scale

The same card on two scales. The card itself reads only the scale's steps, by name: its padding is `lg`, the gap between its lines `sm`, the space before its button `md`. The left one is on the library's own scale (`rememberPantrixSpacing()`); the theme on the right changes two steps, `PantrixSpacing(sm = 12.dp, lg = 24.dp)`, and the card gets roomier without doing anything else.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.spacing.PantrixSpacing
import com.pantrixui.foundation.token.spacing.rememberPantrixSpacing
import kotlin.math.roundToInt

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixTheme(spacing = rememberPantrixSpacing()) {
        SpacedCard(title = "The library's scale", tagKey = "library_scale")
    }
    PantrixTheme(spacing = PantrixSpacing(sm = 12.dp, lg = 24.dp)) {
        SpacedCard(title = "Your own scale", tagKey = "own_scale")
    }
}

@Composable
private fun SpacedCard(
    title: String,
    tagKey: String
) {
    val spacing = PantrixTheme.spacing
    PantrixSurface(modifier = Modifier.width(220.dp), border = PantrixTheme.colors.divider) {
        Column(
            modifier = Modifier.padding(spacing.lg),
            verticalArrangement = Arrangement.spacedBy(spacing.sm)
        ) {
            PantrixText(text = title, style = PantrixTheme.typography.title)
            PantrixText(
                text = "Padding ${spacing.lg.written()}, line gap ${spacing.sm.written()}",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixButton(
                text = "Open",
                onClick = {},
                modifier = Modifier.padding(top = spacing.md),
                size = ButtonSize.Small,
                tagKey = tagKey
            )
        }
    }
}

private fun Dp.written(): String {
    val tenths = (value * 10).roundToInt()
    return if (tenths % 10 == 0) "${tenths / 10}dp" else "${tenths / 10}.${tenths % 10}dp"
}
```

## API

### PantrixSpacing

`import com.pantrixui.foundation.token.spacing.PantrixSpacing`, from `com.pantrixui:foundation`

```kotlin
data class PantrixSpacing(
    val none: Dp = 0.dp,
    val xs: Dp = 4.dp,
    val sm: Dp = 8.dp,
    val md: Dp = 12.dp,
    val lg: Dp = 16.dp,
    val xl: Dp = 24.dp,
    val xxl: Dp = 32.dp
)
```

The spacing scale: the gaps and paddings layouts are built from. `scaled` applies the interface density to every step but `none`.

Parameters:

- `none: Dp`: No space.
- `xs: Dp`: 4dp by default.
- `sm: Dp`: 8dp by default: the gap between a button's icon and its label.
- `md: Dp`: 12dp by default.
- `lg: Dp`: 16dp by default.
- `xl: Dp`: 24dp by default.
- `xxl: Dp`: 32dp by default, the widest step.

Members:

- `fun scaled(factor: Float): PantrixSpacing`: Density applies here, not at each call site, so one switch rescales the whole system.

  `factor`: the interface density's scale: each step is multiplied by it.

### rememberPantrixSpacing

`import com.pantrixui.foundation.token.spacing.rememberPantrixSpacing`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixSpacing(): PantrixSpacing
```

Pantrix's spacing scale.

### LocalPantrixSpacing

`import com.pantrixui.foundation.token.spacing.LocalPantrixSpacing`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixSpacing: ProvidableCompositionLocal<PantrixSpacing>
```

The spacing scale in effect, which `PantrixTheme` provides: what `PantrixTheme.spacing` reads. Outside a theme, Pantrix's own.
