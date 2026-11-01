Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0/RELEASE_NOTES.tr.md)

Pantrix UI 0.1.0, released on 2026-11-01. It is built from the commit `2d799c7af752`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

0.1.0, Pantrix UI's first version after six previews. Before it, the faults a user of the previews would meet were looked through and fixed: a link nothing can open, a refresh that fails and an edge of no width no longer reach the app; a coloured bar's tabs and buttons read on it; searches compare letters as the theme's language writes them; and a pointer over a control shows what a click would press. Two names change before anything is built on them: `DividerAlign`'s values, and what `PantrixTooltip`'s `modifier` is applied to. Its packages are still on GitHub Packages alone, which asks for a token; Maven Central comes later.

## Packages

| Package | Changed since v0.1.0-alpha06 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 103 files, 1 commit | 3,677 declarations: 3 added, 1 changed, 3 removed | 6.8 MB, 12.0 KB more |
| `com.pantrixui:foundation` | 8 files, 1 commit | 1,585 declarations, none changed | 823.4 KB, 0.1 KB more |
| `com.pantrixui:mcp` | none | not tracked | 5.6 MB, 13.9 KB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 89.6 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
| `com.pantrixui:material3` | none | 21 declarations, none changed | 22.6 KB, unchanged |
| `com.pantrixui:testing` | none | 70 declarations, none changed | 45.2 KB, unchanged |

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
    implementation("com.pantrixui:components:0.1.0")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.1.0-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.1.0/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.1.0-all.jar`, or the same command in a client's `mcpServers` |
| The MCP server that Pantrix UI's site serves at <https://pantrixui.com/mcp>, of the release the site is built with | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp`, or `"type": "http"` and its `"url"` in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.1.0.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill and the server on the site | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Components

`com.pantrixui:components`

### Changed

- **Breaking:** `DividerAlign`'s values are `Start`, `Center` and `End`, as the library's other enums are written: they were `START`, `CENTER` and `END`.
- **Breaking:** `PantrixTooltip`'s `modifier` is applied to the control's place, so that an alignment or a weight places the control and the label goes with it: it used to be applied to the label.
- A control a press can choose lays a faint cover of its own colour on itself while a pointer is over it, as a menu's rows and a calendar's days did, so that a mouse shows what a click would press: `PantrixButton`, `PantrixIconButton`, `PantrixChip`, `PantrixSegmentButton`, `PantrixTabs`, a `PantrixCard` with an `onClick`, `PantrixCheckbox`, `PantrixRadioButton`, `PantrixSwitchButton`, `PantrixPagination`, the navigation bar's and rail's destinations, a chart's legend, a snackbar's buttons, and the buttons inside the text, date, time and secure fields and the elastic date picker.
- `PantrixSelect`, `PantrixMultiSelect` and `PantrixJsonView` compare letters as the theme's language writes them small: in Turkish "i" finds "İzmir" and not "Isparta", and "ı" finds "Isparta". `jsonViewSearchPaths` takes the `language` to search in.
- `PantrixTimePicker`'s column of hours starts at `minTime`'s hour by a clock of 24 hours where `maxTime` comes before `minTime`, so that a night's hours stand together: 22, 23, 00 and on.

### Fixed

- `PantrixLink(url)` lets go of an address nothing on the device can open, as Compose does for a text's links: it used to stop the app.
- `PantrixElasticDatePicker`'s Refresh button stops spinning where its `onRefresh` throws: the error used to stop the app.
- An edge, a ring or a line whose style gives it no width is not drawn: `PantrixChip`, `PantrixAlert`, `PantrixTag`, `PantrixFileItem`, `PantrixFileDrop`, `PantrixTextField`, `PantrixFilledTextField`, `PantrixRadioButton`, `PantrixCheckbox`, `PantrixSidebar`'s guide, `PantrixButtonGroup`'s divider and a select's marked row drew one a hairline wide.
- On a fill that says what is written on it, a top bar of the brand's colour, `PantrixTabs`' selected tab and its line, `ButtonVariant.Outline` and `ButtonVariant.Text` buttons and an icon button with no fill of its own are written as the fill says, and so is a focus ring there: they were drawn in the theme's `primary`, which could hardly be told from the fill.

### Public API

Changed in `com.pantrixui:components`, so code built against the version before is built again, and a call may change:

- `jsonViewSearchPaths(…)`

Removed from `com.pantrixui:components`, which breaks a call that used them:

- `enum entry CENTER in DividerAlign`
- `enum entry END in DividerAlign`
- `enum entry START in DividerAlign`

<details>
<summary>3 declarations added to `com.pantrixui:components`</summary>

- `enum entry Center in DividerAlign`
- `enum entry End in DividerAlign`
- `enum entry Start in DividerAlign`

</details>

## Foundation

`com.pantrixui:foundation`

### Fixed

- `Modifier.focusRing` given a width of nothing draws no ring: Compose drew it a hairline wide.

## Other packages

`com.pantrixui:mcp` has no lines in the changelog for this version.

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
