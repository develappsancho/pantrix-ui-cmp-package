# Time Picker

Sütunlardan bir saat seçmek: saatler, dakikalar ve 12 saatlik bir saatte günün yarısı. Seçici seçimin kendisidir: sayfada durur ya da bir popover'ın, bir dialog'un, bir sheet'in içine konur. Seçimi tutmaz; seçilen saat `onSelect`'e gelir.

- `PantrixTimePicker` (`com.pantrixui.components.date.timepicker`, `com.pantrixui:components`): Saatlerin ve dakikaların, on iki saatlik saatte günün yarısının da kayan sütunlarından seçilen bir saat; seçilemeyen saatler soluk çizilir. Anahtar sözcükler: saat, saat seçici, saat dakika, saat çarkı, öö ös.

## Özellikler

- **Seçim.** Bir değere basmak bütün bir saati verir, öteki sütun olduğu gibi kalır. Henüz seçim yoksa bir saat ilk izinli dakikasıyla, bir dakika ilk izinli saatle gelir. Seçili değer sütunun ortasına kayar.
- **Seçilemeyen saatler.** `minTime` ve `maxTime` dışındaki dakikalar ve hiçbir dakikası arada kalmayan saatler soluk çizilir ve basılamaz. `maxTime` `minTime`'dan önceyse seçilebilen saatler gece yarısını geçer; 24 saatte saat sütunu `minTime`'ın saatiyle başlar.
- **Dakika adımı.** `minuteStep` dakikaların arasını verir: 15 ile 00, 15, 30 ve 45.
- **12 ya da 24 saat.** `is24Hour` seçicinin şeklini verir: `true` iki sütunla 22:00, `false` günün yarısının sütunuyla 10:00 PM (AM/PM, ÖÖ/ÖS, ص/م). Varsayılan her dilde 24 saattir. Ekranda aynı düzenle yazmak için `strings.time(saat, dakika, is24Hour = …)`.
- **Klavye.** Her sütun bir Tab durağıdır. Oklar bir değer, Page Up ve Page Down altı saat ya da on beş dakika, Home ve End ilk ve son değeri seçer; rakam yazmak o değere atlar ("1" sonra "4" saat 14). ← ve → sütunlar arasında gezer.
- **Ekran okuyucu.** Her sütun adıyla, her değer bir düğme olarak okunur; seçilen saat kibarca duyurulur.
- **Platform.** Bir satır telefonda platformun en küçük dokunma hedefi kadardır (Android'de 48dp, iOS'ta 44pt), masaüstünde ve web'de 36dp.
- **Saat türü.** Saatler `PantrixTime`'dır; bir gün ve bir saat `PantrixDate.at` ile cihazın saatinde bir an olur. `kotlinx-datetime`'a ya da `java.time`'a çevirmek için docs/guide/date-time/DATE_TIME_GUIDE.md.

## Kullanım

### An appointment on the quarter hour, in working hours

```kotlin
var at by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimePicker(
    selected = at,
    onSelect = { at = it },
    minTime = PantrixTime(9, 0),
    maxTime = PantrixTime(17, 45),
    minuteStep = 15,
    tagKey = "at"
)
```

### A reminder by a clock of twelve hours

```kotlin
var reminder by remember { mutableStateOf<PantrixTime?>(PantrixTime(8, 30)) }
PantrixTimePicker(
    selected = reminder,
    onSelect = { reminder = it },
    is24Hour = false,
    tagKey = "reminder"
)
```

## Örnekler

### Popover'da çeyrek saatlik randevu

Bir düğme seçilen saati gösterir ve seçiciyi altında bir popover'da açar. Dakikalar çeyrek saat arayla; popover saat ve dakika seçilirken açık kalır, dışına basınca kapanır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var at by remember { mutableStateOf<PantrixTime?>(null) }
var open by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = at?.let { strings.clock(it.hour, it.minute) } ?: "Randevu saati seçin",
            onClick = { open = !open },
            variant = ButtonVariant.Outline,
            leadingIcon = { PantrixIcon(PantrixIcons.Clock, contentDescription = null) },
            tagKey = "at"
        )
    },
    alignment = PopoverAlignment.Start,
    tagKey = "at"
) {
    PantrixTimePicker(
        selected = at,
        onSelect = { at = it },
        minuteStep = QUARTER,
        tagKey = "at"
    )
}

private const val QUARTER = 15
```

### Sayfada çalışma saatleri

Sayfada duran bir seçiciden çalışma saatleri içinde bir saat: 09:00 ile 17:30 arası, yarım saat arayla. Dışarıda kalan saatler soluk; seçilen saat altında yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var call by remember { mutableStateOf<PantrixTime?>(PantrixTime(OPENS, 0)) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimePicker(
        selected = call,
        onSelect = { call = it },
        minTime = PantrixTime(OPENS, 0),
        maxTime = PantrixTime(LAST_CALL, HALF_HOUR),
        minuteStep = HALF_HOUR,
        tagKey = "call"
    )
    PantrixText(
        text = call?.let { "Arama saati: ${strings.clock(it.hour, it.minute)}" } ?: "Bir arama saati seçin",
        style = PantrixTheme.typography.body
    )
}

private const val HALF_HOUR = 30

private const val OPENS = 9

private const val LAST_CALL = 17
```

### Dialog'da gün ve saat birlikte

Bir dialog'da bir toplantının günü ve saati. Saat, yer olduğunda takvimin sağında durur; ikisine yetmeyen bir pencerede, bir telefonda olduğu gibi, takvimin altına iner (`FlowRow`). Takvimdeki ve saatteki seçim bir taslaktır: Tamam ikisini `PantrixDate.at` ile cihazın saatinde bir ana çevirir; o an UTC olarak da yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.date.datepicker.PantrixDatePicker
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var meeting by remember { mutableStateOf<Instant?>(null) }
var day by remember { mutableStateOf<PantrixDate?>(null) }
var time by remember { mutableStateOf<PantrixTime?>(null) }
var open by remember { mutableStateOf(false) }
val today = rememberToday()
val strings = PantrixTheme.strings
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Toplantı zamanı seçin",
        onClick = { open = true },
        variant = ButtonVariant.Outline,
        tagKey = "meeting"
    )
    meeting?.let { moment ->
        val shown = PantrixDate.of(moment)
        val clock = PantrixTime.of(moment)
        PantrixText(
            text = "Toplantı: ${strings.date(shown.day, shown.month, shown.year)} " +
                strings.clock(clock.hour, clock.minute),
            style = PantrixTheme.typography.body
        )
        PantrixText(text = "UTC: $moment", style = PantrixTheme.typography.footnote)
    }
}
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Toplantı zamanı",
    actions = {
        PantrixButton(text = "Vazgeç", onClick = { open = false }, variant = ButtonVariant.Text, tagKey = "cancel")
        PantrixButton(
            text = "Tamam",
            onClick = {
                val chosenDay = day
                val chosenTime = time
                if (chosenDay != null && chosenTime != null) meeting = chosenDay.at(chosenTime)
                open = false
                report("Toplantı zamanı seçildi")
            },
            enabled = day != null && time != null,
            tagKey = "accept"
        )
    },
    tagKey = "meeting"
) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md, Alignment.CenterHorizontally),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixDatePicker(selected = day, onSelect = { day = it }, minDate = today, tagKey = "meeting")
        PantrixTimePicker(
            selected = time,
            onSelect = { time = it },
            minuteStep = FIVE_MINUTES,
            tagKey = "meeting"
        )
    }
}

private const val FIVE_MINUTES = 5
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### 12 ya da 24 saat

Bir hatırlatmanın saati, seçilen saat düzeniyle. `is24Hour` seçicinin şeklini verir: `true` iki sütun (00'dan 23'e, 22:00), `false` saatler 12'den 11'e ve günün yarısının sütunu (10:00 PM). Saat yine 24 saatlik bir `PantrixTime`'dır; yalnızca gösterimi değişir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var reminder by remember { mutableStateOf<PantrixTime?>(PantrixTime(REMINDER_HOUR, 0)) }
var is24Hour by remember { mutableStateOf(true) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(true, "24 saat", tagKey = "twenty_four"),
            SegmentOption(false, "12 saat", tagKey = "twelve")
        ),
        selected = is24Hour,
        onSelect = { is24Hour = it },
        fullWidth = false,
        tagKey = "cycle"
    )
    PantrixTimePicker(
        selected = reminder,
        onSelect = { reminder = it },
        is24Hour = is24Hour,
        tagKey = "reminder"
    )
    PantrixText(
        text = reminder?.let { "Hatırlatma: ${strings.time(it.hour, it.minute, is24Hour = is24Hour)} ($it)" }
            ?: "Bir hatırlatma saati seçin",
        style = PantrixTheme.typography.body
    )
}

private const val REMINDER_HOUR = 22
```

### Gece yarısını geçen saatler

Bir gece vardiyasının başlangıcı: 22:00 ile 06:00 arası, yarım saat arayla. `maxTime` `minTime`'dan önce olduğu için seçilebilen saatler gece yarısını geçer ve saat sütunu 22'den başlar: 22, 23, sonra 00'dan 06'ya, gecenin saatleri bir arada; ötekiler soluk, sütunun sonunda. Gece yarısından sonraki bir saat ertesi güne düşer, altta öyle yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

val opens = PantrixTime(NIGHT_STARTS, 0)
var start by remember { mutableStateOf<PantrixTime?>(opens) }
val strings = PantrixTheme.strings
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTimePicker(
        selected = start,
        onSelect = { start = it },
        minTime = opens,
        maxTime = PantrixTime(NIGHT_ENDS, 0),
        minuteStep = HALF_HOUR,
        tagKey = "night"
    )
    PantrixText(
        text = start?.let {
            val clock = strings.clock(it.hour, it.minute)
            if (it < opens) "Vardiya başlangıcı: $clock, ertesi gün" else "Vardiya başlangıcı: $clock"
        } ?: "Vardiyanın başlangıcını seçin",
        style = PantrixTheme.typography.body
    )
}

private const val HALF_HOUR = 30

private const val NIGHT_STARTS = 22

private const val NIGHT_ENDS = 6
```

### Kendi renkleri ve devre dışı

Seçicinin kendi renkleri ve ölçüsü, bir anahtarla devre dışı. Seçili saatin dolgusu ve sütunların adları bilgi renginde; verilmeyen her renk temanındır. Seçicinin kenar boşluğu yok (`padding = 0.dp`): kartın kendi boşluğunda durur. Anahtar kapalıyken seçici soluktur ve basılamaz, seçili saat yerinde kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.timepicker.PantrixTimePicker
import com.pantrixui.components.date.timepicker.TimePickerColors
import com.pantrixui.components.date.timepicker.TimePickerStyle
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.theme.PantrixTheme

var alarm by remember { mutableStateOf<PantrixTime?>(PantrixTime(ALARM_HOUR, HALF_HOUR)) }
var enabled by remember { mutableStateOf(true) }
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = enabled,
        onCheckedChange = { enabled = it },
        label = "Seçilebilir",
        tagKey = "alarm_enabled"
    )
    PantrixTimePicker(
        selected = alarm,
        onSelect = { alarm = it },
        enabled = enabled,
        style = TimePickerStyle(padding = 0.dp),
        colors = TimePickerColors(selectedContainer = colors.info.color, heading = colors.info.color),
        tagKey = "alarm"
    )
}

private const val HALF_HOUR = 30

private const val ALARM_HOUR = 7
```

## API

### PantrixTimePicker

`import com.pantrixui.components.date.timepicker.PantrixTimePicker`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTimePicker(
    selected: PantrixTime?,
    onSelect: (PantrixTime) -> Unit,
    modifier: Modifier = Modifier,
    minTime: PantrixTime? = null,
    maxTime: PantrixTime? = null,
    minuteStep: Int = 1,
    is24Hour: Boolean = true,
    enabled: Boolean = true,
    style: TimePickerStyle? = null,
    colors: TimePickerColors? = null,
    tagKey: String? = null
)
```

Sütunlardan seçilen bir saat: saatler, dakikalar ve 12 saatlik bir saatte günün yarısı; her biri beş satır gösteren, kalanına kayan bir sütun, seçili değer ortasında dolgulu.

Şeklini `is24Hour` verir: 24 saatte `22:00`'ı seçen iki sütun, 00'dan 23'e saatler ve dakikalar; 12 saatte `10:00 PM`'i seçen, 12'den 11'e saatler, dakikalar ve günün yarısının üçüncü sütunu. Çağrı 12 saat istemedikçe her dilde 24 saattir.

Seçici seçimin kendisidir ve konduğu yerde durur: sayfada ya da bir düğmenin ya da alanın açtığı bir `PantrixPopover`, `PantrixDialog` veya `PantrixSheet` içinde. Kendi zeminini boyamaz ve seçimden bir şey tutmaz: `selected` çağıranındır, bir değere basmak onun yaptığı bütün saati `onSelect`'e verir, öteki sütunlar olduğu gibi kalır. Seçim yokken bir saat ilk dakikasıyla, bir dakika seçicinin aldığı ilk saatle gelir. Ancak Tamam'a basınca alınacak bir saat çağıranın taslağıdır.

Seçicinin alamadığı değerler soluk çizilir ve basılamaz: `minTime`'dan önceki ve `maxTime`'dan sonraki dakikalar, hiçbir dakikası arada kalmayan saatler. Dakikalar `minuteStep` arayladır.

Her sütun seçili değerinde tek bir Tab durağıdır ve tuşları gezdikçe seçer: oklar alttaki ve üstteki değeri, Home ve End ilkini ve sonuncusunu, Page Down ve Page Up altı saat ya da on beş dakika ötesini, yazılan rakamlar yazdıkları değeri; `1` sonra `4` on dördüncü saattir; yandaki oklar yandaki sütuna geçer. Ekran okuyucu her sütunu adıyla, her değeri bir düğme olarak duyar; bir basışın ya da tuşun seçtiği saat kibarca söylenir.

Saatler `PantrixTime`'dır, tarih kütüphanesi gerekmez: docs/guide/date-time/DATE_TIME_GUIDE.md onları uygulamanın kendi türüne, bir gün ile bir saati de bir ana çevirir.

```kotlin
var at by remember { mutableStateOf<PantrixTime?>(null) }
PantrixTimePicker(
    selected = at,
    onSelect = { at = it },
    minuteStep = 15,
    tagKey = "at"
)
```

Parametreler:

- `selected: PantrixTime?`: seçili saat; seçim yokken null. Saniyeleri, bir basışın ondan yaptığı her saatte korunur.
- `onSelect: (PantrixTime) -> Unit`: bir basışın ya da tuşun seçtiği saati alır: seçicinin aldığı bir saat.
- `modifier: Modifier`: seçicinin modifier'ı. Seçici sütunları kadar geniştir; daha geniş bir yer verilince ortasında durur.
- `minTime: PantrixTime?`: seçilebilen ilk saat; o kadar erken bir sınır yoksa null. Saati ve dakikası dikkate alınır.
- `maxTime: PantrixTime?`: seçilebilen son saat; o kadar geç bir sınır yoksa null. `minTime`'dan önceyse seçilebilen saatler gece yarısını geçer, `minTime`'dan ertesi günün `maxTime`'ına kadar: bir gecenin saatleri. 24 saatte saat sütunu o zaman `minTime`'ın saatiyle başlar, gecenin saatleri bir arada durur: 22, 23, 00.
- `minuteStep: Int`: sütunundaki dakikaların arası, 1 ile 60: 15 saat başını, çeyrek geçeyi, buçuğu ve çeyrek kalayı sunar. Aralarına düşen seçili bir dakika yine de gösterilir.
- `is24Hour: Boolean`: saatlerin 24 ile sayılıp sayılmadığı, dolayısıyla seçicinin şekli: `22:00`'ı seçen iki sütun; ya da 12 ile, günün yarısının üçüncü sütunuyla `10:00 PM`. Varsayılan her dilde 24 saattir. Her iki durumda da seçilen saat 24 saatlik bir `PantrixTime`'dır; bir ekran onu aynı düzenle `PantrixStrings.time(hour, minute, is24Hour = …)` ile yazar.
- `enabled: Boolean`: bir saat seçilip seçilemeyeceği. Seçim almayan bir seçici soluk çizilir.
- `style: TimePickerStyle?`: bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar, her platformda değişir.
- `colors: TimePickerColors?`: bu seçicinin kendi renkleri: verdikleri, kalanı için temanınkiler.
- `tagKey: String?`: seçicinin otomasyon anahtarı: `TimePicker_<tagKey>` olur, değerleri `TimePicker_<tagKey>.Hour_14`, `.Minute_30` ve `.Period_pm`.

### TimePickerStyle

`import com.pantrixui.components.date.timepicker.TimePickerStyle`, `com.pantrixui:components` içinden

```kotlin
class TimePickerStyle(
    public val cellSize: Dp = Dp.Unspecified,
    public val markHeight: Dp = Dp.Unspecified,
    public val columnWidth: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<TimePickerStyle>
```

`PantrixTimePicker`'ın geometrisi: bir sütundaki bir değerin yeri, seçili bir değerin çizildiği hap, bir sütunun genişliği ve sütunların çevresindeki boşluk.

Bir değerin yeri sütunu kadar geniş, bir satır kadar yüksektir ve satırlar birbirine değer: yerin herhangi bir noktasına basmak o değerindir. Telefonda bir satır, takvimdeki bir gün gibi, platformun en küçük dokunma hedefi kadardır (Android'de 48dp, iOS'ta 44pt); işaretçinin altında 36dp'dir. Bir sütun beş satır gösterir, kalanına kayar.

Sütunların çevresindeki boşluk ve adlarının altındaki ara yoğunluğa uyar; bir dokunma hedefi gibi satır, hapı ve sütunun genişliği uymaz.

Parametreler:

- `cellSize: Dp`: Bir değerin yerinin yüksekliği: bir satır.
- `markHeight: Dp`: Seçili değerin ve işaretçinin altındaki değerin çizildiği, yerinin ortasındaki hapın yüksekliği. Sütunun çoğu kadar geniştir.
- `columnWidth: Dp`: Bir değer sütununun genişliği.
- `padding: Dp`: Seçicinin kenarı ile sütunları arasındaki boşluk.
- `gap: Dp`: Sütunların adları ile değerleri arasındaki ara.

### TimePickerColors

`import com.pantrixui.components.date.timepicker.TimePickerColors`, `com.pantrixui:components` içinden

```kotlin
data class TimePickerColors(
    public val content: Color = Color.Unspecified,
    public val heading: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val hover: Color = Color.Unspecified,
    public val disabled: Color = Color.Unspecified
)
```

Bir `PantrixTimePicker`'ın temanın renkleri yerine boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

Burada verilen `selectedContainer` temanın rol renklerinden biriyse, `selectedContent` de verilmedikçe, seçili değerin sayısı için temanın onunla eşlediği rengi getirir. Hiçbir rolün olmayan bir dolgu getirmez: üstünde okunacak rengi çağıran verir.

Seçici kendi zeminini boyamaz: altındakinin üstünde durur, bir popover'ın, dialog'un, sheet'in ya da sayfanın.

Parametreler:

- `content: Color`: Değerlerin sayıları ve saatler ile dakikalar arasındaki işaret. Temanın `textPrimary`'si.
- `heading: Color`: Sütunların üstlerindeki adları. Temanın `textSecondary`'si.
- `selectedContainer: Color`: Seçili bir değerin hapı. Birincil rolün `color`'ı.
- `selectedContent: Color`: Üstündeki sayı. Birincil rolün `onColor`'ı ya da `selectedContainer` olarak verilen bir rol dolgusunun üstündekine verdiği renk.
- `hover: Color`: İşaretçinin altındaki hap: bir basışın hangi değeri seçeceği. `content`'in bir payı.
- `disabled: Color`: Seçilemeyen değerler ve seçim almayan bir seçicinin her şeyi. Temanın `textDisabled`'ı.

### PantrixTime

`import com.pantrixui.foundation.date.PantrixTime`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixTime(
    public val hour: Int,
    public val minute: Int,
    public val second: Int = 0
) : Comparable<PantrixTime>
```

Günün bir saati: 24 saatlik bir saatte bir saat, bir dakika ve bir saniye; günü ve saat dilimi yok.

`PantrixDate` gibi üç sayıdır; bir uygulama onu tek satırda kendi türüne ve geri çevirir: `kotlinx-datetime`'ın `LocalTime`'ından `PantrixTime(time.hour, time.minute, time.second)`, `java.time`'ınkinden de aynısı. Bir gün ve bir saat `PantrixDate.at` ile cihazın saatinde bir an olur; her biri için satırlar docs/guide/date-time/DATE_TIME_GUIDE.md'de.

Bir saat dil ne olursa olsun 24 saatle yazılır: saklanan ve gönderilen `toString`'dir. Ekranın gösterdiği dilin yazımıdır, `PantrixStrings.time`; İngilizcede 12 saatle.

Parametreler:

- `hour: Int`: Saat: gece yarısından sonraki için 0'dan 23'e.
- `minute: Int`: Saatin dakikası, 0 ile 59.
- `second: Int`: Dakikanın saniyesi, 0 ile 59: bir saatin kendi saniyeleri, artık saniye yok.

Üyeleri:

- `secondOfDay: Int`: Gece yarısından bu saate kadarki saniyeler: gece yarısında sıfır, günün son saniyesinde 86 399.

Tipin kendisinde:

- `PantrixTime.ofSecondOfDay(seconds: Int): PantrixTime`: Gece yarısından `seconds` saniye sonraki saat, 0 ile 86 399.
- `PantrixTime.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixTime`: UTC'den `offset` ileride olan bir saatin `moment` anında saniyesine kadar gösterdiği saat: varsayılan cihazın kendi saatidir, `systemUtcOffset`'in söylediği gibi.
- `PantrixTime.now(): PantrixTime`: Cihazın saatinin şu an saniyesine kadar gösterdiği saat.
- `PantrixTime.parse(text: String): PantrixTime`: ISO 8601'in `text` olarak yazdığı saat: `14:05` ya da saniyesiyle `14:05:30`, her parçası iki rakam, `toString`'in yazdığı gibi.
