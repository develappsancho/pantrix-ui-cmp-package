# Sign-in screen

Case study: a screen with a marketing panel on the left and a sign-in form on the right. In a narrow window the marketing panel goes and the form stays.

This is a screen, so it asks the window (`PantrixTheme.window`). Its most important rule: the form is called from a single place. The marketing panel comes and goes with an `if`, while the form is the same `SignInForm()` call in every layout. That is why the text typed into the email field stays where it is as the window narrows and widens, or as the phone is turned. Calling the form from two separate places, for the narrow layout and for the wide one, would wipe what was typed when the class changes.

In a real app this screen fills the whole window; here it stands inside the page, in a frame. The library gives this layout ready-made too: `PantrixShowcaseScaffold` (the "Showcase Scaffold" page). This page shows building it by hand, by asking the window.

## Features

- **The marketing panel only where there is room.** `if (!window.isNarrow) MarketingPanel()`: the marketing panel is shown only in a window that is not narrow. For an extra that comes and goes and has nothing to remember, a plain `if` is enough.
- **The form from one place.** Compose ties what a composable remembers to the place it is called from: since the form is always called from the same place, its state stays while the marketing panel comes and goes.
- **Share and type style by class.** `window.byWidth(compact = 1f, large = 1.25f)`: the marketing panel's share grows from `Large` on. The type style of its title is a value picked by class too.
- **Padding.** `responsive(compact = 16.dp, medium = 24.dp, large = 40.dp)`: the padding grows with the class. It is the short form of `byWidth`, for a composable that does not need the window itself.
- **A short window.** The marketing panel's items are inside `if (!window.isShort)`: one `Benefit(...)` for each item of the `BENEFITS` list. A phone on its side has enough width but not enough height; there is no room for the items, and the title stays.
- **A value by height.** `window.byHeight(compact = 300.dp, medium = 460.dp)`: the screen's height shrinks in a short window, and so does the spacing between the form's rows.
- **The form does not widen.** `widthIn(max = 360.dp)`: the form is 360 dp wide at most and stands in the centre of the room set aside for it; where that room is short, it scrolls within itself. Not everything is settled by a class.
- **Saved state.** The form's fields remember with `rememberSaveable`: what was typed comes back when Android recreates the Activity too, since the call site has stayed the same.

## Examples

### Marketing panel and sign-in form

The whole screen, in a frame. A narrow window has the form alone. In a window that is not narrow the marketing panel comes beside the form: with a share equal to the form's up to `Large`, and from `Large` on wider and with a larger title. In a short window, that is a phone on its side, the marketing panel's items go and its title stays; the frame gets lower and the form's rows draw closer together.

Type your email, then narrow the window or turn the phone: the marketing panel comes and goes, and what you typed stays.

The card's window selector shows the same without touching the window: it gives the example a fixed window. "Narrow" is a phone of 360 × 800 dp, "Medium" a tablet held upright of 768 × 1024 dp, "Short" a phone on its side of 880 × 400 dp and "Wide" a desktop window of 1280 × 800 dp; "Real" is the app's window. The frame is laid out as wide as the window that is picked: even on a wide screen "Narrow" is as wide as a phone. The two-pane layout is not squeezed into a narrow room. A window that does not fit the card is drawn smaller and whole, as "Wide" is on the desktop, and the line under the selector says the scale; where it would have to be drawn smaller than 60%, as "Wide" would on a phone, it keeps its own size and scrolls sideways.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.adaptive.byHeight
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.adaptive.responsive
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
SignInScreen(
    modifier = Modifier
        .fillMaxWidth()
        // The frame's height follows the window too: on a phone on its side the page itself is short.
        .height(window.byHeight(compact = 300.dp, medium = 460.dp))
)

@Composable
internal fun SignInScreen(modifier: Modifier = Modifier) {
    val window = PantrixTheme.window
    PantrixSurface(
        modifier = modifier,
        shape = PantrixTheme.shapes.lg,
        border = PantrixTheme.colors.border
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // An extra that comes and goes and has nothing to remember: a plain `if` is enough.
            if (!window.isNarrow) {
                MarketingPanel(
                    modifier = Modifier
                        // A value by class: an equal share with the form from Compact to Expanded, wider from Large on.
                        // Medium and Expanded are left out and take Compact's value.
                        .weight(window.byWidth(compact = 1f, large = 1.25f))
                        .fillMaxHeight()
                )
            }
            SignInForm(modifier = Modifier.weight(1f).fillMaxHeight())
        }
    }
}

@Composable
private fun MarketingPanel(modifier: Modifier = Modifier) {
    val window = PantrixTheme.window
    val typography = PantrixTheme.typography
    // A surface whose ground is the brand's container: it gives its text the colour paired with that ground by itself.
    PantrixSurface(
        modifier = modifier,
        color = PantrixTheme.colors.primary.container,
        shape = PantrixTheme.shapes.none
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                // A single value without the window at hand: `responsive` is `byWidth` of the theme's window.
                .padding(responsive(compact = 16.dp, medium = 24.dp, large = 40.dp)),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md, Alignment.CenterVertically)
        ) {
            PantrixText(
                text = "Get on the same page as your team",
                // The type style is a value picked by class too.
                style = window.byWidth(compact = typography.title, large = typography.headline),
                tagKey = "marketing_title"
            )
            PantrixText(text = "Manage orders, stock and customers from one place.")
            // A short window, that is a phone on its side: enough width, but not enough height. The items go.
            if (!window.isShort) {
                BENEFITS.forEachIndexed { index, benefit -> Benefit(text = benefit, tagKey = "benefit_$index") }
            }
        }
    }
}

@Composable
private fun Benefit(
    text: String,
    tagKey: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null)
        PantrixText(text = text, tagKey = tagKey)
    }
}

@Composable
private fun SignInForm(modifier: Modifier = Modifier) {
    val window = PantrixTheme.window
    val spacing = PantrixTheme.spacing
    var email by rememberSaveable { mutableStateOf("") }
    val password = remember { TextFieldState() }
    var keepSignedIn by rememberSaveable { mutableStateOf(true) }
    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        Column(
            modifier = Modifier
                .widthIn(max = 360.dp)
                .verticalScroll(rememberScrollState())
                .padding(responsive(compact = 16.dp, medium = 24.dp)),
            // A value by height: in a short window the rows draw closer together.
            verticalArrangement = Arrangement.spacedBy(window.byHeight(compact = spacing.sm, medium = spacing.md))
        ) {
            PantrixText(text = "Sign in", style = PantrixTheme.typography.title)
            PantrixTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier.fillMaxWidth(),
                label = "Email",
                placeholder = "name@example.com",
                tagKey = "sign_in_email"
            )
            PantrixSecureTextField(
                state = password,
                modifier = Modifier.fillMaxWidth(),
                label = "Password",
                tagKey = "sign_in_password"
            )
            PantrixCheckbox(
                checked = keepSignedIn,
                onCheckedChange = { keepSignedIn = it },
                label = "Remember me",
                tagKey = "keep_signed_in"
            )
            PantrixButton(text = "Sign in", onClick = {}, fullWidth = true, tagKey = "sign_in")
            PantrixLink(text = "Forgot password?", onClick = {}, tagKey = "forgot_password")
        }
    }
}

private val BENEFITS = listOf("Real-time stock", "One-click invoices", "Team notes")
```

### A field called from two places and from one

This screen's real lesson, with a single field. The upper field is called from two separate places, one for the narrow layout and one for the wide; Compose counts them as two separate fields. The lower one is the same call in every layout: only the marketing panel beside it comes and goes.

Type something into both fields, then switch between "Narrow" and "Wide" in the card's window selector: the field called from two places is emptied, and the one called from one place keeps what you typed. For a user, the first is the email they typed being wiped when they turn the phone.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

val narrow = PantrixTheme.window.isNarrow
val spacing = PantrixTheme.spacing
// WRONG: the field is called from two separate places. What was typed is wiped when the window changes class.
if (narrow) {
    EmailField(label = "Called from two places", tagKey = "two_sites_email", modifier = Modifier.fillMaxWidth())
} else {
    Row(horizontalArrangement = Arrangement.spacedBy(spacing.md), verticalAlignment = Alignment.Bottom) {
        MarketingStub(modifier = Modifier.weight(1f))
        EmailField(label = "Called from two places", tagKey = "two_sites_email", modifier = Modifier.weight(1f))
    }
}
// RIGHT: the field is the same call in every layout. What comes and goes is the marketing panel beside it.
Row(horizontalArrangement = Arrangement.spacedBy(spacing.md), verticalAlignment = Alignment.Bottom) {
    if (!narrow) MarketingStub(modifier = Modifier.weight(1f))
    EmailField(label = "Called from one place", tagKey = "one_site_email", modifier = Modifier.weight(1f))
}

@Composable
private fun EmailField(
    label: String,
    tagKey: String,
    modifier: Modifier = Modifier
) {
    var email by rememberSaveable { mutableStateOf("") }
    PantrixTextField(
        value = email,
        onValueChange = { email = it },
        modifier = modifier,
        label = label,
        tagKey = tagKey
    )
}

@Composable
private fun MarketingStub(modifier: Modifier = Modifier) {
    PantrixSurface(modifier = modifier, color = PantrixTheme.colors.primary.container) {
        PantrixText(text = "Marketing", modifier = Modifier.padding(PantrixTheme.spacing.md))
    }
}
```

## API

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Whether the window is narrow: its width class is `WindowWidthClass.Compact`, as a phone held upright is. The layout of one pane, with its navigation along the bottom.

A name for `widthClass == WindowWidthClass.Compact`, for code that reads as the rule it follows: `if (window.isNarrow) BottomBar()`. For "from this width on", compare the class: `widthClass >= Expanded`.

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isShort: Boolean
```

Whether the window is short: its height class is `WindowHeightClass.Compact`, as a phone on its side is. Such a window is often wide, Medium or Expanded by its width, and has no height to stack bars in: the main action goes to the header and not to a bar along the bottom, and nothing opens from the bottom edge.

A name for `heightClass == WindowHeightClass.Compact`:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

The value of this window's width class. A class left out takes the value of the class below it, so a layout names only the widths it changes at:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parameters:

- `compact: T`: the value in a Compact window, the narrowest class.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window; `medium`'s where it is left out.
- `large: T`: the value in a Large window; `expanded`'s where it is left out.
- `extraLarge: T`: the value in an ExtraLarge window, the widest class; `large`'s where it is left out.

### PantrixWindow.byHeight

`import com.pantrixui.foundation.adaptive.byHeight`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byHeight(
    compact: T,
    medium: T = compact,
    expanded: T = medium
): T
```

The value of this window's height class. A class left out takes the value of the class below it:

```kotlin
val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
```

Parameters:

- `compact: T`: the value in a Compact window, the shortest class: a phone held sideways.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window, the tallest class; `medium`'s where it is left out.

### responsive

`import com.pantrixui.foundation.adaptive.responsive`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun <T> responsive(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

The value of the width class of the window in effect: `byWidth` of `PantrixTheme.window` in one word, for a composable that needs a value and not the window. A class left out takes the value of the class below it:

```kotlin
val columns = responsive(compact = 2, medium = 4)
val cardPadding = responsive(compact = 12.dp, medium = 16.dp, large = 20.dp)
```

The page's margin and the gutter between its columns need no picking: `PantrixTheme.layout` has them by class. The caller is composed again when the class changes and not as the window is resized within it. It goes by the width alone; for the height, and outside a composable, ask the window: `byHeight`, `byWidth`.

Parameters:

- `compact: T`: the value in a Compact window, the narrowest class.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window; `medium`'s where it is left out.
- `large: T`: the value in a Large window; `expanded`'s where it is left out.
- `extraLarge: T`: the value in an ExtraLarge window, the widest class; `large`'s where it is left out.

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
interface PantrixWindow
```

The window the content is drawn in, as a layout needs to know it: how wide and how tall it is, and how its device is folded. `PantrixTheme` provides it, and `PantrixTheme.window` reads it: nothing is set up for it.

It is the window, not the device and not the screen: an app in half of a split screen, in a resized desktop window or in a browser tab is as wide as that. A layout asks the class rather than the size:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

The window is one object for as long as the theme stands, and its values are read when asked. Whoever reads `widthClass` or `heightClass` is composed again when the class changes and not before; whoever reads `size` follows every change, each frame of a rotation and each pixel of a dragged window edge.

A component that is a pane of its own, a scaffold or a sheet, measures the room it is given rather than asking the window: inside a narrow pane the window is still wide. `BoxWithPantrixWindow` tells a component that room as a window.

On the desktop and on the web the window has no size yet when its content is first composed, and that one composition finds a Compact window; Android and iOS tell the size from the start. Read the class where it is used rather than keeping what it was at first.

Members:

- `size: DpSize`: The window's size. On Android it is the window with its system bars; on the web, the box the app is drawn in. Zero, or unspecified, until the platform has told it: the classes are Compact until then.
- `isSizeKnown: Boolean`: Whether the platform has told the window's size: both its width and its height.

  True from the first composition on Android and iOS. False in the first composition on the desktop and on the web, where the content is composed once before the window has a size, and true from the next one on. Until then the window reads as Compact both ways, so whatever is decided once and kept, a start page or a remembered choice, waits for this:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  A reader is composed again when the answer changes, and not as the window is resized.
- `widthClass: WindowWidthClass`: The class of the window's width: what the layout is chosen by.
- `heightClass: WindowHeightClass`: The class of the window's height: `WindowHeightClass.Compact` is a phone on its side.
- `posture: WindowPosture`: How the window's device is folded; `WindowPosture.Flat` where there is no fold.
- `verticalBar: WindowVerticalBar?`: The column the system keeps along one side of the window for bars that stand upright, or null where it keeps none, as on every screen but the iPhone Duo's outer one. Its places are in the window's coordinates: a layout asks where it stands beside it with `rememberVerticalBarInNode`.
- `breakpoints: PantrixBreakpoints`: Where this window's classes begin: the bounds it is classed by. A size classed by hand goes by the same bounds, as `BoxWithPantrixWindow` classes the room a component is given:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

A window of fixed values, for where the real one is not the answer: a test or a preview of a layout at a size, and Compose embedded in a part of a native screen, where the room is that part's.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

A `verticalBar` given in pixels draws what a screen with the system's column looks like, the iPhone Duo's outer one, where there is none.

Parameters:

- `size: DpSize`: the window's size, which its width and height classes come from.
- `posture: WindowPosture`: how the window's device is folded: flat, as every device with no fold is, unless a fold is given.
- `breakpoints: PantrixBreakpoints`: the widths and heights each class starts at: Android's window size classes unless the product has its own.
- `verticalBar: WindowVerticalBar?`

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowWidthClass
```

How wide a window is, as one of five classes a layout chooses by: the shape of its navigation, the number of its panes, the columns of a grid.

The classes are in order, so a rule that holds from a width on is a comparison: `widthClass >= WindowWidthClass.Expanded`. `PantrixBreakpoints` says where each begins.

Entries:

- `Compact`: Narrower than 600dp: a phone held upright, a foldable's cover screen, a narrow browser window.
- `Medium`: From 600dp: an open foldable, a tablet held upright, a split view.
- `Expanded`: From 840dp: a tablet on its side, and most phones on theirs (see `WindowHeightClass.Compact`).
- `Large`: From 1200dp: a desktop window, a browser, a large tablet.
- `ExtraLarge`: From 1600dp: a wide desktop window, an external display.

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowHeightClass
```

How tall a window is, as one of three classes.

A layout follows the width first. The height says when there is no room to stack things: a `Compact` window is a phone on its side, as wide as a tablet and less than half as tall, where each bar laid across the screen takes a seventh of it.

Entries:

- `Compact`: Shorter than 480dp: a phone on its side.
- `Medium`: From 480dp: most phones held upright, a tablet on its side.
- `Expanded`: From 900dp: a tablet held upright, a desktop window, and a tall phone held upright.
