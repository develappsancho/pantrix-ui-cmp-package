# Elastic Date Picker

Saatle birlikte kayabilen bir zaman aralığı: bir pano onunla süzülür, "son 15 dakika" bir sonraki yenilemede yine son 15 dakikadır. Elastic UI'ın `EuiSuperDatePicker`'ı, Pantrix üzerinde yeniden.

- `PantrixElasticDatePicker` (`com.pantrixui.components.date.elasticdatepicker`, `com.pantrixui:components`): Saatle birlikte kayabilen bir zaman aralığı: hızlı bir menüden ya da ucu ucuna seçilir, bir an, şimdiden bir süre ya da şimdi olarak; bir popover'da, bir sheet'te ya da bir dialog'da, onu yenileyen ya da bir düzenlemeyi alan bir düğmeyle. Anahtar sözcükler: tarih aralığı seçici, göreli zaman, hızlı seçim, zaman aralığı, son 24 saat, zaman süzgeci.

## Özellikler

- **Alan.** Solda hızlı menünün takvimi, ortada aralığın adı ("Son 15 dakika", "Bugün"), yanında Yenile. Ada basınca iki uç görünür (başlangıç → bitiş) ve başlangıcın paneli açılır. Adı olmayan bir aralık doğrudan iki uçla görünür.
- **Hızlı menü.** Bir birimin son ya da sonraki miktarı, aralığı kendi uzunluğu kadar kaydıran ‹ ve ›, `commonlyUsed`'ın adıyla sunduğu aralıklar (varsayılan Elastic UI'ın sekizi) ve `recentlyUsed`'ın tuttukları. Buradaki seçim hemen verilir.
- **Bir uç.** Üç sekme: Mutlak (takvim, yarım saatlik saatler ve yazılabilen an), Göreli (miktar, birim, düştüğü an, birime yuvarlama), Şimdi. Sekmeye geçmek ucu o sekmenin gösterdiğine çevirir. Mutlak ve Göreli'de anın alanının sonundaki Uygula düzenlemeyi alıp paneli kapatır; Şimdi'nin düğmesi ucu şimdi yapar ve aynısını yapar.
- **Bekleyen düzenleme.** Alan başarı renginde boyanır, sonunda bir işaret çıkar ve yandaki düğme Güncelle der. Başlangıçtan önceki bir son alanı tehlike renginde boyar ve Güncelle hiçbir şey almaz. `updateButton = None` ile her düzenleme hemen verilir.
- **Tek basış.** Bir panel açıkken öteki uca, Güncelle'ye ya da sayfanın başka bir yerine basmak hem paneli kapatır hem basılanı yapar, Elastic UI'daki gibi. Açık ucun düğmesine basmak panelini kapatır.
- **Popover, sheet ya da dialog.** `presentation` her panelin neyde açılacağını söyler; her platformda aynı. Varsayılan dar bir pencerede sheet, daha genişte popover'dır. Panellerin üstünde başlık yoktur.
- **Sıkı paneller.** Elastic UI'ınkiler gibi: bir ucun paneli takvimi ve yanındaki saatler kadar geniş, hızlı menü 400dp; içlerindeki alanlar, sekmeler ve düğmeler bir formunkinden 8dp alçak.
- **Otomatik yenileme.** `autoRefresh` ve `onAutoRefreshChange`: hızlı menüde "Yenileme aralığı", alanın sonunda ne sıklıkla olduğu; `minAutoRefresh` en kısası. Her tur `onRefresh`'i bekler, hata verirse yenileme durur.
- **Zaman penceresi.** `timeWindowButtons`: ‹ ve › aralığı uzunluğu kadar kaydırır, uzaklaştırma ve istenirse yakınlaştırma onu `zoomFactor` kadar genişletip daraltır.
- **Alanın düzeni.** `layout`: aralık, yalnız hızlı menünün düğmesi ya da yalnız otomatik yenileme.
- **Hızlı menünün parçaları.** `customQuickPanels` kendi panelleri, `quickMenu` menünün kendi sırası.
- **Saat dilimi ve kapalı yazısı.** `utcOffset` anların farkı, `timeZoneName` panellerdeki adı; `disabledText` seçim almayan bir seçicinin yazısı.
- **Ekran okuyucu.** Her uç adı ve sözüyle bir düğmedir ("Başlangıç tarihi, ~ 15 dakika önce"); bekleyen bir düzenleme kibarca duyurulur.
- **Zaman.** Uçlar `PantrixTimePoint`'tir; `PantrixTimeRange.resolve()` onları şimdiye göre iki `Instant` yapar, `toDateMath()` Elasticsearch'ün tarih matematiğiyle yazar. Ayrıntısı docs/guide/date-time/DATE_TIME_GUIDE.md'de.

## Kullanım

### The last 15 minutes of a dashboard, with the ranges used lately

```kotlin
var range by remember {
    mutableStateOf(PantrixTimeRange(PantrixTimePoint.Relative(-15, PantrixTimeUnit.Minutes), PantrixTimePoint.Now))
}
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    recentlyUsed = rememberRecentRanges(),
    tagKey = "dashboard"
)
```

### Logs filtered as each end changes, the panels in a sheet

```kotlin
val today = PantrixQuickRange.commonlyUsed(PantrixTheme.strings).first().range
var range by remember { mutableStateOf(today) }
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    updateButton = ElasticDatePickerUpdateButton.None,
    presentation = DatePickerPresentation.Sheet,
    tagKey = "logs"
)
```

## Örnekler

### Son kullanılanlarla bir pano

Bir panonun son 15 dakikası. Seçilen aralıklar hızlı menünün "Son kullanılanlar"ında birikir; Yenile bir yüklemeyi bir saniye sürdürür ve düğme bu sürede döner. Altında aralığın şimdi düştüğü iki an ve son yenilemenin saati.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.date.elasticdatepicker.rememberRecentRanges
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.time.Clock
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_QUARTER) }
var refreshed by remember { mutableStateOf<Instant?>(null) }
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = {
            range = it
            refreshed = Clock.System.now()
            report("Aralık seçildi")
        },
        recentlyUsed = rememberRecentRanges(),
        onRefresh = {
            delay(LOADING_MILLIS)
            refreshed = Clock.System.now()
            report("Yenilendi")
        },
        tagKey = "dashboard"
    )
    Resolved(range)
    refreshed?.let { PantrixText(text = "Son yenileme: ${moment(it)}", style = PantrixTheme.typography.footnote) }
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "Son, başlangıçtan önce",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private const val LOADING_MILLIS = 1000L

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Güncelle düğmesi: sözlü, yalnız simge, düğmesiz

Yandaki düğmenin üç hâli. Sözlü düğme bir düzenleme beklerken Güncelle der; yalnız simge aynı işi daha az yerle yapar; düğmesiz seçicide bir uçtaki her düzenleme hemen verilir. Bir ucu değiştirip farkı görün.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerUpdateButton
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var button by remember { mutableStateOf(ElasticDatePickerUpdateButton.Text) }
var range by remember { mutableStateOf(LAST_QUARTER) }
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(ElasticDatePickerUpdateButton.Text, "Sözlü", tagKey = "text"),
            SegmentOption(ElasticDatePickerUpdateButton.Icon, "Yalnız simge", tagKey = "icon"),
            SegmentOption(ElasticDatePickerUpdateButton.None, "Düğmesiz", tagKey = "none")
        ),
        selected = button,
        onSelect = { button = it },
        fullWidth = false,
        tagKey = "update_button"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = {
            range = it
            report("Aralık verildi")
        },
        updateButton = button,
        tagKey = "update"
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "Son, başlangıçtan önce",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Popover, sheet ya da dialog

Panellerin neyde açılacağı her platformda aynıdır: `presentation = Popover` ile parçanın yanında bir popover, `presentation = Sheet` ile ekranın kenarından gelen bir sheet, `presentation = Dialog` ile pencerenin ortasında, panel kadar geniş bir dialog. Varsayılan `Adaptive`: dar bir pencerede sheet, daha genişte popover; karttaki pencere seçicisinden "Dar" ile "Geniş" arasında geç. Hiçbirinin üstünde başlık yoktur. Hızlı menü, başlangıç ve bitiş üçü de seçilen biçimde açılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
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
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.date.elasticdatepicker.PantrixQuickRange
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var presentation by remember { mutableStateOf(DatePickerPresentation.Sheet) }
val today = PantrixQuickRange.commonlyUsed(PantrixTheme.strings).first().range
var range by remember { mutableStateOf(today) }
// Kartın penceresi örnek kadar uzundur: dar bir pencerede açılan sheet'e yer kalsın diye örnek uzun tutulur.
Column(
    modifier = Modifier.fillMaxWidth().height(480.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(DatePickerPresentation.Popover, "Popover", tagKey = "popover"),
            SegmentOption(DatePickerPresentation.Sheet, "Sheet", tagKey = "sheet"),
            SegmentOption(DatePickerPresentation.Dialog, "Dialog", tagKey = "dialog"),
            SegmentOption(DatePickerPresentation.Adaptive, "Uyarlanır", tagKey = "adaptive")
        ),
        selected = presentation,
        onSelect = { presentation = it },
        fullWidth = false,
        tagKey = "presentation"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        presentation = presentation,
        tagKey = "presentation"
    )
}
```

### Hızlı menünün kendi aralıkları

Hızlı menünün aralıkları uygulamanındır: burada Elastic UI'ın sekizi yerine son 15 dakikadan son bir yıla yedi aralık. "Son kullanılanlar"ı açıp kapatmak listeyi gösterir ya da gizler; adı olan bir aralık alanda adıyla durur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.date.elasticdatepicker.PantrixQuickRange
import com.pantrixui.components.date.elasticdatepicker.rememberRecentRanges
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

val ranges = remember {
    listOf(
        PantrixQuickRange("Son 15 dakika", last(15, PantrixTimeUnit.Minutes)),
        PantrixQuickRange("Son 1 saat", last(1, PantrixTimeUnit.Hours)),
        PantrixQuickRange("Son 24 saat", last(24, PantrixTimeUnit.Hours)),
        PantrixQuickRange("Son 7 gün", last(7, PantrixTimeUnit.Days)),
        PantrixQuickRange("Son 30 gün", last(30, PantrixTimeUnit.Days)),
        PantrixQuickRange("Son 90 gün", last(90, PantrixTimeUnit.Days)),
        PantrixQuickRange("Son 1 yıl", last(1, PantrixTimeUnit.Years))
    )
}
var range by remember { mutableStateOf(ranges[4].range) }
var showRecent by remember { mutableStateOf(true) }
val recent = rememberRecentRanges(max = 5)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = showRecent,
        onCheckedChange = { showRecent = it },
        label = "Son kullanılanlar",
        tagKey = "show_recent"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        commonlyUsed = ranges,
        recentlyUsed = recent.takeIf { showRecent },
        tagKey = "own_ranges"
    )
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Genişlik ve boy

Seçici verilen genişliği style'ın `maxWidth`'ine kadar doldurur (varsayılan 560dp, Elastic UI'ın "restricted"ı). `maxWidth = Dp.Infinity` tam genişlik verir; dar bir yerde yandaki sözlü düğme yalnız simgesine iner; `height` ile alan sıkışık olur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerStyle
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(SINCE_YESTERDAY) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixText(text = "Varsayılan (560dp'ye kadar)", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(range = range, onRangeChange = { range = it }, tagKey = "restricted")
    PantrixText(text = "Tam genişlik", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        style = ElasticDatePickerStyle(maxWidth = Dp.Infinity),
        tagKey = "full"
    )
    PantrixText(text = "Dar bir yerde (320dp)", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        modifier = Modifier.width(NARROW_WIDTH),
        tagKey = "narrow"
    )
    PantrixText(text = "Sıkışık (32dp)", style = PantrixTheme.typography.footnote)
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        style = ElasticDatePickerStyle(height = COMPRESSED_HEIGHT),
        tagKey = "compressed"
    )
}

private val SINCE_YESTERDAY = PantrixTimeRange(
    PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
    PantrixTimePoint.Now
)

private val NARROW_WIDTH = 320.dp

private val COMPRESSED_HEIGHT = 32.dp
```

### Yükleniyor ve kapalı

Bir yükleme ve seçim almayan bir seçici. Yüklenirken yandaki düğme döner ve basılmaz; kapalı bir seçici soluk çizilir ve hiçbir panel açmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(LAST_HOUR) }
var loading by remember { mutableStateOf(true) }
var enabled by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = loading,
        onCheckedChange = { loading = it },
        label = "Yükleniyor",
        tagKey = "loading"
    )
    PantrixSwitchButton(
        checked = enabled,
        onCheckedChange = { enabled = it },
        label = "Etkin",
        tagKey = "enabled"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        loading = loading,
        enabled = enabled,
        tagKey = "states"
    )
}

private val LAST_HOUR = last(1, PantrixTimeUnit.Hours)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Seçilebilen günler

Takvim yalnızca bu ayın günlerini sunar (`minDate` ve `maxDate`): bir ucun Mutlak sekmesinde ayın dışındaki günler soluk ve seçilemez. Göreli bir uç sınırlardan etkilenmez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.date.rememberToday

val today = rememberToday()
val first = PantrixDate(today.year, today.month, 1)
val last = first.plusMonths(1).plusDays(-1)
var range by remember {
    mutableStateOf(PantrixTimeRange(PantrixTimePoint.Absolute(first.at(PantrixTime(0, 0))), PantrixTimePoint.Now))
}
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    minDate = first,
    maxDate = last,
    tagKey = "bounds"
)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Saat düzeni, haftanın başı ve birimler

Anların yazılışı ve okunuşu: 12 ya da 24 saat (`is24Hour`), haftanın ilk günü (`firstDayOfWeek`, `/w` yuvarlamasını da belirler) ve göreli bir ucun en iyi okunan birime konup konmaması (`roundRelativeUnits`: 90 dakika "~ 2 saat önce" ya da "90 dakika önce"). Dil, sayfanın dil düğmesinden.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var is24Hour by remember { mutableStateOf(true) }
var mondayFirst by remember { mutableStateOf(true) }
var roundUnits by remember { mutableStateOf(true) }
var range by remember { mutableStateOf(NINETY_TO_THIRTY_AGO) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = is24Hour, onCheckedChange = { is24Hour = it }, label = "24 saat", tagKey = "clock")
    PantrixSwitchButton(
        checked = mondayFirst,
        onCheckedChange = { mondayFirst = it },
        label = "Hafta pazartesi başlar",
        tagKey = "monday"
    )
    PantrixSwitchButton(
        checked = roundUnits,
        onCheckedChange = { roundUnits = it },
        label = "Birimleri yuvarla",
        tagKey = "round"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        roundRelativeUnits = roundUnits,
        firstDayOfWeek = if (mondayFirst) 1 else SUNDAY,
        is24Hour = is24Hour,
        tagKey = "clock"
    )
}

private val NINETY_TO_THIRTY_AGO = PantrixTimeRange(
    PantrixTimePoint.Relative(-90, PantrixTimeUnit.Minutes),
    PantrixTimePoint.Relative(-30, PantrixTimeUnit.Minutes)
)

private const val SUNDAY = 7
```

### Adresteki tarih matematiği

Aralık bir adreste tarih matematiği olarak durur: `from` ve `to` her seçimde yeniden yazılır. Alanlara bir uç yazılıp Uygula'ya basılınca aralık oradan okunur; okunamayan bir uç alanı hatalı çizer.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(SINCE_YESTERDAY) }
val written = range.toDateMath()
var from by remember(written) { mutableStateOf(written.first) }
var to by remember(written) { mutableStateOf(written.second) }
val start = PantrixTimePoint.parseDateMath(from)
val end = PantrixTimePoint.parseDateMath(to)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(range = range, onRangeChange = { range = it }, tagKey = "url")
    PantrixText(text = "?from=${written.first}&to=${written.second}", style = PantrixTheme.typography.footnote)
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.Bottom
    ) {
        PantrixTextField(
            value = from,
            onValueChange = { from = it },
            modifier = Modifier.weight(1f),
            label = "from",
            error = start == null,
            showCharacterCount = false,
            tagKey = "from"
        )
        PantrixTextField(
            value = to,
            onValueChange = { to = it },
            modifier = Modifier.weight(1f),
            label = "to",
            error = end == null,
            showCharacterCount = false,
            tagKey = "to"
        )
    }
    PantrixButton(
        text = "Uygula",
        onClick = { if (start != null && end != null) range = PantrixTimeRange(start, end) },
        variant = ButtonVariant.Outline,
        enabled = start != null && end != null,
        tagKey = "read"
    )
}

private val SINCE_YESTERDAY = PantrixTimeRange(
    PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
    PantrixTimePoint.Now
)
```

### Kendi renkleri

Alanın kendi renkleri: zemin, kenar, sözler ve ikonlar, açık ucun kenarı, bekleyen düzenlemenin ve sırası bozuk uçların renkleri. Verilmeyen her renk temanınkidir. Bir ucu değiştirip bekleyen renge bakın.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerColors
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(LAST_QUARTER) }
val colors = PantrixTheme.colors
PantrixElasticDatePicker(
    range = range,
    onRangeChange = { range = it },
    colors = ElasticDatePickerColors(
        container = colors.neutral.container,
        border = colors.neutral.color,
        active = colors.warning.color,
        pendingContainer = colors.info.container,
        pendingContent = colors.info.onContainer
    ),
    tagKey = "colors"
)

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Otomatik yenileme

Pano kendini her on saniyede yeniler: alanın sonunda ne sıklıkla olduğu kısaca yazar, ona basmak hızlı menüyü açar. Menünün "Yenileme aralığı" bölümü onu açar, kapatır ve sıklığını değiştirir; beş saniyeden kısası alınmaz (`minAutoRefresh`). Her turda `onRefresh` çalışır ve bir sonraki tur onun bitmesini bekler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixAutoRefresh
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration.Companion.seconds

var range by remember { mutableStateOf(LAST_QUARTER) }
var refresh by remember { mutableStateOf(PantrixAutoRefresh(every = 10, paused = false)) }
var count by remember { mutableStateOf(0) }
val report = LocalExampleEvents.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        onRefresh = {
            count++
            report("Yenilendi")
        },
        tagKey = "auto_refresh",
        autoRefresh = refresh,
        onAutoRefreshChange = {
            refresh = it
            report(if (it.paused) "Otomatik yenileme durdu" else "Otomatik yenileme değişti")
        },
        minAutoRefresh = 5.seconds
    )
    PantrixText(text = "Yenileme sayısı: $count", style = PantrixTheme.typography.footnote)
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Yalnız otomatik yenileme

Zaman verisi olmayan bir sayfa için yalnız otomatik yenileme (`layout = AutoRefreshOnly`): alan "Otomatik yenileme" ve ne sıklıkla ya da kapalı olduğunu söyler, basınca yalnız onu ayarlayan menü açılır. Sıklık burada dakikayla verildi (`unit = AutoRefreshUnit.Minutes`): dakikada bir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.AutoRefreshUnit
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout
import com.pantrixui.components.date.elasticdatepicker.PantrixAutoRefresh
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var refresh by remember { mutableStateOf(PantrixAutoRefresh(every = 1, unit = AutoRefreshUnit.Minutes)) }
var count by remember { mutableStateOf(0) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = LAST_QUARTER,
        onRangeChange = { count++ },
        tagKey = "auto_refresh_only",
        autoRefresh = refresh,
        onAutoRefreshChange = { refresh = it },
        layout = ElasticDatePickerLayout.AutoRefreshOnly
    )
    PantrixText(text = "Yenileme sayısı: $count", style = PantrixTheme.typography.footnote)
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Yalnız hızlı seçim

Aralığın başka bir yerde gösterildiği bir sayfa için yalnız hızlı menünün düğmesi ve yanındaki düğme (`layout = QuickSelectOnly`). Seçilen aralık altta yazar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_QUARTER) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "quick_select_only",
        layout = ElasticDatePickerLayout.QuickSelectOnly
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "Son, başlangıçtan önce",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Zaman penceresi düğmeleri

Alanın yanında Elastic UI'ın zaman penceresi düğmeleri: ‹ ve › aralığı kendi uzunluğu kadar kaydırır, uzaklaştırma onu uzunluğunun `zoomFactor` kadarıyla genişletir, yakınlaştırma aynı kadar daraltır; yakınlaştırma istenmedikçe yoktur. Verdikleri aralık anlardan oluşur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticTimeWindowButtons
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_HOUR) }
var zoomIn by remember { mutableStateOf(false) }
var factor by remember { mutableStateOf(HALF) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = zoomIn, onCheckedChange = { zoomIn = it }, label = "Yakınlaştır", tagKey = "zoom_in")
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(HALF, "Yarısı (0.5)", tagKey = "half"),
            SegmentOption(QUARTER, "Çeyreği (0.25)", tagKey = "quarter")
        ),
        selected = factor,
        onSelect = { factor = it },
        fullWidth = false,
        tagKey = "zoom_factor"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "time_window",
        timeWindowButtons = ElasticTimeWindowButtons(zoomIn = zoomIn, zoomFactor = factor)
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "Son, başlangıçtan önce",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val LAST_HOUR = last(1, PantrixTimeUnit.Hours)

private const val HALF = 0.5

private const val QUARTER = 0.25

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### Hızlı menünün kendi panelleri ve sırası

Hızlı menüde uygulamanın kendi paneli (`customQuickPanels`), varsayılan olarak son kullanılanlardan sonra. "Kendi sıram" menüyü `quickMenu` ile kurar: önce kayıtlı aralıklar, sonra hızlı seçim; adıyla sunulan aralıklar yok. Menünün parçaları `ElasticQuickMenuScope`'tadır: `quickMenu` o kapsamda çağrılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.ElasticQuickMenuScope
import com.pantrixui.components.date.elasticdatepicker.ElasticQuickPanel
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.PantrixTime
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Instant

var range by remember { mutableStateOf(LAST_QUARTER) }
var own by remember { mutableStateOf(false) }
val saved = remember {
    listOf(
        "Gece vardiyası" to PantrixTimeRange(
            PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
            PantrixTimePoint.Relative(-16, PantrixTimeUnit.Hours)
        ),
        "Son dağıtımdan beri" to last(3, PantrixTimeUnit.Hours)
    )
}
val panel = ElasticQuickPanel("Kayıtlı aralıklar") {
    Column {
        saved.forEachIndexed { index, (name, kept) ->
            PantrixLink(text = name, onClick = { range = kept }, tagKey = "saved_$index")
        }
    }
}
val ownMenu: @Composable ElasticQuickMenuScope.() -> Unit = {
    CustomPanels()
    QuickSelect()
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "Elastic UI'ın sırası", tagKey = "elastic"),
            SegmentOption(true, "Kendi sıram", tagKey = "own")
        ),
        selected = own,
        onSelect = { own = it },
        fullWidth = false,
        tagKey = "order"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "quick_panels",
        customQuickPanels = listOf(panel),
        quickMenu = if (own) ownMenu else null
    )
    Resolved(range)
}

@Composable
private fun Resolved(range: PantrixTimeRange) {
    val read = range.resolve()
    PantrixText(
        text = read?.let { "${moment(it.start)} – ${moment(it.endInclusive)}" } ?: "Son, başlangıçtan önce",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

@Composable
private fun moment(at: Instant): String {
    val strings = PantrixTheme.strings
    val day = PantrixDate.of(at)
    val time = PantrixTime.of(at)
    return "${strings.date(day.day, day.month, day.year)} ${strings.clock(time.hour, time.minute, time.second)}"
}
```

### Saat dilimi

Anlar seçilen saat diliminin farkıyla okunur ve yazılır (`utcOffset`); uçların panelleri dilimi adıyla ve UTC'den farkıyla söyler (`timeZoneName`). Ad yalnızca söyler, bir şey değiştirmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours

var range by remember { mutableStateOf(SINCE_YESTERDAY) }
var zone by remember { mutableStateOf(ZONES.first()) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = ZONES.mapIndexed { index, it -> SegmentOption(it, it.first, tagKey = "zone_$index") },
        selected = zone,
        onSelect = { zone = it },
        fullWidth = false,
        tagKey = "zone"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        tagKey = "time_zone",
        timeZoneName = zone.first,
        utcOffset = { zone.second }
    )
}

private val SINCE_YESTERDAY = PantrixTimeRange(
    PantrixTimePoint.Relative(-1, PantrixTimeUnit.Days, roundTo = PantrixTimeUnit.Days),
    PantrixTimePoint.Now
)

private val ZONES = listOf("Europe/Istanbul" to 3.hours, "Asia/Tokyo" to 9.hours, "UTC" to Duration.ZERO)
```

### Kapalı ve kendi yazısı

Seçim almayan bir seçici aralığı yerine kendi yazısını gösterebilir (`disabledText`), Elastic UI'ın `isDisabled.display`'i gibi: burada "Tüm zamanlar".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var words by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = words, onCheckedChange = { words = it }, label = "Kendi yazısı", tagKey = "words")
    PantrixElasticDatePicker(
        range = LAST_QUARTER,
        onRangeChange = {},
        enabled = false,
        tagKey = "disabled_text",
        disabledText = if (words) "Tüm zamanlar" else null
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

### KQL deseni

Elastic UI'ın KQL deseni: bir arama alanının yanında seçici. Arama alanı odaktayken seçici hızlı menünün düğmesine küçülür (`layout = QuickSelectOnly`) ve yer sorguya kalır; odak gidince aralık geri gelir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout
import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerUpdateButton
import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.date.PantrixTimePoint
import com.pantrixui.foundation.date.PantrixTimeRange
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.theme.PantrixTheme

var range by remember { mutableStateOf(LAST_QUARTER) }
var query by remember { mutableStateOf("") }
var searching by remember { mutableStateOf(false) }
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixTextField(
        value = query,
        onValueChange = { query = it },
        modifier = Modifier.weight(1f).onFocusChanged { searching = it.hasFocus },
        placeholder = "KQL ile ara",
        showCharacterCount = false,
        contentDescription = "Arama sorgusu",
        tagKey = "query"
    )
    PantrixElasticDatePicker(
        range = range,
        onRangeChange = { range = it },
        modifier = if (searching) Modifier else Modifier.weight(PICKER_SHARE),
        updateButton = ElasticDatePickerUpdateButton.Icon,
        tagKey = "query_range",
        layout = if (searching) ElasticDatePickerLayout.QuickSelectOnly else ElasticDatePickerLayout.Full
    )
}

private val LAST_QUARTER = last(15, PantrixTimeUnit.Minutes)

private const val PICKER_SHARE = 1.4f

private fun last(
    amount: Int,
    unit: PantrixTimeUnit
): PantrixTimeRange = PantrixTimeRange(PantrixTimePoint.Relative(-amount, unit), PantrixTimePoint.Now)
```

## API

### PantrixElasticDatePicker

`import com.pantrixui.components.date.elasticdatepicker.PantrixElasticDatePicker`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixElasticDatePicker(
    range: PantrixTimeRange,
    onRangeChange: (PantrixTimeRange) -> Unit,
    modifier: Modifier = Modifier,
    commonlyUsed: List<PantrixQuickRange> = PantrixQuickRange.commonlyUsed(PantrixTheme.strings),
    recentlyUsed: PantrixRecentRanges? = null,
    updateButton: ElasticDatePickerUpdateButton = ElasticDatePickerUpdateButton.Text,
    presentation: DatePickerPresentation = DatePickerPresentation.Adaptive,
    loading: Boolean = false,
    enabled: Boolean = true,
    minDate: PantrixDate? = null,
    maxDate: PantrixDate? = null,
    onRefresh: (suspend () -> Unit)? = null,
    roundRelativeUnits: Boolean = true,
    firstDayOfWeek: Int? = null,
    is24Hour: Boolean = true,
    style: ElasticDatePickerStyle? = null,
    colors: ElasticDatePickerColors? = null,
    tagKey: String? = null,
    autoRefresh: PantrixAutoRefresh? = null,
    onAutoRefreshChange: ((PantrixAutoRefresh) -> Unit)? = null,
    minAutoRefresh: Duration = Duration.ZERO,
    layout: ElasticDatePickerLayout = ElasticDatePickerLayout.Full,
    timeWindowButtons: ElasticTimeWindowButtons? = null,
    customQuickPanels: List<ElasticQuickPanel> = emptyList(),
    quickMenu: (@Composable ElasticQuickMenuScope.() -> Unit)? = null,
    timeZoneName: String? = null,
    utcOffset: ((Instant) -> Duration)? = null,
    disabledText: String? = null
)
```

Saatle birlikte kayabilen bir zaman aralığı; bir pano onunla süzülür: "son 15 dakika" bir sonraki yenilemede yine son 15 dakikadır. Elastic UI'ın `EuiSuperDatePicker`'ı, Pantrix üzerinde yeniden.

Bir alan aralığı tutar, yanındaki düğme onu yeniler ya da bir düzenlemesini alır. Her parça bir panel açar; varsayılan bir popover, `presentation` isterse bir sheet ya da bir dialog, her platformda aynı:

- **Hızlı menünün düğmesi**, alanın başındaki takvim: bir birimin son ya da sonraki miktarını, aralığı kendi uzunluğu kadar kaydıran ‹ ve ›'yi, `commonlyUsed`'ın adıyla sunduğu aralıkları ve `recentlyUsed`'ın tuttuklarını açar. Oradaki seçim hemen verilir.

- **Aralığın adı**, "Son 15 dakika" ya da "Bugün", aralığın bir adı olduğu sürece alanda durur. Ona basmak iki ucu gösterir, başlangıç → bitiş, ve başlangıcın panelini açar.

- **Bir uç** sekmelerini açar: takvimde bir an, yarım saatlik saatler ve yazılabilen anla; şimdiden bir süre, düştüğü an ve onu yuvarlayan bir anahtarla; ya da şimdinin kendisi. Bir sekmeye geçmek ucu o sekmenin gösterdiğine çevirir. Bir düzenleme bekler: alan başarı renginde boyanır, sonunda bir işaret çıkar ve yanındaki düğme Güncelle der; Güncelle aralığı verir. Başlangıçtan önceki bir son alanı tehlike renginde boyar ve Güncelle hiçbir şey almaz. `updateButton` `None` ise her düzenleme hemen verilir. Takvimin ve göreli sekmenin anı gösteren alanının sonundaki Uygula düzenlemeyi alır ve paneli kapatır; şimdi sekmesinin düğmesi ucu şimdi yapar ve aynısını yapar.

- **Yenile**, bir düzenleme beklemezken aralığı yeniden okur: verildiyse `onRefresh`, verilmediyse aynı aralıkla `onRangeChange`.

Açık bir popover'ın dışına basış, Elastic UI'daki gibi altındakine de gider: öteki uca bir basış o ucun panelini açar, Güncelle'ye bir basış düzenlemeyi alır, açık ucun düğmesine bir basış panelini kapatır. Bir sheet ve bir dialog bir scrim'in üstünde durur; ona basmak yalnızca onları kapatır.

Paneller Elastic UI'ınkiler gibi sıkıdır: bir ucun popover'ı takvimi ve yanındaki saatler kadar geniştir, hızlı menü 400dp'dir; içlerindeki metin alanları, select'ler, sekmeler ve düğmeler bir formunkinden 8 alçaktır: Android'de 40dp, iOS'ta 36pt, masaüstünde ve web'de 32dp.

Aralık çağıranındır: yeni bir `range` bekleyen düzenlemeyi bırakır. Alanın yeri sözlerine ve düğmesine yetmediğinde yanındaki düğme yalnız simgesidir.

```kotlin
val lastQuarterHour = PantrixTimeRange(PantrixTimePoint.Relative(-15, PantrixTimeUnit.Minutes), PantrixTimePoint.Now)
var range by remember { mutableStateOf(lastQuarterHour) }
PantrixElasticDatePicker(range = range, onRangeChange = { range = it }, recentlyUsed = rememberRecentRanges())
```

Parametreler:

- `range: PantrixTimeRange`: gösterilen aralık. Uçları şimdiye göre olabilir.
- `onRangeChange: (PantrixTimeRange) -> Unit`: okurun hızlı menüden seçtiği ya da bir düzenlemeden sonra güncellediği aralığı, `onRefresh` yokken bir yenilemede aynı aralığı alır.
- `modifier: Modifier`: seçicinin modifier'ı. Seçici verilen genişliği style'ın `maxWidth`'ine kadar doldurur.
- `commonlyUsed: List<PantrixQuickRange>`: hızlı menünün adıyla sunduğu aralıklar: varsayılan Elastic UI'ın sekizi, temanın dilinde. Gösterilen aralık bunlardan biriyse adıyla anılır.
- `recentlyUsed: PantrixRecentRanges?`: okurun son seçtiği aralıklar; hızlı menü onları listeler ve okurun uyguladığı her aralık onlara kaydedilir; hiçbiri için null. `rememberRecentRanges()` onları bir yapılandırma değişikliğinde korur.
- `updateButton: ElasticDatePickerUpdateButton`: alanın yanındaki düğme: sözü ve simgesi, yalnız simgesi ya da hiç; o zaman her düzenleme hemen verilir.
- `presentation: DatePickerPresentation`: panellerin neyde açıldığı: varsayılan dar bir pencerede bir sheet, daha geniş pencerede basılan parçanın yanında bir popover, bir panel açılırken seçilir; ya da her zaman bir popover, bir sheet ya da bir dialog. Her platformda aynı.
- `loading: Boolean`: aralığın süzdüğünün yüklenip yüklenmediği: alanın yanındaki düğme döner ve basılmaz.
- `enabled: Boolean`: seçicinin bir seçim alıp almadığı. Almayan soluk çizilir ve hiçbir şey açmaz.
- `minDate: PantrixDate?`: bir ucun takviminin sunduğu ilk gün; o kadar erken bir sınır yoksa null.
- `maxDate: PantrixDate?`: sunduğu son gün; o kadar geç bir sınır yoksa null.
- `onRefresh: (suspend () -> Unit)?`: bir düzenleme beklemezken Yenile'nin yaptığı; bu sürerken düğme döner; aynı aralığı `onRangeChange`'e vermek için null. Onun fırlattığı bir hata dönmeyi durdurur ve öteye gitmez: neyin yanlış gittiğini söylemek, `autoRefresh`'in bir turu başarısız olduğunda olduğu gibi, çağırana kalır.
- `roundRelativeUnits: Boolean`: şimdiden bir süre olan bir ucun en iyi okunan birime konup konmadığı, 90 dakika için "~ 2 saat önce", ya da kendi birimini koruyup korumadığı.
- `firstDayOfWeek: Int?`: takvimin haftalarının başladığı ve bir haftanın yuvarlandığı gün; günleri ISO 8601 sayar: 1 pazartesidir. Null dilinkidir, `PantrixLocale.firstDayOfWeek`.
- `is24Hour: Boolean`: bir anın 24 saatlik bir saatle mi, `22:00`, yoksa 12 saatlikle mi, `10:00 PM`, yazılıp seçildiği.
- `style: ElasticDatePickerStyle?`: alanın bu çağrıya ait stili: kapsayan her stilin üstünde, yoğunluğun altında.
- `colors: ElasticDatePickerColors?`: alanın kendi renkleri: verdikleri, kalanı için temanınkiler.
- `tagKey: String?`: seçicinin otomasyon anahtarı: `ElasticDatePicker_<tagKey>` olur, parçaları `.Button_quick_menu`, `.Button_name`, `.Button_start`, `.Button_end`, `.Button_auto_refresh`, zaman penceresi düğmeleri `.Button_window_previous`, `.Button_window_zoom_in`, `.Button_window_zoom_out` ve `.Button_window_next`, alanın yanındaki düğme `Button_<tagKey>_update`.
- `autoRefresh: PantrixAutoRefresh?`: aralığın kendiliğinden ne sıklıkla yeniden okunduğu; hiç için null. Duraklatılmamışken alan ne sıklıkla olduğunu kısaca yazarak biter ve her turda Yenile yapılır: bir sonraki tur sayılmadan önce bitmesi beklenen `onRefresh`, o yoksa aynı aralıkla `onRangeChange`. Başarısız olan bir `onRefresh` onu duraklatır ve bunu `onAutoRefreshChange` ile söyler.
- `onAutoRefreshChange: ((PantrixAutoRefresh) -> Unit)?`: okur hızlı menüde ayarladıkça otomatik yenilemeyi alır; menüde bunun için kendi bölümü olur; böyle bir bölüm olmaması için null.
- `minAutoRefresh: Duration`: okurun ayarlayabileceği en kısa otomatik yenileme: daha kısası miktarını yanlış çizer.
- `layout: ElasticDatePickerLayout`: alanın ne gösterdiği: aralığı, yalnız hızlı menünün düğmesini ya da yalnız otomatik yenilemeyi.
- `timeWindowButtons: ElasticTimeWindowButtons?`: Elastic UI'ın alanın yanındaki, aralığı uzunluğu kadar kaydıran ve yakınlaştırıp uzaklaştıran düğmeleri; hiçbiri için null.
- `customQuickPanels: List<ElasticQuickPanel>`: hızlı menüde çağıranın kendi panelleri, son kullanılan aralıklardan sonra.
- `quickMenu: (@Composable ElasticQuickMenuScope.() -> Unit)?`: hızlı menünün parçaları çağıranın kendi sırasında, bazıları dışarıda bırakılmış ya da aralarına kendi panelleri konmuş; Elastic UI'ın sırası için null.
- `timeZoneName: String?`: anların bulunduğu saat dilimi; uçların panellerinde UTC'den farkıyla adlandırılır: "Saat dilimi: Europe/Istanbul (UTC+03:00)". Yalnızca adlandırır, bir şey değiştirmez; böyle bir satır olmaması için null.
- `utcOffset: ((Instant) -> Duration)?`: anların bir anda okunup yazıldığı UTC farkı; ekranın saatininki (`LocalPantrixClock`) için null, bir test ya da önizleme başkasını vermedikçe cihazınki.
- `disabledText: String?`: seçim almayan bir seçicinin aralığının yerinde gösterdiği yazı; aralık için null.

### ElasticDatePickerUpdateButton

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerUpdateButton`, `com.pantrixui:components` içinden

```kotlin
enum class ElasticDatePickerUpdateButton
```

Bir elastic date picker'ın alanının yanındaki düğme.

Değerleri:

- `Text`: Yenile, bir düzenleme beklerken Güncelle; sözle ve bir simgeyle; alan darken yalnız simgesi.
- `Icon`: Yalnız simge, ekran okuyucu için adlandırılmış.
- `None`: Düğme yok: her düzenleme hemen verilir.

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

### ElasticDatePickerStyle

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerStyle`, `com.pantrixui:components` içinden

```kotlin
class ElasticDatePickerStyle(
    public val height: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified
) : PantrixStyle<ElasticDatePickerStyle>
```

`PantrixElasticDatePicker`'ın alanı: ne kadar yüksek olduğu, köşeleri, içindeki boşluk, yanındaki düğmeyle arası ve ne kadar genişlediği.

Alan her platformda bir metin alanı kadar yüksektir ve onun köşelerine sahiptir: Android'de 48dp, iOS'ta 44pt, masaüstünde ve web'de 40dp; çünkü bir formun alanlarının ve bir ekranın arama kutusunun yanında durur. Verilen genişliği `maxWidth`'e kadar doldurur; bu, an olarak yazılmış iki uca yetecek yerdir: Elastic UI'ın "restricted" genişliği. Açtıkları bir popover'ın, bir sheet'in, bir takvimin ve sekmelerin stilleriyle çizilir.

Yükseklik, boşluk ve ara, bir metin alanınınkiler gibi yoğunluğa uyar; köşeler ve genişlik uymaz.

Parametreler:

- `height: Dp`: Alanın yüksekliği.
- `shape: ShapeSpec`: Alanın köşeleri.
- `padding: Dp`: Alanın kenarı ile içindekiler arasındaki boşluk, iki uçta da.
- `gap: Dp`: Alan ile yanındaki düğme arasındaki ve alanın içindeki parçalar arasındaki ara.
- `maxWidth: Dp`: Alanın ve düğmesinin en geniş hâli; verildiği kadar geniş olması için `Dp.Infinity`.

### ElasticDatePickerColors

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerColors`, `com.pantrixui:components` içinden

```kotlin
data class ElasticDatePickerColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val active: Color = Color.Unspecified,
    public val pendingContainer: Color = Color.Unspecified,
    public val pendingContent: Color = Color.Unspecified,
    public val invalidContainer: Color = Color.Unspecified,
    public val invalidContent: Color = Color.Unspecified,
    public val disabled: Color = Color.Unspecified
)
```

Bir `PantrixElasticDatePicker`'ın alanının temanın renkleri yerine boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır. Alanın açtıkları bir popover'ın, bir sheet'in, bir takvimin ve sekmelerin renkleriyle boyanır.

Parametreler:

- `container: Color`: Alanın zemini. Bir metin alanınınki gibi temanın `surface`'ı.
- `border: Color`: Alanın kenarı ve hızlı menünün düğmesi ile aralık arasındaki çizgi. Temanın `border`'ı.
- `content: Color`: Aralığın ve uçlarının sözleri. Temanın `textPrimary`'si.
- `icon: Color`: Alanın simgeleri: hızlı menünün takvimi ve uçlar arasındaki ok. Temanın `textSecondary`'si.
- `active: Color`: Paneli açık olan ucun çevresine çizilen kenar. Birincil rolün `color`'ı.
- `pendingContainer: Color`: Bir düzenleme Güncelle'yi beklerken alanın zemini. Başarı rolünün `container`'ı.
- `pendingContent: Color`: Üstündeki sözler, ok ve işaret. Başarı rolünün `onContainer`'ı.
- `invalidContainer: Color`: Sonu başlangıcından önce geldiğinde alanın zemini. Tehlike rolünün `container`'ı.
- `invalidContent: Color`: Üstündeki sözler, ok ve işaret. Tehlike rolünün `onContainer`'ı.
- `disabled: Color`: Seçim almayan bir alanın sözleri ve simgeleri. Temanın `textDisabled`'ı.

### PantrixQuickRange

`import com.pantrixui.components.date.elasticdatepicker.PantrixQuickRange`, `com.pantrixui:components` içinden

```kotlin
class PantrixQuickRange(
    public val label: String,
    public val range: PantrixTimeRange
)
```

Bir elastic date picker'ın hızlı menüsünün adıyla sunduğu bir aralık: "Bugün", "Bu hafta". Seçicinin gösterdiği aralık bunlardan biriyse o da adıyla anılır.

Parametreler:

- `label: String`: Aralığın adı, okurun dilinde.
- `range: PantrixTimeRange`: Aralık.

Tipin kendisinde:

- `PantrixQuickRange.commonlyUsed(strings: PantrixStrings): List<PantrixQuickRange>`: Elastic UI'ın sekizi, `strings`'in dilinde adlandırılmış: bugün, bu hafta, bu ay ve bu yıl, her birinin başından sonuna; dün; ve haftanın, ayın ve yılın başından şimdiye.

### PantrixRecentRanges

`import com.pantrixui.components.date.elasticdatepicker.PantrixRecentRanges`, `com.pantrixui:components` içinden

```kotlin
class PantrixRecentRanges(
    initial: List<PantrixTimeRange> = emptyList(),
    public val max: Int = 10
)
```

Okurun son seçtiği aralıklar, en yenisi önce, en çok `max` tane: bunları alan bir elastic date picker'ın hızlı menüsünde "Son kullanılanlar" altında listelediği ve okurun uyguladığı her aralığı kaydettiği. Uygulamanın kendi koyduğu bir aralık kaydedilmez. `rememberRecentRanges` birini bir yapılandırma değişikliğinde korur.

Parametreler:

- `initial: List<PantrixTimeRange>`: başlangıçtaki aralıklar, en yenisi başta.
- `max: Int`

Üyeleri:

- `ranges: List<PantrixTimeRange>`: Aralıklar, en yenisi önce.
- `fun record(range: PantrixTimeRange)`: `range`'i başa koyar; daha önce durduğu yerden ve `max`'ı aşan en eskiyi düşürür.
- `fun clear()`: Bütün aralıkları unutur.

### PantrixAutoRefresh

`import com.pantrixui.components.date.elasticdatepicker.PantrixAutoRefresh`, `com.pantrixui:components` içinden

```kotlin
data class PantrixAutoRefresh(
    public val every: Int,
    public val unit: AutoRefreshUnit = AutoRefreshUnit.Seconds,
    public val paused: Boolean = true
)
```

Bir elastic date picker'ın aralığını kendiliğinden ne sıklıkla yeniden okuduğu, Elastic UI'ın yenileme aralığı gibi: `paused` değilken her `every` `unit`'te bir. Seçici zamanı sayar ve her turda Yenile'nin yaptığını yapar: `onRefresh`, bir sonraki tur sayılmadan önce bitmesi beklenir; o yoksa aynı aralığı verir.

Parametreler:

- `every: Int`: iki yenileme arasında kaç `unit` olduğu; en az bir.
- `unit: AutoRefreshUnit`: `every`'nin saydığı.
- `paused: Boolean`: bekleyip beklemediği: beklerken seçici hiçbir şey saymaz.

Üyeleri:

- `interval: Duration`: Seçicinin iki yenileme arasında beklediği süre.

### AutoRefreshUnit

`import com.pantrixui.components.date.elasticdatepicker.AutoRefreshUnit`, `com.pantrixui:components` içinden

```kotlin
enum class AutoRefreshUnit
```

Otomatik yenilemenin sayıldığı birim.

Değerleri:

- `Seconds`: Saniye.
- `Minutes`: Dakika.
- `Hours`: Saat.

### ElasticDatePickerLayout

`import com.pantrixui.components.date.elasticdatepicker.ElasticDatePickerLayout`, `com.pantrixui:components` içinden

```kotlin
enum class ElasticDatePickerLayout
```

Bir elastic date picker'ın alanının ne gösterdiği, Elastic UI'ın yalnız hızlı seçim ve yalnız otomatik yenileme hâllerine göre.

Değerleri:

- `Full`: Hızlı menünün düğmesi, aralık ve yanındaki düğme.
- `QuickSelectOnly`: Yalnız hızlı menünün düğmesi ve yanındaki düğme: aralık başka bir yerde gösterilir.
- `AutoRefreshOnly`: Yalnız otomatik yenileme, "Otomatik yenileme" ve ne sıklıkla ya da kapalı; onu ayarlayan bir menü açar.

### ElasticTimeWindowButtons

`import com.pantrixui.components.date.elasticdatepicker.ElasticTimeWindowButtons`, `com.pantrixui:components` içinden

```kotlin
data class ElasticTimeWindowButtons(
    public val shift: Boolean = true,
    public val zoomOut: Boolean = true,
    public val zoomIn: Boolean = false,
    public val zoomFactor: Double = 0.5
)
```

Elastic UI'ın zaman penceresi düğmeleri, bir seçicinin alanının ve düğmesinin yanında: ‹ ve › aralığı kendi uzunluğu kadar geri ve ileri kaydırır, uzaklaştırma onu uzunluğunun `zoomFactor` kadarıyla genişletir, yakınlaştırma aynı kadar daraltır; her uçta yarısı kadar. Verdikleri aralık, hızlı menünün ‹ ve ›'sinin verdiği gibi anlardan oluşur.

Aralığın uzunluğu yokken ‹, › ve yakınlaştırma hiçbir şey almaz; uçları sırasızken hiçbiri. Uzunluğu olmayan bir aralık her uçta yarım saniye genişletilir.

Parametreler:

- `shift: Boolean`: ‹ ve ›'nin olup olmadığı.
- `zoomOut: Boolean`: uzaklaştırmanın olup olmadığı.
- `zoomIn: Boolean`: yakınlaştırmanın olup olmadığı: Elastic UI istenmedikçe onu koymaz.
- `zoomFactor: Double`: bir yakınlaştırmanın ya da uzaklaştırmanın aralığın uzunluğundan ne kadar ekleyip çıkardığı, her uçta yarısı.

### ElasticQuickPanel

`import com.pantrixui.components.date.elasticdatepicker.ElasticQuickPanel`, `com.pantrixui:components` içinden

```kotlin
class ElasticQuickPanel(
    public val title: String,
    public val content: @Composable () -> Unit
)
```

Bir seçicinin hızlı menüsündeki kendi paneli, Elastic UI'ın özel hızlı seçim panellerine göre: `content`'in üstünde `title`, menünün öteki parçalarıyla arasında bir çizgi.

Parametreler:

- `title: String`: panelin adı, üstünde bir başlık.
- `content: @Composable () -> Unit`: panelin tuttuğu. İçinde seçileni vermek çağırana kalır.

### ElasticQuickMenuScope

`import com.pantrixui.components.date.elasticdatepicker.ElasticQuickMenuScope`, `com.pantrixui:components` içinden

```kotlin
interface ElasticQuickMenuScope
```

Bir seçicinin hızlı menüsünün parçaları, menüyü çağıranın kendi sırasıyla kurmak için, Elastic UI'ın özel hızlı seçim çizimine göre. Her parça çağrıldığı yerde durur ve menü her ikisinin arasına bir çizgi çeker; gösterecek bir şeyi olmayan bir parça, hiç yokken son kullanılan aralıklar gibi, ne yer ne çizgi alır. Dışarıda bırakılan bir parça menüde yoktur.

Üyeleri:

- `@Composable fun QuickSelect()`: Bir birimin son ya da sonraki miktarı, aralığı uzunluğu kadar kaydıran ‹ ve › ve Uygula.
- `@Composable fun CommonlyUsed()`: Seçicinin adıyla sunduğu aralıklar, iki sütunda.
- `@Composable fun RecentlyUsed()`: Son kullanılan aralıklar, en yenisi başta, varsa.
- `@Composable fun CustomPanels()`: Seçicinin kendi panelleri, `customQuickPanels`, her biri ayrı bir parça.
- `@Composable fun AutoRefresh()`: Otomatik yenileme, seçici onun bir değişikliğini alıyorsa.
- `@Composable fun Panel(title: String, content: @Composable () -> Unit)`: Çağıranın kendi paneli: `content`'in üstünde `title`.

### PantrixTimeRange

`import com.pantrixui.foundation.date.PantrixTimeRange`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixTimeRange(
    public val start: PantrixTimePoint,
    public val end: PantrixTimePoint
)
```

Uçları saatle birlikte kayabilen bir zaman aralığı: `now-15m`'den `now`'a, ne zaman okunursa okunsun son 15 dakikadır. Uçları arasında bir sıra tutmaz, çünkü kayan bir noktanın okunana kadar sırası yoktur: bir anda sırada olup olmadıklarını `resolve` söyler.

Parametreler:

- `start: PantrixTimePoint`: Aralığın başladığı yer.
- `end: PantrixTimePoint`: Bittiği yer.

Üyeleri:

- `fun resolve(now: Instant = Clock.System.now(), firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): ClosedRange<Instant>?`: Aralığın arasında geçtiği anlar; `now` şimdi, başlangıcı aşağı, sonu yukarı yuvarlanmış, `offsetAt`'in söylediği saatte, haftaları `firstDayOfWeek`'te başlayarak; sonu başlangıcından önce düşüyorsa null.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): Pair<String, String>`: İki uç tarih matematiği olarak: bir adresin tuttuğu ve bir aralık sorgusunun `gte` ve `lte` olarak gönderdiği.

  `offsetAt`: saatin her andaki UTC farkını söyler; bir an olarak yazılan bir uç için. Varsayılanı, `systemUtcOffset`'in söylediği gibi cihazınki.

### PantrixTimePoint

`import com.pantrixui.foundation.date.PantrixTimePoint`, `com.pantrixui:foundation` içinden

```kotlin
sealed interface PantrixTimePoint
```

Saatle birlikte kayabilen bir zaman noktası: şimdi, şimdiden bir süre ya da bir an.

"Son 15 dakika" bir sonraki yenilemede yine son 15 dakikadır; bu yüzden bir ekranı süzen aralık noktalarını bu biçimde tutar ve her okunuşta `resolve` eder. Elasticsearch ve Kibana'nın yazdığı tarih matematiği onların sınırıdır: `toDateMath` bir noktayı bir adresin ya da sorgunun tuttuğu gibi yazar, `now-15m`; `parseDateMath` geri okur.

Üyeleri:

- `fun resolve(now: Instant = Clock.System.now(), asEnd: Boolean = false, firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: Bu noktanın düştüğü an; `now` şimdi, UTC'den farkını her an için `offsetAt`'in söylediği saatte: varsayılan, `systemUtcOffset`'in söylediği cihazın saati.

  Saniyeler, dakikalar ve saatler geçen zamandır; günler ve daha uzunları takvimindir, o saatte: öğleden bir gün geri öğledir. Bir birime yuvarlanan nokta birimin başındadır, bir aralığı bitiriyorsa (`asEnd`) son milisaniyesinde; bir aralık sorgusunun `gte` ve `lte`'yi okuduğu gibi: `now/d`'den `now/d`'ye bugünün tamamıdır. Bir hafta `firstDayOfWeek`'te başlar; günleri ISO 8601 sayar: 1 pazartesidir.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): String`: Bu nokta tarih matematiği olarak: `now`, `now-15m`, `now-15m/m`, `now/d`; bir an ise ISO 8601'in yazdığı gibi, `offsetAt`'in söylediği saatte, `2026-10-17T14:15:00+03:00`: varsayılan cihazınki.

Tipin kendisinde:

- `PantrixTimePoint.parseDateMath(text: String): PantrixTimePoint?`: Tarih matematiği `text`'in yazdığı nokta; bu noktaların tuttuğu bir tarih matematiği değilse null.

  - `now` ve ardından bir işlem: `now-15m` ve `now+2h`; Kibana'nın izin verdiği gibi sayı yazılmayabilir, `now-d` `now-1d`'dir; sonra bir yuvarlama: `now-1d/d`, `now/w`, Elasticsearch'ün izin verdiği gibi `/1d`.

  - Birimler `y M w d h m s`, Elasticsearch'ün yazdığı gibi saatler için `H` de. Milisaniyeler okunmaz.

  - ISO 8601'in UTC'den farkıyla ya da bir `Z` ile yazdığı bir an: `2026-10-17T14:15:00+03:00`.

  Bu noktaların tutmadığı tarih matematiği, iki işlem (`now-1d/d+8h`) ya da `||`'den önce bir tarih, null'dır.

#### PantrixTimePoint.Now

```kotlin
data object Now : PantrixTimePoint
```

Noktanın okunduğu an.

#### PantrixTimePoint.Relative

```kotlin
class Relative(
    public val amount: Int,
    public val unit: PantrixTimeUnit,
    public val roundTo: PantrixTimeUnit? = null
) : PantrixTimePoint
```

Şimdiden `amount` `unit`, sıfırdan küçükse önce; sonra `roundTo`'nun başına, nokta bir aralığı bitiriyorsa sonuna yuvarlanır: `Relative(-15, Minutes)` `now-15m`'dir, `Relative(-1, Days, roundTo = Days)` `now-1d/d`, yani dün. Miktar sıfırken birim bir şey söylemez: `Relative(0, Days, Days)` `now/d`'dir, bugün; yuvarlama da yoksa nokta şimdidir.

Parametreler:

- `amount: Int`: Şimdiden kaç birim: önceyse sıfırdan küçük.
- `unit: PantrixTimeUnit`: `amount`'un saydığı.
- `roundTo: PantrixTimeUnit?`: Noktanın yuvarlandığı birim; yuvarlama yoksa null.

#### PantrixTimePoint.Absolute

```kotlin
class Absolute(
    public val moment: Instant
) : PantrixTimePoint
```

Bir an; nerede okunursa okunsun aynıdır: başka bir saat dilimindeki okur onu kendi saatinde görür.

Parametreler:

- `moment: Instant`: An.

### PantrixTimeUnit

`import com.pantrixui.foundation.date.PantrixTimeUnit`, `com.pantrixui:foundation` içinden

```kotlin
enum class PantrixTimeUnit(
    internal val letter: Char
)
```

Zamanın sayıldığı bir birim: bir noktanın şimdiye uzaklığı ve neye yuvarlandığı.

Saniyeler, dakikalar ve saatler geçen zamandır, her gün aynı uzunlukta. Günler ve daha uzunları takvimindir, noktanın okunduğu saatte: öğleden bir gün geri öğledir, saatin ileri alındığı bir günde de; 31 Ocak'tan bir ay ötesi Şubat'ın son günüdür.

Her biri tarih matematiğinde Elasticsearch ve Kibana'nın yazdığı harfle yazılır: `s`, `m`, `h`, `d`, `w`, `M` ve `y`.

Değerleri:

- `Seconds`: Saniyeler: `s`.
- `Minutes`: Dakikalar: `m`.
- `Hours`: Saatler: `h`.
- `Days`: Takvimin günleri: `d`.
- `Weeks`: Takvimin haftaları, haftanın başladığı günden: `w`.
- `Months`: Takvimin ayları: `M`.
- `Years`: Takvimin yılları: `y`.
