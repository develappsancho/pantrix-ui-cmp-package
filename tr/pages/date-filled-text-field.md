# Date Filled Text Field

Bir gün için dolu bir metin alanı: `PantrixDateTextField`'ın dolu kutudaki hâli. Etiket kutunun içindedir: alan boş ve odaksızken yazının yerinde durur, odaklanınca yukarı çıkar ve düzen (`GG.AA.YYYY`) görünür.

- `PantrixDateFilledTextField` (`com.pantrixui.components.date.datefilledtextfield`, `com.pantrixui:components`): Bir gün için dolgulu yazı alanı: dilin sırasında rakamlarla yazılır ya da düğmesinin açtığı takvimden seçilir; almadığı bir gün için kendi hataları vardır. Anahtar sözcükler: tarih alanı, dolgulu tarih alanı, doğum tarihi, maskeli tarih, kayan etiket.

## Özellikler

- **Aynı alan.** Rakamlar, biçim, kendi hataları, takvim ve üç biçimi (`value`, `state`, `field`) `PantrixDateTextField`'ınkilerin aynısıdır; yalnız kutusu `PantrixFilledTextField` gibi çizilir.
- **Stil ve renkler.** `style` (`FilledTextFieldStyle`) ve `colors` (`FilledTextFieldColors`) kutunun, `pickerStyle` ve `pickerColors` takvimindir.

## Kullanım

### A birthday, typed

```kotlin
var birthday by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDateFilledTextField(
    value = birthday,
    onValueChange = { birthday = it },
    label = stringResource(Res.string.birthday),
    maxDate = rememberToday(),
    tagKey = "birthday"
)
```

### A delivery day on a weekday, from a sheet

```kotlin
var delivery by remember { mutableStateOf<PantrixDate?>(null) }
val today = rememberToday()
PantrixDateFilledTextField(
    value = delivery,
    onValueChange = { delivery = it },
    label = stringResource(Res.string.delivery_day),
    minDate = today.plusDays(1),
    maxDate = today.plusMonths(1),
    isDateEnabled = { it.dayOfWeek <= 5 },
    presentation = DatePickerPresentation.Sheet,
    tagKey = "delivery"
)
```

### On a state, half typed or whole

```kotlin
val start = rememberDateTextFieldState()
PantrixDateFilledTextField(
    state = start,
    label = stringResource(Res.string.start_date),
    format = DateFieldFormat.Iso,
    tagKey = "start"
)
val shown = start.date?.toString() ?: if (start.text.isEmpty()) "–" else "…"
```

## Örnekler

### Doğum günü

Bir doğum günü, dolu kutuda: bugünden sonrası alınmaz. Etiket odaklanınca yukarı çıkar, düzen görünür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday

var birthday by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDateFilledTextField(
    value = birthday,
    onValueChange = { birthday = it },
    label = "Doğum günü",
    maxDate = rememberToday(),
    showClearButton = true,
    tagKey = "birthday"
)
```

### Takvim bir dialog'da

Hafta içi bir teslim günü; takvim pencerenin ortasında bir dialog'da açılır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.DatePickerPresentation
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday

var delivery by remember { mutableStateOf<PantrixDate?>(null) }
val today = rememberToday()
PantrixDateFilledTextField(
    value = delivery,
    onValueChange = { delivery = it },
    label = "Teslim günü",
    minDate = today.plusDays(1),
    maxDate = today.plusMonths(1),
    isDateEnabled = { it.dayOfWeek <= FRIDAY },
    presentation = DatePickerPresentation.Dialog,
    tagKey = "delivery"
)

private const val FRIDAY = 5
```

### Uygulamanın hatası ve devre dışı

Uygulamanın hatası ve devre dışı bir alan, dolu kutuda.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.foundation.date.PantrixDate

var meeting by remember { mutableStateOf<PantrixDate?>(PantrixDate(2026, 11, 2)) }
val taken = meeting == PantrixDate(2026, 11, 2)
PantrixDateFilledTextField(
    value = meeting,
    onValueChange = { meeting = it },
    label = "Toplantı günü",
    supportingText = if (taken) "Bu gün dolu, başka bir gün seçin" else "Ofisin açık olduğu bir gün",
    error = taken,
    tagKey = "meeting"
)
PantrixDateFilledTextField(
    value = PantrixDate(2026, 10, 1),
    onValueChange = {},
    enabled = false,
    label = "Sözleşme başlangıcı",
    tagKey = "contract"
)
```

### Forma bağlı

Bir formun alanına bağlı, dolu kutuda: gün boşken "Kaydet" hatayı gösterir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val report = LocalExampleEvents.current
val start = form.field<PantrixDate?>("start", initial = null, Rules.required("İşe başlama gününü yazın"))
PantrixDateFilledTextField(
    field = start,
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "İşe başlama günü",
    minDate = rememberToday()
)
PantrixButton(
    text = "Kaydet",
    onClick = { scope.launch { form.submit { report("Kaydedildi") } } },
    form = form,
    tagKey = "save_start"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Bir durumla

Bir durumla: `state.date` alanın günü, `state.text` yazılan rakamlar. İkisi birlikte boş alanı yarım yazılmış alandan ayırır. Düğme durumun gününü değiştirir; alan onu kendisi yazar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.rememberDateTextFieldState
import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberDateTextFieldState()
val today = rememberToday()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixDateFilledTextField(
        state = state,
        label = "Rapor günü",
        tagKey = "report_day"
    )
    PantrixText(
        text = when {
            state.date != null -> "Gün: ${state.date}"
            state.text.isEmpty() -> "Alan boş"
            else -> "Yarım: ${state.text}"
        },
        style = PantrixTheme.typography.body
    )
    PantrixButton(
        text = "Bugünü yaz",
        onClick = { state.date = today },
        variant = ButtonVariant.Outline,
        tagKey = "write_today"
    )
}
```

## API

### PantrixDateFilledTextField

`import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDateFilledTextField(
    value: PantrixDate?,
    onValueChange: (PantrixDate?) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    today: PantrixDate = rememberToday(),
    format: DateFieldFormat = DateFieldFormat.of(PantrixTheme.locale),
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir gün için dolu bir metin alanı: gün rakamlarla yazılır ya da kutunun sonundaki bir düğmenin açtığı takvimden seçilir. Dolu bir kutudaki `PantrixDateTextField`'tır.

`PantrixFilledTextField` gibi çizilir: etiket kutunun içindedir, alan boş ve odaksızken yazının yerinde durur, etiket yukarı çıkınca düzen görünür. Yalnız rakam alır: günün her parçası tamamlanınca `format`'ın ayracı kendiliğinden gelir; Türkçede `18102026` `18.10.2026`, Amerikan İngilizcesinde `10182026` `10/18/2026` görünür. Telefon rakam klavyesini gösterir. Kutu boşken düzeni gösterir, Türkçede `GG.AA.YYYY`, Amerikan İngilizcesinde `MM/DD/YYYY`; ekran okuyucuya bu parçaların sırası olarak söylenir. Yazılmış olarak yapıştırılan bir gün yazıldığı gibi okunur, önce `format`'ın sırasıyla, olmazsa ISO 8601'deki gibi yılı başta: Türkçede yapıştırılan `2026-10-18` `18.10.2026` görünür; iki haneli bir yıl, `today`'in çevresindeki yüz yılın o iki haneyle biten yılıdır.

`onValueChange` alanın tuttuğu gün her değiştiğinde ona söylenir: yazılan ya da seçilen, takvimin aldığı tam bir gün; alan boşken, yarım yazılmışken ya da gün olmayan rakamlar veya almadığı bir gün tutarken null. Alan yazılanı kendisi tutar, bu yüzden `value` null iken yarım yazılmış bir gün ekranda kalır. Alanınkinden başka bir gün olan `value` alana yazılır, null bir `value` bir gün tutan alanı boşaltır.

Alan yanlış yazılanı kutunun altına kendisi yazar: kullanıcı alandan çıkınca tam bir gün yapmayan rakamlar; takvimde olmayan bir gün, 31 Şubat; `minDate`'ten önce ya da `maxDate`'ten sonra bir gün; ve `isDateEnabled`'ın geri çevirdiği bir gün. Çağıranın `error`'u önce gelir, mesajı `supportingText`'idir.

Takvim düğmesiyle, Alt ve ↓ ile, `readOnly` bir alanda da kutuya basınca, Enter ya da Boşluk ile açılır: salt okunur bir alan günü yalnız takvimden alır. `presentation`'ın söylediğinde açılır; her platformda aynı. İçinde basılan bir gün hemen alanındır ve takvimi kapatır; Escape ve dışarı basmak onu kapatır ve hiçbir şeyi değiştirmez. Klavyeyle açılınca odak seçili güne, ya da bugüne gider; kapanınca alana döner.

Parametreler:

- `value: PantrixDate?`: alanın gösterdiği gün, ya da null.
- `onValueChange: (PantrixDate?) -> Unit`: kullanıcı her değiştirdiğinde alanın günü söylenir: bir gün, ya da yoksa null.
- `modifier: Modifier`: bütün alanın modifier'ı: etiketi, kutusu ve altındakiler.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı. Kullanılamayan alan odak almaz ve takvim açmaz.
- `readOnly: Boolean`: günün yalnız takvimden seçilip yazılamayacağı.
- `label: String?`: alanın ne için olduğu, kutunun içinde: alanın ve takviminin ekran okuyucudaki adı.
- `placeholder: String?`: kutu boşken, alanın kendisinin gösterdiği düzenin yerinde gösterilir.
- `supportingText: String?`: kutunun altındaki yardım. `error` ile neyin düzeltileceğini söyleyen mesajdır; onsuz, alanın kendi hatası varken onun yerini alır.
- `error: Boolean`: çağıranın günü yanlış bulup bulmadığı, dolu bir gün gibi: alan hatalı çizilir ve mesaj `supportingText`'tir.
- `leadingIcon: (@Composable () -> Unit)?`: metnin önünde duran. Bir yuva içine konanı boyutlandırmaz.
- `showClearButton: Boolean`: alan yazılabilirken ve boş değilken onu boşaltan bir düğme gösterir.
- `minDate: PantrixDate?`: alanın aldığı ilk gün, ya da ilki yoksa null. `maxDate`'ten sonra değil.
- `maxDate: PantrixDate?`: alanın aldığı son gün, ya da sonu yoksa null.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: alanın ikisi arasındaki bir günü alıp almadığı, ya da her gün için null: hafta içi bir gün, henüz dolmamış bir gün.
- `firstDayOfWeek: Int?`: takvimin haftalarının başladığı gün, ISO 8601'in numaraladığı gibi Pazartesi 1'den Pazar 7'ye, ya da dilinki için null.
- `today: PantrixDate`: takvimin bugün diye işaretlediği gün: varsayılan, ekranın saatinin gösterdiği gün (`rememberToday`), gece yarısı döner.
- `format: DateFieldFormat`: parçaların yazıldığı sıra ve aralarındaki ayraç: varsayılan temanın dilininki ve bölgesininki. `of`: Bu tonun çizildiği temanın rolü.
- `presentation: DatePickerPresentation`: takvimin neyde açıldığı: varsayılan dar bir pencerede bir sheet, daha geniş pencerede kutunun altında bir popover, açılırken seçilir; ya da her zaman bir popover, bir sheet ya da bir dialog.
- `style: FilledTextFieldStyle?`: bu çağrının alanın kendi stili: çevreleyen her birinin üstünde ve yoğunluğun altında.
- `colors: FilledTextFieldColors?`: bu çağrının alanın kendi renkleri, temanın rollerinin yerine.
- `pickerStyle: DatePickerStyle?`: bu çağrının takvimin kendi stili.
- `pickerColors: DatePickerColors?`: bu çağrının takvimin kendi renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: alanın otomasyon anahtarı: alan `DateFilledTextField_<tagKey>`, düğmesi `DateFilledTextFieldCalendar_<tagKey>`, temizleme düğmesi `DateFilledTextFieldClear_<tagKey>` ve takvimi `DatePicker_<tagKey>`'tir. Alan takvimin açıldığını ve içinde bir gün seçildiğini bildirir, günü asla.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış: odağı, üstündeki işaretçi ve basışları.

### PantrixDateFilledTextField

`import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDateFilledTextField(
    state: DateTextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    today: PantrixDate = rememberToday(),
    format: DateFieldFormat = DateFieldFormat.of(PantrixTheme.locale),
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Çağıranın tuttuğu bir `state` üstünde bir tarih alanı, başka her yönden bir değerin `PantrixDateFilledTextField`'ı gibi: durumun `date`'i alanın günüdür, ona yazmak günü alana koyar, `text`'i yarım yazılmış alanı boş alandan ayırır.

Parametreler:

- `state: DateTextFieldState`: yazılan rakamlar ve yaptıkları gün. `rememberDateTextFieldState()` ile kurulur.
- `modifier: Modifier`: bütün alanın modifier'ı: etiketi, kutusu ve altındakiler.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı. Kullanılamayan alan odak almaz ve takvim açmaz.
- `readOnly: Boolean`: günün yalnız takvimden seçilip yazılamayacağı.
- `label: String?`: alanın ne için olduğu, kutunun içinde: alanın ve takviminin ekran okuyucudaki adı.
- `placeholder: String?`: kutu boşken, alanın kendisinin gösterdiği düzenin yerinde gösterilir.
- `supportingText: String?`: kutunun altındaki yardım. `error` ile mesajdır; onsuz, alanın kendi hatası varken onun yerini alır.
- `error: Boolean`: çağıranın günü yanlış bulup bulmadığı: alan hatalı çizilir ve mesaj `supportingText`'tir.
- `leadingIcon: (@Composable () -> Unit)?`: metnin önünde duran.
- `showClearButton: Boolean`: alan yazılabilirken ve boş değilken onu boşaltan bir düğme gösterir.
- `minDate: PantrixDate?`: alanın aldığı ilk gün, ya da ilki yoksa null. `maxDate`'ten sonra değil.
- `maxDate: PantrixDate?`: alanın aldığı son gün, ya da sonu yoksa null.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: alanın ikisi arasındaki bir günü alıp almadığı, ya da her gün için null.
- `firstDayOfWeek: Int?`: takvimin haftalarının başladığı gün, Pazartesi 1'den Pazar 7'ye, ya da dilinki için null.
- `today: PantrixDate`: takvimin bugün diye işaretlediği gün: varsayılan, ekranın saatinin gösterdiği gün (`rememberToday`).
- `format: DateFieldFormat`: parçaların yazıldığı sıra ve aralarındaki ayraç: varsayılan temanın yerelininki. `of`: Bu tonun çizildiği temanın rolü.
- `presentation: DatePickerPresentation`: takvimin neyde açıldığı: varsayılan dar bir pencerede bir sheet, daha geniş pencerede kutunun altında bir popover, açılırken seçilir; ya da her zaman bir popover, bir sheet ya da bir dialog.
- `style: FilledTextFieldStyle?`: bu çağrının alanın kendi stili.
- `colors: FilledTextFieldColors?`: bu çağrının alanın kendi renkleri.
- `pickerStyle: DatePickerStyle?`: bu çağrının takvimin kendi stili.
- `pickerColors: DatePickerColors?`: bu çağrının takvimin kendi renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: alanın otomasyon anahtarı, bir değerin `PantrixDateFilledTextField`'ının aldığı gibi.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış.

### PantrixDateFilledTextField

`import com.pantrixui.components.date.datefilledtextfield.PantrixDateFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDateFilledTextField(
    field: FormField<PantrixDate?>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    today: PantrixDate = rememberToday(),
    format: DateFieldFormat = DateFieldFormat.of(PantrixTheme.locale),
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı bir tarih alanı: günü, hatası ve adı `field`'dan gelir.

Alanın değeri tarih alanının tuttuğu gündür, hiçbir gün tutmazken null; değerde kodla yapılan bir değişiklik, bir sıfırlama da, alana yazılır. Kullanıcı alandan çıkınca, takvime geçmek çıkmak sayılmadan, alan dokunulmuş sayılır ve denetlenir. Hatalıyken mesajı `supportingText`'in ve tarih alanının kendi hatasının yerini alır. Gün yapmayan rakamlar değeri null bırakır: bir günün zorunlu olduğu yerde alana null için bir kural verin; mesajı kullanıcı çıkınca gösterilir. Alanın id'si otomasyon anahtarıdır, `DateFilledTextField_<id>`, ve form odağı buraya gönderebilir.

Parametreler:

- `field: FormField<PantrixDate?>`: tarih alanının gösterdiği ve değiştirdiği, formun alanı.
- `modifier: Modifier`: bütün alanın modifier'ı.
- `form: FormState?`: verilirse klavyenin eylem tuşu formu ona kayıtlı düğme üzerinden gönderir.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı.
- `readOnly: Boolean`: günün yalnız takvimden seçilip seçilemeyeceği.
- `label: String?`: alanın ne için olduğu, kutunun içinde.
- `placeholder: String?`: kutu boşken, düzenin yerinde gösterilir.
- `supportingText: String?`: kutunun altındaki yardım, alanın orada gösterecek bir hatası yokken.
- `leadingIcon: (@Composable () -> Unit)?`: metnin önünde duran.
- `showClearButton: Boolean`: alan yazılabilirken ve boş değilken onu boşaltan bir düğme gösterir.
- `minDate: PantrixDate?`: alanın aldığı ilk gün, ya da ilki yoksa null. `maxDate`'ten sonra değil.
- `maxDate: PantrixDate?`: alanın aldığı son gün, ya da sonu yoksa null.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: alanın ikisi arasındaki bir günü alıp almadığı, ya da her gün için null.
- `firstDayOfWeek: Int?`: takvimin haftalarının başladığı gün, Pazartesi 1'den Pazar 7'ye, ya da dilinki için null.
- `today: PantrixDate`: takvimin bugün diye işaretlediği gün: varsayılan, ekranın saatinin gösterdiği gün (`rememberToday`).
- `format: DateFieldFormat`: parçaların yazıldığı sıra ve aralarındaki ayraç: varsayılan temanın yerelininki. `of`: Bu tonun çizildiği temanın rolü.
- `presentation: DatePickerPresentation`: takvimin neyde açıldığı: varsayılan dar bir pencerede bir sheet, daha geniş pencerede kutunun altında bir popover, açılırken seçilir; ya da her zaman bir popover, bir sheet ya da bir dialog.
- `style: FilledTextFieldStyle?`: bu çağrının alanın kendi stili.
- `colors: FilledTextFieldColors?`: bu çağrının alanın kendi renkleri.
- `pickerStyle: DatePickerStyle?`: bu çağrının takvimin kendi stili.
- `pickerColors: DatePickerColors?`: bu çağrının takvimin kendi renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış.

### DateTextFieldState

`import com.pantrixui.components.date.common.DateTextFieldState`, `com.pantrixui:components` içinden

```kotlin
class DateTextFieldState(initial: PantrixDate? = null)
```

Bir tarih alanının tuttuğu, onu kendisi tutan bir çağıran için: alana o ana dek yazılan rakamlar ve onların yaptığı gün.

`date` alanın aldığı gündür: alan boşken, yazılan tam bir gün değilken, takvimde olmayan bir günü ya da alanın almadığı bir günü yazarken null. Ona yazmak günü alana koyar, alan onu biçiminin yazdığı gibi gösterir; null yazmak alanı boşaltır. O an hiçbir alanın çizmediği bir durum günü tutar, alan çizilince onu yazar.

`rememberDateTextFieldState` ile kurulur; o, durumu bir yapılandırma değişikliğinde ve geri getirilen bir süreçte de korur.

Parametreler:

- `initial: PantrixDate?`: alanın başladığı gün, ya da boş bir alan için null.

Üyeleri:

- `date: PantrixDate?`: Alanın aldığı gün, ya da null: sınıfa bakın.
- `text: CharSequence`: O ana dek yazılan rakamlar, alanın parçalar arasında gösterdiği ayraçlar olmadan: `18.10.` için `1810`. İkisinde de `date` null iken yarım yazılmış alanı boş alandan ayırır.
- `fun clear()`: Alanı boşaltır: ne rakam kalır ne gün.

Tipin kendisinde:

- `DateTextFieldState.Saver: Saver<DateTextFieldState, Any>`: `rememberDateTextFieldState`'in bir durumu koruduğu saver.

### DateFieldFormat

`import com.pantrixui.components.date.common.DateFieldFormat`, `com.pantrixui:components` içinden

```kotlin
data class DateFieldFormat(
    public val order: DateFieldOrder,
    public val separator: Char
)
```

Bir tarih alanının bir günü nasıl aldığı: parçalarının sırası ve aralarında duran ayraç. Sıra ne olursa olsun gün ve ay ikişer, yıl dört rakamdır; tam bir gün sekiz rakamdır.

Yalnız rakamlar yazılır: alan her parça dolunca ayracı kendisi koyar, ayraçtan sonra Backspace önündeki rakamı siler. Sıra alanın ayarıdır, bir söz değildir, bu yüzden strings paketinin parçası değildir: paketin alana verdiği, düzeninin yazıldığı harflerdir, "GG", "AA" ve "YYYY".

Parametreler:

- `order: DateFieldOrder`: parçaların yazıldığı ve gösterildiği sıra.
- `separator: Char`: ekranda parçaların arasında duran: bir işaret, asla bir harf, bir rakam ya da bir boşluk değil.

Tipin kendisinde:

- `DateFieldFormat.DayMonthYearDots: DateFieldFormat`: `18.10.2026`: Türkçe, Almanca, Rusça, Lehçe ve İsveççe dışındaki İskandinav dilleri.
- `DateFieldFormat.DayMonthYearSlashes: DateFieldFormat`: `18/10/2026`: İngiltere İngilizcesi, Fransızca, İspanyolca, İtalyanca, Portekizce, Yunanca ve Arapça.
- `DateFieldFormat.MonthDayYearSlashes: DateFieldFormat`: `10/18/2026`: Amerikan İngilizcesi.
- `DateFieldFormat.Iso: DateFieldFormat`: `2026-10-18`: ISO 8601, ve İsveççe ile Litvanca.
- `DateFieldFormat.of(locale: PantrixLocale): DateFieldFormat`: `locale`'ın dilinin bir günü rakamlarla yazdığı biçim, İngilizcede de bölgesininki: ABD ve bölgesiz bir İngilizce ayı önce yazar, Kanada ISO 8601 yazar, İngilizce konuşan dünyanın geri kalanı günü önce. Pantrix'in sırasını bilmediği bir dile ISO 8601 verilir; o her yerde aynı okunur.

### DatePickerPresentation

`import com.pantrixui.components.date.common.DatePickerPresentation`, `com.pantrixui:components` içinden

```kotlin
enum class DatePickerPresentation
```

Bir tarih denetiminin gösterdiğini, bir alanın takvimini ya da bir elastic date picker'ın panellerini neyde açtığı: her platformda aynı. Bir sheet ve bir dialog bir scrim'in üstünde durur ve hiçbirinin tuttuğunun üstünde başlık yoktur.

Değerleri:

- `Popover`: Basılan parçanın yanında bir popover: bir alanın kutusunun altında ya da elastic tarih seçicinin bir parçasının yanında.
- `Sheet`: Pencerenin kenarından gelen bir sheet; tuttuğunun üstünde başlık yoktur.
- `Dialog`: Pencerenin ortasında, bir scrim'in üstünde, tuttuğu kadar geniş bir dialog; üstünde başlık yoktur.
- `Adaptive`: Dar bir pencerede, `Compact` genişlik sınıfında, telefonda başparmağın erişebildiği bir sheet; her daha geniş pencerede bir popover. Pencere, denetimin katmanının üstünde gösterildiği penceredir ve seçici açılırken sorulur: açık olan, pencere değişince olduğu gibi kalır.
