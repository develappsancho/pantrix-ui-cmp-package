# Elevation

The elevation scale: how far a surface stands out from what is under it, by its shadow. A card, a menu, a dialog stands at a step of this scale; the app's own surface takes its step from here too.

## Features

- **Steps.** `none` 0, `sm` 1, `md` 2, `lg` 4, `xl` 8dp. `PantrixTheme.elevation` is the nearest theme's scale.
- **Your own scale.** `PantrixTheme(elevation = PantrixElevation(…))` changes the steps; a step not given keeps its default. `rememberPantrixElevation()` is the library's own scale.
- **Density.** Density does not scale shadows: a compact screen is a screen with less air, not one with shallower shadows.

## Examples

### Five steps

The scale's five steps: each square is a `PantrixSurface` at one step's elevation.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val elevation = PantrixTheme.elevation
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    ElevationSwatch("none", elevation.none)
    ElevationSwatch("sm", elevation.sm)
    ElevationSwatch("md", elevation.md)
    ElevationSwatch("lg", elevation.lg)
    ElevationSwatch("xl", elevation.xl)
}

@Composable
private fun ElevationSwatch(
    name: String,
    elevation: Dp
) {
    PantrixSurface(modifier = Modifier.size(88.dp), elevation = elevation) {
        PantrixText(
            text = "$name\n${elevation.value.toInt()}dp",
            modifier = Modifier.align(Alignment.Center),
            style = PantrixTheme.typography.footnote
        )
    }
}
```

### Your own scale

The same two surfaces on two scales. The surfaces read their elevation by name, `md` and `xl`. Those on the left are on the library's own scale (`rememberPantrixElevation()`); the theme on the right doubles the steps, and the surfaces stand out more.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.elevation.PantrixElevation
import com.pantrixui.foundation.token.elevation.rememberPantrixElevation

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixTheme(elevation = rememberPantrixElevation()) {
        ElevationSwatch("md", PantrixTheme.elevation.md)
        ElevationSwatch("xl", PantrixTheme.elevation.xl)
    }
    PantrixTheme(elevation = PantrixElevation(sm = 2.dp, md = 4.dp, lg = 8.dp, xl = 16.dp)) {
        ElevationSwatch("md", PantrixTheme.elevation.md)
        ElevationSwatch("xl", PantrixTheme.elevation.xl)
    }
}

@Composable
private fun ElevationSwatch(
    name: String,
    elevation: Dp
) {
    PantrixSurface(modifier = Modifier.size(88.dp), elevation = elevation) {
        PantrixText(
            text = "$name\n${elevation.value.toInt()}dp",
            modifier = Modifier.align(Alignment.Center),
            style = PantrixTheme.typography.footnote
        )
    }
}
```

## API

### PantrixElevation

`import com.pantrixui.foundation.token.elevation.PantrixElevation`, from `com.pantrixui:foundation`

```kotlin
data class PantrixElevation(
    val none: Dp = 0.dp,
    val sm: Dp = 1.dp,
    val md: Dp = 2.dp,
    val lg: Dp = 4.dp,
    val xl: Dp = 8.dp
)
```

The elevation scale: how far a surface stands out from what is under it.

Parameters:

- `none: Dp`: Flat on what is under it.
- `sm: Dp`: 1dp by default.
- `md: Dp`: 2dp by default.
- `lg: Dp`: 4dp by default.
- `xl: Dp`: 8dp by default, the highest step.

### rememberPantrixElevation

`import com.pantrixui.foundation.token.elevation.rememberPantrixElevation`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixElevation(): PantrixElevation
```

Pantrix's elevation scale.

### LocalPantrixElevation

`import com.pantrixui.foundation.token.elevation.LocalPantrixElevation`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixElevation: ProvidableCompositionLocal<PantrixElevation>
```

The depths of the shadows in effect, which `PantrixTheme` provides: what `PantrixTheme.elevation` reads. Outside a theme, Pantrix's own.
