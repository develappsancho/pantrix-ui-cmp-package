# Tooltip

Adını gösterdiği kontrolün yanında duran kısa etiket: yalnızca ikon gösteren bir düğmenin adı, kesilen bir etiketin tamamı. Kontrolün zaten söylediği şeyi gösterir: ekran okuyucu kontrolün kendisini okur, etiket ondan gizlidir. Bu yüzden kontrolün `contentDescription`'ı ya da metni aynı sözcükler olmalıdır; tooltip yeni bir şey söylenecek yer değildir.

Kendiliğinden çıkar ve uygulamadan hiçbir şey almaz: odak almaz, tuş almaz, kontrol çalışmaya devam eder. Adı soran uzun basış dışında hiçbir basışı kontrolden almaz.

- `PantrixTooltip` (`com.pantrixui.components.overlay.tooltip`, `com.pantrixui:components`): Bağlı olduğu kontrolü adlandıran kısa bir etiket: bir işaretçi kontrolün üstünde dururken, klavye odağı ondayken ve üstüne uzun basıştan bir sonraki basışa kadar görünür. Anahtar sözcükler: ipucu, araç ipucu, üzerine gelince yazı, bilgi ipucu, uzun basma etiketi.

## Özellikler

- **Fare.** İşaretçi kontrolün üzerinde stilin `pointerRestMillis` süresi kadar durunca çıkar, ayrılınca gider. İşaretçi etiketin üzerine geçip orada durabilir. Kontrole tıklamak etiketi kaldırır; işaretçi ayrılıp geri gelene kadar yeniden çıkmaz.
- **Klavye.** Odak kontrole klavyeyle gelince hemen çıkar, odak gidince gider. Escape kaldırır, odak kontrolde kalır.
- **Dokunma.** Kontrole uzun basınca çıkar ve bir yere basılana kadar kalır. Adı soran uzun basış kontrole basmaz; kısa dokunuş yalnızca kontrole basar ve etiket çıkarmaz.
- **Yön.** `side` etiketin kontrolün hangi yanında duracağını söyler: söylenmezse üstte. Etiket o yanda kontrole ortalanır; yer yoksa karşı yana geçer ve pencerenin kenarlarına stilin `margin`'inden fazla yaklaşmaz.
- **Durum.** Etiketin açık olup olmadığı tek bir durumdur (`state`): fare, klavye ve uzun basış onu değiştirir. Ekran da değiştirebilir: `rememberPantrixTooltipState()` ile tutar, `show()` ve `dismiss()` çağırır.
- **Kapatılabilir.** `enabled = false` etiketi kaldırır ve çıkmasını engeller: adı zaten görünen bir kontrol için.
- **Kendiliğinden kalkar.** Kontrol bir dialog'un, sheet'in ya da açık bir popover'ın altında kalınca, görünür alandan kayıp çıkınca ve pencerenin boyutu değişince etiket kaldırılır.
- **Tek etiket.** Pencerede aynı anda tek etiket durur: yenisi çıkınca öncekisi gider. Escape, odak nerede olursa olsun açık olan etiketi kaldırır ve başka bir yere gitmez.
- **Renkler ve stil.** Etiket temanın ters tonundadır: açık temada koyu, koyu temada açık. `colors` (`TooltipColors`) kendi rengini; `style` (`TooltipStyle`) köşeleri, boşlukları, en çok genişliği ve farenin bekleyişini verir.
- **Hangi kontrole.** Çapa basılan bir kontroldür, bir düğme ya da bir ikon, ya da yalnızca okunan bir metin. Kendi uzun basışı olan bir kontrol, bir metin alanı ya da seçilebilen bir metin, dokunmatik ekranda o basışı tooltip'e kaptırır.

## Kullanım

### The name of an icon button

```kotlin
PantrixTooltip(text = stringResource(Res.string.refresh), tagKey = "refresh") {
    PantrixIconButton(
        imageVector = PantrixIcons.Refresh,
        contentDescription = stringResource(Res.string.refresh),
        onClick = onRefresh,
        tagKey = "refresh"
    )
}
```

### A label too long for its column, in full

```kotlin
PantrixTooltip(text = file.name, side = PopoverSide.End, tagKey = file.id) {
    PantrixText(text = file.name, maxLines = 1)
}
```

### A hint the screen brings up itself

```kotlin
val hint = rememberPantrixTooltipState()
LaunchedEffect(firstRun) { if (firstRun) hint.show() }
PantrixTooltip(text = stringResource(Res.string.search), state = hint, tagKey = "search") {
    PantrixIconButton(
        imageVector = PantrixIcons.Search,
        contentDescription = stringResource(Res.string.search),
        onClick = onSearch,
        tagKey = "search"
    )
}
```

## Örnekler

### Araç çubuğu

En yalın hâli: `PantrixTooltip` adını gösterdiği kontrolü sarar. Yalnızca ikon gösteren dört düğmenin adını tooltip gösterir, ekran okuyucuya `contentDescription` söyler: ikisi aynı sözcüklerdir.

Fareyle bir düğmenin üzerinde dur, klavyeyle odaklan ya da parmakla uzun bas: adı çıkar. Tıklama ve kısa dokunuş düğmeye basar; adı soran uzun basış basmaz. Kartın "Son olay" satırı en son hangi düğmeye basıldığını söyler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTooltip(text = "Yenile", tagKey = "refresh") {
        PantrixIconButton(
            imageVector = PantrixIcons.Refresh,
            contentDescription = "Yenile",
            onClick = { report("Yenile düğmesine basıldı") },
            tagKey = "refresh"
        )
    }
    PantrixTooltip(text = "Ara", tagKey = "search") {
        PantrixIconButton(
            imageVector = PantrixIcons.Search,
            contentDescription = "Ara",
            onClick = { report("Ara düğmesine basıldı") },
            tagKey = "search"
        )
    }
    PantrixTooltip(text = "Yakınlaştır", tagKey = "zoom_in") {
        PantrixIconButton(
            imageVector = PantrixIcons.ZoomIn,
            contentDescription = "Yakınlaştır",
            onClick = { report("Yakınlaştır düğmesine basıldı") },
            tagKey = "zoom_in"
        )
    }
    PantrixTooltip(text = "Uzaklaştır", tagKey = "zoom_out") {
        PantrixIconButton(
            imageVector = PantrixIcons.ZoomOut,
            contentDescription = "Uzaklaştır",
            onClick = { report("Uzaklaştır düğmesine basıldı") },
            tagKey = "zoom_out"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Yön

`side` etiketin kontrolün hangi yanında duracağını söyler; etiket o yanda kontrole ortalanır. Söylenmezse üstte durur: `PopoverSide.Top`. Baş ve Son yazı yönüne göre değişir: soldan sağa bir düzende Baş soldur. İstenen yanda yer yoksa etiket karşı yana geçer.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip

var side by rememberSaveable { mutableStateOf(PopoverSide.Top) }
PantrixSegmentButton(options = SIDES, selected = side, onSelect = { side = it }, tagKey = "tooltip_side")
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
    PantrixTooltip(text = "side = ${side.name}", side = side, tagKey = "side") {
        PantrixButton(
            text = "Üzerine gel ya da uzun bas",
            onClick = {},
            variant = ButtonVariant.Outline,
            tagKey = "side_target"
        )
    }
}

private val SIDES = listOf(
    SegmentOption(value = PopoverSide.Top, label = "Üst", tagKey = "top"),
    SegmentOption(value = PopoverSide.Bottom, label = "Alt", tagKey = "bottom"),
    SegmentOption(value = PopoverSide.Start, label = "Baş", tagKey = "start"),
    SegmentOption(value = PopoverSide.End, label = "Son", tagKey = "end")
)
```

### Kesilen etiket

Sütununa sığmadığı için tek satırda kesilen bir dosya adı: tooltip adın tamamını gösterir. Etiket stilin en çok genişliğinden (`TooltipStyle.maxWidth`) geniş olmaz; uzun ad onda satır atlar.

Çapa burada basılan bir kontrol değil, yalnızca okunan bir metindir: fareyle üzerinde durunca ya da parmakla uzun basınca etiket çıkar.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip

val fileName = "2026 üçüncü çeyrek satış raporu, kuzey bölgesi, ikinci taslak ve notlar.pdf"
PantrixTooltip(text = fileName, side = PopoverSide.Bottom, tagKey = "file") {
    PantrixText(text = fileName, modifier = Modifier.width(220.dp), maxLines = 1, tagKey = "file_name")
}
```

### Ekranın gösterdiği ipucu

Etiketin açık olup olmadığı bir durumdur ve ekran onu kendisi tutabilir: `rememberPantrixTooltipState()`. `hint.show()` etiketi kimse kontrole dokunmadan çıkarır: ilk açılışta bir ipucu, az önce değişen bir kontrolün adı. `hint.dismiss()` ya da başka bir yere basmak kaldırır.

Fare, klavye ve uzun basış da aynı durumu değiştirir: `hint.visible` etiketin açık olup olmadığını her zaman doğru söyler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.components.overlay.tooltip.rememberPantrixTooltipState
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val hint = rememberPantrixTooltipState()
val report = LocalExampleEvents.current
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixTooltip(
        text = "Sık kullanılanlara ekle",
        side = PopoverSide.Bottom,
        state = hint,
        tagKey = "favourite"
    ) {
        PantrixIconButton(
            imageVector = PantrixIcons.Star,
            contentDescription = "Sık kullanılanlara ekle",
            onClick = { report("Sık kullanılanlara eklendi") },
            tagKey = "favourite"
        )
    }
    PantrixButton(text = "İpucunu göster", onClick = { hint.show() }, tagKey = "show_hint")
    PantrixButton(text = "Gizle", onClick = { hint.dismiss() }, variant = ButtonVariant.Text, tagKey = "hide_hint")
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kapatılabilir

`enabled = false` iken hiçbir şey etiketi çıkarmaz; açıkken çıkmış olan da kalkar. Adı zaten görünen bir kontrol içindir. Anahtarı aç: düğmenin tooltip'i çalışmaya başlar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip

var enabled by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixSwitchButton(
    checked = enabled,
    onCheckedChange = { enabled = it },
    label = "Bu düğmenin tooltip'i açık",
    tagKey = "tooltip_on"
)
// Tooltip düğmenin adını gösterir, yeni bir şey söylemez: ekran okuyucu düğmeyi okur, etiketi değil.
PantrixTooltip(text = "Kaydet", enabled = enabled, tagKey = "save") {
    PantrixButton(text = "Kaydet", onClick = { report("Kaydet düğmesine basıldı") }, tagKey = "save")
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kendi stili

`style` yalnızca bu tooltip'in geometrisini değiştirir: `TooltipStyle`'ın verilen alanları değişir, gerisi temanın ve platformun stilinden gelir. İlk düğmenin etiketi fare üzerine gelir gelmez çıkar: `pointerRestMillis = 0`. İkincisinin etiketi tam yuvarlak köşelidir (`ShapeRole.Full`), metnin çevresinde daha çok boşluk vardır ve düğmeden 12dp uzakta durur.

`pointerRestMillis` yalnızca farenin bekleyişidir: klavye odağı etiketi hemen, parmağın uzun basışı platformun uzun basış süresinde çıkarır. Stilin bekleyişi Android'de ve iOS'ta 400, masaüstünde ve web'de 500 milisaniyedir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.components.overlay.tooltip.TooltipStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixTooltip(text = "Takvim", style = TooltipStyle(pointerRestMillis = 0), tagKey = "instant") {
        PantrixIconButton(
            imageVector = PantrixIcons.Calendar,
            contentDescription = "Takvim",
            onClick = {},
            tagKey = "instant"
        )
    }
    PantrixTooltip(
        text = "Gelen kutusu",
        style = TooltipStyle(
            shape = ShapeRole.Full,
            horizontalPadding = 16.dp,
            verticalPadding = 8.dp,
            gap = 12.dp
        ),
        tagKey = "roomy"
    ) {
        PantrixIconButton(
            imageVector = PantrixIcons.Inbox,
            contentDescription = "Gelen kutusu",
            onClick = {},
            tagKey = "roomy"
        )
    }
}
```

### Kendi renkleri

Renk verilmeyince etiket temanın ters tonundadır: açık temada koyu, koyu temada açık. `colors` etikete verilen renkleri verir: burada temanın hiçbir rolünde olmayan, uygulamanın kendi moru. `TooltipColors`'ın yalnızca verilen alanları değişir.

Rolü olmayan bir dolguda `content` de verilir: o dolgunun üstünde neyin okunduğunu tema bilmez. Dolgu temanın bir rolünün rengiyse, `PantrixTheme.colors.primary.color` gibi, metin kendiliğinden o rolün eş rengini alır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.components.overlay.tooltip.TooltipColors
import com.pantrixui.foundation.icons.PantrixIcons

val report = LocalExampleEvents.current
val own = ownColors()
PantrixTooltip(
    text = "Pro özelliği",
    colors = TooltipColors(container = own.color, content = own.onColor),
    tagKey = "own"
) {
    PantrixIconButton(
        imageVector = PantrixIcons.Info,
        contentDescription = "Pro özelliği",
        onClick = { report("Pro özelliği düğmesine basıldı") },
        tagKey = "own"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.
- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Popover açan düğmede

Popover açan bir düğmenin tooltip'i: `PantrixTooltip` popover'ın `anchor`'ının içindedir. Popover açılınca düğme onun altında kalır ve etiket kalkar. Popover kapanınca da geri gelmez: o sırada kimse düğmenin adını sormuyordur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Diğer popover'ı kapatıldı")
    },
    anchor = {
        PantrixTooltip(text = "Diğer", tagKey = "more") {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "Diğer",
                onClick = { open = true },
                tagKey = "more"
            )
        }
    },
    side = PopoverSide.Bottom,
    tagKey = "more"
) {
    PantrixText(text = "Yeniden adlandır, taşı ya da sil.")
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dialog içinde

Dialog'un içindeki düğmelerin tooltip'i: etiket, dialog'un içindeki kontrolün yanında durur. Dialog klavyeyi kendine alır ve içinde basılan tuş alttaki sayfaya ulaşmaz. Escape yine önce açık etiketi kaldırır; dialog'u bir sonraki Escape kapatır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Dosya ayrıntıları…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "file_details"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Dosya ayrıntıları kapatıldı")
    },
    title = "Rapor.pdf",
    message = "2,4 MB. Dün değiştirildi.",
    actions = {
        PantrixButton(
            text = "Kapat",
            onClick = {
                open = false
                report("Dosya ayrıntıları kapatıldı")
            },
            variant = ButtonVariant.Text,
            tagKey = "close_details"
        )
    },
    tagKey = "file_details"
) {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixTooltip(text = "Sık kullanılanlara ekle", tagKey = "file_favourite") {
            PantrixIconButton(
                imageVector = PantrixIcons.Star,
                contentDescription = "Sık kullanılanlara ekle",
                onClick = { report("Sık kullanılanlara ekle düğmesine basıldı") },
                tagKey = "file_favourite"
            )
        }
        PantrixTooltip(text = "Klasöre taşı", tagKey = "file_move") {
            PantrixIconButton(
                imageVector = PantrixIcons.Folder,
                contentDescription = "Klasöre taşı",
                onClick = { report("Klasöre taşı düğmesine basıldı") },
                tagKey = "file_move"
            )
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dar yerde ikon, geniş yerde yazı

Yer darken yalnızca ikon, genişken yazılı düğme. Düğme kendi yerini `BoxWithPantrixWindow` ile öğrenir: dar yerde adını tooltip gösterir; geniş yerde ad düğmenin üzerinde yazar ve tooltip yoktur.

Bu kutu içeriğini ölçerken kurar ve yer bir sınırı geçince eski dalı ölçümün içinde atar. Etiketin katmanı pencerenin kökünde kurulduğu için o sırada açık olsa da bir şey bozulmaz; pencerenin boyutu değişince etiket ayrıca kaldırılır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.icons.PantrixIcons

val report = LocalExampleEvents.current
BoxWithPantrixWindow(modifier = Modifier.fillMaxWidth()) { box ->
    if (box.isNarrow) {
        PantrixTooltip(text = "Dosyalar", side = PopoverSide.End, tagKey = "files") {
            PantrixIconButton(
                imageVector = PantrixIcons.Folder,
                contentDescription = "Dosyalar",
                onClick = { report("Dosyalar düğmesine basıldı (ikon)") },
                variant = ButtonVariant.Outline,
                tagKey = "files"
            )
        }
    } else {
        PantrixButton(
            text = "Dosyalar",
            onClick = { report("Dosyalar düğmesine basıldı (yazılı)") },
            variant = ButtonVariant.Outline,
            tagKey = "files"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Pencere aynıyken daralan yer

Pencere aynı kalırken daralan bir yer: sürüklenen bir bölme ya da kayarak açılan bir kenar çubuğu gibi. Düğmeye bas: kutu üç saniye sonra genişler ya da daralır. O üç saniye içinde ikonun etiketini ya da popover'ı aç: yer değişince onları taşıyan dal atılır, etiket ve popover onunla birlikte gider.

Kutu içeriğini ölçerken kuran bir yerleşimdir (`BoxWithConstraints`): sınırı geçince içindeki dalı ölçümün içinde atar. Açık bir etiketin ve popover'ın katmanları pencerenin kökünde kurulduğu için dal atılınca bir sonraki karede kapanırlar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.components.overlay.tooltip.PantrixTooltip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

var narrow by rememberSaveable { mutableStateOf(true) }
val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = if (narrow) "3 sn sonra genişlet" else "3 sn sonra daralt",
    onClick = {
        scope.launch {
            delay(3_000L)
            narrow = !narrow
            report(if (narrow) "Yer daraldı" else "Yer genişledi")
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "room"
)
BoxWithConstraints(modifier = Modifier.width(if (narrow) 140.dp else 300.dp)) {
    if (maxWidth < 220.dp) IconsInTheRoom() else WrittenButtonsInTheRoom()
}

@Composable
private fun IconsInTheRoom() {
    var open by rememberSaveable { mutableStateOf(false) }
    val report = LocalExampleEvents.current
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixTooltip(text = "Dosyalar", tagKey = "room_files") {
            PantrixIconButton(
                imageVector = PantrixIcons.Folder,
                contentDescription = "Dosyalar",
                onClick = {},
                variant = ButtonVariant.Outline,
                tagKey = "room_files"
            )
        }
        PantrixPopover(
            visible = open,
            onDismissRequest = {
                open = false
                report("Bilgi popover'ı kapatıldı")
            },
            anchor = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Info,
                    contentDescription = "Bilgi",
                    onClick = { open = true },
                    variant = ButtonVariant.Outline,
                    tagKey = "room_info"
                )
            },
            side = PopoverSide.Bottom,
            tagKey = "room_info"
        ) {
            PantrixText(text = "Dar yerdeyiz.")
        }
    }
}

@Composable
private fun WrittenButtonsInTheRoom() {
    var open by rememberSaveable { mutableStateOf(false) }
    val report = LocalExampleEvents.current
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(text = "Dosyalar", onClick = {}, variant = ButtonVariant.Outline, tagKey = "room_files")
        PantrixPopover(
            visible = open,
            onDismissRequest = {
                open = false
                report("Bilgi popover'ı kapatıldı")
            },
            anchor = {
                PantrixButton(
                    text = "Bilgi",
                    onClick = { open = true },
                    variant = ButtonVariant.Outline,
                    tagKey = "room_info"
                )
            },
            side = PopoverSide.Bottom,
            tagKey = "room_info"
        ) {
            PantrixText(text = "Geniş yerdeyiz.")
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

## API

### PantrixTooltip

`import com.pantrixui.components.overlay.tooltip.PantrixTooltip`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTooltip(
    text: String,
    modifier: Modifier = Modifier,
    side: PopoverSide = PopoverSide.Top,
    enabled: Boolean = true,
    state: PantrixTooltipState = rememberPantrixTooltipState(),
    style: TooltipStyle? = null,
    colors: TooltipColors? = null,
    tagKey: String? = null,
    anchor: @Composable () -> Unit
)
```

Çapalandığı kontrolün adını gösteren kısa bir etiket: bir ikon düğmesinin adı, kesilen bir etiketin tamamı.

Kontrolün zaten söylediğini gösterir. Ekran okuyucu kontrolün kendisini okur ve etiket ondan gizlidir: tooltip bir adı göstermenin yoludur, yeni bir şey söylenecek yer değildir. Kontrole aynı sözcükler verilir: `contentDescription`'ı ya da metni olarak.

Kendiliğinden çıkar ve uygulamadan hiçbir şey almaz: odak almaz, tuş almaz; etiketin kendisine yapılan basış ile onu istemek için tutulan basış dışında hiçbir basışı da almaz. Adını gösterdiği şey o açıkken çalışmaya devam eder, onu kaldırmak için basılan şey de.

- **İşaretçi**, kontrolün üzerinde stilin `pointerRestMillis` süresi kadar durunca etiketi çıkarır, ayrılınca kaldırır. Etiketin üzerine geçip orada durabilir: işaretçi ikisinden birinin üzerindeyken etiket kalır. Kontrolün üzerinde bir fare düğmesine basmak etiketi kaldırır ve işaretçi ayrılıp geri gelene kadar etiket yeniden çıkmaz.

- **Klavye odağı**, odak halkasının çizildiği durumda, etiketi hemen çıkarır ve ayrılınca kaldırır. Escape etiketi kaldırır, odak kontrolde kalır.

- **Tutulan bir basış**, yani kontrole parmakla uzun basış, etiketi çıkarır ve etiket bir yere basılana kadar kalır: parmakla birlikte giden bir etiket hiç okunamazdı. Bu basış kontrolün ne olduğunu sormuştur ve parmak kalkarken hiçbir şeye basmaz. Kısa dokunuş yalnızca kontrolündür ve hiçbir şey çıkarmaz; yer değiştiren bir basış ise bir kaydırmanın başlangıcıdır.

`state`, bunların hepsinin çevirdiği anahtardır; onu bir ekran da çevirebilir.

Kontrolün `side` ile söylenen yanında durur ve kontrole ortalanır; pencerede oraya yer yoksa karşı yana geçer. Pencerenin kenarlarına, sistem çubuklarına ve klavyeye stilin kenar payından fazla yaklaşmaz. Kontrolü bir dialog'un, bir sheet'in ya da açık bir popover'ın altındayken, kontrolü görünür alandan kayıp çıkınca ve pencerenin boyutu değişince kaldırılır.

Parametreler:

- `text: String`: Kontrolün adı: birkaç sözcük, kontrolün kendisinin de söylediği sözcükler.
- `modifier: Modifier`: Kontrolün yerine uygulanır, ipucunun çağrıldığı yerde kontrolün yerleştiği kutuya: oradaki bir hizalama ya da ağırlık kontrolü yerleştirir, etiket de onunla gider.
- `side: PopoverSide`: Kontrolün, tooltip'in tercih ettiği yanı. `PopoverSide.Start` ve `PopoverSide.End` yazı yönünü izler.
- `enabled: Boolean`: Değeri false ise tooltip kaldırılır ve çıkması engellenir: adı zaten görünen bir kontrol için.
- `state: PantrixTooltipState`: Tooltip'in açık olup olmadığı ve onu gösterip gizlemenin yolu.
- `style: TooltipStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TooltipColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar: etiketin otomasyon etiketi `Tooltip_<tagKey>`'dir.
- `anchor: @Composable () -> Unit`: Tooltip'in adını gösterdiği kontrol; tooltip'in çağrıldığı yerde, o yerin istediği gibi yerleştirilir. Basılan bir kontrol, bir düğme ya da bir ikon, ya da yalnızca okunan bir metin olur: kendi uzun basışı olan bir kontrol, bir metin alanı ya da seçilebilen bir metin, dokunmatik ekranda o basışı tooltip'e kaptırırdı.

### rememberPantrixTooltipState

`import com.pantrixui.components.overlay.tooltip.rememberPantrixTooltipState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberPantrixTooltipState(initiallyVisible: Boolean = false): PantrixTooltipState
```

Bir `PantrixTooltipState` hatırlar. O tooltip'i çevresindeki ekrandan gösterip gizlemek için `PantrixTooltip`'e verilir.

Parametreler:

- `initiallyVisible: Boolean`: Tooltip'in ilk kurulduğunda açık olup olmadığı.

### PantrixTooltipState

`import com.pantrixui.components.overlay.tooltip.PantrixTooltipState`, `com.pantrixui:components` içinden

```kotlin
class PantrixTooltipState
```

Bir `PantrixTooltip`'in açık olup olmadığı ve onu çıkarıp kaldırmanın yolu.

Tooltip kendiliğinden çıkar: işaretçi, tooltip'in adını gösterdiği şeyin üzerinde durunca, o şey klavye odağını alınca ve üzerinde basılı tutulunca. İşaretçi ya da odak ayrılınca, bir basışta ve Escape'te gider. Bunların her biri bu tek anahtarı çevirir, bu yüzden `visible` tooltip'in açık olup olmadığını her zaman doğru söyler.

Bir tooltip'i, ilk açılışta bir ipucunu ya da az önce değiştirdiği bir kontrolün yanında adını, kendi kararıyla gösteren ekran durumu kendisi tutar ve `show` ile `dismiss`'i çağırır:

```kotlin
val hint = rememberPantrixTooltipState()
LaunchedEffect(firstRun) { if (firstRun) hint.show() }
PantrixTooltip(text = stringResource(Res.string.refresh), state = hint, tagKey = "refresh") {
    PantrixIconButton(imageVector = PantrixIcons.Refresh, contentDescription = …, onClick = onRefresh)
}
```

`rememberPantrixTooltipState` ile tutulur.

Üyeleri:

- `visible: Boolean`: Tooltip'in açık olup olmadığı. Devre dışı bırakılan ya da kontrolü bir dialog'un veya başka bir modal katmanın altında kalan tooltip kaldırılır; o zaman bu false olur.
- `fun show()`: Tooltip'i çıkarır. Açık olanı göstermek hiçbir şeyi değiştirmez.
- `fun dismiss()`: Tooltip'i kaldırır. Kalkmış olanı kaldırmak hiçbir şeyi değiştirmez.
- `fun toggle()`: Tooltip açıksa onu kaldırır, değilse çıkarır.

### PopoverSide

`import com.pantrixui.components.overlay.popover.PopoverSide`, `com.pantrixui:components` içinden

```kotlin
enum class PopoverSide
```

Bir popover'ın çapasının hangi yanını tercih ettiği. Pencerede orada yer yoksa karşı yana geçer.

Değerleri:

- `Top`: Bağlantı noktasının üstünde.
- `Bottom`: Bağlantı noktasının altında.
- `Start`: Başlangıç kenarı: soldan sağa bir düzende sol, sağdan sola bir düzende sağ.
- `End`: Bitiş kenarı: soldan sağa bir düzende sağ, sağdan sola bir düzende sol.

### TooltipStyle

`import com.pantrixui.components.overlay.tooltip.TooltipStyle`, `com.pantrixui:components` içinden

```kotlin
class TooltipStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val pointerRestMillis: Int? = null
) : PantrixStyle<TooltipStyle>
```

`PantrixTooltip`'in geometrisi: etiketin ne kadar büyük olduğu, adını gösterdiği şeyden ne kadar uzakta durduğu, pencerenin kenarlarına ne kadar yaklaştığı ve işaretçinin, tooltip çıkmadan önce bir kontrolün üzerinde ne kadar durduğu.

Metnin çevresindeki iç boşluk, aralık ve kenar payı yoğunluğu izler. En çok genişlik, köşeler, gölge ve işaretçinin bekleyişi izlemez. Bir tooltip'in renkleri stilinin parçası değildir: temanın renkleridir, bir çağrının kendi renkleri varsa `TooltipColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Etiketin köşeleri.
- `horizontalPadding: Dp`: Metin ile etiketin baş ve son kenarları arasındaki boşluk.
- `verticalPadding: Dp`: Metin ile etiketin üst ve alt kenarları arasındaki boşluk.
- `maxWidth: Dp`: Etiketin en çok genişliği: daha uzun metin satır atlar.
- `gap: Dp`: Tooltip'in adını gösterdiği şey ile tooltip arasındaki aralık.
- `margin: Dp`: Tooltip ile pencerenin kenarları arasında, bir de tooltip ile pencereyi orada örten şey arasında açık bırakılan pay: bir sistem çubuğu, bir ekran çentiği, klavye.
- `elevation: Dp`: Etiketin, uygulamanın üstünde ne kadar yüksekte durduğu, yani gölgesinin ne kadar büyük olduğu.
- `pointerRestMillis: Int?`: İşaretçinin, tooltip çıkmadan önce bir kontrolün üzerinde ne kadar durduğu, milisaniye olarak. Klavye odağı tooltip'i hemen gösterir, parmağın uzun basışı ise platformun uzun basış saydığı sürede: bu yalnızca işaretçinin bekleyişidir. `null`, alttaki stilin değerini yerinde bırakır.

### TooltipColors

`import com.pantrixui.components.overlay.tooltip.TooltipColors`, `com.pantrixui:components` içinden

```kotlin
data class TooltipColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir çağrı için bir `PantrixTooltip`'in boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

```kotlin
PantrixTooltip(text = name, colors = TooltipColors(container = PantrixTheme.colors.primary.color)) { … }
```

Burada verilen `container` temanın rol renklerinden biriyse metin, ayrıca bir `content` rengi verilmedikçe, temanın o renkle eşlediği rengi alır. Hiçbir rolde olmayan bir dolguda bu olmaz: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Etiketin dolgusu. Temanın `onSurface` rengi: temanın zeminlerinin tersi ton. Böylece etiket, sayfa altında ne gösterirse göstersin, açık temada da koyu temada da öne çıkar.
- `content: Color`: Etiketin metni. Temanın `textInverse` rengi: o tonun üstünde okunan renk.
