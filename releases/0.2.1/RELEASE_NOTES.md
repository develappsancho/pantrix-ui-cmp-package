Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.2.1/RELEASE_NOTES.tr.md)

Pantrix UI 0.2.1, released on 2026-11-11. It is built from the commit `7a2606c93f9a`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

0.2.1 fixes two things found after 0.2.0. A mouse that drags the scroll thumb of a long list far puts the list straight there: a document of fifty thousand lines in `PantrixCodeEditor` stalled at every step of such a drag, as did any long list behind Pantrix's scroll bar. And the documents for coding assistants carry the whole code of the code editor's examples, seven of which stopped at the first line of a helper written as a raw string. The public API is unchanged.

## Packages

| Package | Changed since v0.2.0 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 11 files, 1 commit | 4,497 declarations, none changed | 8.1 MB, 0.4 KB more |
| `com.pantrixui:mcp` | none | not tracked | 6.3 MB, 5.5 KB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 97.7 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
| `com.pantrixui:foundation` | none | 1,712 declarations, none changed | 886.0 KB, unchanged |
| `com.pantrixui:material3` | none | 21 declarations, none changed | 22.6 KB, unchanged |
| `com.pantrixui:testing` | none | 91 declarations, none changed | 49.8 KB, unchanged |

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
    implementation("com.pantrixui:components:0.2.1")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.2.1-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.2.1/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.2.1-all.jar`, or the same command in a client's `mcpServers` |
| The MCP server that Pantrix UI's site serves at <https://pantrixui.com/mcp>, of the release the site is built with | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp`, or `"type": "http"` and its `"url"` in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.2.1.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill and the server on the site | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Components

`com.pantrixui:components`

### Fixed

- A mouse that drags the scroll bar's thumb of a long list farther than a screen puts the list straight there, in `PantrixCodeEditor`, `PantrixCodeBlock`, `PantrixJsonView`, `PantrixLazyTreeView`, `PantrixDiffView`, `PantrixDataTable` and a `LazyColumn` given `Modifier.pantrixScrollBar`: the list was scrolled by pixels and built every row it passed, and the drag of a document of fifty thousand lines stalled for most of a second a step.

## Tooling

`com.pantrixui:mcp`

### Fixed

- The MCP server's documents, and `llms-full.txt` and `pantrix-ui.json` beside the web demo, carry the whole code of an example whose helper is a raw string closed in the first column: seven examples of `PantrixCodeEditor` stopped at the helper's first line, `private val TASKS = """`, and did not compile.

## Other packages

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:foundation` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
