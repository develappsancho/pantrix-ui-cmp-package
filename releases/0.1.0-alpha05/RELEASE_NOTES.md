Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha05/RELEASE_NOTES.tr.md)

Pantrix UI 0.1.0-alpha05, released on 2026-10-31. It is built from the commit `2d7ff526aca8`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

The fifth preview of 0.1.0: overlays that open on iOS right after a foldable has been opened or closed, a guide
to a web app that opens in every browser, and the web demo with a JavaScript build for a browser that cannot run Wasm.

## Packages

| Package | Changed since v0.1.0-alpha04 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 6 files, 2 commits | 3,677 declarations, none changed | 6.8 MB, 0.7 KB more |
| `com.pantrixui:mcp` | 1 file, 1 commit | not tracked | 4.4 MB, 19.7 KB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 89.6 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
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
    implementation("com.pantrixui:components:0.1.0-alpha05")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.1.0-alpha05-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha05/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.1.0-alpha05-all.jar`, or the same command in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.1.0-alpha05.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Components

`com.pantrixui:components`

### Fixed

- `PantrixModal`, `PantrixDialog`, `PantrixSheet` and `PantrixCommandPalette` opened on iOS right after the window has
  changed size, as a foldable's does when it is opened or closed, fill the window and draw their scrim: they used to
  stop the app with "Size(2147483647 x 2147483647) is out of range".

## Other packages

`com.pantrixui:mcp` has no lines in the changelog for this version.

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:foundation` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
