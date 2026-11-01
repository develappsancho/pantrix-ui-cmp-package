# Alert

Kullanıcının o an yaptığı işle ilgili bir mesaj, ilgili olduğu şeyin yanında: az önce gönderilen form, silinmek üzere olan satır, bir kez daha bakılması gereken alan.

Alert içeriğin içinde durur, bulunduğu yerin genişliğindedir ve ekran onu kaldırana kadar kalır. Uygulamanın az önce yaptığı bir şeyi birkaç saniyeliğine, bütün ekranın üstünde söyleyen ise snackbar'dır.

- `PantrixAlert` (`com.pantrixui.components.container.alert`, `com.pantrixui:components`): Kullanıcının yaptığı şey hakkında, ilgili olduğu şeyin yanında duran bir mesaj: altı ton, çizmenin üç yolu, bir eylem ve bir kapatma düğmesi. Anahtar sözcükler: uyarı, satır içi mesaj, duyuru, bilgi kutusu, mesaj barı, ikaz.

## Özellikler

- **Altı ton.** `tone` alert'in rengini, ikonunu ve nasıl duyurulduğunu seçer. Anlamlı dört ton, `Info`, `Success`, `Warning` ve `Danger`, işin nasıl gittiğini üç yoldan söyler: renk tek başına onu göremeyene ulaşmaz. `Primary` ve `Neutral` bunu söylemez ve kendi ikonları yoktur.
- **Üç çizim.** `variant`: `Soft` tonun soluk dolgusu, `Outline` dolgusuz bir kenar, `Accent` dolguyla birlikte baş kenarda bir çubuk: soldan sağa düzende solda, sağdan sola düzende sağda.
- **Bağlantılı mesaj.** `message` bir `AnnotatedString` da olabilir: içindeki `LinkAnnotation` alert'in yazı renginde, altı çizili bir bağlantı olur.
- **Başlık ve ikon.** `title` mesajın üstünde, daha kalın bir satırdır. `icon` tonun kendi ikonunun yerine başka bir ikon koyar ya da null ile ikonu kaldırır.
- **Eylem.** `action` mesajın altına, bitiş kenarına bir ya da iki küçük düğme koyar.
- **Kapatma.** `onDismiss` verilince bir kapatma düğmesi çıkar. Alert kendiliğinden kaybolmaz: çağıran onu göstermeyi bırakana kadar durur.
- **Ekran okuyucu.** Başlık ve mesaj tek parça okunur, eylem ve kapatma düğmesi onlardan sonra. Alert belirdiğinde ya da değiştiğinde duyurulur: `Danger` araya girerek, ötekiler sırasını bekleyerek. `announce = false` kapatır.
- **İlk satır.** İkon ve kapatma düğmesi, yazı ne kadar büyütülürse büyütülsün, metnin ilk satırında durur. İkonlu ve ikonsuz alert aynı yüksekliktedir.
- **Platform.** Köşeler Android'de ve iOS'ta orta, masaüstünde ve web'de küçüktür; iç boşluk 12dp ve 10dp, çubuk 4dp ve 3dp'dir (`AlertStyle`).
- **Yazı.** `textStyle` mesajın yazısını, başlık onun kalınıyla, değiştirir; ikon ve kapatma düğmesi o yazının ilk satırında durur.
- **Kendi renkleri.** `AlertColors` dolguyu, yazının ve tonu işaretleyenlerin rengini, `border` ikondan ayrı bir kenarın rengini verir; ikonu ve duyurulma biçimini yine ton belirler.
- **Otomasyon.** `tagKey` ile alert `Alert_<tagKey>`, kapatma düğmesi `AlertClose_<tagKey>` olur. Bir kapatma, tonu ve çizimiyle bildirilir; mesajıyla hiçbir zaman.

## Kullanım

### What went wrong with the form

```kotlin
if (error != null) {
    PantrixAlert(message = error, tone = AlertTone.Danger, tagKey = "form_error")
}
```

### A standing note inside a card

```kotlin
PantrixAlert(
    message = stringResource(Res.string.archived_records_cannot_be_edited),
    variant = AlertVariant.Outline,
    title = stringResource(Res.string.read_only),
    announce = false,
    tagKey = "read_only"
)
```

### A warning with an action, which the user can close

```kotlin
if (showStorageWarning) {
    PantrixAlert(
        message = stringResource(Res.string.storage_almost_full),
        tone = AlertTone.Warning,
        variant = AlertVariant.Accent,
        action = {
            PantrixButton(
                text = stringResource(Res.string.manage_storage),
                onClick = onManageStorage,
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                colors = PantrixTheme.colors.warning.buttonColors(ButtonVariant.Text)
            )
        },
        onDismiss = { showStorageWarning = false },
        tagKey = "storage"
    )
}
```

## Örnekler

### Mesaj ve başlık

En az yazılan hâli yalnızca `message`'dır: ton `Info`, çizim `Soft` olur, ikon tondan gelir. Alert bulunduğu yerin genişliğini doldurur.

`title` mesajın üstüne daha kalın yazılan bir satır koyar: alert'in neyle ilgili olduğunu birkaç sözcükle söyler. Ekran okuyucu başlığı ve mesajı tek parça duyar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.PantrixAlert

PantrixAlert(message = "Profil fotoğrafınız güncellendi", tagKey = "plain")
PantrixAlert(
    message = "Yeni adresinize bir doğrulama bağlantısı gönderdik",
    title = "E-postanızı doğrulayın",
    tagKey = "titled"
)
```

### Altı ton

`tone` temanın bir renk rolüdür; alert'in rengini, ikonunu ve ekran okuyucuya nasıl duyurulduğunu birlikte seçer. Anlamlı dört ton üç yoldan ulaşır: renk, ikon ve duyurulma biçimi. `Danger` araya girerek duyurulan tek tondur.

`Primary` ve `Neutral` işin nasıl gittiğini söylemez; ikonları yoktur. Onlardaki alert, çevresindeki metinden ayrılmış bir nottur: denenecek bir özellik, gözü çağırmayan bir bilgi.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert

PantrixAlert(message = "Yeni sürüm kurulmaya hazır", tagKey = "info")
PantrixAlert(message = "Değişiklikleriniz kaydedildi", tone = AlertTone.Success, tagKey = "success")
PantrixAlert(message = "Depolama alanınız dolmak üzere", tone = AlertTone.Warning, tagKey = "warning")
PantrixAlert(message = "Mesaj gönderilemedi", tone = AlertTone.Danger, tagKey = "danger")
PantrixAlert(message = "Yeni düzenleyiciyi deneyin", tone = AlertTone.Primary, tagKey = "primary")
PantrixAlert(message = "Son açılış: dün", tone = AlertTone.Neutral, tagKey = "neutral")
```

### Üç çizim

`variant` alert'in nasıl çizildiğini seçer: soluk dolgu, yalnızca kenar ya da dolguyla birlikte baş kenarda bir çubuk. `Soft` varsayılandır ve bir sayfanın üstünde istenen odur. `Accent` alt alta duran uyarıları bir bakışta ayırır.

`Outline` bir kart ya da bir dialog içindir: soluk bir dolgu onların kendi dolgusunda kaybolurdu. Buradaki, dolgulu bir kartın içinde: kendi dolgusu olmadığı için kartın dolgusu görünür ve yazısı kartın üstünde okunan renkle yazılır. Bu alert'in `announce`'u da false: kullanıcı gelmeden önce orada duran bir not, belirdiğinde duyurulmaz.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard

PantrixAlert(
    message = "Soluk dolgu: sayfanın üstünde böyle durur",
    title = "Soft",
    tagKey = "soft"
)
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixAlert(
        message = "Arşivlenmiş kayıtlar değiştirilemez",
        variant = AlertVariant.Outline,
        title = "Outline: salt okunur",
        // Kullanıcı geldiğinde zaten buradaydı: ekran okuyucu ona sırası gelince ulaşır.
        announce = false,
        tagKey = "outline"
    )
}
PantrixAlert(
    message = "Alt alta duran uyarılar bir bakışta ayrılır",
    tone = AlertTone.Success,
    variant = AlertVariant.Accent,
    title = "Accent",
    tagKey = "accent"
)
```

### İkonu değiştirmek ve kaldırmak

`icon` yazının önündeki işarettir: verilmezse tonun kendi ikonu, null verilirse hiçbiri. `Primary` ve `Neutral` tonun kendi ikonu yoktur; burada ikisine birer ikon verildi. İkon hiçbir zaman okunmaz: neyi anlattığını mesaj söyler.

İkonlu ve ikonsuz alert aynı yüksekliktedir: metnin ilk satırı, yanında ikon olsun olmasın bir ikon kadar yer tutar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.foundation.icons.PantrixIcons

PantrixAlert(message = "İkonu kaldırılmış bir bilgi notu", icon = null, tagKey = "no_icon")
PantrixAlert(
    message = "Favorilerinize eklendi",
    tone = AlertTone.Primary,
    icon = PantrixIcons.Star,
    tagKey = "star_icon"
)
PantrixAlert(
    message = "Toplantı yarın 10.00'da",
    tone = AlertTone.Neutral,
    icon = PantrixIcons.Calendar,
    tagKey = "calendar_icon"
)
```

### Eylem ve kapatma

İki eylemi ve kapatma düğmesi olan uyarı. `action` düğmeleri mesajın altına, bitiş kenarına koyar. Metin düğmesinin kendi rengi markanınkidir; tonun rolünden alınan `buttonColors(ButtonVariant.Text)` onu tonun renginde çizer ve tonun dolgusunda o okunur.

`onDismiss` verildiği için bir kapatma düğmesi var. Çarpıya ya da "Sonra"ya bas: alert'i kaldıran alert değil, ekranın durumudur; yerine onu geri getiren düğme gelir. Ekran okuyucu kullanan biri alert'i düğmeyi aramadan, kapatma eylemiyle de kapatır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var shown by rememberSaveable { mutableStateOf(true) }
// Metin düğmesinin kendi rengi markanınkidir; uyarının dolgusunda tonun kendi rengi okunur.
val inTheTone = PantrixTheme.colors.warning.buttonColors(ButtonVariant.Text)
if (shown) {
    PantrixAlert(
        message = "Yeni fotoğraflar yedeklenemeyebilir",
        tone = AlertTone.Warning,
        variant = AlertVariant.Accent,
        title = "Depolama alanınız dolmak üzere",
        action = {
            PantrixButton(
                text = "Sonra",
                onClick = { shown = false },
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                colors = inTheTone,
                tagKey = "storage_later"
            )
            PantrixButton(
                text = "Yönet",
                onClick = { scope.launch { snackbars?.show(message = "Depolama açıldı", tagKey = "storage") } },
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                colors = inTheTone,
                tagKey = "storage_manage"
            )
        },
        onDismiss = { shown = false },
        tagKey = "storage"
    )
} else {
    PantrixButton(
        text = "Uyarıyı yeniden göster",
        onClick = { shown = true },
        variant = ButtonVariant.Outline,
        tagKey = "storage_again"
    )
}
```

### Form hatası

Gönderilince hata veren bir form. "Gönder"e bas: hata alert'i o anda düğmenin üstünde belirir. Tonu `Danger` olduğu için ekran okuyucuya hemen, o an söylediğinin arasına girerek duyurulur. Çarpı onu kaldırır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.elements.button.PantrixButton

var failed by rememberSaveable { mutableStateOf(false) }
if (failed) {
    PantrixAlert(
        message = "Adresi denetleyip birkaç dakika sonra yeniden deneyin",
        tone = AlertTone.Danger,
        title = "Gönderilemedi",
        onDismiss = { failed = false },
        tagKey = "form_error"
    )
}
PantrixButton(text = "Gönder", onClick = { failed = true }, tagKey = "form_send")
```

### Bağlantılı mesaj

Mesaj bir `AnnotatedString` da olabilir: bir sözcüğü kalın yazmak ya da bir bağlantı koymak için. Bağlantı bir `LinkAnnotation`'dır; alert onu yazısının renginde ve altı çizili çizer. `LinkAnnotation.Clickable` basılınca uygulamanın kendi işini yapar, `LinkAnnotation.Url` adresi tarayıcıda açar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withLink
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.PantrixAlert

val report = LocalExampleEvents.current
PantrixAlert(
    message = buildAnnotatedString {
        append("Bu sayfa bir sonraki sürümde kalkacak. Yerine ")
        withLink(LinkAnnotation.Clickable(tag = "guide") { report("Yeni rehber açıldı") }) {
            append("yeni rehbere")
        }
        append(" bakın.")
    },
    tone = AlertTone.Warning,
    title = "Eski sayfa",
    tagKey = "with_link"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kendi renkleriyle

Dolgusu, yazısı ve işaretlerinin rengi dışarıdan verilen bir alert. `AlertColors` üç renk alır: dolgu (`container`), yazı (`content`) ve tonu işaretleyenler (`accent`): ikon, `Outline`'ın kenarı ve `Accent`'in çubuğu. Verilmeyen renk tonunki kalır. İkonu ve duyurulma biçimi yine tonundan gelir: değişen yalnızca neyle boyandığıdır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.alert.AlertColors
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixAlert(
    message = "Dolgusu, yazısı ve işaretlerinin rengi dışarıdan verildi",
    variant = AlertVariant.Accent,
    colors = AlertColors(container = own.container, content = own.onContainer, accent = own.color),
    tagKey = "own"
)
PantrixText(
    text = "Renkler AlertColors ile verilir; verilmeyen renk tonunki kalır.",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stiliyle

`style` alert'in geometrisini değiştirir: köşeleri, iç boşluğu, parçalarının arasını, `Outline`'ın kenarının ve `Accent`'in çubuğunun kalınlığını. Yalnızca verilen alanlar değişir, gerisi platformun stilinden gelir.

Üçüncüsü bir not: dolgusu ve ikonu tonun, kenarı onlardan ayrı bir renkte (`AlertColors(border = …)`), iç boşluğu yatayda ve dikeyde ayrı (`horizontalPadding`, `verticalPadding`), yazısı temanın `label`'ı (`textStyle`): ikon ve kapatma düğmesi o yazının ilk satırında durur, rengi yine alert'indir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.alert.AlertColors
import com.pantrixui.components.container.alert.AlertStyle
import com.pantrixui.components.container.alert.AlertTone
import com.pantrixui.components.container.alert.AlertVariant
import com.pantrixui.components.container.alert.PantrixAlert
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeSpec

PantrixAlert(
    message = "Köşeli, çubuk 8dp",
    tone = AlertTone.Success,
    variant = AlertVariant.Accent,
    style = AlertStyle(shape = ShapeSpec.Fixed(RectangleShape), accentWidth = 8.dp),
    tagKey = "own_style_accent"
)
PantrixAlert(
    message = "İç boşluk 20dp, kenar 2dp",
    tone = AlertTone.Warning,
    variant = AlertVariant.Outline,
    style = AlertStyle(padding = 20.dp, borderWidth = 2.dp),
    tagKey = "own_style_outline"
)
PantrixAlert(
    message = "Kenar dolgudan ve ikondan ayrı bir renkte; iç boşluk yatayda 14, dikeyde 10dp; yazı etiket boyunda",
    tone = AlertTone.Warning,
    style = AlertStyle(horizontalPadding = 14.dp, verticalPadding = 10.dp),
    colors = AlertColors(border = PantrixTheme.colors.warning.color.copy(alpha = 0.45f)),
    tagKey = "own_style_note",
    textStyle = PantrixTheme.typography.label
)
```

## API

### PantrixAlert

`import com.pantrixui.components.container.alert.PantrixAlert`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAlert(
    message: String,
    modifier: Modifier = Modifier,
    tone: AlertTone = AlertTone.Info,
    variant: AlertVariant = AlertVariant.Soft,
    title: String? = null,
    icon: ImageVector? = tone.icon(),
    action: (@Composable RowScope.() -> Unit)? = null,
    onDismiss: (() -> Unit)? = null,
    announce: Boolean = true,
    style: AlertStyle? = null,
    colors: AlertColors? = null,
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.body
)
```

Kullanıcının o an yaptığı işle ilgili bir mesaj; ilgili olduğu şeyin yanında gösterilir: az önce gönderilen form, silinmek üzere olan satır, bir kez daha bakılması gereken tek alan.

İçeriğin içinde, o şeyin yanında durur ve bulunduğu yerin genişliğindedir. Ekran onu kaldırana kadar kalır: uygulamanın az önce yaptığını birkaç saniyeliğine, bütün ekranın üstünde söyleyen ise snackbar'dır.

Anlamlı bir ton kullanıcıya üç yoldan ulaşır: renkle, ikonla ve ekran okuyucuya duyurulma biçimiyle. Çünkü renk tek başına, onu göremeyene ulaşmaz. Ekran okuyucu başlığı ve mesajı tek parça duyar, eylemi ve kapatma düğmesini onlardan sonra.

İkon ve kapatma düğmesi, yazı ne kadar büyütülürse büyütülsün, bir madde imi gibi metnin ilk satırında durur. O satır, yanında ikon olsun olmasın, bir ikon kadar yüksektir; böylece alt alta duran alert'ler aynı yüksekliktedir. Kapatma düğmesi düzende çarpısı kadar yer tutar; alert bu düğme yüzünden uzamaz, düğmenin dokunma hedefi ise çevresindeki boşluğa taşar.

Parametreler:

- `message: String`: Ne olduğu ya da ne bilinmesi gerektiği: bir iki cümle.
- `modifier: Modifier`: Alert'in modifier'ı. Alert kendisine verilen genişliği doldurur.
- `tone: AlertTone`: Alert'in ne söylediği: renkleri, ikonu ve duyurulma biçimi.
- `variant: AlertVariant`: Nasıl çizildiği: soluk bir dolgu, yalnızca bir kenar ya da dolguyla birlikte bir çubuk.
- `title: String?`: Mesajın üstünde, daha kalın yazılan bir satır: alert'in neyle ilgili olduğunu birkaç sözcükle söyler.
- `icon: ImageVector?`: Yazının önündeki işaret: başkası verilmezse tonun kendi ikonu, null verilirse hiçbiri. Primary ve Neutral tonundaki alert'in kendi ikonu yoktur. Hiçbir zaman okunmaz: neyi anlattığını mesaj söyler. `icon`: Tonun kendi ikonu; Primary ve Neutral tonundaki alert'in ikonu yoktur.
- `action: (@Composable RowScope.() -> Unit)?`: Kullanıcının bu konuda yapabileceği şey; mesajın altında, bitiş kenarında durur: bir ya da iki küçük düğme. Metin düğmesinin kendi rengi markanınkidir: `PantrixTheme.colors.warning.buttonColors(ButtonVariant.Text)` onu tonun renginde çizer ve tonun dolgusunda o renk okunur. Oradaki bir düğme çizildiği kadar yer tutar: çevresinde bir parmağın istediği yer alert'in iç boşluğuna taşar ve alert bu yüzden uzamaz.
- `onDismiss: (() -> Unit)?`: Kapatma düğmesine basıldığında ya da ekran okuyucunun kapatma eylemi kullanıldığında çağrılır. Null verilirse düğme konmaz. Alert, çağıran onu göstermeyi bırakana kadar kalır.
- `announce: Boolean`: Alert belirdiğinde ya da değiştiğinde ekran okuyucuya duyurulup duyurulmayacağı: `AlertTone.Danger` araya girerek, ötekiler sırasını bekleyerek duyurulur. Kullanıcı gelmeden önce orada duran bir alert için kapatılır, bir kaydın değiştirilemeyeceğini söyleyen bir not gibi: ekran okuyucu ona sırası gelince ulaşır.
- `style: AlertStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: AlertColors?`: Bu alert'in, tonundan gelmeyen kendi renkleri: burada verilenler kullanılır, gerisi tonunki kalır.
- `tagKey: String?`: Alert'in otomasyon anahtarı: alert `Alert_<tagKey>`, kapatma düğmesi `AlertClose_<tagKey>` olarak etiketlenir. Bir kapatma `Alert` olayı olarak bildirilir: `dismiss`, tonu ve çizimiyle; mesajıyla hiçbir zaman.
- `textStyle: TextStyle`: mesajın yazı stili, başlığınki de onun kalını: verilmezse temanın `body`'si. İçindeki bir renk yazının değildir; yazının rengi alert'inkidir.

### PantrixAlert

`import com.pantrixui.components.container.alert.PantrixAlert`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAlert(
    message: AnnotatedString,
    modifier: Modifier = Modifier,
    tone: AlertTone = AlertTone.Info,
    variant: AlertVariant = AlertVariant.Soft,
    title: String? = null,
    icon: ImageVector? = tone.icon(),
    action: (@Composable RowScope.() -> Unit)? = null,
    onDismiss: (() -> Unit)? = null,
    announce: Boolean = true,
    style: AlertStyle? = null,
    colors: AlertColors? = null,
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.body
)
```

Sözcüklerden fazlasını taşıyan bir mesaj için `PantrixAlert`: kod olarak yazılan bir değer, kalın yazılan bir sözcük, daha fazlasını söyleyen sayfaya bir bağlantı. Öteki biçim gibi çizilir, duyurulur ve bildirilir; ekran okuyucu mesajın sözcüklerini başlıkla birlikte duyar ve her bağlantıya, eyleme ulaştığı gibi, ayrı ayrı ulaşır.

Kendi stilini taşımayan bir bağlantı alert'te bir bağlantı olarak çizilir: altı çizili, alert'in yazdığı renkte; böylece tonun dolgusunda okunur. Kendi stilini taşıyan onu korur.

```kotlin
PantrixAlert(
    message = buildAnnotatedString {
        append("Put the token in ")
        withStyle(SpanStyle(fontFamily = FontFamily.Monospace)) { append("gradle.properties") }
        append(", never in the project. ")
        withLink(LinkAnnotation.Url(tokensHelpUrl)) { append("How to make one") }
    },
    tone = AlertTone.Warning,
    tagKey = "token"
)
```

Parametreler:

- `message: AnnotatedString`: Ne olduğu ya da ne bilinmesi gerektiği, aralıkları ve bağlantılarıyla.
- `modifier: Modifier`: Alert'in modifier'ı. Alert kendisine verilen genişliği doldurur.
- `tone: AlertTone`: Alert'in ne söylediği: renkleri, ikonu ve duyurulma biçimi.
- `variant: AlertVariant`: Nasıl çizildiği: soluk bir dolgu, yalnızca bir kenar ya da dolguyla birlikte bir çubuk.
- `title: String?`: Mesajın üstünde, daha kalın yazılan bir satır: alert'in neyle ilgili olduğunu birkaç sözcükle söyler.
- `icon: ImageVector?`: Yazının önündeki işaret: başkası verilmezse tonun kendi ikonu, null verilirse hiçbiri. `icon`: Tonun kendi ikonu; Primary ve Neutral tonundaki alert'in ikonu yoktur.
- `action: (@Composable RowScope.() -> Unit)?`: Kullanıcının bu konuda yapabileceği şey; mesajın altında, bitiş kenarında durur: bir ya da iki küçük düğme.
- `onDismiss: (() -> Unit)?`: Kapatma düğmesine basıldığında ya da ekran okuyucunun kapatma eylemi kullanıldığında çağrılır. Null verilirse düğme konmaz.
- `announce: Boolean`: Alert belirdiğinde ya da değiştiğinde ekran okuyucuya duyurulup duyurulmayacağı.
- `style: AlertStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır.
- `colors: AlertColors?`: Bu alert'in, tonundan gelmeyen kendi renkleri.
- `tagKey: String?`: Alert'in otomasyon anahtarı: alert `Alert_<tagKey>`, kapatma düğmesi `AlertClose_<tagKey>` olarak etiketlenir.
- `textStyle: TextStyle`: mesajın yazı stili, başlığınki de onun kalını: verilmezse temanın `body`'si. İçindeki bir renk yazının değildir; yazının rengi alert'inkidir.

### AlertTone

`import com.pantrixui.components.container.alert.AlertTone`, `com.pantrixui:components` içinden

```kotlin
enum class AlertTone
```

Bir alert'in kullanıcıya ne söylediği: temanın renk rollerinden biridir; alert'in ikonunu ve nasıl duyurulduğunu da o belirler.

Anlamlı tonlar, `Info`, `Success`, `Warning` ve `Danger`, bir işin nasıl gittiğini söyler ve kullanıcıya hem renkle hem ikonla ulaşır, çünkü renk tek başına onu göremeyene ulaşmaz. `Primary` ve `Neutral` bunu söylemez ve kendi ikonları yoktur: onlardaki bir alert, çevresindeki metinden ayrılmış bir nottur.

Değerleri:

- `Info`: Bilinmeye değer, ne iyi ne kötü bir şey.
- `Success`: Başarılı olan bir şey.
- `Warning`: Soruna dönüşmeden önce bakılması gereken bir şey.
- `Danger`: Başarısız olan bir şey. Araya girerek duyurulan tek tondur: ekran okuyucunun o an söylediğini keser.
- `Primary`: Uygulamanın fark edilmesini istediği bir şey, markanın renginde ve ikonsuz: denenecek bir özellik, bir teklif.
- `Neutral`: Kendi rengi olmayan, temanın grisinde, ikonsuz bir not: gözü çağırmayan bir şey.

### AlertVariant

`import com.pantrixui.components.container.alert.AlertVariant`, `com.pantrixui:components` içinden

```kotlin
enum class AlertVariant
```

Bir alert'in, neyin üstünde durursa dursun görünebilmesi için nasıl çizildiği.

Değerleri:

- `Soft`: Tonun soluk dolgusu. Varsayılandır ve bir sayfanın üstünde istenen odur.
- `Outline`: Tonun renginde bir kenar, dolgusuz: bir kart ya da bir dialog içindir; soluk bir dolgu onların kendi dolgusunda kaybolurdu.
- `Accent`: Soluk dolgu ve baş kenarı boyunca bir çubuk: alt alta duran alert'ler içindir, bir bakışta ayrılırlar.

### AlertStyle

`import com.pantrixui.components.container.alert.AlertStyle`, `com.pantrixui:components` içinden

```kotlin
class AlertStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val contentGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val accentWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified
) : PantrixStyle<AlertStyle>
```

`PantrixAlert`'in geometrisi: köşeleri, içindekilerin çevresindeki ve parçalarının arasındaki boşluk, bir de çizimlerinin çektiği iki çizgi, yani çepeçevre bir kenar ya da baş kenar boyunca bir çubuk.

Boşluk yoğunlukla ölçeklenir; köşeler ve çizgiler ölçeklenmez: onlar hava değildir. Bir alert'in renkleri stilinin parçası değildir: `AlertTone`'undan ve `AlertVariant`'ından, kendi renkleri olan bir alert'te ise `AlertColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Alert'in köşeleri: Android'de ve iOS'ta orta, masaüstünde ve web'de küçük.
- `padding: Dp`: Alert'in kenarı ile içindekiler arasındaki boşluk: Android'de ve iOS'ta 12dp, masaüstünde ve web'de 10dp.
- `contentGap: Dp`: İkon ile metin arasındaki ve metin ile kapatma düğmesi arasındaki boşluk: 8dp.
- `borderWidth: Dp`: `AlertVariant.Outline`'ın kenarının kalınlığı: 1dp.
- `accentWidth: Dp`: `AlertVariant.Accent`'in çubuğunun genişliği: Android'de ve iOS'ta 4dp, masaüstünde ve web'de 3dp.
- `horizontalPadding: Dp`: Alert'in baş ve son kenarlarıyla içindekiler arasındaki boşluk, `padding` değilse: her platformda belirtilmemiştir, bu da `padding`'i alır.
- `verticalPadding: Dp`: Alert'in üst ve alt kenarlarıyla içindekiler arasındaki boşluk, `padding` değilse: her platformda belirtilmemiştir, bu da `padding`'i alır.

### AlertColors

`import com.pantrixui.components.container.alert.AlertColors`, `com.pantrixui:components` içinden

```kotlin
data class AlertColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val accent: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Tonunun renklerini almayan bir `PantrixAlert`'in boyandığı renkler: verilen renk kullanılır, verilmeyen tonunki kalır.

```kotlin
PantrixAlert(
    message = stringResource(Res.string.new_version_ready),
    colors = AlertColors(container = brand.container, content = brand.onContainer, accent = brand.color)
)
```

Alert'in ikonu ve duyurulma biçimi yine tonundan gelir: değişen yalnızca neyle boyandığıdır.

Burada verilen dolgu bir rolün kendi dolgusuysa, temanın onunla eşleştirdiği rengi getirir: üstüne yazılanlar için de, ikon ve çizgiler için de, bunlar da ayrıca verilmediği sürece. Hiçbir rolde olmayan bir dolgu ise getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Alert'in dolgusu. Tonunun rolünün `container`'ıdır; `AlertVariant.Outline`'da yoktur: o, alert'in üstünde durduğu şeyi gösterir.
- `content: Color`: Başlığın, mesajın, kapatma düğmesindeki çarpının ve kendi rengi yoksa eylemin rengi: `container` üstünde okunan renk. Tonunun rolünün `onContainer`'ıdır. Alert'in dolgusu olmayan `AlertVariant.Outline`'da yoktur: metni, alert'in durduğu yerdeki herhangi bir metin gibi çizilir; sayfada `textPrimary` ile, çevresindeki bir dolgunun üstünde o dolgunun içerik rengiyle.
- `accent: Color`: Tonu işaretleyen: ikon, `border` verilmedikçe `AlertVariant.Outline`'ın kenarı ve `AlertVariant.Accent`'in çubuğu. Tonunun rolünün `color`'ı.
- `border: Color`: Alert'in çevresini saran kenar, stilin `borderWidth` kalınlığında, ikonun renginde değilse: bir renk verilen her biçimdeki alert onu çizer, dolgusunun üstünde ve `AlertVariant.Accent`'in çubuğunun yanında. Verilmezse `AlertVariant.Outline`'ın kenarı `accent`'tir, öteki iki biçim kenar çizmez.
