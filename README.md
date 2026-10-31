# Pantrix UI

Türkçesi: [README.tr.md](./README.tr.md)

Pantrix UI is a design system and adaptive UI library for Compose Multiplatform, on Android, iOS, the desktop and the
web, built directly on Compose Foundation with no dependency on Material. This repository is where it is distributed
from: its Maven packages, its releases with their notes, and its demo app on each platform. The library's source is
kept in a repository of its own.

The latest version is **0.1.0-alpha05**, of 2026-10-31: [its release](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0-alpha05), with what changed in each
package, [the changelog](./CHANGELOG.md) and [every version](./versions.json).

## Packages

| Package | What it is |
| :--- | :--- |
| `com.pantrixui:components` | The components. It brings `foundation` and `annotations` with it. |
| `com.pantrixui:foundation` | The theme and its tokens, adaptive layout, and the platform's services |
| `com.pantrixui:annotations` | `@PantrixComponent` and `@PantrixExample`, which describe the components for tools |
| `com.pantrixui:material3` | The bridge between Pantrix's theme and Material 3's, both ways |
| `com.pantrixui:testing` | Helpers for an app's tests, added to its test source sets only |
| `com.pantrixui:detekt-rules` | detekt rules for an app built on the library |
| `com.pantrixui:mcp` | The library's documents for coding assistants, and the MCP server that answers from them |

## Using them

The packages are on GitHub Packages. GitHub asks for a token to read them, even from a public repository: a classic
personal access token that may read packages (`read:packages`). It goes in `~/.gradle/gradle.properties`, never in a
project's files:

```properties
GitHubPackagesUsername=<your GitHub user name>
GitHubPackagesPassword=<the token>
```

A project's `settings.gradle.kts`:

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

Built from the library's own repository, `./gradlew clean publishToMavenLocal` puts the packages in the local Maven
repository instead, and a project names it in place of GitHub Packages:

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

## The demo

The demo shows every component, with its examples and their code. Its files are attached to [each
release](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0-alpha05):

| Platform | File | How it is opened |
| :--- | :--- | :--- |
| Android 11 (API 30) or newer | `PantrixUI-0.1.0-alpha05.apk` | Installed on a device or an emulator: `adb install PantrixUI-0.1.0-alpha05.apk` |
| macOS, on Apple silicon | `PantrixUI-0.1.0-alpha05.dmg` | Opened, and PantrixUI moved to Applications. It is signed and notarized by Apple. |
| The iOS simulator, on a Mac with Apple silicon | `PantrixUI-0.1.0-alpha05-ios-simulator.zip` | Unzipped, and installed in a booted simulator: `xcrun simctl install booted PantrixUI.app` |
| The web | [https://develappsancho.github.io/pantrix-ui-cmp-package/](https://develappsancho.github.io/pantrix-ui-cmp-package/) | In a browser with WebAssembly's garbage collection: Chrome or Edge 119, Firefox 120, Safari 18.2, or newer |

## For coding assistants

Pantrix UI writes its own documents for coding assistants (Claude Code, Cursor, Claude Desktop…) from its sources, so
that an assistant writes Pantrix's components and not Material's. Each of them is of version 0.1.0-alpha05:

| What | Where | How it is given |
| :--- | :--- | :--- |
| The Claude Code plugin, with the skill `pantrix-ui` | This repository, which is a marketplace of plugins | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, then `claude plugin install pantrix-ui@pantrix-ui` |
| The MCP server: one jar that runs by itself, on JDK 17 or newer | `mcp-0.1.0-alpha05-all.jar`, attached to [the release](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0-alpha05), and in `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha05/` after a local publish | `claude mcp add pantrix-ui -- java -jar <path>/mcp-0.1.0-alpha05-all.jar`, or the same command in a client's `mcpServers` |
| The skill on its own | `pantrix-ui-skill-0.1.0-alpha05.zip`, attached to the release | Unzipped into `.claude/skills/` in an app's repository, where the team gets it through git |
| `llms.txt`, and the documents it leads to | [https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt](https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt) | Given to an assistant that reads neither skills nor MCP |

The jar writes the skill and the documents as well: `java -jar mcp-0.1.0-alpha05-all.jar skill .claude/skills` and
`java -jar mcp-0.1.0-alpha05-all.jar docs <folder>`.

## Licence

Pantrix UI is licensed under the [Apache License 2.0](./LICENSE).
