English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.1.0/RELEASE_NOTES.md)

Pantrix UI 0.1.0, 2026-11-01 tarihinde çıktı. `2d799c7af752` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.1.0, altı önizlemeden sonra Pantrix UI'ın ilk sürümü. Ondan önce önizlemeleri kullananın karşılaşacağı hatalar gözden geçirildi ve düzeltildi: hiçbir şeyin açamadığı bir bağlantı, başarısız olan bir yenileme ve genişliği olmayan bir kenar artık uygulamaya ulaşmaz; renkli bir bar'ın sekmeleri ve düğmeleri onun üstünde okunur; aramalar harfleri temanın dilinin yazdığı gibi karşılaştırır; bir kontrolün üstündeki imleç bir tıklamanın neye basacağını gösterir. İki ad, üstüne bir şey kurulmadan değişir: `DividerAlign`'ın değerleri ve `PantrixTooltip`'in `modifier`'ının neye uygulandığı. Paketleri hâlâ yalnızca GitHub Packages'tadır ve bir token ister; Maven Central sonra gelir.

## Paketler

| Paket | Önceki sürüme göre (v0.1.0-alpha06) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 103 dosya, 1 commit | 3.677 bildirim: 3 eklendi, 1 değişti, 3 kaldırıldı | 6,8 MB, 12,0 KB arttı |
| `com.pantrixui:foundation` | 8 dosya, 1 commit | 1.585 bildirim, değişmedi | 823,4 KB, 0,1 KB arttı |
| `com.pantrixui:mcp` | yok | izlenmiyor | 5,6 MB, 13,9 KB arttı |
| `com.pantrixui:detekt-rules` | yok | izlenmiyor | 89,6 KB, değişmedi |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
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
    implementation("com.pantrixui:components:0.1.0")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.1.0-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.1.0/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.1.0-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| Pantrix UI'ın sitesinin <https://pantrixui.com/mcp> adresinde sunduğu MCP sunucusu; sitenin derlendiği sürümde | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp` ya da bir istemcinin `mcpServers` alanında `"type": "http"` ve `"url"` |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.1.0.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i ve sitedeki sunucuyu getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Bileşenler

`com.pantrixui:components`

### Değişenler

*   **Kırıcı:** `DividerAlign`'ın değerleri, kütüphanenin öteki enum'ları gibi `Start`, `Center` ve `End` yazılır: önceden `START`, `CENTER` ve `END` idi.
*   **Kırıcı:** `PantrixTooltip`'in `modifier`'ı kontrolün yerine uygulanır; böylece bir hizalama ya da ağırlık kontrolü yerleştirir, etiket de onunla gider: önceden etikete uygulanıyordu.
*   Basılınca bir şey seçen her kontrol, üstünde imleç dururken kendi renginden silik bir örtüyle örtülür, menünün satırlarının ve takvimin günlerinin örtüldüğü gibi; böylece fare bir tıklamanın neye basacağını gösterir: `PantrixButton`, `PantrixIconButton`, `PantrixChip`, `PantrixSegmentButton`, `PantrixTabs`, `onClick`'i olan bir `PantrixCard`, `PantrixCheckbox`, `PantrixRadioButton`, `PantrixSwitchButton`, `PantrixPagination`, gezinme bar'ının ve rayının hedefleri, bir grafiğin lejantı, bir snackbar'ın düğmeleri, metin, tarih, saat ve parola alanlarının ve elastic tarih seçicinin içindeki düğmeler.
*   `PantrixSelect`, `PantrixMultiSelect` ve `PantrixJsonView` harfleri temanın dilinin küçük yazdığı gibi karşılaştırır: Türkçede "i" "İzmir"i bulur, "Isparta"yı bulmaz; "ı" "Isparta"yı bulur. `jsonViewSearchPaths` arayacağı `language`'ı alır.
*   `PantrixTimePicker`'ın saat sütunu, `maxTime` `minTime`'dan önce geldiğinde 24 saatte `minTime`'ın saatiyle başlar; böylece bir gecenin saatleri bir arada durur: 22, 23, 00 ve sonrası.

### Düzeltilenler

*   `PantrixLink(url)`, cihazda hiçbir şeyin açamadığı bir adresi, Compose'un bir metnin bağlantılarında yaptığı gibi bırakır: önceden uygulamayı durduruyordu.
*   `PantrixElasticDatePicker`'ın Yenile düğmesi, `onRefresh`'i hata attığında dönmeyi bırakır: önceden hata uygulamayı durduruyordu.
*   Stili genişlik vermeyen bir kenar, halka ya da çizgi çizilmez: `PantrixChip`, `PantrixAlert`, `PantrixTag`, `PantrixFileItem`, `PantrixFileDrop`, `PantrixTextField`, `PantrixFilledTextField`, `PantrixRadioButton`, `PantrixCheckbox`, `PantrixSidebar`'ın kılavuzu, `PantrixButtonGroup`'un ayırıcısı ve bir select'in işaretli satırı onu saç teli kalınlığında çiziyordu.
*   Üstüne ne yazıldığını söyleyen bir dolguda, markanın renginde bir üst bar'da, `PantrixTabs`'in seçili sekmesi ve çizgisi, `ButtonVariant.Outline` ve `ButtonVariant.Text` düğmeler, kendi dolgusu olmayan bir ikon düğmesi ve oradaki odak halkası dolgunun söylediği gibi yazılır: önceden temanın dolgudan zor ayırt edilen `primary`'siyle çiziliyorlardı.

### Public API

`com.pantrixui:components` paketinde değişenler; önceki sürüme karşı derlenen kod yeniden derlenir, bir çağrı değişebilir:

- `jsonViewSearchPaths(…)`

`com.pantrixui:components` paketinden kaldırılan bildirimler; onları kullanan çağrı bozulur:

- `enum entry CENTER in DividerAlign`
- `enum entry END in DividerAlign`
- `enum entry START in DividerAlign`

<details>
<summary>`com.pantrixui:components` paketine eklenen 3 bildirim</summary>

- `enum entry Center in DividerAlign`
- `enum entry End in DividerAlign`
- `enum entry Start in DividerAlign`

</details>

## Foundation

`com.pantrixui:foundation`

### Düzeltilenler

*   Genişliği sıfır verilen `Modifier.focusRing` halka çizmez: Compose onu saç teli kalınlığında çiziyordu.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:mcp` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:testing` satırı yok.
