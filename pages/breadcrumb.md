# Breadcrumb

The trail of pages above the one on screen: each a link back to it, the last the page on screen itself. In a path of folders, in the sections of a document or in a catalogue, it tells the reader where they are and how to go up one. The row at the top of this page is a `PantrixBreadcrumb` too.

A trail is one line, and never wraps. When it does not fit its row it folds by itself: the pages after the first go behind a button, as few of them as it takes, and the button opens them as a menu.

- `PantrixBreadcrumb` (`com.pantrixui.components.navigation.breadcrumb`, `com.pantrixui:components`): The trail of pages above the one on screen, each a link back to it, ending in the page on screen; a trail too long for its row folds its middle into a menu. Keywords: breadcrumbs, trail, path, location, hierarchy navigation, crumbs.

## Features

- **Links and the page on screen.** The pages above are links, each underlined; when one is pressed, `onSelect` reports its key. The last page is the page on screen: it is a text, it is not pressed, and its key is never reported.
- **It folds by itself.** Where the row is too narrow, the trail keeps its first page and its last ones, and those between them go into the menu that the three-dot button opens. Where the first page and the last do not fit beside the button either, the long names are cut to one width, and a short one stays as it is.
- **The most pages.** With `maxItems` the row shows no more pages than that, even where it has room. It has to be at least two: a trail always shows its first page and its last.
- **Icons.** `BreadcrumbItem.icon` stands before the page's name; with `iconOnly` it takes the name's place, and the page is a button that says its name to a screen reader.
- **Type and sizes.** `textStyle` is the names' type, the theme's `label` where it is not given. `BreadcrumbStyle` gives the room between the names and the marks, and the size of the mark and of the icon; these are the same on every platform. `minHeight` makes the row lower than the touch target, and `linkUnderline` says when the links are underlined.
- **Colours.** `BreadcrumbColors` paints the links, the page on screen and the marks one by one. On a fill, all of a trail that is given no colour is in the colour that is written on the fill.
- **Screen reader.** The row is a group named "Breadcrumb", the last page is read with the state "Current page", and the marks in between are not read. On iOS the group has no name: a screen reader there reads a group's name after what the group holds.
- **Right to left.** In languages read from right to left the trail starts on the right, and the marks turn round.
- **Automation.** In a trail that is given a `tagKey`, the pages and the button for the folded pages are named inside it: `Breadcrumb_docs.Item_components`, `Breadcrumb_docs.More_pages`.

## Usage

### Over a page of the documentation

```kotlin
PantrixBreadcrumb(
    items = listOf(
        BreadcrumbItem(key = "home", label = stringResource(Res.string.home)),
        BreadcrumbItem(key = "components", label = stringResource(Res.string.components)),
        BreadcrumbItem(key = "breadcrumb", label = stringResource(Res.string.breadcrumb))
    ),
    onSelect = { key -> onOpen(key) },
    tagKey = "docs"
)
```

### Folders, the first shown by its icon alone and never more than four in the row

```kotlin
PantrixBreadcrumb(
    items = listOf(BreadcrumbItem(key = "root", label = rootName, icon = PantrixIcons.Folder, iconOnly = true)) +
        folders.map { BreadcrumbItem(key = it.id, label = it.name) },
    onSelect = onOpenFolder,
    maxItems = 4,
    tagKey = "folders"
)
```

## Examples

### Navigating folders

At its plainest: the trail's pages (`items`) and what happens when one of them is pressed (`onSelect`). Which page the app is on is the screen's state; the trail does not hold it, and only reports the key of the page that was pressed.

Press a folder above: the app goes up to it, and the trail ends in that folder. "Go deeper" makes the path longer again. The last page is not pressed: that is where the app already is.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

var depth by rememberSaveable { mutableIntStateOf(FOLDERS.size) }
PantrixBreadcrumb(
    items = FOLDERS.take(depth),
    onSelect = { key -> depth = FOLDERS.indexOfFirst { it.key == key } + 1 },
    tagKey = "folders"
)
FolderControls(depth = depth, onDeeper = { depth++ }, tagKey = "folders_deeper")

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Home"),
    BreadcrumbItem(key = "documents", label = "Documents"),
    BreadcrumbItem(key = "projects", label = "Projects"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Design")
)

@Composable
private fun FolderControls(
    depth: Int,
    onDeeper: () -> Unit,
    tagKey: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(
            text = "Go deeper",
            onClick = onDeeper,
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            enabled = depth < FOLDERS.size,
            tagKey = tagKey
        )
        PantrixText(text = "You are here: ${FOLDERS[depth - 1].label}", color = PantrixTheme.colors.textSecondary)
    }
}
```

### A row that shows three pages at the most

`maxItems = 3`: the row shows no more than three pages, even where it has room. The first page and the last two stay; those between them are behind the three-dot button.

Press the button: the folded folders open as a menu, in the order of the trail. A folder chosen in the menu is reported through `onSelect` as one pressed in the row is, and the app goes up to it. When the path is down to three pages the button goes.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

var depth by rememberSaveable { mutableIntStateOf(FOLDERS.size) }
PantrixBreadcrumb(
    items = FOLDERS.take(depth),
    onSelect = { key -> depth = FOLDERS.indexOfFirst { it.key == key } + 1 },
    maxItems = 3,
    tagKey = "folded"
)
FolderControls(depth = depth, onDeeper = { depth++ }, tagKey = "folded_deeper")

@Composable
private fun FolderControls(
    depth: Int,
    onDeeper: () -> Unit,
    tagKey: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(
            text = "Go deeper",
            onClick = onDeeper,
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            enabled = depth < FOLDERS.size,
            tagKey = tagKey
        )
        PantrixText(text = "You are here: ${FOLDERS[depth - 1].label}", color = PantrixTheme.colors.textSecondary)
    }
}

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Home"),
    BreadcrumbItem(key = "documents", label = "Documents"),
    BreadcrumbItem(key = "projects", label = "Projects"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Design")
)
```

### Icons: before the name or in its place

`icon` stands before the page's name, in the name's colour. The icon and the name are one link: a press on the icon is a press on the name, and the icon is no second stop for the keyboard and no second thing for a screen reader.

In the first trail the first page is shown by its icon alone, with `iconOnly`: it is a button that says its name to a screen reader. A page without an icon is written by its name whatever `iconOnly` says.

In the second trail two pages that are shown by their icons alone are folded away. Press the three-dot button: the menu writes each page's name beside its icon.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.icons.PantrixIcons

PantrixBreadcrumb(
    items = listOf(
        BreadcrumbItem(key = "files", label = "Files", icon = PantrixIcons.Folder, iconOnly = true),
        BreadcrumbItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
        BreadcrumbItem(key = "schedule", label = "Calendar", icon = PantrixIcons.Calendar)
    ),
    onSelect = {},
    tagKey = "icons"
)
PantrixBreadcrumb(
    items = listOf(
        BreadcrumbItem(key = "files", label = "Files", icon = PantrixIcons.Folder, iconOnly = true),
        BreadcrumbItem(key = "starred", label = "Starred", icon = PantrixIcons.Star, iconOnly = true),
        BreadcrumbItem(key = "schedule", label = "Calendar", icon = PantrixIcons.Calendar, iconOnly = true),
        BreadcrumbItem(key = "today", label = "Today")
    ),
    onSelect = {},
    maxItems = 2,
    tagKey = "icons_folded"
)
```

### A path too long for its row folds by itself

No `maxItems` is given: the trail folds to the width that is left to it. First the pages after the first go behind the button, as few of them as it takes; the trail keeps its first page, where it began, and its last ones, where it is. Where the first page and the last do not fit beside the button either, the long names are cut to one width, and a short one stays as it is.

The same path at three widths: the first as wide as the example, the others in frames 480dp and 240dp wide at the most. In the middle frame the page in between is behind the button; in the narrow frame the last page's name is cut as well. Narrow the window: the first trail folds in the same order.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

PantrixBreadcrumb(items = LONG_PATH, onSelect = {}, tagKey = "long")
PantrixSurface(modifier = Modifier.width(480.dp), border = PantrixTheme.colors.divider) {
    PantrixBreadcrumb(
        items = LONG_PATH,
        onSelect = {},
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "long_medium"
    )
}
PantrixSurface(modifier = Modifier.width(240.dp), border = PantrixTheme.colors.divider) {
    PantrixBreadcrumb(
        items = LONG_PATH,
        onSelect = {},
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "long_narrow"
    )
}

private val LONG_PATH = listOf(
    BreadcrumbItem(key = "home", label = "Home"),
    BreadcrumbItem(key = "systems", label = "Design systems and component libraries"),
    BreadcrumbItem(key = "navigation", label = "Navigation for wide and narrow windows")
)
```

### On a fill

A trail on a fill that is not one of the theme's grounds. No colour is given: the fill says what is written on it, and all of the trail, its links, the page on screen and the marks, is written in that colour. The theme's link and text colours are for the theme's own grounds; here a link is told from the page on screen by its underline.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(
    modifier = Modifier.fillMaxWidth(),
    color = PantrixTheme.colors.primary.color,
    shape = PantrixTheme.shapes.md
) {
    PantrixBreadcrumb(
        items = FOLDERS,
        onSelect = {},
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        maxItems = 3,
        tagKey = "filled"
    )
}

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Home"),
    BreadcrumbItem(key = "documents", label = "Documents"),
    BreadcrumbItem(key = "projects", label = "Projects"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Design")
)
```

### Text style and sizes

`textStyle` is the type the names are set in: a trail that is given none is written in the theme's `label` style. `style` gives the sizes: `itemGap` is the room between a name and the mark beside it, and between an icon and its name; `separatorSize` is the size of the mark and of the button for the folded pages; `iconSize` is the size of a page's own icon. Only the fields that are set change.

The middle trail is as it is with nothing given: 16dp marks and icons, 4dp from the names. The one above it is the same trail set small, and the one below it the same trail set large. The rows of all three are at least as tall as the platform's touch target.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixBreadcrumb(
    items = PLACES,
    onSelect = {},
    textStyle = PantrixTheme.typography.footnote,
    style = BreadcrumbStyle(itemGap = 2.dp, separatorSize = 12.dp, iconSize = 12.dp),
    tagKey = "small"
)
PantrixBreadcrumb(items = PLACES, onSelect = {}, tagKey = "usual")
PantrixBreadcrumb(
    items = PLACES,
    onSelect = {},
    textStyle = PantrixTheme.typography.callout,
    style = BreadcrumbStyle(itemGap = 8.dp, separatorSize = 20.dp, iconSize = 20.dp),
    tagKey = "large"
)

private val PLACES = listOf(
    BreadcrumbItem(key = "files", label = "Files", icon = PantrixIcons.Folder),
    BreadcrumbItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    BreadcrumbItem(key = "schedule", label = "Calendar", icon = PantrixIcons.Calendar)
)
```

### Over a title, low and without lines

The trail over a documentation page's title: as low as a line of text, and not underlined. `minHeight` is the row's least height; where it is not given, it is the platform's touch target. In a lower row a touch beside a page still reaches it: the theme gives a small target room for a touch that takes no room in the layout.

`linkUnderline = LinkUnderline.OnHover` underlines the links only under a pointer and while they hold the focus: a trail does not stand in a sentence, and its marks already tell its links from the page on screen. Where the platform is used by touch they are still underlined always.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.link.LinkUnderline
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Column {
    PantrixBreadcrumb(
        items = PLACES,
        onSelect = {},
        textStyle = PantrixTheme.typography.footnote,
        style = BreadcrumbStyle(minHeight = 20.dp, linkUnderline = LinkUnderline.OnHover),
        tagKey = "over_a_title"
    )
    PantrixText(text = PLACES.last().label, style = PantrixTheme.typography.headline)
}

private val PLACES = listOf(
    BreadcrumbItem(key = "files", label = "Files", icon = PantrixIcons.Folder),
    BreadcrumbItem(key = "starred", label = "Starred", icon = PantrixIcons.Star),
    BreadcrumbItem(key = "schedule", label = "Calendar", icon = PantrixIcons.Calendar)
)
```

### With its own colours, a small type and small marks

`colors` takes the colour of the links (`link`), of the page on screen (`current`) and of the marks (`separator`) one by one; one that is left out stays the theme's. Here the links and the marks are in the app's own purple, which is in none of the theme's roles; the page on screen is given no colour, and stays in the theme's text colour.

The type is `footnote`, and the marks are 12dp and 6dp from the names: the colour, the text style and the sizes are given independently of each other.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbColors
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixBreadcrumb(
    items = FOLDERS.take(3),
    onSelect = {},
    textStyle = PantrixTheme.typography.footnote,
    style = BreadcrumbStyle(itemGap = 6.dp, separatorSize = 12.dp),
    colors = BreadcrumbColors(link = own.color, separator = own.color),
    tagKey = "own"
)

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Home"),
    BreadcrumbItem(key = "documents", label = "Documents"),
    BreadcrumbItem(key = "projects", label = "Projects"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Design")
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixBreadcrumb

`import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixBreadcrumb(
    items: List<BreadcrumbItem>,
    onSelect: (key: String) -> Unit,
    modifier: Modifier = Modifier,
    maxItems: Int = Int.MAX_VALUE,
    textStyle: TextStyle = PantrixTheme.typography.label,
    style: BreadcrumbStyle? = null,
    colors: BreadcrumbColors? = null,
    tagKey: String? = null
)
```

The trail of pages above the one on screen, each a link back to it, ending in the page on screen.

The pages above are links, underlined and announced as links; the last one is the page on screen, a text whose state a screen reader says is the current page. A page may have an icon before its name, or in its place: a page shown by its icon alone is a button named by the page. The marks between the pages point the way the trail is read, and say nothing to a screen reader. The row is one group, named a breadcrumb in the theme's language. On iOS it is a group without a name: a screen reader there reads a group's own name after what the group holds, as one more thing at the trail's end.

A trail is one line, as tall as the platform's touch target at the least, and as wide as its pages: it starts where the text under it starts. It never wraps. Where the row is too narrow for all of it, the pages after the first fold away, as few of them as it takes, into a button that opens them as a menu: the trail keeps its first page, where it began, and its last ones, where it is. Where the first page and the last do not fit beside that button either, the longest names are cut to one width, and a short one keeps all of its own.

`maxItems` folds a trail that would fit, too: a row never shows more pages than that. A page chosen in the menu is reported as one pressed in the row is.

Parameters:

- `items: List<BreadcrumbItem>`: the trail from its top, ending in the page on screen.
- `onSelect: (key: String) -> Unit`: told the key of a page that is pressed, in the row or in the menu: never the last one's, which is where the app is.
- `modifier: Modifier`: applied to the row.
- `maxItems: Int`: the most pages the row shows, whatever room it has: at least two.
- `textStyle: TextStyle`: the type the pages are set in: the theme's `label` unless given.
- `style: BreadcrumbStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: BreadcrumbColors?`: this call's own colours. Only the ones it sets change; the rest stay the theme's.
- `tagKey: String?`: a locale-independent key for automation: the row's tag is `Breadcrumb_<tagKey>`, and its pages and the button that shows the folded ones are named inside it, `Breadcrumb_<tagKey>.Item_<page's key>` and `Breadcrumb_<tagKey>.More_pages`. The menu is `Menu_<tagKey>_more`, with a row for each folded page.

### BreadcrumbItem

`import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem`, from `com.pantrixui:components`

```kotlin
class BreadcrumbItem(
    public val key: String,
    public val label: String,
    public val icon: ImageVector? = null,
    public val iconOnly: Boolean = false,
    public val tagKey: String? = null
)
```

One page of a `PantrixBreadcrumb`'s trail.

Parameters:

- `key: String`: What the trail's `onSelect` reports when the page is pressed. It is the same in every language, so a translated screen still knows which page was asked for.
- `label: String`: The page's name, as it is written and as a screen reader says it.
- `icon: ImageVector?`: A picture of the page before its name, as a house before the first page of a trail.
- `iconOnly: Boolean`: Whether the page is shown by its `icon` alone. Its `label` is then what a screen reader says of it, and what the menu of folded pages writes beside the icon. A page without an icon is written whatever this says.
- `tagKey: String?`: The page's automation key, the same in every language, where it is to be another than `key`: the page is `Item_<tagKey>`, inside the tag of a trail that has a key, as `Breadcrumb_docs.Item_components`.

### BreadcrumbStyle

`import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle`, from `com.pantrixui:components`

```kotlin
class BreadcrumbStyle(
    public val itemGap: Dp = Dp.Unspecified,
    public val separatorSize: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val linkUnderline: LinkUnderline? = null
) : PantrixStyle<BreadcrumbStyle>
```

`PantrixBreadcrumb`'s geometry: the room between a page and the mark beside it, how large that mark is, and how large a page's own icon is. It is the same on every platform: a trail of pages is a line of text, with 16dp marks and icons 4dp from the words. The room follows the density; the mark and the icon do not.

Parameters:

- `itemGap: Dp`: Between a page's name and the mark that parts it from the next, and between a page's icon and its name.
- `separatorSize: Dp`: The mark between two pages, and the button that stands for the pages a trail has folded.
- `iconSize: Dp`: A page's own icon, before its name or in its place.
- `minHeight: Dp`: The least height of the trail's row: the platform's touch target where it is not set, so that nothing else lies under a touch beside a page. A lower one fits a trail to a line of text over a page's title; a touch beside a page still reaches it, as the theme gives a small target its room for a touch without room in the layout.
- `linkUnderline: LinkUnderline?`: When the pages above the one on screen are underlined: `Always` where it is not set. A trail stands apart from any sentence, and its marks tell its links from the page on screen as well: `LinkUnderline.OnHover` underlines them under a pointer and the keyboard's focus, and always under a finger.

### BreadcrumbColors

`import com.pantrixui.components.navigation.breadcrumb.BreadcrumbColors`, from `com.pantrixui:components`

```kotlin
data class BreadcrumbColors(
    public val link: Color = Color.Unspecified,
    public val current: Color = Color.Unspecified,
    public val separator: Color = Color.Unspecified
)
```

What a `PantrixBreadcrumb` is painted with, for a trail that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

```kotlin
PantrixBreadcrumb(…, colors = BreadcrumbColors(link = PantrixTheme.colors.success.color))
```

A trail has no fill of its own and stands on what is behind it. On a fill, which says what is written on it, all of the trail is written in that: the theme's link, its texts and its marks are colours for the theme's own grounds. A link is told from the page on screen by its underline there.

Parameters:

- `link: Color`: The pages above the one on screen, which are links, and their icons. The primary role's `color`.
- `current: Color`: The page on screen, the trail's last, and its icon. The theme's `textPrimary`.
- `separator: Color`: The marks between two pages, and the button that shows the pages a long trail has folded away. The theme's `textSecondary`.
