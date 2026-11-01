# Date Text Field

Bir gün için metin alanı: gün rakamlarla yazılır ya da kutunun sonundaki düğmenin açtığı takvimden seçilir. Etiket kutunun üstünde durur; alan bir `PantrixTextField` gibi çizilir.

- `PantrixDateTextField` (`com.pantrixui.components.date.datetextfield`, `com.pantrixui:components`): Bir gün için yazı alanı: dilin sırasında rakamlarla yazılır ya da düğmesinin açtığı takvimden seçilir; almadığı bir gün için kendi hataları vardır. Anahtar sözcükler: tarih alanı, doğum tarihi, tarih girişi, maskeli tarih, takvimli alan.

## Özellikler

- **Yalnız rakam.** Alan yalnız rakam alır; her parça tamamlanınca ayraç kendiliğinden gelir: Türkçede `18102026` `18.10.2026` olur, Amerikan İngilizcesinde `10182026` `10/18/2026`. Telefonda rakam klavyesi açılır. Ayraçtan sonra Backspace önündeki rakamı siler.
- **Yapıştırılan gün.** Yazılmış bir gün yazıldığı gibi okunur: önce alanın sırasıyla, olmazsa yılı başta, ISO 8601 gibi. Türkçede `2026-10-18` de `18.10.2026` olur; iki haneli bir yıl bugünün çevresindeki yüz yıldandır (`18.10.26`, 2026). Böyle okunmayan bir metin rakamlarıyla girer.
- **Biçim.** `format` parçaların sırasını ve aralarındaki ayracı verir; varsayılanı temanın dilinden ve bölgesinden gelir: Türkçe ve Almanca `GG.AA.YYYY`, İngiltere ve Arapça `DD/MM/YYYY`, ABD `MM/DD/YYYY`, bilinmeyen bir dil ISO 8601 (`YYYY-MM-DD`). Alan boşken düzeni gösterir; ekran okuyucu onu parçaların sırası olarak duyar ("Gün, Ay, Yıl").
- **Değer.** `onValueChange` alanın günü her değiştiğinde çağrılır: takvimin aldığı tam bir gün, ya da alan boş, yarım, gün olmayan rakamlar ya da almadığı bir gün tuttuğunda null. Yarım yazılan gün `value` null iken ekranda kalır; dışarıdan gelen başka bir gün alana yazılır.
- **Kendi hatası.** Alan yanlış yazılanı kutunun altına kendisi yazar: alandan çıkınca tamamlanmamış bir tarih, takvimde olmayan bir gün (31 Şubat), `minDate` ile `maxDate` dışında bir gün, `isDateEnabled`'ın almadığı bir gün. Uygulamanın `error`'u önce gelir; mesajı `supportingText`'tir.
- **Takvim.** Düğmeyle, masaüstünde ve web'de Alt+↓ ile, salt okunur alanda kutuya basınca, Enter ya da Boşluk ile açılır. `presentation` neyde açılacağını söyler: varsayılan dar bir pencerede bir sheet, daha geniş pencerede kutunun altında bir popover; ya da her pencerede bir popover, bir sheet ya da bir dialog; her platformda aynı. Takvimde bir güne basmak günü alır ve takvimi kapatır; Escape ve dışarı basmak bir şey değiştirmeden kapatır. Klavyeyle açılınca odak seçili güne, yoksa bugüne geçer; kapanınca alana döner.
- **Üç biçim.** `value` ve `onValueChange` alan biçim; `state` alan biçim (`rememberDateTextFieldState()`): `date` alanın günüdür, yazmak günü alana koyar, `text` yarım yazılmış alanı boş alandan ayırır; `field` alan biçim bir formun alanına bağlanır.
- **Tarih türü.** Günler `PantrixDate`'tir; `kotlinx-datetime`'a ya da `java.time`'a çevirmek için docs/guide/date-time/DATE_TIME_GUIDE.md.

## Kullanım

### A birthday, typed

```kotlin
var birthday by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDateTextField(
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
PantrixDateTextField(
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
PantrixDateTextField(
    state = start,
    label = stringResource(Res.string.start_date),
    format = DateFieldFormat.Iso,
    tagKey = "start"
)
val shown = start.date?.toString() ?: if (start.text.isEmpty()) "–" else "…"
```

## Örnekler

### Doğum günü, yazarak

Bir doğum günü, yazarak: bugünden sonrası alınmaz. Takvim de açılır, ama uzak bir yıla yazmak daha çabuktur. Gün tamamlanınca altta yazılır; yarım bırakıp alandan çıkınca alan düzeni söyleyen hatasını gösterir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme

var birthday by remember { mutableStateOf<PantrixDate?>(null) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixDateTextField(
        value = birthday,
        onValueChange = { birthday = it },
        label = "Doğum günü",
        maxDate = rememberToday(),
        showClearButton = true,
        tagKey = "birthday"
    )
    PantrixText(
        text = birthday?.let { "Doğum günü: ${strings.date(it.day, it.month, it.year)}" } ?: "Henüz bir gün yok",
        style = PantrixTheme.typography.body
    )
}
```

### Hafta içi bir teslim günü

Önümüzdeki bir ay içinde, hafta içi bir teslim günü. Takvimde hafta sonları soluktur. Yazılan bir cumartesi alınmaz ve alan "Bu gün seçilemez" der; bir ay sonrası sınırı söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday

var delivery by remember { mutableStateOf<PantrixDate?>(null) }
val today = rememberToday()
PantrixDateTextField(
    value = delivery,
    onValueChange = { delivery = it },
    label = "Teslim günü",
    supportingText = "Yalnız hafta içi teslim edilir",
    minDate = today.plusDays(1),
    maxDate = today.plusMonths(1),
    isDateEnabled = { it.dayOfWeek <= FRIDAY },
    tagKey = "delivery"
)

private const val FRIDAY = 5
```

### Takvim bir sheet'te ya da dialog'da

Takvim bir sheet'te açılır: telefonda parmağa yakın, ekranın genişliğinde. `presentation = Dialog` onu pencerenin ortasında bir dialog'da açar. Bir gün seçilince sheet kapanır ve gün alana yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.DatePickerPresentation
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme

var appointment by remember { mutableStateOf<PantrixDate?>(null) }
var presentation by remember { mutableStateOf(DatePickerPresentation.Sheet) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(DatePickerPresentation.Popover, "Popover", tagKey = "popover"),
            SegmentOption(DatePickerPresentation.Sheet, "Sheet", tagKey = "sheet"),
            SegmentOption(DatePickerPresentation.Dialog, "Dialog", tagKey = "dialog")
        ),
        selected = presentation,
        onSelect = { presentation = it },
        fullWidth = false,
        tagKey = "presentation"
    )
    PantrixDateTextField(
        value = appointment,
        onValueChange = { appointment = it },
        label = "Randevu günü",
        minDate = rememberToday(),
        presentation = presentation,
        tagKey = "appointment"
    )
}
```

### Uygulamanın hatası ve devre dışı

Uygulamanın kendi hatası alanınkinden önce gelir: dolu bir gün `error` ve `supportingText` ile söylenir. Altındaki alan devre dışıdır: odak almaz, takvimi açılmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.foundation.date.PantrixDate

var meeting by remember { mutableStateOf<PantrixDate?>(PantrixDate(2026, 11, 2)) }
val taken = meeting == PantrixDate(2026, 11, 2)
PantrixDateTextField(
    value = meeting,
    onValueChange = { meeting = it },
    label = "Toplantı günü",
    supportingText = if (taken) "Bu gün dolu, başka bir gün seçin" else "Ofisin açık olduğu bir gün",
    error = taken,
    tagKey = "meeting"
)
PantrixDateTextField(
    value = PantrixDate(2026, 10, 1),
    onValueChange = {},
    enabled = false,
    label = "Sözleşme başlangıcı",
    tagKey = "contract"
)
```

### Salt okunur: yalnız takvimden

Salt okunur bir alan yazılmaz: gün yalnız takvimden seçilir. Kutuya basmak, Enter ya da Boşluk takvimi açar. Bir gün seçimi zorunlu olan, yazılanın yanlış anlaşılmaması gereken yerler için.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday

var checkIn by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDateTextField(
    value = checkIn,
    onValueChange = { checkIn = it },
    readOnly = true,
    label = "Giriş günü",
    placeholder = "Takvimden seçin",
    minDate = rememberToday(),
    tagKey = "check_in"
)
```

### Forma bağlı

Bir formun alanına bağlı: gün boşken "Kaydet" hatayı gösterir ve odağı alana gönderir. Hata alandan çıkınca da görünür; takvime geçmek alandan çıkmak sayılmaz. Gün olmayan rakamlar değeri null bırakır, kural onu yakalar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
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
PantrixDateTextField(
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

### Bir durumla, ISO 8601 biçiminde

Bir durumla: `state.date` alanın günü, `state.text` yazılan rakamlar. İkisi birlikte boş alanı yarım yazılmış alandan ayırır. ISO 8601 biçimi her dilde aynı okunur. Düğme durumun gününü değiştirir; alan onu kendisi yazar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.DateFieldFormat
import com.pantrixui.components.date.common.rememberDateTextFieldState
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberDateTextFieldState()
val today = rememberToday()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixDateTextField(
        state = state,
        label = "Rapor günü",
        format = DateFieldFormat.Iso,
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

### Kendi biçimin

Alanın biçimi temanın dilinden gelir; `format` başkasını söyler. Dillerin çoğunun biçimi `DateFieldFormat`'ta hazırdır (`DayMonthYearDots`, `MonthDayYearSlashes`, `Iso`, …); kendi biçimin parçaların sırası (`DateFieldOrder`) ve bir ayraçtır: ilki Japoncadaki gibi yıl başta, eğik çizgiyle. Biçimi değiştir: alanın günü aynı kalır, yalnızca yazılışı değişir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.common.DateFieldFormat
import com.pantrixui.components.date.common.DateFieldOrder
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.theme.PantrixTheme

var shipping by remember { mutableStateOf<PantrixDate?>(PantrixDate(2026, 10, 18)) }
var format by remember { mutableStateOf(DateFieldFormat(DateFieldOrder.YearMonthDay, '/')) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(DateFieldFormat(DateFieldOrder.YearMonthDay, '/'), "YYYY/AA/GG", tagKey = "year_first"),
            SegmentOption(DateFieldFormat.MonthDayYearSlashes, "AA/GG/YYYY", tagKey = "month_first"),
            SegmentOption(DateFieldFormat(DateFieldOrder.DayMonthYear, '-'), "GG-AA-YYYY", tagKey = "day_first")
        ),
        selected = format,
        onSelect = { format = it },
        fullWidth = false,
        tagKey = "format"
    )
    PantrixDateTextField(
        value = shipping,
        onValueChange = { shipping = it },
        label = "Gönderim günü",
        format = format,
        tagKey = "shipping"
    )
}
```

### Dar pencerede sheet

Varsayılan `presentation = DatePickerPresentation.Adaptive`: dar bir pencerede takvim alttan bir sheet'te açılır, parmağa yakın ve pencerenin genişliğinde; daha geniş pencerede kutunun altında bir popover'da. Karttaki pencere seçicisinden "Dar"ı seç ve takvimi aç. Takvim açılırken seçilir: açıkken pencere değişse de değişmez.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.common.DatePickerPresentation
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday

var day by remember { mutableStateOf<PantrixDate?>(null) }
// Kartın penceresi örnek kadar uzundur: dar bir pencerede açılan sheet'e yer kalsın diye örnek uzun tutulur.
Column(Modifier.fillMaxWidth().height(460.dp)) {
    PantrixDateTextField(
        value = day,
        onValueChange = { day = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Toplantı günü",
        minDate = rememberToday(),
        presentation = DatePickerPresentation.Adaptive,
        tagKey = "adaptive_day"
    )
}
```

## API

### PantrixDateTextField

`import com.pantrixui.components.date.datetextfield.PantrixDateTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDateTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir gün için metin alanı: gün rakamlarla yazılır ya da kutunun sonundaki bir düğmenin açtığı takvimden seçilir.

`PantrixTextField` gibi çizilir, etiket kutunun üstündedir, ve yalnız rakam alır: günün her parçası tamamlanınca `format`'ın ayracı kendiliğinden gelir; Türkçede `18102026` `18.10.2026`, Amerikan İngilizcesinde `10182026` `10/18/2026` görünür. Telefon rakam klavyesini gösterir. Kutu boşken düzeni gösterir, Türkçede `GG.AA.YYYY`, Amerikan İngilizcesinde `MM/DD/YYYY`; ekran okuyucuya bu parçaların sırası olarak söylenir. Yazılmış olarak yapıştırılan bir gün yazıldığı gibi okunur, önce `format`'ın sırasıyla, olmazsa ISO 8601'deki gibi yılı başta: Türkçede yapıştırılan `2026-10-18` `18.10.2026` görünür; iki haneli bir yıl, `today`'in çevresindeki yüz yılın o iki haneyle biten yılıdır.

`onValueChange` alanın tuttuğu gün her değiştiğinde ona söylenir: yazılan ya da seçilen, takvimin aldığı tam bir gün; alan boşken, yarım yazılmışken ya da gün olmayan rakamlar veya almadığı bir gün tutarken null. Alan yazılanı kendisi tutar, bu yüzden `value` null iken yarım yazılmış bir gün ekranda kalır. Alanınkinden başka bir gün olan `value` alana yazılır, null bir `value` bir gün tutan alanı boşaltır.

Alan yanlış yazılanı kutunun altına kendisi yazar: kullanıcı alandan çıkınca tam bir gün yapmayan rakamlar; takvimde olmayan bir gün, 31 Şubat; `minDate`'ten önce ya da `maxDate`'ten sonra bir gün; ve `isDateEnabled`'ın geri çevirdiği bir gün. Çağıranın `error`'u önce gelir, mesajı `supportingText`'idir.

Takvim düğmesiyle, Alt ve ↓ ile, `readOnly` bir alanda da kutuya basınca, Enter ya da Boşluk ile açılır: salt okunur bir alan günü yalnız takvimden alır. `presentation`'ın söylediğinde açılır; her platformda aynı. İçinde basılan bir gün hemen alanındır ve takvimi kapatır; Escape ve dışarı basmak onu kapatır ve hiçbir şeyi değiştirmez. Klavyeyle açılınca odak seçili güne, ya da bugüne gider; kapanınca alana döner.

Parametreler:

- `value: PantrixDate?`: alanın gösterdiği gün, ya da null.
- `onValueChange: (PantrixDate?) -> Unit`: kullanıcı her değiştirdiğinde alanın günü söylenir: bir gün, ya da yoksa null.
- `modifier: Modifier`: bütün alanın modifier'ı: etiketi, kutusu ve altındakiler.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı. Kullanılamayan alan odak almaz ve takvim açmaz.
- `readOnly: Boolean`: günün yalnız takvimden seçilip yazılamayacağı.
- `label: String?`: alanın ne için olduğu, kutunun üstünde yazılı: alanın ve takviminin ekran okuyucudaki adı.
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
- `style: TextFieldStyle?`: bu çağrının alanın kendi stili: çevreleyen her birinin üstünde ve yoğunluğun altında.
- `colors: TextFieldColors?`: bu çağrının alanın kendi renkleri, temanın rollerinin yerine.
- `pickerStyle: DatePickerStyle?`: bu çağrının takvimin kendi stili.
- `pickerColors: DatePickerColors?`: bu çağrının takvimin kendi renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: alanın otomasyon anahtarı: alan `DateTextField_<tagKey>`, düğmesi `DateTextFieldCalendar_<tagKey>`, temizleme düğmesi `DateTextFieldClear_<tagKey>` ve takvimi `DatePicker_<tagKey>`'tir. Alan takvimin açıldığını ve içinde bir gün seçildiğini bildirir, günü asla.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış: odağı, üstündeki işaretçi ve basışları.

### PantrixDateTextField

`import com.pantrixui.components.date.datetextfield.PantrixDateTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDateTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Çağıranın tuttuğu bir `state` üstünde bir tarih alanı, başka her yönden bir değerin `PantrixDateTextField`'ı gibi: durumun `date`'i alanın günüdür, ona yazmak günü alana koyar, `text`'i yarım yazılmış alanı boş alandan ayırır.

Parametreler:

- `state: DateTextFieldState`: yazılan rakamlar ve yaptıkları gün. `rememberDateTextFieldState()` ile kurulur.
- `modifier: Modifier`: bütün alanın modifier'ı: etiketi, kutusu ve altındakiler.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı. Kullanılamayan alan odak almaz ve takvim açmaz.
- `readOnly: Boolean`: günün yalnız takvimden seçilip yazılamayacağı.
- `label: String?`: alanın ne için olduğu, kutunun üstünde yazılı: alanın ve takviminin ekran okuyucudaki adı.
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
- `style: TextFieldStyle?`: bu çağrının alanın kendi stili.
- `colors: TextFieldColors?`: bu çağrının alanın kendi renkleri.
- `pickerStyle: DatePickerStyle?`: bu çağrının takvimin kendi stili.
- `pickerColors: DatePickerColors?`: bu çağrının takvimin kendi renkleri.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: alanın otomasyon anahtarı, bir değerin `PantrixDateTextField`'ının aldığı gibi.
- `interactionSource: MutableInteractionSource?`: alanın etkileşimleri, dışarı taşınmış.

### PantrixDateTextField

`import com.pantrixui.components.date.datetextfield.PantrixDateTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDateTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    pickerStyle: DatePickerStyle? = null,
    pickerColors: DatePickerColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı bir tarih alanı: günü, hatası ve adı `field`'dan gelir.

Alanın değeri tarih alanının tuttuğu gündür, hiçbir gün tutmazken null; değerde kodla yapılan bir değişiklik, bir sıfırlama da, alana yazılır. Kullanıcı alandan çıkınca, takvime geçmek çıkmak sayılmadan, alan dokunulmuş sayılır ve denetlenir. Hatalıyken mesajı `supportingText`'in ve tarih alanının kendi hatasının yerini alır. Gün yapmayan rakamlar değeri null bırakır: bir günün zorunlu olduğu yerde alana null için bir kural verin; mesajı kullanıcı çıkınca gösterilir. Alanın id'si otomasyon anahtarıdır, `DateTextField_<id>`, ve form odağı buraya gönderebilir.

Parametreler:

- `field: FormField<PantrixDate?>`: tarih alanının gösterdiği ve değiştirdiği, formun alanı.
- `modifier: Modifier`: bütün alanın modifier'ı.
- `form: FormState?`: verilirse klavyenin eylem tuşu formu ona kayıtlı düğme üzerinden gönderir.
- `enabled: Boolean`: alanın kullanılıp kullanılamayacağı.
- `readOnly: Boolean`: günün yalnız takvimden seçilip seçilemeyeceği.
- `label: String?`: alanın ne için olduğu, kutunun üstünde yazılı.
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
- `style: TextFieldStyle?`: bu çağrının alanın kendi stili.
- `colors: TextFieldColors?`: bu çağrının alanın kendi renkleri.
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

### rememberDateTextFieldState

`import com.pantrixui.components.date.common.rememberDateTextFieldState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberDateTextFieldState(initial: PantrixDate? = null): DateTextFieldState
```

Ekran kadar yaşayan bir `DateTextFieldState`; bir yapılandırma değişikliği ve geri getirilen bir süreç de dahil.

Parametreler:

- `initial: PantrixDate?`: alanın başladığı gün, ya da boş bir alan için null. Bir kez, durum kurulurken okunur.

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

### DateFieldOrder

`import com.pantrixui.components.date.common.DateFieldOrder`, `com.pantrixui:components` içinden

```kotlin
enum class DateFieldOrder
```

Bir tarih alanının bir günün parçalarını aldığı sıra.

Değerleri:

- `DayMonthYear`: Gün, ay, sonra yıl: `18.10.2026`.
- `MonthDayYear`: Ay, gün, sonra yıl: `10/18/2026`.
- `YearMonthDay`: Yıl, ay, sonra gün: `2026-10-18`, ISO 8601'in bir günü yazdığı gibi.

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
