# Button

The button that starts an action: save, send, delete. It is the most pressed component of a screen, and on every platform it is drawn in that platform's own geometry: its corners are fully rounded on Android, desktop and the web, and medium rounded on iOS.

- `PantrixButton` (`com.pantrixui.components.elements.button`, `com.pantrixui:components`): The primary action trigger: six variants, five sizes, a loading state and form submission. Keywords: action, submit, call to action, cta, loading, destructive.

## Features

- **Six variants.** `variant` says how prominent the button is: the one primary action on a screen is `Solid`, secondary actions are `Outline`, `Soft` and `Subtle`, tertiary actions are `Text`, and an action that cannot be undone is `Destructive`.
- **Five sizes.** `size` picks the height, the padding and the label's text style together: from 24dp to 56dp, in steps of 8dp. The height is a minimum height: when the system's text size is made larger, the button grows with its label.
- **Icons.** `leadingIcon` stands before the label and `trailingIcon` after it, and both take the label's colour.
- **Loading.** `loading` shows a spinner in place of the leading icon and stops presses until the action is done.
- **Form.** A press on a button given a `form` validates the form first: while a field is invalid `onClick` is not called, and that field takes the focus. While the form is being submitted, the button shows as loading by itself.
- **In any role.** The default colour is the theme's `primary` role, and for `Destructive` the `danger` role; `PantrixColor.buttonColors(variant)` gives the same variant in another role, and `ButtonColors` gives it in a colour entirely its own.
- **Content of its own.** There is a second `PantrixButton` that takes content instead of a label: a counter, two lines, a badge. In that one `contentDescription` is required.
- **Accessibility.** `contentDescription` is read in place of the label, not after it: give one only where the label does not say what the button does, as a "+" does not.

## Usage

### Primary action

```kotlin
PantrixButton(
    text = stringResource(Res.string.save),
    onClick = onSave,
    tagKey = "save"
)
```

### Submitting a form

```kotlin
val form = rememberFormState()
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.save),
    onClick = { scope.launch { form.submit { repository.save() } } },
    form = form,
    tagKey = "save"
)
```

### A destructive action beside its cancel

```kotlin
PantrixButton(
    text = stringResource(Res.string.cancel),
    onClick = onDismiss,
    variant = ButtonVariant.Text,
    tagKey = "cancel"
)
PantrixButton(
    text = stringResource(Res.string.delete),
    onClick = onDelete,
    variant = ButtonVariant.Destructive,
    tagKey = "delete"
)
```

### With an icon before the label

```kotlin
PantrixButton(
    text = stringResource(Res.string.new_folder),
    onClick = onNewFolder,
    variant = ButtonVariant.Outline,
    leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Folder, contentDescription = null) },
    tagKey = "new_folder"
)
```

## Examples

### Variants

`variant` picks the button's colour and how prominent it is. A screen has one `Solid`: the eye goes to it first. `Outline`, `Soft` and `Subtle` are secondary actions; `Text` is a tertiary action with no surface, like "Cancel". `Destructive` says the action cannot be undone, and is never the only button of a dialog.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    ButtonVariant.entries.forEach { variant ->
        PantrixButton(text = variant.name, onClick = {}, variant = variant, tagKey = "variant_${variant.name}")
    }
}
```

### Sizes

`size` picks one of five heights: 24, 32, 40, 48 and 56 dp. The default is `Medium`. The two ends are for particular places: `ExtraSmall` in a dense table row or beside a field, `ExtraLarge` for the single action a phone screen is built around.

The height is the button's minimum height. When the system's text size is made larger and the label becomes taller than the button, the button grows with it and the label is not cut.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    ButtonSize.entries.forEach { size ->
        PantrixButton(
            text = size.name,
            onClick = {},
            variant = ButtonVariant.Outline,
            size = size,
            tagKey = "size_${size.name}"
        )
    }
}
```

### Buttons with icons

`leadingIcon` stands before the label and `trailingIcon` after it. The icon is given no colour: it takes the button's content colour by itself. Since it is decoration, its `contentDescription` is null; a screen reader reads the label alone.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "New folder",
        onClick = {},
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Folder, contentDescription = null) },
        tagKey = "new_folder"
    )
    PantrixButton(
        text = "Continue",
        onClick = {},
        variant = ButtonVariant.Soft,
        trailingIcon = { PantrixIcon(imageVector = PantrixIcons.ArrowForward, contentDescription = null) },
        tagKey = "continue"
    )
    PantrixButton(
        text = "Refresh",
        onClick = {},
        variant = ButtonVariant.Outline,
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Refresh, contentDescription = null) },
        tagKey = "refresh"
    )
}
```

### Loading and disabled

`loading` shows a spinner in place of the leading icon and stops presses until the action is done: the same action does not start twice. Press "Save": it shows as loading for two seconds, then the app's snackbar lets you know.

`enabled = false` draws the button faded, and the button takes no press. The two are not the same thing: a loading button says an action is under way, a disabled one that the action cannot be done right now.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

val snackbars = LocalPantrixSnackbars.current
var saving by remember { mutableStateOf(false) }
LaunchedEffect(saving) {
    if (saving) {
        delay(SAVE_MILLIS)
        saving = false
        snackbars?.show(message = "Saved")
    }
}
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Save", onClick = { saving = true }, loading = saving, tagKey = "save")
    PantrixButton(text = "Loading", onClick = {}, variant = ButtonVariant.Outline, loading = true, tagKey = "loading_outline")
    PantrixButton(text = "Disabled", onClick = {}, enabled = false, tagKey = "disabled")
    PantrixButton(text = "Disabled", onClick = {}, variant = ButtonVariant.Outline, enabled = false, tagKey = "disabled_outline")
}

private const val SAVE_MILLIS = 2_000L
```

### Full width

`fullWidth` stretches the button to the width of the space it is in: the submit button under a form, the two buttons of a sheet. Here the column is 360dp at most, and the buttons fill it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

Column(
    modifier = Modifier.widthIn(max = 360.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Complete order", onClick = {}, size = ButtonSize.Large, fullWidth = true, tagKey = "complete_order")
    PantrixButton(text = "Back to shopping", onClick = {}, variant = ButtonVariant.Text, fullWidth = true, tagKey = "back_to_shop")
}
```

### In another role and in a colour of its own

A variant's colours come from the theme's `primary` role, and `Destructive`'s from the `danger` role. `PantrixColor.buttonColors(variant)` gives the same variant in another role: the top row is four variants in the `success` role.

The colour of the button in the bottom row is in none of the theme's roles: `ButtonColors` takes the fill, the content's colour and, if wanted, the edge directly.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.foundation.theme.PantrixTheme

val success = PantrixTheme.colors.success
val own = ownColors()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    listOf(ButtonVariant.Solid, ButtonVariant.Soft, ButtonVariant.Outline, ButtonVariant.Text).forEach { variant ->
        PantrixButton(
            text = "Approve",
            onClick = {},
            colors = success.buttonColors(variant),
            tagKey = "confirm_${variant.name.lowercase()}"
        )
    }
}
PantrixButton(
    text = "Join the campaign",
    onClick = {},
    colors = ButtonColors(container = own.color, content = own.onColor),
    tagKey = "own_colors"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Shape and style

`shape` changes the corners of one button: one of the theme's shapes, or any `Shape`. `style` changes the button's geometry: here, with `pressedScale`, a button that shrinks while it is pressed. Only the fields that are given change; the rest comes from the theme's and the platform's style.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Square", onClick = {}, shape = PantrixTheme.shapes.none, tagKey = "square")
    PantrixButton(text = "Slightly rounded", onClick = {}, shape = PantrixTheme.shapes.sm, tagKey = "rounded")
    PantrixButton(text = "Fully rounded", onClick = {}, shape = PantrixTheme.shapes.full, tagKey = "pill")
    PantrixButton(
        text = "Shrinks when pressed",
        onClick = {},
        variant = ButtonVariant.Soft,
        style = ButtonStyle(pressedScale = 0.94f),
        tagKey = "press_scale"
    )
}
```

### Content of its own

The `PantrixButton` that takes content instead of a label: the content is a row (`RowScope`) and is drawn in the button's content colour. Here a counter beside the label goes up with every press.

In this form `contentDescription` is required: whatever is in the button, a screen reader reads one sentence, "Like, 12 likes".

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var likes by rememberSaveable { mutableIntStateOf(12) }
PantrixButton(
    onClick = { likes += 1 },
    contentDescription = "Like, $likes likes",
    variant = ButtonVariant.Soft,
    tagKey = "like"
) {
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
    PantrixText(text = "Like")
    PantrixText(text = likes.toString(), style = PantrixTheme.typography.footnote)
}
```

### A button that submits a form

A button given a `form` is the form's submit button. A press validates the form first: while the field is empty `onClick` is not called, and the field shows its error and takes the focus. If the form is valid, `form.submit` runs, and while it does the button shows as loading by itself: `loading` is not given separately.

Leave the field empty and press "Invite", then type a name and try again.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
Column(
    modifier = Modifier.widthIn(max = 360.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(
        field = form.field("name", initial = "", Rules.notBlank("Enter the name of the person to invite")),
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "Name"
    )
    PantrixButton(
        text = "Invite",
        onClick = {
            scope.launch {
                form.submit {
                    delay(SAVE_MILLIS)
                    snackbars?.show(message = "Invitation sent")
                }
            }
        },
        form = form,
        tagKey = "invite"
    )
}

private const val SAVE_MILLIS = 2_000L
```

## API

### PantrixButton

`import com.pantrixui.components.elements.button.PantrixButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Solid,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    loading: Boolean = false,
    fullWidth: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    style: ButtonStyle? = null,
    shape: Shape = PantrixTheme.style(key = ButtonStyle, override = style).shape.toShape(),
    colors: ButtonColors = variant.colors(),
    contentDescription: String? = null,
    form: FormState? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A button with a text label, the form most buttons take.

`variant` picks the colours and `size` the height, padding and label type. `style` overrides the theme's `ButtonStyle` for this button alone: its shape, pressed scale and per-size geometry. The height is the least the button is tall: where a reader's larger type makes the label taller than that, the button grows with it. A pointer over the button lays a light cover of its content colour on it, and a press a stronger one, so that a mouse shows what a click would press.

`loading` shows a spinner in place of `leadingIcon` and stops clicks, as a submitting `form` does. Given a `form`, a click validates it first: while a field is invalid, `onClick` is not called, and that field takes focus with an error haptic.

`contentDescription` is read in place of `text`, and not after it: give one only where the label alone does not say what the button does, as a "+" does not.

Parameters:

- `text: String`
- `onClick: () -> Unit`
- `modifier: Modifier`: the button's modifier.
- `variant: ButtonVariant`
- `size: ButtonSize`
- `enabled: Boolean`: whether the button can be pressed: one that cannot is drawn in the disabled colours and does nothing.
- `loading: Boolean`
- `fullWidth: Boolean`: true stretches the button across the width it is given, its content in the middle.
- `leadingIcon: (@Composable () -> Unit)?`
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the label: an arrow, or a count.
- `style: ButtonStyle?`
- `shape: Shape`: the button's corners: by default the resolved style's. Given here, it wins over `style`'s.
- `colors: ButtonColors`: this call's own colours, in place of `variant`'s.
- `contentDescription: String?`
- `form: FormState?`
- `tagKey: String?`: the button's automation key: the button is `Button_<tagKey>`, and without one a key of where it is called. Visible text is never the key.
- `interactionSource: MutableInteractionSource?`: the button's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixButton

`import com.pantrixui.components.elements.button.PantrixButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixButton(
    onClick: () -> Unit,
    contentDescription: String,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Solid,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    loading: Boolean = false,
    fullWidth: Boolean = false,
    style: ButtonStyle? = null,
    shape: Shape = PantrixTheme.style(ButtonStyle, style).shape.toShape(),
    colors: ButtonColors = variant.colors(),
    form: FormState? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    content: @Composable RowScope.() -> Unit
)
```

Slot form, for content a string cannot express.

`contentDescription` is required here rather than optional, because without the text parameter there is nothing left for a screen reader to fall back on. It is all a screen reader hears of the button: what is in `content` is drawn, and not read after it. `style` is the text form's.

Parameters:

- `onClick: () -> Unit`: what a press does. Given a `form`, it is called once the form is valid.
- `contentDescription: String`
- `modifier: Modifier`: the button's modifier.
- `variant: ButtonVariant`: the button's prominence, and the colours that come with it.
- `size: ButtonSize`: the button's height, its padding and the type its label is set in.
- `enabled: Boolean`: whether the button can be pressed: one that cannot is drawn in the disabled colours and does nothing.
- `loading: Boolean`: whether the button takes no press while what it began is under way, and tells a screen reader it is loading. What `content` shows meanwhile is the caller's.
- `fullWidth: Boolean`: true stretches the button across the width it is given, its content in the middle.
- `style: ButtonStyle?`
- `shape: Shape`: the button's corners: by default the resolved style's. Given here, it wins over `style`'s.
- `colors: ButtonColors`: this call's own colours, in place of `variant`'s.
- `form: FormState?`: the form the button submits: a press validates it first, and the button takes no press while it is submitting.
- `tagKey: String?`: the button's automation key: the button is `Button_<tagKey>`, and without one a key of where it is called. Visible text is never the key.
- `interactionSource: MutableInteractionSource?`: the button's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.
- `content: @Composable RowScope.() -> Unit`

### ButtonVariant

`import com.pantrixui.components.elements.button.ButtonVariant`, from `com.pantrixui:components`

```kotlin
enum class ButtonVariant
```

How prominent a button is.

Four of them are a ladder rather than a menu, each one quieter than the one above it: `Solid` is filled in the role's colour, `Soft` in the role's pale container, `Outline` has no fill and an edge, and `Text` has neither. Reading them in that order, which is not the order they are declared in, is how to pick one: go down until the button stops competing with what is around it.

`Subtle` stands on `Soft`'s rung: the same pale fill, with a faint edge in its content colour that keeps the button's shape where the fill alone barely parts from the background.

`Destructive` is not a rung. It says what the button *does*, which is why it is the only variant that changes the colour role, and why it sits at the bottom out of the ladder's reach.

Entries:

- `Solid`: The one primary action on a screen. The default.
- `Outline`: Secondary on a busy surface, where a filled shape would compete.
- `Soft`: Secondary, still clearly a button: a pale fill in the role's container colour.
- `Subtle`: `Soft` with a faint edge, so the shape still shows where the pale fill alone would fade into what is around it.
- `Text`: Tertiary: toolbar actions, "cancel". No surface at all.
- `Destructive`: Destructive and irreversible. Never the only action in a dialog.

### ButtonSize

`import com.pantrixui.components.elements.button.ButtonSize`, from `com.pantrixui:components`

```kotlin
enum class ButtonSize
```

Five heights, stepping by 8dp from 24 to 56.

`Medium` is the default and the one to reach for. The two ends are for the places a default would be wrong rather than for a general sense of scale: `ExtraSmall` inside a dense table row or beside a field, `ExtraLarge` as the single action a phone screen is built around.

Entries:

- `ExtraSmall`: 24dp tall: inside a dense table row, or beside a field.
- `Small`: 32dp tall.
- `Medium`: 40dp tall: the default, and the one to reach for.
- `Large`: 48dp tall.
- `ExtraLarge`: 56dp tall: the single action a phone screen is built around.

### ButtonColors

`import com.pantrixui.components.elements.button.ButtonColors`, from `com.pantrixui:components`

```kotlin
data class ButtonColors(
    public val container: Color,
    public val content: Color,
    public val border: Color = Color.Unspecified
)
```

What a button is painted with. `ButtonVariant.colors` gives a variant's in `primary`, and `PantrixColor.buttonColors` the same prominences in any role.

Parameters:

- `container: Color`: The fill; transparent for an outline or a text button.
- `content: Color`: The label's and the icon's colour.
- `border: Color`: The edge's colour, or `Color.Unspecified` for a button without an edge.

### ButtonVariant.colors

`import com.pantrixui.components.elements.button.colors`, from `com.pantrixui:components`

```kotlin
@Composable
fun ButtonVariant.colors(): ButtonColors
```

The variant's colours, from the theme's `primary` role, and `danger` for `ButtonVariant.Destructive`. The default `colors` of `PantrixButton`; `ButtonColors` of your own override it for one button.

`ButtonVariant.Outline` and `ButtonVariant.Text` have no fill of their own. On a fill that says what is written on it, a top bar of the brand's colour, they are written as it is, their edge too, where the theme's `primary` would hardly be told from the fill. On the theme's own grounds they keep `primary`.

### PantrixColor.buttonColors

`import com.pantrixui.components.elements.button.buttonColors`, from `com.pantrixui:components`

```kotlin
fun PantrixColor.buttonColors(variant: ButtonVariant = ButtonVariant.Solid): ButtonColors
```

The same prominences, drawn from any role instead of from `primary`.

`ButtonVariant.Destructive.colors()` stays the way to say "this deletes something", and it keeps its own meaning: a variant is what the button *is*. This is only what it is *painted with*, for a button that carries a status — "Mark as paid" in `success`, "Retry" in `warning` — so `ButtonVariant.Destructive` here paints exactly like `ButtonVariant.Solid` rather than quietly ignoring the role it was handed.

`ButtonVariant.Subtle` is `ButtonVariant.Soft` with an edge here too, and the edge is all that tells the two apart. It is drawn in the role's own colour at full strength, where the default draws `primary.onContainer` at 30%.

```kotlin
PantrixButton(
    text = stringResource(Res.string.mark_paid),
    onClick = onMarkPaid,
    colors = PantrixTheme.colors.success.buttonColors(),
    tagKey = "mark_paid"
)
```

Parameters:

- `variant: ButtonVariant`: the prominence the colours are for: `ButtonVariant.Solid` unless told.

### ButtonStyle

`import com.pantrixui.components.elements.button.ButtonStyle`, from `com.pantrixui:components`

```kotlin
class ButtonStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val pressedScale: Float = Float.NaN,
    public val extraSmall: ButtonSizeStyle = ButtonSizeStyle(),
    public val small: ButtonSizeStyle = ButtonSizeStyle(),
    public val medium: ButtonSizeStyle = ButtonSizeStyle(),
    public val large: ButtonSizeStyle = ButtonSizeStyle(),
    public val extraLarge: ButtonSizeStyle = ButtonSizeStyle()
) : PantrixStyle<ButtonStyle>
```

`PantrixButton`'s geometry: its shape, its press feedback, and a height, padding and icon size for each `ButtonSize`. `PantrixIconButton` reads the sizes only.

The sizes are the same on every platform; the shape and the press scale are not.

Parameters:

- `shape: ShapeSpec`: The button's shape: `ShapeRole.Full` on Android, desktop and the web, `ShapeRole.Medium` on iOS.
- `pressedScale: Float`: Scale while pressed. `1f` means none: the state layer carries the feedback.
- `extraSmall: ButtonSizeStyle`: `ButtonSize.ExtraSmall`'s geometry.
- `small: ButtonSizeStyle`: `ButtonSize.Small`'s geometry.
- `medium: ButtonSizeStyle`: `ButtonSize.Medium`'s geometry.
- `large: ButtonSizeStyle`: `ButtonSize.Large`'s geometry.
- `extraLarge: ButtonSizeStyle`: `ButtonSize.ExtraLarge`'s geometry.

### ButtonSizeStyle

`import com.pantrixui.components.elements.button.ButtonSizeStyle`, from `com.pantrixui:components`

```kotlin
class ButtonSizeStyle(
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<ButtonSizeStyle>
```

One `ButtonSize`'s height, horizontal padding and icon size.

Parameters:

- `height: Dp`: The button's height.
- `horizontalPadding: Dp`: The space between the button's sides and its content.
- `iconSize: Dp`: The size of an icon button's icon, of the icon of a button in a group, of the cross that closes an alert or a sheet, and of a button's spinner while it loads. An icon put in a button's own slot is as large as it is made.
