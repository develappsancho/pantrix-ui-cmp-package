# Table

Case study: a table of orders. A plain table with columns where the room is wide, a list of cards where it is narrow.

This is a component and not a screen, so it looks at the room it is given and not at the window. The same table may be put inside a narrow pane of a wide window; had it asked the window, it would draw a table there too and would not fit. The component learns its own room from `BoxWithPantrixWindow`: the box tells its content the room it is given, as a window is told, and answers for the box everything a screen asks the window.

## Features

- **Its own room.** `BoxWithPantrixWindow(modifier) { box -> ... }` tells its content the most room it may take: it is `BoxWithConstraints` underneath, and what it tells is that box's `maxWidth` and `maxHeight`.
- **The same helpers.** `box` is a `PantrixWindow`: `box.isNarrow`, `box.byWidth(...)`, `box.widthClass >= WindowWidthClass.Expanded`. Whatever a screen asks the window, a component asks its box.
- **The window's breakpoints.** The box is classed by the same breakpoints as the theme's window; a component's own thresholds are given with `breakpoints`.
- **No needless recomposition.** Content that reads a class of the box is recomposed when that class changes, and not at every size as the content of `BoxWithConstraints` is. A reader of `size` follows every change.
- **Height from the window.** In a page that scrolls there is no end to the height the box may take: its height class reads `Expanded` and the box is never short. Ask the box about the width and the window about the height.
- **The box is flat.** A fold is the window's: ask the window about the posture. Where it crosses the box, `rememberFoldsInNode()` says; the "Two panes" page tells of it.
- **The box's measures.** `PantrixTheme.layout(box)` gives the margin and the gutter by the box's class and not the window's.
- **As a window for its content.** Inside the box `PantrixTheme.window` and `responsive` still ask the window; where everything is to ask the box, the box is given to the content with `LocalPantrixWindow`.
- **The content's place.** `contentAlignment` places content that is smaller than the box; `propagateMinConstraints` makes the content at least as large as the least size of the box.
- **Composed while it is measured.** Like `BoxWithConstraints`, it composes its content while it is measured: it does not go in a row or a column that is sized by `IntrinsicSize`.

## Examples

### The same component, in two places

`OrdersTable` stands twice: at the page's width and in a 280 dp box. The component asks its own box rather than the window (`box.isNarrow`): it is a list in a room narrower than 600 dp and a table from 600 dp on. The date column appears from 840 dp on.

On a phone both are lists. Turn the phone or widen the window, and the upper one turns into a table once it is left with 600 dp; the lower one stays a list. The card's window selector shows the same without touching the window: in "Narrow" both are lists; in "Wide" the upper one is a table and the lower one a list. In "Real" the upper one may be a list even while the window reads `Medium`: the sidebar and the page's margins take their share of the window's width. Had it asked the window, it would have laid a table out in the narrow room that is left.

The selected order is kept outside the component, above the two views: kept inside them, it would be lost when the view changes. Press a card in the lower list: the same order is selected in the upper view too.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

var selectedId by rememberSaveable { mutableStateOf<String?>(null) }
PantrixText(text = "As wide as the page", style = PantrixTheme.typography.label)
OrdersTable(
    orders = ORDERS,
    selectedId = selectedId,
    onSelect = { selectedId = it },
    modifier = Modifier.fillMaxWidth(),
    tagKey = "page"
)
PantrixText(text = "The same component, in a 280 dp box", style = PantrixTheme.typography.label)
OrdersTable(
    orders = ORDERS,
    selectedId = selectedId,
    onSelect = { selectedId = it },
    modifier = Modifier.width(280.dp),
    tagKey = "box"
)
PantrixText(text = "Selected order: ${selectedId?.let { "#$it" } ?: "none"}", tagKey = "selected_order")

@Composable
internal fun OrdersTable(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    tagKey: String = "orders"
) {
    // The component's own box, as a window. The content is recomposed when the width class read here changes,
    // and not each time the box's size does.
    BoxWithPantrixWindow(modifier = modifier) { box ->
        if (box.isNarrow) {
            OrderList(orders, selectedId, onSelect, tagKey)
        } else {
            // Four columns at a medium width; from Expanded on, the date is the fifth column.
            OrderGrid(orders, selectedId, onSelect, tagKey, showDate = box.widthClass >= WindowWidthClass.Expanded)
        }
    }
}

@Composable
private fun OrderList(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String
) {
    val spacing = PantrixTheme.spacing
    Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
        orders.forEach { order ->
            PantrixCard(
                modifier = Modifier.fillMaxWidth(),
                // The selected card's ground is filled: the selection shows in both views.
                variant = if (order.id == selectedId) CardVariant.Filled else CardVariant.Outlined,
                onClick = { onSelect(order.id) },
                contentPadding = PaddingValues(spacing.md),
                tagKey = "${tagKey}_card_${order.id}"
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = order.customer,
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.label
                    )
                    PantrixText(text = order.total)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = "#${order.id} · ${order.date}",
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.footnote,
                        color = PantrixTheme.colors.textSecondary
                    )
                    PantrixChip(label = order.status, onClick = null)
                }
            }
        }
    }
}

@Composable
private fun OrderGrid(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String,
    showDate: Boolean
) {
    val colors = PantrixTheme.colors
    PantrixSurface(border = colors.border, shape = PantrixTheme.shapes.md) {
        Column {
            OrderRow(modifier = Modifier.testTag("${tagKey}_header")) {
                HeaderCell("Order", weight = ID_WEIGHT)
                HeaderCell("Customer", weight = CUSTOMER_WEIGHT)
                if (showDate) HeaderCell("Date", weight = DATE_WEIGHT)
                HeaderCell("Status", weight = STATUS_WEIGHT)
                HeaderCell("Total", weight = TOTAL_WEIGHT, align = TextAlign.End)
            }
            orders.forEach { order ->
                val selected = order.id == selectedId
                PantrixHorizontalDivider()
                OrderRow(
                    modifier = Modifier
                        .testTag("${tagKey}_row_${order.id}")
                        .selectable(selected = selected, onClick = { onSelect(order.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    Cell("#${order.id}", weight = ID_WEIGHT, color = text)
                    Cell(order.customer, weight = CUSTOMER_WEIGHT, color = text)
                    if (showDate) Cell(order.date, weight = DATE_WEIGHT, color = text)
                    Cell(order.status, weight = STATUS_WEIGHT, color = text)
                    Cell(order.total, weight = TOTAL_WEIGHT, color = text, align = TextAlign.End)
                }
            }
        }
    }
}

@Composable
private fun OrderRow(
    modifier: Modifier = Modifier,
    cells: @Composable RowScope.() -> Unit
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = PantrixTheme.spacing.md, vertical = PantrixTheme.spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically,
        content = cells
    )
}

@Composable
private fun RowScope.HeaderCell(
    text: String,
    weight: Float,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(
        text = text,
        modifier = Modifier.weight(weight),
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        textAlign = align,
        maxLines = 1
    )
}

@Composable
private fun RowScope.Cell(
    text: String,
    weight: Float,
    color: Color,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(text = text, modifier = Modifier.weight(weight), color = color, textAlign = align, maxLines = 1)
}

private const val ID_WEIGHT = 0.8f

private const val CUSTOMER_WEIGHT = 2f

private const val DATE_WEIGHT = 1.2f

private const val STATUS_WEIGHT = 1.4f

private const val TOTAL_WEIGHT = 1f

internal data class Order(
    val id: String,
    val customer: String,
    val date: String,
    val status: String,
    val total: String
)

internal val ORDERS = listOf(
    Order("1042", "Ayşe Yılmaz", "02.10.2026", "Preparing", "1.240 TL"),
    Order("1041", "Mehmet Demir", "02.10.2026", "Shipped", "380 TL"),
    Order("1040", "Zeynep Kaya", "01.10.2026", "Delivered", "2.915 TL"),
    Order("1039", "Can Öztürk", "30.09.2026", "Delivered", "640 TL"),
    Order("1038", "Elif Şahin", "29.09.2026", "Cancelled", "95 TL")
)
```

### A box whose width is picked

The component's three states, without touching the window: the box's width is picked. A list at 320 dp, a table of four columns at 700 dp, five columns with the date column at 900 dp. Where the box is wider than the screen, it scrolls sideways.

The window never changed; what changed is the room the component is given. `box.isNarrow` picks the list, and `box.widthClass >= WindowWidthClass.Expanded` the date column. Pick a row and change the width: the selection stays.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

var width by rememberSaveable { mutableIntStateOf(320) }
var selectedId by rememberSaveable { mutableStateOf<String?>(null) }
PantrixSegmentButton(
    options = listOf(
        SegmentOption(value = 320, label = "320 dp", tagKey = "320"),
        SegmentOption(value = 700, label = "700 dp", tagKey = "700"),
        SegmentOption(value = 900, label = "900 dp", tagKey = "900")
    ),
    selected = width,
    onSelect = { width = it },
    tagKey = "box_width"
)
HorizontalScrollFrame {
    OrdersTable(
        orders = ORDERS,
        selectedId = selectedId,
        onSelect = { selectedId = it },
        modifier = Modifier.width(width.dp),
        tagKey = "sized"
    )
}

@Composable
internal fun OrdersTable(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    tagKey: String = "orders"
) {
    // The component's own box, as a window. The content is recomposed when the width class read here changes,
    // and not each time the box's size does.
    BoxWithPantrixWindow(modifier = modifier) { box ->
        if (box.isNarrow) {
            OrderList(orders, selectedId, onSelect, tagKey)
        } else {
            // Four columns at a medium width; from Expanded on, the date is the fifth column.
            OrderGrid(orders, selectedId, onSelect, tagKey, showDate = box.widthClass >= WindowWidthClass.Expanded)
        }
    }
}

internal val ORDERS = listOf(
    Order("1042", "Ayşe Yılmaz", "02.10.2026", "Preparing", "1.240 TL"),
    Order("1041", "Mehmet Demir", "02.10.2026", "Shipped", "380 TL"),
    Order("1040", "Zeynep Kaya", "01.10.2026", "Delivered", "2.915 TL"),
    Order("1039", "Can Öztürk", "30.09.2026", "Delivered", "640 TL"),
    Order("1038", "Elif Şahin", "29.09.2026", "Cancelled", "95 TL")
)

@Composable
private fun OrderList(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String
) {
    val spacing = PantrixTheme.spacing
    Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
        orders.forEach { order ->
            PantrixCard(
                modifier = Modifier.fillMaxWidth(),
                // The selected card's ground is filled: the selection shows in both views.
                variant = if (order.id == selectedId) CardVariant.Filled else CardVariant.Outlined,
                onClick = { onSelect(order.id) },
                contentPadding = PaddingValues(spacing.md),
                tagKey = "${tagKey}_card_${order.id}"
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = order.customer,
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.label
                    )
                    PantrixText(text = order.total)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = "#${order.id} · ${order.date}",
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.footnote,
                        color = PantrixTheme.colors.textSecondary
                    )
                    PantrixChip(label = order.status, onClick = null)
                }
            }
        }
    }
}

@Composable
private fun OrderGrid(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String,
    showDate: Boolean
) {
    val colors = PantrixTheme.colors
    PantrixSurface(border = colors.border, shape = PantrixTheme.shapes.md) {
        Column {
            OrderRow(modifier = Modifier.testTag("${tagKey}_header")) {
                HeaderCell("Order", weight = ID_WEIGHT)
                HeaderCell("Customer", weight = CUSTOMER_WEIGHT)
                if (showDate) HeaderCell("Date", weight = DATE_WEIGHT)
                HeaderCell("Status", weight = STATUS_WEIGHT)
                HeaderCell("Total", weight = TOTAL_WEIGHT, align = TextAlign.End)
            }
            orders.forEach { order ->
                val selected = order.id == selectedId
                PantrixHorizontalDivider()
                OrderRow(
                    modifier = Modifier
                        .testTag("${tagKey}_row_${order.id}")
                        .selectable(selected = selected, onClick = { onSelect(order.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    Cell("#${order.id}", weight = ID_WEIGHT, color = text)
                    Cell(order.customer, weight = CUSTOMER_WEIGHT, color = text)
                    if (showDate) Cell(order.date, weight = DATE_WEIGHT, color = text)
                    Cell(order.status, weight = STATUS_WEIGHT, color = text)
                    Cell(order.total, weight = TOTAL_WEIGHT, color = text, align = TextAlign.End)
                }
            }
        }
    }
}

internal data class Order(
    val id: String,
    val customer: String,
    val date: String,
    val status: String,
    val total: String
)

@Composable
private fun OrderRow(
    modifier: Modifier = Modifier,
    cells: @Composable RowScope.() -> Unit
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = PantrixTheme.spacing.md, vertical = PantrixTheme.spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically,
        content = cells
    )
}

@Composable
private fun RowScope.HeaderCell(
    text: String,
    weight: Float,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(
        text = text,
        modifier = Modifier.weight(weight),
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        textAlign = align,
        maxLines = 1
    )
}

@Composable
private fun RowScope.Cell(
    text: String,
    weight: Float,
    color: Color,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(text = text, modifier = Modifier.weight(weight), color = color, textAlign = align, maxLines = 1)
}

private const val ID_WEIGHT = 0.8f

private const val CUSTOMER_WEIGHT = 2f

private const val DATE_WEIGHT = 1.2f

private const val STATUS_WEIGHT = 1.4f

private const val TOTAL_WEIGHT = 1f
```

What the code calls of the demo app itself, which an app writes for itself:

- `HorizontalScrollFrame`: A frame that scrolls sideways: where its content does not fit its room, it draws a scrollbar under it.

### The box's breakpoints

The box is classed by the same breakpoints as the theme's window: where a product has given the window breakpoints of its own, its components follow them too, with nothing to write. Where a component has thresholds of its own, they are given with `breakpoints`.

Both boxes are 240 dp wide. The first is classed by the window's breakpoints and is `Compact`. The second is given breakpoints whose `Medium` begins at 200 dp: at the same width it reads `Medium` and is not narrow. The window's size changes neither of them.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.PantrixBreakpoints
import com.pantrixui.foundation.theme.PantrixTheme

val frame = Modifier.width(240.dp).border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
BoxWithPantrixWindow(modifier = frame) { box ->
    PantrixText(
        text = "By the window's breakpoints: ${box.widthClass.name}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_window_breakpoints"
    )
}
BoxWithPantrixWindow(modifier = frame, breakpoints = PantrixBreakpoints(medium = 200.dp)) { box ->
    PantrixText(
        text = "If Medium begins at 200 dp: ${box.widthClass.name}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_own_breakpoints"
    )
}
```

### Width from the box, height from the window

Inside a page that scrolls there is no end to the height a box may take: its height class reads `Expanded` and `box.isShort` is never true. So a component asks its box about the width and the window about the height.

The first box stands in this page with no height given. The second is given a height of 72 dp: a box whose height is bounded tells its own height, and is short. The last line is the window's answer: it says yes on a phone on its side or in a window shorter than 480 dp. Pick "Short" in the card's window selector: the last line changes, and the answers of the two boxes do not.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val frame = Modifier.fillMaxWidth().border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
BoxWithPantrixWindow(modifier = frame) { box ->
    PantrixText(
        text = "A box with no height given: ${box.heightClass.name}, isShort: " +
            if (box.isShort) "yes" else "no",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_free_height"
    )
}
BoxWithPantrixWindow(modifier = frame.height(72.dp)) { box ->
    PantrixText(
        text = "A 72 dp box: ${box.heightClass.name}, isShort: " + if (box.isShort) "yes" else "no",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_fixed_height"
    )
}
val window = PantrixTheme.window
PantrixText(
    text = "The window: ${window.heightClass.name}, isShort: " + if (window.isShort) "yes" else "no",
    tagKey = "window_height"
)
```

### The box's measures

`PantrixTheme.layout` gives the measures by the window's class. A component that looks at its own box asks `PantrixTheme.layout(box)` and takes the measures of the box's class: the box's room is not the window's.

The box is 240 dp wide, and the gap between the two rectangles inside it is its gutter. The lines under them put the two gutters side by side: from 840 dp on the window's gutter grows and the box's stays the same. In a window narrower than that the two are equal. Try "Narrow" and "Wide" in the card's window selector: only the window's changes.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

BoxWithPantrixWindow(modifier = Modifier.width(240.dp)) { box ->
    val gutter = PantrixTheme.layout(box).gutter
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        Row(horizontalArrangement = Arrangement.spacedBy(gutter)) {
            repeat(2) {
                PantrixSurface(
                    modifier = Modifier.weight(1f).height(48.dp),
                    color = PantrixTheme.colors.neutral.container
                ) {}
            }
        }
        PantrixText(text = "The box's gutter: ${gutter.value.roundToInt()} dp", tagKey = "box_gutter")
        PantrixText(
            text = "The window's gutter: ${PantrixTheme.layout.gutter.value.roundToInt()} dp",
            tagKey = "window_gutter"
        )
    }
}
```

### Handing the box to its content as a window

Inside the box `PantrixTheme.window` and `responsive(...)` still ask the window. Where everything inside is to ask the box instead, as in a pane whose content is a screen of its own, the box is given to the content as its window: `CompositionLocalProvider(LocalPantrixWindow provides box)`.

The box is 240 dp wide. The first line calls `responsive` as it is: its answer is the window's. The second calls it after the box has been given: its answer is the box's, which is narrow. In a narrow window the two lines say the same; to see the difference, pick "Wide" in the card's window selector, turn the phone or make the window at least 600 dp wide.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.LocalPantrixWindow
import com.pantrixui.foundation.adaptive.responsive
import com.pantrixui.foundation.theme.PantrixTheme

BoxWithPantrixWindow(modifier = Modifier.width(240.dp)) { box ->
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixText(
            text = "Asks the window: ${responsive(compact = "narrow", medium = "wide")}",
            tagKey = "asks_window"
        )
        CompositionLocalProvider(LocalPantrixWindow provides box) {
            PantrixText(
                text = "Asks the box: ${responsive(compact = "narrow", medium = "wide")}",
                tagKey = "asks_box"
            )
        }
    }
}
```

### The content's place in the box

`contentAlignment` places content that is smaller than the box inside the box: in the first box the text is in the centre. `propagateMinConstraints` gives the content the box's least size too: the second box is 72 dp tall, and the surface inside it fills the box although it is given no size of its own.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.theme.PantrixTheme

val frame = Modifier
    .fillMaxWidth()
    .height(72.dp)
    .border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
BoxWithPantrixWindow(modifier = frame, contentAlignment = Alignment.Center) { box ->
    PantrixText(text = "Centred content in a box that reads ${box.widthClass.name}", tagKey = "box_centered")
}
BoxWithPantrixWindow(modifier = frame, propagateMinConstraints = true) { box ->
    PantrixSurface(color = PantrixTheme.colors.primary.container) {
        PantrixText(
            text = "Content filling a box that reads ${box.widthClass.name}",
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            tagKey = "box_filled"
        )
    }
}
```

## API

### BoxWithPantrixWindow

`import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun BoxWithPantrixWindow(
    modifier: Modifier = Modifier,
    contentAlignment: Alignment = Alignment.TopStart,
    propagateMinConstraints: Boolean = false,
    breakpoints: PantrixBreakpoints = LocalPantrixWindow.current.breakpoints,
    content: @Composable (box: PantrixWindow) -> Unit
)
```

A box that tells its content the room it is given, as a window is told: for a component that changes with the room it has and not with the window. A table that is a list where it is narrow asks its own box, since inside a narrow pane of a wide window the window is still wide:

```kotlin
BoxWithPantrixWindow(modifier) { box ->
    val withDate = box.widthClass >= WindowWidthClass.Expanded
    if (box.isNarrow) OrderList(orders) else OrderTable(orders, withDate)
}
```

The box is `BoxWithConstraints` underneath, and what it tells is the most room it may take: its `maxWidth` and `maxHeight`. Whatever a screen asks the window, the `content` asks the window it is given: `isNarrow`, `byWidth`, `widthClass >= …`.

- The box is classed by `breakpoints`, which are those of the window in effect unless given: a product that classes its window by bounds of its own has its components classed by the same.

- A reader of a class of the box is composed again when that class changes, and not at every size as the content of `BoxWithConstraints` is. A reader of its `size` follows every change. The box is one object while its room changes.

- Inside a page that scrolls there is no end to the height a box may take: its height class is Expanded and it is never short. Ask the box about the width and the window about the height.

- The box is flat. A fold is the window's, and where it crosses the box is not known here: ask the window.

- `PantrixTheme.window` and `responsive` inside the box still ask the window. Where everything inside is to ask the box instead, a pane whose content is a screen of its own, hand the box on: `CompositionLocalProvider(LocalPantrixWindow provides box) { … }`.

Like `BoxWithConstraints`, the box composes its content while it is measured, so it cannot be asked its intrinsic size: it does not go in a row or a column that is sized by `IntrinsicSize`.

Parameters:

- `modifier: Modifier`: The box's own modifier. The room it tells is the room this leaves it.
- `contentAlignment: Alignment`: Where the content is placed in the box when it is smaller than the box.
- `propagateMinConstraints: Boolean`: Whether the content is to be at least as large as the least size of the box.
- `breakpoints: PantrixBreakpoints`: The bounds the box is classed by.
- `content: @Composable (box: PantrixWindow) -> Unit`: The box's content, given the room as a window.

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
interface PantrixWindow
```

The window the content is drawn in, as a layout needs to know it: how wide and how tall it is, and how its device is folded. `PantrixTheme` provides it, and `PantrixTheme.window` reads it: nothing is set up for it.

It is the window, not the device and not the screen: an app in half of a split screen, in a resized desktop window or in a browser tab is as wide as that. A layout asks the class rather than the size:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

The window is one object for as long as the theme stands, and its values are read when asked. Whoever reads `widthClass` or `heightClass` is composed again when the class changes and not before; whoever reads `size` follows every change, each frame of a rotation and each pixel of a dragged window edge.

A component that is a pane of its own, a scaffold or a sheet, measures the room it is given rather than asking the window: inside a narrow pane the window is still wide. `BoxWithPantrixWindow` tells a component that room as a window.

On the desktop and on the web the window has no size yet when its content is first composed, and that one composition finds a Compact window; Android and iOS tell the size from the start. Read the class where it is used rather than keeping what it was at first.

Members:

- `size: DpSize`: The window's size. On Android it is the window with its system bars; on the web, the box the app is drawn in. Zero, or unspecified, until the platform has told it: the classes are Compact until then.
- `isSizeKnown: Boolean`: Whether the platform has told the window's size: both its width and its height.

  True from the first composition on Android and iOS. False in the first composition on the desktop and on the web, where the content is composed once before the window has a size, and true from the next one on. Until then the window reads as Compact both ways, so whatever is decided once and kept, a start page or a remembered choice, waits for this:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  A reader is composed again when the answer changes, and not as the window is resized.
- `widthClass: WindowWidthClass`: The class of the window's width: what the layout is chosen by.
- `heightClass: WindowHeightClass`: The class of the window's height: `WindowHeightClass.Compact` is a phone on its side.
- `posture: WindowPosture`: How the window's device is folded; `WindowPosture.Flat` where there is no fold.
- `verticalBar: WindowVerticalBar?`: The column the system keeps along one side of the window for bars that stand upright, or null where it keeps none, as on every screen but the iPhone Duo's outer one. Its places are in the window's coordinates: a layout asks where it stands beside it with `rememberVerticalBarInNode`.
- `breakpoints: PantrixBreakpoints`: Where this window's classes begin: the bounds it is classed by. A size classed by hand goes by the same bounds, as `BoxWithPantrixWindow` classes the room a component is given:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, from `com.pantrixui:foundation`

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

A window of fixed values, for where the real one is not the answer: a test or a preview of a layout at a size, and Compose embedded in a part of a native screen, where the room is that part's.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

A `verticalBar` given in pixels draws what a screen with the system's column looks like, the iPhone Duo's outer one, where there is none.

Parameters:

- `size: DpSize`: the window's size, which its width and height classes come from.
- `posture: WindowPosture`: how the window's device is folded: flat, as every device with no fold is, unless a fold is given.
- `breakpoints: PantrixBreakpoints`: the widths and heights each class starts at: Android's window size classes unless the product has its own.
- `verticalBar: WindowVerticalBar?`

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Whether the window is narrow: its width class is `WindowWidthClass.Compact`, as a phone held upright is. The layout of one pane, with its navigation along the bottom.

A name for `widthClass == WindowWidthClass.Compact`, for code that reads as the rule it follows: `if (window.isNarrow) BottomBar()`. For "from this width on", compare the class: `widthClass >= Expanded`.

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, from `com.pantrixui:foundation`

```kotlin
val PantrixWindow.isShort: Boolean
```

Whether the window is short: its height class is `WindowHeightClass.Compact`, as a phone on its side is. Such a window is often wide, Medium or Expanded by its width, and has no height to stack bars in: the main action goes to the header and not to a bar along the bottom, and nothing opens from the bottom edge.

A name for `heightClass == WindowHeightClass.Compact`:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

True as well while the window's size is not known, since the classes are Compact until then: see `PantrixWindow.isSizeKnown`.

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, from `com.pantrixui:foundation`

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

The value of this window's width class. A class left out takes the value of the class below it, so a layout names only the widths it changes at:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parameters:

- `compact: T`: the value in a Compact window, the narrowest class.
- `medium: T`: the value in a Medium window; `compact`'s where it is left out.
- `expanded: T`: the value in an Expanded window; `medium`'s where it is left out.
- `large: T`: the value in a Large window; `expanded`'s where it is left out.
- `extraLarge: T`: the value in an ExtraLarge window, the widest class; `large`'s where it is left out.

### LocalPantrixWindow

`import com.pantrixui.foundation.adaptive.LocalPantrixWindow`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixWindow: ProvidableCompositionLocal<PantrixWindow>
```

The window in effect: the one the nearest `PantrixTheme` provides. With no theme around, the one Compose reports, classed by the default breakpoints and flat.

`PantrixTheme.window` reads it. Provide it to give a part of the screen a window of its own without a second theme: a pane whose content is to answer to the pane's width.

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowWidthClass
```

How wide a window is, as one of five classes a layout chooses by: the shape of its navigation, the number of its panes, the columns of a grid.

The classes are in order, so a rule that holds from a width on is a comparison: `widthClass >= WindowWidthClass.Expanded`. `PantrixBreakpoints` says where each begins.

Entries:

- `Compact`: Narrower than 600dp: a phone held upright, a foldable's cover screen, a narrow browser window.
- `Medium`: From 600dp: an open foldable, a tablet held upright, a split view.
- `Expanded`: From 840dp: a tablet on its side, and most phones on theirs (see `WindowHeightClass.Compact`).
- `Large`: From 1200dp: a desktop window, a browser, a large tablet.
- `ExtraLarge`: From 1600dp: a wide desktop window, an external display.

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, from `com.pantrixui:foundation`

```kotlin
enum class WindowHeightClass
```

How tall a window is, as one of three classes.

A layout follows the width first. The height says when there is no room to stack things: a `Compact` window is a phone on its side, as wide as a tablet and less than half as tall, where each bar laid across the screen takes a seventh of it.

Entries:

- `Compact`: Shorter than 480dp: a phone on its side.
- `Medium`: From 480dp: most phones held upright, a tablet on its side.
- `Expanded`: From 900dp: a tablet held upright, a desktop window, and a tall phone held upright.

### PantrixBreakpoints

`import com.pantrixui.foundation.adaptive.PantrixBreakpoints`, from `com.pantrixui:foundation`

```kotlin
data class PantrixBreakpoints(
    public val medium: Dp = 600.dp,
    public val expanded: Dp = 840.dp,
    public val large: Dp = 1200.dp,
    public val extraLarge: Dp = 1600.dp,
    public val heightMedium: Dp = 480.dp,
    public val heightExpanded: Dp = 900.dp
)
```

Where each window class begins: the least width of a Medium, Expanded, Large and ExtraLarge window, and the least height of a Medium and an Expanded one. A window narrower than `medium` is Compact, as is one shorter than `heightMedium`.

The defaults are Android's window size classes. A product whose layouts change elsewhere gives its own to `rememberPantrixWindow`.

Parameters:

- `medium: Dp`: The least width of a `WindowWidthClass.Medium` window.
- `expanded: Dp`: The least width of a `WindowWidthClass.Expanded` window.
- `large: Dp`: The least width of a `WindowWidthClass.Large` window.
- `extraLarge: Dp`: The least width of a `WindowWidthClass.ExtraLarge` window.
- `heightMedium: Dp`: The least height of a `WindowHeightClass.Medium` window.
- `heightExpanded: Dp`: The least height of a `WindowHeightClass.Expanded` window.

Members:

- `fun widthClassOf(width: Dp): WindowWidthClass`: The class of a window `width` wide: the highest one whose least width it has reached. A width not known yet, zero or unspecified, is Compact.
- `fun heightClassOf(height: Dp): WindowHeightClass`: The class of a window `height` tall: the highest one whose least height it has reached. A height not known yet, zero or unspecified, is Compact.

On the type:

- `PantrixBreakpoints.Default: PantrixBreakpoints`: 600, 840, 1200 and 1600dp wide; 480 and 900dp tall.

### PantrixLayout

`import com.pantrixui.foundation.adaptive.PantrixLayout`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLayout(
    val margin: Dp,
    val gutter: Dp,
    val columns: Int = 4,
    val maxContentWidth: Dp = Dp.Infinity
)
```

The measures a page is laid out by in a window of one width class. `PantrixTheme.layout` gives those of the window in effect:

```kotlin
Column(Modifier.padding(horizontal = PantrixTheme.layout.margin).maxContentWidth()) { … }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout.gutter)) { … }
```

The margin and the gutter are air: the interface density scales them as it scales the spacing. The columns are a count and the content's widest is a measure of the content, and the density scales neither.

Parameters:

- `margin: Dp`: The room between the edge of the window, or of a pane, and the content: what a page pads its content by at its sides.
- `gutter: Dp`: The room between columns of a grid, and between panes that stand side by side.
- `columns: Int`: How many columns a page's grid has across its room: a part of the page spans some of them, and `spanWidth` says how wide that is. A phone has 4, a tablet 8 and a wider window 12.
- `maxContentWidth: Dp`: How wide a page's content grows at the most: past it, the room of a wide window is left beside the content, since a line of text across a desktop window is not read. `Dp.Infinity` where the content takes all the room it has. `Modifier.maxContentWidth()` keeps content to it.

Members:

- `fun scaled(factor: Float): PantrixLayout`: These measures at an interface density: the margin and the gutter multiplied by `factor`, the columns and the content's widest as they are.
- `fun spanWidth(available: Dp, span: Int): Dp`: How wide a part that spans `span` of the `columns` is in `available` room: its columns, and the gutters between them. The columns are as wide as each other, and a gutter stands between each two:

  ```kotlin
  BoxWithConstraints {
      val layout = PantrixTheme.layout
      Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
          Article(Modifier.width(layout.spanWidth(maxWidth, span = 8)))
          Related(Modifier.width(layout.spanWidth(maxWidth, span = 4)))
      }
  }
  ```

  Room too narrow for its gutters leaves the columns no width: a part is then as wide as the gutters it spans.

  `available`: the room the columns share, as wide as the page's content: within its margins.

  `span`: how many of the columns the part spans, from 1 to `columns`.
