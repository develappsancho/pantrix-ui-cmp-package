# Carousel

Yan yana duran slaytlar, biri ekranda: öne çıkanlar, bir resim galerisi, adım adım bir tanıtım. Kaydırmak slaydı çevirir; altındaki noktalar nerede olunduğunu söyler.

Hangi slaydın ekranda olduğu ekranın durumudur: carousel'e slaydın sırası verilir (`currentPage`), kaydırma nerede bittiğini geri bildirir (`onPageChange`). Düğmeler, noktalar ve ok tuşları kendiliğinden bir şey çevirmez; istenen slaydı bildirir.

- `PantrixCarousel` (`com.pantrixui.components.data.carousel`, `com.pantrixui:components`): Yan yana slaytlar: kaydırmayla, iki düğmeyle ya da ok tuşlarıyla çevrilir, istenirse dönerek ve kendiliğinden; carousel'in nerede olduğunu söyleyen noktalarla. Anahtar sözcükler: karusel, kaydırıcı, slayt gösterisi, galeri, sayfalayıcı, kaydırma.

## Özellikler

- **Göstergeler.** Altında noktalar, bir sayaç ("2 / 4") ya da hiçbiri: `CarouselStyle.indicator`.
- **Önceki ve sonraki düğmeleri.** Platformun dokunarak kullanılmadığı yerde, masaüstünde ve masadaki tarayıcıda görünür, telefonun tarayıcısında görünmez. Belirleyen ekranın kullanıldığı işaretçidir, ekranın dokunmatik olup olmadığı değil: dokunmatik ekranlı bir dizüstünde de görünürler. `CarouselStyle.controls` onları her yerde gösterir ya da hiç göstermez.
- **Komşu slaytlar.** `peek` ile iki yandaki slaytların kenarı görünür: bir kaydırmayla gelecek olan şimdiden bellidir.
- **Dönen slaytlar.** `loop` ile sondan sonra ilki gelir.
- **Kendiliğinden ilerleme.** `autoAdvanceMillis` ile carousel kendiliğinden ilerler; okuyucu bir slaydı tutarken, fare üstündeyken ve klavye odağı içindeyken bekler. Noktaların yanındaki düğme onu durdurur ve yeniden başlatır. Hareketin azaltıldığı temada kendiliğinden ilerlemez.
- **Slaydın üstünde.** `CarouselPlacement.Overlaid` düğmeleri ve noktaları slaydın üstüne, kendi dolgusuna koyar: bir galeride yer kaplamazlar.
- **Yükseklik.** Yükseklik verilen carousel'in slaytları noktalardan kalan yeri doldurur. Verilmeyen, ekrandaki slaydın yüksekliğindedir ve bir slayttan ötekine geçerken sıçramadan değişir.
- **Klavye.** Slaytlar tek bir duraktır: ok tuşları çevirir, Home ve End başa ve sona götürür.
- **Dokunma.** Noktalar parmak için tek bir hedeftir: sol yarısı bir geri, sağ yarısı bir ileri götürür; sağdan sola düzende yarılar yer değiştirir.
- **Ekran okuyucu.** Nerede olunduğunu her değişimde söyler: "Slayt 2 / 4". Kendiliğinden ilerleyen carousel her geçişte araya girmez.

## Kullanım

### Featured products

```kotlin
var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = products.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(240.dp),
    contentDescription = stringResource(Res.string.featured),
    tagKey = "featured"
) { index ->
    ProductCard(products[index], modifier = Modifier.fillMaxSize())
}
```

### Cards whose neighbours show, counted instead of dotted

```kotlin
PantrixCarousel(
    pageCount = offers.size,
    currentPage = slide,
    onPageChange = { slide = it },
    style = CarouselStyle(peek = 24.dp, indicator = CarouselIndicator.Count),
    tagKey = "offers"
) { index ->
    OfferCard(offers[index])
}
```

### A gallery that goes round by itself, its dots and buttons over the pictures

```kotlin
PantrixCarousel(
    pageCount = pictures.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(240.dp),
    loop = true,
    autoAdvanceMillis = 6_000,
    style = CarouselStyle(placement = CarouselPlacement.Overlaid),
    tagKey = "gallery"
) { index ->
    Picture(pictures[index], modifier = Modifier.fillMaxSize())
}
```

## Örnekler

### Öne çıkanlar: noktalarla

En yalın hâli: dört slayt ve altında noktalar. Slaydın sırası ekranın durumudur; carousel onu `currentPage` ile alır ve kaydırma bittiğinde `onPageChange` ile geri bildirir. Altındaki satır aynı durumu okur.

Yükseklik carousel'e verildi (180dp): slaytlar, noktalardan kalan yeri doldurur. Masaüstünde ve masadaki tarayıcıda iki yanda önceki ve sonraki düğmeleri de görünür; telefonda, tarayıcısında da, kaydırmak yeter.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(180.dp),
    contentDescription = "Öne çıkanlar",
    tagKey = "featured"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxSize())
}
PantrixText(text = "Ekranda: ${TITLES[slide]}", color = PantrixTheme.colors.textSecondary)

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4

private val TITLES = listOf("Yeni gelenler", "Haftanın seçimi", "İndirimdekiler", "Son fırsat")
```

### Komşuları görünen kartlar, sayaçla ve düğmelerle

`peek = 24.dp` ile slaytların iki yanında komşuları görünür: bir kaydırmayla gelecek olan şimdiden bellidir. `indicator = CarouselIndicator.Count` noktaların yerine bir sayaç yazar; `controls = CarouselControls.Always` düğmeleri telefonda da gösterir.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselIndicator
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(1) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    contentDescription = "Teklifler",
    style = CarouselStyle(
        peek = 24.dp,
        indicator = CarouselIndicator.Count,
        controls = CarouselControls.Always
    ),
    tagKey = "offers"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxWidth().height(96.dp))
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

private val TITLES = listOf("Yeni gelenler", "Haftanın seçimi", "İndirimdekiler", "Son fırsat")

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4
```

### Kendi düğmesiyle ilerleyen tanıtım

Kaydırılmayan bir tanıtım: `swipeEnabled = false`, gösterge ve düğmeler de kapalı. Adımlar yalnızca "Devam" ile ilerler. Hangi adımda olunduğu ekranın kendi durumudur; düğme onu bir artırır, carousel oraya döner.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselIndicator
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var step by rememberSaveable { mutableIntStateOf(0) }
val last = STEPS.lastIndex
PantrixCarousel(
    pageCount = STEPS.size,
    currentPage = step,
    onPageChange = { step = it },
    swipeEnabled = false,
    contentDescription = "Tanıtım",
    style = CarouselStyle(indicator = CarouselIndicator.None, controls = CarouselControls.Never),
    tagKey = "introduction"
) { index ->
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        PantrixText(text = STEPS[index], modifier = Modifier.padding(PantrixTheme.spacing.lg))
    }
}
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButton(
        text = if (step == last) "Baştan" else "Devam",
        onClick = { step = if (step == last) 0 else step + 1 },
        variant = ButtonVariant.Soft,
        size = ButtonSize.Small,
        tagKey = "introduction_next"
    )
    PantrixText(text = "Adım ${step + 1} / ${STEPS.size}", color = PantrixTheme.colors.textSecondary)
}

private val STEPS = listOf(
    "Pantrix'e hoş geldin. Bu tanıtım üç adım sürer.",
    "Bileşenler her platformda aynı tasarım dilini konuşur.",
    "Hazırsın: bileşen listesine dönüp birini açabilirsin."
)
```

### Bir dolgunun üstünde

Temanın zemini olmayan bir dolgunun üstünde carousel. Renk verilmedi: dolgu, üstüne ne renkle yazıldığını söyler. Ekrandaki slaydın noktası ve düğmeler o renkte, öteki noktalar onun bir payındadır.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.color) {
    PantrixCarousel(
        pageCount = 3,
        currentPage = slide,
        onPageChange = { slide = it },
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        contentDescription = "Dolgu üstünde",
        style = CarouselStyle(controls = CarouselControls.Always),
        tagKey = "filled"
    ) { index ->
        CarouselSlide(index, modifier = Modifier.fillMaxWidth().height(72.dp))
    }
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4

private val TITLES = listOf("Yeni gelenler", "Haftanın seçimi", "İndirimdekiler", "Son fırsat")
```

### Kendiliğinden dönen galeri

Resim galerisi gibi: `loop` ile slaytlar döner, `autoAdvanceMillis` ile altı saniyede bir kendiliğinden ilerler. `placement = CarouselPlacement.Overlaid` düğmeleri ve noktaları slaydın üstüne, carousel'in kendi dolgusuna koyar (açık temada koyu, koyu temada açık); yer kaplamazlar.

Noktaların yanındaki düğme dönmeyi durdurur ve yeniden başlatır. Bir slaydı tutarken, fare üstündeyken ve klavye odağı içindeyken carousel kendiliğinden bekler.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselPlacement
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(200.dp),
    contentDescription = "Galeri",
    loop = true,
    autoAdvanceMillis = GALLERY_MILLIS,
    style = CarouselStyle(controls = CarouselControls.Always, placement = CarouselPlacement.Overlaid),
    tagKey = "gallery"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxSize())
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

private val TITLES = listOf("Yeni gelenler", "Haftanın seçimi", "İndirimdekiler", "Son fırsat")

private const val GALLERY_MILLIS = 6_000

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4
```

### Farklı yükseklikte slaytlar

Slaytların yüksekliği birbirinden farklı ve carousel'e yükseklik verilmemiş. Carousel ekrandaki slaydın yüksekliğindedir; bir slayttan ötekine geçerken yüksekliği de onunla birlikte, sıçramadan değişir. Altındaki satır bunu gösterir: slaytla birlikte aşağı ve yukarı kayar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = NOTES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    contentDescription = "Notlar",
    loop = true,
    tagKey = "notes"
) { index ->
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        PantrixText(text = NOTES[index], modifier = Modifier.padding(PantrixTheme.spacing.lg))
    }
}
PantrixText(
    text = "Bu satır, slaytların yüksekliğiyle birlikte yer değiştirir.",
    color = PantrixTheme.colors.textSecondary
)

private val NOTES = listOf(
    "Kısa bir not.",
    "Daha uzun bir not: birkaç satır sürer, çünkü anlatacak daha çok şeyi vardır. Carousel bu slayda gelirken " +
        "yüksekliği de yavaş yavaş artar; altındaki satır aşağı kayar.",
    "Orta boy bir not, iki satır kadar tutar ve öncekinden kısadır."
)
```

### Kendi renkleriyle

Kendi renkleriyle: `CarouselColors` noktaları, noktaların izini, düğmeleri ve slaytın üstündeki örtüyü boyar. Burada noktalar markanın değil başarının rengindedir; verilmeyen her renk temanınkidir.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselColors
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(160.dp),
    colors = CarouselColors(
        indicator = PantrixTheme.colors.success.color,
        indicatorTrack = PantrixTheme.colors.success.container,
        control = PantrixTheme.colors.success.color
    ),
    contentDescription = "Öne çıkanlar",
    tagKey = "green"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxSize())
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4

private val TITLES = listOf("Yeni gelenler", "Haftanın seçimi", "İndirimdekiler", "Son fırsat")
```

## API

### PantrixCarousel

`import com.pantrixui.components.data.carousel.PantrixCarousel`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCarousel(
    pageCount: Int,
    currentPage: Int,
    onPageChange: (page: Int) -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    swipeEnabled: Boolean = true,
    loop: Boolean = false,
    autoAdvanceMillis: Int = 0,
    style: CarouselStyle? = null,
    colors: CarouselColors? = null,
    tagKey: String? = null,
    page: @Composable (index: Int) -> Unit
)
```

Yan yana duran slaytlar, biri ekranda: resimler, kartlar, bir tanıtımın adımları. Kaydırmak onları çevirir. Altındakiler carousel'in nerede olduğunu söyler ve ekrana dokunamayan okuyucu için slaytları çevirir.

Hangi slaydın ekranda olduğu ekranın durumudur: carousel `currentPage`'i gösterir ve o değişince yeni slayda döner, temanın hareketi azaltılmışsa oraya hemen geçer. Kaydırma slaytları kendisi çevirir ve nerede bittiğini `onPageChange`'e bildirir. Bir düğmeye ya da bir noktaya basmak ve bir ok tuşu ise `onPageChange` ile bir slayt ister, kendiliğinden bir şey çevirmez. Çağıran, okuyucunun kaydırarak ayrıldığı slaydı tutmaya devam ederse ona bir kez bildirilir ve carousel, `currentPage` değişene kadar okuyucunun bıraktığı yerde kalır. Carousel bunun dışında kendi slaydını tutmaz: ekrana geri gelen carousel `currentPage`'dedir.

Slaytların altında her slayt için bir nokta durur. Bir stil bunun yerine slaytları sayar ya da hiçbir şey göstermez. Fareyle bir noktaya basmak o noktanın slaydını ister. Parmak için bir nokta dokunulamayacak kadar küçüktür: noktalar tek bir hedeftir, platformun dokunma hedefi büyüklüğünde. Ortalarından öncesine basmak önceki slaydı, sonrasına basmak sonraki slaydı ister. Okuyucunun ekrana dokunamadığı yerde iki düğme slaytları geri ve ileri çevirir. Carousel bir slayda giderken yapılan basış, gittiği slayttan devam eder: böylece art arda iki hızlı basış iki slayt çevirir. Slaytlar klavye odağını tek bir durak olarak alır: ok tuşları onları çevirir, sağdan sola düzende ters yönde. Home ve End ilk ve son slayda götürür. Bir düğme, çevirdiği yöndeki uca varıldığında basılamaz ve üstündeki odak slaytlara geçer. Bir ok tuşunun ekrandan götürdüğü slaydın içindeki odak da slaytlara geçer. Tab, slaytların içindekilerden yalnızca ekrandaki slaydın içindekilerde durur.

`loop` ile slaytlar döner: kaydırmayla, düğmeyle ya da ok tuşuyla sonuncudan ilkine, ilkinden geriye sonuncuya geçilir. İki düğme de hiçbir zaman bir uçta değildir.

`autoAdvanceMillis` ile carousel kendiliğinden ilerler: bir slayda geldikten bu kadar süre sonra `onPageChange` ile bir sonraki slaydı ister, sonuncudan sonra da ilkini. Okuyucu bir slaydı tutarken, fare carousel'in üstündeyken ve klavye odağı içindeyken bekler. Noktaların yanında onu durduran ve yeniden başlatan bir düğme vardır ve son sözü okuyucu bu düğmeyle söyler: durdurulan carousel yalnızca çevrilince ilerler, yeniden başlatılan carousel odak o düğmedeyken de ilerler. Temanın hareketi azaltılmışsa carousel kendiliğinden hiç ilerlemez ve bu düğme de olmaz.

Ekran okuyucuya, verilmişse carousel'in adı söylenir. Carousel'in nerede olduğu da her değiştiğinde söylenir, temanın dilinde "Slide 2 of 5" gibi. Kendiliğinden ilerleyen carousel her geçişte araya girmez, nerede olduğu okuyucu sorduğunda okunabilir. iOS'ta carousel adsız bir gruptur: oradaki ekran okuyucu bir grubun kendi adını grubun içindekilerden sonra okur.

Slaytlar, carousel'e verilen yükseklikten altındakilerin yeri çıkınca kalan kadar yüksektir. Bundan alçak bir slayt üstte durur. Yükseklik verilmezse, kayan bir sayfada olduğu gibi, carousel ekrandaki slaydın yüksekliğindedir. Bir slayttan daha yüksek ya da daha alçak bir slayda geçerken, geçiş ne kadar ilerlediyse yüksekliği de ikisinin arasında o kadar ilerlemiştir. Bir slayt carousel kadar geniştir, iki yanda stilin `peek`'i kadar eksiğiyle. Bir stil noktaları ve düğmeleri slaytların altına değil üstüne koyar, bir resim galerisindeki gibi: orada yer kaplamazlar.

Parametreler:

- `pageCount: Int`: Kaç slayt olduğu.
- `currentPage: Int`: Ekrandaki slayt, bir sayfalayıcınınki gibi sıfırdan sayılır. Uçlardan birinin ötesindeki değer en yakın slayt sayılır. `PantrixPagination` sayfalarını, yazdığı gibi, birden sayar: onun sayfası bunun bir fazlasıdır.
- `onPageChange: (page: Int) -> Unit`: Bir kaydırmanın bittiği slayt ve bir düğmenin, bir noktanın, bir tuşun ya da kendiliğinden ilerlerken carousel'in istediği slayt bildirilir.
- `modifier: Modifier`: Carousel'e uygulanır: slaytlara ve altındakilere.
- `contentDescription: String?`: Ekran okuyucu için carousel'in içinde ne olduğu: "Öne çıkan ürünler".
- `swipeEnabled: Boolean`: Kaydırmanın slaytları çevirip çevirmediği. Kendi düğmesiyle ilerleyen bir tanıtım bunu kapatır.
- `loop: Boolean`: Slaytların dönüp dönmediği: sonuncudan ilkine geçilir. Tek slaytlı bir carousel'in gidecek yeri yoktur.
- `autoAdvanceMillis: Int`: Carousel'in kendiliğinden sonrakine geçmeden önce bir slaytta ne kadar kaldığı; yalnızca okuyucusunun çevirdiği bir carousel için varsayılan 0. Bir slaydı okumaya yetecek kadar uzun verilir: beş saniye ya da daha fazla.
- `style: CarouselStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: CarouselColors?`: Bu çağrının, slaytların altındakiler için kendi renkleri. Yalnızca verdiği renkler değişir.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar: carousel'in etiketi `Carousel_<tagKey>` olur ve parçaları onun içinde adlandırılır: klavye odağını alan `Carousel_<tagKey>.Slides_view`, `.Page_<index>`, `.Control_previous`, `.Control_next`, `.Control_pause` ve `.Indicator_position`. Slaytların döndüğü ve komşu slaytların göründüğü yerde iki slaytlı bir carousel'de aynı slayt iki yanda birden durur: aynı etiketle iki kez.
- `page: @Composable (index: Int) -> Unit`: Sırasına göre bir slayt.

### CarouselStyle

`import com.pantrixui.components.data.carousel.CarouselStyle`, `com.pantrixui:components` içinden

```kotlin
class CarouselStyle(
    public val pageSpacing: Dp = Dp.Unspecified,
    public val peek: Dp = Dp.Unspecified,
    public val indicatorSize: Dp = Dp.Unspecified,
    public val indicatorGap: Dp = Dp.Unspecified,
    public val indicatorSpacing: Dp = Dp.Unspecified,
    public val indicator: CarouselIndicator? = null,
    public val controls: CarouselControls? = null,
    public val placement: CarouselPlacement? = null
) : PantrixStyle<CarouselStyle>
```

`PantrixCarousel`'in geometrisi ve slaytlarının altında ne gösterdiği. Her platformda aynıdır: düğmeler platforma göre değil, okuyucunun parmakla mı fareyle mi kullandığına göre gelir ve gider. Boşluklar yoğunlukla ölçeklenir, nokta ölçeklenmez.

Parametreler:

- `pageSpacing: Dp`: İki slaydın arasındaki boşluk. Bir slayt yerini sonrakine bırakırken ve komşuları `peek` ile görünen bir slaydın yanında görünür.
- `peek: Dp`: Ekrandaki slaydın iki yanında bırakılan yer: komşuları bu yerde görünür.
- `indicatorSize: Dp`: Göstergenin bir noktası.
- `indicatorGap: Dp`: İki noktanın arası.
- `indicatorSpacing: Dp`: Slaytlarla altındakilerin arası. Altındakiler slaytların üstünde duruyorsa onlarla slaytların kenarlarının arası.
- `indicator: CarouselIndicator?`: Carousel'in nerede olduğunu neyin söylediği.
- `controls: CarouselControls?`: İki düğmenin nerede gösterildiği.
- `placement: CarouselPlacement?`: Bunların slaytların altında mı, üstünde mi durduğu.

### CarouselIndicator

`import com.pantrixui.components.data.carousel.CarouselIndicator`, `com.pantrixui:components` içinden

```kotlin
enum class CarouselIndicator
```

Bir carousel'in nerede olduğunu slaytlarının altında neyin söylediği.

Değerleri:

- `Dots`: Her slayt için bir nokta, ekrandaki slaydınki markanın renginde. Bir noktaya basmak o noktanın slaydını ister. Bir nokta dizisinin bir bakışta söyleyebileceğinden çok slayt varsa, yani ondan fazlaysa, slaytlar noktalar yerine `Count`'taki gibi sayılır.
- `Count`: Slaydın numarası ve kaç slayt olduğu, `3 / 12` gibi.
- `None`: Hiçbir şey. Nerede olunduğunu slaytlar kendisi söyler ya da çağıranın yanlarına koyduğu şey söyler.

### CarouselControls

`import com.pantrixui.components.data.carousel.CarouselControls`, `com.pantrixui:components` içinden

```kotlin
enum class CarouselControls
```

Bir carousel'in iki düğmesini nerede gösterdiği. Bu düğmeler onu bir slayt geri ve bir slayt ileri çevirir.

Değerleri:

- `Always`: Her platformda.
- `WithoutTouch`: Platformun dokunarak kullanılmadığı yerde, `PantrixTheme.platform.isTouch`'ın söylediği gibi: farede kaydırma yoktur, slaytlar düğmelerle çevrilir. Belirleyen ekranın kullanıldığı işaretçidir, ekranın dokunmatik olup olmadığı değil: dokunmatik ekranlı bir dizüstü de düğmeleri gösterir.
- `Never`: Hiçbir yerde: slaytlar kaydırmayla, ok tuşlarıyla ve çağıranın yanlarına koyduğu şeyle çevrilir.

### CarouselPlacement

`import com.pantrixui.components.data.carousel.CarouselPlacement`, `com.pantrixui:components` içinden

```kotlin
enum class CarouselPlacement
```

Carousel'in nerede olduğunu söyleyen şeyin ve düğmelerinin nerede durduğu.

Değerleri:

- `Below`: Slaytların altında, kendi satırlarında.
- `Overlaid`: Slaytların üstünde, bir resim galerisindeki gibi: iki düğme slaytların iki yanında, yüksekliğin ortasında durur, carousel'in nerede olduğunu söyleyen şey de slaytların dibinde. Her biri carousel'in kendi dolgusunun üstünde durur, böylece slayt ne gösterirse göstersin okunur. Hiçbiri yer kaplamaz: carousel slaytları kadar yüksektir.

### CarouselColors

`import com.pantrixui.components.data.carousel.CarouselColors`, `com.pantrixui:components` içinden

```kotlin
data class CarouselColors(
    public val indicator: Color = Color.Unspecified,
    public val indicatorTrack: Color = Color.Unspecified,
    public val control: Color = Color.Unspecified,
    public val overlay: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir carousel için `PantrixCarousel`'in slaytlarının altında neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki olarak kalır. Slaytlar çağıranın kendisinindir.

```kotlin
PantrixCarousel(…, colors = CarouselColors(indicator = PantrixTheme.colors.success.color))
```

Carousel'in kendi dolgusu yoktur, arkasında ne varsa onun üstünde durur. Bir dolgu, üstüne ne renkle yazıldığını söyler: bir dolgunun üstünde ekrandaki slaydın noktası ve düğmeler o renkle, öteki noktalar onun bir payıyla çizilir. Markanın rengi ve temanın kenar rengi temanın kendi zeminleri içindir. Temanın devre dışı rengi de öyledir: çevirdiği yöndeki uca varılmış bir düğme temanın zeminlerinde o renkle çizilir, bir dolgunun üstünde ve düğmelere renk verildiğinde ise düğmelerin renginin bir payıyla.

Bir stil onları slaytların üstüne koyduğunda noktaların ve düğmelerin kendi dolgusu olur: `overlay`. Her dolguda olduğu gibi, onun üstünde okunan renkle çizilirler.

Parametreler:

- `indicator: Color`: Ekrandaki slaydın noktası. `primary` rolünün `color`'ı.
- `indicatorTrack: Color`: Öteki slaytların noktaları. Temanın `borderStrong`'u: bir kontrolün kendi işareti gibi zeminden ayırt edilir.
- `control: Color`: Düğmeler. Temanın `onSurface`'ı, bir ikonun rengi.
- `overlay: Color`: Slaytların üstünde durduklarında noktaların ve her düğmenin arkasındaki dolgu. Temanın `onSurface`'ı: temanın zeminlerinin ters tonu, slayt arkasından görünsün diye saydamlaştırılmış. Buraya temanın rol renklerinden biri verilirse, üstüne yazılanlar için temanın onunla eşleştirdiği renk de gelir.
