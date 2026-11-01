Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.1/RELEASE_NOTES.tr.md)

Pantrix UI 0.1.1, released on 2026-11-02. It is built from the commit `b69fe76acd2e`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

0.1.1 fixes what was found after 0.1.0: the iOS klibs no longer bind UIKit's classes, one of which kept the shared iOS code from being commonized with Xcode 27.2; on the web the page's `<html lang>` says the language of the app's outermost theme; and the klibs name their source files relative to the repository's root, where they carried the paths of the machine that built them into an app. The public API is unchanged. A new part of the web compatibility guide says why Safari 27.2 leaves a Wasm build of Compose blank, and how a page's loader gives WebKit the JavaScript build instead.

## Packages

| Package | Changed since v0.1.0 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:foundation` | 8 files, 2 commits | 1,585 declarations, none changed | 825.1 KB, 1.7 KB more |
| `com.pantrixui:mcp` | none | not tracked | 5.6 MB, 4.7 KB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 89.6 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
| `com.pantrixui:components` | none | 3,677 declarations, none changed | 6.8 MB, unchanged |
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
    implementation("com.pantrixui:components:0.1.1")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.1.1-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.1.1/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.1.1-all.jar`, or the same command in a client's `mcpServers` |
| The MCP server that Pantrix UI's site serves at <https://pantrixui.com/mcp>, of the release the site is built with | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp`, or `"type": "http"` and its `"url"` in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.1.1.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill and the server on the site | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Every package

### Security

- The library's klibs, which an app's build for the web and for iOS reads, name each source file relative to the repository's root: they held the full path it had on the machine that built them, with that user's name and folders, and an app built for the web carried those paths in its Wasm. `foundation`, `components`, `annotations`, `testing` and `material3`.

## Foundation

`com.pantrixui:foundation`

### Fixed

- The iOS klibs hold no classes of UIKit's, such as `UIHinge`, in `com.pantrixui.foundation.adaptive.uikit`: that package binds the library's own reading of the fold and the vertical bar alone. It bound each class of UIKit that Kotlin/Native's bindings lack as well, and with Xcode 27.2 one of them named a type they lack, so the shared iOS code could not be commonized.
- On the web the outermost `PantrixTheme` writes its `locale`'s language into the page's `<html lang>`, and follows it as the app changes its language: a screen reader read the page in the language the page was opened in, and the browser offered to translate from it. A theme inside it changes nothing, and the page's own `lang` comes back once the theme leaves.

## Other packages

`com.pantrixui:mcp` has no lines in the changelog for this version.

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:components` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
