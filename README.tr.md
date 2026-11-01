# Pantrix UI

English: [README.md](./README.md)

Pantrix UI, Compose Multiplatform için bir tasarım sistemi ve uyarlanabilir arayüz kütüphanesidir: Android, iOS,
masaüstü ve web'de, doğrudan Compose Foundation üzerine kurulu, Material'a bağımlı değil. Bu depo onun dağıtıldığı
yerdir: Maven paketleri, notlarıyla sürümleri ve her platformdaki demo uygulaması. Kütüphanenin kaynağı kendi deposunda
durur.

Son sürüm **0.1.0-alpha02**, 2026-10-30 tarihli: [sürümü](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0-alpha02), her paketteki değişikliklerle;
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

Bir modülün bağımlılığı da:

```kotlin
dependencies {
    implementation("com.pantrixui:components:0.1.0-alpha02")
}
```

## Demo

Demo her bileşeni örnekleri ve kodlarıyla gösterir. Dosyaları [her sürüme](https://github.com/develappsancho/pantrix-ui-cmp-package/releases/tag/v0.1.0-alpha02) eklidir:

| Platform | Dosya | Nasıl açılır |
| :--- | :--- | :--- |
| Android 11 (API 30) ve üstü | `PantrixUI-0.1.0-alpha02.apk` | Bir cihaza ya da emülatöre kurulur: `adb install PantrixUI-0.1.0-alpha02.apk` |
| macOS, Apple silikonlu Mac'te | `PantrixUI-0.1.0-alpha02.dmg` | Açılır, PantrixUI Uygulamalar'a taşınır. Apple tarafından noterlenmiş, imzalıdır. |
| iOS simülatörü, Apple silikonlu Mac'te | `PantrixUI-0.1.0-alpha02-ios-simulator.zip` | Zip açılır, uygulama açık bir simülatöre kurulur: `xcrun simctl install booted PantrixUI.app` |
| Web | [https://develappsancho.github.io/pantrix-ui-cmp-package/](https://develappsancho.github.io/pantrix-ui-cmp-package/) | WebAssembly'nin çöp toplayıcısını destekleyen bir tarayıcıda: Chrome ya da Edge 119, Firefox 120, Safari 18.2 ve üstü |

## Lisans

Pantrix UI [Apache Lisansı 2.0](./LICENSE) ile lisanslanmıştır.
