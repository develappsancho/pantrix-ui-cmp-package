# Erişilebilirlik

Uygulamanın kendi kontrolü için erişilebilirlik yardımcıları: kütüphanenin bileşenlerinin kullandıkları.

## Özellikler

- **Odak halkası.** `Modifier.focusRing(interactionSource, shape, color, width)` öğenin çevresine halkayı çizer; `rememberFocusRingVisible(interactionSource)` halkanın o an görünüp görünmeyeceğini söyler: öğe odakta, üstünde bir modal yok ve platform halkayı yalnız klavyede gösteriyorsa odak klavyeden geldi.
- **Dokunma alanı.** `Modifier.minTouchTarget(min)` çizilene dokunmadan düzende en az `min` kadar yer ayırır: 24dp'lik bir ikon 48dp'lik bir alanda basılır. Değeri platformdan gelir, `PantrixTheme.platform.minTouchTarget`.
- **Compose'un payı.** Tema Compose'un dokunma payını platformunkine uydurur: `PantrixViewConfiguration` onu `LocalViewConfiguration`'a verir.

## Örnekler

### Kendi kontrolünün odağı ve dokunma alanı

Kendi kontrolünün odak halkası ve dokunma alanı. Yıldız 24dp'liktir; `minTouchTarget` onu platformun dokunma alanında basılır kılar. Halkayı `focusRing` çizer, temanın `focusRing` renginde ve platformun kalınlığında. Tab ile yıldıza gel: halka görünür ve alttaki satır `rememberFocusRingVisible`'ın söylediğini yazar; fareyle basınca halka görünmez.

```kotlin
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.selection.toggleable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.focusRing
import com.pantrixui.foundation.a11y.minTouchTarget
import com.pantrixui.foundation.a11y.rememberFocusRingVisible
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.primitives.pantrixPressIndication
import com.pantrixui.foundation.theme.PantrixTheme

val interaction = remember { MutableInteractionSource() }
var starred by remember { mutableStateOf(false) }
val platform = PantrixTheme.platform
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    Box(
        modifier = Modifier
            .minTouchTarget(platform.minTouchTarget)
            .focusRing(
                interactionSource = interaction,
                shape = PantrixTheme.shapes.full,
                color = PantrixTheme.colors.focusRing,
                width = platform.focusRingWidth
            )
            .toggleable(
                value = starred,
                interactionSource = interaction,
                indication = pantrixPressIndication(),
                role = Role.Checkbox,
                onValueChange = { starred = it }
            ),
        contentAlignment = Alignment.Center
    ) {
        PantrixIcon(
            imageVector = PantrixIcons.Star,
            contentDescription = if (starred) "Yıldızlı" else "Yıldızsız",
            size = 24.dp,
            tint = if (starred) PantrixTheme.colors.warning.color else PantrixTheme.colors.textSecondary
        )
    }
    PantrixText(
        text = "Halka görünüyor: ${if (rememberFocusRingVisible(interaction)) "evet" else "hayır"}",
        style = PantrixTheme.typography.footnote
    )
}
```

### Compose'un dokunma payı

Compose bir dokunuşu, öğe küçükse çevresindeki payla da o öğeye verir; payı `LocalViewConfiguration` söyler. Tema bu değeri platformun dokunma alanına uydurur: `PantrixViewConfiguration` Compose'un ayarını sarar ve en küçük dokunma alanını platformunkiyle verir. Alttaki satır onu okur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalViewConfiguration
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.PantrixViewConfiguration
import com.pantrixui.foundation.theme.PantrixTheme

val configuration = LocalViewConfiguration.current
val target = configuration.minimumTouchTargetSize
PantrixText(
    text = "Temanın ayarı mı: ${if (configuration is PantrixViewConfiguration) "evet" else "hayır"} · " +
        "en küçük dokunma alanı ${target.width.value.toInt()} × ${target.height.value.toInt()} dp",
    style = PantrixTheme.typography.footnote
)
```

## API

### Modifier.focusRing

`import com.pantrixui.foundation.a11y.focusRing`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun Modifier.focusRing(
    interactionSource: InteractionSource,
    shape: Shape,
    color: Color,
    width: Dp,
    inset: Boolean = false
): Modifier
```

Odak halkasını öğenin çevresine, sınırlarının dışına çizer.

Halka `width` genişliğindedir ve öğeyle arasında o genişlikte bir boşluk bırakır; böylece öğenin kendi dolgusundan ve kenarından ayrı kalır: halkanın renginde dolu bir düğme de halkasından ayırt edilir. Köşeleri boşluk ve halka kadar büyütülmüş `shape`'i izler; yuvarlak bir öğe aynı eğrilik merkezli bir halka alır. Genişliği sıfır olan `width` halka çizmez.

Halka çizilir, yerleştirilmez; yer kaplamaz. Değiştiriciyi öğenin kendi zincirindeki her `clip`'ten ya da katmandan önce koy, yoksa onlar halkayı keser; öğeye yer bırak: kırpan bir üst öğe de onu keser. `inset` onu sınırların içine çizer: kabı kadar geniş ya da uzun bir öğe için, bir liste satırı ya da bir panel ayırıcısı gibi, dışarıdaki halkası kabın kenarlarını aşacak olan.

Öğeyi kaydıran ne varsa, öğe odağı alınca onu görünüre getirir, kendi kenarından ötesine değil. Halka belirirken çizildiği yeri de ister; böylece kayan bir satır ya da sütun halkayı bütün gösterir, halkasının bir yanı kesik bir öğe değil. Yalnızca kaydırılabilecek kadarı istenir: bir kaydırıcının tuttuğunun en sonunda öğenin ötesinde bir şey yoktur ve kaydırıcının içeriği o yeri iç boşluk olarak ister, halka ve boşluğu, `width`'in iki katı (`PantrixPlatform.focusRingReach`). Tembel bir listeden yalnızca öğe istenir: öğelerinin ne kadar sürdüğü bir öğeden anlaşılamaz. Orada yer listenin içerik boşluğudur ve her öğe bunu `scrollPadding` ile söyler.

Parametreler:

- `interactionSource: InteractionSource`: öğenin etkileşim kaynağı; halkanın çizilip çizilmeyeceğini onun odağı belirler.
- `shape: Shape`
- `color: Color`: halkanın rengi: temanın `focusRing`'i, ya da bir dolgunun üstünde o dolgunun üstüne yazılan renk; böylece halka orada yazı gibi okunur.
- `width: Dp`
- `inset: Boolean`

### rememberFocusRingVisible

`import com.pantrixui.foundation.a11y.rememberFocusRingVisible`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFocusRingVisible(interactionSource: InteractionSource): Boolean
```

Bir odak halkasının şu an görünüp görünmeyeceği: öğe odakta, üstünde gösterilen bir modal yok, ve odak klavyeden geldi ya da platform halkayı her odakta gösteriyor (`PantrixPlatform.showFocusRingOnlyForKeyboard`).

Odağın nasıl geldiği Compose'un kendi `androidx.compose.ui.input.InputMode`'udur, Touch ya da Keyboard: bir tuş basışı pencereyi klavye kipine sokar, bir dokunuş çıkarır. İşaret aygıtının ne kadar kesin olduğundan bir şey söylemez.

Bir modalın altında odak, modal kapanınca yine orada olmak için olduğu yerde kalır, ama ona hiçbir tuş ulaşmaz: halka orada modal kapanana kadar gösterilmez (`PantrixModalLayer`).

Parametreler:

- `interactionSource: InteractionSource`: öğenin etkileşim kaynağı: halka onun bildirdiği odağı izler.

### Modifier.minTouchTarget

`import com.pantrixui.foundation.a11y.minTouchTarget`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.minTouchTarget(min: Dp): Modifier
```

Bileşenin çizdiğini değiştirmeden düzende en az `min` kadar yer ayırır.

Sorunun bu yarısı kolay yarısıdır. Öteki yarısı isabet denetimidir; Compose onu `ViewConfiguration.minimumTouchTargetSize`'dan alır: bu değiştiricinin ulaşamadığı sabit bir değer. Yalnızca bu değiştiriciyi uygulayan bir bileşen 48dp yer kaplar ama yine yalnızca görünen sınırlarının içinde *tepki verir*; bu, bir ekran görüntüsünde hiç görünmeyen türden bir kusurdur.

Bu yüzden `PantrixTheme` `LocalViewConfiguration`'ı da `PantrixViewConfiguration` ile ezer; iki yarı aynı sayıyı kullanır. İkisi birlikte Material 3'ün `LocalMinimumInteractiveComponentSize`'ının yalnızca Foundation'la kurulmuş karşılığıdır.

Temanın tanılaması açıkken, yarım saniye boyunca `min`'den az yer verilen bir bileşen `PantrixCheck.SmallTouchTarget` olarak bildirilir: çevresinde duran onu daha az yere yerleştirmiştir ve ona daha az bir yerde basılır.

Parametreler:

- `min: Dp`

### PantrixViewConfiguration

`import com.pantrixui.foundation.a11y.PantrixViewConfiguration`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixViewConfiguration(
    private val delegate: ViewConfiguration,
    private val minTouchTarget: Dp
) : ViewConfiguration by delegate
```

Compose'un isabet payını platformun hazır ayarına uydurur.

`PantrixTheme` verir; dokunma alanı dışındaki her şeyi devreder; böylece Compose'un `ViewConfiguration`'a ileride ekleyecekleri burada bir değişiklik olmadan çalışmaya devam eder.

Parametreler:

- `delegate: ViewConfiguration`: Dokunma alanı dışındaki her şeyin geldiği ayar: zaten geçerli olan.
- `minTouchTarget: Dp`: Dokunma alanı, iki yönde de aynı.
