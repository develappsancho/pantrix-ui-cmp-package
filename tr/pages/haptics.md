# Dokunsal geri bildirim

Dokunsal geri bildirim: bir bileşen titreşim deseni değil, ne söylediğini ister: bir seçim, açılan ya da kapanan bir anahtar, bir başarı, bir hata. Platform o anlamın kendi desenini çalar.

## Özellikler

- **Anlamlar.** `HapticType` söylenenin adıdır: `Selection`, `ToggleOn`, `ToggleOff`, `Success`, `Warning`, `Error`, `Impact`, `LongPress`.
- **Platformun desenleri.** `rememberPlatformHaptics()` Android'de ve iOS'ta cihazın kendisidir; masaüstünde ve web'de bir şey çalmaz (`PantrixHaptics.NoOp`).
- **Temanın.** `PantrixTheme(haptics = …)` bileşenlerin dokunsallarını başka bir yere verir: bir ayardan kapatmak ya da bir testte saymak için. `PantrixTheme.haptics` en yakın temanınkidir.

## Örnekler

### Bileşenlerin dokunsalları

Bileşenlerin istediği dokunsallar. İçteki tema cihazın desenlerini çalan ama önce adını yazan bir `PantrixHaptics` alır: anahtarı ve onay kutusunu değiştir, alttaki satır bileşenin ne istediğini söyler. Masaüstünde ve web'de satır yazılır ama bir şey titremez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.HapticType
import com.pantrixui.foundation.platform.PantrixHaptics
import com.pantrixui.foundation.platform.rememberPlatformHaptics
import com.pantrixui.foundation.theme.PantrixTheme

var last by remember { mutableStateOf<HapticType?>(null) }
var notify by remember { mutableStateOf(true) }
var agreed by remember { mutableStateOf(false) }
val device = rememberPlatformHaptics()
val telling = remember(device) {
    PantrixHaptics { type ->
        last = type
        device.perform(type)
    }
}
PantrixTheme(haptics = telling) {
    PantrixSwitchButton(
        checked = notify,
        onCheckedChange = { notify = it },
        label = "Bildirimler",
        tagKey = "haptic_notify"
    )
    PantrixCheckbox(
        checked = agreed,
        onCheckedChange = { agreed = it },
        label = "Koşulları kabul ediyorum",
        tagKey = "haptic_agree"
    )
}
PantrixText(
    text = "Son dokunsal: ${last?.name ?: "yok"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

### Uygulamanın kendi dokunsalı

Uygulamanın kendi dokunsalı: bir iş bittiğinde ya da bir hata olduğunda uygulama da aynı yerden ister, `LocalPantrixHaptics.current.perform(…)`. Telefonda her düğme kendi anlamının desenini çalar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.platform.HapticType
import com.pantrixui.foundation.platform.LocalPantrixHaptics
import com.pantrixui.foundation.theme.PantrixTheme

val haptics = LocalPantrixHaptics.current
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    HapticType.entries.forEach { type ->
        PantrixButton(
            text = type.name,
            onClick = { haptics.perform(type) },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "haptic_${type.name.lowercase()}"
        )
    }
}
```

## API

### PantrixHaptics

`import com.pantrixui.foundation.platform.PantrixHaptics`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixHaptics
```

Dokunsal geri bildirim, soyutlanmış: bileşenler platformun API çağrılarını değil, niyetlerini söyler.

Masaüstünün ve web'in dokunsalı yoktur ve `NoOp` alırlar; bu sonra doldurulacak bir boşluk değil, doğru davranıştır ve bileşenlerin bunu koşulsuz çağırabilmesi de bundandır.

Üyeleri:

- `fun perform(type: HapticType)`: Platformun `type` için desenini çalar; platformun deseni olmayan yerde bir şey çalmaz.

Tipin kendisinde:

- `PantrixHaptics.NoOp: PantrixHaptics`: Dokunsal geri bildirimi olmayan bir platformun dokunsal geri bildirimi: masaüstünün ve web'in aldığı.

### HapticType

`import com.pantrixui.foundation.platform.HapticType`, `com.pantrixui:foundation` içinden

```kotlin
enum class HapticType
```

Bir dokunsalın ne söylediği, hangi motor deseninin çalınacağı değil.

Değerleri:

- `Selection`: Seçenekler arasında gezinmek: bir radyo grubu, bir kaydırıcının bir çentiği, bir segment kontrolü.
- `ToggleOn`: Açılan bir anahtar ya da işaretlenen bir onay kutusu.
- `ToggleOff`: Kapanan bir anahtar ya da işareti kaldırılan bir onay kutusu.
- `Success`: Başarılı olmuş bir eylem: gönderilen bir form, kaydedilen bir dosya.
- `Warning`: Ters gitmeden önce kullanıcının dikkatini isteyen bir şey.
- `Error`: Başarısız olmuş bir eylem ya da kabul edilmeyen bir değer.
- `Impact`: Biten bir sürükleme ya da bir yerine oturma için genel bir vuruş.
- `LongPress`: Kendi başına bir anlam taşıyacak kadar uzun tutulmuş bir basış: parmağın altında çıkan bir tooltip, tutulan bir basışın açtığı bir menü. Parmağa, kalkışının bir dokunuş olmayacağını söyler.

### rememberPlatformHaptics

`import com.pantrixui.foundation.platform.rememberPlatformHaptics`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPlatformHaptics(): PantrixHaptics
```

Bu platformun dokunsalları: Android'de ve iOS'ta cihazın kendisi, masaüstünde ve web'de `PantrixHaptics.NoOp`.

### LocalPantrixHaptics

`import com.pantrixui.foundation.platform.LocalPantrixHaptics`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixHaptics: ProvidableCompositionLocal<PantrixHaptics>
```

Geçerli dokunsal geri bildirim; `PantrixTheme` sağlar ve `PantrixTheme.haptics` bunu okur. Bir temanın dışında `PantrixHaptics.NoOp`.
