English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.1/RELEASE_NOTES.md)

Pantrix UI 0.1.1, 2026-11-02 tarihinde çıktı. `b69fe76acd2e` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.1.1, 0.1.0'dan sonra bulunanları düzeltir: iOS klib'leri artık UIKit'in sınıflarını bağlamaz, onlardan biri Xcode 27.2 ile paylaşılan iOS kodunun commonize edilmesini engelliyordu; web'de sayfanın `<html lang>`'ı uygulamanın en dıştaki temasının dilini söyler; klib'ler de kaynak dosyalarını deponun köküne göre adlandırır, oysa onları derleyen makinedeki yolları bir uygulamaya taşıyorlardı. Genel API değişmez. Web uyumluluğu rehberinin yeni bir bölümü, Safari 27.2'nin Compose'un Wasm sürümünü neden boş bıraktığını ve bir sayfanın yükleyicisinin WebKit'e bunun yerine JavaScript sürümünü nasıl verdiğini anlatır.

## Paketler

| Paket | Önceki sürüme göre (v0.1.0) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:foundation` | 8 dosya, 2 commit | 1.585 bildirim, değişmedi | 825,1 KB, 1,7 KB arttı |
| `com.pantrixui:mcp` | yok | izlenmiyor | 5,6 MB, 4,7 KB arttı |
| `com.pantrixui:detekt-rules` | yok | izlenmiyor | 89,6 KB, değişmedi |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
| `com.pantrixui:components` | yok | 3.677 bildirim, değişmedi | 6,8 MB, değişmedi |
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
    implementation("com.pantrixui:components:0.1.1")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.1.1-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.1.1/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.1.1-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| Pantrix UI'ın sitesinin <https://pantrixui.com/mcp> adresinde sunduğu MCP sunucusu; sitenin derlendiği sürümde | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp` ya da bir istemcinin `mcpServers` alanında `"type": "http"` ve `"url"` |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.1.1.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i ve sitedeki sunucuyu getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Bütün paketler

### Güvenlik

*   Kütüphanenin klib'leri, bir uygulamanın web ve iOS derlemesinin okuduğu, her kaynak dosyasını deponun köküne göre adlandırır: derleyen makinedeki tam yolunu, o kullanıcının adı ve klasörleriyle tutuyorlardı ve web için derlenen bir uygulama bu yolları Wasm'ında taşıyordu. `foundation`, `components`, `annotations`, `testing` ve `material3`.

## Foundation

`com.pantrixui:foundation`

### Düzeltilenler

*   iOS klib'leri `com.pantrixui.foundation.adaptive.uikit` içinde UIKit'in hiçbir sınıfını, örneğin `UIHinge`'i, tutmaz: o paket yalnızca kütüphanenin katlanmayı ve dikey çubuğu okuyan kendi bildirimlerini bağlar. Kotlin/Native'in bağlamalarında olmayan her UIKit sınıfını da bağlıyordu ve Xcode 27.2 ile bunlardan biri onların bilmediği bir tipi andığı için paylaşılan iOS kodu commonize edilemiyordu.
*   Web'de en dıştaki `PantrixTheme`, `locale`'inin dilini sayfanın `<html lang>`'ına yazar ve uygulama dilini değiştirdikçe onu izler: ekran okuyucu sayfayı açıldığı dilde okuyordu, tarayıcı da çeviriyi o dilden öneriyordu. İçindeki bir tema hiçbir şeyi değiştirmez; tema çıkınca sayfanın kendi `lang`'ı geri gelir.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:mcp` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:components` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
