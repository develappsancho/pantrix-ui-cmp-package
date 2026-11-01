# Pagination

The row that moves between the pages of a long list or a table: previous, the pages by their numbers, and next. It stands under the results of a search, a table of orders or an archive.

Which page is on screen is the screen's state: the row is given the number of the page on screen (`page`, counted from one) and how many pages there are (`pageCount`); when a page is asked for, its number is reported through `onPageChange`. The row changes nothing by itself: it shows the page that was asked for once `page` says so.

The numbers stay as long as they fit in the row. In a place too narrow for them the row shows fewer numbers first; where no row of numbers fits, on a phone held upright or in a table's narrow foot, it is laid out as previous, "Page 3 of 10" and next; with its numbers again once it has the room.

In a table's foot its two companions stand beside it: `PantrixPageSize` chooses how many rows a page shows, and `PantrixPageJump` goes to the page whose number is typed.

- `PantrixPageJump` (`com.pantrixui.components.data.pagination`, `com.pantrixui:components`): Goes to a page of a long list by its number, typed into a short field beside the words that name it: a pagination's companion in a table's foot. Keywords: go to page, page number input, jump to page, page input.
- `PantrixPageSize` (`com.pantrixui.components.data.pagination`, `com.pantrixui:components`): Chooses how many rows a page of a list shows, from a select of sizes beside the words that name it: a pagination's companion in a table's foot. Keywords: rows per page, items per page, page size select, per page.
- `PantrixPagination` (`com.pantrixui.components.data.pagination`, `com.pantrixui:components`): Moves between the pages of a long list: previous, the pages by their numbers with the far ones folded into gaps, and next; fewer numbers, and then previous, "Page 3 of 10" and next, where the row is too narrow. Keywords: pager, page numbers, paging, previous next, page navigation.

## Features

- **Numbers and gaps.** The first and the last `boundaryCount` pages are shown, and `siblingCount` pages on each side of the page on screen; those between them fold into a gap of three dots. Each is one unless given. A gap stands for two pages at the least: where a single page is left in between, that page itself is shown. Once there are enough pages to fold, the row has as many items whichever page is on screen: near an end, more pages stand on that side.
- **In a narrow place.** A row too narrow for its numbers folds step by step: first it shows fewer pages beside the page on screen, as many as fit; if that does not fit either, fewer pages at its ends, down to one. Where no row of numbers fits it is laid out as previous, "Page 3 of 10" and next. The room is asked for the page on which the row is widest: the row folds the same way on every page, and its layout does not change as the page moves. How it is laid out is decided by the width left to the row, not by the window. `PaginationLayout.Compact` asks for the short row at every width. In a place narrower even than its buttons the short row is drawn smaller: its buttons are not cut.
- **First and last page.** `firstAndLast = true` puts one more button outside previous and outside next: one goes to the first page, the other to the last. On the first page the two buttons at the start cannot be pressed, nor the two at the end on the last page. Four buttons leave less room for the numbers.
- **The page on screen.** It is told by its fill and is no button: a press on it reports nothing.
- **The ends.** Previous cannot be pressed on the first page, nor next on the last. A `page` outside the pages is taken as the nearest page. A `pageCount` under one is taken as one: a list with nothing in it has one page, an empty one, and the row's arrows cannot be pressed.
- **A row that cannot be pressed.** `enabled = false` turns the whole row off: no part of it can be pressed, and the row is drawn in the theme's disabled colours. If the row is turned off while a keyboard's focus is on one of its parts, the focus stays there; when the row is turned on again, the keyboard goes on from where it was.
- **Keyboard.** The numbers and the arrows are each a stop for Tab; Enter and Space press them. The page on screen is a stop too, and keeps the focus a keyboard put on it: on a page opened by the keyboard the focus stays where it is. When the row comes to one of its ends, the page on screen takes the focus of the button that can no longer be pressed; in the short row the button on the other side takes it.
- **Sizes.** `PaginationStyle.itemSize` is the size of a number, of previous and of next: 40dp on Android, 36dp on iOS, 32dp on desktop and the web. A number too long for it makes its item wider; the icon of previous and of next is 4dp more than half the item. `itemShape` gives the corners: fully round on Android and iOS, small on desktop and the web. `itemGap` is the room between two neighbours, and follows the density. The platform's touch target is kept free around every item; the row is as wide as its items, and at least as tall as that target.
- **Type.** `textStyle` is the text style of the numbers and of the short row's words, the theme's `label` style unless given. A style that makes an item larger does not make its text larger: a large item is given a large type too.
- **Digits.** The numbers, the numbers in the short row's words and the numbers in the names said to a screen reader are written in the digits of the theme's language (`PantrixStrings.digits`): in Arabic digits in the Arabic pack. `onPageChange` reports the same number in every language.
- **Colours.** `PaginationColors` paints the numbers and the short row's words (`content`), previous, next and the gaps' marks (`control`), and the fill and the number of the page on screen (`selectedContainer`, `selectedContent`) one by one. On a fill, all of a row that is given no colour is in the colour that is written on the fill; the page on screen is told by its fill, a share of that colour.
- **Screen reader.** A number is a button named by the page it opens: "Page 4". The page on screen is no button and offers the reader nothing to press: it is read with the state "Current page". The gaps are not read. The buttons that go to the first and the last page are named "First page" and "Last page". The short row's words are told to the reader each time they change. The row is a group named "Pagination". On iOS the group has no name: the reader there reads a group's name after what it holds.
- **Right to left.** In languages read from right to left the row starts on the right, and the arrows turn round.
- **Page size.** `PantrixPageSize` is the words "Per page" and, beside them, a select of sizes. The size that is chosen is its caller's: it is given with `pageSize`, and when another size is chosen it is reported through `onPageSizeChange`; choosing the chosen size again reports nothing. The sizes are 10, 25, 50 and 100 unless given (`DefaultPageSizes`); `pageSizes` gives others. A `pageSize` that is none of the sizes is shown as chosen too, and stands in the list before the first size larger than itself. The select is as wide as the longest size needs: the row stands still as the choice changes.
- **Go to page.** `PantrixPageJump` is the words "Go to page" and, beside them, a short field. Enter, or the action of a keyboard on the screen, reports the page that was typed through `onPageChange` and empties the field; the focus stays in the field. A number outside the pages is taken as the nearest page; an empty field reports nothing. The field takes digits alone, the Western ones and those of the theme's language, and holds as many digits as the last page's number has.
- **The companions' words.** In both the words stand before the control, on the side where the row starts, and are for the eye: a screen reader is given one control, named by those words. `label` changes the words. In a narrow place the words give way and the control does not. `enabled = false` writes the words in the disabled text colour and turns the control off.
- **Automation.** A row given a `tagKey` is `Pagination_<tagKey>`, and its parts are named inside it: `Pagination_orders.Page_4`, `Pagination_orders.Step_previous`, `Pagination_orders.Step_next`, `Pagination_orders.Step_first`, `Pagination_orders.Step_last`, and the short row's words `Pagination_orders.Text_position`. Every page that is asked for is reported as `select`, with its number and with what asked for it (`page`, `previous`, `next`, `first`, `last`). The companions are `PageSize_<tagKey>` and `PageJump_<tagKey>`; the select in one carries the tag `Select_<tagKey>_page_size`, the field in the other `TextField_<tagKey>_page_jump`.

## Usage

### In a table's foot, after the pagination

```kotlin
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixPagination(
        page = orders.page,
        pageCount = orders.pageCount,
        onPageChange = onPageChange,
        tagKey = "orders"
    )
    PantrixPageJump(
        pageCount = orders.pageCount,
        onPageChange = onPageChange,
        tagKey = "orders"
    )
}
```

### Words of its own, while the list is loading

```kotlin
PantrixPageJump(
    pageCount = archive.pageCount,
    onPageChange = { page -> viewModel.openPage(page) },
    label = stringResource(Res.string.go_to_issue),
    enabled = !loading,
    tagKey = "archive"
)
```

### In a table's foot, beside the pagination

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixPageSize(
        pageSize = orders.pageSize,
        onPageSizeChange = { size -> onPageSizeChange(size) },
        tagKey = "orders"
    )
    Spacer(Modifier.weight(1f))
    PantrixPagination(
        page = orders.page,
        pageCount = orders.pageCount,
        onPageChange = onPageChange,
        tagKey = "orders"
    )
}
```

### Sizes and words of its own, while the list is loading

```kotlin
PantrixPageSize(
    pageSize = pageSize,
    onPageSizeChange = { pageSize = it },
    pageSizes = listOf(12, 24, 48),
    label = stringResource(Res.string.cards_per_page),
    enabled = !loading,
    tagKey = "gallery"
)
```

### Under the results of a search

```kotlin
PantrixPagination(
    page = results.page,
    pageCount = results.pageCount,
    onPageChange = { page -> onOpenPage(page) },
    tagKey = "results"
)
```

### An archive, with two pages on each side of the one on screen and buttons to its two ends

```kotlin
PantrixPagination(
    page = page,
    pageCount = archive.pageCount,
    onPageChange = onPageChange,
    siblingCount = 2,
    firstAndLast = true,
    tagKey = "archive"
)
```

### In the foot of a table, always as previous, the page's place and next

```kotlin
PantrixPagination(
    page = page,
    pageCount = pageCount,
    onPageChange = onPageChange,
    enabled = !loading,
    style = PaginationStyle(layout = PaginationLayout.Compact),
    tagKey = "orders"
)
```

### The short row on every phone, as a row laid out by the platform has it

```kotlin
PantrixTheme(
    styles = pantrixStyles(
        PaginationStyle.override(
            android = PaginationStyle(layout = PaginationLayout.Compact),
            ios = PaginationStyle(layout = PaginationLayout.Compact)
        )
    )
) {
    PantrixPagination(page = page, pageCount = pageCount, onPageChange = onPageChange, tagKey = "orders")
}
```

## Examples

### Moving between pages

At its plainest: the page on screen (`page`), how many pages there are (`pageCount`) and what happens when a page is asked for (`onPageChange`). Which page the app is on is the screen's state; the row does not hold it: it reports the number of the page that was asked for, and shows it once `page` says so.

Press a number, or one of the arrows at the two ends: the page that was asked for is written on the card's "Last event" line. The page on screen has a fill and is no button: a press on it reports nothing. Previous cannot be pressed on the first page, nor next on the last.

There are ten pages: the row shows the first and the last, the one on screen and the ones on its two sides, and folds those between into a gap of three dots. On a phone held upright that much does not fit. There the row, by the phone's width, either shows fewer numbers or is in its short form: previous, "Page 1 of 10" and next.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination

val report = LocalExampleEvents.current
var page by rememberSaveable { mutableIntStateOf(1) }
PantrixPagination(
    page = page,
    pageCount = 10,
    onPageChange = { asked ->
        page = asked
        report("Page $asked was asked for")
    },
    tagKey = "plain"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### A list shown a page at a time

A list of forty-eight orders, five to a page: that makes ten pages, with three orders left for the last. The number of pages is worked out from the list itself. The row only reports which page was asked for; showing that page's orders is the screen's work.

Press next, or a number where the numbers fit: the list goes to that page's orders, and the text under it says which orders are shown. Go to the last page: there are three orders there, and next cannot be pressed.

The list is five orders tall on every page: on the last page the two rows that have no order stand empty. Had the list grown shorter, the row under it would have moved up, out from under the finger that pressed it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

var page by rememberSaveable { mutableIntStateOf(1) }
val first = (page - 1) * ORDERS_PER_PAGE + 1
val last = minOf(page * ORDERS_PER_PAGE, ORDER_COUNT)
OrderRows(first = first, last = last, rows = ORDERS_PER_PAGE, tagKey = "order")
PantrixText(
    text = "$first–$last of $ORDER_COUNT orders",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "orders_shown"
)
PantrixPagination(
    page = page,
    pageCount = (ORDER_COUNT + ORDERS_PER_PAGE - 1) / ORDERS_PER_PAGE,
    onPageChange = { page = it },
    tagKey = "orders"
)

@Composable
private fun OrderRows(
    first: Int,
    last: Int,
    rows: Int,
    tagKey: String
) {
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        Column {
            for (order in first until first + rows) {
                val listed = order <= last
                // The line of an empty row keeps its place too, but is not drawn.
                val line = if (listed) Color.Unspecified else Color.Transparent
                if (order > first) PantrixHorizontalDivider(color = line)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    if (listed) {
                        PantrixText(text = "Order #${FIRST_ORDER + order}", tagKey = "${tagKey}_$order")
                        PantrixText(text = "Items: ${1 + order % 4}", color = PantrixTheme.colors.textSecondary)
                    } else {
                        // An empty text is a line tall too; it has nothing to say to a screen reader.
                        PantrixText(text = "", role = TextRole.Decorative)
                    }
                }
            }
        }
    }
}

private const val ORDER_COUNT = 48

private const val ORDERS_PER_PAGE = 5

private const val FIRST_ORDER = 4800
```

### How many pages beside the one on screen and at the ends

`siblingCount` says how many pages are shown on each side of the page on screen, and `boundaryCount` how many at each end of the row; each is one unless given. Four rows of twenty pages show the same page: press a page in one of them, and all four go there.

The first row is given neither. The second shows two pages on each side of the page on screen, and the third two pages at each end. In the last one both are zero: only the page on screen is left in the middle, and the others are reached by the arrows.

A row has as many items whichever page is on screen. Press 1 in the first row: at an end one of the gaps goes, and the pages at that end take its place; in the last row the second page stands beside the first.

The rows are in a frame that scrolls sideways: there the width has no end, and the rows keep their numbers on a narrow screen too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var page by rememberSaveable { mutableIntStateOf(10) }
val secondary = PantrixTheme.colors.textSecondary
HorizontalScrollFrame(tagKey = "around") {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixText(text = "Neither is given: one page on each side, one at each end", color = secondary)
        PantrixPagination(page = page, pageCount = 20, onPageChange = { page = it }, tagKey = "around_usual")
        PantrixText(text = "siblingCount = 2", color = secondary)
        PantrixPagination(
            page = page,
            pageCount = 20,
            onPageChange = { page = it },
            siblingCount = 2,
            tagKey = "around_siblings"
        )
        PantrixText(text = "boundaryCount = 2", color = secondary)
        PantrixPagination(
            page = page,
            pageCount = 20,
            onPageChange = { page = it },
            boundaryCount = 2,
            tagKey = "around_boundaries"
        )
        PantrixText(text = "siblingCount = 0, boundaryCount = 0", color = secondary)
        PantrixPagination(
            page = page,
            pageCount = 20,
            onPageChange = { page = it },
            siblingCount = 0,
            boundaryCount = 0,
            tagKey = "around_none"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `HorizontalScrollFrame`: A frame that scrolls sideways: where its content does not fit its room, it draws a scrollbar under it.

### With buttons that go to the first and the last page

`firstAndLast = true` puts one more button outside previous and outside next: one goes to the first page, the other to the last. It is for going from one end to the other in one press, in a list of many pages such as an archive.

Press the last page button: the row goes to the fortieth page; there neither next nor the last page button can be pressed. The first page button goes to the first page, and there the two buttons at the start cannot be pressed. The page that was asked for is written on the card's "Last event" line.

Four buttons leave less room for the numbers: at the same width this row folds before one with two buttons does. On a phone held upright it is in its short form: two buttons, "Page 12 of 40" and two buttons. On the narrowest phones, where four buttons leave no room for the words, the end of the words is cut and the buttons are not.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination

val report = LocalExampleEvents.current
var page by rememberSaveable { mutableIntStateOf(12) }
PantrixPagination(
    page = page,
    pageCount = 40,
    onPageChange = { asked ->
        page = asked
        report("Page $asked was asked for")
    },
    firstAndLast = true,
    tagKey = "ends"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Where it is too narrow for the numbers

The same row at three widths: the first as wide as the example, the second in a frame of 320dp, the third in one of 240dp. The row fits its place step by step. The first frame is too narrow for the seven items of ten pages: there the row gives up the pages beside the page on screen, and stands with five items. In the second frame that does not fit either: the row is laid out as previous, "Page 3 of 10" and next. Nothing was given for this: the row looks at the width left to it, not at the window.

The three show the same page: press next in one of the frames, and all three go to that page. A row folds the same way on every page: none of them changes its layout as the page moves. Make the window narrower: the row at the top also shows fewer numbers first, and then goes to its short form.

The frames' widths were chosen for the 32dp items of desktop and the web. On a phone the items are larger, and the touch target is kept free around them: there both frames are too narrow for the numbers, and the short row stands in both. The row at the top, by the phone's width, either shows fewer numbers or is short too.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.theme.PantrixTheme

var page by rememberSaveable { mutableIntStateOf(3) }
PantrixPagination(page = page, pageCount = 10, onPageChange = { page = it }, tagKey = "roomy")
PantrixSurface(modifier = Modifier.width(320.dp), border = PantrixTheme.colors.divider) {
    PantrixPagination(
        page = page,
        pageCount = 10,
        onPageChange = { page = it },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "fewer"
    )
}
PantrixSurface(modifier = Modifier.width(240.dp), border = PantrixTheme.colors.divider) {
    PantrixPagination(
        page = page,
        pageCount = 10,
        onPageChange = { page = it },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "narrow"
    )
}
```

### The short row at every width

`PaginationStyle(layout = PaginationLayout.Compact)` asks for the short row at every width: where the numbers would fit, too, the row is previous, the page's place and next. It is for a place where people step from page to page and do not jump to a number, such as the foot of a table.

Press next: the words become "Page 2 of 5"; a screen reader is told the changed words without being asked. Next cannot be pressed on the fifth page, nor previous on the first.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PaginationLayout
import com.pantrixui.components.data.pagination.PaginationStyle
import com.pantrixui.components.data.pagination.PantrixPagination

var page by rememberSaveable { mutableIntStateOf(1) }
PantrixPagination(
    page = page,
    pageCount = 5,
    onPageChange = { page = it },
    style = PaginationStyle(layout = PaginationLayout.Compact),
    tagKey = "compact"
)
```

### A row that cannot be pressed while the list loads

`enabled = false` turns the whole row off: the numbers, previous and next cannot be pressed, and the row is drawn in the theme's disabled colours. It is used so that a second page is not asked for while one is loading: `enabled = !loading`.

While the switch is on, the list counts as loading: press next or, where the numbers fit, a number; the card's "Last event" line does not change. Turn the switch off and press again: the page that was asked for is reported. The page on screen is told in a row that cannot be pressed too: by its fill in a row of numbers, by its words in the short row.

If the list starts loading while the keyboard is on a number or an arrow, the focus stays there: what it is on cannot be pressed, but once the list has come the keyboard goes on from where it was.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

val report = LocalExampleEvents.current
var loading by rememberSaveable { mutableStateOf(true) }
var page by rememberSaveable { mutableIntStateOf(4) }
PantrixSwitchButton(
    checked = loading,
    onCheckedChange = { loading = it },
    label = "The list is loading",
    tagKey = "list_loading"
)
PantrixPagination(
    page = page,
    pageCount = 10,
    onPageChange = { asked ->
        page = asked
        report("Page $asked was asked for")
    },
    enabled = !loading,
    tagKey = "while_loading"
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### In a table's foot: page size and go to page

A table's foot: `PantrixPageSize` chooses how many orders a page shows, `PantrixPagination` moves between the pages, and `PantrixPageJump` goes to the page whose number is typed. The three are in a `FlowRow`: where there is room they stand side by side, and in a narrow place the one that does not fit goes down to the next line; on a phone held upright the three stand one under another. A `Row` does not take what does not fit down a line: it squeezes the last one into the room that is left. The three may not be the same height: `itemVerticalAlignment` lines them up by their middles.

All three read the screen's state, and none knows of the others. Change the page size: forty-eight orders make sixteen pages three at a time, and five pages ten at a time; the row's numbers and the number of digits the field takes follow the new number of pages. As the size changes the first order shown stays on screen: the page that is opened is the one that order falls on at the new size. On the fourth page, with orders 16–20 shown, choose 10: the second page comes, orders 11–20. For forty-eight orders the sizes are small: 3 and 5, before the first of the ready sizes (`DefaultPageSizes`), 10.

Type a number in the field and press Enter: that page is opened, the field is emptied and the focus stays in the field. A number larger than the last page opens the last page; the field takes nothing but digits. The page that was asked for, whatever asked for it, is written on the card's "Last event" line.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.DefaultPageSizes
import com.pantrixui.components.data.pagination.PantrixPageJump
import com.pantrixui.components.data.pagination.PantrixPageSize
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var pageSize by rememberSaveable { mutableIntStateOf(ORDERS_PER_PAGE) }
var page by rememberSaveable { mutableIntStateOf(1) }
val pageCount = (ORDER_COUNT + pageSize - 1) / pageSize
val first = (page - 1) * pageSize + 1
val last = minOf(page * pageSize, ORDER_COUNT)
val open: (Int) -> Unit = { asked ->
    page = asked
    report("Page $asked was asked for")
}
OrderRows(first = first, last = last, rows = pageSize, tagKey = "row")
PantrixText(
    text = "$first–$last of $ORDER_COUNT orders",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "foot_shown"
)
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixPageSize(
        pageSize = pageSize,
        onPageSizeChange = { size ->
            // The page that is opened is the one the first order shown falls on at the new size: the order stays on screen.
            val kept = (first - 1) / size + 1
            pageSize = size
            page = kept
            report("$size orders to a page: page $kept was opened")
        },
        pageSizes = listOf(3, 5) + DefaultPageSizes.first(),
        tagKey = "foot"
    )
    PantrixPagination(page = page, pageCount = pageCount, onPageChange = open, tagKey = "foot")
    PantrixPageJump(pageCount = pageCount, onPageChange = open, tagKey = "foot")
}

@Composable
private fun OrderRows(
    first: Int,
    last: Int,
    rows: Int,
    tagKey: String
) {
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        Column {
            for (order in first until first + rows) {
                val listed = order <= last
                // The line of an empty row keeps its place too, but is not drawn.
                val line = if (listed) Color.Unspecified else Color.Transparent
                if (order > first) PantrixHorizontalDivider(color = line)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    if (listed) {
                        PantrixText(text = "Order #${FIRST_ORDER + order}", tagKey = "${tagKey}_$order")
                        PantrixText(text = "Items: ${1 + order % 4}", color = PantrixTheme.colors.textSecondary)
                    } else {
                        // An empty text is a line tall too; it has nothing to say to a screen reader.
                        PantrixText(text = "", role = TextRole.Decorative)
                    }
                }
            }
        }
    }
}

private const val ORDER_COUNT = 48

private const val ORDERS_PER_PAGE = 5

private const val FIRST_ORDER = 4800
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### In Arabic: a row that starts on the right, and Arabic digits

The same row in an Arabic section: the inner theme is given `locale` alone, `PantrixLocale.Arabic`. The row starts on the right: previous is on the right, the arrows turn round, and the numbers grow towards the left. The numbers are written in Arabic digits: the language's pack carries its digits too (`PantrixStrings.digits`). The one below is the short row: its words are Arabic, and its numbers are written in the same digits.

Press a page: the card's "Last event" line writes the page that was asked for in the app's language. The digits change the writing alone: `onPageChange` reports the same number in every language. The names said to a screen reader are Arabic too, and are written in the same digits.

On a phone held upright the row at the top, by the phone's width, also shows fewer numbers or is short.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.pagination.PaginationLayout
import com.pantrixui.components.data.pagination.PaginationStyle
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var page by rememberSaveable { mutableIntStateOf(3) }
val open: (Int) -> Unit = { asked ->
    page = asked
    report("Page $asked was asked for")
}
PantrixTheme(locale = PantrixLocale.Arabic) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixPagination(page = page, pageCount = 10, onPageChange = open, tagKey = "arabic")
        PantrixPagination(
            page = page,
            pageCount = 10,
            onPageChange = open,
            style = PaginationStyle(layout = PaginationLayout.Compact),
            tagKey = "arabic_short"
        )
    }
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### With its own colours, and on a fill

`colors` takes the colour of the numbers and of the short row's words (`content`), of previous, next and the gaps' marks (`control`), and of the fill and the number of the page on screen (`selectedContainer`, `selectedContent`) one by one; one that is left out stays the theme's. In the first row the arrows and the fill of the page on screen are in the app's own purple, which is in none of the theme's roles. The theme cannot know what reads on a fill it does not have: the colour of its number is given too. The other numbers are given no colour, and stay in the theme's text colour.

The second row is on a fill that is not one of the theme's grounds, and no colour is given: the fill says what is written on it, and all of the row is written in that colour. The page on screen is told by its fill, a share of the same colour.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.PaginationColors
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var page by rememberSaveable { mutableIntStateOf(2) }
PantrixPagination(
    page = page,
    pageCount = 3,
    onPageChange = { page = it },
    colors = PaginationColors(control = own.color, selectedContainer = own.color, selectedContent = own.onColor),
    tagKey = "own"
)
PantrixSurface(
    modifier = Modifier.fillMaxWidth(),
    color = PantrixTheme.colors.primary.color,
    shape = PantrixTheme.shapes.md
) {
    PantrixPagination(
        page = page,
        pageCount = 3,
        onPageChange = { page = it },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "filled"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Sizes and shape

`style` gives the row's sizes; only the fields that are set change. `itemSize` is the size of a number, of previous and of next, `itemShape` their corners, and `itemGap` the room between two neighbours. The arrows' icon grows and shrinks with its item: it is 4dp more than half of it.

The middle row is as it is with nothing given. The one above it is built with 24dp items, fully round and with no room put between them; the one below it with 48dp items, medium corners and 8dp between them. The platform's touch target is kept free around the small items too: the items shrink, but come no closer to each other than that target.

A larger item is not written larger by itself: the bottom row is also given the theme's `title` style, with `textStyle`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.pagination.PaginationStyle
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

var page by rememberSaveable { mutableIntStateOf(2) }
PantrixPagination(
    page = page,
    pageCount = 3,
    onPageChange = { page = it },
    style = PaginationStyle(itemSize = 24.dp, itemShape = ShapeRole.Full, itemGap = 0.dp),
    tagKey = "small"
)
PantrixPagination(page = page, pageCount = 3, onPageChange = { page = it }, tagKey = "usual")
PantrixPagination(
    page = page,
    pageCount = 3,
    onPageChange = { page = it },
    textStyle = PantrixTheme.typography.title,
    style = PaginationStyle(itemSize = 48.dp, itemShape = ShapeRole.Medium, itemGap = 8.dp),
    tagKey = "large"
)
```

## API

### PantrixPagination

`import com.pantrixui.components.data.pagination.PantrixPagination`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixPagination(
    page: Int,
    pageCount: Int,
    onPageChange: (page: Int) -> Unit,
    modifier: Modifier = Modifier,
    siblingCount: Int = 1,
    boundaryCount: Int = 1,
    firstAndLast: Boolean = false,
    enabled: Boolean = true,
    textStyle: TextStyle = PantrixTheme.typography.label,
    style: PaginationStyle? = null,
    colors: PaginationColors? = null,
    tagKey: String? = null
)
```

Moves between the pages of a long list or a table.

A row of numbers has previous, the first and the last `boundaryCount` pages, `siblingCount` pages on each side of the page on screen with the pages between folded into gaps, and next. It has as many items whichever page is on screen, each in the same room, so the row stands still as the page moves; only a number of three digits or more makes its own item wider.

The row fits itself to the room it is given, and not to the platform or the window. Where the numbers do not fit as they are asked for, it shows fewer pages beside the page on screen, as many as fit, and then fewer at its ends, down to one. Where no row of numbers fits it is laid out as previous, "Page 3 of 10" and next: the same row on a phone held upright and in a table's narrow foot, and the row of numbers again where there is room. The room is asked for the row as it is on its widest page, so the row is the same on every page. `PaginationStyle.layout` asks for the short row everywhere: a theme that gives it to its phones has what a row laid out by the platform has. In a place narrower than its buttons the short row is drawn smaller, and keeps both whole.

A page's number is a button a screen reader calls by what it opens, "Page 4". The page on screen is no button and offers no press: it is said to be the current page. It keeps the focus a keyboard put on it, and is a stop for Tab, so that the row is entered where it is. A button that has taken the row to its end can no longer be pressed, and gives its focus to the page on screen, or to a button of the other side in the short row. A row that stops being `enabled` while a keyboard is on one of its items leaves the focus there, on an item that does nothing, until the row can be pressed again. The gaps say nothing. The row is one group, named a pagination in the theme's language; on iOS it is a group without a name, where a screen reader reads a group's own name after what the group holds.

Numbers are written in the digits of the theme's language. The row is as wide as its items and one line, as tall as the platform's touch target at the least. In a place wider than itself it starts where the place does. What starts there is its first button, the room a press on it has: the arrow stands in the middle of that room, a little inside the edge a text over the row starts at, as an icon does in any button. Drawn at that edge, the button's fill, its ring and half of what a finger presses would lie outside the row.

Parameters:

- `page: Int`: the page on screen, counted from one, as it is written on the row: a pager's or a carousel's index counts from nought, and is this less one. A number outside the pages is taken as the nearest page.
- `pageCount: Int`: how many pages there are. A list with nothing in it has one page, an empty one: a count under one is taken as one.
- `onPageChange: (page: Int) -> Unit`: told the page that was asked for, by its number or by a button. The row shows it once `page` says so.
- `modifier: Modifier`: applied to the row.
- `siblingCount: Int`: in a row of numbers, how many pages are shown on each side of the page on screen where there is room for them: none or more. More than there are pages is all of them.
- `boundaryCount: Int`: in a row of numbers, how many pages are always shown at each end where there is room for them: none or more.
- `firstAndLast: Boolean`: whether the row has, outside previous and next, the two buttons that go to the first page and to the last.
- `enabled: Boolean`: whether the row can be pressed: one that cannot is drawn in the theme's disabled colours.
- `textStyle: TextStyle`: the type the numbers and the words are set in: the theme's `label` unless given. An item that is made larger by the style is not written larger by itself.
- `style: PaginationStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: PaginationColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `tagKey: String?`: a locale-independent key for automation: the row's tag is `Pagination_<tagKey>`, and its parts are named inside it, `Pagination_<tagKey>.Page_<number>`, `Pagination_<tagKey>.Step_previous`, `Pagination_<tagKey>.Step_next`, `Pagination_<tagKey>.Step_first`, `Pagination_<tagKey>.Step_last`, and `Pagination_<tagKey>.Text_position` for the words of a row without numbers.

### PantrixPageSize

`import com.pantrixui.components.data.pagination.PantrixPageSize`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixPageSize(
    pageSize: Int,
    onPageSizeChange: (pageSize: Int) -> Unit,
    modifier: Modifier = Modifier,
    pageSizes: List<Int> = DefaultPageSizes,
    label: String = PantrixTheme.strings.perPage,
    enabled: Boolean = true,
    tagKey: String? = null
)
```

Chooses how many rows a page of a list shows: the words "Per page" and, beside them, a select of sizes.

It stands beside a `PantrixPagination` in a table's foot. What is chosen is its caller's and not the control's: it is given `pageSize` and asks for another with `onPageSizeChange`. Choosing the size that is chosen already asks for nothing. A `pageSize` that is none of `pageSizes`, as one kept from an earlier visit may be, is shown as the choice all the same, and is listed with the sizes, before the first of them that is larger.

The sizes are written in the digits of the theme's language. The words stand before the select, where the row starts: at the right in a language that is read from the right. They are for the eye. A screen reader is given one control, the select, which is named by the words, and not a text and after it a control without a name.

The select is as wide as the longest of its sizes needs, in its box and in the rows of its list, so that the row stands still as the choice changes and no size is cut in the list. The row is one line, as tall as the select, and as wide as its words and its select. In a place wider than itself it starts where the place does. In one too narrow for it the words give way and the select does not.

Parameters:

- `pageSize: Int`: how many rows a page shows now.
- `onPageSizeChange: (pageSize: Int) -> Unit`: told the size that was chosen, where it is another than `pageSize`. The select shows it once `pageSize` says so.
- `modifier: Modifier`: applied to the row.
- `pageSizes: List<Int>`: the sizes to choose from, in the order they are listed: `DefaultPageSizes` unless given. A size given twice is listed once. There is one at the least, and each is a row or more: a list that is empty or holds a number under one is refused.
- `label: String`: the words before the select, and the select's name for a screen reader: the theme's "Per page" unless given.
- `enabled: Boolean`: whether a size can be chosen: a row that cannot be used has its words in the disabled text colour and a select that is disabled, which takes no focus and says so.
- `tagKey: String?`: a locale-independent key for automation: the row's tag is `PageSize_<tagKey>` and its words are `PageSize_<tagKey>.Text_label`. The select in it has the key `<tagKey>_page_size`, and is tagged as a select is: `Select_<tagKey>_page_size`, its list `SelectList_<tagKey>_page_size`, and a size in the list `Select_<tagKey>_page_size.SelectOption_<size>`. A key too long for a tag is cut, and `_page_size` is kept whole. A choice is reported as `PageSize`, with the size. That the list of sizes opened is reported as `PageSize` too, with the row's tag: the row is one component, and reports under one name.

### PantrixPageJump

`import com.pantrixui.components.data.pagination.PantrixPageJump`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixPageJump(
    pageCount: Int,
    onPageChange: (page: Int) -> Unit,
    modifier: Modifier = Modifier,
    label: String = PantrixTheme.strings.goToPage,
    enabled: Boolean = true,
    tagKey: String? = null
)
```

Goes to a page of a long list by its number: the words "Go to page" and, beside them, a short field the number is typed in.

It stands beside a `PantrixPagination` in a table's foot, for a list of more pages than a reader steps through. Enter, or the action of a keyboard on the screen, asks for the page that was typed, with `onPageChange`, and empties the field for the next number. The field keeps the focus, so that a second page is typed without another press. A number that is no page's is taken as the nearest page: nought is the first page, and a number past the last is the last. An empty field asks for nothing.

The field takes digits alone: the Western ones and the ones the theme's language writes its numbers with. A sign that is neither is dropped as it is typed, and out of a text that is pasted. It takes no more digits than the last page's number has, so a number is never longer than the field: typing stops there, and a number pasted with more digits is not put in, as a text field turns down a paste that does not fit. On a phone it brings up a keyboard of numbers whose action is "go" (`numberKeyboardOptions`): on an iPhone the one of numbers and punctuation, since the number pad there has no key for an action.

The field is as wide as the last page's number needs, in the widest of the digits, and a digit more: a few digits, and not a text field's width. It is no narrower than the platform's touch target, or than it is tall. The words stand before it, where the row starts: at the right in a language that is read from the right. They are for the eye. A screen reader is given one control, the field, which is named by the words. The row is one line, as tall as the field. In a place wider than itself it starts where the place does. In one too narrow for it the words give way and the field does not.

Parameters:

- `pageCount: Int`: how many pages there are: the last page a number is taken as, and how many digits the field holds. A count under one is taken as one, as `PantrixPagination` takes it.
- `onPageChange: (page: Int) -> Unit`: told the page that was asked for, by its number, counted from one.
- `modifier: Modifier`: applied to the row.
- `label: String`: the words before the field, and the field's name for a screen reader: the theme's "Go to page" unless given.
- `enabled: Boolean`: whether a number can be typed: a row that cannot be used has its words in the disabled text colour and a field that is disabled, which takes no focus and says so.
- `tagKey: String?`: a locale-independent key for automation: the row's tag is `PageJump_<tagKey>` and its words are `PageJump_<tagKey>.Text_label`. The field in it has the key `<tagKey>_page_jump`, and is tagged as a text field is: `TextField_<tagKey>_page_jump`. A key too long for a tag is cut, and `_page_jump` is kept whole. A page that is asked for is reported as `PageJump`, with the page and never with what was typed. That the field took the focus is reported as `PageJump` too, with the row's tag: the row is one component, and reports under one name.

### PaginationStyle

`import com.pantrixui.components.data.pagination.PaginationStyle`, from `com.pantrixui:components`

```kotlin
class PaginationStyle(
    public val layout: PaginationLayout? = null,
    public val itemSize: Dp = Dp.Unspecified,
    public val itemShape: ShapeSpec = ShapeSpec.Unspecified,
    public val itemGap: Dp = Dp.Unspecified
) : PantrixStyle<PaginationStyle>
```

`PantrixPagination`'s layout and geometry.

Each item, a page's number, previous and next, is `itemSize` square at the least, in `itemShape`, and `itemGap` from the one beside it; around it the platform's touch target is kept free. The gap follows the density; the items do not.

Parameters:

- `layout: PaginationLayout?`: How the pages are laid out: by their numbers on every platform, in a row that has the room.
- `itemSize: Dp`: A page's number, previous and next: 40dp on Android, 36dp on iOS, 32dp on desktop and the web. A number too long for it makes its item wider. The icons in previous and next are half of it and 4dp.
- `itemShape: ShapeSpec`: The corners of an item, of its fill where it is the page on screen and of its ring: round on Android and iOS, small on desktop and the web.
- `itemGap: Dp`: Between two neighbours of the row.

### PaginationLayout

`import com.pantrixui.components.data.pagination.PaginationLayout`, from `com.pantrixui:components`

```kotlin
enum class PaginationLayout
```

How a `PantrixPagination` lays out its pages.

Entries:

- `Numbered`: Previous, the pages by their numbers with the far ones folded into gaps, and next: where people jump between pages. A row too narrow for it is laid out as `Compact`.
- `Compact`: Previous, "Page 3 of 10", and next: where people step from one page to the one after it.

### PaginationColors

`import com.pantrixui.components.data.pagination.PaginationColors`, from `com.pantrixui:components`

```kotlin
data class PaginationColors(
    public val content: Color = Color.Unspecified,
    public val control: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified
)
```

What a `PantrixPagination` is painted with, for a row that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixPagination(…, colors = PaginationColors(selectedContainer = PantrixTheme.colors.success.container))
```

A row has no fill of its own and stands on what is behind it. On a fill, which says what is written on it, all of the row is written in that: the theme's texts and its brand's fill are colours for the theme's own grounds. The page on screen is told there by a fill that is a share of the same colour.

Parameters:

- `content: Color`: The numbers of the pages that are not on screen, and the words of a row that has no room for numbers. The theme's `textPrimary`.
- `control: Color`: Previous and next, and the marks that stand for the pages folded away. The theme's `textSecondary`.
- `selectedContainer: Color`: The fill of the page on screen. The primary role's `container`.
- `selectedContent: Color`: The number of the page on screen: what the theme pairs with `selectedContainer`, which is the primary role's `onContainer` on the fill the row has by itself. The theme has no pair for a fill that is none of its roles' and writes on it as on the row's own: give such a fill its number too.
