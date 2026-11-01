# Menu

Bir öğenin eylemlerini o öğenin yanında açılan bir panelde listeler: bir "daha fazla" düğmesinin açtığı liste, bir satırın eylemleri. Scrim yoktur, sayfa çevresinde görünmeye devam eder; panel çapasının (`anchor`) yanında durur ve içerik kaydıkça onunla birlikte yer değiştirir.

Menü kendini kapatmaz. Bir satırı seçmek, dışına basmak, geri tuşu ve Escape `onDismissRequest`'i çağırır; kapatan, `visible`'ı false yapan çağırandır. Seçilen satırın `onClick`'i menüden kapanması istendikten sonra çağrılır: satır yalnızca ne yaptığını söyler, menüyü kapatmayı düşünmez. Dışarıya ilk basış yalnızca kapatır: altındaki şeye basılmış olmaz.

- `PantrixMenu` (`com.pantrixui.components.overlay.menu`, `com.pantrixui:components`): Bir öğe için, yanındaki bir panelde eylemler listesi; oklar satırlarında dolaşır, seçilen bir satır onu kapatır, dışarıya basmak, Escape ve geri de kapatır. Anahtar sözcükler: açılır menü, bağlam menüsü, taşma menüsü, diğer eylemler, sağ tık menüsü, üç nokta menüsü.

## Özellikler

- **Satırlar.** `PantrixMenuItem` bir etiket, önünde bir simge (`icon`), sonunda bir kısayol (`shortcut`) ve altında ikinci, daha küçük bir satır (`supportingText`, yazısı `supportingTextStyle`) alır. Grupların arasına bir `PantrixDivider` konur.
- **Silen ve seçilemeyen satır.** `destructive` etiketi ve simgeyi menünün silme renginde çizer: verilmezse temanın `danger` rengi. `enabled = false` satırı soluk çizer: basılmaz ve odak almaz.
- **Yön ve hiza.** `side` panelin çapanın hangi yanında açılacağını, `alignment` o yan boyunca nasıl hizalanacağını söyler: söylenmezse altta, çapanın başından sarkar. İstenen yanda yer yoksa karşı yana geçer.
- **Pencerenin içinde.** Panel pencerenin kenarlarına, sistem çubuklarına ve klavyeye stilin `margin`'inden fazla yaklaşmaz: kenardaki bir çapada içeri kayar.
- **Genişlik ve yükseklik.** Panel en uzun satırı kadar geniştir, stilin en dar ve en geniş genişliği arasında; daha uzun bir etiket tek satırda kesilir. En çok yüksekliğe sığmayan satırlar panelin içinde kayar.
- **Klavye.** Klavyeyle açılınca odak ilk satırdadır. Ok tuşları satırlar arasında gezer ve sondan başa döner, Home ve End ilk ve son satıra gider, Tab da satırları gezer; Enter ve boşluk satırı seçer, Escape kapatır. Kapanınca odak menüyü açan kontrole döner. Menü açıkken altındaki sayfa odak göstermez.
- **Dokunma ve fare.** Dokunarak ya da tıklayarak açılınca hiçbir satır odak göstermez; ilk ok tuşu, Home ya da End klavyeyi devreye sokar. Farenin üstünde durduğu satır hafifçe dolar.
- **Renkler ve stil.** `colors` (`MenuColors`) panelin ve satırların rengini, `style` (`MenuStyle`) köşeleri, genişlikleri, en çok yüksekliği ve satırın ölçülerini verir. Yalnızca verilen alanlar değişir, gerisi temanın kalır.
- **Platformlar.** Menü her platformda aynı görünür; fark stildedir. Stilin satır yüksekliği Android'de 48, iOS'ta 44, masaüstünde ve web'de 32 dp'dir; satır platformun dokunma hedefinden kısa olmaz.
- **Ekran okuyucu.** Simge okunmaz, satırı etiketi söyler. Kısayol gösterilir ve okunur, ama bağlanmaz: tuşları bağlamak uygulamanın işidir.
- **Seçili satır.** Her biri tek bir şey seçen satırlar arasında, bir dil ya da bir sıra, geçerli olan `selected`'dır: sonunda etiketin renginde bir işaret durur ve ekran okuyucuya seçili olduğu söylenir.
- **Dar pencerede sheet.** `presentation` varsayılanı `OverlayPresentation.Adaptive`: dar (`Compact`) bir pencerede menü alttan bir sheet'tir, daha geniş pencerede çapanın yanında bir panel. Sheet'te satırlar sheet kadar geniş ve dokunma alanı kadar yüksektir, başlık yoktur, aşağı sürüklemek kapatır; dokunmayla kullanılan bir platformda kısayollar yazılmaz. `Popover` ve `Sheet` her pencerede birini seçer. Menü açılırken seçilir, kapanana kadar değişmez.

## Kullanım

### The actions of a row, from a more button

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixIconButton(
            imageVector = PantrixIcons.MoreHorizontal,
            contentDescription = stringResource(Res.string.more),
            onClick = { open = true },
            tagKey = "more"
        )
    },
    tagKey = "row_actions"
) {
    PantrixMenuItem(text = stringResource(Res.string.rename), onClick = onRename, tagKey = "rename")
    PantrixMenuItem(text = stringResource(Res.string.duplicate), onClick = onDuplicate, tagKey = "duplicate")
    PantrixDivider()
    PantrixMenuItem(
        text = stringResource(Res.string.delete),
        onClick = onDelete,
        destructive = true,
        tagKey = "delete"
    )
}
```

### Icons and shortcuts, hanging from the end of a button

```kotlin
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = { PantrixButton(text = stringResource(Res.string.file), onClick = { open = true }, tagKey = "file") },
    alignment = PopoverAlignment.End,
    tagKey = "file"
) {
    PantrixMenuItem(
        text = stringResource(Res.string.search),
        onClick = onSearch,
        icon = PantrixIcons.Search,
        shortcut = "Ctrl+F",
        tagKey = "search"
    )
    PantrixMenuItem(
        text = stringResource(Res.string.refresh),
        onClick = onRefresh,
        icon = PantrixIcons.Refresh,
        shortcut = "F5",
        enabled = online,
        tagKey = "refresh"
    )
}
```

## Örnekler

### Satır eylemleri

En yalın hâli: bir dosyanın "daha fazla" düğmesi menüyü açar. Menünün açık olup olmadığı ekranın durumudur (`visible`). Menü kendini kapatmaz: kapanmak istediğinde `onDismissRequest`'i çağırır, `visible`'ı false yapan bu koddur. Silen satır bir `PantrixDivider`'ın altındadır ve `destructive` ile temanın `danger` rengindedir.

Bir satırı seç: menüden önce kapanması istenir, sonra satırın `onClick`'i çağrılır; kartın "Son olay" satırı en son olanı söyler. Dışına basmak, geri tuşu ve Escape yalnızca kapatır. Klavyeyle açılınca odak ilk satırdadır; kapanınca düğmeye döner.

`tagKey` verilen menünün satırları otomasyon için onun içinde adlandırılır: buradaki "Sil" satırının test etiketi `Menu_row_actions.MenuItem_delete`'tir ve başka bir menünün "Sil" satırıyla karışmaz.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Rapor.pdf")
    PantrixMenu(
        visible = open,
        onDismissRequest = {
            open = false
            report("Dosya eylemleri kapatıldı")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "Rapor.pdf için eylemler",
                onClick = { open = true },
                tagKey = "open_row_actions"
            )
        },
        tagKey = "row_actions"
    ) {
        PantrixMenuItem(
            text = "Yeniden adlandır",
            onClick = { report("Yeniden adlandır seçildi") },
            tagKey = "rename"
        )
        PantrixMenuItem(text = "Çoğalt", onClick = { report("Çoğalt seçildi") }, tagKey = "duplicate")
        PantrixDivider()
        PantrixMenuItem(text = "Sil", onClick = { report("Sil seçildi") }, destructive = true, tagKey = "delete")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Simge ve kısayol

`icon` etiketin önünde bir simge çizer: etiketin renginde ve stilin simge boyutunda. Simge etiketin söylediğinin resmidir; ekran okuyucu yalnızca etiketi okur. `shortcut` aynı işi yapan tuşları satırın sonunda gösterir. Kısayol yalnızca gösterilir ve okunur: tuşları bağlamak uygulamanın işidir.

`enabled = false` satırı soluk çizer: "Klasöre taşı" basılmaz ve klavyede atlanır. `destructive` etiketi de simgeyi de silme renginde çizer.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixMenu(
    visible = open,
    onDismissRequest = {
        open = false
        report("Dosya menüsü kapatıldı")
    },
    anchor = {
        PantrixButton(
            text = "Dosya",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_file"
        )
    },
    tagKey = "file"
) {
    PantrixMenuItem(
        text = "Ara",
        onClick = { report("Ara seçildi") },
        icon = PantrixIcons.Search,
        shortcut = "Ctrl+F",
        tagKey = "search"
    )
    PantrixMenuItem(
        text = "Yenile",
        onClick = { report("Yenile seçildi") },
        icon = PantrixIcons.Refresh,
        shortcut = "F5",
        tagKey = "refresh"
    )
    PantrixMenuItem(
        text = "Klasöre taşı",
        onClick = { report("Klasöre taşı seçildi") },
        icon = PantrixIcons.Folder,
        enabled = false,
        tagKey = "move"
    )
    PantrixDivider()
    PantrixMenuItem(
        text = "Sil",
        onClick = { report("Sil seçildi") },
        icon = PantrixIcons.Close,
        shortcut = "Del",
        destructive = true,
        tagKey = "delete"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Seçili satır

Her satırı tek bir şey seçen bir menü: listenin sırası. Geçerli olan `selected`'dır: sonunda etiketin renginde bir işaret durur, ekran okuyucuya seçili olduğu söylenir. Başka bir sıra seç: işaret onun satırına geçer, düğme de yeni sırayı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem

var open by rememberSaveable { mutableStateOf(false) }
var order by rememberSaveable { mutableStateOf("newest") }
val orders = listOf("newest" to "En yeni önce", "oldest" to "En eski önce", "name" to "Ada göre")
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Sırala: ${orders.first { it.first == order }.second}",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_order"
        )
    },
    tagKey = "order"
) {
    orders.forEach { (key, label) ->
        PantrixMenuItem(text = label, onClick = { order = key }, tagKey = key, selected = order == key)
    }
}
```

### İkinci satır

`supportingText` etiketin altına ikinci, daha küçük bir satır koyar: seçimin neye götürdüğü. Burada her dilin altında sitenin o dildeki adresi, kod yazısıyla (`supportingTextStyle`); rengi satırınkidir. Satır onu taşıyacak kadar uzar; ekran okuyucu ikinci satırı etiketten sonra duyar. İkinci satır en çok iki satırdır, ötesi kesilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var chosen by rememberSaveable { mutableIntStateOf(0) }
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Dil: ${LANGUAGES[chosen].first}",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_language"
        )
    },
    tagKey = "language"
) {
    LANGUAGES.forEachIndexed { index, (name, address) ->
        PantrixMenuItem(
            text = name,
            onClick = { chosen = index },
            selected = index == chosen,
            tagKey = "language_$index",
            supportingText = address,
            supportingTextStyle = PantrixTheme.typography.code
        )
    }
}

private val LANGUAGES = listOf(
    "Türkçe" to "pantrixui.com/tr",
    "English" to "pantrixui.com/en",
    "العربية" to "pantrixui.com/ar"
)
```

### Yön ve hiza

`side` panelin çapanın hangi yanında açılacağını, `alignment` o yan boyunca nasıl hizalanacağını söyler. Söylenmezse menü altta, çapanın başından sarkar: `PopoverSide.Bottom` ve `PopoverAlignment.Start`. İki enum Popover'ındır; menü onları paylaşır.

Baş ve Son yazı yönüne göre değişir: soldan sağa bir düzende Baş soldur. Panel çapanın yanındayken (Baş ya da Son) hiza dikeydir: Baş üst kenarları, Son alt kenarları buluşturur.

İstenen yanda yer yoksa menü karşı yana geçer: Üst'ü seç ve düğme pencerenin üst kenarına yakınken aç. İki yanda da yer yoksa menü istenen yanda kalır ve pencerenin içine, çapanın üstüne kayar.

`presentation = OverlayPresentation.Popover`: menü dar bir pencerede de bir paneldir, sheet değil; yönü ve hizası telefonda da görünür.

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
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverSide

var open by rememberSaveable { mutableStateOf(false) }
var side by rememberSaveable { mutableStateOf(PopoverSide.Bottom) }
var alignment by rememberSaveable { mutableStateOf(PopoverAlignment.Start) }
val report = LocalExampleEvents.current
PantrixSegmentButton(options = SIDES, selected = side, onSelect = { side = it }, tagKey = "menu_side")
PantrixSegmentButton(
    options = ALIGNMENTS,
    selected = alignment,
    onSelect = { alignment = it },
    tagKey = "menu_alignment"
)
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
    PantrixMenu(
        visible = open,
        onDismissRequest = {
            open = false
            report("Menü kapatıldı")
        },
        anchor = {
            PantrixButton(
                text = "Aç",
                onClick = { open = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_placed_menu"
            )
        },
        side = side,
        alignment = alignment,
        tagKey = "placed_menu",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(text = "side = ${side.name}", onClick = { report("Yön satırı seçildi") }, tagKey = "side")
        PantrixMenuItem(
            text = "alignment = ${alignment.name}",
            onClick = { report("Hiza satırı seçildi") },
            tagKey = "alignment"
        )
    }
}

private val SIDES = listOf(
    SegmentOption(value = PopoverSide.Top, label = "Üst", tagKey = "top"),
    SegmentOption(value = PopoverSide.Bottom, label = "Alt", tagKey = "bottom"),
    SegmentOption(value = PopoverSide.Start, label = "Baş", tagKey = "start"),
    SegmentOption(value = PopoverSide.End, label = "Son", tagKey = "end")
)

private val ALIGNMENTS = listOf(
    SegmentOption(value = PopoverAlignment.Start, label = "Baş", tagKey = "start"),
    SegmentOption(value = PopoverAlignment.Center, label = "Orta", tagKey = "center"),
    SegmentOption(value = PopoverAlignment.End, label = "Son", tagKey = "end")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kenarda

Pencerenin bitiş kenarına yakın bir "daha fazla" düğmesi. Menü çapasının başından sarkar; düğme kenara yakınken panel pencereden taşardı. Taşmaz: kenardan stilin `margin`'i kadar içeride kalacak şekilde kayar. Dar bir pencerede menü bir sheet olurdu; `presentation = OverlayPresentation.Popover` onu her pencerede panel tutar.

Dar bir pencerede dene: daraltılacak olan, uygulamanın kendi penceresidir. Menü yerini gerçek pencereye göre seçer, bir kartın pencere seçicisinin örneğine verdiği pencereye göre değil; bu kartta o seçici bu yüzden yoktur. Yeterince geniş bir pencerede kartın yanında panele yer kalır; orada panel kaymaz, düğmenin başından sarkar.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
    PantrixMenu(
        visible = open,
        onDismissRequest = {
            open = false
            report("Kenardaki menü kapatıldı")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "Klasör eylemleri",
                onClick = { open = true },
                tagKey = "open_edge"
            )
        },
        tagKey = "edge",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(
            text = "Klasörü paylaş",
            onClick = { report("Klasörü paylaş seçildi") },
            icon = PantrixIcons.Person,
            tagKey = "share"
        )
        PantrixMenuItem(
            text = "Sık kullanılanlara ekle",
            onClick = { report("Sık kullanılanlara ekle seçildi") },
            icon = PantrixIcons.Star,
            tagKey = "favourite"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Uzun liste

Otuz satır stilin en çok yüksekliğine (`MenuStyle.maxHeight`) sığmaz: panel o yükseklikte kalır, satırlar içinde kayar. Klavyede End son satıra, Home ilk satıra gider; odaklanan satır görünen yere gelir.

`presentation = OverlayPresentation.Popover`: dar bir pencerede de panel. Bir sheet'te satırlar sheet'in içinde kayar, sheet en çok pencere kadar yüksektir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixMenu(
    visible = open,
    onDismissRequest = {
        open = false
        report("Sürüm menüsü kapatıldı")
    },
    anchor = {
        PantrixButton(
            text = "Sürüm seç",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_versions"
        )
    },
    tagKey = "versions",
    presentation = OverlayPresentation.Popover
) {
    (30 downTo 1).forEach { number ->
        PantrixMenuItem(
            text = "Sürüm $number.0",
            onClick = { report("Sürüm $number.0 seçildi") },
            tagKey = "version_$number"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Genişlik

Panel en uzun satırı kadar geniştir, stilin en dar ve en geniş genişliği arasında (`MenuStyle.minWidth` ve `maxWidth`). "Kısa" menüsünün etiketleri en dar genişlikten kısadır: panel o genişlikte kalır. "Uzun" menüsünün ilk etiketi en geniş panele sığmaz: tek satırda kesilir.

`presentation = OverlayPresentation.Popover`: bir sheet pencere kadar geniştir; panelin genişliği dar bir pencerede de görünsün diye iki menü de paneldir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.theme.PantrixTheme

var narrow by rememberSaveable { mutableStateOf(false) }
var wide by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixMenu(
        visible = narrow,
        onDismissRequest = {
            narrow = false
            report("Kısa menüsü kapatıldı")
        },
        anchor = {
            PantrixButton(
                text = "Kısa",
                onClick = { narrow = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_narrow"
            )
        },
        tagKey = "narrow",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(text = "Aç", onClick = { report("Aç seçildi") }, tagKey = "open")
        PantrixMenuItem(text = "Sil", onClick = { report("Sil seçildi") }, tagKey = "delete")
    }
    PantrixMenu(
        visible = wide,
        onDismissRequest = {
            wide = false
            report("Uzun menüsü kapatıldı")
        },
        anchor = {
            PantrixButton(
                text = "Uzun",
                onClick = { wide = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_wide"
            )
        },
        tagKey = "wide",
        presentation = OverlayPresentation.Popover
    ) {
        PantrixMenuItem(
            text = "Rapor.pdf dosyasını paylaşılan klasördeki herkesle birlikte düzenlemeye aç",
            onClick = { report("Uzun satır seçildi") },
            tagKey = "long"
        )
        PantrixMenuItem(text = "Kopyala", onClick = { report("Kopyala seçildi") }, tagKey = "copy")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kendi stili

`style` yalnızca bu menünün geometrisini değiştirir: `MenuStyle`'ın verilen alanları değişir, gerisi temanın ve platformun stilinden gelir. Burada panelin köşeleri temanın büyük köşesidir (`ShapeRole.Large`), panel en az 240dp genişliğindedir, satırları 56dp yüksekliğinde ve simgeleri 28dp'dir.

Menüye verilen stil satırlarını da çizer; `PantrixMenuItem` ayrıca stil almaz. Verilen genişlik ve yükseklik temanın yoğunluğuyla ölçeklenir; köşeler ve simgenin boyutu ölçeklenmez.

`presentation = OverlayPresentation.Popover`: bir sheet'in köşeleri ve genişliği sheet'indir, panelin stili orada yalnızca satırları çizer; stil dar bir pencerede de görünsün diye menü paneldir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.MenuStyle
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixMenu(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Hesap",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_account"
        )
    },
    style = MenuStyle(shape = ShapeRole.Large, minWidth = 240.dp, itemHeight = 56.dp, iconSize = 28.dp),
    tagKey = "account",
    presentation = OverlayPresentation.Popover
) {
    PantrixMenuItem(text = "Profil", onClick = {}, icon = PantrixIcons.Person, tagKey = "profile")
    PantrixMenuItem(text = "Gelen kutusu", onClick = {}, icon = PantrixIcons.Inbox, tagKey = "inbox")
    PantrixMenuItem(text = "Sık kullanılanlar", onClick = {}, icon = PantrixIcons.Star, tagKey = "favourites")
}
```

### Kendi renkleri

`colors` menüye temanın değil, verilen renkleri verir: burada temanın hiçbir rolünde olmayan, uygulamanın kendi moru. `MenuColors`'ın yalnızca verilen alanları değişir, gerisi temanın kalır: silen satır yine temanın `danger` rengindedir.

Temanın ikinci ve soluk yazı renkleri yalnızca temanın kendi zeminleri içindir. Bu dolguda kısayol satırın renginde, seçilemeyen satır o rengin bir payında çizilir. Grupların arasındaki çizgiye renk verilmez: dolgunun üstünde o da satırın renginin bir payıdır.

Rolü olmayan bir dolguda `content` de verilir: o dolgunun üstünde neyin okunduğunu tema bilmez. Dolgu temanın bir rolünün rengiyse, `PantrixTheme.colors.primary.container` gibi, satırlar kendiliğinden o rolün eş rengini alır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.overlay.menu.MenuColors
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixMenu(
    visible = open,
    onDismissRequest = {
        open = false
        report("Pro menüsü kapatıldı")
    },
    anchor = {
        PantrixButton(
            text = "Pro",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_pro_menu"
        )
    },
    colors = MenuColors(container = own.container, content = own.onContainer, border = own.color),
    tagKey = "pro_menu"
) {
    PantrixMenuItem(
        text = "Planı yükselt",
        onClick = { report("Planı yükselt seçildi") },
        icon = PantrixIcons.Star,
        shortcut = "Ctrl+U",
        tagKey = "upgrade"
    )
    PantrixMenuItem(
        text = "Faturalar",
        onClick = { report("Faturalar seçildi") },
        icon = PantrixIcons.Folder,
        enabled = false,
        tagKey = "invoices"
    )
    PantrixDivider()
    PantrixMenuItem(
        text = "Aboneliği bitir",
        onClick = { report("Aboneliği bitir seçildi") },
        icon = PantrixIcons.Close,
        destructive = true,
        tagKey = "cancel_plan"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.
- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Başka temadaki bir bölümde

Sayfanın tersi renkte bir bölüm ve içinden açılan bir menü. Bölüm ikinci bir temadır (`PantrixTheme(darkTheme = …)`): açık sayfada koyu, koyu sayfada açık. Menü o temanın içinde çağrıldığı için onun renklerindedir: paneli pencerenin kökündeki kendi katmanında kurulsa da çağrıldığı yerin temasını taşır.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixMenu(
                visible = open,
                onDismissRequest = {
                    open = false
                    report("Bölümün menüsü kapatıldı")
                },
                anchor = {
                    PantrixButton(
                        text = "Bu bölümden aç",
                        onClick = { open = true },
                        tagKey = "open_menu_in_part"
                    )
                },
                tagKey = "menu_in_part"
            ) {
                PantrixMenuItem(
                    text = "Bölümü yenile",
                    onClick = { report("Bölümü yenile seçildi") },
                    icon = PantrixIcons.Refresh,
                    tagKey = "refresh_part"
                )
                PantrixMenuItem(
                    text = "Bölümü kaldır",
                    onClick = { report("Bölümü kaldır seçildi") },
                    icon = PantrixIcons.Close,
                    destructive = true,
                    tagKey = "remove_part"
                )
            }
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dialog içinde

Bir dialog'un içinden açılan menü. Menü dialog'un üstünde, kendi katmanındadır: Escape ve geri tuşu önce menüyü kapatır, dialog'u bir sonraki kapatır. Menünün dışına, dialog'un içine basmak da yalnızca menüyü kapatır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem

var dialog by rememberSaveable { mutableStateOf(false) }
var menu by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Dosya ayrıntıları…",
    onClick = { dialog = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_file_dialog"
)
PantrixDialog(
    visible = dialog,
    onDismissRequest = {
        dialog = false
        report("Dosya ayrıntıları kapatıldı")
    },
    title = "Rapor.pdf",
    message = "2,4 MB. Dün değiştirildi.",
    actions = {
        PantrixButton(
            text = "Kapat",
            onClick = {
                dialog = false
                report("Dosya ayrıntıları kapatıldı")
            },
            variant = ButtonVariant.Text,
            tagKey = "close_file_dialog"
        )
    },
    tagKey = "file_dialog"
) {
    PantrixMenu(
        visible = menu,
        onDismissRequest = {
            menu = false
            report("Paylaş menüsü kapatıldı")
        },
        anchor = {
            PantrixButton(
                text = "Paylaş",
                onClick = { menu = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_share"
            )
        },
        tagKey = "share"
    ) {
        PantrixMenuItem(
            text = "Bağlantıyı kopyala",
            onClick = { report("Bağlantıyı kopyala seçildi") },
            tagKey = "copy_link"
        )
        PantrixMenuItem(
            text = "E-postayla gönder",
            onClick = { report("E-postayla gönder seçildi") },
            tagKey = "send_mail"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dar pencerede sheet

Aynı menü pencerenin genişliğine göre: karttaki pencere seçicisinden "Dar"ı seç, menü alttan bir sheet olarak açılır; "Geniş"te düğmenin yanında bir paneldir. Sheet'te satırlar sheet kadar geniştir, aşağı sürüklemek ya da scrim'e basmak kapatır, "Sil" kırmızı kalır. Kısayollar Android'de ve iOS'ta sheet'te yazılmaz: basılacak tuşları yoktur.

Menü açılırken seçilir: açıkken pencere değişse de sheet sheet, panel panel kalır; sonraki açılış yeni pencereye göredir. Varsayılan budur; `presentation = OverlayPresentation.Adaptive` yalnızca görünsün diye yazılı.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
// Kartın penceresi örnek kadar uzundur: dar bir pencerede açılan sheet'e yer kalsın diye örnek uzun tutulur.
Column(Modifier.fillMaxWidth().height(280.dp)) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = "Sunum.key")
        PantrixMenu(
            visible = open,
            onDismissRequest = { open = false },
            anchor = {
                PantrixIconButton(
                    imageVector = PantrixIcons.MoreHorizontal,
                    contentDescription = "Sunum.key için eylemler",
                    onClick = { open = true },
                    tagKey = "open_adaptive_menu"
                )
            },
            tagKey = "adaptive_menu",
            presentation = OverlayPresentation.Adaptive
        ) {
            PantrixMenuItem(
                text = "Paylaş",
                onClick = { report("Paylaş seçildi") },
                icon = PantrixIcons.Upload,
                shortcut = "Ctrl+Shift+S",
                tagKey = "share"
            )
            PantrixMenuItem(
                text = "Kopyala",
                onClick = { report("Kopyala seçildi") },
                icon = PantrixIcons.Copy,
                shortcut = "Ctrl+C",
                tagKey = "copy"
            )
            PantrixDivider()
            PantrixMenuItem(
                text = "Sil",
                onClick = { report("Sil seçildi") },
                destructive = true,
                tagKey = "delete"
            )
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

## API

### PantrixMenu

`import com.pantrixui.components.overlay.menu.PantrixMenu`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixMenu(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    anchor: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopoverSide = PopoverSide.Bottom,
    alignment: PopoverAlignment = PopoverAlignment.Start,
    style: MenuStyle? = null,
    colors: MenuColors? = null,
    tagKey: String? = null,
    presentation: OverlayPresentation = OverlayPresentation.Adaptive,
    content: @Composable ColumnScope.() -> Unit
)
```

Bir öğenin eylemlerini o öğenin yanındaki bir panelde listeler: bir "daha fazla" düğmesinin açtığı liste ya da bir satırın eylemleri.

Bir çapaya bağlıdır, modal değildir: scrim yoktur, uygulama çevresinde görünmeye devam eder ve içerik kaydıkça panel çapasıyla birlikte yer değiştirir. Pencerede orada yer oldukça çapanın `side` ile verilen yanında durur ve `alignment`'ın söylediği gibi hizalanır, yer yoksa karşı yana geçer. Pencerenin kenarlarına, sistem çubuklarına ve klavyeye stilin kenar boşluğundan fazla yaklaşmaz. En uzun satırı kadar geniştir, stilin en az ve en çok genişliği arasında. En çok yüksekliğine sığmayan satırlar kayar.

Menü kendini hiçbir zaman kapatmaz. Dışına basmak, Escape ve geri tuşu `onDismissRequest`'i çağırır. Bir satırın seçilmesi de çağırır, satırın kendi `onClick`'inden önce: satır ne yaptığını söyler, menü hakkında hiçbir şey söylemez. `visible`'ı false yapan çağırandır. Dışarıya ilk basış yalnızca kapanmasını ister: altındaki şeye basılmış olmaz.

Klavyeyle açılınca odağı ilk satırına alır. Ok tuşları satırlar arasında gezer ve sondan başa döner, Home ve End ilk ve son satıra gider. Tab da satırları gezer: paneldeki tek duraklar satırlardır. Enter ve boşluk satırı seçer, Escape menüyü kapatır. Dokunarak ya da tıklayarak açılınca hiçbir satır odak göstermez ve bu tuşlardan ilki klavyeyi devreye sokar: aşağı ok ya da Home ilk satırda, yukarı ok ya da End son satırda. Menü kapanınca odak çapadadır, yani menüyü açan kontrolde. Menü açıkken altındaki uygulama, bir dialog'un altındaki gibi, odak göstermez.

Her platformda aynı görünür. Fark `MenuStyle`'dadır: köşeler, genişlikler, gölge ve satırların yüksekliği.

**Dar bir pencerede bir sheet'tir** (`presentation`): telefonda bir düğmenin yanındaki panel parmağın altında küçüktür, alt kenardan bir sheet ise başparmağın erişebileceği yerdedir. Satırlar sheet kadar geniş ve platformun dokunma alanı kadar yüksektir, başlık yoktur; aşağı sürüklemek ya da scrim'e basmak, panelin dışındaki her şey gibi kapatır. Silen bir satır rengini korur; platform dokunmayla kullanılıyorsa kısayol yazılmaz, basılacak tuşu yoktur. Klavye satırlar arasında paneldeki gibi gezer.

Parametreler:

- `visible: Boolean`: Menünün görünüp görünmediği. Temanın hareketiyle girer ve çıkar.
- `onDismissRequest: () -> Unit`: Dışına basılınca, Escape'e ya da geri tuşuna basılınca ve bir satır seçilince çağrılır. Menü, `visible` false olana kadar kalır.
- `anchor: @Composable () -> Unit`: Menünün ait olduğu kontrol, çoğunlukla onu açan düğme. Menünün çağrıldığı yerde ve o yerin istediği gibi yerleşir.
- `modifier: Modifier`: Panele, kendi katmanının içinde uygulanır. Çapaya uygulanmaz.
- `side: PopoverSide`: Panelin çapanın hangi yanını tercih ettiği. `PopoverSide.Start` ve `PopoverSide.End` yazı yönünü izler.
- `alignment: PopoverAlignment`: Panelin o yan boyunca çapayla nasıl hizalanacağı: başka türlü söylenmezse çapanın başlangıç kenarından, bir menünün kendisini açandan sarktığı gibi.
- `style: MenuStyle?`: Bu çağrının kendi stili, satırları da onunla çizilir: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: MenuColors?`: Bu çağrının kendi renkleri, satırlarınınkiler de içinde. Yalnızca verdikleri değişir, gerisi temanın kalır.
- `tagKey: String?`: otomasyon için yerele bağlı olmayan bir anahtar: panelin etiketi `Menu_<tagKey>`'dir ve satırları onun içinde adlandırılır, `Menu_<tagKey>.MenuItem_<satırın anahtarı>`. Sheet olarak gösterilen bir menünün etiketleri aynıdır, sheet'in üstünde.
- `presentation: OverlayPresentation`: menünün nasıl gösterildiği: varsayılan dar bir pencerede bir sheet, daha geniş pencerede çapanının yanında bir panel; her zaman panel ya da her zaman sheet. Menü açılırken seçilir, kapanana kadar kalır.
- `content: @Composable ColumnScope.() -> Unit`: Satırlar: `PantrixMenuItem`'lar ve grupların arasında birer `PantrixDivider`. Renk verilmezse bu çizgi bir dolgunun üstünde satırların renginden çıkar, panelin çevresindeki ince çizgi gibi.

### PantrixMenuItem

`import com.pantrixui.components.overlay.menu.PantrixMenuItem`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixMenuItem(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    shortcut: String? = null,
    enabled: Boolean = true,
    destructive: Boolean = false,
    tagKey: String? = null,
    selected: Boolean = false,
    supportingText: String? = null,
    supportingTextStyle: TextStyle = PantrixTheme.typography.footnote
)
```

Bir `PantrixMenu` içindeki tek bir eylem: bir etiket, istenirse önünde bir simge ve sonunda bir kısayol. Her biri tek bir şey seçen satırlar arasında, bir dil ya da bir sıralama, geçerli olan `selected`'dır ve sonunda bir işaret durur.

Seçilince önce menüden kapanmasını ister, sonra `onClick`'i çağırır. En az stilin satırı ve platformun dokunma hedefi kadar yüksektir. Panel en geniş hâlindeyken etiketi tek satırda kesilir.

Parametreler:

- `text: String`: Eylemin ne yaptığı, bir iki sözcükle.
- `onClick: () -> Unit`: Satır seçilince, menüden kapanması istendikten sonra çağrılır.
- `modifier: Modifier`: Satıra uygulanır.
- `icon: ImageVector?`: Etiketin önüne, stilin simge boyutunda ve etiketin renginde çizilir. Etiketin söylediğinin resmidir: ekran okuyucuya yalnızca etiket söylenir.
- `shortcut: String?`: Aynı işi yapan tuşlar, "Ctrl+K" gibi. Etiketten sonra durur. Gösterilir ve okunur, ama hiçbir zaman bağlanmaz: tuşları bağlamak uygulamanın işidir.
- `enabled: Boolean`: Satırın seçilip seçilemeyeceği. Seçilemeyen satır basış da odak da almaz, hiçbir şey bildirmez.
- `destructive: Boolean`: Etiketi ve simgeyi menünün silme renginde çizer: silen ya da geri alınamayan bir eylem içindir.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar: satırın etiketi `MenuItem_<tagKey>` olur, kendi anahtarı olan bir menünün etiketinin içinde.
- `selected: Boolean`: satırın, her biri tek bir şey seçen satırlar arasında geçerli seçim olup olmadığı: sonunda etiketin renginde bir işaret durur ve ekran okuyucuya seçili olduğu söylenir.
- `supportingText: String?`: Etiketin altında, daha küçük ve kısayolun daha sessiz renginde ikinci bir satır: bir dilin adının altındaki adresi gibi, seçimin neye götürdüğü. Satır onu taşıyacak kadar uzar ve ekran okuyucu onu etiketten sonra duyar. İki satırda kesilir.
- `supportingTextStyle: TextStyle`: `supportingText`'in yazı stili: verilmezse temanın `footnote` stili. Rengi satırınki kalır: etiketten sessiz, seçilemeyen bir satırda devre dışı rengi.

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

### PopoverAlignment

`import com.pantrixui.components.overlay.popover.PopoverAlignment`, `com.pantrixui:components` içinden

```kotlin
enum class PopoverAlignment
```

Bir popover'ın, durduğu yan boyunca çapasıyla nasıl hizalandığı.

Değerleri:

- `Start`: Başlangıç kenarları buluşur, popover çapasının yanındaysa üst kenarları.
- `Center`: Çapaya ortalanır.
- `End`: Bitiş kenarları buluşur, popover çapasının yanındaysa alt kenarları.

### MenuStyle

`import com.pantrixui.components.overlay.menu.MenuStyle`, `com.pantrixui:components` içinden

```kotlin
class MenuStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val itemHeight: Dp = Dp.Unspecified,
    public val itemHorizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified
) : PantrixStyle<MenuStyle>
```

`PantrixMenu`'nün geometrisi: çizdiği panel, bu panelin çapasından ve pencerenin kenarlarından ne kadar uzakta durduğu ve içindeki satırlar.

Hava yoğunlukla ölçeklenir: çapaya uzaklık, kenar boşluğu, ilk satırın üstündeki ve son satırın altındaki iç boşluk, bir satırın yüksekliği ile içindeki iç boşluk ve aralık, bir de en az genişlik. En çok genişlik, en çok yükseklik, köşeler, gölge ve simge ölçeklenmez. Yoğunluk ne olursa olsun bir satır platformun dokunma hedefinden kısa olmaz. Menünün renkleri stilinin parçası değildir: temanındır, kendi renkleri olan bir çağrıda `MenuColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Panelin köşeleri: Android'de ve iOS'ta temanın orta, masaüstünde ve web'de küçük köşesidir.
- `minWidth: Dp`: Panelin en az genişliği: etiketleri ne kadar kısa olursa olsun bundan dar olmaz.
- `maxWidth: Dp`: Panelin en çok genişliği: daha uzun bir etiket kesilir.
- `maxHeight: Dp`: Panelin en çok yüksekliği: sığmayan satırlar kayar.
- `elevation: Dp`: Panelin uygulamanın üstünde ne kadar yüksekte durduğu, yani gölgesinin ne kadar büyük olduğu.
- `gap: Dp`: Çapa ile panelin arası.
- `margin: Dp`: Panel ile pencerenin kenarları arasında, bir de pencereyi orada örten şeylerle arasında boş bırakılan yer: bir sistem çubuğu, bir ekran çentiği, klavye.
- `verticalPadding: Dp`: İlk satırın üstündeki ve son satırın altındaki boşluk.
- `itemHeight: Dp`: Platformun dokunma hedefi daha yüksek değilse bir satırın en az yüksekliği.
- `itemHorizontalPadding: Dp`: Bir satırın içinde, simgesinden önceki ve kısayolundan sonraki boşluk.
- `iconSize: Dp`: Bir satırın simgesi.
- `iconGap: Dp`: Bir satırın simgesi ile etiketinin arası ve etiketi ile kısayolunun arası.

### MenuColors

`import com.pantrixui.components.overlay.menu.MenuColors`, `com.pantrixui:components` içinden

```kotlin
data class MenuColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val destructive: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir çağrı için `PantrixMenu`'nün boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

```kotlin
PantrixMenu(…, colors = MenuColors(container = PantrixTheme.colors.primary.container))
```

Burada verilen `container` temanın rol renklerinden biriyse satırlar, `content` de verilmedikçe, temanın o renkle eşlediği rengi alır. Hiçbir rolde olmayan bir dolguda bu olmaz: üstünde okunan rengi çağıran verir, üstünde okunan bir `destructive` rengini de.

Parametreler:

- `container: Color`: Panelin dolgusu. Temanın `surface`'ı.
- `content: Color`: Bir satırın etiketi ve simgesi. Temanın `textPrimary`'si. Bir satırın kısayolu temanın kendi zeminlerinde temanın `textSecondary`'sidir, çağıranın verdiği bir dolguda ise bu renktedir.
- `destructive: Color`: Silen ya da geri alınamayan bir satırın etiketi ve simgesi. Temanın `danger` rengi.
- `border: Color`: Panelin çevresindeki ince çizgi: paneli, altında duran kendi rengindeki bir yüzeyden ayırır, gölgenin az göründüğü koyu temada olduğu gibi. Temanın kendi zeminlerinde temanın `divider`'ıdır. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `content`'in bir payıdır: Subtle bir düğmenin kenarı gibi. Saydam bir renk verilirse çizgi çizilmez.

### OverlayPresentation

`import com.pantrixui.components.overlay.common.OverlayPresentation`, `com.pantrixui:components` içinden

```kotlin
enum class OverlayPresentation
```

Bir denetime ait bir katmanın nasıl gösterildiği: denetimin yanında ya da pencerenin altından bir sheet olarak.

Basılanın yanındaki bir popover, denetimin çevresinde yer olan bir pencereye ve bir işaretçiye uyar. Telefonda aynı katman parmağın altında küçüktür ve ekranın ortasını örter; alt kenardan bir sheet başparmağın erişebileceği yerde ve pencere kadar geniştir.

Değerleri:

- `Adaptive`: Dar bir pencerede, `Compact` genişlik sınıfında, bir sheet; her daha geniş pencerede bir popover. Pencere, katmanın üstünde gösterildiği penceredir, açıldığı bir panelin yeri değil; ve katman açılırken sorulur: açık olan, pencere değişince olduğu gibi kalır, sonraki o zamanki pencereye göre gösterilir.
- `Popover`: Denetimin yanında bir popover, her pencerede.
- `Sheet`: Pencerenin alt kenarından bir sheet, her pencerede.
