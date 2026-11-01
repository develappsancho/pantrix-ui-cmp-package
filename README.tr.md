# Pantrix UI

English: [README.md](./README.md)

Pantrix UI, Compose Multiplatform için bir tasarım sistemi ve uyarlanabilir arayüz kütüphanesidir: Android, iOS,
masaüstü ve web'de, doğrudan Compose Foundation üzerine kurulu, Material'a bağımlı değil. Bu depo onun dağıtıldığı
yerdir: Maven paketleri, notlarıyla sürümleri ve her platformdaki demo uygulaması. Kütüphanenin kaynağı kendi deposunda
durur.

Son sürüm **0.1.0**, 2026-11-01 tarihli: [sürümü](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0), her paketteki değişikliklerle;
[değişiklik günlüğü](./CHANGELOG.tr.md) ve [bütün sürümler](./versions.json).

## Paketler

| Paket | Ne olduğu |
| :--- | :--- |
| `com.pantrixui:components` | Bileşenler. `foundation`'ı ve `annotations`'ı da getirir. |
| `com.pantrixui:foundation` | Tema ve tokenları, uyarlanabilir yerleşim ve platformun hizmetleri |
| `com.pantrixui:annotations` | Bileşenleri araçlara anlatan `@PantrixComponent` ve `@PantrixExample` |
| `com.pantrixui:material3` | Pantrix'in temasıyla Material 3'ünkü arasındaki köprü, iki yönde |
| `com.pantrixui:testing` | Bir uygulamanın testleri için yardımcılar; yalnızca test kaynak kümelerine eklenir |
| `com.pantrixui:detekt-rules` | Kütüphane üzerine kurulan bir uygulama için detekt kuralları |
| `com.pantrixui:mcp` | Kütüphanenin kodlama asistanları için belgeleri ve onlardan cevap veren MCP sunucusu |

## Kullanmak

Paketler GitHub Packages'tadır. GitHub onları okumak için, açık bir depodan da olsa, bir token ister: paket
okuyabilen (`read:packages`) klasik bir kişisel erişim token'ı. Token `~/.gradle/gradle.properties`'e yazılır, bir
projenin dosyalarına asla:

```properties
GitHubPackagesUsername=<GitHub kullanıcı adınız>
GitHubPackagesPassword=<token>
```

Kullanan projenin `settings.gradle.kts`'i:

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

Kütüphanenin kendi deposundan derlenince `./gradlew clean publishToMavenLocal` paketleri yerel Maven deposuna koyar;
proje o zaman GitHub Packages'ın yerine onu anar:

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
    implementation("com.pantrixui:components:0.1.0")
}
```

## Demo

Demo her bileşeni örnekleri ve kodlarıyla gösterir. Dosyaları [her sürüme](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0) eklidir:

| Platform | Dosya | Nasıl açılır |
| :--- | :--- | :--- |
| Android 11 (API 30) ve üstü | `PantrixUI-0.1.0.apk` | Bir cihaza ya da emülatöre kurulur: `adb install PantrixUI-0.1.0.apk` |
| macOS, Apple silikonlu Mac'te | `PantrixUI-0.1.0.dmg` | Açılır, PantrixUI Uygulamalar'a taşınır. Apple tarafından noterlenmiş, imzalıdır. |
| iOS simülatörü, Apple silikonlu Mac'te | `PantrixUI-0.1.0-ios-simulator.zip` | Zip açılır, uygulama açık bir simülatöre kurulur: `xcrun simctl install booted PantrixUI.app` |
| Web | [https://develappsancho.github.io/pantrix-ui-cmp-package/](https://develappsancho.github.io/pantrix-ui-cmp-package/) | WebAssembly'nin çöp toplayıcısını destekleyen bir tarayıcıda: Chrome ya da Edge 119, Firefox 120, Safari 18.2 ve üstü |

## Kodlama asistanları için

Pantrix UI kodlama asistanları (Claude Code, Cursor, Claude Desktop…) için belgelerini kendi kaynaklarından yazar;
böylece bir asistan Material'ın değil, Pantrix'in bileşenlerini yazar. Sürümle gelenlerin hepsi 0.1.0
sürümündendir:

| Ne | Nerede | Nasıl verilir |
| :--- | :--- | :--- |
| Claude Code eklentisi, `pantrix-ui` becerisiyle ve <https://pantrixui.com/mcp> adresindeki MCP sunucusuyla | Bu depo; aynı zamanda bir eklenti pazarı | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| Pantrix UI'ın sitesindeki MCP sunucusu, sitenin derlendiği sürümde | <https://pantrixui.com/mcp>, HTTP üzerinden | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp`, ya da bir istemcinin `mcpServers` alanında `"type": "http"` ve `"url"` |
| MCP sunucusu: kendi başına çalışan tek bir jar, JDK 17 ve üstünde | [Sürüme](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0) ekli `mcp-0.1.0-all.jar`; yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.1.0/` içinde de | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.1.0-all.jar`, ya da bir istemcinin `mcpServers` alanında aynı komut |
| Yalnızca beceri | Sürüme ekli `pantrix-ui-skill-0.1.0.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| `llms.txt` ve götürdüğü belgeler | [https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt](https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt) | Ne beceri ne MCP okuyan bir asistana verilir |

Jar beceriyi ve belgeleri de yazar: `java -jar mcp-0.1.0-all.jar skill .claude/skills` ve
`java -jar mcp-0.1.0-all.jar docs <klasör>`.

## Lisans

Pantrix UI [Apache Lisansı 2.0](./LICENSE) ile lisanslanmıştır.
