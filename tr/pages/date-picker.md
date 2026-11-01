# Date Picker

Ay ay gezilen bir takvimden bir gün ya da bir aralık seçmek. Takvim seçimin kendisidir: sayfada durur ya da bir popover'ın, bir dialog'un, bir sheet'in içine konur. Seçimi tutmaz; seçilen gün `onSelect`'e gelir.

- `PantrixDatePicker` (`com.pantrixui.components.date.datepicker`, `com.pantrixui:components`): Bir günün ya da bir gün aralığının seçildiği, ay ay ilerleyen bir takvim; seçilemeyen günler soluk çizilir, uzağa gitmek için bir yıl ızgarası vardır. Anahtar sözcükler: takvim, tarih seçici, tarih aralığı, ay görünümü, gün seçici.

## Özellikler

- **Gezinme.** Oklar ayı çevirir; başlığa basınca günlerin yerine yıllar açılır, bir yıl seçilince takvim o yılın aynı ayına döner. Seçilen gün ekranda değilse takvim onun ayına gider.
- **Seçilemeyen günler.** `minDate` ve `maxDate` dışındaki günler ve `isDateEnabled`'ın almadığı günler soluk çizilir ve basılamaz; oklar sınırın ötesine geçmez.
- **Aralık.** İlk basış aralığın başını, ikincisi sonunu seçer; baştan önceki bir güne basmak aralığı oradan yeniden başlatır. Uç seçilirken işaretçinin altındaki güne kadar ara açık renkle önizlenir.
- **Klavye.** Takvim tek bir Tab durağıdır. Oklar bir gün ya da bir hafta, Page Up ve Page Down bir ay, Shift ile bir yıl, Home ve End haftanın ilk ve son günü götürür; Enter ve Boşluk seçer.
- **Ekran okuyucu.** Her gün haftanın günüyle tam okunur ("17 Ekim 2026 Cumartesi"); seçili, bugün, aralığın başı, arası ve sonu söylenir. Ay değişince yeni ay kibarca duyurulur.
- **Hafta.** Dilin gününden başlar: İngilizcede Pazar, Türkçede Pazartesi, Arapçada Cumartesi; `firstDayOfWeek` ile değişir.
- **Bugün.** Halkalı gün ekranın saatinin bugünüdür ve gece yarısı kendiliğinden döner. Ekranın saati `LocalPantrixClock`'tur, varsayılanı cihazınki (`PantrixClock.System`); başka bir yerin günü `today` ile ya da bütün ekran için `LocalPantrixClock` ile verilir.
- **Platform.** Bir günün yeri telefonda platformun en küçük dokunma hedefi kadardır (Android'de 48dp, iOS'ta 44pt), masaüstünde ve web'de 36dp. Dar bir yerde günler sığacak kadar küçülür.
- **Tarih türü.** Günler `PantrixDate`'tir, tarih kütüphanesi gerekmez; `kotlinx-datetime`'a ya da `java.time`'a çevirmek için docs/guide/date-time/DATE_TIME_GUIDE.md.

## Kullanım

### A delivery day within the next month, on weekdays

```kotlin
var delivery by remember { mutableStateOf<PantrixDate?>(null) }
val today = rememberToday()
PantrixDatePicker(
    selected = delivery,
    onSelect = { delivery = it },
    minDate = today.plusDays(1),
    maxDate = today.plusMonths(1),
    isDateEnabled = { it.dayOfWeek <= 5 },
    tagKey = "delivery"
)
```

### The nights of a stay, from a week that starts on Monday

```kotlin
var stay by remember { mutableStateOf<PantrixDateRange?>(null) }
PantrixDatePicker(
    selectedRange = stay,
    onRangeSelect = { stay = it },
    minDate = rememberToday(),
    firstDayOfWeek = 1,
    tagKey = "stay"
)
```

## Örnekler

### Popover'da tek gün

Bir düğme seçilen günü gösterir ve takvimi altında bir popover'da açar; bir gün seçilince popover kapanır. Bugünden önceki günler seçilemez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var due by remember { mutableStateOf<PantrixDate?>(null) }
var open by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = due?.let(strings::written) ?: "Teslim tarihi seçin",
            onClick = { open = !open },
            variant = ButtonVariant.Outline,
            leadingIcon = { PantrixIcon(PantrixIcons.Calendar, contentDescription = null) },
            tagKey = "due"
        )
    },
    alignment = PopoverAlignment.Start,
    tagKey = "due"
) {
    PantrixDatePicker(
        selected = due,
        onSelect = {
            due = it
            open = false
        },
        minDate = rememberToday(),
        tagKey = "due"
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### Sayfada hafta içi bir aralık

Sayfada duran bir takvimden bir izin aralığı: yalnızca hafta içi günler uç olabilir, hafta her dilde Pazartesi başlar. Seçilen aralık takvimin altında yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixDateRange
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var leave by remember { mutableStateOf<PantrixDateRange?>(null) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixDatePicker(
        selectedRange = leave,
        onRangeSelect = { leave = it },
        isDateEnabled = { it.dayOfWeek <= FRIDAY },
        firstDayOfWeek = MONDAY,
        tagKey = "leave"
    )
    PantrixText(
        text = leave?.let { "İzin: ${strings.written(it.start)} – ${strings.written(it.end)}" }
            ?: "İznin ilk ve son gününü seçin",
        style = PantrixTheme.typography.body
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)

private const val MONDAY = 1

private const val FRIDAY = 5
```

### Dialog'da sınırlı günler

Bir dialog'da önümüzdeki otuz günden biri. Takvimdeki seçim bir taslaktır: Tamam onu kabul eder, Vazgeç ya da dialog'un dışına basmak bırakır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var appointment by remember { mutableStateOf<PantrixDate?>(null) }
var draft by remember { mutableStateOf<PantrixDate?>(null) }
var open by remember { mutableStateOf(false) }
val today = rememberToday()
val strings = PantrixTheme.strings
val report = LocalExampleEvents.current
PantrixButton(
    text = appointment?.let { "Randevu: ${strings.written(it)}" } ?: "Randevu günü seçin",
    onClick = {
        draft = appointment
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "appointment"
)
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Randevu günü",
    actions = {
        PantrixButton(text = "Vazgeç", onClick = { open = false }, variant = ButtonVariant.Text, tagKey = "cancel")
        PantrixButton(
            text = "Tamam",
            onClick = {
                appointment = draft
                open = false
                report("Randevu seçildi")
            },
            enabled = draft != null,
            tagKey = "accept"
        )
    },
    tagKey = "appointment"
) {
    PantrixDatePicker(
        selected = draft,
        onSelect = { draft = it },
        minDate = today,
        maxDate = today.plusDays(DAYS_AHEAD),
        tagKey = "appointment"
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)

private const val DAYS_AHEAD = 30
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Sheet'te doğum günü, yıllarla

Bir sheet'te doğum günü: bugünden sonrası seçilemez. Uzak bir yıl başlığa basıp yıllardan seçilir; takvim o yılın aynı ayına döner. Takvim sheet'in genişliğini doldurur (`fillMaxWidth`): sütunları genişler, çok geniş bir sheet'te ortada durur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var birthday by remember { mutableStateOf<PantrixDate?>(null) }
var open by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixButton(
    text = birthday?.let { "Doğum günü: ${strings.written(it)}" } ?: "Doğum gününü seçin",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "birthday"
)
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Doğum günü",
    tagKey = "birthday"
) {
    PantrixDatePicker(
        selected = birthday,
        onSelect = {
            birthday = it
            open = false
        },
        modifier = Modifier.fillMaxWidth(),
        maxDate = rememberToday(),
        tagKey = "birthday"
    )
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### Başka bir yerin bugünü

Takvimin bugünü cihazın saatine göre değil, bir otelin saatine göre: `today` bugünün halkasını verir, `minDate` de onunla seçilebilen ilk günü. Kiritimati (UTC+14) ile Pago Pago (UTC-11) arasında 25 saat vardır, ikisinde her an başka bir gündür: yer değişince halka ve ilk gün bir gün kayar. Verilmezse `today` ekranın saatinin günüdür (`rememberToday()`) ve gece yarısı kendiliğinden döner; bu örnek otelin gününü yer seçilince okur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Clock
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours

var hotel by remember { mutableStateOf(Hotel.Kiritimati) }
var arrival by remember { mutableStateOf<PantrixDate?>(null) }
val today = remember(hotel) { PantrixDate.of(Clock.System.now(), offset = hotel.offset) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(Hotel.Kiritimati, "Kiritimati", tagKey = "kiritimati"),
            SegmentOption(Hotel.PagoPago, "Pago Pago", tagKey = "pago_pago")
        ),
        selected = hotel,
        onSelect = {
            hotel = it
            arrival = null
        },
        fullWidth = false,
        tagKey = "hotel"
    )
    PantrixDatePicker(
        selected = arrival,
        onSelect = { arrival = it },
        minDate = today,
        today = today,
        tagKey = "arrival"
    )
    PantrixText(
        text = "Otelde bugün ${strings.written(today)} (${hotel.zone})",
        style = PantrixTheme.typography.body
    )
    PantrixText(
        text = arrival?.let { "Varış: ${strings.written(it)}" } ?: "Varış gününü seçin",
        style = PantrixTheme.typography.body
    )
}

private enum class Hotel(
    val zone: String,
    val offset: Duration
) {
    Kiritimati("UTC+14", 14.hours),
    PagoPago("UTC-11", (-11).hours)
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### Ekranın saati

Bütün bir ekranın saati: `LocalPantrixClock` otelin saatini verir ve içindeki her şey onu okur. Takvime `today` verilmedi; halkası, `rememberToday()` ve saatin kendisi otelin saatindedir. Bir önizleme ya da bir test ekranı böyle bir günde ve bir saatte gösterir: `PantrixClock(clock, utcOffset)` bir `Clock`'u da kendisi alır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.LocalPantrixClock
import com.pantrixui.foundation.date.PantrixClock
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Clock
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours

var hotel by remember { mutableStateOf(Hotel.Kiritimati) }
val clock = remember(hotel) { PantrixClock(Clock.System) { hotel.offset } }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(Hotel.Kiritimati, "Kiritimati", tagKey = "kiritimati"),
            SegmentOption(Hotel.PagoPago, "Pago Pago", tagKey = "pago_pago")
        ),
        selected = hotel,
        onSelect = { hotel = it },
        fullWidth = false,
        tagKey = "screen_hotel"
    )
    CompositionLocalProvider(LocalPantrixClock provides clock) {
        var arrival by remember { mutableStateOf<PantrixDate?>(null) }
        PantrixDatePicker(selected = arrival, onSelect = { arrival = it }, tagKey = "screen_arrival")
        val today = rememberToday()
        val now = LocalPantrixClock.current.time()
        val strings = PantrixTheme.strings
        PantrixText(
            text = "Ekranda bugün ${strings.written(today)}, saat ${strings.clock(now.hour, now.minute)}",
            style = PantrixTheme.typography.body
        )
    }
}

private enum class Hotel(
    val zone: String,
    val offset: Duration
) {
    Kiritimati("UTC+14", 14.hours),
    PagoPago("UTC-11", (-11).hours)
}

private fun PantrixStrings.written(day: PantrixDate): String = date(day.day, day.month, day.year)
```

### Kendi renkleri ve devre dışı

Takvimin kendi renkleri ve ölçüsü, bir anahtarla devre dışı. Aralığın uçları başarı renginde, arası onun açık dolgusunda, bugünün halkası uyarı renginde; verilmeyen her renk temanındır. Takvimin kenar boşluğu yok (`padding = 0.dp`): kartın kendi boşluğunda durur. Anahtar kapalıyken takvim soluktur: ne gün seçilir ne ay değişir, seçili aralık yerinde kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.datepicker.DatePickerColors
import com.pantrixui.components.date.datepicker.DatePickerStyle
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixDateRange
import com.pantrixui.foundation.theme.PantrixTheme

var trip by remember { mutableStateOf<PantrixDateRange?>(null) }
var enabled by remember { mutableStateOf(true) }
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = enabled,
        onCheckedChange = { enabled = it },
        label = "Seçilebilir",
        tagKey = "trip_enabled"
    )
    PantrixDatePicker(
        selectedRange = trip,
        onRangeSelect = { trip = it },
        enabled = enabled,
        style = DatePickerStyle(padding = 0.dp),
        colors = DatePickerColors(
            selectedContainer = colors.success.color,
            rangeContainer = colors.success.container,
            today = colors.warning.color
        ),
        tagKey = "trip"
    )
}
```

## API

### PantrixDatePicker

`import com.pantrixui.components.date.datepicker.PantrixDatePicker`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDatePicker(
    selected: PantrixDate?,
    onSelect: (PantrixDate) -> Unit,
    modifier: Modifier = Modifier,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    enabled: Boolean = true,
    today: PantrixDate = rememberToday(),
    style: DatePickerStyle? = null,
    colors: DatePickerColors? = null,
    tagKey: String? = null
)
```

Ay ay gezilen ve bir gün seçtiren bir takvim: ayın başlığı ve iki yanında ayı çeviren oklar, sütunların üstünde haftanın günleri, bir de ayın günleri.

Takvim seçimin kendisidir ve konduğu yerde durur: sayfada ya da bir düğmenin veya bir alanın açtığı bir `PantrixPopover`, `PantrixDialog` ya da `PantrixSheet` içinde. Kendi zeminini boyamaz ve seçimden bir şey tutmaz: `selected` çağıranındır, bir güne basmak onu `onSelect`'e verir. Kendisinin tuttuğu yalnızca gösterilen aydır: seçili günün ayından, yoksa bugünün ayından başlar ve çağıran gösterilmeyen bir gün seçince o günün ayına geçer.

Takvimin alamadığı günler soluk çizilir ve seçilemez: `minDate`'ten önceki ve `maxDate`'ten sonraki günler (oklar da oralara çevirmez) ve aradakilerden `isDateEnabled`'ın dışarıda bıraktıkları: bir hafta sonu, dolu bir gün. Başlığa basmak günlerin yerine yılları gösterir; bir yıl seçmek takvimi o yılın aynı ayına çevirir.

Takvim Tab için tek bir duraktır: seçili günde, bugünde ya da ayın ilk gününde. Tuşları günleri bir takvimin tuşları gibi gezer: oklar bir gün ya da bir hafta, Page Up ve Page Down bir ay, Shift ile bir yıl, Home ve End haftanın ilk ve son günü; Enter ve Space seçer. Ekran okuyucu her günü haftanın günüyle tam duyar ve ay değişince kibarca haber alır.

Günler `PantrixDate`'tir, bir tarih kütüphanesi gerekmez: docs/guide/date-time/DATE_TIME_GUIDE.md onları bir uygulamanın kendi türüne çevirir.

```kotlin
var due by remember { mutableStateOf<PantrixDate?>(null) }
PantrixDatePicker(
    selected = due,
    onSelect = { due = it },
    minDate = PantrixDate.today(),
    tagKey = "due"
)
```

Parametreler:

- `selected: PantrixDate?`: seçili gün; hiçbiri seçili değilken null.
- `onSelect: (PantrixDate) -> Unit`: bir basışın seçtiği günü alır: seçilebilen bir gün.
- `modifier: Modifier`: takvimin modifier'ı. Takvim yedi gün genişliğindedir; daha az yer verilen yerde daralır. Bir genişlik verilince, örneğin `Modifier.fillMaxWidth()` ona bir sheet'in genişliğini verince, o genişliği doldurur: sütunları `DatePickerStyle.maxCellWidth`'e kadar genişler, ötesinde takvim ortada durur.
- `minDate: PantrixDate?`: seçilebilen ilk gün; öyle erken bir sınır yoksa null.
- `maxDate: PantrixDate?`: seçilebilen son gün; öyle geç bir sınır yoksa null.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: aradaki bir günün seçilip seçilemeyeceği; hepsi seçilebiliyorsa null.
- `firstDayOfWeek: Int?`: haftaların başladığı gün, ISO 8601'in numaralarıyla: 1 Pazartesi, 7 Pazar. Null dilin gününü, `PantrixLocale.firstDayOfWeek`'i kullanır: İngilizcede Pazar, Türkçede Pazartesi, Arapçada Cumartesi.
- `enabled: Boolean`: bir günün seçilip seçilemeyeceği. Seçim almayan bir takvim soluk çizilir.
- `today: PantrixDate`: bugün olarak işaretlenen gün: varsayılan, ekranın saatinin gösterdiği gün (`rememberToday`), gece yarısı döner. Bir test kendi gününü verir.
- `style: DatePickerStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: DatePickerColors?`: bu takvimin kendi renkleri: verdikleri kullanılır, gerisi temanınkidir.
- `tagKey: String?`: takvimin otomasyon anahtarı: `DatePicker_<tagKey>` olur, günleri de `DatePicker_<tagKey>.Day_2026_10_17`.

### PantrixDatePicker

`import com.pantrixui.components.date.datepicker.PantrixDatePicker`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDatePicker(
    selectedRange: PantrixDateRange?,
    onRangeSelect: (PantrixDateRange) -> Unit,
    modifier: Modifier = Modifier,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    isDateEnabled: ((PantrixDate) -> Boolean)? = null,
    firstDayOfWeek: Int? = null,
    enabled: Boolean = true,
    today: PantrixDate = rememberToday(),
    style: DatePickerStyle? = null,
    colors: DatePickerColors? = null,
    tagKey: String? = null
)
```

Bir gün aralığı seçtiren takvim: bir konaklama, bir izin, bir raporun kapsadığı günler. Bir gün seçtiren takvimin kendisidir, iki kez basılır: ilk basış aralığın ilk gününü, ikincisi son gününü seçer.

İkinci basış aralığı kendi gününde bitirir (tek günlük bir aralık için yine ilk günde) ve aralık `onRangeSelect`'e verilir; ilk günden önceki bir güne basmak aralığı oradan yeniden başlatır. İki basış arasında ilk gün takvimin kendisinindir; işaretçinin altında, çıkacak aralık daha açık çizilir. Bir aralık seçilemeyen günlerin üstünden geçebilir; ilk ve son günü seçilebilen günlerdir.

`selectedRange` çağıranındır: takvim onu ilk ve son günü işaretli, aradaki günlerin altında bir şeritle çizer; çağıran hiçbir günü gösterilmeyen bir aralık seçince ilk gününün ayına geçer.

Parametreler:

- `selectedRange: PantrixDateRange?`: seçili aralık; hiçbiri seçili değilken null.
- `onRangeSelect: (PantrixDateRange) -> Unit`: iki basışın seçtiği aralığı alır.
- `modifier: Modifier`: takvimin modifier'ı. Takvim yedi gün genişliğindedir, daha az yer verilen yerde daralır; bir genişlik verilince, sütunları `DatePickerStyle.maxCellWidth`'e kadar genişleyerek o genişliği doldurur.
- `minDate: PantrixDate?`: seçilebilen ilk gün; öyle erken bir sınır yoksa null.
- `maxDate: PantrixDate?`: seçilebilen son gün; öyle geç bir sınır yoksa null.
- `isDateEnabled: ((PantrixDate) -> Boolean)?`: aradaki bir günün bir aralığın ilk ya da son günü olup olamayacağı; hepsi olabiliyorsa null.
- `firstDayOfWeek: Int?`: haftaların başladığı gün, ISO 8601'in numaralarıyla: 1 Pazartesi, 7 Pazar. Null dilin gününü, `PantrixLocale.firstDayOfWeek`'i kullanır.
- `enabled: Boolean`: bir aralığın seçilip seçilemeyeceği. Seçim almayan bir takvim soluk çizilir.
- `today: PantrixDate`: bugün olarak işaretlenen gün: varsayılan, ekranın saatinin gösterdiği gün (`rememberToday`), gece yarısı döner. Bir test kendi gününü verir.
- `style: DatePickerStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır.
- `colors: DatePickerColors?`: bu takvimin kendi renkleri: verdikleri kullanılır, gerisi temanınkidir.
- `tagKey: String?`: takvimin otomasyon anahtarı: `DatePicker_<tagKey>` olur, günleri de `DatePicker_<tagKey>.Day_2026_10_17`.

### DatePickerStyle

`import com.pantrixui.components.date.datepicker.DatePickerStyle`, `com.pantrixui:components` içinden

```kotlin
class DatePickerStyle(
    public val cellSize: Dp = Dp.Unspecified,
    public val daySize: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val maxCellWidth: Dp = Dp.Unspecified
) : PantrixStyle<DatePickerStyle>
```

`PantrixDatePicker`'ın geometrisi: bir günün yeri, seçili bir günün çizildiği yuvarlak işaret ve ayın çevresindeki boşluk.

Bir günün yeri haftanın bir sütunu kadar geniş, bir satırı kadar yüksektir ve günler birbirine değer: yerin herhangi bir noktasına basmak o günündür. Telefonda platformun en küçük dokunma hedefi kadardır (Android'de 48dp, iOS'ta 44pt); böylece bir ay yedi hedef genişliğindedir, Android'de bir Material takvimi gibi 360dp. İşaretçinin altında 36dp'dir. Aya dar gelen bir yer her günün yerini, işaretiyle birlikte, aynı oranda daraltır. Bundan geniş bir yer verilen takvim, örneğin bir sheet'te `Modifier.fillMaxWidth()` ile, sütunlarını `maxCellWidth`'e kadar genişleterek o yeri doldurur ve artanın ortasında durur; satırları ve işaretleri boylarını korur.

Ayın çevresindeki boşluk ve başlığın altındaki ara yoğunluğa uyar; bir dokunma hedefi gibi günün yeri, en geniş hâli ve işareti uymaz.

Parametreler:

- `cellSize: Dp`: Bir günün yerinin genişliği ve yüksekliği: sütun ve satır. Başlık ve yılların yerleri de bu yükseklikte.
- `daySize: Dp`: Seçili günün, bugünün ve işaretçinin altındaki günün çizildiği, yerinin ortasındaki yuvarlak işaretin genişliği ve yüksekliği. Bir gün aralığı bu yükseklikte bir şerittir.
- `padding: Dp`: Takvimin kenarı ile içindekiler arasındaki boşluk.
- `gap: Dp`: Başlık ile ayın üstündeki haftanın günleri arasındaki ara.
- `maxCellWidth: Dp`: Takvime yedi günün yerinden geniş bir yer verildiğinde bir sütunun genişleyebileceği en büyük genişlik: `cellSize`'ın bir buçuk katı.

### DatePickerColors

`import com.pantrixui.components.date.datepicker.DatePickerColors`, `com.pantrixui:components` içinden

```kotlin
data class DatePickerColors(
    public val content: Color = Color.Unspecified,
    public val weekday: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val rangeContainer: Color = Color.Unspecified,
    public val rangeContent: Color = Color.Unspecified,
    public val today: Color = Color.Unspecified,
    public val hover: Color = Color.Unspecified,
    public val disabled: Color = Color.Unspecified
)
```

Bir `PantrixDatePicker`'ın temanın renkleri yerine boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

Burada verilen `selectedContainer` temanın rol renklerinden biriyse seçili günün sayısı için temanın onunla eşlediği renk de gelir, `selectedContent` ayrıca verilmedikçe. `rangeContainer` da bir aralığın günleri için eşlenik rengini getirir, `rangeContent` verilmedikçe. Hiçbir rolde olmayan bir dolgu bunu getirmez: üstünde okunan rengi çağıran verir.

Takvim kendi zeminini boyamaz: altındakinin, bir popover'ın, bir dialog'un, bir sheet'in ya da bir sayfanın üstünde durur; yazıları temanın kendi zeminleri için olan renklerdir.

Parametreler:

- `content: Color`: Günlerin sayıları, başlık ve oklar. Temanın `textPrimary`'si.
- `weekday: Color`: Sütunların üstündeki haftanın günleri. Temanın `textSecondary`'si.
- `selectedContainer: Color`: Seçili günün ve bir aralığın ilk ve son gününün yuvarlak işareti. `primary` rolünün `color`'ı.
- `selectedContent: Color`: Üstündeki sayı. `primary` rolünün `onColor`'ı, ya da `selectedContainer` olarak verilen bir rol dolgusunun üstünde duran için verdiği renk.
- `rangeContainer: Color`: Bir aralığın ilk ve son günü arasındaki günlerin altındaki şerit. `primary` rolünün `container`'ı. Son gün işaretçiyle seçilirken altındaki güne kadar olan şerit bu rengin yarısıyla çizilir.
- `rangeContent: Color`: Şeridin üstündeki sayılar. `primary` rolünün `onContainer`'ı.
- `today: Color`: Bugünün çevresindeki halka ve sayısı. `primary` rolünün `color`'ı.
- `hover: Color`: İşaretçinin altındaki yuvarlak işaret: bir basışın hangi günü seçeceği. `content`'in bir payı.
- `disabled: Color`: Seçilemeyen günlerin sayıları ve seçim almayan bir takvimin her şeyi. Temanın `textDisabled`'ı.

### PantrixDate

`import com.pantrixui.foundation.date.PantrixDate`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixDate(
    public val year: Int,
    public val month: Int,
    public val day: Int
) : Comparable<PantrixDate>
```

Takvimde bir gün: bir yıl, bir ay ve ayın bir günü; günün saati de saat dilimi de yoktur.

Pantrix bir tarih kütüphanesi almaz. Birini kullanan bir bileşen, onu tarih gösteren her uygulamanın API'sine sokardı; bir uygulamanın hangisini kullandığına bir tasarım sistemi karar vermez. Bu tür üç sayıdır, uygulama onu tek satırla kendi türüne çevirir ve geri alır: `kotlinx-datetime`'ın `LocalDate`'inden `PantrixDate(date.year, date.month.number, date.day)`, `java.time`'ınkinden de aynısı. Her biri için satırlar docs/guide/date-time/DATE_TIME_GUIDE.md'de.

Takvim bugün kullanılan miladi takvimdir; başlangıcından öncesine de ileriye uzandığı gibi uzanır: birinci yıldan önceki yıl sıfır, ondan öncekiler sıfırdan küçük yazılır.

Parametreler:

- `year: Int`: Yıl, yazıldığı gibi.
- `month: Int`: Ay: Ocak için 1, Aralık için 12.
- `day: Int`: Ayın günü: 1'den ayın son gününe.

Üyeleri:

- `dayOfWeek: Int`: Bu günün haftanın hangi gününe düştüğü, ISO 8601'in numaralarıyla: 1 Pazartesi, 7 Pazar.
- `epochDays: Long`: 1 Ocak 1970'ten bu güne kadar geçen gün sayısı: o gün sıfır, öncesinde sıfırdan küçük.
- `fun plusDays(days: Int): PantrixDate`: Bu günden `days` gün sonraki gün; `days` sıfırdan küçükse önceki.
- `fun plusMonths(months: Int): PantrixDate`: `months` ay sonraki aynı gün; `months` sıfırdan küçükse önceki. O ay daha kısaysa ayın son günü: 31 Ocak'tan bir ay sonrası Şubat'ın son günüdür.
- `fun plusYears(years: Int): PantrixDate`: `years` yıl sonraki ya da önceki aynı gün: 29 Şubat, artık olmayan bir yılda 28 Şubat olur.
- `fun at(time: PantrixTime, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: Bir saatin bu gün `time`'ı gösterdiği an: varsayılan cihazın kendi saatidir; UTC'den farkını her an için `offsetAt` söyler, `systemUtcOffset`'in yaz saatiyle birlikte söylediği gibi.

  Saat geri alınıp o saati iki kez gösteriyorsa, `java.time`'ın aldığı gibi ikisinden ilkidir. İleri alınıp o saati hiç göstermiyorsa, atladığı saatin o kadar ötesidir: ikiden üçe geçilen bir gecede iki buçuk, üç buçuktur.

Tipin kendisinde:

- `PantrixDate.ofEpochDays(days: Long): PantrixDate`: 1 Ocak 1970'ten `days` gün sonraki gün; `days` sıfırdan küçükse önceki.
- `PantrixDate.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixDate`: UTC'den `offset` ileride olan bir saatin `moment` anında gösterdiği gün: varsayılanı cihazın kendi saati, `systemUtcOffset`'in söylediği gibi.
- `PantrixDate.today(): PantrixDate`: Cihazın saatinin şu an gösterdiği gün. Bir ekran bunun yerine `rememberToday`'i okur: ekranın saatinin gösterdiği gün, her gece yarısı yeniden sorulur.
- `PantrixDate.parse(text: String): PantrixDate`: ISO 8601'in `text` olarak yazdığı gün: `2026-10-17`; yıl en az dört haneli, sıfırdan küçük bir yılın önünde işaretiyle, `toString`'in yazdığı gibi.
- `PantrixDate.daysInMonth(year: Int, month: Int): Int`: `year` yılının `month` ayının kaç gün olduğu: 28'den 31'e; artık yılda Şubat'ın 29'u da vardır.
- `PantrixDate.isLeapYear(year: Int): Boolean`: `year` yılında 29 Şubat olup olmadığı: her dört yılda bir, ama her yüz yılda bir değil, ama her dört yüz yılda bir.

### PantrixDateRange

`import com.pantrixui.foundation.date.PantrixDateRange`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixDateRange(
    public val start: PantrixDate,
    public val end: PantrixDate
)
```

`start`'tan `end`'e bir gün aralığı, ikisi de içinde: bir konaklama, bir izin, bir raporun kapsadığı günler. Tek günlük bir aralık o günde başlar ve biter.

Parametreler:

- `start: PantrixDate`
- `end: PantrixDate`

Üyeleri:

- `operator fun contains(date: PantrixDate): Boolean`: `date`'in aralığın günlerinden biri olup olmadığı; ilk ve son günü de bunlara dahildir.

### rememberToday

`import com.pantrixui.foundation.date.rememberToday`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberToday(): PantrixDate
```

Ekranın saatinin gösterdiği gün, gece yarısından sonra da açık kalan bir ekranın gördüğü gibi: saat ertesi güne geçince o da geçer, onu okuyan yeniden çizilir. Bir takvim bugünü onunla işaretler. Saat `LocalPantrixClock`'unkidir: bir test ya da önizleme başkasını vermedikçe cihazınki.

Saate, saatin kendi zamanıyla her gece yarısı yeniden bakar, arada bakmaz: elle kurulan bir saat ya da başka bir saat dilimine yapılan bir yolculuk, ekran yeniden kurulunca ya da bir sonraki gece yarısında görünür.

### PantrixClock

`import com.pantrixui.foundation.date.PantrixClock`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixClock(
    public val clock: Clock,
    public val utcOffset: (Instant) -> Duration
)
```

Bir ekranın zamanı okuduğu yer: şu anki an ve ekranın gösterildiği saatin bir anda UTC'den ne kadar ileride olduğu. `rememberToday` günü, saat alanı seçicisinin açıldığı saati, elastic date picker aralıklarını ve bir grafik anlarını ondan okur. `System` cihazınkidir; bir test ya da önizleme, bir ekranı seçtiği bir günde ve bir saatte görmek için `LocalPantrixClock` ile kendi saatini verir.

Parametreler:

- `clock: Clock`: şu anki anın ne olduğu.
- `utcOffset: (Instant) -> Duration`: saatin bir anda UTC'den ne kadar ileride olduğu: İstanbul'da üç saat, Greenwich'in batısında sıfırdan az; yaz saatinin uygulandığı yerde yaz saati dahil.

Üyeleri:

- `fun today(): PantrixDate`: Bu saatin şu an gösterdiği gün.
- `fun time(): PantrixTime`: Bu saatin şu an gösterdiği saat, saniyesiyle.

Tipin kendisinde:

- `PantrixClock.System: PantrixClock`: Cihazın saati, cihazın saat diliminde.

### LocalPantrixClock

`import com.pantrixui.foundation.date.LocalPantrixClock`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixClock: ProvidableCompositionLocal<PantrixClock>
```

Ekranın okunduğu saat: bir test ya da önizleme başkasını vermedikçe `PantrixClock.System`.
