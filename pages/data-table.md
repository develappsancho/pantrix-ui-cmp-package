# Data Table

A table that shows records row by row and their values column by column: orders, users, invoices. Its header orders the rows, its boxes choose them, its rows open, its columns stay in place or scroll sideways; on a narrow screen it becomes a list of records.

The rows are the caller's. The table shows the rows given with `rows` in the order they are given, and changes nothing by itself: a press on a header reports the order that is asked for with `onSortChange`, a press on a box the rows to be chosen with `onSelectionChange`, a press on a chevron the rows to be open with `onExpandedChange`. One table thus shows both the rows a screen holds and orders itself, and the rows a server orders and sends a page at a time.

- `PantrixDataTable` (`com.pantrixui.components.data.datatable`, `com.pantrixui:components`): Rows of records in columns: sorting, selection, rows that open, pinned and resizable columns, sideways scrolling, loading and empty states, and a list of records on a narrow screen. Keywords: data grid, grid, records, rows and columns, tabular data, sortable columns.

## Features

- **Columns.** A column is described with a `DataTableColumn`: its key (`key`), its header (`header`) and what a row shows in that column (`cell`). A column of plain text is written shortly with `DataTableColumn.text`: a long text is cut with an ellipsis. A cell can be any content: a badge, a button, an avatar.
- **Width.** A column given a `width` is that wide. Those given none share what is left by their `weight`, and are no narrower than `minWidth` or, where that is not given either, the style's `columnMinWidth`. `alignment` sets the header and the values at one side of the column: numbers stand at its end, so that their digits line up.
- **Scrolling sideways.** Where the columns do not fit the table even at their least widths, the table scrolls sideways: by a drag of a finger, by the wheel, by the bar under the rows where there is a pointer, and by the keyboard: the cell that takes the focus is brought into view.
- **Pinned columns.** `pin = DataTablePin.Start` keeps a column at the table's start, `DataTablePin.End` at its end: the others scroll under them. Where more than half of a table that scrolls would stay in place, the pinned columns scroll with the others, and only the boxes stay.
- **Sorting.** The header of a column with `sortable = true`, or one given a `comparator`, is a button. The first press orders smallest first, the second largest first, and the third takes the order away. An arrow that points up means the smallest comes first. `multiSort = true` adds the pressed column to the order: the rows are put in the first column's order, and the next settles the ones it holds equal; a header shows its column's place in the order. Ordering the rows is the caller's work: `sort.comparator(columns)` makes one comparator out of the columns' own. A column of text takes a `textOrder` to be ordered by the language's alphabet: `rememberTextOrder()` gives the one of the theme's language.
- **Selection.** A table given `onSelectionChange` has a box in every row; the keys of the chosen rows are given with `selected`. The box in the header chooses every row that is shown or lets them all go, and leaves what was chosen on other pages alone; it shows a dash while some are chosen. `DataTableSelection.Single` puts radio buttons in the boxes' place: choosing a row lets the other go.
- **Rows that open.** A table given `rowDetail` and `onExpandedChange` has a chevron in every row: a press opens the row's detail under it, as wide as the table. The keys of the open rows are given with `expanded`. The chevron stands at the row's end and stays there while the columns scroll; `DataTableStyle(expander = DataTableExpander.Start)` puts it at the start.
- **Rows that are pressed.** `onRowClick` makes every row a button as wide as the table.
- **Closed rows.** `rowEnabled` closes a row: it is drawn fainter, cannot be chosen or pressed, and the box in the header neither chooses it nor lets it go. Its chevron opens it all the same; closing the buttons in its cells is the caller's work.
- **Tones.** `rowTone` lays a row on the soft fill of one of the theme's roles and turns its text to the colour paired with that fill; a column's `tone` paints its header. What the colour says should be written in the row in words too.
- **Height.** A table told no height is as tall as its rows and builds them all: that is for a page of rows, in a page that scrolls, and its header scrolls with the page. A table told a height keeps its header in place, scrolls its rows under it and builds only the ones in view: it holds thousands of rows. A table whose header is to stay in place is told a height.
- **State.** Where the rows and the columns are scrolled to and the widths the columns were dragged to are kept in a `DataTableState`. A screen that holds it itself, with `rememberDataTableState()`, reads the widths, keeps them, resets them (`columnWidths`) and scrolls to a column (`animateScrollToColumn`).
- **Narrow.** A table of `DataTableLayout.Auto` is a list of records where its own width is narrower than the style's `compactWidth` (600dp): each row a block, each value with its column's name before it. The boxes, the chevrons and the order stay. `showInList = false` keeps a column out of the list; `listContent` draws a record its own way.
- **Loading and empty.** `loading = true` puts skeleton rows in the rows' place, in the table's columns. A table without rows shows the theme's words, "No rows", or what is given with `empty`.
- **Toolbar and footer.** `toolbar` stands over the header and `footer` under the rows, inside the table's edge: a title and what is done with the chosen rows; a `PantrixPagination`.
- **Variants.** `DataTableVariant.Plain` draws a line between the rows, `Bordered` an edge around the table as well, and `Grid` a line between the columns too. `striped = true` lays every other row on a faint fill.
- **Columns whose width changes.** The end of the header of a column with `resizable = true` is dragged with a pointer. The keyboard comes there with Tab after the column's name, and the arrow keys along the row make the column wider or narrower; a screen reader is told the width as a value that can be changed. On screens used with a finger there is no handle to drag.
- **Choosing the columns.** Which columns are shown, and in which order, is the `columns` list itself: a screen that hides a column or moves one gives the table another list.
- **The headers' type.** `headerTextStyle` is the type the headers are written in. The headers are written as they are given: a table that wants small capitals set apart gives the type and writes its headers in capitals.
- **Colours.** `DataTableColors` paints the table's fill, its text, the header's band and its text, the stripe, the fill of a chosen row and the lines one by one; what is not given is the theme's.
- **Keyboard.** Tab goes through the headers that sort, the boxes, the chevrons, the rows that are pressed and whatever the cells hold; the arrow keys move the focus to the nearest of them that way. A cell that holds nothing to press is no stop: this is a table to read and to act on, and not a grid to walk cell by cell. Where there is a pointer, the rows' window is a stop too while the table scrolls: there the arrow keys, Page Up, Page Down, Home and End scroll the table.
- **Screen reader.** A header says that it is a header and how the rows are ordered by its column. Where `rowLabel` is given a row's box is read by the row's name: "Select Ada Lovelace". A cell says which row and column it is in.
- **Automation.** A table given a `tagKey` is `DataTable_<tagKey>`, and its parts are named inside it: `Header_<column>`, `Row_<row>`, `Cell_<row>/<column>`, `Select_<row>`, `Toggle_<row>`, `Detail_<row>`. Presses are reported as a `DataTable` event: `sort`, `select`, `selectAll`, `expand`, `collapse`, `open`.

## Usage

### Sorted by a press on a header

```kotlin
var sort by remember { mutableStateOf(listOf(DataTableSort("total", descending = true))) }
val columns = remember {
    listOf(
        DataTableColumn.text<Order>(key = "customer", header = customer, sortable = true) { it.customer },
        DataTableColumn.text(key = "total", header = total, alignment = Alignment.End, sortable = true) { it.total }
    )
}
PantrixDataTable(
    rows = remember(orders, sort) { orders.sortedWith(sort.comparator(columns)) },
    columns = columns,
    sort = sort,
    onSortChange = { sort = it },
    tagKey = "orders"
)
```

### Rows that are chosen, with what is done with them over the header

```kotlin
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixDataTable(
    rows = orders,
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.customer },
    selected = chosen,
    onSelectionChange = { chosen = it },
    toolbar = { PantrixText(PantrixTheme.strings.selectedCount(chosen.size)) },
    variant = DataTableVariant.Bordered,
    tagKey = "orders"
)
```

### A page of rows from a server, with its pages under it

```kotlin
PantrixDataTable(
    rows = page.orders,
    columns = columns,
    rowKey = { it.id },
    sort = sort,
    onSortChange = { viewModel.orderBy(it) },
    loading = page.loading,
    footer = { PantrixPagination(page = page.number, pageCount = page.count, onPageChange = viewModel::open) },
    modifier = Modifier.height(480.dp),
    tagKey = "orders"
)
```

## Examples

### Rows and columns

At its plainest: the rows (`rows`) and the columns (`columns`). All four columns are plain text and are written with `DataTableColumn.text`; the items and the total stand at the end of their columns, so that their digits line up.

The columns are given no width: they share the table's width evenly. On a narrow screen, a phone held upright, the table becomes a list of records by itself: each order is a block, and each value has its column's name before it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.PantrixDataTable

PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember {
        listOf(
            DataTableColumn.text(key = "customer", header = "Customer") { it.customer },
            DataTableColumn.text(key = "city", header = "City") { it.city },
            DataTableColumn.text(key = "items", header = "Items", alignment = Alignment.End) { "${it.items}" },
            DataTableColumn.text(key = "total", header = "Total", alignment = Alignment.End) { "${it.total} ₺" }
        )
    },
    tagKey = "plain"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Sorting by a press on a header

The header of a column with `sortable = true` is a button. Press a header: the rows are put in that column's order, smallest first, and an arrow that points up appears beside the header. Press again: largest first. A third press takes the order away, and the rows are as they were given.

The order is the screen's state (`sort`); the table only reports the order that is asked for (`onSortChange`). Ordering the rows is the screen's work too: `sort.comparator(columns)` makes one comparator out of the columns' own. The columns of text are ordered by their text, without regard to case and in the order of the language's alphabet (`textOrder`, `rememberTextOrder()`): press Customer, and "İpek Güneş" stands between "Emre Koç" and "Kerem Aksoy"; without it the name, starting with "İ", would fall to the very end, after "Zeynep Demir". The items and the total are numbers and give comparators of their own: as texts, "10" would come before "9".

While "Several columns" is on, a column that is pressed is added to the order: press City, then Total. The orders are put in the order of their cities, and those of one city in the order of their totals; a header shows its column's place in the order.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.l10n.rememberTextOrder

val report = LocalExampleEvents.current
var sort by remember { mutableStateOf(listOf(DataTableSort("total", descending = true))) }
var several by rememberSaveable { mutableStateOf(false) }
val order = rememberTextOrder()
val columns = remember(order) { orderColumns(textOrder = order) }
PantrixSwitchButton(
    checked = several,
    onCheckedChange = { several = it },
    label = "Several columns",
    tagKey = "several"
)
PantrixDataTable(
    rows = remember(sort) { TABLE_ORDERS.sortedWith(sort.comparator(columns)) },
    columns = columns,
    sort = sort,
    onSortChange = { asked ->
        sort = asked
        report(asked.joinToString { "${it.columnKey} ${if (it.descending) "↓" else "↑"}" }.ifEmpty { "no order" })
    },
    multiSort = several,
    tagKey = "sorted"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Choosing rows, and a toolbar

A table given `onSelectionChange` has a box in every row. The keys of the chosen rows are the screen's state (`selected`); `rowKey` tells the rows apart. The box in the header chooses every row or lets them all go; it shows a dash while some are chosen.

The toolbar over the table (`toolbar`) writes how many rows are chosen in the theme's words (`PantrixTheme.strings.selectedCount`) and has a button that lets them go. `rowLabel` has a screen reader read the boxes by their rows' names: "Select Deniz Arslan".

While "One row" is on, radio buttons take the boxes' place (`DataTableSelection.Single`): choosing a row lets the other go, and no box is left in the header.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableSelection
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var chosen by remember { mutableStateOf(setOf("1042")) }
var single by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = single,
    onCheckedChange = {
        single = it
        chosen = chosen.take(1).toSet()
    },
    label = "One row",
    tagKey = "single"
)
PantrixDataTable(
    rows = TABLE_ORDERS.take(6),
    columns = remember { orderColumns() },
    rowKey = { it.id },
    rowLabel = { it.customer },
    selected = chosen,
    onSelectionChange = { asked ->
        chosen = asked
        report("Rows selected: ${asked.size}")
    },
    selection = if (single) DataTableSelection.Single else DataTableSelection.Multiple,
    toolbar = {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(text = PantrixTheme.strings.selectedCount(chosen.size), tagKey = "chosen")
            PantrixButton(
                text = "Clear selection",
                onClick = { chosen = emptySet() },
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                enabled = chosen.isNotEmpty(),
                tagKey = "clear"
            )
        }
    },
    variant = DataTableVariant.Bordered,
    tagKey = "selected"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Rows that open and rows that are pressed

A table given `rowDetail` and `onExpandedChange` has a chevron at the start of every row. Press a chevron: the row's detail opens under it, as wide as the table, and the chevron turns; another press closes it. The keys of the open rows are the screen's state (`expanded`): the screen can open a row itself.

`onRowClick` makes the row itself a button too: a press on a row writes which order was opened on the card's "Last event" line. The chevron and the row are pressed apart.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var open by remember { mutableStateOf(setOf("1043")) }
PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember { orderColumns() },
    rowKey = { it.id },
    rowLabel = { it.customer },
    expanded = open,
    onExpandedChange = { open = it },
    rowDetail = { order ->
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixText(text = "Order #${order.id}", style = PantrixTheme.typography.body)
            PantrixText(
                text = "${order.items} items, to be sent to ${order.city}. Status: ${order.status}.",
                color = PantrixTheme.colors.textSecondary
            )
        }
    },
    onRowClick = { report("#${it.id} was opened") },
    tagKey = "expandable"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Pinned columns and scrolling sideways

Each of the seven columns is given a width, and together they are wider than the table: the table scrolls sideways. Drag it with a finger, turn the wheel sideways or, where there is a pointer, drag the bar under the rows.

The customer's column is pinned at the start and the button's at the end (`pin`): the others scroll under them, and a line appears at their edges while something is under them. On a phone held upright the pinned columns would take more than half the table: there they scroll with the others.

The ends of the City and Status headers are dragged with a pointer (`resizable`): the column grows wider or narrower, and the table keeps that width. With the keyboard: come to the header's end with Tab, and make the column wider or narrower with the right and left arrow keys. Go to the buttons with Tab: a button that takes the focus under a pinned column is scrolled into view.

The screen holds the table's state (`rememberDataTableState()`). "Scroll to Total" scrolls the columns until that column is in view (`animateScrollToColumn`); "Reset the widths" lets the dragged widths go (`columnWidths`).

The example is a table at every width (`DataTableLayout.Table`): it does not become a list on a narrow screen.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableLayout
import com.pantrixui.components.data.datatable.DataTablePin
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.rememberDataTableState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val table = rememberDataTableState()
val scope = rememberCoroutineScope()
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Scroll to Total",
        onClick = { scope.launch { table.animateScrollToColumn("total") } },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "to_total"
    )
    PantrixButton(
        text = "Reset the widths",
        onClick = { table.columnWidths = emptyMap() },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        enabled = table.columnWidths.isNotEmpty(),
        tagKey = "reset_widths"
    )
}
PantrixDataTable(
    rows = TABLE_ORDERS.take(6),
    columns = remember(report) {
        listOf(
            DataTableColumn.text(key = "customer", header = "Customer", width = 160.dp, pin = DataTablePin.Start) {
                it.customer
            },
            DataTableColumn.text(key = "id", header = "Order", width = 110.dp) { "#${it.id}" },
            DataTableColumn.text(key = "city", header = "City", width = 140.dp, resizable = true) { it.city },
            DataTableColumn.text(key = "status", header = "Status", width = 160.dp, resizable = true) { it.status },
            DataTableColumn.text(key = "date", header = "Date", width = 130.dp) { it.date },
            DataTableColumn.text(key = "items", header = "Items", width = 100.dp, alignment = Alignment.End) {
                "${it.items}"
            },
            DataTableColumn.text(key = "total", header = "Total", width = 130.dp, alignment = Alignment.End) {
                "${it.total} ₺"
            },
            DataTableColumn(key = "open", header = "", width = 112.dp, pin = DataTablePin.End, showInList = false) {
                PantrixButton(
                    text = "Open",
                    onClick = { report("#${it.id} was opened") },
                    variant = ButtonVariant.Text,
                    size = ButtonSize.Small,
                    tagKey = "open_${it.id}"
                )
            }
        )
    },
    rowKey = { it.id },
    variant = DataTableVariant.Bordered,
    layout = DataTableLayout.Table,
    state = table,
    tagKey = "pinned"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Page by page, with a skeleton while it loads

A list that comes from a server a page at a time: the table knows only the rows of the page on screen. In its footer (`footer`) stand which orders are shown, in the theme's words (`PantrixTheme.strings.rowRange`), and a `PantrixPagination`.

Go to another page: until the rows come the table is loading (`loading`), and skeleton rows stand in the rows' place, in the table's columns; the header and the footer stay. The waiting is imitated here with a delay of half a second; "Keep it loading" holds the skeleton in place to look at.

The table is told a height (320dp): the header stays in place, the rows scroll under it, and only the ones in view are built. The last page has two orders; the table stays as tall, and its footer does not move.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.time.Duration.Companion.milliseconds

var page by rememberSaveable { mutableIntStateOf(1) }
var loading by remember { mutableStateOf(false) }
var shown by rememberSaveable { mutableIntStateOf(1) }
var held by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = held,
    onCheckedChange = { held = it },
    label = "Keep it loading",
    tagKey = "hold_loading"
)
// In place of a server: the page that was asked for comes half a second later.
LaunchedEffect(page) {
    if (page != shown) {
        loading = true
        delay(LOAD_MILLIS.milliseconds)
        shown = page
        loading = false
    }
}
val first = (shown - 1) * PAGE_SIZE
val rows = TABLE_ORDERS.drop(first).take(PAGE_SIZE)
PantrixDataTable(
    rows = rows,
    columns = remember { orderColumns(sortable = false) },
    modifier = Modifier.height(320.dp),
    rowKey = { it.id },
    loading = loading || held,
    loadingRows = PAGE_SIZE,
    footer = {
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            itemVerticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(
                text = PantrixTheme.strings.rowRange(first + 1, first + rows.size, TABLE_ORDERS.size),
                color = PantrixTheme.colors.textSecondary,
                tagKey = "range"
            )
            PantrixPagination(
                page = page,
                pageCount = (TABLE_ORDERS.size + PAGE_SIZE - 1) / PAGE_SIZE,
                onPageChange = { page = it },
                tagKey = "pages"
            )
        }
    },
    variant = DataTableVariant.Bordered,
    tagKey = "paged"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private const val PAGE_SIZE = 5

private const val LOAD_MILLIS = 500L

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### A table without rows

A table without rows. The first is given nothing: it writes the theme's words, "No rows". The second gives its own content (`empty`): a text that says what has happened and a button that says what to do. In both the header stays and the table is a few rows tall: a table that a filter has emptied does not fold to its header.

The box in the header cannot be pressed, since there is no row to choose.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val columns = remember { orderColumns(sortable = false) }
PantrixDataTable(rows = emptyList(), columns = columns, variant = DataTableVariant.Bordered, tagKey = "empty")
PantrixDataTable(
    rows = emptyList(),
    columns = columns,
    rowKey = { it.id },
    onSelectionChange = {},
    empty = {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = "No order matches this filter", color = PantrixTheme.colors.textSecondary)
            PantrixButton(
                text = "Clear the filter",
                onClick = { report("The filter was cleared") },
                variant = ButtonVariant.Outline,
                size = ButtonSize.Small,
                tagKey = "reset"
            )
        }
    },
    variant = DataTableVariant.Bordered,
    tagKey = "empty_own"
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Variants, stripes and colours

Three variants of one table. `Plain` draws a line between the rows and nothing around them: for a table inside a card. `Bordered` draws an edge around the table, in the style's shape. `Grid` draws a line between the columns as well: for a dense report the eye reads down as much as along.

"Striped" lays every other row on a faint fill (`striped`): in a wide table the eye does not lose its row. "Header band" puts the theme's neutral fill behind the header (`DataTableColors.headerContainer`); the header's text turns to the colour the theme pairs with that fill.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var variant by rememberSaveable { mutableStateOf(DataTableVariant.Grid) }
var striped by rememberSaveable { mutableStateOf(true) }
var band by rememberSaveable { mutableStateOf(true) }
PantrixSegmentButton(
    options = remember { DataTableVariant.entries.map { SegmentOption(value = it, label = it.name) } },
    selected = variant,
    onSelect = { variant = it },
    tagKey = "variant"
)
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSwitchButton(
        checked = striped,
        onCheckedChange = { striped = it },
        label = "Striped",
        tagKey = "striped"
    )
    PantrixSwitchButton(checked = band, onCheckedChange = { band = it }, label = "Header band", tagKey = "band")
}
PantrixDataTable(
    rows = TABLE_ORDERS.take(6),
    columns = remember { orderColumns(sortable = false) },
    variant = variant,
    striped = striped,
    colors = DataTableColors(headerContainer = PantrixTheme.colors.neutral.container).takeIf { band },
    tagKey = "variants"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### A list of records where it is narrow

The same rows, laid out three ways. `Auto` looks at the table's own width: a list where it is narrower than 600dp, a table otherwise. `Table` is a table at every width: the columns keep their least widths and the table scrolls sideways. `List` is a list at every width.

In the list each order is a block, and each value has its column's name before it. The boxes and the order stay: in the strip over the list stand the box that chooses them all and the names of the columns that sort.

It is the width left to the table that decides the layout, and not the window: a table in a narrow panel of a wide screen is a list too.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableLayout
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var layout by rememberSaveable { mutableStateOf(DataTableLayout.List) }
var sort by remember { mutableStateOf(emptyList<DataTableSort>()) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
val columns = remember { orderColumns() }
PantrixSegmentButton(
    options = remember { DataTableLayout.entries.map { SegmentOption(value = it, label = it.name) } },
    selected = layout,
    onSelect = { layout = it },
    tagKey = "layout"
)
PantrixDataTable(
    rows = remember(sort) { TABLE_ORDERS.take(4).sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.customer },
    sort = sort,
    onSortChange = { sort = it },
    selected = chosen,
    onSelectionChange = { chosen = it },
    variant = DataTableVariant.Bordered,
    layout = layout,
    tagKey = "as_list"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Tones and closed rows

`rowTone` lays a row on the soft fill of one of the theme's roles: cancelled orders are in the danger tone and the ones being prepared in the warning tone, and the row's text turns to the colour the theme pairs with that fill. The tone is over the stripe; the fill of a chosen row comes over the tone too. What the colour says, the Status column says in words: a colour says nothing to someone who cannot see it.

A column's `tone` paints its header: the Total header is in the info tone.

Delivered orders are closed (`rowEnabled`): they are drawn fainter, their boxes cannot be pressed, and the box in the header neither chooses them nor lets them go. Press the box in the header: only the open rows are chosen.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator

val report = LocalExampleEvents.current
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixDataTable(
    rows = TABLE_ORDERS.take(7),
    columns = remember { orderColumns(sortable = false, totalTone = DataTableTone.Info) },
    rowKey = { it.id },
    rowLabel = { it.customer },
    rowEnabled = {
        when (it.status) {
            "Delivered" -> false
            else -> true
        }
    },
    rowTone = {
        when (it.status) {
            "Cancelled" -> DataTableTone.Danger
            "Preparing" -> DataTableTone.Warning
            else -> null
        }
    },
    selected = chosen,
    onSelectionChange = { asked ->
        chosen = asked
        report("Rows selected: ${asked.size}")
    },
    variant = DataTableVariant.Bordered,
    striped = true,
    tagKey = "tones"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Letting the reader choose the columns

Which columns are shown, and in which order, is the `columns` list itself: hiding a column is taking it out of the list, and moving one is putting the list in another order. The table keeps nothing of its own for it.

The multi-select over the table chooses the columns to show; the table takes the chosen ones out of all its columns. The choice is the screen's state: where it is kept, the reader finds the table as they left it.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

val all = remember { orderColumns() }
var shown by remember { mutableStateOf(setOf("customer", "city", "total")) }
PantrixMultiSelect(
    options = remember(all) { all.map { SelectOption(value = it.key, label = it.header) } },
    selected = shown,
    onSelectionChange = { shown = it },
    label = "Columns",
    tagKey = "columns"
)
PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember(all, shown) { all.filter { it.key in shown } },
    variant = DataTableVariant.Bordered,
    tagKey = "chosen"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Customer",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "City", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Status", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Items",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Total",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Dense rows in its own style

A dense table in its own style: `DataTableStyle` gives the least height of the rows and the header, the cells' padding and the box's corners. `expander = DataTableExpander.End` puts an expanding row's arrow at the row's end, where a list's arrow stands.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableExpander
import com.pantrixui.components.data.datatable.DataTableStyle
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.foundation.token.shape.ShapeRole

PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember {
        listOf(
            DataTableColumn.text(key = "customer", header = "Customer") { it.customer },
            DataTableColumn.text(key = "city", header = "City") { it.city },
            DataTableColumn.text(key = "total", header = "Total", alignment = Alignment.End) { "${it.total} ₺" }
        )
    },
    style = DataTableStyle(
        shape = ShapeRole.Small,
        headerMinHeight = 36.dp,
        rowMinHeight = 32.dp,
        cellPadding = 8.dp,
        cellVerticalPadding = 4.dp,
        expander = DataTableExpander.End
    ),
    tagKey = "dense"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Preparing", "3 October", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "On its way", "3 October", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Delivered", "2 October", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "Cancelled", "2 October", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "On its way", "1 October", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Delivered", "1 October", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Preparing", "30 September", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "On its way", "30 September", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Delivered", "29 September", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Preparing", "29 September", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Delivered", "28 September", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "On its way", "28 September", items = 11, total = 7050)
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Projects: rich cells and closed rows

A product's projects: every cell is more than plain text. The project column has a tile with a letter, a name and a package name in monospace; the platforms are coloured dots; sampling and retention are a label each; under the date stands its age. A cell takes any content: a `DataTableColumn`'s `cell` is a composable.

The headers are small capitals set apart: the type is given with `headerTextStyle`, and the headers themselves are written in capitals (the table does not turn a header to capitals by itself: "ı" and "i" do not grow alike in every language). The band behind the header is `DataTableColors.headerContainer`.

The two inactive projects are closed (`rowEnabled`): everything the row shows is drawn fainter. A project without an API key has a warning mark beside its count; what the colour says, its name says too.

On a narrow screen the table becomes a list of records, and each project is drawn with the card given with `listContent`: the name and the status on top, the platforms and the keys under them, the labels and the date at the foot.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val columns = remember { projectColumns() }
PantrixDataTable(
    rows = SHOWCASE_PROJECTS,
    columns = columns,
    rowKey = { it.bundle },
    rowLabel = { it.name },
    rowEnabled = { it.active },
    listContent = { ProjectCard(it) },
    variant = DataTableVariant.Bordered,
    headerTextStyle = smallCapitals(),
    colors = DataTableColors(headerContainer = PantrixTheme.colors.surface, container = PantrixTheme.colors.surface),
    tagKey = "projects"
)

@Composable
private fun smallCapitals(): TextStyle =
    PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Medium, letterSpacing = 0.8.sp)

private fun projectColumns(): List<DataTableColumn<ShowcaseProject>> = listOf(
    DataTableColumn(key = "project", header = "PROJECT", weight = 2.2f, minWidth = 230.dp) { ProjectName(it) },
    DataTableColumn(key = "platform", header = "PLATFORM", weight = 1.2f, minWidth = 160.dp) {
        Platforms(it.platforms)
    },
    DataTableColumn(key = "keys", header = "API KEYS", width = 124.dp, alignment = Alignment.End) {
        ApiKeys(it.apiKeys)
    },
    DataTableColumn(key = "sampling", header = "SAMPLING & RETENTION", width = 208.dp) { SamplingAndRetention(it) },
    DataTableColumn(key = "status", header = "STATUS", width = 116.dp) { ActivePill(it.active) },
    DataTableColumn(key = "created", header = "CREATED", width = 132.dp, alignment = Alignment.End) { Created(it) }
)

@Composable
private fun ProjectCard(project: ShowcaseProject) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.weight(1f)) { ProjectName(project) }
            ActivePill(project.active)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.weight(1f)) { Platforms(project.platforms) }
            PantrixText(
                text = "API keys",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            ApiKeys(project.apiKeys)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            SamplingAndRetention(project)
            PantrixText(
                text = "${project.created} · ${project.age}",
                modifier = Modifier.weight(1f),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                textAlign = TextAlign.End,
                maxLines = 1
            )
        }
    }
}

private val SHOWCASE_PROJECTS = listOf(
    ShowcaseProject(
        name = "Pantrix Shop",
        bundle = "io.pantrix.shop",
        platforms = listOf(ShowcasePlatform.Android, ShowcasePlatform.Ios),
        apiKeys = 4,
        sampling = 100,
        retentionDays = 90,
        active = true,
        created = "12 Mar 2024",
        age = "18 months",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Seller",
        bundle = "io.pantrix.seller",
        platforms = listOf(ShowcasePlatform.Android, ShowcasePlatform.Ios),
        apiKeys = 3,
        sampling = 100,
        retentionDays = 90,
        active = true,
        created = "4 Jun 2024",
        age = "15 months",
        tint = ShowcaseTint.Green
    ),
    ShowcaseProject(
        name = "Pantrix Courier",
        bundle = "io.pantrix.courier",
        platforms = listOf(ShowcasePlatform.Android),
        apiKeys = 2,
        sampling = 10,
        retentionDays = 30,
        active = true,
        created = "22 Sep 2024",
        age = "11 months",
        tint = ShowcaseTint.Orange
    ),
    ShowcaseProject(
        name = "Pantrix Web",
        bundle = "io.pantrix.web",
        platforms = listOf(ShowcasePlatform.Web),
        apiKeys = 2,
        sampling = 100,
        retentionDays = 30,
        active = true,
        created = "8 Jan 2025",
        age = "8 months",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Pay",
        bundle = "io.pantrix.pay",
        platforms = listOf(ShowcasePlatform.Android, ShowcasePlatform.Ios, ShowcasePlatform.Web),
        apiKeys = 2,
        sampling = 10,
        retentionDays = 90,
        active = true,
        created = "14 Feb 2025",
        age = "6 months",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Ops Console",
        bundle = "io.pantrix.ops",
        platforms = listOf(ShowcasePlatform.Web),
        apiKeys = 1,
        sampling = 10,
        retentionDays = 30,
        active = true,
        created = "3 Apr 2025",
        age = "5 months",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Labs Sandbox",
        bundle = "io.pantrix.labs.sandbox",
        platforms = listOf(ShowcasePlatform.Android),
        apiKeys = 0,
        sampling = 10,
        retentionDays = 30,
        active = false,
        created = "27 May 2025",
        age = "3 months",
        tint = ShowcaseTint.Neutral
    ),
    ShowcaseProject(
        name = "Pantrix Kiosk",
        bundle = "io.pantrix.kiosk",
        platforms = listOf(ShowcasePlatform.Android),
        apiKeys = 0,
        sampling = 100,
        retentionDays = 30,
        active = false,
        created = "19 Aug 2025",
        age = "3 weeks",
        tint = ShowcaseTint.Neutral
    )
)

private enum class ShowcasePlatform(val label: String) {
    Android("Android"),
    Ios("iOS"),
    Web("Web")
}

private enum class ShowcaseTint {
    Blue,
    Green,
    Orange,
    Neutral
}

private data class ShowcaseProject(
    val name: String,
    val bundle: String,
    val platforms: List<ShowcasePlatform>,
    val apiKeys: Int,
    val sampling: Int,
    val retentionDays: Int,
    val active: Boolean,
    val created: String,
    val age: String,
    val tint: ShowcaseTint
)

@Composable
private fun ProjectName(project: ShowcaseProject) {
    val role = when (project.tint) {
        ShowcaseTint.Blue -> PantrixTheme.colors.primary
        ShowcaseTint.Green -> PantrixTheme.colors.success
        ShowcaseTint.Orange -> PantrixTheme.colors.warning
        ShowcaseTint.Neutral -> PantrixTheme.colors.neutral
    }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier.size(36.dp).background(role.container, RoundedCornerShape(10.dp)),
            contentAlignment = Alignment.Center
        ) {
            PantrixText(
                text = project.name.substringAfter(' ').take(1),
                style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold),
                color = role.onContainer
            )
        }
        Column {
            PantrixText(
                text = project.name,
                style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.SemiBold),
                maxLines = 1
            )
            PantrixText(
                text = project.bundle,
                style = PantrixTheme.typography.code,
                color = PantrixTheme.colors.textSecondary,
                maxLines = 1
            )
        }
    }
}

@Composable
private fun Platforms(platforms: List<ShowcasePlatform>) {
    val names = platforms.joinToString { it.label }
    Row(
        modifier = Modifier.semantics { contentDescription = names },
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (platforms.size > 2) PantrixText(text = "${platforms.size}")
        platforms.forEach { platform ->
            val color = when (platform) {
                ShowcasePlatform.Android -> PantrixTheme.colors.success.color
                ShowcasePlatform.Ios -> PantrixTheme.colors.primary.color
                ShowcasePlatform.Web -> PantrixTheme.colors.warning.color
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                ShowcaseDot(color)
                if (platforms.size <= 2) PantrixText(text = platform.label, maxLines = 1)
            }
        }
    }
}

@Composable
private fun ApiKeys(count: Int) {
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = "$count", style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold))
        if (count == 0) {
            PantrixIcon(
                imageVector = PantrixIcons.Warning,
                contentDescription = "No keys",
                size = 16.dp,
                tint = PantrixTheme.colors.warning.color
            )
        }
    }
}

@Composable
private fun SamplingAndRetention(project: ShowcaseProject) {
    val colors = PantrixTheme.colors
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixTag(
            text = "%${project.sampling}",
            tone = if (project.sampling == 100) TagTone.Success else TagTone.Warning
        )
        PantrixTag(
            text = "${project.retentionDays}d",
            tone = if (project.retentionDays >= 90) TagTone.Info else TagTone.Neutral,
            icon = PantrixIcons.Inbox
        )
    }
}

@Composable
private fun ActivePill(active: Boolean) {
    PantrixTag(
        text = if (active) "Active" else "Inactive",
        tone = if (active) TagTone.Success else TagTone.Neutral,
        dot = true
    )
}

@Composable
private fun Created(project: ShowcaseProject) {
    Column(horizontalAlignment = Alignment.End) {
        PantrixText(text = project.created, maxLines = 1)
        PantrixText(
            text = project.age,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary,
            maxLines = 1
        )
    }
}

@Composable
private fun ShowcaseDot(color: Color) {
    Box(modifier = Modifier.size(8.dp).background(color, CircleShape))
}

private fun size(request: ShowcaseRequest): String {
    val tenths = request.bytes / 100
    return when {
        request.bytes == 0 -> "0 B"
        tenths < 1000 -> "${tenths / 10}.${tenths % 10} KB"
        else -> "${tenths / 10} KB"
    }
}

private data class ShowcaseRequest(
    val id: String,
    val status: Int,
    val method: String,
    val url: String,
    val source: String,
    val millis: Int,
    val bytes: Int,
    val minutes: Int,
    val network: String = "Wi-Fi"
) {
    /** İki saniyeden uzun süren istek yavaştır. */
    val slow: Boolean get() = millis >= 2000

    /** 4xx ya da 5xx dönen istek başarısızdır. */
    val failed: Boolean get() = status >= 400
}
```

### Crash groups: sorting and a row's detail

An app's crash groups: the one seen most on top. The count, users and last seen columns sort; the arrow in the header points down for largest first and up for smallest first. The largest value of each column is written bold.

Press the chevron at the row's end: the crash's detail opens under the row, as wide as the table. The chevron stands at the row's end and stays there while the columns scroll sideways; a style says so where it is to stand at the start (`DataTableStyle(expander = DataTableExpander.Start)`). In the detail the stack frames are in a monospace block, with the message and the devices the crash is seen on most beside them: side by side where there is room, one under the other where there is not.

The title over the table and the "how many of how many" note are in the toolbar (`toolbar`). On a narrow screen each group is a card: the exception's name and place, the severity and status labels under them, and the counts at the foot.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagColors
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var sort by remember { mutableStateOf(listOf(DataTableSort("count", descending = true))) }
var open by remember { mutableStateOf(setOf(SHOWCASE_CRASHES.first().id)) }
val columns = remember { crashColumns() }
PantrixDataTable(
    rows = remember(sort) { SHOWCASE_CRASHES.sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.exception },
    sort = sort,
    onSortChange = { sort = it },
    expanded = open,
    onExpandedChange = { open = it },
    rowDetail = { CrashDetail(it) },
    toolbar = {
        ShowcaseTitle(
            title = "Crash Groups",
            note = "Showing ${SHOWCASE_CRASHES.size} of 312 groups",
            noteAtTheEnd = true
        )
    },
    listContent = { CrashCard(it) },
    variant = DataTableVariant.Bordered,
    headerTextStyle = smallCapitals(),
    colors = DataTableColors(headerContainer = PantrixTheme.colors.surface, container = PantrixTheme.colors.surface),
    tagKey = "crashes"
)

@Composable
private fun smallCapitals(): TextStyle =
    PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Medium, letterSpacing = 0.8.sp)

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ShowcaseTitle(
    title: String,
    note: String,
    noteAtTheEnd: Boolean = false
) {
    FlowRow(
        modifier = Modifier.padding(vertical = 4.dp).then(if (noteAtTheEnd) Modifier.fillMaxWidth() else Modifier),
        horizontalArrangement = if (noteAtTheEnd) Arrangement.SpaceBetween else Arrangement.spacedBy(12.dp),
        itemVerticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = title, style = PantrixTheme.typography.title)
        PantrixText(text = note, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
    }
}

private fun crashColumns(): List<DataTableColumn<ShowcaseCrash>> {
    val mostCount = SHOWCASE_CRASHES.maxOf { it.count }
    val mostUsers = SHOWCASE_CRASHES.maxOf { it.users }
    return listOf(
        DataTableColumn(key = "exception", header = "EXCEPTION", weight = 3f, minWidth = 300.dp) { CrashName(it) },
        DataTableColumn(
            key = "count",
            header = "COUNT",
            width = 104.dp,
            alignment = Alignment.End,
            comparator = compareBy { it.count }
        ) { Amount(it.count, strong = it.count == mostCount) },
        DataTableColumn(
            key = "users",
            header = "USERS",
            width = 124.dp,
            alignment = Alignment.End,
            comparator = compareBy { it.users }
        ) { Amount(it.users, strong = it.users == mostUsers) },
        DataTableColumn(key = "severity", header = "SEVERITY", width = 136.dp) { SeverityPill(it.severity) },
        DataTableColumn(key = "status", header = "STATUS", width = 148.dp) { CrashStatusPill(it.status) },
        DataTableColumn(
            key = "seen",
            header = "LAST SEEN",
            width = 148.dp,
            alignment = Alignment.End,
            // The one seen last comes first: fewer minutes is the "larger".
            comparator = compareByDescending { it.seenMinutes }
        ) { PantrixText(text = ago(it.seenMinutes), color = PantrixTheme.colors.textSecondary, maxLines = 1) }
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun CrashDetail(crash: ShowcaseCrash) {
    val report = LocalExampleEvents.current
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column(
            modifier = Modifier.weight(1.4f).widthIn(min = 300.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            SectionLabel("STACK FRAME")
            StackFrames(crash)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                PantrixButton(
                    text = "Show details",
                    onClick = { report("${crash.exception}: details asked for") },
                    variant = ButtonVariant.Outline,
                    size = ButtonSize.Small,
                    tagKey = "details_${crash.id}"
                )
                PantrixButton(
                    text = "Ignore",
                    onClick = { report("${crash.exception}: ignored") },
                    variant = ButtonVariant.Text,
                    size = ButtonSize.Small,
                    leadingIcon = { PantrixIcon(imageVector = PantrixIcons.EyeOff, contentDescription = null) },
                    tagKey = "ignore_${crash.id}"
                )
            }
        }
        Column(modifier = Modifier.weight(1f).widthIn(min = 260.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            SectionLabel("MESSAGE")
            PantrixText(text = crash.message)
            Spacer(Modifier.height(4.dp))
            SectionLabel("DEVICE")
            SHOWCASE_DEVICES.forEach { (device, share) ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(text = device, modifier = Modifier.weight(1f), maxLines = 1)
                    PantrixText(text = "%$share", color = PantrixTheme.colors.textSecondary)
                }
            }
        }
    }
}

@Composable
private fun CrashCard(crash: ShowcaseCrash) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        CrashName(crash)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            SeverityPill(crash.severity)
            CrashStatusPill(crash.status)
            PantrixText(
                text = ago(crash.seenMinutes),
                modifier = Modifier.weight(1f),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                textAlign = TextAlign.End,
                maxLines = 1
            )
        }
        PantrixText(
            text = "${grouped(crash.count)} crashes · ${grouped(crash.users)} users",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}

private val SHOWCASE_CRASHES = listOf(
    ShowcaseCrash(
        id = "npe",
        exception = "java.lang.NullPointerException",
        location = "com.pantrix.checkout.CartFragment.onBindViewHolder",
        count = 4812,
        users = 1204,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 4,
        message = "Attempt to invoke virtual method 'java.lang.String com.pantrix.model.CartLine.getSku()' on a " +
            "null object reference"
    ),
    ShowcaseCrash(
        id = "ise",
        exception = "java.lang.IllegalStateException",
        location = "com.pantrix.payment.PaymentSheet.commitTransaction",
        count = 2966,
        users = 884,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Investigating,
        seenMinutes = 12,
        message = "Can not perform this action after onSaveInstanceState"
    ),
    ShowcaseCrash(
        id = "anr_input",
        exception = "ANR: Input dispatching timed out",
        location = "com.pantrix.home.HomeActivity.onCreate",
        count = 2184,
        users = 1912,
        severity = ShowcaseSeverity.Anr,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 21,
        message = "Input dispatching timed out: waited 5008ms for MotionEvent"
    ),
    ShowcaseCrash(
        id = "sigsegv",
        exception = "EXC_BAD_ACCESS (SIGSEGV)",
        location = "Pantrix.ProductGalleryView.layoutSubviews",
        count = 1740,
        users = 662,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 38,
        message = "KERN_INVALID_ADDRESS at 0x0000000000000010"
    ),
    ShowcaseCrash(
        id = "cme",
        exception = "java.util.ConcurrentModificationException",
        location = "com.pantrix.sync.OrderSyncWorker.doWork",
        count = 1402,
        users = 517,
        severity = ShowcaseSeverity.NonFatal,
        status = ShowcaseCrashStatus.Investigating,
        seenMinutes = 52,
        message = "java.util.ArrayList\$Itr.checkForComodification"
    ),
    ShowcaseCrash(
        id = "sqlite_full",
        exception = "android.database.sqlite.SQLiteFullException",
        location = "com.pantrix.data.CatalogDao.insertAll",
        count = 1118,
        users = 396,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 60,
        message = "database or disk is full (code 13 SQLITE_FULL)"
    ),
    ShowcaseCrash(
        id = "oom",
        exception = "java.lang.OutOfMemoryError",
        location = "com.pantrix.media.ImageLoader.decodeBitmap",
        count = 964,
        users = 802,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 75,
        message = "Failed to allocate a 48771084 byte allocation with 16777216 free bytes"
    ),
    ShowcaseCrash(
        id = "ns_invalid",
        exception = "NSInvalidArgumentException",
        location = "Pantrix.CheckoutCoordinator.presentSheet",
        count = 812,
        users = 254,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Resolved,
        seenMinutes = 120,
        message = "Application tried to present modally a view controller that is already being presented"
    ),
    ShowcaseCrash(
        id = "http_503",
        exception = "retrofit2.HttpException: HTTP 503",
        location = "com.pantrix.network.ApiClient.execute",
        count = 704,
        users = 611,
        severity = ShowcaseSeverity.NonFatal,
        status = ShowcaseCrashStatus.Investigating,
        seenMinutes = 135,
        message = "HTTP 503 Service Unavailable"
    ),
    ShowcaseCrash(
        id = "anr_broadcast",
        exception = "ANR: Broadcast of Intent",
        location = "com.pantrix.push.NotificationReceiver.onReceive",
        count = 596,
        users = 428,
        severity = ShowcaseSeverity.Anr,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 180,
        message = "Broadcast of Intent { act=com.google.android.c2dm.intent.RECEIVE } timed out"
    ),
    ShowcaseCrash(
        id = "security",
        exception = "java.lang.SecurityException",
        location = "com.pantrix.location.StorePickerFragment.requestFix",
        count = 431,
        users = 158,
        severity = ShowcaseSeverity.NonFatal,
        status = ShowcaseCrashStatus.Ignored,
        seenMinutes = 300,
        message = "Client must have ACCESS_FINE_LOCATION permission to request PRIORITY_HIGH_ACCURACY locations"
    ),
    ShowcaseCrash(
        id = "kotlin_npe",
        exception = "kotlin.KotlinNullPointerException",
        location = "com.pantrix.profile.AddressBookViewModel.select",
        count = 388,
        users = 141,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 360,
        message = "Required value was null"
    )
)

private fun size(request: ShowcaseRequest): String {
    val tenths = request.bytes / 100
    return when {
        request.bytes == 0 -> "0 B"
        tenths < 1000 -> "${tenths / 10}.${tenths % 10} KB"
        else -> "${tenths / 10} KB"
    }
}

@Composable
private fun SectionLabel(text: String) {
    PantrixText(text = text, style = smallCapitals(), color = PantrixTheme.colors.textSecondary)
}

private fun ago(minutes: Int): String = if (minutes < 60) "$minutes min ago" else "${minutes / 60} hr ago"

private fun grouped(number: Int): String = number.toString().reversed().chunked(3).joinToString(" ").reversed()

private enum class ShowcaseSeverity(val label: String) {
    Fatal("Fatal"),
    Anr("ANR"),
    NonFatal("Non-fatal")
}

private enum class ShowcaseCrashStatus(val label: String) {
    Open("Open"),
    Investigating("Investigating"),
    Resolved("Resolved"),
    Ignored("Ignored")
}

private data class ShowcaseCrash(
    val id: String,
    val exception: String,
    val location: String,
    val count: Int,
    val users: Int,
    val severity: ShowcaseSeverity,
    val status: ShowcaseCrashStatus,
    val seenMinutes: Int,
    val message: String
)

@Composable
private fun CrashName(crash: ShowcaseCrash) {
    Column {
        PantrixText(text = crash.exception, style = PantrixTheme.typography.code, maxLines = 1)
        PantrixText(
            text = crash.location,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary,
            maxLines = 1
        )
    }
}

@Composable
private fun Amount(
    number: Int,
    strong: Boolean
) {
    PantrixText(
        text = grouped(number),
        style = PantrixTheme.typography.label.copy(fontWeight = if (strong) FontWeight.Bold else FontWeight.Medium),
        maxLines = 1
    )
}

@Composable
private fun SeverityPill(severity: ShowcaseSeverity) {
    val tone = when (severity) {
        ShowcaseSeverity.Fatal -> TagTone.Danger
        ShowcaseSeverity.Anr -> TagTone.Info
        ShowcaseSeverity.NonFatal -> TagTone.Warning
    }
    PantrixTag(text = severity.label, tone = tone)
}

@Composable
private fun CrashStatusPill(status: ShowcaseCrashStatus) {
    val colors = PantrixTheme.colors
    val tone = when (status) {
        ShowcaseCrashStatus.Open, ShowcaseCrashStatus.Ignored -> TagTone.Neutral
        ShowcaseCrashStatus.Investigating -> TagTone.Primary
        ShowcaseCrashStatus.Resolved -> TagTone.Success
    }
    PantrixTag(
        text = status.label,
        tone = tone,
        variant = TagVariant.Outline,
        dot = true,
        colors = TagColors(
            content = colors.textPrimary,
            border = colors.divider,
            dot = if (status == ShowcaseCrashStatus.Ignored) colors.disabledContent else Color.Unspecified
        )
    )
}

@Composable
private fun StackFrames(crash: ShowcaseCrash) {
    val colors = PantrixTheme.colors
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.neutral.container, RoundedCornerShape(12.dp))
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        val owner = crash.location.substringBeforeLast('.').substringAfterLast('.')
        listOf(
            "${crash.location} ($owner.kt:184)",
            "androidx.recyclerview.widget.RecyclerView\$Adapter.bindViewHolder (RecyclerView.java:7532)",
            "com.pantrix.checkout.CartLineAdapter.submitList (CartLineAdapter.kt:61)"
        ).forEach { frame ->
            PantrixText(
                text = "at $frame",
                style = PantrixTheme.typography.code,
                color = colors.neutral.onContainer,
                maxLines = 1
            )
        }
    }
}

private val SHOWCASE_DEVICES = listOf(
    "Samsung Galaxy A54 · Android 13" to 41,
    "Xiaomi Redmi Note 12 · Android 12" to 23,
    "Samsung Galaxy S21 · Android 14" to 11
)

private data class ShowcaseRequest(
    val id: String,
    val status: Int,
    val method: String,
    val url: String,
    val source: String,
    val millis: Int,
    val bytes: Int,
    val minutes: Int,
    val network: String = "Wi-Fi"
) {
    /** İki saniyeden uzun süren istek yavaştır. */
    val slow: Boolean get() = millis >= 2000

    /** 4xx ya da 5xx dönen istek başarısızdır. */
    val failed: Boolean get() = status >= 400
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Requests: a table or cards

Captured network requests. The status code stands in its colour, the method in a label and the address in monospace; a long address shows its start and its end, and is cut in the middle. The duration column has a bar beside the value: a slow request is orange and one that returned an error red, and a slow one has "SLOW" written beside its address.

The "Table" and "Cards" buttons in the toolbar choose the layout (`layout`): the table is a table at every width and scrolls sideways where it does not fit; the cards are a list of records at every width. In a narrow window the example opens as cards.

As cards, each request is drawn by `listContent`: on top the status code, the method and the outcome; under them the address; under that the size, the network and the time, with the duration at the end; and at the foot a bar of the duration as wide as the record. The edge around the records, the line between them, the chevron at a record's end and the detail it opens are the table's: both layouts show the same `rowDetail`, and a request that is open in one is open in the other.

The requests sort by status, duration, size and time: a press on a header puts them in that column's order, another turns the order round, and a third takes it away. As cards they have no header; the names of the columns that sort stand in the strip over the records, and are the same buttons. That is the table's doing: the example gives only `sort`, `onSortChange` and the columns' `comparator`. Each column compares by the number behind its cell and not by the text in it: as texts, "412 KB" would come before "84.1 KB". The example opens with the newest request on top.

In the strip the arrow stands only beside the name of the column the records are ordered by. Where the names do not fit, the strip scrolls sideways, fades towards the end it goes on past, and brings the name of that column into view; on a narrow phone four names fit side by side. The source column sorts too, but in the table alone: the cards do not show the source, and with `showInList = false` its name does not stand in the strip.

The chevron at the end of a row or of a record opens the request's identifiers and the whole address; the address can be selected and copied. Opening a request closes the one that was open: with `expansion = DataTableExpansion.Single` one row is open at a time. Told nothing, the table keeps every row it opens.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableExpansion
import com.pantrixui.components.data.datatable.DataTableLayout
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.theme.PantrixTheme

val compact = PantrixTheme.window.widthClass == WindowWidthClass.Compact
var cards by rememberSaveable(compact) { mutableStateOf(compact) }
var sort by remember { mutableStateOf(listOf(DataTableSort("time", descending = true))) }
var open by remember { mutableStateOf(setOf(SHOWCASE_REQUESTS.first().id)) }
val columns = remember { requestColumns() }
PantrixDataTable(
    rows = remember(sort) { SHOWCASE_REQUESTS.sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.url },
    sort = sort,
    onSortChange = { sort = it },
    expanded = open,
    onExpandedChange = { open = it },
    expansion = DataTableExpansion.Single,
    rowDetail = { RequestDetail(it) },
    toolbar = {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.weight(1f)) {
                ShowcaseTitle(
                    title = "Requests",
                    note = "Showing ${SHOWCASE_REQUESTS.size} of 18,402 captured"
                )
            }
            PantrixSegmentButton(
                options = remember {
                    listOf(
                        SegmentOption(value = false, label = "Table"),
                        SegmentOption(value = true, label = "Cards")
                    )
                },
                selected = cards,
                onSelect = { cards = it },
                fullWidth = false,
                tagKey = "view"
            )
        }
    },
    listContent = { RequestCard(it) },
    variant = DataTableVariant.Bordered,
    layout = if (cards) DataTableLayout.List else DataTableLayout.Table,
    headerTextStyle = smallCapitals(),
    colors = DataTableColors(headerContainer = PantrixTheme.colors.surface, container = PantrixTheme.colors.surface),
    tagKey = "requests"
)

@Composable
private fun smallCapitals(): TextStyle =
    PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Medium, letterSpacing = 0.8.sp)

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ShowcaseTitle(
    title: String,
    note: String,
    noteAtTheEnd: Boolean = false
) {
    FlowRow(
        modifier = Modifier.padding(vertical = 4.dp).then(if (noteAtTheEnd) Modifier.fillMaxWidth() else Modifier),
        horizontalArrangement = if (noteAtTheEnd) Arrangement.SpaceBetween else Arrangement.spacedBy(12.dp),
        itemVerticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = title, style = PantrixTheme.typography.title)
        PantrixText(text = note, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
    }
}

private fun requestColumns(): List<DataTableColumn<ShowcaseRequest>> = listOf(
    DataTableColumn(
        key = "status",
        header = "STATUS",
        width = 104.dp,
        comparator = compareBy { it.status }
    ) { StatusCode(it.status) },
    DataTableColumn(key = "request", header = "REQUEST", weight = 3f, minWidth = 280.dp) { RequestLine(it) },
    DataTableColumn.text(
        key = "source",
        header = "SOURCE",
        width = 164.dp,
        sortable = true,
        showInList = false
    ) { it.source },
    DataTableColumn(
        key = "duration",
        header = "DURATION",
        width = 168.dp,
        comparator = compareBy { it.millis }
    ) { Duration(it) },
    DataTableColumn.text(
        key = "size",
        header = "SIZE",
        width = 104.dp,
        alignment = Alignment.End,
        comparator = compareBy { it.bytes }
    ) { size(it) },
    DataTableColumn(
        key = "time",
        header = "TIME",
        width = 112.dp,
        alignment = Alignment.End,
        // The newer is the "larger": the one fewer minutes ago comes later in the order.
        comparator = compareByDescending { it.minutes }
    ) { PantrixText(text = ago(it.minutes), color = PantrixTheme.colors.textSecondary, maxLines = 1) }
)

private fun size(request: ShowcaseRequest): String {
    val tenths = request.bytes / 100
    return when {
        request.bytes == 0 -> "0 B"
        tenths < 1000 -> "${tenths / 10}.${tenths % 10} KB"
        else -> "${tenths / 10} KB"
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun RequestDetail(request: ShowcaseRequest) {
    val colors = PantrixTheme.colors
    val box = RoundedCornerShape(12.dp)
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SectionLabel("IDENTIFIERS")
        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.neutral.container, box)
                .border(1.dp, colors.divider, box)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(32.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            maxItemsInEachRow = 3
        ) {
            listOf(
                "Request" to request.id,
                "Trace" to "4bf92f3577b34da6",
                "Session" to "ses_a3f21c4d",
                "User" to "u_84f21a",
                "Device" to "dev_9c14be",
                "Build" to "4.2.1 (1842)"
            ).forEach { (name, value) ->
                // A line asks for 200dp at the least: as many as fit stand side by side and share the row between them.
                Row(
                    modifier = Modifier.weight(1f).widthIn(min = 200.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    PantrixText(
                        text = name,
                        modifier = Modifier.weight(1f),
                        color = colors.neutral.onContainer.copy(alpha = QUIET_ON_A_FILL)
                    )
                    PantrixText(text = value, style = PantrixTheme.typography.code, color = colors.neutral.onContainer)
                }
            }
        }
        PantrixText(
            text = "https://${request.url}",
            style = PantrixTheme.typography.code,
            color = colors.textSecondary,
            selectable = true
        )
    }
}

@Composable
private fun RequestCard(request: ShowcaseRequest) {
    val colors = PantrixTheme.colors
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            StatusCode(request.status)
            MethodPill(request.method)
            Spacer(Modifier.weight(1f))
            PantrixTag(
                text = if (request.failed) "FAIL" else "OK",
                tone = if (request.failed) TagTone.Danger else TagTone.Success
            )
        }
        Address(url = request.url, tail = CARD_URL_TAIL, modifier = Modifier.fillMaxWidth())
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            PantrixText(
                text = "${size(request)} · ${request.network} · ${ago(request.minutes)}",
                modifier = Modifier.weight(1f),
                style = PantrixTheme.typography.footnote,
                color = colors.textSecondary,
                maxLines = 1
            )
            PantrixText(
                text = duration(request),
                style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold),
                maxLines = 1
            )
        }
        DurationBar(request = request, modifier = Modifier.fillMaxWidth(), height = 6.dp)
    }
}

private val SHOWCASE_REQUESTS = listOf(
    ShowcaseRequest(
        id = "req_n18f4c21",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/catalog/facets?category=grocery&locale=tr-TR&page=2",
        source = "CatalogRepository",
        millis = 284,
        bytes = 38_400,
        minutes = 2
    ),
    ShowcaseRequest(
        id = "req_p27c9d04",
        status = 201,
        method = "POST",
        url = "api.pantrix.io/v3/cart/lines?cartId=8f21ac&source=product-detail",
        source = "CartRepository",
        millis = 412,
        bytes = 1_200,
        minutes = 2
    ),
    ShowcaseRequest(
        id = "req_q51a77be",
        status = 503,
        method = "GET",
        url = "api.pantrix.io/v3/checkout/quote?cartId=8f21ac&promo=WELCOME10",
        source = "QuoteRepository",
        millis = 4020,
        bytes = 400,
        minutes = 2
    ),
    ShowcaseRequest(
        id = "req_i90e3f12",
        status = 200,
        method = "GET",
        url = "cdn.pantrix.io/products/SH-2841/hero@3x.webp?v=1842&fit=cover",
        source = "ImageLoader",
        millis = 1180,
        bytes = 412_000,
        minutes = 3,
        network = "5G"
    ),
    ShowcaseRequest(
        id = "req_a44d0c6a",
        status = 401,
        method = "POST",
        url = "api.pantrix.io/v3/auth/refresh?grant=refresh_token&client=android",
        source = "AuthInterceptor",
        millis = 196,
        bytes = 600,
        minutes = 3
    ),
    ShowcaseRequest(
        id = "req_o73b21d9",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/orders?status=open&limit=25&cursor=eyJpZCI6MTIzfQ",
        source = "OrdersViewModel",
        millis = 642,
        bytes = 84_100,
        minutes = 4,
        network = "4G"
    ),
    ShowcaseRequest(
        id = "req_d08f5a37",
        status = 204,
        method = "DELETE",
        url = "api.pantrix.io/v3/cart/lines/SH-2841?cartId=8f21ac&reason=user",
        source = "CartRepository",
        millis = 231,
        bytes = 0,
        minutes = 4
    ),
    ShowcaseRequest(
        id = "req_s62c18f0",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/search?q=zeytinyagi&facets=brand,price&page=1&sort=relevance",
        source = "SearchViewModel",
        millis = 2280,
        bytes = 56_800,
        minutes = 5,
        network = "5G"
    ),
    ShowcaseRequest(
        id = "req_u15e9b42",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/users/me/addresses?include=default",
        source = "ProfileRepository",
        millis = 158,
        bytes = 2_900,
        minutes = 6
    ),
    ShowcaseRequest(
        id = "req_t39a6c58",
        status = 500,
        method = "POST",
        url = "api.pantrix.io/v3/payments/intents?provider=iyzico&installments=3",
        source = "PaymentRepository",
        millis = 936,
        bytes = 900,
        minutes = 7,
        network = "4G"
    )
)

@Composable
private fun SectionLabel(text: String) {
    PantrixText(text = text, style = smallCapitals(), color = PantrixTheme.colors.textSecondary)
}

private fun ago(minutes: Int): String = if (minutes < 60) "$minutes min ago" else "${minutes / 60} hr ago"

private data class ShowcaseRequest(
    val id: String,
    val status: Int,
    val method: String,
    val url: String,
    val source: String,
    val millis: Int,
    val bytes: Int,
    val minutes: Int,
    val network: String = "Wi-Fi"
) {
    /** İki saniyeden uzun süren istek yavaştır. */
    val slow: Boolean get() = millis >= 2000

    /** 4xx ya da 5xx dönen istek başarısızdır. */
    val failed: Boolean get() = status >= 400
}

@Composable
private fun StatusCode(status: Int) {
    val colors = PantrixTheme.colors
    val color = when {
        status >= 500 -> colors.danger.color
        status >= 400 -> colors.warning.color
        else -> colors.success.color
    }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        ShowcaseDot(color)
        PantrixText(text = "$status", style = PantrixTheme.typography.code, color = color, maxLines = 1)
    }
}

@Composable
private fun MethodPill(method: String) {
    val tone = when (method) {
        "POST" -> TagTone.Success
        "DELETE" -> TagTone.Danger
        else -> TagTone.Info
    }
    PantrixTag(text = method, tone = tone)
}

@Composable
private fun RequestLine(request: ShowcaseRequest) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
        MethodPill(request.method)
        Address(url = request.url, tail = URL_TAIL, modifier = Modifier.weight(1f))
        if (request.slow) PantrixTag(text = "SLOW", tone = TagTone.Warning)
    }
}

@Composable
private fun Address(
    url: String,
    tail: Int,
    modifier: Modifier = Modifier
) {
    Row(modifier = modifier.semantics(mergeDescendants = true) {}) {
        PantrixText(
            text = url.dropLast(tail),
            modifier = Modifier.weight(1f, fill = false),
            style = PantrixTheme.typography.code,
            maxLines = 1
        )
        PantrixText(text = url.takeLast(tail), style = PantrixTheme.typography.code, maxLines = 1)
    }
}

private fun duration(request: ShowcaseRequest): String = if (request.millis < 1000) {
    "${request.millis} ms"
} else {
    "${request.millis / 1000}.${(request.millis % 1000 / 10).toString().padStart(2, '0')} s"
}

@Composable
private fun Duration(request: ShowcaseRequest) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(
            text = duration(request),
            modifier = Modifier.width(64.dp),
            style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.SemiBold),
            textAlign = TextAlign.End,
            maxLines = 1
        )
        DurationBar(request = request, modifier = Modifier.weight(1f))
    }
}

@Composable
private fun DurationBar(
    request: ShowcaseRequest,
    modifier: Modifier = Modifier,
    height: Dp = 4.dp
) {
    val colors = PantrixTheme.colors
    val fill = when {
        request.slow -> colors.warning.color
        request.failed -> colors.danger.color
        else -> colors.primary.color
    }
    Box(modifier = modifier.height(height).background(colors.neutral.container, CircleShape)) {
        Box(
            modifier = Modifier
                .fillMaxWidth((request.millis / LONGEST_MILLIS).coerceIn(0.06f, 1f))
                .height(height)
                .background(fill, CircleShape)
        )
    }
}

private const val CARD_URL_TAIL = 18

private const val QUIET_ON_A_FILL = 0.7f

@Composable
private fun ShowcaseDot(color: Color) {
    Box(modifier = Modifier.size(8.dp).background(color, CircleShape))
}

private const val URL_TAIL = 14

private const val LONGEST_MILLIS = 4020f
```

## API

### PantrixDataTable

`import com.pantrixui.components.data.datatable.PantrixDataTable`, from `com.pantrixui:components`

```kotlin
@Composable
fun <T> PantrixDataTable(
    rows: List<T>,
    columns: List<DataTableColumn<T>>,
    modifier: Modifier = Modifier,
    rowKey: ((row: T) -> String)? = null,
    rowLabel: ((row: T) -> String)? = null,
    rowEnabled: ((row: T) -> Boolean)? = null,
    rowTone: ((row: T) -> DataTableTone?)? = null,
    sort: List<DataTableSort> = emptyList(),
    onSortChange: ((List<DataTableSort>) -> Unit)? = null,
    multiSort: Boolean = false,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    selection: DataTableSelection = DataTableSelection.Multiple,
    expanded: Set<String> = emptySet(),
    onExpandedChange: ((Set<String>) -> Unit)? = null,
    expansion: DataTableExpansion = DataTableExpansion.Multiple,
    rowDetail: (@Composable (row: T) -> Unit)? = null,
    onRowClick: ((row: T) -> Unit)? = null,
    loading: Boolean = false,
    loadingRows: Int = 5,
    empty: (@Composable () -> Unit)? = null,
    toolbar: (@Composable () -> Unit)? = null,
    footer: (@Composable () -> Unit)? = null,
    listContent: (@Composable (row: T) -> Unit)? = null,
    variant: DataTableVariant = DataTableVariant.Plain,
    striped: Boolean = false,
    layout: DataTableLayout = DataTableLayout.Auto,
    headerTextStyle: TextStyle = PantrixTheme.typography.label.copy(fontWeight = FontWeight.SemiBold),
    state: DataTableState = rememberDataTableState(),
    style: DataTableStyle? = null,
    colors: DataTableColors? = null,
    tagKey: String? = null
)
```

Rows of records in columns: a header that orders them, boxes that choose them, rows that open, columns that stay in place while the others scroll, and a list of records where there is no room for a table.

```kotlin
var sort by remember { mutableStateOf(listOf(DataTableSort("total", descending = true))) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
val columns = remember {
    listOf(
        DataTableColumn.text<Order>(key = "customer", header = customer, sortable = true) { it.customer },
        DataTableColumn.text(key = "total", header = total, alignment = Alignment.End, sortable = true) { it.total }
    )
}
PantrixDataTable(
    rows = remember(orders, sort) { orders.sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    sort = sort,
    onSortChange = { sort = it },
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "orders"
)
```

**The rows are the caller's.** The table shows `rows` in the order they are given and changes nothing by itself: a press on a header asks for an order with `onSortChange`, a box for a choice with `onSelectionChange`, a chevron for a row to be opened with `onExpandedChange`. That is what lets one table show rows a screen holds and orders itself, with comparator, and rows a server orders and sends a page at a time. The rows given are the page: the box in the header chooses those, and keeps what was chosen on other pages.

**Columns.** A `DataTableColumn` says how wide it is, or shares what is left. Where the columns do not fit at their least widths the table scrolls sideways: by a drag, by a wheel, by the bar under the rows where a pointer leads, and by the keyboard, which brings the cell with the focus into view. A column pinned to an edge stays there while the others pass under it. The end of a resizable column's header is dragged with a pointer, and moved with the arrow keys once Tab has come to it. Which columns there are, and in which order, is the list itself: a screen that lets its reader hide a column or move one gives the table another list.

**Height.** A table told no height is as tall as its rows and builds them all: that is for a page of rows, in a screen that scrolls, and its header goes up with the page as the rows do. A table told a height keeps its header in place, scrolls its rows under it and builds only the ones in view, so that it holds thousands: a table whose header is to stay is told a height. A height it may not pass is a height too: a table laid straight in a window, with nothing around it that scrolls, is no taller than the window, and one that shares a column with other things is given `Modifier.weight`, as a lazy list is.

**State.** Where the rows are scrolled to, how far the columns are and the widths they were dragged to are kept in a `DataTableState`, which a screen holds itself to read them, to keep them and to scroll to a column.

**Narrow.** A table of `DataTableLayout.Auto` narrower than the style's `compactWidth` is a list of records: each row a block, a column's name before each of its values. The boxes, the chevrons and the order stay: the names of the columns that sort stand in a strip over the list, each the button it is in the header. Where the names do not fit, the strip scrolls sideways, fades towards the end it goes on past, and shows the name of the column the records are ordered by. A column that is not in the list has no name there.

**Keyboard and screen readers.** Tab goes through the headers that sort, the boxes, the chevrons, the rows that can be pressed and whatever the cells hold, and the arrow keys move the focus to the nearest of them that way. A cell that holds nothing to press is no stop: this is a table to read and to act on, and not a grid of cells to walk. Where a pointer leads, the rows' window is a stop itself while the table scrolls, so that a table of plain values is scrolled by the keyboard too: by the arrows, Page Up and Page Down, Home and End. A header says that it is one, as a heading, and how its column is ordered; a box says which row it chooses where `rowLabel` names the rows, and a cell which row and column it is in.

Parameters:

- `rows: List<T>`: the rows, in the order they are shown.
- `columns: List<DataTableColumn<T>>`: the columns, in the order they are shown. No two of them have one key. Keep the list in a `remember`: a table given its columns anew at every composition lays every row out again.
- `modifier: Modifier`: the table's modifier. The table is as wide as the room it is given.
- `rowKey: ((row: T) -> String)?`: what tells a row from the others, the same while the row is the same: what `selected` and `expanded` hold, and the row's automation key. Rows that are chosen or opened need one. Without it a row is known by its place.
- `rowLabel: ((row: T) -> String)?`: what a screen reader calls a row by: `Select Ada Lovelace` in place of twenty boxes that all say `Select row`.
- `rowEnabled: ((row: T) -> Boolean)?`: whether a row can be chosen and pressed. One that cannot is drawn fainter, its box is closed, and the box in the header neither chooses it nor lets it go. Its chevron opens it all the same, and what its cells hold stays the caller's to close. A table whose every row is closed is given `{ false }`.
- `rowTone: ((row: T) -> DataTableTone?)?`: what a row means, or null for a row like the others: the row lies on the soft fill of the tone's role, over any stripe, and what it shows is written in the colour the theme pairs with that fill.
- `sort: List<DataTableSort>`: the order the rows are in: the columns it goes by, the first one first. It is drawn in the headers.
- `onSortChange: ((List<DataTableSort>) -> Unit)?`: called with the order a press on a sortable column's header asks for: smallest first, then largest first, then no order. Null leaves the headers as names.
- `multiSort: Boolean`: whether a press adds its column to the order, to settle the rows the columns before it hold equal, in place of ordering by that column alone.
- `selected: Set<String>`: the keys of the rows that are chosen.
- `onSelectionChange: ((Set<String>) -> Unit)?`: called with the keys that are to be chosen after a box was pressed. Null leaves the table without boxes.
- `selection: DataTableSelection`: whether many rows are chosen or one.
- `expanded: Set<String>`: the keys of the rows that are open.
- `onExpandedChange: ((Set<String>) -> Unit)?`: called with the keys that are to be open after a chevron was pressed. Null leaves the rows without chevrons: the rows named in `expanded` are open all the same.
- `expansion: DataTableExpansion`: whether many rows are open at a time or one. Where it is one, a chevron that opens a row asks for that row alone, and the row that was open closes; the rows named in `expanded` are open as they are given.
- `rowDetail: (@Composable (row: T) -> Unit)?`: what an open row shows under itself, as wide as the table.
- `onRowClick: ((row: T) -> Unit)?`: called with a row that was pressed. It makes every row a button.
- `loading: Boolean`: whether the rows are still on their way: blocks stand in their place, in the table's columns.
- `loadingRows: Int`: how many rows of blocks stand there.
- `empty: (@Composable () -> Unit)?`: what a table without rows shows in their place, in place of the theme's words for it.
- `toolbar: (@Composable () -> Unit)?`: what stands over the header inside the table's edge: a title, a search field, what is done with the chosen rows.
- `footer: (@Composable () -> Unit)?`: what stands under the rows inside the table's edge: a `PantrixPagination`, a count.
- `listContent: (@Composable (row: T) -> Unit)?`: what a record of the list shows, in place of its columns' names and values.
- `variant: DataTableVariant`: how much is drawn around the rows.
- `striped: Boolean`: whether every other row is laid on a faint fill, to keep the eye on its line.
- `layout: DataTableLayout`: whether this is a table, a list, or whichever its width has room for.
- `headerTextStyle: TextStyle`: what the columns' names are written in: the control label's type, a little heavier. A table whose headers are small capitals set apart gives that type here, and writes its headers in capitals.
- `state: DataTableState`: where the rows and the columns are scrolled to and the widths the columns were dragged to.
- `style: DataTableStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: DataTableColors?`: this table's own colours, where they are not the theme's: the ones set here, with the theme's for the rest.
- `tagKey: String?`: the table's automation key: the table is `DataTable_<tagKey>`, and in it a header is `Header_<column>`, a row `Row_<row>`, a cell `Cell_<row>/<column>`, a row's box `Select_<row>`, its chevron `Toggle_<row>` and what it opens `Detail_<row>`. A press is reported as a `DataTable` event: `sort`, `select`, `selectAll`, `expand`, `collapse` and `open`.

### DataTableColumn

`import com.pantrixui.components.data.datatable.DataTableColumn`, from `com.pantrixui:components`

```kotlin
class DataTableColumn<T>(
    public val key: String,
    public val header: String,
    public val width: Dp = Dp.Unspecified,
    public val weight: Float = 1f,
    public val minWidth: Dp = Dp.Unspecified,
    public val alignment: Alignment.Horizontal = Alignment.Start,
    public val sortable: Boolean = false,
    public val comparator: Comparator<T>? = null,
    public val pin: DataTablePin = DataTablePin.None,
    public val resizable: Boolean = false,
    public val showInList: Boolean = true,
    public val tone: DataTableTone? = null,
    public val cell: @Composable (row: T) -> Unit
)
```

One column of a `PantrixDataTable`: its header, how wide it is, and what a row shows in it.

```kotlin
DataTableColumn(key = "state", header = stringResource(Res.string.state), width = 120.dp) { order ->
    PantrixBadge(text = order.state.label)
}
```

A column of plain text is written shorter with `DataTableColumn.text`, which cuts a long text with an ellipsis and orders the rows by it.

**Width.** A column given a `width` is that wide. One given none shares what the fixed columns leave, by its `weight`, and is no narrower than `minWidth`. Where the columns do not fit the table at their least widths, they keep those and the table scrolls sideways.

Parameters:

- `key: String`: What tells this column from the others, the same in every language: what a `DataTableSort` names, and the column's automation key. No two columns of a table have one key.
- `header: String`: The column's name, written once over the rows and before each value in the list a narrow table becomes. It is written as given: a header is a word of a language before it is a style, and the table does not turn it to capitals.
- `width: Dp`: A fixed width, or `Dp.Unspecified` for a share of what is left.
- `weight: Float`: This column's share of what the fixed columns leave, where `width` is unspecified.
- `minWidth: Dp`: The least width of a column that shares, or `Dp.Unspecified` for the style's `columnMinWidth`.
- `alignment: Alignment.Horizontal`: Where the header and what a row shows stand in the column. Numbers end at its end, so that their digits line up.
- `sortable: Boolean`: Whether a press on the header asks for the rows in this column's order. A column with a `comparator` is sortable without it. The header of a column that sorts keeps the place of the order's arrow beside its name, whether the rows are in its order or not: a `width` that just fits the name cuts it.
- `comparator: Comparator<T>?`: How two rows compare by this column, smallest first, for a screen that holds all its rows and orders them itself with comparator. A table whose order is made elsewhere, as by a server, names none.
- `pin: DataTablePin`: Whether the column stays at an edge while the others scroll sideways.
- `resizable: Boolean`: Whether the column's width can be dragged at the end of its header with a pointer. The table keeps the width it was dragged to.
- `showInList: Boolean`: Whether the column is in the list a narrow table becomes: one of a record's lines, and, where it sorts, one of the names over the list that order it. A column that is there for the table's shape, as a row's actions are, is left out. So is one that a record drawn its own way does not show: it sorts in the table, and the list is not ordered by what it does not show.
- `tone: DataTableTone?`: What the column's header is tinted with, or null for a header like the others: the soft fill of one of the theme's roles behind the column's name, which is written in the colour the theme pairs with it. It marks the header alone. What the rows show under it is `cell`'s to colour.
- `cell: @Composable (row: T) -> Unit`: What a row shows in this column.

On the type:

- `DataTableColumn.<T> text(key: String, header: String, width: Dp = Dp.Unspecified, weight: Float = 1f, minWidth: Dp = Dp.Unspecified, alignment: Alignment.Horizontal = Alignment.Start, sortable: Boolean = false, comparator: Comparator<T>? = null, pin: DataTablePin = DataTablePin.None, resizable: Boolean = false, showInList: Boolean = true, tone: DataTableTone? = null, maxLines: Int = 1, textOrder: Comparator<String>? = null, text: (row: T) -> String): DataTableColumn<T>`: A column of plain text: `text` says what a row shows, on `maxLines` lines at the most, cut with an ellipsis where it is longer, in the control label's type.

  ```kotlin
  DataTableColumn.text(key = "customer", header = stringResource(Res.string.customer)) { it.customer }
  ```

  Given `sortable = true` and no `comparator`, it orders the rows by that text, without regard to case. A column of numbers written as text names its own `comparator`: as texts, `10` comes before `9`.

  Unless told, the texts are compared letter by letter as Unicode numbers the letters: the same on every platform, and not as any language's alphabet has them, so that `ç` comes after `z`. Names that a reader looks up by their alphabet are given the language's own order with `textOrder`:

  ```kotlin
  val order = rememberTextOrder()
  val columns = remember(order) {
      listOf(
          DataTableColumn.text<Order>(key = "name", header = name, sortable = true, textOrder = order) {
              it.customer
          }
      )
  }
  ```

  `key`: what tells this column from the others, the same in every language: what a `DataTableSort` names, and the column's automation key. No two columns of a table have one key.

  `header`: the column's name, written once over the rows and before each value in the list a narrow table becomes. It is written as given: the table does not turn it to capitals.

  `width`: a fixed width, or `Dp.Unspecified` for a share of what is left.

  `weight`: this column's share of what the fixed columns leave, where `width` is unspecified.

  `minWidth`: the least width of a column that shares, or `Dp.Unspecified` for the style's `columnMinWidth`.

  `alignment`: where the header and what a row shows stand in the column. Numbers end at its end, so that their digits line up.

  `sortable`: whether a press on the header asks for the rows in this column's order. A column with a `comparator` is sortable without it. The header of a column that sorts keeps the place of the order's arrow beside its name: a `width` that just fits the name cuts it.

  `pin`: whether the column stays at an edge while the others scroll sideways.

  `resizable`: whether the column's width can be dragged at the end of its header with a pointer. The table keeps the width it was dragged to.

  `showInList`: whether the column is in the list a narrow table becomes: one of a record's lines, and, where it sorts, one of the names over the list that order it.

  `tone`: what the column's header is tinted with, or null for a header like the others: the soft fill of one of the theme's roles behind the column's name, which is written in the colour the theme pairs with it. It marks the header alone.

  `maxLines`: how many lines a row's text has at the most.

  `textOrder`: how two texts compare, for a column that orders the rows by its text: the order of a language, as `PantrixLocale.textOrder` and `rememberTextOrder` give it.

  `text`: what a row shows in this column.

### DataTableSort

`import com.pantrixui.components.data.datatable.DataTableSort`, from `com.pantrixui:components`

```kotlin
data class DataTableSort(
    public val columnKey: String,
    public val descending: Boolean = false
)
```

Which column the rows of a `PantrixDataTable` are in the order of, and which way round.

Parameters:

- `columnKey: String`: The `DataTableColumn.key` of the column.
- `descending: Boolean`: Whether the largest comes first. Smallest first unless set.

### DataTablePin

`import com.pantrixui.components.data.datatable.DataTablePin`, from `com.pantrixui:components`

```kotlin
enum class DataTablePin
```

Where a column of a `PantrixDataTable` stands while the others scroll sideways.

Entries:

- `None`: With the others: it scrolls sideways where the columns do not fit the table.
- `Start`: At the table's start, before every column that scrolls: the column that names a row. It stays there while the others scroll under its edge. The right edge in a right-to-left layout.
- `End`: At the table's end, after every column that scrolls: a row's actions.

### DataTableVariant

`import com.pantrixui.components.data.datatable.DataTableVariant`, from `com.pantrixui:components`

```kotlin
enum class DataTableVariant
```

How much a `PantrixDataTable` draws around its rows.

Entries:

- `Plain`: A line between one row and the next, and nothing around the table: for a table inside a card or on a page.
- `Bordered`: One edge around the whole table, in the style's shape, with a line between the rows inside it.
- `Grid`: That edge, and a line between the columns as well: for a dense report the eye reads down as much as along.

### DataTableLayout

`import com.pantrixui.components.data.datatable.DataTableLayout`, from `com.pantrixui:components`

```kotlin
enum class DataTableLayout
```

Whether a `PantrixDataTable` is drawn as a table or as a list of records.

Entries:

- `Auto`: A table where there is room for one, and a list where the table itself is narrower than the style's `compactWidth`: what a table of six columns has to become on a phone.
- `Table`: Always a table, however narrow its place: its columns keep their least widths and scroll sideways.
- `List`: Always a list: each record a block of its own, a column's header before each of its values.

### DataTableSelection

`import com.pantrixui.components.data.datatable.DataTableSelection`, from `com.pantrixui:components`

```kotlin
enum class DataTableSelection
```

How many rows of a `PantrixDataTable` can be chosen at a time.

Entries:

- `Multiple`: Any number of rows, each by a checkbox of its own, and all of them at once by the checkbox in the header.
- `Single`: One row, by a radio button: choosing another lets the first go.

### DataTableTone

`import com.pantrixui.components.data.datatable.DataTableTone`, from `com.pantrixui:components`

```kotlin
enum class DataTableTone
```

What a row of a `PantrixDataTable` means, or the header of a column: drawn as the soft fill of one of the theme's roles, written in the colour the theme pairs with it.

A tint says nothing to someone who cannot see it: what it means stands in the row as words too.

Entries:

- `Info`: Something worth knowing that is neither good nor bad.
- `Success`: Something that worked or is well.
- `Warning`: Something to look at before it becomes a problem.
- `Danger`: Something that failed, or is overdue.
- `Neutral`: Set apart without a judgement in it: a row of totals, a column of another kind.

### DataTableExpander

`import com.pantrixui.components.data.datatable.DataTableExpander`, from `com.pantrixui:components`

```kotlin
enum class DataTableExpander
```

Where the button that opens a row of a `PantrixDataTable` stands.

Entries:

- `Start`: Before the first column, after the box that chooses the row.
- `End`: After the last column, at the row's end, where a list's row has its chevron. It stays there while the columns scroll.

### DataTableState

`import com.pantrixui.components.data.datatable.DataTableState`, from `com.pantrixui:components`

```kotlin
class DataTableState(public val listState: LazyListState = LazyListState())
```

What a `PantrixDataTable` holds from one composition to the next, for a screen that reads it, keeps it or changes it: where the rows are scrolled to, how far the columns are scrolled sideways, and the widths the columns were given by a drag.

```kotlin
val table = rememberDataTableState()
val scope = rememberCoroutineScope()
PantrixDataTable(rows = orders, columns = columns, state = table)
PantrixButton(text = total, onClick = { scope.launch { table.animateScrollToColumn("total") } })
PantrixButton(text = reset, onClick = { table.columnWidths = emptyMap() })
```

One state is one table's: two tables given the same one would scroll each other's columns.

Parameters:

- `listState: LazyListState`: The state of the list the rows scroll in, where the table is told a height.

Members:

- `columnWidths: Map<String, Dp>`: The widths columns were given after the table laid them out, by their keys: by a drag at the end of a resizable column's header, by the arrow keys there, or by the screen itself, which may write them. A width kept from the last visit goes in here, and an empty map gives every column back the width the table makes it. A column that is not named is as wide as the table makes it.
- `columnScroll: Float`: How far the columns are scrolled from their start, in pixels: nought at rest. Their start is at the right where the table is read from there.
- `columnScrollRange: Float`: How far the columns can be scrolled, in pixels: nought while every column fits the table.
- `suspend fun scrollColumnsBy(pixels: Float): Float`: Scrolls the columns `pixels` further from their start at once, or back towards it by a negative distance, no further than their two ends. Returns how far they went.
- `suspend fun animateScrollColumnsBy(pixels: Float): Float`: Scrolls the columns as `scrollColumnsBy` does, with the motion a wheel's turn has.

  `pixels`: how far the columns scroll, in pixels: further from their start, or back towards it where it is less than nought.
- `suspend fun scrollToColumn(columnKey: String)`: Brings the column with `columnKey` into view at once, by the shorter way, and no further than it has to go. Nothing happens for a column that is in view already, one that is pinned, or one the table does not have.
- `suspend fun animateScrollToColumn(columnKey: String)`: Brings the column with `columnKey` into view as `scrollToColumn` does, with a motion.

On the type:

- `DataTableState.saver(listState: LazyListState): Saver<DataTableState, Any>`: Keeps how far the columns are scrolled and the widths they were given, for a state that is to come back as it was: `rememberSaveable(saver = DataTableState.saver(listState)) { DataTableState(listState) }`. Where the rows are is `listState`'s own to keep.

### rememberDataTableState

`import com.pantrixui.components.data.datatable.rememberDataTableState`, from `com.pantrixui:components`

```kotlin
@Composable
fun rememberDataTableState(listState: LazyListState = rememberLazyListState()): DataTableState
```

A `DataTableState` that is kept over what a saved state is kept over: a turn of the screen, a visit to another screen and back.

Parameters:

- `listState: LazyListState`: the state of the list the rows scroll in, for a screen that holds that one itself.

### DataTableStyle

`import com.pantrixui.components.data.datatable.DataTableStyle`, from `com.pantrixui:components`

```kotlin
class DataTableStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val headerMinHeight: Dp = Dp.Unspecified,
    public val rowMinHeight: Dp = Dp.Unspecified,
    public val cellPadding: Dp = Dp.Unspecified,
    public val cellVerticalPadding: Dp = Dp.Unspecified,
    public val columnMinWidth: Dp = Dp.Unspecified,
    public val sortIconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val compactWidth: Dp = Dp.Unspecified,
    public val expander: DataTableExpander? = null
) : PantrixStyle<DataTableStyle>
```

`PantrixDataTable`'s geometry: how tall a header and a row are at the least, the room a cell has around what it shows, and the edge.

On Android the rows are Material's data table rows, 52dp under a header of 56dp with 16dp at a cell's sides. On iOS there is no table to follow, and a row is a list's row of 44pt, the least a finger is given there. Desktop and the web are tighter, for a pointer: a table read with a mouse shows half as many rows again.

The heights, and the room in a cell, follow the density: a table is where a compact screen earns its name. The sort arrow's size, the line's width, the shape and the widths the layout goes by do not.

Parameters:

- `shape: ShapeSpec`: The corners of the edge around the table in `DataTableVariant.Bordered` and `DataTableVariant.Grid`: a step of the brand's shape scale, or a fixed shape.
- `headerMinHeight: Dp`: The least height of the header. A header's name on two lines makes it taller.
- `rowMinHeight: Dp`: The least height of a row. What a cell shows makes its row taller, and a row that holds a control is no lower than the platform's touch target.
- `cellPadding: Dp`: The room between a cell's sides and what it shows.
- `cellVerticalPadding: Dp`: The room over and under what a cell shows, where that needs more than the least height.
- `columnMinWidth: Dp`: The least width of a column that shares the table's width and names no least of its own. The columns keep it where the table is too narrow for them, and the table scrolls sideways.
- `sortIconSize: Dp`: The width and height of the arrow beside the header of the column the rows are in the order of.
- `borderWidth: Dp`: The width of the lines between the rows and the columns, and of the edge. Zero draws none.
- `compactWidth: Dp`: Narrower than this, a table of `DataTableLayout.Auto` is drawn as a list of records.
- `expander: DataTableExpander?`: Where the button that opens a row stands: at the row's end on every platform, as a list's chevron does. Null leaves it as it is.

### DataTableColors

`import com.pantrixui.components.data.datatable.DataTableColors`, from `com.pantrixui:components`

```kotlin
data class DataTableColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val headerContainer: Color = Color.Unspecified,
    public val headerContent: Color = Color.Unspecified,
    public val stripe: Color = Color.Unspecified,
    public val selected: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

What a `PantrixDataTable` is painted with, for a table that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
// The grey band a report's header usually has, written in what the theme pairs with it.
PantrixDataTable(…, colors = DataTableColors(headerContainer = PantrixTheme.colors.neutral.container))
```

A `container` or a `headerContainer` given here that is one of the theme's role colours brings the colour the theme pairs with it, unless `content` or `headerContent` is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The fill behind the whole table. None unless given: a table stands on what is behind it, a card's surface or a page.
- `content: Color`: What a cell is given for what it shows, where that gives no colour of its own, and what a row's own marks are drawn in: the chevron that opens it, the mark of a pointer over it. The theme's `textPrimary`, or on a fill that is not the table's, the colour that fill gives what stands on it.
- `headerContainer: Color`: The fill behind the header. None unless given.
- `headerContent: Color`: The headers' names and the sort arrow. The theme's `textSecondary` on the theme's own grounds, the colour paired with `headerContainer` where that is a role's, and `content` elsewhere.
- `stripe: Color`: The fill behind every other row of a striped table: a faint share of `content` unless given.
- `selected: Color`: The fill behind a chosen row: a faint share of the theme's `primary` on the theme's own grounds, and of `content` on a fill.
- `divider: Color`: The lines between the rows and the columns, and the edge. The theme's `divider` on the theme's own grounds. On a fill, where that line would not read, a share of `content`: the edge a subtle button has.

### List<DataTableSort>.comparator

`import com.pantrixui.components.data.datatable.comparator`, from `com.pantrixui:components`

```kotlin
fun <T> List<DataTableSort>.comparator(columns: List<DataTableColumn<T>>): Comparator<T>
```

How two rows compare in this order: by the first column named, and where that says they are equal by the next. Each column compares by its own `DataTableColumn.comparator`, turned round where the order is descending; a column that has none, or that is not among `columns`, says nothing. With no order at all every two rows are equal, and a sort that keeps equal rows as they were, as `sortedWith` does, leaves the list as it is.

```kotlin
PantrixDataTable(rows = remember(orders, sort) { orders.sortedWith(sort.comparator(columns)) }, …)
```

Parameters:

- `columns: List<DataTableColumn<T>>`

### PantrixLocale.textOrder

`import com.pantrixui.foundation.l10n.textOrder`, from `com.pantrixui:foundation`

```kotlin
fun PantrixLocale.textOrder(): Comparator<String>
```

How two texts compare in this language: the order a reader of it looks a name up in.

```kotlin
names.sortedWith(PantrixLocale.Turkish.textOrder()) // cam, Çay, çilek, ılık, iğne, şeker, zeytin
names.sorted()                                      // cam, iğne, zeytin, Çay, çilek, ılık, şeker
```

Kotlin compares two texts by the numbers Unicode gives their letters. That is the same on every platform and the alphabet of no language: every capital comes before every small letter, and `ç`, `ö` and `ş` come after `z`. This is each platform's own collation in its place: `java.text.Collator` on Android and the desktop, `NSString`'s localized comparison on iOS, and `Intl.Collator` in a browser.

Letters that differ only in case are held equal, so that `ada` and `Ada` stand together and a sort that keeps equal things as they were, as `sortedWith` does, leaves them in the order they came in. A letter with an accent is told from the one without. Digits are compared as letters are: `10` comes before `9`, and a text of numbers is ordered by its numbers and not by this.

The order is the platform's, and the platforms do not agree on every letter of every language: a list ordered here and one ordered by a server may differ at a letter or two. A list that has to be in the very order a server has it in is ordered by the server.

Keep what this returns: making one is not free, and a sort asks it thousands of times. In a composition, `rememberTextOrder` keeps it.

### rememberTextOrder

`import com.pantrixui.foundation.l10n.rememberTextOrder`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberTextOrder(locale: PantrixLocale = PantrixTheme.locale): Comparator<String>
```

The `textOrder` of `locale`, kept for as long as the language is the same: the theme's own language unless told.

```kotlin
val order = rememberTextOrder()
val sorted = remember(names, order) { names.sortedWith(order) }
```

Parameters:

- `locale: PantrixLocale`
