Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha04/RELEASE_NOTES.tr.md)

Pantrix UI 0.1.0-alpha04, released on 2026-10-31. It is built from the commit `96ac34f32eef`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

The fourth preview of 0.1.0: fallback fonts on the web, so that a browser fetches no font from Google for the
marks of a Mac's keys, and the Claude Code plugin with the MCP server at Pantrix UI's own site.

## Packages

| Package | Changed since v0.1.0-alpha03 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:foundation` | 14 files, 1 commit | 1,585 declarations: 2 added, 2 changed | 823.3 KB, 5.1 KB more |
| `com.pantrixui:mcp` | 2 files, 1 commit | not tracked | 4.4 MB, 8.7 KB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 89.6 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
| `com.pantrixui:components` | 99 files, 1 commit | 3,677 declarations, none changed | 6.8 MB, 595.7 KB more |
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
    implementation("com.pantrixui:components:0.1.0-alpha04")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.1.0-alpha04-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha04/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.1.0-alpha04-all.jar`, or the same command in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.1.0-alpha04.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Foundation

`com.pantrixui:foundation`

### Added

- **Fallback fonts:** `PantrixTypeface(fonts, fallbacks)` gives the fonts a browser draws a character in that none of
  the typeface's has. They are read with the typeface and `areTypefacesLoaded` waits for them, so that Compose for Web
  fetches no Noto font from Google's servers for such a character: every visitor's browser asked Google for it, an
  offline page left it blank, and a content security policy had to let Google in.
- **Pantrix Symbols:** `PantrixTypeface.Default` falls back on Pantrix Symbols, 3 KB cut from Noto's fonts, for the
  marks a `PantrixShortcut` is written in on Apple's systems (`⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`), which a browser fetched from
  Google until now. Its licence, the SIL Open Font License 1.1, travels with it in the library's resources.

### Public API

Changed in `com.pantrixui:foundation`, so code built against the version before is built again, and a call may change:

- `PantrixTypeface(…)`
- `PantrixTypeface.copy(…)`

<details>
<summary>2 declarations added to `com.pantrixui:foundation`</summary>

- `final fun component2(): List<PantrixFont> in PantrixTypeface`
- `final val fallbacks in PantrixTypeface`

</details>

## Tooling

`com.pantrixui:mcp`

### Changed

- The package repository's Claude Code plugin `pantrix-ui` brings the MCP server too, at the address Pantrix UI's site
  serves it at, `https://pantrixui.com/mcp`: an assistant that installs it needs neither Java nor the jar.

### Fixed

- The MCP server's jar leaves when its input ends, also when it ends right after the last message, as
  `printf … | java -jar` sends it: it used to keep running.

## Other packages

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:components` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
