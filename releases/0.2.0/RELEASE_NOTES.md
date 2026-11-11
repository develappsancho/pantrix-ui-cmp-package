Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.2.0/RELEASE_NOTES.tr.md)

Pantrix UI 0.2.0, released on 2026-11-11. It is built from the commit `49e787bc38c6`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

0.2.0 adds eight components for an app that works on documents and code: `PantrixCodeEditor`, `PantrixLazyTreeView`, `PantrixKeycaps`, `PantrixGraph`, `PantrixToolbar`, `PantrixStatusBar`, `PantrixDiffView` and `PantrixEmptyState`, 108 in all. Around them come a share sheet, the clipboard's text and a paste a node hears, a theme for previews, a language's folding for a search and its lists, tabs that close and tabs not yet saved, a chosen cell in `PantrixDataTable`, and a page in the middle at the content's width. Two changes break a call: `tagKey` is the last parameter of every component, and a `DataTableColumn` given every argument by position names its last one. On iOS a table's semantics tree is about a third smaller, and a list's page keeps the focus above its bottom bar.

## Packages

| Package | Changed since v0.1.1 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 337 files, 25 commits | 4,497 declarations: 819 added, 63 changed | 8.1 MB, 1.3 MB more |
| `com.pantrixui:foundation` | 54 files, 13 commits | 1,712 declarations: 127 added, 4 changed | 886.0 KB, 60.9 KB more |
| `com.pantrixui:testing` | 18 files, 5 commits | 91 declarations: 21 added | 49.8 KB, 4.5 KB more |
| `com.pantrixui:mcp` | 7 files, 4 commits | not tracked | 6.3 MB, 648.0 KB more |
| `com.pantrixui:detekt-rules` | 7 files, 5 commits | not tracked | 97.7 KB, 8.1 KB more |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
| `com.pantrixui:material3` | none | 21 declarations, none changed | 22.6 KB, unchanged |

A module of the JVM alone keeps no ABI dump, so its public API is not counted.

## Getting the packages

The packages are on GitHub Packages, in the repository they are distributed from, <https://github.com/develappsancho/pantrix-ui-cmp-package>. GitHub asks for a token to read them even there: a classic personal access token that may read packages (`read:packages`), given as the Gradle properties `GitHubPackagesUsername` and `GitHubPackagesPassword`, in `~/.gradle/gradle.properties`. A project's `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/develappsancho/pantrix-ui-cmp-package")
            credentials(PasswordCredentials::class)
        }
        google()
        mavenCentral()
    }
}
```

Built from the library's own repository, `./gradlew clean publishToMavenLocal` puts them in the local Maven repository instead, and a project names it in place of GitHub Packages:

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenLocal()
        google()
        mavenCentral()
    }
}
```

And a module's dependency:

```kotlin
dependencies {
    implementation("com.pantrixui:components:0.2.0")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.2.0-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.2.0/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.2.0-all.jar`, or the same command in a client's `mcpServers` |
| The MCP server that Pantrix UI's site serves at <https://pantrixui.com/mcp>, of the release the site is built with | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp`, or `"type": "http"` and its `"url"` in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.2.0.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill and the server on the site | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Components

`com.pantrixui:components`

### Added

- `CodeTokenKind.Property` and `CodeTokenKind.Tag`, for the name of a member or a setting (a key of a JSON object, an attribute of an XML element) and the name of an element of a markup, with `CodeBlockColors.property` and `CodeBlockColors.tag` to colour them. `PantrixCodeBlock` draws a property in its type's colour and a tag in its keyword's until they are given colours of their own: the languages that have the one seldom have the other.
- `PantrixCodeEditor`, the 101st component: code to be written and changed, of any length, kept a line at a time in a `CodeEditorState` (`rememberCodeEditorState`, changed by the app with `replace`, `setText` and `edit`), coloured by the app's own `CodeHighlighter`, its lines numbered. It has an editor's keys: Tab and Shift+Tab on the selection's lines, a line feed that keeps the indent, an undo a word at a time, moving, copying and deleting lines, comments and the matching bracket; brackets and quotes closed as they are typed, by the language's `CodeSyntax`; marks on lines, which keep their band under the caret, and on stretches of the text (`CodeRangeMark`), underlined or highlighted (`CodeRangeStyle`) over the band of the caret's line, which is drawn only while the editor has the focus; lines brought onto the screen without moving the caret (`CodeEditorState.revealLines`); long lines that go on under themselves, a row at a time, rather than scrolling sideways (`softWrap`); a find and replace bar, and the same on the state (`CodeSearch`, `findNext`, `findAll`, `replaceNext`, `replaceAll`, `CodeFind`); a row of keys over a phone's keyboard (`CodeKey`); and `CodeEditorStyle` and `CodeEditorColors`. A tab is as wide as four spaces on the desktop, on iOS and on the web; in a browser the editor's keys are its own; Android's keyboard is asked for no suggestions of words; and Ctrl+/ is also the key that types "/" on the keyboard's layout, Ctrl+Shift+7 on a Turkish or a German one.
- `CodeMark.bar`, `CodeMark.showBar` and `CodeMark.gutter`, in `PantrixCodeBlock` and `PantrixCodeEditor`: the tone of a marked line's bar where it is not the band's, as for the change a comparison shows, or no bar at all, the band alone, and a sign before the line's number, such as `+`, `−` and `~` for the lines a comparison added, took out and changed. The constructor and the `copy` as they were stay for code compiled against them.
- `PantrixTwoPane`'s `onFirstSizeChange`, which puts a handle in the gap between the panes: a finger, a pointer, the arrow keys and a screen reader make the first pane larger and smaller by it, beside the second or above it, and it reports the size in the kind `firstSize` is given in. Where a fold divides the room there is no handle.
- `PaneHandleColors`, the colours of the bar of the handle between two panes, at rest, under the pointer and in a drag, and in the focus, given to `PantrixTwoPane`, `PantrixListDetailScaffold` and `PantrixSupportingPaneScaffold` as their `handleColors`; a colour left out stays the theme's.
- `DataTableColumn`'s `subtitle`, and `DataTableColumn.text`'s: a second, smaller line under a column's header in the table, what kind of values it holds, which a screen reader reads after the header. The constructor and the function as they were stay for the code built against them.
- `PantrixJsonView`'s `selectedPath`, `onSelect` and `state`, in both overloads: a line where a value starts is selected by a press and by Enter, as a tree's row is chosen, while its chevron and Space fold it; the selected line is filled from side to side (`JsonViewColors.selectedContainer` and `selectedContent`), and Tab comes to it; and `JsonViewState` (`rememberJsonViewState`) brings the line of a path into view the shorter way with `scrollToPath`, opening the way to it. `JsonViewColors`' constructor and `copy` as they were stay for code compiled against them.
- `PantrixGraph`, the 104th component: nodes and the links between them on a ground that is dragged, wheeled and zoomed (`GraphState`, `rememberGraphState`: `zoomIn`, `zoomOut`, `zoomTo`, `fit` and `bringIntoView`), laid out by the graph as a tree, or in layers where a node has two parents, the way `GraphDirection` goes; a link that closes a circle is drawn backwards. Each card is the app's content (`GraphNodeScope`) in a frame the graph draws, composed only while in view where its `GraphNode` has a size; the app holds the chosen card and the open ones, and `expandedToLevel` opens them to a depth. The arrows walk the cards the way the graph goes, and a screen reader hears each card's place and level. With `GraphFoldButton`, `PantrixGraphZoom`, `GraphLink`, `GraphGround`, `GraphLinkShape`, `GraphStyle` and `GraphColors`.
- `PantrixKeycaps`, the 103rd component: the keys of a `PantrixShortcut`, each on a cap of its own, in the order and by the names of the system the app runs on, read once by a screen reader as the system writes the shortcut and standing on the line of the words beside them; in two sizes (`KeycapsSize`), with `KeycapsStyle`, `KeycapSizeStyle` and `KeycapsColors`.
- `PantrixLazyTreeView`, the 102nd component: a tree of many rows that scrolls in a room of its own and composes only the rows in view, with the rows, the choosing, the loading and the filter of `PantrixTreeView`. Its `TreeViewState` (`rememberTreeViewState`) holds where the rows are scrolled to, and `scrollToKey` brings a shown row into view by the shorter way, asked for before the tree is laid out too: it waits for the layout, and a row in view then stays where it is. The keys scroll to the row they reach, and Tab comes to a row in view.
- `TreeNode.styledLabel`, which draws a node's label in styles of its own, the colours of a document's syntax, under what a filter marks, and in the row's own colour on the chosen row and on one that cannot be chosen, its other styles kept and a stretch on a fill of its own in its own colour; `TreeViewStyle.labelRole`, the type the labels are set in, such as the code's; and the `trailing` of `PantrixTreeView` and `PantrixLazyTreeView`, which draws something at each row's end for its node.
- `TreeRowAction` and the `rowAction` of `PantrixTreeView` and `PantrixLazyTreeView`: what a row does besides being chosen, a value's link opened, drawn as an icon button at the row's end, its icon where what ends the other rows ends, and pressed in the platform's touch target around it. A press on it runs it without choosing the row, Shift+Enter runs it on the row that has the focus, and a screen reader is offered it among the row's actions.

- `PantrixFileDrop`'s `actionLabel` and `dragOverLabel`: the zone's own words for the line under its label, the other way in, and for what it says while something is dragged over it, where the theme's are not the app's, as for a zone that takes one file. Neither given, the zone says what it said before.

- `PantrixToolbar`, the 105th component: a row of what a screen or a pane can do, of `ToolbarItem`s (`Button`, `IconButton`, `Menu` and `Divider`) at its `start` and its `end`. Where it has no room, its items give way one at a time, the lowest `priority` first: a button with an icon is drawn as its icon, and then folds into its own "…" menu before the next gives up anything, where each is a row by the same tag, over the `menuItems` the menu always holds (`ToolbarMenuItem`); a folded `Menu` opens its rows in the menu's place. The bar is one stop of Tab, walked by the arrows, Home and End; with `ToolbarStyle` and `ToolbarColors`.
- `PantrixStatusBar`, the 106th component: the short bar at the foot of a window or a pane that says how things stand, in `text`, `button` and the app's own `item` at its `start` and its `end` (`StatusBarScope`). It is 28dp under a pointer and 32dp on a phone and a tablet, and its 24dp buttons are pressed past it up to the platform's touch target rather than made taller, the "…" button drawn wide enough on touch to reach it too; what has no room folds into its "…" menu by `priority`; words given `live` are said when they change. With `StatusBarStyle` and `StatusBarColors`.
- `PantrixDiffView`, the 107th component: two texts compared a line at a time (`diffLines`, Myers' shortest edit), side by side or in one column by the view's width (`DiffLayout`): a line taken out on the danger role's soft fill with a −, one put in on the success role's with a +, and of a line written otherwise the changed words on a stronger share, the lines most alike standing across from each other; unchanged runs past `context` lines fold into a row a press opens; long lines go on under themselves, or both columns scroll sideways together; optional titles with how many lines changed. `DiffViewState` (`rememberDiffViewState`) holds the `changes` (`DiffChange`), brings one into view with `scrollToChange` and bars the one shown, which Alt and the arrows move. A comparison of the app's own is given as `DiffLine`s; long texts are compared away from the main thread; `ignoreWhitespace` compares lines without their spaces. With `DiffViewStyle` and `DiffViewColors`, and `PantrixStrings`' words for what a screen reader is told of it.

- `PantrixEmptyState`, the 108th component: what a place shows while it has nothing to show, a list before its first item, a search that found nothing, a pane that waits for a document: an `icon` in a circle of the neutral fill, a `title`, a `description` in the callout's type and the app's own `action` under them, in the middle of the width it is given and no wider than 360dp of words; the title and the description are read as one. With `EmptyStateStyle` and `EmptyStateColors`.
- `PantrixLazyTreeView(source)` and `TreeSource`, for a tree too large to be given as a list: the tree asks how many children each open branch has and for a node only as its row is about to be shown, so that a branch of a hundred thousand children costs what the rows on the screen do; `TreeSource.indexOf` finds a key it has not shown, for an open branch and `scrollToKey`. It chooses its rows one at a time or not at all, and has no filter.
- `TreeNode.childCount`, how many children a branch whose children are still to come will have: a screen reader is told it of the closed row.
- `PantrixDataTable(selectedCell)` and `DataTableCell`: one chosen cell, by its row's key and its column's, framed in the theme's primary colour as tall as its row, and in the list the record's line of that column, which has the cell's tag `Cell_<row>/<column>`; a screen reader is told that it is the chosen one, and reads it on its own where its row is one button.
- `PageTitlePlacement.Content`: the page's title is a heading in its content at every width and the page has no bar, for a page inside a shell that draws its own; `PantrixPageScaffold(titleStyle, subtitleStyle)` and the same on `PantrixLazyPageScaffold` set that heading's type, a start screen's large title; `PageScaffoldStyle.headingGap` and `subtitleMaxWidth`, the room between that heading's title and its line and how wide the line runs; and `PageWidth.Centered`, a page of the content's width in the middle of the page with its heading.
- `TabItem.onClose` and `PantrixTabs(trailing)`: a tab that closes by a cross at its end, by Delete and by a screen reader's action, and a button right after the last tab, a "+" that opens a new one; `TabItem.unsaved`, a dot in the cross's place that turns into the cross under a pointer and with the focus, told to a screen reader as unsaved.
- `TabsStyle.dividerWidth`: how thick the hairline under the row is, nought for none.
- `PantrixMenu(title)`, a line over the rows in the panel and the sheet's title in a narrow window, which a screen reader hears as the menu's name; and `PantrixMenuItem(trailingText, trailingTextStyle)`, a word or two at a row's end that is written on touch too.
- `PantrixTag(onClick, trailingIcon)`: a tag that says how something stands and opens what changes it, a button with a chevron at its end, which keeps its own height in a tight row and is pressed around it as far as the platform's touch target.
- `CodeMark.actions` and `CodeMarkAction`: one or two buttons under the message a code editor shows, which Ctrl+. or Cmd+. takes the focus to, the note staying while a mouse or the focus is in it; and `CodeMark.description`, what a screen reader is told of a marked line or stretch where nothing on the screen says it, in a code editor and a code block.
- `CodeRangeStyle.Current`: a highlighted stretch with a frame in its tone's colour, the one of several the app is at.
- `contentDescription` on `PantrixSegmentButton`, the group's name, and on `ToolbarItem.Button` and `ToolbarItem.Menu`, what a screen reader calls the button in the bar and in the "…" menu; `ToolbarItem.Button.selected`, the button of the view in effect, drawn in the soft button's fill, told as selected and checked in the "…" menu.

### Changed

- `PantrixCommandPalette` draws its commands' shortcuts with `PantrixKeycaps`: each cap is filled in the theme's `background`, a little wider and a little further from the next.
- **Breaking:** `DataTableColumn(…)` and `DataTableColumn.text(…)` called with every argument by position now name their last one, `cell` or `text`: `subtitle` stands before it. A call that gives it as a trailing lambda or by name is as it was, and so is code built against the library before.
- **Breaking:** `tagKey` is the last parameter of every component, and of `TabItem`, `PantrixCommand` and `AccordionSection`, followed only by the content lambda a component draws: what stood after it now stands right before it, such as `interactionSource`, `controlPosition`, the styles of a component's texts (`textStyle`, `labelStyle`, `headlineStyle`…), `presentation`, the charts' `export` and the settings they took with it, `PantrixMenuItem`'s `selected` and `supportingText`, the settings of `PantrixElasticDatePicker` from `autoRefresh` on, `TabItem.badge`, `PantrixCommand.supportingText` and `AccordionSection.trailing`. A call that names them is as it was; one that gives `tagKey` by position names it, and code built against the library before is built again.
- A screen reader reads each cell of a `PantrixDataTable`, and each line of a record in the list a narrow table becomes, as one node: a line's column name with its value, and what a cell holds to press on its own. A table's semantics tree is about a third smaller, which iOS walks whole at every change while it is read; a test finds a tag given to something inside a cell with `useUnmergedTree = true`.

### Fixed

- A row of `PantrixLazyPageScaffold` that takes the focus is shown above a bar along the bottom: the content is given the list's room, `LazyPageScope.contentPadding`, which each row says with `Modifier.scrollPadding`. The room stood outside the list's own scroll, and the focus went behind the bar. The content's receiver is a `LazyPageScope`, a `LazyListScope`: a call is as it was, and code built for iOS or the web against the library before is built again.
- The handle of a resizable `PantrixListDetailScaffold`, `PantrixSupportingPaneScaffold` and `PantrixTwoPane` leaves a touch on its strip to the pane under it, where the strip is wider than the gap: on a phone a tap at a pane's edge beside the handle reaches the pane, where the handle took it, and a drag along the split still moves the handle, over a pane that scrolls the same way too.
- `PantrixTextField`, `PantrixFilledTextField`, `PantrixAutoResizeTextField`, `PantrixFilledAutoResizeTextField`, `PantrixSecureTextField` and `PantrixFilledSecureTextField` of a `TextFieldState` give a field of one line `ImeAction.Done` where it has an `onKeyboardAction` and names no action, as their overloads bound to a form do: the default action never reached the handler, and Enter called nothing.
- `PantrixBreadcrumb` is cut at its own end where its row gives it less than its marks between two pages, as a row's weighted child can be: it no longer draws over what stands beside it.
- `PantrixCodeBlock` lays a tab out as wide as four spaces on the desktop, on iOS and on the web, where it was as wide as one: code indented with tabs no longer stands flat against the side. Android lays a tab out at its own stops, as before.

- `PantrixCommandPalette`'s search field is named to a screen reader by the words it shows while empty, the theme's "Search commands" or the palette's `placeholder`, where it had no name and the diagnostics reported it as `MissingName`.

### Public API

Changed in `com.pantrixui:components`, so code built against the version before is built again, and a call may change:

- `AccordionSection(…)`
- `CodeBlockColors(…)`
- `CodeBlockColors.copy(…)`
- `PantrixAlert(…)`
- `PantrixAutoResizeTextField(…)`
- `PantrixButton(…)`
- `PantrixCard(…)`
- `PantrixCheckbox(…)`
- `PantrixChip(…)`
- `PantrixCodeBlock(…)`
- `PantrixDataTable(…)`
- `PantrixDateFilledTextField(…)`
- `PantrixDateTextField(…)`
- `PantrixElasticDatePicker(…)`
- `PantrixFileDrop(…)`
- `PantrixFilledAutoResizeTextField(…)`
- `PantrixFilledSecureTextField(…)`
- `PantrixFilledTextArea(…)`
- `PantrixFilledTextField(…)`
- `PantrixFunnelChart(…)`
- `PantrixGanttChart(…)`
- `PantrixGauge(…)`
- `PantrixHeatmap(…)`
- `PantrixIconButton(…)`
- `PantrixJsonView(…)`
- `PantrixLazyPageScaffold(…)`
- `PantrixLink(…)`
- `PantrixListDetailScaffold(…)`
- `PantrixListItem(…)`
- `PantrixMenu(…)`
- `PantrixMenuItem(…)`
- `PantrixMeterGroup(…)`
- `PantrixMultiSelect(…)`
- `PantrixPageScaffold(…)`
- `PantrixPieChart(…)`
- `PantrixPolarChart(…)`
- `PantrixPopover(…)`
- `PantrixProgressCircle(…)`
- `PantrixRadarChart(…)`
- `PantrixRadioButton(…)`
- `PantrixRadioGroup(…)`
- `PantrixSankeyChart(…)`
- `PantrixScatterChart(…)`
- `PantrixSecureTextField(…)`
- `PantrixSegmentButton(…)`
- `PantrixSelect(…)`
- `PantrixSidebar(…)`
- `PantrixSparkline(…)`
- `PantrixStatusTracker(…)`
- `PantrixSupportingPaneScaffold(…)`
- and 13 more

<details>
<summary>819 declarations added to `com.pantrixui:components`</summary>

- `abstract fun button(String, String, Function0<Unit>, ImageVector?, … 9 parameters) in StatusBarScope`
- `abstract fun childAt(TreeNode?, Int): TreeNode in TreeSource`
- `abstract fun childCount(TreeNode?): Int in TreeSource`
- `abstract fun highlight(String, #A): CodeHighlight<#A> in CodeHighlighter`
- `abstract fun item(String, String, Int, String?, Function2<Composer, Int, Unit>) in StatusBarScope`
- `abstract fun text(String, String, Int, Boolean, String?) in StatusBarScope`
- `abstract fun toggle() in GraphNodeScope`
- `abstract interface <#A: Any> CodeHighlighter`
- `abstract interface GraphNodeScope`
- `abstract interface LazyPageScope : LazyListScope`
- `abstract interface StatusBarScope`
- `abstract interface TreeSource`
- `abstract val contentPadding in LazyPageScope`
- `abstract val expanded in GraphNodeScope`
- `abstract val focused in GraphNodeScope`
- `abstract val hasChildren in GraphNodeScope`
- `abstract val initialState in CodeHighlighter`
- `abstract val key in ToolbarItem`
- `abstract val priority in ToolbarItem`
- `abstract val selected in GraphNodeScope`
- `abstract val tagKey in ToolbarItem`
- `constructor(CodeTone, String?, String?, CodeTone?, String?, Boolean, String?, List<CodeMarkAction>) in CodeMark`
- `constructor(Color) in ToolbarColors`
- `constructor(Color, Color, Color) in KeycapsColors`
- `constructor(Color, Color, Color) in PaneHandleColors`
- `constructor(Color, Color, Color, Color) in EmptyStateColors`
- `constructor(Color, Color, Color, Color) in StatusBarColors`
- `constructor(Color, Color, Color, Color, … 11 parameters) in JsonViewColors`
- `constructor(Color, Color, Color, Color, … 19 parameters) in CodeEditorColors`
- `constructor(Color, Color, Color, Color, … 23 parameters) in DiffViewColors`
- `constructor(Color, Color, Color, Color, … 9 parameters) in GraphColors`
- `constructor(DiffKind, String?, String?, Int?, Int?, List<TextRange>, List<TextRange>) in DiffLine`
- `constructor(Dp, Dp) in ToolbarStyle`
- `constructor(Dp, Dp, Dp) in KeycapSizeStyle`
- `constructor(Dp, Dp, Dp) in StatusBarStyle`
- `constructor(Dp, Dp, Dp, Dp, Dp, Dp, Dp) in EmptyStateStyle`
- `constructor(Dp, Dp, Dp, Dp, TopBarStyle?, Dp, Dp) in PageScaffoldStyle`
- `constructor(Dp, Dp, Dp, Dp, … 10 parameters) in TabsStyle`
- `constructor(Float, ClosedFloatingPointRange<Float>) in GraphState`
- `constructor(ImageVector, String, Function0<Unit>) in TreeRowAction`
- `constructor(Int, Int, CodeMark, CodeRangeStyle) in CodeRangeMark`
- `constructor(Int, Int, IntRange, IntRange) in DiffChange`
- `constructor(LazyListState) in DiffViewState`
- `constructor(LazyListState) in JsonViewState`
- `constructor(LazyListState) in TreeViewState`
- `constructor(List<CodeToken>, #A) in CodeHighlight`
- `constructor(ShapeSpec, Dp, Dp, Dp, Dp, Dp, Dp, Dp) in DiffViewStyle`
- `constructor(ShapeSpec, Dp, Dp, Dp, … 14 parameters) in GraphStyle`
- `constructor(ShapeSpec, Dp, Dp, Dp, … 9 parameters) in CodeEditorStyle`
- `constructor(ShapeSpec, Dp, Dp, KeycapSizeStyle, KeycapSizeStyle) in KeycapsStyle`
- and 769 more

</details>

## Foundation

`com.pantrixui:foundation`

### Added

- `PantrixIcons.Image`, a picture in a frame, and `PantrixIcons.ExternalLink`, a link that opens outside the app, which never mirrors in a right-to-left layout.
- `PantrixStrings` has the code editor's words in English, Turkish and Arabic: its find bar's (`replace`, `replaceAll`, `matchCase`, `wholeWord`, `regularExpression`, `previousMatch`, `nextMatch`, `matchPosition`, `matchCount`, `invalidRegularExpression`), its row of keys' (`indent`, `undo`, `redo`, `caretLeft`, `caretRight`, `caretUp`, `caretDown`) and its name's (`codeEditor`, `codeEditorKeys`).
- `Modifier.keepFromBrowser(shortcuts)`, which keeps the browser from acting on the keys a node answers itself while the focus is on it or inside it: on the web, Cmd+F pressed in a text field opens the app's own find, and not the browser's find bar as well. It does nothing on the other platforms.
- `PantrixStrings.paneSize`, the name a keyboard and a screen reader know the handle between two panes by, in English, Turkish and Arabic.
- `PantrixCheck.GraphCycle`, which the diagnostics report where a graph's links run in a circle, and `Modifier.checkGraphCycles`, which tells them of an app's own graph's links that close one.
- `PantrixIcons.FitScreen`, four corners round a frame, for showing all of something at once, which never mirrors; and `PantrixStrings.fitToView`, its button's name, and `PantrixStrings.itemPosition`, where an item stands among those beside it as a screen reader says it, in English, Turkish and Arabic.
- `PantrixClipboard.readText()`, which reads the plain text on the clipboard, or gives `null` where it holds none or may not be read, and `ClipboardTraits.readable`, which says whether there is a clipboard to read from: a browser gives one only to a page in a secure context that has `navigator.clipboard.read`, and a headless JVM has none.
- `Modifier.onPaste`, which hears the reader's paste, Cmd+V or Ctrl+V, while the focus is on its node or inside it and no text field there takes it. On the web it hears the browser's own paste, which hands the text over without asking the reader, and a paste from the browser's menus too, with no key: the innermost node the focus is in has it, or the outermost one under a window's root that holds the focus itself; on iOS it leaves the key to UIKit while one of its text inputs has the focus.
- `PantrixPreviewTheme`, the theme a preview draws a screen in: on the platform, in the dark or the light, in the window and at the moment it is given, whatever the machine, with the app's own theme inside it keeping them, so that a preview in `commonMain` shows a state as a screenshot test of it in `PantrixTestTheme` does.

- `PantrixIcons.ChevronUp`, `Code`, `Settings`, `Sun`, `Moon`, `Clipboard`, `History`, `Delete` and `Share`, for an app's own screens: a search's previous match, what is written in a language, its settings, a light and a dark appearance, a paste, what was opened before, throwing away and sending elsewhere. None mirrors in a right-to-left layout.

- `Modifier.checkTouchTarget(min, beyond)`, which tells the diagnostics the room a control is pressed in where its press reaches past what it draws, and reports a `PantrixCheck.SmallTouchTarget` where that is less than the target; and `PantrixStrings.statusBar`, what a screen reader calls a status bar, in English, Turkish and Arabic.

- `PantrixTheme.isDark`, whether the nearest theme is dark, for an app's theme that chooses its own colours by it.
- `PantrixLocale.fold(text)` and `PantrixLocale.contains(text, part)`: a text in this language's small letters, the dotted and the dotless I as Turkish and Azerbaijani have them, as long as the text, and a search by them.
- `PantrixStrings.fullDate(day, month, year)`, a date with its month's name and no day of the week (`fullDateTemplate`), and `PantrixStrings.list(items, conjunction)`, names joined in a sentence by the language's "and" or, with `ListConjunction.Or`, its "or" (`listPairTemplate`, `listSeparator`, `listEndTemplate`, `listOrPairTemplate`, `listOrEndTemplate`), and `PantrixStrings.listWithMore(items, more)`, the names that are not said counted at the end (`othersTemplate`), in English, Turkish and Arabic; `PantrixStrings.unsaved`, what a screen reader hears of an unsaved tab.
- `ShareSheet`, `rememberShareSheet()`, `LocalShareSheet` and `ShareResult`: the platform's sheet for sending a text or a link to another app, Android's chooser, iOS's `UIActivityViewController` and a browser's `navigator.share`, or null on the desktop and in a browser without one.

### Changed

- On the web, `Modifier.onShortcut` keeps its shortcut from the browser while it is enabled and the focus is inside its node: a shortcut pressed in a text field no longer does what the browser does with the key as well.

### Fixed

- `systemPantrixLocale()` on iOS gives the language the iPhone prefers first, and its region setting: an app whose bundle declares no languages, as one whose words are in Kotlin, was given its development language there, English on a Turkish iPhone.
- The diagnostics report a blank name (`PantrixCheck.MissingName`, and `Modifier.checkName`) once it has stayed blank for a second and a half, as a tag two nodes carry: a name that comes a moment late, as an app's own words read from its resources do in a browser, is no longer reported while they load.

### Public API

Changed in `com.pantrixui:foundation`, so code built against the version before is built again, and a call may change:

- `ClipboardTraits(…)`
- `ClipboardTraits.copy(…)`
- `PantrixStrings(…)`
- `PantrixStrings.copy(…)`

<details>
<summary>127 declarations added to `com.pantrixui:foundation`</summary>

- `abstract fun interface ShareSheet`
- `abstract fun share(String, String?, Function1<ShareResult, Unit>) in ShareSheet`
- `enum entry And in ListConjunction`
- `enum entry Cancelled in ShareResult`
- `enum entry Failed in ShareResult`
- `enum entry GraphCycle in PantrixCheck`
- `enum entry Or in ListConjunction`
- `enum entry Shared in ShareResult`
- `enum entry Started in ShareResult`
- `final enum class ListConjunction : Enum<ListConjunction>`
- `final enum class ShareResult : Enum<ShareResult>`
- `final fun (Modifier).checkGraphCycles(String, List<String>): Modifier`
- `final fun (Modifier).checkTouchTarget(Dp, DpSize): Modifier`
- `final fun (Modifier).keepFromBrowser(List<PantrixShortcut>): Modifier`
- `final fun (Modifier).onPaste(Boolean, Function1<String, Unit>): Modifier`
- `final fun PantrixPreviewTheme(PlatformType?, Boolean, PantrixWindow?, PantrixClock?, Function2<Composer, Int, Unit>)`
- `final fun codeEditorKeys(String): String in PantrixStrings`
- `final fun component187(): String in PantrixStrings`
- `final fun component188(): String in PantrixStrings`
- `final fun component189(): String in PantrixStrings`
- `final fun component190(): String in PantrixStrings`
- `final fun component191(): String in PantrixStrings`
- `final fun component192(): String in PantrixStrings`
- `final fun component193(): String in PantrixStrings`
- `final fun component194(): String in PantrixStrings`
- `final fun component195(): String in PantrixStrings`
- `final fun component196(): String in PantrixStrings`
- `final fun component197(): String in PantrixStrings`
- `final fun component198(): String in PantrixStrings`
- `final fun component199(): String in PantrixStrings`
- `final fun component200(): String in PantrixStrings`
- `final fun component201(): String in PantrixStrings`
- `final fun component202(): String in PantrixStrings`
- `final fun component203(): String in PantrixStrings`
- `final fun component204(): String in PantrixStrings`
- `final fun component205(): String in PantrixStrings`
- `final fun component206(): String in PantrixStrings`
- `final fun component207(): String in PantrixStrings`
- `final fun component208(): String in PantrixStrings`
- `final fun component209(): String in PantrixStrings`
- `final fun component210(): String in PantrixStrings`
- `final fun component211(): String in PantrixStrings`
- `final fun component212(): String in PantrixStrings`
- `final fun component213(): String in PantrixStrings`
- `final fun component214(): String in PantrixStrings`
- `final fun component215(): String in PantrixStrings`
- `final fun component216(): String in PantrixStrings`
- `final fun component217(): String in PantrixStrings`
- `final fun component218(): String in PantrixStrings`
- `final fun component219(): String in PantrixStrings`
- and 77 more

</details>

## Testing

`com.pantrixui:testing`

### Added

- `TestClipboard.putText(text)`, which puts a text on the test's clipboard as another app's copy would, for the screen to read with `readText()` or, away from the web, to paste with Cmd+V or Ctrl+V.
- `SemanticsNodeInteraction.performPaste(text, clipboard, system)`, which pastes a text on a node by the paste key, so that `Modifier.onPaste` hears it on every platform: on the web it also sends the page the browser's paste.

- `TestShareSheet` and `SharedText`: a share sheet of the test's own, which keeps every text it is given and answers what the test says; `PantrixTestTheme` gives the screen one, so that no system sheet opens.

### Fixed

- `PantrixTestTheme` given a `window` stands over the whole room the test draws in: a `PantrixDialog` or a `PantrixSheet` drawn alone in it, over a screen of no size, is drawn whole and its buttons can be pressed, where it was measured as nothing.

### Public API

<details>
<summary>21 declarations added to `com.pantrixui:testing`</summary>

- `constructor(ShareResult) in TestShareSheet`
- `constructor(String, String?) in SharedText`
- `final class SharedText`
- `final class TestShareSheet : ShareSheet`
- `final fun (SemanticsNodeInteraction).performPaste(String, TestClipboard, OperatingSystem): SemanticsNodeInteraction`
- `final fun com_pantrixui_testing_SharedText$stableprop_getter(): Int`
- `final fun com_pantrixui_testing_TestShareSheet$stableprop_getter(): Int`
- `final fun component1(): String in SharedText`
- `final fun component2(): String? in SharedText`
- `final fun copy(String, String?): SharedText in SharedText`
- `final fun equals(Any?): Boolean in SharedText`
- `final fun hashCode(): Int in SharedText`
- `final fun putText(String) in TestClipboard`
- `final fun share(String, String?, Function1<ShareResult, Unit>) in TestShareSheet`
- `final fun toString(): String in SharedText`
- `final val com_pantrixui_testing_SharedText$stableprop`
- `final val com_pantrixui_testing_TestShareSheet$stableprop`
- `final val shared in TestShareSheet`
- `final val text in SharedText`
- `final val title in SharedText`
- `final var result in TestShareSheet`

</details>

## Tooling

`com.pantrixui:mcp`

### Added

- The MCP server says which build it is: its version as `initialize` gives it carries the commit it was built from and when its jar was written (`0.1.2-SNAPSHOT+7f42363d.20261110T1231Z`), and `get_changelog` starts by saying so. While the jar it was started from is newer on disk, every answer ends with a note that a new session is answered by the newer one: an assistant keeps the server it started for the whole of a session.

## Other packages

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.
