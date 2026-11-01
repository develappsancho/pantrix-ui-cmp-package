# Component styles

A component's measures and form are its style: its height, its padding, its corners, its icon's size. Each style has a preset on each platform; on top of it come the brand's, the theme's and a section's, in that order. A component's own parameter comes before all of them.

## Features

- **The whole app.** `PantrixTheme(styles = pantrixStyles(…))` gives the styles to everywhere in it. A style's override is built by its key: `ButtonStyle.override(all = …, ios = …)`; each names only the fields it changes.
- **A section.** `ProvidePantrixStyles(styles) { … }` gives the styles to what is in it alone, on top of the outer ones.
- **By platform.** `override`'s `android`, `ios`, `desktop` and `web` parameters are that platform's override, on top of `all`.
- **The brand's paths.** `ComponentTokenOverrides` says a brand's changes by path: `"button.shape"`, `"icon.size"`. A preset carries them; `PantrixTheme(componentOverrides = …)` gives them too.
- **Reading.** `PantrixTheme.style(ButtonStyle)` is a style as it holds at that place: the preset, the brand, the theme, the section and the density together.
- **Your own component.** A `PantrixStyle` and its `PantrixStyleKey` put the app's own component in the same order: it has a preset by platform, is overridden in a theme and in a section, and scales with the density.

## Examples

### The app's styles

Styles for the whole app: the outer `PantrixTheme` is given `styles = pantrixStyles(…)`. Here an inner theme does the same for a section: the buttons' corners are small (`ShapeRole.Small`), the icons 28dp. No component was given a parameter; the second row is the same components with their styles unchanged.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.IconStyle
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.PantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles: PantrixStyles = remember {
    pantrixStyles(
        ButtonStyle.override(all = ButtonStyle(shape = ShapeRole.Small)),
        IconStyle.override(all = IconStyle(size = 28.dp))
    )
}
PantrixTheme(styles = styles) { StyledRow("styled") }
StyledRow("plain")

@Composable
private fun StyledRow(tagKey: String) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(text = "Save", onClick = {}, tagKey = "${tagKey}_save")
        PantrixButton(text = "Cancel", onClick = {}, variant = ButtonVariant.Outline, tagKey = "${tagKey}_cancel")
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = "Star")
    }
}
```

### A section and a platform

A section and a platform. `ProvidePantrixStyles` gives the styles to what is in it alone, on top of the outer styles. An override is given by platform too: the card's corners are small on every platform (`ShapeRole.Small`) and large on iOS (`ShapeRole.Large`); the one of the platform you opened this page on is drawn.

```kotlin
import androidx.compose.runtime.remember
import com.pantrixui.components.container.card.CardStyle
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles = remember {
    pantrixStyles(
        CardStyle.override(
            all = CardStyle(shape = ShapeRole.Small),
            ios = CardStyle(shape = ShapeRole.Large)
        )
    )
}
ProvidePantrixStyles(styles) {
    PantrixCard {
        PantrixText(text = "This platform: ${PantrixTheme.platform.type.name}")
        PantrixText(
            text = "The card's corners come from this section's style",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### The brand's paths

A brand's changes are said by path: the first part is the style's name, the rest the field. `ComponentTokenOverrides` carries them as shapes and measures; a brand's preset (`DesignPreset`) gives them this way too. Here the buttons are medium round by `"button.shape"`, the icons 16dp by `"icon.size"`. `PantrixTheme.style(ButtonStyle)` reads the style in force.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ComponentTokenOverrides

PantrixTheme(componentOverrides = BRAND) {
    StyledRow("brand")
    val button = PantrixTheme.style(ButtonStyle)
    PantrixText(
        text = "A medium button's height: ${button.medium.height.value.toInt()}dp",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun StyledRow(tagKey: String) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(text = "Save", onClick = {}, tagKey = "${tagKey}_save")
        PantrixButton(text = "Cancel", onClick = {}, variant = ButtonVariant.Outline, tagKey = "${tagKey}_cancel")
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = "Star")
    }
}

private val BRAND = ComponentTokenOverrides(
    shapes = mapOf("button.shape" to ShapeRole.Medium),
    dimensions = mapOf("icon.size" to 16.dp)
)
```

### Your own component's style

The app's own component takes a style too. `PromoStyle` is a `PantrixStyle`: each of its fields has a "not given" value, `merge` takes what is given on top, and `scaled` multiplies its air by the density (`scaledForDensity`). Its companion object is its `PantrixStyleKey`: it holds the preset on each platform (`PlatformPresets`) and reads the brand's paths (`"promo.padding"`). The component takes its style with `PantrixTheme.style(PromoStyle)`, and its shape with `toShape()`.

The upper box is at its preset; the lower one's section turns it into a pill with `PromoStyle.override(…)`.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.shape.ShapeSpec
import com.pantrixui.foundation.token.shape.takeOrElse
import com.pantrixui.foundation.token.style.ComponentTokenOverrides
import com.pantrixui.foundation.token.style.PantrixStyle
import com.pantrixui.foundation.token.style.PantrixStyleKey
import com.pantrixui.foundation.token.style.PlatformPresets
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles
import com.pantrixui.foundation.token.style.scaledForDensity
import com.pantrixui.foundation.token.style.toShape

Promo("Winter sale: free shipping")
ProvidePantrixStyles(remember { pantrixStyles(PromoStyle.override(all = PromoStyle(shape = ShapeRole.Full))) }) {
    Promo("Order today, delivered tomorrow")
}

@Immutable
private data class PromoStyle(
    val padding: Dp = Dp.Unspecified,
    val shape: ShapeSpec = ShapeSpec.Unspecified
) : PantrixStyle<PromoStyle> {
    override fun merge(other: PromoStyle?): PromoStyle = if (other == null) {
        this
    } else {
        PromoStyle(
            padding = if (other.padding.isSpecified) other.padding else padding,
            shape = other.shape.takeOrElse { shape }
        )
    }

    override fun scaled(scale: Float): PromoStyle = copy(padding = padding.scaledForDensity(scale))

    /** Stilin anahtarı: adı `"promo"`, her platformdaki hazır ayarı ve markanın yolları. */
    companion object Key : PantrixStyleKey<PromoStyle>("promo") {
        override val presets: PlatformPresets<PromoStyle> = PlatformPresets(
            android = PromoStyle(padding = 16.dp, shape = ShapeRole.Large),
            ios = PromoStyle(padding = 16.dp, shape = ShapeRole.Medium),
            desktop = PromoStyle(padding = 12.dp, shape = ShapeRole.Medium),
            web = PromoStyle(padding = 12.dp, shape = ShapeRole.Medium)
        )

        override fun brandOverride(overrides: ComponentTokenOverrides): PromoStyle? =
            if (overrides.hasOverridesFor(name)) {
                PromoStyle(padding = overrides.dimension("promo.padding"), shape = overrides.shape("promo.shape"))
            } else {
                null
            }
    }
}

@Composable
private fun Promo(text: String) {
    val style = PantrixTheme.style(PromoStyle)
    PantrixSurface(color = PantrixTheme.colors.success.container, shape = style.shape.toShape()) {
        Column(modifier = Modifier.padding(style.padding)) {
            PantrixText(text = text, color = PantrixTheme.colors.success.onContainer)
        }
    }
}
```

## API

### PantrixStyles

`import com.pantrixui.foundation.token.style.PantrixStyles`, from `com.pantrixui:foundation`

```kotlin
class PantrixStyles
```

Style overrides for any number of components, per platform.

Give them to `PantrixTheme(styles = …)` for the whole app, or to `ProvidePantrixStyles` for part of it. A component's style is its platform preset with the brand's overrides on top, then the theme's, then each enclosing `ProvidePantrixStyles` from the outside in. A parameter such as `PantrixButton(shape = …)` still wins over all of them.

```kotlin
PantrixTheme(
    styles = pantrixStyles(
        ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium)),
        IconStyle.override(all = IconStyle(size = 20.dp))
    )
) { App() }
```

Members:

- `fun <S : PantrixStyle<S>> overrideFor(key: PantrixStyleKey<S>, platform: PlatformType): S?`: `key`'s override on `platform`, or null when these overrides leave it alone.
- `operator fun plus(other: PantrixStyles): PantrixStyles`: These overrides with `other`'s on top: where both set a field, `other` wins.

On the type:

- `PantrixStyles.None: PantrixStyles`: No overrides: every component keeps its preset and its brand's overrides.

### pantrixStyles

`import com.pantrixui.foundation.token.style.pantrixStyles`, from `com.pantrixui:foundation`

```kotlin
fun pantrixStyles(vararg overrides: PantrixStyleOverride<*>): PantrixStyles
```

Style overrides, one per component. A component given twice gets the later override on top of the earlier one.

Parameters:

- `vararg overrides: PantrixStyleOverride<*>`: the overrides, each made by a style's `override`: `ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium))`.

### ProvidePantrixStyles

`import com.pantrixui.foundation.token.style.ProvidePantrixStyles`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun ProvidePantrixStyles(
    styles: PantrixStyles,
    content: @Composable () -> Unit
)
```

Overrides styles for `content` alone: denser rows on one settings screen, pill buttons in one dialog. The overrides add to those already in effect, the theme's and any enclosing call's, and win where both set a field.

Parameters:

- `styles: PantrixStyles`: the overrides for `content`, made by `pantrixStyles`.
- `content: @Composable () -> Unit`

### PantrixStyle

`import com.pantrixui.foundation.token.style.PantrixStyle`, from `com.pantrixui:foundation`

```kotlin
interface PantrixStyle<S>
```

A component's style: the geometry and appearance a platform preset decides and a brand, a theme or a part of the tree can change.

Every field has an unspecified value (`Dp.Unspecified`, `Float.NaN`, `ShapeSpec.Unspecified`, `null`), so one type is both a complete preset and a partial override, as `TextStyle` is: `ButtonStyle(shape = ShapeRole.Medium)` changes the shape and leaves the other fields to the style underneath.

Members:

- `fun merge(other: S?): S`: This style with every field `other` specifies taken from `other`; `null` returns this.
- `fun scaled(scale: Float): S`: This style with its **air** multiplied by the interface density, and nothing else.

  Heights, paddings, gaps and margins scale; strokes, borders, dividers, elevations, icon sizes and dots do not. A compact screen is a screen with less air in it — not one whose hairlines are 0.85 of a hairline, whose icons are blurry, and whose shadows are shallower. That distinction cannot be made generically, which is why every style makes it for itself.

  A scale of `1f` must return a style equal to this one: `PantrixDensity.Comfortable` is the default, and a screenshot baseline recorded at it must not move when this arrives.

  Use `scaledForDensity`, which leaves an unspecified dimension unspecified — a partial override has to stay partial through a scaling or it stops being an override and becomes a value.

  `scale`: the interface density's scale, `PantrixDensity.scale`.

### PantrixStyleKey

`import com.pantrixui.foundation.token.style.PantrixStyleKey`, from `com.pantrixui:foundation`

```kotlin
abstract class PantrixStyleKey<S : PantrixStyle<S>>(public val name: String)
```

Names a component's style and holds its platform presets.

A style declares its key as its companion object, so the style type names itself: `PantrixTheme.style(ButtonStyle)` reads it and `ButtonStyle.override(ios = …)` overrides it. The key lives with its component; nothing in core lists the components.

Parameters:

- `name: String`: The style's name, and the first segment of the paths a brand overrides it with: `"button"` in `"button.shape"`.

Members:

- `presets: PlatformPresets<S>`: The style on each platform. Complete: every field is specified.
- `open fun brandOverride(overrides: ComponentTokenOverrides): S?`: The fields `overrides` sets for this style, or null when it sets none.
- `fun override(all: S? = null, android: S? = null, ios: S? = null, desktop: S? = null, web: S? = null): PantrixStyleOverride<S>`: An override of this style, for `PantrixStyle`. `all` holds on every platform and a platform's own argument goes on top of it; each names only the fields it changes.

  `android`: the fields that change on Android, over `all`'s.

  `ios`: the fields that change on iOS, over `all`'s.

  `desktop`: the fields that change on the desktop, over `all`'s.

  `web`: the fields that change in a browser, over `all`'s.
- `fun resolve(platform: PlatformType, componentOverrides: ComponentTokenOverrides = ComponentTokenOverrides.None, styles: PantrixStyles = PantrixStyles.None, density: PantrixDensity = PantrixDensity.Comfortable): S`: The style in force on `platform`: its preset, the brand's `componentOverrides`, the theme's and the subtree's `styles`, and then the `density`. What `PantrixTheme.style` returns, for code that has no composition.

  Density last and not first, so an application that sets a height gets a scaled height rather than an unscaled one — the setting belongs to the person using the screen, and it applies to whatever the screen decided.

### PlatformPresets

`import com.pantrixui.foundation.token.style.PlatformPresets`, from `com.pantrixui:foundation`

```kotlin
class PlatformPresets<S : PantrixStyle<S>>(
    public val android: S,
    public val ios: S,
    public val desktop: S,
    public val web: S
)
```

A style for each platform.

Parameters:

- `android: S`: The style on Android.
- `ios: S`: The style on iOS.
- `desktop: S`: The style on desktop.
- `web: S`: The style on the web.

Members:

- `operator fun get(platform: PlatformType): S`: The style for `platform`: `presets[PlatformType.Ios]`.

### ComponentTokenOverrides

`import com.pantrixui.foundation.token.style.ComponentTokenOverrides`, from `com.pantrixui:foundation`

```kotlin
class ComponentTokenOverrides(
    public val shapes: Map<String, ShapeRole> = emptyMap(),
    public val dimensions: Map<String, Dp> = emptyMap()
)
```

A brand's changes to component styles, by path: the first segment names the style and the rest the field, as in `"button.shape"` or `"icon.size"`. Each style reads its own in `PantrixStyleKey.brandOverride`, and a path no style reads changes nothing.

Parameters:

- `shapes: Map<String, ShapeRole>`: The shapes the brand sets, as steps of its shape scale.
- `dimensions: Map<String, Dp>`: The sizes the brand sets: heights, paddings, icon sizes.

Members:

- `fun hasOverridesFor(component: String): Boolean`: Whether any path belongs to `component`, a style's name such as `"button"`.
- `fun shape(path: String): ShapeSpec`: The shape set at `path`, or `ShapeSpec.Unspecified`, which leaves the preset's.
- `fun dimension(path: String): Dp`: The dimension set at `path`, or `Dp.Unspecified`, which leaves the preset's.

On the type:

- `ComponentTokenOverrides.None: ComponentTokenOverrides`: No overrides: every style keeps its platform preset.
