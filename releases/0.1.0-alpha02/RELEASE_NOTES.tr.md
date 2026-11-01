English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha02/RELEASE_NOTES.md)

Pantrix UI 0.1.0-alpha02, 2026-10-30 tarihinde çıktı. `f1f18f460211` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.1.0'ın ikinci önizlemesi, tek bir değişiklikle: bir sayfa varsayılan olarak geniş bir pencerenin bütün genişliğini alır.

## Paketler

| Paket | Önceki sürüme göre (v0.1.0-alpha01) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 3 dosya, 1 commit | 3.677 bildirim, değişmedi | 6,2 MB, 0,0 KB arttı |
| `com.pantrixui:mcp` | yok | izlenmiyor | 4,4 MB, 0,8 KB arttı |
| `com.pantrixui:detekt-rules` | yok | izlenmiyor | 89,6 KB, değişmedi |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
| `com.pantrixui:foundation` | yok | 1.583 bildirim, değişmedi | 818,2 KB, değişmedi |
| `com.pantrixui:material3` | yok | 21 bildirim, değişmedi | 22,6 KB, değişmedi |
| `com.pantrixui:testing` | yok | 70 bildirim, değişmedi | 45,2 KB, değişmedi |

Yalnızca JVM'e derlenen bir modülün ABI dökümü yoktur; bu yüzden public API'si sayılmaz.

## Paketleri almak

Paketler GitHub Packages'tadır, dağıtıldıkları depoda: <https://github.com/develappsancho/pantrix-ui-cmp-package>. GitHub onları okumak için orada da bir token ister: paket okuyabilen (`read:packages`) klasik bir kişisel erişim token'ı, `~/.gradle/gradle.properties`'te `GitHubPackagesUsername` ve `GitHubPackagesPassword` özellikleriyle. Kullanan projenin `settings.gradle.kts`'i:

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

Bir modülün bağımlılığı da:

```kotlin
dependencies {
    implementation("com.pantrixui:components:0.1.0-alpha02")
}
```

## Bileşenler

`com.pantrixui:components`

### Değişenler

*   `PantrixPageScaffold` ve `PantrixLazyPageScaffold` varsayılan olarak sayfanın bütün genişliğini alır (`width = PageWidth.Full`): geniş bir pencere 1040 dp'nin ötesini artık boş bırakmaz; `PageWidth.Content` okunan bir sayfayı temanın içerik genişliğinde tutar.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:mcp` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:foundation` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
