# Klavyeyi Kapatma Rehberi

Bu belge, Compose Multiplatform'da bir alanın yazılım klavyesinin iPhone'da neden kapatılamadığını, bunun için kütüphanenin ne verdiğini ve nasıl sınandığını açıklar. Sorun Pantrix'e özgü değildir: birkaç satırlık bir alanı ya da bir sayı alanı olan **her** Compose Multiplatform ekranında aynı şekilde görülür. 3. bölüm çözümü Pantrix'in API'siyle, 4. bölüm kütüphanesiz, herhangi bir projeye kopyalanabilecek hâliyle verir.

Burada söylenenlerin hangisinin cihazda görüldüğü, hangisinin Compose Multiplatform 1.12.2'nin kaynağında okunduğu ve hangisinin doğrulanmadığı 7. bölümde ayrı ayrı yazılıdır.

## 1. Sorun

### Belirti

*   Bir yorum alanı, bir not, bir mesaj: birkaç satırlık bir alana dokunulur, klavye açılır ve yazılır.
*   iPhone'da klavyenin sağ altındaki tuş yeni satır açar. Klavyeyi kapatan bir tuş yoktur ve alanın dışına dokunmak da onu kapatmaz: klavye ekranın yarısını kaplamaya devam eder, altındaki "Gönder" düğmesine ulaşılamaz.
*   Aynı şey sayı tuş takımında da olur: onda ne eylem tuşu ne kapatma tuşu vardır.
*   Android'de sistemin geri hareketi klavyeyi kapatır; yine de dışarıya dokunmak kapatmaz. Masaüstünde ve web'de boş bir yere tıklamak alanın odağını bırakmaz, oysa kullanıcı tarayıcıdan bunu bekler.
*   Hiçbir birim testi bunu göstermez: klavye sistemindir ve testin sahnesinde çizilmez. Maestro'nun `hideKeyboard` komutu da Compose'un alanından iOS'ta klavyeyi kapatamaz.

### Neden

Yerli iOS uygulamalarında klavyeyi kapatan, alan değil ekrandır: bir dokunuşla görünümün düzenlemesi bitirilir (`endEditing`) ya da kaydırınca klavye iner (`keyboardDismissMode`). Compose'da klavye, odaktaki metin alanıyla birlikte açık kalır; odak bırakılınca kapanır. Ama Compose, bir alanın dışına yapılan dokunuşta odağı kendiliğinden bırakmaz: dokunuşu alacak bir şey yoksa dokunuş hiçbir yere gitmez.

## 2. Çözüm

Ekranın köküne, gösterdiği her şeyin altına bir dokunuş dinleyicisi konur. Dinleyici, **altındaki hiçbir şeyin almadığı** bir dokunuşta odağı bırakır (`FocusManager.clearFocus()`): metin alanı odağını bırakır ve klavye onunla gider.

"Altındaki hiçbir şeyin almadığı" önemlidir. Compose bir dokunuşu önce en içteki düğüme verir; bir düğme ya da metin alanı basışı tüketir. Kökteki dinleyici yalnızca tüketilmemiş bir basışı başlatır: bir düğme işini yapar, metin alanına basmak imlecini taşır, ikisi de odağı bırakmaz. Kaydıran bir sürükleme dokunuş değildir: kaydıran onu tüketir ve dinleyici vazgeçer.

## 3. Pantrix ile

Kütüphane tek bir modifier verir (`com.pantrixui.foundation.keyboard`):

```kotlin
public fun Modifier.clearFocusOnTap(): Modifier
```

Ekranın ya da uygulamanın köküne konur:

```kotlin
Column(Modifier.fillMaxSize().clearFocusOnTap()) {
    PantrixTextArea(state = comment, label = stringResource(Res.string.comment))
    PantrixButton(text = stringResource(Res.string.send), onClick = ::send)
}
```

Her platformda aynı çalışır: iOS'ta klavyeyi kapatmanın yolu odur, Android'de geri hareketinin yanına bir yol ekler, masaüstünde ve web'de boş yere tıklayınca odağın bırakılmasını tarayıcının alışkanlığına getirir. `PantrixTextArea` ve `PantrixFilledTextArea`'nın belgeleri onu anar; demo uygulaması onu kökündeki scaffold'a koyar.

## 4. Pantrix Olmadan

Bir modifier düğümü; `pointerInput` ve `LocalFocusManager` ile.

### 4.1. Ortak Kod (`commonMain`)

```kotlin
fun Modifier.clearFocusOnTap(): Modifier = this then ClearFocusOnTapElement

private data object ClearFocusOnTapElement : ModifierNodeElement<ClearFocusOnTapNode>() {
    override fun create() = ClearFocusOnTapNode()

    override fun update(node: ClearFocusOnTapNode) = Unit
}

private class ClearFocusOnTapNode :
    DelegatingNode(),
    CompositionLocalConsumerModifierNode {
    init {
        delegate(
            SuspendingPointerInputModifierNode {
                detectTapGestures(onTap = { currentValueOf(LocalFocusManager).clearFocus() })
            }
        )
    }
}
```

`detectTapGestures`: `androidx.compose.foundation.gestures`; `SuspendingPointerInputModifierNode`: `androidx.compose.ui.input.pointer`; `DelegatingNode`, `ModifierNodeElement`, `CompositionLocalConsumerModifierNode` ve `currentValueOf`: `androidx.compose.ui.node`.

### 4.2. Bir Composable'ın İçinde

Bir düğüm yazmak istemeyen proje aynı işi bir composable'ın içinde yapabilir:

```kotlin
val focusManager = LocalFocusManager.current
Column(
    Modifier
        .fillMaxSize()
        .pointerInput(focusManager) { detectTapGestures(onTap = { focusManager.clearFocus() }) }
) {
    // ekranın içeriği
}
```

## 5. Yardımcının Yapmadıkları

*   **Kaydırınca klavyeyi indirmez.** iOS'un `keyboardDismissMode` davranışı burada yoktur; kaydırmak odağı olduğu yerde bırakır.
*   **Klavyenin üstüne "Bitti" çubuğu koymaz.** Yerli iOS'un öteki yolu budur (`inputAccessoryView`); Compose'un `PlatformImeOptions`'ı onu da alır. Burada denenmedi.
*   **Kendi penceresi olan bir katmanın dokunuşunu duymaz.** Compose'un `Popup`'ı ve `Dialog`'u ayrı bir pencerede çizilir ve dokunuşlarını ekranın köküne iletmez: içinde bir alan varsa modifier katmanın içeriğine de konur.
*   **Odak alan bir düğmeden odağı geri almaz.** Masaüstünde ve web'de basılan bir düğme odağı kendisi alabilir; alan o zaman odağı düğmeye bırakır. Bu, modifier'ın değil düğmenin işidir.

## 6. Test Etmek

*   **Birim testi:** `ClearFocusOnTapTest` (`commonTest`, beş hedefte): boş yere dokunmak alanın odağını bırakır; alana dokunmak (parmakla da fareyle de) odağı alanda tutar; odak almayan bir düğme işini yapar ve odağı bırakmaz; kaydıran bir sürükleme odağı bırakmaz.
*   **Maestro:** iOS'ta `hideKeyboard` Compose'un alanından klavyeyi kapatamaz. Kökünde `clearFocusOnTap()` olan bir ekranda boş bir yere dokunan bir adım (`tapOn` ile bir metne ya da bir noktaya) aynı işi görür.

Klavyenin gerçekten kapandığı yalnızca bir cihazda ya da simülatörde görülür.

## 7. Doğrulama

### Görülenler

*   iPhone 18 Pro Max simülatörü, iOS 27.0 (2026-10-26), demo uygulamasının metin kutusu sayfası: birkaç satırlık alanın klavyesinin sağ alt tuşu yeni satır açtı ve klavyede onu kapatan bir tuş yoktu. Açıklama metnine dokununca klavye kapandı ve alan odağı bıraktı; alana yeniden dokununca klavye açıldı.
*   Android emülatörü, Pixel 7 Pro, API 33 (2026-10-26), demo uygulamasının metin kutusu sayfası: açıklama metnine dokununca klavye kapandı (`dumpsys input_method`: `mInputShown=false`); alanın içine dokununca açıldı, ikinci bir dokunuşta açık kaldı ve imleç taşındı.
*   Web (Chrome, Wasm, 2026-10-26): odaktaki bir alanın dışında boş bir yere tıklayınca alanın kenarlığı dinlenme hâline döndü; alana tıklamak odağı korudu.

### Kaynakta Okunanlar

*   `detectTapGestures`, ilk basışı `awaitFirstDown()` ile bekler ve tüketilmiş bir basışı saymaz: `foundation` 1.12.2, `commonMain/androidx/compose/foundation/gestures/TapGestureDetector.kt`.
*   Metin alanının dokunuşları `detectTapAndPress` iledir ve basışı tüketir (`awaitFirstDown().also { it.consume() }`): aynı dosya; metin alanı tarafı `TextFieldSelectionState.defaultDetectTextFieldTapGestures`. Android'deki karşılığı da aynı varsayılanı çağırır (`foundation-android` 1.12.1, `TextFieldSelectionState.android.kt`).

### Doğrulanmayanlar

*   **iPad** ve donanım klavyesi bağlı bir iPhone.
*   **Gerçek cihaz** ve iOS'un eski sürümleri.
*   **Telefonun tarayıcısında web.**

## 8. Bu Depoda Nerede

| Ne | Nerede |
| :--- | :--- |
| Modifier | `ui/foundation/src/commonMain/kotlin/com/pantrixui/foundation/keyboard/ClearFocusOnTap.kt` |
| Testler | `ClearFocusOnTapTest` (`commonTest`) |
| Kullananlar | Demo uygulamasının kökü (`app/shared/.../demo/App.kt`); belgelerinde `PantrixTextArea`, `PantrixFilledTextArea` |
| Demo | `Text Area` sayfasında "Dışarı dokununca klavye kapanır" |
