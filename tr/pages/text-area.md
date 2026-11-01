# Text Area

Birkaç satırlık metin: bir yorum, bir mesaj, bir not. Kutu boşken en az satırı kadardır, yazıldıkça satır satır uzar, en çok satırına varınca metin kutunun içinde kayar ve kutunun sonundaki ince çubuk ne kadar kaydığını gösterir. Etiketi, kutusu ve yardım metni `PantrixTextField`'ınkidir; onun stilini ve renklerini alır.

- `PantrixTextArea` (`com.pantrixui.components.inputs.textarea`, `com.pantrixui:components`): Bir TextFieldState üzerinde, yazısıyla büyüyüp sonra kayan çok satırlık bir yazı alanı: boyutunu değiştiren bir tutamaç, sayacıyla yumuşak ya da katı bir karakter sınırı, Ctrl ya da Cmd ile Enter'da gönderme, etiket, yardım ve hata metni, ikonlar, temizle düğmesi ve form bağlantısıyla. Anahtar sözcükler: çok satırlı alan, yorum kutusu, mesaj kutusu, not alanı, uzun yazı, açıklama alanı.

## Özellikler

- **Üç biçim.** `state` alan biçim metni bir `TextFieldState`'te tutar. `value` ve `onValueChange` alan biçim metni çağıranda tutar; altındaki metin alanı ne kadar kaydığını söylemediği için onun kutusunda çubuk yoktur. `field` alan biçim değerini, hatasını ve adını formdaki alanından alır.
- **Satırlar.** `minLines` (varsayılan 3) kutunun en az, `maxLines` (varsayılan 8) en çok kaç satır olduğunu söyler. Alana `Modifier.height` verilirse satırların yerine o yükseklik geçer ve metin kutunun içinde kayar.
- **Enter yeni satırdır.** Klavyenin eylem tuşu her zaman yeni satırdır: Android'de başka bir eylem satır tuşunun yerini alırdı. Göndermek `onSubmit`'tir: donanım klavyesinde Ctrl+Enter ya da Cmd+Enter. Yazılım klavyesinde bu tuşlar yoktur; ekran bir gönder düğmesi de verir. Tab odağı sonraki alana taşır, sekme yazmaz.
- **Yumuşak sınır.** `maxLength` aşılabilir (`TextLimit.Allow`): sayaç sınırı geçince ne kadar geçtiğini sözle yazar ("12 karakter fazla"), sayaç ve kenarlık hata rengine döner. Sığmayan bir yapıştırma bütünüyle alınır, kullanıcı dilediği yerden kısaltır. Forma bağlı alanda sınırı aşan metinle form gönderilmez. `TextLimit.Block` metin alanındaki gibi sınırı aşan değişikliği bütünüyle geri çevirir.
- **Sayaç ve ekran okuyucu.** Sayaç sınıra kadar "120/500" yazar. Ekran okuyucuya yazma durunca, sınırda ve sınırın ötesinde söylenir: her tuşta söylenseydi klavyenin kendi harf okumasının üstüne konuşurdu.
- **İkonlar ve temizleme düğmesi.** `leadingIcon`, `trailingIcon` ve `showClearButton` ilk satırın hizasında durur, kutunun ortasında değil.
- **Boyutlandırma tutamacı.** İşaretçiyle kullanılan platformlarda, masaüstünde ve web'de, kutunun alt köşesindeki tutamaç kutuyu sürükleyerek uzatır ve kısaltır. Sürüklenen kutu metniyle büyümez; en az satırından kısa olmaz. Telefonda tutamaç yoktur: kutunun üstündeki parmak metni kaydırır. `resizable = false` tutamacı kaldırır.
- **Klavyeyi kapatmak.** iOS'ta birkaç satırlık alanın klavyesinde onu kapatan tuş yoktur. Ekranın kökündeki `Modifier.clearFocusOnTap()` alanın dışına dokununca odağı bırakır ve klavye kapanır; bu katalog da böyle yapar.
- **Stil, renkler ve yön.** `style` (`TextFieldStyle`) ve `colors` (`TextFieldColors`) metin alanınınkilerdir; tutamaç ikon rengini, çubuk `scrollBar` rengini alır. Sağdan sola bir düzende tutamaç alt köşenin solundadır.

## Kullanım

### A comment that grows with its text

```kotlin
val comment = rememberTextFieldState()
PantrixTextArea(
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
PantrixTextArea(
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
PantrixTextArea(
    field = bio,
    form = form,
    label = stringResource(Res.string.bio),
    maxLength = 160
)
```

### Held as a String, with a limit that blocks

```kotlin
var note by remember { mutableStateOf("") }
PantrixTextArea(
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

Bir yorum alanı: boşken üç satırdır, yazıldıkça satır satır uzar ve sekiz satıra varınca metin kutunun içinde kayar. Kutunun sonundaki ince çubuk metnin ne kadar kaydığını gösterir. Cümle büyük harfle başlar: klavye öyle açılır.

`maxLength = 500` sayacı kutunun altına yazar. Alttaki satır `comment.text`'i yazıldıkça okur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.foundation.theme.PantrixTheme

val comment = rememberTextFieldState()
PantrixTextArea(
    state = comment,
    modifier = Modifier.fillMaxWidth(),
    label = "Yorum",
    placeholder = "Ürün hakkında ne düşündünüz?",
    supportingText = "Yorumunuz herkese açık olur",
    maxLength = 500,
    tagKey = "comment"
)
PantrixText(
    text = "Satır sayısı: ${comment.text.lines().size}",
    color = PantrixTheme.colors.textSecondary
)
```

### Yüksekliği verilen alan

Alana verilen yükseklik alanın bütününündür: `Modifier.height(200.dp)`. Kutu, etiketin ve sayacın bıraktığı yüksekliği doldurur; satırlar yerine o yükseklik geçer ve sığmayan metin kutunun içinde kayar.

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
import com.pantrixui.components.inputs.textarea.PantrixTextArea

PantrixTextArea(
    state = rememberTextFieldState(DELIVERY_NOTES),
    modifier = Modifier.fillMaxWidth().height(200.dp),
    label = "Teslimat talimatı",
    showClearButton = true,
    maxLength = 400,
    tagKey = "instructions"
)
PantrixTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth().heightIn(max = 320.dp),
    label = "Ek not",
    supportingText = "Tutamaçla en çok 320dp'ye kadar uzar",
    tagKey = "extra_note"
)

private const val DELIVERY_NOTES =
    "Apartmanın arka kapısını kullanın; ön kapının zili çalışmıyor. Asansör cuma günleri bakımda olur, merdivenden " +
        "üçüncü kata çıkın. Evde yoksam paketi kapıcıya bırakabilirsiniz, adı Hasan Bey. Teşekkürler!"
```

### Yumuşak sınır ve sayaç

Sınır yumuşaktır: metin 140 karakteri geçebilir. Geçince sayaç ne kadar geçtiğini sözle yazar ("6 karakter fazla"), sayaç ve kenarlık hata rengine döner ve alan ekran okuyucuya "Çok uzun" hatasıyla söylenir. Uzun bir metni yapıştır: bütünüyle alınır, istediğin yerden kısaltabilirsin.

Ekran okuyucu açıkken yaz ve dur: sayaç, yazma durduktan sonra bir kez söylenir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.common.TextLimit
import com.pantrixui.components.inputs.textarea.PantrixTextArea

PantrixTextArea(
    state = rememberTextFieldState(ALMOST_A_POST),
    modifier = Modifier.fillMaxWidth(),
    label = "Gönderi",
    supportingText = "En çok 140 karakter",
    minLines = 2,
    maxLength = 140,
    // Varsayılan: metin sınırı geçebilir.
    overLimit = TextLimit.Allow,
    tagKey = "post"
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
import com.pantrixui.components.inputs.textarea.PantrixTextArea

var reason by remember { mutableStateOf("") }
PantrixTextArea(
    value = reason,
    onValueChange = { reason = it },
    modifier = Modifier.fillMaxWidth(),
    label = "İade nedeni",
    placeholder = "Kısaca yazın",
    minLines = 2,
    maxLines = 4,
    maxLength = 80,
    overLimit = TextLimit.Block,
    tagKey = "return_reason"
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
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val message = rememberTextFieldState()
val send = {
    if (message.text.isNotBlank()) {
        scope.launch { snackbars?.show(message = "Mesaj gönderildi", tagKey = "message_sent") }
        message.clearText()
    }
}
PantrixTextArea(
    state = message,
    modifier = Modifier.fillMaxWidth(),
    label = "Mesaj",
    placeholder = "Ctrl+Enter ya da Cmd+Enter ile gönderin",
    minLines = 2,
    maxLines = 6,
    onSubmit = send,
    tagKey = "message"
)
PantrixButton(text = "Gönder", onClick = send, tagKey = "send_message")
```

### Forma bağlı alan

`field` alan `PantrixTextArea` değerini, hatasını ve adını formdaki alanından alır: `tagKey` verilmez, alanın `id`'si otomasyon anahtarıdır (`TextArea_<id>`). `form` verilince Ctrl+Enter ya da Cmd+Enter formu "Kaydet" düğmesi üzerinden gönderir.

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
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixTextArea(
    field = form.field("bio", initial = "", Rules.notBlank("Kendinizi birkaç cümleyle anlatın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Hakkımda",
    supportingText = "Profilinizde görünür",
    maxLength = 160
)
PantrixButton(
    text = "Kaydet",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Profil kaydedildi", tagKey = "bio_saved") } }
    },
    form = form,
    tagKey = "save_bio"
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
import com.pantrixui.components.inputs.textarea.PantrixTextArea

PantrixTextArea(
    state = rememberTextFieldState("Siparişiniz kargoya verildi; not eklenemez."),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Kargo notu",
    minLines = 2,
    tagKey = "shipping_note"
)
PantrixTextArea(
    state = rememberTextFieldState(RETURN_POLICY),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "İade koşulları",
    maxLines = 4,
    tagKey = "return_policy"
)

private const val RETURN_POLICY =
    "Ürünü teslim aldığınız günden itibaren 14 gün içinde iade edebilirsiniz. Ürün kullanılmamış, etiketleri " +
        "sökülmemiş ve orijinal ambalajında olmalıdır. İade kargo ücreti tarafımızca karşılanır. Ücretiniz, ürün " +
        "depomuza ulaştıktan sonra 3 iş günü içinde ödeme yaptığınız karta geri yatırılır."
```

### Kendi renkleri ve stili

`colors` ve `style` metin alanınınkilerdir: `TextFieldColors` ve `TextFieldStyle`. Verilen renkler kullanılır, verilmeyenler temadaki rolünde kalır. İlk alanın kenarlığı, imleci ve kaydırma çubuğu uygulamanın kendi morudur; tutamaç ve temizleme düğmesi ikon rengini alır.

İkinci alanın stili kutuyu `ShapeRole.Large` ile daha yuvarlak çizer ve iç boşluğunu büyütür.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixTextArea(
    state = rememberTextFieldState(DELIVERY_NOTES),
    modifier = Modifier.fillMaxWidth(),
    label = "Not",
    showClearButton = true,
    maxLines = 4,
    colors = TextFieldColors(
        focusedBorder = own.color,
        cursor = own.color,
        icon = own.color,
        scrollBar = own.color
    ),
    tagKey = "own_colors"
)
PantrixTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Açıklama",
    style = TextFieldStyle(shape = ShapeRole.Large, horizontalPadding = 20.dp, verticalPadding = 16.dp),
    tagKey = "own_style"
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
import com.pantrixui.components.inputs.textarea.PantrixTextArea

PantrixTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Toplantı notları",
    supportingText = "Alt köşedeki tutamaçla uzatın",
    tagKey = "meeting_notes"
)
PantrixTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Kısa not",
    minLines = 2,
    maxLines = 4,
    resizable = false,
    tagKey = "short_note"
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
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
    PantrixTextArea(
        state = rememberTextFieldState(ARABIC_NOTE),
        modifier = Modifier.fillMaxWidth(),
        label = "ملاحظة",
        leadingIcon = {
            PantrixIcon(
                imageVector = PantrixIcons.Person,
                contentDescription = null,
                size = PantrixTheme.style(TextFieldStyle).iconSize
            )
        },
        showClearButton = true,
        maxLines = 3,
        maxLength = 200,
        tagKey = "arabic_note"
    )
}

private const val ARABIC_NOTE = "يرجى ترك الطرد عند البواب إذا لم أكن في المنزل. شكراً لكم!"
```

### Dışarı dokununca klavye kapanır

iOS'ta birkaç satırlık alanın klavyesinde onu kapatan tuş yoktur. `Modifier.clearFocusOnTap()` bu sütunun boş bir yerine dokunulunca odağı bırakır ve klavye kapanır. Alana ya da bir düğmeye dokunmak onlarındır: imleç yer değiştirir, düğme işini yapar. Kaydırmak dokunuş sayılmaz.

Uygulamanın kökü de aynısını yapar: bu katalogda sayfanın herhangi bir boş yerine dokunmak klavyeyi kapatır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.foundation.keyboard.clearFocusOnTap
import com.pantrixui.foundation.theme.PantrixTheme

Column(
    modifier = Modifier.fillMaxWidth().clearFocusOnTap(),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixTextArea(
        state = rememberTextFieldState(),
        modifier = Modifier.fillMaxWidth(),
        label = "Geri bildirim",
        minLines = 2,
        tagKey = "feedback"
    )
    PantrixText(
        text = "Klavyeyi kapatmak için buraya dokunun",
        color = PantrixTheme.colors.textSecondary
    )
}
```

## API

### PantrixTextArea

`import com.pantrixui.components.inputs.textarea.PantrixTextArea`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTextArea(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Metin kutusu: birkaç satırlık metin için bir alan; bir yorum, bir mesaj ya da bir not. Yazıldıkça uzar, sonra kayar. Üstünde bir etiket, altında yardım metni ya da bir hatanın mesajı ve karakterlerinin sayacıyla birlikte gelir.

Kutu boşken `minLines` satır yüksekliğindedir ve metniyle birlikte satır satır uzar, `maxLines`'a kadar. Onu geçince metin kutunun içinde kayar ve kutunun sonundaki ince bir çubuk ne kadar kaydığını gösterir. İşaretçiyle kullanılan platformlarda kutunun alt köşesindeki tutamaç onu sürükleyerek uzatır ya da kısaltır; kutu da metni ne olursa olsun bırakıldığı yükseklikte kalır, en az satırının altına inmeden.

Enter her klavyede yeni satır açar: yazılım klavyesi her zaman yeni satır tuşunu gösterir, onun yerine hiçbir zaman bir eylem göstermez. Gönderilen bir metin `onSubmit` alır: donanım klavyesinde Ctrl ile Enter ya da Cmd ile Enter onu çağırır. Yazılım klavyesinde bu tuşlar olmadığı için ekran ayrıca bir düğme de verir. Tab odağı ilerletir ve sekme yazmaz: yoksa klavyeyle alandan ileri çıkılamazdı.

Aksi söylenmedikçe `maxLength` yumuşaktır: metin onu geçebilir; sayaç o zaman metnin sınırı ne kadar geçtiğini sözle söyler ve kenarlık hata rengine döner. Sığmayan bir yapıştırma bütünüyle alınır, kullanıcı dilediği yerden kesebilsin diye. `TextLimit.Block` ise sınırı aşan değişikliği, metin alanının sınırı gibi geri çevirir.

iOS'ta birkaç satırlık bir alanın klavyesini kapatan bir tuş yoktur: ekrandaki `Modifier.clearFocusOnTap()`, kullanıcı alanın dışına dokununca klavyeyi kapatır.

Etiketi, kutusu ve yardım metni `PantrixTextField`'ınkidir ve o bileşenin `style`'ını ve `colors`'ını alır: metin alanlarının stilini değiştiren bir ürün, metin kutularınınkini de onlarla değiştirir. Bir `TextFieldState` üstüne kuruludur; `value` ve `onValueChange` alan bir overload'u ve bir formun alanı için bir overload'u daha vardır.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `rememberTextFieldState()` ile kurulur ve yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar. Verilen yükseklik de alanın bütününündür ve satırlarının yerine geçer: kutu, etiketin ve yardım metninin bıraktığı yüksekliği doldurur ve metni içinde kayar. Tutamaç kutuyu yalnızca böyle bir yüksekliğin içinde oynatır; bu yüzden sürüklenecek bir alana `height` değil `heightIn` verilir.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir, tutamacı yoktur ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir, kopyalanır, kaydırılır ve sürüklenip uzatılır.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir. Etiket değildir: kullanıcı yazmaya başlar başlamaz kaybolur.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kenarlık, etiket, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir. Yumuşak bir `maxLength`'i geçen metin de hatalı çizilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde, ilk satırının hizasında durur ve ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(TextFieldStyle).iconSize)` platformun boyutundadır.
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
- `style: TextFieldStyle?`: Bu çağrının kendi stili, metin alanınınki: kapsayan her stilin üstünde, yoğunluğun altında. Her platformda yalnızca verdiği alanlar değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, metin alanınınkiler, temanın rollerinin yerine: verdikleri kullanılır, gerisi temanınkiler olarak kalır. Devre dışı bir alan ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label`'ı olmayan alanın adı. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze bırakılır, alan boşken adı iki kez söylenmesin diye.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `TextArea_<tagKey>`, temizleme düğmesi `TextAreaClear_<tagKey>`, tutamacı `TextAreaResize_<tagKey>` olur. Alan odak aldığını, temizlendiğini ve gönderildiğini bildirir, metnini hiçbir zaman bildirmez.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Bu null olduğunda alan kendi kaynağını tutar.

### PantrixTextArea

`import com.pantrixui.components.inputs.textarea.PantrixTextArea`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTextArea(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
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
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin. Verilen yükseklik alanın bütününündür ve satırlarının yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir, tutamacı yoktur ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kenarlık, etiket, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir. Yumuşak bir `maxLength`'i geçen metin de hatalı çizilir.
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
- `style: TextFieldStyle?`: Bu çağrının kendi stili, metin alanınınki: kapsayan her stilin üstünde, yoğunluğun altında.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, metin alanınınkiler, temanın rollerinin yerine. Devre dışı bir alan ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: `label`'ı olmayan alan için ekran okuyucunun söylediği.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `TextArea_<tagKey>`, temizleme düğmesi `TextAreaClear_<tagKey>`, tutamacı `TextAreaResize_<tagKey>` olur. Alan odak aldığını, temizlendiğini ve gönderildiğini bildirir, metnini hiçbir zaman bildirmez.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Bu null olduğunda alan kendi kaynağını tutar.

### PantrixTextArea

`import com.pantrixui.components.inputs.textarea.PantrixTextArea`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTextArea(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı metin kutusu: metni, hatası ve adı `field`'dan gelir.

Alanın değeri ile ekrandaki metin iki yönde de uyumlu kalır: yazmak alanı değiştirir, kodla alanda yapılan bir değişiklik de, bir sıfırlama gibi, metnin yerine geçer. Odak ayrılınca alan dokunulmuş sayılır ve denetlenir; hata ilk kez o zaman görünür. Alan hatalıyken mesajı `supportingText`'in yerine geçer. Yumuşak bir `maxLength`'i geçen metin de alanı hataya düşürür, form onunla gönderilmesin diye: mesaj `PantrixStrings.tooLong`'dur, sayaç da metnin sınırı ne kadar geçtiğini söyler. Alanın id'si otomasyon anahtarıdır, `TextArea_<id>`; form bu alan hatalıyken gönderilirse odağı buraya gönderebilir.

Parametreler:

- `field: FormField<String>`: Metin kutusunun gösterdiği ve değiştirdiği alan.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilince Ctrl ile Enter ya da Cmd ile Enter formu ona kayıtlı düğme üzerinden gönderir: form denetlenir, sonra gönderilir ya da odak ilk hatalı alanına gönderilir. Enter tek başına yeni satır açar. Çağıranın kendi `onSubmit`'i formun gönderilmesinin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
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
- `style: TextFieldStyle?`: Bu çağrının kendi stili, metin alanınınki: kapsayan her stilin üstünde, yoğunluğun altında.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, metin alanınınkiler, temanın rollerinin yerine. Devre dışı bir alan ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
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

### Modifier.clearFocusOnTap

`import com.pantrixui.foundation.keyboard.clearFocusOnTap`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.clearFocusOnTap(): Modifier
```

Kullanıcı bu düğüme, altında dokunuşu kendisi alan bir şeyin olmadığı bir yerden dokununca odağı bırakır: metin alanı odağını bırakır ve yazılım klavyesi de onunla gider.

Bir ekran ya da uygulama onu, gösterdiği her şeyin altına, köküne koyar:

```kotlin
Column(Modifier.fillMaxSize().clearFocusOnTap()) {
    PantrixTextArea(state = comment, label = stringResource(Res.string.comment))
    PantrixButton(text = stringResource(Res.string.send), onClick = ::send)
}
```

iOS'ta birkaç satırlık bir alanın klavyesi, onu kapatan tuşu olmadığı için, bir sayı alanınınki de tuş takımında öyle bir tuş olmadığı için böyle kapatılır. Boş bir yere, bir yazıya ya da bir resme dokunmak odağı bırakır. Altındaki bir şeyin aldığı dokunuş ona bırakılır: düğme işini yapar, metin alanına basmak imlecini taşır. Kaydıran bir sürükleme dokunuş değildir ve odağı olduğu yerde bırakır.
