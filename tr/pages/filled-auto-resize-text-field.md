# Filled Auto Resize Text Field

Etiketi kutusunun içinde duran ve yazısı görünür kalmak için küçülen metin alanı: bir tutar, bir kart numarası, kısa bir not, dolgulu metin alanının kutusunda. Yazı kutuya sığdığı sürece stilinin boyutundadır; sığmayınca sığacak kadar küçülür, silindikçe yeniden büyür.

Kutusu `PantrixFilledTextField`'ınkidir, küçülen yazısı `PantrixAutoResizeTextField`'ınki. Dolgulu alanın `style` ve `colors`'ını alır: dolgulu alanlar birlikte biçimlenir, yazısını küçülten iki alan da birbirinin yerine geçebilir. `TextFieldState` üstüne kuruludur; `value` ve `onValueChange` alan ve bir formun alanını alan birer biçimi daha vardır.

- `PantrixFilledAutoResizeTextField` (`com.pantrixui.components.inputs.filledautoresizetextfield`, `com.pantrixui:components`): Etiketi dolgulu bir kutunun içinde duran, yazısı kutuya sığmak için küçülüp kısaldıkça yeniden büyüyen bir yazı alanı; tek satırda ya da birkaçında, bütün okunan bir tutar, sayı ya da not için; yardım ve hata metni, ikonlar, temizle düğmesi, karakter sayacı ve form bağlantısıyla. Anahtar sözcükler: otomatik boyutlu alan, sığdır, tutar alanı, kayan etiket, dolgulu alan.

## Özellikler

- **Kutunun içindeki etiket.** `label` dinlenirken yazının yerinde durur: yazının stili ne olursa olsun `body` boyutunda. Odakta ya da bir metin varken yazının üstündeki satırına çıkar.
- **Değişmeyen kutu.** Kutunun eni stilindeki en az genişlik ya da çağıranın verdiğidir; uzayan yazı onu genişletmez, sığacak kadar küçülür ve kısalınca yeniden büyür.
- **En büyük boyut.** `textStyle` yazının en büyük hâlinin stilidir: temanın bir yazı rolü, bir tutar için `title` gibi. Büyük bir stil kutuyu yalnızca etiketinin ve o stilin bir satırının sığacağı kadar uzatır.
- **En küçük boyut.** `minFontSize` yazının inebileceği en küçük boyuttur: sp olarak, ya da stilin boyutunun bir payı olan em olarak. Verilmezse temanın `footnote` boyutudur. O boyutta da sığmayan yazı her alandaki gibi kayar.
- **Birkaç satır.** Birkaç satırlı alanda kutu en az satır sayısından en çoğuna kadar yazıyla uzar; oradan sonra kutunun boyu değişmez, yazı satır aralığıyla birlikte küçülür.
- **Verilen yükseklik.** Alana verilen yükseklik satır sayısından önce gelir: kutu, yardım metninin bıraktığını doldurur ve yazı o yüksekliğe sığdırılır.
- **Yer tutucu.** `placeholder` etiket yerinden çıkmışken, alan boş ve odaktayken görünür. Yazının stilindedir ve uzunsa o da küçülür.
- **Dolgu, çerçeve ve hata.** Kutu dinlenirken dolgulu ve çerçevesizdir; odakta ve hatada çerçevelenir. `error` etiketin rengini değiştirmez. Devre dışı alanın dolgusu yoktur.
- **Üç biçim.** `state` alan biçimde metin durumdan okunur. `value` ve `onValueChange` alan biçim metni çağıranda tutar ve satırlarını `singleLine`, `minLines`, `maxLines` ile alır. `field` alan biçim bir formun alanına bağlanır.
- **Otomasyon.** `tagKey` ile alan `FilledAutoResizeTextField_<tagKey>`, temizleme düğmesi `FilledAutoResizeTextFieldClear_<tagKey>` adını alır. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.

## Kullanım

### An amount, read when it is used

```kotlin
val amount = rememberTextFieldState()
PantrixFilledAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.amount),
    placeholder = "0",
    trailingIcon = { PantrixText(text = "TL") },
    textStyle = PantrixTheme.typography.title,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
    tagKey = "amount"
)
PantrixButton(text = stringResource(Res.string.send), onClick = { onSend(amount.text.toString()) })
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val card = rememberTextFieldState(initial.cardNumber)
LaunchedEffect(card) {
    snapshotFlow { card.text.toString() }.collectLatest { viewModel.updateCardNumber(it) }
}
PantrixFilledAutoResizeTextField(
    state = card,
    label = stringResource(Res.string.card_number),
    maxLength = 19,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    contentType = ContentType.CreditCardNumber,
    tagKey = "card"
)
```

### Held as a String, digits only

```kotlin
var amount by rememberSaveable { mutableStateOf("") }
PantrixFilledAutoResizeTextField(
    value = amount,
    onValueChange = { if (it.all(Char::isDigit)) amount = it },
    label = stringResource(Res.string.amount),
    textStyle = PantrixTheme.typography.title,
    minFontSize = 14.sp,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "amount"
)
```

### A note in a box of three lines

```kotlin
val note = rememberTextFieldState()
PantrixFilledAutoResizeTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.note),
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3, maxHeightInLines = 3),
    tagKey = "note"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixFilledAutoResizeTextField(
    field = form.field("iban", initial = "", Rules.notBlank(stringResource(Res.string.iban_required))),
    form = form,
    label = stringResource(Res.string.iban),
    showClearButton = true
)
```

## Örnekler

### En yalın hâli

En az yazılan: bir `TextFieldState` ve bir etiket. Alana genişlik verilmedi: kutu stilindeki en az genişliktedir ve yazıyla birlikte genişlemez. Hesap adı o kutuya sığmayacak kadar uzun, bu yüzden küçülmüş olarak çizilir; alanda bir metin olduğu için etiket de yazının üstündeki satırındadır.

Metni sil: yazı yeniden büyür. Alan boşalıp odaktan çıkınca etiket yazının yerine iner.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField

PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("Yılmaz Mimarlık ve Mühendislik Limited Şirketi"),
    label = "Hesap adı",
    tagKey = "account_name"
)
```

### Yazı stili ve kutunun boyu

`textStyle` yazının en büyük hâlinin stilidir; verilmezse yazı `body` boyutundadır. Büyük bir stil kutuyu yalnızca etiketinin ve o stilin bir satırının sığacağı kadar uzatır: ilk iki alanı karşılaştır.

Üçüncü alan boş ve `display` stilinde. Etiket, yazının stili ne olursa olsun, yazının yerinde `body` boyutunda durur. Alana bas: etiket yukarı çıkar ve yer tutucu yazının stilinde belirir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("1250"),
    modifier = Modifier.fillMaxWidth(),
    label = "Stil verilmedi",
    tagKey = "style_body"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("1250"),
    modifier = Modifier.fillMaxWidth(),
    label = "title stilinde",
    textStyle = PantrixTheme.typography.title,
    tagKey = "style_title"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "display stilinde, boş",
    placeholder = "0",
    textStyle = PantrixTheme.typography.display,
    tagKey = "style_display"
)
```

### En küçük boyut

İki alan da `title` stilinde aynı adı tutar ve ad ikisinin kutusuna da sığmaz. İlkinde `minFontSize` verilmedi: yazı temanın `footnote` boyutuna kadar küçülür. İkincide 16 sp'den küçük yazılmaz. `minFontSize` em olarak da verilebilir: o zaman stilin kendi boyutunun bir payıdır.

En küçük boyutunda da sığmayan yazı küçülmeyi bırakır ve her alandaki gibi kayar.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.sp
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val company = "Yılmaz Mimarlık, Mühendislik ve Danışmanlık Limited Şirketi"
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState(company),
    label = "Verilmedi: footnote boyutu",
    textStyle = PantrixTheme.typography.title,
    tagKey = "smallest_default"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState(company),
    label = "En küçük 16 sp",
    textStyle = PantrixTheme.typography.title,
    minFontSize = 16.sp,
    tagKey = "smallest_sp"
)
```

### Metnini bir ViewModel'e taşıyan tutar

Bir ödeme tutarı, `headline` stilinde. Alan durumunu `rememberTextFieldState` ile, ViewModel'in o an tuttuğu değerden kurar; durumdaki metni `snapshotFlow` ile izler ve her değişikliği ViewModel'e bildirir. Metin alanın durumundan böyle alınır.

ViewModel'deki ilk değer bir kez okunur. Sonrası tek yönlüdür: metin alandan ViewModel'e akar. Ekran yeniden kurulduğunda ViewModel yerinde kalır ve alan onun değeriyle başlar.

Alttaki satır ViewModel'in tuttuğunu gösterir, düğme de ondan okur: bir tutar gelmeden basılamaz.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

val viewModel = viewModel(key = "payment") { PaymentViewModel() }
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val initialUiState = remember(viewModel) { viewModel.uiState.value }
val uiState by viewModel.uiState.collectAsStateWithLifecycle()

val amount = rememberTextFieldState(initialUiState.amount)
LaunchedEffect(amount) {
    snapshotFlow { amount.text.toString() }.collectLatest { viewModel.updateAmount(it) }
}
PantrixFilledAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = "Ödenecek tutar",
    placeholder = "0",
    supportingText = "Yazdıkça küçülür, sildikçe büyür",
    trailingIcon = { PantrixText(text = "TL") },
    showClearButton = true,
    textStyle = PantrixTheme.typography.headline,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    inputTransformation = DigitsOnly,
    tagKey = "payment_amount"
)

PantrixText(
    text = "ViewModel: tutar \"${uiState.amount}\", ${uiState.amount.length} hane",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "payment_state"
)
PantrixButton(
    text = "Öde",
    onClick = {
        scope.launch { snackbars?.show(message = "${uiState.amount} TL ödendi", tagKey = "payment_made") }
    },
    enabled = uiState.isComplete,
    tagKey = "pay"
)

private class PaymentViewModel : ViewModel() {
    private val state = MutableStateFlow(PaymentUiState())
    val uiState: StateFlow<PaymentUiState> = state.asStateFlow()

    fun updateAmount(amount: String) {
        state.update { it.copy(amount = amount) }
    }
}

private data class PaymentUiState(val amount: String = "") {
    val isComplete: Boolean get() = amount.isNotEmpty() && amount.any { it != '0' }
}

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Metnini String olarak tutan alan

On iki rakamlı bir müşteri numarası. Çağıran numarayı bir `String` olarak tutar: alan onu gösterir ve her değişikliği sorar, rakam olmayan bir değişiklik alınmadığı için de gösterilmez. Yardım metni o `String`'ten üretilir.

Sorulan metin bir sonraki kareye kadar `value` olarak geri dönmelidir, yoksa alan eski metni gösterir ve imleç sıçrar: metni, geri çağrının hemen yazdığı bir durumda tut; metin bir akışta yaşıyorsa `state` alan biçimi seç.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

var number by rememberSaveable { mutableStateOf("") }
val missing = 12 - number.length
PantrixFilledAutoResizeTextField(
    value = number,
    onValueChange = { if (it.all(Char::isDigit)) number = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Müşteri numarası",
    supportingText = if (missing == 0) "Numara tamam" else "$missing rakam daha",
    maxLength = 12,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.title,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "customer_number"
)
```

### Forma bağlı bir referans kodu

`field` alan biçim değerini, hatasını ve adını formdaki alanından alır: kod boş bırakılıp çıkılırsa kuralın mesajı yardım metninin yerine geçer. `form` verilen alanda klavyenin eylem tuşu formu "Referansı kaydet" düğmesi üzerinden gönderir.

Forma bağlı bir alanın metni formdaki alanın değeridir: ayrıca alınması gerekmez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixFilledAutoResizeTextField(
    field = form.field("reference", initial = "", Rules.notBlank("Bir referans kodu yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Referans kodu",
    supportingText = "Dekontun üstündeki kod",
    showClearButton = true,
    maxLength = 40,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters)
)
PantrixButton(
    text = "Referansı kaydet",
    onClick = {
        scope.launch {
            form.submit { snackbars?.show(message = "Referans kaydedildi", tagKey = "reference_saved") }
        }
    },
    form = form,
    tagKey = "save_reference"
)
```

### Birkaç satırlık bir adres

Birkaç satırlık bir teslimat adresi. Çağıran adresi bir `String` olarak tutar; alan bu biçimde satırlarını `singleLine`, `minLines` ve `maxLines` ile alır. Kutu iki satır boyundadır ve üç satıra kadar büyür; adres üç satırı geçince kutu aynı kalır, yazı satır aralığıyla birlikte sığacak kadar küçülür.

Yardım metni çağıranın tuttuğu `String`'ten üretilir. Sınırı 240 karakterdir; sayacı `showCharacterCount = false` ile gizlenmiştir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField

var address by rememberSaveable { mutableStateOf("") }
PantrixFilledAutoResizeTextField(
    value = address,
    onValueChange = { address = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Teslimat adresi",
    supportingText = if (address.isBlank()) "Mahalle, sokak, kapı numarası" else "${address.length} karakter",
    showClearButton = true,
    maxLength = 240,
    showCharacterCount = false,
    singleLine = false,
    minLines = 2,
    maxLines = 3,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    tagKey = "delivery_address"
)
```

### Yardım metni ve hata

`supportingText` kutunun altında durur. `error = true` kutuyu `danger` rengiyle çerçeveler; yardım metni ve imleç de o renge döner ve mesaj ekran okuyucuya hata olarak bildirilir. Etiket kendi renginde kalır.

Alan hatada başlar: plakada küçük harfler var. Onları büyük harfle yeniden yaz: hata kalkar. Hatayı alan değil çağıran hesaplar; burada `plate.text`'i okuyarak.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val plate = rememberTextFieldState("34 abc 1903")
val lowercase = plate.text.any(Char::isLowerCase)
PantrixFilledAutoResizeTextField(
    state = plate,
    modifier = Modifier.fillMaxWidth(),
    label = "Araç plakası",
    supportingText = if (lowercase) "Plakayı büyük harfle yazın" else "Ruhsatta yazdığı gibi",
    error = lowercase,
    showClearButton = true,
    maxLength = 12,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.title,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters),
    tagKey = "plate"
)
```

### Devre dışı ve salt okunur

`enabled = false` alanın dolgusunu kaldırır: alan temanın devre dışı yazı rengiyle çizilir ve odak almaz. Yazısı yine kutusuna sığdırılır: IBAN `title` stilindedir ve sığmadığı kutuda küçülür.

`readOnly = true` alanın dolgusu yerindedir: alan odaklanır, metni seçilir ve kopyalanır, yalnızca değiştirilemez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("TR330006100519786457841326"),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Kayıtlı IBAN",
    supportingText = "Devre dışı: başlık stilinde, sığmak için küçüldü",
    textStyle = PantrixTheme.typography.title,
    tagKey = "saved_iban"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("PX-2026-0914-TR-000187"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Sözleşme numarası",
    supportingText = "Salt okunur: seçilip kopyalanabilir",
    textStyle = PantrixTheme.typography.title,
    tagKey = "contract_no"
)
```

### Kendi renkleri ve stili

Bu alan, dolgulu metin alanının `FilledTextFieldColors`'ını ve `FilledTextFieldStyle`'ını alır: dolgulu alanlar birlikte biçimlenir.

İlk alanın dolgusu, etiketi, yazısı, çerçevesi ve imleci uygulamanın kendi morundandır; odaktaki dolgu verilmedi, temanın yüzey rengidir. İkincinin kutusu tam yuvarlaktır: `FilledTextFieldStyle(shape = ShapeRole.Full)`. `textStyle` yazının, `style` kutunun stilidir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("Yaz 2026 Koleksiyonu"),
    modifier = Modifier.fillMaxWidth(),
    label = "Liste adı",
    textStyle = PantrixTheme.typography.title,
    colors = FilledTextFieldColors(
        container = own.container,
        focusedOutline = own.color,
        text = own.onContainer,
        label = own.onContainer,
        cursor = own.color
    ),
    tagKey = "own_colors"
)
PantrixFilledAutoResizeTextField(
    state = rememberTextFieldState("KP-48213"),
    modifier = Modifier.fillMaxWidth(),
    label = "Kupon",
    textStyle = PantrixTheme.typography.title,
    style = FilledTextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixFilledAutoResizeTextField

`import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledAutoResizeTextField(
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
    textStyle: TextStyle? = null,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
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

Etiketi kutusunun içinde duran ve yazısı görünür kalmak için küçülen metin alanı: bir tutar, bir kart numarası, kısa bir not, bütünü okunan her şey, `PantrixFilledTextField`'ın dolgulu kutusunda.

Yazı sığdığı sürece stilinin söylediği boyuttadır. Kutuya sığmayacak kadar uzun bir yazı, sığacak kadar küçük bir boyutta yazılır ve kısaldıkça yeniden büyür. Kutu yazısıyla birlikte genişlemez: eni stilindeki en az genişlik ya da çağıranın verdiği genişliktir. `minFontSize` boyutunda yazı küçülmeyi bırakır ve her alanın yazısı gibi kayar.

Aksi söylenmedikçe alan tek satır tutar: boyu değişmeyen bir kutuda, kutunun enine sığdırılan bir satır. Birkaç satırlık bir `lineLimits` ile yazı satırlara bölünür ve kutu, dolgulu bir metin alanının kutusu gibi, en az satır sayısından en çoğuna kadar yazıyla birlikte uzar. Oradan sonra kutunun boyu değişmez, yazı küçülür ve satırları da aynı oranda sıklaşır: böylece yazının tamamı kutuda kalır.

Alana verilen bir yükseklik satır sayısından önce gelir. Kutu, bu yükseklikten yardım metninin bıraktığını doldurur ve yazı buna sığdırılır: yükseklik alanın alabileceğinden az satır tutuyorsa yazı küçülür, daha çok satır tutuyorsa yazı o kadar satır boyunca boyutunu korur. Tek satır, kendisine alçak gelen bir kutuda küçülür.

Sığdırılan, gösterildiği hâliyle yazıdır: çıkış dönüşümünden sonraki hâli, klavyenin o an yazmakta olduğuyla birlikte. Değişen yazının boyutudur ve hiçbir şey yerleştirildiğinden küçük çizilmez: imleç, seçim ve tutamaçları yazının o anki boyutundadır, bir testin yazının yerleşiminden okuduğu boyut da odur. Yer tutucu yazının boyutunda, uzunsa daha küçük bir boyutta yazılır. Boyutu değişen bir kutunun yazısı bir kare sonra yeniden sığdırılır. Alan ilk gösterildiğinde kutusuna sığmayacak kadar uzun olan bir yazı da bir kare sonra, sığdırılmış olarak çizilir ve hiçbir zaman fazla büyük bir boyutta görünmez.

Etiket yazının geleceği yerde durur: yazının boyutu ne olursa olsun body boyutunda. Alan odağı aldığında ya da bir metin tuttuğunda yazının üstündeki kendi satırına çıkar. Kutu dinlenirken dolguludur ve çerçevesi yoktur, odakta ve hatada çerçevelenir. Bu alan, `PantrixAutoResizeTextField`'ın küçülttüğü yazının çevresindeki o dolgulu kutudur ve dolgulu metin alanının `style` ile `colors`'ını alır: dolgulu alanlar birlikte biçimlenir, yazısını küçülten iki alan da birbirinin yerine geçebilir. Bir `TextFieldState` üstüne kuruludur. Bir `value` ile bir `onValueChange` alan bir overload'u, bir de formun alanı için bir overload'u vardır.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `rememberTextFieldState()` ile kurulur ve yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar. Bir yükseklik verilirse yazı, genişliğe sığdırıldığı gibi ona da sığdırılır.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, dolgusuz ve devre dışı renklerle çizilir, devre dışı olduğunu da söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır. Etiket yoksa metin kutunun ortasında durur ve `placeholder` alan boş olduğu sürece görünür.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde gösterilir: alan odaktayken, etiketi yoksa her zaman. Yazının stilinde yazılır, ama dolgulu bir alanın yazılana eklediği ağırlık olmadan.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kutu danger rolünün rengiyle çerçevelenir, yardım metni ve imleç de o renge döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur, ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` platformun boyutundadır.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur: bir tutarın arkasındaki para birimi işareti gibi.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir. Düğme imleci alanda bırakır ve Tab durağı değildir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır. Sınırı aşacak bir değişiklik bütünüyle geri çevrilir. Kodla verilen metin kesilmez ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textStyle: TextStyle?`: Yazının en büyük hâlinin stili: temanın bir yazı rolü, bir tutar için `PantrixTheme.typography.title` gibi. Boş bıraktıkları, orta ağırlıktaki body stilinden gelir: bu stil verilmediğinde dolgulu bir alanın yazısı da öyle yazılır. Stile göre kısa kalan kutu, etiketini ve o stilin bir satırını alacak kadar uzar.
- `minFontSize: TextUnit`: Yazının inebileceği en küçük boyut: sp olarak bir boyut, ya da stilin kendi boyutunun bir payı olan em olarak bir boyut. Verilmezse temanın footnote boyutudur. Bu boyutta da sığmayan yazı kayar. Bu boyut stilin kendi boyutunda ya da onun üstündeyse yazı hiç küçülmez.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`: ikincisinde yazı satırlara bölünür ve Enter yeni satır açar. Kutu, yazının en büyük boyutunda satırları ne kadar yer tutuyorsa o kadar boyludur: `minHeightInLines` satırdan `maxHeightInLines` satıra kadar uzar, en çok satır sayısı geçilince yazı küçülür. En çok satır sayısı verilmemişse kutu, uzayabildiği sürece yazısıyla birlikte uzar ve yazı yalnızca alana bir yükseklik verildiğinde küçülür. İkisinde de Tab odağı ilerletir.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, `keyboardOptions`'ın adlandırdığı eylem için çağrılır. Null verilirse platformun yaptığı kalır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem. `maxLength` ile birlikte önce bu çalışır ve sınır onun geçirdiğine uygulanır.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği: bir tutarın ayırıcıları gibi. Yazı gösterildiği hâliyle sığdırılır.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye: `ContentType.CreditCardNumber` ve benzerleri.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alanın, ne verilirse verilsin dolgusu yoktur ve alan temanın devre dışı yazı rengiyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze kalır, ekran okuyucuya okunmaz.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `FilledAutoResizeTextField_<tagKey>`, temizleme düğmesi `FilledAutoResizeTextFieldClear_<tagKey>` diye etiketlenir. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.

### PantrixFilledAutoResizeTextField

`import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledAutoResizeTextField(
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
    textStyle: TextStyle? = null,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
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

Yazısı sığmak için küçülen ve metnini çağıranın bir `String` olarak tuttuğu dolgulu metin alanı: alan `value`'yu gösterir ve kullanıcının her değişikliğini `onValueChange`'e sorar.

`TextFieldState` üstüne kurulu alan gibi görünür, ölçülür ve yazısını küçültür. Altında ise Foundation'ın bir değer ve bir geri çağrı alan metin alanı vardır. Geri çağrıya verilen metin bir sonraki kareye kadar `value` olarak geri dönmelidir, yoksa alan eski metni yeniden gösterir ve imleç sıçrar: metin, geri çağrının hemen yazdığı bir durumda tutulur, bir akışta yaşıyorsa da `TextFieldState` alan overload seçilir. Geri dönen metin sorulandan farklı olabilir. Bu overload böyle süzer: geri çağrının almadığı değişiklik gösterilmez.

Altındaki metin alanının sözcüklerini kullanır: satırları için `singleLine`, `minLines` ve `maxLines`.

Parametreler:

- `value: String`: Alanın gösterdiği metin.
- `onValueChange: (String) -> Unit`: Kullanıcının her değişikliğinde yeni metnin bütünüyle sorulur. Temizleme düğmesi de boş bir metinle sorar.
- `modifier: Modifier`: Alanın bütününün modifier'ı: kutusunun ve kutunun altındakilerin.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde, yazının boyutunda gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır.
- `error: Boolean`: Metnin yanlış olup olmadığı: kutu danger rolünün rengiyle çerçevelenir ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur. Yuva içine konanı boyutlandırmaz.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, boş bir metin isteyen bir düğme gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Sınırı aşacak bir değişiklik, `onValueChange`'e sorulmadan önce bütünüyle geri çevrilir. Sınırı aşan bir `value` olduğu gibi gösterilir ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textStyle: TextStyle?`: Yazının en büyük hâlinin stili. Boş bıraktıkları, orta ağırlıktaki body stilinden gelir.
- `minFontSize: TextUnit`: Yazının inebileceği en küçük boyut, sp ya da em olarak: verilmezse temanın footnote boyutudur. Bu boyutta da sığmayan yazı kayar.
- `singleLine: Boolean`: Alanın tek satır tutup tutmadığı: tek satır kutunun enine sığdırılır. Aksi söylenmedikçe tek satır tutar. `value` içindeki bir satır sonu o zaman boşluk olarak gösterilir, `value` ise onu korur.
- `minLines: Int`: Birkaç satırlı bir alanda kutunun en az kaç satır boyunda olduğu: satırlar yazının en büyük boyutunda sayılır.
- `maxLines: Int`: Birkaç satırlı bir alanda kutunun, yazısı küçülmeden önce en çok kaç satıra kadar uzadığı.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `keyboardActions: KeyboardActions`: Klavyenin eylem tuşunun, `keyboardOptions`'ın adlandırdığı eylem için ne yaptığı.
- `visualTransformation: VisualTransformation`: Metnin, değiştirilmeden nasıl gösterileceği: bir tutarın ayırıcıları gibi. Yazı gösterildiği hâliyle sığdırılır.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alanın, ne verilirse verilsin dolgusu yoktur ve alan temanın devre dışı yazı rengiyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `FilledAutoResizeTextField_<tagKey>`, temizleme düğmesi `FilledAutoResizeTextFieldClear_<tagKey>` diye etiketlenir.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Null verilirse alan kendi kaynağını tutar.

### PantrixFilledAutoResizeTextField

`import com.pantrixui.components.inputs.filledautoresizetextfield.PantrixFilledAutoResizeTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledAutoResizeTextField(
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
    textStyle: TextStyle? = null,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
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

Yazısı sığmak için küçülen, bir formun alanına bağlı dolgulu metin alanı: metni, hatası ve adı `field`'dan gelir.

Form alanının değeri ile ekrandaki metin iki yönde de birbirini izler: yazmak form alanını değiştirir, form alanında kodla yapılan bir değişiklik de, örneğin bir sıfırlama, ekrandaki metnin yerine geçer. Odak ayrılınca alan dokunulmuş olarak işaretlenir ve denetlenir: bir hata ilk kez o zaman görünür. Alan hatadayken mesajı `supportingText`'in yerine geçer. Alanın kimliği otomasyon anahtarıdır: `FilledAutoResizeTextField_<id>`. Form bu alan hatadayken gönderilirse odağı buraya gönderebilir.

Parametreler:

- `field: FormField<String>`: Metin alanının gösterdiği ve değiştirdiği form alanı.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilirse klavyenin eylem tuşu formu, forma kayıtlı düğme üzerinden gönderir. `Next` ya da `Previous` eylemi odağı her zamanki gibi taşır. Eylem adlandırmayan tek satırlı bir alan `ImeAction.Done` alır, çünkü varsayılan eylem hiçbir işleyiciye ulaşmaz. Birkaç satırlı bir alan olduğu gibi bırakılır: orada Enter yeni satır açar. Çağıranın kendi `onKeyboardAction`'ı gönderimin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde, yazının boyutunda gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textStyle: TextStyle?`: Yazının en büyük hâlinin stili. Boş bıraktıkları, orta ağırlıktaki body stilinden gelir.
- `minFontSize: TextUnit`: Yazının inebileceği en küçük boyut, sp ya da em olarak: verilmezse temanın footnote boyutudur.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`: ikincisinde yazı, en çok satır sayısı geçilince küçülür. İkisinde de Tab odağı ilerletir.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, formun gönderimi yerine çağrılır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği. Yazı gösterildiği hâliyle sığdırılır.
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
