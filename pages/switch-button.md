# Switch Button

A setting that is on or off and takes effect at once: a track, a thumb that slides on it, and the label beside it. Notifications, Wi-Fi, battery saver and the like. An answer that can be wrong is for a checkbox: a switch is a setting.

The switch changes nothing by itself: it is what `checked` says. A press, a key and a drag report the value asked for through `onCheckedChange`; the caller holds the state.

- `PantrixSwitchButton` (`com.pantrixui.components.elements.switchbutton`, `com.pantrixui:components`): An on/off setting that takes effect at once, with a label, supporting text and a thumb that can be dragged, controlled or bound to a form's field. Keywords: toggle, on off, setting, preference, flag.

## Features

- **One target.** The track, the label and the supporting text are one target: a press on the words turns the switch too. The row takes the platform's touch target, small as the track is.
- **Dragging the thumb.** Let go past the middle of the track, the thumb turns the switch on, and short of the middle it turns it off; let go on the side it started from, it settles back and nothing is reported. The drag runs with the reading direction: in a right-to-left layout the on end is on the left.
- **Platform.** On Android the thumb grows from off to on, and further while it is held. On iOS, the desktop and the web it is one size; on iOS it is always white, there is a shadow under it, and the track has no edge.
- **Screen reader.** One switch is read: its name is its label, and whether it is on or off is said in the theme's language. A switch with no label gets its name from `contentDescription`.
- **Error.** `error` turns only the supporting text to the theme's `danger` role, and a screen reader is told. The switch itself keeps its colours.
- **Form.** The `PantrixSwitchButton` that takes a `field` gets its value, its error and its name from the form's field. The rule's message shows after the first change or on an attempt to submit the form, and takes the place of the supporting text.
- **Read-only and disabled.** With a null `onCheckedChange` the switch is read-only: it takes no press, no drag and no focus, and still says its name and its state. `enabled = false` draws the switch in the disabled colours.
- **Its own colours.** `SwitchColors` takes the colour of the track on and off, of the thumb on and off, and of the edge, each on its own; one that is left out stays the theme's role. A disabled switch is drawn in the theme's colours even when it is given colours.
- **Style.** `SwitchStyle` gives the track's width and height, the thumb's size off, on and pressed, the edge's width and the thumb's shadow. `labelStyle` gives the label's type; the track stands on its first line.
- **The switch at the end.** `controlPosition = ControlPosition.End` puts the track at the end of the label, as a settings screen has it: given a width, the row has the track at its end, and the label wraps in the room left.
- **Motion.** The thumb slides, and the track turns to the `primary` colour with it. In a theme with reduced motion both happen at once.

## Usage

### Controlled

```kotlin
var notifications by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = notifications,
    onCheckedChange = { notifications = it },
    label = stringResource(Res.string.notifications),
    supportingText = stringResource(Res.string.notifications_help),
    tagKey = "notifications"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
val marketing = form.field("marketing", initial = false)
PantrixSwitchButton(field = marketing, label = stringResource(Res.string.marketing_emails))
```

### Without a label, at the end of a row that has the words

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = stringResource(Res.string.wifi), modifier = Modifier.weight(1f))
    PantrixSwitchButton(
        checked = wifi,
        onCheckedChange = onWifiChange,
        contentDescription = stringResource(Res.string.wifi),
        tagKey = "wifi"
    )
}
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixSwitchButton(
    checked = batterySaver,
    onCheckedChange = { batterySaver = it },
    label = stringResource(Res.string.battery_saver),
    colors = SwitchColors(checkedTrack = success.color, checkedThumb = success.onColor),
    tagKey = "battery_saver"
)
```

## Examples

### Label and supporting text

At its plainest: the state is read from `checked`, and `onCheckedChange` reports the value asked for. The track, the label and the supporting text are one target: a press on the words turns the switch too.

Drag the thumb: let go of it past the middle of the track and the switch turns. Let go short of the middle and it settles back, and nothing is reported.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var notifications by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = notifications,
    onCheckedChange = { notifications = it },
    label = "Notifications",
    supportingText = "Order updates and reminders",
    tagKey = "notifications"
)
```

### Without a label: in a row of the app's own

A row with the words at its start and the switch at its end is a row of the app's own: the words are a `PantrixText` of their own, and the switch has no label. `contentDescription` tells a screen reader the switch's name.

In this layout the words are no part of the target: what is pressed is the switch and the touch target kept around it.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText

var wifi by rememberSaveable { mutableStateOf(false) }
Row(modifier = Modifier.widthIn(max = 360.dp), verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Wi-Fi", modifier = Modifier.weight(1f))
    PantrixSwitchButton(
        checked = wifi,
        onCheckedChange = { wifi = it },
        contentDescription = "Wi-Fi",
        tagKey = "wifi"
    )
}
```

### Error

`error` turns the supporting text to the theme's `danger` role, and a screen reader is told the input is invalid. The switch itself keeps its colours: a switch is a setting, and an answer that can be wrong belongs to a checkbox.

Here the example works the error out itself: `error` is true while the switch is off. Turn the switch on: the text goes back to the colour it had.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var location by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = location,
    onCheckedChange = { location = it },
    label = "Location",
    supportingText = if (location) "Stores near you are shown" else "Stores cannot be searched while location is off",
    error = !location,
    tagKey = "location"
)
```

### A setting bound to a form

The `PantrixSwitchButton` that takes a `field` is bound to a form's field: its value, its error and its name come from the field; `checked` and `onCheckedChange` are not given. The field's id is the automation key: the test tag is `SwitchButton_two_step`.

Press "Save" while two-step sign-in is off: the message of the `Rules.mustBeTrue` rule takes the place of the supporting text, and the focus goes to the switch. Turn the switch on and try again: the app's snackbar says the settings were saved.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixSwitchButton(
    field = form.field("two_step", initial = false, Rules.mustBeTrue("Your organisation requires this")),
    label = "Two-step sign-in",
    supportingText = "A code is sent by text message at every sign-in"
)
PantrixButton(
    text = "Save",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Settings saved", tagKey = "saved") } }
    },
    form = form,
    tagKey = "save_settings"
)
```

### Disabled and read-only

`enabled = false` draws the switch in the disabled colours: it takes no press and no drag, and a screen reader is told it is disabled. The thumb's place still shows whether it is on or off.

With `onCheckedChange = null` the switch is read-only: it takes no press, no drag and no focus, its colours do not change, and it still says its name and its state.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

PantrixSwitchButton(checked = true, onCheckedChange = {}, enabled = false, label = "Disabled", tagKey = "off")
PantrixSwitchButton(
    checked = true,
    onCheckedChange = null,
    label = "Read-only",
    supportingText = "Cannot be turned; it only shows its state",
    tagKey = "read_only"
)
```

### Its own colours

`colors` changes only the fields it is given: here the colours of the track and of the thumb while the switch is on. Turn the switch off: the track, the thumb and the edge are in the theme's colours. In between, the track and the thumb turn from one colour to the other as the thumb slides.

The app's purple is in none of the theme's roles; the colour of the thumb on such a track is the caller's to give as well. A disabled switch is drawn in the theme's colours even when it is given colours.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.switchbutton.SwitchColors

val own = ownColors()
var batterySaver by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = batterySaver,
    onCheckedChange = { batterySaver = it },
    label = "Battery saver",
    supportingText = "When on, the track's and the thumb's colours are given from outside; when off, they are the theme's",
    colors = SwitchColors(checkedTrack = own.color, checkedThumb = own.onColor),
    tagKey = "battery_saver"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Style

`style` changes the geometry of one switch. Only the fields that are given change; the rest comes from the theme's and the platform's style.

The first switch is given three fields of the iOS style and is drawn so on every platform: the thumb is always white (`thumbAlwaysLight`), with a shadow under it (`thumbShadow`), and the track has no edge when it is off (`strokeWidth = 0.dp`). The second is a larger track: the track's width and height and the thumb's size in its three states are given together. Its label is set by `labelStyle` in the theme's `callout`, in bold; the track stands on that type's first line.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.switchbutton.SwitchStyle
import com.pantrixui.foundation.theme.PantrixTheme

var lightThumb by rememberSaveable { mutableStateOf(true) }
var largeTrack by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = lightThumb,
    onCheckedChange = { lightThumb = it },
    label = "White thumb, with a shadow and no edge",
    style = SwitchStyle(strokeWidth = 0.dp, thumbAlwaysLight = true, thumbShadow = 2.dp),
    tagKey = "light_thumb"
)
PantrixSwitchButton(
    checked = largeTrack,
    onCheckedChange = { largeTrack = it },
    label = "Large track",
    style = SwitchStyle(
        trackWidth = 64.dp,
        trackHeight = 36.dp,
        thumbSizeOff = 28.dp,
        thumbSizeOn = 28.dp,
        thumbSizePressed = 28.dp
    ),
    tagKey = "large_track",
    labelStyle = PantrixTheme.typography.callout.copy(fontWeight = FontWeight.Bold)
)
```

### The switch at the end

A settings screen: the track at the end of the label (`controlPosition = ControlPosition.End`). The rows take the column's width (`Modifier.fillMaxWidth()`), the tracks stand one under another at the column's end, and a long label wraps in the room left.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.selection.ControlPosition
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var wifi by rememberSaveable { mutableStateOf(true) }
var saver by rememberSaveable { mutableStateOf(false) }
Column(Modifier.widthIn(max = 360.dp)) {
    PantrixSwitchButton(
        checked = wifi,
        onCheckedChange = { wifi = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Wi-Fi",
        tagKey = "wifi_end",
        controlPosition = ControlPosition.End
    )
    PantrixSwitchButton(
        checked = saver,
        onCheckedChange = { saver = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Battery saver",
        supportingText = "Cuts back refreshing in the background and some visual effects",
        tagKey = "saver_end",
        controlPosition = ControlPosition.End
    )
}
```

## API

### PantrixSwitchButton

`import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSwitchButton(
    checked: Boolean,
    onCheckedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: SwitchStyle? = null,
    colors: SwitchColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    labelStyle: TextStyle = PantrixTheme.typography.label,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A switch: a setting that is on or off and takes effect at once, and the label it is the switch of.

The track, the label and the supporting text are one target. A press anywhere on them turns the switch, since on a phone the words are most of what a finger can hit, and a screen reader hears one switch, named by its label, that says whether it is on. The track stands on the label's first line, however many lines the label and the supporting text run to. The row takes the platform's touch target, small as the track is.

The thumb can be dragged as well. Let go past the middle of the track, it turns the switch on, and short of the middle it turns it off: a thumb let go on the side it started from settles back and nothing is reported. The drag runs with the reading direction, so right to left the on end is the left one, the end a press sends the thumb to. A press, a key and a drag change the switch in one way, with one haptic and one event.

The thumb slides, and the track turns to the primary role's colour with it, wherever the thumb is: under a finger that drags it too. Both happen at once under reduced motion.

Without `onCheckedChange` the switch is read-only: it takes no press, no drag and no focus, and still says its name and its state. `error` turns the supporting text to the danger role and is announced. The switch itself keeps its colours: a switch is a setting, and an answer that can be wrong belongs to a checkbox.

Parameters:

- `checked: Boolean`: whether the switch is on.
- `onCheckedChange: ((Boolean) -> Unit)?`: called with the value the user asks for, the opposite of `checked`. The switch changes nothing by itself: it is on when `checked` says so. Null makes it read-only.
- `modifier: Modifier`: the row's modifier.
- `enabled: Boolean`: whether the switch can be turned. One that cannot is drawn in the disabled colours and says so.
- `label: String?`: the text beside the track: part of the target, and the switch's name for a screen reader.
- `supportingText: String?`: help under the label, in a smaller type: the message, while `error` is true.
- `error: Boolean`: whether the value is wrong: the supporting text turns to the danger role, and a screen reader is told the input is invalid.
- `style: SwitchStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SwitchColors?`: this switch's own colours: the ones it sets, with the theme's for the rest. A disabled switch keeps the theme's.
- `contentDescription: String?`: what a screen reader says for the switch: its name where it has no `label`, as in a row of the app's own that has the words elsewhere, or in place of the label.
- `tagKey: String?`: the switch's automation key: the row is `SwitchButton_<tagKey>`. A change is reported as a `SwitchButton` event that carries the new value, and never its label.
- `interactionSource: MutableInteractionSource?`: the switch's interactions, hoisted: its presses, its drags and its focus. It keeps a source of its own when this is null.
- `labelStyle: TextStyle`: the type the label is set in: the theme's `label` unless given. The track stands on its first line at any size. A colour in it is the label's while the switch is enabled; a disabled switch writes it in the disabled colour.
- `controlPosition: ControlPosition`: where the track stands: before the label, or after it, as a settings screen has it. After it, the track is at the end of the width the row is given, `Modifier.fillMaxWidth()` lining it up with the others, or right after the label where the row is given none; the label wraps in what the track leaves.

### PantrixSwitchButton

`import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSwitchButton(
    field: FormField<Boolean>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    style: SwitchStyle? = null,
    colors: SwitchColors? = null,
    contentDescription: String? = null,
    labelStyle: TextStyle = PantrixTheme.typography.label,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

A switch bound to a form's field: its value, its error and its name come from `field`.

A change sets the field and marks it touched, so a rule's message shows after the first change, or when the form is submitted, and not on a form nobody has touched. While the field is in error the message takes the place of `supportingText`, rather than standing beside it. The field's id is the switch's automation key, `SwitchButton_<id>`, and the form can send the focus here when it is submitted with this field in error.

It is an overload of its own and not a parameter of the controlled form, so that a value and a field cannot both be given.

Parameters:

- `field: FormField<Boolean>`: the field the switch shows and changes.
- `modifier: Modifier`: the row's modifier.
- `enabled: Boolean`: whether the switch can be turned.
- `label: String?`: the text beside the track: part of the target, and the switch's name for a screen reader.
- `supportingText: String?`: help under the label, while the field has no error to show there.
- `style: SwitchStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SwitchColors?`: this switch's own colours: the ones it sets, with the theme's for the rest. A disabled switch keeps the theme's.
- `contentDescription: String?`: what a screen reader says for the switch where it has no `label`, or in place of it.
- `labelStyle: TextStyle`: the type the label is set in: the theme's `label` unless given.
- `controlPosition: ControlPosition`: where the track stands: before the label, or after it, as a settings screen has it. After it, the track is at the end of the width the row is given, `Modifier.fillMaxWidth()` lining it up with the others, or right after the label where the row is given none; the label wraps in what the track leaves.

### SwitchStyle

`import com.pantrixui.components.elements.switchbutton.SwitchStyle`, from `com.pantrixui:components`

```kotlin
class SwitchStyle(
    public val trackWidth: Dp = Dp.Unspecified,
    public val trackHeight: Dp = Dp.Unspecified,
    public val thumbSizeOff: Dp = Dp.Unspecified,
    public val thumbSizeOn: Dp = Dp.Unspecified,
    public val thumbSizePressed: Dp = Dp.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified,
    public val thumbAlwaysLight: Boolean? = null,
    public val thumbShadow: Dp = Dp.Unspecified
) : PantrixStyle<SwitchStyle>
```

`PantrixSwitchButton`'s track and its thumb: how large each is, the track's edge, and what the thumb looks like.

The thumb has three sizes. On Material 3 it grows from off to on, and further while it is held: that change is the switch's own motion, so Android's preset has three sizes. iOS's switch never resizes its thumb, and under a pointer a thumb that changes size is noise, so on iOS, the desktop and the web the three are one size. The component never asks which platform it is on.

The thumb sits in the middle of the track's round end, as far from the end as from the sides, at every size: the room around it is what the track's height leaves, and no value of its own.

`strokeWidth` is the edge of a track that is off, in the border colour, which marks where the control is at 3:1 against what it sits on. Material 3 draws one, and so does Windows: Android's preset has Material's, and the desktop's and the web's a thinner one, since their track is smaller. iOS draws none and leaves a pale track with a white thumb and its shadow, which Pantrix keeps there.

None of it follows the density: a track, its thumb and its edge are not air. The space between the track and its label does, since it comes from the theme's spacing. A switch's colours are not part of its style: they come from its state, and from `SwitchColors` where a switch has its own.

Parameters:

- `trackWidth: Dp`: The track's width, its edge included.
- `trackHeight: Dp`: The track's height, its edge included. The track's ends are as round as it is tall.
- `thumbSizeOff: Dp`: The thumb's width and height while the switch is off.
- `thumbSizeOn: Dp`: The thumb's width and height while the switch is on.
- `thumbSizePressed: Dp`: The thumb's width and height while it is pressed or dragged.
- `strokeWidth: Dp`: How thick the edge of a track that is off is. Zero draws none.
- `thumbAlwaysLight: Boolean?`: True keeps the thumb white whatever the theme and the state, as iOS has it. False draws it in the border colour when off and in the colour paired with the track's fill when on, as Material has it. Null is unspecified.
- `thumbShadow: Dp`: How far the thumb stands above the track: the size of the shadow under it. Zero draws none.

### SwitchColors

`import com.pantrixui.components.elements.switchbutton.SwitchColors`, from `com.pantrixui:components`

```kotlin
data class SwitchColors(
    public val checkedTrack: Color = Color.Unspecified,
    public val checkedThumb: Color = Color.Unspecified,
    public val uncheckedTrack: Color = Color.Unspecified,
    public val uncheckedThumb: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

What `PantrixSwitchButton` is painted with, for a switch that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role.

```kotlin
PantrixSwitchButton(
    checked = notifications,
    onCheckedChange = { notifications = it },
    label = stringResource(Res.string.notifications),
    colors = SwitchColors(checkedTrack = brand)
)
```

They are the colours of a switch that can be turned. A disabled one is drawn in the theme's disabled roles whatever is given here. Between off and on the track and the thumb turn from one colour to the other as the thumb moves.

A track given here that is one of the theme's own colours brings the thumb the theme pairs with it, unless the thumb is given too or the style keeps it light. A track no role has does not: the thumb on it is the caller's to give.

Parameters:

- `checkedTrack: Color`: The track's fill when the switch is on. The theme's `primary`.
- `checkedThumb: Color`: The thumb when the switch is on: the colour that stands out on `checkedTrack`. The primary role's `onColor`, or white where the style keeps the thumb light.
- `uncheckedTrack: Color`: The track's fill when the switch is off. A tint of the theme's `borderStrong`.
- `uncheckedThumb: Color`: The thumb when the switch is off: the colour that stands out on `uncheckedTrack`. The theme's `borderStrong`, or white where the style keeps the thumb light.
- `border: Color`: The edge of a track that is off, where the style draws one. The theme's `borderStrong`: a switch that is off is seen by its edge and its thumb.

### ControlPosition

`import com.pantrixui.components.elements.selection.ControlPosition`, from `com.pantrixui:components`

```kotlin
enum class ControlPosition
```

Where a checkbox's box, a radio button's ring or a switch's track stands against its label: before it, as a list of choices has it, or after it, at the end of the row, as a settings screen has a switch.

Entries:

- `Start`: Before the label, at the row's start: at the left, or at the right where the layout is read from the right.
- `End`: After the label: at the end of the width the row is given, or right after the label where it is given none. The label and its help wrap in what the control leaves, and never push it on.
