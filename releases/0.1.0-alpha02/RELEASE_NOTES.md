Türkçesi: [RELEASE_NOTES.tr.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha02/RELEASE_NOTES.tr.md)

Pantrix UI 0.1.0-alpha02, released on 2026-10-30. It is built from the commit `f1f18f460211`, with Kotlin 2.4.21 and Compose Multiplatform 1.12.2.

The second preview of 0.1.0, with one change: a page takes the whole width of a wide window by default.

## Packages

| Package | Changed since v0.1.0-alpha01 | Public API | JVM jar |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 3 files, 1 commit | 3,677 declarations, none changed | 6.2 MB, 0.0 KB more |
| `com.pantrixui:mcp` | none | not tracked | 4.4 MB, 0.8 KB more |
| `com.pantrixui:detekt-rules` | none | not tracked | 89.6 KB, unchanged |
| `com.pantrixui:annotations` | none | 13 declarations, none changed | 3.8 KB, unchanged |
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

And a module's dependency:

```kotlin
dependencies {
    implementation("com.pantrixui:components:0.1.0-alpha02")
}
```

## Components

`com.pantrixui:components`

### Changed

- `PantrixPageScaffold` and `PantrixLazyPageScaffold` take the page's whole width by default (`width = PageWidth.Full`),
  so a wide window no longer leaves the room past 1040dp empty; `PageWidth.Content` keeps a page that is read to the
  theme's content width.

## Other packages

`com.pantrixui:mcp` has no lines in the changelog for this version.

`com.pantrixui:detekt-rules` has no lines in the changelog for this version.

`com.pantrixui:annotations` has no lines in the changelog for this version.

`com.pantrixui:foundation` has no lines in the changelog for this version.

`com.pantrixui:material3` has no lines in the changelog for this version.

`com.pantrixui:testing` has no lines in the changelog for this version.
