# Filled Text Area

Dolgulu kutuda birkaç satırlık metin: bir yorum, bir mesaj, bir not. Etiket kutunun içindedir: alan boşken ve odakta değilken ilk satırın yerinde durur, alan odak alınca ya da metin yazılınca metnin üstüne çıkar. Kutu boşken en az satırı kadardır, yazıldıkça satır satır uzar, en çok satırına varınca metin kutunun içinde kayar ve kutunun sonundaki ince çubuk ne kadar kaydığını gösterir. Kutusu ve yardım metni `PantrixFilledTextField`'ınkidir; onun stilini ve renklerini alır.

- `PantrixFilledTextArea` (`com.pantrixui.components.inputs.filledtextarea`, `com.pantrixui:components`): Bir TextFieldState üzerinde, etiketi kutunun içinde kayan, yazısıyla büyüyüp sonra kayan dolgulu ve çok satırlık bir yazı alanı: boyutunu değiştiren bir tutamaç, sayacıyla yumuşak ya da katı bir karakter sınırı, Ctrl ya da Cmd ile Enter'da gönderme, yardım ve hata metni, ikonlar, temizle düğmesi ve form bağlantısıyla. Anahtar sözcükler: dolgulu çok satırlı alan, kayan etiket, yorum kutusu, mesaj kutusu, uzun yazı.

## Özellikler

- **Üç biçim.** `state` alan biçim metni bir `TextFieldState`'te tutar. `value` ve `onValueChange` alan biçim metni çağıranda tutar; altındaki metin alanı ne kadar kaydığını söylemediği için onun kutusunda çubuk yoktur. `field` alan biçim değerini, hatasını ve adını formdaki alanından alır.
- **Satırlar.** `minLines` (varsayılan 3) kutunun en az, `maxLines` (varsayılan 8) en çok kaç satır olduğunu söyler. Alana `Modifier.height` verilirse satırların yerine o yükseklik geçer ve metin kutunun içinde kayar.
- **Enter yeni satırdır.** Klavyenin eylem tuşu her zaman yeni satırdır. Göndermek `onSubmit`'tir: donanım klavyesinde Ctrl+Enter ya da Cmd+Enter. Tab odağı sonraki alana taşır, sekme yazmaz.
- **Yumuşak sınır.** `maxLength` aşılabilir (`TextLimit.Allow`): sayaç sınırı geçince ne kadar geçtiğini sözle yazar ("12 karakter fazla"), sayaç ve çerçeve hata rengine döner. Forma bağlı alanda sınırı aşan metinle form gönderilmez. `TextLimit.Block` sınırı aşan değişikliği bütünüyle geri çevirir. Ekran okuyucuya sayaç yazma durunca, sınırda ve sınırın ötesinde söylenir.
- **İkonlar ve temizleme düğmesi.** `leadingIcon`, `trailingIcon` ve `showClearButton` ilk satırın hizasında durur.
- **Boyutlandırma tutamacı.** Masaüstünde ve web'de kutunun alt köşesindeki tutamaç kutuyu sürükleyerek uzatır ve kısaltır; telefonda tutamaç yoktur. `resizable = false` tutamacı kaldırır.
- **Stil, renkler ve yön.** `style` (`FilledTextFieldStyle`) ve `colors` (`FilledTextFieldColors`) dolgulu metin alanınınkilerdir. Sağdan sola bir düzende tutamaç alt köşenin solundadır.

## Kullanım

### A comment that grows with its text

```kotlin
val comment = rememberTextFieldState()
PantrixFilledTextArea(
    state = comment,
    label = stringResource(Res.string.comment),
    placeholder = stringResource(Res.string.comment_hint),
    maxLength = 500,
    tagKey = "comment"
)
```

### A message sent with Ctrl or Cmd and Enter

```kotlin
val message = rememberTextFieldState()
PantrixFilledTextArea(
    state = message,
    label = stringResource(Res.string.message),
    minLines = 2,
    maxLines = 6,
    onSubmit = { viewModel.send(message.text.toString()) },
    tagKey = "message"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
val bio = form.field("bio", initial = "")
PantrixFilledTextArea(
    field = bio,
    form = form,
    label = stringResource(Res.string.bio),
    maxLength = 160
)
```

### Held as a String, with a limit that blocks

```kotlin
var note by remember { mutableStateOf("") }
PantrixFilledTextArea(
    value = note,
    onValueChange = { note = it },
    label = stringResource(Res.string.note),
    maxLength = 200,
    overLimit = TextLimit.Block,
    tagKey = "note"
)
```

## Örnekler

### Büyüyen bir yorum

Bir yorum alanı: boşken üç satırdır ve etiketi ilk satırın yerinde durur; alana basınca etiket metnin üstüne çıkar ve yer tutucu görünür. Yazıldıkça kutu satır satır uzar, sekiz satıra varınca metin kutunun içinde kayar. Cümle büyük harfle başlar: klavye öyle açılır.

`maxLength = 500` sayacı kutunun altına yazar. Alttaki satır `comment.text`'i yazıldıkça okur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.foundation.theme.PantrixTheme

val comment = rememberTextFieldState()
PantrixFilledTextArea(
    state = comment,
    modifier = Modifier.fillMaxWidth(),
    label = "Yorum",
    placeholder = "Ürün hakkında ne düşündünüz?",
    supportingText = "Yorumunuz herkese açık olur",
    maxLength = 500,
    tagKey = "filled_comment"
)
PantrixText(
    text = "Satır sayısı: ${comment.text.lines().size}",
    color = PantrixTheme.colors.textSecondary
)
```

### Yüksekliği verilen alan

Alana verilen yükseklik alanın bütününündür: `Modifier.height(200.dp)`. Kutu, sayacın bıraktığı yüksekliği doldurur; satırlar yerine o yükseklik geçer ve sığmayan metin kutunun içinde kayar.

İkinci alana `heightIn` verildi: tutamaç kutuyu yalnızca verilen aralıkta sürükler. Sabit bir yükseklikte tutamacın oynatacağı yer yoktur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState(DELIVERY_NOTES),
    modifier = Modifier.fillMaxWidth().height(200.dp),
    label = "Teslimat talimatı",
    showClearButton = true,
    maxLength = 400,
    tagKey = "filled_instructions"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth().heightIn(max = 320.dp),
    label = "Ek not",
    supportingText = "Tutamaçla en çok 320dp'ye kadar uzar",
    tagKey = "filled_extra_note"
)

private const val DELIVERY_NOTES =
    "Apartmanın arka kapısını kullanın; ön kapının zili çalışmıyor. Asansör cuma günleri bakımda olur, merdivenden " +
        "üçüncü kata çıkın. Evde yoksam paketi kapıcıya bırakabilirsiniz, adı Hasan Bey. Teşekkürler!"
```

### Yumuşak sınır ve sayaç

Sınır yumuşaktır: metin 140 karakteri geçebilir. Geçince sayaç ne kadar geçtiğini sözle yazar ("6 karakter fazla"), sayaç ve çerçeve hata rengine döner ve alan ekran okuyucuya "Çok uzun" hatasıyla söylenir. Uzun bir metni yapıştır: bütünüyle alınır, istediğin yerden kısaltabilirsin.

Ekran okuyucu açıkken yaz ve dur: sayaç, yazma durduktan sonra bir kez söylenir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.common.TextLimit
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState(ALMOST_A_POST),
    modifier = Modifier.fillMaxWidth(),
    label = "Gönderi",
    supportingText = "En çok 140 karakter",
    minLines = 2,
    maxLength = 140,
    // Varsayılan: metin sınırı geçebilir.
    overLimit = TextLimit.Allow,
    tagKey = "filled_post"
)

private const val ALMOST_A_POST =
    "Yeni sürüm yayında! Karanlık tema, daha hızlı arama ve çevrimdışı mod geldi. Görüşlerinizi bekliyoruz; " +
        "yorumlarınız yol gösterir."
```

### Aşılamayan sınır, metni String olan alan

`overLimit = TextLimit.Block` sınırı aşacak değişikliği bütünüyle geri çevirir: yazı sınırda durur, sığmayan bir yapıştırma hiç alınmaz.

Bu alan metnini `String` olarak tutar: `value` ve `onValueChange`. Sınırı aşan değişiklik `onValueChange`'e hiç sorulmaz. Altındaki metin alanı ne kadar kaydığını söylemediği için bu biçimin kutusunda çubuk yoktur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.common.TextLimit
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

var reason by remember { mutableStateOf("") }
PantrixFilledTextArea(
    value = reason,
    onValueChange = { reason = it },
    modifier = Modifier.fillMaxWidth(),
    label = "İade nedeni",
    placeholder = "Kısaca yazın",
    minLines = 2,
    maxLines = 4,
    maxLength = 80,
    overLimit = TextLimit.Block,
    tagKey = "filled_return_reason"
)
```

### Ctrl/Cmd+Enter ile göndermek

`onSubmit` donanım klavyesinde Ctrl+Enter ya da Cmd+Enter ile çağrılır; Enter tek başına yeni satır açar. Yazılım klavyesinde bu tuşlar olmadığı için yanında bir "Gönder" düğmesi de var. Bir mesaj yaz ve Ctrl+Enter'a bas: uygulamanın snackbar'ı mesajın gönderildiğini söyler ve alan boşalır.

Gönderme olay olarak bildirilir (`submit`); yazılan metin hiç bildirilmez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val message = rememberTextFieldState()
val send = {
    if (message.text.isNotBlank()) {
        scope.launch { snackbars?.show(message = "Mesaj gönderildi", tagKey = "filled_message_sent") }
        message.clearText()
    }
}
PantrixFilledTextArea(
    state = message,
    modifier = Modifier.fillMaxWidth(),
    label = "Mesaj",
    placeholder = "Ctrl+Enter ya da Cmd+Enter ile gönderin",
    minLines = 2,
    maxLines = 6,
    onSubmit = send,
    tagKey = "filled_message"
)
PantrixButton(text = "Gönder", onClick = send, tagKey = "filled_send_message")
```

### Forma bağlı alan

`field` alan `PantrixFilledTextArea` değerini, hatasını ve adını formdaki alanından alır: `tagKey` verilmez, alanın `id`'si otomasyon anahtarıdır (`FilledTextArea_<id>`). `form` verilince Ctrl+Enter ya da Cmd+Enter formu "Kaydet" düğmesi üzerinden gönderir.

Sınır yumuşaktır, ama form sınırı aşan metinle gönderilmez: alan "Çok uzun" hatasına düşer, sayaç ne kadar fazla olduğunu söyler ve odak alana gider. Alanı boş bırakıp ya da 160 karakteri geçip "Kaydet"e bas.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixFilledTextArea(
    field = form.field("filled_bio", initial = "", Rules.notBlank("Kendinizi birkaç cümleyle anlatın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Hakkımda",
    supportingText = "Profilinizde görünür",
    maxLength = 160
)
PantrixButton(
    text = "Kaydet",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Profil kaydedildi", tagKey = "filled_bio_saved") } }
    },
    form = form,
    tagKey = "filled_save_bio"
)
```

### Devre dışı ve salt okunur

`enabled = false` alanı temanın devre dışı renkleriyle çizer: alan odak almaz, yazılamaz, tutamacı yoktur ve ekran okuyucuya devre dışı olduğu söylenir.

`readOnly = true` yalnızca değiştirmeyi kapatır: alan odaklanır, metni seçilir, kopyalanır ve kaydırılır; tutamaçla uzatılıp okunabilir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState("Siparişiniz kargoya verildi; not eklenemez."),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Kargo notu",
    minLines = 2,
    tagKey = "filled_shipping_note"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(RETURN_POLICY),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "İade koşulları",
    maxLines = 4,
    tagKey = "filled_return_policy"
)

private const val RETURN_POLICY =
    "Ürünü teslim aldığınız günden itibaren 14 gün içinde iade edebilirsiniz. Ürün kullanılmamış, etiketleri " +
        "sökülmemiş ve orijinal ambalajında olmalıdır. İade kargo ücreti tarafımızca karşılanır. Ücretiniz, ürün " +
        "depomuza ulaştıktan sonra 3 iş günü içinde ödeme yaptığınız karta geri yatırılır."
```

### Kendi renkleri ve stili

`colors` ve `style` dolgulu metin alanınınkilerdir: `FilledTextFieldColors` ve `FilledTextFieldStyle`. Verilen renkler kullanılır, verilmeyenler temadaki rolünde kalır. İlk alanın odaktaki çerçevesi, imleci ve kaydırma çubuğu uygulamanın kendi morudur; tutamaç ve temizleme düğmesi ikon rengini alır.

İkinci alanın stili kutuyu `ShapeRole.Large` ile daha yuvarlak çizer ve iç boşluğunu büyütür.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixFilledTextArea(
    state = rememberTextFieldState(DELIVERY_NOTES),
    modifier = Modifier.fillMaxWidth(),
    label = "Not",
    showClearButton = true,
    maxLines = 4,
    colors = FilledTextFieldColors(
        focusedOutline = own.color,
        cursor = own.color,
        icon = own.color,
        scrollBar = own.color
    ),
    tagKey = "filled_own_colors"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Açıklama",
    style = FilledTextFieldStyle(shape = ShapeRole.Large, horizontalPadding = 20.dp, verticalPadding = 16.dp),
    tagKey = "filled_own_style"
)

private const val DELIVERY_NOTES =
    "Apartmanın arka kapısını kullanın; ön kapının zili çalışmıyor. Asansör cuma günleri bakımda olur, merdivenden " +
        "üçüncü kata çıkın. Evde yoksam paketi kapıcıya bırakabilirsiniz, adı Hasan Bey. Teşekkürler!"
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Boyutlandırma tutamacı

Masaüstünde ve web'de kutunun alt köşesindeki tutamacı sürükle: kutu uzar ya da kısalır, işaretçi yukarı-aşağı boyutlandırma okuna döner. Sürüklenen kutu o yükseklikte kalır, metniyle büyümez; en az satırından da kısa olmaz. Telefonda tutamaç yoktur.

İkinci alanda `resizable = false`: tutamaç yok, kutu yalnızca metniyle büyür.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Toplantı notları",
    supportingText = "Alt köşedeki tutamaçla uzatın",
    tagKey = "filled_meeting_notes"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Kısa not",
    minLines = 2,
    maxLines = 4,
    resizable = false,
    tagKey = "filled_short_note"
)
```

### Sağdan sola

Sağdan sola bir düzende ikon ve temizleme düğmesi yer değiştirir, tutamaç alt köşenin soluna geçer ve kaydırma çubuğu kutunun solunda durur: satırın sonu oradadır. Her paragraf yönünü kendi ilk harfinden alır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
    PantrixFilledTextArea(
        state = rememberTextFieldState(ARABIC_NOTE),
        modifier = Modifier.fillMaxWidth(),
        label = "ملاحظة",
        leadingIcon = {
            PantrixIcon(
                imageVector = PantrixIcons.Person,
                contentDescription = null,
                size = PantrixTheme.style(FilledTextFieldStyle).iconSize
            )
        },
        showClearButton = true,
        maxLines = 3,
        maxLength = 200,
        tagKey = "filled_arabic_note"
    )
}

private const val ARABIC_NOTE = "يرجى ترك الطرد عند البواب إذا لم أكن في المنزل. شكراً لكم!"
```

## API

### PantrixFilledTextArea

`import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledTextArea(
    state: TextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minLines: Int = 3,
    maxLines: Int = 8,
    resizable: Boolean = true,
    maxLength: Int? = null,
    overLimit: TextLimit = TextLimit.Allow,
    showCharacterCount: Boolean = true,
    onSubmit: (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Dolgulu metin kutusu: birkaç satırlık metin için bir alan; bir yorum, bir mesaj ya da bir not. Dolgulu kutusu yazıldıkça uzar, sonra kayar. Etiketi kutunun içindedir; altında yardım metni ya da bir hatanın mesajı ve karakterlerinin sayacıyla birlikte gelir.

Etiket, alan boşken ve odakta değilken ilk satırın yerinde durur; alan odak alınca ya da metin tutunca, dolgulu metin alanınınki gibi metnin üstüne çıkar.

Kutu boşken `minLines` satır yüksekliğindedir ve metniyle birlikte satır satır uzar, `maxLines`'a kadar. Onu geçince metin kutunun içinde kayar ve kutunun sonundaki ince bir çubuk ne kadar kaydığını gösterir. İşaretçiyle kullanılan platformlarda kutunun alt köşesindeki tutamaç onu sürükleyerek uzatır ya da kısaltır; kutu da metni ne olursa olsun bırakıldığı yükseklikte kalır, en az satırının altına inmeden.

Enter her klavyede yeni satır açar: yazılım klavyesi her zaman yeni satır tuşunu gösterir, onun yerine hiçbir zaman bir eylem göstermez. Gönderilen bir metin `onSubmit` alır: donanım klavyesinde Ctrl ile Enter ya da Cmd ile Enter onu çağırır. Yazılım klavyesinde bu tuşlar olmadığı için ekran ayrıca bir düğme de verir. Tab odağı ilerletir ve sekme yazmaz: yoksa klavyeyle alandan ileri çıkılamazdı.

Aksi söylenmedikçe `maxLength` yumuşaktır: metin onu geçebilir; sayaç o zaman metnin sınırı ne kadar geçtiğini sözle söyler ve kenarlık hata rengine döner. Sığmayan bir yapıştırma bütünüyle alınır, kullanıcı dilediği yerden kesebilsin diye. `TextLimit.Block` ise sınırı aşan değişikliği, metin alanının sınırı gibi geri çevirir.

iOS'ta birkaç satırlık bir alanın klavyesini kapatan bir tuş yoktur: ekrandaki `Modifier.clearFocusOnTap()`, kullanıcı alanın dışına dokununca klavyeyi kapatır.

Kutusu ve yardım metni `PantrixFilledTextField`'ınkidir ve o bileşenin `style`'ını ve `colors`'ını alır: dolgulu metin alanlarının stilini değiştiren bir ürün, dolgulu metin kutularınınkini de onlarla değiştirir. Bir `TextFieldState` üstüne kuruludur; `value` ve `onValueChange` alan bir overload'u ve bir formun alanı için bir overload'u daha vardır.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `rememberTextFieldState()` ile kurulur ve yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar. Verilen yükseklik de alanın bütününündür ve satırlarının yerine geçer: kutu, yardım metninin bıraktığı yüksekliği doldurur ve metni içinde kayar. Tutamaç kutuyu yalnızca böyle bir yüksekliğin içinde oynatır; bu yüzden sürüklenecek bir alana `height` değil `heightIn` verilir.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir, tutamacı yoktur ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir, kopyalanır, kaydırılır ve sürüklenip uzatılır.
- `label: String?`: Alanın ne için olduğu, kutunun içinde: alan boşken ve odakta değilken ilk satırın yerinde, yoksa metnin üstünde. Ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir. Etiket değildir: kullanıcı yazmaya başlar başlamaz kaybolur.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: çerçeve, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir. Yumuşak bir `maxLength`'i geçen metin de hatalı çizilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde, ilk satırının hizasında durur ve ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` platformun boyutundadır.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin arkasında, ilk satırının hizasında ve temizleme düğmesinden sonra durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, ilk satırın hizasında alanı boşaltan bir düğme gösterir. Düğme imleci alanda bırakır. Tab durağı değildir; ekran okuyucu ona yine de bir düğme olarak ulaşır.
- `minLines: Int`: Kutunun en az kaç satır yüksekliğinde olduğu: boşken ve sürüklendiğinde en kısa hâlinde. En az bir.
- `maxLines: Int`: Metin kutunun içinde kaymaya başlamadan önce kutunun metniyle kaç satıra kadar uzadığı. `minLines`'tan az olamaz: ikisi eşitse kutu yüksekliğini korur.
- `resizable: Boolean`: Kutunun alt köşesindeki bir tutamacın onu sürükleyerek uzatıp kısaltıp kısaltmadığı. Yalnızca işaretçiyle kullanılan platformlarda, masaüstünde ve tarayıcıda: telefonda kutunun üstündeki parmak metnini kaydırır.
- `maxLength: Int?`: Metnin tutması gereken en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır, bu yüzden bir emoji iki sayılabilir. Onu aşan bir değişikliğin ne olacağını `overLimit` söyler. Pozitif olmalıdır.
- `overLimit: TextLimit`: `maxLength`'i aşan bir değişikliğin ne olacağı: `TextLimit.Allow` onu alır ve metnin çok uzun olduğunu gösterir, `TextLimit.Block` onu bütünüyle geri çevirir.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında sayacı gösterir: `120/500`, sınırın ötesinde de ne kadar geçtiğini, `12 karakter fazla`. Ekran okuyucuya yazma durunca, sınırda ve sınırın ötesinde söylenir.
- `onSubmit: (() -> Unit)?`: Donanım klavyesinde Ctrl ile Enter ya da Cmd ile Enter'a basılınca çağrılır: metin gönderilir. Null iki tuşu da alana bırakır. Gönderme bildirilir, metin hiçbir zaman bildirilmez.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri ve düzeltmeleri: aksi söylenmedikçe cümle büyük harfle başlar. Burada ne verilirse verilsin klavyenin eylemi her zaman yeni satırdır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne ne yapıldığı. Aşılamayan bir `maxLength` ile önce bu çalışır ve sınır onun geçirdiğine uygulanır.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili, dolgulu metin alanınınki: kapsayan her stilin üstünde, yoğunluğun altında. Her platformda yalnızca verdiği alanlar değişir.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, dolgulu metin alanınınkiler, temanın rollerinin yerine: verdikleri kullanılır, gerisi temanınkiler olarak kalır. Devre dışı bir alan ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label`'ı olmayan alanın adı. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze bırakılır, alan boşken adı iki kez söylenmesin diye.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `FilledTextArea_<tagKey>`, temizleme düğmesi `FilledTextAreaClear_<tagKey>`, tutamacı `FilledTextAreaResize_<tagKey>` olur. Alan odak aldığını, temizlendiğini ve gönderildiğini bildirir, metnini hiçbir zaman bildirmez.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Bu null olduğunda alan kendi kaynağını tutar.

### PantrixFilledTextArea

`import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledTextArea(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minLines: Int = 3,
    maxLines: Int = 8,
    resizable: Boolean = true,
    maxLength: Int? = null,
    overLimit: TextLimit = TextLimit.Allow,
    showCharacterCount: Boolean = true,
    onSubmit: (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Metni, çağıranın tuttuğu bir `String` olan metin kutusu: gösterdiği `value`'dur ve kullanıcının her değişikliği `onValueChange`'e sorulur.

`TextFieldState` üstündeki metin kutusu gibi görünür, ölçülür ve davranır; altında ise Foundation'ın bir değer ve bir geri çağrı alan metin alanı, getirdikleriyle birlikte vardır. Geri çağrıya verilen metin bir sonraki karede `value` olarak geri gelmelidir, yoksa alan eski metni yeniden gösterir ve imleç sıçrar: metni geri çağrının hemen yazdığı bir state'te tutun; metin bir akışta yaşıyorsa ya da ekranın dışında değişiyorsa `TextFieldState` overload'unu kullanın. Bu metin alanı metninin ne kadar kaydığını söylemez, bu yüzden kutusunda bunu gösteren bir çubuk yoktur.

Parametreler:

- `value: String`: Alanın gösterdiği metin.
- `onValueChange: (String) -> Unit`: Kullanıcının her değişikliği için yeni metnin bütünüyle, temizleme düğmesi için de boş bir metinle sorulur.
- `modifier: Modifier`: Alanın bütününün modifier'ı: kutusunun ve kutunun altındakilerin. Verilen yükseklik alanın bütününündür ve satırlarının yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir, tutamacı yoktur ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu, kutunun içinde: alan boşken ve odakta değilken ilk satırın yerinde, yoksa metnin üstünde. Ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken, etiket metnin üstüne çıktığında içinde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: çerçeve, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir. Yumuşak bir `maxLength`'i geçen metin de hatalı çizilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde, ilk satırının hizasında durur.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin arkasında, ilk satırının hizasında ve temizleme düğmesinden sonra durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, ilk satırın hizasında boş bir metin isteyen bir düğme gösterir. Düğme imleci alanda bırakır ve Tab durağı değildir.
- `minLines: Int`: Kutunun en az kaç satır yüksekliğinde olduğu. En az bir.
- `maxLines: Int`: Metin kutunun içinde kaymaya başlamadan önce kutunun metniyle kaç satıra kadar uzadığı. `minLines`'tan az olamaz.
- `resizable: Boolean`: İşaretçiyle kullanılan platformlarda, kutunun alt köşesindeki bir tutamacın onu sürükleyerek uzatıp kısaltıp kısaltmadığı.
- `maxLength: Int?`: Metnin tutması gereken en çok karakter sayısı, `String.length`'in saydığı gibi sayılır. Onu aşan bir değişikliğin ne olacağını `overLimit` söyler. Pozitif olmalıdır.
- `overLimit: TextLimit`: `maxLength`'i aşan bir değişikliğin ne olacağı: `TextLimit.Allow` onu ister ve metnin çok uzun olduğunu gösterir, `TextLimit.Block` onu `onValueChange`'e sorulmadan geri çevirir.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında sayacı, sınırın ötesinde de ne kadar geçtiğini gösterir.
- `onSubmit: (() -> Unit)?`: Donanım klavyesinde Ctrl ile Enter ya da Cmd ile Enter'a basılınca çağrılır. Null iki tuşu da alana bırakır.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri ve düzeltmeleri. Burada ne verilirse verilsin klavyenin eylemi her zaman yeni satırdır.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili, dolgulu metin alanınınki: kapsayan her stilin üstünde, yoğunluğun altında.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, dolgulu metin alanınınkiler, temanın rollerinin yerine. Devre dışı bir alan ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `FilledTextArea_<tagKey>`, temizleme düğmesi `FilledTextAreaClear_<tagKey>`, tutamacı `FilledTextAreaResize_<tagKey>` olur. Alan odak aldığını, temizlendiğini ve gönderildiğini bildirir, metnini hiçbir zaman bildirmez.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Bu null olduğunda alan kendi kaynağını tutar.

### PantrixFilledTextArea

`import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledTextArea(
    field: FormField<String>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minLines: Int = 3,
    maxLines: Int = 8,
    resizable: Boolean = true,
    maxLength: Int? = null,
    overLimit: TextLimit = TextLimit.Allow,
    showCharacterCount: Boolean = true,
    onSubmit: (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı metin kutusu: metni, hatası ve adı `field`'dan gelir.

Alanın değeri ile ekrandaki metin iki yönde de uyumlu kalır: yazmak alanı değiştirir, kodla alanda yapılan bir değişiklik de, bir sıfırlama gibi, metnin yerine geçer. Odak ayrılınca alan dokunulmuş sayılır ve denetlenir; hata ilk kez o zaman görünür. Alan hatalıyken mesajı `supportingText`'in yerine geçer. Yumuşak bir `maxLength`'i geçen metin de alanı hataya düşürür, form onunla gönderilmesin diye: mesaj `PantrixStrings.tooLong`'dur, sayaç da metnin sınırı ne kadar geçtiğini söyler. Alanın id'si otomasyon anahtarıdır, `FilledTextArea_<id>`; form bu alan hatalıyken gönderilirse odağı buraya gönderebilir.

Parametreler:

- `field: FormField<String>`: Metin kutusunun gösterdiği ve değiştirdiği alan.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilince Ctrl ile Enter ya da Cmd ile Enter formu ona kayıtlı düğme üzerinden gönderir: form denetlenir, sonra gönderilir ya da odak ilk hatalı alanına gönderilir. Enter tek başına yeni satır açar. Çağıranın kendi `onSubmit`'i formun gönderilmesinin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu, kutunun içinde: ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir.
- `supportingText: String?`: Alanın orada gösterecek bir hatası yokken kutunun altındaki yardım metni.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde, ilk satırının hizasında durur.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin arkasında, ilk satırının hizasında ve temizleme düğmesinden sonra durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece alanı boşaltan bir düğme gösterir.
- `minLines: Int`: Kutunun en az kaç satır yüksekliğinde olduğu. En az bir.
- `maxLines: Int`: Metin kutunun içinde kaymaya başlamadan önce kutunun metniyle kaç satıra kadar uzadığı. `minLines`'tan az olamaz.
- `resizable: Boolean`: İşaretçiyle kullanılan platformlarda, kutunun alt köşesindeki bir tutamacın onu sürükleyerek uzatıp kısaltıp kısaltmadığı.
- `maxLength: Int?`: Metnin tutması gereken en çok karakter sayısı. Pozitif olmalıdır.
- `overLimit: TextLimit`: `maxLength`'i aşan bir değişikliğin ne olacağı: `TextLimit.Allow` onu alır ve alanı hataya düşürür, `TextLimit.Block` onu bütünüyle geri çevirir.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında sayacı, sınırın ötesinde de ne kadar geçtiğini gösterir.
- `onSubmit: (() -> Unit)?`: Donanım klavyesinde Ctrl ile Enter ya da Cmd ile Enter'a basılınca, formun gönderilmesinin yerine çağrılır.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri ve düzeltmeleri. Burada ne verilirse verilsin klavyenin eylemi her zaman yeni satırdır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne ne yapıldığı.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili, dolgulu metin alanınınki: kapsayan her stilin üstünde, yoğunluğun altında.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, dolgulu metin alanınınkiler, temanın rollerinin yerine. Devre dışı bir alan ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Bu null olduğunda alan kendi kaynağını tutar.

### TextLimit

`import com.pantrixui.components.inputs.common.TextLimit`, `com.pantrixui:components` içinden

```kotlin
enum class TextLimit
```

Bir metin kutusunun, metnini `maxLength`'inin ötesine taşıyan bir değişikliğe ne yaptığı: onu alır ve metnin çok uzun olduğunu gösterir ya da geri çevirir.

Değerleri:

- `Allow`: Değişiklik alınır ve alan metnin çok uzun olduğunu gösterir: sayaç metnin sınırı ne kadar geçtiğini sözle söyler, kenarlık ve sayaç hata rengine döner. Bir yapıştırma sınırın düştüğü yerden kesilmez, bütünüyle alınır; kullanıcı dilediği yerden kessin diye. Alanın bağlı olduğu form, metin sınırı geçtiği sürece gönderilmez.
- `Block`: Değişiklik, metin alanının sınırının yaptığı gibi bütünüyle geri çevrilir: yazı sınırda durur, sığmayan bir yapıştırma hiç alınmaz.
