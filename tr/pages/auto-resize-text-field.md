# Auto Resize Text Field

Yazısı görünür kalmak için küçülen metin alanı: bir tutar, bir kart numarası, kısa bir not; bütünü okunan her şey. Yazı kutuya sığdığı sürece stilinin boyutundadır; sığmayınca sığacak kadar küçülür, silindikçe yeniden büyür. Kutu yazıyla birlikte genişlemez.

Etiketi, kutusu ve yardım metni `PantrixTextField`'ınkilerdir ve onun `style` ile `colors`'ını alır. `TextFieldState` üstüne kuruludur; `value` ve `onValueChange` alan ve bir formun alanını alan birer biçimi daha vardır.

- `PantrixAutoResizeTextField` (`com.pantrixui.components.inputs.autoresizetextfield`, `com.pantrixui:components`): Yazısı kutusuna sığmak için küçülen, kısaldıkça yeniden büyüyen bir yazı alanı; tek satırda ya da birkaçında, bütün okunan bir tutar, sayı ya da not için; etiket, yardım ve hata metni, ikonlar, temizle düğmesi, karakter sayacı ve form bağlantısıyla. Anahtar sözcükler: otomatik boyutlu alan, sığdır, tutar alanı, fiyat alanı, küçülen yazı.

## Özellikler

- **Değişmeyen kutu.** Kutunun eni stilindeki en az genişlik ya da çağıranın verdiğidir; uzayan yazı onu genişletmez, sığacak kadar küçülür.
- **En büyük boyut.** `textStyle` yazının en büyük hâlinin stilidir: temanın bir yazı rolü, bir tutar için `headline` gibi. Verilmezse `body`'dir. Stiline göre kısa kalan kutu, o stilin bir satırını alacak kadar uzar.
- **En küçük boyut.** `minFontSize` yazının inebileceği en küçük boyuttur: sp olarak, ya da stilin boyutunun bir payı olan em olarak. Verilmezse temanın `footnote` boyutudur. O boyutta da sığmayan yazı her alandaki gibi kayar.
- **Birkaç satır.** `lineLimits = TextFieldLineLimits.MultiLine(...)` ile yazı satırlara bölünür ve kutu en az satır sayısından en çoğuna kadar onunla uzar. Oradan sonra kutunun boyu değişmez, yazı satır aralığıyla birlikte küçülür.
- **Verilen yükseklik.** Alana verilen yükseklik satır sayısından önce gelir: kutu onu doldurur ve yazı o yüksekliğe sığdırılır.
- **Sığdırılan, gösterilen yazıdır.** `outputTransformation`'ın yalnızca gösterirken eklediği binlik ayırıcılar ve klavyenin o an yazmakta olduğu da hesaba girer. Yer tutucu yazının stilindedir ve uzunsa o da küçülür.
- **Küçülen, yazının boyutudur.** Hiçbir şey olduğundan küçük çizilmez: imleç, seçim ve tutamaçları yazının o anki boyutundadır.
- **Üç biçim.** `state` alan biçimde metin durumdan okunur. `value` ve `onValueChange` alan biçim metni çağıranda tutar ve satırlarını `singleLine`, `minLines`, `maxLines` ile alır. `field` alan biçim bir formun alanına bağlanır.
- **Metin alanından gelenler.** `label`, `placeholder`, `supportingText`, `error`, ikonlar, `showClearButton`, `maxLength`, klavye ve dönüşümler metin alanındaki gibidir.
- **Otomasyon.** `tagKey` ile alan `AutoResizeTextField_<tagKey>`, temizleme düğmesi `AutoResizeTextFieldClear_<tagKey>` adını alır. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.

## Kullanım

### An amount, read when it is used

```kotlin
val amount = rememberTextFieldState()
PantrixAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.amount),
    placeholder = "0",
    trailingIcon = { PantrixText(text = "TL") },
    textStyle = PantrixTheme.typography.headline,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
    tagKey = "amount"
)
PantrixButton(text = stringResource(Res.string.send), onClick = { onSend(amount.text.toString()) })
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val amount = rememberTextFieldState(initial.amount)
LaunchedEffect(amount) {
    snapshotFlow { amount.text.toString() }.collectLatest { viewModel.updateAmount(it) }
}
PantrixAutoResizeTextField(
    state = amount,
    label = stringResource(Res.string.amount),
    textStyle = PantrixTheme.typography.title,
    tagKey = "amount"
)
```

### Held as a String, digits only

```kotlin
var amount by rememberSaveable { mutableStateOf("") }
PantrixAutoResizeTextField(
    value = amount,
    onValueChange = { if (it.all(Char::isDigit)) amount = it },
    label = stringResource(Res.string.amount),
    textStyle = PantrixTheme.typography.headline,
    minFontSize = 14.sp,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "amount"
)
```

### A note in a box of three lines

```kotlin
val note = rememberTextFieldState()
PantrixAutoResizeTextField(
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
PantrixAutoResizeTextField(
    field = form.field("iban", initial = "", Rules.notBlank(stringResource(Res.string.iban_required))),
    form = form,
    label = stringResource(Res.string.iban),
    showClearButton = true
)
```

## Örnekler

### En yalın hâli

En az yazılan: bir `TextFieldState` ve bir etiket. Alana genişlik verilmedi: kutu stilindeki en az genişliktedir ve yazıyla birlikte genişlemez. Adres o kutuya sığmayacak kadar uzun, bu yüzden küçülmüş olarak çizilir.

Yazmaya devam et: yazı en küçük boyutuna, temanın `footnote` boyutuna kadar küçülür; orada küçülmeyi bırakır ve her alandaki gibi kayar. Sil: yazı yeniden büyür, ama stilinin boyutunu, burada `body`'yi, geçmez.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField

PantrixAutoResizeTextField(
    state = rememberTextFieldState("Atatürk Bulvarı No: 125, Daire 14, Çankaya"),
    label = "Adres",
    tagKey = "plain_address"
)
```

### Büyük yazılan bir tutar

Bir havale tutarı, temanın en büyük stilinde: `textStyle = PantrixTheme.typography.display`. Birkaç rakam kutuyu doldurur; sonrakilerle rakamlar kutuya sığacak kadar küçülür, kutunun eni de boyu da aynı kalır. Kutu, bu stilin bir satırını alacak kadar uzundur.

Klavyesi ondalık klavyedir, tutar olmayanı bir giriş dönüşümü geri çevirir, binlik noktaları da bir çıkış dönüşümü yalnızca gösterirken koyar. Sığdırılan, çizilen yazıdır: noktalar da hesaba girer.

Metin kullanılacağı anda durumdan okunur: düğmeye basılınca `amount.text`. Okunan, yazılan metindir; gösterimde eklenen noktalar onun parçası değildir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.OutputTransformation
import androidx.compose.foundation.text.input.insert
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val amount = rememberTextFieldState()
PantrixAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = "Tutar",
    placeholder = "0",
    supportingText = "Yazdıkça küçülür, sildikçe büyür",
    trailingIcon = { PantrixText(text = "TL") },
    showClearButton = true,
    textStyle = PantrixTheme.typography.display,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
    inputTransformation = AnAmount,
    outputTransformation = GroupedInThousands,
    tagKey = "transfer_amount"
)
PantrixButton(
    text = "Gönder",
    onClick = {
        val entered = amount.text.toString()
        val message = if (entered.isEmpty()) "Bir tutar yazın" else "$entered TL gönderilecek"
        scope.launch { snackbars?.show(message = message, tagKey = "amount_read") }
    },
    tagKey = "send_amount"
)

private val AnAmount = InputTransformation {
    val typed = asCharSequence().toString()
    val amount = typed.replace('.', ',')
    when {
        !AMOUNT.matches(amount) -> revertAllChanges()
        amount != typed -> replace(0, length, amount)
    }
}

private val AMOUNT = Regex("""\d{0,12}(,\d{0,2})?""")

private val GroupedInThousands = OutputTransformation {
    val whole = asCharSequence().indexOf(',').let { comma -> if (comma < 0) length else comma }
    // Sağdan sola: sonra eklenen her nokta, önce eklenenlerin solunda kalır ve yerlerini kaydırmaz.
    var at = whole - 3
    while (at > 0) {
        insert(at, ".")
        at -= 3
    }
}
```

### En küçük boyut

Üç alan da `title` stilinde aynı adresi tutar. Adres hiçbirinin kutusuna sığmaz, bu yüzden her biri kendi en küçük boyutuna inmiştir. İlkinde `minFontSize` verilmedi: yazı temanın `footnote` boyutuna kadar küçülür. İkincide en küçük boyut 14 sp'dir. Üçüncüde em olarak verildi: `0.8.em`, stilin kendi boyutunun onda sekizi.

En küçük boyutunda da sığmayan yazı küçülmeyi bırakır ve her alandaki gibi kayar. Stilin kendi boyutunda ya da üstünde bir `minFontSize` yazıyı hiç küçültmez.

```kotlin
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val address = "Atatürk Bulvarı No: 125, Daire 14, Kızılay Mahallesi, Çankaya, Ankara"
PantrixAutoResizeTextField(
    state = rememberTextFieldState(address),
    label = "Verilmedi: footnote boyutu",
    textStyle = PantrixTheme.typography.title,
    tagKey = "smallest_default"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState(address),
    label = "En küçük 14 sp",
    textStyle = PantrixTheme.typography.title,
    minFontSize = 14.sp,
    tagKey = "smallest_sp"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState(address),
    label = "En küçük 0,8 em",
    textStyle = PantrixTheme.typography.title,
    minFontSize = 0.8.em,
    tagKey = "smallest_em"
)
```

### Metnini String olarak tutan alan

On altı rakamlı bir kart numarası. Çağıran numarayı bir `String` olarak tutar: alan onu gösterir ve her değişikliği sorar, rakam olmayan bir değişiklik alınmadığı için de gösterilmez. Yardım metni o `String`'ten üretilir. Bu biçim satırlarını `singleLine`, `minLines` ve `maxLines` ile alır.

Yazı `title` stilindedir ve sığmadığı kutuda küçülür. En küçük boyutu etiket boyutudur (`minFontSize = PantrixTheme.typography.label.fontSize`): numara ondan küçük yazılmaz. Yer tutucu da yazının stilindedir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

var number by rememberSaveable { mutableStateOf("") }
val missing = 16 - number.length
PantrixAutoResizeTextField(
    value = number,
    onValueChange = { if (it.all(Char::isDigit)) number = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Kart numarası",
    placeholder = "0000000000000000",
    supportingText = if (missing == 0) "Numara tamam" else "$missing rakam daha",
    maxLength = 16,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.title,
    minFontSize = PantrixTheme.typography.label.fontSize,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    contentType = ContentType.CreditCardNumber,
    tagKey = "card_number"
)
```

### Forma bağlı bir IBAN

`field` alan biçim değerini, hatasını ve adını formdaki alanından alır: IBAN eksik bırakılıp çıkılırsa kuralın mesajı yardım metninin yerine geçer. `form` verilen alanda klavyenin eylem tuşu formu "IBAN'ı kaydet" düğmesi üzerinden gönderir. Forma bağlı bir alanın metni formdaki alanın değeridir: ayrıca alınması gerekmez.

Yirmi altı karakter `callout` stilinde dar bir kutuya sığmaz: yazı küçülür ve IBAN'ın bütünü görünür kalır.

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
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixAutoResizeTextField(
    field = form.field("iban", initial = "", Rules.matches(IBAN, "TR ile başlayan 26 karakterli bir IBAN yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "IBAN",
    placeholder = "TR000000000000000000000000",
    supportingText = "Uzun olsa da bütünü görünür",
    showClearButton = true,
    maxLength = 26,
    textStyle = PantrixTheme.typography.callout,
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters)
)
PantrixButton(
    text = "IBAN'ı kaydet",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "IBAN kaydedildi", tagKey = "iban_saved") } }
    },
    form = form,
    tagKey = "save_iban"
)

private val IBAN = Regex("""TR\d{24}""")
```

### Birkaç satırlık bir not

`lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 2, maxHeightInLines = 4)` ile yazı satırlara bölünür: kutu iki satır boyundadır ve yazıyla birlikte dört satıra kadar büyür. Not dört satırı geçince kutu aynı kalır, yazı satır aralığıyla birlikte sığacak kadar küçülür. Enter yeni satır açar.

Metin kullanılacağı anda durumdan okunur: düğmeye basılınca `note.text`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val note = rememberTextFieldState()
PantrixAutoResizeTextField(
    state = note,
    modifier = Modifier.fillMaxWidth(),
    label = "Kuryeye not",
    placeholder = "Zili çalmayın, kapıya bırakın",
    supportingText = "Dört satıra kadar büyür, sonra yazı küçülür",
    showClearButton = true,
    maxLength = 280,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 2, maxHeightInLines = 4),
    tagKey = "courier_note"
)
PantrixButton(
    text = "Notu kaydet",
    onClick = {
        val written = note.text.toString()
        val message = if (written.isBlank()) "Bir not yazın" else "Not kaydedildi: ${written.length} karakter"
        scope.launch { snackbars?.show(message = message, tagKey = "note_saved") }
    },
    tagKey = "save_note"
)
```

### Yüksekliği verilen alan

Bir hediye kartına yazılan mesaj, yüksekliği verilen bir alanda: `Modifier.height(180.dp)`. Yükseklik alanın bütününündür: kutu, etiketle yardım metninin bıraktığını doldurur ve mesaj kısayken de aynı boydadır. Yazı `title` stilinde başlar; kutuya sığmayınca bütünü görünecek en büyük boyuta iner, silindikçe yeniden büyür.

Satır sınırı verilmemiştir (`TextFieldLineLimits.MultiLine()`): yazının sığacağı yer alanın yüksekliğidir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixAutoResizeTextField(
    state = rememberTextFieldState(CARD_MESSAGE),
    modifier = Modifier.fillMaxWidth().height(180.dp),
    label = "Kart mesajı",
    supportingText = "Alanın yüksekliği sabit: yazı sığmak için küçülür",
    showClearButton = true,
    maxLength = 280,
    textStyle = PantrixTheme.typography.title,
    lineLimits = TextFieldLineLimits.MultiLine(),
    tagKey = "card_message"
)

private const val CARD_MESSAGE = "İyi ki doğdun! Yeni yaşın sana sağlık, mutluluk ve bolca neşe getirsin. " +
    "Birlikte geçireceğimiz daha nice güzel yıllara."
```

### Yardım metni ve hata

`supportingText` kutunun altında durur. `error = true` kenarlığı, etiketi, yardım metnini ve imleci `danger` rolüne çevirir ve mesaj ekran okuyucuya hata olarak bildirilir. Alan hatada başlar: 75.000, günlük limitin üstünde. Bir rakam sil: hata kalkar.

Hatayı alan değil çağıran hesaplar; burada `amount.text`'i okuyarak. Okunan, yazılan rakamlardır: binlik noktaları yalnızca çizilir.

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
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

val amount = rememberTextFieldState("75000")
val typed = amount.text.toString().toLongOrNull() ?: 0L
val overLimit = typed > 50_000
PantrixAutoResizeTextField(
    state = amount,
    modifier = Modifier.fillMaxWidth(),
    label = "Çekilecek tutar",
    supportingText = if (overLimit) "Günlük limiti aşıyor: en çok 50.000 TL" else "Günlük limit 50.000 TL",
    error = overLimit,
    trailingIcon = { PantrixText(text = "TL") },
    showClearButton = true,
    maxLength = 9,
    showCharacterCount = false,
    textStyle = PantrixTheme.typography.headline,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    inputTransformation = DigitsOnly,
    outputTransformation = GroupedInThousands,
    tagKey = "withdrawal"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}

private val GroupedInThousands = OutputTransformation {
    val whole = asCharSequence().indexOf(',').let { comma -> if (comma < 0) length else comma }
    // Sağdan sola: sonra eklenen her nokta, önce eklenenlerin solunda kalır ve yerlerini kaydırmaz.
    var at = whole - 3
    while (at > 0) {
        insert(at, ".")
        at -= 3
    }
}
```

### Salt okunur ve devre dışı

`readOnly = true` alan değiştirilemez, ama odaklanır ve metni seçilip kopyalanır. Bakiye `headline` stilindedir ve binlik noktalarıyla gösterilir; sığmadığı kutuda, yazılabilen bir alandaki gibi küçülür.

`enabled = false` alan temanın devre dışı renkleriyle çizilir ve odak almaz. Yazısı yine kutusuna sığdırılır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.OutputTransformation
import androidx.compose.foundation.text.input.insert
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.foundation.theme.PantrixTheme

PantrixAutoResizeTextField(
    state = rememberTextFieldState("125000000000000,00"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Bakiye",
    supportingText = "Salt okunur: headline stilinde, sığmak için küçüldü",
    trailingIcon = { PantrixText(text = "TL") },
    textStyle = PantrixTheme.typography.headline,
    outputTransformation = GroupedInThousands,
    tagKey = "balance"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState("4543 60** **** 0719"),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Kayıtlı kart",
    supportingText = "Devre dışı: bu ödemede değiştirilemez",
    textStyle = PantrixTheme.typography.title,
    tagKey = "saved_card"
)

private val GroupedInThousands = OutputTransformation {
    val whole = asCharSequence().indexOf(',').let { comma -> if (comma < 0) length else comma }
    // Sağdan sola: sonra eklenen her nokta, önce eklenenlerin solunda kalır ve yerlerini kaydırmaz.
    var at = whole - 3
    while (at > 0) {
        insert(at, ".")
        at -= 3
    }
}
```

### Kendi renkleri ve stili

Bu alanın kendi stil ve renk sınıfı yoktur: `PantrixTextField`'ın `TextFieldColors`'ını ve `TextFieldStyle`'ını alır. Metin alanlarını yeniden biçimleyen bir ürün bunu da biçimlemiş olur.

İlk alanda yazı, odaktaki kenarlık ve imleç uygulamanın kendi morudur. İkincinin kutusu tam yuvarlaktır: `TextFieldStyle(shape = ShapeRole.Full)`. `textStyle` ile `style` ayrı şeylerdir: ilki yazının, ikincisi kutunun stilidir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixAutoResizeTextField(
    state = rememberTextFieldState("2026 Bahar Kampanyası"),
    modifier = Modifier.fillMaxWidth(),
    label = "Kampanya adı",
    textStyle = PantrixTheme.typography.title,
    colors = TextFieldColors(focusedBorder = own.color, text = own.color, cursor = own.color),
    tagKey = "own_colors"
)
PantrixAutoResizeTextField(
    state = rememberTextFieldState("PX-2026-0914"),
    modifier = Modifier.fillMaxWidth(),
    label = "Takip numarası",
    textStyle = PantrixTheme.typography.title,
    style = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixAutoResizeTextField

`import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAutoResizeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Yazısı görünür kalmak için küçülen metin alanı: bir tutar, bir kart numarası, kısa bir not, bütünü okunan her şey.

Yazı sığdığı sürece stilinin söylediği boyuttadır. Kutuya sığmayacak kadar uzun bir yazı, sığacak kadar küçük bir boyutta yazılır ve kısaldıkça yeniden büyür. Kutu yazısıyla birlikte genişlemez: eni stilindeki en az genişlik ya da çağıranın verdiği genişliktir. `minFontSize` boyutunda yazı küçülmeyi bırakır ve her alanın yazısı gibi kayar.

Aksi söylenmedikçe alan tek satır tutar: boyu değişmeyen bir kutuda, kutunun enine sığdırılan bir satır. Birkaç satırlık bir `lineLimits` ile yazı satırlara bölünür ve kutu, bir metin alanının kutusu gibi, en az satır sayısından en çoğuna kadar yazıyla birlikte uzar. Oradan sonra kutunun boyu değişmez, yazı küçülür ve satırları da aynı oranda sıklaşır: böylece yazının tamamı kutuda kalır.

Alana verilen bir yükseklik satır sayısından önce gelir. Kutu, bu yükseklikten etiketin ve yardım metninin bıraktığını doldurur ve yazı buna sığdırılır: yükseklik alanın alabileceğinden az satır tutuyorsa yazı küçülür, daha çok satır tutuyorsa yazı o kadar satır boyunca boyutunu korur. Tek satır, kendisine alçak gelen bir kutuda küçülür.

Sığdırılan, gösterildiği hâliyle yazıdır: çıkış dönüşümünden sonraki hâli, klavyenin o an yazmakta olduğuyla birlikte. Değişen yazının boyutudur ve hiçbir şey yerleştirildiğinden küçük çizilmez: imleç, seçim ve tutamaçları yazının o anki boyutundadır, bir testin yazının yerleşiminden okuduğu boyut da odur. Yer tutucu, yazı nasıl yazılacaksa öyle yazılır: uzunsa daha küçük bir boyutta. Boyutu değişen bir kutunun yazısı bir kare sonra yeniden sığdırılır. Alan ilk gösterildiğinde kutusuna sığmayacak kadar uzun olan bir yazı da bir kare sonra, sığdırılmış olarak çizilir ve hiçbir zaman fazla büyük bir boyutta görünmez.

Etiketi, kutusu ve yardım metni `PantrixTextField`'ınkilerdir ve o bileşenin `style` ile `colors`'ını alır: metin alanlarını yeniden biçimleyen bir ürün bunu da onlarla birlikte biçimlemiş olur. Bir `TextFieldState` üstüne kuruludur. Bir `value` ile bir `onValueChange` alan bir overload'u, bir de formun alanı için bir overload'u vardır.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `rememberTextFieldState()` ile kurulur ve yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar. Bir yükseklik verilirse yazı, genişliğe sığdırıldığı gibi ona da sığdırılır.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir, yazının kendi stilinde.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kenarlık, etiket, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur ve ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(TextFieldStyle).iconSize)` platformun boyutundadır.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur: bir tutarın arkasındaki para birimi işareti gibi.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir. Düğme imleci alanda bırakır ve Tab durağı değildir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır. Sınırı aşacak bir değişiklik bütünüyle geri çevrilir. Kodla verilen metin kesilmez ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textStyle: TextStyle?`: Yazının en büyük hâlinin stili: temanın bir yazı rolü, bir tutar için `PantrixTheme.typography.headline` gibi. Boş bıraktıkları body stilinden gelir: bu stil verilmediğinde yazı da body ile yazılır. Stile göre kısa kalan kutu, o stilin bir satırını alacak kadar uzar.
- `minFontSize: TextUnit`: Yazının inebileceği en küçük boyut: sp olarak bir boyut, ya da stilin kendi boyutunun bir payı olan em olarak bir boyut. Verilmezse temanın footnote boyutudur. Bu boyutta da sığmayan yazı kayar. Bu boyut stilin kendi boyutunda ya da onun üstündeyse yazı hiç küçülmez.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`: ikincisinde yazı satırlara bölünür ve Enter yeni satır açar. Kutu, yazının en büyük boyutunda satırları ne kadar yer tutuyorsa o kadar boyludur: `minHeightInLines` satırdan `maxHeightInLines` satıra kadar uzar, en çok satır sayısı geçilince yazı küçülür. En çok satır sayısı verilmemişse kutu, uzayabildiği sürece yazısıyla birlikte uzar ve yazı yalnızca alana bir yükseklik verildiğinde küçülür. İkisinde de Tab odağı ilerletir.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, `keyboardOptions`'ın adlandırdığı eylem için çağrılır. Null verilirse platformun yaptığı kalır: `Next` odağı ilerletir, `Done` klavyeyi kapatır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem. `maxLength` ile birlikte önce bu çalışır ve sınır onun geçirdiğine uygulanır.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği: bir tutarın ayırıcıları gibi. Yazı gösterildiği hâliyle sığdırılır.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye: `ContentType.CreditCardNumber` ve benzerleri.
- `style: TextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alan, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze kalır, ekran okuyucuya okunmaz.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `AutoResizeTextField_<tagKey>`, temizleme düğmesi `AutoResizeTextFieldClear_<tagKey>` diye etiketlenir. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.

### PantrixAutoResizeTextField

`import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAutoResizeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Yazısı sığmak için küçülen ve metnini çağıranın bir `String` olarak tuttuğu metin alanı: alan `value`'yu gösterir ve kullanıcının her değişikliğini `onValueChange`'e sorar.

`TextFieldState` üstüne kurulu alan gibi görünür, ölçülür ve yazısını küçültür. Altında ise Foundation'ın bir değer ve bir geri çağrı alan metin alanı vardır. Geri çağrıya verilen metin bir sonraki kareye kadar `value` olarak geri dönmelidir, yoksa alan eski metni yeniden gösterir ve imleç sıçrar: metin, geri çağrının hemen yazdığı bir durumda tutulur, bir akışta yaşıyorsa da `TextFieldState` alan overload seçilir. Geri dönen metin sorulandan farklı olabilir. Bu overload böyle süzer: geri çağrının almadığı değişiklik gösterilmez.

Altındaki metin alanının sözcüklerini kullanır: satırları için `singleLine`, `minLines` ve `maxLines`.

Parametreler:

- `value: String`: Alanın gösterdiği metin.
- `onValueChange: (String) -> Unit`: Kullanıcının her değişikliğinde yeni metnin bütünüyle sorulur. Temizleme düğmesi de boş bir metinle sorar.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir, yazının kendi stilinde.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır.
- `error: Boolean`: Metnin yanlış olup olmadığı: kenarlık, etiket, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur. Yuva içine konanı boyutlandırmaz.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, boş bir metin isteyen bir düğme gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Sınırı aşacak bir değişiklik, `onValueChange`'e sorulmadan önce bütünüyle geri çevrilir. Sınırı aşan bir `value` olduğu gibi gösterilir ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textStyle: TextStyle?`: Yazının en büyük hâlinin stili. Boş bıraktıkları body stilinden gelir.
- `minFontSize: TextUnit`: Yazının inebileceği en küçük boyut, sp ya da em olarak: verilmezse temanın footnote boyutudur. Bu boyutta da sığmayan yazı kayar.
- `singleLine: Boolean`: Alanın tek satır tutup tutmadığı: tek satır kutunun enine sığdırılır. Aksi söylenmedikçe tek satır tutar. `value` içindeki bir satır sonu o zaman boşluk olarak gösterilir, `value` ise onu korur.
- `minLines: Int`: Birkaç satırlı bir alanda kutunun en az kaç satır boyunda olduğu: satırlar yazının en büyük boyutunda sayılır.
- `maxLines: Int`: Birkaç satırlı bir alanda kutunun, yazısı küçülmeden önce en çok kaç satıra kadar uzadığı.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `keyboardActions: KeyboardActions`: Klavyenin eylem tuşunun, `keyboardOptions`'ın adlandırdığı eylem için ne yaptığı.
- `visualTransformation: VisualTransformation`: Metnin, değiştirilmeden nasıl gösterileceği: bir tutarın ayırıcıları gibi. Yazı gösterildiği hâliyle sığdırılır.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye.
- `style: TextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alan, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `AutoResizeTextField_<tagKey>`, temizleme düğmesi `AutoResizeTextFieldClear_<tagKey>` diye etiketlenir.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Null verilirse alan kendi kaynağını tutar.

### PantrixAutoResizeTextField

`import com.pantrixui.components.inputs.autoresizetextfield.PantrixAutoResizeTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAutoResizeTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Yazısı sığmak için küçülen, bir formun alanına bağlı metin alanı: metni, hatası ve adı `field`'dan gelir.

Form alanının değeri ile ekrandaki metin iki yönde de birbirini izler: yazmak form alanını değiştirir, form alanında kodla yapılan bir değişiklik de, örneğin bir sıfırlama, ekrandaki metnin yerine geçer. Odak ayrılınca alan dokunulmuş olarak işaretlenir ve denetlenir: bir hata ilk kez o zaman görünür. Alan hatadayken mesajı `supportingText`'in yerine geçer. Alanın kimliği otomasyon anahtarıdır: `AutoResizeTextField_<id>`. Form bu alan hatadayken gönderilirse odağı buraya gönderebilir.

Parametreler:

- `field: FormField<String>`: Metin alanının gösterdiği ve değiştirdiği form alanı.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilirse klavyenin eylem tuşu formu, forma kayıtlı düğme üzerinden gönderir. `Next` ya da `Previous` eylemi odağı her zamanki gibi taşır. Eylem adlandırmayan tek satırlı bir alan `ImeAction.Done` alır, çünkü varsayılan eylem hiçbir işleyiciye ulaşmaz. Birkaç satırlı bir alan olduğu gibi bırakılır: orada Enter yeni satır açar. Çağıranın kendi `onKeyboardAction`'ı gönderimin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir, yazının kendi stilinde.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textStyle: TextStyle?`: Yazının en büyük hâlinin stili. Boş bıraktıkları body stilinden gelir.
- `minFontSize: TextUnit`: Yazının inebileceği en küçük boyut, sp ya da em olarak: verilmezse temanın footnote boyutudur.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`: ikincisinde yazı, en çok satır sayısı geçilince küçülür. İkisinde de Tab odağı ilerletir.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, formun gönderimi yerine çağrılır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği. Yazı gösterildiği hâliyle sığdırılır.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye.
- `style: TextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alan, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: `label` verilmeyen alan için ekran okuyucunun söylediği.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Null verilirse alan kendi kaynağını tutar.

### TextFieldStyle

`import com.pantrixui.components.inputs.textfield.TextFieldStyle`, `com.pantrixui:components` içinden

```kotlin
class TextFieldStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val focusedBorderWidth: Dp = Dp.Unspecified,
    public val textRole: TypeRole? = null
) : PantrixStyle<TextFieldStyle>
```

`PantrixTextField`'ın kutusu: şekli, en az yüksekliği ve genişliği, metninin çevresindeki boşluk, ikonları ve kenarlığı.

`height` yalnızca kutunun yüksekliğidir. Etiket kutunun içinde değil üstünde durur, bu yüzden tek bir yükseklik hem etiketli hem etiketsiz alana uyar. Bu, en az yüksekliktir: birkaç satırlı bir alan ya da büyük bir yazı ölçeği kutuyu uzatır ve metni asla kesmez. Her preset'in `verticalPadding`'i, her yoğunlukta, yüksekliğinden geriye en az body rolünün bir satırını bırakır. Böylece tek satırlı bir alan tam stilinin söylediği yüksekliktedir.

İkon, kutunun kenarına yaslı, `iconSize + 2 × iconPadding` boyutunda bir yuvada durur. Yuvanın yanındaki metin ondan `horizontalPadding − iconPadding` uzakta başlar. Android'de bu, 44dp'lik bir yuvadır: ikon kenardan 10dp, metin 48dp uzaktadır.

Kutunun köşeleri her platformda şekil ölçeğinin orta adımıdır.

Parametreler:

- `shape: ShapeSpec`: Kutunun şekli. Tam yuvarlak bir şekil, `ShapeRole.Full`, yalnızca alan tek satır tutarken bir haptır: birkaç satırlı bir alan onun yerine `ShapeRole.Large` alır, çünkü bir kapsülün eğrisi metninin ilk satırına girer.
- `height: Dp`: Kutunun en az yüksekliği.
- `minWidth: Dp`: Kutunun en az genişliği: boş bir alanın, kullanıcı içine yazdıkça genişlemesini önler.
- `horizontalPadding: Dp`: İkon olmayan yerde, kutunun kenarı ile metni arasındaki boşluk.
- `verticalPadding: Dp`: Metnin ilk satırının üstündeki ve son satırının altındaki boşluk.
- `iconPadding: Dp`: Yuvasındaki bir ikonun çevresindeki boşluk.
- `iconSize: Dp`: Yuvadaki bir ikonun alması gereken boyut. Yuva, içine konanı boyutlandırmaz.
- `borderWidth: Dp`: Kutunun kenarlığının kalınlığı.
- `focusedBorderWidth: Dp`: Alan odaktayken kenarlığın kalınlığı: odağı gösteren kenarlıktır.
- `textRole: TypeRole?`: Metnin yazıldığı, yer tutucunun da yazıldığı yazı ölçeği rolü: Android'de ve iOS'ta body, 16sp, Material 3'ün ve iOS'un bir alana yazdığı gibi; masaüstünde ve web'de label, 14sp, işaretçiyle kullanılan bir sayfadaki gibi. Bir select'in kutusu ve bu stille kurulan alanlar da onu alır.

### TextFieldColors

`import com.pantrixui.components.inputs.textfield.TextFieldColors`, `com.pantrixui:components` içinden

```kotlin
data class TextFieldColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val hoveredBorder: Color = Color.Unspecified,
    public val focusedBorder: Color = Color.Unspecified,
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

Temanın renklerini almayan bir alan için `PantrixTextField`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temadaki rolünde kalır. Bir ürün yalnızca değiştirdiği renkleri verir, başkasını vermez:

```kotlin
PantrixTextField(
    state = state,
    label = stringResource(Res.string.email),
    colors = TextFieldColors(focusedBorder = brand, cursor = brand)
)
```

Bunlar, salt okunur olsun olmasın, etkin bir alanın renkleridir. Devre dışı bir alan, burada ne verilirse verilsin temanın devre dışı rolleriyle çizilir: devre dışı bir alan ürünün her yerinde aynı görünsün diye.

Parametreler:

- `container: Color`: Kutunun dolgusu. Temanın `surface` rengi.
- `border: Color`: Dinlenirken kutunun kenarlığı. Temanın `border` rengi.
- `hoveredBorder: Color`: Fare üstündeyken kenarlık. Temanın `borderHover` rengi: `border`'dan bir basamak güçlüsü.
- `focusedBorder: Color`: Alan odaktayken kenarlık. Temanın `primary` rengi.
- `error: Color`: Metnin yanlış olduğunu söyleyenler: kenarlık, etiket, kutunun altındaki mesaj, imleç ve sınırını aştığında sayaç. Temanın `danger` rengi.
- `text: Color`: Yazılan metin. Temanın `textPrimary` rengi.
- `label: Color`: Kutunun üstündeki etiket. Verilmezse, alanın durduğu yerde herhangi bir metin nasıl çiziliyorsa öyle çizilir, çünkü etiket kutunun dışında, alan neyin üstüne konmuşsa onun üstündedir: temanın kendi zemininde `textPrimary` ile, bir dolgunun üstünde o dolgunun içerik rengiyle.
- `placeholder: Color`: Yer tutucu. Temanın `textSecondary` rengi.
- `supportingText: Color`: Kutunun altındaki yardım metni ve sayaç. Temanın `textSecondary` rengi.
- `icon: Color`: Yuvadaki bir ikonun, kendi rengini vermedikçe çizildiği renk ve temizleme düğmesinin çarpısı. Temanın `textSecondary` rengi.
- `cursor: Color`: İmleç ve onunla birlikte bir seçimin tutamaçları ile zemini. Temanın `primary` rengi.
- `scrollBar: Color`: Birkaç satırlı bir kutunun metninin ne kadar kaydığını gösteren çubuk. Temanın `borderStrong`'u: metnin yanında bir işarettir ve kutunun yumuşak kenarı orada görünmezdi.

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
