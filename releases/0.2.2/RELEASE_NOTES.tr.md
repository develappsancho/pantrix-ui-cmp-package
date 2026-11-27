English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.2.2/RELEASE_NOTES.md)

Pantrix UI 0.2.2, 2026-11-28 tarihinde çıktı. `c54edfd66957` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.2.2, bir karşılaştırmanın satırlarında neyin yanlış olduğunu söylemesini sağlar. `PantrixDiffView`, `PantrixCodeBlock`'un çizdiği gibi, bir satırın iki tarafına da bir `CodeMark` çizer: çubuğunu, satırın altında da mesajını, onu söyleyeni ve eylemlerini; işaretli bir satır hiç katlanmaz. Kodlama asistanlarının belgeleri, kütüphane büyüdükçe eskiyen sayılar yazmaz. 0.2.1'e karşı derlenmiş kod çalışmayı sürdürür: yeni olan, eskinin yanına eklenir.

## Paketler

| Paket | Önceki sürüme göre (v0.2.1) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 18 dosya, 1 commit | 4.501 bildirim: 4 eklendi | 8,1 MB, 18,8 KB arttı |
| `com.pantrixui:mcp` | yok | izlenmiyor | 6,3 MB, 9,6 KB arttı |
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
    implementation("com.pantrixui:components:0.2.2")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.2.2-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.2.2/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.2.2-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| Pantrix UI'ın sitesinin <https://pantrixui.com/mcp> adresinde sunduğu MCP sunucusu; sitenin derlendiği sürümde | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp` ya da bir istemcinin `mcpServers` alanında `"type": "http"` ve `"url"` |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.2.2.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i ve sitedeki sunucuyu getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Bileşenler

`com.pantrixui:components`

### Eklenenler

*   `DiffLine.beforeMark` ve `DiffLine.afterMark`, `PantrixDiffView`'ın bir satırının her tarafı hakkında söylenen, bir `CodeMark` olarak: tarafın başındaki çubuk, mesaj, onu söyleyen ve işaretin eylemleri satırın altında düğmeler olarak, değişmeyen bir satırda da işaretin bandı. İşaretli bir satır hiç katlanmaz. `DiffLine.copy` `diffLines`'ın verdiği satırları işaretler; 0.2.1'in kurucusuyla derlenmiş kod çalışmayı sürdürür.

### Public API

<details>
<summary>`com.pantrixui:components` paketine eklenen 4 bildirim</summary>

- `constructor(DiffKind, String?, String?, Int?, … 9 parameters) in DiffLine`
- `final fun copy(DiffKind, String?, String?, Int?, … 9 parameters): DiffLine in DiffLine`
- `final val afterMark in DiffLine`
- `final val beforeMark in DiffLine`

</details>

## Araçlar

`com.pantrixui:mcp`

### Düzeltilenler

*   Kodlama asistanlarının rehberi ve test rehberi, MCP sunucusunun belgelerinde ve `llms-full.txt`'de, kütüphane büyüdükçe eskiyen sayılar yazmaz: 24 rehber, demo'nun 118 sayfası ve 4,7 MB'lık bir `llms-full.txt` diyorlardı, 0.2.1'de 29 rehber, 126 sayfa ve 5,2 MB var.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:foundation` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
