Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha03/RELEASE_NOTES.tr.md)

Pantrix UI 0.1.0-alpha03, released on 2026-10-30. It is built from the commit `24ed94680a55`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

The third preview of 0.1.0, for coding assistants: the MCP server over HTTP, for a site that serves it, and the
server's jar, the skill and `llms.txt` with each release.

## Packages

| Package | Changed since v0.1.0-alpha02 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:mcp` | 4 files, 1 commit | not tracked | 4.4 MB, 28.9 KB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 89.6 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
| `com.pantrixui:components` | none | 3,677 declarations, none changed | 6.2 MB, unchanged |
| `com.pantrixui:foundation` | none | 1,583 declarations, none changed | 818.2 KB, unchanged |
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
    implementation("com.pantrixui:components:0.1.0-alpha03")
}
```

## For coding assistants

The library's documents for coding assistants, written from its sources, come with each release in its version: the MCP server that answers from them, the skill `pantrix-ui` and `llms.txt`.

| What | How it is given |
| :--- | :--- |
| The MCP server, `mcp-0.1.0-alpha03-all.jar`, attached to this release and in `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha03/` after a local publish; it runs on JDK 17 or newer | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.1.0-alpha03-all.jar`, or the same command in a client's `mcpServers` |
| The skill `pantrix-ui`, `pantrix-ui-skill-0.1.0-alpha03.zip`, attached to this release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| Claude Code's plugin `pantrix-ui`, which brings the skill | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` and the documents it leads to, beside the web demo | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>, for an assistant that reads neither skills nor MCP |

## Tooling

`com.pantrixui:mcp`

### Added

- `PantrixMcp.http()` gives the MCP server over Streamable HTTP, bound to no web framework, for a site that serves it
  at an address of its own: an assistant is then given the address, and needs neither Java nor the jar.
- Each release carries the MCP server's jar and the skill `pantrix-ui` as files of their own, the web demo's pages
  serve `llms.txt` and the documents it leads to, and the package repository is a Claude Code plugin marketplace whose
  plugin `pantrix-ui` brings the skill.

### Changed

- `com.pantrixui:mcp` gives a build that depends on it MCP's Kotlin SDK too, since `PantrixMcp.server()` returns the
  SDK's `Server`.

## Other packages

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:components` has no lines in the changelog for this version.

`com.pantrixui:foundation` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
