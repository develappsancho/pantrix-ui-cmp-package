English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha03/RELEASE_NOTES.md)

Pantrix UI 0.1.0-alpha03, 2026-10-30 tarihinde çıktı. `24ed94680a55` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.1.0'ın üçüncü önizlemesi, kodlama asistanları için: sunucuyu kendi adresinde sunan bir site için HTTP üzerinden MCP sunucusu, ve her sürümle sunucunun jar'ı, skill ve `llms.txt`.

## Paketler

| Paket | Önceki sürüme göre (v0.1.0-alpha02) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:mcp` | 4 dosya, 1 commit | izlenmiyor | 4,4 MB, 28,9 KB arttı |
| `com.pantrixui:detekt-rules` | yok | izlenmiyor | 89,6 KB, değişmedi |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
| `com.pantrixui:components` | yok | 3.677 bildirim, değişmedi | 6,2 MB, değişmedi |
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

Kütüphanenin kendi deposundan derlenince `./gradlew clean publishToMavenLocal` onları yerel Maven deposuna koyar; proje o zaman GitHub Packages'ın yerine onu anar:

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenLocal()
        google()
        mavenCentral()
    }
}
```

Bir modülün bağımlılığı da:

```kotlin
dependencies {
    implementation("com.pantrixui:components:0.1.0-alpha03")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.1.0-alpha03-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha03/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.1.0-alpha03-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.1.0-alpha03.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Araçlar

`com.pantrixui:mcp`

### Eklenenler

*   `PantrixMcp.http()`, MCP sunucusunu Streamable HTTP üzerinden, hiçbir web çatısına bağlı olmadan verir; sunucuyu kendi adresinde sunan bir site için: bir asistana o zaman yalnızca adres verilir, ne Java ne jar gerekir.
*   Her sürüm MCP sunucusunun jar'ını ve `pantrix-ui` skill'ini kendi dosyaları olarak taşır, web demosunun sayfaları `llms.txt`'yi ve götürdüğü belgeleri sunar, paket deposu da `pantrix-ui` eklentisi skill'i getiren bir Claude Code eklenti pazarıdır.

### Değişenler

*   `com.pantrixui:mcp`, ona bağlanan bir derlemeye MCP'nin Kotlin SDK'sını da verir, çünkü `PantrixMcp.server()` SDK'nın `Server`'ını döndürür.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:components` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:foundation` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
