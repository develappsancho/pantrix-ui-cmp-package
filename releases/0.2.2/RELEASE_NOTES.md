Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.2.2/RELEASE_NOTES.tr.md)

Pantrix UI 0.2.2, released on 2026-11-28. It is built from the commit `c54edfd66957`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

0.2.2 lets a comparison say what is wrong on its lines. `PantrixDiffView` draws a `CodeMark` on either side of a line, as `PantrixCodeBlock` draws one: its bar, and under the line its message, what said so and its actions; a marked line never folds away. The documents for coding assistants no longer give counts that fall behind as the library grows. Code built against 0.2.1 keeps working: what is new stands beside what was there.

## Packages

| Package | Changed since v0.2.1 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 18 files, 1 commit | 4,501 declarations: 4 added | 8.1 MB, 18.8 KB more |
| `com.pantrixui:mcp` | none | not tracked | 6.3 MB, 9.6 KB more |
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
    implementation("com.pantrixui:components:0.2.2")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.2.2-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.2.2/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.2.2-all.jar`, or the same command in a client's `mcpServers` |
| The MCP server that Pantrix UI's site serves at <https://pantrixui.com/mcp>, of the release the site is built with | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp`, or `"type": "http"` and its `"url"` in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.2.2.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill and the server on the site | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Components

`com.pantrixui:components`

### Added

- `DiffLine.beforeMark` and `DiffLine.afterMark`, what is said about each side of a line of `PantrixDiffView`, as a `CodeMark`: the bar down the side's start, the message, what said so and the mark's actions as buttons under the line, and on an unchanged line the mark's band. A marked line is never folded away. `DiffLine.copy` marks the lines `diffLines` gives; code built against 0.2.1's constructor keeps working.

### Public API

<details>
<summary>4 declarations added to `com.pantrixui:components`</summary>

- `constructor(DiffKind, String?, String?, Int?, … 9 parameters) in DiffLine`
- `final fun copy(DiffKind, String?, String?, Int?, … 9 parameters): DiffLine in DiffLine`
- `final val afterMark in DiffLine`
- `final val beforeMark in DiffLine`

</details>

## Tooling

`com.pantrixui:mcp`

### Fixed

- The guide for coding assistants and the testing guide, in the MCP server's documents and in `llms-full.txt`, no longer give counts that fall behind as the library grows: they said 24 guides, 118 pages of the demo and a `llms-full.txt` of 4.7 MB, where 0.2.1 has 29 guides, 126 pages and 5.2 MB.

## Other packages

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:foundation` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
