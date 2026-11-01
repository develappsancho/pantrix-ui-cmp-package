# Popover

Bir öğenin yanında açılan ve o öğe hakkında, öğenin kendisinin gösterebileceğinden fazlasını gösteren katman: bir durumun ne anlama geldiği, bir alanın ne beklediği, bir satır için birkaç kontrol. Scrim yoktur, sayfa çevresinde görünmeye devam eder; popover çapasının (`anchor`) yanında durur ve içerik kaydıkça onunla birlikte yer değiştirir.

Popover kendini kapatmaz. Dışına basmak, geri tuşu ve Escape `onDismissRequest`'i çağırır; kapatan, `visible`'ı false yapan çağırandır. Dışarıya ilk basış yalnızca kapatır: altındaki şeye basılmış olmaz, bu yüzden çapaya basmak popover'ı kapatır ve yeniden açmaz.

Kapalı bir popover çapasından başka hiçbir şey kurmaz: ağaçta `visible = false` ile durur ve temanın hareketiyle girer ve çıkar. Açıkken kompozisyondan çıkarılan popover hareketsiz, birden gider.

- `PantrixPopover` (`com.pantrixui.components.overlay.popover`, `com.pantrixui:components`): Bir öğenin yanında, onun hakkında daha fazlasını gösteren bir katman; dışarıya basmak, Escape ya da geri onu kapatır; modal değil, öğeye bağlıdır. Anahtar sözcükler: açılır panel, yüzen panel, bilgi paneli, katman, açılır kutu.

## Özellikler

- **Başlık.** `title` popover'ın başında durur ve içerik kayarken yerinde kalır. Bir satırdan uzun her popover'a verilir.
- **İçerik.** `content` başlığın altında bir sütundur: bir metin, bir bağlantı, birkaç düğme.
- **Yön ve hiza.** `side` popover'ın çapanın hangi yanında açılacağını, `alignment` o yan boyunca nasıl hizalanacağını söyler: söylenmezse altta açılır ve çapaya ortalanır. İstenen yanda yer yoksa karşı yana geçer.
- **Pencerenin içinde.** Pencerenin kenarlarına, sistem çubuklarına ve klavyeye stilin `margin`'inden fazla yaklaşmaz ve o yerden büyük olmaz: içeriği satır atlar, sığmayan başlığın altında kayar.
- **Kapatılamayan popover.** `dismissible = false` ile dışına basmak, geri tuşu ve Escape kapanmasını istemez: yalnızca içindeki bir şeyin kapattığı popover için.
- **Klavye.** Klavyeyle açılınca odağı alır: ilk kontrolü, kontrolü yoksa popover'ın kendisi. O zaman ok tuşları, Page Up ve Page Down, boşluk, Home ve End içeriği kaydırır. Tab içinde kalır; kapanınca odak çapaya, onu açan kontrole döner.
- **Dokunma ve fare.** Dokunarak ya da tıklayarak açılınca odak olduğu yerde kalır; klavye devreye girince popover odağı alır. Açıkken altındaki sayfa odak göstermez.
- **Renkler ve stil.** `colors` (`PopoverColors`) dolguyu, başlığın ve kenar çizgisinin rengini; `style` (`PopoverStyle`) köşeleri, genişlikleri, en çok yüksekliği, gölgeyi ve çapaya uzaklığı verir. Yalnızca verilen alanlar değişir, gerisi temanın kalır.
- **Platformlar.** Popover her platformda aynı görünür; fark stildedir. En geniş hâli Android'de ve iOS'ta 320, masaüstünde ve web'de 360 dp'dir; köşeleri Android'de ve iOS'ta temanın orta, masaüstünde ve web'de küçük köşesidir.
- **Ekran okuyucu.** Popover açılırken başlığı duyurulur; başlık içeriğin başlığıdır. Çevresinde basılacak bir scrim olmadığı için ekran okuyucu onu kendi kapatma eylemiyle kapatır.

## Kullanım

### More about a row, beside the button that asks for it

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixIconButton(
            imageVector = PantrixIcons.Info,
            contentDescription = stringResource(Res.string.details),
            onClick = { open = true },
            tagKey = "details"
        )
    },
    title = stringResource(Res.string.delivery),
    tagKey = "delivery"
) {
    PantrixText(text = stringResource(Res.string.delivery_window, window))
    PantrixLink(text = stringResource(Res.string.track), onClick = onTrack, tagKey = "track")
}
```

### Beside a field, on the end side in a wide window

```kotlin
PantrixPopover(
    visible = help,
    onDismissRequest = { help = false },
    anchor = { PantrixTextField(state = iban, label = stringResource(Res.string.iban), tagKey = "iban") },
    side = PopoverSide.End,
    alignment = PopoverAlignment.Start,
    tagKey = "iban_help"
) {
    PantrixText(text = stringResource(Res.string.iban_help))
}
```

## Örnekler

### Bilgi

En yalın hâli: bir satırın yanındaki bilgi düğmesi popover'ı açar; içinde satır hakkında daha fazlası ve bir bağlantı var. Popover'ın açık olup olmadığı ekranın durumudur (`visible`). Popover kendini kapatmaz: kapanmak istediğinde `onDismissRequest`'i çağırır, `visible`'ı false yapan bu koddur. İçindeki bir kontrole basmak kapanmasını istemez: bağlantı popover'ı kendi `onClick`'inde kapatır.

Dışına basmak, geri tuşu ve Escape kapatır. Klavyeyle açılınca odak bağlantıdadır; kapanınca düğmeye döner. Kartın "Son olay" satırı en son ne olduğunu söyler.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Teslimat: Salı")
    PantrixPopover(
        visible = open,
        onDismissRequest = {
            open = false
            report("Teslimat popover'ı kapatıldı")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.Info,
                contentDescription = "Teslimat ayrıntıları",
                onClick = { open = true },
                tagKey = "open_delivery"
            )
        },
        title = "Teslimat",
        tagKey = "delivery"
    ) {
        PantrixText(text = "Salı günü 09.00 ile 12.00 arasında gelir. Kurye on dakika önce arar.")
        PantrixLink(
            text = "Kargoyu izle",
            onClick = {
                open = false
                report("Kargo izleme açıldı")
            },
            tagKey = "track"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Yön ve hiza

`side` popover'ın çapanın hangi yanında açılacağını, `alignment` o yan boyunca nasıl hizalanacağını söyler. Söylenmezse popover altta açılır ve çapaya ortalanır: `PopoverSide.Bottom` ve `PopoverAlignment.Center`.

Baş ve Son yazı yönüne göre değişir: soldan sağa bir düzende Baş soldur. Popover çapanın yanındayken (Baş ya da Son) hiza dikeydir: Baş üst kenarları, Son alt kenarları buluşturur.

İstenen yanda yer yoksa popover karşı yana geçer: Üst'ü seç ve düğme pencerenin üst kenarına yakınken aç. İki yanda da yer yoksa popover istenen yanda kalır ve pencerenin içine, çapanın üstüne kayar.

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
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverSide

var open by rememberSaveable { mutableStateOf(false) }
var side by rememberSaveable { mutableStateOf(PopoverSide.Bottom) }
var alignment by rememberSaveable { mutableStateOf(PopoverAlignment.Center) }
val report = LocalExampleEvents.current
PantrixSegmentButton(options = SIDES, selected = side, onSelect = { side = it }, tagKey = "side")
PantrixSegmentButton(
    options = ALIGNMENTS,
    selected = alignment,
    onSelect = { alignment = it },
    tagKey = "alignment"
)
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
    PantrixPopover(
        visible = open,
        onDismissRequest = {
            open = false
            report("Popover kapatıldı")
        },
        anchor = {
            PantrixButton(
                text = "Aç",
                onClick = { open = true },
                variant = ButtonVariant.Outline,
                tagKey = "open_placed"
            )
        },
        side = side,
        alignment = alignment,
        tagKey = "placed"
    ) {
        PantrixText(text = "side = ${side.name}, alignment = ${alignment.name}")
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

Pencerenin bitiş kenarına yakın bir çapa. Popover çapasına ortalanır; çapa kenara yakınken ortalanan popover pencereden taşardı. Taşmaz: kenardan stilin `margin`'i kadar içeride kalacak şekilde kayar.

Dar bir pencerede dene: daraltılacak olan, uygulamanın kendi penceresidir. Popover yerini gerçek pencereye göre seçer, bir kartın pencere seçicisinin örneğine verdiği pencereye göre değil; bu kartta o seçici bu yüzden yoktur. Yeterince geniş bir pencerede kartın yanında popover'a yer kalır; orada popover kaymaz, düğmeye ortalanır.

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
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
    PantrixPopover(
        visible = open,
        onDismissRequest = {
            open = false
            report("Kenardaki popover kapatıldı")
        },
        anchor = {
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "Paylaşım ayrıntıları",
                onClick = { open = true },
                tagKey = "open_shared"
            )
        },
        title = "Paylaşım",
        tagKey = "shared"
    ) {
        PantrixText(text = "Bu klasörü üç kişi görebiliyor: Ada, Deniz ve Umut.")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Alanın yanında

Bir alanın ne beklediğini söyleyen popover. Çapa alanın tamamıdır: popover alanın altında, `alignment = PopoverAlignment.End` ile sonuna hizalı açılır. Açan, alanın sonundaki bilgi düğmesidir.

Popover açıkken altındaki sayfa odak göstermez: alana yazarken açarsan, popover açıkken alan durgun çizilir. Kapanınca odak yine çapadadır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val iban = rememberTextFieldState()
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("IBAN yardımı kapatıldı")
    },
    anchor = {
        PantrixTextField(
            state = iban,
            modifier = Modifier.fillMaxWidth(),
            label = "IBAN",
            placeholder = "TR00 0000 0000 0000 0000 0000 00",
            trailingIcon = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Info,
                    contentDescription = "IBAN nedir?",
                    onClick = { open = true },
                    size = ButtonSize.Small,
                    tagKey = "open_iban_help"
                )
            },
            tagKey = "iban"
        )
    },
    alignment = PopoverAlignment.End,
    title = "IBAN",
    tagKey = "iban_help"
) {
    PantrixText(text = "TR ile başlayan 26 haneli hesap numarası. Banka uygulamanda hesap ayrıntılarında yazar.")
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Onay

Küçük bir onay: geniş bir pencerede bir dialog yerine, işin başladığı düğmenin yanında. İçinde bir cümle ve iki düğme var; her düğme popover'ı kendi `onClick`'inde kapatır.

Güvenli seçenek önce gelir: klavyeyle açılınca odak ilk kontrolde, "Vazgeç"tedir. `alignment = PopoverAlignment.Start` popover'ı düğmenin başına hizalar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Silme onayı kapatıldı")
    },
    anchor = {
        PantrixButton(
            text = "Dosyayı sil…",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_confirm"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Dosya silinsin mi?",
    tagKey = "delete_file"
) {
    PantrixText(text = "Rapor.pdf her cihazdan kaldırılır.")
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(
            text = "Vazgeç",
            onClick = {
                open = false
                report("Silmekten vazgeçildi")
            },
            variant = ButtonVariant.Text,
            tagKey = "cancel_delete"
        )
        PantrixButton(
            text = "Sil",
            onClick = {
                open = false
                report("Dosya silindi")
            },
            variant = ButtonVariant.Destructive,
            tagKey = "confirm_delete"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Seçmek zorunlu

`dismissible = false`: dışına basmak, geri tuşu ve Escape bir şey yapmaz, ekran okuyucunun kapatma eylemi de yoktur. Kapatması gereken şey içindedir: çıkış iki düğmedir. `dismissible` yalnızca böyle, içindeki bir şeyin kapattığı bir popover için false yapılır.

`onDismissRequest` boş bırakıldı: bu popover'da hiç çağrılmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {},
    anchor = {
        PantrixButton(
            text = "Çerez tercihi",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_cookies"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Çerezler",
    dismissible = false,
    tagKey = "cookies"
) {
    PantrixText(text = "Ölçüm çerezlerine izin veriyor musun?")
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(
            text = "Yalnız gerekli",
            onClick = {
                open = false
                report("Yalnız gerekli çerezler")
            },
            variant = ButtonVariant.Text,
            tagKey = "cookies_needed"
        )
        PantrixButton(
            text = "İzin ver",
            onClick = {
                open = false
                report("Çerezlere izin verildi")
            },
            tagKey = "cookies_all"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Uzun içerik

Otuz satır stilin en çok yüksekliğine (`PopoverStyle.maxHeight`) sığmaz: popover o yükseklikte kalır, başlık yerinde durur ve içerik altında kayar.

İçinde odaklanacak bir kontrol yoktur. Bu yüzden klavyede odağı popover'ın kendisi alır ve kaydıran tuşlar içeriği kaydırır: ok tuşları, Page Up ve Page Down, boşluk, Home ve End.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Sürüm notları kapatıldı")
    },
    anchor = {
        PantrixButton(
            text = "Sürüm notları",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_notes"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Sürüm notları",
    tagKey = "notes"
) {
    (1..30).forEach { number -> PantrixText(text = "$number. değişiklik: küçük bir düzeltme.") }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kendi stili

`style` yalnızca bu popover'ın geometrisini değiştirir: `PopoverStyle`'ın verilen alanları değişir, gerisi temanın ve platformun stilinden gelir. Burada popover en çok 220dp genişliğindedir ve metin o genişlikte satır atlar; köşeleri temanın büyük köşesidir (`ShapeRole.Large`) ve çapasından 16dp uzakta durur.

Çapaya uzaklık (`gap`) temanın yoğunluğuyla ölçeklenir; en çok genişlik ve köşeler ölçeklenmez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverStyle
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixPopover(
    visible = open,
    onDismissRequest = { open = false },
    anchor = {
        PantrixButton(
            text = "Kısayollar",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_shortcuts"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Kısayollar",
    style = PopoverStyle(shape = ShapeRole.Large, maxWidth = 220.dp, gap = 16.dp),
    tagKey = "shortcuts"
) {
    PantrixText(text = "Ctrl+F arar, F5 yeniler. Del seçili dosyayı siler; geri almak için Ctrl+Z.")
}
```

### Kendi renkleri

`colors` popover'a temanın değil, verilen renkleri verir: burada temanın hiçbir rolünde olmayan, uygulamanın kendi moru. `PopoverColors`'ın yalnızca verilen alanları değişir, gerisi temanın kalır.

`PopoverColors` dolguyu, başlığı ve kenar çizgisini boyar; içeriğin rengi onda yoktur. Rolü olmayan bir dolguda içeriğin rengini içeriği yazan verir: buradaki metin `color = own.onContainer` ile yazıldı. Dolgu temanın bir rolünün rengiyse, `PantrixTheme.colors.info.container` gibi, başlık ve içerik kendiliğinden o rolün eş rengini alır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverColors

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Pro popover'ı kapatıldı")
    },
    anchor = {
        PantrixButton(
            text = "Pro nedir?",
            onClick = { open = true },
            variant = ButtonVariant.Outline,
            tagKey = "open_pro"
        )
    },
    alignment = PopoverAlignment.Start,
    title = "Pro",
    colors = PopoverColors(container = own.container, title = own.onContainer, border = own.color),
    tagKey = "pro"
) {
    PantrixText(text = "Sınırsız proje, paylaşılan klasörler ve öncelikli destek.", color = own.onContainer)
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.
- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Başka temadaki bir bölümde

Sayfanın tersi renkte bir bölüm ve içinden açılan bir popover. Bölüm ikinci bir temadır (`PantrixTheme(darkTheme = …)`): açık sayfada koyu, koyu sayfada açık. Popover o temanın içinde çağrıldığı için onun renklerindedir: katmanı pencerenin kökünde kurulsa da çağrıldığı yerin temasını taşır.

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
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixPopover(
                visible = open,
                onDismissRequest = {
                    open = false
                    report("Bölümün popover'ı kapatıldı")
                },
                anchor = {
                    PantrixButton(text = "Bu bölümden aç", onClick = { open = true }, tagKey = "open_in_part")
                },
                alignment = PopoverAlignment.Start,
                title = "Bu bölüm",
                tagKey = "in_part"
            ) {
                PantrixText(text = "Bölümün temasında açıldı.")
            }
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dar pencerede sheet

`presentation = OverlayPresentation.Adaptive`: dar bir pencerede popover alttan bir sheet olur, başlığı sheet'in başlığı, içeriği altında; daha geniş pencerede düğmenin yanında bir popover. Karttaki pencere seçicisinden "Dar" ile "Geniş" arasında geç. Popover'ın varsayılanı her pencerede `Popover`'dır: bir bilgi kutusu çoğu zaman yanında kalmalıdır.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.popover.PantrixPopover

var open by rememberSaveable { mutableStateOf(false) }
// Kartın penceresi örnek kadar uzundur: dar bir pencerede açılan sheet'e yer kalsın diye örnek uzun tutulur.
Column(Modifier.fillMaxWidth().height(280.dp)) {
    PantrixPopover(
        visible = open,
        onDismissRequest = { open = false },
        anchor = { PantrixButton(text = "Teslimat", onClick = { open = true }, tagKey = "open_adaptive_popover") },
        title = "Teslimat",
        tagKey = "adaptive_popover",
        presentation = OverlayPresentation.Adaptive
    ) {
        PantrixText("Salı günü dokuz ile on iki arasında gelir; kurye on dakika önce arar.")
        PantrixButton(text = "Kargoyu izle", onClick = { open = false }, tagKey = "adaptive_track")
    }
}
```

## API

### PantrixPopover

`import com.pantrixui.components.overlay.popover.PantrixPopover`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixPopover(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    anchor: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopoverSide = PopoverSide.Bottom,
    alignment: PopoverAlignment = PopoverAlignment.Center,
    title: String? = null,
    dismissible: Boolean = true,
    style: PopoverStyle? = null,
    colors: PopoverColors? = null,
    tagKey: String? = null,
    presentation: OverlayPresentation = OverlayPresentation.Popover,
    content: @Composable ColumnScope.() -> Unit
)
```

Bir öğenin yanında duran ve o öğe hakkında, öğenin kendisinin gösterebileceğinden fazlasını taşıyan katman: bir durumun ne anlama geldiği, bir alanın ne beklediği, bir satır için birkaç kontrol.

Bir çapaya bağlıdır, modal değildir: scrim yoktur, uygulama çevresinde görünmeye devam eder ve içerik kaydıkça popover çapasıyla birlikte yer değiştirir. Pencerede orada yer oldukça çapanın `side` ile verilen yanında, yer yoksa karşı yanında durur ve `alignment`'ın söylediği gibi hizalanır. Pencerenin kenarlarına, sistem çubuklarına ve klavyeye stilin kenar boşluğundan fazla yaklaşmaz. O yerden büyük de olmaz: içindekiler satır atlar ve başlığın altında kayar.

Popover kendini hiçbir zaman kapatmaz. `dismissible` false olmadıkça dışına basmak, Escape ve geri tuşu `onDismissRequest`'i çağırır. `visible`'ı false yapan çağırandır. Dışarıya ilk basış yalnızca kapanmasını ister: altındaki şeye basılmış olmaz, bu yüzden çapaya basmak popover'ı kapatır ve yeniden açmaz. Kapanması söylendikten sonra kimseye engel olmaz: solarken yapılan bir basış uygulamaya gider.

Klavyeyle açılınca odağı alır: ilk kontrolü alır, kontrolü yoksa popover'ın kendisi. O zaman ok tuşları, Page Up ve Page Down, boşluk, Home ve End içindekileri kaydırır. Dokunarak ya da tıklayarak açılınca odağı olduğu yerde bırakır, klavye devreye girince alır. Tab içinde kalır. Kapanınca odak çapadadır: onu açan kontrolde. Popover açıkken altındaki uygulama, bir dialog'un altındaki gibi, odak göstermez.

**Çıkışının görünmesi için kapatılır.** Kapalı bir popover çapasından başka hiçbir şey kurmaz. Bu yüzden onu ağaçta `visible = false` ile bırakmanın bedeli yoktur ve popover temanın hareketiyle çıkar. Açıkken kompozisyondan çıkarılan popover bu hareket olmadan gider, bedeli de yalnızca budur: katmanı penceresinin kökünde kurulur, bu yüzden içeriğini ölçerken atan bir yerleşim, dal değiştiren bir `BoxWithConstraints` gibi, pencerenin hâlâ ölçmekte olduğu bir katmanı kapatmış olmaz.

Her platformda aynı görünür. Fark `PopoverStyle`'dadır: köşeler, genişlikler ve gölge.

Parametreler:

- `visible: Boolean`: Popover'ın görünüp görünmediği. Temanın hareketiyle girer ve çıkar.
- `onDismissRequest: () -> Unit`: `dismissible` açıkken dışına basılınca, Escape'e ya da geri tuşuna basılınca çağrılır. Popover, `visible` false olana kadar kalır.
- `anchor: @Composable () -> Unit`: Popover'ın yanında durduğu şey: onu açan kontrol. Bu kontrol, popover'ın çağrıldığı yerde ve o yerin istediği gibi yerleşir. Popover onun yerleşim kutusuna göre konumlanır, dokunma hedefinin kapladığı yer de bu kutunun içindedir.
- `modifier: Modifier`: Popover'ın kendisine, katmanının içinde uygulanır. Çapaya uygulanmaz.
- `side: PopoverSide`: Popover'ın çapanın hangi yanını tercih ettiği. `PopoverSide.Start` ve `PopoverSide.End` yazı yönünü izler.
- `alignment: PopoverAlignment`: Popover'ın o yan boyunca çapayla nasıl hizalanacağı.
- `title: String?`: Popover'ın en üstündeki başlık. Altındakiler kayarken görünür kalır ve popover açılırken ekran okuyucu onu duyurur. Bir satırdan uzun her popover'a verilir.
- `dismissible: Boolean`: Dışına basmanın, Escape'in, geri tuşunun ve ekran okuyucunun kapatma eyleminin kapanmasını isteyip istemediği. Yalnızca `content`'teki bir şeyin kapattığı bir popover için false yapılır.
- `style: PopoverStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: PopoverColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `tagKey: String?`: otomasyon için yerele bağlı olmayan bir anahtar: popover'ın etiketi `Popover_<tagKey>`'dir, çizildiği hâliyle popover'ın üstünde, sheet olarak gösterildiğinde de sheet'in üstünde.
- `presentation: OverlayPresentation`: popover'ın nasıl gösterildiği: varsayılan çapanının yanında; pencerenin altından bir sheet olarak, başlığı `title`, altında `content`, yanlarında popover'ın kendi boşluğuyla; ya da dar bir pencerede biri, daha geniş pencerede öteki. Açılırken seçilir, kapanana kadar kalır.
- `content: @Composable ColumnScope.() -> Unit`: Popover'ın içindekiler, başlığın altında bir sütun hâlinde.

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

### PopoverStyle

`import com.pantrixui.components.overlay.popover.PopoverStyle`, `com.pantrixui:components` içinden

```kotlin
class PopoverStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified
) : PantrixStyle<PopoverStyle>
```

`PantrixPopover`'ın geometrisi: ne kadar genişleyip yükseldiği, çapasından ne kadar uzakta durduğu ve pencerenin kenarlarına ne kadar yaklaştığı.

Popover'ın iç boşluğu ve içindekilerin arasındaki aralıklar temanın boşluk ölçeğinden gelir, bu yüzden yoğunlukla ölçeklenir. Çapaya uzaklık, kenar boşluğu ve en az genişlik de ölçeklenir. En çok genişlik, en çok yükseklik, köşeler ve gölge ölçeklenmez. Popover'ın renkleri stilinin parçası değildir: temanındır, kendi renkleri olan bir çağrıda `PopoverColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Popover'ın köşeleri: Android'de ve iOS'ta temanın orta, masaüstünde ve web'de küçük köşesidir.
- `minWidth: Dp`: Popover'ın en az genişliği: içinde ne kadar az şey olursa olsun bundan dar olmaz.
- `maxWidth: Dp`: Popover'ın en çok genişliği: daha uzun metin satır atlar.
- `maxHeight: Dp`: Popover'ın en çok yüksekliği: bunu aşan içerik başlığın altında kayar.
- `elevation: Dp`: Popover'ın uygulamanın üstünde ne kadar yüksekte durduğu, yani gölgesinin ne kadar büyük olduğu.
- `gap: Dp`: Çapa ile popover'ın arası.
- `margin: Dp`: Popover ile pencerenin kenarları arasında, bir de pencereyi orada örten şeylerle arasında boş bırakılan yer: bir sistem çubuğu, bir ekran çentiği, klavye.

### PopoverColors

`import com.pantrixui.components.overlay.popover.PopoverColors`, `com.pantrixui:components` içinden

```kotlin
data class PopoverColors(
    public val container: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir çağrı için `PantrixPopover`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

```kotlin
PantrixPopover(…, colors = PopoverColors(container = PantrixTheme.colors.info.container))
```

Burada verilen `container` temanın rol renklerinden biriyse, popover'ın içindekiler temanın o renkle eşlediği rengi alır; başlık da, bir başlık rengi verilmedikçe. Hiçbir rolde olmayan bir dolguda bu olmaz: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Popover'ın dolgusu. Temanın `surface`'ı.
- `title: Color`: Başlık. Temanın `textPrimary`'si.
- `border: Color`: Popover'ın çevresindeki ince çizgi: popover'ı, altında duran kendi rengindeki bir yüzeyden ayırır, gölgenin az göründüğü koyu temada olduğu gibi. Temanın kendi zeminlerinde temanın `divider`'ıdır. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `title`'ın bir payıdır: Subtle bir düğmenin kenarı gibi. Saydam bir renk verilirse çizgi çizilmez.

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
