# Shapes

The shape scale: how round the corners are, from square to fully round. A component's style names not a shape but a step of the scale (`ShapeRole`); how round the step is, the brand gives.

## Features

- **Steps.** `xs` 2, `sm` 4, `md` 8, `lg` 12, `xl` 16dp; the two ends, `none` (square) and `full` (fully round), are the same on every brand. `PantrixTheme.shapes` is the nearest theme's scale.
- **Ready scales.** `PantrixShapes.Sharp` squares every step off, `PantrixShapes.Pill` makes every step fully round. `rememberPantrixShapes()` is the library's own scale.
- **Role and shape.** `ShapeRole` is a step of the scale; `ShapeSpec.Fixed` is a single shape off the scale. Both are a `ShapeSpec`, and `toShape()` turns it into a `Shape` on the nearest theme's scale.

## Examples

### The scale

The scale's seven shapes, as the theme gives them: the brand's five steps between the two ends.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val shapes = PantrixTheme.shapes
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    ShapeSwatch("none", shapes.none)
    ShapeSwatch("xs", shapes.xs)
    ShapeSwatch("sm", shapes.sm)
    ShapeSwatch("md", shapes.md)
    ShapeSwatch("lg", shapes.lg)
    ShapeSwatch("xl", shapes.xl)
    ShapeSwatch("full", shapes.full)
}

@Composable
private fun ShapeSwatch(
    name: String,
    shape: Shape
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
    ) {
        Box(Modifier.size(56.dp).background(PantrixTheme.colors.primary.container, shape))
        PantrixText(text = name, style = PantrixTheme.typography.footnote)
    }
}
```

### Sharp and pill

The same three components on three scales: the library's own (`rememberPantrixShapes()`), `PantrixShapes.Sharp` and `PantrixShapes.Pill`. The components were given no shape: each reads the step its style names from the theme's scale. That is why the card, the text field and the tag change their corners with the brand.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.shape.rememberPantrixShapes

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixTheme(shapes = rememberPantrixShapes()) { ShapedParts("Default", "default") }
    PantrixTheme(shapes = PantrixShapes.Sharp) { ShapedParts("Sharp", "sharp") }
    PantrixTheme(shapes = PantrixShapes.Pill) { ShapedParts("Pill", "pill") }
}

@Composable
private fun ShapedParts(
    title: String,
    tagKey: String
) {
    PantrixCard(modifier = Modifier.width(200.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixText(text = title, style = PantrixTheme.typography.title)
            PantrixTextField(
                state = rememberTextFieldState(),
                modifier = Modifier.fillMaxWidth(),
                placeholder = "Search",
                contentDescription = "Search",
                tagKey = tagKey
            )
            PantrixTag(text = "New", tagKey = tagKey)
        }
    }
}
```

### A role's shape and a fixed one

The app's own box takes its shape from the scale too. A `ShapeRole` is a step's name: `ShapeRole.Large.toShape()` is the nearest theme's `lg`, and changes with the brand. A shape off the scale is given with `ShapeSpec.Fixed`: here a ticket with cut corners, the same on every brand. Both are a `ShapeSpec`: a component's style is given one the same way.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CutCornerShape
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.shape.ShapeSpec
import com.pantrixui.foundation.token.style.toShape

val roles: List<Pair<String, ShapeSpec>> = listOf("ShapeRole.Large" to ShapeRole.Large, "ShapeSpec.Fixed" to TICKET)
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    roles.forEach { (name, spec) ->
        Box(
            modifier = Modifier
                .size(width = 160.dp, height = 72.dp)
                .background(PantrixTheme.colors.info.container, spec.toShape()),
            contentAlignment = Alignment.Center
        ) {
            PantrixText(text = name, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.info.onContainer)
        }
    }
}

private val TICKET: ShapeSpec = ShapeSpec.Fixed(CutCornerShape(12.dp))
```

## API

### PantrixShapes

`import com.pantrixui.foundation.token.shape.PantrixShapes`, from `com.pantrixui:foundation`

```kotlin
data class PantrixShapes(
    val xs: Shape = RoundedCornerShape(2.dp),
    val sm: Shape = RoundedCornerShape(4.dp),
    val md: Shape = RoundedCornerShape(8.dp),
    val lg: Shape = RoundedCornerShape(12.dp),
    val xl: Shape = RoundedCornerShape(16.dp)
)
```

The brand's corner radii, from square to fully round. A component style names a step through a `ShapeRole`, so the brand decides how round that step is: `Sharp` squares every step off, and `Pill` makes every step fully round.

The two ends of the scale, `none` and `full`, are the same on every brand. They are not parameters, so neither a brand nor `copy` can move them.

Parameters:

- `xs: Shape`: The smallest rounding, 2dp by default: `ShapeRole.ExtraSmall`.
- `sm: Shape`: 4dp by default: `ShapeRole.Small`.
- `md: Shape`: 8dp by default: `ShapeRole.Medium`, a button's shape on iOS.
- `lg: Shape`: 12dp by default: `ShapeRole.Large`.
- `xl: Shape`: 16dp by default.

Members:

- `none: Shape`: Square corners, on every brand.
- `full: Shape`: Fully round ends, on every brand: `ShapeRole.Full`, a button's shape on Android, desktop and the web.

On the type:

- `PantrixShapes.Sharp: PantrixShapes`: Every step squared off. `full` stays round, as it does on every brand.
- `PantrixShapes.Pill: PantrixShapes`: Every step fully round — pill buttons, circular avatars.

### ShapeRole

`import com.pantrixui.foundation.token.shape.ShapeRole`, from `com.pantrixui:foundation`

```kotlin
enum class ShapeRole : ShapeSpec
```

A step of `PantrixShapes`, the brand's shape scale.

A component preset stores the step rather than a concrete `Shape`, so one preset serves every brand: Pantrix's `lg` is its own, and so is the neutral brand's.

Entries:

- `ExtraSmall`: The brand's smallest rounding, `xs`: 2dp on Pantrix's own scale.
- `Small`: The brand's `sm`: 4dp on Pantrix's own scale.
- `Medium`: The brand's `md`: 8dp on Pantrix's own scale.
- `Large`: The brand's `lg`: 12dp on Pantrix's own scale.
- `Full`: Fully round ends, `full`, the same on every brand.

### ShapeSpec

`import com.pantrixui.foundation.token.shape.ShapeSpec`, from `com.pantrixui:foundation`

```kotlin
sealed interface ShapeSpec
```

The shape a component style asks for: a step of the brand's shape scale, or a fixed shape.

Platform presets use a `ShapeRole`, because a preset serves every brand and the brand decides how round each step is. An app that wants a shape off the scale, such as a 10dp corner on iOS buttons only, gives `Fixed`.

Members:

- `fun resolve(shapes: PantrixShapes): Shape`: The concrete shape on `shapes`, the active brand's scale.

#### ShapeSpec.Fixed

```kotlin
class Fixed(public val shape: Shape) : ShapeSpec
```

A shape that does not follow the brand's scale.

Parameters:

- `shape: Shape`: The shape, the same on every brand.

#### ShapeSpec.Unspecified

```kotlin
data object Unspecified : ShapeSpec
```

No shape. In a style used as an override it leaves the field to the style underneath. Presets never use it; resolved on its own it gives square corners.

### ShapeSpec.toShape

`import com.pantrixui.foundation.token.style.toShape`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ShapeSpec.toShape(): Shape
```

This shape on the active brand's scale.

### rememberPantrixShapes

`import com.pantrixui.foundation.token.shape.rememberPantrixShapes`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixShapes(): PantrixShapes
```

Pantrix's own shape scale, `PantrixShapes` with its defaults.

### LocalPantrixShapes

`import com.pantrixui.foundation.token.shape.LocalPantrixShapes`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixShapes: ProvidableCompositionLocal<PantrixShapes>
```

The corner radii in effect, which `PantrixTheme` provides: what `PantrixTheme.shapes` reads. Outside a theme, Pantrix's own.
