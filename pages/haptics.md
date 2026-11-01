# Haptics

Haptic feedback: a component asks not for a vibration pattern but for what it means: a selection, a switch turned on or off, a success, an error. The platform plays its own pattern for that meaning.

## Features

- **Meanings.** `HapticType` is the name of what is said: `Selection`, `ToggleOn`, `ToggleOff`, `Success`, `Warning`, `Error`, `Impact`, `LongPress`.
- **The platform's patterns.** `rememberPlatformHaptics()` is the device itself on Android and iOS; on the desktop and the web it plays nothing (`PantrixHaptics.NoOp`).
- **The theme's.** `PantrixTheme(haptics = …)` gives the components' haptics somewhere else: to turn them off from a setting, or to count them in a test. `PantrixTheme.haptics` is the nearest theme's.

## Examples

### The components' haptics

The haptics the components ask for. The inner theme takes a `PantrixHaptics` that plays the device's patterns but writes their name first: change the switch and the checkbox, and the line underneath says what the component asked for. On the desktop and the web the line is written, but nothing vibrates.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.HapticType
import com.pantrixui.foundation.platform.PantrixHaptics
import com.pantrixui.foundation.platform.rememberPlatformHaptics
import com.pantrixui.foundation.theme.PantrixTheme

var last by remember { mutableStateOf<HapticType?>(null) }
var notify by remember { mutableStateOf(true) }
var agreed by remember { mutableStateOf(false) }
val device = rememberPlatformHaptics()
val telling = remember(device) {
    PantrixHaptics { type ->
        last = type
        device.perform(type)
    }
}
PantrixTheme(haptics = telling) {
    PantrixSwitchButton(
        checked = notify,
        onCheckedChange = { notify = it },
        label = "Notifications",
        tagKey = "haptic_notify"
    )
    PantrixCheckbox(
        checked = agreed,
        onCheckedChange = { agreed = it },
        label = "I accept the terms",
        tagKey = "haptic_agree"
    )
}
PantrixText(
    text = "Last haptic: ${last?.name ?: "none"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

### The app's own haptic

The app's own haptic: when a job is done or an error happens the app asks from the same place, `LocalPantrixHaptics.current.perform(…)`. On a phone each button plays the pattern of its own meaning.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.platform.HapticType
import com.pantrixui.foundation.platform.LocalPantrixHaptics
import com.pantrixui.foundation.theme.PantrixTheme

val haptics = LocalPantrixHaptics.current
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    HapticType.entries.forEach { type ->
        PantrixButton(
            text = type.name,
            onClick = { haptics.perform(type) },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "haptic_${type.name.lowercase()}"
        )
    }
}
```

## API

### PantrixHaptics

`import com.pantrixui.foundation.platform.PantrixHaptics`, from `com.pantrixui:foundation`

```kotlin
fun interface PantrixHaptics
```

Haptic feedback, abstracted so components state intent rather than platform API calls.

Desktop and web have no haptics and get `NoOp`; that is not a gap to fill later, it is the correct behaviour, and it is why components can call this unconditionally.

Members:

- `fun perform(type: HapticType)`: Plays the platform's pattern for `type`; nothing where the platform has none.

On the type:

- `PantrixHaptics.NoOp: PantrixHaptics`: The haptics of a platform that has none: what the desktop and the web get.

### HapticType

`import com.pantrixui.foundation.platform.HapticType`, from `com.pantrixui:foundation`

```kotlin
enum class HapticType
```

What a haptic is communicating, not which motor pattern to play.

Entries:

- `Selection`: Moving through options: a radio group, a slider tick, a segmented control.
- `ToggleOn`: A switch or a checkbox turned on.
- `ToggleOff`: A switch or a checkbox turned off.
- `Success`: An action that has succeeded: a form sent, a file saved.
- `Warning`: Something that needs the user's attention before it goes wrong.
- `Error`: An action that has failed, or a value that is not accepted.
- `Impact`: A generic bump for a completed drag or a snap.
- `LongPress`: A press that has been held long enough to mean something of its own: a tooltip that comes up under the finger, a menu a held press opens. It tells the finger that its lifting will not be a tap.

### rememberPlatformHaptics

`import com.pantrixui.foundation.platform.rememberPlatformHaptics`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPlatformHaptics(): PantrixHaptics
```

This platform's haptics: the device's own on Android and iOS, `PantrixHaptics.NoOp` on desktop and the web.

### LocalPantrixHaptics

`import com.pantrixui.foundation.platform.LocalPantrixHaptics`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixHaptics: ProvidableCompositionLocal<PantrixHaptics>
```

The haptics in effect, which `PantrixTheme` provides: what `PantrixTheme.haptics` reads. Outside a theme, `PantrixHaptics.NoOp`.
