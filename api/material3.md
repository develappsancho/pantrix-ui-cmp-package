# com.pantrixui:material3

The bridge between Pantrix UI's theme and Material 3's, in both directions.

## Package com.pantrixui.material3

### ColorScheme.toPantrixColors

`import com.pantrixui.material3.toPantrixColors`, from `com.pantrixui:material3`

```kotlin
fun ColorScheme.toPantrixColors(base: PantrixColors = pantrixColorsAsDarkAs(this)): PantrixColors
```

Pantrix's colours from this Material scheme: what Pantrix's components are drawn in inside a Material app, so that a screen written with them reads as the app's other screens do.

Each colour Material has a role for comes from the scheme. The brand's role is Material's primary, the neutral one its secondary, and danger its error. The backdrop is the scheme's background and a raised surface its `surfaceContainerLow`, which stands forward of the background as a card does in Material. The text is drawn in the scheme's `onBackground` and `onSurfaceVariant`, and the edges in its `outline` and `outlineVariant`.

What Material has no role for comes from `base`: the success, info and warning roles, the edge under a pointer, the focus ring, the colours of what is disabled, the chart's colours, and how much the scrim dims.

Parameters:

- `base: PantrixColors`: the Pantrix colours for what the scheme has none of: Pantrix's own by default, as dark as the scheme. `pantrixColorsAsDarkAs`: Pantrix's own colours as dark as `scheme`: the dark set when its background is.

### PantrixColors.toColorScheme

`import com.pantrixui.material3.toColorScheme`, from `com.pantrixui:material3`

```kotlin
fun PantrixColors.toColorScheme(): ColorScheme
```

A Material scheme from these Pantrix colours: what Material's components are drawn in inside a Pantrix app, so that a component Pantrix does not have reads as Pantrix's own do.

The brand's role is Material's primary, the neutral role its secondary, the info role its tertiary and danger its error; each of them gives its fixed colours too, from its container. The scheme's surface is the backdrop, as in Material's own schemes, and its containers step from the raised surface towards the text: `surfaceContainerLow` is the surface, and each container after it lays a little more of the text's colour over it. `outline` is the mark of a control, and `outlineVariant` the edge of a box: Material draws an outlined button, a chip and an outlined card in it, so they stand out as clearly as Pantrix's own fields and chips. Material's dividers take that edge too, a step stronger than Pantrix's.

Material's scrim is opaque, and its components dim with it as they need; the one given is these colours' scrim at full strength.

### Shapes.toPantrixShapes

`import com.pantrixui.material3.toPantrixShapes`, from `com.pantrixui:material3`

```kotlin
fun Shapes.toPantrixShapes(base: PantrixShapes = PantrixShapes()): PantrixShapes
```

Pantrix's corner radii from Material's shape scale, each step from the Material step of its radius: extra small, small, medium and large become `sm`, `md`, `lg` and `xl`, so that Material's own scale, 4, 8, 12 and 16dp, gives Pantrix's own, and a Pantrix component is as round in a Material app as in its own theme. Pantrix's `xs`, less round than any Material step, comes from `base`; Material's extra large, rounder than any Pantrix step, has no Pantrix step. Square and fully round are the same in both.

Parameters:

- `base: PantrixShapes`: the shapes Material has no step for: Pantrix's own by default.

### PantrixShapes.toMaterialShapes

`import com.pantrixui.material3.toMaterialShapes`, from `com.pantrixui:material3`

```kotlin
fun PantrixShapes.toMaterialShapes(fallback: Shapes = Shapes()): Shapes
```

Material's shape scale from Pantrix's corner radii, each step from the Pantrix step of its radius: `sm`, `md`, `lg` and `xl` become extra small, small, medium and large, so that Pantrix's own scale gives Material's own from extra small to large. Material's extra large, rounder than any Pantrix step, takes `xl`, the roundest.

Material takes shapes made of corners only. A Pantrix step of another shape, a brand's own outline, takes `fallback`'s shape for that step.

Parameters:

- `fallback: Shapes`: the shapes for the steps whose Pantrix shape is not made of corners: Material's own by default.

### PantrixThemeFromMaterial

`import com.pantrixui.material3.PantrixThemeFromMaterial`, from `com.pantrixui:material3`

```kotlin
@Composable
fun PantrixThemeFromMaterial(content: @Composable () -> Unit)
```

A Pantrix theme made of the Material theme around it: inside a Material app, Pantrix's components in `content` take its colours, its type scale and its shapes, so that a screen moved to Pantrix reads as the app's other screens do.

The colours are `toPantrixColors` of the scheme, as dark as it; the type is `toPantrixTypography` over Pantrix's own scale; the shapes are `toPantrixShapes`. Everything else is Pantrix's own, or what a `PantrixTheme` inside gives.

At its root, Pantrix's text style is the one a Material text takes there, the scheme's large body. Its content colour stays Pantrix's own, which on the theme's grounds is already the scheme's text colour: at a Material theme's root Material's own is its default black, which only a Material surface replaces. Inside a Material surface, `PantrixContentFromMaterial` gives Pantrix's content the surface's colour.

Where it is the outermost Pantrix theme, it makes what the system draws follow the scheme's dark rather than the system's: Android's bars' icons, iOS's status bar, keyboard and controls. A Material app that sets them itself gives the other form `followSystemBars = false`.

Parameters:

- `content: @Composable () -> Unit`

### PantrixThemeFromMaterial

`import com.pantrixui.material3.PantrixThemeFromMaterial`, from `com.pantrixui:material3`

```kotlin
@Composable
fun PantrixThemeFromMaterial(
    followSystemBars: Boolean,
    content: @Composable () -> Unit
)
```

`PantrixThemeFromMaterial`, told whether it sets what the system draws.

Parameters:

- `followSystemBars: Boolean`: whether this theme, where it is the outermost Pantrix theme, makes what the system draws follow the scheme's dark rather than the system's: Android's bars' icons, iOS's status bar, keyboard and controls. A Material app that sets them itself, or whose bars are coloured, turns it off. docs/guide/system-bars/SYSTEM_BARS_GUIDE.md has the whole of it.
- `content: @Composable () -> Unit`: what takes the theme: Pantrix's components inside the Material app.

### MaterialThemeFromPantrix

`import com.pantrixui.material3.MaterialThemeFromPantrix`, from `com.pantrixui:material3`

```kotlin
@Composable
fun MaterialThemeFromPantrix(content: @Composable () -> Unit)
```

A Material theme made of the Pantrix theme around it: inside a Pantrix app, Material's components in `content` take its colours, its type scale and its shapes, so that a component Pantrix does not have reads as Pantrix's own do.

The scheme is `toColorScheme` of Pantrix's colours, the type scale `toMaterialTypography` and the shapes `toMaterialShapes`.

At its root, Material's content colour and text style are the ones a Pantrix text would take there: `MaterialContentFromPantrix`.

Parameters:

- `content: @Composable () -> Unit`

### PantrixContentFromMaterial

`import com.pantrixui.material3.PantrixContentFromMaterial`, from `com.pantrixui:material3`

```kotlin
@Composable
fun PantrixContentFromMaterial(content: @Composable () -> Unit)
```

Gives Pantrix's text and icons in `content` the colour and the style a Material text takes where this stands: what Pantrix's content inside a Material surface is wrapped in, so that it reads on the surface as Material's does.

Parameters:

- `content: @Composable () -> Unit`

### MaterialContentFromPantrix

`import com.pantrixui.material3.MaterialContentFromPantrix`, from `com.pantrixui:material3`

```kotlin
@Composable
fun MaterialContentFromPantrix(content: @Composable () -> Unit)
```

Gives Material's text and icons in `content` the colour and the style a Pantrix text takes where this stands: what Material's content on a Pantrix surface or fill is wrapped in, so that it reads there as Pantrix's does. Where nothing gives Pantrix a content colour, it is the theme's text colour.

Parameters:

- `content: @Composable () -> Unit`

### Typography.toPantrixTypography

`import com.pantrixui.material3.toPantrixTypography`, from `com.pantrixui:material3`

```kotlin
fun Typography.toPantrixTypography(base: PantrixTypography): PantrixTypography
```

Pantrix's type scale from this Material one: what Pantrix's text is set in inside a Material app.

Each Pantrix role takes the Material style of its size: display the small display (36 in Material's own scale), headline the medium headline (28), title the large title (22), body the large body (16), label the large label (14), footnote the small body (12) and caption the small label (11). Material has no style of a callout's size: the callout is the large body's face and weight at `base`'s callout size. Nor has it a monospace style: the code is `base`'s.

Parameters:

- `base: PantrixTypography`: the Pantrix scale the callout's size and the code come from.

### PantrixTypography.toMaterialTypography

`import com.pantrixui.material3.toMaterialTypography`, from `com.pantrixui:material3`

```kotlin
fun PantrixTypography.toMaterialTypography(): Typography
```

A Material type scale from this Pantrix one: what Material's text is set in inside a Pantrix app.

Each Material style takes the Pantrix role of its size, and where Pantrix has no role that large, its largest: the three displays are the display, the large and the medium headline the headline, the small headline and the large title the title, the medium title and the large body the body, the small title, the medium body and the large label the label, the small body and the medium label the footnote, and the small label the caption. Material's emphasized styles are its plain ones, as Material's own scale gives them for a scale of an app's.
