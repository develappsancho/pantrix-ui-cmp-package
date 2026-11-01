# Tabletop

Content that is looked at and the controls that are touched, by how a foldable is held: a video and its player's buttons, a video call and its buttons, a camera's view and its shutter.

`PantrixTabletopLayout` takes two parts: `content` and `controls`. With a foldable laid half open on a table (the hinge lying across), the content fills the half above the fold and the controls the half below: what is looked at above, the hands below. Held like a book, the two stand at each side of the fold. On a screen that does not fold, the controls are under the content or over it.

- `PantrixTabletopLayout` (`com.pantrixui.components.container.tabletop`, `com.pantrixui:components`): Content and its controls: halves at a fold laid on a table, the controls below or over it flat. Keywords: foldable, tabletop posture, half folded, flex mode, laptop posture.

## Features

- **Flat.** `flatControls` is `Below` by default: the controls at the bottom, as tall as they are, and the content takes the rest. `Overlay`: the content takes the whole room and the controls sit over its bottom.
- **On a table.** The content fills the half above the fold and the controls the half below; the fold's strip stays clear. The controls take the whole lower half and arrange themselves.
- **Like a book.** The content at the start of the fold, the controls at its other side.
- **What the parts are told.** Both parts are built in a `TabletopScope`: `arrangement` is `Flat`, `Tabletop` or `Book`. The controls can choose to be drawn larger on a table.
- **It looks at its own room.** Where the fold does not cross the layout's own room, the layout is flat.
- **State is kept.** As the posture changes the two parts stay where they are in the composition, at once and with no motion: the video goes on from where it was.
- **Each part a window.** Everything in a part reads the part's room as its window.
- **Reading direction.** In a right-to-left language, held like a book, the content is at the right of the fold.

## Usage

### A video and its player

```kotlin
PantrixTabletopLayout(
    content = { Video(player) },
    controls = { PlayerControls(player, large = arrangement == TabletopArrangement.Tabletop) },
    modifier = Modifier.fillMaxSize()
)
```

### Controls over the video while the screen is flat

```kotlin
PantrixTabletopLayout(
    content = { Video(player) },
    controls = { PlayerControls(player, onVideo = arrangement == TabletopArrangement.Flat) },
    modifier = Modifier.fillMaxSize(),
    flatControls = TabletopControls.Overlay
)
```

## Examples

### A video player

A video and its player. Flat, the buttons stand under the video, as tall as they are.

Choose "Table" in the card's window picker: the video moves above the fold and the buttons below it, where they take the lower half; there `arrangement == Tabletop`, so the buttons grow and the video's name is written too. Press play and change the window: the video goes on from where it was, and neither part leaves the composition.

In the tabletop posture the fold is in the middle of the 951dp window: there the example is as tall as the window, so that the fold crosses it. On a screen the layout takes the whole window anyway, with `Modifier.fillMaxSize()`.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopArrangement
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.math.roundToInt

var playing by remember { mutableStateOf(false) }
var position by remember { mutableFloatStateOf(VIDEO_START) }
Playing(playing) { position = (position + VIDEO_STEP) % 1f }
PantrixTabletopLayout(
    content = { VideoPane(playing = playing, position = position, tagKey = "player") },
    controls = {
        PlayerControls(
            playing = playing,
            position = position,
            onPlay = { playing = !playing },
            // On a table the whole lower half is the controls': the buttons grow, and the video's name is written too.
            large = arrangement == TabletopArrangement.Tabletop,
            tagKey = "player"
        )
    },
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    tagKey = "player"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun Playing(
    playing: Boolean,
    step: () -> Unit
) {
    LaunchedEffect(playing) {
        while (playing) {
            delay(VIDEO_TICK_MILLIS)
            step()
        }
    }
}

@Composable
private fun VideoPane(
    playing: Boolean,
    position: Float,
    tagKey: String
) {
    Box(modifier = Modifier.fillMaxSize().background(VIDEO_GROUND), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (!playing) PantrixIcon(PantrixIcons.Play, contentDescription = null, size = 48.dp, tint = Color.White)
            PantrixText(text = timeOf(position), color = Color.White, tagKey = "${tagKey}_time")
        }
    }
}

@Composable
private fun PlayerControls(
    playing: Boolean,
    position: Float,
    onPlay: () -> Unit,
    large: Boolean,
    tagKey: String,
    onVideo: Boolean = false
) {
    val spacing = PantrixTheme.spacing
    val ink = if (onVideo) Color.White else PantrixTheme.colors.textPrimary
    Column(
        modifier = Modifier.fillMaxWidth().padding(spacing.md),
        verticalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterVertically)
    ) {
        if (large) PantrixText(text = "A day on the Bosphorus", style = PantrixTheme.typography.headline, color = ink)
        Progress(position = position, ink = ink)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val size = if (large) ButtonSize.Large else ButtonSize.Medium
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronBack,
                contentDescription = "Rewind",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_back"
            )
            PantrixIconButton(
                imageVector = if (playing) PantrixIcons.Pause else PantrixIcons.Play,
                contentDescription = if (playing) "Pause" else "Play",
                onClick = onPlay,
                variant = ButtonVariant.Solid,
                size = size,
                tagKey = "${tagKey}_play"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronForward,
                contentDescription = "Fast forward",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_forward"
            )
        }
    }
}

private const val VIDEO_START = 0.35f

private const val VIDEO_STEP = 0.004f

@Composable
private fun Progress(
    position: Float,
    ink: Color
) {
    val primary = PantrixTheme.colors.primary.color
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier
                .weight(1f)
                .height(PROGRESS_HEIGHT)
                .drawBehind {
                    val corner = CornerRadius(size.height / 2)
                    drawRoundRect(color = ink.copy(alpha = TRACK_ALPHA), cornerRadius = corner)
                    val played = Size(size.width * position, size.height)
                    drawRoundRect(color = primary, size = played, cornerRadius = corner)
                }
        )
        // The minutes are written from left to right, in a right-to-left language too.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                text = "${timeOf(position)} / ${timeOf(1f)}",
                style = PantrixTheme.typography.footnote,
                color = ink
            )
        }
    }
}

private fun timeOf(position: Float): String {
    val seconds = (position * VIDEO_SECONDS).roundToInt()
    return "${seconds / 60}:${(seconds % 60).toString().padStart(2, '0')}"
}

private val VIDEO_GROUND = Color(0xFF1E2A3A)

private const val VIDEO_TICK_MILLIS = 250L

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp

private val PROGRESS_HEIGHT = 4.dp

private const val TRACK_ALPHA = 0.3f

private const val VIDEO_SECONDS = 240
```

### Controls over the video

The same player with `flatControls = TabletopControls.Overlay`: flat, the video takes the whole room and the buttons sit over its bottom. On a table they still move below the fold. Over the video (`arrangement == Flat`) the buttons draw a dark, see-through ground so that they can be read.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopArrangement
import com.pantrixui.components.container.tabletop.TabletopControls
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.math.roundToInt

var playing by remember { mutableStateOf(false) }
var position by remember { mutableFloatStateOf(VIDEO_START) }
Playing(playing) { position = (position + VIDEO_STEP) % 1f }
PantrixTabletopLayout(
    content = { VideoPane(playing = playing, position = position, tagKey = "overlay") },
    controls = {
        val onVideo = arrangement == TabletopArrangement.Flat
        Box(modifier = if (onVideo) Modifier.background(SCRIM_ON_VIDEO) else Modifier) {
            PlayerControls(
                playing = playing,
                position = position,
                onPlay = { playing = !playing },
                large = arrangement == TabletopArrangement.Tabletop,
                onVideo = onVideo,
                tagKey = "overlay"
            )
        }
    },
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    flatControls = TabletopControls.Overlay,
    tagKey = "overlay"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun Playing(
    playing: Boolean,
    step: () -> Unit
) {
    LaunchedEffect(playing) {
        while (playing) {
            delay(VIDEO_TICK_MILLIS)
            step()
        }
    }
}

@Composable
private fun VideoPane(
    playing: Boolean,
    position: Float,
    tagKey: String
) {
    Box(modifier = Modifier.fillMaxSize().background(VIDEO_GROUND), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (!playing) PantrixIcon(PantrixIcons.Play, contentDescription = null, size = 48.dp, tint = Color.White)
            PantrixText(text = timeOf(position), color = Color.White, tagKey = "${tagKey}_time")
        }
    }
}

@Composable
private fun PlayerControls(
    playing: Boolean,
    position: Float,
    onPlay: () -> Unit,
    large: Boolean,
    tagKey: String,
    onVideo: Boolean = false
) {
    val spacing = PantrixTheme.spacing
    val ink = if (onVideo) Color.White else PantrixTheme.colors.textPrimary
    Column(
        modifier = Modifier.fillMaxWidth().padding(spacing.md),
        verticalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterVertically)
    ) {
        if (large) PantrixText(text = "A day on the Bosphorus", style = PantrixTheme.typography.headline, color = ink)
        Progress(position = position, ink = ink)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val size = if (large) ButtonSize.Large else ButtonSize.Medium
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronBack,
                contentDescription = "Rewind",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_back"
            )
            PantrixIconButton(
                imageVector = if (playing) PantrixIcons.Pause else PantrixIcons.Play,
                contentDescription = if (playing) "Pause" else "Play",
                onClick = onPlay,
                variant = ButtonVariant.Solid,
                size = size,
                tagKey = "${tagKey}_play"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronForward,
                contentDescription = "Fast forward",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_forward"
            )
        }
    }
}

private val SCRIM_ON_VIDEO = Color(0x99000000)

private const val VIDEO_START = 0.35f

private const val VIDEO_STEP = 0.004f

@Composable
private fun Progress(
    position: Float,
    ink: Color
) {
    val primary = PantrixTheme.colors.primary.color
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier
                .weight(1f)
                .height(PROGRESS_HEIGHT)
                .drawBehind {
                    val corner = CornerRadius(size.height / 2)
                    drawRoundRect(color = ink.copy(alpha = TRACK_ALPHA), cornerRadius = corner)
                    val played = Size(size.width * position, size.height)
                    drawRoundRect(color = primary, size = played, cornerRadius = corner)
                }
        )
        // The minutes are written from left to right, in a right-to-left language too.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                text = "${timeOf(position)} / ${timeOf(1f)}",
                style = PantrixTheme.typography.footnote,
                color = ink
            )
        }
    }
}

private fun timeOf(position: Float): String {
    val seconds = (position * VIDEO_SECONDS).roundToInt()
    return "${seconds / 60}:${(seconds % 60).toString().padStart(2, '0')}"
}

private val VIDEO_GROUND = Color(0xFF1E2A3A)

private const val VIDEO_TICK_MILLIS = 250L

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp

private val PROGRESS_HEIGHT = 4.dp

private const val TRACK_ALPHA = 0.3f

private const val VIDEO_SECONDS = 240
```

### A video call

A video call: the people above, the buttons below. Whether the microphone and the camera are on is kept in the example; the people's tiles read it.

In "Table" the people stay above the fold and the buttons grow side by side below it: with the phone on a table, the hands are there.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopArrangement
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var muted by remember { mutableStateOf(false) }
var cameraOff by remember { mutableStateOf(false) }
PantrixTabletopLayout(
    content = { CallPeople(muted = muted, cameraOff = cameraOff) },
    controls = {
        val size = if (arrangement == TabletopArrangement.Tabletop) ButtonSize.Large else ButtonSize.Medium
        Row(
            modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixButton(
                text = if (muted) "Unmute" else "Mute",
                onClick = { muted = !muted },
                variant = ButtonVariant.Outline,
                size = size,
                tagKey = "call_mute"
            )
            PantrixButton(
                text = if (cameraOff) "Turn camera on" else "Turn camera off",
                onClick = { cameraOff = !cameraOff },
                variant = ButtonVariant.Outline,
                size = size,
                tagKey = "call_camera"
            )
            PantrixButton(text = "End", onClick = {}, size = size, tagKey = "call_end")
        }
    },
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    tagKey = "call"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun CallPeople(
    muted: Boolean,
    cameraOff: Boolean
) {
    Row(
        modifier = Modifier.fillMaxSize().padding(PantrixTheme.spacing.md),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        CALL_PEOPLE.forEachIndexed { index, person ->
            val you = index == 0
            PersonTile(
                name = if (you) "You" else person.first,
                initials = person.second,
                note = if (you && muted) "Muted" else null,
                camera = !(you && cameraOff),
                modifier = Modifier.weight(1f).fillMaxSize()
            )
        }
    }
}

@Composable
private fun PersonTile(
    name: String,
    initials: String,
    note: String?,
    camera: Boolean,
    modifier: Modifier
) {
    PantrixSurface(
        modifier = modifier,
        color = if (camera) VIDEO_GROUND else PantrixTheme.colors.neutral.container
    ) {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
        ) {
            PantrixAvatar(contentDescription = null, initials = initials)
            PantrixText(text = name, color = if (camera) Color.White else Color.Unspecified)
            if (note != null) {
                PantrixText(
                    text = note,
                    style = PantrixTheme.typography.footnote,
                    color = if (camera) Color.White else PantrixTheme.colors.textSecondary
                )
            }
        }
    }
}

private val CALL_PEOPLE = listOf("You" to "Y", "Deniz Aksoy" to "DA", "Can Öztürk" to "CÖ")

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp

private val VIDEO_GROUND = Color(0xFF1E2A3A)
```

### On a foldable: the parts write their measures

Each part writes its own size and window class. In "Book" the 951dp window is split in two at the fold: the content on the left, the controls on the right. In "Table" the content is above the fold and the controls below it, both 669dp wide. In a flat window the controls are as tall as they are.

```kotlin
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopScope
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

// Both parts are set up in a `TabletopScope`: `arrangement` says what the layout is now.
val controls: @Composable TabletopScope.() -> Unit = {
    MeasuredPart(name = "Controls", tall = false, tagKey = "measured_controls")
}
PantrixTabletopLayout(
    content = { MeasuredPart(name = "Content", tall = true, tagKey = "measured_content") },
    controls = controls,
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    tagKey = "measured"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun MeasuredPart(
    name: String,
    tall: Boolean,
    tagKey: String
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    val room = if (tall) Modifier.fillMaxSize() else Modifier.fillMaxWidth()
    PartSurface(modifier = room.onSizeChanged { size = it }) {
        // The measures are written from left to right: in a right-to-left paragraph the width and the height would read swapped.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                // The part is its own window: its class follows the part's width.
                text = "$name: $words dp · ${PantrixTheme.window.widthClass.name}",
                modifier = Modifier.align(Alignment.Center).padding(PantrixTheme.spacing.lg),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                tagKey = tagKey
            )
        }
    }
}

@Composable
private fun PartSurface(
    modifier: Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier, border = PantrixTheme.colors.border) { content() }
}

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp
```

## API

### PantrixTabletopLayout

`import com.pantrixui.components.container.tabletop.PantrixTabletopLayout`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTabletopLayout(
    content: @Composable TabletopScope.() -> Unit,
    controls: @Composable TabletopScope.() -> Unit,
    modifier: Modifier = Modifier,
    flatControls: TabletopControls = TabletopControls.Below,
    tagKey: String? = null
)
```

Content that is looked at and the controls that are touched, laid out for how a foldable is held: on a table, half open with the fold lying across, the content fills the half above the fold and the controls the half below, where the hands are; held like a book, the two stand at each side of the fold; and on a screen that does not fold, the controls are below the content or over it, as `flatControls` says. A video and its player's buttons, a video call and its buttons, a camera's view and its shutter.

- **Its own room.** The layout looks for the fold where it crosses its own room, not the window: a layout that lies wholly on one side of the fold is laid out flat.

- **The fold's strip.** On a table and like a book, nothing is laid on the strip the fold keeps clear, and a strip in the middle of the room leaves both halves as large as each other.

- **Kept state.** The two parts stay where they are in the composition as the posture changes, at once and with no motion: a video goes on playing, and what the controls remember is kept.

- **Each part a window.** What a part holds is told the part's room as its window: `PantrixTheme.window`, its classes and `PantrixTheme.layout` answer for the part. The posture stays the window's.

- **Screen reader.** Each part is read as one group, the content first and the controls after it.

- **Reading direction.** Held like a book, the content is at the start of the fold: on the right where the language is read from right to left.

- **Automation.** The layout is tagged `TabletopLayout_<tagKey>`, its parts `TabletopContent_<tagKey>` and `TabletopControls_<tagKey>`.

The layout takes the room it is given, which is to be bounded both ways: `Modifier.fillMaxSize()` on a screen.

Parameters:

- `content: @Composable TabletopScope.() -> Unit`: what is looked at: a video, the people of a call, a camera's view.
- `controls: @Composable TabletopScope.() -> Unit`: what is touched: a player's buttons and its progress, a call's buttons, a shutter.
- `modifier: Modifier`: the room the two parts have.
- `flatControls: TabletopControls`: where the controls are while no fold divides the room.
- `tagKey: String?`: the key of the layout's automation tags.

### TabletopScope

`import com.pantrixui.components.container.tabletop.TabletopScope`, from `com.pantrixui:components`

```kotlin
interface TabletopScope
```

What both parts of a `PantrixTabletopLayout` are told of the layout they are in.

Members:

- `arrangement: TabletopArrangement`: How the layout lays its parts out: controls drawn larger on a table, where they have half the screen, or a video that knows the controls are over it.

### TabletopArrangement

`import com.pantrixui.components.container.tabletop.TabletopArrangement`, from `com.pantrixui:components`

```kotlin
enum class TabletopArrangement
```

How a `PantrixTabletopLayout` lays out its two parts, as the fold of its room has it.

Entries:

- `Flat`: No fold divides the room: the controls are below the content, or over it.
- `Tabletop`: A foldable laid on a table: the content fills the half above the fold, the controls the half below.
- `Book`: A foldable held like a book: the content at the start of the fold, the controls past it.

### TabletopControls

`import com.pantrixui.components.container.tabletop.TabletopControls`, from `com.pantrixui:components`

```kotlin
enum class TabletopControls
```

Where a `PantrixTabletopLayout`'s controls are while no fold divides its room.

Entries:

- `Below`: Under the content, as tall as they are: the content takes the rest of the room.
- `Overlay`: Over the content, at its bottom, as tall as they are: the content takes the whole room, as a video's does.
