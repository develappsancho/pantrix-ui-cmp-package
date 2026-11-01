# Time Filled Text Field

Günün bir saati için dolu bir metin alanı: `PantrixTimeTextField`'ın dolu kutudaki hâli. Etiket kutunun içindedir: alan boş ve odaksızken yazının yerinde durur, odaklanınca yukarı çıkar ve düzen (`SS:DD`) görünür. Rakamlar, yapıştırma, 12 saat, kendi hataları ve seçici `PantrixTimeTextField`'daki gibidir.

- `PantrixTimeFilledTextField` (`com.pantrixui.components.date.timefilledtextfield`, `com.pantrixui:components`): Günün bir saati için dolgulu yazı alanı: rakamlarla yazılır ya da düğmesinin açtığı saat seçiciden seçilir; almadığı bir saat için kendi hataları vardır. Anahtar sözcükler: saat alanı, dolgulu saat alanı, maskeli saat, kayan etiket.

## Kullanım

### A meeting's start, on the quarter hour

```kotlin
var start by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeFilledTextField(
    value = start,
    onValueChange = { start = it },
    label = stringResource(Res.string.meeting_start),
    minuteStep = 15,
    tagKey = "start"
)
```

### Within working hours

```kotlin
var call by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeFilledTextField(
    value = call,
    onValueChange = { call = it },
    label = stringResource(Res.string.call_time),
    minTime = PantrixTime(9, 0),
    maxTime = PantrixTime(18, 0),
    tagKey = "call"
)
```

### By a clock of twelve hours

```kotlin
var alarm by remember { mutableStateOf<PantrixTime?>(PantrixTime(7, 30)) }
PantrixTimeFilledTextField(
    value = alarm,
    onValueChange = { alarm = it },
    label = stringResource(Res.string.alarm),
    is24Hour = false,
    presentation = DatePickerPresentation.Sheet,
    tagKey = "alarm"
)
```

## Örnekler

### Toplantı başlangıcı, çeyrek saatlerle

Bir toplantının başlangıcı, çeyrek saatlerle: seçicinin dakikaları on beşer dakika arayla gelir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var start by remember { mutableStateOf<PantrixTime?>(null) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimeFilledTextField(
        value = start,
        onValueChange = { start = it },
        label = "Toplantı başlangıcı",
        minuteStep = QUARTER,
        showClearButton = true,
        tagKey = "meeting_start"
    )
    PantrixText(
        text = start?.let { "Başlangıç: ${strings.time(it.hour, it.minute, is24Hour = true)}" }
            ?: "Henüz bir saat yok",
        style = PantrixTheme.typography.body
    )
}

private const val QUARTER = 15
```

### Çalışma saatleri içinde

Çalışma saatleri içinde bir arama: aralık dışında yazılan bir saat alınmaz ve alan iki ucu söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.foundation.date.PantrixTime

var call by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimeFilledTextField(
    value = call,
    onValueChange = { call = it },
    label = "Arama saati",
    supportingText = "Hafta içi 09:00 ile 18:00 arası",
    minTime = PantrixTime(OPENS, 0),
    maxTime = PantrixTime(CLOSES, 0),
    tagKey = "call"
)

private const val OPENS = 9

private const val CLOSES = 18
```

### 12 saatlik saat

12 saatlik bir saat: günün yarısı kutuda rakamların yanında durur ve basınca çevrilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.foundation.date.PantrixTime

var alarm by remember { mutableStateOf<PantrixTime?>(PantrixTime(7, 30)) }
PantrixTimeFilledTextField(
    value = alarm,
    onValueChange = { alarm = it },
    label = "Alarm",
    is24Hour = false,
    tagKey = "alarm"
)
```

### Forma bağlı

Bir formun alanına bağlı: saat boşken "Kaydet" hatayı gösterir ve odağı alana gönderir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.foundation.date.PantrixTime
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val report = LocalExampleEvents.current
val start = form.field<PantrixTime?>("shift_start", initial = null, Rules.required("Vardiyanın başlangıcını yazın"))
PantrixTimeFilledTextField(
    field = start,
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Vardiya başlangıcı",
    minuteStep = QUARTER
)
PantrixButton(
    text = "Kaydet",
    onClick = { scope.launch { form.submit { report("Kaydedildi") } } },
    form = form,
    tagKey = "save_shift"
)

private const val QUARTER = 15
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Bir durumla

Bir durumla: `state.time` alanın saati, `state.text` yazılan rakamlar. İkisi birlikte boş alanı yarım yazılmış alandan ayırır. Düğme durumun saatini değiştirir; alan onu kendisi yazar, 12 saatte günün yarısıyla birlikte.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.rememberTimeTextFieldState
import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberTimeTextFieldState()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimeFilledTextField(
        state = state,
        label = "Hatırlatma",
        is24Hour = false,
        tagKey = "reminder"
    )
    PantrixText(
        text = when {
            state.time != null -> "Saat: ${state.time}"
            state.text.isEmpty() -> "Alan boş"
            else -> "Yarım: ${state.text}"
        },
        style = PantrixTheme.typography.body
    )
    PantrixButton(
        text = "Şimdiyi yaz",
        onClick = { state.time = PantrixTime.now() },
        variant = ButtonVariant.Outline,
        tagKey = "write_now"
    )
}
```

## API

### PantrixTimeFilledTextField

`import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTimeFilledTextField(
    value: PantrixTime?,
    onValueChange: (PantrixTime?) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Günün bir saati için dolu bir metin alanı: saat rakamlarla yazılır ya da kutunun sonundaki bir düğmenin açtığı bir saat seçiciden seçilir. Dolu bir kutudaki `PantrixTimeTextField`'dır.

`PantrixFilledTextField` gibi çizilir: etiket kutunun içindedir, alan boş ve odaksızken yazının yerinde durur, etiket yukarı çıkınca düzen görünür. Yalnız rakam alır, en çok dört: saat tamamlanınca iki nokta kendiliğinden gelir, `1430` `14:30` görünür; saatin başı olamayan bir ilk rakam tek haneli bir saattir, `930` `09:30` görünür. Telefon rakam klavyesini gösterir. Kutu boşken düzeni gösterir, Türkçede `SS:DD`, İngilizcede `HH:MM`; ekran okuyucuya bu parçaların sırası olarak söylenir. Yazılmış olarak yapıştırılan bir saat yazıldığı gibi okunur: `14:30`, `14.30`, `1430` ya da günün yarısıyla `2:30 PM`; dakikadan sonra yazılan saniye bırakılır.

12 saatlik bir saatte, `is24Hour` false iken, saatler 01–12 yazılır ve günün yarısı kutuda onların yanında bir düğme olarak durur: ona basmak ya da odaktayken Boşluk onu çevirir, alana yazılan A ve P de onu belirler.

`onValueChange`'e alanın tuttuğu saat her değiştiğinde söylenir: yazıldıkça ya da seçildikçe alanın aldığı tam bir saat; alan boşken, yarım yazılmışken ya da saat olmayan ya da alanın almadığı bir saati tutan rakamlar varken null. Alan yazılanı kendisi tutar, böylece `value` null iken yarım yazılmış bir saat ekranda kalır. Alanınkinden başka bir saat olan `value` alana yazılır, null bir `value` saat tutan bir alanı boşaltır. Bir `value`'nin saniyesi, saati ve dakikası yeniden yazılmadıkça korunur; yazılan bir saatin saniyesi yoktur.

Alan, yazılan yanlış olduğunda kendi hatasını kutunun altına yazar: kullanıcı alandan çıkınca tam bir saat etmeyen rakamlar; saatte olmayan bir saat, 25:00; ve `minTime`'dan önce ya da `maxTime`'dan sonra bir saat. Çağıranın `error`'u önce gelir; mesajı `supportingText`'tir.

Seçici düğmesiyle, Alt ve ↓ ile, `readOnly` bir alanda kutuya basınca, Enter ya da Boşluk ile de açılır: salt okunur bir alan saati yalnız seçiciden alır. `presentation`'ın söylediğinde açılır, her platformda aynı. Ona basılan bir değer hemen alanındır ve seçiciyi açık bırakır, böylece saatten sonra dakika seçilebilir; bir değerde Enter, Escape ve dışarı basmak onu kapatır. Klavyeyle açılınca odak seçili saatine, yoksa şimdiki saate gider ve kapanınca alana döner.

Parametreler:

- `value: PantrixTime?`: alanın gösterdiği saat ya da null.
- `onValueChange: (PantrixTime?) -> Unit`: kullanıcı alanın saatini her değiştirdiğinde söylenir: bir saat, ya da hiçbiri için null.
- `modifier: Modifier`: bütün alanın modifier'ı: etiketi, kutusu ve altındakiler.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı. Kullanılamayan bir alan odak almaz ve seçici açmaz.
- `readOnly: Boolean`: saatin yazılmayıp yalnız seçiciden seçilip seçilemeyeceği.
- `label: String?`: alanın ne için olduğu, kutunun üstüne yazılır: ekran okuyucu için alanın ve seçicisinin adı.
- `placeholder: String?`: kutu boşken, alanın kendisinin gösterdiği düzenin yerinde gösterilir.
- `supportingText: String?`: kutunun altındaki yardım. `error` ile neyin düzeltileceğini söyleyen mesajdır; onsuz, alanın kendi hatası varken onun yerini alır.
- `error: Boolean`: çağıranın saati yanlış bulup bulmadığı, önceden alınmış bir saat gibi: alan hatalı çizilir ve mesaj `supportingText`'tir.
- `leadingIcon: (@Composable () -> Unit)?`: metnin önünde duran. Bir yuva içine konanı boyutlandırmaz.
- `showClearButton: Boolean`: alan yazılabilirken ve boş değilken onu boşaltan bir düğme gösterir.
- `minTime: PantrixTime?`: alanın aldığı ilk saat ya da ilk olmaması için null. `maxTime`'dan sonraysa saatler bir gecenin saatleri gibi gece yarısını geçer.
- `maxTime: PantrixTime?`: alanın aldığı son saat ya da son olmaması için null.
- `minuteStep: Int`: seçicinin dakikalarının kaç dakika arayla geldiği, 1 ile 60 arası. Aralarında yazılan bir dakika alınır.
- `is24Hour: Boolean`: alanın ve seçicisinin bir günün saatlerini, 00 ile 23 arasını mı, yoksa 12 saatlik bir saatle mi saydığı.
- `presentation: DatePickerPresentation`: seçicinin neyde açıldığı: varsayılan dar bir pencerede bir sheet, daha geniş pencerede kutunun altında bir popover, açılırken seçilir; ya da her zaman bir popover, bir sheet ya da bir dialog.
- `style: FilledTextFieldStyle?`: alanın bu çağrıya ait stili: kapsayan her stilin üstünde, yoğunluğun altında.
- `colors: FilledTextFieldColors?`: bu çağrının alanın kendi renkleri, temanın rollerinin yerine.
- `pickerStyle: TimePickerStyle?`: bu çağrının kendi seçici stili.
- `pickerColors: TimePickerColors?`: bu çağrının kendi seçici renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: alanın otomasyon anahtarı: alan `TimeFilledTextField_<tagKey>`, düğmesi `TimeFilledTextFieldClock_<tagKey>`, günün yarısı `TimeFilledTextFieldPeriod_<tagKey>`, temizleme düğmesi `TimeFilledTextFieldClear_<tagKey>` ve seçicisi `TimePicker_<tagKey>`'dır. Alan seçicinin açıldığını ve onda bir değer seçildiğini bildirir, saati hiçbir zaman bildirmez.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış: odağı, üstündeki işaretçi ve basışları.

### PantrixTimeFilledTextField

`import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTimeFilledTextField(
    state: TimeTextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Çağıranın tuttuğu bir `state` üzerinde bir saat alanı; başka her bakımdan bir değerin `PantrixTimeFilledTextField`'ı gibidir: durumun `time`'ı alanın saatidir, onu yazmak saati alana koyar, `text`'i de yarım yazılmış bir alanı boş bir alandan ayırır.

Parametreler:

- `state: TimeTextFieldState`: yazılan rakamlar ve onların ettiği saat. `rememberTimeTextFieldState()` ile oluşturun.
- `modifier: Modifier`: bütün alanın modifier'ı: etiketi, kutusu ve altındakiler.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı. Kullanılamayan bir alan odak almaz ve seçici açmaz.
- `readOnly: Boolean`: saatin yazılmayıp yalnız seçiciden seçilip seçilemeyeceği.
- `label: String?`: alanın ne için olduğu, kutunun üstüne yazılır: ekran okuyucu için alanın ve seçicisinin adı.
- `placeholder: String?`: kutu boşken, alanın kendisinin gösterdiği düzenin yerinde gösterilir.
- `supportingText: String?`: kutunun altındaki yardım. `error` ile mesajdır; onsuz, alanın kendi hatası varken onun yerini alır.
- `error: Boolean`: çağıranın saati yanlış bulup bulmadığı: alan hatalı çizilir ve mesaj `supportingText`'tir.
- `leadingIcon: (@Composable () -> Unit)?`: metnin önünde duran.
- `showClearButton: Boolean`: alan yazılabilirken ve boş değilken onu boşaltan bir düğme gösterir.
- `minTime: PantrixTime?`: alanın aldığı ilk saat ya da ilk olmaması için null; `maxTime`'dan sonraysa saatler gece yarısını geçer.
- `maxTime: PantrixTime?`: alanın aldığı son saat ya da son olmaması için null.
- `minuteStep: Int`: seçicinin dakikalarının kaç dakika arayla geldiği, 1 ile 60 arası.
- `is24Hour: Boolean`: alanın ve seçicisinin bir günün saatlerini mi, yoksa 12 saatlik bir saatle mi saydığı.
- `presentation: DatePickerPresentation`: seçicinin neyde açıldığı: varsayılan dar bir pencerede bir sheet, daha geniş pencerede kutunun altında bir popover, açılırken seçilir; ya da her zaman bir popover, bir sheet ya da bir dialog.
- `style: FilledTextFieldStyle?`: bu çağrının alanın kendi stili.
- `colors: FilledTextFieldColors?`: bu çağrının alanın kendi renkleri.
- `pickerStyle: TimePickerStyle?`: bu çağrının kendi seçici stili.
- `pickerColors: TimePickerColors?`: bu çağrının kendi seçici renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: alanın otomasyon anahtarı; bir değerin `PantrixTimeFilledTextField`'ı onu nasıl alıyorsa öyle.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış.

### PantrixTimeFilledTextField

`import com.pantrixui.components.date.timefilledtextfield.PantrixTimeFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTimeFilledTextField(
    field: FormField<PantrixTime?>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: TimePickerStyle? = null,
    pickerColors: TimePickerColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı bir saat alanı: saati, hatası ve adı `field`'dan gelir.

Alanın değeri saat alanının tuttuğu saattir, hiçbirini tutmazken null; değere kodda yapılan bir değişiklik, aralarında bir sıfırlama da, alana yazılır. Kullanıcı alandan çıkınca, seçiciye geçmek çıkmak sayılmadan, alan dokunulmuş olarak işaretlenir ve denetlenir. Hatalıyken mesajı `supportingText`'in ve saat alanının kendi hatasının yerini alır. Saat etmeyen rakamlar değeri null bırakır: bir saatin gerektiği yerde alana null için bir kural verin, `Rules.required`; mesajı kullanıcı çıkınca görünür. Alanın id'si otomasyon anahtarıdır, `TimeFilledTextField_<id>`, ve form odağı buraya gönderebilir.

Parametreler:

- `field: FormField<PantrixTime?>`: saat alanının gösterdiği ve değiştirdiği formun alanı.
- `modifier: Modifier`: bütün alanın modifier'ı.
- `form: FormState?`: verilirse klavyenin eylem tuşu formu ona kayıtlı düğme üzerinden gönderir.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı.
- `readOnly: Boolean`: saatin yalnız seçiciden seçilip seçilemeyeceği.
- `label: String?`: alanın ne için olduğu, kutunun üstünde yazılı.
- `placeholder: String?`: kutu boşken, düzenin yerinde gösterilir.
- `supportingText: String?`: kutunun altındaki yardım, alanın orada gösterecek bir hatası yokken.
- `leadingIcon: (@Composable () -> Unit)?`: metnin önünde duran.
- `showClearButton: Boolean`: alan yazılabilirken ve boş değilken onu boşaltan bir düğme gösterir.
- `minTime: PantrixTime?`: alanın aldığı ilk saat ya da ilk olmaması için null; `maxTime`'dan sonraysa saatler gece yarısını geçer.
- `maxTime: PantrixTime?`: alanın aldığı son saat ya da son olmaması için null.
- `minuteStep: Int`: seçicinin dakikalarının kaç dakika arayla geldiği, 1 ile 60 arası.
- `is24Hour: Boolean`: alanın ve seçicisinin bir günün saatlerini mi, yoksa 12 saatlik bir saatle mi saydığı.
- `presentation: DatePickerPresentation`: seçicinin neyde açıldığı: varsayılan dar bir pencerede bir sheet, daha geniş pencerede kutunun altında bir popover, açılırken seçilir; ya da her zaman bir popover, bir sheet ya da bir dialog.
- `style: FilledTextFieldStyle?`: bu çağrının alanın kendi stili.
- `colors: FilledTextFieldColors?`: bu çağrının alanın kendi renkleri.
- `pickerStyle: TimePickerStyle?`: bu çağrının kendi seçici stili.
- `pickerColors: TimePickerColors?`: bu çağrının kendi seçici renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış.

### TimeTextFieldState

`import com.pantrixui.components.date.common.TimeTextFieldState`, `com.pantrixui:components` içinden

```kotlin
class TimeTextFieldState(initial: PantrixTime? = null)
```

Kendisi tutan bir çağıran için bir saat alanının tuttuğu: şimdiye dek ona yazılan rakamlar ve onların ettiği saat.

`time` alanın aldığı saattir: alan boşken, yazılan tam bir saat değilken, saatte olmayan bir saati adlandırırken ya da alanın almadığı bir saatken null. Onu yazmak saati alana koyar; null yapmak alanı boşaltır. Alanın o sırada çizmediği bir durum saati tutar ve alan çizilince onu yazar. Bir saatin saniyesi, saati ve dakikası yeniden yazılmadıkça korunur.

`rememberTimeTextFieldState` ile oluşturun; onu bir yapılandırma değişikliği ve geri getirilen bir süreç boyunca tutar.

Parametreler:

- `initial: PantrixTime?`: alanın başladığı saat ya da boş bir alan için null.

Üyeleri:

- `time: PantrixTime?`: Alanın aldığı saat ya da null: sınıfa bakın.
- `text: CharSequence`: Şimdiye dek yazılan rakamlar, alanın saatle dakika arasında gösterdiği işaret olmadan: `14:3` için `143`. `time` ikisi için de null iken yarım yazılmış bir alanı boş bir alandan ayırır.
- `fun clear()`: Alanı boşaltır: hiçbir rakam kalmaz, saat de.

Tipin kendisinde:

- `TimeTextFieldState.Saver: Saver<TimeTextFieldState, Any>`: `rememberTimeTextFieldState`'in bir durumu tuttuğu saver.
