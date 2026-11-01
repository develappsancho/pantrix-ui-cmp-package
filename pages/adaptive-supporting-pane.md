# Supporting pane

A screen's main content and a pane that supports it: a document and its comments, a chart and its filters, a map and its results. Side by side where there is room; where there is not, the supporting pane opens in a sheet over the main content, or in its place.

`PantrixSupportingPaneScaffold` looks at its own room, not the window. From `Expanded` on, where the main content does not go under the style's `minMainWidth`, the supporting pane stands at the end, 360dp wide, and the main content takes the rest. In a narrower room the supporting pane is closed, and `show()` opens it.

What is shown is kept in a `SupportingPaneState`: remembered with `rememberSupportingPaneState()`, and not lost on a rotation or when the process starts again. `show()` and `hide()` open and close the pane for the room it is in.

- `PantrixSupportingPaneScaffold` (`com.pantrixui.components.container.supportingpane`, `com.pantrixui:components`): Main content and a pane that supports it: side by side where there is room, over it where not. Keywords: side panel, secondary pane, inspector panel, comments panel, split view.

## Features

- **Beside.** In a wide room the supporting pane is open from the start; `hide()` puts it away and the main content takes the whole room. Back is the app's: the scaffold leaves it alone.
- **A sheet in a narrow room.** `presentation` is `Sheet` by default: the supporting pane opens in a sheet in the scaffold's own room, over the main content. On a phone (`Compact`) it comes from the bottom and closes when dragged down by its handle; in a wider room it comes from the end. Its title is `supportingTitle`, with a close button beside it; a press on the scrim, the back key, Escape and the edge swipe of iOS close it too. A keyboard's focus goes into the sheet, and back where it was as it closes.
- **In the pane's place in a narrow room.** `SupportingPanePresentation.Pane` brings the supporting pane into the main content's place, sliding in from the end; back brings the main content back, and in an edge swipe the pane follows the finger.
- **As the room changes.** A narrower window does not open the sheet by itself, nor cover the main content. A supporting pane open over the main content stays beside it as the window grows wider.
- **What the panes are told.** Each pane is built in a `SupportingPaneScope`: `supportingPlace` says where the supporting pane is (`Beside`, `Sheet`, `InPlaceOfMain`), `isSupportingShown` whether it is in view. Beside, the pane draws its own title and hide button; in the sheet the title is the scaffold's.
- **Resizable.** `resizable = true` puts a handle between the panes: it is dragged, set with the arrow keys, and a screen reader can change its value. The width stays in `SupportingPaneState.supportingWidth`.
- **Foldables.** Held like a book, the two panes meet at the fold at any width; laid on a table, the main content is above the fold and the supporting pane below it.
- **Each pane a window.** Everything in a pane reads the pane's width as its window.
- **State is kept.** The supporting pane stays in the composition while it is hidden and as it moves from one place to another: a comment being written and a chosen filter are not lost.
- **Reading direction.** In a language read from right to left the supporting pane is on the left.

## Usage

### A document and its comments

```kotlin
val comments = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = comments,
    main = { Document(onComments = { comments.show() }) },
    supporting = { Comments(showHeader = supportingPlace == SupportingPanePlace.Beside) },
    modifier = Modifier.fillMaxSize(),
    mainTitle = "Report",
    supportingTitle = "Comments"
)
```

### A map and its results, in its place on a phone

```kotlin
val results = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = results,
    main = { Map(onList = { results.show() }) },
    supporting = {
        Results(onBack = if (supportingPlace == SupportingPanePlace.InPlaceOfMain) ({ results.hide() }) else null)
    },
    modifier = Modifier.fillMaxSize(),
    presentation = SupportingPanePresentation.Pane,
    resizable = true
)
```

## Examples

### A document and its comments

A report and its comments. In a wide room the comments stand beside the report; "Hide comments" above it puts them away, and the report takes the whole room.

Choose "Narrow" in the card's window picker and press "Comments": the comments come in a sheet that opens from the bottom. Drag it down by its handle, press the scrim or press the close button: it closes. In "Medium" the sheet comes from the end.

Write something in the comment field and change the window: what you wrote stays. The supporting pane is one composition wherever it is. Beside the report the pane draws its own title and hide button (`supportingPlace == Beside`); in the sheet the title and the close button are the scaffold's.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPanePlace
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val comments = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = comments,
    main = {
        DocumentPane(
            commentsShown = isSupportingShown,
            onComments = { if (isSupportingShown) comments.hide() else comments.show() }
        )
    },
    supporting = {
        CommentsPane(
            // Beside, the pane draws its own title; in the sheet the title and the close button are the scaffold's.
            onHide = if (supportingPlace == SupportingPanePlace.Beside) ({ comments.hide() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    mainTitle = "Quarterly report",
    supportingTitle = "Comments",
    tagKey = "document"
)

@Composable
private fun DocumentPane(
    commentsShown: Boolean,
    onComments: () -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Quarterly report",
                actions = {
                    PantrixButton(
                        text = if (commentsShown) "Hide comments" else "Comments",
                        onClick = onComments,
                        variant = ButtonVariant.Text,
                        tagKey = "document_comments"
                    )
                },
                tagKey = "document"
            )
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
            ) {
                PARAGRAPHS.forEach { PantrixText(text = it, style = PantrixTheme.typography.body) }
            }
        }
    }
}

@Composable
private fun CommentsPane(onHide: (() -> Unit)?) {
    val draft = rememberTextFieldState()
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            if (onHide != null) HideBar(title = "Comments", onHide = onHide, tagKey = "comments")
            Column(
                modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
            ) {
                COMMENTS.forEach { comment ->
                    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                        PantrixAvatar(contentDescription = null, initials = comment.initials)
                        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
                            PantrixText(text = comment.author, style = PantrixTheme.typography.callout)
                            PantrixText(text = comment.text, style = PantrixTheme.typography.footnote)
                        }
                    }
                }
            }
            PantrixHorizontalDivider()
            PantrixTextField(
                state = draft,
                modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
                label = "Write a comment",
                tagKey = "comments_draft"
            )
        }
    }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun HideBar(
    title: String,
    onHide: () -> Unit,
    tagKey: String
) {
    PantrixTopBar(
        title = title,
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Close,
                contentDescription = "Hide $title",
                onClick = onHide,
                tagKey = "${tagKey}_hide"
            )
        },
        tagKey = tagKey
    )
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private val PARAGRAPHS = listOf(
    "Sales rose twelve per cent in the third quarter over the one before. Most of the rise came from the internet.",
    "Sales in the stores stood still; two new stores open in October instead.",
    "New contracts came into force in the partner channel. Their effect shows in the fourth quarter.",
    "The aim for next quarter is to grow five per cent in the stores while keeping internet sales."
)

private val COMMENTS = listOf(
    DemoComment("Ayşe Yılmaz", "AY", "Can we show where the internet sales came from on their own?"),
    DemoComment("Mert Kaya", "MK", "Are the dates of the store openings settled?"),
    DemoComment("Elif Demir", "ED", "A summary of the partner contracts is attached.")
)

private class DemoComment(
    val author: String,
    val initials: String,
    val text: String
)
```

### A chart and its filters: the width is dragged

A chart and its filters. The filters' values are kept in the example (`channels`, `stacked`): both panes read them, and the chart draws itself again as a filter changes.

`resizable = true`: in a wide room drag the handle between the panes, or focus it and adjust it with the arrow keys; the left arrow widens the filters. The width stays in `supportingWidth`, and is where it was after going to "Narrow" and back. `style = SupportingPaneScaffoldStyle(minSupportingWidth = 240.dp)`: the handle makes the filters no narrower than 240dp.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPanePlace
import com.pantrixui.components.container.supportingpane.SupportingPaneScaffoldStyle
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val filters = rememberSupportingPaneState()
val channels = remember { mutableStateListOf(*CHANNELS.map { it.key }.toTypedArray()) }
var stacked by remember { mutableStateOf(false) }
PantrixSupportingPaneScaffold(
    state = filters,
    main = {
        ChartPane(
            channels = channels,
            stacked = stacked,
            filtersShown = isSupportingShown,
            onFilters = { if (isSupportingShown) filters.hide() else filters.show() }
        )
    },
    supporting = {
        FiltersPane(
            channels = channels,
            onChannel = { key, on -> if (on) channels.add(key) else channels.remove(key) },
            stacked = stacked,
            onStacked = { stacked = it },
            onHide = if (supportingPlace == SupportingPanePlace.Beside) ({ filters.hide() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    mainTitle = "Sales",
    supportingTitle = "Filters",
    resizable = true,
    style = SupportingPaneScaffoldStyle(minSupportingWidth = 240.dp),
    tagKey = "sales"
)

@Composable
private fun ChartPane(
    channels: List<String>,
    stacked: Boolean,
    filtersShown: Boolean,
    onFilters: () -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Sales",
                actions = {
                    PantrixButton(
                        text = if (filtersShown) "Hide filters" else "Filters",
                        onClick = onFilters,
                        variant = ButtonVariant.Text,
                        tagKey = "sales_filters"
                    )
                },
                tagKey = "sales"
            )
            PantrixBarChart(
                data = MONTHS,
                x = { it.month },
                values = CHANNELS.filter { it.key in channels }.map { channel ->
                    ChartValue<MonthSales>(channel.key, channel.name) { channel.of(it) }
                },
                modifier = Modifier.weight(1f).padding(PantrixTheme.spacing.md),
                stacked = stacked,
                description = "Sales of the chosen channels by month",
                tagKey = "sales_chart"
            )
        }
    }
}

@Composable
private fun FiltersPane(
    channels: List<String>,
    onChannel: (key: String, on: Boolean) -> Unit,
    stacked: Boolean,
    onStacked: (Boolean) -> Unit,
    onHide: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            if (onHide != null) HideBar(title = "Filters", onHide = onHide, tagKey = "filters")
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
            ) {
                PantrixText(text = "Channels", style = PantrixTheme.typography.callout)
                CHANNELS.forEach { channel ->
                    PantrixCheckbox(
                        checked = channel.key in channels,
                        onCheckedChange = { onChannel(channel.key, it) },
                        label = channel.name,
                        tagKey = "filter_${channel.key}"
                    )
                }
                PantrixHorizontalDivider()
                PantrixSwitchButton(
                    checked = stacked,
                    onCheckedChange = onStacked,
                    label = "Show stacked",
                    tagKey = "filter_stacked"
                )
            }
        }
    }
}

private val CHANNELS = listOf(
    SalesChannel("online", "Internet") { it.online },
    SalesChannel("stores", "Stores") { it.stores },
    SalesChannel("partners", "Partners") { it.partners }
)

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun HideBar(
    title: String,
    onHide: () -> Unit,
    tagKey: String
) {
    PantrixTopBar(
        title = title,
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Close,
                contentDescription = "Hide $title",
                onClick = onHide,
                tagKey = "${tagKey}_hide"
            )
        },
        tagKey = tagKey
    )
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class SalesChannel(
    val key: String,
    val name: String,
    val of: (MonthSales) -> Double
)

private class MonthSales(
    val month: String,
    val online: Double,
    val stores: Double,
    val partners: Double
)

private val MONTHS = listOf(
    MonthSales("Jul", online = 42.0, stores = 30.0, partners = 12.0),
    MonthSales("Aug", online = 48.0, stores = 29.0, partners = 14.0),
    MonthSales("Sep", online = 55.0, stores = 31.0, partners = 18.0)
)
```

### A map and its results: in the map's place in a narrow room

A map and its results, with `presentation = SupportingPanePresentation.Pane`: in a narrow room the results open in the map's place, not in a sheet. The back button at their top, Android's back key, Escape and the edge swipe of iOS bring the map back; the back button stands only then (`supportingPlace == InPlaceOfMain`).

Press a result: its mark on the map grows. The choice is kept in the example, and both panes read it.

```kotlin
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
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
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPanePlace
import com.pantrixui.components.container.supportingpane.SupportingPanePresentation
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val results = rememberSupportingPaneState()
var chosen by remember { mutableStateOf<String?>(null) }
PantrixSupportingPaneScaffold(
    state = results,
    main = {
        MapPane(
            chosen = chosen,
            // Beside, the results are in view already: the button stands only in a narrow room.
            onResults = if (supportingPlace == SupportingPanePlace.Beside) null else ({ results.show() })
        )
    },
    supporting = {
        ResultsPane(
            chosen = chosen,
            onChoose = { chosen = it },
            onBack = if (supportingPlace == SupportingPanePlace.InPlaceOfMain) ({ results.hide() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    mainTitle = "Map",
    supportingTitle = "Results",
    presentation = SupportingPanePresentation.Pane,
    tagKey = "places"
)

@Composable
private fun MapPane(
    chosen: String?,
    onResults: (() -> Unit)?
) {
    val colors = PantrixTheme.colors
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Map",
                actions = if (onResults != null) {
                    {
                        PantrixButton(
                            text = "Results",
                            onClick = onResults,
                            variant = ButtonVariant.Text,
                            tagKey = "places_results"
                        )
                    }
                } else {
                    null
                },
                tagKey = "places_map"
            )
            Canvas(modifier = Modifier.fillMaxWidth().weight(1f).background(colors.neutral.container)) {
                val step = 48.dp.toPx()
                var x = 0f
                while (x < size.width) {
                    drawLine(colors.border, Offset(x, 0f), Offset(x, size.height))
                    x += step
                }
                var y = 0f
                while (y < size.height) {
                    drawLine(colors.border, Offset(0f, y), Offset(size.width, y))
                    y += step
                }
                PLACES.forEach { place ->
                    val big = place.name == chosen
                    drawCircle(
                        color = if (big) colors.primary.color else colors.textSecondary,
                        radius = (if (big) 12.dp else 7.dp).toPx(),
                        center = Offset(place.x * size.width, place.y * size.height)
                    )
                }
            }
        }
    }
}

@Composable
private fun ResultsPane(
    chosen: String?,
    onChoose: (String) -> Unit,
    onBack: (() -> Unit)?
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Results",
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "places_back") } },
                tagKey = "places_list"
            )
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                PLACES.forEachIndexed { index, place ->
                    if (index > 0) PantrixHorizontalDivider()
                    val selected = place.name == chosen
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .selectable(selected = selected, onClick = { onChoose(place.name) })
                            .background(if (selected) colors.primary.container else Color.Transparent)
                            .padding(spacing.md),
                        verticalArrangement = Arrangement.spacedBy(spacing.xs)
                    ) {
                        PantrixText(
                            text = place.name,
                            style = PantrixTheme.typography.callout,
                            color = if (selected) colors.primary.onContainer else Color.Unspecified,
                            tagKey = "place_$index"
                        )
                        PantrixText(
                            text = place.kind,
                            style = PantrixTheme.typography.footnote,
                            color = if (selected) colors.primary.onContainer else colors.textSecondary
                        )
                    }
                }
            }
        }
    }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private val PLACES = listOf(
    DemoPlace("Moda Sahili", "Park", 0.22f, 0.64f),
    DemoPlace("Kadıköy Çarşısı", "Market", 0.48f, 0.38f),
    DemoPlace("Haydarpaşa", "Station", 0.36f, 0.18f),
    DemoPlace("Yeldeğirmeni", "Neighbourhood", 0.70f, 0.52f),
    DemoPlace("Fenerbahçe Parkı", "Park", 0.82f, 0.82f)
)

private class DemoPlace(
    val name: String,
    val kind: String,
    val x: Float,
    val y: Float
)
```

### Hiding and showing it beside

The state's two halves: `isShownBeside` keeps what a wide room shows, `isOpenOver` what a narrow room shows; `isShown` reads the one of the room as it is. They are apart: a narrower window does not open the sheet by itself.

In "Wide" press "Hide", then go to "Narrow" and press "Show": the sheet opens. Go back to "Wide": the supporting pane stands beside, and `isShownBeside` is "yes" again. `rememberSupportingPaneState(initiallyShownBeside = false)` starts it closed in a wide room too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPaneScope
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val notes = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = notes,
    main = {
        PaneSurface {
            Column(
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
            ) {
                StateLines(this@PantrixSupportingPaneScaffold)
                Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                    PantrixButton(text = "Show", onClick = { notes.show() }, tagKey = "notes_show")
                    PantrixButton(
                        text = "Hide",
                        onClick = { notes.hide() },
                        variant = ButtonVariant.Outline,
                        tagKey = "notes_hide"
                    )
                }
            }
        }
    },
    supporting = {
        PaneSurface {
            PantrixText(
                text = "Notes",
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                style = PantrixTheme.typography.headline,
                tagKey = "notes_title"
            )
        }
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    supportingTitle = "Notes",
    tagKey = "notes"
)

@Composable
private fun StateLines(scope: SupportingPaneScope) {
    val state = scope.state
    listOf(
        "supportingPlace: ${scope.supportingPlace.name}",
        "isShown: ${yesNo(state.isShown)}",
        "isShownBeside: ${yesNo(state.isShownBeside)}",
        "isOpenOver: ${yesNo(state.isOpenOver)}"
    ).forEach { line ->
        PantrixText(text = line, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

private fun yesNo(value: Boolean): String = if (value) "yes" else "no"
```

### On a foldable: split at the fold

On a foldable the two panes are split at the fold. Each pane writes its own size and window class.

Choose "Book": the window is 951dp wide with an upright fold; the main content and the supporting pane are on each side of it, and the gap between them is the strip of 20dp each side of the fold. Choose "Table": the fold lies across, the main content above it and the supporting pane below. A window of 669dp would be one pane on a flat phone; on a foldable laid on a table it is two.

The scaffold looks for the fold in its own room. In "Table" the fold is in the middle of the 951dp window: there the example is as tall as the window, so that the fold crosses it. On a screen the scaffold takes the whole window anyway, with `Modifier.fillMaxSize()`.

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
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val player = rememberSupportingPaneState()
val window = PantrixTheme.window
// On a foldable laid on a table the fold is in the middle of the window: the example is as tall as the window.
val tall = if (window.posture.isTabletop) window.size.height else SUPPORTING_EXAMPLE_HEIGHT
PantrixSupportingPaneScaffold(
    state = player,
    main = { MeasuredPane(name = "Main content", tagKey = "player_main_size") },
    supporting = { MeasuredPane(name = "Supporting pane", tagKey = "player_supporting_size") },
    modifier = Modifier.fillMaxWidth().height(tall),
    mainTitle = "Video",
    supportingTitle = "Controls",
    tagKey = "player"
)

@Composable
private fun MeasuredPane(
    name: String,
    tagKey: String
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PaneSurface(modifier = Modifier.onSizeChanged { size = it }) {
        // The measures are written from left to right: in a right-to-left paragraph the width and the height would read swapped.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                // The pane is its own window: its class follows the pane's width.
                text = "$name: $words dp · ${PantrixTheme.window.widthClass.name}",
                modifier = Modifier.align(Alignment.Center).padding(PantrixTheme.spacing.md),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                tagKey = tagKey
            )
        }
    }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}
```

## API

### PantrixSupportingPaneScaffold

`import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixSupportingPaneScaffold(
    state: SupportingPaneState,
    main: @Composable SupportingPaneScope.() -> Unit,
    supporting: @Composable SupportingPaneScope.() -> Unit,
    modifier: Modifier = Modifier,
    mainTitle: String? = null,
    supportingTitle: String? = null,
    presentation: SupportingPanePresentation = SupportingPanePresentation.Sheet,
    resizable: Boolean = false,
    style: SupportingPaneScaffoldStyle? = null,
    tagKey: String? = null
)
```

A screen's main content and a pane that supports it: a document and its comments, a chart and its filters, a map and its results. Side by side where the room has space for both; over the main content, or in its place, where it has not.

- **Beside.** The scaffold counts its own room, not the window's: from Expanded on, and where the main content keeps the style's `minMainWidth`, the supporting pane is the style's `supportingWidth` wide at the end, the main content takes the rest past the gap, and back is the app's. The supporting pane stands there from the start; `SupportingPaneState.hide` puts it away, and the main content takes the whole room.

- **Narrow room.** Where there is no room beside, the supporting pane is closed until `SupportingPaneState.show`. With `SupportingPanePresentation.Sheet` it opens in a sheet drawn in the scaffold's own room, over a scrim that a press closes: from the bottom in a Compact room, where a drag of its handle pulls it closed, and from the end in a wider one, under `supportingTitle` and a close button. A keyboard's focus moves into it and stays there until it closes. With `SupportingPanePresentation.Pane` it slides in from the end in the main content's place, following a back gesture's progress as the finger moves. Back, Escape and the edge swipe of iOS close it in both.

- **The room changes.** A window made narrower does not open the supporting pane over the main content; a supporting pane open over it stays in view, beside, as the window is made wider.

- **Resizable.** With `resizable` a handle stands in the gap: a drag, the arrow keys and a screen reader's adjusting make the supporting pane wider and narrower, between the style's `minSupportingWidth` and where the main content would be narrower than `minMainWidth`. A pointer over it is one that resizes (`PantrixPointerIcons.ResizeHorizontal`). The width is kept in `SupportingPaneState.supportingWidth`.

- **Folds.** A foldable held like a book shows both at any width, meeting at the fold; one laid on a table shows the main content above the fold and the supporting pane below it. A fold places the panes itself, and there is no handle then.

- **Each pane a window.** What a pane holds is told the pane as its window: `PantrixTheme.window`, its classes and `PantrixTheme.layout` answer for the pane's room. The posture stays the window's.

- **Screen reader.** Each pane is read as one group. `mainTitle` and `supportingTitle` name the panes as they come into view, which TalkBack says on Android; Compose does not tell VoiceOver a pane's name. The scrim is not read: the sheet's close button closes it.

- **Kept state.** Both panes stay where they are in the composition as the room changes, and the supporting pane while it is hidden: what they remember is kept. A pane that is not shown is not placed, so a keyboard and a screen reader skip it.

- **Reduced motion.** The supporting pane appears and leaves at once.

- **Reading direction.** The supporting pane is at the end, on the left where the language is read from right to left, and slides in from the left there.

- **Automation.** The scaffold is tagged `SupportingPaneScaffold_<tagKey>`, its panes `SupportingPaneMain_<tagKey>` and `SupportingPaneSupporting_<tagKey>`, the handle `SupportingPaneHandle_<tagKey>`, and the sheet's scrim and close button `SupportingPaneScrim_<tagKey>` and `SupportingPaneClose_<tagKey>`.

The scaffold takes the room it is given, which is to be bounded both ways: `Modifier.fillMaxSize()` on a screen.

Parameters:

- `state: SupportingPaneState`: whether the supporting pane is shown, and its width: `rememberSupportingPaneState` keeps it across a change of configuration.
- `main: @Composable SupportingPaneScope.() -> Unit`: the screen's main content.
- `supporting: @Composable SupportingPaneScope.() -> Unit`: what supports it.
- `modifier: Modifier`: the room the panes have.
- `mainTitle: String?`: what the main content is called, for a screen reader as it comes into view: "Report".
- `supportingTitle: String?`: what the supporting pane is called: the title of the sheet it is shown in, and for a screen reader as it comes into view: "Comments".
- `presentation: SupportingPanePresentation`: how the supporting pane is shown where there is no room beside the main content.
- `resizable: Boolean`: whether a handle between the main content and the supporting pane makes the supporting pane wider and narrower.
- `style: SupportingPaneScaffoldStyle?`: the scaffold's widths, on top of the theme's.
- `tagKey: String?`: the key of the scaffold's automation tags.

### SupportingPaneState

`import com.pantrixui.components.container.supportingpane.SupportingPaneState`, from `com.pantrixui:components`

```kotlin
class SupportingPaneState(initiallyShownBeside: Boolean = true)
```

What a `PantrixSupportingPaneScaffold` shows: whether its supporting pane stands beside the main content, whether it is open over the main content where there is no room beside it, and how wide it was dragged. An app reads it, changes it, and keeps it across a change of configuration and a process's death: `rememberSupportingPaneState` saves it.

```kotlin
val comments = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = comments,
    main = { Document(onComments = { comments.show() }) },
    supporting = { Comments() }
)
```

The two are kept apart. Where the room has space for both, the supporting pane stands beside the main content from the start, until `hide` puts it away. Where it has not, the supporting pane is closed until `show` opens it. So a window made narrower does not open a sheet over the main content by itself, and a supporting pane open over the main content stays in view, beside it, as the window is made wider.

Parameters:

- `initiallyShownBeside: Boolean`: whether the supporting pane stands beside the main content at first, where there is room for both.

Members:

- `isShownBeside: Boolean`: Whether the supporting pane stands beside the main content where the room has space for both.
- `isOpenOver: Boolean`: Whether the supporting pane is open where there is no room beside the main content: in a sheet over it, or in its place, as the scaffold's presentation says. Closed at first.
- `supportingWidth: Dp`: How wide the supporting pane was made by its handle beside the main content, or `Dp.Unspecified` while it is as wide as the scaffold's style says. Kept with the rest of the state, and set by an app that remembers a reader's width itself.
- `isShown: Boolean`: Whether the supporting pane is in view as the scaffold's room stands: beside the main content, or over it. Before the scaffold has laid out its room, whether it is to be in view wherever the room puts it.
- `fun show()`: Shows the supporting pane: beside the main content where there is room, over it where there is not. Called before the scaffold has laid out its room, as at a screen's start, it shows the pane wherever the room puts it.
- `fun hide()`: Hides the supporting pane: beside the main content where there is room, and closes it over the main content where there is not. What back, Escape and the edge swipe of iOS do while it is open over the main content. Called before the scaffold has laid out its room, it hides the pane wherever the room puts it.

On the type:

- `SupportingPaneState.Saver: Saver<SupportingPaneState, *>`: What `rememberSupportingPaneState` saves a state with.

### rememberSupportingPaneState

`import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberSupportingPaneState(initiallyShownBeside: Boolean = true): SupportingPaneState
```

A `SupportingPaneState` remembered and saved, so that whether the supporting pane is shown, and its width, come back after a change of configuration and a process's death.

Parameters:

- `initiallyShownBeside: Boolean`: whether the supporting pane stands beside the main content at first, where there is room for both.

### SupportingPaneScope

`import com.pantrixui.components.container.supportingpane.SupportingPaneScope`, from `com.pantrixui:components`

```kotlin
interface SupportingPaneScope
```

What each pane of a `PantrixSupportingPaneScaffold` is told of the scaffold it is in.

Members:

- `state: SupportingPaneState`: The scaffold's state: what a pane shows and hides the supporting pane with.
- `supportingPlace: SupportingPanePlace`: Where the supporting pane is as the room stands: beside the main content, in a sheet over it, or instead.
- `isSupportingShown: Boolean`: Whether the supporting pane is in view where it is: what a button that shows and hides it says.

### SupportingPanePlace

`import com.pantrixui.components.container.supportingpane.SupportingPanePlace`, from `com.pantrixui:components`

```kotlin
enum class SupportingPanePlace
```

Where a `PantrixSupportingPaneScaffold`'s supporting pane is, as the scaffold's room stands.

Entries:

- `Beside`: Beside the main content, or under it at the fold of a foldable laid on a table: a pane of its own, that the app hides and shows with a button of its own.
- `Sheet`: Over the main content, in the scaffold's sheet under its title and close button: it draws no header itself.
- `InPlaceOfMain`: In the main content's place: its own bar has a back button that calls `SupportingPaneState.hide`.

### SupportingPanePresentation

`import com.pantrixui.components.container.supportingpane.SupportingPanePresentation`, from `com.pantrixui:components`

```kotlin
enum class SupportingPanePresentation
```

How a `PantrixSupportingPaneScaffold` shows its supporting pane where there is no room beside the main content.

Entries:

- `Sheet`: In a sheet the scaffold draws over the main content, under the supporting pane's title and a close button: from the bottom in a Compact room, where a drag of its handle pulls it closed, and from the end in a wider one.
- `Pane`: In the main content's place, sliding in from the end over it: back brings the main content back, and the supporting pane's own bar has a back button that calls `SupportingPaneState.hide`.

### SupportingPaneScaffoldStyle

`import com.pantrixui.components.container.supportingpane.SupportingPaneScaffoldStyle`, from `com.pantrixui:components`

```kotlin
class SupportingPaneScaffoldStyle(
    public val supportingWidth: Dp = Dp.Unspecified,
    public val minSupportingWidth: Dp = Dp.Unspecified,
    public val minMainWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val handleWidth: Dp = Dp.Unspecified,
    public val handleHeight: Dp = Dp.Unspecified,
    public val handleTarget: Dp = Dp.Unspecified
) : PantrixStyle<SupportingPaneScaffoldStyle>
```

`PantrixSupportingPaneScaffold`'s geometry: how wide the supporting pane is beside the main content, how narrow a drag of the handle may make it and the main content, and the handle itself.

The gap between the panes follows density, as the layout's gutter it is by default does; the widths and the handle do not. The panes' colours are not part of the style: each pane is drawn by the app, on what it puts in it. Where the supporting pane is shown in a sheet, the sheet's own style draws it.

Parameters:

- `supportingWidth: Dp`: How wide the supporting pane is beside the main content until its handle is dragged, and the side sheet it is shown in where there is no room beside: 360dp, a phone's width.
- `minSupportingWidth: Dp`: The narrowest a drag of the handle makes the supporting pane.
- `minMainWidth: Dp`: The narrowest the main content is let be beside the supporting pane: a drag of the handle stops where it would be narrower, and a room too narrow for both at their narrowest shows the supporting pane over the main content.
- `gap: Dp`: Between the panes. Unspecified in the presets: the layout's gutter, `PantrixTheme.layout.gutter`, which grows with the window. A brand whose panes meet edge to edge, with a line of their own between them, gives 0dp.
- `handleWidth: Dp`: The mark a resizable supporting pane's handle draws in the gap: a short upright bar.
- `handleHeight: Dp`: How tall the handle's upright bar is: `handleWidth` is how thick it is.
- `handleTarget: Dp`: How wide the strip is that a finger or a pointer catches the handle by, centred on the gap and over the panes' edges where the gap is narrower: each platform's smallest touch target under a finger, a narrow strip under a pointer.
