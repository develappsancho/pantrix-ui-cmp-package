# Segment Button

A few options side by side in one control, one of them selected. It is a radio group drawn as one control, and a choice changes the screen around it at once: a list's order, a chart's span, a map's layer.

It is for two to five options of a word or two. For more options, or longer ones, a radio group is used; for actions rather than a choice, buttons. The control selects nothing by itself: whichever value `selected` says is the one selected; a press and the arrow keys report the wanted value through `onSelect`.

- `PantrixSegmentButton` (`com.pantrixui.components.elements.segmentbutton`, `com.pantrixui:components`): A small set of choices side by side in one control, one of them chosen: a radio group drawn as one control, with a pill that slides to the choice. Keywords: segmented control, segmented button, toggle group, button toggle, single choice.

## Features

- **The sliding pill.** The pill slides under the segment that is selected, and that segment's label is written in the `primary` colour. Pressing the selected segment again does nothing.
- **Width.** `fullWidth` (the default) spans the control across the width it is given and gives the segments equal shares: the segments stay where they are whatever their labels say in another language. `fullWidth = false` makes each segment as wide as its label.
- **Icons.** `SegmentOption(icon = …)` puts an icon before the label, in the label's colour; a screen reader passes over it.
- **A segment that cannot be selected.** `SegmentOption(enabled = false)` disables a single segment: a press on it does nothing and the arrow keys skip it. The control's `enabled = false` disables them all; the pill stays where it is and the selection can still be read.
- **With none selected.** If `selected` is not the value of any option, and null is such a value, no segment is selected and no pill is drawn.
- **Keyboard.** The control is one stop for Tab, on the selected segment. The arrow keys select the next or the previous segment, go round from the last to the first and skip one that cannot be selected; in a right-to-left layout the directions swap.
- **Screen reader.** It is read as a group of radio buttons: each segment is named by its label, and one of them is selected.
- **Platform.** On Android it is a fully round pill 40dp tall. On iOS it is 32dp tall, on desktop 30dp and on the web 34dp: a rectangle with medium rounded corners.
- **Its own colours and style.** `SegmentButtonColors` gives the colour of the track, of the pill, and of the selected and the unselected labels; `SegmentButtonStyle` gives the track's shape, its height and its paddings. `labelStyle` changes the labels' type; their colours come from the segment's state.
- **Font scale.** The track is as tall as the style says, and the platform's touch target is reserved around it. When the system's font size is made larger, a label taller than the track makes the track taller too.

## Usage

### A list's sort order

```kotlin
var sort by rememberSaveable { mutableStateOf(Sort.Newest) }
PantrixSegmentButton(
    options = listOf(
        SegmentOption(Sort.Newest, stringResource(Res.string.newest), tagKey = "newest"),
        SegmentOption(Sort.Cheapest, stringResource(Res.string.cheapest), tagKey = "cheapest"),
        SegmentOption(Sort.Nearest, stringResource(Res.string.nearest), tagKey = "nearest")
    ),
    selected = sort,
    onSelect = { sort = it },
    tagKey = "sort"
)
```

### In a toolbar, sized to its labels

```kotlin
PantrixSegmentButton(
    options = spans.map { SegmentOption(it, it.label, tagKey = it.name) },
    selected = span,
    onSelect = { span = it },
    fullWidth = false,
    tagKey = "span"
)
```

### With icons, and a choice that is not open yet

```kotlin
PantrixSegmentButton(
    options = listOf(
        SegmentOption("list", stringResource(Res.string.list), icon = PantrixIcons.Menu, tagKey = "list"),
        SegmentOption("map", stringResource(Res.string.map), PantrixIcons.Search, enabled = false, tagKey = "map")
    ),
    selected = view,
    onSelect = { view = it },
    tagKey = "view"
)
```

### A pill in colours of its own

```kotlin
val primary = PantrixTheme.colors.primary
PantrixSegmentButton(
    options = sorts,
    selected = sort,
    onSelect = { sort = it },
    colors = SegmentButtonColors(pill = primary.color, selectedContent = primary.onColor),
    tagKey = "sort"
)
```

## Examples

### Segments that share the width equally

At its plainest: the options, the selected value and `onSelect`. The control spans the width it is given and the three segments share it equally (`fullWidth`, the default). The choice is applied at once: the line under the control changes with what is chosen.

The pill slides under the segment that is selected, and that segment's label is written in the `primary` colour. With a keyboard the control is one Tab stop; the arrow keys move the selection to the next segment or to the previous one.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var sort by rememberSaveable { mutableStateOf("newest") }
PantrixSegmentButton(
    options = SORTS,
    selected = sort,
    onSelect = { sort = it },
    modifier = Modifier.widthIn(max = 480.dp),
    tagKey = "sort"
)
PantrixText(
    text = "Sort order: ${SORTS.first { it.value == sort }.label}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "sort_result"
)

private val SORTS = listOf(
    SegmentOption("newest", "Newest", tagKey = "newest"),
    SegmentOption("cheapest", "Cheapest", tagKey = "cheapest"),
    SegmentOption("nearest", "Nearest", tagKey = "nearest")
)
```

### As wide as its labels

`fullWidth = false` makes each segment as wide as its label: in a toolbar or beside a heading the control takes only the room it needs. If there is not room for them all, the short labels stay whole and the long ones share what is left.

Both controls are like this: a time span with four options and a choice of platform with three.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var span by rememberSaveable { mutableStateOf("week") }
var platform by rememberSaveable { mutableStateOf("web") }
PantrixSegmentButton(
    options = SPANS,
    selected = span,
    onSelect = { span = it },
    fullWidth = false,
    tagKey = "span"
)
PantrixText(
    text = "Showing: the last ${SPANS.first { it.value == span }.label.lowercase()}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "span_result"
)
PantrixSegmentButton(
    options = PLATFORMS,
    selected = platform,
    onSelect = { platform = it },
    fullWidth = false,
    tagKey = "platform"
)

private val SPANS = listOf(
    SegmentOption("day", "Day", tagKey = "day"),
    SegmentOption("week", "Week", tagKey = "week"),
    SegmentOption("month", "Month", tagKey = "month"),
    SegmentOption("year", "Year", tagKey = "year")
)

private val PLATFORMS = listOf(
    SegmentOption("android", "Android", tagKey = "android"),
    SegmentOption("ios", "iOS", tagKey = "ios"),
    SegmentOption("web", "Web", tagKey = "web")
)
```

### Icons and a segment that cannot be selected

`SegmentOption(icon = …)` puts an icon before the label: the icon is in the label's colour, and a screen reader passes over it.

"Folders" is not open yet (`enabled = false`): it is written in the disabled colour, a press on it does nothing and the arrow keys skip it.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.icons.PantrixIcons

var view by rememberSaveable { mutableStateOf("list") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption("list", "List", icon = PantrixIcons.Menu, tagKey = "list"),
        SegmentOption("search", "Search", icon = PantrixIcons.Search, tagKey = "search"),
        SegmentOption("folders", "Folders", icon = PantrixIcons.Folder, enabled = false, tagKey = "folders")
    ),
    selected = view,
    onSelect = { view = it },
    modifier = Modifier.widthIn(max = 480.dp),
    tagKey = "view"
)
```

### With none selected

If `selected` is not the value of any option, no segment is selected and no pill is drawn; null is such a value too. It is used where an answer must not be chosen in advance.

Press one: the pill appears there. From then on the selection slides between the two segments; the control does not clear the selection by itself.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText

var helpful by rememberSaveable { mutableStateOf<String?>(null) }
PantrixText(text = if (helpful == null) "Was this page helpful?" else "Your answer was saved")
PantrixSegmentButton(
    options = listOf(
        SegmentOption("yes", "Yes", tagKey = "yes"),
        SegmentOption("no", "No", tagKey = "no")
    ),
    selected = helpful,
    onSelect = { helpful = it },
    fullWidth = false,
    tagKey = "helpful"
)
```

### Its own colours

`colors` changes only the fields that are given: here the pill is in the app's own purple (`pill`), and the label on it in the colour that reads on that purple (`selectedContent`); the track and the unselected labels stay in the theme's colour.

The app's purple is in none of the theme's roles: the colour that reads on such a pill is the caller's to give too. A disabled control's track and a segment that cannot be selected are drawn in the theme's colours, even when colours are given.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentButtonColors
import com.pantrixui.components.elements.segmentbutton.SegmentOption

val own = ownColors()
var span by rememberSaveable { mutableStateOf("week") }
PantrixSegmentButton(
    options = SPANS,
    selected = span,
    onSelect = { span = it },
    modifier = Modifier.widthIn(max = 480.dp),
    colors = SegmentButtonColors(pill = own.color, selectedContent = own.onColor),
    tagKey = "span_own"
)

private val SPANS = listOf(
    SegmentOption("day", "Day", tagKey = "day"),
    SegmentOption("week", "Week", tagKey = "week"),
    SegmentOption("month", "Month", tagKey = "month"),
    SegmentOption("year", "Year", tagKey = "year")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Disabled

`enabled = false` disables every segment: the track and the labels are drawn in the disabled colours, and the control takes no press and no focus. The pill stays where it is: which option is selected can still be read.

This control's options are the same as those of the first example. The segments are named inside the control's test tag, so they do not clash: the one there is `SegmentButton_sort.Segment_newest`, and the one here `SegmentButton_locked.Segment_newest`.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

PantrixSegmentButton(
    options = SORTS,
    selected = "newest",
    onSelect = {},
    modifier = Modifier.widthIn(max = 480.dp),
    enabled = false,
    tagKey = "locked"
)

private val SORTS = listOf(
    SegmentOption("newest", "Newest", tagKey = "newest"),
    SegmentOption("cheapest", "Cheapest", tagKey = "cheapest"),
    SegmentOption("nearest", "Nearest", tagKey = "nearest")
)
```

### Style

`style` changes the geometry of a single control: the track's shape (`shape`) and its height (`height`), the room between the track's edge and the pill (`trackPadding`), and the room on each side of a label (`segmentPadding`). Only the fields that are given change; the rest comes from the theme's and the platform's style.

The pill has no shape of its own: it is the track's shape, with each corner made smaller by `trackPadding`. That way the corners of the two curve around the same centre.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentButtonStyle
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.token.shape.ShapeRole

var size by rememberSaveable { mutableStateOf("m") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption("s", "Small", tagKey = "s"),
        SegmentOption("m", "Medium", tagKey = "m"),
        SegmentOption("l", "Large", tagKey = "l")
    ),
    selected = size,
    onSelect = { size = it },
    fullWidth = false,
    style = SegmentButtonStyle(
        shape = ShapeRole.Small,
        height = 48.dp,
        trackPadding = 6.dp,
        segmentPadding = 20.dp
    ),
    tagKey = "size"
)
```

### In a type of its own

In a narrow column, in a type of its own: three options fit in the theme's `footnote` type (`labelStyle`). The colour is the segment's: the chosen one's the primary colour, the others' quieter.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var mode by rememberSaveable { mutableStateOf("auto") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption("light", "Light", tagKey = "light"),
        SegmentOption("dark", "Dark", tagKey = "dark"),
        SegmentOption("auto", "System", tagKey = "auto")
    ),
    selected = mode,
    onSelect = { mode = it },
    modifier = Modifier.widthIn(max = 220.dp),
    tagKey = "mode",
    labelStyle = PantrixTheme.typography.footnote
)
```

## API

### PantrixSegmentButton

`import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixSegmentButton(
    options: List<SegmentOption<T>>,
    selected: T?,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    fullWidth: Boolean = true,
    style: SegmentButtonStyle? = null,
    colors: SegmentButtonColors? = null,
    tagKey: String? = null,
    labelStyle: TextStyle = PantrixTheme.typography.label
)
```

A segment button: a small set of choices side by side in one control, one of them chosen.

It is a radio group drawn as one control. A screen reader hears a group of radio buttons, one of them selected, and a choice changes what is on the screen around it at once: a list's order, a chart's span, a map's layer. A pill slides to the chosen segment, and its label takes the primary colour. Choosing the segment that is chosen already does nothing.

The control is one stop for Tab, on the chosen segment. The arrow keys choose the next or the previous segment, the other way round in a right-to-left layout, round from the last to the first, and skip a segment that cannot be chosen. A press takes the focus to the control where a press can.

The track is as tall as the style says, with the platform's touch target reserved around it. A label set larger than the track, at a large font scale, makes it taller. Use it for two to five choices of a word or two: for more, or for longer ones, a radio group; for actions rather than a choice, buttons.

Parameters:

- `options: List<SegmentOption<T>>`: the choices, in order. An empty list draws nothing.
- `selected: T?`: the value of the chosen segment, compared with each option's by `==`. A value no option has, null among them, chooses none: no segment is selected and no pill is drawn.
- `onSelect: (T) -> Unit`: called with the value of the segment the user chose, by a press or by a key, when it is not the chosen one already. The control chooses nothing by itself: a segment is chosen when `selected` says so.
- `modifier: Modifier`: the control's modifier, outside the touch target it reserves.
- `enabled: Boolean`: false disables every segment. The pill stays where it is, so that the choice can still be read.
- `fullWidth: Boolean`: true spans the control across the width it is given, each segment taking an equal share, so that the segments stay where they are whatever their labels say in another language. False makes each segment as wide as its label; in a room too narrow for that, the short labels stay whole and the long ones share what is left.
- `style: SegmentButtonStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: SegmentButtonColors?`: this control's own colours: the ones it sets, with the theme's for the rest. A disabled control's track and a segment that cannot be chosen keep the theme's.
- `tagKey: String?`: the control's automation key: the control is `SegmentButton_<tagKey>`, and its segments are named inside it, `SegmentButton_<tagKey>.Segment_<key>`, so that two controls with the same options are told apart. A choice is reported as a `SegmentButton` event, `select`, which carries the segment's key, or its place without one, and never its label.
- `labelStyle: TextStyle`: the type the labels are set in: the theme's `label` unless given. A label set larger than the track makes it taller, as a large font scale does.

### SegmentOption

`import com.pantrixui.components.elements.segmentbutton.SegmentOption`, from `com.pantrixui:components`

```kotlin
class SegmentOption<out T>(
    public val value: T,
    public val label: String,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

One choice of `PantrixSegmentButton`: the value it stands for, its label, an icon before it, and a key for automation.

Parameters:

- `value: T`: What the control gives to its `onSelect` when the segment is chosen, and compares with its `selected` by `==`.
- `label: String`: The visible text, and the segment's name for a screen reader.
- `icon: ImageVector?`: Drawn before the label, in the label's colour, or null for none. A screen reader passes over it.
- `enabled: Boolean`: Whether the segment can be chosen. A press does nothing on one that cannot, and the arrow keys skip it.
- `tagKey: String?`: The segment's automation key, the same in every language: the segment is `Segment_<tagKey>`, or `Segment_<index>` without one, inside the tag of a control that has a key: `SegmentButton_sort.Segment_newest`.

### SegmentButtonStyle

`import com.pantrixui.components.elements.segmentbutton.SegmentButtonStyle`, from `com.pantrixui:components`

```kotlin
class SegmentButtonStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val trackPadding: Dp = Dp.Unspecified,
    public val segmentPadding: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<SegmentButtonStyle>
```

`PantrixSegmentButton`'s geometry: the track, the pill that slides inside it, and the room each segment gives its label.

The pill has no shape of its own: it is the track's shape with each corner smaller by `trackPadding`, so the two curve around the same centres on every brand's shape scale. A pill as round as the track would look rounder than the room it is in.

On Android the control is Material 3's segmented button: 40dp tall, a pill throughout. On iOS it is `UISegmentedControl`: 32pt tall, a rounded rectangle with the pill close to its edge. The desktop's is lower, 30dp, for a pointer, and the web's 34dp.

An icon goes by the buttons': 20dp on Android, where the pill is as tall as a small button, and 18dp in the lower pills of the other platforms, between a small button's icon and an extra small one's.

The height, the two paddings and the gap follow the density, since they are the room around the labels. The icon's size and the shape do not.

Parameters:

- `shape: ShapeSpec`: The track's shape: a step of the brand's shape scale, or a fixed shape.
- `height: Dp`: The track's height. A label set larger than it has room for, at a large font scale, makes the track taller.
- `trackPadding: Dp`: The room between the track's edge and the pill.
- `segmentPadding: Dp`: The room on each side of a segment's label.
- `iconGap: Dp`: Between a segment's icon and its label.
- `iconSize: Dp`: The width and height of a segment's icon.

### SegmentButtonColors

`import com.pantrixui.components.elements.segmentbutton.SegmentButtonColors`, from `com.pantrixui:components`

```kotlin
data class SegmentButtonColors(
    public val track: Color = Color.Unspecified,
    public val pill: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val unselectedContent: Color = Color.Unspecified
)
```

What `PantrixSegmentButton` is painted with, for a control that does not take the theme's: a colour that is set is used, and one that is left out stays the theme's role.

```kotlin
PantrixSegmentButton(
    options = sorts,
    selected = sort,
    onSelect = { sort = it },
    colors = SegmentButtonColors(pill = brand, selectedContent = onBrand)
)
```

They are the colours of segments that can be chosen. A disabled control's track and a segment that cannot be chosen are drawn in the theme's disabled roles whatever is given here; the pill keeps its colour, so that the choice can still be read.

A fill given here that is one of the theme's own colours brings the colour the theme pairs with it for what is drawn on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `track: Color`: The track the segments stand on. The neutral role's `container`.
- `pill: Color`: The pill under the chosen segment. The theme's `surface`.
- `selectedContent: Color`: The label and the icon of the chosen segment: the colour that reads on `pill`. The theme's `primary`.
- `unselectedContent: Color`: The label and the icon of the other segments: the colour that reads on `track`. The theme's `textSecondary`.
