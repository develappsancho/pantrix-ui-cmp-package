# Progress Circle

A ring that fills as a piece of work goes on: how much of an upload has gone, how many steps of a set-up are behind, how much of a quota is used. It shows a share of a whole whose end is known; for work whose end is not known there is the spinner.

- `PantrixProgressCircle` (`com.pantrixui.components.chart.progresscircle`, `com.pantrixui:components`): A ring that fills clockwise as a known amount of work gets done, with room in its middle for the share or an icon, read by a screen reader as a progress bar. Keywords: circular progress, progress ring, determinate progress, completion, percent.

## Features

- **Value.** The ring starts at twelve o'clock and fills clockwise by `value` over `max`; a faint ring shows the whole. A value under nought is nought, and one past `max` is the whole.
- **Middle.** `content` stands in the middle of the ring: the share as a number, an icon.
- **Colour.** The ring is drawn in `color`, or else in the content colour of where it stands (as on a filled card), or else in the primary colour; its track is a faint share of the same colour (unless `trackColor` says otherwise).
- **Sizes.** `ProgressCircleStyle` gives the ring's size and thickness; a size on the modifier is the ring's too.
- **Motion.** When the value changes the ring goes to the new value; where the system asks for reduced motion it does not go, it is there.
- **Screen reader.** It is a progress bar whose name is `contentDescription` and which says the share it has reached. A number written in its middle is read too; it is better hidden from the screen reader, which already hears the share.
- **Direction.** The ring fills clockwise in a language read from right to left too.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `ProgressCircle_<tagKey>`.

## Usage

### A share of a whole

```kotlin
PantrixProgressCircle(value = upload.sent, max = upload.size, contentDescription = stringResource(Res.string.uploading))
```

### With the share written in its middle

```kotlin
PantrixProgressCircle(
    value = done,
    max = steps,
    contentDescription = stringResource(Res.string.setup),
    style = ProgressCircleStyle(size = 72.dp, strokeWidth = 8.dp),
    tagKey = "setup"
) {
    PantrixText(text = "$done/$steps", modifier = Modifier.clearAndSetSemantics { })
}
```

## Examples

### A share of a whole

At its plainest: a piece of work seventy-two per cent done. `max` is a hundred where it is not given.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle

PantrixProgressCircle(value = 72, contentDescription = "Uploaded", tagKey = "plain")
```

### With its share in the middle

The share is written in the middle of the ring and changes with the buttons: the ring goes to the new value. The writing in the middle is hidden from the screen reader (`clearAndSetSemantics`): the ring itself says the share.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.chart.progresscircle.ProgressCircleStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var done by remember { mutableStateOf(3) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixProgressCircle(
        value = done,
        max = 8,
        contentDescription = "Set-up",
        style = ProgressCircleStyle(size = 72.dp, strokeWidth = 8.dp),
        tagKey = "share"
    ) {
        PantrixText(text = "$done/8", modifier = Modifier.clearAndSetSemantics { })
    }
    PantrixButton(
        text = "Back",
        onClick = { done = (done - 1).coerceAtLeast(0) },
        variant = ButtonVariant.Outline,
        tagKey = "progress_back"
    )
    PantrixButton(text = "Next", onClick = { done = (done + 1).coerceAtMost(8) }, tagKey = "progress_next")
}
```

### Sizes

Three sizes, with `ProgressCircleStyle`: small in a row, medium on a card, large at the head of a summary. The ring's thickness is given with its size.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.chart.progresscircle.ProgressCircleStyle
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixProgressCircle(
        value = 40,
        contentDescription = "Small",
        style = ProgressCircleStyle(size = 32.dp, strokeWidth = 4.dp),
        tagKey = "small"
    )
    PantrixProgressCircle(value = 40, contentDescription = "Medium", tagKey = "medium")
    PantrixProgressCircle(
        value = 40,
        contentDescription = "Large",
        style = ProgressCircleStyle(size = 96.dp, strokeWidth = 10.dp),
        tagKey = "large"
    )
}
```

### Colours

The ring's colour can say what it shows: a quota that is running low in the warning colour, one that is full in the danger colour. On a filled surface a ring that is given no colour is drawn in the surface's content colour.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixProgressCircle(value = 35, color = colors.success.color, contentDescription = "Quota", tagKey = "ok")
    PantrixProgressCircle(value = 80, color = colors.warning.color, contentDescription = "Quota", tagKey = "warn")
    PantrixProgressCircle(value = 97, color = colors.danger.color, contentDescription = "Quota", tagKey = "full")
    PantrixSurface(color = colors.primary.color) {
        PantrixProgressCircle(
            value = 60,
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            contentDescription = "Uploaded",
            tagKey = "on_fill"
        )
    }
}
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The file draws the ring as far as it is filled; what stands in it by `content` is not in the file. `export` comes before `content`: the trailing lambda is still what stands in the middle.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixProgressCircle(
    value = 72,
    contentDescription = "Uploaded",
    tagKey = "exported",
    export = ChartExport(fileName = "uploaded") { file = it }
) {
    PantrixText(text = PantrixTheme.strings.percent(0.72), style = PantrixTheme.typography.caption)
}
ExportedFile(file, tagKey = "exported")
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixProgressCircle

`import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixProgressCircle(
    value: Number,
    modifier: Modifier = Modifier,
    max: Number = 100,
    color: Color = Color.Unspecified,
    trackColor: Color = Color.Unspecified,
    contentDescription: String? = null,
    style: ProgressCircleStyle? = null,
    tagKey: String? = null,
    export: ChartExport? = null,
    content: (@Composable () -> Unit)? = null
)
```

A ring that fills as something gets done: how much of an upload has gone, how many steps of a set-up are behind, how much of a quota is used. It shows a share of a whole that is known; for work whose end is not known there is the spinner.

The ring fills clockwise from twelve o'clock, `value` of `max` of the way round, over a faint ring that shows the whole. A value under nought is nought, and one over `max` is the whole. What is given as `content` stands in the middle of the ring: the share as a number, an icon.

It is drawn in `color`, or else the content colour of where it stands, as on a filled card, or the primary colour; its track is a faint share of the same colour unless `trackColor` says otherwise. A change of the value moves the ring to it, unless the system asks for reduced motion.

**To a screen reader** it is a progress bar with `contentDescription` for its name and the share it has reached. What stands in its middle is read too, as whatever it is: a number written there is better hidden from the screen reader, which has the share already.

The ring fills the same way in a language read from the right, as a clock's hand goes.

```kotlin
PantrixProgressCircle(value = 72, contentDescription = "Uploaded") {
    PantrixText(text = "72%", style = PantrixTheme.typography.caption)
}
```

Parameters:

- `value: Number`: how much is done, between nought and `max`. What is no number counts as nought.
- `modifier: Modifier`: the circle's modifier. A size here is the circle's.
- `max: Number`: how much the whole is: more than nought.
- `color: Color`: the colour of the ring.
- `trackColor: Color`: the colour of the ring's track, the whole it fills.
- `contentDescription: String?`: what is progressing, in a word or two, for a screen reader.
- `style: ProgressCircleStyle?`: this circle's own geometry: its size and how thick its ring is.
- `tagKey: String?`: the circle's automation key: the circle is `ProgressCircle_<tagKey>`.
- `export: ChartExport?`: what lets the reader take the circle out of the app as a PNG, an SVG or a PDF: a button over it makes the file of it as it is and hands it over (see `ChartExport`). `null`, it has no such button. What stands in the circle, `content`, is not in the file. It comes before `content`, which stays last.
- `content: (@Composable () -> Unit)?`: what stands in the middle of the ring. It has the room inside the ring.

### ProgressCircleStyle

`import com.pantrixui.components.chart.progresscircle.ProgressCircleStyle`, from `com.pantrixui:components`

```kotlin
class ProgressCircleStyle(
    public val size: Dp = Dp.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified
) : PantrixStyle<ProgressCircleStyle>
```

`PantrixProgressCircle`'s geometry.

The circle is a mark and not room between things: neither of its sizes follows the density.

Parameters:

- `size: Dp`: The circle's width and height: 56dp on every platform, unless a brand or a theme sets another.
- `strokeWidth: Dp`: How thick the ring is: 6dp. A ring is no thicker than a quarter of its circle.
