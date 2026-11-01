# Filled Text Field

Etiketi kutusunun içinde duran metin alanı. Etiket, alan boşken ve odakta değilken yazının yerinde durur; alana odaklanılınca ya da bir şey yazılınca yazının üstündeki kendi satırına çıkar. Kutu dinlenirken dolguludur ve çerçevesi yoktur; odakta `primary`, hatada `danger` rengiyle çerçevelenir.

Altındaki metin alanı `PantrixTextField`'ınkidir, etrafındaki çizim başkadır: ikisi aynı şeyleri alır ve birbirinin yerine geçebilir. `TextFieldState` üstüne kuruludur; `value` ve `onValueChange` alan ve bir formun alanını alan birer biçimi daha vardır.

- `PantrixFilledTextField` (`com.pantrixui.components.inputs.filledtextfield`, `com.pantrixui:components`): Etiketi dolgulu bir kutunun içinde duran ve alan odağı ya da bir yazıyı alınca yukarı kayan bir yazı alanı; tek satırlık ya da çok satırlık, yardım ve hata metni, ikonlar, temizle düğmesi, karakter sayacı ve form bağlantısıyla. Anahtar sözcükler: dolgulu alan, kayan etiket, yazı alanı, metin kutusu, form alanı.

## Özellikler

- **Kutunun içindeki etiket.** `label` dinlenirken yazının yerinde ve yazının boyutundadır; odakta ya da bir metin varken küçülür ve kendi satırına çıkar. Etiketi olmayan alanda metin kutunun ortasında durur.
- **Yer tutucu.** `placeholder` etiket yerinden çıkmışken görünür: alan boş ve odaktayken. Etiketi olmayan alanda alan boş olduğu sürece görünür.
- **Dolgu ve çerçeve.** Kutu dinlenirken dolgulu ve çerçevesizdir. Odakta ve hatada dolgu yüzey rengine döner ve kutu çerçevelenir; fare üstündeyken de bir çerçeve alır. Devre dışı alanın dolgusu yoktur.
- **Yardım metni ve hata.** `supportingText` kutunun altında yazar. `error` çerçeveyi, yardım metnini ve imleci `danger` rolüne çevirir ve ekran okuyucuya bildirilir; etiket kendi renginde kalır.
- **Birkaç satır.** `lineLimits = TextFieldLineLimits.MultiLine(...)` ile kutu en az satır sayısı kadar boyludur, en çok satır sayısına kadar uzar ve oradan sonra metni içinde kaydırır: sonundaki çubuk ne kadar kaydığını gösterir.
- **İkonlar, temizleme düğmesi, sayaç.** `leadingIcon` etiketin ve metnin önünde, `trailingIcon` arkasında durur. `showClearButton` alanı boşaltan düğmeyi gösterir; `maxLength` uzunluğu sınırlar ve sayacı yazar.
- **Klavye ve dönüşümler.** `keyboardOptions`, `onKeyboardAction`, `inputTransformation`, `outputTransformation` ve `contentType` metin alanınınkilerle aynıdır.
- **Üç biçim.** `state` alan biçimde metin durumdan okunur. `value` ve `onValueChange` alan biçim metni çağıranda tutar; onda kaydırma çubuğu yoktur. `field` alan biçim değerini, hatasını ve adını formdaki alanından alır.
- **Stil ve renkler.** `style` (`FilledTextFieldStyle`) kutunun şeklini ve ölçülerini, `colors` (`FilledTextFieldColors`) renklerini değiştirir: yalnızca verilen alanlar. Devre dışı alan ne verilirse verilsin dolgusuzdur ve temanın devre dışı yazı rengindedir.
- **Yazının boyu.** Yazılan yazı, dinlenen etiket ve yer tutucu stilin `textRole`'üyle yazılır: Android'de ve iOS'ta `body` (16sp), masaüstünde ve web'de `label` (14sp).
- **Otomasyon.** `tagKey` ile alan `FilledTextField_<tagKey>`, temizleme düğmesi `FilledTextFieldClear_<tagKey>` adını alır. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.

## Kullanım

### A name

```kotlin
val name = rememberTextFieldState()
PantrixFilledTextField(
    state = name,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.name),
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words, imeAction = ImeAction.Next),
    tagKey = "name"
)
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val username = rememberTextFieldState(initial.username)
LaunchedEffect(username) {
    snapshotFlow { username.text.toString() }.collectLatest { viewModel.updateUsername(it) }
}
PantrixFilledTextField(
    state = username,
    label = stringResource(Res.string.username),
    tagKey = "username"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixFilledTextField(
    field = form.field("iban", initial = "", Rules.notBlank(stringResource(Res.string.iban_required))),
    form = form,
    label = stringResource(Res.string.iban),
    showClearButton = true
)
```

### Several lines that scroll

```kotlin
val note = rememberTextFieldState()
PantrixFilledTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.note),
    maxLength = 280,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3, maxHeightInLines = 3),
    tagKey = "note"
)
```

### In colours of its own

```kotlin
val info = PantrixTheme.colors.info
val reference = rememberTextFieldState()
PantrixFilledTextField(
    state = reference,
    label = stringResource(Res.string.reference),
    colors = FilledTextFieldColors(container = info.container, focusedOutline = info.color, cursor = info.color),
    tagKey = "reference"
)
```

## Örnekler

### En yalın hâli

En az yazılan: bir `TextFieldState` ve bir etiket. Etiket kutunun içindedir: alan boşken ve odakta değilken yazının yerinde durur. Alana bas: etiket yazının üstündeki kendi satırına çıkar ve yazıya yer açar. Alan boş bırakılıp çıkılırsa yerine döner.

Yazılan metin durumdan okunur: alttaki satır `city.text`'i yazıldıkça gösterir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.theme.PantrixTheme

val city = rememberTextFieldState()
PantrixFilledTextField(
    state = city,
    modifier = Modifier.fillMaxWidth(),
    label = "Şehir",
    tagKey = "city"
)
PantrixText(
    text = if (city.text.isEmpty()) "Henüz bir şehir yazılmadı" else "Yazılan: ${city.text}",
    color = PantrixTheme.colors.textSecondary
)
```

### Etiket ve yer tutucu

İlk alan boş: etiket yazının yerinde durur ve yer tutucu görünmez. Alana bas: etiket yukarı çıkar, yer tutucu onun bıraktığı yerde belirir. Yer tutucu bir etiket değildir; ne yazılacağına bir örnek verir.

İkinci alanda bir metin var, etiketi bu yüzden hep yukarıdadır. Üçüncünün etiketi yok: metin kutunun ortasında durur, yer tutucu alan boş olduğu sürece görünür ve alanın adını ekran okuyucuya `contentDescription` söyler.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Web sitesi",
    placeholder = "https://ornek.com",
    tagKey = "website"
)
PantrixFilledTextField(
    state = rememberTextFieldState("Kadıköy"),
    modifier = Modifier.fillMaxWidth(),
    label = "İlçe",
    tagKey = "district"
)
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Mahalle ara",
    contentDescription = "Mahalle ara",
    tagKey = "neighbourhood"
)
```

### Yardım metni ve hata

`supportingText` kutunun altında durur. `error = true` kutuyu `danger` rengiyle çerçeveler; yardım metni ve imleç de o renge döner ve mesaj ekran okuyucuya hata olarak bildirilir. Etiket kendi renginde kalır: hatayı çerçeve ve mesaj söyler. Dolgu, odakta olduğu gibi, yüzey rengine döner.

Alan hatada başlar. Boşluğu sil: çerçeve hatanın renginden çıkar ve hata mesajının yerini yardım metni alır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

val username = rememberTextFieldState("ayşe yılmaz")
val hasSpace = username.text.contains(' ')
PantrixFilledTextField(
    state = username,
    modifier = Modifier.fillMaxWidth(),
    label = "Kullanıcı adı",
    supportingText = if (hasSpace) "Kullanıcı adında boşluk olamaz" else "Profilinizin adresinde görünür",
    error = hasSpace,
    showClearButton = true,
    tagKey = "username"
)
```

### İkon, temizleme düğmesi ve eylem tuşu

`leadingIcon` etiketin ve metnin önünde durur. Yuva içine konanı boyutlandırmaz; ikon, dolgulu alanın stilindeki boyutu alır: `PantrixTheme.style(FilledTextFieldStyle).iconSize`. `showClearButton` alan boş değilken onu boşaltan düğmeyi gösterir: düğme imleci alanda bırakır ve Tab durağı değildir.

`keyboardOptions` klavyenin eylem tuşunu "Ara" yapar; `onKeyboardAction` o tuşa basılınca çağrılır. Bir şey yazıp klavyenin "Ara" tuşuna ya da Enter'a bas: uygulamanın snackbar'ı arananı söyler.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val query = rememberTextFieldState()
PantrixFilledTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    label = "Şube ara",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Search,
            contentDescription = null,
            size = PantrixTheme.style(FilledTextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
    onKeyboardAction = { scope.launch { snackbars?.show(message = "Aranan şube: ${query.text}") } },
    tagKey = "branch"
)
```

### Giriş ve çıkış dönüşümleri

`inputTransformation` rakam olmayan bir şey içeren değişikliği bütünüyle geri çevirir; `maxLength = 4` onun geçirdiğine uygulanır. `outputTransformation` ay ile yılın arasına bir eğik çizgi çizer: çizgi metne girmez.

"1228" yaz: kutuda "12/28" görünür, alttaki satırın okuduğu `expiry.text` ise dört rakamdır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.OutputTransformation
import androidx.compose.foundation.text.input.insert
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.theme.PantrixTheme

val expiry = rememberTextFieldState()
PantrixFilledTextField(
    state = expiry,
    modifier = Modifier.fillMaxWidth(),
    label = "Son kullanma tarihi",
    placeholder = "AA/YY",
    maxLength = 4,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    inputTransformation = DigitsOnly,
    outputTransformation = MonthSlashYear,
    contentType = ContentType.CreditCardExpirationDate,
    tagKey = "expiry"
)
PantrixText(text = "Tutulan metin: \"${expiry.text}\"", color = PantrixTheme.colors.textSecondary)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}

private val MonthSlashYear = OutputTransformation {
    if (length > 2) insert(2, "/")
}
```

### Bir para gönderme formu

Bir para gönderme formu, üç biçim bir arada. İlk iki alan forma bağlıdır: değerini, hatasını ve adını formdaki alanından alır; boş bırakılıp çıkılırsa kuralın mesajı kutunun altında görünür ve kutu hata rengiyle çerçevelenir. Tutar alanı metnini bir `String` olarak tutar ve rakam olmayanı `onValueChange` içinde geri çevirir: geri çevrilen değişiklik ekranda görünmez. Sınırı yedi rakamdır; sayacı `showCharacterCount = false` ile gizlenmiştir.

Açıklama üç satır yüksekliğindedir: sığmayan metin kutunun içinde kayar ve sonundaki çubuk ne kadar kaydığını gösterir. Metni `rememberTextFieldState` ile kurulan durumdadır ve gönderilirken oradan okunur: bildirim onu `note.text` ile alır.

İlk üç alanda klavyenin "İleri" tuşu odağı sonraki alana taşır. Alanları boş bırakıp "Gönder"e bas: form gönderilmez, hatalı ilk alan odağı alır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
var amount by rememberSaveable { mutableStateOf("") }
val note = rememberTextFieldState()
PantrixFilledTextField(
    field = form.field("recipient", initial = "", Rules.notBlank("Alıcının adını yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Alıcı adı soyadı",
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words, imeAction = ImeAction.Next)
)
PantrixFilledTextField(
    field = form.field("iban", initial = "", Rules.notBlank("IBAN'ı yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "IBAN",
    placeholder = "TR00 0000 0000 0000 0000 0000 00",
    showClearButton = true,
    keyboardOptions = KeyboardOptions(
        capitalization = KeyboardCapitalization.Characters,
        imeAction = ImeAction.Next
    )
)
PantrixFilledTextField(
    value = amount,
    onValueChange = { if (it.all(Char::isDigit)) amount = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Tutar",
    placeholder = "0",
    supportingText = "Yalnızca rakam",
    trailingIcon = { PantrixText(text = "TL") },
    maxLength = 7,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number, imeAction = ImeAction.Next),
    tagKey = "amount"
)
PantrixFilledTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = "Açıklama",
    placeholder = "Kira, aidat, borç…",
    maxLength = 140,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3, maxHeightInLines = 3),
    tagKey = "transfer_note"
)
PantrixButton(
    text = "Gönder",
    onClick = {
        scope.launch {
            form.submit {
                // Açıklama, kullanılacağı anda durumdan okunur.
                val sent = if (note.text.isBlank()) "Para gönderildi" else "Para gönderildi: ${note.text}"
                snackbars?.show(message = sent, tagKey = "transfer_sent")
            }
        }
    },
    form = form,
    tagKey = "send_transfer"
)
```

### Yüksekliği verilen alan

Alana verilen yükseklik alanın bütününündür: `Modifier.height(140.dp)`. Kutu, altındaki yardım metninin bıraktığı yüksekliği alır; etiket ve metin kutunun içinde kalır, sığmayan metin orada kayar ve sonundaki çubuk ne kadar kaydığını gösterir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

PantrixFilledTextField(
    state = rememberTextFieldState(COMPLAINT),
    modifier = Modifier.fillMaxWidth().height(140.dp),
    label = "Şikâyetiniz",
    supportingText = "Alanın yüksekliği sabit: metin kutunun içinde kayar",
    lineLimits = TextFieldLineLimits.MultiLine(),
    tagKey = "complaint"
)

private const val COMPLAINT = "Kartımdan aynı ödeme iki kez çekildi.\n" +
    "İlki ayın üçünde, ikincisi dördünde.\n" +
    "İkisi de aynı tutarda ve aynı işyerinden.\n" +
    "Dekontların ikisi de elimde.\n" +
    "Birinin iade edilmesini istiyorum."
```

### Devre dışı ve salt okunur

`enabled = false` alanın dolgusunu kaldırır: devre dışı alan, üstünde durduğu zeminde temanın devre dışı yazı rengiyle çizilir, odak almaz ve ekran okuyucuya devre dışı olduğu söylenir. `colors` ne verirse versin böyledir: devre dışı bir alan uygulamanın her yerinde aynı görünür.

`readOnly = true` alanın dolgusu ve renkleri yerindedir: alan odaklanır, metni seçilir ve kopyalanır, yalnızca değiştirilemez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField

PantrixFilledTextField(
    state = rememberTextFieldState("Vadesiz TL - 1042"),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Gönderen hesap",
    supportingText = "Bu işlemde değiştirilemez",
    tagKey = "account"
)
PantrixFilledTextField(
    state = rememberTextFieldState("TR33 0006 1005 1978 6457 8413 26"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "IBAN'ınız",
    supportingText = "Salt okunur: seçilip kopyalanabilir",
    tagKey = "own_iban"
)
```

### Kendi renkleri

`colors` ile verilen renkler kullanılır, verilmeyenler temadaki rolünde kalır. İlk alanın renkleri temanın `info` rolünden alınır. Dinlenirken dolgu rolün yumuşak tonudur; etiket, yazı ve ikon o tonun üstünde okunan renktedir. Odakta ve fare üstündeyken çerçeve rolün kendi rengidir. Odaktaki dolgu, yer tutucu, yardım metni ve hata rengi verilmemiştir: temadaki hâlleriyle kalır.

İkinci alan aynısını uygulamanın kendi moruyla yapar: temanın hiçbir rolünde olmayan bir renk. Alana bas: çerçeve ve imleç mordur, dolgu odakta temanın yüzey rengine döner.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.theme.PantrixTheme

val info = PantrixTheme.colors.info
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Referans kodu",
    placeholder = "PX-0000",
    supportingText = "Varsa, sizi davet eden kişinin kodu",
    showClearButton = true,
    colors = FilledTextFieldColors(
        container = info.container,
        hoveredOutline = info.color,
        focusedOutline = info.color,
        text = info.onContainer,
        label = info.onContainer,
        icon = info.onContainer,
        cursor = info.color
    ),
    tagKey = "reference"
)
val own = ownColors()
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Kampanya kodu",
    colors = FilledTextFieldColors(
        container = own.container,
        hoveredOutline = own.color,
        focusedOutline = own.color,
        text = own.onContainer,
        label = own.onContainer,
        cursor = own.color
    ),
    tagKey = "own_colors"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stili

`style` bu çağrının kendi stilidir: yalnızca verdiği alanlar değişir, gerisi temanın ve platformun stilinden gelir.

İlk alanın kutusu tam yuvarlaktır: `FilledTextFieldStyle(shape = ShapeRole.Full)`. İkincinin köşeleri küçüktür ve `borderWidth = 2.dp` ile çerçevesi kalındır. Çerçeve odakta, hatada ve fare üstündeyken görünür; dinlenirken kutunun çerçevesi yoktur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField
import com.pantrixui.foundation.token.shape.ShapeRole

PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Tam yuvarlak kutu",
    style = FilledTextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
PantrixFilledTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Küçük köşeler, kalın çerçeve",
    style = FilledTextFieldStyle(shape = ShapeRole.Small, borderWidth = 2.dp),
    tagKey = "small_corners"
)
```

## API

### PantrixFilledTextField

`import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledTextField(
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
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    lineLimits: TextFieldLineLimits = TextFieldLineLimits.SingleLine,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Etiketi kutusunun içinde duran metin alanı: etiket yazının geleceği yerde durur, alan odağı aldığında ya da bir metin tuttuğunda yazının üstündeki kendi satırına çıkar.

Kutu dinlenirken dolguludur ve çerçevesi yoktur. Odakta primary rolünün rengiyle, hatada danger rolünün rengiyle çerçevelenir, ikisinde de yüzey renginin üstünde: odağı ve hatayı gösteren çerçevedir, neyin düzeltileceğini de kutunun altındaki bir mesaj söyler. Yazılamayan bir kutunun hiç dolgusu yoktur.

Tek satır ya da birkaç satır tutar. Birkaç satırlı kutu metnini kaydırır ve ne kadar kaydığını sonundaki bir çubukla gösterir.

Altındaki metin alanı `PantrixTextField`'ınkidir, metnin çevresindeki çizim başkadır. Onun aldıklarını alır: ikisi birbirinin yerine geçebilir. Bir `TextFieldState` üstüne kuruludur. Bir `value` ile bir `onValueChange` alan bir overload'u, bir de formun alanı için bir overload'u vardır.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `rememberTextFieldState()` ile kurulur ve yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar. Verilen yükseklik de alanın bütününündür: kutu, yardım metninin bıraktığı yüksekliği doldurur. Tek satır kutunun ortasında durur, birkaç satır üstünden başlar ve kutuya sığmayan metin içinde kayar.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, dolgusuz ve devre dışı renklerle çizilir, devre dışı olduğunu da söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır. Etiket yoksa metin kutunun ortasında durur ve `placeholder` alan boş olduğu sürece görünür.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde gösterilir: alan odaktayken, etiketi yoksa her zaman.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kutu danger rolünün rengiyle çerçevelenir, yardım metni ve imleç de o renge döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur, ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` platformun boyutundadır.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir. Düğme imleci alanda bırakır ve Tab durağı değildir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır. Sınırı aşacak bir değişiklik bütünüyle geri çevrilir. Kodla verilen metin kesilmez ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`: kutu en az satır sayısı kadar boyludur, en çok satır sayısına kadar uzar ve oradan sonra metnini kaydırır. İkisinde de Tab odağı ilerletir.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, `keyboardOptions`'ın adlandırdığı eylem için çağrılır. Null verilirse platformun yaptığı kalır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem. `maxLength` ile birlikte önce bu çalışır ve sınır onun geçirdiğine uygulanır.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye: `ContentType.EmailAddress` ve benzerleri.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alanın, ne verilirse verilsin dolgusu yoktur ve alan temanın devre dışı yazı rengiyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze kalır, ekran okuyucuya okunmaz.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `FilledTextField_<tagKey>`, temizleme düğmesi `FilledTextFieldClear_<tagKey>` diye etiketlenir. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.

### PantrixFilledTextField

`import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledTextField(
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
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    singleLine: Boolean = true,
    minLines: Int = 1,
    maxLines: Int = if (singleLine) 1 else Int.MAX_VALUE,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Metni, çağıranın tuttuğu bir `String` olan dolgulu metin alanı: alan `value`'yu gösterir ve kullanıcının her değişikliğini `onValueChange`'e sorar.

`TextFieldState` üstüne kurulu alan gibi görünür ve ölçülür. Altında ise Foundation'ın bir değer ve bir geri çağrı alan metin alanı vardır, getirdikleriyle birlikte. Geri çağrıya verilen metin bir sonraki kareye kadar `value` olarak geri dönmelidir, yoksa alan eski metni yeniden gösterir ve imleç sıçrar: metin, geri çağrının hemen yazdığı bir durumda tutulur. Metin bir akışta yaşıyorsa ya da ekranın dışında değiştiriliyorsa `TextFieldState` alan overload seçilir. Geri dönen metin sorulandan farklı olabilir. Bu overload böyle süzer: geri çağrının almadığı değişiklik gösterilmez.

Altındaki metin alanının sözcüklerini kullanır: satırları için `singleLine`, `minLines` ve `maxLines`, klavyenin eylem tuşu için `keyboardActions`, metnin nasıl gösterildiği için de `visualTransformation`. Bir şifrenin noktaları da bu gösterimlerden biridir. O metin alanı metninin ne kadar kaydığını söylemez, bu yüzden birkaç satırlı bir kutunun burada çubuğu yoktur.

Parametreler:

- `value: String`: Alanın gösterdiği metin.
- `onValueChange: (String) -> Unit`: Kullanıcının her değişikliğinde yeni metnin bütünüyle sorulur. Temizleme düğmesi de boş bir metinle sorar.
- `modifier: Modifier`: Alanın bütününün modifier'ı: kutusunun ve kutunun altındakilerin.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır.
- `error: Boolean`: Metnin yanlış olup olmadığı: kutu danger rolünün rengiyle çerçevelenir ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur. Yuva içine konanı boyutlandırmaz.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, boş bir metin isteyen bir düğme gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Sınırı aşacak bir değişiklik, `onValueChange`'e sorulmadan önce bütünüyle geri çevrilir. Sınırı aşan bir `value` olduğu gibi gösterilir ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `singleLine: Boolean`: Alanın tek satır tutup tutmadığı: tek satır yana doğru kayar. Aksi söylenmedikçe tek satır tutar. `value` içindeki bir satır sonu o zaman boşluk olarak gösterilir, `value` ise onu korur.
- `minLines: Int`: Birkaç satırlı bir alanda kutunun en az kaç satır boyunda olduğu.
- `maxLines: Int`: Birkaç satırlı bir alanda kutunun, metni kaymadan önce en çok kaç satıra kadar uzadığı.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `keyboardActions: KeyboardActions`: Klavyenin eylem tuşunun, `keyboardOptions`'ın adlandırdığı eylem için ne yaptığı.
- `visualTransformation: VisualTransformation`: Metnin, değiştirilmeden nasıl gösterileceği: `PasswordVisualTransformation()` her karakter için bir nokta çizer.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alanın, ne verilirse verilsin dolgusu yoktur ve alan temanın devre dışı yazı rengiyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `FilledTextField_<tagKey>`, temizleme düğmesi `FilledTextFieldClear_<tagKey>` diye etiketlenir.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Null verilirse alan kendi kaynağını tutar.

### PantrixFilledTextField

`import com.pantrixui.components.inputs.filledtextfield.PantrixFilledTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledTextField(
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
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    lineLimits: TextFieldLineLimits = TextFieldLineLimits.SingleLine,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı dolgulu metin alanı: metni, hatası ve adı `field`'dan gelir.

Form alanının değeri ile ekrandaki metin iki yönde de birbirini izler: yazmak form alanını değiştirir, form alanında kodla yapılan bir değişiklik de, örneğin bir sıfırlama, ekrandaki metni değiştirir. Odak metin alanından çıkınca form alanı dokunulmuş sayılır ve denetlenir: bir hata ilk kez o zaman görünür. Alan hatadayken hatanın mesajı `supportingText`'in yerine geçer. Alanın kimliği otomasyon anahtarıdır: `FilledTextField_<id>`. Form, bu alan hatadayken gönderilirse odağı buraya yollayabilir.

Parametreler:

- `field: FormField<String>`: Metin alanının gösterdiği ve değiştirdiği form alanı.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilirse klavyenin eylem tuşu formu, forma kayıtlı düğme üzerinden gönderir. `Next` ya da `Previous` eylemi odağı her zamanki gibi taşır. Eylem adlandırmayan tek satırlı bir alan `ImeAction.Done` alır, çünkü varsayılan eylem hiçbir işleyiciye ulaşmaz. Birkaç satırlı bir alan olduğu gibi bırakılır: orada Enter yeni satır açar. Çağıranın kendi `onKeyboardAction`'ı gönderimin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`. İkisinde de Tab odağı ilerletir.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, formun gönderimi yerine çağrılır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alanın, ne verilirse verilsin dolgusu yoktur ve alan temanın devre dışı yazı rengiyle çizilir.
- `contentDescription: String?`: `label` verilmeyen alan için ekran okuyucunun söylediği.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Null verilirse alan kendi kaynağını tutar.

### FilledTextFieldStyle

`import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle`, `com.pantrixui:components` içinden

```kotlin
class FilledTextFieldStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val textRole: TypeRole? = null
) : PantrixStyle<FilledTextFieldStyle>
```

`PantrixFilledTextField`'ın kutusu: şekli, en az yüksekliği ve genişliği, içindekilerin çevresindeki boşluk, ikonları ve çerçevesi.

Kutu, iç boşluklarının arasında iki satır tutar: footnote rolündeki etiketin satırı ve onun altında metnin, kendi `textRole`'ündeki satırı. `height` en az yüksekliktir: birkaç satırlı bir alan ya da büyük bir yazı ölçeği kutuyu uzatır ve metni asla kesmez. Her preset'in `verticalPadding`'i, her yoğunlukta, yüksekliğinden geriye bu iki satırı bırakır. Böylece tek satırlı bir alan tam stilinin söylediği yüksekliktedir.

İkon, kutunun kenarına yaslı, `iconSize + 2 × iconPadding` boyutunda bir yuvada durur. Yuvanın yanındaki etiket ve metin ondan `horizontalPadding − iconPadding` uzakta başlar.

Parametreler:

- `shape: ShapeSpec`: Kutunun şekli. Tam yuvarlak bir şekil, `ShapeRole.Full`, yalnızca alan tek satır tutarken bir haptır: birkaç satırlı bir alan onun yerine `ShapeRole.Large` alır, çünkü bir kapsülün eğrisi metninin ilk satırına girer.
- `height: Dp`: Kutunun en az yüksekliği.
- `minWidth: Dp`: Kutunun en az genişliği: boş bir alanın, kullanıcı içine yazdıkça genişlemesini önler.
- `horizontalPadding: Dp`: İkon olmayan yerde, kutunun kenarı ile etiketi ve metni arasındaki boşluk.
- `verticalPadding: Dp`: Etiketin satırının üstündeki ve metnin son satırının altındaki boşluk.
- `iconPadding: Dp`: Yuvasındaki bir ikonun çevresindeki boşluk.
- `iconSize: Dp`: Yuvadaki bir ikonun alması gereken boyut. Yuva, içine konanı boyutlandırmaz.
- `borderWidth: Dp`: Kutunun odakta, hatada ve fare üstündeyken aldığı çerçevenin kalınlığı. Dinlenirken çerçevesi yoktur.
- `textRole: TypeRole?`: Metnin yazıldığı, etiketin dinlendiği ve yer tutucunun yazıldığı yazı ölçeği rolü: Android'de ve iOS'ta body, 16sp, Material 3'ün bir alana yazdığı gibi; masaüstünde ve web'de label, 14sp, işaretçiyle kullanılan bir sayfadaki gibi.

### FilledTextFieldColors

`import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors`, `com.pantrixui:components` içinden

```kotlin
data class FilledTextFieldColors(
    public val container: Color = Color.Unspecified,
    public val focusedContainer: Color = Color.Unspecified,
    public val hoveredOutline: Color = Color.Unspecified,
    public val focusedOutline: Color = Color.Unspecified,
    public val error: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val label: Color = Color.Unspecified,
    public val placeholder: Color = Color.Unspecified,
    public val supportingText: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val cursor: Color = Color.Unspecified,
    public val scrollBar: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir alan için `PantrixFilledTextField`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temadaki rolünde kalır. Bir ürün yalnızca değiştirdiği renkleri verir, başkasını vermez:

```kotlin
PantrixFilledTextField(
    state = state,
    label = stringResource(Res.string.iban),
    colors = FilledTextFieldColors(focusedOutline = brand, cursor = brand)
)
```

Bunlar, salt okunur olsun olmasın, etkin bir alanın renkleridir. Devre dışı bir alanın dolgusu yoktur ve burada ne verilirse verilsin temanın devre dışı yazı rengiyle çizilir: devre dışı bir alan ürünün her yerinde aynı görünsün diye.

Parametreler:

- `container: Color`: Dinlenirken kutunun dolgusu. Temanın neutral rolünün container'ı.
- `focusedContainer: Color`: Çerçeveliyken kutunun dolgusu: odakta ve hatada. Temanın `surface` rengi.
- `hoveredOutline: Color`: Fare üstündeyken çerçeve. Temanın `borderHover` rengi.
- `focusedOutline: Color`: Alan odaktayken çerçeve. Temanın `primary` rengi.
- `error: Color`: Metnin yanlış olduğunu söyleyenler: çerçeve, kutunun altındaki mesaj, imleç ve sınırını aştığında sayaç. Temanın `danger` rengi.
- `text: Color`: Yazılan metin. Temanın `textPrimary` rengi.
- `label: Color`: Etiket: hem dinlenirken yazının yerinde, hem yazının üstündeki kendi satırında. Temanın `textSecondary` rengi.
- `placeholder: Color`: Yer tutucu. Temanın `textSecondary` rengi.
- `supportingText: Color`: Kutunun altındaki yardım metni ve sayaç. Temanın `textSecondary` rengi.
- `icon: Color`: Yuvadaki bir ikonun, kendi rengini vermedikçe çizildiği renk ve temizleme düğmesinin çarpısı. Temanın `textSecondary` rengi.
- `cursor: Color`: İmleç ve onunla birlikte bir seçimin tutamaçları ile zemini. Temanın `primary` rengi.
- `scrollBar: Color`: Birkaç satırlı bir kutunun metninin ne kadar kaydığını gösteren çubuk. Temanın `borderStrong` rengi: çubuk, kutunun dolgusunun üstünde bir işarettir ve bir kutunun yumuşak kenarı orada görünmezdi.

### rememberFormState

`import com.pantrixui.components.elements.form.rememberFormState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberFormState(): FormState
```

Yeniden kurulmalar boyunca korunan bir `FormState`. Kaydedilen bir durum değildir. Alanları `field` ile tanımlanır.

### FormState.field

`import com.pantrixui.components.elements.form.field`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> FormState.field(
    id: String,
    initial: T,
    vararg rules: Rule<T>
): FormField<T>
```

Bir alan tanımlar.

`id` ile hatırlanır: değer yeniden kurulmada korunur, ama gerçekten farklı bir alan, örneğin dinamik bir listenin başka bir satırı, kendi durumunu alır.

Parametreler:

- `id: String`
- `initial: T`: alanın başladığı değer; alan sıfırlanınca da ona döner.
- `vararg rules: Rule<T>`: değerin sırayla denetlendiği kurallar: tutmayan ilki alanın mesajını verir.

### Rules

`import com.pantrixui.components.elements.form.Rules`, `com.pantrixui:components` içinden

```kotlin
object Rules
```

Hemen her formda karşılaşılan kurallar.

Üyeleri:

- `fun notBlank(message: String): Rule<String>`: Null olmayan metin içindir. Yalnızca boşluk karakterlerinden oluşan girdiyi reddeder, oysa `isEmpty` onu geçirirdi.

  `message`: alanın metni boşken söylediği.
- `fun <T : Any> required(message: String): Rule<T?>`: Null olabilen değerler içindir: hiçbir şey seçilmemiş bir select, verilmemiş bir tarih.

  `message`: hiçbir şey seçilmemişken alanın söylediği.
- `fun mustBeTrue(message: String): Rule<Boolean>`: Rıza alınan onay kutuları içindir: "koşulları kabul et" için bir değerin olması yetmez.

  `message`: işaretlenmemişken alanın söylediği.
- `fun minLength(length: Int, message: String): Rule<String>`: En az `length` karakter. Baştaki ve sondaki boşluklar sayılmaz.

  `message`: metni `length`'ten kısayken alanın söylediği.
- `fun maxLength(length: Int, message: String): Rule<String>`: En çok `length` karakter. Boşluklar da sayılır.

  `message`: metni `length`'ten uzunken alanın söylediği.
- `fun matches(pattern: Regex, message: String): Rule<String>`: Değerin tamamı `pattern` ile eşleşir. Bir parçasının eşleşmesi yetmez.

  `message`: metni `pattern`'e uymazken alanın söylediği.
- `fun <T> satisfies(message: String, predicate: (T) -> Boolean): Rule<T>`: Alanın dışındaki bir şeye bağlı kurallar için çıkış yolu: bir şifre tekrarı, bir tarih aralığı, sunucuda önceden yapılmış bir benzersizlik denetimi.

  `message`: `predicate` değerini kabul etmezken alanın söylediği.

  `predicate`: bir değerin kabul edilip edilmediği.
