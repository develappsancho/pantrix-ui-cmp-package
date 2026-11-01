# Secure Text Field

Omuz üstünden okunmaması gereken metin için alan: bir şifre, bir PIN, bir kartın güvenlik kodu. Yazılan nokta nokta çizilir; kesilemez, kopyalanamaz ve alandan sürüklenip çıkarılamaz. Kutunun sonundaki göz düğmesi metni gösterir ve yeniden gizler.

Etiketi, kutusu ve yardım metni `PantrixTextField`'ınkilerdir ve onun `style` ile `colors`'ını alır: metin alanlarını yeniden biçimleyen bir ürün şifre alanlarını da biçimlemiş olur. Alan tek satırdır. `TextFieldState` üstüne kuruludur ve bir formun alanını alan bir biçimi daha vardır; `value` ve `onValueChange` alan bir biçimi yoktur.

- `PantrixSecureTextField` (`com.pantrixui.components.inputs.securetextfield`, `com.pantrixui:components`): Bir parola ya da PIN için yazı alanı: kesilemeyen, kopyalanamayan noktalarla çizilen tek bir satır; onu gösterip yeniden gizleyen bir düğme, etiket, yardım ve hata metni, ikonlar, karakter sayacı ve form bağlantısıyla. Anahtar sözcükler: parola, şifre, pin, gizli alan, parola alanı, şifreyi göster.

## Özellikler

- **Gizli metin.** Platforma alanın bir şifre tuttuğu söylenir ve metin gizliyken ona metnin yerine noktalar verilir: ekran okuyucu şifreyi okumaz, şifre yöneticisi ise alanı yine doldurur ve kaydeder.
- **Gösterme düğmesi.** Kutunun sonundaki göz metni gösterir ve yeniden gizler. Fareyle basmak imleci yerinden oynatmaz. Klavyede alandan sonraki kendi Tab durağıdır; klavyenin "İleri" tuşu ise onu atlayıp sonraki alana geçer. `showRevealButton = false` düğmeyi kaldırır.
- **Gösterilen metin kaydedilmez.** Alan yeniden kurulduğunda, ekran dönünce olduğu gibi, metin yine gizlidir.
- **Gizleme biçimi.** `textObfuscationMode` gizli metnin nasıl çizildiğini söyler: platformun yaptığı gibi, son yazılan karakter bir an görünerek, ya da hiçbir şey görünmeden. `textObfuscationCharacter` noktanın yerine çizilen karakterdir.
- **Klavye.** `keyboardOptions`'ın söylemedikleri bir şifreninkidir: şifre klavyesi, düzeltme yok. Yalnızca bir eylem tuşu adlandırmak, yazılanı öğrenen klavyeyi geri getirmez. `KeyboardType.NumberPassword` bir PIN'inkidir.
- **Otomatik doldurma.** `contentType` verilmezse alan `ContentType.Password` tutar; `ContentType.NewPassword` seçilmekte olan bir şifredir.
- **Metni almak.** Metin durumdan okunur: kullanılacağı anda `state.text`, yazıldıkça izlemek için `snapshotFlow`. Metni `String` olarak tutan bir çağırana her değişiklik o yolla verilir.
- **Form.** `field` alan biçim değerini, hatasını ve adını formdaki alanından alır. Odak alandan ve düğmelerinden çıkınca alan denetlenir; `form` verilirse klavyenin eylem tuşu formu gönderir.
- **Metin alanından gelenler.** `label`, `placeholder`, `supportingText`, `error`, `leadingIcon`, `showClearButton` ve `maxLength` metin alanındaki gibidir. `trailingIcon` temizleme ve gösterme düğmelerinden sonra durur.
- **Otomasyon.** `tagKey` ile alan `SecureTextField_<tagKey>`, temizleme düğmesi `SecureTextFieldClear_<tagKey>`, gösterme düğmesi `SecureTextFieldReveal_<tagKey>` adını alır. Alan odağı aldığını, temizlendiğini ve metninin gösterilip gizlendiğini bildirir; metnini asla.

## Kullanım

### A password, read when it is used

```kotlin
val password = remember { TextFieldState() }
PantrixSecureTextField(
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
PantrixSecureTextField(
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
PantrixSecureTextField(
    state = state,
    label = stringResource(Res.string.password),
    tagKey = "password"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
PantrixSecureTextField(
    field = form.field("password", initial = "", Rules.notBlank(stringResource(Res.string.password_required))),
    form = form,
    label = stringResource(Res.string.password)
)
```

### A PIN that is never shown

```kotlin
val pin = remember { TextFieldState() }
PantrixSecureTextField(
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

En az yazılan: bir `TextFieldState` ve bir etiket. Yazılan nokta nokta çizilir; kesilemez ve kopyalanamaz. Metin durumdadır: alttaki satır `password.text`'in yalnızca uzunluğunu okur.

Kutunun sonundaki göz düğmesi metni gösterir ve yeniden gizler. Fareyle basmak imleci alandan çıkarmaz. Klavyede Tab alandan sonra düğmeye uğrar; klavyenin "İleri" tuşu ise düğmeyi atlar. Metnin gösterildiği kaydedilmez: alan yeniden kurulduğunda yine gizlidir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.foundation.theme.PantrixTheme

val password = remember { TextFieldState() }
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Wi-Fi şifresi",
    tagKey = "wifi_password"
)
PantrixText(text = "${password.text.length} karakter yazıldı", color = PantrixTheme.colors.textSecondary)
```

### Gizleme biçimi ve karakteri

`textObfuscationMode` metnin gizliyken nasıl çizildiğini söyler. Varsayılan `System` platformun yaptığını yapar: Android'de, sistemin kendi ayarı öyle diyorsa, son yazılan karakter bir an görünür; başka hiçbir yerde bir şey görünmez. `RevealLastTyped` son yazılan karakteri her platformda bir an gösterir, `Hidden` hiçbirinde göstermez. İlk iki alana bir şeyler yaz ve farkı gör.

`textObfuscationCharacter` gizli bir karakterin yerine çizilendir: üçüncü alanda nokta yerine yıldız.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.TextObfuscationMode
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Son yazılan görünür",
    textObfuscationMode = TextObfuscationMode.RevealLastTyped,
    tagKey = "reveal_last"
)
PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Hiçbir şey görünmez",
    textObfuscationMode = TextObfuscationMode.Hidden,
    tagKey = "hidden"
)
PantrixSecureTextField(
    state = remember { TextFieldState("yildiz") },
    modifier = Modifier.fillMaxWidth(),
    label = "Nokta yerine yıldız",
    textObfuscationCharacter = '*',
    tagKey = "stars"
)
```

### Yardım metni ve hata

`supportingText` kutunun altında durur. `error = true` kenarlığı, etiketi, yardım metnini ve imleci `danger` rolüne çevirir ve mesaj ekran okuyucuya hata olarak bildirilir. İki alana farklı şeyler yaz: ikincisi hataya geçer ve neyin yanlış olduğunu söyler.

İki alanın metni de kendi durumundadır; karşılaştırma ikisini oradan okur. İlk alanda yalnızca eylem tuşu verildi: klavyenin "İleri" tuşu göz düğmesinde durmaz, ikinci alana geçer. Klavyenin geri kalanı verilmediği için bir şifreninkidir: şifre klavyesi, düzeltme yok.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

val password = remember { TextFieldState() }
val repeated = remember { TextFieldState() }
val differs = repeated.text.isNotEmpty() && repeated.text.toString() != password.text.toString()
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Hesap şifresi",
    supportingText = "Harf ve rakam içersin",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
    contentType = ContentType.NewPassword,
    tagKey = "chosen_password"
)
PantrixSecureTextField(
    state = repeated,
    modifier = Modifier.fillMaxWidth(),
    label = "Hesap şifresi (tekrar)",
    supportingText = if (differs) "İki şifre aynı değil" else "Aynı şifreyi bir kez daha yazın",
    error = differs,
    contentType = ContentType.NewPassword,
    tagKey = "repeated_password"
)
```

### Temizleme düğmesi, sayaç ve ikon

Kutunun sonunda üç şey yan yana durabilir, hep aynı sırada: temizleme düğmesi, metni gösteren düğme ve `trailingIcon`. Buradaki ikon şifrenin yeterince uzun olup olmadığını söyler; süs olmadığı için bir `contentDescription`'ı vardır.

`showClearButton` alan boş değilken görünür ve imleci alanda bırakır. `maxLength = 32` daha uzun bir şifreyi almaz; sayaç kutunun altında, yardım metninin karşısında yazar. `placeholder` yalnızca alan boşken görünür.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val password = remember { TextFieldState() }
val longEnough = password.text.length >= 12
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Ana şifre",
    placeholder = "Bir cümle de olabilir",
    supportingText = "En az 12 karakter",
    trailingIcon = {
        PantrixIcon(
            imageVector = if (longEnough) PantrixIcons.Success else PantrixIcons.Warning,
            contentDescription = if (longEnough) "Yeterince uzun" else "Henüz kısa",
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    maxLength = 32,
    tagKey = "master_password"
)
```

### Forma bağlı bir giriş

`field` alan `PantrixSecureTextField` değerini, hatasını ve adını formdaki alanından alır: şifre kısa bırakılıp çıkılırsa kuralın mesajı yardım metninin yerine geçer. Odak göz düğmesine geçince alandan çıkılmış sayılmaz, hata o zaman görünmez. Forma bağlı bir alanın metni formdaki alanın değeridir: ayrıca alınması gerekmez.

`form` verilen alanda klavyenin eylem tuşu formu "Giriş yap" düğmesi üzerinden gönderir; e-posta alanında "İleri" tuşu odağı şifreye taşır. E-posta bir `PantrixTextField`'dır: iki bileşen aynı etiketi ve aynı kutuyu çizer.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixTextField(
    field = form.field("login_email", initial = "", Rules.matches(EMAIL, "Geçerli bir e-posta adresi yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "E-posta",
    placeholder = "ad@ornek.com",
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
    contentType = ContentType.EmailAddress
)
PantrixSecureTextField(
    field = form.field("login_password", initial = "", Rules.minLength(8, "Şifre en az 8 karakter olmalı")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Şifre",
    supportingText = "En az 8 karakter",
    showClearButton = true
)
PantrixButton(
    text = "Giriş yap",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Giriş yapıldı", tagKey = "signed_in") } }
    },
    form = form,
    tagKey = "sign_in"
)

private val EMAIL = Regex("""\S+@\S+\.\S+""")
```

### Metnini bir ViewModel'e taşıyan form

Kullanıcı adının durumunu `rememberTextFieldState` ile, şifreninkini `remember { TextFieldState(…) }` ile, ViewModel'in o an tuttuğu değerden kurar: şifre kaydedilen duruma girmez. Durumdaki metni `snapshotFlow` ile izler ve her değişikliği ViewModel'e bildirir. Metin alanın durumundan böyle alınır: düz metin alanında da, güvenli alanda da aynı yolla.

ViewModel'deki ilk değer bir kez okunur. Sonrası tek yönlüdür: metin alandan ViewModel'e akar, ViewModel'de yapılan bir değişiklik alana dönmez. Ekran yeniden kurulduğunda ViewModel yerinde kalır ve alanlar onun değeriyle başlar.

Alttaki satır ViewModel'in tuttuğunu gösterir: kullanıcı adını, ve şifrenin kendisini değil uzunluğunu. Düğme de ondan okur: kullanıcı adı ve yeterince uzun bir şifre gelmeden basılamaz.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

val viewModel = viewModel(key = "account") { AccountViewModel() }
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val initialUiState = remember(viewModel) { viewModel.uiState.value }
val uiState by viewModel.uiState.collectAsStateWithLifecycle()

val username = rememberTextFieldState(initialUiState.username)
LaunchedEffect(username) {
    snapshotFlow { username.text.toString() }.collectLatest { viewModel.updateUsername(it) }
}
PantrixTextField(
    state = username,
    modifier = Modifier.fillMaxWidth(),
    label = "Kullanıcı adı",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
    contentType = ContentType.NewUsername,
    tagKey = "account_username"
)

val password = remember { TextFieldState(initialUiState.password) }
LaunchedEffect(password) {
    snapshotFlow { password.text.toString() }.collectLatest { viewModel.updatePassword(it) }
}
PantrixSecureTextField(
    state = password,
    modifier = Modifier.fillMaxWidth(),
    label = "Yeni şifre",
    supportingText = "En az 8 karakter",
    contentType = ContentType.NewPassword,
    tagKey = "account_password"
)

PantrixText(
    text = "ViewModel: kullanıcı adı \"${uiState.username}\", şifre ${uiState.password.length} karakter",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "account_state"
)
PantrixButton(
    text = "Hesap oluştur",
    onClick = {
        scope.launch {
            snackbars?.show(message = "${uiState.username} için hesap oluşturuldu", tagKey = "account_created")
        }
    },
    enabled = uiState.isComplete,
    tagKey = "create_account"
)

private class AccountViewModel : ViewModel() {
    private val state = MutableStateFlow(AccountUiState())
    val uiState: StateFlow<AccountUiState> = state.asStateFlow()

    fun updateUsername(username: String) {
        state.update { it.copy(username = username) }
    }

    fun updatePassword(password: String) {
        state.update { it.copy(password = password) }
    }
}

private data class AccountUiState(
    val username: String = "",
    val password: String = ""
) {
    val isComplete: Boolean get() = username.isNotBlank() && password.length >= 8
}
```

### Metnini String olarak veren PIN

Güvenli alanın `value` ve `onValueChange` alan bir biçimi yoktur; metnini `String` olarak tutan bir çağıran için durumun üstüne kurulur. `PinInput` alanı `value` ile başlatır, durumdaki metni `snapshotFlow` ile izler ve her değişikliği `onValueChange` ile bildirir. Akış tek yönlüdür: `value` ilk değerdir, sonradan dışarıdan değişirse alana yansımaz. Yardım metni çağıranın tuttuğu `String`'ten üretilir ve kaç rakamın eksik olduğunu söyler.

Bu bir PIN'dir: `showRevealButton = false` ile metnini gösteren düğmesi yoktur, `TextObfuscationMode.Hidden` ile son yazılan rakam da gösterilmez. Klavyesi rakam klavyesidir (`KeyboardType.NumberPassword`); rakam olmayanı bir giriş dönüşümü geri çevirir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.TextObfuscationMode
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

var pin by remember { mutableStateOf("") }
PinInput(
    value = pin,
    onValueChange = { pin = it },
    label = "PIN",
    supportingText = if (pin.length == 6) "PIN tamam" else "${6 - pin.length} rakam daha",
    modifier = Modifier.fillMaxWidth()
)

@Composable
private fun PinInput(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    supportingText: String,
    modifier: Modifier = Modifier
) {
    val state = remember { TextFieldState(value) }
    val latestOnValueChange by rememberUpdatedState(onValueChange)
    LaunchedEffect(state) {
        snapshotFlow { state.text.toString() }.collect { latestOnValueChange(it) }
    }
    PantrixSecureTextField(
        state = state,
        modifier = modifier,
        label = label,
        supportingText = supportingText,
        showRevealButton = false,
        maxLength = 6,
        textObfuscationMode = TextObfuscationMode.Hidden,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
        inputTransformation = DigitsOnly,
        tagKey = "pin"
    )
}

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Devre dışı ve salt okunur

`enabled = false` alan odak almaz, temanın devre dışı renkleriyle çizilir ve metnini gösteren düğmesi yoktur.

`readOnly = true` alan odaklanır ve metni düğmeyle gösterilebilir, ama değiştirilemez: bir kez verilen bir kurtarma kodu gibi.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField

PantrixSecureTextField(
    state = remember { TextFieldState("degismez") },
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Devre dışı",
    supportingText = "Metnini gösteren düğmesi yoktur",
    tagKey = "locked_password"
)
PantrixSecureTextField(
    state = remember { TextFieldState("PX-4821-9930") },
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Kurtarma kodu",
    supportingText = "Salt okunur: gösterilebilir, değiştirilemez",
    tagKey = "recovery_code"
)
```

### Kendi renkleri ve stili

Güvenli alanın kendi stil ve renk sınıfı yoktur: `PantrixTextField`'ın `TextFieldColors`'ını ve `TextFieldStyle`'ını alır. Temada metin alanlarını yeniden biçimleyen bir ürün şifre alanlarını da biçimlemiş olur.

İlk alanda odaktaki kenarlık, imleç ve ikon rengi uygulamanın kendi morudur: göz düğmesi de ikon rengiyle çizilir. Verilmeyen renkler temadaki rolünde kalır. İkincinin kutusu tam yuvarlaktır: `TextFieldStyle(shape = ShapeRole.Full)`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Cüzdan şifresi",
    colors = TextFieldColors(focusedBorder = own.color, icon = own.color, cursor = own.color),
    tagKey = "own_colors"
)
PantrixSecureTextField(
    state = remember { TextFieldState() },
    modifier = Modifier.fillMaxWidth(),
    label = "Kasa şifresi",
    style = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixSecureTextField

`import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSecureTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Omuz üstünden okunmaması gerekenler için metin alanı: bir şifre, bir PIN, bir kartın güvenlik kodu.

Yazılan nokta nokta çizilir. Kesilemez, kopyalanamaz ve alandan sürüklenip çıkarılamaz. Platforma alanın bir şifre tuttuğu söylenir ve metin gizliyken ona metnin yerine noktalar verilir: ekran okuyucu şifreyi okumaz, şifre yöneticisi ise alanı yine doldurur ve kaydeder. Alan tek satırdır.

Kutunun sonundaki bir düğme metni gösterir ve yeniden gizler. Klavyeyle kullanılırken bu düğme, alandan sonra gelen ayrı bir Tab durağıdır. Klavyenin `Next` tuşu ise onu atlayıp sonraki alana geçer. Düğmeye fareyle basmak imleci yerinden oynatmaz. Metnin gösterildiği kaydedilmez: alan yeniden kurulduğunda, ekran dönünce olduğu gibi, metin yine gizlidir.

Foundation'ın güvenli metin alanının çevresinde `PantrixTextField`'ın etiketi, kutusu ve yardım metni durur. O bileşenin `style` ile `colors`'ını alır: metin alanlarını yeniden biçimleyen bir ürün şifre alanlarını da onlarla birlikte biçimlemiş olur. Bir `TextFieldState` üstüne kuruludur ve bir formun alanı için bir overload'u vardır. Foundation'ın güvenli alanının bir değer ve bir geri çağrı alan bir overload'u yoktur: metin durumdan okunur, kullanılacağı yerde ya da değiştikçe. Metni `String` olarak tutan bir çağırana da her değişiklik bu yolla verilir.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `remember { TextFieldState() }` ile kurulur ya da bir view model'de tutulur: `rememberTextFieldState()` yazılanı kaydedilen duruma koyar; platform onu uygulamanın süreci gittikten sonra da tutar ve diskine yazabilir. Hatırlanan bir durum, ekran yeniden kurulunca, örneğin ekran döndükten sonra gider ve alan yeniden boş olur. Yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir, metnini gösteren düğmesi yoktur ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanabilir ve metni düğmeyle gösterilebilir.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir. Etiket değildir: kullanıcı yazmaya başlar başlamaz kaybolur.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kenarlık, etiket, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur ve ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(TextFieldStyle).iconSize)` platformun boyutundadır.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin arkasında durur: temizleme düğmesinin ve metni gösteren düğmenin de arkasında.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir. Düğme imleci alanda bırakır ve Tab durağı değildir.
- `showRevealButton: Boolean`: Alan etkinken, metni gösterip yeniden gizleyen düğmeyi gösterir. Düğme olmadan metin `textObfuscationMode`'un çizdiği gibi kalır: bu, hiç gösterilmeyecek bir metin ve metni başka bir yolla gösteren bir çağıran içindir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır. Sınırı aşacak bir değişiklik bütünüyle geri çevrilir. Kodla verilen metin kesilmez ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `textObfuscationMode: TextObfuscationMode`: Metnin gizliyken nasıl çizildiği. `TextObfuscationMode.System` platformun yaptığını yapar: Android'de, sistemin kendi ayarı öyle diyorsa, son yazılan karakter bir an görünür, başka hiçbir yerde bir şey görünmez. `Hidden` hiçbir platformda bir şey göstermez, `RevealLastTyped` ise son yazılan karakteri her platformda bir an gösterir.
- `textObfuscationCharacter: Char`: Gizli bir karakterin yerine çizilen karakter.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu. Bunların söylemedikleri bir şifreninkidir: şifre klavyesi, düzeltme yok. Böylece bir eylem adlandırmak, yazılanı öğrenen bir klavyeyi geri getirmez. `KeyboardType.NumberPassword` bir PIN'inkidir.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, `keyboardOptions`'ın adlandırdığı eylem için çağrılır. Null verilirse platformun yaptığı kalır: `Next` odağı ilerletir, `Done` klavyeyi kapatır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem. `maxLength` ile birlikte önce bu çalışır ve sınır onun geçirdiğine uygulanır.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye. Verilmezse alan `ContentType.Password` tutar, Foundation'ın güvenli alanının kendisi için söylediği gibi. `ContentType.NewPassword` ise seçilmekte olan bir şifredir.
- `style: TextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alan, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze kalır, ekran okuyucuya okunmaz.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `SecureTextField_<tagKey>`, temizleme düğmesi `SecureTextFieldClear_<tagKey>`, metnini gösteren düğme `SecureTextFieldReveal_<tagKey>` diye etiketlenir. Alan odağı aldığını, temizlendiğini ve metninin gösterildiğini ya da gizlendiğini bildirir, metnini asla.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.

### PantrixSecureTextField

`import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSecureTextField(
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
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı güvenli metin alanı: metni, hatası ve adı `field`'dan gelir.

Form alanının değeri ile ekrandaki metin iki yönde de birbirini izler: yazmak form alanını değiştirir, form alanında kodla yapılan bir değişiklik de, örneğin bir sıfırlama, ekrandaki metni değiştirir. Odak metin alanından ve düğmelerinden çıkınca form alanı dokunulmuş sayılır ve denetlenir: bir hata ilk kez o zaman görünür. Alan hatadayken hatanın mesajı `supportingText`'in yerine geçer. Alanın kimliği otomasyon anahtarıdır: `SecureTextField_<id>`. Form, bu alan hatadayken gönderilirse odağı buraya yollayabilir.

Parametreler:

- `field: FormField<String>`: Metin alanının gösterdiği ve değiştirdiği form alanı.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilirse klavyenin eylem tuşu formu, forma kayıtlı düğme üzerinden gönderir. `Next` ya da `Previous` eylemi odağı her zamanki gibi taşır. Eylem adlandırmayan bir alan `ImeAction.Done` alır, çünkü varsayılan eylem hiçbir işleyiciye ulaşmaz. Çağıranın kendi `onKeyboardAction`'ı gönderimin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur.
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
