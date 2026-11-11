# Keycaps

Bir klavye kısayolunun tuşları, her biri kendi kapağında: bir menünün, bir kısayol listesinin ya da bir ipucunun kısayolu yazdığı gibi. Kısayol bir `PantrixShortcut`'tır; kapaklar uygulamanın çalıştığı sistemin sırasını ve adlarını alır.

- `PantrixKeycaps` (`com.pantrixui.components.elements.keycaps`, `com.pantrixui:components`): Bir klavye kısayolunun tuşları, her biri kendi kapağında, uygulamanın çalıştığı sistemin sırasıyla ve adlarıyla; ekran okuyucu onları tek bir şey olarak okur. Anahtar sözcükler: klavye kısayolu, tuş kapağı, kbd, kısayol tuşu, tuş birleşimi, hızlandırıcı.

## Özellikler

- **Sistemin yazışı.** Apple'ın sistemlerinde `⌥` `⇧` `⌘` `F`, ötekilerde `Ctrl` `Alt` `Shift` `F`: sıra ve adlar `keysOn`'dandır.
- **Ekran okuyucu.** Kısayol bir kez, sistemin yazdığı gibi okunur (`writtenOn`): "⌘K", "Ctrl+K". Kapaklar basılmaz ve Tab'ın durağı değildir.
- **İki boyut.** `KeycapsSize.Medium` bir satırın sonu için (footnote), `KeycapsSize.Small` bir alanın ya da bir başlatıcının sonu için (caption).
- **Cümlenin içinde.** Kapakların ilk taban çizgisi tuşlarınındır: `Modifier.alignByBaseline()` ile hizalanan bir satırda yanındaki yazıyla aynı çizgide durur.
- **Renk ve stil.** `KeycapsColors` ile verilen renk kullanılır, verilmeyen temanınki kalır: dolgu `background`, kenar `border`, tuş `textSecondary`. `KeycapsStyle` köşeyi, kenarı, kapaklar arasını ve her boyutun ölçüsünü değiştirir.
- **Otomasyon.** `tagKey` ile kapaklar `Keycaps_<tagKey>` olur; anahtar verilmezse etiketlenmez.

## Kullanım

### A command's shortcut at the end of its row

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = stringResource(Res.string.command_palette), modifier = Modifier.weight(1f))
    PantrixKeycaps(shortcut = PantrixShortcut(Key.K, command = true), tagKey = "palette")
}
```

### A shortcut in a sentence, on its line

```kotlin
Row {
    PantrixText(text = "or press ", modifier = Modifier.alignByBaseline())
    PantrixKeycaps(
        shortcut = PantrixShortcut(Key.V, command = true),
        modifier = Modifier.alignByBaseline(),
        size = KeycapsSize.Small
    )
    PantrixText(text = " anywhere on this screen", modifier = Modifier.alignByBaseline())
}
```

## Örnekler

### Bir komutun kısayolu

Komutların listesi: adı solda, kısayolu sağda kapaklarda. Kısayollar uygulamanın çalıştığı sistemin yazışıyla çizilir; Mac'te `⌘`, Windows'ta ve Linux'ta `Ctrl`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    COMMANDS.forEach { command ->
        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = command.name, modifier = Modifier.weight(1f))
            PantrixKeycaps(shortcut = command.shortcut, tagKey = command.key)
        }
    }
}

private val COMMANDS = listOf(
    Command("palette", "Palet", PantrixShortcut(Key.K, command = true)),
    Command("save", "Kaydet", PantrixShortcut(Key.S, command = true)),
    Command("copy", "Kopyala", PantrixShortcut(Key.C, command = true, shift = true)),
    Command("format", "Biçimlendir", PantrixShortcut(Key.F, command = true, shift = true, alt = true))
)

private class Command(
    val key: String,
    val name: String,
    val shortcut: PantrixShortcut
)
```

### Her sistemin yazışı

Aynı kısayol iki sistemin yazışıyla: Apple'ın sistemlerinde değiştirici tuşlar simgeleriyle, `⌥` `⇧` `⌘` sırasıyla; ötekilerde adlarıyla, `Ctrl` `Alt` `Shift` sırasıyla. Sistemi uygulama seçmez; burada iki satır onu ayrı ayrı verir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.platform.LocalOperatingSystem
import com.pantrixui.foundation.platform.OperatingSystem
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    SYSTEMS.forEach { (name, system) ->
        Row(verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = name, modifier = Modifier.weight(1f))
            CompositionLocalProvider(LocalOperatingSystem provides system) {
                PantrixKeycaps(shortcut = FORMAT, tagKey = "format_${system.name.lowercase()}")
            }
        }
    }
}

private val SYSTEMS = listOf("macOS" to OperatingSystem.MacOs, "Windows" to OperatingSystem.Windows)

private val FORMAT = PantrixShortcut(Key.F, command = true, shift = true, alt = true)
```

### Bir cümlenin içinde

Küçük kapaklar bir cümlenin içinde: üç parça da `alignByBaseline` ile aynı taban çizgisinde durur. Uzun bir paragraf kırılırken kapakları yanına almaz; kısa bir ipucu içindir.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.keycaps.KeycapsSize
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut

Row {
    PantrixText(text = "Ya da bu ekranın herhangi bir yerinde ", modifier = Modifier.alignByBaseline())
    PantrixKeycaps(
        shortcut = PASTE,
        modifier = Modifier.alignByBaseline(),
        size = KeycapsSize.Small,
        tagKey = "paste"
    )
    PantrixText(text = " tuşlarına bas.", modifier = Modifier.alignByBaseline())
}

private val PASTE = PantrixShortcut(Key.V, command = true)
```

### Kendi renkleri ve ölçüleri

Kendi renkleri ve ölçüleriyle: bilgi dolgusunun üstünde, dolgusuz ve kenarı yazının renginde kapaklar; kapaklar arasında daha az yer, daha geniş kapaklar.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.keycaps.KeycapSizeStyle
import com.pantrixui.components.elements.keycaps.KeycapsColors
import com.pantrixui.components.elements.keycaps.KeycapsStyle
import com.pantrixui.components.elements.keycaps.PantrixKeycaps
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.toShape

val info = PantrixTheme.colors.info
Row(
    modifier = Modifier
        .clip(ShapeRole.Medium.toShape())
        .background(info.container)
        .padding(PantrixTheme.spacing.md),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixText(text = "Biçimlendir", color = info.onContainer)
    PantrixKeycaps(
        shortcut = FORMAT,
        style = KeycapsStyle(gap = 2.dp, medium = KeycapSizeStyle(minWidth = 28.dp)),
        colors = KeycapsColors(
            container = Color.Transparent,
            border = info.onContainer,
            content = info.onContainer
        ),
        tagKey = "own"
    )
}

private val FORMAT = PantrixShortcut(Key.F, command = true, shift = true, alt = true)
```

## API

### PantrixKeycaps

`import com.pantrixui.components.elements.keycaps.PantrixKeycaps`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixKeycaps(
    shortcut: PantrixShortcut,
    modifier: Modifier = Modifier,
    size: KeycapsSize = KeycapsSize.Medium,
    style: KeycapsStyle? = null,
    colors: KeycapsColors? = null,
    tagKey: String? = null
)
```

Bir `shortcut`'ın tuşları, her biri kendi kapağında, bir menünün, bir kısayol listesinin ya da bir ipucunun bir kısayolu yazdığı gibi: Apple'ın sistemlerinde `⌘` `K`, ötekilerde `Ctrl` `K`; uygulamanın çalıştığı sistemin sırasıyla ve adlarıyla (`PantrixShortcut.keysOn`).

Ekran okuyucu kısayolu bir kez, o sistemin yazdığı gibi duyar (`PantrixShortcut.writtenOn`): "⌘K", "Ctrl+K". Kapaklar basılmaz ve Tab'ın bir durağı değildir: kısayolun yaptığı uygulamanındır, onu tuşlar çalıştırır.

Kapaklar yanlarındaki yazının çizgisinde durur: ilk taban çizgileri tuşlarınındır, bu yüzden çocuklarını taban çizgilerine göre hizalayan bir satır (`Modifier.alignByBaseline()`) onları bir cümlenin içine koyar, "or press ⌘V anywhere". Kırılan bir paragraf onları yanına almaz.

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Command palette", modifier = Modifier.weight(1f))
    PantrixKeycaps(shortcut = AppShortcuts.Palette, tagKey = "palette")
}
```

Parametreler:

- `shortcut: PantrixShortcut`: tuşları çizilen kısayol.
- `modifier: Modifier`: kapakların modifier'ı.
- `size: KeycapsSize`: kapakların ne kadar büyük olduğu: varsayılan olarak bir satırın sonu için `KeycapsSize.Medium`.
- `style: KeycapsStyle?`: bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Her platformda yalnızca ayarladığı alanlar değişir.
- `colors: KeycapsColors?`: bu çağrının, temanınki olmayan kendi renkleri: burada verilenler, kalanlar için temanınkiler.
- `tagKey: String?`: kapakların otomasyon anahtarı: `Keycaps_<tagKey>` olurlar ve yalnızca bir anahtar verilince etiketlenirler.

### KeycapsSize

`import com.pantrixui.components.elements.keycaps.KeycapsSize`, `com.pantrixui:components` içinden

```kotlin
enum class KeycapsSize
```

`PantrixKeycaps`'in ne kadar büyük çizildiği.

Değerleri:

- `Small`: Temanın caption yazısıyla: kısayolun açtığını açan bir alanın ya da düğmenin sonunda.
- `Medium`: Temanın footnote yazısıyla: komutu adlandıran bir satırın sonunda, bir menününki gibi. Varsayılan.

### KeycapsColors

`import com.pantrixui.components.elements.keycaps.KeycapsColors`, `com.pantrixui:components` içinden

```kotlin
data class KeycapsColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

`PantrixKeycaps`'in, temanınki olmadığı yerde, neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// Keycaps on a fill of the app's own, written in what reads on it:
PantrixKeycaps(
    shortcut = paste,
    colors = KeycapsColors(container = Color.Transparent, border = onBanner, content = onBanner)
)
```

Parametreler:

- `container: Color`: Her kapağın dolgusu: temanın `background`'u, çoğu satırın durduğu `surface`'ten bir adım ötede.
- `border: Color`: Her kapağın çevresindeki kenar: temanın `border`'ı.
- `content: Color`: Kapaktaki tuşun adı: temanın `textSecondary`'si, yanında durduğu yazıdan daha sessiz.

### KeycapsStyle

`import com.pantrixui.components.elements.keycaps.KeycapsStyle`, `com.pantrixui:components` içinden

```kotlin
class KeycapsStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val small: KeycapSizeStyle = KeycapSizeStyle(),
    public val medium: KeycapSizeStyle = KeycapSizeStyle()
) : PantrixStyle<KeycapsStyle>
```

`PantrixKeycaps`'in geometrisi: bir kapağın biçimi, kenarı, iki kapak arasındaki yer ve her `KeycapsSize` için bir kapağın içindeki yer. Her platformda aynı: bir kısayol, onu bir klavye nerede yazarsa yazsın aynı yazılır.

Parametreler:

- `shape: ShapeSpec`: Bir kapağın biçimi: `ShapeRole.Small`, bir tuşun hafif yuvarlaklığı.
- `borderWidth: Dp`: Bir kapağın çevresindeki kenarın ne kadar kalın olduğu.
- `gap: Dp`: İki kapak arasındaki yer.
- `small: KeycapSizeStyle`: `KeycapsSize.Small`'ın bir kapağın içindeki yeri.
- `medium: KeycapSizeStyle`: `KeycapsSize.Medium`'un bir kapağın içindeki yeri.

### KeycapSizeStyle

`import com.pantrixui.components.elements.keycaps.KeycapSizeStyle`, `com.pantrixui:components` içinden

```kotlin
class KeycapSizeStyle(
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified
) : PantrixStyle<KeycapSizeStyle>
```

Bir `KeycapsSize`'ın bir tuş kapağının içindeki yeri: kapağın en az ne kadar geniş olduğu ve tuşunun çevresindeki yer.

Parametreler:

- `minWidth: Dp`: Kapağın en az genişliği: tek karakterlik bir tuş, boyu kadar ya da daha geniş bir kapakta durur.
- `horizontalPadding: Dp`: Tuşun adının iki yanındaki yer; daha uzun bir ad kapağı bununla büyütür.
- `verticalPadding: Dp`: Tuşun adının üstündeki ve altındaki yer.
