# Giriş ekranı

Örnek vaka: solda tanıtım, sağda giriş formu olan bir ekran. Dar pencerede tanıtım gider, form kalır.

Bu bir ekrandır, o yüzden pencereye sorar (`PantrixTheme.window`). En önemli kuralı: form tek bir yerden çağrılır. Tanıtım `if` ile gelir ve gider, form ise her düzende aynı `SignInForm()` çağrısıdır. Bu yüzden e-posta alanına yazılan metin, pencere daralıp genişlerken ya da telefon çevrilirken yerinde kalır. Formu dar ve geniş düzen için iki ayrı yerden çağırmak, sınıf değişince yazılanı silerdi.

Gerçek bir uygulamada bu ekran pencerenin tamamını kaplar; burada sayfanın içinde, bir çerçevede durur. Kütüphane bu düzeni hazır da verir: `PantrixShowcaseScaffold` ("Showcase Scaffold" sayfası). Bu sayfa onu pencereye sorarak elle kurmayı gösterir.

## Özellikler

- **Tanıtım yalnızca yer varken.** `if (!window.isNarrow) MarketingPanel()`: tanıtım yalnızca dar olmayan pencerede gösterilir. Gelip giden, hatırlayacak bir şeyi olmayan bir ek için düz `if` yeter.
- **Form tek yerden.** Compose bir composable'ın hatırladıklarını çağrıldığı yere bağlar: form hep aynı yerden çağrıldığı için tanıtım gelip giderken durumu durur.
- **Sınıfa göre pay ve yazı stili.** `window.byWidth(compact = 1f, large = 1.25f)`: tanıtımın payı `Large`'dan itibaren büyür. Başlığının yazı stili de sınıfa göre seçilen bir değerdir.
- **İç boşluk.** `responsive(compact = 16.dp, medium = 24.dp, large = 40.dp)`: iç boşluk sınıfa göre artar. Pencerenin kendisine ihtiyacı olmayan composable'da `byWidth`'in kısa yazımıdır.
- **Kısa pencere.** Tanıtımın maddeleri `if (!window.isShort)` içindedir: `BENEFITS` listesinin her maddesi için bir `Benefit(...)`. Yatay telefonda genişlik yeter ama yükseklik yetmez; maddelere yer yoktur, başlık kalır.
- **Yüksekliğe göre değer.** `window.byHeight(compact = 300.dp, medium = 460.dp)`: ekranın yüksekliği kısa pencerede küçülür, formun satır aralığı da.
- **Form genişlemez.** `widthIn(max = 360.dp)`: form en çok 360 dp'dir ve kendisine ayrılan yerin ortasında durur; yer kısaysa kendi içinde kayar. Her şey sınıfla çözülmez.
- **Kaydedilen durum.** Formun alanları `rememberSaveable` ile hatırlar: Android Activity'yi yeniden yarattığında da yazılan, çağrı yeri aynı kaldığı için geri gelir.

## Örnekler

### Tanıtım ve giriş formu

Ekranın tamamı, bir çerçevede. Dar pencerede yalnızca form vardır. Dar olmayan pencerede tanıtım formun yanına gelir: `Large`'a kadar formla eşit payda, `Large`'dan itibaren daha geniş ve daha büyük bir başlıkla. Kısa pencerede, yani yatay tutulan telefonda, tanıtımın maddeleri gider ve başlık kalır; çerçeve alçalır, formun satırları birbirine yaklaşır.

E-postanı yaz, sonra pencereyi daralt ya da telefonu çevir: tanıtım gelip gider, yazdığın kalır.

Karttaki pencere seçicisi aynı şeyi pencereye dokunmadan gösterir: örneğe sabit bir pencere verir. "Dar" 360 × 800 dp'lik bir telefon, "Orta" 768 × 1024 dp'lik dik bir tablet, "Kısa" 880 × 400 dp'lik yatay bir telefon, "Geniş" 1280 × 800 dp'lik bir masaüstü penceresidir; "Gerçek" uygulamanın penceresidir. Çerçeve seçilen pencerenin genişliğinde kurulur: "Dar" geniş bir ekranda da telefon genişliğindedir. İki panelli düzen dar bir yere sıkıştırılmaz. Karta sığmayan pencere, masaüstünde "Geniş" gibi, küçültülerek bütünüyle çizilir ve seçicinin altındaki satır ölçeği söyler; %60'tan küçük çizilmesi gerekiyorsa, telefonda "Geniş" gibi, kendi boyutunda kalır ve yana kayar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.adaptive.byHeight
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.adaptive.responsive
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
SignInScreen(
    modifier = Modifier
        .fillMaxWidth()
        // Çerçevenin yüksekliği de pencereye uyar: yatay telefonda sayfanın kendisi kısadır.
        .height(window.byHeight(compact = 300.dp, medium = 460.dp))
)

@Composable
internal fun SignInScreen(modifier: Modifier = Modifier) {
    val window = PantrixTheme.window
    PantrixSurface(
        modifier = modifier,
        shape = PantrixTheme.shapes.lg,
        border = PantrixTheme.colors.border
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // Gelip giden, hatırlayacak bir şeyi olmayan bir ek: düz `if` yeter.
            if (!window.isNarrow) {
                MarketingPanel(
                    modifier = Modifier
                        // Sınıfa göre bir değer: Compact'tan Expanded'a kadar formla eşit pay, Large'dan itibaren
                        // daha geniş. Medium ve Expanded verilmedi, Compact'ın değerini alırlar.
                        .weight(window.byWidth(compact = 1f, large = 1.25f))
                        .fillMaxHeight()
                )
            }
            SignInForm(modifier = Modifier.weight(1f).fillMaxHeight())
        }
    }
}

@Composable
private fun MarketingPanel(modifier: Modifier = Modifier) {
    val window = PantrixTheme.window
    val typography = PantrixTheme.typography
    // Zemini markanın kabı olan bir yüzey, içindeki yazıya o zeminle eşleşen rengi kendisi verir.
    PantrixSurface(
        modifier = modifier,
        color = PantrixTheme.colors.primary.container,
        shape = PantrixTheme.shapes.none
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                // Pencere elde olmadan tek bir değer: `responsive`, temanın penceresinin `byWidth`'idir.
                .padding(responsive(compact = 16.dp, medium = 24.dp, large = 40.dp)),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md, Alignment.CenterVertically)
        ) {
            PantrixText(
                text = "Ekibinle aynı sayfada ol",
                // Yazı stili de sınıfa göre seçilen bir değerdir.
                style = window.byWidth(compact = typography.title, large = typography.headline),
                tagKey = "marketing_title"
            )
            PantrixText(text = "Siparişleri, stokları ve müşterileri tek yerden yönet.")
            // Kısa pencere, yani yatay tutulan telefon: genişlik yeter ama yükseklik yetmez. Maddeler gider.
            if (!window.isShort) {
                BENEFITS.forEachIndexed { index, benefit -> Benefit(text = benefit, tagKey = "benefit_$index") }
            }
        }
    }
}

@Composable
private fun Benefit(
    text: String,
    tagKey: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null)
        PantrixText(text = text, tagKey = tagKey)
    }
}

@Composable
private fun SignInForm(modifier: Modifier = Modifier) {
    val window = PantrixTheme.window
    val spacing = PantrixTheme.spacing
    var email by rememberSaveable { mutableStateOf("") }
    val password = remember { TextFieldState() }
    var keepSignedIn by rememberSaveable { mutableStateOf(true) }
    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        Column(
            modifier = Modifier
                .widthIn(max = 360.dp)
                .verticalScroll(rememberScrollState())
                .padding(responsive(compact = 16.dp, medium = 24.dp)),
            // Yüksekliğe göre bir değer: kısa pencerede satırlar birbirine yaklaşır.
            verticalArrangement = Arrangement.spacedBy(window.byHeight(compact = spacing.sm, medium = spacing.md))
        ) {
            PantrixText(text = "Giriş yap", style = PantrixTheme.typography.title)
            PantrixTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier.fillMaxWidth(),
                label = "E-posta",
                placeholder = "ad@ornek.com",
                tagKey = "sign_in_email"
            )
            PantrixSecureTextField(
                state = password,
                modifier = Modifier.fillMaxWidth(),
                label = "Şifre",
                tagKey = "sign_in_password"
            )
            PantrixCheckbox(
                checked = keepSignedIn,
                onCheckedChange = { keepSignedIn = it },
                label = "Beni hatırla",
                tagKey = "keep_signed_in"
            )
            PantrixButton(text = "Giriş yap", onClick = {}, fullWidth = true, tagKey = "sign_in")
            PantrixLink(text = "Şifremi unuttum", onClick = {}, tagKey = "forgot_password")
        }
    }
}

private val BENEFITS = listOf("Gerçek zamanlı stok", "Tek tıkla fatura", "Ekip içi notlar")
```

### İki yerden ve tek yerden çağrılan alan

Bu ekranın asıl dersi, tek bir alanla. Üstteki alan dar ve geniş düzen için iki ayrı yerden çağrılır; Compose bunları iki ayrı alan sayar. Alttaki her düzende aynı çağrıdır: yalnızca yanındaki tanıtım gelir ve gider.

İki alana da bir şey yaz, sonra karttaki pencere seçicisinden "Dar" ile "Geniş" arasında geç: iki yerden çağrılan alan boşalır, tek yerden çağrılan yazdığını korur. Kullanıcı için ilki, telefonu çevirdiğinde yazdığı e-postanın silinmesidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

val narrow = PantrixTheme.window.isNarrow
val spacing = PantrixTheme.spacing
// YANLIŞ: alan iki ayrı yerden çağrılıyor. Pencere sınıf değiştirince yazılan silinir.
if (narrow) {
    EmailField(label = "İki yerden çağrılan", tagKey = "two_sites_email", modifier = Modifier.fillMaxWidth())
} else {
    Row(horizontalArrangement = Arrangement.spacedBy(spacing.md), verticalAlignment = Alignment.Bottom) {
        MarketingStub(modifier = Modifier.weight(1f))
        EmailField(label = "İki yerden çağrılan", tagKey = "two_sites_email", modifier = Modifier.weight(1f))
    }
}
// DOĞRU: alan her düzende aynı çağrıdır. Gelip giden, yanındaki tanıtımdır.
Row(horizontalArrangement = Arrangement.spacedBy(spacing.md), verticalAlignment = Alignment.Bottom) {
    if (!narrow) MarketingStub(modifier = Modifier.weight(1f))
    EmailField(label = "Tek yerden çağrılan", tagKey = "one_site_email", modifier = Modifier.weight(1f))
}

@Composable
private fun EmailField(
    label: String,
    tagKey: String,
    modifier: Modifier = Modifier
) {
    var email by rememberSaveable { mutableStateOf("") }
    PantrixTextField(
        value = email,
        onValueChange = { email = it },
        modifier = modifier,
        label = label,
        tagKey = tagKey
    )
}

@Composable
private fun MarketingStub(modifier: Modifier = Modifier) {
    PantrixSurface(modifier = modifier, color = PantrixTheme.colors.primary.container) {
        PantrixText(text = "Tanıtım", modifier = Modifier.padding(PantrixTheme.spacing.md))
    }
}
```

## API

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Pencere dar mı: genişlik sınıfı `WindowWidthClass.Compact` mı. Dikey tutulan telefon böyledir. Tek panelli ve gezinmesi altta olan düzenin sorusudur.

`widthClass == WindowWidthClass.Compact` için bir addır, kod uyduğu kural gibi okunsun diye: `if (window.isNarrow) BottomBar()`. "Şu genişlikten itibaren" için sınıf karşılaştırılır: `widthClass >= Expanded`.

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isShort: Boolean
```

Pencere kısa mı: yükseklik sınıfı `WindowHeightClass.Compact` mı. Yatay tutulan telefon böyledir. Böyle bir pencere çoğu zaman geniştir, genişliğine göre Medium ya da Expanded'dır, ama bar'ları üst üste dizecek yüksekliği yoktur: ana eylem alttaki bir bar'a değil başlığa gider ve alt kenardan hiçbir şey açılmaz.

`heightClass == WindowHeightClass.Compact` için bir addır:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

Bu pencerenin genişlik sınıfı için verilen değer. Verilmeyen sınıf bir küçüğünün değerini alır, bu yüzden bir düzen yalnızca değiştiği genişlikleri yazar:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parametreler:

- `compact: T`: Compact bir pencerede, en dar sınıfta değer.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede değer; verilmezse `medium`'unki.
- `large: T`: Large bir pencerede değer; verilmezse `expanded`'ınki.
- `extraLarge: T`: ExtraLarge bir pencerede, en geniş sınıfta değer; verilmezse `large`'ınki.

### PantrixWindow.byHeight

`import com.pantrixui.foundation.adaptive.byHeight`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byHeight(
    compact: T,
    medium: T = compact,
    expanded: T = medium
): T
```

Bu pencerenin yükseklik sınıfı için verilen değer. Verilmeyen sınıf bir küçüğünün değerini alır:

```kotlin
val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
```

Parametreler:

- `compact: T`: Compact bir pencerede, en kısa sınıfta değer: yan tutulan bir telefon.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede, en uzun sınıfta değer; verilmezse `medium`'unki.

### responsive

`import com.pantrixui.foundation.adaptive.responsive`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun <T> responsive(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

Geçerli pencerenin genişlik sınıfı için verilen değer: `PantrixTheme.window`'un `byWidth`'i, tek sözcükle. Pencereye değil bir değere ihtiyacı olan composable içindir. Verilmeyen sınıf bir küçüğünün değerini alır:

```kotlin
val columns = responsive(compact = 2, medium = 4)
val cardPadding = responsive(compact = 12.dp, medium = 16.dp, large = 20.dp)
```

Sayfanın kenar boşluğu ve sütun arası elle seçilmez: `PantrixTheme.layout` onları sınıfa göre verir. Çağıran, sınıf değişince yeniden kurulur; pencere sınıfın içinde boyut değiştirirken kurulmaz. Yalnızca genişliğe bakar. Yükseklik için ve bir composable'ın dışında pencereye sorulur: `byHeight`, `byWidth`.

Parametreler:

- `compact: T`: Compact bir pencerede, en dar sınıfta değer.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede değer; verilmezse `medium`'unki.
- `large: T`: Large bir pencerede değer; verilmezse `expanded`'ınki.
- `extraLarge: T`: ExtraLarge bir pencerede, en geniş sınıfta değer; verilmezse `large`'ınki.

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixWindow
```

İçeriğin çizildiği pencere, bir düzenin bilmesi gereken hâliyle: ne kadar geniş ve ne kadar yüksek olduğu, cihazının nasıl katlandığı. `PantrixTheme` onu sağlar, `PantrixTheme.window` okur: kurulumu yoktur.

Cihaz ya da ekran değil, penceredir: bölünmüş ekranın yarısındaki, boyutu değiştirilmiş bir masaüstü penceresindeki ya da bir tarayıcı sekmesindeki uygulama o kadar geniştir. Bir düzen boyuta değil sınıfa sorar:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

Tema durduğu sürece pencere tek bir nesnedir ve değerleri sorulduğunda okunur. `widthClass` ya da `heightClass` okuyan, sınıf değişince yeniden kurulur, daha önce değil. `size` okuyan her değişimi izler: bir dönüşün her karesini, sürüklenen pencere kenarının her pikselini.

Kendi başına bir panel olan bileşen, bir scaffold ya da bir sheet, pencereye sormaz, kendisine verilen yeri ölçer: dar bir panelin içinde pencere yine geniştir. `BoxWithPantrixWindow` bir bileşene o yeri bir pencere olarak söyler.

Masaüstünde ve web'de içerik ilk kez kurulurken pencerenin henüz boyutu yoktur ve o tek kompozisyon Compact bir pencere bulur. Android ve iOS boyutu baştan söyler. Sınıf kullanıldığı yerde okunur, başta ne olduğu saklanmaz.

Üyeleri:

- `size: DpSize`: Pencerenin boyutu. Android'de sistem çubuklarıyla birlikte penceredir, web'de uygulamanın çizildiği kutu. Platform söyleyene kadar sıfırdır ya da belirtilmemiştir: sınıflar o zamana kadar Compact'tır.
- `isSizeKnown: Boolean`: Platform pencerenin boyutunu söyledi mi: hem genişliğini hem yüksekliğini.

  Android'de ve iOS'ta ilk kompozisyondan itibaren true'dur. Masaüstünde ve web'de ilk kompozisyonda false'tur: içerik orada pencerenin boyutu gelmeden bir kez kurulur. Sonraki kompozisyondan itibaren true'dur. O zamana kadar pencere iki yönde de Compact okunur, bu yüzden bir kez verilip saklanan her karar, bir başlangıç sayfası ya da hatırlanan bir seçim, bunu bekler:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  Okuyan, cevap değişince yeniden kurulur; pencere boyut değiştirirken kurulmaz.
- `widthClass: WindowWidthClass`: Pencerenin genişlik sınıfı: düzen buna göre seçilir.
- `heightClass: WindowHeightClass`: Pencerenin yükseklik sınıfı: `WindowHeightClass.Compact` yatay tutulan bir telefondur.
- `posture: WindowPosture`: Pencerenin cihazının nasıl katlandığı. Kat yeri olmayan yerde `WindowPosture.Flat`'tir.
- `verticalBar: WindowVerticalBar?`: Sistemin pencerenin bir kenarı boyunca dik duran bar'lar için ayırdığı sütun, ya da ayırmadığı yerde null: iPhone Duo'nun dış ekranı dışında her ekranda olduğu gibi. Yerleri pencerenin koordinatlarındadır: bir düzen onun kendi yanında nerede durduğunu `rememberVerticalBarInNode` ile sorar.
- `breakpoints: PantrixBreakpoints`: Bu pencerenin sınıflarının başladığı yer: pencerenin sınıflandığı sınırlar. Elle sınıflanan bir boyut da aynı sınırlara uyar, `BoxWithPantrixWindow`'un bir bileşene verilen yeri sınıflaması gibi:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

Değerleri sabit bir pencere, gerçeğinin doğru cevabı vermediği yerler için: bir düzenin belli bir boyuttaki testi ya da önizlemesi ve native bir ekranın bir parçasına gömülen Compose. Orada yer o parçanındır.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

Pikselle verilen bir `verticalBar`, sistemin sütunu olan bir ekranın, iPhone Duo'nun dış ekranının nasıl göründüğünü, sütunun olmadığı yerde çizer.

Parametreler:

- `size: DpSize`: pencerenin boyutu; genişlik ve yükseklik sınıfları ondan gelir.
- `posture: WindowPosture`: pencerenin cihazının nasıl katlandığı: bir kat verilmedikçe düz, katı olmayan her cihaz gibi.
- `breakpoints: PantrixBreakpoints`: her sınıfın başladığı genişlikler ve yükseklikler: ürünün kendi sınırları yoksa Android'in pencere boyutu sınıfları.
- `verticalBar: WindowVerticalBar?`

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowWidthClass
```

Bir pencerenin ne kadar geniş olduğu, beş sınıftan biri olarak. Bir düzen bu sınıfa göre seçer: gezinmesinin biçimini, panel sayısını, bir ızgaranın sütunlarını.

Sınıflar sıralıdır, bu yüzden bir genişlikten itibaren geçerli olan kural bir karşılaştırmadır: `widthClass >= WindowWidthClass.Expanded`. Her birinin nerede başladığını `PantrixBreakpoints` söyler.

Değerleri:

- `Compact`: 600dp'den dar: dikey tutulan bir telefon, bir katlanabilirin kapak ekranı, dar bir tarayıcı penceresi.
- `Medium`: 600dp'den itibaren: açık bir katlanabilir, dikey tutulan bir tablet, bölünmüş ekran.
- `Expanded`: 840dp'den itibaren: yatay tutulan bir tablet ve yatay tutulan çoğu telefon (bkz. `WindowHeightClass.Compact`).
- `Large`: 1200dp'den itibaren: bir masaüstü penceresi, bir tarayıcı, büyük bir tablet.
- `ExtraLarge`: 1600dp'den itibaren: geniş bir masaüstü penceresi, harici bir ekran.

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowHeightClass
```

Bir pencerenin ne kadar yüksek olduğu, üç sınıftan biri olarak.

Bir düzen önce genişliğe bakar. Yükseklik, üst üste dizecek yer kalmadığını söyler: `Compact` bir pencere yatay tutulan bir telefondur, bir tablet kadar geniştir ve yüksekliği onun yarısından azdır. Orada ekran boyunca uzanan her bar ekranın yedide birini alır.

Değerleri:

- `Compact`: 480dp'den kısa: yatay tutulan bir telefon.
- `Medium`: 480dp'den itibaren: dikey tutulan çoğu telefon, yatay tutulan bir tablet.
- `Expanded`: 900dp'den itibaren: dikey tutulan bir tablet, bir masaüstü penceresi ve dikey tutulan uzun bir telefon.
