# Gauge

One value on a scale: it is read by how much of an arc it fills. A speed, a load, the used share of a quota: a measure read against its least and its most.

The scale turns clockwise along three quarters of a turn: `min` at the lower left, `max` at the lower right; both are written under the ends. The value fills the arc from where the scale begins up to itself, and is written in the middle of the gauge.

- `PantrixGauge` (`com.pantrixui.components.chart.gauge`, `com.pantrixui:components`): One reading on a scale, as an arc filled up to it or a needle that points at it, with ranges of the scale in colours of their own and the reading said to a screen reader with the range it is in. Keywords: dial, meter, speedometer, kpi, needle, arc.

## Features

- **Scale.** `min` and `max` are the ends of the scale. A value past an end stands at that end and is written as it is. A gauge with no value (`null`) shows only its scale.
- **Ranges.** `segments` gives parts of the scale a colour and a name: the range that is fine, the range that is too much. Each `GaugeSegment` says where it ends (`upTo`); the first begins where the scale does, the others where the one before ends. The arc fills in the colour of the range the value has reached; the ranges themselves stay under it in their faint colours.
- **Needle.** With `needle` a hand reaches from the middle to the value, and the value is written under it. In a gauge with both a needle and ranges the ranges are drawn in their full colours and the arc is not filled: the hand is read against them.
- **Writing.** `format` says how the value and the two ends of the scale are written; left out, they are written as numbers in the theme's language. `center` puts your own content in place of the value's writing.
- **Screen reader.** The gauge is one thing: its `description`, then the value as it is written and, where it has one, the name of the range it is in.
- **Size and motion.** The gauge is as wide as the room it is given and as tall as the chart's style says; the arc is the largest that fits there. When the value changes the arc and the hand go to the new value; where the system asks for reduced motion they do not go, they are there.
- **Direction.** The scale turns the same way in a language read from right to left too.
- **Export.** `export` puts a button over the chart: the chart is made, as it is on the screen and without the part that is pointed at or its tooltip, into a PNG, an SVG or a PDF file and handed to the app.
- **Automation.** `Gauge_<tagKey>`.

## Usage

### A reading on a scale

```kotlin
PantrixGauge(
    value = usedGigabytes,
    max = 50,
    format = { "${it.toInt()} GB" },
    description = stringResource(Res.string.storage_used),
    tagKey = "storage"
)
```

### A needle read against ranges

```kotlin
PantrixGauge(
    value = load,
    segments = listOf(
        GaugeSegment(upTo = 60, name = normal),
        GaugeSegment(upTo = 85, name = high),
        GaugeSegment(upTo = 100, name = critical)
    ),
    needle = true,
    description = stringResource(Res.string.processor_load),
    tagKey = "load"
)
```

## Examples

### A value on a scale

At its plainest: a value and the end of the scale. Thirty-two gigabytes of a storage of fifty are used; `format` writes the value and the two ends of the scale with their unit.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.PantrixGauge

PantrixGauge(
    value = 32,
    max = 50,
    format = { "${it.toInt()} GB" },
    description = "Storage used",
    tagKey = "plain"
)
```

### Ranges

The scale has three ranges: normal up to sixty, high up to eighty-five, critical after that. The arc fills in the colour of the range the value has reached; the ranges show under it in their faint colours.

Choose a value: the arc goes there and its colour changes with the range it has reached. A screen reader says the range's name after the value too: "72%, High". `format` writes the value in the theme's language (`PantrixTheme.strings.percent`).

The ranges name their own colours here: the theme's success, warning and danger colours. A range that is given no colour takes the theme's next chart colour; those colours carry no meaning.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.GaugeSegment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var load by remember { mutableStateOf(72) }
val strings = PantrixTheme.strings
PantrixSegmentButton(
    options = loadReadings(),
    selected = load,
    onSelect = { load = it },
    fullWidth = false,
    tagKey = "gauge_load"
)
PantrixGauge(
    value = load,
    segments = loadRanges(),
    format = { strings.percent(it / 100) },
    description = "Processor load",
    tagKey = "segments"
)

@Composable
private fun loadRanges(): List<GaugeSegment> {
    val colors = PantrixTheme.colors
    return listOf(
        GaugeSegment(upTo = 60, color = colors.success.color, name = "Normal"),
        GaugeSegment(upTo = 85, color = colors.warning.color, name = "High"),
        GaugeSegment(upTo = 100, color = colors.danger.color, name = "Critical")
    )
}

@Composable
private fun loadReadings(): List<SegmentOption<Int>> {
    val strings = PantrixTheme.strings
    return listOf(40 to "low", 72 to "high", 93 to "critical").map { (load, key) ->
        SegmentOption(value = load, label = strings.percent(load / 100.0), tagKey = key)
    }
}
```

### A needle

A gauge with a needle: a hand reaches from the middle to the value, and the value is written under it. The ranges are drawn in their full colours and the arc is not filled: the hand is read against them.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.GaugeSegment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var load by remember { mutableStateOf(40) }
val strings = PantrixTheme.strings
PantrixSegmentButton(
    options = loadReadings(),
    selected = load,
    onSelect = { load = it },
    fullWidth = false,
    tagKey = "gauge_needle_load"
)
PantrixGauge(
    value = load,
    segments = loadRanges(),
    needle = true,
    format = { strings.percent(it / 100) },
    description = "Processor load",
    tagKey = "needle"
)

@Composable
private fun loadRanges(): List<GaugeSegment> {
    val colors = PantrixTheme.colors
    return listOf(
        GaugeSegment(upTo = 60, color = colors.success.color, name = "Normal"),
        GaugeSegment(upTo = 85, color = colors.warning.color, name = "High"),
        GaugeSegment(upTo = 100, color = colors.danger.color, name = "Critical")
    )
}

@Composable
private fun loadReadings(): List<SegmentOption<Int>> {
    val strings = PantrixTheme.strings
    return listOf(40 to "low", 72 to "high", 93 to "critical").map { (load, key) ->
        SegmentOption(value = load, label = strings.percent(load / 100.0), tagKey = key)
    }
}
```

### A scale that does not start at nought

A gauge with a needle and no ranges: the arc fills up to the value and the hand points at it too. A scale need not start at nought: this thermometer goes from twenty below to forty.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixGauge(
    value = 7.5,
    min = -20,
    max = 40,
    needle = true,
    format = { "${strings.decimal(it, fractionDigits = 1)}°" },
    description = "Outside temperature",
    tagKey = "below_zero"
)
```

### Your own content in the middle

`center` puts your own content in place of the value's writing: here the unit under the value. The content fits the room the arc leaves in its middle.

A screen reader hears the value from the gauge itself (`description` and `format`); what is written in the middle is for the eye.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixGauge(
    value = 86,
    max = 120,
    format = { "${it.toInt()} km/h" },
    center = {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            PantrixText(text = "86", style = PantrixTheme.typography.headline)
            PantrixText(text = "km/h", color = PantrixTheme.colors.textSecondary)
        }
    },
    description = "Speed",
    tagKey = "own_center"
)
```

### Your own sizes

A gauge's own sizes: a thinner arc (`gaugeWidth`) and a lower gauge (`height`). No gap between the ranges (`sliceGap`). A field that is not given stays the theme's.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.gauge.GaugeSegment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixGauge(
    value = 54,
    segments = loadRanges(),
    format = { strings.percent(it / 100) },
    description = "Processor load",
    style = ChartStyle(gaugeWidth = 8.dp, height = 160.dp, sliceGap = 0.dp),
    tagKey = "own_look"
)

@Composable
private fun loadRanges(): List<GaugeSegment> {
    val colors = PantrixTheme.colors
    return listOf(
        GaugeSegment(upTo = 60, color = colors.success.color, name = "Normal"),
        GaugeSegment(upTo = 85, color = colors.warning.color, name = "High"),
        GaugeSegment(upTo = 100, color = colors.danger.color, name = "Critical")
    )
}
```

### Export

`export = ChartExport(...)` puts an export button over the chart: press it and choose the kind (PNG, SVG or PDF). The chart makes the file and hands it to `onExport`; below, its name and size show, and a PNG's picture, and "Save the file" hands it over in the platform's way.

The value in the middle is written in the file too; content put there by `center` is not in the file.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.gauge.PantrixGauge

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixGauge(
    value = 32,
    max = 50,
    format = { "${it.toInt()} GB" },
    description = "Storage used",
    tagKey = "exported",
    export = ChartExport(fileName = "storage") { file = it }
)
ExportedFile(file, tagKey = "exported")
```

What the code calls of the demo app itself, which an app writes for itself:

- `ExportedFile`: Shows the file a chart made: its name, its type and its size; a PNG's picture itself, no larger than its own size; and the "Save the file" button, which hands the file over in the platform's window for saving (the library's `rememberFileSaver`). It says so while there is no file yet.

## API

### PantrixGauge

`import com.pantrixui.components.chart.gauge.PantrixGauge`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixGauge(
    value: Number?,
    modifier: Modifier = Modifier,
    min: Number = 0,
    max: Number = 100,
    segments: List<GaugeSegment> = emptyList(),
    needle: Boolean = false,
    format: ((Double) -> String)? = null,
    center: (@Composable () -> Unit)? = null,
    description: String? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

A gauge: one reading on a scale, as how far round an arc it reaches. A speed, a load, a share of a quota: a value that is read against the least and the most it can be.

The scale runs clockwise round three quarters of a turn, from `min` at the lower left to `max` at the lower right, with both written under its ends. The `value` fills the arc from where the scale begins up to itself, and is written in the middle of the gauge; a value past an end of the scale stands at that end, and is written as it is.

**Segments.** `segments` give stretches of the scale a colour and a name: the range that is fine, the range that is too much. The arc is then drawn in the colour of the segment the value has reached, over the segments themselves in a faint shade of their own colours.

**A needle.** With `needle` a hand points at the value from the middle of the gauge, as on a dial, and the value is written under it, between the arc's two ends. A gauge with a needle and segments shows the segments in their full colours and no filled arc: the hand is read against them.

**To a screen reader** the gauge is one thing: its `description`, then the value as it is written, and the name of the segment it is in where the segment has one.

**Its size.** The gauge is as wide as it is given room, and as tall as the chart's style says unless its modifier gives it a height; the arc is the largest that has room in that, in the middle of it. A change of the value moves the arc and the hand to it, unless the system asks for reduced motion.

The scale runs the same way in a language read from the right: a dial is no line of text.

```kotlin
PantrixGauge(
    value = 72,
    segments = listOf(
        GaugeSegment(upTo = 60, name = "Normal"),
        GaugeSegment(upTo = 85, name = "High"),
        GaugeSegment(upTo = 100, name = "Critical")
    ),
    format = { "${it.toInt()}%" },
    description = "Processor load",
    tagKey = "load"
)
```

Parameters:

- `value: Number?`: the reading. `null`, and what is no number, is no reading: the gauge shows its scale and nothing on it.
- `modifier: Modifier`: the gauge's modifier. A height here is the gauge's.
- `min: Number`: where the scale begins.
- `max: Number`: where the scale ends: more than `min`.
- `segments: List<GaugeSegment>`: the stretches of the scale that have a colour and a name, in the order they lie along it; each ends past where the one before it does. None, and the arc is drawn in the first of the chart's colours.
- `needle: Boolean`: whether a hand points at the value.
- `format: ((Double) -> String)?`: how a value is written: the reading, and the two ends of the scale. Left out, they are written as numbers in the theme's language.
- `center: (@Composable () -> Unit)?`: what stands in the gauge in place of the reading as it is written: the reading with a unit under it, an icon. It has the room the arc leaves in its middle, or the room between the arc's two ends where the gauge has a needle.
- `description: String?`: what the gauge measures, in a few words, for a screen reader: the first thing it says of the gauge.
- `style: ChartStyle?`: this gauge's own geometry: the fields set here, with the theme's for the rest.
- `colors: ChartColors?`: this gauge's own colours, where they are not the theme's.
- `tagKey: String?`: the gauge's automation key: the gauge is `Gauge_<tagKey>`.
- `export: ChartExport?`: what lets the reader take the chart out of the app as a PNG, an SVG or a PDF: a button over the chart makes the file of it as it is and hands it over (see `ChartExport`). `null`, the chart has no such button. What stands in the middle, `center`, is not in the file; the reading the gauge writes there of itself is.

### GaugeSegment

`import com.pantrixui.components.chart.gauge.GaugeSegment`, from `com.pantrixui:components`

```kotlin
class GaugeSegment(
    public val upTo: Number,
    public val color: Color = Color.Unspecified,
    public val name: String? = null,
    public val pattern: ChartPattern? = null
)
```

A stretch of a `PantrixGauge`'s scale that has a colour and a name of its own: the range in which a reading is fine, the one in which it is high.

```kotlin
GaugeSegment(upTo = 60, name = "Normal")
```

The segments of a gauge are given in the order they lie along its scale: the first begins where the scale does, and each of the others where the one before it ends.

Two are the same segment where everything they were built from is the same; a whole number and the same number with a fraction of nought are one value.

Parameters:

- `upTo: Number`: Where the segment ends: a reading up to this value, the value itself with it, is the segment's.
- `color: Color`: The colour the segment is drawn in. Left out, it is the theme's chart colour for its place among the gauge's segments.
- `name: String?`: What a reading in the segment is called, which a screen reader says after the reading: "Normal", "High". Left out, the reading is said by itself.
- `pattern: ChartPattern?`: The texture the segment is drawn with besides its colour, and the filled arc while it reaches into the segment. Left out, none, and where the gauge's patterns are on (`ChartStyle.patterns`), its turn by its place among the segments: none for the first.

### ChartStyle

`import com.pantrixui.components.chart.common.ChartStyle`, from `com.pantrixui:components`

```kotlin
class ChartStyle(
    public val height: Dp = Dp.Unspecified,
    public val lineWidth: Dp = Dp.Unspecified,
    public val markerSize: Dp = Dp.Unspecified,
    public val selectedMarkerSize: Dp = Dp.Unspecified,
    public val gridWidth: Dp = Dp.Unspecified,
    public val labelGap: Dp = Dp.Unspecified,
    public val tickSpacing: Dp = Dp.Unspecified,
    public val legendGap: Dp = Dp.Unspecified,
    public val legendItemGap: Dp = Dp.Unspecified,
    public val swatchSize: Dp = Dp.Unspecified,
    public val swatchGap: Dp = Dp.Unspecified,
    public val tooltipShape: ShapeSpec = ShapeSpec.Unspecified,
    public val tooltipHorizontalPadding: Dp = Dp.Unspecified,
    public val tooltipVerticalPadding: Dp = Dp.Unspecified,
    public val tooltipGap: Dp = Dp.Unspecified,
    public val tooltipElevation: Dp = Dp.Unspecified,
    public val barGap: Dp = Dp.Unspecified,
    public val barMaxWidth: Dp = Dp.Unspecified,
    public val barRadius: Dp = Dp.Unspecified,
    public val sliceGap: Dp = Dp.Unspecified,
    public val selectedSliceOffset: Dp = Dp.Unspecified,
    public val gaugeWidth: Dp = Dp.Unspecified,
    public val meterHeight: Dp = Dp.Unspecified,
    public val trackerHeight: Dp = Dp.Unspecified,
    public val bubbleMinSize: Dp = Dp.Unspecified,
    public val bubbleMaxSize: Dp = Dp.Unspecified,
    public val navigatorHeight: Dp = Dp.Unspecified,
    public val barBandShare: Float = Float.NaN,
    public val markLineWidth: Dp = Dp.Unspecified,
    public val markBandAlpha: Float = Float.NaN,
    public val patterns: Boolean? = null,
    public val nodeWidth: Dp = Dp.Unspecified,
    public val nodeGap: Dp = Dp.Unspecified
) : PantrixStyle<ChartStyle>
```

A chart's geometry: how tall it is where nothing says, how thick its lines and how large its marks are, and the room between its parts; and whether its fills have textures besides their colours.

A chart is as tall on a phone as leaves room for what is around it, and taller in a window with room to spare. Under a finger its values' lines stand a little further apart than under a pointer.

The rooms between the parts follow the density, the gaps between bars and between slices among them. The height, the widths of the lines, the sizes of the marks and of the bubbles, a bar's width and corners, how far a pointed slice stands out, how thick a gauge's arc is, how tall a meter's bar, a tracker's blocks and a navigator's strip are, and the tooltip's corners and shadow do not: a chart's lines are as thick in a dense layout as in a roomy one.

Parameters:

- `height: Dp`: How tall a chart's plot is, with its axes, where the chart's modifier gives it no height. A legend above or under the plot adds its own.
- `lineWidth: Dp`: The width of a series' line.
- `markerSize: Dp`: The width and height of the mark on a point.
- `selectedMarkerSize: Dp`: The same of the mark on the point that is pointed at.
- `gridWidth: Dp`: The width of the grid's lines, of the lines along the axes and of the line that marks the place pointed at. Zero draws none.
- `labelGap: Dp`: Between the plot and what is written beside it and under it, and between that and an axis' title.
- `tickSpacing: Dp`: The least room between two values marked along the axis of values: what decides how many are marked where the axis does not say.
- `legendGap: Dp`: Between the legend and the chart it stands beside.
- `legendItemGap: Dp`: Between one entry of the legend and the next.
- `swatchSize: Dp`: How wide the sample of a series is in the legend and in the tooltip: a short run of its line, or a patch of its fill.
- `swatchGap: Dp`: Between that sample and the name after it.
- `tooltipShape: ShapeSpec`: The tooltip's corners: a step of the brand's shape scale, or a fixed shape.
- `tooltipHorizontalPadding: Dp`: Between the tooltip's sides and what it holds.
- `tooltipVerticalPadding: Dp`: Between its top and bottom and what it holds, and between its heading and rows.
- `tooltipGap: Dp`: Between the place pointed at and the tooltip beside it.
- `tooltipElevation: Dp`: The tooltip's shadow.
- `barGap: Dp`: Between two bars that stand side by side at a place. Bars too thin for it stand closer.
- `barMaxWidth: Dp`: The widest a bar is, however much room its place has: a chart of three places is not three slabs.
- `barRadius: Dp`: How round the corners of a bar's end are, the end away from nought.
- `sliceGap: Dp`: Between two slices of a pie that lie side by side, the same from the pie's middle to its rim.
- `selectedSliceOffset: Dp`: How far the slice of a pie that is pointed at stands out past the pie's rim. The pie keeps this much room about itself, so that the slice has where to stand.
- `gaugeWidth: Dp`: How thick the arc of a gauge is. An arc is no thicker than half its radius.
- `meterHeight: Dp`: How tall the bar of a meter group is.
- `trackerHeight: Dp`: How tall the blocks of a status tracker are.
- `bubbleMinSize: Dp`: How far across the smallest bubble of a scatter chart is: a point whose size is nothing, or too little to be seen as an area, is still a point.
- `bubbleMaxSize: Dp`: How far across its largest bubble is: the one whose size is the most of the chart's.
- `navigatorHeight: Dp`: How tall the strip under a chart's plot is, on which the part of the chart that is in view is marked and moved, in a chart whose zoom has one: how wide, beside a plot whose places go down its side.
- `barBandShare: Float`: How much of a place's band its bars take, more than nought and one at the most: the rest is the room between one place's bars and the next's. Bars are no wider than `barMaxWidth` all the same.
- `markLineWidth: Dp`: The width of a mark's line: a target, a limit, a day. Zero draws none, and the mark's words are written all the same.
- `markBandAlpha: Float`: How much of its colour a mark's band is drawn in, from nought to one: a band lies behind the series, and is a tint.
- `patterns: Boolean?`: Whether the fills of a chart's series, slices and tiles are drawn with textures besides their colours, and its lines broken in turn (`ChartPattern`): what tells them apart for a reader who cannot tell the colours apart. Left out, as the system is set: on where it is set to tell things apart without colour, iOS's "Differentiate Without Color" and Android's colour correction, and off otherwise.
- `nodeWidth: Dp`: How wide a node of a sankey is.
- `nodeGap: Dp`: Between two nodes of a column of a sankey.

### ChartColors

`import com.pantrixui.components.chart.common.ChartColors`, from `com.pantrixui:components`

```kotlin
data class ChartColors(
    public val series: List<Color> = emptyList(),
    public val grid: Color = Color.Unspecified,
    public val axis: Color = Color.Unspecified,
    public val label: Color = Color.Unspecified,
    public val crosshair: Color = Color.Unspecified,
    public val tooltipContainer: Color = Color.Unspecified,
    public val tooltipBorder: Color = Color.Unspecified,
    public val tooltipText: Color = Color.Unspecified,
    public val tooltipLabel: Color = Color.Unspecified,
    public val rising: Color = Color.Unspecified,
    public val falling: Color = Color.Unspecified
)
```

What a chart is painted with, for a chart that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// A chart in the brand's two colours, whatever the theme's chart colours are:
PantrixChart(series = series, colors = ChartColors(series = listOf(brand, accent)))
```

A chart has no fill of its own: it is drawn on what it stands on. On the theme's own grounds its lines and its words are the theme's. On a fill, which gives what stands on it a colour, the theme's are not known to read: the words are written in that colour and the lines drawn in a share of it. The colours of the series are drawn as they are given wherever the chart stands, and on a fill it is the caller who knows which read there.

Parameters:

- `series: List<Color>`: The colours the series are drawn in, in the order they are handed out, for the series that name none of their own. Empty, they are the theme's chart colours.
- `grid: Color`: The lines drawn across the chart at the marks of an axis. The theme's `divider`.
- `axis: Color`: The line along an axis. The theme's `border`.
- `label: Color`: What is written beside the axes: the values, the places and the axes' titles, and the names in the legend. The theme's `textSecondary`.
- `crosshair: Color`: The line that marks the place pointed at. The theme's `borderHover`: stronger than the grid it crosses, and quieter than the series it stands behind.
- `tooltipContainer: Color`: The tooltip's fill. The theme's `surface`.
- `tooltipBorder: Color`: The tooltip's edge. The theme's `border`.
- `tooltipText: Color`: The tooltip's heading and its values. The theme's `textPrimary`.
- `tooltipLabel: Color`: The names of the series in the tooltip. The theme's `textSecondary`.
- `rising: Color`: What a value that goes up is drawn in: a step of a waterfall that adds. The theme's `success`.
- `falling: Color`: What a value that goes down is drawn in: a step of a waterfall that takes away. The theme's `danger`.
