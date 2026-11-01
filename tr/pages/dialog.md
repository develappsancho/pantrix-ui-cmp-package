# Dialog

Uygulamayı durdurup kullanıcıdan bir karar isteyen, ya da görmeden geçilmemesi gereken bir haberi veren pencere. Pencerenin ortasında, bir scrim'in üstünde durur ve her platformda modaldır: arkasındaki hiçbir şeye basılamaz, Tab içinden çıkmaz.

Dialog kendini kapatmaz. `visible` true olduğu sürece görünür; scrim'e basmak, geri tuşu ve Escape `onDismissRequest`'i çağırır, eylemlerin düğmeleri kendi `onClick`'lerini. Kapatan, `visible`'ı false yapan çağıran koddur.

- `PantrixDialog` (`com.pantrixui.components.overlay.dialog`, `com.pantrixui:components`): Uygulamanın üstünde modal bir karar ya da mesaj: bir başlık, bir mesaj ya da içerik ve eylemler; kapanana kadar odak içinde kalır. Anahtar sözcükler: dialog, diyalog, onay, uyarı penceresi, açılır pencere, onayla.

## Özellikler

- **Başlık, mesaj, eylemler.** `title` kısa bir soru ya da cümledir, `message` altındaki açıklama. `actions` sona yaslı düğmelerdir; yan yana sığmadıklarında alt satıra geçerler.
- **Güvenli seçenek önce.** Klavyeyle açılan dialog'da odak ilk kontrolde, çoğunlukla ilk eylemde başlar; bu yüzden "Vazgeç", "Sil"den önce yazılır. Dokunarak açılınca odak yerinde kalır.
- **İkon.** `icon` başlığın üstünde durur ve başlığı ortalar. Süstür: ekran okuyucu onu okumaz.
- **Kendi içeriği.** `content` mesajın altına bir form alanı ya da bir seçenek listesi koyar.
- **Genişlik.** Başlık, mesaj ve eylemlerden oluşan dialog en geniş parçası kadar geniştir, stilin iki genişliği arasında: kısa bir soru dardır, uzun bir mesaj en geniş hâlinde alt satıra geçer. İçerik taşıyan dialog olabildiğince geniştir.
- **Uzun gövde.** Pencere kısaysa yalnızca mesaj ve içerik kayar; başlık ve eylemler yerinde kalır.
- **Kapatılamayan dialog.** `dismissible = false` ile scrim, geri tuşu ve Escape bir şey yapmaz; çıkış yalnızca eylemlerdir.
- **Kapanırken ağaçta kalır.** Kapalı bir dialog hiçbir şey kurmaz: ağaçta `visible = false` ile durur ve temanın hareketiyle çıkar. Açıkken kompozisyondan çıkarılan dialog hareketsiz, bir anda gider.
- **Renk ve stil.** `colors` zemini, başlığı, mesajı, ikonu ve scrim'i değiştirir; `style` köşeleri, genişlikleri, pencereyle arasındaki boşluğu, gölgeyi ve ikonun boyutunu. Dialog her platformda aynı görünür; fark stildedir: köşeler Android'de ve iOS'ta büyük, masaüstünde ve web'de orta yuvarlaktır, iOS'ta gölge yoktur.
- **Ekran okuyucu.** Başlık dialog açılınca duyurulur ve içindekilerin başlığıdır. Android'de TalkBack dialog'un içinde kalır. Kapatılabilen dialog'da scrim, içerikten sonra okunan tek bir "Kapat" eylemidir.

## Kullanım

### Confirm a destructive action

```kotlin
PantrixDialog(
    visible = confirmDelete,
    onDismissRequest = { confirmDelete = false },
    title = stringResource(Res.string.delete_file_title),
    message = stringResource(Res.string.delete_file_message),
    actions = {
        PantrixButton(
            text = stringResource(Res.string.cancel),
            onClick = { confirmDelete = false },
            variant = ButtonVariant.Text,
            tagKey = "cancel"
        )
        PantrixButton(
            text = stringResource(Res.string.delete),
            onClick = onDelete,
            variant = ButtonVariant.Destructive,
            tagKey = "delete"
        )
    },
    tagKey = "delete_file"
)
```

### A form in a dialog

```kotlin
PantrixDialog(
    visible = renaming,
    onDismissRequest = { renaming = false },
    title = stringResource(Res.string.rename_file),
    actions = {
        PantrixButton(
            text = stringResource(Res.string.cancel),
            onClick = { renaming = false },
            variant = ButtonVariant.Text,
            tagKey = "cancel"
        )
        PantrixButton(text = stringResource(Res.string.rename), onClick = onRename, tagKey = "rename")
    },
    tagKey = "rename_file"
) {
    PantrixTextField(state = name, label = stringResource(Res.string.file_name), tagKey = "file_name")
}
```

## Örnekler

### Onay

Geri alınamayan bir işin onayı: bir başlık, bir mesaj ve iki eylem. Dialog kendini kapatmaz: scrim'e basmak, geri tuşu ve Escape `onDismissRequest`'i çağırır, eylemler kendi `onClick`'lerini; üçünde de kapatan `open = false` satırıdır. Kartın "Son olay" satırı en son hangisinin olduğunu söyler.

Güvenli seçenek önce gelir: "Vazgeç", `Destructive` "Sil"den önce yazılır. Klavyeyle açılınca odak ondadır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Dosyayı sil…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_delete"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Silme dialog'u kapatıldı")
    },
    title = "Dosya silinsin mi?",
    message = "Rapor.pdf her cihazdan kaldırılır. Bu işlem geri alınamaz.",
    actions = {
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
    },
    tagKey = "delete_file"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### İkonlu

`icon` başlığın üstünde durur ve başlık ortalanır. İkon süstür: anlamı başlık taşır, ekran okuyucu ikonu okumaz.

Tek eylemli bir bildirim: araya girecek kadar önemli bir haber. Scrim'e basmak, geri tuşu ve Escape onu da kapatır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Oturumu sonlandır",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_session"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Oturum dialog'u kapatıldı")
    },
    title = "Oturumun süresi doldu",
    message = "Güvenliğin için çıkış yapıldı. Kaldığın yerden devam etmek için yeniden giriş yap.",
    icon = PantrixIcons.Info,
    actions = {
        PantrixButton(
            text = "Yeniden giriş yap",
            onClick = {
                open = false
                report("Yeniden giriş yapıldı")
            },
            tagKey = "sign_in_again"
        )
    },
    tagKey = "session"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Form

`content` mesajın altına çağıranın içeriğini koyar: burada dosyanın yeni adını alan bir alan. İçerik taşıyan dialog, kısa bir başlıkla bile olabildiğince geniştir: alan o yeri doldurur. "Kaydet" ad boşken kapalıdır.

Dokunarak açılınca odak alana geçmez: klavye kendiliğinden açılmaz. Klavyeyle açılınca odak ilk kontrolde başlar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.foundation.text.input.setTextAndPlaceCursorAtEnd
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val name = rememberTextFieldState()
PantrixButton(
    text = "Yeniden adlandır…",
    onClick = {
        name.setTextAndPlaceCursorAtEnd("Rapor")
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "open_rename"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Yeniden adlandırma kapatıldı")
    },
    title = "Dosyayı yeniden adlandır",
    actions = {
        PantrixButton(
            text = "Vazgeç",
            onClick = {
                open = false
                report("Yeniden adlandırmaktan vazgeçildi")
            },
            variant = ButtonVariant.Text,
            tagKey = "cancel_rename"
        )
        PantrixButton(
            text = "Kaydet",
            onClick = {
                open = false
                report("Yeni ad: ${name.text}")
            },
            enabled = name.text.isNotBlank(),
            tagKey = "confirm_rename"
        )
    },
    tagKey = "rename_file"
) {
    PantrixTextField(state = name, modifier = Modifier.fillMaxWidth(), label = "Dosya adı", tagKey = "file_name")
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Seçmek zorunlu

`dismissible = false`: scrim, geri tuşu ve Escape bir şey yapmaz, `onDismissRequest` çağrılmaz. Ekran okuyucuya scrim'in "Kapat" eylemi de sunulmaz.

Kullanıcı eylemlerden birini seçmek zorundadır; bu yüzden her çıkış için bir eylem bulunur: koşulları kabul etmeyen "Çıkış yap"a basar. Yalnızca kullanıcının seçmesi gereken yerde kullanılır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Koşulları göster",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_terms"
)
PantrixDialog(
    visible = open,
    onDismissRequest = { report("Bu çağrılmaz: dialog kapatılamaz") },
    title = "Koşullar güncellendi",
    message = "Devam etmek için yeni kullanım koşullarını kabul etmen gerekiyor.",
    dismissible = false,
    actions = {
        PantrixButton(
            text = "Çıkış yap",
            onClick = {
                open = false
                report("Koşullar reddedildi")
            },
            variant = ButtonVariant.Text,
            tagKey = "decline_terms"
        )
        PantrixButton(
            text = "Kabul et",
            onClick = {
                open = false
                report("Koşullar kabul edildi")
            },
            tagKey = "accept_terms"
        )
    },
    tagKey = "terms"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Uzun içerik

Pencereye sığmayan bir gövde: kırk satırlık sürüm notları. Yalnızca gövde kayar; başlık ve eylem yerinde, görünür kalır. Mesaj da içerikle birlikte kayar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.dialog.PantrixDialog

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Sürüm notları",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_notes"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Sürüm notları kapatıldı")
    },
    title = "Sürüm notları",
    message = "Bu sürümle gelen değişiklikler.",
    actions = {
        PantrixButton(
            text = "Tamam",
            onClick = {
                open = false
                report("Sürüm notları okundu")
            },
            tagKey = "close_notes"
        )
    },
    tagKey = "release_notes"
) {
    RELEASE_NOTES.forEachIndexed { index, note ->
        PantrixText(text = "${index + 1}. $note", tagKey = "note_$index")
    }
}

private val RELEASE_NOTES = List(size = 40) { index ->
    when (index % 4) {
        0 -> "Dosyalar artık sürüklenerek klasörlere taşınıyor."
        1 -> "Paylaşılan klasörlerde kimin ne değiştirdiği görünüyor."
        2 -> "Arama, dosya içindeki metni de buluyor."
        else -> "Çevrimdışıyken yapılan değişiklikler bağlantı gelince eşitleniyor."
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kısa soru, uzun mesaj

Başlık, mesaj ve eylemlerden oluşan dialog en geniş parçası kadar geniştir, stilin iki genişliği arasında. Kısa bir soru en dar hâlindedir (`DialogStyle.minWidth`); uzun bir mesaj en geniş hâlinde (`maxWidth`) alt satıra geçer.

İkisini sırayla aç: fark geniş bir pencerede belirgindir. İlki aynı zamanda en az yazılan dialog'dur: bir başlık ve eylemler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var asking by rememberSaveable { mutableStateOf(false) }
var telling by rememberSaveable { mutableStateOf(false) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Kısa bir soru",
        onClick = { asking = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_sign_out"
    )
    PantrixButton(
        text = "Uzun bir mesaj",
        onClick = { telling = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_sync_paused"
    )
}
PantrixDialog(
    visible = asking,
    onDismissRequest = { asking = false },
    title = "Çıkış yapılsın mı?",
    actions = {
        PantrixButton(text = "Vazgeç", onClick = { asking = false }, variant = ButtonVariant.Text, tagKey = "stay")
        PantrixButton(text = "Çıkış yap", onClick = { asking = false }, tagKey = "sign_out")
    },
    tagKey = "sign_out"
)
PantrixDialog(
    visible = telling,
    onDismissRequest = { telling = false },
    title = "Eşitleme duraklatıldı",
    message = "Cihaz mobil veriye geçtiği için dosyaların eşitlenmesi duraklatıldı. Wi-Fi'a bağlanınca kaldığı " +
        "yerden sürer; beklemek istemiyorsan ayarlardan mobil veride eşitlemeyi açabilirsin.",
    actions = {
        PantrixButton(text = "Tamam", onClick = { telling = false }, tagKey = "sync_paused_ok")
    },
    tagKey = "sync_paused"
)
```

### Kendi renkleri

`colors` ile verilen renkler değişir, verilmeyen temanın kalır: burada zemin, başlık, mesaj ve ikon uygulamanın kendi morunda, scrim temanın.

Bu mor temanın hiçbir rolünde yok; bu yüzden üstünde okunan başlık ve mesaj rengini de çağıran verir. Zemin temanın bir rol rengi olsaydı başlık, mesaj ve ikon o rolle eşlenen rengi kendiliğinden alırdı.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.DialogColors
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixButton(
    text = "Planı yükselt",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_upgrade"
)
PantrixDialog(
    visible = open,
    onDismissRequest = {
        open = false
        report("Yükseltme dialog'u kapatıldı")
    },
    title = "Pro'ya geç",
    message = "Sınırsız proje, paylaşılan klasörler ve öncelikli destek.",
    icon = PantrixIcons.Star,
    colors = DialogColors(
        container = own.container,
        title = own.onContainer,
        message = own.onContainer,
        icon = own.color
    ),
    actions = {
        PantrixButton(
            text = "Şimdi değil",
            onClick = {
                open = false
                report("Yükseltme ertelendi")
            },
            variant = ButtonVariant.Text,
            tagKey = "later"
        )
        PantrixButton(
            text = "Yükselt",
            onClick = {
                open = false
                report("Plan yükseltildi")
            },
            tagKey = "upgrade"
        )
    },
    tagKey = "upgrade"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.
- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stili

`style` yalnızca bu çağrının geometrisini değiştirir: köşeler temanın en küçük yuvarlaklığında (`ShapeRole.ExtraSmall`), en fazla genişlik 360dp, ikon 40dp. Verilmeyen alanlar, en az genişlik, pencereyle arasındaki boşluk ve gölge, platformun stilinden gelir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.DialogStyle
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixButton(
    text = "Klasörü paylaş…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_share_folder"
)
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Klasör paylaşılsın mı?",
    message = "Bağlantıyı bilen herkes Raporlar klasöründeki dosyaları görebilir.",
    icon = PantrixIcons.Folder,
    style = DialogStyle(shape = ShapeRole.ExtraSmall, maxWidth = 360.dp, iconSize = 40.dp),
    actions = {
        PantrixButton(
            text = "Vazgeç",
            onClick = { open = false },
            variant = ButtonVariant.Text,
            tagKey = "cancel_share_folder"
        )
        PantrixButton(text = "Paylaş", onClick = { open = false }, tagKey = "confirm_share_folder")
    },
    tagKey = "share_folder"
)
```

### Başka temadaki bir bölümde

Sayfanın tersi renkte bir bölüm ve içinden açılan bir dialog. Bölüm ikinci bir temadır (`PantrixTheme(darkTheme = …)`); dialog da o temanın içinde çağrıldığı için onun renklerindedir: açık sayfada koyu, koyu sayfada açık bir dialog açılır.

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
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixButton(text = "Bu bölümden aç", onClick = { open = true }, tagKey = "open_in_part")
        }
    }
    PantrixDialog(
        visible = open,
        onDismissRequest = {
            open = false
            report("Bölümün dialog'u kapatıldı")
        },
        title = "Değişiklikler kaydedilsin mi?",
        message = "Kaydetmezsen bu bölümde yaptıkların kaybolur.",
        actions = {
            PantrixButton(
                text = "Kaydetme",
                onClick = {
                    open = false
                    report("Değişiklikler atıldı")
                },
                variant = ButtonVariant.Text,
                tagKey = "discard"
            )
            PantrixButton(
                text = "Kaydet",
                onClick = {
                    open = false
                    report("Değişiklikler kaydedildi")
                },
                tagKey = "save"
            )
        },
        tagKey = "save_changes"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kapanırken ağaçta kalan dialog

Kapalı bir dialog hiçbir şey kurmaz; bu yüzden ağaçta `visible = false` ile durur ve kapanırken temanın hareketiyle çıkar. İlk dialog böyledir.

İkincisi bir `if`'in içindedir: kapanınca kompozisyondan çıkar ve hareketsiz, bir anda gider. Kaybedilen yalnızca çıkış hareketidir. İkisini sırayla kapat ve çıkışlarına bak; hareketin azaltıldığı temada ikisi de bir anda gider.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var kept by rememberSaveable { mutableStateOf(false) }
var removed by rememberSaveable { mutableStateOf(false) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Ağaçta kalan",
        onClick = { kept = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_kept"
    )
    PantrixButton(
        text = "Ağaçtan çıkarılan",
        onClick = { removed = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_removed"
    )
}
PantrixDialog(
    visible = kept,
    onDismissRequest = { kept = false },
    title = "Hareketle çıkar",
    message = "Kapalıyken de ağaçta: visible = false olunca temanın hareketiyle çıkar.",
    actions = { PantrixButton(text = "Kapat", onClick = { kept = false }, tagKey = "close_kept") },
    tagKey = "kept"
)
if (removed) {
    PantrixDialog(
        visible = true,
        onDismissRequest = { removed = false },
        title = "Bir anda gider",
        message = "Kapanınca kompozisyondan çıkar: çıkış hareketi oynamaz.",
        actions = { PantrixButton(text = "Kapat", onClick = { removed = false }, tagKey = "close_removed") },
        tagKey = "removed"
    )
}
```

## API

### PantrixDialog

`import com.pantrixui.components.overlay.dialog.PantrixDialog`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDialog(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    title: String? = null,
    actions: @Composable RowScope.() -> Unit,
    modifier: Modifier = Modifier,
    message: String? = null,
    icon: ImageVector? = null,
    dismissible: Boolean = true,
    style: DialogStyle? = null,
    colors: DialogColors? = null,
    tagKey: String? = null,
    content: (@Composable ColumnScope.() -> Unit)? = null
)
```

Kullanıcı onunla ilgilenene kadar uygulamayı durduran bir karar ya da mesaj.

Dialog pencerenin ortasında, bir scrim'in üstünde durur ve her platformda modaldır: arkasındaki hiçbir şeye basılamaz, Tab içinden çıkmaz, Android'de TalkBack içinde kalır. `visible` true olduğu sürece gösterilir, temanın hareketiyle girer ve çıkar. Kendini hiçbir zaman gizlemez. Geri tuşu, Escape ve scrim'e basmak, `dismissible` false olmadıkça `onDismissRequest`'i çağırır. Çağıranın `actions`'a koyduğu eylemler yalnızca kendi `onClick`'lerini çağırır: dialog'u bitiren bir eylem `visible`'ı orada false yapar.

Klavye kullanan biri ilk kontrolde, çoğunlukla ilk eylemde başlar, bu yüzden güvenli seçeneği başa koy: "Vazgeç", "Sil"den önce. Başlık dialog açılınca duyurulur ve içindekilerin başlığıdır. Başlığı olmayan bir dialog'da, `title` null ya da boşsa, onun yerinde bir şey kalmaz: tuttukları en üstten başlar.

**Çıkışını görmek için kapat.** Kapanmış bir dialog hiçbir şey kurmaz, bu yüzden onu ağaçta `visible = false` ile bırakmak hiçbir şeye mal olmaz ve dialog temanın hareketiyle çıkar. Açıkken kompozisyondan çıkarılan dialog bu hareket olmadan gider ve kaybedilen yalnızca budur: penceresi, çevresindeki pencerenin kökünde kurulur; bu yüzden içeriğini ölçerken atan bir yerleşim, hâlâ ölçülmekte olan bir katmanı kapatmış olmaz.

Her platformda aynı görünür; farklar `DialogStyle`'dadır: köşeler, genişlikler ve gölge. Başlık, mesaj ve eylemlerden oluşan bir dialog, stilin iki genişliği arasında, en geniş parçası kadar geniştir: kısa bir soru dardır, uzun bir mesaj en geniş hâlinde alt satıra geçer. `content` taşıyan bir dialog olabildiğince geniştir, böylece içindeki bir alana ya da listeye yer kalır.

Parametreler:

- `visible: Boolean`: Dialog'un gösterilip gösterilmediği. Temanın hareketiyle girer ve çıkar.
- `onDismissRequest: () -> Unit`: `dismissible` iken geri tuşunda, Escape'te ve scrim'e basılınca çağrılır. Dialog, `visible` false olana kadar kalır.
- `title: String?`: Dialog'un ne hakkında olduğu, kısa bir soru ya da cümle olarak: "Bu dosya silinsin mi?". Olmayacaksa null ya da boş: ona satır ayrılmaz ve dialog açılınca ekran okuyucu bir ad duyurmaz.
- `actions: @Composable RowScope.() -> Unit`: Sona yaslı, sığmadıklarında alt satıra geçen düğmeler. Kendi test etiketlerini korurlar.
- `modifier: Modifier`: Dialog'un kendisine uygulanır. Pencereyle arasında bıraktığı boşluk dialog'un parçası değildir.
- `message: String?`: Başlığın altındaki açıklama. Pencere kısaysa `content` ile birlikte kayar.
- `icon: ImageVector?`: Başlığın üstünde duran, süs olan bir ikon; verilince başlık ortalanır.
- `dismissible: Boolean`: Geri tuşunun, Escape'in ve scrim'e basmanın kapatmayı isteyip istemediği. Yalnızca kullanıcının `actions`'tan birini seçmesi gereken yerde false ver.
- `style: DialogStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: DialogColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `tagKey: String?`: Otomasyon için, dilden bağımsız bir anahtar: dialog'un test etiketi `Dialog_<tagKey>` olur ve çizildiği hâliyle dialog'un kendisine verilir.
- `content: (@Composable ColumnScope.() -> Unit)?`: Dialog'un taşıdığı başka her şey, mesajın altında: bir form alanı, bir seçenek listesi.

### DialogStyle

`import com.pantrixui.components.overlay.dialog.DialogStyle`, `com.pantrixui:components` içinden

```kotlin
class DialogStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<DialogStyle>
```

`PantrixDialog`'un geometrisi.

İç boşluk ile başlığın, mesajın ve eylemlerin arasındaki aralıklar temanın boşluk ölçeğinden gelir, bu yüzden yoğunlukla ölçeklenir. En az genişlik ve kenar boşluğu da ölçeklenir. En çok genişlik, köşeler, gölge ve ikon ölçeklenmez. Dialog'un renkleri stilinin parçası değildir: temanındır, kendi renkleri olan bir çağrıda `DialogColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Dialog'un köşeleri: Android'de ve iOS'ta büyük, masaüstünde ve web'de orta yuvarlaktır.
- `minWidth: Dp`: Dialog'un en az genişliği: başlığı, mesajı ve eylemleri ne kadar kısa olursa olsun bundan dar olmaz.
- `maxWidth: Dp`: Dialog'un en çok genişliği: daha uzun metin alt satıra geçer. Çağıranın içeriğini taşıyan dialog bu genişliktedir.
- `margin: Dp`: Dialog ile pencerenin kenarları arasında boş bırakılan yer: böylece küçük bir pencerede de dialog'un çevresinde scrim görünür. `minWidth` ile iki kenar boşluğunun toplamından dar bir pencere dialog'a kalan yeri verir.
- `elevation: Dp`: Dialog'un scrim'in üstünde ne kadar yüksekte durduğu, yani gölgesinin ne kadar büyük olduğu. iOS'ta gölge yoktur.
- `iconSize: Dp`: Başlığın üstündeki ikonun boyutu.

### DialogColors

`import com.pantrixui.components.overlay.dialog.DialogColors`, `com.pantrixui:components` içinden

```kotlin
data class DialogColors(
    public val container: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val message: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir çağrı için `PantrixDialog`'un boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

```kotlin
PantrixDialog(…, colors = DialogColors(icon = PantrixTheme.colors.danger.color))
```

Burada verilen `container` temanın rol renklerinden biriyse başlık, mesaj ve ikon, kendilerine ayrıca renk verilmedikçe, temanın o renkle eşlediği rengi alır. Hiçbir rolde olmayan bir zeminde bu olmaz: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Dialog'un zemini. Temanın `surface`'ı.
- `title: Color`: Başlık. Temanın `textPrimary`'si.
- `message: Color`: Başlığın altındaki mesaj. Temanın `textSecondary`'si.
- `icon: Color`: Başlığın üstündeki ikon. `primary` rolünün `color`'ı.
- `scrim: Color`: Dialog'un arkasında, uygulamanın üstüne serilen scrim, kendi alfasıyla. Temanın `scrim`'i.
