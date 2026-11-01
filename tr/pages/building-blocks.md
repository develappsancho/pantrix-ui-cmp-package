# Yapı taşları

Kütüphanenin bileşenlerinin kurulduğu yapı taşları: kendi katmanını, kendi ipucunu ya da kendi kontrolünü yazan bir uygulama da onları kullanır.

## Özellikler

- **Portal.** `PantrixPortal { … }` içindekini pencerenin kökünde kurar, çağrıldığı yerde değil: bir `Popup` ya da bir `Dialog` için. Ölçerken içeriğini atan bir düzen, katmanı ölçüm ortasında kapatamaz.
- **Modal katman.** `PantrixModalLayer { … }` içindekinin, kapanana kadar tuşları ve basışları alan bir katman olduğunu söyler: altındaki odak halkaları gizlenir (`PantrixTheme.isUnderModal`).
- **Kendiliğinden çıkan.** `PantrixTransient(shown, onDismiss)` bir şeyin kimse açmadan çıktığını söyler, bir ipucu gibi: Escape onu, odak nerede olursa olsun kaldırır. Bir katman kendi içinde Escape'i `pantrixTransientsRoot()` ile duyar.
- **Otomasyon kökü.** `Modifier.pantrixAutomationRoot()` altındaki etiketleri platformun otomasyonuna açar. Tema bunu uygulamanın penceresi için, Pantrix'in katmanları kendi pencereleri için yapar; Android'de kendi başına bir pencere olan kendi `Popup`'ın ya da `Dialog`'un kökü de bunu taşır.
- **Basış göstergesi.** `pantrixPressIndication()` basılınca içerik renginde hafif bir örtü çizer, `pantrixPressIndicationWithColor(color)` verilen renkte; ikisi de bir `PantrixPressIndication`'dır.
- **Koşullu değiştirici.** `thenIfElse(condition, ifTrue, ifFalse)` bir değiştirici zincirini koşula göre sürdürür.
- **Kaydırma çubuğu.** `Modifier.pantrixVerticalScroll(state)` bir sütunu Pantrix'in kaydırma çubuğuyla kaydırır, `Modifier.pantrixScrollBar(listState)` tembel bir listeye çubuğunu verir.

## Örnekler

### Kendi katmanın

Kendi katmanın: düğme pencerenin ortasında bir `Popup` açar. Popup bir portaldan kurulur (`PantrixPortal`), içi bir modal katmandır (`PantrixModalLayer`) ve Escape'i kendi içinde duyar (`pantrixTransientsRoot()`). Katman açıkken altındaki sayfanın odak halkaları görünmez: düğmenin altındaki satır sayfanın bir modalın altında olduğunu (`PantrixTheme.isUnderModal`) yazar. Katmanın kendi içi onun altında değildir.

Android'de popup kendi başına bir penceredir: temanın etiketleri otomasyona açan işareti oraya ulaşmaz. Katmanın kökü bunu kendisi söyler (`pantrixAutomationRoot()`): "Kapat" düğmesini bir Maestro akışı `Button_close_layer` diye bulur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.PantrixModalLayer
import com.pantrixui.foundation.overlay.PantrixPortal
import com.pantrixui.foundation.overlay.pantrixTransientsRoot
import com.pantrixui.foundation.testing.pantrixAutomationRoot
import com.pantrixui.foundation.theme.PantrixTheme

var open by remember { mutableStateOf(false) }
PantrixButton(text = "Katmanı aç", onClick = { open = true }, variant = ButtonVariant.Outline, tagKey = "open_layer")
PantrixText(
    text = "Sayfa bir modalın altında mı: ${if (PantrixTheme.isUnderModal) "evet" else "hayır"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
if (open) {
    PantrixPortal {
        Popup(
            alignment = Alignment.Center,
            onDismissRequest = { open = false },
            properties = PopupProperties(focusable = true)
        ) {
            PantrixModalLayer {
                PantrixSurface(
                    modifier = Modifier.pantrixTransientsRoot().pantrixAutomationRoot(),
                    elevation = PantrixTheme.elevation.xl
                ) {
                    Column(
                        modifier = Modifier.widthIn(max = 280.dp).padding(PantrixTheme.spacing.lg),
                        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
                    ) {
                        PantrixText(text = "Uygulamanın kendi katmanı", style = PantrixTheme.typography.title)
                        PantrixText(text = "Escape ya da dışarı basmak katmanı kapatır.")
                        PantrixButton(text = "Kapat", onClick = { open = false }, tagKey = "close_layer")
                    }
                }
            }
        }
    }
}
```

### Kendiliğinden çıkan bir ipucu

Kendiliğinden çıkan bir ipucu. "İpucunu göster" bir ipucu çıkarır ve `PantrixTransient` onun çıktığını pencereye söyler: Escape'e bas, odak nerede olursa olsun ipucu kalkar ve tuş başka bir şeye gitmez.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.overlay.PantrixTransient
import com.pantrixui.foundation.theme.PantrixTheme

var shown by remember { mutableStateOf(false) }
PantrixTransient(shown = shown, onDismiss = { shown = false })
PantrixButton(
    text = if (shown) "İpucunu gizle" else "İpucunu göster",
    onClick = { shown = !shown },
    variant = ButtonVariant.Outline,
    tagKey = "show_hint"
)
if (shown) {
    PantrixSurface(color = PantrixTheme.colors.info.container) {
        PantrixText(
            text = "Escape'e bas: ipucu kalkar.",
            modifier = Modifier.padding(PantrixTheme.spacing.sm),
            color = PantrixTheme.colors.info.onContainer
        )
    }
}
```

### Basış göstergeleri ve koşullu bir değiştirici

Basış göstergeleri ve koşullu bir kenar. Üç kare üç göstergeyle basılır: içerik renginde (`pantrixPressIndication()`), markanın renginde (`pantrixPressIndicationWithColor`) ve elle kurulmuş bir `PantrixPressIndication` ile, kırmızı ve daha koyu. Bir kareye bas: seçilir ve kenarı `thenIfElse` ile kalınlaşır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.primitives.PantrixPressIndication
import com.pantrixui.foundation.primitives.pantrixPressIndication
import com.pantrixui.foundation.primitives.pantrixPressIndicationWithColor
import com.pantrixui.foundation.primitives.thenIfElse
import com.pantrixui.foundation.theme.PantrixTheme

var selected by remember { mutableStateOf(0) }
val colors = PantrixTheme.colors
val shape = PantrixTheme.shapes.md
val indications = listOf(
    pantrixPressIndication(),
    pantrixPressIndicationWithColor(PantrixTheme.colors.primary.color),
    PantrixPressIndication(pressColor = PantrixTheme.colors.danger.color, pressAlpha = 0.3f)
)
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    indications.forEachIndexed { index, indication ->
        Box(
            modifier = Modifier
                .size(72.dp)
                .thenIfElse(
                    condition = index == selected,
                    ifTrue = { border(2.dp, colors.primary.color, shape) },
                    ifFalse = { border(1.dp, colors.border, shape) }
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = indication
                ) { selected = index },
            contentAlignment = Alignment.Center
        ) {
            PantrixText(text = "${index + 1}", style = PantrixTheme.typography.title)
        }
    }
}
```

### Kaydırma çubuğu olan bir sütun

Penceresinden uzun bir sütun: bir sayfanın metni, bir ayarlar ekranı. `Modifier.pantrixVerticalScroll(state)` `verticalScroll` gibi kaydırır ve yanına Pantrix'in kaydırma çubuğunu koyar: kendi belge görünümlerinin çizdiği çubuk. Tutamağı ekrandaki payın uzunluğundadır ve o payın yerinde durur.

İşaretçisi olan okuyucuda çubuk, kayacak bir şey oldukça durur; işaretçinin altında koyulaşır ve fareyle sürüklenir. Parmağın altında yalnızca içerik kayarken görünür, sonra solar. İçeriğin üstüne çizilir: içerik genişliğini korur.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.scrollbar.pantrixVerticalScroll
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val scroll = rememberScrollState()
Column(
    modifier = Modifier
        .fillMaxWidth()
        .height(240.dp)
        .border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
        .pantrixVerticalScroll(scroll)
        .padding(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    repeat(times = 24) { index ->
        PantrixText(text = "Paragraf ${index + 1}: kaydırma çubuğu bu sütunun penceresinin kenarında durur.")
    }
}
```

### Kaydırma çubuğu olan bir liste

Tembel bir liste kendi durumuyla kendisi kayar; çubuğunu kendi değiştiricisinde alır: `Modifier.pantrixScrollBar(listState)`. Liste ekrandaki satırları ve kaç satır olduğunu bilir, ötekilerin boyunu bilmez: tutamak onları gördükleri kadar uzun sayar.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.scrollbar.pantrixScrollBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val list = rememberLazyListState()
LazyColumn(
    modifier = Modifier
        .fillMaxWidth()
        .height(240.dp)
        .border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
        .pantrixScrollBar(list),
    state = list,
    contentPadding = PaddingValues(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    items(count = 200) { index -> PantrixText(text = "Sipariş ${index + 1}") }
}
```

## API

### PantrixPortal

`import com.pantrixui.foundation.overlay.PantrixPortal`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixPortal(content: @Composable () -> Unit)
```

`content`'i bunun çağrıldığı yerde değil, pencerenin bir kökünde kurar: pencerenin üstünde kendi başına bir katman olarak gösterilenin yeri, bir `Popup` ya da bir `Dialog`.

Böyle bir katman pencere ölçülürken kompozisyondan çıkmamalıdır. Ölçerken kuran bir düzen, `BoxWithConstraints` ya da uyarlanabilir kutu, yeri bir eşiği geçince içeriğini bir ölçüm geçişinin ortasında atar. Compose Desktop ve web o zaman az önce kapattıkları bir katmanı ölçmeyi sürdürür ve uygulama `IllegalArgumentException: RootNodeOwner is already disposed` ile çöker. Bir portaldan geçen katmanı hiçbir ölçüm geçişinin kurmadığı kök kurar: çağıran atıldığında katman o kare için yine oradadır ve bir sonrakinin kompozisyonunda çıkar.

`content` çağıranın kompozisyon yerelleriyle kurulur, uygulamanınkinin içindeki bir tema da onlardan biridir, ve çağrı sürdükçe kurulu kalır. Hatırladığı ve sakladığı, yerinde olsa nasıl tutulacaksa öyle tutulur. Onu kök, kökün üst baş köşesinde yerleştirir: oraya yalnızca kendini pencerede yerleştiren, bir popup ve bir dialog gibi, aittir.

Kök en dıştaki `PantrixTheme`'inkidir. Bir katman açıldığı pencereye aittir; penceresinde böyle bir kök olmayan bir çağıran `content`'i bu yokmuş gibi yerinde kurar: çevresinde tema olmayan içerik, ve Android'de bir dialog'un ya da bir popup'ın tuttuğu, orada kendi başına bir pencere olan ve hiçbir ölçüm geçişinin zarar vermediği içerik.

Parametreler:

- `content: @Composable () -> Unit`

### PantrixModalLayer

`import com.pantrixui.foundation.a11y.PantrixModalLayer`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixModalLayer(content: @Composable () -> Unit)
```

`content`'in bir modal katmanın olduğunu söyler: uygulamanın üstünde gösterilen ve kapanana kadar tuşlarını ve basışlarını alan bir şey, bir dialog ve bir sheet gibi. O kurulu kaldıkça `PantrixTheme.isUnderModal` penceredeki başka her şey için true, `content`'te false'tur. Sonra açılan bir katman öncekinin üstünde durur; öncekinin içi o andan itibaren bir modalın altındadır.

Pantrix'in kendi modal katmanları bunu kendileri söyler. Uygulamanın `Dialog` üstüne kurulan kendi katmanı gösterdiğini bunun içine koyar, `Dialog`'un çevresine ya da içine; böylece örttüğü şey odakta görünmez olur: bir modalın altında odak, modal kapanınca yine orada olmak için olduğu yerde kalır ve bir odak halkası yalnızca bir tuşun ulaşacağı yerde çizilir. Android'de o `Dialog` kendi başına bir penceredir: gösterdiğinin kökündeki `com.pantrixui.foundation.testing.pantrixAutomationRoot` test etiketlerinin platformun otomasyonuna ulaşmasını sağlar.

Pencere, çağrının çevresindeki en dış temanınkidir: bir başkasının içindeki tema aynı penceredir, yan yana iki tema iki penceredir.

Parametreler:

- `content: @Composable () -> Unit`

### PantrixTransient

`import com.pantrixui.foundation.overlay.PantrixTransient`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTransient(
    shown: Boolean,
    onDismiss: () -> Unit
)
```

Bir şeyin pencerenin üstünde kendiliğinden çıktığını söyler, bir tooltip gibi: kimsenin açmadığı, odak almayan ve geldiği kadar hafifçe gitmesi gereken bir şey. `shown` iken:

- **Escape onu kaldırır**, odak pencerenin neresinde olursa olsun. Tuş onun için basılmıştır ve öteye gitmez: ne bir kontrole ne onu geri diye duyacak bir sahibe. Bir işaretçinin ya da odağın çıkardığı şey ikisini de oynatmadan kapanır (WCAG 1.4.13).

- **Sonraki onu kaldırır.** Bir pencerede bir anda böyle bir şey gösterilir: işaretçi başka bir yerde dururken klavyenin odağının çıkardığı ikincisi birincinin yerini alır.

İki durumda da `onDismiss` çağrılır ve çağıran onu göstermeyi bırakır.

Escape pencerenin içeriğinin bir kökünde duyulur: en dıştaki `PantrixTheme`'inkinde, ve kendi başına bir pencere ya da katman olan bir katmanda `pantrixTransientsRoot` taşıyan öğede. Bir tuş, odak kökün altında neredeyse oradan köke ulaşır. Bir kökün altında hiçbir şey odakta değilken bir tuş orada hiçbir şeye ulaşmaz; kök, her platformun izin verdiği gibi, Escape'in o zaman da duyulmasını sağlar.

Parametreler:

- `shown: Boolean`: çıkıp çıkmadığı.
- `onDismiss: () -> Unit`: Escape için, ve pencerede kendiliğinden çıkan başka bir şey belirince çağrılır.

### Modifier.pantrixTransientsRoot

`import com.pantrixui.foundation.overlay.pantrixTransientsRoot`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.pantrixTransientsRoot(): Modifier
```

Bu öğeyi pencerenin kendiliğinden çıkanları için Escape'in duyulduğu bir kök yapar: altında herhangi bir yerde basılan tuş, bu öğenin altındaki herhangi bir kontrol duymadan `PantrixTransient`'in gösterildiğini söylediğini kaldırır ve öteye gitmez. Gösterilen bir şey yokken tuş bu öğenin değildir ve bu yokmuş gibi yoluna devam eder.

En dıştaki `PantrixTheme` uygulamanın kendi içeriği için böyle bir köktür. Klavyeyi kendisine alan bir katman, bir dialog ya da bir popover, bunu gösterdiğini tutan öğeye koyar: içinde basılan bir tuş altındaki uygulamanın hiçbir şeyine ulaşmaz. Uygulamanın kendi katmanı o öğeye `com.pantrixui.foundation.testing.pantrixAutomationRoot`'u da koyar: Android'de kendi başına bir penceredir, temanın işareti oraya ulaşmaz; test etiketleri platformun otomasyonuna bu işaretle ulaşır.

Bir tuş odağı olan kontrole ve çevresindekilere ulaşır. Hiçbir kontrolün odakta olmadığı bir kökün altında, bir işaretçinin açtığı bir dialog'daki gibi, bir tuş hiçbir şeye ulaşmaz ve bir katman Escape'i kendisine alıp kapanır. Escape orada da önce çıkanı kaldırsın diye:

- masaüstünde, web'de ve iOS'ta bir şey çıkmışken ve altında hiçbir şey odakta değilken odağı kökün kendisi tutar. Kendi başına bir durak değildir ve bundan bir şey göstermez. Masaüstünde yalnızca sahnenin kendi bileşeni pencerenin klavyesini tutarken ister: pencerenin sahnenin yanında ya da içinde tuttuğu hiçbir Swing bileşeninden klavyeyi almaz. Web'de sayfada da dinler: sayfaya verilen ama tuvaline verilmeyen bir tuş için.

- Android'de kök, penceresinde hiçbir şeyin almadığı tuşları dinler. Orada bir katman kendi başına bir penceredir. Bir dialog'un penceresi Escape'i kendisine almadan önce dinleyicilerine sorar: çıkan gider, dialog kalır. Geri tuşunun kapattığı bir popover'ın penceresi Escape'i, gösterdiği hiçbir şeye sorulmadan önce alır: hemen kapanır ve içinde çıkan da onunla gider.

Kök aynı zamanda altından açılan katmanların kullanıcının nerede olduğunu duyduğu yerdir: altındaki son basış, ve o basıştan sonra bir tuşa basıldıysa altında odağı tutan denetim. Katlanabilir bir cihazda bir dialog kat yerinin açıldığı yarısında açılır (`OverlayWindow.openedFrom`). Kök her basışa ve her tuşa altındakilerden önce bakar, hiçbirini almaz.

### Modifier.pantrixAutomationRoot

`import com.pantrixui.foundation.testing.pantrixAutomationRoot`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.pantrixAutomationRoot(): Modifier
```

Altındaki test etiketlerini platformun arayüz otomasyonuna açar: bir Maestro akışı, UI Automator ya da XCUITest bir bileşeni her dilde etiketiyle, `Button_save` diye bulur.

Android'de bir etiket, ancak bunu söyleyen bir öğenin altında öğenin kaynak kimliği (resource id) olur ve her pencerenin kendi öğeleri vardır: uygulamanın penceresi için bunu en dıştaki `PantrixTheme` söyler, Pantrix'in kendi dialog'ları, sheet'leri, menüleri ve popover'ları da kendi pencereleri için. Uygulamanın kendi açtığı bir pencere, bir `Popup` ya da bir `Dialog`, ikisinin de erişiminin dışındadır: gösterdiği şey bunu kendi köküne koyar ve etiketleri otomasyona uygulamanınkiler gibi ulaşır. iOS'ta Compose bir etiketi otomasyona erişilebilirlik kimliği olarak kendisi verir; masaüstünde ve web'de bir test anlam ağacını okur: oralarda bu bir şey değiştirmez.

Altındaki her test etiketini açar, uygulamanın kendi `Modifier.testTag`'ini de. Temanın Pantrix'in etiketlerini anlam ağacının dışında tuttuğu yerde (`TestTagPolicy.Off`) açılacak öyle bir etiket yoktur.

### PantrixPressIndication

`import com.pantrixui.foundation.primitives.PantrixPressIndication`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixPressIndication(
    private val pressColor: Color = Color.Black,
    private val pressAlpha: Float = 0.1f
) : IndicationNodeFactory
```

Bir kontrolün basışı aldığını kişiye söyleyen geri bildirim, dalga efektinin yerine: kontrol basılı kaldıkça `pressColor` ile örtülür ve bırakılınca örtü kaybolur.

Basış hemen görünür. Bırakış, örtü solmadan önce basışın bitmesini bekler; böylece en kısa dokunuş bile görülür. İptal edilen bir basış, yani kayıp giden bir parmak ya da hareketi bir kaydırmanın alması, hemen solar.

Parametreler:

- `pressColor: Color`: Kontrol basılıyken üstüne konan renk: verilmezse siyah.
- `pressAlpha: Float`: O rengin tam bir basıştaki gücü, 0 ile 1 arasında: verilmezse 0.1.

### pantrixPressIndication

`import com.pantrixui.foundation.primitives.pantrixPressIndication`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun pantrixPressIndication(pressAlpha: Float = 0.1f): PantrixPressIndication
```

Geçerli temanın basış göstergesi: kontrolü açık bir zeminde koyulaştırır, koyu bir zeminde açar; böylece basış ikisinde de görülür.

Parametreler:

- `pressAlpha: Float`: Örtünün tam bir basıştaki gücü, 0 ile 1 arasında: verilmezse 0.1.

### pantrixPressIndicationWithColor

`import com.pantrixui.foundation.primitives.pantrixPressIndicationWithColor`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun pantrixPressIndicationWithColor(
    pressColor: Color,
    pressAlpha: Float = 0.1f
): PantrixPressIndication
```

Temanın değil çağıranın seçtiği bir renkte basış göstergesi. `pantrixPressIndication` temayı izler.

Parametreler:

- `pressColor: Color`: Kontrol basılıyken üstüne konan renk.
- `pressAlpha: Float`: O rengin tam bir basıştaki gücü, 0 ile 1 arasında: verilmezse 0.1.

### Modifier.thenIfElse

`import com.pantrixui.foundation.primitives.thenIfElse`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.thenIfElse(
    condition: Boolean,
    ifTrue: Modifier.() -> Modifier,
    ifFalse: Modifier.() -> Modifier
): Modifier
```

Bu değiştirici: `condition` tuttuğunda `ifTrue` uygulanmış, tutmadığında `ifFalse`.

Parametreler:

- `condition: Boolean`
- `ifTrue: Modifier.() -> Modifier`
- `ifFalse: Modifier.() -> Modifier`

### Modifier.pantrixVerticalScroll

`import com.pantrixui.components.elements.scrollbar.pantrixVerticalScroll`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun Modifier.pantrixVerticalScroll(
    state: ScrollState,
    enabled: Boolean = true,
    color: Color = Color.Unspecified
): Modifier
```

Bu içeriği `state` ile, `Modifier.verticalScroll` gibi aşağı yukarı kaydırır ve yanına Pantrix'in kaydırma çubuğunu koyar: penceresinden uzun bir metin sayfası, bir form, bir ayarlar ekranı.

Çubuk, Pantrix'in kendi belge görünümlerinin çizdiği çubuktur. Tutamağı içeriğin ekrandaki payı kadar uzundur ve o payın olduğu yerde durur. Okuyucunun imleci varsa kayacak bir şey oldukça oradadır, imlecin altında koyulaşır ve fareyle sürüklenir; parmağın altında içerik kayarken görünür ve sonra solar, çünkü parmak içeriğin kendisini kaydırır. İçeriğin sonunda, sağdan sola okunan düzende solda durur ve içeriğin yanına değil üstüne çizilir: içerik genişliğini korur.

Kaydırma ve çubuk birlikte gelir; böylece çubuk, altında kayan içeriğin üstünde değil, içeriğin içinde kaydığı pencerenin üstünde durur:

```kotlin
val scroll = rememberScrollState()
Column(Modifier.fillMaxSize().pantrixVerticalScroll(scroll)) {
    Article()
}
```

Tembel bir liste kendisi kayar ve çubuğunu `pantrixScrollBar` ile alır.

Parametreler:

- `state: ScrollState`: İçeriğin ne kadar kaydırıldığı, `rememberScrollState()`'in verdiği gibi.
- `enabled: Boolean`: Sürüklemenin, tekerleğin ve çubuğun içeriği kaydırıp kaydırmadığı: çubuk, kayacak bir şey oldukça her iki durumda da çizilir.
- `color: Color`: Tutamağın gücünün bir payıyla çizildiği renk: verilmezse temanın `textSecondary`'si. Bir dolgunun üstünde, onun üstüne yazılan renk.

### Modifier.pantrixScrollBar

`import com.pantrixui.components.elements.scrollbar.pantrixScrollBar`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun Modifier.pantrixScrollBar(
    state: LazyListState,
    color: Color = Color.Unspecified
): Modifier
```

Kendi `state`'iyle kayan tembel bir listenin yanındaki Pantrix kaydırma çubuğu: `pantrixVerticalScroll`'un çizdiği çubuk, listenin kendi değiştiricisinde.

Tembel bir liste ekrandaki satırları ve kaç satır olduğunu bilir, ötekilerin ne kadar yüksek olduğunu bilmez: tutamak onları gördükleri kadar yüksek sayar; bir listenin satırları çoğunlukla öyledir. Öyle olmadıklarında tutamağın uzunluğu satırlar geçtikçe biraz değişir.

```kotlin
val list = rememberLazyListState()
LazyColumn(modifier = Modifier.fillMaxSize().pantrixScrollBar(list), state = list) {
    items(orders, key = { it.id }) { order -> OrderRow(order) }
}
```

Parametreler:

- `state: LazyListState`: Listenin durumu, listeye verilen.
- `color: Color`: Tutamağın gücünün bir payıyla çizildiği renk: verilmezse temanın `textSecondary`'si.
