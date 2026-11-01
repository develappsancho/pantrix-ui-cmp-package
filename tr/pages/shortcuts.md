# Klavye kısayolları

Klavye kısayolları: bir tuş ve onunla basılı tutulanlar. Apple'ın sistemlerinde Command, ötekilerde Ctrl ile: `⌘S` ve `Ctrl+S` aynı kısayoldur.

## Özellikler

- **Kısayol.** `PantrixShortcut(Key.S, command = true)` tuşu ve basılı tutulanları söyler; `writtenOn(system)` onu o sistemin yazdığı gibi verir (`⌥⇧⌘K`, `Ctrl+Alt+Shift+K`), `keysOn(system)` tuş tuş.
- **Dinlemek.** `Modifier.onShortcut(shortcut) { … }` odak o öğede ya da içindeyken kısayolu dinler, içindeki kontrolden önce.
- **Odağın kökü.** `Modifier.shortcutRoot()` içinde hiçbir şey odakta değilken odağı kendisi tutar: bir ekranın kısayolları, bir alana basılmadan da duyulur.
- **Sistem.** `currentOperatingSystem()` sistemi söyler; `LocalOperatingSystem` bir önizlemede ya da testte başka bir sistemi verir.

## Örnekler

### Bir ekranın kısayolu

Bir kısayol: kutu `onShortcut` ile kaydetme kısayolunu dinler ve `shortcutRoot` ile, içinde bir alan odakta değilken odağı kendisi tutar. Kutuya bir kez bas, sonra kısayola bas: sayı artar. Alana yazarken de duyulur, alandan önce. Telefonda bir klavye takılıysa çalışır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.keyboard.onShortcut
import com.pantrixui.foundation.keyboard.shortcutRoot
import com.pantrixui.foundation.platform.LocalOperatingSystem
import com.pantrixui.foundation.theme.PantrixTheme

var saved by remember { mutableIntStateOf(0) }
Column(
    modifier = Modifier
        .widthIn(max = 400.dp)
        .border(1.dp, PantrixTheme.colors.divider, PantrixTheme.shapes.md)
        .shortcutRoot()
        .onShortcut(SAVE) { saved++ }
        .padding(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixText(text = "Kaydetmek için ${SAVE.writtenOn(LocalOperatingSystem.current)}")
    PantrixTextField(
        state = rememberTextFieldState(),
        modifier = Modifier.fillMaxWidth(),
        label = "Not",
        tagKey = "shortcut_note"
    )
    PantrixText(
        text = "Kaydedildi: $saved kez",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "saved_count"
    )
}

private val SAVE = PantrixShortcut(Key.S, command = true)
```

### Başka bir sistemde

Aynı kısayol üç sistemde. Her satır `LocalOperatingSystem` ile başka bir sistemi verir ve kısayolu o sistemin yazdığı gibi yazar: Apple'ın sistemlerinde simgelerle, ötekilerde adlarla. En üstteki satır bu cihazın sistemidir (`currentOperatingSystem()`).

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.platform.LocalOperatingSystem
import com.pantrixui.foundation.platform.OperatingSystem
import com.pantrixui.foundation.platform.currentOperatingSystem
import com.pantrixui.foundation.theme.PantrixTheme

PantrixText(text = "Bu cihaz: ${currentOperatingSystem().name} · ${SEARCH.writtenOn(currentOperatingSystem())}")
listOf(OperatingSystem.MacOs, OperatingSystem.Windows, OperatingSystem.Linux).forEach { system ->
    CompositionLocalProvider(LocalOperatingSystem provides system) {
        val keys = SEARCH.keysOn(LocalOperatingSystem.current)
        PantrixText(
            text = "${system.name}: ${keys.joinToString(" ")}",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}

private val SEARCH = PantrixShortcut(Key.F, command = true, shift = true)
```

## API

### PantrixShortcut

`import com.pantrixui.foundation.keyboard.PantrixShortcut`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixShortcut(
    public val key: Key,
    public val command: Boolean = false,
    public val shift: Boolean = false,
    public val alt: Boolean = false
)
```

Bir tuş ve onunla birlikte basılı tutulan değiştiriciler: bir komutu klavyeden çalıştıran şey; Mac'te `⌘K`, başka yerde `Ctrl+K`.

`command`, bir sistemin kısayollarının başladığı tuştur: Apple'ın sistemlerinde Command, ötekilerde Control; böylece bir kısayol her platform için bir kez yazılır. Bir kısayol, tuşu değiştiricileri basılıyken ve başka hiçbiri basılı değilken indiğinde basılmış olur: `⌘K`'ya `⇧⌘K` basmaz, Mac'te `⌃K` de basmaz.

```kotlin
val search = PantrixShortcut(Key.K, command = true)
search.writtenOn(OperatingSystem.MacOs) // "⌘K"
search.writtenOn(OperatingSystem.Windows) // "Ctrl+K"
```

Harflerin, rakamların, okların, işlev tuşlarının, Enter'ın, Escape'in, Tab'ın, boşluğun, Backspace'in, Delete'in, Home'un, End'in, sayfa tuşlarının ve yaygın işaretlerin kendi adları vardır. Başka bir tuş numarasıyla yazılır.

Parametreler:

- `key: Key`: basılan tuş.
- `command: Boolean`: Apple'ın sistemlerinde Command'ın, ötekilerde Control'ün basılı olup olmadığı.
- `shift: Boolean`: Shift'in basılı olup olmadığı.
- `alt: Boolean`: Apple'ın sistemlerinde Option'ın, ötekilerde Alt'ın basılı olup olmadığı.

Üyeleri:

- `fun isPressedBy(event: KeyEvent, system: OperatingSystem): Boolean`: `event`'in bu kısayolu `system`'de basıp basmadığı: tuşunun inmesi, değiştiricileri basılıyken ve başka hiçbiri basılı değilken.
- `fun keysOn(system: OperatingSystem): List<String>`: Bu kısayolun tuşları, `system`'in yazdığı gibi, her biri bir tuş kapağına, onun sırasıyla: Apple'ın sistemlerinde Option, Shift, Command ve tuş (`⌥`, `⇧`, `⌘`, `K`); ötekilerde Control, Alt, Shift ve tuş.
- `fun writtenOn(system: OperatingSystem): String`: Bu kısayolun `system`'de yazılışı: Apple'ın sistemlerinde `⌥⇧⌘K`, ötekilerde `Ctrl+Alt+Shift+K`.

### Modifier.onShortcut

`import com.pantrixui.foundation.keyboard.onShortcut`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.onShortcut(
    shortcut: PantrixShortcut,
    enabled: Boolean = true,
    onTrigger: () -> Unit
): Modifier
```

Odak bu düğümdeyken ya da içindeyken `shortcut` basılınca `onTrigger`'ı çalıştırır; odaktaki kontrole tuş verilmeden önce: odaktaki bir alan, çalıştırdığı kısayolun harfini yazmaz.

Bir tuş yalnızca odaktaki kontrole ve çevresindeki düğümlere verilir. Bütün pencerenin bir kısayolu için bunu pencerenin köküne, `shortcutRoot` ile birlikte koy; o, başka hiçbir şey odakta değilken odağı tutar: o olmadan bir kısayol, bir şey odaklanana dek duyulmaz.

```kotlin
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { palette = true }) { … }
```

Bir tuşun bastığı iki kısayoldan dıştaki çalışır. Bir kısayol çalıştıktan sonra tuşun kalkışı da odaktaki kontrolden saklanır; öyle ki Enter ile basılan bir düğme onu kendi basışı sanmaz. Temanın tanılaması açıkken, bunun çevresindeki bir düğümün de duyduğu bir kısayol `PantrixCheck.ShadowedShortcut` olarak bildirilir: burada hiç çalışmaz.

Parametreler:

- `shortcut: PantrixShortcut`: onu çalıştıran tuş ve değiştiriciler.
- `enabled: Boolean`: çalışıp çalışmadığı: çalışmayan, tuşunu geçirir.
- `onTrigger: () -> Unit`: çalıştırdığı.

### Modifier.shortcutRoot

`import com.pantrixui.foundation.keyboard.shortcutRoot`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.shortcutRoot(): Modifier
```

İçinde hiçbir şey odakta değilken bu düğümün odağı tutmasını sağlar; böylece üstündeki ve çevresindeki kısayollara o sırada basılan tuşlar verilir.

Bir tuş, odaktaki kontrole ve o kontrolün çevresindeki düğümlere verilir. Hiçbir şey odakta değilken, başta, henüz hiçbir şey odaklanmadan ve odak kaldırıldıktan sonra, hiçbirine verilmez ve bir pencerenin kökündeki kısayol duyulmaz. Bu düğüm o zamanlarda odağı alır ve onu isteyen neyse ona bırakır. Hiçbir şey çizmez, ekran okuyucuya bir şey söylemez ve Tab için bir durak değildir: ondan Tab, tuttuklarının içine gider.

Bunu bir pencerenin köküne, pencerenin kısayollarıyla (`onShortcut`) birlikte bir kez koy. Pantrix'in bir modal'ı bunun üstünde kendi penceresidir; açıkken altındaki odak olduğu yerde kalır. Bir pencerede iki kök yan yana durduğunda, biri ötekine yerini bırakırken iki ekranın bir an durduğu gibi, odağı tutan onu bırakmaz.

### LocalOperatingSystem

`import com.pantrixui.foundation.platform.LocalOperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
val LocalOperatingSystem: ProvidableCompositionLocal<OperatingSystem>
```

Bir kompozisyonun üstünde yazıldığı işletim sistemi: bir test ya da önizleme başkasını vermedikçe `currentOperatingSystem`. Klavye kısayollarının neyle başladığını, Command'la mı Control'le mi, ve nasıl yazıldıklarını o belirler.

### OperatingSystem

`import com.pantrixui.foundation.platform.OperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
enum class OperatingSystem
```

`currentOperatingSystem`'in bildirdiği bir işletim sistemi. Platformun geometrisinin karar vermediğini belirler: bir kısayolun Command ile mi Control ile mi başladığı gibi.

Değerleri:

- `Android`: Android: bir telefonda, bir tablette ya da katlanabilir bir cihazda.
- `Ios`: iOS ve iPadOS.
- `MacOs`: macOS: klavye kısayollarının başında Command tuşu durur.
- `Windows`: Windows: klavye kısayollarının başında Control tuşu durur.
- `Linux`: Linux, ChromeOS ve burada sayılmayan her sistem.

Üyeleri:

- `isApple: Boolean`: Sistemin, klavye kısayollarının Command tuşuyla başladığı Apple sistemlerinden biri olup olmadığı.

### currentOperatingSystem

`import com.pantrixui.foundation.platform.currentOperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
fun currentOperatingSystem(): OperatingSystem
```

Kodun çalıştığı işletim sistemi; tarayıcıda, tarayıcının çalıştığı sistem.

`currentPlatformType` gibi bir tema varsayılanı değildir: masaüstündeki bir iOS geometrisi önizlemesi yine masaüstünün sisteminde çalışır ve masaüstünün klavyesiyle yazılır.
