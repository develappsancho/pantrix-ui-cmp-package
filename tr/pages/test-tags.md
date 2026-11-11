# Test etiketleri

Otomasyonun bir bileşeni bulduğu etiket: `Bölüm.Bileşen_anahtar`. Etiket görünen yazıdan değil, dilden bağımsız bir anahtardan gelir: uygulama başka bir dilde açılınca testler kırılmaz.

## Özellikler

- **Anahtar.** Bir bileşenin `tagKey`'i, forma bağlı bir bileşende alanın `id`'si: `PantrixButton(tagKey = "pay")` `Button_pay` olur. Verilmezse çağrının yerinden bir anahtar türetilir.
- **Bölüm.** `TestScope("Checkout") { … }` içindeki etiketlerin başına bölümün adını koyar; iç içe bölümler birleşir: `Checkout.Payment.Button_pay`. `LocalTestScope` o noktadaki bölümdür.
- **Politika.** `TestTagPolicy.Stable` etiketler, `Off` hiçbir şeyi etiketlemez; `PantrixTheme(testTagPolicy = …)` ya da `LocalTestTagPolicy`.
- **Kendi bileşenin.** `rememberPantrixTestTag(component, tagKey)` aynı kuralla bir etiket verir, `Modifier.pantrixTestTag(tag)` onu koyar. Bir bileşenin üstüne kurulan kontrolün anahtarı `derivedTagKey`'dir.
- **Testin aradığı.** `pantrixTestTagOf(component, tagKey, scope)` bir bileşenin bir anahtarla ve bir bölümde taşıdığı etiketi ekran kurulmadan verir: bir test ya da cihaz otomasyonu bu etiketi arar.

## Örnekler

### Bir bölümdeki düğme

Bir düğmenin etiketi iki bölümün içinde. Düğmeye yalnızca `tagKey = "pay"` verildi; bölümler (`TestScope`) etiketin başına adlarını koyar. Alttaki satır aynı etiketi `rememberPantrixTestTag("Button", "pay")` ile kurar, bölümü `LocalTestScope`'tan, politikayı `LocalTestTagPolicy`'den okur.

```kotlin
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.LocalTestScope
import com.pantrixui.foundation.testing.LocalTestTagPolicy
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

TestScope("Checkout") {
    TestScope("Payment") {
        PantrixButton(text = "Öde", onClick = {}, tagKey = "pay")
        val tag = rememberPantrixTestTag(component = "Button", tagKey = "pay")
        PantrixText(
            text = "Etiket: $tag · bölüm: ${LocalTestScope.current} · politika: ${LocalTestTagPolicy.current.name}",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Kendi bileşeninin etiketi

Uygulamanın kendi bileşeni de aynı kuralla etiketlenir: `PriceRow` etiketini `rememberPantrixTestTag` ile kurar ve `pantrixTestTag` ile koyar. İçindeki düğme satırın üstüne kurulmuştur: anahtarı `derivedTagKey("total", "edit")`'tir, `total_edit`. Alttaki satır etiketleri yazar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.derivedTagKey
import com.pantrixui.foundation.testing.pantrixTestTag
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

PriceRow(label = "Toplam", amount = "1.240 TL", tagKey = "total")

@Composable
private fun PriceRow(
    label: String,
    amount: String,
    tagKey: String
) {
    val tag = rememberPantrixTestTag(component = "PriceRow", tagKey = tagKey)
    val editKey = derivedTagKey(tagKey, "edit")
    Row(
        modifier = Modifier.pantrixTestTag(tag),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = "$label: $amount")
        PantrixButton(text = "Düzenle", onClick = {}, tagKey = editKey)
    }
    PantrixText(
        text = "Satır: $tag · düğmenin anahtarı: $editKey",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}
```

### Etiketsiz bir yayın

Etiketsiz bir yayın: `TestTagPolicy.Off` verilen tema ağaca hiçbir etiket koymaz. Bileşen etiketini yine bilir ve olayları onunla gider: `rememberPantrixTestTag` etiketi kurar, `Modifier.pantrixTestTag` onu ağaca koymaz. Uygulamanın kendisinin koyduğu bir `Modifier.testTag` yine durur: bir dış aracın beklediği birkaç etiket için.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.TestTagPolicy
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

PantrixTheme(testTagPolicy = TestTagPolicy.Off) {
    val tag = rememberPantrixTestTag(component = "Button", tagKey = "save")
    PantrixText(text = "Olayların etiketi: $tag · ağaçta: yok", style = PantrixTheme.typography.footnote)
}
```

### Testin aradığı etiket

Bir testin aradığı etiket, ekran kurulmadan: `pantrixTestTagOf("Button", "Save draft", scope = "Editor")`. Anahtar etikete küçük harflerle ve harf ya da rakam olmayanların yerine `_` ile girer: `Editor.Button_save_draft`. Düğmenin ekranda taşıdığı etiket de odur.

```kotlin
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.testing.pantrixTestTagOf
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

TestScope("Editor") {
    PantrixButton(text = "Taslağı kaydet", onClick = {}, tagKey = "Save draft")
    val carried = rememberPantrixTestTag(component = "Button", tagKey = "Save draft")
    val lookedFor = pantrixTestTagOf(component = "Button", tagKey = "Save draft", scope = "Editor")
    PantrixText(
        text = "Aranan: $lookedFor · taşınan: $carried",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}
```

## API

### TestScope

`import com.pantrixui.foundation.testing.TestScope`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun TestScope(
    name: String,
    content: @Composable () -> Unit
)
```

Bir ekranı ya da bölümü adlandırır, içindeki etiketler bu adla nitelenir: `TestScope("LoginScreen") { ... }`.

İç içe bölümler birleşir: bir test düştüğünde etiket, okuyanın bileşenin ağaçta nerede durduğunu bilmesine gerek kalmadan okunur.

Parametreler:

- `name: String`: ekranın ya da bölümün adı; içindeki etiketlerin önüne konur: `LoginScreen.Button_save`.
- `content: @Composable () -> Unit`: bileşenlerinin etiketlerini `name`'in nitelediği ekran ya da bölüm.

### LocalTestScope

`import com.pantrixui.foundation.testing.LocalTestScope`, `com.pantrixui:foundation` içinden

```kotlin
val LocalTestScope: ProvidableCompositionLocal<String?>
```

Dıştaki `TestScope` zinciri, örneğin `Checkout.PaymentForm`.

### TestTagPolicy

`import com.pantrixui.foundation.testing.TestTagPolicy`, `com.pantrixui:foundation` içinden

```kotlin
enum class TestTagPolicy
```

Bileşenlerin otomasyon etiketlerini, testlerin ve platformun arayüz otomasyonunun onları bulduğu semantik ağaca koyup koymadığı ve bir etiketi neyden kurdukları.

Değerleri:

- `Stable`: Anahtar: `tagKey`, ya da forma bağlı biçimlerde alanın kimliği; yoksa çağrının yerinin anahtarı.
- `Off`: Pantrix semantik ağaca hiçbir etiket koymaz. Bileşen etiketini yine bilir ve analitik olayları onu taşır: etiketlerini ağacın dışında tutan bir yayın sürümü olaylarını yine birbirinden ayırır. Uygulamanın kendisinin koyduğu bir `Modifier.testTag` etkilenmez: bir yayın sürümü, bir dış aracın dayandığı birkaç etiketi böyle korur.

### LocalTestTagPolicy

`import com.pantrixui.foundation.testing.LocalTestTagPolicy`, `com.pantrixui:foundation` içinden

```kotlin
val LocalTestTagPolicy: ProvidableCompositionLocal<TestTagPolicy>
```

Buradaki bileşenlerin otomasyon etiketlerini semantik ağaca koyup koymadığı: `PantrixTheme(testTagPolicy = …)`. Okuyanlar onu izler: çevresindeki politika değişince bir etiketin düğümü etiketini ağaçtan çıkarır ya da geri koyar.

### rememberPantrixTestTag

`import com.pantrixui.foundation.testing.rememberPantrixTestTag`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixTestTag(
    component: String,
    tagKey: String? = null
): String
```

Bir bileşenin otomasyon etiketini üretir: `Scope.Component_key`.

Anahtar `tagKey`'dir (forma bağlı biçimler alanlarının kimliğini verir); verilmezse çağrının yerinin anahtarı: `Scope.Component#1k3z9`. **Görünen yazı hiçbir zaman kaynak değildir**: çevrilen yazıdan türetilen bir etiket uygulama başka bir dilde çalışınca değişir ve ikinci bir dil yayınlandığı an her otomasyon takımını sessizce bozar.

Hazır bir etiket için bilerek bir parametre yoktur. Bir dış takımın zaten kullandığı bir kimliğe uyması gereken çağıran onu bileşenin `modifier`'ında Compose'un kendi `Modifier.testTag`'iyle verir; o, semantik ağaçta bu etiketin yerine geçer.

Etiket, `TestTagPolicy` ne olursa olsun kurulur: bileşenin analitik olayları onu iki durumda da taşır; `pantrixTestTag` onu semantik ağaca yalnızca politika `TestTagPolicy.Stable`'ken koyar.

Parametreler:

- `component: String`: bileşenin adı, örneğin `Button`
- `tagKey: String?`: dilden bağımsız bir geliştirici anahtarı, örneğin `save`: küçük harflerle ve rakamlarla yazılır, etiket ilk `MAX_TAG_KEY_LENGTH` karakterini taşır. Bunun üstüne kurulan bir kontrolün anahtarı `derivedTagKey` ile yapılır.

### Modifier.pantrixTestTag

`import com.pantrixui.foundation.testing.pantrixTestTag`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.pantrixTestTag(tag: String?): Modifier
```

`tag`'i, durduğu yerdeki `TestTagPolicy` `TestTagPolicy.Stable`'ken test etiketi olarak koyar; `TestTagPolicy.Off`'ken ya da null için hiçbir şey koymaz: semantik ağaca o zaman hiç düğüm eklenmez.

Temanın tanılaması açıkken, pencerenin iki düğümünün bir buçuk saniye boyunca taşıdığı bir etiket `PantrixCheck.DuplicateTestTag` olarak bildirilir: onu arayan bir test ikisini de bulur. Giden sayfayla gelen sayfayı aynı etiketlerle gösteren bir sayfa geçişi o zamana kadar biter.

Parametreler:

- `tag: String?`

### derivedTagKey

`import com.pantrixui.foundation.testing.derivedTagKey`, `com.pantrixui:foundation` içinden

```kotlin
fun derivedTagKey(
    tagKey: String,
    part: String
): String
```

Başka bir kontrolün üstüne kurulan bir kontrolün anahtarı: bir sayfa boyunun select'i, bir breadcrumb'ın menüsü. Dıştaki kontrolün kendi `tagKey`'i ve ardından içtekinin adı `part`'tır: `orders` ve `page_size`, `orders_page_size` olur ve select `Select_orders_page_size` diye etiketlenir.

Bir etiket bir anahtarın ilk `MAX_TAG_KEY_LENGTH` karakterinden fazlasını taşımaz. Elle birleştirilen uzun bir anahtar parçanın adını bu kesimde yitirir ve bir kontrolün iki parçası aynı anahtara varırdı. Burada geri çekilen dıştaki anahtardır: `part`'ı bütün bırakacak kadar kısa kesilir.

Parametreler:

- `tagKey: String`: dıştaki kontrolün anahtarı, çağıranın yazdığı gibi.
- `part: String`: içteki kontrolün dıştakinde ne olduğu, bir anahtarın yazıldığı harflerle: `page_size`.

### pantrixTestTagOf

`import com.pantrixui.foundation.testing.pantrixTestTagOf`, `com.pantrixui:foundation` içinden

```kotlin
fun pantrixTestTagOf(
    component: String,
    tagKey: String,
    scope: String? = null
): String
```

`tagKey` verilen bir bileşenin `scope` içinde taşıdığı otomasyon etiketi: bir testin ya da platformun arayüz otomasyonundaki bir akışın onu bulduğu şey. `save` verilen bir `Button` `Button_save`'dir, `TestScope("Checkout")` içinde `Checkout.Button_save`. `rememberPantrixTestTag` anahtarlı bir etiketi bununla kurar: burada kurulan etiket, bileşenin taşıdığı etikettir.

Parametreler:

- `component: String`: bileşenin adı, örneğin `Button`.
- `tagKey: String`: bileşene verilen anahtar, çağıranın yazdığı gibi: etiket onu, bileşenin yaptığı gibi küçük harflerle ve rakamlarla yazar.
- `scope: String?`: bileşenin içinde durduğu `TestScope` zinciri, örneğin `Checkout.PaymentForm`; birinin dışında null.
