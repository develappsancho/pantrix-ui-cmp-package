Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha06/RELEASE_NOTES.tr.md)

Pantrix UI 0.1.0-alpha06, released on 2026-11-01. It is built from the commit `9d960e82212f`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

The sixth preview of 0.1.0, for coding assistants and the tools built on them: the MCP server searches in Turkish too, puts first what holds the most of a query's words, and gives the answers of eight of its tools as data.

## Packages

| Package | Changed since v0.1.0-alpha05 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:mcp` | 7 files, 1 commit | not tracked | 5.6 MB, 1.2 MB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 89.6 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
| `com.pantrixui:components` | none | 3,677 declarations, none changed | 6.8 MB, unchanged |
| `com.pantrixui:foundation` | none | 1,585 declarations, none changed | 823.3 KB, unchanged |
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
    implementation("com.pantrixui:components:0.1.0-alpha06")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.1.0-alpha06-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha06/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.1.0-alpha06-all.jar`, or the same command in a client's `mcpServers` |
| The MCP server that Pantrix UI's site serves at <https://pantrixui.com/mcp>, of the release the site is built with | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp`, or `"type": "http"` and its `"url"` in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.1.0-alpha06.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill and the server on the site | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Tooling

`com.pantrixui:mcp`

### Added

- The MCP server's tools search in Turkish too, and take a `language`, `en` or `tr`, that picks the language their answer gives the components, the pages, the guides, the examples, the declarations and the icons in: `search_components` finds `PantrixSnackbarHost` by "bildirim", and `PantrixDatePicker` by "tarih seçici" or "tarih secici".
- Eight of the MCP server's tools, `search_components`, `get_component_metadata`, `search_api`, `get_api`, `search_icons`, `search_documentation`, `list_examples` and `get_example`, give their answer as data too, in the call's structured content, whose shape their output schema says: for a program that builds a page of its own from it.
- The documents for coding assistants have the library as data in Turkish, `tr/pantrix-ui.json`, and the modules' API in Turkish, `tr/api/<module>.md`, with every component's description and keywords and every icon's description in Turkish.

### Changed

- The MCP server's searches put first what holds the most of a query's words and a keyword the query names: "a comment box with several lines" brings `PantrixTextArea` first, where `PantrixLineChart` used to come first.

### Fixed

- `search_icons` says once that an icon is mirrored in a language read from right to left: it used to say it twice.

## Other packages

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:components` has no lines in the changelog for this version.

`com.pantrixui:foundation` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
