# Changelog

Türkçesi: [CHANGELOG.tr.md](./CHANGELOG.tr.md)

What changed in Pantrix UI, for someone who uses the library.

- **Format:** this file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the versions follow
  [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- **Breaking changes:** until 1.0.0, a minor version may break the API. A change that does is marked **Breaking**.
- **What gets a line:** [CONTRIBUTING.md](./CONTRIBUTING.md#the-changelog) says which changes get one, and how it is
  written.

## [0.2.1] - 2026-11-11

0.2.1 fixes two things found after 0.2.0. A mouse that drags the scroll thumb of a long list far puts the list
straight there: a document of fifty thousand lines in `PantrixCodeEditor` stalled at every step of such a drag, as
did any long list behind Pantrix's scroll bar. And the documents for coding assistants carry the whole code of the
code editor's examples, seven of which stopped at the first line of a helper written as a raw string. The public API
is unchanged.

### Fixed

#### Components

`com.pantrixui:components`

- A mouse that drags the scroll bar's thumb of a long list farther than a screen puts the list straight there, in
  `PantrixCodeEditor`, `PantrixCodeBlock`, `PantrixJsonView`, `PantrixLazyTreeView`, `PantrixDiffView`,
  `PantrixDataTable` and a `LazyColumn` given `Modifier.pantrixScrollBar`: the list was scrolled by pixels and built
  every row it passed, and the drag of a document of fifty thousand lines stalled for most of a second a step.

#### Tooling

`com.pantrixui:mcp`

- The MCP server's documents, and `llms-full.txt` and `pantrix-ui.json` beside the web demo, carry the whole code of
  an example whose helper is a raw string closed in the first column: seven examples of `PantrixCodeEditor` stopped
  at the helper's first line, `private val TASKS = """`, and did not compile.

## [0.2.0] - 2026-11-11

0.2.0 adds eight components for an app that works on documents and code: `PantrixCodeEditor`, `PantrixLazyTreeView`,
`PantrixKeycaps`, `PantrixGraph`, `PantrixToolbar`, `PantrixStatusBar`, `PantrixDiffView` and `PantrixEmptyState`, 108
in all. Around them come a share sheet, the clipboard's text and a paste a node hears, a theme for previews, a
language's folding for a search and its lists, tabs that close and tabs not yet saved, a chosen cell in
`PantrixDataTable`, and a page in the middle at the content's width. Two changes break a call: `tagKey` is the last
parameter of every component, and a `DataTableColumn` given every argument by position names its last one. On iOS a
table's semantics tree is about a third smaller, and a list's page keeps the focus above its bottom bar.

### Added

#### Components

`com.pantrixui:components`

- `CodeTokenKind.Property` and `CodeTokenKind.Tag`, for the name of a member or a setting (a key of a JSON object, an
  attribute of an XML element) and the name of an element of a markup, with `CodeBlockColors.property` and
  `CodeBlockColors.tag` to colour them. `PantrixCodeBlock` draws a property in its type's colour and a tag in its
  keyword's until they are given colours of their own: the languages that have the one seldom have the other.
- `PantrixCodeEditor`, the 101st component: code to be written and changed, of any length, kept a line at a time in
  a `CodeEditorState` (`rememberCodeEditorState`, changed by the app with `replace`, `setText` and `edit`), coloured by
  the app's own `CodeHighlighter`, its lines numbered. It has an editor's keys: Tab and Shift+Tab on the selection's
  lines, a line feed that keeps the indent, an undo a word at a time, moving, copying and deleting lines, comments and
  the matching bracket; brackets and quotes closed as they are typed, by the language's `CodeSyntax`; marks on lines,
  which keep their band under the caret, and on stretches of the text (`CodeRangeMark`), underlined or highlighted
  (`CodeRangeStyle`) over the band of the caret's line, which is drawn only while the editor has the focus; lines brought onto the screen without moving the caret (`CodeEditorState.revealLines`); long
  lines that go on under themselves, a row at a time, rather than scrolling sideways (`softWrap`); a find and replace
  bar, and the same on the state (`CodeSearch`, `findNext`, `findAll`, `replaceNext`, `replaceAll`, `CodeFind`); a
  row of keys over a phone's keyboard (`CodeKey`); and `CodeEditorStyle` and `CodeEditorColors`. A tab is as wide as
  four spaces on the desktop, on iOS and on the web; in a browser the editor's keys are its own; Android's keyboard is
  asked for no suggestions of words; and Ctrl+/ is also the key that types "/" on the keyboard's layout, Ctrl+Shift+7
  on a Turkish or a German one.
- `CodeMark.bar`, `CodeMark.showBar` and `CodeMark.gutter`, in `PantrixCodeBlock` and `PantrixCodeEditor`: the tone
  of a marked line's bar where it is not the band's, as for the change a comparison shows, or no bar at all, the band
  alone, and a sign before the line's number, such as `+`, `−` and `~` for the lines a comparison added, took out and
  changed. The constructor and the `copy` as they were stay for code compiled against them.
- `PantrixTwoPane`'s `onFirstSizeChange`, which puts a handle in the gap between the panes: a finger, a pointer, the
  arrow keys and a screen reader make the first pane larger and smaller by it, beside the second or above it, and it
  reports the size in the kind `firstSize` is given in. Where a fold divides the room there is no handle.
- `PaneHandleColors`, the colours of the bar of the handle between two panes, at rest, under the pointer and in a
  drag, and in the focus, given to `PantrixTwoPane`, `PantrixListDetailScaffold` and `PantrixSupportingPaneScaffold`
  as their `handleColors`; a colour left out stays the theme's.
- `DataTableColumn`'s `subtitle`, and `DataTableColumn.text`'s: a second, smaller line under a column's header in
  the table, what kind of values it holds, which a screen reader reads after the header. The constructor and the
  function as they were stay for the code built against them.
- `PantrixJsonView`'s `selectedPath`, `onSelect` and `state`, in both overloads: a line where a value starts is
  selected by a press and by Enter, as a tree's row is chosen, while its chevron and Space fold it; the selected line
  is filled from side to side (`JsonViewColors.selectedContainer` and `selectedContent`), and Tab comes to it; and
  `JsonViewState` (`rememberJsonViewState`) brings the line of a path into view the shorter way with `scrollToPath`,
  opening the way to it. `JsonViewColors`' constructor and `copy` as they were stay for code compiled against them.
- `PantrixGraph`, the 104th component: nodes and the links between them on a ground that is dragged, wheeled and
  zoomed (`GraphState`, `rememberGraphState`: `zoomIn`, `zoomOut`, `zoomTo`, `fit` and `bringIntoView`), laid out by
  the graph as a tree, or in layers where a node has two parents, the way `GraphDirection` goes; a link that closes a
  circle is drawn backwards. Each card is the app's content (`GraphNodeScope`) in a frame the graph draws, composed
  only while in view where its `GraphNode` has a size; the app holds the chosen card and the open ones, and
  `expandedToLevel` opens them to a depth. The arrows walk the cards the way the graph goes, and a screen reader hears
  each card's place and level. With `GraphFoldButton`, `PantrixGraphZoom`, `GraphLink`, `GraphGround`,
  `GraphLinkShape`, `GraphStyle` and `GraphColors`.
- `PantrixKeycaps`, the 103rd component: the keys of a `PantrixShortcut`, each on a cap of its own, in the order and
  by the names of the system the app runs on, read once by a screen reader as the system writes the shortcut and
  standing on the line of the words beside them; in two sizes (`KeycapsSize`), with `KeycapsStyle`,
  `KeycapSizeStyle` and `KeycapsColors`.
- `PantrixLazyTreeView`, the 102nd component: a tree of many rows that scrolls in a room of its own and composes only
  the rows in view, with the rows, the choosing, the loading and the filter of `PantrixTreeView`. Its
  `TreeViewState` (`rememberTreeViewState`) holds where the rows are scrolled to, and `scrollToKey` brings a shown row
  into view by the shorter way, asked for before the tree is laid out too: it waits for the layout, and a row in view
  then stays where it is. The keys scroll to the row they reach, and Tab comes to a row in view.
- `TreeNode.styledLabel`, which draws a node's label in styles of its own, the colours of a document's syntax, under
  what a filter marks, and in the row's own colour on the chosen row and on one that cannot be chosen, its other
  styles kept and a stretch on a fill of its own in its own colour; `TreeViewStyle.labelRole`, the type the labels are set in, such as the code's; and the
  `trailing` of `PantrixTreeView` and `PantrixLazyTreeView`, which draws something at each row's end for its node.
- `TreeRowAction` and the `rowAction` of `PantrixTreeView` and `PantrixLazyTreeView`: what a row does besides being
  chosen, a value's link opened, drawn as an icon button at the row's end, its icon where what ends the other rows
  ends, and pressed in the platform's touch target around it. A press on it runs it without choosing the row, Shift+Enter runs it on the row that has the focus, and a screen reader is offered it among the row's actions.

- `PantrixFileDrop`'s `actionLabel` and `dragOverLabel`: the zone's own words for the line under its label, the other
  way in, and for what it says while something is dragged over it, where the theme's are not the app's, as for a zone
  that takes one file. Neither given, the zone says what it said before.

- `PantrixToolbar`, the 105th component: a row of what a screen or a pane can do, of `ToolbarItem`s (`Button`,
  `IconButton`, `Menu` and `Divider`) at its `start` and its `end`. Where it has no room, its items give way one at a
  time, the lowest `priority` first: a button with an icon is drawn as its icon, and then folds into its own "…" menu
  before the next gives up anything, where each is a row by the same tag, over the `menuItems` the menu always holds (`ToolbarMenuItem`); a folded
  `Menu` opens its rows in the menu's place. The bar is one stop of Tab, walked by the arrows, Home and End; with
  `ToolbarStyle` and `ToolbarColors`.
- `PantrixStatusBar`, the 106th component: the short bar at the foot of a window or a pane that says how things stand,
  in `text`, `button` and the app's own `item` at its `start` and its `end` (`StatusBarScope`). It is 28dp under a
  pointer and 32dp on a phone and a tablet, and its 24dp buttons are pressed past it up to the platform's touch target
  rather than made taller, the "…" button drawn wide enough on touch to reach it too; what has no room folds into its
  "…" menu by `priority`; words given `live` are said when they change. With `StatusBarStyle` and `StatusBarColors`.
- `PantrixDiffView`, the 107th component: two texts compared a line at a time (`diffLines`, Myers' shortest edit),
  side by side or in one column by the view's width (`DiffLayout`): a line taken out on the danger role's soft fill
  with a −, one put in on the success role's with a +, and of a line written otherwise the changed words on a stronger
  share, the lines most alike standing across from each other; unchanged runs past `context` lines fold into a row a
  press opens; long lines go on under themselves, or both columns scroll sideways together; optional titles with how
  many lines changed. `DiffViewState` (`rememberDiffViewState`) holds the `changes` (`DiffChange`), brings one into
  view with `scrollToChange` and bars the one shown, which Alt and the arrows move. A comparison of the app's own is
  given as `DiffLine`s; long texts are compared away from the main thread; `ignoreWhitespace` compares lines without
  their spaces. With `DiffViewStyle` and `DiffViewColors`, and `PantrixStrings`' words for what a screen reader is
  told of it.

- `PantrixEmptyState`, the 108th component: what a place shows while it has nothing to show, a list before its first
  item, a search that found nothing, a pane that waits for a document: an `icon` in a circle of the neutral fill, a
  `title`, a `description` in the callout's type and the app's own `action` under them, in the middle of the width it
  is given and no wider than 360dp of words; the title and the description are read as one. With `EmptyStateStyle`
  and `EmptyStateColors`.
- `PantrixLazyTreeView(source)` and `TreeSource`, for a tree too large to be given as a list: the tree asks how many
  children each open branch has and for a node only as its row is about to be shown, so that a branch of a hundred
  thousand children costs what the rows on the screen do; `TreeSource.indexOf` finds a key it has not shown, for an
  open branch and `scrollToKey`. It chooses its rows one at a time or not at all, and has no filter.
- `TreeNode.childCount`, how many children a branch whose children are still to come will have: a screen reader is
  told it of the closed row.
- `PantrixDataTable(selectedCell)` and `DataTableCell`: one chosen cell, by its row's key and its column's, framed in the
  theme's primary colour as tall as its row, and in the list the record's line of that column, which has the cell's tag
  `Cell_<row>/<column>`; a screen reader is told that it is the chosen one, and reads it on its own where its row is
  one button.
- `PageTitlePlacement.Content`: the page's title is a heading in its content at every width and the page has no bar,
  for a page inside a shell that draws its own; `PantrixPageScaffold(titleStyle, subtitleStyle)` and the same on
  `PantrixLazyPageScaffold` set that heading's type, a start screen's large title; `PageScaffoldStyle.headingGap` and
  `subtitleMaxWidth`, the room between that heading's title and its line and how wide the line runs; and
  `PageWidth.Centered`, a page of the content's width in the middle of the page with its heading.
- `TabItem.onClose` and `PantrixTabs(trailing)`: a tab that closes by a cross at its end, by Delete and by a screen
  reader's action, and a button right after the last tab, a "+" that opens a new one; `TabItem.unsaved`, a dot in the
  cross's place that turns into the cross under a pointer and with the focus, told to a screen reader as unsaved.
- `TabsStyle.dividerWidth`: how thick the hairline under the row is, nought for none.
- `PantrixMenu(title)`, a line over the rows in the panel and the sheet's title in a narrow window, which a screen
  reader hears as the menu's name; and `PantrixMenuItem(trailingText, trailingTextStyle)`, a word or two at a row's
  end that is written on touch too.
- `PantrixTag(onClick, trailingIcon)`: a tag that says how something stands and opens what changes it, a button with a
  chevron at its end, which keeps its own height in a tight row and is pressed around it as far as the platform's
  touch target.
- `CodeMark.actions` and `CodeMarkAction`: one or two buttons under the message a code editor shows, which Ctrl+. or
  Cmd+. takes the focus to, the note staying while a mouse or the focus is in it; and `CodeMark.description`, what a
  screen reader is told of a marked line or stretch where nothing on the screen says it, in a code editor and a code
  block.
- `CodeRangeStyle.Current`: a highlighted stretch with a frame in its tone's colour, the one of several the app is at.
- `contentDescription` on `PantrixSegmentButton`, the group's name, and on `ToolbarItem.Button` and `ToolbarItem.Menu`,
  what a screen reader calls the button in the bar and in the "…" menu; `ToolbarItem.Button.selected`, the button of
  the view in effect, drawn in the soft button's fill, told as selected and checked in the "…" menu.

#### Foundation

`com.pantrixui:foundation`

- `PantrixIcons.Image`, a picture in a frame, and `PantrixIcons.ExternalLink`, a link that opens outside the app,
  which never mirrors in a right-to-left layout.
- `PantrixStrings` has the code editor's words in English, Turkish and Arabic: its find bar's (`replace`,
  `replaceAll`, `matchCase`, `wholeWord`, `regularExpression`, `previousMatch`, `nextMatch`, `matchPosition`,
  `matchCount`, `invalidRegularExpression`), its row of keys' (`indent`, `undo`, `redo`, `caretLeft`, `caretRight`,
  `caretUp`, `caretDown`) and its name's (`codeEditor`, `codeEditorKeys`).
- `Modifier.keepFromBrowser(shortcuts)`, which keeps the browser from acting on the keys a node answers itself while
  the focus is on it or inside it: on the web, Cmd+F pressed in a text field opens the app's own find, and not the
  browser's find bar as well. It does nothing on the other platforms.
- `PantrixStrings.paneSize`, the name a keyboard and a screen reader know the handle between two panes by, in
  English, Turkish and Arabic.
- `PantrixCheck.GraphCycle`, which the diagnostics report where a graph's links run in a circle, and
  `Modifier.checkGraphCycles`, which tells them of an app's own graph's links that close one.
- `PantrixIcons.FitScreen`, four corners round a frame, for showing all of something at once, which never mirrors;
  and `PantrixStrings.fitToView`, its button's name, and `PantrixStrings.itemPosition`, where an item stands among
  those beside it as a screen reader says it, in English, Turkish and Arabic.
- `PantrixClipboard.readText()`, which reads the plain text on the clipboard, or gives `null` where it holds none or
  may not be read, and `ClipboardTraits.readable`, which says whether there is a clipboard to read from: a browser
  gives one only to a page in a secure context that has `navigator.clipboard.read`, and a headless JVM has none.
- `Modifier.onPaste`, which hears the reader's paste, Cmd+V or Ctrl+V, while the focus is on its node or inside it
  and no text field there takes it. On the web it hears the browser's own paste, which hands the text over without
  asking the reader, and a paste from the browser's menus too, with no key: the innermost node the focus is in has
  it, or the outermost one under a window's root that holds the focus itself; on iOS it leaves the key to UIKit while
  one of its text inputs has the focus.
- `PantrixPreviewTheme`, the theme a preview draws a screen in: on the platform, in the dark or the light, in the
  window and at the moment it is given, whatever the machine, with the app's own theme inside it keeping them, so that
  a preview in `commonMain` shows a state as a screenshot test of it in `PantrixTestTheme` does.

- `PantrixIcons.ChevronUp`, `Code`, `Settings`, `Sun`, `Moon`, `Clipboard`, `History`, `Delete` and `Share`, for an
  app's own screens: a search's previous match, what is written in a language, its settings, a light and a dark
  appearance, a paste, what was opened before, throwing away and sending elsewhere. None mirrors in a right-to-left
  layout.

- `Modifier.checkTouchTarget(min, beyond)`, which tells the diagnostics the room a control is pressed in where its
  press reaches past what it draws, and reports a `PantrixCheck.SmallTouchTarget` where that is less than the target;
  and `PantrixStrings.statusBar`, what a screen reader calls a status bar, in English, Turkish and Arabic.

- `PantrixTheme.isDark`, whether the nearest theme is dark, for an app's theme that chooses its own colours by it.
- `PantrixLocale.fold(text)` and `PantrixLocale.contains(text, part)`: a text in this language's small letters, the
  dotted and the dotless I as Turkish and Azerbaijani have them, as long as the text, and a search by them.
- `PantrixStrings.fullDate(day, month, year)`, a date with its month's name and no day of the week
  (`fullDateTemplate`), and `PantrixStrings.list(items, conjunction)`, names joined in a sentence by the language's
  "and" or, with `ListConjunction.Or`, its "or" (`listPairTemplate`, `listSeparator`, `listEndTemplate`,
  `listOrPairTemplate`, `listOrEndTemplate`), and `PantrixStrings.listWithMore(items, more)`, the names that are not
  said counted at the end (`othersTemplate`), in English, Turkish and Arabic; `PantrixStrings.unsaved`, what a screen
  reader hears of an unsaved tab.
- `ShareSheet`, `rememberShareSheet()`, `LocalShareSheet` and `ShareResult`: the platform's sheet for sending a text or
  a link to another app, Android's chooser, iOS's `UIActivityViewController` and a browser's `navigator.share`, or
  null on the desktop and in a browser without one.

#### Testing

`com.pantrixui:testing`

- `TestClipboard.putText(text)`, which puts a text on the test's clipboard as another app's copy would, for the
  screen to read with `readText()` or, away from the web, to paste with Cmd+V or Ctrl+V.
- `SemanticsNodeInteraction.performPaste(text, clipboard, system)`, which pastes a text on a node by the paste key, so
  that `Modifier.onPaste` hears it on every platform: on the web it also sends the page the browser's paste.

- `TestShareSheet` and `SharedText`: a share sheet of the test's own, which keeps every text it is given and answers
  what the test says; `PantrixTestTheme` gives the screen one, so that no system sheet opens.

#### Tooling

`com.pantrixui:mcp`

- The MCP server says which build it is: its version as `initialize` gives it carries the commit it was built from
  and when its jar was written (`0.1.2-SNAPSHOT+7f42363d.20261110T1231Z`), and `get_changelog` starts by saying so.
  While the jar it was started from is newer on disk, every answer ends with a note that a new session is answered by
  the newer one: an assistant keeps the server it started for the whole of a session.

### Changed

#### Components

`com.pantrixui:components`

- `PantrixCommandPalette` draws its commands' shortcuts with `PantrixKeycaps`: each cap is filled in the theme's
  `background`, a little wider and a little further from the next.
- **Breaking:** `DataTableColumn(…)` and `DataTableColumn.text(…)` called with every argument by position now name
  their last one, `cell` or `text`: `subtitle` stands before it. A call that gives it as a trailing lambda or by name
  is as it was, and so is code built against the library before.
- **Breaking:** `tagKey` is the last parameter of every component, and of `TabItem`, `PantrixCommand` and
  `AccordionSection`, followed only by the content lambda a component draws: what stood after it now stands right
  before it, such as `interactionSource`, `controlPosition`, the styles of a component's texts (`textStyle`,
  `labelStyle`, `headlineStyle`…), `presentation`, the charts' `export` and the settings they took with it,
  `PantrixMenuItem`'s `selected` and `supportingText`, the settings of `PantrixElasticDatePicker` from `autoRefresh`
  on, `TabItem.badge`, `PantrixCommand.supportingText` and `AccordionSection.trailing`. A call that names them is as it
  was; one that gives `tagKey` by position names it, and code built against the library before is built again.
- A screen reader reads each cell of a `PantrixDataTable`, and each line of a record in the list a narrow table
  becomes, as one node: a line's column name with its value, and what a cell holds to press on its own. A table's
  semantics tree is about a third smaller, which iOS walks whole at every change while it is read; a test finds a tag
  given to something inside a cell with `useUnmergedTree = true`.

#### Foundation

`com.pantrixui:foundation`

- On the web, `Modifier.onShortcut` keeps its shortcut from the browser while it is enabled and the focus is inside
  its node: a shortcut pressed in a text field no longer does what the browser does with the key as well.

### Fixed

#### Components

`com.pantrixui:components`

- A row of `PantrixLazyPageScaffold` that takes the focus is shown above a bar along the bottom: the content is given
  the list's room, `LazyPageScope.contentPadding`, which each row says with `Modifier.scrollPadding`. The room stood
  outside the list's own scroll, and the focus went behind the bar. The content's receiver is a `LazyPageScope`, a
  `LazyListScope`: a call is as it was, and code built for iOS or the web against the library before is built again.
- The handle of a resizable `PantrixListDetailScaffold`, `PantrixSupportingPaneScaffold` and `PantrixTwoPane` leaves a
  touch on its strip to the pane under it, where the strip is wider than the gap: on a phone a tap at a pane's edge
  beside the handle reaches the pane, where the handle took it, and a drag along the split still moves the handle,
  over a pane that scrolls the same way too.
- `PantrixTextField`, `PantrixFilledTextField`, `PantrixAutoResizeTextField`, `PantrixFilledAutoResizeTextField`,
  `PantrixSecureTextField` and `PantrixFilledSecureTextField` of a `TextFieldState` give a field of one line
  `ImeAction.Done` where it has an `onKeyboardAction` and names no action, as their overloads bound to a form do:
  the default action never reached the handler, and Enter called nothing.
- `PantrixBreadcrumb` is cut at its own end where its row gives it less than its marks between two pages, as a row's
  weighted child can be: it no longer draws over what stands beside it.
- `PantrixCodeBlock` lays a tab out as wide as four spaces on the desktop, on iOS and on the web, where it was as wide
  as one: code indented with tabs no longer stands flat against the side. Android lays a tab out at its own stops, as
  before.

- `PantrixCommandPalette`'s search field is named to a screen reader by the words it shows while empty, the theme's
  "Search commands" or the palette's `placeholder`, where it had no name and the diagnostics reported it as
  `MissingName`.

#### Foundation

`com.pantrixui:foundation`

- `systemPantrixLocale()` on iOS gives the language the iPhone prefers first, and its region setting: an app whose
  bundle declares no languages, as one whose words are in Kotlin, was given its development language there, English
  on a Turkish iPhone.
- The diagnostics report a blank name (`PantrixCheck.MissingName`, and `Modifier.checkName`) once it has stayed blank
  for a second and a half, as a tag two nodes carry: a name that comes a moment late, as an app's own words read from
  its resources do in a browser, is no longer reported while they load.

#### Testing

`com.pantrixui:testing`

- `PantrixTestTheme` given a `window` stands over the whole room the test draws in: a `PantrixDialog` or a
  `PantrixSheet` drawn alone in it, over a screen of no size, is drawn whole and its buttons can be pressed, where it
  was measured as nothing.

## [0.1.1] - 2026-11-02

0.1.1 fixes what was found after 0.1.0: the iOS klibs no longer bind UIKit's classes, one of which kept the shared iOS
code from being commonized with Xcode 27.2; on the web the page's `<html lang>` says the language of the app's
outermost theme; and the klibs name their source files relative to the repository's root, where they carried the
paths of the machine that built them into an app. The public API is unchanged. A new part of the web compatibility
guide says why Safari 27.2 leaves a Wasm build of Compose blank, and how a page's loader gives WebKit the JavaScript
build instead.

### Fixed

#### Foundation

`com.pantrixui:foundation`

- The iOS klibs hold no classes of UIKit's, such as `UIHinge`, in `com.pantrixui.foundation.adaptive.uikit`: that
  package binds the library's own reading of the fold and the vertical bar alone. It bound each class of UIKit that
  Kotlin/Native's bindings lack as well, and with Xcode 27.2 one of them named a type they lack, so the shared iOS code
  could not be commonized.
- On the web the outermost `PantrixTheme` writes its `locale`'s language into the page's `<html lang>`, and follows it
  as the app changes its language: a screen reader read the page in the language the page was opened in, and the
  browser offered to translate from it. A theme inside it changes nothing, and the page's own `lang` comes back once
  the theme leaves.

### Security

- The library's klibs, which an app's build for the web and for iOS reads, name each source file relative to the
  repository's root: they held the full path it had on the machine that built them, with that user's name and folders,
  and an app built for the web carried those paths in its Wasm. `foundation`, `components`, `annotations`, `testing`
  and `material3`.

## [0.1.0] - 2026-11-01

0.1.0, Pantrix UI's first version after six previews. Before it, the faults a user of the previews would meet were
looked through and fixed: a link nothing can open, a refresh that fails and an edge of no width no longer reach the
app; a coloured bar's tabs and buttons read on it; searches compare letters as the theme's language writes them; and
a pointer over a control shows what a click would press. Two names change before anything is built on them:
`DividerAlign`'s values, and what `PantrixTooltip`'s `modifier` is applied to. Its packages are still on GitHub
Packages alone, which asks for a token; Maven Central comes later.

### Changed

#### Components

`com.pantrixui:components`

- **Breaking:** `DividerAlign`'s values are `Start`, `Center` and `End`, as the library's other enums are written: they
  were `START`, `CENTER` and `END`.
- **Breaking:** `PantrixTooltip`'s `modifier` is applied to the control's place, so that an alignment or a weight
  places the control and the label goes with it: it used to be applied to the label.
- A control a press can choose lays a faint cover of its own colour on itself while a pointer is over it, as a menu's
  rows and a calendar's days did, so that a mouse shows what a click would press: `PantrixButton`, `PantrixIconButton`,
  `PantrixChip`, `PantrixSegmentButton`, `PantrixTabs`, a `PantrixCard` with an `onClick`, `PantrixCheckbox`,
  `PantrixRadioButton`, `PantrixSwitchButton`, `PantrixPagination`, the navigation bar's and rail's destinations, a
  chart's legend, a snackbar's buttons, and the buttons inside the text, date, time and secure fields and the elastic
  date picker.
- `PantrixSelect`, `PantrixMultiSelect` and `PantrixJsonView` compare letters as the theme's language writes them
  small: in Turkish "i" finds "İzmir" and not "Isparta", and "ı" finds "Isparta". `jsonViewSearchPaths` takes the
  `language` to search in.
- `PantrixTimePicker`'s column of hours starts at `minTime`'s hour by a clock of 24 hours where `maxTime` comes before
  `minTime`, so that a night's hours stand together: 22, 23, 00 and on.

### Fixed

#### Foundation

`com.pantrixui:foundation`

- `Modifier.focusRing` given a width of nothing draws no ring: Compose drew it a hairline wide.

#### Components

`com.pantrixui:components`

- `PantrixLink(url)` lets go of an address nothing on the device can open, as Compose does for a text's links: it used
  to stop the app.
- `PantrixElasticDatePicker`'s Refresh button stops spinning where its `onRefresh` throws: the error used to stop the
  app.
- An edge, a ring or a line whose style gives it no width is not drawn: `PantrixChip`, `PantrixAlert`, `PantrixTag`,
  `PantrixFileItem`, `PantrixFileDrop`, `PantrixTextField`, `PantrixFilledTextField`, `PantrixRadioButton`,
  `PantrixCheckbox`, `PantrixSidebar`'s guide, `PantrixButtonGroup`'s divider and a select's marked row drew one a
  hairline wide.
- On a fill that says what is written on it, a top bar of the brand's colour, `PantrixTabs`' selected tab and its line,
  `ButtonVariant.Outline` and `ButtonVariant.Text` buttons and an icon button with no fill of its own are written as
  the fill says, and so is a focus ring there: they were drawn in the theme's `primary`, which could hardly be told
  from the fill.

## [0.1.0-alpha06] - 2026-11-01

The sixth preview of 0.1.0, for coding assistants and the tools built on them: the MCP server searches in Turkish
too, puts first what holds the most of a query's words, and gives the answers of eight of its tools as data.

### Added

#### Tooling

`com.pantrixui:mcp`

- The MCP server's tools search in Turkish too, and take a `language`, `en` or `tr`, that picks the language their
  answer gives the components, the pages, the guides, the examples, the declarations and the icons in: `search_components` finds
  `PantrixSnackbarHost` by "bildirim", and `PantrixDatePicker` by "tarih seçici" or "tarih secici".
- Eight of the MCP server's tools, `search_components`, `get_component_metadata`, `search_api`, `get_api`,
  `search_icons`, `search_documentation`, `list_examples` and `get_example`, give their answer as data too, in the
  call's structured content, whose shape their output schema says: for a program that builds a page of its own from it.
- The documents for coding assistants have the library as data in Turkish, `tr/pantrix-ui.json`, and the modules' API
  in Turkish, `tr/api/<module>.md`, with every component's description and keywords and every icon's description in
  Turkish.

### Changed

#### Tooling

`com.pantrixui:mcp`

- The MCP server's searches put first what holds the most of a query's words and a keyword the query names:
  "a comment box with several lines" brings `PantrixTextArea` first, where `PantrixLineChart` used to come first.

### Fixed

#### Tooling

`com.pantrixui:mcp`

- `search_icons` says once that an icon is mirrored in a language read from right to left: it used to say it twice.

## [0.1.0-alpha05] - 2026-10-31

The fifth preview of 0.1.0: overlays that open on iOS right after a foldable has been opened or closed, a guide
to a web app that opens in every browser, and the web demo with a JavaScript build for a browser that cannot run Wasm.

### Fixed

#### Components

`com.pantrixui:components`

- `PantrixModal`, `PantrixDialog`, `PantrixSheet` and `PantrixCommandPalette` opened on iOS right after the window has
  changed size, as a foldable's does when it is opened or closed, fill the window and draw their scrim: they used to
  stop the app with "Size(2147483647 x 2147483647) is out of range".

## [0.1.0-alpha04] - 2026-10-31

The fourth preview of 0.1.0: fallback fonts on the web, so that a browser fetches no font from Google for the
marks of a Mac's keys, and the Claude Code plugin with the MCP server at Pantrix UI's own site.

### Added

#### Foundation

`com.pantrixui:foundation`

- **Fallback fonts:** `PantrixTypeface(fonts, fallbacks)` gives the fonts a browser draws a character in that none of
  the typeface's has. They are read with the typeface and `areTypefacesLoaded` waits for them, so that Compose for Web
  fetches no Noto font from Google's servers for such a character: every visitor's browser asked Google for it, an
  offline page left it blank, and a content security policy had to let Google in.
- **Pantrix Symbols:** `PantrixTypeface.Default` falls back on Pantrix Symbols, 3 KB cut from Noto's fonts, for the
  marks a `PantrixShortcut` is written in on Apple's systems (`⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`), which a browser fetched from
  Google until now. Its licence, the SIL Open Font License 1.1, travels with it in the library's resources.

### Changed

#### Tooling

`com.pantrixui:mcp`

- The package repository's Claude Code plugin `pantrix-ui` brings the MCP server too, at the address Pantrix UI's site
  serves it at, `https://pantrixui.com/mcp`: an assistant that installs it needs neither Java nor the jar.

### Fixed

#### Tooling

`com.pantrixui:mcp`

- The MCP server's jar leaves when its input ends, also when it ends right after the last message, as
  `printf … | java -jar` sends it: it used to keep running.

## [0.1.0-alpha03] - 2026-10-30

The third preview of 0.1.0, for coding assistants: the MCP server over HTTP, for a site that serves it, and the
server's jar, the skill and `llms.txt` with each release.

### Added

#### Tooling

`com.pantrixui:mcp`

- `PantrixMcp.http()` gives the MCP server over Streamable HTTP, bound to no web framework, for a site that serves it
  at an address of its own: an assistant is then given the address, and needs neither Java nor the jar.
- Each release carries the MCP server's jar and the skill `pantrix-ui` as files of their own, the web demo's pages
  serve `llms.txt` and the documents it leads to, and the package repository is a Claude Code plugin marketplace whose
  plugin `pantrix-ui` brings the skill.

### Changed

#### Tooling

`com.pantrixui:mcp`

- `com.pantrixui:mcp` gives a build that depends on it MCP's Kotlin SDK too, since `PantrixMcp.server()` returns the
  SDK's `Server`.

## [0.1.0-alpha02] - 2026-10-30

The second preview of 0.1.0, with one change: a page takes the whole width of a wide window by default.

### Changed

#### Components

`com.pantrixui:components`

- `PantrixPageScaffold` and `PantrixLazyPageScaffold` take the page's whole width by default (`width = PageWidth.Full`),
  so a wide window no longer leaves the room past 1040dp empty; `PageWidth.Content` keeps a page that is read to the
  theme's content width.

## [0.1.0-alpha01] - 2026-10-29

The first preview of 0.1.0, the library's first version: an alpha, whose API may still change before 0.1.0. It is
built with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

Its targets:

- Android, API 30 and newer;
- iOS: devices, and the simulator on Apple silicon;
- the JVM;
- JS and Wasm.

It carries the following, each module under the name it is published as.

### Added

#### Foundation

`com.pantrixui:foundation`

- **Theme:** `PantrixTheme`, a brand's look in one `DesignPreset`, themes nested inside each other, a preset's
  colours for the dark the app's reader chose (`rememberPantrixColors(preset, darkTheme)`), and the system's bars,
  keyboard and controls on Android and iOS following the theme rather than the system's dark mode
  (`followSystemBars`).
- **Tokens:**
  - colour roles, the palette and content colour;
  - the type scale, typefaces, a typeface for code (`rememberPantrixTypography(typeface, codeTypeface)`) and a gate
    that waits for fonts on the web, given them one by one or as a list;
  - spacing, shapes, elevation, density, and component styles per platform;
  - motion that follows the system's reduced motion.
- **Accessibility:** focus rings, touch targets, modal layers, keeping a focused field clear of bars, and each
  platform's conventions.
- **Adaptive layout:**
  - window size classes, breakpoints, page margins, layout columns and a maximum content width;
  - foldable postures on Android and iOS, and overlays that keep to one side of a fold;
  - the vertical bar iOS shows on a foldable iPhone's cover screen.
- **Localisation:** Turkish, English and Arabic strings, right-to-left layout, the day a week starts on, numbers in
  each language's digits, and alphabetical order by language.
- **Platform services:** haptics, the clipboard, picking, dropping and saving files (`FileSaver`), keyboard shortcuts,
  putting the keyboard away with a tap outside a field (`Modifier.clearFocusOnTap`), resize pointers, system settings,
  the window's title after the screen shown, and dates and times without a date library.
- **For tests and products:** automation tags (`TestScope`, `pantrixTestTagOf` for the tag a test looks for, and
  `Modifier.pantrixAutomationRoot` for the tags in a window of the app's own to reach Android's automation), a screen's
  clock, file picker and file saver that a test or a preview gives (`LocalPantrixClock`, `LocalFilePicker`,
  `LocalFileSaver`), and UI events for analytics, which carry each component's tag even in a build that keeps its tags
  out of the semantics tree (`TestTagPolicy.Off`).
- **Diagnostics:** checks a running screen is put to while its theme is given `diagnostics`: one tag on two nodes,
  colours that do not read, a squeezed touch target, a blank name, a language without strings of its own and a
  shadowed shortcut. Their findings go to the log or are kept for a test, and `contrastRatio` measures two colours as
  WCAG 2.2 does.

#### Components

`com.pantrixui:components`

100 components, each named `Pantrix…`:

- **Elements:**
  - text, icons and images;
  - buttons, icon buttons, button groups, segment buttons whose labels may be set in a type of their own, links,
    underlined always or under a pointer (`LinkUnderline`), and chips;
  - badges, avatars, dividers, skeletons and spinners;
  - checkboxes, radio buttons and radio groups, and switches, whose label may be set in a type of its own, each
    with its control before its label or at the end of the row (`ControlPosition`);
  - a file drop zone and its file rows;
  - a scroll bar for a screen's own content: a column that scrolls with it (`Modifier.pantrixVerticalScroll`) and a
    lazy list (`Modifier.pantrixScrollBar`).
- **Inputs:** text fields, filled and secure, whose boxes of several lines show how far their text is scrolled, fields
  that grow with their text, and text areas, outlined and filled, with a handle that resizes them, a limit their text
  may pass (`TextLimit`) and a submit on Ctrl or Cmd and Enter.
- **Date and time:** a date picker, a time picker, masked date and time fields, and an elastic date picker for ranges.
- **Containers:** a surface, a card whose body fills the height it is given, its actions at the foot, an accordion, an
  alert whose message may hold code and links, in a type of its own where an app gives one, with an edge in a colour of
  its own and its room across apart from its room up and down, tabs, a top bar with its back button, a scaffold, a page
  inside it with its bar or heading, its actions laid out by the room and a list's form, and a screen outside it with a
  showcase beside its form, the form alone in a narrow room, with the adaptive list-detail, supporting-pane, tabletop
  and two-pane layouts.
- **Navigation:** a breadcrumb, which may sit as low as a line of text, a navigation bar, a navigation rail and a
  sidebar whose groups may carry a title, its rows and titles set in a type of their own, with a scroll bar where its
  rows do not fit.
- **Overlays:** a modal layer of the app's own (`PantrixModal`), a dialog, a sheet along the bottom, the end or the
  start edge, a popover, a menu with a check on the row chosen and a second line under a row's label in a type of its
  own, a tooltip, a snackbar, a select, a multi-select, a command palette whose commands may carry a second line, and
  an inspector that shows over an app what its theme's diagnostics have found.
- **Data:** list rows with a title, the lines over and under it, what leads and ends them, a chevron and a line under
  them (`PantrixListItem`), a data table, a tree view, a carousel, a code block with tabs at its header's start, its own
  type and a height a row can ask of it before its lines are built, a JSON view, tags in a type of their own where an
  app gives one, and pagination with its page jump and page size.
- **Charts:**
  - line, area, range, bar, waterfall and candlestick charts, and a chart that combines their series;
  - pie and polar charts, a gauge, a progress circle, a meter group, a status tracker and a sparkline;
  - scatter and radar charts, a heatmap and a treemap;
  - funnel, Sankey and Gantt charts.

  They come with zoom, a navigator and export to PNG, SVG and PDF.
- **Forms:** `FormState` and its fields, with their rules, their errors and the submission. The text fields, the
  text areas, the checkbox, the radio group, the switch, the selects and the date and time fields bind to a field
  directly.

#### Annotations

`com.pantrixui:annotations`

- `@PantrixComponent` and `@PantrixExample`, which describe each component for tooling: its name, group, description
  and keywords, and its short examples. `@PantrixComponentPart` marks a part of a component.

#### Material 3

`com.pantrixui:material3`

- A bridge between Pantrix's theme and Material 3's, both ways: `PantrixThemeFromMaterial` gives Pantrix's components
  inside a Material theme its colours, type and shapes, and the system's bars its dark unless it is told
  `followSystemBars = false`, and `MaterialThemeFromPantrix` gives Material's components inside a Pantrix theme
  Pantrix's. `toPantrixColors`, `toColorScheme`, `toPantrixTypography`, `toMaterialTypography`, `toPantrixShapes`
  and `toMaterialShapes` convert one theme's values to the other's, and `PantrixContentFromMaterial` and
  `MaterialContentFromPantrix` carry one system's content colour and text style to the other's components on a mixed
  screen. It is built against Material 3 1.9.0, and an app's newer Material 3 is the one it gets.

#### Testing

`com.pantrixui:testing`

- For an app's tests on every target: finding a component by its tag (`onPantrixNode`, `hasPantrixTag`, `pantrixTags`),
  a theme of fixed defaults (`PantrixTestTheme`, `onEachPlatform`), doubles of the clipboard, the file picker and the
  file saver, analytics, haptics and the clock, and assertions of the diagnostics' findings, names, touch targets,
  shortcuts and text. On Android it brings the activity a Compose test starts.

#### Tooling

`com.pantrixui:detekt-rules`, `com.pantrixui:mcp`

- detekt rules for an app built on the library: layout that follows the reading direction (`FixedSideLayout`),
  pictures that say what they show (`ImageWithoutDescription`) and controls with a `tagKey` (`UntaggedControl`), on
  by default. The library's own conventions come as further rules an app can turn on.
- `com.pantrixui:mcp`, for coding assistants: the library's documents, written from its sources (`llms.txt`,
  `llms-full.txt`, a page for each page of the demo, each module's API, the guides for apps, and `pantrix-ui.json` with
  its schema), the demo's pages, the guides and the changelog in Turkish too, the skill `pantrix-ui`, and an MCP server
  that answers from them with twelve tools, nine resources and three prompts. Its jar with the classifier `all` runs the
  server by itself and carries the licences of what it bundles.
