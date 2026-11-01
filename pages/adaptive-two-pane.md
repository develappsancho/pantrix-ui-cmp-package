# Two panes

`PantrixTwoPane`, which lays two panes side by side or one above the other, and the helpers that say how many panes a layout shows and where the fold of a device that folds is.

What stands side by side in a wide window is most often two things: a list and what is chosen in it, a document and its properties, a video and its controls. `PantrixTwoPane` lays the two out in one room: it gives the first the share or the width it is given, and puts the layout's gutter between them. On a device that folds, where the fold divides the room, the panes meet exactly there: one on one side of the fold, the other on the other side; nothing falls on the fold.

- `PantrixTwoPane` (`com.pantrixui.components.container.twopane`, `com.pantrixui:components`): Two panes beside or above each other, meeting at the window's fold where one divides the room. Keywords: split view, dual pane, foldable, side by side, split screen.

## Features

- **Side by side or one above the other.** `TwoPaneOrientation.SideBySide` puts the first pane at the start and the second at the end; `TwoPaneOrientation.Stacked` the first above and the second below.
- **Share or size of its own.** `PaneSize.Fraction(0.4f)` gives the first pane 40% of the room, `PaneSize.Fixed(320.dp)` 320 dp; the second takes the rest. The gap between them is `gap`, `PantrixTheme.layout.gutter` by default.
- **They meet at the fold.** On a foldable held like a book, the upright fold parts panes side by side; put on a table, the fold lying across parts panes one above the other. Then neither the share nor the gap holds: the split is at the fold, and the gap is the strip the system asks to keep clear around it, `WindowFold.clearance`. On an iPhone the strip is 20 pt on each side of the fold; Android and the browsers ask for none.
- **Reading direction.** In a language read from right to left, the first of two panes side by side is on the right. The fold stays where it is on the screen; the first pane is on its start side.
- **How many panes.** `PantrixTheme.window.paneCount()` says how many panes the window has room for: one in `Compact` and `Medium`, two in `Expanded`, three from `Large` on; on a foldable held like a book, at least two at any width. `PantrixTwoPane` always draws both; when to show one is the layout's decision.
- **Your own layout.** `rememberFoldsInNode()` gives the folds in a node's own coordinates: whoever writes a layout of their own laid out by the fold puts its `modifier` on the node and reads `folds` as they measure.
- **Preview and test.** `PantrixWindowFrame` makes a box a window of its own: it tells what it holds the window it is given, and measures its fold from the box's corner. The "Book" and "Table" windows of this page's cards are drawn so.
- **Where it is read from.** The fold is read on Android from WindowManager, in the browsers that report it from the screen's segments, and from iOS 27.1 on from UIKit. On the desktop and on devices that do not fold the window is flat; the panes are split by the share.

## Usage

### A list beside what is chosen in it

```kotlin
PantrixTwoPane(
    first = { Inbox(onOpen = { opened = it }) },
    second = { Message(opened) },
    modifier = Modifier.fillMaxSize(),
    firstSize = PaneSize.Fixed(360.dp)
)
```

### On a table: the photo above the fold, the tools below

```kotlin
PantrixTwoPane(
    first = { Photo(photo) },
    second = { EditingTools(photo) },
    modifier = Modifier.fillMaxSize(),
    orientation = TwoPaneOrientation.Stacked,
    firstSize = PaneSize.Fraction(0.6f)
)
```

## Examples

### A list and what is opened, side by side

An inbox and the message opened, side by side: the list 300 dp, the message the rest. Press a message: the pane beside it shows it.

Pick "Book" in the card's window selector: the fold is in the middle and the panes part exactly there. The list is no longer 300 dp but reaches the fold; the gap is the 20 dp strip on each side of the fold. The faint strip and the line over the example are where the fold is. In the other windows the list is 300 dp and the layout's gutter stands between them. In "Narrow" there is no room left for the message: the next example shows one pane there.

```kotlin
import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var opened by rememberSaveable { mutableStateOf(MAILS.first().id) }
val scroll = rememberScrollState()
PantrixTwoPane(
    first = { Inbox(opened = opened, onOpen = { opened = it }, scroll = scroll, tagKey = "inbox") },
    second = { Message(mail = MAILS.first { it.id == opened }) },
    modifier = Modifier.fillMaxWidth().height(INBOX_HEIGHT),
    firstSize = PaneSize.Fixed(300.dp),
    tagKey = "inbox"
)

@Composable
private fun Inbox(
    opened: String?,
    onOpen: (String) -> Unit,
    scroll: ScrollState,
    tagKey: String
) {
    val colors = PantrixTheme.colors
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = colors.border) {
        Column(modifier = Modifier.verticalScroll(scroll)) {
            MAILS.forEachIndexed { index, mail ->
                if (index > 0) PantrixHorizontalDivider()
                val selected = mail.id == opened
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .selectable(selected = selected, onClick = { onOpen(mail.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                        .padding(PantrixTheme.spacing.md),
                    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    PantrixText(text = mail.from, style = PantrixTheme.typography.callout, color = text, maxLines = 1)
                    PantrixText(
                        text = mail.subject,
                        style = PantrixTheme.typography.footnote,
                        color = if (selected) text else colors.textSecondary,
                        maxLines = 1,
                        tagKey = "${tagKey}_mail_${mail.id}"
                    )
                }
            }
        }
    }
}

@Composable
private fun Message(
    mail: Mail,
    onBack: (() -> Unit)? = null
) {
    val spacing = PantrixTheme.spacing
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
            verticalArrangement = Arrangement.spacedBy(spacing.sm)
        ) {
            if (onBack != null) {
                PantrixButton(
                    text = "Inbox",
                    onClick = onBack,
                    variant = ButtonVariant.Text,
                    leadingIcon = { PantrixIcon(PantrixIcons.ArrowBack, contentDescription = null) },
                    tagKey = "back"
                )
            }
            PantrixText(text = mail.subject, style = PantrixTheme.typography.headline, tagKey = "message_subject")
            PantrixText(
                text = mail.from,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixText(text = mail.body)
        }
    }
}

private val MAILS = listOf(
    Mail("1", "Elif Kaya", "Tomorrow's meeting", "I moved the meeting to 10 o'clock. Could you share the slides a day before?"),
    Mail("2", "Can Demir", "Release notes", "I added the notes for release 1.4. Write if you see anything missing."),
    Mail("3", "Ayşe Yılmaz", "Design review", "The drafts of the new settings screen are ready; shall we look on Thursday?"),
    Mail("4", "Mert Şahin", "Invoice", "The October invoice is attached. It can be paid until the 30th."),
    Mail("5", "Zeynep Arslan", "Test results", "All the nightly tests passed; there is a warning on the tablet screen."),
    Mail("6", "Deniz Aydın", "Lunch", "Shall we eat out as a team on Friday? Anyone with a place in mind, write."),
    Mail("7", "Burak Çelik", "Accessibility", "I tried the whole flow with a screen reader; two buttons have no name."),
    Mail("8", "Selin Koç", "New joiner", "A new developer joins the team on Monday; let's plan their first week."),
    Mail("9", "Emre Öztürk", "Server maintenance", "The servers will be under maintenance on Saturday night from 02:00 to 04:00."),
    Mail("10", "Ece Polat", "User interviews", "I talked to five users this week; the notes are in the shared folder.")
)

private val INBOX_HEIGHT = 420.dp

private class Mail(
    val id: String,
    val from: String,
    val subject: String,
    val body: String
)
```

### One pane or two: paneCount

The window says how many panes to show: `PantrixTheme.window.paneCount()`. Where there is room for two, the list and the message stand side by side. Where there is not, one shows: the list first, the message once one is pressed, and the list again with the "Inbox" button.

When the pane count changes, the list is called from another place and composed again. Its scroll position is not lost: the example remembers it, not the list, `rememberScrollState()`, and hands it to the list. Scroll the list, open a message, then switch between "Narrow" and "Wide" in the card's window selector: the opened message and the list's place both stay.

"Narrow" and "Medium" say one pane, "Short", "Wide" and "Book" two. The 951 dp of "Book" is `Expanded` anyway; a narrower foldable held like a book takes two panes as well. In "Table" the fold lies across and does not part panes side by side: the 669 dp window is `Medium` and shows one pane.

```kotlin
import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.paneCount
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var opened by rememberSaveable { mutableStateOf<String?>(null) }
val scroll = rememberScrollState()
val panes = PantrixTheme.window.paneCount()
val mail = MAILS.firstOrNull { it.id == opened }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(
        text = "paneCount(): $panes",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "pane_count"
    )
    Box(modifier = Modifier.fillMaxWidth().height(INBOX_HEIGHT)) {
        when {
            panes >= 2 -> {
                PantrixTwoPane(
                    first = { Inbox(opened = opened, onOpen = { opened = it }, scroll = scroll, tagKey = "count") },
                    second = { if (mail != null) Message(mail = mail) else NothingOpened() },
                    modifier = Modifier.fillMaxSize(),
                    firstSize = PaneSize.Fixed(300.dp),
                    tagKey = "count"
                )
            }

            // In one pane an open message takes the list's place; the list's scroll position stays while it is gone.
            mail != null -> {
                Message(mail = mail, onBack = { opened = null })
            }

            else -> {
                Inbox(opened = null, onOpen = { opened = it }, scroll = scroll, tagKey = "count")
            }
        }
    }
}

@Composable
private fun Inbox(
    opened: String?,
    onOpen: (String) -> Unit,
    scroll: ScrollState,
    tagKey: String
) {
    val colors = PantrixTheme.colors
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = colors.border) {
        Column(modifier = Modifier.verticalScroll(scroll)) {
            MAILS.forEachIndexed { index, mail ->
                if (index > 0) PantrixHorizontalDivider()
                val selected = mail.id == opened
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .selectable(selected = selected, onClick = { onOpen(mail.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                        .padding(PantrixTheme.spacing.md),
                    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    PantrixText(text = mail.from, style = PantrixTheme.typography.callout, color = text, maxLines = 1)
                    PantrixText(
                        text = mail.subject,
                        style = PantrixTheme.typography.footnote,
                        color = if (selected) text else colors.textSecondary,
                        maxLines = 1,
                        tagKey = "${tagKey}_mail_${mail.id}"
                    )
                }
            }
        }
    }
}

@Composable
private fun Message(
    mail: Mail,
    onBack: (() -> Unit)? = null
) {
    val spacing = PantrixTheme.spacing
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
            verticalArrangement = Arrangement.spacedBy(spacing.sm)
        ) {
            if (onBack != null) {
                PantrixButton(
                    text = "Inbox",
                    onClick = onBack,
                    variant = ButtonVariant.Text,
                    leadingIcon = { PantrixIcon(PantrixIcons.ArrowBack, contentDescription = null) },
                    tagKey = "back"
                )
            }
            PantrixText(text = mail.subject, style = PantrixTheme.typography.headline, tagKey = "message_subject")
            PantrixText(
                text = mail.from,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixText(text = mail.body)
        }
    }
}

@Composable
private fun NothingOpened() {
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        PantrixText(
            text = "Pick a message to read",
            modifier = Modifier.align(Alignment.Center),
            color = PantrixTheme.colors.textSecondary,
            tagKey = "nothing_opened"
        )
    }
}

private val MAILS = listOf(
    Mail("1", "Elif Kaya", "Tomorrow's meeting", "I moved the meeting to 10 o'clock. Could you share the slides a day before?"),
    Mail("2", "Can Demir", "Release notes", "I added the notes for release 1.4. Write if you see anything missing."),
    Mail("3", "Ayşe Yılmaz", "Design review", "The drafts of the new settings screen are ready; shall we look on Thursday?"),
    Mail("4", "Mert Şahin", "Invoice", "The October invoice is attached. It can be paid until the 30th."),
    Mail("5", "Zeynep Arslan", "Test results", "All the nightly tests passed; there is a warning on the tablet screen."),
    Mail("6", "Deniz Aydın", "Lunch", "Shall we eat out as a team on Friday? Anyone with a place in mind, write."),
    Mail("7", "Burak Çelik", "Accessibility", "I tried the whole flow with a screen reader; two buttons have no name."),
    Mail("8", "Selin Koç", "New joiner", "A new developer joins the team on Monday; let's plan their first week."),
    Mail("9", "Emre Öztürk", "Server maintenance", "The servers will be under maintenance on Saturday night from 02:00 to 04:00."),
    Mail("10", "Ece Polat", "User interviews", "I talked to five users this week; the notes are in the shared folder.")
)

private val INBOX_HEIGHT = 420.dp

private class Mail(
    val id: String,
    val from: String,
    val subject: String,
    val body: String
)
```

### On a table: the video above, the controls below

For a foldable put on a table: what is looked at above, the controls below. `TwoPaneOrientation.Stacked` puts the first pane above; here the upper one takes 60% of the room.

Pick "Table" in the card's window selector: the window is 669 × 951 dp and the fold lies across its middle. In the tabletop posture the layout takes the window's whole height, `byPosture(flat = 360.dp, tabletop = window.size.height)`, and the panes part exactly at the fold: the video in the upper half, the controls in the lower. In the other windows the layout is 360 dp tall and is split by the share. In "Book" the fold is upright and does not part panes one above the other: the share holds.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.container.twopane.TwoPaneOrientation
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byPosture
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
var playing by rememberSaveable { mutableStateOf(false) }
var second by rememberSaveable { mutableIntStateOf(VIDEO_START) }
PantrixTwoPane(
    first = { Player(playing = playing, second = second) },
    second = {
        PlayerControls(
            playing = playing,
            onPlay = { playing = !playing },
            onBack = { second = (second - SKIP).coerceAtLeast(0) },
            onForward = { second = (second + SKIP).coerceAtMost(VIDEO_LENGTH) }
        )
    },
    modifier = Modifier.fillMaxWidth().height(window.byPosture(flat = 360.dp, tabletop = window.size.height)),
    orientation = TwoPaneOrientation.Stacked,
    firstSize = PaneSize.Fraction(0.6f),
    tagKey = "player"
)

@Composable
private fun Player(
    playing: Boolean,
    second: Int
) {
    PantrixSurface(modifier = Modifier.fillMaxSize(), color = PantrixTheme.colors.textPrimary) {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixIcon(
                imageVector = if (playing) PantrixIcons.Pause else PantrixIcons.Play,
                contentDescription = null,
                size = 48.dp,
                tint = PantrixTheme.colors.background
            )
            PantrixText(
                text = "${clock(second)} / ${clock(VIDEO_LENGTH)}",
                color = PantrixTheme.colors.background,
                tagKey = "video_time"
            )
        }
    }
}

@Composable
private fun PlayerControls(
    playing: Boolean,
    onPlay: () -> Unit,
    onBack: () -> Unit,
    onForward: () -> Unit
) {
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        Row(
            modifier = Modifier.align(Alignment.Center),
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixButton(text = "Back 10 s", onClick = onBack, variant = ButtonVariant.Outline, tagKey = "rewind")
            PantrixButton(text = if (playing) "Pause" else "Play", onClick = onPlay, tagKey = "play")
            PantrixButton(text = "Forward 10 s", onClick = onForward, variant = ButtonVariant.Outline, tagKey = "skip")
        }
    }
}

private const val VIDEO_START = 83

private const val VIDEO_LENGTH = 225

private const val SKIP = 10

private fun clock(seconds: Int): String =
    "${(seconds / MINUTE).toString().padStart(2, '0')}:${(seconds % MINUTE).toString().padStart(2, '0')}"

private const val MINUTE = 60
```

### Share, size of its own, orientation and reading direction

The panes' size and orientation. With the selectors, change the first pane's share, the way the panes stand and the reading direction: each pane writes its own size.

- **Share.** `PaneSize.Fraction(0.3f)` gives the first pane 30% of the room left once the gap is taken out.

- **Fixed.** `PaneSize.Fixed(200.dp)` gives the first pane 200 dp; where the room is narrower, the first takes all of it.

- **One above the other.** With `TwoPaneOrientation.Stacked` the share and the fixed size are of the height.

- **Right to left.** Side by side, the first pane goes to the right; one above the other, both stay where they are. An app takes its reading direction from its language; here it was given to these two panes alone with `LocalLayoutDirection`.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.container.twopane.TwoPaneOrientation
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var size by rememberSaveable { mutableIntStateOf(0) }
var stacked by rememberSaveable { mutableStateOf(false) }
var rtl by rememberSaveable { mutableStateOf(false) }
val spacing = PantrixTheme.spacing
Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
    PantrixSegmentButton(
        options = SIZES.mapIndexed { index, (label, _) -> SegmentOption(index, label, tagKey = "size_$index") },
        selected = size,
        onSelect = { size = it },
        tagKey = "size"
    )
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "Side by side", tagKey = "side_by_side"),
            SegmentOption(true, "One above the other", tagKey = "stacked")
        ),
        selected = stacked,
        onSelect = { stacked = it },
        tagKey = "orientation"
    )
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "Left to right", tagKey = "ltr"),
            SegmentOption(true, "Right to left", tagKey = "rtl")
        ),
        selected = rtl,
        onSelect = { rtl = it },
        tagKey = "direction"
    )
}
val direction = if (rtl) LayoutDirection.Rtl else LayoutDirection.Ltr
CompositionLocalProvider(LocalLayoutDirection provides direction) {
    PantrixTwoPane(
        first = { MeasuredPane(name = "First", color = PantrixTheme.colors.primary.container) },
        second = { MeasuredPane(name = "Second", color = PantrixTheme.colors.surface) },
        modifier = Modifier.fillMaxWidth().height(240.dp),
        orientation = if (stacked) TwoPaneOrientation.Stacked else TwoPaneOrientation.SideBySide,
        firstSize = SIZES[size].second,
        tagKey = "sizes"
    )
}

private val SIZES = listOf(
    "Half and half" to PaneSize.Fraction(0.5f),
    "%30" to PaneSize.Fraction(0.3f),
    "200 dp" to PaneSize.Fixed(200.dp)
)

@Composable
private fun MeasuredPane(
    name: String,
    color: Color
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PantrixSurface(
        modifier = Modifier.fillMaxSize().onSizeChanged { size = it },
        color = color,
        border = PantrixTheme.colors.border
    ) {
        // The sizes are written left to right: in a right-to-left paragraph the width and the height would read swapped.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            Column(modifier = Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                PantrixText(text = name, style = PantrixTheme.typography.callout)
                PantrixText(text = "$words dp", style = PantrixTheme.typography.footnote)
            }
        }
    }
}
```

### Your own layout: rememberFoldsInNode

To write a layout of your own that is laid out by the fold: `rememberFoldsInNode()` gives the folds in a node's own coordinates, in pixels. Put its `modifier` on the node and read `folds` as you measure: as the node moves, the window changes and the device is folded, the layout is measured again. A fold that does not cross the node is not in the list.

The toolbar here lines its buttons up in the middle. Where an upright fold crosses it, half of the buttons go before the fold and half after it: no button falls on the fold. Pick "Book" in the card's window selector: the buttons part on both sides of the fold, and the line below says where the fold is in the bar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.platform.LocalDensity
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.rememberFoldsInNode
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val folds = rememberFoldsInNode()
val density = LocalDensity.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FoldAwareToolbar(modifier = Modifier.fillMaxWidth().then(folds.modifier)) {
        TOOLS.forEachIndexed { index, tool ->
            PantrixButton(text = tool, onClick = {}, variant = ButtonVariant.Soft, tagKey = "tool_$index")
        }
    }
    val fold = folds.separatingFold
    val words = if (fold == null) {
        "No fold crosses this bar"
    } else {
        with(density) {
            val start = fold.clearance.left.toDp().value.roundToInt()
            val end = fold.clearance.right.toDp().value.roundToInt()
            "The fold is at $start–$end dp of the bar, ${fold.orientation.name}"
        }
    }
    PantrixText(
        text = words,
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "fold_in_node"
    )
}

@Composable
private fun FoldAwareToolbar(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val folds = rememberFoldsInNode()
    val gap = PantrixTheme.spacing.sm
    Layout(content = content, modifier = modifier.then(folds.modifier)) { measurables, constraints ->
        val buttons = measurables.map { it.measure(constraints.copy(minWidth = 0)) }
        val space = gap.roundToPx()
        val width = constraints.maxWidth
        val height = buttons.maxOf { it.height }
        val fold = folds.separatingFold?.takeIf { it.orientation == FoldOrientation.Vertical }
        layout(width, height) {
            if (fold == null) {
                // No fold: all of them in the middle.
                val row = buttons.sumOf { it.width } + space * (buttons.size - 1)
                var x = (width - row) / 2
                buttons.forEach { button ->
                    button.placeRelative(x, (height - button.height) / 2)
                    x += button.width + space
                }
            } else {
                // A fold: half of them before the strip, against it, half after it. The fold stays where it is on the screen,
                // so the buttons are put where they are on the screen.
                val before = buttons.take(buttons.size / 2)
                var x = fold.clearance.left.roundToInt() - before.sumOf { it.width + space }
                (before + buttons.drop(before.size)).forEachIndexed { index, button ->
                    if (index == before.size) x = fold.clearance.right.roundToInt() + space
                    button.place(x, (height - button.height) / 2)
                    x += button.width + space
                }
            }
        }
    }
}

private val TOOLS = listOf("Cut", "Copy", "Paste", "Delete")
```

### A window that folds, in a preview

A window that folds, in a preview or a test: `PantrixWindowFrame` makes a box a window of its own. What it holds reads the window it is given with `PantrixTheme.window` and measures the fold from the box's corner. Here a window of 280 × 160 dp was made, with a fold held half open like a book in its middle: the two panes in it part exactly at the fold, and the narrow window says two panes in the book posture.

Where the fold is, is in pixels. The `bounds` of a `WindowFold` are the fold itself: on a phone that folds, a line with no thickness. `clearance` is the strip what is touched keeps clear of: on Android the fold itself, on iOS 20 pt more on each side. In this window the strip is 12 dp on each side.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.PantrixWindow
import com.pantrixui.foundation.adaptive.PantrixWindowFrame
import com.pantrixui.foundation.adaptive.WindowFold
import com.pantrixui.foundation.adaptive.WindowPosture
import com.pantrixui.foundation.adaptive.paneCount
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val density = LocalDensity.current
val window = remember(density) { bookWindow(DpSize(280.dp, 160.dp), margin = 12.dp, density = density) }
PantrixWindowFrame(
    window = window,
    modifier = Modifier.size(280.dp, 160.dp).border(1.dp, PantrixTheme.colors.border)
) {
    PantrixTwoPane(
        first = { MeasuredPane(name = "Left page", color = PantrixTheme.colors.surface) },
        second = { MeasuredPane(name = "Right page", color = PantrixTheme.colors.surface) },
        modifier = Modifier.fillMaxSize(),
        tagKey = "framed"
    )
}
PantrixText(
    text = "${window.widthClass.name} width · paneCount(): ${window.paneCount()} · " +
        "isBook: ${if (window.posture.isBook) "yes" else "no"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "framed_window"
)

internal fun bookWindow(
    size: DpSize,
    margin: Dp,
    density: Density
): PantrixWindow = with(density) {
    val middle = size.width.toPx() / 2
    val height = size.height.toPx()
    val fold = WindowFold(
        bounds = Rect(left = middle, top = 0f, right = middle, bottom = height),
        orientation = FoldOrientation.Vertical,
        isHalfOpened = true,
        isSeparating = true,
        isOccluding = false,
        clearance = Rect(left = middle - margin.toPx(), top = 0f, right = middle + margin.toPx(), bottom = height)
    )
    PantrixWindow(size, posture = WindowPosture(listOf(fold)))
}

@Composable
private fun MeasuredPane(
    name: String,
    color: Color
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PantrixSurface(
        modifier = Modifier.fillMaxSize().onSizeChanged { size = it },
        color = color,
        border = PantrixTheme.colors.border
    ) {
        // The sizes are written left to right: in a right-to-left paragraph the width and the height would read swapped.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            Column(modifier = Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                PantrixText(text = name, style = PantrixTheme.typography.callout)
                PantrixText(text = "$words dp", style = PantrixTheme.typography.footnote)
            }
        }
    }
}
```

## API

### PantrixTwoPane

`import com.pantrixui.components.container.twopane.PantrixTwoPane`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixTwoPane(
    first: @Composable () -> Unit,
    second: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    orientation: TwoPaneOrientation = TwoPaneOrientation.SideBySide,
    firstSize: PaneSize = PaneSize.Fraction(0.5f),
    gap: Dp = PantrixTheme.layout.gutter,
    tagKey: String? = null
)
```

Two panes in one room: beside each other or one above the other, split at the window's fold where one divides the room.

- **Where they meet.** A fold that divides the room the way the panes stand, upright for panes beside each other and lying across for panes one above the other, is where they meet: each pane is on one side of it, and the strip the system asks to keep clear around it, the fold's `clearance`, is the gap. Elsewhere `firstSize` says how much the first pane takes and `gap` stands between them.

- **Which fold.** The fold is the window's where it crosses this room, so a pair of panes in part of a window splits at the fold only where the fold runs through it. A foldable held like a book splits panes beside each other; one on a table, panes one above the other.

- **Reading direction.** Beside each other, the first pane is at the start: on the right where the language is read from right to left. A fold stays where it is on the screen, and the first pane is on its start side.

- **Room.** The panes take the whole room across: beside each other, as tall as the room, or as tall as the taller of them where the room's height is not bounded. Along the split the room is to be bounded.

- **Both, always.** The two panes are always shown. A layout that shows one where there is no room for two asks the window first: `PantrixTheme.window.paneCount()`.

- **Automation.** The pair is tagged `TwoPane_<tagKey>`.

Parameters:

- `first: @Composable () -> Unit`: the first pane: at the start beside the second, or above it.
- `second: @Composable () -> Unit`: the second pane.
- `modifier: Modifier`: the room the two panes have.
- `orientation: TwoPaneOrientation`: which way the panes stand.
- `firstSize: PaneSize`: how much the first pane takes where no fold divides the room: half by default.
- `gap: Dp`: the room between the panes where no fold divides it: the layout's gutter by default.
- `tagKey: String?`: the key of the pair's automation tag.

### TwoPaneOrientation

`import com.pantrixui.components.container.twopane.TwoPaneOrientation`, from `com.pantrixui:components`

```kotlin
enum class TwoPaneOrientation
```

Which way two panes stand: beside each other, or one above the other.

Entries:

- `SideBySide`: The first pane at the start, the second at the end: a list and what is chosen in it.
- `Stacked`: The first pane above, the second below: what is looked at, and the controls under it.

### PaneSize

`import com.pantrixui.components.container.twopane.PaneSize`, from `com.pantrixui:components`

```kotlin
sealed interface PaneSize
```

How much of the room the first pane takes, where no fold says where the panes meet. The second pane takes the rest, past the gap.

#### PaneSize.Fraction

```kotlin
data class Fraction(public val fraction: Float) : PaneSize
```

A share of the room the panes have between them, the gap left out: `0.5f` is half each.

Parameters:

- `fraction: Float`: The first pane's share, from 0 to 1.

#### PaneSize.Fixed

```kotlin
data class Fixed(public val size: Dp) : PaneSize
```

A size of its own: a list as wide as 360dp, whatever the window. A room smaller than it and the gap gives the first pane all there is.

Parameters:

- `size: Dp`: The first pane's width beside the second, or its height above it.

### PantrixWindow.paneCount

`import com.pantrixui.foundation.adaptive.paneCount`, from `com.pantrixui:foundation`

```kotlin
fun PantrixWindow.paneCount(maxPanes: Int = 2): Int
```

How many panes a layout lays side by side in this window, at most `maxPanes`: one in a Compact window and in a Medium one, two from Expanded on, three from Large on. A window that a fold divides upright, a foldable held like a book or a hinge between two screens, takes two at any width: one on each side of the fold.

```kotlin
if (PantrixTheme.window.paneCount() >= 2) InboxAndMessage() else Inbox()
```

The gap between the panes is the layout's gutter, `PantrixTheme.layout.gutter`, and where a fold divides the window the panes meet at it: the fold's `clearance` is the gap there.

Parameters:

- `maxPanes: Int`: the most panes the layout has: two for a list and its detail, three with a pane beside them.

### rememberFoldsInNode

`import com.pantrixui.foundation.adaptive.rememberFoldsInNode`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFoldsInNode(window: PantrixWindow = LocalPantrixWindow.current): FoldsInNode
```

The folds of `window` where they cross the node `FoldsInNode.modifier` is put on.

Parameters:

- `window: PantrixWindow`: the window whose folds are asked: the one the content is told of unless given.

### FoldsInNode

`import com.pantrixui.foundation.adaptive.FoldsInNode`, from `com.pantrixui:foundation`

```kotlin
class FoldsInNode
```

The window's folds where they cross one node, in the node's own coordinates and in pixels: what a layout that splits its room at a fold measures by. Put `modifier` on the node; `folds` follows the node as it moves and is resized, the window as it changes and the device as it is folded.

A node the fold does not cross has none. Until the node is first placed the folds are where they would be in a node that starts at the window's corner, as one filling the window does.

Members:

- `modifier: Modifier`: Placed on the node whose folds are asked. It follows where the node is in the window, and so a node a page scrolls past the fold is measured again as it goes.
- `folds: List<WindowFold>`: The folds crossing the node, their bounds and clearance in its coordinates.
- `separatingFold: WindowFold?`: The fold that divides the node, if one does: the first of `folds` that separates.

### PantrixWindowFrame

`import com.pantrixui.foundation.adaptive.PantrixWindowFrame`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun PantrixWindowFrame(
    window: PantrixWindow?,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
)
```

A box that is a window of its own: its content is told `window` as the window it is in, and the folds of `window` are where they are in this box, its top start corner the window's. What a preview of a screen at a size, a frame of a design tool or a catalogue's window picker draws a window in.

```kotlin
val book = PantrixWindow(DpSize(951.dp, 669.dp), posture = WindowPosture(listOf(fold)))
PantrixWindowFrame(book, Modifier.size(951.dp, 669.dp)) { Inbox() }
```

The folds of the window the app is in are in that window's coordinates; within a frame they are in the frame's. A layout that splits at a fold finds it with `rememberFoldsInNode`, wherever it is drawn. A frame drawn smaller or larger, in a scaled layer, keeps its content's folds where they are in the content: the fold is scaled with them.

Parameters:

- `window: PantrixWindow?`: the window the content is told of; null for the window the box is in, so that a picker offering the real window beside made-up ones keeps the content where it is in the composition, its state with it, whichever is chosen.
- `modifier: Modifier`: the box's modifier. The window's top start corner is where its content starts, inside the modifier's padding and border.
- `content: @Composable () -> Unit`: what the window holds.

### WindowFold

`import com.pantrixui.foundation.adaptive.WindowFold`, from `com.pantrixui:foundation`

```kotlin
data class WindowFold(
    public val bounds: Rect,
    public val orientation: FoldOrientation,
    public val isHalfOpened: Boolean,
    public val isSeparating: Boolean,
    public val isOccluding: Boolean,
    public val clearance: Rect = bounds
)
```

A fold or a hinge in a window.

Parameters:

- `bounds: Rect`: Where it is, in pixels and in the window's coordinates. A fold in one screen has no thickness: its bounds are a line, as wide as zero. A hinge between two screens is as wide as the gap.
- `orientation: FoldOrientation`: Which way it runs.
- `isHalfOpened: Boolean`: Whether the device is held partly open, the two halves at an angle. Opened flat, it is not.
- `isSeparating: Boolean`: Whether the window is in two pieces here, with nothing to be laid across: a fold held half open, or a hinge between two screens at any angle. A fold opened flat separates nothing.
- `isOccluding: Boolean`: Whether it hides a strip of the window, as a hinge between two screens does.
- `clearance: Rect`: The strip around it that what is touched keeps clear of, in pixels and in the window's coordinates: `bounds` and the margin the system asks for on either side. iOS asks for one, 20pt on each side of the fold of an iPhone that folds; Android and the browsers ask for none, and the strip is `bounds` itself. Two panes split at the fold leave this strip between them.
