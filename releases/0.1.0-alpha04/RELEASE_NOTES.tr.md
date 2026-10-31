English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0-alpha04/RELEASE_NOTES.md)

Pantrix UI 0.1.0-alpha04, 2026-10-31 tarihinde çıktı. `96ac34f32eef` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.1.0'ın dördüncü önizlemesi: web'de yedek fontlar, böylece bir tarayıcı Mac tuşlarının işaretleri için Google'dan font indirmez; ve MCP sunucusunu Pantrix UI'ın kendi sitesinden getiren Claude Code eklentisi.

## Paketler

| Paket | Önceki sürüme göre (v0.1.0-alpha03) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:foundation` | 14 dosya, 1 commit | 1.585 bildirim: 2 eklendi, 2 değişti | 823,3 KB, 5,1 KB arttı |
| `com.pantrixui:mcp` | 2 dosya, 1 commit | izlenmiyor | 4,4 MB, 8,7 KB arttı |
| `com.pantrixui:detekt-rules` | yok | izlenmiyor | 89,6 KB, değişmedi |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
| `com.pantrixui:components` | 99 dosya, 1 commit | 3.677 bildirim, değişmedi | 6,8 MB, 595,7 KB arttı |
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
    implementation("com.pantrixui:components:0.1.0-alpha04")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.1.0-alpha04-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.1.0-alpha04/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.1.0-alpha04-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.1.0-alpha04.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Foundation

`com.pantrixui:foundation`

### Eklenenler

*   **Yedek fontlar:** `PantrixTypeface(fonts, fallbacks)`, bir tarayıcının yazı tipinin hiçbir fontunda olmayan bir karakteri çizdiği fontları verir. Yazı tipiyle birlikte okunurlar ve `areTypefacesLoaded` onları da bekler; böylece Compose for Web böyle bir karakter için Google'ın sunucularından Noto fontu indirmez: her ziyaretçinin tarayıcısı onu Google'dan istiyordu, çevrimdışı bir sayfa onu boş bırakıyordu ve bir içerik güvenliği politikası Google'a izin vermek zorunda kalıyordu.
*   **Pantrix Symbols:** `PantrixTypeface.Default`, bir `PantrixShortcut`'ın Apple'ın sistemlerinde yazıldığı işaretler (`⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`) için Noto'nun fontlarından kesilmiş 3 KB'lık Pantrix Symbols'a başvurur; bir tarayıcı bunları şimdiye dek Google'dan indiriyordu. Lisansı, SIL Open Font License 1.1, kütüphanenin kaynaklarında onunla birlikte gelir.

### Public API

`com.pantrixui:foundation` paketinde değişenler; önceki sürüme karşı derlenen kod yeniden derlenir, bir çağrı değişebilir:

- `PantrixTypeface(…)`
- `PantrixTypeface.copy(…)`

<details>
<summary>`com.pantrixui:foundation` paketine eklenen 2 bildirim</summary>

- `final fun component2(): List<PantrixFont> in PantrixTypeface`
- `final val fallbacks in PantrixTypeface`

</details>

## Araçlar

`com.pantrixui:mcp`

### Değişenler

*   Paket deposunun Claude Code eklentisi `pantrix-ui` MCP sunucusunu da getirir, Pantrix UI'ın sitesinin sunduğu adresiyle, `https://pantrixui.com/mcp`: onu kuran bir asistanın ne Java'ya ne de jar'a ihtiyacı olur.

### Düzeltilenler

*   MCP sunucusunun jar'ı girdisi bitince çıkar; girdi son mesajın hemen ardından bittiğinde de, `printf … | java -jar`'ın gönderdiği gibi: önceden çalışmayı sürdürüyordu.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:components` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
