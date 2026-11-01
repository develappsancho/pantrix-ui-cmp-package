# Pantrix UI

Türkçesi: [README.tr.md](./README.tr.md)

Pantrix UI is a design system and adaptive UI library for Compose Multiplatform, on Android, iOS, the desktop and the
web, built directly on Compose Foundation with no dependency on Material. This repository is where it is distributed
from: its Maven packages, its releases with their notes, and its demo app on each platform. The library's source is
kept in a repository of its own.

The latest version is **0.1.0-alpha02**, of 2026-10-30: [its release](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0-alpha02), with what changed in each
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

And a module's dependency:

```kotlin
dependencies {
    implementation("com.pantrixui:components:0.1.0-alpha02")
}
```

## The demo

The demo shows every component, with its examples and their code. Its files are attached to [each
release](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0-alpha02):

| Platform | File | How it is opened |
| :--- | :--- | :--- |
| Android 11 (API 30) or newer | `PantrixUI-0.1.0-alpha02.apk` | Installed on a device or an emulator: `adb install PantrixUI-0.1.0-alpha02.apk` |
| macOS, on Apple silicon | `PantrixUI-0.1.0-alpha02.dmg` | Opened, and PantrixUI moved to Applications. It is signed and notarized by Apple. |
| The iOS simulator, on a Mac with Apple silicon | `PantrixUI-0.1.0-alpha02-ios-simulator.zip` | Unzipped, and installed in a booted simulator: `xcrun simctl install booted PantrixUI.app` |
| The web | [https://develappsancho.github.io/pantrix-ui-cmp-package/](https://develappsancho.github.io/pantrix-ui-cmp-package/) | In a browser with WebAssembly's garbage collection: Chrome or Edge 119, Firefox 120, Safari 18.2, or newer |

## Licence

Pantrix UI is licensed under the [Apache License 2.0](./LICENSE).
