# Filled Secure Text Field

Etiketi kutusunun içinde duran güvenli metin alanı: bir şifre, bir PIN ya da bir kartın güvenlik kodu, dolgulu metin alanının kutusunda. Yazılan nokta nokta çizilir; kesilemez, kopyalanamaz ve alandan sürüklenip çıkarılamaz. Kutunun sonundaki göz düğmesi metni gösterir ve yeniden gizler.

Altındaki güvenli alan `PantrixSecureTextField`'ınkidir, kutusu `PantrixFilledTextField`'ınki. Dolgulu alanın `style` ve `colors`'ını alır: iki dolgulu alan birlikte biçimlenir, iki güvenli alan da birbirinin yerine geçebilir. Alan tek satırdır; `TextFieldState` üstüne kuruludur ve bir formun alanını alan bir biçimi daha vardır.

- `PantrixFilledSecureTextField` (`com.pantrixui.components.inputs.filledsecuretextfield`, `com.pantrixui:components`): Etiketi dolgulu bir kutunun içinde duran bir parola ya da PIN alanı: kesilemeyen, kopyalanamayan noktalarla çizilen tek bir satır; onu gösterip yeniden gizleyen bir düğme, yardım ve hata metni, ikonlar, karakter sayacı ve form bağlantısıyla. Anahtar sözcükler: parola, şifre, pin, dolgulu parola alanı, kayan etiket, şifreyi göster.

## Özellikler

- **Kutunun içindeki etiket.** `label` alan boşken ve odakta değilken yazının yerinde durur; odakta ya da bir metin varken yazının üstündeki satırına çıkar. `placeholder` etiket yerinden çıkmışken, alan boş ve odaktayken görünür.
- **Dolgu ve çerçeve.** Kutu dinlenirken dolgulu ve çerçevesizdir; odakta ve hatada çerçevelenir. Devre dışı alanın dolgusu yoktur.
- **Gizli metin.** Platforma alanın bir şifre tuttuğu söylenir ve metin gizliyken ona metnin yerine noktalar verilir: ekran okuyucu şifreyi okumaz, şifre yöneticisi ise alanı yine doldurur ve kaydeder.
- **Gösterme düğmesi.** Göz düğmesine fareyle basmak imleci yerinden oynatmaz. Klavyede alandan sonraki kendi Tab durağıdır; klavyenin "İleri" tuşu onu atlar. Metnin gösterildiği kaydedilmez. `showRevealButton = false` düğmeyi kaldırır.
- **Gizleme biçimi.** `textObfuscationMode` gizli metnin nasıl çizildiğini, `textObfuscationCharacter` noktanın yerine hangi karakterin çizildiğini söyler.
- **Klavye ve otomatik doldurma.** `keyboardOptions`'ın söylemedikleri bir şifreninkidir: şifre klavyesi, düzeltme yok. `contentType` verilmezse alan `ContentType.Password` tutar.
- **Metni almak.** Metin durumdan okunur: kullanılacağı anda `state.text`, yazıldıkça izlemek için `snapshotFlow`. `value` ve `onValueChange` alan bir biçimi yoktur.
- **Form.** `field` alan biçim değerini, hatasını ve adını formdaki alanından alır; `form` verilirse klavyenin eylem tuşu formu gönderir.
- **Dolgulu alandan gelenler.** `supportingText`, `error`, `leadingIcon`, `showClearButton` ve `maxLength` dolgulu metin alanındaki gibidir. `trailingIcon` temizleme ve gösterme düğmelerinden sonra durur.
- **Otomasyon.** `tagKey` ile alan `FilledSecureTextField_<tagKey>`, temizleme düğmesi `FilledSecureTextFieldClear_<tagKey>`, gösterme düğmesi `FilledSecureTextFieldReveal_<tagKey>` adını alır. Alan metnini asla bildirmez.

## Kullanım

### A password, read when it is used

```kotlin
val password = remember { TextFieldState() }
PantrixFilledSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = stringResource(Res.string.password),
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
    tagKey = "password"
)
PantrixButton(text = stringResource(Res.string.sign_in), onClick = { onSignIn(password.text.toString()) })
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val password = remember { TextFieldState(initial.password) }
LaunchedEffect(password) {
    snapshotFlow { password.text.toString() }.collectLatest { viewModel.updatePassword(it) }
}
PantrixFilledSecureTextField(
    state = password,
    label = stringResource(Res.string.password),
    tagKey = "password"
)
```

### Its text, to a caller that keeps it as a String

```kotlin
var password by remember { mutableStateOf("") }
val state = remember { TextFieldState(password) }
LaunchedEffect(state) {
    snapshotFlow { state.text.toString() }.collect { password = it }
}
PantrixFilledSecureTextField(
    state = state,
    label = stringResource(Res.string.password),
    tagKey = "password"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixFilledSecureTextField(
    field = form.field("password", initial = "", Rules.notBlank(stringResource(Res.string.password_required))),
    form = form,
    label = stringResource(Res.string.password)
)
```

### A PIN that is never shown

```kotlin
val pin = remember { TextFieldState() }
PantrixFilledSecureTextField(
    state = pin,
    label = stringResource(Res.string.pin),
    showRevealButton = false,
    maxLength = 6,
    textObfuscationMode = TextObfuscationMode.Hidden,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
    tagKey = "pin"
)
```

## Örnekler

### En yalın hâli

En az yazılan: bir `TextFieldState` ve bir etiket. Etiket kutunun içindedir: alan boşken yazının yerinde durur, alana basınca yazının üstündeki satırına çıkar. Yazılan nokta nokta çizilir; kesilemez ve kopyalanamaz.

Bir şey yazıp kutunun sonundaki göz düğmesine bas: metin görünür, bir daha basınca yeniden gizlenir. Fareyle basmak imleci alandan çıkarmaz; klavyede Tab alandan sonra düğmeye uğrar. Metnin gösterildiği kaydedilmez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Kasa şifresi",
    tagKey = "safe_password"
)
```

### Yardım metni ve hata

`supportingText` kutunun altında durur. `error = true` kutuyu `danger` rengiyle çerçeveler; yardım metni ve imleç de o renge döner ve mesaj ekran okuyucuya hata olarak bildirilir. Etiket kendi renginde kalır.

Alan hatada başlar: metninde bir boşluk var. Göz düğmesine basıp metni gör ve boşluğu sil: hata kalkar. Hatayı alan değil çağıran hesaplar; burada `password.text`'i okuyarak.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

val password = remember { TextFieldState("gizli sifre") }
val hasSpace = password.text.contains(' ')
PantrixFilledSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Uygulama kilidi",
    supportingText = if (hasSpace) "Şifrede boşluk olamaz" else "Boşluk içermeyen bir şifre",
    error = hasSpace,
    showClearButton = true,
    tagKey = "app_lock"
)
```

### İkon, temizleme düğmesi ve sayaç

`leadingIcon` etiketin ve metnin önünde durur. Yuva içine konanı boyutlandırmaz: buradaki ikona dolgulu alanın stilindeki boyutu örnek kendisi verir, `PantrixTheme.style(FilledTextFieldStyle).iconSize`. Kutunun sonundakiler hep aynı sıradadır: önce temizleme düğmesi, sonra metni gösteren düğme, verilmişse en sonda `trailingIcon`.

Temizleme düğmesi alan boş değilken görünür, imleci alanda bırakır ve Tab durağı değildir; göz düğmesi ise bir Tab durağıdır. `maxLength = 16` daha uzun bir şifreyi almaz ve sayacı kutunun altına yazar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Yönetici şifresi",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Person,
            contentDescription = null,
            size = PantrixTheme.style(FilledTextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    maxLength = 16,
    tagKey = "admin_password"
)
```

### Forma bağlı bir şifre değişikliği

İki alan da değerini, hatasını ve adını formdaki alanından alır. Mevcut şifrede klavyenin "İleri" tuşu odağı yeni şifreye taşır; yeni şifrede eylem tuşu formu "Şifreyi değiştir" düğmesi üzerinden gönderir. İki alanı boş bırakıp düğmeye bas: form gönderilmez, hatalı ilk alan odağı alır.

Yeni şifre platforma seçilmekte olan bir şifre olarak bildirilir (`ContentType.NewPassword`): bir şifre yöneticisi buraya kayıtlı olanı doldurmayı değil, yenisini önermeyi teklif eder. Mevcut şifrede `contentType` verilmedi: alan `ContentType.Password` tutar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixFilledSecureTextField(
    field = form.field("current_password", initial = "", Rules.notBlank("Mevcut şifrenizi yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Mevcut şifre",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
)
PantrixFilledSecureTextField(
    field = form.field("new_password", initial = "", Rules.minLength(8, "Yeni şifre en az 8 karakter olmalı")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Yeni şifre",
    supportingText = "En az 8 karakter",
    showClearButton = true,
    contentType = ContentType.NewPassword
)
PantrixButton(
    text = "Şifreyi değiştir",
    onClick = {
        scope.launch {
            form.submit { snackbars?.show(message = "Şifre değiştirildi", tagKey = "password_changed") }
        }
    },
    form = form,
    tagKey = "change_password"
)
```

### Kullanılacağı anda okunan güvenlik kodu

Kartın arkasındaki üç rakamlı güvenlik kodu: klavyesi rakam klavyesidir, rakam olmayanı bir giriş dönüşümü geri çevirir ve sayacı gösterilmez. Göz düğmesi durur: kullanıcı yazdığı kodu karttakiyle karşılaştırabilsin diye.

Metin kullanılacağı anda durumdan okunur: düğmeye basılınca `code.text`. Arada bir yere taşınmaz, alanın durumu tek kaynağıdır. Bildirim kodun kendisini değil, kaç rakam alındığını söyler.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val code = remember { TextFieldState() }
PantrixFilledSecureTextField(
    state = code,
    modifier = Modifier.fillMaxWidth(),
    label = "Güvenlik kodu",
    placeholder = "000",
    supportingText = "Kartın arkasındaki üç rakam",
    maxLength = 3,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
    inputTransformation = DigitsOnly,
    contentType = ContentType.CreditCardSecurityCode,
    tagKey = "card_code"
)
PantrixButton(
    text = "Kartı doğrula",
    onClick = {
        val entered = code.text.toString()
        val message = when (entered.length) {
            3 -> "Kod alındı: ${entered.length} rakam"
            else -> "Kod 3 rakam olmalı, ${entered.length} rakam yazıldı"
        }
        scope.launch { snackbars?.show(message = message, tagKey = "card_code_read") }
    },
    tagKey = "verify_card"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Yazıldıkça izlenen metin

Metni yazıldıkça isteyen bir çağıran onu durumdan izler: `snapshotFlow { state.text.toString() }` her değişikliği verir, burada çağıranın tuttuğu bir `String`'e. Yardım metni o `String`'ten üretilir ve şifrede neyin eksik olduğunu söyler.

Akış tek yönlüdür: metin alandan çağırana akar. Bir ViewModel'e taşımak da aynı biçimde yazılır: her değişiklik `collect` içinde ViewModel'e bildirilir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

var password by remember { mutableStateOf("") }
val state = remember { TextFieldState(password) }
LaunchedEffect(state) {
    snapshotFlow { state.text.toString() }.collect { password = it }
}
PantrixFilledSecureTextField(
    state = state,
    modifier = Modifier.fillMaxWidth(),
    label = "Yeni hesap şifresi",
    supportingText = when {
        password.isEmpty() -> "En az 10 karakter, içinde bir rakam"
        password.length < 10 -> "${10 - password.length} karakter daha"
        password.none(Char::isDigit) -> "Bir rakam ekleyin"
        else -> "Şifre yeterli"
    },
    contentType = ContentType.NewPassword,
    tagKey = "followed_password"
)
```

### Hiç gösterilmeyen bir PIN

`showRevealButton = false` göz düğmesini kaldırır: metin `textObfuscationMode`'un çizdiği gibi kalır. `TextObfuscationMode.Hidden` ile son yazılan rakam hiçbir platformda görünmez; varsayılan `System`, Android'de sistemin kendi ayarı öyle diyorsa son yazılan karakteri bir an gösterirdi. `textObfuscationCharacter` noktanın yerine yıldız çizer.

Klavyesi bir PIN'inkidir: `KeyboardType.NumberPassword`. `maxLength = 4` beşinci rakamı almaz ve sayacı kutunun altına yazar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.TextObfuscationMode
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Kart şifresi",
    supportingText = "Dört rakam",
    showRevealButton = false,
    maxLength = 4,
    textObfuscationMode = TextObfuscationMode.Hidden,
    textObfuscationCharacter = '*',
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
    inputTransformation = DigitsOnly,
    tagKey = "card_pin"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Devre dışı ve salt okunur

`enabled = false` alanın dolgusunu kaldırır: alan temanın devre dışı yazı rengiyle çizilir, odak almaz ve metnini gösteren düğmesi yoktur.

`readOnly = true` alanın dolgusu yerindedir: alan odaklanır ve metni göz düğmesiyle gösterilebilir, ama değiştirilemez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField

PantrixFilledSecureTextField(
    state = remember { TextFieldState("degismez") },
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Uygulama şifresi",
    supportingText = "Kuruluşunuz belirler",
    tagKey = "managed_password"
)
PantrixFilledSecureTextField(
    state = remember { TextFieldState("PX-7730-1184") },
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Yedek kod",
    supportingText = "Göz düğmesiyle gösterilir, değiştirilemez",
    tagKey = "backup_code"
)
```

### Kendi renkleri ve stili

Dolgulu güvenli alan, dolgulu metin alanının `FilledTextFieldColors`'ını ve `FilledTextFieldStyle`'ını alır: iki dolgulu alan birlikte biçimlenir.

İlk alanın dolgusu, etiketi, yazısı, ikonu, çerçevesi ve imleci uygulamanın kendi morundandır; göz düğmesi ikon rengiyle çizilir. Verilmeyenler, odaktaki dolgu gibi, temadaki rolünde kalır. İkincinin kutusu tam yuvarlaktır: `FilledTextFieldStyle(shape = ShapeRole.Full)`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Üyelik şifresi",
    colors = FilledTextFieldColors(
        container = own.container,
        focusedOutline = own.color,
        text = own.onContainer,
        label = own.onContainer,
        icon = own.onContainer,
        cursor = own.color
    ),
    tagKey = "own_colors"
)
PantrixFilledSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Arşiv şifresi",
    style = FilledTextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixFilledSecureTextField

`import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledSecureTextField(
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
    showRevealButton: Boolean = true,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    textObfuscationMode: TextObfuscationMode = TextObfuscationMode.System,
    textObfuscationCharacter: Char = '•',
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Etiketi kutusunun içinde duran güvenli metin alanı: bir şifre, bir PIN ya da bir kartın güvenlik kodu, `PantrixFilledTextField`'ın dolgulu kutusunda.

Yazılan nokta nokta çizilir. Kesilemez, kopyalanamaz ve alandan sürüklenip çıkarılamaz. Platforma alanın bir şifre tuttuğu söylenir ve metin gizliyken ona metnin yerine noktalar verilir: ekran okuyucu şifreyi okumaz, şifre yöneticisi ise alanı yine doldurur ve kaydeder. Alan tek satırdır.

Kutunun sonundaki bir düğme metni gösterir ve yeniden gizler. Klavyeyle kullanılırken bu düğme, alandan sonra gelen ayrı bir Tab durağıdır. Klavyenin `Next` tuşu ise onu atlayıp sonraki alana geçer. Düğmeye fareyle basmak imleci yerinden oynatmaz. Metnin gösterildiği kaydedilmez: alan yeniden kurulduğunda, ekran dönünce olduğu gibi, metin yine gizlidir.

Etiket yazının geleceği yerde durur, alan odağı aldığında ya da bir metin tuttuğunda yazının üstündeki kendi satırına çıkar. Kutu dinlenirken dolguludur ve çerçevesi yoktur, odakta ve hatada çerçevelenir. Bu bileşen o dolgulu kutudur: çevrelediği güvenli metin alanı, `PantrixSecureTextField`'ın altındaki alandır. Dolgulu metin alanının `style` ile `colors`'ını alır: iki dolgulu alan birlikte biçimlenir, iki güvenli alan da birbirinin yerine geçebilir. Bir `TextFieldState` üstüne kuruludur ve bir formun alanı için bir overload'u vardır. Metin durumdan okunur: kullanılacağı yerde ya da değiştikçe.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `remember { TextFieldState() }` ile kurulur ya da bir view model'de tutulur: `rememberTextFieldState()` yazılanı kaydedilen duruma koyar; platform onu uygulamanın süreci gittikten sonra da tutar ve diskine yazabilir. Hatırlanan bir durum, ekran yeniden kurulunca, örneğin ekran döndükten sonra gider ve alan yeniden boş olur. Yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, dolgusuz ve devre dışı renklerle çizilir, metnini gösteren düğmesi yoktur ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanabilir ve metni düğmeyle gösterilebilir.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır. Etiket yoksa metin kutunun ortasında durur ve `placeholder` alan boş olduğu sürece görünür.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde gösterilir: alan odaktayken, etiketi yoksa her zaman.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kutu danger rolünün rengiyle çerçevelenir, yardım metni ve imleç de o renge döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur, ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` platformun boyutundadır.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin arkasında durur: temizleme düğmesinin ve metni gösteren düğmenin de arkasında.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir. Düğme imleci alanda bırakır ve Tab durağı değildir.
- `showRevealButton: Boolean`: Alan etkinken, metni gösterip yeniden gizleyen düğmeyi gösterir. Düğme olmadan metin `textObfuscationMode`'un çizdiği gibi kalır: bu, hiç gösterilmeyecek bir metin ve metni başka bir yolla gösteren bir çağıran içindir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır. Sınırı aşacak bir değişiklik bütünüyle geri çevrilir. Kodla verilen metin kesilmez ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textObfuscationMode: TextObfuscationMode`: Metnin gizliyken nasıl çizildiği. `TextObfuscationMode.System` platformun yaptığını yapar: Android'de, sistemin kendi ayarı öyle diyorsa, son yazılan karakter bir an görünür, başka hiçbir yerde bir şey görünmez. `Hidden` hiçbir platformda bir şey göstermez, `RevealLastTyped` ise son yazılan karakteri her platformda bir an gösterir.
- `textObfuscationCharacter: Char`: Gizli bir karakterin yerine çizilen karakter.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu. Bunların söylemedikleri bir şifreninkidir: şifre klavyesi, düzeltme yok. Böylece bir eylem adlandırmak, yazılanı öğrenen bir klavyeyi geri getirmez. `KeyboardType.NumberPassword` bir PIN'inkidir.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, `keyboardOptions`'ın adlandırdığı eylem için çağrılır. Null verilirse platformun yaptığı kalır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem. `maxLength` ile birlikte önce bu çalışır ve sınır onun geçirdiğine uygulanır.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye. Verilmezse alan `ContentType.Password` tutar, Foundation'ın güvenli alanının kendisi için söylediği gibi. `ContentType.NewPassword` ise seçilmekte olan bir şifredir.
- `style: FilledTextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: FilledTextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alanın, ne verilirse verilsin dolgusu yoktur ve alan temanın devre dışı yazı rengiyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze kalır, ekran okuyucuya okunmaz.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `FilledSecureTextField_<tagKey>`, temizleme düğmesi `FilledSecureTextFieldClear_<tagKey>`, metnini gösteren düğme `FilledSecureTextFieldReveal_<tagKey>` diye etiketlenir. Alan odağı aldığını, temizlendiğini ve metninin gösterildiğini ya da gizlendiğini bildirir, metnini asla.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.

### PantrixFilledSecureTextField

`import com.pantrixui.components.inputs.filledsecuretextfield.PantrixFilledSecureTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFilledSecureTextField(
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
    showRevealButton: Boolean = true,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    textObfuscationMode: TextObfuscationMode = TextObfuscationMode.System,
    textObfuscationCharacter: Char = '•',
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    contentType: ContentType? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı dolgulu güvenli metin alanı: metni, hatası ve adı `field`'dan gelir.

Form alanının değeri ile ekrandaki metin iki yönde de birbirini izler: yazmak form alanını değiştirir, form alanında kodla yapılan bir değişiklik de, örneğin bir sıfırlama, ekrandaki metni değiştirir. Odak metin alanından ve düğmelerinden çıkınca form alanı dokunulmuş sayılır ve denetlenir: bir hata ilk kez o zaman görünür. Alan hatadayken hatanın mesajı `supportingText`'in yerine geçer. Alanın kimliği otomasyon anahtarıdır: `FilledSecureTextField_<id>`. Form, bu alan hatadayken gönderilirse odağı buraya yollayabilir.

Parametreler:

- `field: FormField<String>`: Metin alanının gösterdiği ve değiştirdiği form alanı.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilirse klavyenin eylem tuşu formu, forma kayıtlı düğme üzerinden gönderir. `Next` ya da `Previous` eylemi odağı her zamanki gibi taşır. Eylem adlandırmayan bir alan `ImeAction.Done` alır, çünkü varsayılan eylem hiçbir işleyiciye ulaşmaz. Çağıranın kendi `onKeyboardAction`'ı gönderimin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu. Kutunun içinde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Alan boşken ve etiketi yerinden çıkmışken yazının geleceği yerde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `leadingIcon: (@Composable () -> Unit)?`: Etiketin ve metnin önünde durur.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin arkasında durur: temizleme düğmesinin ve metni gösteren düğmenin de arkasında.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir.
- `showRevealButton: Boolean`: Alan etkinken, metni gösterip yeniden gizleyen düğmeyi gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textObfuscationMode: TextObfuscationMode`: Metnin gizliyken nasıl çizildiği.
- `textObfuscationCharacter: Char`: Gizli bir karakterin yerine çizilen karakter.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu. Bunların söylemedikleri bir şifreninkidir.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, formun gönderimi yerine çağrılır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye. Verilmezse `ContentType.Password` olur.
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
