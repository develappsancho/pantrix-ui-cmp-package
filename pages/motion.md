# Motion

Durations and easings: how long a transition lasts and how it speeds up and slows down. Every animation of the library takes its duration from here; an animation of the app's own that does too follows the system's "reduce motion" setting by itself.

## Features

- **Durations.** `fast` 100, `normal` 200, `slow` 350 milliseconds. `PantrixTheme.motion` is the nearest theme's.
- **Easings.** `standardEasing` is the curve of most transitions, `emphasizedEasing` that of a transition meant to be noticed. `PantrixEasing` carries three curves: `Standard`, `Emphasized`, `Linear`; `curve` is Compose's `Easing`.
- **Less motion.** While `reduceMotion` is true, `duration(ms)` gives nought: transitions are skipped, a spinner or a skeleton stops. The theme reads it from the system (`rememberSystemMotion()`, `systemReduceMotion()`).

## Examples

### Durations and easings

Three durations and three easings. Press "Play": the upper three dots go with the same easing in `fast`, `normal` and `slow` time, the lower three in the same time with three easings. The duration is taken with `duration(…)`: where the system has reduced motion, the dots move to their place without waiting.

```kotlin
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.motion.PantrixEasing

var moved by remember { mutableStateOf(false) }
val motion = PantrixTheme.motion
Column(
    modifier = Modifier.widthIn(max = 320.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    MovingDot("fast · ${motion.fast} ms", moved, motion.duration(motion.fast), motion.standardEasing)
    MovingDot("normal · ${motion.normal} ms", moved, motion.duration(motion.normal), motion.standardEasing)
    MovingDot("slow · ${motion.slow} ms", moved, motion.duration(motion.slow), motion.standardEasing)
    PantrixEasing.entries.forEach { easing ->
        MovingDot("${easing.name} · slow", moved, motion.duration(motion.slow), easing)
    }
    PantrixButton(
        text = if (moved) "Bring back" else "Play",
        onClick = { moved = !moved },
        variant = ButtonVariant.Outline,
        tagKey = "play"
    )
}

@Composable
private fun MovingDot(
    label: String,
    moved: Boolean,
    durationMillis: Int,
    easing: PantrixEasing
) {
    val offset by animateDpAsState(
        targetValue = if (moved) TRACK_WIDTH - DOT_SIZE else 0.dp,
        animationSpec = tween(durationMillis = durationMillis, easing = easing.curve),
        label = label
    )
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = label, style = PantrixTheme.typography.footnote)
        Box(
            modifier = Modifier
                .size(width = TRACK_WIDTH, height = DOT_SIZE)
                .background(PantrixTheme.colors.neutral.container, PantrixTheme.shapes.full),
            contentAlignment = Alignment.CenterStart
        ) {
            Box(
                Modifier
                    .offset(x = offset)
                    .size(DOT_SIZE)
                    .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.full)
            )
        }
    }
}

private val TRACK_WIDTH = 280.dp

private val DOT_SIZE = 16.dp
```

### Less motion

Less motion. The theme reads its motion from the system: `rememberSystemMotion()` puts the system's "reduce motion" setting (`systemReduceMotion()`) in `reduceMotion`. The switch gives the same to an inner theme by hand, `PantrixMotion(reduceMotion = true)`: the spinner and the skeleton stop, and the durations go to nought.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.systemReduceMotion
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.motion.PantrixMotion
import com.pantrixui.foundation.token.motion.rememberSystemMotion

var reduce by remember { mutableStateOf(false) }
val system = rememberSystemMotion()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixText(
        text = "Does the system reduce motion: ${if (systemReduceMotion()) "yes" else "no"}",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
    PantrixSwitchButton(
        checked = reduce,
        onCheckedChange = { reduce = it },
        label = "Reduce motion in this section",
        tagKey = "reduce_motion"
    )
    PantrixTheme(motion = if (reduce) PantrixMotion(reduceMotion = true) else system) {
        val motion = PantrixTheme.motion
        PantrixText(
            text = "normal: ${motion.normal} ms, played: ${motion.duration(motion.normal)} ms",
            style = PantrixTheme.typography.footnote
        )
        PantrixSpinner()
        PantrixSkeleton(modifier = Modifier.fillMaxWidth().height(16.dp))
    }
}
```

## API

### PantrixMotion

`import com.pantrixui.foundation.token.motion.PantrixMotion`, from `com.pantrixui:foundation`

```kotlin
data class PantrixMotion(
    public val fast: Int = 100,
    public val normal: Int = 200,
    public val slow: Int = 350,
    public val standardEasing: PantrixEasing = PantrixEasing.Standard,
    public val emphasizedEasing: PantrixEasing = PantrixEasing.Emphasized,
    public val reduceMotion: Boolean = false
)
```

Durations and easings.

`EnterTransition`/`ExitTransition` are deliberately absent: they cannot honour the `@Immutable` contract's equality requirement, and putting them here would break the stability discipline the library enforces elsewhere.

Parameters:

- `fast: Int`: A quick transition, in milliseconds: a button's press.
- `normal: Int`: The usual transition, in milliseconds.
- `slow: Int`: A long transition, in milliseconds.
- `standardEasing: PantrixEasing`: The curve most transitions follow: a button's press.
- `emphasizedEasing: PantrixEasing`: The curve for a transition meant to be noticed.
- `reduceMotion: Boolean`: Whether the system's accessibility setting asks for less motion, as `rememberSystemMotion` reads it. `duration` is then 0, and a spinner or a skeleton stops moving.

Members:

- `fun duration(ms: Int): Int`: Every animation in the library takes its duration from here, so honouring "reduce motion" is one branch instead of a rule each component has to remember.

  `ms`: the duration an animation is written with, in milliseconds.

### PantrixEasing

`import com.pantrixui.foundation.token.motion.PantrixEasing`, from `com.pantrixui:foundation`

```kotlin
enum class PantrixEasing(public val curve: Easing)
```

Compose's `Easing` is a `fun interface`, so it gives no stable identity and cannot sit in an `@Immutable` data class. Binding the curves to an enum restores equality; call sites use `curve`.

Parameters:

- `curve: Easing`: The Compose easing the entry stands for.

Entries:

- `Standard`: The curve most transitions follow: quick to start, gentle to stop.
- `Emphasized`: The curve of a transition meant to be noticed.
- `Linear`: An even pace from start to end: for what moves along with something else, such as a progress bar.

### rememberSystemMotion

`import com.pantrixui.foundation.token.motion.rememberSystemMotion`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberSystemMotion(): PantrixMotion
```

Pantrix's motion, with every duration collapsed to zero while the system asks for reduced motion.

### systemReduceMotion

`import com.pantrixui.foundation.platform.systemReduceMotion`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun systemReduceMotion(): Boolean
```

The OS "reduce motion" setting.

Feeds `PantrixMotion.reduceMotion`, which collapses every duration to zero. Components never check this themselves; they ask `motion.duration(...)`, so honouring the setting is one decision instead of a rule each component has to remember.

### LocalPantrixMotion

`import com.pantrixui.foundation.token.motion.LocalPantrixMotion`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixMotion: ProvidableCompositionLocal<PantrixMotion>
```

The durations and easings in effect, which `PantrixTheme` provides: what `PantrixTheme.motion` reads. Outside a theme, Pantrix's own.
