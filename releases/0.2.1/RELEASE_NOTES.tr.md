English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.2.1/RELEASE_NOTES.md)

Pantrix UI 0.2.1, 2026-11-11 tarihinde çıktı. `7a2606c93f9a` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.2.1, 0.2.0'dan sonra bulunan iki şeyi düzeltir. Bir fare uzun bir listenin kaydırma başparmağını uzağa sürüklediğinde liste doğrudan oraya konur: `PantrixCodeEditor`'daki elli bin satırlık bir belge böyle bir sürüklemenin her adımında takılıyordu, Pantrix'in kaydırma çubuğu olan her uzun liste de öyle. Kodlama asistanları için belgeler de kod editörünün örneklerinin kodunu bütün taşır; yedisi ham bir dizgi olarak yazılmış bir yardımcının ilk satırında duruyordu. Genel API değişmez.

## Paketler

| Paket | Önceki sürüme göre (v0.2.0) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 11 dosya, 1 commit | 4.497 bildirim, değişmedi | 8,1 MB, 0,4 KB arttı |
| `com.pantrixui:mcp` | yok | izlenmiyor | 6,3 MB, 5,5 KB arttı |
| `com.pantrixui:detekt-rules` | yok | izlenmiyor | 97,7 KB, değişmedi |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
| `com.pantrixui:foundation` | yok | 1.712 bildirim, değişmedi | 886,0 KB, değişmedi |
| `com.pantrixui:material3` | yok | 21 bildirim, değişmedi | 22,6 KB, değişmedi |
| `com.pantrixui:testing` | yok | 91 bildirim, değişmedi | 49,8 KB, değişmedi |

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
    implementation("com.pantrixui:components:0.2.1")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.2.1-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.2.1/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.2.1-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| Pantrix UI'ın sitesinin <https://pantrixui.com/mcp> adresinde sunduğu MCP sunucusu; sitenin derlendiği sürümde | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp` ya da bir istemcinin `mcpServers` alanında `"type": "http"` ve `"url"` |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.2.1.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i ve sitedeki sunucuyu getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Bileşenler

`com.pantrixui:components`

### Düzeltilenler

*   Bir fare, uzun bir listenin kaydırma çubuğunun başparmağını bir ekrandan uzağa sürüklediğinde liste doğrudan oraya konur; `PantrixCodeEditor`, `PantrixCodeBlock`, `PantrixJsonView`, `PantrixLazyTreeView`, `PantrixDiffView`, `PantrixDataTable` ve `Modifier.pantrixScrollBar` verilen bir `LazyColumn`'da: liste piksel piksel kaydırılıyor ve geçtiği her satırı kuruyordu, elli bin satırlık bir belgenin sürüklenmesi her adımda neredeyse bir saniye takılıyordu.

## Araçlar

`com.pantrixui:mcp`

### Düzeltilenler

*   MCP sunucusunun belgeleri, web demosunun yanındaki `llms-full.txt` ve `pantrix-ui.json` da, yardımcısı ilk kolonda kapanan ham bir dizgi olan bir örneğin kodunu bütün taşır: `PantrixCodeEditor`'ın yedi örneği yardımcının ilk satırında, `private val TASKS = """`'ta duruyordu ve derlenmiyordu.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:foundation` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
