# Showcase Scaffold

Uygulamanın kabuğunun dışında duran bir ekran: giriş, kayıt, şifre sıfırlama, bir davet, bir karşılama, bulunamayan bir sayfa. Bir yanda vitrin durur, bir resim, bir söz ya da slaytlar; öbür yanda form. Dar bir yerde yalnızca form kalır. Bu sayfadaki ekranlar kenarlı bir yüzeyin içindedir; kartın pencere seçicisiyle aynı ekranın dar ve geniş hâli görülür.

- `PantrixShowcaseScaffold` (`com.pantrixui.components.container.showcase`, `com.pantrixui:components`): Uygulamanın kabuğunun dışında bir ekran, giriş ya da kayıt: bir yanda bir vitrin, öbür yanda form; dar bir yerde yalnızca form. Anahtar sözcükler: giriş, oturum aç, kayıt ol, üye ol, giriş ekranı, karşılama, bölünmüş ekran.

## Özellikler

- **Vitrin.** `showcase` scaffold `showcaseFrom` kadar genişleyince formun yanında durur, varsayılanı Expanded; `showcaseSide` hangi yanda duracağını söyler. Daha dar bir yerde hiç kurulmaz: slaytları dönmez, resimleri yüklenmez. Scaffold pencereye değil kendi genişliğine bakar.
- **Vitrinin zemini.** `showcaseBackground` vitrini kenarlarına kadar doldurur, bir resim ya da bir renk geçişi, sistem çubuklarının altına kadar; `showcase`'in tuttukları onlardan kaçınır. `scrim` zemini, üstündeki yazı okunsun diye koyulaştırır. Vitrin kendi renkleriyle çizilir (`ShowcaseScaffoldColors`).
- **Form.** `content` formdur, tarafının ortasında ve stilin form genişliğinden geniş değil. `header` üstünde durur, bir başlık; `footer` altında, bir kayıt yolu. `formLayout` üçünü tarafın yüksekliğinin ortasında bir arada ya da ayrı tutar: başlık yukarıda, alt kısım dipte.
- **Bar'lar.** `topBar` form tarafının üstünde boydan boya bir satırdır, başında logo, sonunda dil; `bottomBar` dibinde bir satır, bir telif satırı. Form aralarında kaydıkça yerlerinde kalırlar. Vitrin gösterilmediğinde her bar'ı formdan bir çizgi ayırır; içi boş bir bar yer kaplamaz. Hepsi vitrinin gösterilip gösterilmediğini bilir (`showcaseShown`): vitrinin geniş pencerede taşıdığı logo dar pencerede üst bar'ın başına geçer.
- **Çerçeve.** `ShowcaseFrame.Adaptive` ile Large'dan itibaren scaffold, `backdrop`'un ortasında bir karttır; vitrinsiz bir kart formun genişliğinde ve tuttukları kadar uzundur. Daha dar pencerede ve `ShowcaseFrame.Edge` ile her genişlikte pencerenin kenarlarına uzanır.
- **Katlanabilir.** Dikey bir katlanma yerinde vitrin bir yarıda, form öbür yarıdadır; ikisi katlanma yerinde buluşur. Yatay bir katlanma yerinde yalnızca form kalır.
- **Paylar ve klavye.** Scaffold kabuğun dışında durduğu için sistem çubuklarından ve ekranın kesiğinden kendisi kaçınır (`windowInsets`). Yalnızca form tarafı kayar; klavyenin üstünde biter, odak alan alan görünür kalır.
- **Hatırladıkları.** Form da vitrin de düzen ne olursa olsun tek bir yerde kurulur: bir alana yazılan, bir slaytın yeri, telefon yan çevrilince ya da pencere karta dönecek kadar genişleyince yerinde kalır. Pencere seçicide bir alana yaz ve "Dar"dan "Geniş"e geç.
- **Pencerenin başlığı, ekran okuyucu, olay ve etiketler.** `title` çizilmez: pencerenin ve sekmenin adıdır, ekran okuyucuya ekranın adıdır. Form, vitrin nerede durursa dursun önce okunur ve odak önce ona gelir. `tagKey` verilen ekran her açılışında bir `show` olayı bildirir; içine konanlar `TestScope(tagKey)` içindedir.

## Kullanım

### Sign in beside a quote

```kotlin
PantrixShowcaseScaffold(
    showcase = { Testimonial(quote) },
    title = stringResource(Res.string.sign_in),
    topBar = {
        if (!showcaseShown) AppLogo()
        Spacer(Modifier.weight(1f))
        LanguageMenu(language, onLanguageChange)
    },
    footer = { SignUpInstead(onSignUp) },
    bottomBar = { if (!showcaseShown) Copyright() },
    tagKey = "sign_in"
) {
    SignInForm(form, onSignIn)
}
```

### A card on a picture, the showcase at the end

```kotlin
PantrixShowcaseScaffold(
    showcase = { Highlights(features) },
    showcaseBackground = { Image(painterResource(Res.drawable.mountains), null, contentScale = ContentScale.Crop) },
    backdrop = { Image(painterResource(Res.drawable.mountains), null, contentScale = ContentScale.Crop) },
    showcaseSide = ShowcaseSide.End,
    scrim = ShowcaseScrim.Bottom,
    tagKey = "sign_up"
) {
    SignUpForm(form, onSignUp)
}
```

## Örnekler

### Bir yönetim panelinin girişi

Bir yönetim panelinin giriş ekranı. Vitrin lacivert ve kenardan kenaradır (`frame = ShowcaseFrame.Edge`): üstte logo, ortada bir müşterinin sözü, altta sayılar ve telif satırı. Form tarafının üst bar'ının sonunda dil menüsü durur (`topBar`); seçili dilin yanında bir işaret vardır (`PantrixMenuItem`'ın `selected`'ı). Pencere seçicide "Kısa"ya ya da "Geniş"e geç: vitrin formun yanına gelir. "Dar"da vitrin gider; logo üst bar'ın başına, telif satırı alt bar'a (`bottomBar`) geçer, ikisi de vitrinin gösterilip gösterilmediğine bakar (`showcaseShown`), ve her bar'ı formdan bir çizgi ayırır. "Giriş yap" iki alan da dolunca açılır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.showcase.ShowcaseFrame
import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = { AdminShowcase() },
        title = "Giriş",
        topBar = {
            if (!showcaseShown) Logo()
            Spacer(Modifier.weight(1f))
            LanguageMenu()
        },
        footer = { SignUpInstead() },
        bottomBar = { if (!showcaseShown) Copyright(inABar = true) },
        frame = ShowcaseFrame.Edge,
        // Örnek bir pencere değil, sayfanın içinde bir kutudur: sistem çubuklarının payı uygulamanındır.
        windowInsets = WindowInsets(0),
        colors = ShowcaseScaffoldColors(showcase = NAVY, showcaseContent = Color.White),
        tagKey = "admin_sign_in"
    ) {
        SignInForm()
    }
}

@Composable
private fun AdminShowcase() {
    Column(modifier = Modifier.fillMaxSize()) {
        Logo()
        Spacer(Modifier.weight(1f))
        PantrixText(
            text = "“Pantrix, mobil kullanıcılarımızı anlama biçimimizi değiştirdi. Edindiğimiz içgörüler, üç ayda " +
                "elde tutmayı yüzde 40 artırmamızı sağladı.”",
            style = PantrixTheme.typography.title.copy(fontStyle = FontStyle.Italic)
        )
        PantrixText(text = "— Ürün müdürü, bir oyun stüdyosu", modifier = Modifier.padding(top = 12.dp))
        Spacer(Modifier.weight(1f))
        Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
            Figure(value = "10M+", label = "İzlenen olay")
            Figure(value = "500+", label = "Etkin proje")
            // Bir yüzdenin yazılışı dile göre değişir; içinde harf olmadığı için çeviri dosyası onu bilmez.
            Figure(value = said(tr = "%99,9", en = "99.9%"), label = "Çalışma süresi")
        }
        Copyright(modifier = Modifier.padding(top = 24.dp))
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun Copyright(
    modifier: Modifier = Modifier,
    inABar: Boolean = false
) {
    PantrixText(
        text = "© 2026 Pantrix. Tüm hakları saklıdır. by @developersancho.",
        modifier = modifier,
        style = PantrixTheme.typography.footnote,
        color = if (inABar) PantrixTheme.colors.textSecondary else Color.Unspecified,
        textAlign = if (inABar) TextAlign.Center else null
    )
}

@Composable
private fun LanguageMenu() {
    var open by remember { mutableStateOf(false) }
    var language by rememberSaveable { mutableStateOf("tr") }
    PantrixMenu(
        visible = open,
        onDismissRequest = { open = false },
        anchor = {
            PantrixIconButton(
                imageVector = DemoIcons.Globe,
                contentDescription = "Dil",
                onClick = { open = true },
                tagKey = "language"
            )
        },
        alignment = PopoverAlignment.End,
        tagKey = "language"
    ) {
        PantrixMenuItem(text = "Türkçe", onClick = { language = "tr" }, tagKey = "tr", selected = language == "tr")
        PantrixMenuItem(text = "English", onClick = { language = "en" }, tagKey = "en", selected = language == "en")
    }
}

@Composable
private fun ColumnScope.SignInForm() {
    val report = LocalExampleEvents.current
    val email = rememberTextFieldState()
    val password = remember { TextFieldState() }
    var keep by rememberSaveable { mutableStateOf(false) }
    Heading(title = "Tekrar hoş geldin", line = "Devam etmek için hesabına giriş yap")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(
        state = email,
        modifier = Modifier.fillMaxWidth(),
        label = "E-posta",
        placeholder = "ad@ornek.com",
        leadingIcon = { PantrixIcon(DemoIcons.Mail, contentDescription = null) },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
        tagKey = "email"
    )
    Spacer(Modifier.height(16.dp))
    PantrixSecureTextField(
        state = password,
        modifier = Modifier.fillMaxWidth(),
        label = "Şifre",
        leadingIcon = { PantrixIcon(DemoIcons.Lock, contentDescription = null) },
        tagKey = "password"
    )
    PantrixLink(
        text = "Şifreni mi unuttun?",
        onClick = { report("Şifre sıfırlama istendi") },
        modifier = Modifier.align(Alignment.End).padding(vertical = 12.dp),
        tagKey = "forgot"
    )
    PantrixCheckbox(checked = keep, onCheckedChange = { keep = it }, label = "Beni hatırla", tagKey = "remember")
    Spacer(Modifier.height(16.dp))
    PantrixButton(
        text = "Giriş yap",
        onClick = { report("Giriş yapıldı: ${email.text}") },
        enabled = email.text.isNotEmpty() && password.text.isNotEmpty(),
        fullWidth = true,
        shape = PantrixTheme.shapes.full,
        tagKey = "sign_in"
    )
}

@Composable
private fun SignUpInstead() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        PantrixHorizontalDivider(label = "HESABIN YOK MU?")
        PantrixButton(
            text = "Kaydol",
            onClick = {},
            variant = ButtonVariant.Outline,
            fullWidth = true,
            shape = PantrixTheme.shapes.full,
            tagKey = "sign_up"
        )
    }
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val NAVY = Color(0xFF131F4B)

@Composable
private fun Figure(
    value: String,
    label: String
) {
    Column {
        PantrixText(text = value, style = PantrixTheme.typography.headline)
        PantrixText(text = label, style = PantrixTheme.typography.footnote)
    }
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `said`: İki dilde yazılmış bir metnin, uygulamanın o anki dilindeki hâli: kabuğun kendi metinleri için, ve bir örnekte, içinde harf olmadığı için çeviri dosyasının bilmediği bir yazı için, bir yüzde gibi. Metnin iki dili kullanıldığı yerde yan yana durur; bir düğmenin adını değiştiren ikisini birlikte görür.
- `DemoIcons`: Örnek uygulamanın kendi ikonları: gezinmedeki bölümler ve üst bar'daki düğmeler için. Kütüphanenin ikonları (`PantrixIcons`) bir bileşen kütüphanesinin onlarsız yapamayacağı kadardır; bir uygulamanın ev, ızgara ya da ayar ikonu kendisinindir.
- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Slaytlı bir giriş

Vitrinde dönen slaytlar (`PantrixCarousel`): her biri bir başlık ve bir cümle. `showcaseFrom = WindowWidthClass.Medium` ile vitrin 600 dp'den itibaren görünür, "Orta"da da. "Kitap"ta vitrin bir yarıda, form öbür yarıdadır ve katlanma yerinde buluşurlar; "Masa"da yalnızca form kalır. "Dar"da vitrin hiç kurulmaz: slaytları dönmez.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = { Highlights() },
        title = "Giriş",
        header = { Logo() },
        showcaseFrom = WindowWidthClass.Medium,
        windowInsets = WindowInsets(0),
        tagKey = "slides_sign_in"
    ) {
        ShortSignIn()
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun Highlights() {
    var page by rememberSaveable { mutableIntStateOf(0) }
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        PantrixCarousel(
            pageCount = HIGHLIGHTS.size,
            currentPage = page,
            onPageChange = { page = it },
            loop = true,
            autoAdvanceMillis = 5000,
            contentDescription = "Öne çıkanlar",
            tagKey = "highlights"
        ) { index ->
            val (title, line) = HIGHLIGHTS[index]
            Column(modifier = Modifier.fillMaxWidth().padding(24.dp)) {
                PantrixText(text = title, style = PantrixTheme.typography.headline)
                PantrixText(text = line, modifier = Modifier.padding(top = 8.dp))
            }
        }
    }
}

@Composable
private fun ColumnScope.ShortSignIn() {
    val email = rememberTextFieldState()
    val password = remember { TextFieldState() }
    Heading(title = "Giriş yap", line = "Ekibin seni bekliyor")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(state = email, modifier = Modifier.fillMaxWidth(), label = "E-posta", tagKey = "email")
    Spacer(Modifier.height(16.dp))
    PantrixSecureTextField(state = password, modifier = Modifier.fillMaxWidth(), label = "Şifre", tagKey = "password")
    Spacer(Modifier.height(24.dp))
    PantrixButton(text = "Giriş yap", onClick = {}, fullWidth = true, tagKey = "sign_in")
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp

private val HIGHLIGHTS = listOf(
    "Her platformda bir tasarım" to "Android, iOS, masaüstü ve web aynı bileşenlerle çizilir.",
    "Pencereye göre düzen" to "Ekranlar dar pencerede sadeleşir, genişledikçe açılır.",
    "Erişilebilir, baştan" to "Ekran okuyucu, klavye ve kontrast her bileşenin içinde."
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `DemoIcons`: Örnek uygulamanın kendi ikonları: gezinmedeki bölümler ve üst bar'daki düğmeler için. Kütüphanenin ikonları (`PantrixIcons`) bir bileşen kütüphanesinin onlarsız yapamayacağı kadardır; bir uygulamanın ev, ızgara ya da ayar ikonu kendisinindir.

### Bir resmin üstünde kayıt

Bir resmin üstünde kayıt. Resmin yerinde bir renk geçişi durur: vitrinin zemini (`showcaseBackground`) ve kartın arkası (`backdrop`). Vitrin sondadır (`showcaseSide = ShowcaseSide.End`); `scrim = ShowcaseScrim.Bottom` altındaki yazı okunsun diye zemini aşağıya doğru koyulaştırır. Vitrin kartın içinde kendi köşeleriyle durur (`showcaseInset`). "Geniş"te düzen bir karttır, `ShowcaseFrame.Adaptive` onu Large'dan itibaren öyle çizer; "Kısa"da kenardan kenaradır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors
import com.pantrixui.components.container.showcase.ShowcaseScaffoldStyle
import com.pantrixui.components.container.showcase.ShowcaseScrim
import com.pantrixui.components.container.showcase.ShowcaseSide
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val picture = remember { Brush.linearGradient(SUNSET) }
ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = { PictureCaption() },
        showcaseBackground = { Box(Modifier.fillMaxSize().background(picture)) },
        title = "Kaydol",
        header = { Logo() },
        footer = { SignInInstead() },
        backdrop = { Box(Modifier.fillMaxSize().background(picture)) },
        showcaseSide = ShowcaseSide.End,
        scrim = ShowcaseScrim.Bottom,
        windowInsets = WindowInsets(0),
        colors = ShowcaseScaffoldColors(showcaseContent = Color.White),
        style = ShowcaseScaffoldStyle(showcaseInset = 12.dp),
        tagKey = "sign_up"
    ) {
        SignUpForm()
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun ColumnScope.SignInInstead() {
    PantrixLink(
        text = "Hesabın var mı? Giriş yap",
        onClick = {},
        modifier = Modifier.align(Alignment.CenterHorizontally),
        tagKey = "sign_in_instead"
    )
}

@Composable
private fun PictureCaption() {
    Column(modifier = Modifier.fillMaxSize()) {
        Spacer(Modifier.weight(1f))
        PantrixText(text = "Ekibini bir araya getir", style = PantrixTheme.typography.headline)
        PantrixText(text = "Ürünün, verin ve ekibin tek bir yerde.", modifier = Modifier.padding(top = 8.dp))
    }
}

@Composable
private fun ColumnScope.SignUpForm() {
    val name = rememberTextFieldState()
    val email = rememberTextFieldState()
    val password = remember { TextFieldState() }
    Heading(title = "Hesap oluştur", line = "Birkaç adımda başla")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(state = name, modifier = Modifier.fillMaxWidth(), label = "Ad", tagKey = "name")
    Spacer(Modifier.height(16.dp))
    PantrixTextField(state = email, modifier = Modifier.fillMaxWidth(), label = "E-posta", tagKey = "email")
    Spacer(Modifier.height(16.dp))
    PantrixSecureTextField(state = password, modifier = Modifier.fillMaxWidth(), label = "Şifre", tagKey = "password")
    Spacer(Modifier.height(24.dp))
    PantrixButton(text = "Kaydol", onClick = {}, fullWidth = true, tagKey = "sign_up")
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val SUNSET = listOf(Color(0xFFF59E0B), Color(0xFFDB2777), Color(0xFF4C1D95))

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `DemoIcons`: Örnek uygulamanın kendi ikonları: gezinmedeki bölümler ve üst bar'daki düğmeler için. Kütüphanenin ikonları (`PantrixIcons`) bir bileşen kütüphanesinin onlarsız yapamayacağı kadardır; bir uygulamanın ev, ızgara ya da ayar ikonu kendisinindir.

### Şifre sıfırlama

Vitrinsiz bir ekran: yalnızca form. "Geniş"te form kendi genişliğinde bir karttır, zeminin ortasında; daha dar pencerede kenardan kenaradır. `footer` girişe dönmenin yoludur.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        title = "Şifre sıfırlama",
        header = { Logo() },
        footer = {
            PantrixLink(
                text = "Girişe dön",
                onClick = {},
                modifier = Modifier.align(Alignment.CenterHorizontally),
                tagKey = "back_to_sign_in"
            )
        },
        windowInsets = WindowInsets(0),
        tagKey = "reset"
    ) {
        ResetForm()
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun ColumnScope.ResetForm() {
    val email = rememberTextFieldState()
    var sent by rememberSaveable { mutableStateOf(false) }
    Heading(title = "Şifreni sıfırla", line = "E-posta adresine bir bağlantı gönderelim")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(state = email, modifier = Modifier.fillMaxWidth(), label = "E-posta", tagKey = "email")
    Spacer(Modifier.height(24.dp))
    PantrixButton(
        text = if (sent) "Bağlantı gönderildi" else "Bağlantıyı gönder",
        onClick = { sent = true },
        enabled = email.text.isNotEmpty() && !sent,
        fullWidth = true,
        tagKey = "send"
    )
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `DemoIcons`: Örnek uygulamanın kendi ikonları: gezinmedeki bölümler ve üst bar'daki düğmeler için. Kütüphanenin ikonları (`PantrixIcons`) bir bileşen kütüphanesinin onlarsız yapamayacağı kadardır; bir uygulamanın ev, ızgara ya da ayar ikonu kendisinindir.

### Bulunamayan bir sayfa

Bulunamayan bir sayfa, `formLayout = ShowcaseFormLayout.Spread` ile: logo yukarıda, söz tarafın ortasında, yardım bağlantısı altında ve telif satırı alt bar'da (`bottomBar`). Vitrin temanın nötr renginde büyük bir "404"tür: verilen renk temanınsa, üstündeki yazının rengi de onunla gelir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.showcase.ShowcaseFormLayout
import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = {
            PantrixText(
                text = "404",
                modifier = Modifier.align(Alignment.Center),
                style = PantrixTheme.typography.display
            )
        },
        title = "Sayfa bulunamadı",
        header = { Logo() },
        footer = { PantrixLink(text = "Yardım merkezi", onClick = {}, tagKey = "help") },
        bottomBar = { Copyright(inABar = true) },
        formLayout = ShowcaseFormLayout.Spread,
        windowInsets = WindowInsets(0),
        colors = ShowcaseScaffoldColors(showcase = PantrixTheme.colors.neutral.container),
        tagKey = "not_found"
    ) {
        PantrixText(
            text = "Aradığın sayfa yok",
            style = PantrixTheme.typography.headline,
            role = TextRole.Heading(level = 1)
        )
        PantrixText(
            text = "Adres yanlış yazılmış ya da sayfa taşınmış olabilir.",
            color = PantrixTheme.colors.textSecondary
        )
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun Copyright(
    modifier: Modifier = Modifier,
    inABar: Boolean = false
) {
    PantrixText(
        text = "© 2026 Pantrix. Tüm hakları saklıdır. by @developersancho.",
        modifier = modifier,
        style = PantrixTheme.typography.footnote,
        color = if (inABar) PantrixTheme.colors.textSecondary else Color.Unspecified,
        textAlign = if (inABar) TextAlign.Center else null
    )
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `DemoIcons`: Örnek uygulamanın kendi ikonları: gezinmedeki bölümler ve üst bar'daki düğmeler için. Kütüphanenin ikonları (`PantrixIcons`) bir bileşen kütüphanesinin onlarsız yapamayacağı kadardır; bir uygulamanın ev, ızgara ya da ayar ikonu kendisinindir.

## API

### PantrixShowcaseScaffold

`import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixShowcaseScaffold(
    modifier: Modifier = Modifier,
    showcase: (@Composable BoxScope.() -> Unit)? = null,
    showcaseBackground: (@Composable BoxScope.() -> Unit)? = null,
    title: String? = null,
    topBar: (@Composable ShowcaseBarScope.() -> Unit)? = null,
    header: (@Composable ShowcaseScaffoldScope.() -> Unit)? = null,
    footer: (@Composable ShowcaseScaffoldScope.() -> Unit)? = null,
    bottomBar: (@Composable ShowcaseBarScope.() -> Unit)? = null,
    backdrop: (@Composable BoxScope.() -> Unit)? = null,
    showcaseSide: ShowcaseSide = ShowcaseSide.Start,
    showcaseFrom: WindowWidthClass = WindowWidthClass.Expanded,
    frame: ShowcaseFrame = ShowcaseFrame.Adaptive,
    formLayout: ShowcaseFormLayout = ShowcaseFormLayout.Centered,
    scrim: ShowcaseScrim = ShowcaseScrim.None,
    windowInsets: WindowInsets = WindowInsets.systemBars.union(WindowInsets.displayCutout),
    colors: ShowcaseScaffoldColors? = null,
    style: ShowcaseScaffoldStyle? = null,
    tagKey: String? = null,
    content: @Composable ShowcaseScaffoldScope.() -> Unit
)
```

Uygulamanın kabuğunun dışında duran bir ekran: giriş, kayıt, şifre sıfırlama, bir davet, bir karşılama, bulunamayan bir sayfa. Bir yanda vitrin durur, bir resim, bir söz ya da slaytlar; öbür yanda form. Dar bir yerde yalnızca form kalır.

- **Vitrin.** `showcase`, scaffold `showcaseFrom` kadar genişleyince formun yanında, `showcaseSide`'ın söylediği tarafta durur; varsayılanı Expanded. Daha darda hiç kurulmaz: slaytları dönmez, resimleri yüklenmez. Scaffold pencereye değil kendi genişliğine bakar. `showcaseBackground` vitrini kenarlarına kadar doldurur, bir resim ya da bir renk geçişi, sistem çubuklarının altına kadar; `showcase`'in tuttukları onlardan kaçınır. `scrim` zemini üstüne yazılanın arkasında koyulaştırır. Vitrin kendi renkleriyle çizilir.

- **Form.** `content` formdur, stilin form genişliğinden geniş değil, tarafının ortasında. `header` üstünde durur, bir başlık; `footer` altında, onun yerine kaydolmanın yolu. `formLayout` üst kısmı, formu ve alt kısmı tarafın yüksekliğinin ortasında bir arada ya da ayrı tutar: üst kısım yukarıda, alt kısım dipte.

- **Bar'lar.** `topBar` form tarafının üstünde boydan boya bir satırdır, başında bir logo, sonunda bir dil; `bottomBar` dibinde boydan boya bir satır, bir telif satırı. Form aralarında kaydıkça yerlerinde kalırlar. Vitrin gösterilmediğinde her bar'ı formdan bir çizgi ayırır; içi boş bir bar yer kaplamaz. Bar'lara da formun parçalarına da vitrinin gösterilip gösterilmediği söylenir: vitrinin geniş pencerede taşıdığı logo dar pencerede üst bar'da durabilsin diye.

- **Çerçeve.** `ShowcaseFrame.Adaptive` ile Large sınıfından itibaren scaffold pencerenin ortasında, `backdrop`'un üstünde, stilinin söylediğinden geniş ve uzun olmayan bir karttır; vitrinsiz bir kart formun genişliğinde ve tuttukları kadar uzundur. Daha darda, ve `ShowcaseFrame.Edge` ile her genişlikte, pencerenin kenarlarına uzanır.

- **Katlanma.** Dikey bir katlanma yeri yeri ikiye böldüğünde, kitap gibi tutulan bir cihazda, vitrin bir yarıda, form öbür yarıdadır ve katlanma yerinde buluşurlar. Yeri enine bölen bir katlanma yeri, masaya konmuş bir cihaz, yalnızca formu bırakır.

- **Paylar.** Scaffold sistem çubuklarından ve ekranın kesiğinden `windowInsets`'in söylediği gibi kendisi kaçınır: uygulamanın kabuğunun dışında durur, orada bunu yapan başka bir şey yoktur. Yalnızca form tarafı kayar; klavyenin üstünde biter, odak alan bir alan görünür kılınır.

- **Hatırladıkları.** Form da vitrin de düzen ne olursa olsun tek bir yerde kurulur: hatırladıkları, yazılan bir adres ya da bir slaytın yeri, yer değişirken kalır; telefon yan çevrilince ya da pencere bir karta dönecek kadar genişleyince. Dar bir yerin gizlediği vitrin unutur, çünkü orada kurulmaz.

- **Pencerenin başlığı.** `title` verilen scaffold, gösterildikçe pencereye ekranın adını verir: web'de tarayıcının sekmesi, masaüstünde başlık çubuğu. Başlık çizilmez: formun kendi başlığı vardır. Bir sayfanın içeriğindeki scaffold, onun bir örneği gibi, pencerenin başlığını sayfaya bırakır.

- **Ekran okuyucu ve odak.** Vitrin nerede durursa dursun önce form okunur ve odak önce ona gelir; vitrin ondan sonra, tek bir grup olarak okunur. Başlık ekran görünür olurken onun adıdır; Android'de TalkBack onu söyler.

- **Gösterildiğini bildirir.** `tagKey`'i olan scaffold her kompozisyona girişinde temanın analitiğine bir `show` olayı bildirir.

- **Otomasyon.** Scaffold `ShowcaseScaffold_<tagKey>`, tarafları `ShowcaseScaffold_<tagKey>.Pane_form` ve `ShowcaseScaffold_<tagKey>.Pane_showcase` etiketini taşır. Uygulamanın içine koyduğu `TestScope(tagKey)` içindedir: anahtarı `sign_in` olan bir scaffold'da `sign_in` etiketli bir düğme `sign_in.Button_sign_in`'dir.

- **Okuma yönü.** Baş ve son dilin başı ve sonudur: dil sağdan sola okunuyorsa `ShowcaseSide.Start` sağdadır.

Scaffold kendisine verilen yeri alır; o yer iki yönde de sınırlı olmalıdır: pencere ya da `Modifier.fillMaxSize()`.

Parametreler:

- `modifier: Modifier`: scaffold'un modifier'ı.
- `showcase: (@Composable BoxScope.() -> Unit)?`: geniş bir yerde formun yanında duran: bir söz, bir resmin yazısı, slaytlar. Yalnızca formu olan bir ekran için null.
- `showcaseBackground: (@Composable BoxScope.() -> Unit)?`: vitrini, tuttuklarının arkasında kenarlarına kadar dolduran: bir resim ya da bir renk geçişi.
- `title: String?`: ekranın adı: pencerenin başlığı ve ekran okuyucu için ekranın adı. Çizilmez.
- `topBar: (@Composable ShowcaseBarScope.() -> Unit)?`: form tarafının üstünü boydan boya geçen satır: bir logo, bir dil, bir geri dönüş yolu.
- `header: (@Composable ShowcaseScaffoldScope.() -> Unit)?`: formun üstünde duran: bir başlık.
- `footer: (@Composable ShowcaseScaffoldScope.() -> Unit)?`: formun altında duran: içeri girmenin başka bir yolu, onun yerine kaydolmak gibi.
- `bottomBar: (@Composable ShowcaseBarScope.() -> Unit)?`: form tarafının dibini boydan boya geçen satır: bir telif satırı, koşullar.
- `backdrop: (@Composable BoxScope.() -> Unit)?`: geniş pencerede, `ShowcaseFrame.Adaptive` ile kartın üstünde durduğu: bir resim ya da bir renk geçişi.
- `showcaseSide: ShowcaseSide`: vitrinin hangi tarafta durduğu: başta ya da sonda.
- `showcaseFrom: WindowWidthClass`: vitrinin gösterildiği en dar genişlik sınıfı.
- `frame: ShowcaseFrame`: scaffold'un geniş pencerede zemininin üstünde bir kart mı olduğu, yoksa pencerenin kenarlarına mı uzandığı.
- `formLayout: ShowcaseFormLayout`: üst kısmın, formun ve alt kısmın bir arada mı yoksa ayrı mı durduğu.
- `scrim: ShowcaseScrim`: üstüne yazılan okunsun diye vitrinin zeminini koyulaştıran.
- `windowInsets: WindowInsets`: scaffold'un kaçındığı: varsayılan olarak sistem çubukları ve ekranın kesiği.
- `colors: ShowcaseScaffoldColors?`: scaffold'un boyandığı renkler, temanınkilerin üstünde.
- `style: ShowcaseScaffoldStyle?`: scaffold'un geometrisi, temanınkinin üstünde.
- `tagKey: String?`: ekranın her dilde aynı olan otomasyon anahtarı: scaffold'un ve taraflarının etiketlendiği, tuttuklarının TestScope'u ve `show` olayının ait olduğu ekran.
- `content: @Composable ShowcaseScaffoldScope.() -> Unit`: form, bir sütunda.

### ShowcaseSide

`import com.pantrixui.components.container.showcase.ShowcaseSide`, `com.pantrixui:components` içinden

```kotlin
enum class ShowcaseSide
```

Bir `PantrixShowcaseScaffold`'un vitrininin, formun yanında hangi tarafta durduğu.

Değerleri:

- `Start`: Başta: solda, dil sağdan sola okunuyorsa sağda.
- `End`: Sonda: sağda, dil sağdan sola okunuyorsa solda.

### ShowcaseFrame

`import com.pantrixui.components.container.showcase.ShowcaseFrame`, `com.pantrixui:components` içinden

```kotlin
enum class ShowcaseFrame
```

Bir `PantrixShowcaseScaffold`'un geniş pencerede bir zeminin üstünde kart olarak mı durduğu, yoksa kenarlarına mı uzandığı.

Değerleri:

- `Adaptive`: Large sınıfından itibaren zeminin ortasında, stilinin söylediğinden geniş ve uzun olmayan bir kart; daha darda pencerenin kenarlarına uzanır.
- `Edge`: Her genişlikte pencerenin kenarlarına uzanır.

### ShowcaseFormLayout

`import com.pantrixui.components.container.showcase.ShowcaseFormLayout`, `com.pantrixui:components` içinden

```kotlin
enum class ShowcaseFormLayout
```

Bir `PantrixShowcaseScaffold`'un form tarafının üst kısmını, formunu ve alt kısmını yukarıdan aşağıya nasıl dizdiği.

Değerleri:

- `Centered`: Üst kısım, form ve alt kısım bir arada, tarafın yüksekliğinin ortasında tek bir blok olarak.
- `Spread`: Üst kısım yukarıda, form ortada, alt kısım dipte.

### ShowcaseScrim

`import com.pantrixui.components.container.showcase.ShowcaseScrim`, `com.pantrixui:components` içinden

```kotlin
enum class ShowcaseScrim
```

Bir `PantrixShowcaseScaffold`'un, üstüne yazılan okunsun diye vitrininin zemininin üstüne serdiği.

Değerleri:

- `None`: Hiçbir şey: vitrinin zemini olduğu gibi görünür.
- `Bottom`: Bir resmin altına yazılan bir satırın arkasında, aşağıya doğru koyulaşan bir gölge.
- `Full`: Bir resmin herhangi bir yerine yazılanın arkasında, bütün zemini örten bir gölge.

### ShowcaseScaffoldScope

`import com.pantrixui.components.container.showcase.ShowcaseScaffoldScope`, `com.pantrixui:components` içinden

```kotlin
interface ShowcaseScaffoldScope : ColumnScope
```

Bir `PantrixShowcaseScaffold`'un form tarafının üst kısmını, formunu ve alt kısmını, her birini bir sütunda dizdiği yer.

Üyeleri:

- `showcaseShown: Boolean`: Vitrinin şu an formun yanında gösterilip gösterilmediği.

### ShowcaseBarScope

`import com.pantrixui.components.container.showcase.ShowcaseBarScope`, `com.pantrixui:components` içinden

```kotlin
interface ShowcaseBarScope : RowScope
```

Bir `PantrixShowcaseScaffold`'un form tarafındaki bir bar'ın tuttuklarını dizdiği yer: tarafı boydan boya geçen bir satır, parçaları birbirinden biraz ayrı ve birlikte ortasında; ağırlığı olan bir parça ötekileri uçlara iter.

Üyeleri:

- `showcaseShown: Boolean`: Vitrinin şu an formun yanında gösterilip gösterilmediği. Vitrinin geniş pencerede taşıdığı bir logo ya da satır, vitrin gösterilmediğinde bir bar'a geçer: logo üst bar'ın başına, telif satırı alt bar'a.

### ShowcaseScaffoldStyle

`import com.pantrixui.components.container.showcase.ShowcaseScaffoldStyle`, `com.pantrixui:components` içinden

```kotlin
class ShowcaseScaffoldStyle(
    public val showcaseShare: Float = Float.NaN,
    public val formMaxWidth: Dp = Dp.Unspecified,
    public val formPadding: Dp = Dp.Unspecified,
    public val sectionGap: Dp = Dp.Unspecified,
    public val showcasePadding: Dp = Dp.Unspecified,
    public val showcaseInset: Dp = Dp.Unspecified,
    public val showcaseShape: ShapeSpec = ShapeSpec.Unspecified,
    public val cardMaxWidth: Dp = Dp.Unspecified,
    public val cardMaxHeight: Dp = Dp.Unspecified,
    public val cardMargin: Dp = Dp.Unspecified,
    public val cardShape: ShapeSpec = ShapeSpec.Unspecified,
    public val cardElevation: Dp = Dp.Unspecified,
    public val barPadding: Dp = Dp.Unspecified
) : PantrixStyle<ShowcaseScaffoldStyle>
```

`PantrixShowcaseScaffold`'un geometrisi: yerin vitrinle form arasında nasıl paylaşıldığı, formun ne kadar geniş olduğu, her tarafın içindeki boşluklar ve geniş pencerede durduğu kart.

Boşluklar yoğunluğa uyar; genişlikler, köşeler ve gölge uymaz. Renkleri stilinin parçası değildir: onlar `ShowcaseScaffoldColors`'tır.

Parametreler:

- `showcaseShare: Float`: Vitrinin formun yanında yerin ne kadarını aldığı, sıfırdan çok ve birden az: her platformda yarısı. Yeri ikiye bölen bir katlanma yeri olduğunda yeri o paylaştırır.
- `formMaxWidth: Dp`: Formun, üst kısmının ve alt kısmının, taraflarının ortasında en fazla ne kadar geniş olduğu: 440dp.
- `formPadding: Dp`: Form tarafının kenarlarıyla tuttukları arasındaki boşluk: Android'de ve iOS'ta 24dp, masaüstünde ve web'de 40dp.
- `sectionGap: Dp`: Üst kısım, form ve alt kısım arasındaki boşluk: Android'de ve iOS'ta 24dp, masaüstünde ve web'de 32dp.
- `showcasePadding: Dp`: Vitrinin kenarlarıyla tuttukları arasındaki boşluk: Android'de ve iOS'ta 24dp, masaüstünde ve web'de 40dp. Vitrinin zemini kenarlarına kadar uzanır.
- `showcaseInset: Dp`: Vitrin kendi başına bir panel olarak durduğunda, tarafının içinde çevresindeki boşluk: her platformda yok, vitrin tarafının kenarlarına uzansın diye.
- `showcaseShape: ShapeSpec`: İçeriden durduğunda vitrinin köşeleri: her platformda büyük. İçeriden durmadığında içinde durduğunun köşelerini alır.
- `cardMaxWidth: Dp`: Scaffold'un geniş pencerede durduğu kartın en fazla ne kadar geniş olduğu: 1120dp.
- `cardMaxHeight: Dp`: O kartın en fazla ne kadar uzun olduğu: 760dp. Vitrinsiz bir kart formu kadar uzundur.
- `cardMargin: Dp`: O kartla pencerenin kenarları arasındaki, sistem çubuklarından sonraki boşluk: 32dp.
- `cardShape: ShapeSpec`: O kartın köşeleri: her platformda büyük.
- `cardElevation: Dp`: O kartın altındaki gölge: Android'de 2dp, iOS'ta yok, masaüstünde ve web'de 1dp.
- `barPadding: Dp`: Form tarafındaki bir bar'ın tuttuklarının üstündeki ve altındaki boşluk: Android'de ve iOS'ta 12dp, masaüstünde ve web'de 16dp.

### ShowcaseScaffoldColors

`import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors`, `com.pantrixui:components` içinden

```kotlin
data class ShowcaseScaffoldColors(
    public val showcase: Color = Color.Unspecified,
    public val showcaseContent: Color = Color.Unspecified,
    public val form: Color = Color.Unspecified,
    public val backdrop: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

`PantrixShowcaseScaffold`'un boyandığı renkler: verilen bir renk kullanılır, verilmeyen temanınkidir.

```kotlin
PantrixShowcaseScaffold(
    showcase = { Testimonial() },
    colors = ShowcaseScaffoldColors(showcase = brand.navy, showcaseContent = Color.White)
) {
    SignInForm(form)
}
```

Parametreler:

- `showcase: Color`: Vitrinin dolgusu, zemininin altında: temanın birincil rengi.
- `showcaseContent: Color`: Bir çocuğu kendi rengini vermedikçe vitrinin tuttuklarının çizildiği renk: `showcase` temanın kendi renklerinden biriyse temanın onunla eşlediği renk, değilse birincil rengin üstündeki. Temada olmayan bir dolguya içeriğinin rengi de verilmelidir.
- `form: Color`: Formun tarafı: bir kartınki gibi temanın yüzeyi.
- `backdrop: Color`: Geniş pencerede kartın üstünde durduğu, scaffold'a verilen zeminin altında: temanın arka planı.
- `scrim: Color`: Bir `ShowcaseScrim` ile vitrinin zemininin üstüne serilen gölge: temanın scrim'i.
