# Spinner

A spinning arc that says something is in progress: while a page loads, while a save is under way. It does not say how much of the work is done and takes no progress value; it only says to wait.

- `PantrixSpinner` (`com.pantrixui.components.elements.spinner`, `com.pantrixui:components`): A spinning arc for work in progress, announced as a polite live region; it keeps still under reduced motion. Keywords: loading, progress indicator, activity indicator, busy, indeterminate progress, loader.

## Features

- **Size.** `size` is one side of the spinner; the spinner is square. If it is not given, it is the style's size: 18dp on every platform.
- **Thickness grows with size.** The arc's thickness is a ninth of the size: a 16dp spinner inside a button and a 48dp one on an empty page read at the same weight.
- **Colour.** Without `color`, the spinner is in the content colour of where it sits, as in a solid button. Where there is no content colour it is in the theme's `primary` colour: the theme's own grounds give no content colour, so on the page, on a surface and in a card the spinner spins in the brand's colour.
- **Screen reader.** `contentDescription` is announced as a polite live region (`LiveRegionMode.Polite`). Its default is "Loading" in the theme's language.
- **Where it is already said.** Inside something that says by itself that it is loading, `contentDescription = null` is given. `PantrixButton`'s `loading` does this for the spinner it puts inside the button.
- **Reduced motion.** When the system asks for reduced motion the arc does not spin; it keeps still.
- **Style.** `SpinnerStyle` holds the size of a spinner that is given none. A brand changes it with the `spinner.size` value, a theme with `styles`, and a part of the tree with `ProvidePantrixStyles`. The app's density does not scale it.
- **Automation.** `tagKey` builds the test tag: a spinner given `tagKey = "orders_loading"` has the tag `Spinner_orders_loading`.

## Usage

### Loading a page

```kotlin
Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
    PantrixSpinner(size = PantrixTheme.spacing.xxl, tagKey = "orders_loading")
}
```

### Inside something that already says it is loading

```kotlin
PantrixSpinner(size = PantrixTheme.spacing.lg, contentDescription = null)
```

## Examples

### On its own

At its plainest: no parameter is given. The spinner is the style's size (18dp), and is announced to a screen reader as "Loading".

No colour is given either. The example stands on the theme's ground, and the ground gives no content colour: the spinner spins in its own default, the brand's colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.spinner.PantrixSpinner

PantrixSpinner()
```

### Sizes

`size` is the spinner's side: here 16, 24, 32 and 48 dp. The arc's thickness grows with the size, so they all read at the same weight.

The second one's size is not a number but a step of the theme's spacing scale: `PantrixTheme.spacing.xl`, 24dp. A size taken from the scale scales with the app's density; one given as a number does not.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSpinner(size = 16.dp)
    PantrixSpinner(size = PantrixTheme.spacing.xl)
    PantrixSpinner(size = 32.dp)
    PantrixSpinner(size = 48.dp)
}
```

### Colours

`color` draws the arc in the colour it is given. In order: the theme's `success` and `danger` roles, the secondary text colour, and the app's own purple, which no role of the theme has.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSpinner(size = 24.dp, color = colors.success.color)
    PantrixSpinner(size = 24.dp, color = colors.danger.color)
    PantrixSpinner(size = 24.dp, color = colors.textSecondary)
    PantrixSpinner(size = 24.dp, color = ownColors().color)
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### On a fill

A spinner that is given no colour takes the content colour of where it sits. The first surface is in the theme's `primary` colour: the spinner spins in the role's `onColor`. The second is in the `success` role's `container`: the spinner is in `onContainer`. Neither is given a `color`.

The button's spinner is the button's own: `loading = true` puts it in place of the leading icon, in the button's content colour.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixSurface(color = colors.primary.color) {
        PantrixSpinner(modifier = Modifier.padding(PantrixTheme.spacing.md), size = 24.dp)
    }
    PantrixSurface(color = colors.success.container) {
        PantrixSpinner(modifier = Modifier.padding(PantrixTheme.spacing.md), size = 24.dp)
    }
    PantrixButton(text = "Saving", onClick = {}, loading = true, tagKey = "saving")
}
```

### While a page loads

A large spinner in the centre, standing in for the content until it arrives: `size = PantrixTheme.spacing.xxl`, 32dp.

`contentDescription` says what is loading: a screen reader says "Loading orders" in place of "Loading". `tagKey` is given too: automation finds the spinner by the tag `Spinner_orders_loading`. Press the button: the content arrives and the spinner goes.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loading by rememberSaveable { mutableStateOf(true) }
PantrixSurface(
    modifier = Modifier.fillMaxWidth().height(160.dp),
    border = PantrixTheme.colors.divider
) {
    if (loading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixSpinner(
                size = PantrixTheme.spacing.xxl,
                contentDescription = "Loading orders",
                tagKey = "orders_loading"
            )
        }
    } else {
        PantrixText(text = "Three orders are on their way.", modifier = Modifier.padding(PantrixTheme.spacing.lg))
    }
}
PantrixButton(
    text = if (loading) "Finish loading" else "Reload",
    onClick = { loading = !loading },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "toggle_orders"
)
```

### Beside a text that says it is loading

A spinner that is given `contentDescription = null` says nothing to a screen reader. The text beside it already says the work is in progress: the spinner need not say it as well.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSpinner(size = 16.dp, contentDescription = null)
    PantrixText(text = "Saving changes", color = PantrixTheme.colors.textSecondary)
}
```

### Default size from the style

`SpinnerStyle` holds the size of a spinner that is given none. `ProvidePantrixStyles` changes it for a part of the tree; the same change is given to the whole app through `PantrixTheme`'s `styles` parameter.

The first spinner takes its size from the style: 28dp here. The second is given `size`: the parameter takes precedence over the style.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.spinner.SpinnerStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles = remember { pantrixStyles(SpinnerStyle.override(all = SpinnerStyle(size = 28.dp))) }
ProvidePantrixStyles(styles = styles) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixSpinner()
        PantrixSpinner(size = 16.dp)
    }
}
```

## API

### PantrixSpinner

`import com.pantrixui.components.elements.spinner.PantrixSpinner`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSpinner(
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(SpinnerStyle).size,
    color: Color = Color.Unspecified,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

A spinning arc that says something is in progress, `size` square; it keeps still when the system asks for reduced motion. Drawn in `color`, or else the content colour of where it sits, as in a solid button, or the primary colour: the theme's own grounds give no content colour, so on the page, on a surface and in a card it is the brand's. `contentDescription` reaches screen readers as a polite live region; pass null inside something that already says it is loading.

Parameters:

- `modifier: Modifier`: the spinner's modifier.
- `size: Dp`
- `color: Color`
- `contentDescription: String?`
- `tagKey: String?`: the spinner's automation key: the spinner is `Spinner_<tagKey>`, and without one a key of where it is called. Visible text is never the key.

### SpinnerStyle

`import com.pantrixui.components.elements.spinner.SpinnerStyle`, from `com.pantrixui:components`

```kotlin
class SpinnerStyle(
    public val size: Dp = Dp.Unspecified
) : PantrixStyle<SpinnerStyle>
```

`PantrixSpinner`'s geometry.

Parameters:

- `size: Dp`: The spinner's width and height: 18dp on every platform, unless a brand or a theme sets another.
