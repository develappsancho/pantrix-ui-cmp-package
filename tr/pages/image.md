# Image

Bir resim: bir fotoğraf, bir çizim, bir logo. `PantrixIcon`'dan farkı renklerdir: ikon bulunduğu yerin tek rengine boyanır, resim kendi renklerini korur.

Resmi kendisi yüklemez: hazır bir `Painter`, bir `ImageVector` ya da bir `ImageBitmap` alır.

- `PantrixImage` (`com.pantrixui.components.elements.image`, `com.pantrixui:components`): Kendi renkleriyle bir resim: fotoğraf, çizim ya da logo; bir içerik açıklaması verilmedikçe süs sayılır. Anahtar sözcükler: resim, görsel, fotoğraf, çizim, logo, bitmap.

## Özellikler

- **Üç kaynak.** Bir `Painter`, bir `ImageVector` ya da bir `ImageBitmap`: her biri için bir `PantrixImage` vardır, öteki parametreleri aynıdır.
- **Kendi renkleri.** Resim çevresindeki içerik rengine boyanmaz. Renklerini yalnızca `colorFilter` değiştirir.
- **Anlatan ya da süsleyen.** `contentDescription` resmi ekran okuyucuya anlatır. Süs olan resim bunu `contentDescription = null` ile söyler ve okuyucudan gizlenir.
- **Boyut.** Boyutu `modifier` verir. Verilmezse resim kaynağının kendi boyutundadır.
- **Sığdırma.** `contentScale` resmin kendisine verilen alana nasıl sığacağını söyler. Varsayılanı `Fit`'tir: resmin tamamı, oranı korunarak görünür.
- **Hizalama.** `alignment` resmin alanın neresinde duracağını söyler; varsayılanı ortasıdır.
- **Saydamlık.** `alpha` resmi soluk çizer.
- **Örnekleme.** `ImageBitmap` alan biçimde `filterQuality`, bitmap kendi boyutundan büyük ya da küçük çizilirken nasıl örnekleneceğini söyler.
- **Otomasyon.** Resim yalnızca `tagKey` verildiğinde bir test etiketi taşır: `tagKey = "logo"` için `Image_logo`.

## Kullanım

### An illustration that says something

```kotlin
PantrixImage(
    painter = painterResource(Res.drawable.empty_inbox),
    contentDescription = stringResource(Res.string.empty_inbox_illustration),
    modifier = Modifier.fillMaxWidth(),
    contentScale = ContentScale.FillWidth
)
```

### A decorative background

```kotlin
PantrixImage(
    painter = painterResource(Res.drawable.header_pattern),
    modifier = Modifier.fillMaxSize(),
    contentScale = ContentScale.Crop
)
```

## Örnekler

### Bir resim

En yalın hâli: bir `Painter` ve bir boyut. Resim kendi renkleriyle çizilir ve verilen alana oranını koruyarak sığar.

Açıklama verilmedi: bu resim süstür, ekran okuyucudan gizlenir.

```kotlin
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixImage(
    painter = painterResource(Res.drawable.compose_multiplatform),
    modifier = Modifier.size(96.dp),
    contentDescription = "Compose Multiplatform logosu"
)
```

### Kendi boyutunda

Boyut verilmeyen resim kaynağının kendi boyutundadır: bu çizim 450dp'lik bir karedir. Bulunduğu yer daha darsa oranını koruyarak oraya sığar.

Düğmeye bas: resim görünür; yeniden basınca gizlenir.

```kotlin
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

var showContent by remember { mutableStateOf(false) }
PantrixButton(
    text = if (showContent) "Resmi gizle" else "Resmi göster",
    onClick = { showContent = !showContent },
    tagKey = "toggle_image"
)
AnimatedVisibility(showContent) {
    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
        PantrixImage(
            painter = painterResource(Res.drawable.compose_multiplatform),
            contentDescription = "Compose Multiplatform logosu",
            tagKey = "compose_logo"
        )
    }
}
```

### Anlatan resim ve süs

`contentDescription` resmi ekran okuyucuya anlatır: soldaki resim "Compose Multiplatform logosu" diye okunur. Sağdakinin açıklaması `null`: süs olduğunu söyler ve ekran okuyucudan gizlenir. Bir şey anlatan resme açıklama verilir, yalnızca süsleyen resme `null`.

Resim yalnızca `tagKey` verildiğinde bir test etiketi taşır: soldakinin etiketi `Image_logo`'dur, sağdakinin etiketi yoktur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.size(64.dp),
        contentDescription = "Compose Multiplatform logosu",
        tagKey = "logo"
    )
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.size(64.dp),
        contentDescription = null
    )
}
```

### Sığdırma

`contentScale` resmin kendisine verilen alana nasıl sığacağını söyler. Üç alan aynı boyda, 120'ye 72 dp; resim karedir.

`Fit` (varsayılan) resmin tamamını gösterir, yanlarda boşluk kalır. `Crop` alanı doldurur, taşan üstü ve altı kesilir. `FillBounds` alanı doldurmak için resmi gerer, oranı bozulur.

Öteki değerler de verilebilir: `Inside` yalnızca alandan büyük bir resmi küçültür, `None` resmi hiç ölçeklemez.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    listOf(
        "Fit" to ContentScale.Fit,
        "Crop" to ContentScale.Crop,
        "FillBounds" to ContentScale.FillBounds
    ).forEach { (name, scale) ->
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixImage(
                painter = painterResource(Res.drawable.compose_multiplatform),
                modifier = Modifier
                    .size(width = 120.dp, height = 72.dp)
                    .background(PantrixTheme.colors.neutral.container),
                contentScale = scale,
                contentDescription = null
            )
            PantrixText(
                text = name,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### Hizalama

`alignment` resmin alanın neresinde duracağını söyler; varsayılanı ortasıdır. Burada resim alana `Fit` ile sığıyor ve yanlarda yer kalıyor: `CenterStart` resmi satırın başladığı yana, `CenterEnd` bittiği yana yaslar.

`Crop` ile kırpılan bir resimde `alignment` hangi parçanın görüneceğini seçer.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    listOf(
        "CenterStart" to Alignment.CenterStart,
        "Center" to Alignment.Center,
        "CenterEnd" to Alignment.CenterEnd
    ).forEach { (name, alignment) ->
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixImage(
                painter = painterResource(Res.drawable.compose_multiplatform),
                modifier = Modifier
                    .size(width = 120.dp, height = 72.dp)
                    .background(PantrixTheme.colors.neutral.container),
                alignment = alignment,
                contentDescription = null
            )
            PantrixText(
                text = name,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### Renk süzgeci ve saydamlık

Resim kendi renklerini korur; onları `colorFilter` değiştirir. Sırayla: resmin kendisi, `ColorFilter.tint` ile tek bir renge boyanmış hâli, doygunluğu sıfıra indiren bir renk matrisiyle gri tonlu hâli ve `alpha = 0.4f` ile soluk hâli.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.ColorMatrix
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

val painter = painterResource(Res.drawable.compose_multiplatform)
val grayscale = remember { ColorFilter.colorMatrix(ColorMatrix().apply { setToSaturation(0f) }) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixImage(painter = painter, modifier = Modifier.size(64.dp), contentDescription = null)
    PantrixImage(
        painter = painter,
        modifier = Modifier.size(64.dp),
        colorFilter = ColorFilter.tint(PantrixTheme.colors.textSecondary),
        contentDescription = null
    )
    PantrixImage(painter = painter, modifier = Modifier.size(64.dp), colorFilter = grayscale, contentDescription = null)
    PantrixImage(painter = painter, modifier = Modifier.size(64.dp), alpha = 0.4f, contentDescription = null)
}
```

### Bir vektörden: ikonla farkı

İkinci biçim bir `ImageVector` alır ve vektörün kendi renklerini çizer: ilk resim çok renkli bir çizim.

`PantrixIcons.Star` siyah çizilmiş bir ikondur. `PantrixImage` onu olduğu gibi, siyah çizer; koyu temada zeminden zor ayrılır. Yanındaki `PantrixIcon` aynı vektörü bulunduğu yerin içerik rengine boyar. Tek renkli bir işaret `PantrixIcon` ile, kendi renkleri olan bir çizim `PantrixImage` ile çizilir; bir resmi boyamak gerekirse `colorFilter` verilir, sondaki gibi.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.vectorResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixImage(
        imageVector = vectorResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.size(48.dp),
        contentDescription = "Compose Multiplatform logosu"
    )
    PantrixImage(
        imageVector = PantrixIcons.Star,
        modifier = Modifier.size(48.dp),
        contentDescription = "Yıldız, resim olarak",
        tagKey = "star_image"
    )
    PantrixIcon(
        imageVector = PantrixIcons.Star,
        contentDescription = "Yıldız, ikon olarak",
        size = 48.dp,
        tagKey = "star_icon"
    )
    PantrixImage(
        imageVector = PantrixIcons.Star,
        modifier = Modifier.size(48.dp),
        contentDescription = "Yıldız, boyanmış resim olarak",
        colorFilter = ColorFilter.tint(ownColors().color)
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Bir bitmap'ten ve örnekleme

Üçüncü biçim bir `ImageBitmap` alır ve kendine ait bir parametresi vardır: `filterQuality`, bitmap kendi boyutundan büyük ya da küçük çizilirken nasıl örnekleneceğini söyler.

Buradaki bitmap sekize sekiz piksellik bir dama tahtası ve 96dp'ye büyütülüyor. Soldakine `FilterQuality.None` verildi: pikseller keskin kalır. Sağdaki varsayılanda: pikseller kenarlarında birbirine karışır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.FilterQuality
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixPalette

val checkerboard = remember { imageCheckerboard() }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixImage(
        bitmap = checkerboard,
        modifier = Modifier.size(96.dp),
        contentDescription = "Dama tahtası, keskin pikseller",
        filterQuality = FilterQuality.None,
        tagKey = "checkerboard_sharp"
    )
    PantrixImage(
        bitmap = checkerboard,
        modifier = Modifier.size(96.dp),
        contentDescription = "Dama tahtası, yumuşatılmış pikseller",
        tagKey = "checkerboard_smooth"
    )
}

private fun imageCheckerboard(): ImageBitmap {
    val bitmap = ImageBitmap(width = 8, height = 8)
    val canvas = Canvas(bitmap)
    val paint = Paint()
    for (row in 0 until 8) {
        for (column in 0 until 8) {
            val dark = (row + column) % 2 == 0
            paint.color = if (dark) PantrixPalette.Violet.shade600 else PantrixPalette.Violet.shade100
            canvas.drawRect(
                left = column.toFloat(),
                top = row.toFloat(),
                right = column + 1f,
                bottom = row + 1f,
                paint = paint
            )
        }
    }
    return bitmap
}
```

### Şekil ve zemin

Resmin şekil, zemin ya da iç boşluk parametresi yoktur: üçünü de `modifier` verir. Burada `clip` alanı keser, `background` kesilen alanı boyar, `padding` resmi kenarlardan içeri alır.

Soldaki bir daire (`shapes.full`), sağdaki yuvarlak köşeli bir kare (`shapes.lg`).

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier
            .size(72.dp)
            .clip(PantrixTheme.shapes.full)
            .background(PantrixTheme.colors.neutral.container)
            .padding(PantrixTheme.spacing.md),
        contentDescription = "Compose Multiplatform logosu"
    )
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier
            .size(72.dp)
            .clip(PantrixTheme.shapes.lg)
            .background(PantrixTheme.colors.neutral.container)
            .padding(PantrixTheme.spacing.md),
        contentDescription = "Compose Multiplatform logosu"
    )
}
```

### Bir içeriğin arkasında, süs olarak

Bir başlığın arkasındaki soluk logo gibi: resim yüzeyi `fillMaxSize()` ile kaplar, `ContentScale.Crop` taşan kısmını keser, `alpha` onu yazının arkasında soluk bırakır.

Açıklaması `null`'dır: süstür, ekran okuyucu yalnızca yazıyı okur.

```kotlin
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixSurface(
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth().height(120.dp),
    color = PantrixTheme.colors.primary.container,
    shape = PantrixTheme.shapes.lg
) {
    PantrixImage(
        painter = painterResource(Res.drawable.compose_multiplatform),
        modifier = Modifier.fillMaxSize(),
        contentScale = ContentScale.Crop,
        alpha = 0.25f,
        contentDescription = null
    )
    PantrixText(
        text = "Compose Multiplatform",
        modifier = Modifier.align(Alignment.Center),
        style = PantrixTheme.typography.title
    )
}
```

## API

### PantrixImage

`import com.pantrixui.components.elements.image.PantrixImage`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixImage(
    painter: Painter,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    colorFilter: ColorFilter? = null,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    tagKey: String? = null
)
```

Bir resim: bir fotoğraf, bir çizim, bir logo. `PantrixIcon`'dan farklı olarak, `colorFilter` değiştirmedikçe kendi renklerini korur. `contentDescription` resmi ekran okuyucuya anlatır. Süs olan bir resimde null bırakılır ve resim ekran okuyucudan gizlenir.

Parametreler:

- `painter: Painter`: resim.
- `modifier: Modifier`: görselin modifier'ı: her şeyden önce boyutu.
- `contentDescription: String?`
- `colorFilter: ColorFilter?`
- `alignment: Alignment`: resmin, sınırlarını doldurmadığında bu sınırlar içinde nerede durduğu.
- `contentScale: ContentScale`: resmin sınırlarına nasıl sığdırıldığı: başka bir şey söylenmedikçe bütünüyle ve sınırların içinde.
- `alpha: Float`: resmin ne kadar opak çizildiği, 0'dan 1'e.
- `tagKey: String?`: görselin otomasyon anahtarı: görsel `Image_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.

### PantrixImage

`import com.pantrixui.components.elements.image.PantrixImage`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixImage(
    imageVector: ImageVector,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    colorFilter: ColorFilter? = null,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    tagKey: String? = null
)
```

Bir vektörden `PantrixImage`.

Parametreler:

- `imageVector: ImageVector`: resim, bir vektör.
- `modifier: Modifier`: görselin modifier'ı: her şeyden önce boyutu.
- `contentDescription: String?`: ekran okuyucunun resmin ne gösterdiğini söylediği metin, ya da süs olan bir resim için null; süs olan resim ekran okuyuculardan gizlenir.
- `colorFilter: ColorFilter?`: resmin renklerini değiştiren, ya da kendi renklerini korumak için null.
- `alignment: Alignment`: resmin, sınırlarını doldurmadığında bu sınırlar içinde nerede durduğu.
- `contentScale: ContentScale`: resmin sınırlarına nasıl sığdırıldığı: başka bir şey söylenmedikçe bütünüyle ve sınırların içinde.
- `alpha: Float`: resmin ne kadar opak çizildiği, 0'dan 1'e.
- `tagKey: String?`: görselin otomasyon anahtarı: görsel `Image_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.

### PantrixImage

`import com.pantrixui.components.elements.image.PantrixImage`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixImage(
    bitmap: ImageBitmap,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    colorFilter: ColorFilter? = null,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    filterQuality: FilterQuality = DefaultFilterQuality,
    tagKey: String? = null
)
```

Bir bitmap'ten `PantrixImage`. `filterQuality`, bitmap daha büyük ya da daha küçük çizilirken nasıl örnekleneceğini söyler.

Parametreler:

- `bitmap: ImageBitmap`: resim, bir bitmap.
- `modifier: Modifier`: görselin modifier'ı: her şeyden önce boyutu.
- `contentDescription: String?`: ekran okuyucunun resmin ne gösterdiğini söylediği metin, ya da süs olan bir resim için null; süs olan resim ekran okuyuculardan gizlenir.
- `colorFilter: ColorFilter?`: resmin renklerini değiştiren, ya da kendi renklerini korumak için null.
- `alignment: Alignment`: resmin, sınırlarını doldurmadığında bu sınırlar içinde nerede durduğu.
- `contentScale: ContentScale`: resmin sınırlarına nasıl sığdırıldığı: başka bir şey söylenmedikçe bütünüyle ve sınırların içinde.
- `alpha: Float`: resmin ne kadar opak çizildiği, 0'dan 1'e.
- `filterQuality: FilterQuality`
- `tagKey: String?`: görselin otomasyon anahtarı: görsel `Image_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.
