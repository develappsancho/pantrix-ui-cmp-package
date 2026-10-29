# Changelog

Türkçesi: [CHANGELOG.tr.md](./CHANGELOG.tr.md)

What changed in Pantrix UI, for someone who uses the library.

- **Format:** this file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the versions follow
  [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- **Breaking changes:** until 1.0.0, a minor version may break the API. A change that does is marked **Breaking**.
- **What gets a line:** CONTRIBUTING.md says which changes get one, and how it is
  written.

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
