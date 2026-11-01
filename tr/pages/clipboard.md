# Pano

Pano, düz metin için. Compose'un panosu her platformda başka bir tür alır; `PantrixClipboard` bir metni her platformda aynı yolla koyar ve oraya varıp varmadığını söyler.

## Özellikler

- **Kopyalamak.** `rememberPantrixClipboard()` panoyu verir; `copyText(text, label)` metni koyar ve vardıysa `true` döner. `label` yalnızca Android'de taşınır.
- **Panonun huyu.** `ClipboardTraits` panonun nasıl olduğunu söyler: yazılabilir mi (`writable`), sistem kopyalananı kendisi gösteriyor mu (`announcedBySystem`). Güvenli olmayan bir web sayfasının ve ekransız bir JVM'in panosu yoktur; Android 13 ve sonrası kopyalananı kendisi gösterir ve uygulamadan bir daha söylememesini ister.
- **Bir testte.** `LocalClipboardTraits` panonun huyunu verir: bir test ya da önizleme başka bir platformunkini verir.

## Örnekler

### Bir metni kopyalamak

Bir metni kopyalamak. Düğme IBAN'ı panoya koyar ve sonucu kartın "Son olay" satırına yazar. Sistem kopyalananı kendisi gösteriyorsa (Android 13 ve sonrası) uygulama bir şey söylemez: başarıyı ikinci kez duyurmak gürültüdür. Üstteki satır bu platformun panosunu anlatır (`currentClipboardTraits()`).

```kotlin
import androidx.compose.runtime.rememberCoroutineScope
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

### Yazılamayan bir pano

Yazılamayan bir pano: içteki bölüm `LocalClipboardTraits`'e `ClipboardTraits(writable = false)` verdi, güvenli olmayan bir web sayfasında olduğu gibi. Kod bloğunun kopyalama düğmesine bas: blok kopyalayamadığını söyler, bir başarı göstermez.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.foundation.platform.ClipboardTraits
import com.pantrixui.foundation.platform.LocalClipboardTraits

CompositionLocalProvider(LocalClipboardTraits provides ClipboardTraits(writable = false)) {
    PantrixCodeBlock(code = "./gradlew :app:webApp:wasmJsBrowserDistribution", language = "Shell", tagKey = "no_board")
}
```

## API

### PantrixClipboard

`import com.pantrixui.foundation.platform.PantrixClipboard`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixClipboard
```

Pano, düz metin için.

Compose'un kendi panosu, `LocalClipboard`, üstüne konanı her platformun kendi türüyle alır: Android'de bir `ClipData`, masaüstünde bir `Transferable`, iOS'ta ve tarayıcıda Compose'un kendi bir biçimi. Bir metni kopyalamanın ortak bir yolu yoktur; bu öyle bir yoldur: platformun aldığını kurar, oraya koyar ve oraya varıp varmadığını söyler.

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

- `traits: ClipboardTraits`: Bu platformun panosunun nasıl olduğu: yazılıp yazılamadığı ve sistemin bir kopyayı kendisi gösterip göstermediği.

Üyeleri:

- `suspend fun copyText(text: String, label: String = ""): Boolean`: `text`'i panoya düz metin olarak, orada olanın yerine koyar.

  `text`: kopyalanan.

  `label`: metnin ne olduğu, uygulamanın dilinde: `"Bağlantı"`, `"Kod"`. Yalnızca Android taşır ve kopyanın sistemin kendi önizlemesinde gösterebilir.

  Döndürdüğü: metnin panoya konup konmadığı. Yazılacak bir pano olmayan yerde ve platformun yazmayı reddettiği yerde false'tur: okuyanın izin vermediği bir tarayıcı gibi.

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
    val announcedBySystem: Boolean = false
)
```

Bir platformun panosunun, ona kopyalayan için nasıl olduğu: bir kopyalama düğmesi bir şey söylemeden önce sorar.

Parametreler:

- `writable: Boolean`: Yazılacak bir pano olup olmadığı. Güvenli bir bağlamda, makinenin kendisinden başka bir yerden düz http ile sunulmayan bir web sayfasının yoktur: tarayıcı böyle bir sayfaya pano vermez. Ekransız çalışan bir JVM'in de yoktur. Compose ikisine de bir yazmayı hatasız atlar.
- `announcedBySystem: Boolean`: Panoya konanı sistemin kendisinin gösterip göstermediği. Android 13. sürümden itibaren gösterir ve uygulamadan bunu ikinci kez söylememesini ister.

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
