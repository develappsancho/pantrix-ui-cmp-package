# Pano

Pano, düz metin için. Compose'un panosu her platformda başka bir tür alır ve verir; `PantrixClipboard` bir metni her platformda aynı yolla koyar, oraya varıp varmadığını söyler ve panodaki metni okur.

## Özellikler

- **Kopyalamak.** `rememberPantrixClipboard()` panoyu verir; `copyText(text, label)` metni koyar ve vardıysa `true` döner. `label` yalnızca Android'de taşınır.
- **Okumak.** `readText()` panodaki düz metni verir, yoksa `null`. iOS başka bir uygulamanın kopyaladığını okumadan önce, tarayıcı da her okumadan önce izin sorar.
- **Yapıştırmayı duymak.** `Modifier.onPaste` odak düğümün içindeyken ⌘V'yi ya da Ctrl+V'yi duyar, içteki bir metin alanı yapıştırmayı kendisi almadıkça. Web'de tarayıcının kendi yapıştırmasını duyar: tarayıcı metni soru sormadan verir.
- **Panonun huyu.** `ClipboardTraits` panonun nasıl olduğunu söyler: yazılabilir mi (`writable`), okunabilir mi (`readable`), sistem kopyalananı kendisi gösteriyor mu (`announcedBySystem`). Güvenli olmayan bir web sayfasının ve ekransız bir JVM'in panosu yoktur; Android 13 ve sonrası kopyalananı kendisi gösterir ve uygulamadan bir daha söylememesini ister.
- **Bir testte.** `LocalClipboardTraits` panonun huyunu verir: bir test ya da önizleme başka bir platformunkini verir.
- **Başka bir uygulamaya göndermek.** `rememberShareSheet()` platformun paylaşım sayfasını verir: Android'in seçicisi, iOS'un `UIActivityViewController`'ı, tarayıcının `navigator.share`'i. Masaüstünde ve `navigator.share`'i olmayan bir tarayıcıda `null` döner: ekran o zaman kopyalamayı önerir. `share(text, title)` sonucu bir `ShareResult` olarak söyler. `LocalShareSheet` bir test ya da önizlemede başka bir sayfa, ya da hiçbirini verir.

## Örnekler

### Bir metni kopyalamak

Bir metni kopyalamak. Düğme IBAN'ı panoya koyar ve sonucu kartın "Son olay" satırına yazar. Sistem kopyalananı kendisi gösteriyorsa (Android 13 ve sonrası) uygulama bir şey söylemez: başarıyı ikinci kez duyurmak gürültüdür. Üstteki satır bu platformun panosunu anlatır (`currentClipboardTraits()`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.PantrixClipboard
import com.pantrixui.foundation.platform.currentClipboardTraits
import com.pantrixui.foundation.platform.rememberPantrixClipboard
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val clipboard: PantrixClipboard = rememberPantrixClipboard()
val traits = currentClipboardTraits()
PantrixText(
    text = "Yazılabilir: ${if (traits.writable) "evet" else "hayır"} · " +
        "sistem duyuruyor: ${if (traits.announcedBySystem) "evet" else "hayır"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
PantrixButton(
    text = "IBAN'ı kopyala",
    onClick = {
        scope.launch {
            val copied = clipboard.copyText(IBAN, label = "IBAN")
            if (!copied || !clipboard.traits.announcedBySystem) {
                report(if (copied) "IBAN kopyalandı" else "IBAN kopyalanamadı")
            }
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "copy_iban"
)

private const val IBAN = "TR33 0006 1005 1978 6457 8413 26"
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Panodan yapıştırmak

Panodan yapıştırmak. Düğme panodaki metni okur (`readText()`): üstteki örnekte kopyalanan IBAN'ı bulur. Alttaki kart bir yapıştırmayı duyar (`Modifier.onPaste`): karta bas, sonra ⌘V'ye ya da Ctrl+V'ye; web'de tarayıcı metni soru sormadan verir. İkisi de okuduğunu kartın "Son olay" satırına yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.onPaste
import com.pantrixui.foundation.platform.rememberPantrixClipboard
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val clipboard = rememberPantrixClipboard()
val zone = remember { FocusRequester() }
var pasted by remember { mutableStateOf<String?>(null) }
PantrixText(
    text = "Okunabilir: ${if (clipboard.traits.readable) "evet" else "hayır"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
PantrixButton(
    text = "Panodakini oku",
    onClick = {
        scope.launch {
            val text = clipboard.readText()
            report(if (text == null) "Panoda metin yok" else "Panoda: ${text.take(SHOWN)}")
        }
    },
    variant = ButtonVariant.Outline,
    enabled = clipboard.traits.readable,
    tagKey = "read_clipboard"
)
PantrixCard(
    modifier = Modifier
        .onPaste { text ->
            pasted = text
            report("Yapıştırıldı: ${text.take(SHOWN)}")
        }
        .focusRequester(zone),
    variant = CardVariant.Outlined,
    onClick = { zone.requestFocus() },
    tagKey = "paste_zone"
) {
    PantrixText(text = pasted?.let { "Yapıştırılan: ${it.take(SHOWN)}" } ?: "Bas, sonra ⌘V ya da Ctrl+V")
}

private const val SHOWN = 40
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Yazılamayan bir pano

Yazılamayan bir pano: içteki bölüm `LocalClipboardTraits`'e `ClipboardTraits(writable = false)` verdi, güvenli olmayan bir web sayfasında olduğu gibi. Kod bloğunun kopyalama düğmesine bas: blok kopyalayamadığını söyler, bir başarı göstermez.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.foundation.platform.ClipboardTraits
import com.pantrixui.foundation.platform.LocalClipboardTraits

CompositionLocalProvider(LocalClipboardTraits provides ClipboardTraits(writable = false)) {
    PantrixCodeBlock(code = "./gradlew :app:webApp:wasmJsBrowserDistribution", language = "Shell", tagKey = "no_board")
}
```

### Başka bir uygulamaya göndermek

Başka bir uygulamaya göndermek: düğme bağlantıyı platformun paylaşım sayfasına verir, sonucu kartın "Son olay" satırına yazar. Android seçicinin ne seçildiğini söylemez: "açıldı" der, "gönderildi" demez. Masaüstünde sayfa yoktur ve düğme bağlantıyı kopyalar. Anahtarı aç: içteki bölüm `LocalShareSheet`'e hiçbirini vermez, sayfası olmayan bir platformdaki gibi.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.platform.LocalShareSheet
import com.pantrixui.foundation.platform.ShareResult
import com.pantrixui.foundation.platform.ShareSheet
import com.pantrixui.foundation.platform.rememberPantrixClipboard
import com.pantrixui.foundation.platform.rememberShareSheet
import kotlinx.coroutines.launch

var none by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = none,
    onCheckedChange = { none = it },
    label = "Sayfası olmayan bir platform gibi",
    tagKey = "no_sheet"
)
if (none) {
    CompositionLocalProvider(LocalShareSheet provides null) { ShareOrCopy() }
} else {
    ShareOrCopy()
}

@Composable
private fun ShareOrCopy() {
    val report = LocalExampleEvents.current
    val sheet: ShareSheet? = rememberShareSheet()
    val clipboard = rememberPantrixClipboard()
    val scope = rememberCoroutineScope()
    if (sheet != null) {
        PantrixButton(
            text = "Başka bir uygulamayla gönder",
            onClick = {
                sheet.share(LINK, title = "Sipariş 4821") { result ->
                    report(
                        when (result) {
                            ShareResult.Shared -> "Gönderildi"
                            ShareResult.Cancelled -> "Sayfa kapatıldı"
                            ShareResult.Started -> "Paylaşım sayfası açıldı"
                            ShareResult.Failed -> "Sayfa gösterilemedi"
                        }
                    )
                }
            },
            tagKey = "send_link"
        )
    } else {
        PantrixButton(
            text = "Bağlantıyı kopyala",
            onClick = { scope.launch { report(if (clipboard.copyText(LINK)) "Kopyalandı" else "Kopyalanamadı") } },
            variant = ButtonVariant.Outline,
            tagKey = "copy_link"
        )
    }
}

private const val LINK = "https://formatico.pantrixui.com/s/2f9"
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

## API

### PantrixClipboard

`import com.pantrixui.foundation.platform.PantrixClipboard`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixClipboard
```

Pano, düz metin için.

Compose'un kendi panosu, `LocalClipboard`, üstüne konanı her platformun kendi türüyle alır ve üstündekini yine o türle geri verir: Android'de bir `ClipData`, masaüstünde bir `Transferable`, iOS'ta ve tarayıcıda Compose'un kendi bir biçimi. Bir metni kopyalamanın da okumanın da ortak bir yolu yoktur; bu öyle bir yoldur: platformun aldığını kurar, oraya koyar ve oraya varıp varmadığını söyler; platformun verdiğinden de metni okur.

```kotlin
val clipboard = rememberPantrixClipboard()
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.copy_link),
    onClick = {
        scope.launch {
            val copied = clipboard.copyText(link, label = linkLabel)
            // A system that shows the copy itself is not echoed.
            if (!copied || !clipboard.traits.announcedBySystem) snackbars?.show(if (copied) done else failed)
        }
    }
)
```

Parametreler:

- `traits: ClipboardTraits`: Bu platformun panosunun nasıl olduğu: yazılıp okunabildiği ve sistemin bir kopyayı kendisi gösterip göstermediği.

Üyeleri:

- `suspend fun copyText(text: String, label: String = ""): Boolean`: `text`'i panoya düz metin olarak, orada olanın yerine koyar.

  `text`: kopyalanan.

  `label`: metnin ne olduğu, uygulamanın dilinde: `"Bağlantı"`, `"Kod"`. Yalnızca Android taşır ve kopyanın sistemin kendi önizlemesinde gösterebilir.

  Döndürdüğü: metnin panoya konup konmadığı. Yazılacak bir pano olmayan yerde ve platformun yazmayı reddettiği yerde false'tur: okuyanın izin vermediği bir tarayıcı gibi.
- `suspend fun readText(): String?`: Panodaki düz metin, onu yapıştıran bir düğme için.

  Bir platform okuyucuya önce sorabilir. iOS, başka bir uygulamanın kopyaladığını uygulamanın yapıştırıp yapıştıramayacağını sorar. Bir tarayıcı sayfa için bir kez sorar, Chrome'un yaptığı gibi, ya da Safari'nin yaptığı gibi basılacak kendi bir düğmesini gösterir; yalnızca sayfa okuyucunun dikkatindeyken, bir basıştan hemen sonra yanıt verir. Okuyucunun kendi yapıştırması, Cmd+V ya da Ctrl+V, metniyle ve sorusuz `onPaste` ile duyulur.

  Döndürdüğü: metin; panoda metin yoksa, okunacak bir pano yoksa ya da platform veya okuyucu okumayı reddettiyse null.

### rememberPantrixClipboard

`import com.pantrixui.foundation.platform.rememberPantrixClipboard`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixClipboard(): PantrixClipboard
```

Düz metin için pano, platformun kendisinin üstünde: `LocalClipboard`'ın verdiği, `LocalClipboardTraits`'in huyuyla.

### ClipboardTraits

`import com.pantrixui.foundation.platform.ClipboardTraits`, `com.pantrixui:foundation` içinden

```kotlin
data class ClipboardTraits(
    val writable: Boolean = true,
    val announcedBySystem: Boolean = false,
    val readable: Boolean = true
)
```

Bir platformun panosunun, ona kopyalayan ya da ondan okuyan için nasıl olduğu: bir kopyalama düğmesi bir şey söylemeden önce sorar, bir yapıştırma düğmesi de gösterilmeden önce.

Parametreler:

- `writable: Boolean`: Yazılacak bir pano olup olmadığı. Güvenli bir bağlamda, makinenin kendisinden başka bir yerden düz http ile sunulmayan bir web sayfasının yoktur: tarayıcı böyle bir sayfaya pano vermez. Ekransız çalışan bir JVM'in de yoktur. Compose ikisine de bir yazmayı hatasız atlar.
- `announcedBySystem: Boolean`: Panoya konanı sistemin kendisinin gösterip göstermediği. Android 13. sürümden itibaren gösterir ve uygulamadan bunu ikinci kez söylememesini ister.
- `readable: Boolean`: Okunacak bir pano olup olmadığı. Bir tarayıcı bir sayfanın onu okumasına yalnızca güvenli bir bağlamda ve yalnızca `navigator.clipboard.read` varsa izin verir; Firefox'ta o 127. sürümden beri vardır. Ekransız çalışan bir JVM'in panosu yoktur.

### currentClipboardTraits

`import com.pantrixui.foundation.platform.currentClipboardTraits`, `com.pantrixui:foundation` içinden

```kotlin
fun currentClipboardTraits(): ClipboardTraits
```

Bu platformun panosu, sorulduğu andaki hâliyle: bir tarayıcınınki sayfasının nasıl sunulduğuna bağlıdır.

### LocalClipboardTraits

`import com.pantrixui.foundation.platform.LocalClipboardTraits`, `com.pantrixui:foundation` içinden

```kotlin
val LocalClipboardTraits: ProvidableCompositionLocal<ClipboardTraits>
```

Bir `PantrixClipboard`'ın uyduğu huy. Başkası verilmedikçe platformun kendisininki: bir test burada başka bir platformunkini verir, `LocalClipboard` ile kendi panosunu verdiği gibi.

### Modifier.onPaste

`import com.pantrixui.foundation.platform.onPaste`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.onPaste(
    enabled: Boolean = true,
    onPaste: (String) -> Unit
): Modifier
```

Okuyucunun yapıştırdığı metinle `onPaste`'i çalıştırır: Apple'ın sistemlerinde Cmd+V, ötekilerde Ctrl+V. Odak bu düğümdeyken ya da içindeyken çalışır, oradaki bir metin alanı metni kendisine yapıştırmadıkça.

Web'de bir yapıştırma tuşsuz da gelir: tarayıcının menüsünden ve sağ tıklamanın açtığı menüden. Böyle bir yapıştırmayı odağın içinde olduğu en içteki düğüm duyar; bir pencerenin kökü (`com.pantrixui.foundation.keyboard.shortcutRoot`) odağı, içinde hiçbir şey tutmadan kendisi tutarken de o kökün altındaki en dıştaki düğüm.

Yapıştırılanı, bir belgeyi ya da bir bağlantıyı açan bir ekran yapıştırmayı böyle duyar. Web'de tarayıcı panonun metnini yapıştırmayla birlikte sayfaya verir ve okuyucuya bir şey sormaz; panonun okunması (`PantrixClipboard.readText`) ise önce sorulur. Bu düğüm orada tarayıcının yapıştırmasını, tuşun ardından ya da tek başına geldiğinde, duyar. Cmd+V'nin bir kısayolu (`com.pantrixui.foundation.keyboard.onShortcut`) tarayıcının yapıştırmasını tümden engellerdi; bu yüzden yapıştırma bir kısayol olarak değil, burada duyulur. Öteki platformlarda, bir alanın yaptığı gibi, tuş inerken panoyu okur.

Odağın çevresinde yapıştırmayı duyan iki düğümden içteki onu alır. Bir penceredeki her yerde yapıştırma için pencerenin köküne, başka hiçbir şey odakta değilken odağı tutan `com.pantrixui.foundation.keyboard.shortcutRoot` ile birlikte konur:

```kotlin
Box(Modifier.shortcutRoot().onPaste { text -> open(text) }) { … }
```

Parametreler:

- `enabled: Boolean`: yapıştırmayı duyup duymadığı: duymayan tuşu onu duyan başka neyse ona bırakır.
- `onPaste: (String) -> Unit`: yapıştırılan metinle çağrılır. Panoda metin yoksa çağrılmaz.

### ShareSheet

`import com.pantrixui.foundation.platform.ShareSheet`, `com.pantrixui:foundation` içinden

```kotlin
fun interface ShareSheet
```

Bir metni başka bir uygulamaya göndermek için platformun kendi sayfası: bir mesaja, bir e-postaya, bir nota, bir sohbete. Bir bağlantı metin olarak gönderilir ve sayfanın listelediği her uygulama onu böyle alır.

`rememberShareSheet` platformunkini verir: Android'in seçicisi (`Intent.ACTION_SEND`), iPad'in pencerenin ortasında bir popover'da gösterdiği iOS'un `UIActivityViewController`'ı ve tarayıcının `navigator.share`'i. Masaüstünün yoktur, Firefox'un masaüstündeki gibi `navigator.share`'i olmayan bir tarayıcının da: oradaki bir ekran metni bunun yerine `PantrixClipboard` ile kopyalamayı önerir.

```kotlin
val sheet = rememberShareSheet()
if (sheet != null) {
    PantrixButton(
        text = stringResource(Res.string.send_with_another_app),
        onClick = { sheet.share(link, title = documentName) { result -> show(result) } }
    )
}
```

Bir test ya da bir önizleme kendisininkini `LocalShareSheet` ile verir:

```kotlin
val sheet = ShareSheet { text, _, onResult -> sent += text; onResult(ShareResult.Shared) }
```

Üyeleri:

- `fun share(text: String, title: String?, onResult: (ShareResult) -> Unit)`: Sayfayı `text` ile, platformun bir yeri olduğu yerde `title` ile gösterir: bir e-postanın konusu, Android'in seçicisinin başlığı, tarayıcının başlığı. `onResult` bir kez, ana iş parçacığında, metne ne olduğuyla çağrılır. Bir tarayıcının sayfası, dosya seçicisi gibi, okurun bir basışından çağrılır: tarayıcı hiçbir basışın istemediği bir sayfayı reddeder.

### rememberShareSheet

`import com.pantrixui.foundation.platform.rememberShareSheet`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberShareSheet(): ShareSheet?
```

Bir metni başka bir uygulamaya göndermek için platformun kendi sayfası, olmayan yerde null: bkz. `ShareSheet`. `LocalShareSheet` bir sayfa veriyorsa o sayfadır.

### ShareResult

`import com.pantrixui.foundation.platform.ShareResult`, `com.pantrixui:foundation` içinden

```kotlin
enum class ShareResult
```

`ShareSheet.share`'e verilen bir metne ne olduğu.

Değerleri:

- `Shared`: Okur nereye gönderileceğini seçti ve o uygulama aldı: iOS'un ve bir tarayıcının söylediği.
- `Cancelled`: Okur sayfayı hiçbir şey seçmeden kapattı: hiçbir şey gönderilmedi.
- `Started`: Sayfa gösterildi ve platform daha fazlasını söylemiyor: Android onu sistemin seçicisine verir, seçici de okurun neyi seçtiğini uygulamaya söylemez.
- `Failed`: Sayfa gösterilemedi: bir tarayıcı okurun hiçbir basışının istemediği bir sayfayı reddeder, bir platform da kendisine verileni reddedebilir.

### LocalShareSheet

`import com.pantrixui.foundation.platform.LocalShareSheet`, `com.pantrixui:foundation` içinden

```kotlin
val LocalShareSheet: ProvidableCompositionLocal<ShareSheet?>
```

`rememberShareSheet`'in verdiği sayfa: varsayılan olarak platformun kendisininki, olmayan yerde, masaüstünde ve `navigator.share`'i olmayan bir tarayıcıda null. Bir test ya da bir önizleme yerine başka birini, sayfası olmayan bir platform için de null verir.
