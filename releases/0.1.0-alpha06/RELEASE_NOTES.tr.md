English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha06/RELEASE_NOTES.md)

Pantrix UI 0.1.0-alpha06, 2026-11-01 tarihinde çıktı. `9d960e82212f` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.1.0'ın altıncı önizlemesi, kodlama asistanları ve onların üstüne kurulan araçlar için: MCP sunucusu Türkçe de arar, bir sorunun sözcüklerinin en çoğunu taşıyanı öne koyar ve sekiz aracının cevabını veri olarak da verir.

## Paketler

| Paket | Önceki sürüme göre (v0.1.0-alpha05) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:mcp` | 7 dosya, 1 commit | izlenmiyor | 5,6 MB, 1,2 MB arttı |
| `com.pantrixui:detekt-rules` | yok | izlenmiyor | 89,6 KB, değişmedi |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
| `com.pantrixui:components` | yok | 3.677 bildirim, değişmedi | 6,8 MB, değişmedi |
| `com.pantrixui:foundation` | yok | 1.585 bildirim, değişmedi | 823,3 KB, değişmedi |
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
    implementation("com.pantrixui:components:0.1.0-alpha06")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.1.0-alpha06-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha06/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.1.0-alpha06-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| Pantrix UI'ın sitesinin <https://pantrixui.com/mcp> adresinde sunduğu MCP sunucusu; sitenin derlendiği sürümde | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp` ya da bir istemcinin `mcpServers` alanında `"type": "http"` ve `"url"` |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.1.0-alpha06.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i ve sitedeki sunucuyu getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Araçlar

`com.pantrixui:mcp`

### Eklenenler

*   MCP sunucusunun araçları Türkçe de arar ve cevaplarının bileşenleri, sayfaları, rehberleri, örnekleri, bildirimleri ve ikonları hangi dilde vereceğini seçen bir `language` alır, `en` ya da `tr`: `search_components` "bildirim" ile `PantrixSnackbarHost`'u, "tarih seçici" ya da "tarih secici" ile `PantrixDatePicker`'ı bulur.
*   MCP sunucusunun sekiz aracı, `search_components`, `get_component_metadata`, `search_api`, `get_api`, `search_icons`, `search_documentation`, `list_examples` ve `get_example`, cevabını çağrının yapılandırılmış içeriğinde veri olarak da verir; biçimini çıktı şemaları söyler: cevaptan kendi sayfasını kuran bir program için.
*   Kodlama asistanlarının belgelerinde kütüphanenin Türkçesi veri olarak, `tr/pantrix-ui.json`, ve modüllerin API'sinin Türkçesi, `tr/api/<modül>.md`, var; her bileşenin açıklaması ve anahtar sözcükleri ve her ikonun açıklaması Türkçedir.

### Değişenler

*   MCP sunucusunun aramaları önce bir sorunun sözcüklerinin en çoğunu ve sorunun andığı bir anahtar sözcüğü taşıyanı getirir: "a comment box with several lines" önce `PantrixTextArea`'yı getirir; önceden `PantrixLineChart` önce geliyordu.

### Düzeltilenler

*   `search_icons` bir ikonun sağdan sola okunan bir dilde yansıdığını bir kez söyler: önceden iki kez söylüyordu.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:components` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:foundation` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
